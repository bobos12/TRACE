'use client';

import { useId, useState } from 'react';
import { cn } from '@/lib/cn';
import { Nuqta } from '@/components/brand/Nuqta';

export interface TabItem {
  label: string;
  value?: string;
  count?: number;
}

export interface TabsProps {
  items: Array<TabItem | string>;
  /** Controlled value. Omit for uncontrolled. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Compact period/filter switch (Week · Month · Quarter). */
  variant?: 'underline' | 'segmented';
  label?: string;
  className?: string;
}

const valueOf = (item: TabItem | string) =>
  typeof item === 'string' ? item : (item.value ?? item.label);

/**
 * Switch between views of the same object. The selected tab gets an ink
 * underline and a nuqta. Up to six tabs; never for sequential steps.
 */
export function Tabs({
  items,
  value,
  defaultValue,
  onChange,
  variant = 'underline',
  label,
  className,
}: TabsProps) {
  const id = useId();
  const first = items[0] ? valueOf(items[0]) : '';
  const [internal, setInternal] = useState(defaultValue ?? first);
  const active = value ?? internal;

  const select = (next: string) => {
    if (value === undefined) setInternal(next);
    onChange?.(next);
  };

  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn(
        variant === 'segmented'
          ? 'inline-flex gap-0.5 rounded-md bg-surface-sunken p-[3px]'
          : 'flex gap-6 border-b border-line',
        className,
      )}
    >
      {items.map((item) => {
        const v = valueOf(item);
        const text = typeof item === 'string' ? item : item.label;
        const count = typeof item === 'string' ? undefined : item.count;
        const selected = v === active;

        return (
          <button
            key={v}
            id={`${id}-${v}`}
            role="tab"
            type="button"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => select(v)}
            className={cn(
              'relative inline-flex items-center gap-2 text-[14px] font-medium transition-colors duration-[160ms] ease-mark',
              selected ? 'text-ink' : 'text-ink-muted hover:text-ink',
              variant === 'segmented'
                ? cn(
                    'rounded-[3px] px-3 py-1.5',
                    selected && 'bg-surface-raised shadow-[0_0_0_1px_var(--line)]',
                  )
                : cn(
                    'py-3',
                    selected &&
                      'after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-ink',
                  ),
            )}
          >
            {selected && variant === 'underline' ? <Nuqta size={8} /> : null}
            {text}
            {count !== undefined ? (
              <span className="font-mono text-[11px] text-ink-muted">{count}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
