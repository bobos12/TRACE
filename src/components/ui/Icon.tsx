/**
 * Line icons on a 24px grid: 1.5px stroke, square caps, mitred joins, status
 * icons built on the rhombus. Inlined from public/icons/ so they colour with
 * `currentColor` and cost no extra request.
 *
 * The WhatsApp glyph (Simple Icons) is solid and keeps its own shape — never
 * restyle it or make it a rhombus.
 */
import type { SVGProps } from 'react';
import { cn } from '@/lib/cn';

const STROKE: Record<string, string> = {
  alert: 'M12 3.5l9 16H3zM12 10v4.5M12 17v.01',
  'arrow-right': 'M4 12h15M13 6l6 6-6 6',
  'arrow-up-right': 'M7 17L17 7M8 7h9v9',
  bell: 'M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15zM10 20.5h4',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3.5V7M16 3.5V7',
  chart: 'M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-6',
  check: 'M4.5 12.5l5 5 10-11',
  'chevron-down': 'M6 9l6 6 6-6',
  'chevron-right': 'M9 6l6 6-6 6',
  close: 'M6 6l12 12M18 6L6 18',
  code: 'M8.5 7L3.5 12l5 5M15.5 7l5 5-5 5M13.5 4.5l-3 15',
  dashboard: 'M4 4h7v9H4zM13 4h7v5h-7zM13 11h7v9h-7zM4 15h7v5H4z',
  facebook: 'M15.5 4H14a3 3 0 0 0-3 3v14M8 11h7',
  error: 'M12 2.5l9.5 9.5-9.5 9.5L2.5 12zM9.5 9.5l5 5M14.5 9.5l-5 5',
  file: 'M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6',
  globe:
    'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9z',
  inbox: 'M3.5 13.5h5l1.5 2.5h4l1.5-2.5h5M3.5 13.5L6 5h12l2.5 8.5v6h-17z',
  info: 'M12 2.5l9.5 9.5-9.5 9.5L2.5 12zM12 11v5M12 8v.01',
  instagram: 'M3.5 3.5h17v17h-17zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM17 7v.01',
  layers: 'M12 3.5l8.5 4.5-8.5 4.5L3.5 8zM3.5 12l8.5 4.5 8.5-4.5M3.5 16l8.5 4.5 8.5-4.5',
  mail: 'M3.5 5.5h17v13h-17zM3.5 6l8.5 7 8.5-7',
  menu: 'M4 7h16M4 12h16M4 17h10',
  minus: 'M5 12h14',
  phone:
    'M5 3.5h4l1.5 4.5-2.5 1.5a11 11 0 0 0 6.5 6.5l1.5-2.5 4.5 1.5v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5.5a2 2 0 0 1 2-2z',
  plus: 'M12 5v14M5 12h14',
  search: 'M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5L20 20',
  sliders: 'M4 7h9M17 7h3M4 17h3M11 17h9M15 5v4M9 15v4',
  success: 'M12 2.5l9.5 9.5-9.5 9.5L2.5 12zM8.5 12.2l2.4 2.4 4.6-5',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20.5c1-3.8 4-5.5 7.5-5.5s6.5 1.7 7.5 5.5',
  x: 'M4 4h4.5l11.5 16h-4.5zM20 4l-6.6 7.4M4 20l6.6-7.4',
};

const FILLED: Record<string, string> = {
  nuqta: 'M12 6l6 6-6 6-6-6z',
  whatsapp:
    'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z',
};

export type IconName = keyof typeof STROKE | keyof typeof FILLED;

export const iconNames = [...Object.keys(STROKE), ...Object.keys(FILLED)].sort() as IconName[];

/** Directional icons that mirror in RTL. */
const DIRECTIONAL = new Set(['arrow-right', 'arrow-up-right', 'chevron-right']);

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number;
  /** Accessible name. Without it the icon is hidden from screen readers. */
  label?: string;
  /** Force mirroring on or off; directional icons mirror in RTL by default. */
  flip?: boolean;
}

export function Icon({ name, size = 20, label, flip, className, ...rest }: IconProps) {
  const filled = FILLED[name as string];
  const mirror = flip ?? DIRECTIONAL.has(name as string);

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : 'true'}
      focusable="false"
      className={cn('flex-none', mirror && 'rtl:-scale-x-100', className)}
      {...(filled
        ? { fill: 'currentColor' }
        : {
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: 1.5,
            strokeLinecap: 'square' as const,
            strokeLinejoin: 'miter' as const,
          })}
      {...rest}
    >
      <path d={filled ?? STROKE[name as string]} />
    </svg>
  );
}

export default Icon;
