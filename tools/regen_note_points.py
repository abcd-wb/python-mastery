#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把已有课堂笔记重新整理成分类重点笔记（只加 points 字段，不删原文）。"""
import os
import sys
import json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)
import serve  # noqa: E402


def main():
    notes = serve.load_notes()
    changed = 0
    for n in notes:
        if n.get('kind') != 'class' or not n.get('text'):
            continue
        if n.get('points') and any(n['points'].values()):
            print('跳过（已有重点）：', n.get('title'))
            continue
        print('整理：', n.get('title'), '（%d 字）' % len(n['text']))
        result = serve.doubao_chat([{'role': 'user', 'content': serve.class_note_prompt(n['text'])}])
        if not result:
            print('  AI 返回空，保留原文，跳过')
            continue
        pts = serve.parse_note_points(result)
        n['points'] = pts
        changed += 1
        for k, v in pts.items():
            if v:
                print('  %s: %d 条' % (serve.NOTE_POINT_TAGS[k], len(v)))
    if changed:
        serve.save_notes(notes)
    print('完成，更新 %d 篇。' % changed)


if __name__ == '__main__':
    main()
