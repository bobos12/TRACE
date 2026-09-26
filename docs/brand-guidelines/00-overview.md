ATHR (أثر) is a software studio for businesses in Egypt, Saudi Arabia and the wider Gulf. The whole identity rests on one observation about the name: **ث is ت with one more dot.** Arabic letters share skeletons; the dots decide which letter you are reading. ATHR builds the shared skeleton well and places the mark that makes it someone's own. Everything below — the logo, the rhombus, the cut corner, the client constellations — is that idea applied.

> Every business has its own identity. ATHR builds the technology around it — and leaves a mark.

## The five things that make it ATHR

1. **The nuqta cluster.** Three rhombic dots, arranged as over ث, sit over the TH in `ATHR` and over the ث in `أثر`. Same mark, same sound, both scripts. Arranged ∴ they also read as "therefore" — consequence, effect, another meaning of أثر. Use the SVGs in `assets/Logos/` or the `Logo` component; never rebuild it.
2. **The nuqta** — one vermilion rhombus. It is the active marker (nav, tabs, sidebar), the bullet, the timeline event, and the **full stop of display lines** (`<span class="at-stop">`). One per view region.
3. **The cut** — a single 45° chamfer on the trailing top corner (`.at-cut`), the angle of the nuqta's side. Primary buttons, featured and case-study cards, the app icon, proposal pages. Never on every card.
4. **The constellation** — a 3×3 lattice of nuqtas. ATHR's own is the ث arrangement; every client gets their own, generated from their name (`Constellation seed="…"`). It marks their portal, proposal, case study and handover.
5. **Carbon, paper, vermilion.** A warm monochrome with one inked accent — the red that early Arabic manuscripts used for the dots and vowel marks.

## Colour

Build UI with the semantic tokens; the primitives (`carbon`, `graphite`, `ash`, `sand`, `paper`, `chalk`) are for identity work. Two themes: **Paper** (light, the default) and **Carbon** (dark). Both are complete — every screen ships in both.

- Text: `ink` on `surface`, `surface-raised`, `surface-sunken`; secondary in `ink-muted`; placeholders only in `ink-faint`. On an inverted band use `surface-inverse` with `ink-inverse`.
- `vermilion` is graphic only — logo nuqtas, the signature rhombus, cover and social blocks (3:1+). It is never body text on paper.
- `nuqta` is the interactive accent: primary button fill (label in `on-nuqta`), links, selected states on `nuqta-soft`. It never means error.
- Status: `success` (blue-teal, off the red–green axis), `warning` (ochre), `danger` (crimson-rose, deliberately apart from the brand red) — each on its `-soft` ground, always with an icon or a word.
- Borders: `line` for dividers and card edges; `line-strong` for every control edge (3:1+). Focus is the `focus-ring` shadow: a 2px ground gap, then 2px of `ink` — never the accent, so focus never looks like an error or a selection.
- Proportion on any page: ~70% ground, ~25% ink, ≤5% vermilion/nuqta. If the accent is more than a mark, it's too much.

## Type

- **Instrument Sans** (Latin, variable 400–700) for display and UI; **IBM Plex Sans Arabic** for Arabic; **IBM Plex Mono** for numbers, codes and eyebrows. The `sans` stack falls through to Plex Arabic, so mixed strings render correctly in either direction.
- Display (`display-xl/lg/md`) is tight, large and short, and may end with the vermilion nuqta instead of a full stop. Product text uses `heading-1…3`, `body`, `body-sm`, `label`.
- Arabic runs one step larger and much looser than Latin (`ar-body` 16/1.85), is never letter-spaced and never condensed.
- Eyebrows are mono, uppercase, tracked `0.12em`, and use ◆ as the separator: `CASE STUDY ◆ 03`.
- Sentence case everywhere except eyebrows. Numbers in tables and KPIs are mono with tabular figures.

## Space, shape, layout

- The nuqta is the unit: 1 nuqta = 4px, every gap a whole number of nuqtas (`space-1` … `space-32`).
- Corners are nearly square: `radius-sm` (2px) for inputs and badges, `radius-md` (4px) for buttons, cards and modals, `radius-lg` only for mobile sheets. Only avatars and the switch track are round.
- Borders do the work; `shadow-float` only for things that float (menus, toasts, modals).
- 12-column grid, 32px gutter, `container-max` 1280px; reading text never wider than `measure`. Marketing pages are editorial: big type, hairline rules, asymmetric columns — not stacks of cards.
- Every component uses logical properties; set `dir="rtl"` and layouts, arrows, the cut and the nav marker mirror themselves.

## Motion

Fast and deliberate — the press of a mark, not a float. `duration-press` for active states, `duration-quick` + `ease-mark` for hover and indicators, `duration-trace` + `ease-trace` for lines drawing and panels forming, `duration-reveal` only on marketing pages. Signature moves: the nuqta **stamp** (scales down onto the page), the **trace** (a vermilion line runs out, e.g. under a toast), the **forming** loader (three nuqtas assembling ث). Honour `prefers-reduced-motion`; nothing loops except loaders.

## Iconography

`assets/Icons/` and the `Icon` component: 24px grid, 1.5px stroke, square caps, mitred joins, `currentColor`. Status icons (info, success, error) are built on the rhombus; alert is a triangle. No emoji, no filled icon sets, no illustrations of people or gadgets. Imagery, when used, is documentary photography of real work — warehouses, clinics, counters — warm, natural light, desaturated ~15%, never stock handshakes or glowing code.

## Voice

Confident, plain, specific. Short sentences. Talk about the client's business before our technology. Numbers over adjectives ("40 minutes to 6", not "dramatically faster"). "We" for ATHR, "you" for the client. English and Arabic are written, not translated — Arabic in clear Modern Standard, warm, never bureaucratic. Banned: revolutionize, cutting-edge, empower, seamless, next-generation, leverage, solutions (as a noun on its own), exclamation marks. See the Voice and Taglines sections.

## Using the components

`components/bundle.js` exposes `window.Athr` (React 18). One `primary` Button per view. Status always pairs colour with a word or icon. Client portals put the client's `Constellation` and name at the top of the `Sidebar` and "Built by ATHR" at its foot — the product is theirs; the mark is ours. The Pages group shows the system applied: Directions, Website, Dashboard, Mobile app, Proposal, Social, Case study, Brand applications.
