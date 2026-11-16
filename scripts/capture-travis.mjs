/**
 * Real captures of the Travis Bail Bonds demo (travis-bail-bonds.vercel.app),
 * page by page — the raw material for its showcase slides and case study.
 *
 *   node scripts/capture-travis.mjs
 *   node scripts/make-showcases.mjs travis
 *   node scripts/make-case-assets.mjs travis
 *
 * The demo's own notices (the concept bar, the "about this demo" card and the
 * owner button) are hidden because the portfolio labels the project itself.
 * Output in assets/captures/travis-bail-bonds/:
 *   desktop-<page>.jpg   1440×900 @2x, top of each page
 *   desktop-0 … 4.jpg    1440×900 @2x, down the home page
 *   mobile-<page>.jpg    390×844 @2x, top of each page
 *   mobile-0 … 3.jpg     390×844 @2x, down the home page
 *   full.jpg             the whole home page @1x, for the case study's scroll-through
 */
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const BASE = 'https://travis-bail-bonds.vercel.app';
const OUT = 'assets/captures/travis-bail-bonds';
const PAGES = ['how', 'agents', 'pay', 'checkin', 'wanted', 'about', 'start'];
const HIDE = '.concept-bar,.owner-intro,.owner-fab{display:none!important}';

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();

async function save(page, name, fullPage = false) {
  const buf = await page.screenshot({ fullPage });
  let img = sharp(buf);
  if (fullPage) {
    const meta = await img.metadata();
    img = sharp(buf).extract({ left: 0, top: 0, width: meta.width, height: Math.min(meta.height, 9000) });
  }
  await img.jpeg({ quality: fullPage ? 82 : 86, mozjpeg: true }).toFile(path.join(OUT, `${name}.jpg`));
  console.log(`  ${name}`);
}

/** Open a page, walk it so reveals and lazy images settle, then go back to the top. */
async function visit(page, url) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  await page.addStyleTag({ content: HIDE });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);
}

for (const [prefix, viewport, downCount] of [
  ['desktop', { width: 1440, height: 900 }, 5],
  ['mobile', { width: 390, height: 844 }, 4],
]) {
  const mobile = viewport.width < 600;
  const context = await browser.newContext({ viewport, deviceScaleFactor: 2, isMobile: mobile, hasTouch: mobile });
  const page = await context.newPage();

  for (const id of PAGES) {
    await visit(page, `${BASE}/${id}/`);
    await save(page, `${prefix}-${id}`);
  }

  await visit(page, `${BASE}/`);
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = (height - viewport.height) / (downCount - 1);
  for (let i = 0; i < downCount; i += 1) {
    await page.evaluate((top) => window.scrollTo(0, top), Math.round(i * step));
    await page.waitForTimeout(900);
    await save(page, `${prefix}-${i}`);
  }
  await context.close();
}

/* The whole home page, top to bottom, at 1x. */
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await visit(page, `${BASE}/`);
  await save(page, 'full', true);
  await context.close();
}

await browser.close();
