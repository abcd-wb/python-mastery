/* 模块五 · 高分积累
   · 场景卡片（不同小图标 + 名字），点进去看这一个场景攒了什么
   · 添加：粘贴文字 / 拖文件或图片（自动识别成文字）/ 一句话指定场景
   · 自动分类：关键词规则 + 一句话指令；可选 AI 智能整理
   · 数据存服务端 data/ielts-collect.json，只存文字，不存原文件 */
(function () {
  'use strict';

  var API = '/api/collect';
  var S = { scenes: [], items: [], bytes: 0, view: 'grid', cur: '', q: '',
            preview: null, icon: '📁', lastSrc: '手动' };
  var ICONS = ['📁', '✍️', '🗣', '📚', '🎧', '💡', '🧩', '⭐', '🎯', '🏫',
               '✈️', '☕', '📊', '🌍', '🧠', '📝', '🔤', '📌', '🎬', '🍀'];
  var CMD_RE = /(?:加到|记到|放到|归入|存到|放进|添加到|归到|记入|收录到)\s*([^，,。；;：:\s]{1,12})/;
  var RULES = [
    { id: 'write',   re: /写作|Task\s*2|议论文|段落|句型|开头段|主体段|结论段|however|moreover|nevertheless|in conclusion/i },
    { id: 'speak',   re: /口语|Part\s*[123]|跟读|发音|对话|I would say|雅思口语/i },
    { id: 'read',    re: /阅读|长难句|定位|段落大意|Matching|True\s*False|雅思阅读/i },
    { id: 'listen',  re: /听力|同义替换|Section\s*\d|填空|地图题|雅思听力/i },
    { id: 'vocab',   re: /单词|词汇|词组|搭配|vocab|释义|背单词/i },
    { id: 'idea',    re: /观点|论据|素材|理由|论证|立场/i },
    { id: 'grammar', re: /语法|时态|主谓|从句|冠词|单复数|虚拟语气/i },
    { id: 'example', re: /例子|案例|举例|数据|研究表明|统计/i }
  ];

  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function toast(m) { if (window.PY && PY.toast) PY.toast(m); }
  function when(ts) {
    var d = new Date(ts || Date.now());
    return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }
  function kb(n) {
    if (!n) return '0 B';
    return n < 1024 ? n + ' B' : (n < 1048576 ? (n / 1024).toFixed(1) + ' KB' : (n / 1048576).toFixed(2) + ' MB');
  }
  function post(p, body) {
    return fetch(API + p, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {})
    }).then(function (r) { return r.json(); });
  }
  function pull() {
    return fetch(API + '/list', { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(apply);
  }
  function apply(j) {
    if (!j || !j.ok) return;
    S.scenes = j.scenes || []; S.items = j.items || []; S.bytes = j.bytes || 0;
    render();
  }

  /* ---------------- 场景 ---------------- */
  function sceneById(id) {
    for (var i = 0; i < S.scenes.length; i++) if (S.scenes[i].id === id) return S.scenes[i];
    return null;
  }
  function sceneByName(s) {
    s = String(s || '').trim();
    if (!s) return null;
    var i, x, name;
    for (i = 0; i < S.scenes.length; i++) {
      x = S.scenes[i];
      if (x.id === s || x.name === s) return x;
    }
    for (i = 0; i < S.scenes.length; i++) {
      x = S.scenes[i]; name = x.name || '';
      if (name && (s.indexOf(name) >= 0 || name.indexOf(s) >= 0)) return x;
    }
    return null;
  }
  function counts() {
    var c = {};
    S.items.forEach(function (x) { c[x.scene] = (c[x.scene] || 0) + 1; });
    return c;
  }
  function renderOptions() {
    var sel = $('addScene'), keep = sel.value || 'auto';
    sel.innerHTML = '<option value="auto">自动分类</option>' + S.scenes.map(function (sc) {
      return '<option value="' + esc(sc.id) + '">' + esc((sc.icon || '📁') + ' ' + sc.name) + '</option>';
    }).join('');
    sel.value = keep;
  }
  function renderGrid() {
    var c = counts();
    $('sceneGrid').innerHTML = S.scenes.map(function (sc) {
      return '<button class="sc-card" type="button" data-id="' + esc(sc.id) + '"' +
        ' style="--sc:' + esc(sc.color || '#475569') + '">' +
        '<span class="sc-ico">' + esc(sc.icon || '📁') + '</span>' +
        '<b>' + esc(sc.name) + '</b>' +
        '<span class="sc-n">' + (c[sc.id] || 0) + ' 条积累</span></button>';
    }).join('') +
      '<button class="sc-card sc-new" type="button" id="newSceneCard">' +
      '<span class="sc-ico">＋</span><b>新场景</b>' +
      '<span class="sc-n">自己起名字、选图标</span></button>';
  }
  function renderScene() {
    var sc = sceneById(S.cur);
    if (!sc) { S.view = 'grid'; return render(); }
    $('scTitle').textContent = (sc.icon || '📁') + ' ' + sc.name;
    var q = S.q.trim().toLowerCase();
    var list = S.items.filter(function (x) {
      return x.scene === S.cur && (!q || ((x.text || '') + ' ' + (x.title || '')).toLowerCase().indexOf(q) >= 0);
    });
    $('scCount').textContent = '共 ' + list.length + ' 条';
    $('delScene').hidden = sc.id === 'misc';
    $('itemList').innerHTML = list.map(function (x) {
      return '<li class="ci" data-id="' + esc(x.id) + '">' +
        '<div class="ci-top"><span class="ci-src">' + esc(x.src || '手动') + '</span>' +
        '<span class="ci-time">' + when(x.ts) + '</span>' +
        '<button class="ci-act" type="button" data-act="copy">复制</button>' +
        '<button class="ci-act del" type="button" data-act="del">删除</button></div>' +
        (x.title ? '<b class="ci-title">' + esc(x.title) + '</b>' : '') +
        '<pre class="ci-text">' + esc(x.text) + '</pre></li>';
    }).join('');
    $('scEmpty').hidden = list.length > 0;
  }
  function render() {
    $('cTotal').textContent = S.items.length;
    $('cScenes').textContent = S.scenes.length;
    $('cBytes').textContent = kb(S.bytes);
    renderOptions();
    $('gridView').hidden = S.view !== 'grid';
    $('sceneView').hidden = S.view !== 'scene';
    if (S.view === 'grid') renderGrid(); else renderScene();
  }
  function openScene(id) { S.view = 'scene'; S.cur = id; S.q = ''; $('scQuery').value = ''; render(); }

  /* ---------------- 分类 ---------------- */
  function guessScene(line, chosen) {
    if (chosen && chosen !== 'auto') {
      var sc = sceneByName(chosen);
      if (sc) return sc.id;
    }
    var m = line.match(CMD_RE);
    if (m) { var byCmd = sceneByName(m[1]); if (byCmd) return byCmd.id; }
    for (var i = 0; i < RULES.length; i++) if (RULES[i].re.test(line)) return RULES[i].id;
    return 'misc';
  }
  function splitLines(text) {
    var out = String(text || '').split(/\n+/).map(function (s) {
      return s.replace(/^\s*(?:[-•*·]|\d+[.、)]|[（(]\d+[)）])\s*/, '').trim();
    }).filter(function (s) { return s.length > 1; });
    if (out.length === 1 && out[0].length > 180) {
      out = out[0].split(/(?<=[。！？.!?])\s*/).filter(function (s) { return s.trim().length > 1; });
    }
    return out.slice(0, 200);
  }
  function cleanLine(t) {
    var s = t.replace(CMD_RE, '').trim();
    return s || t;
  }

  /* ---------------- 添加弹层 ---------------- */
  function appendText(t) {
    var ta = $('addText');
    ta.value = ta.value ? (ta.value.replace(/\s*$/, '') + '\n' + t) : t;
  }
  function extracted(j, label) {
    if (j && j.ok && j.text) {
      appendText(j.text);
      S.lastSrc = label;
      $('extractMsg').textContent = '已从 ' + label + ' 认出 ' + j.text.length + ' 字，已放到上面的文本框';
      toast('识别好了：' + j.text.length + ' 字');
    } else {
      $('extractMsg').textContent = (j && j.err) || '没认出文字';
      toast((j && j.err) || '没认出文字');
    }
  }
  function readFiles(files) {
    if (!files || !files.length) return;
    [].forEach.call(files, function (f) {
      var fr = new FileReader();
      fr.onload = function () {
        $('extractMsg').textContent = '正在识别 ' + f.name + ' …';
        post('/extract', { name: f.name || 'paste.bin', data: String(fr.result || '') })
          .then(function (j) { extracted(j, f.name || '文件'); })
          .catch(function () { $('extractMsg').textContent = '连不上本地服务，识别失败'; });
      };
      fr.onerror = function () { $('extractMsg').textContent = '这个文件读不出来'; };
      fr.readAsDataURL(f);
    });
  }
  function handlePaste(dt) {
    if (!dt) return false;
    var fs = dt.files;
    if (fs && fs.length) { readFiles(fs); return true; }
    var html = dt.getData('text/html') || '';
    var m = html.match(/<img[^>]+src="(data:image\/[^"]+)"/i);
    if (m) {
      $('extractMsg').textContent = '正在识别粘贴的图片…';
      post('/extract', { name: '粘贴图片.png', data: m[1] })
        .then(function (j) { extracted(j, '粘贴图片'); })
        .catch(function () { $('extractMsg').textContent = '连不上本地服务'; });
      return true;
    }
    var txt = dt.getData('text/plain') || '';
    if (txt.trim()) { appendText(txt.trim()); toast('已粘进文本框'); return true; }
    return false;
  }
  function openAdd() {
    S.preview = null; S.lastSrc = '手动';
    $('addText').value = ''; $('oneLine').value = '';
    $('extractMsg').textContent = '还没收到文件';
    $('smartMsg').textContent = '大段文字可以交给 AI 拆条 + 分场景；没配 AI 也会按本地规则整理';
    $('addScene').value = 'auto';
    $('addFoot').textContent = '确认后自动分类进场景';
    $('addMask').classList.add('on');
    setTimeout(function () { try { $('oneLine').focus(); } catch (e) { } }, 60);
  }
  function closeAdd() { $('addMask').classList.remove('on'); }

  function parseOne(s) {
    s = String(s || '').trim();
    if (!s) return null;
    var scene = null, m = s.match(CMD_RE);
    if (m) { var sc = sceneByName(m[1]); scene = sc ? sc.id : m[1]; }
    var text = s.replace(/^(?:请|帮我|麻烦)?(?:把|将)\s*/, '')
      .replace(CMD_RE, '')
      .replace(/^[「『"']|[」』"']$/g, '')
      .replace(/^[\s，,：:、]+/, '').trim();
    return { text: text || s, scene: scene };
  }
  function oneGo() {
    var o = parseOne($('oneLine').value);
    if (!o) { toast('先写一句话'); return; }
    var known = sceneByName(o.scene);
    var target = known ? known.id : (o.scene || '');
    var body = { items: [{ text: o.text, scene: target, title: '一句话添加', src: '一句话' }] };
    if (!known && o.scene) body.scene_name = o.scene;
    post('/add', body).then(function (j) {
      if (!j || !j.ok) { toast('没存上，检查本地服务'); return; }
      apply(j); closeAdd();
      var sc = sceneByName(target) || sceneByName(o.scene);
      toast('已按这句话加到「' + (sc ? sc.name : '未分类') + '」');
    }).catch(function () { toast('连不上本地服务'); });
  }
  function addOk() {
    var items;
    if (S.preview && S.preview.length) {
      items = S.preview.map(function (o) {
        var sc = sceneByName(o.scene);
        return { text: o.text, scene: sc ? sc.id : 'misc', title: 'AI 整理', src: 'AI 整理' };
      });
    } else {
      var chosen = $('addScene').value;
      items = splitLines($('addText').value).map(function (t) {
        return { text: cleanLine(t), scene: guessScene(t, chosen), title: '', src: S.lastSrc };
      });
    }
    if (!items.length) { toast('先粘点内容、放个文件，或写一句话'); return; }
    var used = {}; items.forEach(function (x) { used[x.scene] = 1; });
    post('/add', { items: items }).then(function (j) {
      if (!j || !j.ok) { toast('没存上，检查本地服务'); return; }
      apply(j); closeAdd();
      toast('已添加 ' + (j.added || 0) + ' 条，分到 ' + Object.keys(used).length + ' 个场景' +
        (j.dup ? '（' + j.dup + ' 条重复的跳过）' : ''));
    }).catch(function () { toast('连不上本地服务'); });
  }
  function smart() {
    var text = $('addText').value.trim();
    if (!text) { toast('先粘点文字再点智能整理'); return; }
    $('smartMsg').textContent = 'AI 正在整理…';
    post('/classify', { text: text }).then(function (j) {
      if (j && j.ok && j.items && j.items.length) {
        S.preview = j.items;
        var names = {}; j.items.forEach(function (o) { names[o.scene] = 1; });
        $('smartMsg').textContent = 'AI 拆成 ' + j.items.length + ' 条，涉及 ' +
          Object.keys(names).join('、') + '；点「添加到积累」即可';
      } else {
        S.preview = null;
        $('smartMsg').textContent = (j && j.err) || 'AI 没响应，会按本地规则自动分类';
      }
    }).catch(function () {
      S.preview = null;
      $('smartMsg').textContent = 'AI 接口没响应，会按本地规则自动分类';
    });
  }

  /* ---------------- 新场景 ---------------- */
  function renderIcons() {
    $('iconChips').innerHTML = ICONS.map(function (ic) {
      return '<button class="ico-chip' + (ic === S.icon ? ' on' : '') +
        '" type="button" data-i="' + esc(ic) + '">' + esc(ic) + '</button>';
    }).join('');
  }
  function openSceneMask() {
    $('scName').value = ''; S.icon = '📁'; renderIcons();
    $('sceneMask').classList.add('on');
    setTimeout(function () { try { $('scName').focus(); } catch (e) { } }, 60);
  }

  /* ---------------- 初始内容：内置 40 条高分句型 ---------------- */
  function seed() {
    if (S.items.length) return;
    try { if (localStorage.getItem('collect_seed_v1')) return; } catch (e) { }
    var P = window.IELTS_PHRASES;
    if (!P || !P.items || !P.items.length) return;
    var tn = {};
    (P.topics || []).forEach(function (t) { tn[t.id] = t.name; });
    var items = P.items.map(function (p) {
      return {
        text: p.en + (p.zh ? '\n' + p.zh : '') + (p.use ? '\n【用法】' + p.use : ''),
        scene: p.kind === 'speaking' ? 'speak' : 'write',
        title: (tn[p.topic] || '') + ' · ' + (p.kind === 'speaking' ? '口语' : '写作'),
        src: '内置高分句型'
      };
    });
    try { localStorage.setItem('collect_seed_v1', '1'); } catch (e) { }
    post('/add', { items: items }).then(apply);
  }

  /* ---------------- 事件 ---------------- */
  function bind() {
    $('addBtn').addEventListener('click', openAdd);
    $('newBtn').addEventListener('click', openSceneMask);
    $('addCancel').addEventListener('click', closeAdd);
    $('addMask').addEventListener('click', function (e) { if (e.target === this) closeAdd(); });
    $('addOk').addEventListener('click', addOk);
    $('oneGo').addEventListener('click', oneGo);
    $('oneLine').addEventListener('keydown', function (e) { if (e.key === 'Enter') oneGo(); });
    $('smartBtn').addEventListener('click', smart);

    $('pickFile').addEventListener('click', function () { $('fileInput').click(); });
    $('fileInput').addEventListener('change', function () { readFiles(this.files); this.value = ''; });
    $('dropSink').addEventListener('paste', function (e) {
      if (handlePaste(e.clipboardData || window.clipboardData)) e.preventDefault();
    });
    document.addEventListener('paste', function (e) {
      if (!$('addMask').classList.contains('on')) return;
      var t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
      if (handlePaste(e.clipboardData || window.clipboardData)) e.preventDefault();
    });
    ['dragenter', 'dragover'].forEach(function (ev) {
      $('dropBox').addEventListener(ev, function (e) { e.preventDefault(); this.classList.add('over'); });
    });
    $('dropBox').addEventListener('dragleave', function () { this.classList.remove('over'); });
    $('dropBox').addEventListener('drop', function (e) {
      e.preventDefault(); this.classList.remove('over');
      handlePaste(e.dataTransfer);
    });

    $('sceneGrid').addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('.sc-card') : null;
      if (!b) return;
      if (b.id === 'newSceneCard') { openSceneMask(); return; }
      openScene(b.getAttribute('data-id'));
    });
    $('backBtn').addEventListener('click', function () { S.view = 'grid'; render(); });
    $('scQuery').addEventListener('input', function () { S.q = this.value; renderScene(); });
    $('itemList').addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('.ci-act') : null;
      if (!b) return;
      var li = b.closest('.ci'), id = li.getAttribute('data-id');
      var hit = null;
      S.items.forEach(function (x) { if (x.id === id) hit = x; });
      if (!hit) return;
      if (b.getAttribute('data-act') === 'copy') {
        try {
          navigator.clipboard.writeText(hit.text).then(function () { toast('已复制这条'); })
            .catch(function () { toast('复制失败，可以直接选中文字'); });
        } catch (err) { toast('复制失败，可以直接选中文字'); }
        return;
      }
      post('/del', { id: id }).then(apply);
    });
    $('copyScene').addEventListener('click', function () {
      var txt = S.items.filter(function (x) { return x.scene === S.cur; })
        .map(function (x) { return x.text; }).join('\n\n');
      if (!txt) { toast('这个场景还没有内容'); return; }
      try {
        navigator.clipboard.writeText(txt).then(function () { toast('已复制这个场景的全部内容'); })
          .catch(function () { toast('复制失败'); });
      } catch (e) { toast('复制失败'); }
    });
    var clearArm = 0;
    $('clearScene').addEventListener('click', function () {
      if (Date.now() - clearArm > 5000) {
        clearArm = Date.now(); this.textContent = '再点一次清空';
        toast('清空这个场景：5 秒内再点一次确认');
        return;
      }
      clearArm = 0; this.textContent = '清空这个场景';
      post('/clear', { scene: S.cur }).then(function (j) { apply(j); toast('这个场景已清空'); });
    });
    var delArm = 0;
    $('delScene').addEventListener('click', function () {
      if (Date.now() - delArm > 5000) {
        delArm = Date.now(); this.textContent = '再点一次删除';
        toast('删除场景：里面的内容会移到「未分类」，不会丢');
        return;
      }
      delArm = 0; this.textContent = '删除场景';
      post('/scene-del', { id: S.cur }).then(function (j) {
        apply(j); S.view = 'grid'; render(); toast('场景已删，内容移到「未分类」');
      });
    });

    $('scCancel').addEventListener('click', function () { $('sceneMask').classList.remove('on'); });
    $('sceneMask').addEventListener('click', function (e) { if (e.target === this) this.classList.remove('on'); });
    $('iconChips').addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('.ico-chip') : null;
      if (!b) return;
      S.icon = b.getAttribute('data-i'); renderIcons();
    });
    $('scOk').addEventListener('click', function () {
      var name = $('scName').value.trim();
      if (!name) { toast('给场景起个名字'); return; }
      post('/scene', { name: name, icon: S.icon }).then(function (j) {
        if (!j || !j.ok) { toast('没建上，检查本地服务'); return; }
        apply(j); $('sceneMask').classList.remove('on');
        toast(j.exists ? '已经有同名场景了' : '已创建场景「' + name + '」');
      }).catch(function () { toast('连不上本地服务'); });
    });
  }

  bind();
  pull().then(seed);
})();
