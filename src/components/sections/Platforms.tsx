import type { CSSProperties } from 'react';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';
import { StopText } from '@/components/brand/Nuqta';
import type { Platform, Site } from '@/lib/content';

/** The platform's own mark, in its own colour. */
function Mark({ platform }: { platform: Platform }) {
  if (platform.image) {
    return (
      <Image src={platform.image} alt="" width={64} height={64} className="size-9 sm:size-12 md:size-16" />
    );
  }

  // Brand colours come from content/trust.json — they are the platform's
  // data, not ATHR tokens. No colour means the mark follows the ink.
  const ink = 'var(--ink)';
  return (
    <span
      aria-hidden="true"
      className="block size-9 bg-[var(--mark)] sm:size-12 md:size-16 dark:bg-[var(--mark-dark)]"
      style={
        {
          '--mark': platform.color ?? ink,
          '--mark-dark': platform.colorDark ?? platform.color ?? ink,
          maskImage: `url(${platform.icon})`,
          WebkitMaskImage: `url(${platform.icon})`,
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
        } as CSSProperties
      }
    />
  );
}

/**
 * The platforms the work actually runs on — a short, curated row a business
 * owner recognises, each named with what it is, not a wall of developer logos.
 */
export function Platforms({ site, platforms }: { site: Site; platforms: Platform[] }) {
  const copy = site.platforms;

  return (
    <section className="border-b border-line bg-surface py-[var(--section-y)]">
      <Container className="flex flex-col gap-10 md:gap-20">
        {/* Centred, like the marks beneath it. */}
        <div className="mx-auto flex max-w-[44rem] flex-col items-center gap-6 text-center">
          <Reveal className="eyebrow text-ink-muted">{copy.eyebrow}</Reveal>
          <Reveal as="h2" className="display-md m-0">
            <StopText>{copy.title}</StopText>
          </Reveal>
          <Reveal as="p" delay={0.06} className="body-lg max-w-[52ch] text-ink-muted">
            {copy.lead}
          </Reveal>
        </div>

        {/* Wrapped and centred, so an odd count never leaves a lone mark at the edge. */}
        <ul className="flex flex-wrap justify-center gap-y-8 sm:gap-y-14">
          {platforms.map((p, i) => (
            <li
              key={p.slug}
              data-reveal="rise"
              style={{ '--d': `${i * 70}ms` } as CSSProperties}
              className="group/platform flex w-1/4 flex-col items-center gap-3 px-1 text-center sm:w-1/3 sm:gap-5 sm:px-3 lg:w-auto lg:flex-1"
            >
              <span className="transition-transform duration-[320ms] ease-mark group-hover/platform:-translate-y-1">
                <Mark platform={p} />
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-[14px] font-semibold text-ink sm:text-[18px] sm:leading-[26px]">
                  {p.name}
                </span>
                <span className="body-sm hidden text-ink-faint sm:block">{p.kind}</span>
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export default Platforms;
