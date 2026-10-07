'use client';

import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import type { Site } from '@/lib/content';
import type { ChatCatalog } from '@/lib/chat/knowledge';
import { cn } from '@/lib/cn';
import { bookingHref, bookingLinkProps, mailHref, track, trackContact } from '@/lib/contact';
import { Link } from '@/i18n/navigation';
import { Icon } from '@/components/ui/Icon';
import { Nuqta, StopText } from '@/components/brand/Nuqta';
import { BreathingNuqtas } from '@/components/brand/BreathingNuqtas';
import { parseReply, toBlocks, type Inline } from './parse';
import { submitChatLead } from './actions';

type Copy = Site['chat'];
type ErrorCode = 'rate' | 'offline' | 'upstream' | 'invalid' | 'network';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  error?: ErrorCode;
}

const STORE_KEY = 'trace-chat-v1';
const uid = () => Math.random().toString(36).slice(2, 10);

function load(): { messages: Message[]; leadSent: boolean } {
  try {
    const raw = sessionStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw) as { messages: Message[]; leadSent: boolean };
  } catch {}
  return { messages: [], leadSent: false };
}

const isDesktop = () => window.matchMedia('(min-width: 640px)').matches;

/**
 * The assistant panel: a 400px card in the corner on desktop, a full-screen
 * sheet on mobile. Replies stream in; action tags in a reply become cards —
 * book a call, project covers, service links, a lead form.
 *
 * Stays mounted once opened, so a reply still arriving survives a close. The
 * conversation lives in sessionStorage — a reload keeps it, a new visit
 * starts clean.
 */
