import Image from 'next/image';
import type { ReactNode } from 'react';
import type { BailBonds } from '@/lib/content';
import { cn } from '@/lib/cn';

/*
 * Ironwood Bail Bonds — a fictional, established Houston agency, drawn as the
 * site TRACE would build (new) and the one it might have today (old). Both are
 * real-looking products with their own palettes (`.mock-ironwood`,
 * `.mock-old` in globals.css) that stay the same in light and dark. The page
 * labels every one of them as a concept.
 */

type Demo = BailBonds['demo'];

export const SITE_W = 1100;
export const SITE_H = 720;

/* A few glyphs the agency's site uses, in its own heavier style. */
const G = {
  phone:
    'M5 3.5h4l1.5 4.5-2.5 1.5a11 11 0 0 0 6.5 6.5l1.5-2.5 4.5 1.5v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5.5a2 2 0 0 1 2-2z',
  check: 'M4.5 12.5l5 5 10-11',
  pin: 'M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3.5 2',
  shield: 'M12 3l8 3v6c0 5-3.5 8.5-8 9.5C7.5 20.5 4 17 4 12V6z',
  card: 'M3 6h18v12H3zM3 10h18M7 15h4',
  chat: 'M4 5h16v11H9l-5 4z',
  chevron: 'M6 9l6 6 6-6',
  star: 'M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z',
};

function Glyph({ d, size = 14, className, fill = false }: { d: string; size?: number; className?: string; fill?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      className={cn('flex-none', className)}
      fill={fill ? 'currentColor' : 'none'}
      stroke={fill ? 'none' : 'currentColor'}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}

function Stars({ size = 11, className }: { size?: number; className?: string }) {
  return (
    <span className={cn('flex gap-px text-[var(--iw-star)]', className)}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Glyph key={i} d={G.star} size={size} fill />
      ))}
    </span>
  );
}

/** The agency's mark: a shield with a column, and a serif wordmark. */
export function IronwoodLogo({ demo, tone = 'navy' }: { demo: Demo; tone?: 'navy' | 'white' }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 32 36" width={30} height={34} aria-hidden="true">
        <path d="M16 1l14 5v10c0 9-6 15.5-14 19C8 31.5 2 25 2 16V6z" fill="var(--iw-navy)" />
        <path
          d="M16 4.6l10.6 3.8v7.7c0 7-4.5 12-10.6 14.8C9.9 28.1 5.4 23.1 5.4 16.1V8.4z"
          fill="none"
          stroke="var(--iw-brass)"
          strokeWidth="1.2"
        />
        <path d="M11 11h10v1.6H11zM12.4 12.6h1.6v9h-1.6zM15.2 12.6h1.6v9h-1.6zM18 12.6h1.6v9H18zM10.6 21.6h10.8v1.8H10.6z" fill="var(--iw-brass)" />
        <path d="M16 7.4l5.4 3H10.6z" fill="var(--iw-brass)" />
      </svg>
      <span className={cn('flex flex-col leading-none', tone === 'navy' ? 'text-[var(--iw-navy)]' : 'text-[var(--iw-paper)]')}>
        <span className="font-[family-name:var(--iw-serif)] text-[21px] font-bold tracking-[0.08em]">
          {demo.name.toUpperCase()}
        </span>
        <span className="mt-1 text-[8px] font-semibold tracking-[0.28em] opacity-70">{demo.site.logoSub.toUpperCase()}</span>
      </span>
    </span>
  );
}

