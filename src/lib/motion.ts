/**
 * Motion presets, built from the brand tokens (starters/motion.ts, extended).
 * Rules: fast, deliberate, once. Nothing bounces. Every animation respects
 * prefers-reduced-motion — use `useReducedMotion()` and fall back to
 * opacity-only, or to the finished state for scroll-linked transforms.
 */
import type { Transition, Variants } from 'motion/react';

export const ease = {
  mark: [0.2, 0, 0, 1] as const, // default — fast out, precise landing
  press: [0.5, 0, 0.75, 0] as const, // accelerating in, before a mark lands
  trace: [0.65, 0, 0.35, 1] as const, // symmetric, for lines drawing themselves
};

export const duration = { press: 0.09, quick: 0.16, trace: 0.32, reveal: 0.56 };

export const viewportOnce = { once: true, margin: '0px 0px -12% 0px' } as const;

/** Section/element reveal on scroll: rise 16px + fade, once. */
export const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: viewportOnce,
  transition: { duration: duration.reveal, ease: ease.mark },
} as const;

/** The same reveal, reduced to opacity for prefers-reduced-motion. */
export const revealQuiet = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: viewportOnce,
  transition: { duration: duration.quick },
} as const;

export function revealFor(reduced: boolean | null) {
  return reduced ? revealQuiet : reveal;
}

/** Parent that staggers its children 60ms apart. */
export const staggerParent: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.06 } },
};

export const staggerChild = (reduced: boolean | null): Variants => ({
  hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 16 },
  shown: {
    opacity: 1,
    y: 0,
    transition: { duration: reduced ? duration.quick : duration.reveal, ease: ease.mark },
  },
});

/** The stamp — a nuqta arriving: starts large and transparent, presses into place. */
export const stamp = {
  initial: { scale: 1.9, opacity: 0, rotate: 45 },
  animate: { scale: [1.9, 0.62, 0.7071], opacity: [0, 1, 1], rotate: [45, 45, 45] },
  transition: { duration: duration.trace, ease: ease.mark, times: [0, 0.55, 1] },
} as const;

export const stampAt = (delay: number): Transition => ({
  duration: duration.trace,
  ease: ease.mark,
  times: [0, 0.55, 1],
  delay,
});

/** The trace — an SVG path drawing itself (on <motion.path>). */
export const trace = {
  initial: { pathLength: 0 },
  whileInView: { pathLength: 1 },
  viewport: { once: true },
  transition: { duration: 1.2, ease: ease.trace },
} as const;

/** Headline lines: each line clips up from its baseline, 70ms apart. */
export const lineReveal = (i: number, reduced?: boolean | null) =>
  reduced
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: duration.quick, delay: i * 0.04 },
      }
    : {
        initial: { y: '105%' },
        animate: { y: '0%' },
        transition: { duration: duration.reveal, ease: ease.mark, delay: 0.12 + i * 0.07 },
      };

/** Mirror a horizontal value in RTL. */
export const dirX = (value: number, rtl: boolean): number => (rtl ? -value : value);
