/**
 * The price guides in sales/pricing/pdf/ — an overview plus one PDF per service, US Letter.
 * Internal sales material: never linked from or served by the website.
 *
 *   node scripts/make-pricing.mjs            # all PDFs
 *   node scripts/make-pricing.mjs --png      # also write page PNGs to sales/pricing/preview/
 *
 * Prices and copy live in sales/pricing/pricing.json.
 */
import { chromium } from '@playwright/test';
import { mkdir, readFile, rm } from 'node:fs/promises';

const OUT = 'sales/pricing/pdf';
const PREVIEW = 'sales/pricing/preview';
const png = process.argv.includes('--png');

const data = JSON.parse(await readFile('sales/pricing/pricing.json', 'utf8'));
const contact = JSON.parse(await readFile('content/contact.json', 'utf8'));
const tokens = await readFile('design/tokens/tokens.css', 'utf8');
const b64 = async (f) => (await readFile(f)).toString('base64');
const sans = await b64('public/fonts/InstrumentSans-Variable.woff2');
const mono4 = await b64('public/fonts/IBMPlexMono-400.woff2');
const mono5 = await b64('public/fonts/IBMPlexMono-500.woff2');
const svgClean = (s) => s.replace(/<\?xml[^>]*>/, '').replace(/<title>.*?<\/title>/, '');
const wordmark = svgClean(await readFile('public/brand/trace-wordmark.svg', 'utf8'));
const wordmarkReverse = svgClean(await readFile('public/brand/trace-wordmark-reverse.svg', 'utf8'));

const DOMAIN = 'trace-studio.tech';
const SITE = `https://${DOMAIN}`;
const EMAIL = contact.email;
const PLACE = contact.cities.en.join(' · ');

/* ---------- helpers ---------- */

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const usd = (n) => `$${Number(n).toLocaleString('en-US')}`;
const pad = (n) => String(n).padStart(2, '0');

/** A nuqta — the rhombus, as inline SVG so it stays crisp in print. */
const nuqta = (size = 10, cls = 'nq') =>
  `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 10 10" aria-hidden="true"><path d="M5 0 10 5 5 10 0 5Z"/></svg>`;

/** Port of src/lib/constellation.ts — same seed, same mark. */
function constellation(seed) {
  let x = 2166136261;
  const s = seed.trim().toLowerCase();
  for (let i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 16777619); }
  x >>>= 0;
  const cells = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const on = [];
  const n = 3 + (x % 3);
  for (let i = 0; i < n; i++) {
    x = Math.imul(x ^ (x >>> 15), 2246822507) >>> 0;
    const [picked] = cells.splice(x % cells.length, 1);
    if (picked !== undefined) on.push(picked);
  }
  on.sort((a, b) => a - b);
  return { on, mark: on[(x >>> 7) % on.length] ?? on[0] ?? 0 };
}

function constellationSvg(seed, size) {
  const { on, mark } = constellation(seed);
  const step = size / 3;
  const r = step * 0.36;
  let out = '';
  for (let i = 0; i < 9; i++) {
    const cx = step * (i % 3) + step / 2;
    const cy = step * Math.floor(i / 3) + step / 2;
    const pts = `${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`;
    if (i === mark) out += `<polygon points="${pts}" fill="var(--vermilion)"/>`;
    else if (on.includes(i)) out += `<polygon points="${pts}" fill="var(--ink)"/>`;
    else out += `<polygon points="${pts}" fill="none" stroke="var(--line-strong)" stroke-width="1.25"/>`;
  }
  return `<svg class="constellation" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">${out}</svg>`;
}

const priceLabel = (t) => `${t.from ? 'from ' : ''}${usd(t.price)}${t.per ? ` ${t.per}` : ''}`;

/* ---------- styles ---------- */

