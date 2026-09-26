import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export const VB = { w: 240, h: 140 } as const;

/** Shared drawing language: hairline structure, ink fills, one vermilion mark. */
export const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'square',
  strokeLinejoin: 'miter',
} as const;

export const C = {
  line: 'var(--line-strong)',
  ink: 'var(--ink)',
  soft: 'var(--surface-sunken)',
  sand: 'var(--sand)',
  mark: 'var(--vermilion)',
} as const;

/**
 * The animations available to an illustration part. Each maps to a keyframe
 * pair in globals.css: `illo-x` for the first play and `illo-x-r` for the
 * hover replay. Swapping the animation-name is what restarts it.
 */
export type IlloAnim = 'draw' | 'rise' | 'slide' | 'stamp' | 'grow' | 'fade' | 'move';

/**
 * Props for one animated part.
 *
 * These are plain SVG elements with CSS custom properties — no animation
 * library. Nine illustrations used to be ~70 motion components hydrating on
 * the home page; as CSS they cost nothing at runtime.
 */
export function anim(
  kind: IlloAnim,
  delay: number,
  extra?: { duration?: number; from?: number; mx?: number; my?: number; origin?: string },
): { 'data-a': string; style: CSSProperties } {
  const style: Record<string, string> = {
    '--a': `illo-${kind}`,
    '--ar': `illo-${kind}-r`,
    '--d': `${Math.round(delay * 1000)}ms`,
  };
  if (extra?.duration) style['--dur'] = `${Math.round(extra.duration * 1000)}ms`;
  if (extra?.from !== undefined) style['--from'] = `${extra.from}px`;
  if (extra?.mx !== undefined) style['--mx'] = `${extra.mx}px`;
  if (extra?.my !== undefined) style['--my'] = `${extra.my}px`;
  if (extra?.origin) style['--origin'] = extra.origin;
  return { 'data-a': kind, style: style as CSSProperties };
}

/**
 * Wrapper for the nine service illustrations.
 *
 * A **server component**. It plays once when the shared reveal observer marks
 * it in view, and replays on hover (desktop) because `:hover` swaps every
 * part's `animation-name` to its twin. Under prefers-reduced-motion the global
 * rule collapses every duration and delay, so the finished drawing is simply
 * there.
 */
export function Illo({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <div data-reveal="illo" className={cn('at-illo w-full text-ink', className)}>
      <svg
        viewBox={`0 0 ${VB.w} ${VB.h}`}
        role={label ? 'img' : 'presentation'}
        aria-label={label}
        aria-hidden={label ? undefined : 'true'}
        className="h-auto w-full"
      >
        {children}
      </svg>
    </div>
  );
}

/** A rhombus in the illustration's own coordinate space. */
export function Rhombus({
  x,
  y,
  r = 5,
  fill = C.mark,
  ...rest
}: {
  x: number;
  y: number;
  r?: number;
  fill?: string;
} & Partial<ReturnType<typeof anim>>) {
  return (
    <path
      d={`M${x} ${y - r}L${x + r} ${y}L${x} ${y + r}L${x - r} ${y}Z`}
      fill={fill}
      {...rest}
    />
  );
}
