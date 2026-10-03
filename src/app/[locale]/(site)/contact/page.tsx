import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { readLocale, routing } from '@/i18n/routing';
import { getLocalServices, getSite } from '@/lib/content';
import { contact } from '@/lib/contact';
import { hasLeadBackend } from '@/lib/leads';
import { pageMetadata } from '@/lib/seo';

import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';
import { StopText } from '@/components/brand/Nuqta';
import { Icon } from '@/components/ui/Icon';
import { ContactForm } from '@/components/contact/ContactForm';
import { BookCard, ChatCallRow, EmailCard } from '@/components/contact/ContactCards';
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

  return (
    <>
      <Breadcrumbs trail={[{ name: site.ui.contact, path: '/contact' }]} />

      <section data-conversion-zone className="bg-surface pt-32 pb-[var(--section-y)]">
        <Container className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-8">
          {/* Left — book a call first, then email, then chat and phone, then the details. */}
          <div className="flex flex-col gap-8 lg:col-span-5">
            {/* The first screenful never animates in — see PageHero. */}
            <div className="flex flex-col gap-5">
              <h1 className="display-lg m-0">
                <StopText>{copy.title}</StopText>
              </h1>
              <p className="body-lg max-w-[46ch] text-ink-muted">{copy.lead}</p>
            </div>

            <BookCard label={site.cta.book} note={site.cta.bookNote} placement="contact-page" />

            <Reveal delay={0.1}>
              <EmailCard label={site.cta.email} subject={site.ui.contact} placement="contact-page" />
            </Reveal>

            <Reveal delay={0.14}>
              <ChatCallRow
                whatsappLabel={site.cta.whatsapp}
                callLabel={site.cta.call}
                placement="contact-page"
                context={site.ui.contact}
              />
            </Reveal>

            <Reveal delay={0.18}>
              <dl className="flex flex-col gap-4 border-t border-line pt-6">
                <div className="flex flex-col gap-1">
                  <dt className="eyebrow text-ink-faint">{site.ui.hoursLabel}</dt>
                  <dd className="body text-ink-muted">{contact.hours[locale]}</dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="eyebrow text-ink-faint">{contact.cities[locale].join(' · ')}</dt>
                  <dd className="body text-ink-muted">{contact.responseTime[locale]}</dd>
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
