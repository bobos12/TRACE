'use client';

import { usePathname as useRawPathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';
import type { Site } from '@/lib/content';
import { Logo } from '@/components/brand/Logo';
import { Nuqta } from '@/components/brand/Nuqta';
import { Icon } from '@/components/ui/Icon';
import {
  BookCallButton,
  BookIconButton,
  EmailButton,
  EmailIconButton,
} from '@/components/contact/ContactButtons';
import { ThemeToggle } from './ThemeToggle';

const STAMP_KEY = 'trace-logo-stamped';

/** Strip a stray locale prefix so link matching holds either way. */
function unlocalise(path: string): string {
  const stripped = path.replace(/^\/en(?=\/|$)/, '');
  return stripped === '' ? '/' : stripped;
}

function NavLogo() {
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

  return <Logo ref={ref} variant="wordmark" height={20} />;
}

type NavLink = Site['nav']['links'][number];

/**
 * A nav item with a dropdown. Opens on hover and on click, closes on Escape,
 * on a click outside and when focus leaves it. The panel carries the cut.
 */
function NavMenu({ link, current, onNavigate }: { link: NavLink; current: boolean; onNavigate?: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const pointer = useRef('');
  const id = `nav-menu-${link.label.toLowerCase().replace(/\W+/g, '-')}`;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <li
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(e) => {
        if (!ref.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        // A mouse already opened it on hover, so its click must not close it;
        // touch and keyboard toggle.
        onPointerDown={(e) => {
          pointer.current = e.pointerType;
        }}
        onClick={() => {
          if (pointer.current === 'mouse') setOpen(true);
          else setOpen((v) => !v);
          pointer.current = '';
        }}
        className={cn(
          'inline-flex items-center gap-1.5 py-2 text-[14px] font-medium transition-colors duration-[160ms] ease-mark',
          current || open ? 'text-ink' : 'text-ink-muted hover:text-ink',
        )}
      >
        {current ? <Nuqta size={7} /> : null}
        {link.label}
        <Icon
          name="chevron-down"
          size={14}
          className={cn('transition-transform duration-[160ms] ease-mark', open && 'rotate-180')}
        />
      </button>

      {/* pt bridges the gap so the pointer can travel into the panel. */}
      <div id={id} hidden={!open} className="absolute start-[-16px] top-full pt-3">
        <ul
          className="at-cut at-fade flex w-[300px] flex-col border border-line bg-surface-raised p-2 shadow-float"
          style={{ '--cut': '14px' } as React.CSSProperties}
        >
          {link.children?.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
                className="group flex items-start gap-3 rounded-sm p-3 transition-colors duration-[160ms] ease-mark hover:bg-surface-sunken"
              >
                <Nuqta size={8} className="mt-1.5" />
                <span className="flex flex-col gap-0.5">
                  <span className="text-[14px] font-medium text-ink">{child.label}</span>
                  <span className="body-sm text-ink-muted">{child.text}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export interface NavProps {
  site: Site;
}

export function Nav({ site }: NavProps) {
  const raw = useRawPathname();
  const here = unlocalise(raw);

  // Transparent only while the page sits at the very top; the moment it moves,
  // the nav turns solid so it never sits over content.
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
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
          'fixed inset-x-0 top-0 border-b transition-[transform,background-color,border-color] duration-[320ms] ease-mark motion-reduce:transition-none',
          menu ? 'z-50' : 'z-10',
          hidden && !menu ? '-translate-y-full' : 'translate-y-0',
          solid ? 'border-line bg-surface' : 'border-transparent bg-transparent',
        )}
      >
        <nav
          aria-label={site.nav.links[0]?.label}
          className={cn(
            'container-page flex items-center gap-8 transition-[height] duration-[320ms] ease-mark',
            solid ? 'h-14' : 'h-16',
          )}
        >
          <Link href="/" className="flex-none" aria-label="TRACE">
            <NavLogo />
          </Link>

          <ul className="hidden flex-1 items-center gap-8 md:flex">
            {site.nav.links.map((link) => {
              const target = unlocalise(link.href.split('#')[0] ?? '/') || '/';
              const current = target !== '/' && here.startsWith(target);
              if (link.children?.length) {
                return <NavMenu key={link.label} link={link} current={current} />;
              }
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={current ? 'page' : undefined}
                    className={cn(
                      'group relative inline-flex items-center gap-1.5 py-2 text-[14px] font-medium transition-colors duration-[160ms] ease-mark',
                      current ? 'text-ink' : 'text-ink-muted hover:text-ink',
                    )}
                  >
                    {current ? <Nuqta size={7} /> : null}
                    {link.label}
                    {/* The trace, drawn under the label on hover. */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-1 h-px origin-left scale-x-0 bg-ink transition-transform duration-[320ms] ease-trace group-hover:scale-x-100 rtl:origin-right"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="ms-auto flex items-center gap-2 md:ms-0 md:gap-3">
            <ThemeToggle
              variant="icon"
              labels={{
                light: site.ui.themeLight,
                dark: site.ui.themeDark,
                toggle: site.ui.themeToggle,
              }}
            />
            <div className="hidden md:block">
              <EmailIconButton placement="nav" label={site.nav.email} />
            </div>
            <div className="hidden md:block">
              <BookCallButton placement="nav" size="md">
                {site.nav.cta}
              </BookCallButton>
            </div>

            <div className="md:hidden">
              <BookIconButton placement="nav" label={site.nav.cta} />
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
                  if (link.children?.length) {
                    return (
                      <li
                        key={link.label}
                        className="at-rise flex flex-col gap-3"
                        style={{ '--d': `${40 + i * 50}ms` } as React.CSSProperties}
                      >
                        <span className="eyebrow text-ink-faint">{link.label}</span>
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={close}
                            className="heading-1 flex items-center gap-3"
                          >
                            <Nuqta size={current && here.startsWith(child.href) ? 10 : 8} tone={current && here.startsWith(child.href) ? 'mark' : 'ink'} />
                            {child.label}
                          </Link>
                        ))}
                      </li>
                    );
                  }
                  return (
                    <li
                      key={link.href}
                      className="at-rise"
                      style={{ '--d': `${40 + i * 50}ms` } as React.CSSProperties}
                    >
                      <Link
                        href={link.href}
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
                <BookCallButton placement="nav-menu" size="lg" block>
                  {site.nav.cta}
                </BookCallButton>
                <EmailButton placement="nav-menu" size="lg" block>
                  {site.nav.email}
                </EmailButton>
              </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Nav;
