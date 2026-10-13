import type { CSSProperties } from 'react';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui/Container';
import { SectionHead } from '@/components/ui/SectionHead';
import { Icon } from '@/components/ui/Icon';
import { StopText } from '@/components/brand/Nuqta';
import { ServiceIllustration } from '@/components/illustrations/ServiceIllustrations';
import { IlloLoop } from '@/components/illustrations/IlloLoop';
import { BookingLink } from '@/components/contact/BookingLink';
import { ServiceRequest } from '@/components/contact/ServiceRequest';
import type { LocalService, Site } from '@/lib/content';
import { cn } from '@/lib/cn';

/**
 * The few services a client needs to see first, as compact tiles — four
 * across on desktop, two on tablets, a swipe row on phones. The full list
 * is one click away on /services.
 */
function Tile({
  service,
  index,
  request,
  subject,
}: {
  service: LocalService;
  index: number;
  /** The button label, and the email subject with this service written in. */
  request: string;
  subject: string;
}) {
  return (
    <li
      data-reveal="rise"
      style={{ '--d': `${index * 60}ms` } as CSSProperties}
      className="w-[78%] flex-none snap-start sm:w-auto"
    >
      {/* The whole tile opens the service page (a stretched link on the title);
          the enquiry button sits above it, one tap to ask about this service. */}
      <div
        className={cn(
          'group/tile relative flex h-full flex-col gap-4 rounded-md border border-line bg-surface-raised p-5',
          'transition-[border-color,transform] duration-[160ms] ease-mark',
          'hover:-translate-y-0.5 hover:border-ink has-[a:focus-visible]:border-ink',
        )}
      >
        <div className="flex h-[88px] items-center justify-center">
          <div className="w-full max-w-[160px]">
            <ServiceIllustration visual={service.visual} />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-1.5">
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

        <ServiceRequest
          placement="services"
          service={service.title}
          subject={subject}
          className="relative z-10 self-start"
        >
          {request}
        </ServiceRequest>
      </div>
    </li>
  );
}

export function ServicesBento({ site, services }: { site: Site; services: LocalService[] }) {
  return (
    <section id="services" className="border-b border-line bg-surface py-[var(--section-y)]">
      {/* The tiles' illustrations keep rebuilding while on screen. */}
      <IlloLoop scope="#services" />
      <Container className="flex flex-col gap-10">
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

        <ul className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-3 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
          {services.map((service, i) => (
            <Tile
              key={service.slug}
              service={service}
              index={i}
              request={site.services.request}
              subject={site.services.requestMessage.replace('{service}', service.title)}
            />
          ))}
        </ul>

        <div className="flex justify-center">
          <BookingLink placement="services">
            {site.ui.servicesAsk}
          </BookingLink>
        </div>
      </Container>
    </section>
  );
}

export default ServicesBento;
