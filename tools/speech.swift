// 本机语音识别（macOS Speech，支持中文普通话）
// 用法：speech <音频文件路径>   → 输出识别文本到 stdout
// 支持 m4a/mp3/wav 等 SFSpeechRecognizer 能解码的格式
import Foundation
import Speech

let args = CommandLine.arguments
guard args.count > 1 else {
    FileHandle.standardError.write("no file\n".data(using: .utf8)!)
    exit(2)
}
let url = URL(fileURLWithPath: args[1])

let sem = DispatchSemaphore(value: 0)
var resultText = ""
var didFail = false

let locale = Locale(identifier: "zh-CN")
guard let recognizer = SFSpeechRecognizer(locale: locale), recognizer.isAvailable else {
    FileHandle.standardError.write("speech unavailable\n".data(using: .utf8)!)
    exit(3)
}
recognizer.defaultTaskHint = .dictation

let request = SFSpeechURLRecognitionRequest(url: url)
request.shouldReportPartialResults = false
request.addsPunctuation = true

recognizer.recognitionTask(with: request) { res, err in
    if let r = res, r.isFinal {
        resultText = r.bestTranscription.formattedString
        sem.signal()
    } else if err != nil {
        didFail = true
        sem.signal()
    }
}

_ = sem.wait(timeout: .now() + 60)

if didFail || resultText.isEmpty {
    FileHandle.standardError.write("no speech\n".data(using: .utf8)!)
    exit(4)
}
print(resultText)
