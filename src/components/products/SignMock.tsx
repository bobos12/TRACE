import type { CSSProperties, ReactNode } from 'react';
import { Browser, Phone, Scaled } from '@/components/bail/Frames';
import { Icon, type IconName } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';

/*
 * TRACE Sign, drawn as the product looks — in TRACE's own tokens, so it is the
 * brand's product in both themes. Authored at a fixed canvas and scaled to its
 * column (`Scaled`), like the bail mocks. The names are sample data and say so.
 *
 * Motion, once, when the panel enters view: the signer rows rise one by one
 * and the signature writes itself (a wipe, transform only — `.at-wipe`).
 */

/** A handwritten signature, in one stroke. */
export function Signature({ className }: { className?: string }) {
  return (
    <span className={cn('relative block', className)}>
      <svg viewBox="0 0 220 56" className="h-full w-full" aria-hidden="true">
        <path
          d="M6 40c10-22 18-30 22-24s-8 26-2 26 14-30 22-30-4 24 4 24 12-18 18-18-2 14 6 14 10-10 16-10 2 8 10 8 14-12 22-12c6 0 2 9 10 9s16-5 26-6M120 30c14-2 40-4 70-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {/* Uncovered left to right as if being written. */}
      <span className="at-wipe absolute inset-0 bg-[inherit]" />
    </span>
  );
}

function Status({ tone, children }: { tone: 'done' | 'seen' | 'wait'; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex h-[22px] items-center gap-1.5 rounded-sm px-2 font-mono text-[10px] uppercase tracking-[0.08em]',
        tone === 'done' && 'bg-success-soft text-success',
        tone === 'seen' && 'bg-warning-soft text-warning',
        tone === 'wait' && 'text-ink-faint shadow-[inset_0_0_0_1px_var(--line-strong)]',
      )}
    >
      {tone === 'done' ? <Icon name="check" size={11} /> : null}
      {children}
    </span>
  );
}

const NAV: { icon: IconName; label: string; count?: string; active?: boolean }[] = [
  { icon: 'file', label: 'Documents', count: '12', active: true },
  { icon: 'users', label: 'Clients', count: '48' },
  { icon: 'layers', label: 'Templates', count: '9' },
  { icon: 'shield', label: 'Audit trail' },
];

const SIGNERS = [
  { initials: 'JO', name: 'James Okafor', role: 'Defendant', tone: 'done' as const, status: 'Signed 10:42 PM' },
  { initials: 'GO', name: 'Grace Okafor', role: 'Cosigner', tone: 'seen' as const, status: 'Viewed' },
  { initials: 'MR', name: 'Marisol Reyes', role: 'Agent', tone: 'wait' as const, status: 'Waiting' },
];

const ACTIVITY = [
  { time: '10:31 PM', text: 'Sent by Marisol Reyes' },
  { time: '10:38 PM', text: 'Opened by James Okafor · iPhone' },
  { time: '10:42 PM', text: 'Signed by James Okafor' },
  { time: '10:44 PM', text: 'Viewed by Grace Okafor' },
];

/** A grey line of document text. */
const Line = ({ w }: { w: string }) => <span className="block h-[5px] rounded-full bg-line" style={{ width: w }} />;

