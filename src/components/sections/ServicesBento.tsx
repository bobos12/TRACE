import type { CSSProperties } from 'react';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui/Container';
import { SectionHead } from '@/components/ui/SectionHead';
import { Icon } from '@/components/ui/Icon';
import { Nuqta, StopText } from '@/components/brand/Nuqta';
import { ServiceIllustration } from '@/components/illustrations/ServiceIllustrations';
import { IlloLoop } from '@/components/illustrations/IlloLoop';
import { WhatsAppLink } from '@/components/contact/WhatsAppLink';
import { WhatsAppRequest } from '@/components/contact/WhatsAppRequest';
import type { LocalService, Site } from '@/lib/content';
import { cn } from '@/lib/cn';

/**
 * The bento, by position in services.json. Nine services tile a 4-column grid
 * exactly: one 2×2 anchor, four 2×1 wide tiles and four 1×1 tiles.
 *
 *   ┌──────── 0 ────────┬──── 1 ────┐
 *   │       (2×2)       │   (2×1)   │
 *   ├───────────────────┼─ 2 ─┬─ 3 ─┤
 *   ├──── 4 ────┬──── 5 ──────┴─────┤
 *   ├─ 6 ─┬─ 7 ─┼──── 8 ────────────┤
 *
 * Anything beyond nine falls back to a 1×1 tile.
 */
const SPANS = ['tall', 'wide', 'small', 'small', 'wide', 'wide', 'small', 'small', 'wide'] as const;
type Span = (typeof SPANS)[number];

const spanClass: Record<Span, string> = {
  tall: 'sm:col-span-2 lg:row-span-2',
  wide: 'sm:col-span-2',
  small: '',
};

function Tile({
  service,
  span,
  index,
  request,
  message,
}: {
  service: LocalService;
  span: Span;
  index: number;
  /** The button label, and the WhatsApp message with this service written in. */
  request: string;
  message: string;
}) {
  return (
    <div
      data-reveal="rise"
      style={{ '--d': `${index * 60}ms` } as CSSProperties}
      className={spanClass[span]}
    >
      {/* The whole tile opens the service page (a stretched link on the title);
          the WhatsApp button sits above it, one tap to ask about this service. */}
      <div
        className={cn(
          'group/tile relative flex h-full flex-col gap-6 rounded-md border border-line bg-surface-raised p-6',
          'transition-[border-color,transform] duration-[160ms] ease-mark',
          'hover:-translate-y-0.5 hover:border-ink has-[a:focus-visible]:border-ink',
        )}
      >
        <div
          className={cn(
            'flex flex-1 items-center justify-center',
            span === 'tall' ? 'min-h-[180px]' : 'min-h-[120px]',
          )}
        >
          <div
            className={cn(
              'w-full',
              span === 'tall' ? 'max-w-[420px]' : span === 'wide' ? 'max-w-[300px]' : 'max-w-[210px]',
            )}
          >
            <ServiceIllustration visual={service.visual} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="heading-3">
            <Link
              href={`/services/${service.slug}`}
              className="flex items-center gap-2 after:absolute after:inset-0 after:content-['']"
            >
              {service.title}
              <Icon
                name="arrow-right"
                size={16}
                className="text-ink-muted transition-transform duration-[160ms] ease-mark group-hover/tile:translate-x-1 rtl:group-hover/tile:-translate-x-1"
              />
            </Link>
          </h3>
          <p className="body-sm text-ink-muted">{service.line}</p>
        </div>

        <WhatsAppRequest
          placement="services"
          service={service.title}
          message={message}
          className="relative z-10 self-start"
        >
          {request}
        </WhatsAppRequest>
      </div>
    </div>
  );
}

export function ServicesBento({ site, services }: { site: Site; services: LocalService[] }) {
  return (
    <section id="services" className="border-b border-line bg-surface py-[var(--section-y)]">
      {/* The tiles' illustrations keep rebuilding while on screen. */}
      <IlloLoop scope="#services" />
      <Container className="flex flex-col gap-14">
        <SectionHead
          eyebrow={site.services.eyebrow}
          title={
            <StopText>{site.services.title}</StopText>
          }
          lead={site.services.lead}
          size="md"
          action={
            <Link
              href="/services"
              className="group/all inline-flex items-center gap-2 text-[14px] font-medium text-ink underline decoration-line-strong underline-offset-[6px] hover:decoration-nuqta"
            >
              {site.services.cta}
              <Icon
                name="arrow-right"
                size={16}
                className="transition-transform duration-[160ms] ease-mark group-hover/all:translate-x-1 rtl:group-hover/all:-translate-x-1"
              />
            </Link>
          }
        />

        {/* Everything we build, in words a business owner uses — one line that
            drifts slowly (the spec's "slow chip marquee"), pausing on hover.
            Under reduced motion it is simply wrapped and still. */}
        <div className="border-y border-line py-6">
          <div
            className="relative overflow-hidden motion-reduce:hidden"
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
            }}
          >
            <div className="at-marquee at-marquee-slow flex w-max hover:[animation-play-state:paused]">
              {[0, 1].map((copy) => (
                <ul key={copy} aria-hidden={copy === 1} className="flex flex-none items-center gap-9 pe-9">
                  {site.services.capabilities.map((c) => (
                    <li
                      key={c}
                      className="flex items-center gap-3 whitespace-nowrap text-[17px] font-medium text-ink"
                    >
                      <Nuqta size={8} tone="muted" />
                      {c}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
          <ul className="hidden flex-wrap gap-x-6 gap-y-3 motion-reduce:flex">
            {site.services.capabilities.map((c) => (
              <li key={c} className="flex items-center gap-2.5 text-[15px] font-medium text-ink">
                <Nuqta size={7} tone="muted" />
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid auto-rows-[minmax(0,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <Tile
              key={service.slug}
              service={service}
              span={SPANS[i] ?? 'small'}
              index={i}
              request={site.services.request}
              message={site.services.requestMessage.replace('{service}', service.title)}
            />
          ))}
        </div>

        <div className="flex justify-center">
          <WhatsAppLink placement="services" context={site.services.title}>
            {site.ui.servicesAsk}
          </WhatsAppLink>
        </div>
      </Container>
    </section>
  );
}

export default ServicesBento;
