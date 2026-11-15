#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""生成 data/ai.js：AI 应用实战的三位老师 / 六门课（B 站分P数据直取官方接口）

用法：python3 tools/gen_ai_courses.py
"""
import json
import re
import urllib.request

API = 'https://api.bilibili.com/x/web-interface/view?bvid='

UA = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
                    '(KHTML, like Gecko) Chrome/126 Safari/537.36',
      'Referer': 'https://www.bilibili.com/'}

# ---------------- 课程定义 ----------------
# chapters: (from, to, 章节名, 说明) —— from/to 是处理后的连续序号（1 起）
COURSES = [
    dict(
        id='lhy_ml', bv='BV1JA411c7VT', tid='lhy',
        title='李宏毅《机器学习》2021 春', sub='台大电机系 · 41 集 · 国语授权版',
        teacher='李宏毅（台大电机系）', platform='B 站搬运（已获授权 · 国语版）',
        lang='中文（台湾普通话）', cost='免费',
        why='中文圈公认的第一门机器学习课：不堆公式，用宝可梦、动漫把梯度下降、CNN、自注意力、'
            'Transformer、GAN、强化学习讲成故事。2021 版补齐了 Transformer 与自监督学习，讲法仍是“先给直觉，再给推导”。',
        how='一天两集：听完暂停，自己在纸上复述一遍关键图；每章结束用 Colab 做一个小实验。'
            '第 2 章“训练不起来怎么办”千万别跳 —— 后面所有模型都建在这套调试直觉上。',
        chapters=[(1, 4, '机器学习是什么', '课程规定、两个预测案例、任务攻略'),
                  (5, 9, '训练不起来怎么办', '局部最小值、批次与动量、学习率、损失函数、BN'),
                  (10, 10, '卷积神经网络', 'CNN 为什么适合看图'),
                  (11, 14, '自注意力与 Transformer', 'Self-attention 上下 + Transformer 上下'),
                  (15, 18, '生成对抗网络 GAN', 'GAN 四讲：从原理到实战'),
                  (19, 24, '自监督与自编码器', 'BERT、GPT、Auto-encoder'),
                  (25, 29, '对抗攻击与可解释性', 'Adversarial Attack、Explainable ML、领域自适应'),
                  (30, 34, '强化学习', '三个步骤、Policy Gradient、Actor-Critic、逆强化学习'),
                  (35, 41, '进阶专题与结语', '终身学习、网络压缩、元学习、课程结语')],
    ),
    dict(
        id='lhy_dl', bv='BV1JE411g7XF', tid='lhy',
        title='李宏毅《深度学习》2020 完整版', sub='119 集 · 从反向传播到元学习全讲透',
        teacher='李宏毅（台大电机系）', platform='B 站搬运（完整版）',
        lang='中文讲解 · 英文板书', cost='免费',
        why='他讲得最系统的一版“深度学习全书”：反向传播、训练技巧、CNN、RNN、Transformer、'
            '自监督、可解释性、对抗攻击、模型压缩、元学习、终身学习、强化学习，一门课打通。标“选学”的是加餐。',
        how='按章推进，选学的先跳过。四块重点：训练技巧、CNN、注意力、强化学习。'
            '每章看完写 200 字总结再往下，比一口气刷完有用得多。',
        chapters=[(1, 11, '机器学习基础', '机器学习、Rule of ML、回归、梯度下降、分类与逻辑回归'),
                  (12, 16, '深度学习入门', '深度学习简介、反向传播、训练技巧、为什么深、PyTorch'),
                  (17, 19, 'CNN 与图神经网络', '卷积神经网络、GNN 选学'),
                  (20, 23, 'RNN 与半监督', '循环神经网络、半监督、词嵌入'),
                  (24, 32, '可解释性', 'Explainable ML 八讲 + 加餐'),
                  (33, 42, '对抗攻击', 'Attack ML Models 八讲 + 加餐'),
                  (43, 50, '模型压缩', '剪枝、知识蒸馏'),
                  (51, 55, '序列生成与 Transformer', 'RNN+Attention 生成、Pointer Network、Transformer'),
                  (56, 64, '无监督学习', '线性方法、邻域嵌入、自编码器、BERT/GPT'),
                  (65, 71, '异常检测', 'Anomaly Detection 七讲 + 加餐'),
                  (72, 82, '生成对抗网络', 'GAN 十讲 + 变体'),
                  (83, 85, '迁移与领域自适应', 'Transfer Learning、Domain Adaptation'),
                  (86, 99, '元学习', 'MAML 九讲、Gradient Descent as LSTM'),
                  (100, 107, '终身学习', '灾难性遗忘与解法'),
                  (108, 119, '强化学习', 'DRL、Policy Gradient、PPO、Q-Learning、Actor-Critic、模仿学习')],
    ),
    dict(
        id='lhy_llm', bv='BV1aiADewEBC', tid='lhy',
        title='李宏毅《大模型》2025', sub='27 集 · 全部围绕大模型与 AI Agent',
        teacher='李宏毅（台大电机系）', platform='B 站（已获授权）',
        lang='中文（台湾普通话）', cost='免费',
        why='2025 版不讲传统机器学习，整门课就是大模型：AI Agent 怎么规划与用工具、语言模型内部机制、'
            'Transformer 的竞争架构、预训练-对齐、Post-Training 与遗忘、DeepSeek-R1 式推理、评估、'
            'Model Editing 与 Model Merging。想搞懂现在这些模型在干什么，这一版最新也最直接。',
        how='先看第 1 讲建立全局，然后“讲 → 作业”交替：每讲配一个 Colab 作业，不跟着做一周就忘。'
            '第 3、5、7 讲（内部机制、预训练对齐、推理模型）值得各看两遍。',
        chapters=[(1, 7, '生成式 AI 与 AI Agent', '技术突破全景、Colab/PyTorch/JudgeBoi 教程、HW1-HW2'),
                  (8, 11, '模型内部机制与架构之争', '语言模型脑科学、Transformer 的竞争者们、HW3-HW4'),
                  (12, 17, '预训练、对齐与后训练', 'Pretrain-Alignment、多 GPU 训练、Post-Training、遗忘问题'),
                  (18, 23, '推理、评估与编辑', 'DeepSeek-R1 深度思考、推理长度、评估、Model Editing、RLHF'),
                  (24, 25, '模型融合', 'Task Vector 与 Model Merging'),
                  (26, 27, '语音语言模型', '语言模型如何学会说话、HW10 Diffusion')],
    ),
    dict(
        id='lhy_gen', bv='BV1BJ4m1e7g8', tid='lhy',
        title='李宏毅《生成式 AI 导论》2024 春', sub='42 集 · 零基础也能听懂的生成式 AI',
        teacher='李宏毅（台大电机系）', platform='B 站搬运（已获授权）',
        lang='中文（台湾普通话）', cost='免费',
        why='从“生成式 AI 是什么”讲到 prompt、微调、RLHF、Agent、评估、安全、图像生成（VAE/GAN/Diffusion）。'
            '不需要机器学习基础，是想弄明白 ChatGPT 这类产品怎么来的最快路径，作业就是拿 AI 做个小应用。',
        how='第 0-5 讲必看（建立直觉），第 6-9 讲边看边动手，第 12 讲之后的评估与安全至少过一遍。'
            '延申课按兴趣挑，图像生成那两讲配合 Diffusion 延申一起看。',
        chapters=[(1, 4, '生成式 AI 是什么', '课程说明、真假难辨的世界、80 分钟速通 LLM'),
                  (5, 11, '怎么用好 AI', '从工具到工具人、训练你自己上中下、用工具 AI、作业二到三'),
                  (12, 15, '语言模型修炼史（上）', '第一阶段自我学习、可解释性延申、作业四'),
                  (16, 20, '微调与人类偏好', '第二三阶段、LLM 微调、RLHF、AI Agent'),
                  (21, 27, 'Transformer 与可解释性', '文字接龙、模型在想什么、Transformer 延申'),
                  (28, 34, '评估与安全', '评估方式、安全议题上下、生成策略、投机解码'),
                  (35, 41, '图像的生成式 AI', 'Sora 原理、VAE/GAN/Flow/Diffusion 延申、Stable Diffusion 作业'),
                  (42, 42, '额外课程', 'GPT-4o')],
    ),
    dict(
        id='mu_d2l', bv='BV1RxZmYCEfB', tid='mu',
        title='李沐《动手学深度学习》PyTorch 版', sub='161 集 · 每节先讲原理再写代码',
        teacher='李沐（AWS 资深首席科学家）', platform='B 站（跟李沐学 AI 转载）',
        lang='中文', cost='免费',
        why='《动手学深度学习》的配套视频，全书从数据操作一路推到 BERT。每节都是“讲原理 → 现场敲代码 → QA”，'
            '看懂代码才算真会，这套课就是为“能跑起来”设计的。161 集含旧版精选选修。',
        how='必须开 Jupyter 跟着敲：每集看完自己重跑一遍，再改一个超参看结果怎么变。'
            '第 2-8 章是地基别跳；显卡不够就用 Colab 免费额度，第 9 章讲了怎么用。',
        chapters=[(1, 3, '课程安排与深度学习介绍', '课程说明、深度学习是什么、安装'),
                  (4, 12, '预备知识', '数据操作、预处理、线性代数、矩阵计算、自动求导'),
                  (13, 21, '线性神经网络', '线性回归、基础优化、Softmax 回归与分类数据集'),
                  (22, 23, '环境与 GPU', 'CUDA/PyTorch 安装、AWS GPU 实例'),
                  (24, 38, '多层感知机', '感知机、模型选择、过拟合、权重衰退、丢弃法、数值稳定性、Kaggle 房价'),
                  (39, 45, '深度学习计算', '模型构造、参数管理、自定义层、读写文件、GPU'),
                  (46, 54, '卷积神经网络', '卷积层、填充步幅、多通道、池化层'),
                  (55, 70, '现代卷积神经网络', 'LeNet、AlexNet、VGG、NiN、GoogLeNet、BN、ResNet'),
                  (71, 76, '计算性能', 'CPU/GPU、单机多卡、分布式训练'),
                  (77, 102, '计算机视觉', '数据增广、微调、物体检测、SSD、语义分割、样式迁移'),
                  (103, 124, '循环神经网络', '序列模型、语言模型、RNN、GRU、LSTM、深层/双向、seq2seq、束搜索'),
                  (125, 139, '注意力机制与 BERT', '注意力分数、自注意力、BERT 预训练与微调'),
                  (140, 142, '优化算法与总结', '优化算法、课程总结与进阶路线'),
                  (143, 161, '旧版精选（选修）', '2019 版十九课，适合回看经典讲法')],
    ),
]

TEACHERS = [
    dict(id='ng', name='吴恩达', en='Andrew Ng', color='#e11d48', tint='#ffe9ef', tint2='#ffc9d8',
         ds='用 AI 写代码 · 4 模块 35 集', tag='入门首选',
         icon='<path d="M12 3.2l1.9 4.6 4.6 1.9-4.6 1.9L12 16.2l-1.9-4.6L5.5 9.7l4.6-1.9L12 3.2Z"/>'
              '<path d="M18.4 15.2l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1Z"/>',
         desc='DeepLearning.AI 创始人。不背语法，直接教你指挥 AI 写能跑的代码。',
         order='第一门：先建立“让 AI 替我写代码”的手感，全程不开编辑器也行。'),
    dict(id='lhy', name='李宏毅', en='Hung-yi Lee', color='#2563eb', tint='#e8f0ff', tint2='#c2d8ff',
         ds='台大教授 · 4 门课 · 中文最好懂', tag='4 门课',
         icon='<rect x="3" y="4" width="18" height="11.5" rx="1.6"/><path d="M8 19.5h8M12 15.5v4"/><path d="M7.5 8h9M7.5 11h6"/>',
         desc='台大电机系教授。用宝可梦讲深度学习，中文圈公认讲得最清楚的人。',
         order='第二门往后：机器学习 → 深度学习 → 生成式 AI → 大模型，按这个顺序走。'),
    dict(id='mu', name='李沐', en='Mu Li', color='#0d9488', tint='#e6f7f4', tint2='#b8e8e0',
         ds='《动手学深度学习》作者 · 161 集', tag='边看边敲',
         icon='<path d="M4 5.4A1.9 1.9 0 0 1 5.9 3.5h13.1v17H5.9A1.9 1.9 0 0 1 4 18.6V5.4Z"/>'
              '<path d="M8.2 8.2h7.6M8.2 11.6h5.2"/>',
         desc='AWS 资深首席科学家。每节先讲原理，再现场写代码，看完就能跑。',
         order='和深度学习同期：一边看李宏毅的图，一边跟李沐把代码敲出来。'),
]

AD = re.compile(r'(学习路线|最完整学习路线|加群|关注公众号)')


def fetch(bv):
    req = urllib.request.Request(API + bv, headers=UA)
    with urllib.request.urlopen(req, timeout=20) as r:
        d = json.load(r)
    if d.get('code') != 0:
        raise SystemExit('接口失败 %s: %s' % (bv, d.get('message')))
    return d['data']


def clean(t):
    t = re.sub(r'-?\d{3,4}P\s*高清-?A?V?C?\)?$', '', t)
    t = re.sub(r'[-－]\s*动手学深度学习v2$', '', t)
    t = re.sub(r'\((?:Av|av|BV)[0-9A-Za-z]+,\s*P\d+\)$', '', t)
    t = re.sub(r'[（(]\s*$', '', t)
    t = re.sub(r'^\d{1,3}-\s*', '', t)      # 去掉“141-样式迁移”这种序号，目录里已有 P 编号
    t = t.strip(' -－_')
    return t.strip()


def build(c):
    data = fetch(c['bv'])
    raws = data['pages']
    pages, dropped = [], 0
    for pg in raws:
        t = clean(pg['part'])
        if AD.search(t):          # 广告 / 引流视频不进课程目录
            dropped += 1
            continue
        pages.append({'t': t, 'd': int(pg['duration']), 'pg': int(pg['page'])})
    chapters = []
    for i, (a, b, name, desc) in enumerate(c['chapters'], 1):
        ch_id = 'c%d' % i
        chapters.append({'id': ch_id, 'n': '第%d章' % i, 'name': name, 'desc': desc,
                         'from': a, 'to': min(b, len(pages))})
    for i, p in enumerate(pages, 1):
        p['p'] = i
        for ch in chapters:
            if ch['from'] <= i <= ch['to']:
                p['ch'] = ch['id']
                break
        else:
            p['ch'] = chapters[-1]['id']
    secs = sum(p['d'] for p in pages)
    obj = {
        'id': c['id'], 'bv': c['bv'], 'title': c['title'], 'sub': c['sub'],
        'teacher': c['teacher'], 'platform': c['platform'], 'url': 'https://www.bilibili.com/video/%s/' % c['bv'],
        'lang': c['lang'], 'cost': c['cost'],
        'length': '%d 集 · 约 %.1f 小时' % (len(pages), secs / 3600.0),
        'why': c['why'], 'how': c['how'],
        'chapters': chapters, 'pages': pages,
    }
    print('%-9s %-3s 集  %5.1f 小时  丢广告 %d 集  %s' % (c['id'], len(pages), secs / 3600.0, dropped, data['title'][:30]))
    return obj


def main():
    groups = {'ng': ['ai'], 'lhy': [], 'mu': []}
    out = {}
    for c in COURSES:
        out[c['id']] = build(c)
        groups[c['tid']].append(c['id'])

    mods = {}
    colours = {'lhy': ('#2563eb', '#e8f0ff', '#c2d8ff'), 'mu': ('#0d9488', '#e6f7f4', '#b8e8e0')}
    for cid, c in out.items():
        tid = next(x['tid'] for x in COURSES if x['id'] == cid)
        col, tint, tint2 = colours.get(tid, ('#e11d48', '#ffe9ef', '#ffc9d8'))
        mods[cid] = {'id': cid, 'name': c['title'].split('《')[1].split('》')[0] if '《' in c['title'] else c['title'],
                     'color': col, 'tint': tint, 'tint2': tint2,
                     'title': c['title'], 'desc': c['sub'] + '。' + c['why'][:60] + '…',
                     'back': 'module.html#/ai/%s' % tid, 'backLabel': '返回 AI 应用实战',
                     'info': {'teacher': c['teacher'], 'platform': c['platform'],
                              'length': c['length'], 'lang': c['lang'], 'cost': c['cost']},
                     'why': c['why'], 'how': c['how']}

    js = ['/* AI 应用实战：吴恩达 / 李宏毅 / 李沐 —— 由 tools/gen_ai_courses.py 从 B 站官方接口生成，勿手改 */',
          '(function (W) {',
          '  W.AI_TEACHERS = ' + json.dumps(TEACHERS, ensure_ascii=False, indent=1) + ';',
          '  W.AI_COURSES = ' + json.dumps(out, ensure_ascii=False, indent=1).replace('\n', '\n  ') + ';',
          '  W.AI_GROUPS = ' + json.dumps(groups, ensure_ascii=False) + ';',
          '  var M = W.AI_MODULES = ' + json.dumps(mods, ensure_ascii=False, indent=1) + ';',
          '  var C = W.COURSES || (W.COURSES = {});',
          '  for (var k in W.AI_COURSES) C[k] = W.AI_COURSES[k];',
          '  var P = W.PY_MODULES || (W.PY_MODULES = {});',
          '  for (var k2 in M) if (!P[k2]) P[k2] = M[k2];',
          '  if (P.ai) { P.ai.back = "module.html#/ai/ng"; P.ai.backLabel = "返回 AI 应用实战"; }',
          '})(window);',
          '']

    with open('data/ai.js', 'w', encoding='utf-8') as f:
        f.write('\n'.join(js))
    print('写出 data/ai.js  共 %d 门课 / %d 集'
          % (len(out), sum(len(c['pages']) for c in out.values())))


if __name__ == '__main__':
    main()
