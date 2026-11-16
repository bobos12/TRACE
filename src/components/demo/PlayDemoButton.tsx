'use client';

import { buttonClasses, type ButtonSize, type ButtonVariant } from '@/components/ui/buttonStyles';
import { cn } from '@/lib/cn';
import { PLAY_DEMO_EVENT } from './InlineVideo';

/**
 * "Watch the 36-second demo": scrolls to the video on the page (#demo-video)
 * and starts it there. Without JavaScript it is a plain link to the video.
 */
export function PlayDemoButton({
  label,
  placement,
  variant = 'secondary',
  size = 'lg',
  className,
}: {
  label: string;
  placement: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  return (
    <a
      href="#demo-video"
      data-track="video"
      onClick={(e) => {
        const target = document.getElementById('demo-video');
        if (!target) return;
        e.preventDefault();
        const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
        target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
        dispatchEvent(new CustomEvent(PLAY_DEMO_EVENT, { detail: placement }));
      }}
      className={cn(buttonClasses({ variant, size }), className)}
    >
      <span aria-hidden="true" className="grid size-6 place-items-center rounded-full bg-nuqta text-on-nuqta">
        <svg viewBox="0 0 10 10" className="ms-px size-2.5" fill="currentColor">
          <path d="M2 1l7 4-7 4z" />
        </svg>
      </span>
      <span>{label}</span>
    </a>
  );
}

export default PlayDemoButton;
