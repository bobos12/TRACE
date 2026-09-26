import type { CSSProperties } from 'react';
import { cn } from '@/lib/cn';
import { stripTerminalStop } from '@/lib/text';

export type NuqtaTone = 'mark' | 'accent' | 'ink' | 'muted' | 'current';

const toneBg: Record<NuqtaTone, string> = {
  mark: 'bg-vermilion',
  accent: 'bg-nuqta',
  ink: 'bg-ink',
  muted: 'bg-ink-muted',
  current: 'bg-current',
};

export interface NuqtaProps {
  /** Box size in px before the 0.7071 scale — the rhombus reads this wide. */
  size?: number;
  tone?: NuqtaTone;
  /** Play the press-in animation once. */
  stamp?: boolean;
  /** Delay the stamp, in ms. */
  delay?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * The signature rhombus — the dot that makes ت into ث.
 * One vermilion nuqta per view region. If everything is marked, nothing is.
 */
export function Nuqta({
  size = 10,
  tone = 'mark',
  stamp = false,
  delay = 0,
  className,
  style,
}: NuqtaProps) {
  return (
    <span
      aria-hidden="true"
      className={cn('at-nuqta', toneBg[tone], stamp && 'at-stamp', className)}
      style={{ '--n': `${size}px`, animationDelay: delay ? `${delay}ms` : undefined, ...style } as CSSProperties}
    />
  );
}

/**
 * The full stop of a display headline — sized in em so it tracks the type.
 * Use instead of a period at the end of a display line.
 */
export function Stop({ stamp, className }: { stamp?: boolean; className?: string }) {
  return <span aria-hidden="true" className={cn('at-stop', stamp && 'at-stop-stamp', className)} />;
}

/**
 * A display line that ends in the vermilion nuqta instead of a full stop.
 * The stop is glued to the final word — it is an inline-block, and a bare one
 * can wrap onto a line of its own.
 */
export function StopText({ children, stamp }: { children: string; stamp?: boolean }) {
  const words = stripTerminalStop(children).trim().split(/\s+/);
  const last = words.pop() ?? '';
  return (
    <>
      {words.length > 0 ? `${words.join(' ')} ` : null}
      <span className="whitespace-nowrap">
        {last}
        <Stop stamp={stamp} />
      </span>
    </>
  );
}

export default Nuqta;
