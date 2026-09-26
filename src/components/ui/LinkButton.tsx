import type { ComponentProps, CSSProperties, ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { buttonClasses, cutFor, iconFor, type ButtonSize, type ButtonVariant } from './buttonStyles';
import { Icon, type IconName } from './Icon';

export interface LinkButtonProps extends Omit<ComponentProps<typeof Link>, 'className' | 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconEnd?: IconName;
  cut?: boolean;
  block?: boolean;
  className?: string;
  children?: ReactNode;
}

/**
 * A button that is really a route link — locale-prefixed by next-intl, so
 * /work becomes /ar/work or /en/work without the caller thinking about it.
 */
export function LinkButton({
  variant = 'secondary',
  size = 'md',
  icon,
  iconEnd,
  cut = false,
  block = false,
  className,
  children,
  ...rest
}: LinkButtonProps) {
  return (
    <Link
      className={buttonClasses({ variant, size, cut, block, className })}
      style={cut ? ({ '--cut': `${cutFor[size]}px` } as CSSProperties) : undefined}
      {...rest}
    >
      {icon ? <Icon name={icon} size={iconFor[size]} /> : null}
      {children ? <span>{children}</span> : null}
      {iconEnd ? <Icon name={iconEnd} size={iconFor[size]} /> : null}
    </Link>
  );
}

export default LinkButton;
