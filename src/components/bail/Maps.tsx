import Image from 'next/image';
import type { BailBonds } from '@/lib/content';
import { cn } from '@/lib/cn';
import { StatusBar } from './Frames';

/*
 * The 2 a.m. search, as it looks in a maps app on a phone — a 300 × 620
 * canvas. Its own palette (`.mock-gmaps`) stays light in both themes, the way
 * the app does. No third-party logos; the map is drawn, not a tile.
 */

type Maps = BailBonds['maps'];
type Result = Maps['results'][number];

const I = {
  back: 'M20 11H7.8l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20z',
  mic: 'M12 14a3 3 0 0 0 3-3V5a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-3.1A7 7 0 0 0 19 11z',
  check: 'M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z',
  down: 'M7 10l5 5 5-5z',
  turn: 'M21.7 11.3l-9-9a1 1 0 0 0-1.4 0l-9 9a1 1 0 0 0 0 1.4l9 9a1 1 0 0 0 1.4 0l9-9a1 1 0 0 0 0-1.4zM14 14.5V12h-4v3H8v-4a1 1 0 0 1 1-1h5V7.5l3.5 3.5z',
  phone: 'M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.6 3.6a1 1 0 0 1-.25 1z',
  globe:
    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.9 6h-2.9a15.7 15.7 0 0 0-1.4-3.6A8 8 0 0 1 18.9 8zM12 4c.8 1.2 1.5 2.5 1.9 4h-3.8c.4-1.4 1.1-2.8 1.9-4zM4.3 14a8.2 8.2 0 0 1 0-4h3.4a16.5 16.5 0 0 0 0 4zm.8 2h2.9c.3 1.3.8 2.5 1.4 3.6A8 8 0 0 1 5.1 16zM8 8H5.1a8 8 0 0 1 4.3-3.6C8.8 5.5 8.3 6.7 8 8zm4 12c-.8-1.2-1.5-2.5-1.9-4h3.8c-.4 1.4-1.1 2.8-1.9 4zm2.3-6H9.7a14.7 14.7 0 0 1 0-4h4.6a14.7 14.7 0 0 1 0 4zm.3 5.6c.6-1.1 1.1-2.3 1.4-3.6h2.9a8 8 0 0 1-4.3 3.6zm1.8-5.6a16.5 16.5 0 0 0 0-4h3.4a8.2 8.2 0 0 1 0 4z',
  star: 'M12 17.3l6.2 3.7-1.6-7 5.4-4.7-7.2-.6L12 2 9.2 8.7 2 9.3l5.4 4.7-1.6 7z',
  half: 'M12 2v15.3L5.8 21l1.6-7L2 9.3l7.2-.6z',
};

function Svg({ d, size = 16, className }: { d: string; size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" fill="currentColor" className={cn('flex-none', className)}>
      <path d={d} />
    </svg>
  );
}

function Rating({ value, reviews }: { value: string; reviews: string }) {
  const n = Number(value);
  return (
    <span className="flex items-center gap-1 text-[12.5px] text-[var(--gm-muted)]">
      <span className="text-[var(--gm-text)]">{value}</span>
      <span className="flex">
        {[0, 1, 2, 3, 4].map((i) => {
          const full = n >= i + 0.75;
          const half = !full && n >= i + 0.25;
          return (
            <span key={i} className="relative">
              <Svg d={I.star} size={12} className="text-[var(--gm-line)]" />
              {full || half ? (
                <Svg d={full ? I.star : I.half} size={12} className="absolute inset-0 text-[var(--gm-star)]" />
              ) : null}
            </span>
          );
        })}
      </span>
      <span>{reviews}</span>
    </span>
  );
}

/** A map pin: the teardrop with its dark dot, and a red label with a halo. */
function Pin({ x, y, label, big = false, side = 'end' }: { x: number; y: number; label: string; big?: boolean; side?: 'start' | 'end' }) {
  const s = big ? 1.3 : 1;
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="1" rx={4 * s} ry={1.6 * s} fill="rgb(0 0 0 / 0.18)" />
      <g transform={`scale(${s})`}>
        <path d="M0 0C-1.8-4-8-9.5-8-15a8 8 0 1 1 16 0C8-9.5 1.8-4 0 0Z" fill="var(--gm-pin)" stroke="var(--gm-pin-dark)" strokeWidth="0.8" />
        <circle cx="0" cy="-15" r="3" fill="var(--gm-pin-dark)" />
      </g>
      <text
        x={side === 'end' ? 11 * s : -11 * s}
        y={-13 * s}
        textAnchor={side === 'end' ? 'start' : 'end'}
        fontSize={big ? 11 : 9.5}
        fontWeight="700"
        fill="var(--gm-pin-text)"
        className="gm-halo"
      >
        {label}
      </text>
    </g>
  );
}

