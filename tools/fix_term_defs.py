#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""补全 terms-defs.json 里所有「降级释义」（含中文或以 A technical term 开头的）。

对每个坏释义单独调 AI（比批量更稳），最多重试 3 次；仍失败则保留原样并记录。
"""
import importlib.util
import json
import os
import re
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEF_FILE = os.path.join(ROOT, 'data', 'terms-defs.json')
PENDING = os.path.join(ROOT, 'data', '_terms_pending.json')

spec = importlib.util.spec_from_file_location('srv', os.path.join(ROOT, 'serve.py'))
srv = importlib.util.module_from_spec(spec)
spec.loader.exec_module(srv)


def is_bad(v):
    return (not v or len(v) < 20 or 'A technical term in this course' in v
            or any('\u4e00' <= c <= '\u9fff' for c in v))


def extract(text):
    if not text:
        return ''
    t = text.strip().replace('```json', '').replace('```', '').strip()
    # 优先取第一个引号串（单个释义）
    m = re.search(r'"([^"]{20,300})"', t)
    if m:
        try:
            return json.loads('"' + m.group(1) + '"').strip()
        except Exception:
            return m.group(1).strip()
    return t.strip().strip('"').strip()


def main():
    defs = json.load(open(DEF_FILE, encoding='utf-8'))
    pending = json.load(open(PENDING, encoding='utf-8'))
    zhmap = {t['en']: t for t in pending}
    bad = [k for k, v in defs.items() if is_bad(v)]
    print('待补全坏释义:', len(bad), flush=True)
    fixed, fail = 0, []
    for en in bad:
        zh = zhmap.get(en, {}).get('zh', '')
        eg = zhmap.get(en, {}).get('eg', '')
        prompt = (
            'Give ONE short English definition of the technical term below, '
            'for a beginner student. 8-25 words, plain English, no Chinese, '
            'no examples, no quotes, no markdown. Output the definition text only.\n'
            'Term: %s\nChinese hint (do NOT include in answer): %s\n' % (en, zh)
        )
        got = ''
        for attempt in range(3):
            raw = srv.doubao_chat([{'role': 'user', 'content': prompt}], max_tokens=150)
            cand = extract(raw)
            if cand and not is_bad(cand) and en.split()[0].lower() in cand.lower():
                got = cand
                break
            time.sleep(0.6)
        if got:
            defs[en] = got
            fixed += 1
            print('  ✓', en, '->', got[:90], flush=True)
        else:
            fail.append(en)
        # 每个补一个就落盘，可续跑
        tmp = DEF_FILE + '.tmp'
        with open(tmp, 'w', encoding='utf-8') as f:
            json.dump(defs, f, ensure_ascii=False, indent=1)
        os.replace(tmp, DEF_FILE)
    print('\n补全成功 %d，仍失败 %d' % (fixed, len(fail)), flush=True)
    if fail:
        print('仍失败:', fail, flush=True)


if __name__ == '__main__':
    main()
