/* 第一阶段 · Python 入门 · 12 节课（主线：小甲鱼《零基础入门学习 Python》） */
window.COURSE_LESSONS.intro = [
{
  n: 1, t: '装好环境，写下第一行代码',
  goal: '能自己装好 Python 与编辑器、运行 .py 文件，并看懂最简单的报错。',
  ref: '小甲鱼 第 001~005 讲：搭建环境 / print / 第一个程序',
  pts: [
    'Python 是解释型语言：写完直接运行，不需要编译。命令行用 python hello.py（Mac/Linux 常为 python3）。',
    '安装时务必勾选 Add Python to PATH，否则命令行找不到 python；用 python --version 验证。',
    'print() 负责输出，input() 读取键盘输入且永远返回字符串。',
    '# 开头是注释；缩进是 Python 的语法，不是排版。',
    '看懂 Traceback：从最后一行读错误类型与提示，再往上看出错的文件和行号。'
  ],
  code: `# hello.py —— 第一个 Python 程序
print("Hello, Python!")

name = input("你叫什么名字？")
print(f"你好，{name}，欢迎开始 Python 之旅")`,
  note: 'f-string 用 f"...{变量}" 把变量嵌进字符串；这是 Python 3.6+ 最推荐的格式化写法。',
  ex: [
    E('在命令行运行 hello.py 应该输入什么？若提示「python 不是内部或外部命令」怎么解决？',
      '输入 python hello.py（Mac/Linux 可能是 python3 hello.py）。报这个错说明安装时没勾选 Add Python to PATH：重新运行安装包勾上，或手动把 Python 安装目录加入系统环境变量 PATH 后重开终端。', '关键词：PATH'),
    E('print("1" + "2") 和 print(1 + 2) 分别输出什么？为什么？',
      '前者输出 12（两个字符串拼接），后者输出 3（两个整数相加）。引号决定数据的类型，类型决定 + 的含义。', ''),
    E('写一行代码，把 age = 18 输出成「小明今年 18 岁」。',
      'age = 18; print(f"小明今年 {age} 岁")。也可以写 print("小明今年", age, "岁")。', '')
  ],
  hw: '新建 hello.py，输出你的名字、今天的日期和一句学习目标；然后故意删掉一个括号运行一次，把 Traceback 最后一行抄下来并写出它的意思。',
  u: 'U0',
  terms: [
    T('interpreter', 'n.', '解释器', 'The Python interpreter runs your script line by line.', 'Python 解释器逐行执行你的脚本。'),
    T('script', 'n.', '脚本', 'Save the code in a script named hello.py.', '把代码保存为名为 hello.py 的脚本。'),
    T('REPL', 'n.', '交互式命令行', 'Type python to open the REPL and try one line at a time.', '输入 python 打开交互式命令行，一次试一行。'),
    T('comment', 'n.', '注释', 'A comment starts with a hash and is ignored by Python.', '注释以 # 开头，Python 不会执行它。'),
    T('syntax', 'n.', '语法', 'A missing bracket causes a syntax error.', '少写一个括号会导致语法错误。'),
    T('output', 'n.', '输出', 'The output of print() appears in the terminal.', 'print() 的输出显示在终端里。')
  ]
},
{
  n: 2, t: '变量、数据类型与类型转换',
  goal: '分清 int / float / str / bool，会按需转换类型，不再被 input() 坑到。',
  ref: '小甲鱼 第 006~012 讲：变量 / 字符串 / 数值类型',
  pts: [
    '变量是贴在数据上的标签：name = "Tom" 是把字符串对象绑到 name 这个名字上。',
    '四种基本类型：int（整数）、float（小数）、str（文本）、bool（True / False）。用 type(x) 查看。',
    'input() 返回的永远是字符串，"18" + 1 会报错，必须先 int()。',
    'str() / int() / float() 做显式转换；转换失败会抛 ValueError。',
    '命名用小写字母加下划线（user_age），见名知意，不要用关键字当变量名。'
  ],
  code: `age = input("请输入年龄：")
print(type(age))            # <class 'str'>

age = int(age)
print(type(age))            # <class 'int'>
print(f"明年你 {age + 1} 岁")

price = 19.9
print(int(price), str(price), bool(0), bool("hi"))`,
  note: 'bool(0) 是 False，bool("hi") 是 True：数值 0、空字符串、空列表在布尔判断里都算「假」。',
  ex: [
    E('x = input("数量：") 输入 5 后，x * 3 得到什么？要得到 15 该怎么写？',
      '得到 "555"（字符串重复 3 次）。要得到 15 需写成 x = int(input("数量：")) 再 x * 3。', 'input 永远返回字符串'),
    E('int("3.9") 会发生什么？怎样正确把 "3.9" 变成 3？',
      '会抛 ValueError，因为 int() 不认带小数点的字符串。应先 float 再取整：int(float("3.9"))，得到 3。', ''),
    E('type(True)、type(3 / 1) 分别是什么？',
      '分别是 <class \'bool\'> 和 <class \'float\'>：/ 除法永远返回浮点数，即使整除。', '')
  ],
  hw: '写一个「厘米转米」小程序：读入厘米数，输出 x.xx 米，保留两位小数；再故意输入 abc，观察并记下报错类型。',
  u: 'U1',
  terms: [
    T('variable', 'n.', '变量', 'A variable is a name that refers to a value.', '变量是指向某个值的名字。'),
    T('integer', 'n.', '整数', 'An integer has no decimal point.', '整数没有小数点。'),
    T('float', 'n.', '浮点数', 'A float represents a number with a decimal point.', '浮点数表示带小数点的数。'),
    T('string', 'n.', '字符串', 'A string is a sequence of characters in quotes.', '字符串是引号内的一串字符。'),
    T('boolean', 'n.', '布尔值', 'A boolean is either True or False.', '布尔值只有 True 或 False。'),
    T('type conversion', 'n.', '类型转换', 'Use int() for explicit type conversion.', '用 int() 做显式的类型转换。')
  ]
},
{
  n: 3, t: '运算符与表达式',
  goal: '掌握算术、比较、逻辑运算符与优先级，能写对条件表达式。',
  ref: '小甲鱼 第 013~018 讲：操作符 / 优先级 / 比较',
  pts: [
    '算术：+ - * /（真除）、//（整除）、%（取余）、**（幂）。',
    '比较：== != > < >= <=，结果是布尔值；注意 = 是赋值，== 才是判断相等。',
    '逻辑：and / or / not；and 和 or 有「短路」特性。',
    '优先级记不住就加括号；链式比较 18 <= age < 60 在 Python 里是合法的。',
    '+= 这类增强赋值等价于 x = x + ...，字符串也支持 += 拼接。'
  ],
  code: `a, b = 7, 3
print(a / b, a // b, a % b, a ** b)   # 2.333... 2 1 343

age = 25
print(18 <= age < 60)                 # True
print(age > 18 and age % 2 == 1)      # True

count = 0
count += 1
print("第", count, "次")`,
  note: '// 是向下取整，负数时 -7 // 3 得 -3 而不是 -2，做题常在这里翻车。',
  ex: [
    E('7 // 3、7 % 3、-7 // 3 各是多少？',
      '分别是 2、1、-3。// 向下取整（floor），不是简单截断。', ''),
    E('写一个表达式判断「score 在 60 到 100 之间，且不是 60」。',
      '60 < score <= 100。也可以写 score > 60 and score <= 100。', ''),
    E('print(3 > 2 and 0 or "yes") 输出什么？为什么？',
      '输出 "yes"。and 返回第一个假值或最后一个值，or 返回第一个真值；3>2 为 True，True and 0 得 0，0 or "yes" 得 "yes"。', '')
  ],
  hw: '写「找零计算器」：输入金额和实付，输出应找零钱，并判断零钱是否为整数；再写判断某年是否闰年的表达式（400 整除 或 4 整除且不被 100 整除）。',
  u: 'U1',
  terms: [
    T('operator', 'n.', '运算符', 'The % operator returns the remainder.', '% 运算符返回余数。'),
    T('operand', 'n.', '操作数', 'In 7 + 3, both numbers are operands.', '在 7 + 3 中，两个数都是操作数。'),
    T('expression', 'n.', '表达式', 'An expression evaluates to a value.', '表达式会求值得到一个结果。'),
    T('precedence', 'n.', '优先级', 'Parentheses override operator precedence.', '括号可以覆盖运算符优先级。'),
    T('floor division', 'n.', '整除', 'Floor division rounds the result down.', '整除会把结果向下取整。'),
    T('short-circuit', 'adj.', '短路求值', 'Python uses short-circuit evaluation for and and or.', 'Python 对 and 和 or 采用短路求值。')
  ]
},
{
  n: 4, t: '字符串与格式化输出',
  goal: '会切片、常用字符串方法和三种格式化写法，能漂亮地输出表格。',
  ref: '小甲鱼 第 019~026 讲：字符串 / 切片 / format',
  pts: [
    '字符串不可变：s[0] 能读不能改，s.upper() 返回新字符串。',
    '切片 s[start:end:step]，含头不含尾；s[::-1] 反转。',
    '常用方法：strip / split / join / replace / startswith / find / count。',
    'f-string 最推荐：f"{name:>8} {score:.2f}" 可控制对齐与小数位。',
    '原始字符串 r"..." 让反斜杠不转义，写路径和正则时很有用。'
  ],
  code: `title = "  Python 入门  "
print(title.strip().upper())          # PYTHON 入门

s = "2026-11-14"
print(s[:4], s[5:7], s[::-1])         # 2026 11 41-11-6202
print("-".join(["a", "b", "c"]))      # a-b-c

name, score = "小明", 92.5
print(f"| {name:<6} | {score:>6.1f} |")`,
  note: ':<6 左对齐补空格，:>6.1f 右对齐并保留 1 位小数；做命令行报表非常实用。',
  ex: [
    E('s = "abcdef"，s[1:4]、s[-2:]、s[::2] 分别是什么？',
      '分别是 "bcd"、"ef"、"ace"。', ''),
    E('如何把 "a,b,c" 变成 "a | b | c"？',
      '" | ".join("a,b,c".split(","))。split 拆成列表，join 再拼回字符串。', ''),
    E('为什么 s = "hi"; s[0] = "H" 会报错？怎么改？',
      '字符串不可变，会抛 TypeError。应生成新字符串：s = "H" + s[1:] 或 s = s.replace("h", "H", 1)。', '')
  ],
  hw: '写「成绩条生成器」：输入姓名与三科分数，用 f-string 输出一张右对齐的表格，并计算总分与平均分（保留 1 位）。',
  u: 'U1',
  terms: [
    T('immutable', 'adj.', '不可变的', 'Strings are immutable in Python.', 'Python 中字符串是不可变的。'),
    T('slice', 'n.', '切片', 'A slice extracts part of a sequence.', '切片用于取出序列的一部分。'),
    T('index', 'n.', '索引', 'The first character has index zero.', '第一个字符的索引是 0。'),
    T('delimiter', 'n.', '分隔符', 'Use a comma as the delimiter when splitting.', '拆分时用逗号作为分隔符。'),
    T('f-string', 'n.', '格式化字符串', 'An f-string embeds variables directly in text.', 'f-string 可以把变量直接嵌进文本。'),
    T('escape character', 'n.', '转义字符', 'A backslash is an escape character in strings.', '反斜杠是字符串里的转义字符。')
  ]
},
{
  n: 5, t: '条件分支 if / elif / else',
  goal: '能用多分支把现实规则写成代码，并避免常见逻辑坑。',
  ref: '小甲鱼 第 027~032 讲：分支结构 / 条件表达式',
  pts: [
    'if 后接布尔表达式，冒号 + 缩进组成代码块；elif 可以多个，else 最多一个且放最后。',
    '分支是「从上往下命中即停」，条件顺序会影响结果，把最严格的条件放前面。',
    '不要写 if x == True，直接写 if x；判断空用 if not items。',
    '三元表达式：result = "及格" if score >= 60 else "不及格"。',
    '缩进必须统一（4 个空格），混用 Tab 和空格会报 IndentationError。'
  ],
  code: `score = int(input("分数："))

if score >= 90:
    grade = "优秀"
elif score >= 80:
    grade = "良好"
elif score >= 60:
    grade = "及格"
else:
    grade = "不及格"

print("等级：", grade)
print("是否补考：", "是" if grade == "不及格" else "否")`,
  note: '因为自上而下命中即停，score=95 不会掉进 >=80 的分支；若把 >=60 写在最前面，所有人都会变成「及格」。',
  ex: [
    E('下面代码当 score=85 时输出什么？为什么？先写 if score >= 60 再写 elif score >= 80。',
      '输出「及格」。因为第一个条件已满足，elif 不再判断——这就是条件顺序的坑。', ''),
    E('写一个表达式：年龄满 18 且带身份证才能入场，否则提示不能入场。',
      'if age >= 18 and has_id: print("欢迎") else: print("不能入场")（写成两行带缩进）。', ''),
    E('if [] / if "0" 分别判断为真还是假？',
      'if [] 为假（空列表），if "0" 为真（非空字符串，即使内容是 0）。', '')
  ],
  hw: '写「电费阶梯计价」：0~200 度 0.5 元，201~400 度 0.65 元，400 度以上 0.9 元，按分段累进计算；输入负数要提示重新输入。',
  u: 'U2',
  terms: [
    T('branch', 'n.', '分支', 'Each branch runs only when its condition is true.', '每个分支只在条件为真时执行。'),
    T('condition', 'n.', '条件', 'A condition must evaluate to a boolean.', '条件必须求值为布尔值。'),
    T('indentation', 'n.', '缩进', 'Indentation defines a code block in Python.', '在 Python 中缩进定义代码块。'),
    T('nested', 'adj.', '嵌套的', 'Avoid deeply nested if statements.', '避免过深的嵌套 if 语句。'),
    T('truthy', 'adj.', '真值的', 'Any non-empty string is truthy.', '任何非空字符串都是真值。'),
    T('ternary operator', 'n.', '三元运算符', 'A ternary operator chooses between two values.', '三元运算符在两个值之间做选择。')
  ]
},
{
  n: 6, t: '循环 for / while',
  goal: '会用 for 遍历序列、while 处理不确定次数，能用 range 和 enumerate。',
  ref: '小甲鱼 第 033~040 讲：while / for / range',
  pts: [
    'for 用于「已知要遍历什么」：列表、字符串、range、字典；while 用于「不知道要转几次」。',
    'range(1, 10, 2) 生成 1,3,5,7,9，含头不含尾。',
    '需要下标时用 enumerate(items)，别写 range(len(items))。',
    'while 一定要有让条件变假的语句，否则死循环；Ctrl+C 可中断。',
    'for 可以带 else：循环正常结束（没被 break）才执行，容易被忽略。'
  ],
  code: `total = 0
for i in range(1, 101):
    total += i
print("1~100 求和：", total)

fruits = ["apple", "banana", "orange"]
for idx, name in enumerate(fruits, start=1):
    print(idx, name)

n = 1
while n < 100:
    n *= 2
print("第一个超过 100 的 2 的幂：", n)`,
  note: 'enumerate 的 start 参数可以让序号从 1 开始，输出报表时很方便。',
  ex: [
    E('range(5)、range(2, 8, 2)、list(range(3, 0, -1)) 分别是什么？',
      '依次是 0~4；2,4,6；[3, 2, 1]。步长为负时倒着生成。', ''),
    E('用 while 读入用户输入，直到输入 q 才退出，写出核心代码。',
      'while True: s = input("> "); if s == "q": break; print(s)（写成带缩进的多行）。', ''),
    E('for i in range(3): ... else: print("done") 中，循环里 break 时 done 会打印吗？',
      '不会。for-else 的 else 只在循环没有被 break 中断、正常跑完时执行。', '')
  ],
  hw: '写「猜数字」：随机 1~100，最多 7 次，每次提示大了/小了，猜中或次数用尽结束；用 while 实现。',
  u: 'U2',
  terms: [
    T('loop', 'n.', '循环', 'A loop repeats a block of code.', '循环会重复执行一段代码。'),
    T('iteration', 'n.', '迭代', 'Each iteration processes one item.', '每次迭代处理一个元素。'),
    T('iterable', 'n.', '可迭代对象', 'A list is an iterable object.', '列表是一个可迭代对象。'),
    T('range', 'n.', '范围序列', 'range(3) yields 0, 1 and 2.', 'range(3) 生成 0、1、2。'),
    T('infinite loop', 'n.', '死循环', 'Forgetting to update the counter creates an infinite loop.', '忘记更新计数器会造成死循环。'),
    T('enumerate', 'v.', '枚举', 'Use enumerate() to get both index and value.', '用 enumerate() 同时拿到下标和值。')
  ]
},
{
  n: 7, t: 'break / continue 与循环嵌套',
  goal: '控制循环流程，会做输入校验和二维遍历。',
  ref: '小甲鱼 第 041~046 讲：break / continue / 循环嵌套',
  pts: [
    'break 立即结束整个循环；continue 跳过本次剩余语句，进入下一轮。',
    '嵌套循环里 break 只跳出最近的一层，要跳出多层可用标志变量或函数 return。',
    '「读入直到合法」的标准写法是 while True + if 合法: break。',
    '打印九九乘法表是嵌套循环的经典练习，注意 end 与制表符。',
    '死循环不可怕，关键是循环体内必须有状态变化。'
  ],
  code: `while True:
    s = input("请输入 1~100 的整数：")
    if not s.isdigit() or not (1 <= int(s) <= 100):
        print("输入不合法，再试一次")
        continue
    num = int(s)
    break
print("你输入的是", num)

for i in range(1, 10):
    for j in range(1, i + 1):
        print(f"{j}x{i}={i*j}", end="\\t")
    print()`,
  note: '字符串里的 \\t 是制表符；print(..., end="") 阻止自动换行，用来把一行内容拼起来。',
  ex: [
    E('break 和 continue 的区别是什么？各举一个使用场景。',
      'break 直接结束整个循环（如找到目标后停止搜索）；continue 跳过本轮剩余代码进入下一轮（如跳过负数不参与求和）。', ''),
    E('下面循环执行几次 break：for i in range(3): for j in range(3): break？',
      '外层执行 3 次，每次内层的 break 只跳出内层循环，所以内层每层只跑 1 次，共 3 次 break。', ''),
    E('用一行代码求 1~100 中所有能被 3 整除的数之和（提示：用 sum + 推导式）。',
      'sum(i for i in range(1, 101) if i % 3 == 0)，结果为 1683。', '')
  ],
  hw: '写「简易登录」：最多 3 次机会，用户名或密码错时提示剩余次数，输入 q 可提前退出；成功后打印欢迎语。',
  u: 'U2',
  terms: [
    T('break', 'n./v.', '中断', 'Use break to exit the loop early.', '用 break 提前退出循环。'),
    T('continue', 'n./v.', '继续下一轮', 'continue skips the rest of this iteration.', 'continue 跳过本轮剩下的代码。'),
    T('nested loop', 'n.', '嵌套循环', 'A nested loop sits inside another loop.', '嵌套循环位于另一个循环内部。'),
    T('validation', 'n.', '校验', 'Input validation rejects invalid data.', '输入校验会拒绝不合法的数据。'),
    T('flag', 'n.', '标志变量', 'A flag variable records whether a match was found.', '标志变量用来记录是否找到了匹配项。'),
    T('iteration counter', 'n.', '迭代计数器', 'Increment the iteration counter each round.', '每轮都要给迭代计数器加一。')
  ]
},
{
  n: 8, t: '列表：增删改查与切片',
  goal: '熟练使用最常用的容器 list，会排序、推导式和拷贝。',
  ref: '小甲鱼 第 047~056 讲：列表 / 增删改查 / 列表推导式',
  pts: [
    '列表有序、可变、可放任意类型：a = [1, "x", True]。',
    '增 append / insert / extend，删 remove / pop / del / clear，改直接按下标赋值。',
    '查用 in、index、count；排序 sort() 原地改，sorted() 返回新列表。',
    '切片赋值、[:] 浅拷贝；b = a 只是同一份数据的两个名字，会互相影响。',
    '列表推导式 [x*2 for x in nums if x > 0] 比循环更简洁，是 Python 的标志写法。'
  ],
  code: `scores = [88, 92, 75]
scores.append(95)
scores.insert(0, 60)
scores.remove(60)
print(scores, sorted(scores), sum(scores) / len(scores))

nums = [1, -2, 3, -4, 5]
positives = [x * 2 for x in nums if x > 0]
print(positives)                  # [2, 6, 10]

a = [1, 2]; b = a; c = a[:]
b.append(3)
print(a, c)                       # [1, 2, 3] [1, 2]`,
  note: 'b = a 是引用赋值，改 b 等于改 a；a[:] 才是复制一份新列表。嵌套列表要用 copy.deepcopy。',
  ex: [
    E('a = [1,2,3]; b = a; b[0] = 9 之后 a 是什么？怎样避免？',
      'a 变成 [9,2,3]。用 b = a[:] 或 b = list(a) 或 b = a.copy() 复制一份。', ''),
    E('写出「取列表中所有偶数并平方」的推导式。',
      '[x**2 for x in nums if x % 2 == 0]。', ''),
    E('list.sort() 和 sorted(list) 有什么区别？',
      'sort() 原地排序、返回 None；sorted() 生成新列表、原列表不变，且不要求对象一定是 list。', '')
  ],
  hw: '写「待办清单」：支持 添加 / 查看 / 删除 / 清空 / 退出，用列表存数据，删除时先判断下标合法性。',
  u: 'U3',
  terms: [
    T('list', 'n.', '列表', 'A list keeps items in order.', '列表按顺序保存元素。'),
    T('mutable', 'adj.', '可变的', 'A list is mutable, so you can change its items.', '列表是可变的，可以修改元素。'),
    T('append', 'v.', '追加', 'append() adds one item to the end.', 'append() 在末尾追加一个元素。'),
    T('index', 'n.', '下标', 'A negative index counts from the end.', '负数下标从末尾开始数。'),
    T('shallow copy', 'n.', '浅拷贝', 'A shallow copy shares nested objects.', '浅拷贝会共享内部的嵌套对象。'),
    T('list comprehension', 'n.', '列表推导式', 'A list comprehension builds a list in one line.', '列表推导式用一行代码构造列表。')
  ]
},
{
  n: 9, t: '元组、集合与字典',
  goal: '按场景选对容器：不可变用元组、去重判断用集合、键值查表用字典。',
  ref: '小甲鱼 第 057~068 讲：元组 / 集合 / 字典',
  pts: [
    '元组 tuple 不可变，可作字典的键；单元素元组要写 (1,)。',
    '集合 set 自动去重、无序，支持 | & - ^ 交集并集差集，判断 in 是 O(1)。',
    '字典 dict 存键值对，d[key] 取值、d.get(key, 默认) 更安全地取值。',
    '遍历字典：d.items() 拿键值、d.keys()、d.values()；Python 3.7+ 保持插入顺序。',
    '字典的键必须是可哈希（不可变）类型，列表不能当键。'
  ],
  code: `point = (3, 4)
x, y = point                       # 元组解包

a = {1, 2, 2, 3}
b = {3, 4, 5}
print(a, a | b, a & b)             # {1,2,3} 并集 {3}

stu = {"name": "小明", "age": 18}
stu["score"] = 92
print(stu.get("city", "未填写"))
for k, v in stu.items():
    print(k, v)`,
  note: '访问不存在的键用 d[key] 会报 KeyError，用 d.get() 可给默认值，处理外部数据时更安全。',
  ex: [
    E('如何一行去掉列表 nums 中的重复元素？顺序还重要怎么办？',
      '去重：list(set(nums))（顺序会变）。要保序：list(dict.fromkeys(nums))。', ''),
    E('为什么 [1,2] 不能作为字典的键，而 (1,2) 可以？',
      '字典键必须可哈希且不可变；列表可变、不可哈希，元组不可变且可哈希。', ''),
    E('统计字符串 "banana" 中每个字符出现次数，写出一行实现。',
      'from collections import Counter; Counter("banana")，得到 Counter({\'a\': 3, \'n\': 2, \'b\': 1})。', '')
  ],
  hw: '写「词频统计」：输入一段英文，输出出现次数最多的 5 个单词及次数（忽略大小写与标点），用字典 + sorted 完成。',
  u: 'U3',
  terms: [
    T('tuple', 'n.', '元组', 'A tuple cannot be changed after creation.', '元组创建后不能被修改。'),
    T('set', 'n.', '集合', 'A set stores unique values.', '集合只保存不重复的值。'),
    T('dictionary', 'n.', '字典', 'A dictionary maps keys to values.', '字典把键映射到值。'),
    T('key-value pair', 'n.', '键值对', 'Each key-value pair has a unique key.', '每个键值对都有唯一的键。'),
    T('hashable', 'adj.', '可哈希的', 'A dictionary key must be hashable.', '字典的键必须是可哈希的。'),
    T('unpacking', 'n.', '解包', 'Tuple unpacking assigns each item to a variable.', '元组解包把每个元素赋给一个变量。')
  ]
},
{
  n: 10, t: '函数：参数、返回值与作用域',
  goal: '会把重复代码抽成函数，理解参数传递、返回值与变量作用域。',
  ref: '小甲鱼 第 069~080 讲：函数 / 参数 / 返回值 / 作用域',
  pts: [
    'def 定义、return 返回结果；没有 return 的函数返回 None。',
    '位置参数 → 默认参数 → *args → **kwargs；默认参数要放在非默认参数之后。',
    '默认值别用可变对象：def f(x, items=[]) 是经典 bug，应写 None 再在函数内创建。',
    '局部变量只在函数内有效；要改外部变量用 return，而不是 global。',
    '写 docstring 说明函数做什么、参数是什么、返回什么；lambda 只适合极简表达式。'
  ],
  code: `def calc_total(prices, discount=1.0):
    """返回折后总价；prices 为价格列表。"""
    return round(sum(prices) * discount, 2)

print(calc_total([10, 20, 30]))
print(calc_total([10, 20, 30], 0.8))

def tag(name, **kwargs):
    return name, kwargs

print(tag("小明", age=18, city="北京"))`,
  note: '默认参数在定义时只求值一次，所以不要用 [] 或 {} 当默认值；这是面试和实战都高频的坑。',
  ex: [
    E('def f(a, b=1): ... 调用 f(1, 2) 与 f(b=2, a=1) 都合法吗？',
      '都合法。前者按位置传参，后者按关键字传参（关键字传参可以换顺序）。', ''),
    E('def f(x, items=[]): items.append(x); return items；连续调用 f(1)、f(2) 返回什么？怎么修？',
      '分别返回 [1] 和 [1, 2]，因为默认列表被共享。改成 def f(x, items=None): items = [] if items is None else items。', ''),
    E('写一个函数 is_prime(n)，判断 n 是否为质数。',
      'if n < 2: return False; for i in range(2, int(n**0.5)+1): if n % i == 0: return False; return True（写成带缩进的多行）。', '')
  ],
  hw: '把第 8、9 节的「待办清单」和「词频统计」重构成至少 4 个函数（增、删、查、统计），每个函数写一行 docstring。',
  u: 'U4',
  terms: [
    T('function', 'n.', '函数', 'A function packages reusable code.', '函数把可复用的代码打包起来。'),
    T('parameter', 'n.', '形参', 'A parameter is named in the function definition.', '形参是在函数定义中命名的变量。'),
    T('argument', 'n.', '实参', 'An argument is the value passed at call time.', '实参是调用时传入的具体值。'),
    T('return value', 'n.', '返回值', 'A function without return gives None as its return value.', '没有 return 的函数返回 None。'),
    T('scope', 'n.', '作用域', 'A local scope exists only inside the function.', '局部作用域只在函数内部存在。'),
    T('default argument', 'n.', '默认参数', 'A default argument is used when no value is given.', '没有传值时就使用默认参数。')
  ]
},
{
  n: 11, t: '文件读写与异常初识',
  goal: '能让程序的数据存下来，并用 try-except 优雅处理错误。',
  ref: '小甲鱼 第 081~090 讲：文件 / 异常 / with 语句',
  pts: [
    'open(path, mode, encoding="utf-8")；模式 r 读、w 覆盖写、a 追加。',
    '永远用 with open(...) as f:，它会在结束时自动关闭文件。',
    '读：read / readline / readlines；写：write / writelines，写换行要自己加 \\n。',
    'try-except 捕获异常，可指定 ValueError / FileNotFoundError；finally 总会执行。',
    'pathlib.Path 更现代：Path("data.txt").read_text(encoding="utf-8")。'
  ],
  code: `from pathlib import Path

# 写入
Path("note.txt").write_text("第一行\\n第二行\\n", encoding="utf-8")

# 读取
for line in Path("note.txt").read_text(encoding="utf-8").splitlines():
    print(line.upper())

# 异常处理
try:
    age = int(input("年龄："))
except ValueError:
    print("请输入数字")
else:
    print("明年", age + 1, "岁")`,
  note: 'else 只在 try 没抛异常时执行；except 要写具体异常类型，不要裸 except 把所有错误悄悄吞掉。',
  ex: [
    E('为什么推荐 with open(...) 而不是 f = open(...)？',
      'with 会在代码块结束（即使中途抛异常）时自动调用 close()，避免文件句柄泄漏和内容未刷盘。', ''),
    E('"w" 和 "a" 模式有什么区别？',
      'w 会清空原文件后重写，a 在文件末尾追加；两者在文件不存在时都会新建。', ''),
    E('读取一个可能不存在的文件时，应该捕获哪个异常？',
      'FileNotFoundError（它是 OSError 的子类）。可用 try: ... except FileNotFoundError: ...。', '')
  ],
  hw: '给「待办清单」加持久化：退出时写入 todo.txt，启动时读回；文件不存在或内容损坏时不能崩溃，要给出提示。',
  u: 'U5',
  terms: [
    T('file handle', 'n.', '文件句柄', 'The with statement closes the file handle automatically.', 'with 语句会自动关闭文件句柄。'),
    T('encoding', 'n.', '编码', 'Always specify utf-8 encoding for Chinese text.', '处理中文时务必指定 utf-8 编码。'),
    T('exception', 'n.', '异常', 'An exception interrupts normal execution.', '异常会打断正常的执行流程。'),
    T('traceback', 'n.', '回溯信息', 'Read the traceback from the bottom up.', '回溯信息要从下往上读。'),
    T('append mode', 'n.', '追加模式', 'Append mode keeps the existing content.', '追加模式会保留原有内容。'),
    T('context manager', 'n.', '上下文管理器', 'A with statement uses a context manager.', 'with 语句使用的是上下文管理器。')
  ]
},
{
  n: 12, t: '结课项目：命令行记账本',
  goal: '把前 11 节的知识串成一个真正能用的程序，完成入门阶段验收。',
  ref: '小甲鱼 综合练习 + 鱼C论坛课后项目题',
  pts: [
    '项目流程：需求拆解 → 数据结构设计 → 分函数实现 → 文件持久化 → 异常处理 → 自测。',
    '一条记录用字典 {"date": "...", "item": "...", "amount": -35.5}，整体用列表存。',
    '主循环 while True + 菜单分支，输入 q 退出；所有外部输入都要校验。',
    '把「读文件 / 写文件 / 增 / 删 / 查 / 统计」各自写成独立函数，main() 只负责调度。',
    '验收标准：关掉程序再打开，数据还在；输入乱字符不崩溃。'
  ],
  code: `import json
from pathlib import Path

FILE = Path("ledger.json")

def load():
    if not FILE.exists():
        return []
    try:
        return json.loads(FILE.read_text(encoding="utf-8"))
    except (ValueError, OSError):
        return []

def save(records):
    FILE.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")

def add(records):
    item = input("项目：")
    try:
        amount = float(input("金额（支出用负数）："))
    except ValueError:
        print("金额必须是数字"); return
    records.append({"item": item, "amount": amount})
    save(records)

def report(records):
    print(f"共 {len(records)} 笔，合计 {sum(r['amount'] for r in records):.2f} 元")`,
  note: 'json 模块负责把列表/字典与文本互转，ensure_ascii=False 保证中文不被转义。main() 里再包一层菜单循环即可。',
  ex: [
    E('为什么要先写 load/save 再写业务函数？',
      '先确定数据怎么存、结构长什么样，业务逻辑才有一致的输入；否则改结构时所有函数都要重写。', ''),
    E('用户金额输入 abc 时程序会怎样？该怎么处理？',
      'float("abc") 抛 ValueError，未捕获就崩溃。用 try-except 捕获并提示重输，然后 return 或 continue。', ''),
    E('写一行代码求所有支出（amount < 0）的总额。',
      'sum(r["amount"] for r in records if r["amount"] < 0)。', '')
  ],
  hw: '补全 main() 菜单（1 记一笔 / 2 查看全部 / 3 汇总 / 4 删除 / q 退出），实现删除与按月份筛选，并写 5 条自测用例手动跑一遍。',
  u: 'U5',
  terms: [
    T('project', 'n.', '项目', 'A project combines many small functions.', '一个项目由许多小函数组合而成。'),
    T('persistence', 'n.', '持久化', 'File persistence keeps data after the program exits.', '文件持久化让程序退出后数据仍在。'),
    T('serialization', 'n.', '序列化', 'JSON serialization converts objects into text.', 'JSON 序列化把对象转换成文本。'),
    T('menu loop', 'n.', '菜单循环', 'A menu loop keeps asking until the user quits.', '菜单循环会持续询问直到用户退出。'),
    T('refactor', 'v.', '重构', 'Refactor repeated code into small functions.', '把重复代码重构成小函数。'),
    T('edge case', 'n.', '边界情况', 'Always test the edge case of empty input.', '一定要测试空输入这个边界情况。')
  ]
}
];
