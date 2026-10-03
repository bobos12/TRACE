import Image from 'next/image';
import type { CSSProperties, ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHead } from '@/components/ui/SectionHead';
import { Reveal } from '@/components/motion/Reveal';
import { Icon } from '@/components/ui/Icon';
import { StopText } from '@/components/brand/Nuqta';
import type { BailBonds } from '@/lib/content';
import { cn } from '@/lib/cn';
import { Stars } from './Frames';
import { Estimator, LanguageToggle } from './Widgets';

/** One bento cell: the piece of the site itself first, then what it is. */
function Cell({
  title,
  text,
  className,
  delay = 0,
  children,
}: {
  title: string;
  text: string;
  className?: string;
  delay?: number;
  children: ReactNode;
}) {
  return (
    <Reveal
      as="li"
      delay={delay}
      className={cn('flex flex-col gap-6 border border-line bg-surface-sunken p-5 sm:p-6', className)}
    >
      <div className="flex flex-1 flex-col justify-center">{children}</div>
      <div className="flex flex-col gap-1.5">
        <h3 className="heading-3">{title}</h3>
        <p className="body-sm max-w-[42ch] text-ink-muted">{text}</p>
      </div>
    </Reveal>
  );
}

/** The bottom of a phone, scrolled, with the call bar pinned to it. */
function CallBar({ label, phone }: { label: string; phone: string }) {
  return (
    <div className="mx-auto w-full max-w-[280px] overflow-hidden rounded-t-[22px] border border-b-0 border-line-strong bg-surface-raised">
      <div className="flex flex-col gap-2.5 px-5 pt-6 pb-4" aria-hidden="true">
        <span className="h-2.5 w-[70%] rounded-sm bg-line-strong opacity-60" />
        <span className="h-2 w-full rounded-sm bg-line" />
        <span className="h-2 w-[86%] rounded-sm bg-line" />
        <span className="h-2 w-[60%] rounded-sm bg-line" />
      </div>
      <div className="border-t border-line p-3">
        <span
          className="at-cut flex h-11 items-center justify-center gap-2 bg-nuqta text-[14px] font-semibold text-on-nuqta"
          style={{ '--cut': '9px' } as CSSProperties}
        >
          <Icon name="phone" size={16} /> {label} · {phone}
        </span>
      </div>
    </div>
  );
}

