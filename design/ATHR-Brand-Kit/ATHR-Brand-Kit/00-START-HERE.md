# ATHR / أثر — Brand kit & build guide

Everything you need to build the ATHR website yourself: the identity, every asset, the design tokens as code, the rules, and page designs to build from.

**Read first:** `01-Brand-Guidelines/ATHR-Brand-Guidelines.pdf` (30 pages). It covers strategy, the six directions, the logo, the signature, colour, type, motion, voice, taglines, the website and the product.

---

## What's in each folder

| Folder | Contents | You'll use it for |
| --- | --- | --- |
| `01-Brand-Guidelines/` | The PDF, `brand-book.html`, and the source text of every section in `sections/*.md` | Rules and reasoning; copy for the About page |
| `02-Visual-Directions/` | All 6 directions (`visual-directions.html` + PNG renders) and the identity cover | Explaining the brand; the "why" of the logo |
| `03-Logo/` | 17 logo files as SVG (vector) and PNG (high-res): wordmark, Arabic, bilingual, symbol, mono, reverse, app icons | Header, footer, docs, socials |
| `04-Design-Tokens/` | `tokens.json` (source), `tokens.css` (CSS variables, both themes), `tailwind.config.js` (v3), `tailwind-v4.css`, `figma-tokens.json` (Tokens Studio / W3C format) | Wiring the design into your code and Figma |
| `05-Typography/` | Font files (WOFF2) and `fonts.css` | Self-hosting the fonts |
| `06-Icons/` | 26 icons as SVG plus `icons.json` (path data) | UI icons |
| `07-Components/` | `components.html` (live gallery of all 23 components), `bundle.css`, `bundle.js`, `index.d.ts`, `guidelines/*.md`, PNG renders | Reference for building your components |
| `08-Website/` | Home page designs (EN + AR) as HTML and PNG, a favicon/app-icon set with `site.webmanifest`, social share images with editable templates | Building the site; launch files |
| `09-Applications/` | Dashboard, mobile app, proposal, social, case study, brand applications — as HTML and PNG | Case studies, product work, marketing |
| `_shared/` | Files the HTML pages in this kit load (fonts, tokens, components, React) | Nothing — leave it in place so the pages open offline |

Every `.html` file opens directly in a browser, offline. The **Light / Dark** button in the bottom corner switches themes. Add `#dark` to the URL to open a page in dark.

---

## Build setup (Next.js + Tailwind, or anything else)

### 1. Fonts

Copy `05-Typography/fonts/*` to `public/fonts/`.

**Plain CSS:** use `05-Typography/fonts.css` and change the paths to `/fonts/...`.

**Next.js:** use `next/font/local`:

```ts
// app/fonts.ts
import localFont from 'next/font/local';
export const sans = localFont({ src: '../public/fonts/InstrumentSans-Variable.woff2', weight: '400 700', variable: '--font-latin', display: 'swap' });
export const arabic = localFont({ src: [
  { path: '../public/fonts/IBMPlexSansArabic-400.woff2', weight: '400' },
  { path: '../public/fonts/IBMPlexSansArabic-500.woff2', weight: '500' },
  { path: '../public/fonts/IBMPlexSansArabic-600.woff2', weight: '600' },
  { path: '../public/fonts/IBMPlexSansArabic-700.woff2', weight: '700' }], variable: '--font-ar', display: 'swap' });
export const mono = localFont({ src: [
  { path: '../public/fonts/IBMPlexMono-400.woff2', weight: '400' },
  { path: '../public/fonts/IBMPlexMono-500.woff2', weight: '500' }], variable: '--font-code', display: 'swap' });
```

Then in `tokens.css`, point the three stacks at those variables:

```css
--font-sans: var(--font-latin), var(--font-ar), system-ui, sans-serif;
--font-arabic: var(--font-ar), var(--font-latin), system-ui, sans-serif;
--font-mono: var(--font-code), ui-monospace, monospace;
```

The Arabic font files contain Arabic glyphs only. Latin text in the `sans` stack comes from Instrument Sans, and Arabic falls through to Plex Arabic automatically, so mixed English/Arabic lines render correctly.

### 2. Tokens

1. Import `04-Design-Tokens/tokens.css` once in your global CSS.
2. For Tailwind v3, copy `tailwind.config.js`. For v4, `@import` `tailwind-v4.css` after `tokens.css`.
3. Colours resolve through CSS variables, so themes switch with one attribute:

