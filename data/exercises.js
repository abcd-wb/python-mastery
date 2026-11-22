/* 作业及练习：按四门 Python 课的中文目录逐章对应。参考 MIT 6.0001/6.009 Problem Set 体例。 */
window.EXERCISES = {
 "meta": {
  "title": "作业及练习",
  "source": "参考 MIT 6.0001 / 6.009 的 Problem Set 体例：题目要求 → 自测用例 → 参考实现",
  "note": "每章两题：一道编程作业（含自测用例）+ 一道概念练习。先自己写，再点开参考答案。"
 },
 "intro": {
  "name": "Python 入门",
  "chapters": [
   {
    "id": "i1",
    "n": "第1章",
    "name": "导学与初识 Python",
    "tasks": [
     {
      "k": "作业",
      "t": "会说话的自我介绍",
      "q": "写程序：输入姓名和年龄，输出 “Hi, I am <姓名>, <年龄> years old.”",
      "test": "输入 Alice / 20 → Hi, I am Alice, 20 years old.",
      "a": "name = input('姓名: ')\nage = int(input('年龄: '))\nprint(f'Hi, I am {name}, {age} years old.')"
     },
     {
      "k": "练习",
      "t": "注释与 print",
      "q": "给上一题加一行注释说明程序作用，并用 print 输出 3 行不同文字。",
      "a": "# 打印一段自我介绍\nprint('Hello')\nprint('Python')\nprint('World')"
     }
    ]
   },
   {
    "id": "i2",
    "n": "第2章",
    "name": "基础语法",
    "tasks": [
     {
      "k": "作业",
      "t": "温度换算",
      "q": "输入摄氏度，输出华氏度（F = C*9/5+32），保留一位小数。",
      "test": "输入 100 → 212.0",
      "a": "c = float(input())\nf = c * 9 / 5 + 32\nprint(f'{f:.1f}')"
     },
     {
      "k": "练习",
      "t": "字符串拼接与格式化",
      "q": "用两种方式输出 “a + b = 3”：f-string 与 % 格式化。",
      "a": "a, b = 1, 2\nprint(f'a + b = {a+b}')\nprint('a + b = %d' % (a+b))"
     }
    ]
   },
   {
    "id": "i3",
    "n": "第3章",
    "name": "判断语句",
    "tasks": [
     {
      "k": "作业",
      "t": "BMI 分级",
      "q": "输入身高(m)与体重(kg)，按 BMI 输出：偏瘦(<18.5)、正常(<24)、超重(<28)、肥胖。",
      "test": "1.7, 60 → 正常（BMI≈20.8）",
      "a": "h = float(input()); w = float(input())\nbmi = w / h ** 2\nif bmi < 18.5: print('偏瘦')\nelif bmi < 24: print('正常')\nelif bmi < 28: print('超重')\nelse: print('肥胖')"
     },
     {
      "k": "练习",
      "t": "闰年判断",
      "q": "写表达式判断 year 是否闰年（能被4整除且不能被100整除，或能被400整除）。",
      "a": "year = int(input())\nprint((year % 4 == 0 and year % 100 != 0) or year % 400 == 0)"
     }
    ]
   },
   {
    "id": "i4",
    "n": "第4章",
    "name": "循环语句",
    "tasks": [
     {
      "k": "作业",
      "t": "猜数字（最多 5 次）",
      "q": "随机生成 1~100 的数，玩家最多猜 5 次，每次提示大/小，猜中用 break。",
      "test": "猜中即结束；5 次用完提示答案",
      "a": "import random\nsecret = random.randint(1, 100)\nfor i in range(5):\n    g = int(input('猜: '))\n    if g == secret:\n        print('猜中了'); break\n    print('大了' if g > secret else '小了')\nelse:\n    print('答案是', secret)"
     },
     {
      "k": "练习",
      "t": "打印九九乘法表",
      "q": "用嵌套 for 循环打印下三角九九乘法表（用 \\t 对齐）。",
      "a": "for i in range(1, 10):\n    for j in range(1, i+1):\n        print(f'{j}x{i}={i*j}', end='\\t')\n    print()"
     }
    ]
   },
   {
    "id": "i5",
    "n": "第5章",
    "name": "函数",
    "tasks": [
     {
      "k": "作业",
      "t": "判断素数",
      "q": "定义 is_prime(n)，返回 True/False；只检查到 sqrt(n)。",
      "test": "is_prime(7)→True, is_prime(9)→False, is_prime(1)→False",
      "a": "def is_prime(n):\n    if n < 2: return False\n    i = 2\n    while i * i <= n:\n        if n % i == 0: return False\n        i += 1\n    return True"
     },
     {
      "k": "练习",
      "t": "默认参数与返回值",
      "q": "定义 greet(name, times=1)，返回重复 times 次的问候字符串。",
      "a": "def greet(name, times=1):\n    return ('Hi, ' + name + '!\\n') * times\nprint(greet('Tom', 2), end='')"
     }
    ]
   },
   {
    "id": "i6",
    "n": "第6章",
    "name": "数据容器",
    "tasks": [
     {
      "k": "作业",
      "t": "词频统计",
      "q": "给定字符串，统计每个单词出现次数，按次数降序输出。",
      "test": "'a b a c b a' → a:3 b:2 c:1",
      "a": "s = 'a b a c b a'\nd = {}\nfor w in s.split():\n    d[w] = d.get(w, 0) + 1\nfor w, n in sorted(d.items(), key=lambda x: -x[1]):\n    print(w, n)"
     },
     {
      "k": "练习",
      "t": "列表去重保序",
      "q": "把 [3,1,2,3,2] 去重且保持原顺序。",
      "a": "xs = [3,1,2,3,2]\nout = []\nfor x in xs:\n    if x not in out: out.append(x)\nprint(out)  # [3, 1, 2]"
     }
    ]
   },
   {
    "id": "i7",
    "n": "第7章",
    "name": "函数进阶",
    "tasks": [
     {
      "k": "作业",
      "t": "多返回值与解包",
      "q": "定义 stats(nums) 返回 (最大值, 最小值, 平均值)，调用时解包。",
      "test": "[1,2,3,4] → (4, 1, 2.5)",
      "a": "def stats(nums):\n    return max(nums), min(nums), sum(nums)/len(nums)\nhi, lo, avg = stats([1,2,3,4])\nprint(hi, lo, avg)"
     },
     {
      "k": "练习",
      "t": "递归求阶乘",
      "q": "用递归写 fact(n)，并说明递归终止条件。",
      "a": "def fact(n):\n    if n <= 1: return 1   # 终止条件\n    return n * fact(n-1)\nprint(fact(5))  # 120"
     }
    ]
   },
   {
    "id": "i8",
    "n": "第8章",
    "name": "文件操作",
    "tasks": [
     {
      "k": "作业",
      "t": "统计文件行数与字符数",
      "q": "打开一个文本文件，统计行数、字符数，并把结果写入 out.txt。",
      "test": "3 行文本 → lines=3, chars=...",
      "a": "with open('in.txt', encoding='utf-8') as f:\n    text = f.read()\nlines = len(text.splitlines())\nchars = len(text)\nwith open('out.txt', 'w', encoding='utf-8') as f:\n    f.write(f'lines={lines}\\nchars={chars}\\n')"
     },
     {
      "k": "练习",
      "t": "逐行读取",
      "q": "用 for line in f 逐行读，打印带行号的内容。",
      "a": "with open('in.txt', encoding='utf-8') as f:\n    for i, line in enumerate(f, 1):\n        print(i, line.rstrip())"
     }
    ]
   },
   {
    "id": "i9",
    "n": "第9章",
    "name": "异常、模块与包",
    "tasks": [
     {
      "k": "作业",
      "t": "安全的除法",
      "q": "写 safe_div(a,b)，捕获除零和类型错误，失败返回 None 并打印原因。",
      "test": "safe_div(1,0) → None + 提示",
      "a": "def safe_div(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        print('除数不能为 0'); return None\n    except TypeError:\n        print('参数类型不对'); return None"
     },
     {
      "k": "练习",
      "t": "自定义模块",
      "q": "把 is_prime 放进 mymath.py，在另一文件 import mymath 并调用。",
      "a": "# mymath.py\ndef is_prime(n): ...\n# main.py\nimport mymath\nprint(mymath.is_prime(7))"
     }
    ]
   },
   {
    "id": "i10",
    "n": "第10章",
    "name": "综合案例 · JSON 与图表",
    "tasks": [
     {
      "k": "作业",
      "t": "JSON 读写",
      "q": "把字典存为 JSON 文件，再读回来并验证数据一致。",
      "test": "{'name':'Tom','score':90} 往返一致",
      "a": "import json\nd = {'name':'Tom', 'score':90}\nwith open('d.json','w') as f: json.dump(d, f)\nwith open('d.json') as f: d2 = json.load(f)\nprint(d2 == d)"
     },
     {
      "k": "练习",
      "t": "列表推导式",
      "q": "用推导式从字典列表里抽出所有 score>60 的名字。",
      "a": "rows = [{'n':'A','score':80},{'n':'B','score':50}]\nprint([r['n'] for r in rows if r['score'] > 60])"
     }
    ]
   },
   {
    "id": "i11",
    "n": "第11章",
    "name": "数据可视化 · 地图",
    "tasks": [
     {
      "k": "作业",
      "t": "城市坐标数据准备",
      "q": "把城市名与经纬度整理成 [(name, lng, lat)] 结构，供地图使用。",
      "test": "北京 → (116.4, 39.9)",
      "a": "cities = [('北京', 116.4, 39.9), ('上海', 121.5, 31.2)]\nfor name, lng, lat in cities:\n    print(f'{name}: {lng},{lat}')"
     },
     {
      "k": "练习",
      "t": "数据清洗",
      "q": "过滤掉经纬度为 0 的脏数据。",
      "a": "data = [('A',116,39),('B',0,0)]\nclean = [x for x in data if x[1] and x[2]]\nprint(clean)"
     }
    ]
   },
   {
    "id": "i12",
    "n": "第12章",
    "name": "数据可视化 · 柱状图",
    "tasks": [
     {
      "k": "作业",
      "t": "绘制柱状图",
      "q": "用 pyecharts 画各城市销量的柱状图，保存为 html。",
      "test": "生成 bar.html",
      "a": "from pyecharts.charts import Bar\nfrom pyecharts import options as opts\nc = ['A','B','C']; v = [10,20,15]\nbar = Bar().add_xaxis(c).add_yaxis('销量', v)\nbar.render('bar.html')"
     },
     {
      "k": "练习",
      "t": "排序后再画",
      "q": "按销量降序排列再画图。",
      "a": "pairs = sorted(zip(c, v), key=lambda x: -x[1])\nc = [x[0] for x in pairs]; v = [x[1] for x in pairs]"
     }
    ]
   },
   {
    "id": "i13",
    "n": "第13章",
    "name": "面向对象",
    "tasks": [
     {
      "k": "作业",
      "t": "定义 Student 类",
      "q": "属性 name/score，方法 show() 输出信息；创建两个对象并调用。",
      "test": "Student('Tom',90).show() → Tom: 90",
      "a": "class Student:\n    def __init__(self, name, score):\n        self.name, self.score = name, score\n    def show(self):\n        print(f'{self.name}: {self.score}')\nStudent('Tom', 90).show()"
     },
     {
      "k": "练习",
      "t": "self 的作用",
      "q": "说明为什么方法第一个参数必须是 self，并写一个修改属性的方法。",
      "a": "def set_score(self, s):\n    self.score = s  # self 指向实例本身\n# self 是实例引用，没有它就无法访问该对象的属性"
     }
    ]
   },
   {
    "id": "i14",
    "n": "第14章",
    "name": "MySQL 数据库",
    "tasks": [
     {
      "k": "作业",
      "t": "建表与插入",
      "q": "写 SQL 建 students 表(id, name, score)并插入两条记录。",
      "test": "SELECT * 返回两行",
      "a": "CREATE TABLE students (id INT PRIMARY KEY, name VARCHAR(20), score INT);\nINSERT INTO students VALUES (1,'Tom',90),(2,'Ana',85);"
     },
     {
      "k": "练习",
      "t": "条件查询",
      "q": "查询 score>=90 的学生姓名与分数。",
      "a": "SELECT name, score FROM students WHERE score >= 90;"
     }
    ]
   },
   {
    "id": "i15",
    "n": "第15章",
    "name": "PySpark 大数据",
    "tasks": [
     {
      "k": "作业",
      "t": "RDD 词频统计",
      "q": "用 Spark RDD 实现 WordCount，按出现次数降序取前 3。",
      "test": "'a b a' → a:2 b:1",
      "a": "from pyspark import SparkContext\nsc = SparkContext('local','wc')\nr = sc.textFile('a.txt').flatMap(lambda s: s.split())\nprint(r.map(lambda w:(w,1)).reduceByKey(lambda a,b:a+b).takeOrdered(3,key=lambda x:-x[1]))"
     },
     {
      "k": "练习",
      "t": "flatMap 与 map 区别",
      "q": "说明 flatMap 与 map 的区别并各举一例。",
      "a": "# map 一进一出，flatMap 一进多出并摊平\nr.map(lambda s: s.split())      # [['a','b'],['c']]\nr.flatMap(lambda s: s.split())  # ['a','b','c']"
     }
    ]
   },
   {
    "id": "i16",
    "n": "第16章",
    "name": "闭包、装饰器与设计模式",
    "tasks": [
     {
      "k": "作业",
      "t": "计时装饰器",
      "q": "写 timer 装饰器打印函数运行耗时。",
      "test": "调用 sleep(1) → 打印约 1.0s",
      "a": "import time\ndef timer(fn):\n    def wrap(*a, **kw):\n        t = time.time(); r = fn(*a, **kw)\n        print(f'{fn.__name__} 用时 {time.time()-t:.2f}s'); return r\n    return wrap\n@timer\ndef f(): time.sleep(1)"
     },
     {
      "k": "练习",
      "t": "闭包计数器",
      "q": "写 make_counter() 返回每次调用加 1 的函数。",
      "a": "def make_counter():\n    n = 0\n    def counter():\n        nonlocal n\n        n += 1; return n\n    return counter"
     }
    ]
   },
   {
    "id": "i17",
    "n": "第17章",
    "name": "多线程与 Socket",
    "tasks": [
     {
      "k": "作业",
      "t": "多线程下载计数",
      "q": "开 4 个线程各累加 100000 次，观察是否需要加锁。",
      "test": "不加锁结果可能小于 400000",
      "a": "import threading\nn = 0\nlock = threading.Lock()\ndef add():\n    global n\n    for _ in range(100000):\n        with lock: n += 1\nts = [threading.Thread(target=add) for _ in range(4)]\n[t.start() for t in ts]; [t.join() for t in ts]\nprint(n)  # 400000"
     },
     {
      "k": "练习",
      "t": "Socket 回显",
      "q": "写出客户端发送一条消息并接收服务端回显的核心代码。",
      "a": "import socket\ns = socket.socket(); s.connect(('127.0.0.1', 8888))\ns.sendall(b'hello')\nprint(s.recv(1024).decode()); s.close()"
     }
    ]
   },
   {
    "id": "i18",
    "n": "第18章",
    "name": "正则表达式与递归",
    "tasks": [
     {
      "k": "作业",
      "t": "提取手机号",
      "q": "用正则从文本中提取所有 11 位手机号。",
      "test": "'电话13800138000' → ['13800138000']",
      "a": "import re\ns = '电话13800138000和13912345678'\nprint(re.findall(r'1\\d{10}', s))"
     },
     {
      "k": "练习",
      "t": "递归遍历目录",
      "q": "用递归列出目录下所有 .py 文件。",
      "a": "import os\ndef walk(path):\n    for f in os.listdir(path):\n        p = os.path.join(path, f)\n        if os.path.isdir(p): walk(p)\n        elif p.endswith('.py'): print(p)"
     }
    ]
   }
  ]
 },
 "adv": {
  "name": "Python 进阶",
  "chapters": [
   {
    "id": "a1",
    "n": "第1章",
    "name": "面向对象基础",
    "tasks": [
     {
      "k": "作业",
      "t": "类属性与实例属性",
      "q": "定义 Dog 类，有类属性 kind 和实例属性 name，验证两者区别。",
      "test": "Dog.kind='犬科'; d=Dog('旺财')",
      "a": "class Dog:\n    kind = '犬科'\n    def __init__(self, name): self.name = name\nd = Dog('旺财')\nprint(Dog.kind, d.name, d.kind)"
     },
     {
      "k": "练习",
      "t": "方法定义",
      "q": "给 Dog 加 bark() 方法，输出 “<name> 汪汪”。",
      "a": "def bark(self):\n    print(f'{self.name} 汪汪')"
     }
    ]
   },
   {
    "id": "a2",
    "n": "第2章",
    "name": "面向对象高级",
    "tasks": [
     {
      "k": "作业",
      "t": "继承与方法重写",
      "q": "定义 Animal 与子类 Cat，重写 speak()。",
      "test": "Cat('咪咪').speak() → 咪咪: 喵",
      "a": "class Animal:\n    def __init__(self, name): self.name = name\n    def speak(self): print(self.name)\nclass Cat(Animal):\n    def speak(self): print(f'{self.name}: 喵')\nCat('咪咪').speak()"
     },
     {
      "k": "练习",
      "t": "多态",
      "q": "写函数 make_speak(a) 接收任意 Animal 子类并调用 speak()。",
      "a": "def make_speak(a): a.speak()\nmake_speak(Cat('咪咪'))"
     }
    ]
   },
   {
    "id": "a3",
    "n": "第3章",
    "name": "闭包与装饰器",
    "tasks": [
     {
      "k": "作业",
      "t": "带参数的装饰器",
      "q": "写 repeat(n) 装饰器让函数重复执行 n 次。",
      "test": "@repeat(3) 的函数打印 3 行",
      "a": "def repeat(n):\n    def deco(fn):\n        def wrap(*a, **kw):\n            for _ in range(n): r = fn(*a, **kw)\n            return r\n        return wrap\n    return deco"
     },
     {
      "k": "练习",
      "t": "闭包变量",
      "q": "说明闭包为何能记住外部变量，写出计数器闭包。",
      "a": "# 内层函数引用外层变量，外层返回后该变量仍被引用而保留\ndef counter():\n    n = 0\n    def inc():\n        nonlocal n; n += 1; return n\n    return inc"
     }
    ]
   },
   {
    "id": "a4",
    "n": "第4章",
    "name": "网络编程与多线程",
    "tasks": [
     {
      "k": "作业",
      "t": "并发请求器",
      "q": "用线程池并发抓取多个 URL 并返回状态码。",
      "test": "3 个 URL → 3 个状态码",
      "a": "from concurrent.futures import ThreadPoolExecutor\nimport urllib.request\ndef get(u):\n    try: return urllib.request.urlopen(u, timeout=5).status\n    except Exception as e: return str(e)\nwith ThreadPoolExecutor(4) as ex:\n    print(list(ex.map(get, urls)))"
     },
     {
      "k": "练习",
      "t": "线程安全问题",
      "q": "说明为什么共享计数要加锁。",
      "a": "# n+=1 不是原子操作（读-改-写），多线程交错会丢失更新，需 Lock 保护"
     }
    ]
   },
   {
    "id": "a5",
    "n": "第5章",
    "name": "生成器与正则",
    "tasks": [
     {
      "k": "作业",
      "t": "斐波那契生成器",
      "q": "用 yield 写 fib(n) 生成器并逐个打印。",
      "test": "fib(5) → 1 1 2 3 5",
      "a": "def fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        a, b = b, a+b\n        yield a\nprint(list(fib(5)))"
     },
     {
      "k": "练习",
      "t": "正则分组",
      "q": "用分组提取 “姓名:年龄” 中的两部分。",
      "a": "import re\nm = re.match(r'(\\w+):(\\d+)', 'Tom:20')\nprint(m.group(1), m.group(2))"
     }
    ]
   },
   {
    "id": "a6",
    "n": "第6章",
    "name": "数据结构 · 链表",
    "tasks": [
     {
      "k": "作业",
      "t": "单链表反转",
      "q": "实现 Node 与 reverse(head)，返回新头节点。",
      "test": "1→2→3 反转为 3→2→1",
      "a": "class Node:\n    def __init__(self, v): self.v, self.next = v, None\ndef reverse(head):\n    prev = None\n    while head:\n        nxt = head.next\n        head.next = prev\n        prev = head\n        head = nxt\n    return prev"
     },
     {
      "k": "练习",
      "t": "链表判环",
      "q": "用快慢指针判断链表是否有环。",
      "a": "def has_cycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next; fast = fast.next.next\n        if slow is fast: return True\n    return False"
     }
    ]
   },
   {
    "id": "a7",
    "n": "第7章",
    "name": "算法 · 排序与二叉树",
    "tasks": [
     {
      "k": "作业",
      "t": "快速排序",
      "q": "实现 quicksort(nums) 返回升序新列表。",
      "test": "[3,1,4,1,5] → [1,1,3,4,5]",
      "a": "def quicksort(xs):\n    if len(xs) <= 1: return xs\n    p = xs[0]\n    return quicksort([x for x in xs[1:] if x < p]) + [p] + \\\n           quicksort([x for x in xs[1:] if x >= p])"
     },
     {
      "k": "练习",
      "t": "二叉树遍历",
      "q": "写二叉树的先序遍历（递归）。",
      "a": "def preorder(root):\n    if not root: return []\n    return [root.v] + preorder(root.left) + preorder(root.right)"
     }
    ]
   }
  ]
 },
 "project": {
  "name": "项目实战",
  "chapters": [
   {
    "id": "p1",
    "n": "第1章",
    "name": "Linux 基础",
    "tasks": [
     {
      "k": "作业",
      "t": "常用命令",
      "q": "写出：列出文件、进入目录、查看当前路径、查找 .py 文件的命令。",
      "test": "在终端逐条执行",
      "a": "ls -la\ncd /tmp\npwd\nfind . -name '*.py'"
     },
     {
      "k": "练习",
      "t": "管道与 grep",
      "q": "统计一个日志文件中 ERROR 出现的行数。",
      "a": "grep -c 'ERROR' app.log"
     }
    ]
   },
   {
    "id": "p2",
    "n": "第2章",
    "name": "MySQL 基础",
    "tasks": [
     {
      "k": "作业",
      "t": "建库建表",
      "q": "创建 shop 库和 orders 表(id, user, amount, ts)。",
      "test": "SHOW TABLES 能看到 orders",
      "a": "CREATE DATABASE shop;\nUSE shop;\nCREATE TABLE orders (id INT PRIMARY KEY AUTO_INCREMENT, user VARCHAR(20), amount DECIMAL(10,2), ts DATETIME);"
     },
     {
      "k": "练习",
      "t": "插入与查询",
      "q": "插入一条订单并按金额降序查询。",
      "a": "INSERT INTO orders(user,amount,ts) VALUES('Tom',99.5,NOW());\nSELECT * FROM orders ORDER BY amount DESC;"
     }
    ]
   },
   {
    "id": "p3",
    "n": "第3章",
    "name": "MySQL 进阶",
    "tasks": [
     {
      "k": "作业",
      "t": "分组聚合",
      "q": "按 user 分组，统计每人订单数与总金额。",
      "test": "结果含 user/cnt/sum",
      "a": "SELECT user, COUNT(*) cnt, SUM(amount) total FROM orders GROUP BY user ORDER BY total DESC;"
     },
     {
      "k": "练习",
      "t": "多表 JOIN",
      "q": "写 orders 与 users 按 user_id 关联查出用户名。",
      "a": "SELECT u.name, o.amount FROM orders o JOIN users u ON o.user_id=u.id;"
     }
    ]
   },
   {
    "id": "p4",
    "n": "第4章",
    "name": "NumPy 入门",
    "tasks": [
     {
      "k": "作业",
      "t": "数组运算",
      "q": "创建 3x3 随机数组，求每行均值与整体最大值。",
      "test": "输出形状 (3,) 的均值与一个标量最大值",
      "a": "import numpy as np\na = np.random.rand(3,3)\nprint(a.mean(axis=1))\nprint(a.max())"
     },
     {
      "k": "练习",
      "t": "布尔索引",
      "q": "取出数组中大于 0.5 的元素。",
      "a": "print(a[a > 0.5])"
     }
    ]
   },
   {
    "id": "p5",
    "n": "第5章",
    "name": "Pandas 基础",
    "tasks": [
     {
      "k": "作业",
      "t": "读取与清洗",
      "q": "用 pd.read_csv 读数据，查看前 5 行、缺失值数量，并删除缺失行。",
      "test": "df.isnull().sum() 输出各列缺失数",
      "a": "import pandas as pd\ndf = pd.read_csv('data.csv')\nprint(df.head())\nprint(df.isnull().sum())\ndf = df.dropna()"
     },
     {
      "k": "练习",
      "t": "筛选与排序",
      "q": "筛选 score>60 的行并按 score 降序。",
      "a": "df2 = df[df.score > 60].sort_values('score', ascending=False)"
     }
    ]
   },
   {
    "id": "p6",
    "n": "第6章",
    "name": "Pandas 进阶",
    "tasks": [
     {
      "k": "作业",
      "t": "分组透视",
      "q": "按用户与月份统计消费总额，生成透视表。",
      "test": "行=用户，列=月份",
      "a": "df['month'] = df.ts.dt.to_period('M')\npv = df.pivot_table(index='user', columns='month', values='amount', aggfunc='sum')\nprint(pv)"
     },
     {
      "k": "练习",
      "t": "合并数据",
      "q": "用 merge 把订单表和用户表按 user_id 合并。",
      "a": "m = pd.merge(orders, users, on='user_id', how='left')"
     }
    ]
   },
   {
    "id": "p7",
    "n": "第7章",
    "name": "数据可视化",
    "tasks": [
     {
      "k": "作业",
      "t": "销量趋势图",
      "q": "用 matplotlib 画月度销量折线图，加标题和坐标轴标签。",
      "test": "生成可读的趋势图",
      "a": "import matplotlib.pyplot as plt\nplt.plot(months, sales, marker='o')\nplt.title('月度销量'); plt.xlabel('月份'); plt.ylabel('销量')\nplt.xticks(rotation=45); plt.tight_layout(); plt.show()"
     },
     {
      "k": "练习",
      "t": "子图",
      "q": "用 subplots 画 1 行 2 列的柱状图与折线图。",
      "a": "fig, ax = plt.subplots(1, 2, figsize=(12,4))\nax[0].bar(months, sales); ax[1].plot(months, sales)"
     }
    ]
   },
   {
    "id": "p8",
    "n": "第8章",
    "name": "实战项目 · RFM 用户分层",
    "tasks": [
     {
      "k": "作业",
      "t": "计算 RFM",
      "q": "按用户计算 R(最近购买距今天数)、F(购买次数)、M(消费总额)。",
      "test": "输出每人三个指标",
      "a": "now = df.ts.max()\nrfm = df.groupby('user').agg(\n    R=('ts', lambda s: (now - s.max()).days),\n    F=('id', 'count'),\n    M=('amount', 'sum'))\nprint(rfm.head())"
     },
     {
      "k": "练习",
      "t": "打标签",
      "q": "按 RFM 分值把用户分为「重要价值 / 重要保持 / 一般」三类。",
      "a": "rfm['label'] = '一般'\nrfm.loc[(rfm.R<30)&(rfm.F>3), 'label'] = '重要价值'\nrfm.loc[(rfm.R>=30)&(rfm.M>1000), 'label'] = '重要保持'"
     }
    ]
   }
  ]
 },
 "ai": {
  "name": "AI 应用实战",
  "chapters": [
   {
    "id": "ai1",
    "n": "模块一",
    "name": "AI Python 基础：写出第一段代码",
    "tasks": [
     {
      "k": "作业",
      "t": "让 AI 写第一个函数",
      "q": "用自然语言让聊天机器人写出“把 Celsius 转 Fahrenheit”的函数，并自己跑通。",
      "test": "c2f(100) → 212.0",
      "a": "# Prompt: 写一个 Python 函数 c2f(c)，返回华氏度\ndef c2f(c):\n    return c * 9 / 5 + 32\nprint(c2f(100))"
     },
     {
      "k": "练习",
      "t": "看懂 AI 给的代码",
      "q": "在 AI 生成的代码旁加注释，逐行说明它在做什么。",
      "a": "# 关键：先读懂再运行，不要直接复制。注释出变量含义、返回值含义即可"
     }
    ]
   },
   {
    "id": "ai2",
    "n": "模块二",
    "name": "自动化：让 Python 替你重复干活",
    "tasks": [
     {
      "k": "作业",
      "t": "批量重命名",
      "q": "写脚本把某目录下所有 .txt 文件按序号重命名。",
      "test": "a.txt→1.txt, b.txt→2.txt",
      "a": "import os\nfor i, f in enumerate(sorted(os.listdir('.')), 1):\n    if f.endswith('.txt'):\n        os.rename(f, f'{i}.txt')"
     },
     {
      "k": "练习",
      "t": "for 循环处理列表",
      "q": "用 for 循环把列表中所有字符串转成大写。",
      "a": "words = ['hi','python']\nprint([w.upper() for w in words])"
     }
    ]
   },
   {
    "id": "ai3",
    "n": "模块三",
    "name": "处理你自己的数据和文档",
    "tasks": [
     {
      "k": "作业",
      "t": "从 CSV 抽信息",
      "q": "读自己的 CSV，抽出某列并统计唯一值数量。",
      "test": "输出唯一值个数",
      "a": "import pandas as pd\ndf = pd.read_csv('my.csv')\nprint(df['city'].nunique())"
     },
     {
      "k": "练习",
      "t": "按条件过滤",
      "q": "过滤出金额大于 100 的记录并保存成新文件。",
      "a": "df[df.amount > 100].to_csv('big.csv', index=False)"
     }
    ]
   },
   {
    "id": "ai4",
    "n": "模块四",
    "name": "扩展：包与 API，接上大模型",
    "tasks": [
     {
      "k": "作业",
      "t": "调用大模型 API",
      "q": "用 pip 装好 SDK，写脚本调用模型回答一个问题并打印结果。",
      "test": "终端输出模型回答",
      "a": "from openai import OpenAI\nc = OpenAI(base_url='...', api_key='...')\nr = c.chat.completions.create(model='...', messages=[{'role':'user','content':'用一句话解释 Python'}])\nprint(r.choices[0].message.content)"
     },
     {
      "k": "练习",
      "t": "管理密钥",
      "q": "说明为什么不能把 API key 写死在代码里，并写出从环境变量读取的方法。",
      "a": "import os\nkey = os.environ['API_KEY']  # 密钥放环境变量，不进代码仓库"
     }
    ]
   }
  ]
 }
};
