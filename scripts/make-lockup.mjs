/**
 * The stacked lockup: the three-nuqta symbol above the TRACE letters.
 *
 *   node scripts/make-lockup.mjs
 *
 * Writes public/brand/trace-lockup-stacked*.svg. The letters are the
 * wordmark's own outlines (its first path), without the nuqtas over the A —
 * the symbol above takes their place, so the dots never appear twice. The
 * symbol is centred on the apex of the A (x = 1731), as in the wordmark, and
 * keeps the symbol's proportions: side nuqtas 0.627 × the diagonal away.
 */
import { readFile, writeFile } from 'node:fs/promises';

const src = await readFile('public/brand/trace-wordmark.svg', 'utf8');
const letters = src.match(/<path fill="[^"]+" d="([^"]+)"/)[1];

const W = 3450; // wordmark width
const CAP_TOP = 330.97; // top of the letters in the wordmark's own space
const CAP_BOTTOM = 1050.97;
const APEX = 1731;

const D = 488; // one nuqta's diagonal
const h = D / 2;
const step = D * 0.627;
const GAP = 300; // symbol to cap height

const top = { x: APEX, y: h };
const left = { x: APEX - step, y: h + step };
const right = { x: APEX + step, y: h + step };
const symbolBottom = h + step + h;
const shift = symbolBottom + GAP - CAP_TOP;
const H = Math.ceil(CAP_BOTTOM + shift);

const rhombus = ({ x, y }) =>
  `M${x.toFixed(2)} ${(y - h).toFixed(2)}L${(x + h).toFixed(2)} ${y.toFixed(2)}L${x.toFixed(2)} ${(y + h).toFixed(2)}L${(x - h).toFixed(2)} ${y.toFixed(2)}Z`;

const lockup = ({ ink, mark, dots = ink }) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="TRACE"><title>TRACE</title>` +
  `<path fill="${mark}" d="${rhombus(top)}"/><path fill="${dots}" d="${rhombus(left)}"/><path fill="${dots}" d="${rhombus(right)}"/>` +
  `<path fill="${ink}" transform="translate(0 ${shift.toFixed(2)})" d="${letters}"/></svg>\n`;

const VARIANTS = {
  'trace-lockup-stacked.svg': { ink: '#14130F', mark: '#E0461F' }, // on paper
  'trace-lockup-stacked-reverse.svg': { ink: '#F4F1E9', mark: '#FF5A33' }, // on carbon
  'trace-lockup-stacked-accent.svg': { ink: '#14130F', mark: '#E0461F', dots: '#E0461F' }, // all-vermilion symbol
  'trace-lockup-stacked-mono.svg': { ink: '#14130F', mark: '#14130F' },
  'trace-lockup-stacked-reverse-mono.svg': { ink: '#F4F1E9', mark: '#F4F1E9' },
};

for (const [file, colours] of Object.entries(VARIANTS)) {
  await writeFile(`public/brand/${file}`, lockup(colours));
  console.log(`✓ public/brand/${file}`);
}
