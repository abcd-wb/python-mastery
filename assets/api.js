/* 接口地址自适配
   页面从 127.0.0.1:8101 打开 → 走同源；
   页面从预览面板 / 双击本地文件（file://）打开 → 自动直连 http://127.0.0.1:8101，
   这样即使打开方式不对，资料、词库、识图也照样能用。 */
(function () {
  'use strict';

  var host = location.hostname, port = location.port, proto = location.protocol;
  var sameOrigin = (proto === 'http:' || proto === 'https:') &&
    (host === '127.0.0.1' || host === 'localhost' || host === '::1') && port === '8101';

  var BASE = sameOrigin ? '' : 'http://127.0.0.1:8101';
  window.API_BASE = BASE;
  window.api = function (p) { return BASE + p; };
  window.apiSameOrigin = sameOrigin;

  /* 各脚本里写的 fetch('/api/xxx') 自动补成完整地址，不用逐个改 */
  if (BASE && window.fetch) {
    var raw = window.fetch;
    window.fetch = function (u, o) {
      try {
        if (typeof u === 'string' && u.indexOf('/api/') === 0) u = BASE + u;
      } catch (e) { }
      return raw.call(this, u, o);
    };
  }

  var PAGE = (location.pathname.split('/').pop() || 'ielts.html');
  function targetUrl() { return 'http://127.0.0.1:8101/' + PAGE + (location.search || '') + (location.hash || ''); }

  /* 连不上服务时给一条看得见的路，而不是让页面静悄悄地空着 */
  window.apiFail = function (what) {
    if (document.getElementById('apiDown')) return;
    var d = document.createElement('div');
    d.id = 'apiDown';
    d.innerHTML =
      '<b>连不上本地服务</b>' +
      '<span>' + (what || '数据没读出来') +
      (sameOrigin
        ? '　本地服务没在运行：去文件夹里双击「启动.command」，等窗口显示 running 后点重试。'
        : '　当前页面不是从 127.0.0.1:8101 打开的。') +
      '</span>' +
      (sameOrigin
        ? '<a href="javascript:location.reload()">重试</a>'
        : '<a href="' + targetUrl() + '">用 127.0.0.1:8101 打开</a>') +
      '<a class="x" href="javascript:;" onclick="this.parentNode.remove()" aria-label="关掉">×</a>';
    document.body.appendChild(d);
  };
})();
