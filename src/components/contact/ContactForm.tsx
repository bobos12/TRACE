'use client';

import { useLocale } from 'next-intl';
import { useActionState, useEffect, useRef, useState } from 'react';
import { Field, Select, TextArea } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { Nuqta } from '@/components/brand/Nuqta';
import { Icon } from '@/components/ui/Icon';
import type { Site } from '@/lib/content';
import type { Locale } from '@/i18n/routing';
import { mailHref, track, trackContact } from '@/lib/contact';
import { submitContact, type ContactState } from '@/app/[locale]/(site)/contact/actions';

const initial: ContactState = { status: 'idle' };

/**
 * The contact form.
 *
 * Booking a call is the primary channel — this is for people who prefer to
 * write. If no backend is configured (or delivery fails) the submit button
 * becomes "Send by email" and opens an email with everything the visitor typed
 * already in it. The form never silently fails.
 */
export function ContactForm({
  site,
  serviceTitles,
  hasBackend,
}: {
  site: Site;
  serviceTitles: string[];
  hasBackend: boolean;
}) {
  const locale = useLocale() as Locale;
  const [state, action, pending] = useActionState(submitContact, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});

  const copy = site.contactPage.form;
  const ui = site.ui;

  useEffect(() => {
    if (state.status === 'success') {
      track('form_submit', { result: 'success' });
      formRef.current?.reset();
    } else if (state.status === 'error') {
      track('form_submit', { result: 'failure' });
    }
  }, [state.status]);

  /**
   * Everything typed so far, folded into a prefilled email.
   * Reads the mirrored `draft` state rather than the form element, so the href
   * is a pure function of state and can be computed during render.
   */
  const emailFallback = () => {
    const values = draft;
    const lines = [
      values.name && `${copy.name}: ${values.name}`,
      values.company && `${copy.company}: ${values.company}`,
      values.email && `${copy.email}: ${values.email}`,
      values.phone && `${copy.phone}: ${values.phone}`,
      values.type && `${copy.type} ${values.type}`,
      values.message && `\n${values.message}`,
    ].filter(Boolean);
    return mailHref(`${site.ui.contact} — ${values.name || site.meta.title}`, lines.join('\n'));
  };

  if (state.status === 'success') {
    return (
      <div className="flex flex-col items-start gap-5 rounded-md border border-line bg-surface-raised p-8">
        <span className="at-stamp block size-5 bg-vermilion" />
        <p className="heading-2" role="status">
          {copy.success}
        </p>
      </div>
    );
  }

  const failed = state.status === 'error';
  const errors = state.errors ?? {};

  return (
    <form
      ref={formRef}
      action={action}
      onChange={(e) => {
        // Keep a copy of what's typed so the email fallback can carry it
        // even if the form element is gone by then.
        const target = e.target as unknown as { name?: string; value?: string };
        if (target.name) setDraft((d) => ({ ...d, [target.name!]: target.value ?? '' }));
      }}
      className="flex flex-col gap-6"
      noValidate
    >
      <input type="hidden" name="locale" value={locale} />

      {/* Honeypot. Hidden from people and from screen readers; bots fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field
          label={copy.name}
          name="name"
          autoComplete="name"
          required
          defaultValue={state.values?.name}
          error={errors.name}
          placeholder="Jordan Miller"
        />
        <Field
          label={copy.company}
          name="company"
          autoComplete="organization"
          optional={ui.optional}
          defaultValue={state.values?.company}
          error={errors.company}
        />
        <Field
          label={copy.email}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          defaultValue={state.values?.email}
          error={errors.email}
          placeholder="jordan@company.com"
        />
        <Field
          label={copy.phone}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          optional={ui.optional}
          defaultValue={state.values?.phone}
          error={errors.phone}
          placeholder="(555) 010-0000"
        />
        <Select
          label={copy.type}
          name="type"
          defaultValue={state.values?.type}
          error={errors.type}
          options={[ui.notSure, ...serviceTitles]}
        />
      </div>

      <TextArea
        label={copy.message}
        name="message"
        rows={5}
        required
        defaultValue={state.values?.message}
        error={errors.message}
        placeholder={ui.messagePlaceholder}
      />

      {failed ? (
        <p role="alert" className="flex items-start gap-2 text-[14px] leading-6 text-danger">
          <Icon name="alert" size={18} className="mt-0.5" />
          {ui.formError}
        </p>
      ) : null}

      {/* With no backend configured, or after a failure, the primary action
          becomes email — carrying whatever has been typed. */}
      {hasBackend && !failed ? (
        <div className="flex flex-col items-start gap-3">
          <Button type="submit" variant="primary" size="lg" cut disabled={pending}>
            {pending ? ui.sending : copy.submit}
          </Button>
          <p className="flex items-center gap-2 font-mono text-[12px] text-ink-faint">
            <Nuqta size={7} />
            {site.hero.reassurance}
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-start gap-3">
          <Button
            href={emailFallback()}
            variant="primary"
            size="lg"
            cut
            icon="mail"
            onClick={() => trackContact('email', 'contact-page')}
          >
            {ui.sendByEmail}
          </Button>
          <p className="flex items-center gap-2 font-mono text-[12px] text-ink-faint">
            <Nuqta size={7} />
            {site.hero.reassurance}
          </p>
        </div>
      )}
    </form>
  );
}

export default ContactForm;
