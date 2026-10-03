'use client';

import { useRef, type CSSProperties } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHead } from '@/components/ui/SectionHead';
import { StopText } from '@/components/brand/Nuqta';
import type { Site } from '@/lib/content';
import { useScrollProgress } from '@/lib/scroll';
import { C, stroke } from '@/components/illustrations/Illo';

/* Step visuals — one per step, shown on the opposite side on desktop. */

function Understand() {
  return (
    <svg viewBox="0 0 200 110" className="h-auto w-full" aria-hidden="true">
      <rect x="10" y="14" width="180" height="86" rx="3" {...stroke} stroke={C.line} />
      <path
        d="M10 34h180M50 14v86M90 14v86M130 14v86M150 34v66M10 58h180M10 80h180"
        {...stroke}
        stroke={C.line}
        strokeWidth={1}
      />
      <rect x="54" y="38" width="32" height="16" rx="1.5" fill={C.ink} />
      <rect x="94" y="62" width="32" height="14" rx="1.5" fill={C.soft} stroke={C.line} strokeWidth={1} />
      <path d="M134 84l12 0" {...stroke} stroke={C.line} />
      <path d="M150 14v20" {...stroke} stroke={C.line} />
      <path d="M154 62L162 70L154 78L146 70Z" fill={C.mark} />
    </svg>
  );
}

function Build() {
  return (
    <svg viewBox="0 0 200 110" className="h-auto w-full" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect
            x="10"
            y={14 + i * 24}
            width={i === 3 ? 60 : 120 + i * 18}
            height="14"
            rx="2"
            fill={i === 3 ? C.mark : C.ink}
            opacity={i === 3 ? 1 : 1 - i * 0.22}
          />
          <path d={`M10 ${34 + i * 24}h180`} {...stroke} stroke={C.line} strokeWidth={1} opacity={0.5} />
        </g>
      ))}
      <path d="M10 8v96M75 8v96M140 8v96" {...stroke} stroke={C.line} strokeWidth={1} opacity={0.4} />
    </svg>
  );
}

function Launch() {
  const bars = [
    { x: 32, h: 22 },
    { x: 66, h: 36 },
    { x: 100, h: 30 },
    { x: 134, h: 52 },
    { x: 168, h: 68 },
  ];

  return (
    <svg viewBox="0 0 200 110" className="h-auto w-full" aria-hidden="true">
      <path d="M14 96h172" {...stroke} stroke={C.line} />
      {bars.map((b, i) => (
        <rect
          key={b.x}
          x={b.x - 12}
          y={96 - b.h}
          width="24"
          height={b.h}
          fill={i === 4 ? C.ink : C.soft}
          stroke={i === 4 ? 'none' : C.line}
          strokeWidth={1}
        />
      ))}
      <path d="M168 20L176 28L168 36L160 28Z" fill={C.mark} />
    </svg>
  );
}

function Handover() {
  return (
    <svg viewBox="0 0 200 110" className="h-auto w-full" aria-hidden="true">
      <rect x="22" y="22" width="156" height="66" rx="3" {...stroke} stroke={C.line} />
      <path d="M22 40h156" {...stroke} stroke={C.line} strokeWidth={1} />
      <rect x="36" y="52" width="70" height="4" fill={C.ink} />
      <rect x="36" y="64" width="50" height="4" fill={C.line} />
      <path d="M132 58l7 7 16-18" {...stroke} stroke={C.ink} strokeWidth={2} />
      <path d="M100 22L108 30L100 38L92 30Z" fill={C.mark} />
    </svg>
  );
}

const VISUALS = [Understand, Build, Launch, Handover];

function Step({
  step,
  index,
}: {
  step: { n: string; title: string; text: string };
  index: number;
}) {
  const Visual = VISUALS[index % VISUALS.length]!;
  const flip = index % 2 === 1;

  return (
    <li className="relative grid grid-cols-1 gap-8 pb-16 md:grid-cols-12 md:gap-8 md:pb-24">
      {/* The nuqta stamps onto the trace as the line reaches it. */}
      <span aria-hidden="true" className="absolute -start-[25px] top-1.5 md:-start-[33px]">
        <span data-reveal="fade" className="at-step-nuqta block size-3 bg-vermilion" />
      </span>

      <div
        data-reveal="rise"
        style={{ '--d': '80ms' } as CSSProperties}
        className={`flex flex-col gap-3 md:col-span-6 ${flip ? 'md:order-2 md:col-start-7' : ''}`}
      >
        {/* The number alone — the title says the rest. */}
        <span className="eyebrow text-ink-faint">{step.n}</span>
        <h3 className="heading-1">{step.title}</h3>
        <p className="body max-w-[46ch] text-ink-muted">{step.text}</p>
      </div>

      <div
        data-reveal="rise"
        style={{ '--d': '160ms' } as CSSProperties}
        className={`hidden text-ink md:col-span-5 md:block ${
          flip ? 'md:order-1 md:col-start-1' : 'md:col-start-8'
        }`}
      >
        <Visual />
      </div>
    </li>
  );
}

/**
 * The process, drawn as a trace.
 *
 * An ink line runs down the leading edge; its scaleY follows scroll progress
 * through the section, so it draws itself as you read, and each step's nuqta
 * stamps in as the line reaches it. Progress comes from `useScrollProgress`,
 * which writes a single CSS custom property — no animation library on the
 * home page's critical path.
 */
export function Process({ site, copy = site.process }: { site: Site; copy?: Site['process'] }) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollProgress(ref, { offset: 'contain' });

  return (
    <section id="process" className="border-b border-line bg-surface py-[var(--section-y)]">
      <Container className="flex flex-col gap-16">
        <SectionHead
          eyebrow={copy.eyebrow}
          title={<StopText>{copy.title}</StopText>}
        />

        <div ref={ref} className="relative ps-8 md:ps-10">
          {/* The trace: a hairline rule with the ink line drawn over it. */}
          <span aria-hidden="true" className="absolute inset-y-0 start-0 w-px bg-line" />
          <span aria-hidden="true" className="at-process-line absolute inset-y-0 start-0 w-px bg-ink" />

          <ol className="flex flex-col">
            {copy.steps.map((step, i) => (
              <Step key={step.n} step={step} index={i} />
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

export default Process;
