/**
 * The social media kit in social/ — profile pictures, covers, launch posts,
 * stories, highlight covers and logo files, all from the brand's own fonts,
 * colours and logo outlines.
 *
 *   node scripts/make-social.mjs
 *   SOCIAL_OUT="$HOME/Desktop/TRACE Social Kit" node scripts/make-social.mjs
 *
 * Copy for the posts comes from content/ (services, process, commitments,
 * featured work), so the kit stays in step with the site. Re-run after
 * changing either.
 */
import { chromium } from '@playwright/test';
import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';

/** Where the kit goes: `SOCIAL_OUT=<folder>` to put it elsewhere (e.g. the Desktop). */
const OUT = process.env.SOCIAL_OUT || 'social';
const read = (f) => readFile(f, 'utf8');
const b64 = async (f) => (await readFile(f)).toString('base64');
const img = async (f) => `data:image/${f.endsWith('.png') ? 'png' : 'jpeg'};base64,${await b64(f)}`;

const site = JSON.parse(await read('content/site.en.json'));
const services = JSON.parse(await read('content/services.json'));
const portfolio = JSON.parse(await read('content/portfolio.json'));
const contact = JSON.parse(await read('content/contact.json'));
const bail = JSON.parse(await read('content/bail-bonds.json'));

const DOMAIN = (process.env.NEXT_PUBLIC_SITE_URL || 'trace.studio').replace(/^https?:\/\//, '');

const latin = await b64('public/fonts/InstrumentSans-Variable.woff2');
const mono = await b64('public/fonts/IBMPlexMono-500.woff2');
const wordmark = await read('public/brand/trace-wordmark-reverse.svg');
const wordmarkInk = await read('public/brand/trace-wordmark.svg');

/* Colours, from design/tokens. */
const C = {
  carbon: '#0F0F0D',
  graphite: '#1A1A17',
  paper: '#F4F1E9',
  chalk: '#FBFAF6',
  ink: '#14130F',
  muted: '#A7A193',
  mutedInk: '#5C584E',
  line: '#2E2D28',
  lineLight: '#D6CFBE',
  vermilion: '#FF5A33',
  vermilionInk: '#E0461F',
};

const base = `
  @font-face{font-family:I;src:url(data:font/woff2;base64,${latin}) format('woff2');font-weight:100 900}
  @font-face{font-family:M;src:url(data:font/woff2;base64,${mono}) format('woff2');font-weight:500}
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{overflow:hidden}
  body{font-family:I,sans-serif;position:relative;-webkit-font-smoothing:antialiased;font-feature-settings:"ss01"}
  .eb{font-family:M,monospace;letter-spacing:.16em;text-transform:uppercase}
  .n{position:absolute;width:var(--s);height:var(--s);transform:rotate(45deg) scale(.7071);background:var(--c)}
  .stop{display:inline-block;width:.19em;height:.19em;background:${C.vermilion};transform:rotate(45deg);margin-left:.07em;vertical-align:.02em}
  .wm svg,.wm{display:block;width:100%;height:auto}
  .cut{clip-path:polygon(0 0,calc(100% - var(--cut)) 0,100% var(--cut),100% 100%,0 100%)}
  .shot{position:absolute;border-radius:10px;overflow:hidden;box-shadow:0 30px 80px -20px rgba(0,0,0,.8);border:1px solid ${C.line}}
  .shot img{display:block;width:100%;height:auto}
`;

/**
 * The three-nuqta symbol centred on (x, y); `s` is one nuqta's diagonal.
 * Offsets from public/brand/social-avatar.svg: the side nuqtas sit 0.627 × s
 * away on both axes, the top one half that above centre.
 */
const symbol = (x, y, s, top = C.vermilion, rest = C.paper) => {
  const d = s * 0.627;
  const at = (cx, cy, c) => `<div class="n" style="--s:${s}px;--c:${c};left:${cx - s / 2}px;top:${cy - s / 2}px"></div>`;
  return at(x, y - d / 2, top) + at(x - d, y + d / 2, rest) + at(x + d, y + d / 2, rest);
};

/** A constellation of small nuqtas joined by hairlines. */
const constellation = (pts, color = C.line, dot = C.muted, mark = C.vermilion) => {
  const lines = pts
    .slice(1)
    .map((p, i) => `<line x1="${pts[i][0]}" y1="${pts[i][1]}" x2="${p[0]}" y2="${p[1]}" stroke="${color}" stroke-width="1.5"/>`)
    .join('');
  const dots = pts
    .map((p, i) => {
      const s = i === pts.length - 1 ? 9 : 5;
      return `<path d="M${p[0]} ${p[1] - s}L${p[0] + s} ${p[1]}L${p[0]} ${p[1] + s}L${p[0] - s} ${p[1]}Z" fill="${i === pts.length - 1 ? mark : dot}"/>`;
    })
    .join('');
  return `<svg style="position:absolute;inset:0;width:100%;height:100%" xmlns="http://www.w3.org/2000/svg">${lines}${dots}</svg>`;
};

const shots = {
  dashboard: await img('public/images/ui/dashboard-dark.png'),
  website: await img('public/images/ui/website-home-en-dark.png'),
  mobile: await img('public/images/ui/mobile-home-en-dark.png'),
};

const featured = (portfolio.projects ?? portfolio).filter((p) => p.featured);
const work = await Promise.all(
  featured.map(async (p) => ({ ...p, src: await img(`public${p.cover}`) })),
);

const promises = site.trust.promises;
const steps = site.process.steps;
const svc = services.map((s) => s.en);

/* ── frames ─────────────────────────────────────────────────── */

const carbon = (w, h, inner) => `<style>${base}body{width:${w}px;height:${h}px;background:${C.carbon};color:${C.paper}}</style>${inner}`;
const paper = (w, h, inner) => `<style>${base}body{width:${w}px;height:${h}px;background:${C.paper};color:${C.ink}}</style>${inner}`;

/** Footer used on every post: wordmark, page counter, domain. */
const foot = (w, h, { dark = true, page = '', pad = 80 } = {}) => `
  <div class="wm" style="position:absolute;left:${pad}px;bottom:${pad - 6}px;width:140px">${dark ? wordmark : wordmarkInk}</div>
  <div class="eb" style="position:absolute;right:${pad}px;bottom:${pad}px;font-size:18px;color:${dark ? C.muted : C.mutedInk}">${page || DOMAIN}</div>`;

/* ── 1. profile pictures ────────────────────────────────────── */

const avatar = (bg, top, rest) => (s) => `<style>${base}body{width:${s}px;height:${s}px;background:${bg}}</style>${symbol(s / 2, s / 2 + s * 0.02, s * 0.2, top, rest)}`;

/* ── 2. covers ──────────────────────────────────────────────── */

const covers = {
  // Company page logo sits under the bottom-left; keep that corner quiet.
  'linkedin-company-cover-1128x191.png': [1128, 191, carbon(1128, 191, `
    <div class="eb" style="position:absolute;left:300px;top:52px;font-size:12px;color:${C.muted}">Software studio ◆ USA · Cairo</div>
    <div style="position:absolute;left:300px;top:76px;font-size:40px;font-weight:600;letter-spacing:-.03em;line-height:1">Every business leaves a mark<span class="stop"></span></div>
    <div style="position:absolute;left:300px;top:128px;font-size:17px;color:${C.muted}">Websites · Apps · Business systems · Custom software</div>
    <div class="cut" style="--cut:28px;position:absolute;right:0;top:0;width:150px;height:191px;background:${C.vermilion}"></div>
    ${symbol(1053, 98, 30, C.carbon, C.carbon)}`)],

  // Profile photo overlaps the bottom-left; content sits right of it.
  'linkedin-personal-banner-1584x396.png': [1584, 396, carbon(1584, 396, `
    ${constellation([[470, 300], [560, 250], [650, 286], [745, 222]])}
    <div class="eb" style="position:absolute;left:820px;top:96px;font-size:15px;color:${C.muted}">Founder, TRACE ◆ USA · Cairo</div>
    <div style="position:absolute;left:820px;top:128px;width:640px;font-size:54px;font-weight:600;letter-spacing:-.035em;line-height:1.02">We build the software your business runs on<span class="stop"></span></div>
    <div class="eb" style="position:absolute;left:820px;top:292px;font-size:15px;letter-spacing:.06em;text-transform:none;color:${C.muted}">${DOMAIN}</div>`)],

  // Avatar overlaps bottom-left at roughly 0–330 × 300–500.
  'x-header-1500x500.png': [1500, 500, carbon(1500, 500, `
    <div class="eb" style="position:absolute;left:420px;top:110px;font-size:15px;color:${C.muted}">Software studio ◆ USA · Cairo</div>
    <div style="position:absolute;left:420px;top:142px;font-size:64px;font-weight:600;letter-spacing:-.04em;line-height:.98">Every business<br>leaves a mark<span class="stop"></span></div>
    <div style="position:absolute;left:420px;top:300px;font-size:22px;color:${C.muted}">We build the software that carries it.</div>
    <div class="shot" style="left:1010px;top:70px;width:560px;transform:rotate(-4deg)"><img src="${shots.dashboard}"></div>
    <div class="shot" style="left:1240px;top:230px;width:150px;border-radius:22px;transform:rotate(-4deg)"><img src="${shots.mobile}"></div>`)],

  // Desktop shows 1640×624 centred; mobile crops the sides. Keep it central.
  'facebook-cover-1640x856.png': [1640, 856, carbon(1640, 856, `
    <div class="eb" style="position:absolute;left:260px;top:300px;font-size:16px;color:${C.muted}">Software studio ◆ USA · Cairo</div>
    <div style="position:absolute;left:260px;top:336px;font-size:76px;font-weight:600;letter-spacing:-.04em;line-height:.98">Every business<br>leaves a mark<span class="stop"></span></div>
    <div style="position:absolute;left:260px;top:520px;font-size:24px;color:${C.muted}">Websites · Apps · Business systems</div>
    <div class="shot" style="left:900px;top:250px;width:560px;transform:rotate(-3deg)"><img src="${shots.dashboard}"></div>
    <div class="shot" style="left:1300px;top:420px;width:150px;border-radius:22px;transform:rotate(-3deg)"><img src="${shots.mobile}"></div>`)],

  // Everything inside the 1546×423 safe area that every device shows.
  'youtube-banner-2560x1440.png': [2560, 1440, carbon(2560, 1440, `
    ${constellation([[300, 1100], [520, 980], [760, 1060], [980, 940]])}
    <div class="wm" style="position:absolute;left:560px;top:560px;width:560px">${wordmark}</div>
    <div style="position:absolute;left:1220px;top:590px;width:800px;font-size:64px;font-weight:600;letter-spacing:-.035em;line-height:1.02">Every business leaves a mark<span class="stop"></span></div>
    <div class="eb" style="position:absolute;left:1220px;top:760px;font-size:24px;color:${C.muted}">Websites · Apps · Systems ◆ USA · Cairo</div>`)],
};

/* ── 3. posts (1080 × 1350 unless noted) ────────────────────── */

const W = 1080;
const H = 1350;

const titleSlide = (eyebrow, title, sub, page) => carbon(W, H, `
  <div class="eb" style="position:absolute;left:80px;top:96px;font-size:20px;color:${C.muted}">${eyebrow}</div>
  ${symbol(960, 130, 34)}
  <div style="position:absolute;left:80px;top:420px;width:900px;display:flex;flex-direction:column;gap:48px">
    <div style="font-size:104px;font-weight:600;letter-spacing:-.045em;line-height:.96">${title}<span class="stop"></span></div>
    ${sub ? `<div style="width:820px;font-size:34px;line-height:1.4;color:${C.muted}">${sub}</div>` : ''}
  </div>
  <div style="position:absolute;left:80px;right:80px;bottom:160px;height:1px;background:${C.line}"></div>
  ${foot(W, H, { page })}`);

const listSlide = (eyebrow, items, page, start = 1) => paper(W, H, `
  <div class="eb" style="position:absolute;left:80px;top:96px;font-size:20px;color:${C.mutedInk}">${eyebrow}</div>
  <div style="position:absolute;left:80px;right:80px;top:200px">
    ${items
      .map(
        (it, i) => `
      <div style="border-top:1px solid ${C.lineLight};padding:44px 0 52px;display:flex;gap:40px">
        <div class="eb" style="font-size:20px;color:${C.mutedInk};padding-top:14px;width:60px">${String(start + i).padStart(2, '0')}</div>
        <div><div style="font-size:54px;font-weight:600;letter-spacing:-.03em;line-height:1.05">${it.title}</div>
        ${it.text ? `<div style="margin-top:18px;font-size:30px;line-height:1.42;color:${C.mutedInk};max-width:760px">${it.text}</div>` : ''}</div>
      </div>`,
      )
      .join('')}
  </div>
  ${foot(W, H, { dark: false, page })}`);

const ctaSlide = (title, page) => carbon(W, H, `
  ${constellation([[120, 360], [300, 300], [470, 380], [660, 280]])}
  <div style="position:absolute;left:80px;top:520px;width:920px;font-size:96px;font-weight:600;letter-spacing:-.045em;line-height:.98">${title}<span class="stop"></span></div>
  <div class="cut" style="--cut:22px;position:absolute;left:80px;top:860px;padding:30px 44px;background:${C.vermilion};color:${C.carbon};font-size:34px;font-weight:600">Book a free 30-minute call</div>
  <div class="eb" style="position:absolute;left:80px;top:990px;font-size:22px;letter-spacing:.06em;text-transform:none;color:${C.muted}">${DOMAIN} · ${contact.email}</div>
  ${foot(W, H, { page })}`);

const posts = {};
const carousel = (folder, slides) => slides.forEach((html, i) => (posts[`${folder}/slide-${String(i + 1).padStart(2, '0')}.png`] = [W, H, html]));

// 01 — introduction, one image
posts['01-introducing-trace.png'] = [W, H, carbon(W, H, `
  <div class="eb" style="position:absolute;left:80px;top:96px;font-size:20px;color:${C.muted}">Software studio ◆ USA · Cairo</div>
  ${symbol(540, 380, 120)}
  <div style="position:absolute;left:80px;top:640px;width:920px;font-size:110px;font-weight:600;letter-spacing:-.045em;line-height:.95">Every business<br>leaves a mark<span class="stop"></span></div>
  <div style="position:absolute;left:80px;top:900px;font-size:44px;font-weight:500;letter-spacing:-.02em;color:${C.muted}">We build the software that carries it.</div>
  ${foot(W, H)}`)];

// 02 — what we build
const per = 3;
const svcSlides = [];
for (let i = 0; i < svc.length; i += per)
  svcSlides.push(listSlide('What we build', svc.slice(i, i + per).map((s) => ({ title: s.title, text: s.line })), '', i + 1));
carousel('02-what-we-build', [
  titleSlide('Carousel ◆ Swipe', 'What we build', 'Websites, apps, business systems and custom software — for US businesses.', '01 →'),
  ...svcSlides,
  ctaSlide('Tell us how your business works', ''),
]);

// 03 — terms in writing
carousel('03-in-writing', [
  titleSlide('Carousel ◆ Swipe', 'What every client gets, in writing', 'Not slogans. Terms we put in the contract.', '01 →'),
  listSlide('In writing', promises.slice(0, 3).map((p) => ({ title: p })), '', 1),
  listSlide('In writing', promises.slice(3, 6).map((p) => ({ title: p })), '', 4),
  ctaSlide('Hold us to it', ''),
]);

// 04 — how we work
carousel('04-how-we-work', [
  titleSlide('Carousel ◆ Swipe', 'How a project runs', 'Four steps, a fixed price per phase, working software every two weeks.', '01 →'),
  ...steps.map((s) =>
    carbon(W, H, `
      <div class="eb" style="position:absolute;left:80px;top:96px;font-size:20px;color:${C.muted}">How we work</div>
      <div style="position:absolute;left:80px;top:260px;font-family:M,monospace;font-size:220px;color:${C.line};line-height:1">${s.n}</div>
      <div style="position:absolute;left:80px;top:300px;bottom:300px;width:2px;background:${C.line}"></div>
      <div class="n" style="--s:22px;--c:${C.vermilion};left:70px;top:640px"></div>
      <div style="position:absolute;left:150px;top:620px;width:840px;display:flex;flex-direction:column;gap:36px">
        <div style="font-size:92px;font-weight:600;letter-spacing:-.04em;line-height:1">${s.title}<span class="stop"></span></div>
        <div style="font-size:34px;line-height:1.45;color:${C.muted}">${s.text}</div>
      </div>
      ${foot(W, H)}`),
  ),
  ctaSlide('Start with a free call', ''),
]);

// 05 — selected work (real projects, real captures)
carousel('05-selected-work', [
  titleSlide('Carousel ◆ Swipe', 'Selected work', 'Real projects, real screens.', '01 →'),
  ...work.map((p) =>
    carbon(W, H, `
      <div class="eb" style="position:absolute;left:80px;top:96px;font-size:20px;color:${C.muted}">${p.kind === 'product' ? 'In-house product' : 'Client work'} ◆ ${p.en.sector ?? ''}</div>
      <div class="shot" style="left:80px;top:190px;width:920px;border-radius:12px"><img src="${p.src}"></div>
      <div style="position:absolute;left:80px;top:830px;font-size:30px;font-weight:600;color:${C.muted}">${p.en.client}</div>
      <div style="position:absolute;left:80px;top:880px;width:920px;font-size:64px;font-weight:600;letter-spacing:-.035em;line-height:1.04">${p.en.title}<span class="stop"></span></div>
      ${foot(W, H)}`),
  ),
  ctaSlide('Want something like this?', ''),
]);

// 06 — bail bonds
posts['06-bail-bonds.png'] = [W, H, carbon(W, H, `
  <div class="eb" style="position:absolute;left:80px;top:96px;font-size:20px;color:${C.muted}">For bail bond agencies ◆ USA</div>
  <div style="position:absolute;left:80px;top:200px;font-family:M,monospace;font-size:28px;color:${C.muted}">2:09 AM — “bail bonds near me”</div>
  <div style="position:absolute;left:80px;top:300px;width:920px;font-size:118px;font-weight:600;letter-spacing:-.045em;line-height:.94">Be the bondsman they call first<span class="stop"></span></div>
  <div style="position:absolute;left:80px;top:780px;width:860px;font-size:34px;line-height:1.45;color:${C.muted}">${bail.hero.lead}</div>
  <div class="cut" style="--cut:22px;position:absolute;left:80px;top:1010px;padding:28px 40px;background:${C.vermilion};color:${C.carbon};font-size:32px;font-weight:600">${DOMAIN}/bail-bonds</div>
  ${foot(W, H)}`)];

// 07 — editable announcement template (replace the text in make-social.mjs)
posts['07-template-announcement.png'] = [W, H, paper(W, H, `
  <div class="eb" style="position:absolute;left:80px;top:96px;font-size:20px;color:${C.mutedInk}">Announcement ◆ Month 2026</div>
  ${symbol(960, 130, 34, C.vermilionInk, C.ink)}
  <div style="position:absolute;left:80px;top:440px;width:900px;font-size:104px;font-weight:600;letter-spacing:-.045em;line-height:.96">Your headline goes here<span class="stop" style="background:${C.vermilionInk}"></span></div>
  <div style="position:absolute;left:80px;top:780px;width:820px;font-size:34px;line-height:1.4;color:${C.mutedInk}">One or two lines that say what happened and why it matters to a client.</div>
  ${foot(W, H, { dark: false })}`)];

// LinkedIn link banners, 1200 × 627
const banner = (eyebrow, title, sub) => carbon(1200, 627, `
  <div class="eb" style="position:absolute;left:72px;top:72px;font-size:15px;color:${C.muted}">${eyebrow}</div>
  <div style="position:absolute;left:72px;top:150px;width:760px;font-size:68px;font-weight:600;letter-spacing:-.04em;line-height:.98">${title}<span class="stop"></span></div>
  <div style="position:absolute;left:72px;top:400px;width:640px;font-size:22px;line-height:1.45;color:${C.muted}">${sub}</div>
  <div class="wm" style="position:absolute;left:72px;bottom:52px;width:110px">${wordmark}</div>
  <div class="cut" style="--cut:36px;position:absolute;right:0;bottom:0;width:250px;height:250px;background:${C.vermilion}"></div>
  ${symbol(1075, 512, 34, C.carbon, C.carbon)}`);
posts['linkedin/link-banner-intro-1200x627.png'] = [1200, 627, banner('Software studio ◆ USA · Cairo', 'Every business leaves a mark', 'Websites, apps, business systems and custom software — senior engineers on US hours, fixed price per phase.')];
posts['linkedin/link-banner-bail-bonds-1200x627.png'] = [1200, 627, banner('For bail bond agencies', 'Be the bondsman they call first', 'Bail bond websites and an assistant that answers at 2 a.m.')];
posts['square/introducing-trace-1080x1080.png'] = [1080, 1080, carbon(1080, 1080, `
  ${symbol(540, 330, 110)}
  <div style="position:absolute;left:80px;right:80px;top:560px;text-align:center;font-size:92px;font-weight:600;letter-spacing:-.045em;line-height:.96">Every business<br>leaves a mark<span class="stop"></span></div>
  <div class="eb" style="position:absolute;left:0;right:0;bottom:90px;text-align:center;font-size:18px;color:${C.muted}">Software studio ◆ USA · Cairo</div>`)];

/* ── 4. stories and highlight covers (1080 × 1920) ──────────── */

const SW = 1080;
const SH = 1920;
const stories = {
  'story-01-introducing-trace.png': carbon(SW, SH, `
    <div class="eb" style="position:absolute;left:90px;top:240px;font-size:22px;color:${C.muted}">Software studio ◆ USA · Cairo</div>
    ${symbol(540, 560, 130)}
    <div style="position:absolute;left:90px;top:840px;width:900px;font-size:116px;font-weight:600;letter-spacing:-.045em;line-height:.95">Every business<br>leaves a mark<span class="stop"></span></div>
    <div style="position:absolute;left:90px;top:1110px;font-size:42px;color:${C.muted}">We build the software that carries it.</div>
    <div class="wm" style="position:absolute;left:90px;bottom:260px;width:170px">${wordmark}</div>`),
  'story-02-book-a-call.png': carbon(SW, SH, `
    <div class="eb" style="position:absolute;left:90px;top:240px;font-size:22px;color:${C.muted}">Free · 30 minutes · No obligation</div>
    <div style="position:absolute;left:90px;top:420px;width:900px;font-size:120px;font-weight:600;letter-spacing:-.045em;line-height:.95">Tell us how your business works<span class="stop"></span></div>
    <div style="position:absolute;left:90px;top:900px;width:860px;font-size:40px;line-height:1.4;color:${C.muted}">${site.cta.text}</div>
    <div style="position:absolute;left:90px;right:90px;top:1180px;height:220px;border:3px dashed ${C.line};border-radius:24px;display:grid;place-items:center" class="eb"><span style="font-size:20px;color:${C.muted}">Place the link sticker here</span></div>
    <div class="wm" style="position:absolute;left:90px;bottom:260px;width:170px">${wordmark}</div>`),
  'story-03-bail-bonds.png': carbon(SW, SH, `
    <div class="eb" style="position:absolute;left:90px;top:240px;font-size:22px;color:${C.muted}">For bail bond agencies</div>
    <div style="position:absolute;left:90px;top:360px;font-family:M,monospace;font-size:34px;color:${C.muted}">2:09 AM</div>
    <div style="position:absolute;left:90px;top:440px;width:900px;font-size:124px;font-weight:600;letter-spacing:-.045em;line-height:.94">Be the bondsman they call first<span class="stop"></span></div>
    <div style="position:absolute;left:90px;top:1010px;width:860px;font-size:40px;line-height:1.4;color:${C.muted}">${bail.hero.lead}</div>
    <div class="wm" style="position:absolute;left:90px;bottom:260px;width:170px">${wordmark}</div>`),
};

/* Highlight icons, from the site's icon set (1.5 stroke, square caps). */
const ICONS = {
  work: 'M12 3.5l8.5 4.5-8.5 4.5L3.5 8zM3.5 12l8.5 4.5 8.5-4.5M3.5 16l8.5 4.5 8.5-4.5',
  services: 'M4 4h7v9H4zM13 4h7v5h-7zM13 11h7v9h-7zM4 15h7v5H4z',
  process: 'M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-6',
  about: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20.5c1-3.8 4-5.5 7.5-5.5s6.5 1.7 7.5 5.5',
  contact: 'M3.5 5.5h17v13h-17zM3.5 6l8.5 7 8.5-7',
  'bail-bonds': 'M5 3.5h4l1.5 4.5-2.5 1.5a11 11 0 0 0 6.5 6.5l1.5-2.5 4.5 1.5v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5.5a2 2 0 0 1 2-2z',
};
const highlight = (d, w, h) => carbon(w, h, `
  <svg viewBox="0 0 24 24" style="position:absolute;left:${w / 2 - 150}px;top:${h / 2 - 150}px;width:300px;height:300px" fill="none" stroke="${C.paper}" stroke-width="1.1" stroke-linecap="square" stroke-linejoin="miter"><path d="${d}"/></svg>
  <div class="n" style="--s:44px;--c:${C.vermilion};left:${w / 2 + 120}px;top:${h / 2 - 190}px"></div>`);

/* ── render ─────────────────────────────────────────────────── */

const browser = await chromium.launch();
const page = await browser.newPage();
let count = 0;

/** Glue the nuqta full stop to its last word; a question keeps its own mark. */
const glue = (html) =>
  html.replace(/([^\s>]{1,60})<span class="stop"([^>]*)><\/span>/g, (_, word, attrs) =>
    word.endsWith('?') ? word : `<span style="white-space:nowrap">${word}<span class="stop"${attrs}></span></span>`,
  );

async function render(file, w, h, html, transparent = false) {
  html = glue(html);
  const out = path.join(OUT, file);
  await mkdir(path.dirname(out), { recursive: true });
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"></head><body>${html}</body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(80);
  await page.screenshot({ path: out, omitBackground: transparent });
  count += 1;
}

// 1. profile
for (const [name, bg, top, rest] of [
  ['carbon', C.carbon, C.vermilion, C.paper],
  ['paper', C.paper, C.vermilionInk, C.ink],
  ['vermilion', C.vermilion, C.carbon, C.carbon],
]) {
  for (const s of [1080, 400]) await render(`01-profile/avatar-${name}-${s}.png`, s, s, avatar(bg, top, rest)(s));
}

// 2. covers
for (const [file, [w, h, html]] of Object.entries(covers)) await render(`02-covers/${file}`, w, h, html);

// 3. posts
for (const [file, [w, h, html]] of Object.entries(posts)) await render(`03-posts/${file}`, w, h, html);

// 4. stories + highlights
for (const [file, html] of Object.entries(stories)) await render(`04-stories/${file}`, SW, SH, html);
for (const [name, d] of Object.entries(ICONS)) {
  await render(`04-stories/highlight-covers/${name}-1080x1920.png`, SW, SH, highlight(d, SW, SH));
  await render(`04-stories/highlight-covers/${name}-1080x1080.png`, 1080, 1080, highlight(d, 1080, 1080));
}

// 5. logos: PNG renders (transparent) + the source SVGs
const logo = (svg, w) => `<style>${base}body{width:${w}px;background:transparent}</style><div class="wm" style="width:${w}px">${svg}</div>`;
for (const [name, file] of [
  ['trace-wordmark-ink', 'public/brand/trace-wordmark.svg'],
  ['trace-wordmark-paper', 'public/brand/trace-wordmark-reverse.svg'],
  ['trace-symbol', 'public/brand/trace-symbol.svg'],
  ['trace-symbol-paper', 'public/brand/trace-symbol-reverse.svg'],
  ['trace-lockup-stacked-ink', 'public/brand/trace-lockup-stacked.svg'],
  ['trace-lockup-stacked-paper', 'public/brand/trace-lockup-stacked-reverse.svg'],
]) {
  const svg = await read(file);
  const [, vw, vh] = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/) ?? [];
  const w = name.includes('symbol') ? 1024 : name.includes('lockup') ? 1600 : 2400;
  const h = Math.ceil((w * Number(vh)) / Number(vw));
  await render(`05-logos/png/${name}-${w}.png`, w, h, logo(svg, w), true);
  await mkdir(path.join(OUT, '05-logos/svg'), { recursive: true });
  await copyFile(file, path.join(OUT, '05-logos/svg', path.basename(file)));
}
// The stacked lockup on its own backgrounds, square, ready to drop in anywhere.
const lockupOn = async (file, bg) => {
  const svg = await read(file);
  return `<style>${base}body{width:2000px;height:2000px;background:${bg};display:grid;place-items:center}</style><div class="wm" style="width:1240px">${svg}</div>`;
};
await render('05-logos/png/trace-lockup-stacked-on-carbon-2000.png', 2000, 2000, await lockupOn('public/brand/trace-lockup-stacked-reverse.svg', C.carbon));
await render('05-logos/png/trace-lockup-stacked-on-paper-2000.png', 2000, 2000, await lockupOn('public/brand/trace-lockup-stacked.svg', C.paper));

for (const f of ['trace-lockup-stacked.svg', 'trace-lockup-stacked-reverse.svg', 'trace-lockup-stacked-accent.svg', 'trace-lockup-stacked-mono.svg', 'trace-lockup-stacked-reverse-mono.svg', 'social-avatar.svg', 'app-icon-dark.svg', 'app-icon-light.svg', 'trace-wordmark-mono.svg', 'trace-wordmark-reverse-mono.svg', 'trace-symbol-mono.svg', 'trace-symbol-accent.svg'])
  await copyFile(`public/brand/${f}`, path.join(OUT, '05-logos/svg', f));

// 6. the written half: README at the top, checklist, bios, captions, brand basics
await mkdir(path.join(OUT, '00-start-here'), { recursive: true });
await copyFile('design/social-copy/README.md', path.join(OUT, 'README.md'));
for (const f of ['setup-checklist.md', 'bios.md', 'captions.md', 'brand-basics.md'])
  await copyFile(`design/social-copy/${f}`, path.join(OUT, '00-start-here', f));

await browser.close();
await writeFile(path.join(OUT, '.generated'), `Generated by scripts/make-social.mjs — ${count} images.\n`);
console.log(`✓ ${count} images in ${OUT}/`);
