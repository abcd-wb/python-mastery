import Foundation
import PDFKit
import AppKit
let a = CommandLine.arguments
guard a.count >= 3, let doc = PDFDocument(url: URL(fileURLWithPath: a[1])) else { exit(2) }
let pageIdx = Int(a[2]) ?? 0
let scale: CGFloat = a.count >= 4 ? CGFloat(Double(a[3]) ?? 3.0) : 3.0
guard let page = doc.page(at: pageIdx) else { exit(3) }
let b = page.bounds(for: .mediaBox)
let sz = NSSize(width: b.width*scale, height: b.height*scale)
let img = NSImage(size: sz)
img.lockFocus()
guard let ctx = NSGraphicsContext.current?.cgContext else { exit(5) }
ctx.setFillColor(CGColor(red:1,green:1,blue:1,alpha:1))
ctx.fill(CGRect(origin: .zero, size: sz))
page.draw(with: .mediaBox, to: ctx)
img.unlockFocus()
guard let tiff = img.tiffRepresentation, let rep = NSBitmapImageRep(data: tiff),
      let png = rep.representation(using: .png, properties: [:]) else { exit(4) }
let out = "/tmp/hi_page_\(pageIdx).png"
try? png.write(to: URL(fileURLWithPath: out))
print(out)
