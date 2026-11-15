/* 学习顺序（零基础 → 能干活）：四门课各是第几步 */
window.PY_STEPS = {
  intro:   { step: 1, tag: '打地基', days: 45, note: '看到第 110 集（第12章结束）就可以停，第13~18章在进阶课里更细' },
  ai:      { step: 2, tag: '练手感', days: 3,  note: '这一步只看吴恩达那 35 集（3 天）；李宏毅、李沐的课要等进阶学完再进' },
  adv:     { step: 3, tag: '补内功', days: 45, note: '面向对象讲到算法数据结构，这一门决定你后面走多快，别跳' },
  project: { step: 4, tag: '出作品', days: 30, note: '前 3 章（Linux / MySQL）快看，重点在 Pandas 和最后的 RFM 项目' }
};

/* 重复段落：同一知识点在两门课里都讲了一遍（按原视频分P区间标） */
window.PY_DUP = {
  intro: [
    { from: 111, to: 126, dup: '进阶课 第1~2章', why: '面向对象：进阶课 48 集讲得更透，入门这段可以先跳', skip: true },
    { from: 127, to: 138, dup: '实战课 第2~3章', why: 'MySQL：实战课带真实建表查询，入门这段只需了解', skip: true },
    { from: 139, to: 153, dup: '独有', why: 'PySpark 只有这里讲，建议照看', skip: false },
    { from: 154, to: 157, dup: '进阶课 第3章', why: '闭包与装饰器：进阶课 20 集，入门只有 4 集', skip: true },
    { from: 158, to: 161, dup: '进阶课 第4章', why: '多线程与 socket：进阶课 22 集，还讲了多进程', skip: true },
    { from: 162, to: 164, dup: '进阶课 第5章', why: '正则表达式：进阶课 23 集，带校验实战', skip: true }
  ],
  adv: [
    { from: 1, to: 48,  dup: '入门课 第13章', why: '入门那段是简版，这里是完整版，不能跳', skip: false },
    { from: 49, to: 68,  dup: '入门课 第16章', why: '入门只有 4 集，这里才讲透', skip: false },
    { from: 69, to: 90,  dup: '入门课 第17章', why: '入门只有 4 集，这里加了多进程', skip: false },
    { from: 91, to: 113, dup: '入门课 第18章', why: '入门只有 3 集，这里带正则校验实战', skip: false }
  ],
  project: [
    { from: 22, to: 58, dup: '入门课 第14章', why: 'MySQL：两处都讲，这里更完整，入门那段可略', skip: false }
  ]
};

