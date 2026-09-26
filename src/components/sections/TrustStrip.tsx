import type { CSSProperties } from 'react';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';
import { Nuqta } from '@/components/brand/Nuqta';
import { CountUp } from '@/components/motion/CountUp';
import { ClientMark } from '@/components/sections/ClientMark';
import type { ClientLogo, Site } from '@/lib/content';

/**
 * One client mark, linking to its case study.
 *
 * Sized by the square root of the aspect ratio — a wide wordmark and a square
 * badge then cover the same area — times a per-logo optical `scale`, with the
 * height capped so a tall mark can't tower over the row. `--logo-k` is the
 * base size, set per breakpoint by the parent.
 */
function Mark({ client, tabbable = true }: { client: ClientLogo; tabbable?: boolean }) {
  const ratio = client.width / client.height;
  const width = `min(calc(var(--logo-k) * ${(Math.sqrt(ratio) * client.scale).toFixed(3)}), calc(var(--logo-k) * ${(1.3 * ratio).toFixed(3)}))`;

  return (
    <Link
      href={client.href}
      aria-label={client.name}
      title={client.name}
      tabIndex={tabbable ? undefined : -1}
      className="inline-flex items-center justify-center p-2 opacity-90 transition-opacity duration-[160ms] ease-mark hover:opacity-100 focus-visible:opacity-100"
    >
      <ClientMark client={client} style={{ width }} />
    </Link>
  );
}

/**
 * Real client logos, each linking to the work delivered for that client.
 *
 * The spec's one allowed loop: a slow marquee that pauses on hover. Under
 * reduced motion it is replaced by the same marks, wrapped and still.
 * The counts beneath roll up once, the first time they enter view.
 */
export function TrustStrip({ site, clients }: { site: Site; clients: ClientLogo[] }) {
  return (
    <section
      className="bg-surface pt-12 [--logo-k:56px] sm:[--logo-k:62px] md:pt-16 lg:[--logo-k:68px]"
      aria-labelledby="clients-title"
    >
      <Container className="flex flex-col items-center">
        <Reveal as="h2" id="clients-title" className="eyebrow m-0 text-center text-ink-faint">
          {site.trust.logosTitle}
        </Reveal>
      </Container>

      <div
        className="relative mt-12 overflow-hidden motion-reduce:hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        }}
      >
        <div className="at-marquee at-marquee-slow flex w-max items-center hover:[animation-play-state:paused]">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1}
              className="flex flex-none items-center gap-14 pe-14 lg:gap-20 lg:pe-20"
            >
              {clients.map((c) => (
                <li key={c.slug}>
                  <Mark client={c} tabbable={copy === 0} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <Container className="hidden motion-reduce:block">
        <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {clients.map((c) => (
            <li key={c.slug}>
              <Mark client={c} />
            </li>
          ))}
        </ul>
      </Container>

      {/* The figures on a raised panel with the cut: numbers set large and
          left to right, the "+" a small vermilion superscript. */}
      <Container>
        <dl
          className="at-cut mt-14 grid grid-cols-2 gap-x-6 gap-y-12 bg-surface-raised px-6 py-10 md:mt-20 md:grid-cols-4 md:gap-x-10 md:px-12 md:py-14"
          style={{ '--cut': '28px' } as CSSProperties}
        >
          {site.trust.stats.map((stat, i) => {
            const plus = stat.value.includes('+');
            const digits = stat.value.replace('+', '');
            return (
              <Reveal key={stat.label} as="div" delay={i * 0.08} className="flex flex-col gap-4">
                <dd
                  dir="ltr"
                  className="order-1 m-0 flex items-start self-start font-sans text-[clamp(3.25rem,2.4rem+3.6vw,5.75rem)] font-semibold leading-[0.85] tracking-[-0.05em] text-ink tabular-nums"
                >
                  <CountUp value={digits} />
                  {plus ? (
                    <span aria-hidden="true" className="ms-1 text-[0.42em] font-medium leading-none text-vermilion">
                      +
                    </span>
                  ) : null}
                  {plus ? <span className="sr-only">+</span> : null}
                </dd>
                <dt className="order-2 flex items-center gap-2.5 body-sm text-ink-muted">
                  <Nuqta size={7} tone="muted" />
                  {stat.label}
                </dt>
              </Reveal>
            );
          })}
        </dl>
      </Container>
    </section>
  );
}

export default TrustStrip;
