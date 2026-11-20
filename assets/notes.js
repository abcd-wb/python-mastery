/* 课堂 & 口语笔记：录音 → 豆包转文字 → AI 分析/提炼重点 → 生成笔记 */
(function () {
  'use strict';

  var API = '/api/notes';
  var S = { kind: 'class', notes: [], busy: false, lesson: '', bytes: 0 };

  var rec = null;          // MediaRecorder
  var chunks = [];         // 录音数据块
  var mime = '';           // 录音格式
  var recTimer = null;     // 计时器
  var recSec = 0;          // 已录秒数
  var recording = false;
  var paused = false;

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
  function fmtSec(s) { return pad(Math.floor(s / 60)) + ':' + pad(s % 60); }

  /* ---------------- 数据 ---------------- */

  function pull() {
    return fetch(API + '/list', { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        S.notes = (j && j.items) || [];
        S.bytes = (j && j.bytes) || 0;
      })
      .catch(function () { S.notes = []; S.bytes = 0; });
  }

  function kindLabel(k) {
    return k === 'class' ? '🎓 课堂' : '🗣 口语/听力';
  }

  function render() {
    var list = S.notes;
    var kb = S.bytes < 1024 ? (S.bytes + ' B')
      : (S.bytes < 1024 * 1024 ? (S.bytes / 1024).toFixed(1) + ' KB'
        : (S.bytes / 1024 / 1024).toFixed(2) + ' MB');
    $('nCnt').textContent = '共 ' + list.length + ' 篇 · 占用 ' + kb + '（只存文字，不存录音）';
    $('empty').hidden = list.length > 0;
    $('nlist').innerHTML = list.map(function (n) {
      var hl = (n.highlights || []).length;
      var an = (n.analysis || []).length;
      return '<li class="nitem" data-id="' + esc(n.id) + '">' +
        '<div class="nhead">' +
        '<span class="nwhen">' + when(n.ts) + '</span>' +
        '<b class="ntitle">' + esc(n.title) + '</b>' +
        '<span class="nkind">' + kindLabel(n.kind) + '</span>' +
        '<span class="nacts"><button data-act="view">看</button><button data-act="del">删</button></span>' +
        '</div>' +
        '<p class="nsum">' + esc(n.summary || n.text || '').slice(0, 120) + '</p>' +
        (hl ? '<span class="nmeta">' + hl + ' 个重点</span>' : '') +
        (an ? '<span class="nmeta">' + an + ' 条分析</span>' : '') +
        '</li>';
    }).join('');
  }

  function refresh() { return pull().then(render); }

  /* ---------------- 录音（自动分段，长课也不会撑爆识别接口） ---------------- */

  var SEG_MS = 180000;     // 每 3 分钟切一段，逐段转文字，最后合成一篇笔记
  var stream = null;       // 整节课复用同一个麦克风流
  var segTimer = null;     // 分段定时器
  var segNo = 0;           // 段号
  var segs = [];           // 各段识别出的文字
  var pending = 0;         // 还在转文字的段数
  var stopping = false;    // 用户已点「结束」
  var finishTimer = null;
  var endTimer = null;     // 下课时间兜底：到点自己停，不靠别的标签页广播

  function pickMime() {
    var cands = ['audio/mp4', 'audio/mp4;codecs=mp4a.40.2', 'audio/webm', 'audio/webm;codecs=opus', 'audio/mp3'];
    for (var i = 0; i < cands.length; i++) {
      if (window.MediaRecorder && MediaRecorder.isTypeSupported(cands[i])) return cands[i];
    }
    return '';
  }

  /* 告诉本地服务「这节课真的在录」。
     没有这个心跳，服务端只能靠「有页面开着」猜，今天 19:30 的外教课就是这么漏掉的：
     页面在，但这节课根本没开始录。 */
  var recHbTimer = null;
  function recHb(st) {
    if (!S.lesson || typeof fetch !== 'function') return;
    try {
      fetch('/api/note/rec-hb?lesson=' + encodeURIComponent(S.lesson) + '&st=' + (st || 'rec'),
        { cache: 'no-store' }).catch(function () { });
    } catch (e) { }
  }
  function startRecHb() {
    stopRecHb();
    recHb('rec');
    recHbTimer = setInterval(function () { recHb('rec'); }, 10000);
  }
  function stopRecHb(done) {
    clearInterval(recHbTimer); recHbTimer = null;
    if (done) recHb('done');
  }

  function isMineLesson() {
    if (!S.lesson) return false;
    try { return localStorage.getItem('ielts_note_running') === S.lesson; } catch (e) { return false; }
  }

  function extOf(m) {
    if (m.indexOf('mp4') >= 0) return 'm4a';
    if (m.indexOf('webm') >= 0) return 'webm';
    if (m.indexOf('mp3') >= 0) return 'mp3';
    return 'm4a';
  }

  function setRecUI(on, paused) {
    $('recBtn').hidden = on;
    $('recPause').hidden = !on;
    $('recPause').textContent = paused ? '▶ 继续' : '⏸ 暂停';
    $('recStop').hidden = !on;
    $('recDot').hidden = !on;
  }

  function scheduleRotate() {
    clearTimeout(segTimer);
    segTimer = setTimeout(function () {
      if (!recording || stopping) return;
      if (paused) { scheduleRotate(); return; }
      if (rec && rec.state !== 'inactive') { try { rec.stop(); } catch (e) { } }
    }, SEG_MS);
  }

  /* 结束当前段 → 立刻接上下一段，全程不中断录音 */
  function beginSegment() {
    if (!stream || stopping || !recording) return;
    chunks = [];
    segNo++;
    var r = new MediaRecorder(stream, { mimeType: mime });
    r.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
    r.onstop = function () {
      var ch = chunks.slice(); chunks = [];
      rec = null;
      if (ch.length) transcribeSegment(ch, segNo);
      if (stopping) { finishAll(); return; }
      if (recording) { beginSegment(); scheduleRotate(); }
    };
    rec = r;
    try { r.start(1000); } catch (e) { }
    if (paused) { try { r.pause(); } catch (e) { } }
  }

  function startRec() {
    if (recording) return;
    if (!window.MediaRecorder || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      $('recHint').textContent = '这个环境不能录音，请用 Chrome 打开 127.0.0.1:8101。';
      return;
    }
    mime = pickMime();
    if (!mime) { $('recHint').textContent = '浏览器不支持录音格式，请换 Chrome。'; return; }
    $('recHint').textContent = '正在打开麦克风…';
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (st) {
      stream = st;
      recording = true; stopping = false; paused = false;
      if (S.lesson) {
        try { localStorage.setItem('ielts_note_running', S.lesson); } catch (e) { }
      }
      recSec = 0; segNo = 0; segs = []; pending = 0;
      setRecUI(true, false);
      $('recStatus').textContent = '● 录音中';
      if (S.autoEnd) {
        var ed = new Date(S.autoEnd);
        $('recHint').textContent = '正在录音（每 3 分钟自动切一段）… ' +
          pad(ed.getHours()) + ':' + pad(ed.getMinutes()) + ' 下课会自动结束并生成笔记。';
      } else {
        $('recHint').textContent = '正在录音（每 3 分钟自动切一段）… 上完课点「结束并生成笔记」。';
      }
      beginSegment();
      scheduleRotate();
      armAutoEnd();
      startRecHb();
      clearInterval(recTimer);
      recTimer = setInterval(function () {
        if (!paused) {
          recSec++;
          $('recTime').textContent = fmtSec(recSec);
          /* 兜底：忘了点结束也不会一直占着麦克风 */
          if (recSec >= 5400) {
            $('recHint').textContent = '已录满 90 分钟，自动结束并生成笔记。';
            stopRec();
          }
        }
      }, 1000);
    }).catch(function (err) {
      $('recHint').textContent = '麦克风没开：点地址栏左侧的锁/喇叭图标 → 把「麦克风」改成允许，再点「开始录音」。' +
        (err && err.name ? '（' + err.name + '）' : '');
    });
  }

  function pauseRec() {
    if (!rec) return;
    if (paused) {
      paused = false;
      try { rec.resume(); } catch (e) { }
      setRecUI(true, false);
      $('recStatus').textContent = '● 录音中';
      scheduleRotate();
    } else {
      paused = true;
      try { rec.pause(); } catch (e) { }
      setRecUI(true, true);
      $('recStatus').textContent = '已暂停';
      clearTimeout(segTimer);
    }
  }

  /* 下课时间兜底：start 指令 / 笔记页 URL 带 end 时间戳，自己到点停录并生成笔记 */
  function onAutoEnd() {
    if (!recording) {
      /* 麦克风可能还在打开：稍后重试，最多 3 次 */
      S.endRetry = (S.endRetry || 0) + 1;
      if (S.endRetry <= 3) { endTimer = setTimeout(onAutoEnd, 5000); return; }
      return;
    }
    $('recHint').textContent = '下课时间到，正在自动结束并生成笔记…';
    stopRec();
  }
  function armAutoEnd() {
    clearTimeout(endTimer);
    if (!S.autoEnd) return;
    var wait = S.autoEnd - Date.now();
    if (wait <= 0) { if (recording) stopRec(); return; }
    endTimer = setTimeout(onAutoEnd, wait);
  }
  function setAutoEnd(ts) {
    var t = +ts;
    if (!t || isNaN(t)) return;
    S.autoEnd = t; S.endRetry = 0;
    if (recording) {
      var d = new Date(t);
      $('recHint').textContent = '本课 ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) +
        ' 下课，到点自动停录并生成笔记。';
    }
    armAutoEnd();
  }

  function stopRec() {
    if (!recording) return;
    stopping = true;
    clearTimeout(segTimer);
    $('recStatus').textContent = '正在整理…';
    if (rec && rec.state !== 'inactive') {
      try { rec.stop(); } catch (e) { finishAll(); }
    } else { finishAll(); }
  }

  /* 等所有分段转文字完成 → 合并 → AI 分析 → 存成一篇笔记 */
  function finishAll() {
    clearInterval(recTimer);
    clearTimeout(segTimer);
    clearTimeout(endTimer);
    S.autoEnd = 0;
    if (finishTimer) return;
    stopRecHb(true);   /* 这节课结束了，告诉服务端别再重复拉起笔记页 */
    if (stream) { stream.getTracks().forEach(function (t) { t.stop(); }); stream = null; }
    recording = false;
    setRecUI(false, false);
    try { localStorage.removeItem('ielts_note_running'); } catch (e) { }
    finishTimer = setInterval(function () {
      if (pending > 0) {
        $('recStatus').textContent = '还有 ' + pending + ' 段在转文字…';
        return;
      }
      clearInterval(finishTimer); finishTimer = null;
      $('recStatus').textContent = '';
      var text = segs.sort(function (x, y) { return x.no - y.no; })
        .map(function (x) { return x.text; }).join('\n').trim();
      if (!text) { $('recHint').textContent = '没识别到内容，可能没录到声音（老师声音要能进麦克风）。'; return; }
      $('recHint').textContent = '共 ' + segs.length + ' 段、' + text.length + ' 字，正在 AI 分析…';
      $('recStatus').textContent = 'AI 分析中…';
      analyze(text);
    }, 400);
  }

  /* 单段音频 → 豆包转文字（并行，不阻塞继续录音） */
  function transcribeSegment(ch, no) {
    pending++;
    var blob = new Blob(ch, { type: mime });
    var reader = new FileReader();
    reader.onload = function () {
      var b64 = String(reader.result || '').split(',')[1] || '';
      fetch(API + '/asr', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio: b64, format: extOf(mime) })
      }).then(function (r) { return r.json(); }).then(function (j) {
        if (j && j.ok && j.text) segs.push({ no: no, text: j.text });
        pending--;
      }).catch(function () { pending--; });
    };
    reader.onerror = function () { pending--; };
    reader.readAsDataURL(blob);
  }

  /* ---------------- 转文字 → 分析 → 存笔记 ---------------- */

  function analyze(text) {
    fetch(API + '/analyze', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text, kind: S.kind })
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (!j || !j.ok) {
        // 分析失败：也把纯文字存成笔记，不丢内容
        saveNote(text, '', [], []);
        return;
      }
      var result = j.result || '';
      if (S.kind === 'class') {
        // 提炼重点：把【重点】开头的行抽出来
        var highlights = [];
        result.split('\n').forEach(function (line) {
          var m = line.match(/【重点】\s*(.+)/);
          if (m) highlights.push(m[1]);
        });
        var summary = result.split('\n').filter(function (l) { return l.trim() && !l.match(/【重点】/); }).join(' ').slice(0, 400);
        saveNote(text, summary, highlights, []);
      } else {
        // 口语分析：整段结果存成 analysis
        var lines = result.split('\n').filter(function (l) { return l.trim(); });
        saveNote(text, '', [], lines);
      }
    }).catch(function () {
      saveNote(text, '', [], []);
    });
  }

  function saveNote(text, summary, highlights, analysis) {
    var name = $('nName').value.trim() || (S.kind === 'class' ? '课堂' : '口语');
    var title = name + ' · ' + timeStr();
    fetch(API + '/add', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title, kind: S.kind, text: text,
        summary: summary, highlights: highlights, analysis: analysis
      })
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (!j || !j.ok) { $('recHint').textContent = '笔记没存上：' + ((j && j.err) || '失败'); return; }
      $('recHint').textContent = '笔记已生成「' + title + '」，在下面列表里可以点开看。';
      $('recStatus').textContent = '';
      $('nName').value = '';
      refresh();
    }).catch(function () {
      $('recHint').textContent = '连不上本地服务，笔记没存上。';
      $('recStatus').textContent = '';
    });
  }

  function timeStr() {
    var d = new Date();
    return (d.getMonth() + 1) + '月' + d.getDate() + '日';
  }

  /* ---------------- 查看笔记 ---------------- */

  function openNote(n) {
    $('nvTitle').textContent = n.title;
    $('nvKind').textContent = kindLabel(n.kind);
    var html = '';
    if (n.text) {
      var txt = esc(n.text);
      /* 长课文默认只显示前 6000 字，避免旧手机/360 浏览器渲染两万字卡住像「打不开」；点展开看全文 */
      if (n.text.length > 6000) {
        html += '<div class="nv-sec"><b>原文（' + n.text.length + ' 字，点展开看全文）</b>' +
          '<pre class="nv-text" id="nvTextFold">' + txt.slice(0, 6000) + '</pre>' +
          '<button class="nv-more" id="nvMore" type="button">展开全文 ▼</button></div>';
      } else {
        html += '<div class="nv-sec"><b>原文</b><pre class="nv-text">' + txt + '</pre></div>';
      }
    }
    if (n.kind === 'class') {
      if (n.summary) html += '<div class="nv-sec"><b>内容概括</b><p class="nv-sum">' + esc(n.summary) + '</p></div>';
      if (n.highlights && n.highlights.length) {
        html += '<div class="nv-sec"><b>重点</b><ul class="nv-hl">' +
          n.highlights.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') + '</ul></div>';
      }
    } else {
      if (n.analysis && n.analysis.length) {
        html += '<div class="nv-sec"><b>分析（语法 / 发音 / 中式英语）</b><div class="nv-an">' +
          n.analysis.map(function (l) { return '<p>' + esc(l) + '</p>'; }).join('') + '</div></div>';
      }
    }
    $('nvBody').innerHTML = html || '<p class="nv-empty">这篇笔记没有额外内容。</p>';
    $('viewMask').hidden = false;

    var more = $('nvMore');
    if (more) {
      more.addEventListener('click', function () {
        var pre = $('nvTextFold');
        if (!pre) return;
        var full = esc(n.text);
        if (pre.getAttribute('data-full') === '1') {
          pre.textContent = full.slice(0, 6000);
          pre.setAttribute('data-full', '0');
          more.textContent = '展开全文 ▼';
        } else {
          pre.textContent = full;
          pre.setAttribute('data-full', '1');
          more.textContent = '收起 ▲';
        }
      });
    }
  }

  /* ---------------- 事件 ---------------- */

  /* 到开始 / 结束时间的指令：自动开录、自动停录并生成笔记 */
  function handleNoteCmd(cmd) {
    if (!cmd) return;
    if (cmd.cmd === 'start' && !recording && !S.busy) {
      if (cmd.name) $('nName').value = cmd.name;
      if (cmd.key) S.lesson = cmd.key;
      if (cmd.end) setAutoEnd(cmd.end);
      $('recHint').textContent = '上课时间到，正在自动开始录音…';
      startRec();
    }
    if (cmd.cmd === 'stop') {
      clearTimeout(endTimer);
      S.autoEnd = 0;
      if (recording) {
        $('recHint').textContent = '下课时间到，正在自动结束并生成笔记…';
        stopRec();
      }
    }
  }
  function watchClassEnd() {
    /* 别的标签页：localStorage 广播 */
    window.addEventListener('storage', function (e) {
      if (e.key !== 'ielts_note_cmd' || !e.newValue) return;
      var cmd = null;
      try { cmd = JSON.parse(e.newValue); } catch (err) { return; }
      handleNoteCmd(cmd);
    });
    /* 本标签页：守护脚本直接派发（storage 事件自己收不到） */
    window.addEventListener('ieltsNoteCmd', function (e) { handleNoteCmd(e.detail); });
  }

  function bind() {
    $('ntabs').addEventListener('click', function (e) {
      var b = e.target.closest('.ntab');
      if (!b) return;
      S.kind = b.getAttribute('data-k');
      [].forEach.call($('ntabs').querySelectorAll('.ntab'), function (x) {
        x.classList.toggle('on', x === b);
      });
      $('recHint').textContent = S.kind === 'class'
        ? '上课时会自动开始录音；下课后点「结束并生成笔记」，自动提炼重点。'
        : '点雅思哥时会自动开始录音；说完点「结束并生成笔记」，AI 找语法/发音/中式英语问题。';
    });

    $('recBtn').addEventListener('click', startRec);
    $('recPause').addEventListener('click', pauseRec);
    $('recStop').addEventListener('click', stopRec);

    $('nlist').addEventListener('click', function (e) {
      var li = e.target.closest('.nitem');
      if (!li) return;
      var id = li.getAttribute('data-id');
      var b = e.target.closest('button');
      var act = b ? b.getAttribute('data-act') : '';
      if (act === 'del') {
        if (!confirm('删除这篇笔记？')) return;
        fetch(API + '/del', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: id })
        }).then(function () {
          S.notes = S.notes.filter(function (n) { return n.id !== id; });
          render();
        });
        return;
      }
      /* 点整行（含「看」按钮 / 空白）都打开笔记，避免只认按钮导致点不开 */
      S.notes.forEach(function (n) { if (n.id === id) openNote(n); });
    });

    if ($('nClear')) {
      $('nClear').addEventListener('click', function () {
        if (!S.notes.length) { $('recHint').textContent = '还没有笔记可清。'; return; }
        if (!confirm('清空全部 ' + S.notes.length + ' 篇笔记？录音本来就没存过，清的只是文字笔记。')) return;
        fetch(API + '/clear', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
          .then(function (r) { return r.json(); })
          .then(function () { refresh(); $('recHint').textContent = '已清空笔记，占用回到 0 B。'; });
      });
    }
    $('nvClose').addEventListener('click', function () { $('viewMask').hidden = true; });
    $('viewMask').addEventListener('click', function (e) { if (e.target === this) this.hidden = true; });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') $('viewMask').hidden = true;
    });
  }

  bind();
  watchClassEnd();
  // 从 URL 参数读初始状态（如 ielts-notes.html?kind=class&name=外教课）
  function readQuery() {
    var q = {};
    (location.search || '').replace(/^\?/, '').split('&').forEach(function (kv) {
      var p = kv.split('=');
      if (p[0]) q[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || '');
    });
    return q;
  }
  var q0 = readQuery();
  if (q0.kind === 'oral' || q0.kind === 'class') {
    S.kind = q0.kind;
    [].forEach.call($('ntabs').querySelectorAll('.ntab'), function (x) {
      x.classList.toggle('on', x.getAttribute('data-k') === S.kind);
    });
  }
  if (q0.name) $('nName').value = q0.name;
  if (q0.lesson) S.lesson = q0.lesson;
  if (q0.end) setAutoEnd(+q0.end);
  refresh();
  /* 从课表 / 雅思哥自动进来：页面就绪后直接开始录音，不用再点按钮 */
  if (q0.auto === '1') {
    $('recHint').textContent = '正在自动开始录音…（第一次浏览器会弹麦克风授权，点「允许」即可，以后全自动）';
    setTimeout(function () { startRec(); }, 600);
  }
})();
