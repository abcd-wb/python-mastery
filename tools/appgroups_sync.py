#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
把新装的应用自动收进「应用分组」（/Applications/应用分组.app）的对应分组里。

分组配置：~/Library/Application Support/AppGroups/groups.json
只做「追加」，从不删除已有条目。每次写入前自动备份一份 groups.json.bak。

用法：
    python3 tools/appgroups_sync.py --dry-run      # 只看会发生什么
    python3 tools/appgroups_sync.py                # 真的写进去
    python3 tools/appgroups_sync.py --only 雅思哥   # 只处理名字包含这个词的应用
    python3 tools/appgroups_sync.py --list         # 看当前分组情况
"""

import json
import os
import sys
import uuid
import shutil
from datetime import datetime

CONF_DIR = os.path.expanduser('~/Library/Application Support/AppGroups')
CONF = os.path.join(CONF_DIR, 'groups.json')

SCAN_DIRS = ['/Applications', os.path.expanduser('~/Applications'), '/System/Applications']

# 按顺序匹配，先命中先归类
RULES = [
    ('AI 与效率', ['workbuddy', 'deepseek', 'chatgpt', 'openai', 'claude', 'codex', 'cursor', 'copilot',
                   'raycast', 'alfred', 'figma', 'sketch', 'notion', 'obsidian', 'stats', 'monitor',
                   'iterm', 'terminal', 'vscode', 'visual studio', 'xcode', 'python', 'docker',
                   'idle', 'applet']),
    ('语言学习', ['ielts', '雅思', 'toefl', '托福', 'duolingo', 'anki', 'hello talk', 'hellotalk',
                  'language', 'english', 'dictionary', '词典', 'translate', '翻译', 'amazingtalker',
                  'grammarly', 'lingo', '学习平台']),
    ('会议协作', ['meeting', '腾讯会议', 'zoom', 'teams', 'webex', 'voov', '钉钉', 'dingtalk',
                  '飞书', 'feishu', 'lark', 'slack', 'todoist', 'trello', 'jira']),
    ('社交通讯', ['wechat', '微信', 'qq', 'telegram', 'whatsapp', 'discord', 'messages', 'mail',
                  '小红书', 'rednote', 'weibo', '微博', 'twitter', 'instagram']),
    ('影音创作', ['music', 'video', 'photo', 'camera', 'garageband', 'imovie', 'final cut',
                  'premiere', 'capcut', '剪映', 'vlc', 'player', '录屏', 'obs', 'audacity',
                  'keynote creator', 'podcast', 'spotify', 'netflix', 'bilibili', '哔哩']),
    ('文档办公', ['pages', 'numbers', 'keynote', 'word', 'excel', 'powerpoint', 'office', 'wps',
                  'pdf', 'preview', 'textedit', 'notes', '备忘录', 'calendar', '日历', 'reminders',
                  '提醒', 'calculator', '计算器', 'stickies', 'journal']),
    ('浏览资讯', ['safari', 'chrome', 'edge', 'firefox', 'arc', 'browser', '浏览器', 'news',
                  'reader', 'books', '图书', 'stocks', 'weather']),
    ('系统工具', ['utility', 'disk', 'activity', 'system', 'settings', '系统设置', 'console',
                  'terminal', 'migration', 'screenshot', '截图']),
]
DEFAULT_GROUP = '其他'
SKIP = {'应用分组.app', 'AppGroups.app'}   # 启动器自己不进分组


def load():
    if not os.path.exists(CONF):
        return []
    with open(CONF, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data if isinstance(data, list) else []


def save(groups):
    os.makedirs(CONF_DIR, exist_ok=True)
    if os.path.exists(CONF):
        shutil.copy2(CONF, CONF + '.bak')
    tmp = CONF + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(groups, f, ensure_ascii=False, separators=(',', ':'))
    os.replace(tmp, CONF)


def scan_apps():
    """扫出所有 .app 路径，最多下钻两层（兼容 /Applications/AI/xxx.app）"""
    found = []
    for root_dir in SCAN_DIRS:
        if not os.path.isdir(root_dir):
            continue
        base_depth = root_dir.rstrip('/').count('/')
        for root, dirs, files in os.walk(root_dir):
            # 先记下这一层的 .app，再把它们从遍历队列里剪掉（不钻进包内）
            for d in list(dirs):
                if d.endswith('.app'):
                    found.append(os.path.join(root, d))
            dirs[:] = [d for d in dirs if not d.endswith('.app') and not d.startswith('.')]
            if root.rstrip('/').count('/') - base_depth >= 2:
                dirs[:] = []
    return found


def classify(path):
    name = os.path.basename(path).lower()
    for group, keys in RULES:
        for k in keys:
            if k in name:
                return group
    return DEFAULT_GROUP


def ensure_group(groups, name):
    for g in groups:
        if g.get('name') == name:
            return g
    g = {'name': name, 'id': str(uuid.uuid4()), 'paths': []}
    groups.append(g)
    return g


def main():
    args = sys.argv[1:]
    dry = '--dry-run' in args
    only = None
    if '--only' in args:
        i = args.index('--only')
        if i + 1 < len(args):
            only = args[i + 1].strip()

    groups = load()
    if not groups:
        print('找不到分组配置：%s' % CONF)
        return 1

    if '--list' in args:
        for g in groups:
            print('%-8s %2d 个' % (g.get('name'), len(g.get('paths', []))))
            for p in g.get('paths', []):
                print('    ' + p)
        return 0

    known = set()
    for g in groups:
        for p in g.get('paths', []):
            known.add(os.path.normpath(p))

    apps = scan_apps()
    if only:
        apps = [a for a in apps if only.lower() in os.path.basename(a).lower()]

    todo = []
    for a in apps:
        if os.path.basename(a) in SKIP:
            continue
        if os.path.normpath(a) in known:
            continue
        todo.append((a, classify(a)))

    if not todo:
        print('没有需要新加的应用（已分组 %d 个）。' % len(known))
        return 0

    for path, gname in todo:
        print('%s  →  %s' % (os.path.basename(path), gname))

    if dry:
        print('\n[dry-run] 以上 %d 个会加进去，没有写入。' % len(todo))
        return 0

    for path, gname in todo:
        g = ensure_group(groups, gname)
        if os.path.normpath(path) not in [os.path.normpath(x) for x in g['paths']]:
            g['paths'].append(path)

    save(groups)
    print('\n已加入 %d 个应用，配置已更新（备份：groups.json.bak，%s）'
          % (len(todo), datetime.now().strftime('%H:%M:%S')))
    return 0


if __name__ == '__main__':
    sys.exit(main())
