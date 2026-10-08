/**
 * The static share images in public/og/, 1200×630.
 *
 *   node scripts/make-og.mjs
 *
 * Per-project share images are rendered at request time by
 * src/app/og/work/[slug]/route.tsx; these are the
 * home page, the default, and the generic case-study card.
 */
import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const b64 = async (f) => (await readFile(f)).toString('base64');
const latin = await b64('public/fonts/InstrumentSans-Variable.woff2');
const mono = await b64('public/fonts/IBMPlexMono-500.woff2');
const wordmark = await readFile('public/brand/trace-wordmark-reverse.svg', 'utf8');
const wordmarkInk = await readFile('public/brand/trace-wordmark.svg', 'utf8');

const DOMAIN = (process.env.NEXT_PUBLIC_SITE_URL || 'trace-studio.tech').replace(/^https?:\/\//, '');

const base = `
  @font-face{font-family:I;src:url(data:font/woff2;base64,${latin}) format('woff2');font-weight:100 900}
  @font-face{font-family:M;src:url(data:font/woff2;base64,${mono}) format('woff2');font-weight:500}
  *{margin:0;box-sizing:border-box}
  body{width:1200px;height:630px;overflow:hidden;font-family:I,sans-serif;position:relative}
  .eb{font-family:M,monospace;font-size:14px;letter-spacing:.18em;text-transform:uppercase;color:#A7A193}
  .n{position:absolute;width:var(--s);height:var(--s);transform:rotate(45deg) scale(.7071);background:var(--c)}
  svg{display:block;width:100%;height:auto}
`;

const PAGES = {
  'og-home-en.png': `<style>${base}
    body{background:#0F0F0D;color:#F2EEE4}
    h1{position:absolute;left:72px;top:86px;font-size:84px;line-height:.98;letter-spacing:-.04em;font-weight:600}
    h1 span{color:#A49E8F}
    h1 i{display:inline-block;width:20px;height:20px;background:#FF5A33;transform:rotate(45deg) scale(.7071);margin-left:4px}
    .cut{position:absolute;right:0;bottom:0;width:230px;height:230px;background:#FF5A33;clip-path:polygon(40px 0,100% 0,100% 100%,0 100%,0 40px)}
  </style>
  <div class="eb" style="position:absolute;left:72px;top:68px">Trace Studio ◆ Digital products, websites &amp; software</div>
  <h1>Every business<br>leaves a mark<i></i><br><span>We build the<br>software that<br>carries it.</span></h1>
  <div class="n" style="--s:56px;--c:#FF5A33;left:1029px;top:56px"></div>
  <div class="n" style="--s:56px;--c:#F2EEE4;left:978px;top:107px"></div>
  <div class="n" style="--s:56px;--c:#F2EEE4;left:1080px;top:107px"></div>
  <div style="position:absolute;left:72px;bottom:36px;width:118px">${wordmark}</div>
  <div class="eb" style="position:absolute;left:758px;bottom:38px;letter-spacing:.04em;text-transform:none;font-size:15px">${DOMAIN}</div>
  <div class="cut"></div>`,

  'og-default.png': `<style>${base}
    body{background:#F4F1E9;color:#14130F}
    .side{position:absolute;right:0;top:0;width:420px;height:630px;background:#0F0F0D;clip-path:polygon(64px 0,100% 0,100% 100%,0 100%,0 64px)}
    p{position:absolute;left:72px;top:344px;width:540px;font-size:25px;line-height:1.45;color:#5C584F}
  </style>
  <div style="position:absolute;left:72px;top:196px;width:330px">${wordmarkInk}</div>
  <p>Every business leaves a mark. We build the software that carries it.</p>
  <div class="eb" style="position:absolute;left:72px;top:470px;color:#8E887A">Websites · Apps · Business systems · USA · Cairo</div>
  <div class="side"></div>
  <div class="n" style="--s:104px;--c:#E0461F;left:935px;top:232px"></div>
  <div class="n" style="--s:104px;--c:#E0461F;left:870px;top:297px"></div>
  <div class="n" style="--s:104px;--c:#E0461F;left:1000px;top:297px"></div>`,

  'og-case-study.png': `<style>${base}
    body{background:#1A1A17;color:#F2EEE4}
    h1{position:absolute;left:72px;top:270px;width:900px;font-size:66px;line-height:1.06;letter-spacing:-.035em;font-weight:600}
    h1 i{display:inline-block;width:18px;height:18px;background:#FF5A33;transform:rotate(45deg) scale(.7071);margin-left:4px}
    .rule{position:absolute;left:72px;right:72px;top:468px;height:1px;background:#2E2D28}
    .f{position:absolute;top:500px}
    .f b{display:block;font-family:M,monospace;font-weight:500;font-size:40px}
    .f span{font-size:15px;color:#A7A193}
  </style>
  <div class="eb" style="position:absolute;left:72px;top:68px">Case study ◆ 03 — Logistics · Ohio</div>
  <div class="n" style="--s:40px;--c:#F2EEE4;left:1050px;top:62px"></div>
  <div class="n" style="--s:40px;--c:#F2EEE4;left:1092px;top:62px"></div>
  <div class="n" style="--s:40px;--c:#F2EEE4;left:1050px;top:104px"></div>
  <div class="n" style="--s:40px;--c:#F2EEE4;left:1092px;top:104px"></div>
  <div class="n" style="--s:40px;--c:#FF5A33;left:1008px;top:146px"></div>
  <h1>Ridgeline Freight: from a group text to one portal<i></i></h1>
  <div class="rule"></div>
  <div class="f" style="left:72px"><b>6 min</b><span>dispatch, from 40</span></div>
  <div class="f" style="left:250px"><b>11</b><span>depots, one system</span></div>
  <div class="f" style="left:456px"><b>0</b><span>lost delivery notes</span></div>
  <div style="position:absolute;right:72px;bottom:58px;width:96px">${wordmark}</div>`,
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const [file, html] of Object.entries(PAGES)) {
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"></head><body>${html}</body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);
  await page.screenshot({ path: `public/og/${file}` });
  console.log(`✓ ${file}`);
}
await browser.close();
