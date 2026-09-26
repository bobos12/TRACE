/** Join class names, dropping falsy values. Small on purpose — no clsx dep. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
