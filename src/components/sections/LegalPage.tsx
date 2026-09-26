import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';
import { StopText } from '@/components/brand/Nuqta';
import { Badge } from '@/components/ui/Badge';

export interface LegalCopy {
  title: string;
  updated: string;
  sections: Array<{ heading: string; body: string }>;
}

/**
 * Privacy and Terms share one layout. The copy is a draft: the badge says so
 * until a lawyer has signed it off.
 */
export function LegalPage({ copy, reviewBadge }: { copy: LegalCopy; reviewBadge: string }) {
  return (
    <section className="bg-surface pt-32 pb-[var(--section-y)]">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
        {/* The first screenful never animates in — see PageHero. */}
        <div className="flex flex-col items-start gap-4 lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
          <h1 className="display-md m-0">
            <StopText>{copy.title}</StopText>
          </h1>
          <p className="body-sm text-ink-faint">{copy.updated}</p>
          {/* TODO: remove once the copy has been through legal review. */}
          <Badge tone="warning" dot>
            {reviewBadge}
          </Badge>
        </div>

        <div className="flex flex-col lg:col-span-7 lg:col-start-6">
          {copy.sections.map((section, i) => (
            <Reveal
              as="section"
              key={section.heading}
              delay={i * 0.04}
              className="flex flex-col gap-3 border-b border-line py-7 first:pt-0"
            >
              <h2 className="heading-2">{section.heading}</h2>
              <p className="body-lg max-w-[64ch] text-ink-muted">{section.body}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default LegalPage;
