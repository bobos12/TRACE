'use client';

import { useEffect, useRef } from 'react';

const ARABIC_INDIC = '٠١٢٣٤٥٦٧٨٩';
const toLatin = (s: string) => s.replace(/[٠-٩]/g, (d) => String(ARABIC_INDIC.indexOf(d)));
const toArabic = (s: string) => s.replace(/\d/g, (d) => ARABIC_INDIC[Number(d)] ?? d);

/** The brand's `ease.mark` curve, solved for y at a given x. */
function easeMark(t: number): number {
  // cubic-bezier(0.2, 0, 0, 1) — close enough for a counter, and free.
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Rolls a number to its value when it enters view, once.
 *
 * The rendered text is always the final value, so SSR, SEO, no-JS and
 * reduced-motion all show the real number; the roll is written straight to the
 * DOM node. Hand-rolled rather than using the animation library — a counter
 * should not be a reason to ship it.
 *
 * Works on any string containing digits — "40+", "−42%", "٦ د", "2.1s" — by
 * animating only the numeric run and keeping every other character.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const isArabicDigits = /[٠-٩]/.test(value);
    const normalised = toLatin(value);
    const match = normalised.match(/\d+(\.\d+)?/);
    if (!match) return;

    const target = Number(match[0]);
    const decimals = match[0].includes('.') ? (match[0].split('.')[1]?.length ?? 0) : 0;
    const head = normalised.slice(0, match.index ?? 0);
    const tail = normalised.slice((match.index ?? 0) + match[0].length);

    const write = (n: number) => {
      const whole = `${head}${n.toFixed(decimals)}${tail}`;
      node.textContent = isArabicDigits ? toArabic(whole) : whole;
    };

    let raf = 0;
    let start = 0;

    const step = (now: number) => {
      if (!start) start = now;
      const t = Math.min((now - start) / 800, 1);
      write(target * easeMark(t));
      if (t < 1) raf = requestAnimationFrame(step);
      else node.textContent = value;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        raf = requestAnimationFrame(step);
      },
      { rootMargin: '0px 0px -15% 0px' },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      node.textContent = value;
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}

export default CountUp;
