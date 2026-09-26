import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';
import type { Site } from '@/lib/content';

/**
 * "They work with companies like mine."
 * A slow chip marquee; wrapped and static under reduced motion.
 */
export function Industries({ site }: { site: Site }) {
  const { industries } = site;

  const chip = (label: string, key: string) => (
    <span
      key={key}
      className="inline-flex h-10 flex-none items-center rounded-sm border border-line-strong px-4 text-[14px] whitespace-nowrap text-ink-muted"
    >
      {label}
    </span>
  );

  return (
    <section className="border-b border-line bg-surface py-20" aria-labelledby="industries-title">
      <Container className="mb-8">
        <Reveal as="h2" id="industries-title" className="eyebrow text-ink-faint">
          {industries.title}
        </Reveal>
      </Container>

      {/* A slow marquee. The global reduced-motion rule collapses it to a
          static, wrapped row without any JavaScript. */}
      <div
        className="overflow-hidden motion-reduce:overflow-visible"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
        }}
      >
        <div className="at-marquee at-marquee-slow flex w-max gap-3 hover:[animation-play-state:paused] motion-reduce:w-auto motion-reduce:flex-wrap motion-reduce:px-6 sm:motion-reduce:px-8">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="flex gap-3 motion-reduce:contents"
              aria-hidden={copy === 1}
            >
              {industries.items.map((item) => chip(item, `${copy}-${item}`))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Industries;
