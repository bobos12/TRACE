/**
 * The three nuqtas of ث, on their own — the mark reduced to its dots.
 *
 * Same outlines as the logo (AthrMark / starters/Logo.tsx). The two lower dots
 * hold steady in ink; the upper one is the vermilion nuqta and breathes — a
 * slow fade out and back, then a quick electric flicker — with a soft glow
 * pulsing behind it. Opacity only, and still under reduced motion (see
 * `.at-breathe` in globals.css).
 *
 * A server component: the loop is pure CSS.
 */
const TOP = 'M556 200.43L614 258.43L556 316.43L498 258.43Z';
const LOWER = [
  'M483.86 272.57L541.86 330.57L483.86 388.57L425.86 330.57Z',
  'M628.14 272.57L686.14 330.57L628.14 388.57L570.14 330.57Z',
];

export function BreathingNuqtas({
  className,
  glowId = 'nuqta-glow',
}: {
  className?: string;
  /** Unique per page if the mark appears twice. */
  glowId?: string;
}) {
  return (
    <svg viewBox="396 150 320 268" aria-hidden="true" className={className}>
      <defs>
        <filter id={glowId} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>

      {LOWER.map((d) => (
        <path key={d} d={d} fill="currentColor" />
      ))}

      <path d={TOP} fill="var(--vermilion)" filter={`url(#${glowId})`} className="at-breathe-glow" />
      <path d={TOP} fill="var(--vermilion)" className="at-breathe" />
    </svg>
  );
}

export default BreathingNuqtas;
