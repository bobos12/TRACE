/**
 * Showcase slides for the real projects: the live captures in browser and
 * phone frames on TRACE grounds, in the spirit of the WhatsApp CRM renders.
 *
 *   node scripts/capture-sites.mjs      (first — real screenshots)
 *   node scripts/make-showcases.mjs     every project
 *   node scripts/make-showcases.mjs retal
 *
 * Writes public/images/portfolio/<slug>-cover.jpg and <slug>-shot-2.jpg …
 * (the gallery), 2400×1500. If you change what a slide shows, bump the names
 * (or clear .next/cache/images) — the image optimiser and browsers cache by URL. Every screen inside a frame is a genuine capture
 * of the published site; LamaBooking, whose client app is not published, is
 * shown through its real API source instead.
 */
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const CAP = 'assets/captures';
const OUT = 'public/images/portfolio';

const C = {
  carbon: '#0F0F0D', graphite: '#1A1A17', paper: '#F4F1E9', sand: '#E9E4D8',
  ink: '#14130F', light: '#F2EEE4', muted: '#A7A193', mutedInk: '#6E695E',
  line: '#2E2D28', lineLight: '#D3CCBB', vermilion: '#FF5A33', vermilionInk: '#E0461F',
};

const b64 = async (f) => (await readFile(f)).toString('base64');
const fonts = {
  latin: await b64('public/fonts/InstrumentSans-Variable.woff2'),
  mono: await b64('public/fonts/IBMPlexMono-500.woff2'),
};
const uri = async (f) => `data:image/${f.endsWith('.png') ? 'png' : 'jpeg'};base64,${await b64(f)}`;
const cap = (slug, name) => uri(path.join(CAP, slug, `${name}.jpg`));
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ── frames ───────────────────────────────────────────────────── */

const browser = (src, { x, y, w, url = '', dark = true, z = 1 }) => `
  <div class="br${dark ? ' d' : ''}" style="left:${x}px;top:${y}px;width:${w}px;z-index:${z}">
    <div class="bar"><i></i><i></i><i></i><span>${url}</span></div>
    <img src="${src}">
  </div>`;

const phone = (src, { x, y, w, z = 2 }) => `
  <div class="ph" style="left:${x}px;top:${y}px;width:${w}px;z-index:${z}"><div class="scr"><img src="${src}"></div></div>`;

/** A client's own logo: the neutral pixels painted in the ground's ink, the brand colours on top. */
const logo = async (client, { x, y, h, tone }) => {
  if (!client) return '';
  const ink = await uri(`public${client.ink}`);
  const color = client.color ? await uri(`public${client.color}`) : '';
  const w = Math.round((h * client.width) / client.height);
  return `<div class="logo" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">
    <span style="background:${tone};-webkit-mask:url(${ink}) center/contain no-repeat;mask:url(${ink}) center/contain no-repeat"></span>
    ${color ? `<img src="${color}">` : ''}
  </div>`;
};

const head = ({ eyebrow, title, x = 110, y = 80, w = 900, align = 'left', dark = true, lead = '' }) => `
  <div class="head" style="left:${x}px;top:${y}px;width:${w}px;text-align:${align};color:${dark ? C.light : C.ink}">
    <div class="eb" style="color:${dark ? C.muted : C.mutedInk}">${eyebrow}</div>
    <h2>${title}<i></i></h2>
    ${lead ? `<p class="lead">${lead}</p>` : ''}
  </div>`;

/* ── slide templates (1600×1000) ──────────────────────────────── */

