// 本地文字识别（macOS Vision，离线，不需要联网）
// 用法：ocr <图片路径>  → 输出识别结果
// 普通文本：按「从上到下、从左到右」逐行输出（同一水平线的格子拼成一行）。
// 课表表格：检测到「日期表头 + 时间列」时，按 x 坐标把格子归位，
//          直接输出「日期 时间 课名」一行一条，方便排课解析。
import Foundation
import Vision
import AppKit

let args = CommandLine.arguments
guard args.count > 1, let img = NSImage(contentsOfFile: args[1]),
      let tiff = img.tiffRepresentation, let rep = NSBitmapImageRep(data: tiff),
      let cg = rep.cgImage else {
    FileHandle.standardError.write("no image\n".data(using: .utf8)!)
    exit(2)
}

let req = VNRecognizeTextRequest()
req.recognitionLevel = .accurate
req.usesLanguageCorrection = true
req.recognitionLanguages = ["zh-Hans", "en-US"]

let handler = VNImageRequestHandler(cgImage: cg, options: [:])
do {
    try handler.perform([req])
} catch {
    FileHandle.standardError.write("ocr failed\n".data(using: .utf8)!)
    exit(3)
}

guard let obs = req.results else { exit(0) }

struct Item {
    let text: String
    let minX: CGFloat
    let maxX: CGFloat
    let midY: CGFloat   // 已翻成「从图片顶部往下」的坐标
    let h: CGFloat
}

var items: [Item] = []
for o in obs {
    guard let c = o.topCandidates(1).first else { continue }
    let bb = o.boundingBox
    items.append(Item(text: c.string, minX: bb.minX, maxX: bb.maxX, midY: 1 - bb.midY, h: bb.height))
}

items.sort { a, b in
    if abs(a.midY - b.midY) > 0.008 { return a.midY < b.midY }
    return a.minX < b.minX
}

// 按水平线聚成「行」
struct Row { let y: CGFloat; let cells: [Item] }
var rows: [Row] = []
var cur: [Item] = []
var lastY: CGFloat = -1
var lastH: CGFloat = 0
for it in items {
    let tol = max(0.008, min(0.03, max(it.h, lastH) * 0.55))
    if lastY >= 0 && abs(it.midY - lastY) > tol {
        rows.append(Row(y: lastY, cells: cur))
        cur = []
    }
    cur.append(it)
    lastY = it.midY
    lastH = it.h
}
if !cur.isEmpty { rows.append(Row(y: lastY, cells: cur)) }

// 日期正则：11月17日 / 11/17 / 2026-11-17
func isDate(_ s: String) -> Bool {
    if s.range(of: #"\d{1,2}\s*月\s*\d{1,2}\s*[日号]"#, options: .regularExpression) != nil { return true }
    if s.range(of: #"\d{1,2}\s*/\s*\d{1,2}(?!\d)"#, options: .regularExpression) != nil { return true }
    if s.range(of: #"\d{4}\s*[-\/年.]\s*\d{1,2}\s*[-\/月.]\s*\d{1,2}"#, options: .regularExpression) != nil { return true }
    return false
}
func isTime(_ s: String) -> Bool {
    if s.range(of: #"\d{1,2}\s*[:：]\s*\d{1,2}"#, options: .regularExpression) != nil { return true }
    if s.range(of: #"\d{1,2}\s*[点時时]"#, options: .regularExpression) != nil { return true }
    return false
}

// 周几：周一 / 星期三 / 礼拜天 / Mon / Tuesday
func isWeekday(_ s: String) -> Bool {
    if s.range(of: #"(周|星期|礼拜)\s*[一二三四五六日天1-7]"#, options: .regularExpression) != nil { return true }
    if s.range(of: #"(Mon|Tue|Wed|Thu|Fri|Sat|Sun)[a-z]*"#,
               options: [.regularExpression, .caseInsensitive]) != nil { return true }
    return false
}

// 表头里的「列名」：日期优先，没有日期就用周几
struct Label { let text: String; let loc: Int; let len: Int }
func extractLabels(_ s: String) -> [Label] {
    let ns = s as NSString
    var dates: [Label] = []
    var weeks: [Label] = []
    func grab(_ pattern: String, _ into: inout [Label]) {
        guard let re = try? NSRegularExpression(pattern: pattern) else { return }
        for m in re.matches(in: s, range: NSRange(location: 0, length: ns.length)) {
            if m.range.location != NSNotFound {
                into.append(Label(text: ns.substring(with: m.range), loc: m.range.location, len: m.range.length))
            }
        }
    }
    grab(#"\d{1,2}\s*月\s*\d{1,2}\s*[日号]"#, &dates)
    grab(#"\d{1,2}\s*/\s*\d{1,2}(?!\d)"#, &dates)
    grab(#"\d{4}\s*[-\/年.]\s*\d{1,2}\s*[-\/月.]\s*\d{1,2}"#, &dates)
    grab(#"(周|星期|礼拜)\s*[一二三四五六日天1-7]"#, &weeks)
    grab(#"(Mon|Tue|Wed|Thu|Fri|Sat|Sun)[a-z]*"#, &weeks)
    let picked = dates.isEmpty ? weeks : dates
    return picked.sorted { $0.loc < $1.loc }
}

// 找「表头行」：一行里有 ≥2 个日期（或周几）、且没有时间
var headerIdx = -1
for (i, r) in rows.enumerated() {
    var n = 0
    for c in r.cells {
        let labs = extractLabels(c.text)
        n += labs.count
    }
    let hasTime = r.cells.contains { isTime($0.text) }
    if n >= 2 && !hasTime { headerIdx = i; break }
}

struct Col { let label: String; let cx: CGFloat }

if headerIdx >= 0 {
    let header = rows[headerIdx]

    // 每个表头格子 → 一列（格子里粘了多个日期/周几时，按字符位置比例摊开）
    var cols: [Col] = []
    for c in header.cells {
        let labs = extractLabels(c.text)
        if labs.isEmpty { continue }
        let w = max(c.maxX - c.minX, 0.001)
        let total = max((c.text as NSString).length, 1)
        if labs.count == 1 {
            cols.append(Col(label: labs[0].text, cx: (c.minX + c.maxX) / 2))
        } else {
            for l in labs {
                let frac = CGFloat(l.loc + l.len / 2) / CGFloat(total)
                cols.append(Col(label: l.text, cx: c.minX + frac * w))
            }
        }
    }
    cols.sort { $0.cx < $1.cx }

    func colOf(_ x: CGFloat) -> Int {
        var best = 0
        for i in 0..<cols.count where abs(x - cols[i].cx) < abs(x - cols[best].cx) { best = i }
        return best
    }

    // 表头之后：每行第一个是时间，其余格子是课名，按 x 归到对应列
    for (ri, r) in rows.enumerated() where ri > headerIdx {
        guard let timeCell = r.cells.first(where: { isTime($0.text) }) else { continue }
        for c in r.cells where c.text != timeCell.text {
            let txt = c.text.trimmingCharacters(in: .whitespaces)
            if txt.isEmpty || isTime(txt) { continue }
            if !extractLabels(txt).isEmpty { continue }
            let ci = colOf((c.minX + c.maxX) / 2)
            if ci < cols.count {
                print("\(cols[ci].label) \(timeCell.text) \(txt)")
            }
        }
    }
} else {
    // 非表格：普通逐行输出（识别器已按坐标排好顺序）
    for r in rows {
        print(r.cells.map { $0.text }.joined(separator: " "))
    }
}
