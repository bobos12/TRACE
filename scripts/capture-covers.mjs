/**
 * Capture real screenshots of the live projects for the portfolio.
 *
 *   node scripts/capture-covers.mjs              every site
 *   node scripts/capture-covers.mjs fateen       only slugs containing "fateen"
 *
 * These are genuine captures of published work — not mockups, and never
 * fabricated. Anything without a live URL gets a brand cover instead, from
 * `make-brand-covers.mjs`, which is clearly a graphic rather than a screenshot.
 *
 * Output, all 2400×1500 (the 16:10 every card and case-study hero is built
 * around — large enough to stay sharp at the 1280px case-study cover), in public/images/portfolio/:
 *   <slug>.jpg     the top of the page — the cover
 *   <slug>-2.jpg   one viewport down
 *   <slug>-3.jpg   two viewports down     — the case-study gallery
 */
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';

const OUT = 'public/images/portfolio';
const TMP = 'shots/.covers';

/**
 * `shots` is how many frames down the page are worth keeping.
 * `hide` takes CSS selectors to remove before shooting — the site's own nav and
 * floating buttons, where the cover should show the brand rather than the chrome.
 * `conceal` makes elements invisible but keeps their space, so the layout holds.
 */
const SITES = [
  { slug: 'future-earth-energy', url: 'https://future-earth-showcase.vercel.app/ar', shots: 3 },
  { slug: 'retal-residence', url: 'https://retal-residence-landing.vercel.app/', shots: 3 },
  { slug: 'najm-alithar-travel', url: 'https://najmalithar.org/', shots: 3 },
  { slug: 'cartest-auto', url: 'https://www.cartest-auto.com/', shots: 3 },
  { slug: 'fateen-web-development', url: 'https://fateenksa.com/web-development/', shots: 3 },
  { slug: 'abu-mayar-store', url: 'https://abu-mayar-lilthabayih-sa.com/', shots: 3 },
  { slug: 'albadar-oud-store', url: 'https://albadar-oud.com/', shots: 3 },
  { slug: 'elite-gpt', url: 'https://elitegpt.vercel.app/', shots: 2 },
  { slug: 'dryussif', url: 'https://dryussif.id/', shots: 3 },
  {
    slug: 'fateen-mark',
    url: 'https://fateenksa.com/',
    shots: 1,
    hide: ['header.ct-header', '.call-btn', '.whatsapp-btn'],
    // The hero's title, tagline and buttons go too: the cover is the mark alone.
    conceal: ['.elementor-element-1e44750', '.elementor-element-970d2f6', '.elementor-element-f35d53b'],
  },
  { slug: 'fateen-real-estate', url: 'https://fateenksa.com/RealState/', shots: 3 },
  { slug: 'fateen-ads', url: 'https://fateenksa.com/ads/', shots: 3 },
  { slug: 'fancystays', url: 'https://www.fancystays.net/', shots: 3 },
  { slug: 'basmah-jomah', url: 'https://basmah-jomah.com/', shots: 3 },
  { slug: 'bayanjw', url: 'https://bayanjw.com/', shots: 3 },
  { slug: 'aatakunited', url: 'https://aatakunited.com/', shots: 3 },
];

const only = process.argv.slice(2);
const targets = only.length ? SITES.filter((s) => only.some((o) => s.slug.includes(o))) : SITES;

await mkdir(OUT, { recursive: true });
await mkdir(TMP, { recursive: true });

const browser = await chromium.launch();
const results = [];

for (const site of targets) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  try {
    await page.goto(site.url, { waitUntil: 'networkidle', timeout: 45000 });
    // Let fonts, hero images and any entrance animation settle.
    await page.evaluate(async () => {
      window.scrollTo(0, 300);
      await new Promise((r) => setTimeout(r, 600));
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 400));
    });
    await page.waitForTimeout(2500);
    if (site.hide?.length || site.conceal?.length) {
      const css = [
        site.hide?.length ? `${site.hide.join(',')}{display:none!important}` : '',
        site.conceal?.length ? `${site.conceal.join(',')}{visibility:hidden!important}` : '',
      ].join('');
      await page.addStyleTag({ content: css });
      await page.waitForTimeout(600);
    }

    for (let i = 0; i < site.shots; i += 1) {
      if (i > 0) {
        // One viewport at a time, so every reveal on the page has fired.
        const reached = await page.evaluate(async (target) => {
          window.scrollTo(0, target);
          await new Promise((r) => setTimeout(r, 1600));
          return Math.round(window.scrollY);
        }, i * 860);
        // A short page simply stops moving — don't save the same frame twice.
        if (reached < i * 860 - 200) break;
      }

      const raw = path.join(TMP, `${site.slug}-${i}.png`);
      await page.screenshot({ path: raw });

      const name = i === 0 ? `${site.slug}.jpg` : `${site.slug}-${i + 1}.jpg`;
      await sharp(raw)
        .extract({ left: 0, top: 0, width: 2880, height: 1800 })
        .resize(2400, 1500)
        .jpeg({ quality: 86, mozjpeg: true })
        .toFile(path.join(OUT, name));

      results.push(`✓ ${name}`);
    }
  } catch (error) {
    results.push(`✗ ${site.slug} — ${String(error).split('\n')[0].slice(0, 90)}`);
  }

  await context.close();
}

await browser.close();
await rm(TMP, { recursive: true, force: true });

console.log(results.join('\n'));
