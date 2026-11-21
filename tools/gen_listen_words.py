#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""从 PDF 词表忠实提取词条：原样保留单词，按文件分类设 tag。

用法：
  python3 tools/gen_listen_words.py <pdf路径> [--src 词库来源名] [--apply]

默认只预览不写入；--apply 才覆盖词库中 src 相同的词条。
第二个词表文件可直接复用：`python3 tools/gen_listen_words.py 新文件.pdf --src 新文件名 --apply`
"""
import os, re, sys, json, subprocess, argparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDFTEXT = os.path.join(ROOT, 'tools', 'bin', 'pdftext')
WORDS_JSON = os.path.join(ROOT, 'data', 'words.json')
WORD_DIR = os.path.join(ROOT, 'data', 'words-files')
WORD_INDEX = os.path.join(WORD_DIR, 'index.json')

NUM_RE = re.compile(r'(?<!\d)(\d{1,3})\s*[.．、\)]\s*')
POS_RE = re.compile(r'\((?:n|v|vt|vi|adj|adv|np|vp|adjp|advp|prase|prep|conj)\.?\)', re.I)
PHON_RE = re.compile(r'\[([^\[\]]+)\]')
CJK_RE = re.compile(r'[\u3400-\u9fff]+')


def pdf_text(path):
    r = subprocess.run([PDFTEXT, path], capture_output=True, timeout=180)
    txt = r.stdout.decode('utf-8', 'replace')
    if not txt.strip() or 'no-text' in txt.lower():
        sys.path.insert(0, ROOT)
        import serve
        txt = serve.ocr_scanned_pdf(path) or ''
    return txt


def join_phon_lines(lines):
    """把被 PDF 排版拆断的音标 [ ... ] 合并回一行。"""
    out, buf = [], ''
    for raw in lines:
        line = raw.strip()
        if buf:
            line = buf + ' ' + line
            buf = ''
        if line.count('[') > line.count(']'):
            buf = line
            continue
        out.append(line)
    if buf:
        out.append(buf)
    return out


def section_tag(s, sections):
    """识别分类标题，返回规范 tag；不是标题返回 ''。"""
    # 已知分类精确匹配（含带音标的标题，如 transportation [...]）
    if sections:
        t = re.sub(r'\[[^\[\]]*\]', ' ', s)
        t = POS_RE.sub(' ', t)
        t = re.sub(r'^\s*\d{1,3}[.．、)]\s*', '', t)
        t = re.sub(r'\s+', ' ', t).strip().strip('.,;:')
        for sec in sections:
            if t.lower() == sec.lower():
                return sec
    if '场景' in s or s.startswith('★'):
        return clean_section(s)
    if not s or len(s) > 40:
        return ''
    if '[' in s or '(' in s or ')' in s or NUM_RE.match(s):
        return ''
    if re.fullmatch(r"[A-Za-z][A-Za-z '\-’?]{1,38}", s):
        return s.strip()
    return ''


def clean_section(s):
    s = re.sub(r'^★+\s*', '', s)
    if '场景' in s and '：' in s:
        s = s.replace('⼀', '').replace('一', '')
        s = re.sub(r'^场景[一二三四五六七八九十]*[：:]\s*', '', s)
    return s.strip(' ：:★')


def clean_word(w):
    """清洗成原样英文词组：去词性/手写标记，保留大小写、连字符、撇号、介词、冒号。"""
    w = POS_RE.sub(' ', w)
    w = re.sub(r'\d{3}\s*[×x]\s*\d{2,3}\s*\(?cm\)?', ' ', w, flags=re.I)
    w = CJK_RE.sub(' ', w)
    w = re.sub(r'[〈〉「」【】《》※#]', ' ', w)
    w = re.sub(r'\s+', ' ', w).strip()
    return w.strip(' .,;:、|\\+&')


def extract_items(text, sections=()):
    """逐行提取 {no, w, phon, tag}；w 为文件中原样单词。"""
    items = []
    tag = ''
    for line in join_phon_lines(text.splitlines()):
        s = line.strip()
        if not s or s.startswith('#') or re.fullmatch(r'\d{1,3}', s):
            continue
        sec = section_tag(s, sections)
        if sec:
            tag = sec
            continue
        # PDF 多栏错排会让一行含多个编号，先按编号切成块
        nums = [m.start() for m in NUM_RE.finditer(s)]
        if len(nums) > 1:
            blocks = [s[nums[i]:(nums[i + 1] if i + 1 < len(nums) else len(s))]
                      for i in range(len(nums))]
        else:
            blocks = [s]
        # 同义分隔符切段（音标用 []，段内 / = , 都是分隔符）
        for block in blocks:
          for seg in re.split(r'\s*[/=,，、]\s*', block):
            seg = seg.strip()
            if not seg:
                continue
            no = 0
            mnum = NUM_RE.search(seg)
            if mnum:
                no = int(mnum.group(1))
                seg = seg[mnum.end():]
            before = seg.split('[', 1)[0]
            mw = re.match(r"\s*([A-Za-z][A-Za-z0-9 '\-’():.]*)", before)
            if not mw:
                continue                      # 编号后直接是音标：词在上一行，跳过
            w = clean_word(mw.group(1))
            if not w or len(w) < 2 or len(w) > 60:
                continue
            if w.lower() in ('vp', 'n', 'np', 'adj', 'adv', 'advp', 'prase'):
                continue
            pm = PHON_RE.search(seg)
            items.append({'no': no, 'w': w,
                          'phon': pm.group(1).strip() if pm else '', 'tag': tag})
    return items


def good_cn(cn):
    """旧词库里可保留的中文释义：至少 3 字符且含汉字，排除「热/过过」这类手写标记。"""
    cn = (cn or '').strip()
    return len(cn) >= 3 and bool(CJK_RE.search(cn))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('pdf')
    ap.add_argument('--src', default='')
    ap.add_argument('--sections', default='', help='分类标题白名单，逗号分隔（用于带音标的标题）')
    ap.add_argument('--apply', action='store_true')
    a = ap.parse_args()
    src = a.src or os.path.basename(a.pdf)
    sections = [x.strip() for x in a.sections.split(',') if x.strip()]

    raw = pdf_text(a.pdf)
    items = extract_items(raw, sections)

    # 按词去重（小写判断，保留文件里的原样大小写）
    seen, uniq = set(), []
    for it in items:
        k = it['w'].lower()
        if k in seen:
            continue
        seen.add(k)
        uniq.append(it)

    old = json.load(open(WORDS_JSON, encoding='utf-8'))
    is_list = isinstance(old, list)
    old_words = old if is_list else old.get('words', [])
    old_by_word = {}
    for x in old_words:
        old_by_word.setdefault((x.get('w') or '').lower(), x)

    from collections import Counter
    tags = Counter(x['tag'] for x in uniq)
    print('PDF:', os.path.basename(a.pdf))
    print('提取词条:', len(uniq), '| 分类:', len(tags))
    for t, n in tags.items():
        print('   %-16s %d' % (t or '(未分类)', n))
    print('样例:')
    for x in uniq[:8] + uniq[-5:]:
        print('   %-28s [%s] <%s>' % (x['w'], x['phon'][:22], x['tag']))
    if not a.apply:
        print('\n(预览模式，未写入。加 --apply 覆盖 src=%s)' % src)
        return

    now = int(__import__('time').time() * 1000)
    built = []
    for i, it in enumerate(uniq):
        prev = old_by_word.get(it['w'].lower(), {})
        built.append({
            'id': 'wl%d_%x' % (now, i),
            'w': it['w'],
            'phon': it['phon'],
            'cn': prev.get('cn', '') if good_cn(prev.get('cn')) else '',
            'en_def': prev.get('en_def', '') if prev.get('en_def') else '',
            'ex': prev.get('ex', '') if prev.get('ex') else '',
            'src': src,
            'tag': it['tag'],
            'ts': now + i, 'done': 0,
            'hard': prev.get('hard', 0) or 0,
        })

    kept = [x for x in old_words if x.get('src') != src]
    new_words = built + kept
    if is_list:
        json.dump(new_words, open(WORDS_JSON, 'w', encoding='utf-8'),
                  ensure_ascii=False, indent=1)
    else:
        old['words'] = new_words
        json.dump(old, open(WORDS_JSON, 'w', encoding='utf-8'),
                  ensure_ascii=False, indent=1)

    if os.path.exists(WORD_INDEX):
        idx = json.load(open(WORD_INDEX, encoding='utf-8'))
        for f in idx:
            if f.get('name') == src:
                f['n'] = len(built)
        json.dump(idx, open(WORD_INDEX, 'w', encoding='utf-8'),
                  ensure_ascii=False, indent=1)

    print('\n已覆盖 src=%s：%d 条 -> %d 条；词库总数 %d -> %d'
          % (src, sum(1 for x in old_words if x.get('src') == src),
             len(built), len(old_words), len(new_words)))


if __name__ == '__main__':
    main()
