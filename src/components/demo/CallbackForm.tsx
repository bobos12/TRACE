'use client';

import { useState, type FormEvent } from 'react';
import { cn } from '@/lib/cn';

type Copy = {
  callbackTitle: string;
  callbackName: string;
  callbackPhone: string;
  callbackAgency: string;
  callbackSubmit: string;
  callbackDone: string;
  callbackError: string;
};

type Track = ((type: string, data?: Record<string, unknown>) => void) & {
  identify?: (who: { name?: string; email?: string; phone?: string }) => void;
  rid?: () => string | undefined;
  flush?: (leaving?: boolean) => void;
};

/**
 * "Call me back": name and mobile (agency optional), straight to the team's
 * inbox as a CALL BACK REQUEST, tagged with the campaign recipient.
 */
export function CallbackForm({ copy }: { copy: Copy }) {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [bad, setBad] = useState<'name' | 'phone' | null>(null);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get('name') ?? '').trim();
    const phone = String(form.get('phone') ?? '').trim();
    const agency = String(form.get('agency') ?? '').trim();
    const digits = phone.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
    if (name.length < 2) return setBad('name');
    if (digits.length !== 10) return setBad('phone');
    setBad(null);
    setState('sending');

    const track = (window as Window & { traceTrack?: Track }).traceTrack;
    track?.identify?.({ name, phone });
    track?.('callback_request', { agency: agency || undefined });
    track?.flush?.(true);

    try {
      const res = await fetch('/api/demo-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'callback',
          site: 'Demo video page',
          page: 'demo',
          sample: false,
          fields: { Name: name, Phone: phone, Agency: agency },
          from: document.referrer.slice(0, 300),
          rid: track?.rid?.(),
        }),
      });
      setState(res.ok ? 'done' : 'error');
    } catch {
      setState('error');
    }
  }

  const field =
    'h-12 w-full rounded-sm border border-line-strong bg-surface px-4 text-[16px] text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none';

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-3">
      <p className="heading-3 m-0">{copy.callbackTitle}</p>
      {state === 'done' ? (
        <p role="status" className="body text-ink">{copy.callbackDone}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input name="name" autoComplete="name" placeholder={copy.callbackName} aria-label={copy.callbackName} aria-invalid={bad === 'name'} className={cn(field, bad === 'name' && 'border-vermilion')} />
            <input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder={copy.callbackPhone} aria-label={copy.callbackPhone} aria-invalid={bad === 'phone'} className={cn(field, bad === 'phone' && 'border-vermilion')} />
          </div>
          <input name="agency" autoComplete="organization" placeholder={copy.callbackAgency} aria-label={copy.callbackAgency} className={field} />
          <button
            type="submit"
            disabled={state === 'sending'}
            className="h-12 rounded-sm bg-ink px-6 text-[15px] font-semibold text-surface transition-opacity disabled:opacity-60"
          >
            {copy.callbackSubmit}
          </button>
          {state === 'error' ? <p role="alert" className="body-sm text-vermilion">{copy.callbackError}</p> : null}
        </>
      )}
    </form>
  );
}

export default CallbackForm;