```html
<html lang="en" dir="ltr" data-theme="light">  <!-- or "dark"; omit it to follow the OS -->
```

Examples: `bg-surface text-ink`, `border-line`, `text-ink-muted`, `bg-nuqta text-on-nuqta`, `p-6` (24px), `rounded-md` (4px), `text-display-xl`, `font-mono`, `shadow-float`, `duration-quick ease-mark`.

`tokens.css` also defines ready-made type classes: `.display-xl`, `.heading-1`, `.body`, `.ar-body`, `.eyebrow`, and so on.

**Figma:** import `figma-tokens.json` with the Tokens Studio plugin. It has three sets: `light`, `dark` and `global`.

### 3. Arabic and RTL

- Route by language: `/en/...` and `/ar/...`. Set `<html lang="ar" dir="rtl">` on the Arabic side.
- Write layout CSS with logical properties only: `margin-inline-start`, `padding-inline`, `inset-inline-end`, `text-align: start`. In Tailwind, use `ms-` / `me-` / `ps-` / `pe-` / `start-` / `end-`. Everything then mirrors for free.
- Mirror directional icons (arrows, chevrons) in RTL. Don't mirror the logo, numbers or media controls.
- Arabic type is one step larger and looser than Latin. Use the `ar-*` styles and never letter-space Arabic.
- Add `hreflang` links between each EN/AR page pair.

### 4. Favicons and social images

- Copy everything in `08-Website/favicons/` to `public/` (site root).
- Paste `head-snippet.html` into your `<head>`, or use Next's `metadata.icons` with the same files.
- Social share images are in `08-Website/og-images/`, sized 1200×630: home EN, home AR, case study, default.
- To make new ones, edit the HTML in `og-images/templates/`, open it in Chrome at 1200×630, and screenshot. Or copy the layout into `app/opengraph-image.tsx`.

### 5. Logo in code

- Inline the SVG from `03-Logo/SVG/` as a React component. Don't use `<img>` in the header — inline SVG stays sharp and can switch colour.
- **Letters** follow the text colour: `fill="currentColor"`. **Nuqtas** are always vermilion: `#E0461F` on light, `#FF5A33` on dark.
- **Header:** wordmark at 22–24px tall on desktop; Arabic wordmark at ~30px tall on `/ar`.
- **Footer:** bilingual lockup.
- **Minimum size:** 72px wide; below that, use the symbol.
- **Clear space:** the width of the nuqta cluster on every side.

---

## The signature elements, in plain CSS

These make it look like ATHR rather than a template. Use them exactly as described — no more.

```css
/* 1. The nuqta full stop — ends display headlines: <h1>Every business leaves a mark<span class="stop"></span></h1> */
.stop { display:inline-block; width:.19em; height:.19em; margin-inline-start:.06em; background:var(--vermilion); transform:rotate(45deg); vertical-align:.02em; }

/* 2. The nuqta marker — the one current/selected thing (active nav link, tab, sidebar item, bullet) */
.nuqta { display:inline-block; width:8px; height:8px; background:var(--vermilion); transform:rotate(45deg) scale(.7071); }

/* 3. The cut — 45° chamfer on the trailing top corner. Primary CTA, featured case cards only. */
.cut { --cut:12px; clip-path:polygon(0 0, calc(100% - var(--cut)) 0, 100% var(--cut), 100% 100%, 0 100%); }
[dir="rtl"] .cut { clip-path:polygon(var(--cut) 0, 100% 0, 100% 100%, 0 100%, 0 var(--cut)); }
/* sizes: buttons 10–14px, cards 20–36px */

/* 4. The trace — a hairline that ends in a nuqta (hero bottom, section dividers in documents) */
.trace { position:relative; height:1px; background:var(--line); }
.trace::after { content:""; position:absolute; inset-inline-start:61.8%; top:-4px; width:9px; height:9px; background:var(--vermilion); transform:rotate(45deg); }
```