/* 四个视频课程模块的展示信息（首页六个模块里的前四个） */
window.PY_MODULES = {
  intro: {
    id: 'intro', name: 'Python 入门',
    color: '#2563eb', tint: '#e8f0ff', tint2: '#c2d8ff',
    title: 'Python 入门 · 黑马程序员 164 集',
    desc: '零基础起步：装环境、写第一个程序，然后一路把语法、数据容器、函数、文件、异常、可视化、面向对象、MySQL、PySpark、并发、网络、正则全部过一遍。点目录直接播那一集视频。',
    chapters: null,
    info: { teacher: '黑马程序员（传智教育）', platform: 'B 站视频（页面内直接播放）', length: '164 集 · 约 31.7 小时', lang: '全中文', cost: '免费' },
    why: '一套到底不用换课，中文讲解、节奏紧凑，基础篇 12 章直接对上「能写脚本」，进阶篇还带 MySQL、PySpark、并发、网络、正则。',
    how: '点左边目录直接看视频，看完关掉自己敲本节代码并改一个需求；一天 1~2 章的内容，6~8 周走完基础篇。'
  },
  adv: {
    id: 'adv', name: 'Python 进阶',
    color: '#0d9488', tint: '#e6f7f4', tint2: '#b8e8e0',
    title: 'Python 进阶 · 面向对象到算法与数据结构',
    desc: '入门课讲到的知识点在这里讲透：面向对象基础与高级、闭包与装饰器、深浅拷贝、socket 与多线程、生成器与正则，最后进入时间复杂度、链表、排序与二叉树。共 162 集。',
    chapters: null,
    info: { teacher: '黑马程序员（传智教育）', platform: 'B 站视频（页面内直接播放）', length: '162 集 · 约 35.6 小时', lang: '全中文', cost: '免费' },
    why: '这是从「会写脚本」到「能进项目」的分水岭：会不会写类、会不会用装饰器、懂不懂并发和复杂度，直接决定后面走多快。',
    how: '按章看，每章看完手写一遍核心代码（学生管理系统、装饰器、socket 收发、链表增删查）；第 6~7 章算法不要跳。'
  },
  project: {
    id: 'project', name: '项目实战',
    color: '#7c3aed', tint: '#f3ecff', tint2: '#ddc9ff',
    title: '项目实战 · 数据分析完整链路（到 RFM 交付）',
    desc: '从 Linux 环境、MySQL 数据库，到 NumPy、Pandas、Matplotlib/Seaborn，最后用一份真实订单数据做完 RFM 用户分层项目。共 144 集，学完手上有一个能写进简历的完整项目。',
    chapters: null,
    info: { teacher: '黑马程序员（传智教育）', platform: 'B 站视频（页面内直接播放）', length: '144 集 · 约 36.2 小时', lang: '全中文', cost: '免费' },
    why: '项目是简历上唯一算数的东西。这门课从环境一路做到交付物，不是零散语法，而是完整的一条数据链路。',
    how: '前 3 章（Linux/MySQL）可快看，重点在 NumPy、Pandas、可视化与最后的 RFM 项目；最后换一套自己的数据重做一遍。'
  },
  ai: {
    id: 'ai', name: 'AI 应用实战',
    color: '#e11d48', tint: '#ffe9ef', tint2: '#ffc9d8',
    title: 'AI 应用实战 · 吴恩达 AI Python for Beginners',
    desc: 'DeepLearning.AI 官方课，吴恩达亲授：不背语法，直接教你用聊天机器人写出能跑的代码，再用 for 循环、字典把任务自动化，读写自己的文件、抽取信息，最后用 pip 装包、用 API 接上大模型。4 个模块 35 段，每段 3~10 分钟。',
    chapters: null,
    info: { teacher: '吴恩达 Andrew Ng', platform: 'B 站搬运（中英字幕）', length: '35 集 · 约 4.3 小时', lang: '英文讲解 · 中英字幕', cost: '免费' },
    why: '这不是又一套语法课，而是「用 AI 写代码」的课：全程在 Jupyter 里边说边跑。学完你能自己写出读文件、抽信息、调大模型 API 的脚本，这一层能力现在最缺。',
    how: '别记笔记，跟着跑；每段看完把 prompt 换成你自己的场景。4 个模块 3 天能过完，第 4 模块（包与 API）隔一周重做一遍。'
  },

  /* ---- 大学数学：返回「大学数学」列表，不回 Python 首页 ---- */
  linear: {
    id: 'linear', name: '线性代数', back: 'hub.html#/math',
    color: '#0f766e', tint: '#e6f7f4', tint2: '#b8e8e0',
    title: '线性代数 · 宋浩 3.0 版',
    desc: '行列式、矩阵、向量组、线性方程组、特征值与特征向量、二次型、向量空间，7 章 39 段。每一节都是「先讲为什么要有它，再手推例题」。',
    info: { teacher: '宋浩', platform: 'B 站（页面内直接播放）', length: '39 集 · 约 29.2 小时', lang: '全中文', cost: '免费' },
    why: '大学期末与考研公认讲得最细的一套。矩阵与向量组是后面机器学习、图像处理的通用语言，这一门躲不过去。',
    how: '必须动笔：每段暂停，先自己在纸上算完例题再看讲解。行列式与矩阵两章别求快，后面全建在这上面。'
  },
  calculus: {
    id: 'calculus', name: '微积分', back: 'hub.html#/math',
    color: '#1d4ed8', tint: '#e8f0ff', tint2: '#c2d8ff',
    title: '微积分 / 高等数学 · 宋浩全程',
    desc: '函数与极限、导数与微分、中值定理与导数应用、不定积分、定积分及其应用、多元函数与二重积分、无穷级数、微分方程，8 章 59 段共 47 小时。',
    info: { teacher: '宋浩', platform: 'B 站（页面内直接播放）', length: '59 集 · 约 47.2 小时', lang: '全中文', cost: '免费' },
    why: '高数挂科率最高，也最需要有人带着算。这套例题量大、节奏稳，零基础能跟下来。',
    how: '按章推进，每章结束做 10 道课后题再往下走。极限、导数、积分三大块宁可慢两周也别跳。'
  },
  stats: {
    id: 'stats', name: '统计学', back: 'hub.html#/math',
    color: '#b45309', tint: '#fff5e6', tint2: '#ffd9a8',
    title: '统计学 · 概率论与数理统计（宋浩 2.0）',
    desc: '随机事件与概率、一维与二维随机变量、数字特征、大数定律与中心极限定理、数理统计基础、参数估计、假设检验，9 章 63 段共 37 小时。',
    info: { teacher: '宋浩', platform: 'B 站（页面内直接播放）', length: '63 集 · 约 37.0 小时', lang: '全中文', cost: '免费' },
    why: '统计学的数学底座就是这一门。学完才看得懂 A/B 测试、置信区间、p 值在说什么，也是数据分析岗面试必问。',
    how: '前 4 章是概率（重在算），后 4 章是统计（重在懂）。第 6 章抽样分布最容易糊，三大分布列张表背下来。'
  }
};
