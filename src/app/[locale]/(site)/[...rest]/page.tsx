import { notFound } from 'next/navigation';

/**
 * Catch-all inside the site segment.
 *
 * Without it an unmatched path such as /en/nope matches no route at all, so
 * Next falls back to the global not-found and the visitor loses the nav, the
 * footer and the WhatsApp route out. Throwing notFound() from *inside* this
 * segment renders the localized 404 in the site layout instead.
 */
export default function CatchAll(): never {
  notFound();
}
