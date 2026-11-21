/* 课堂页：左目录 / 中视频（点目录即播）+ 讲义 / 右本节英文术语 */
(function () {
  var esc = PY.esc;
  var rendered = '';

  function parse() {
    var parts = (location.hash || '').replace(/^#\/?/, '').split('/');
    var C = PY.COURSES;
    var id = C[parts[0]] ? parts[0] : 'intro';
    var p = parseInt(parts[1], 10) || 1;
    return { id: id, p: p };
  }

  function renderBar(c, p, total) {
    document.getElementById('bar').innerHTML =
      PY.backTo('module.html#/c/' + c.id, '返回目录') +
      '<div class="crumb">' + esc(c.title) + ' · <b>P' + p + ' / ' + total + '</b></div>' +
      '<div class="right"><a class="back" href="hub.html">总界面</a></div>';
  }

  function renderToc(c, cur) {
    var h = '<div class="toc-head"><b>课程目录</b><span>共 ' + c.pages.length + ' 集</span></div><div class="toc-scroll">';
    for (var i = 0; i < c.chapters.length; i++) {
      var ch = c.chapters[i], dc = 0;
      for (var k = ch.from; k <= ch.to; k++) if (PY.isDone(c.id, k)) dc++;
      var full = dc === (ch.to - ch.from + 1);
      h += '<div class="toc-chap">' + esc(ch.n) + ' · ' + esc(ch.name) +
        '<span class="toc-cnt' + (full ? ' full' : '') + '">' + dc + '/' + (ch.to - ch.from + 1) + '</span></div>';
      for (var p = ch.from; p <= ch.to; p++) {
        var pg = c.pages[p - 1];
        if (!pg) continue;
        var done = PY.isDone(c.id, p);
        h += '<a class="toc-item' + (p === cur ? ' on' : '') + (done ? ' done' : '') +
          '" data-p="' + p + '" href="#/' + c.id + '/' + p + '">' +
          '<span class="n">P' + p + '</span><span class="tt">' + esc(pg.t) + '</span>' +
          (done ? '<span class="ok">✓</span>' : '') + '</a>';
      }
    }
    h += '</div>';
    var box = document.getElementById('colToc');
    box.innerHTML = h;
    var sc = box.querySelector('.toc-scroll'), act = box.querySelector('.toc-item.on');
    if (sc && act) {
      var d = act.getBoundingClientRect().top - sc.getBoundingClientRect().top;
      sc.scrollTop = sc.scrollTop + d - sc.clientHeight / 2 + 20;
    }
  }

  function watchText(done, got, need, dur) {
    if (done) return '✓ 已经听完，自动标绿';
    return '已听 ' + PY.mmss(got) + ' / ' + PY.mmss(dur) + '　·　听到 ' + PY.mmss(need) + ' 自动标绿';
  }

  function paintWatch(r, dur) {
    var bar = document.getElementById('wbar'), txt = document.getElementById('wtxt');
    if (bar) bar.style.width = Math.round(Math.min(1, r.got / r.need) * 100) + '%';
    if (txt) txt.textContent = watchText(r.done, r.got, r.need, dur);
    var tip = document.querySelector('.watch-tip');
    if (tip) tip.textContent = r.done ? '这一集已标绿' : '听着就自动记，不用手动点';
  }

  function onAutoDone(p) {
    var item = document.querySelector('.toc-item[data-p="' + p + '"]');
    if (item && !item.classList.contains('done')) {
      item.classList.add('done');
      if (!item.querySelector('.ok')) {
        var s = document.createElement('span'); s.className = 'ok'; s.textContent = '✓';
        item.appendChild(s);
      }
    }
    var tag = document.getElementById('doneTag');
    if (tag) tag.style.display = '';
    var btn = document.getElementById('markDone');
    if (btn) { btn.textContent = '✓ 已学'; btn.className = 'btn btn-sm btn-done'; }
    PY.toast('P' + p + ' 听完了，已自动标绿 ✓');
  }

  var cur = { id: '', p: 0, dur: 0 }, paused = false;
  setInterval(function () {
    if (document.hidden || paused || !cur.id) return;
    var r = PY.tick(cur.id, cur.p, 2);
    paintWatch(r, cur.dur);
    if (r.justDone) onAutoDone(cur.p);
  }, 2000);

  function renderLesson(c, L, p, total) {
    var done = PY.isDone(c.id, p);
    var last = c.pages[p - 1];

    var need = PY.needOf(c.id, p), got = PY.watchedOf(c.id, p);
    var h = '<div class="player-wrap">';
    h += '<div class="player"><iframe src="' + esc(PY.playerUrl(c.id, p)) + '" ' +
      'allow="autoplay; fullscreen; encrypted-media" allowfullscreen frameborder="0" scrolling="no"></iframe></div>';
    /* 听课进度条：读到本集 90% 自动标绿 */
    h += '<div class="watch" id="watch">' +
      '<div class="watch-bar"><i id="wbar" style="width:' + Math.round(got / need * 100) + '%"></i></div>' +
      '<div class="watch-row"><span class="watch-txt" id="wtxt">' + watchText(done, got, need, PY.durOf(c.id, p)) + '</span>' +
      '<a class="watch-pause' + (paused ? ' on' : '') + '" id="wpause">' + (paused ? '继续计时' : '暂停计时') + '</a>' +
      '<span class="watch-tip">' + (done ? '这一集已标绿' : '听着就自动记，不用手动点') + '</span></div>' +
      '</div>';
    h += '<div class="playbar">' +
      '<a class="btn btn-sm" href="' + esc(PY.watchUrl(c.id, p)) + '" target="_blank" rel="noopener">在 B 站打开 ↗</a>' +
      (p > 1 ? '<a class="btn btn-sm" href="#/' + c.id + '/' + (p - 1) + '">← 上一集</a>' : '') +
      (p < total ? '<a class="btn btn-sm btn-primary" href="#/' + c.id + '/' + (p + 1) + '">下一集 →</a>' : '') +
      '<button class="btn btn-sm' + (done ? ' btn-done' : '') + '" id="markDone">' + (done ? '✓ 已学' : '标记已学') + '</button>' +
      '<span class="pm-switch">播放器 ' +
      '<a data-mode="mobile" class="' + (PY.playerMode() === 'mobile' ? 'on' : '') + '">移动版</a>' +
      '<a data-mode="desktop" class="' + (PY.playerMode() === 'desktop' ? 'on' : '') + '">桌面版</a>' +
      '<label class="pm-auto"><input type="checkbox" id="autoPlay"' + (PY.autoPlay() ? ' checked' : '') + '> 自动播放</label>' +
      '</span>' +
      '</div>';
    h += '<div class="player-tip">点播放器中间的 ▶ 开始播放；黑色或空白说明这个播放器被浏览器拦了，' +
      '切上面「桌面版」，或<a href="' + esc(PY.watchUrl(c.id, p)) + '" target="_blank" rel="noopener">去 B 站看这一集</a>。' +
      '左侧点任意一集，这里就换成那一集的视频。</div>';
    h += '</div>';

    h += '<div class="ls-head"><div class="ls-meta">' +
      '<span class="tag">P' + p + '</span>' +
      (L.chapter ? '<span class="tag gray">' + esc(L.chapter.n) + ' ' + esc(L.chapter.name) + '</span>' : '') +
      '<span class="tag gray">本章第 ' + (p - L.chapter.from + 1) + ' / ' + (L.chapter.to - L.chapter.from + 1) + ' 集</span>' +
      '<span class="tag" id="doneTag" style="background:#e8f8ef;color:#15803d' + (done ? '' : ';display:none') + '">✓ 已学</span>' +
      '</div><h1 class="ls-title">' + esc(L.title) + '</h1></div>';

    var kn = 0;
    if (L.pts && L.pts.length) {
      h += '<div class="block"><div class="block-h"><span class="k">' + (++kn) + '</span>本集要点' +
        '<small>看完视频回来对一遍，能对上才算真会</small></div><ol class="pts">';
      for (var i = 0; i < L.pts.length; i++) h += '<li>' + esc(L.pts[i]) + '</li>';
      h += '</ol></div>';
    }

    if (L.code) {
      h += '<div class="block"><div class="block-h"><span class="k">' + (++kn) + '</span>跟着敲一遍' +
        '<small>看完关掉视频，凭记忆重写，再改一个地方</small></div>' +
        '<pre class="code">' + esc(L.code) + '</pre></div>';
    }

    if (L.ex && L.ex.length) {
      h += '<div class="block"><div class="block-h"><span class="k">' + (++kn) + '</span>看完再做' +
        '<small>' + (L.code ? '先自己写，再点开答案' : '先在纸上算，再点开答案') + '</small></div>';
      L.ex.forEach(function (e, i) {
        h += '<div class="ex"><div class="q"><span>Q' + (i + 1) + '</span><div>' + esc(e.q) + '</div></div>' +
          '<details><summary>看答案</summary><div class="a">' + esc(e.a) + '</div></details></div>';
      });
      h += '</div>';
    }

    if (!(L.pts && L.pts.length) && !L.code) {
      h += '<div class="block"><div class="empty-note">这一集是导学 / 回顾 / 答疑 / 完结集，直接看视频就行。</div></div>';
    }

    h += '<div class="lesson-nav">' +
      (p > 1 ? '<a class="btn" href="#/' + c.id + '/' + (p - 1) + '">← 上一集：' + esc(c.pages[p - 2].t) + '</a>' : '<span></span>') +
      (p < total ? '<a class="btn" href="#/' + c.id + '/' + (p + 1) + '">下一集：' + esc(c.pages[p].t) + ' →</a>' : '<span></span>') +
      '</div>';

    document.getElementById('colLesson').innerHTML = h;
    document.title = 'P' + p + ' ' + last.t + ' · ' + c.title;
  }

  function renderTerms(c, L) {
    // 右栏术语交给 Terms 模块：中文转英文名词 + 英英释义 + 掌握检测
    if (window.Terms) {
      window.Terms.setLessonGetter(function () { return L; });
      window.Terms.render(c, L);
      return;
    }
    // 降级：Terms 未加载时保持原来的渲染
    var h = '<div class="terms-head"><b>本节英文专业名词</b>' +
      '<span>美音真人发音 · ' + esc(PY.voiceLabel()) + '</span></div><div class="terms-scroll">';
    if (!L.terms.length) {
      h += '<div style="font-size:12.5px;color:var(--ink3);padding:8px">本章暂无术语。</div>';
    }
    for (var i = 0; i < L.terms.length; i++) {
      var t = L.terms[i];
      h += '<div class="term">' +
        '<div class="en">' + esc(t.en) +
        '<span class="pos">' + esc(t.pos) + '</span>' +
        '<button class="speak" data-say="' + esc(t.en) + '" title="美音朗读" aria-label="朗读 ' + esc(t.en) + '">▶</button></div>' +
        '<div class="zh">' + esc(t.zh) + '</div>' +
        '<div class="eg">' + esc(t.eg) + '<i>' + esc(t.egZh) + '</i></div></div>';
    }
    h += '</div><div class="terms-foot"><span class="voice-dot"></span>点 ▶ 听美音；每集 6 个，一个月就是 180 个</div>';
    document.getElementById('colTerms').innerHTML = h;
  }

  function syncDone(c, p) {
    var done = PY.isDone(c.id, p);
    var btn = document.getElementById('markDone');
    if (btn) { btn.textContent = done ? '✓ 已学' : '标记已学'; btn.className = 'btn btn-sm' + (done ? ' btn-done' : ''); }
    var tag = document.getElementById('doneTag');
    if (tag) tag.style.display = done ? '' : 'none';
  }

  function theme(c) {
    var M = (window.PY_MODULES || {})[c.id] || {};
    if (M.color) {
      var r = document.documentElement.style;
      r.setProperty('--c', M.color);
      r.setProperty('--tint', M.tint);
      r.setProperty('--tint2', M.tint2);
    }
  }

  function render() {
    var st = parse(), c = PY.course(st.id);
    if (!c) return;
    var total = PY.totalOf(c.id);
    var p = Math.max(1, Math.min(total, st.p));
    var L = PY.lessonAt(c.id, p);
    if (!L) return;

    cur = { id: c.id, p: p, dur: PY.durOf(c.id, p) };

    theme(c);
    renderBar(c, p, total);
    renderToc(c, p);
    renderTerms(c, L);
    var key = c.id + '/' + p;
    if (rendered !== key) {
      renderLesson(c, L, p, total);
      rendered = key;
    } else {
      syncDone(c, p);
    }
    window.scrollTo(0, 0);
  }

  document.addEventListener('click', function (e) {
    var sp = e.target.closest ? e.target.closest('.speak') : null;
    if (sp) {
      var txt = sp.getAttribute('data-say');
      sp.classList.add('playing');
      setTimeout(function () { sp.classList.remove('playing'); }, 900);
      var mode = PY.speak(txt);
      if (mode === 'system') {
        var t = document.querySelector('.terms-head span');
        if (t) t.textContent = '美音真人发音 · ' + PY.voiceLabel();
      }
      return;
    }
    if (e.target.id === 'wpause') {
      paused = !paused;
      e.target.textContent = paused ? '继续计时' : '暂停计时';
      e.target.className = 'watch-pause' + (paused ? ' on' : '');
      PY.toast(paused ? '已暂停计时（走开时点它）' : '继续计时');
      return;
    }
    if (e.target.id === 'markDone') {
      var st = parse();
      var on = PY.toggle(st.id, st.p);
      var btn = document.getElementById('markDone');
      if (btn) {
        btn.textContent = on ? '✓ 已学' : '标记已学';
        btn.className = 'btn btn-sm' + (on ? ' btn-done' : '');
      }
      var tag = document.getElementById('doneTag');
      if (tag) tag.style.display = on ? '' : 'none';
      var it = document.querySelector('.toc-item[data-p="' + st.p + '"]');
      if (it) {
        if (on) {
          it.classList.add('done');
          if (!it.querySelector('.ok')) {
            var s2 = document.createElement('span'); s2.className = 'ok'; s2.textContent = '✓';
            it.appendChild(s2);
          }
        } else {
          it.classList.remove('done');
          var ok = it.querySelector('.ok');
          if (ok) ok.parentNode.removeChild(ok);
        }
      }
      if (!on) PY.resetWatch(st.id, st.p);
      paintWatch({ got: PY.watchedOf(st.id, st.p), need: PY.needOf(st.id, st.p), done: on }, PY.durOf(st.id, st.p));
      PY.toast(on ? '已标记：P' + st.p + ' 学完' : '已取消标记');
      return;
    }
    var sw = e.target.closest ? e.target.closest('.pm-switch a') : null;
    if (sw) {
      PY.setPlayerMode(sw.getAttribute('data-mode'));
      rendered = '';
      render();
      PY.toast(sw.getAttribute('data-mode') === 'desktop' ? '已切换桌面版播放器' : '已切换移动版播放器');
      return;
    }
  });

  document.addEventListener('change', function (e) {
    if (e.target && e.target.id === 'autoPlay') {
      PY.setAutoPlay(e.target.checked);
      rendered = '';
      render();
      PY.toast(e.target.checked ? '已开启自动播放（点目录即播）' : '已关闭自动播放');
    }
  });

  window.addEventListener('hashchange', render);
  render();
  // 术语增强数据（释义表 + 用户自建术语）异步加载，到位后重绘右栏一次
  if (window.Terms) {
    window.Terms.load(function () {
      var st = parse(), c = PY.course(st.id);
      if (c) renderTerms(c, PY.lessonAt(c.id, Math.max(1, Math.min(PY.totalOf(c.id), st.p))));
    });
  }
})();
