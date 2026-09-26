import type { Metadata } from 'next';
import QRCode from 'qrcode';
import { setRequestLocale } from 'next-intl/server';

import { readLocale, routing } from '@/i18n/routing';
import { getLocalServices, getSite } from '@/lib/content';
import { contact, mailHref, phoneHref, whatsappHref } from '@/lib/contact';
import { hasLeadBackend } from '@/lib/leads';
import { pageMetadata } from '@/lib/seo';

import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';
import { StopText } from '@/components/brand/Nuqta';
import { Icon } from '@/components/ui/Icon';
import { ContactForm } from '@/components/contact/ContactForm';
import { WhatsAppCard, CallCard } from '@/components/contact/ContactCards';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = readLocale((await params).locale);
  const site = getSite(locale);
  return pageMetadata({
    locale,
    path: '/contact',
    title: site.ui.contact,
    description: site.contactPage.lead,
  });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = readLocale((await params).locale);
  setRequestLocale(locale);

  const site = getSite(locale);
  const services = getLocalServices(locale);
  const copy = site.contactPage;

  // The QR is generated at build time and inlined — no client-side QR library.
  const waHref = whatsappHref(locale, site.ui.contact);
  const qr = await QRCode.toString(waHref, {
    type: 'svg',
    margin: 0,
    errorCorrectionLevel: 'M',
    color: { dark: '#14130F', light: '#0000' },
  });

  return (
    <>
      <Breadcrumbs locale={locale} trail={[{ name: site.ui.contact, path: '/contact' }]} />

      <section data-conversion-zone className="bg-surface pt-32 pb-[var(--section-y)]">
        <Container className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-8">
          {/* Left — WhatsApp first, then call, then the details. */}
          <div className="flex flex-col gap-8 lg:col-span-5">
            {/* The first screenful never animates in — see PageHero. */}
            <div className="flex flex-col gap-5">
              <h1 className="display-lg m-0">
                <StopText>{copy.title}</StopText>
              </h1>
              <p className="body-lg max-w-[46ch] text-ink-muted">{copy.lead}</p>
            </div>

            <div>
              <WhatsAppCard
                label={site.cta.whatsapp}
                note={contact.responseTime[locale]}
                qrSvg={qr}
                context={site.ui.contact}
              />
            </div>

            <Reveal delay={0.14}>
              <CallCard label={site.cta.call} />
            </Reveal>

            <Reveal delay={0.18}>
              <dl className="flex flex-col gap-4 border-t border-line pt-6">
                <div className="flex flex-col gap-1">
                  <dt className="eyebrow text-ink-faint">{site.cta.email}</dt>
                  <dd>
                    <a
                      href={mailHref(site.ui.contact)}
                      className="body text-ink underline decoration-line-strong underline-offset-4 hover:decoration-nuqta"
                    >
                      {contact.email}
                    </a>
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="eyebrow text-ink-faint">{site.ui.hoursLabel}</dt>
                  <dd className="body text-ink-muted">{contact.hours[locale]}</dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="eyebrow text-ink-faint">{contact.cities[locale].join(' · ')}</dt>
                  <dd className="body text-ink-muted" dir="ltr">
                    <a href={phoneHref(true)} className="hover:text-ink">
                      {contact.phoneSecondaryDisplay}
                    </a>
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>

          {/* Right — the form. */}
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.08} className="flex flex-col gap-8">
              <div className="flex items-center gap-3">
                <Icon name="inbox" size={20} className="text-ink-muted" />
                <h2 className="heading-2">{site.ui.formTitle}</h2>
              </div>
              <ContactForm
                site={site}
                serviceTitles={services.map((s) => s.title)}
                hasBackend={hasLeadBackend()}
              />
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
