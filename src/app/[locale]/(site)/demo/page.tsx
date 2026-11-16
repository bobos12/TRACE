import type { Metadata } from 'next';
import Script from 'next/script';
import type { CSSProperties } from 'react';
import { setRequestLocale } from 'next-intl/server';

import { readLocale, routing } from '@/i18n/routing';
import { getSite } from '@/lib/content';
import { contact } from '@/lib/contact-data';
import { pageMetadata } from '@/lib/seo';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';
import { Icon } from '@/components/ui/Icon';
import { StopText } from '@/components/brand/Nuqta';
import { buttonClasses } from '@/components/ui/buttonStyles';
import { BookCallButton, CallButton, EmailButton } from '@/components/contact/ContactButtons';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { TrackedVideo } from '@/components/demo/TrackedVideo';
import { CallbackForm } from '@/components/demo/CallbackForm';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = readLocale((await params).locale);
  const { seo } = getSite(locale).pages.demoVideo;
  return pageMetadata({ locale, path: '/demo', title: seo.title, description: seo.description });
}

/**
 * Where the campaign emails land (/demo?rid=<recipient>). The video plays
 * first, as the email promised; straight under it, the live demo and four
 * places to start; then every way to reach us, including "call me back".
 * Every step — video progress, clicks, the demo itself — goes to the
 * prospect tracker (public/demos/_shared/trace-track.js), tied to the
 * recipient id for the campaign tool.
 */
export default async function DemoPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = readLocale((await params).locale);
  setRequestLocale(locale);
  const site = getSite(locale);
  const copy = site.pages.demoVideo;
  const sms = contact.phone ? `sms:${contact.phone}` : null;

  return (
    <>
      <Script src="/demos/_shared/trace-track.js" data-site="Demo video page" strategy="afterInteractive" />
      <Breadcrumbs trail={[{ name: copy.seo.title, path: '/demo' }]} />

      <section className="band-carbon border-b border-line bg-surface pt-28 pb-[var(--section-y)] text-ink md:pt-32">
        <Container className="flex flex-col gap-10 md:gap-12">
          <div className="flex max-w-[54rem] flex-col gap-5">
            <p className="eyebrow text-ink-muted">{copy.eyebrow}</p>
            <h1 className="display-lg m-0">
              <StopText>{copy.title}</StopText>
            </h1>
            <p className="body-lg max-w-[60ch] text-ink-muted">{copy.lead}</p>
          </div>

          <div className="mx-auto w-full max-w-[1100px]">
            <TrackedVideo id={copy.videoId} title={copy.videoTitle} />
          </div>

          {/* Straight under the video: the demo, and where to start. */}
          <div className="grid grid-cols-1 gap-8 border-t border-line pt-10 md:grid-cols-12 md:gap-10">
            <div className="flex flex-col items-start gap-5 md:col-span-4">
              <h2 className="heading-1 m-0">
                <StopText>{copy.tryTitle}</StopText>
              </h2>
              <p className="body text-ink-muted">{copy.tryLead}</p>
              <a
                href={copy.demoHref}
                data-track="demo"
                className={buttonClasses({ variant: 'primary', size: 'lg', cut: true })}
                style={{ '--cut': '14px' } as CSSProperties}
              >
                <span>{copy.demoCta}</span>
                <Icon name="arrow-up-right" size={20} />
              </a>
            </div>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:col-span-8">
              {copy.tasks.map((task, i) => (
                <Reveal as="li" key={task.href} delay={i * 0.05}>
                  <a
                    href={task.href}
                    data-track="demo"
                    className="group/task flex h-full flex-col gap-2 rounded-md bg-surface-raised p-5 ring-1 ring-line transition-[box-shadow] duration-[200ms] ease-mark hover:ring-line-strong"
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="heading-3">{task.label}</span>
                      <Icon name="arrow-right" size={18} className="flex-none text-nuqta transition-transform duration-[160ms] ease-mark group-hover/task:translate-x-1" />
                    </span>
                    <span className="body-sm text-ink-muted">{task.text}</span>
                  </a>
                </Reveal>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Every way to reach us. */}
      <section id="talk" className="border-b border-line bg-surface py-[var(--section-y)]">
        <Container className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
          <div className="flex flex-col gap-6 md:col-span-6">
            <h2 className="display-md m-0">
              <StopText>{copy.contactTitle}</StopText>
            </h2>
            <p className="body-lg max-w-[48ch] text-ink-muted">{copy.contactLead}</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <BookCallButton placement="landing:demo" size="lg">{copy.book}</BookCallButton>
              <CallButton placement="landing:demo" size="lg" showNumber>{copy.call}</CallButton>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {sms ? (
                <a href={sms} data-track="text" className="inline-flex items-center gap-2 text-[15px] font-medium text-ink underline decoration-line-strong underline-offset-[6px] hover:decoration-nuqta">
                  {copy.text}
                </a>
              ) : null}
              <EmailButton placement="landing:demo" variant="ghost" subject="Bail agency website">{copy.email}</EmailButton>
            </div>
          </div>
          <div className="rounded-md bg-surface-raised p-6 ring-1 ring-line md:col-span-6 md:p-8">
            <CallbackForm copy={copy} />
          </div>
        </Container>
      </section>
    </>
  );
}
