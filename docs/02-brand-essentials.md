# 02 — Brand essentials (read before designing anything)

Full guidelines: `docs/brand-guidelines/` (markdown sections + PDF). This page is the short version you must follow.

## The idea

**ث is ت with one more dot.** Arabic letters share skeletons; the dots decide which letter it is. ATHR (أثر — trace, imprint, impact) builds the shared skeleton well and places the mark that makes it the client's own. Every brand element expresses this.

## The five signature elements

| Element | What it is | Where it's used | Rule |
| --- | --- | --- | --- |
| **Nuqta cluster (logo)** | Three rhombic dots over the TH / ث | `starters/Logo.tsx`, `public/brand/*.svg` | Never retype the name or move the dots |
| **Nuqta** | One vermilion rhombus (square rotated 45°) | Full stop of display headlines, active nav/tab marker, bullets, timeline steps, cursor trail | One per view region |
| **The cut** | 45° chamfer on the trailing top corner | Primary CTA, featured project cards, the WhatsApp float button, CTA band | Never on every card |
| **Constellation** | 3×3 lattice of nuqtas; one arrangement per client, generated from the name | Project cards, project page hero, hero background lattice, empty states | `starters/constellation.ts` |
| **The trace** | Hairline that draws itself and ends in a nuqta | Section connectors, process timeline, hero bottom, toast timer | Draw once, on scroll |

## Colour

Tokens: `design/tokens/tokens.css` (CSS variables, light **Paper** + dark **Carbon** themes) and `tailwind-v4.css`.

- **Palette:** carbon `#0F0F0D`, graphite `#1A1A17`, sand `#D8D1C0`, paper `#F4F1E9`, and one accent — vermilion `#E0461F` (`#FF5A33` on dark).
- **Using the accent:**
  - `vermilion` is for marks only: logo dots, nuqtas, graphic blocks.
  - `nuqta` (`#B8330F` / `#FF6B47`) is the interactive accent: primary buttons, links, selection.
- **Proportion:** ~70% ground, ~25% ink, ≤5% accent.
- **Status colours:** `success` blue-teal, `warning` ochre, `danger` crimson-rose. Always pair them with an icon or word. Never use brand red to signal an error.
- **Focus:** a 2px ink ring with a 2px gap (`--focus-ring`).
- **WhatsApp:** its green (`#25D366`) may appear **only** inside the WhatsApp glyph or the float button's icon. Buttons stay in brand colours.

## Type

Self-hosted in `public/fonts/`.

- **Instrument Sans** (variable 400–700) — Latin display and UI
- **IBM Plex Sans Arabic** (400–700) — Arabic
- **IBM Plex Mono** (400/500) — numbers, eyebrows, codes

Rules:
- **Display:** tight tracking (−0.03 to −0.045em), leading 0.9–1, short lines. Can end in the vermilion nuqta instead of a full stop.
- **Arabic:** one step larger and much looser (line-height 1.25 for display, 1.85 for body). Never letter-spaced.
- **Eyebrows:** mono, uppercase, +0.12em, with ◆ as separator — e.g. `02 ◆ SELECTED WORK`. In Arabic, eyebrows use Plex Arabic at medium weight, not mono.
- **Case:** sentence case everywhere else.

## Shape and space

- **Spacing unit:** 1 nuqta = 4px. Every gap is a whole number of nuqtas.
- **Corners:** nearly square — 2px inputs/badges, 4px buttons/cards/modals, 8px mobile sheets only.
- **Borders:** hairline borders do the structure. Shadows only on floating things.
- **Grid:** 12 columns, 32px gutter, max container 1280px. Section headings sit offset to column 4 on desktop.

## Voice

Confident, plain, specific. Numbers over adjectives. Talk about the client's business before our technology.

**Banned words:** revolutionize, cutting-edge, empower, seamless, next-generation, leverage, "solutions" on its own, exclamation marks.

## What would make it look generic (never do these)

- Purple/blue gradients
- Glassmorphism everywhere
- Random 3D blobs
- Stock photos of handshakes or glowing code
- Emoji
- Rows of identical rounded cards with icons on top
- Coloured left-border cards
- Centred-everything layouts
- Scroll-jacking
- Animations that loop forever
