'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

/** One loop: all the way right (the whole old site), all the way left (the whole new one). */
const SWEEP = [
  { to: 100, ms: 1800 },
  { to: 0, ms: 3000 },
];
/** A beat at each end, so each site is seen in full. */
const HOLD = 700;

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * Old site on the left, new on the right, a handle between them. A native
 * range input covers the whole frame, so dragging, clicking and the arrow
 * keys all work and screen readers announce the position.
 *
 * Until someone uses it, the handle sweeps edge to edge without stopping —
 * the whole old site, then the whole new one — so the change is seen even by
 * visitors who never drag. It only rests while off screen. The first drag,
 * click or arrow key hands it over for good; reduced motion never starts it.
 * The sweep writes one CSS variable — no re-renders.
 */
export function CompareSlider({
  before,
  after,
  beforeLabel,
  afterLabel,
  label,
}: {
  before: ReactNode;
  after: ReactNode;
  beforeLabel: string;
  afterLabel: string;
  label: string;
}) {
  const [pos, setPos] = useState(50);
  const root = useRef<HTMLDivElement>(null);
  const touched = useRef(false);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let timer = 0;
    let visible = false;
    let current = 50;

    const write = (v: number) => {
      current = v;
      el.style.setProperty('--pos', `${v}%`);
    };

    const run = (step = 0) => {
      if (touched.current || !visible) return;
      if (step >= SWEEP.length) step = 0;
      const from = current;
      const { to, ms } = SWEEP[step]!;
      const start = performance.now();
      const tick = (now: number) => {
        if (touched.current) return;
        const t = Math.min((now - start) / ms, 1);
        write(from + (to - from) * ease(t));
        if (t < 1) frame = requestAnimationFrame(tick);
        else timer = window.setTimeout(() => run(step + 1), HOLD);
      };
      frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = !!entry?.isIntersecting;
        stop();
        if (visible && !touched.current) timer = window.setTimeout(() => run(0), 500);
      },
      { threshold: 0.5 },
    );
    observer.observe(el);

    const takeOver = () => {
      if (touched.current) return;
      touched.current = true;
      stop();
      setPos(Math.round(current));
    };
    el.addEventListener('pointerdown', takeOver);
    el.addEventListener('keydown', takeOver);

    return () => {
      stop();
      observer.disconnect();
      el.removeEventListener('pointerdown', takeOver);
      el.removeEventListener('keydown', takeOver);
    };
  }, []);

  return (
    <div ref={root} className="relative select-none" style={{ '--pos': `${pos}%` } as CSSProperties}>
      <div className="relative">
        {before}
        <div className="absolute inset-0" style={{ clipPath: 'inset(0 0 0 var(--pos))' }}>
          {after}
        </div>
      </div>

      {/* The handle: a hairline with a rhombus grip. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-paper shadow-[0_0_0_1px_rgb(0_0_0/0.25)]"
        style={{ insetInlineStart: 'var(--pos)' }}
      >
        <span className="absolute top-1/2 left-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 rotate-45 place-items-center border border-carbon bg-paper shadow-float">
          <span className="size-2.5 bg-vermilion" />
        </span>
      </div>

      <span className="pointer-events-none absolute bottom-4 start-4 rounded-sm bg-carbon px-2.5 py-1 font-mono text-[11px] tracking-[0.1em] text-paper uppercase">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute bottom-4 end-4 rounded-sm bg-nuqta px-2.5 py-1 font-mono text-[11px] tracking-[0.1em] text-on-nuqta uppercase">
        {afterLabel}
      </span>

      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={pos}
        onChange={(e) => {
          touched.current = true;
          setPos(Number(e.target.value));
        }}
        aria-label={label}
        aria-valuetext={`${pos}%`}
        className="peer absolute inset-0 size-full cursor-ew-resize appearance-none opacity-0"
      />
      {/* The input itself is invisible, so its focus ring is drawn here. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-md peer-focus-visible:shadow-focus-ring" />
    </div>
  );
}

export default CompareSlider;
