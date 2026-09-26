'use client';

import { useEffect } from 'react';

/**
 * One IntersectionObserver for every scroll reveal on the page.
 *
 * Sections used to be client components purely so `motion`'s `whileInView`
 * could fade them in — which meant hydrating the whole animation library for
 * an opacity transition. This flips `data-reveal-in` instead and lets CSS do
 * the work, so those sections are server components again.
 *
 * Mounted once per page, in the site layout. Under prefers-reduced-motion it
 * reveals everything immediately and never observes anything.
 */
export function RevealMount() {
  useEffect(() => {
    const reveal = (el: Element) => el.setAttribute('data-reveal-in', '');
    const all = () => document.querySelectorAll('[data-reveal]:not([data-reveal-in])');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      all().forEach(reveal);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );

    const observe = () => all().forEach((el) => observer.observe(el));
    observe();

    // Client-side navigation swaps the tree without remounting this component.
    const mutations = new MutationObserver(observe);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);

  return null;
}

export default RevealMount;
