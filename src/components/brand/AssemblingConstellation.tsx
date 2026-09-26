import type { CSSProperties } from 'react';
import { constellation } from '@/lib/constellation';
import { cn } from '@/lib/cn';

/**
 * A constellation that assembles from its nuqtas, once.
 *
 * Each lit cell stamps in 80ms after the last; empty cells stay as hairlines.
 * A server component — the stagger is CSS, triggered by the shared reveal
 * observer, and reduced motion collapses the delays to zero.
 */
export function AssemblingConstellation({
  seed,
  size = 28,
  className,
  label,
}: {
  seed?: string;
  size?: number;
  className?: string;
  label?: string;
}) {
  const { on, mark } = constellation(seed);

  return (
    <span
      data-reveal="fade"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : 'true'}
      className={cn('at-assemble inline-grid grid-cols-3', className)}
      style={{ gap: size * 0.28 }}
    >
      {Array.from({ length: 9 }, (_, i) => {
        const isOn = on.includes(i);
        const isMark = i === mark;
        const order = on.indexOf(i);

        return (
          <span
            key={i}
            data-lit={isOn ? '' : undefined}
            className={cn('block', isMark ? 'bg-vermilion' : isOn ? 'bg-current' : 'bg-transparent')}
            style={
              {
                width: size,
                height: size,
                boxShadow: isOn ? undefined : 'inset 0 0 0 1px currentColor',
                opacity: isOn ? 1 : 0.22,
                transform: 'rotate(45deg) scale(0.7071)',
                '--d': isOn ? `${150 + order * 80}ms` : '0ms',
              } as CSSProperties
            }
          />
        );
      })}
    </span>
  );
}

export default AssemblingConstellation;
