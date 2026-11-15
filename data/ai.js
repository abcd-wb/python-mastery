/* AI 应用实战：吴恩达 / 李宏毅 / 李沐 —— 由 tools/gen_ai_courses.py 从 B 站官方接口生成，勿手改 */
(function (W) {
  W.AI_TEACHERS = [
 {
  "id": "ng",
  "name": "吴恩达",
  "en": "Andrew Ng",
  "color": "#e11d48",
  "tint": "#ffe9ef",
  "tint2": "#ffc9d8",
  "ds": "用 AI 写代码 · 4 模块 35 集",
  "tag": "入门首选",
  "icon": "<path d=\"M12 3.2l1.9 4.6 4.6 1.9-4.6 1.9L12 16.2l-1.9-4.6L5.5 9.7l4.6-1.9L12 3.2Z\"/><path d=\"M18.4 15.2l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1Z\"/>",
  "desc": "DeepLearning.AI 创始人。不背语法，直接教你指挥 AI 写能跑的代码。",
  "order": "第一门：先建立“让 AI 替我写代码”的手感，全程不开编辑器也行。"
 },
 {
  "id": "lhy",
  "name": "李宏毅",
  "en": "Hung-yi Lee",
  "color": "#2563eb",
  "tint": "#e8f0ff",
  "tint2": "#c2d8ff",
  "ds": "台大教授 · 4 门课 · 中文最好懂",
  "tag": "4 门课",
  "icon": "<rect x=\"3\" y=\"4\" width=\"18\" height=\"11.5\" rx=\"1.6\"/><path d=\"M8 19.5h8M12 15.5v4\"/><path d=\"M7.5 8h9M7.5 11h6\"/>",
  "desc": "台大电机系教授。用宝可梦讲深度学习，中文圈公认讲得最清楚的人。",
  "order": "第二门往后：机器学习 → 深度学习 → 生成式 AI → 大模型，按这个顺序走。"
 },
 {
  "id": "mu",
  "name": "李沐",
  "en": "Mu Li",
  "color": "#0d9488",
  "tint": "#e6f7f4",
  "tint2": "#b8e8e0",
  "ds": "《动手学深度学习》作者 · 161 集",
  "tag": "边看边敲",
  "icon": "<path d=\"M4 5.4A1.9 1.9 0 0 1 5.9 3.5h13.1v17H5.9A1.9 1.9 0 0 1 4 18.6V5.4Z\"/><path d=\"M8.2 8.2h7.6M8.2 11.6h5.2\"/>",
  "desc": "AWS 资深首席科学家。每节先讲原理，再现场写代码，看完就能跑。",
  "order": "和深度学习同期：一边看李宏毅的图，一边跟李沐把代码敲出来。"
 }
];
  W.AI_COURSES = {
   "lhy_ml": {
    "id": "lhy_ml",
    "bv": "BV1JA411c7VT",
    "title": "李宏毅《机器学习》2021 春",
    "sub": "台大电机系 · 41 集 · 国语授权版",
    "teacher": "李宏毅（台大电机系）",
    "platform": "B 站搬运（已获授权 · 国语版）",
    "url": "https://www.bilibili.com/video/BV1JA411c7VT/",
    "lang": "中文（台湾普通话）",
    "cost": "免费",
    "length": "41 集 · 约 24.8 小时",
    "why": "中文圈公认的第一门机器学习课：不堆公式，用宝可梦、动漫把梯度下降、CNN、自注意力、Transformer、GAN、强化学习讲成故事。2021 版补齐了 Transformer 与自监督学习，讲法仍是“先给直觉，再给推导”。",
    "how": "一天两集：听完暂停，自己在纸上复述一遍关键图；每章结束用 Colab 做一个小实验。第 2 章“训练不起来怎么办”千万别跳 —— 后面所有模型都建在这套调试直觉上。",
    "chapters": [
     {
      "id": "c1",
      "n": "第1章",
      "name": "机器学习是什么",
      "desc": "课程规定、两个预测案例、任务攻略",
      "from": 1,
      "to": 4
     },
     {
      "id": "c2",
      "n": "第2章",
      "name": "训练不起来怎么办",
      "desc": "局部最小值、批次与动量、学习率、损失函数、BN",
      "from": 5,
      "to": 9
     },
     {
      "id": "c3",
      "n": "第3章",
      "name": "卷积神经网络",
      "desc": "CNN 为什么适合看图",
      "from": 10,
      "to": 10
     },
     {
      "id": "c4",
      "n": "第4章",
      "name": "自注意力与 Transformer",
      "desc": "Self-attention 上下 + Transformer 上下",
      "from": 11,
      "to": 14
     },
     {
      "id": "c5",
      "n": "第5章",
      "name": "生成对抗网络 GAN",
      "desc": "GAN 四讲：从原理到实战",
      "from": 15,
      "to": 18
     },
     {
      "id": "c6",
      "n": "第6章",
      "name": "自监督与自编码器",
      "desc": "BERT、GPT、Auto-encoder",
      "from": 19,
      "to": 24
     },
     {
      "id": "c7",
      "n": "第7章",
      "name": "对抗攻击与可解释性",
      "desc": "Adversarial Attack、Explainable ML、领域自适应",
      "from": 25,
      "to": 29
     },
     {
      "id": "c8",
      "n": "第8章",
      "name": "强化学习",
      "desc": "三个步骤、Policy Gradient、Actor-Critic、逆强化学习",
      "from": 30,
      "to": 34
     },
     {
      "id": "c9",
      "n": "第9章",
      "name": "进阶专题与结语",
      "desc": "终身学习、网络压缩、元学习、课程结语",
      "from": 35,
      "to": 41
     }
    ],
    "pages": [
     {
      "t": "机器学习相关规定",
      "d": 1966,
      "pg": 1,
      "p": 1,
      "ch": "c1"
     },
     {
      "t": "预测本频道观看人数（上） - 机器学习基本概念简介",
      "d": 3000,
      "pg": 2,
      "p": 2,
      "ch": "c1"
     },
     {
      "t": "预测本频道观看人数（下） - 机器学习基本概念简介",
      "d": 3515,
      "pg": 3,
      "p": 3,
      "ch": "c1"
     },
     {
      "t": "机器学习任务攻略",
      "d": 3084,
      "pg": 4,
      "p": 4,
      "ch": "c1"
     },
     {
      "t": "神经网络训练不起来怎么办（1）：局部最小值（：Loacl Minima）与鞍点（Saddle Point）",
      "d": 2025,
      "pg": 5,
      "p": 5,
      "ch": "c2"
     },
     {
      "t": "神经网络训练不起来怎么办（2）：批次（batch）与动量（Momentum）",
      "d": 1859,
      "pg": 6,
      "p": 6,
      "ch": "c2"
     },
     {
      "t": "神经网络训练不起来怎么办（3）：自动调整学习速率（Learning Rate）",
      "d": 2263,
      "pg": 7,
      "p": 7,
      "ch": "c2"
     },
     {
      "t": "神经网络训练不起来怎么办（4）：损失函数（Loss）也可能有影响",
      "d": 1168,
      "pg": 8,
      "p": 8,
      "ch": "c2"
     },
     {
      "t": "神经网络训练不起来怎么办（5）：批次标准化（Batch Normalization）简介",
      "d": 1856,
      "pg": 9,
      "p": 9,
      "ch": "c2"
     },
     {
      "t": "卷积神经网络 (Convolutional Neural Networks, CNN)",
      "d": 3340,
      "pg": 10,
      "p": 10,
      "ch": "c3"
     },
     {
      "t": "自注意力机制 (Self-attention) (上)",
      "d": 1698,
      "pg": 11,
      "p": 11,
      "ch": "c4"
     },
     {
      "t": "自注意力机制 (Self-attention) (下)",
      "d": 2758,
      "pg": 12,
      "p": 12,
      "ch": "c4"
     },
     {
      "t": "Transformer (上)",
      "d": 1968,
      "pg": 13,
      "p": 13,
      "ch": "c4"
     },
     {
      "t": "Transformer (下)",
      "d": 3634,
      "pg": 14,
      "p": 14,
      "ch": "c4"
     },
     {
      "t": "生成对抗网络(Generative Adversarial Network, GAN)（一）",
      "d": 2349,
      "pg": 15,
      "p": 15,
      "ch": "c5"
     },
     {
      "t": "生成对抗网络(Generative Adversarial Network, GAN)（二）",
      "d": 2801,
      "pg": 16,
      "p": 16,
      "ch": "c5"
     },
     {
      "t": "生成对抗网络(Generative Adversarial Network, GAN)（三）",
      "d": 2987,
      "pg": 17,
      "p": 17,
      "ch": "c5"
     },
     {
      "t": "生成对抗网络(Generative Adversarial Network, GAN)（四）",
      "d": 1421,
      "pg": 18,
      "p": 18,
      "ch": "c5"
     },
     {
      "t": "自监督学习 (Self-supervised Learning) (一) – 芝麻街与进击的巨人",
      "d": 430,
      "pg": 19,
      "p": 19,
      "ch": "c6"
     },
     {
      "t": "自监督学习 (Self-supervised Learning) (二) – BERT简介",
      "d": 3041,
      "pg": 20,
      "p": 20,
      "ch": "c6"
     },
     {
      "t": "自监督学习 (Self-supervised Learning) (三) – BERT的奇闻轶事",
      "d": 1454,
      "pg": 21,
      "p": 21,
      "ch": "c6"
     },
     {
      "t": "自监督学习 (Self-supervised Learning) (四) – GPT的野望",
      "d": 1024,
      "pg": 22,
      "p": 22,
      "ch": "c6"
     },
     {
      "t": "自编码器 (Auto-encoder) (上) – 基本概念",
      "d": 1141,
      "pg": 23,
      "p": 23,
      "ch": "c6"
     },
     {
      "t": "自编码器 (Auto-encoder) (下) – 领结变声器与更多应用",
      "d": 1835,
      "pg": 24,
      "p": 24,
      "ch": "c6"
     },
     {
      "t": "来自人类的恶意攻击 (Adversarial Attack) (一) – 基本概念",
      "d": 1790,
      "pg": 25,
      "p": 25,
      "ch": "c7"
     },
     {
      "t": "来自人类的恶意攻击 (Adversarial Attack) (二) – 神经网络能否躲过人类深不见底的恶意？",
      "d": 2794,
      "pg": 26,
      "p": 26,
      "ch": "c7"
     },
     {
      "t": "机器学习模型的可解释性 (Explainable ML) (上) – 为什么神经网络可以正确分辨",
      "d": 2949,
      "pg": 27,
      "p": 27,
      "ch": "c7"
     },
     {
      "t": "机器学习模型的可解释性 (Explainable ML) (下) –机器心中的猫长什么样子？",
      "d": 1366,
      "pg": 28,
      "p": 28,
      "ch": "c7"
     },
     {
      "t": "概述领域自适应 (Domain Adaptation)",
      "d": 2073,
      "pg": 29,
      "p": 29,
      "ch": "c7"
     },
     {
      "t": "强化学习 (Reinforcement Learning, RL) (一) – 强化学习跟机器学习一样都是三个步骤",
      "d": 2702,
      "pg": 30,
      "p": 30,
      "ch": "c8"
     },
     {
      "t": "强化学习 (Reinforcement Learning, RL) (二) – Policy Gradient与修课心情",
      "d": 2475,
      "pg": 31,
      "p": 31,
      "ch": "c8"
     },
     {
      "t": "强化学习 (Reinforcement Learning, RL) (三) - Actor-Critic",
      "d": 2081,
      "pg": 32,
      "p": 32,
      "ch": "c8"
     },
     {
      "t": "强化学习 (Reinforcement Learning, RL) (四) - 回馈非常罕见的时候怎么办？机器的望梅止渴",
      "d": 1055,
      "pg": 33,
      "p": 33,
      "ch": "c8"
     },
     {
      "t": "强化学习 (Reinforcement Learning, RL) (五) - 如何从示范中学习？逆向强化学习（Inverse RL）",
      "d": 1628,
      "pg": 34,
      "p": 34,
      "ch": "c8"
     },
     {
      "t": "终身学习 (Life Long Learning, LL) (一) -灾难性遗忘（catastrophic forgetting）",
      "d": 1920,
      "pg": 35,
      "p": 35,
      "ch": "c9"
     },
     {
      "t": "终身学习 (Life Long Learning, LL) (二) - 灾难性遗忘（catastrophic forgetting）的克服之道",
      "d": 2199,
      "pg": 36,
      "p": 36,
      "ch": "c9"
     },
     {
      "t": "神经网络压缩 (Network Compression) (一) - 神经网络剪枝 (Pruning）与大乐透假说",
      "d": 1772,
      "pg": 37,
      "p": 37,
      "ch": "c9"
     },
     {
      "t": "神经网络压缩(Network Compression) (二) - 从各自不同的面向来压缩神经网络",
      "d": 3406,
      "pg": 38,
      "p": 38,
      "ch": "c9"
     },
     {
      "t": "元学习 Meta Learning (一) - 元学习和机器学习一样也是三個步驟",
      "d": 2781,
      "pg": 39,
      "p": 39,
      "ch": "c9"
     },
     {
      "t": "元学习 Meta Learning (二) - 万物皆可 Meta",
      "d": 1897,
      "pg": 40,
      "p": 40,
      "ch": "c9"
     },
     {
      "t": "课程结语 - 最後的業配並改編《為學一首示子姪》作結",
      "d": 1661,
      "pg": 41,
      "p": 41,
      "ch": "c9"
     }
    ]
   },
   "lhy_dl": {
    "id": "lhy_dl",
    "bv": "BV1JE411g7XF",
    "title": "李宏毅《深度学习》2020 完整版",
    "sub": "119 集 · 从反向传播到元学习全讲透",
    "teacher": "李宏毅（台大电机系）",
    "platform": "B 站搬运（完整版）",
    "url": "https://www.bilibili.com/video/BV1JE411g7XF/",
    "lang": "中文讲解 · 英文板书",
    "cost": "免费",
    "length": "119 集 · 约 66.6 小时",
    "why": "他讲得最系统的一版“深度学习全书”：反向传播、训练技巧、CNN、RNN、Transformer、自监督、可解释性、对抗攻击、模型压缩、元学习、终身学习、强化学习，一门课打通。标“选学”的是加餐。",
    "how": "按章推进，选学的先跳过。四块重点：训练技巧、CNN、注意力、强化学习。每章看完写 200 字总结再往下，比一口气刷完有用得多。",
    "chapters": [
     {
      "id": "c1",
      "n": "第1章",
      "name": "机器学习基础",
      "desc": "机器学习、Rule of ML、回归、梯度下降、分类与逻辑回归",
      "from": 1,
      "to": 11
     },
     {
      "id": "c2",
      "n": "第2章",
      "name": "深度学习入门",
      "desc": "深度学习简介、反向传播、训练技巧、为什么深、PyTorch",
      "from": 12,
      "to": 16
     },
     {
      "id": "c3",
      "n": "第3章",
      "name": "CNN 与图神经网络",
      "desc": "卷积神经网络、GNN 选学",
      "from": 17,
      "to": 19
     },
     {
      "id": "c4",
      "n": "第4章",
      "name": "RNN 与半监督",
      "desc": "循环神经网络、半监督、词嵌入",
      "from": 20,
      "to": 23
     },
     {
      "id": "c5",
      "n": "第5章",
      "name": "可解释性",
      "desc": "Explainable ML 八讲 + 加餐",
      "from": 24,
      "to": 32
     },
     {
      "id": "c6",
      "n": "第6章",
      "name": "对抗攻击",
      "desc": "Attack ML Models 八讲 + 加餐",
      "from": 33,
      "to": 42
     },
     {
      "id": "c7",
      "n": "第7章",
      "name": "模型压缩",
      "desc": "剪枝、知识蒸馏",
      "from": 43,
      "to": 50
     },
     {
      "id": "c8",
      "n": "第8章",
      "name": "序列生成与 Transformer",
      "desc": "RNN+Attention 生成、Pointer Network、Transformer",
      "from": 51,
      "to": 55
     },
     {
      "id": "c9",
      "n": "第9章",
      "name": "无监督学习",
      "desc": "线性方法、邻域嵌入、自编码器、BERT/GPT",
      "from": 56,
      "to": 64
     },
     {
      "id": "c10",
      "n": "第10章",
      "name": "异常检测",
      "desc": "Anomaly Detection 七讲 + 加餐",
      "from": 65,
      "to": 71
     },
     {
      "id": "c11",
      "n": "第11章",
      "name": "生成对抗网络",
      "desc": "GAN 十讲 + 变体",
      "from": 72,
      "to": 82
     },
     {
      "id": "c12",
      "n": "第12章",
      "name": "迁移与领域自适应",
      "desc": "Transfer Learning、Domain Adaptation",
      "from": 83,
      "to": 85
     },
     {
      "id": "c13",
      "n": "第13章",
      "name": "元学习",
      "desc": "MAML 九讲、Gradient Descent as LSTM",
      "from": 86,
      "to": 99
     },
     {
      "id": "c14",
      "n": "第14章",
      "name": "终身学习",
      "desc": "灾难性遗忘与解法",
      "from": 100,
      "to": 107
     },
     {
      "id": "c15",
      "n": "第15章",
      "name": "强化学习",
      "desc": "DRL、Policy Gradient、PPO、Q-Learning、Actor-Critic、模仿学习",
      "from": 108,
      "to": 119
     }
    ],
    "pages": [
     {
      "t": "机器学习",
      "d": 2228,
      "pg": 1,
      "p": 1,
      "ch": "c1"
     },
     {
      "t": "Rule of ML 2020",
      "d": 1324,
      "pg": 2,
      "p": 2,
      "ch": "c1"
     },
     {
      "t": "Regression - Case Study",
      "d": 4715,
      "pg": 3,
      "p": 3,
      "ch": "c1"
     },
     {
      "t": "Basic Concept",
      "d": 2594,
      "pg": 4,
      "p": 4,
      "ch": "c1"
     },
     {
      "t": "Gradient Descent_1",
      "d": 3712,
      "pg": 5,
      "p": 5,
      "ch": "c1"
     },
     {
      "t": "Gradient Descent_2",
      "d": 156,
      "pg": 6,
      "p": 6,
      "ch": "c1"
     },
     {
      "t": "Gradient Descent_3",
      "d": 101,
      "pg": 7,
      "p": 7,
      "ch": "c1"
     },
     {
      "t": "Optimization for Deep Learning (1_2) (选学)",
      "d": 3276,
      "pg": 8,
      "p": 8,
      "ch": "c1"
     },
     {
      "t": "Optimization for Deep Learning (2_2) (选学)",
      "d": 3272,
      "pg": 9,
      "p": 9,
      "ch": "c1"
     },
     {
      "t": "Classification_1",
      "d": 4181,
      "pg": 10,
      "p": 10,
      "ch": "c1"
     },
     {
      "t": "Logistic Regression",
      "d": 4033,
      "pg": 11,
      "p": 11,
      "ch": "c1"
     },
     {
      "t": "Brief Introduction of Deep Learning",
      "d": 2790,
      "pg": 12,
      "p": 12,
      "ch": "c2"
     },
     {
      "t": "Backpropagation",
      "d": 1886,
      "pg": 13,
      "p": 13,
      "ch": "c2"
     },
     {
      "t": "Tips for Training DNN",
      "d": 5162,
      "pg": 14,
      "p": 14,
      "ch": "c2"
     },
     {
      "t": "Why Deep",
      "d": 3465,
      "pg": 15,
      "p": 15,
      "ch": "c2"
     },
     {
      "t": "PyTorch Tutorial",
      "d": 3159,
      "pg": 16,
      "p": 16,
      "ch": "c2"
     },
     {
      "t": "Convolutional Neural Network",
      "d": 4769,
      "pg": 17,
      "p": 17,
      "ch": "c3"
     },
     {
      "t": "Graph Neural Network (1_2) (选学)",
      "d": 2342,
      "pg": 18,
      "p": 18,
      "ch": "c3"
     },
     {
      "t": "Graph Neural Network (2_2) (选学)",
      "d": 4297,
      "pg": 19,
      "p": 19,
      "ch": "c3"
     },
     {
      "t": "Recurrent Neural Network (Part I)",
      "d": 2940,
      "pg": 20,
      "p": 20,
      "ch": "c4"
     },
     {
      "t": "Recurrent Neural Network (Part II)",
      "d": 5450,
      "pg": 21,
      "p": 21,
      "ch": "c4"
     },
     {
      "t": "Semi-supervised",
      "d": 3599,
      "pg": 22,
      "p": 22,
      "ch": "c4"
     },
     {
      "t": "Unsupervised Learning - Word Embedding",
      "d": 2439,
      "pg": 23,
      "p": 23,
      "ch": "c4"
     },
     {
      "t": "Explainable ML (1_8)",
      "d": 831,
      "pg": 24,
      "p": 24,
      "ch": "c5"
     },
     {
      "t": "Explainable ML (2_8)",
      "d": 848,
      "pg": 25,
      "p": 25,
      "ch": "c5"
     },
     {
      "t": "Explainable ML (3_8)",
      "d": 368,
      "pg": 26,
      "p": 26,
      "ch": "c5"
     },
     {
      "t": "Explainable ML (4_8)",
      "d": 436,
      "pg": 27,
      "p": 27,
      "ch": "c5"
     },
     {
      "t": "Explainable ML (5_8)",
      "d": 493,
      "pg": 28,
      "p": 28,
      "ch": "c5"
     },
     {
      "t": "Explainable ML (6_8)",
      "d": 447,
      "pg": 29,
      "p": 29,
      "ch": "c5"
     },
     {
      "t": "Explainable ML (7_8)",
      "d": 483,
      "pg": 30,
      "p": 30,
      "ch": "c5"
     },
     {
      "t": "Explainable ML (8_8)",
      "d": 437,
      "pg": 31,
      "p": 31,
      "ch": "c5"
     },
     {
      "t": "More about Explainable AI (选学)",
      "d": 6269,
      "pg": 32,
      "p": 32,
      "ch": "c5"
     },
     {
      "t": "Attack ML Models (1_8)",
      "d": 366,
      "pg": 33,
      "p": 33,
      "ch": "c6"
     },
     {
      "t": "Attack ML Models (2_8)",
      "d": 703,
      "pg": 34,
      "p": 34,
      "ch": "c6"
     },
     {
      "t": "Attack ML Models (3_8)",
      "d": 423,
      "pg": 35,
      "p": 35,
      "ch": "c6"
     },
     {
      "t": "Attack ML Models (4_8)",
      "d": 492,
      "pg": 36,
      "p": 36,
      "ch": "c6"
     },
     {
      "t": "Attack ML Models (5_8)",
      "d": 399,
      "pg": 37,
      "p": 37,
      "ch": "c6"
     },
     {
      "t": "Attack ML Models (6_8)",
      "d": 567,
      "pg": 38,
      "p": 38,
      "ch": "c6"
     },
     {
      "t": "Attack ML Models (7_8)",
      "d": 484,
      "pg": 39,
      "p": 39,
      "ch": "c6"
     },
     {
      "t": "Attack ML Models (8_8)",
      "d": 611,
      "pg": 40,
      "p": 40,
      "ch": "c6"
     },
     {
      "t": "More about Adversarial Attack (1_2) (选学)",
      "d": 1798,
      "pg": 41,
      "p": 41,
      "ch": "c6"
     },
     {
      "t": "More about Adversarial Attack (2_2) (选学)",
      "d": 1785,
      "pg": 42,
      "p": 42,
      "ch": "c6"
     },
     {
      "t": "Network Compression (1_6)",
      "d": 504,
      "pg": 43,
      "p": 43,
      "ch": "c7"
     },
     {
      "t": "Network Compression (2_6)",
      "d": 764,
      "pg": 44,
      "p": 44,
      "ch": "c7"
     },
     {
      "t": "Network Compression (3_6)",
      "d": 513,
      "pg": 45,
      "p": 45,
      "ch": "c7"
     },
     {
      "t": "Network Compression (4_6)",
      "d": 397,
      "pg": 46,
      "p": 46,
      "ch": "c7"
     },
     {
      "t": "Network Compression (5_6)",
      "d": 713,
      "pg": 47,
      "p": 47,
      "ch": "c7"
     },
     {
      "t": "Network Compression (6_6)",
      "d": 789,
      "pg": 48,
      "p": 48,
      "ch": "c7"
     },
     {
      "t": "Network Compression (1_2) - Knowledge Distillation (选学)",
      "d": 4073,
      "pg": 49,
      "p": 49,
      "ch": "c7"
     },
     {
      "t": "Network Compression (2_2) - Network Pruning (选学)",
      "d": 2373,
      "pg": 50,
      "p": 50,
      "ch": "c7"
     },
     {
      "t": "Conditional Generation by RNN & Attention",
      "d": 6074,
      "pg": 51,
      "p": 51,
      "ch": "c8"
     },
     {
      "t": "Pointer Network",
      "d": 814,
      "pg": 52,
      "p": 52,
      "ch": "c8"
     },
     {
      "t": "Recursive",
      "d": 1498,
      "pg": 53,
      "p": 53,
      "ch": "c8"
     },
     {
      "t": "Transformer",
      "d": 2972,
      "pg": 54,
      "p": 54,
      "ch": "c8"
     },
     {
      "t": "Transformer and its variant (选学)",
      "d": 6563,
      "pg": 55,
      "p": 55,
      "ch": "c8"
     },
     {
      "t": "Unsupervised Learning - Linear Methods",
      "d": 6020,
      "pg": 56,
      "p": 56,
      "ch": "c9"
     },
     {
      "t": "Unsupervised Learning - Neighbor Embedding",
      "d": 1858,
      "pg": 57,
      "p": 57,
      "ch": "c9"
     },
     {
      "t": "Unsupervised Learning - Auto-encoder",
      "d": 2524,
      "pg": 58,
      "p": 58,
      "ch": "c9"
     },
     {
      "t": "More about Auto-encoder (1_4)",
      "d": 819,
      "pg": 59,
      "p": 59,
      "ch": "c9"
     },
     {
      "t": "More about Auto-encoder (2_4)",
      "d": 372,
      "pg": 60,
      "p": 60,
      "ch": "c9"
     },
     {
      "t": "More about Auto-encoder (3_4)",
      "d": 749,
      "pg": 61,
      "p": 61,
      "ch": "c9"
     },
     {
      "t": "More about Auto-encoder (4_4)",
      "d": 892,
      "pg": 62,
      "p": 62,
      "ch": "c9"
     },
     {
      "t": "ELMO, BERT, GPT",
      "d": 3892,
      "pg": 63,
      "p": 63,
      "ch": "c9"
     },
     {
      "t": "Self-supervised Learning (选学)",
      "d": 2437,
      "pg": 64,
      "p": 64,
      "ch": "c9"
     },
     {
      "t": "Anomaly Detection (1_7)",
      "d": 803,
      "pg": 65,
      "p": 65,
      "ch": "c10"
     },
     {
      "t": "Anomaly Detection (2_7)",
      "d": 850,
      "pg": 66,
      "p": 66,
      "ch": "c10"
     },
     {
      "t": "Anomaly Detection (3_7)",
      "d": 845,
      "pg": 67,
      "p": 67,
      "ch": "c10"
     },
     {
      "t": "Anomaly Detection (4_7)",
      "d": 248,
      "pg": 68,
      "p": 68,
      "ch": "c10"
     },
     {
      "t": "Anomaly Detection (6_7)",
      "d": 740,
      "pg": 69,
      "p": 69,
      "ch": "c10"
     },
     {
      "t": "Anomaly Detection (7_7)",
      "d": 362,
      "pg": 70,
      "p": 70,
      "ch": "c10"
     },
     {
      "t": "More about Anomaly Detection (选学)",
      "d": 2812,
      "pg": 71,
      "p": 71,
      "ch": "c10"
     },
     {
      "t": "Generative Adversarial Network(1_10)",
      "d": 5595,
      "pg": 72,
      "p": 72,
      "ch": "c11"
     },
     {
      "t": "Generative Adversarial Network(2_10)",
      "d": 1579,
      "pg": 73,
      "p": 73,
      "ch": "c11"
     },
     {
      "t": "Generative Adversarial Network(3_10)",
      "d": 2339,
      "pg": 74,
      "p": 74,
      "ch": "c11"
     },
     {
      "t": "Generative Adversarial Network(4_10)",
      "d": 4819,
      "pg": 75,
      "p": 75,
      "ch": "c11"
     },
     {
      "t": "Generative Adversarial Network(5_10)",
      "d": 1504,
      "pg": 76,
      "p": 76,
      "ch": "c11"
     },
     {
      "t": "Generative Adversarial Network(6_10)",
      "d": 3007,
      "pg": 77,
      "p": 77,
      "ch": "c11"
     },
     {
      "t": "Generative Adversarial Network(7_10)",
      "d": 2763,
      "pg": 78,
      "p": 78,
      "ch": "c11"
     },
     {
      "t": "Generative Adversarial Network(8_10)",
      "d": 1366,
      "pg": 79,
      "p": 79,
      "ch": "c11"
     },
     {
      "t": "Generative Adversarial Network(9_10)",
      "d": 5243,
      "pg": 80,
      "p": 80,
      "ch": "c11"
     },
     {
      "t": "Generative Adversarial Network(10_10)",
      "d": 1809,
      "pg": 81,
      "p": 81,
      "ch": "c11"
     },
     {
      "t": "SAGAN, BigGAN, SinGAN, GauGAN, GANILLA, NICE-GAN（选学）",
      "d": 3977,
      "pg": 82,
      "p": 82,
      "ch": "c11"
     },
     {
      "t": "Transfer Learning",
      "d": 4468,
      "pg": 83,
      "p": 83,
      "ch": "c12"
     },
     {
      "t": "More about Domain Adaptation (1_2) (选学)",
      "d": 3121,
      "pg": 84,
      "p": 84,
      "ch": "c12"
     },
     {
      "t": "More about Domain Adaptation (2_2) (选学)",
      "d": 2051,
      "pg": 85,
      "p": 85,
      "ch": "c12"
     },
     {
      "t": "Meta Learning – MAML (1_9)",
      "d": 462,
      "pg": 86,
      "p": 86,
      "ch": "c13"
     },
     {
      "t": "Meta Learning – MAML (2_9)",
      "d": 473,
      "pg": 87,
      "p": 87,
      "ch": "c13"
     },
     {
      "t": "Meta Learning – MAML (3_9)",
      "d": 621,
      "pg": 88,
      "p": 88,
      "ch": "c13"
     },
     {
      "t": "Meta Learning – MAML (4_9)",
      "d": 315,
      "pg": 89,
      "p": 89,
      "ch": "c13"
     },
     {
      "t": "Meta Learning – MAML (5_9)",
      "d": 802,
      "pg": 90,
      "p": 90,
      "ch": "c13"
     },
     {
      "t": "Meta Learning – MAML (6_9)",
      "d": 393,
      "pg": 91,
      "p": 91,
      "ch": "c13"
     },
     {
      "t": "Meta Learning – MAML (7_9)",
      "d": 534,
      "pg": 92,
      "p": 92,
      "ch": "c13"
     },
     {
      "t": "Meta Learning – MAML (8_9)",
      "d": 312,
      "pg": 93,
      "p": 93,
      "ch": "c13"
     },
     {
      "t": "Meta Learning – MAML (9_9)",
      "d": 413,
      "pg": 94,
      "p": 94,
      "ch": "c13"
     },
     {
      "t": "Meta Learning - Gradient Descent as LSTM (1_3)",
      "d": 700,
      "pg": 95,
      "p": 95,
      "ch": "c13"
     },
     {
      "t": "Meta Learning - Gradient Descent as LSTM (2_3)",
      "d": 606,
      "pg": 96,
      "p": 96,
      "ch": "c13"
     },
     {
      "t": "Meta Learning - Gradient Descent as LSTM (3_3)",
      "d": 639,
      "pg": 97,
      "p": 97,
      "ch": "c13"
     },
     {
      "t": "More about Meta Learning (选学)",
      "d": 2650,
      "pg": 98,
      "p": 98,
      "ch": "c13"
     },
     {
      "t": "More about Meta Learning (选学)",
      "d": 3191,
      "pg": 99,
      "p": 99,
      "ch": "c13"
     },
     {
      "t": "Life Long Learning (1_7)",
      "d": 831,
      "pg": 100,
      "p": 100,
      "ch": "c14"
     },
     {
      "t": "Life Long Learning (2_7)",
      "d": 445,
      "pg": 101,
      "p": 101,
      "ch": "c14"
     },
     {
      "t": "Life Long Learning (3_7)",
      "d": 724,
      "pg": 102,
      "p": 102,
      "ch": "c14"
     },
     {
      "t": "Life Long Learning (4_7)",
      "d": 280,
      "pg": 103,
      "p": 103,
      "ch": "c14"
     },
     {
      "t": "Life Long Learning (5_7)",
      "d": 200,
      "pg": 104,
      "p": 104,
      "ch": "c14"
     },
     {
      "t": "Life Long Learning (6_7)",
      "d": 855,
      "pg": 105,
      "p": 105,
      "ch": "c14"
     },
     {
      "t": "Life Long Learning (7_7)",
      "d": 695,
      "pg": 106,
      "p": 106,
      "ch": "c14"
     },
     {
      "t": "More about Lifelong Learning (选学)",
      "d": 3468,
      "pg": 107,
      "p": 107,
      "ch": "c14"
     },
     {
      "t": "Deep Reinforcemen Learning(3_1)",
      "d": 3982,
      "pg": 108,
      "p": 108,
      "ch": "c15"
     },
     {
      "t": "Deep Reinforcemen Learning(3_2)",
      "d": 800,
      "pg": 109,
      "p": 109,
      "ch": "c15"
     },
     {
      "t": "Deep Reinforcemen Learning(3_3)",
      "d": 3934,
      "pg": 110,
      "p": 110,
      "ch": "c15"
     },
     {
      "t": "RL Advanced Version_1_Policy Gradient",
      "d": 2749,
      "pg": 111,
      "p": 111,
      "ch": "c15"
     },
     {
      "t": "RL Advanced Version_2_ Proximal Policy Optimization",
      "d": 2494,
      "pg": 112,
      "p": 112,
      "ch": "c15"
     },
     {
      "t": "RL Advanced Version_3_Q-Learning",
      "d": 2984,
      "pg": 113,
      "p": 113,
      "ch": "c15"
     },
     {
      "t": "RL Advanced Version_4_Q-Learning Advanced Tips",
      "d": 2311,
      "pg": 114,
      "p": 114,
      "ch": "c15"
     },
     {
      "t": "RL Advanced Version_5_Q-Learning Continuous Action",
      "d": 898,
      "pg": 115,
      "p": 115,
      "ch": "c15"
     },
     {
      "t": "RL Advanced Version_6_Actor-Critic",
      "d": 2056,
      "pg": 116,
      "p": 116,
      "ch": "c15"
     },
     {
      "t": "RL Advanced Version_7_Sparse Reward",
      "d": 1816,
      "pg": 117,
      "p": 117,
      "ch": "c15"
     },
     {
      "t": "RL Advanced Version_8_Imitation Learning",
      "d": 2042,
      "pg": 118,
      "p": 118,
      "ch": "c15"
     },
     {
      "t": "RL - Model-based, Large-scale, Meta, Multi-agent, Hide-and-seek, Alpha（选学）",
      "d": 6125,
      "pg": 119,
      "p": 119,
      "ch": "c15"
     }
    ]
   },
   "lhy_llm": {
    "id": "lhy_llm",
    "bv": "BV1aiADewEBC",
    "title": "李宏毅《大模型》2025",
    "sub": "27 集 · 全部围绕大模型与 AI Agent",
    "teacher": "李宏毅（台大电机系）",
    "platform": "B 站（已获授权）",
    "url": "https://www.bilibili.com/video/BV1aiADewEBC/",
    "lang": "中文（台湾普通话）",
    "cost": "免费",
    "length": "27 集 · 约 22.0 小时",
    "why": "2025 版不讲传统机器学习，整门课就是大模型：AI Agent 怎么规划与用工具、语言模型内部机制、Transformer 的竞争架构、预训练-对齐、Post-Training 与遗忘、DeepSeek-R1 式推理、评估、Model Editing 与 Model Merging。想搞懂现在这些模型在干什么，这一版最新也最直接。",
    "how": "先看第 1 讲建立全局，然后“讲 → 作业”交替：每讲配一个 Colab 作业，不跟着做一周就忘。第 3、5、7 讲（内部机制、预训练对齐、推理模型）值得各看两遍。",
    "chapters": [
     {
      "id": "c1",
      "n": "第1章",
      "name": "生成式 AI 与 AI Agent",
      "desc": "技术突破全景、Colab/PyTorch/JudgeBoi 教程、HW1-HW2",
      "from": 1,
      "to": 7
     },
     {
      "id": "c2",
      "n": "第2章",
      "name": "模型内部机制与架构之争",
      "desc": "语言模型脑科学、Transformer 的竞争者们、HW3-HW4",
      "from": 8,
      "to": 11
     },
     {
      "id": "c3",
      "n": "第3章",
      "name": "预训练、对齐与后训练",
      "desc": "Pretrain-Alignment、多 GPU 训练、Post-Training、遗忘问题",
      "from": 12,
      "to": 17
     },
     {
      "id": "c4",
      "n": "第4章",
      "name": "推理、评估与编辑",
      "desc": "DeepSeek-R1 深度思考、推理长度、评估、Model Editing、RLHF",
      "from": 18,
      "to": 23
     },
     {
      "id": "c5",
      "n": "第5章",
      "name": "模型融合",
      "desc": "Task Vector 与 Model Merging",
      "from": 24,
      "to": 25
     },
     {
      "id": "c6",
      "n": "第6章",
      "name": "语音语言模型",
      "desc": "语言模型如何学会说话、HW10 Diffusion",
      "from": 26,
      "to": 27
     }
    ],
    "pages": [
     {
      "t": "第一讲：一堂课搞懂生成式人工智能的技术突破与未來发展",
      "d": 5061,
      "pg": 1,
      "p": 1,
      "ch": "c1"
     },
     {
      "t": "Colab_Kaggle教程",
      "d": 1692,
      "pg": 2,
      "p": 2,
      "ch": "c1"
     },
     {
      "t": "PyTorch教程",
      "d": 2448,
      "pg": 3,
      "p": 3,
      "ch": "c1"
     },
     {
      "t": "JudgeBoi指南",
      "d": 396,
      "pg": 4,
      "p": 4,
      "ch": "c1"
     },
     {
      "t": "HW1 - Retrieval Augmented Generation with Agentic System",
      "d": 1519,
      "pg": 5,
      "p": 5,
      "ch": "c1"
     },
     {
      "t": "第二讲：一堂课搞懂 AI Agent 的原理（AI如何跨越行为调整、使用工具和做计划）",
      "d": 6120,
      "pg": 6,
      "p": 6,
      "ch": "c1"
     },
     {
      "t": "HW2 - AI Agent2",
      "d": 2826,
      "pg": 7,
      "p": 7,
      "ch": "c1"
     },
     {
      "t": "第三讲：AI 的脑科学 — 语言模型内部运作机制剖析 (解析单一神经元到整群神经元的运作机制、如何让语言模型说出自己的内心世界)",
      "d": 6592,
      "pg": 8,
      "p": 8,
      "ch": "c2"
     },
     {
      "t": "HW3 - Understanding transformers",
      "d": 1635,
      "pg": 9,
      "p": 9,
      "ch": "c2"
     },
     {
      "t": "第四讲：Transformer 的时代要结束了吗？介绍 Transformer 的竞争者们",
      "d": 4962,
      "pg": 10,
      "p": 10,
      "ch": "c2"
     },
     {
      "t": "HW4 - Training Transformer",
      "d": 917,
      "pg": 11,
      "p": 11,
      "ch": "c2"
     },
     {
      "t": "第五讲：大型语言模型训练方法「预训练–对齐」(Pretrain-Alignment) 的強大与极限",
      "d": 4795,
      "pg": 12,
      "p": 12,
      "ch": "c3"
     },
     {
      "t": "助教课：利用多张GPU训练大型语言模型—从零开始介绍DeepSpeed、Liger Kernel、Flash Attension",
      "d": 3296,
      "pg": 13,
      "p": 13,
      "ch": "c3"
     },
     {
      "t": "HW5 - Finetuning is Powerful",
      "d": 2140,
      "pg": 14,
      "p": 14,
      "ch": "c3"
     },
     {
      "t": "第六讲：生成式人工智能的后训练(Post-Training)与遗忘问题",
      "d": 4532,
      "pg": 15,
      "p": 15,
      "ch": "c3"
     },
     {
      "t": "HW6 - Fine-tuning  Leads to Forgetting",
      "d": 3177,
      "pg": 16,
      "p": 16,
      "ch": "c3"
     },
     {
      "t": "HW6 - Hugging Face Llama Model Download Guidance",
      "d": 384,
      "pg": 17,
      "p": 17,
      "ch": "c3"
     },
     {
      "t": "第七讲：DeepSeek-R1 这类大型语言模型是如何进行「深度思考」（Reasoning）的？",
      "d": 4710,
      "pg": 18,
      "p": 18,
      "ch": "c4"
     },
     {
      "t": "第八讲：大型语言模型的推理过程不用太长、够用就好",
      "d": 1462,
      "pg": 19,
      "p": 19,
      "ch": "c4"
     },
     {
      "t": "第九讲：你这么忍这个评分系统干什么啊？谈谈有关大型语言模型评估的几件事",
      "d": 1443,
      "pg": 20,
      "p": 20,
      "ch": "c4"
     },
     {
      "t": "第十讲：人工智慧的微创手术 — 浅谈 Model Editing",
      "d": 2696,
      "pg": 21,
      "p": 21,
      "ch": "c4"
     },
     {
      "t": "HW7 - RLHF",
      "d": 1152,
      "pg": 22,
      "p": 22,
      "ch": "c4"
     },
     {
      "t": "HW8 -  Model Editing",
      "d": 2524,
      "pg": 23,
      "p": 23,
      "ch": "c4"
     },
     {
      "t": "第十一讲：今天你想为 Foundation Model 装备哪些 Task Vector？浅谈神奇的 Model Merging 技术",
      "d": 2060,
      "pg": 24,
      "p": 24,
      "ch": "c5"
     },
     {
      "t": "HW9 - Model Merging",
      "d": 3060,
      "pg": 25,
      "p": 25,
      "ch": "c5"
     },
     {
      "t": "第十二讲：语言模型如何学会说话 — 概述语音语言模型发展历程",
      "d": 5479,
      "pg": 26,
      "p": 26,
      "ch": "c6"
     },
     {
      "t": "HW10 - Diffusion",
      "d": 2160,
      "pg": 27,
      "p": 27,
      "ch": "c6"
     }
    ]
   },
   "lhy_gen": {
    "id": "lhy_gen",
    "bv": "BV1BJ4m1e7g8",
    "title": "李宏毅《生成式 AI 导论》2024 春",
    "sub": "42 集 · 零基础也能听懂的生成式 AI",
    "teacher": "李宏毅（台大电机系）",
    "platform": "B 站搬运（已获授权）",
    "url": "https://www.bilibili.com/video/BV1BJ4m1e7g8/",
    "lang": "中文（台湾普通话）",
    "cost": "免费",
    "length": "42 集 · 约 26.5 小时",
    "why": "从“生成式 AI 是什么”讲到 prompt、微调、RLHF、Agent、评估、安全、图像生成（VAE/GAN/Diffusion）。不需要机器学习基础，是想弄明白 ChatGPT 这类产品怎么来的最快路径，作业就是拿 AI 做个小应用。",
    "how": "第 0-5 讲必看（建立直觉），第 6-9 讲边看边动手，第 12 讲之后的评估与安全至少过一遍。延申课按兴趣挑，图像生成那两讲配合 Diffusion 延申一起看。",
    "chapters": [
     {
      "id": "c1",
      "n": "第1章",
      "name": "生成式 AI 是什么",
      "desc": "课程说明、真假难辨的世界、80 分钟速通 LLM",
      "from": 1,
      "to": 4
     },
     {
      "id": "c2",
      "n": "第2章",
      "name": "怎么用好 AI",
      "desc": "从工具到工具人、训练你自己上中下、用工具 AI、作业二到三",
      "from": 5,
      "to": 11
     },
     {
      "id": "c3",
      "n": "第3章",
      "name": "语言模型修炼史（上）",
      "desc": "第一阶段自我学习、可解释性延申、作业四",
      "from": 12,
      "to": 15
     },
     {
      "id": "c4",
      "n": "第4章",
      "name": "微调与人类偏好",
      "desc": "第二三阶段、LLM 微调、RLHF、AI Agent",
      "from": 16,
      "to": 20
     },
     {
      "id": "c5",
      "n": "第5章",
      "name": "Transformer 与可解释性",
      "desc": "文字接龙、模型在想什么、Transformer 延申",
      "from": 21,
      "to": 27
     },
     {
      "id": "c6",
      "n": "第6章",
      "name": "评估与安全",
      "desc": "评估方式、安全议题上下、生成策略、投机解码",
      "from": 28,
      "to": 34
     },
     {
      "id": "c7",
      "n": "第7章",
      "name": "图像的生成式 AI",
      "desc": "Sora 原理、VAE/GAN/Flow/Diffusion 延申、Stable Diffusion 作业",
      "from": 35,
      "to": 41
     },
     {
      "id": "c8",
      "n": "第8章",
      "name": "额外课程",
      "desc": "GPT-4o",
      "from": 42,
      "to": 42
     }
    ],
    "pages": [
     {
      "t": "第0讲：课程说明",
      "d": 1540,
      "pg": 1,
      "p": 1,
      "ch": "c1"
     },
     {
      "t": "第1讲：生成式AI是什么",
      "d": 1769,
      "pg": 2,
      "p": 2,
      "ch": "c1"
     },
     {
      "t": "（延申）80分钟快速了解大型语言模型",
      "d": 5530,
      "pg": 3,
      "p": 3,
      "ch": "c1"
     },
     {
      "t": "作业 1：真假难辨的世界",
      "d": 1157,
      "pg": 4,
      "p": 4,
      "ch": "c1"
     },
     {
      "t": "第2讲：今日的生成式人工智能厉害在哪里？从「工具」变为「工具人」",
      "d": 1566,
      "pg": 5,
      "p": 5,
      "ch": "c2"
     },
     {
      "t": "第3讲：训练不了人工智能？你可以训练你自己（上）",
      "d": 2075,
      "pg": 6,
      "p": 6,
      "ch": "c2"
     },
     {
      "t": "作业2：都是 AI 的作文比赛",
      "d": 2037,
      "pg": 7,
      "p": 7,
      "ch": "c2"
     },
     {
      "t": "第4讲：训练不了人工智能？你可以训练你自己（中）",
      "d": 2842,
      "pg": 8,
      "p": 8,
      "ch": "c2"
     },
     {
      "t": "（延申）能够使用工具的AI：New Bing, WebGPT, Toolformer",
      "d": 1463,
      "pg": 9,
      "p": 9,
      "ch": "c2"
     },
     {
      "t": "作业3：以 AI 搭建自己的应用",
      "d": 3156,
      "pg": 10,
      "p": 10,
      "ch": "c2"
     },
     {
      "t": "第5讲：训练不了人工智能？你可以训练你自己（下）",
      "d": 1521,
      "pg": 11,
      "p": 11,
      "ch": "c2"
     },
     {
      "t": "第6讲：大型语言模型修炼史 — 第一阶段- 自我学习，累积实力",
      "d": 2066,
      "pg": 12,
      "p": 12,
      "ch": "c3"
     },
     {
      "t": "(延申)让 AI 村民组成虚拟村庄会发生什么事",
      "d": 1414,
      "pg": 13,
      "p": 13,
      "ch": "c3"
     },
     {
      "t": "(延申)机器学习模型的可解释性 (Explainable ML) (上) – 为什么类神经网络可以正确分辨宝可梦和数码宝贝呢",
      "d": 2948,
      "pg": 14,
      "p": 14,
      "ch": "c3"
     },
     {
      "t": "作业四：Become an AI Hypnosis Master",
      "d": 3217,
      "pg": 15,
      "p": 15,
      "ch": "c3"
     },
     {
      "t": "第7讲：大型语言模型修炼史 — 第二阶段_ 名师指点，发挥潜力 (兼谈对ChatGPT 做逆向工程与LLaMA 时代的开始)",
      "d": 2299,
      "pg": 16,
      "p": 16,
      "ch": "c4"
     },
     {
      "t": "作业五：LLM Fine-tuning",
      "d": 3044,
      "pg": 17,
      "p": 17,
      "ch": "c4"
     },
     {
      "t": "第8讲：大型语言模型修炼史 — 第三阶段- 参与实战，打磨技巧 (Reinforcement Learning from Human Feedback, RLH",
      "d": 2219,
      "pg": 18,
      "p": 18,
      "ch": "c4"
     },
     {
      "t": "第9讲：以大型语言模型打造的AI Agent",
      "d": 1486,
      "pg": 19,
      "p": 19,
      "ch": "c4"
     },
     {
      "t": "作业六：Learning from Human Preferences",
      "d": 2325,
      "pg": 20,
      "p": 20,
      "ch": "c4"
     },
     {
      "t": "第10讲：今日的语言模型是如何做文字接龙的 — 浅谈Transformer 已经熟悉 Transformer 的同学可跳过)",
      "d": 2296,
      "pg": 21,
      "p": 21,
      "ch": "c5"
     },
     {
      "t": "第11讲：大型语言模型在「想」什么呢？ — 浅谈大型语言模型的可解释性",
      "d": 2716,
      "pg": 22,
      "p": 22,
      "ch": "c5"
     },
     {
      "t": "（延申）Transformer (上)",
      "d": 1968,
      "pg": 23,
      "p": 23,
      "ch": "c5"
     },
     {
      "t": "（延申）Transformer (下)",
      "d": 3634,
      "pg": 24,
      "p": 24,
      "ch": "c5"
     },
     {
      "t": "（延申）用语言模型來解释语言模型 (上)",
      "d": 1301,
      "pg": 25,
      "p": 25,
      "ch": "c5"
     },
     {
      "t": "（延申）用语言模型來解释语言模型 (下)",
      "d": 837,
      "pg": 26,
      "p": 26,
      "ch": "c5"
     },
     {
      "t": "作业七：Understanding what AI is thinking",
      "d": 673,
      "pg": 27,
      "p": 27,
      "ch": "c5"
     },
     {
      "t": "第12讲：浅谈评估大型语言模型能力的各种方式",
      "d": 2772,
      "pg": 28,
      "p": 28,
      "ch": "c6"
     },
     {
      "t": "第13讲：浅谈大型语言模型相关的安全性议题 (上) — 亡羊补牢、语言模型的偏见、有多少人用 ChatGPT 写论文审查意见",
      "d": 1924,
      "pg": 29,
      "p": 29,
      "ch": "c6"
     },
     {
      "t": "作业八：Safety Issue of Generative AI",
      "d": 2215,
      "pg": 30,
      "p": 30,
      "ch": "c6"
     },
     {
      "t": "第14讲：浅谈大型语言模型相关的安全性议题 (下) — 欺骗大型语言模型",
      "d": 933,
      "pg": 31,
      "p": 31,
      "ch": "c6"
     },
     {
      "t": "第15讲：为什么语言模型用文字接龙，图片生成不用像素接龙呢？— 浅谈生成式人工智能的生成策略",
      "d": 2727,
      "pg": 32,
      "p": 32,
      "ch": "c6"
     },
     {
      "t": "第16讲：可以加速所有语言模型生成速度的神奇外挂 — Speculative Decoding",
      "d": 762,
      "pg": 33,
      "p": 33,
      "ch": "c6"
     },
     {
      "t": "作业九：Quick Summary of Lecture Video",
      "d": 2161,
      "pg": 34,
      "p": 34,
      "ch": "c6"
     },
     {
      "t": "第17讲：有关影像的生成式AI (上) — AI 如何产生图片和影片 (Sora背后可能用的原理)",
      "d": 2970,
      "pg": 35,
      "p": 35,
      "ch": "c7"
     },
     {
      "t": "第18讲：有关影像的生成式AI (下) — 快速导读经典影像生成方法 (VAE, Flow, Diffusion, GAN) 以及与生成的影片互动",
      "d": 2221,
      "pg": 36,
      "p": 36,
      "ch": "c7"
     },
     {
      "t": "（延申）Variational Auto-encoder (VAE)",
      "d": 3812,
      "pg": 37,
      "p": 37,
      "ch": "c7"
     },
     {
      "t": "（延申）Generative Adversarial Network (GAN)",
      "d": 5596,
      "pg": 38,
      "p": 38,
      "ch": "c7"
     },
     {
      "t": "（延申）Flow-based Method",
      "d": 4072,
      "pg": 39,
      "p": 39,
      "ch": "c7"
     },
     {
      "t": "（延申）Diffusion Method",
      "d": 834,
      "pg": 40,
      "p": 40,
      "ch": "c7"
     },
     {
      "t": "作业十：Stable Diffusion Fine-tuning",
      "d": 925,
      "pg": 41,
      "p": 41,
      "ch": "c7"
     },
     {
      "t": "额外课程：GPT-4o",
      "d": 2293,
      "pg": 42,
      "p": 42,
      "ch": "c8"
     }
    ]
   },
   "mu_d2l": {
    "id": "mu_d2l",
    "bv": "BV1RxZmYCEfB",
    "title": "李沐《动手学深度学习》PyTorch 版",
    "sub": "161 集 · 每节先讲原理再写代码",
    "teacher": "李沐（AWS 资深首席科学家）",
    "platform": "B 站（跟李沐学 AI 转载）",
    "url": "https://www.bilibili.com/video/BV1RxZmYCEfB/",
    "lang": "中文",
    "cost": "免费",
    "length": "161 集 · 约 58.5 小时",
    "why": "《动手学深度学习》的配套视频，全书从数据操作一路推到 BERT。每节都是“讲原理 → 现场敲代码 → QA”，看懂代码才算真会，这套课就是为“能跑起来”设计的。161 集含旧版精选选修。",
    "how": "必须开 Jupyter 跟着敲：每集看完自己重跑一遍，再改一个超参看结果怎么变。第 2-8 章是地基别跳；显卡不够就用 Colab 免费额度，第 9 章讲了怎么用。",
    "chapters": [
     {
      "id": "c1",
      "n": "第1章",
      "name": "课程安排与深度学习介绍",
      "desc": "课程说明、深度学习是什么、安装",
      "from": 1,
      "to": 3
     },
     {
      "id": "c2",
      "n": "第2章",
      "name": "预备知识",
      "desc": "数据操作、预处理、线性代数、矩阵计算、自动求导",
      "from": 4,
      "to": 12
     },
     {
      "id": "c3",
      "n": "第3章",
      "name": "线性神经网络",
      "desc": "线性回归、基础优化、Softmax 回归与分类数据集",
      "from": 13,
      "to": 21
     },
     {
      "id": "c4",
      "n": "第4章",
      "name": "环境与 GPU",
      "desc": "CUDA/PyTorch 安装、AWS GPU 实例",
      "from": 22,
      "to": 23
     },
     {
      "id": "c5",
      "n": "第5章",
      "name": "多层感知机",
      "desc": "感知机、模型选择、过拟合、权重衰退、丢弃法、数值稳定性、Kaggle 房价",
      "from": 24,
      "to": 38
     },
     {
      "id": "c6",
      "n": "第6章",
      "name": "深度学习计算",
      "desc": "模型构造、参数管理、自定义层、读写文件、GPU",
      "from": 39,
      "to": 45
     },
     {
      "id": "c7",
      "n": "第7章",
      "name": "卷积神经网络",
      "desc": "卷积层、填充步幅、多通道、池化层",
      "from": 46,
      "to": 54
     },
     {
      "id": "c8",
      "n": "第8章",
      "name": "现代卷积神经网络",
      "desc": "LeNet、AlexNet、VGG、NiN、GoogLeNet、BN、ResNet",
      "from": 55,
      "to": 70
     },
     {
      "id": "c9",
      "n": "第9章",
      "name": "计算性能",
      "desc": "CPU/GPU、单机多卡、分布式训练",
      "from": 71,
      "to": 76
     },
     {
      "id": "c10",
      "n": "第10章",
      "name": "计算机视觉",
      "desc": "数据增广、微调、物体检测、SSD、语义分割、样式迁移",
      "from": 77,
      "to": 102
     },
     {
      "id": "c11",
      "n": "第11章",
      "name": "循环神经网络",
      "desc": "序列模型、语言模型、RNN、GRU、LSTM、深层/双向、seq2seq、束搜索",
      "from": 103,
      "to": 124
     },
     {
      "id": "c12",
      "n": "第12章",
      "name": "注意力机制与 BERT",
      "desc": "注意力分数、自注意力、BERT 预训练与微调",
      "from": 125,
      "to": 139
     },
     {
      "id": "c13",
      "n": "第13章",
      "name": "优化算法与总结",
      "desc": "优化算法、课程总结与进阶路线",
      "from": 140,
      "to": 142
     },
     {
      "id": "c14",
      "n": "第14章",
      "name": "旧版精选（选修）",
      "desc": "2019 版十九课，适合回看经典讲法",
      "from": 143,
      "to": 161
     }
    ],
    "pages": [
     {
      "t": "动手学深度学习课程安排",
      "d": 489,
      "pg": 1,
      "p": 1,
      "ch": "c1"
     },
     {
      "t": "深度学习介绍",
      "d": 815,
      "pg": 2,
      "p": 2,
      "ch": "c1"
     },
     {
      "t": "安装",
      "d": 967,
      "pg": 3,
      "p": 3,
      "ch": "c1"
     },
     {
      "t": "数据操作",
      "d": 282,
      "pg": 4,
      "p": 4,
      "ch": "c2"
     },
     {
      "t": "数据操作实现",
      "d": 876,
      "pg": 5,
      "p": 5,
      "ch": "c2"
     },
     {
      "t": "数据预处理实现",
      "d": 447,
      "pg": 6,
      "p": 6,
      "ch": "c2"
     },
     {
      "t": "线性代数",
      "d": 544,
      "pg": 7,
      "p": 7,
      "ch": "c2"
     },
     {
      "t": "线性代数实现",
      "d": 772,
      "pg": 8,
      "p": 8,
      "ch": "c2"
     },
     {
      "t": "按特定轴求和",
      "d": 452,
      "pg": 9,
      "p": 9,
      "ch": "c2"
     },
     {
      "t": "矩阵计算",
      "d": 759,
      "pg": 10,
      "p": 10,
      "ch": "c2"
     },
     {
      "t": "自动求导",
      "d": 700,
      "pg": 11,
      "p": 11,
      "ch": "c2"
     },
     {
      "t": "自动求导实现",
      "d": 403,
      "pg": 12,
      "p": 12,
      "ch": "c2"
     },
     {
      "t": "线性回归",
      "d": 898,
      "pg": 13,
      "p": 13,
      "ch": "c3"
     },
     {
      "t": "基础优化算法",
      "d": 505,
      "pg": 14,
      "p": 14,
      "ch": "c3"
     },
     {
      "t": "线性回归的从零开始实现",
      "d": 921,
      "pg": 15,
      "p": 15,
      "ch": "c3"
     },
     {
      "t": "线性回归的简洁实现",
      "d": 403,
      "pg": 16,
      "p": 16,
      "ch": "c3"
     },
     {
      "t": "Softmax 回归",
      "d": 627,
      "pg": 17,
      "p": 17,
      "ch": "c3"
     },
     {
      "t": "损失函数",
      "d": 385,
      "pg": 18,
      "p": 18,
      "ch": "c3"
     },
     {
      "t": "图片分类数据集",
      "d": 566,
      "pg": 19,
      "p": 19,
      "ch": "c3"
     },
     {
      "t": "Softmax 回归从零开始实现",
      "d": 1124,
      "pg": 20,
      "p": 20,
      "ch": "c3"
     },
     {
      "t": "Softmax 回归简洁实现",
      "d": 250,
      "pg": 21,
      "p": 21,
      "ch": "c3"
     },
     {
      "t": "Windows 下安装 CUDA 和 Pytorch 跑深度学习",
      "d": 474,
      "pg": 22,
      "p": 22,
      "ch": "c4"
     },
     {
      "t": "使用 AWS 最便宜的 GPU 实例",
      "d": 496,
      "pg": 23,
      "p": 23,
      "ch": "c4"
     },
     {
      "t": "感知机",
      "d": 833,
      "pg": 24,
      "p": 24,
      "ch": "c5"
     },
     {
      "t": "多层感知机",
      "d": 1360,
      "pg": 25,
      "p": 25,
      "ch": "c5"
     },
     {
      "t": "代码实现",
      "d": 506,
      "pg": 26,
      "p": 26,
      "ch": "c5"
     },
     {
      "t": "10行代码战胜90%数据科学家？",
      "d": 200,
      "pg": 27,
      "p": 27,
      "ch": "c5"
     },
     {
      "t": "模型选择",
      "d": 1117,
      "pg": 28,
      "p": 28,
      "ch": "c5"
     },
     {
      "t": "过拟合和欠拟合",
      "d": 1007,
      "pg": 29,
      "p": 29,
      "ch": "c5"
     },
     {
      "t": "代码",
      "d": 408,
      "pg": 30,
      "p": 30,
      "ch": "c5"
     },
     {
      "t": "权重衰退",
      "d": 783,
      "pg": 31,
      "p": 31,
      "ch": "c5"
     },
     {
      "t": "代码实现",
      "d": 755,
      "pg": 32,
      "p": 32,
      "ch": "c5"
     },
     {
      "t": "丢弃法",
      "d": 720,
      "pg": 33,
      "p": 33,
      "ch": "c5"
     },
     {
      "t": "代码实现",
      "d": 737,
      "pg": 34,
      "p": 34,
      "ch": "c5"
     },
     {
      "t": "数值稳定性",
      "d": 921,
      "pg": 35,
      "p": 35,
      "ch": "c5"
     },
     {
      "t": "模型初始化和激活函数",
      "d": 1444,
      "pg": 36,
      "p": 36,
      "ch": "c5"
     },
     {
      "t": "实战 Kaggle 比赛：预测房价",
      "d": 871,
      "pg": 37,
      "p": 37,
      "ch": "c5"
     },
     {
      "t": "课程竞赛：加州2020年房价预测",
      "d": 520,
      "pg": 38,
      "p": 38,
      "ch": "c5"
     },
     {
      "t": "PyTorch 神经网络基础-模型构造",
      "d": 808,
      "pg": 39,
      "p": 39,
      "ch": "c6"
     },
     {
      "t": "参数管理",
      "d": 1041,
      "pg": 40,
      "p": 40,
      "ch": "c6"
     },
     {
      "t": "自定义层",
      "d": 329,
      "pg": 41,
      "p": 41,
      "ch": "c6"
     },
     {
      "t": "读写文件",
      "d": 364,
      "pg": 42,
      "p": 42,
      "ch": "c6"
     },
     {
      "t": "使用 GPU",
      "d": 815,
      "pg": 43,
      "p": 43,
      "ch": "c6"
     },
     {
      "t": "购买 GPU",
      "d": 535,
      "pg": 44,
      "p": 44,
      "ch": "c6"
     },
     {
      "t": "竞赛总结",
      "d": 999,
      "pg": 45,
      "p": 45,
      "ch": "c6"
     },
     {
      "t": "从全连接到卷积",
      "d": 900,
      "pg": 46,
      "p": 46,
      "ch": "c7"
     },
     {
      "t": "卷积层",
      "d": 662,
      "pg": 47,
      "p": 47,
      "ch": "c7"
     },
     {
      "t": "代码",
      "d": 608,
      "pg": 48,
      "p": 48,
      "ch": "c7"
     },
     {
      "t": "填充和步幅",
      "d": 848,
      "pg": 49,
      "p": 49,
      "ch": "c7"
     },
     {
      "t": "代码实现",
      "d": 305,
      "pg": 50,
      "p": 50,
      "ch": "c7"
     },
     {
      "t": "多输入输出通道",
      "d": 1173,
      "pg": 51,
      "p": 51,
      "ch": "c7"
     },
     {
      "t": "代码实现",
      "d": 396,
      "pg": 52,
      "p": 52,
      "ch": "c7"
     },
     {
      "t": "池化层",
      "d": 621,
      "pg": 53,
      "p": 53,
      "ch": "c7"
     },
     {
      "t": "实现",
      "d": 418,
      "pg": 54,
      "p": 54,
      "ch": "c7"
     },
     {
      "t": "LeNet",
      "d": 511,
      "pg": 55,
      "p": 55,
      "ch": "c8"
     },
     {
      "t": "代码",
      "d": 1307,
      "pg": 56,
      "p": 56,
      "ch": "c8"
     },
     {
      "t": "AlexNet",
      "d": 2116,
      "pg": 57,
      "p": 57,
      "ch": "c8"
     },
     {
      "t": "代码",
      "d": 639,
      "pg": 58,
      "p": 58,
      "ch": "c8"
     },
     {
      "t": "VGG",
      "d": 544,
      "pg": 59,
      "p": 59,
      "ch": "c8"
     },
     {
      "t": "代码",
      "d": 443,
      "pg": 60,
      "p": 60,
      "ch": "c8"
     },
     {
      "t": "NIN",
      "d": 655,
      "pg": 61,
      "p": 61,
      "ch": "c8"
     },
     {
      "t": "代码",
      "d": 601,
      "pg": 62,
      "p": 62,
      "ch": "c8"
     },
     {
      "t": "GoogLeNet",
      "d": 1619,
      "pg": 63,
      "p": 63,
      "ch": "c8"
     },
     {
      "t": "代码",
      "d": 430,
      "pg": 64,
      "p": 64,
      "ch": "c8"
     },
     {
      "t": "批量归一化",
      "d": 1079,
      "pg": 65,
      "p": 65,
      "ch": "c8"
     },
     {
      "t": "代码",
      "d": 1032,
      "pg": 66,
      "p": 66,
      "ch": "c8"
     },
     {
      "t": "ResNet",
      "d": 850,
      "pg": 67,
      "p": 67,
      "ch": "c8"
     },
     {
      "t": "代码",
      "d": 566,
      "pg": 68,
      "p": 68,
      "ch": "c8"
     },
     {
      "t": "ResNet的梯度计算",
      "d": 502,
      "pg": 69,
      "p": 69,
      "ch": "c8"
     },
     {
      "t": "完结竞赛：图片分类",
      "d": 397,
      "pg": 70,
      "p": 70,
      "ch": "c8"
     },
     {
      "t": "CPU 和 GPU",
      "d": 2362,
      "pg": 71,
      "p": 71,
      "ch": "c9"
     },
     {
      "t": "更多的芯片",
      "d": 1759,
      "pg": 72,
      "p": 72,
      "ch": "c9"
     },
     {
      "t": "单机多卡并行",
      "d": 419,
      "pg": 73,
      "p": 73,
      "ch": "c9"
     },
     {
      "t": "多GPU训练-从零开始",
      "d": 1301,
      "pg": 74,
      "p": 74,
      "ch": "c9"
     },
     {
      "t": "简洁实现",
      "d": 713,
      "pg": 75,
      "p": 75,
      "ch": "c9"
     },
     {
      "t": "分布式训练",
      "d": 1305,
      "pg": 76,
      "p": 76,
      "ch": "c9"
     },
     {
      "t": "数据增广",
      "d": 769,
      "pg": 77,
      "p": 77,
      "ch": "c10"
     },
     {
      "t": "代码",
      "d": 1181,
      "pg": 78,
      "p": 78,
      "ch": "c10"
     },
     {
      "t": "微调",
      "d": 833,
      "pg": 79,
      "p": 79,
      "ch": "c10"
     },
     {
      "t": "代码",
      "d": 535,
      "pg": 80,
      "p": 80,
      "ch": "c10"
     },
     {
      "t": "第二次竞赛 树叶分类结果",
      "d": 331,
      "pg": 81,
      "p": 81,
      "ch": "c10"
     },
     {
      "t": "Kaggle Cifar10",
      "d": 1677,
      "pg": 82,
      "p": 82,
      "ch": "c10"
     },
     {
      "t": "Kaggle ImageNet Dog",
      "d": 1149,
      "pg": 83,
      "p": 83,
      "ch": "c10"
     },
     {
      "t": "物体检测",
      "d": 696,
      "pg": 84,
      "p": 84,
      "ch": "c10"
     },
     {
      "t": "边缘框实现",
      "d": 228,
      "pg": 85,
      "p": 85,
      "ch": "c10"
     },
     {
      "t": "数据集",
      "d": 586,
      "pg": 86,
      "p": 86,
      "ch": "c10"
     },
     {
      "t": "锚框",
      "d": 1087,
      "pg": 87,
      "p": 87,
      "ch": "c10"
     },
     {
      "t": "代码",
      "d": 1401,
      "pg": 88,
      "p": 88,
      "ch": "c10"
     },
     {
      "t": "树叶分类竞赛技术总结",
      "d": 1589,
      "pg": 89,
      "p": 89,
      "ch": "c10"
     },
     {
      "t": "物体检测算法：R-CNN，SSD，YOLO",
      "d": 2525,
      "pg": 90,
      "p": 90,
      "ch": "c10"
     },
     {
      "t": "多尺度锚框",
      "d": 597,
      "pg": 91,
      "p": 91,
      "ch": "c10"
     },
     {
      "t": "SSD",
      "d": 3165,
      "pg": 92,
      "p": 92,
      "ch": "c10"
     },
     {
      "t": "语义分割",
      "d": 432,
      "pg": 93,
      "p": 93,
      "ch": "c10"
     },
     {
      "t": "语义分割数据集",
      "d": 1677,
      "pg": 94,
      "p": 94,
      "ch": "c10"
     },
     {
      "t": "转置卷积",
      "d": 561,
      "pg": 95,
      "p": 95,
      "ch": "c10"
     },
     {
      "t": "代码",
      "d": 762,
      "pg": 96,
      "p": 96,
      "ch": "c10"
     },
     {
      "t": "转置卷积是一种卷积",
      "d": 579,
      "pg": 97,
      "p": 97,
      "ch": "c10"
     },
     {
      "t": "FCN",
      "d": 263,
      "pg": 98,
      "p": 98,
      "ch": "c10"
     },
     {
      "t": "代码",
      "d": 1061,
      "pg": 99,
      "p": 99,
      "ch": "c10"
     },
     {
      "t": "样式迁移",
      "d": 298,
      "pg": 100,
      "p": 100,
      "ch": "c10"
     },
     {
      "t": "代码",
      "d": 1158,
      "pg": 101,
      "p": 101,
      "ch": "c10"
     },
     {
      "t": "课程竞赛：牛仔行头检测",
      "d": 664,
      "pg": 102,
      "p": 102,
      "ch": "c10"
     },
     {
      "t": "序列模型",
      "d": 1204,
      "pg": 103,
      "p": 103,
      "ch": "c11"
     },
     {
      "t": "代码",
      "d": 713,
      "pg": 104,
      "p": 104,
      "ch": "c11"
     },
     {
      "t": "文本预处理代码",
      "d": 1084,
      "pg": 105,
      "p": 105,
      "ch": "c11"
     },
     {
      "t": "语言模型",
      "d": 978,
      "pg": 106,
      "p": 106,
      "ch": "c11"
     },
     {
      "t": "代码",
      "d": 1547,
      "pg": 107,
      "p": 107,
      "ch": "c11"
     },
     {
      "t": "RNN",
      "d": 1516,
      "pg": 108,
      "p": 108,
      "ch": "c11"
     },
     {
      "t": "从零开始实现",
      "d": 2915,
      "pg": 109,
      "p": 109,
      "ch": "c11"
     },
     {
      "t": "简介实现",
      "d": 431,
      "pg": 110,
      "p": 110,
      "ch": "c11"
     },
     {
      "t": "门控循环单元（GRU）",
      "d": 923,
      "pg": 111,
      "p": 111,
      "ch": "c11"
     },
     {
      "t": "代码",
      "d": 837,
      "pg": 112,
      "p": 112,
      "ch": "c11"
     },
     {
      "t": "长短期记忆网络（LSTM）",
      "d": 579,
      "pg": 113,
      "p": 113,
      "ch": "c11"
     },
     {
      "t": "代码",
      "d": 277,
      "pg": 114,
      "p": 114,
      "ch": "c11"
     },
     {
      "t": "深层循环神经网络",
      "d": 203,
      "pg": 115,
      "p": 115,
      "ch": "c11"
     },
     {
      "t": "代码",
      "d": 165,
      "pg": 116,
      "p": 116,
      "ch": "c11"
     },
     {
      "t": "双向循环神经网络",
      "d": 445,
      "pg": 117,
      "p": 117,
      "ch": "c11"
     },
     {
      "t": "代码",
      "d": 111,
      "pg": 118,
      "p": 118,
      "ch": "c11"
     },
     {
      "t": "机器翻译数据集",
      "d": 616,
      "pg": 119,
      "p": 119,
      "ch": "c11"
     },
     {
      "t": "编码器-解码器架构",
      "d": 213,
      "pg": 120,
      "p": 120,
      "ch": "c11"
     },
     {
      "t": "代码",
      "d": 164,
      "pg": 121,
      "p": 121,
      "ch": "c11"
     },
     {
      "t": "Seq2Seq",
      "d": 755,
      "pg": 122,
      "p": 122,
      "ch": "c11"
     },
     {
      "t": "代码",
      "d": 1647,
      "pg": 123,
      "p": 123,
      "ch": "c11"
     },
     {
      "t": "束搜索",
      "d": 704,
      "pg": 124,
      "p": 124,
      "ch": "c11"
     },
     {
      "t": "注意力机制",
      "d": 838,
      "pg": 125,
      "p": 125,
      "ch": "c12"
     },
     {
      "t": "代码",
      "d": 600,
      "pg": 126,
      "p": 126,
      "ch": "c12"
     },
     {
      "t": "注意力分数",
      "d": 645,
      "pg": 127,
      "p": 127,
      "ch": "c12"
     },
     {
      "t": "代码",
      "d": 920,
      "pg": 128,
      "p": 128,
      "ch": "c12"
     },
     {
      "t": "使用注意力机制的seq2seq",
      "d": 615,
      "pg": 129,
      "p": 129,
      "ch": "c12"
     },
     {
      "t": "代码",
      "d": 796,
      "pg": 130,
      "p": 130,
      "ch": "c12"
     },
     {
      "t": "自注意力",
      "d": 1672,
      "pg": 131,
      "p": 131,
      "ch": "c12"
     },
     {
      "t": "代码",
      "d": 177,
      "pg": 132,
      "p": 132,
      "ch": "c12"
     },
     {
      "t": "BERT",
      "d": 1311,
      "pg": 133,
      "p": 133,
      "ch": "c12"
     },
     {
      "t": "BERT代码",
      "d": 697,
      "pg": 134,
      "p": 134,
      "ch": "c12"
     },
     {
      "t": "BERT预训练数据代码",
      "d": 494,
      "pg": 135,
      "p": 135,
      "ch": "c12"
     },
     {
      "t": "BERT预训练代码",
      "d": 577,
      "pg": 136,
      "p": 136,
      "ch": "c12"
     },
     {
      "t": "BERT微调",
      "d": 585,
      "pg": 137,
      "p": 137,
      "ch": "c12"
     },
     {
      "t": "自然语言推理数据集",
      "d": 283,
      "pg": 138,
      "p": 138,
      "ch": "c12"
     },
     {
      "t": "BERT微调代码",
      "d": 734,
      "pg": 139,
      "p": 139,
      "ch": "c12"
     },
     {
      "t": "目标检测竞赛总结",
      "d": 1437,
      "pg": 140,
      "p": 140,
      "ch": "c13"
     },
     {
      "t": "优化算法",
      "d": 2044,
      "pg": 141,
      "p": 141,
      "ch": "c13"
     },
     {
      "t": "课程总结和进阶学习",
      "d": 1357,
      "pg": 142,
      "p": 142,
      "ch": "c13"
     },
     {
      "t": "【旧版可选修】1. 第一课：深度学习入门",
      "d": 7254,
      "pg": 143,
      "p": 143,
      "ch": "c14"
     },
     {
      "t": "2. 第二课：卷积神经网络",
      "d": 7332,
      "pg": 144,
      "p": 144,
      "ch": "c14"
     },
     {
      "t": "3. 第三课：深度卷积网络",
      "d": 7243,
      "pg": 145,
      "p": 145,
      "ch": "c14"
     },
     {
      "t": "4. 第四课：模型训练策略",
      "d": 7221,
      "pg": 146,
      "p": 146,
      "ch": "c14"
     },
     {
      "t": "5. 第五课：优化算法基础",
      "d": 7050,
      "pg": 147,
      "p": 147,
      "ch": "c14"
     },
     {
      "t": "6. 第六课：计算机视觉",
      "d": 6648,
      "pg": 148,
      "p": 148,
      "ch": "c14"
     },
     {
      "t": "7. 第七课：物体检测-1",
      "d": 3828,
      "pg": 149,
      "p": 149,
      "ch": "c14"
     },
     {
      "t": "8. 第八课：物体检测-2",
      "d": 2925,
      "pg": 150,
      "p": 150,
      "ch": "c14"
     },
     {
      "t": "9. 第九课：物体检测·3",
      "d": 3852,
      "pg": 151,
      "p": 151,
      "ch": "c14"
     },
     {
      "t": "10. 第十课：语义分割",
      "d": 3615,
      "pg": 152,
      "p": 152,
      "ch": "c14"
     },
     {
      "t": "11. 第十一课：样式迁移",
      "d": 3559,
      "pg": 153,
      "p": 153,
      "ch": "c14"
     },
     {
      "t": "12. 第十二课：循环神经网络",
      "d": 4148,
      "pg": 154,
      "p": 154,
      "ch": "c14"
     },
     {
      "t": "13. 第十四课：循环神经网络的实现、训练和应",
      "d": 3891,
      "pg": 155,
      "p": 155,
      "ch": "c14"
     },
     {
      "t": "14. 第十三课：正向传播与反向传播",
      "d": 3938,
      "pg": 156,
      "p": 156,
      "ch": "c14"
     },
     {
      "t": "15. 第十五课：GRU、LSTM及多层循环神经网络实现",
      "d": 3951,
      "pg": 157,
      "p": 157,
      "ch": "c14"
     },
     {
      "t": "16. 第十六课：词向量",
      "d": 4057,
      "pg": 158,
      "p": 158,
      "ch": "c14"
     },
     {
      "t": "17. 第十七课：GloVe、fastText和词向量",
      "d": 3986,
      "pg": 159,
      "p": 159,
      "ch": "c14"
     },
     {
      "t": "18. 第十八课：seq2seq和注意力机制",
      "d": 3926,
      "pg": 160,
      "p": 160,
      "ch": "c14"
     },
     {
      "t": "19. 第十九课：机器翻译应用",
      "d": 4273,
      "pg": 161,
      "p": 161,
      "ch": "c14"
     }
    ]
   }
  };
  W.AI_GROUPS = {"ng": ["ai"], "lhy": ["lhy_ml", "lhy_dl", "lhy_llm", "lhy_gen"], "mu": ["mu_d2l"]};
  var M = W.AI_MODULES = {
 "lhy_ml": {
  "id": "lhy_ml",
  "name": "机器学习",
  "color": "#2563eb",
  "tint": "#e8f0ff",
  "tint2": "#c2d8ff",
  "title": "李宏毅《机器学习》2021 春",
  "desc": "台大电机系 · 41 集 · 国语授权版。中文圈公认的第一门机器学习课：不堆公式，用宝可梦、动漫把梯度下降、CNN、自注意力、Transformer、GAN、强化…",
  "back": "module.html#/ai/lhy",
  "backLabel": "返回 AI 应用实战",
  "info": {
   "teacher": "李宏毅（台大电机系）",
   "platform": "B 站搬运（已获授权 · 国语版）",
   "length": "41 集 · 约 24.8 小时",
   "lang": "中文（台湾普通话）",
   "cost": "免费"
  },
  "why": "中文圈公认的第一门机器学习课：不堆公式，用宝可梦、动漫把梯度下降、CNN、自注意力、Transformer、GAN、强化学习讲成故事。2021 版补齐了 Transformer 与自监督学习，讲法仍是“先给直觉，再给推导”。",
  "how": "一天两集：听完暂停，自己在纸上复述一遍关键图；每章结束用 Colab 做一个小实验。第 2 章“训练不起来怎么办”千万别跳 —— 后面所有模型都建在这套调试直觉上。"
 },
 "lhy_dl": {
  "id": "lhy_dl",
  "name": "深度学习",
  "color": "#2563eb",
  "tint": "#e8f0ff",
  "tint2": "#c2d8ff",
  "title": "李宏毅《深度学习》2020 完整版",
  "desc": "119 集 · 从反向传播到元学习全讲透。他讲得最系统的一版“深度学习全书”：反向传播、训练技巧、CNN、RNN、Transformer、自监督、可解释性、对抗攻…",
  "back": "module.html#/ai/lhy",
  "backLabel": "返回 AI 应用实战",
  "info": {
   "teacher": "李宏毅（台大电机系）",
   "platform": "B 站搬运（完整版）",
   "length": "119 集 · 约 66.6 小时",
   "lang": "中文讲解 · 英文板书",
   "cost": "免费"
  },
  "why": "他讲得最系统的一版“深度学习全书”：反向传播、训练技巧、CNN、RNN、Transformer、自监督、可解释性、对抗攻击、模型压缩、元学习、终身学习、强化学习，一门课打通。标“选学”的是加餐。",
  "how": "按章推进，选学的先跳过。四块重点：训练技巧、CNN、注意力、强化学习。每章看完写 200 字总结再往下，比一口气刷完有用得多。"
 },
 "lhy_llm": {
  "id": "lhy_llm",
  "name": "大模型",
  "color": "#2563eb",
  "tint": "#e8f0ff",
  "tint2": "#c2d8ff",
  "title": "李宏毅《大模型》2025",
  "desc": "27 集 · 全部围绕大模型与 AI Agent。2025 版不讲传统机器学习，整门课就是大模型：AI Agent 怎么规划与用工具、语言模型内部机制、Transform…",
  "back": "module.html#/ai/lhy",
  "backLabel": "返回 AI 应用实战",
  "info": {
   "teacher": "李宏毅（台大电机系）",
   "platform": "B 站（已获授权）",
   "length": "27 集 · 约 22.0 小时",
   "lang": "中文（台湾普通话）",
   "cost": "免费"
  },
  "why": "2025 版不讲传统机器学习，整门课就是大模型：AI Agent 怎么规划与用工具、语言模型内部机制、Transformer 的竞争架构、预训练-对齐、Post-Training 与遗忘、DeepSeek-R1 式推理、评估、Model Editing 与 Model Merging。想搞懂现在这些模型在干什么，这一版最新也最直接。",
  "how": "先看第 1 讲建立全局，然后“讲 → 作业”交替：每讲配一个 Colab 作业，不跟着做一周就忘。第 3、5、7 讲（内部机制、预训练对齐、推理模型）值得各看两遍。"
 },
 "lhy_gen": {
  "id": "lhy_gen",
  "name": "生成式 AI 导论",
  "color": "#2563eb",
  "tint": "#e8f0ff",
  "tint2": "#c2d8ff",
  "title": "李宏毅《生成式 AI 导论》2024 春",
  "desc": "42 集 · 零基础也能听懂的生成式 AI。从“生成式 AI 是什么”讲到 prompt、微调、RLHF、Agent、评估、安全、图像生成（VAE/GAN/Diff…",
  "back": "module.html#/ai/lhy",
  "backLabel": "返回 AI 应用实战",
  "info": {
   "teacher": "李宏毅（台大电机系）",
   "platform": "B 站搬运（已获授权）",
   "length": "42 集 · 约 26.5 小时",
   "lang": "中文（台湾普通话）",
   "cost": "免费"
  },
  "why": "从“生成式 AI 是什么”讲到 prompt、微调、RLHF、Agent、评估、安全、图像生成（VAE/GAN/Diffusion）。不需要机器学习基础，是想弄明白 ChatGPT 这类产品怎么来的最快路径，作业就是拿 AI 做个小应用。",
  "how": "第 0-5 讲必看（建立直觉），第 6-9 讲边看边动手，第 12 讲之后的评估与安全至少过一遍。延申课按兴趣挑，图像生成那两讲配合 Diffusion 延申一起看。"
 },
 "mu_d2l": {
  "id": "mu_d2l",
  "name": "动手学深度学习",
  "color": "#0d9488",
  "tint": "#e6f7f4",
  "tint2": "#b8e8e0",
  "title": "李沐《动手学深度学习》PyTorch 版",
  "desc": "161 集 · 每节先讲原理再写代码。《动手学深度学习》的配套视频，全书从数据操作一路推到 BERT。每节都是“讲原理 → 现场敲代码 → QA”，看懂代码才…",
  "back": "module.html#/ai/mu",
  "backLabel": "返回 AI 应用实战",
  "info": {
   "teacher": "李沐（AWS 资深首席科学家）",
   "platform": "B 站（跟李沐学 AI 转载）",
   "length": "161 集 · 约 58.5 小时",
   "lang": "中文",
   "cost": "免费"
  },
  "why": "《动手学深度学习》的配套视频，全书从数据操作一路推到 BERT。每节都是“讲原理 → 现场敲代码 → QA”，看懂代码才算真会，这套课就是为“能跑起来”设计的。161 集含旧版精选选修。",
  "how": "必须开 Jupyter 跟着敲：每集看完自己重跑一遍，再改一个超参看结果怎么变。第 2-8 章是地基别跳；显卡不够就用 Colab 免费额度，第 9 章讲了怎么用。"
 }
};
  var C = W.COURSES || (W.COURSES = {});
  for (var k in W.AI_COURSES) C[k] = W.AI_COURSES[k];
  var P = W.PY_MODULES || (W.PY_MODULES = {});
  for (var k2 in M) if (!P[k2]) P[k2] = M[k2];
  if (P.ai) { P.ai.back = "module.html#/ai/ng"; P.ai.backLabel = "返回 AI 应用实战"; }
})(window);
