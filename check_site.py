#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""一键体检：页面引用、课程数据、健康接口、真实渲染、课表节数。

用法：
    python3 check_site.py            # 完整体检（含无头浏览器渲染 6 个课程页）
    python3 check_site.py --quick    # 快速体检（只查文件，不启浏览器，约 1 秒）

任何一项不通过都会以 ❌ 标出并返回非零退出码。
"""
import importlib.util
import json
import os
import subprocess
import sys
import tempfile
import urllib.request

ROOT = os.path.dirname(os.path.abspath(__file__))
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
BASE = 'http://127.0.0.1:8101'


def load_serve():
    spec = importlib.util.spec_from_file_location('srv', os.path.join(ROOT, 'serve.py'))
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m


def http_json(path):
    try:
        with urllib.request.urlopen(BASE + path, timeout=5) as r:
            return json.loads(r.read().decode('utf-8'))
    except Exception as e:
        return {'_error': str(e)}


def headless(url, wait=5000):
    with tempfile.TemporaryDirectory(prefix='wb-check-') as d:
        cmd = [CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
               '--disable-dev-shm-usage', '--user-data-dir=' + d,
               '--virtual-time-budget=' + str(wait),
               '--enable-logging=stderr', '--log-level=0', '--dump-dom', url]
        p = subprocess.run(cmd, capture_output=True, text=True, timeout=90)
        return p.stdout, p.stderr


def main():
    quick = '--quick' in sys.argv
    srv = load_serve()
    ok = True

    # 1. 页面引用完整性
    broken = srv.scan_broken_refs()
    if broken:
        ok = False
        print('❌ 失效引用 %d 个:' % len(broken))
        for b in broken:
            print('   %s -> %s' % (b['page'], b['ref']))
    else:
        print('✅ 全站页面的脚本/样式引用全部有效')

    # 2. 课程数据文件
    bad = srv.data_files_bad()
    if bad:
        ok = False
        print('❌ 数据文件缺失或过小:', bad)
    else:
        print('✅ 课程数据文件齐全且非空')

    # 3. 服务端健康接口 + 课表节数（课表按铁律只能持平或增加）
    h = http_json('/api/health')
    if '_error' in h:
        print('⚠️  服务未运行或健康接口不可用：%s' % h['_error'])
    else:
        if not h.get('ok'):
            ok = False
            print('❌ 健康接口报红：%s' % h.get('message'))
        else:
            print('✅ 服务端健康接口正常')
        n = h.get('plan_count')
        if isinstance(n, int) and n >= 14:
            print('✅ 课表 %d 节（未减少）' % n)
        else:
            ok = False
            print('❌ 课表节数异常：%s（应为 14 节以上）' % n)

    if quick:
        print('\n结果：%s' % ('全部通过 ✅' if ok else '发现问题 ❌'))
        return 0 if ok else 1

    # 4. 真实渲染检查（含白屏兜底是否被误触发）
    #    每页用它自己的内容标记：目录页数 .lno/.toc-item，老师页数 .module-card。
    checks = [
        ('module.html#/stats',    '统计学',     ('class="lno"', 'class="toc-item'), 30),
        ('module.html#/calculus', '微积分',     ('class="lno"', 'class="toc-item'), 30),
        ('module.html#/linear',   '线性代数',   ('class="lno"', 'class="toc-item'), 20),
        ('module.html#/discrete', '离散数学',   ('class="lno"', 'class="toc-item'), 100),
        ('module.html#/intro',    'Python 入门', ('class="lno"', 'class="toc-item'), 30),
        ('module.html#/c/ai',     '吴恩达课程', ('class="lno"', 'class="toc-item'), 30),
        ('module.html#/git',      'Git 工具课', ('class="lno"', 'class="toc-item'), 30),
        ('module.html#/javaweb',  'JavaWeb',    ('class="lno"', 'class="toc-item'), 80),
        ('module.html#/ai',       'AI 老师',    ('class="module-card',), 2),
        ('course.html#/stats/1',  '播放页',     ('class="toc-item',), 1),
        ('exercises.html#/intro', '作业练习',   ('class="ex-chap', 'class="ex-task'), 20),
        ('english.html#/',        '英文课程',   ('class="en-mod', 'class="en-course'), 6),
        ('english.html#/c/sc1003','英文课详情', ('class="en-ch', 'class="en-chip'), 10),
    ]
    for rel, name, markers, min_items in checks:
        dom, err = headless(BASE + '/' + rel)
        js_err = [l for l in err.splitlines()
                  if any(k in l for k in ['Uncaught', 'TypeError',
                                          'ReferenceError', 'SyntaxError'])]
        fallback = '<div id="failsafeBox"' in dom
        items = sum(dom.count(m) for m in markers)
        good = not js_err and not fallback and items >= min_items
        if not good:
            ok = False
        print('%s %-12s | 内容标记 %3d | JS 报错 %d | 白屏兜底 %s' % (
            '✅' if good else '❌', name, items, len(js_err),
            '触发了' if fallback else '未触发'))

    print('\n结果：%s' % ('全部通过 ✅' if ok else '发现问题 ❌'))
    return 0 if ok else 1


if __name__ == '__main__':
    sys.exit(main())
