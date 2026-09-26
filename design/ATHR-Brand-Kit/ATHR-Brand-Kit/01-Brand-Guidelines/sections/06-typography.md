# Typography

## Chosen pairing — Instrument Sans + IBM Plex Sans Arabic + IBM Plex Mono

Instrument Sans is a precise grotesk with humane details (open apertures, a slightly calligraphic R and a) — technical but not cold, and far less common than Inter or Poppins. IBM Plex Sans Arabic was drawn for interfaces: open counters, moderate contrast, clear dots, a naskh-derived skeleton without calligraphic flourish — modern, not "traditional Arabic company". Plex Mono shares its engineering heritage, so the numbers in a dashboard feel like part of the same family as the Arabic text beside them.

## Pairings considered

| Pairing | Why it works | Why not first |
| --- | --- | --- |
| **Instrument Sans + Plex Sans Arabic + Plex Mono** ◆ | Distinctive Latin, UI-grade Arabic, one engineering family for data | — |
| Readex Pro (single family, Arabic + Latin) | Perfect script harmony, geometric | Latin looks rounded and "friendly-app"; weaker display voice |
| Space Grotesk + Noto Kufi Arabic | Strong technical display | Kufi is heavy in running Arabic text; Space Grotesk is overused |
| Instrument Serif + Noto Naskh Arabic (editorial accent) | Beautiful in proposals and case-study pull quotes | Reads heritage in product; reserved as an optional editorial accent |

## Rules

- Mixing scripts in a line: set it in `sans`; the stack falls to Plex Arabic for Arabic glyphs. For whole Arabic blocks use `arabic` and the `ar-*` styles.
- Arabic headlines: `ar-display` at ~0.6× the Latin display size and 1.3 line height.
- Numerals: Western digits in product UI for both languages (easier data entry); Arabic-Indic digits only in Arabic marketing copy.