/** Midtown Houston, roughly: a rotated street grid, the bayou, a park, I-45. */
function MapArt({ maps }: { maps: Maps }) {
  const { labels, results } = maps;
  const minor = [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 390, 420];

  return (
    <svg viewBox="0 0 300 300" className="absolute inset-0 size-full" aria-hidden="true">
      <rect width="300" height="300" fill="var(--gm-land)" />

      <g transform="rotate(-14 150 150)">
        {/* city blocks read as faint tiles between the streets */}
        {minor.map((x) =>
          minor.map((y) => (
            <rect key={`${x}-${y}`} x={x + 3} y={y + 3} width="24" height="24" rx="1" fill="var(--gm-block)" opacity="0.55" />
          )),
        )}
        {minor.map((v) => (
          <g key={v}>
            <path d={`M${v} -160V460`} stroke="var(--gm-road-edge)" strokeWidth="3.6" />
            <path d={`M-160 ${v}H460`} stroke="var(--gm-road-edge)" strokeWidth="3.6" />
          </g>
        ))}
        {minor.map((v) => (
          <g key={`r${v}`}>
            <path d={`M${v} -160V460`} stroke="var(--gm-road)" strokeWidth="2.4" />
            <path d={`M-160 ${v}H460`} stroke="var(--gm-road)" strokeWidth="2.4" />
          </g>
        ))}
        {/* arterials */}
        <path d="M-160 90H460M120 -160V460" stroke="var(--gm-road-edge)" strokeWidth="7" />
        <path d="M-160 90H460M120 -160V460" stroke="var(--gm-road)" strokeWidth="5.4" />
        <text x="18" y="87" fontSize="7.5" fill="var(--gm-muted)" className="gm-halo">{labels.street1}</text>
        <text x="200" y="87" fontSize="7.5" fill="var(--gm-muted)" className="gm-halo">{labels.street1}</text>
        <text transform="translate(117 200) rotate(-90)" fontSize="7.5" fill="var(--gm-muted)" className="gm-halo">{labels.street2}</text>
        <text x="152" y="148" fontSize="7" fill="var(--gm-muted)" className="gm-halo">{labels.street3}</text>
      </g>

      {/* park and bayou */}
      <path d="M8 196L76 182L92 214L60 236L14 230Z" fill="var(--gm-park)" />
      <text x="14" y="198" fontSize="7" fill="var(--gm-park-text)" className="gm-halo">{labels.park}</text>
      <path d="M-10 214C30 196 52 236 96 222S160 186 210 200 270 238 312 226" fill="none" stroke="var(--gm-water)" strokeWidth="9" strokeLinecap="round" />
      <text x="150" y="211" fontSize="7.5" fontStyle="italic" fill="var(--gm-water-text)" className="gm-halo" transform="rotate(-6 150 211)">
        {labels.water}
      </text>

      {/* I-45 */}
      <path d="M262 -10C246 60 232 130 214 190S186 280 178 310" fill="none" stroke="var(--gm-highway-edge)" strokeWidth="11" />
      <path d="M262 -10C246 60 232 130 214 190S186 280 178 310" fill="none" stroke="var(--gm-highway)" strokeWidth="8" />
      <g transform="translate(240 88)">
        <path d="M-8-8h16v9c0 4-4 7-8 8-4-1-8-4-8-8z" fill="var(--gm-blue)" stroke="var(--gm-road)" strokeWidth="1.2" />
        <path d="M-8-8h16v3h-16z" fill="var(--gm-pin)" />
        <text x="0" y="3" textAnchor="middle" fontSize="7" fontWeight="700" fill="var(--gm-road)">{labels.highway}</text>
      </g>

      {/* districts */}
      <text x="168" y="44" fontSize="8" fontWeight="600" letterSpacing="2" fill="var(--gm-muted)" opacity="0.75" className="gm-halo">{labels.area2}</text>
      <text x="34" y="262" fontSize="8" fontWeight="600" letterSpacing="2" fill="var(--gm-muted)" opacity="0.75" className="gm-halo">{labels.area}</text>

      {/* you are here */}
      <circle cx="122" cy="236" r="13" fill="var(--gm-me)" opacity="0.15" />
      <circle cx="122" cy="236" r="6.5" fill="var(--gm-road)" />
      <circle cx="122" cy="236" r="4.6" fill="var(--gm-me)" />

      <Pin x={58} y={160} label={results[1]!.name.split(' ')[0]!} />
      <Pin x={232} y={238} label={results[2]!.name.split(' ')[0]!} side="start" />
      <Pin x={168} y={168} label={results[0]!.name} big />
    </svg>
  );
}

