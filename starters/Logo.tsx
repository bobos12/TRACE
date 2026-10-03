/**
 * TRACE logo — exact outlines (Instrument Sans SemiBold, converted to paths;
 * +36 tracking plus the font's own kerning, the same construction the ATHR
 * wordmark used). The nuqta cluster sits centred on the apex of the A.
 * Letters use currentColor; the three nuqtas use var(--vermilion).
 * Every nuqta path carries data-nuqta="0|1|2" so they can be stamped in.
 * Do not retype the name in a font or move the nuqtas — docs/brand-guidelines/03-logo.md.
 */
import type { ReactElement, SVGProps } from 'react';

export const WORDMARK = {
  w: 3450,
  h: 1060.97,
  word: 'M239 1050.97V433.97H0V330.97H608V433.97H369V1050.97ZM723 1050.97V330.97H1027Q1104 330.97 1161 356.97Q1218 382.97 1248.5 429.97Q1279 476.97 1279 539.97Q1279 601.97 1248.5 648.97Q1218 695.97 1161 721.97Q1104 747.97 1027 747.97H825V648.97H1023Q1086 648.97 1119.5 619.97Q1153 590.97 1153 539.97Q1153 488.97 1120 461.47Q1087 433.97 1023 433.97H853V1050.97ZM1135 1050.97 814 682.97H960L1315 1050.97ZM1392 1050.97 1657 330.97H1769L1520 1050.97ZM1935 1050.97 1687 330.97H1805L2069 1050.97ZM1529 767.97H1923V871.97H1529ZM2478 1060.97Q2401 1060.97 2336.5 1033.47Q2272 1005.97 2224 955.97Q2176 905.97 2150 837.97Q2124 769.97 2124 688.97Q2124 607.97 2150 540.97Q2176 473.97 2223.5 424.47Q2271 374.97 2335.5 347.97Q2400 320.97 2478 320.97Q2564 320.97 2633 354.97Q2702 388.97 2746.5 450.47Q2791 511.97 2801 594.97H2673Q2661 513.97 2608 470.47Q2555 426.97 2479 426.97Q2412 426.97 2362 458.97Q2312 490.97 2284 549.47Q2256 607.97 2256 687.97Q2256 769.97 2284 829.47Q2312 888.97 2363 921.97Q2414 954.97 2480 954.97Q2554 954.97 2607 911.47Q2660 867.97 2674 787.97H2803Q2791 869.97 2746.5 931.97Q2702 993.97 2633 1027.47Q2564 1060.97 2478 1060.97ZM2932 1050.97V330.97H3062V1050.97ZM2994 1050.97V947.97H3450V1050.97ZM2994 730.97V629.97H3415V730.97ZM2994 433.97V330.97H3439V433.97Z',
  dots: [
    'M1731 0L1801 70L1731 140L1661 70Z',
    'M1644.03 86.97L1714.03 156.97L1644.03 226.97L1574.03 156.97Z',
    'M1817.97 86.97L1887.97 156.97L1817.97 226.97L1747.97 156.97Z',
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

export type LogoVariant = 'wordmark' | 'symbol';
type Tone = 'color' | 'mono' | 'accent';

export interface LogoProps extends Omit<SVGProps<SVGSVGElement>, 'height'> {
  variant?: LogoVariant;
  /** Height in px. Width follows the aspect ratio. */
  height?: number;
  tone?: Tone;
  /** Accessible name; defaults to "TRACE". */
  title?: string;
}

const dotFill = (tone: Tone) => (tone === 'mono' ? 'currentColor' : 'var(--vermilion, #E0461F)');

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
  } else {
    w = WORDMARK.w;
    h = WORDMARK.h;
    body = (
      <>
        <path d={WORDMARK.word} fill="currentColor" />
        {WORDMARK.dots.map((d, i) => (
          <path key={i} d={d} fill={dotFill(tone)} data-nuqta={i} />
        ))}
      </>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      height={height}
      width={(height * w) / h}
      role="img"
      aria-label={title ?? 'TRACE'}
      {...rest}
    >
      {body}
    </svg>
  );
}

export default Logo;
