# TextField

Label on top, always; hint or error below.

- `label`, `hint`, `error` (replaces the hint; sets `aria-invalid`), `optional` (true or a custom word), `prefix` (a unit such as `SAR`), `multiline` for a textarea; every other prop goes to the input. Set `dir="rtl"` for Arabic fields.
- Placeholders show an example, never the label. Errors say what to do: "Add the domain, e.g. sara@nakheel.sa".
