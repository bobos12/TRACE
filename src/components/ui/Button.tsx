import type { AnchorHTMLAttributes, ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { buttonClasses, cutFor, iconFor, type ButtonSize, type ButtonVariant } from './buttonStyles';
import { Icon, type IconName } from './Icon';

export type { ButtonSize, ButtonVariant };

interface Common {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconEnd?: IconName;
  /** The 45° chamfer on the trailing top corner. Use it sparingly. */
  cut?: boolean;
  block?: boolean;
  children?: ReactNode;
  className?: string;
}

type ButtonAsButton = Common &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> & { href?: undefined };

type ButtonAsLink = Common &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className'> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * One primary per view: the action the screen exists for.
 * Labels are a verb and an object, sentence case — "Start a project",
 * "Book a free call". Never "Submit", "Click here", "Learn more".
 *
 * With `href` this renders a plain <a>, for external links (wa.me, tel:).
 * For internal routes use LinkButton, which adds the locale prefix.
 */
export function Button(props: ButtonProps) {
  const {
    variant = 'secondary',
    size = 'md',
    icon,
    iconEnd,
    cut = false,
    block = false,
    children,
    className,
    ...rest
  } = props as Common & Record<string, unknown>;

  const classes = buttonClasses({ variant, size, cut, block, className });
  const style = cut ? ({ '--cut': `${cutFor[size]}px` } as CSSProperties) : undefined;

  const content = (
    <>
      {icon ? <Icon name={icon} size={iconFor[size]} /> : null}
      {children ? <span>{children}</span> : null}
      {iconEnd ? <Icon name={iconEnd} size={iconFor[size]} /> : null}
    </>
  );

  const { href, ...withoutHref } = rest as { href?: string };

  if (typeof href === 'string') {
    return (
      <a
        href={href}
        className={classes}
        style={style}
        {...(withoutHref as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  const buttonRest = withoutHref as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={buttonRest.type ?? 'button'} className={classes} style={style} {...buttonRest}>
      {content}
    </button>
  );
}

export default Button;
