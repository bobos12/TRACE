import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { StopText } from '@/components/brand/Nuqta';
import { cn } from '@/lib/cn';

export interface PageHeroProps {
  eyebrow: string;
  title: string;
  lead?: string;
  /** Sits to the trailing side on desktop — a constellation, a mark, a stat row. */
  aside?: ReactNode;
  /** Extra content under the lead: CTAs, filters, facts. */
  children?: ReactNode;
  className?: string;
  /** Tighter padding so the next section shows in the first view. */
  compact?: boolean;
}

/**
 * The opening band of every inner page: eyebrow, a display headline ending in
 * the nuqta, a short lead, and an optional brand graphic to the trailing side.
 *
 * Nothing here animates in. This is the first screenful, so anything starting
 * at `opacity: 0` leaves the browser with no LCP candidate until hydration —
 * Lighthouse reported `NO_LCP` on these pages when it did. Same rule as the
 * home hero; see DECISIONS.md.
 */
export function PageHero({ eyebrow, title, lead, aside, children, className, compact }: PageHeroProps) {
  return (
    <section className={cn('border-b border-line bg-surface', className)}>
      <Container
        className={cn(
          'grid grid-cols-1 items-center lg:grid-cols-12 lg:gap-8',
          compact ? 'gap-8 pt-24 pb-10 md:pb-12' : 'gap-12 pt-32 pb-[clamp(3rem,2rem+4vw,5rem)]',
        )}
      >
        <div className={cn('flex flex-col gap-6', aside ? 'lg:col-span-7' : 'lg:col-span-10')}>
          <p className="eyebrow text-ink-muted">{eyebrow}</p>
          <h1 className="display-lg m-0">
            <StopText>{title}</StopText>
          </h1>
          {lead ? <p className="body-lg max-w-[52ch] text-ink-muted">{lead}</p> : null}
          {children}
        </div>

        {aside ? (
          <div className="lg:col-span-4 lg:col-start-9 lg:justify-self-end">{aside}</div>
        ) : null}
      </Container>
    </section>
  );
}

export default PageHero;
