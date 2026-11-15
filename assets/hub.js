/* 总界面：雅思 / 大学课程 → Python · 大学数学 → 三门数学课
   排版与首页完全一致：同一套 .home / .modules / .module-card 卡片墙 */
(function () {
  var esc = PY.esc;

  var ICON = {
    ielts: '<path d="M4 5.5h16v10.5H9.5L4.5 20.5V5.5Z"/><text x="12" y="13.6" font-size="6.4" font-weight="700" font-family="Helvetica,Arial" text-anchor="middle" fill="currentColor" stroke="none">IELTS</text>',
    college: '<path d="M3 8.5 12 4l9 4.5-9 4.5-9-4.5Z"/><path d="M6.6 11v4.6c0 1.5 2.4 2.7 5.4 2.7s5.4-1.2 5.4-2.7V11"/><path d="M20.5 9v5"/>',
    python: '<path d="M4 5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 1-2-2V5Z"/><path d="M9 7.5h7M9 11.5h7M9 15.5h4"/>',
    math: '<path d="M6 4.5h11"/><path d="M6 4.5c0 6-2.5 8-2.5 8s2.5 2 2.5 8"/><path d="M16.8 12.6 20 17.2M20 12.6l-3.2 4.6"/>',
    stats: '<path d="M4 19.5V10M9.5 19.5V5M15 19.5v-7M20.5 19.5V8"/><path d="M3 21h18"/>',
    calculus: '<path d="M15.6 4.4c-2.6 0-3.3 1.7-3.8 4.2L10 19.4c-.5 2.5-1.6 3.6-3.6 3.6"/><path d="M7.4 10.6h7.2"/>',
    linear: '<rect x="3.5" y="4.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="4.5" width="7" height="7" rx="1.6"/><rect x="3.5" y="14.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="14.5" width="7" height="7" rx="1.6"/>'
  };

  var VIEWS = {
    home: {
      title: '总界面', back: null, cols: 'c2',
      cards: [
        { key: 'ielts', name: '雅思', ds: '计划 · 资料 · 真题 · 高分', href: 'ielts.html', c: '#ea580c', tint: '#fff0e6', tint2: '#ffd6b8', tag: '4 个模块' },
        { key: 'college', name: '大学课程', ds: 'Python · 大学数学', href: '#/college', c: '#2563eb', tint: '#e8f0ff', tint2: '#c2d8ff' }
      ]
    },
    college: {
      title: '大学课程', back: { txt: '← 总界面', href: '#/' }, cols: 'c2',
      cards: [
        { key: 'python', name: 'Python', ds: '入门 · 进阶 · 项目实战 · AI 应用', href: 'index.html', c: '#2563eb', tint: '#e8f0ff', tint2: '#c2d8ff', prog: ['intro', 'adv', 'project', 'ai', 'lhy_ml', 'lhy_dl', 'lhy_llm', 'lhy_gen', 'mu_d2l'] },
        { key: 'math', name: '大学数学', ds: '统计学 · 微积分 · 线性代数', href: '#/math', c: '#0f766e', tint: '#e6f7f4', tint2: '#b8e8e0', prog: ['stats', 'calculus', 'linear'] }
      ]
    },
    math: {
      title: '大学数学', back: { txt: '← 大学课程', href: '#/college' }, cols: '',
      cards: [
        { key: 'stats', name: '统计学', ds: '概率论与数理统计 · 63 集', href: 'module.html#/stats', c: '#b45309', tint: '#fff5e6', tint2: '#ffd9a8', prog: ['stats'] },
        { key: 'calculus', name: '微积分', ds: '高等数学 · 59 集', href: 'module.html#/calculus', c: '#1d4ed8', tint: '#e8f0ff', tint2: '#c2d8ff', prog: ['calculus'] },
        { key: 'linear', name: '线性代数', ds: '宋浩 3.0 · 39 集', href: 'module.html#/linear', c: '#0f766e', tint: '#e6f7f4', tint2: '#b8e8e0', prog: ['linear'] }
      ]
    }
  };

  function key() {
    var h = (location.hash || '').replace(/^#\/?/, '').replace(/\/$/, '');
    return (h === 'college' || h === 'math') ? h : 'home';
  }

  /* 已学 / 总数（卡片底部那条细绿线，与首页一致） */
  function progress(ids) {
    var total = 0, done = 0;
    for (var i = 0; i < ids.length; i++) {
      total += PY.totalOf(ids[i]);
      done += PY.countDone(ids[i]);
    }
    return { total: total, done: done, pct: total ? Math.round(done / total * 100) : 0 };
  }

  function cardHTML(c) {
    var h = '<a class="module-card" href="' + c.href + '"' +
      ' style="--c:' + c.c + ';--tint:' + c.tint + ';--tint2:' + c.tint2 + '"';
    var p = c.prog ? progress(c.prog) : null;
    if (p && p.total) h += ' title="已学 ' + p.done + ' / ' + p.total + ' 集 · ' + p.pct + '%"';
    h += '>' +
      '<span class="ico" aria-hidden="true"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
      ICON[c.key] + '</svg></span>' +
      '<span class="nm">' + esc(c.name) + '</span>' +
      (c.ds ? '<span class="ds">' + esc(c.ds) + '</span>' : '') +
      (c.tag ? '<span class="tagx">' + esc(c.tag) + '</span>' : '') +
      '<span class="go">进入 →</span>';
    if (p && p.total) h += '<span class="mprog"><i style="width:' + p.pct + '%"></i></span>';
    return h + '</a>';
  }

  function totals(ids) {
    var s = 0;
    for (var i = 0; i < ids.length; i++) s += PY.totalOf(ids[i]);
    return s;
  }

  function foot(k) {
    if (k === 'home') return '左边雅思还没开课；右边大学课程里 Python 和数学都能直接进班上课。';
    if (k === 'college') return 'Python 平台 ' + totals(['intro', 'adv', 'project', 'ai']) + ' 集；大学数学 ' + totals(['stats', 'calculus', 'linear']) + ' 集，都是宋浩完整课。';
    return '三门课合计 ' + totals(['stats', 'calculus', 'linear']) + ' 集，点卡片进目录，点目录直接播那一集。';
  }

  function render() {
    var k = key(), v = VIEWS[k];
    document.title = k === 'home' ? '总界面 · 学习平台' : v.title + ' · 总界面';

    var b = document.getElementById('back');
    if (v.back) {
      b.textContent = v.back.txt;
      b.href = v.back.href;
      b.onclick = null;
    } else {
      b.textContent = '← 返回';
      b.href = 'index.html';
      b.onclick = function (e) {
        if (history.length > 1) { e.preventDefault(); history.back(); }
      };
    }

    var grid = document.getElementById('hubGrid');
    grid.className = 'modules' + (v.cols ? ' ' + v.cols : '');
    var h = '';
    for (var i = 0; i < v.cards.length; i++) h += cardHTML(v.cards[i]);
    grid.innerHTML = h;

    document.getElementById('hubFoot').innerHTML = foot(k);
    window.scrollTo(0, 0);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var v = VIEWS[key()];
    if (v.back) location.hash = v.back.href;
    else if (history.length > 1) history.back();
  });

  window.addEventListener('hashchange', render);
  render();
})();
