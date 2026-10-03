import type { CSSProperties } from 'react';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';
import { StopText } from '@/components/brand/Nuqta';
import type { BailBonds } from '@/lib/content';
import { cn } from '@/lib/cn';
import { Phone } from './Frames';
import { MapsScreen } from './Maps';

/**
 * The 2 a.m. search, minute by minute: a trace down the timeline, each
 * timestamp stamping on as it enters view, the last one in vermilion — the
 * call. Beside it, the same search on a phone, with what is wrong with every
 * result that does not get the call.
 */
export function Moment({ copy }: { copy: BailBonds }) {
  const { moment, maps } = copy;
  const last = moment.timeline.length - 1;

  return (
    <section className="border-b border-line bg-surface py-[var(--section-y)]" aria-labelledby="moment-title">
      <Container className="grid grid-cols-1 items-center gap-16 md:grid-cols-12 md:gap-8">
        <div className="flex flex-col gap-8 md:col-span-6">
          <Reveal className="eyebrow text-ink-muted">{moment.eyebrow}</Reveal>
          <Reveal as="h2" id="moment-title" className="display-lg m-0">
            <StopText>{moment.title}</StopText>
          </Reveal>
          <Reveal as="p" delay={0.06} className="body-lg max-w-[50ch] text-ink-muted">
            {moment.lead}
          </Reveal>

          <ol className="relative mt-2 flex flex-col gap-6 ps-8">
            <span aria-hidden="true" className="absolute inset-y-1 start-[5px] w-px bg-line" />
            {moment.timeline.map((t, i) => (
              <li key={t.time} className="relative flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
                <span aria-hidden="true" className="absolute -start-8 top-1.5">
                  <span
                    data-reveal="fade"
                    style={{ '--d': `${i * 140}ms` } as CSSProperties}
                    className={cn('at-step-nuqta block size-[11px]', i === last ? 'bg-vermilion' : 'bg-ink')}
                  />
                </span>
                <Reveal as="span" delay={i * 0.14} className="data w-[76px] flex-none text-ink-faint">
                  {t.time}
                </Reveal>
                <Reveal
                  as="span"
                  delay={i * 0.14 + 0.04}
                  className={cn('heading-3', i === last ? 'text-ink' : 'text-ink-muted')}
                >
                  {t.text}
                </Reveal>
              </li>
            ))}
          </ol>

          <Reveal as="p" delay={0.2} className="heading-2 max-w-[30ch] border-t border-line pt-6">
            {moment.question}
          </Reveal>
        </div>

        <div className="flex justify-center md:col-span-5 md:col-start-8">
          <Reveal className="w-full max-w-[330px]">
            <Phone>
              <MapsScreen maps={maps} time={moment.timeline[2]!.time.replace(' AM', '')} annotate />
            </Phone>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

export default Moment;
