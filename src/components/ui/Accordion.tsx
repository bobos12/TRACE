'use client';

import { useId, useState } from 'react';
import { Icon } from './Icon';
import { cn } from '@/lib/cn';

export interface AccordionItem {
  q: string;
  a: string;
}

/**
 * FAQ accordion. Native disclosure semantics, one panel open at a time,
 * keyboard-operable because each header is a real button.
 */
export function Accordion({ items, className }: { items: AccordionItem[]; className?: string }) {
  const id = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className={cn('border-t border-line', className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="border-b border-line">
            <h3 className="m-0">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${id}-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-5 text-start"
              >
                <span className="heading-3">{item.q}</span>
                <Icon
                  name={isOpen ? 'minus' : 'plus'}
                  size={20}
                  className="flex-none text-ink-muted"
                />
              </button>
            </h3>
            <div id={`${id}-${i}`} hidden={!isOpen} className="pb-6">
              <p className="body max-w-[62ch] text-ink-muted">{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Accordion;
