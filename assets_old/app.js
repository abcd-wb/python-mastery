/* Python 进阶之路 · 前端逻辑（纯静态，可直接双击打开） */
(function () {
  'use strict';

  var R = window.ROADMAP;
  var QS = window.QUESTIONS || [];
  var STORE_KEY = 'python_mastery_status_v1';

  var TYPE_NAME = { single: '单选', multi: '多选', judge: '判断', blank: '填空', code: '编程', project: '项目作业' };
  var STATUS_NAME = { done: '已掌握', review: '需复习' };

  var state = {
    status: loadStatus(),
    filter: { status: 'all', type: 'all', lv: 'all' },
    open: {},
    reveal: {},
    keyword: '',
    currentList: QS
  };

  /* ---------------- 工具 ---------------- */
  function $(s, root) { return (root || document).querySelector(s); }
  function esc(s) {
    return String(s === undefined || s === null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function loadStatus() {
    try { var raw = localStorage.getItem(STORE_KEY); return raw ? JSON.parse(raw) : {}; }
    catch (e) { return {}; }
  }
  function saveStatus() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state.status)); } catch (e) {}
  }
  function st(id) { return state.status[id] || ''; }
  function unitOf(id) {
    for (var i = 0; i < R.units.length; i++) if (R.units[i].id === id) return R.units[i];
    return { id: id, name: id };
  }
  function majorOf(id) {
    for (var i = 0; i < R.majors.length; i++) if (R.majors[i].id === id) return R.majors[i];
    return null;
  }
  function unitName(id) { return unitOf(id).name; }
  function majorNames(arr) {
    var out = [];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === 'common') { out.push('通用基础'); continue; }
      var m = majorOf(arr[i]);
      if (m) out.push(m.name);
    }
    return out;
  }
  function qsOfUnit(uid) {
    return QS.filter(function (q) { return q.u === uid; });
  }
  function qsOfMajor(mid) {
    return QS.filter(function (q) { return q.m.indexOf(mid) >= 0; });
  }
  function doneCount(list) {
    var n = 0;
    for (var i = 0; i < list.length; i++) if (st(list[i].id) === 'done') n++;
    return n;
  }
  function pct(a, b) { return b ? Math.round(a * 100 / b) : 0; }
  function stars(n) { return new Array(n + 1).join('★') + new Array(4 - n).join('☆'); }
  function toast(msg) {
    var t = $('#toast'); t.textContent = msg; t.className = 'toast show';
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.className = 'toast'; }, 1800);
  }
  function link(url, text, cls) {
    var inner = url.charAt(0) === '#';
    return '<a href="' + esc(url) + '"' + (inner ? '' : ' target="_blank" rel="noopener"') +
      (cls ? ' class="' + cls + '"' : '') + '>' + esc(text) + '</a>';
  }
  function answerText(q) {
    if (q.t === 'project') return q.a;
    if (q.t === 'code') return '参考实现见下方代码（先自己写一遍再看）';
    if (q.t === 'judge' || q.t === 'blank') return q.a;
    if (Object.prototype.toString.call(q.a) === '[object Array]') {
      var parts = [];
      for (var i = 0; i < q.a.length; i++) {
        var k = q.a[i], idx = k.charCodeAt(0) - 65;
        parts.push(k + (q.o && q.o[idx] ? ' ' + q.o[idx] : ''));
      }
      return parts.join('；');
    }
    var ix = String(q.a).charCodeAt(0) - 65;
    return q.a + (q.o && q.o[ix] ? ' ' + q.o[ix] : '');
  }

  /* ---------------- 侧栏 ---------------- */
  function renderNav() {
    var h = '';
    h += group('中文主线课堂 · 点进去上课', [
      item('course.html#/intro/1', '① 入门 · 小甲鱼（中文）', '', 'cl-intro'),
      item('course.html#/adv/1', '② 进阶 · 黑马程序员（中文）', '', 'cl-adv'),
      item('course.html#/project/1', '③ 实战 · Datawhale（中文）', '', 'cl-project'),
      item('course.html#/gap/1', '④ 补齐课堂 · 图片路线缺口', '', 'cl-gap'),
      item('course.html#/intro/0', '课程介绍与选课说明', '', 'cl-about')
    ]);
    h += group('图片路线 · 资源 · 选课', [
      item('#/coverage', '图片课程逐条核对', '', 'cv'),
      item('#/resnav', '学习资源一键直达', '', 'rn'),
      item('#/compare', '小甲鱼 / 廖雪峰 / 黑马对比', '', 'cp'),
      item('#/english', '纯英文课程（待解锁）', '', 'en')
    ]);
    h += group('开始这里', [
      item('#/overview', '总览与时长结论', '', 'ov'),
      item('#/roadmap', '完整六步学习路线', '', 'rm'),
      item('#/daily', '今日随机 5 题', '', 'dy')
    ]);

    var stepItems = [];
    for (var i = 0; i < R.stages.length; i++) {
      var s = R.stages[i];
      stepItems.push({ href: '#/stage/' + s.no, text: '第 ' + s.no + ' 步 · ' + shortTitle(s.title), num: s.no, key: 'stage/' + s.no });
    }
    h += navGroupCustom('六步路线', stepItems, true);

    var base = [], prac = [];
    for (var j = 0; j < R.units.length; j++) {
      var u = R.units[j], cnt = qsOfUnit(u.id).length;
      var o = { href: '#/unit/' + u.id, text: u.id + ' ' + u.name, cnt: cnt, key: 'unit/' + u.id };
      if (u.id.indexOf('P-') === 0) prac.push(o); else base.push(o);
    }
    h += navGroupCustom('按单元做题 · 基础', base, false, 'unit-base');
    h += navGroupCustom('按单元做题 · 方向实战', prac, false, 'unit-prac');

    var majors = [];
    for (var k = 0; k < R.majors.length; k++) {
      var m = R.majors[k];
      majors.push({ href: '#/major/' + m.id, text: m.name, cnt: qsOfMajor(m.id).length, key: 'major/' + m.id });
    }
    h += navGroupCustom('按专业做题', majors, false, 'nav-majors');
    h += group('资源与进度', [
      item('#/resnav', '图片学习资源（一键直达）', '', 'rn'),
      item('#/resources', '资源地图（课程 / 刷题 / 工具）', '', 'res'),
      item('#/progress', '我的进度', '', 'pg')
    ]);
    $('#nav').innerHTML = h;
    markActive();
  }
  function shortTitle(t) {
    var s = t.replace(/^第[一二三四五六]步：/, '');
    return s.length > 15 ? s.slice(0, 15) + '…' : s;
  }
  function group(title, arr) {
    var h = '<div class="nav-group"><div class="nav-title">' + esc(title) + '</div>';
    for (var i = 0; i < arr.length; i++) h += arr[i];
    return h + '</div>';
  }
  function item(href, text, cnt, key) {
    return '<a class="nav-item" data-key="' + esc(key) + '" href="' + esc(href) + '">' +
      '<span class="dot"></span><span>' + esc(text) + '</span>' +
      (cnt ? '<span class="cnt">' + esc(cnt) + '</span>' : '') + '</a>';
  }
  function navGroupCustom(title, arr, withNum, id) {
    var h = '<div class="nav-group"' + (id ? ' id="' + id + '"' : '') + '><div class="nav-title">' + esc(title) + '</div>';
    for (var i = 0; i < arr.length; i++) {
      var o = arr[i];
      h += '<a class="nav-item" data-key="' + esc(o.key) + '" href="' + esc(o.href) + '">' +
        (withNum ? '<span class="num">' + o.num + '</span>' : '<span class="dot"></span>') +
        '<span>' + esc(o.text) + '</span>' +
        (o.cnt ? '<span class="cnt">' + o.cnt + '</span>' : '') + '</a>';
    }
    return h + '</div>';
  }
  function markActive() {
    var key = currentKey();
    var els = document.querySelectorAll('.nav-item');
    for (var i = 0; i < els.length; i++) {
      var k = els[i].getAttribute('data-key') || '';
      els[i].className = 'nav-item' + (k === key ? ' active' : '');
    }
  }
  function currentKey() {
    var h = location.hash.replace(/^#\/?/, '');
    if (!h) return 'ov';
    if (h === 'roadmap') return 'rm';
    if (h === 'daily') return 'dy';
    if (h === 'resources') return 'res';
    if (h === 'progress') return 'pg';
    if (h === 'coverage') return 'cv';
    if (h === 'resnav') return 'rn';
    if (h === 'compare') return 'cp';
    if (h === 'english') return 'en';
    return h.replace(/\/$/, '');
  }

  /* ---------------- 顶部进度 ---------------- */
  function renderTopProgress() {
    var n = 0;
    for (var i = 0; i < QS.length; i++) if (st(QS[i].id) === 'done') n++;
    $('#pmCount').textContent = n;
    $('#pmTotal').textContent = QS.length;
    $('#pmFill').style.width = pct(n, QS.length) + '%';
  }

  /* ---------------- 页面：总览 ---------------- */
  function overview() {
    var h = '';
    h += '<div class="page-head"><div class="eyebrow">START HERE</div><h2>零基础 Python，走到能独立开发要多久？</h2>' +
      '<p>先给你一个诚实的答案，再给你一条能照着走的六步路线和一个点开就能做题的题库。</p></div>';
    h += triSection();
    h += '<div class="hero"><h3>' + esc(R.verdict.headline) + '</h3>' +
      '<p>下面这张表按「每天真正动手敲代码的时间」估算。路线里的每一步都写明了跟谁学、学多久、去哪做题、交什么作业、什么标准才算过关。</p>' +
      '<div class="hero-chips"><span class="hero-chip">6 步递进</span><span class="hero-chip">' + R.units.length + ' 个单元</span>' +
      '<span class="hero-chip">' + R.majors.length + ' 个专业方向</span><span class="hero-chip">' + QS.length + ' 道题 / 作业</span>' +
      '<span class="hero-chip">进度自动保存</span></div></div>';

    var nDone = 0; for (var i = 0; i < QS.length; i++) if (st(QS[i].id) === 'done') nDone++;
    h += '<div class="grid g4" style="margin-top:16px">' +
      statCard('学习阶段', R.stages.length + ' 步', '从入门到资深') +
      statCard('知识单元', R.units.length + ' 个', '10 基础 + 6 方向实战') +
      statCard('题库总量', QS.length + ' 题', '含 ' + QS.filter(function (q) { return q.t === 'project'; }).length + ' 个项目作业') +
      statCard('你已掌握', nDone + ' 题', '完成度 ' + pct(nDone, QS.length) + '%') +
      '</div>';

    h += '<div class="section-title"><span class="bar"></span>需要学多久 <small>按投入强度对照</small></div>';
    h += '<div class="card" style="overflow:hidden"><table class="tbl"><thead><tr>' +
      '<th style="width:38%">达到的目标</th><th>轻量 · 每周 5~7 小时</th><th>标准 · 每周 12~15 小时</th><th>高强度 · 每周 25 小时+</th></tr></thead><tbody>';
    for (var t = 0; t < R.timelines.length; t++) {
      var tl = R.timelines[t];
      h += '<tr><td>' + esc(tl.goal) + '</td><td>' + esc(tl.casual) + '</td><td class="hl">' + esc(tl.normal) + '</td><td>' + esc(tl.intense) + '</td></tr>';
    }
    h += '</tbody></table></div><div class="tiny" style="margin-top:8px">' + esc(R.timelineNote) + '</div>';

    h += '<div class="section-title"><span class="bar"></span>先把这几句话记住 <small>比选哪个教程更重要</small></div>';
    h += '<div class="card pad"><ul class="list-clean">';
    for (var p = 0; p < R.verdict.points.length; p++) h += '<li>' + esc(R.verdict.points[p]) + '</li>';
    h += '</ul></div>';

    h += '<div class="section-title"><span class="bar"></span>六步路线 <small>点卡片看「跟谁学 / 去哪做题 / 交什么作业」</small></div>';
    h += '<div class="stage-flow">';
    for (var s = 0; s < R.stages.length; s++) {
      var sg = R.stages[s];
      h += '<a class="card stage-card" style="border-top-color:' + sg.color + '" href="#/stage/' + sg.no + '">' +
        '<div class="sc-no">STEP ' + sg.no + '</div><h4>' + esc(sg.title) + '</h4>' +
        '<div class="sc-week">' + esc(sg.weeks) + '</div><p>' + esc(sg.goal) + '</p>' +
        '<div class="sc-foot"><span>主讲：' + esc(sg.teacher.name) + '</span><span>查看详情 →</span></div></a>';
    }
    h += '</div>';

    h += '<div class="section-title"><span class="bar"></span>现在就开始</div>';
    h += '<div class="grid g2">' +
      '<div class="card pad"><h4 style="margin:0 0 8px">① 先学第一步</h4><p class="muted" style="margin:0 0 14px;font-size:13px">跟小甲鱼把语法敲熟，先看路线里这一阶段具体每天做什么。</p>' +
      '<a class="btn btn-primary" href="#/stage/1">打开第一步 →</a> <a class="btn" href="course.html#/intro/1">进入入门课堂 →</a></div>' +
      '<div class="card pad"><h4 style="margin:0 0 8px">② 直接去题库</h4><p class="muted" style="margin:0 0 14px;font-size:13px">按单元或按专业分好类，点题目即可展开答案与解析，做过的题会自动记进度。</p>' +
      '<a class="btn" href="#/bank">打开题库 →</a> <a class="btn" href="#/unit/U0">从 U0 开始</a></div></div>';

    h += '<div class="tip-box" style="margin-top:20px">使用建议：左侧目录可随时切换单元/专业；题目先自己想，再点「查看答案」；标记「已掌握」后进度会保存在本机浏览器，换电脑可用左下角「导出进度」备份。</div>';
    return h;
  }
  /* 三阶段课堂首页入口（按手绘草图的横排三列） */
  function triSection() {
    var M = window.COURSE_META || [];
    var h = '<div class="tri-section"><div class="tri-head">' +
      '<span class="th-k">CLASSROOM</span><span class="th-t">三阶段课堂 · 点任意一列开始上课</span>' +
      '<span class="th-d">每个阶段只跟一套知名易懂的主课程，进去后左侧是目录、中间是内容与练习、右侧是本节英文专业名词</span></div>';
    h += '<div class="lang-banner"><b>学习语言策略：中文优先</b>' +
      '三个阶段全部换成中文课，每节右栏照常积累 6 个英文专业名词；' +
      '哈佛 CS50P、Kaggle Learn 等纯英文课程已移入「纯英文课程 · 待解锁」，等能独立开发后再开。</div>';
    h += '<div class="tri-flow">';
    for (var i = 0; i < Math.min(M.length, 3); i++) {
      var m = M[i], c = m.course, n = m.lessons || 12;
      h += '<a class="tri-card" href="course.html#/' + esc(m.id) + '/1" style="--tc:' + m.color + ';--tbg:' + m.bg + '">' +
        '<div class="tri-bg"></div>' +
        '<span class="tri-no">' + esc(m.no) + '</span>' +
        '<div class="tri-title">' + esc(m.title) + '</div>' +
        '<div class="tri-sub">' + esc(m.sub) + '</div>' +
        '<div class="tri-course"><b>主课程：' + esc(c.name) + '</b>' +
        '<span>' + esc(c.teacher) + ' · ' + esc(c.cost) + ' · ' + esc(c.lang.split('（')[0]) + '</span></div>' +
        '<div class="tri-meta"><span>' + esc(m.weeks) + '</span><span>' + n + ' 节目录</span>' +
        '<span>' + (n * 6) + ' 个英文术语</span><span>' + (n * 3) + ' 道课堂练习</span></div>' +
        '<div class="tri-layout">' +
        '<div><b>左 · 目录</b>12 节点哪节看哪节</div>' +
        '<div><b>中 · 内容练习</b>讲义+代码+答案</div>' +
        '<div><b>右 · 英文名词</b>6 词/节 可朗读自测</div></div>' +
        '<div class="tri-go"><span>点进去上课</span><span class="tg-arrow">→</span></div></a>';
    }
    h += '</div>';
    h += '<div class="tri-note"><b>三套中文主课程：</b>入门跟 <b>小甲鱼《零基础入门学习 Python》</b>（风趣、零基础最易坚持）→ 进阶跟 <b>黑马程序员 Python 进阶课</b>（体系全，对上图片 02/03 阶段）→ 实战跟 <b>Datawhale 中文开源教程</b>（Joyful Pandas / 机器学习 / 大模型）。' +
      '每阶段 12 节，共 36 节、216 个英文专业名词、108 道带答案练习；点目录即时切换，进度自动保存在本机。</div>';
    h += '<div class="ql-strip">' +
      qlCard('#/coverage', '🔍', '图片课程逐条核对', '5 阶段 40 条 · 缺口已补齐') +
      qlCard('#/resnav', '🔗', '学习资源一键直达', '官网 / 教程 / 刷题 / 工具') +
      qlCard('#/compare', '⚖️', '三家中文课怎么选', '小甲鱼 · 廖雪峰 · 黑马') +
      qlCard('#/english', '🔒', '纯英文课程 · 待解锁', '能独立开发后再开') +
      '</div>';
    h += '<a class="gap-banner" href="course.html#/gap/1"><span class="gb-tag">补齐课堂</span>' +
      '<span><b>图片 03 提升 / 04 实战 / 05 精通阶段原来缺的内容，已补成 12 节中文课堂</b>' +
      '<small>多线程、多进程、socket、数据库、部署、GIL、性能分析、CI/CD…同样是左目录 / 中讲义练习 / 右英文术语</small></span>' +
      '<span class="gb-go">去上课 →</span></a></div>';
    return h;
  }
  function qlCard(href, icon, title, sub) {
    return '<a class="ql-card" href="' + esc(href) + '"><span class="ql-i">' + icon + '</span>' +
      '<span class="ql-t">' + esc(title) + '</span><span class="ql-s">' + esc(sub) + '</span></a>';
  }
  function statCard(k, v, d) {
    return '<div class="card stat-card"><div class="k">' + esc(k) + '</div><div class="v">' + esc(v) + '</div><div class="d">' + esc(d) + '</div></div>';
  }

  /* ---------------- 页面：路线 ---------------- */
  function roadmapPage() {
    var h = '<div class="page-head"><div class="eyebrow">ROADMAP</div><h2>完整六步学习路线</h2>' +
      '<p>每一步都建立在上一步之上。选定一条主线跟到底，不要同时刷三套教程。</p></div>';
    h += '<div class="card" style="overflow:hidden"><table class="tbl"><thead><tr><th style="width:60px">步骤</th><th style="width:30%">跟谁学</th><th>目标</th><th style="width:110px">周期</th><th style="width:70px"></th></tr></thead><tbody>';
    for (var i = 0; i < R.stages.length; i++) {
      var s = R.stages[i];
      h += '<tr><td><span class="badge b-type">第 ' + s.no + ' 步</span></td><td>' + esc(s.teacher.name) + '<div class="tiny">' + esc(s.teacher.course) + '</div></td>' +
        '<td>' + esc(s.goal) + '</td><td>' + esc(s.weeks) + '</td><td><a href="#/stage/' + s.no + '">详情 →</a></td></tr>';
    }
    h += '</tbody></table></div>';
    h += '<div class="section-title"><span class="bar"></span>路线全景</div><div class="stage-flow">';
    for (var j = 0; j < R.stages.length; j++) {
      var g = R.stages[j];
      h += '<a class="card stage-card" style="border-top-color:' + g.color + '" href="#/stage/' + g.no + '">' +
        '<div class="sc-no">STEP ' + g.no + '</div><h4>' + esc(g.title) + '</h4><div class="sc-week">' + esc(g.weeks) + '</div><p>' + esc(g.goal) + '</p></a>';
    }
    return h + '</div>';
  }

  function stagePage(no) {
    var s = null;
    for (var i = 0; i < R.stages.length; i++) if (String(R.stages[i].no) === String(no)) s = R.stages[i];
    if (!s) return '<div class="empty">没有找到这个阶段</div>';

    var h = '<div class="page-head"><div class="eyebrow">STEP ' + s.no + ' / ' + R.stages.length + '</div>' +
      '<h2>' + esc(s.title) + '</h2><p>' + esc(s.goal) + '</p></div>';
    h += '<div class="card stage-detail">';
    h += '<div class="sd-head" style="border-left-color:' + s.color + '">' +
      '<span class="badge b-type">' + esc(s.weeks) + '</span>' +
      '<h3 style="margin-top:9px">' + esc(s.goal) + '</h3>' +
      '<div class="sd-meta">' + s.units.map(function (u) { return '<span class="tag">' + esc(u) + ' ' + esc(unitName(u)) + '</span>'; }).join('') + '</div></div>';

    h += '<div class="sd-block"><h4><span class="ico">①</span>第一步跟谁学 / 这一阶段的主讲</h4>' +
      '<div class="teacher-box"><div class="tb-name">' + esc(s.teacher.name) + '</div>' +
      '<div class="tb-course">' + esc(s.teacher.course) + ' &nbsp;' + link(s.teacher.url, '打开课程 ↗') + '</div>' +
      '<div class="tb-why">' + esc(s.teacher.why) + '</div></div></div>';

    h += '<div class="sd-block"><h4><span class="ico">②</span>备选与配套（挑 1~2 个，不要全刷）</h4><ul class="alt-list">';
    for (var a = 0; a < s.alternates.length; a++) {
      var al = s.alternates[a];
      h += '<li><div class="al-name">' + link(al.url, al.name) + '</div><div class="al-note">' + esc(al.note) + '</div></li>';
    }
    h += '</ul></div>';

    h += '<div class="sd-block"><h4><span class="ico">③</span>这一阶段要学什么</h4><div class="topic-tags">';
    for (var t = 0; t < s.topics.length; t++) h += '<span class="tag">' + esc(s.topics[t]) + '</span>';
    h += '</div></div>';

    h += '<div class="sd-block"><h4><span class="ico">④</span>去哪里做题（外部平台 + 本平台题库）</h4><ul class="list-clean">';
    for (var p = 0; p < s.practice.length; p++) {
      var pr = s.practice[p];
      h += '<li><b>' + link(pr.url, pr.name) + '</b><span class="li-note">' + esc(pr.task) + '</span></li>';
    }
    h += '</ul></div>';

    h += '<div class="sd-block"><h4><span class="ico">⑤</span>阶段作业（必须交）</h4><ul class="list-clean">';
    for (var w = 0; w < s.homework.length; w++) h += '<li>' + esc(s.homework[w]) + '</li>';
    h += '</ul></div>';

    h += '<div class="sd-block"><h4><span class="ico">⑥</span>什么标准才算过关</h4><div class="pass-box"><b>通关标准：</b>' + esc(s.pass) + '</div>';
    if (s.units.length) {
      h += '<div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap">';
      for (var u = 0; u < s.units.length; u++) {
        h += '<a class="btn btn-sm" href="#/unit/' + esc(s.units[u]) + '">做 ' + esc(s.units[u]) + ' 的题 →</a>';
      }
      h += '</div>';
    }
    h += '<div class="tip-box"><b>提醒：</b>' + esc(s.tip) + '</div></div>';
    h += '</div>';

    h += '<div class="sd-nav">' +
      (s.no > 1 ? '<a class="btn" href="#/stage/' + (s.no - 1) + '">← 上一步</a>' : '<a class="btn" href="#/overview">← 返回总览</a>') +
      (s.no < R.stages.length ? '<a class="btn btn-primary" href="#/stage/' + (s.no + 1) + '">下一步 →</a>' : '<a class="btn btn-primary" href="#/bank">去做题 →</a>') +
      '</div>';
    return h;
  }

  /* ---------------- 页面：题库首页 ---------------- */
  function bankPage() {
    var h = '<div class="page-head"><div class="eyebrow">QUESTION BANK</div><h2>题库 · 分单元 / 分专业</h2>' +
      '<p>共 ' + QS.length + ' 道题与作业。点任意题目可展开答案、解析和参考代码；标记「已掌握」后进度自动保存。</p></div>';
    h += '<div class="hero" style="background:linear-gradient(120deg,#3b3f8f,#6254c9)"><h3>两条路径，点进去就有</h3>' +
      '<p>「按单元」跟着课程进度一关一关刷；「按专业」选定方向后集中做该方向的实战题和项目作业。题目是同一批，只是两种切法。</p></div>';
    h += '<div style="margin:14px 0 4px;display:flex;gap:9px;flex-wrap:wrap">' +
      '<a class="btn btn-sm" href="Python题库总表.csv" download>下载全量题库 CSV（' + QS.length + ' 题，Excel 可直接打开）</a>' +
      '<a class="btn btn-sm" href="#/daily">今日随机 5 题</a></div>';

    h += '<div class="section-title"><span class="bar"></span>按单元 · 基础（U0~U9） <small>建议按顺序做</small></div>';
    h += '<div class="unit-grid">';
    for (var i = 0; i < R.units.length; i++) {
      var u = R.units[i];
      if (u.id.indexOf('P-') === 0) continue;
      h += unitTile(u);
    }
    h += '</div>';

    h += '<div class="section-title"><span class="bar"></span>按单元 · 方向实战（P 系列） <small>第四步再开始</small></div>';
    h += '<div class="unit-grid">';
    for (var j = 0; j < R.units.length; j++) {
      var pu = R.units[j];
      if (pu.id.indexOf('P-') !== 0) continue;
      h += unitTile(pu);
    }
    h += '</div>';

    h += '<div class="section-title"><span class="bar"></span>按专业 <small>一次只选一个方向</small></div>';
    h += '<div class="major-grid">';
    for (var k = 0; k < R.majors.length; k++) h += majorCard(R.majors[k]);
    h += '</div>';
    return h;
  }
  function unitTile(u) {
    var list = qsOfUnit(u.id), d = doneCount(list), p = pct(d, list.length);
    return '<a class="card unit-tile" href="#/unit/' + esc(u.id) + '">' +
      '<div class="ut-id">' + esc(u.id) + ' · ' + esc(u.weeks) + '</div>' +
      '<div class="ut-name">' + esc(u.name) + '</div>' +
      '<div class="ut-desc">' + esc(u.desc) + '</div>' +
      '<div class="ut-foot"><span>' + list.length + ' 题</span><div class="mini-bar"><div style="width:' + p + '%"></div></div><span>' + p + '%</span></div></a>';
  }
  function majorCard(m) {
    var list = qsOfMajor(m.id), d = doneCount(list);
    return '<a class="card major-card" href="#/major/' + esc(m.id) + '">' +
      '<div class="mc-stripe" style="background:' + m.color + '"></div>' +
      '<h4>' + esc(m.name) + '</h4><p>' + esc(m.desc) + '</p>' +
      '<div class="mc-line"><b>跟谁学：</b>' + esc(m.teacher) + '</div>' +
      '<div class="mc-line"><b>配套书：</b>' + esc(m.book) + '</div>' +
      '<div class="mc-line" style="margin-top:10px;color:' + m.color + ';font-weight:600">' + list.length + ' 道题 · 已掌握 ' + d + ' 题 →</div></a>';
  }

  /* ---------------- 页面：单元 / 专业 / 搜索 / 每日 ---------------- */
  function unitPage(uid) {
    var u = unitOf(uid), list = qsOfUnit(uid);
    if (!list.length) return '<div class="empty">这个单元暂无题目</div>';
    var d = doneCount(list), p = pct(d, list.length);
    var h = '<div class="page-head"><div class="eyebrow">UNIT ' + esc(uid) + '</div><h2>' + esc(u.name) + '</h2><p>' + esc(u.desc) + '</p></div>';
    h += '<div class="card unit-hero"><h3>' + esc(uid) + ' · ' + esc(u.name) + '</h3>' +
      '<div class="muted" style="font-size:12.5px">建议时间：' + esc(u.weeks) + ' ｜ 共 ' + list.length + ' 题 ｜ 已掌握 ' + d + ' 题</div>' +
      '<div class="unit-bar"><div style="width:' + p + '%"></div></div>' +
      '<div class="tiny" style="margin-top:8px">完成度 ' + p + '%　·　题目类型：' + typeSummary(list) + '</div></div>';
    h += '<div style="margin-bottom:14px;display:flex;gap:8px;flex-wrap:wrap">' +
      '<a class="btn btn-sm" href="#/bank">← 题库首页</a>' + neighborUnit(uid) + '</div>';
    h += questionList(list, 'unit/' + uid);
    return h;
  }
  function neighborUnit(uid) {
    var idx = -1;
    for (var i = 0; i < R.units.length; i++) if (R.units[i].id === uid) idx = i;
    var h = '';
    if (idx > 0) h += '<a class="btn btn-sm" href="#/unit/' + esc(R.units[idx - 1].id) + '">← 上一单元</a>';
    if (idx >= 0 && idx < R.units.length - 1) h += '<a class="btn btn-sm" href="#/unit/' + esc(R.units[idx + 1].id) + '">下一单元 →</a>';
    return h;
  }
  function typeSummary(list) {
    var map = {}, arr = [];
    for (var i = 0; i < list.length; i++) map[list[i].t] = (map[list[i].t] || 0) + 1;
    for (var k in map) if (map.hasOwnProperty(k)) arr.push(TYPE_NAME[k] + ' ' + map[k]);
    return arr.join(' / ');
  }

  function majorPage(mid) {
    var m = majorOf(mid);
    if (!m) return '<div class="empty">没有找到这个专业方向</div>';
    var list = qsOfMajor(mid), d = doneCount(list), p = pct(d, list.length);
    var h = '<div class="page-head"><div class="eyebrow">MAJOR</div><h2>' + esc(m.name) + '</h2><p>' + esc(m.desc) + '</p></div>';
    h += '<div class="card unit-hero" style="border-left-color:' + m.color + '">' +
      '<h3>方向路线：' + esc(m.name) + '</h3>' +
      '<div style="font-size:12.5px" class="muted"><b>跟谁学：</b>' + esc(m.teacher) + '<br><b>配套书 / 资料：</b>' + esc(m.book) + '</div>' +
      '<div class="tiny" style="margin-top:10px">共 ' + list.length + ' 题（含通用基础打标签题与方向专属题、项目作业）｜ 已掌握 ' + d + ' 题</div>' +
      '<div class="unit-bar"><div style="width:' + p + '%"></div></div></div>';
    h += '<div class="card pad muted" style="margin-bottom:14px;font-size:12.5px">' +
      '通用基础题（U0~U9，共 ' + QS.filter(function (q) { return q.u.indexOf('P-') !== 0; }).length + ' 题）是所有方向的共同地基，' +
      '建议先在 <a href="#/bank">按单元题库</a> 把 U0~U7 做完，再集中攻这个方向。本页已自动收录与该方向相关的基础题。</div>';
    h += '<div style="margin-bottom:14px"><a class="btn btn-sm" href="#/bank">← 返回题库首页</a></div>';
    h += questionList(list, 'major/' + mid);
    return h;
  }

  function searchPage(kw) {
    var key = kw.trim().toLowerCase();
    if (!key) return '<div class="empty">请输入关键词</div>';
    var list = QS.filter(function (q) {
      var hay = (q.id + ' ' + q.q + ' ' + (q.o ? q.o.join(' ') : '') + ' ' + (q.e || '') + ' ' + (q.c || '') + ' ' + unitName(q.u) + ' ' + majorNames(q.m).join(' ')).toLowerCase();
      return hay.indexOf(key) >= 0;
    });
    var h = '<div class="page-head"><div class="eyebrow">SEARCH</div><h2>搜索：' + esc(kw) + '</h2><p>命中 ' + list.length + ' 道题（题干 / 选项 / 解析 / 代码 / 单元 / 专业）。</p></div>';
    h += '<div style="margin-bottom:14px"><a class="btn btn-sm" href="#/bank">← 返回题库</a></div>';
    h += questionList(list, 'search/' + kw);
    return h;
  }

  function dailyPage() {
    var pool = QS.filter(function (q) { return st(q.id) !== 'done' && q.t !== 'project'; });
    if (pool.length < 5) pool = QS.filter(function (q) { return q.t !== 'project'; });
    var picked = [], used = {};
    var guard = 0;
    while (picked.length < 5 && guard < 500) {
      guard++;
      var q = pool[Math.floor(Math.random() * pool.length)];
      if (!q || used[q.id]) continue;
      used[q.id] = 1; picked.push(q);
    }
    var d = new Date();
    var ds = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    var h = '<div class="page-head"><div class="eyebrow">DAILY PRACTICE</div><h2>今日随机 5 题 · ' + ds + '</h2>' +
      '<p>从你还没标记「已掌握」的题目里随机抽取。先自己想，再点开对答案，错的标记「需复习」。</p></div>';
    h += '<div style="margin-bottom:14px;display:flex;gap:8px"><button class="btn btn-sm" data-act="daily-refresh">换一组</button><a class="btn btn-sm" href="#/bank">题库首页</a></div>';
    h += questionList(picked, 'daily');
    return h;
  }

  /* ---------------- 题目列表与卡片 ---------------- */
  function questionList(list, scope) {
    state.currentList = list;
    var filtered = applyFilter(list);
    var h = '<div class="card bank-toolbar">' +
      '<div class="seg" data-seg="status">' + segBtns('status', [['all', '全部'], ['todo', '未做'], ['done', '已掌握'], ['review', '需复习']]) + '</div>' +
      '<div class="seg" data-seg="type">' + segBtns('type', [['all', '全部类型'], ['single', '单选'], ['multi', '多选'], ['judge', '判断'], ['blank', '填空'], ['code', '编程'], ['project', '作业']]) + '</div>' +
      '<select id="fLevel"><option value="all">全部难度</option><option value="1">★ 基础</option><option value="2">★★ 进阶</option><option value="3">★★★ 挑战</option></select>' +
      '<span class="spacer"></span><span class="bank-summary">显示 ' + filtered.length + ' / ' + list.length + ' 题</span>' +
      '<button class="btn btn-sm" data-act="export-csv" data-scope="' + esc(scope) + '">导出本页题库 CSV</button>' +
      '</div>';
    if (!filtered.length) return h + '<div class="card empty">当前筛选下没有题目，换个条件试试。</div>';
    for (var i = 0; i < filtered.length; i++) h += qCard(filtered[i]);
    return h;
  }
  function segBtns(kind, pairs) {
    var s = '';
    for (var i = 0; i < pairs.length; i++) {
      s += '<button data-act="filter" data-kind="' + kind + '" data-val="' + pairs[i][0] + '" class="' + (state.filter[kind] === pairs[i][0] ? 'on' : '') + '">' + pairs[i][1] + '</button>';
    }
    return s;
  }
  function applyFilter(list) {
    var f = state.filter;
    return list.filter(function (q) {
      if (f.status === 'todo' && st(q.id)) return false;
      if (f.status === 'done' && st(q.id) !== 'done') return false;
      if (f.status === 'review' && st(q.id) !== 'review') return false;
      if (f.type !== 'all' && q.t !== f.type) return false;
      if (f.lv !== 'all' && String(q.lv) !== String(f.lv)) return false;
      return true;
    });
  }
  function qCard(q) {
    var s = st(q.id), open = !!state.open[q.id];
    var h = '<div class="card q-card' + (open ? ' open' : '') + '" id="qcard-' + esc(q.id) + '">';
    h += '<div class="q-head" data-act="toggle" data-id="' + esc(q.id) + '">' +
      '<div class="q-idx">' + esc(q.id) + '</div><div class="q-main">' +
      '<div class="q-stem">' + esc(q.q) + '</div><div class="q-meta">' +
      '<span class="badge b-type">' + TYPE_NAME[q.t] + '</span>' +
      '<span class="badge b-lv">' + stars(q.lv) + '</span>' +
      '<span class="badge b-unit">' + esc(q.u) + ' ' + esc(unitName(q.u)) + '</span>';
    for (var i = 0; i < q.m.length; i++) {
      h += '<span class="badge b-major">' + (q.m[i] === 'common' ? '通用基础' : esc(majorOf(q.m[i]) ? majorOf(q.m[i]).name : q.m[i])) + '</span>';
    }
    if (s) h += '<span class="badge ' + (s === 'done' ? 'b-state-done' : 'b-state-review') + '">' + STATUS_NAME[s] + '</span>';
    h += '</div></div><div class="q-arrow">▶</div></div>';

    h += '<div class="q-body">';
    if (q.o && q.o.length) {
      h += '<ul class="q-options">';
      for (var j = 0; j < q.o.length; j++) {
        h += '<li><span class="op-k">' + String.fromCharCode(65 + j) + '</span><span>' + esc(q.o[j]) + '</span></li>';
      }
      h += '</ul>';
    }
    if (!state.reveal[q.id]) {
      h += '<div class="reveal-btn"><button class="btn btn-primary btn-sm" data-act="reveal" data-id="' + esc(q.id) + '">先自己想，再点这里看答案 / 解析 / 参考代码</button></div>';
    } else {
      h += '<div class="answer-holder"><div class="answer-box"><span class="lbl">' + (q.t === 'project' ? '验收标准' : '参考答案') + '</span>' +
        '<div class="txt">' + esc(answerText(q)) + '</div></div></div>';
      if (q.e) h += '<div class="explain-box"><span class="lbl">' + (q.t === 'project' ? '实施提示' : '解析') + '</span>' + esc(q.e) + '</div>';
      if (q.c) {
        h += '<div class="code-wrap"><button class="btn btn-sm code-copy" data-act="copy" data-id="' + esc(q.id) + '">复制代码</button><pre>' + esc(q.c) + '</pre></div>';
      }
    }
    h += '<div class="q-actions">' +
      '<button class="btn btn-sm ' + (s === 'done' ? 'btn-green' : '') + '" data-act="mark" data-id="' + esc(q.id) + '" data-val="done">✓ 已掌握</button>' +
      '<button class="btn btn-sm ' + (s === 'review' ? 'btn-warn' : '') + '" data-act="mark" data-id="' + esc(q.id) + '" data-val="review">↻ 需复习</button>' +
      (s ? '<button class="btn btn-sm btn-ghost" data-act="mark" data-id="' + esc(q.id) + '" data-val="">重置</button>' : '') +
      '<span class="hint">' + (q.t === 'project' ? '项目作业建议在本地建文件真正做一遍' : '编程题请复制到本地 .py 文件运行一遍') + '</span></div>';
    h += '</div></div>';
    return h;
  }

  /* ---------------- 资源 / 进度 ---------------- */
  function resourcesPage() {
    var h = '<div class="page-head"><div class="eyebrow">RESOURCES</div><h2>资源地图</h2>' +
      '<p>中文课程、文字教程、刷题平台、工程化工具，按用途分好类，点击即可打开。</p></div>';
    h += '<div class="verdict-box vb-blue"><b>按你的要求调整过</b><p>本页不再展示书籍；图片右侧橙圈的网站已单独做成 ' +
      '<a href="#/resnav">「学习资源一键直达」</a>；纯英文课程已移到 <a href="#/english">「纯英文课程 · 待解锁」</a>暂存，现在不作为学习任务。</p></div>';
    for (var i = 0; i < R.resources.length; i++) {
      var g = R.resources[i];
      if (/书/.test(g.cat)) continue;                       // 用户要求：不放书籍
      var shown = g.items.filter(function (x) {
        return !/CS50P|Python for Everybody|Kaggle Learn/.test(x.n); // 纯英文课移入待解锁
      });
      h += '<div class="res-group"><div class="section-title" style="margin-top:8px"><span class="bar"></span>' + esc(g.cat) + ' <small>' + shown.length + ' 个</small></div><div class="res-list">';
      for (var j = 0; j < shown.length; j++) {
        var it = shown[j];
        h += '<a class="card res-item" href="' + esc(it.u) + '" target="_blank" rel="noopener">' +
          '<span class="rn">' + esc(it.n) + ' ↗</span><span class="rd">' + esc(it.d) + '</span></a>';
      }
      h += '</div></div>';
    }
    h += '<div class="tip-box">外部平台的题量参考（2026 年）：Exercism Python 约 146 题 / 17 个概念；PYnative 800+ 题分 29 个主题；Practice Python 40 道入门题；Codewars 数千 kata。本平台题库负责把它们按「单元 × 专业」串成一条可执行的主线。</div>';
    return h;
  }

  function progressPage() {
    var nDone = 0, nReview = 0;
    for (var i = 0; i < QS.length; i++) {
      if (st(QS[i].id) === 'done') nDone++;
      if (st(QS[i].id) === 'review') nReview++;
    }
    var p = pct(nDone, QS.length), deg = Math.round(p * 3.6);
    var h = '<div class="page-head"><div class="eyebrow">PROGRESS</div><h2>我的进度</h2><p>进度保存在本机浏览器 localStorage，不上传任何服务器。</p></div>';
    h += '<div class="card prog-big"><div class="ring" style="background:conic-gradient(#2563eb ' + deg + 'deg,#e9eef6 ' + deg + 'deg)">' +
      '<div class="ring-txt"><b>' + p + '%</b><span>' + nDone + ' / ' + QS.length + ' 题</span></div></div>' +
      '<div><div class="grid g3" style="gap:10px">' +
      statCard('已掌握', nDone + ' 题', '绿色标记') + statCard('需复习', nReview + ' 题', '橙色标记') +
      statCard('未开始', (QS.length - nDone - nReview) + ' 题', '继续加油') + '</div>' +
      '<div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap">' +
      '<button class="btn btn-sm" data-act="export-progress">导出进度 JSON</button>' +
      '<button class="btn btn-sm" data-act="import-progress">导入进度</button>' +
      '<button class="btn btn-sm" data-act="reset-progress">清空进度</button>' +
      '<a class="btn btn-sm btn-primary" href="#/daily">随机练 5 题 →</a></div></div></div>';

    h += '<div class="section-title"><span class="bar"></span>按单元完成度</div><div class="card pad"><div class="prog-rows">';
    for (var u = 0; u < R.units.length; u++) {
      var un = R.units[u], l1 = qsOfUnit(un.id), d1 = doneCount(l1);
      h += progRow('#/unit/' + un.id, un.id + ' ' + un.name, d1, l1.length);
    }
    h += '</div></div>';

    h += '<div class="section-title"><span class="bar"></span>按专业完成度</div><div class="card pad"><div class="prog-rows">';
    for (var m = 0; m < R.majors.length; m++) {
      var mj = R.majors[m], l2 = qsOfMajor(mj.id), d2 = doneCount(l2);
      h += progRow('#/major/' + mj.id, mj.name, d2, l2.length);
    }
    h += '</div></div>';

    var review = QS.filter(function (q) { return st(q.id) === 'review'; });
    h += '<div class="section-title"><span class="bar"></span>需复习清单 <small>' + review.length + ' 题</small></div>';
    if (!review.length) {
      h += '<div class="card empty">还没有标记「需复习」的题目。做题时点一下橙色按钮，这里会自动汇总。</div>';
    } else {
      h += '<div class="card pad"><ul class="list-clean">';
      for (var r = 0; r < Math.min(review.length, 30); r++) {
        var q = review[r];
        h += '<li><a href="#/unit/' + esc(q.u) + '">' + esc(q.id) + ' · ' + esc(q.q) + '</a></li>';
      }
      if (review.length > 30) h += '<li class="tiny">仅显示前 30 题，其余请到对应单元查看。</li>';
      h += '</ul></div>';
    }
    return h;
  }
  function progRow(href, name, a, b) {
    return '<a class="prog-row" href="' + esc(href) + '"><span class="pr-name">' + esc(name) + '</span>' +
      '<span class="pr-bar"><div style="width:' + pct(a, b) + '%"></div></span>' +
      '<span class="pr-num">' + a + '/' + b + '</span></a>';
  }

  /* ---------------- 图片路线核对 / 资源导航 / 中文课对比 / 纯英文待解锁 ---------------- */
  var VKEY = 'python_vocab_v1', PKEY = 'python_project_v1';
  var vocabKw = '';
  function P() {
    return window.PLAN_MAP || { stages: [], resources: [], vocab: [], advice: [], compare: { rows: [], conclusion: [] }, english: { unlock: [], slots: [] } };
  }
  function loadJ(k, d) { try { var o = JSON.parse(localStorage.getItem(k) || 'null'); return o || d; } catch (e) { return d; } }
  function saveJ(k, o) { try { localStorage.setItem(k, JSON.stringify(o)); } catch (e) {} }
  function vocabMap() { return loadJ(VKEY, {}); }
  function classStore() { return loadJ('python_classroom_v1', { done: {}, terms: {} }); }
  function vocabCount() {
    var v = vocabMap(), n = 0, k;
    for (k in v) if (v.hasOwnProperty(k) && v[k]) n++;
    var t = classStore().terms || {};
    for (k in t) if (t.hasOwnProperty(k) && t[k]) n++;
    return n;
  }
  function stBadge(s) {
    if (s === 'full') return '<span class="st-badge st-full">✓ 原本已覆盖</span>';
    if (s === 'part') return '<span class="st-badge st-part">◐ 已补要点</span>';
    return '<span class="st-badge st-none">＋ 新增补齐课</span>';
  }
  function gapLessonFor(t) {
    var m = [
      [/装饰器进阶|上下文管理器|contextlib|with 原理/, 6],
      [/迭代器协议|生成器表达式/, 3],
      [/函数进阶|匿名函数|递归|装饰器|生成器/, 2],
      [/环境安装|Anaconda|PyCharm/, 1],
      [/常用标准库|os、sys|math、random|模块与包/, 4],
      [/深入面向对象|抽象基类|元类|设计模式/, 5],
      [/多线程|threading|生产者消费者/, 7],
      [/多进程|进程池/, 8],
      [/网络编程|socket|HTTP/, 9],
      [/数据库|SQL|sqlite3|SQLAlchemy/, 10],
      [/日志|Web 开发|RESTful|数据可视化|爬虫进阶|自动化办公|unittest|项目部署|Nginx|Docker|电商数据分析|多线程下载器|批量重命名/, 11],
      [/底层原理|GIL|性能优化|异步|工程化能力|开源贡献|领域深入|结语/, 12]
    ];
    for (var i = 0; i < m.length; i++) if (m[i][0].test(t)) return m[i][1];
    return 0;
  }
  function planStats() {
    var D = P(), o = { total: 0, full: 0, part: 0, none: 0 };
    for (var i = 0; i < D.stages.length; i++) for (var j = 0; j < D.stages[i].items.length; j++) {
      o.total++; var s = D.stages[i].items[j].s;
      if (s === 'full') o.full++; else if (s === 'part') o.part++; else o.none++;
    }
    return o;
  }

  /* 页面 1：图片课程逐条核对 */
  function coveragePage() {
    var D = P(), S = planStats(), h = '';
    h += '<div class="page-head"><div class="eyebrow">COVERAGE CHECK</div><h2>图片课程逐条核对</h2>' +
      '<p>来源：' + esc(D.source) + '。下图 5 个阶段的每一条知识点都拆开列在下面，标明原来有没有、现在补在哪里。</p></div>';
    h += '<div class="verdict-box"><b>核对结论</b><p>' + esc(D.verdict) + '</p></div>';
    h += '<div class="grid g4" style="margin-top:16px">' +
      statCard('图片知识点', S.total + ' 条', '5 个阶段逐条拆开') +
      statCard('原本已覆盖', S.full + ' 条', '直接进课堂 / 题库') +
      statCard('部分覆盖', S.part + ' 条', '已补要点 + 补齐课') +
      statCard('原本缺失', S.none + ' 条', '已补成 12 节中文课堂') + '</div>';
    h += '<div class="cov-actions"><button class="btn btn-sm" data-act="export-gaps">导出全部补齐讲义（Markdown）</button>' +
      '<a class="btn btn-sm btn-primary" href="course.html#/gap/1">打开补齐课堂 12 节 →</a></div>';

    for (var a = 0; a < D.stages.length; a++) {
      var sg = D.stages[a], ok = 0;
      for (var b = 0; b < sg.items.length; b++) if (sg.items[b].s === 'full') ok++;
      h += '<div class="section-title" style="margin-top:26px"><span class="bar" style="background:' + esc(sg.color) + '"></span>' +
        esc(sg.no) + ' ' + esc(sg.name) + ' <small>' + esc(sg.weeks) + ' · ' + esc(sg.goal) + ' · 原本完整覆盖 ' + ok + '/' + sg.items.length + '</small></div>';
      h += '<div class="card" style="overflow:hidden">';
      for (var c = 0; c < sg.items.length; c++) {
        var it = sg.items[c], g = gapLessonFor(it.t);
        h += '<div class="map-item">' +
          '<div class="mi-top">' + stBadge(it.s) + '<div class="mi-t">' + esc(it.t) + '</div></div>' +
          '<div class="mi-note">' + esc(it.n) + '</div>' +
          '<div class="mi-links"><a class="btn btn-sm" href="' + esc(it.w) + '">' + esc(it.wl) + ' →</a>' +
          (g ? '<a class="btn btn-sm btn-primary" href="course.html#/gap/' + g + '">补齐课 第 ' + g + ' 节 →</a>' : '') + '</div>';
        if (it.fix && it.fix.length) {
          h += '<details class="fix-box"><summary>展开补齐讲义（' + it.fix.length + ' 条要点）</summary><ul class="list-clean">';
          for (var f = 0; f < it.fix.length; f++) h += '<li>' + esc(it.fix[f]) + '</li>';
          h += '</ul></details>';
        }
        h += '</div>';
      }
      h += '</div>';
    }

    h += '<div class="section-title"><span class="bar"></span>图片里的「学习建议」 <small>6 条已收进平台（第 5 条原图被橙色划线遮挡，按可见文字还原）</small></div>';
    h += '<div class="card pad"><ul class="list-clean">';
    for (var d = 0; d < D.advice.length; d++) h += '<li>' + esc(D.advice[d]) + '</li>';
    h += '</ul></div>';

    h += '<div class="section-title"><span class="bar"></span>这条路线新增的英文专业词汇 <small>' + D.vocab.length + ' 个 · 课堂 288 个之外的补充</small></div>';
    h += '<div class="bank-toolbar"><input id="vocabSearch" type="text" placeholder="搜索英文词或中文释义，如 GIL、装饰器、Docker" autocomplete="off"></div>';
    h += '<div class="card" style="overflow:hidden"><table class="tbl" id="vocabTbl"><thead><tr>' +
      '<th style="width:32%">English</th><th style="width:12%">词性</th><th>中文释义</th><th style="width:150px"></th></tr></thead><tbody>';
    for (var v = 0; v < D.vocab.length; v++) {
      var w = D.vocab[v], marked = !!vocabMap()[w[0]];
      h += '<tr class="vocab-row"><td><b>' + esc(w[0]) + '</b></td><td>' + esc(w[1]) + '</td><td>' + esc(w[2]) + '</td>' +
        '<td><button class="btn btn-sm" data-act="speak-word" data-w="' + esc(w[0]) + '">🔊 朗读</button> ' +
        '<button class="btn btn-sm' + (marked ? ' vb-on' : '') + '" data-act="mark-vocab" data-w="' + esc(w[0]) + '">' +
        (marked ? '✓ 已记住' : '标记记住') + '</button></td></tr>';
    }
    h += '</tbody></table></div>';
    h += '<div class="tip-box">每节课堂右栏 6 个词 + 补齐课堂 12 节 72 个词 + 本表 ' + D.vocab.length + ' 个词；' +
      '标记「已记住」会累计到「纯英文课程 · 待解锁」的解锁条件里。</div>';
    return h;
  }

  /* 页面 2：图片学习资源一键直达（不含书籍） */
  function resNavPage() {
    var D = P(), total = 0, h = '';
    for (var i = 0; i < D.resources.length; i++) total += D.resources[i].items.length;
    h += '<div class="page-head"><div class="eyebrow">RESOURCE LAUNCHER</div><h2>学习资源 · 一点就进</h2>' +
      '<p>按图片右侧橙圈「学习资源推荐」逐条做成可点击直达：官方网站、在线教程、练习平台、社区与工具，共 ' + total + ' 个站点。' +
      '新窗口打开，不离开学习平台。</p></div>';
    h += '<div class="verdict-box vb-blue"><b>按你的要求</b><p>只放网站，<b>不放书籍</b>（图片里的「经典书籍」一组已去掉）。' +
      '另外补了几个中文入口：Python 官方中文文档、鱼C论坛、Datawhale、Python123、Anaconda，都是能直接打开的网址。</p></div>';
    for (var g = 0; g < D.resources.length; g++) {
      var grp = D.resources[g];
      h += '<div class="section-title" style="margin-top:24px"><span class="bar" style="background:' + esc(grp.color) + '"></span>' +
        '<span style="margin-right:6px">' + grp.icon + '</span>' + esc(grp.g) + ' <small>' + grp.items.length + ' 个站点</small></div>';
      h += '<div class="resnav-grid">';
      for (var j = 0; j < grp.items.length; j++) {
        var it = grp.items[j], inner = it.u.indexOf('http') !== 0;
        var host = inner ? '本平台内页' : it.u.replace(/^https?:\/\//, '').split('/')[0];
        h += '<a class="resnav-card" href="' + esc(it.u) + '"' + (inner ? '' : ' target="_blank" rel="noopener"') +
          ' style="--rc:' + esc(grp.color) + '">' +
          '<div class="rc-top"><span class="rc-name">' + esc(it.n) + '</span><span class="rc-arrow">' + (inner ? '→' : '↗') + '</span></div>' +
          '<div class="rc-d">' + esc(it.d) + '</div>' +
          '<div class="rc-url">' + esc(host) + '</div></a>';
      }
      h += '</div>';
    }
    h += '<div class="tip-box">练习顺序建议：本平台题库（带答案，按单元/专业）→ 牛客网 / LeetCode 中文站（中文界面）→ Python Challenge 与 Codewars（英文，等术语攒够再上）。' +
      '报错先搜 Stack Overflow，装包去 PyPI，找项目去 GitHub。</div>';
    return h;
  }

  /* 页面 3：三家中文课对比 */
  function comparePage() {
    var D = P(), C = D.compare, h = '';
    h += '<div class="page-head"><div class="eyebrow">WHICH COURSE</div><h2>小甲鱼 / 廖雪峰 / 黑马程序员，选哪个？</h2>' +
      '<p>你现在英语还没起来、又要零基础入门，这不是「哪个最好」，而是「哪个当主线、哪个当工具」。</p></div>';
    h += '<div class="verdict-box"><b>直接结论</b><p>' + esc(C.verdict) + '</p></div>';
    h += '<div class="cmp-grid">';
    for (var i = 0; i < C.rows.length; i++) {
      var r = C.rows[i];
      h += '<div class="card cmp-card' + (i === 0 ? ' cmp-pick' : '') + '">' +
        '<div class="cmp-role">' + esc(r.role) + '</div>' +
        '<div class="cmp-name">' + esc(r.n) + '</div>' +
        '<div class="cmp-lang">' + esc(r.lang) + '</div>' +
        '<div class="cmp-line"><b>优点</b><p>' + esc(r.good) + '</p></div>' +
        '<div class="cmp-line"><b>短板</b><p>' + esc(r.bad) + '</p></div>' +
        '<div class="cmp-line"><b>适合</b><p>' + esc(r.fit) + '</p></div>' +
        link(r.url, '打开课程 ↗', 'btn btn-sm') + '</div>';
    }
    h += '</div>';
    h += '<div class="section-title"><span class="bar"></span>一页对照表</div>';
    h += '<div class="card" style="overflow:hidden"><table class="tbl"><thead><tr>' +
      '<th style="width:20%">对比维度</th><th>小甲鱼</th><th>黑马程序员</th><th>廖雪峰</th></tr></thead><tbody>' +
      '<tr><td><b>语言 / 形式</b></td><td>中文视频</td><td>中文视频</td><td>中文文字</td></tr>' +
      '<tr><td><b>零基础友好度</b></td><td>★★★★★</td><td>★★★☆☆</td><td>★★★☆☆</td></tr>' +
      '<tr><td><b>体系完整度</b></td><td>★★★☆☆（基础强）</td><td>★★★★★（含进阶/就业）</td><td>★★★☆☆</td></tr>' +
      '<tr><td><b>配套练习</b></td><td>论坛每讲课后题</td><td>随堂练习 + 项目多</td><td>几乎没有</td></tr>' +
      '<tr><td><b>最大风险</b></td><td>B 站旧合集更新不全</td><td>600 集太长易劝退</td><td>看懂了写不出来</td></tr>' +
      '<tr><td><b>本平台定位</b></td><td>第一阶段主线</td><td>第二阶段主线</td><td>查漏补缺的字典</td></tr>' +
      '</tbody></table></div>';
    h += '<div class="section-title"><span class="bar"></span>照这个顺序学就行</div>';
    h += '<div class="card pad"><ul class="list-clean">';
    for (var k = 0; k < C.conclusion.length; k++) h += '<li>' + esc(C.conclusion[k]) + '</li>';
    h += '</ul><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px">' +
      '<a class="btn btn-sm btn-primary" href="course.html#/intro/1">① 小甲鱼入门 →</a>' +
      '<a class="btn btn-sm" href="course.html#/adv/1">② 黑马进阶 →</a>' +
      '<a class="btn btn-sm" href="course.html#/project/1">③ 中文实战 →</a>' +
      '<a class="btn btn-sm" href="#/coverage">看图片课程核对 →</a></div></div>';
    return h;
  }

  /* 页面 4：纯英文课程 · 待解锁 */
  function englishPage() {
    var E = P().english, h = '';
    var done = doneCount(QS), qPct = pct(done, QS.length);
    var vc = vocabCount(), vPct = Math.min(100, pct(vc, 150));
    var pj = loadJ(PKEY, {}), pOk = !!pj.ok;
    var allOk = pOk && qPct >= 80 && vc >= 150;
    h += '<div class="page-head"><div class="eyebrow">ENGLISH TRACK</div><h2>' + esc(E.title) + '</h2>' +
      '<p>' + esc(E.rule) + '</p></div>';
    h += '<div class="verdict-box ' + (allOk ? '' : 'vb-purple') + '"><b>' +
      (allOk ? '✓ 解锁条件已达成，可以告诉我英文课程名单了' : '现在先不排英文课，技能与词汇攒够再开') +
      '</b><p>本模块框架已经做好，4 个课程槽位先空着：' +
      '你到时候说要哪些英文课，我再逐节做目录、练习和英文术语，不用现在决定。</p></div>';
    h += '<div class="section-title"><span class="bar"></span>解锁条件与当前进度 <small>进度自动保存在本机</small></div>';
    h += '<div class="unlock-grid">' +
      unlockCard('① ' + E.unlock[0].k, E.unlock[0].d, pOk ? 100 : 0, pOk ? '已完成' : '未完成',
        'data-act="toggle-project"', pOk ? '✓ 已自评完成（点击撤销）' : '我已完成一个完整项目') +
      unlockCard('② ' + E.unlock[1].k, E.unlock[1].d, qPct, done + ' / ' + QS.length + ' 题（' + qPct + '%）',
        '', '') +
      unlockCard('③ ' + E.unlock[2].k, E.unlock[2].d, vPct, vc + ' / 150 个（' + vPct + '%）', '', '') +
      '</div>';
    h += '<div class="tip-box">题库掌握率来自「我的进度」里标记「已掌握」的题；词汇数 = 课堂右栏标记「已记住」的术语 + 图片词汇表里标记的词。' +
      '三个条件都满足后，本页会提示解锁。</div>';
    h += '<div class="section-title"><span class="bar"></span>课程槽位 <small>4 个空位，等你指定名单</small></div>';
    h += '<div class="slot-grid">';
    for (var i = 0; i < E.slots.length; i++) {
      h += '<div class="card slot-card"><span class="slot-no">SLOT ' + E.slots[i].no + '</span>' +
        '<div class="slot-lock">🔒</div><div class="slot-hint">' + esc(E.slots[i].hint) + '</div>' +
        '<div class="slot-line"></div><div class="slot-line short"></div></div>';
    }
    h += '</div>';
    if (E.parking && E.parking.length) {
      h += '<div class="section-title"><span class="bar"></span>英文资源暂存区 <small>仅存档，现在不用点开，也不算学习任务</small></div>';
      h += '<div class="resnav-grid">';
      for (var z = 0; z < E.parking.length; z++) {
        var pk = E.parking[z];
        h += '<a class="resnav-card" href="' + esc(pk.u) + '" target="_blank" rel="noopener" style="--rc:#7c3aed">' +
          '<div class="rc-top"><span class="rc-name">' + esc(pk.n) + '</span><span class="rc-arrow">↗</span></div>' +
          '<div class="rc-d">' + esc(pk.d) + '</div>' +
          '<div class="rc-url">解锁后再学 · 可先收藏</div></a>';
      }
      h += '</div>';
    }
    h += '<div class="section-title"><span class="bar"></span>说明</div>';
    h += '<div class="card pad"><p style="margin:0 0 10px">' + esc(E.note) + '</p>' +
      '<p style="margin:0" class="muted">过渡建议：中文课阶段每节右栏的 6 个英文术语照常学，' +
      '先做到「看英文报错和文档不慌」，再切纯英文课程，比直接硬啃效率高得多。</p></div>';
    h += '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px">' +
      '<a class="btn btn-sm btn-primary" href="course.html#/intro/1">继续中文主线 →</a>' +
      '<a class="btn btn-sm" href="#/coverage">去积累词汇 →</a>' +
      '<a class="btn btn-sm" href="#/progress">看我的进度 →</a></div>';
    return h;
  }
  function unlockCard(title, desc, p, label, act, btn) {
    return '<div class="card unlock-card"><div class="uc-t">' + esc(title) + '</div>' +
      '<div class="uc-d">' + esc(desc) + '</div>' +
      '<div class="uc-track"><div style="width:' + p + '%"></div></div>' +
      '<div class="uc-num">' + esc(label) + '</div>' +
      (btn ? '<button class="btn btn-sm" ' + act + '>' + esc(btn) + '</button>' : '') + '</div>';
  }

  function applyVocabFilter(kw) {
    var rows = document.querySelectorAll('.vocab-row');
    if (!rows.length) return;
    var k = (kw || '').toLowerCase();
    for (var i = 0; i < rows.length; i++) {
      rows[i].style.display = (!k || rows[i].textContent.toLowerCase().indexOf(k) >= 0) ? '' : 'none';
    }
  }
  function speakWord(w) {
    try {
      if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) { toast('当前浏览器不支持朗读，建议用 Chrome / 360 极速模式'); return; }
      var u = new SpeechSynthesisUtterance(w);
      u.lang = 'en-US'; u.rate = 0.85;
      window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
      toast('朗读：' + w);
    } catch (e) { toast('朗读失败，请检查浏览器语音设置'); }
  }
  function exportGaps() {
    var D = P(), lines = ['# 图片路线补齐讲义', '', '来源：' + D.source, '整理日期：' + D.updated, ''];
    for (var a = 0; a < D.stages.length; a++) {
      var sg = D.stages[a];
      lines.push('## ' + sg.no + ' ' + sg.name + '（' + sg.weeks + '）', '', '目标：' + sg.goal, '');
      for (var b = 0; b < sg.items.length; b++) {
        var it = sg.items[b];
        if (it.s === 'full') continue;
        lines.push('### ' + it.t);
        lines.push('状态：' + (it.s === 'part' ? '部分覆盖' : '原本缺失') + '；说明：' + it.n);
        lines.push('对应：' + it.wl + '（' + it.w + '）');
        var g = gapLessonFor(it.t);
        if (g) lines.push('补齐课堂：第 ' + g + ' 节（course.html#/gap/' + g + '）');
        if (it.fix && it.fix.length) { lines.push(''); for (var f = 0; f < it.fix.length; f++) lines.push('- ' + it.fix[f]); }
        lines.push('');
      }
    }
    lines.push('## 学习建议', '');
    for (var c = 0; c < D.advice.length; c++) lines.push('- ' + D.advice[c]);
    download(lines.join('\n'), 'Python图片路线补齐讲义.md', 'text/markdown;charset=utf-8');
    toast('补齐讲义已导出');
  }

  /* ---------------- 路由 ---------------- */
  function render(keepScroll) {
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    var hash = location.hash.replace(/^#\/?/, '');
    var parts = hash.split('/');
    var view = $('#view'), html = '';
    if (!hash || hash === 'overview') html = overview();
    else if (hash === 'roadmap') html = roadmapPage();
    else if (parts[0] === 'stage') html = stagePage(parts[1]);
    else if (hash === 'bank') html = bankPage();
    else if (parts[0] === 'unit') html = unitPage(parts[1]);
    else if (parts[0] === 'major') html = majorPage(parts[1]);
    else if (hash === 'coverage') html = coveragePage();
    else if (hash === 'resnav') html = resNavPage();
    else if (hash === 'compare') html = comparePage();
    else if (hash === 'english') html = englishPage();
    else if (hash === 'resources') html = resourcesPage();
    else if (hash === 'progress') html = progressPage();
    else if (hash === 'daily') html = dailyPage();
    else if (parts[0] === 'search') {
      var kw = ''; try { kw = decodeURIComponent(parts.slice(1).join('/')); } catch (e) { kw = parts.slice(1).join('/'); }
      html = searchPage(kw);
    } else html = overview();
    view.innerHTML = html;
    var lv = $('#fLevel');
    if (lv) lv.value = state.filter.lv;
    renderTopProgress();
    markActive();
    var vs = $('#vocabSearch');
    if (vs) { vs.value = vocabKw; applyVocabFilter(vocabKw); }
    $('#sidebar').className = 'sidebar';
    if (keepScroll === true) window.scrollTo(0, y);
    else window.scrollTo(0, 0);
  }

  /* ---------------- CSV / 进度导出 ---------------- */
  function csvCell(v) { return '"' + String(v === undefined || v === null ? '' : v).replace(/"/g, '""') + '"'; }
  function exportCSV(scope) {
    var list = state.currentList && state.currentList.length ? state.currentList : QS;
    if (!list.length) { toast('当前范围没有题目'); return; }
    var rows = [['单元', '专业方向', '编号', '类型', '难度', '题干/作业要求', '选项', '答案/验收标准', '解析/实施提示', '参考代码', '我的状态']];
    for (var i = 0; i < list.length; i++) {
      var q = list[i];
      rows.push([
        q.u + ' ' + unitName(q.u), majorNames(q.m).join('、'), q.id, TYPE_NAME[q.t], stars(q.lv),
        q.q, q.o ? q.o.map(function (o, j) { return String.fromCharCode(65 + j) + '. ' + o; }).join('\n') : '',
        q.t === 'project' ? q.a : answerText(q), q.e || '', q.c || '', STATUS_NAME[st(q.id)] || '未做'
      ]);
    }
    var csv = '\ufeff' + rows.map(function (r) { return r.map(csvCell).join(','); }).join('\r\n');
    download(csv, 'Python题库_' + scope.replace(/[\/\\]/g, '_') + '.csv', 'text/csv;charset=utf-8');
    toast('已导出 ' + list.length + ' 道题');
  }
  function download(content, name, mime) {
    try {
      var blob = new Blob([content], { type: mime });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = name; document.body.appendChild(a); a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    } catch (e) { toast('浏览器不支持下载，请换 Chrome / 360 极速模式'); }
  }
  function exportProgress() {
    download(JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), status: state.status }, null, 2), 'Python学习进度.json', 'application/json');
    toast('进度已导出');
  }
  function importProgress(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(reader.result);
        var obj = data && data.status ? data.status : data;
        var n = 0;
        for (var k in obj) if (obj.hasOwnProperty(k) && (obj[k] === 'done' || obj[k] === 'review')) { state.status[k] = obj[k]; n++; }
        saveStatus(); render(); toast('已导入 ' + n + ' 条进度');
      } catch (e) { toast('文件格式不对，请选择导出的 JSON'); }
    };
    reader.readAsText(file);
  }
  function copyCode(id) {
    var q = null;
    for (var i = 0; i < QS.length; i++) if (QS[i].id === id) q = QS[i];
    if (!q || !q.c) return;
    var ok = false;
    try {
      var ta = document.createElement('textarea');
      ta.value = q.c; ta.style.position = 'fixed'; ta.style.left = '-9999px';
      document.body.appendChild(ta); ta.select();
      ok = document.execCommand('copy');
      document.body.removeChild(ta);
    } catch (e) {}
    if (!ok && navigator.clipboard) {
      navigator.clipboard.writeText(q.c).then(function () { toast('代码已复制'); });
      return;
    }
    toast(ok ? '代码已复制，去本地 .py 里跑一遍' : '复制失败，请手动选中代码');
  }

  /* ---------------- 事件 ---------------- */
  document.addEventListener('click', function (e) {
    var t = e.target, el = null, guard = 0;
    while (t && guard < 8) {
      if (t.getAttribute && t.getAttribute('data-act')) { el = t; break; }
      t = t.parentNode; guard++;
    }
    if (!el) return;
    var act = el.getAttribute('data-act'), id = el.getAttribute('data-id');
    if (act === 'toggle') {
      state.open[id] = !state.open[id];
      var card = document.getElementById('qcard-' + id);
      if (card) card.className = 'card q-card' + (state.open[id] ? ' open' : '');
    } else if (act === 'reveal') {
      state.reveal[id] = true;
      var c2 = document.getElementById('qcard-' + id);
      if (c2) {
        var body = c2.querySelector('.q-body');
        if (body) {
          var btn = body.querySelector('.reveal-btn');
          if (btn) {
            var q = null;
            for (var i = 0; i < QS.length; i++) if (QS[i].id === id) q = QS[i];
            var html = '';
            if (q) {
              html += '<div class="answer-holder"><div class="answer-box"><span class="lbl">' + (q.t === 'project' ? '验收标准' : '参考答案') + '</span><div class="txt">' + esc(answerText(q)) + '</div></div></div>';
              if (q.e) html += '<div class="explain-box"><span class="lbl">' + (q.t === 'project' ? '实施提示' : '解析') + '</span>' + esc(q.e) + '</div>';
              if (q.c) html += '<div class="code-wrap"><button class="btn btn-sm code-copy" data-act="copy" data-id="' + esc(q.id) + '">复制代码</button><pre>' + esc(q.c) + '</pre></div>';
            }
            var div = document.createElement('div'); div.innerHTML = html;
            btn.parentNode.replaceChild(div, btn);
          }
        }
      }
    } else if (act === 'mark') {
      var val = el.getAttribute('data-val');
      if (val) state.status[id] = val; else delete state.status[id];
      saveStatus(); render(true);
    } else if (act === 'copy') { copyCode(id); }
    else if (act === 'filter') {
      state.filter[el.getAttribute('data-kind')] = el.getAttribute('data-val');
      render(true);
    } else if (act === 'export-csv') { exportCSV(el.getAttribute('data-scope')); }
    else if (act === 'export-progress') { exportProgress(); }
    else if (act === 'import-progress') { $('#fileImport').click(); }
    else if (act === 'reset-progress') {
      if (window.confirm('确定清空所有做题进度吗？此操作不可撤销。')) { state.status = {}; saveStatus(); render(); toast('进度已清空'); }
    }     else if (act === 'daily-refresh') { render(); }
    else if (act === 'speak-word') { speakWord(el.getAttribute('data-w')); }
    else if (act === 'mark-vocab') {
      var vw = el.getAttribute('data-w'), vm = vocabMap();
      if (vm[vw]) delete vm[vw]; else vm[vw] = 1;
      saveJ(VKEY, vm);
      el.className = 'btn btn-sm' + (vm[vw] ? ' vb-on' : '');
      el.textContent = vm[vw] ? '✓ 已记住' : '标记记住';
      toast(vm[vw] ? '已记住：' + vw : '已取消：' + vw);
    }
    else if (act === 'toggle-project') {
      var pj = loadJ(PKEY, {}); pj.ok = !pj.ok; saveJ(PKEY, pj);
      render(true); toast(pj.ok ? '已记录：完成了一个完整项目' : '已撤销');
    }
    else if (act === 'export-gaps') { exportGaps(); }
    else if (act === 'toggle-menu') { $('#sidebar').className = 'sidebar open'; }
  });

  document.addEventListener('input', function (e) {
    if (e.target && e.target.id === 'vocabSearch') {
      vocabKw = e.target.value.trim();
      applyVocabFilter(vocabKw);
    }
  });

  document.addEventListener('change', function (e) {
    if (e.target && e.target.id === 'fLevel') { state.filter.lv = e.target.value; render(true); }
    if (e.target && e.target.id === 'fileImport' && e.target.files && e.target.files[0]) {
      importProgress(e.target.files[0]); e.target.value = '';
    }
  });

  var searchTimer = null;
  $('#globalSearch').addEventListener('input', function () {
    var v = this.value.trim();
    clearTimeout(searchTimer);
    if (v.length >= 2) {
      searchTimer = setTimeout(function () { location.hash = '#/search/' + encodeURIComponent(v); }, 650);
    }
  });
  $('#globalSearch').addEventListener('keydown', function (e) {
    if (e.keyCode === 13) {
      clearTimeout(searchTimer);
      var v = this.value.trim();
      if (v) location.hash = '#/search/' + encodeURIComponent(v);
    }
  });
  $('#btnExportProgress').addEventListener('click', exportProgress);
  $('#btnImportProgress').addEventListener('click', function () { $('#fileImport').click(); });
  $('#btnMenu').addEventListener('click', function () {
    var s = $('#sidebar'); s.className = (s.className.indexOf('open') >= 0 ? 'sidebar' : 'sidebar open');
  });
  document.addEventListener('click', function (e) {
    if (window.innerWidth <= 900 && e.target.tagName === 'A' && e.target.getAttribute('href') && e.target.getAttribute('href').indexOf('#/') === 0) {
      $('#sidebar').className = 'sidebar';
    }
  });

  window.addEventListener('hashchange', function () {
    state.filter = { status: 'all', type: 'all', lv: 'all' };
    vocabKw = '';
    render();
  });
  renderNav();
  render();
})();
