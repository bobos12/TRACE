import type { CSSProperties } from 'react';

/**
 * The name, made.
 *
 * The Arabic wordmark أثر is drawn without its three nuqtas — leaving the bare
 * ت skeleton — and then the nuqtas stamp on, 90ms apart, turning it into ث.
 * That is the whole brand idea in one animation: the skeleton is shared, the
 * dots make it yours.
 *
 * Paths are the same outlines as `Logo` (starters/Logo.tsx); only the nuqtas
 * are animated, so the letterforms are never redrawn or retyped.
 *
 * A server component: the stamp is a CSS keyframe triggered by the shared
 * reveal observer.
 */
const WORD =
  'M0 1036H39Q135 1036 176 992.5Q217 949 216 866Q216 841 213 813.5Q210 786 205 757L184 630L281 614L296 702Q305 752 308 796H401V900L374 927H308Q301 981 281 1025Q261 1069 228 1100.5Q195 1132 148 1149.5Q101 1167 40 1167H0ZM374 823 401 796H426Q496 796 522.5 781.5Q549 767 549 729Q549 713 546.5 688.5Q544 664 537 623L521 533L619 517L633 607Q638 641 641 673.5Q644 706 644 729Q644 831 592 879Q540 927 426 927H374ZM750 309H857V927H750ZM690 154H730L731 150Q712 128 712 97Q712 56 741.5 29Q771 2 816 2Q843 2 869.5 14Q896 26 913 46L868 107Q845 83 816 83Q799 83 788 91.5Q777 100 777 112Q777 148 847 148H918V229H690Z';

const DOTS = [
  'M556 200.43L614 258.43L556 316.43L498 258.43Z',
  'M483.86 272.57L541.86 330.57L483.86 388.57L425.86 330.57Z',
  'M628.14 272.57L686.14 330.57L628.14 388.57L570.14 330.57Z',
];

export function AthrMark({ className, label }: { className?: string; label: string }) {
  return (
    <svg
      data-reveal="fade"
      viewBox="0 0 918 1167"
      role="img"
      aria-label={label}
      className={`at-athr-mark ${className ?? ''}`}
      style={{ color: 'var(--ink)' }}
    >
      {/* The shared skeleton. */}
      <path d={WORD} fill="currentColor" />

      {/* The mark that makes it ث. */}
      {DOTS.map((d, i) => (
        <path
          key={d}
          d={d}
          fill="var(--vermilion)"
          data-nuqta={i}
          style={{ '--d': `${700 + i * 90}ms` } as CSSProperties}
        />
      ))}
    </svg>
  );
}

export default AthrMark;