const css = `
@font-face{font-family:"Instrument Sans";src:url(data:font/woff2;base64,${sans}) format("woff2");font-weight:100 900}
@font-face{font-family:"IBM Plex Mono";src:url(data:font/woff2;base64,${mono4}) format("woff2");font-weight:400}
@font-face{font-family:"IBM Plex Mono";src:url(data:font/woff2;base64,${mono5}) format("woff2");font-weight:500}
${tokens}
@page{size:8.5in 11in;margin:0}
*{margin:0;padding:0;box-sizing:border-box}
html,body{background:var(--surface)}
body{font-family:var(--font-sans);color:var(--ink);-webkit-print-color-adjust:exact;print-color-adjust:exact;font-feature-settings:"tnum" 0}
a{color:inherit;text-decoration:none}
ul{list-style:none}
svg{display:block}
.wm svg{width:100%;height:auto}
.nq{fill:var(--vermilion);flex:none}
.nq.ink{fill:var(--ink)}
.mono{font-family:var(--font-mono)}
.muted{color:var(--ink-muted)}
.faint{color:var(--ink-faint)}

.page{width:816px;height:1056px;padding:40px 56px 30px;display:flex;flex-direction:column;position:relative;overflow:hidden;background:var(--surface);color:var(--ink);break-after:page;page-break-after:always}
.page:last-child{break-after:auto;page-break-after:auto}
.page>main{flex:1;min-height:0;display:flex;flex-direction:column;overflow:hidden}

.top{display:flex;align-items:center;justify-content:space-between;padding-bottom:14px;border-bottom:1px solid var(--line);margin-bottom:36px}
.top .wm{width:84px}
.foot{display:flex;justify-content:space-between;align-items:center;padding-top:12px;border-top:1px solid var(--line);margin-top:20px}
.foot .eyebrow{color:var(--ink-faint)}

h1.title .nq{display:inline-block;vertical-align:baseline;margin-left:.12em}
.lead{font-size:16px;line-height:25px;color:var(--ink-muted);max-width:58ch;margin-top:14px}

/* cover */
.cover{padding:48px 56px 44px;background:var(--surface)}
.cover .wm{width:120px}
.cover .head{display:flex;justify-content:space-between;align-items:center}
.cover .eyebrow{color:var(--ink-muted)}
.cover .hero{margin-top:auto}
.cover .display-xl{font-size:84px;max-width:13ch}
.cover .line{font-size:20px;line-height:30px;color:var(--ink-muted);max-width:30ch;margin-top:24px}
.cover .constellation{position:absolute;right:56px;top:170px}
.cover .chip{display:inline-flex;flex-direction:column;gap:4px;margin-top:40px;padding:16px 28px 16px 20px;background:var(--vermilion);color:var(--carbon);clip-path:polygon(0 0,calc(100% - 18px) 0,100% 18px,100% 100%,0 100%)}
.cover .chip .eyebrow{color:var(--carbon);opacity:.8}
.cover .chip b{font-size:34px;line-height:1;letter-spacing:-.03em;font-weight:600}
.cover .bottom{display:flex;justify-content:space-between;align-items:flex-end;margin-top:56px;padding-top:18px;border-top:1px solid var(--line)}
.cover .bottom p{font-size:15px;line-height:22px}

/* tiers */
.tiers{display:grid;grid-template-columns:repeat(3,1fr);gap:0;margin-top:24px;border-top:1px solid var(--ink)}
.tier{padding:22px 20px 22px;border-right:1px solid var(--line);display:flex;flex-direction:column}
.tier:last-child{border-right:0}
.tier.featured{background:var(--carbon);color:var(--ink-inverse);border-right:0;clip-path:polygon(0 0,calc(100% - 22px) 0,100% 22px,100% 100%,0 100%)}
.tier .tag{height:16px;display:flex;align-items:center;gap:6px;color:var(--ink-faint)}
.tier.featured .tag{color:#FF5A33}
.tier.featured .tag .nq{fill:#FF5A33}
.tier h3{font-size:20px;line-height:26px;font-weight:600;letter-spacing:-.01em;margin-top:10px}
.tier .for{font-size:13px;line-height:19px;color:var(--ink-muted);margin-top:4px;min-height:38px}
.tier.featured .for{color:#A7A193}
.tier .price{margin-top:18px;display:flex;flex-direction:column;gap:2px}
.tier .price .from{height:16px;color:var(--ink-faint)}
.tier.featured .price .from{color:#A7A193}
.tier .price b{font-size:42px;line-height:1;letter-spacing:-.04em;font-weight:600}
.tier .price span.per{font-size:13px;font-weight:500;letter-spacing:0;color:var(--ink-muted);margin-left:4px}
.tier.featured .price span.per{color:#A7A193}
.tier .price .per-line{font-size:12px;font-weight:500;color:var(--ink-muted);margin-top:6px}
.tier.featured .price .per-line{color:#A7A193}
.tier .weeks{margin-top:12px;padding-bottom:16px;border-bottom:1px solid var(--line);color:var(--ink-muted)}
.tier.featured .weeks{border-color:#2E2D28;color:#A7A193}
.tier ul{margin-top:16px;display:flex;flex-direction:column;gap:10px}
.tier li{display:flex;gap:10px;align-items:flex-start;font-size:13.5px;line-height:19px}
.tier li .nq{margin-top:5px}
.tier:not(.featured) li .nq{fill:var(--ink)}
.tier.featured li .nq{fill:#FF5A33}

/* market scale */
.market{margin-top:auto;padding-top:16px;border-top:1px solid var(--line)}
.market .row{display:flex;justify-content:space-between;align-items:baseline;gap:24px}
.market .claim{font-size:20px;line-height:27px;font-weight:600;letter-spacing:-.01em;max-width:34ch}
.market .claim em{font-style:normal;color:var(--nuqta)}
.scale{position:relative;height:92px;margin-top:12px}
.scale .axis{position:absolute;left:0;right:0;top:56px;height:1px;background:var(--line-strong)}
.scale .range{position:absolute;top:49px;height:15px;background:var(--surface-sunken);border:1px solid var(--line-strong)}
.scale .range-label{position:absolute;top:72px;font-size:11px;color:var(--ink-muted);white-space:nowrap}
.scale .pt{position:absolute;top:50px;transform:translateX(-6px)}
.scale .pt-label{position:absolute;bottom:52px;transform:translateX(-50%);text-align:center;white-space:nowrap}
.scale .pt-label b{display:block;font-size:13px;font-weight:600}
.scale .pt-label span{font-size:10px}
.scale .tick{position:absolute;top:52px;width:1px;height:9px;background:var(--line-strong)}
.scale .tick-label{position:absolute;top:72px;transform:translateX(-50%);font-size:10px;color:var(--ink-faint)}
.src{margin-top:6px;font-size:10px;color:var(--ink-faint)}

/* matrix */
table.matrix{width:100%;border-collapse:collapse;margin-top:26px;font-size:13px}
.matrix th{text-align:left;font-weight:600;font-size:15px;padding:10px 12px 12px;border-bottom:1px solid var(--ink)}
.matrix th:first-child{padding-left:0}
.matrix th small{display:block;font-family:var(--font-mono);font-weight:500;font-size:11px;color:var(--ink-muted);margin-top:2px}
.matrix td{padding:8px 12px;border-bottom:1px solid var(--line);vertical-align:middle;height:29px;padding-top:6px;padding-bottom:6px}
.matrix td:first-child{padding-left:0;color:var(--ink)}
.matrix td.v{width:21%;font-family:var(--font-mono);font-size:12px;font-weight:500}
.matrix .feat{background:var(--surface-sunken)}
.matrix .no{color:var(--line-strong)}
.matrix .yes .nq{fill:var(--ink)}

.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
.chips span{border:1px solid var(--line);padding:6px 10px;font-size:12px;border-radius:2px}

/* lists of rows */
.rows{margin-top:16px;border-top:1px solid var(--ink)}
.rows li{display:flex;justify-content:space-between;gap:24px;padding:10px 0;border-bottom:1px solid var(--line);font-size:14px;line-height:20px}
.rows.two{display:grid;grid-template-columns:1fr 1fr;column-gap:32px}
.rows li .p{font-family:var(--font-mono);font-weight:500;font-size:13px;white-space:nowrap}
.rows li small{display:block;color:var(--ink-faint);font-size:11px;margin-top:2px}

.sec{margin-top:30px}
.sec:first-child{margin-top:0}
.sec-h{display:flex;align-items:center;gap:10px}
.sec-h h2{font-size:22px;line-height:28px;font-weight:600;letter-spacing:-.01em}

.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:16px}
.steps li{border-top:1px solid var(--ink);padding-top:12px}
.steps .eyebrow{color:var(--ink-faint)}
.steps h3{font-size:14px;line-height:19px;font-weight:600;margin-top:8px}
.steps p{font-size:12px;line-height:17px;color:var(--ink-muted);margin-top:4px}

.care{display:grid;grid-template-columns:repeat(3,1fr);margin-top:16px;border-top:1px solid var(--ink)}
.care li{padding:14px 16px 0 0}
.care li+li{padding-left:16px;border-left:1px solid var(--line)}
.care b{font-size:24px;letter-spacing:-.03em}
.care .per{font-size:12px;color:var(--ink-muted)}
.care h3{font-size:14px;font-weight:600}
.care p{font-size:12px;line-height:17px;color:var(--ink-muted);margin-top:6px}

.terms{margin-top:14px;display:grid;grid-template-columns:1fr 1fr;gap:8px 28px}
.terms li{display:flex;gap:10px;font-size:12px;line-height:17px;color:var(--ink-muted)}
.terms li .nq{fill:var(--ink);margin-top:4px}

.why{display:grid;grid-template-columns:repeat(3,1fr);gap:10px 24px;margin-top:16px}
.why li{display:flex;gap:10px;align-items:flex-start;font-size:13px;line-height:18px}
.why li .nq{margin-top:4px}

.band{margin-top:auto;background:var(--carbon);color:var(--ink-inverse);padding:28px 32px;display:flex;justify-content:space-between;align-items:flex-end;gap:24px;clip-path:polygon(0 0,calc(100% - 28px) 0,100% 28px,100% 100%,0 100%)}
.band h2{font-size:28px;line-height:32px;font-weight:600;letter-spacing:-.02em}
.band h2 .nq{fill:#FF5A33;display:inline-block;margin-left:6px}
.band p{font-size:13px;line-height:20px;color:#A7A193;margin-top:10px}
.band .cta{display:flex;flex-direction:column;align-items:flex-end;gap:6px;text-align:right}
.band .btn{white-space:nowrap;background:#FF5A33;color:var(--carbon);font-weight:600;font-size:14px;padding:12px 20px;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)}
.band .mono{font-size:12px;color:#F2EEE4;white-space:nowrap}
.band>div:first-child{max-width:420px}

/* website price list */
.base{margin-top:24px;background:var(--carbon);color:var(--ink-inverse);display:grid;grid-template-columns:220px 1fr;gap:28px;padding:26px 28px;clip-path:polygon(0 0,calc(100% - 24px) 0,100% 24px,100% 100%,0 100%)}
.base .eyebrow{color:#FF5A33;display:flex;align-items:center;gap:6px}
.base .eyebrow .nq{fill:#FF5A33}
.base b{display:block;font-size:56px;line-height:1;letter-spacing:-.04em;font-weight:600;margin-top:14px}
.base .wk{margin-top:12px;color:#A7A193}
.base .for{font-size:13px;line-height:19px;color:#A7A193;margin-top:12px}
.base ul{display:grid;grid-template-columns:1fr 1fr;gap:9px 20px;align-content:start;padding-top:2px}
.base li{display:flex;gap:9px;font-size:13px;line-height:18px}
.base li .nq{fill:#FF5A33;margin-top:5px}
.groups{display:grid;grid-template-columns:1fr 1fr;column-gap:32px;row-gap:26px;margin-top:28px;align-items:start}
.groups .rows{margin-top:10px}
.groups .rows li{padding:7px 0;font-size:13px;line-height:18px}
.groups .rows li .p{font-size:12.5px}
.groups .sec-h h2{font-size:17px;line-height:22px}
.ex li.line{display:flex;justify-content:space-between;gap:12px;font-size:13px;line-height:18px;padding:7px 0;border-bottom:1px solid var(--line)}
.tier.featured.ex li.line{border-color:#2E2D28}
.ex li.line .p{font-family:var(--font-mono);font-size:12px;font-weight:500;white-space:nowrap}
.ex .total{display:flex;justify-content:space-between;align-items:baseline;margin-top:14px}
.ex .total b{font-size:32px;letter-spacing:-.035em;line-height:1}
.ex ul{gap:0!important;margin-top:14px!important}

/* overview table */
table.glance{width:100%;border-collapse:collapse;margin-top:26px}
.glance th{text-align:left;white-space:nowrap;padding:0 10px 10px 0;border-bottom:1px solid var(--ink)}
.glance th .eyebrow{color:var(--ink-faint)}
.glance td{padding:7px 10px 7px 0;border-bottom:1px solid var(--line);vertical-align:top;font-size:13px;line-height:18px}
.glance td.n{width:30px;font-family:var(--font-mono);font-size:11px;color:var(--ink-faint);padding-top:10px}
.glance td.s b{display:block;font-size:14.5px;font-weight:600}
.glance td.s span{color:var(--ink-muted);font-size:11.5px;line-height:16px;display:block}
.glance td.pr{font-family:var(--font-mono);font-weight:500;white-space:nowrap;font-size:13px}
.glance td.pr b{font-family:var(--font-sans);font-size:17px;letter-spacing:-.02em;font-weight:600}
.glance td.mk{font-size:11.5px;color:var(--ink-faint);white-space:nowrap}
`;

