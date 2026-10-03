/**
 * The constellation — each client's own mark: a 3×3 lattice of nuqtas (rhombi), cells 0–8 row-major.
 * Deterministic: the same name always gives the same mark. TRACE's own mark is the three-nuqta symbol arrangement.
 * Render each cell as a square rotated 45° (scale .7071), filled = ink, mark = vermilion, empty = hairline or hidden.
 */
export interface ConstellationCells { on: number[]; mark: number }

function fnv1a(s: string): number {
  let x = 2166136261;
  for (let i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 16777619); }
  return x >>> 0;
}

export function constellation(seed?: string): ConstellationCells {
  if (!seed || /^trace$/i.test(seed.trim())) return { on: [1, 3, 5], mark: 1 };
  let x = fnv1a(seed.trim().toLowerCase());
  const cells = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const on: number[] = [];
  const n = 3 + (x % 3);
  for (let i = 0; i < n; i++) {
    x = Math.imul(x ^ (x >>> 15), 2246822507) >>> 0;
    const [picked] = cells.splice(x % cells.length, 1);
    if (picked !== undefined) on.push(picked);
  }
  on.sort((a, b) => a - b);
  return { on, mark: on[(x >>> 7) % on.length] ?? on[0] ?? 0 };
}
