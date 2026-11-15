// 输出：<屏幕上的窗口数> <总窗口数>
// 用来判断应用是不是「进程在、窗口看不见」——这种情况点卡片是没反应的
import CoreGraphics
import Foundation

let name = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : ""

func count(_ opts: CGWindowListOption) -> Int {
    guard let list = CGWindowListCopyWindowInfo(opts, kCGNullWindowID) as? [[String: Any]] else { return 0 }
    var n = 0
    for w in list {
        let owner = w[kCGWindowOwnerName as String] as? String ?? ""
        if !name.isEmpty && owner.contains(name) { n += 1 }
    }
    return n
}

print(count([.optionOnScreenOnly, .excludeDesktopElements]), count([.excludeDesktopElements]))
