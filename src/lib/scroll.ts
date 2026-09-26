'use client';

import { useEffect, type RefObject } from 'react';

/**
 * Scroll and pointer progress, written to CSS custom properties.
 *
 * The three scroll-linked surfaces on the home page — the product stack, the
 * pinned work gallery and the process trace — used to be the only reason the
 * animation library loaded there, which put the home page ~40KB over its
 * gzipped JS budget. These helpers do the same job in about sixty lines: read
 * on scroll, write one custom property, let CSS transform.
 *
 * Rules kept from docs/05-motion.md: passive listeners, rAF-throttled, no
 * layout thrashing, paused when off screen, and disabled under reduced motion
 * (the element keeps whatever its CSS default is).
 */

type Offset = 'cover' | 'contain';

interface ScrollOptions {
  /**
   * `cover`   — 0 when the element's top hits the viewport bottom, 1 when its
   *             bottom passes the viewport top. For parallax.
   * `contain` — 0 when the element's top hits the viewport top, 1 when its
   *             bottom does. For pinned sections.
   */
  offset?: Offset;
  /** Extra work on each frame, e.g. deriving an active index. */
  onProgress?: (progress: number, el: HTMLElement) => void;
  enabled?: boolean;
}

export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  { offset = 'contain', onProgress, enabled = true }: ScrollOptions = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let onScreen = true;

    const measure = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      const progress =
        offset === 'cover'
          ? (vh - rect.top) / (vh + rect.height)
          : -rect.top / Math.max(rect.height - vh, 1);

      const clamped = Math.min(Math.max(progress, 0), 1);
      el.style.setProperty('--p', clamped.toFixed(4));
      onProgress?.(clamped, el);
    };

    const schedule = () => {
      if (frame || !onScreen) return;
      frame = requestAnimationFrame(measure);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = Boolean(entry?.isIntersecting);
        if (onScreen) schedule();
      },
      { rootMargin: '10% 0px' },
    );

    io.observe(el);
    measure();

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      io.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [ref, offset, onProgress, enabled]);
}

/**
 * Pointer position within an element, as −1…1 on each axis, written to
 * `--px` / `--py`. CSS supplies the easing via a transition, which reads close
 * enough to a spring at these amplitudes.
 */
export function usePointerParallax(ref: RefObject<HTMLElement | null>, enabled = true) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const write = () => {
      frame = 0;
      el.style.setProperty('--px', x.toFixed(3));
      el.style.setProperty('--py', y.toFixed(3));
    };

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      if (!frame) frame = requestAnimationFrame(write);
    };

    const onLeave = () => {
      x = 0;
      y = 0;
      if (!frame) frame = requestAnimationFrame(write);
    };

    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [ref, enabled]);
}
