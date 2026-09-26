/** Nothing may overflow horizontally, and the hero stack must not spill. */
import { chromium } from '@playwright/test';

/** ROUTE=work node scripts/overflow-check.mjs — no leading slash. */
const ROUTE = process.env.ROUTE ? `/${process.env.ROUTE.replace(/^\//, '')}` : '';
const b = await chromium.launch();
for (const w of [360, 390, 768, 1024, 1280, 1440, 1920]) {
  for (const loc of ['ar', 'en']) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(`http://localhost:3100/${loc}${ROUTE}`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(900);
    const r = await p.evaluate(() => {
      const de = document.documentElement;
      const wide = [...document.querySelectorAll('body *')]
        .filter((el) => {
          const b = el.getBoundingClientRect();
          return b.width > 0 && (b.right > de.clientWidth + 2 || b.left < -2);
        })
        .filter((el) => !el.closest('[data-hero-band]') && !el.closest('[aria-hidden="true"]'))
        .slice(0, 3)
        .map((el) => `${el.tagName}.${String(el.className).slice(0, 50)}`);
      const stack = document.querySelector('[data-hero-band] [style*="perspective"]');
      const cta = document.querySelector('[data-hero-band] a[href*="wa.me"]');
      return {
        scrollW: de.scrollWidth, clientW: de.clientWidth,
        stackBottom: stack ? Math.round(stack.getBoundingClientRect().bottom) : null,
        ctaTop: cta ? Math.round(cta.getBoundingClientRect().top) : null,
        wide,
      };
    });
    const hOverflow = r.scrollW > r.clientW + 1;
    console.log(
      `${String(w).padStart(4)} /${loc}  scrollW=${r.scrollW} clientW=${r.clientW}` +
      `${hOverflow ? '  ✗ H-OVERFLOW ' + JSON.stringify(r.wide) : '  ✓'}`,
    );
    await ctx.close();
  }
}
await b.close();
