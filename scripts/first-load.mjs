/**
 * First-load JS only: everything requested before the load event fires.
 * Next prefetches visible <Link>s afterwards, which inflates any measurement
 * that waits for networkidle.
 */
import { chromium } from '@playwright/test';
import zlib from 'node:zlib';

const base = process.argv[2] ?? 'http://localhost:3100';
const routes = (process.argv[3] ?? '').split(',').map((r) => `/${r.replace(/^\//, '')}`);

const browser = await chromium.launch();

for (const route of routes) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  let loaded = false;
  const before = [];

  page.on('load', () => {
    loaded = true;
  });
  page.on('response', async (res) => {
    if (loaded) return;
    const type = res.request().resourceType();
    if (type !== 'script' && type !== 'stylesheet') return;
    const body = await res.body().catch(() => null);
    if (!body) return;
    before.push({ type, gz: zlib.gzipSync(body, { level: 9 }).length, raw: body.length });
  });

  await page.goto(base + route, { waitUntil: 'load' });

  const js = before.filter((r) => r.type === 'script');
  const css = before.filter((r) => r.type === 'stylesheet');
  const sum = (a, k) => a.reduce((s, r) => s + r[k], 0);

  console.log(
    `${route.padEnd(26)} JS ${(sum(js, 'gz') / 1024).toFixed(0)}KB gz ` +
      `(${(sum(js, 'raw') / 1024).toFixed(0)}KB raw, ${js.length} files)   ` +
      `CSS ${(sum(css, 'gz') / 1024).toFixed(0)}KB gz`,
  );

  await context.close();
}

await browser.close();
