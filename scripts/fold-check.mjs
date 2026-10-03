/** Is the hero's Book-a-call CTA above the fold on a 390×844 screen? */
import { chromium } from '@playwright/test';
const b = await chromium.launch();
for (const loc of ['en']) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  await p.goto(`http://localhost:3100/`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1200);
  const r = await p.evaluate(() => {
    const cta = document.querySelector('[data-hero-band] a[class*="h-13"]');
    const box = cta?.getBoundingClientRect();
    return {
      ctaBottom: box ? Math.round(box.bottom) : null,
      viewport: window.innerHeight,
      heroH: Math.round(document.querySelector('[data-hero-band]')?.getBoundingClientRect().height ?? 0),
      overflowX: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
  console.log(loc, JSON.stringify(r), r.ctaBottom && r.ctaBottom <= r.viewport ? '✓ above fold' : '✗ BELOW FOLD');
  await ctx.close();
}
await b.close();
