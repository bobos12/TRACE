import type { ServiceVisual } from '@/lib/content';
import { anim, C, Illo, Rhombus, stroke } from './Illo';

/**
 * The nine service mini-illustrations, keyed by `visual` in services.json.
 *
 * All server components. Every moving part is a plain SVG element carrying CSS
 * custom properties (see `anim()`); the keyframes live in globals.css and are
 * triggered by the shared reveal observer. Line-drawing uses `pathLength="1"`
 * so one dash pattern works for every path length.
 */

/* ── browser ──────────────────────────────────────────────────────
   A browser frame whose page wireframe draws itself line by line;
   a nuqta lands on the CTA. */
function Browser() {
  return (
    <Illo>
      <rect x="14" y="14" width="212" height="112" rx="3" {...stroke} stroke={C.line} />
      <path d="M14 30h212" {...stroke} stroke={C.line} />
      <circle cx="23" cy="22" r="1.6" fill={C.line} />
      <circle cx="30" cy="22" r="1.6" fill={C.line} />
      <circle cx="37" cy="22" r="1.6" fill={C.line} />

      <path d="M28 46h74" {...stroke} stroke={C.ink} strokeWidth={5} pathLength={1} {...anim('draw', 0.1, { duration: 0.4 })} />
      <path d="M28 60h96" {...stroke} stroke={C.ink} strokeWidth={5} pathLength={1} {...anim('draw', 0.22, { duration: 0.4 })} />
      <path d="M28 76h60" {...stroke} stroke={C.line} pathLength={1} {...anim('draw', 0.34, { duration: 0.3 })} />
      <path d="M28 84h48" {...stroke} stroke={C.line} pathLength={1} {...anim('draw', 0.4, { duration: 0.3 })} />

      <rect
        x="150"
        y="44"
        width="60"
        height="46"
        rx="2"
        fill={C.soft}
        stroke={C.line}
        strokeWidth={1.25}
        {...anim('fade', 0.3)}
      />

      {/* The CTA, with the nuqta landing on it. */}
      <rect x="28" y="98" width="58" height="14" rx="2" fill={C.ink} {...anim('rise', 0.55)} />
      <Rhombus x={94} y={105} r={4.5} {...anim('stamp', 0.78)} />
    </Illo>
  );
}

/* ── phone ────────────────────────────────────────────────────────
   A phone whose list rows slide in; a toast stamps in. */
function Phone() {
  return (
    <Illo>
      <rect x="88" y="10" width="64" height="120" rx="9" {...stroke} stroke={C.line} />
      <path d="M110 17h20" {...stroke} stroke={C.line} strokeWidth={2} strokeLinecap="round" />

      {[0, 1, 2, 3].map((i) => (
        <g key={i} {...anim('slide', 0.12 + i * 0.09, { from: -10 })}>
          <rect x="95" y={32 + i * 18} width="10" height="10" rx="1.5" fill={C.soft} stroke={C.line} strokeWidth={1} />
          <rect x="110" y={34 + i * 18} width="34" height="2.5" fill={C.ink} />
          <rect x="110" y={40 + i * 18} width="22" height="2" fill={C.line} />
        </g>
      ))}

      {/* The toast. */}
      <g {...anim('stamp', 0.62)}>
        <rect x="72" y="104" width="96" height="20" rx="2" fill={C.ink} />
        <path d="M84 114l3.5 3.5L95 109" fill="none" stroke={C.soft} strokeWidth={1.6} strokeLinecap="square" />
        <rect x="102" y="113" width="50" height="2.5" fill={C.soft} opacity={0.7} />
      </g>
    </Illo>
  );
}

/* ── system ───────────────────────────────────────────────────────
   Three kanban columns; one card moves across. */
