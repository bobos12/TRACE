/**
 * Playwright screenshots for design review.
 *
 *   node scripts/screenshots.mjs                        # the home page
 *   node scripts/screenshots.mjs --pages=home,work      # specific routes
 *   node scripts/screenshots.mjs --themes=light,dark --out=shots/phase2
 *
 * Routes are written WITHOUT a leading slash (Git Bash rewrites those into
 * Windows paths) and without the locale prefix. `home` means the index.
 */
import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v = 'true'] = a.replace(/^--/, '').split('=');
    return [k, v];
  }),
);

const BASE = args.base ?? 'http://localhost:3000';
const OUT = args.out ?? 'shots';
const LOCALES = (args.locales ?? 'ar,en').split(',');
const WIDTHS = (args.widths ?? '390,1440').split(',').map(Number);
const ROUTES = (args.pages ?? 'home').split(',').map((r) => (r === 'home' || r === '.' ? '' : r.replace(/^\//, '')));
const THEMES = (args.themes ?? 'light').split(',');
const FULL = args.full !== 'false';

const slug = (r) => (r === '' ? 'home' : r.replace(/[/?=&]/g, '-'));

const browser = await chromium.launch();
await mkdir(OUT, { recursive: true });

let n = 0;
for (const theme of THEMES) {
  for (const locale of LOCALES) {
    for (const width of WIDTHS) {
      const context = await browser.newContext({
        viewport: { width, height: width < 700 ? 844 : 900 },
        deviceScaleFactor: 1,
        locale: locale === 'ar' ? 'ar-SA' : 'en-US',
        reducedMotion: args.reduced === 'true' ? 'reduce' : 'no-preference',
      });
      await context.addInitScript(
        ([t]) => {
          try {
            localStorage.setItem('athr-theme', t);
            sessionStorage.setItem('athr-logo-stamped', '1');
          } catch {}
        },
        [theme],
      );

      const page = await context.newPage();

      for (const route of ROUTES) {
        const url = `${BASE}/${locale}${route ? `/${route}` : ''}`;
        try {
          await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
        } catch {
          await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
        }

        // Walk the page so every scroll-triggered reveal fires, then return to
        // the top. Small steps on purpose: 0.75-viewport jumps outrun the
        // IntersectionObserver and some sections capture mid-reveal.
        await page.evaluate(async () => {
          const step = 320;
          for (let y = 0; y < document.body.scrollHeight; y += step) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 130));
          }
          window.scrollTo(0, 0);

          // A full-page capture resizes the viewport, which restarts CSS
          // animations — anything still inside its delay would be caught at
          // opacity 0. Zero every delay so they all settle on their end state.
          const settle = document.createElement('style');
          settle.textContent = '*,*::before,*::after{animation-delay:0s !important}';
          document.head.append(settle);

          await new Promise((r) => setTimeout(r, 900));
        });
        await page.waitForTimeout(900);

        const file = path.join(OUT, `${slug(route)}-${locale}-${theme}-${width}.png`);
        await page.screenshot({ path: file, fullPage: FULL });
        n += 1;
        console.log(file);
      }

      await context.close();
    }
  }
}

await browser.close();
console.log(`\n${n} screenshots → ${OUT}/`);
