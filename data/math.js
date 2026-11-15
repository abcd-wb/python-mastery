/* 大学数学三门课（统计学 / 微积分 / 线性代数）的真实 B 站分P数据
   线性代数 BV1d7wAzsE8V · 微积分 BV1UW411k7Jv · 概率统计 BV1JXppejE8q
   结构同 data/videos.js：p 分P序号，t 标题，ch 章节，d 时长(秒) */
window.COURSES = window.COURSES || {};
(function (C) {
  var M = {
 "linear": {
  "id": "linear",
  "bv": "BV1d7wAzsE8V",
  "title": "线性代数 · 宋浩 3.0 版",
  "sub": "从行列式到二次型 · 39 段完整课",
  "teacher": "宋浩",
  "platform": "B 站（页面内直接播放）",
  "url": "https://www.bilibili.com/video/BV1d7wAzsE8V/",
  "lang": "全中文",
  "cost": "免费",
  "length": "39 集 · 约 29.2 小时",
  "secs": 105121,
  "why": "考研与大学期末公认讲得最细的一套：每个概念都先讲「为什么要有它」，再手推例题。行列式、矩阵、向量组、方程组、特征值、二次型六块，一块不漏。",
  "how": "这门课必须动笔：每段先暂停，自己在纸上算完例题再看讲解。行列式与矩阵两章别求快，后面全建在这上面。",
  "chapters": [
   {
    "id": "m1",
    "n": "第1章",
    "name": "行列式",
    "from": 1,
    "to": 6,
    "desc": "二阶三阶入门、n 阶定义、性质、按行列展开、计算技巧、克拉默法则"
   },
   {
    "id": "m2",
    "n": "第2章",
    "name": "矩阵",
    "from": 7,
    "to": 18,
    "desc": "矩阵运算、转置与对称、伴随与逆矩阵、初等变换、分块矩阵、秩"
   },
   {
    "id": "m3",
    "n": "第3章",
    "name": "向量组",
    "from": 19,
    "to": 23,
    "desc": "线性组合与线性表示、线性相关性、极大无关组、向量组的秩"
   },
   {
    "id": "m4",
    "n": "第4章",
    "name": "线性方程组",
    "from": 24,
    "to": 27,
    "desc": "解的判定、解的结构、通解求法"
   },
   {
    "id": "m5",
    "n": "第5章",
    "name": "特征值与特征向量",
    "from": 28,
    "to": 33,
    "desc": "定义与求法、性质、相似、对角化、内积与正交矩阵、实对称矩阵"
   },
   {
    "id": "m6",
    "n": "第6章",
    "name": "二次型",
    "from": 34,
    "to": 36,
    "desc": "矩阵表示、化标准形、正定性"
   },
   {
    "id": "m7",
    "n": "第7章",
    "name": "向量空间",
    "from": 37,
    "to": 39,
    "desc": "向量空间概念、基与维数、坐标与基变换"
   }
  ],
  "pages": [
   {
    "p": 1,
    "t": "1.1 二阶三阶行列式",
    "ch": "m1",
    "d": 1721
   },
   {
    "p": 2,
    "t": "1.2 n阶行列式",
    "ch": "m1",
    "d": 5324
   },
   {
    "p": 3,
    "t": "1.3 行列式的性质",
    "ch": "m1",
    "d": 3842
   },
   {
    "p": 4,
    "t": "1.4 行列式按行（列）展开",
    "ch": "m1",
    "d": 3970
   },
   {
    "p": 5,
    "t": "1.5 行列式的计算",
    "ch": "m1",
    "d": 3719
   },
   {
    "p": 6,
    "t": "1.6 克拉默法则",
    "ch": "m1",
    "d": 1297
   },
   {
    "p": 7,
    "t": "2.1 矩阵的概念",
    "ch": "m2",
    "d": 1134
   },
   {
    "p": 8,
    "t": "2.2 矩阵的加法减法数乘运算",
    "ch": "m2",
    "d": 520
   },
   {
    "p": 9,
    "t": "2.2 矩阵的乘法",
    "ch": "m2",
    "d": 2294
   },
   {
    "p": 10,
    "t": "2.2 方阵的幂",
    "ch": "m2",
    "d": 1600
   },
   {
    "p": 11,
    "t": "2.2 矩阵的转置 对称反对陈矩阵",
    "ch": "m2",
    "d": 1345
   },
   {
    "p": 12,
    "t": "2.3 方阵的行列式",
    "ch": "m2",
    "d": 972
   },
   {
    "p": 13,
    "t": "2.3 方阵的伴随矩阵",
    "ch": "m2",
    "d": 2275
   },
   {
    "p": 14,
    "t": "2.3 逆矩阵",
    "ch": "m2",
    "d": 5105
   },
   {
    "p": 15,
    "t": "2.4 矩阵的初等变换与初等矩阵",
    "ch": "m2",
    "d": 5039
   },
   {
    "p": 16,
    "t": "2.4 初等行变换法求逆矩阵",
    "ch": "m2",
    "d": 1493
   },
   {
    "p": 17,
    "t": "2.5 分块矩阵",
    "ch": "m2",
    "d": 1965
   },
   {
    "p": 18,
    "t": "2.6 矩阵的秩",
    "ch": "m2",
    "d": 4340
   },
   {
    "p": 19,
    "t": "3.1 向量的概念与线性运算",
    "ch": "m3",
    "d": 815
   },
   {
    "p": 20,
    "t": "3.2 向量的线性组合与线性表示",
    "ch": "m3",
    "d": 1459
   },
   {
    "p": 21,
    "t": "3.3 向量组的线性相关性",
    "ch": "m3",
    "d": 5117
   },
   {
    "p": 22,
    "t": "3.4 极大线性无关组",
    "ch": "m3",
    "d": 2942
   },
   {
    "p": 23,
    "t": "3.5 向量组的秩",
    "ch": "m3",
    "d": 2291
   },
   {
    "p": 24,
    "t": "4.1 方程组的基本概念",
    "ch": "m4",
    "d": 997
   },
   {
    "p": 25,
    "t": "4.2 线性方程组解的判定",
    "ch": "m4",
    "d": 2320
   },
   {
    "p": 26,
    "t": "4.3 线性方程组解的性质与结构",
    "ch": "m4",
    "d": 3780
   },
   {
    "p": 27,
    "t": "4.4 线性方程组解的求法",
    "ch": "m4",
    "d": 2552
   },
   {
    "p": 28,
    "t": "5.1 特征值与特征向量的定义与求法",
    "ch": "m5",
    "d": 5281
   },
   {
    "p": 29,
    "t": "5.2 特征值与向量的性质",
    "ch": "m5",
    "d": 4565
   },
   {
    "p": 30,
    "t": "5.3 相似矩阵的概念与性质",
    "ch": "m5",
    "d": 2255
   },
   {
    "p": 31,
    "t": "5.4 矩阵的对角化",
    "ch": "m5",
    "d": 3014
   },
   {
    "p": 32,
    "t": "5.5 向量的内积与正交矩阵",
    "ch": "m5",
    "d": 3817
   },
   {
    "p": 33,
    "t": "5.6 实对阵矩阵的对角化",
    "ch": "m5",
    "d": 1862
   },
   {
    "p": 34,
    "t": "6.1 二次型及矩阵表示",
    "ch": "m6",
    "d": 3226
   },
   {
    "p": 35,
    "t": "6.2 化二次型为标准形",
    "ch": "m6",
    "d": 3207
   },
   {
    "p": 36,
    "t": "6.3 有定性",
    "ch": "m6",
    "d": 3597
   },
   {
    "p": 37,
    "t": "7.1 向量空间的概念",
    "ch": "m7",
    "d": 1044
   },
   {
    "p": 38,
    "t": "7.2 基 维数 坐标",
    "ch": "m7",
    "d": 1155
   },
   {
    "p": 39,
    "t": "7.3 基与坐标变换",
    "ch": "m7",
    "d": 1870
   }
  ],
  "terms": {
   "m1": [
    [
     "determinant",
     "n.",
     "行列式",
     "The determinant of a 2x2 matrix is ad minus bc.",
     "二阶矩阵的行列式是 ad 减 bc。"
    ],
    [
     "minor",
     "n.",
     "余子式",
     "Delete one row and one column to get the minor.",
     "删掉一行一列就得到余子式。"
    ],
    [
     "cofactor",
     "n.",
     "代数余子式",
     "The cofactor adds a sign to the minor.",
     "代数余子式就是给余子式加正负号。"
    ],
    [
     "upper triangular",
     "adj.",
     "上三角",
     "An upper triangular determinant equals the product of its diagonal.",
     "上三角行列式等于对角线元素之积。"
    ],
    [
     "Cramer rule",
     "n.",
     "克拉默法则",
     "Cramer rule solves a system with determinants.",
     "克拉默法则用行列式解方程组。"
    ],
    [
     "permutation",
     "n.",
     "排列",
     "A permutation is an ordered arrangement.",
     "排列就是有序的安排。"
    ]
   ],
   "m2": [
    [
     "matrix",
     "n.",
     "矩阵",
     "A matrix stores numbers in rows and columns.",
     "矩阵把数字排成行和列。"
    ],
    [
     "transpose",
     "n./v.",
     "转置",
     "The transpose swaps rows and columns.",
     "转置把行和列互换。"
    ],
    [
     "identity matrix",
     "n.",
     "单位矩阵",
     "Multiplying by the identity matrix changes nothing.",
     "乘单位矩阵等于没变。"
    ],
    [
     "inverse matrix",
     "n.",
     "逆矩阵",
     "A times its inverse gives the identity matrix.",
     "A 乘它的逆等于单位矩阵。"
    ],
    [
     "adjugate",
     "n.",
     "伴随矩阵",
     "The adjugate is built from cofactors.",
     "伴随矩阵由代数余子式拼成。"
    ],
    [
     "elementary transformation",
     "n.",
     "初等变换",
     "Row operations do not change the rank.",
     "初等行变换不改变秩。"
    ],
    [
     "rank",
     "n.",
     "秩",
     "The rank counts independent rows.",
     "秩就是线性无关的行数。"
    ],
    [
     "block matrix",
     "n.",
     "分块矩阵",
     "Split a big matrix into blocks to compute faster.",
     "把大矩阵分块能算得更快。"
    ]
   ],
   "m3": [
    [
     "vector",
     "n.",
     "向量",
     "A vector is an ordered list of numbers.",
     "向量是一列有序的数。"
    ],
    [
     "linear combination",
     "n.",
     "线性组合",
     "Any vector in the plane is a linear combination of two basis vectors.",
     "平面内任何向量都是两个基向量的线性组合。"
    ],
    [
     "linearly dependent",
     "adj.",
     "线性相关",
     "If one vector is a combination of others, the set is dependent.",
     "某个向量能被其余表示，这组就线性相关。"
    ],
    [
     "linearly independent",
     "adj.",
     "线性无关",
     "No vector can be built from the others.",
     "没有一个向量能由其余表示。"
    ],
    [
     "maximal independent set",
     "n.",
     "极大线性无关组",
     "It spans the same space with the fewest vectors.",
     "用最少的向量张成同一个空间。"
    ],
    [
     "rank of a vector set",
     "n.",
     "向量组的秩",
     "The rank equals the size of a maximal independent set.",
     "向量组的秩等于极大无关组的个数。"
    ]
   ],
   "m4": [
    [
     "homogeneous system",
     "n.",
     "齐次方程组",
     "A homogeneous system always has the zero solution.",
     "齐次方程组一定有零解。"
    ],
    [
     "non-homogeneous",
     "adj.",
     "非齐次",
     "A non-homogeneous system may have no solution.",
     "非齐次方程组可能无解。"
    ],
    [
     "general solution",
     "n.",
     "通解",
     "The general solution covers every solution.",
     "通解把所有解都包住了。"
    ],
    [
     "particular solution",
     "n.",
     "特解",
     "One fixed solution of the system.",
     "方程组的一个具体解。"
    ],
    [
     "free variable",
     "n.",
     "自由变量",
     "Free variables give the solution its freedom.",
     "自由变量决定解的自由度。"
    ],
    [
     "consistent",
     "adj.",
     "相容（有解）",
     "The system is consistent when rank(A) equals rank(A|b).",
     "当系数矩阵与增广矩阵秩相等时有解。"
    ]
   ],
   "m5": [
    [
     "eigenvalue",
     "n.",
     "特征值",
     "Av equals lambda times v for an eigenvector.",
     "对特征向量有 Av 等于 λv。"
    ],
    [
     "eigenvector",
     "n.",
     "特征向量",
     "The eigenvector only gets stretched, not rotated.",
     "特征向量只被拉伸，不被转向。"
    ],
    [
     "characteristic polynomial",
     "n.",
     "特征多项式",
     "Set the determinant of A minus lambda I to zero.",
     "令 A 减 λI 的行列式为零。"
    ],
    [
     "similar matrices",
     "n.",
     "相似矩阵",
     "Similar matrices share the same eigenvalues.",
     "相似矩阵特征值相同。"
    ],
    [
     "diagonalization",
     "n.",
     "对角化",
     "A matrix with enough eigenvectors can be diagonalized.",
     "特征向量够多就能对角化。"
    ],
    [
     "orthogonal matrix",
     "n.",
     "正交矩阵",
     "Its transpose equals its inverse.",
     "正交矩阵的转置等于逆。"
    ]
   ],
   "m6": [
    [
     "quadratic form",
     "n.",
     "二次型",
     "A quadratic form is written as x transpose A x.",
     "二次型写成 xᵀAx。"
    ],
    [
     "symmetric matrix",
     "n.",
     "对称矩阵",
     "Every quadratic form has a symmetric matrix.",
     "每个二次型都对应一个对称矩阵。"
    ],
    [
     "standard form",
     "n.",
     "标准形",
     "Only squared terms are left in the standard form.",
     "标准形里只剩平方项。"
    ],
    [
     "congruent",
     "adj.",
     "合同",
     "Congruent matrices have the same inertia.",
     "合同矩阵有相同的惯性指数。"
    ],
    [
     "positive definite",
     "adj.",
     "正定",
     "All leading principal minors are positive.",
     "所有顺序主子式都大于零。"
    ],
    [
     "inertia",
     "n.",
     "惯性指数",
     "The number of positive and negative squared terms.",
     "正负平方项的个数。"
    ]
   ],
   "m7": [
    [
     "vector space",
     "n.",
     "向量空间",
     "A vector space is closed under addition and scaling.",
     "向量空间对加法与数乘封闭。"
    ],
    [
     "subspace",
     "n.",
     "子空间",
     "A subspace is a smaller vector space inside.",
     "子空间是里面更小的向量空间。"
    ],
    [
     "basis",
     "n.",
     "基",
     "A basis is independent and spans the space.",
     "基线性无关且能张成整个空间。"
    ],
    [
     "dimension",
     "n.",
     "维数",
     "The dimension is the number of vectors in a basis.",
     "维数就是基里向量的个数。"
    ],
    [
     "coordinates",
     "n.",
     "坐标",
     "Coordinates describe a vector by its basis.",
     "坐标用基来描述一个向量。"
    ],
    [
     "transition matrix",
     "n.",
     "过渡矩阵",
     "The transition matrix changes one basis to another.",
     "过渡矩阵把一组基换成另一组。"
    ]
   ]
  },
  "notes": {},
  "chapterNotes": {
   "m1": {
    "pts": [
     "行列式就是一个「按固定规则算出来的数」，它判断矩阵是否可逆、方程组是否唯一解。",
     "n 阶行列式用排列定义，实际计算一律先化成上三角再对角线相乘。",
     "克拉默法则只适合「方程个数=未知数个数且行列式不为零」的小规模情形。"
    ],
    "ex": [
     "用性质把三阶行列式化成上三角再求值|交换两行变号、某行乘 k 提到外面、一行加上另一行的倍数不变值，化成上三角后对角线相乘。",
     "判断方程组解的唯一性|先算系数矩阵行列式 D，D≠0 有唯一解；再用克拉默法则求每个未知数。"
    ],
    "code": ""
   },
   "m2": {
    "pts": [
     "矩阵乘法不满足交换律，AB 与 BA 通常不等，这是后面所有结论的前提。",
     "逆矩阵三件套：伴随矩阵法（2×2 直接套公式）、初等行变换法（更实用）、定义法。",
     "秩是整个线代的核心指标：它决定了方程组解的自由度，也决定了向量组的独立性。"
    ],
    "ex": [
     "求 3 阶矩阵的逆|把 (A|E) 做初等行变换化成 (E|A⁻¹)，比伴随矩阵快得多。",
     "判断矩阵是否可逆|算 |A|，不为零可逆；或看秩是否等于阶数。"
    ],
    "code": ""
   },
   "m3": {
    "pts": [
     "线性相关性是「有没有多余的向量」：能被其余表示就相关。",
     "判断相关性：把向量拼成矩阵做初等行变换，看秩是否等于向量个数。",
     "极大线性无关组不唯一，但所含向量个数（秩）唯一。"
    ],
    "ex": [
     "判断三个三维向量是否线性相关|拼成 3×3 矩阵求行列式，为零则相关。",
     "求向量组的秩与一个极大无关组|化成阶梯形，非零行数即秩，主元所在列对应原向量即为极大无关组。"
    ],
    "code": ""
   },
   "m4": {
    "pts": [
     "解的判定只看两个秩：r(A) 与 r(A|b)。相等才有解，等于未知数个数则唯一。",
     "齐次方程组必有零解，有非零解的充要条件是 r(A)<n。",
     "非齐次通解 = 一个特解 + 对应齐次方程组的通解，这个结构必须记住。"
    ],
    "ex": [
     "判断方程组解的情况|分别求 r(A) 与 r(A|b)，比较三者关系。",
     "求非齐次方程组的通解|化增广矩阵为行最简形，主元变量用自由变量表示。"
    ],
    "code": ""
   },
   "m5": {
    "pts": [
     "特征值解 |A−λE|=0，特征向量解 (A−λE)x=0 的非零解。",
     "n 阶矩阵能对角化的充要条件是有 n 个线性无关的特征向量。",
     "实对称矩阵一定能正交对角化，这是二次型化简的理论依据。"
    ],
    "ex": [
     "求矩阵的特征值与特征向量|解特征方程得 λ，再代回求基础解系。",
     "判断能否对角化|看每个特征值的几何重数是否等于代数重数。"
    ],
    "code": ""
   },
   "m6": {
    "pts": [
     "二次型与对称矩阵一一对应，化简二次型就是合同变换。",
     "配方法最稳，正交变换法能同时看出惯性指数。",
     "正定判定：顺序主子式全大于零，或特征值全大于零。"
    ],
    "ex": [
     "用配方法化二次型为标准形|按 x1 配方，再对剩余部分继续配方。",
     "判断二次型是否正定|算各阶顺序主子式，全正即正定。"
    ],
    "code": ""
   },
   "m7": {
    "pts": [
     "向量空间是「对加法和数乘封闭」的集合，Rn 是最常见的例子。",
     "基 = 线性无关 + 能张成；维数 = 基中向量个数。",
     "同一向量在不同基下坐标不同，过渡矩阵负责换算。"
    ],
    "ex": [
     "验证一个集合是否构成向量空间|逐条检查加法与数乘是否封闭。",
     "求一组基与维数|解齐次方程组，基础解系就是一组基。"
    ],
    "code": ""
   }
  }
 },
 "calculus": {
  "id": "calculus",
  "bv": "BV1UW411k7Jv",
  "title": "微积分 / 高等数学 · 宋浩全程",
  "sub": "一元到多元 · 极限到微分方程 · 59 段",
  "teacher": "宋浩",
  "platform": "B 站（页面内直接播放）",
  "url": "https://www.bilibili.com/video/BV1UW411k7Jv/",
  "lang": "全中文",
  "cost": "免费",
  "length": "59 集 · 约 47.2 小时",
  "secs": 170078,
  "why": "高数挂科率最高的课，也是最需要「有人带着算」的课。这套从集合函数一路讲到级数与微分方程，例题量大，适合零基础跟。",
  "how": "按章推进，每章结束做 10 道课后题再往下走。极限、导数、积分三大块是地基，宁可慢两周也别跳。",
  "chapters": [
   {
    "id": "m1",
    "n": "第1章",
    "name": "函数与极限",
    "from": 1,
    "to": 13,
    "desc": "集合与函数、数列与函数极限、无穷小、运算法则、两个重要极限、连续"
   },
   {
    "id": "m2",
    "n": "第2章",
    "name": "导数与微分",
    "from": 14,
    "to": 19,
    "desc": "导数定义、求导法则、高阶导数、微分"
   },
   {
    "id": "m3",
    "n": "第3章",
    "name": "中值定理与导数应用",
    "from": 20,
    "to": 26,
    "desc": "罗尔/拉格朗日/柯西、泰勒、洛必达、单调凸凹、极值最值、作图"
   },
   {
    "id": "m4",
    "n": "第4章",
    "name": "不定积分",
    "from": 27,
    "to": 31,
    "desc": "原函数、第一/第二换元、分部积分、有理函数积分"
   },
   {
    "id": "m5",
    "n": "第5章",
    "name": "定积分及其应用",
    "from": 32,
    "to": 41,
    "desc": "概念与性质、微积分基本定理、换元与分部、面积体积、广义积分"
   },
   {
    "id": "m6",
    "n": "第6章",
    "name": "多元函数与二重积分",
    "from": 42,
    "to": 51,
    "desc": "空间解析几何、偏导、全微分、复合与隐函数求导、极值、二重积分"
   },
   {
    "id": "m7",
    "n": "第7章",
    "name": "无穷级数",
    "from": 52,
    "to": 55,
    "desc": "级数定义与性质、正项级数、任意项级数、幂级数"
   },
   {
    "id": "m8",
    "n": "第8章",
    "name": "微分方程",
    "from": 56,
    "to": 59,
    "desc": "基本概念、一阶方程、高阶方程、差分方程"
   }
  ],
  "pages": [
   {
    "p": 1,
    "t": "1.1 集合",
    "ch": "m1",
    "d": 3113
   },
   {
    "p": 2,
    "t": "1.2 函数",
    "ch": "m1",
    "d": 2313
   },
   {
    "p": 3,
    "t": "1.4 数列极限（一）",
    "ch": "m1",
    "d": 2859
   },
   {
    "p": 4,
    "t": "1.4 数列极限（二）",
    "ch": "m1",
    "d": 2467
   },
   {
    "p": 5,
    "t": "1.5 函数极限（一）",
    "ch": "m1",
    "d": 2640
   },
   {
    "p": 6,
    "t": "1.5 函数极限（二）",
    "ch": "m1",
    "d": 863
   },
   {
    "p": 7,
    "t": "1.6 无穷小和无穷大",
    "ch": "m1",
    "d": 1657
   },
   {
    "p": 8,
    "t": "1.7 极限的运算法则",
    "ch": "m1",
    "d": 1967
   },
   {
    "p": 9,
    "t": "1.8 极限存在准则",
    "ch": "m1",
    "d": 1627
   },
   {
    "p": 10,
    "t": "1.8 两个重要极限",
    "ch": "m1",
    "d": 2754
   },
   {
    "p": 11,
    "t": "1.9 无穷小的比较",
    "ch": "m1",
    "d": 2093
   },
   {
    "p": 12,
    "t": "1.10 函数的连续 (一)",
    "ch": "m1",
    "d": 2474
   },
   {
    "p": 13,
    "t": "1.10 函数的连续（二）",
    "ch": "m1",
    "d": 2948
   },
   {
    "p": 14,
    "t": "2.1 导数的定义",
    "ch": "m2",
    "d": 1805
   },
   {
    "p": 15,
    "t": "2.1 导数的定义（二）",
    "ch": "m2",
    "d": 1593
   },
   {
    "p": 16,
    "t": "2.2 求导法则",
    "ch": "m2",
    "d": 3064
   },
   {
    "p": 17,
    "t": "2.4 高阶导数",
    "ch": "m2",
    "d": 1794
   },
   {
    "p": 18,
    "t": "2.5 微分（一）",
    "ch": "m2",
    "d": 1832
   },
   {
    "p": 19,
    "t": "2.5 微分（二）",
    "ch": "m2",
    "d": 4512
   },
   {
    "p": 20,
    "t": "3.1 微分中值定理",
    "ch": "m3",
    "d": 1291
   },
   {
    "p": 21,
    "t": "3.1 柯西中值定理",
    "ch": "m3",
    "d": 894
   },
   {
    "p": 22,
    "t": "3.1 中值定理（二）泰勒定理",
    "ch": "m3",
    "d": 1785
   },
   {
    "p": 23,
    "t": "3.2 洛必达法则",
    "ch": "m3",
    "d": 3363
   },
   {
    "p": 24,
    "t": "3.3 函数单调性与凸凹性",
    "ch": "m3",
    "d": 3549
   },
   {
    "p": 25,
    "t": "3.4 极值与最值",
    "ch": "m3",
    "d": 4501
   },
   {
    "p": 26,
    "t": "3.5 函数作图",
    "ch": "m3",
    "d": 4013
   },
   {
    "p": 27,
    "t": "4.1 不定积分",
    "ch": "m4",
    "d": 4511
   },
   {
    "p": 28,
    "t": "4.2 积分法（第一换元积分法）",
    "ch": "m4",
    "d": 4324
   },
   {
    "p": 29,
    "t": "4.2 积分法（第二换元积分法）",
    "ch": "m4",
    "d": 2327
   },
   {
    "p": 30,
    "t": "4.2 积分法（分部积分法）",
    "ch": "m4",
    "d": 2059
   },
   {
    "p": 31,
    "t": "4.3 有理函数的积分",
    "ch": "m4",
    "d": 4476
   },
   {
    "p": 32,
    "t": "5.1 定积分的概念",
    "ch": "m5",
    "d": 2798
   },
   {
    "p": 33,
    "t": "5.2 定积分的性质",
    "ch": "m5",
    "d": 1935
   },
   {
    "p": 34,
    "t": "5.2 微积分基本定理",
    "ch": "m5",
    "d": 4340
   },
   {
    "p": 35,
    "t": "5.3 定积分的换元积分法",
    "ch": "m5",
    "d": 3261
   },
   {
    "p": 36,
    "t": "5.3 定积分的分部积分法",
    "ch": "m5",
    "d": 884
   },
   {
    "p": 37,
    "t": "5.4 定积分应用-求面积",
    "ch": "m5",
    "d": 1743
   },
   {
    "p": 38,
    "t": "5.4 定积分应用-求体积",
    "ch": "m5",
    "d": 727
   },
   {
    "p": 39,
    "t": "5.4 定积分应用-经济问题",
    "ch": "m5",
    "d": 1695
   },
   {
    "p": 40,
    "t": "5.5 广义积分-无穷限积分",
    "ch": "m5",
    "d": 2622
   },
   {
    "p": 41,
    "t": "5.5 广义积分-暇积分",
    "ch": "m5",
    "d": 2460
   },
   {
    "p": 42,
    "t": "6.1 空间解析几何",
    "ch": "m6",
    "d": 1624
   },
   {
    "p": 43,
    "t": "6.2 多元函数的基本概念",
    "ch": "m6",
    "d": 3997
   },
   {
    "p": 44,
    "t": "6.3 偏导数",
    "ch": "m6",
    "d": 3776
   },
   {
    "p": 45,
    "t": "6.4 全微分",
    "ch": "m6",
    "d": 5413
   },
   {
    "p": 46,
    "t": "6.5 多元复合函数求导",
    "ch": "m6",
    "d": 4400
   },
   {
    "p": 47,
    "t": "6.5 隐函数求导",
    "ch": "m6",
    "d": 5031
   },
   {
    "p": 48,
    "t": "6.6 二元函数的极值",
    "ch": "m6",
    "d": 5013
   },
   {
    "p": 49,
    "t": "6.7 二重积分的定义和性质",
    "ch": "m6",
    "d": 1802
   },
   {
    "p": 50,
    "t": "6.8 二重积分的计算（直角坐标系",
    "ch": "m6",
    "d": 2935
   },
   {
    "p": 51,
    "t": "6.8 二重积分的计算（极坐标）",
    "ch": "m6",
    "d": 5218
   },
   {
    "p": 52,
    "t": "7.1 无穷级数的定义和性质",
    "ch": "m7",
    "d": 4623
   },
   {
    "p": 53,
    "t": "7.2 正项级数",
    "ch": "m7",
    "d": 4319
   },
   {
    "p": 54,
    "t": "7.3 任意项级数",
    "ch": "m7",
    "d": 4686
   },
   {
    "p": 55,
    "t": "7.4 幂级数",
    "ch": "m7",
    "d": 4304
   },
   {
    "p": 56,
    "t": "8.1 微分方程的概念",
    "ch": "m8",
    "d": 1147
   },
   {
    "p": 57,
    "t": "8.2 一阶微分方程",
    "ch": "m8",
    "d": 3688
   },
   {
    "p": 58,
    "t": "8.3 高阶微分方程",
    "ch": "m8",
    "d": 1986
   },
   {
    "p": 59,
    "t": "8.4 差分方程",
    "ch": "m8",
    "d": 2183
   }
  ],
  "terms": {
   "m1": [
    [
     "limit",
     "n.",
     "极限",
     "The limit describes where a function is heading.",
     "极限描述函数往哪儿走。"
    ],
    [
     "sequence",
     "n.",
     "数列",
     "A sequence is a list of numbers in order.",
     "数列是按顺序排的一列数。"
    ],
    [
     "infinitesimal",
     "n./adj.",
     "无穷小",
     "An infinitesimal tends to zero.",
     "无穷小趋于零。"
    ],
    [
     "continuity",
     "n.",
     "连续性",
     "A function is continuous if the limit equals the value.",
     "极限等于函数值才连续。"
    ],
    [
     "discontinuity",
     "n.",
     "间断点",
     "The point where continuity breaks.",
     "连续性断掉的那个点。"
    ],
    [
     "two important limits",
     "n.",
     "两个重要极限",
     "sin x over x and one plus one over x to the x.",
     "sin x/x 与 (1+1/x)^x。"
    ]
   ],
   "m2": [
    [
     "derivative",
     "n.",
     "导数",
     "The derivative is the slope of the tangent line.",
     "导数是切线的斜率。"
    ],
    [
     "differentiable",
     "adj.",
     "可导",
     "Differentiable implies continuous, not the reverse.",
     "可导必连续，反之不成立。"
    ],
    [
     "chain rule",
     "n.",
     "链式法则",
     "The chain rule handles composite functions.",
     "链式法则处理复合函数。"
    ],
    [
     "higher-order derivative",
     "n.",
     "高阶导数",
     "Differentiate the derivative again.",
     "对导数再求导。"
    ],
    [
     "differential",
     "n.",
     "微分",
     "The differential approximates the change.",
     "微分近似描述变化量。"
    ],
    [
     "implicit differentiation",
     "n.",
     "隐函数求导",
     "Differentiate both sides with respect to x.",
     "两边同时对 x 求导。"
    ]
   ],
   "m3": [
    [
     "Rolle theorem",
     "n.",
     "罗尔定理",
     "Equal endpoints give a zero derivative inside.",
     "两端相等则中间有一点导数为零。"
    ],
    [
     "mean value theorem",
     "n.",
     "拉格朗日中值定理",
     "Some point has the average slope.",
     "存在一点的导数等于平均斜率。"
    ],
    [
     "Taylor formula",
     "n.",
     "泰勒公式",
     "Approximate a function with polynomials.",
     "用多项式逼近函数。"
    ],
    [
     "L Hopital rule",
     "n.",
     "洛必达法则",
     "Take derivatives of top and bottom for 0/0.",
     "0/0 型上下分别求导。"
    ],
    [
     "monotonicity",
     "n.",
     "单调性",
     "The sign of the derivative decides up or down.",
     "导数符号决定升降。"
    ],
    [
     "extremum",
     "n.",
     "极值",
     "A local maximum or minimum.",
     "局部最大或最小。"
    ],
    [
     "inflection point",
     "n.",
     "拐点",
     "Where concavity changes sign.",
     "凹凸性改变的点。"
    ]
   ],
   "m4": [
    [
     "antiderivative",
     "n.",
     "原函数",
     "A function whose derivative is the integrand.",
     "导数等于被积函数的那个函数。"
    ],
    [
     "indefinite integral",
     "n.",
     "不定积分",
     "The family of all antiderivatives.",
     "所有原函数构成的不定积分。"
    ],
    [
     "substitution",
     "n.",
     "换元积分法",
     "Change the variable to simplify the integral.",
     "换变量让积分变简单。"
    ],
    [
     "integration by parts",
     "n.",
     "分部积分法",
     "Based on the product rule, reversed.",
     "把乘积求导公式反过来用。"
    ],
    [
     "partial fraction",
     "n.",
     "部分分式",
     "Split a rational function into simple pieces.",
     "把有理函数拆成简单分式。"
    ],
    [
     "constant of integration",
     "n.",
     "积分常数",
     "Never forget the plus C.",
     "别忘了加 C。"
    ]
   ],
   "m5": [
    [
     "definite integral",
     "n.",
     "定积分",
     "The signed area under the curve.",
     "曲线下的有向面积。"
    ],
    [
     "Riemann sum",
     "n.",
     "黎曼和",
     "Rectangles approximate the area.",
     "用小矩形逼近面积。"
    ],
    [
     "fundamental theorem",
     "n.",
     "微积分基本定理",
     "Integration and differentiation are inverse.",
     "积分与求导互为逆运算。"
    ],
    [
     "improper integral",
     "n.",
     "广义积分",
     "Infinite limits or unbounded integrand.",
     "无穷区间或无界函数。"
    ],
    [
     "area between curves",
     "n.",
     "面积",
     "Integrate the difference of two functions.",
     "对两函数之差积分。"
    ],
    [
     "volume of revolution",
     "n.",
     "旋转体体积",
     "Use the disk or shell method.",
     "用圆盘法或柱壳法。"
    ]
   ],
   "m6": [
    [
     "partial derivative",
     "n.",
     "偏导数",
     "Differentiate with respect to one variable only.",
     "只对一个变量求导。"
    ],
    [
     "total differential",
     "n.",
     "全微分",
     "The linear approximation in several variables.",
     "多元下的线性近似。"
    ],
    [
     "gradient",
     "n.",
     "梯度",
     "The gradient points to the steepest ascent.",
     "梯度指向最陡上升方向。"
    ],
    [
     "double integral",
     "n.",
     "二重积分",
     "Integrate over a region in the plane.",
     "在平面区域上积分。"
    ],
    [
     "iterated integral",
     "n.",
     "累次积分",
     "Do the inner integral first.",
     "先算里面那个积分。"
    ],
    [
     "polar coordinates",
     "n.",
     "极坐标",
     "Use r and theta for circular regions.",
     "圆形区域用 r 和 θ。"
    ]
   ],
   "m7": [
    [
     "series",
     "n.",
     "级数",
     "An infinite sum of terms.",
     "无穷多项相加。"
    ],
    [
     "partial sum",
     "n.",
     "部分和",
     "The sum of the first n terms.",
     "前 n 项的和。"
    ],
    [
     "convergence",
     "n.",
     "收敛",
     "Partial sums approach a finite limit.",
     "部分和趋于有限值。"
    ],
    [
     "geometric series",
     "n.",
     "几何级数",
     "It converges when the ratio is below one.",
     "公比绝对值小于 1 才收敛。"
    ],
    [
     "power series",
     "n.",
     "幂级数",
     "A series in powers of x.",
     "以 x 的幂构成的级数。"
    ],
    [
     "radius of convergence",
     "n.",
     "收敛半径",
     "Inside the radius the series converges.",
     "半径内级数收敛。"
    ]
   ],
   "m8": [
    [
     "differential equation",
     "n.",
     "微分方程",
     "An equation with derivatives in it.",
     "含导数的方程。"
    ],
    [
     "order",
     "n.",
     "阶",
     "The order is the highest derivative.",
     "阶就是最高阶导数的阶数。"
    ],
    [
     "separable equation",
     "n.",
     "可分离变量方程",
     "Move y to one side and x to the other.",
     "把 y 和 x 分到两边。"
    ],
    [
     "general solution",
     "n.",
     "通解",
     "It contains arbitrary constants.",
     "通解含任意常数。"
    ],
    [
     "initial value problem",
     "n.",
     "初值问题",
     "Use the initial condition to fix the constant.",
     "用初始条件定常数。"
    ],
    [
     "difference equation",
     "n.",
     "差分方程",
     "The discrete version of a differential equation.",
     "微分方程的离散版本。"
    ]
   ]
  },
  "notes": {},
  "chapterNotes": {
   "m1": {
    "pts": [
     "极限是整门课的地基：导数、积分、连续性全部由它定义。",
     "两个重要极限必须背：sin x/x → 1，(1+1/x)^x → e。",
     "连续 = 左极限 = 右极限 = 函数值，三者缺一不可。"
    ],
    "ex": [
     "求 0/0 型极限|先尝试等价无穷小替换（sin x~x、ln(1+x)~x、1-cos x~x²/2）。",
     "判断间断点类型|算左右极限：都存在且相等是可去，不等是跳跃，趋于无穷是无穷间断。"
    ],
    "code": ""
   },
   "m2": {
    "pts": [
     "导数就是切线斜率，也是瞬时变化率；可导一定连续。",
     "求导法则要练到条件反射：四则、复合、隐函数、参数方程。",
     "微分是「线性主部」，近似计算与误差估计都靠它。"
    ],
    "ex": [
     "求复合函数的导数|由外向内逐层求导再相乘（链式法则）。",
     "求隐函数的 dy/dx|两边对 x 求导，把 y 看成 x 的函数，再解出 dy/dx。"
    ],
    "code": ""
   },
   "m3": {
    "pts": [
     "三大中值定理是「存在性」工具，证明题几乎全靠它们。",
     "洛必达只能用于 0/0 或 ∞/∞，用前先验证类型。",
     "单调性看一阶导符号，凹凸性看二阶导符号，极值看一阶导变号。"
    ],
    "ex": [
     "证明存在 ξ 使某式成立|构造辅助函数 F(x)，用罗尔定理。",
     "求函数的极值与最值|求驻点与不可导点，比较函数值；闭区间还要看端点。"
    ],
    "code": ""
   },
   "m4": {
    "pts": [
     "不定积分是求导的逆运算，结果别忘了 +C。",
     "换元法分两类：第一类凑微分，第二类去根号。",
     "分部积分口诀「反对幂指三」，谁在前谁当 u。"
    ],
    "ex": [
     "求 ∫x·e^x dx|分部积分，u=x，dv=e^x dx。",
     "求 ∫dx/(x²+a²)|套公式 (1/a)arctan(x/a)+C。"
    ],
    "code": ""
   },
   "m5": {
    "pts": [
     "定积分是「有向面积」，符号由函数正负决定。",
     "微积分基本定理把定积分与不定积分连起来：先找原函数再代上下限。",
     "广义积分先算极限再判断收敛，不能直接套公式。"
    ],
    "ex": [
     "求曲线围成的面积|先求交点定上下限，再对「上减下」积分。",
     "求旋转体体积|绕 x 轴用 π∫y²dx，绕 y 轴可用柱壳法。"
    ],
    "code": ""
   },
   "m6": {
    "pts": [
     "偏导数就是「把别的变量当常数」再求导。",
     "全微分存在 ⇒ 偏导存在，反之不一定（这是常考点）。",
     "二重积分的关键是定限：先画区域，再决定先对谁积分。"
    ],
    "ex": [
     "求二元函数的偏导|对 x 求导时把 y 看作常数。",
     "交换二重积分的积分次序|先画出积分区域，再按新的顺序重新定限。"
    ],
    "code": ""
   },
   "m7": {
    "pts": [
     "级数收敛的必要条件是通项趋于零，但它不充分（调和级数）。",
     "正项级数优先用比值法、根值法；交错级数用莱布尼茨判别法。",
     "幂级数先求收敛半径，再单独检查端点。"
    ],
    "ex": [
     "判断级数是否收敛|先看通项是否趋于 0，再用比值法或比较法。",
     "求幂级数的收敛域|先算 R，再分别代入 x=±R 判断端点。"
    ],
    "code": ""
   },
   "m8": {
    "pts": [
     "微分方程的阶 = 最高阶导数的阶数，通解含任意常数个数等于阶数。",
     "一阶方程先判断类型：可分离、齐次、一阶线性，各有固定解法。",
     "差分方程是离散版，经济类题目常考。"
    ],
    "ex": [
     "解可分离变量方程|把 y 和 dy 放一边，x 和 dx 放另一边，两边积分。",
     "解一阶线性方程|套通解公式，或先求积分因子。"
    ],
    "code": ""
   }
  }
 },
 "stats": {
  "id": "stats",
  "bv": "BV1JXppejE8q",
  "title": "概率论与数理统计 · 宋浩 2.0 版",
  "sub": "概率到假设检验 · 63 段 · 统计学核心",
  "teacher": "宋浩",
  "platform": "B 站（页面内直接播放）",
  "url": "https://www.bilibili.com/video/BV1JXppejE8q/",
  "lang": "全中文",
  "cost": "免费",
  "length": "63 集 · 约 37.0 小时",
  "secs": 133164,
  "why": "统计学的数学底座就是这一门：随机变量、分布、数字特征、抽样分布、参数估计、假设检验。学完才能看懂 A/B 测试、置信区间和 p 值到底在说什么。",
  "how": "前 4 章是概率（重在算），后 4 章是统计（重在懂）。第 6 章抽样分布最容易糊，配一张三大分布的表背下来。",
  "chapters": [
   {
    "id": "m0",
    "n": "预备",
    "name": "预备知识",
    "from": 1,
    "to": 1,
    "desc": "加法原理、乘法原理、排列与组合"
   },
   {
    "id": "m1",
    "n": "第1章",
    "name": "随机事件与概率",
    "from": 2,
    "to": 7,
    "desc": "样本空间、频率与概率、古典与几何概型、条件概率、全概率与贝叶斯、独立性"
   },
   {
    "id": "m2",
    "n": "第2章",
    "name": "一维随机变量",
    "from": 8,
    "to": 17,
    "desc": "分布函数、离散型（0-1/二项/泊松/几何/超几何）、连续型（均匀/指数/正态）、函数分布"
   },
   {
    "id": "m3",
    "n": "第3章",
    "name": "二维随机变量",
    "from": 18,
    "to": 32,
    "desc": "联合分布、边缘分布、条件分布、独立性、两个随机变量函数的分布"
   },
   {
    "id": "m4",
    "n": "第4章",
    "name": "数字特征",
    "from": 33,
    "to": 43,
    "desc": "数学期望、方差、协方差与相关系数、矩与协方差矩阵"
   },
   {
    "id": "m5",
    "n": "第5章",
    "name": "大数定律与中心极限定理",
    "from": 44,
    "to": 46,
    "desc": "切比雪夫不等式、大数定律、中心极限定理"
   },
   {
    "id": "m6",
    "n": "第6章",
    "name": "数理统计基础",
    "from": 47,
    "to": 50,
    "desc": "总体与样本、统计量、抽样分布（卡方/t/F）"
   },
   {
    "id": "m7",
    "n": "第7章",
    "name": "参数估计",
    "from": 51,
    "to": 55,
    "desc": "矩估计、极大似然、评价标准、区间估计"
   },
   {
    "id": "m8",
    "n": "第8章",
    "name": "假设检验",
    "from": 56,
    "to": 63,
    "desc": "基本思想、两类错误、均值与方差的检验、差异性检验"
   }
  ],
  "pages": [
   {
    "p": 1,
    "t": "预备知识（加法原理 乘法原理 排列与组合）",
    "ch": "m0",
    "d": 2611
   },
   {
    "p": 2,
    "t": "1.1 随机试验与随机事件",
    "ch": "m1",
    "d": 4296
   },
   {
    "p": 3,
    "t": "1.2 频率与概率",
    "ch": "m1",
    "d": 2070
   },
   {
    "p": 4,
    "t": "1.3 古典概型与几何概型",
    "ch": "m1",
    "d": 4817
   },
   {
    "p": 5,
    "t": "1.4条件概率与乘法公式",
    "ch": "m1",
    "d": 3823
   },
   {
    "p": 6,
    "t": "1.5 全概率公式与贝叶斯公式",
    "ch": "m1",
    "d": 5054
   },
   {
    "p": 7,
    "t": "1.6 事件的独立性和伯努利实验",
    "ch": "m1",
    "d": 4512
   },
   {
    "p": 8,
    "t": "2.1 随机变量",
    "ch": "m2",
    "d": 952
   },
   {
    "p": 9,
    "t": "2.2 概率分布",
    "ch": "m2",
    "d": 2025
   },
   {
    "p": 10,
    "t": "2.2 0-1分布 二项分布",
    "ch": "m2",
    "d": 1744
   },
   {
    "p": 11,
    "t": "2.2 泊松分布几何分布超几何分布",
    "ch": "m2",
    "d": 2985
   },
   {
    "p": 12,
    "t": "2.3 随机变量的分布函数",
    "ch": "m2",
    "d": 3064
   },
   {
    "p": 13,
    "t": "2.4 连续型随机变量及其密度函数",
    "ch": "m2",
    "d": 5725
   },
   {
    "p": 14,
    "t": "2.4 均匀分布和指数分布",
    "ch": "m2",
    "d": 1963
   },
   {
    "p": 15,
    "t": "2.4 正态分布",
    "ch": "m2",
    "d": 3620
   },
   {
    "p": 16,
    "t": "2.5 随机变量函数的分布-离散型",
    "ch": "m2",
    "d": 539
   },
   {
    "p": 17,
    "t": "2.5 随机变量函数的分布-连续型",
    "ch": "m2",
    "d": 4386
   },
   {
    "p": 18,
    "t": "3.1 X与Y的联合分布函数",
    "ch": "m3",
    "d": 1568
   },
   {
    "p": 19,
    "t": "3.1二维离散型(X,Y)的概率分布",
    "ch": "m3",
    "d": 1264
   },
   {
    "p": 20,
    "t": "3.2 边缘分布函数",
    "ch": "m3",
    "d": 653
   },
   {
    "p": 21,
    "t": "3.2 二维离散型随机变量(X,Y)的边缘分布律",
    "ch": "m3",
    "d": 497
   },
   {
    "p": 22,
    "t": "3.2 二维连续型随机变量的边缘密度",
    "ch": "m3",
    "d": 3057
   },
   {
    "p": 23,
    "t": "3.3 离散型随机变量的条件分布",
    "ch": "m3",
    "d": 1220
   },
   {
    "p": 24,
    "t": "3.3 连续型随机变量的条件密度",
    "ch": "m3",
    "d": 1430
   },
   {
    "p": 25,
    "t": "3.4 离散型随机变量X与Y相互独立的判定",
    "ch": "m3",
    "d": 979
   },
   {
    "p": 26,
    "t": "总结",
    "ch": "m3",
    "d": 391
   },
   {
    "p": 27,
    "t": "3.4 连续型随机变量X与Y相互独立的判定",
    "ch": "m3",
    "d": 1048
   },
   {
    "p": 28,
    "t": "3.4 连续型随机变量X与Y相互独立的判定",
    "ch": "m3",
    "d": 634
   },
   {
    "p": 29,
    "t": "3.5 两个随机变量函数的分布（离散型）",
    "ch": "m3",
    "d": 1291
   },
   {
    "p": 30,
    "t": "3.5 两个随机变量函数的分布（连续型）",
    "ch": "m3",
    "d": 2812
   },
   {
    "p": 31,
    "t": "3.5 两个随机变量函数的分布（离散型+连续型）",
    "ch": "m3",
    "d": 854
   },
   {
    "p": 32,
    "t": "3.5 max{X,Y} min{X,Y}的分布",
    "ch": "m3",
    "d": 1160
   },
   {
    "p": 33,
    "t": "4.1 数学期望的定义",
    "ch": "m4",
    "d": 894
   },
   {
    "p": 34,
    "t": "4.1 一维随机变量函数的期望",
    "ch": "m4",
    "d": 1579
   },
   {
    "p": 35,
    "t": "4.1 二维随机变量函数的期望",
    "ch": "m4",
    "d": 588
   },
   {
    "p": 36,
    "t": "4.1 数学期望的性质",
    "ch": "m4",
    "d": 1648
   },
   {
    "p": 37,
    "t": "4.2 方差的定义",
    "ch": "m4",
    "d": 1422
   },
   {
    "p": 38,
    "t": "4.2 方差的性质",
    "ch": "m4",
    "d": 1236
   },
   {
    "p": 39,
    "t": "4.2 方差的例题",
    "ch": "m4",
    "d": 870
   },
   {
    "p": 40,
    "t": "4.2 常见分布的期望和方差",
    "ch": "m4",
    "d": 1570
   },
   {
    "p": 41,
    "t": "4.3 协方差",
    "ch": "m4",
    "d": 1577
   },
   {
    "p": 42,
    "t": "4.3 相关系数",
    "ch": "m4",
    "d": 3781
   },
   {
    "p": 43,
    "t": "4.4 矩、协方差矩阵",
    "ch": "m4",
    "d": 1195
   },
   {
    "p": 44,
    "t": "5.1 切比雪夫不等式",
    "ch": "m5",
    "d": 1592
   },
   {
    "p": 45,
    "t": "5.2 大数定律",
    "ch": "m5",
    "d": 2059
   },
   {
    "p": 46,
    "t": "5.3 中心极限定理",
    "ch": "m5",
    "d": 1482
   },
   {
    "p": 47,
    "t": "6.1 总体与样本",
    "ch": "m6",
    "d": 1967
   },
   {
    "p": 48,
    "t": "6.2 统计量",
    "ch": "m6",
    "d": 3430
   },
   {
    "p": 49,
    "t": "6.3 抽样分布（分位数 卡方分布 t分布）",
    "ch": "m6",
    "d": 2965
   },
   {
    "p": 50,
    "t": "6.3 F分布 正态总体下的抽样分布",
    "ch": "m6",
    "d": 3722
   },
   {
    "p": 51,
    "t": "7.1 距估计",
    "ch": "m7",
    "d": 2490
   },
   {
    "p": 52,
    "t": "7.1 极大似然估计",
    "ch": "m7",
    "d": 1830
   },
   {
    "p": 53,
    "t": "7.2 估计量的评价标准",
    "ch": "m7",
    "d": 1187
   },
   {
    "p": 54,
    "t": "7.3 区间估计",
    "ch": "m7",
    "d": 1570
   },
   {
    "p": 55,
    "t": "7.4 正态总体均值与方差的区间估计",
    "ch": "m7",
    "d": 2846
   },
   {
    "p": 56,
    "t": "8.1（一、假设检验问题）",
    "ch": "m8",
    "d": 2174
   },
   {
    "p": 57,
    "t": "8.1（二、假设检验的基本概念）",
    "ch": "m8",
    "d": 586
   },
   {
    "p": 58,
    "t": "8.1（三、假设检验的基本思想）",
    "ch": "m8",
    "d": 1480
   },
   {
    "p": 59,
    "t": "8.1（四、两类错误）",
    "ch": "m8",
    "d": 685
   },
   {
    "p": 60,
    "t": "8.2（一、均值的假设检验）",
    "ch": "m8",
    "d": 3881
   },
   {
    "p": 61,
    "t": "8.2（二、方差的假设检验）",
    "ch": "m8",
    "d": 2406
   },
   {
    "p": 62,
    "t": "8.3 （一、均值的差异性检验）",
    "ch": "m8",
    "d": 2575
   },
   {
    "p": 63,
    "t": "8.3（二、方差的差异性检验）",
    "ch": "m8",
    "d": 2833
   }
  ],
  "terms": {
   "m0": [
    [
     "permutation",
     "n.",
     "排列",
     "Order matters in a permutation.",
     "排列讲顺序。"
    ],
    [
     "combination",
     "n.",
     "组合",
     "Order does not matter in a combination.",
     "组合不讲顺序。"
    ],
    [
     "factorial",
     "n.",
     "阶乘",
     "n factorial is the product from n down to one.",
     "n 的阶乘从 n 乘到 1。"
    ],
    [
     "addition principle",
     "n.",
     "加法原理",
     "Use it for either-or choices.",
     "分类用加法。"
    ],
    [
     "multiplication principle",
     "n.",
     "乘法原理",
     "Use it for step-by-step choices.",
     "分步用乘法。"
    ],
    [
     "sample space",
     "n.",
     "样本空间",
     "All possible outcomes of an experiment.",
     "所有可能结果的集合。"
    ]
   ],
   "m1": [
    [
     "random experiment",
     "n.",
     "随机试验",
     "You cannot predict the exact outcome.",
     "结果无法事先确定。"
    ],
    [
     "event",
     "n.",
     "事件",
     "A subset of the sample space.",
     "样本空间的子集。"
    ],
    [
     "classical probability",
     "n.",
     "古典概型",
     "Count favourable cases over total cases.",
     "有利情形数除以总情形数。"
    ],
    [
     "conditional probability",
     "n.",
     "条件概率",
     "Probability given that another event happened.",
     "在另一事件已发生下的概率。"
    ],
    [
     "Bayes formula",
     "n.",
     "贝叶斯公式",
     "Update the probability after new evidence.",
     "有新证据后更新概率。"
    ],
    [
     "independence",
     "n.",
     "独立性",
     "P of A and B equals P A times P B.",
     "P(AB) 等于 P(A)P(B)。"
    ],
    [
     "Bernoulli trial",
     "n.",
     "伯努利试验",
     "Only two outcomes, repeated.",
     "只有两种结果，重复做。"
    ]
   ],
   "m2": [
    [
     "random variable",
     "n.",
     "随机变量",
     "A number assigned to each outcome.",
     "给每个结果配一个数。"
    ],
    [
     "distribution function",
     "n.",
     "分布函数",
     "F of x is the probability X is at most x.",
     "F(x) 表示 X 不超过 x 的概率。"
    ],
    [
     "probability density",
     "n.",
     "概率密度",
     "Area under the density gives probability.",
     "密度下的面积是概率。"
    ],
    [
     "binomial distribution",
     "n.",
     "二项分布",
     "Number of successes in n trials.",
     "n 次试验中成功的次数。"
    ],
    [
     "Poisson distribution",
     "n.",
     "泊松分布",
     "Counts rare events in a fixed period.",
     "固定时间内稀有事件次数。"
    ],
    [
     "normal distribution",
     "n.",
     "正态分布",
     "The bell curve, symmetric about the mean.",
     "钟形曲线，关于均值对称。"
    ],
    [
     "uniform distribution",
     "n.",
     "均匀分布",
     "Every value is equally likely.",
     "每个值概率相同。"
    ]
   ],
   "m3": [
    [
     "joint distribution",
     "n.",
     "联合分布",
     "The distribution of X and Y together.",
     "X 与 Y 一起的分布。"
    ],
    [
     "marginal distribution",
     "n.",
     "边缘分布",
     "Sum or integrate out the other variable.",
     "把另一个变量积掉。"
    ],
    [
     "conditional distribution",
     "n.",
     "条件分布",
     "Distribution of X given Y equals y.",
     "在 Y 取定值下 X 的分布。"
    ],
    [
     "mutually independent",
     "adj.",
     "相互独立",
     "The joint equals the product of marginals.",
     "联合分布等于边缘分布之积。"
    ],
    [
     "convolution",
     "n.",
     "卷积",
     "The distribution of a sum of variables.",
     "两变量之和的分布。"
    ],
    [
     "bivariate normal",
     "n.",
     "二维正态分布",
     "Two normal variables with correlation.",
     "带相关性的两个正态变量。"
    ]
   ],
   "m4": [
    [
     "mathematical expectation",
     "n.",
     "数学期望",
     "The probability weighted average.",
     "按概率加权的平均值。"
    ],
    [
     "variance",
     "n.",
     "方差",
     "The average squared deviation from the mean.",
     "偏离均值的平方的期望。"
    ],
    [
     "standard deviation",
     "n.",
     "标准差",
     "The square root of the variance.",
     "方差开根号。"
    ],
    [
     "covariance",
     "n.",
     "协方差",
     "Measures how two variables move together.",
     "衡量两个变量一起变动。"
    ],
    [
     "correlation coefficient",
     "n.",
     "相关系数",
     "A normalized covariance between minus one and one.",
     "归一化到 -1 到 1 的协方差。"
    ],
    [
     "moment",
     "n.",
     "矩",
     "Expected powers of the variable.",
     "变量的幂的期望。"
    ]
   ],
   "m5": [
    [
     "Chebyshev inequality",
     "n.",
     "切比雪夫不等式",
     "Bounds the probability of large deviations.",
     "给出大偏差概率的上界。"
    ],
    [
     "law of large numbers",
     "n.",
     "大数定律",
     "The sample mean approaches the true mean.",
     "样本均值趋于真实均值。"
    ],
    [
     "central limit theorem",
     "n.",
     "中心极限定理",
     "Sums become normal as n grows.",
     "n 大时和近似正态。"
    ],
    [
     "convergence in probability",
     "n.",
     "依概率收敛",
     "The gap shrinks with high probability.",
     "大概率下误差变小。"
    ],
    [
     "independent identically distributed",
     "adj.",
     "独立同分布",
     "Same distribution, no dependence.",
     "同分布且互不影响。"
    ],
    [
     "standardize",
     "v.",
     "标准化",
     "Subtract the mean and divide by the standard deviation.",
     "减均值除以标准差。"
    ]
   ],
   "m6": [
    [
     "population",
     "n.",
     "总体",
     "The whole set you want to study.",
     "你想研究的全部对象。"
    ],
    [
     "sample",
     "n.",
     "样本",
     "A part taken from the population.",
     "从总体里抽的一部分。"
    ],
    [
     "statistic",
     "n.",
     "统计量",
     "A function of the sample, no unknown parameters.",
     "只由样本构成、不含未知参数。"
    ],
    [
     "sample mean",
     "n.",
     "样本均值",
     "The average of the sample.",
     "样本的平均值。"
    ],
    [
     "sample variance",
     "n.",
     "样本方差",
     "Divide by n minus one to stay unbiased.",
     "除以 n-1 才无偏。"
    ],
    [
     "chi-square distribution",
     "n.",
     "卡方分布",
     "Sum of squared standard normals.",
     "标准正态的平方和。"
    ],
    [
     "t distribution",
     "n.",
     "t 分布",
     "Used when the variance is unknown.",
     "方差未知时用它。"
    ]
   ],
   "m7": [
    [
     "point estimation",
     "n.",
     "点估计",
     "One number estimates the parameter.",
     "用一个数估计参数。"
    ],
    [
     "method of moments",
     "n.",
     "矩估计",
     "Match sample moments to theoretical ones.",
     "让样本矩等于理论矩。"
    ],
    [
     "maximum likelihood",
     "n.",
     "极大似然估计",
     "Pick the parameter that makes the data most likely.",
     "选让数据最可能出现的参数。"
    ],
    [
     "unbiased",
     "adj.",
     "无偏",
     "The expectation of the estimator equals the parameter.",
     "估计量的期望等于参数。"
    ],
    [
     "consistency",
     "n.",
     "相合性",
     "The estimator converges as n grows.",
     "n 增大时估计量收敛。"
    ],
    [
     "confidence interval",
     "n.",
     "置信区间",
     "A range with a stated confidence level.",
     "带置信水平的区间。"
    ]
   ],
   "m8": [
    [
     "hypothesis testing",
     "n.",
     "假设检验",
     "Decide between two claims with data.",
     "用数据在两个说法间做判断。"
    ],
    [
     "null hypothesis",
     "n.",
     "原假设",
     "The claim you try to reject.",
     "你试图推翻的那个假设。"
    ],
    [
     "significance level",
     "n.",
     "显著性水平",
     "The allowed probability of a false rejection.",
     "允许错误拒绝的概率。"
    ],
    [
     "Type I error",
     "n.",
     "第一类错误",
     "Rejecting a true null hypothesis.",
     "原假设为真却拒绝。"
    ],
    [
     "p value",
     "n.",
     "p 值",
     "The probability of data this extreme under the null.",
     "原假设下出现这么极端数据的概率。"
    ],
    [
     "rejection region",
     "n.",
     "拒绝域",
     "Where the test statistic leads to rejection.",
     "统计量落入就拒绝的区域。"
    ]
   ]
  },
  "notes": {},
  "chapterNotes": {
   "m0": {
    "pts": [
     "排列讲顺序，组合不讲顺序，公式别混。",
     "分类用加法原理，分步用乘法原理。",
     "这一节是为后面算古典概型做准备的，必须练熟。"
    ],
    "ex": [
     "从 5 人中选 3 人排队，有多少种|A(5,3)=5×4×3=60。",
     "从 5 人中选 3 人组成小组，有多少种|C(5,3)=10。"
    ],
    "code": ""
   },
   "m1": {
    "pts": [
     "概率的三条公理 + 五条性质，是所有计算的出发点。",
     "条件概率引出乘法公式、全概率公式、贝叶斯公式，三者是一条线。",
     "独立性用 P(AB)=P(A)P(B) 判断，不要和互斥混淆。"
    ],
    "ex": [
     "用全概率公式求复杂事件概率|按原因把样本空间划分成互斥的几块，分别乘条件概率再相加。",
     "用贝叶斯公式反推原因概率|先算全概率作分母，再用某原因的条件概率作分子。"
    ],
    "code": ""
   },
   "m2": {
    "pts": [
     "离散型看分布律，连续型看密度，两者都用分布函数统一描述。",
     "五大常见分布要记住期望与方差（背下来能省很多计算）。",
     "随机变量函数的分布：离散型列表，连续型用分布函数法。"
    ],
    "ex": [
     "已知密度求分布函数|对密度从负无穷积分到 x。",
     "求 Y=g(X) 的密度|先求 F_Y(y)=P(g(X)≤y)，再求导。"
    ],
    "code": ""
   },
   "m3": {
    "pts": [
     "二维的核心是「联合、边缘、条件」三者的换算关系。",
     "独立性判定：f(x,y)=f_X(x)f_Y(y)，或离散型逐点相乘。",
     "两个随机变量函数的分布常考 Z=X+Y 与 max/min。"
    ],
    "ex": [
     "由联合分布求边缘分布|离散型按行/列求和，连续型对另一变量积分。",
     "判断 X 与 Y 是否独立|先求边缘，再看联合是否等于边缘之积。"
    ],
    "code": ""
   },
   "m4": {
    "pts": [
     "期望是加权平均，方差是「偏离程度的平方的平均」。",
     "D(aX+b)=a²D(X)，E(aX+b)=aE(X)+b，这两条最常用。",
     "相关系数只衡量线性相关，为 0 不代表独立。"
    ],
    "ex": [
     "由分布求期望与方差|离散型 Σx·p，连续型 ∫x·f(x)dx；方差用 E(X²)-[E(X)]²。",
     "求 Cov(X,Y) 与相关系数|Cov=E(XY)-E(X)E(Y)，ρ=Cov/(σxσy)。"
    ],
    "code": ""
   },
   "m5": {
    "pts": [
     "切比雪夫不等式给出「偏离均值」的概率上界，不要求分布。",
     "大数定律说的是「频率稳定于概率」。",
     "中心极限定理是统计推断的根基：样本均值近似正态。"
    ],
    "ex": [
     "用切比雪夫估计概率下界|P(|X-μ|<ε) ≥ 1 - σ²/ε²。",
     "用中心极限定理近似求和分布|先标准化，再查标准正态表。"
    ],
    "code": ""
   },
   "m6": {
    "pts": [
     "统计量不能含未知参数，这是判断「是不是统计量」的唯一标准。",
     "三大抽样分布：卡方、t、F，各有固定构造方式。",
     "正态总体下的样本均值与样本方差相互独立，这个结论很关键。"
    ],
    "ex": [
     "判断一个量是否为统计量|看它是否含未知参数（如 μ、σ）。",
     "求样本均值的分布|X̄ ~ N(μ, σ²/n)，标准化后查表。"
    ],
    "code": ""
   },
   "m7": {
    "pts": [
     "矩估计「用样本矩替换理论矩」，极大似然「让数据最可能出现」。",
     "评价估计量三标准：无偏、有效、相合。",
     "区间估计的关键是找枢轴量，再反解不等式。"
    ],
    "ex": [
     "求极大似然估计|写似然函数，取对数，求导令零，解出参数。",
     "求均值的置信区间|σ 已知用 u 分布，σ 未知用 t 分布。"
    ],
    "code": ""
   },
   "m8": {
    "pts": [
     "假设检验的本质是「反证法 + 小概率原理」。",
     "两类错误：弃真（第一类，概率为 α）、取伪（第二类）。",
     "p 值小于 α 就拒绝原假设，这是最实用的判据。"
    ],
    "ex": [
     "写出原假设与备择假设|把「想证明的」放备择，把「维持现状」放原假设。",
     "完成一次均值检验|选统计量 → 定拒绝域 → 代入计算 → 下结论。"
    ],
    "code": ""
   }
  }
 }
};
  for (var k in M) C[k] = M[k];
})(window.COURSES);
