'use client';

import { lazy, Suspense, useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import type { Site } from '@/lib/content';
import type { ChatCatalog } from '@/lib/chat/knowledge';
import { cn } from '@/lib/cn';
import { track } from '@/lib/contact';
import { Icon } from '@/components/ui/Icon';
import { useConversionVisibility } from '@/components/contact/PersistentContact';
import { CHAT_EVENT, type ChatOpenDetail } from './events';

/** A speech bubble with the cut, an AI spark inside and a vermilion spark in the cut corner. */
function ChatGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        d="M3.5 4.5h13l4 4v10h-11l-5 3.5v-3.5h-1z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="miter"
      />
      <path d="M12 7.5Q12.6 10.9 16 11.5Q12.6 12.1 12 15.5Q11.4 12.1 8 11.5Q11.4 10.9 12 7.5Z" fill="currentColor" />
      <path d="M20 1.5Q20.35 3.65 22.5 4Q20.35 4.35 20 6.5Q19.65 4.35 17.5 4Q19.65 3.65 20 1.5Z" fill="var(--vermilion)" />
    </svg>
  );
}

/* The panel is the heavy part — fetched on first intent, never on page load. */
const loadPanel = () => import('./ChatPanel');
const ChatPanel = lazy(loadPanel);

const TEASER_KEY = 'trace-chat-teaser';
const TEASER_DELAY = 9000;

/**
 * The website assistant's entry point.
 *
 * Desktop: a carbon "Ask TRACE" button in the corner, under the floating
 * Book-a-call button. Mobile: a carbon square that rides above the Book + Email
 * bar. One quiet teaser, once per session, on desktop only.
 *
 * Anything on the page can open it — and ask a first question — with
 * `openChat()` from ./events.
 */
export function ChatAssistant({ copy, catalog }: { copy: Site['chat']; catalog: ChatCatalog }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [prompt, setPrompt] = useState<{ text: string; id: number } | null>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const barVisible = useConversionVisibility(0.4);

  const show = useCallback((placement: string) => {
    setMounted(true);
    setOpen(true);
    setTeaser(false);
    try {
      sessionStorage.setItem(TEASER_KEY, '1');
    } catch {}
    track('chat_open', { placement });
  }, []);

  const hide = useCallback(() => {
    setOpen(false);
    // After the render that makes the launcher visible again (it hides on mobile).
    requestAnimationFrame(() => launcher.current?.focus({ preventScroll: true }));
  }, []);

  // openChat() from anywhere on the page.
  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<ChatOpenDetail>).detail;
      if (detail?.prompt) setPrompt({ text: detail.prompt, id: Date.now() });
      show(detail?.placement ?? 'event');
    };
    window.addEventListener(CHAT_EVENT, onOpen);
    return () => window.removeEventListener(CHAT_EVENT, onOpen);
  }, [show]);

  // The teaser: once per session, desktop only, never after the panel opened.
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(TEASER_KEY) === '1';
    } catch {}
    if (seen || !window.matchMedia('(min-width: 768px)').matches) return;
    const t = window.setTimeout(() => setTeaser(true), TEASER_DELAY);
    return () => window.clearTimeout(t);
  }, []);

  const dismissTeaser = () => {
    setTeaser(false);
    try {
      sessionStorage.setItem(TEASER_KEY, '1');
    } catch {}
  };

  return (
    <>
      <div
        className={cn(
          'fixed end-4 z-40 transition-transform duration-[320ms] ease-mark motion-reduce:transition-none md:end-6 md:bottom-6',
          'bottom-[calc(1rem+env(safe-area-inset-bottom))]',
          barVisible && 'max-md:-translate-y-16',
          open && 'max-md:invisible',
        )}
      >
        {teaser && !open ? (
          <div className="bb-arrive absolute end-0 bottom-[calc(100%+5.5rem)] hidden w-[17rem] md:block">
            <div className="relative flex items-start gap-3 rounded-md border border-line-strong bg-surface-raised p-4 shadow-float">
              <button
                type="button"
                onClick={() => show('teaser')}
                onPointerEnter={loadPanel}
                className="text-start text-[14px] leading-[1.45] text-ink"
              >
                {copy.teaser}
              </button>
              <button
                type="button"
                onClick={dismissTeaser}
                aria-label={copy.teaserDismiss}
                className="-me-1 -mt-1 grid size-7 flex-none place-items-center text-ink-muted hover:text-ink"
              >
                <Icon name="close" size={16} />
              </button>
            </div>
          </div>
        ) : null}

        <button
          ref={launcher}
          type="button"
          onClick={() => (open ? hide() : show('launcher'))}
          onPointerEnter={loadPanel}
          onFocus={loadPanel}
          aria-label={copy.launcherLabel}
          aria-expanded={open}
          aria-haspopup="dialog"
          className={cn(
            'at-cut flex items-center justify-center gap-2.5 bg-ink text-surface shadow-[var(--shadow-float)]',
            'transition-transform duration-[160ms] ease-mark hover:-translate-y-0.5 motion-reduce:transition-none',
            'size-[3.25rem] md:h-14 md:w-auto md:ps-4 md:pe-5',
          )}
          style={{ '--cut': '12px' } as CSSProperties}
        >
          <ChatGlyph className="size-7 md:size-6" />
          <span className="hidden text-[15px] font-medium md:inline">{copy.launcher}</span>
        </button>
      </div>

      {mounted ? (
        <Suspense fallback={null}>
          <ChatPanel copy={copy} catalog={catalog} open={open} onClose={hide} prompt={prompt} />
        </Suspense>
      ) : null}
    </>
  );
}

export default ChatAssistant;
