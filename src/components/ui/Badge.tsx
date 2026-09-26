import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'outline';

const tones: Record<BadgeTone, string> = {
  neutral: 'bg-surface-sunken text-ink shadow-[inset_0_0_0_1px_var(--line)]',
  accent: 'bg-nuqta-soft text-nuqta',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  outline: 'bg-transparent shadow-[inset_0_0_0_1px_var(--line-strong)]',
};

export interface BadgeProps {
  tone?: BadgeTone;
  /** A nuqta in the badge colour. */
  dot?: boolean;
  className?: string;
  children: ReactNode;
}

/** One or two words of status. Status always carries the word, never colour alone. */
export function Badge({ tone = 'neutral', dot = false, className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex h-[22px] items-center gap-1.5 rounded-sm px-2 text-[12px] font-medium leading-none whitespace-nowrap',
        tones[tone],
        className,
      )}
    >
      {dot ? (
        <span
          aria-hidden="true"
          className="size-[7px] flex-none bg-current"
          style={{ transform: 'rotate(45deg) scale(0.7071)' }}
        />
      ) : null}
      {children}
    </span>
  );
}

export default Badge;
