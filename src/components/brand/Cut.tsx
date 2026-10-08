import type { CSSProperties, ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface CutProps {
  /** Chamfer size in px. 12 on buttons, 20 on cards, 36 on big panels. */
  size?: number;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * The cut — a 45° chamfer on the trailing top corner, the nuqta's angle.
 * Primary CTA, featured project cards, the Book-a-call float button, the CTA band.
 * Never on every card. Mirrors automatically in RTL.
 */
export function Cut({ size = 12, as: Tag = 'div', className, style, children }: CutProps) {
  return (
    <Tag className={cn('at-cut', className)} style={{ '--cut': `${size}px`, ...style } as CSSProperties}>
      {children}
    </Tag>
  );
}

export default Cut;
