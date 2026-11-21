/* 课程术语 + 讲义/练习题补丁 —— 由 tools/gen_course_extras.py 生成，勿手改 */
(function (W) {
  var C = W.COURSES || (W.COURSES = {});
  var X = {
    "discrete": { terms: {
 "d1": [
  [
   "set",
   "n.",
   "集合",
   "A set is a collection of distinct objects.",
   "集合是不同对象的汇集。"
  ],
  [
   "element",
   "n.",
   "元素",
   "3 is an element of the set {1, 2, 3}.",
   "3 是集合 {1, 2, 3} 的元素。"
  ],
  [
   "subset",
   "n.",
   "子集",
   "{1, 2} is a subset of {1, 2, 3}.",
   "{1, 2} 是 {1, 2, 3} 的子集。"
  ],
  [
   "union",
   "n.",
   "并集",
   "The union of A and B contains all elements of either set.",
   "A 与 B 的并集包含两集合的所有元素。"
  ],
  [
   "intersection",
   "n.",
   "交集",
   "The intersection of A and B is {2}.",
   "A 与 B 的交集是 {2}。"
  ],
  [
   "proposition",
   "n.",
   "命题",
   "\"It is raining\" is a proposition with a truth value.",
   "\"下雨了\" 是有真值的命题。"
  ]
 ],
 "d2": [
  [
   "relation",
   "n.",
   "关系",
   "A relation is a subset of a Cartesian product.",
   "关系是卡氏积的一个子集。"
  ],
  [
   "ordered pair",
   "n.",
   "有序对",
   "(a, b) is an ordered pair where order matters.",
   "(a, b) 是有序对，顺序有意义。"
  ],
  [
   "Cartesian product",
   "n.",
   "卡氏积",
   "A×B is the set of all (a,b) with a in A and b in B.",
   "A×B 是所有 (a,b) 组成的集合。"
  ],
  [
   "reflexive",
   "adj.",
   "自反的",
   "A relation is reflexive if every a relates to itself.",
   "若每个 a 都与自身相关，关系就是自反的。"
  ],
  [
   "symmetric",
   "adj.",
   "对称的",
   "If aRb then bRa makes the relation symmetric.",
   "若 aRb 则 bRa，关系就是对称的。"
  ],
  [
   "equivalence relation",
   "n.",
   "等价关系",
   "An equivalence relation is reflexive, symmetric and transitive.",
   "等价关系满足自反、对称、传递。"
  ]
 ],
 "d3": [
  [
   "function",
   "n.",
   "函数",
   "A function maps each element of A to exactly one element of B.",
   "函数把 A 中每个元素映到 B 中唯一元素。"
  ],
  [
   "domain",
   "n.",
   "定义域",
   "The domain is the set of all inputs of a function.",
   "定义域是函数所有输入的集合。"
  ],
  [
   "codomain",
   "n.",
   "陪域",
   "The codomain is the set the outputs are declared to lie in.",
   "陪域是输出被声明所在的集合。"
  ],
  [
   "injective",
   "adj.",
   "单射的",
   "An injective function maps distinct inputs to distinct outputs.",
   "单射把不同输入映到不同输出。"
  ],
  [
   "surjective",
   "adj.",
   "满射的",
   "A surjective function covers every element of the codomain.",
   "满射覆盖陪域的每个元素。"
  ],
  [
   "bijection",
   "n.",
   "双射",
   "A bijection is both injective and surjective.",
   "双射既单射又满射。"
  ]
 ],
 "d4": [
  [
   "natural number",
   "n.",
   "自然数",
   "Natural numbers are 0, 1, 2, 3 and so on.",
   "自然数是 0, 1, 2, 3 等等。"
  ],
  [
   "successor",
   "n.",
   "后继",
   "The successor of n is n+1.",
   "n 的后继是 n+1。"
  ],
  [
   "induction",
   "n.",
   "归纳法",
   "Mathematical induction proves a statement for all natural numbers.",
   "数学归纳法证明命题对所有自然数成立。"
  ],
  [
   "Peano axioms",
   "n.",
   "皮亚诺公理",
   "Peano axioms define the natural numbers from a start and a successor.",
   "皮亚诺公理用起点和后继定义自然数。"
  ],
  [
   "recursion",
   "n.",
   "递归",
   "Factorial is defined by recursion: n! = n·(n-1)!.",
   "阶乘用递归定义：n! = n·(n-1)!。"
  ],
  [
   "well-ordering",
   "n.",
   "良序",
   "Every nonempty set of natural numbers has a least element.",
   "自然数任一非空子集都有最小元。"
  ]
 ],
 "d5": [
  [
   "cardinality",
   "n.",
   "基数",
   "The cardinality of {a,b,c} is 3.",
   "{a,b,c} 的基数是 3。"
  ],
  [
   "finite set",
   "n.",
   "有限集",
   "A finite set has a specific number of elements.",
   "有限集有确定的元素个数。"
  ],
  [
   "infinite set",
   "n.",
   "无限集",
   "The set of natural numbers is an infinite set.",
   "自然数集是无限集。"
  ],
  [
   "countable",
   "adj.",
   "可数的",
   "The rational numbers are countable.",
   "有理数是可数的。"
  ],
  [
   "uncountable",
   "adj.",
   "不可数的",
   "The real numbers are uncountable.",
   "实数集是不可数的。"
  ],
  [
   "ordinal number",
   "n.",
   "序数",
   "Ordinal numbers describe the order type of well-ordered sets.",
   "序数描述良序集的序型。"
  ]
 ],
 "d6": [
  [
   "graph",
   "n.",
   "图",
   "A graph consists of vertices and edges.",
   "图由顶点和边组成。"
  ],
  [
   "vertex",
   "n.",
   "顶点",
   "A vertex is a node of a graph.",
   "顶点是图的结点。"
  ],
  [
   "edge",
   "n.",
   "边",
   "An edge connects two vertices.",
   "边连接两个顶点。"
  ],
  [
   "degree",
   "n.",
   "度",
   "The degree of a vertex is its number of incident edges.",
   "顶点的度是关联边的条数。"
  ],
  [
   "path",
   "n.",
   "通路",
   "A path is a sequence of vertices joined by edges.",
   "通路是边相连的顶点序列。"
  ],
  [
   "connected",
   "adj.",
   "连通的",
   "A graph is connected if every pair of vertices has a path.",
   "任意两顶点间有通路则图连通。"
  ]
 ],
 "d7": [
  [
   "Eulerian graph",
   "n.",
   "欧拉图",
   "An Eulerian graph has a closed trail using every edge once.",
   "欧拉图有经过每条边恰好一次的回路。"
  ],
  [
   "Hamiltonian cycle",
   "n.",
   "哈密顿圈",
   "A Hamiltonian cycle visits every vertex exactly once.",
   "哈密顿圈恰好访问每个顶点一次。"
  ],
  [
   "trail",
   "n.",
   "迹",
   "A trail is a walk with no repeated edges.",
   "迹是不重复边的通路。"
  ],
  [
   "circuit",
   "n.",
   "回路",
   "A circuit is a closed trail.",
   "回路是闭合的迹。"
  ],
  [
   "degree condition",
   "n.",
   "度条件",
   "An undirected graph is Eulerian iff every vertex has even degree.",
   "无向图欧拉的充要条件是各顶点度为偶数。"
  ],
  [
   "NP-complete",
   "adj.",
   "NP完全的",
   "Finding a Hamiltonian cycle is NP-complete.",
   "找哈密顿圈是 NP 完全的。"
  ]
 ],
 "d8": [
  [
   "tree",
   "n.",
   "树",
   "A tree is a connected graph with no cycles.",
   "树是无回路的连通图。"
  ],
  [
   "root",
   "n.",
   "根",
   "A rooted tree has a designated root vertex.",
   "有根树指定一个根顶点。"
  ],
  [
   "leaf",
   "n.",
   "叶",
   "A leaf is a vertex of degree one.",
   "叶是度数为 1 的顶点。"
  ],
  [
   "spanning tree",
   "n.",
   "生成树",
   "A spanning tree includes all vertices of the graph.",
   "生成树包含图的所有顶点。"
  ],
  [
   "subtree",
   "n.",
   "子树",
   "A subtree is a connected subgraph that is itself a tree.",
   "子树是本身为树的连通子图。"
  ],
  [
   "acyclic",
   "adj.",
   "无环的",
   "A tree is acyclic, containing no cycles.",
   "树是无环的，不含任何圈。"
  ]
 ],
 "d9": [
  [
   "adjacency matrix",
   "n.",
   "邻接矩阵",
   "An adjacency matrix records which vertices are adjacent.",
   "邻接矩阵记录哪些顶点相邻。"
  ],
  [
   "incidence matrix",
   "n.",
   "关联矩阵",
   "An incidence matrix records which vertices are incident to edges.",
   "关联矩阵记录顶点与边的关联。"
  ],
  [
   "matrix representation",
   "n.",
   "矩阵表示",
   "Graphs can be represented by matrices for computation.",
   "图可用矩阵表示以便计算。"
  ],
  [
   "symmetric matrix",
   "n.",
   "对称矩阵",
   "The adjacency matrix of an undirected graph is symmetric.",
   "无向图的邻接矩阵是对称的。"
  ],
  [
   "walk count",
   "n.",
   "通路计数",
   "Powers of the adjacency matrix count walks between vertices.",
   "邻接矩阵的幂统计顶点间通路数。"
  ],
  [
   "sparse matrix",
   "n.",
   "稀疏矩阵",
   "Sparse graphs yield sparse adjacency matrices.",
   "稀疏图产生稀疏邻接矩阵。"
  ]
 ],
 "d10": [
  [
   "planar graph",
   "n.",
   "平面图",
   "A planar graph can be drawn without crossing edges.",
   "平面图可画成边不相交。"
  ],
  [
   "face",
   "n.",
   "面",
   "A face is a region bounded by edges in a planar drawing.",
   "面是平面图被边围成的区域。"
  ],
  [
   "Euler formula",
   "n.",
   "欧拉公式",
   "For a connected planar graph, V - E + F = 2.",
   "连通平面图满足 V - E + F = 2。"
  ],
  [
   "dual graph",
   "n.",
   "对偶图",
   "A dual graph has a vertex for each face of the original.",
   "对偶图每个面对应原图一个顶点。"
  ],
  [
   "outerplanar",
   "adj.",
   "外平面的",
   "An outerplanar graph can be drawn with all vertices on the outer face.",
   "外平面图所有顶点都在外面边界上。"
  ],
  [
   "embedding",
   "n.",
   "嵌入",
   "An embedding is a drawing of a graph in the plane.",
   "嵌入是图在平面中的一种画法。"
  ]
 ],
 "d11": [
  [
   "graph coloring",
   "n.",
   "图着色",
   "Graph coloring assigns colors to vertices so adjacent ones differ.",
   "图着色给顶点染色使相邻顶点异色。"
  ],
  [
   "chromatic number",
   "n.",
   "色数",
   "The chromatic number is the fewest colors needed to color a graph.",
   "色数是正常着色所需最少颜色数。"
  ],
  [
   "proper coloring",
   "n.",
   "正常着色",
   "A proper coloring gives adjacent vertices different colors.",
   "正常着色使相邻顶点颜色不同。"
  ],
  [
   "chromatic polynomial",
   "n.",
   "色多项式",
   "The chromatic polynomial counts proper colorings with k colors.",
   "色多项式统计用 k 色的正常着色数。"
  ],
  [
   "edge coloring",
   "n.",
   "边着色",
   "Edge coloring assigns colors to edges so adjacent edges differ.",
   "边着色给边染色使相邻边异色。"
  ],
  [
   "bipartite",
   "adj.",
   "二分的",
   "A bipartite graph is 2-colorable.",
   "二部图可用两色着色。"
  ]
 ],
 "d12": [
  [
   "dominating set",
   "n.",
   "支配集",
   "A dominating set reaches every vertex outside it by an edge.",
   "支配集使集外每个顶点都与集内相邻。"
  ],
  [
   "vertex cover",
   "n.",
   "点覆盖",
   "A vertex cover touches every edge of the graph.",
   "点覆盖覆盖图的每条边。"
  ],
  [
   "independent set",
   "n.",
   "独立集",
   "An independent set has no edges among its vertices.",
   "独立集内顶点之间无边。"
  ],
  [
   "matching",
   "n.",
   "匹配",
   "A matching is a set of edges with no shared vertices.",
   "匹配是互不共端点的边集。"
  ],
  [
   "bipartite matching",
   "n.",
   "二部匹配",
   "Bipartite matching pairs vertices across two parts.",
   "二部匹配在两部分之间配对。"
  ],
  [
   "maximum matching",
   "n.",
   "最大匹配",
   "A maximum matching has the largest possible number of edges.",
   "最大匹配含边数最多。"
  ]
 ],
 "d13": [
  [
   "Chinese postman",
   "n.",
   "中国邮递员问题",
   "The Chinese postman finds a shortest route covering every edge.",
   "中国邮递员问题求覆盖每条边的最短路线。"
  ],
  [
   "traveling salesman",
   "n.",
   "货郎担问题",
   "TSP finds the shortest tour visiting every city once.",
   "货郎担问题求访问每城一次的最短回路。"
  ],
  [
   "route optimization",
   "n.",
   "路线优化",
   "Route optimization minimizes cost of traversal.",
   "路线优化最小化遍历代价。"
  ],
  [
   "weight",
   "n.",
   "权",
   "A weight assigns a cost to each edge.",
   "权给每条边赋予代价。"
  ],
  [
   "optimal tour",
   "n.",
   "最优回路",
   "An optimal tour has minimal total weight.",
   "最优回路总权最小。"
  ],
  [
   "heuristic",
   "n.",
   "启发式",
   "A heuristic finds good solutions without guaranteeing optimal.",
   "启发式求较好解但不保证最优。"
  ]
 ],
 "d14": [
  [
   "algebraic structure",
   "n.",
   "代数结构",
   "A group is an algebraic structure with one operation.",
   "群是带一个运算的代数结构。"
  ],
  [
   "binary operation",
   "n.",
   "二元运算",
   "Addition is a binary operation on integers.",
   "加法是整数上的二元运算。"
  ],
  [
   "closure",
   "n.",
   "封闭性",
   "Closure means the operation keeps results inside the set.",
   "封闭性指运算结果仍在集合内。"
  ],
  [
   "associativity",
   "n.",
   "结合律",
   "(a·b)·c = a·(b·c) is associativity.",
   "(a·b)·c = a·(b·c) 是结合律。"
  ],
  [
   "homomorphism",
   "n.",
   "同态",
   "A homomorphism preserves the algebraic operation.",
   "同态保持代数运算。"
  ],
  [
   "isomorphism",
   "n.",
   "同构",
   "An isomorphism is a bijective homomorphism.",
   "同构是双射的同态。"
  ]
 ],
 "d15": [
  [
   "semigroup",
   "n.",
   "半群",
   "A semigroup is an associative binary system.",
   "半群是满足结合律的二元系统。"
  ],
  [
   "monoid",
   "n.",
   "独异点",
   "A monoid is a semigroup with an identity element.",
   "独异点是带单位元的半群。"
  ],
  [
   "identity element",
   "n.",
   "单位元",
   "0 is the identity for addition.",
   "0 是加法的单位元。"
  ],
  [
   "idempotent",
   "adj.",
   "幂等的",
   "An idempotent satisfies a·a = a.",
   "幂等满足 a·a = a。"
  ],
  [
   "subsemigroup",
   "n.",
   "子半群",
   "A subsemigroup is a subset closed under the operation.",
   "子半群是对运算封闭的子集。"
  ],
  [
   "direct product",
   "n.",
   "直积",
   "The direct product combines two algebraic structures componentwise.",
   "直积按分量组合两个代数结构。"
  ]
 ],
 "d16": [
  [
   "group",
   "n.",
   "群",
   "A group has closure, associativity, identity and inverses.",
   "群满足封闭、结合、有单位元、有逆元。"
  ],
  [
   "subgroup",
   "n.",
   "子群",
   "A subgroup is a group contained in a larger group.",
   "子群是包含在大群中的群。"
  ],
  [
   "cyclic group",
   "n.",
   "循环群",
   "A cyclic group is generated by a single element.",
   "循环群由单个元素生成。"
  ],
  [
   "permutation group",
   "n.",
   "置换群",
   "A permutation group consists of permutations of a set.",
   "置换群由集合的置换组成。"
  ],
  [
   "normal subgroup",
   "n.",
   "正规子群",
   "A normal subgroup allows formation of a quotient group.",
   "正规子群可用来构造商群。"
  ],
  [
   "quotient group",
   "n.",
   "商群",
   "A quotient group is formed by collapsing a normal subgroup.",
   "商群由正规子群模掉得到。"
  ]
 ],
 "d17": [
  [
   "ring",
   "n.",
   "环",
   "A ring has addition and multiplication with distributivity.",
   "环有加法和乘法并满足分配律。"
  ],
  [
   "subring",
   "n.",
   "子环",
   "A subring is a subset that is itself a ring.",
   "子环是本身成环的子集。"
  ],
  [
   "ideal",
   "n.",
   "理想",
   "An ideal absorbs multiplication by ring elements.",
   "理想对环元素乘法有吸收性。"
  ],
  [
   "quotient ring",
   "n.",
   "商环",
   "A quotient ring is built by factoring out an ideal.",
   "商环由理想模掉构造。"
  ],
  [
   "ring homomorphism",
   "n.",
   "环同态",
   "A ring homomorphism preserves both operations.",
   "环同态保持两个运算。"
  ],
  [
   "commutative ring",
   "n.",
   "交换环",
   "A commutative ring has commutative multiplication.",
   "交换环的乘法可交换。"
  ]
 ],
 "d18": [
  [
   "lattice",
   "n.",
   "格",
   "A lattice is a partially ordered set with joins and meets.",
   "格是任意两元素都有并和交的偏序集。"
  ],
  [
   "join",
   "n.",
   "并",
   "The join is the least upper bound of two elements.",
   "并是两元素的最小上界。"
  ],
  [
   "meet",
   "n.",
   "交",
   "The meet is the greatest lower bound of two elements.",
   "交是两元素的最大下界。"
  ],
  [
   "sublattice",
   "n.",
   "子格",
   "A sublattice is closed under join and meet.",
   "子格对并和交封闭。"
  ],
  [
   "complemented lattice",
   "n.",
   "有补格",
   "A complemented lattice gives each element a complement.",
   "有补格给每个元素配补元。"
  ],
  [
   "Boolean algebra",
   "n.",
   "布尔代数",
   "A Boolean algebra is a complemented distributive lattice.",
   "布尔代数是带补的分配格。"
  ]
 ],
 "d19": [
  [
   "pigeonhole principle",
   "n.",
   "鸽巢原理",
   "More pigeons than holes force a hole with two pigeons.",
   "鸽多于巢必有一巢住两鸽。"
  ],
  [
   "Ramsey theorem",
   "n.",
   "Ramsey 定理",
   "Ramsey theorem guarantees order in large enough structures.",
   "Ramsey 定理保证足够大的结构中必有秩序。"
  ],
  [
   "combinatorics",
   "n.",
   "组合数学",
   "Combinatorics studies counting and arrangement.",
   "组合数学研究计数与安排。"
  ],
  [
   "existence proof",
   "n.",
   "存在性证明",
   "An existence proof shows something must exist without constructing it.",
   "存在性证明说明某物必存在但不必构造。"
  ],
  [
   "generalized principle",
   "n.",
   "推广原理",
   "Generalized pigeonhole uses weighted containers.",
   "推广鸽巢原理用带权容器。"
  ],
  [
   "finite structure",
   "n.",
   "有限结构",
   "Finite structures are central to combinatorics.",
   "有限结构是组合数学的核心对象。"
  ]
 ],
 "d20": [
  [
   "permutation",
   "n.",
   "排列",
   "A permutation is an ordered arrangement of objects.",
   "排列是对象按顺序的安排。"
  ],
  [
   "combination",
   "n.",
   "组合",
   "A combination is an unordered selection of objects.",
   "组合是不计顺序的选取。"
  ],
  [
   "binomial coefficient",
   "n.",
   "二项式系数",
   "C(n,k) counts k-subsets of an n-set.",
   "C(n,k) 数 n 元集的 k 元子集。"
  ],
  [
   "binomial theorem",
   "n.",
   "二项式定理",
   "(a+b)^n expands via binomial coefficients.",
   "(a+b)^n 用二项式系数展开。"
  ],
  [
   "multiplication principle",
   "n.",
   "乘法原理",
   "Independent choices multiply: m×n ways.",
   "独立选择相乘：m×n 种。"
  ],
  [
   "multinomial theorem",
   "n.",
   "多项式定理",
   "The multinomial theorem generalizes the binomial theorem.",
   "多项式定理推广二项式定理。"
  ]
 ],
 "d21": [
  [
   "recurrence relation",
   "n.",
   "递推方程",
   "Fibonacci is defined by a recurrence relation.",
   "斐波那契数列用递推方程定义。"
  ],
  [
   "generating function",
   "n.",
   "生成函数",
   "A generating function encodes a sequence as coefficients.",
   "生成函数把数列编码为系数。"
  ],
  [
   "characteristic equation",
   "n.",
   "特征方程",
   "Linear recurrences are solved via a characteristic equation.",
   "线性递推用特征方程求解。"
  ],
  [
   "Catalan number",
   "n.",
   "Catalan 数",
   "Catalan numbers count balanced parentheses.",
   "Catalan 数统计合法括号序列。"
  ],
  [
   "Stirling number",
   "n.",
   "Stirling 数",
   "Stirling numbers count partitions into subsets.",
   "Stirling 数统计集合划分。"
  ],
  [
   "closed form",
   "n.",
   "闭式",
   "A closed form gives a term directly, without recursion.",
   "闭式直接给出通项，无需递推。"
  ]
 ],
 "d22": [
  [
   "inclusion-exclusion",
   "n.",
   "容斥原理",
   "Inclusion-exclusion corrects overcounting of overlaps.",
   "容斥原理修正重叠导致的重复计数。"
  ],
  [
   "derangement",
   "n.",
   "错排",
   "A derangement permutes so no element stays in place.",
   "错排是没有元素在原位的排列。"
  ],
  [
   "sieve formula",
   "n.",
   "筛公式",
   "The sieve formula alternates signs to count unions.",
   "筛公式用交替符号计数并集。"
  ],
  [
   "Burnside lemma",
   "n.",
   "Burnside 引理",
   "Burnside lemma averages fixed points over a group.",
   "Burnside 引理对群上不动点取平均。"
  ],
  [
   "Polya theorem",
   "n.",
   "Polya 定理",
   "Polya theorem counts colorings up to symmetry.",
   "Polya 定理统计对称意义下的染色数。"
  ],
  [
   "symmetry",
   "n.",
   "对称性",
   "Symmetry means invariance under a group action.",
   "对称性指在某群作用下不变。"
  ]
 ],
 "d23": [
  [
   "propositional logic",
   "n.",
   "命题逻辑",
   "Propositional logic studies compound propositions.",
   "命题逻辑研究复合命题。"
  ],
  [
   "logical connective",
   "n.",
   "逻辑联结词",
   "AND, OR, NOT are logical connectives.",
   "与、或、非是逻辑联结词。"
  ],
  [
   "truth table",
   "n.",
   "真值表",
   "A truth table lists all truth-value combinations.",
   "真值表列出所有真值组合。"
  ],
  [
   "tautology",
   "n.",
   "永真式",
   "A tautology is always true regardless of values.",
   "永真式恒为真，与取值无关。"
  ],
  [
   "normal form",
   "n.",
   "范式",
   "A normal form is a standardized logical formula.",
   "范式是标准化的逻辑公式。"
  ],
  [
   "soundness",
   "n.",
   "可靠性",
   "Soundness means provable statements are true.",
   "可靠性指可证的命题都是真的。"
  ]
 ],
 "d24": [
  [
   "predicate logic",
   "n.",
   "谓词逻辑",
   "Predicate logic adds quantifiers to propositions.",
   "谓词逻辑在命题上加了量词。"
  ],
  [
   "quantifier",
   "n.",
   "量词",
   "Universal and existential are the two quantifiers.",
   "全称与存在是两种量词。"
  ],
  [
   "universal quantifier",
   "n.",
   "全称量词",
   "∀x means \"for all x\".",
   "∀x 表示\"对所有 x\"。"
  ],
  [
   "existential quantifier",
   "n.",
   "存在量词",
   "∃x means \"there exists an x\".",
   "∃x 表示\"存在某个 x\"。"
  ],
  [
   "interpretation",
   "n.",
   "解释",
   "An interpretation assigns meanings to symbols.",
   "解释为符号赋予含义。"
  ],
  [
   "formal system",
   "n.",
   "形式系统",
   "A formal system has axioms and inference rules.",
   "形式系统含公理和推理规则。"
  ]
 ]
}, chapterNotes: {
 "d1": {
  "pts": [
   "集合是离散数学最基础的对象：元素、子集、空集、幂集层层往上搭。",
   "集合运算（并交补差）对应逻辑联结词（或且非），两者是同一套代数结构。",
   "命题逻辑是全书的语言基础，先掌握真值与联结词，后面所有证明都靠它。"
  ],
  "ex": [
   "A={1,2}，B={2,3}，求 A∪B 与 A∩B|A∪B={1,2,3}（并在两集合中所有元素），A∩B={2}（交是公共元素）。",
   "空集是不是任何集合的子集？|是。空集没有元素，\"空集元素都属于 A\" 这一条件自动成立（空真）。"
  ],
  "code": ""
 },
 "d2": {
  "pts": [
   "关系就是卡氏积的子集：二元关系描述两个集合元素之间\"是否相关\"。",
   "五大性质要分清：自反、反自反、对称、反对称、传递，判断时逐一验定义。",
   "等价关系把集合划分成等价类（划分）；偏序关系给出序结构，是后续格论的地基。"
  ],
  "ex": [
   "相等关系为什么是等价关系？|它自反(a=a)、对称(a=b则b=a)、传递(a=b且b=c则a=c)，三条都满足。",
   "\"≤\" 关系对称吗？|不。a≤b 不能推出 b≤a（除非 a=b），它是自反、反对称、传递的偏序。"
  ],
  "code": ""
 },
 "d3": {
  "pts": [
   "函数是特殊关系：定义域每个元素恰好对应一个像，允许多对一，不允许一对多。",
   "单射看\"不同输入不同输出\"，满射看\"陪域被覆盖全\"，双射两者兼具。",
   "复合函数按右到左顺序做；只有双射才有逆函数。"
  ],
  "ex": [
   "f(x)=x² 在实数集上是单射吗？|不是，因为 f(2)=f(-2)=4，不同输入得到相同输出。",
   "双射一定有反函数吗？|一定。双射是一一对应，把每个像唯一映回原像即得反函数。"
  ],
  "code": ""
 },
 "d4": {
  "pts": [
   "自然数用皮亚诺公理严格定义：从 0 出发，靠后继函数不断生成。",
   "数学归纳法与良序原理等价，是证明\"对所有自然数成立\"的核心工具。",
   "递归定义要给出基础情形和递归步骤，二者缺一不可。"
  ],
  "ex": [
   "归纳证明的两步是什么？|基础步：验证 n 取初值时命题成立；归纳步：假设 n 成立，推出 n+1 也成立。",
   "为什么自然数集是良序的？|任一非空子集都有最小元，这是皮亚诺公理（归纳公理）的等价表述。"
  ],
  "code": ""
 },
 "d5": {
  "pts": [
   "基数刻画\"有多少\"，序数刻画\"排第几\"：前者管大小，后者管顺序。",
   "两个集合等势（基数相同）当且仅当存在双射；这是比较无穷的尺子。",
   "有理数可数、实数不可数（对角线法），说明无穷也分大小。"
  ],
  "ex": [
   "怎么判断两个集合基数相同？|看能否建立一一对应（双射）。能建立则等势、基数相同。",
   "康托尔对角线法说明了什么？|实数集不可数，其基数严格大于自然数集，即无穷有不同层次。"
  ],
  "code": ""
 },
 "d6": {
  "pts": [
   "图 = 顶点集 + 边集，分无向图和有向图；度数、通路、回路、连通是最基本概念。",
   " handshake 定理：所有顶点度数之和 = 边数的两倍。",
   "连通性看\"能否到达\"，连通度看\"要删多少点/边才断开\"，后者更刻画鲁棒性。"
  ],
  "ex": [
   "图有 10 条边，所有顶点度数之和是多少？|20。由握手定理，度数和 = 2×边数 = 2×10 = 20。",
   "什么是连通图？|任意两个顶点之间都存在一条通路，即整个图是一个连通分支。"
  ],
  "code": ""
 },
 "d7": {
  "pts": [
   "欧拉图看边：无向图各顶点度为偶数且连通，就有欧拉回路（一笔画）。",
   "哈密顿图看点：要恰好过每个顶点一次，判定是 NP 完全，没有简单充要条件。",
   "欧拉与哈密顿名字相似但对象不同：一个管边、一个管点，别混。"
  ],
  "ex": [
   "无向图存在欧拉回路的充要条件？|图连通，且每个顶点的度都是偶数。",
   "欧拉回路与哈密顿圈的区别？|欧拉回路每边走一次（可重点），哈密顿圈每点访一次（可不走全边）。"
  ],
  "code": ""
 },
 "d8": {
  "pts": [
   "树 = 连通 + 无回路；n 个顶点的树恰有 n-1 条边。",
   "树中任意两点间路径唯一，这是\"无环连通\"的等价刻画。",
   "生成树保留全部顶点但去掉多余边，是最小连通子图，用于网络与算法。"
  ],
  "ex": [
   "10 个顶点的树有多少条边？|9 条。树的边数恒为顶点数减一：n-1=9。",
   "为什么树中两点间路径唯一？|若有两条不同路径，首尾相接就构成回路，与树无环矛盾。"
  ],
  "code": ""
 },
 "d9": {
  "pts": [
   "邻接矩阵 A[i][j]=1 表示 i、j 相邻；无向图对称，有向图不一定。",
   "A 的 k 次幂的元素 (i,j) 等于 i 到 j 长度为 k 的通路条数。",
   "关联矩阵按\"点×边\"记录关联，适合处理边相关的性质。"
  ],
  "ex": [
   "无向图邻接矩阵为什么对称？|因为边无方向：i 与 j 相邻等价于 j 与 i 相邻，故 A[i][j]=A[j][i]。",
   "A² 的 (i,j) 元素表示什么？|表示从顶点 i 到顶点 j 长度为 2 的通路条数。"
  ],
  "code": ""
 },
 "d10": {
  "pts": [
   "平面图能画成边不相交；欧拉公式 V-E+F=2 是判平面性的基本工具。",
   "欧拉公式可推出平面图边数上界 E≤3V-6（V≥3），用于证明非平面性。",
   "对偶图把\"面\"变\"点\"，平面图与其对偶图性质互相对应。"
  ],
  "ex": [
   "连通平面图 V=6、E=10，面数 F 是多少？|由 V-E+F=2 得 F=2-V+E=2-6+10=6。",
   "如何用欧拉公式证明 K5 非平面？|K5 有 V=5、E=10，若平面则 E≤3V-6=9，但 10>9，矛盾，故非平面。"
  ],
  "code": ""
 },
 "d11": {
  "pts": [
   "点着色要求相邻顶点异色，色数是所需最少颜色数；二部图色数为 2。",
   "四色定理：任何平面图色数不超过 4，是图论著名结果。",
   "边着色看相邻边异色；与点着色是对偶视角，常转成线图研究。"
  ],
  "ex": [
   "二部图的色数是多少？|2（非平凡时）。二部图顶点可分两组，边只跨组，两组各染一色即可。",
   "什么是色数？|对图正常着色（相邻异色）所需的最少颜色数，记作 χ(G)。"
  ],
  "code": ""
 },
 "d12": {
  "pts": [
   "支配集、点覆盖、独立集、匹配是一组\"选点/选边\"的优化概念，彼此有对偶关系。",
   "独立集与点覆盖互补：S 是独立集当且仅当 V-S 是点覆盖。",
   "二部图最大匹配可用匈牙利算法求，是经典算法题。"
  ],
  "ex": [
   "独立集与点覆盖有什么关系？|互补：S 是独立集 ⟺ V−S 是点覆盖。",
   "什么是匹配？|一组两两不共端点的边，即图中任意两条匹配边都不共享顶点。"
  ],
  "code": ""
 },
 "d13": {
  "pts": [
   "中国邮递员问题求覆盖所有边的最短回路（管边）；货郎担求访问所有点的最短回路（管点）。",
   "两者都是经典优化问题：前者有多项式算法，后者是 NP 难，常用近似/启发式。",
   "给边赋权后，问题从\"存在性\"变成\"最优性\"，这是图论走向算法的关键一步。"
  ],
  "ex": [
   "邮递员问题与货郎担问题的核心区别？|前者必须走遍每条边（可重复点），后者恰好访问每个点一次（边不必全走）。",
   "为什么货郎担问题要启发式？|它是 NP 难问题，大规模实例无法在多项式时间内求精确最优解。"
  ],
  "code": ""
 },
 "d14": {
  "pts": [
   "代数结构 = 集合 + 满足公理的运算；从广群到半群、独异点、群，层层加约束。",
   "同态是保运算的映射，同构是一一对应的同态，表示两个结构\"本质相同\"。",
   "商代数由同余关系划分得到，是后续商群、商环的统一范式。"
  ],
  "ex": [
   "同态与同构的区别？|同态只要求保持运算；同构是双射的同态，还要求一一对应，结构完全相同。",
   "什么叫运算封闭？|集合 S 上运算 * 对任意 a,b∈S 都有 a*b∈S，结果不跑到集合外。"
  ],
  "code": ""
 },
 "d15": {
  "pts": [
   "半群只要结合律；独异点再加单位元；群再加逆元——记住这条\"升级链\"。",
   "单位元若存在必唯一；逆元相对单位元定义。",
   "子半群判定只看两点：非空 + 对运算封闭。"
  ],
  "ex": [
   "半群和独异点差在哪？|独异点比半群多一个单位元；半群只需满足结合律。",
   "整数加法独异点的单位元是什么？|0。因为对任意整数 a 都有 a+0=0+a=a。"
  ],
  "code": ""
 },
 "d16": {
  "pts": [
   "群 = 半群 + 单位元 + 每个元素有逆元；验证四条件缺一不可。",
   "子群判定用\"一步法\"：非空子集 H，对任意 a,b∈H 有 a·b⁻¹∈H。",
   "正规子群是构造商群的前提；循环群结构最简单，由生成元的阶完全决定。"
  ],
  "ex": [
   "验证子群的一步判定法是什么？|H 非空，且对任意 a,b∈H 都有 a·b⁻¹∈H，则 H 是子群。",
   "为何正规子群才能做商群？|只有正规子群的陪集乘法定义良好（不依赖代表元选择），才能成群。"
  ],
  "code": ""
 },
 "d17": {
  "pts": [
   "环比群多一个乘法，加法成阿贝尔群、乘法成半群，再由分配律连接。",
   "理想是构造商环的关键：它像\"正规子群\"之于群，保证陪集运算良定义。",
   "整数模 n 的剩余类环 Z_n 是最典型的商环例子。"
  ],
  "ex": [
   "理想与普通子环的关键区别？|理想满足吸收性：对任意 r∈R、a∈I，ra 与 ar 都在 I 中；子环不要求。",
   "Z_n 是什么结构？|整数模 n 的剩余类构成的交换环，是理想 nZ 决定的商环 Z/nZ。"
  ],
  "code": ""
 },
 "d18": {
  "pts": [
   "格用偏序定义：任意两元素都有最小上界（并）和最大下界（交）。",
   "分配律与有补性叠加得到布尔代数，它正是命题逻辑和集合运算的代数抽象。",
   "布尔代数在电路设计、逻辑化简中有直接应用。"
  ],
  "ex": [
   "格中\"并\"和\"交\"分别指什么？|并是两元素的最小上界（join），交是最大下界（meet）。",
   "布尔代数等价于什么格？|有补的分配格（有界、分配、每个元素有补元）。"
  ],
  "code": ""
 },
 "d19": {
  "pts": [
   "鸽巢原理（抽屉原理）是最简单也最有力的计数工具：n+1 个物体放 n 个抽屉必有一个≥2。",
   "Ramsey 定理是鸽巢原理的高阶推广：足够大的结构必然出现某种有序子结构。",
   "组合数学重在\"存在性\"与\"计数\"，这两个主题贯穿后几章。"
  ],
  "ex": [
   "鸽巢原理如何表述？|把 n+1 个物体放进 n 个抽屉，至少有一个抽屉含两个或以上物体。",
   "Ramsey 定理直观上说什么？|完全无序是不可能的——只要结构足够大，必然出现指定的有序子结构。"
  ],
  "code": ""
 },
 "d20": {
  "pts": [
   "排列计顺序 P(n,k)=n!/(n-k)!，组合不计顺序 C(n,k)=n!/(k!(n-k)!)。",
   "加法原理（分类）与乘法原理（分步）是所有计数的地基。",
   "二项式定理把代数展开与组合计数连接起来，系数就是组合数。"
  ],
  "ex": [
   "从 5 人中选 3 人组队有几种？|C(5,3)=10 种。组合不计顺序。",
   "排列与组合的区别？|排列计顺序（选出的元素有先后），组合不计顺序（只看选了哪些）。"
  ],
  "code": ""
 },
 "d21": {
  "pts": [
   "递推方程描述\"第 n 项与前几项的关系\"；解法有公式法（特征方程）与生成函数法。",
   "生成函数把数列问题转成幂级数的代数运算，是组合计数的核心工具。",
   "Catalan 数和 Stirling 数是最常见的两类组合数，出现于括号、树、划分等计数。"
  ],
  "ex": [
   "求解线性齐次递推常用什么方法？|特征方程法：写出特征方程，求根，按根的形式写出通解，再用初定常数。",
   "生成函数法的思想是什么？|把数列 {a_n} 编码成级数 A(x)=Σa_n x^n，通过代数运算求系数得通项。"
  ],
  "code": ""
 },
 "d22": {
  "pts": [
   "容斥原理处理\"重叠计数\"：并集大小 = 各集之和 − 两两交 + 三重交 − …",
   "错排是容斥的经典应用；棋盘多项式把容斥推广到禁位排列。",
   "Burnside 引理与 Polya 定理解决\"考虑对称时有多少种不同方案\"，是群论在计数中的应用。"
  ],
  "ex": [
   "容斥原理用来解决什么问题？|多个集合有重叠时求并集大小：加单个、减两两交、加三重交，交替进行。",
   "Polya 定理解决什么计数问题？|在对称群作用下，把本质相同的方案视为一种，统计不同的染色/配置数。"
  ],
  "code": ""
 },
 "d23": {
  "pts": [
   "命题逻辑用联结词把简单命题组成复合命题，真值表是判定基本工具。",
   "永真式（重言式）恒真、矛盾式恒假、可满足式介于两者之间。",
   "可靠性与完备性是逻辑系统的两大元性质：证出的都真（可靠），真的都能证（完备）。"
  ],
  "ex": [
   "什么是永真式？|在任何变量赋值下都为真的命题公式，如 p∨¬p。",
   "简述可靠性与完备性。|可靠性：系统能证的公式都是永真的；完备性：所有永真公式都能在系统内证明。"
  ],
  "code": ""
 },
 "d24": {
  "pts": [
   "谓词逻辑引入量词和谓词，表达能力远超命题逻辑：能说\"所有人都会死\"。",
   "全称量词 ∀ 与存在量词 ∃ 的否定互换：¬∀x P = ∃x ¬P。",
   "一阶谓词演算的形式系统（NL/KL）有可靠性与完备性，是数理逻辑的高峰。"
  ],
  "ex": [
   "¬(∀x P(x)) 等价于什么？|∃x ¬P(x)。全称命题的否定是存在一个反例。",
   "全称量词与存在量词的含义？|∀x 表示对所有 x 都成立；∃x 表示至少存在一个 x 成立。"
  ],
  "code": ""
 }
} },
    "git": { terms: {
 "t1": [
  [
   "version control",
   "n.",
   "版本控制",
   "Version control tracks changes to files over time.",
   "版本控制记录文件随时间的变化。"
  ],
  [
   "repository",
   "n.",
   "仓库",
   "A repository stores your project and its history.",
   "仓库存放项目及其历史。"
  ],
  [
   "Git",
   "n.",
   "Git",
   "Git is a distributed version control system.",
   "Git 是分布式版本控制系统。"
  ],
  [
   "commit",
   "n.",
   "提交",
   "A commit saves a snapshot of your changes.",
   "一次提交保存你改动的快照。"
  ],
  [
   "working directory",
   "n.",
   "工作区",
   "The working directory holds your current files.",
   "工作区放着你当前的文件。"
  ],
  [
   "snapshot",
   "n.",
   "快照",
   "Git stores commits as snapshots, not diffs.",
   "Git 把提交存成快照而非差异。"
  ]
 ],
 "t2": [
  [
   "git add",
   "n.",
   "git add",
   "git add stages your changes for commit.",
   "git add 把改动放入暂存区。"
  ],
  [
   "git commit",
   "n.",
   "git commit",
   "git commit records the staged changes.",
   "git commit 记录暂存的改动。"
  ],
  [
   "staging area",
   "n.",
   "暂存区",
   "The staging area holds changes before a commit.",
   "暂存区在提交前暂存改动。"
  ],
  [
   "git log",
   "n.",
   "git log",
   "git log shows the commit history.",
   "git log 显示提交历史。"
  ],
  [
   "git reset",
   "n.",
   "git reset",
   "git reset moves the current branch pointer.",
   "git reset 移动当前分支指针。"
  ],
  [
   "checksum",
   "n.",
   "校验和",
   "Git identifies commits by SHA-1 checksums.",
   "Git 用 SHA-1 校验和标识提交。"
  ]
 ],
 "t3": [
  [
   "remote",
   "n.",
   "远程仓库",
   "A remote is a repository hosted elsewhere.",
   "远程仓库是托管在别处的仓库。"
  ],
  [
   "clone",
   "n.",
   "克隆",
   "git clone copies a remote repository locally.",
   "git clone 把远程仓库复制到本地。"
  ],
  [
   "push",
   "n.",
   "推送",
   "git push uploads commits to a remote.",
   "git push 把提交上传到远程。"
  ],
  [
   "pull",
   "n.",
   "拉取",
   "git pull fetches and merges remote changes.",
   "git pull 拉取并合并远程改动。"
  ],
  [
   "branch",
   "n.",
   "分支",
   "A branch is an independent line of development.",
   "分支是独立的开发线。"
  ],
  [
   "merge conflict",
   "n.",
   "合并冲突",
   "A merge conflict occurs when changes overlap.",
   "改动重叠时产生合并冲突。"
  ]
 ],
 "t4": [
  [
   "GitLab",
   "n.",
   "GitLab",
   "GitLab is a platform for Git repositories and CI/CD.",
   "GitLab 是带 CI/CD 的 Git 仓库平台。"
  ],
  [
   "group",
   "n.",
   "群组",
   "A GitLab group organizes related projects.",
   "GitLab 群组组织相关项目。"
  ],
  [
   "permission",
   "n.",
   "权限",
   "Permissions control who can read or write.",
   "权限控制谁能读或写。"
  ],
  [
   "merge request",
   "n.",
   "合并请求",
   "A merge request proposes integrating a branch.",
   "合并请求提议合并某分支。"
  ],
  [
   "issue",
   "n.",
   "议题",
   "An issue tracks a task or bug.",
   "议题跟踪任务或缺陷。"
  ],
  [
   "code review",
   "n.",
   "代码评审",
   "Code review examines changes before merging.",
   "代码评审在合并前检查改动。"
  ]
 ],
 "t5": [
  [
   "workflow",
   "n.",
   "工作流",
   "A workflow defines how branches and merges are used.",
   "工作流定义分支与合并的使用方式。"
  ],
  [
   "feature branch",
   "n.",
   "功能分支",
   "Develop each feature on its own branch.",
   "每个功能在自己的分支开发。"
  ],
  [
   "conflict resolution",
   "n.",
   "冲突解决",
   "Conflict resolution reconciles competing changes.",
   "冲突解决调和相互竞争的改动。"
  ],
  [
   "code review",
   "n.",
   "代码评审",
   "Reviewers check code before it is merged.",
   "评审者在合并前检查代码。"
  ],
  [
   "rebase",
   "n.",
   "变基",
   "git rebase rewrites commits on a new base.",
   "git rebase 在新基底上重写提交。"
  ],
  [
   "tag",
   "n.",
   "标签",
   "A tag marks a specific release commit.",
   "标签标记某个发布提交。"
  ]
 ],
 "t6": [
  [
   "CI/CD",
   "n.",
   "持续集成/部署",
   "CI/CD automates building, testing and deploying.",
   "CI/CD 自动化构建、测试和部署。"
  ],
  [
   "pipeline",
   "n.",
   "流水线",
   "A pipeline defines automated build stages.",
   "流水线定义自动化的构建阶段。"
  ],
  [
   "runner",
   "n.",
   "执行器",
   "A runner executes CI/CD jobs.",
   "执行器运行 CI/CD 任务。"
  ],
  [
   "deployment",
   "n.",
   "部署",
   "Deployment publishes the app to a server.",
   "部署把应用发布到服务器。"
  ],
  [
   "artifact",
   "n.",
   "构建产物",
   "An artifact is a built output like a jar file.",
   "构建产物是 jar 包等输出。"
  ],
  [
   "security scan",
   "n.",
   "安全扫描",
   "A security scan checks code for vulnerabilities.",
   "安全扫描检查代码漏洞。"
  ]
 ]
}, chapterNotes: {
 "t1": {
  "pts": [
   "版本控制解决三件事：记录历史、多人协作、出错回退；没有它改代码全靠复制文件夹。",
   "Git 是分布式的：每人本地都有完整仓库，离线也能提交，和 SVN 的集中式不同。",
   "核心工作区概念：工作区 → 暂存区 → 本地仓库，add 进暂存、commit 进仓库。"
  ],
  "ex": [
   "Git 与 SVN 最大的区别？|Git 分布式，每人有完整仓库可离线提交；SVN 集中式，必须连中央服务器。",
   "commit 的作用是什么？|把暂存区的改动记录成一个快照存入仓库历史，附带作者、时间和说明。"
  ],
  "code": ""
 },
 "t2": {
  "pts": [
   "标准流程：改文件 → git add → git commit；add 可反复，commit 一次性打包。",
   "git log 看历史，每条提交有唯一哈希；HEAD 指向当前所在的提交。",
   "git reset 三种模式 --soft/--mixed/--hard 区别在是否动暂存区和工作区，--hard 最危险。"
  ],
  "ex": [
   "git add 和 git commit 的区别？|add 把改动放进暂存区（可多次），commit 把暂存区内容一次性存成一个历史提交。",
   "git reset --hard 危险在哪？|它会同时重置 HEAD、暂存区和工作区，未提交的改动全部丢失且无法恢复。"
  ],
  "code": ""
 },
 "t3": {
  "pts": [
   "remote 是远程仓库；clone 下载、push 上传、pull 拉取+合并，是协作三件套。",
   "分支让每人各干各的互不干扰，完成后再合并回主干。",
   "冲突不是错误：Git 标出 <<<<<<< 区域，人工选留内容再 add/commit 即可解决。"
  ],
  "ex": [
   "push 和 pull 分别做什么？|push 把本地提交推到远程；pull 从远程拉取提交并合并到当前分支。",
   "遇到合并冲突怎么办？|打开冲突文件，手动选择保留内容、删掉冲突标记，再 git add 和 git commit 完成合并。"
  ],
  "code": ""
 },
 "t4": {
  "pts": [
   "GitLab 不只是仓库：群组管项目、成员权限管访问、合并请求管协作流程。",
   "Merge Request 是 GitLab 的核心协作方式：改完提请求，别人评审通过再合并。",
   "议题（issue）用来跟踪任务和 bug，和需求、提交关联形成完整研发链。"
  ],
  "ex": [
   "Merge Request 的作用？|请求把一个分支的改动合并进另一分支，附带讨论和评审，通过后合并，保证代码质量。",
   "GitLab 里群组（group）用来做什么？|把相关项目和成员组织在一起，统一管理权限和共享设置。"
  ],
  "code": ""
 },
 "t5": {
  "pts": [
   "企业工作流常见模式：主分支 + 功能分支 + 合并请求 + 评审，README 里写清规则。",
   "三类典型冲突：改不同文件、同文件不同位置、同文件相同位置——最后一种要人工判断。",
   "rebase 让提交历史更线性，但会重写历史，公共分支上慎用。"
  ],
  "ex": [
   "功能分支工作流的要点？|每个功能从主干开分支独立开发，完成后提合并请求，评审通过再合回主干。",
   "什么情况下不该用 rebase？|已经推送到公共分支、别人基于它开发时，rebase 会改写历史导致他人混乱。"
  ],
  "code": ""
 },
 "t6": {
  "pts": [
   "CI 持续集成：提交后自动构建测试；CD 持续部署：测试通过后自动发布。",
   "Runner 是执行 job 的机器，注册到 GitLab 后按 .gitlab-ci.yml 跑流水线。",
   "流水线通常含构建→测试→部署，可加安全扫描；配置写在 .gitlab-ci.yml。"
  ],
  "ex": [
   "CI 与 CD 分别指什么？|CI 持续集成：频繁合并并自动构建测试；CD 持续交付/部署：自动把通过测试的版本发布出去。",
   "Runner 在 CI/CD 中做什么？|执行流水线里定义的 job（构建、测试、部署等），把结果回传给 GitLab。"
  ],
  "code": ""
 }
} },
    "javaweb": { terms: {
 "t1": [
  [
   "HTML",
   "n.",
   "超文本标记语言",
   "HTML structures a web page with tags.",
   "HTML 用标签组织网页结构。"
  ],
  [
   "tag",
   "n.",
   "标签",
   "A tag like <p> defines a paragraph.",
   "像 <p> 的标签定义段落。"
  ],
  [
   "form",
   "n.",
   "表单",
   "A form collects user input.",
   "表单收集用户输入。"
  ],
  [
   "table",
   "n.",
   "表格",
   "A table arranges data in rows and columns.",
   "表格按行列排布数据。"
  ],
  [
   "attribute",
   "n.",
   "属性",
   "An attribute like href gives extra information.",
   "像 href 的属性提供额外信息。"
  ],
  [
   "iframe",
   "n.",
   "内联框架",
   "An iframe embeds another page inside a page.",
   "iframe 把另一个页面嵌进当前页。"
  ]
 ],
 "t2": [
  [
   "CSS",
   "n.",
   "层叠样式表",
   "CSS controls the presentation of HTML.",
   "CSS 控制 HTML 的显示样式。"
  ],
  [
   "selector",
   "n.",
   "选择器",
   "A selector targets which elements get styled.",
   "选择器指定哪些元素被加样式。"
  ],
  [
   "box model",
   "n.",
   "盒子模型",
   "The box model has content, padding, border and margin.",
   "盒子模型含内容、内边距、边框和外边距。"
  ],
  [
   "layout",
   "n.",
   "布局",
   "CSS layout positions elements on the page.",
   "CSS 布局决定元素在页面上的位置。"
  ],
  [
   "class",
   "n.",
   "类",
   "A class groups elements sharing a style.",
   "类把共享样式的元素归组。"
  ],
  [
   "cascade",
   "n.",
   "层叠",
   "The cascade decides which conflicting rule wins.",
   "层叠决定冲突规则哪条生效。"
  ]
 ],
 "t3": [
  [
   "JavaScript",
   "n.",
   "JS 脚本语言",
   "JavaScript adds interactivity to web pages.",
   "JavaScript 给网页加交互。"
  ],
  [
   "variable",
   "n.",
   "变量",
   "A variable stores a value with let or var.",
   "变量用 let 或 var 存值。"
  ],
  [
   "function",
   "n.",
   "函数",
   "A function is a reusable block of code.",
   "函数是可复用的代码块。"
  ],
  [
   "DOM",
   "n.",
   "文档对象模型",
   "The DOM is the tree of page elements.",
   "DOM 是页面元素的树结构。"
  ],
  [
   "event",
   "n.",
   "事件",
   "A click is an event JavaScript can handle.",
   "点击是 JavaScript 能处理的事件。"
  ],
  [
   "callback",
   "n.",
   "回调函数",
   "A callback runs after an event occurs.",
   "回调在事件发生后执行。"
  ]
 ],
 "t4": [
  [
   "Tomcat",
   "n.",
   "Tomcat 服务器",
   "Tomcat is a servlet container and web server.",
   "Tomcat 是 servlet 容器和 Web 服务器。"
  ],
  [
   "servlet container",
   "n.",
   "Servlet 容器",
   "A servlet container runs servlets.",
   "Servlet 容器运行 servlet。"
  ],
  [
   "B/S",
   "n.",
   "浏览器/服务器架构",
   "B/S means browser-server architecture.",
   "B/S 是浏览器-服务器架构。"
  ],
  [
   "C/S",
   "n.",
   "客户端/服务器架构",
   "C/S means client-server architecture.",
   "C/S 是客户端-服务器架构。"
  ],
  [
   "deployment",
   "n.",
   "部署",
   "Deployment puts a web app on the server.",
   "部署把 Web 应用放到服务器上。"
  ],
  [
   "request",
   "n.",
   "请求",
   "A request is sent from browser to server.",
   "请求从浏览器发往服务器。"
  ]
 ],
 "t5": [
  [
   "Servlet",
   "n.",
   "Servlet",
   "A servlet handles requests on the server side.",
   "Servlet 在服务端处理请求。"
  ],
  [
   "HTTP",
   "n.",
   "超文本传输协议",
   "HTTP is the protocol of the web.",
   "HTTP 是 Web 的传输协议。"
  ],
  [
   "session",
   "n.",
   "会话",
   "A session tracks a user across requests.",
   "会话跨请求跟踪同一用户。"
  ],
  [
   "request parameter",
   "n.",
   "请求参数",
   "Request parameters carry user input.",
   "请求参数携带用户输入。"
  ],
  [
   "forward",
   "n.",
   "转发",
   "Forward passes a request to another resource internally.",
   "转发在服务器内部把请求交给另一资源。"
  ],
  [
   "redirect",
   "n.",
   "重定向",
   "Redirect tells the browser to request a new URL.",
   "重定向让浏览器请求新 URL。"
  ]
 ],
 "t6": [
  [
   "MVC",
   "n.",
   "模型-视图-控制器",
   "MVC separates model, view and controller.",
   "MVC 把模型、视图、控制器分离。"
  ],
  [
   "DAO",
   "n.",
   "数据访问对象",
   "A DAO abstracts database access.",
   "DAO 抽象数据库访问。"
  ],
  [
   "pagination",
   "n.",
   "分页",
   "Pagination splits results into pages.",
   "分页把结果分成多页。"
  ],
  [
   "CRUD",
   "n.",
   "增删改查",
   "CRUD is create, read, update, delete.",
   "CRUD 是创建、读取、更新、删除。"
  ],
  [
   "service layer",
   "n.",
   "服务层",
   "The service layer holds business logic.",
   "服务层放业务逻辑。"
  ],
  [
   "query",
   "n.",
   "查询",
   "A query searches for matching records.",
   "查询搜索匹配的记录。"
  ]
 ],
 "t7": [
  [
   "DispatcherServlet",
   "n.",
   "前端控制器",
   "DispatcherServlet routes all incoming requests.",
   "前端控制器分发所有进来的请求。"
  ],
  [
   "IOC",
   "n.",
   "控制反转",
   "IOC lets a container manage object creation.",
   "控制反转让容器管理对象创建。"
  ],
  [
   "Filter",
   "n.",
   "过滤器",
   "A Filter runs before or after a request.",
   "过滤器在请求前后执行。"
  ],
  [
   "Listener",
   "n.",
   "监听器",
   "A Listener reacts to lifecycle events.",
   "监听器响应生命周期事件。"
  ],
  [
   "transaction",
   "n.",
   "事务",
   "A transaction groups operations as one unit.",
   "事务把多个操作合成一个整体。"
  ],
  [
   "ThreadLocal",
   "n.",
   "线程本地变量",
   "ThreadLocal gives each thread its own value.",
   "ThreadLocal 给每个线程独立的值。"
  ]
 ],
 "t8": [
  [
   "QQZone",
   "n.",
   "QQ 空间项目",
   "QQZone is a practice project with friends and logs.",
   "QQZone 是含好友和日志的练习项目。"
  ],
  [
   "POJO",
   "n.",
   "简单 Java 对象",
   "A POJO is a plain Java object.",
   "POJO 是普通的 Java 对象。"
  ],
  [
   "login",
   "n.",
   "登录",
   "Login verifies a user’s identity.",
   "登录验证用户身份。"
  ],
  [
   "cookie",
   "n.",
   "Cookie",
   "A cookie stores small data on the client.",
   "Cookie 在客户端存少量数据。"
  ],
  [
   "gateway",
   "n.",
   "网关",
   "A gateway controls access to resources.",
   "网关控制对资源的访问。"
  ],
  [
   "logging",
   "n.",
   "日志",
   "Logging records what the application did.",
   "日志记录应用做过什么。"
  ]
 ],
 "t9": [
  [
   "bookstore",
   "n.",
   "书城项目",
   "The bookstore project practices a full shopping flow.",
   "书城项目练完整购物流程。"
  ],
  [
   "ER diagram",
   "n.",
   "ER 图",
   "An ER diagram models entities and relationships.",
   "ER 图建模实体与关系。"
  ],
  [
   "shopping cart",
   "n.",
   "购物车",
   "A shopping cart holds selected items before checkout.",
   "购物车在结账前存放选中的商品。"
  ],
  [
   "checkout",
   "n.",
   "结账",
   "Checkout turns a cart into an order.",
   "结账把购物车变成订单。"
  ],
  [
   "order",
   "n.",
   "订单",
   "An order records a completed purchase.",
   "订单记录一次完成的购买。"
  ],
  [
   "filter",
   "n.",
   "过滤器",
   "A filter guards access to servlets.",
   "过滤器保护 servlet 访问。"
  ]
 ],
 "t10": [
  [
   "Vue",
   "n.",
   "Vue 框架",
   "Vue is a progressive JavaScript framework for UIs.",
   "Vue 是构建界面的渐进式框架。"
  ],
  [
   "Axios",
   "n.",
   "Axios",
   "Axios sends HTTP requests from the browser.",
   "Axios 从浏览器发送 HTTP 请求。"
  ],
  [
   "AJAX",
   "n.",
   "异步请求",
   "AJAX updates a page without reloading it.",
   "AJAX 不刷新页面就更新内容。"
  ],
  [
   "JSON",
   "n.",
   "JSON 数据格式",
   "JSON is a lightweight data interchange format.",
   "JSON 是轻量数据交换格式。"
  ],
  [
   "verification code",
   "n.",
   "验证码",
   "A verification code confirms a human user.",
   "验证码确认是真人操作。"
  ],
  [
   "regular expression",
   "n.",
   "正则表达式",
   "A regex matches patterns in text.",
   "正则匹配文本中的模式。"
  ]
 ]
}, chapterNotes: {
 "t1": {
  "pts": [
   "HTML 用标签描述结构，不是编程语言；标签分单标签和成对标签，属性写在开始标签里。",
   "表单（form）是前后端交互的入口：method 决定 GET/POST，action 决定提交地址。",
   "table 由 table/tr/td 三层组成；frameset/iframe 用于页面嵌套，现在更推荐后者。"
  ],
  "ex": [
   "HTML 中 form 的 method 和 action 分别是什么？|method 指定提交方式（GET/POST），action 指定提交到哪个 URL 处理。",
   "HTML 是编程语言吗？|不是。HTML 是标记语言，只描述页面结构和内容，没有逻辑和计算能力。"
  ],
  "code": ""
 },
 "t2": {
  "pts": [
   "CSS 选择器（元素/类/id）决定样式作用范围；优先级 id > class > 元素，冲突时高优先级胜。",
   "盒子模型是布局核心：content、padding、border、margin 四层，width 算哪部分要看 box-sizing。",
   "布局从传统 float/position 到 flex/grid，考核重点是用它做出等宽列和居中。"
  ],
  "ex": [
   "盒子模型由哪几部分组成？|内容(content)、内边距(padding)、边框(border)、外边距(margin)四部分。",
   "CSS 选择器优先级怎么排？|!important > 行内样式 > id > class/属性/伪类 > 元素/伪元素。"
  ],
  "code": ""
 },
 "t3": {
  "pts": [
   "JavaScript 让页面\"动\"起来：变量、函数、条件、循环是语法骨架。",
   "DOM 把 HTML 变成对象树，getElementById 等 API 能查改元素内容和样式。",
   "事件驱动是 JS 的灵魂：onclick 等绑定回调函数，用户操作时触发。"
  ],
  "ex": [
   "DOM 是什么？|文档对象模型，把 HTML 文档表示成对象树，JS 可通过它访问和修改页面元素。",
   "事件与回调函数的关系？|事件（如点击）发生时，绑定的回调函数被调用执行相应逻辑。"
  ],
  "code": ""
 },
 "t4": {
  "pts": [
   "B/S 架构浏览器即客户端，免安装、易维护；C/S 要装专门客户端，体验强但升级麻烦。",
   "Tomcat 是 servlet 容器：接收 HTTP 请求、调用 servlet、返回响应，是 Java Web 的运行环境。",
   "在 IDEA 里配置 Tomcat、部署项目、访问 URL，是 Java Web 开发第一步。"
  ],
  "ex": [
   "B/S 与 C/S 架构的区别？|B/S 用浏览器做客户端免安装；C/S 需专用客户端，部署升级成本高但功能可更强。",
   "Tomcat 在 Java Web 中扮演什么角色？|作为 Web 服务器和 Servlet 容器，接收请求、加载并执行 servlet、返回响应。"
  ],
  "code": ""
 },
 "t5": {
  "pts": [
   "Servlet 是服务端程序：继承 HttpServlet，重写 doGet/doPost 处理请求，由容器调用生命周期方法。",
   "HTTP 请求含请求行、头、体；响应含状态码、头、体；GET 参数在 URL，POST 在请求体。",
   "Session 用 Cookie 里的 JSESSIONID 识别用户；转发是服务器内部一次请求，重定向是客户端两次请求。"
  ],
  "ex": [
   "转发(forward)与重定向(redirect)的区别？|转发服务器内部完成、一次请求、地址栏不变；重定向客户端重新发请求、两次请求、地址栏改变。",
   "Servlet 的生命周期方法有哪些？|init() 初始化、service() 处理请求（分派 doGet/doPost）、destroy() 销毁。"
  ],
  "code": ""
 },
 "t6": {
  "pts": [
   "MVC 分层：Model 管数据、View 管显示、Controller 管调度，解耦后各改各的。",
   "DAO 把数据库操作封装起来，上层只调方法不写 SQL，便于维护和替换数据源。",
   "库存项目练的就是完整 CRUD + 分页 + 按关键字查询，是 Servlet 的综合应用。"
  ],
  "ex": [
   "MVC 三层各管什么？|Model 数据和业务、View 页面显示、Controller 接收请求并调度，降低耦合。",
   "DAO 模式的好处？|把数据访问细节封装起来，业务逻辑不直接依赖 SQL，更换数据库时改动小。"
  ],
  "code": ""
 },
 "t7": {
  "pts": [
   "手写 MVC 的核心是前端控制器：所有请求先进 DispatcherServlet，由它找到对应方法并调用。",
   "IOC（控制反转）把对象创建交给容器，需要时用反射注入，降低耦合——这是 Spring 的思想源头。",
   "Filter 拦截请求（如登录校验、编码），Listener 监听上下文事件；事务用 ThreadLocal 把连接绑定到线程。"
  ],
  "ex": [
   "IOC（控制反转）解决了什么问题？|把对象的创建和依赖管理交给容器，避免代码里 new 得到处都是，降低耦合。",
   "Filter 与 Listener 的区别？|Filter 拦截处理请求/响应；Listener 监听 Web 应用的生命周期事件（如上下文创建销毁）。"
  ],
  "code": ""
 },
 "t8": {
  "pts": [
   "QQZone 项目把 MVC 落地：DAO→Service→Controller 完整分层，练登录、好友列表、日志详情、回复管理。",
   "登录验证靠 Session 保存用户态，过滤器拦截未登录请求跳回登录页。",
   "通用逻辑（如分页、权限）抽成公共代码导出 jar，是多项目复用的基础。"
  ],
  "ex": [
   "Session 在登录中起什么作用？|登录成功后把用户对象存入 Session，后续请求凭 Session 识别已登录用户，实现状态保持。",
   "为什么要抽取通用代码？|把分页、权限校验等重复逻辑独立成公共模块，多个项目复用，减少重复开发。"
  ],
  "code": ""
 },
 "t9": {
  "pts": [
   "书城项目是 JavaWeb 集大成：数据库设计（ER 图）→ 登录 → 图书列表 → 购物车 → 结账 → 订单。",
   "先画 ER 图定表结构（用户、图书、订单、订单项），再按分层逐块实现。",
   "购物车用 Session 保存，结账时生成订单；过滤器校验合法用户，未登录不能下单。"
  ],
  "ex": [
   "为什么要先画 ER 图？|它理清实体、属性和关系，是数据库表结构设计的基础，避免后面反复改表。",
   "购物车的信息一般存在哪里？|存在 Session 中，同一用户多次请求都能取到自己的购物车内容。"
  ],
  "code": ""
 },
 "t10": {
  "pts": [
   "Vue 用数据绑定和组件化让前端更简洁；v-model 双向绑定表单，v-for 渲染列表。",
   "Axios 发送异步请求（GET/POST），后端返回 JSON；它替代了原生 AJAX 的繁琐写法。",
   "表单验证用正则表达式；注册页加验证码防机器人，是完整项目必备的健壮性细节。"
  ],
  "ex": [
   "AJAX 的核心价值是什么？|异步与服务器交换数据并局部更新页面，无需整页刷新，体验更流畅。",
   "Axios 相比原生 AJAX 好在哪？|基于 Promise、API 简洁、自动转 JSON、支持拦截器，写起来更清晰。"
  ],
  "code": ""
 }
} }
  };
  for (var id in X) {
    if (!C[id]) continue;
    C[id].terms = X[id].terms;
    C[id].chapterNotes = X[id].chapterNotes;
  }
})(window);
