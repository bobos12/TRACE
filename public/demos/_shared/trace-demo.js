/*
 * Shared by TRACE's concept demos (public/demos/<name>/). Load it before the
 * demo's own script:
 *
 *   <script src="/demos/_shared/trace-demo.js" data-base="/demos/steel-city" data-site="Steel City Bail"></script>
 *
 * 1. Clean URLs. The demos route themselves by hash (#/pay). This maps
 *    /demos/steel-city/pay to #/pay on load, then puts the clean path back in
 *    the address bar after every move, and handles the back button. Old
 *    #/pay links keep working. next.config.ts rewrites the paths to index.html.
 * 2. traceDemo.notify(kind, fields): sends a form to /api/demo-lead, which
 *    emails the team. Never pass card, bank, PIN or ID-photo values.
 */
(function () {
  var me = document.currentScript;
  var BASE = (me && me.dataset.base) || '';
  var SITE = (me && me.dataset.site) || '';

  var seg = function () {
    return location.pathname.slice(BASE.length).replace(/^\/+|\/+$/g, '');
  };
  var keyOf = function () {
    var raw = location.hash.replace(/^#\/?/, '');
    return raw === 'main' ? null : raw;
  };

  // On load: /demos/x/pay → /demos/x/pay#/pay, so the demo's router opens Pay.
  if (BASE && !location.hash && seg()) {
    history.replaceState(history.state, '', BASE + '/' + seg() + '#/' + seg());
  }

  // After the demo's router has run, show the clean path instead of the hash.
  function clean() {
    var raw = keyOf();
    if (raw === null || !BASE) return;
    var parts = raw.split('?');
    var key = parts[0] && parts[0] !== 'home' ? parts[0] : '';
    var url = (key ? BASE + '/' + key : BASE) + (parts[1] ? '?' + parts[1] : '');
    if (location.pathname + location.search + location.hash !== url) history.replaceState(history.state, '', url);
  }
  addEventListener('hashchange', function () { setTimeout(clean, 0); });
  addEventListener('load', function () { setTimeout(clean, 0); });

  // Back and forward land on clean paths with no hash: tell the router.
  addEventListener('popstate', function () {
    if (location.hash || !BASE) return;
    history.replaceState(history.state, '', location.pathname + location.search + '#/' + seg());
    dispatchEvent(new HashChangeEvent('hashchange'));
  });

  function page() {
    var raw = keyOf();
    return ((raw || seg() || 'home').split('?')[0] || 'home').slice(0, 40);
  }

  window.traceDemo = {
    page: page,
    notify: function (kind, fields, sample) {
      var clean = {};
      Object.keys(fields || {}).forEach(function (k) {
        var v = fields[k];
        if (v === undefined || v === null) return;
        v = String(v).trim();
        if (v) clean[k.slice(0, 60)] = v.slice(0, 5800);
      });
      if (!Object.keys(clean).length) return;
      try {
        fetch('/api/demo-lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          keepalive: true,
          body: JSON.stringify({
            kind: kind,
            site: SITE,
            page: page(),
            sample: !!sample,
            fields: clean,
            from: (document.referrer || '').slice(0, 300),
          }),
        }).catch(function () {});
      } catch (e) {}
    },
  };
})();