function System() {
  const cols = [20, 92, 164];
  const cards = [
    { x: 20, y: 38 },
    { x: 20, y: 62 },
    { x: 92, y: 62 },
    { x: 164, y: 38 },
  ];

  return (
    <Illo>
      {cols.map((x, i) => (
        <g key={x} {...anim('fade', i * 0.06)}>
          <rect x={x} y="16" width="56" height="108" rx="3" fill={C.soft} stroke={C.line} strokeWidth={1.25} />
          <rect x={x + 8} y="26" width="24" height="3" fill={C.line} />
        </g>
      ))}

      {cards.map((c, i) => (
        <rect
          key={`${c.x}-${c.y}`}
          x={c.x + 8}
          y={c.y}
          width="40"
          height="18"
          rx="2"
          fill="var(--surface-raised)"
          stroke={C.line}
          strokeWidth={1}
          {...anim('rise', 0.18 + i * 0.07)}
        />
      ))}

      {/* The card that moves: column 1 → column 2, then marked. */}
      <g {...anim('move', 0.42, { duration: 1, mx: 72, my: -24 })}>
        <rect x="28" y="86" width="40" height="18" rx="2" fill={C.ink} />
        <rect x="34" y="93" width="22" height="2.5" fill={C.soft} opacity={0.8} />
      </g>
      <Rhombus x={140} y={71} r={4} {...anim('stamp', 1.3)} />
    </Illo>
  );
}

/* ── blocks ───────────────────────────────────────────────────────
   Modular blocks assembling into a shape. */
function Blocks() {
  const parts = [
    { x: 72, y: 26, w: 48, h: 40, mx: -40, my: -24 },
    { x: 124, y: 26, w: 44, h: 40, mx: 44, my: -24 },
    { x: 72, y: 70, w: 44, h: 44, mx: -40, my: 30 },
    { x: 120, y: 70, w: 48, h: 44, mx: 44, my: 30 },
  ];

  return (
    <Illo>
      {parts.map((p, i) => (
        <rect
          key={i}
          x={p.x}
          y={p.y}
          width={p.w}
          height={p.h}
          rx="2"
          fill={i === 3 ? 'transparent' : C.soft}
          stroke={C.line}
          strokeWidth={1.25}
          {...anim('slide', 0.1 + i * 0.1, { from: p.mx, duration: 0.55 })}
        />
      ))}
      {/* The custom piece — the one that makes it theirs. */}
      <rect x="120" y="70" width="48" height="44" rx="2" fill={C.ink} {...anim('fade', 0.62)} />
      <Rhombus x={144} y={92} r={6} {...anim('stamp', 0.78)} />
    </Illo>
  );
}

/* ── chart ────────────────────────────────────────────────────────
   Bars grow; the last bar is ink with a vermilion nuqta on top. */
function Chart() {
  const bars = [
    { x: 30, h: 28 },
    { x: 62, h: 44 },
    { x: 94, h: 36 },
    { x: 126, h: 58 },
    { x: 158, h: 50 },
    { x: 190, h: 76 },
  ];
  const base = 116;

  return (
    <Illo>
      <path d={`M18 ${base}h206`} {...stroke} stroke={C.line} />
      {bars.map((b, i) => {
        const last = i === bars.length - 1;
        return (
          <rect
            key={b.x}
            x={b.x - 11}
            y={base - b.h}
            width="22"
            height={b.h}
            fill={last ? C.ink : C.soft}
            stroke={last ? 'none' : C.line}
            strokeWidth={1.25}
            {...anim('grow', 0.1 + i * 0.07, { duration: 0.5, origin: 'bottom' })}
          />
        );
      })}
      <Rhombus x={190} y={base - 76 - 10} r={5.5} {...anim('stamp', 0.66)} />
    </Illo>
  );
}

/* ── calendar ─────────────────────────────────────────────────────
   A week grid; appointment slots fill. */
function Calendar() {
  const cols = 5;
  const rows = 4;
  const cw = 38;
  const ch = 22;
  const x0 = 26;
  const y0 = 34;
  const booked: Array<[number, number]> = [
    [0, 1],
    [1, 0],
    [2, 2],
    [3, 1],
    [1, 3],
    [4, 2],
  ];

  return (
    <Illo>
      {Array.from({ length: cols }, (_, c) => (
        <rect key={`h${c}`} x={x0 + c * cw} y="16" width={cw - 4} height="10" rx="1.5" fill={C.line} opacity={0.5} />
      ))}
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => (
          <rect
            key={`${r}-${c}`}
            x={x0 + c * cw}
            y={y0 + r * ch}
            width={cw - 4}
            height={ch - 4}
            rx="1.5"
            fill="none"
            stroke={C.line}
            strokeWidth={1}
          />
        )),
      )}
      {booked.map(([c, r], i) => (
        <rect
          key={`b${i}`}
          x={x0 + c * cw}
          y={y0 + r * ch}
          width={cw - 4}
          height={ch - 4}
          rx="1.5"
          fill={i === booked.length - 1 ? C.mark : C.ink}
          {...anim('grow', 0.14 + i * 0.11, { duration: 0.3 })}
        />
      ))}
    </Illo>
  );
}

