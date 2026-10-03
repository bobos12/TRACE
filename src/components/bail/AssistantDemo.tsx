'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Icon } from '@/components/ui/Icon';
import type { BailBonds } from '@/lib/content';
import { cn } from '@/lib/cn';
import { Phone, StatusBar } from './Frames';

type Assistant = BailBonds['assistant'];
type Message = { from: 'bot' | 'user'; text: string; action?: string };

/**
 * The assistant, working: pick a question, it types, it answers — and the
 * first time it does, the lead lands on the on-call agent's phone beside it.
 *
 * Replies are scripted from content (it is a demo with a fictional agency and
 * says so). The log is a polite live region. Under reduced motion there is no
 * typing pause and nothing slides.
 */
export function AssistantDemo({ copy, initial }: { copy: Assistant; initial: string }) {
  const [messages, setMessages] = useState<Message[]>([{ from: 'bot', text: copy.greeting }]);
  const [asked, setAsked] = useState<string[]>([]);
  const [typing, setTyping] = useState(false);
  const [lead, setLead] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Keep the newest message in view — scroll the log, never the page.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTo({ top: log.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const ask = (q: Assistant['questions'][number]) => {
    if (typing) return;
    setAsked((a) => [...a, q.q]);
    setMessages((m) => [...m, { from: 'user', text: q.q }]);
    setTyping(true);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    timer.current = window.setTimeout(
      () => {
        setTyping(false);
        setMessages((m) => [...m, { from: 'bot', text: q.a, action: q.action }]);
        setLead(true);
      },
      reduce ? 0 : 1100,
    );
  };

  const reset = () => {
    window.clearTimeout(timer.current);
    setMessages([{ from: 'bot', text: copy.greeting }]);
    setAsked([]);
    setTyping(false);
    setLead(false);
  };

  const remaining = copy.questions.filter((q) => !asked.includes(q.q));

  return (
    <div className="grid grid-cols-1 items-end gap-8 sm:grid-cols-[1fr_minmax(0,220px)] md:gap-10">
      {/* The chat widget, as it sits on the agency's site. */}
      <div className="flex h-[580px] flex-col sm:h-[500px] overflow-hidden rounded-md border border-line-strong bg-surface-raised shadow-float">
        <div className="band-carbon flex items-center gap-3 px-4 py-3.5">
          <span className="at-cut grid size-10 place-items-center bg-ink text-[17px] font-semibold text-surface" style={{ '--cut': '8px' } as CSSProperties}>
            {initial}
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-[14px] font-semibold">{copy.name}</span>
            <span className="flex items-center gap-1.5 text-[12px] text-ink-muted">
              <span className="size-1.5 rounded-full bg-success" /> {copy.status}
            </span>
          </span>
          <span className="ms-auto hidden font-mono text-[10px] sm:inline tracking-[0.12em] text-ink-faint uppercase">{copy.demoNote}</span>
        </div>

        <div
          ref={logRef}
          role="log"
          aria-live="polite"
          aria-label={copy.name}
          className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-5"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn('bb-arrive flex max-w-[85%] flex-col gap-2', m.from === 'user' ? 'items-end self-end' : 'items-start')}
            >
              <span className="sr-only">{m.from === 'user' ? copy.you : copy.name}: </span>
              <p
                className={cn(
                  'px-3.5 py-2.5 text-[14px] leading-[1.5]',
                  m.from === 'user'
                    ? 'rounded-md rounded-ee-none bg-ink text-surface'
                    : 'rounded-md rounded-es-none bg-surface-sunken text-ink',
                )}
              >
                {m.text}
              </p>
              {m.action ? (
                <span className="at-cut inline-flex items-center gap-1.5 bg-nuqta px-3 py-1.5 text-[12px] font-semibold text-on-nuqta" style={{ '--cut': '7px' } as CSSProperties}>
                  <Icon name="phone" size={13} /> {m.action}
                </span>
              ) : null}
            </div>
          ))}
          {typing ? (
            <span className="bb-typing flex w-fit gap-1 rounded-md rounded-es-none bg-surface-sunken px-3.5 py-3.5" aria-hidden="true">
              <span className="size-1.5 rounded-full bg-ink-muted" />
              <span className="size-1.5 rounded-full bg-ink-muted" />
              <span className="size-1.5 rounded-full bg-ink-muted" />
            </span>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 border-t border-line px-4 py-4">
          <div className="flex flex-wrap gap-2">
            {remaining.length ? (
              remaining.map((q) => (
                <button
                  key={q.q}
                  type="button"
                  onClick={() => ask(q)}
                  disabled={typing}
                  className="rounded-full border border-line-strong bg-surface px-3.5 py-2 text-[13px] font-medium text-ink transition-colors duration-[160ms] ease-mark hover:border-ink disabled:opacity-50"
                >
                  {q.q}
                </button>
              ))
            ) : (
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3.5 py-2 text-[13px] font-medium hover:border-ink"
              >
                <Icon name="arrow-right" size={14} className="rotate-180" /> {copy.reset}
              </button>
            )}
          </div>
          <div className="flex h-10 items-center justify-between rounded-md border border-line bg-surface px-3.5 text-[13px] text-ink-faint" aria-hidden="true">
            {copy.inputPlaceholder}
            <Icon name="arrow-right" size={16} />
          </div>
        </div>
      </div>

      {/* The agent on call, asleep until the lead lands. */}
      <figure className="mx-auto flex w-full max-w-[180px] sm:max-w-[220px] flex-col gap-3">
        <Phone>
          <div className="flex h-full w-full flex-col bg-surface-sunken text-ink">
            <StatusBar time={copy.lockTime} />
            <div className="flex flex-col items-center pt-10 pb-8">
              <span className="text-[13px] text-ink-muted">{copy.lockDate}</span>
              <span className="text-[76px] font-semibold leading-none tracking-[-0.04em] tabular-nums">{copy.lockTime}</span>
            </div>
            <div className="px-3">
              {lead ? (
                <div className="bb-arrive flex flex-col gap-2 rounded-[14px] bg-surface-raised p-3.5 shadow-float">
                  <span className="flex items-center gap-2 text-[11px] text-ink-muted">
                    <span className="at-cut grid size-5 place-items-center bg-ink text-[10px] font-semibold text-surface" style={{ '--cut': '4px' } as CSSProperties}>
                      {initial}
                    </span>
                    {copy.notification.app}
                    <span className="ms-auto">{copy.notification.when}</span>
                  </span>
                  <span className="text-[14px] font-semibold leading-snug">{copy.notification.title}</span>
                  <span className="text-[12.5px] leading-[1.45] text-ink-muted">{copy.notification.body}</span>
                  <span className="mt-1 grid grid-cols-2 gap-2">
                    {copy.notification.actions.map((a, i) => (
                      <span
                        key={a}
                        className={cn(
                          'flex h-8 items-center justify-center rounded-md text-[12px] font-semibold',
                          i === 0 ? 'bg-nuqta text-on-nuqta' : 'bg-surface-sunken text-ink',
                        )}
                      >
                        {a}
                      </span>
                    ))}
                  </span>
                </div>
              ) : (
                <div className="flex h-[150px] items-center justify-center rounded-[14px] border border-dashed border-line text-[12px] text-ink-faint">
                  {copy.waiting}
                </div>
              )}
            </div>
          </div>
        </Phone>
        <figcaption className="text-center font-mono text-[11px] tracking-[0.1em] text-ink-faint uppercase">
          {copy.phoneTitle}
        </figcaption>
      </figure>
    </div>
  );
}

export default AssistantDemo;
