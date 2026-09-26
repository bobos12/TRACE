import { chromium } from '@playwright/test';
const base = process.argv[2] ?? 'http://localhost:3100';
const routes = (process.argv[3] ?? 'ar,en').split(',').map((r) => `/${r.replace(/^\//, '')}`);
const browser = await chromium.launch();
for (const route of routes) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const bad = [];
  page.on('response', (r) => { if (r.status() >= 400) bad.push(`${r.status()} ${r.url()}`); });
  await page.goto(base + route, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  console.log(route, bad.length ? '\n  ' + bad.join('\n  ') : '✓ no failed requests');
  await ctx.close();
}
await browser.close();
