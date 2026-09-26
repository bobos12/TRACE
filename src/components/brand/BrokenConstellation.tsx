import { constellation } from '@/lib/constellation';
import { cn } from '@/lib/cn';

/**
 * ATHR's own constellation with the vermilion nuqta missing — the mark that
 * did not get made. Used only on the 404 page.
 */
export function BrokenConstellation({ size = 30, className }: { size?: number; className?: string }) {
  const { on, mark } = constellation('ATHR');

  return (
    <span
      aria-hidden="true"
      className={cn('inline-grid grid-cols-3 text-ink', className)}
      style={{ gap: size * 0.28 }}
    >
      {Array.from({ length: 9 }, (_, i) => {
        const missing = i === mark;
        const isOn = on.includes(i);
        return (
          <span
            key={i}
            className={cn('block', isOn && !missing ? 'bg-current' : 'bg-transparent')}
            style={{
              width: size,
              height: size,
              transform: 'rotate(45deg) scale(0.7071)',
              boxShadow: isOn && !missing ? undefined : `inset 0 0 0 1px ${missing ? 'var(--vermilion)' : 'currentColor'}`,
              opacity: isOn || missing ? 1 : 0.25,
            }}
          />
        );
      })}
    </span>
  );
}

export default BrokenConstellation;
