import { Container } from '@/components/ui/Container';
import { SectionHead } from '@/components/ui/SectionHead';
import { Reveal } from '@/components/motion/Reveal';
import { Constellation } from '@/components/brand/Constellation';
import { Nuqta, StopText } from '@/components/brand/Nuqta';
import type { Site } from '@/lib/content';

/** Icons contained in a rhombus, in the icon style of public/icons/. */
const GLYPHS = [
  'M6 16.5 12 6l6 10.5H6z', // shaped to the workflow
  'M4 12h16M12 4v16', // both scripts
  'M5 15h14M5 9h14', // fixed price per phase
  'M7 12l4 4 6-8', // you own everything
  'M5 7h14M5 12h10M5 17h6', // direct line
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

export function WhyAthr({ site }: { site: Site }) {
  const { why, testimonial } = site;

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

        {/* Testimonial — placeholder copy until a real client quote lands. */}
        <Reveal
          as="figure"
          className="grid grid-cols-1 items-center gap-10 border-t border-line pt-14 lg:grid-cols-12"
        >
          <blockquote className="lg:col-span-8">
            <p className="display-md flex gap-4">
              <Nuqta size={14} className="mt-[0.45em] flex-none" />
              <span>{testimonial.text}</span>
            </p>
          </blockquote>
          <figcaption className="flex items-center justify-between gap-8 lg:col-span-4">
            <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-ink-muted rtl:font-arabic rtl:normal-case rtl:tracking-normal">
              {testimonial.by}
            </span>
            <Constellation seed={testimonial.by} size={16} quiet className="flex-none text-ink" />
          </figcaption>
        </Reveal>
      </Container>
    </section>
  );
}

export default WhyAthr;
