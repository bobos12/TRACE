import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** The 1280px editorial measure with a 32px gutter (24px below 640px). */
export function Container({
  as: Tag = 'div',
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return <Tag className={cn('container-page', className)}>{children}</Tag>;
}

export default Container;
