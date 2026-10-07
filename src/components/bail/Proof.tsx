import type { CSSProperties } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHead } from '@/components/ui/SectionHead';
import { Reveal } from '@/components/motion/Reveal';
import { Nuqta, StopText } from '@/components/brand/Nuqta';
import { Mark } from '@/components/sections/TrustStrip';
import { Mark as PlatformMark } from '@/components/sections/Platforms';
import type { BailBonds, ClientLogo, Platform } from '@/lib/content';

/**
 * Who is behind it: the real clients the studio has built for (their own
 * logos, linking to the work), the platforms the sites run on, then the terms an agency gets in writing on an
 * inverse panel with the cut — carbon on paper, paper on carbon.
 */
export function Proof({
  copy,
  clients,
  platforms,
}: {
  copy: BailBonds;
  clients: ClientLogo[];
  platforms: Platform[];
}) {
  const { proof } = copy;

  return (
    <section
      className="border-b border-line bg-surface py-[var(--section-y)] [--logo-k:48px] sm:[--logo-k:54px] md:[--logo-k:58px]"
      aria-labelledby="proof-title"
    >
      <Container className="flex flex-col gap-14">
        <SectionHead
          eyebrow={proof.eyebrow}
          title={<span id="proof-title"><StopText>{proof.title}</StopText></span>}
          lead={proof.lead}
          size="md"
        />

        <div className="flex flex-col gap-8">
          <Reveal as="p" className="eyebrow text-ink-faint">{proof.logosTitle}</Reveal>
          <ul className="flex flex-wrap items-center gap-x-12 gap-y-8 md:gap-x-16">
            {clients.map((c) => (
              <li key={c.slug}>
                <Mark client={c} />
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-8">
          <Reveal as="p" className="eyebrow text-ink-faint">{proof.platformsTitle}</Reveal>
          <ul className="flex flex-wrap items-start gap-x-10 gap-y-8 md:gap-x-14">
            {platforms.map((p) => (
              <li key={p.slug} className="flex items-center gap-3">
                <PlatformMark platform={p} />
                <span className="flex flex-col">
                  <span className="font-semibold text-ink">{p.name}</span>
                  <span className="body-sm text-ink-faint">{p.kind}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="body-sm text-ink-faint">{proof.trademarkNote}</p>
        </div>

        <Reveal
          className="at-cut bg-surface-inverse px-6 py-10 text-ink-inverse md:px-12 md:py-14"
          style={{ '--cut': '28px' } as CSSProperties}
        >
          <h3 className="eyebrow text-ink-inverse/70">{proof.promisesTitle}</h3>
          <ul className="mt-8 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2 md:grid-cols-3">
            {proof.promises.map((p) => (
              <li key={p} className="flex items-baseline gap-3.5 border-t border-ink-inverse/15 pt-5">
                <Nuqta size={9} className="translate-y-[-2px]" />
                <span className="heading-3">{p}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}

export default Proof;
