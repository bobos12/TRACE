import Image from 'next/image';
import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Signature } from '@/components/products/SignMock';
import { cn } from '@/lib/cn';

/*
 * Small live pieces of the Ellison & Reyes product, one per feature card —
 * what the feature looks like, not an icon standing in for it. Sample data
 * from the demo agency. Each plays once as its card enters view (the shared
 * reveal: rows rise in turn, the progress bar fills, the call ring pulses);
 * transform and opacity only.
 */

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

/** A rounded pill in the demo's style: white on carbon, or outlined. */
function Pill({ solid = false, className, children }: { solid?: boolean; className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex h-9 items-center gap-2 rounded-full px-4 text-[13px] font-medium',
        solid ? 'bg-ink text-surface' : 'text-ink shadow-[inset_0_0_0_1px_var(--line-strong)]',
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Court reminders by text: the thread a defendant actually gets. */
export function Reminders() {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex flex-col gap-2">
        <p data-reveal="rise" style={d(250)} className="max-w-[88%] rounded-lg rounded-es-sm bg-surface-sunken px-3.5 py-2.5 text-[13px] leading-snug text-ink shadow-[inset_0_0_0_1px_var(--line)]">
          Reminder, Luis: court is <b>Tue Oct 21, 8:30 AM</b>, Dept R-12. Reply C to confirm.
        </p>
        <p data-reveal="rise" style={d(650)} className="self-end rounded-lg rounded-ee-sm bg-ink px-3.5 py-2 text-[13px] font-medium text-surface">
          C
        </p>
        <p data-reveal="rise" style={d(950)} className="max-w-[80%] rounded-lg rounded-es-sm bg-surface-sunken px-3.5 py-2.5 text-[13px] leading-snug text-ink shadow-[inset_0_0_0_1px_var(--line)]">
          Confirmed ✓ See you there.
        </p>
      </div>
    </div>
  );
}

/** One tap to call: the bar that never leaves the thumb. */
export function CallBar() {
  return (
    <div className="relative flex h-full flex-col justify-end overflow-hidden rounded-md bg-surface-sunken p-3 shadow-[inset_0_0_0_1px_var(--line)]">
      <span className="absolute inset-x-4 top-4 flex flex-col gap-2" aria-hidden="true">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">Ellison &amp; Reyes · 2:07 AM</span>
        <span className="heading-2 max-w-[12ch] leading-[1.05] text-ink">It’s 2 a.m. You need them home.</span>
      </span>
      <div className="relative flex gap-2">
        <span className="relative flex flex-1">
          <span aria-hidden="true" className="at-ring absolute inset-0 rounded-full bg-ink" />
          <Pill solid className="relative w-full justify-center">
            <Icon name="phone" size={14} />
            Call 24/7
          </Pill>
        </span>
        <Pill>Start online</Pill>
      </div>
    </div>
  );
}

/** Every jail on a map: the demo's live map, with one facility called out. */
export function JailMap() {
  return (
    <div className="relative h-full min-h-[180px] overflow-hidden rounded-md shadow-[inset_0_0_0_1px_var(--line)]">
      {/* The capture is the map beside its list; this frames the map alone. */}
      <span className="absolute inset-y-0 -start-[9%] w-[230%]">
        <Image
          src="/images/ellison-reyes/map.jpg"
          alt=""
          fill
          sizes="(max-width: 1024px) 200vw, 860px"
          className="object-cover"
          style={{ objectPosition: '0% 40%' }}
        />
      </span>
      <span data-reveal="rise" style={d(300)} className="absolute bottom-3 start-3 end-3 flex items-center justify-between gap-3 rounded-md bg-surface px-3 py-2 text-[12px] shadow-float">
        <span className="flex min-w-0 flex-col">
          <span className="truncate font-medium text-ink">West Valley Detention</span>
          <span className="text-ink-faint">Rancho Cucamonga</span>
        </span>
        <span className="flex-none font-mono text-[11px] text-ink-muted">4–10 hrs</span>
      </span>
    </div>
  );
}

const AGENTS = [
  { photo: 'castillo', name: 'Diane Castillo', note: 'Senior agent · Español', on: true },
  { photo: 'ortiz', name: 'Carmen Ortiz', note: 'Coachella Valley', on: true },
  { photo: 'halvorsen', name: 'Greg Halvorsen', note: 'Back at 6:00 AM', on: false },
];

/** Pick your agent: who is on call right now. */
export function Agents() {
  return (
    <ul className="flex h-full flex-col justify-center">
      {AGENTS.map((a, i) => (
        <li key={a.name} data-reveal="rise" style={d(i * 120)} className="flex items-center gap-3 border-t border-line py-2.5 first:border-t-0">
          <span className="relative flex-none">
            <Image
              src={`/images/ellison-reyes/agents/${a.photo}.jpg`}
              alt=""
              width={80}
              height={80}
              className={cn('size-10 rounded-full object-cover', !a.on && 'opacity-60 grayscale')}
            />
            <span className={cn('absolute -end-0.5 -bottom-0.5 size-3 rounded-full ring-2 ring-surface-raised', a.on ? 'bg-success' : 'bg-ink-faint')} />
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-[14px] font-medium text-ink">{a.name}</span>
            <span className={cn('truncate text-[12px]', a.on ? 'text-success' : 'text-ink-faint')}>
              {a.on ? 'On call now' : a.note}
              {a.on ? <span className="text-ink-faint"> · {a.note}</span> : null}
            </span>
          </span>
          <span className={cn('grid size-8 flex-none place-items-center rounded-full', a.on ? 'bg-ink text-surface' : 'text-ink-faint shadow-[inset_0_0_0_1px_var(--line)]')}>
            <Icon name="phone" size={13} />
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Bail started online: the four steps, signed at the end. */
export function StartOnline() {
  const steps = ['In custody', 'About you', 'The bail', 'Sign'];
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="flex justify-between font-mono text-[10px] uppercase tracking-[0.08em] text-ink-faint">
          <span>Step 4 of {steps.length}</span>
          <span className="text-nuqta">{steps[3]}</span>
        </span>
        <span className="block h-[3px] overflow-hidden rounded-full bg-line">
          <span className="at-fill block h-full rounded-full bg-vermilion" />
        </span>
      </div>
      <div className="flex flex-col gap-2 text-[13px]">
        {[
          ['Defendant', 'Daniel Alvarez'],
          ['Facility', 'West Valley'],
        ].map(([k, v], i) => (
          <span key={k} data-reveal="rise" style={d(200 + i * 110)} className="flex justify-between gap-3 border-b border-line pb-2">
            <span className="text-ink-faint">{k}</span>
            <span className="truncate font-medium text-ink">{v}</span>
          </span>
        ))}
      </div>
      <span data-reveal="rise" style={d(700)} className="mt-auto flex items-center justify-between rounded-md px-3.5 py-2.5 shadow-[inset_0_0_0_1px_var(--line-strong)]">
        <Signature className="h-7 w-28 bg-surface-raised text-ink" />
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-success">
          <Icon name="check" size={12} />
          Signed
        </span>
      </span>
    </div>
  );
}

/** Payments online: every way a family pays, and the plan on autopay. */
export function Payments() {
  const methods = ['Card', 'Apple Pay', 'Google Pay', 'Zelle', 'Cash App', 'Bank'];
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="grid grid-cols-3 gap-1.5">
        {methods.map((m, i) => (
          <span
            key={m}
            data-reveal="fade"
            style={d(i * 70)}
            className={cn(
              'flex h-10 items-center justify-center rounded-md text-[12px] font-medium',
              i === 0 ? 'bg-surface text-ink shadow-[inset_0_0_0_1.5px_var(--ink)]' : 'text-ink-muted shadow-[inset_0_0_0_1px_var(--line-strong)]',
            )}
          >
            {m}
          </span>
        ))}
      </div>
      <span data-reveal="rise" style={d(500)} className="flex h-10 items-center justify-center gap-2 rounded-full bg-ink text-[13px] font-medium text-surface">
        <Icon name="lock" size={13} />
        Pay $480.00
      </span>
      <span className="mt-auto flex items-center justify-between text-[12px] text-ink-muted">
        <span className="flex items-center gap-2">
          <span className="relative h-4 w-7 rounded-full bg-success">
            <span className="absolute end-0.5 top-0.5 size-3 rounded-full bg-surface" />
          </span>
          Autopay on the 15th
        </span>
        <span className="font-mono text-[11px]">4 of 7 paid</span>
      </span>
    </div>
  );
}

/** A 24/7 assistant: a question at 2 a.m., answered — in two languages. */
export function Assistant() {
  return (
    <div className="flex h-full flex-col gap-2.5">
      <span className="flex items-center gap-2.5 border-b border-line pb-2.5">
        <Image src="/images/ellison-reyes/agents/castillo.jpg" alt="" width={56} height={56} className="size-7 rounded-full object-cover" />
        <span className="flex flex-col">
          <span className="text-[13px] font-medium text-ink">E&amp;R Assistant</span>
          <span className="text-[11px] text-success">Online · replies instantly</span>
        </span>
        <span className="ms-auto font-mono text-[10px] text-ink-faint">2:07 AM</span>
      </span>
      <p data-reveal="rise" style={d(150)} className="self-end rounded-lg rounded-ee-sm bg-ink px-3.5 py-2 text-[13px] text-surface">
        How much is a $15,000 bail?
      </p>
      <p data-reveal="rise" style={d(550)} className="max-w-[90%] rounded-lg rounded-es-sm bg-surface-sunken px-3.5 py-2.5 text-[13px] leading-snug text-ink shadow-[inset_0_0_0_1px_var(--line)]">
        About <b>$1,500</b> — California sets 10%. Want me to start it? ¿O en español?
      </p>
    </div>
  );
}