/* ---------- building blocks ---------- */

function top(label) {
  return `<div class="top"><div class="wm">${wordmark}</div><span class="eyebrow faint">${esc(label)}</span></div>`;
}
function foot(title, n, total) {
  return `<div class="foot"><span class="eyebrow">${DOMAIN} ◆ ${esc(EMAIL)}</span><span class="eyebrow">${esc(title)} ◆ ${pad(n)} / ${pad(total)}</span></div>`;
}
function page(inner, { title, n, total, label }) {
  return `<section class="page">${top(label)}<main>${inner}</main>${foot(title, n, total)}</section>`;
}

function cover({ eyebrow, title, line, seed, chipLabel, chip, index }) {
  return `<section class="page cover" data-theme="dark">
    <div class="head"><div class="wm">${wordmarkReverse}</div><span class="eyebrow">${esc(eyebrow)}</span></div>
    ${constellationSvg(seed, 216)}
    <div class="hero">
      ${index ? `<p class="eyebrow" style="color:#FF5A33">${esc(index)}</p>` : ''}
      <h1 class="display-xl title" style="margin-top:18px">${esc(title.split(' ').slice(0, -1).join(' '))} <span style="white-space:nowrap">${esc(title.split(' ').at(-1))}${nuqta(18)}</span></h1>
      <p class="line">${esc(line)}</p>
      ${chip ? `<div class="chip"><span class="eyebrow">${esc(chipLabel)}</span><b>${esc(chip)}</b></div>` : ''}
    </div>
    <div class="bottom">
      <p>${esc(data.promise)}<br><span class="muted">${data.year} launch rates · valid to ${esc(data.validUntil)}</span></p>
      <p class="mono" style="font-size:12px;text-align:right">${DOMAIN}<br><span class="muted">${esc(EMAIL)} · ${esc(PLACE)}</span></p>
    </div>
  </section>`;
}

