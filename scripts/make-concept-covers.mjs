/**
 * Covers for the concept projects, composed from the product screens.
 *
 *   node scripts/render-ui.mjs        (first, if the screens changed)
 *   node scripts/make-concept-covers.mjs
 *
 * Same composition as design/portfolio-cover-template.html: a browser and/or
 * phone on a brand ground, with a constellation in the corner. 1600×1000
 * rendered at 1.5x → 2400×1500 JPEG, like every other cover.
 */
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdir, readFile, rm } from 'node:fs/promises';
import path from 'node:path';

const OUT = 'public/images/portfolio';
const TMP = 'shots/.concept-covers';
const UI = 'public/images/ui';

const GROUND = { carbon: '#0F0F0D', graphite: '#1A1A17', sand: '#D8D1C0' };

const img = async (name) =>
  `data:image/png;base64,${(await readFile(path.join(UI, name))).toString('base64')}`;

const browser$ = (src, { left, top, width, dark = false }) =>
  `<div class="br${dark ? ' d' : ''}" style="left:${left}px;top:${top}px;width:${width}px"><div class="bar"><i></i><i></i><i></i></div><img src="${src}"></div>`;

const phone$ = (src, { left, top, width }) =>
  `<div class="ph" style="left:${left}px;top:${top}px;width:${width}px"><img src="${src}"></div>`;

/** 3×3 lattice: o = outline, '' = filled, m = vermilion mark. */
const lattice$ = (cells, { left, top, color }) =>
  `<div class="lat" style="left:${left}px;top:${top}px;color:${color}">${cells
    .map((c) => `<i class="${c}"></i>`)
    .join('')}</div>`;

const COVERS = [
  // TRACE Bail — the in-house bail agency product (agency portal + agent app).
  {
    file: 'trace-bail-cover.jpg',
    ground: GROUND.carbon,
    parts: async () => [
      browser$(await img('dashboard-light.png'), { left: 120, top: 150, width: 1080 }),
      phone$(await img('mobile-home-en-light.png'), { left: 1130, top: 250, width: 330 }),
      lattice$(['o', 'm', 'o', '', 'o', '', 'o', 'o', 'o'], { left: 1380, top: 70, color: '#F2EEE4' }),
    ],
  },
  {
    file: 'trace-bail-shot-2.jpg',
    ground: GROUND.sand,
    parts: async () => [
      browser$(await img('dashboard-dark.png'), { left: 540, top: 120, width: 980, dark: true }),
      phone$(await img('mobile-approve-light.png'), { left: 130, top: 160, width: 360 }),
      lattice$(['', 'o', '', 'o', '', 'o', 'o', 'm', 'o'], { left: 110, top: 60, color: '#14130F' }),
    ],
  },
  {
    file: 'trace-bail-shot-3.jpg',
    ground: GROUND.graphite,
    parts: async () => [
      phone$(await img('mobile-splash-dark.png'), { left: 260, top: 170, width: 330 }),
      phone$(await img('mobile-home-en-light.png'), { left: 635, top: 110, width: 330 }),
      phone$(await img('mobile-approve-light.png'), { left: 1010, top: 170, width: 330 }),
      lattice$(['o', '', 'o', 'm', '', 'o', 'o', 'o', ''], { left: 1420, top: 40, color: '#F2EEE4' }),
    ],
  },
  {
    file: 'logistics-portal.jpg',
    ground: GROUND.graphite,
    parts: async () => [
      browser$(await img('freight-dashboard-light.png'), { left: 120, top: 150, width: 1080 }),
      phone$(await img('freight-mobile-home-en-light.png'), { left: 1130, top: 250, width: 330 }),
      lattice$(['o', '', 'o', 'm', '', 'o', 'o', 'o', ''], { left: 1380, top: 70, color: '#F2EEE4' }),
    ],
  },
  {
    file: 'clinic-booking.jpg',
    ground: GROUND.sand,
    parts: async () => [
      browser$(await img('freight-dashboard-dark.png'), { left: 540, top: 120, width: 980, dark: true }),
      phone$(await img('freight-mobile-approve-light.png'), { left: 130, top: 160, width: 360 }),
      lattice$(['', 'o', '', 'o', '', 'o', 'o', 'm', 'o'], { left: 110, top: 60, color: '#14130F' }),
    ],
  },
  {
    file: 'realty-app.jpg',
    ground: GROUND.carbon,
    parts: async () => [
      phone$(await img('freight-mobile-home-en-dark.png'), { left: 440, top: 110, width: 340 }),
      phone$(await img('freight-mobile-splash-dark.png'), { left: 840, top: 190, width: 340 }),
      lattice$(['o', 'm', 'o', '', 'o', '', 'o', 'o', 'o'], { left: 1380, top: 70, color: '#F2EEE4' }),
    ],
  },
  {
    file: 'corporate-website.jpg',
    ground: GROUND.carbon,
    parts: async () => [
      browser$(await img('website-home-en-light.png'), { left: 160, top: 130, width: 1280 }),
      '<div class="cut" style="left:0;top:780px;width:360px;height:220px;clip-path:polygon(0 0,320px 0,360px 40px,360px 100%,0 100%)"></div>',
      lattice$(['o', 'm', 'o', '', 'o', '', 'o', 'o', 'o'], { left: 1420, top: 40, color: '#F2EEE4' }),
    ],
  },
  {
    file: 'ordering-website.jpg',
    ground: GROUND.sand,
    parts: async () => [
      browser$(await img('website-home-en-dark.png'), { left: 160, top: 130, width: 1280, dark: true }),
      lattice$(['', 'o', 'o', 'o', '', 'o', 'm', 'o', ''], { left: 1420, top: 40, color: '#14130F' }),
    ],
  },
  {
    file: 'case-study-platform.jpg',
    ground: GROUND.graphite,
    parts: async () => [
      browser$(await img('case-study-light.png'), { left: 200, top: 110, width: 1200 }),
      lattice$(['o', '', 'o', '', 'm', '', 'o', 'o', 'o'], { left: 90, top: 60, color: '#F2EEE4' }),
    ],
  },
];

