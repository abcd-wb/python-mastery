/* 纯英文课程页：四模块 → 课程 → 英文章节。内容取自对应 MIT OCW 英文原版课。 */
(function () {
  var esc = PY.esc;
  var MODULES = window.EN_MODULES || [];
  var COURSES = window.EN_COURSES || {};
  var FIRST = (MODULES[0] && MODULES[0].courses && MODULES[0].courses[0]) || Object.keys(COURSES)[0];

  function pid(cid) { return 'en_' + cid; }
  function mod(id) { for (var i = 0; i < MODULES.length; i++) if (MODULES[i].id === id) return MODULES[i]; return null; }
  function course(id) { return COURSES[id] || null; }
  function chapters(c) { return (c && c.chapters) || []; }
  function termCount(c) { var n = 0; chapters(c).forEach(function (ch) { n += (ch.terms || []).length; }); return n; }
  function doneCount(cid) { return PY.countDone(pid(cid)); }

  function route() {
    var h = (location.hash || '').replace(/^#\/?/, '').replace(/\/$/, '');
    var p = h.split('/');
    if (p[0] === 'm' && mod(p[1])) return { v: 'module', mid: p[1] };
    if (p[0] === 'c') {
      var cid = course(p[1]) ? p[1] : FIRST;
      var ch = (p[2] != null && !isNaN(parseInt(p[2], 10))) ? parseInt(p[2], 10) : -1;
      return { v: 'course', cid: cid, ch: ch };
    }
    return { v: 'home' };
  }

  function crumb(items) {
    var h = '<nav class="en-crumb"><a href="#/">全部模块</a>';
    items.forEach(function (x) {
      h += '<span>›</span>' + (x.href ? '<a href="' + x.href + '">' + esc(x.t) + '</a>' : '<b>' + esc(x.t) + '</b>');
    });
    return h + '</nav>';
  }

  function progressBar(cid, c) {
    var total = chapters(c).length, done = doneCount(cid);
    var pct = total ? Math.round(done * 100 / total) : 0;
    return '<div class="en-prog"><div class="en-prog-t"><span>学习进度</span><b>' + done + ' / ' + total + ' 讲</b></div>' +
      '<div class="en-prog-bar"><i style="width:' + pct + '%"></i></div></div>';
  }

  function moduleCard(m) {
    var chs = 0, tms = 0, done = 0;
    (m.courses || []).forEach(function (cid) {
      var c = course(cid); if (!c) return;
      chs += chapters(c).length; tms += termCount(c); done += doneCount(cid);
    });
    return '<a class="en-mod" href="#/m/' + esc(m.id) + '">' +
      '<div class="en-mod-top"><span class="en-mod-zh">' + esc(m.zh) + '</span><span class="en-mod-n">' +
      (m.courses || []).length + ' 门课</span></div>' +
      '<h3>' + esc(m.name) + '</h3><p>' + esc(m.desc) + '</p>' +
      '<div class="en-mod-foot"><span>' + chs + ' 讲 · ' + tms + ' 术语</span><span>' +
      (chs ? Math.round(done * 100 / chs) : 0) + '% 已学</span></div></a>';
  }

  function courseCard(cid) {
    var c = course(cid); if (!c) return '';
    var total = chapters(c).length, done = doneCount(cid);
    return '<a class="en-course" href="#/c/' + esc(cid) + '" style="--c:' + esc(c.color) +
      ';--tint:' + esc(c.tint) + ';--tint2:' + esc(c.tint2) + '">' +
      '<div class="en-course-badges"><span class="b1">' + esc(c.ntuCode) + ' ' + esc(c.ntuName) +
      '</span><span class="b2">' + esc(c.enCode) + '</span></div>' +
      '<h3>' + esc(c.name) + '</h3><p>' + esc(c.desc) + '</p>' +
      '<div class="en-course-foot"><span>' + total + ' 讲 · ' + termCount(c) + ' 术语</span><span>' +
      done + '/' + total + ' 已学</span></div></a>';
  }

  function renderHome() {
    var totalCh = Object.keys(COURSES).reduce(function (n, k) { return n + chapters(COURSES[k]).length; }, 0);
    var h = '<section class="en-hero"><h1>纯英文课程</h1>' +
      '<p>按 NTU DSAI 课程对应表接入：每门 NTU 课对应一门 MIT 英文原版课，课程名、章节与专业术语全部用英文原版内容，可直接跳转到 MIT OpenCourseWare 看原版讲义与课堂视频。</p>' +
      '<div class="en-hero-stat"><span><b>' + MODULES.length + '</b> 模块</span><span><b>' +
      Object.keys(COURSES).length + '</b> 门课</span><span><b>' + totalCh + '</b> 讲</span></div></section>';
    h += '<div class="en-sec-title"><span>四大模块</span><small>Programming · Mathematics · Algorithms · Software</small></div>';
    h += '<div class="en-mod-grid">' + MODULES.map(moduleCard).join('') + '</div>';
    h += '<div class="en-sec-title"><span>全部课程</span><small>NTU课程名 ---- 对应英文课程名</small></div>';
    h += '<div class="en-course-grid">' + Object.keys(COURSES).map(courseCard).join('') + '</div>';
    return h;
  }

  function renderModule(mid) {
    var m = mod(mid); if (!m) return renderHome();
    var first = course((m.courses || [])[0]) || {};
    var h = crumb([{ t: m.zh + ' · ' + m.name }]);
    h += '<section class="en-mhero" style="--c:' + (first.color || '#2563eb') + '">' +
      '<span class="en-tag">MODULE ' + esc(m.id.toUpperCase()) + '</span>' +
      '<h1>' + esc(m.name) + '</h1><p>' + esc(m.zh) + ' · ' + esc(m.desc) + '</p></section>';
    h += '<div class="en-sec-title"><span>本模块课程</span><small>' + (m.courses || []).length + ' 门</small></div>';
    h += '<div class="en-course-grid">' + (m.courses || []).map(courseCard).join('') + '</div>';
    return h;
  }

  function chapterHtml(c, ch, open) {
    var terms = ch.terms || [];
    var studied = PY.isDone(pid(c.id), ch.n);
    var h = '<details class="en-ch" data-ch="' + esc(ch.n) + '"' + (open ? ' open' : '') + '>' +
      '<summary><span class="en-ch-n">' + esc(ch.n) + '</span><b>' + esc(ch.name) + '</b>' +
      '<span class="en-ch-t">' + terms.length + ' terms</span>' +
      '<span class="en-ch-done">' + (studied ? '✓ 已学' : '○ 未学') + '</span><span class="en-ch-ar">▶</span></summary>';
    h += '<div class="en-ch-body"><p class="en-ch-desc">' + esc(ch.desc) + '</p>';
    if (terms.length) {
      h += '<div class="en-terms"><span class="en-terms-l">Key terms · 点词听美音</span><div class="en-chips">';
      terms.forEach(function (t) {
        h += '<button type="button" class="en-chip" data-say="' + esc(t) + '">' + esc(t) + ' <i>🔊</i></button>';
      });
      h += '</div></div>';
    }
    h += '<div class="en-ch-acts">' +
      '<a class="en-btn ocw" href="' + esc(c.ocw) + '" target="_blank" rel="noopener">在 MIT OCW 看本课 ↗</a>' +
      '<button type="button" class="en-btn mark' + (studied ? ' on' : '') + '" data-cid="' + esc(c.id) +
      '" data-n="' + esc(ch.n) + '">' + (studied ? '✓ 已学 · 点此取消' : '标记已学') + '</button></div>';
    h += '</div></details>';
    return h;
  }

  function renderCourse(cid, openIdx) {
    var c = course(cid); if (!c) return renderHome();
    var m = null;
    for (var i = 0; i < MODULES.length; i++) {
      if ((MODULES[i].courses || []).indexOf(cid) >= 0) { m = MODULES[i]; break; }
    }
    var h = crumb([m ? { t: m.zh, href: '#/m/' + m.id } : { t: '课程' }, { t: c.ntuCode + ' ↔ ' + c.enCode }]);
    h += '<section class="en-chero" style="--c:' + esc(c.color) + ';--tint:' + esc(c.tint) + ';--tint2:' + esc(c.tint2) + '">' +
      '<div class="en-map"><span>' + esc(c.ntuCode) + ' · ' + esc(c.ntuName) + '</span><i>↔</i><span>' +
      esc(c.enCode) + ' · ' + esc(c.enName) + '</span></div>' +
      '<h1>' + esc(c.name) + '</h1><p class="en-desc">' + esc(c.desc) + '</p>' +
      '<p class="en-teacher">' + esc(c.teacher) + '　·　对应中文课：' + esc(c.cnRef || '—') + '</p>' +
      '<a class="en-ocw" href="' + esc(c.ocw) + '" target="_blank" rel="noopener">打开 MIT OpenCourseWare 课程主页 ↗</a>' +
      progressBar(cid, c) + '</section>';
    h += '<div class="en-sec-title"><span>课程章节 · English Lectures</span><small>共 ' + chapters(c).length + ' 讲</small></div>';
    h += '<div class="en-chlist">' + chapters(c).map(function (ch, idx) {
      return chapterHtml(c, ch, idx === openIdx);
    }).join('') + '</div>';
    return h;
  }

  function render() {
    var r = route(), h = '';
    if (r.v === 'module') h = renderModule(r.mid);
    else if (r.v === 'course') h = renderCourse(r.cid, r.ch);
    else h = renderHome();
    document.getElementById('app').innerHTML = h;
    bind();
    window.scrollTo(0, 0);
  }

  function bind() {
    var app = document.getElementById('app');
    app.addEventListener('click', function (e) {
      var say = e.target.closest('[data-say]');
      if (say) { PY.speak(say.getAttribute('data-say')); e.preventDefault(); return; }
      var mk = e.target.closest('.mark');
      if (mk) {
        var cid = mk.getAttribute('data-cid'), n = mk.getAttribute('data-n');
        var on = PY.toggle(pid(cid), n);
        mk.classList.toggle('on', on);
        mk.textContent = on ? '✓ 已学 · 点此取消' : '标记已学';
        var ch = mk.closest('.en-ch');
        if (ch) { var d = ch.querySelector('.en-ch-done'); if (d) d.textContent = on ? '✓ 已学' : '○ 未学'; }
        PY.toast(on ? '已标记学完' : '已取消标记');
        e.preventDefault(); return;
      }
    });
  }

  window.addEventListener('hashchange', render);
  render();
})();
