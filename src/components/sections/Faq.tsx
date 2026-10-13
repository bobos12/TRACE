import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';
import { Accordion } from '@/components/ui/Accordion';
import { StopText } from '@/components/brand/Nuqta';

/** Questions: the heading in the leading columns, the answers beside it. */
export function Faq({
  id,
  title,
  items,
}: {
  /** The heading's id, which labels the section. */
  id: string;
  title: string;
  items: { q: string; a: string }[];
}) {
  return (
    <section className="border-b border-line bg-surface py-[var(--section-y)]" aria-labelledby={id}>
      <Container className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
        <div className="flex flex-col gap-6 md:col-span-4">
          <Reveal as="h2" id={id} className="display-md m-0">
            <StopText>{title}</StopText>
          </Reveal>
        </div>
        <div className="md:col-span-7 md:col-start-6">
          <Accordion items={items} />
        </div>
      </Container>
    </section>
  );
}

export default Faq;
