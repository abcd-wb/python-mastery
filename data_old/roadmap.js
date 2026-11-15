/* 学习路线数据：零基础 -> 独立开发 -> 资深 */
window.ROADMAP = {
  updated: "2026-11-14",

  verdict: {
    headline: "零基础到「能独立开发项目」：4~6 个月（每天 2 小时）；到「资深」：2~3 年，且必须靠真实项目磨出来，不是靠课程学出来。",
    points: [
      "能写脚本、看懂别人代码：6~10 周（每天 1~2 小时，且必须动手敲）",
      "能独立做完一个可用项目（需求拆解 → 编码 → 测试 → 部署）：4~6 个月中等强度",
      "能当主力工程师、做技术选型和架构：约 1~2 年，且要有线上项目维护经验",
      "「资深」的分界线不是语法，而是：性能调优、并发模型、工程化、代码评审、踩过线上事故、读过源码或 PEP",
      "最大的坑：只刷视频不敲代码。看 30% / 敲 70% 是最低比例；每学完一节，合上视频凭记忆重写一遍"
    ]
  },

  langPolicy: "当前学习语言策略：中文优先。入门＝小甲鱼、进阶＝黑马程序员、实战＝Datawhale 中文开源教程，三个阶段全中文；哈佛 CS50P、Kaggle Learn、Real Python 等纯英文课程已移入「纯英文课程 · 待解锁」，等能独立开发后由你指定名单再开。每节课右栏照常积累 6 个英文专业名词，为将来过渡打底。",

  timelines: [
    { goal: "能写小脚本、看懂基础代码", casual: "8~10 周", normal: "4~6 周", intense: "2~3 周" },
    { goal: "独立完成完整项目（初级可用）", casual: "9~12 个月", normal: "4~6 个月", intense: "3~4 个月" },
    { goal: "方向专精 + 工程化（可协作开发）", casual: "18~24 个月", normal: "10~14 个月", intense: "6~9 个月" },
    { goal: "资深（架构 / 调优 / 带项目）", casual: "3 年以上", normal: "2~3 年", intense: "2 年左右（需真实项目）" }
  ],
  timelineNote: "投入强度：轻量 = 每周 5~7 小时；标准 = 每周 12~15 小时（每天约 2 小时）；高强度 = 每周 25 小时以上。表中时间为「有效学习 + 动手编码」时间，不含只挂视频的时间。",

  units: [
    { id: "U0", name: "环境与第一个程序", desc: "装 Python、配 VS Code、pip、虚拟环境、运行 .py、看懂报错", weeks: "第 1 周" },
    { id: "U1", name: "变量、类型与运算符", desc: "int / float / str / bool、类型转换、算术与比较运算、f-string", weeks: "第 1~2 周" },
    { id: "U2", name: "流程控制", desc: "if / elif / else、for、while、break / continue、缩进与代码块", weeks: "第 2~3 周" },
    { id: "U3", name: "核心数据结构", desc: "列表、元组、字典、集合、字符串、切片、推导式入门", weeks: "第 3~5 周" },
    { id: "U4", name: "函数与作用域", desc: "参数、返回值、默认参数、*args/**kwargs、作用域、lambda、递归", weeks: "第 5~6 周" },
    { id: "U5", name: "文件、异常、模块与包", desc: "open / pathlib、try-except、import、__name__、标准库常用模块", weeks: "第 7~8 周" },
    { id: "U6", name: "面向对象", desc: "类与实例、__init__、继承、多态、魔术方法、dataclass、property", weeks: "第 9~10 周" },
    { id: "U7", name: "Pythonic 进阶", desc: "迭代器、生成器、装饰器、上下文管理器、闭包、推导式、类型注解", weeks: "第 11~14 周" },
    { id: "U8", name: "并发、数据库与标准库", desc: "threading、multiprocessing、asyncio、sqlite3、re、json、logging、collections", weeks: "第 15~18 周" },
    { id: "U9", name: "工程化与质量", desc: "pytest、Ruff、uv / venv、Git、类型检查、打包发布、日志与配置", weeks: "贯穿全程" },
    { id: "P-web", name: "方向实战：Web 后端", desc: "HTTP、路由、参数校验、ORM、鉴权、部署", weeks: "第 17~26 周" },
    { id: "P-data", name: "方向实战：数据分析", desc: "NumPy、pandas、清洗、聚合、可视化、报表", weeks: "第 17~26 周" },
    { id: "P-auto", name: "方向实战：自动化办公", desc: "Excel、PDF、邮件、文件批处理、定时任务", weeks: "第 17~26 周" },
    { id: "P-spider", name: "方向实战：爬虫采集", desc: "HTTP 请求、解析、限速、去重、入库", weeks: "第 17~26 周" },
    { id: "P-ai", name: "方向实战：AI 应用", desc: "NumPy、sklearn、模型评估、LLM 与 RAG", weeks: "第 17~26 周" },
    { id: "P-eng", name: "方向实战：工程化", desc: "重构、设计模式、CI、性能、可维护性", weeks: "长期" }
  ],

  majors: [
    { id: "web", name: "Web 后端开发", desc: "接口、路由、数据库、鉴权、部署", teacher: "FastAPI 官方文档 + Corey Schafer（Flask 系列）", book: "《Flask Web 开发实战》/ FastAPI 官方中文文档", color: "#2563eb" },
    { id: "data", name: "数据分析", desc: "NumPy、pandas、清洗、可视化、报表", teacher: "Kaggle Learn 微课程 + Wes McKinney（pandas 作者）", book: "《利用 Python 进行数据分析》第 3 版", color: "#7c3aed" },
    { id: "auto", name: "自动化办公 / 脚本", desc: "Excel、PDF、邮件、批量改名、定时任务", teacher: "Al Sweigart《Automate the Boring Stuff with Python》", book: "免费在线版 automatetheboringstuff.com", color: "#0d9488" },
    { id: "spider", name: "网络爬虫与采集", desc: "requests、解析、反爬应对、Scrapy、数据入库", teacher: "北京理工 嵩天（中国大学 MOOC 爬虫课）", book: "《Python 3 网络爬虫开发实战》", color: "#ea580c" },
    { id: "ai", name: "AI / LLM 应用", desc: "scikit-learn、模型调用、RAG、Agent、Prompt 工程", teacher: "Kaggle Learn + 吴恩达 DeepLearning.AI 短课", book: "《Python 深度学习》/ scikit-learn 官方教程", color: "#db2777" },
    { id: "eng", name: "工程化 / 测试", desc: "pytest、CI、代码规范、打包、性能分析与重构", teacher: "Real Python + ArjanCodes（设计级）", book: "《Effective Python》第 3 版 / 《Python Cookbook》", color: "#475569" }
  ],

  stages: [
    {
      no: 1, title: "第一步：跟小甲鱼入门，把语法敲进肌肉记忆", weeks: "第 1~6 周", color: "#2563eb",
      goal: "从「完全看不懂代码」到「能独立写出 50 行以内的小程序」",
      teacher: { name: "小甲鱼", course: "《零基础入门学习 Python》（B 站 / 鱼C 论坛）", url: "https://fishc.com.cn/", why: "中文、风趣、零基础友好，用生活段子讲概念，最容易坚持下来。配套鱼C论坛课后习题形成闭环。" },
      alternates: [
        { name: "黑马程序员 Python 基础班", url: "https://search.bilibili.com/all?keyword=%E9%BB%91%E9%A9%AC%E7%A8%8B%E5%BA%8F%E5%91%98Python%E5%9F%BA%E7%A1%80", note: "体系最全、练习量大；节奏偏快，适合想扎扎实实打基础的人" },
        { name: "《Python 编程：从入门到实践》Eric Matthes", url: "https://www.ituring.com.cn/book/2784", note: "项目导向，后半本有游戏 / 数据可视化 / Web 小站三个完整项目" },
        { name: "廖雪峰 Python 教程（文字版，当字典查）", url: "https://www.liaoxuefeng.com/wiki/1016959663602400", note: "国内打开快，语法查漏补缺首选；练习少，要自己配题" }
      ],
      topics: ["环境搭建与运行 .py", "变量、类型、运算符", "if / for / while", "列表、元组、字典、集合、字符串", "函数定义与调用", "简单文件读写"],
      practice: [
        { name: "Python123（中文，自动判题）", url: "https://www.python123.io/", task: "跟做「Python 语言程序设计」配套习题，每章做完" },
        { name: "HackerRank → Python 模块", url: "https://www.hackerrank.com/domains/python", task: "Introduction + Basic Data Types 全部做完" },
        { name: "本平台题库 U0~U4", url: "#/bank", task: "每个单元至少做满 80% 并标记掌握" }
      ],
      homework: ["命令行记账本（增删查 + 存文件）", "猜数字游戏（带次数限制和提示）", "BMI 计算器 + 成绩等级转换"],
      pass: "不看教程，能独立写出「读入一行文本 → 统计词频 → 按次数排序输出」；能自己看懂 Traceback 报错",
      units: ["U0", "U1", "U2", "U3", "U4"], tip: "只跟一套主线，别同时刷三个教程。看完一集立刻合上，凭记忆把代码敲出来。"
    },
    {
      no: 2, title: "第二步：跟黑马程序员中文进阶课，把「会语法」变成「会解题」", weeks: "第 7~10 周", color: "#0d9488",
      goal: "建立编程思维：把模糊需求拆成步骤、处理边界条件、自己调试",
      teacher: { name: "黑马程序员（传智教育）", course: "《Python 进阶 / 高级编程》B 站免费中文课", url: "https://www.bilibili.com/video/BV1QT4y1N7sS/", why: "体系最全的中文进阶课，闭包、装饰器、生成器、正则、网络、数据库、多任务都覆盖，正好对应图片 02/03 阶段；全中文，英语不好也能完整跟下来。" },
      alternates: [
        { name: "黑马程序员 600 集 Python 全套", url: "https://www.bilibili.com/video/BV1ex411x7Em", note: "更基础更全，适合回头补基础；课时多，按本平台目录挑着看" },
        { name: "北京理工 嵩天《Python 语言程序设计》+ Python123", url: "https://www.python123.io/", note: "中文国家精品课，中文自动判题" },
        { name: "廖雪峰 Python 教程（文字，当字典查）", url: "https://www.liaoxuefeng.com/wiki/1016959663602400", note: "查语法最快，但不作主线、练习太少" }
      ],
      topics: ["条件与循环的组合", "异常处理入门", "正则表达式", "单元测试意识", "命令行参数", "把需求拆成函数"],
      practice: [
        { name: "Python123（中文自动判题）", url: "https://www.python123.io/", task: "按章节做完基础与进阶题，中文题干" },
        { name: "牛客网 Python 题库", url: "https://www.nowcoder.com/", task: "每周 10 题，重点练条件、循环、字符串" },
        { name: "Codewars 8kyu → 7kyu", url: "https://www.codewars.com/", task: "每天 1 题，题目英文很短，正好当术语练习" },
        { name: "本平台题库 U5~U6", url: "#/bank", task: "文件、异常、模块、面向对象" }
      ],
      homework: ["CSV 成绩表统计程序（含异常输入处理）", "批量重命名文件的小工具", "带单元测试的命令行待办清单"],
      pass: "拿到一个从没见过的小需求，能在 30 分钟内写出可运行版本；能主动想到「文件不存在 / 输入为空」这类边界",
      units: ["U5", "U6"], tip: "卡住 20~40 分钟再看提示；看完答案后隔三天重写一遍，这一步决定你是不是真的会了。"
    },
    {
      no: 3, title: "第三步：跟《流畅的 Python》，从「能写」到「写得地道」", weeks: "第 11~16 周", color: "#7c3aed",
      goal: "理解 Python 的数据模型，写出 Pythonic 代码，看懂开源项目源码",
      teacher: { name: "Luciano Ramalho + Corey Schafer / 莫烦 Python", course: "《流畅的 Python》第 2 版 + 专题视频", url: "https://docs.python.org/zh-cn/3/", why: "书讲「为什么这么设计」，视频讲「具体怎么用」。官方文档此时开始变成你的第一查询入口。" },
      alternates: [
        { name: "Brett Slatkin《Effective Python》第 3 版", url: "https://effectivepython.com/", note: "125 条独立最佳实践，一次读一条，适合碎片时间" },
        { name: "Corey Schafer Python 进阶专题（YouTube）", url: "https://www.youtube.com/@coreyms", note: "装饰器、生成器、OOP、并发讲得极清楚" },
        { name: "莫烦 Python（中文短课）", url: "https://mofanpy.com/", note: "一集一个点，5 分钟查漏补缺，不适合当主线" },
        { name: "Python 官方文档中文版", url: "https://docs.python.org/zh-cn/3/", note: "任何博客说法打架，以它为准" }
      ],
      topics: ["迭代器协议与生成器", "装饰器与闭包", "上下文管理器 with", "推导式与 itertools / collections", "可变对象与浅拷贝深拷贝", "类型注解与 dataclass", "GIL 与并发模型概念"],
      practice: [
        { name: "Python Morsels（Trey Hunner）", url: "https://www.pythonmorsels.com/", task: "每周 1~2 道地道写法练习，专治「代码能跑但很丑」" },
        { name: "PyBites 免费练习", url: "https://pybit.es/", task: "每周 2 题，练标准库和代码风格" },
        { name: "Exercism 进阶题 + LeetCode 简单题", url: "https://leetcode.cn/", task: "每天 1 道简单题，练算法手感，别死磕难题" },
        { name: "本平台题库 U7~U8", url: "#/bank", task: "Pythonic 进阶 + 并发与标准库" }
      ],
      homework: ["给现有代码写 3 个装饰器（计时 / 缓存 / 重试）", "用生成器改写「一次读大文件」的程序并对比内存", "读一个 1k star 以下的小开源项目，写一份代码结构笔记"],
      pass: "能说清 list / dict 背后的数据模型；能自己写出带 @wraps 的装饰器和上下文管理器；看别人代码能指出哪里不 Pythonic",
      units: ["U7", "U8"], tip: "这一阶段最容易被跳过，也是自学者和科班最大的分水岭。"
    },
    {
      no: 4, title: "第四步：选一个专业方向，跟对应的人往深里扎", weeks: "第 17~26 周", color: "#ea580c",
      goal: "在一个方向上能独立完成带数据库 / 依赖 / 部署的完整项目",
      teacher: { name: "按方向选（见下方 6 个专业）", course: "一次只选一个方向，别贪多", url: "#/major", why: "Python 只是工具，真正的价值在领域。基础打牢后再分叉，否则会出现「框架会用、报错看不懂」。" },
      alternates: [
        { name: "Web 后端：FastAPI 官方中文文档", url: "https://fastapi.tiangolo.com/zh/", note: "先 Flask 理解概念，再 FastAPI 做接口，配 SQLAlchemy + SQLite/PostgreSQL" },
        { name: "数据分析：Kaggle Learn", url: "https://www.kaggle.com/learn", note: "Python → pandas → 数据可视化 → 机器学习入门，浏览器里直接写" },
        { name: "自动化办公：Al Sweigart", url: "https://automatetheboringstuff.com/", note: "Excel / PDF / 邮件 / 文件批处理，抄了就能用" },
        { name: "网络爬虫：嵩天（中国大学 MOOC）", url: "https://www.icourse163.org/", note: "requests + BeautifulSoup 入门，注意示例站点是否还活着" },
        { name: "AI 应用：scikit-learn 官方教程", url: "https://scikit-learn.org/stable/tutorial/index.html", note: "先把 NumPy/pandas 补上，再碰模型和 LLM 应用" },
        { name: "工程化：Real Python", url: "https://realpython.com/", note: "pytest、打包、虚拟环境、代码质量专题" }
      ],
      topics: ["方向核心库与框架", "数据库 / 数据集 / 外部 API", "配置与密钥管理", "错误与日志", "一个从 0 到 1 的完整项目"],
      practice: [
        { name: "本平台「按专业」题库", url: "#/major", task: "选定方向后，把该方向所有题 + 项目作业做完" },
        { name: "方向专属平台", url: "#/major", task: "数据方向刷 Kaggle；Web 方向做 Real Python 项目；爬虫方向做自己的采集需求" },
        { name: "牛客 / LeetCode 简单~中等", url: "https://www.nowcoder.com/", task: "每周 3 题，保持手感即可，不必刷满" }
      ],
      homework: ["项目 1（小型）：单文件工具，解决你自己的一个真实痛点", "项目 2（中型）：带持久化 + 配置文件 + 异常处理 + README", "项目 3（完整）：带测试、日志、部署上线、可给别人使用"],
      pass: "别人给你一句模糊需求，你能自己拆模块、定数据结构、写完并部署；项目挂了你能看着日志定位问题",
      units: ["U9"], tip: "项目必须来自真实需求（哪怕是你自己的股票数据整理），不要只做教程里的仿品。"
    },
    {
      no: 5, title: "第五步：补齐工程化，让代码「能交付、能协作」", weeks: "第 20 周起贯穿", color: "#475569",
      goal: "从「我自己电脑能跑」到「别人拉下来也能跑、改了不会崩」",
      teacher: { name: "官方文档 + Real Python + ArjanCodes", course: "pytest / Ruff / uv / Git / 类型检查 / CI", url: "https://docs.pytest.org/", why: "这一层是「会写 Python」和「能靠 Python 干活」的分界线，也是面试最常被问到的部分。" },
      alternates: [
        { name: "Ruff（lint + format）", url: "https://docs.astral.sh/ruff/", note: "一个工具替代 flake8 + black + isort" },
        { name: "uv（依赖与环境）", url: "https://docs.astral.sh/uv/", note: "比 pip 快很多，管虚拟环境和锁文件" },
        { name: "ArjanCodes（YouTube）", url: "https://www.youtube.com/@ArjanCodes", note: "代码设计、重构、架构，进阶到资深必看" },
        { name: "PEP 8 代码规范", url: "https://peps.python.org/pep-0008/", note: "写代码风格的原始依据" }
      ],
      topics: ["venv / uv 与 requirements 锁定", "pytest 单元测试与 fixture", "Ruff 静态检查", "logging 而非 print", "Git 分支与提交规范", "类型注解 + mypy", "打包与发布到 PyPI（可选）"],
      practice: [
        { name: "给项目 2 / 项目 3 补测试", url: "#/unit/U9", task: "核心函数测试覆盖率 ≥ 70%" },
        { name: "本平台题库 U9 工程化单元", url: "#/unit/U9", task: "全做，这是资深门槛题" }
      ],
      homework: ["把旧项目重构一遍：拆模块 + 加类型注解 + 加 pytest + Ruff 零告警", "写一份能让人照着跑起来的 README 和一键启动脚本"],
      pass: "项目 clone 到另一台机器，三条命令内跑起来；改动后有测试兜底；代码交给别人能看懂",
      units: ["U9"], tip: "这一步不性感，但决定了你是「爱好者」还是「工程师」。"
    },
    {
      no: 6, title: "第六步：独立项目 + 源码 + 开源，走向资深", weeks: "长期（1~3 年）", color: "#dc2626",
      goal: "能做技术选型、扛线上问题、评审别人代码、理解语言底层",
      teacher: { name: "不再有「老师」", course: "官方文档、PEP、CPython 源码、开源社区", url: "https://peps.python.org/", why: "到这一层，学习材料变成真实问题和别人的工程代码。资深是「做出来的」，不是「学完的」。" },
      alternates: [
        { name: "GitHub Trending / Python 榜", url: "https://github.com/trending/python", note: "读小项目的目录结构、依赖、测试怎么组织" },
        { name: "《Python Cookbook》Beazley", url: "https://docs.python.org/zh-cn/3/", note: "遇到具体棘手问题的解法手册" },
        { name: "PEP 列表", url: "https://peps.python.org/", note: "理解语言为什么这样设计、新版本改了什么" },
        { name: "给开源项目提 PR", url: "https://github.com/topics/good-first-issue", note: "从文档 / 小 bug 开始，接受真实 Code Review" }
      ],
      topics: ["性能剖析（cProfile / timeit）", "并发选型：线程 / 进程 / asyncio", "内存与引用计数、GC", "设计模式与依赖注入", "缓存、队列、限流等工程问题", "Code Review 与技术文档"],
      practice: [
        { name: "维护一个持续有人用的项目 ≥ 6 个月", url: "#/", task: "处理 issue、兼容升级、写 changelog" },
        { name: "性能专项", url: "#/", task: "给一个慢脚本做 profiling，把耗时降一个数量级并写下记录" }
      ],
      homework: ["主导一个从 0 到上线的项目（含部署、监控、回滚方案）", "给开源项目提交至少 1 个被合并的 PR", "写 3 篇技术复盘（踩坑 / 选型 / 性能优化）"],
      pass: "别人问「这里为什么这么写」，你能讲清权衡；线上出问题时你能按证据定位，而不是靠猜",
      units: [], tip: "资深没有终点线。判断标准很朴素：你维护过真实用户使用的代码，并为它半夜起来修过 bug。"
    }
  ],

  resources: [
    { cat: "主线课程", items: [
      { n: "小甲鱼《零基础入门学习 Python》", u: "https://fishc.com.cn/", d: "零基础第一站，中文风趣" },
      { n: "黑马程序员 Python 基础（B 站）", u: "https://search.bilibili.com/all?keyword=%E9%BB%91%E9%A9%AC%E7%A8%8B%E5%BA%8F%E5%91%98Python%E5%9F%BA%E7%A1%80", d: "体系最全，练习量大" },
      { n: "哈佛 CS50P（David Malan）", u: "https://cs50.harvard.edu/python/", d: "免费，problem set 自动评分" },
      { n: "Python for Everybody（密歇根大学）", u: "https://www.py4e.com/", d: "节奏最慢，适合纯小白" },
      { n: "嵩天《Python 语言程序设计》", u: "https://www.python123.io/", d: "中文国家精品课 + 判题" }
    ]},
    { cat: "文字教程 / 官方文档", items: [
      { n: "廖雪峰 Python 教程", u: "https://www.liaoxuefeng.com/wiki/1016959663602400", d: "中文速查手册" },
      { n: "Python 官方文档（中文）", u: "https://docs.python.org/zh-cn/3/", d: "最终权威，说法打架以它为准" },
      { n: "Real Python", u: "https://realpython.com/", d: "中高级专题文章" },
      { n: "莫烦 Python", u: "https://mofanpy.com/", d: "中文短视频，一集一个点" },
      { n: "Python Tutor", u: "https://pythontutor.com/", d: "逐行可视化变量和内存，理解引用必用" }
    ]},
    { cat: "做题 / 判题平台", items: [
      { n: "Python123", u: "https://www.python123.io/", d: "中文、自动判题、入门首选" },
      { n: "HackerRank Python", u: "https://www.hackerrank.com/domains/python", d: "按 strings / collections 等分模块，最有序" },
      { n: "Exercism Python Track", u: "https://exercism.org/tracks/python", d: "146 题 / 17 概念，免费真人代码点评" },
      { n: "PYnative", u: "https://pynative.com/", d: "800+ 题按 29 个主题分组，无需账号" },
      { n: "Practice Python", u: "https://www.practicepython.org/", d: "40 道入门小题带参考解" },
      { n: "Codewars", u: "https://www.codewars.com/", d: "游戏化 kata，可看别人的优雅解法" },
      { n: "Python Morsels", u: "https://www.pythonmorsels.com/", d: "专练地道写法，进阶必备" },
      { n: "PyBites", u: "https://pybit.es/", d: "短小实战练习" },
      { n: "力扣 LeetCode 中国", u: "https://leetcode.cn/", d: "算法与面试，每天 1 道简单题即可" },
      { n: "牛客网", u: "https://www.nowcoder.com/", d: "国内题库最全" },
      { n: "Kaggle Learn", u: "https://www.kaggle.com/learn", d: "数据方向免费微课程，浏览器内写" }
    ]},
    { cat: "进阶书籍", items: [
      { n: "《Python 编程：从入门到实践》Eric Matthes", u: "https://www.ituring.com.cn/book/2784", d: "入门 + 3 个项目" },
      { n: "《流畅的 Python》第 2 版 Luciano Ramalho", u: "https://docs.python.org/zh-cn/3/", d: "中级突破瓶颈第一书" },
      { n: "《Effective Python》第 3 版 Brett Slatkin", u: "https://effectivepython.com/", d: "125 条最佳实践" },
      { n: "《利用 Python 进行数据分析》Wes McKinney", u: "https://pandas.pydata.org/", d: "pandas 作者所写" },
      { n: "《Automate the Boring Stuff》Al Sweigart", u: "https://automatetheboringstuff.com/", d: "办公自动化，免费在线读" },
      { n: "《Python Cookbook》Beazley", u: "https://docs.python.org/zh-cn/3/", d: "具体问题解法手册" }
    ]},
    { cat: "工程化工具", items: [
      { n: "VS Code", u: "https://code.visualstudio.com/", d: "编辑器首选" },
      { n: "pytest", u: "https://docs.pytest.org/", d: "单元测试" },
      { n: "Ruff", u: "https://docs.astral.sh/ruff/", d: "lint + 格式化一体化" },
      { n: "uv", u: "https://docs.astral.sh/uv/", d: "虚拟环境与依赖管理" },
      { n: "PEP 8 / PEP 列表", u: "https://peps.python.org/", d: "代码规范与语言设计" },
      { n: "FastAPI 中文文档", u: "https://fastapi.tiangolo.com/zh/", d: "Web 方向主线" }
    ]}
  ]
};
