import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Reveal } from '@/components/motion/Reveal';

export interface SectionHeadProps {
  /** Mono eyebrow, e.g. "02 ◆ SELECTED WORK". */
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Trailing slot — usually a link to the index page. */
  action?: ReactNode;
  /** display-lg by default; display-md for lighter sections. */
  size?: 'lg' | 'md';
  className?: string;
}

/**
 * The section header from the approved home design: the eyebrow sits in
 * columns 1–3 and the heading is offset to column 4 — asymmetry instead of a
 * centred stack. Collapses to a single column below 1024px.
 */
export function SectionHead({
  eyebrow,
  title,
  lead,
  action,
  size = 'lg',
  className,
}: SectionHeadProps) {
  return (
    <div className={cn('grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-12', className)}>
      {eyebrow ? (
        <Reveal className="eyebrow text-ink-muted md:col-span-3 md:pt-3">{eyebrow}</Reveal>
      ) : null}
      <div className={cn('flex flex-col gap-6', eyebrow ? 'md:col-span-9' : 'md:col-span-12')}>
        <Reveal as="h2" className={cn('m-0', size === 'lg' ? 'display-lg' : 'display-md')}>
          {title}
        </Reveal>
        {lead ? (
          <Reveal as="p" className="body-lg max-w-[56ch] text-ink-muted" delay={0.06}>
            {lead}
          </Reveal>
        ) : null}
        {action ? <Reveal delay={0.1}>{action}</Reveal> : null}
      </div>
    </div>
  );
}

export default SectionHead;
