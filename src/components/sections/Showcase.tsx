import Image from 'next/image';
import type { CSSProperties } from 'react';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui/Container';
import { SectionHead } from '@/components/ui/SectionHead';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/motion/Reveal';
import { Nuqta, StopText } from '@/components/brand/Nuqta';
import { Browser } from '@/components/bail/Frames';
import { BookingLink } from '@/components/contact/BookingLink';
import { buttonClasses } from '@/components/ui/buttonStyles';
import { MiniEstimator } from './case/MiniEstimator';
import { Agents, Assistant, CallBar, JailMap, Payments, Reminders, StartOnline } from './case/Vignettes';
import type { BailBonds, LocalProject, Site } from '@/lib/content';
import { cn } from '@/lib/cn';

/** A phone bezel in tokens around a genuine 390×844 capture. */
export function PhoneShot({ src, alt = '', className }: { src: string; alt?: string; className?: string }) {
  return (
    <div className={cn('band-carbon overflow-hidden rounded-[28px] p-1.5 shadow-float ring-1 ring-line-strong', className)}>
      <div className="relative overflow-hidden rounded-[22px]">
        <Image src={src} alt={alt} width={780} height={1688} sizes="200px" className="h-auto w-full" />
      </div>
    </div>
  );
}

type Kind = Site['showcase']['features'][number]['kind'];

function Vignette({ kind, estimator }: { kind: Kind; estimator: BailBonds['details']['estimator'] }) {
  switch (kind) {
    case 'cost':
      return <MiniEstimator copy={estimator} />;
    case 'reminders':
      return <Reminders />;
    case 'call':
      return <CallBar />;
    case 'map':
      return <JailMap />;
    case 'agents':
      return <Agents />;
    case 'online':
      return <StartOnline />;
    case 'payments':
      return <Payments />;
    case 'assistant':
      return <Assistant />;
  }
}

/**
 * The case study — the strongest proof on the page, so it gets a carbon band
 * of its own: the Ellison & Reyes site large, on a phone beside it, what it
 * does in four figures and one button that opens it; then what it does for
 * the agency, as cards that each show a live piece of the product — the
 * estimator you can drag, the reminder thread, the agents on call — with the
 * words kept to a line. The agency's name is a demo's, and says so.
 */
export function Showcase({
  site,
  project,
  estimator,
}: {
  site: Site;
  project: LocalProject;
  /** The bond cost estimator's copy, shared with /bail-bonds. */
  estimator: BailBonds['details']['estimator'];
}) {
  const copy = site.showcase;
  const demo = project.links.demo;

  return (
    <section id="demo" className="band-carbon border-b border-line bg-surface py-[var(--section-y)] text-ink">
      <Container className="flex flex-col gap-10">
        <SectionHead eyebrow={copy.eyebrow} title={<StopText>{copy.title}</StopText>} lead={copy.lead} size="md" />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
          {/* The site, with the phone over its trailing corner. */}
          <Reveal className="relative pb-8 pe-[14%] sm:pb-10 lg:col-span-7">
            <a
              href={demo}
              target="_blank"
              rel="noreferrer"
              aria-label={`${copy.demoCta} — ${project.client}`}
              className="group/demo block"
            >
              <Browser url={copy.url}>
                <span className="relative block aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src="/images/ellison-reyes/site-home.jpg"
                    alt={project.title}
                    fill
                    sizes="(max-width: 1024px) 86vw, 60vw"
                    className="object-cover object-top transition-transform duration-[600ms] ease-mark group-hover/demo:scale-[1.02]"
                  />
                </span>
              </Browser>
            </a>
            <PhoneShot
              src="/images/ellison-reyes/mobile-start.jpg"
              className="absolute end-0 bottom-0 w-[30%] max-w-[220px]"
            />
          </Reveal>

          <div className="flex flex-col gap-8 lg:col-span-5">
            <p className="eyebrow flex items-center gap-2.5 text-ink-muted">
              <Nuqta size={7} />
              {copy.concept}
            </p>

            <dl className="order-3 grid grid-cols-2 gap-x-6 gap-y-8 lg:order-none">
              {copy.facts.map((f, i) => (
                <div
                  key={f.label}
                  data-reveal="rise"
                  style={{ '--d': `${i * 60}ms` } as CSSProperties}
                  className="flex flex-col gap-2 border-t border-line pt-4"
                >
                  <dt className="body-sm text-ink-muted">{f.label}</dt>
                  <dd className="m-0 font-mono text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-medium leading-none tracking-[-0.03em]">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="order-2 flex flex-col items-start gap-5 lg:order-none">
              <a
                href={demo}
                target="_blank"
                rel="noreferrer"
                className={buttonClasses({ variant: 'primary', size: 'lg', cut: true })}
                style={{ '--cut': '14px' } as CSSProperties}
              >
                <span>{copy.demoCta}</span>
                <Icon name="arrow-up-right" size={20} />
              </a>
              <Link
                href={`/work/${project.slug}`}
                className="group/case inline-flex items-center gap-2 text-[15px] font-medium text-ink underline decoration-line-strong underline-offset-[6px] hover:decoration-nuqta"
              >
                {copy.caseCta}
                <Icon
                  name="arrow-right"
                  size={16}
                  className="transition-transform duration-[160ms] ease-mark group-hover/case:translate-x-1"
                />
              </Link>
              <BookingLink placement={`project:${project.slug}`}>{site.ui.workAsk}</BookingLink>
            </div>
          </div>
        </div>

        {/* What it does: each card is a live piece of the product, its words
            kept to a line underneath. */}
        <div className="flex flex-col gap-6 border-t border-line pt-10">
          <Reveal as="h3" className="heading-2 m-0">
            {copy.featuresTitle}
          </Reveal>
          {/* Phones swipe through the cards; wider screens see them all. */}
          <ul className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-3 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-5 sm:gap-y-8 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
            {copy.features.map((f, i) => (
              <li
                key={f.kind}
                data-reveal="rise"
                style={{ '--d': `${(i % 4) * 70}ms` } as CSSProperties}
                className="w-[70%] flex-none snap-start sm:w-auto"
              >
                <article className="flex h-full flex-col gap-3 border-t border-line pt-4">
                  {/* The piece of the product, drawn at full size and shown at
                      three-quarters — a glimpse, not a tile. */}
                  <div className="h-[160px] overflow-hidden rounded-sm bg-surface-sunken/60 p-3 shadow-[inset_0_0_0_1px_var(--line)]">
                    <div className="h-[181px] w-[133.4%] origin-top-left scale-75">
                      <Vignette kind={f.kind} estimator={estimator} />
                    </div>
                  </div>
                  <h4 className="m-0 flex items-baseline gap-2 text-[15px] font-semibold tracking-[-0.01em]">
                    <span className="font-mono text-[11px] font-medium text-nuqta">{String(i + 1).padStart(2, '0')}</span>
                    {f.title}
                  </h4>
                  <p className="-mt-1.5 text-[13px] leading-snug text-ink-muted">{f.text}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

export default Showcase;
