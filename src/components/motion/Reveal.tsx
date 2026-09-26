import type { CSSProperties, ReactNode } from 'react';

export type RevealTag =
  | 'div'
  | 'section'
  | 'article'
  | 'header'
  | 'figure'
  | 'blockquote'
  | 'ul'
  | 'li'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'p'
  | 'span'
  | 'dl';

export interface RevealProps {
  as?: RevealTag;
  /** Stagger, in seconds — kept in seconds so call sites read like the motion presets. */
  delay?: number;
  /** `rise` also translates 16px; `fade` is opacity only. */
  variant?: 'rise' | 'fade';
  className?: string;
  id?: string;
  role?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/**
 * The default reveal: rise 16px and fade, once, the first time it enters view.
 *
 * A **server component**. It emits `data-reveal` and lets CSS animate, driven
 * by the single observer in `RevealMount` — no animation library, no client
 * boundary. Reduced motion is honoured by RevealMount (reveal immediately) and
 * by the global reduced-motion rule (zero duration and delay).
 */
export function Reveal({
  as: Tag = 'div',
  delay = 0,
  variant = 'rise',
  className,
  style,
  children,
  ...rest
}: RevealProps) {
  return (
    <Tag
      data-reveal={variant}
      className={className}
      style={delay ? ({ '--d': `${Math.round(delay * 1000)}ms`, ...style } as CSSProperties) : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Reveal;
