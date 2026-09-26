'use client';

import Image from 'next/image';
import { useRef, type CSSProperties, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { usePointerParallax, useScrollProgress } from '@/lib/scroll';

/** A browser chrome built in CSS — the image is content, never the frame. */
function BrowserFrame({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-md bg-[#1A1A17] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.75)] ring-1 ring-[#2E2D28]',
        className,
      )}
    >
      <div className="flex h-7 items-center gap-1.5 border-b border-[#2E2D28] px-3">
        <span className="size-1.5 rounded-full bg-[#4A4840]" />
        <span className="size-1.5 rounded-full bg-[#4A4840]" />
        <span className="size-1.5 rounded-full bg-[#4A4840]" />
        <span className="ms-3 h-3 flex-1 rounded-sm bg-[#232320]" />
      </div>
      {children}
    </div>
  );
}

/** A phone bezel built in CSS. The screenshots are transparent PNGs. */
function PhoneFrame({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-[26px] bg-[#0A0A08] p-1.5 shadow-[0_28px_70px_-18px_rgba(0,0,0,0.85)] ring-1 ring-[#34332D]',
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-[20px]">
        <span className="absolute left-1/2 top-2 z-10 h-1 w-10 -translate-x-1/2 rounded-full bg-[#2E2D28]" />
        {children}
      </div>
    </div>
  );
}

/**
 * One layer of the stack.
 *
 * `--depth` is the parallax strength in px, `--z` the resting Z translation,
 * `--fan` the direction it fans on scroll and `--in` its entrance delay.
 * The transform itself lives in CSS and reads the `--px`, `--py` and `--p`
 * properties the parent writes.
 */
function Layer({
  depth,
  z,
  delay,
  className,
  children,
}: {
  depth: number;
  z: number;
  delay: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn('at-layer absolute', className)}
      style={
        {
          '--depth': depth,
          '--z': `${z}px`,
          '--fan': z >= 0 ? 1 : -1,
          '--in': `${delay}ms`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}

export interface ProductStackProps {
  locale: 'ar' | 'en';
  alt: { dashboard: string; website: string; mobile: string };
}

/**
 * Three real product screens layered in 3D space — the proof that ATHR ships
 * software, sitting where a stock photo would otherwise go.
 *
 * Entrance: back to front, 120ms apart. Pointer parallax on desktop. On scroll
 * the layers fan apart on Z and fade. Mobile gets a static two-layer
 * composition. All of it in CSS, driven by three custom properties — this was
 * one of the last three things pulling the animation library onto the home page.
 */
export function ProductStack({ locale, alt }: ProductStackProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rtl = locale === 'ar';

  useScrollProgress(ref, { offset: 'contain' });
  usePointerParallax(ref);

  const website = `/images/ui/website-home-${rtl ? 'ar' : 'en'}-light.png`;
  const mobile = rtl
    ? '/images/ui/mobile-approve-ar-light.png'
    : '/images/ui/mobile-home-en-light.png';

  return (
    <div
      ref={ref}
      className="at-stack relative h-[240px] w-full sm:h-[400px] lg:h-[540px]"
      style={{ perspective: '1600px', '--dir': rtl ? -1 : 1 } as CSSProperties}
    >
      <div
        className="absolute inset-0"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateY(${rtl ? 14 : -14}deg) rotateX(6deg)`,
        }}
      >
        {/* Back — the dashboard, largest. */}
        <Layer depth={4} z={-120} delay={350} className="start-0 top-0 w-[76%] sm:start-[6%] sm:w-[80%]">
          <BrowserFrame>
            <Image
              src="/images/ui/dashboard-dark.png"
              alt={alt.dashboard}
              width={2880}
              height={2020}
              sizes="(max-width: 1024px) 80vw, 46vw"
              priority
              className="h-auto w-full"
            />
          </BrowserFrame>
        </Layer>

        {/* Middle — the marketing site, offset down and toward the start edge. */}
        <Layer depth={8} z={0} delay={470} className="hidden start-0 top-[34%] w-[58%] sm:block">
          <BrowserFrame>
            <Image
              src={website}
              alt={alt.website}
              width={2880}
              height={1800}
              sizes="34vw"
              loading="lazy"
              className="h-auto w-full"
            />
          </BrowserFrame>
        </Layer>

        {/* Front — the phone, overlapping the bottom trailing corner. */}
        <Layer
          depth={12}
          z={80}
          delay={590}
          className="end-0 top-[14%] w-[24%] max-w-[190px] sm:end-[8%] sm:top-[22%] sm:w-[26%]"
        >
          <PhoneFrame>
            <Image
              src={mobile}
              alt={alt.mobile}
              width={720}
              height={1520}
              sizes="(max-width: 640px) 26vw, 180px"
              priority
              className="h-auto w-full"
            />
          </PhoneFrame>
        </Layer>
      </div>
    </div>
  );
}

export default ProductStack;