const T = {
  async cover(p) {
    // A wordmark reads at 44px; a square badge needs more height for the same presence.
    const h = p.client && p.client.width / p.client.height < 1.6 ? 72 : 44;
    return `${await logo(p.client, { x: 110, y: 60, h, tone: C.light })}
      ${p.client ? '' : `<div class="name" style="left:110px;top:66px">${p.name}</div>`}
      ${browser(await cap(p.slug, p.cover?.[0] ?? 'desktop-0'), { x: 110, y: 170, w: 1120, url: p.url })}
      ${p.mobile !== false ? phone(await cap(p.slug, p.cover?.[1] ?? 'mobile-0'), { x: 1170, y: 290, w: 300 }) : ''}`;
  },
  async screens(p, s) {
    return `${head({ eyebrow: s.eyebrow, title: s.title, x: 110, y: 70 })}
      ${browser(await cap(p.slug, s.desktop), { x: 110, y: 270, w: 1000, url: p.url })}
      ${phone(await cap(p.slug, s.mobiles[0]), { x: 1060, y: 330, w: 250 })}
      ${phone(await cap(p.slug, s.mobiles[1]), { x: 1290, y: 400, w: 220, z: 3 })}`;
  },
  async mobiles(p, s) {
    const [a, b, c] = await Promise.all(s.mobiles.map((m) => cap(p.slug, m)));
    return `${head({ eyebrow: s.eyebrow, title: s.title, x: 110, y: 300, w: 470, lead: s.text })}
      ${phone(a, { x: 640, y: 150, w: 270 })}
      ${phone(b, { x: 940, y: 210, w: 270 })}
      ${phone(c, { x: 1240, y: 270, w: 270 })}`;
  },
  async sections(p, s) {
    return `${head({ eyebrow: s.eyebrow, title: s.title, x: 110, y: 70, w: 1100, dark: false })}
      ${browser(await cap(p.slug, s.desktops[0]), { x: 110, y: 250, w: 900, url: p.url, dark: false })}
      ${browser(await cap(p.slug, s.desktops[1]), { x: 640, y: 400, w: 860, url: p.url, dark: false, z: 2 })}`;
  },
};

/* ── LamaBooking: the API, as it is ───────────────────────────── */

