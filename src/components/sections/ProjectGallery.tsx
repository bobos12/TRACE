'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/motion/Reveal';
import { duration, ease } from '@/lib/motion';
import { cn } from '@/lib/cn';

export interface GalleryLabels {
  gallery: string;
  close: string;
  previous: string;
  next: string;
}

/**
 * The case-study gallery: full-measure images — one wide, then a pair —
 * opening into a lightbox.
 *
 * The lightbox is a modal dialog — focus moves into it, Escape closes it, arrow
 * keys move between images, and focus returns to the thumbnail that opened it.
 */
export function ProjectGallery({
  images,
  title,
  labels,
}: {
  images: string[];
  title: string;
  labels: GalleryLabels;
}) {
  const reduced = useReducedMotion() ?? false;
  const [open, setOpen] = useState<number | null>(null);
  const triggers = useRef<Array<HTMLButtonElement | null>>([]);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnTo = useRef<number | null>(null);

  const close = useCallback(() => {
    const index = returnTo.current;
    setOpen(null);
    if (index !== null) triggers.current[index]?.focus();
  }, []);

  const step = useCallback(
    (delta: number) => {
      setOpen((current) => {
        if (current === null) return current;
        return (current + delta + images.length) % images.length;
      });
    },
    [images.length],
  );

  useEffect(() => {
    if (open === null) return;

    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
      // Keep focus inside the dialog.
      if (e.key === 'Tab') {
        e.preventDefault();
        closeRef.current?.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close, step]);

  if (!images.length) return null;

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        {images.map((src, i) => {
          // One wide, then a pair — and a pair's odd one out goes wide too,
          // so the grid never ends on a half-empty row.
          const wide = i % 3 === 0 || (i % 3 === 1 && i === images.length - 1);
          const isPhone = /mobile|splash|approve/.test(src);

          return (
            <Reveal as="li" key={src} delay={(i % 3) * 0.05} className={cn(wide && 'md:col-span-2')}>
              <button
                type="button"
                ref={(el) => {
                  triggers.current[i] = el;
                }}
                onClick={() => {
                  returnTo.current = i;
                  setOpen(i);
                }}
                aria-label={`${labels.gallery} ${i + 1}`}
                className={cn(
                  'group/shot block w-full overflow-hidden rounded-sm bg-surface-sunken',
                  isPhone && 'px-4 py-8',
                )}
              >
                <span
                  className={cn(
                    'relative block w-full overflow-hidden',
                    isPhone ? 'mx-auto aspect-[9/19] max-w-[240px] rounded-[20px]' : 'aspect-[16/10]',
                  )}
                >
                  <Image
                    src={src}
                    alt={`${title} — ${i + 1}`}
                    fill
                    quality={90}
                    sizes={wide ? '(max-width: 1344px) calc(100vw - 48px), 1280px' : '(max-width: 768px) calc(100vw - 48px), 640px'}
                    className={cn(
                      'transition-transform duration-[600ms] ease-mark group-hover/shot:scale-[1.015]',
                      isPhone ? 'object-contain' : 'object-cover',
                    )}
                  />
                </span>
              </button>
            </Reveal>
          );
        })}
      </ul>

      <AnimatePresence>
        {open !== null ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={labels.gallery}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : duration.quick }}
            className="fixed inset-0 z-50 flex flex-col bg-scrim p-4 sm:p-8"
            onClick={close}
          >
            <div className="flex justify-end">
              <button
                type="button"
                ref={closeRef}
                onClick={close}
                aria-label={labels.close}
                className="inline-grid size-11 place-items-center rounded-md bg-carbon text-paper"
              >
                <Icon name="close" size={22} />
              </button>
            </div>

            <motion.div
              key={open}
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reduced ? 0 : duration.trace, ease: ease.mark }}
              className="relative mx-auto my-auto flex w-full max-w-5xl flex-1 items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[open] ?? ''}
                alt={`${title} — ${open + 1}`}
                width={2400}
                height={1500}
                quality={90}
                sizes="90vw"
                className="h-auto max-h-[78vh] w-full object-contain"
              />
            </motion.div>

            {images.length > 1 ? (
              <div
                className="flex items-center justify-center gap-3 pt-4"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label={labels.previous}
                  className="inline-grid size-11 place-items-center rounded-md bg-carbon text-paper"
                >
                  <Icon name="chevron-right" size={20} className="rotate-180 rtl:rotate-0" />
                </button>
                <span className="font-mono text-[13px] text-paper" dir="ltr">
                  {open + 1} / {images.length}
                </span>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label={labels.next}
                  className="inline-grid size-11 place-items-center rounded-md bg-carbon text-paper"
                >
                  <Icon name="chevron-right" size={20} className="rtl:rotate-180" />
                </button>
              </div>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default ProjectGallery;