function tierCards(tiers) {
  return `<div class="tiers">${tiers
    .map(
      (t) => `<div class="tier${t.featured ? ' featured' : ''}">
        <div class="tag eyebrow">${t.featured ? `${nuqta(8)}Most chosen` : ''}</div>
        <h3>${esc(t.name)}</h3>
        <p class="for">${esc(t.for)}</p>
        <div class="price"><span class="from eyebrow">${t.from ? 'Starting at' : ''}</span>
          <b>${usd(t.price)}${t.per && t.per.length <= 4 ? `<span class="per">${esc(t.per)}</span>` : ''}</b>${t.per && t.per.length > 4 ? `<span class="per-line mono">${esc(t.per)}</span>` : ''}</div>
        <p class="weeks eyebrow">${esc(t.weeks)}</p>
        <ul>${t.items.map((i) => `<li>${nuqta(7)}<span>${esc(i)}</span></li>`).join('')}</ul>
      </div>`,
    )
    .join('')}</div>`;
}

/** Where our prices sit against the published market range. */
function marketScale(s) {
  const m = s.market;
  if (!m) return '';
  const unit = m.unit ? `/${m.unit === 'hour' ? 'hr' : 'mo'}` : '';
  const exampleTotal = (e) => e.lines.reduce((a, [, v]) => a + v, 0);
  const points =
    m.points ??
    (s.examples
      ? s.examples.map((e) => ({ label: e.name, value: exampleTotal(e) }))
      : s.tiers.map((t) => ({ label: t.name, value: t.price, from: t.from })));
  const max = Math.max(m.high, ...points.map((p) => p.value)) * 1.1;
  const x = (v) => (v / max) * 100;
  const lo = Math.min(...points.map((p) => p.value));
  const hi = Math.max(...points.map((p) => p.value));
  const crowded = points.length > 1 && x(hi) - x(lo) < 15;

  // The claim: our most-chosen package (or the entry one) against the LOW end of the market.
  const ex = s.examples ? (s.examples.find((e) => e.featured) ?? s.examples[0]) : null;
  const feat = s.tiers.find((t) => t.featured) ?? s.tiers[0];
  const cands = m.points
    ? [{ name: m.points[0].label, price: m.points[0].value }]
    : ex
      ? [{ name: `Our “${ex.name}” build`, price: exampleTotal(ex) }]
      : [feat, s.tiers[0]];
  const best = cands.map((t) => ({ t, pct: Math.round((1 - t.price / m.low) * 100) })).find((c) => c.pct >= 20);
  const claim = best
    ? m.points
      ? `About ${usd(best.t.price)}${unit} for a senior engineer — <em>${best.pct}% below</em> the low end of US rates.`
      : `${esc(best.t.name)} is <em>${best.pct}% below</em> the low end of the typical range.`
    : esc(m.claim ?? 'Priced at the low end of the market — with senior engineers.');


  return `<div class="market">
    <div class="row"><p class="claim">${claim}</p><span class="eyebrow faint">How we compare</span></div>
    <div class="scale">
      <div class="axis"></div>
      <div class="tick" style="left:0"></div>
      <div class="range" style="left:${x(m.low)}%;width:${x(m.high) - x(m.low)}%"></div>
      <div class="range-label" style="${x(m.low) > 55 ? `right:${100 - x(m.high)}%` : `left:${x(m.low)}%`}">${esc(m.label)}: <b class="mono">${usd(m.low)}–${usd(m.high)}${unit}</b></div>
      ${crowded
        ? `${points.map((p) => `<div class="pt" style="left:${x(p.value)}%">${nuqta(12)}</div>`).join('')}
           <div class="pt-label" style="left:${x((lo + hi) / 2)}%"><b>${usd(lo)}–${usd(hi)}${unit}</b><span class="mono faint">TRACE ${s.examples ? 'example builds' : 'packages'}</span></div>`
        : points
        .map(
          (p, i) => `<div class="pt" style="left:${x(p.value)}%">${nuqta(12)}</div>
            <div class="pt-label" style="left:${x(p.value)}%;${i % 2 && points.length > 2 && x(points[1].value) - x(points[0].value) < 9 ? 'bottom:auto;top:76px' : ''}"><b>${p.from ? 'from ' : ''}${usd(p.value)}${unit}</b><span class="mono faint">${esc(p.label)}</span></div>`,
        )
        .join('')}
    </div>
    <p class="src">Market range from published 2026 industry pricing guides. TRACE prices are fixed per phase and confirmed in a written scope.</p>
  </div>`;
}

