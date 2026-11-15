/* 模块四：高分积累 —— 分话题句型，英文语音朗读 + 改写练习存本机 */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  function toast(m) { if (window.PY && PY.toast) PY.toast(m); }

  var DATA = window.IELTS_PHRASES || { topics: [], items: [] };
  var KEY = 'ielts_phrases_v1';
  var mine = {};
  try { mine = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { mine = {}; }

  var topic = 'all', kind = 'all', q = '';
  var voice = null, vs = [];

  function save() { try { localStorage.setItem(KEY, JSON.stringify(mine)); } catch (e) { } }

  /* ---------- 语音 ---------- */
  function pickEn() {
    vs = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    var en = vs.filter(function (v) { return /^en/i.test(v.lang); });
    var prefer = ['Google UK English Female', 'Samantha', 'Serena', 'Karen', 'Aria', 'Hazel', 'Zira', 'Google US English'];
    for (var i = 0; i < prefer.length; i++)
      for (var j = 0; j < en.length; j++) if (en[j].name.indexOf(prefer[i]) >= 0) return en[j];
    return en[0] || null;
  }
  function refreshVoice() {
    voice = pickEn();
    var el = $('vname');
    if (el) el.textContent = voice ? voice.name.replace(/Microsoft |Google /, '').slice(0, 22) : '本机无英文音色';
  }
  function speak(text) {
    if (!window.speechSynthesis) { toast('这台浏览器不支持语音'); return; }
    speechSynthesis.cancel();
    if (!voice) refreshVoice();
    var u = new SpeechSynthesisUtterance(text);
    if (voice) u.voice = voice;
    u.lang = voice ? voice.lang : 'en-GB';
    u.rate = 0.9; u.pitch = 1;
    speechSynthesis.speak(u);
  }

  /* ---------- 渲染 ---------- */
  function items() {
    var list = DATA.items.slice();
    if (topic !== 'all') list = list.filter(function (x) { return x.topic === topic; });
    if (kind !== 'all') list = list.filter(function (x) { return x.kind === kind; });
    if (q) {
      var s = q.toLowerCase();
      list = list.filter(function (x) {
        return (x.en + ' ' + x.zh + ' ' + x.use).toLowerCase().indexOf(s) >= 0;
      });
    }
    return list;
  }

  function tName(id) {
    for (var i = 0; i < DATA.topics.length; i++) if (DATA.topics[i].id === id) return DATA.topics[i];
    return { name: id, en: '' };
  }

  function renderTopics() {
    var h = '<button class="mini' + (topic === 'all' ? ' on' : '') + '" data-t="all"' +
      (topic === 'all' ? ' style="border-color:#0d9488;color:#0d9488"' : '') + '>全部话题</button>';
    DATA.topics.forEach(function (t) {
      var n = DATA.items.filter(function (x) { return x.topic === t.id; }).length;
      h += '<button class="mini' + (topic === t.id ? ' on' : '') + '" data-t="' + t.id + '"' +
        (topic === t.id ? ' style="border-color:#0d9488;color:#0d9488"' : '') + '>' +
        esc(t.name) + ' <span style="color:#a8b3c4">' + n + '</span></button>';
    });
    $('topics').innerHTML = h;
  }

  function renderList() {
    var list = items();
    var h = '';
    if (!list.length) {
      h = '<div class="card pad" style="text-align:center;color:#8b98ad;font-size:13.5px">没有匹配的句子，换个关键词。</div>';
    }
    list.forEach(function (it) {
      var t = tName(it.topic);
      var done = !!mine[it.id];
      h += '<div class="ph-card" data-id="' + it.id + '">' +
        '<div class="en">' + esc(it.en) + '</div>' +
        '<div class="zh">' + esc(it.zh) + '</div>' +
        '<div class="use">' + esc(t.name) + ' · ' + (it.kind === 'writing' ? '写作' : '口语') + ' · ' + esc(it.use) + '</div>' +
        '<div class="ph-tools">' +
        '<button class="mini" data-act="say">🔊 朗读</button>' +
        '<button class="mini" data-act="slow">🐢 慢读</button>' +
        '<button class="mini" data-act="edit">✎ 练一句</button>' +
        (done ? '<span class="mini" style="border-color:#b9e6cc;color:#15803d;background:#f2fbf6">已练</span>' : '') +
        '</div>' +
        '<div class="ph-edit">' +
        '<textarea placeholder="照着这句改写：换成你自己的话题和例子，写完保存。"></textarea>' +
        '<div class="row"><button class="btn btn-sm btn-primary" data-act="save">保存</button>' +
        '<button class="btn btn-sm" data-act="close">收起</button>' +
        '<span class="fb"></span></div></div>' +
        '</div>';
    });
    $('list').innerHTML = h;
    $('total').textContent = list.length;
    $('done').textContent = Object.keys(mine).length;
  }

  function render() { renderTopics(); renderList(); }

  /* ---------- 交互 ---------- */
  $('topics').addEventListener('click', function (e) {
    var b = e.target.closest('[data-t]');
    if (!b) return;
    topic = b.getAttribute('data-t');
    render();
  });

  document.querySelectorAll('.mini[data-kind]').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.mini[data-kind]').forEach(function (x) {
        x.classList.remove('on');
        x.removeAttribute('style');
      });
      this.classList.add('on');
      this.style.borderColor = '#0d9488';
      this.style.color = '#0d9488';
      kind = this.getAttribute('data-kind');
      renderList();
    });
  });

  $('q').addEventListener('input', function () { q = this.value.trim(); renderList(); });

  $('list').addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]');
    if (!b) return;
    var card = b.closest('.ph-card');
    var id = card.getAttribute('data-id');
    var it = DATA.items.filter(function (x) { return x.id === id; })[0];
    if (!it) return;
    var act = b.getAttribute('data-act');

    if (act === 'say' || act === 'slow') {
      window.speechSynthesis && speechSynthesis.cancel();
      if (!voice) refreshVoice();
      var u = new SpeechSynthesisUtterance(it.en);
      if (voice) u.voice = voice;
      u.lang = voice ? voice.lang : 'en-GB';
      u.rate = act === 'slow' ? 0.68 : 0.9;
      speechSynthesis.speak(u);
      return;
    }
    if (act === 'edit') {
      var box = card.querySelector('.ph-edit');
      box.classList.toggle('on');
      if (box.classList.contains('on')) {
        var ta = box.querySelector('textarea');
        if (mine[id]) ta.value = mine[id].text;
        ta.focus();
        var fb = box.querySelector('.fb');
        fb.textContent = mine[id] ? '上次保存于 ' + new Date(mine[id].ts).toLocaleDateString() : '';
        fb.className = 'fb';
      }
      return;
    }
    if (act === 'close') {
      card.querySelector('.ph-edit').classList.remove('on');
      return;
    }
    if (act === 'save') {
      var ta2 = card.querySelector('textarea');
      var txt = ta2.value.trim();
      if (!txt) { toast('还没写东西'); return; }
      mine[id] = { text: txt, ts: Date.now() };
      save();
      var fb2 = card.querySelector('.fb');
      var words = (txt.match(/[A-Za-z][A-Za-z'’-]*/g) || []).length;
      var ok = words >= 8;
      fb2.className = 'fb ' + (ok ? 'good' : 'mid');
      fb2.textContent = ok ? '已保存（' + words + ' 词），这句就是你的了' : '存下了，但只有 ' + words + ' 词，再写长一点更像样';
      if (!card.querySelector('.ph-tools .mini[style*="f2fbf6"]')) {
        var tag = document.createElement('span');
        tag.className = 'mini';
        tag.setAttribute('style', 'border-color:#b9e6cc;color:#15803d;background:#f2fbf6');
        tag.textContent = '已练';
        card.querySelector('.ph-tools').appendChild(tag);
      }
      $('done').textContent = Object.keys(mine).length;
      toast('已保存');
      return;
    }
  });

  if (window.speechSynthesis) {
    speechSynthesis.onvoiceschanged = refreshVoice;
    setTimeout(refreshVoice, 300);
    refreshVoice();
  }
  render();
})();
