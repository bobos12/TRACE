'use client';

import { useId, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { Field, TextArea } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { Nuqta } from '@/components/brand/Nuqta';
import type { Locale } from '@/i18n/routing';
import type { Site } from '@/lib/content';
import { track, trackContact, whatsappTextHref } from '@/lib/contact';

/** "{name} from {company}" → the values, from the content templates. */
const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '');

/**
 * The WhatsApp brief.
 *
 * Pick what you need, add a name, and WhatsApp opens with the message already
 * written — the visitor only presses send. No backend, nothing stored: the
 * message goes straight from their phone to ours. It opens from the submit
 * handler, a user gesture, so no browser treats it as a pop-up.
 */
export function WhatsAppBrief({
  copy,
  services,
  optional,
  locale,
  context,
}: {
  copy: Site['brief'];
  /** Plain-language service names, "Not sure yet" last. */
  services: string[];
  optional: string;
  locale: Locale;
  /** The page it was sent from, added as the last line. */
  context?: string;
}) {
  const [picked, setPicked] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ services?: string; name?: string }>({});
  const groupRef = useRef<HTMLFieldSetElement>(null);
  const legendId = useId();

  const toggle = (service: string) => {
    setPicked((current) =>
      current.includes(service) ? current.filter((s) => s !== service) : [...current, service],
    );
    setErrors((e) => ({ ...e, services: undefined }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const read = (key: string) => String(data.get(key) ?? '').trim();
    const name = read('brief-name');
    const company = read('brief-company');
    const details = read('brief-details');

    const next = {
      services: picked.length ? undefined : copy.errorServices,
      name: name ? undefined : copy.errorName,
    };
    setErrors(next);
    if (next.services) return groupRef.current?.focus();
    // Field derives its id from the name.
    if (next.name) return document.getElementById('f-brief-name')?.focus();

    const list = new Intl.ListFormat(locale, { type: 'conjunction' }).format(picked);
    const message = [
      fill(company ? copy.messageHelloCompany : copy.messageHello, { name, company }),
      fill(copy.messageServices, { services: list }),
      details ? fill(copy.messageDetails, { details }) : '',
      context ? fill(copy.messagePage, { page: context }) : '',
    ]
      .filter(Boolean)
      .join('\n');

    trackContact('whatsapp', 'brief');
    track('brief_submit', { services: picked.length });
    window.open(whatsappTextHref(message), '_blank', 'noopener');
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="at-cut flex flex-col gap-7 bg-surface-raised p-6 sm:p-8"
      style={{ '--cut': '28px' } as CSSProperties}
    >
      <p className="eyebrow flex items-center gap-2.5 text-ink-muted">
        <Nuqta size={8} />
        {copy.eyebrow}
      </p>

      <fieldset
        ref={groupRef}
        tabIndex={-1}
        aria-describedby={errors.services ? `${legendId}-msg` : undefined}
        className="flex flex-col gap-3 outline-none"
      >
        <legend id={legendId} className="mb-3 text-[13px] font-medium leading-4 text-ink">
          {copy.servicesLabel}
        </legend>
        <div className="flex flex-wrap gap-2">
          {services.map((service) => (
            <Chip key={service} active={picked.includes(service)} onClick={() => toggle(service)}>
              {service}
            </Chip>
          ))}
        </div>
        {errors.services ? (
          <p id={`${legendId}-msg`} role="alert" className="flex items-start gap-1 text-[13px] leading-5 text-danger">
            <Icon name="alert" size={16} className="mt-0.5" />
            {errors.services}
          </p>
        ) : null}
      </fieldset>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label={copy.nameLabel}
          name="brief-name"
          autoComplete="name"
          required
          error={errors.name}
          onChange={() => errors.name && setErrors((e) => ({ ...e, name: undefined }))}
        />
        <Field
          label={copy.companyLabel}
          name="brief-company"
          autoComplete="organization"
          optional={optional}
        />
      </div>

      <TextArea
        label={copy.detailsLabel}
        name="brief-details"
        rows={3}
        optional={optional}
        placeholder={copy.detailsPlaceholder}
      />

      <div className="flex flex-col items-start gap-3">
        <Button type="submit" variant="primary" size="lg" cut icon="whatsapp">
          {copy.submit}
        </Button>
        <p className="body-sm text-ink-faint">{copy.hint}</p>
      </div>
    </form>
  );
}

export default WhatsAppBrief;
