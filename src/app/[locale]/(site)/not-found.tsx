import { getLocale } from 'next-intl/server';
import { readLocale } from '@/i18n/routing';
import { getSite } from '@/lib/content';
import { Container } from '@/components/ui/Container';
import { StopText } from '@/components/brand/Nuqta';
import { LinkButton } from '@/components/ui/LinkButton';
import { BookCallButton } from '@/components/contact/ContactButtons';
import { BrokenConstellation } from '@/components/brand/BrokenConstellation';

/**
 * "This page left no trace." — TRACE's constellation with one nuqta missing.
 * Both routes out are one tap: book a call, or home.
 */
export default async function NotFound() {
  const locale = readLocale(await getLocale());
  const site = getSite(locale);
  const copy = site.pages.notFound;

  return (
    <section className="flex min-h-[70svh] items-center bg-surface py-[var(--section-y)]">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col gap-6 lg:col-span-7">
          <p className="eyebrow text-ink-muted">{copy.eyebrow}</p>
          <h1 className="display-lg m-0">
            <StopText>{site.ui.notFoundTitle}</StopText>
          </h1>
          <p className="body-lg max-w-[48ch] text-ink-muted">{site.ui.notFoundText}</p>
          <div className="flex flex-wrap items-center gap-3">
            <BookCallButton placement="404" size="lg">
              {site.cta.book}
            </BookCallButton>
            <LinkButton href="/" variant="secondary" size="lg" iconEnd="arrow-right">
              {site.ui.backHome}
            </LinkButton>
          </div>
        </div>

        <div className="lg:col-span-4 lg:col-start-9 lg:justify-self-end">
          <BrokenConstellation size={34} />
        </div>
      </Container>
    </section>
  );
}
