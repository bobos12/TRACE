'use client';

import { useEffect, useRef } from 'react';

const PITCH = 32; // grid spacing, px
const BASE = 3.2; // rhombus half-diagonal at rest, px
const RADIUS = 140; // pointer influence, px
const DECAY = 700; // ms for a lit dot to fade back

/** Fallbacks if the tokens can't be read: paper and vermilion. */
const PAPER: RGB = [244, 241, 233];
const VERM: RGB = [255, 90, 51];

type RGB = [number, number, number];

/** A token's hex value as RGB — the lattice draws in the theme's own colours. */
function readToken(el: Element, name: string, fallback: RGB): RGB {
  const hex = getComputedStyle(el).getPropertyValue(name).trim().replace('#', '');
  if (!/^[0-9a-f]{6}/i.test(hex)) return fallback;
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)) as RGB;
}

interface Dot {
  x: number;
  y: number;
  /** 0–1, decaying. */
  heat: number;
  /** Permanently lit. None now: TRACE's mark sits over the lattice as `BreathingNuqtas`. */
  fixed: 0 | 1 | 2;
}

/**
 * The hero's nuqta lattice — the brand idea made interactive.
 *
 * A grid of tiny rhombi. Dots near the pointer swell and turn vermilion, then
 * decay over ~700ms, so moving the mouse leaves a fading trace. TRACE's own
 * mark — the breathing nuqtas — sits over it in the upper trailing corner.
 *
 * Touch devices get a slow diagonal wave instead of a trail.
 * Reduced motion gets the static lattice, no trail, no wave, no RAF at all.
 *
 * Light mode draws nothing: the hero is clean paper, and the lattice rests.
 */
