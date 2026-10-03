import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';
import { Nuqta, StopText } from '@/components/brand/Nuqta';
import type { BailBonds } from '@/lib/content';
import { AssistantDemo } from './AssistantDemo';

/** The assistant section: what it does, beside the live demo of it. */
export function Assistant({ copy }: { copy: BailBonds }) {
  const { assistant, demo } = copy;

  return (
    <section className="border-b border-line bg-surface py-[var(--section-y)]" aria-labelledby="assistant-title">
      <Container className="grid grid-cols-1 items-center gap-14 md:grid-cols-12 md:gap-8">
        <div className="flex flex-col gap-7 md:col-span-5">
          <Reveal className="eyebrow text-ink-muted">{assistant.eyebrow}</Reveal>
          <Reveal as="h2" id="assistant-title" className="display-lg m-0">
            <StopText>{assistant.title}</StopText>
          </Reveal>
          <Reveal as="p" delay={0.06} className="body-lg max-w-[46ch] text-ink-muted">
            {assistant.lead}
          </Reveal>
          <ul className="flex flex-col border-t border-line">
            {assistant.points.map((p, i) => (
              <Reveal as="li" key={p} delay={0.08 + i * 0.04} className="flex items-baseline gap-4 border-b border-line py-3.5">
                <Nuqta size={8} tone={i === assistant.points.length - 1 ? 'mark' : 'ink'} className="translate-y-[-2px]" />
                <span className="body">{p}</span>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal className="md:col-span-7">
          <AssistantDemo copy={assistant} initial={demo.name.charAt(0)} />
        </Reveal>
      </Container>
    </section>
  );
}

export default Assistant;
