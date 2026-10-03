import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * A mock authored at a fixed pixel size and scaled to whatever column it sits
 * in — in CSS (`.bb-frame` / `.bb-canvas`), so it needs no client JavaScript
 * and never jumps on hydration. Everything inside is drawn at `w` × `h`.
 */
export function Scaled({
  w,
  h,
  className,
  children,
}: {
  w: number;
  h: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn('bb-frame', className)}
      style={{ '--ratio': `${w} / ${h}` } as CSSProperties}
    >
      <div className="bb-canvas" style={{ '--w': `${w}px`, '--h': `${h}px` } as CSSProperties}>
        {children}
      </div>
    </div>
  );
}

/** Browser chrome in tokens: three quiet dots and the address. */
export function Browser({
  url,
  className,
  children,
}: {
  url: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-md border border-line-strong bg-surface-raised shadow-float',
        className,
      )}
    >
      <div className="flex h-8 items-center gap-1.5 border-b border-line bg-surface-sunken px-3">
        <span className="size-2 rounded-full bg-line-strong" />
        <span className="size-2 rounded-full bg-line-strong" />
        <span className="size-2 rounded-full bg-line-strong" />
        <span className="ms-3 flex h-5 flex-1 items-center rounded-sm bg-surface px-2.5 font-mono text-[10px] text-ink-faint">
          {url}
        </span>
      </div>
      {children}
    </div>
  );
}

/** A phone bezel in tokens; the screen is a fixed 300 × 620 canvas. */
export function Phone({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        'band-carbon overflow-hidden rounded-[28px] p-1.5 shadow-float ring-1 ring-line-strong',
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-[22px]">
        <span className="absolute left-1/2 top-2 z-20 h-1.5 w-14 -translate-x-1/2 rounded-full bg-surface-sunken" />
        <Scaled w={300} h={620}>
          {children}
        </Scaled>
      </div>
    </div>
  );
}

/** Five filled stars — the Google rating, drawn in ink. */
export function Stars({ size = 11, className }: { size?: number; className?: string }) {
  return (
    <span className={cn('flex gap-px', className)} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
          <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z" />
        </svg>
      ))}
    </span>
  );
}

/** The phone status bar — the time is the story. */
export function StatusBar({ time, className }: { time: string; className?: string }) {
  return (
    <div className={cn('flex h-9 items-center justify-between px-6 pt-1 text-[12px] font-semibold', className)}>
      <span className="tabular-nums">{time}</span>
      <span className="flex items-center gap-1.5" aria-hidden="true">
        <span className="flex items-end gap-[2px]">
          {[4, 6, 8, 10].map((h, i) => (
            <span key={h} className={cn('w-[3px] bg-current', i === 3 && 'opacity-30')} style={{ height: h }} />
          ))}
        </span>
        <span className="ms-1 h-[10px] w-[20px] rounded-[3px] border border-current p-[1.5px]">
          <span className="block h-full w-[35%] rounded-[1px] bg-current" />
        </span>
      </span>
    </div>
  );
}
