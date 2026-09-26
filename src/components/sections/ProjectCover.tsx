import type { CSSProperties } from 'react';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';

/**
 * The case-study cover.
 *
 * Held to the page measure at its exact 16:10, so nothing is cropped and the
 * image is never stretched past the pixels it has — full-bleed at 100vw turned
 * a 2400px render soft on wide screens. The graphite band of the header runs
 * behind its top half, so the cover sits across the seam between the two.
 */
export function ProjectCover({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative bg-surface">
      <div aria-hidden="true" className="band-graphite absolute inset-x-0 top-0 h-1/2" />
      <Container className="relative">
        <figure
          className="at-cut relative aspect-[16/10] w-full overflow-hidden bg-carbon"
          style={{ '--cut': '36px' } as CSSProperties}
        >
          <Image
            src={src}
            alt={alt}
            fill
            preload
            quality={90}
            sizes="(max-width: 1344px) calc(100vw - 48px), 1280px"
            className="object-cover"
          />
        </figure>
      </Container>
    </div>
  );
}

export default ProjectCover;
