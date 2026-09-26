import type { CSSProperties, ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface CardProps {
  eyebrow?: ReactNode;
  title?: ReactNode;
  /** Top-trailing slot. */
  action?: ReactNode;
  footer?: ReactNode;
  /** The chamfered corner — featured work, case studies and plans only. */
  cut?: boolean | number;
  /** Carbon (or paper in dark). At most one per row. */
  inverse?: boolean;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * A bordered surface for one object or one idea.
 * No coloured left borders, no drop shadows at rest, no nested cards.
 */
export function Card({
  eyebrow,
  title,
  action,
  footer,
  cut = false,
  inverse = false,
  as: Tag = 'div',
  className,
  style,
  children,
}: CardProps) {
  const cutPx = typeof cut === 'number' ? cut : 20;

  return (
    <Tag
      className={cn(
        'flex flex-col gap-4 p-6',
        inverse ? 'bg-surface-inverse text-ink-inverse border-transparent' : 'bg-surface-raised',
        cut
          ? 'at-cut border-0 shadow-[inset_0_0_0_1px_var(--line)]'
          : 'rounded-md border border-line',
        className,
      )}
      style={cut ? ({ '--cut': `${cutPx}px`, ...style } as CSSProperties) : style}
    >
      {eyebrow || title || action ? (
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2 min-w-0">
            {eyebrow ? (
              <div
                className={cn(
                  'eyebrow flex items-center gap-2',
                  inverse ? 'opacity-70' : 'text-ink-muted',
                )}
              >
                {eyebrow}
              </div>
            ) : null}
            {title ? <h3 className="heading-3 m-0">{title}</h3> : null}
          </div>
          {action ? <div className="flex-none">{action}</div> : null}
        </div>
      ) : null}

      {children ? (
        <div className={cn(inverse ? 'opacity-80' : 'text-ink-muted')}>{children}</div>
      ) : null}

      {footer ? (
        <div className="flex items-center justify-between gap-3 border-t border-line pt-4">
          {footer}
        </div>
      ) : null}
    </Tag>
  );
}

export default Card;
