/** Capture a viewport screenshot at a given scroll fraction — for pinned sections. */
import { chromium } from '@playwright/test';
const [, , base, route, fraction, out, w = '1440', h = '900'] = process.argv;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: Number(w), height: Number(h) } });
const p = await ctx.newPage();
await p.goto(`${base}/${route.replace(/^\//, '')}`, { waitUntil: 'networkidle' });
await p.evaluate(async (f) => {
  const target = document.body.scrollHeight * Number(f);
  const step = 400;
  for (let y = 0; y < target; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 40));
  }
  window.scrollTo(0, target);
}, fraction);
await p.waitForTimeout(1200);
await p.screenshot({ path: out });
console.log('->', out);
await b.close();
