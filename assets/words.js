/* 单词模块：导入词表 → 勾选 → 循环播放 / 记忆动画 / 四格漫剧 */
(function () {
  'use strict';

  var API = '/api/words';
  var V = { en: 'en-US-AriaNeural', zh: 'zh-CN-XiaoxiaoNeural' };

  var S = {
    words: [], files: [], sel: {}, q: '', mode: 'server',
    stage: [], busy: false, down: false, filter: '', tags: [], page: 0,
    freshSince: 0, open: {}
  };
  var PAGE_SIZE = 50;

  /* 分组展开状态：记住每组是展开还是收起，刷新页面不丢 */
  var OPEN_KEY = 'pm_word_group_open';
  function loadOpen() {
    try { S.open = JSON.parse(localStorage.getItem(OPEN_KEY) || '{}') || {}; }
    catch (e) { S.open = {}; }
  }
  function saveOpen() {
    try { localStorage.setItem(OPEN_KEY, JSON.stringify(S.open)); } catch (e) { }
  }
  loadOpen();

  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function bytes(n) {
    if (n == null) return '';
    if (n < 1024) return n + ' B';
    if (n < 1048576) return (n / 1024).toFixed(0) + ' KB';
    return (n / 1048576).toFixed(1) + ' MB';
  }
  function note(t, ms) {
    $('note').textContent = t || '';
    clearTimeout(note._t);
    if (ms !== 0) note._t = setTimeout(function () {
      $('note').textContent = '一行一个词，顺序随意：单词、音标、中文、例句，缺哪个都行';
    }, ms || 5000);
  }

  /* ================= 音频 ================= */

  var audio = new Audio();
  audio.preload = 'auto';
  var clips = [], clipAt = 0, afterClips = null, rate = 1;

  function playClips(list, done) {
    clips = (list || []).filter(function (c) { return c && c.text; });
    clipAt = 0;
    afterClips = done || null;
    if (!clips.length) { if (afterClips) afterClips(); return; }
    step();
  }

  function step() {
    if (clipAt >= clips.length) {
      var f = afterClips; afterClips = null;
      if (f) f();
      return;
    }
    var c = clips[clipAt++];
    var r = Math.round((c.rate || -4) * rate);
    audio.src = (window.api ? api('/api/tts') : '/api/tts') + '?voice=' + encodeURIComponent(c.voice || V.en) +
      '&rate=' + r + '%&text=' + encodeURIComponent(c.text);
    audio.onended = step;
    audio.onerror = function () { setTimeout(step, 80); };
    var p = audio.play();
    if (p && p.catch) p.catch(function () { setTimeout(step, 80); });
  }

  function stopAudio() {
    clips = []; clipAt = 0; afterClips = null;
    try { audio.pause(); } catch (e) { }
    audio.removeAttribute('src');
  }

  /* ================= 数据 ================= */

  function load() {
    return fetch(API + '/list', { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (j) {
        S.mode = 'server';
        S.down = false;
        S.words = (j && j.words) || [];
        S.files = (j && j.files) || [];
        S.dir = (j && j.dir) || 'data/words-files';
      })
      .catch(function () {
        S.mode = 'local';
        S.down = true;
        S.words = [];
        S.files = [];
        if (window.apiFail) apiFail('单词库没读出来');
      });
  }

  function selWords() {
    return S.words.filter(function (w) { return S.sel[w.id]; });
  }

  /* 同步「全选本页」复选框：本页全选=勾、部分选中=半选、没选=空 */
  function syncSelAll() {
    var box = $('selPage');
    if (!box) return;
    var page = S.pageWords || [];
    var on = page.filter(function (w) { return S.sel[w.id]; }).length;
    var i = box.nextElementSibling;
    box.checked = page.length > 0 && on === page.length;
    box.indeterminate = on > 0 && on < page.length;
    if (i) i.classList.toggle('half', box.indeterminate);
    $('selPageInfo').textContent = page.length
      ? '本页已选 ' + on + ' / ' + page.length
      : '';
  }

  /* ================= 渲染 ================= */

  function row(w) {
    var on = !!S.sel[w.id];
    var isNew = !!(S.freshSince && (w.ts || 0) >= S.freshSince);
    return '<li class="wrow' + (w.done ? ' is-done' : '') + (on ? ' is-on' : '') +
      (isNew ? ' is-new' : '') + '" data-id="' + esc(w.id) + '">' +
      '<label class="wchk"><input type="checkbox"' + (on ? ' checked' : '') + '><i></i></label>' +
      '<div class="wmain">' +
      '<div class="wtop">' +
      '<b class="ww">' + esc(w.w) + '</b>' +
      (isNew ? '<span class="wnew">刚加</span>' : '') +
      (w.phon ? '<span class="wphon">/' + esc(w.phon) + '/</span>' : '') +
      (w.hard ? '<button class="whard on" type="button" data-act="hard" title="易错/易忘，点一下取消">⚠易错</button>'
              : '<button class="whard" type="button" data-act="hard" title="标记为易错/易忘">☆易错</button>') +
      (w.tag ? '<span class="wtag">' + esc(w.tag) + '</span>' : '') +
      (w.done ? '<span class="wdone">已背</span>' : '') +
      '<button class="wsay" type="button" data-say="' + esc(w.w) + '" aria-label="读一遍">▶</button>' +
      '<button class="wdelword" type="button" data-act="del" title="删除这个单词">✕</button>' +
      '</div>' +
      (w.cn ? '<div class="wcn">' + esc(w.cn) + '</div>' : '<div class="wcn none">还没有中文释义</div>') +
      (w.en_def ? '<div class="wen">' + esc(w.en_def) + '</div>' : '') +
      (w.ex ? '<div class="wex">' + esc(w.ex) + '</div>' : '<div class="wex none">还没有例句</div>') +
      '</div></li>';
  }

  /* 阅读考点词卡片：横排每行4个，单词在上、注释和例句在下 */
  function readingCard(w) {
    var on = !!S.sel[w.id];
    var isNew = !!(S.freshSince && (w.ts || 0) >= S.freshSince);
    return '<li class="rcard' + (w.done ? ' is-done' : '') + (on ? ' is-on' : '') +
      (isNew ? ' is-new' : '') + '" data-id="' + esc(w.id) + '">' +
      '<div class="rc-top">' +
        '<label class="wchk"><input type="checkbox"' + (on ? ' checked' : '') + '><i></i></label>' +
        '<b class="rc-w">' + esc(w.w) + '</b>' +
        '<button class="wsay" type="button" data-say="' + esc(w.w) + '" aria-label="读一遍">▶</button>' +
        '<button class="wdelword" type="button" data-act="del" title="删除这个单词">✕</button>' +
      '</div>' +
      (w.phon ? '<div class="rc-phon">/' + esc(w.phon) + '/</div>' : '') +
      '<div class="rc-cn">' + esc(w.cn || '（暂无注释）') + '</div>' +
      '<div class="rc-en">' + esc(w.en_def || '') + '</div>' +
      '<div class="rc-ex">' + esc(w.ex || '（暂无例句）') + '</div>' +
      '</li>';
  }

  /* 分类筛选：当前选中的分类 / 易错 */
  function applyFilter(list) {
    if (S.filter === 'hard') return list.filter(function (w) { return w.hard; });
    if (S.filter) return list.filter(function (w) { return w.tag === S.filter; });
    return list;
  }

  /* 按来源文件分组：以文件名分类，每组一个小三角，点开看这个文件里的全部单词
     标了 layout:'reading' 的文件（如 488考点词）用横排卡片：每行4个，单词在上、注释例句在下 */
  function renderGroups(list) {
    var groups = {}, order = [], layout = {};
    /* 文件列表顺序优先 */
    S.files.forEach(function (f) {
      if (f.name && !(f.name in groups)) { groups[f.name] = []; order.push(f.name); }
      if (f.layout) layout[f.name] = f.layout;
    });
    list.forEach(function (w) {
      var k = w.src || '未分类';
      if (!(k in groups)) { groups[k] = []; order.push(k); }
      groups[k].push(w);
    });

    return order.filter(function (k) { return groups[k] && groups[k].length; }).map(function (k) {
      var arr = groups[k];
      var open = S.open[k] !== false;   /* 默认展开，点小三角收起 */
      var done = arr.filter(function (w) { return w.done; }).length;
      var isReading = layout[k] === 'reading';
      var body = open
        ? (isReading
            ? '<ul class="rgrid">' + arr.map(readingCard).join('') + '</ul>'
            : '<ul class="wgrp-body">' + arr.map(row).join('') + '</ul>')
        : '';
      return '<li class="wgroup' + (open ? ' is-open' : '') + (isReading ? ' is-reading' : '') + '" data-src="' + esc(k) + '">' +
        '<div class="wgrp-hd" role="button" tabindex="0" aria-expanded="' + open + '">' +
        '<span class="wgrp-tri" aria-hidden="true">' + (open ? '▼' : '▶') + '</span>' +
        '<b class="wgrp-name">' + esc(k) + '</b>' +
        '<span class="wgrp-n">' + arr.length + ' 词' + (done ? ' · 已背 ' + done : '') + (isReading ? ' · 横排' : '') + '</span>' +
        '</div>' + body +
        '</li>';
    }).join('');
  }

  function render() {
    var q = S.q.trim().toLowerCase();
    var list = S.words.filter(function (w) {
      if (!q) return true;
      return (w.w + ' ' + w.cn + ' ' + w.ex).toLowerCase().indexOf(q) >= 0;
    });
    list = applyFilter(list);

    /* 按文件分组显示：展开的组显示全部单词，不再按 50 个分页 */
    $('wlist').innerHTML = renderGroups(list);
    $('pager').hidden = true;
    $('empty').hidden = S.words.length > 0;
    if (!S.words.length) {
      $('empty').textContent = S.down
        ? '读不到词库：本地服务没连上。先双击文件夹里的「启动.command」，再刷新这个页面。'
        : '还没有单词。把词表拖进上面那个框、选文件，或点「🎤 语音添加单词」念出来。';
    } else if (!list.length) {
      $('empty').hidden = false;
      $('empty').textContent = '这个分类下还没有单词。';
    }
    $('wcnt').textContent = S.words.length
      ? '共 ' + S.words.length + ' 个 · 已背 ' + S.words.filter(function (w) { return w.done; }).length +
        ' · 易错 ' + S.words.filter(function (w) { return w.hard; }).length +
        ' · ' + new Set(S.words.map(function (w) { return w.src || '未分类'; })).size + ' 份文件'
      : '';

    /* 全选本页：分组视图下列出的是当前筛选的全部词 */
    S.pageWords = list;
    syncSelAll();

    var n = selWords().length;
    /* 没勾选的时候不占屏：只有选了词才浮出来 */
    $('wbar').hidden = n === 0;
    $('barN').textContent = '已选 ' + n + ' 个';
    $('btnPlay').disabled = !n;
    $('btnAnim').disabled = !n;
    $('btnComic').disabled = !n;
    $('btnArticle').disabled = !n;
    $('btnDone').disabled = !n;
    $('btnHard').disabled = !n;
    $('btnTag').disabled = !n;

    if (S.files.length) {
      $('wfiles').hidden = false;
      $('wfiles').innerHTML = '<b>已导入 ' + S.files.length + ' 份</b>' +
        S.files.map(function (f) {
          return '<span class="wf">' + esc(f.name) + ' <i>' + (f.n || 0) + ' 词</i>' +
            '<button class="wdel" type="button" data-fid="' + esc(f.id) + '" title="移走这份文件（单词保留）">✕</button></span>';
        }).join('') +
        '<em>删除只移走文件，词库里已有的单词会保留</em>';
    } else {
      $('wfiles').hidden = true;
    }

    renderFilter();
  }

  /* 分页条：一眼看到总共有多少、能翻页 */
  function paintPager(total, pages) {
    var el = $('pager');
    if (!el) return;
    if (total <= PAGE_SIZE) { el.hidden = true; return; }
    el.hidden = false;
    $('pagerInfo').textContent = '第 ' + (S.page + 1) + ' / ' + pages + ' 页 · 共 ' + total + ' 个';
    $('pagerPrev').disabled = S.page === 0;
    $('pagerNext').disabled = S.page >= pages - 1;
  }

  /* 加词成功后：清掉搜索/筛选、回到第 1 页，把刚加的词高亮并滚到词库 */
  function showNewWords() {
    S.q = '';
    var qi = $('q'); if (qi) qi.value = '';
    S.filter = '';
    S.page = 0;
    S.freshSince = Date.now() - 10000;   // 10 秒内加入的词标「刚加」
    /* 刚加的词所属文件组自动展开，免得新词藏在收起的组里 */
    S.words.forEach(function (w) {
      if ((w.ts || 0) >= S.freshSince) {
        var k = w.src || '未分类';
        if (S.open[k] === false) { S.open[k] = true; saveOpen(); }
      }
    });
    renderFilter();
    [].forEach.call($('wfilter').querySelectorAll('.wchip[data-tag]'), function (c) {
      c.classList.toggle('on', c.getAttribute('data-tag') === '');
    });
    render();
    var hd = document.querySelector('.lib-hd');
    if (hd && hd.scrollIntoView) {
      try { hd.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { }
    }
  }

  /* 分类筛选栏：全部 / 易错 / 各应用场景标签 */
  function renderFilter() {
    var tags = {};
    S.words.forEach(function (w) { if (w.tag) tags[w.tag] = (tags[w.tag] || 0) + 1; });
    S.tags = Object.keys(tags).sort();

    var box = $('tagChips');
    box.innerHTML = S.tags.map(function (t) {
      return '<button class="wchip' + (S.filter === t ? ' on' : '') + '" data-tag="' + esc(t) + '" type="button">' +
        esc(t) + ' ' + tags[t] + '</button>';
    }).join('');

    var chips = $('wfilter').querySelectorAll('.wchip[data-tag]');
    [].forEach.call(chips, function (c) {
      var t = c.getAttribute('data-tag');
      c.classList.toggle('on', S.filter === t);
    });
  }

  /* ================= 导入 ================= */

  function pushFiles(fileList) {
    var arr = Array.prototype.slice.call(fileList || []);
    arr.forEach(function (f) { S.stage.push({ k: 'f', f: f }); });
    paintStage();
  }

  function pushText(t) {
    if (!String(t || '').trim()) return false;
    S.stage.push({ k: 't', text: String(t) });
    paintStage();
    return true;
  }

  /* 粘贴进来的文字：直接解析入库，并立刻刷新列表（不用再点「导入」） */
  function pasteText(t) {
    var text = String(t || '');
    if (!text.trim()) return false;
    var lines = text.split('\n').filter(function (x) { return x.trim(); }).length;
    note('粘进来 ' + lines + ' 行，正在解析…', 0);
    fetch(API + '/paste', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text })
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (!j || !j.ok) { note((j && j.err) || '没解析出单词', 8000); return; }
      return load().then(function () {
        showNewWords();
        if (!j.parsed) note('没认出英文单词。请确认复制的是词表（一行一个英文单词+中文），不是别的话。', 9000);
        else if (!j.added && !j.updated) note('认出 ' + j.parsed + ' 行，词库里都已经有了，没有新增', 6000);
        else note('认出 ' + j.parsed + ' 行，新增 ' + (j.added || 0) + ' 个' + (j.updated ? '，补全 ' + j.updated + ' 个' : '') + (j.enriched ? '，已自动补上释义/例句' : '') + '，下面已列出，可勾选', 6500);
      });
    }).catch(function () {
      if (window.apiFail) apiFail('词表没解析成功');
      note('连不上本地服务 —— 先双击「启动.command」，再刷新这一页', 9000);
    });
    return true;
  }

  function htmlText(h) {
    return String(h || '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|div|li|tr|h[1-6])>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
      .replace(/&#39;/g, "'").replace(/&quot;/g, '"');
  }

  /* 收一次粘贴：先文件，再纯文字，最后从 HTML 里扒文字（公众号/微信群常见） */
  function handlePaste(dt) {
    if (!dt) return false;
    var files = [], i;
    if (dt.files && dt.files.length) for (i = 0; i < dt.files.length; i++) files.push(dt.files[i]);
    if (!files.length && dt.items) {
      for (i = 0; i < dt.items.length; i++) {
        if (dt.items[i].kind === 'file') {
          var f = dt.items[i].getAsFile();
          if (f) files.push(f);
        }
      }
    }
    if (files.length) {
      // 粘贴进来的文件也直接导入，不再进暂存等按钮
      S.stage = files.map(function (f) { return { k: 'f', f: f }; });
      paintStage();
      doImport();
      return true;
    }

    /* 右键粘文件：浏览器给的不是文件对象，而是一条 file:// 路径。
       注意：从微信/Finder 复制文件时 text/plain 只有「文件名」，
       必须先单独看 text/uri-list，不能让文件名把分支抢走（否则当成词表 → 导不进）。 */
    var fileUri = '';
    try { fileUri = String(dt.getData('text/uri-list') || '').trim().split('\n')[0].trim(); } catch (e) { }
    if (/^file:\/\//i.test(fileUri)) return importPath(fileUri);

    var t = '';
    try { t = dt.getData('text/plain') || ''; } catch (e) { }
    if (!t.trim()) { try { t = htmlText(dt.getData('text/html')); } catch (e) { } }
    /* 有的应用把 file:// 放在 text/plain 里 */
    var uri2 = String(t || '').trim().split('\n')[0].trim();
    if (/^file:\/\//i.test(uri2)) return importPath(uri2);

    if (t && t.trim()) return pasteText(t);
    return false;
  }

  /* 按 file:// 路径让服务端读文件导入（扫描件 PDF 走 OCR）。 */
  function importPath(uri) {
    note('识别到粘贴的文件，正在读取…', 0);
    fetch(API + '/path', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: uri })
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (!j || !j.ok) { note((j && j.err) || '文件导入失败', 8000); return; }
      return load().then(function () {
        showNewWords();
        if (!j.parsed) note('读出了文件但没认出单词（可能不是词表）', 7000);
        else note('已从「' + (j.file || '文件') + '」导入 ' + (j.added || 0) + ' 个新词', 6000);
      });
    }).catch(function () {
      if (window.apiFail) apiFail('文件没读出来');
      note('连不上本地服务 —— 先双击「启动.command」，再刷新这一页', 9000);
    });
    return true;
  }

  function paintStage() {
    var ul = $('stageList');
    ul.innerHTML = S.stage.map(function (it, i) {
      var name, sz, hint = '';
      if (it.k === 'f') {
        name = it.f.name;
        sz = bytes(it.f.size);
      } else {
        var first = (it.text || '').split('\n').filter(function (x) { return x.trim(); })[0] || '';
        name = '粘贴的文字（' + it.text.split('\n').filter(function (x) { return x.trim(); }).length + ' 行）';
        hint = first.length > 22 ? first.slice(0, 22) + '…' : first;
        sz = bytes(new Blob([it.text]).size);
      }
      return '<li class="stag" data-i="' + i + '"><span class="sic">' + (it.k === 'f' ? 'FILE' : 'TXT') + '</span>' +
        '<span class="sname">' + esc(name) + '</span>' +
        (hint ? '<span class="sprev">' + esc(hint) + '</span>' : '') +
        '<span class="ssz">' + sz + '</span>' +
        '<button class="odel" type="button" data-i="' + i + '" aria-label="移出">×</button></li>';
    }).join('');
    $('boxPh').style.display = S.stage.length ? 'none' : '';
    $('importBtn').disabled = !S.stage.length || S.busy;
    $('importBtn').textContent = S.stage.length ? '导入词表（' + S.stage.length + '）' : '导入词表';
  }

  function doImport() {
    if (!S.stage.length || S.busy) return;
    S.busy = true;
    $('importBtn').disabled = true;
    note('正在解析…', 0);

    var jobs = S.stage.map(function (it) {
      if (it.k === 't') {
        return fetch(API + '/paste', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: it.text })
        }).then(function (r) { return r.json(); });
      }
      return fetch(API + '/upload', {
        method: 'POST',
        headers: {
          'X-Filename': encodeURIComponent(it.f.name),
          'X-Type': it.f.type || 'text/plain'
        },
        body: it.f
      }).then(function (r) { return r.json(); });
    });

    Promise.all(jobs).then(function (res) {
      var add = 0, bad = [], parsed = 0, enriched = 0;
      res.forEach(function (r) {
        if (r && r.ok) { add += r.added || 0; parsed += r.parsed || 0; enriched += r.enriched || 0; }
        else bad.push((r && r.err) || '导入失败');
      });
      S.stage = [];
      paintStage();
      return load().then(function () {
        showNewWords();
        S.busy = false;
        if (bad.length) note(bad[0], 8000);
        else if (!add) note('解析 ' + parsed + ' 行，但词库里都已经有了，没有新增', 6000);
        else note('解析 ' + parsed + ' 行，新增 ' + add + ' 个词' + (enriched ? '，已自动补上释义和例句' : ''), 6000);
      });
    }).catch(function () {
      S.busy = false;
      paintStage();
      if (window.apiFail) apiFail('词表导入没成功');
      note('连不上本地服务 —— 先双击「启动.command」，再刷新这一页', 9000);
    });
  }

  /* ================= 播放 ================= */

  var P = { list: [], i: 0, loop: 1, maxLoop: 3, playing: false, auto: true };

  function startPlay() {
    var list = selWords();
    if (!list.length) return;
    P.list = list; P.i = 0; P.loop = 1; P.playing = true;
    $('playMask').hidden = false;
    paintPlay();
    speakCurrent();
  }

  function paintPlay() {
    var w = P.list[P.i];
    if (!w) return;
    $('wpIdx').textContent = (P.i + 1) + ' / ' + P.list.length;
    $('wpLoop').textContent = '第 ' + P.loop + ' 遍 / 共 ' + P.maxLoop;
    $('wpWord').textContent = w.w;
    $('wpPhon').textContent = w.phon ? '/' + w.phon + '/' : '';
    /* 循环播放只显示英英释义，不显示中文释义 */
    $('wpCn').textContent = w.en_def || '';
    $('wpEx').innerHTML = w.ex ? esc(w.ex) : '';
    $('wpEx').classList.toggle('none', !w.ex);
    $('wpToggle').textContent = P.playing ? '暂停' : '继续';
  }

  function speakCurrent() {
    var w = P.list[P.i];
    if (!w) return stopPlay();
    stopAudio();
    var list = [{ text: w.w, voice: V.en, rate: -10 }];
    if (w.ex) list.push({ text: w.ex, voice: V.en, rate: -8 });
    /* 不读中文释义：英英释义用英文语音朗读；没有英英释义时就不读这一段 */
    if (w.en_def) list.push({ text: w.en_def, voice: V.en, rate: -6 });
    playClips(list, function () {
      if (!P.playing) return;
      setTimeout(function () {
        if (P.playing && P.auto) nextWord();
      }, 900);
    });
  }

  function nextWord() {
    if (P.i + 1 < P.list.length) {
      P.i++;
    } else {
      if (P.loop >= P.maxLoop) { P.playing = false; paintPlay(); return; }
      P.loop++; P.i = 0;
    }
    paintPlay();
    if (P.playing) speakCurrent();
  }

  function prevWord() {
    if (P.i > 0) P.i--; else if (P.loop > 1) { P.loop--; P.i = P.list.length - 1; }
    paintPlay();
    if (P.playing) speakCurrent();
  }

  function stopPlay() {
    P.playing = false;
    stopAudio();
    $('playMask').hidden = true;
  }

  /* ================= 动画 / 漫剧 ================= */

  var A = { list: [], i: 0, mode: 'anim', timer: null, paused: false };

  function startShow(mode) {
    var list = selWords();
    if (!list.length) return;
    A.list = list; A.i = 0; A.mode = mode; A.paused = false;
    $('wsTitle').textContent = mode === 'anim' ? '记忆动画' : '四格漫剧';
    $('wsPause').textContent = '暂停';
    $('showMask').hidden = false;
    paintShow();
  }

  function paintShow() {
    var w = A.list[A.i];
    if (!w) return;
    $('wsIdx').textContent = (A.i + 1) + ' / ' + A.list.length;
    $('wsStage').innerHTML = A.mode === 'anim' ? animHTML(w) : comicHTML(w);
    clearTimeout(A.timer);
    var hold = A.mode === 'anim' ? 7200 : 9000;
    if (!A.paused) {
      A.timer = setTimeout(function () { showNext(); }, hold);
    }
    /* 动画里也把词读一遍 */
    playClips([{ text: w.w, voice: V.en, rate: -10 }].concat(w.ex ? [{ text: w.ex, voice: V.en, rate: -8 }] : []));
  }

  function showNext() {
    if (A.i + 1 < A.list.length) { A.i++; paintShow(); }
    else { closeShow(); }
  }
  function showPrev() {
    if (A.i > 0) { A.i--; paintShow(); }
  }
  function closeShow() {
    clearTimeout(A.timer);
    stopAudio();
    $('showMask').hidden = true;
  }

  function animHTML(w) {
    var letters = w.w.split('').map(function (c, i) {
      return '<span style="--i:' + i + '">' + esc(c === ' ' ? '&nbsp;' : c) + '</span>';
    }).join('');
    return '<div class="an">' +
      '<div class="an-letters">' + letters + '</div>' +
      '<div class="an-phon">' + (w.phon ? '/' + esc(w.phon) + '/' : '&nbsp;') + '</div>' +
      '<div class="an-cn">' + esc(w.cn || '') + '</div>' +
      '<div class="an-ex">' + markWord(w.ex, w.w) + '</div>' +
      '</div>';
  }

  function comicHTML(w) {
    var parts = splitBeats(w.ex, 3);
    var panels = [
      { tag: '1', bub: w.w, sub: w.phon ? '/' + w.phon + '/' : '', face: 'hi' },
      { tag: '2', bub: w.cn || '…', sub: '', face: 'think' },
      { tag: '3', bub: parts[0] || w.w, sub: parts[1] || '', face: 'talk' },
      { tag: '4', bub: w.w, sub: '你还记得意思吗？', face: 'hi' }
    ];
    return '<div class="cm">' + panels.map(function (p, i) {
      return '<div class="cm-p" style="--i:' + i + '">' +
        '<div class="cm-face ' + p.face + '"><i></i><i></i></div>' +
        '<div class="cm-bub">' + esc(p.bub) + (p.sub ? '<em>' + esc(p.sub) + '</em>' : '') + '</div>' +
        '<span class="cm-n">' + p.tag + '</span>' +
        '</div>';
    }).join('') + '</div>';
  }

  /* 例句里把目标词加粗（含词形变化：abandon → abandoned） */
  function markWord(ex, w) {
    if (!ex) return '';
    var stem = String(w).split(' ')[0].replace(/[^A-Za-z]/g, '');
    if (stem.length < 3) return esc(ex);
    var re = new RegExp('\\b(' + stem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[a-z]{0,4})\\b', 'gi');
    return esc(ex).replace(re, '<b>$1</b>');
  }

  function splitBeats(ex, n) {
    if (!ex) return [];
    var words = ex.split(/\s+/);
    var per = Math.ceil(words.length / n);
    var out = [];
    for (var i = 0; i < words.length; i += per) out.push(words.slice(i, i + per).join(' '));
    return out;
  }

  /* ================= 事件 ================= */

  function bind() {
    var box = $('box'), sink = $('sink');

    function focusBox() { try { sink.focus({ preventScroll: true }); } catch (e) { } }
    box.addEventListener('mousedown', function (e) {
      if (e.target.closest('button')) return;
      focusBox();
    });
    box.addEventListener('contextmenu', function (e) {
      if (e.target.closest('button')) return;
      focusBox();
    });
    sink.addEventListener('input', function () { sink.value = ''; });
    sink.addEventListener('keydown', function (e) {
      if (e.key === 'Backspace' || e.key === 'Delete') {
        if (S.stage.length) { S.stage.pop(); paintStage(); }
        e.preventDefault(); return;
      }
      if (e.key === 'Tab') return;
      var mod = e.metaKey || e.ctrlKey;
      if (!mod) e.preventDefault();
    });

    sink.addEventListener('paste', function (e) {
      e.preventDefault();
      e.stopPropagation();
      handlePaste(e.clipboardData || window.clipboardData);
      setTimeout(function () { sink.value = ''; }, 0);
    });
    /* 兜底：框没被点中时按 ⌘V 也收（焦点在页面上就行） */
    document.addEventListener('paste', function (e) {
      if (e.defaultPrevented) return;
      var t = e.target;
      if (t && (t.tagName === 'INPUT' || (t.tagName === 'TEXTAREA' && t.id !== 'sink'))) return;
      if (handlePaste(e.clipboardData || window.clipboardData)) e.preventDefault();
    });

    ['dragenter', 'dragover'].forEach(function (ev) {
      box.addEventListener(ev, function (e) { e.preventDefault(); box.classList.add('over'); });
    });
    ['dragleave', 'drop'].forEach(function (ev) {
      box.addEventListener(ev, function (e) { e.preventDefault(); box.classList.remove('over'); });
    });
    box.addEventListener('drop', function (e) {
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
        // 拖进来的文件也直接导入
        S.stage = Array.prototype.slice.call(e.dataTransfer.files).map(function (f) {
          return { k: 'f', f: f };
        });
        paintStage();
        doImport();
        return;
      }
      handlePaste(e.dataTransfer);
    });
    document.addEventListener('dragover', function (e) { e.preventDefault(); });
    document.addEventListener('drop', function (e) { e.preventDefault(); });

    $('pickBtn').addEventListener('click', function () { $('pick').click(); });
    $('pick').addEventListener('change', function () {
      var arr = Array.prototype.slice.call(this.files || []);
      this.value = '';
      if (!arr.length) return;
      // 选好文件就直接导入，不再要求再点一次「导入词表」
      S.stage = arr.map(function (f) { return { k: 'f', f: f }; });
      paintStage();
      doImport();
    });
    $('importBtn').addEventListener('click', doImport);
    $('stageList').addEventListener('click', function (e) {
      var b = e.target.closest('.odel');
      if (!b) return;
      S.stage.splice(parseInt(b.getAttribute('data-i'), 10), 1);
      paintStage();
    });

    /* 删除已导入的词表文件（只移走文件，词库单词保留）。
       不再弹 confirm：原生确认框常被浏览器挡在窗口后面，看起来像"点了没反应"。
       直接删 + 轻提示，跟单词行的 ✕ 保持一致。 */
    $('wfiles').addEventListener('click', function (e) {
      var b = e.target.closest('.wdel');
      if (!b) return;
      var fid = b.getAttribute('data-fid');
      var name = '';
      S.files.forEach(function (f) { if (f.id === fid) name = f.name; });
      /* 先禁用按钮，防连点重复删 */
      b.disabled = true;
      fetch(API + '/file-del', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: fid })
      }).then(function (r) { return r.json(); }).then(function (j) {
        if (!j || !j.ok) {
          b.disabled = false;
          note((j && j.err) || '删除失败', 6000);
          return;
        }
        S.files = S.files.filter(function (f) { return f.id !== fid; });
        render();
        note('已移走「' + (j.removed || name) + '」，词库单词保留', 5000);
      }).catch(function () {
        b.disabled = false;
        if (window.apiFail) apiFail('删除没成功');
        note('连不上本地服务 —— 先双击「启动.command」，再刷新这一页', 8000);
      });
    });

    $('wlist').addEventListener('change', function (e) {
      if (e.target.type !== 'checkbox') return;
      var li = e.target.closest('.wrow, .rcard');
      S.sel[li.getAttribute('data-id')] = e.target.checked;
      render();
    });

    $('q').addEventListener('input', function () { S.q = this.value; S.page = 0; render(); });

    /* 分页 */
    $('pagerPrev').addEventListener('click', function () { if (S.page > 0) { S.page--; render(); window.scrollTo(0, 0); } });
    $('pagerNext').addEventListener('click', function () { S.page++; render(); window.scrollTo(0, 0); });

    $('selAll').addEventListener('click', function () {
      S.words.forEach(function (w) { S.sel[w.id] = true; });
      render();
    });
    $('selNone').addEventListener('click', function () {
      S.sel = {};
      render();
    });
    $('selUndone').addEventListener('click', function () {
      S.sel = {};
      S.words.forEach(function (w) { if (!w.done) S.sel[w.id] = true; });
      render();
    });

    /* 全选本页：一次性勾选/取消当前页所有词 */
    $('selPage').addEventListener('click', function () {
      var page = S.pageWords || [];
      var allOn = page.length > 0 && page.every(function (w) { return S.sel[w.id]; });
      page.forEach(function (w) { S.sel[w.id] = allOn ? false : true; });
      render();
    });

    $('btnDone').addEventListener('click', function () {
      var list = selWords();
      if (!list.length) return;
      Promise.all(list.map(function (w) {
        return fetch(API + '/set', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: w.id, done: 1 })
        }).catch(function () { });
      })).then(function () {
        list.forEach(function (w) { w.done = 1; S.sel[w.id] = false; });
        render();
        note('已标记 ' + list.length + ' 个为已背');
      });
    });

    $('btnPlay').addEventListener('click', startPlay);
    $('btnAnim').addEventListener('click', function () { startShow('anim'); });
    $('btnComic').addEventListener('click', function () { startShow('comic'); });

    /* ============ 选词生成雅思文章 ============ */
    var artTopic = '';
    function openArticle() {
      var list = selWords();
      if (!list.length) return;
      artTopic = '';
      $('artWordLine').textContent = '将用这 ' + list.length + ' 个词：' +
        list.map(function (w) { return w.w; }).join('、');
      $('artPick').hidden = false;
      $('artResult').hidden = true;
      $('artLoading').hidden = true;
      $('artTitleTop').textContent = '生成雅思文章';
      [].forEach.call($('artPick').querySelectorAll('.art-topic'), function (b) {
        b.classList.remove('on');
      });
      $('artMask').hidden = false;
    }
    $('btnArticle').addEventListener('click', openArticle);
    $('artClose').addEventListener('click', function () { stopAudio(); $('artMask').hidden = true; });
    $('artMask').addEventListener('click', function (e) {
      if (e.target === this) { stopAudio(); this.hidden = true; }
    });
    $('artPick').addEventListener('click', function (e) {
      var b = e.target.closest('.art-topic');
      if (!b) return;
      artTopic = b.getAttribute('data-topic');
      [].forEach.call(this.querySelectorAll('.art-topic'), function (x) {
        x.classList.toggle('on', x === b);
      });
    });
    function genArticle() {
      if (!artTopic) { note('先选一个主题', 4000); return; }
      var words = selWords().map(function (w) { return w.w; });
      if (!words.length) { note('先勾选一些单词', 4000); return; }
      $('artPick').hidden = true;
      $('artResult').hidden = true;
      $('artLoading').hidden = false;
      stopAudio();
      fetch(API + '/article', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ words: words, topic: artTopic })
      }).then(function (r) { return r.json(); }).then(function (j) {
        $('artLoading').hidden = true;
        if (!j || !j.ok) {
          $('artPick').hidden = false;
          note((j && j.err) || '生成失败，请重试', 8000);
          return;
        }
        $('artTitleTop').textContent = '雅思阅读短文';
        $('artH').textContent = j.title || 'IELTS Reading Passage';
        $('artZh').textContent = j.zh || '';
        $('artZh').hidden = !j.zh;
        $('artText').textContent = j.article || '';
        var used = j.used || [];
        var hit = used.length
          ? '已自然融入 ' + used.length + ' 个选中的词：' + used.join('、')
          : '已按所选主题写成雅思难度短文';
        $('artNote').textContent = hit + '。';
        $('artResult').hidden = false;
      }).catch(function () {
        $('artLoading').hidden = true;
        $('artPick').hidden = false;
        if (window.apiFail) apiFail('生成文章没成功');
        note('连不上本地服务，先双击「启动.command」', 8000);
      });
    }
    $('artGo').addEventListener('click', genArticle);
    $('artAgain').addEventListener('click', openArticle);
    $('artSay').addEventListener('click', function () {
      var text = $('artText').textContent || '';
      if (!text) return;
      playClips([{ text: text, voice: V.en, rate: -6 }]);
    });
    $('artCopy').addEventListener('click', function () {
      var text = ($('artH').textContent || '') + '\n\n' + ($('artText').textContent || '');
      var done = function () { note('文章已复制', 3000); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () { note('复制失败，请手动选中', 4000); });
      } else {
        var ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (e) { note('复制失败，请手动选中', 4000); }
        document.body.removeChild(ta);
      }
    });

    /* 手动输入词表：保底入口，任何情况都能把词敲进来 */
    $('manualGo').addEventListener('click', function () {
      var t = $('manualText').value;
      if (!String(t || '').trim()) { $('manualMsg').textContent = '先在上面输入几个词'; return; }
      $('manualMsg').textContent = '正在解析…';
      fetch(API + '/paste', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: t })
      }).then(function (r) { return r.json(); }).then(function (j) {
        if (!j || !j.ok) { $('manualMsg').textContent = (j && j.err) || '没解析出单词'; return; }
        return load().then(function () {
          showNewWords();
          if (!j.parsed) $('manualMsg').textContent = '没认出英文单词，检查一下是不是每行都有英文。';
          else { $('manualMsg').textContent = '加进 ' + (j.added || 0) + ' 个，下面已列出。'; $('manualText').value = ''; }
        });
      }).catch(function () {
        $('manualMsg').textContent = '连不上本地服务，先双击「启动.command」。';
      });
    });

    /* 语音添加单词（微信式）：按住按钮录音 → 松手 → 豆包识别 → 自动加进词库。
       关键：必须等识别接口返回文字后才加词。旧版用固定 1.5 秒延时去取缓冲，
       而识别要 2 秒以上，取到的永远是空串，所以词一个都加不进去。 */
    var vRec = null, vChunks = [], vMime = '', vStartAt = 0;
    var vHolding = false, vBusy = false;

    function vMimePick() {
      var c = ['audio/mp4', 'audio/mp4;codecs=mp4a.40.2', 'audio/webm', 'audio/webm;codecs=opus'];
      for (var i = 0; i < c.length; i++) {
        if (window.MediaRecorder && MediaRecorder.isTypeSupported(c[i])) return c[i];
      }
      return '';
    }
    function vExt(m) { return m.indexOf('webm') >= 0 ? 'webm' : 'm4a'; }
    function vHint(t) { $('voiceHint').textContent = t; }
    function vBtn(text, cls) {
      var b = $('voiceBtn');
      b.textContent = text;
      b.className = 'btn voice-hold' + (cls ? ' is-' + cls : '');
    }
    function vIdle() { vBusy = false; vBtn('🎤 按住说话'); }
    function vLive(t) {
      $('voiceLive').hidden = !t;
      $('voiceLive').textContent = t || '';
    }

    /* 只有拿到识别文字才调用：解析并加进词库 */
    function vAddWords(text) {
      var t = String(text || '').trim();
      if (!t) { vHint('没听清，按住再说一次'); vIdle(); return; }
      vLive(t);
      vHint('听到「' + t.replace(/\s*\n\s*/g, ' / ').slice(0, 60) + '」，正在加进词库…');
      fetch(API + '/paste', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: t })
      }).then(function (r) { return r.json(); }).then(function (j) {
        if (!j || !j.ok) { vHint((j && j.err) || '没加进去，再试一次'); vIdle(); return; }
        return load().then(function () {
          showNewWords();
          vIdle();
          if (j.added) {
            vHint('✓ 加进 ' + j.added + ' 个词' + (j.enriched ? '，已自动补中文释义、英英解释和例句' : '') + '。想继续就再按住念。');
          } else if (j.updated) {
            vHint('✓ 补全了 ' + j.updated + ' 个词。');
          } else if (j.parsed) {
            vHint('词库里都已经有了，没有新增。');
          } else {
            vHint('听到了「' + t.slice(0, 40) + '」，但没认出英文单词。请念「英文单词 + 中文」。');
          }
        });
      }).catch(function () {
        vHint('连不上本地服务，先双击「启动.command」。');
        vIdle();
      });
    }

    /* 一段录音 → 豆包识别（mode=words：一行一个词）→ 加词 */
    function vRecognize(chunks, mime) {
      if (!chunks.length) { vHint('没录到声音，按住别松、念完再松手。'); vIdle(); return; }
      var blob = new Blob(chunks, { type: mime });
      var reader = new FileReader();
      reader.onload = function () {
        var b64 = String(reader.result || '').split(',')[1] || '';
        vHint('识别中…（约 2 秒）');
        fetch('/api/notes/asr', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audio: b64, format: vExt(mime), mode: 'words' })
        }).then(function (r) { return r.json(); }).then(function (j) {
          if (j && j.ok && j.text) vAddWords(j.text);
          else { vHint((j && j.err) || '没识别出来，按住再说一次'); vIdle(); }
        }).catch(function () {
          vHint('连不上本地服务，先双击「启动.command」。');
          vIdle();
        });
      };
      reader.readAsDataURL(blob);
    }

    /* 按住：申请麦克风并开始录音 */
    function vBegin() {
      if (vBusy) return;
      if (!window.MediaRecorder || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        vHint('这个环境不能录音，请用 Chrome 打开 127.0.0.1:8101/words.html 操作。');
        return;
      }
      vMime = vMimePick();
      if (!vMime) { vHint('浏览器不支持录音格式，请换 Chrome。'); return; }
      vBusy = true;
      vHint('正在准备麦克风…');
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
        if (!vHolding) {
          /* 授权弹窗期间用户已松手 */
          stream.getTracks().forEach(function (t) { t.stop(); });
          vHint('刚才按得太快了：按住按钮别松，念完再松手。');
          vIdle(); return;
        }
        vChunks = [];
        vRec = new MediaRecorder(stream, { mimeType: vMime });
        vRec.ondataavailable = function (e) { if (e.data && e.data.size) vChunks.push(e.data); };
        vRec.onstop = function () {
          stream.getTracks().forEach(function (t) { t.stop(); });
          vRec = null;
          var ch = vChunks.slice(); vChunks = [];
          if (Date.now() - vStartAt < 350) {
            vHint('按得太短了：按住别松、念出单词后再松手。');
            vIdle(); return;
          }
          vRecognize(ch, vMime);
        };
        vRec.start(200);
        vStartAt = Date.now();
        vBtn('🔴 松开添加', 'rec');
        vHint('正在录音… 念「单词 + 中文」，可以连着念好几个，松手就加进去。');
      }).catch(function (err) {
        vHolding = false;
        vHint('麦克风没开：点地址栏左侧的锁/喇叭图标 → 把「麦克风」改成允许，再按住试一次。' +
              (err && err.name ? '（' + err.name + '）' : ''));
        vIdle();
      });
    }

    /* 松手：停止录音，等识别结果回来后自动加词 */
    function vRelease() {
      if (!vHolding) return;
      vHolding = false;
      vBtn('⏳ 处理中…', 'busy');
      vHint('正在整理录音…');
      if (vRec && vRec.state !== 'inactive') {
        try { vRec.stop(); } catch (e) { vIdle(); }
      }
      /* 若录音还没建好（授权弹窗），vBegin 的 !vHolding 分支会收尾 */
    }

    /* 微信式：按住 = 录音，松手 = 添加。鼠标 / 触屏 / 键盘都支持。 */
    var vbtn = $('voiceBtn');
    vbtn.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      try { if (vbtn.setPointerCapture) vbtn.setPointerCapture(e.pointerId); } catch (err) { }
      vHolding = true;
      vBegin();
    });
    window.addEventListener('pointerup', vRelease);
    window.addEventListener('pointercancel', vRelease);
    window.addEventListener('blur', vRelease);
    vbtn.addEventListener('lostpointercapture', vRelease);
    vbtn.addEventListener('keydown', function (e) {
      if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); vHolding = true; vBegin(); }
    });
    vbtn.addEventListener('keyup', function (e) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); vRelease(); }
    });
    vbtn.addEventListener('contextmenu', function (e) { e.preventDefault(); });

    /* 易错 / 易忘标注 */
    function setHard(w, on) {
      return fetch(API + '/set', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: w.id, hard: on ? 1 : 0 })
      }).catch(function () { });
    }
    /* 统一的词行点击：朗读 / 易错 / 删除 / 勾选切换。
       以前这里有两个 click 监听器，第一个点任意位置就 render() 重建 DOM，
       把第二个监听器要操作的 ✕ 按钮换掉了，导致「点叉删不掉」。现合并为一个。 */
    $('wlist').addEventListener('click', function (e) {
      /* 点文件名那一行的小三角：展开 / 收起这一组的全部单词 */
      var hd = e.target.closest('.wgrp-hd');
      if (hd) {
        var g = hd.closest('.wgroup');
        var key = g.getAttribute('data-src');
        S.open[key] = S.open[key] === false;   /* 展开→收起，收起→展开 */
        saveOpen();
        render();
        return;
      }
      var say = e.target.closest('.wsay');
      if (say) {
        e.stopPropagation();
        playClips([{ text: say.getAttribute('data-say'), voice: V.en, rate: -10 }]);
        return;
      }
      var hb = e.target.closest('[data-act="hard"]');
      if (hb) {
        e.stopPropagation();
        var li = hb.closest('.wrow, .rcard');
        var wid = li.getAttribute('data-id');
        var w = null;
        S.words.forEach(function (x) { if (x.id === wid) w = x; });
        if (w) {
          w.hard = w.hard ? 0 : 1;
          setHard(w, w.hard).then(function () { render(); });
        }
        return;
      }
      var db = e.target.closest('[data-act="del"]');
      if (db) {
        e.stopPropagation();
        var dli = db.closest('.wrow, .rcard');
        var dwid = dli.getAttribute('data-id');
        var dw = null;
        S.words.forEach(function (x) { if (x.id === dwid) dw = x; });
        if (!dw) return;
        /* 直接删，不弹确认框 */
        fetch(API + '/del', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: dwid })
        }).then(function (r) { return r.json(); }).then(function (j) {
          if (!j || !j.ok) { note((j && j.err) || '删除失败', 6000); return; }
          S.words = S.words.filter(function (x) { return x.id !== dwid; });
          delete S.sel[dwid];
          render();
          note('已删除「' + dw.w + '」', 4000);
        }).catch(function () {
          if (window.apiFail) apiFail('删除没成功');
        });
        return;
      }
      /* 点整行（非按钮区）：切换勾选 */
      var row = e.target.closest('.wrow, .rcard');
      if (!row) return;
      var rid = row.getAttribute('data-id');
      S.sel[rid] = !S.sel[rid];
      render();
    });

    /* 组标题支持键盘：回车 / 空格展开收起 */
    $('wlist').addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var hd = e.target.closest('.wgrp-hd');
      if (!hd) return;
      e.preventDefault();
      hd.click();
    });

    /* 批量标易错 */
    $('btnHard').addEventListener('click', function () {
      var list = selWords();
      if (!list.length) return;
      var anyHard = list.some(function (w) { return !w.hard; });
      Promise.all(list.map(function (w) {
        w.hard = anyHard ? 1 : 0;
        return fetch(API + '/set', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: w.id, hard: w.hard })
        }).catch(function () { });
      })).then(function () {
        render();
        note(anyHard ? ('已把 ' + list.length + ' 个标为易错') : ('已取消 ' + list.length + ' 个的易错标记'));
      });
    });

    /* 加分类弹窗 */
    var pendingTag = '';
    function openTag() {
      var tags = {};
      S.words.forEach(function (w) { if (w.tag) tags[w.tag] = 1; });
      var names = Object.keys(tags);
      $('tagChoices').innerHTML = names.length
        ? names.map(function (t) {
            return '<button class="wchip' + (pendingTag === t ? ' on' : '') + '" data-t="' + esc(t) + '" type="button">' + esc(t) + '</button>';
          }).join('')
        : '<span class="wtag-empty">还没有分类，在下面输入一个，比如「学术」「口语」</span>';
      $('tagInput').value = pendingTag;
      $('tagMask').hidden = false;
    }
    $('btnTag').addEventListener('click', function () {
      if (!selWords().length) return;
      pendingTag = '';
      openTag();
    });
    $('tagChoices').addEventListener('click', function (e) {
      var b = e.target.closest('.wchip');
      if (!b) return;
      pendingTag = b.getAttribute('data-t');
      $('tagInput').value = pendingTag;
      [].forEach.call($('tagChoices').querySelectorAll('.wchip'), function (c) {
        c.classList.toggle('on', c.getAttribute('data-t') === pendingTag);
      });
    });
    $('tagInput').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { pendingTag = this.value.trim(); $('tagOk').click(); }
    });
    $('tagOk').addEventListener('click', function () {
      var t = pendingTag || $('tagInput').value.trim();
      if (!t) return;
      var list = selWords();
      Promise.all(list.map(function (w) {
        w.tag = t;
        return fetch(API + '/set', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: w.id, tag: t })
        }).catch(function () { });
      })).then(function () {
        $('tagMask').hidden = true;
        render();
        note('已把 ' + list.length + ' 个词归到「' + t + '」');
      });
    });
    $('tagClose').addEventListener('click', function () { $('tagMask').hidden = true; });
    $('tagCancel').addEventListener('click', function () { $('tagMask').hidden = true; });
    $('tagMask').addEventListener('click', function (e) { if (e.target === this) this.hidden = true; });

    /* 分类筛选 */
    $('wfilter').addEventListener('click', function (e) {
      var b = e.target.closest('.wchip');
      if (!b) return;
      var t = b.getAttribute('data-tag') || '';
      S.filter = t;
      render();
    });

    $('wpClose').addEventListener('click', stopPlay);
    $('wpToggle').addEventListener('click', function () {
      P.playing = !P.playing;
      if (P.playing) speakCurrent(); else stopAudio();
      paintPlay();
    });
    $('wpNext').addEventListener('click', function () { P.playing = true; nextWord(); });
    $('wpPrev').addEventListener('click', function () { P.playing = true; prevWord(); });
    $('wpRate').addEventListener('click', function () {
      rate = rate >= 1.3 ? 0.8 : +(rate + 0.25).toFixed(2);
      this.textContent = '语速 ' + rate.toFixed(2) + '×';
    });
    $('wpAuto').addEventListener('click', function () {
      P.auto = !P.auto;
      this.textContent = '自动下一个：' + (P.auto ? '开' : '关');
    });

    $('wsClose').addEventListener('click', closeShow);
    $('wsNext').addEventListener('click', function () { A.paused = false; showNext(); });
    $('wsPrev').addEventListener('click', showPrev);
    $('wsPause').addEventListener('click', function () {
      A.paused = !A.paused;
      this.textContent = A.paused ? '继续' : '暂停';
      if (A.paused) { clearTimeout(A.timer); stopAudio(); }
      else { A.timer = setTimeout(showNext, 3000); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (!$('playMask').hidden) stopPlay();
        if (!$('showMask').hidden) closeShow();
        if (!$('artMask').hidden) { stopAudio(); $('artMask').hidden = true; }
      }
    });

    focusBox();
  }

  /* ================= 启动 ================= */

  bind();
  paintStage();
  load().then(function () {
    render();
    $('foot').textContent = S.mode === 'server'
      ? '词表存在 data/words-files（只进不出，不会被你误删）；单词存在 data/words.json。'
      : '本地服务没连上：先双击「启动.command」，再打开这一页。';
  });
})();
