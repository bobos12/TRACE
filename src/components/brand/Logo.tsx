/**
 * ATHR logo — exact outlines (Instrument Sans SemiBold / IBM Plex Sans Arabic
 * SemiBold, converted to paths), from starters/Logo.tsx.
 * Letters use currentColor; the three nuqtas use var(--vermilion).
 * Every nuqta path carries data-nuqta="0|1|2" so they can be stamped in.
 * Do not retype the name in a font or move the nuqtas — docs/brand-guidelines/03-logo.md.
 */
import type { ReactElement, SVGProps } from 'react';

const LATIN = {
  w: 2735,
  h: 1050.97,
  word: 'M0 1050.97 265 330.97H413L677 1050.97H543L481 871.97H190L128 1050.97ZM336 449.97 226 767.97H446ZM890 1050.97V433.97H651V330.97H1259V433.97H1020V1050.97ZM1385 1050.97V330.97H1515V624.97H1856V330.97H1986V1050.97H1856V726.97H1515V1050.97ZM2143 1050.97V330.97H2447Q2524 330.97 2581 356.97Q2638 382.97 2668.5 429.97Q2699 476.97 2699 539.97Q2699 601.97 2668.5 648.97Q2638 695.97 2581 721.97Q2524 747.97 2447 747.97H2443L2735 1050.97H2555L2291 747.97H2273V1050.97ZM2273 648.97H2443Q2506 648.97 2539.5 619.97Q2573 590.97 2573 539.97Q2573 488.97 2540 461.47Q2507 433.97 2443 433.97H2273Z',
  dots: [
    'M1318.5 0L1388.5 70L1318.5 140L1248.5 70Z',
    'M1231.53 86.97L1301.53 156.97L1231.53 226.97L1161.53 156.97Z',
    'M1405.47 86.97L1475.47 156.97L1405.47 226.97L1335.47 156.97Z',
  ],
};

const ARABIC = {
  w: 918,
  h: 1167,
  word: 'M0 1036H39Q135 1036 176 992.5Q217 949 216 866Q216 841 213 813.5Q210 786 205 757L184 630L281 614L296 702Q305 752 308 796H401V900L374 927H308Q301 981 281 1025Q261 1069 228 1100.5Q195 1132 148 1149.5Q101 1167 40 1167H0ZM374 823 401 796H426Q496 796 522.5 781.5Q549 767 549 729Q549 713 546.5 688.5Q544 664 537 623L521 533L619 517L633 607Q638 641 641 673.5Q644 706 644 729Q644 831 592 879Q540 927 426 927H374ZM750 309H857V927H750ZM690 154H730L731 150Q712 128 712 97Q712 56 741.5 29Q771 2 816 2Q843 2 869.5 14Q896 26 913 46L868 107Q845 83 816 83Q799 83 788 91.5Q777 100 777 112Q777 148 847 148H918V229H690Z',
  dots: [
    'M556 200.43L614 258.43L556 316.43L498 258.43Z',
    'M483.86 272.57L541.86 330.57L483.86 388.57L425.86 330.57Z',
    'M628.14 272.57L686.14 330.57L628.14 388.57L570.14 330.57Z',
  ],
};

const SYMBOL = {
  w: 450.91,
  h: 325.46,
  dots: [
    'M225.46 -0L325.46 100L225.46 200L125.46 100Z',
    'M100 125.46L200 225.46L100 325.46L0 225.46Z',
    'M350.91 125.46L450.91 225.46L350.91 325.46L250.91 225.46Z',
  ],
};

export type LogoVariant = 'wordmark' | 'arabic' | 'bilingual' | 'symbol';
type Tone = 'color' | 'mono' | 'accent';

export interface LogoProps extends Omit<SVGProps<SVGSVGElement>, 'height'> {
  variant?: LogoVariant;
  /** Height in px. Width follows the aspect ratio. */
  height?: number;
  tone?: Tone;
  /** Accessible name; defaults to "ATHR" / "أثر". */
  title?: string;
}

const dotFill = (tone: Tone) => (tone === 'mono' ? 'currentColor' : 'var(--vermilion, #E0461F)');

function Mark({
  o,
  tone,
  x = 0,
  y = 0,
  s = 1,
}: {
  o: { word: string; dots: string[] };
  tone: Tone;
  x?: number;
  y?: number;
  s?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={o.word} fill="currentColor" />
      {o.dots.map((d, i) => (
        <path key={i} d={d} fill={dotFill(tone)} data-nuqta={i} />
      ))}
    </g>
  );
}

export function Logo({
  variant = 'wordmark',
  height = 24,
  tone = 'color',
  title,
  ...rest
}: LogoProps) {
  let w: number;
  let h: number;
  let body: ReactElement;

  if (variant === 'symbol') {
    w = SYMBOL.w;
    h = SYMBOL.h;
    body = (
      <>
        {SYMBOL.dots.map((d, i) => (
          <path
            key={i}
            d={d}
            fill={tone === 'accent' && i > 0 ? 'currentColor' : dotFill(tone)}
            data-nuqta={i}
          />
        ))}
      </>
    );
  } else if (variant === 'arabic') {
    w = ARABIC.w;
    h = ARABIC.h;
    body = <Mark o={ARABIC} tone={tone} />;
  } else if (variant === 'bilingual') {
    const s = 0.95;
    const gap = 220;
    const ah = ARABIC.h * s;
    h = Math.max(LATIN.h, ah) + ah * 0.12;
    w = LATIN.w + gap * 2 + ARABIC.w * s;
    body = (
      <>
        <Mark o={LATIN} tone={tone} y={h - ah * 0.12 - LATIN.h} />
        <rect
          x={LATIN.w + gap - 6}
          y={h - LATIN.h * 0.95}
          width={12}
          height={LATIN.h * 0.85}
          fill="currentColor"
          opacity={0.3}
        />
        <Mark o={ARABIC} tone={tone} x={LATIN.w + gap * 2} y={h - ah} s={s} />
      </>
    );
  } else {
    w = LATIN.w;
    h = LATIN.h;
    body = <Mark o={LATIN} tone={tone} />;
  }

  const label = title ?? (variant === 'arabic' ? 'أثر' : 'ATHR');

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      height={height}
      width={(height * w) / h}
      role="img"
      aria-label={label}
      {...rest}
    >
      {body}
    </svg>
  );
}

export default Logo;
