/* 模块页：老师 → 课程 → 完整目录（点任意一集直接进课堂看那一集视频） */
(function () {
  var esc = PY.esc;
  var T = window.AI_TEACHERS || [], G = window.AI_GROUPS || {};

  /* 每位老师在整条学习路线里是第几步（和第 1~4 步的 Python 课连起来看） */
  var AI_STEP = {
    ng: '第 2 步',
    lhy: '第 5 步起',
    mu: '第 6 步'
  };

  var PLAN = [
    { s: '第 1 步', n: 'Python 入门（黑马）', d: '45 天 · 看到第 110 集就停', c: '#2563eb' },
    { s: '第 1.5 步', n: 'Git 工具课（尚硅谷）', d: '2 天 · 40 集，入门后立刻学，与 Python 课零重复', c: '#ea580c' },
    { s: '第 2 步', n: '吴恩达 · AI Python', d: '3 天 · 35 集，只走这一门', c: '#e11d48' },
    { s: '第 3 步', n: 'Python 进阶', d: '45 天 · 面向对象到算法数据结构', c: '#0d9488' },
    { s: '第 4 步', n: '项目实战', d: '30 天 · Pandas + RFM 出作品', c: '#7c3aed' },
    { s: '第 5 步', n: '李宏毅 · 机器学习', d: '约 20 天 · 边补线代概率边看', c: '#2563eb' },
    { s: '第 6 步', n: '李沐 · 动手学深度学习', d: '和第 5 步交替：看一章敲一章', c: '#ea580c' },
    { s: '第 7 步', n: '李宏毅 · 深度学习 → 生成式 AI → 大模型', d: '按这个顺序，可不赶进度', c: '#2563eb' }
  ];

  function teacherOf(id) {
    for (var i = 0; i < T.length; i++) if (T[i].id === id) return T[i];
    return null;
  }
  function teacherByCourse(cid) {
    for (var i = 0; i < T.length; i++) {
      var cs = G[T[i].id] || [];
      if (cs.indexOf(cid) >= 0) return T[i];
    }
    return null;
  }

  /* #/ai → 三位老师；#/ai/lhy → 该老师的课；#/c/<id> → 课程详情（避免和 #/ai 老师分组撞 key） */
  function route() {
    var h = (location.hash || '').replace(/^#\/?/, '').replace(/\/$/, '');
    var parts = h.split('/');
    if (parts[0] === 'c' && parts[1]) return { kind: 'course', id: PY.COURSES[parts[1]] ? parts[1] : 'intro' };
    if (parts[0] === 'ai' && !parts[1]) return { kind: 'teachers' };
    if (parts[0] === 'ai' && teacherOf(parts[1])) return { kind: 'teacher', tid: parts[1] };
    return { kind: 'course', id: PY.COURSES[h] ? h : 'intro' };
  }

  function theme(col, tint, tint2) {
    if (!col) return;
    var r = document.documentElement.style;
    r.setProperty('--c', col);
    r.setProperty('--tint', tint);
    r.setProperty('--tint2', tint2);
  }

  function bar(back, label, crumb) {
    document.getElementById('bar').innerHTML =
      PY.backTo(back, label) +
      '<div class="crumb">' + esc(crumb) + '</div>' +
      '<div class="right"><a class="back" href="hub.html">总界面</a></div>';
  }

  function nextLesson(c) {
    for (var i = 1; i <= c.pages.length; i++) if (!PY.isDone(c.id, i)) return i;
    return 1;
  }

  /* ---------------- 老师选择 ----------------
     三位老师 = 三张和首页一样的卡片（图标 + 图标名） */
  function renderTeachers() {
    var M = (window.PY_MODULES || {}).ai || {};
    theme(M.color || '#e11d48', M.tint || '#ffe9ef', M.tint2 || '#ffc9d8');
    document.title = 'AI 应用实战 · 选老师';
    bar('index.html', 'Python 平台', 'AI 应用实战');

    var nC = 0, nL = 0;
    T.forEach(function (t) {
      (G[t.id] || []).forEach(function (cid) { nC++; nL += PY.totalOf(cid); });
    });

    var h = '<section class="hero"><h1>AI 应用实战</h1>' +
      '<p class="desc">三位老师、' + nC + ' 门课、' + nL + ' 集。第 2 步只看吴恩达那 35 集（3 天）；' +
      '李宏毅、李沐排在第 5、6 步，等进阶和项目做完再进，否则数学和工程底子不够会卡住。</p></section>';

    h += '<nav class="mod-grid" aria-label="老师列表">';
    T.forEach(function (t) {
      var cs = G[t.id] || [], total = 0, done = 0;
      cs.forEach(function (cid) { total += PY.totalOf(cid); done += PY.countDone(cid); });
      var pct = total ? Math.round(done / total * 100) : 0;
      h += '<a class="module-card" href="module.html#/ai/' + t.id + '"' +
        ' style="--c:' + t.color + ';--tint:' + t.tint + ';--tint2:' + t.tint2 + '"' +
        (total ? ' title="已学 ' + done + ' / ' + total + ' 集 · ' + pct + '%"' : '') + '>' +
        '<span class="ico" aria-hidden="true"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" ' +
        'stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + t.icon + '</svg></span>' +
        '<span class="nm">' + esc(t.name) + '</span>' +
        '<span class="ds">' + esc(t.ds) + '</span>' +
        (AI_STEP[t.id] ? '<span class="tagx stp">' + AI_STEP[t.id] + '</span>'
          : (t.tag ? '<span class="tagx">' + esc(t.tag) + '</span>' : '')) +
        '<span class="go">' + cs.length + ' 门课 →</span>' +
        (total ? '<span class="mprog"><i style="width:' + pct + '%"></i></span>' : '') +
        '</a>';
    });
    h += '</nav>';

    h += '<div class="section"><span class="bar" style="background:var(--c)"></span>整条学习路线 ' +
      '<small>第 1~4 步在首页，第 5 步往后才是这两位老师</small></div>' +
      '<div class="card pad order-list">';
    PLAN.forEach(function (p) {
      h += '<p><b style="color:' + p.c + '">' + p.s + '</b>　' + esc(p.n) +
        '<span class="ord-d">' + esc(p.d) + '</span></p>';
    });
    h += '</div>';

    document.getElementById('app').innerHTML = h;
    window.scrollTo(0, 0);
  }

  /* ---------------- 某位老师的课 ---------------- */
  function renderTeacher(tid) {
    var t = teacherOf(tid), cs = G[tid] || [];
    theme(t.color, t.tint, t.tint2);
    var total = 0;
    cs.forEach(function (cid) { total += PY.totalOf(cid); });
    document.title = t.name + ' · AI 应用实战';
    bar('module.html#/ai', 'AI 应用实战', t.name + ' · ' + cs.length + ' 门课');

    var h = '<section class="hero"><h1>' + esc(t.name) + ' · ' + cs.length + ' 门课</h1>' +
      '<p class="desc">' + esc(t.desc) + '　共 ' + total + ' 集。</p></section>';

    h += '<div class="clist">';
    cs.forEach(function (cid) {
      var c = PY.COURSES[cid];
      if (!c) return;
      var n = c.pages.length, done = PY.countDone(cid);
      var pct = n ? Math.round(done / n * 100) : 0;
      var nx = nextLesson(c);
      h += '<a class="ccard" href="module.html#/c/' + cid + '">' +
        '<div class="cc-h"><b>' + esc(c.title) + '</b>' +
        '<span class="cc-tag">' + n + ' 集 · ' + (c.length ? c.length.split('·').pop().trim() : '') + '</span></div>' +
        '<p class="cc-d">' + esc(c.sub || '') + '</p>' +
        '<div class="cc-b"><span class="cc-p">' + (done ? '已学 ' + done + ' / ' + n + ' 集 · ' + pct + '%' : n + ' 集全部没听') + '</span>' +
        '<span class="cc-go">' + (done ? '继续 · P' + nx : '进入 →') + '</span></div>' +
        '<span class="cc-bar"><i style="width:' + pct + '%"></i></span></a>';
    });
    h += '</div>';

    h += '<p class="list-foot">点一门课进去就是完整目录，左边点任意一集，右边直接播那一集。</p>';
    document.getElementById('app').innerHTML = h;
    window.scrollTo(0, 0);
  }

  function renderBar(c, M) {
    var done = PY.countDone(c.id);
    var back = (M && M.back) || 'index.html';
    var label = (M && M.backLabel) ? M.backLabel :
      (back.indexOf('#/math') >= 0 ? '← 大学数学' : '← Python 平台');
    document.getElementById('bar').innerHTML =
      PY.backTo(back, label) +
      '<div class="crumb">' + esc(c.title) + '</div>' +
      '<div class="right"><span class="chip">' + done + ' / ' + c.pages.length + ' 集已学</span>' +
      '<a class="back" href="hub.html">总界面</a></div>';
  }


  function renderHero(c) {
    var total = c.pages.length, done = PY.countDone(c.id);
    var pct = total ? Math.round(done / total * 100) : 0;
    var nx = nextLesson(c);
    var hours = PY.hoursOf(c.id);
    var dWatch = Math.ceil(hours / 2);      /* 每天只看 2 小时视频 */
    var dFull = Math.ceil(hours / 2 * 2);   /* 看 1 小时 + 动手 1 小时 */
    var S = (window.PY_STEPS || {})[c.id];
    var h = '<section class="hero">';
    h += '<h1>' + esc(c.title) + '</h1>';
    h += '<p class="desc">' + esc(c.sub || '') + '</p>';
    h += '<div class="chips">';
    if (S) {
      var total = Object.keys(window.PY_STEPS).length;
      h += '<span class="chip stepchip">第 ' + S.step + ' 步 / 共 ' + total + ' 步 · ' + esc(S.tag) + '</span>';
    }
    h +=
      '<span class="chip">讲师 <b>' + esc(c.teacher) + '</b></span>' +
      '<span class="chip">平台 <b>' + esc(c.platform) + '</b></span>' +
      '<span class="chip">规模 <b>' + esc(c.length) + '</b></span>' +
      '<span class="chip">语言 <b>' + esc(c.lang) + '</b></span>' +
      '<span class="chip">费用 <b>' + esc(c.cost) + '</b></span>' +
      '<span class="chip">每天 2h：看完 <b>' + dWatch + ' 天</b> · 边看边练 <b>' + dFull + ' 天</b></span>' +
      '</div>';
    h += '<div class="hero-actions">' +
      '<a class="btn btn-primary" href="course.html#/' + c.id + '/' + nx + '">' +
      (done ? '继续学习 · P' + nx : '开始上课 · P1') + ' →</a>' +
      (['intro', 'adv', 'project', 'ai'].indexOf(c.id) >= 0
        ? '<a class="btn" href="exercises.html#/' + c.id + '">作业及练习 →</a>' : '') +
      '<a class="btn" href="' + esc(c.url) + '" target="_blank" rel="noopener">B 站原视频 ↗</a>' +
      '</div>';
    h += '<div class="prog"><div class="prog-bar"><i style="width:' + pct + '%"></i></div>' +
      '<span class="prog-txt">已学 <b>' + done + '</b> / ' + total + ' 集 · ' + pct + '%　' +
      (done ? '（听着听着会自动变绿）' : '（点进去听，听完自动变绿）') + '</span></div>';
    if (S) h += '<p class="stepnote"><b>第 ' + S.step + ' 步怎么走：</b>' + esc(S.note) + '</p>';
    h += '</section>';

    h += '<div class="section"><span class="bar" style="background:var(--c)"></span>这门课怎么用 <small>先看这两段，再进目录</small></div>';
    h += '<div class="card pad" style="display:grid;grid-template-columns:1fr 1fr;gap:22px">' +
      '<div><div class="block-h"><span class="k">为</span>为什么选它</div><div style="font-size:13.5px;color:#2b3852;line-height:1.85">' + esc(c.why) + '</div></div>' +
      '<div><div class="block-h"><span class="k">法</span>怎么学</div><div style="font-size:13.5px;color:#2b3852;line-height:1.85">' + esc(c.how) + '</div></div>' +
      '</div>';
    return h;
  }

  /* 某一章和别的课重复吗？返回 {txt, cls, why} */
  function dupOf(cid, from, to) {
    var list = (window.PY_DUP || {})[cid] || [];
    for (var i = 0; i < list.length; i++) {
      var d = list[i];
      var lo = Math.max(from, d.from), hi = Math.min(to, d.to);
      if (hi - lo + 1 >= Math.min(4, to - from + 1) * 0.5) {
        if (d.dup === '独有') return { txt: '独有', cls: 'only', why: d.why };
        /* 「这里更全」只标在重复区间的开头那一章，免得整门课全是角标 */
        if (!d.skip && from > d.from) continue;
        var short = d.dup.split(' ')[0].replace('课', '');
        return { txt: '与' + short + '重复·' + (d.skip ? '可跳' : '更全'), cls: d.skip ? 'skip' : 'full', why: d.why };
      }
    }
    return null;
  }

  function renderToc(c) {
    var nx = nextLesson(c);
    var h = '<div class="section"><span class="bar" style="background:var(--c)"></span>完整目录 ' +
      '<small>共 ' + c.pages.length + ' 集 · 点任意一集，进去直接播那一集</small></div>';
    h += '<div class="chapters">';

    for (var i = 0; i < c.chapters.length; i++) {
      var ch = c.chapters[i], from = ch.from, to = Math.min(ch.to, c.pages.length);
      var dcount = 0;
      for (var k = from; k <= to; k++) if (PY.isDone(c.id, k)) dcount++;
      var open = (nx >= from && nx <= to) || i === 0;
      var dp = dupOf(c.id, from, to);
      h += '<details class="chap"' + (open ? ' open' : '') + '>';
      h += '<summary>' +
        '<span class="no">' + esc(ch.n) + '</span>' +
        '<span>' + esc(ch.name) + ' <span class="desc">· ' + esc(ch.desc || '') + '</span></span>' +
        (dp ? '<span class="dup ' + dp.cls + '" title="' + esc(dp.why) + '">' + esc(dp.txt) + '</span>' : '') +
        '<span class="cnt">' + dcount + '/' + (to - from + 1) + ' 集</span>' +
        '<span class="arrow">▶</span></summary>';
      h += '<ul class="lessons">';
      for (var p = from; p <= to; p++) {
        var pg = c.pages[p - 1];
        if (!pg) continue;
        var done = PY.isDone(c.id, p);
        h += '<li><a href="course.html#/' + c.id + '/' + p + '"' + (done ? ' class="seen"' : '') + '>' +
          '<span class="lno">P' + p + '</span>' +
          '<span class="ltt">' + esc(pg.t) + '</span>' +
          '<span class="done-dot' + (done ? ' on' : '') + '"></span>' +
          '</a></li>';
      }
      h += '</ul></details>';
    }
    h += '</div>';
    return h;
  }

  function render() {
    var r = route();
    if (r.kind === 'teachers') { renderTeachers(); return; }
    if (r.kind === 'teacher') { renderTeacher(r.tid); return; }
    var id = r.id, c = PY.course(id), M = (window.PY_MODULES || {})[id] || {};
    if (M.color) theme(M.color, M.tint, M.tint2);
    document.title = (M.name || c.title) + ' · 课程目录';
    renderBar(c, M);
    document.getElementById('app').innerHTML = renderHero(c) + '<div style="height:6px"></div>' + renderToc(c);
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', render);
  render();
})();
