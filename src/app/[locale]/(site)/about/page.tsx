import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { readLocale, routing } from '@/i18n/routing';
import { getSite } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';
import { Nuqta, StopText } from '@/components/brand/Nuqta';
import { AthrMark } from '@/components/brand/AthrMark';
import { Constellation } from '@/components/brand/Constellation';
import { ContactBand } from '@/components/sections/ContactBand';
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
    path: '/about',
    title: site.ui.about,
    description: site.pages.about.lead,
  });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = readLocale((await params).locale);
  setRequestLocale(locale);

  const site = getSite(locale);
  const about = site.pages.about;

  return (
    <>
      <Breadcrumbs locale={locale} trail={[{ name: site.ui.about, path: '/about' }]} />

      {/* Hero — the name, made. */}
      <section className="border-b border-line bg-surface">
        <Container className="grid grid-cols-1 items-center gap-14 pt-32 pb-[var(--section-y)] lg:grid-cols-12 lg:gap-8">
          {/* The first screenful never animates in — see PageHero. */}
          <div className="flex flex-col gap-6 lg:col-span-7">
            <p className="eyebrow text-ink-muted">{about.eyebrow}</p>
            <h1 className="display-lg m-0">
              <StopText>{about.title}</StopText>
            </h1>
            <p className="body-lg max-w-[52ch] text-ink-muted">{about.lead}</p>
          </div>

          <div className="lg:col-span-4 lg:col-start-9 lg:justify-self-end">
            <AthrMark className="h-auto w-[180px] lg:w-[220px]" label={about.title} />
          </div>
        </Container>
      </section>

      {/* The story of the name. */}
      <section className="border-b border-line bg-surface py-[var(--section-y)]">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal as="p" className="eyebrow text-ink-faint lg:col-span-3 lg:pt-2">
            {about.meaningsTitle}
          </Reveal>
          <div className="flex flex-col gap-6 lg:col-span-8 lg:col-start-5">
            {about.story.map((paragraph, i) => (
              <Reveal
                as="p"
                key={paragraph.slice(0, 24)}
                delay={i * 0.05}
                className="body-lg max-w-[64ch] text-ink-muted"
              >
                {paragraph}
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Three readings, three commitments. */}
      <section className="border-b border-line bg-surface py-[var(--section-y)]">
        <Container>
          <ul className="grid grid-cols-1 border-t border-ink md:grid-cols-3">
            {about.meanings.map((m, i) => (
              <Reveal
                as="li"
                key={m.term}
                delay={i * 0.06}
                className={`flex flex-col gap-4 py-8 pe-8 ${i > 0 ? 'md:border-s md:border-line md:ps-8' : ''}`}
              >
                <span className="flex items-center gap-3">
                  <Nuqta size={10} />
                  <span className="eyebrow text-ink-muted">{m.term}</span>
                </span>
                <h2 className="heading-1">{m.title}</h2>
                <p className="body text-ink-muted">{m.text}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* How we work. */}
      <section className="border-b border-line bg-surface py-[var(--section-y)]">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal as="h2" className="display-md lg:col-span-4">
            {about.principlesTitle}
          </Reveal>
          <ul className="border-t border-line lg:col-span-7 lg:col-start-6">
            {about.principles.map((p, i) => (
              <Reveal
                as="li"
                key={p.title}
                delay={i * 0.05}
                className="flex flex-col gap-2 border-b border-line py-6"
              >
                <h3 className="heading-3">{p.title}</h3>
                <p className="body-sm max-w-[60ch] text-ink-muted">{p.text}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* Team — constellations stand in until real photos exist. */}
      <section className="border-b border-line bg-surface py-[var(--section-y)]">
        <Container className="flex flex-col gap-12">
          <Reveal as="h2" className="display-md">
            {about.teamTitle}
          </Reveal>
          <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {about.team.map((person, i) => (
              <Reveal
                as="li"
                key={person.name}
                delay={i * 0.06}
                className="flex flex-col gap-5 border-t border-line pt-6"
              >
                {/* TODO: real photo — drop it in public/images/team/ and swap
                    this constellation for a next/image. */}
                <div className="flex aspect-[4/5] w-full items-center justify-center bg-surface-sunken">
                  <Constellation seed={person.name} size={20} className="text-ink" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="heading-3">{person.name}</h3>
                  <p className="eyebrow text-ink-faint">{person.role}</p>
                  <p className="body-sm text-ink-muted">{person.line}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <ContactBand site={site} locale={locale} context={site.ui.about} />
    </>
  );
}
