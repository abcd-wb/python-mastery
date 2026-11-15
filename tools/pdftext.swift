// 本机文本抽取（macOS 自带框架，离线）：
//   pdf → PDFKit 逐页抽文字；抽不出的页（扫描件/图片型 PDF）标记出来
//   doc/docx/rtf/odt/html → 交给 textutil 转成纯文本
// 用法：pdftext <文件路径>   → 输出文本到 stdout，末尾附状态行
import Foundation
import PDFKit

let args = CommandLine.arguments
guard args.count > 1 else { exit(2) }
let path = args[1]
let ext = (path as NSString).pathExtension.lowercased()

// 非 PDF：用系统 textutil 转
if ext != "pdf" {
    let t = Process()
    t.executableURL = URL(fileURLWithPath: "/usr/bin/textutil")
    t.arguments = ["-convert", "txt", "-stdout", path]
    let pipe = Pipe()
    t.standardOutput = pipe
    t.standardError = Pipe()
    do { try t.run(); t.waitUntilExit() } catch {
        FileHandle.standardError.write("fail\n".data(using: .utf8)!)
        exit(3)
    }
    let data = pipe.fileHandleForReading.readDataToEndOfFile()
    let s = String(data: data, encoding: .utf8) ?? String(data: data, encoding: .utf16) ?? ""
    print(s)
    exit(0)
}

// PDF：PDFKit 抽文字
guard let doc = PDFDocument(url: URL(fileURLWithPath: path)) else {
    FileHandle.standardError.write("fail\n".data(using: .utf8)!)
    exit(3)
}
var got = 0
for i in 0..<doc.pageCount {
    guard let page = doc.page(at: i), let t = page.string else { continue }
    let s = t.trimmingCharacters(in: .whitespacesAndNewlines)
    if !s.isEmpty { got += 1; print(s) }
}
if got == 0 {
    // 一个字的文本都没抽到：多半是扫描件/图片型 PDF
    FileHandle.standardError.write("no-text\n".data(using: .utf8)!)
}
