/**
 * Real captures of a concept demo served from public/demos/<name>/ — the raw
 * material for its showcase slides and case study.
 *
 *   npm run dev
 *   node scripts/capture-concept.mjs steel-city
 *   node scripts/make-showcases.mjs steel-city
 *   node scripts/make-case-assets.mjs steel-city
 *
 * Output in assets/captures/<slug>/ (slug from CONCEPTS below):
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

const CONCEPTS = {
  'steel-city': {
    slug: 'steel-city-bail',
    pages: ['locate', 'text', 'cost', 'cosigner', 'checkin', 'jails', 'wanted', 'apply', 'pay', 'team'],
  },
};

const name = process.argv[2];
const concept = CONCEPTS[name];
if (!concept) throw new Error(`Usage: node scripts/capture-concept.mjs <${Object.keys(CONCEPTS).join('|')}>`);

const BASE = `${process.env.BASE_URL ?? 'http://localhost:3000'}/demos/${name}`;
const OUT = path.join('assets/captures', concept.slug);
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();

async function save(page, file, fullPage = false) {
  const buf = await page.screenshot({ fullPage });
  let img = sharp(buf);
  if (fullPage) {
    const meta = await img.metadata();
    img = sharp(buf).extract({ left: 0, top: 0, width: meta.width, height: Math.min(meta.height, 9000) });
  }
  await img.jpeg({ quality: fullPage ? 82 : 86, mozjpeg: true }).toFile(path.join(OUT, `${file}.jpg`));
  console.log(`  ${file}`);
}

/** Open a page, walk it so reveals, maps and lazy images settle, then go back to the top. */
async function visit(page, url) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1500);
}

for (const [prefix, viewport, downCount] of [
  ['desktop', { width: 1440, height: 900 }, 5],
  ['mobile', { width: 390, height: 844 }, 4],
]) {
  const mobile = viewport.width < 600;
  const context = await browser.newContext({ viewport, deviceScaleFactor: 2, isMobile: mobile, hasTouch: mobile });
  const page = await context.newPage();

  for (const id of concept.pages) {
    await visit(page, `${BASE}/${id}`);
    await save(page, `${prefix}-${id}`);
  }

  await visit(page, BASE);
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = (height - viewport.height) / (downCount - 1);
  for (let i = 0; i < downCount; i += 1) {
    await page.evaluate((top) => window.scrollTo(0, top), Math.round(i * step));
    await page.waitForTimeout(900);
    await save(page, `${prefix}-${i}`);
  }
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await visit(page, BASE);
  await save(page, 'full', true);
  await context.close();
}

await browser.close();