const KEYWORDS = /\b(import|from|const|export|default|new|return|async|await|try|catch|if|throw|function|type|required|true|false)\b/g;
function highlight(code) {
  return code
    .split('\n')
    .map((line, i) => {
      let html = esc(line)
        .replace(/(\/\/.*)$/, '<em>$1</em>')
        .replace(/(&quot;|"|'|`)(.*?)\1/g, '<s>$1$2$1</s>')
        .replace(KEYWORDS, '<b>$1</b>')
        .replace(/\b(String|Number|Boolean|Date|mongoose|Room|Hotel)\b/g, '<u>$1</u>');
      return `<div><span class="ln">${i + 1}</span>${html || ' '}</div>`;
    })
    .join('');
}

const editor = (file, code, { x, y, w, h, z = 1 }) => `
  <div class="ed" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;z-index:${z}">
    <div class="bar"><i></i><i></i><i></i><span>${file}</span></div>
    <pre>${highlight(code)}</pre>
  </div>`;

async function routesTable(group) {
  const lines = (await readFile(path.join(CAP, 'lamabooking/routes.txt'), 'utf8')).trim().split('\n');
  return lines
    .filter((l) => !group || group.includes(l.split(' ')[0]))
    .map((l) => {
      const [base] = l.split(' ');
      const m = l.match(/router\.(get|post|put|delete)\("([^"]*)"\s*,\s*(.*)\)/);
      if (!m) return '';
      const [, method, route, rest] = m;
      const guard = (rest.match(/verify\w+/) ?? [''])[0];
      return `<div class="rt"><span class="m m-${method}">${method.toUpperCase()}</span><code>/api/${base}${route === '/' ? '' : route}</code>${guard ? `<span class="g">${guard}</span>` : '<span class="g open">public</span>'}</div>`;
    })
    .join('');
}

const lama = {
  async cover() {
    const hotel = await readFile(path.join(CAP, 'lamabooking/Hotel.js'), 'utf8');
    return `<div class="name" style="left:110px;top:66px">LamaBooking</div>
      <div class="eb" style="position:absolute;left:330px;top:80px;color:${C.muted}">In-house product ◆ MERN booking system</div>
      ${editor('api/models/Hotel.js', hotel.split('\n').slice(4, 44).join('\n'), { x: 110, y: 160, w: 760, h: 760 })}
      <div class="panel" style="left:800px;top:250px;width:690px;z-index:2">
        <div class="bar"><i></i><i></i><i></i><span>REST API · Express</span></div>
        <div class="rts">${await routesTable(['hotels', 'bookings'])}</div>
      </div>`;
  },
  async routes() {
    return `${head({ eyebrow: 'In-house product ◆ REST API', title: 'Every endpoint, guarded', x: 110, y: 70 })}
      <div class="panel" style="left:110px;top:250px;width:690px"><div class="bar"><i></i><i></i><i></i><span>/api/auth · /api/hotels</span></div>
        <div class="rts">${await routesTable(['auth', 'hotels'])}</div></div>
      <div class="panel" style="left:830px;top:250px;width:660px"><div class="bar"><i></i><i></i><i></i><span>/api/rooms · /api/bookings</span></div>
        <div class="rts">${await routesTable(['rooms', 'bookings'])}</div></div>`;
  },
  async availability() {
    const code = await readFile(path.join(CAP, 'lamabooking/availability.js'), 'utf8');
    const guard = await readFile(path.join(CAP, 'lamabooking/verifyAdmin.js'), 'utf8');
    return `${head({ eyebrow: 'In-house product ◆ Booking logic', title: 'Availability that cannot double-book', x: 110, y: 70, w: 1300 })}
      ${editor('api/controllers/rooms.js', code.split('\n').slice(0, 21).join('\n'), { x: 110, y: 250, w: 820, h: 640 })}
      ${editor('api/utils/verifytoken.js', guard.trim(), { x: 820, y: 500, w: 700, h: 330, z: 2 })}`;
  },
  async architecture() {
    const box = (x, y, w, title, items, mark = false) => `<div class="arch${mark ? ' mk' : ''}" style="left:${x}px;top:${y}px;width:${w}px">
      <div class="eb">${title}</div>${items.map((i) => `<div class="it">${i}</div>`).join('')}</div>`;
    return `${head({ eyebrow: 'In-house product ◆ Architecture', title: 'Two sides, one source of truth', x: 110, y: 70, w: 1300, dark: false })}
      ${box(110, 330, 380, 'Client · React', ['Hotel search', 'Live availability', 'My bookings', 'Admin panel'])}
      ${box(610, 290, 380, 'API · Node + Express', ['/api/auth — JWT cookie', '/api/hotels', '/api/rooms', '/api/bookings', 'verifyToken · verifyAdmin'], true)}
      ${box(1110, 330, 380, 'Data · MongoDB', ['Hotel', 'Room → RoomNumber', 'unavailableDates[]', 'Booking · User'])}
      <div class="link" style="left:490px;top:470px;width:120px"></div>
      <div class="link" style="left:990px;top:470px;width:120px"></div>
      <div class="eb" style="position:absolute;left:110px;top:860px;color:${C.mutedInk}">React · Node.js · Express · MongoDB · JWT · REST</div>`;
  },
};

/* ── the projects ─────────────────────────────────────────────── */

const trust = JSON.parse(await readFile('content/trust.json', 'utf8'));
const client = (slug) => trust.clients?.find((c) => c.slug === slug);

const PROJECTS = [
  {
    slug: 'future-earth-energy', client: client('future-earth-energy'), url: 'fe-ksa.com/en',
    slides: [
      { t: 'screens', ground: 'carbon', eyebrow: 'Corporate website ◆ Renewable energy', title: 'Credible to industrial buyers', desktop: 'desktop-1', mobiles: ['mobile-1', 'mobile-2'] },
      { t: 'mobiles', ground: 'graphite', eyebrow: 'Responsive', title: 'Built to be read on site', text: 'Services, megawatt-scale projects and certifications, laid out for a buyer checking from the field.', mobiles: ['mobile-0', 'mobile-2', 'mobile-3'] },
      { t: 'sections', ground: 'sand', eyebrow: 'Proof first', title: 'The evidence, where buyers look first', desktops: ['desktop-2', 'desktop-3'] },
    ],
  },
  {
    slug: 'fateen-website', client: client('fateen'), url: 'fateenksa.com',
    slides: [
      { t: 'mobiles', ground: 'graphite', eyebrow: 'Company website ◆ Marketing', title: 'The agency’s home, in every pocket', text: 'Services, credentials and contact, one thumb away — the site prospects judge the agency by.', mobiles: ['mobile-0', 'mobile-1', 'mobile-3'] },
    ],
  },
  {
    slug: 'fateen-real-estate', client: client('fateen'), url: 'fateenksa.com/RealState',
    slides: [
      { t: 'screens', ground: 'carbon', eyebrow: 'Landing page ◆ Real estate line', title: 'Proof for property developers', desktop: 'desktop-1', mobiles: ['mobile-1', 'mobile-2'] },
      { t: 'mobiles', ground: 'graphite', eyebrow: 'Responsive', title: 'Campaign results, readable anywhere', text: 'Real campaign figures, partner logos and design samples, shown rather than claimed.', mobiles: ['mobile-0', 'mobile-2', 'mobile-3'] },
      { t: 'sections', ground: 'sand', eyebrow: 'Show, don’t tell', title: 'The work, shown section by section', desktops: ['desktop-2', 'desktop-3'] },
    ],
  },
  {
    slug: 'fateen-ads', client: client('fateen'), url: 'fateenksa.com/ads',
    slides: [
      { t: 'screens', ground: 'carbon', eyebrow: 'Landing page ◆ Paid traffic', title: 'Built for the paid click', desktop: 'desktop-1', mobiles: ['mobile-1', 'mobile-2'] },
      { t: 'mobiles', ground: 'graphite', eyebrow: 'Mobile first', title: 'One job, above the fold', text: 'A clear offer, credentials straight after, and contact buttons that never leave the screen.', mobiles: ['mobile-0', 'mobile-1', 'mobile-3'] },
      { t: 'sections', ground: 'sand', eyebrow: 'Conversion design', title: 'Every objection answered on the page', desktops: ['desktop-2', 'desktop-3'] },
    ],
  },
  {
    slug: 'fateen-web-development', client: client('fateen'), url: 'fateenksa.com/web-development',
    slides: [
      { t: 'screens', ground: 'carbon', eyebrow: 'Landing page ◆ Web development line', title: 'One service line, sold clearly', desktop: 'desktop-1', mobiles: ['mobile-1', 'mobile-2'] },
      { t: 'mobiles', ground: 'graphite', eyebrow: 'Responsive', title: 'Trust where the doubt appears', text: 'Services broken down, proof placed beside each claim, and the next step always in reach.', mobiles: ['mobile-0', 'mobile-2', 'mobile-3'] },
      { t: 'sections', ground: 'sand', eyebrow: 'Lead capture', title: 'Calls to action all the way down', desktops: ['desktop-2', 'desktop-3'] },
    ],
  },
  {
    slug: 'fancystays', client: client('fancystays'), url: 'fancystays.net',
    slides: [
      { t: 'screens', ground: 'carbon', eyebrow: 'Booking website ◆ Dubai holiday homes', title: 'Book the view', desktop: 'desktop-1', mobiles: ['mobile-1', 'mobile-2'] },
      { t: 'mobiles', ground: 'graphite', eyebrow: 'Mobile booking', title: 'Search by date and party size', text: 'Arrival, departure, adults and children — then every home with its amenities and gallery.', mobiles: ['mobile-0', 'mobile-1', 'mobile-2'] },
      { t: 'sections', ground: 'sand', eyebrow: 'Direct bookings', title: 'Every home, its own page', desktops: ['desktop-2', 'desktop-3'] },
    ],
  },
  {
    slug: 'retal-residence', client: client('retal-residence'), url: 'retal-residence-landing.vercel.app',
    slides: [
      { t: 'screens', ground: 'carbon', eyebrow: 'Landing page ◆ Ultra-premium compound', title: 'Designer living, on one page', desktop: 'desktop-1', mobiles: ['mobile-1', 'mobile-2'] },
      { t: 'mobiles', ground: 'graphite', eyebrow: 'Responsive', title: 'Seven residences, in your hand', text: 'Apartments, town villas and executive villas, each with its plan — and a visit one tap away.', mobiles: ['mobile-0', 'mobile-1', 'mobile-2'] },
      { t: 'sections', ground: 'sand', eyebrow: 'Schedule a visit', title: 'The standard, carried in two languages', desktops: ['desktop-2', 'desktop-3'] },
    ],
  },
  {
    slug: 'elite-gpt', name: 'ELITE GPT', url: 'elitegpt.vercel.app',
    slides: [
      { t: 'screens', ground: 'carbon', eyebrow: 'In-house product ◆ Legal AI', title: 'Legal answers, around the clock', desktop: 'desktop-1', mobiles: ['mobile-1', 'mobile-2'] },
      { t: 'mobiles', ground: 'graphite', eyebrow: 'Mobile', title: 'A legal assistant in your pocket', text: 'Questions about rights and common legal issues, answered in plain language — and basic documents drafted.', mobiles: ['mobile-0', 'mobile-2', 'mobile-3'] },
      { t: 'sections', ground: 'sand', eyebrow: 'Product', title: 'Plans, questions and answers', desktops: ['desktop-2', 'desktop-3'] },
    ],
  },
  {
    slug: 'ironwood-bail-bonds', name: 'Ironwood Bail Bonds', url: 'ironwoodbailbonds.com',
    cover: ['desktop-0', 'mobile-0'],
    slides: [
      { t: 'screens', ground: 'carbon', eyebrow: 'Concept ◆ Bail bond agency website', title: 'Built for the 2 a.m. search', desktop: 'desktop-1', mobiles: ['mobile-1', 'mobile-2'] },
      { t: 'mobiles', ground: 'graphite', eyebrow: 'Mobile first', title: 'One tap to call, from any screen', text: 'Jails served, payment plans and real reviews — with the call button never leaving the thumb.', mobiles: ['mobile-0', 'mobile-1', 'mobile-3'] },
      { t: 'sections', ground: 'sand', eyebrow: 'Trust, then terms', title: 'Every cost explained before they call', desktops: ['desktop-2', 'desktop-4'] },
    ],
  },
  { slug: 'lamabooking', lama: true },
];

/* ── page ─────────────────────────────────────────────────────── */

const lattice = (color) =>
  `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'><path d='M24 21l3 3-3 3-3-3z' fill='${color}'/></svg>`)}")`;

