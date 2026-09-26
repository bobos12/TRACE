import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface ChipProps {
  active?: boolean;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
}

/** Outlined pill used for industries and the work filters. */
export function Chip({ active = false, onClick, className, children }: ChipProps) {
  const classes = cn(
    'inline-flex h-9 items-center gap-2 rounded-sm border px-3.5 text-[14px] whitespace-nowrap',
    'transition-[color,border-color,background-color] duration-[160ms] ease-mark',
    active
      ? 'border-ink bg-ink text-surface'
      : 'border-line-strong text-ink-muted hover:border-ink hover:text-ink',
    className,
  );

  if (!onClick) return <span className={classes}>{children}</span>;

  return (
    <button type="button" onClick={onClick} aria-pressed={active} className={classes}>
      {children}
    </button>
  );
}

export default Chip;