function matrix(s) {
  if (!s.matrix) return '';
  const fi = s.tiers.findIndex((t) => t.featured);
  const cell = (v, i) => {
    const cls = `v${i === fi ? ' feat' : ''}`;
    if (v === true) return `<td class="${cls} yes">${nuqta(8)}</td>`;
    if (v === false) return `<td class="${cls} no">—</td>`;
    return `<td class="${cls}">${esc(v)}</td>`;
  };
  return `<table class="matrix"><thead><tr><th></th>${s.tiers
    .map((t, i) => `<th class="${i === fi ? 'feat' : ''}">${esc(t.name)}<small>${priceLabel(t)}</small></th>`)
    .join('')}</tr></thead><tbody>${s.matrix
    .map(([label, ...vals]) => `<tr><td>${esc(label)}</td>${vals.map(cell).join('')}</tr>`)
    .join('')}</tbody></table>`;
}

const secHead = (title) => `<div class="sec-h">${nuqta(10)}<h2>${esc(title)}</h2></div>`;

function rows(list, two = false) {
  return `<ul class="rows${two ? ' two' : ''}">${list
    .map(([name, price, note]) => `<li><span>${esc(name)}${note ? `<small>${esc(note)}</small>` : ''}</span><span class="p">${esc(price)}</span></li>`)
    .join('')}</ul>`;
}

