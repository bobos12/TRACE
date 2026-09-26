/**
 * Fonts for the OG images.
 *
 * next/og (satori) reads neither WOFF2 nor *variable* fonts, and the brand
 * ships Instrument Sans as a variable WOFF2. So this:
 *   1. decompresses the three faces the OG images need to TTF, and
 *   2. instances Instrument Sans to a static weight 600 (needs Python +
 *      fontTools — `pip install fonttools`).
 *
 *   npm run og:fonts
 *
 * The output lives in assets/og-fonts/ — outside public/, so it is never served
 * to browsers — and is committed, so deploys never need Python. Re-run this
 * only if the files in public/fonts/ change.
 */
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { decompress } from 'wawoff2';

const FACES = [
  'InstrumentSans-Variable',
  'IBMPlexMono-500',
  'IBMPlexSansArabic-600',
];

const outDir = path.join(process.cwd(), 'assets/og-fonts');
await mkdir(outDir, { recursive: true });

for (const face of FACES) {
  const woff2 = await readFile(path.join(process.cwd(), 'public/fonts', `${face}.woff2`));
  const ttf = await decompress(woff2);
  const out = path.join(outDir, `${face}.ttf`);
  await writeFile(out, Buffer.from(ttf));
  console.log(`${face}.woff2 -> ${face}.ttf  (${(ttf.length / 1024).toFixed(0)}KB)`);
}

// Instance the variable face; satori cannot parse `fvar`.
const python = ['python', 'python3', 'py'].find(
  (bin) => spawnSync(bin, ['--version'], { stdio: 'ignore' }).status === 0,
);

if (!python) {
  console.error('Python not found. assets/og-fonts/InstrumentSans-600.ttf was not regenerated.');
  console.error('Install Python + fonttools, or keep the committed copy.');
  process.exit(1);
}

const result = spawnSync(python, ['scripts/instance-variable-font.py'], { stdio: 'inherit' });
if (result.status !== 0) process.exit(result.status ?? 1);

// The variable TTF is only an intermediate; satori must never load it.
await rm(path.join(outDir, 'InstrumentSans-Variable.ttf'), { force: true });
