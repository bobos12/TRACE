'use client';

import { useId, useState, type ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';

/** A full-width button that opens and closes the detail beneath it, at every width. */
export function Disclosure({
  more,
  less,
  children,
}: {
  more: string;
  less: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div className="flex flex-col gap-5">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-sm text-[15px] font-medium text-ink shadow-[inset_0_0_0_1px_var(--line-strong)] transition-[box-shadow] duration-[160ms] ease-mark hover:shadow-[inset_0_0_0_1px_var(--ink)]"
      >
        {open ? less : more}
        <Icon name="chevron-down" size={16} className={cn('transition-transform duration-[160ms] ease-mark', open && 'rotate-180')} />
      </button>
      <div id={id} hidden={!open} className="flex flex-col gap-5">
        {children}
      </div>
    </div>
  );
}

export default Disclosure;
