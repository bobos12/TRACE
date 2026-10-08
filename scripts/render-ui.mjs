/**
 * Product screens for the site, rendered from the approved reference pages.
 *
 *   node scripts/render-ui.mjs
 *
 * Every image in public/images/ui/ comes from design/reference/pages/*.html, in
 * light and dark, at 2x. Edit the demo data in those pages, then re-run this —
 * never retouch the PNGs by hand.
 */
import { chromium } from '@playwright/test';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const PAGES = path.resolve('design/reference/pages');
const OUT = path.resolve('public/images/ui');

const url = (file, theme) =>
  `${pathToFileURL(path.join(PAGES, file)).href}${theme === 'dark' ? '#dark' : ''}`;

const HIDE = '#athr-theme{display:none!important}';
const CLEAR = 'html,body,.stage{background:transparent!important}';

const browser = await chromium.launch();

for (const theme of ['light', 'dark']) {
  const shoot = async (file, viewport, out) => {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 2 });
    await page.goto(url(file, theme));
    await page.addStyleTag({ content: HIDE });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(OUT, out), clip: { x: 0, y: 0, ...viewport } });
    await page.close();
    console.log(out);
  };

  await shoot('saas-dashboard.html', { width: 1440, height: 1010 }, `dashboard-${theme}.png`);
  await shoot('home-en.html', { width: 1440, height: 900 }, `website-home-en-${theme}.png`);
  // The concept projects keep their own freight screens, apart from the bail product.
  await shoot('freight-dashboard.html', { width: 1440, height: 1010 }, `freight-dashboard-${theme}.png`);
  await shoot('case-study.html', { width: 1280, height: 900 }, `case-study-${theme}.png`);

  // Phones: element shots on a transparent ground, rounded corners kept.
  for (const [file, prefix] of [['mobile-app.html', 'mobile'], ['freight-mobile.html', 'freight-mobile']]) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
    await page.goto(url(file, theme));
    await page.addStyleTag({ content: HIDE + CLEAR });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);
    const phones = page.locator('.phone');
    const names = ['splash', 'home-en', 'approve'].map((n) => `${prefix}-${n}`);
    for (let i = 0; i < names.length; i += 1) {
      const out = `${names[i]}-${theme}.png`;
      await phones.nth(i).screenshot({ path: path.join(OUT, out), omitBackground: true });
      console.log(out);
    }
    await page.close();
  }
}

await browser.close();
