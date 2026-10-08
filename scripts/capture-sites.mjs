/**
 * Real captures of the live client sites and products — the raw material for
 * the showcase slides (scripts/make-showcases.mjs).
 *
 *   node scripts/capture-sites.mjs            every site
 *   node scripts/capture-sites.mjs fateen     only slugs containing "fateen"
 *
 * Genuine screenshots of published work — never retouched, never mocked.
 * Output in assets/captures/<slug>/:
 *   desktop-0.jpg …   1440×900 viewports @2x, one per screen down the page
 *   mobile-0.jpg …    390×844 viewports @2x
 *   full.jpg          the whole desktop page @1x (capped), for the long-scroll strip
 */
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';

const OUT = 'assets/captures';

/** `hide`: chat widgets and cookie bars that would cover the work. */
const SITES = [
  { slug: 'future-earth-energy', url: 'https://fe-ksa.com/en', hide: ['[class*="chat" i]', '[class*="widget" i]', 'a[href$="/ar"]', 'a[href*="/ar/"]', 'a[hreflang="ar"]', 'button[aria-label*="lang" i]'] },
  { slug: 'fateen-website', url: 'https://fateenksa.com/', settle: 3000 },
  { slug: 'fateen-real-estate', url: 'https://fateenksa.com/RealState/' },
  { slug: 'fateen-ads', url: 'https://fateenksa.com/ads/' },
  { slug: 'fateen-web-development', url: 'https://fateenksa.com/web-development/' },
  { slug: 'fancystays', url: 'https://www.fancystays.net/' },
  { slug: 'retal-residence', url: 'https://retal-residence-landing.vercel.app/', settle: 2500 },
  { slug: 'elite-gpt', url: 'https://elitegpt.vercel.app/' },
  // TRACE's own concept site, served by `npm run dev` from public/demos/. The
  // concept notice is hidden because the portfolio labels the project itself.
  { slug: 'ironwood-bail-bonds', url: 'http://localhost:3000/demos/ironwood-bail-bonds/index.html', hide: ['[data-concept]'] },
];

const DESKTOP_SHOTS = 5;
const MOBILE_SHOTS = 4;
const FULL_MAX = 9000;

const only = process.argv[2];
const browser = await chromium.launch();

async function open(url, viewport, scale, hide = []) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: scale, isMobile: viewport.width < 600, hasTouch: viewport.width < 600 });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 }).catch(() => page.goto(url, { waitUntil: 'load', timeout: 90000 }));
  // Walk the page so lazy images and scroll reveals settle, then return.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  if (hide.length) await page.addStyleTag({ content: `${hide.join(',')}{display:none!important}` });
  await page.waitForTimeout(1500);
  return { context, page };
}

/** `settle`: how long to wait after each scroll, for sites whose sections reveal or style late. */
async function shots(page, viewport, prefix, count, dir, settle = 900) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = Math.max(viewport.height * 0.9, (height - viewport.height) / Math.max(count - 1, 1));
  for (let i = 0; i < count; i += 1) {
    const y = Math.min(Math.round(i * step), Math.max(height - viewport.height, 0));
    await page.evaluate((top) => window.scrollTo(0, top), y);
    // Nudge, so on-enter reveals fire for the section now in view.
    await page.mouse.wheel(0, 1);
    await page.waitForTimeout(settle);
    const buf = await page.screenshot();
    await sharp(buf).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(dir, `${prefix}-${i}.jpg`));
  }
}

for (const site of SITES) {
  if (only && !site.slug.includes(only)) continue;
  const dir = path.join(OUT, site.slug);
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
  try {
    const desktop = { width: 1440, height: 900 };
    const d = await open(site.url, desktop, 2, site.hide);
    await shots(d.page, desktop, 'desktop', DESKTOP_SHOTS, dir, site.settle);
    await d.context.close();

    const f = await open(site.url, desktop, 1, site.hide);
    const full = await f.page.screenshot({ fullPage: true });
    const meta = await sharp(full).metadata();
    await sharp(full)
      .extract({ left: 0, top: 0, width: meta.width, height: Math.min(meta.height, FULL_MAX) })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join(dir, 'full.jpg'));
    await f.context.close();

    const mobile = { width: 390, height: 844 };
    const m = await open(site.url, mobile, 2, site.hide);
    await shots(m.page, mobile, 'mobile', MOBILE_SHOTS, dir, site.settle);
    await m.context.close();
    console.log(`✓ ${site.slug}`);
  } catch (error) {
    console.log(`✗ ${site.slug}: ${error.message.split('\n')[0]}`);
  }
}

await browser.close();