const GROUND = {
  carbon: { bg: C.carbon, dot: '#22211D', dark: true },
  graphite: { bg: C.graphite, dot: '#2A2924', dark: true },
  sand: { bg: C.sand, dot: '#D9D2C1', dark: false },
  paper: { bg: C.paper, dot: '#E3DDCF', dark: false },
};

const page = (ground, body) => {
  const g = GROUND[ground];
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face{font-family:I;src:url(data:font/woff2;base64,${fonts.latin}) format('woff2');font-weight:100 900}
  @font-face{font-family:M;src:url(data:font/woff2;base64,${fonts.mono}) format('woff2');font-weight:500}
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1600px;height:1000px;overflow:hidden;position:relative;font-family:I,sans-serif;
       background:${g.bg} ${lattice(g.dot)};color:${g.dark ? C.light : C.ink}}
  .br,.ph,.ed,.panel,.arch,.head,.logo,.name,.link{position:absolute}
  .br{border-radius:12px;overflow:hidden;background:#fff;box-shadow:0 50px 100px -30px rgba(0,0,0,.6),0 0 0 1px rgba(0,0,0,.12)}
  .br img{display:block;width:100%}
  .bar{height:36px;display:flex;align-items:center;gap:8px;padding:0 16px;background:#E9E4D8}
  .bar i{width:11px;height:11px;border-radius:50%;background:#C3BBA9}
  .bar span{margin-left:14px;flex:1;max-width:420px;height:22px;border-radius:6px;background:rgba(0,0,0,.06);
            font:500 12px M,monospace;color:#6E695E;display:flex;align-items:center;padding:0 12px}
  .d .bar,.ed .bar,.panel .bar{background:#1E1D1A}.d .bar i,.ed .bar i,.panel .bar i{background:#3A3833}
  .d .bar span,.ed .bar span,.panel .bar span{background:rgba(255,255,255,.06);color:#8E887A}
  .ph{border-radius:46px;padding:9px;background:#0A0A09;box-shadow:0 50px 90px -30px rgba(0,0,0,.7),0 0 0 1px #2E2D28}
  .ph .scr{border-radius:38px;overflow:hidden;background:#000}.ph img{display:block;width:100%}
  .logo span,.logo img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}
  .name{font-size:34px;font-weight:600;letter-spacing:-.03em}
  .head h2{font-size:60px;line-height:1.02;font-weight:600;letter-spacing:-.04em;margin-top:18px}
  .head h2 i{display:inline-block;width:14px;height:14px;margin-left:6px;background:${C.vermilion};transform:rotate(45deg) scale(.7071)}
  .eb{font:500 14px M,monospace;letter-spacing:.16em;text-transform:uppercase}
  .lead{position:static;margin-top:34px;max-width:430px;font-size:22px;line-height:1.5;color:${g.dark ? C.muted : C.mutedInk}}
  .ed,.panel{border-radius:12px;overflow:hidden;background:#141412;box-shadow:0 50px 100px -30px rgba(0,0,0,.6),0 0 0 1px #2E2D28}
  pre{padding:18px 0;font:500 15px/1.62 M,monospace;color:#D9D3C4;white-space:pre}
  pre .ln{display:inline-block;width:52px;padding-right:18px;text-align:right;color:#4A4740}
  pre b{color:${C.vermilion};font-weight:500}pre s{color:#C9B98F;text-decoration:none}pre em{color:#6E695E;font-style:normal}pre u{color:#8FB3A8;text-decoration:none}
  .rts{padding:10px 0}
  .rt{display:flex;align-items:center;gap:14px;padding:10px 22px;border-top:1px solid #23221E;font:500 15px M,monospace;color:#D9D3C4}
  .rt:first-child{border-top:0}.rt code{flex:1}
  .m{width:68px;text-align:center;padding:3px 0;border-radius:4px;font-size:12px;letter-spacing:.06em}
  .m-get{background:#1F3A33;color:#8FD3BE}.m-post{background:#3A2A1A;color:#F0B27A}.m-put{background:#2A2E40;color:#A9B6F0}.m-delete{background:#40201C;color:#FF8A70}
  .g{font-size:12px;color:#8E887A;border:1px solid #33312B;border-radius:4px;padding:2px 8px}.g.open{color:#5E5A51}
  .arch{background:${C.paper};border:1px solid ${C.lineLight};padding:26px 26px 18px;box-shadow:0 30px 60px -30px rgba(0,0,0,.25)}
  .arch.mk{border-color:${C.ink}}.arch .eb{color:${C.mutedInk};margin-bottom:16px}
  .arch .it{font-size:20px;padding:11px 0;border-top:1px solid #E3DDCF;color:${C.ink}}
  .arch.mk .eb{color:${C.vermilionInk}}
  .link{height:1px;background:${C.ink}}
  .link::after{content:'';position:absolute;right:-6px;top:-6px;width:12px;height:12px;background:${C.vermilionInk};transform:rotate(45deg) scale(.7071)}
</style></head><body>${body}</body></html>`;
};

/* ── render ───────────────────────────────────────────────────── */

const only = process.argv[2];
const run = await chromium.launch();
const tab = await run.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1.5 });

async function render(html, file) {
  await tab.setContent(html, { waitUntil: 'load' });
  await tab.evaluate(() => document.fonts.ready);
  await tab.waitForTimeout(150);
  const png = await tab.screenshot();
  await sharp(png).resize(2400, 1500).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(OUT, file));
  console.log(`  ${file}`);
}

for (const p of PROJECTS) {
  if (only && !p.slug.includes(only)) continue;
  console.log(p.slug);
  if (p.lama) {
    await render(page('carbon', await lama.cover()), `${p.slug}-cover.jpg`);
    await render(page('graphite', await lama.routes()), `${p.slug}-shot-2.jpg`);
    await render(page('carbon', await lama.availability()), `${p.slug}-shot-3.jpg`);
    await render(page('sand', await lama.architecture()), `${p.slug}-shot-4.jpg`);
    continue;
  }
  if (!existsSync(path.join(CAP, p.slug, 'desktop-0.jpg'))) {
    console.log('  no captures — run scripts/capture-sites.mjs first');
    continue;
  }
  const hasMobile = existsSync(path.join(CAP, p.slug, 'mobile-0.jpg'));
  await render(page('carbon', await T.cover({ ...p, mobile: hasMobile })), `${p.slug}-cover.jpg`);
  let n = 2;
  for (const s of p.slides) {
    if (!hasMobile && (s.t === 'mobiles' || s.t === 'screens')) continue;
    await render(page(s.ground, await T[s.t](p, s)), `${p.slug}-shot-${n++}.jpg`);
  }
}

await run.close();
