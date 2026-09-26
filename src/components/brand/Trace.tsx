'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { cn } from '@/lib/cn';

export interface TraceProps {
  /** Where the nuqta sits along the line, 0–1. The golden section by default. */
  at?: number;
  /** Nuqta box size in px. */
  nuqtaSize?: number;
  /** Draw as soon as it mounts rather than waiting to enter view. */
  onMount?: boolean;
  /** `line` is the section hairline; `strong` reads on a carbon band. */
  tone?: 'line' | 'strong';
  /** Seconds. */
  delay?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * The trace — a hairline that draws itself once and ends in a nuqta.
 *
 * Plain CSS: the line scales from its start edge and the nuqta stamps in after
 * it. It used to be two motion elements, which pulled the animation library
 * into every page that had a section rule. Draw direction mirrors in RTL
 * through `origin-[right_center]`.
 */
export function Trace({
  at = 0.618,
  nuqtaSize = 9,
  onMount = false,
  tone = 'line',
  delay = 0,
  className,
  style,
}: TraceProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(onMount);

  useEffect(() => {
    if (onMount) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setDrawn(true);
        observer.disconnect();
      },
      { rootMargin: '0px 0px -10% 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [onMount]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-drawn={drawn ? '' : undefined}
      className={cn('at-trace h-px w-full', className)}
      style={{ '--trace-delay': `${delay}s`, ...style } as CSSProperties}
    >
      <div className="relative h-px w-full">
        <div
          className={cn(
            'at-trace-line h-px w-full origin-[left_center] rtl:origin-[right_center]',
            tone === 'strong' ? 'bg-line-strong' : 'bg-line',
          )}
        />
        <span
          className="at-trace-nuqta absolute top-1/2 bg-vermilion"
          style={{
            width: nuqtaSize,
            height: nuqtaSize,
            insetInlineStart: `${at * 100}%`,
            marginTop: -nuqtaSize / 2,
            marginInlineStart: -nuqtaSize / 2,
          }}
        />
      </div>
    </div>
  );
}

export default Trace;
