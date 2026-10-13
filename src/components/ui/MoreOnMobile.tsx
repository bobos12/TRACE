'use client';

import { useId, useState, type ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';

/**
 * Detail that phones keep folded behind a button and wider screens always
 * show. The button and the fold exist only below `md`; above it the content
 * is simply there.
 */
export function MoreOnMobile({
  more,
  less,
  className,
  children,
}: {
  more: string;
  less: string;
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <>
      <div id={id} className={cn(open ? 'block' : 'hidden', 'md:block', className)}>
        {children}
      </div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 items-center justify-between rounded-sm px-4 text-[14px] font-medium text-ink shadow-[inset_0_0_0_1px_var(--line-strong)] md:hidden"
      >
        {open ? less : more}
        <Icon
          name="chevron-down"
          size={16}
          className={cn('transition-transform duration-[160ms] ease-mark', open && 'rotate-180')}
        />
      </button>
    </>
  );
}

export default MoreOnMobile;
