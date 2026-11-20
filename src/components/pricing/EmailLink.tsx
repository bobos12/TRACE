'use client';

import type { ReactNode } from 'react';
import { mailHref, trackContact, type Placement } from '@/lib/contact';

/** A quiet text link that writes us an email — the second way in, after the call. */
export function EmailLink({
  placement,
  subject,
  children,
}: {
  placement: Placement;
  subject?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={mailHref(subject)}
      onClick={() => trackContact('email', placement)}
      className="text-[15px] font-medium text-ink-muted underline decoration-line-strong underline-offset-[5px] hover:text-ink hover:decoration-nuqta"
    >
      {children}
    </a>
  );
}

export default EmailLink;
