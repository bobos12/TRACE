import type { CSSProperties, ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';
import { Icon, type IconName } from '@/components/ui/Icon';
import { StopText } from '@/components/brand/Nuqta';
import { BookCallButton } from '@/components/contact/ContactButtons';
import type { Site } from '@/lib/content';
import { cn } from '@/lib/cn';

type Copy = Site['aiSection'];

/** One icon per benefit, in content order. */
const ICONS: IconName[] = ['message', 'clock', 'users', 'user'];

function delay(ms: number): CSSProperties {
  return { '--d': `${ms}ms` } as CSSProperties;
}

/** A rhombus centred on (x, y), `r` from centre to corner. */
function rhombus(x: number, y: number, r: number) {
  return `M${x} ${y - r}L${x + r} ${y}L${x} ${y + r}L${x - r} ${y}Z`;
}

/** A sleeve: a rim around a carbon fill, rounded at both ends. */
function Sleeve({ d }: { d: string }) {
  return (
    <>
      <path d={d} fill="none" stroke="var(--line-strong)" strokeWidth="23" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke="var(--carbon)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

const EYES = ['M164 160Q176 144 188 160', 'M212 160Q224 144 236 160'];

/**
 * The bail agency's night-shift counsel: a smiling bot in a carbon suit and a
 * vermilion tie, a headset on, waving hello with a briefcase in the other
 * hand. Drawn in theme-fixed tokens so it reads the same in light and dark.
 */
function Bot() {
  const line = { stroke: 'var(--carbon)', strokeWidth: 2.5 };
  const rim = { stroke: 'var(--line-strong)', strokeWidth: 2.5 };

  return (
    <svg viewBox="64 36 300 318" className="block size-full overflow-visible" aria-hidden="true">
      <defs>
        <filter id="ai-bot-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* Antenna, ending in the nuqta. */}
      <path d="M200 100V80" stroke="var(--line-strong)" strokeWidth="2.5" />
      <path d={rhombus(200, 68, 12)} fill="var(--vermilion)" filter="url(#ai-bot-glow)" className="at-breathe-glow" />
      <path d={rhombus(200, 68, 12)} fill="var(--vermilion)" className="at-breathe" />

      {/* The waving arm, behind the body. */}
      <g className="ai-bot-wave">
        <Sleeve d="M152 262L114 224L108 192" />
        <circle cx="107" cy="180" r="14" fill="var(--chalk)" {...line} />
      </g>

      {/* The other arm, carrying the briefcase. */}
      <Sleeve d="M248 262L288 290" />
      <g {...line}>
        <path d="M284 304V296Q284 288 292 288H304Q312 288 312 296V304" fill="none" strokeWidth="4" />
        <rect x="268" y="302" width="60" height="42" rx="7" fill="var(--warning)" />
        <path d="M268 318H328" />
        <rect x="292" y="313" width="12" height="10" rx="2" fill="var(--chalk)" />
      </g>
      <circle cx="298" cy="292" r="13" fill="var(--chalk)" {...line} />

      {/* The suit: carbon jacket, white shirt, vermilion tie, lapels. */}
      <rect x="146" y="234" width="108" height="112" rx="30" fill="var(--carbon)" {...rim} />
      <path d="M176 236H224L200 290Z" fill="var(--chalk)" />
      <path d="M176 236L168 262L196 300M224 236L232 262L204 300" fill="none" stroke="var(--ash)" strokeWidth="2.5" strokeLinejoin="round" />
      <path d={rhombus(200, 246, 7)} fill="var(--vermilion)" />
      <path d="M196 252H204L209 278L200 290L191 278Z" fill="var(--vermilion)" />
      <circle cx="200" cy="314" r="3.5" fill="var(--ash)" />
      <circle cx="200" cy="330" r="3.5" fill="var(--ash)" />
      <rect x="186" y="218" width="28" height="20" rx="6" fill="var(--chalk)" {...line} />

      {/* Headset ear pieces. */}
      <rect x="108" y="136" width="20" height="50" rx="10" fill="var(--carbon)" {...rim} />
      <rect x="272" y="136" width="20" height="50" rx="10" fill="var(--carbon)" {...rim} />

      {/* Head. */}
      <rect x="122" y="100" width="156" height="124" rx="38" fill="var(--carbon)" {...rim} />

      {/* The face: a carbon screen, vermilion eyes and a smile. */}
      <g className="band-carbon">
        <rect x="140" y="120" width="120" height="82" rx="26" fill="var(--carbon)" stroke="var(--ash)" strokeWidth="2" />
        <g filter="url(#ai-bot-glow)" opacity="0.6" fill="none" stroke="var(--vermilion)" strokeWidth="6" strokeLinecap="round">
          {EYES.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        <g className="ai-bot-blink" fill="none" stroke="var(--vermilion)" strokeWidth="6" strokeLinecap="round">
          {EYES.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        <path d="M184 176Q200 190 216 176" fill="none" stroke="var(--vermilion)" strokeWidth="4.5" strokeLinecap="round" />
      </g>

      {/* The mic, from the right ear to the smile. */}
      <path d="M282 184V196Q282 214 260 214H240" fill="none" stroke="var(--line-strong)" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="236" cy="214" r="6" fill="var(--vermilion)" />
    </svg>
  );
}

/** A floating card that speaks for the bot: square at the corner facing it. */
function Bubble({
  at,
  corner,
  d,
  float,
  className,
  children,
}: {
  at: string;
  corner: string;
  d: number;
  float: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div data-reveal="rise" style={delay(d)} className={cn('absolute max-sm:hidden', at)}>
      <div
        className={cn('ai-bot-float rounded-lg bg-surface-raised p-3.5 shadow-float ring-1 ring-line', corner, className)}
        style={{ animationDelay: float }}
      >
        {children}
      </div>
    </div>
  );
}

function Meta({ icon, children }: { icon: IconName; children: ReactNode }) {
  return (
    <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-faint">
      <Icon name={icon} size={12} />
      {children}
    </span>
  );
}

/**
 * The centerpiece: the bot floating on the page, its shadow breathing with
 * it, and three bubbles drifting around it — the inquiry answered, the
 * details captured, the lead handed over. The pieces arrive once; the hover,
 * wave, blink and nuqta keep going, and all of it is still under reduced motion.
 */
function Visual({ v }: { v: Copy['visual'] }) {
  const { answered, captured, handoff } = v;

  return (
    <figure className="relative m-0 aspect-[4/3] sm:aspect-square">
      <figcaption className="sr-only">{v.alt}</figcaption>

      <div aria-hidden="true" className="absolute inset-0">
        <span
          data-reveal="rise"
          style={delay(250)}
          className="absolute top-1/2 left-1/2 aspect-[300/350] h-[92%] -translate-x-1/2 -translate-y-1/2 sm:h-[72%]"
        >
          <span className="ai-bot-float block h-[94%]">
            <Bot />
          </span>
          <span className="ai-bot-shadow absolute bottom-0 left-[29%] block h-3 w-[42%] rounded-[50%] bg-ink opacity-15 blur-md" />
        </span>

        <Bubble at="top-[1%] start-0 sm:top-[5%]" corner="rounded-ee-none" d={500} float="0s">
          <span className="flex items-center justify-between gap-4">
            <Meta icon="message">{answered.meta}</Meta>
            <span className="flex items-center gap-1 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-nuqta">
              <span className="size-1.5 rounded-full bg-nuqta" />
              {answered.tag}
            </span>
          </span>
          <span className="mt-1.5 block text-[15px] font-semibold tracking-[-0.01em] text-ink">{answered.title}</span>
        </Bubble>

        <Bubble at="top-[37%] end-0 max-sm:hidden" corner="rounded-ss-none" d={700} float="-2s" className="w-[220px]">
          <Meta icon="file">{captured.meta}</Meta>
          <dl className="m-0 mt-2 flex flex-col">
            {captured.rows.map((r) => (
              <div key={r.k} className="flex items-baseline justify-between gap-3 border-t border-line py-1.5 first:border-t-0">
                <dt className="text-[12px] text-ink-muted">{r.k}</dt>
                <dd className="m-0 font-mono text-[12px] font-medium text-ink tabular-nums">{r.v}</dd>
              </div>
            ))}
          </dl>
        </Bubble>

        <Bubble
          at="bottom-0 end-0 sm:bottom-[3%]"
          corner="rounded-ss-none"
          d={900}
          float="-4s"
        >
          <span className="flex items-center gap-3">
            <span className="grid size-9 flex-none place-items-center rounded-full bg-ink text-surface">
              <Icon name="user" size={17} />
            </span>
            <span className="flex flex-col gap-0.5">
              <Meta icon="users">{handoff.meta}</Meta>
              <span className="text-[14px] font-semibold tracking-[-0.01em] text-ink">{handoff.title}</span>
            </span>
            <span className="ms-2 inline-flex h-6 items-center gap-1 rounded-sm bg-success-soft px-2 text-[11px] font-semibold text-success">
              <Icon name="check" size={12} />
              {handoff.tag}
            </span>
          </span>
        </Bubble>
      </div>
    </figure>
  );
}

/**
 * AI for the business, said plainly: the promise and four benefits on the
 * leading side, one memorable picture of it on the other. Nothing takes input.
 */
export function AiSection({ site }: { site: Site }) {
  const copy = site.aiSection;

  return (
    <section id="ai" className="border-b border-line bg-surface py-[var(--section-y)]" aria-labelledby="ai-title">
      <Container className="grid grid-cols-1 items-center gap-x-12 gap-y-12 md:grid-cols-12">
        <div className="flex flex-col gap-8 md:col-span-6 lg:col-span-5">
          <div className="flex flex-col gap-6">
            <Reveal as="h2" className="display-lg m-0">
              <span id="ai-title">
                <StopText>{copy.title}</StopText>
              </span>
            </Reveal>
            <Reveal as="p" delay={0.06} className="body-lg max-w-[44ch] text-ink-muted">
              {copy.lead}
            </Reveal>
          </div>

          <ul className="grid grid-cols-2 gap-x-4 sm:gap-x-6">
            {copy.benefits.map((b, i) => (
              <li
                key={b}
                data-reveal="rise"
                style={delay(i * 70)}
                className="flex flex-col items-start gap-2 border-t border-line py-3 sm:flex-row sm:items-center sm:gap-3 sm:py-4"
              >
                <span
                  className="at-cut grid size-9 flex-none place-items-center text-ink shadow-[inset_0_0_0_1px_var(--line-strong)]"
                  style={{ '--cut': '8px' } as CSSProperties}
                >
                  <Icon name={ICONS[i] ?? 'check'} size={18} />
                </span>
                <span className="text-[13.5px] font-semibold leading-snug tracking-[-0.01em] text-ink sm:text-[15px]">{b}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
            <BookCallButton placement="landing:ai" size="lg">
              {copy.cta}
            </BookCallButton>
            <Link
              href={copy.moreHref}
              className="group/more inline-flex items-center gap-2 text-[15px] font-medium text-ink underline decoration-line-strong underline-offset-[6px] hover:decoration-nuqta"
            >
              {copy.more}
              <Icon
                name="arrow-right"
                size={16}
                className="transition-transform duration-[160ms] ease-mark group-hover/more:translate-x-1"
              />
            </Link>
          </div>
        </div>

        <div className="md:col-span-6 lg:col-span-7">
          <Visual v={copy.visual} />
        </div>
      </Container>
    </section>
  );
}

export default AiSection;