/** The site we would build — 1100 × 720. */
export function IronwoodSite({ demo }: { demo: Demo }) {
  const { site } = demo;
  const proofIcons = [G.star, G.shield, G.clock, G.card];

  return (
    <div className="mock-ironwood relative flex h-full w-full flex-col overflow-hidden bg-[var(--iw-ivory)]">
      {/* utility bar */}
      <div className="flex h-[34px] flex-none items-center justify-between bg-[var(--iw-navy-deep)] px-12 text-[11.5px] text-[var(--iw-soft)]">
        <span className="flex items-center gap-1.5">
          <Glyph d={G.pin} size={12} className="text-[var(--iw-brass)]" />
          {site.utility}
        </span>
        <span className="flex items-center gap-5">
          <span>{site.spanish}</span>
          <span className="h-3 w-px bg-[var(--iw-soft)] opacity-30" />
          <span className="flex items-center gap-1.5 text-[var(--iw-paper)]">
            <Stars size={10} /> {site.reviews}
          </span>
        </span>
      </div>

      {/* header */}
      <div className="flex h-[76px] flex-none items-center justify-between border-b border-[var(--iw-line)] bg-[var(--iw-paper)] px-12">
        <IronwoodLogo demo={demo} />
        <div className="flex items-center gap-6 text-[13.5px] font-medium text-[var(--iw-ink)]">
          {site.nav.map((n, i) => (
            <span key={n} className="flex items-center gap-1">
              {n}
              {i < 2 ? <Glyph d={G.chevron} size={12} className="opacity-50" /> : null}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <span className="flex flex-col items-end leading-tight">
            <span className="text-[10px] font-bold tracking-[0.14em] text-[var(--iw-red)]">{site.hotline.toUpperCase()}</span>
            <span className="text-[18px] font-bold text-[var(--iw-navy)] tabular-nums">{demo.phone}</span>
          </span>
          <span className="flex h-11 items-center gap-2 rounded-[4px] bg-[var(--iw-red)] px-5 text-[13.5px] font-semibold text-[var(--iw-paper)]">
            <Glyph d={G.phone} size={14} /> {site.callNow}
          </span>
        </div>
      </div>

      {/* hero: the courthouse under a navy wash, the release form beside it */}
      <div className="relative h-[366px] flex-none overflow-hidden bg-[var(--iw-navy)]">
        <Image
          src="/images/bail/courthouse.jpg"
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 1100px"
          className="object-cover object-[50%_28%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(10_24_46/0.96)_0%,rgb(10_24_46/0.86)_46%,rgb(10_24_46/0.35)_100%)]" />
        <div className="relative flex h-full items-center justify-between gap-10 px-12">
          <div className="flex max-w-[540px] flex-col gap-4 text-[var(--iw-paper)]">
            <span className="text-[11px] font-semibold tracking-[0.2em] text-[var(--iw-brass)]">{site.eyebrow.toUpperCase()}</span>
            <p className="font-[family-name:var(--iw-serif)] text-[44px] leading-[1.06] tracking-[-0.01em]">{site.headline}</p>
            <p className="max-w-[470px] text-[14.5px] leading-[1.6] text-[var(--iw-soft)]">{site.sub}</p>
            <div className="flex items-center gap-3 pt-1">
              <span className="flex h-12 items-center gap-2 rounded-[4px] bg-[var(--iw-red)] px-6 text-[14.5px] font-semibold">
                <Glyph d={G.phone} size={15} /> {site.call} {demo.phone}
              </span>
              <span className="flex h-12 items-center rounded-[4px] border border-[var(--iw-paper)]/45 px-6 text-[14.5px] font-semibold">
                {site.start}
              </span>
            </div>
            <span className="flex gap-5 text-[12.5px] text-[var(--iw-soft)]">
              {site.checks.map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <Glyph d={G.check} size={13} className="text-[var(--iw-brass)]" /> {t}
                </span>
              ))}
            </span>
          </div>

          <div className="flex w-[318px] flex-none flex-col gap-2.5 rounded-[6px] bg-[var(--iw-paper)] p-5 shadow-[0_18px_40px_-12px_rgb(0_0_0/0.5)]">
            <span className="flex flex-col gap-0.5">
              <span className="font-[family-name:var(--iw-serif)] text-[18px] font-bold text-[var(--iw-navy)]">{site.form.title}</span>
              <span className="text-[11.5px] text-[var(--iw-muted)]">{site.form.sub}</span>
            </span>
            {site.form.fields.map((f, i) => (
              <span key={f} className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-[var(--iw-ink)]">{f}</span>
                <span className="flex h-8 items-center justify-between rounded-[4px] border border-[var(--iw-line)] bg-[var(--iw-ivory)] px-3 text-[12px] text-[var(--iw-ink)]">
                  {site.form.values[i] ?? ''}
                  {site.form.values[i] ? <Glyph d={G.chevron} size={12} className="opacity-50" /> : null}
                </span>
              </span>
            ))}
            <span className="mt-1 flex h-10 items-center justify-center rounded-[4px] bg-[var(--iw-navy)] text-[13.5px] font-semibold text-[var(--iw-paper)]">
              {site.form.submit}
            </span>
            <span className="flex items-center justify-center gap-1.5 text-[10.5px] text-[var(--iw-muted)]">
              <Glyph d={G.clock} size={11} /> {site.form.note}
            </span>
          </div>
        </div>
      </div>

      {/* proof band */}
      <div className="grid h-[78px] flex-none grid-cols-4 items-center border-b border-[var(--iw-line)] bg-[var(--iw-paper)] px-12">
        {site.proof.map((x, i) => (
          <span key={x.a} className={cn('flex items-center gap-3', i > 0 && 'border-l border-[var(--iw-line)] pl-6')}>
            <span className="grid size-9 flex-none place-items-center rounded-full bg-[var(--iw-ivory)] text-[var(--iw-navy)]">
              <Glyph d={proofIcons[i]!} size={16} fill={i === 0} />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="font-[family-name:var(--iw-serif)] text-[15.5px] font-bold text-[var(--iw-navy)]">{x.a}</span>
              <span className="text-[11.5px] text-[var(--iw-muted)]">{x.b}</span>
            </span>
          </span>
        ))}
      </div>

      {/* below the fold */}
      <div className="grid flex-1 grid-cols-[1.15fr_1fr_1fr] gap-7 px-12 pt-5">
        <div className="flex flex-col gap-2.5">
          <span className="text-[10.5px] font-bold tracking-[0.18em] text-[var(--iw-red)]">{site.jailsTitle.toUpperCase()}</span>
          {site.jails.map((j) => (
            <span key={j.name} className="flex items-start gap-2 border-b border-[var(--iw-line)] pb-2">
              <Glyph d={G.pin} size={14} className="mt-0.5 text-[var(--iw-red)]" />
              <span className="flex flex-col">
                <span className="text-[13px] font-semibold">{j.name}</span>
                <span className="text-[11.5px] text-[var(--iw-muted)]">{j.where}</span>
              </span>
            </span>
          ))}
        </div>
        <div className="flex gap-4 self-start rounded-[6px] border border-[var(--iw-line)] bg-[var(--iw-paper)] p-4">
          <span className="relative h-[104px] w-[82px] flex-none overflow-hidden rounded-[4px]">
            <Image src="/images/bail/agent.jpg" alt="" fill sizes="88px" className="object-cover" />
          </span>
          <span className="flex flex-col gap-1.5">
            <span className="text-[10.5px] font-bold tracking-[0.18em] text-[var(--iw-red)]">{site.agent.label.toUpperCase()}</span>
            <span className="font-[family-name:var(--iw-serif)] text-[17px] font-bold text-[var(--iw-navy)]">{site.agent.name}</span>
            <span className="text-[12px] leading-[1.5] text-[var(--iw-muted)]">{site.agent.role}</span>
          </span>
        </div>
        <div className="flex flex-col gap-2 self-start rounded-[6px] border border-[var(--iw-line)] bg-[var(--iw-paper)] p-4">
          <Stars size={12} />
          <span className="text-[13px] leading-[1.55]">“{site.review.text}”</span>
          <span className="text-[11.5px] text-[var(--iw-muted)]">
            {site.review.by} · {site.review.source}
          </span>
        </div>
      </div>

      {/* chat launcher */}
      <div className="absolute right-7 bottom-6 flex items-center gap-3">
        <span className="rounded-[6px] bg-[var(--iw-paper)] px-3.5 py-2.5 text-[12.5px] font-medium shadow-[0_8px_24px_-8px_rgb(0_0_0/0.35)]">
          {site.chat}
        </span>
        <span className="relative grid size-14 place-items-center rounded-full bg-[var(--iw-navy)] text-[var(--iw-paper)] shadow-[0_10px_28px_-8px_rgb(0_0_0/0.55)]">
          <Glyph d={G.chat} size={22} />
          <span className="absolute top-0.5 right-0.5 size-3.5 rounded-full border-2 border-[var(--iw-paper)] bg-[var(--iw-red)]" />
        </span>
      </div>
    </div>
  );
}

function Bevel({ children }: { children: ReactNode }) {
  return (
    <span className="block border-2 border-t-[var(--old-page)] border-r-[var(--old-grey-dark)] border-b-[var(--old-grey-dark)] border-l-[var(--old-page)] bg-[var(--old-grey)] px-3 py-1.5 text-[11px] font-bold text-[var(--old-link)] underline">
      {children}
    </span>
  );
}

/** The site an agency might have today — 1100 × 720. A 2011 template. */
export function IronwoodOld({ demo }: { demo: Demo }) {
  const { old } = demo;
  return (
    <div className="mock-old flex h-full w-full justify-center bg-[var(--old-bg)]">
      <div className="flex w-[800px] flex-col border-x-2 border-[var(--old-grey-dark)] bg-[var(--old-page)]">
        {/* banner */}
        <div className="flex h-[118px] flex-none items-center gap-6 border-b-4 border-[var(--old-yellow)] bg-[var(--old-banner)] px-6">
          <span className="relative h-[80px] w-[120px] flex-none border-2 border-[var(--old-page)]">
            <Image src="/images/bail/gavel-old.jpg" alt="" fill sizes="120px" className="object-cover" />
          </span>
          <span className="flex flex-col items-center gap-1 text-center">
            <span className="font-[family-name:var(--old-impact)] text-[38px] leading-none tracking-[0.02em] text-[var(--old-yellow)] [text-shadow:3px_3px_0_var(--old-banner-deep)]">
              {old.title}
            </span>
            <span className="font-[family-name:var(--old-serif)] text-[15px] text-[var(--old-page)] italic">{old.tagline}</span>
          </span>
        </div>
        {/* ticker */}
        <div className="flex h-6 flex-none items-center overflow-hidden whitespace-nowrap bg-[var(--old-text)] px-3 text-[11px] font-bold text-[var(--old-red)]">
          {old.ticker} {old.ticker}
        </div>
        {/* body */}
        <div className="flex flex-1">
          <div className="flex w-[170px] flex-none flex-col gap-1.5 border-r border-[var(--old-grey)] bg-[var(--old-grey)]/40 p-3">
            {old.nav.map((n) => (
              <Bevel key={n}>{n}</Bevel>
            ))}
          </div>
          <div className="flex flex-1 flex-col gap-3 p-5">
            <p className="font-[family-name:var(--old-serif)] text-[24px] font-bold text-[var(--old-banner)] underline">
              {old.heading}
            </p>
            {old.body.map((b) => (
              <p key={b} className="text-[11px] leading-[1.5]">
                {b}
              </p>
            ))}
            <p className="font-[family-name:var(--old-serif)] text-[13px] italic">{old.review}</p>
            <div className="mt-1 flex w-fit items-center gap-3 border-2 border-dashed border-[var(--old-text)] bg-[var(--old-yellow)] px-4 py-2 text-[11px] font-bold">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path d="M12 2L23 21H1z" fill="var(--old-text)" />
                <path d="M12 6l8 13H4z" fill="var(--old-yellow)" />
                <path d="M11 10h2v5h-2zM11 16h2v2h-2z" fill="var(--old-text)" />
              </svg>
              {old.construction}
            </div>
          </div>
        </div>
        {/* footer */}
        <div className="flex flex-none flex-col items-center gap-1.5 border-t border-[var(--old-grey)] py-3 text-center">
          <p className="text-[9.5px]">{old.phone}</p>
          <p className="flex items-center gap-1.5 text-[9.5px]">
            {old.counterLabel}
            <span className="flex">
              {old.counter.split('').map((c, i) => (
                <span key={i} className="border border-[var(--old-grey-dark)] bg-[var(--old-text)] px-[3px] font-mono text-[11px] text-[var(--old-green)]">
                  {c}
                </span>
              ))}
            </span>
          </p>
          <p className="text-[8.5px] text-[var(--old-grey-dark)]">{old.footer}</p>
          <p className="text-[8.5px] text-[var(--old-grey-dark)]">{old.ie}</p>
        </div>
      </div>
    </div>
  );
}
