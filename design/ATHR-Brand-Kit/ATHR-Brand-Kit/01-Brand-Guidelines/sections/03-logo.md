# Logo system

All files are in `assets/Logos/` (single-ink or two-ink SVG; ink `#14130F`, reverse `#F4F1E9`, nuqtas `#E0461F` on paper and `#FF5A33` on carbon). The `Logo` component draws the same outlines live.

| Asset | Use |
| --- | --- |
| `athr-wordmark.svg` — primary | Website header, product footers, English documents |
| `athr-arabic.svg` | Arabic header and documents; RTL contexts |
| `athr-bilingual.svg` — secondary | Proposals, signage, footers, business cards, events |
| `athr-symbol.svg` (+ `-accent`, `-mono`, `-reverse`) | Favicon, avatar, loaders, small spaces, embossing |
| `app-icon-dark.svg` / `app-icon-light.svg` | App stores and home screens (dark is default) |
| `favicon.svg`, `social-avatar.svg` | Browser tab; every social platform |
| `*-mono.svg`, `*-reverse*.svg` | One-colour print, engraving, carbon grounds |

**No separate monogram.** The symbol already is one: three nuqtas that read as ث, as ∴, and — pointing up — as the apex of the A.

## Construction

- Nuqta = square rotated 45°. Gap between nuqtas = 0.36 × half-diagonal, so the cluster reads as three marks down to 16px.
- Latin: cluster centred on the T–H pair; gap to cap height = 1.5 × the half-diagonal.
- Arabic: set on the dotless form (ٮ) so the brand cluster replaces the font's round dots exactly where ث's dots sit. The hamza on أ stays.
- Bilingual: Latin, a 30%-ink divider, Arabic at 95% — Latin first in LTR, Arabic first in RTL. Never stacked.

## Rules

- Clear space = the width of the nuqta cluster on all sides. Minimum: wordmark 72px / 18mm wide; below that, the symbol.
- Colour: ink + vermilion on paper; paper + bright vermilion on carbon; one ink for print. No other colourways, no gradients, no outlines, no shadows, no photos behind it.
- Never retype the name, move the cluster, round the nuqtas, or put a client colour on them — that's what the constellation is for.
