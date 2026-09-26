import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { useId } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';

const inputBase =
  'w-full bg-surface-raised text-ink border border-line-strong rounded-sm px-3 text-[15px] ' +
  'transition-[border-color] duration-[160ms] ease-mark placeholder:text-ink-faint ' +
  'hover:border-ink-muted focus:outline-none focus:border-ink focus:shadow-[var(--focus-ring)] ' +
  'aria-invalid:border-danger';

function Shell({
  id,
  label,
  optional,
  hint,
  error,
  children,
  className,
}: {
  id: string;
  label: string;
  optional?: boolean | string;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-2', className)}>
      <label htmlFor={id} className="flex justify-between gap-2 text-[13px] font-medium leading-4 text-ink">
        {label}
        {optional ? (
          <span className="font-normal text-ink-muted">
            {typeof optional === 'string' ? optional : 'Optional'}
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-msg`} className="flex items-start gap-1 text-[13px] leading-5 text-danger">
          <Icon name="alert" size={16} className="mt-0.5" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-msg`} className="text-[13px] leading-5 text-ink-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  hint?: ReactNode;
  error?: string;
  optional?: boolean | string;
  /** A unit shown inside the field, e.g. SAR. */
  prefix?: string;
  wrapClassName?: string;
}

/** Label on top, always; hint or error below. Placeholders show an example, never the label. */
export function Field({
  label,
  hint,
  error,
  optional,
  prefix,
  wrapClassName,
  className,
  ...rest
}: FieldProps) {
  const auto = useId();
  const id = rest.name ? `f-${rest.name}` : auto;

  return (
    <Shell id={id} label={label} optional={optional} hint={hint} error={error} className={wrapClassName}>
      <div className="relative flex items-center">
        {prefix ? (
          <span className="pointer-events-none absolute start-3 font-mono text-[13px] text-ink-muted">
            {prefix}
          </span>
        ) : null}
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={hint || error ? `${id}-msg` : undefined}
          className={cn(inputBase, 'h-10', prefix && 'ps-[52px]', className)}
          {...rest}
        />
      </div>
    </Shell>
  );
}

export interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string;
  hint?: ReactNode;
  error?: string;
  optional?: boolean | string;
  wrapClassName?: string;
}

export function TextArea({
  label,
  hint,
  error,
  optional,
  wrapClassName,
  className,
  ...rest
}: TextAreaProps) {
  const auto = useId();
  const id = rest.name ? `f-${rest.name}` : auto;

  return (
    <Shell id={id} label={label} optional={optional} hint={hint} error={error} className={wrapClassName}>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={hint || error ? `${id}-msg` : undefined}
        className={cn(inputBase, 'min-h-24 resize-y py-3 leading-6', className)}
        {...rest}
      />
    </Shell>
  );
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  label: string;
  options: Array<string | { value: string; label: string }>;
  hint?: ReactNode;
  error?: string;
  optional?: boolean | string;
  wrapClassName?: string;
}

/** A native select in the field frame — reliable on every device and in RTL. */
export function Select({
  label,
  options,
  hint,
  error,
  optional,
  wrapClassName,
  className,
  ...rest
}: SelectProps) {
  const auto = useId();
  const id = rest.name ? `f-${rest.name}` : auto;

  return (
    <Shell id={id} label={label} optional={optional} hint={hint} error={error} className={wrapClassName}>
      <div className="relative flex items-center">
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={hint || error ? `${id}-msg` : undefined}
          className={cn(inputBase, 'h-10 cursor-pointer appearance-none pe-9', className)}
          {...rest}
        >
          {options.map((o) => {
            const value = typeof o === 'string' ? o : o.value;
            const text = typeof o === 'string' ? o : o.label;
            return (
              <option key={value} value={value}>
                {text}
              </option>
            );
          })}
        </select>
        <Icon
          name="chevron-down"
          size={18}
          className="pointer-events-none absolute end-2.5 text-ink-muted"
        />
      </div>
    </Shell>
  );
}

export default Field;
