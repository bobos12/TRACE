import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { Nuqta } from '@/components/brand/Nuqta';
import type { BailBonds } from '@/lib/content';
import { cn } from '@/lib/cn';

type Strip = BailBonds['flagship']['strip'];

/** One page of the demo: its genuine capture, its name, a link straight to it. */
function Page({ page, n, demo, hidden }: { page: Strip['pages'][number]; n: number; demo: string; hidden?: boolean }) {
  return (
    <li className="w-[264px] flex-none sm:w-[320px]">
      <a
        href={`${demo}#${page.id}`}
        target="_blank"
        rel="noreferrer"
        tabIndex={hidden ? -1 : undefined}
        className="group/page flex flex-col gap-3"
      >
        <span className="relative block aspect-[16/10] overflow-hidden rounded-md bg-surface-sunken shadow-float ring-1 ring-line-strong">
          <Image
            src={`/images/ellison-reyes/pages/${page.id}.jpg`}
            alt=""
            fill
            sizes="320px"
            className="object-cover object-top transition-transform duration-[600ms] ease-mark group-hover/page:scale-[1.04]"
          />
        </span>
        <span className="flex items-baseline gap-2.5 text-[14px] font-medium text-ink-muted transition-colors duration-[160ms] group-hover/page:text-ink">
          <span className="font-mono text-[11px] text-ink-faint">{String(n).padStart(2, '0')}</span>
          {page.label}
          <Icon
            name="arrow-up-right"
            size={14}
            className="opacity-0 transition-opacity duration-[160ms] group-hover/page:opacity-100"
          />
        </span>
      </a>
    </li>
  );
}

/**
 * Every page of Ellison & Reyes, sliding past under the hero — Wanted, Pay,
 * the CRM — each one a link that opens that page of the live demo. The site's
 * one kind of loop (the marquee): it pauses on hover and focus, and under
 * reduced motion becomes a still row you can swipe.
 */
export function PageStrip({ strip, demo }: { strip: Strip; demo: string }) {
  return (
    <section className="band-carbon overflow-hidden border-b border-line bg-surface py-12 text-ink md:py-16" aria-labelledby="page-strip-title">
      <Container className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
        <h2 id="page-strip-title" className="heading-2 m-0 flex items-center gap-3">
          <Nuqta size={8} />
          {strip.title}
        </h2>
        <p className="flex items-baseline gap-5 body-sm text-ink-muted">
          <span>{strip.hint}</span>
          <a
            href="#live-agency"
            className="inline-flex items-center gap-1.5 font-medium text-ink underline decoration-line-strong underline-offset-[6px] hover:decoration-nuqta"
          >
            {strip.cta}
            <Icon name="arrow-right" size={14} />
          </a>
        </p>
      </Container>

      <div
        className="mt-8 overflow-x-auto [scrollbar-width:none] motion-safe:overflow-hidden [&::-webkit-scrollbar]:hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
        }}
      >
        <div className="at-marquee flex w-max hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:px-6">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1 || undefined}
              className={cn('flex flex-none gap-5 pe-5 sm:gap-6 sm:pe-6', copy === 1 && 'motion-reduce:hidden')}
            >
              {strip.pages.map((page, i) => (
                <Page key={page.id} page={page} n={i + 1} demo={demo} hidden={copy === 1} />
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PageStrip;
