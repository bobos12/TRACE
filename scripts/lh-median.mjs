/** Run Lighthouse n times per route and report the median of each score. */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const routes = (process.argv[2] ?? '.').split(',');
const runs = Number(process.argv[3] ?? 3);
const form = process.argv[4] ?? 'mobile';
const median = (xs) => xs.slice().sort((a, b) => a - b)[Math.floor(xs.length / 2)];

for (const route of routes) {
  const scores = { perf: [], a11y: [], bp: [], seo: [], lcp: [], tbt: [] };
  for (let i = 0; i < runs; i++) {
    execFileSync('node', ['scripts/lighthouse.mjs', route, form], { stdio: 'ignore' });
    const slug = route === '.' ? 'home' : route.replace(/\//g, '-');
    const html = readFileSync(`shots/lighthouse/${slug}-${form}.html`, 'utf8');
    const lhr = JSON.parse(html.match(/window\.__LIGHTHOUSE_JSON__\s*=\s*(\{[\s\S]*?\});/)[1]);
    scores.perf.push(Math.round(lhr.categories.performance.score * 100));
    scores.a11y.push(Math.round(lhr.categories.accessibility.score * 100));
    scores.bp.push(Math.round(lhr.categories['best-practices'].score * 100));
    scores.seo.push(Math.round(lhr.categories.seo.score * 100));
    scores.lcp.push(Math.round(lhr.audits.metrics.details.items[0].largestContentfulPaint));
    scores.tbt.push(Math.round(lhr.audits.metrics.details.items[0].totalBlockingTime));
  }
  console.log(
    `/${route}  perf ${median(scores.perf)} (${scores.perf.join('/')})  ` +
    `a11y ${median(scores.a11y)}  bp ${median(scores.bp)}  seo ${median(scores.seo)}  ` +
    `LCP ${median(scores.lcp)}ms  TBT ${median(scores.tbt)}ms`,
  );
}
