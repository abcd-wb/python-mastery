#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
本地服务：静态页面 + 资料库上传接口。

用法：
    python3 serve.py            # 默认 http://127.0.0.1:8101
    python3 serve.py 8123       # 换端口

资料库文件真实保存在 data/ielts-files/ 目录里，关掉浏览器、重启电脑都还在。
索引写在 data/ielts-files/index.json。
"""

import base64
import glob
import hashlib
import json
import os
import re
import sys
import time
import shutil
import mimetypes
import signal
import subprocess
import threading
import urllib.parse
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.abspath(__file__))
STORE = os.path.join(ROOT, 'data', 'ielts-files')
INDEX = os.path.join(STORE, 'index.json')
MAX_BYTES = 512 * 1024 * 1024  # 单文件上限 512 MB


def pids_of(pattern):
    """按命令行片段找进程。

    这个 iOS 包实际跑在系统给的随机临时目录里，路径每次都变，只能按名字找。
    pgrep 直接 exec，不经过 shell，所以命令行里带这个字符串的 shell 不会被误认。
    """
    if not pattern:
        return []
    try:
        r = subprocess.run(['pgrep', '-f', pattern], capture_output=True, timeout=5)
    except Exception:
        return []
    me = os.getpid()
    out = []
    for tok in r.stdout.split():
        try:
            pid = int(tok)
        except ValueError:
            continue
        if pid != me:
            out.append(pid)
    return out


WINCHECK = os.path.join(ROOT, 'tools', 'bin', 'wincheck')


def wins_of(name):
    """返回 (屏幕上的窗口数, 总窗口数)，拿不到返回 None。

    进程活着但窗口被最小化 / 扔到别的桌面时，点图标不会有任何反应——
    这种情况只能重开一个窗口。
    """
    if not name or not os.path.exists(WINCHECK):
        return None
    try:
        r = subprocess.run([WINCHECK, name], capture_output=True, timeout=8)
        parts = r.stdout.decode().split()
        if len(parts) >= 2:
            return (int(parts[0]), int(parts[1]))
    except Exception:
        pass
    return None


APPS = {
    'ieltsbro': {
        'name': '雅思哥机考软件',
        # 官方 Mac 机考软件（Electron），之前那个 iPad 套壳版跑不起来
        'path': '/Applications/雅思哥机考软件.app',
        'bundle': 'com.hcp.ieltspc',
        # 只匹配主进程：Helper 的路径里也带这个名字，用 $ 锚住结尾
        'proc': [r'MacOS/雅思哥机考软件$'],
        # 窗口所属进程名，用来判断「进程在、窗口却看不见」
        'win': '雅思哥机考软件',
    },
    'tencentmeeting': {
        'name': '腾讯会议',
        'path': '/Applications/TencentMeeting.app',
        'scheme': 'wemeet://',
        'bundle': 'com.tencent.meeting',
    },
}


def ensure_store():
    os.makedirs(STORE, exist_ok=True)


def load_index():
    ensure_store()
    if not os.path.exists(INDEX):
        return []
    try:
        with open(INDEX, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data if isinstance(data, list) else []
    except Exception:
        return []


def save_index(items):
    ensure_store()
    tmp = INDEX + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(items, f, ensure_ascii=False, indent=1)
    os.replace(tmp, INDEX)


ERR_FILE = os.path.join(ROOT, 'data', 'ielts-errors.json')
REC_FILE = os.path.join(ROOT, 'data', 'ielts-records.json')
OCR_BIN = os.path.join(ROOT, 'tools', 'bin', 'ocr')
PDFTEXT_BIN = os.path.join(ROOT, 'tools', 'bin', 'pdftext')

# 能按纯文本读的格式（直接 decode）；其余交给 pdftext / ocr
TEXT_EXTS = {'.txt', '.md', '.csv', '.tsv', '.text', '.log', '.json', '.srt', '.ass', '.vtt', ''}
# 系统 textutil 能转的富文本/文档格式
RICH_EXTS = {'.doc', '.docx', '.rtf', '.rtfd', '.odt', '.html', '.htm', '.webarchive'}
# 图片：直接 OCR
IMG_EXTS = {'.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.tif', '.tiff', '.heic'}


def load_records():
    if not os.path.exists(REC_FILE):
        return []
    try:
        with open(REC_FILE, 'r', encoding='utf-8') as f:
            d = json.load(f)
        return d if isinstance(d, list) else []
    except Exception:
        return []


def save_records(items):
    tmp = REC_FILE + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(items, f, ensure_ascii=False, indent=1)
    os.replace(tmp, REC_FILE)


SEC_WORDS = [
    ('听力', ['听力', 'listening', '听']),
    ('阅读', ['阅读', 'reading', '读']),
    ('写作', ['写作', 'writing', '作文', 'task 1', 'task 2']),
    ('口语', ['口语', 'speaking', 'part 1', 'part 2', 'part 3']),
]


def parse_report(text):
    """把 OCR 出来的成绩页文字，猜成一条记录。"""
    low = (text or '').lower()
    sec = ''
    best = 0
    for name, keys in SEC_WORDS:
        n = sum(low.count(k) for k in keys)
        if n > best:
            best, sec = n, name

    band = ''
    flat = re.sub(r'[ \t]+', ' ', text or '')
    # 成绩页的分数基本都写成 6.5 / 7.0 这种一位小数；百分比排除掉
    m = re.search(r'(?<![\d.])([1-9]\.\d)(?!\s*[/／%])', flat)
    if not m:
        m = re.search(r'(?:总分|得分|分数|成绩|band)[^\n]{0,10}(?<![\d.])([1-9])(?![\d.]|\s*[/／%])', flat, re.I)
    if not m:
        m = re.search(r'\b([1-9](?:\.5)?)\s*分\b', flat)
    if m:
        band = m.group(1)

    right = total = pct = ''
    m = re.search(r'(?:答对|正确|对的)[\s\S]{0,50}?(\d{1,2})\s*[/／]\s*(\d{1,2})', flat)
    if not m:
        m = re.search(r'(?<![\d.])(\d{1,2})\s*[/／]\s*(\d{1,2})(?![\d.])', flat)
    if m:
        right, total = m.group(1), m.group(2)
    m = re.search(r'(?:正确率|准确率)[\s\S]{0,50}?(\d{1,3}(?:\.\d)?)\s*%', flat)
    if not m:
        m = re.search(r'(\d{1,3}(?:\.\d)?)\s*%', flat)
    if m:
        pct = m.group(1)

    wrong = []
    m = re.search(r'错题[：:\s]*([\d\s,，、;；]{1,80})', text or '')
    if m:
        wrong = [int(x) for x in re.findall(r'\d{1,2}', m.group(1))][:40]

    lines = [x.strip() for x in (text or '').splitlines() if x.strip()]
    title = lines[0][:60] if lines else ''

    return {'sec': sec, 'band': band, 'right': right, 'total': total,
            'pct': pct, 'wrong': wrong, 'title': title}

# 讲解语音：本地缓存，合成一次以后秒开，断网也能听
TTS_DIR = os.path.join(ROOT, 'data', 'tts-cache')
TTS_VOICES = {
    'zh-CN-XiaoxiaoNeural',   # 中文讲解（女声，和上课提醒同一个）
    'zh-CN-XiaoyiNeural',
    'en-US-AriaNeural',       # 英文女声，读正确句子
    'en-US-JennyNeural',
    'en-GB-SoniaNeural',
}
EDGE_TTS = (shutil.which('edge-tts')
            or os.path.expanduser('~/.workbuddy/binaries/python/versions/3.13.12/bin/edge-tts'))


def tts_file(text, voice, rate):
    key = hashlib.sha1((voice + '|' + rate + '|' + text).encode('utf-8')).hexdigest()[:24]
    return os.path.join(TTS_DIR, key + '.mp3')


def tts_make(text, voice, rate):
    """返回 mp3 路径；合成不了返回空串（前端会退回浏览器朗读）。"""
    os.makedirs(TTS_DIR, exist_ok=True)
    fp = tts_file(text, voice, rate)
    if os.path.exists(fp) and os.path.getsize(fp) > 500:
        return fp
    if not (EDGE_TTS and os.path.exists(EDGE_TTS)):
        return ''
    tmp = fp + '.part'
    try:
        # 注意：-4% 以减号开头，必须用 --rate=-4% 的等号写法，否则 argparse 当成选项
        r = subprocess.run([EDGE_TTS, '--voice=' + voice, '--rate=' + rate,
                            '--text=' + text, '--write-media=' + tmp],
                           capture_output=True, timeout=40)
        if r.returncode != 0 or not os.path.exists(tmp) or os.path.getsize(tmp) < 500:
            if os.path.exists(tmp):
                os.remove(tmp)
            return ''
        os.replace(tmp, fp)
        return fp
    except Exception:
        if os.path.exists(tmp):
            try:
                os.remove(tmp)
            except OSError:
                pass
        return ''


def load_errors():
    if not os.path.exists(ERR_FILE):
        return []
    try:
        with open(ERR_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data if isinstance(data, list) else []
    except Exception:
        return []


def save_errors(items):
    os.makedirs(os.path.dirname(ERR_FILE), exist_ok=True)
    tmp = ERR_FILE + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(items, f, ensure_ascii=False, indent=1)
    os.replace(tmp, ERR_FILE)


WORD_DIR = os.path.join(ROOT, 'data', 'words-files')
WORD_INDEX = os.path.join(WORD_DIR, 'index.json')
WORDS_JSON = os.path.join(ROOT, 'data', 'words.json')

CJK = re.compile(r'[\u4e00-\u9fff]')
PHON = re.compile(r'[\/\[]([^\/\]\n]{2,44})[\/\]]')
LATIN = re.compile(r'^[A-Za-z][A-Za-z\'’\-]*(?:\s+[A-Za-z][A-Za-z\'’\-]*){0,2}$')


def load_words():
    if not os.path.exists(WORDS_JSON):
        return []
    try:
        with open(WORDS_JSON, 'r', encoding='utf-8') as f:
            d = json.load(f)
        return d if isinstance(d, list) else []
    except Exception:
        return []


def save_words(items):
    tmp = WORDS_JSON + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(items, f, ensure_ascii=False, indent=1)
    os.replace(tmp, WORDS_JSON)


def load_word_files():
    if not os.path.exists(WORD_INDEX):
        return []
    try:
        with open(WORD_INDEX, 'r', encoding='utf-8') as f:
            d = json.load(f)
        return d if isinstance(d, list) else []
    except Exception:
        return []


def save_word_files(items):
    os.makedirs(WORD_DIR, exist_ok=True)
    tmp = WORD_INDEX + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(items, f, ensure_ascii=False, indent=1)
    os.replace(tmp, WORD_INDEX)


def parse_word_line(raw):
    """一行文本 → {w, phon, cn, ex}，认不出单词就返回 None。

    支持的写法（混着用也行）：
        abandon /əˈbændən/ vt.放弃        He abandoned his car.
        abandon | 放弃 | He abandoned his car.
        abandon, 放弃
    """
    s = (raw or '').strip()
    if not s or s.startswith('#'):
        return None
    s = re.sub(r'^\s*\d{1,4}\s*[.、\)]\s*', '', s)          # 行首序号
    s = re.sub(r'\s{2,}', '\t', s)                            # 多空格当分隔
    s = s.replace('｜', '|')

    cols = [c.strip() for c in re.split(r'\t+|\s*\|\s*|\s*;\s*|\s+-\s+|\s*[:：]\s*', s) if c.strip()]
    if not cols:
        return None

    w = ''
    body_cols = []
    first = cols[0]
    m = re.match(r"^([A-Za-z][A-Za-z'’\-]*(?:\s+[A-Za-z][A-Za-z'’\-]*){0,2})\s*(.*)$", first)
    if m:
        w = m.group(1).strip()
        if m.group(2).strip():
            body_cols.append(m.group(2).strip())
        body_cols.extend(cols[1:])
    else:
        # 中文在前（"可持续发展 | sustainable development"），找第一个纯英文列当词
        for i, c in enumerate(cols):
            if LATIN.match(c.split('/')[0].strip()):
                w = c.split('/')[0].strip()
                body_cols = cols[:i] + cols[i + 1:]
                break
    if not w or len(w) > 40:
        return None

    body = ' '.join(body_cols)
    phon = ''
    pm = PHON.search(body)
    if pm:
        phon = pm.group(1).strip()
        body = body.replace(pm.group(0), ' ')

    # 例句：把中文当分隔符切开，取最长的、词数≥4 的英文片段
    ex = ''
    for piece in re.split(r'[\u4e00-\u9fff，、；：（）]+', body):
        piece = re.sub(r'\s{2,}', ' ', piece).strip(' \t;,|')
        if not piece or CJK.search(piece):
            continue
        words = piece.split()
        if len(words) >= 4 and len(piece) > len(ex):
            ex = piece
    if ex:
        body = body.replace(ex, ' ')

    cn = ' '.join(re.findall(r'[\u4e00-\u9fff][\u4e00-\u9fff，、；：（）()·\s]*', body)).strip()
    cn = re.sub(r'\s{2,}', ' ', cn).strip(' ，、；')

    # 单个纯英文词（无音标无中文）：也收下，交给词典补全去填中文/例句
    single = re.match(r"^[A-Za-z][A-Za-z'’\-]*$", w) is not None
    if not cn and not phon:
        if not single:
            return None
    if ' ' in w and not cn:
        return None

    return {'w': w, 'phon': phon, 'cn': cn[:80], 'ex': ex[:200]}


def parse_words_text(text, src=''):
    out, seen = [], set()
    for line in (text or '').splitlines():
        it = parse_word_line(line)
        if not it:
            continue
        k = it['w'].lower()
        if k in seen:
            continue
        seen.add(k)
        it['src'] = src
        out.append(it)
    return out


# ---------- 豆包（火山方舟）语音转文字 + AI 分析 ----------
# 一个 key、一个多模态模型 doubao-seed-2-1-lite 同时做「听音频转文字」和「语法/发音分析」。

KEYS_FILE = os.path.join(ROOT, 'data', 'keys.json')
ARK_BASE = 'https://ark.cn-beijing.volces.com/api/v3'


def load_keys():
    if not os.path.exists(KEYS_FILE):
        return {}
    try:
        with open(KEYS_FILE, 'r', encoding='utf-8') as f:
            d = json.load(f)
        return d if isinstance(d, dict) else {}
    except Exception:
        return {}


def ark_api_key():
    keys = load_keys()
    return (keys.get('doubao') or {}).get('api_key', '').strip()


def ark_model(kind):
    keys = load_keys()
    db = keys.get('doubao') or {}
    return (db.get(kind) or '').strip()


def doubao_chat(messages, model=None, max_tokens=2000):
    """调火山方舟 chat/completions，返回文本或空串。"""
    key = ark_api_key()
    model = model or ark_model('analysis_model') or 'doubao-seed-2-1-lite-260915'
    if not key:
        return ''
    payload = {'model': model, 'messages': messages, 'max_tokens': max_tokens}
    req = urllib.request.Request(
        ARK_BASE + '/chat/completions',
        data=json.dumps(payload).encode('utf-8'),
        headers={'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            d = json.loads(r.read().decode('utf-8', 'replace'))
        return (d.get('choices') or [{}])[0].get('message', {}).get('content', '').strip()
    except Exception:
        return ''


def doubao_asr(audio_b64, fmt='m4a', mode=''):
    """语音转文字：把 base64 音频发给豆包识别。返回文本或空串。
    mode='words' 时按「一行一个单词」输出，供词库批量导入；默认原样转文字（课堂笔记用）。"""
    key = ark_api_key()
    model = ark_model('asr_model') or 'doubao-seed-2-1-lite-260915'
    if not key or not audio_b64:
        return ''
    if mode == 'words':
        prompt = ('这段音频是有人在念英语单词表。请把听到的每个单词单独占一行输出，'
                  '格式是「英文单词 中文意思」，中文没念就只写英文单词。'
                  '多个词就写多行，不要编号、不要加标点、不要任何解释或标题。'
                  '例如：\nabandon 放弃\ncurious 好奇的')
    else:
        prompt = '请识别这段音频里的全部内容，原样转成文字（中英文都要，不要漏句），只输出文字本身，不要任何解释、不要加标题。'
    payload = {
        'model': model,
        'messages': [{'role': 'user', 'content': [
            {'type': 'input_audio', 'input_audio': {'data': audio_b64, 'format': fmt}},
            {'type': 'text', 'text': prompt}
        ]}]
    }
    req = urllib.request.Request(
        ARK_BASE + '/chat/completions',
        data=json.dumps(payload).encode('utf-8'),
        headers={'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=180) as r:
            d = json.loads(r.read().decode('utf-8', 'replace'))
        return (d.get('choices') or [{}])[0].get('message', {}).get('content', '').strip()
    except Exception:
        return ''


# ---------- 笔记存储 ----------
NOTES_FILE = os.path.join(ROOT, 'data', 'ielts-notes.json')


def load_notes():
    if not os.path.exists(NOTES_FILE):
        return []
    try:
        with open(NOTES_FILE, 'r', encoding='utf-8') as f:
            d = json.load(f)
        return d if isinstance(d, list) else []
    except Exception:
        return []


def save_notes(items):
    os.makedirs(os.path.dirname(NOTES_FILE), exist_ok=True)
    tmp = NOTES_FILE + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(items, f, ensure_ascii=False, indent=1)
    os.replace(tmp, NOTES_FILE)


# ---------- 课表：存本机文件，Chrome / 预览面板 / 任何窗口都读同一份 ----------
# 用户铁律（2026-11-15）：以后做任何平台完善，都不许清除 / 重置 / 覆盖已排好的课。
# 三层保护：① 只增不删的历史归档 ② 已有课时拒绝清空到 0 ③ 每次覆盖前留 .bak。
# 不要绕过、削弱或删除这些代码；验证接口时只准原样回写 GET 到的数据。
PLAN_FILE = os.path.join(ROOT, 'data', 'ielts-plan.json')
PLAN_BAK = os.path.join(ROOT, 'data', 'ielts-plan.bak.json')
PLAN_HISTORY = os.path.join(ROOT, 'data', 'ielts-plan-history')


def load_plan(path=None):
    target = path or PLAN_FILE
    try:
        with open(target, 'r', encoding='utf-8') as f:
            d = json.load(f)
        if isinstance(d, dict) and isinstance(d.get('data'), dict):
            d['ok'] = True
            return d
    except Exception:
        pass
    return {'ok': True, 'data': None, 'ts': 0}


def plan_courses(d):
    try:
        return len((d.get('data') or {}).get('local') or [])
    except Exception:
        return 0


def archive_plan():
    """覆盖前留一份带时间戳的快照，只增不删，任何时候都能找回原课表。"""
    if not os.path.exists(PLAN_FILE):
        return None
    try:
        os.makedirs(PLAN_HISTORY, exist_ok=True)
        with open(PLAN_FILE, 'r', encoding='utf-8') as f:
            n = plan_courses(json.load(f))
        base = 'plan-%s-%02d' % (time.strftime('%Y%m%d-%H%M%S'), n)
        name, i = base + '.json', 1
        while os.path.exists(os.path.join(PLAN_HISTORY, name)):
            name = '%s-%d.json' % (base, i)
            i += 1
        shutil.copyfile(PLAN_FILE, os.path.join(PLAN_HISTORY, name))
        return name
    except Exception:
        return None


def plan_history():
    out = []
    try:
        for fn in sorted(os.listdir(PLAN_HISTORY), reverse=True):
            if not (fn.startswith('plan-') and fn.endswith('.json')):
                continue
            p = os.path.join(PLAN_HISTORY, fn)
            try:
                with open(p, 'r', encoding='utf-8') as f:
                    d = json.load(f)
                out.append({'file': fn, 'ts': d.get('ts', 0),
                            'savedAt': d.get('savedAt', ''),
                            'courses': plan_courses(d), 'bytes': os.path.getsize(p)})
            except Exception:
                continue
    except Exception:
        pass
    return out[:60]


def save_plan(payload):
    data = payload.get('data')
    if not isinstance(data, dict):
        return None
    cur_n = plan_courses(load_plan())
    new_n = len(data.get('local') or [])
    # 铁律：已有课时，只有用户主动点「清空课表」并带 allowClear 才允许写成 0
    if cur_n > 0 and new_n == 0 and not payload.get('allowClear'):
        return {'blocked': True, 'courses': cur_n}
    os.makedirs(os.path.dirname(PLAN_FILE), exist_ok=True)
    archive_plan()
    try:
        if os.path.exists(PLAN_FILE):
            shutil.copyfile(PLAN_FILE, PLAN_BAK)
    except Exception:
        pass
    out = {'ok': True, 'data': data, 'ts': int(payload.get('ts') or time.time() * 1000),
           'savedAt': time.strftime('%Y-%m-%d %H:%M:%S')}
    tmp = PLAN_FILE + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    os.replace(tmp, PLAN_FILE)
    return out


# ---------- 上课守护：浏览器全关 / 只开桌面应用时，也能按课表时间自动记笔记 ----------
# 只读课表，绝不改写（用户铁律）。平台标签页活着时由 auto-note.js 负责；
# 只有检测到「一个平台页都没开」时，服务才在上课时间后台拉起笔记页。
# 笔记页带 auto=1 自动开录、带 end 到下课自己停录并生成 AI 笔记，不需要额外停录指令。
PORT = 8101
GUARD_FILE = os.path.join(ROOT, 'data', 'ielts-note-guard.json')
GUARD_LOG = os.path.join(ROOT, 'data', 'note-guard.log')
# state：每节课服务端拉起过笔记页的记录；done：已录完/用户主动结束的课，不再重复拉起
# rec_key / rec_ts：笔记页「正在录音」的心跳，只有它才是「这节课真的在录」的唯一证据
GUARD = {'last_hb': 0.0, 'state': {}, 'done': set(), 'rec_key': '', 'rec_ts': 0.0}
GUARD_LOCK = threading.Lock()


def log_guard(msg):
    """守护动作留痕：以后能直接看 data/note-guard.log 判断是没录还是没声音。"""
    try:
        os.makedirs(os.path.dirname(GUARD_LOG), exist_ok=True)
        with open(GUARD_LOG, 'a', encoding='utf-8') as f:
            f.write('[%s] %s\n' % (time.strftime('%Y-%m-%d %H:%M:%S'), msg))
    except Exception:
        pass


def load_guard():
    try:
        with open(GUARD_FILE, 'r', encoding='utf-8') as f:
            d = json.load(f)
        if isinstance(d, dict):
            return {
                'state': d['state'] if isinstance(d.get('state'), dict) else {},
                'done': set(d['done']) if isinstance(d.get('done'), list) else set(),
            }
    except Exception:
        pass
    return {'state': {}, 'done': set()}


def save_guard():
    try:
        os.makedirs(os.path.dirname(GUARD_FILE), exist_ok=True)
        with GUARD_LOCK:
            payload = {'state': GUARD['state'], 'done': sorted(GUARD['done'])}
        tmp = GUARD_FILE + '.tmp'
        with open(tmp, 'w', encoding='utf-8') as f:
            json.dump(payload, f, ensure_ascii=False, indent=1)
        os.replace(tmp, GUARD_FILE)
    except Exception:
        pass


def guard_hb():
    """普通平台页心跳：只说明「有人开着平台页面」，不代表这节课在录音。"""
    with GUARD_LOCK:
        GUARD['last_hb'] = time.time()


def guard_alive():
    with GUARD_LOCK:
        return (time.time() - GUARD['last_hb']) < 45


def rec_hb(lesson, st):
    """笔记页录音心跳。st='rec' 正在录；st='done' 这节课已结束（正常录完或用户主动停）。"""
    first = False
    with GUARD_LOCK:
        if st == 'done':
            if lesson:
                GUARD['done'].add(lesson)
            GUARD['rec_key'] = ''
            GUARD['rec_ts'] = 0.0
        else:
            first = (GUARD['rec_key'] or '') != (lesson or '')
            GUARD['rec_key'] = lesson or ''
            GUARD['rec_ts'] = time.time()
    if st == 'done':
        log_guard('🎧 录音结束：%s' % (lesson or '（未标课次）'))
        save_guard()   # 立刻落盘：服务重启后不会又把已录完的课重新拉起一遍
    elif first:
        log_guard('🎙 笔记页开始录音：%s' % (lesson or '（未标课次）'))


def rec_alive(lesson):
    """这节课此刻是否真的有笔记页在录音（40 秒内报过 rec）。
    课次为空时视为「正在录但没标课次」——宁可不重复开窗，也不要打断已经在录的页面。"""
    with GUARD_LOCK:
        if (time.time() - GUARD['rec_ts']) >= 40:
            return False
        k = GUARD['rec_key'] or ''
        return (not k) or k == (lesson or '')


def plan_lessons():
    """只读课表：返回需要自动录音的课（毫秒时间戳）。不写任何文件。"""
    d = load_plan().get('data') or {}
    out = []
    for o in d.get('local') or []:
        if o.get('type') == 'plan' or o.get('note') == 0 or o.get('noNote'):
            continue
        try:
            h, m = int(o['h']), int(o['m'])
            st = time.mktime(time.strptime('%s %02d:%02d' % (o['d'], h, m), '%Y-%m-%d %H:%M'))
        except Exception:
            continue
        dur = o.get('dur') or 60
        if o.get('eh') is not None and o.get('em') is not None:
            dd = (int(o['eh']) * 60 + int(o['em'])) - (h * 60 + m)
            if dd <= 0:
                dd += 1440
            if 0 < dd <= 360:
                dur = dd
        out.append({'key': '%s %02d:%02d' % (o['d'], h, m),
                    'name': o.get('k') or '这节课',
                    'st': st * 1000, 'en': (st + dur * 60) * 1000})
    return out


def guard_tick():
    """只在「这节课确实没人录」时拉起笔记页。
    旧逻辑用「有没有平台页开着」当判据，导致只要 Chrome 里有任一平台标签页，
    服务端就永不接管——今天 19:30 的外教课就是这么漏掉的（页面在，但录的是别的课/根本没录）。"""
    now = time.time() * 1000
    state = GUARD['state']
    changed = False
    for l in plan_lessons():
        key = l['key']
        if l['st'] <= now < l['en']:
            if key in GUARD['done']:
                continue          # 这节课已经录完/用户主动结束，不再重复拉起
            if rec_alive(key):
                continue          # 笔记页正在录这节课，不用管
            prev = state.get(key) or {}
            # 已经拉起过但还没开始录 → 90 秒后允许再试，一节课最多 3 次，避免无限刷窗口
            if prev.get('at') and (now - prev['at']) < 90000:
                continue
            if (prev.get('try') or 0) >= 3:
                continue
            url = ('http://127.0.0.1:%d/ielts-notes.html?kind=class&auto=1&guard=1'
                   '&name=%s&lesson=%s&end=%d' %
                   (PORT, urllib.parse.quote(l['name']),
                    urllib.parse.quote(key), int(l['en'])))
            try:
                # -g：后台打开，不把 Chrome 抢到前台打断桌面应用上课
                subprocess.Popen(['open', '-g', '-a', 'Google Chrome', url],
                                 stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                state[key] = {'at': int(now), 'via': 'server', 'try': (prev.get('try') or 0) + 1}
                changed = True
                log_guard('⚡ 服务端拉起笔记页：%s %s（第 %d 次尝试）' %
                          (key, l['name'], state[key]['try']))
            except Exception as e:
                log_guard('❌ 拉起笔记页失败：%s %s: %r' % (key, l['name'], e))
        elif l['en'] <= now < l['en'] + 6 * 3600 * 1000:
            # 下课了但整节课从没录到任何东西 → 明确记一笔，方便事后追查
            key_end = 'end_logged_' + key
            if key not in GUARD['done'] and not state.get(key_end):
                state[key_end] = {'at': int(now), 'via': 'audit'}
                changed = True
                log_guard('⚠️ 下课核查：%s %s 这节课没有录音记录（无 done、无 rec 心跳）' %
                          (key, l['name']))
    if changed:
        save_guard()


def guard_loop():
    ticks = 0
    last_sig = None
    while True:
        try:
            guard_tick()
        except Exception:
            pass
        ticks += 1
        if ticks % 20 == 0:  # 每 5 分钟复查一次页面引用
            try:
                broken = scan_broken_refs()
                sig = repr(broken)
                if broken and sig != last_sig:
                    print_ref_report(broken, '[引用守卫·定时]')
                elif not broken and last_sig:
                    print('[引用守卫·定时] ✅ 失效引用已全部修复')
                last_sig = sig
            except Exception:
                pass
        time.sleep(15)


# ---------- 静态资源引用守卫 ----------
# 历史教训：数据文件合并后忘了同步页面里的 <script src>，7 个 404 让课程页整页空白。
# 这里做成启动自检 + 定时复查 + /api/health 接口三重检测，问题一出现就报红。
_REF_RE = re.compile(r'(?:src|href)\s*=\s*"([^"]+?\.(?:js|css))(?:\?[^"]*)?"')
_DATA_FILES = ('data/videos.js', 'data/math.js', 'data/modules.js',
               'data/ai.js', 'assets/core.js')


def scan_broken_refs():
    """返回所有 HTML 中指向不存在文件的本地 js/css 引用。"""
    broken = []
    for f in sorted(glob.glob(os.path.join(ROOT, '*.html'))):
        try:
            s = open(f, encoding='utf-8', errors='ignore').read()
        except OSError:
            continue
        for ref in _REF_RE.findall(s):
            if ref.startswith(('http:', 'https:', '//')):
                continue
            p = os.path.join(ROOT, ref.lstrip('/').split('?')[0])
            if not os.path.isfile(p):
                broken.append({'page': os.path.basename(f), 'ref': ref})
    return broken


def data_files_bad():
    """课程数据文件缺失或过小（被清空）时返回文件名列表。"""
    bad = []
    for rel in _DATA_FILES:
        p = os.path.join(ROOT, rel)
        if not os.path.isfile(p) or os.path.getsize(p) < 100:
            bad.append(rel)
    return bad


def print_ref_report(broken, prefix):
    if broken:
        print('%s ❌ 发现 %d 个失效引用：' % (prefix, len(broken)))
        for b in broken:
            print('   %s -> %s' % (b['page'], b['ref']))
    else:
        print('%s ✅ 所有页面脚本/样式引用有效' % prefix)


# ---------- 课堂术语：中文转英文专业名词 + 用户自定义术语 ----------
USER_TERMS_FILE = os.path.join(ROOT, 'data', 'terms-user.json')
TERM_DEFS_FILE = os.path.join(ROOT, 'data', 'terms-defs.json')
TERM_CACHE_FILE = os.path.join(ROOT, 'data', 'terms-zh2en-cache.json')


def load_user_terms():
    """用户自己添加的专业术语：{en,pos,zh,def,eg,ts,scope} 的列表。"""
    if not os.path.exists(USER_TERMS_FILE):
        return []
    try:
        with open(USER_TERMS_FILE, encoding='utf-8') as f:
            d = json.load(f)
        return d if isinstance(d, list) else []
    except Exception:
        return []


def save_user_terms(items):
    tmp = USER_TERMS_FILE + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(items, f, ensure_ascii=False, indent=1)
    os.replace(tmp, USER_TERMS_FILE)


def load_term_defs():
    if not os.path.exists(TERM_DEFS_FILE):
        return {}
    try:
        with open(TERM_DEFS_FILE, encoding='utf-8') as f:
            d = json.load(f)
        return d if isinstance(d, dict) else {}
    except Exception:
        return {}


def load_zh2en_cache():
    if not os.path.exists(TERM_CACHE_FILE):
        return {}
    try:
        with open(TERM_CACHE_FILE, encoding='utf-8') as f:
            d = json.load(f)
        return d if isinstance(d, dict) else {}
    except Exception:
        return {}


def save_zh2en_cache(d):
    tmp = TERM_CACHE_FILE + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(d, f, ensure_ascii=False, indent=1)
    os.replace(tmp, TERM_CACHE_FILE)


def zh2en_term(zh):
    """中文 -> 英文专业名词。先查用户术语与 AI 缓存；没有则调 AI 生成。"""
    zh = (zh or '').strip()
    if not zh:
        return None
    # 1) 用户自定义术语里按中文精确 / 包含匹配
    for t in load_user_terms():
        if (t.get('zh') or '').strip() == zh or zh in (t.get('zh') or ''):
            return {'en': t.get('en', ''), 'pos': t.get('pos', 'n.'),
                    'zh': t.get('zh', zh), 'def': t.get('def', ''),
                    'eg': t.get('eg', ''), 'source': 'user'}
    # 2) 已翻译缓存
    cache = load_zh2en_cache()
    if zh in cache:
        r = dict(cache[zh]); r['source'] = 'cache'; return r

    # 3) AI 生成
    if not ark_api_key():
        return None
    prompt = (
        '你是专业英语术语词典。把用户给的中文专业术语翻译成对应的英文专业名词。\n'
        '只输出一个 JSON 对象，不要任何解释，字段为：\n'
        '{"en":"英文名词","pos":"n.","def":"8-24词的纯英文释义","eg":"一句用到该词的英文专业例句"}\n'
        '中文术语：' + zh
    )
    raw = doubao_chat([{'role': 'user', 'content': prompt}], max_tokens=350)
    if not raw:
        return None
    t = raw.strip().replace('```json', '').replace('```', '').strip()
    i, j = t.find('{'), t.rfind('}')
    if i < 0 or j <= i:
        return None
    try:
        d = json.loads(t[i:j + 1])
    except Exception:
        return None
    en = (d.get('en') or '').strip()
    if not en:
        return None
    rec = {'en': en, 'pos': d.get('pos') or 'n.',
           'zh': zh, 'def': (d.get('def') or '').strip(),
           'eg': (d.get('eg') or '').strip(), 'source': 'ai'}
    cache[zh] = rec
    save_zh2en_cache(cache)
    return rec


# ---------- 高分积累：场景 + 条目 ----------
COLLECT_FILE = os.path.join(ROOT, 'data', 'ielts-collect.json')
DEF_SCENES = [
    {'id': 'write',   'name': '写作句型',     'icon': '✍️', 'color': '#2563eb'},
    {'id': 'speak',   'name': '口语表达',     'icon': '🗣', 'color': '#0d9488'},
    {'id': 'read',    'name': '阅读长难句',   'icon': '📚', 'color': '#7c3aed'},
    {'id': 'listen',  'name': '听力同义替换', 'icon': '🎧', 'color': '#ea580c'},
    {'id': 'vocab',   'name': '高频词汇',     'icon': '🔤', 'color': '#059669'},
    {'id': 'idea',    'name': '观点素材',     'icon': '💡', 'color': '#d97706'},
    {'id': 'grammar', 'name': '语法易错',     'icon': '🧩', 'color': '#db2777'},
    {'id': 'example', 'name': '万能例子',     'icon': '📌', 'color': '#475569'},
    {'id': 'misc',    'name': '未分类',       'icon': '📥', 'color': '#8b98ad'},
]


def load_collect():
    """读积累库；文件不存在时给一套默认场景。"""
    if not os.path.exists(COLLECT_FILE):
        return {'scenes': [dict(x) for x in DEF_SCENES], 'items': []}
    try:
        with open(COLLECT_FILE, 'r', encoding='utf-8') as f:
            d = json.load(f)
        if not isinstance(d, dict):
            raise ValueError('bad')
    except Exception:
        return {'scenes': [dict(x) for x in DEF_SCENES], 'items': []}
    scenes = d.get('scenes') or []
    items = d.get('items') or []
    if not any(x.get('id') == 'misc' for x in scenes):
        scenes.append(dict(DEF_SCENES[-1]))
    return {'scenes': scenes, 'items': items}


def save_collect(d):
    os.makedirs(os.path.dirname(COLLECT_FILE), exist_ok=True)
    tmp = COLLECT_FILE + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(d, f, ensure_ascii=False, indent=1)
    os.replace(tmp, COLLECT_FILE)


def collect_bytes():
    try:
        return os.path.getsize(COLLECT_FILE)
    except Exception:
        return 0


def collect_scene(d, hint):
    """按 id / 名字 / 包含关系找场景，找不到返回 None。"""
    s = str(hint or '').strip()
    if not s:
        return None
    for x in d['scenes']:
        if x.get('id') == s or x.get('name') == s:
            return x
    for x in d['scenes']:
        name = x.get('name') or ''
        if name and (s in name or name in s):
            return x
    return None


# ---------- 词典补全：中文释义 + 英英释义 + 例句 ----------
# 用有道词典 jsonapi（免费、无需 key），一个源同时拿三样。
# 结果缓存到 data/words-dict.json，查过一次以后断网/重复导入都秒出。

DICT_CACHE = os.path.join(ROOT, 'data', 'words-dict.json')
_DICT_LOCK = {}
_YOUDAO_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'


def load_dict_cache():
    if not os.path.exists(DICT_CACHE):
        return {}
    try:
        with open(DICT_CACHE, 'r', encoding='utf-8') as f:
            d = json.load(f)
        return d if isinstance(d, dict) else {}
    except Exception:
        return {}


def save_dict_cache(d):
    os.makedirs(os.path.dirname(DICT_CACHE), exist_ok=True)
    tmp = DICT_CACHE + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(d, f, ensure_ascii=False, indent=1)
    os.replace(tmp, DICT_CACHE)


def _clean_html(s):
    s = re.sub(r'<[^>]+>', '', s or '')
    s = s.replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>')
    s = s.replace('&quot;', '"').replace('&#39;', "'").replace('&nbsp;', ' ')
    return re.sub(r'\s{2,}', ' ', s).strip()


def lookup_word(w):
    """查一个单词，返回 {cn, en_def, ex}，查不到或没网返回 {}。"""
    key = (w or '').strip().lower()
    if not key:
        return {}
    # 短语/带数字的不查（如 side path、take part in 词典里基本没有）
    if ' ' in key or not re.match(r'^[a-z][a-z\-]*$', key):
        return {}

    cache = load_dict_cache()
    if key in cache:
        return cache[key]

    url = 'https://dict.youdao.com/jsonapi?q=' + urllib.parse.quote(key)
    req = urllib.request.Request(url, headers={'User-Agent': _YOUDAO_UA})
    try:
        with urllib.request.urlopen(req, timeout=8) as r:
            data = json.loads(r.read().decode('utf-8', 'replace'))
    except Exception:
        return {}

    cn, en_def, ex, phon = '', '', '', ''
    def _first_i(node):
        # 有道里 l.i 有时是列表、有时是字符串，统一取整段
        if not node:
            return ''
        i = node.get('i')
        if isinstance(i, list):
            return i[0] if i else ''
        return i or ''
    try:
        ec = data.get('ec') or {}
        word = (ec.get('word') or [{}])[0]
        trs = word.get('trs') or []
        if trs:
            tr = (trs[0].get('tr') or [{}])[0]
            cn = _clean_html(_first_i(tr.get('l') or {}))
        phon = (word.get('ukphone') or word.get('usphone') or '').strip()
    except Exception:
        cn = ''
    try:
        ee = data.get('ee') or {}
        eword = (ee.get('word') or {})
        etrs = eword.get('trs') or []
        if etrs:
            etr = (etrs[0].get('tr') or [{}])[0]
            en_def = _clean_html(_first_i(etr.get('l') or {}))
    except Exception:
        en_def = ''
    try:
        bs = data.get('blng_sents_part') or {}
        pairs = bs.get('sentence-pair') or []
        if pairs:
            ex = _clean_html(pairs[0].get('sentence-eng') or pairs[0].get('sentence') or '')
    except Exception:
        ex = ''

    out = {}
    if cn:
        out['cn'] = cn[:80]
    if en_def:
        out['en_def'] = en_def[:160]
    if ex:
        out['ex'] = ex[:200]
    if phon:
        out['phon'] = phon[:44]
    if out:
        cache[key] = out
        save_dict_cache(cache)
    return out


def enrich_word(it):
    """给一个词条补中文释义/英英释义/例句/音标（缺啥补啥），返回是否改动。"""
    need = not it.get('cn') or not it.get('ex') or not it.get('en_def') or not it.get('phon')
    if not need:
        return False
    d = lookup_word(it.get('w', ''))
    if not d:
        return False
    changed = False
    if not it.get('cn') and d.get('cn'):
        it['cn'] = d['cn']
        changed = True
    if not it.get('en_def') and d.get('en_def'):
        it['en_def'] = d['en_def']
        changed = True
    if not it.get('ex') and d.get('ex'):
        it['ex'] = d['ex']
        changed = True
    if not it.get('phon') and d.get('phon'):
        it['phon'] = d['phon']
        changed = True
    return changed


def enrich_words_batch(items, limit=30):
    """批量补全最多 limit 个词，返回补全数量。"""
    n = 0
    for it in items:
        if n >= limit:
            break
        if not it.get('cn') or not it.get('ex') or not it.get('en_def') or not it.get('phon'):
            if enrich_word(it):
                n += 1
    return n


def extract_file_text(raw, name='', ext=''):
    """从任意文件里尽量提取文字。返回 str（可能为空串），读不出返回 None。"""
    ext = (ext or os.path.splitext(name)[1]).lower()

    # 1) 纯文本类：直接按编码解码
    if ext in TEXT_EXTS:
        for enc in ('utf-8', 'gbk', 'utf-16', 'latin-1'):
            try:
                return raw.decode(enc)
            except (UnicodeDecodeError, LookupError):
                continue
        # 都解不出来，就用替换模式硬读
        return raw.decode('utf-8', 'replace')

    # 2) 图片：走 OCR
    if ext in IMG_EXTS:
        if not os.path.exists(OCR_BIN):
            return None
        tmp = os.path.join(ROOT, 'data', '_up_%d%s' % (int(time.time() * 1000), ext or '.bin'))
        try:
            with open(tmp, 'wb') as f:
                f.write(raw)
            r = subprocess.run([OCR_BIN, tmp], capture_output=True, timeout=60)
            return r.stdout.decode('utf-8', 'replace').strip()
        except Exception:
            return None
        finally:
            if os.path.exists(tmp):
                try:
                    os.remove(tmp)
                except OSError:
                    pass

    # 3) PDF / 文档（docx/doc/rtf/html…）：交给 pdftext（PDFKit + textutil）
    if ext == '.pdf' or ext in RICH_EXTS:
        if not os.path.exists(PDFTEXT_BIN):
            return None
        tmp = os.path.join(ROOT, 'data', '_up_%d%s' % (int(time.time() * 1000), ext or '.bin'))
        try:
            with open(tmp, 'wb') as f:
                f.write(raw)
            r = subprocess.run([PDFTEXT_BIN, tmp], capture_output=True, timeout=60)
            text = r.stdout.decode('utf-8', 'replace').strip()
            if r.returncode == 0 and text:
                return text
            # PDF 抽不出文字（扫描件）：退回 OCR 逐页识别不了，就提示
            return text or None
        except Exception:
            return None
        finally:
            if os.path.exists(tmp):
                try:
                    os.remove(tmp)
                except OSError:
                    pass

    # 4) 未知扩展名：先当文本读，读不出再当图片 OCR 兜底
    for enc in ('utf-8', 'gbk'):
        try:
            s = raw.decode(enc)
            if s.strip():
                return s
        except (UnicodeDecodeError, LookupError):
            continue
    if os.path.exists(OCR_BIN):
        tmp = os.path.join(ROOT, 'data', '_up_%d.bin' % int(time.time() * 1000))
        try:
            with open(tmp, 'wb') as f:
                f.write(raw)
            r = subprocess.run([OCR_BIN, tmp], capture_output=True, timeout=60)
            return r.stdout.decode('utf-8', 'replace').strip() or None
        except Exception:
            return None
        finally:
            if os.path.exists(tmp):
                try:
                    os.remove(tmp)
                except OSError:
                    pass
    return None


def safe_name(name):
    name = os.path.basename(name or 'file')
    name = re.sub(r'[\\/:*?"<>|\x00-\x1f]', '_', name).strip() or 'file'
    return name[:120]


def new_id():
    return 'f%x%04x' % (int(time.time() * 1000), int((time.time() * 997) % 65536) & 0xffff)


# 允许导入的本机目录：家目录（桌面/下载/文稿都在里面）、外接盘、临时目录
ALLOW_ROOTS = [os.path.expanduser('~'), '/Volumes', '/tmp']


def path_of(p):
    """剪贴板里的路径可能长这样：file:///Users/a/b.pdf、"~/x.pdf"、/Users/a/x.pdf"""
    s = str(p or '').strip().strip('"').strip("'")
    if not s:
        return ''
    if s.lower().startswith('file://'):
        s = urllib.parse.unquote(urllib.parse.urlparse(s).path)
    elif '%' in s:
        s = urllib.parse.unquote(s)
    s = os.path.expanduser(s)
    try:
        s = os.path.realpath(s)
    except OSError:
        pass
    return s