function steps() {
  return `<ol class="steps" style="list-style:none">${data.process
    .map((p, i) => `<li><span class="eyebrow">${pad(i + 1)}</span><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></li>`)
    .join('')}</ol>`;
}

function terms() {
  return `<ul class="terms">${data.terms.map((t) => `<li>${nuqta(6)}<span>${esc(t)}</span></li>`).join('')}</ul>`;
}

function band() {
  return `<div class="band">
    <div><h2>Book a free 30-minute call${nuqta(10)}</h2>
      <p>Tell us what you need. You get a written scope and a fixed price before any work starts.</p></div>
    <div class="cta"><a class="btn" href="${SITE}/contact">Book a free call</a>
      <a class="mono" href="${SITE}/contact">${DOMAIN}</a><a class="mono" href="mailto:${EMAIL}">${esc(EMAIL)}</a></div>
  </div>`;
}

function careStrip() {
  const care = data.services.find((s) => s.slug === 'care-plans');
  return `<ul class="care">${care.tiers
    .map((t) => `<li><h3>${esc(t.name)}</h3><b>${usd(t.price)}</b><span class="per"> ${esc(t.per)}</span><p>${esc(t.items.slice(t.items[0].startsWith('Everything') ? 1 : 0, 3).join(' · '))}</p></li>`)
    .join('')}</ul>`;
}

/* ---------- documents ---------- */

function serviceDoc(s, idx) {
  const n = idx + 1;
  const total = 4;
  const label = `${pad(n)} ◆ ${s.title} ◆ Pricing ${data.year}`;
  const meta = (p) => ({ title: s.title, n: p, total, label });
  const lowest = s.tiers.reduce((a, t) => (t.price < a.price && !t.per?.includes('mo') ? t : a), s.tiers[0]);

  const p1 = cover({
    eyebrow: `Pricing ◆ ${data.year}`,
    index: `${pad(n)} ◆ Price guide`,
    title: s.title,
    line: s.line,
    seed: s.title,
    chipLabel: 'Starting at',
    chip: `${usd(lowest.price)}${lowest.per ? ` ${lowest.per}` : ''}`,
  });

  const p2 = page(
    `<p class="eyebrow faint">${pad(n)} ◆ Packages</p>
     <h1 class="display-md title" style="margin-top:12px">Three ways to start${nuqta(12)}</h1>
     <p class="lead">${esc(s.intro)}</p>
     ${tierCards(s.tiers)}
     ${marketScale(s)}`,
    meta(2),
  );

  const extra = s.connects
    ? `<div class="sec">${secHead('What we connect most often')}<div class="chips">${s.connects.map((c) => `<span>${esc(c)}</span>`).join('')}</div></div>`
    : s.included
      ? `<div class="sec">${secHead('Every engagement includes')}<ul class="why">${s.included.map((w) => `<li>${nuqta(7)}<span>${esc(w)}</span></li>`).join('')}</ul></div>`
      : '';

  const p3 = page(
    `<p class="eyebrow faint">${pad(n)} ◆ ${s.matrix ? 'Compare by feature' : 'Engagement'}</p>
     <h1 class="display-md title" style="margin-top:12px">${s.matrix ? 'Every feature, side by side' : 'What you get'}${nuqta(12)}</h1>
     ${matrix(s)}
     ${extra ? `<div style="margin-top:30px">${extra}</div>` : ''}
     <div class="sec" style="margin-top:30px">${secHead('How it works')}${steps()}</div>
     ${s.matrix ? '' : `<div class="sec">${secHead('Add-ons')}${rows(s.addons)}</div>`}`,
    meta(3),
  );

  const p4 = page(
    `${s.monthly ? `<div class="sec">${secHead('Monthly')}${rows(s.monthly)}</div>` : ''}
     ${s.matrix ? `<div class="sec">${secHead('Add-ons')}${rows(s.addons, s.addons.length > 4 && s.addons.every(([n]) => n.length < 40))}</div>` : ''}
     ${s.monthly ? '' : s.slug === 'care-plans' ? `<div class="sec">${secHead('Why TRACE')}<ul class="why">${data.why.map((w) => `<li>${nuqta(7)}<span>${esc(w)}</span></li>`).join('')}</ul></div>` : `<div class="sec">${secHead('After launch: care plans')}${careStrip()}</div>`}
     <div class="sec">${secHead('Terms')}${terms()}</div>
     <div style="height:20px;flex:none"></div>
     ${band()}`,
    meta(4),
  );

  return [p1, p2, p3, p4].join('');
}

