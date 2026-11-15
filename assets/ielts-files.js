/* 模块二：上课资料 —— 一个框：点一下 → ⌘V / 右键粘贴 / 拖进来 → 添加到资料库 → 下面看文件 */
(function () {
  var API = '/api/files';
  var CATS = [
    { id: 'listening', name: '听力', color: '#2563eb', kw: ['listening', 'listen', '听力', 'audio', '音频', '录音', '听写', 'dictation'] },
    { id: 'reading', name: '阅读', color: '#0d9488', kw: ['reading', '阅读', 'passage', '精读', '文章'] },
    { id: 'writing', name: '写作', color: '#7c3aed', kw: ['writing', '写作', '作文', 'task1', 'task2', 'essay', '小作文', '大作文'] },
    { id: 'speaking', name: '口语', color: '#ea580c', kw: ['speaking', 'speak', '口语', 'part1', 'part2', 'part3', 'cue', '卡片题'] },
    { id: 'vocab', name: '词汇', color: '#b45309', kw: ['vocab', '词汇', '单词', 'wordlist', 'word list', '同义替换', 'lexical'] },
    { id: 'other', name: '其他', color: '#64748b', kw: [] }
  ];
  var AUDIO = /^(mp3|m4a|wav|aac|flac|ogg|opus)$/;
  var REAL = /(cambridge|cam\s?\d{1,2}|剑\s?\d{1,2}|真题|past.?paper|test\s?\d{1,2})/i;

  var mode = 'idb';          // server | idb | mem
  var serverDir = 'data/ielts-files';
  var persisted = false;
  var items = [], staged = [], urls = {};

  /* ---------------- 存储 ---------------- */
  var DBN = 'ielts_files', STORE = 'files', dbInst = null, memMode = false, mem = [];
  var idbP = null;
  function idbReady() {
    if (idbP) return idbP;
    idbP = new Promise(function (res) {
      var done = false;
      function finish() { if (!done) { done = true; res(); } }
      var timer = setTimeout(function () { memMode = true; finish(); }, 2000);
      try {
        var r = indexedDB.open(DBN, 1);
        r.onupgradeneeded = function () {
          var d = r.result;
          if (!d.objectStoreNames.contains(STORE)) d.createObjectStore(STORE, { keyPath: 'id' });
        };
        r.onsuccess = function () { dbInst = r.result; clearTimeout(timer); finish(); };
        r.onerror = function () { memMode = true; clearTimeout(timer); finish(); };
        r.onblocked = function () { memMode = true; clearTimeout(timer); finish(); };
      } catch (e) { memMode = true; clearTimeout(timer); finish(); }
    });
    return idbP;
  }
  function idbPut(rec) {
    return idbReady().then(function () {
      if (memMode || !dbInst) {
        var i = mem.findIndex(function (x) { return x.id === rec.id; });
        if (i >= 0) mem[i] = rec; else mem.push(rec);
        return rec;
      }
      return new Promise(function (res, rej) {
        var q2 = dbInst.transaction(STORE, 'readwrite').objectStore(STORE).put(rec);
        q2.onsuccess = function () { res(rec); };
        q2.onerror = function () { rej(q2.error); };
      });
    });
  }
  function idbAll() {
    return idbReady().then(function () {
      if (memMode || !dbInst) return mem.slice();
      return new Promise(function (res, rej) {
        var q2 = dbInst.transaction(STORE, 'readonly').objectStore(STORE).getAll();
        q2.onsuccess = function () { res(q2.result || []); };
        q2.onerror = function () { rej(q2.error); };
      });
    });
  }
  function idbDel(id) {
    return idbReady().then(function () {
      if (memMode || !dbInst) { mem = mem.filter(function (x) { return x.id !== id; }); return; }
      return new Promise(function (res) {
        var q2 = dbInst.transaction(STORE, 'readwrite').objectStore(STORE).delete(id);
        q2.onsuccess = res; q2.onerror = res;
      });
    });
  }
  function idbClear() {
    return idbReady().then(function () {
      if (memMode || !dbInst) { mem = []; return; }
      return new Promise(function (res) {
        var q2 = dbInst.transaction(STORE, 'readwrite').objectStore(STORE).clear();
        q2.onsuccess = res; q2.onerror = res;
      });
    });
  }

  function detect() {
    return fetch(API + '/ping', { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error('no api');
      return r.json();
    }).then(function (j) {
      if (!j || !j.ok) throw new Error('no api');
      mode = 'server';
      serverDir = j.dir || serverDir;
    }).catch(function () {
      return idbReady().then(function () {
        mode = memMode ? 'mem' : 'idb';
        if (mode === 'idb' && navigator.storage && navigator.storage.persisted) {
          return navigator.storage.persisted().then(function (p) { persisted = !!p; });
        }
      });
    });
  }

  function save(file, catName) {
    var cat = catName || classify(file.name), ts = Date.now();
    if (mode === 'server') {
      return fetch(API + '/upload', {
        method: 'POST',
        headers: {
          'X-Filename': encodeURIComponent(file.name),
          'X-Cat': cat,
          'X-Type': file.type || '',
          'X-Ts': String(ts)
        },
        body: file
      }).then(function (r) {
        return r.text().then(function (t) {
          var j = null;
          try { j = JSON.parse(t); } catch (e) { }
          if (!r.ok || !j || !j.ok) throw new Error((j && j.err) || ('保存失败 HTTP ' + r.status));
          return j.item;
        });
      });
    }
    return idbPut({
      id: 'f' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: file.name, size: file.size, type: file.type || '',
      cat: cat, ts: ts, blob: file, store: mode
    });
  }

  /* 从本机路径导入（访达里复制的文件走这条：浏览器读不到内容，让本地服务去读盘） */
  function importPaths(list) {
    if (mode !== 'server') {
      return Promise.reject(new Error('要从本机读文件，得用「启动.command」打开这一页'));
    }
    var rows = list.map(function (x) { return { path: x.p, name: x.name, cat: classify(x.name) }; });
    return fetch(API + '/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: rows })
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (!j || !j.ok) {
        var why = (j && j.bad && j.bad[0] && j.bad[0].err) || '读不到这个文件';
        throw new Error(why);
      }
      return j.items || [];
    });
  }

  function listAll() {
    if (mode === 'server') {
      return fetch(API + '/list', { cache: 'no-store' })
        .then(function (r) { return r.json(); })
        .then(function (j) { return (j && j.items) || []; });
    }
    return idbAll();
  }
  function removeOne(id) {
    if (mode === 'server') return fetch(API + '/delete', { method: 'POST', body: JSON.stringify({ id: id }) });
    return idbDel(id);
  }
  function listTrash() {
    if (mode !== 'server') return Promise.resolve([]);
    return fetch(API + '/trash', { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (j) { return (j && j.items) || []; })
      .catch(function () { return []; });
  }
  function restoreOne(id) {
    if (mode !== 'server') return Promise.resolve();
    return fetch(API + '/restore', { method: 'POST', body: JSON.stringify({ id: id }) });
  }
  function purgeOne(id) {
    if (mode !== 'server') return Promise.resolve();
    return fetch(API + '/purge', { method: 'POST', body: JSON.stringify({ id: id }) });
  }

  function removeAll() {
    if (mode === 'server') return fetch(API + '/clear', { method: 'POST', body: '{}' });
    return idbClear();
  }

  /* ---------------- 小工具 ---------------- */
  function $(id) { return document.getElementById(id); }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function stamp() {
    var d = new Date();
    return '' + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + '-' + pad(d.getHours()) + pad(d.getMinutes());
  }
  function bytes(n) {
    n = n || 0;
    if (n < 1024) return n + ' B';
    if (n < 1048576) return (n / 1024).toFixed(0) + ' KB';
    if (n < 1073741824) return (n / 1048576).toFixed(1) + ' MB';
    return (n / 1073741824).toFixed(2) + ' GB';
  }
  function catOf(id) {
    for (var i = 0; i < CATS.length; i++) if (CATS[i].id === id) return CATS[i];
    return CATS[CATS.length - 1];
  }
  function classify(name) {
    var n = String(name).toLowerCase();
    for (var i = 0; i < CATS.length - 1; i++) {
      var kw = CATS[i].kw;
      for (var k = 0; k < kw.length; k++) if (n.indexOf(kw[k]) >= 0) return CATS[i].id;
    }
    var ext = (n.split('.').pop() || '');
    if (AUDIO.test(ext)) return 'listening';
    return 'other';
  }
  function extOf(name) {
    var m = String(name).match(/\.([a-z0-9]{1,5})$/i);
    return m ? m[1].toLowerCase() : 'file';
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function dlOf(it) {
    if (mode === 'server') return API + '/raw?id=' + encodeURIComponent(it.id);
    if (urls[it.id]) return urls[it.id];
    if (!it.blob) return '';
    urls[it.id] = URL.createObjectURL(it.blob);
    return urls[it.id];
  }
  function baseName(p) {
    var s = String(p).replace(/[?#].*$/, '').replace(/\/+$/, '');
    var m = s.match(/([^\/]+)$/);
    return m ? decodeURIComponent(m[1]) : 'file';
  }

  var trashItems = [], trashOpen = false;

  function renderTrash() {
    var btn = $('trashBtn'), box = $('trashList');
    btn.hidden = !trashItems.length;
    btn.textContent = '回收站 ' + trashItems.length;
    if (!trashOpen || !trashItems.length) {
      box.hidden = true;
      box.innerHTML = '';
      return;
    }
    box.hidden = false;
    box.innerHTML = trashItems.map(function (x) {
      var c = catOf(x.cat), d = new Date(x.dts || x.ts);
      return '<li class="fitem gone" data-id="' + x.id + '">' +
        '<span class="fic">' + extOf(x.name).slice(0, 3) + '</span>' +
        '<span class="fmeta"><span class="fn" title="' + esc(x.name) + '">' + esc(x.name) + '</span>' +
        '<span class="fs">' + bytes(x.size) + ' · 删于 ' + (d.getMonth() + 1) + '/' + d.getDate() +
        ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + '</span></span>' +
        '<span class="ltag" style="background:' + c.color + '14;color:' + c.color + '">' + c.name + '</span>' +
        '<span class="fact"><button data-act="rs">恢复</button>' +
        '<button data-act="purge">彻底删</button></span></li>';
    }).join('');
  }

  function loadTrash() {
    return listTrash().then(function (list) {
      trashItems = list || [];
      renderTrash();
    });
  }

  /* ---------------- 资料库列表 ---------------- */
  function render() {
    var list = items.slice().sort(function (a, b) { return b.ts - a.ts; });
    var total = 0;
    items.forEach(function (x) { total += x.size || 0; });

    $('libEmpty').style.display = list.length ? 'none' : '';
    $('clearAll').hidden = !list.length;
    $('libCnt').textContent = list.length ? ('· ' + list.length + ' 个 · ' + bytes(total)) : '';

    $('lib').innerHTML = list.map(function (x) {
      var c = catOf(x.cat), d = new Date(x.ts), url = dlOf(x);
      return '<li class="fitem" data-id="' + x.id + '">' +
        '<span class="fic">' + extOf(x.name).slice(0, 3) + '</span>' +
        '<span class="fmeta"><span class="fn" title="' + esc(x.name) + '">' + esc(x.name) + '</span>' +
        '<span class="fs">' + bytes(x.size) + ' · ' + (d.getMonth() + 1) + '/' + d.getDate() +
        (REAL.test(x.name) ? ' · 真题' : '') + '</span></span>' +
        '<span class="ltag" style="background:' + c.color + '14;color:' + c.color + '">' + c.name + '</span>' +
        '<span class="fact">' + (url ? '<a href="' + url + '" download="' + esc(x.name) + '">下载</a>' : '') +
        '<button data-act="rm">删除</button></span></li>';
    }).join('');
  }

  function paintFoot() {
    var f = $('libFoot'), t;
    if (mode === 'server') t = '文件存在本机 ' + serverDir + ' 文件夹，重启也在；删掉的会留在回收站，能恢复。';
    else if (mode === 'idb' && persisted) t = '文件存在这台电脑的浏览器里，不会自动清理。';
    else if (mode === 'idb') t = '文件存在浏览器里；想更稳就双击项目里的「启动.command」再打开这一页。';
    else t = '这个浏览器存不了文件（无痕模式？），请用「启动.command」打开这一页。';
    f.textContent = t;
  }

  /* ---------------- 框里的暂存 ---------------- */
  function stageName(it) { return it.k === 'f' ? it.f.name : it.name; }
  function stageSize(it) {
    if (it.k === 'f') return it.f.size;
    if (it.k === 't') return new Blob([it.text]).size;
    return null;
  }

  function paintStage() {
    var n = staged.length;
    $('boxPh').style.display = n ? 'none' : '';
    $('stageList').innerHTML = staged.map(function (it, i) {
      var name = stageName(it), sz = stageSize(it), c = catOf(it.cat || classify(name));
      return '<li class="stag" data-i="' + i + '" contenteditable="false">' +
        '<span class="fic">' + extOf(name).slice(0, 3) + '</span>' +
        '<span class="fmeta"><span class="fn" title="' + esc(name) + '">' + esc(name) + '</span>' +
        '<span class="fs">' + (sz == null ? '待读取' : bytes(sz)) +
        (it.k === 'p' ? ' · 本机文件' : (it.k === 't' ? ' · 文字' : '')) + '</span></span>' +
        '<span class="stag-cat" style="background:' + c.color + '1a;color:' + c.color + '">' + c.name + '</span>' +
        '<button class="odel" data-i="' + i + '" title="移出" contenteditable="false">×</button></li>';
    }).join('');
    $('addAll').disabled = !n;
    $('stageClear').hidden = !n;
    $('addAll').textContent = n ? ('添加到资料库（' + n + ' 个）') : '添加到资料库';
    if (!n) $('stageNote').textContent = '';
  }

  var noteTimer = null;
  function note(t) {
    $('stageNote').textContent = t || '';
    if (noteTimer) clearTimeout(noteTimer);
    if (t && /^已存入|没存上|失败|读不到/.test(t)) {
      noteTimer = setTimeout(function () { $('stageNote').textContent = ''; }, 5000);
    }
  }

  function focusBox() {
    var sink = $('sink');
    if (!sink) return;
    try {
      sink.focus({ preventScroll: true });
      sink.setSelectionRange(0, 0);
    } catch (e) { }
  }

  function pushFiles(fileList) {
    var arr = Array.prototype.slice.call(fileList || []);
    if (!arr.length) return 0;
    arr.forEach(function (f) {
      var isImg = /^image\//.test(f.type || '');
      var noExt = !/\.[a-z0-9]{1,5}$/i.test(f.name || '');
      if (isImg && noExt) f = new File([f], '截图-' + stamp() + '.png', { type: f.type || 'image/png' });
      staged.push({ k: 'f', f: f });
    });
    paintStage();
    flash();
    note('抓到 ' + staged.length + ' 个，点「添加到资料库」');
    focusBox();
    return arr.length;
  }

  function pushPaths(paths) {
    if (!paths.length) return 0;
    paths.forEach(function (p) {
      staged.push({ k: 'p', p: p, name: baseName(p) });
    });
    paintStage();
    flash();
    note('抓到 ' + staged.length + ' 个，点「添加到资料库」');
    focusBox();
    return paths.length;
  }

  function textName(body) {
    var line = '';
    var rows = String(body).split(/\r?\n/);
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].trim()) { line = rows[i].trim(); break; }
    }
    line = line.replace(/[\\/:*?"<>|]/g, ' ').replace(/\s+/g, ' ').slice(0, 14).trim()
               .replace(/[：:，,。.·\-\s]+$/, '');
    return (line || ('微信粘贴-' + stamp())) + '.txt';
  }

  function pushText(txt) {
    var body = String(txt || '');
    if (!body.trim()) return 0;
    staged.push({ k: 't', text: body, cat: classify(body), name: textName(body) });
    paintStage();
    flash();
    note('收到 ' + body.length + ' 个字，点「添加到资料库」存成 txt');
    focusBox();
    return 1;
  }

  function addStaged() {
    if (!staged.length) return;
    var todo = staged.slice(), n = 0, fail = 0, i = 0, why = '';
    staged = [];
    paintStage();
    note('正在保存 0/' + todo.length + '…');
    var chain = Promise.resolve();
    todo.forEach(function (it) {
      chain = chain.then(function () {
        var job;
        if (it.k === 'p') job = importPaths([it]);
        else if (it.k === 't') job = save(new File([it.text], it.name, { type: 'text/plain' }), it.cat || classify(it.text));
        else job = save(it.f);
        return job.then(function () { n++; }).catch(function (e) {
          fail++;
          if (!why) why = (e && e.message) || '';
        }).then(function () {
          i++;
          note('正在保存 ' + i + '/' + todo.length + '…');
        });
      });
    });
    chain.then(function () {
      note(fail ? ('存好 ' + n + ' 个，' + fail + ' 个没存上' + (why ? '：' + why : '')) : ('已存入 ' + n + ' 个'));
      return refresh();
    }).catch(function (e) {
      note('保存失败：' + (e && e.message ? e.message : '未知原因'));
      paintStage();
    });
  }

  /* ---------- 剪贴板解析 ---------- */
  function filesFrom(dt) {
    var out = [], i;
    if (!dt) return out;
    if (dt.files && dt.files.length) {
      for (i = 0; i < dt.files.length; i++) out.push(dt.files[i]);
    }
    if (!out.length && dt.items) {
      for (i = 0; i < dt.items.length; i++) {
        if (dt.items[i].kind === 'file') {
          var f = dt.items[i].getAsFile();
          if (f) out.push(f);
        }
      }
    }
    return out;
  }

  function htmlImage(dt) {
    var h = '';
    try { h = dt.getData('text/html') || ''; } catch (e) { return null; }
    var m = h.match(/<img[^>]+src=["']([^"']+)["']/i);
    return m ? m[1] : null;
  }

  function plainText(dt) {
    var s = '';
    try { s = dt.getData('text/plain') || ''; } catch (e) { }
    if (!s) { try { s = dt.getData('text/uri-list') || ''; } catch (e) { } }
    return String(s || '');
  }

  /* 访达复制文件 → 剪贴板里是 file:///Users/…/a.pdf（可能多行） */
  function pathsFrom(txt) {
    var lines = String(txt || '').split(/[\r\n]+/), out = [];
    lines.forEach(function (l) {
      var s = l.trim().replace(/^["'<]|["'>]$/g, '');
      if (!s || s.charAt(0) === '#') return;
      if (/^file:\/\//i.test(s)) { out.push(s); return; }
      if (/^\/.+/.test(s) || /^~\/.+/.test(s)) {
        if (/\s(?:·|—)/.test(s)) return;      /* 明显不是路径 */
        out.push(s);
      }
    });
    return out;
  }

  function dataUrlToFile(url) {
    var m = url.match(/^data:([^;,]+)?(;base64)?,([\s\S]*)$/);
    if (!m) return null;
    var bin = m[2] ? atob(m[3]) : decodeURIComponent(m[3]);
    var u8 = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    var ext = (m[1] || 'image/png').split('/')[1] || 'png';
    return new File([u8], '截图-' + stamp() + '.' + ext, { type: m[1] || 'image/png' });
  }

  function grabUrl(url) {
    note('正在抓取图片…');
    fetch(url, { mode: 'cors' }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.blob();
    }).then(function (b) {
      var ext = (b.type || 'image/png').split('/')[1] || 'png';
      return new File([b], '截图-' + stamp() + '.' + ext, { type: b.type || 'image/png' });
    }).then(function (f) {
      pushFiles([f]);
    }).catch(function () {
      note('这张图抓不下来（跨域），先另存到电脑再拖进来。');
    });
  }

  function handleClipboard(dt) {
    if (!dt) return false;
    var fs = filesFrom(dt);
    if (fs.length) { pushFiles(fs); return true; }

    var img = htmlImage(dt);
    if (img && /^data:/.test(img)) {
      var f = dataUrlToFile(img);
      if (f) { pushFiles([f]); return true; }
    }
    if (img) { grabUrl(img); return true; }

    var txt = plainText(dt);
    var paths = pathsFrom(txt);
    if (paths.length) { pushPaths(paths); return true; }

    /* 群里复制的文字：直接存成一个 txt，别再“只提示不干活” */
    if (txt && txt.trim()) {
      pushText(txt);
      return true;
    }

    var types = '';
    try { types = Array.prototype.slice.call(dt.types || []).join(' / '); } catch (e) { }
    note('这次没读到内容（剪贴板类型：' + (types || '空') + '）。微信里的文件请右键「另存为」，再点「选文件」。');
    return false;
  }

  /* 主动读剪贴板（按钮兜底）：先试带图片的 read()，不行退到 readText() */
  function readClipboard() {
    var clip = navigator.clipboard;
    if (!clip) {
      note('这个浏览器不支持读剪贴板，点框后按 ⌘V。');
      return;
    }
    note('正在读剪贴板…');

    function fallbackText() {
      if (!clip.readText) {
        note('读不到剪贴板。点框后按 ⌘V 最稳。');
        return;
      }
      clip.readText().then(function (t) {
        if (t && t.trim()) pushText(t);
        else note('剪贴板是空的。');
      }).catch(function (e) {
        var n = (e && e.name) || '';
        if (n === 'NotAllowedError') {
          note('浏览器禁了读剪贴板：地址栏左边 ⓘ →「网站设置」→ 剪贴板 → 允许；或直接在框里按 ⌘V。');
        } else {
          note('读剪贴板失败（' + n + '）。直接在框里按 ⌘V 也行。');
        }
      });
    }

    if (!clip.read) { fallbackText(); return; }

    clip.read().then(function (list) {
      var jobs = [], i, k;
      for (i = 0; i < list.length; i++) {
        var it = list[i], types = it.types || [];
        for (k = 0; k < types.length; k++) {
          if (/^image\//.test(types[k])) {
            (function (ty, item) {
              jobs.push(item.getType(ty).then(function (b) {
                var ext = ty.split('/')[1] || 'png';
                return new File([b], '截图-' + stamp() + '.' + ext, { type: ty });
              }));
            })(types[k], it);
            break;
          }
        }
      }
      if (!jobs.length) { fallbackText(); return; }
      return Promise.all(jobs).then(function (arr) {
        var ok = arr.filter(function (x) { return x && x.size != null; });
        if (ok.length) pushFiles(ok); else fallbackText();
      });
    }).catch(fallbackText);
  }

  /* ---------------- 数据 ---------------- */
  function refresh() {
    return listAll().then(function (list) {
      items = list || [];
      render();
      return loadTrash();
    }).catch(function () { render(); });
  }

  function flash() {
    var b = $('box');
    b.classList.add('hit');
    setTimeout(function () { b.classList.remove('hit'); }, 480);
  }

  /* ---------------- 事件 ---------------- */
  function bind() {
    var box = $('box'), pick = $('pick'), sink = $('sink');

    /* 点框任意位置 = 聚焦到那个透明输入框（右键菜单里的「粘贴」才会亮） */
    box.addEventListener('mousedown', function (e) {
      if (e.target.closest('button') || e.target.closest('a')) return;
      focusBox();
    });
    box.addEventListener('click', function (e) {
      if (e.target.closest('button') || e.target.closest('a')) return;
      focusBox();
    });
    box.addEventListener('contextmenu', function (e) {
      if (e.target.closest('button')) return;
      focusBox();
    });

    /* 输入框只收粘贴，敲出来的字随手清掉 */
    sink.addEventListener('input', function () { sink.value = ''; });
    sink.addEventListener('keydown', function (e) {
      if (e.key === 'Backspace' || e.key === 'Delete') {
        if (staged.length) { staged.pop(); paintStage(); }
        e.preventDefault();
        return;
      }
      if (e.key === 'Tab') return;
      var mod = e.metaKey || e.ctrlKey;
      if (!mod) e.preventDefault();
    });

    /* 粘贴：输入框上收，页面兜底再收一次 */
    sink.addEventListener('paste', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var dt = e.clipboardData || window.clipboardData;
      handleClipboard(dt);
      setTimeout(function () { sink.value = ''; }, 0);
    });
    document.addEventListener('paste', function (e) {
      if (e.defaultPrevented) return;
      var dt = e.clipboardData || window.clipboardData;
      if (!dt) return;
      if (handleClipboard(dt)) e.preventDefault();
    });

    /* 拖拽 */
    ['dragenter', 'dragover'].forEach(function (ev) {
      box.addEventListener(ev, function (e) { e.preventDefault(); box.classList.add('over'); });
    });
    ['dragleave', 'drop'].forEach(function (ev) {
      box.addEventListener(ev, function (e) { e.preventDefault(); box.classList.remove('over'); });
    });
    box.addEventListener('drop', function (e) {
      e.stopPropagation();
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
        pushFiles(e.dataTransfer.files);
        return;
      }
      handleClipboard(e.dataTransfer);
    });
    document.addEventListener('dragover', function (e) { e.preventDefault(); });
    document.addEventListener('drop', function (e) { e.preventDefault(); });

    $('pickBtn').addEventListener('click', function (e) { e.stopPropagation(); pick.click(); });
    pick.addEventListener('change', function () {
      pushFiles(this.files);
      this.value = '';
    });
    $('readClip').addEventListener('click', function (e) { e.stopPropagation(); readClipboard(); });

    $('addAll').addEventListener('click', function (e) { e.stopPropagation(); addStaged(); });
    $('stageClear').addEventListener('click', function (e) {
      e.stopPropagation();
      staged = []; paintStage(); note('');
    });
    $('stageList').addEventListener('click', function (e) {
      var b = e.target.closest('.odel');
      if (!b) return;
      e.stopPropagation();
      staged.splice(parseInt(b.getAttribute('data-i'), 10), 1);
      paintStage();
    });

    /* 删除不再弹确认 */
    $('clearAll').addEventListener('click', function () {
      removeAll().then(function () {
        items = [];
        render();
        note('已移到回收站，能恢复');
        return loadTrash();
      });
    });

    $('trashBtn').addEventListener('click', function (e) {
      e.stopPropagation();
      trashOpen = !trashOpen;
      renderTrash();
    });

    $('trashList').addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var id = b.closest('.fitem').getAttribute('data-id');
      if (b.getAttribute('data-act') === 'rs') {
        restoreOne(id).then(function () { return loadTrash(); }).then(refresh);
      } else {
        purgeOne(id).then(function () { return loadTrash(); });
      }
    });

    $('lib').addEventListener('click', function (e) {
      var a = e.target.closest('[data-act="rm"]');
      if (!a) return;
      var id = a.closest('.fitem').getAttribute('data-id');
      removeOne(id).then(function () {
        items = items.filter(function (x) { return x.id !== id; });
        if (urls[id]) { URL.revokeObjectURL(urls[id]); delete urls[id]; }
        render();
        return loadTrash();
      });
    });

    focusBox();
  }

  bind();
  paintStage();
  detect().then(function () {
    paintFoot();
    return refresh();
  });
})();
