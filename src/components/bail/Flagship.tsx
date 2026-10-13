import type { CSSProperties } from 'react';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';
import { Icon } from '@/components/ui/Icon';
import { Nuqta, StopText } from '@/components/brand/Nuqta';
import { BookCallButton } from '@/components/contact/ContactButtons';
import { buttonClasses } from '@/components/ui/buttonStyles';
import type { BailBonds } from '@/lib/content';
import { FlagshipTour } from './FlagshipTour';

/**
 * The answer to the 2 a.m. search, already built: Ellison & Reyes, a demo
 * agency on real, working software. A carbon band of its own — the promise
 * and the button that opens the live site, then a tour of genuine captures,
 * front desk to back office, then what it adds up to and the call to book.
 * The agency's name is a demo's, and the label says so.
 */
export function Flagship({ copy, demo, caseStudy }: { copy: BailBonds; demo: string; caseStudy: string }) {
  const f = copy.flagship;

  return (
    <section
      id="live-agency"
      className="band-carbon scroll-mt-16 border-b border-line bg-surface py-[var(--section-y)] text-ink"
      aria-labelledby="flagship-title"
    >
      <Container className="flex flex-col gap-12 md:gap-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="flex flex-col gap-6 lg:col-span-8">
            <Reveal as="p" className="eyebrow flex items-center gap-2.5 text-ink-muted">
              <Nuqta size={7} />
              {f.concept}
            </Reveal>
            <Reveal as="h2" id="flagship-title" delay={0.04} className="display-lg m-0 max-w-[18ch]">
              <StopText>{f.title}</StopText>
            </Reveal>
            <Reveal as="p" delay={0.08} className="body-lg max-w-[56ch] text-ink-muted">
              {f.lead}
            </Reveal>
          </div>
          <Reveal delay={0.12} className="flex flex-col items-start gap-5 lg:col-span-4 lg:items-end">
            <a
              href={demo}
              target="_blank"
              rel="noreferrer"
              className={buttonClasses({ variant: 'primary', size: 'lg', cut: true })}
              style={{ '--cut': '14px' } as CSSProperties}
            >
              <span>{f.demoCta}</span>
              <Icon name="arrow-up-right" size={20} />
            </a>
            <Link
              href={caseStudy}
              className="group/case inline-flex items-center gap-2 text-[15px] font-medium text-ink underline decoration-line-strong underline-offset-[6px] hover:decoration-nuqta"
            >
              {f.caseCta}
              <Icon
                name="arrow-right"
                size={16}
                className="transition-transform duration-[160ms] ease-mark group-hover/case:translate-x-1"
              />
            </Link>
          </Reveal>
        </div>

        <Reveal>
          <FlagshipTour copy={f} />
        </Reveal>

        {/* What it adds up to. */}
        <dl className="grid grid-cols-2 border-t border-line sm:grid-cols-3 lg:grid-cols-5">
          {f.facts.map((fact, i) => (
            <div
              key={fact.label}
              data-reveal="rise"
              style={{ '--d': `${i * 60}ms` } as CSSProperties}
              className="flex flex-col gap-2 border-b border-line py-6 pe-4 lg:border-b-0 lg:not-first:border-s lg:not-first:ps-6"
            >
              <dt className="order-2 body-sm text-ink-muted">{fact.label}</dt>
              <dd className="order-1 m-0 font-mono text-[clamp(1.75rem,1.3rem+1.4vw,2.5rem)] font-medium leading-none tracking-[-0.03em]">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="flex max-w-[52ch] flex-col gap-3">
            <Reveal as="h3" className="heading-1 m-0">
              <StopText>{f.close.title}</StopText>
            </Reveal>
            <Reveal as="p" delay={0.06} className="body-lg text-ink-muted">
              {f.close.text}
            </Reveal>
          </div>
          <Reveal delay={0.1} className="flex-none">
            <BookCallButton placement="landing:bail-bonds-flagship" size="lg">
              {f.close.cta}
            </BookCallButton>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

export default Flagship;