function websiteDoc(s, idx) {
  const n = idx + 1;
  const total = 5;
  const label = `${pad(n)} ◆ ${s.title} ◆ Pricing ${data.year}`;
  const meta = (p) => ({ title: s.title, n: p, total, label });
  const sum = (e) => e.lines.reduce((a, [, v]) => a + v, 0);
  const group = (g) => `<div>${secHead(g.title)}${rows(g.items.map(([name, price, note]) => [name, price, note]))}</div>`;
  const b = s.base;

  const p1 = cover({
    eyebrow: `Pricing ◆ ${data.year}`,
    index: `${pad(n)} ◆ Price list`,
    title: s.title,
    line: s.line,
    seed: s.title,
    chipLabel: 'Base site',
    chip: usd(b.price),
  });

  const p2 = page(
    `<p class="eyebrow faint">${pad(n)} ◆ Build your website</p>
     <h1 class="display-md title" style="margin-top:12px">Start with the base${nuqta(12)}</h1>
     <p class="lead">${esc(s.intro)}</p>
     <div class="base">
       <div><span class="eyebrow">${nuqta(8)}${esc(b.name)}</span><b>${usd(b.price)}</b><p class="wk eyebrow" style="color:#A7A193">${esc(b.weeks)}</p><p class="for">${esc(b.for)}</p></div>
       <ul>${b.items.map((i) => `<li>${nuqta(7)}<span>${esc(i)}</span></li>`).join('')}</ul>
     </div>
     <div class="groups">${[s.groups.filter((g) => g.col === 1), s.groups.filter((g) => g.col === 2)].map((c) => `<div style="display:flex;flex-direction:column;gap:26px">${c.map(group).join('')}</div>`).join('')}</div>`,
    meta(2),
  );

  const rest = s.groups.filter((g) => !g.col);
  const half = Math.ceil(rest.reduce((a, g) => a + g.items.length + 2, 0) / 2);
  const cols = [[], []];
  let acc = 0;
  for (const g of rest) { (acc < half ? cols[0] : cols[1]).push(g); acc += g.items.length + 2; }
  const p3 = page(
    `<p class="eyebrow faint">${pad(n)} ◆ Add what you need</p>
     <h1 class="display-md title" style="margin-top:12px">Every feature, one price${nuqta(12)}</h1>
     <div class="groups">${cols.map((c) => `<div style="display:flex;flex-direction:column;gap:26px">${c.map(group).join('')}</div>`).join('')}</div>`,
    meta(3),
  );

  const p4 = page(
    `<p class="eyebrow faint">${pad(n)} ◆ Example builds</p>
     <h1 class="display-md title" style="margin-top:12px">What businesses usually pick${nuqta(12)}</h1>
     <p class="lead">Three common builds, priced line by line. Yours is quoted the same way — base plus the features you choose.</p>
     <div class="tiers">${s.examples
       .map(
         (e) => `<div class="tier ex${e.featured ? ' featured' : ''}">
           <div class="tag eyebrow">${e.featured ? `${nuqta(8)}Most chosen` : ''}</div>
           <h3>${esc(e.name)}</h3><p class="for">${esc(e.for)}</p>
           <ul>${e.lines.map(([name, v]) => `<li class="line"><span>${esc(name)}</span><span class="p">${usd(v)}</span></li>`).join('')}</ul>
           <div class="total"><span class="eyebrow" style="color:inherit;opacity:.7">Total</span><b>${usd(sum(e))}</b></div>
         </div>`,
       )
       .join('')}</div>
     ${marketScale(s)}`,
    meta(4),
  );

  const p5 = page(
    `<div class="sec">${secHead('After launch: care plans')}${careStrip()}</div>
     <div class="sec">${secHead('How it works')}${steps()}</div>
     <div class="sec">${secHead('Terms')}${terms()}</div>
     <div style="height:20px;flex:none"></div>
     ${band()}`,
    meta(5),
  );

  return [p1, p2, p3, p4, p5].join('');
}

