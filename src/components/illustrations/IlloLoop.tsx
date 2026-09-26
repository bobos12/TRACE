'use client';

import { useEffect } from 'react';

/**
 * Keeps the service illustrations live: each one rebuilds itself every few
 * seconds while it is on screen, the tiles staggered so they ripple rather
 * than all restart at once.
 *
 * It reuses the hover replay: flipping `data-cycle` swaps every part's
 * animation-name between its two identical keyframe twins (see `.at-illo` in
 * globals.css), and a swapped name is a restarted animation. No animation
 * library, no React re-render. Off screen, in a hidden tab or under reduced
 * motion, nothing runs.
 */
export function IlloLoop({ scope, every = 5200 }: { scope: string; every?: number }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const nodes = Array.from(document.querySelectorAll<HTMLElement>(`${scope} .at-illo`));
    if (!nodes.length) return;

    const onScreen = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) onScreen.add(entry.target);
          else onScreen.delete(entry.target);
        }
      },
      { threshold: 0.3 },
    );
    nodes.forEach((node) => io.observe(node));

    const timers: number[] = [];
    nodes.forEach((node, i) => {
      const replay = () => {
        if (document.hidden || !onScreen.has(node) || !node.hasAttribute('data-reveal-in')) return;
        node.dataset.cycle = node.dataset.cycle === '1' ? '0' : '1';
      };
      // A wave across the tiles, then one steady beat each.
      timers.push(
        window.setTimeout(() => {
          replay();
          timers.push(window.setInterval(replay, every));
        }, every + i * 450),
      );
    });

    return () => {
      io.disconnect();
      timers.forEach((t) => {
        window.clearTimeout(t);
        window.clearInterval(t);
      });
    };
  }, [scope, every]);

  return null;
}

export default IlloLoop;
