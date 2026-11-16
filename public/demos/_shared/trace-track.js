/*
 * TRACE prospect tracking — every step a visitor takes on the demo video page
 * and in the demos, batched to /api/demo-events (same origin), which forwards
 * it to the campaign tool. Load it once per page, as early as possible:
 *
 *   <script src="/demos/_shared/trace-track.js" data-site="Ellison & Reyes"></script>
 *
 * Who: the campaign link's recipient id (?rid= — also r, cid, recipient,
 * contact_id) is kept in localStorage, so every later page and demo on this
 * site is tied to that recipient. A random visitor id and a 30-minute session
 * id cover everyone else.
 *
 * What, automatically: session_start, page_view, page_leave (active time and
 * scroll depth), click (calls, texts, emails, bookings, demo links, buttons),
 * form_start, field_done (the field's label only — never its value),
 * form_submit. Pages add their own: traceTrack('video_progress', {...}),
 * traceTrack.identify({ name, email, phone }) once a visitor submits them.
 * Card, bank, PIN and password fields are never read.
 *
 * The event format is documented in docs/tracking-events.md.
 */
(function () {
  if (window.traceTrack) return;
  var me = document.currentScript;
  var SITE = (me && me.dataset.site) || '';
  var ENDPOINT = '/api/demo-events';

  var store = {
    get: function (s, k) { try { return window[s].getItem(k); } catch (e) { return null; } },
    set: function (s, k, v) { try { window[s].setItem(k, v); } catch (e) {} },
  };
  var uid = function () {
    return (Date.now().toString(36) + Math.random().toString(36).slice(2, 10)).slice(0, 20);
  };

  // Recipient, visitor, session.
  var params = new URLSearchParams(location.search);
  var rid = ['rid', 'r', 'cid', 'recipient', 'contact_id'].map(function (k) { return params.get(k); }).filter(Boolean)[0];
  if (rid) store.set('localStorage', 'trace_rid', rid.slice(0, 120));
  rid = store.get('localStorage', 'trace_rid') || undefined;

  var utm = {};
  params.forEach(function (v, k) { if (/^utm_/.test(k)) utm[k] = v.slice(0, 200); });
  if (Object.keys(utm).length) store.set('localStorage', 'trace_utm', JSON.stringify(utm));
  try { utm = JSON.parse(store.get('localStorage', 'trace_utm') || '{}'); } catch (e) { utm = {}; }

  var vid = store.get('localStorage', 'trace_vid');
  if (!vid) { vid = uid(); store.set('localStorage', 'trace_vid', vid); }

  var now = Date.now();
  var sid = store.get('sessionStorage', 'trace_sid');
  var last = +(store.get('localStorage', 'trace_last') || 0);
  var fresh = !sid || now - last > 30 * 60 * 1000;
  if (fresh) { sid = uid(); store.set('sessionStorage', 'trace_sid', sid); }
  store.set('localStorage', 'trace_last', String(now));

  var identity;
  try { identity = JSON.parse(store.get('localStorage', 'trace_identity') || 'null') || undefined; } catch (e) {}

  // Queue and send.
  var queue = [];
  var timer = null;
  // The page: its path, plus a hash route (#/pay) only when the path doesn't already name it.
  var pageKey = function () {
    var path = location.pathname.replace(/\/+$/, '') || '/';
    var h = location.hash.indexOf('#/') === 0 ? location.hash.slice(2).split('?')[0] : '';
    return (h && !path.endsWith('/' + h) ? path + '#/' + h : path).slice(0, 120);
  };

  function flush(leaving) {
    clearTimeout(timer); timer = null;
    if (!queue.length) return;
    var events = queue.splice(0, 60);
    var body = JSON.stringify({
      vid: vid, sid: sid, rid: rid, identity: identity,
      ctx: { landing: (store.get('sessionStorage', 'trace_landing') || location.href).slice(0, 500), referrer: (document.referrer || '').slice(0, 500), utm: utm, screen: screen.width + 'x' + screen.height, lang: navigator.language },
      events: events,
    });
    try {
      fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body, keepalive: true }).catch(function () {});
    } catch (e) {}
    if (queue.length) flush(leaving);
  }

  function track(type, data, page) {
    store.set('localStorage', 'trace_last', String(Date.now()));
    var clean = {};
    Object.keys(data || {}).forEach(function (k) {
      var v = data[k];
      if (v === undefined) return;
      clean[k.slice(0, 60)] = typeof v === 'string' ? v.slice(0, 2000) : v;
    });
    queue.push({ type: String(type).slice(0, 40), at: new Date().toISOString(), site: SITE || undefined, page: (page || pageKey()), data: clean });
    if (queue.length >= 20) flush(); else if (!timer) timer = setTimeout(flush, 4000);
  }

  track.identify = function (who) {
    identity = identity || {};
    ['name', 'email', 'phone'].forEach(function (k) { if (who && who[k]) identity[k] = String(who[k]).slice(0, 160); });
    store.set('localStorage', 'trace_identity', JSON.stringify(identity));
    track('identify', { name: identity.name, email: identity.email, phone: identity.phone });
  };
  track.rid = function () { return rid; };
  track.flush = flush;
  window.traceTrack = track;

  // Session and pages.
  if (!store.get('sessionStorage', 'trace_landing')) store.set('sessionStorage', 'trace_landing', location.href);
  if (fresh) track('session_start', { landing: location.href.slice(0, 500), referrer: (document.referrer || '').slice(0, 500), recipient: rid || null });

  var current = null, since = 0, active = 0, maxScroll = 0, visibleSince = Date.now();
  function scrollPct() {
    var h = document.documentElement.scrollHeight - innerHeight;
    return h > 0 ? Math.min(100, Math.round((scrollY / h) * 100)) : 100;
  }
  function leave() {
    if (!current) return;
    if (document.visibilityState === 'visible') active += Date.now() - visibleSince;
    track('page_leave', { active_seconds: Math.round(active / 1000), total_seconds: Math.round((Date.now() - since) / 1000), max_scroll: maxScroll }, current);
  }
  function view() {
    var key = pageKey();
    if (key === current) return;
    leave();
    current = key; since = Date.now(); active = 0; maxScroll = scrollPct(); visibleSince = Date.now();
    track('page_view', { title: document.title.slice(0, 160), url: location.href.slice(0, 500) }, key);
  }
  ['pushState', 'replaceState'].forEach(function (m) {
    var orig = history[m];
    history[m] = function () { var r = orig.apply(this, arguments); setTimeout(view, 50); return r; };
  });
  addEventListener('popstate', function () { setTimeout(view, 50); });
  addEventListener('hashchange', function () { setTimeout(view, 50); });
  addEventListener('scroll', function () { var p = scrollPct(); if (p > maxScroll) maxScroll = p; }, { passive: true });
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') { active += Date.now() - visibleSince; track('tab_hidden', {}); flush(true); }
    else { visibleSince = Date.now(); track('tab_visible', {}); }
  });
  addEventListener('pagehide', function () { leave(); current = null; flush(true); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', view); else view();

  // Clicks: what they pressed, and what kind of action it was.
  var BOOKING = /cal\.com|calendly|\/contact(\b|$)/i;
  function labelOf(el) {
    return (el.getAttribute('aria-label') || el.innerText || el.value || el.title || '').replace(/\s+/g, ' ').trim().slice(0, 100);
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('a[href], button, [role="button"], [data-track]');
    if (!el) return;
    var href = el.getAttribute('href') || '';
    var kind = el.dataset.track
      || (/^tel:/i.test(href) ? 'call' : /^sms:/i.test(href) ? 'text' : /^mailto:/i.test(href) ? 'email'
      : BOOKING.test(href) ? 'booking' : /\/demos\//.test(href) ? 'demo' : el.tagName === 'A' ? (/^https?:/i.test(href) && href.indexOf(location.host) < 0 ? 'external' : 'link') : 'button');
    track('click', { kind: kind, label: labelOf(el), href: href.slice(0, 500) || undefined });
    if (kind === 'call' || kind === 'text' || kind === 'email' || kind === 'booking' || kind === 'external') flush(true);
  }, true);

  // Forms: started, which fields were completed (labels only), submitted.
  var SECRET = /card|cc-?num|cvc|cvv|exp|pin|ssn|password|routing|account|iban/i;
  var started = new WeakSet ? new WeakSet() : null;
  var done = {};
  function formName(f) {
    return (f.id || f.getAttribute('name') || f.getAttribute('aria-label') || (f.querySelector('h2,h3,legend') || {}).textContent || 'form').replace(/\s+/g, ' ').trim().slice(0, 60);
  }
  function fieldName(el) {
    var lab = (el.id && document.querySelector('label[for="' + el.id + '"]')) || el.closest('label');
    return ((lab && lab.textContent) || el.getAttribute('aria-label') || el.placeholder || el.name || el.id || el.type).replace(/\s+/g, ' ').trim().slice(0, 60);
  }
  document.addEventListener('focusin', function (e) {
    var f = e.target.form || (e.target.closest && e.target.closest('form'));
    if (!f || (started && started.has(f))) return;
    if (started) started.add(f);
    track('form_start', { form: formName(f) });
  });
  document.addEventListener('change', function (e) {
    var el = e.target;
    if (!el || !/INPUT|SELECT|TEXTAREA/.test(el.tagName) || el.type === 'password' || el.type === 'hidden') return;
    var f = el.form || el.closest('form');
    var name = fieldName(el);
    var key = (f ? formName(f) : '') + '|' + name;
    if (done[key]) return;
    done[key] = 1;
    track('field_done', { form: f ? formName(f) : undefined, field: name, filled: el.type === 'checkbox' ? el.checked : !!el.value, sensitive: SECRET.test(name + ' ' + el.id + ' ' + el.name) || undefined });
  });
  document.addEventListener('submit', function (e) {
    track('form_submit', { form: formName(e.target) });
  }, true);
})();
