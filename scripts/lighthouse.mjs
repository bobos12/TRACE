/**
 * Lighthouse against the production build.
 *
 *   npm run build && npx next start -p 3100
 *   node scripts/lighthouse.mjs                       # the home page, mobile
 *   node scripts/lighthouse.mjs .,work,services desktop
 *
 * Routes are written WITHOUT a leading slash — Git Bash rewrites those into
 * Windows paths before node sees them.
 */
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import { mkdir, writeFile } from 'node:fs/promises';

const BASE = process.env.LH_BASE ?? 'http://localhost:3100';
const routes = (process.argv[2] ?? '.').split(',').map((r) => (r === '.' ? '/' : `/${r.replace(/^\//, '')}`));
const formFactor = process.argv[3] === 'desktop' ? 'desktop' : 'mobile';

const desktop = {
  formFactor: 'desktop',
  screenEmulation: { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false },
  throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 },
};

const chrome = await launch({ chromeFlags: ['--headless=new', '--no-sandbox'] });
await mkdir('shots/lighthouse', { recursive: true });

const rows = [];

for (const route of routes) {
  const result = await lighthouse(
    BASE + route,
    { port: chrome.port, output: ['json', 'html'], logLevel: 'error' },
    {
      extends: 'lighthouse:default',
      settings: formFactor === 'desktop' ? desktop : {},
    },
  );

  if (!result) continue;
  const { lhr, report } = result;
  const slug = route === '/' ? 'home' : route.slice(1).replace(/\//g, '-');
  await writeFile(`shots/lighthouse/${slug}-${formFactor}.html`, report[1]);

  const score = (id) => Math.round((lhr.categories[id]?.score ?? 0) * 100);
  const metric = (id) => lhr.audits[id]?.displayValue ?? '—';

  rows.push({
    route,
    perf: score('performance'),
    a11y: score('accessibility'),
    bp: score('best-practices'),
    seo: score('seo'),
    LCP: metric('largest-contentful-paint'),
    TBT: metric('total-blocking-time'),
    CLS: metric('cumulative-layout-shift'),
  });

  // Anything that actually cost points.
  const failed = Object.values(lhr.audits).filter(
    (a) => a.score !== null && a.score < 0.9 && a.scoreDisplayMode !== 'informative',
  );
  if (failed.length) {
    console.log(`\n${route} (${formFactor}) — audits below 90:`);
    for (const a of failed.slice(0, 14)) {
      console.log(`  ${String(Math.round((a.score ?? 0) * 100)).padStart(3)}  ${a.title}`);
    }
  }
}

await chrome.kill();

console.log(`\n${formFactor.toUpperCase()}`);
console.table(rows);
const worst = Math.min(...rows.flatMap((r) => [r.perf, r.a11y, r.bp, r.seo]));
console.log(worst >= 95 ? '\nAll categories ≥ 95 ✓' : `\nLowest category: ${worst}`);