const page$ = (ground, parts) => `<!doctype html><html><head><meta charset="utf-8"><style>
  body{margin:0;width:1600px;height:1000px;overflow:hidden}
  .c{position:relative;width:1600px;height:1000px;overflow:hidden;background:${ground}}
  .br{position:absolute;border-radius:10px;overflow:hidden;box-shadow:0 40px 90px -30px rgba(0,0,0,.55),0 0 0 1px rgba(0,0,0,.08);background:#fff}
  .br .bar{height:34px;background:#E9E4D8;display:flex;align-items:center;gap:8px;padding:0 14px}
  .br .bar i{width:11px;height:11px;border-radius:50%;background:#B9B1A0}
  .br.d .bar{background:#1A1A17}.br.d .bar i{background:#3A3833}.br img{display:block;width:100%}
  .ph{position:absolute;filter:drop-shadow(0 40px 60px rgba(0,0,0,.45))}.ph img{display:block;width:100%}
  .lat{position:absolute;display:grid;grid-template-columns:repeat(3,26px);gap:8px}
  .lat i{width:26px;height:26px;transform:rotate(45deg) scale(.7071);background:currentColor}
  .lat i.o{background:transparent;box-shadow:inset 0 0 0 2px currentColor;opacity:.25}
  .lat i.m{background:#FF5A33}
  .cut{position:absolute;background:#E0461F}
</style></head><body><div class="c">${parts.join('')}</div></body></html>`;

await mkdir(TMP, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1.5 });

for (const cover of COVERS) {
  await page.setContent(page$(cover.ground, await cover.parts()), { waitUntil: 'load' });
  await page.waitForTimeout(200);
  const raw = path.join(TMP, cover.file.replace('.jpg', '.png'));
  await page.screenshot({ path: raw });
  await sharp(raw).resize(2400, 1500).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(OUT, cover.file));
  console.log(`✓ ${cover.file}`);
}

await browser.close();
await rm(TMP, { recursive: true, force: true });
