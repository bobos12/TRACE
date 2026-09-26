'use client';

import { useLocale } from 'next-intl';
import { usePathname as useRawPathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { cn } from '@/lib/cn';
import type { Site } from '@/lib/content';
import { Logo } from '@/components/brand/Logo';
import { Nuqta } from '@/components/brand/Nuqta';
import { Icon } from '@/components/ui/Icon';
import {
  CallIconButton,
  WhatsAppButton,
  WhatsAppIconButton,
  CallButton,
} from '@/components/contact/ContactButtons';
import { LangSwitch } from './LangSwitch';
import { ThemeToggle } from './ThemeToggle';

const STAMP_KEY = 'athr-logo-stamped';

/** Strip the locale prefix so link matching works in both locales. */
function unlocalise(path: string): string {
  const stripped = path.replace(/^\/(ar|en)(?=\/|$)/, '');
  return stripped === '' ? '/' : stripped;
}

function NavLogo({ locale }: { locale: Locale }) {
  const ref = useRef<SVGSVGElement>(null);

  // The three logo nuqtas stamp in 80ms apart — once per session.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let done = false;
    try {
      done = sessionStorage.getItem(STAMP_KEY) === '1';
    } catch {
      /* private mode — play it, it's harmless */
    }
    if (done) return;

    const dots = ref.current?.querySelectorAll<SVGPathElement>('[data-nuqta]');
    if (!dots?.length) return;

    dots.forEach((dot, i) => {
      dot.style.transformBox = 'fill-box';
      dot.style.transformOrigin = 'center';
      dot.animate(
        [
          { transform: 'scale(1.9)', opacity: 0 },
          { transform: 'scale(0.62)', opacity: 1, offset: 0.55 },
          { transform: 'scale(1)', opacity: 1 },
        ],
        { duration: 320, delay: 220 + i * 80, easing: 'cubic-bezier(0.2,0,0,1)', fill: 'backwards' },
      );
    });

    try {
      sessionStorage.setItem(STAMP_KEY, '1');
    } catch {
      /* ignore */
    }
  }, []);

  return locale === 'ar' ? (
    <Logo ref={ref} variant="arabic" height={28} />
  ) : (
    <Logo ref={ref} variant="wordmark" height={20} />
  );
}

export interface NavProps {
  site: Site;
}

export function Nav({ site }: NavProps) {
  const locale = useLocale() as Locale;
  const raw = useRawPathname();
  const here = unlocalise(raw);

  // Pages that open on a hero band mark it with [data-hero-band]; over one the
  // nav is transparent until you scroll past it.
  const [scrolled, setScrolled] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    const band = document.querySelector<HTMLElement>('[data-hero-band]');

    const onScroll = () => {
      const y = window.scrollY;
      const past = band ? band.offsetHeight - 80 : 24;
      setScrolled(y > past);
      // Hide on scroll down, show on scroll up — only after 400px.
      setHidden(y > 400 && y > lastY.current + 4);
      lastY.current = y;
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [raw]);

  // Lock the page while the mobile sheet is open.
  useEffect(() => {
    if (!menu) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [menu]);

  // Every sheet link calls close() on click, so no route-change effect is needed.
  const close = useCallback(() => setMenu(false), []);

  const solid = scrolled || menu;

  return (
    <>
      <header
        className={cn(
          // Above the open sheet, so the close button stays in reach.
          'fixed inset-x-0 top-0 h-16 transition-[transform,background-color,border-color]',
          menu ? 'z-50' : 'z-10',
          'duration-[320ms] ease-mark motion-reduce:transition-none',
          hidden && !menu ? '-translate-y-full' : 'translate-y-0',
          solid
            ? 'border-b border-line bg-surface'
            // Over the hero: transparent, in the page's own theme — the hero
            // follows light and dark, so the nav must too.
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <nav
          aria-label={site.nav.links[0]?.label}
          className="container-page flex h-16 items-center gap-8"
        >
          <Link href="/" className="flex-none" aria-label="ATHR">
            <NavLogo locale={locale} />
          </Link>

          <ul className="hidden flex-1 items-center gap-7 md:flex">
            {site.nav.links.map((link) => {
              const target = unlocalise(link.href.split('#')[0] ?? '/') || '/';
              const current = target !== '/' && here.startsWith(target);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href.replace(/^\/(ar|en)/, '') || '/'}
                    aria-current={current ? 'page' : undefined}
                    className={cn(
                      'inline-flex items-center gap-1.5 text-[14px] font-medium transition-colors duration-[160ms] ease-mark',
                      current ? 'text-ink' : 'text-ink-muted hover:text-ink',
                    )}
                  >
                    {current ? <Nuqta size={7} /> : null}
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="ms-auto flex items-center gap-2 md:ms-0 md:gap-3">
            <LangSwitch label={site.nav.lang} variant="button" />
            <ThemeToggle
              variant="icon"
              labels={{
                light: site.ui.themeLight,
                dark: site.ui.themeDark,
                toggle: site.ui.themeToggle,
              }}
            />
            <div className="hidden md:block">
              <CallIconButton placement="nav" label={site.nav.call} />
            </div>
            <div className="hidden md:block">
              <WhatsAppButton placement="nav" context={site.nav.links[0]?.label} size="md">
                {site.nav.cta}
              </WhatsAppButton>
            </div>

            <div className="md:hidden">
              <WhatsAppIconButton placement="nav" label={site.nav.cta} />
            </div>
            <button
              type="button"
              onClick={() => setMenu((v) => !v)}
              aria-expanded={menu}
              aria-controls="nav-sheet"
              aria-label={menu ? site.ui.closeMenu : site.ui.openMenu}
              className="inline-grid size-10 place-items-center rounded-md border border-line-strong text-ink transition-colors duration-[160ms] ease-mark hover:border-ink md:hidden"
            >
              <Icon name={menu ? 'close' : 'menu'} size={20} />
            </button>
          </div>
        </nav>
      </header>

      {menu ? (
        <div
          id="nav-sheet"
          // Above the mobile contact bar (z-40): the sheet carries its own buttons.
          className="band-carbon at-fade fixed inset-0 z-[45] flex flex-col overflow-y-auto pt-16 md:hidden"
        >
            <div className="container-page flex flex-1 flex-col justify-between gap-12 py-12">
              <ul className="flex flex-col gap-6">
                {site.nav.links.map((link, i) => {
                  const target = unlocalise(link.href.split('#')[0] ?? '/') || '/';
                  const current = target !== '/' && here.startsWith(target);
                  return (
                    <li
                      key={link.href}
                      className="at-rise"
                      style={{ '--d': `${40 + i * 50}ms` } as React.CSSProperties}
                    >
                      <Link
                        href={link.href.replace(/^\/(ar|en)/, '') || '/'}
                        onClick={close}
                        className="display-md flex items-center gap-3"
                      >
                        {current ? <Nuqta size={12} /> : null}
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="flex flex-col gap-4">
                <WhatsAppButton placement="nav-menu" size="lg" block>
                  {site.nav.cta}
                </WhatsAppButton>
                <CallButton placement="nav-menu" size="lg" block showNumber>
                  {site.nav.call}
                </CallButton>
              </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Nav;
