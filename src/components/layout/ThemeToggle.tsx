'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { cn } from '@/lib/cn';
import { THEME_KEY } from './ThemeScript';

type Theme = 'light' | 'dark';

/** A nuqta half-filled — the mark, showing which ground it sits on. */
function ThemeGlyph({ dark }: { dark: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden="true" className="flex-none">
      <path
        d="M12 3l9 9-9 9-9-9z"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="miter"
      />
      <path d={dark ? 'M12 3l9 9-9 9z' : 'M12 3l-9 9 9 9z'} fill="currentColor" />
    </svg>
  );
}

/**
 * Moon on paper, sun on carbon — the navbar's icon button. Both are rendered
 * and the `dark:` variant picks one, so the right glyph shows from first
 * paint instead of flipping after hydration.
 */
function SunMoon() {
  const stroke = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'square' as const,
    strokeLinejoin: 'miter' as const,
  };
  return (
    <>
      <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden="true" className="dark:hidden">
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" {...stroke} />
      </svg>
      <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden="true" className="hidden dark:block">
        <circle cx="12" cy="12" r="4" {...stroke} />
        <path
          d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
          {...stroke}
        />
      </svg>
    </>
  );
}

/**
 * The theme lives on <html data-theme> (written before paint by ThemeScript),
 * so the DOM is the source of truth and this reads it rather than mirroring it
 * into React state.
 */
const themeStore = {
  subscribe(onChange: () => void) {
    const observer = new MutationObserver(onChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  },
  snapshot(): Theme {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  },
  server(): Theme {
    return 'light';
  },
};

/** Paper ⇄ Carbon. A labelled button in the footer and mobile menu; an icon button in the nav. */
export function ThemeToggle({
  labels,
  variant = 'label',
  className,
}: {
  labels: { light: string; dark: string; toggle: string };
  variant?: 'label' | 'icon';
  className?: string;
}) {
  const theme = useSyncExternalStore(themeStore.subscribe, themeStore.snapshot, themeStore.server);
  const next: Theme = theme === 'dark' ? 'light' : 'dark';

  const apply = useCallback(() => {
    document.documentElement.setAttribute('data-theme', next);
    document.documentElement.style.colorScheme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* private mode — the choice just won't persist */
    }
  }, [next]);

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={apply}
        aria-label={labels.toggle}
        title={labels.toggle}
        className={cn(
          'inline-grid size-10 place-items-center rounded-md border border-line-strong text-ink',
          'transition-colors duration-[160ms] ease-mark hover:border-ink hover:bg-surface-sunken',
          className,
        )}
      >
        <SunMoon />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={apply}
      // No aria-label: the visible word is the accessible name, and the rest of
      // the sentence follows it, so the two always match (WCAG 2.5.3).
      className={cn(
        'inline-flex items-center gap-2 rounded-md border border-line px-3 py-2 text-[13px] text-ink-muted',
        'transition-colors duration-[160ms] ease-mark hover:border-ink hover:text-ink',
        className,
      )}
    >
      <ThemeGlyph dark={theme === 'dark'} />
      <span>{theme === 'dark' ? labels.dark : labels.light}</span>
      <span className="sr-only"> — {labels.toggle}</span>
    </button>
  );
}

export default ThemeToggle;
