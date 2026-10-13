/**
 * Real captures of the Ellison & Reyes demo, page by page — the screens on the
 * home page showcase and the raw material for its showcase slides.
 *
 *   npm run dev                          (serves public/demos/)
 *   node scripts/capture-ellison.mjs
 *   node scripts/make-showcases.mjs ellison
 *
 * The demo routes by hash (#home, #cost …). Its concept ribbon is hidden
 * because the portfolio labels the project itself.
 * Output in assets/captures/ellison-reyes/:
 *   desktop-<page>.jpg   1440×900 @2x, top of each page
 *   desktop-0 … 4.jpg    1440×900 @2x, down the home page
 *   mobile-<page>.jpg    390×844 @2x, top of each page
 *   mobile-0 … 3.jpg     390×844 @2x, down the home page
 *   feature-<name>.jpg   1440×900 @2x, each feature scrolled into view
 *   full.jpg             the whole home page @1x, for the case study's scroll-through
 *
 *   node scripts/capture-ellison.mjs full   only full.jpg
 */
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const URL = 'http://localhost:3000/demos/ellison-reyes/index.html';
const OUT = 'assets/captures/ellison-reyes';
const PAGES = ['home', 'how', 'cost', 'locations', 'courts', 'wanted', 'start', 'pay', 'checkin', 'agents', 'staff', 'about'];
const HIDE = '[data-build="concept"]{display:none!important}';

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const ONLY_FULL = process.argv[2] === 'full';

async function open(viewport) {
  const mobile = viewport.width < 600;
  const context = await browser.newContext({ viewport, deviceScaleFactor: 2, isMobile: mobile, hasTouch: mobile });
  const page = await context.newPage();
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 90000 });
  await page.addStyleTag({ content: HIDE });
  return { context, page };
}

async function save(page, name) {
  const buf = await page.screenshot();
  await sharp(buf).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(OUT, `${name}.jpg`));
  console.log(`  ${name}`);
}

/** Walk the page so reveals and lazy images settle, then go back to the top. */
async function settle(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 100));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);
}

for (const [prefix, viewport, downCount] of ONLY_FULL ? [] : [
  ['desktop', { width: 1440, height: 900 }, 5],
  ['mobile', { width: 390, height: 844 }, 4],
]) {
  const { context, page } = await open(viewport);
  for (const id of PAGES) {
    await page.evaluate((h) => { location.hash = h; }, id);
    await page.waitForTimeout(600);
    await settle(page);
    await save(page, `${prefix}-${id}`);
  }

  await page.evaluate(() => { location.hash = 'home'; });
  await settle(page);
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = (height - viewport.height) / (downCount - 1);
  for (let i = 0; i < downCount; i += 1) {
    await page.evaluate((top) => window.scrollTo(0, top), Math.round(i * step));
    await page.mouse.wheel(0, 1);
    await page.waitForTimeout(900);
    await save(page, `${prefix}-${i}`);
  }
  await context.close();
}

/* The whole home page, top to bottom, at 1x. */
{
  const { context, page } = await open({ width: 1440, height: 900 });
  await settle(page);
  const buf = await page.screenshot({ fullPage: true });
  const meta = await sharp(buf).metadata();
  await sharp(buf)
    .extract({ left: 0, top: 0, width: meta.width, height: Math.min(meta.height, 18000) }) // 2x, so 9000 CSS px
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(OUT, 'full.jpg'));
  console.log('  full');
  await context.close();
}

/* Close-ups: each feature scrolled to just under the sticky header (feature-<name>.jpg). */
const FEATURES = [
  { name: 'calculator', page: 'home', f: 'Instant premium calculator' },
  { name: 'map', page: 'home', f: 'Live service map' },
  { name: 'agents', page: 'home', f: 'Agent directory · call, text or request' },
  { name: 'esign', page: 'start', f: 'E-sign bail application' },
  { name: 'pay', page: 'pay', f: 'Checkout with cards, wallets, Zelle, Cash App' },
  { name: 'checkin', page: 'checkin', f: 'Defendant check-in' },
  { name: 'courts', page: 'courts', f: 'Court date reminders' },
  { name: 'plan', page: 'cost', f: 'Payment plan builder' },
  { name: 'crm', page: 'staff', f: 'Trace Bail agency CRM' },
];

if (!ONLY_FULL) {
  const { context, page } = await open({ width: 1440, height: 900 });
  for (const { name, page: id, f } of FEATURES) {
    await page.evaluate((h) => { location.hash = h; }, id);
    await page.waitForTimeout(600);
    await settle(page);
    await page.evaluate((label) => {
      const el = [...document.querySelectorAll('[data-f]')].find(
        (e) => e.dataset.f === label && e.offsetParent !== null,
      );
      if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 110);
    }, f);
    await page.mouse.wheel(0, 1);
    await page.waitForTimeout(1200);
    await save(page, `feature-${name}`);
  }

  // The assistant, open on the home page.
  await page.evaluate(() => { location.hash = 'home'; window.scrollTo(0, 0); });
  await page.waitForTimeout(800);
  await page.click('#fab');
  await page.waitForTimeout(1500);
  await save(page, 'feature-chat');

  // The Spanish version.
  await page.keyboard.press('Escape');
  await page.click('[data-lang="es"]');
  await page.waitForTimeout(1000);
  await save(page, 'feature-spanish');
  await context.close();
}

await browser.close();
