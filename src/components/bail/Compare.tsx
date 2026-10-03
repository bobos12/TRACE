import { Container } from '@/components/ui/Container';
import { SectionHead } from '@/components/ui/SectionHead';
import { Reveal } from '@/components/motion/Reveal';
import { Icon } from '@/components/ui/Icon';
import { StopText } from '@/components/brand/Nuqta';
import { BookCallButton } from '@/components/contact/ContactButtons';
import type { BailBonds } from '@/lib/content';
import { Browser, Scaled } from './Frames';
import { CompareSlider } from './CompareSlider';
import { IronwoodOld, IronwoodSite, SITE_H, SITE_W } from './Ironwood';

/**
 * Before → after. The same fictional agency twice, split by a handle you can
 * drag; then the changes, row by row, so the slider's story is also readable
 * as text.
 */
export function Compare({ copy }: { copy: BailBonds }) {
  const { compare, demo } = copy;

  return (
    <section id="before-after" className="border-b border-line bg-surface py-[var(--section-y)]" aria-labelledby="compare-title">
      <Container className="flex flex-col gap-14">
        <SectionHead
          eyebrow={compare.eyebrow}
          title={<StopText>{compare.title}</StopText>}
          lead={compare.lead}
        />

        <Reveal className="flex flex-col gap-3">
          <Browser url={demo.url}>
            <CompareSlider
              label={compare.sliderLabel}
              beforeLabel={compare.before}
              afterLabel={compare.after}
              before={
                <Scaled w={SITE_W} h={SITE_H}>
                  <IronwoodOld demo={demo} />
                </Scaled>
              }
              after={
                <Scaled w={SITE_W} h={SITE_H}>
                  <IronwoodSite demo={demo} />
                </Scaled>
              }
            />
          </Browser>
          <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] text-ink-faint uppercase">
            <span className="size-1.5 rotate-45 bg-ink-faint" />
            {demo.concept}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <ul className="border-t border-line md:col-span-9 md:col-start-4">
            <li className="hidden grid-cols-[1fr_1.3fr_1.3fr] gap-6 border-b border-line py-3 font-mono text-[11px] tracking-[0.12em] text-ink-faint uppercase sm:grid">
              <span aria-hidden="true" />
              <span>{compare.before}</span>
              <span>{compare.after}</span>
            </li>
            {compare.changes.map((c, i) => (
              <Reveal
                as="li"
                key={c.what}
                delay={i * 0.04}
                className="grid grid-cols-1 gap-2 border-b border-line py-5 sm:grid-cols-[1fr_1.3fr_1.3fr] sm:gap-6"
              >
                <span className="heading-3">{c.what}</span>
                <span className="flex items-start gap-2.5 body text-ink-faint">
                  <Icon name="close" size={16} className="mt-1 text-ink-faint" />
                  <span>
                    <span className="sr-only">{compare.before}: </span>
                    {c.before}
                  </span>
                </span>
                <span className="flex items-start gap-2.5 body text-ink">
                  <Icon name="check" size={16} className="mt-1 text-nuqta" />
                  <span>
                    <span className="sr-only">{compare.after}: </span>
                    {c.after}
                  </span>
                </span>
              </Reveal>
            ))}
          </ul>
          <div className="md:col-span-9 md:col-start-4">
            <BookCallButton placement="landing:bail-bonds-compare" size="lg">
              {compare.cta}
            </BookCallButton>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Compare;