export default function ChatPanel({
  copy,
  catalog,
  open,
  onClose,
  prompt,
}: {
  copy: Copy;
  catalog: ChatCatalog;
  open: boolean;
  onClose: () => void;
  prompt: { text: string; id: number } | null;
}) {
  // Never server-rendered (it mounts on first open), so storage is safe to read here.
  const [saved] = useState(load);
  const [messages, setMessages] = useState<Message[]>(() => saved.messages.filter((m) => m.text || m.error));
  const [leadSent, setLeadSent] = useState(saved.leadSent);
  const [streaming, setStreaming] = useState(false);
  const [input, setInput] = useState('');

  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const pathname = usePathname();
  const titleId = useId();

  useEffect(() => {
    if (streaming) return;
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify({ messages, leadSent }));
    } catch {}
  }, [messages, leadSent, streaming]);

  // Keep the newest message in view — scroll the log, never the page.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTo({ top: log.scrollHeight });
  }, [messages, open]);

  // Opening: focus the composer on desktop; on a phone, the panel itself, so
  // the keyboard doesn't jump up before anyone asked for it.
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      if (isDesktop()) inputRef.current?.focus({ preventScroll: true });
      else panelRef.current?.focus({ preventScroll: true });
    }, 30);
    return () => window.clearTimeout(t);
  }, [open]);

  // Full-screen on mobile: lock the page behind it.
  useEffect(() => {
    if (!open || isDesktop()) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  // Esc closes from anywhere while open — focus may sit on <body> after a card re-renders.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' && !e.defaultPrevented) onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim().slice(0, 2000);
      if (!text || streaming) return;

      const user: Message = { id: uid(), role: 'user', text };
      const reply: Message = { id: uid(), role: 'assistant', text: '' };
      const history = [...messages.filter((m) => m.text && !m.error), user];

      setMessages((m) => [...m, user, reply]);
      setInput('');
      setStreaming(true);
      track('chat_message', { count: history.filter((m) => m.role === 'user').length });

      const patch = (fn: (m: Message) => Message) =>
        setMessages((all) => all.map((m) => (m.id === reply.id ? fn(m) : m)));

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            messages: history.map(({ role, text }) => ({ role, text })),
            page: pathname,
          }),
        });

        if (!res.ok || !res.body) {
          const body = (await res.json().catch(() => ({}))) as { error?: ErrorCode };
          patch((m) => ({ ...m, error: body.error ?? 'upstream' }));
          return;
        }

        const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          patch((m) => ({ ...m, text: m.text + value }));
        }
      } catch (error) {
        if ((error as Error).name !== 'AbortError') patch((m) => ({ ...m, error: 'network' }));
      } finally {
        // An empty answer is an error; a stopped one keeps what arrived.
        setMessages((all) =>
          all
            .map((m) => (m.id === reply.id && !m.text && !m.error ? { ...m, error: 'upstream' as const } : m))
            .filter((m) => !(m.id === reply.id && controller.signal.aborted && !m.text)),
        );
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [messages, pathname, streaming],
  );

  // A question handed in by openChat().
  const lastPrompt = useRef<number | null>(null);
  useEffect(() => {
    if (!prompt || lastPrompt.current === prompt.id) return;
    lastPrompt.current = prompt.id;
    void send(prompt.text);
  }, [prompt, send]);

  const stop = () => abortRef.current?.abort();

  const reset = () => {
    stop();
    setMessages([]);
    setLeadSent(false);
    inputRef.current?.focus();
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void send(input);
    }
  };

  // Grow the composer with its content, up to five lines.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 132)}px`;
  }, [input]);

  // On a phone the panel covers the page — close it when a link inside leaves.
  const onNavigate = () => {
    if (!isDesktop()) onClose();
  };

  const transcript = () =>
    messages
      .filter((m) => m.text)
      .map((m) => `${m.role === 'user' ? copy.you : copy.name}: ${parseReply(m.text).text}`)
      .join('\n\n');

  const lastAssistant = [...messages].reverse().find((m) => m.role === 'assistant');

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-labelledby={titleId}
      tabIndex={-1}
      hidden={!open}
      className={cn(
        'chat-in fixed inset-0 z-50 flex flex-col overflow-hidden bg-surface-raised outline-none',
        'sm:inset-auto sm:end-6 sm:bottom-6 sm:h-[min(42rem,calc(100dvh-3rem))] sm:w-[26rem]',
        'sm:rounded-md sm:border sm:border-line-strong sm:shadow-float',
      )}
    >
      {/* Header — carbon in both themes, like the hero and the contact band. */}
      <div
        className="band-carbon flex flex-none items-center gap-2.5 px-4 py-3"
        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        <span
          className="at-cut grid size-9 flex-none place-items-center bg-surface-raised"
          style={{ '--cut': '8px' } as CSSProperties}
        >
          <BreathingNuqtas glowId="chat-head-glow" className="w-5 text-ink" />
        </span>
        <span className="flex min-w-0 flex-col leading-tight">
          <span id={titleId} className="truncate text-[14px] font-semibold">
            {copy.name}
          </span>
          <span className="flex items-center gap-1.5 truncate text-[12px] text-ink-muted">
            <span className="size-1.5 flex-none rounded-full bg-success" aria-hidden="true" />
            {copy.status}
          </span>
        </span>

        <span className="ms-auto flex flex-none items-center gap-1">
          <a
            href={bookingHref()}
            onClick={() => {
              trackContact('booking', 'chat');
              onNavigate();
            }}
            className="at-cut me-1 inline-flex h-9 items-center gap-1.5 bg-nuqta px-2.5 text-[13px] font-semibold whitespace-nowrap text-on-nuqta"
            style={{ '--cut': '8px' } as CSSProperties}
            {...bookingLinkProps}
          >
            <Icon name="calendar" size={15} />
            {copy.book}
          </a>
          {messages.length ? (
            <button
              type="button"
              onClick={reset}
              aria-label={copy.reset}
              title={copy.reset}
              className="grid size-9 place-items-center text-ink-muted transition-colors hover:text-ink"
            >
              <Icon name="plus" size={18} />
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            aria-label={copy.close}
            className="grid size-9 place-items-center text-ink-muted transition-colors hover:text-ink"
          >
            <Icon name="close" size={18} />
          </button>
        </span>
      </div>

      {/* The conversation. */}
      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-busy={streaming}
        aria-label={copy.name}
        className="flex flex-1 flex-col gap-6 overflow-y-auto overscroll-contain px-5 py-6"
      >
        {messages.length === 0 ? (
          <Welcome copy={copy} onPick={(s) => void send(s)} />
        ) : (
          messages.map((m) => {
            const parts = m.role === 'assistant' ? parseReply(m.text, streaming && m === lastAssistant) : null;
            const isLast = m === lastAssistant;
            const live = streaming && isLast;

            if (m.role === 'user') {
              return (
                <div key={m.id} className="bb-arrive flex justify-end">
                  <span className="sr-only">{copy.you}: </span>
                  <p
                    className="at-cut max-w-[85%] bg-ink px-4 py-2.5 text-[14.5px] leading-[1.5] whitespace-pre-wrap text-surface"
                    style={{ '--cut': '10px' } as CSSProperties}
                  >
                    {m.text}
                  </p>
                </div>
              );
            }

            return (
              <div key={m.id} className="bb-arrive flex gap-3">
                <Nuqta size={9} tone={isLast ? 'mark' : 'ink'} className="mt-[7px] flex-none" />
                <div className="flex min-w-0 flex-1 flex-col gap-3">
                  <span className="sr-only">{copy.name}: </span>
                  {m.error ? (
                    <>
                      <p className="text-[14.5px] leading-[1.6] text-ink-muted">
                        {m.error === 'rate' ? copy.rateLimited : m.error === 'offline' ? copy.offline : copy.error}
                      </p>
                      <BookCard copy={copy} onNavigate={onNavigate} />
                    </>
                  ) : parts && parts.text ? (
                    <Rich text={parts.text} onNavigate={onNavigate} />
                  ) : live ? (
                    <span className="bb-typing flex h-6 items-center gap-1" aria-hidden="true">
                      <span className="size-1.5 rounded-full bg-ink-muted" />
                      <span className="size-1.5 rounded-full bg-ink-muted" />
                      <span className="size-1.5 rounded-full bg-ink-muted" />
                    </span>
                  ) : null}

                  {parts?.interrupted && !live ? (
                    <>
                      <p className="text-[13.5px] leading-[1.55] text-ink-muted">{copy.interrupted}</p>
                      {parts.book ? null : <BookCard copy={copy} onNavigate={onNavigate} />}
                    </>
                  ) : null}

                  {parts && !live ? (
                    <>
                      {parts.projects.length ? (
                        <ProjectCards slugs={parts.projects} catalog={catalog} copy={copy} onNavigate={onNavigate} />
                      ) : null}
                      {parts.services.length ? (
                        <ServiceLinks slugs={parts.services} catalog={catalog} copy={copy} onNavigate={onNavigate} />
                      ) : null}
                      {parts.book ? <BookCard copy={copy} onNavigate={onNavigate} /> : null}
                      {parts.lead && isLast && !leadSent ? (
                        <LeadForm copy={copy} transcript={transcript} onSent={() => setLeadSent(true)} />
                      ) : null}
                      {isLast && parts.suggestions.length && !(parts.lead && !leadSent) ? (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {parts.suggestions.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => void send(s)}
                              className="rounded-full border border-line-strong bg-surface px-3.5 py-1.5 text-[13px] font-medium text-ink transition-colors duration-[160ms] ease-mark hover:border-ink"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Composer. */}
      <form
        onSubmit={onSubmit}
        className="flex flex-none flex-col gap-2 border-t border-line bg-surface-raised px-4 pt-3"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <div className="flex items-end gap-2 rounded-md border border-line-strong bg-surface p-1.5 ps-3.5 transition-colors focus-within:border-ink focus-within:shadow-[var(--focus-ring)]">
          <label htmlFor={`${titleId}-input`} className="sr-only">
            {copy.inputLabel}
          </label>
          <textarea
            id={`${titleId}-input`}
            ref={inputRef}
            rows={1}
            value={input}
            maxLength={2000}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={copy.inputPlaceholder}
            className="max-h-[8.25rem] min-h-9 flex-1 resize-none bg-transparent py-2 text-[16px] leading-[1.4] text-ink outline-none placeholder:text-ink-faint focus-visible:shadow-none md:text-[14.5px]"
          />
          {streaming ? (
            <button
              type="button"
              onClick={stop}
              aria-label={copy.stop}
              className="grid size-9 flex-none place-items-center border border-line-strong text-ink"
            >
              <span className="size-3 bg-ink" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="submit"
              aria-label={copy.send}
              disabled={!input.trim()}
              className="at-cut grid size-9 flex-none place-items-center bg-ink text-surface transition-opacity disabled:opacity-35"
              style={{ '--cut': '8px' } as CSSProperties}
            >
              <Icon name="arrow-right" size={18} className="-rotate-90" />
            </button>
          )}
        </div>
        <p className="text-center text-[11.5px] leading-[1.4] text-ink-faint">
          {copy.disclaimer}
        </p>
      </form>
    </div>
  );
}

/* ── pieces ─────────────────────────────────────────────────────── */

function Welcome({ copy, onPick }: { copy: Copy; onPick: (s: string) => void }) {
  return (
    <div className="flex flex-1 flex-col justify-end gap-6">
      <div className="flex flex-col gap-3">
        <BreathingNuqtas glowId="chat-welcome-glow" className="mb-2 w-14 text-ink" />
        <h2 className="m-0 text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.02em] text-ink">
          <StopText>{copy.welcomeTitle}</StopText>
        </h2>
        <p className="text-[14.5px] leading-[1.55] text-ink-muted">{copy.welcomeText}</p>
      </div>
      <ul className="flex flex-col border-t border-line">
        {copy.starters.map((s, i) => (
          <li key={s} className="bb-arrive border-b border-line" style={{ '--d': `${80 + i * 40}ms` } as CSSProperties}>
            <button
              type="button"
              onClick={() => onPick(s)}
              className="group flex w-full items-center gap-3 py-3 text-start text-[14.5px] text-ink"
            >
              <Nuqta size={7} tone="ink" className="flex-none" />
              <span className="flex-1">{s}</span>
              <Icon
                name="arrow-right"
                size={16}
                className="text-ink-faint transition-transform duration-[160ms] ease-mark group-hover:translate-x-0.5 group-hover:text-ink"
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InlineText({ parts, onNavigate }: { parts: Inline[]; onNavigate: () => void }) {
  return parts.map((p, i) => {
    if (p.type === 'strong') return <strong key={i} className="font-semibold text-ink">{p.value}</strong>;
    if (p.type === 'link') {
      const cls = 'font-medium text-ink underline decoration-line-strong underline-offset-[3px] hover:decoration-ink';
      if (p.external) {
        return (
          <a key={i} href={p.href} target="_blank" rel="noopener" className={cls}>
            {p.value}
          </a>
        );
      }
      if (p.href.startsWith('mailto:')) {
        return (
          <a key={i} href={p.href} onClick={() => trackContact('email', 'chat')} className={cls}>
            {p.value}
          </a>
        );
      }
      return (
        <Link key={i} href={p.href} onClick={onNavigate} className={cls}>
          {p.value}
        </Link>
      );
    }
    return <Fragment key={i}>{p.value}</Fragment>;
  });
}

function Rich({ text, onNavigate }: { text: string; onNavigate: () => void }) {
  return (
    <div className="flex flex-col gap-3 text-[14.5px] leading-[1.6] text-ink">
      {toBlocks(text).map((b, i) => {
        if (b.type === 'p') {
          return (
            <p key={i}>
              {b.lines.map((line, j) => (
                <Fragment key={j}>
                  {j ? <br /> : null}
                  <InlineText parts={line} onNavigate={onNavigate} />
                </Fragment>
              ))}
            </p>
          );
        }
        const List = b.type;
        return (
          <List key={i} className="flex flex-col gap-1.5">
            {b.items.map((item, j) => (
              <li key={j} className="flex gap-2.5">
                <span className="mt-[0.6em] size-1 flex-none bg-ink-muted" aria-hidden="true" />
                <span>
                  <InlineText parts={item} onNavigate={onNavigate} />
                </span>
              </li>
            ))}
          </List>
        );
      })}
    </div>
  );
}

function BookCard({ copy, onNavigate }: { copy: Copy; onNavigate: () => void }) {
  return (
    <div className="flex flex-col gap-3 border border-line bg-surface p-4">
      <div className="flex flex-col gap-1">
        <span className="text-[15px] font-semibold text-ink">{copy.bookCardTitle}</span>
        <span className="text-[13px] leading-[1.5] text-ink-muted">{copy.bookCardText}</span>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <a
          href={bookingHref()}
          onClick={() => {
            trackContact('booking', 'chat');
            onNavigate();
          }}
          className="at-cut inline-flex h-10 items-center gap-2 bg-nuqta px-4 text-[14px] font-semibold text-on-nuqta transition-transform duration-[160ms] ease-mark hover:-translate-y-0.5"
          style={{ '--cut': '10px' } as CSSProperties}
          {...bookingLinkProps}
        >
          <Icon name="calendar" size={17} />
          {copy.bookCardCta}
        </a>
        <a
          href={mailHref()}
          onClick={() => trackContact('email', 'chat')}
          className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-ink underline decoration-line-strong underline-offset-[3px] hover:decoration-ink"
        >
          <Icon name="mail" size={15} />
          {copy.emailCta}
        </a>
      </div>
    </div>
  );
}

function ProjectCards({
  slugs,
  catalog,
  copy,
  onNavigate,
}: {
  slugs: string[];
  catalog: ChatCatalog;
  copy: Copy;
  onNavigate: () => void;
}) {
  const projects = slugs
    .map((s) => catalog.projects.find((p) => p.slug === s))
    .filter((p): p is ChatCatalog['projects'][number] => Boolean(p));
  if (!projects.length) return null;

  return (
    <ul className="flex flex-col gap-2">
      {projects.map((p) => (
        <li key={p.slug}>
          <Link
            href={`/work/${p.slug}`}
            onClick={onNavigate}
            className="group flex items-center gap-3 border border-line bg-surface p-2 pe-3 transition-colors duration-[160ms] ease-mark hover:border-line-strong"
          >
            <span className="relative aspect-[16/10] w-24 flex-none overflow-hidden bg-surface-sunken">
              <Image src={p.cover} alt="" fill sizes="96px" className="object-cover" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="truncate font-mono text-[10.5px] tracking-[0.1em] text-ink-muted uppercase">
                {p.client}
                {p.kind === 'concept' ? ` ◆ ${copy.concept}` : ''}
              </span>
              <span className="line-clamp-2 text-[13.5px] leading-[1.35] font-medium text-ink">{p.title}</span>
            </span>
            <Icon
              name="arrow-right"
              size={16}
              label={copy.viewProject}
              className="text-ink-faint transition-transform duration-[160ms] ease-mark group-hover:translate-x-0.5 group-hover:text-ink"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ServiceLinks({
  slugs,
  catalog,
  copy,
  onNavigate,
}: {
  slugs: string[];
  catalog: ChatCatalog;
  copy: Copy;
  onNavigate: () => void;
}) {
  const services = slugs
    .map((s) => catalog.services.find((x) => x.slug === s))
    .filter((s): s is ChatCatalog['services'][number] => Boolean(s));
  if (!services.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {services.map((s) => (
        <Link
          key={s.slug}
          href={`/services/${s.slug}`}
          onClick={onNavigate}
          className="group inline-flex items-center gap-2 border border-line bg-surface px-3 py-2 text-[13px] text-ink transition-colors duration-[160ms] ease-mark hover:border-line-strong"
        >
          <span className="font-mono text-[10.5px] tracking-[0.1em] text-ink-muted uppercase">{copy.viewService}</span>
          <span className="font-medium">{s.title}</span>
          <Icon name="arrow-right" size={14} className="text-ink-faint group-hover:text-ink" />
        </Link>
      ))}
    </div>
  );
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function LeadForm({
  copy,
  transcript,
  onSent,
}: {
  copy: Copy;
  transcript: () => string;
  onSent: () => void;
}) {
  const id = useId();
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'fallback'>('idle');
  const [sentTo, setSentTo] = useState('');
  const doneRef = useRef<HTMLParagraphElement>(null);
  const done = state === 'success' || state === 'fallback';

  // The form is replaced by its confirmation — take focus there, not to <body>.
  useEffect(() => {
    if (done) doneRef.current?.focus();
  }, [done]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const company = String(data.get('company') ?? '').trim();

    const next = {
      name: name.length < 2 ? copy.leadErrorName : undefined,
      email: EMAIL.test(email) ? undefined : copy.leadErrorEmail,
    };
    setErrors(next);
    if (next.name || next.email) return;

    setState('sending');
    const body = `${copy.leadTranscript}\n\n${transcript()}`;
    const result = await submitChatLead({
      name,
      email,
      company,
      transcript: body,
      website: String(data.get('website') ?? ''),
    }).catch(() => 'fallback' as const);

    track('chat_lead', { status: result });
    if (result === 'success') {
      setSentTo(email);
      setState('success');
      onSent();
    } else {
      setState('fallback');
      trackContact('email', 'chat');
      window.location.href = mailHref(copy.leadSubject.replace('{name}', name), body.slice(0, 1800));
    }
  };

  if (done) {
    return (
      <p
        ref={doneRef}
        role="status"
        tabIndex={-1}
        className="flex items-start gap-2.5 border border-line bg-surface p-4 text-[13.5px] leading-[1.5] text-ink outline-none"
      >
        <Icon name="success" size={18} className="flex-none text-success" />
        {state === 'success' ? copy.leadSuccess.replace('{email}', sentTo) : copy.leadFallback}
      </p>
    );
  }

  const field =
    'h-10 w-full border border-line-strong bg-surface-raised px-3 text-[16px] text-ink outline-none transition-colors focus:border-ink md:text-[14px]';

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3 border border-line bg-surface p-4">
      <div className="flex flex-col gap-1">
        <span className="text-[15px] font-semibold text-ink">{copy.leadTitle}</span>
        <span className="text-[13px] leading-[1.5] text-ink-muted">{copy.leadText}</span>
      </div>

      {(['name', 'email', 'company'] as const).map((f) => {
        const label = f === 'name' ? copy.leadName : f === 'email' ? copy.leadEmail : copy.leadCompany;
        const error = f === 'company' ? undefined : errors[f];
        return (
          <div key={f} className="flex flex-col gap-1">
            <label htmlFor={`${id}-${f}`} className="text-[12.5px] font-medium text-ink-muted">
              {label}
            </label>
            <input
              id={`${id}-${f}`}
              name={f}
              type={f === 'email' ? 'email' : 'text'}
              autoComplete={f === 'email' ? 'email' : f === 'name' ? 'name' : 'organization'}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `${id}-${f}-error` : undefined}
              className={cn(field, error && 'border-danger')}
            />
            {error ? (
              <span id={`${id}-${f}-error`} className="text-[12.5px] text-danger">
                {error}
              </span>
            ) : null}
          </div>
        );
      })}

      {/* Honeypot — bots fill every field they find. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      <button
        type="submit"
        disabled={state === 'sending'}
        className="at-cut mt-1 inline-flex h-10 items-center justify-center gap-2 bg-ink px-4 text-[14px] font-semibold text-surface disabled:opacity-60"
        style={{ '--cut': '10px' } as CSSProperties}
      >
        {state === 'sending' ? copy.leadSending : copy.leadSubmit}
        {state === 'sending' ? null : <Icon name="arrow-right" size={16} />}
      </button>
    </form>
  );
}
