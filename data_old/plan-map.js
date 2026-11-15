/* 图片「Python 从入门到精通 · 系统学习路线图」逐条对照 + 缺口补齐 + 资源/词汇数据
   状态：full=已完整覆盖  part=部分覆盖  none=尚未覆盖（本页给出补齐讲义要点）      */
window.PLAN_MAP = {
  source: '图片：Python 从入门到精通 · 系统学习路线图（@计算机学长诚哥）',
  updated: '2026-11-14',
  verdict: '诚实结论：原平台 36 节课堂覆盖了图片的「入门阶段」绝大部分和「进阶/实战阶段」约一半，但「提升阶段」「精通阶段」以及图片里的环境方案、并发、网络、数据库、部署等条目确实没有完整覆盖。本页把这些缺口全部补齐成讲义要点 + 英文词汇表，现在可以做到逐条都有内容、都有去处。',

  stages: [
    {
      no: '01', name: '入门阶段', weeks: '1-2 周', goal: '掌握 Python 基础语法，能编写简单程序', color: '#0f9d58',
      items: [
        { t: 'Python 环境安装与配置（Anaconda / PyCharm）', s: 'part', w: 'course.html#/intro/1', wl: '入门 第 1 节', n: '已讲 Python 安装 + VS Code；缺 Anaconda 与 PyCharm 两条主流方案。',
          fix: ['Anaconda：一次装好 Python + conda + 常用科学计算库，做数据分析最省事；用 conda create -n py39 python=3.12 建隔离环境。', 'PyCharm：JetBrains 的 Python IDE，社区版免费，调试/重构最强；VS Code 更轻，二选一即可，不要两个都折腾。', '无论哪种，装完先跑 python --version 和 pip --version 验证，再新建虚拟环境。'] },
        { t: '基础语法：变量、数据类型、运算符、输入输出', s: 'full', w: 'course.html#/intro/2', wl: '入门 第 2~3 节', n: '变量/类型/转换、算术比较逻辑运算、input/print/f-string 全部覆盖。' },
        { t: '流程控制：条件语句、循环语句', s: 'full', w: 'course.html#/intro/5', wl: '入门 第 5~7 节', n: 'if/elif/else、for/while、break/continue、嵌套循环、输入校验全覆盖。' },
        { t: '字符串：常用操作、格式化', s: 'full', w: 'course.html#/intro/4', wl: '入门 第 4 节', n: '切片、strip/split/join/replace、f-string 对齐与小数位。' },
        { t: '列表、元组、集合、字典等数据结构', s: 'full', w: 'course.html#/intro/8', wl: '入门 第 8~9 节', n: '四种容器、增删改查、切片、推导式、浅拷贝坑、get/Counter。' },
        { t: '函数：定义、参数、返回值、作用域', s: 'full', w: 'course.html#/intro/10', wl: '入门 第 10 节', n: '位置/默认/*args/**kwargs、返回值、作用域、默认参数可变对象陷阱、docstring。' },
        { t: '模块与包：导入、常用内置模块（math、random、time 等）', s: 'part', w: 'course.html#/adv/5', wl: '进阶 第 5 节', n: 'import 三种写法、venv、requirements.txt 已讲；math/random/time 未逐个给例子。',
          fix: ['math：math.sqrt/ceil/floor/gcd、math.pi；random：randint/choice/sample/shuffle；time：time/time.sleep/strftime。', 'datetime 处理日期更推荐：datetime.now()、timedelta(days=7)、strptime/strftime。', '记住「模块 = 一个 .py，包 = 带 __init__.py 的目录」，导入时避免 from x import *。'] },
        { t: '文件操作：读取、写入、with 语句', s: 'full', w: 'course.html#/intro/11', wl: '入门 第 11 节', n: 'open 三种模式、with 自动关闭、pathlib、编码、try-except、json 持久化。' },
        { t: '项目实践：学生成绩管理系统 / 猜数字小游戏', s: 'part', w: 'course.html#/intro/6', wl: '入门 第 6 节作业', n: '猜数字已在作业里；成绩管理系统缺失（原结课项目是命令行记账本）。',
          fix: ['成绩管理系统 = 字典列表存 {姓名, 语文, 数学, 英语} + 增删改查菜单 + 按总分排序 + 写 CSV 保存。', '核心练习点：列表排序 sorted(records, key=lambda r: sum(r["scores"]))、及格率统计、输入校验。', '验收：关掉程序再打开数据还在，输入非数字不崩溃；再加「按科目平均分」报表。'] }
      ]
    },
    {
      no: '02', name: '进阶阶段', weeks: '2-4 周', goal: '掌握 Python 进阶特性，能解决实际问题', color: '#2563eb',
      items: [
        { t: '函数进阶：匿名函数、递归、装饰器、生成器', s: 'part', w: 'course.html#/adv/12', wl: '进阶 第 12 节', n: '题库 U4/U7 有对应题，课堂只在收尾提了装饰器与 yield，未系统讲。',
          fix: ['lambda：sorted(rows, key=lambda r: r["score"])，只写单个表达式，复杂逻辑一律用 def。', '递归必须有终止条件；求阶乘/遍历目录树是典型例子，深度大时改用循环或栈。', '装饰器 = 接收函数返回新函数，用 @ 语法，务必加 functools.wraps 保留 __name__；生成器用 yield 惰性产出。'] },
        { t: '面向对象编程：类、对象、继承、多态、封装、特殊方法', s: 'full', w: 'course.html#/adv/9', wl: '进阶 第 9 节', n: '类/实例/self/__init__/继承/super/property/__str__/__repr__/dataclass 全覆盖。' },
        { t: '异常处理：try-except-finally、自定义异常', s: 'full', w: 'course.html#/adv/4', wl: '进阶 第 4 节', n: '常见异常类型、try/except/else/finally、raise 自定义异常、错误信息写法。' },
        { t: '迭代器与生成器：迭代器协议、生成器表达式', s: 'part', w: 'course.html#/adv/10', wl: '进阶 第 10 节', n: '讲了 yield 惰性求值；缺 __iter__/__next__ 协议与生成器表达式。',
          fix: ['迭代器协议：对象实现 __iter__ 返回自身、__next__ 返回下一个值，耗尽抛 StopIteration；for 循环就是自动调用它俩。', '生成器表达式：(x*x for x in nums) 用圆括号，和列表推导式相比不占内存、只能遍历一次。', 'itertools 的 islice/cycle/chain 是处理迭代器的标准工具。'] },
        { t: '常用标准库：os、sys、datetime、collections、json、re 等', s: 'part', w: 'course.html#/adv/5', wl: '进阶 第 5 节', n: '列了库清单与 import 规范；re 有整节，其余未逐个示例。',
          fix: ['os/pathlib 管路径，sys.argv 收命令行参数，json 做序列化（ensure_ascii=False 保中文）。', 'collections 高频：Counter 计数、defaultdict 免判空、deque 双端队列、namedtuple 轻量记录。', 'datetime 做日期计算，re 做文本校验，logging 记日志——这 6 个是写工具脚本的标配。'] },
        { t: '正则表达：匹配规则、常用方法', s: 'full', w: 'course.html#/adv/8', wl: '进阶 第 8 节', n: 'search/match/fullmatch/findall/sub、字符类、量词、分组、锚点、原始字符串。' },
        { t: '数据处理基础：Pandas 入门（Series、DataFrame）', s: 'full', w: 'course.html#/project/3', wl: '实战 第 3 节', n: 'DataFrame/Series、loc/iloc、布尔筛选、info/describe/isna、新增列。' },
        { t: '项目实践：文件批量重命名工具 / 网络爬虫获取数据', s: 'part', w: 'index.html#/unit/P-auto', wl: '题库 P-auto / P-spider', n: '题库有对应题与项目作业，课堂未做成完整项目。',
          fix: ['批量重命名：pathlib.Path.glob + rename，先打印预览再真改，务必备份并防重名覆盖。', '爬虫入门：requests.get → resp.text → BeautifulSoup 解析 → 存 CSV；设 timeout、限速、User-Agent。', '合法合规：先看 robots.txt，只采公开数据，不做高频请求，不绕过登录与付费内容。'] }
      ]
    },
    {
      no: '03', name: '提升阶段', weeks: '1-2 个月', goal: '深入核心知识，提升代码能力', color: '#ea580c',
      items: [
        { t: '深入面向对象：设计模式、抽象基类、元类（可选）', s: 'none', w: 'index.html#/unit/U6', wl: '题库 U6', n: '图片原平台没有这一层，已在本页补齐讲义要点。',
          fix: ['abc.ABC + @abstractmethod 定义接口，强制子类实现方法，是写框架的常用手段。', '常用模式先掌握三个：工厂（按参数造对象）、策略（把算法换成对象）、单例（__new__ 或模块级实例）。', '元类 type/__metaclass__ 控制类的创建，日常业务几乎用不到，了解即可，别一上来就写。'] },
        { t: '装饰器进阶：带参数装饰器、类装饰器', s: 'none', w: 'course.html#/adv/12', wl: '进阶 第 12 节（延伸）', n: '课堂只有基础装饰器预览，已补齐。',
          fix: ['带参数装饰器是三层嵌套：def repeat(n): → def deco(fn): → def wrapper(*a, **kw):。', '类装饰器用 __call__ 让实例可调用，适合需要保存状态（如计数、缓存）的场景。', '一律加 @functools.wraps(fn)，否则函数名、docstring 会丢失，调试和日志全乱。'] },
        { t: '上下文管理器：contextlib、with 原理', s: 'part', w: 'course.html#/intro/11', wl: '入门 第 11 节', n: '会用了 with，但没讲原理与自定义。',
          fix: ['with 原理：进入时调 __enter__，退出时（无论是否异常）调 __exit__ 负责清理。', '@contextlib.contextmanager 用 yield 把一个生成器快速变成上下文管理器，最省代码。', '典型用途：临时改工作目录、自动关数据库连接、计时器、临时文件清理。'] },
        { t: '多线程：threading、Lock、生产者消费者模型', s: 'none', w: 'index.html#/unit/U8', wl: '题库 U8', n: '题库有题，讲义已补齐。',
          fix: ['threading.Thread(target=fn).start()；I/O 密集任务用线程，CPU 密集因 GIL 用进程。', '共享数据必须加 threading.Lock 或 queue.Queue，否则出现竞态条件。', '生产者消费者：Queue 解耦，put/get + task_done/join，是爬虫与日志管道的通用骨架。'] },
        { t: '多进程：multiprocessing、进程池', s: 'none', w: 'index.html#/unit/U8', wl: '题库 U8', n: '讲义已补齐。',
          fix: ['multiprocessing.Process 绕开 GIL，适合 CPU 密集；进程间数据要用 Queue/Pipe 显式传递。', 'Pool.map / concurrent.futures.ProcessPoolExecutor 做并行批处理和任务池。', 'Windows/macOS 上多进程代码必须放在 if __name__ == "__main__": 里，否则会递归启动。'] },
        { t: '网络编程基础：socket、HTTP 协议、requests 库', s: 'part', w: 'index.html#/unit/P-spider', wl: '题库 P-spider', n: '题库有 requests 相关题；socket/HTTP 原理已补齐。',
          fix: ['HTTP 三件套：请求行/头/体、状态码（200/301/404/500）、GET 与 POST 的区别。', 'socket 是更底层的 TCP/UDP 接口，理解 bind/listen/accept 即可，日常直接用 requests。', 'requests 要点：timeout、headers、Session 复用连接、resp.raise_for_status() 检查状态。'] },
        { t: '数据库操作：SQL 基础、sqlite3、MySQL、SQLAlchemy', s: 'none', w: 'index.html#/unit/U8', wl: '题库 U8（sqlite3）', n: '题库有 sqlite3 题，完整链条已补齐。',
          fix: ['SQL 四件套：SELECT / INSERT / UPDATE / DELETE，配 WHERE、ORDER BY、GROUP BY、JOIN。', 'sqlite3 是标准库、零配置，适合练手与本地工具；MySQL 走 pymysql，注意参数化查询防 SQL 注入。', 'SQLAlchemy 是 ORM，把表映射成类；先会写原生 SQL 再用 ORM，否则不知道它在生成什么。'] },
        { t: '日志记录：logging 模块', s: 'none', w: 'index.html#/unit/U9', wl: '题库 U9', n: '讲义已补齐。',
          fix: ['别再用 print 当日志：logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")。', '五级：DEBUG < INFO < WARNING < ERROR < CRITICAL；用 FileHandler / RotatingFileHandler 写文件并按大小切分。', '库代码里用 logger = logging.getLogger(__name__)，由主程序统一配置输出。'] },
        { t: '项目实践：多线程下载器 / 博客系统后端', s: 'none', w: 'index.html#/bank', wl: '题库项目作业', n: '作为「独立开发前」的练手项目列入待办，讲义要点已补。',
          fix: ['多线程下载器：ThreadPoolExecutor + requests 分段下载 + 进度条 + 失败重试，练并发与异常。', '博客后端：表设计（用户/文章/评论）+ 路由 + 登录会话 + 分页，练数据库与 Web 全链路。', '两个项目都要写 README、pytest 用例和 requirements.txt，才算「能独立开发」的验收物。'] }
      ]
    },
    {
      no: '04', name: '实战阶段', weeks: '2-3 个月', goal: '综合运用知识，完成大型项目', color: '#7c3aed',
      items: [
        { t: 'Web 开发：HTML/CSS/JS 基础、Flask/Django 框架', s: 'part', w: 'course.html#/project/11', wl: '实战 第 11 节', n: '用 FastAPI 讲了路由/参数校验/接口；前端三件套与 Flask/Django 已补齐要点。',
          fix: ['HTML 管结构、CSS 管样式、JS 管交互；后端开发只需会读模板和调接口，不必精通前端。', 'Flask 轻量、一个文件能起服务；Django 自带 ORM/后台/用户体系，重但省事；FastAPI 自带类型校验与 /docs，做 API 最快。', '三者选一个跟到底；接口思维（请求→路由→业务→数据库→响应）是通用的。'] },
        { t: 'RESTful API 开发', s: 'full', w: 'course.html#/project/11', wl: '实战 第 11 节', n: 'Pydantic 请求体、POST /predict、状态码、异常处理、自动文档。' },
        { t: '数据可视化：Matplotlib、Seaborn、Echarts', s: 'part', w: 'course.html#/project/6', wl: '实战 第 6 节', n: 'matplotlib/seaborn 已讲；Echarts 已补齐。',
          fix: ['Matplotlib 控底层（figure/axes/子图），Seaborn 一句画出统计图形。', 'ECharts 是百度开源的 JS 图表库，交互性强；Python 侧用 pyecharts 生成配置，适合做网页大屏。', '选图原则：比较用柱状、分布用直方/箱线、关系用散点、趋势用折线、相关用热力图。'] },
        { t: '爬虫进阶：Scrapy 框架、反爬虫策略、分布式爬虫', s: 'part', w: 'index.html#/unit/P-spider', wl: '题库 P-spider', n: '题库有题，框架层要点已补齐。',
          fix: ['Scrapy 把请求调度、解析、管道入库拆开：Spider / Item / Pipeline / Middleware 四件套。', '合规优先：遵守 robots.txt、限速、标识 UA、只采公开数据；所谓「反爬应对」应理解为「降低对对方服务的压力」。', '分布式爬虫核心是共享待爬队列（Redis）+ 去重集合；初学先把单机 Scrapy 跑通。'] },
        { t: '自动化办公：openpyxl、pandas、python-docx 等', s: 'part', w: 'index.html#/unit/P-auto', wl: '题库 P-auto', n: '题库有项目作业，工具链要点已补齐。',
          fix: ['openpyxl 读写 .xlsx（保留公式与样式），pandas 批量算完后 to_excel 写回。', 'python-docx 生成 Word 报告，python-pptx 生成 PPT；PDF 用 reportlab 生成、pypdf 拆分合并。', '典型流水线：读一批表 → pandas 汇总 → 套模板生成报告 → 邮件自动发送。'] },
        { t: '测试：unittest、pytest', s: 'part', w: 'course.html#/adv/6', wl: '进阶 第 6 节', n: 'pytest 有整节（参数化、raises、边界值）；unittest 已补齐。',
          fix: ['unittest 是标准库，写法是 class TestX(unittest.TestCase) + self.assertEqual，不需要装东西。', 'pytest 更简洁：裸 assert、fixture、parametrize、tmp_path，社区生态更好，新项目优先它。', '两者可共存，pytest 能直接跑 unittest 用例；关键是测边界与异常，不是凑覆盖率。'] },
        { t: '项目部署：Linux 基础、Nginx、Gunicorn、Docker', s: 'none', w: 'index.html#/unit/U9', wl: '题库 U9', n: '原平台完全没有，已补齐最小可用链路。',
          fix: ['Linux 先会 6 条：ls/cd/pwd、grep、chmod、systemctl、journalctl、ssh 与 scp。', '上线链路：Gunicorn/uwsgi 跑 Python 应用 → Nginx 做反向代理与静态文件 → 域名 + HTTPS。', 'Docker 用 Dockerfile 固化环境、docker compose 编排多个服务；先在本机跑通再上云。'] },
        { t: '项目实践：电商数据分析平台 / 在线博客系统 / 爬虫数据可视化平台', s: 'part', w: 'course.html#/project/7', wl: '实战 第 7~12 节', n: '已有完整数据分析→建模→API→大模型项目；三个指定选题作为进阶作业列出。',
          fix: ['电商数据分析：订单表 → 清洗 → GMV/复购率/漏斗 → pyecharts 大屏 → 接口输出。', '在线博客：用户/文章/评论三张表 + 登录 + 分页 + Markdown 渲染 + 部署。', '爬虫可视化平台：定时采集 → 入库 → 定时聚合 → 前端图表，练的是调度与流水线。'] }
      ]
    },
    {
      no: '05', name: '精通阶段（持续学习）', weeks: '长期', goal: '深入技术原理，成为 Python 高手', color: '#0d9488',
      items: [
        { t: '底层原理：解释器原理、GIL 机制、内存管理', s: 'none', w: 'index.html#/unit/U8', wl: '题库 U8', n: '已补齐要点，这部分属于「资深」分界线。',
          fix: ['CPython 执行流程：源码 → 词法/语法分析 → 字节码 .pyc → 解释器循环逐条执行。', 'GIL 保证同一时刻只有一个线程执行字节码，所以 CPU 密集要用多进程，I/O 密集用线程/asyncio 仍有效。', '内存管理：引用计数为主 + 分代 GC 处理循环引用；用 sys.getrefcount、gc 模块与 tracemalloc 排查泄漏。'] },
        { t: '性能优化：代码优化、性能分析、并发与异步（asyncio）', s: 'part', w: 'course.html#/adv/12', wl: '进阶 第 12 节（延伸）', n: '题库 U8 有 asyncio 题；分析与优化方法已补齐。',
          fix: ['先测再优化：timeit 测小段、cProfile 找热点、line_profiler 看逐行耗时，别凭感觉改。', '常见收益：把循环换成内置函数/推导式、用 set 做成员判断、批量 I/O、缓存（functools.lru_cache）。', 'asyncio 用 async/await + 事件循环处理大量并发 I/O；CPU 密集不会变快，别用错场景。'] },
        { t: '领域深入：机器学习（scikit-learn）、深度学习（TensorFlow/PyTorch）、大数据（PySpark）', s: 'part', w: 'course.html#/project/8', wl: '实战 第 8~10 节', n: 'sklearn 建模/评估/流水线已完整；深度学习与大数据已补齐方向说明。',
          fix: ['sklearn 已覆盖：train_test_split、Pipeline、交叉验证、网格搜索、评估指标。', '深度学习选一个框架即可：PyTorch 研究与主流、TensorFlow/Keras 上手快；先跑通 MNIST 再谈原理。', 'PySpark 用 DataFrame API 做分布式处理，只在数据量大到单机装不下时才需要。'] },
        { t: '工程化能力：代码规范（PEP 8）、版本控制（Git）、持续集成/部署（CI/CD）', s: 'part', w: 'course.html#/adv/10', wl: '进阶 第 10 节', n: 'PEP 8/类型注解/Ruff 已讲；Git 与 CI/CD 已补齐。',
          fix: ['Git 最小闭环：clone/add/commit/pull/push/branch/merge；每次提交只做一件事，写清楚提交信息。', '代码规范交给工具：Ruff 查+改、black 格式化、mypy 类型检查，不靠人肉争论。', 'CI/CD：GitHub Actions / GitLab CI 在每次 push 自动跑 pytest 与 lint，通过了才允许合并与部署。'] },
        { t: '开源贡献：阅读源码、提交 Issue 和 PR、参与开源项目', s: 'part', w: 'course.html#/adv/12', wl: '进阶 第 12 节', n: '提交 PR 与长期维护已提；读源码方法已补齐。',
          fix: ['从「你正在用的库」开始读：先找入口函数，沿调用链往下，配合调试器打断点，不要从头通读。', '第一次贡献从 good first issue、文档错别字、测试用例补全覆盖开始，风险低、容易被合并。', 'PR 要写清「改了什么、为什么、怎么验证」，并跑通对方项目的测试与 lint。'] },
        { t: '结语：持续学习，保持好奇心，构建自己的项目，Python 之路无限可能', s: 'full', w: 'index.html#/overview', wl: '首页学习建议', n: '首页「先把这几句话记住」与六步路线第 6 步已对应。' }
      ]
    }
  ],

  advice: [
    '制定学习计划，循序渐进',
    '多敲代码，动手实践',
    '遇到问题，学会搜索和提问',
    '阅读官方文档，培养阅读能力',
    '坚持练习，主动学习',
    '总结与分享，形成知识体系'
  ],

  /* 学习资源导航：严格按图片右侧橙圈，去掉「经典书籍」整组 */
  resources: [
    { g: '官方网站', icon: '🌐', color: '#2563eb', items: [
      { n: 'Python 官网', u: 'https://www.python.org/', d: '下载安装包、查版本与 release 说明' },
      { n: 'Python 官方文档', u: 'https://docs.python.org/', d: '标准库与语言参考；中文版可切 zh-cn' },
      { n: 'Python 官方中文文档', u: 'https://docs.python.org/zh-cn/3/', d: '英文吃力时先看这个（我们额外补的中文入口）' }
    ] },
    { g: '在线教程', icon: '📺', color: '#0d9488', items: [
      { n: '菜鸟教程 Python 3', u: 'https://www.runoob.com/python3/python3-tutorial.html', d: '中文、例子短、随查随用' },
      { n: '廖雪峰 Python 教程', u: 'https://www.liaoxuefeng.com/wiki/1016959663602400', d: '中文文字版，查漏补缺最快' },
      { n: 'Coursera', u: 'https://www.coursera.org/', d: '大学课程平台，多数可免费旁听' },
      { n: 'edX', u: 'https://www.edx.org/', d: '与 Coursera 并列的公开课平台' },
      { n: 'B 站 Python 课程', u: 'https://search.bilibili.com/all?keyword=Python%E6%95%99%E7%A8%8B', d: '中文免费视频集中地' },
      { n: '鱼C论坛（小甲鱼）', u: 'https://fishc.com.cn/', d: '小甲鱼课程配套课后题（中文，我们额外补）' },
      { n: 'Datawhale 开源教程', u: 'https://gitee.com/datawhalechina', d: '中文开源教程：Pandas / 机器学习 / 大模型；Gitee 官方备份，国内直达（我们额外补）' }
    ] },
    { g: '练习平台', icon: '⌨️', color: '#ea580c', items: [
      { n: 'LeetCode（中文站）', u: 'https://leetcode.cn/', d: '算法题，中文界面' },
      { n: '牛客网', u: 'https://www.nowcoder.com/', d: '中文题库 + 面试真题' },
      { n: 'Python Challenge', u: 'https://www.pythonchallenge.com/', d: '解谜式 Python 闯关，练查资料能力' },
      { n: 'Codewars', u: 'https://www.codewars.com/', d: '8kyu 起步的闯关刷题' },
      { n: 'Python123', u: 'https://www.python123.io/', d: '中文自动判题，跟课配套（我们额外补）' },
      { n: '本平台题库', u: 'index.html#/bank', d: '231 题，分单元 / 分专业，带答案' }
    ] },
    { g: '社区与工具', icon: '🧰', color: '#7c3aed', items: [
      { n: 'Stack Overflow', u: 'https://stackoverflow.com/', d: '报错先来这里搜，英文问答库' },
      { n: 'GitHub', u: 'https://github.com/', d: '读源码、找项目、托管自己的代码；国内偶有打不开，可先用 Gitee 搜同名项目' },
      { n: 'PyPI', u: 'https://pypi.org/', d: '第三方库仓库，pip install 的来源' },
      { n: 'VS Code', u: 'https://code.visualstudio.com/', d: '轻量免费编辑器' },
      { n: 'PyCharm', u: 'https://www.jetbrains.com/pycharm/', d: '专业 Python IDE，社区版免费' },
      { n: 'Anaconda', u: 'https://www.anaconda.com/download', d: '数据科学一体化环境（我们额外补）' }
    ] }
  ],

  /* 图片路线里出现、但原 216 个术语尚未收录的英文词汇（补齐词汇积累） */
  vocab: [
    ['Anaconda', 'n.', 'Python 数据科学发行版'], ['PyCharm', 'n.', 'JetBrains 的 Python 集成开发环境'],
    ['virtual environment', 'n.', '虚拟环境'], ['pip', 'n.', 'Python 包管理器'],
    ['lambda', 'n.', '匿名函数'], ['recursion', 'n.', '递归'],
    ['decorator', 'n.', '装饰器'], ['generator', 'n.', '生成器'],
    ['iterator protocol', 'n.', '迭代器协议'], ['generator expression', 'n.', '生成器表达式'],
    ['contextlib', 'n.', '上下文管理器工具模块'], ['__enter__ / __exit__', 'n.', '上下文管理协议方法'],
    ['abstract base class', 'n.', '抽象基类'], ['design pattern', 'n.', '设计模式'],
    ['metaclass', 'n.', '元类'], ['functools.wraps', 'n.', '保留函数元信息的装饰器'],
    ['thread', 'n.', '线程'], ['lock', 'n.', '锁'], ['race condition', 'n.', '竞态条件'],
    ['producer-consumer', 'n.', '生产者消费者模型'], ['queue', 'n.', '队列'],
    ['process', 'n.', '进程'], ['process pool', 'n.', '进程池'],
    ['socket', 'n.', '套接字'], ['HTTP status code', 'n.', 'HTTP 状态码'],
    ['RESTful API', 'n.', 'REST 风格接口'], ['SQL injection', 'n.', 'SQL 注入'],
    ['ORM', 'n.', '对象关系映射'], ['SQLAlchemy', 'n.', 'Python ORM 框架'],
    ['sqlite3', 'n.', '轻量嵌入式数据库'], ['logging', 'n.', '日志'],
    ['handler', 'n.', '日志/事件处理器'], ['Flask', 'n.', '轻量 Web 框架'],
    ['Django', 'n.', '全功能 Web 框架'], ['Matplotlib', 'n.', '基础绘图库'],
    ['Seaborn', 'n.', '统计绘图库'], ['ECharts', 'n.', '百度开源 JS 图表库'],
    ['Scrapy', 'n.', '爬虫框架'], ['robots.txt', 'n.', '爬虫协议文件'],
    ['rate limiting', 'n.', '限速'], ['distributed crawler', 'n.', '分布式爬虫'],
    ['openpyxl', 'n.', 'Excel 读写库'], ['python-docx', 'n.', 'Word 文档库'],
    ['unittest', 'n.', '标准库测试框架'], ['Nginx', 'n.', '反向代理服务器'],
    ['Gunicorn', 'n.', 'Python WSGI 服务器'], ['Docker', 'n.', '容器化平台'],
    ['Dockerfile', 'n.', '镜像构建脚本'], ['reverse proxy', 'n.', '反向代理'],
    ['GIL', 'n.', '全局解释器锁'], ['bytecode', 'n.', '字节码'],
    ['reference counting', 'n.', '引用计数'], ['garbage collection', 'n.', '垃圾回收'],
    ['profiling', 'n.', '性能分析'], ['cProfile', 'n.', '标准库性能分析器'],
    ['asyncio', 'n.', '异步 I/O 标准库'], ['coroutine', 'n.', '协程'],
    ['scikit-learn', 'n.', '机器学习库'], ['TensorFlow', 'n.', '深度学习框架'],
    ['PyTorch', 'n.', '深度学习框架'], ['PySpark', 'n.', 'Spark 的 Python 接口'],
    ['PEP 8', 'n.', 'Python 代码规范'], ['Git', 'n.', '版本控制系统'],
    ['pull request (PR)', 'n.', '拉取请求 / 代码贡献'], ['issue', 'n.', '议题 / 问题单'],
    ['CI/CD', 'n.', '持续集成 / 持续部署'], ['open source', 'n.', '开源']
  ],

  /* 三家中文课对比结论 */
  compare: {
    verdict: '你英语还没起来、又要零基础入门，主线选【小甲鱼】；【黑马程序员】放到第二阶段做进阶主线；【廖雪峰】当字典查，不要当主线。',
    rows: [
      { n: '小甲鱼《零基础入门学习 Python》', lang: '中文视频', role: '✅ 第一阶段主线', url: 'https://fishc.com.cn/',
        good: '风趣、几乎不跳步骤、用生活段子讲抽象概念，零基础最容易坚持；鱼C论坛每讲配课后题，学练闭环。',
        bad: 'B 站旧版合集有更新不全的情况，完整版以鱼C论坛/官网为准；项目偏小，进阶内容不够。',
        fit: '完全零基础、怕枯燥、需要中文讲解的人' },
      { n: '黑马程序员 Python 全套 / 进阶课', lang: '中文视频', role: '✅ 第二阶段主线 + 入门备选', url: 'https://www.bilibili.com/video/BV1ex411x7Em',
        good: '体系最全、练习量最大，覆盖面向对象、闭包、装饰器、生成器、正则、网络、数据库、多任务，正好对上图片的 02/03 阶段。',
        bad: '600 集体量大、节奏偏快、偏就业班风格，零基础直接上容易劝退。',
        fit: '已经会基础语法，想系统补齐进阶与工程能力的人' },
      { n: '廖雪峰 Python 教程', lang: '中文文字', role: '📖 当字典查，不作主线', url: 'https://www.liaoxuefeng.com/wiki/1016959663602400',
        good: '国内打开快、表述精炼，某个语法忘了 30 秒能查到，最适合查漏补缺。',
        bad: '几乎没有配套练习和视频，零基础容易「看懂了但写不出来」——这正是自学者最大的坑。',
        fit: '已有基础，用来快速查语法与概念' }
    ],
    conclusion: [
      '只跟一条主线，别三家同时刷：小甲鱼入门 → 黑马进阶 → 中文项目实战。',
      '每节课右栏 6 个英文专业名词照常学：用中文学技能、同步攒英文词汇，等能独立开发了再切纯英文课，过渡才不疼。',
      '判断标准不是「看完了几集」，而是「合上视频能不能凭记忆把代码敲出来」，看 30% / 敲 70%。'
    ]
  },

  /* 纯英文课程模块（先把框架做好，课程名单等用户指定） */
  english: {
    title: '纯英文课程 · 待解锁',
    rule: '现在先把中文课学完、把技能练到能独立开发；纯英文课程等那时候再开，名单由你指定，我不预先替你选。',
    unlock: [
      { k: '独立完成 1 个完整项目', d: '需求拆解 → 编码 → 测试 → 打包/接口 → 写 README' },
      { k: '题库掌握率 ≥ 80%', d: '231 题中标记「已掌握」的比例' },
      { k: '累计英文术语 ≥ 150 个', d: '课堂右栏标记「已记住」+ 本页词汇表' }
    ],
    slots: [
      { no: 1, hint: '英文主课程 ① · 等你告诉我课程名，我填链接和目录' },
      { no: 2, hint: '英文主课程 ② · 等你告诉我课程名，我填链接和目录' },
      { no: 3, hint: '英文刷题 / 阅读 ③ · 等你告诉我课程名，我填链接和目录' },
      { no: 4, hint: '英文官方文档 / 源码阅读 ④ · 等你告诉我课程名，我填链接和目录' }
    ],
    note: '原路线里排的哈佛 CS50P、Kaggle Learn 属于纯英文课程，已按你的要求移到本模块「待定」，现在不作为学习任务；等你指定名单后我再逐节做目录、练习与英文词汇。',
    parking: [
      { n: "CS50's Introduction to Programming with Python（CS50P）", u: 'https://cs50.harvard.edu/python/', d: '哈佛 · 英文授课，problem set 自动判分' },
      { n: 'Kaggle Learn 微课程', u: 'https://www.kaggle.com/learn', d: '英文 · 浏览器内 Notebook，数据 / ML 方向' },
      { n: 'Python for Everybody（密歇根大学）', u: 'https://www.py4e.com/', d: '英文 · 节奏最慢，适合过渡期第一门' },
      { n: 'Real Python', u: 'https://realpython.com/', d: '英文 · 中高级专题文章与教程' }
    ]
  }
};
