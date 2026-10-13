/**
 * The case-study pages' screens: genuine captures (scripts/capture-sites.mjs,
 * scripts/capture-ellison.mjs) and real product renders, copied and sized for
 * the web into public/images/work/<slug>/.
 *
 *   node scripts/make-case-assets.mjs            every project
 *   node scripts/make-case-assets.mjs fancy      slugs containing "fancy"
 *
 * Writes row-<n>.jpg (desktop screens, 2400 wide), phone-<n>.jpg (the phone
 * beside row n), m-<n>.jpg (phone screens, 780 wide) and full.jpg (the whole
 * page, 1200 wide, for the scroll-through). portfolio.json → media points here.
 * Nothing is retouched.
 */
import sharp from 'sharp';
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';

const CAP = 'assets/captures';
const OUT = 'public/images/work';

const cap = (slug, name) => path.join(CAP, slug, `${name}.jpg`);
const ui = (name) => path.join('public/images/ui', name);
const slide = (name) => path.join('public/images/portfolio', name);

/** rows: [desktop, phone?]; mobiles: phone screens; full: the whole page. */
const PROJECTS = {
  'ellison-reyes': {
    rows: [
      [cap('ellison-reyes', 'feature-calculator'), cap('ellison-reyes', 'mobile-cost')],
      [cap('ellison-reyes', 'feature-esign'), cap('ellison-reyes', 'mobile-start')],
      [cap('ellison-reyes', 'feature-pay'), cap('ellison-reyes', 'mobile-pay')],
      [cap('ellison-reyes', 'desktop-staff')],
    ],
    mobiles: ['mobile-home', 'mobile-locations', 'mobile-checkin', 'mobile-agents'].map((m) => cap('ellison-reyes', m)),
    full: cap('ellison-reyes', 'full'),
  },
  'ironwood-bail-bonds': {
    rows: [
      [cap('ironwood-bail-bonds', 'desktop-0'), cap('ironwood-bail-bonds', 'mobile-0')],
      [cap('ironwood-bail-bonds', 'desktop-1')],
      [cap('ironwood-bail-bonds', 'desktop-2'), cap('ironwood-bail-bonds', 'mobile-2')],
      [cap('ironwood-bail-bonds', 'desktop-3')],
    ],
    mobiles: [0, 1, 2, 3].map((i) => cap('ironwood-bail-bonds', `mobile-${i}`)),
    full: cap('ironwood-bail-bonds', 'full'),
  },
  'trace-bail': {
    rows: [
      [ui('dashboard-light.png'), ui('mobile-home-en-light.png')],
      [ui('dashboard-dark.png'), ui('mobile-approve-light.png')],
    ],
    mobiles: ['mobile-splash-dark.png', 'mobile-home-en-light.png', 'mobile-approve-light.png', 'mobile-home-en-dark.png'].map(ui),
  },
  'future-earth-energy': {
    rows: [
      [cap('future-earth-energy', 'desktop-0'), cap('future-earth-energy', 'mobile-0')],
      [cap('future-earth-energy', 'desktop-1'), cap('future-earth-energy', 'mobile-1')],
      [cap('future-earth-energy', 'desktop-2')],
      [cap('future-earth-energy', 'desktop-3')],
    ],
    mobiles: [0, 1, 2, 3].map((i) => cap('future-earth-energy', `mobile-${i}`)),
    full: cap('future-earth-energy', 'full'),
  },
  'whatsapp-crm': {
    rows: [[slide('whatsapp-crm-3.jpg')], [slide('whatsapp-crm-4.jpg')], [slide('whatsapp-crm-5.jpg')], [slide('whatsapp-crm-8.jpg')]],
    mobiles: [],
  },
  fancystays: {
    rows: [
      [cap('fancystays', 'desktop-0'), cap('fancystays', 'mobile-0')],
      [cap('fancystays', 'desktop-1'), cap('fancystays', 'mobile-1')],
      [cap('fancystays', 'desktop-2')],
    ],
    mobiles: [0, 1, 2, 3].map((i) => cap('fancystays', `mobile-${i}`)),
    full: cap('fancystays', 'full'),
  },
};

const only = process.argv[2];

async function write(src, file, width, quality = 82) {
  await sharp(src).resize({ width, withoutEnlargement: true }).jpeg({ quality, mozjpeg: true }).toFile(file);
}

for (const [slug, p] of Object.entries(PROJECTS)) {
  if (only && !slug.includes(only)) continue;
  const dir = path.join(OUT, slug);
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });

  for (const [i, [desktop, phone]] of p.rows.entries()) {
    await write(desktop, path.join(dir, `row-${i + 1}.jpg`), 2400);
    if (phone) await write(phone, path.join(dir, `phone-${i + 1}.jpg`), 780);
  }
  for (const [i, m] of p.mobiles.entries()) await write(m, path.join(dir, `m-${i + 1}.jpg`), 780);
  if (p.full) await write(p.full, path.join(dir, 'full.jpg'), 1200, 78);
  console.log(`✓ ${slug}`);
}