export function SignDesktop({ label }: { label: string }) {
  return (
    <Browser url={label}>
      <Scaled w={960} h={600}>
        <div className="flex h-full w-full bg-surface text-[13px] text-ink">
          {/* Sidebar */}
          <aside className="flex w-[184px] flex-none flex-col gap-1 border-e border-line bg-surface-sunken p-4">
            <span className="mb-5 flex items-center gap-2 text-[14px] font-semibold tracking-[-0.01em]">
              <span className="size-[9px] rotate-45 bg-vermilion" />
              TRACE Sign
            </span>
            {NAV.map((n) => (
              <span
                key={n.label}
                className={cn(
                  'flex h-9 items-center gap-2.5 rounded-sm px-2.5',
                  n.active ? 'bg-surface-raised font-medium text-ink shadow-[inset_0_0_0_1px_var(--line)]' : 'text-ink-muted',
                )}
              >
                <Icon name={n.icon} size={15} />
                <span className="flex-1">{n.label}</span>
                {n.count ? <span className="font-mono text-[11px] text-ink-faint">{n.count}</span> : null}
              </span>
            ))}
            <span className="mt-auto font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">Sample data</span>
          </aside>

          {/* Main */}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex h-[54px] flex-none items-center justify-between border-b border-line px-5">
              <span className="truncate text-ink-muted">
                Documents <span className="text-ink-faint">/</span>{' '}
                <span className="font-medium text-ink">Bail bond agreement — Okafor, J.</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-flex h-8 items-center gap-1.5 rounded-sm px-3 text-[12px] shadow-[inset_0_0_0_1px_var(--line-strong)]">
                  <Icon name="bell" size={13} />
                  Remind
                </span>
                <span className="inline-flex h-8 items-center gap-1.5 rounded-sm bg-ink px-3 text-[12px] font-medium text-surface">
                  <Icon name="pen" size={13} />
                  Send
                </span>
              </span>
            </div>

            <div className="flex min-h-0 flex-1 gap-5 p-5">
              {/* The document */}
              <div className="flex w-[400px] flex-none flex-col gap-3 rounded-sm bg-surface-raised p-6 shadow-[0_0_0_1px_var(--line),0_18px_40px_-24px_rgba(0,0,0,0.35)]">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">Bail bond agreement · page 3 of 3</span>
                <span className="text-[15px] font-semibold">Indemnitor’s agreement</span>
                <span className="flex flex-col gap-2 pt-1">
                  {['100%', '94%', '98%', '72%', '100%', '88%', '64%'].map((w, i) => (
                    <Line key={i} w={w} />
                  ))}
                </span>

                <span className="mt-auto grid grid-cols-[1fr_96px] gap-3">
                  <span className="flex flex-col gap-1.5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-nuqta">Signature · Defendant</span>
                    <span className="relative flex h-[64px] items-end rounded-sm border border-dashed border-vermilion bg-surface-raised px-3 pb-1.5">
                      <Signature className="h-[46px] w-full bg-surface-raised text-ink" />
                    </span>
                  </span>
                  <span className="flex flex-col gap-1.5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">Date</span>
                    <span className="flex h-[64px] items-end border-b border-line-strong pb-2 font-mono text-[12px]">10/13/2026</span>
                  </span>
                </span>
                <span className="flex flex-col gap-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">Signature · Cosigner</span>
                  <span className="flex h-[40px] items-center rounded-sm border border-dashed border-line-strong px-3 text-[12px] text-ink-faint">
                    Waiting for Grace Okafor
                  </span>
                </span>
              </div>

              {/* Signers and activity */}
              <div className="flex min-w-0 flex-1 flex-col gap-4">
                <div className="rounded-sm border border-line bg-surface-raised p-4">
                  <span className="flex items-center justify-between">
                    <span className="font-medium">Signers</span>
                    <span className="font-mono text-[11px] text-ink-muted">1 of 3 signed</span>
                  </span>
                  <span className="mt-3 block h-[3px] rounded-full bg-line">
                    <span className="block h-full w-1/3 rounded-full bg-vermilion" />
                  </span>
                  <ul className="mt-3 flex flex-col">
                    {SIGNERS.map((s, i) => (
                      <li
                        key={s.name}
                        data-reveal="rise"
                        style={{ '--d': `${300 + i * 140}ms` } as CSSProperties}
                        className="flex items-center gap-3 border-t border-line py-2.5 first:border-t-0"
                      >
                        <span className="grid size-8 flex-none place-items-center rounded-full bg-surface-sunken font-mono text-[11px]">
                          {s.initials}
                        </span>
                        <span className="flex min-w-0 flex-1 flex-col">
                          <span className="truncate font-medium">{s.name}</span>
                          <span className="text-[11px] text-ink-faint">{s.role}</span>
                        </span>
                        <Status tone={s.tone}>{s.status}</Status>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex-1 rounded-sm border border-line bg-surface-raised p-4">
                  <span className="flex items-center gap-2 font-medium">
                    <Icon name="shield" size={14} />
                    Audit trail
                  </span>
                  <ol className="mt-3 flex flex-col gap-2.5">
                    {ACTIVITY.map((a, i) => (
                      <li key={a.time} className="flex items-start gap-3">
                        <span
                          className={cn('mt-[5px] size-[7px] flex-none rotate-45', i === ACTIVITY.length - 1 ? 'bg-vermilion' : 'bg-ink-faint')}
                        />
                        <span className="w-[64px] flex-none font-mono text-[11px] text-ink-faint">{a.time}</span>
                        <span className="text-[12px] text-ink-muted">{a.text}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Scaled>
    </Browser>
  );
}

/** The cosigner's side: signing on a phone. */
export function SignPhone() {
  return (
    <Phone>
      <div className="flex h-full w-full flex-col bg-surface text-[13px] text-ink">
        <div className="h-9" />
        <div className="flex items-center justify-between border-b border-line px-4 pb-3">
          <span className="flex items-center gap-1.5 text-[12px] font-semibold">
            <span className="size-[7px] rotate-45 bg-vermilion" />
            TRACE Sign
          </span>
          <span className="font-mono text-[10px] text-ink-faint">3 of 3</span>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4">
          <span className="text-[15px] font-semibold leading-tight">Bail bond agreement</span>
          <span className="text-[11px] text-ink-muted">From Ellison &amp; Reyes · for Grace Okafor</span>
          <span className="flex flex-col gap-1.5 pt-1">
            {['100%', '92%', '97%', '70%'].map((w, i) => (
              <Line key={i} w={w} />
            ))}
          </span>
          <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-nuqta">Sign here</span>
          <span className="relative flex h-[120px] items-center rounded-sm border border-dashed border-vermilion bg-surface-raised px-3">
            <Signature className="h-[58px] w-full bg-surface-raised text-ink" />
            <span className="absolute inset-x-3 bottom-6 h-px bg-line-strong" />
          </span>
          <span className="flex items-center gap-2 text-[11px] text-ink-muted">
            <span className="grid size-4 place-items-center rounded-[3px] bg-ink text-surface">
              <Icon name="check" size={10} />
            </span>
            I agree to sign electronically
          </span>
          <span className="mt-auto flex h-11 items-center justify-center rounded-sm bg-vermilion text-[13px] font-medium text-on-nuqta">
            Adopt and sign
          </span>
        </div>
      </div>
    </Phone>
  );
}
