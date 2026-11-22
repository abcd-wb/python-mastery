/* 作业及练习页：按四门 Python 课的中文目录逐章展示，题目与课程一一对应 */
(function () {
  var esc = PY.esc;
  var E = window.EXERCISES || {};
  var ORDER = ['intro', 'git', 'ai', 'adv', 'project'];

  function route() {
    var h = (location.hash || '').replace(/^#\/?/, '').replace(/\/$/, '');
    var parts = h.split('/');
    var cid = E[parts[0]] ? parts[0] : 'intro';
    return { cid: cid, ch: parts[1] || '' };
  }

  function colors(cid) {
    var M = (window.PY_MODULES || {})[cid] || {};
    return {
      c: M.color || '#2563eb',
      tint: M.tint || '#e8f0ff',
      tint2: M.tint2 || '#c2d8ff'
    };
  }

  function theme(cid) {
    var x = colors(cid), r = document.documentElement.style;
    r.setProperty('--c', x.c);
    r.setProperty('--tint', x.tint);
    r.setProperty('--tint2', x.tint2);
  }

  function taskCount(course) {
    var n = 0;
    (course.chapters || []).forEach(function (ch) { n += (ch.tasks || []).length; });
    return n;
  }

  function renderNav(cur) {
    var h = '<div class="ex-nav"><b>选择课程</b><div class="ex-courses">';
    ORDER.forEach(function (cid) {
      var c = E[cid];
      if (!c) return;
      var x = colors(cid);
      h += '<a href="#/' + cid + '" class="ex-course' + (cid === cur ? ' on' : '') +
        '" style="--c:' + x.c + ';--tint:' + x.tint + '">' +
        '<span>' + esc(c.name) + '</span><small>' + (c.chapters || []).length + ' 章 / ' +
        taskCount(c) + ' 题</small></a>';
    });
    h += '</div></div>';
    return h;
  }

  function renderChapters(cid, course, openCh) {
    var h = '<div class="ex-list">';
    (course.chapters || []).forEach(function (ch, idx) {
      var open = openCh === ch.id || (!openCh && idx === 0);
      h += '<details class="ex-chap"' + (open ? ' open' : '') + ' data-ch="' + esc(ch.id) + '">' +
        '<summary><span class="ex-no">' + esc(ch.n) + '</span>' +
        '<span class="ex-name">' + esc(ch.name) + '</span>' +
        '<span class="ex-cnt">' + (ch.tasks || []).length + ' 题</span>' +
        '<span class="ex-arrow">▶</span></summary>';
      h += '<div class="ex-tasks">';
      (ch.tasks || []).forEach(function (t, i) {
        var isHw = t.k === '作业';
        h += '<article class="ex-task ' + (isHw ? 'hw' : 'pr') + '">' +
          '<div class="ex-task-h"><span class="ex-kind">' + esc(t.k) + '</span>' +
          '<b>Q' + (i + 1) + ' · ' + esc(t.t) + '</b></div>' +
          '<p class="ex-q">' + esc(t.q) + '</p>';
        if (t.test) {
          h += '<div class="ex-test"><b>自测用例</b><pre>' + esc(t.test) + '</pre></div>';
        }
        h += '<details class="ex-ans"><summary>参考答案 / 要点</summary><pre>' +
          esc(t.a || '（略）') + '</pre></details>';
        h += '</article>';
      });
      h += '</div></details>';
    });
    h += '</div>';
    return h;
  }

  function render() {
    var r = route(), course = E[r.cid];
    if (!course) { r.cid = 'intro'; course = E.intro; }
    theme(r.cid);
    document.title = '作业及练习 · ' + course.name;

    var meta = E.meta || {};
    var totalCh = 0, totalTask = 0;
    ORDER.forEach(function (cid) {
      if (!E[cid]) return;
      totalCh += (E[cid].chapters || []).length;
      totalTask += taskCount(E[cid]);
    });

    var h = '<section class="ex-hero"><h1>' + esc(meta.title || '作业及练习') + '</h1>' +
      '<p class="desc">' + esc(meta.note || '') + '</p>' +
      '<p class="ex-src">' + esc(meta.source || '') + '　·　共 ' + totalCh + ' 章 ' + totalTask + ' 题</p></section>';
    h += renderNav(r.cid);
    h += '<div class="ex-section"><span class="bar"></span>' + esc(course.name) + ' · 按章节练习</div>';
    h += renderChapters(r.cid, course, r.ch);

    document.getElementById('app').innerHTML = h;
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', render);
  render();
})();
