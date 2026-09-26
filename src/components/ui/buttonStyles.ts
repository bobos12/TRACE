import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'ink' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'relative inline-flex items-center justify-center gap-2 whitespace-nowrap border border-transparent font-medium leading-none tracking-[0.005em] ' +
  'transition-[background-color,border-color,color,transform] duration-[160ms] ease-mark ' +
  'active:translate-y-px disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:border-line disabled:text-ink-faint';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-nuqta text-on-nuqta border-nuqta hover:bg-[color-mix(in_oklab,var(--nuqta)_86%,var(--ink))]',
  ink: 'bg-ink text-surface border-ink hover:bg-[color-mix(in_oklab,var(--ink)_85%,var(--surface))]',
  secondary: 'bg-surface-raised text-ink border-line-strong hover:border-ink',
  ghost: 'bg-transparent text-ink hover:bg-surface-sunken',
  danger: 'bg-danger text-surface border-danger',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[13px] rounded-sm',
  md: 'h-10 px-4 text-[14px] rounded-md',
  lg: 'h-13 px-6 text-[16px] rounded-md',
};

/** Chamfer size per button size. */
export const cutFor: Record<ButtonSize, number> = { sm: 8, md: 10, lg: 14 };
/** Icon size per button size. */
export const iconFor: Record<ButtonSize, number> = { sm: 16, md: 18, lg: 20 };

export function buttonClasses({
  variant = 'secondary',
  size = 'md',
  cut = false,
  block = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  cut?: boolean;
  block?: boolean;
  className?: string;
}): string {
  return cn(base, variants[variant], sizes[size], cut && 'at-cut', block && 'w-full', className);
}
