/**
 * Page thumbnails of the Ellison & Reyes demo for the /bail-bonds page strip:
 * the top of each page from capture-ellison.mjs, at 960×600 — except Wanted,
 * which shows its poster wall (feature-wanted) rather than the page title.
 *
 *   node scripts/capture-ellison.mjs     (first, with npm run dev)
 *   node scripts/make-ellison-pages.mjs
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const IN = 'assets/captures/ellison-reyes';
const OUT = 'public/images/ellison-reyes/pages';
const SOURCE = { wanted: 'feature-wanted' };
const PAGES = ['home', 'how', 'cost', 'locations', 'courts', 'wanted', 'start', 'pay', 'checkin', 'agents', 'staff', 'about'];

await mkdir(OUT, { recursive: true });
for (const id of PAGES) {
  await sharp(path.join(IN, `${SOURCE[id] ?? `desktop-${id}`}.jpg`))
    .resize(960, 600)
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(path.join(OUT, `${id}.jpg`));
  console.log(`  ${id}`);
}
