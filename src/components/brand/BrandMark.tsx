import type { CSSProperties } from 'react';
import { WORDMARK } from './Logo';

/**
 * The name, made.
 *
 * The TRACE wordmark is drawn without its three nuqtas, then they stamp on
 * above the A, 90ms apart. That is the whole brand idea in one animation: the
 * skeleton is shared, the mark makes it yours.
 *
 * Same outlines as `Logo`; only the nuqtas are animated, so the letterforms
 * are never redrawn or retyped.
 *
 * A server component: the stamp is a CSS keyframe triggered by the shared
 * reveal observer.
 */
export function BrandMark({ className, label }: { className?: string; label: string }) {
  return (
    <svg
      data-reveal="fade"
      viewBox={`0 0 ${WORDMARK.w} ${WORDMARK.h}`}
      role="img"
      aria-label={label}
      className={`at-brand-mark ${className ?? ''}`}
      style={{ color: 'var(--ink)' }}
    >
      {/* The shared skeleton. */}
      <path d={WORDMARK.word} fill="currentColor" />

      {/* The mark that makes it TRACE. */}
      {WORDMARK.dots.map((d, i) => (
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

export default BrandMark;
