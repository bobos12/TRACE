import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';
import { StopText } from '@/components/brand/Nuqta';
import type { Site } from '@/lib/content';
import type { Locale } from '@/i18n/routing';
import { contact } from '@/lib/contact-data';
import { BookCard, CallRow, EmailCard } from '@/components/contact/ContactCards';
import { ProjectBrief } from '@/components/contact/ProjectBrief';

/**
 * The conversion moment, at the foot of every page.
 *
 * Book a call largest and vermilion with the cut, email beneath it, the phone
 * line quiet below — beside the project brief: pick the services you need
 * and the email is written for you. A slow trace draws around the booking card
 * once when it enters view.
 *
 * `data-conversion-zone` tells the floating button and the mobile bar to hide
 * while this is on screen — no point floating a booking button over one.
 */
export function ContactBand({
  site,
  locale,
  context,
  title = site.cta.title,
  services = [...site.services.capabilities, site.ui.notSure],
}: {
  site: Site;
  locale: Locale;
  /** Added to the brief: the page, project or service it was sent from. */
  context?: string;
  /** A page-specific headline in place of the shared one. */
  title?: string;
  /** The brief's options, when a page sells something narrower. */
  services?: string[];
}) {
  return (
    <section
      id="order"
      data-conversion-zone
      className="band-carbon py-[clamp(4rem,2rem+8vw,8rem)]"
      aria-labelledby="contact-band-title"
    >
      <Container className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col gap-6 lg:col-span-5">
          <Reveal as="h2" id="contact-band-title" className="display-lg m-0">
            <StopText>{title}</StopText>
          </Reveal>
          <Reveal as="p" delay={0.06} className="body-lg max-w-[44ch] text-ink-muted">
            {site.cta.text}
          </Reveal>
          <Reveal as="p" delay={0.1} className="body-sm text-ink-faint">
            {contact.hours[locale]} · {contact.responseTime[locale]}
          </Reveal>
          <div className="mt-2 flex flex-col gap-4">
            <BookCard label={site.cta.book} note={site.cta.bookNote} placement="contact-band" trace />
            <Reveal delay={0.06}>
              <EmailCard label={site.cta.email} subject={context} placement="contact-band" />
            </Reveal>
            <Reveal delay={0.1}>
              <CallRow callLabel={site.cta.call} placement="contact-band" />
            </Reveal>
          </div>
        </div>

        {/* The brief: pick what you need, and the email is written for you. */}
        <Reveal className="lg:col-span-7">
          <ProjectBrief
            copy={site.brief}
            services={services}
            optional={site.ui.optional}
            locale={locale}
            context={context}
          />
        </Reveal>
      </Container>
    </section>
  );
}

export default ContactBand;
