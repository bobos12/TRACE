/**
 * Brand covers for the projects that have no live site to photograph.
 *
 *   node scripts/make-brand-covers.mjs
 *
 * Two of the real projects — the Al Nokhba eye clinic system and LamaBooking — are
 * private applications, so there is nothing to screenshot and fabricating one
 * is out of the question. They get a diagram instead: the modules the system
 * is actually made of, drawn in ATHR's own language on carbon. It reads as a
 * graphic, never as a product screen.
 *
 * Rendered through Playwright so the real brand fonts are used, then flattened
 * to a 2400×1500 JPEG like every other cover.
 */
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdir, rm, readFile } from 'node:fs/promises';
import path from 'node:path';

const OUT = 'public/images/portfolio';
const TMP = 'shots/.brand-covers';

const COVERS = [
  {
    slug: 'eye-clinic-system',
    // A stand-in until Al Nokhba's own screens arrive — see portfolio.json.
    eyebrow: 'Clinic system ◆ Al Nokhba',
    title: 'Al Nokhba Eye Clinic',
    // Exactly the modules described in the case study — nothing invented.
    modules: ['Patient record', 'Visit history', 'Examination', 'Prescription'],
    stack: 'React · Node.js · Express · MongoDB',
    note: 'Role-based access',
    mark: 2,
  },
  {
    slug: 'lamabooking',
    eyebrow: 'In-house product ◆ MERN',
    title: 'LamaBooking',
    modules: ['Search', 'Availability', 'Reservation', 'Admin panel'],
    stack: 'React · Node.js · Express · MongoDB',
    note: 'JWT authentication',
    mark: 1,
  },
];

const b64 = async (file) => (await readFile(file)).toString('base64');

const latin = await b64('public/fonts/InstrumentSans-Variable.woff2');
const mono = await b64('public/fonts/IBMPlexMono-500.woff2');

/** A rhombus lattice, the same motif as the hero. */
function lattice() {
  const cells = [];
  for (let y = 0; y < 5; y += 1) {
    for (let x = 0; x < 8; x += 1) {
      cells.push(`<span style="top:${70 + y * 190}px;left:${60 + x * 195}px"></span>`);
    }
  }
  return cells.join('');
}

const page$ = (c) => `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face{font-family:Instrument;src:url(data:font/woff2;base64,${latin}) format('woff2');font-weight:100 900}
  @font-face{font-family:Plex;src:url(data:font/woff2;base64,${mono}) format('woff2');font-weight:500}
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1600px;height:1000px;background:#0F0F0D;color:#F2EEE4;
       font-family:Instrument,sans-serif;position:relative;overflow:hidden}
  .lattice span{position:absolute;width:10px;height:10px;transform:rotate(45deg) scale(.7071);
       box-shadow:inset 0 0 0 1px #2E2D28}
  .frame{position:absolute;inset:56px;border:1px solid #2E2D28;
         display:flex;flex-direction:column;justify-content:space-between;padding:40px}
  .head{display:flex;align-items:flex-start;justify-content:space-between}
  .eyebrow{font-family:Plex,monospace;font-size:14px;letter-spacing:.14em;
           text-transform:uppercase;color:#8E887A}
  .title{font-size:72px;font-weight:600;letter-spacing:-.035em;line-height:1;margin-top:16px}
  .title i{font-style:normal;color:#FF5A33}
  .con{display:grid;grid-template-columns:repeat(3,16px);gap:6px}
  .con b{width:16px;height:16px;transform:rotate(45deg) scale(.7071);display:block}
  /* The trace: one hairline through the modules, a nuqta at each junction. */
  .flow{position:relative;display:flex;align-items:stretch;gap:0}
  .flow::before{content:'';position:absolute;top:50%;left:0;right:0;height:1px;background:#2E2D28}
  .mod{flex:1;position:relative;border:1px solid #2E2D28;padding:26px 24px;
       background:#0F0F0D;display:flex;flex-direction:column;gap:64px;margin-inline:14px}
  .mod:first-child{margin-inline-start:0}
  .mod:last-child{margin-inline-end:0}
  .mod .n{font-family:Plex,monospace;font-size:13px;color:#8E887A;letter-spacing:.1em}
  .mod .l{font-size:26px;font-weight:500;letter-spacing:-.018em}
  .mod[data-mark]{border-color:#726D61}
  .mod[data-mark] .l{color:#FF5A33}
  .mod::after{content:'';position:absolute;top:50%;inset-inline-end:-21px;width:14px;height:14px;
       margin-top:-7px;background:#2E2D28;transform:rotate(45deg) scale(.7071)}
  .mod:last-child::after{display:none}
  .mod[data-mark]::after{background:#FF5A33}
  .foot{display:flex;align-items:baseline;justify-content:space-between;
        font-family:Plex,monospace;font-size:15px;letter-spacing:.06em;color:#A7A193}
  .foot span:last-child{color:#8E887A;text-transform:uppercase;letter-spacing:.14em;font-size:13px}
</style></head><body>
  <div class="lattice">${lattice()}</div>
  <div class="frame">
    <div class="head">
      <div>
        <div class="eyebrow">${c.eyebrow}</div>
        <div class="title">${c.title}<i>.</i></div>
      </div>
      <div class="con">${Array.from({ length: 9 }, (_, i) => {
        const on = [0, 4, 5, 7].includes(i);
        const bg = i === c.mark ? '#FF5A33' : on ? '#F2EEE4' : 'transparent';
        const ring = on || i === c.mark ? '' : 'box-shadow:inset 0 0 0 1px #2E2D28;';
        return `<b style="background:${bg};${ring}"></b>`;
      }).join('')}</div>
    </div>

    <div class="flow">
      ${c.modules
        .map(
          (m, i) =>
            `<div class="mod"${i === 1 ? ' data-mark' : ''}><span class="n">${String(i + 1).padStart(2, '0')}</span><span class="l">${m}</span></div>`,
        )
        .join('')}
    </div>

    <div class="foot"><span>${c.stack}</span><span>${c.note}</span></div>
  </div>
</body></html>`;

await mkdir(OUT, { recursive: true });
await mkdir(TMP, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
const page = await context.newPage();

for (const cover of COVERS) {
  await page.setContent(page$(cover), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);

  const raw = path.join(TMP, `${cover.slug}.png`);
  await page.screenshot({ path: raw });

  await sharp(raw).resize(2400, 1500).jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(OUT, `${cover.slug}.jpg`));

  console.log(`✓ ${cover.slug}.jpg`);
}

await browser.close();
await rm(TMP, { recursive: true, force: true });
