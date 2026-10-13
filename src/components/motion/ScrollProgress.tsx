'use client';

import { useRef, type CSSProperties, type ReactNode } from 'react';
import { useScrollProgress } from '@/lib/scroll';

/**
 * A wrapper that writes its scroll progress to `--p`, so a server component
 * can hang scroll-linked CSS (`.at-drift`, `.at-process-line`) off it without
 * becoming a client component itself.
 */
export function ScrollProgress({
  offset = 'cover',
  className,
  style,
  children,
}: {
  offset?: 'cover' | 'contain';
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollProgress(ref, { offset });

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}

export default ScrollProgress;
