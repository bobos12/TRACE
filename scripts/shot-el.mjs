/** Screenshot one element, for close inspection. */
import { chromium } from '@playwright/test';
const [, , base, route, selector, out, w = '1440', h = '900'] = process.argv;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: Number(w), height: Number(h) } });
const p = await ctx.newPage();
await p.goto(`${base}/${route.replace(/^\//, '')}`, { waitUntil: 'networkidle' });
await p.waitForTimeout(1800);
await p.locator(selector).first().screenshot({ path: out });
console.log('->', out);
await b.close();
