'use client';

import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
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

const CYCLE_KEY = 'trace-chat-cycle';
const CYCLE_DELAY = 2500;
const CYCLE_STEP = 2800;
const PING_KEY = 'trace-chat-ping';
const PING_DELAY = 3500;

/**
 * The website assistant's entry point, and the one corner row of floating
 * controls.
 *
 * Desktop: [Book a call] [TRACE AI launcher]. The launcher reads as a chat
 * field — an "AI · online" line, an example question, a send key — and runs
 * through `launcherPrompts` once per session before resting on the last one.
 * Mobile: an "Ask AI" chip that rides above the Book + Email bar. Once per
 * session a vermilion ring pulses out of it.
 *
 * Anything on the page can open it — and ask a first question — with
 * `openChat()` from ./events.
 */
export function ChatAssistant({
  copy,
  catalog,
  book,
}: {
  copy: Site['chat'];
  catalog: ChatCatalog;
  book?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [ping, setPing] = useState(false);
  const prompts = copy.launcherPrompts;
  const [cycle, setCycle] = useState(prompts.length - 1);
  const [prompt, setPrompt] = useState<{ text: string; id: number } | null>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const barVisible = useConversionVisibility(0.4);

  const show = useCallback((placement: string) => {
    setMounted(true);
    setOpen(true);
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

  // The example questions: once per session, desktop only, never under reduced motion.
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(CYCLE_KEY) === '1';
    } catch {}
    if (
      seen ||
      prompts.length < 2 ||
      !window.matchMedia('(min-width: 768px)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    let i = 0;
    let t = window.setTimeout(function step() {
      if (i === 0) {
        try {
          sessionStorage.setItem(CYCLE_KEY, '1');
        } catch {}
      }
      setCycle(i);
      if (++i < prompts.length) t = window.setTimeout(step, CYCLE_STEP);
    }, CYCLE_DELAY);
    return () => window.clearTimeout(t);
  }, [prompts.length]);

  // The ping: once per session, a few seconds in, unless the panel is open.
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(PING_KEY) === '1';
    } catch {}
    if (seen) return;
    const t = window.setTimeout(() => {
      setPing(true);
      try {
        sessionStorage.setItem(PING_KEY, '1');
      } catch {}
    }, PING_DELAY);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <>
      <div
        className={cn(
          'fixed end-4 z-40 flex items-end gap-2 transition-transform duration-[320ms] ease-mark motion-reduce:transition-none md:end-6 md:bottom-6',
          'bottom-[calc(1rem+env(safe-area-inset-bottom))]',
          barVisible && 'max-md:-translate-y-16',
          open && 'max-md:invisible',
        )}
      >
        {book}

        <div className="relative">
          {ping && !open ? (
            <span
              aria-hidden="true"
              onAnimationEnd={() => setPing(false)}
              className="chat-ping at-cut pointer-events-none absolute inset-0 bg-vermilion"
              style={{ '--cut': '12px' } as CSSProperties}
            />
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
              'at-cut group relative flex items-center bg-ink text-surface shadow-[var(--shadow-float)]',
              'transition-transform duration-[160ms] ease-mark hover:-translate-y-0.5 motion-reduce:transition-none',
              'h-12 gap-2 ps-3 pe-4 md:h-16 md:w-[21rem] md:gap-3 md:ps-3 md:pe-3',
            )}
            style={{ '--cut': '12px' } as CSSProperties}
          >
            <span className="grid flex-none place-items-center md:size-10 md:bg-surface/10">
              <ChatGlyph className="size-6" />
            </span>

            {/* Phones: a plain "Ask AI" chip. */}
            <span className="text-[15px] font-medium md:hidden">{copy.launcher}</span>

            {/* Desktop: a chat field. */}
            <span className="hidden min-w-0 flex-1 flex-col items-start md:flex">
              <span className="flex items-center gap-1.5 font-mono text-[11px] leading-4 text-surface/70">
                <span aria-hidden="true" className="at-breathe size-1.5 rotate-45 bg-vermilion" />
                {copy.launcherStatus}
              </span>
              <span
                key={cycle}
                className="bb-arrive block w-full truncate text-start text-[15px] font-medium leading-6"
              >
                {prompts[cycle]}
              </span>
            </span>
            <span
              aria-hidden="true"
              className="at-cut hidden size-10 flex-none place-items-center bg-nuqta text-on-nuqta transition-transform duration-[160ms] ease-mark group-hover:translate-x-0.5 motion-reduce:transition-none md:grid"
              style={{ '--cut': '8px' } as CSSProperties}
            >
              <Icon name="arrow-right" size={18} />
            </span>
          </button>
        </div>
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
