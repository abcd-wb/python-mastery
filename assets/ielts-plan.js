/* 模块一：课程与计划
   · 按周展示的时间轴课表（08:00 - 22:00）
   · 点任意一节课就打开它自己的教室（AT 课 / 自排课走不同会议室）
   · 排课：一句自然语言；图片排课：OCR 识别后人工核对
   · 课前放轻音乐 + 女声提醒（assets/audio 里的真人发音文件）
   数据存本机 localStorage（ielts_plan_v5；旧课表已按用户要求清空） */
(function () {
  var KEY = 'ielts_plan_v5';
  var DEF_AT = 'https://meeting.tencent.com/dm/Izg8HUI5xTnd';
  /* 六种可排内容：除「自定义学习计划」外，到点都自动录音 */
  var TYPES = [
    { id: 'oral', k: '雅思口语', room: 'r2', note: 1 },
    { id: 'read', k: '雅阅', room: 'r1', note: 1 },
    { id: 'listen', k: '雅听', room: 'r1', note: 1 },
    { id: 'write', k: '雅写', room: 'r1', note: 1 },
    { id: 'foreign', k: '雅思外教', room: 'r3', note: 1 },
    { id: 'plan', k: '自定义计划', room: '', note: 0 }
  ];
  function typeOf(id) {
    for (var i = 0; i < TYPES.length; i++) if (TYPES[i].id === id) return TYPES[i];
    return TYPES[0];
  }
  function defRooms() {
    return [
      { id: 'r1', name: '雅阅 / 雅听 / 雅写', link: DEF_AT, no: '505-242-923' },
      { id: 'r2', name: '雅思口语', link: '', no: '' },
      { id: 'r3', name: '雅思外教', link: '', no: '' }
    ];
  }
  function defBindings() {
    return { oral: 'r2', read: 'r1', listen: 'r1', write: 'r1', foreign: 'r3', plan: '' };
  }
  var SRC = window.IELTS_SCHEDULE || { lessons: [] };
  var WD = ['一', '二', '三', '四', '五', '六', '日'];
  var CN = { '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '日': 7, '天': 7, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7 };
  var PRESET = {
    '雅思': { c: 'ya', full: '雅思课', say: '雅思课' },
    '雅阅': { c: 'yd', full: '雅思阅读课', say: '雅思阅读课' },
    '雅写': { c: 'yw', full: '雅思写作课', say: '雅思写作课' },
    '口语': { c: 'ks', full: '雅思口语课', say: '雅思口语课' },
    '听力': { c: 'tl', full: '雅思听力课', say: '雅思听力课' }
  };
  /* 自己起的课名（外教课…）按名字取色，同名同色，看着不串 */
  var CU = [
    { bg: '#f5f0ff', bar: '#8b5cf6', ink: '#6d28d9', sub: '#a78bd8' },
    { bg: '#e9fbf5', bar: '#10b981', ink: '#047857', sub: '#6ec9ae' },
    { bg: '#fff1f5', bar: '#ec4899', ink: '#9d174d', sub: '#e6a0bd' },
    { bg: '#eef4ff', bar: '#3b82f6', ink: '#1d4ed8', sub: '#7d9dd6' },
    { bg: '#fff7e6', bar: '#d97706', ink: '#92400e', sub: '#d3a35f' }
  ];
  function kindOf(k) {
    var name = String(k == null ? '' : k).trim() || '雅思';
    if (PRESET[name]) {
      var p = PRESET[name];
      return { name: name, c: p.c, full: p.full, say: p.say, custom: false };
    }
    var full = /课$/.test(name) ? name : name + '课';
    var h = 7;
    for (var i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 9973;
    var pal = CU[h % CU.length];
    return { name: name, c: 'cu', full: full, say: full, custom: true, pal: pal };
  }
  var START_H = 8, END_H = 22, ROWH = 54;

  var S = load();
  var viewMon = mondayOf(new Date());

  function load() {
    var base = {
      local: [], alerted: {}, removed: [],
      rooms: defRooms(), bindings: defBindings(),
      set: { lead: 5, voiceName: 'sandy', speak: 1, music: 1, notify: 0,
             linkAT: DEF_AT, linkLocal: '', autoNote: 1 }
    };
    try {
      var o = JSON.parse(localStorage.getItem(KEY));
      if (o && o.set) {
        o.local = o.local || []; o.alerted = o.alerted || {}; o.removed = o.removed || [];
        o.rooms = (o.rooms && o.rooms.length) ? o.rooms : defRooms();
        o.bindings = o.bindings || defBindings();
        return o;
      }
    } catch (e) { }
    /* 全新开始：不读旧键、不读已清空的内置课表；旧数据仍留在浏览器里可备查 */
    return base;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }
  function $(id) { return document.getElementById(id); }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function toast(m) { if (window.PY && PY.toast) PY.toast(m); }
  function clock(h, m) { return pad(h) + ':' + pad(m); }
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

  /* ---------- 日期 ---------- */
  function mondayOf(d) {
    var x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
    return x;
  }
  function isoOf(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function at(iso, h, m) { var p = String(iso).split('-'); return new Date(+p[0], +p[1] - 1, +p[2], h || 0, m || 0, 0, 0); }
  function addDays(d, n) { var x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; }
  function weekDiff(a, b) { return Math.round((mondayOf(a) - mondayOf(b)) / (7 * 86400000)); }

  /* ---------- 课程 ---------- */
  function cleanKind(k) {
    var s = String(k == null ? '' : k).replace(/[\s\u3000]+/g, ' ').trim().slice(0, 12);
    return s || '雅思';
  }
  function norm(o, defSrc) {
    var iso = o.d || o.date;
    var k = cleanKind(o.k);
    var start = at(iso, o.h, o.m);
    var dur = o.dur || 60;
    /* 「结束时间」是权威：表里点过结束就以它为准，dur 只是给旧代码算高度用 */
    if (o.eh != null && o.em != null) {
      var dd = (o.eh * 60 + o.em) - (o.h * 60 + o.m);
      if (dd <= 0) dd += 1440;                 /* 结束写在开始前面＝跨过零点 */
      if (dd > 0 && dd <= 360) dur = dd;
    }
    var end = start.getTime() + dur * 60000;
    var ed = new Date(end);
    return {
      key: iso + ' ' + clock(o.h, o.m),
      iso: iso, h: o.h, m: o.m, dur: dur, k: k, t: o.t || '',
      eh: ed.getHours(), em: ed.getMinutes(),
      src: o.src || defSrc || 'local', link: o.link || '', no: o.no || '',
      roomId: o.roomId || '', batch: o.batch || '',
      type: o.type || '', note: (o.note === 0 || o.noNote || o.type === 'plan') ? 0 : 1,
      text: o.text || '',
      start: start.getTime(), end: end, day: start,
      base: false
    };
  }
  function allLessons() {
    var out = [], seen = {};
    /* 只认自己排的课：内置课表已清空，删课直接从这里移除 */
    (S.local || []).forEach(function (o) {
      var l = norm(o, 'local');
      if (seen[l.key]) return;
      seen[l.key] = 1; out.push(l);
    });
    out.sort(function (a, b) { return a.start - b.start; });
    return out;
  }
  function find(key) { var r = null; allLessons().forEach(function (l) { if (l.key === key) r = l; }); return r; }
  function linkOf(l) {
    if (l.link) return l.link;
    return l.src === 'amazing' ? (S.set.linkAT || DEF_AT) : (S.set.linkLocal || '');
  }

  /* ---------- 渲染 ---------- */
  function renderSub() {
    var list = allLessons();
    $('ttSub').textContent = '共 ' + list.length + ' 节 · 点课表空白处排课 · 点课块进教室 · 右键单删 / 「批量管理」多选删除';
  }

  function renderNav() {
    var mon = viewMon, sun = addDays(mon, 6);
    var diff = weekDiff(mon, new Date());
    var note = diff === 0 ? '本周' : (diff === 1 ? '下周' : (diff === -1 ? '上周' : (diff > 0 ? diff + ' 周后' : (-diff) + ' 周前')));
    $('wRange').textContent = (mon.getMonth() + 1) + '/' + mon.getDate() + ' – ' + (sun.getMonth() + 1) + '/' + sun.getDate();
    $('wNote').textContent = note;

    var now = Date.now(), nx = null;
    allLessons().forEach(function (l) { if (!nx && l.end > now && l.note !== 0) nx = l; });
    if (!nx) { $('wNext').textContent = '这一期已经上完了'; }
    else {
      var kd = kindOf(nx.k);
      $('wNext').textContent = '下一节 · 周' + WD[(nx.day.getDay() + 6) % 7] + ' ' +
        (nx.day.getMonth() + 1) + '/' + nx.day.getDate() + ' ' + clock(nx.h, nx.m) + ' ' + kd.full;
    }
  }

  function renderGrid() {
    var days = [], i;
    for (i = 0; i < 7; i++) days.push(addDays(viewMon, i));
    var isoDays = days.map(isoOf);
    var byDay = {};
    allLessons().forEach(function (l) { if (isoDays.indexOf(l.iso) >= 0) (byDay[l.iso] = byDay[l.iso] || []).push(l); });

    var todayIso = isoOf(new Date()), now = Date.now();
    var head = '<div class="wkh-cell gut"></div>';
    days.forEach(function (d, idx) {
      head += '<div class="wkh-cell' + (isoOf(d) === todayIso ? ' today' : '') + '">' +
        '<b>周' + WD[idx] + '</b><span>' + (d.getMonth() + 1) + '/' + d.getDate() + '</span></div>';
    });

    var gut = '';
    for (var h = START_H; h < END_H; h++) gut += '<div class="hrow"><span>' + pad(h) + ':00</span></div>';
    gut += '<div class="hrow last"><span>' + pad(END_H) + ':00</span></div>';

    var cols = '';
    days.forEach(function (d, di) {
      var key = isoOf(d), evs = byDay[key] || [], html = '';
      evs.forEach(function (l, idx) {
        var top = ((l.h * 60 + l.m) - START_H * 60) / 60 * ROWH;
        var hgt = Math.max(26, l.dur / 60 * ROWH - 4);
        if (top < 0) { hgt += top; top = 0; }
        var running = now >= l.start && now <= l.end;
        var past = l.end < now;
        var kd = kindOf(l.k);
        var pal = kd.pal
          ? ';--kbg:' + kd.pal.bg + ';--kbar:' + kd.pal.bar + ';--kink:' + kd.pal.ink + ';--ksub:' + kd.pal.sub
          : '';
        var tip = kd.full + ' · ' + clock(l.h, l.m) + '–' + endClock(l) +
          (l.no ? ' · 会议号 ' + l.no : '') + (l.text ? ' · ' + l.text : '') +
          (l.note === 0 ? ' · 计划，不录音' : ' · 点一下进教室');
        html += '<button class="wev k-' + kd.c + (running ? ' live' : '') + (past ? ' past' : '') +
          (mgrOn && mgrSel[l.key] ? ' sel' : '') + '"' +
          ' style="top:' + top + 'px;height:' + Math.max(24, hgt) + 'px;left:' + (idx * 6) + 'px' + pal + '" data-k="' + l.key + '"' +
          ' title="' + esc(tip) + '">' +
          '<span class="wt">' + clock(l.h, l.m) + '</span>' +
          '<span class="wn">' + esc(l.k) + '</span>' +
          (l.t ? '<span class="wc">' + esc(l.t) + '</span>' : '') +
          '<span class="ws">' + (l.note === 0 ? '计划' : (l.src === 'amazing' ? 'AT' : '自排')) + '</span>' +
          '</button>';
      });
      var nowLine = '';
      if (key === todayIso) {
        var n = new Date(), mins = n.getHours() * 60 + n.getMinutes();
        if (mins >= START_H * 60 && mins <= END_H * 60) {
          nowLine = '<div class="nowline" style="top:' + ((mins - START_H * 60) / 60 * ROWH) + 'px"></div>';
        }
      }
      cols += '<div class="wkg-col' + (key === todayIso ? ' today' : '') + '" data-day="' + di + '">' +
        html + nowLine + '</div>';
    });

    $('wk').innerHTML = '<div class="wkh">' + head + '</div>' +
      '<div class="wkg"><div class="wkg-gut">' + gut + '</div>' + cols + '</div>';
  }

  /* ---------- 时间显示工具 ---------- */
  function endClock(l) { var d = new Date(l.end); return clock(d.getHours(), d.getMinutes()); }

  function renderAll() { renderSub(); renderNav(); renderGrid(); }

  /* ---------- 点课 → 进教室（随时可点） ---------- */
  function openLesson(key) {
    var l = find(key); if (!l) return;
    /* 「其他计划」只占课表，不进教室、也不录音 */
    if (l.note === 0 || l.type === 'plan') {
      toast(l.k + (l.text ? '：' + l.text : '') + '　这是计划，不进教室、也不录音');
      return;
    }
    var u = linkOf(l);
    if (!u) {
      toast('这节课还没设会议链接，去「🏫 上课教室」给这种课指定一个');
      renderRooms(); $('roomMask').classList.add('on');
      return;
    }
    try { window.open(u, '_blank', 'noopener'); } catch (e) { location.href = u; }
    toast('正在打开「' + l.k + '」的教室' + (l.no ? ' · 会议号 ' + l.no : '') +
      '　到上课时间会自动开始记笔记（设置里可关）');
    /* 录音由全站守护脚本按课表时间自动开始，不需要点、也不需要会议室链接 */
  }

  /* ---------- 教室：多个会议链接 + 会议号 ---------- */
  function roomOf(id) {
    for (var i = 0; i < S.rooms.length; i++) if (S.rooms[i].id === id) return S.rooms[i];
    return null;
  }
  function roomForType(tid) { return roomOf(S.bindings[tid] || typeOf(tid).room); }

  function renderRoomBind() {
    var opts = '<option value="">（不进教室）</option>' + S.rooms.map(function (r) {
      return '<option value="' + esc(r.id) + '">' + esc(r.name || '未命名教室') + '</option>';
    }).join('');
    $('roomBind').innerHTML = TYPES.filter(function (t) { return t.id !== 'plan'; }).map(function (t) {
      return '<label>' + esc(t.k) + '<select data-t="' + t.id + '">' + opts + '</select></label>';
    }).join('');
    [].forEach.call($('roomBind').querySelectorAll('select'), function (sel) {
      sel.value = S.bindings[sel.getAttribute('data-t')] || '';
    });
  }
  function renderRooms() {
    $('roomList').innerHTML = S.rooms.length ? S.rooms.map(function (r) {
      return '<div class="room-row" data-id="' + esc(r.id) + '">' +
        '<input class="rm-name" data-f="name" value="' + esc(r.name) + '" placeholder="教室名">' +
        '<input class="rm-link" data-f="link" value="' + esc(r.link) + '" placeholder="会议链接">' +
        '<input class="rm-no" data-f="no" value="' + esc(r.no) + '" placeholder="会议号">' +
        '<button class="rm-del" type="button" title="删掉这个教室">×</button></div>';
    }).join('') : '<p class="room-empty">还没有教室，在下面加一个。</p>';
    renderRoomBind();
  }
  function addRoom() {
    var name = $('rmName').value.trim(), link = $('rmLink').value.trim(), no = $('rmNo').value.trim();
    if (!name && !link) { $('roomMsg').textContent = '至少填个教室名或会议链接'; return; }
    S.rooms.push({ id: 'r' + Date.now().toString(36) + Math.floor(Math.random() * 1000),
      name: name || '新教室', link: link, no: no });
    $('rmName').value = ''; $('rmLink').value = ''; $('rmNo').value = '';
    save(); renderRooms();
    $('roomMsg').textContent = '已添加教室，在下面给课程类型选上它。';
  }
  function delRoom(id) {
    S.rooms = S.rooms.filter(function (r) { return r.id !== id; });
    Object.keys(S.bindings).forEach(function (t) { if (S.bindings[t] === id) S.bindings[t] = ''; });
    save(); renderRooms();
  }

  /* ---------- 点课表空白处 → 排课 / 排计划 ---------- */
  var cfType = 'oral', cfMode = 'one', cfDates = [];

  function copyMeetingLink(u, quiet) {
    if (!u) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(u).then(function () {
          if (!quiet) toast('会议链接 / 会议号已复制');
        }).catch(function () { });
      }
    } catch (e) { }
  }

  function cfSetType(t) {
    cfType = t;
    [].forEach.call($('cfKinds').querySelectorAll('.kchip'), function (b) {
      b.classList.toggle('on', b.getAttribute('data-type') === t);
    });
    var ty = typeOf(t), isPlan = t === 'plan', r = roomForType(t);
    $('cfName').value = ty.k;
    $('cfLinkRow').hidden = isPlan;
    $('cfNoRow').hidden = isPlan;
    $('cfRoomRow').hidden = isPlan;
    $('cfTextRow').hidden = !isPlan;
    $('cfLink').value = isPlan ? '' : (r && r.link ? r.link : '');
    $('cfNo').value = isPlan ? '' : (r && r.no ? r.no : '');
    $('cfRoom').textContent = isPlan ? '' : (r
      ? (r.name || '未命名教室') + (r.no ? ' · 会议号 ' + r.no : '')
      : '还没给这种课指定教室，去「🏫 上课教室」选一个');
    $('cfNote').textContent = isPlan
      ? '自定义学习计划：只占课表提醒你，不进教室、也不自动录音。内容随便写，比如背单词、做题、复盘。'
      : '到「开始」自动录音、到「结束」自动停并生成 AI 笔记；点课块直接进「' +
        (r ? (r.name || '会议教室') : '会议教室') + '」。录的是这台 Mac 麦克风的声音，所以要在这台 Mac 的 Chrome 里上课（声音外放、别戴耳机）。';
    $('cfFoot').textContent = isPlan ? '计划不录音' : '自动录音 + 自动生成笔记，链接 / 会议号已带好';
  }

  function cfSetMode(m) {
    cfMode = m;
    [].forEach.call($('cfModes').querySelectorAll('.kchip'), function (b) {
      b.classList.toggle('on', b.getAttribute('data-mode') === m);
    });
    $('cfOneRow').hidden = m !== 'one';
    $('cfMultiRow').hidden = m !== 'multi';
    $('cfDailyRow').hidden = m !== 'daily';
  }
  function cfRenderDates() {
    $('cfDates').innerHTML = cfDates.length ? cfDates.map(function (d) {
      return '<button class="cf-date" type="button" data-d="' + d + '">' + d + ' ×</button>';
    }).join('') : '<span class="cf-tip">还没加日期</span>';
  }
  function cfCollectDates() {
    if (cfMode === 'one') return $('cfD').value ? [$('cfD').value] : [];
    if (cfMode === 'multi') return cfDates.slice();
    var a = $('cfFrom').value, b = $('cfTo').value;
    if (!a || !b) return [];
    var out = [], d = at(a, 0, 0), end = at(b, 0, 0);
    for (var i = 0; d <= end && i < 90; i++) { out.push(isoOf(d)); d = addDays(d, 1); }
    return out;
  }

  function openCell(dayIdx, startMin) {
    var d = addDays(viewMon, dayIdx);
    var s = startMin == null
      ? Math.max(START_H, Math.min(END_H - 1, new Date().getHours() + 1)) * 60 : startMin;
    if (s < START_H * 60) s = START_H * 60;
    if (s > END_H * 60 - 15) s = END_H * 60 - 15;
    var e = Math.min(END_H * 60, s + 60);
    var iso = isoOf(d);
    $('cfD').value = iso;
    $('cfDatePick').value = iso;
    $('cfFrom').value = iso;
    $('cfTo').value = isoOf(addDays(d, 6));
    $('cfS').value = clock(Math.floor(s / 60), s % 60);
    $('cfE').value = clock(Math.floor(e / 60), e % 60);
    $('cfText').value = '';
    cfDates = []; cfRenderDates();
    cfSetMode('one');
    cfSetType('oral');
    $('cellMask').classList.add('on');
    setTimeout(function () { try { $('cfS').focus(); } catch (err) { } }, 60);
  }

  function cfSubmit() {
    var s = $('cfS').value, e = $('cfE').value, dates = cfCollectDates();
    if (!dates.length) { toast('先选日期，或设好「每天都有」的范围'); return; }
    if (!s || !e) { toast('把开始 / 结束时间填全'); return; }
    var p = s.split(':'), q = e.split(':');
    var h = +p[0], mm = +p[1], eh = +q[0], em = +q[1];
    var dur = (eh * 60 + em) - (h * 60 + mm);
    if (dur <= 0) dur += 1440;
    if (dur > 360) { toast('结束时间要在开始之后，且不超过 6 小时'); return; }
    var isPlan = cfType === 'plan', ty = typeOf(cfType), r = roomForType(cfType);
    var name = cleanKind($('cfName').value || ty.k);
    var link = isPlan ? '' : $('cfLink').value.trim();
    var no = isPlan ? '' : $('cfNo').value.trim();
    var batch = 'b' + Date.now().toString(36);
    var added = 0, skipped = 0;
    dates.forEach(function (d) {
      var key = d + ' ' + clock(h, mm);
      if (find(key)) { skipped++; return; }
      S.local.push({
        d: d, h: h, m: mm, dur: dur, eh: eh, em: em,
        k: name, t: '', src: 'local', link: link, no: no,
        roomId: r ? r.id : '', batch: batch,
        type: cfType, note: isPlan ? 0 : 1,
        text: isPlan ? $('cfText').value.trim() : ''
      });
      added++;
    });
    if (!added) { toast('这些日期在这个时间都已排了课，没有新增'); return; }
    save(); renderAll();
    $('cellMask').classList.remove('on');
    if (link) copyMeetingLink(link + (no ? '\n会议号：' + no : ''), true);
    toast('排好 ' + added + ' 节' + (skipped ? '（' + skipped + ' 个日期已有课，跳过）' : '') +
      (isPlan ? '，计划不录音' : '，到点自动录音、下课生成笔记'));
  }

  /* ---------- 删除：单个 / 整批 / 多选 ---------- */
  var mgrOn = false, mgrSel = {}, ctxKey = '';

  function delKeys(keys) {
    if (!keys.length) return 0;
    S.local = S.local.filter(function (o) {
      return keys.indexOf(o.d + ' ' + clock(o.h, o.m)) < 0;
    });
    save(); renderAll();
    return keys.length;
  }
  function delLesson(key) {
    var l = find(key); if (!l) return;
    delKeys([key]);
    toast('已删除 ' + l.k + '（' + l.iso + ' ' + clock(l.h, l.m) + '）');
  }
  function delBatch(batch) {
    if (!batch) { toast('这节不是批量生成的，用「删除这一节」'); return; }
    var keys = S.local.filter(function (o) { return o.batch === batch; })
      .map(function (o) { return o.d + ' ' + clock(o.h, o.m); });
    toast('已删除这一批 ' + delKeys(keys) + ' 节');
  }
  function mgrToggle(on) {
    mgrOn = on; mgrSel = {};
    $('mgrBar').hidden = !on;
    $('mgrBtn').textContent = on ? '退出批量' : '批量管理';
    mgrUpdate(); renderGrid();
  }
  function mgrUpdate() {
    $('mgrCnt').textContent = '已选 ' + Object.keys(mgrSel).length + ' 节';
  }

  /* ---------- 声音 ---------- */
  var ac = null, musicGain = null, musicT = null;
  function ensureAudio() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ac) { try { ac = new AC(); } catch (e) { return null; } }
    if (ac.state === 'suspended') ac.resume();
    return ac;
  }
  function midi(n) { return 440 * Math.pow(2, (n - 69) / 12); }
  function bell(ctx, dest, freq, t, decay, vol) {
    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    g.connect(dest);
    var o1 = ctx.createOscillator(); o1.type = 'sine'; o1.frequency.value = freq;
    o1.connect(g); o1.start(t); o1.stop(t + decay + 0.05);
    var g2 = ctx.createGain(); g2.gain.value = 0.26;
    var o2 = ctx.createOscillator(); o2.type = 'sine'; o2.frequency.value = freq * 2.01;
    o2.connect(g2); g2.connect(g); o2.start(t); o2.stop(t + decay * 0.7);
  }
  /* 八音盒式的轻音乐：Am - F - C - G 分解和弦 */
  function playMusic(seconds) {
    var ctx = ensureAudio();
    if (!ctx) return;
    stopMusic();
    var master = ctx.createGain();
    var t0 = ctx.currentTime + 0.06;
    master.gain.setValueAtTime(0.0001, t0);
    master.gain.exponentialRampToValueAtTime(0.42, t0 + 1.1);
    var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 3200; lp.Q.value = 0.4;
    master.connect(lp); lp.connect(ctx.destination);
    musicGain = master;

    var prog = [[69, 72, 76, 81], [65, 69, 72, 77], [72, 76, 79, 84], [67, 71, 74, 79]];
    var bar = 2.15, secs = seconds || 10;
    var rounds = Math.max(1, Math.round(secs / (bar * 4)));
    for (var r = 0; r < rounds; r++) {
      for (var bi = 0; bi < prog.length; bi++) {
        var ch = prog[bi], bt = t0 + (r * prog.length + bi) * bar;
        for (var i = 0; i < ch.length; i++) bell(ctx, master, midi(ch[i]), bt + i * 0.17, 2.0, 0.17);
        bell(ctx, master, midi(ch[0] - 12), bt, 1.7, 0.05);
      }
    }
    var total = rounds * prog.length * bar;
    master.gain.setValueAtTime(0.42, t0 + total - 2.4);
    master.gain.exponentialRampToValueAtTime(0.0001, t0 + total - 0.08);
    musicT = setTimeout(function () { musicGain = null; }, (total + 0.3) * 1000);
  }
  function stopMusic() {
    clearTimeout(musicT);
    if (musicGain && ac) {
      try {
        musicGain.gain.cancelScheduledValues(ac.currentTime);
        musicGain.gain.setValueAtTime(musicGain.gain.value || 0.0001, ac.currentTime);
        musicGain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.5);
      } catch (e) { }
      musicGain = null;
    }
  }

  var audioEl = null;
  function speak(text) {
    if (!window.speechSynthesis || !S.set.speak) return;
    try { speechSynthesis.cancel(); } catch (e) { }
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN'; u.rate = 0.98; u.pitch = 1.06;
    var vs = speechSynthesis.getVoices() || [];
    for (var i = 0; i < vs.length; i++) {
      if (/zh[-_]CN/i.test(vs[i].lang) && /Xiaoxiao|Xiaoyi|Tingting|Huihui|Yaoyao|Meijia/i.test(vs[i].name)) { u.voice = vs[i]; break; }
    }
    speechSynthesis.speak(u);
  }
  function voiceKey(l) {
    var lead = parseInt(S.set.lead, 10);
    if ([5, 10, 15, 30].indexOf(lead) < 0) return null;
    if (kindOf(l.k).custom) return null;   /* 自己起的课名，用合成语音念名字，别放「雅思课」的录音 */
    if (lead === 5 && l.k === '雅阅') return '5yd';
    if (lead === 5 && l.k === '雅写') return '5yw';
    return String(lead);
  }
  function playVoice(key, fallback) {
    if (!S.set.speak) return;
    if (!key) { speak(fallback); return; }
    try {
      if (audioEl) { audioEl.pause(); audioEl = null; }
      audioEl = new Audio('assets/audio/' + key + '.mp3');
      audioEl.volume = 1;
      audioEl.addEventListener('error', function () { speak(fallback); });
      var p = audioEl.play();
      if (p && p.catch) p.catch(function () { speak(fallback); });
    } catch (e) { speak(fallback); }
  }

  /* ---------- 提醒 ---------- */
  function fire(l, isStart) {
    var kd = kindOf(l.k);
    var key = isStart ? l.key + '@start' : l.key + '@' + S.set.lead;
    if (S.alerted[key]) return;
    S.alerted[key] = 1; save();

    $('ringTitle').textContent = isStart ? '上课啦' : '该上课了';
    $('ringSub').textContent = isStart
      ? kd.full + ' 现在开始，点下面直接进教室。'
      : '还有 ' + S.set.lead + ' 分钟就要上' + kd.full + '，' + clock(l.h, l.m) + ' 开始，准备进教室。';
    $('ringJoin').href = linkOf(l) || '#';
    $('ringMask').classList.add('on');

    if (S.set.music) playMusic(isStart ? 14 : 16);
    if (S.set.speak) {
      setTimeout(function () {
        playVoice(isStart ? 'start' : voiceKey(l),
          (isStart ? '上课时间到了，我们开始吧。' : '还有' + S.set.lead + '分钟就要上' + kd.say + '了，请准备好进入教室。'));
      }, 1100);
    }
    if (S.set.notify && 'Notification' in window && Notification.permission === 'granted') {
      try { new Notification(isStart ? '上课啦' : '该上课了', { body: $('ringSub').textContent, tag: 'ielts' }); } catch (e) { }
    }
  }
  function check() {
    var now = Date.now(), lead = parseInt(S.set.lead, 10) * 60000;
    allLessons().forEach(function (l) {
      var d = l.start - now;
      if (d <= lead && d > -60000) fire(l, false);
      if (now >= l.start && now < l.start + 60000) fire(l, true);
      /* 自动记笔记由全站守护脚本 assets/auto-note.js 负责（任意标签页开着都行） */
    });
  }

  /* ---------- 解析：自然语言排课 ---------- */
  function findClocks(text) {
    var out = [], re = /(\d{1,2})\s*(?:[:：]\s*(\d{2})|点\s*(半|\d{1,2})?|时\s*(\d{1,2})?)/g, m;
    while ((m = re.exec(text))) {
      var h = parseInt(m[1], 10), mi = 0;
      if (m[2] != null) mi = parseInt(m[2], 10);
      else if (m[3] === '半') mi = 30;
      else if (m[3]) mi = parseInt(m[3], 10);
      else if (m[4]) mi = parseInt(m[4], 10);
      if (h > 23 || mi > 59) continue;
      var before = text.slice(Math.max(0, m.index - 6), m.index);
      if (/(下午|晚上|傍晚|夜里)/.test(before) && h < 12) h += 12;
      else if (/中午/.test(before) && h < 11) h += 12;
      else if (!/(上午|早上|早晨|清晨)/.test(before) && h >= 1 && h <= 6) h += 12;
      out.push({ h: h, m: mi, i: m.index });
    }
    return out;
  }

  /* 课程名归一：常见说法并成五种，其余原样保留（外教课、陪练课…） */
  function normName(n) {
    var s = String(n == null ? '' : n).replace(/\s+/g, '').trim();
    if (!s) return '雅思';
    var M = {
      '雅思': '雅思', '雅思课': '雅思', 'ielts': '雅思', 'ielts课': '雅思',
      '雅阅': '雅阅', '阅读': '雅阅', '阅读课': '雅阅', '雅思阅读': '雅阅', '雅思阅读课': '雅阅',
      '雅写': '雅写', '写作': '雅写', '写作课': '雅写', '雅思写作': '雅写', '雅思写作课': '雅写',
      '口语': '口语', '口语课': '口语', '雅思口语': '口语', '雅思口语课': '口语',
      '听力': '听力', '听力课': '听力', '雅思听力': '听力', '雅思听力课': '听力'
    };
    var low = s.toLowerCase();
    if (M[s]) return M[s];
    if (M[low]) return M[low];
    return s.slice(0, 12);
  }

  /* 一句话里的课程名：把日期/星期/时间/时长/虚词全剃掉，剩下的就是名字 */
  function courseName(text) {
    var s = String(text || '');
    s = s.replace(/https?:\/\/[^\s，,。；;）)】]+/gi, ' ');
    s = s.replace(/\d{4}\s*[-\/年.]\s*\d{1,2}\s*[-\/月.]\s*\d{1,2}\s*[日号]?/g, ' ');
    s = s.replace(/\d{1,2}\s*月\s*\d{1,2}\s*[日号]?/g, ' ');
    s = s.replace(/\d{1,2}\s*\/\s*\d{1,2}(?!\d)/g, ' ');
    s = s.replace(/(?:周|星期|礼拜)\s*[一二三四五六日天1-7](?:\s*[、,，和及与]\s*[一二三四五六日天1-7])*/g, ' ');
    s = s.replace(/(?:今天|明天|后天|大后天|今晚|明晚|今早|明早)/g, ' ');
    s = s.replace(/(?:每|下|这|上)?(?:周|星期|礼拜)/g, ' ');
    s = s.replace(/\d{1,2}\s*[:：]\s*\d{2}\s*(?:[-–—~至]\s*\d{1,2}\s*[:：]\s*\d{2})?/g, ' ');
    s = s.replace(/\d{1,2}\s*点\s*(?:半|\d{1,2}\s*分?)?/g, ' ');
    s = s.replace(/\d{1,2}\s*时\s*(?:半|\d{1,2}\s*分?)?/g, ' ');
    s = s.replace(/(?:上午|下午|晚上|中午|早上|早晨|清晨|傍晚|夜里|凌晨)/g, ' ');
    s = s.replace(/\d+(?:\.\d+)?\s*(?:个)?\s*(?:小时|钟头|h)\s*(?:\d{1,2}\s*分)?/gi, ' ');
    s = s.replace(/\d{2,3}\s*(?:分钟|分|min)/gi, ' ');
    s = s.replace(/[，,。；;：:、（）()【】\[\]「」“”"'·\-—–~至从到]/g, ' ');
    s = s.replace(/每|各|约|共|一共|左右|上课|排课|安排|开始|结束|一个|一节|节|的|了|在|有|要|和|跟|与|去/g, ' ');
    s = s.replace(/\s+/g, '').replace(/^(?:要|去|上|来)/, '');
    if (/^(课|节|有课)$/.test(s)) return '';
    return s;
  }

  /* 一行里的课程名：像「11月17日 周一 12:45-13:45 外教课」就取「外教课」 */
  function nameFromLine(s) {
    var nm = courseName(s).replace(/[A-Za-z]+$/, '');
    if (!nm || nm.length > 8) return '';
    if (!/[\u4e00-\u9fff]/.test(nm)) return '';
    if (/会议|腾讯|教室|链接|地址|备注|老师|教师|学生|课表|课程表|安排|时间|日期|我的/.test(nm)) return '';
    return nm;
  }

  function parsePlan(text) {    var t = String(text || '').replace(/\u3000/g, ' ').trim();
    var res = { items: [], warn: [], link: '' };
    if (!t) { res.warn.push('先写一句，比如「每周三 12 点半，50 分钟」。'); return res; }
    res.link = (t.match(/https?:\/\/[^\s，,。；;）)】]+/) || [''])[0];

    /* 课程名：先说名字，说不出来就按雅思 */
    var nm = courseName(t);
    var k = '雅思';
    if (nm && nm.length <= 10 && !/\d/.test(nm)) k = normName(nm);

    var dur = 0;
    var mh = t.match(/(\d+(?:\.\d+)?)\s*(?:个)?\s*(?:小时|h)\s*(?:(\d{1,2})\s*分)?/i);
    if (mh) dur = Math.round(parseFloat(mh[1]) * 60) + (mh[2] ? parseInt(mh[2], 10) : 0);
    if (!dur) { var mm2 = t.match(/(\d{2,3})\s*(?:分钟|min)/); if (mm2) dur = parseInt(mm2[1], 10); }

    var clocks = findClocks(t);
    if (clocks.length >= 2 && !dur) {
      var a = clocks[0], b = clocks[1];
      var d2 = (b.h * 60 + b.m) - (a.h * 60 + a.m);
      if (d2 > 0 && d2 <= 300) dur = d2;
    }
    if (!dur) dur = 60;
    if (!clocks.length) { res.warn.push('没看出几点，写个「12:30」或「12 点半」就行。'); return res; }
    var hh = clocks[0].h, mmn = clocks[0].m;

    var dow = [], reD = /(?:周|星期|礼拜)([一二三四五六日天1-7])/g, md;
    while ((md = reD.exec(t))) { var c = CN[md[1]]; if (c && dow.indexOf(c) < 0) dow.push(c); }

    var date = null, yr = new Date().getFullYear();
    var d1 = t.match(/(\d{4})\s*[-\/年.]\s*(\d{1,2})\s*[-\/月.]\s*(\d{1,2})/);
    var d2 = t.match(/(\d{1,2})\s*月\s*(\d{1,2})\s*[日号]/);
    var d3 = t.match(/(\d{1,2})\s*\/\s*(\d{1,2})(?!\d)/);
    if (d1) date = d1[1] + '-' + pad(+d1[2]) + '-' + pad(+d1[3]);
    else if (d2) date = yr + '-' + pad(+d2[1]) + '-' + pad(+d2[2]);
    else if (d3 && !dow.length) date = yr + '-' + pad(+d3[1]) + '-' + pad(+d3[2]);

    if (date) {
      res.items.push({ d: date, h: hh, m: mmn, dur: dur, k: k, t: '', src: 'local', link: res.link });
      return res;
    }
    if (!dow.length) {
      var n = new Date();
      if (clocks[0].h * 60 + clocks[0].m < n.getHours() * 60 + n.getMinutes()) n = addDays(n, 1);
      res.items.push({ d: isoOf(n), h: hh, m: mmn, dur: dur, k: k, t: '', src: 'local', link: res.link });
      return res;
    }
    var ws = mondayOf(new Date()), today = new Date(new Date().setHours(0, 0, 0, 0));
    for (var w = 0; w < 12; w++) {
      for (var i2 = 0; i2 < dow.length; i2++) {
        var dd = addDays(ws, w * 7 + (dow[i2] - 1));
        if (dd < today) continue;
        res.items.push({ d: isoOf(dd), h: hh, m: mmn, dur: dur, k: k, t: '', src: 'local', link: res.link });
      }
    }
    return res;
  }

  /* ---------- 解析：整段文本 / OCR ----------
     要能应付 OCR 的几种真实输出：
     · 日期和时间在同一行：11月17日 12:45-13:45 外教课
     · 日期表头 + 时间列（表格图）：第一行「11月17日11月18日11月19日」粘成一坨，下面按行给时间
     · 同步粘来的文字：2026/12/08 12:45-13:45
  */
  /* ---------- 周几 / 时间 ---------- */
  var WD_CN = { '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '日': 7, '天': 7, '七': 7 };
  var WD_EN = { mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6, sun: 7 };

  /* 一行里的周几：周一 / 星期三 / 礼拜天 / Mon / Tuesday */
  function weekdayOf(s) {
    var m = s.match(/(?:周|星期|礼拜)\s*([一二三四五六日天七1-7])/);
    if (m) return /\d/.test(m[1]) ? +m[1] : (WD_CN[m[1]] || 0);
    m = s.match(/\b(mon|tue|wed|thu|fri|sat|sun)[a-z]*\b/i);
    if (m) return WD_EN[m[1].toLowerCase().slice(0, 3)] || 0;
    return 0;
  }

  /* 周几 → 具体日期：今天或之后最近的那一天（周表直接能进课表） */
  function dateOfWeekday(w) {
    var now = new Date();
    var today = now.getDay() === 0 ? 7 : now.getDay();
    var diff = (w - today + 7) % 7;
    var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diff);
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  /* 读时间：12:45-13:45 / 9:00 / 12点半 / 下午3点 / 晚上8点15 */
  function readTime(s) {
    var m = s.match(/(\d{1,2})\s*[:：]\s*(\d{1,2})\s*[-–—~至到]\s*(\d{1,2})\s*[:：]\s*(\d{1,2})/);
    if (m) {
      var dur = (+m[3] * 60 + +m[4]) - (+m[1] * 60 + +m[2]);
      if (dur <= 0 || dur > 300) dur = 60;
      return { h: +m[1], m: +m[2], dur: dur };
    }
    m = s.match(/(\d{1,2})\s*[:：]\s*(\d{1,2})/);
    if (m && +m[1] < 24 && +m[2] < 60) return { h: +m[1], m: +m[2], dur: 60 };

    m = s.match(/(上午|早上|下午|晚上|中午)?\s*(\d{1,2})\s*[点時时]\s*(半|\d{1,2})?/);
    if (m) {
      var h = +m[2], mi = m[3] === '半' ? 30 : (m[3] ? +m[3] : 0);
      var ap = m[1] || '';
      if ((ap === '下午' || ap === '晚上') && h < 12) h += 12;
      if (ap === '中午' && h < 11) h += 12;
      if (!ap && h <= 6) h += 12;   /* 没写上下午的「3点」，排课按下午算 */
      if (h < 24 && mi < 60) return { h: h, m: mi, dur: 60 };
    }
    return null;
  }

  function parseAny(text, defK) {
    var year = new Date().getFullYear(), out = [];
    var fixed = defK ? cleanKind(defK) : '';

    /* 先扫一遍，把「日期表头」里粘连的多个日期拆出来：
       「11月17日11月18日11月19日」→ [11-17, 11-18, 11-19] */
    function allDates(s) {
      var arr = [], re = /(\d{1,2})\s*月\s*(\d{1,2})\s*[日号]/g, m;
      while ((m = re.exec(s))) {
        var mm = +m[1], dd = +m[2];
        if (mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) arr.push(year + '-' + pad(mm) + '-' + pad(dd));
      }
      /* 也认 11/17 这种 */
      var re2 = /(\d{1,2})\s*\/\s*(\d{1,2})(?!\d)/g;
      while ((m = re2.exec(s))) {
        var a = +m[1], b = +m[2];
        if (a >= 1 && a <= 12 && b >= 1 && b <= 31) arr.push(year + '-' + pad(a) + '-' + pad(b));
      }
      /* 认 2026-11-17 / 2026/11/17 */
      var re3 = /(\d{4})\s*[-\/年.]\s*(\d{1,2})\s*[-\/月.]\s*(\d{1,2})/g;
      while ((m = re3.exec(s))) {
        arr.push(m[1] + '-' + pad(+m[2]) + '-' + pad(+m[3]));
      }
      return arr;
    }

    var lines = String(text || '').split(/[\r\n]+/).filter(function (x) { return x.trim(); });
    var cur = null;
    lines.forEach(function (ln, li) {
      var s = ln.replace(/\s+/g, ' ').trim();
      if (!s) return;

      /* 单行里的日期（可能多个）；没有日期就看周几 */
      var ds = allDates(s);
      if (ds.length >= 1) cur = ds[0];
      else {
        var wd = weekdayOf(s);
        if (wd) cur = dateOfWeekday(wd);
      }

      var k = fixed || '雅思';
      if (!fixed) {
        var lineK = nameFromLine(s);
        if (lineK) k = normName(lineK);
        else if (/阅读|雅阅/.test(s)) k = '雅阅';
        else if (/写作|雅写/.test(s)) k = '雅写';
        else if (/口语/.test(s)) k = '口语';
        else if (/听力/.test(s)) k = '听力';
      }

      var tm = readTime(s);
      if (!tm || !cur) return;

      /* 时长可以单独说：50分钟 / 1.5小时 */
      var dur = tm.dur;
      var dm = s.match(/(\d{1,3})\s*分(?:钟)?/);
      if (dm && +dm[1] >= 15 && +dm[1] <= 300) dur = +dm[1];
      var hm = s.match(/(\d(?:\.\d)?)\s*(?:个)?\s*小时/);
      if (hm) dur = Math.round(parseFloat(hm[1]) * 60);

      out.push({ d: cur, h: tm.h, m: tm.m, dur: dur, k: k, t: '', src: 'local', link: '' });
    });
    return out;
  }

  function parseICS(txt) {
    var out = [];
    String(txt).split(/BEGIN:VEVENT/i).slice(1).forEach(function (b) {
      function get(k) {
        var m = b.match(new RegExp('^' + k + '[^:\\r\\n]*[:;]([^\\r\\n]*)', 'im'));
        return m ? m[1].trim() : '';
      }
      var ds = get('DTSTART'); if (!ds) return;
      var mm = ds.match(/(\d{4})(\d{2})(\d{2})T?(\d{2})?(\d{2})?/); if (!mm) return;
      var y = +mm[1], mo = +mm[2], d = +mm[3], hh = mm[4] ? +mm[4] : 0, mi = mm[5] ? +mm[5] : 0;
      if (/Z$/i.test(ds)) {
        var bj = new Date(Date.UTC(y, mo - 1, d, hh, mi) + 8 * 3600 * 1000);
        y = bj.getUTCFullYear(); mo = bj.getUTCMonth() + 1; d = bj.getUTCDate();
        hh = bj.getUTCHours(); mi = bj.getUTCMinutes();
      }
      var dur = 60, de = get('DTEND');
      if (de) {
        var m2 = de.match(/(\d{4})(\d{2})(\d{2})T?(\d{2})?(\d{2})?/);
        if (m2) {
          var u1 = Date.UTC(y, mo - 1, d, hh, mi);
          var u2 = Date.UTC(+m2[1], +m2[2] - 1, +m2[3], m2[4] ? +m2[4] : 0, m2[5] ? +m2[5] : 0);
          var dd = Math.round((u2 - u1) / 60000);
          if (dd > 0 && dd <= 300) dur = dd;
        }
      }
      var lk = ((get('DESCRIPTION') + ' ' + get('LOCATION') + ' ' + get('URL')).match(/https?:\/\/[^\s，,。；;）)】"\\]+/) || [''])[0];
      var sm = get('SUMMARY'), k = '雅思';
      if (/阅读|雅阅/.test(sm)) k = '雅阅'; else if (/写作|雅写/.test(sm)) k = '雅写';
      else if (/口语/.test(sm)) k = '口语'; else if (/听力/.test(sm)) k = '听力';
      out.push({ d: y + '-' + pad(mo) + '-' + pad(d), h: hh, m: mi, dur: dur, k: k, t: '', src: 'amazing', link: lk });
    });
    return out;
  }

  function mergeInto(list) {
    var seen = {}, add = 0;
    allLessons().forEach(function (l) { seen[l.key] = 1; });
    list.forEach(function (o) {
      var l = norm(o);
      if (seen[l.key]) return;
      seen[l.key] = 1;
      var rdead = S.removed.indexOf(l.key);
      if (rdead >= 0) S.removed.splice(rdead, 1);   /* 重新排回这个时间就复活 */
      S.local.push({ d: l.iso, h: l.h, m: l.m, dur: l.dur, eh: l.eh, em: l.em,
        k: l.k, t: l.t || '', src: o.src || 'local', link: l.link || '' });
      add++;
    });
    S.local.sort(function (a, b) { return (a.d + ' ' + clock(a.h, a.m)) < (b.d + ' ' + clock(b.h, b.m)) ? -1 : 1; });
    save(); renderAll();
    return add;
  }

  /* ---------- 图片 OCR ---------- */
  var TESS_JS = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';
  var TESS_LANG = 'https://cdn.jsdelivr.net/npm/@tesseract.js-data/chi_sim/4.0.0_best_int';
  var ocrRows = [];

  function loadScript(src) {
    return new Promise(function (res, rej) {
      if (window.Tesseract) return res();
      var s = document.createElement('script');
      s.src = src; s.onload = res; s.onerror = function () { rej(new Error('加载失败')); };
      document.head.appendChild(s);
    });
  }

  function ocrMsg(t, cls) {
    var el = $('ocrMsg');
    el.textContent = t;
    el.className = 'hint' + (cls ? ' ' + cls : '');
  }

  function rowEnd(r) {
    if (r.eh != null && r.em != null) return clock(r.eh, r.em);
    var t = r.h * 60 + r.m + (r.dur || 60);
    return clock(Math.floor(t / 60) % 24, t % 60);
  }
  function rowHTML(r, i) {
    return '<div class="orow" data-i="' + i + '">' +
      '<input type="checkbox" class="ock" checked>' +
      '<input type="date" class="od" value="' + r.d + '" aria-label="日期">' +
      '<input type="time" class="ot" value="' + clock(r.h, r.m) + '" aria-label="开始时间">' +
      '<input type="time" class="oe" value="' + rowEnd(r) + '" aria-label="结束时间">' +
      '<input class="ok" maxlength="12" value="' + esc(r.k) + '" list="kindList" aria-label="课程名">' +
      '<span class="ox">' + (r.dur || 60) + ' 分钟</span>' +
      '<button class="odel" title="删掉">×</button>' +
      '</div>';
  }

  function paintRows() {
    $('ocrRows').innerHTML = ocrRows.map(rowHTML).join('');
    var n = ocrRows.length, btn = $('imgOk');
    btn.disabled = !n;
    btn.textContent = n ? ('确认加入课表（' + n + ' 节）') : '确认加入课表';
    $('imgHint').textContent = n
      ? '上面 ' + n + ' 节，取消勾选不想要的，再点右边加入。'
      : '先贴一张课表截图，或在下面手动补一行；有内容后这里就能点。';
  }

  function readRows() {
    var out = [];
    [].forEach.call($('ocrRows').querySelectorAll('.orow'), function (el) {
      if (!el.querySelector('.ock').checked) return;
      var d = el.querySelector('.od').value, t = el.querySelector('.ot').value || '12:45';
      if (!d) return;
      var p = t.split(':'), q = (el.querySelector('.oe').value || rowEnd({ h: +p[0], m: +p[1], dur: 60 })).split(':');
      var dur = (+q[0] * 60 + +q[1]) - (+p[0] * 60 + +p[1]);
      if (dur <= 0) dur += 1440;
      if (dur > 360) dur = 60;
      out.push({
        d: d, h: parseInt(p[0], 10), m: parseInt(p[1], 10),
        dur: dur, eh: +q[0], em: +q[1],
        k: cleanKind(el.querySelector('.ok').value), t: '', src: 'local', link: ''
      });
    });
    return out;
  }

  /* 按列对齐还原表格：拿 OCR 的词坐标判断「哪一列 = 哪一天」 */
  function parseGrid(tsv) {
    var words = [];
    String(tsv || '').split('\n').forEach(function (ln) {
      var p = ln.split('\t');
      if (p.length < 12 || p[0] !== '5') return;
      var t = (p[11] || '').trim();
      if (!t) return;
      var x = +p[6], y = +p[7], w = +p[8], h = +p[9];
      words.push({ t: t, x: x, y: y, w: w, h: h, cx: x + w / 2, cy: y + h / 2 });
    });
    if (words.length < 20) return null;

    var minY = Math.min.apply(null, words.map(function (w) { return w.y; }));
    var title = words.filter(function (w) { return w.y < minY + 40; }).map(function (w) { return w.t; }).join(' ');
    var start = null;
    var m = title.match(/(\d{4})\s*[-\/年.]\s*(\d{1,2})\s*[-\/月.]\s*(\d{1,2})/);
    if (m) start = new Date(+m[1], +m[2] - 1, +m[3]);
    if (!start) { m = title.match(/(\d{1,2})\s*月\s*(\d{1,2})/); if (m) start = new Date(new Date().getFullYear(), +m[1] - 1, +m[2]); }
    if (!start) return null;

    var nums = words.filter(function (w) { return /^\d{1,2}$/.test(w.t) && +w.t >= 1 && +w.t <= 31 && w.h < 28; });
    if (nums.length < 5) return null;

    var ys = [], seenY = {};
    nums.forEach(function (w) { var y = Math.round(w.cy / 6) * 6; if (!seenY[y]) { seenY[y] = 1; ys.push(y); } });
    ys.sort(function (a, b) { return a - b; });
    var bands = [];
    ys.forEach(function (y) {
      if (!bands.length || y - bands[bands.length - 1].max > 18) bands.push({ min: y, max: y });
      else bands[bands.length - 1].max = y;
    });
    if (bands.length < 2) return null;

    var left = Math.min.apply(null, words.map(function (w) { return w.x; }));
    var right = Math.max.apply(null, words.map(function (w) { return w.x + w.w; }));
    var cw = (right - left) / 7;
    function colOf(cx) { return Math.max(0, Math.min(6, Math.floor((cx - left) / cw))); }
    function bandOf(cy) { var bi = -1; bands.forEach(function (b, i) { if (cy >= b.min - 10) bi = i; }); return bi; }

    var hits = nums.map(function (w) { return { n: +w.t, b: bandOf(w.cy), c: colOf(w.cx) }; });
    var best = null;
    [0, 1].forEach(function (off) {
      var ok = 0;
      hits.forEach(function (h) {
        if (h.b < 0) return;
        var d = new Date(start);
        d.setDate(d.getDate() - ((d.getDay() - off + 7) % 7) + h.b * 7 + h.c);
        if (d.getDate() === h.n) ok++;
      });
      if (!best || ok > best.ok) best = { off: off, ok: ok };
    });
    if (!best || best.ok < Math.max(4, hits.length * 0.5)) return null;

    var base = new Date(start);
    base.setDate(base.getDate() - ((base.getDay() - best.off + 7) % 7));
    var KW = [['阅', '雅阅'], ['读', '雅阅'], ['写', '雅写'], ['听', '听力'], ['口', '口语'], ['语', '口语']];
    var out = [], seen = {};
    words.forEach(function (w) {
      var tm = w.t.replace(/：/g, ':').match(/^(\d{1,2}):(\d{2})(?:\s*[-–—~]\s*(\d{1,2}):(\d{2}))?/);
      if (!tm) return;
      var h = +tm[1], mi = +tm[2];
      if (h > 23 || mi > 59) return;
      var bi = bandOf(w.cy), ci = colOf(w.cx);
      if (bi < 0) return;
      var d = new Date(base);
      d.setDate(d.getDate() + bi * 7 + ci);
      var dur = 60;
      if (tm[3]) { var dd = (+tm[3] * 60 + +tm[4]) - (h * 60 + mi); if (dd > 0 && dd <= 300) dur = dd; }
      var k = '雅思';
      words.forEach(function (o) {
        if (colOf(o.cx) !== ci) return;
        if (Math.abs(o.cy - w.cy) > 34) return;
        for (var q = 0; q < KW.length; q++) if (o.t.indexOf(KW[q][0]) >= 0) k = KW[q][1];
      });
      var key = isoOf(d) + ' ' + pad(h) + ':' + pad(mi);
      if (seen[key]) return;
      seen[key] = 1;
      out.push({ d: isoOf(d), h: h, m: mi, dur: dur, k: k, t: '', src: 'local', link: '' });
    });
    out.sort(function (a, b) { return (a.d + clock(a.h, a.m)) < (b.d + clock(b.h, b.m)) ? -1 : 1; });
    return { items: out, score: best.ok + '/' + hits.length, base: base };
  }

  /* 这次这批课叫什么：输入框里的字，空着算雅思 */
  var kForced = false;          /* 用户自己改过名字才强制统一改名 */
  function imgName() {
    var el = $('kName');
    return normName(el ? el.value : '') || '雅思';
  }
  function fixedName() { return kForced ? imgName() : ''; }

  /* 只有用户明确改了名字，才把图里认出的口语/阅读也统一盖掉 */
  function applyName(list) {
    if (!kForced) return list;
    var n = imgName();
    list.forEach(function (o) { o.k = n; });
    return list;
  }

  /* 剪贴板：文件 / dataURL / 网页 img / 一段文字，都能收 */
  function filesFrom(dt) {
    var out = [], i;
    if (!dt) return out;
    if (dt.files && dt.files.length) for (i = 0; i < dt.files.length; i++) out.push(dt.files[i]);
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
    try { h = dt.getData('text/html') || ''; } catch (e) { return ''; }
    var m = h.match(/<img[^>]+src=["']([^"']+)["']/i);
    return m ? m[1] : '';
  }
  function plainText(dt) {
    var s = '';
    try { s = dt.getData('text/plain') || ''; } catch (e) { }
    if (!s) { try { s = dt.getData('text/uri-list') || ''; } catch (e) { } }
    return String(s || '');
  }
  function stamp() {
    var d = new Date();
    return pad(d.getMonth() + 1) + pad(d.getDate()) + '-' + pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds());
  }
  function dataUrlToFile(url) {
    var m = String(url).match(/^data:([^;,]+)?(;base64)?,([\s\S]*)$/);
    if (!m) return null;
    try {
      var bin = m[2] ? atob(m[3]) : decodeURIComponent(m[3]);
      var u8 = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
      var ty = m[1] || 'image/png';
      return new File([u8], '截图-' + stamp() + '.' + (ty.split('/')[1] || 'png'), { type: ty });
    } catch (e) { return null; }
  }

  function imgStageHTML(file, state) {
    $('imgStage').innerHTML = '<li class="stag"><span class="sic">IMG</span>' +
      '<span class="sname">' + esc(file.name || '剪贴板截图') + '</span>' +
      '<span class="ssz">' + (state || bytes(file.size)) + '</span>' +
      '<button class="odel" type="button" data-x="1" aria-label="移出">×</button></li>';
    $('imgPh').style.display = 'none';
  }
  function clearImg() {
    $('imgStage').innerHTML = '';
    $('imgPh').style.display = '';
    $('ocrBox').style.display = 'none';
    $('ocrBox').classList.remove('noimg');
    $('ocrImg').removeAttribute('src');
    var raw = $('ocrBox').querySelector('.rawtext');
    if (raw) raw.parentNode.removeChild(raw);
    ocrRows = [];
    paintRows();
    setStatus('还没收到图片');
  }

  function takeImage(file) {
    if (!file) return;
    if (file.type && !/^image\//.test(file.type)) {
      ocrMsg('这不是图片（' + (file.type || '未知类型') + '）。课表请用截图。', 'err');
      setStatus('收到的不是图片：' + (file.type || '未知类型'), 'err');
      return;
    }
    setStatus('收到图片：' + (file.name || '截图') + ' · ' + bytes(file.size), 'busy');
    imgStageHTML(file);
    doOCR(file);
  }

  function grabUrl(url) {
    ocrMsg('正在抓取这张图…');
    fetch(url, { mode: 'cors' }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.blob();
    }).then(function (b) {
      var ty = b.type || 'image/png';
      takeImage(new File([b], '截图-' + stamp() + '.' + (ty.split('/')[1] || 'png'), { type: ty }));
    }).catch(function () {
      ocrMsg('这张图是网页上的，跨域抓不下来。先把它另存到桌面，再拖进这个框。', 'err');
    });
  }

  /* 状态灯：不管卡在哪一步，框下面这行都会写清楚 */
  function setStatus(t, cls) {
    var el = $('imgStatus');
    if (!el) return;
    el.textContent = t || '';
    el.className = 'istat' + (cls ? ' ' + cls : '');
  }

  function hasImage(dt) {
    if (!dt) return false;
    var i;
    if (dt.files && dt.files.length) {
      for (i = 0; i < dt.files.length; i++) if (/^image\//.test(dt.files[i].type)) return true;
    }
    if (dt.items) {
      for (i = 0; i < dt.items.length; i++) {
        if (dt.items[i].kind === 'file' && /^image\//.test(dt.items[i].type || '')) return true;
      }
    }
    var h = '';
    try { h = dt.getData('text/html') || ''; } catch (e) { }
    return /<img/i.test(h);
  }

  /* 剪贴板对象在 paste 事件结束后可能就失效了：先同步把内容抄出来 */
  function snapClip(dt) {
    if (!dt) return null;
    var p = { file: null, html: '', text: '', uris: '', types: '' };
    var fs = filesFrom(dt), i;
    for (i = 0; i < fs.length; i++) {
      if (/^image\//.test(fs[i].type) || /\.(png|jpe?g|webp|gif|heic)$/i.test(fs[i].name || '')) { p.file = fs[i]; break; }
    }
    try { p.html = dt.getData('text/html') || ''; } catch (e) { }
    try { p.text = dt.getData('text/plain') || ''; } catch (e) { }
    try { p.uris = dt.getData('text/uri-list') || ''; } catch (e) { }
    try { p.types = Array.prototype.slice.call(dt.types || []).join(' / '); } catch (e) { }
    if (!p.file && p.html) {
      var m = p.html.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (m && /^data:image\//i.test(m[1])) p.file = dataUrlToFile(m[1]);
    }
    return p;
  }

  /* 剪贴板里是「访达复制的图片文件」→ 只有路径，没有图像内容 */
  function imagePathFrom(txt) {
    var lines = String(txt || '').split(/[\r\n]+/), i, s;
    for (i = 0; i < lines.length; i++) {
      s = lines[i].trim().replace(/^["'<]|["'>]$/g, '');
      if (!s || s.charAt(0) === '#') continue;
      if (!/\.(png|jpe?g|webp|gif|heic|tiff?)$/i.test(s)) continue;
      if (/^file:\/\//i.test(s) || /^\/.+/.test(s) || /^~\/.+/.test(s)) return s;
    }
    return '';
  }

  function applyClip(p) {
    if (!p) return false;
    if (p.file) { takeImage(p.file); return true; }

    var path = imagePathFrom(p.uris) || imagePathFrom(p.text);
    if (path) { doOCRPath(path); return true; }

    var m = p.html ? p.html.match(/<img[^>]+src=["']([^"']+)["']/i) : null;
    if (m && /^(https?:)?\/\//i.test(m[1])) { grabUrl(m[1]); return true; }

    if (p.text && p.text.trim()) {
      var items = parseAny(p.text, fixedName());
      if (items.length) { showRows(applyName(items), '从文字里读'); return true; }
      ocrMsg('这段文字里没看出「日期 + 时间」。图片截图、或者「2026/12/08 12:45-13:45」这样的文字都行。', 'err');
      setStatus('这段文字里没有「日期+时间」', 'err');
      return true;
    }

    ocrMsg('这次没读到图片（剪贴板类型：' + (p.types || '空') + '）。按 ⌘⇧4 截一张再粘贴，或者点「选图片」。', 'err');
    setStatus('剪贴板里没有图片（' + (p.types || '空') + '）', 'err');
    return false;
  }

  function handleImgClip(dt) { return applyClip(snapClip(dt)); }

  function showRows(items, how) {
    if (!items || !items.length) return;
    ocrRows = items;
    $('ocrBox').style.display = '';
    $('ocrBox').classList.toggle('noimg', !$('ocrImg').getAttribute('src'));
    paintRows();
    ocrMsg(how + ' ' + items.length + ' 条，核对一下日期和课程名，没问题再点右下角加入。', 'ok');
    setStatus(how + ' ' + items.length + ' 节，核对后点右下角「确认加入课表」', 'ok');
    $('imgBox').classList.remove('busy');
  }

  /* 先走本机 Vision（离线、快）；读到的文字解析不出「日期+时间」时，
     不再退回联网的 tesseract（国内基本加载不出来），直接给用户看原文 + 手动补 */
  function ocrFile(file) {
    return fetch('/api/ocr', { method: 'POST', body: file })
      .then(function (r) { return r.json(); })
      .catch(function () {
        /* 服务可能刚重启：等半秒再试一次，成了就正常出结果 */
        return new Promise(function (ok) { setTimeout(ok, 500); })
          .then(function () { return fetch('/api/ocr', { method: 'POST', body: file }); })
          .then(function (r) { return r.json(); })
          .catch(function () {
            if (window.apiFail) apiFail('识图没跑起来');
            return { ok: false, err: '连不上本地服务', down: true };
          });
      });
  }

  /* 访达里复制的图片：剪贴板只有路径，交给本机按路径读 */
  function ocrPath(path) {
    var opt = {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: path })
    };
    return fetch('/api/ocr', opt).then(function (r) { return r.json(); })
      .catch(function () {
        return new Promise(function (ok) { setTimeout(ok, 500); })
          .then(function () { return fetch('/api/ocr', opt); })
          .then(function (r) { return r.json(); })
          .catch(function () {
            if (window.apiFail) apiFail('识图没跑起来');
            return { ok: false, err: '连不上本地服务', down: true };
          });
      });
  }

  /* 图片识别结果统一处理：能解析就列出来，解析不出就把原文摆出来 */
  function handleOcrRes(j) {
    $('imgBox').classList.remove('busy');
    if (!j || !j.ok || !j.text) {
      var reason = (j && j.err) || '这张图里没认出字';
      $('ocrBox').style.display = '';
      if (j && j.down) {
        ocrMsg('连不上本地服务：先去文件夹里双击「启动.command」，等它显示 running，再重新粘贴这张图。', 'err');
        setStatus('本地服务没响应', 'err');
      } else {
        ocrMsg(reason + '。换一张更清楚的课表截图，或在下面手动补一行。', 'err');
        setStatus(reason, 'err');
      }
      return;
    }
    var items = parseAny(j.text, fixedName());
    if (items.length) { showRows(applyName(items), '本机识别出'); return; }

    $('ocrBox').style.display = '';
    ocrMsg('图里的字读到了，但没凑出「日期/周几 + 时间」。下面两种办法都能补：手动加一行，或直接贴课表文字。', 'err');
    setStatus('读到了 ' + j.text.replace(/\s/g, '').length + ' 个字，但没解析出「日期+时间」', 'err');
    showRaw(j.text);
    $('textRow').style.display = '';
    $('textIn').focus();
  }

  function doOCR(file) {
    var url = URL.createObjectURL(file);
    $('ocrBox').style.display = '';
    $('ocrBox').classList.remove('noimg');
    $('ocrImg').src = url;
    $('ocrImg').onload = function () { try { URL.revokeObjectURL(url); } catch (e) { } };
    ocrRows = []; paintRows();
    $('imgBox').classList.add('busy');
    ocrMsg('正在识别…（本机做，不上传）');
    setStatus('正在识别…', 'busy');
    ocrFile(file).then(handleOcrRes).catch(function () {
      $('imgBox').classList.remove('busy');
      ocrMsg('识别没跑起来。可以在下面手动补一行，或把课表文字复制到「同步」里粘。', 'err');
      setStatus('识别没跑起来', 'err');
    });
  }

  /* 剪贴板里是 file:///…/课表.png 这种路径时走这里 */
  function doOCRPath(path) {
    var name = path.split('/').pop() || '图片';
    try { name = decodeURIComponent(name); } catch (e) { }
    $('imgStage').innerHTML = '<li class="stag"><span class="sic">IMG</span>' +
      '<span class="sname">' + esc(name) + '</span><span class="ssz">读取中</span>' +
      '<button class="odel" type="button" data-x="1" aria-label="移出">×</button></li>';
    $('imgPh').style.display = 'none';
    $('ocrBox').style.display = '';
    $('ocrBox').classList.add('noimg');
    ocrRows = []; paintRows();
    $('imgBox').classList.add('busy');
    ocrMsg('正在识别这个文件…');
    setStatus('收到图片文件：' + name, 'busy');
    ocrPath(path).then(handleOcrRes).catch(function () {
      $('imgBox').classList.remove('busy');
      ocrMsg('这个文件读不了。把它拖进这个框里试试，或者点「选图片」。', 'err');
      setStatus('这个文件读不了', 'err');
    });
  }

  /* 识别失败时把原文显示出来，方便用户照抄 / 判断哪里不对 */
  /* 认不出时：把识别到的文字摆出来，可改、可重解析 —— 不让用户卡死 */
  function showRaw(text) {
    var side = document.querySelector('#ocrBox .ocrside') || $('ocrBox');
    var old = document.getElementById('rawWrap');
    if (old) old.parentNode.removeChild(old);

    var wrap = document.createElement('div');
    wrap.id = 'rawWrap';
    wrap.className = 'rawwrap';
    wrap.innerHTML =
      '<div class="rawhd"><b>识别到的文字</b>' +
      '<span>改对日期/时间，再点右边重新解析</span>' +
      '<button class="btn btn-sm" type="button" id="rawGo">按这段重新解析</button></div>' +
      '<textarea id="rawBox" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea>';
    side.appendChild(wrap);
    $('rawBox').value = text || '';

    $('rawGo').addEventListener('click', function () {
      var t = $('rawBox').value;
      var items = parseAny(t, fixedName());
      if (!items.length) {
        ocrMsg('还是没找出时间。每行写成「周一 12:45 外教课」或「11月20日 12:45-13:45 外教课」就行。', 'err');
        setStatus('还是没解析出时间，行首加上周几或日期', 'err');
        return;
      }
      showRows(applyName(items), '按你改的文字解析出');
      var w = document.getElementById('rawWrap');
      if (w) w.parentNode.removeChild(w);
    });
  }

  /* ---------- 设置 ---------- */
  function syncSettings() {
    $('lead').value = String(S.set.lead);
    $('leadTxt').textContent = S.set.lead;
    $('musicOn').checked = !!S.set.music;
    $('voiceOn').checked = !!S.set.speak;
    $('notifyOn').checked = !!S.set.notify;
    $('autoNoteOn').checked = S.set.autoNote !== 0;
    $('vname').textContent = '晓晓';
  }

  /* ---------- 绑定 ---------- */
  function bind() {
    $('wk').addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('.wev') : null;
      if (b) {
        var k = b.getAttribute('data-k');
        if (mgrOn) {   /* 批量管理模式：点课块＝勾选，不进教室 */
          if (mgrSel[k]) delete mgrSel[k]; else mgrSel[k] = 1;
          mgrUpdate(); renderGrid();
        } else openLesson(k);
        return;
      }
      /* 点列里的空白处：y 换算成时间，列换算成周几 */
      var col = e.target.closest ? e.target.closest('.wkg-col') : null;
      if (col) {
        var dayIdx = parseInt(col.getAttribute('data-day'), 10);
        if (!isNaN(dayIdx)) {
          var rect = col.getBoundingClientRect();
          var y = Math.max(0, e.clientY - rect.top);
          var mins = START_H * 60 + Math.round((y / ROWH * 60) / 15) * 15;
          mins = Math.max(START_H * 60, Math.min(END_H * 60 - 15, mins));
          openCell(dayIdx, mins);
        }
        return;
      }
      /* 点「周一 / 周二」表头也行 */
      var th = e.target.closest ? e.target.closest('.wkh-cell') : null;
      if (th && !th.classList.contains('gut')) {
        var cells = [].slice.call(th.parentNode.querySelectorAll('.wkh-cell'));
        var di = cells.indexOf(th) - 1;   /* 第一格是左上角空位 */
        if (di >= 0) openCell(di, null);
      }
    });

    /* 右键课块：单删 / 整批删 / 复制 / 进教室 */
    $('wk').addEventListener('contextmenu', function (e) {
      var b = e.target.closest ? e.target.closest('.wev') : null;
      if (!b) return;
      e.preventDefault();
      ctxKey = b.getAttribute('data-k');
      var m = $('ctxMenu');
      m.hidden = false;
      m.style.left = Math.max(8, Math.min(window.innerWidth - 200, e.clientX)) + 'px';
      m.style.top = Math.max(8, Math.min(window.innerHeight - 210, e.clientY)) + 'px';
    });
    $('ctxMenu').addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('button') : null;
      if (!b) return;
      var act = b.getAttribute('data-act'), l = find(ctxKey);
      $('ctxMenu').hidden = true;
      if (act === 'cancel' || !l) return;
      if (act === 'open') openLesson(ctxKey);
      else if (act === 'copy') copyMeetingLink(l.link + (l.no ? '\n会议号：' + l.no : ''), false);
      else if (act === 'del') delLesson(ctxKey);
      else if (act === 'delbatch') delBatch(l.batch);
    });
    document.addEventListener('click', function (e) {
      if (!$('ctxMenu').hidden && !$('ctxMenu').contains(e.target)) $('ctxMenu').hidden = true;
    });

    /* 批量管理 */
    $('mgrBtn').addEventListener('click', function () { mgrToggle(!mgrOn); });
    $('mgrCancel').addEventListener('click', function () { mgrToggle(false); });
    $('mgrAll').addEventListener('click', function () {
      var a = isoOf(viewMon), b = isoOf(addDays(viewMon, 6));
      allLessons().forEach(function (l) { if (l.iso >= a && l.iso <= b) mgrSel[l.key] = 1; });
      mgrUpdate(); renderGrid();
    });
    $('mgrDel').addEventListener('click', function () {
      var keys = Object.keys(mgrSel);
      if (!keys.length) { toast('先点课块选中要删的课'); return; }
      toast('已删除 ' + delKeys(keys) + ' 节');
      mgrToggle(false);
    });
    var clearArm = 0;
    $('mgrClear').addEventListener('click', function () {
      if (Date.now() - clearArm > 5000) {
        clearArm = Date.now(); this.textContent = '再点一次清空全部';
        toast('清空全部课表：5 秒内再点一次确认（不弹窗）');
        return;
      }
      clearArm = 0; this.textContent = '清空课表';
      S.local = []; save(); renderAll(); mgrToggle(false);
      toast('课表已清空，可以重新排了');
    });

    /* 上课教室 */
    $('roomBtn').addEventListener('click', function () {
      $('roomMsg').textContent = '';
      renderRooms(); $('roomMask').classList.add('on');
    });
    $('roomOk').addEventListener('click', function () { $('roomMask').classList.remove('on'); });
    $('roomMask').addEventListener('click', function (e) { if (e.target === this) this.classList.remove('on'); });
    $('rmAdd').addEventListener('click', addRoom);
    $('roomList').addEventListener('change', function (e) {
      var row = e.target.closest ? e.target.closest('.room-row') : null;
      if (!row) return;
      var r = roomOf(row.getAttribute('data-id'));
      if (!r) return;
      r[e.target.getAttribute('data-f')] = e.target.value.trim();
      save(); renderRoomBind();
    });
    $('roomList').addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('.rm-del') : null;
      if (b) delRoom(b.closest('.room-row').getAttribute('data-id'));
    });
    $('roomBind').addEventListener('change', function (e) {
      if (!e.target || e.target.tagName !== 'SELECT') return;
      S.bindings[e.target.getAttribute('data-t')] = e.target.value;
      save();
      $('roomMsg').textContent = '已保存：这种课以后排课自动带这个教室的链接和会议号';
    });

    /* 空白格排课弹层 */
    $('cfKinds').addEventListener('click', function (e) {
      var chip = e.target.closest ? e.target.closest('.kchip') : null;
      if (chip) cfSetType(chip.getAttribute('data-type'));
    });
    $('cfModes').addEventListener('click', function (e) {
      var chip = e.target.closest ? e.target.closest('.kchip') : null;
      if (chip) cfSetMode(chip.getAttribute('data-mode'));
    });
    $('cfDateAdd').addEventListener('click', function () {
      var v = $('cfDatePick').value;
      if (!v) { toast('先选个日期'); return; }
      if (cfDates.indexOf(v) < 0) cfDates.push(v);
      cfDates.sort(); cfRenderDates();
    });
    $('cfDates').addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('.cf-date') : null;
      if (!b) return;
      cfDates = cfDates.filter(function (d) { return d !== b.getAttribute('data-d'); });
      cfRenderDates();
    });
    $('cfCancel').addEventListener('click', function () { $('cellMask').classList.remove('on'); });
    $('cellMask').addEventListener('click', function (e) { if (e.target === this) this.classList.remove('on'); });
    $('cfOk').addEventListener('click', cfSubmit);

    $('prevW').addEventListener('click', function () { viewMon = addDays(viewMon, -7); renderAll(); });
    $('nextW').addEventListener('click', function () { viewMon = addDays(viewMon, 7); renderAll(); });
    $('todayBtn').addEventListener('click', function () { viewMon = mondayOf(new Date()); renderAll(); });

    $('planBtn').addEventListener('click', function () { $('planMsg').textContent = ''; $('planMask').classList.add('on'); setTimeout(function () { $('say').focus(); }, 60); });
    $('planCancel').addEventListener('click', function () { $('planMask').classList.remove('on'); });
    $('planMask').addEventListener('click', function (e) { if (e.target === this) this.classList.remove('on'); });
    [].forEach.call(document.querySelectorAll('.mini'), function (b) {
      b.addEventListener('click', function () { $('say').value = b.getAttribute('data-t'); $('say').focus(); });
    });
    function doPlan() {
      var res = parsePlan($('say').value);
      if (!res.items.length) {
        $('planMsg').className = 'hint err';
        $('planMsg').textContent = res.warn[0] || '没排出来，换个说法试试，比如「每周三 12 点半，50 分钟」。';
        return;
      }
      var n = mergeInto(res.items);
      if (!n) {
        $('planMsg').className = 'hint';
        $('planMsg').textContent = '这些课课表里已经都有了，没有新增。';
        return;
      }
      var first = res.items.slice().sort(function (a, b) {
        return (a.d + clock(a.h, a.m)) < (b.d + clock(b.h, b.m)) ? -1 : 1;
      })[0];
      $('say').value = '';
      $('planMsg').textContent = '';
      $('planMask').classList.remove('on');
      viewMon = mondayOf(at(first.d, 0, 0));
      renderAll();
      toast('排好了 ' + n + ' 节，已跳到第一节那一周（' + first.d + '）');
    }
    $('planOk').addEventListener('click', doPlan);
    $('say').addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); doPlan(); }
    });

    /* ---- 图片排课：框里点一下 → 右键粘贴 / ⌘V ---- */
    var imgBox = $('imgBox'), imgSink = $('imgSink');
    function focusImg() { try { imgSink.focus({ preventScroll: true }); } catch (e) { } }

    function openImg() {
      clearImg();
      kForced = false;
      $('kName').value = '雅思';
      $('addK').value = '雅思';
      [].forEach.call($('kChips').querySelectorAll('.kchip'), function (b) {
        b.classList.toggle('on', b.getAttribute('data-k') === '雅思');
      });
      setStatus('还没收到图片');
      ocrMsg('点下面的框，右键 →「粘贴」；也可以按 ⌘V 或直接拖图片进来。');
      $('imgMask').classList.add('on');
      setTimeout(focusImg, 80);
    }

    $('imgBtn').addEventListener('click', openImg);
    $('imgCancel').addEventListener('click', function () { $('imgMask').classList.remove('on'); });
    $('imgMask').addEventListener('click', function (e) { if (e.target === this) this.classList.remove('on'); });
    imgBox.addEventListener('mousedown', function (e) {
      if (e.target.closest('button')) return;
      focusImg();
    });
    imgBox.addEventListener('contextmenu', function (e) {
      if (e.target.closest('button')) return;
      focusImg();
    });
    imgSink.addEventListener('input', function () { imgSink.value = ''; });
    imgSink.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') return;
      if (!(e.metaKey || e.ctrlKey)) e.preventDefault();
    });
    imgSink.addEventListener('paste', function (e) {
      e.preventDefault();
      e.stopPropagation();
      handleImgClip(e.clipboardData || window.clipboardData);
      imgSink.value = '';
    });

    /* 弹窗开着：页面任意位置粘贴也收；
       弹窗没开：在课表页直接粘图片 → 自动打开图片排课并识别（用户以为「在课表里粘贴」就该能用） */
    document.addEventListener('paste', function (e) {
      if (e.defaultPrevented) return;
      var dt = e.clipboardData || window.clipboardData;
      if (!dt) return;
      var t = e.target;
      if (t && t.tagName === 'INPUT') return;                    /* 在输入框里粘贴别抢 */
      if (t && t.tagName === 'TEXTAREA' && t.id !== 'imgSink') return;

      if (!$('imgMask').classList.contains('on')) {
        var snap = snapClip(dt);
        if (!snap) return;
        var hasPath = !!(imagePathFrom(snap.uris) || imagePathFrom(snap.text));
        if (!snap.file && !/<img/i.test(snap.html) && !hasPath) return;
        e.preventDefault();
        openImg();
        setTimeout(function () { applyClip(snap); }, 30);
        return;
      }
      if (handleImgClip(dt)) e.preventDefault();
    });

    ['dragenter', 'dragover'].forEach(function (ev) {
      imgBox.addEventListener(ev, function (e) { e.preventDefault(); imgBox.classList.add('over'); });
    });
    ['dragleave', 'drop'].forEach(function (ev) {
      imgBox.addEventListener(ev, function (e) { e.preventDefault(); imgBox.classList.remove('over'); });
    });
    imgBox.addEventListener('drop', function (e) {
      e.stopPropagation();
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
        var f = null;
        for (var i = 0; i < e.dataTransfer.files.length; i++) {
          if (/^image\//.test(e.dataTransfer.files[i].type)) { f = e.dataTransfer.files[i]; break; }
        }
        if (f) { takeImage(f); return; }
      }
      handleImgClip(e.dataTransfer);
    });

    /* 直接拖一张图到课表页任意位置，也进图片排课 */
    document.addEventListener('dragover', function (e) { e.preventDefault(); });
    document.addEventListener('drop', function (e) {
      e.preventDefault();
      if ($('imgMask').classList.contains('on')) return;
      var dt = e.dataTransfer;
      if (!dt || !dt.files) return;
      var f = null;
      for (var i = 0; i < dt.files.length; i++) {
        if (/^image\//.test(dt.files[i].type)) { f = dt.files[i]; break; }
      }
      if (!f) return;
      openImg();
      setTimeout(function () { takeImage(f); }, 30);
    });

    $('imgPick').addEventListener('click', function (e) { e.stopPropagation(); $('imgFile').click(); });
    $('imgFile').addEventListener('change', function () {
      if (this.files && this.files[0]) takeImage(this.files[0]);
      this.value = '';
    });
    /* 右键菜单不好用时的兜底：直接向浏览器要剪贴板里的图片 */
    $('imgRead').addEventListener('click', function (e) {
      e.stopPropagation();
      var clip = navigator.clipboard;
      if (!clip || !clip.read) {
        setStatus('这个浏览器不能直接读剪贴板，用 ⌘V 或右键粘贴', 'err');
        return;
      }
      setStatus('正在读剪贴板…', 'busy');
      clip.read().then(function (list) {
        for (var i = 0; i < list.length; i++) {
          var types = list[i].types || [];
          for (var k = 0; k < types.length; k++) {
            if (/^image\//.test(types[k])) {
              (function (item, ty) {
                item.getType(ty).then(function (blob) {
                  var ext = ty.split('/')[1] || 'png';
                  takeImage(new File([blob], '剪贴板-' + stamp() + '.' + ext, { type: ty }));
                });
              })(list[i], types[k]);
              return;
            }
          }
        }
        setStatus('剪贴板里没有图片（复制的是文字？文字可以直接粘到框里）', 'err');
      }).catch(function (err) {
        setStatus('浏览器没允许读剪贴板（' + ((err && err.name) || '') + '），请在框里按 ⌘V 或右键粘贴', 'err');
      });
    });
    $('imgStage').addEventListener('click', function (e) {
      if (e.target.closest('.odel')) clearImg();
    });

    /* 「这节课叫什么」：改一次，所有行跟着改 */
    function setName(n, force) {
      n = normName(n);
      if (force !== false) kForced = true;
      $('kName').value = n;
      $('addK').value = n;
      if (kForced) ocrRows.forEach(function (r) { r.k = n; });
      paintRows();
      [].forEach.call($('kChips').querySelectorAll('.kchip'), function (b) {
        b.classList.toggle('on', b.getAttribute('data-k') === n);
      });
    }
    $('kName').addEventListener('input', function () {
      kForced = true;
      var n = normName(this.value);
      $('addK').value = n;
      ocrRows.forEach(function (r) { r.k = n; });
      paintRows();
    });
    $('kName').addEventListener('blur', function () {
      var v = String(this.value).trim();
      if (!v) { kForced = false; this.value = '雅思'; $('addK').value = '雅思'; return; }
      var n = normName(v);
      this.value = n;
      $('addK').value = n;
      if (kForced) { ocrRows.forEach(function (r) { r.k = n; }); paintRows(); }
    });
    $('kChips').addEventListener('click', function (e) {
      var b = e.target.closest('.kchip');
      if (b) setName(b.getAttribute('data-k'));
    });

    $('ocrRows').addEventListener('click', function (e) {
      if (e.target.classList.contains('odel')) {
        var row = e.target.closest('.orow');
        var at = parseInt(row.getAttribute('data-i'), 10);
        if (!isNaN(at)) ocrRows.splice(at, 1);
        else row.parentNode.removeChild(row);
        paintRows();
      }
    });
    $('ocrRows').addEventListener('input', function (e) {
      if (!e.target.classList.contains('ok')) return;
      var row = e.target.closest('.orow');
      var ix = parseInt(row.getAttribute('data-i'), 10);
      if (!isNaN(ix) && ocrRows[ix]) ocrRows[ix].k = cleanKind(e.target.value);
    });
    /* 识别核对表：开始 / 结束时间都能直接点着改 */
    $('ocrRows').addEventListener('change', function (e) {
      var row = e.target.closest('.orow'); if (!row) return;
      var ix = parseInt(row.getAttribute('data-i'), 10);
      if (isNaN(ix) || !ocrRows[ix]) return;
      var r = ocrRows[ix];
      if (e.target.classList.contains('od')) { r.d = e.target.value; return; }
      if (e.target.classList.contains('ot')) {
        var p = e.target.value.split(':');
        var ed = new Date(at(r.d, +p[0], +p[1]).getTime() + (r.dur || 60) * 60000);
        r.h = +p[0]; r.m = +p[1]; r.eh = ed.getHours(); r.em = ed.getMinutes();
        row.querySelector('.oe').value = clock(r.eh, r.em);
        return;
      }
      if (e.target.classList.contains('oe')) {
        var q = e.target.value.split(':');
        var dd = (+q[0] * 60 + +q[1]) - (r.h * 60 + r.m);
        if (dd <= 0) dd += 1440;
        if (dd > 360) { toast('结束时间要在开始之后，且不超过 6 小时'); e.target.value = rowEnd(r); return; }
        r.eh = +q[0]; r.em = +q[1]; r.dur = dd;
        row.querySelector('.ox').textContent = dd + ' 分钟';
      }
    });
    $('addOk').addEventListener('click', function () {
      var d = $('addD').value, t = $('addT').value || '12:45', e = $('addE').value || '13:45';
      var k = cleanKind($('addK').value || imgName());
      if (!d) { toast('先选个日期'); return; }
      var p = t.split(':'), q = e.split(':');
      var dur = (+q[0] * 60 + +q[1]) - (+p[0] * 60 + +p[1]);
      if (dur <= 0) dur += 1440;
      if (dur > 360) dur = 60;
      ocrRows.push({ d: d, h: parseInt(p[0], 10), m: parseInt(p[1], 10),
        dur: dur, eh: +q[0], em: +q[1], k: k, t: '', src: 'local', link: '' });
      paintRows();
      $('ocrBox').style.display = '';
      ocrMsg('补了一行，接着核对或继续加。', 'ok');
      setStatus('已手动补 ' + ocrRows.length + ' 行，可以继续补或点右下角加入', 'ok');
    });

    /* 贴课表文字解析：图片认不出时的最终兜底 */
    $('textOk').addEventListener('click', function () {
      var t = $('textIn').value;
      var items = parseAny(t, fixedName());
      if (!items.length) {
        ocrMsg('这几行也没凑出「日期/周几 + 时间」。每行写成「11月17日 12:45 外教课」或「周一 12:45 外教课」。', 'err');
        return;
      }
      $('textRow').style.display = 'none';
      showRows(applyName(items), '按你贴的文字解析出');
    });
    $('imgOk').addEventListener('click', function () {
      var items = readRows();
      if (!items.length) {
        $('ocrMsg').className = 'hint err';
        $('ocrMsg').textContent = '一条都没勾选，或者日期是空的。勾上要加入的课再点一次。';
        return;
      }
      var n = mergeInto(items);
      var first = items.slice().sort(function (a, b) {
        return (a.d + clock(a.h, a.m)) < (b.d + clock(b.h, b.m)) ? -1 : 1;
      })[0];
      $('imgMask').classList.remove('on');
      ocrRows = []; paintRows();
      if (n && first) viewMon = mondayOf(at(first.d, 0, 0));
      renderAll();
      toast(n ? ('加了 ' + n + ' 节课' + (first ? '，已跳到 ' + first.d + ' 那一周' : '')) : '这些课已经有了，没新增');
    });

    /* 原「同步 AmazingTalker」入口已换成顶部的「🏫 上课教室」管理 */

    $('setBtn').addEventListener('click', function () { syncSettings(); $('setMask').classList.add('on'); });
    $('setOk').addEventListener('click', function () { $('setMask').classList.remove('on'); renderAll(); });
    $('setMask').addEventListener('click', function (e) { if (e.target === this) this.classList.remove('on'); });
    $('lead').addEventListener('change', function () { S.set.lead = parseInt(this.value, 10) || 5; save(); syncSettings(); });
    $('musicOn').addEventListener('change', function () { S.set.music = this.checked ? 1 : 0; save(); });
    $('voiceOn').addEventListener('change', function () { S.set.speak = this.checked ? 1 : 0; save(); });
    $('notifyOn').addEventListener('change', function () {
      S.set.notify = this.checked ? 1 : 0; save();
      if (this.checked && 'Notification' in window && Notification.permission === 'default') Notification.requestPermission();
    });
    $('autoNoteOn').addEventListener('change', function () { S.set.autoNote = this.checked ? 1 : 0; save(); toast(this.checked ? '已开启：上课自动记笔记' : '已关闭：不再自动记笔记'); });
    /* 会议链接 / 会议号已改到「上课教室」弹窗里统一管理 */
    [].forEach.call(document.querySelectorAll('.vpick'), function (b) {
      b.addEventListener('click', function () { S.set.voiceName = b.getAttribute('data-v'); save(); syncSettings(); });
    });
    $('vtest').addEventListener('click', function () { ensureAudio(); playVoice('5', '还有五分钟就要上雅思课了，请准备好进入教室。'); });

    $('musicBtn').addEventListener('click', function () { ensureAudio(); playMusic(9); toast('课前会先放这段，再播语音'); });
    $('voiceBtn').addEventListener('click', function () { ensureAudio(); playVoice('5', '还有五分钟就要上雅思课了，请准备好进入教室。'); });

    $('ringStop').addEventListener('click', function () { stopMusic(); $('ringMask').classList.remove('on'); });
    $('ringJoin').addEventListener('click', function () { stopMusic(); });

    $('wakeBtn').addEventListener('click', function () {
      ensureAudio();
      if (S.set.notify && 'Notification' in window && Notification.permission === 'default') Notification.requestPermission();
      playMusic(3);
      try { localStorage.setItem('ielts_wake', '1'); } catch (e) { }
      $('wake').style.display = 'none';
      toast('已开启：课前会放轻音乐 + 女声提醒');
    });
  }

  /* ---------- 启动 ---------- */
  function boot() {
    viewMon = mondayOf(new Date());
    renderAll();
    bind();
    syncSettings();
    $('addD').value = isoOf(new Date());
    try { if (!localStorage.getItem('ielts_wake')) $('wake').style.display = ''; } catch (e) { $('wake').style.display = ''; }
    setInterval(function () { renderNav(); renderGrid(); }, 60000);
    setInterval(check, 15000);
    setTimeout(check, 2000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
