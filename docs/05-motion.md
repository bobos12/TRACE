# 05 — Motion & interaction

**Premium, modern, interactive — never game-like.** Motion is the mark being made: fast, deliberate, once.

Presets: `starters/motion.ts` (use the `motion` package — `import { motion } from 'motion/react'`).

## Principles

1. **Everything animates once.** Reveals happen the first time an element enters view. Only loaders and the logo marquee loop.
2. **Scroll drives story, not scroll speed.** Use `useScroll` / `useTransform` for scroll-linked effects: product-stack fan-out, the process trace, the work gallery's translateX.
   - Never intercept the wheel.
   - Never snap the page.
   - Never change scroll speed.
   - Smooth-scroll libraries (Lenis) are optional. If you use one, keep native feel (lerp ≥ 0.1), disable it on touch devices, and disable it under reduced motion.
3. **Timing:**
   - UI feedback: ≤ 160ms.
   - Reveals: 560ms with `ease.mark`.
   - Staggers: 60–80ms.
   - No reveal starts later than 400ms after its element is in view.
   - Nothing bounces or overshoots — no spring overshoot on layout.
4. **Budget per viewport:** at most **one** hero-level effect in view at a time (hero lattice, pinned gallery, or process trace). Everything else is a simple reveal.
5. **Reduced motion** (`useReducedMotion()` and `@media (prefers-reduced-motion: reduce)`):
   - Reveals become opacity-only (or nothing).
   - Scroll-linked transforms are disabled and the final state is shown.
   - The lattice is static.
   - The marquee stops.
   - The work gallery becomes a normal vertical list.
6. **Performance:**
   - Animate only `transform` and `opacity` (plus `pathLength` on SVG).
   - Use `will-change` only while an element is animating.
   - Canvas effects pause offscreen and in background tabs.
   - No layout thrashing in scroll handlers.

## The signature moves

| Move | Where | Implementation |
| --- | --- | --- |
| **Stamp** — a nuqta presses into place | Logo nuqtas on load, headline full stops, process steps, success states | `stamp` preset: scale 1.9 → 0.62 → 0.7071, opacity 0 → 1, 320ms |
| **Trace** — a line draws itself | Hero bottom rule, process timeline, section connectors, contact-card outline, work-gallery progress | SVG `pathLength` 0 → 1, `ease.trace`; scroll-linked where noted |
| **Lattice trail** — pointer leaves a fading vermilion trace | Hero background | Canvas; per-dot intensity decays ~700ms; wave on touch |
| **Assemble** — pieces arrive back to front | Hero product stack, bento illustrations | Staggered translate + fade |
| **Line reveal** — headline lines rise from a mask | All `display-*` headings on first view | `lineReveal(i)` with `overflow:hidden` wrappers per line |
| **Count up** — numbers roll to value | Trust stats, case-study results | 800ms, `ease.mark`; keep final text for SSR/SEO |
| **Lift** — interactive surfaces respond | Cards, tiles, buttons | translateY(−2px) + border to ink, 160ms; button press translateY(1px) |

## Page transitions

- Keep them subtle: on route change, the new page's hero headline uses the line reveal, and a 2px vermilion progress trace runs across the top of the viewport while loading.
- No full-screen wipes.
- No preloader screens. The site must render content immediately.

## Cursor

Use the default cursor. Don't build a custom cursor that replaces the system one. The hero lattice already gives the pointer a presence.

## RTL

Mirror every horizontal motion in Arabic:
- Slide directions
- The work gallery's translateX direction
- Arrow nudges
- Trace draw direction (starts at the right)

Use `dir`-aware helpers: `const x = isRTL ? -value : value`.
