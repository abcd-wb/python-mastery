/* 纯英文课程：按 NTU DSAI 课程对应表，四模块组织。命名 NTU课程名 ---- 对应英文课程名。 */
window.EN_MODULES = [
 {
  "id": "m1",
  "zh": "编程基础",
  "name": "Programming Fundamentals",
  "desc": "第一门编程课：用 MIT 6.0001 的英文原版课把 Python 语法、函数、数据结构走一遍，对应 NTU 的 SC1003。",
  "courses": [
   "sc1003"
  ]
 },
 {
  "id": "m2",
  "zh": "数学基础",
  "name": "Mathematics Foundations",
  "desc": "微积分 + 离散数学：NTU 大一两门数学地基，对应 MIT 18.01 与 MIT 6.042J 的英文原版课。",
  "courses": [
   "mh1805",
   "mh1812"
  ]
 },
 {
  "id": "m3",
  "zh": "数据结构",
  "name": "Data Structures and Algorithms",
  "desc": "SC1007 数据结构，对应 MIT 6.006 英文原版：算法思维、复杂度、排序查找、图与动态规划。",
  "courses": [
   "sc1007"
  ]
 },
 {
  "id": "m4",
  "zh": "软件工程",
  "name": "Software Engineering",
  "desc": "SC2002 面向对象 + SC2006 软件工程，对应 MIT 6.031 软件构造与开源实践。",
  "courses": [
   "sc2002",
   "sc2006"
  ]
 }
];
window.EN_COURSES = {
 "sc1003": {
  "id": "sc1003",
  "year": "大一",
  "ntuCode": "SC1003",
  "ntuName": "编程入门",
  "enCode": "MIT 6.0001",
  "enName": "Introduction to Computer Science and Programming in Python",
  "cnRef": "黑马《Python 入门》",
  "teacher": "MIT OpenCourseWare · Prof. Ana Bell, Dr. Jason Ku",
  "ocw": "https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/",
  "color": "#2563eb",
  "tint": "#e8f0ff",
  "tint2": "#c2d8ff",
  "desc": "An introduction to computer science and programming using Python. Gain experience in solving problems by creating algorithms and writing programs.",
  "chapters": [
   {
    "n": "Lecture 1",
    "name": "Introduction to Python",
    "desc": "Why compute? What is computer science? First Python programs.",
    "terms": [
     "algorithm",
     "program",
     "computer science",
     "computational thinking"
    ]
   },
   {
    "n": "Lecture 2",
    "name": "Basics of Python",
    "desc": "Variables, expressions, statements, types, and simple input/output.",
    "terms": [
     "variable",
     "expression",
     "statement",
     "type",
     "assignment"
    ]
   },
   {
    "n": "Lecture 3",
    "name": "Control Flow",
    "desc": "Branches and loops: how programs make decisions and repeat work.",
    "terms": [
     "conditional",
     "branch",
     "loop",
     "iteration",
     "boolean"
    ]
   },
   {
    "n": "Lecture 4",
    "name": "Functions and Abstraction",
    "desc": "Functions, abstraction, scope, and an introduction to recursion.",
    "terms": [
     "function",
     "abstraction",
     "parameter",
     "return value",
     "scope"
    ]
   },
   {
    "n": "Lecture 5",
    "name": "Testing and Debugging",
    "desc": "Writing test cases, finding bugs, and defensive programming.",
    "terms": [
     "test case",
     "debugging",
     "assertion",
     "exception",
     "defensive programming"
    ]
   },
   {
    "n": "Lecture 6",
    "name": "Tuples and Lists",
    "desc": "Ordering data: tuples, lists, aliasing, and immutable vs mutable types.",
    "terms": [
     "tuple",
     "list",
     "alias",
     "mutable",
     "immutable"
    ]
   },
   {
    "n": "Lecture 7",
    "name": "Dictionaries",
    "desc": "Key-value storage, dictionary methods, and using dictionaries for counting.",
    "terms": [
     "dictionary",
     "key",
     "value",
     "hash table",
     "mapping"
    ]
   },
   {
    "n": "Lecture 8",
    "name": "Classes and Objects",
    "desc": "Object-oriented programming: classes, instances, methods, and encapsulation.",
    "terms": [
     "class",
     "object",
     "instance",
     "method",
     "encapsulation"
    ]
   },
   {
    "n": "Lecture 9",
    "name": "Inheritance",
    "desc": "Reusing code with inheritance, overriding methods, and polymorphism.",
    "terms": [
     "inheritance",
     "subclass",
     "override",
     "polymorphism"
    ]
   },
   {
    "n": "Lecture 10",
    "name": "Optimization and Recursion",
    "desc": "Recursive problem solving, memoization, and optimization problems.",
    "terms": [
     "recursion",
     "memoization",
     "base case",
     "optimization"
    ]
   },
   {
    "n": "Lecture 11",
    "name": "Simulation and Modeling",
    "desc": "Using random numbers and simulation to model real-world systems.",
    "terms": [
     "simulation",
     "modeling",
     "randomness",
     "probability"
    ]
   },
   {
    "n": "Lecture 12",
    "name": "Complexity and Efficiency",
    "desc": "Measuring running time, Big-O notation, and choosing efficient algorithms.",
    "terms": [
     "complexity",
     "Big-O notation",
     "efficiency",
     "scalability"
    ]
   }
  ],
  "name": "SC1003 编程入门 ---- MIT 6.0001 Introduction to Computer Science and Programming in Python",
  "termsAll": [
   "Big-O notation",
   "abstraction",
   "algorithm",
   "alias",
   "assertion",
   "assignment",
   "base case",
   "boolean",
   "branch",
   "class",
   "complexity",
   "computational thinking",
   "computer science",
   "conditional",
   "debugging",
   "defensive programming",
   "dictionary",
   "efficiency",
   "encapsulation",
   "exception",
   "expression",
   "function",
   "hash table",
   "immutable",
   "inheritance",
   "instance",
   "iteration",
   "key",
   "list",
   "loop",
   "mapping",
   "memoization",
   "method",
   "modeling",
   "mutable",
   "object",
   "optimization",
   "override",
   "parameter",
   "polymorphism",
   "probability",
   "program",
   "randomness",
   "recursion",
   "return value",
   "scalability",
   "scope",
   "simulation",
   "statement",
   "subclass",
   "test case",
   "tuple",
   "type",
   "value",
   "variable"
  ]
 },
 "mh1805": {
  "id": "mh1805",
  "year": "大一",
  "ntuCode": "MH1805",
  "ntuName": "微积分",
  "enCode": "MIT 18.01",
  "enName": "Single Variable Calculus",
  "cnRef": "宋浩《高等数学》",
  "teacher": "MIT OpenCourseWare · Prof. David Jerison",
  "ocw": "https://ocw.mit.edu/courses/18-01-single-variable-calculus-fall-2006/",
  "color": "#1d4ed8",
  "tint": "#e8f0ff",
  "tint2": "#b8d0ff",
  "desc": "Differentiation and integration of functions of one variable, with applications.",
  "chapters": [
   {
    "n": "Unit 1",
    "name": "Derivatives",
    "desc": "Slope, velocity, rate of change, and the derivative as a limit.",
    "terms": [
     "derivative",
     "slope",
     "rate of change",
     "limit"
    ]
   },
   {
    "n": "Unit 2",
    "name": "Limits and Continuity",
    "desc": "Formal limits, continuity, and the intermediate value theorem.",
    "terms": [
     "limit",
     "continuity",
     "epsilon-delta",
     "intermediate value theorem"
    ]
   },
   {
    "n": "Unit 3",
    "name": "Differentiation Rules",
    "desc": "Power, product, quotient, and chain rules.",
    "terms": [
     "power rule",
     "product rule",
     "quotient rule",
     "chain rule"
    ]
   },
   {
    "n": "Unit 4",
    "name": "Applications of Derivatives",
    "desc": "Maxima and minima, curve sketching, and optimization.",
    "terms": [
     "critical point",
     "maximum",
     "minimum",
     "optimization"
    ]
   },
   {
    "n": "Unit 5",
    "name": "Related Rates and Approximations",
    "desc": "Implicit differentiation and linear approximation.",
    "terms": [
     "related rates",
     "implicit differentiation",
     "linear approximation"
    ]
   },
   {
    "n": "Unit 6",
    "name": "Antiderivatives and Differential Equations",
    "desc": "Finding antiderivatives and solving simple differential equations.",
    "terms": [
     "antiderivative",
     "differential equation",
     "initial value problem"
    ]
   },
   {
    "n": "Unit 7",
    "name": "Definite Integrals",
    "desc": "Area under a curve, Riemann sums, and the fundamental theorem.",
    "terms": [
     "definite integral",
     "Riemann sum",
     "fundamental theorem of calculus"
    ]
   },
   {
    "n": "Unit 8",
    "name": "Integration Techniques",
    "desc": "Substitution, integration by parts, and partial fractions.",
    "terms": [
     "substitution",
     "integration by parts",
     "partial fractions"
    ]
   },
   {
    "n": "Unit 9",
    "name": "Applications of Integrals",
    "desc": "Volumes, arc length, work, and average value.",
    "terms": [
     "volume",
     "arc length",
     "work",
     "average value"
    ]
   },
   {
    "n": "Unit 10",
    "name": "Infinite Series",
    "desc": "Sequences, series, convergence tests, and Taylor series.",
    "terms": [
     "sequence",
     "series",
     "convergence",
     "Taylor series"
    ]
   }
  ],
  "name": "MH1805 微积分 ---- MIT 18.01 Single Variable Calculus",
  "termsAll": [
   "Riemann sum",
   "Taylor series",
   "antiderivative",
   "arc length",
   "average value",
   "chain rule",
   "continuity",
   "convergence",
   "critical point",
   "definite integral",
   "derivative",
   "differential equation",
   "epsilon-delta",
   "fundamental theorem of calculus",
   "implicit differentiation",
   "initial value problem",
   "integration by parts",
   "intermediate value theorem",
   "limit",
   "linear approximation",
   "maximum",
   "minimum",
   "optimization",
   "partial fractions",
   "power rule",
   "product rule",
   "quotient rule",
   "rate of change",
   "related rates",
   "sequence",
   "series",
   "slope",
   "substitution",
   "volume",
   "work"
  ]
 },
 "mh1812": {
  "id": "mh1812",
  "year": "大一",
  "ntuCode": "MH1812",
  "ntuName": "离散数学",
  "enCode": "MIT 6.042J",
  "enName": "Mathematics for Computer Science",
  "cnRef": "屈婉玲《离散数学》",
  "teacher": "MIT OpenCourseWare · Prof. Albert Meyer, Dr. Adam Chlipala",
  "ocw": "https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/",
  "color": "#7c3aed",
  "tint": "#f3ecff",
  "tint2": "#ddc9ff",
  "desc": "Discrete mathematics for computer science: proofs, induction, sets, graphs, counting and probability.",
  "chapters": [
   {
    "n": "Lecture 1",
    "name": "Introduction and Proofs",
    "desc": "Propositions, predicates, and basic proof techniques.",
    "terms": [
     "proposition",
     "predicate",
     "proof",
     "axiom"
    ]
   },
   {
    "n": "Lecture 2",
    "name": "Induction",
    "desc": "Weak and strong induction, with applications to algorithms.",
    "terms": [
     "induction",
     "base case",
     "inductive step",
     "strong induction"
    ]
   },
   {
    "n": "Lecture 3",
    "name": "Set Theory",
    "desc": "Sets, subsets, unions, intersections, and set identities.",
    "terms": [
     "set",
     "subset",
     "union",
     "intersection",
     "power set"
    ]
   },
   {
    "n": "Lecture 4",
    "name": "Relations and Functions",
    "desc": "Binary relations, equivalence relations, and functions.",
    "terms": [
     "relation",
     "equivalence relation",
     "function",
     "injective",
     "surjective"
    ]
   },
   {
    "n": "Lecture 5",
    "name": "Modular Arithmetic",
    "desc": "Congruences, modular inverses, and RSA encryption.",
    "terms": [
     "modular arithmetic",
     "congruence",
     "modular inverse",
     "RSA"
    ]
   },
   {
    "n": "Lecture 6",
    "name": "Graphs and Trees",
    "desc": "Graph theory basics, trees, and graph traversal.",
    "terms": [
     "graph",
     "vertex",
     "edge",
     "tree",
     "connectivity"
    ]
   },
   {
    "n": "Lecture 7",
    "name": "Counting",
    "desc": "Rule of sum and product, permutations, combinations, and inclusion-exclusion.",
    "terms": [
     "permutation",
     "combination",
     "binomial coefficient",
     "inclusion-exclusion"
    ]
   },
   {
    "n": "Lecture 8",
    "name": "Probability",
    "desc": "Sample spaces, conditional probability, independence, and expectation.",
    "terms": [
     "sample space",
     "conditional probability",
     "independence",
     "expectation"
    ]
   },
   {
    "n": "Lecture 9",
    "name": "Recurrences",
    "desc": "Solving recurrence relations and analyzing recursive algorithms.",
    "terms": [
     "recurrence",
     "characteristic equation",
     "recursive definition"
    ]
   }
  ],
  "name": "MH1812 离散数学 ---- MIT 6.042J Mathematics for Computer Science",
  "termsAll": [
   "RSA",
   "axiom",
   "base case",
   "binomial coefficient",
   "characteristic equation",
   "combination",
   "conditional probability",
   "congruence",
   "connectivity",
   "edge",
   "equivalence relation",
   "expectation",
   "function",
   "graph",
   "inclusion-exclusion",
   "independence",
   "induction",
   "inductive step",
   "injective",
   "intersection",
   "modular arithmetic",
   "modular inverse",
   "permutation",
   "power set",
   "predicate",
   "proof",
   "proposition",
   "recurrence",
   "recursive definition",
   "relation",
   "sample space",
   "set",
   "strong induction",
   "subset",
   "surjective",
   "tree",
   "union",
   "vertex"
  ]
 },
 "sc1007": {
  "id": "sc1007",
  "year": "大一",
  "ntuCode": "SC1007",
  "ntuName": "数据结构",
  "enCode": "MIT 6.006",
  "enName": "Introduction to Algorithms",
  "cnRef": "浙大陈越 / 王卓《数据结构》",
  "teacher": "MIT OpenCourseWare · Prof. Erik Demaine, Dr. Jason Ku, Prof. Justin Solomon",
  "ocw": "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/",
  "color": "#0891b2",
  "tint": "#ecfeff",
  "tint2": "#a5f3fc",
  "desc": "Introduction to algorithms: designing and analyzing efficient algorithms and data structures.",
  "chapters": [
   {
    "n": "Lecture 1",
    "name": "Algorithmic Thinking, Peak Finding",
    "desc": "What is an algorithm? Peak finding in one and two dimensions.",
    "terms": [
     "algorithm",
     "peak finding",
     "correctness",
     "runtime"
    ]
   },
   {
    "n": "Lecture 2",
    "name": "Models of Computation, Sorting",
    "desc": "Computational models, insertion sort, merge sort, and stability.",
    "terms": [
     "model of computation",
     "insertion sort",
     "merge sort",
     "stability"
    ]
   },
   {
    "n": "Lecture 3",
    "name": "Asymptotic Notation",
    "desc": "Big-O, Omega, Theta notation and comparing algorithm growth rates.",
    "terms": [
     "asymptotic notation",
     "Big-O",
     "Omega",
     "Theta"
    ]
   },
   {
    "n": "Lecture 4",
    "name": "Binary Search and Merge Sort",
    "desc": "Divide and conquer, recurrence relations, and the master theorem.",
    "terms": [
     "binary search",
     "divide and conquer",
     "recurrence",
     "master theorem"
    ]
   },
   {
    "n": "Lecture 5",
    "name": "Hashing and Hash Tables",
    "desc": "Hash functions, collision resolution, and dictionary performance.",
    "terms": [
     "hashing",
     "hash table",
     "collision",
     "load factor"
    ]
   },
   {
    "n": "Lecture 6",
    "name": "Binary Search Trees",
    "desc": "BST operations, balanced trees, and ordered dictionaries.",
    "terms": [
     "binary search tree",
     "balanced tree",
     "rotation",
     "ordered dictionary"
    ]
   },
   {
    "n": "Lecture 7",
    "name": "Priority Queues and Heaps",
    "desc": "Heap data structure, heapify, and priority queue applications.",
    "terms": [
     "priority queue",
     "heap",
     "heapify",
     "heap sort"
    ]
   },
   {
    "n": "Lecture 8",
    "name": "Graph Search",
    "desc": "Graph representation, breadth-first search, and depth-first search.",
    "terms": [
     "graph",
     "BFS",
     "DFS",
     "shortest path",
     "topological sort"
    ]
   },
   {
    "n": "Lecture 9",
    "name": "Shortest Paths",
    "desc": "Dijkstra and Bellman-Ford algorithms for shortest paths.",
    "terms": [
     "shortest path",
     "Dijkstra",
     "Bellman-Ford",
     "negative edge"
    ]
   },
   {
    "n": "Lecture 10",
    "name": "Dynamic Programming",
    "desc": "Optimal substructure, memoization, and classic DP problems.",
    "terms": [
     "dynamic programming",
     "optimal substructure",
     "memoization",
     "overlapping subproblems"
    ]
   }
  ],
  "name": "SC1007 数据结构 ---- MIT 6.006 Introduction to Algorithms",
  "termsAll": [
   "BFS",
   "Bellman-Ford",
   "Big-O",
   "DFS",
   "Dijkstra",
   "Omega",
   "Theta",
   "algorithm",
   "asymptotic notation",
   "balanced tree",
   "binary search",
   "binary search tree",
   "collision",
   "correctness",
   "divide and conquer",
   "dynamic programming",
   "graph",
   "hash table",
   "hashing",
   "heap",
   "heap sort",
   "heapify",
   "insertion sort",
   "load factor",
   "master theorem",
   "memoization",
   "merge sort",
   "model of computation",
   "negative edge",
   "optimal substructure",
   "ordered dictionary",
   "overlapping subproblems",
   "peak finding",
   "priority queue",
   "recurrence",
   "rotation",
   "runtime",
   "shortest path",
   "stability",
   "topological sort"
  ]
 },
 "sc2002": {
  "id": "sc2002",
  "year": "大一",
  "ntuCode": "SC2002",
  "ntuName": "面向对象",
  "enCode": "MIT 6.031",
  "enName": "Software Construction (Object-Oriented Design)",
  "cnRef": "尚硅谷《Java 基础》",
  "teacher": "MIT OpenCourseWare · Prof. Daniel Jackson, Prof. Rob Miller",
  "ocw": "https://ocw.mit.edu/courses/6-031-software-construction-spring-2017/",
  "color": "#ea580c",
  "tint": "#fff0e6",
  "tint2": "#ffd6b8",
  "desc": "Software construction with a focus on object-oriented design, specifications, and testing.",
  "chapters": [
   {
    "n": "Lecture 1",
    "name": "Software Engineering",
    "desc": "What makes software good? Safety, security, and maintainability.",
    "terms": [
     "software engineering",
     "maintainability",
     "robustness",
     "reusability"
    ]
   },
   {
    "n": "Lecture 2",
    "name": "Testing",
    "desc": "Test-first programming, unit tests, boundary values, and coverage.",
    "terms": [
     "unit test",
     "test-first",
     "boundary value",
     "coverage"
    ]
   },
   {
    "n": "Lecture 3",
    "name": "Specifications",
    "desc": "Preconditions, postconditions, and specifying methods.",
    "terms": [
     "specification",
     "precondition",
     "postcondition",
     "contract"
    ]
   },
   {
    "n": "Lecture 4",
    "name": "Abstraction Functions and Representation Invariants",
    "desc": "Abstract data types, AF, RI, and representation exposure.",
    "terms": [
     "abstraction function",
     "representation invariant",
     "ADT",
     "representation exposure"
    ]
   },
   {
    "n": "Lecture 5",
    "name": "Immutable Types",
    "desc": "Benefits of immutability, defensive copying, and snapshot diagrams.",
    "terms": [
     "immutability",
     "defensive copy",
     "aliasing",
     "snapshot diagram"
    ]
   },
   {
    "n": "Lecture 6",
    "name": "Equality",
    "desc": "Reference equality vs value equality, equals and hashCode.",
    "terms": [
     "equality",
     "reference equality",
     "value equality",
     "hashCode"
    ]
   },
   {
    "n": "Lecture 7",
    "name": "Debugging",
    "desc": "Scientific debugging, stack traces, and systematic approaches.",
    "terms": [
     "debugging",
     "stack trace",
     "hypothesis",
     "logging"
    ]
   },
   {
    "n": "Lecture 8",
    "name": "Concurrency",
    "desc": "Threads, shared memory, race conditions, and synchronization.",
    "terms": [
     "concurrency",
     "thread",
     "race condition",
     "synchronization",
     "deadlock"
    ]
   },
   {
    "n": "Lecture 9",
    "name": "Design Patterns",
    "desc": "Common OO patterns: factory, strategy, observer, and decorator.",
    "terms": [
     "design pattern",
     "factory",
     "strategy",
     "observer",
     "decorator"
    ]
   }
  ],
  "name": "SC2002 面向对象 ---- MIT 6.031 Software Construction (Object-Oriented Design)",
  "termsAll": [
   "ADT",
   "abstraction function",
   "aliasing",
   "boundary value",
   "concurrency",
   "contract",
   "coverage",
   "deadlock",
   "debugging",
   "decorator",
   "defensive copy",
   "design pattern",
   "equality",
   "factory",
   "hashCode",
   "hypothesis",
   "immutability",
   "logging",
   "maintainability",
   "observer",
   "postcondition",
   "precondition",
   "race condition",
   "reference equality",
   "representation exposure",
   "representation invariant",
   "reusability",
   "robustness",
   "snapshot diagram",
   "software engineering",
   "specification",
   "stack trace",
   "strategy",
   "synchronization",
   "test-first",
   "thread",
   "unit test",
   "value equality"
  ]
 },
 "sc2006": {
  "id": "sc2006",
  "year": "大一",
  "ntuCode": "SC2006",
  "ntuName": "软件工程",
  "enCode": "MIT 6.031 + Open Source Practice",
  "enName": "Software Construction and Open Source Development",
  "cnRef": "尚硅谷《Git》《JavaWeb》",
  "teacher": "MIT OpenCourseWare · Prof. Daniel Jackson, Prof. Rob Miller",
  "ocw": "https://ocw.mit.edu/courses/6-031-software-construction-spring-2017/",
  "color": "#0d9488",
  "tint": "#e6f7f4",
  "tint2": "#b8e8e0",
  "desc": "Software construction plus open-source practice: version control, code review, and collaborative development.",
  "chapters": [
   {
    "n": "Lecture 1",
    "name": "Software Engineering",
    "desc": "Software quality goals and engineering practices.",
    "terms": [
     "software quality",
     "maintainability",
     "correctness",
     "robustness"
    ]
   },
   {
    "n": "Lecture 2",
    "name": "Testing",
    "desc": "Unit tests, specifications, and test-driven development.",
    "terms": [
     "unit test",
     "TDD",
     "coverage",
     "regression test"
    ]
   },
   {
    "n": "Lecture 3",
    "name": "Specifications",
    "desc": "Writing clear method specifications and contracts.",
    "terms": [
     "specification",
     "precondition",
     "postcondition",
     "contract"
    ]
   },
   {
    "n": "Lecture 4",
    "name": "Version Control with Git",
    "desc": "Repositories, commits, branches, merging, and pull requests.",
    "terms": [
     "version control",
     "Git",
     "commit",
     "branch",
     "merge",
     "pull request"
    ]
   },
   {
    "n": "Lecture 5",
    "name": "Code Review",
    "desc": "Reviewing code for correctness, clarity, and maintainability.",
    "terms": [
     "code review",
     "readability",
     "maintainability",
     "feedback"
    ]
   },
   {
    "n": "Lecture 6",
    "name": "Abstraction and Design",
    "desc": "Abstract data types, abstraction functions, and representation invariants.",
    "terms": [
     "abstraction",
     "ADT",
     "representation invariant",
     "encapsulation"
    ]
   },
   {
    "n": "Lecture 7",
    "name": "Concurrency",
    "desc": "Threads, synchronization, and avoiding race conditions.",
    "terms": [
     "concurrency",
     "thread",
     "race condition",
     "synchronization"
    ]
   },
   {
    "n": "Lecture 8",
    "name": "Open Source Practice",
    "desc": "Licenses, documentation, issue tracking, and collaborative workflows.",
    "terms": [
     "open source",
     "license",
     "documentation",
     "issue tracking",
     "collaboration"
    ]
   }
  ],
  "name": "SC2006 软件工程 ---- MIT 6.031 + Open Source Practice Software Construction and Open Source Development",
  "termsAll": [
   "ADT",
   "Git",
   "TDD",
   "abstraction",
   "branch",
   "code review",
   "collaboration",
   "commit",
   "concurrency",
   "contract",
   "correctness",
   "coverage",
   "documentation",
   "encapsulation",
   "feedback",
   "issue tracking",
   "license",
   "maintainability",
   "merge",
   "open source",
   "postcondition",
   "precondition",
   "pull request",
   "race condition",
   "readability",
   "regression test",
   "representation invariant",
   "robustness",
   "software quality",
   "specification",
   "synchronization",
   "thread",
   "unit test",
   "version control"
  ]
 }
};
