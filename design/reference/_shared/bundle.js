/* @ds-bundle: {"format":4,"namespace":"Athr","components":[{"name":"Logo"},{"name":"Nuqta"},{"name":"Constellation"},{"name":"Icon"},{"name":"Button"},{"name":"TextField"},{"name":"Select"},{"name":"Checkbox"},{"name":"Radio"},{"name":"Switch"},{"name":"Tabs"},{"name":"NavBar"},{"name":"Sidebar"},{"name":"Card"},{"name":"Modal"},{"name":"Table"},{"name":"Badge"},{"name":"Tooltip"},{"name":"Banner"},{"name":"Toast"},{"name":"EmptyState"},{"name":"Loader"},{"name":"Stat"}]} */
(function () {
  var React = window.React, h = React.createElement;
  var LOGO = {"latin":{"w":3450,"h":1060.97,"word":"M239 1050.97V433.97H0V330.97H608V433.97H369V1050.97ZM723 1050.97V330.97H1027Q1104 330.97 1161 356.97Q1218 382.97 1248.5 429.97Q1279 476.97 1279 539.97Q1279 601.97 1248.5 648.97Q1218 695.97 1161 721.97Q1104 747.97 1027 747.97H825V648.97H1023Q1086 648.97 1119.5 619.97Q1153 590.97 1153 539.97Q1153 488.97 1120 461.47Q1087 433.97 1023 433.97H853V1050.97ZM1135 1050.97 814 682.97H960L1315 1050.97ZM1392 1050.97 1657 330.97H1769L1520 1050.97ZM1935 1050.97 1687 330.97H1805L2069 1050.97ZM1529 767.97H1923V871.97H1529ZM2478 1060.97Q2401 1060.97 2336.5 1033.47Q2272 1005.97 2224 955.97Q2176 905.97 2150 837.97Q2124 769.97 2124 688.97Q2124 607.97 2150 540.97Q2176 473.97 2223.5 424.47Q2271 374.97 2335.5 347.97Q2400 320.97 2478 320.97Q2564 320.97 2633 354.97Q2702 388.97 2746.5 450.47Q2791 511.97 2801 594.97H2673Q2661 513.97 2608 470.47Q2555 426.97 2479 426.97Q2412 426.97 2362 458.97Q2312 490.97 2284 549.47Q2256 607.97 2256 687.97Q2256 769.97 2284 829.47Q2312 888.97 2363 921.97Q2414 954.97 2480 954.97Q2554 954.97 2607 911.47Q2660 867.97 2674 787.97H2803Q2791 869.97 2746.5 931.97Q2702 993.97 2633 1027.47Q2564 1060.97 2478 1060.97ZM2932 1050.97V330.97H3062V1050.97ZM2994 1050.97V947.97H3450V1050.97ZM2994 730.97V629.97H3415V730.97ZM2994 433.97V330.97H3439V433.97Z","dots":["M1731 0L1801 70L1731 140L1661 70Z","M1644.03 86.97L1714.03 156.97L1644.03 226.97L1574.03 156.97Z","M1817.97 86.97L1887.97 156.97L1817.97 226.97L1747.97 156.97Z"]},"arabic":{"w":918,"h":1167,"word":"M0 1036H39Q135 1036 176 992.5Q217 949 216 866Q216 841 213 813.5Q210 786 205 757L184 630L281 614L296 702Q305 752 308 796H401V900L374 927H308Q301 981 281 1025Q261 1069 228 1100.5Q195 1132 148 1149.5Q101 1167 40 1167H0ZM374 823 401 796H426Q496 796 522.5 781.5Q549 767 549 729Q549 713 546.5 688.5Q544 664 537 623L521 533L619 517L633 607Q638 641 641 673.5Q644 706 644 729Q644 831 592 879Q540 927 426 927H374ZM750 309H857V927H750ZM690 154H730L731 150Q712 128 712 97Q712 56 741.5 29Q771 2 816 2Q843 2 869.5 14Q896 26 913 46L868 107Q845 83 816 83Q799 83 788 91.5Q777 100 777 112Q777 148 847 148H918V229H690Z","dots":["M556 200.43L614 258.43L556 316.43L498 258.43Z","M483.86 272.57L541.86 330.57L483.86 388.57L425.86 330.57Z","M628.14 272.57L686.14 330.57L628.14 388.57L570.14 330.57Z"]},"symbol":{"w":450.91,"h":325.46,"dots":["M225.46 -0L325.46 100L225.46 200L125.46 100Z","M100 125.46L200 225.46L100 325.46L0 225.46Z","M350.91 125.46L450.91 225.46L350.91 325.46L250.91 225.46Z"]}};
  var ICONS = {"arrow-right":"M4 12h15M13 6l6 6-6 6","arrow-up-right":"M7 17L17 7M8 7h9v9","check":"M4.5 12.5l5 5 10-11","close":"M6 6l12 12M18 6L6 18","plus":"M12 5v14M5 12h14","minus":"M5 12h14","search":"M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5L20 20","menu":"M4 7h16M4 12h16M4 17h10","chevron-down":"M6 9l6 6 6-6","chevron-right":"M9 6l6 6-6 6","info":"M12 2.5l9.5 9.5-9.5 9.5L2.5 12zM12 11v5M12 8v.01","alert":"M12 3.5l9 16H3zM12 10v4.5M12 17v.01","error":"M12 2.5l9.5 9.5-9.5 9.5L2.5 12zM9.5 9.5l5 5M14.5 9.5l-5 5","success":"M12 2.5l9.5 9.5-9.5 9.5L2.5 12zM8.5 12.2l2.4 2.4 4.6-5","user":"M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20.5c1-3.8 4-5.5 7.5-5.5s6.5 1.7 7.5 5.5","sliders":"M4 7h9M17 7h3M4 17h3M11 17h9M15 5v4M9 15v4","dashboard":"M4 4h7v9H4zM13 4h7v5h-7zM13 11h7v9h-7zM4 15h7v5H4z","inbox":"M3.5 13.5h5l1.5 2.5h4l1.5-2.5h5M3.5 13.5L6 5h12l2.5 8.5v6h-17z","file":"M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6","chart":"M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-6","bell":"M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15zM10 20.5h4","calendar":"M4 6h16v14H4zM4 10h16M8 3.5V7M16 3.5V7","globe":"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9z","code":"M8.5 7L3.5 12l5 5M15.5 7l5 5-5 5M13.5 4.5l-3 15","layers":"M12 3.5l8.5 4.5-8.5 4.5L3.5 8zM3.5 12l8.5 4.5 8.5-4.5M3.5 16l8.5 4.5 8.5-4.5","nuqta":"M12 6l6 6-6 6-6-6z"};
  function cx() { var a = []; for (var i = 0; i < arguments.length; i++) if (arguments[i]) a.push(arguments[i]); return a.join(' '); }
  function omit(p, keys) { var o = {}; for (var k in p) if (keys.indexOf(k) < 0) o[k] = p[k]; return o; }

  function Icon(p) {
    var d = ICONS[p.name] || ICONS.nuqta, solid = p.name === 'nuqta';
    return h('svg', { className: cx('at-ico', p.flip && 'at-flip', p.className), viewBox: '0 0 24 24', width: p.size || 20, height: p.size || 20, 'aria-hidden': p.label ? undefined : true, 'aria-label': p.label, role: p.label ? 'img' : undefined, style: solid ? { fill: 'currentColor', stroke: 'none' } : p.style }, h('path', { d: d }));
  }

  function mark(o, key, s, dx, dy) {
    return h('g', { key: key, transform: 'translate(' + dx + ' ' + dy + ') scale(' + s + ')' },
      h('path', { d: o.word, fill: 'currentColor' }),
      o.dots.map(function (d, i) { return h('path', { key: i, d: d, className: 'at-logo-dot' }); }));
  }
  function Logo(p) {
    var v = p.variant || 'wordmark', size = p.size || 32, L = LOGO.latin, A = LOGO.arabic, w, hh, kids;
    if (v === 'symbol') {
      var s = LOGO.symbol;
      return h('svg', { className: cx('at-logo', p.tone === 'mono' && 'at-logo-mono', p.className), viewBox: '0 0 ' + s.w + ' ' + s.h, height: size, width: size * s.w / s.h, role: 'img', 'aria-label': 'TRACE', style: p.style },
        s.dots.map(function (d, i) { return h('path', { key: i, d: d, className: 'at-logo-dot', style: p.tone === 'accent' && i > 0 ? { fill: 'currentColor' } : null }); }));
    }
    if (v === 'arabic') { w = A.w; hh = A.h; kids = [mark(A, 'a', 1, 0, 0)]; }
    else if (v === 'bilingual') {
      var sc = 0.95, gap = 220, aw = A.w * sc, ah = A.h * sc; hh = Math.max(L.h, ah) + ah * 0.12; w = L.w + gap * 2 + aw;
      kids = [mark(L, 'l', 1, 0, hh - ah * 0.12 - L.h), h('rect', { key: 'r', x: L.w + gap - 6, y: hh - L.h * 0.95, width: 12, height: L.h * 0.85, fill: 'currentColor', opacity: 0.3 }), mark(A, 'a', sc, L.w + gap * 2, hh - ah)];
    } else { w = L.w; hh = L.h; kids = [mark(L, 'l', 1, 0, 0)]; }
    return h('svg', { className: cx('at-logo', p.tone === 'mono' && 'at-logo-mono', p.className), viewBox: '0 0 ' + w + ' ' + hh, height: size, width: size * w / hh, role: 'img', 'aria-label': v === 'arabic' ? 'TRACE' : 'TRACE', style: p.style }, kids);
  }

  function Nuqta(p) {
    return h('span', { className: cx('at-nuqta', p.tone && p.tone !== 'mark' && 'at-nuqta-' + p.tone, p.stamp && 'at-nuqta-stamp', p.className), style: Object.assign({ '--n': (p.size || 10) + 'px' }, p.style), 'aria-hidden': true });
  }

  /* A client's constellation: a 3×3 lattice of nuqtas; the name picks which are filled.
     TRACE's own is the three-nuqta arrangement. Deterministic: same name, same mark. */
  function hash(s) { var x = 2166136261; for (var i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 16777619); } return x >>> 0; }
  function constellation(seed) {
    if (!seed || /^(trace)$/i.test(seed)) return { on: [1, 3, 5], mark: 1 };
    var x = hash(String(seed).toLowerCase()), cells = [0, 1, 2, 3, 4, 5, 6, 7, 8], on = [], n = 3 + (x % 3);
    for (var i = 0; i < n; i++) { x = Math.imul(x ^ (x >>> 15), 2246822507) >>> 0; var k = x % cells.length; on.push(cells.splice(k, 1)[0]); }
    on.sort(function (a, b) { return a - b; });
    return { on: on, mark: on[(x >>> 7) % on.length] };
  }
  function Constellation(p) {
    var c = constellation(p.seed), cells = [];
    for (var i = 0; i < 9; i++) cells.push(h('i', { key: i, className: i === c.mark ? 'mark' : (c.on.indexOf(i) >= 0 ? 'on' : '') }));
    return h('span', { className: cx('at-const', p.quiet && 'at-const-quiet', p.className), style: Object.assign({ '--c': (p.size || 12) + 'px' }, p.style), role: 'img', 'aria-label': (p.seed || 'TRACE') + ' mark' }, cells);
  }

  function Button(p) {
    var variant = p.variant || 'secondary', size = p.size || 'md', cut = p.cut != null ? p.cut : variant === 'primary';
    var rest = omit(p, ['variant', 'size', 'icon', 'iconEnd', 'cut', 'className', 'children', 'as']);
    return h(p.as || (p.href ? 'a' : 'button'), Object.assign({ type: p.href ? undefined : 'button' }, rest, { className: cx('at-btn', 'at-btn-' + variant, size !== 'md' && 'at-btn-' + size, cut && 'at-cut', p.className) }),
      p.icon ? h(Icon, { name: p.icon }) : null, p.children, p.iconEnd ? h(Icon, { name: p.iconEnd, flip: /arrow|chevron-right/.test(p.iconEnd) }) : null);
  }

  var uid = 0; function useId(id) { var r = React.useRef(id || 'at' + (++uid)); return r.current; }
  function Hint(p) {
    if (p.error) return h('div', { className: 'at-hint at-hint-error', id: p.id }, h(Icon, { name: 'error' }), p.error);
    if (p.hint) return h('div', { className: 'at-hint', id: p.id }, p.hint);
    return null;
  }
  function TextField(p) {
    var id = useId(p.id), hid = id + '-h';
    var rest = omit(p, ['label', 'hint', 'error', 'optional', 'prefix', 'multiline', 'className', 'id']);
    var input = h(p.multiline ? 'textarea' : 'input', Object.assign({}, rest, { id: id, className: 'at-input', 'aria-invalid': p.error ? 'true' : undefined, 'aria-describedby': (p.hint || p.error) ? hid : undefined }));
    return h('div', { className: cx('at-field', p.className) },
      p.label ? h('label', { className: 'at-field-label', htmlFor: id }, p.label, p.optional ? h('span', null, p.optional === true ? 'Optional' : p.optional) : null) : null,
      p.prefix ? h('div', { className: 'at-input-wrap' }, h('span', { className: 'at-affix' }, p.prefix), input) : input,
      h(Hint, { id: hid, hint: p.hint, error: p.error }));
  }
  function Select(p) {
    var id = useId(p.id), hid = id + '-h';
    var rest = omit(p, ['label', 'hint', 'error', 'options', 'className', 'id']);
    return h('div', { className: cx('at-field', p.className) },
      p.label ? h('label', { className: 'at-field-label', htmlFor: id }, p.label) : null,
      h('div', { className: 'at-input-wrap at-select-wrap' },
        h('select', Object.assign({}, rest, { id: id, className: 'at-input at-select', 'aria-invalid': p.error ? 'true' : undefined }),
          (p.options || []).map(function (o) { o = typeof o === 'string' ? { value: o, label: o } : o; return h('option', { key: o.value, value: o.value }, o.label); })),
        h(Icon, { name: 'chevron-down' })),
      h(Hint, { id: hid, hint: p.hint, error: p.error }));
  }
  function choice(kind, box) {
    return function (p) {
      var rest = omit(p, ['label', 'className', 'children']);
      return h('label', { className: cx('at-check', p.className) },
        h('input', Object.assign({ type: kind === 'radio' ? 'radio' : 'checkbox', role: kind === 'switch' ? 'switch' : undefined }, rest)),
        box(), p.label || p.children ? h('span', null, p.label || p.children) : null);
    };
  }
  var Checkbox = choice('checkbox', function () { return h('span', { className: 'at-box' }, h(Icon, { name: 'check' })); });
  var Radio = choice('radio', function () { return h('span', { className: 'at-rh' }); });
  var Switch = choice('switch', function () { return h('span', { className: 'at-switch' }); });

  function Tabs(p) {
    var st = React.useState(p.value != null ? p.value : (p.items[0] && (p.items[0].value || p.items[0].label))), val = p.value != null ? p.value : st[0];
    return h('div', { role: 'tablist', className: cx(p.variant === 'segmented' ? 'at-seg' : 'at-tabs', p.className) },
      p.items.map(function (it) {
        var v = it.value || it.label, sel = v === val;
        return h('button', { key: v, role: 'tab', type: 'button', className: 'at-tab', 'aria-selected': sel ? 'true' : 'false', tabIndex: sel ? 0 : -1, onClick: function () { st[1](v); p.onChange && p.onChange(v); } },
          sel && p.variant !== 'segmented' ? h(Nuqta, { size: 8 }) : null, it.label, it.count != null ? h('span', { className: 'at-tab-count' }, it.count) : null);
      }));
  }

  function NavBar(p) {
    return h('header', { className: cx('at-nav', p.className) },
      h('a', { href: '#', 'aria-label': 'TRACE home', style: { display: 'inline-flex', color: 'inherit' } }, h(Logo, { variant: p.arabic ? 'arabic' : 'wordmark', size: p.arabic ? 30 : 22 })),
      h('nav', { className: 'at-nav-links' }, (p.links || []).map(function (l) {
        var o = typeof l === 'string' ? { label: l } : l;
        return h('a', { key: o.label, href: o.href || '#', className: 'at-nav-link', 'aria-current': o.current ? 'page' : undefined }, o.current ? h(Nuqta, { size: 7 }) : null, o.label);
      })),
      h('div', { className: 'at-nav-end' }, p.lang ? h('a', { href: '#', className: 'at-nav-lang', lang: p.arabic ? 'en' : 'ar' }, p.lang) : null, p.cta ? h(Button, { variant: 'ink', size: 'sm', iconEnd: 'arrow-right' }, p.cta) : null));
  }

  function Sidebar(p) {
    return h('aside', { className: cx('at-side', p.className) },
      h('div', { className: 'at-side-head' }, h(Constellation, { seed: p.client || 'TRACE', size: 9 }), h('div', { className: 'at-side-client' }, h('b', null, p.client || 'TRACE'), p.product ? h('span', null, p.product) : null)),
      (p.groups || []).map(function (g, gi) {
        return h('div', { key: gi, className: 'at-side-group' }, g.title ? h('div', { className: 'at-side-title' }, g.title) : null,
          g.items.map(function (it) {
            return h('a', { key: it.label, href: '#', className: 'at-side-item', 'aria-current': it.current ? 'page' : undefined }, h(Icon, { name: it.icon || 'nuqta' }), it.label, it.count != null ? h('span', { className: 'at-side-count' }, it.count) : null);
          }));
      }),
      p.footer ? h('div', { style: { marginTop: 'auto' } }, p.footer) : null);
  }

  function Card(p) {
    return h(p.as || 'section', { className: cx('at-card', p.cut && 'at-cut', p.inverse && 'at-card-inverse', p.className), style: p.style },
      (p.title || p.eyebrow || p.action) ? h('div', { className: 'at-card-head' }, h('div', null,
        p.eyebrow ? h('div', { className: 'at-card-eyebrow', style: { marginBottom: 6 } }, p.eyebrow) : null,
        p.title ? h('h3', { className: 'at-card-title' }, p.title) : null), p.action || null) : null,
      p.children ? h('div', { className: 'at-card-body' }, p.children) : null,
      p.footer ? h('div', { className: 'at-card-foot' }, p.footer) : null);
  }

  function Modal(p) {
    if (p.open === false) return null;
    return h('div', { className: cx('at-scrim', p.inline && 'at-scrim-inline'), onClick: function (e) { if (e.target === e.currentTarget && p.onClose) p.onClose(); } },
      h('div', { className: 'at-modal', role: 'dialog', 'aria-modal': true, 'aria-label': p.title },
        h('div', { className: 'at-modal-head' }, h('h2', { className: 'at-modal-title' }, p.title), h('button', { className: 'at-icon-btn', 'aria-label': 'Close', onClick: p.onClose }, h(Icon, { name: 'close' }))),
        h('div', { className: 'at-modal-body' }, p.children),
        p.actions ? h('div', { className: 'at-modal-foot' }, p.actions) : null));
  }

  function Table(p) {
    return h('div', { className: cx('at-table-wrap', p.className) }, h('table', { className: 'at-table' },
      h('thead', null, h('tr', null, p.columns.map(function (c) { return h('th', { key: c.key, className: c.numeric ? 'at-num' : undefined, style: c.width ? { width: c.width } : null }, c.label); }))),
      h('tbody', null, p.rows.map(function (r, i) {
        return h('tr', { key: r.id || i, 'aria-selected': r.selected ? 'true' : undefined }, p.columns.map(function (c) {
          var v = c.render ? c.render(r) : r[c.key];
          return h('td', { key: c.key, className: cx(c.numeric && 'at-num', c.muted && 'at-muted') }, v);
        }));
      }))));
  }

  function Badge(p) {
    return h('span', { className: cx('at-badge', p.tone && p.tone !== 'neutral' && 'at-badge-' + p.tone, p.className) }, p.dot ? h(Nuqta, { size: 7 }) : null, p.children);
  }

  function Tooltip(p) {
    return h('span', { className: 'at-tip-anchor' }, p.children, h('span', { role: 'tooltip', className: 'at-tip', 'data-open': p.open ? 'true' : undefined }, p.label, p.kbd ? h('span', { className: 'at-kbd' }, p.kbd) : null));
  }

  var TONE_ICON = { success: 'success', warning: 'alert', danger: 'error', accent: 'nuqta', neutral: 'info' };
  function Banner(p) {
    var tone = p.tone || 'neutral';
    return h('div', { className: cx('at-banner', tone !== 'neutral' && 'at-banner-' + tone, p.className), role: tone === 'danger' ? 'alert' : 'status' },
      h(Icon, { name: p.icon || TONE_ICON[tone] }),
      h('div', { className: 'at-banner-body' }, p.title ? h('b', null, p.title, ' ') : null, p.children),
      p.action || null,
      p.onClose ? h('button', { className: 'at-icon-btn', 'aria-label': 'Dismiss', onClick: p.onClose, style: { width: 24, height: 24 } }, h(Icon, { name: 'close', size: 16 })) : null);
  }
  function Toast(p) {
    return h('div', { className: cx('at-toast', p.className), role: 'status' },
      h(Nuqta, { size: 10, stamp: true }),
      h('div', { className: 'at-banner-body' }, p.children),
      p.action || null,
      h('button', { className: 'at-icon-btn', 'aria-label': 'Dismiss', onClick: p.onClose, style: { width: 28, height: 28 } }, h(Icon, { name: 'close', size: 16 })),
      p.trace === false ? null : h('span', { className: 'at-toast-trace', 'aria-hidden': true }));
  }

  function EmptyState(p) {
    return h('div', { className: cx('at-empty', p.className) },
      h(Constellation, { seed: p.seed || 'empty', size: 12, quiet: false }),
      h('h4', null, p.title), p.children ? h('p', null, p.children) : null, p.action || null);
  }

  function Loader(p) {
    return h('span', { className: cx('at-loader', p.className), style: { '--l': (p.size || 10) + 'px' }, role: 'status', 'aria-label': p.label || 'Loading' }, h('i'), h('i'), h('i'));
  }

  function Stat(p) {
    var up = p.delta && /^\+/.test(p.delta), down = p.delta && /^[-−]/.test(p.delta), good = p.invert ? down : up;
    return h('div', { className: cx('at-stat', p.className) },
      h('div', { className: 'at-stat-label' }, p.label, p.hint || null),
      h('div', { className: 'at-stat-value' }, p.value),
      p.delta ? h('div', { className: cx('at-stat-delta', good ? 'at-up' : 'at-down') }, h(Icon, { name: up ? 'arrow-up-right' : 'arrow-right', size: 14, style: down ? { transform: 'rotate(45deg)' } : null }), p.delta, p.period ? h('span', { className: 'at-muted' }, ' ' + p.period) : null) : null);
  }

  var api = { Logo: Logo, Nuqta: Nuqta, Constellation: Constellation, Icon: Icon, Button: Button, TextField: TextField, Select: Select, Checkbox: Checkbox, Radio: Radio, Switch: Switch, Tabs: Tabs, NavBar: NavBar, Sidebar: Sidebar, Card: Card, Modal: Modal, Table: Table, Badge: Badge, Tooltip: Tooltip, Banner: Banner, Toast: Toast, EmptyState: EmptyState, Loader: Loader, Stat: Stat, constellation: constellation };
  window.Athr = Object.assign(window.Athr || {}, api);
})();
