import type { CSSProperties } from 'react';
import Image from 'next/image';
import type { ClientLogo } from '@/lib/content';
import { cn } from '@/lib/cn';

/**
 * A client's logo in its own colours.
 *
 * Two layers from scripts/make-client-logos.mjs, sharing one box: the neutral
 * pixels as a mask painted with the ink token, and the brand-coloured pixels
 * on top. The colours stay the client's; black or white lettering follows the
 * theme, so no logo disappears on paper or on carbon.
 */
export function ClientMark({
  client,
  className,
  style,
}: {
  client: ClientLogo;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn('relative block', className)}
      style={{ aspectRatio: `${client.width} / ${client.height}`, ...style }}
    >
      <span
        className="absolute inset-0 bg-ink"
        style={{
          maskImage: `url(${client.ink})`,
          WebkitMaskImage: `url(${client.ink})`,
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
        }}
      />
      {client.color ? (
        <Image src={client.color} alt="" fill sizes="240px" className="object-contain" />
      ) : null}
    </span>
  );
}

export default ClientMark;
