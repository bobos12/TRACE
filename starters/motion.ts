/**
 * Motion presets for the `motion` (Framer Motion) library, built from the brand tokens.
 * Rules: fast, deliberate, once. Nothing bounces. Every animation must respect prefers-reduced-motion
 * (use `useReducedMotion()` and fall back to opacity-only or no motion).
 */
export const ease = {
  mark: [0.2, 0, 0, 1] as const,    // default — fast out, precise landing
  press: [0.5, 0, 0.75, 0] as const, // accelerating in, before a mark lands
  trace: [0.65, 0, 0.35, 1] as const // symmetric, for lines drawing themselves
};
export const duration = { press: 0.09, quick: 0.16, trace: 0.32, reveal: 0.56 };

/** Section/element reveal on scroll: rise 16px + fade, once. */
export const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -12% 0px' },
  transition: { duration: duration.reveal, ease: ease.mark }
};

/** Stagger children (cards, list items): 60ms apart. */
export const stagger = { whileInView: { transition: { staggerChildren: 0.06 } } };

/** The stamp — a nuqta arriving: starts large and transparent, presses down into place. */
export const stamp = {
  initial: { scale: 1.9, opacity: 0, rotate: 45 },
  animate: { scale: [1.9, 0.62, 0.7071], opacity: [0, 1, 1], rotate: 45 },
  transition: { duration: duration.trace, ease: ease.mark, times: [0, 0.55, 1] }
};

/** The trace — an SVG path drawing itself (use on <motion.path>). Tie pathLength to scroll for section connectors. */
export const trace = {
  initial: { pathLength: 0 },
  whileInView: { pathLength: 1 },
  viewport: { once: true },
  transition: { duration: 1.2, ease: ease.trace }
};

/** Headline lines: each line clips up from its baseline, 70ms apart. */
export const lineReveal = (i: number) => ({
  initial: { y: '105%' },
  animate: { y: '0%' },
  transition: { duration: duration.reveal, ease: ease.mark, delay: 0.12 + i * 0.07 }
});
