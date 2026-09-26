# Logo

The ATHR wordmark, Arabic wordmark, bilingual lockup and symbol, drawn from outlines so the nuqtas sit exactly over the TH and the ث.

- `variant`: `wordmark` (default, the primary logo) · `arabic` · `bilingual` · `symbol`. `size` is the height in px. `tone`: `color` (default: ink letters, `vermilion` nuqtas) · `mono` (all `currentColor`) · `accent` (symbol only: top nuqta vermilion, two in ink).
- Letters follow CSS `color` (defaults to `ink`); nuqtas follow `--vermilion`. On a carbon band set `color:#F2EEE4`.
- Use `wordmark` in LTR headers, `arabic` in RTL headers, `bilingual` in footers, proposals and signage; `symbol` below 72px of wordmark width, for favicons, avatars and loaders.
- Don't: type the name in a font, recolor the nuqtas in a client colour, move the cluster, or add effects. Static SVG files live in `assets/Logos/`.