/* ── layers ───────────────────────────────────────────────────────
   Three stacked planes separate. */
function Layers() {
  const plane = 'M120 8L204 44L120 80L36 44Z';
  const planes = [
    { y: 52, fill: C.soft, delay: 0.08 },
    { y: 26, fill: 'var(--surface-raised)', delay: 0.18 },
    { y: 0, fill: C.ink, delay: 0.28 },
  ];

  return (
    <Illo>
      {planes.map((p, i) => (
        <path
          key={i}
          d={plane}
          fill={p.fill}
          stroke={i === 2 ? 'none' : C.line}
          strokeWidth={1.25}
          {...anim('move', p.delay, { duration: 0.55, my: p.y })}
        />
      ))}
      <Rhombus x={120} y={44} r={6} {...anim('stamp', 0.6)} />
    </Illo>
  );
}

/* ── nodes ────────────────────────────────────────────────────────
   API nodes connected by traces that draw between them. */
function Nodes() {
  const hub = { x: 120, y: 70 };
  const spokes = [
    { x: 34, y: 30 },
    { x: 34, y: 110 },
    { x: 206, y: 26 },
    { x: 206, y: 70 },
    { x: 206, y: 114 },
  ];

  return (
    <Illo>
      {spokes.map((s, i) => (
        <path
          key={`l${i}`}
          d={`M${s.x} ${s.y}L${hub.x} ${hub.y}`}
          {...stroke}
          stroke={C.line}
          pathLength={1}
          {...anim('draw', 0.12 + i * 0.09, { duration: 0.45 })}
        />
      ))}
      {spokes.map((s, i) => (
        <rect
          key={`n${i}`}
          x={s.x - 16}
          y={s.y - 8}
          width="32"
          height="16"
          rx="2"
          fill="var(--surface-raised)"
          stroke={C.line}
          strokeWidth={1.25}
          {...anim('rise', 0.06 + i * 0.09)}
        />
      ))}
      <rect
        x={hub.x - 26}
        y={hub.y - 13}
        width="52"
        height="26"
        rx="2"
        fill={C.ink}
        {...anim('rise', 0.04)}
      />
      <Rhombus x={hub.x} y={hub.y} r={5} {...anim('stamp', 0.68)} />
    </Illo>
  );
}

/* ── flow ─────────────────────────────────────────────────────────
   Automation steps light up in sequence along a trace. */
function Flow() {
  const steps = [40, 90, 140, 190];
  const y = 70;
  const last = steps[steps.length - 1]!;

  return (
    <Illo>
      <path d={`M24 ${y}h192`} {...stroke} stroke={C.line} pathLength={1} {...anim('draw', 0.06, { duration: 0.8 })} />
      {steps.map((x, i) => (
        <g key={x}>
          <rect
            x={x - 18}
            y={y - 18}
            width="36"
            height="36"
            rx="2"
            fill={C.soft}
            stroke={C.line}
            strokeWidth={1.25}
            {...anim('fade', 0.1 + i * 0.05)}
          />
          <rect
            x={x - 18}
            y={y - 18}
            width="36"
            height="36"
            rx="2"
            fill={i === steps.length - 1 ? C.mark : C.ink}
            {...anim('stamp', 0.42 + i * 0.16, { duration: 0.28 })}
          />
        </g>
      ))}
      <path
        d={`M${last - 8} ${y}l5 5 10-11`}
        fill="none"
        stroke="var(--on-nuqta)"
        strokeWidth={1.8}
        strokeLinecap="square"
        pathLength={1}
        {...anim('draw', 1.06, { duration: 0.3 })}
      />
    </Illo>
  );
}

const MAP: Record<ServiceVisual, () => React.JSX.Element> = {
  browser: Browser,
  phone: Phone,
  system: System,
  blocks: Blocks,
  chart: Chart,
  calendar: Calendar,
  layers: Layers,
  nodes: Nodes,
  flow: Flow,
};

export function ServiceIllustration({ visual }: { visual: ServiceVisual }) {
  const Component = MAP[visual];
  return <Component />;
}

export default ServiceIllustration;
