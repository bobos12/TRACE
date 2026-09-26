import type { CSSProperties } from 'react';
import { constellation } from '@/lib/constellation';
import { cn } from '@/lib/cn';

export interface ConstellationProps {
  /** The client or project name. Same name → same mark, always. */
  seed?: string;
  /** One cell in px. */
  size?: number;
  /** Hide the empty cells instead of outlining them. */
  quiet?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Accessible name. Decorative by default. */
  label?: string;
}

/**
 * A 3×3 lattice of nuqtas — each client's own mark, generated deterministically
 * from their name. It is theirs: don't reuse a seed for a different client and
 * don't hand-edit arrangements. docs/02-brand-essentials.md.
 */
export function Constellation({
  seed,
  size = 12,
  quiet = false,
  className,
  style,
  label,
}: ConstellationProps) {
  const { on, mark } = constellation(seed);

  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : 'true'}
      className={cn('inline-grid grid-cols-3', className)}
      style={{ gap: size * 0.28, ...style }}
    >
      {Array.from({ length: 9 }, (_, i) => {
        const isOn = on.includes(i);
        const isMark = i === mark;
        return (
          <span
            key={i}
            className={cn(
              'block',
              isMark ? 'bg-vermilion' : isOn ? 'bg-current' : 'bg-transparent',
            )}
            style={{
              width: size,
              height: size,
              transform: 'rotate(45deg) scale(0.7071)',
              boxShadow: isOn || isMark ? undefined : quiet ? undefined : 'inset 0 0 0 1px currentColor',
              opacity: isOn || isMark ? 1 : quiet ? 0 : 0.28,
            }}
          />
        );
      })}
    </span>
  );
}

export default Constellation;