/** The counties served as a constellation — the home county marked. */
function Areas({ counties }: { counties: string[] }) {
  // Rough geography, in content order: the home county at the centre, then
  // SW, N, SE and S of it.
  const at = [
    { x: 112, y: 70 },
    { x: 40, y: 108 },
    { x: 118, y: 20 },
    { x: 176, y: 116 },
    { x: 108, y: 146 },
  ];
  const nodes = counties.slice(0, at.length).map((name, i) => ({ name, ...at[i]! }));
  const hub = nodes[0];

  return (
    <svg viewBox="0 0 250 170" className="h-auto w-full" role="img" aria-label={counties.join(', ')}>
      {hub
        ? nodes
            .filter((n) => n !== hub)
            .map((n) => (
              <path key={n.name} d={`M${hub.x} ${hub.y}L${n.x} ${n.y}`} stroke="var(--line-strong)" strokeWidth="1" />
            ))
        : null}
      {nodes.map((n) => {
        const isHub = n === hub;
        const s = isHub ? 7 : 5;
        return (
          <g key={n.name}>
            <path
              d={`M${n.x} ${n.y - s}L${n.x + s} ${n.y}L${n.x} ${n.y + s}L${n.x - s} ${n.y}Z`}
              fill={isHub ? 'var(--vermilion)' : 'var(--ink)'}
            />
            <text
              x={n.x + s + 6}
              y={n.y + 4}
              fontSize="11"
              fontWeight={isHub ? 600 : 500}
              fill={isHub ? 'var(--ink)' : 'var(--ink-muted)'}
              fontFamily="var(--font-sans)"
            >
              {n.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** The agency's business profile, as the maps app shows it. */
function MapsCard({ copy, phone, actions }: { copy: BailBonds['details']['maps']; phone: string; actions: string[] }) {
  const icons = [
    'M21.7 11.3l-9-9a1 1 0 0 0-1.4 0l-9 9a1 1 0 0 0 0 1.4l9 9a1 1 0 0 0 1.4 0l9-9a1 1 0 0 0 0-1.4zM14 14.5V12h-4v3H8v-4a1 1 0 0 1 1-1h5V7.5l3.5 3.5z',
    'M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.6 3.6a1 1 0 0 1-.25 1z',
    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1 17.9A8 8 0 0 1 4 12c0-.6.1-1.2.2-1.8L9 15v1a2 2 0 0 0 2 2zm6.9-2.5A2 2 0 0 0 16 16h-1v-3a1 1 0 0 0-1-1H8v-2h2a1 1 0 0 0 1-1V7h2a2 2 0 0 0 2-2v-.4a8 8 0 0 1 2.9 12.8z',
  ];
  return (
    <div className="mock-gmaps overflow-hidden rounded-[12px] bg-[var(--gm-bg)] shadow-[0_1px_3px_rgb(0_0_0/0.15)]" aria-hidden="true">
      <div className="grid h-[74px] grid-cols-[2fr_1fr_1fr] gap-0.5">
        {['thumb-court', 'thumb-office', 'thumb-city'].map((t) => (
          <span key={t} className="relative">
            <Image src={`/images/bail/${t}.jpg`} alt="" fill sizes="120px" className="object-cover" />
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-1 px-4 pt-3">
        <span className="text-[17px] leading-tight text-[var(--gm-text)]">{copy.name}</span>
        <span className="flex items-center gap-1 text-[12.5px] text-[var(--gm-muted)]">
          <span className="text-[var(--gm-text)]">{copy.rating}</span>
          <Stars size={11} className="text-[var(--gm-star)]" />
          {copy.reviews}
        </span>
        <span className="text-[12.5px] text-[var(--gm-muted)]">{copy.kind}</span>
        <span className="text-[12.5px]">
          <span className="text-[var(--gm-green)]">{copy.open}</span>
          <span className="text-[var(--gm-muted)]"> · {phone}</span>
        </span>
      </div>
      <div className="mt-3 grid grid-cols-3 border-t border-[var(--gm-line)] px-2 py-3">
        {actions.map((a, i) => (
          <span key={a} className="flex flex-col items-center gap-1.5 text-[11.5px] font-medium text-[var(--gm-blue)]">
            <span
              className={cn(
                'grid size-9 place-items-center rounded-full',
                i === 0 ? 'bg-[var(--gm-blue)] text-[var(--gm-bg)]' : 'bg-[var(--gm-blue-soft)] text-[var(--gm-blue)]',
              )}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d={icons[i]!} />
              </svg>
            </span>
            {a}
          </span>
        ))}
      </div>
    </div>
  );
}

function BondForm({ copy }: { copy: BailBonds['details']['form'] }) {
  return (
    <div className="flex flex-col gap-2.5 rounded-md border border-line bg-surface-raised p-4" aria-hidden="true">
      <span className="flex items-center justify-between font-mono text-[10px] tracking-[0.12em] text-ink-faint uppercase">
        {copy.step}
        <span className="flex gap-1">
          <span className="h-1 w-5 bg-ink" />
          <span className="h-1 w-5 bg-line" />
        </span>
      </span>
      {copy.fields.map((f) => (
        <span key={f} className="flex flex-col gap-1">
          <span className="text-[11px] font-medium text-ink-muted">{f}</span>
          <span className="h-8 rounded-sm border border-line-strong bg-surface" />
        </span>
      ))}
      <span className="mt-1 flex h-9 items-center justify-center rounded-md bg-ink text-[12px] font-semibold text-surface">
        {copy.submit}
      </span>
    </div>
  );
}

/** The page-weight budget: what loads, and the line it must arrive under. */
function Speed({ budget }: { budget: string }) {
  const parts = [
    { w: 18, tone: 'bg-ink' },
    { w: 14, tone: 'bg-ink-muted' },
    { w: 22, tone: 'bg-line-strong' },
  ];
  return (
    <div className="flex flex-col gap-3" aria-hidden="true">
      <div className="relative h-14">
        <div className="absolute inset-x-0 top-1/2 h-px bg-line" />
        <div className="absolute start-0 top-1/2 flex h-3 -translate-y-1/2 gap-px">
          {parts.map((p, i) => (
            <span key={i} className={p.tone} style={{ width: `${p.w * 4}px` }} />
          ))}
        </div>
        <div className="absolute end-[12%] inset-y-0 flex flex-col items-center gap-1">
          <span className="w-px flex-1 bg-ink" />
          <span className="font-mono text-[11px] text-ink">{budget}</span>
        </div>
      </div>
    </div>
  );
}

function Privacy() {
  return (
    <div className="flex items-center gap-3 text-ink" aria-hidden="true">
      <span className="grid size-11 place-items-center rounded-full border border-line-strong">
        <Icon name="user" size={18} />
      </span>
      <span className="h-px flex-1 bg-line-strong" />
      <span className="grid size-11 place-items-center border border-ink bg-surface-raised">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
          <path d="M7 10V7a5 5 0 0 1 10 0v3M5 10h14v10H5z" />
        </svg>
      </span>
      <span className="h-px flex-1 bg-line-strong" />
      <span className="grid size-11 place-items-center rounded-full bg-ink text-surface">
        <Icon name="inbox" size={18} />
      </span>
    </div>
  );
}

/**
 * Every detail, shown as the piece of site it is — a call bar, a county map,
 * an estimator that works, a Spanish switch, a Maps listing, a short form —
 * never a row of icon cards. The estimator carries the cut: it is the one
 * families will actually use.
 */
export function Details({ copy }: { copy: BailBonds }) {
  const { details, demo } = copy;

  return (
    <section className="border-b border-line bg-surface py-[var(--section-y)]" aria-labelledby="details-title">
      <Container className="flex flex-col gap-14">
        <SectionHead
          eyebrow={details.eyebrow}
          title={<span id="details-title"><StopText>{details.title}</StopText></span>}
          lead={details.lead}
        />

        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-6">
          <Reveal
            as="li"
            className="at-cut flex flex-col gap-6 border border-line bg-surface-sunken p-5 sm:col-span-2 sm:p-6 md:col-span-3 md:row-span-2"
            style={{ '--cut': '28px' } as CSSProperties}
          >
            <div className="flex flex-col gap-1.5">
              <h3 className="heading-2">{details.estimator.title}</h3>
              <p className="body-sm max-w-[44ch] text-ink-muted">{details.estimator.text}</p>
            </div>
            <Estimator copy={details.estimator} />
          </Reveal>

          <Cell title={details.callBar.title} text={details.callBar.text} className="md:col-span-3" delay={0.06}>
            <CallBar label={details.callBar.label} phone={demo.phone} />
          </Cell>

          <Cell title={details.language.title} text={details.language.text} className="md:col-span-3" delay={0.1}>
            <LanguageToggle copy={details.language} />
          </Cell>

          <Cell title={details.areas.title} text={details.areas.text} className="md:col-span-2">
            <div className="mx-auto w-full max-w-[260px]">
              <Areas counties={details.areas.counties} />
            </div>
          </Cell>

          <Cell title={details.maps.title} text={details.maps.text} className="md:col-span-2" delay={0.06}>
            <MapsCard copy={details.maps} phone={demo.phone} actions={copy.maps.actions} />
          </Cell>

          <Cell title={details.form.title} text={details.form.text} className="sm:col-span-2 md:col-span-2" delay={0.1}>
            <BondForm copy={details.form} />
          </Cell>

          <Cell title={details.speed.title} text={details.speed.text} className="md:col-span-3">
            <Speed budget={details.speed.budget} />
          </Cell>

          <Cell title={details.privacy.title} text={details.privacy.text} className="md:col-span-3" delay={0.06}>
            <Privacy />
          </Cell>
        </ul>
      </Container>
    </section>
  );
}

export default Details;