function overviewDoc() {
  const total = 4;
  const meta = (p) => ({ title: 'Prices & services', n: p, total, label: `Prices & services ◆ ${data.year}` });
  const minPrice = Math.min(...data.services.filter((s) => s.slug !== 'care-plans').flatMap((s) => (s.base ? [s.base.price] : s.tiers.filter((t) => !t.per).map((t) => t.price))));

  const p1 = cover({
    eyebrow: `Prices & services ◆ ${data.year}`,
    index: 'Price guide',
    title: 'Prices & services',
    line: 'Websites, apps and business systems for US companies — at launch rates, with a fixed price per phase.',
    seed: 'trace',
    chipLabel: 'Projects from',
    chip: usd(minPrice),
  });

  const glance = data.services
    .map((s, i) => {
      const first = s.base ? { price: s.base.price, weeks: s.base.weeks.replace('Live in ', '') } : s.tiers[0];
      const m = s.market;
      const mk = m ? `${usd(m.low)}–${usd(m.high)}${m.unit ? `/${m.unit === 'hour' ? 'hr' : 'mo'}` : ''}` : '—';
      return `<tr><td class="n">${pad(i + 1)}</td><td class="s"><b>${esc(s.title)}</b><span>${esc(s.line)}</span></td>
        <td class="pr"><b>${usd(first.price)}</b>${first.per ? ` ${esc(first.per)}` : ''}</td>
        <td class="mk mono">${esc(first.per === '/mo' ? 'Monthly' : first.weeks)}</td>
        <td class="mk">${mk}</td></tr>`;
    })
    .join('');

  const p2 = page(
    `<p class="eyebrow faint">Services at a glance</p>
     <h1 class="display-md title" style="margin-top:12px">Everything we build${nuqta(12)}</h1>
     <table class="glance"><thead><tr><th></th><th><span class="eyebrow">Service</span></th><th><span class="eyebrow">Starts at</span></th><th><span class="eyebrow">Timeline</span></th><th><span class="eyebrow">Typical market</span></th></tr></thead><tbody>${glance}</tbody></table>
     <p class="src" style="margin-top:10px">Each service has its own price guide with every package, feature and add-on. Market ranges from published 2026 industry pricing guides.</p>`,
    meta(2),
  );

  const bail = data.services.find((s) => s.slug === 'bail-bonds');
  const p3 = page(
    `<p class="eyebrow faint">Spotlight ◆ Bail bond agencies</p>
     <h1 class="display-md title" style="margin-top:12px">${esc(bail.title)}${nuqta(12)}</h1>
     <p class="lead">${esc(bail.intro)}</p>
     ${tierCards(bail.tiers)}
     <div class="sec">${secHead('Why TRACE')}<ul class="why">${data.why.map((w) => `<li>${nuqta(7)}<span>${esc(w)}</span></li>`).join('')}</ul></div>`,
    meta(3),
  );

  const p4 = page(
    `<div class="sec">${secHead('After launch: care plans')}${careStrip()}</div>
     <div class="sec">${secHead('How it works')}${steps()}</div>
     <div class="sec">${secHead('Terms')}${terms()}</div>
     <div style="height:20px;flex:none"></div>
     ${band()}`,
    meta(4),
  );

  return [p1, p2, p3, p4].join('');
}

/* ---------- render ---------- */

const html = (body) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>${css}</style></head><body>${body}</body></html>`;

const fileName = (s, i) => `TRACE-Pricing-${pad(i + 1)}-${s.title.replace(/&/g, 'and').replace(/[^A-Za-z0-9]+/g, '-').replace(/-+$/, '')}.pdf`;

await rm(OUT, { recursive: true, force: true });
await mkdir(`${OUT}/services`, { recursive: true });
if (png) { await rm(PREVIEW, { recursive: true, force: true }); await mkdir(PREVIEW, { recursive: true }); }

const browser = await chromium.launch();
const pg = await browser.newPage({ viewport: { width: 816, height: 1056 } });
const docs = [
  { name: 'TRACE-Pricing-Overview-2026.pdf', path: `${OUT}/TRACE-Pricing-Overview-2026.pdf`, body: overviewDoc() },
  ...data.services.map((s, i) => ({ name: fileName(s, i), path: `${OUT}/services/${fileName(s, i)}`, body: s.base ? websiteDoc(s, i) : serviceDoc(s, i) })),
];

let problems = 0;
for (const d of docs) {
  await pg.setContent(html(d.body), { waitUntil: 'load' });
  await pg.evaluate(() => document.fonts.ready);
  const overflow = await pg.evaluate(() =>
    [...document.querySelectorAll('.page>main')].map((m, i) => (m.scrollHeight > m.clientHeight + 1 ? i + 2 : 0)).filter(Boolean),
  );
  if (overflow.length) { problems++; console.warn(`! ${d.name}: content overflows on page ${overflow.join(', ')}`); }
  await pg.pdf({ path: d.path, width: '8.5in', height: '11in', printBackground: true, preferCSSPageSize: true });
  if (png) {
    const pages = await pg.$$('.page');
    for (let i = 0; i < pages.length; i++) await pages[i].screenshot({ path: `${PREVIEW}/${d.name.replace('.pdf', '')}-p${i + 1}.png` });
  }
  console.log(`✓ ${d.path}`);
}
await browser.close();
if (problems) process.exitCode = 1;