export function HeroLattice({ rtl = false }: { rtl?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // The lattice is decorative and costs a full canvas paint. Starting it
    // during hydration delays the hero headline — the LCP element — so wait
    // until the main thread is free.
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    const idle =
      typeof requestIdleCallback === 'function'
        ? requestIdleCallback(() => !cancelled && (cleanup = setup()), { timeout: 1200 })
        : (setTimeout(() => !cancelled && (cleanup = setup()), 300) as unknown as number);

    return () => {
      cancelled = true;
      if (typeof cancelIdleCallback === 'function') cancelIdleCallback(idle);
      else clearTimeout(idle);
      cleanup?.();
    };

    function setup(): (() => void) | undefined {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;

    // The dots are drawn in the ink colour and heat toward vermilion — both
    // read from the tokens, so the lattice follows light and dark.
    let ink: RGB = PAPER;
    let mark: RGB = VERM;
    let rest = 0.1;
    let light = false;
    const readColours = () => {
      ink = readToken(canvas, '--ink', PAPER);
      mark = readToken(canvas, '--vermilion', VERM);
      // Dark ink means a paper ground — the light-mode lattice.
      light = ink[0] + ink[1] + ink[2] < 382;
      rest = 0.1;
    };
    readColours();

    let dots: Dot[] = [];
    let cols = 0;
    let rows = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const build = () => {
      const rect = parent.getBoundingClientRect();
      width = Math.ceil(rect.width);
      height = Math.ceil(rect.height);
      if (width === 0 || height === 0) return;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(width / PITCH) + 1;
      rows = Math.ceil(height / PITCH) + 1;
      const offsetX = (width - (cols - 1) * PITCH) / 2;

      dots = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots.push({ x: offsetX + c * PITCH, y: r * PITCH + PITCH / 2, fixed: 0, heat: 0 });
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Light mode: clean paper, no lattice.
      if (light) return;

      for (const d of dots) {
        const lit = d.fixed === 2 ? 1 : Math.max(d.heat, d.fixed === 1 ? 0.55 : 0);
        if (lit < 0.004 && d.fixed === 0) {
          // Resting dot: the ink, faint.
          ctx.fillStyle = `rgba(${ink[0]},${ink[1]},${ink[2]},${rest})`;
        } else {
          const t = d.fixed === 2 ? 1 : lit;
          const r = Math.round(ink[0] + (mark[0] - ink[0]) * t);
          const g = Math.round(ink[1] + (mark[1] - ink[1]) * t);
          const b = Math.round(ink[2] + (mark[2] - ink[2]) * t);
          ctx.fillStyle = `rgba(${r},${g},${b},${rest + (0.95 - rest) * t})`;
        }

        const s = BASE * (1 + 0.6 * lit);
        ctx.beginPath();
        ctx.moveTo(d.x, d.y - s);
        ctx.lineTo(d.x + s, d.y);
        ctx.lineTo(d.x, d.y + s);
        ctx.lineTo(d.x - s, d.y);
        ctx.closePath();
        ctx.fill();
      }
    };

    build();
    draw();

    // Redraw in the new colours when the theme flips; the animation part
    // (set below, unless reduced motion) restarts the touch wave in dark mode.
    let onTheme = () => {};
    const themeWatch = new MutationObserver(() => {
      readColours();
      onTheme();
      draw();
    });
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    if (reduced) {
      const ro = new ResizeObserver(() => {
        build();
        draw();
      });
      ro.observe(parent);
      return () => {
        ro.disconnect();
        themeWatch.disconnect();
      };
    }

    /* ── animation ─────────────────────────────────────────────── */

    let raf = 0;
    let last = 0;
    let running = false;
    let visible = true;
    let pointerX = -1e4;
    let pointerY = -1e4;
    let hasPointer = false;
    let waveAt = 0;

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      running = false;
    };

    const frame = (now: number) => {
      if (!visible) {
        stop();
        return;
      }

      const dt = last ? Math.min(now - last, 50) : 16;
      last = now;

      // Light mode has nothing to animate.
      if (light) {
        stop();
        return;
      }

      let active = false;

      // Pointer trail.
      if (hasPointer) {
        for (const d of dots) {
          const dx = d.x - pointerX;
          const dy = d.y - pointerY;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < RADIUS * RADIUS) {
            const target = 1 - Math.sqrt(dist2) / RADIUS;
            if (target > d.heat) d.heat = target;
          }
        }
      }

      // Touch devices: a slow diagonal wave of brightness every ~6s.
      if (coarse) {
        if (now - waveAt > 6000) waveAt = now;
        const p = (now - waveAt) / 1400;
        if (p >= 0 && p <= 1) {
          const edge = p * (width + height) * 1.15 - height * 0.15;
          for (const d of dots) {
            const along = d.x + d.y;
            const delta = Math.abs(along - edge);
            if (delta < 120) {
              const target = (1 - delta / 120) * 0.7;
              if (target > d.heat) d.heat = target;
            }
          }
          active = true;
        }
      }

      const fade = dt / DECAY;
      for (const d of dots) {
        if (d.heat > 0) {
          d.heat = Math.max(0, d.heat - fade);
          if (d.heat > 0.004) active = true;
        }
      }

      draw();

      if (active || hasPointer || coarse) {
        raf = requestAnimationFrame(frame);
      } else {
        stop();
      }
    };

    const start = () => {
      if (running || !visible) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    };

    onTheme = () => {
      if (!light && coarse) start();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const rect = canvas.getBoundingClientRect();
      pointerX = e.clientX - rect.left;
      pointerY = e.clientY - rect.top;
      hasPointer = true;
      start();
    };

    const onPointerLeave = () => {
      hasPointer = false;
    };

    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) start();
      else stop();
    };

    // Pause entirely when the hero is off screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = !document.hidden && Boolean(entry?.isIntersecting);
        if (visible) {
          if (coarse && !light) start();
        } else {
          stop();
        }
      },
      { threshold: 0 },
    );
    io.observe(parent);

    const ro = new ResizeObserver(() => {
      build();
      draw();
    });
    ro.observe(parent);

    parent.addEventListener('pointermove', onPointerMove, { passive: true });
    parent.addEventListener('pointerleave', onPointerLeave, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    if (coarse && !light) start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      parent.removeEventListener('pointermove', onPointerMove);
      parent.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      themeWatch.disconnect();
    };
    }
  }, [rtl]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full"
    />
  );
}

export default HeroLattice;