def allowed_path(p):
    rp = os.path.realpath(p)
    for root in ALLOW_ROOTS:
        root = os.path.realpath(root).rstrip('/')
        if rp == root or rp.startswith(root + '/'):
            return True
    return False


class Handler(SimpleHTTPRequestHandler):
    protocol_version = 'HTTP/1.1'

    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    # ---------- 工具 ----------
    def _json(self, obj, code=200):
        body = json.dumps(obj, ensure_ascii=False).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        try:
            self.wfile.write(body)
        except BrokenPipeError:
            pass

    def _read_body(self):
        n = int(self.headers.get('Content-Length') or 0)
        if n <= 0:
            return b''
        if n > MAX_BYTES:
            raise ValueError('文件太大（上限 512 MB）')
        buf = bytearray()
        while len(buf) < n:
            chunk = self.rfile.read(min(65536, n - len(buf)))
            if not chunk:
                break
            buf.extend(chunk)
        return bytes(buf)

    # ---------- 路由 ----------
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        if path.startswith('/api/'):
            return self.api_get(path, urllib.parse.parse_qs(parsed.query))
        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path.startswith('/api/'):
            return self.api_post(parsed.path)
        self._json({'ok': False, 'err': 'not found'}, 404)

    def api_get(self, path, qs):
        if path == '/api/health':
            broken = scan_broken_refs()
            baddata = data_files_bad()
            try:
                plan_n = len((load_plan().get('data') or {}).get('local') or [])
            except Exception:
                plan_n = -1
            ok = not broken and not baddata
            return self._json({
                'ok': ok,
                'broken_refs': broken,
                'bad_data_files': baddata,
                'plan_count': plan_n,
                'message': 'OK' if ok else '发现失效引用或空数据文件',
            })

        if path == '/api/note/heartbeat':
            guard_hb()
            return self._json({'ok': True})

        if path == '/api/note/rec-hb':
            # 笔记页录音心跳：st=rec 正在录 / st=done 这节课结束（正常录完或用户主动停）
            lesson = (qs.get('lesson') or [''])[0]
            st = (qs.get('st') or ['rec'])[0]
            rec_hb(lesson, 'done' if st == 'done' else 'rec')
            return self._json({'ok': True})

        if path == '/api/note/open':
            # 前端弹窗被浏览器拦截时的兜底：由服务端直接拉起笔记页（不受弹窗拦截影响）
            lesson = (qs.get('lesson') or [''])[0]
            name = (qs.get('name') or ['这节课'])[0]
            try:
                end = int((qs.get('end') or ['0'])[0])
            except Exception:
                end = 0
            if not end:
                for l in plan_lessons():
                    if l['key'] == lesson:
                        end = int(l['en'])
                        break
            if not end:
                return self._json({'ok': False, 'err': '没找到这节课的结束时间'}, 400)
            url = ('http://127.0.0.1:%d/ielts-notes.html?kind=class&auto=1&guard=1'
                   '&name=%s&lesson=%s&end=%d' %
                   (PORT, urllib.parse.quote(name), urllib.parse.quote(lesson), end))
            try:
                subprocess.Popen(['open', '-g', '-a', 'Google Chrome', url],
                                 stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                log_guard('🖥 前端弹窗被拦，改由服务端拉起：%s %s' % (lesson, name))
                return self._json({'ok': True, 'end': end})
            except Exception as e:
                log_guard('❌ 服务端拉起失败：%s %s: %r' % (lesson, name, e))
                return self._json({'ok': False, 'err': str(e)}, 500)

        if path == '/api/term/defs':
            return self._json({'ok': True, 'defs': load_term_defs()})
        if path == '/api/term/user':
            return self._json({'ok': True, 'terms': load_user_terms()})

        if path == '/api/plan/get':
            return self._json(load_plan())
        if path == '/api/plan/backup':
            return self._json(load_plan(PLAN_BAK))
        if path == '/api/plan/history':
            return self._json({'ok': True, 'items': plan_history()})
        if path == '/api/plan/history/get':
            fn = (qs.get('file') or [''])[0]
            if not (fn.startswith('plan-') and fn.endswith('.json')) or '/' in fn or '\\' in fn:
                return self._json({'ok': False, 'err': '快照文件名不对'}, 400)
            target = os.path.join(PLAN_HISTORY, fn)
            if not os.path.exists(target):
                return self._json({'ok': False, 'err': '快照不存在'}, 404)
            try:
                with open(target, 'r', encoding='utf-8') as f:
                    d = json.load(f)
                d['ok'] = True
                return self._json(d)
            except Exception:
                return self._json({'ok': False, 'err': '快照读不出来'}, 500)

        # 笔记页用 GET 拉列表（之前只有 POST 版，导致「我的笔记」一直空）
        if path == '/api/notes/list':
            items = load_notes()
            items.sort(key=lambda x: x.get('ts', 0), reverse=True)
            try:
                used = os.path.getsize(NOTES_FILE) if os.path.exists(NOTES_FILE) else 0
            except Exception:
                used = 0
            return self._json({'ok': True, 'items': items, 'bytes': used})

        if path == '/api/collect/list':
            d = load_collect()
            items = sorted(d['items'], key=lambda x: x.get('ts', 0), reverse=True)
            return self._json({'ok': True, 'scenes': d['scenes'], 'items': items,
                               'bytes': collect_bytes()})

        if path == '/api/files/ping':
            return self._json({'ok': True, 'dir': os.path.relpath(STORE, ROOT),
                               'count': len(load_index())})
        if path == '/api/apps':
            items = []
            for k, v in APPS.items():
                items.append({'key': k, 'name': v['name'], 'path': v['path'],
                              'installed': os.path.exists(v['path'])})
            return self._json({'ok': True, 'apps': items})
        if path == '/api/files/list':
            return self._json({'ok': True, 'items': [x for x in load_index() if not x.get('del')]})
        if path == '/api/files/raw':
            fid = (qs.get('id') or [''])[0]
            for it in load_index():
                if it['id'] == fid:
                    fp = os.path.join(STORE, it['file'])
                    if not os.path.exists(fp):
                        return self._json({'ok': False, 'err': '文件已经不在了'}, 404)
                    size = os.path.getsize(fp)
                    ctype = it.get('type') or mimetypes.guess_type(it['name'])[0] or 'application/octet-stream'
                    disp = 'attachment; filename*=UTF-8\'\'' + urllib.parse.quote(it['name'])
                    self.send_response(200)
                    self.send_header('Content-Type', ctype)
                    self.send_header('Content-Length', str(size))
                    self.send_header('Content-Disposition', disp)
                    self.send_header('Cache-Control', 'no-store')
                    self.end_headers()
                    with open(fp, 'rb') as f:
                        while True:
                            b = f.read(65536)
                            if not b:
                                break
                            self.wfile.write(b)
                    return
            return self._json({'ok': False, 'err': '没这个文件'}, 404)

        if path == '/api/tts':
            text = (qs.get('text') or [''])[0].strip()[:800]
            voice = (qs.get('voice') or ['zh-CN-XiaoxiaoNeural'])[0]
            rate = (qs.get('rate') or ['-4%'])[0]
            if voice not in TTS_VOICES:
                voice = 'zh-CN-XiaoxiaoNeural'
            if not re.match(r'^[+-]\d{1,2}%$', rate):
                rate = '-4%'
            if not text:
                return self._json({'ok': False, 'err': '没内容'}, 400)
            fp = tts_make(text, voice, rate)
            if not fp:
                return self._json({'ok': False, 'err': '语音合成不可用'}, 503)
            with open(fp, 'rb') as f:
                data = f.read()
            self.send_response(200)
            self.send_header('Content-Type', 'audio/mpeg')
            self.send_header('Content-Length', str(len(data)))
            self.send_header('Cache-Control', 'public, max-age=604800')
            self.end_headers()
            self.wfile.write(data)
            return

        if path == '/api/records/list':
            items = load_records()
            items.sort(key=lambda x: x.get('ts', 0), reverse=True)
            return self._json({'ok': True, 'items': items})

        if path == '/api/words/list':
            return self._json({'ok': True, 'words': load_words(),
                               'files': load_word_files(),
                               'dir': os.path.relpath(WORD_DIR, ROOT)})

        if path == '/api/errors/list':
            items = load_errors()
            items.sort(key=lambda x: x.get('ts', 0), reverse=True)
            return self._json({'ok': True, 'items': items})

        if path == '/api/files/trash':
            return self._json({'ok': True, 'items': [x for x in load_index() if x.get('del')]})

        if path == '/api/app-running':
            key = (qs.get('app') or [''])[0]
            spec = APPS.get(key)
            if not spec:
                return self._json({'ok': False, 'err': '不在白名单里'}, 400)
            procs = spec.get('proc') or []
            if isinstance(procs, str):
                procs = [procs]
            alive = pids_of(procs[0]) if procs else []
            return self._json({'ok': True, 'running': bool(alive),
                               'pid': alive[0] if alive else None})

        return self._json({'ok': False, 'err': 'not found'}, 404)

    def api_post(self, path):
        if path == '/api/term/zh2en':
            try:
                payload = json.loads(self._read_body().decode('utf-8') or '{}')
            except Exception:
                payload = {}
            zh = (payload.get('zh') or '').strip()
            if not zh:
                return self._json({'ok': False, 'err': '请输入中文术语'}, 400)
            rec = zh2en_term(zh)
            if not rec:
                return self._json({'ok': False, 'err': '暂时无法翻译，请稍后再试'})
            # 释义兜底：AI 没给 def 时用已生成的术语释义库按英文再查一次
            if not rec.get('def'):
                rec['def'] = load_term_defs().get(rec['en'], '')
            return self._json({'ok': True, 'term': rec})

        if path == '/api/term/user/add':
            try:
                payload = json.loads(self._read_body().decode('utf-8') or '{}')
            except Exception:
                payload = {}
            en = (payload.get('en') or '').strip()
            if not en:
                return self._json({'ok': False, 'err': '缺少英文名词'}, 400)
            items = load_user_terms()
            # 同英文词去重（覆盖更新）
            items = [x for x in items if (x.get('en') or '').lower() != en.lower()]
            items.append({
                'en': en, 'pos': payload.get('pos') or 'n.',
                'zh': payload.get('zh') or '', 'def': payload.get('def') or '',
                'eg': payload.get('eg') or '', 'scope': payload.get('scope') or '',
                'ts': int(time.time() * 1000),
            })
            save_user_terms(items)
            return self._json({'ok': True, 'count': len(items)})

        if path == '/api/term/user/del':
            try:
                payload = json.loads(self._read_body().decode('utf-8') or '{}')
            except Exception:
                payload = {}
            en = (payload.get('en') or '').strip()
            items = [x for x in load_user_terms() if (x.get('en') or '').lower() != en.lower()]
            save_user_terms(items)
            return self._json({'ok': True, 'count': len(items)})

        if path == '/api/plan/save':
            try:
                payload = json.loads(self._read_body().decode('utf-8') or '{}')
            except Exception:
                payload = {}
            out = save_plan(payload)
            if not out:
                return self._json({'ok': False, 'err': '课表数据格式不对'}, 400)
            if out.get('blocked'):
                return self._json({'ok': False, 'blocked': True,
                                   'courses': out.get('courses', 0),
                                   'err': '课表已保护：不能清空已排好的课'}, 403)
            return self._json({'ok': True, 'ts': out['ts'], 'savedAt': out['savedAt'],
                               'courses': len(out['data'].get('local') or [])})

        if path.startswith('/api/collect/'):
            return self.do_collect(path)

        if path == '/api/ocr':
            return self.do_ocr()

        if path == '/api/records/add':
            try:
                payload = json.loads(self._read_body().decode('utf-8') or '{}')
            except Exception:
                payload = {}
            text = (payload.get('text') or '').strip()
            if not text and not payload.get('sec'):
                return self._json({'ok': False, 'err': '没有内容'}, 400)
            guess = parse_report(text)
            rec = {
                'id': 'r%x' % int(time.time() * 1000),
                'ts': int(time.time() * 1000),
                'sec': payload.get('sec') or guess['sec'] or '听力',
                'band': payload.get('band') or guess['band'],
                'right': payload.get('right') or guess['right'],
                'total': payload.get('total') or guess['total'],
                'pct': payload.get('pct') or guess['pct'],
                'wrong': payload.get('wrong') or guess['wrong'],
                'title': payload.get('title') or guess['title'],
                'text': text[:6000],
            }
            items = load_records()
            items.append(rec)
            save_records(items)
            return self._json({'ok': True, 'item': rec, 'guess': guess})

        if path == '/api/records/del':
            try:
                payload = json.loads(self._read_body().decode('utf-8') or '{}')
            except Exception:
                payload = {}
            rid = payload.get('id')
            save_records([x for x in load_records() if x['id'] != rid])
            return self._json({'ok': True})

        if path == '/api/words/upload':
            return self.words_upload()

        if path == '/api/words/paste':
            return self.words_paste()

        if path == '/api/words/add':
            try:
                payload = json.loads(self._read_body().decode('utf-8') or '{}')
            except Exception:
                payload = {}
            it = parse_word_line('%s %s %s' % (payload.get('w', ''),
                                               payload.get('cn', ''),
                                               payload.get('ex', '')))
            if not it:
                return self._json({'ok': False, 'err': '这一行看不出是单词'}, 400)
            it['phon'] = (payload.get('phon') or it['phon']).strip()
            return self._json(self.merge_words([it], src='手输'))

        if path == '/api/words/set':
            try:
                payload = json.loads(self._read_body().decode('utf-8') or '{}')
            except Exception:
                payload = {}
            wids = payload.get('ids') or ([payload.get('id')] if payload.get('id') else [])
            items = load_words()
            hit = 0
            idmap = {}
            for it in items:
                idmap[it['id']] = it
            for wid in wids:
                it = idmap.get(wid)
                if not it:
                    continue
                if payload.get('done') is not None:
                    it['done'] = 1 if payload.get('done') else 0
                if payload.get('hard') is not None:
                    it['hard'] = 1 if payload.get('hard') else 0
                if payload.get('tag') is not None:
                    it['tag'] = (payload.get('tag') or '').strip()[:20]
                hit += 1
            if hit:
                save_words(items)
            return self._json({'ok': True, 'changed': hit})

        if path == '/api/words/voice':
            return self.words_voice()

        if path == '/api/words/file-del':
            return self.words_file_del()

        if path == '/api/words/del':
            return self.words_del()

        if path == '/api/errors/add':
            try:
                payload = json.loads(self._read_body().decode('utf-8') or '{}')
            except Exception:
                payload = {}
            text = (payload.get('text') or '').strip()
            if not text:
                return self._json({'ok': False, 'err': '内容是空的'}, 400)
            item = {
                'id': 'e%x' % int(time.time() * 1000),
                'ts': int(time.time() * 1000),
                'text': text[:4000],
                'cat': payload.get('cat') or '',
                'tips': payload.get('tips') or [],
                'fixed': (payload.get('fixed') or '')[:4000],
                'src': payload.get('src') or '',
                'done': 0,
            }
            items = load_errors()
            items.append(item)
            save_errors(items)
            return self._json({'ok': True, 'item': item})

        if path == '/api/errors/set':
            try:
                payload = json.loads(self._read_body().decode('utf-8') or '{}')
            except Exception:
                payload = {}
            fid = payload.get('id')
            items = load_errors()
            hit = 0
            for it in items:
                if it['id'] == fid:
                    it['done'] = 1 if payload.get('done') else 0
                    hit = 1
            if hit:
                save_errors(items)
            return self._json({'ok': True, 'changed': bool(hit)})

        if path == '/api/errors/del':
            try:
                payload = json.loads(self._read_body().decode('utf-8') or '{}')
            except Exception:
                payload = {}
            fid = payload.get('id')
            items = [x for x in load_errors() if x['id'] != fid]
            save_errors(items)
            return self._json({'ok': True})

        if path == '/api/errors/clear':
            save_errors([])
            return self._json({'ok': True})

        if path == '/api/notes/list':
            items = load_notes()
            items.sort(key=lambda x: x.get('ts', 0), reverse=True)
            try:
                used = os.path.getsize(NOTES_FILE) if os.path.exists(NOTES_FILE) else 0
            except Exception:
                used = 0
            return self._json({'ok': True, 'items': items, 'bytes': used})

        if path == '/api/notes/clear':
            n = len(load_notes())
            save_notes([])
            return self._json({'ok': True, 'cleared': n})

        if path == '/api/notes/add':
            try:
                payload = json.loads(self._read_body().decode('utf-8') or '{}')
            except Exception:
                payload = {}
            title = (payload.get('title') or '').strip()
            text = (payload.get('text') or '').strip()
            if not text and not payload.get('items'):
                return self._json({'ok': False, 'err': '笔记是空的'}, 400)
            if not title:
                title = '笔记-%s' % time.strftime('%m%d-%H%M')
            note = {
                'id': 'n%x' % int(time.time() * 1000),
                'ts': int(time.time() * 1000),
                'title': title[:120],
                'kind': (payload.get('kind') or 'class').strip()[:20],   # class=课堂 / oral=口语 / listen=听力
                'text': text[:20000],
                'summary': (payload.get('summary') or '')[:4000],
                'highlights': (payload.get('highlights') or [])[:50],
                'analysis': (payload.get('analysis') or [])[:100],
            }
            items = load_notes()
            items.append(note)
            save_notes(items)
            return self._json({'ok': True, 'item': note})

        if path == '/api/notes/del':
            try:
                payload = json.loads(self._read_body().decode('utf-8') or '{}')
            except Exception:
                payload = {}
            nid = payload.get('id')
            save_notes([x for x in load_notes() if x.get('id') != nid])
            return self._json({'ok': True})

        if path == '/api/notes/asr':
            # 语音转文字：接收 base64 音频，返回识别文字
            try:
                payload = json.loads(self._read_body().decode('utf-8') or '{}')
            except Exception:
                payload = {}
            audio = payload.get('audio') or ''
            fmt = (payload.get('format') or 'm4a').strip()
            mode = (payload.get('mode') or '').strip()
            if not audio:
                return self._json({'ok': False, 'err': '没收到音频'}, 400)
            # 去掉可能带的 data:...;base64, 前缀
            if ',' in audio and audio.startswith('data:'):
                audio = audio.split(',', 1)[1]
            text = doubao_asr(audio, fmt, mode)
            if not text:
                return self._json({'ok': False, 'err': '没识别出内容（可能没配 key 或音频太短）'}, 200)
            return self._json({'ok': True, 'text': text})

        if path == '/api/notes/analyze':
            # AI 分析：语法/发音/中式英语提醒，或提炼重点
            try:
                payload = json.loads(self._read_body().decode('utf-8') or '{}')
            except Exception:
                payload = {}
            text = (payload.get('text') or '').strip()
            kind = (payload.get('kind') or 'oral').strip()
            if not text:
                return self._json({'ok': False, 'err': '没有内容可分析'}, 400)
            if kind == 'class':
                # 课堂笔记：提炼重点
                prompt = ('下面是一段课堂记录。请帮我：1) 用 2-3 句话概括核心内容；'
                          '2) 挑出最重要的 3-6 个要点，每条一行，用「【重点】」开头。'
                          '直接输出，不要多余说明。\n\n课堂记录：\n' + text[:6000])
            else:
                # 口语/听力：语法、发音、中式英语、地道表达
                prompt = ('下面是我说的一段英语（口语/听力答案）。请帮我逐条指出问题，'
                          '每条格式：\n【问题】xxx\n【改正】xxx\n【说明】xxx\n'
                          '重点关注：语法错误、用词不当、中式英语（Chinglish）、'
                          '更地道的英文表达。最后给一句总体点评。直接输出，不要客套。\n\n我的回答：\n' + text[:6000])
            result = doubao_chat([{'role': 'user', 'content': prompt}])
            if not result:
                return self._json({'ok': False, 'err': 'AI 分析失败（key 未配或网络问题）'}, 200)
            return self._json({'ok': True, 'result': result})

        if path == '/api/files/upload':
            try:
                raw = self._read_body()
            except ValueError as e:
                return self._json({'ok': False, 'err': str(e)}, 413)
            if not raw:
                return self._json({'ok': False, 'err': '空文件'}, 400)
            name = urllib.parse.unquote(self.headers.get('X-Filename') or '')
            name = safe_name(name)
            cat = self.headers.get('X-Cat') or 'other'
            ctype = self.headers.get('X-Type') or ''
            ts = int(self.headers.get('X-Ts') or (time.time() * 1000))

            ensure_store()
            fid = new_id()
            disk = fid + '__' + name
            with open(os.path.join(STORE, disk), 'wb') as f:
                f.write(raw)
            meta = {'id': fid, 'name': name, 'size': len(raw), 'type': ctype,
                    'cat': cat, 'ts': ts, 'file': disk, 'store': 'server'}
            items = load_index()
            items.append(meta)
            save_index(items)
            out = dict(meta)
            out.pop('file', None)
            return self._json({'ok': True, 'item': out})

        if path == '/api/files/delete':
            try:
                payload = json.loads(self._read_body().decode('utf-8') or '{}')
            except Exception:
                payload = {}
            fid = payload.get('id')
            items = load_index()
            hit = False
            for it in items:
                if it['id'] == fid and not it.get('del'):
                    it['del'] = 1
                    it['dts'] = int(time.time() * 1000)
                    hit = True
            if hit:
                save_index(items)
            # 文件没有真删，只是从列表里藏起来，回收站里能还原
            return self._json({'ok': True, 'removed': hit})

        if path == '/api/files/clear':
            items = load_index()
            n = 0
            now = int(time.time() * 1000)
            for it in items:
                if not it.get('del'):
                    it['del'] = 1
                    it['dts'] = now
                    n += 1
            save_index(items)
            return self._json({'ok': True, 'removed': n, 'trash': True})

        if path == '/api/files/restore':
            try:
                payload = json.loads(self._read_body().decode('utf-8') or '{}')
            except Exception:
                payload = {}
            fid = payload.get('id')
            items = load_index()
            hit = False
            for it in items:
                if it['id'] == fid:
                    it.pop('del', None)
                    it.pop('dts', None)
                    hit = True
            if hit:
                save_index(items)
            return self._json({'ok': True, 'restored': hit})

        if path == '/api/files/purge':
            try:
                payload = json.loads(self._read_body().decode('utf-8') or '{}')
            except Exception:
                payload = {}
            fid = payload.get('id')
            items = load_index()
            keep, n = [], 0
            for it in items:
                if it.get('del') and (not fid or it['id'] == fid):
                    fp = os.path.join(STORE, it.get('file', ''))
                    if os.path.exists(fp):
                        try:
                            os.remove(fp)
                        except OSError:
                            pass
                    n += 1
                    continue
                keep.append(it)
            save_index(keep)
            return self._json({'ok': True, 'purged': n})

        if path == '/api/files/import':
            return self.import_local()

        if path == '/api/open':
            try:
                payload = json.loads(self._read_body().decode('utf-8') or '{}')
            except Exception:
                payload = {}
            key = (payload.get('app') or '').strip()
            # 兼容老页面：不带 app 参数时默认就是雅思哥，避免「点了没反应」
            if not key:
                key = 'ieltsbro'
            spec = APPS.get(key)
            if not spec:
                return self._json({'ok': False, 'err': '不在白名单里'}, 400)
            if not os.path.exists(spec['path']):
                return self._json({'ok': False, 'err': '没装这个应用', 'installed': False}, 404)

            procs = spec.get('proc') or []
            if isinstance(procs, str):
                procs = [procs]
            win_name = spec.get('win') or ''
            tried = []

            def launch():
                cmds = [['open', '-a', spec['path']]]
                if spec.get('bundle'):
                    cmds.append(['open', '-b', spec['bundle']])
                for cmd in cmds:
                    try:
                        r = subprocess.run(cmd, capture_output=True, timeout=10)
                        tried.append({'cmd': ' '.join(cmd), 'code': r.returncode})
                        if r.returncode == 0:
                            return True
                    except Exception as e:
                        tried.append({'cmd': ' '.join(cmd), 'err': str(e)})
                return False

            def kill_all():
                n = 0
                for pat in procs:
                    for pid in pids_of(pat):
                        try:
                            os.kill(pid, signal.SIGKILL)
                            n += 1
                        except Exception:
                            pass
                for _ in range(30):
                    if not any(pids_of(p) for p in procs):
                        break
                    time.sleep(0.1)
                return n

            killed = kill_all() if payload.get('restart') else 0
            if not launch():
                return self._json({'ok': False, 'err': '系统不让我拉起这个应用', 'tried': tried}, 500)

            alive = []
            for _ in range(12):
                alive = pids_of(procs[0]) if procs else []
                if alive:
                    break
                time.sleep(0.3)

            # 进程起来了，但窗口不在屏幕上（最小化 / 被挪到别的桌面 / 窗口被关掉了）：
            # 这时候点卡片看着就是「没反应」，直接重开一个
            restarted = bool(killed)
            wins = wins_of(win_name)
            if wins is not None:
                # open -a 有时要两三秒才把窗口画出来，多等一会儿再判死刑
                for _ in range(12):
                    wins = wins_of(win_name)
                    if wins and wins[0] > 0:
                        break
                    time.sleep(0.5)
                if wins and wins[0] == 0 and not restarted:
                    killed = kill_all()
                    if launch():
                        restarted = True
                        for _ in range(14):
                            time.sleep(0.5)
                            w2 = wins_of(win_name)
                            if w2 and w2[0] > 0:
                                break
                        alive = pids_of(procs[0]) if procs else []
                    wins = wins_of(win_name) or wins

            # 最后再点一次：从后台进程启动时，窗口有时会落在浏览器后面不出来
            try:
                subprocess.run(['open', '-a', spec['path']], capture_output=True, timeout=8)
            except Exception:
                pass
            time.sleep(0.3)
            wins = wins_of(win_name) or wins

            return self._json({
                'ok': True,
                'via': next((t['cmd'] for t in tried if t.get('code') == 0), ''),
                'restarted': restarted,
                'running': bool(alive) if procs else None,
                'pid': alive[0] if alive else None,
                'on_screen': wins[0] if wins else None,
                'windows': wins[1] if wins else None,
                'tried': tried,
            })

        return self._json({'ok': False, 'err': 'not found'}, 404)

    def do_collect(self, path):
        """高分积累：场景 / 条目 / 文件识别 / AI 整理。"""
        try:
            payload = json.loads(self._read_body().decode('utf-8') or '{}')
        except Exception:
            payload = {}
        d = load_collect()

        def out(extra=None):
            body = {'ok': True, 'scenes': d['scenes'], 'items': d['items'],
                    'bytes': collect_bytes()}
            if extra:
                body.update(extra)
            return self._json(body)

        if path == '/api/collect/add':
            incoming = payload.get('items') or []
            want = str(payload.get('scene_name') or '').strip()
            if want and not collect_scene(d, want):
                d['scenes'].append({
                    'id': 's%x' % int(time.time() * 1000), 'name': want[:12],
                    'icon': str(payload.get('icon') or '📁')[:4], 'color': '#475569'})
            seen = {(x.get('scene'), x.get('text')) for x in d['items']}
            added = dup = 0
            for i, o in enumerate(incoming):
                if isinstance(o, str):
                    o = {'text': o}
                text = str(o.get('text') or '').strip()
                if not text:
                    continue
                text = text[:6000]
                sc = collect_scene(d, o.get('scene')) or collect_scene(d, want)
                sid = sc['id'] if sc else 'misc'
                if (sid, text) in seen:
                    dup += 1
                    continue
                seen.add((sid, text))
                d['items'].append({
                    'id': 'c%x_%d' % (int(time.time() * 1000), i),
                    'ts': int(time.time() * 1000) + i,
                    'scene': sid, 'text': text,
                    'title': str(o.get('title') or '')[:100],
                    'src': str(o.get('src') or '手动')[:40]})
                added += 1
            save_collect(d)
            return out({'added': added, 'dup': dup})

        if path == '/api/collect/del':
            cid = payload.get('id')
            n0 = len(d['items'])
            d['items'] = [x for x in d['items'] if x.get('id') != cid]
            save_collect(d)
            return out({'deleted': n0 - len(d['items'])})

        if path == '/api/collect/scene':
            name = str(payload.get('name') or '').strip()[:12]
            if not name:
                return self._json({'ok': False, 'err': '给场景起个名字'}, 400)
            if collect_scene(d, name):
                return out({'exists': True})
            d['scenes'].append({
                'id': 's%x' % int(time.time() * 1000), 'name': name,
                'icon': str(payload.get('icon') or '📁')[:4],
                'color': str(payload.get('color') or '#475569')[:20]})
            save_collect(d)
            return out()

        if path == '/api/collect/scene-del':
            sid = payload.get('id')
            if sid == 'misc':
                return self._json({'ok': False, 'err': '「未分类」不能删'}, 400)
            d['scenes'] = [x for x in d['scenes'] if x.get('id') != sid]
            for x in d['items']:
                if x.get('scene') == sid:
                    x['scene'] = 'misc'
            save_collect(d)
            return out()

        if path == '/api/collect/clear':
            sid = payload.get('scene')
            if sid:
                d['items'] = [x for x in d['items'] if x.get('scene') != sid]
            else:
                d['items'] = []
            save_collect(d)
            return out()

        if path == '/api/collect/extract':
            name = str(payload.get('name') or 'paste.bin')
            data = str(payload.get('data') or '')
            if data.startswith('data:') and ',' in data:
                data = data.split(',', 1)[1]
            try:
                data += '=' * (-len(data) % 4)
                raw = base64.b64decode(data)
            except Exception:
                return self._json({'ok': False, 'err': '文件内容读不出来'}, 400)
            if not raw:
                return self._json({'ok': False, 'err': '空文件'}, 400)
            text = extract_file_text(raw, name, os.path.splitext(name)[1].lower())
            if not text or not text.strip():
                return self._json({'ok': False, 'err': '这个文件 / 图片里没认出文字'}, 200)
            return self._json({'ok': True, 'text': text.strip()[:20000], 'name': name})

        if path == '/api/collect/classify':
            text = str(payload.get('text') or '').strip()[:12000]
            if not text:
                return self._json({'ok': False, 'err': '没有内容'}, 400)
            names = [x.get('name') for x in d['scenes'] if x.get('name')]
            prompt = ('把下面这段雅思学习积累整理成若干条，每条归属一个场景。\n'
                      '可用场景：' + '、'.join(names) + '。\n'
                      '只输出严格 JSON，不要解释、不要 markdown：\n'
                      '{"items":[{"scene":"场景名","text":"这一条内容"}]}\n'
                      '规则：一行或一句一条，保留原句；场景名必须是上面列出的之一；'
                      '拿不准用「未分类」；最多 60 条。\n\n' + text)
            ans = doubao_chat([{'role': 'user', 'content': prompt}], max_tokens=3000)
            if not ans:
                return self._json({'ok': False, 'err': 'AI 没响应，按本地规则整理'}, 200)
            try:
                s = ans.strip()
                if s.startswith('```'):
                    s = s.split('```')[1]
                    if s.lstrip().startswith('json'):
                        s = s.lstrip()[4:]
                arr = json.loads(s).get('items') or []
                clean = []
                for o in arr[:60]:
                    t = str(o.get('text') or '').strip()
                    if t:
                        clean.append({'scene': str(o.get('scene') or '未分类'),
                                      'text': t[:6000]})
                if not clean:
                    raise ValueError('empty')
                return self._json({'ok': True, 'items': clean})
            except Exception:
                return self._json({'ok': False, 'err': 'AI 返回格式不对，按本地规则整理'}, 200)

        return self._json({'ok': False, 'err': 'not found'}, 404)

    def do_ocr(self):
        if not os.path.exists(OCR_BIN):
            return self._json({'ok': False, 'err': '识别工具没编译好'}, 500)

        ctype = (self.headers.get('Content-Type') or '').lower()
        tmp = None
        if 'application/json' in ctype:
            # 访达里复制的图片 → 剪贴板里只有路径，按路径直接读
            try:
                payload = json.loads(self._read_body().decode('utf-8') or '{}')
            except Exception:
                payload = {}
            p = path_of(payload.get('path'))
            if not p or not os.path.isfile(p):
                return self._json({'ok': False, 'err': '这个文件找不到'}, 400)
            if not allowed_path(p):
                return self._json({'ok': False, 'err': '这个位置的文件不允许读'}, 403)
            if os.path.getsize(p) > MAX_BYTES:
                return self._json({'ok': False, 'err': '图片太大'}, 413)
            src = p
        else:
            try:
                raw = self._read_body()
            except ValueError as e:
                return self._json({'ok': False, 'err': str(e)}, 413)
            if not raw:
                return self._json({'ok': False, 'err': '空图片'}, 400)
            tmp = os.path.join(ROOT, 'data', '_ocr_%d.png' % int(time.time() * 1000))
            with open(tmp, 'wb') as f:
                f.write(raw)
            src = tmp

        try:
            r = subprocess.run([OCR_BIN, src], capture_output=True, timeout=40)
            text = r.stdout.decode('utf-8', 'replace').strip()
        except Exception as e:
            return self._json({'ok': False, 'err': '识别失败：%s' % e}, 500)
        finally:
            if tmp and os.path.exists(tmp):
                try:
                    os.remove(tmp)
                except OSError:
                    pass
        if not text:
            return self._json({'ok': False, 'err': '这张图里没认出字'}, 200)
        return self._json({'ok': True, 'text': text, 'guess': parse_report(text)})

    def merge_words(self, parsed, src=''):
        items = load_words()
        idx = {}
        for it in items:
            idx[it['w'].lower()] = it
        added, updated = 0, 0
        fresh = []           # 本次新增的词，按导入顺序，整体放到词库最前面
        now = int(time.time() * 1000)
        for p in parsed:
            k = p['w'].lower()
            old = idx.get(k)
            if old:
                changed = False
                for f in ('phon', 'cn', 'en_def', 'ex'):
                    if not old.get(f) and p.get(f):
                        old[f] = p[f]
                        changed = True
                if changed:
                    updated += 1
                continue
            it = {
                'id': 'w%x' % (now + added + updated),
                'w': p['w'], 'phon': p.get('phon', ''), 'cn': p.get('cn', ''),
                'en_def': p.get('en_def', ''), 'ex': p.get('ex', ''),
                'src': src or p.get('src', ''),
                'ts': now, 'done': 0,
                'tag': p.get('tag', ''),
                'hard': 1 if p.get('hard') else 0,
            }
            fresh.append(it)
            idx[k] = it
            added += 1
        if fresh:
            items = fresh + items   # 新加入的词排在最前，用户一打开就能看到
        if added or updated:
            save_words(items)
        # 自动补词典：新增/更新的词缺中文或例句时，联网查一次补上（限速，避免大批量卡很久）
        enriched = 0
        if added or updated:
            touched = [idx[p['w'].lower()] for p in parsed if p['w'].lower() in idx]
            enriched = enrich_words_batch(touched, limit=25)
            if enriched:
                save_words(items)
        return {'ok': True, 'added': added, 'updated': updated,
                'enriched': enriched, 'total': len(items)}

    def words_upload(self):
        try:
            raw = self._read_body()
        except ValueError as e:
            return self._json({'ok': False, 'err': str(e)}, 413)
        if not raw:
            return self._json({'ok': False, 'err': '空文件'}, 400)
        name = safe_name(urllib.parse.unquote(self.headers.get('X-Filename') or '词汇.txt'))
        ext = os.path.splitext(name)[1].lower()

        # 按内容提取文字：任何格式都尽量读，读不出来才报错
        text = extract_file_text(raw, name, ext)
        if text is None:
            return self._json({'ok': False, 'err': '这个文件读不出文字（可能加密、损坏，或图片太糊）'}, 400)

        os.makedirs(WORD_DIR, exist_ok=True)
        fid = new_id()
        disk = fid + '__' + name
        with open(os.path.join(WORD_DIR, disk), 'wb') as f:
            f.write(raw)

        parsed = parse_words_text(text, src=name)
        res = self.merge_words(parsed, src=name)

        files = load_word_files()
        files.append({'id': fid, 'name': name, 'size': len(raw), 'file': disk,
                      'ts': int(time.time() * 1000), 'n': len(parsed)})
        save_word_files(files)

        out = dict(res)
        out['file'] = name
        out['parsed'] = len(parsed)
        if not parsed:
            out['note'] = '读出了文字，但没认出英文单词（可能不是词表）'
        return self._json(out)

    def words_paste(self):
        try:
            payload = json.loads(self._read_body().decode('utf-8') or '{}')
        except Exception:
            payload = {}
        text = (payload.get('text') or '').strip()
        if not text:
            return self._json({'ok': False, 'err': '没有内容'}, 400)
        name = safe_name(payload.get('name') or ('粘贴-%s.txt' % time.strftime('%m%d-%H%M')))
        os.makedirs(WORD_DIR, exist_ok=True)
        fid = new_id()
        disk = fid + '__' + name
        with open(os.path.join(WORD_DIR, disk), 'w', encoding='utf-8') as f:
            f.write(text)
        parsed = parse_words_text(text, src=name)
        res = self.merge_words(parsed, src=name)
        files = load_word_files()
        files.append({'id': fid, 'name': name, 'size': len(text.encode('utf-8')), 'file': disk,
                      'ts': int(time.time() * 1000), 'n': len(parsed)})
        save_word_files(files)
        out = dict(res)
        out['file'] = name
        out['parsed'] = len(parsed)
        return self._json(out)

    # ---------- 语音上传单词：录音 → 本机语音识别 → 加词 ----------
    def words_voice(self):
        try:
            raw = self._read_body()
        except ValueError as e:
            return self._json({'ok': False, 'err': str(e)}, 413)
        if not raw:
            return self._json({'ok': False, 'err': '没收到录音'}, 400)

        ext = '.m4a'
        ctype = (self.headers.get('Content-Type') or '').lower()
        if 'webm' in ctype:
            ext = '.webm'
        elif 'wav' in ctype:
            ext = '.wav'
        elif 'mp3' in ctype or 'mpeg' in ctype:
            ext = '.mp3'
        elif 'ogg' in ctype:
            ext = '.ogg'

        SPEECH_BIN = os.path.join(ROOT, 'tools', 'bin', 'speech')
        if not os.path.exists(SPEECH_BIN):
            return self._json({'ok': False, 'err': '语音识别工具没编译好'}, 500)

        tmp = os.path.join(ROOT, 'data', '_voice_%d%s' % (int(time.time() * 1000), ext))
        try:
            with open(tmp, 'wb') as f:
                f.write(raw)
            r = subprocess.run([SPEECH_BIN, tmp], capture_output=True, timeout=70)
            text = r.stdout.decode('utf-8', 'replace').strip()
        except Exception as e:
            return self._json({'ok': False, 'err': '识别失败：%s' % e}, 500)
        finally:
            if os.path.exists(tmp):
                try:
                    os.remove(tmp)
                except OSError:
                    pass

        if not text:
            return self._json({'ok': False, 'err': '没听清，请离麦克风近一点再说一遍'}, 200)

        # 识别出的整段话：当词表解析，也支持"单词 释义"逐条念
        parsed = parse_words_text(text, src='语音')
        res = self.merge_words(parsed, src='语音')

        out = dict(res)
        out['text'] = text
        out['parsed'] = len(parsed)
        if not parsed:
            out['note'] = '听清了：「%s」。请按「单词 + 中文」这样说，例如“abandon 放弃”。' % text[:80]
        return self._json(out)

    # ---------- 删除一份已导入的词表文件（不动单词） ----------
    def words_file_del(self):
        try:
            payload = json.loads(self._read_body().decode('utf-8') or '{}')
        except Exception:
            payload = {}
        fid = (payload.get('id') or '').strip()
        if not fid:
            return self._json({'ok': False, 'err': '没给文件 id'}, 400)
        files = load_word_files()
        target = None
        rest = []
        for f in files:
            if f.get('id') == fid:
                target = f
            else:
                rest.append(f)
        if target is None:
            return self._json({'ok': False, 'err': '没这个文件'}, 404)
        disk = target.get('file') or ''
        if disk:
            fp = os.path.join(WORD_DIR, os.path.basename(disk))
            if os.path.exists(fp):
                try:
                    os.remove(fp)
                except OSError:
                    pass
        save_word_files(rest)
        return self._json({'ok': True, 'removed': target.get('name', ''), 'left': len(rest)})

    # ---------- 删除词库里的单词（单个或批量） ----------
    def words_del(self):
        try:
            payload = json.loads(self._read_body().decode('utf-8') or '{}')
        except Exception:
            payload = {}
        wids = payload.get('ids') or ([payload.get('id')] if payload.get('id') else [])
        if not wids:
            return self._json({'ok': False, 'err': '没给要删的单词'}, 400)
        items = load_words()
        gone = []
        rest = []
        for it in items:
            if it.get('id') in wids:
                gone.append(it.get('w', ''))
            else:
                rest.append(it)
        if not gone:
            return self._json({'ok': False, 'err': '没找到这些单词'}, 404)
        save_words(rest)
        return self._json({'ok': True, 'removed': len(gone), 'names': gone, 'total': len(rest)})

    # ---------- 从本机路径导入（访达复制的文件走这条） ----------
    def import_local(self):
        try:
            payload = json.loads(self._read_body().decode('utf-8') or '{}')
        except Exception:
            return self._json({'ok': False, 'err': '参数读不出来'}, 400)

        rows = payload.get('items') or []
        if not rows:
            return self._json({'ok': False, 'err': '没有给路径'}, 400)

        made, bad = [], []
        for row in rows[:80]:
            src = path_of(row.get('path') if isinstance(row, dict) else row)
            ask = str((row.get('name') if isinstance(row, dict) else '') or '').strip()
            name = safe_name(ask) if ask else ''
            if not src:
                bad.append({'path': str(row), 'err': '路径是空的'})
                continue
            if not os.path.isfile(src):
                bad.append({'path': src, 'err': '找不到这个文件'})
                continue
            if not allowed_path(src):
                bad.append({'path': src, 'err': '不在可读目录里'})
                continue
            try:
                size = os.path.getsize(src)
            except OSError:
                size = 0
            if size > MAX_BYTES:
                bad.append({'path': src, 'err': '超过 512 MB'})
                continue
            if not name:
                name = os.path.basename(src)
            name = safe_name(name)
            cat = (row.get('cat') if isinstance(row, dict) else '') or 'other'

            ensure_store()
            fid = new_id()
            disk = fid + '__' + name
            try:
                shutil.copyfile(src, os.path.join(STORE, disk))
            except OSError as e:
                bad.append({'path': src, 'err': '复制失败：%s' % e})
                continue

            meta = {'id': fid, 'name': name, 'size': size,
                    'type': mimetypes.guess_type(name)[0] or '',
                    'cat': cat, 'ts': int(time.time() * 1000),
                    'file': disk, 'store': 'server'}
            items = load_index()
            items.append(meta)
            save_index(items)
            out = dict(meta)
            out.pop('file', None)
            made.append(out)

        return self._json({'ok': bool(made), 'items': made, 'bad': bad})

    # 页面/脚本一律不缓存：改完刷新就一定拿到新版，避免“改了还是老样子”
    # 同时统一放开跨域：页面可能从预览面板 / file:// 打开，接口仍要能连上本机服务
    def end_headers(self):
        try:
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-Filename, X-Type')
            self.send_header('Access-Control-Max-Age', '600')
        except Exception:
            pass
        try:
            buf = b''.join(getattr(self, '_headers_buffer', []) or [])
            if b'Cache-Control' not in buf:
                path = (self.path or '').split('?')[0].lower()
                if path.endswith(('.html', '.js', '.css')):
                    self.send_header('Cache-Control', 'no-store, must-revalidate')
        except Exception:
            pass
        super().end_headers()

    # 跨域预检：POST JSON / 带自定义头的上传之前浏览器会先问一句，直接放行
    def do_OPTIONS(self):
        self.send_response(204)
        # 浏览器要什么头就给什么头（词表上传带 X-Filename / X-Type）
        ask = (self.headers.get('Access-Control-Request-Headers') or '').strip()
        self.send_header('Access-Control-Allow-Headers',
                         ask if ask else 'Content-Type, X-Filename, X-Type')
        self.send_header('Access-Control-Max-Age', '600')
        self.send_header('Content-Length', '0')
        self.end_headers()

    # 减少日志噪音（args[0] 有时是 HTTPStatus，别拿它做字符串判断）
    def log_message(self, fmt, *args):
        first = args[0] if args else ''
        if isinstance(first, str) and '/api/' in first:
            return
        if isinstance(first, str) and str(first).endswith('.ico'):
            return
        return super().log_message(fmt, *args)


def main():
    global PORT
    port = 8101
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        port = int(sys.argv[1])
    PORT = port
    ensure_store()
    _g = load_guard()
    GUARD['state'] = _g['state']
    GUARD['done'] = _g['done']
    # 启动自检：页面引用的脚本/样式一旦失效，立刻在控制台报红
    print_ref_report(scan_broken_refs(), '[引用守卫·启动]')
    # 后台守护：即使 Chrome 一个平台页都没开，到上课时间也会自动拉起笔记页
    threading.Thread(target=guard_loop, daemon=True).start()
    srv = ThreadingHTTPServer(('127.0.0.1', port), Handler)
    print('资料库目录：%s' % STORE)
    print('打开地址：  http://127.0.0.1:%d/hub.html' % port)
    print('按 Ctrl+C 停止。')
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print('\n已停止。')


if __name__ == '__main__':
    main()
