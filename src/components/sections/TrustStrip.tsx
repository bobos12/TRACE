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
export function Mark({ client }: { client: ClientLogo }) {
  const ratio = client.width / client.height;
  const width = `min(calc(var(--logo-k) * ${(Math.sqrt(ratio) * client.scale).toFixed(3)}), calc(var(--logo-k) * ${(1.3 * ratio).toFixed(3)}))`;

  const mark = <ClientMark client={client} style={{ width }} />;
  const box = 'inline-flex items-center justify-center p-2 opacity-90';

  // A logo-only client has no case study to open.
  if (!client.href) {
    return (
      <span role="img" aria-label={client.name} title={client.name} className={box}>
        {mark}
      </span>
    );
  }

  return (
    <Link
      href={client.href}
      aria-label={client.name}
      title={client.name}
      className={`${box} transition-opacity duration-[160ms] ease-mark hover:opacity-100 focus-visible:opacity-100`}
    >
      {mark}
    </Link>
  );
}

/** One commitment, set large, a nuqta before it. */
function Commitment({ text }: { text: string }) {
  return (
    <span className="flex items-center gap-4 whitespace-nowrap text-[clamp(1.25rem,1rem+1vw,1.75rem)] font-medium tracking-[-0.02em] text-ink">
      <Nuqta size={10} />
      {text}
    </span>
  );
}

/**
 * Proof, then terms. The real client logos, each linking to its case study;
 * then what every client gets in writing — NDA, ownership, fixed price,
 * cadence — in the spec's one allowed loop: a slow marquee that pauses on
 * hover, replaced under reduced motion by the same items, wrapped and still.
 * The counts beneath roll up once, the first time they enter view.
 */
export function TrustStrip({ site, clients }: { site: Site; clients: ClientLogo[] }) {
  const { promises } = site.trust;

  return (
    <section
      className="bg-surface pt-12 [--logo-k:46px] sm:[--logo-k:58px] md:pt-16 lg:[--logo-k:64px]"
      aria-labelledby="clients-title"
    >
      <Container className="flex flex-col items-center">
        <Reveal as="h2" id="clients-title" className="eyebrow m-0 text-center text-ink-faint">
          {site.trust.logosTitle}
        </Reveal>
        <ul className="mt-10 flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-8 sm:gap-x-12 lg:gap-x-20">
          {clients.map((c, i) => (
            <li
              key={c.slug}
              // Mobile: first client (Future Earth) goes to the middle of row one.
              className={`flex w-[calc((100%-1.5rem)/3)] items-center justify-center sm:order-0 sm:w-auto ${
                i === 0 ? 'order-1' : i === 1 ? 'order-0' : 'order-2'
              }`}
            >
              <Mark client={c} />
            </li>
          ))}
        </ul>
        <p className="eyebrow mt-14 text-center text-ink-faint">{site.trust.title}</p>
      </Container>

      <div
        className="relative mt-8 overflow-hidden motion-reduce:hidden"
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
              {promises.map((p) => (
                <li key={p}>
                  <Commitment text={p} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <Container className="hidden motion-reduce:block">
        <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {promises.map((p) => (
            <li key={p}>
              <Commitment text={p} />
            </li>
          ))}
        </ul>
      </Container>

      {/* The figures on an inverse panel with the cut — carbon on paper, paper
          on carbon: numbers set large, the "+" a small vermilion superscript. */}
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
                  <Nuqta size={7} />
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
