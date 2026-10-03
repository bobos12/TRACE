import type { CSSProperties } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHead } from '@/components/ui/SectionHead';
import { StopText } from '@/components/brand/Nuqta';
import { Trace } from '@/components/brand/Trace';
import { C, stroke } from '@/components/illustrations/Illo';
import type { BailBonds } from '@/lib/content';

/* One small drawing per stage, in the illustration language. */

function Found() {
  return (
    <svg viewBox="0 0 120 72" className="h-auto w-full" aria-hidden="true">
      <rect x="6" y="8" width="108" height="18" rx="9" {...stroke} stroke={C.line} />
      <circle cx="20" cy="17" r="4" {...stroke} stroke={C.ink} />
      <path d="M23 20l3 3" {...stroke} stroke={C.ink} />
      <rect x="32" y="15" width="50" height="4" fill={C.ink} />
      <path d="M6 40h108M6 54h108M40 34v32M84 34v32" {...stroke} stroke={C.line} strokeWidth={1} />
      <path d="M62 38l6 6-6 6-6-6z" fill={C.ink} />
    </svg>
  );
}

function Credible() {
  return (
    <svg viewBox="0 0 120 72" className="h-auto w-full" aria-hidden="true">
      <rect x="6" y="10" width="108" height="52" {...stroke} stroke={C.line} />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${22 + i * 14} 22l2.4 5 5.4.7-4 3.8 1 5.4-4.8-2.6-4.8 2.6 1-5.4-4-3.8 5.4-.7z`} fill={C.ink} />
      ))}
      <rect x="18" y="46" width="44" height="4" fill={C.line} />
      <rect x="70" y="42" width="32" height="12" {...stroke} stroke={C.ink} />
    </svg>
  );
}

function Call() {
  return (
    <svg viewBox="0 0 120 72" className="h-auto w-full" aria-hidden="true">
      <rect x="40" y="4" width="40" height="64" rx="6" {...stroke} stroke={C.line} />
      <rect x="46" y="46" width="28" height="12" fill={C.ink} />
      <path d="M26 24a20 20 0 0 0 0 24M16 18a30 30 0 0 0 0 36M94 24a20 20 0 0 1 0 24M104 18a30 30 0 0 1 0 36" {...stroke} stroke={C.ink} />
    </svg>
  );
}

function Nothing() {
  return (
    <svg viewBox="0 0 120 72" className="h-auto w-full" aria-hidden="true">
      <path d="M8 10h62v30H30l-10 9v-9H8z" {...stroke} stroke={C.line} />
      <rect x="16" y="20" width="40" height="4" fill={C.line} />
      <path d="M50 34h62v28h-12v8l-9-8H50z" fill={C.ink} />
      <rect x="58" y="44" width="38" height="4" fill="var(--surface)" />
      <rect x="58" y="52" width="24" height="4" fill="var(--surface)" />
    </svg>
  );
}

const VISUALS = [Found, Credible, Call, Nothing];

/**
 * Four stages on one trace — found, credible, called, nothing missed — on a
 * carbon band, because this is the night shift. The trace draws once across
 * the stage markers and ends in the nuqta: the phone ringing.
 */
export function Journey({ copy }: { copy: BailBonds }) {
  const { journey } = copy;

  return (
    <section className="band-carbon py-[var(--section-y)]" aria-labelledby="journey-title">
      <Container className="flex flex-col gap-16">
        <SectionHead
          eyebrow={journey.eyebrow}
          title={<span id="journey-title"><StopText>{journey.title}</StopText></span>}
          lead={journey.lead}
        />

        <div className="relative">
          {/* The trace across the stage markers (desktop). */}
          <div className="absolute inset-x-0 top-[5px] hidden md:block">
            <Trace tone="strong" at={1} nuqtaSize={12} />
          </div>

          <ol className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
            {journey.steps.map((step, i) => {
              const Visual = VISUALS[i]!;
              return (
                <li key={step.name} className="relative flex flex-col gap-5 md:pt-10">
                  <span
                    aria-hidden="true"
                    data-reveal="fade"
                    style={{ '--d': `${i * 160}ms` } as CSSProperties}
                    className="at-step-nuqta absolute top-0 start-0 hidden size-[11px] bg-ink md:block"
                  />
                  <div
                    data-reveal="rise"
                    style={{ '--d': `${i * 120 + 80}ms` } as CSSProperties}
                    className="flex flex-col gap-5"
                  >
                    <div className="w-full max-w-[180px] text-ink md:max-w-[220px]">
                      <Visual />
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="eyebrow text-ink-faint">
                        {String(i + 1).padStart(2, '0')} ◆ {step.tag}
                      </span>
                      <h3 className="heading-2">{step.name}</h3>
                      <p className="body max-w-[32ch] text-ink-muted">{step.text}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}

export default Journey;