**5. The constellation** (each client's mark) is a 3×3 grid of rhombi.

- Which cells are filled comes from the client's name, deterministically. ATHR's own mark fills cells 1, 3 and 5, with the top one in vermilion.
- The algorithm is the `constellation(seed)` function in `07-Components/bundle.js`. Copy it: it returns `{ on: [cells], mark: cell }`.
- Use it on case-study cards, case-study headers, proposal covers and client portals.

**Rules:**
- One vermilion mark per view region.
- Vermilion + nuqta together stay at 5% or less of any screen.
- Never scatter nuqtas as decoration.

---

## Website design reference

The home page designs to build from:
- `08-Website/pages/home-en.html` and `home-ar.html`
- Renders in `08-Website/renders/`

**Structure:**
1. **Nav:** wordmark, up to 5 links, language switch, one ink CTA.
2. **Hero:** `display-xl` headline ending in the nuqta, with the second half in `ink-muted`. The other-language line sits beside it. Lead paragraph in `body-lg`, then two buttons: secondary + primary with the cut. A trace line closes the hero.
3. **01 How we work:** three columns under an ink rule — Understand / Build around it / Leave a mark.
4. **02 Selected work:** one large case panel (graphite, cut corner, client constellation, three mono numbers) and two smaller panels.
5. **03 What we build:** a ruled 4×2 index of services. No icon cards.
6. **Other-language band:** a full carbon section in Arabic on the EN page, and in English on the AR page.
7. **CTA:** "Tell us how your business works." with one primary button.
8. **Footer:** bilingual logo, cities, email, ©.

**Layout:**
- 12-column grid, 32px gutter, 1280px max container.
- Section headings are offset to column 4.
- Section padding: 96px on desktop, 64px on mobile.
- Reading text no wider than 64ch.

**Motion:**
- Headline lines rise 8px and fade in once.
- The hero trace draws in once.
- Nothing else animates until the user interacts.
- Respect `prefers-reduced-motion`.

**Other pages** (Work index, Services, Approach, Studio, Contact, Case study) use the same parts. The case-study layout is in `09-Applications/pages/case-study.html`.

**Avoid:**
- Stock photos, 3D objects, gradients, glowing code
- Rows of rounded cards
- Coloured left-border cards
- Emoji
- Exclamation marks

---

## Components

`07-Components/components.html` shows all 23 components live. Each one's rules are in `guidelines/<Name>.md`, and its props are in `index.d.ts`.

Use them as a spec: build your own versions (React / Tailwind / shadcn) to match. `bundle.css` is plain CSS with the `at-` prefix, so you can copy styles from it directly — e.g. `.at-btn`, `.at-input`, `.at-tabs`, `.at-table`.

**Key behaviours:**
- One primary button per view.
- Labels above inputs; errors say what to do.
- Status always shows a word or icon, never colour alone.
- Keyboard focus is a 2px ink ring with a 2px gap (`--focus-ring`).

---

## Checks before launch

**Accessibility**
- Text colours already pass WCAG AA in both themes. Keep text on the grounds each token's note allows (see the token list in the PDF).
- Focus is visible on every interactive element.

**Performance**
- Self-hosted WOFF2 with `font-display: swap`. Preload only `InstrumentSans-Variable.woff2` on `/en` and `IBMPlexSansArabic-600.woff2` on `/ar`.

**SEO**
- Title and description per page in both languages
- `hreflang` links between EN/AR pairs
- OG images set
- `sitemap.xml`, `robots.txt`

**Legal**
- Privacy policy and terms (Saudi PDPL, Egypt Data Protection Law) if the contact form collects data.

---

## What you still need to supply

- **Real case studies.** The clients and numbers in all designs (Nakheel Logistics, Sadeem Clinics, Masar Realty, Wared Foods, Qahwa House) are placeholders showing the format. Replace them with real projects, or with your own products.
- **Final copy.** The EN and AR copy in the designs is a strong draft. Have a native writer review the Arabic tone.
- **Contact details, domain and email.** `athr.studio` and the phone number are placeholders.
- **Photography.** Optional. If you add it: documentary photos of real work, warm natural light, desaturated ~15%. The site works fine with typography only.
- **Trademark check.** Search "ATHR / أثر" in the Egyptian and Saudi trademark registers before launch.

---

## Licences

- **Instrument Sans, IBM Plex Sans Arabic, IBM Plex Mono:** SIL Open Font License 1.1. Free for commercial use and self-hosting.
- **Logo, icons, tokens and designs:** made for ATHR; yours to use.
