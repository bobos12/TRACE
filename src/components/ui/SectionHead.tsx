import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Reveal } from '@/components/motion/Reveal';

export interface SectionHeadProps {
  /** No longer shown — section titles stand alone (owner, 2026-10-13). */
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
 * The section header: the title from the leading edge, the lead and an
 * optional action beneath it. No eyebrow (owner, 2026-10-13).
 */
export function SectionHead({
  title,
  lead,
  action,
  size = 'lg',
  className,
}: SectionHeadProps) {
  return (
    <div className={cn('grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-12', className)}>
      <div className="flex flex-col gap-6 md:col-span-10">
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
