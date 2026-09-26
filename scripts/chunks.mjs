/** Which JS a route actually downloads, gzipped, biggest first. */
import { chromium } from '@playwright/test';
import zlib from 'node:zlib';

const base = process.argv[2] ?? 'http://localhost:3100';
const route = `/${(process.argv[3] ?? 'ar').replace(/^\//, '')}`;

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const rows = [];

page.on('response', async (res) => {
  if (res.request().resourceType() !== 'script') return;
  const body = await res.body().catch(() => null);
  if (!body) return;
  rows.push({
    url: res.url().replace(base, ''),
    raw: body.length,
    gz: zlib.gzipSync(body, { level: 9 }).length,
    body,
  });
});

await page.goto(base + route, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

rows.sort((a, b) => b.gz - a.gz);
const totalGz = rows.reduce((s, r) => s + r.gz, 0);
const totalRaw = rows.reduce((s, r) => s + r.raw, 0);

const MARKERS = ['motion-dom', 'framer-motion', 'react-dom', 'scheduler', 'use-intl', 'next-intl', 'zod', '@vercel/analytics'];

console.log(`${route}  JS: ${(totalRaw / 1024).toFixed(0)}KB raw / ${(totalGz / 1024).toFixed(0)}KB gzip\n`);
for (const r of rows.slice(0, 12)) {
  const text = r.body.toString('utf8');
  const hits = MARKERS.filter((m) => text.includes(m));
  console.log(
    `${(r.gz / 1024).toFixed(1).padStart(7)}KB gz  ${(r.raw / 1024).toFixed(0).padStart(5)}KB raw  ` +
    `${r.url.split('/').pop()?.slice(0, 28).padEnd(30)} ${hits.join(', ')}`,
  );
}

await browser.close();
