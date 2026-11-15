/* 数据层：三套 B 站课程（window.COURSES）+ 进度 / 朗读 / 提示 */
(function (W) {
  var C = W.COURSES || {};
  var KEY = 'pm_progress_v2';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function toast(msg) {
    var t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.className = 'toast on';
    clearTimeout(t._h); t._h = setTimeout(function () { t.className = 'toast'; }, 1900);
  }

  /* ---------- 进度 ---------- */
  function loadAll() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function isDone(id, n) { var a = loadAll()[id]; return !!(a && a[n]); }
  function toggle(id, n) {
    var all = loadAll(); all[id] = all[id] || {};
    if (all[id][n]) delete all[id][n]; else all[id][n] = 1;
    localStorage.setItem(KEY, JSON.stringify(all));
    return !!all[id][n];
  }
  function setDone(id, n, on) {
    var all = loadAll(); all[id] = all[id] || {};
    if (on) all[id][n] = 1; else delete all[id][n];
    localStorage.setItem(KEY, JSON.stringify(all));
    return !!on;
  }
  function countDone(id) { var a = loadAll()[id] || {}, c = 0; for (var k in a) if (a[k]) c++; return c; }

  /* ---------- 听课计时：停留时长到了本集时长的 90%，自动标绿 ---------- */
  var WKEY = 'pm_watch_v1';
  function loadWatch() { try { return JSON.parse(localStorage.getItem(WKEY)) || {}; } catch (e) { return {}; } }
  function durOf(id, p) {
    var pg = pageOf(id, p);
    return (pg && pg.d) || 600;
  }
  function needOf(id, p) {
    return Math.max(45, Math.round(durOf(id, p) * 0.9));
  }
  function watchedOf(id, p) {
    var a = loadWatch()[id] || {};
    return Math.min(a[p] || 0, needOf(id, p));
  }
  function saveWatched(id, p, sec) {
    var all = loadWatch(); all[id] = all[id] || {};
    all[id][p] = Math.max(0, Math.round(sec));
    try { localStorage.setItem(WKEY, JSON.stringify(all)); } catch (e) {}
  }
  function resetWatch(id, p) { saveWatched(id, p, 0); }
  /* 累加秒数；到点自动标绿。返回 {got, need, done, justDone} */
  function tick(id, p, sec) {
    var need = needOf(id, p);
    if (isDone(id, p)) return { got: need, need: need, done: true, justDone: false };
    var got = Math.min(need, watchedOf(id, p) + (sec || 1));
    saveWatched(id, p, got);
    if (got >= need) {
      setDone(id, p, true);
      return { got: got, need: need, done: true, justDone: true };
    }
    return { got: got, need: need, done: false, justDone: false };
  }
  function hoursOf(id) {
    var c = course(id);
    if (!c) return 0;
    if (c.secs) return c.secs / 3600;
    var s = 0;
    (c.pages || []).forEach(function (x) { s += (x.d || 0); });
    return s / 3600;
  }
  function mmss(sec) {
    sec = Math.max(0, Math.round(sec));
    var m = Math.floor(sec / 60), s = sec % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  /* ---------- 课程 / 章节 / 节 ---------- */
  function course(id) { return C[id] || C.intro || null; }
  function chaptersOf(id) { var c = course(id); return (c && c.chapters) || []; }
  function chapterOf(id, chId) {
    var chs = chaptersOf(id);
    for (var i = 0; i < chs.length; i++) if (chs[i].id === chId) return chs[i];
    return chs[0] || null;
  }
  function chapterOfPage(id, p) {
    var chs = chaptersOf(id);
    for (var i = 0; i < chs.length; i++) if (p >= chs[i].from && p <= chs[i].to) return chs[i];
    return chs[0] || null;
  }
  function pageOf(id, p) { var c = course(id); return (c && c.pages && c.pages[p - 1]) || null; }
  function totalOf(id) { var c = course(id); return (c && c.pages) ? c.pages.length : 0; }

  function splitEx(list) {
    return (list || []).map(function (x) {
      if (typeof x === 'string') {
        var i = x.indexOf('|');
        return i < 0 ? { q: x, a: '（暂无答案）' } : { q: x.slice(0, i), a: x.slice(i + 1) };
      }
      return { q: x.q || '', a: x.a || '（暂无答案）' };
    });
  }

  /* 本章术语：按节轮换顺序，最多 6 个 */
  function termsAt(id, p) {
    var c = course(id), pg = pageOf(id, p);
    if (!c || !pg) return [];
    var pool = (c.terms && c.terms[pg.ch]) || [];
    if (!pool.length) return [];
    var start = (p - 1) % pool.length, ordered = [], i;
    for (i = 0; i < pool.length; i++) ordered.push(pool[(start + i) % pool.length]);
    var out = [];
    for (i = 0; i < Math.min(6, ordered.length); i++) {
      var t = ordered[i];
      out.push({ en: t[0], pos: t[1], zh: t[2], eg: t[3], egZh: t[4] });
    }
    return out;
  }

  /* 本节讲义：优先该集，其次本章知识卡 */
  function noteOf(id, p) {
    var c = course(id), pg = pageOf(id, p);
    if (!c || !pg) return null;
    var n = (c.notes && c.notes[p]) || null;
    if (!n && c.chapterNotes) n = c.chapterNotes[pg.ch] || null;
    return n;
  }

  function lessonAt(id, p) {
    var pg = pageOf(id, p);
    if (!pg) return null;
    var ch = chapterOf(id, pg.ch), note = noteOf(id, p) || {};
    return {
      n: pg.p, title: pg.t, chapter: ch,
      pts: note.pts || [], code: note.code || '', ex: splitEx(note.ex),
      terms: termsAt(id, p)
    };
  }

  /* ---------- 视频地址 ----------
     桌面版外链播放器（player.bilibili.com）在 iframe 里常被拦成黑屏，
     移动版播放器（html5mobileplayer）可稳定嵌入，默认用它；
     用户可在播放器下方一键切回桌面版。 */
  var PKEY = 'pm_player_mode';
  function playerMode() { try { return localStorage.getItem(PKEY) || 'mobile'; } catch (e) { return 'mobile'; } }
  function setPlayerMode(m) { try { localStorage.setItem(PKEY, m); } catch (e) {} }
  function autoPlay() { try { return localStorage.getItem('pm_autoplay') === '1'; } catch (e) { return false; } }
  function setAutoPlay(v) { try { localStorage.setItem('pm_autoplay', v ? '1' : '0'); } catch (e) {} }
  function playerUrl(id, p) {
    var c = course(id);
    if (!c) return '';
    var pg = pageOf(id, p), pn = (pg && pg.pg) || p;   /* pg = 该集在原视频里的真实分P号 */
    var ap = autoPlay() ? 1 : 0;
    if (playerMode() === 'desktop') {
      return 'https://player.bilibili.com/player.html?isOutside=true&bvid=' + c.bv +
        '&page=' + pn + '&autoplay=' + ap + '&danmaku=0&high_quality=1';
    }
    return 'https://www.bilibili.com/blackboard/html5mobileplayer.html?bvid=' + c.bv +
      '&page=' + pn + '&autoplay=' + ap + '&danmaku=0';
  }
  function watchUrl(id, p) {
    var c = course(id);
    var pg = pageOf(id, p), pn = (pg && pg.pg) || p;
    return c ? 'https://www.bilibili.com/video/' + c.bv + '/?p=' + pn : '';
  }

  /* ---------- 美音朗读：有道真人录音（美式女声），失败退回系统英文语音 ---------- */
  var PREF = ['Samantha', 'Ava', 'Allison', 'Susan', 'Zoe', 'Nicky', 'Tessa', 'Moira', 'Karen',
    'Google US English', 'Microsoft Aria', 'Microsoft Jenny', 'Microsoft Zira'];
  var voice = null, audioOk = true;
  function pickVoice() {
    if (!('speechSynthesis' in W)) return null;
    var vs = W.speechSynthesis.getVoices() || [];
    if (!vs.length) return null;
    var en = vs.filter(function (v) { return /^en([-_]|$)/i.test(v.lang || ''); });
    for (var i = 0; i < PREF.length; i++) {
      for (var j = 0; j < en.length; j++) {
        if ((en[j].name || '').toLowerCase().indexOf(PREF[i].toLowerCase()) >= 0) return en[j];
      }
    }
    var us = en.filter(function (v) { return /en[-_]US/i.test(v.lang || ''); });
    return us[0] || en[0] || null;
  }
  function currentVoice() { if (!voice) voice = pickVoice(); return voice; }
  function voiceLabel() {
    if (audioOk) return '美国女声真人录音';
    var v = currentVoice();
    return v ? v.name.replace(/\s*\(.*?\)\s*$/, '') : '系统英文语音';
  }
  function sysSpeak(text) {
    if (!('speechSynthesis' in W)) { toast('这个浏览器不支持朗读，请换 Chrome / Edge'); return; }
    W.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    var v = currentVoice();
    if (v) u.voice = v;
    u.lang = 'en-US'; u.rate = 0.92;
    W.speechSynthesis.speak(u);
  }
  function speak(text) {
    if (!text) return 'none';
    if (audioOk) {
      try {
        var a = new Audio('https://dict.youdao.com/dictvoice?type=1&audio=' + encodeURIComponent(text));
        a.addEventListener('error', function () { audioOk = false; sysSpeak(text); });
        var p = a.play();
        if (p && p.catch) p.catch(function () { audioOk = false; sysSpeak(text); });
        return 'audio';
      } catch (e) { audioOk = false; }
    }
    sysSpeak(text);
    return 'system';
  }
  if ('speechSynthesis' in W) {
    W.speechSynthesis.addEventListener('voiceschanged', function () { voice = pickVoice(); });
    setTimeout(function () { voice = pickVoice(); }, 300);
  }

  function backTo(href, text) {
    return '<a class="back" href="' + href + '">← ' + (text || '返回') + '</a>';
  }

  W.PY = {
    esc: esc, toast: toast, isDone: isDone, toggle: toggle, setDone: setDone, countDone: countDone,
    course: course, chaptersOf: chaptersOf, chapterOf: chapterOf, chapterOfPage: chapterOfPage,
    pageOf: pageOf, totalOf: totalOf, lessonAt: lessonAt, noteOf: noteOf, termsAt: termsAt,
    playerUrl: playerUrl, watchUrl: watchUrl, playerMode: playerMode, setPlayerMode: setPlayerMode,
    autoPlay: autoPlay, setAutoPlay: setAutoPlay,
    durOf: durOf, needOf: needOf, watchedOf: watchedOf, tick: tick, resetWatch: resetWatch,
    hoursOf: hoursOf, mmss: mmss,
    speak: speak, voiceLabel: voiceLabel, backTo: backTo, COURSES: C
  };
})(window);
