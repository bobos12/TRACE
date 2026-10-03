import { Container } from '@/components/ui/Container';
import { SectionHead } from '@/components/ui/SectionHead';
import { Reveal } from '@/components/motion/Reveal';
import { StopText } from '@/components/brand/Nuqta';
import type { Site } from '@/lib/content';

/** Icons contained in a rhombus, in the icon style of public/icons/. */
const GLYPHS = [
  'M5 7h14M5 12h10M5 17h6', // direct line to the builders
  'M12 4v8l5 3M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z', // your hours
  'M5 15h14M5 9h14', // fixed price per phase
  'M7 12l4 4 6-8', // you own everything
  'M7 10V7a5 5 0 0 1 10 0v3M5 10h14v10H5z', // NDA
  'M12 5v8M8.5 11.5 12 15l3.5-3.5M6 18h12', // support after launch
];

function RhombusIcon({ d }: { d: string }) {
  return (
    <span className="relative inline-grid size-12 flex-none place-items-center">
      <svg viewBox="0 0 48 48" className="absolute inset-0 size-full" aria-hidden="true">
        <path
          d="M24 2 46 24 24 46 2 24Z"
          fill="none"
          stroke="var(--line-strong)"
          strokeWidth="1"
          strokeLinejoin="miter"
        />
      </svg>
      <svg
        viewBox="0 0 24 24"
        className="relative size-5 text-ink"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="square"
        strokeLinejoin="miter"
        aria-hidden="true"
      >
        <path d={d} />
      </svg>
    </span>
  );
}

/**
 * Why a US business can hand us the work: the six commitments, each one
 * something we put in the contract rather than a slogan.
 */
export function WhyTrace({ site }: { site: Site }) {
  const { why } = site;

  return (
    <section className="border-b border-line bg-surface py-[var(--section-y)]">
      <Container className="flex flex-col gap-16">
        <SectionHead
          eyebrow={why.eyebrow}
          title={
            <StopText>{why.title}</StopText>
          }
          size="md"
        />

        <ul className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {why.points.map((point, i) => (
            <Reveal
              key={point.title}
              as="li"
              delay={i * 0.06}
              className="flex gap-4 border-t border-line pt-6"
            >
              <RhombusIcon d={GLYPHS[i % GLYPHS.length]!} />
              <div className="flex flex-col gap-1.5">
                <h3 className="heading-3">{point.title}</h3>
                <p className="body-sm text-ink-muted">{point.text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export default WhyTrace;
