/* 做题记录：贴一张成绩截图 → 本机识别 → 自动归档到听说读写 */
(function () {
  'use strict';

  var S = { items: [], sec: '听力', draft: null, busy: false };
  var SECS = ['听力', '阅读', '写作', '口语'];

  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function when(ts) {
    var d = new Date(ts || Date.now());
    return (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }
  function note(t, ms) {
    $('note').textContent = t || '';
    clearTimeout(note._t);
    if (ms !== 0) note._t = setTimeout(function () {
      $('note').textContent = '识别在本机做，不联网、不上传别处';
    }, ms || 6000);
  }

  /* ---------------- 数据 ---------------- */

  function pull() {
    return fetch('/api/records/list', { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (j) { S.items = (j && j.items) || []; })
      .catch(function () { S.items = []; });
  }

  function render() {
    var counts = {};
    SECS.forEach(function (s) { counts[s] = 0; });
    S.items.forEach(function (x) { if (counts[x.sec] != null) counts[x.sec]++; });

    [].forEach.call($('tabs').querySelectorAll('.rtab'), function (b) {
      var s = b.getAttribute('data-s');
      b.classList.toggle('on', s === S.sec);
      b.querySelector('i').textContent = counts[s] || 0;
    });

    var list = S.items.filter(function (x) { return x.sec === S.sec; });
    $('listTitle').textContent = S.sec;
    $('listCnt').textContent = list.length ? '共 ' + list.length + ' 次' : '';
    $('empty').hidden = list.length > 0;

    $('list').innerHTML = list.map(function (x) {
      var bits = [];
      if (x.band) bits.push('<span class="rb">' + esc(x.band) + ' 分</span>');
      if (x.right && x.total) bits.push('<span class="rr">答对 ' + esc(x.right) + '/' + esc(x.total) + '</span>');
      if (!x.right && x.pct) bits.push('<span class="rr">正确率 ' + esc(x.pct) + '%</span>');
      var wrong = (x.wrong || []).map(function (n) { return '<i>' + n + '</i>'; }).join('');
      return '<li class="ritem" data-id="' + esc(x.id) + '">' +
        '<div class="rhd">' +
        '<span class="rwhen">' + when(x.ts) + '</span>' +
        (bits.length ? '<span class="rmeta">' + bits.join('') + '</span>' : '') +
        '<span class="racts"><button data-act="more">原文</button><button data-act="del">删</button></span>' +
        '</div>' +
        (x.title ? '<p class="rtitle">' + esc(x.title) + '</p>' : '') +
        (wrong ? '<p class="rwrong">错题 ' + wrong + '</p>' : '') +
        '<pre class="rtext" hidden>' + esc(x.text || '') + '</pre>' +
        '</li>';
    }).join('');
  }

  function refresh() {
    return pull().then(render);
  }

  /* ---------------- 识别 ---------------- */

  function readImage(file) {
    if (!file || !/^image\//.test(file.type || '')) {
      note('这不是图片 —— 截图后再粘', 6000);
      return;
    }
    if (S.busy) return;
    S.busy = true;
    note('正在认字…', 0);
    $('boxPh').style.display = 'none';
    $('stageList').innerHTML = '<li class="stag"><span class="sic">IMG</span>' +
      '<span class="sname">' + esc(file.name || '剪贴板截图') + '</span>' +
      '<span class="ssz">识别中…</span></li>';

    fetch('/api/ocr', { method: 'POST', body: file })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        S.busy = false;
        $('stageList').innerHTML = '';
        $('boxPh').style.display = '';
        if (!j || !j.ok) { note((j && j.err) || '没认出来，换一张清楚点的', 7000); return; }
        S.draft = { text: j.text, guess: j.guess || {} };
        paintDraft();
        note('认出来了，确认一下再存', 8000);
      })
      .catch(function () {
        S.busy = false;
        $('stageList').innerHTML = '';
        $('boxPh').style.display = '';
        note('本地服务没响应 —— 用「启动.command」打开这一页', 9000);
      });
  }

  function paintDraft() {
    var g = S.draft.guess, box = $('draft');
    var sec = g.sec || S.sec;
    box.hidden = false;
    box.innerHTML =
      '<div class="dhd"><b>识别结果</b><span>' + esc(g.title || '') + '</span></div>' +
      '<div class="drow"><label>科目</label><span class="dsec">' +
      SECS.map(function (s) {
        return '<button class="dchip' + (s === sec ? ' on' : '') + '" data-s="' + s + '">' + s + '</button>';
      }).join('') + '</span></div>' +
      '<div class="drow"><label>分数</label><input id="dBand" value="' + esc(g.band || '') + '" placeholder="如 6.5">' +
      '<label>答对</label><input id="dRight" value="' + esc(g.right || '') + '" placeholder="27">' +
      '<span class="dslash">/</span><input id="dTotal" value="' + esc(g.total || '') + '" placeholder="40">' +
      (g.pct ? '<span class="dpct">正确率 ' + esc(g.pct) + '%</span>' : '') + '</div>' +
      (g.wrong && g.wrong.length
        ? '<div class="drow"><label>错题</label><span class="dwrong">' +
          g.wrong.map(function (n) { return '<i>' + n + '</i>'; }).join('') + '</span></div>'
        : '') +
      '<div class="dacts"><button class="btn btn-primary" id="dSave" type="button">存进记录</button>' +
      '<button class="lnk" id="dDrop" type="button">不要了</button></div>' +
      '<pre class="dtext">' + esc(S.draft.text.slice(0, 1200)) + '</pre>';

    box.querySelectorAll('.dchip').forEach(function (b) {
      b.addEventListener('click', function () {
        box.querySelectorAll('.dchip').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        S.draft.sec = b.getAttribute('data-s');
      });
    });
    $('dSave').addEventListener('click', saveDraft);
    $('dDrop').addEventListener('click', dropDraft);
  }

  function dropDraft() {
    S.draft = null;
    $('draft').hidden = true;
    $('draft').innerHTML = '';
    note('');
  }

  function saveDraft() {
    if (!S.draft) return;
    var on = $('draft').querySelector('.dchip.on');
    var sec = (on && on.getAttribute('data-s')) || S.draft.guess.sec || S.sec;
    var body = {
      sec: sec,
      text: S.draft.text,
      band: $('dBand').value.trim(),
      right: $('dRight').value.trim(),
      total: $('dTotal').value.trim(),
      title: S.draft.guess.title || ''
    };
    fetch('/api/records/add', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (!j || !j.ok) { note((j && j.err) || '没存上', 7000); return; }
      S.sec = sec;
      dropDraft();
      return refresh().then(function () { note('已存进「' + sec + '」', 4000); });
    }).catch(function () { note('本地服务没响应', 7000); });
  }

  /* ---------------- 事件 ---------------- */

  function bind() {
    var box = $('box'), sink = $('sink');

    box.addEventListener('mousedown', function (e) {
      if (e.target.closest('button')) return;
      try { sink.focus({ preventScroll: true }); } catch (err) { }
    });
    box.addEventListener('contextmenu', function (e) {
      if (e.target.closest('button')) return;
      try { sink.focus({ preventScroll: true }); } catch (err) { }
    });
    sink.addEventListener('input', function () { sink.value = ''; });
    sink.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') return;
      if (!(e.metaKey || e.ctrlKey)) e.preventDefault();
    });
    sink.addEventListener('paste', function (e) {
      var dt = e.clipboardData;
      if (!dt) return;
      var file = null, i;
      if (dt.files && dt.files.length) file = dt.files[0];
      else if (dt.items) {
        for (i = 0; i < dt.items.length; i++) {
          if (dt.items[i].kind === 'file') { file = dt.items[i].getAsFile(); break; }
        }
      }
      if (!file) return;
      e.preventDefault();
      e.stopPropagation();
      readImage(file);
    });
    /* 兜底：焦点不在框里时按 ⌘V 也收 */
    document.addEventListener('paste', function (e) {
      if (e.defaultPrevented) return;
      var t = e.target;
      if (t && (t.tagName === 'INPUT' || (t.tagName === 'TEXTAREA' && t.id !== 'sink'))) return;
      var dt = e.clipboardData;
      if (!dt) return;
      var f = null, i;
      if (dt.files && dt.files.length) f = dt.files[0];
      else if (dt.items) {
        for (i = 0; i < dt.items.length; i++) {
          if (dt.items[i].kind === 'file') { f = dt.items[i].getAsFile(); break; }
        }
      }
      if (f) { e.preventDefault(); readImage(f); }
    });

    ['dragenter', 'dragover'].forEach(function (ev) {
      box.addEventListener(ev, function (e) { e.preventDefault(); box.classList.add('over'); });
    });
    ['dragleave', 'drop'].forEach(function (ev) {
      box.addEventListener(ev, function (e) { e.preventDefault(); box.classList.remove('over'); });
    });
    box.addEventListener('drop', function (e) {
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
        readImage(e.dataTransfer.files[0]);
      }
    });
    document.addEventListener('dragover', function (e) { e.preventDefault(); });
    document.addEventListener('drop', function (e) { e.preventDefault(); });

    $('pickBtn2').addEventListener('click', function () { $('pick').click(); });
    $('pick').addEventListener('change', function () {
      readImage(this.files[0]);
      this.value = '';
    });

    $('tabs').addEventListener('click', function (e) {
      var b = e.target.closest('.rtab');
      if (!b) return;
      S.sec = b.getAttribute('data-s');
      render();
    });

    $('list').addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var li = b.closest('.ritem');
      var id = li.getAttribute('data-id');
      if (b.getAttribute('data-act') === 'more') {
        var pre = li.querySelector('.rtext');
        pre.hidden = !pre.hidden;
        b.textContent = pre.hidden ? '原文' : '收起';
        return;
      }
      fetch('/api/records/del', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id })
      }).then(function () {
        S.items = S.items.filter(function (x) { return x.id !== id; });
        render();
      });
    });
  }

  bind();
  refresh().then(function () {
    $('foot').textContent = '记录存在 data/ielts-records.json。雅思哥的成绩只存在它自己的服务器里，' +
      '没有开放接口，所以这里是靠你贴一张结果页截图来归档的。';
  });
})();
