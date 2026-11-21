'use client';

import type { CSSProperties, ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { Icon } from '@/components/ui/Icon';
import { buttonClasses } from '@/components/ui/buttonStyles';
import { track, trackContact, type Placement } from '@/lib/contact';

/**
 * "Start for $1" on a product: the contact form, opened with that software
 * plan and a ready message filled in — all that is left is their details.
 */
export function StartLink({
  plan,
  placement,
  children,
}: {
  plan: string;
  placement: Placement;
  children: ReactNode;
}) {
  return (
    <Link
      href={`/contact?product=${plan}#contact-form`}
      onClick={() => {
        trackContact('form', placement);
        track('software_select', { plan });
      }}
      className={buttonClasses({ variant: 'primary', size: 'lg', cut: true, block: true, className: 'group/start' })}
      style={{ '--cut': '14px' } as CSSProperties}
    >
      <span>{children}</span>
      <Icon
        name="arrow-right"
        size={20}
        className="transition-transform duration-[160ms] ease-mark group-hover/start:translate-x-1"
      />
    </Link>
  );
}

export default StartLink;
