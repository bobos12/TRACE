'use client';

import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { buttonClasses } from '@/components/ui/buttonStyles';
import { mailHref, track, trackContact } from '@/lib/contact';

/**
 * Order a TRACE product: an email with the order already written — the
 * product in the subject, the questions we need answered in the body.
 */
export function OrderButton({
  product,
  subject,
  body,
  block = false,
  children,
}: {
  product: string;
  subject: string;
  body: string;
  block?: boolean;
  children: ReactNode;
}) {
  return (
    <a
      href={mailHref(subject, body)}
      onClick={() => {
        trackContact('email', `landing:order-${product.toLowerCase()}`);
        track('product_order', { product });
      }}
      className={buttonClasses({ variant: 'primary', size: 'lg', cut: true, block })}
      style={{ '--cut': '14px' } as CSSProperties}
    >
      <span>{children}</span>
      <Icon name="arrow-right" size={20} />
    </a>
  );
}

export default OrderButton;
