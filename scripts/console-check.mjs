/**
 * Fail the review if any page logs an error or warning in either locale.
 *
 *   node scripts/console-check.mjs                      # home only
 *   node scripts/console-check.mjs work,about,contact   # specific routes
 *
 * Routes are written WITHOUT a leading slash — Git Bash on Windows rewrites
 * those into Windows paths before node ever sees them.
 */
import { chromium } from '@playwright/test';

const BASE = process.env.BASE ?? 'http://localhost:3000';

const routes = (process.argv[2] ?? '')
  .split(',')
  .filter(Boolean)
  .map((r) => (r === 'home' ? '' : `/${r.replace(/^\//, '')}`));
const paths = routes.length ? routes : [''];

const browser = await chromium.launch();
let problems = 0;

for (const locale of ['en', 'ar']) {
  for (const route of paths) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    const messages = [];

    page.on('console', (m) => {
      if (m.type() === 'error' || m.type() === 'warning') messages.push(`[${m.type()}] ${m.text()}`);
    });
    page.on('pageerror', (e) => messages.push(`[pageerror] ${e.message}`));

    await page.goto(`${BASE}/${locale}${route}`, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1000);

    if (messages.length) problems += messages.length;
    console.log(`/${locale}${route || '/'}  ${messages.length ? '\n  ' + messages.join('\n  ') : '✓ clean'}`);

    await context.close();
  }
}

await browser.close();
console.log(problems ? `\n${problems} console problem(s)` : '\nAll clean.');
process.exit(problems ? 1 : 0);
