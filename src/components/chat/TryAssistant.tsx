'use client';

import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { buttonClasses } from '@/components/ui/buttonStyles';
import { openChat } from './events';

/** Opens the site's own assistant with a first question already asked. */
export function TryAssistant({ prompt, children }: { prompt: string; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => openChat({ prompt, placement: 'ai-section' })}
      className={buttonClasses({ variant: 'primary', size: 'lg', cut: true })}
      style={{ '--cut': '14px' } as CSSProperties}
    >
      <Icon name="message" size={20} />
      <span>{children}</span>
    </button>
  );
}

export default TryAssistant;
