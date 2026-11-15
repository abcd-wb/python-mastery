/* 课堂右栏增强：中文→英文专业名词（可持久化） + 术语掌握检测
   依赖：PY.esc / PY.speak / PY.toast（core.js），需在 classroom.js 之前加载。
   数据：/api/term/defs（英英释义表）、/api/term/user（用户自定义术语）。 */
(function () {
  var esc = PY.esc;

  // 内存缓存：defs[en]=英英释义；extra[scope]=用户添加的本课程术语
  var defs = {}, userTerms = [], loaded = false;

  function api(path, body, cb) {
    var opt = { method: 'POST', headers: { 'Content-Type': 'application/json' } };
    if (body !== undefined) opt.body = JSON.stringify(body);
    fetch(path, opt).then(function (r) { return r.json(); }).then(cb)
      .catch(function () { cb({ ok: false }); });
  }
  function getJSON(path, cb) {
    fetch(path).then(function (r) { return r.json(); }).then(cb)
      .catch(function () { cb({ ok: false }); });
  }

  function loadAll(done) {
    var a = false, b = false;
    function tick() { if (a && b) { loaded = true; if (done) done(); } }
    getJSON('/api/term/defs', function (r) {
      if (r && r.ok && r.defs) defs = r.defs; a = true; tick();
    });
    getJSON('/api/term/user', function (r) {
      if (r && r.ok && r.terms) userTerms = r.terms; b = true; tick();
    });
  }

  // 当前课 id（用于区分用户术语属于哪门课）
  function curId() {
    var parts = (location.hash || '').replace(/^#\/?/, '').split('/');
    return (PY.COURSES && PY.COURSES[parts[0]]) ? parts[0] : 'intro';
  }

  // 规范化术语条目：core.js 产出的是对象 {en,pos,zh,eg,egZh}，用户添加也是对象
  function norm(t) {
    if (!t) return { en: '', pos: '', zh: '', eg: '', egZh: '', mine: false };
    if (Array.isArray(t)) {
      return { en: String(t[0] || ''), pos: String(t[1] || ''), zh: String(t[2] || ''),
               eg: String(t[3] || ''), egZh: String(t[4] || ''), mine: !!t[5] };
    }
    return { en: String(t.en || ''), pos: String(t.pos || ''), zh: String(t.zh || ''),
             eg: String(t.eg || ''), egZh: String(t.egZh || ''), mine: !!t.mine };
  }

  // 把术语条目追加进当前课的术语池（去重：同英文词覆盖）
  function mergeUserTerms(c, L) {
    var base = (L.terms || []).map(norm);
    var mine = userTerms.filter(function (t) {
      return !t.scope || t.scope === '*' || (c && t.scope === c.id);
    });
    if (!mine.length) return base;
    var have = {};
    base.forEach(function (t) { have[t.en.toLowerCase()] = 1; });
    mine.forEach(function (t) {
      if (!t.en || have[t.en.toLowerCase()]) return;
      base.push(norm({ en: t.en, pos: t.pos || 'n.', zh: t.zh || '',
                       eg: t.eg || '', def: t.def || '', mine: true }));
      have[t.en.toLowerCase()] = 1;
    });
    return base;
  }

  function defOf(en) {
    if (!en) return '';
    if (defs[en]) return defs[en];
    var k = Object.keys(defs).find(function (x) { return x.toLowerCase() === String(en).toLowerCase(); });
    return k ? defs[k] : '';
  }

  // ---------- 渲染右栏 ----------
  function renderTerms(c, L) {
    var box = document.getElementById('colTerms');
    if (!box) return;
    var terms = mergeUserTerms(c, L);
    var h = '<div class="terms-head"><b>本节专业名词</b>' +
      '<span>美音发音 · 英英释义 · 点 ▶ 听</span></div>';

    // 中文输入区
    h += '<div class="term-add" id="termAddBox">' +
      '<input id="termZh" type="text" placeholder="输入中文术语，回车转英文名词" autocomplete="off">' +
      '<button id="termAddBtn" title="转成英文专业名词">＋</button>' +
      '<div class="term-add-msg" id="termAddMsg"></div></div>';

    // 检测入口
    h += '<div class="term-quiz-bar"><button id="termQuizBtn">🎯 掌握检测</button>' +
      '<span id="termQuizScore"></span></div>';

    h += '<div class="terms-scroll">';
    if (!terms.length) {
      h += '<div style="font-size:12.5px;color:var(--ink3);padding:8px">本章暂无术语，可在上方输入中文添加。</div>';
    }
    for (var i = 0; i < terms.length; i++) {
      var t = terms[i], en = t.en, pos = t.pos;
      var zh = t.zh, eg = t.eg, egZh = t.egZh;
      var mine = t.mine ? '<span class="term-mine">自建</span>' : '';
      var d = defOf(en);
      h += '<div class="term">' +
        '<div class="en">' + esc(en) + mine +
        '<span class="pos">' + esc(pos) + '</span>' +
        '<button class="speak" data-say="' + esc(en) + '" title="美音朗读" aria-label="朗读 ' + esc(en) + '">▶</button></div>' +
        '<div class="zh">' + esc(zh) + '</div>' +
        (d ? '<div class="def"><span>EN</span>' + esc(d) + '</div>' : '') +
        (eg ? '<div class="eg">' + esc(eg) + '<i>' + esc(egZh) + '</i></div>' : '') +
        (t.mine ? '<button class="term-del" data-del="' + esc(en) + '" title="删除自建术语">×</button>' : '') +
        '</div>';
    }
    h += '</div><div class="terms-foot"><span class="voice-dot"></span>点 ▶ 听美音 · 输入中文可自建术语</div>';
    box.innerHTML = h;
    paintScore();
  }

  // ---------- 中文转英文名词 ----------
  function addTerm() {
    var inp = document.getElementById('termZh');
    var msg = document.getElementById('termAddMsg');
    if (!inp) return;
    var zh = inp.value.trim();
    if (!zh) { inp.focus(); return; }
    if (msg) { msg.className = 'term-add-msg busy'; msg.textContent = '正在翻译…'; }
    var btn = document.getElementById('termAddBtn');
    if (btn) btn.disabled = true;

    api('/api/term/zh2en', { zh: zh }, function (r) {
      if (btn) btn.disabled = false;
      if (!r.ok || !r.term || !r.term.en) {
        if (msg) { msg.className = 'term-add-msg err'; msg.textContent = (r.err || '翻译失败，请重试'); }
        return;
      }
      var t = r.term, id = curId();
      api('/api/term/user/add', {
        en: t.en, pos: t.pos || 'n.', zh: zh, def: t.def || '',
        eg: t.eg || '', scope: id
      }, function (r2) {
        if (!r2.ok) {
          if (msg) { msg.className = 'term-add-msg err'; msg.textContent = '保存失败'; }
          return;
        }
        userTerms.push({
          en: t.en, pos: t.pos || 'n.', zh: zh, def: t.def || '',
          eg: t.eg || '', scope: id
        });
        // 若 AI 给了释义，同步进内存释义表，检测里立刻可用
        if (t.def) defs[t.en] = t.def;
        inp.value = '';
        if (msg) { msg.className = 'term-add-msg ok'; msg.textContent = '✓ 已添加 ' + t.en; }
        renderTerms({ id: id }, currentLesson());
        setTimeout(function () {
          var m = document.getElementById('termAddMsg');
          if (m) { m.textContent = ''; m.className = 'term-add-msg'; }
        }, 2600);
      });
    });
  }

  // 重新渲染需要当前课与课时数据；从 DOM 反推不可靠，交给 hook 注入
  var currentLessonFn = function () { return { terms: [] }; };
  function setLessonGetter(fn) { currentLessonFn = fn; }
  function currentLesson() { return currentLessonFn(); }

  // ---------- 掌握检测练习 ----------
  var quiz = { list: [], idx: 0, right: 0, type: 0, order: [] };

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function startQuiz() {
    var c = PY.course(curId()), L = currentLesson();
    var terms = mergeUserTerms(c, L).filter(function (t) { return t.en && t.zh; });
    if (terms.length < 2) { PY.toast('术语太少，先添加几个再检测'); return; }
    // 三类题交叉：0 听音选英英释义 / 1 看英英释义选名词 / 2 例句挖空选名词
    quiz.order = shuffle([0, 1, 2]);
    quiz.list = shuffle(terms).slice(0, Math.min(terms.length, 10));
    quiz.idx = 0; quiz.right = 0;
    showQuestion();
  }

  function pickDistractors(correct, n) {
    var pool = quiz.list.filter(function (t) { return t !== correct && t.en; });
    return shuffle(pool).slice(0, n);
  }

  function showQuestion() {
    if (quiz.idx >= quiz.list.length) { showResult(); return; }
    var t = quiz.list[quiz.idx];
    var type = quiz.order[quiz.idx % quiz.order.length];
    var en = t.en, zh = t.zh, d = defOf(en), eg = t.eg || '';
    // 若该题缺少必需数据，换一种题型（英英释义题必须真有释义，否则退化成看中文）
    if (type === 0 && !d) type = eg ? 2 : 1;
    if (type === 1 && !d && !zh) type = 2;
    if (type === 2 && !eg) type = d ? 0 : 1;

    var title = ['听发音 · 选英英释义', '看释义 · 选名词', '例句填空 · 选名词'][type];
    var q = '', opts = [], answer = '';

    if (type === 0) {
      q = '<button class="quiz-speak" id="quizSpeak" title="点我听发音">▶ 播放 ' + esc(en) + '</button>' +
          '<div class="quiz-hint">听英文发音，选出正确的<b>英文释义</b></div>';
      answer = d;
      opts = [d];
      pickDistractors(t, 3).forEach(function (x) {
        var v = defOf(x.en) || x.zh;
        if (v && v !== answer) opts.push(v);
      });
    } else if (type === 1) {
      q = '<div class="quiz-def">' + esc(d || zh) + '</div>' +
          '<div class="quiz-hint">选出对应的<b>英文专业名词</b>（' + (d ? '英英释义' : '中文释义') + '）</div>';
      answer = en;
      opts = [en];
      pickDistractors(t, 3).forEach(function (x) { if (x.en && x.en !== en) opts.push(x.en); });
    } else {
      var blanked = blankExample(eg, en);
      q = '<div class="quiz-eg">' + esc(blanked) + '</div>' +
          '<div class="quiz-hint">例句中缺了哪个<b>专业名词</b>？（中文提示：' + esc(zh) + '）</div>';
      answer = en;
      opts = [en];
      pickDistractors(t, 3).forEach(function (x) { if (x.en && x.en !== en) opts.push(x.en); });
    }

    opts = shuffle(opts).slice(0, 4);
    var optHtml = opts.map(function (o, i) {
      return '<button class="quiz-opt" data-opt="' + esc(o) + '">' +
        '<span class="quiz-key">' + 'ABCD'[i] + '</span>' + esc(o) + '</button>';
    }).join('');

    var pct = Math.round(quiz.idx / quiz.list.length * 100);
    var html = '<div class="quiz-mask" id="quizMask"><div class="quiz-card">' +
      '<div class="quiz-top"><b>🎯 术语掌握检测</b><span>' + (quiz.idx + 1) + ' / ' + quiz.list.length + '</span></div>' +
      '<div class="quiz-bar"><i style="width:' + pct + '%"></i></div>' +
      '<div class="quiz-title">' + title + '</div>' +
      '<div class="quiz-q">' + q + '</div>' +
      '<div class="quiz-opts">' + optHtml + '</div>' +
      '<div class="quiz-fb" id="quizFb"></div>' +
      '<div class="quiz-foot"><button id="quizClose">退出</button></div>' +
      '</div></div>';
    var host = document.getElementById('quizHost');
    if (!host) { host = document.createElement('div'); host.id = 'quizHost'; document.body.appendChild(host); }
    host.innerHTML = html;
    window.__quizAnswer = answer;
    if (type === 0) {
      var sb = document.getElementById('quizSpeak');
      if (sb) sb.onclick = function () { PY.speak(en); };
      setTimeout(function () { PY.speak(en); }, 350);  // 自动播一次
    }
  }

  // 把例句里的英文术语（含常见变形）挖空
  function blankExample(eg, en) {
    if (!eg) return eg;
    var words = String(en).toLowerCase().split(/\s+/);
    var last = words[words.length - 1].replace(/[^a-z]/g, '');
    var stem = last.length > 4 ? last.slice(0, -2) : last;  // 粗略去 ing/ed/s
    var re = new RegExp('\\b' + stem + '[a-z]*', 'ig');
    var out = eg.replace(re, '______');
    if (out === eg) return '______ ' + eg;  // 没匹配到就前置空格
    return out;
  }

  function answerOpt(el) {
    var val = el.getAttribute('data-opt');
    var right = val === window.__quizAnswer;
    if (right) quiz.right++;
    var fb = document.getElementById('quizFb');
    var t = quiz.list[quiz.idx];
    if (fb) {
      fb.className = 'quiz-fb ' + (right ? 'ok' : 'no');
      fb.innerHTML = (right ? '✓ 正确' : '✗ 正确答案：' + esc(String(window.__quizAnswer))) +
        '<div class="quiz-fb-eg">' + esc(t.zh || '') + ' · ' + esc(t.en || '') + '</div>';
    }
    document.querySelectorAll('.quiz-opt').forEach(function (b) {
      b.disabled = true;
      if (b.getAttribute('data-opt') === window.__quizAnswer) b.classList.add('right');
      else if (b === el) b.classList.add('wrong');
    });
    setTimeout(function () { quiz.idx++; showQuestion(); }, right ? 900 : 1500);
  }

  function showResult() {
    var total = quiz.list.length, pct = Math.round(quiz.right / total * 100);
    var host = document.getElementById('quizHost');
    if (!host) return;
    var lvl = pct >= 90 ? '很棒，已掌握 👍' : pct >= 60 ? '不错，再练几轮' : '继续加油，多听多记';
    host.innerHTML = '<div class="quiz-mask"><div class="quiz-card quiz-result">' +
      '<div class="quiz-score">' + quiz.right + ' / ' + total + '</div>' +
      '<div class="quiz-score-sub">正确率 ' + pct + '% · ' + lvl + '</div>' +
      '<div class="quiz-result-btns"><button id="quizAgain">再来一轮</button><button id="quizClose2">返回</button></div>' +
      '</div></div>';
    saveScore(pct);
    var a = document.getElementById('quizAgain');
    if (a) a.onclick = startQuiz;
    var b = document.getElementById('quizClose2');
    if (b) b.onclick = closeQuiz;
  }

  function closeQuiz() {
    var host = document.getElementById('quizHost');
    if (host) host.innerHTML = '';
  }

  function saveScore(pct) {
    try {
      var k = 'term_quiz_score_' + curId(), best = parseInt(localStorage.getItem(k) || '0', 10);
      if (pct > best) localStorage.setItem(k, String(pct));
      paintScore();
    } catch (e) {}
  }
  function paintScore() {
    var el = document.getElementById('termQuizScore');
    if (!el) return;
    try {
      var v = parseInt(localStorage.getItem('term_quiz_score_' + curId()) || '0', 10);
      el.textContent = v ? '最佳 ' + v + '%' : '';
    } catch (e) { el.textContent = ''; }
  }

  // ---------- 事件委托 ----------
  document.addEventListener('click', function (e) {
    if (e.target.id === 'termAddBtn') { addTerm(); return; }
    if (e.target.id === 'termQuizBtn') { startQuiz(); return; }
    if (e.target.id === 'quizClose' || e.target.id === 'quizClose2') { closeQuiz(); return; }
    if (e.target.id === 'quizAgain') { startQuiz(); return; }
    var od = e.target.closest ? e.target.closest('.term-del') : null;
    if (od) {
      var en = od.getAttribute('data-del');
      api('/api/term/user/del', { en: en }, function () {
        userTerms = userTerms.filter(function (x) { return (x.en || '').toLowerCase() !== (en || '').toLowerCase(); });
        renderTerms({ id: curId() }, currentLesson());
        PY.toast('已删除 ' + en);
      });
      return;
    }
    var op = e.target.closest ? e.target.closest('.quiz-opt') : null;
    if (op && !op.disabled) { answerOpt(op); return; }
    if (e.target.id === 'quizMask' && e.target === document.getElementById('quizMask')) closeQuiz();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target && e.target.id === 'termZh') { e.preventDefault(); addTerm(); }
    if (e.key === 'Escape') closeQuiz();
  });

  // ---------- 暴露给 classroom.js ----------
  window.Terms = {
    load: loadAll,
    render: renderTerms,
    setLessonGetter: setLessonGetter,
    isReady: function () { return loaded; }
  };
})();
