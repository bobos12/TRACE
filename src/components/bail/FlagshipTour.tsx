'use client';

import Image from 'next/image';
import { Fragment, useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from 'react';
import { Icon } from '@/components/ui/Icon';
import type { BailBonds } from '@/lib/content';
import { cn } from '@/lib/cn';
import { Browser } from './Frames';

type Flagship = BailBonds['flagship'];

const shot = (name: string) => `/images/ellison-reyes/${name}.jpg`;

const REDUCE = '(prefers-reduced-motion: reduce)';
const onMotionChange = (cb: () => void) => {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};

/** Reduced motion, null on the server and while hydrating, so the markup matches. */
function useReduced(): boolean | null {
  return useSyncExternalStore(onMotionChange, () => window.matchMedia(REDUCE).matches, () => null);
}

/**
 * Ellison & Reyes, screen by screen: a button per feature, grouped by who it
 * serves, and the genuine capture of it in a browser — with the phone version
 * over the corner where one exists.
 *
 * It plays by itself while on screen: the chosen row's bar fills (CSS, see
 * `.tour-progress`) and the next screen follows. Hovering pauses it; the
 * first click, tap or arrow key hands it over for good. Reduced motion never
 * starts it. A capture is fetched only when its row is next, hovered,
 * focused or chosen, then kept, so switching back crossfades.
 */
export function FlagshipTour({ copy }: { copy: Flagship }) {
  const { screens } = copy;
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState<ReadonlySet<number>>(() => new Set([0, 1]));
  const reduced = useReduced();
  const [stopped, setStopped] = useState(false);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = screens[active]!;
  const last = screens.length - 1;
  // Autoplay only where motion is welcome (null until known), until the visitor takes over.
  const auto = reduced === false && !stopped;
  const playing = auto && inView && !hovered;

  // Pause it while off screen.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(!!e?.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const warm = (i: number) => setSeen((s) => (s.has(i) ? s : new Set(s).add(i)));

  /** Bring a chip into the phone row without moving the page. */
  const reveal = (i: number) => {
    const r = row.current;
    const el = tabs.current[i];
    if (!r || !el || r.scrollWidth <= r.clientWidth) return;
    r.scrollTo({ left: el.offsetLeft - 24, behavior: 'smooth' });
  };

  const show = (i: number) => {
    warm(i);
    warm(i === last ? 0 : i + 1);
    setActive(i);
    reveal(i);
  };

  const pick = (i: number, focus = false) => {
    setStopped(true);
    show(i);
    if (focus) tabs.current[i]?.focus();
  };

  const onKey = (e: KeyboardEvent) => {
    const next =
      e.key === 'ArrowDown' || e.key === 'ArrowRight'
        ? active === last ? 0 : active + 1
        : e.key === 'ArrowUp' || e.key === 'ArrowLeft'
          ? active === 0 ? last : active - 1
          : e.key === 'Home' ? 0 : e.key === 'End' ? last : null;
    if (next === null) return;
    e.preventDefault();
    pick(next, true);
  };

  /** The filling bar under the chosen feature; when it is full, the next one shows. */
  const progress = auto ? (
    <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[2px] overflow-hidden bg-line">
      <span
        key={active}
        onAnimationEnd={() => show(active === last ? 0 : active + 1)}
        className="tour-progress block h-full bg-vermilion"
        style={{ animationPlayState: playing ? 'running' : 'paused' }}
      />
    </span>
  ) : null;

  return (
    <div
      ref={root}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10"
    >
      {/* The screen. */}
      <div
        id="flagship-panel"
        role="tabpanel"
        aria-labelledby={`flagship-tab-${active}`}
        className="relative pe-[13%] pb-8 sm:pb-10 lg:sticky lg:top-24 lg:order-2 lg:col-span-8 lg:self-start"
      >
        <Browser url={copy.url}>
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-sunken">
            {screens.map((s, i) =>
              seen.has(i) ? (
                <Image
                  key={s.desktop}
                  src={shot(s.desktop)}
                  alt={i === active ? s.alt : ''}
                  aria-hidden={i === active ? undefined : true}
                  fill
                  sizes="(max-width: 1024px) 86vw, 760px"
                  className={cn(
                    'object-cover object-top transition-opacity duration-[480ms] ease-mark',
                    i === active ? 'opacity-100' : 'opacity-0',
                  )}
                />
              ) : null,
            )}
          </div>
        </Browser>

        <div
          aria-hidden="true"
          className={cn(
            'band-carbon absolute end-0 bottom-0 w-[27%] max-w-[210px] overflow-hidden rounded-[24px] p-1.5 shadow-float ring-1 ring-line-strong transition-[opacity,transform] duration-[480ms] ease-mark',
            current.mobile ? 'opacity-100' : 'translate-y-4 opacity-0',
          )}
        >
          <div className="relative aspect-[390/844] overflow-hidden rounded-[18px] bg-surface-sunken">
            {screens.map((s, i) =>
              s.mobile && seen.has(i) ? (
                <Image
                  key={s.mobile}
                  src={shot(s.mobile)}
                  alt=""
                  fill
                  sizes="210px"
                  className={cn(
                    'object-cover object-top transition-opacity duration-[480ms] ease-mark',
                    i === active ? 'opacity-100' : 'opacity-0',
                  )}
                />
              ) : null,
            )}
          </div>
        </div>
      </div>

      {/* The features: a swipeable row of chips on phones, a column of buttons beside the screen on wide ones. */}
      <div className="flex flex-col gap-4 lg:order-1 lg:col-span-4">
        <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-ink-muted">
          <Icon name="arrow-right" size={14} className="text-nuqta lg:rotate-90" />
          {copy.tourHint}
        </p>

        <div
          ref={row}
          role="tablist"
          aria-label={copy.tourLabel}
          onKeyDown={onKey}
          className="relative -mx-6 flex snap-x snap-mandatory scroll-px-6 gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] lg:mx-0 lg:snap-none lg:flex-col lg:gap-1.5 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          {screens.map((s, i) => {
            const on = i === active;
            const groupStart = i === 0 || screens[i - 1]!.group !== s.group;
            return (
              <Fragment key={s.desktop}>
                {groupStart ? (
                  <p
                    aria-hidden="true"
                    className={cn(
                      'hidden font-mono text-[11px] tracking-[0.12em] text-ink-faint uppercase lg:block',
                      i === 0 ? 'pb-1.5' : 'pt-5 pb-1.5',
                    )}
                  >
                    {copy.groups[s.group]}
                  </p>
                ) : null}
                <button
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`flagship-tab-${i}`}
                  aria-selected={on}
                  aria-controls="flagship-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => pick(i)}
                  onPointerEnter={() => warm(i)}
                  onFocus={() => warm(i)}
                  className={cn(
                    'group/tab relative flex-none cursor-pointer snap-start overflow-hidden text-start transition-[color,background-color,box-shadow] duration-[160ms] ease-mark',
                    // phones: a chip
                    'rounded-full border px-4 py-2 text-[14px] font-medium',
                    on ? 'border-ink bg-ink text-surface' : 'border-line-strong text-ink-muted',
                    // wide: a button in a column
                    'lg:rounded-sm lg:border-0 lg:px-4 lg:py-3 lg:ring-1',
                    on
                      ? 'lg:bg-surface-raised lg:text-ink lg:ring-line-strong'
                      : 'lg:bg-transparent lg:ring-line lg:hover:bg-surface-raised lg:hover:text-ink lg:hover:ring-line-strong',
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        'hidden w-5 flex-none font-mono text-[11px] lg:inline',
                        on ? 'text-nuqta' : 'text-ink-faint',
                      )}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="lg:text-[15px] lg:font-semibold lg:tracking-[-0.01em]">{s.title}</span>
                    {on ? (
                      <span aria-hidden="true" className="ms-auto hidden size-[7px] flex-none rotate-45 bg-vermilion lg:block" />
                    ) : (
                      <Icon
                        name="chevron-right"
                        size={16}
                        className="ms-auto hidden flex-none text-ink-faint transition-transform duration-[160ms] ease-mark group-hover/tab:translate-x-0.5 group-hover/tab:text-ink lg:block"
                      />
                    )}
                  </span>
                  {/* What it does — opened under the chosen button. */}
                  <span
                    className={cn(
                      'hidden ps-8 text-[14px] leading-snug font-normal text-ink-muted lg:grid lg:transition-[grid-template-rows,opacity] lg:duration-[320ms] lg:ease-mark',
                      on ? 'lg:grid-rows-[1fr] lg:opacity-100' : 'lg:grid-rows-[0fr] lg:opacity-0',
                    )}
                  >
                    <span className="overflow-hidden">
                      <span className="block pt-1.5">{s.text}</span>
                    </span>
                  </span>
                  {on ? <span className="hidden lg:contents">{progress}</span> : null}
                </button>
              </Fragment>
            );
          })}
        </div>

        {/* Phones read what the chosen screen does under the chips. */}
        <div className="relative flex items-baseline gap-3 pb-4 lg:hidden">
          <span className="font-mono text-[11px] text-nuqta">{String(active + 1).padStart(2, '0')}</span>
          <p aria-live={auto ? 'off' : 'polite'} className="flex flex-col gap-1">
            <span className="font-mono text-[11px] tracking-[0.12em] text-ink-faint uppercase">
              {copy.groups[current.group]}
            </span>
            <span className="body text-ink-muted">{current.text}</span>
          </p>
          {progress}
        </div>
      </div>
    </div>
  );
}

export default FlagshipTour;
