/* 全站守护：按课表里排的「开始 / 结束时间」自动开始 / 结束课堂笔记录音。
   - 平台任意一个标签页开着即可，不用点课程块、不用点「开始录音」
   - 课程来源：课表页空白处排的课（localStorage: ielts_plan_v5），改时间即时生效
   - 优先通过 localStorage 广播给已经开着的笔记页（不弹窗，不受弹窗拦截影响）
   - start 指令带结束时间戳，笔记页自己也会到下课时间停录（双保险）
   - 笔记页没开着时才尝试 window.open；被浏览器拦了就显示浮动提示条 */
(function () {
  'use strict';

  /* 预览面板 / file:// 不是 127.0.0.1:8101 同源，录音和广播都用不了，直接跳过 */
  if (window.apiSameOrigin === false) return;
  if (!/^https?:$/.test(location.protocol)) return;

  var BASE = window.API_BASE || '';
  var WIN = 'ieltsNoteWin';
  var CHECK_MS = 15000;
  var NOTE_PAGE = 'ielts-notes.html';
  var PLAN_KEY = 'ielts_plan_v5';
  var END_GRACE = 6 * 3600 * 1000;   /* 错过下课时刻，6 小时内仍会补发停录 */

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function ls(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) { } }
  function del(k) { try { localStorage.removeItem(k); } catch (e) { } }

  function noteUrl(o, key) {
    return BASE + '/' + NOTE_PAGE + '?kind=class&name=' + encodeURIComponent(o.name || '这节课') +
      '&auto=1&lesson=' + encodeURIComponent(key) + '&end=' + o.en;
  }

  /* 笔记页开着时写心跳；30 秒内算「活着」 */
  function noteAlive() {
    var t = parseInt(ls('ielts_note_alive') || '0', 10);
    return t && (Date.now() - t) < 30000;
  }

  function showBlocked(o, key) {
    if (document.getElementById('autoNoteBar')) return;
    var d = document.createElement('div');
    d.id = 'autoNoteBar';
    d.style.cssText = 'position:fixed;z-index:99999;left:50%;bottom:24px;transform:translateX(-50%);' +
      'background:#e4483f;color:#fff;padding:12px 18px;border-radius:12px;' +
      'box-shadow:0 8px 30px rgba(0,0,0,.25);font:600 14px/1.5 -apple-system,sans-serif;' +
      'display:flex;align-items:center;gap:12px;max-width:92vw';
    d.innerHTML = '<span>上课时间到了，浏览器拦了自动弹出的笔记页</span>' +
      '<button id="autoNoteGo" style="background:#fff;color:#e4483f;border:0;' +
      'border-radius:8px;padding:7px 14px;font-weight:700;cursor:pointer">开始记录</button>' +
      '<button id="autoNoteX" style="background:transparent;color:#fff;border:0;' +
      'font-size:18px;cursor:pointer" aria-label="关闭">×</button>';
    document.body.appendChild(d);
    document.getElementById('autoNoteGo').onclick = function () {
      window.open(noteUrl(o, key), WIN);
      d.remove();
    };
    document.getElementById('autoNoteX').onclick = function () { d.remove(); };
  }

  /* 课表页排的课 / 改过的开始结束时间，全存在 localStorage，同源各标签页共享 */
  function planData() {
    try {
      var p = JSON.parse(localStorage.getItem(PLAN_KEY) || '{}') || {};
      return {
        local: p.local || [],
        removed: p.removed || [],
        autoNote: !p.set || p.set.autoNote !== 0
      };
    } catch (e) {
      return { local: [], removed: [], autoNote: true };
    }
  }

  /* 内置课表 + 自己排的课，合成一份带「开始 / 结束时间戳」的清单 */
  function lessonList() {
    var p = planData(), rem = {}, seen = {}, out = [];
    p.removed.forEach(function (k) { rem[k] = 1; });
    function push(o) {
      if (!o || !o.d || o.h == null || o.m == null) return;
      /* 「其他计划」只占课表，不自动录音；只有雅思 / 外教这类真课才开录 */
      if (o.type === 'plan' || o.note === 0 || o.noNote) return;
      var key = o.d + ' ' + pad(o.h) + ':' + pad(o.m);
      if (rem[key] || seen[key]) return;
      var dur = o.dur || 60;
      if (o.eh != null && o.em != null) {
        var dd = (o.eh * 60 + o.em) - (o.h * 60 + o.m);
        if (dd <= 0) dd += 1440;
        if (dd > 0 && dd <= 360) dur = dd;
      }
      var st = new Date(o.d + 'T' + pad(o.h) + ':' + pad(o.m) + ':00').getTime();
      if (isNaN(st)) return;
      seen[key] = 1;
      out.push({ key: key, name: o.k || '这节课', st: st, en: st + dur * 60000 });
    }
    /* 课表只认本课程清单里排的课（内置课表已按用户要求清空） */
    p.local.forEach(push);
    return { list: out, autoNote: p.autoNote };
  }

  /* 跨标签页用 localStorage，同一个标签页用自定义事件（storage 事件自己收不到） */
  function broadcast(cmd) {
    try { localStorage.setItem('ielts_note_cmd', JSON.stringify(cmd)); } catch (e) { }
    try { window.dispatchEvent(new CustomEvent('ieltsNoteCmd', { detail: cmd })); } catch (e) { }
  }

  function begin(o) {
    var tag = 'ielts_auto_start_' + o.key;
    if (ls(tag)) return;
    set(tag, '1');
    if (ls('ielts_note_running') === o.key) return;
    /* 先广播：开着的笔记页收到后自己 startRec()，完全不需要弹窗 */
    broadcast({ cmd: 'start', key: o.key, kind: 'class', name: o.name, end: o.en, ts: Date.now() });
    if (noteAlive()) return;
    var w = null;
    try { w = window.open(noteUrl(o, o.key), WIN); } catch (e) { }
    if (!w) { del(tag); showBlocked(o, o.key); }
  }

  function finish(o) {
    var tag = 'ielts_auto_end_' + o.key;
    if (ls(tag)) return;
    set(tag, '1');
    broadcast({ cmd: 'stop', key: o.key, ts: Date.now() });
  }

  function check() {
    var p = lessonList();
    if (!p.autoNote) return;   /* 设置里关了「上课自动记笔记」就完全不插手 */
    var now = Date.now();
    p.list.forEach(function (o) {
      /* 上课期间：中途才打开页面也会补开，不再只有 90 秒的窄窗口 */
      if (now >= o.st && now < o.en) begin(o);
      /* 下课：即使电脑睡过 / 标签页被节流错过那一刻，也会补发停录 */
      if (now >= o.en && now < o.en + END_GRACE) finish(o);
    });
  }

  /* 本页就是笔记页时，持续写心跳，让别的标签页知道「不用弹窗」 */
  function heartbeat() {
    if ((location.pathname || '').indexOf(NOTE_PAGE) >= 0) {
      set('ielts_note_alive', String(Date.now()));
      setInterval(function () { set('ielts_note_alive', String(Date.now())); }, 10000);
    }
  }

  function boot() {
    heartbeat();
    /* 课表页刚改了开始 / 结束时间：别的标签页立刻按新时间重算 */
    window.addEventListener('storage', function (e) {
      if (e.key === PLAN_KEY) check();
    });
    check();
    setInterval(check, CHECK_MS);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
