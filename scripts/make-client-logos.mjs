/**
 * Client logos for the trust strip, in colour.
 *
 *   node scripts/make-client-logos.mjs            every logo
 *   node scripts/make-client-logos.mjs bayanjw    only the slugs named
 *
 * The originals in assets/clients-src/ were taken from each client's own live
 * site, in every format. Each is split into two layers that share one trim box:
 *
 *   <slug>-color.png  the brand's coloured pixels, kept as they are
 *   <slug>-ink.png    the neutral pixels (black, white, grey) as an alpha mask
 *
 * The strip paints the ink mask with the `--ink` token and lays the colour on
 * top, so a logo keeps its brand colours while its black or white lettering
 * flips with the theme — a white wordmark would vanish on paper, a black one
 * on carbon. The split is soft (chroma and brightness ramps), so there is no
 * seam where a colour meets its outline.
 *
 * `whole` keeps a self-contained badge entirely in colour: its white lettering
 * sits on its own disc, not on the page, so it must not follow the theme.
 *
 * `bg` removes a background the source was saved with:
 *   white     a logo on a white card (JPEG)
 *   sample    a logo on a solid tile — the corner colour is removed
 *
 * Writes the trimmed size back to content/trust.json, and `color: null` where a
 * logo has no colour at all.
 */
import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const SRC = 'assets/clients-src';
const OUT = 'public/clients';
const TRUST = 'content/trust.json';
const HEIGHT = 240;

const LOGOS = [
  { slug: 'fateen', file: 'fateen.svg' },
  { slug: 'future-earth-energy', file: 'future-earth.png' },
  { slug: 'retal-residence', file: 'retal-residence.png' },
  { slug: 'najm-alithar-travel', file: 'najm-alithar.jpg', bg: 'white' },
  { slug: 'cartest-auto', file: 'cartest-auto.png' },
  { slug: 'albadar-oud-store', file: 'albadar-oud.png' },
  { slug: 'abu-mayar-store', file: 'abu-mayar.png', whole: true },
  { slug: 'fancystays', file: 'fancy-stays.png', bg: 'sample' },
  { slug: 'basmah-jomah', file: 'basmah-jomah.png' },
  { slug: 'bayanjw', file: 'bayan.png' },
  { slug: 'aatakunited', file: 'aatak-united.png' },
];

const clamp = (v) => Math.min(1, Math.max(0, v));
const ramp = (lo, hi, v) => clamp((v - lo) / (hi - lo));

const only = process.argv.slice(2);
const targets = only.length ? LOGOS.filter((l) => only.includes(l.slug)) : LOGOS;

await mkdir(OUT, { recursive: true });
const trust = JSON.parse(await readFile(TRUST, 'utf8'));

for (const logo of targets) {
  const { data, info } = await sharp(`${SRC}/${logo.file}`, { density: 600 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const n = width * height;

  const [br, bg, bb] = [data[8 * 4], data[8 * 4 + 1], data[8 * 4 + 2]];
  const color = Buffer.alloc(n * 4);
  const ink = Buffer.alloc(n * 4);
  let minX = width, minY = height, maxX = -1, maxY = -1, colourful = 0;

  for (let i = 0; i < n; i += 1) {
    const [r, g, b] = [data[i * 4], data[i * 4 + 1], data[i * 4 + 2]];
    let a = data[i * 4 + 3] / 255;

    if (logo.bg === 'white') a *= ramp(0, 30, 255 - Math.min(r, g, b));
    if (logo.bg === 'sample') a *= ramp(20, 60, Math.hypot(r - br, g - bg, b - bb));

    // Colour needs both chroma and some light: a navy or maroon so dark it
    // reads as black belongs to the ink, or it disappears on carbon.
    const max = Math.max(r, g, b);
    const w = logo.whole ? 1 : ramp(25, 60, max - Math.min(r, g, b)) * ramp(70, 110, max);

    color[i * 4] = r;
    color[i * 4 + 1] = g;
    color[i * 4 + 2] = b;
    color[i * 4 + 3] = Math.round(255 * a * w);
    ink[i * 4] = ink[i * 4 + 1] = ink[i * 4 + 2] = 255;
    ink[i * 4 + 3] = Math.round(255 * a * (1 - w));

    if (a * w > 0.5) colourful += 1;
    if (a > 0.04) {
      const x = i % width, y = Math.floor(i / width);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  const box = { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
  const layer = (buf) =>
    sharp(buf, { raw: { width, height, channels: 4 } })
      .extract(box)
      .resize({ height: HEIGHT })
      .png({ compressionLevel: 9 });

  const hasColour = colourful > n * 0.002;
  await layer(ink).toFile(`${OUT}/${logo.slug}-ink.png`);
  if (hasColour) await layer(color).toFile(`${OUT}/${logo.slug}-color.png`);

  const meta = await sharp(`${OUT}/${logo.slug}-ink.png`).metadata();
  const entry = trust.clients.find((c) => c.slug === logo.slug);
  if (entry) {
    entry.ink = `/clients/${logo.slug}-ink.png`;
    entry.color = hasColour ? `/clients/${logo.slug}-color.png` : null;
    entry.width = meta.width;
    entry.height = meta.height;
    delete entry.logo;
  }
  console.log(`✓ ${logo.slug}  ${meta.width}×${meta.height}${hasColour ? '  + colour' : '  (ink only)'}`);
}

await writeFile(TRUST, JSON.stringify(trust, null, 2) + '\n');
