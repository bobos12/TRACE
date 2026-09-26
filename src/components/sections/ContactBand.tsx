import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';
import { StopText } from '@/components/brand/Nuqta';
import type { Site } from '@/lib/content';
import type { Locale } from '@/i18n/routing';
import { contact } from '@/lib/contact-data';
import { ContactBandCards } from '@/components/contact/ContactBandCards';
import { WhatsAppBrief } from '@/components/contact/WhatsAppBrief';

/**
 * The conversion moment, at the foot of every page.
 *
 * Three cards, WhatsApp largest and vermilion with the cut, beside the
 * WhatsApp brief — pick the services you need and the message is written for
 * you. A slow trace draws around the WhatsApp card once when it enters view.
 *
 * `data-conversion-zone` tells the floating button and the mobile bar to hide
 * while this is on screen — no point floating a WhatsApp button over one.
 */
export function ContactBand({
  site,
  locale,
  context,
}: {
  site: Site;
  locale: Locale;
  /** Appended to the prefilled WhatsApp message: the page, project or service. */
  context?: string;
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
            <StopText>{site.cta.title}</StopText>
          </Reveal>
          <Reveal as="p" delay={0.06} className="body-lg max-w-[44ch] text-ink-muted">
            {site.cta.text}
          </Reveal>
          <Reveal as="p" delay={0.1} className="body-sm text-ink-faint">
            {contact.hours[locale]} · {contact.responseTime[locale]}
          </Reveal>
          <div className="mt-2">
            <ContactBandCards site={site} locale={locale} context={context} />
          </div>
        </div>

        {/* The brief: pick what you need, and WhatsApp opens with it written. */}
        <Reveal className="lg:col-span-7">
          <WhatsAppBrief
            copy={site.brief}
            services={[...site.services.capabilities, site.ui.notSure]}
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
