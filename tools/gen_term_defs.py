#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""一次性脚本（可续跑）：为课程术语批量生成英英释义，落盘到 data/terms-defs.json。

数据来源 data/_terms_pending.json（由 node 从 videos.js/math.js 抽取去重）。
每批 18 个词调一次 doubao，逐批落盘；中断后重跑只补缺失项。
生成的 def 是纯英文、面向初学者的简短解释（8~26 词），供「选英英释义」练习用。
"""
import importlib.util
import json
import os
import re
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PENDING = os.path.join(ROOT, 'data', '_terms_pending.json')
OUT = os.path.join(ROOT, 'data', 'terms-defs.json')
BATCH = 18

spec = importlib.util.spec_from_file_location('srv', os.path.join(ROOT, 'serve.py'))
srv = importlib.util.module_from_spec(spec)
spec.loader.exec_module(srv)


def load_json(p, default):
    if not os.path.exists(p):
        return default
    try:
        with open(p, encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return default


def save_json(p, obj):
    tmp = p + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(obj, f, ensure_ascii=False, indent=1)
    os.replace(tmp, p)


def extract_json(text):
    """从模型输出里抠出 JSON 对象，容忍 ```json 包裹和前后废话。"""
    if not text:
        return {}
    t = text.strip().replace('```json', '').replace('```', '').strip()
    i, j = t.find('{'), t.rfind('}')
    if i < 0 or j <= i:
        return {}
    try:
        d = json.loads(t[i:j + 1])
        return d if isinstance(d, dict) else {}
    except Exception:
        # 逐个 key 兜底解析
        out = {}
        for m in re.finditer(r'"([^"]+)"\s*:\s*"((?:[^"\\]|\\.)*)"', t[i:j + 1]):
            try:
                out[m.group(1)] = json.loads('"' + m.group(2) + '"')
            except Exception:
                pass
        return out


def fallback_def(t):
    """无 AI 时的本地降级：用中文释义 + 例句拼一条可用的英英解释。"""
    zh = t.get('zh', '') or 'a term'
    eg = t.get('eg', '')
    s = 'A technical term in this course meaning "%s".' % zh
    if eg:
        s += ' Example: ' + eg.strip()
    return s.strip()


def main():
    pending = load_json(PENDING, [])
    defs = load_json(OUT, {})
    todo = [t for t in pending if t.get('en') and t['en'] not in defs]
    print('总计 %d，已有 %d，待生成 %d' % (len(pending), len(defs), len(todo)), flush=True)

    has_key = bool(srv.ark_api_key())
    if not has_key:
        print('⚠️ 无 API key，全部用本地降级释义', flush=True)
        for t in todo:
            defs[t['en']] = fallback_def(t)
        save_json(OUT, defs)
        return

    sysprompt = (
        'You write short English definitions for a beginner-level technical glossary. '
        'Output ONLY a JSON object mapping each given English term to ONE plain-English '
        'definition of 8-26 words. No Chinese, no examples, no markdown, no explanation.'
    )
    done = 0
    for start in range(0, len(todo), BATCH):
        chunk = todo[start:start + BATCH]
        terms = [t['en'] for t in chunk]
        listing = '\n'.join('%d. %s (%s)' % (i + 1, t['en'], t.get('zh', ''))
                            for i, t in enumerate(chunk))
        user = ('Define each term below. Use its exact spelling as the JSON key.\n'
                + listing + '\n\nReturn JSON object only.')
        raw = ''
        for attempt in range(2):
            raw = srv.doubao_chat([
                {'role': 'system', 'content': sysprompt},
                {'role': 'user', 'content': user},
            ], max_tokens=1800)
            if extract_json(raw):
                break
            time.sleep(1)
        got = extract_json(raw)

        # 按序号或原名对齐；缺的用降级
        for i, t in enumerate(chunk):
            en = t['en']
            val = got.get(en) or got.get(str(i + 1)) or got.get(en.lower())
            if not isinstance(val, str) or len(val.strip()) < 8 or re.search(r'[\u4e00-\u9fff]', val):
                val = fallback_def(t)
            defs[en] = val.strip()
        done += len(chunk)
        save_json(OUT, defs)  # 每批落盘，可续跑
        print('已生成 %d/%d  (%.0f%%)' % (done, len(todo), 100.0 * done / len(todo)), flush=True)
        time.sleep(0.4)

    print('完成，释义总数:', len(defs), flush=True)


if __name__ == '__main__':
    main()