/** One result in the sheet, as the app lays it out. */
function Listing({ r, maps, annotate, first }: { r: Result; maps: Maps; annotate: boolean; first: boolean }) {
  const tone =
    r.tone === 'open' ? 'text-[var(--gm-green)]' : r.tone === 'closed' ? 'text-[var(--gm-red)]' : 'text-[var(--gm-muted)]';

  return (
    <div className={cn('relative border-b border-[var(--gm-line)] px-4 pb-3.5', annotate ? 'pt-5' : 'pt-3')}>
      {annotate ? (
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-1 rounded-[10px] border-2 border-dashed',
            first ? 'border-[var(--vermilion)]' : 'border-[var(--carbon)] opacity-50',
          )}
        />
      ) : null}
      <div className="flex gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
          <span className="text-[15.5px] leading-tight text-[var(--gm-text)]">{r.name}</span>
          <Rating value={r.rating} reviews={r.reviews} />
          <span className="text-[12.5px] text-[var(--gm-muted)]">
            {r.kind} · {r.distance}
          </span>
          <span className={cn('text-[12.5px]', tone)}>{r.status}</span>
        </div>
        {r.photos ? (
          <span className="relative size-[68px] flex-none overflow-hidden rounded-[8px]">
            <Image src="/images/bail/thumb-court.jpg" alt="" fill sizes="68px" className="object-cover" />
          </span>
        ) : null}
      </div>
      <div className="mt-2.5 flex gap-2">
        <span className="flex h-8 items-center gap-1.5 rounded-full bg-[var(--gm-blue)] px-3 text-[12.5px] font-medium text-[var(--gm-road)]">
          <Svg d={I.turn} size={14} /> {maps.actions[0]}
        </span>
        <span className="flex h-8 items-center gap-1.5 rounded-full border border-[var(--gm-line)] px-3 text-[12.5px] font-medium text-[var(--gm-blue)]">
          <Svg d={I.phone} size={13} /> {maps.actions[1]}
        </span>
        {r.website ? (
          <span className="flex h-8 items-center gap-1.5 rounded-full border border-[var(--gm-line)] px-3 text-[12.5px] font-medium text-[var(--gm-blue)]">
            <Svg d={I.globe} size={13} /> {maps.actions[2]}
          </span>
        ) : null}
      </div>
      {annotate ? (
        <span
          className={cn(
            'absolute top-1 left-4 -translate-y-1/2 rounded-[3px] px-2 py-0.5 font-mono text-[9px] tracking-[0.04em] uppercase',
            first ? 'bg-[var(--vermilion)] text-[var(--paper)]' : 'bg-[var(--carbon)] text-[var(--paper)]',
          )}
        >
          {r.note}
        </span>
      ) : null}
    </div>
  );
}

export function MapsScreen({ maps, time, annotate = false }: { maps: Maps; time: string; annotate?: boolean }) {
  return (
    <div className="mock-gmaps relative h-full w-full overflow-hidden bg-[var(--gm-bg)]">
      {/* the map fills the top, under the status bar and the search */}
      <div className="absolute inset-x-0 top-0 h-[300px]">
        <MapArt maps={maps} />
      </div>
      <StatusBar time={time} className="relative text-[var(--gm-text)]" />

      <div className="absolute inset-x-3 top-[40px] flex h-12 items-center gap-3 rounded-full bg-[var(--gm-bg)] px-4 shadow-[0_1px_3px_rgb(0_0_0/0.18),0_4px_12px_rgb(0_0_0/0.08)]">
        <Svg d={I.back} size={18} className="text-[var(--gm-text)]" />
        <span className="flex-1 truncate text-[14.5px] text-[var(--gm-text)]">{maps.query}</span>
        <Svg d={I.mic} size={18} className="text-[var(--gm-muted)]" />
        <span className="grid size-7 place-items-center rounded-full bg-[var(--gm-green)] text-[12px] font-medium text-[var(--gm-road)]">M</span>
      </div>

      <div className="absolute inset-x-3 top-[98px] flex gap-2">
        {maps.chips.map((c, i) => (
          <span
            key={c}
            className={cn(
              'flex h-8 items-center gap-1 rounded-full px-3 text-[12.5px] font-medium shadow-[0_1px_2px_rgb(0_0_0/0.2)]',
              i === 0 ? 'bg-[var(--gm-blue-soft)] text-[var(--gm-blue)]' : 'bg-[var(--gm-bg)] text-[var(--gm-text)]',
            )}
          >
            {i === 0 ? <Svg d={I.check} size={14} /> : null}
            {c}
            {i === maps.chips.length - 1 ? <Svg d={I.down} size={16} className="-me-1" /> : null}
          </span>
        ))}
      </div>

      {/* the results sheet */}
      <div className="absolute inset-x-0 top-[262px] bottom-0 rounded-t-[18px] bg-[var(--gm-bg)] shadow-[0_-2px_10px_rgb(0_0_0/0.12)]">
        <span className="mx-auto mt-2 mb-1 block h-1 w-8 rounded-full bg-[var(--gm-line)]" />
        {maps.results.map((r, i) => (
          <Listing key={r.name} r={r} maps={maps} annotate={annotate} first={i === 0} />
        ))}
      </div>
    </div>
  );
}
