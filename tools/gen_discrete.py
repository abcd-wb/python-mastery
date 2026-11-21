#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把屈婉玲《离散数学》（北大国家精品课，BV1BW411n7gw）加入 data/math.js。
分P数据直取 B 站官方接口，按视频自带章号分组。幂等：已存在 discrete 则跳过。
用法：python3 tools/gen_discrete.py
"""
import json
import re
import urllib.request

BV = 'BV1BW411n7gw'
API = 'https://api.bilibili.com/x/web-interface/view?bvid=' + BV
UA = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
                    '(KHTML, like Gecko) Chrome/126 Safari/537.36',
      'Referer': 'https://www.bilibili.com/'}

# 章号 -> (章节名, 说明)
CH_NAMES = {
    1: ('集合论与图论导论', '课程引言、命题逻辑与一阶谓词逻辑预备知识、集合概念与运算'),
    2: ('二元关系', '有序对与卡氏积、关系的表示与性质、关系闭包、等价关系与序关系'),
    3: ('函数与集合论习题', '函数、集合论习题课（1-3 章）'),
    4: ('自然数', '自然数的定义与性质'),
    5: ('基数与序数', '集合的等势、有穷集与无穷集、基数比较与运算、序数与集合论公理'),
    6: ('图的基本概念', '图、通路与回路、连通性与连通度'),
    7: ('欧拉图与哈密顿图', '欧拉图、哈密顿图'),
    8: ('树', '树'),
    9: ('图的矩阵表示', '图的矩阵表示'),
    10: ('平面图', '平面图概念、欧拉公式、对偶图与外平面图'),
    11: ('图的着色', '点着色、色多项式、平面图着色与边着色'),
    12: ('支配集与匹配', '支配集、点覆盖集、点独立集、边覆盖与匹配、二部图匹配'),
    13: ('图论应用与总结', '中国邮递员问题、货郎担问题、图论部分课程总结'),
    14: ('代数系统', '二元运算及其性质、代数系统、子代数与积代数、同态同构、同余与商代数'),
    15: ('半群与独异点', '半群、独异点、直积、商代数与同态'),
    16: ('群论', '群的定义与性质、子群、循环群、置换群、群的分解、正规子群、商群与群同态'),
    17: ('环', '环的定义与性质、子环、理想、商环与环同态'),
    18: ('格与布尔代数', '格的定义与性质、子格与格同态、有补格、布尔格与布尔代数'),
    19: ('组合数学引言', '鸽巢原理与 Ramsey 定理、组合存在性'),
    20: ('排列组合与二项式定理', '两个计数原则、排列组合、二项式定理、组合恒等式、多项式定理'),
    21: ('递推方程与生成函数', '递推方程公式解法、生成函数、指数生成函数、Catalan 数与 Stirling 数'),
    22: ('容斥原理与 Polya 定理', '包含排斥原理、对称筛公式、棋盘多项式、Burnside 引理与 Polya 定理'),
    23: ('数理逻辑·命题逻辑', '命题与联结词、真值表、完全集、推理形式、自然推理系统 N、形式系统 P、范式与完备性'),
    24: ('数理逻辑·一阶谓词逻辑', '一阶谓词演算符号化、一阶语言、自然推演系统 NL、形式系统 KL、解释与赋值、可靠性与和谐性'),
}


def group_no(part):
    m = re.match(r'\s*(\d+)\.', part)
    return int(m.group(1)) if m else None


def build():
    d = json.load(urllib.request.urlopen(urllib.request.Request(API, headers=UA), timeout=30))
    if d.get('code') != 0:
        raise RuntimeError('B 站接口错误: %s' % d.get('message'))
    data = d['data']
    pages = data['pages']

    groups = []
    cur_no, cur = None, []
    for pg in pages:
        n = group_no(pg['part'])
        if n != cur_no:
            if cur:
                groups.append((cur_no, cur))
            cur_no, cur = n, []
        cur.append(pg)
    if cur:
        groups.append((cur_no, cur))

    chapters, out_pages = [], []
    for idx, (no, grp) in enumerate(groups, 1):
        start = out_pages.__len__() + 1
        end = start + len(grp) - 1
        name, desc = CH_NAMES.get(no, ('第%d章' % no, ''))
        chapters.append({'id': 'd%d' % idx, 'n': '第%d章' % no, 'name': name,
                         'from': start, 'to': end, 'desc': desc})
        for pg in grp:
            out_pages.append({'p': len(out_pages) + 1, 't': pg['part'].strip(),
                              'ch': 'd%d' % idx, 'd': int(pg['duration'])})

    secs = sum(p['d'] for p in out_pages)
    obj = {
        'id': 'discrete', 'bv': BV,
        'title': '屈婉玲《离散数学》· 北大国家精品课',
        'sub': '134 集完整版 · 数理逻辑 / 集合论 / 代数结构 / 组合数学 / 图论 / 初等数论六大板块',
        'teacher': '屈婉玲 等（北京大学）',
        'platform': 'B 站搬运（北大国家精品课）',
        'url': 'https://www.bilibili.com/video/%s/' % BV,
        'lang': '全中文', 'cost': '免费',
        'length': '%d 集 · 约 %.1f 小时' % (len(out_pages), secs / 3600.0),
        'secs': secs,
        'why': '国内离散数学最权威的中文公开课，北大国家精品课，屈婉玲、耿素云、王捍贫、刘田四位老师主讲，'
               '屈婉玲主持。覆盖数理逻辑、集合论、代数结构、组合数学、图论、初等数论六大板块，配套北大版黑皮书《离散数学》。'
               '计算机专业的硬地基，学算法、数据库、形式化验证、密码学都绕不开它。',
        'how': '概念多、跨度大，务必动笔：每个定义先抄一遍，再闭书复述，最后做书后例题。'
               '顺序按集合论→图论→代数结构→组合数学→数理逻辑走；数理逻辑（第 23、24 章）最抽象，放到最后啃。'
               '配合教材看，视频里 PPT 偶尔不全，教材能补上。',
        'chapters': chapters, 'pages': out_pages,
    }
    return obj, len(groups)


def main():
    path = 'data/math.js'
    s = open(path, encoding='utf-8').read()
    if '"discrete":' in s:
        print('data/math.js 已含 discrete，跳过')
        return
    obj, nchap = build()
    block = json.dumps(obj, ensure_ascii=False, indent=1).replace('\n', '\n  ')
    snippet = ' "discrete": ' + block.lstrip() + ',\n'
    marker = '(function (C) {\n  var M = {\n'
    if marker not in s:
        raise RuntimeError('data/math.js 结构变了，找不到插入点')
    s = s.replace(marker, marker + snippet, 1)
    open(path, 'w', encoding='utf-8').write(s)
    print('已写入 data/math.js：discrete %d 集 / %d 章 / %.1f 小时'
          % (len(obj['pages']), nchap, obj['secs'] / 3600.0))


if __name__ == '__main__':
    main()
