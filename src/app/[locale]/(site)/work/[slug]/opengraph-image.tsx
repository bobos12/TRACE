import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { getProject, getProjects } from '@/lib/content';
import { readLocale, routing } from '@/i18n/routing';
import { constellation } from '@/lib/constellation';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'ATHR case study';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getProjects().map((project) => ({ locale, slug: project.slug })),
  );
}

const CARBON = '#0F0F0D';
const PAPER = '#F2EEE4';
const MUTED = '#A7A193';
const VERMILION = '#FF5A33';
const LINE = '#2E2D28';

/**
 * satori has no bidi engine: `direction: rtl` is a no-op and Arabic words are
 * laid out left to right, so a sentence reads backwards. Reversing the word
 * order restores the reading order.
 *
 * This is safe for runs of Arabic. A string mixing Arabic with a Latin phrase
 * of more than one word would place that phrase's words backwards — check any
 * new Arabic project copy that embeds one. See DECISIONS.md.
 */
function bidi(text: string, rtl: boolean): string {
  return rtl ? text.trim().split(/\s+/).reverse().join(' ') : text;
}

/** A nuqta: a square rotated 45°. */
function Rhombus({ size: s, color }: { size: number; color: string }) {
  return (
    <div
      style={{
        width: s,
        height: s,
        background: color,
        transform: 'rotate(45deg) scale(0.7071)',
      }}
    />
  );
}

/**
 * Per-project share image, in the case-study style: carbon ground, mono
 * eyebrow, the client name in display type ending in the nuqta, the result
 * numbers along the foot, and the client's own constellation.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = readLocale(rawLocale);
  const project = getProject(slug);

  if (!project) {
    return new ImageResponse(<div style={{ background: CARBON, width: '100%', height: '100%' }} />, size);
  }

  const copy = project[locale];
  const { on, mark } = constellation(copy.client);
  const rtl = locale === 'ar';

  // satori reads neither WOFF2 nor variable fonts, so these are the static TTF
  // copies produced by `npm run og:fonts`. See DECISIONS.md.
  const fonts = await Promise.all([
    readFile(path.join(process.cwd(), 'assets/og-fonts/InstrumentSans-600.ttf')),
    readFile(path.join(process.cwd(), 'assets/og-fonts/IBMPlexMono-500.ttf')),
    readFile(path.join(process.cwd(), 'assets/og-fonts/IBMPlexSansArabic-600.ttf')),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: CARBON,
          color: PAPER,
          padding: 64,
          fontFamily: rtl ? 'Plex Arabic' : 'Instrument Sans',
          alignItems: rtl ? 'flex-end' : 'flex-start',
        }}
      >
        {/* Eyebrow + the client's constellation. */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexDirection: rtl ? 'row-reverse' : 'row',
          }}
        >
          <div
            style={{
              fontFamily: 'Plex Mono',
              fontSize: 20,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: MUTED,
              display: 'flex',
            }}
          >
            {bidi([copy.sector, copy.country].filter(Boolean).join(' · '), rtl)}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', width: 108, gap: 8 }}>
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} style={{ display: 'flex', width: 28, height: 28 }}>
                {on.includes(i) ? (
                  <Rhombus size={28} color={i === mark ? VERMILION : PAPER} />
                ) : null}
              </div>
            ))}
          </div>
        </div>

        {/* The client name, ending in the nuqta. */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            alignItems: rtl ? 'flex-end' : 'flex-start',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 14,
              flexDirection: rtl ? 'row-reverse' : 'row',
            }}
          >
            <div
              style={{
                fontSize: rtl ? 68 : 82,
                fontWeight: 600,
                letterSpacing: rtl ? 0 : -3,
                lineHeight: 1,
              }}
            >
              {bidi(copy.client, rtl)}
            </div>
            <div style={{ display: 'flex', paddingBottom: 14 }}>
              <Rhombus size={26} color={VERMILION} />
            </div>
          </div>
          <div
            style={{
              fontSize: 34,
              color: MUTED,
              lineHeight: 1.3,
              maxWidth: 900,
              textAlign: rtl ? 'right' : 'left',
            }}
          >
            {bidi(copy.title, rtl)}
          </div>
        </div>

        {/* Result numbers, then the ATHR signature. */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 28,
            width: '100%',
            alignItems: rtl ? 'flex-end' : 'flex-start',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 56,
              width: '100%',
              borderTop: `1px solid ${LINE}`,
              paddingTop: 28,
              flexDirection: rtl ? 'row-reverse' : 'row',
            }}
          >
            {/* Numbers only where they are real; otherwise what it does. */}
            {copy.results.length
              ? copy.results.slice(0, 3).map((r) => (
                  <div
                    key={r.label}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                      alignItems: rtl ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div style={{ fontFamily: 'Plex Mono', fontSize: 42, fontWeight: 500 }}>
                      {r.value}
                    </div>
                    <div style={{ fontSize: 18, color: MUTED }}>{bidi(r.label, rtl)}</div>
                  </div>
                ))
              : copy.capabilities.slice(0, 3).map((c) => (
                  <div key={c} style={{ display: 'flex', fontSize: 30, color: MUTED }}>
                    {bidi(c, rtl)}
                  </div>
                ))}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              flexDirection: rtl ? 'row-reverse' : 'row',
            }}
          >
            <Rhombus size={16} color={VERMILION} />
            <div
              style={{
                fontFamily: 'Plex Mono',
                fontSize: 20,
                letterSpacing: 4,
                textTransform: 'uppercase',
                color: MUTED,
              }}
            >
              ATHR
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Instrument Sans', data: fonts[0], style: 'normal', weight: 600 },
        { name: 'Plex Mono', data: fonts[1], style: 'normal', weight: 500 },
        { name: 'Plex Arabic', data: fonts[2], style: 'normal', weight: 600 },
      ],
    },
  );
}
