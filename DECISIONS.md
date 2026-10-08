# DECISIONS

Choices made where the specs left room, and why. Newest phase last.

---

## Phase 1 — Foundation

### Where the reference designs and the specs disagree

`design/reference/pages/home-*.html` is calm and editorial; `docs/03-home-page.md`
asks for considerably more visual life. The spec says it supersedes the
references, so: **the reference supplies the typographic system and grid, the
spec supplies the content and the motion.** Section headings offset to column 4,
mono eyebrows, hairline rules and the huge display type all come straight from
the approved render.

### Type scale is fluid, the token values are the desktop end

`design/tokens/tokens.css` ships fixed sizes (`display-xl` = 96px). The home spec
asks for a hero that clamps 56px → 112px. Rather than fork the tokens, `globals.css`
keeps the class names and drives their `font-size` from new
`--size-display-*` variables built with `clamp()`. The desktop end of each clamp
matches or slightly exceeds the token value; nothing else about the scale changed.

`display-xl` maxes at **112px** (the approved render uses 128px at 1440 with a
1280 container; 112 holds the same two-line measure without overflowing at 1280).

### Arabic re-maps the display classes instead of needing different ones

`[dir="rtl"] .display-xl` adopts the `ar-display` metrics — Plex Arabic, 1.3
line-height, zero tracking. One component therefore works in both scripts and
no section has to branch on locale to pick a type class. Eyebrows likewise drop
mono for Plex Arabic medium in RTL, per `docs/02-brand-essentials.md`.

### Carbon bands are a utility, not a theme

The hero and the contact band stay carbon in both themes. `band-carbon` (and
`band-graphite`) redeclare the theme variables on the element, so every child —
buttons, borders, focus rings, the nuqta accent — picks up the dark values
automatically. No component needs an `onDark` prop.

### `/_styleguide` lives in a `%5Fstyleguide` folder

Next.js treats a folder starting with `_` as private and excludes it from
routing. `%5F` is the documented escape, so the URL is still `/[locale]/_styleguide`.

### Fonts: only the Latin variable face is preloaded

`next/font` decides preloading per loader call, not per route, so there is no way
to preload Plex Arabic 600 on `/ar` only without also shipping it on `/en`.
Preloading all four Arabic faces would cost ~170KB on every route. So:
Instrument Sans Variable (29KB) is preloaded; Plex Arabic and Plex Mono use
`font-display: swap`. Revisit in Phase 4 if Lighthouse flags Arabic LCP.

`unicode-range` on the Arabic faces was dropped — `next/font/local`'s
`declarations` option rejected the value. Latin never falls into Plex Arabic
anyway, because Instrument Sans is first in `--font-sans` and covers the range.

### Language switch reads the query at click time

`useSearchParams()` opts the whole page out of static rendering unless it is
wrapped in Suspense. The switcher only needs the query when you click it, so it
reads `window.location.search` in the handler instead. Every page stays SSG.

### `ui` keys added to `content/site.*.json`

Interface chrome (menu labels, filter labels, case-study section headings, 404
copy, form states) is not marketing copy but it is still copy, and `CLAUDE.md`
says copy lives in `content/`. Added as a `ui` object in both locale files,
validated by an explicit Zod schema so a missing key fails the build.

### Analytics

Vercel Web Analytics, called through one `track()` function in `src/lib/contact.ts`
that also pushes to `dataLayer` if a tag manager is present. Swapping to Plausible
means changing that one function. No cookie banner is required for either.

### No smooth-scroll library

`docs/05-motion.md` allows Lenis. Skipped: native scroll already feels right,
scroll-linked effects use `useScroll`, and it saves ~10KB plus a class of
touch/reduced-motion bugs.

### Dependencies beyond `docs/07-tech.md`

| Package | Why |
| --- | --- |
| `qrcode` | The contact page needs a build-time QR for the `wa.me` link (`docs/04-pages.md`). Generated to an inline SVG string on the server; nothing ships to the client. |
| `@playwright/test` | Dev-only, for the screenshot script. |

### Constellation empty cells are outlined by default

`starters/constellation.ts` returns only the lit cells. Rendering the other cells
as hairline rhombi at 28% opacity reads as a lattice rather than a random
scatter, and matches the case-study render. `quiet` hides them where the mark
should stand alone.

---

## Phase 2 — Home page

### The fluid type scale was inert until the cascade layers were fixed

`tokens.css` ships fixed desktop type sizes (`display-xl: 96px`) and was imported
unlayered. **Unlayered rules beat layered ones regardless of specificity**, so
every `clamp()` in `globals.css` — which lives in `@layer components` — was being
ignored, and the hero rendered at 96px on a 390px phone. Fixed by declaring
`@layer theme, base, tokens, components, utilities;` at the top of `globals.css`
and importing tokens with `layer(tokens)`.

Worth knowing if tokens are ever re-copied from `design/tokens/`: the import
must keep `layer(tokens)`.

### The hero band is a flex column, not a capped box

The spec asks for `min-height: 100svh` capped at 960px. At 1440 the headline is
four lines in a six-column measure, so the content exceeds 960px and a `max-height`
simply clipped it under the closing trace. The band is now
`flex min-h-[100svh] flex-col`, the content takes `flex-1`, and the trace sits in
normal flow at the foot — it can never collide, whatever the copy length.

### Mobile hero order

`docs/03-home-page.md` asks for text → product stack → CTAs *and* for the
WhatsApp CTA to be visible without scrolling at 390×844. Both hold, but only by
moving the `lead` paragraph below the CTAs on mobile and keeping the stack at
240px. One DOM serves both layouts: the text block is `display: contents` on
mobile so its children become flex items that `order-*` can rearrange, and
becomes the left column of the 12-column grid from `lg`.
`scripts/fold-check.mjs` asserts the CTA stays above the fold.

### The nuqta full stop is glued to the last word

`.at-stop` is an `inline-block`, which is a valid line-break opportunity, so a
headline ending in one could drop the nuqta onto a line of its own. `StopText`
wraps the final word and the stop in a `whitespace-nowrap` span and strips the
terminal period from the content. Every display heading uses it.

### `useTransform` input ranges are clamped to [0,1]

Motion hands a `useTransform` range straight to WAAPI as keyframe offsets. The
work gallery's per-card ranges (`at ± span`) fell outside `[0,1]` for the first
and last cards and threw `Offsets must be monotonically non-decreasing` on every
page load. `cardRange()` now clamps. Same class of bug: a `times` array must
match the keyframe count on *every* animated property — `rotate: 45` alongside
`scale: [a,b,c]` and `times: [0,.55,1]` is invalid; it must be `rotate: [45,45,45]`.

`scripts/console-check.mjs` fails the review if either locale logs anything.

### Bento layout is an explicit tiling, not a rule

Nine services over four columns with one 2×2 anchor, four 2×1 and four 1×1 tiles
fills the grid exactly with no ragged last row. Driven by a `SPANS` array indexed
by position in `services.json`; anything past nine falls back to 1×1.

### Work gallery has three modes, not two

- **Pinned** (≥1024px, motion allowed): sticky viewport, horizontal track driven
  by vertical scroll, two-column cards.
- **Carousel** (<1024px): scroll-snap, single-column cards.
- **Vertical list** (`prefers-reduced-motion`, any width): a plain two-column
  grid, per `docs/05-motion.md`.

The middle mode used to serve reduced motion too, which squeezed the two-column
card into 540px and wrecked the headline.

Project covers are exactly 16:10 and are rendered in a 16:10 box, so no device
mockup is ever cropped; the card is sized around the cover rather than the
reverse.

### Service illustrations are not mirrored in RTL

They are abstract UI, and `docs/07-tech.md` says not to mirror media. A browser
frame with its controls flipped reads as a bug, not as localisation.

### Screenshot script scrolls in 320px steps

0.75-viewport jumps outran the IntersectionObserver and captured whole sections
mid-reveal, which looked like a rendering bug and was not one.

---

## Phase 3 — Other pages

### The localized 404 needs a catch-all route

`app/[locale]/(site)/not-found.tsx` only renders when something inside that
segment calls `notFound()`. An unmatched path like `/en/nope` matches no route
at all, so Next fell back to its own bare 404 — no nav, no footer, no WhatsApp
route out. `app/[locale]/(site)/[...rest]/page.tsx` exists solely to call
`notFound()`, which puts the visitor on ATHR's 404 inside the full shell.

### `/work` is server-rendered, everything else is static

The filters are reflected in the URL query (`?service=…&sector=…`) so a filtered
view can be shared, which means reading `searchParams` on the server. The
alternative — `useSearchParams()` on the client — needs a Suspense boundary, and
that would keep the project cards out of the prerendered HTML, which is worse
for SEO than one cheap server render. Every other route is SSG.

### The contact page has no contact band

`docs/04-pages.md` says every page ends with the contact band. On `/contact`
that would be the same three cards twice on one screen, so it is left off. The
page itself is the contact band, and it still carries `data-conversion-zone`
so the floating button gets out of the way.

### Case-study results size their own columns

Three results in a four-column grid left an empty quarter under a full-width
rule. The column count now follows the number of results.

### Contact form: WhatsApp is the fallback, and it carries the draft

With no `SUPABASE_*` or `RESEND_*` configured — and after any delivery failure —
the submit button becomes "Send on WhatsApp" and opens WhatsApp with every field
already typed folded into the message. The form never silently fails.

The draft is mirrored into state on change rather than read from the form
element at render time, so the href is a pure function of state.

Protection is a honeypot field (hidden from people and from assistive tech; a
filled one returns a fake success and drops the lead) plus an in-memory
per-IP limit of 5 submissions per 10 minutes. That is per-instance, which is
enough against a script — swap in Upstash Redis if the site ever needs more.

### The QR code is generated at build time

`qrcode` runs on the server and the SVG is inlined into the page, so the
contact page ships no QR library to the browser.

### Team photos are constellations until real ones exist

Each person's seeded constellation stands in for their portrait, marked with a
`TODO` in `about/page.tsx` and listed in the placeholder report.

---

## Phase 4 — Polish & ship

Performance was the whole of this phase. The short version: **almost all of the
animation moved from JavaScript to CSS**, which took the home page from 220KB
to 170KB of gzipped first-load JS and mobile Lighthouse from 88 to 96.

Everything below was measured, not assumed. `npm run lighthouse -- en,ar 3 mobile`
reports the median of three runs, because a single run on a busy machine varies
by ±5 points.

### Anything that starts hidden delays LCP

This was the single biggest finding, and it cost several attempts.

`motion` serialises its `initial` state into the server HTML, so a hero built
from `<motion.p initial={{opacity: 0}}>` is **invisible in the delivered HTML**
and stays that way until hydration. The browser will not count an element it
cannot see, so LCP waited for JavaScript: **3157ms of render delay, 87% of LCP**,
on a page whose First Contentful Paint was 923ms.

Converting the hero to CSS keyframes helped but did not fix it — a masked line
reveal hides the text just as effectively, and its transform stalled behind
hydration because a clipping ancestor kept it off the compositor.

So the hero's copy now carries **no entrance animation at all**. It paints on
the first frame. The signature entrance moved to elements that can never be the
LCP candidate: the nuqta stamps in, the product stack assembles back to front,
and the trace draws across the foot of the band.

This is a deliberate departure from the line reveal in `docs/05-motion.md`, for
the hero only. Below the fold, display headings still reveal on scroll.

### `NO_LCP` — the inner pages painted nothing at all

The same class of bug as the hero, found late and worth calling out separately.

Every inner page opened with a `PageHero` whose eyebrow, headline and lead were
all `<Reveal>` wrappers. Those start at `opacity: 0`, so the **entire first
screenful was invisible in the delivered HTML** and Lighthouse reported
`LanternError: NO_LCP` — it could not find a single element that had painted.
Those pages scored 0 for performance.

The rule now: **a page hero never animates in.** `PageHero`, the About hero, the
Contact hero and the legal title block all render plainly. Below the fold,
reveals stay.

`/about` went from unmeasurable to 96, `/services` to 97, `/contact` to 97 and
`/privacy` to 99.

### Almost all animation is CSS now

`components/motion/RevealMount` is one IntersectionObserver for the whole page.
It flips `data-reveal-in`; CSS does the rest. Sections that were client
components purely to fade in — the trust strip, services bento, why grid,
industries, contact band, service rows, page heroes — are **server components**
again.

Scroll-linked effects use `src/lib/scroll.ts` (about sixty lines): read on
scroll, rAF-throttled, write one custom property, let CSS transform. That covers
the product stack's parallax and fan-out, the pinned gallery's translateX and
the process trace's scaleY.

The nine service illustrations were ~70 motion components hydrating on the home
page. They are now plain SVG with two custom properties each: `--a` for the
first play and `--ar` for the hover replay, because swapping `animation-name` is
what restarts an animation in CSS.

The animation library now loads only on `/work` and the case study, where the
filter layout animation and the lightbox genuinely need it.

**Measured first-load JS, gzipped:**

| Route | Before | After |
| --- | --- | --- |
| `/ar`, `/en` | 220KB | **170KB** |
| `/about`, `/contact` | 220KB | **158KB** |
| `/work`, case study | 220KB | 213KB |

The budget in `docs/07-tech.md` is 180KB for the home page.

### Two optimisations that measured worse and were reverted

Both are recorded because the instinct to re-apply them is strong.

**`experimental.inlineCss`.** Inlining the stylesheet removes a render-blocking
request, but the stylesheet is big enough that it added ~180KB to the document
and pushed FCP from 923ms to 1346ms. Median performance dropped from 92 to 88.

**Preloading the Arabic fonts.** `/ar` is the default locale and its LCP element
is Arabic body text, so preloading Plex Arabic looked obvious. It made both
locales worse — mobile LCP went 2.84s → 3.37s on `/en` and 3.05s → 3.38s on
`/ar` — because 86KB of fonts compete with the HTML, CSS and JS on a throttled
connection. `font-display: swap` wins.

The Arabic 500 and 700 faces were dropped; nothing used them.

### Measured results

Median of three runs, production build, against `next start`:

Mobile, as `perf / a11y / best practices / SEO`:

| Route | `/en` | `/ar` |
| --- | --- | --- |
| Home | 96 / 100 / 100 / 100 | 95 / 100 / 100 / 100 |
| Services | 97 / 100 / 100 / 100 | — |
| Work | 95 / 100 / 100 / 100 | 93 / 100 / 100 / 100 |
| About | 96 / 100 / 100 / 100 | 97 / 100 / 100 / 100 |
| Contact | 97 / 100 / 100 / 100 | — |
| Privacy | 99 / 100 / 100 / 100 | — |

Desktop is **100 / 100 / 100 / 100** on both locales, LCP ~650ms, TBT 0ms.

Home page mobile: CLS 0, TBT 32–36ms, FCP ~930ms, Speed Index ~930ms.

`/ar/work` sits at 93 — it is the heaviest route (the filter layout animation
and the lightbox still use the animation library) with Arabic text waiting on a
font that is deliberately not preloaded. On Vercel's CDN, with Brotli and no
competing local processes, every route should sit higher; the numbers to trust
after deploying are the field data, not this local simulation.

### Accessibility findings that only appeared once content was visible

Moving reveals out of `opacity: 0` exposed three real issues that had been
hidden from the audit: insufficient contrast on a link, nav and footer targets
under the 24×24 minimum, and the theme toggle's `aria-label` not containing its
visible text (WCAG 2.5.3). All three are fixed; the toggle now takes its
accessible name from the visible word with the rest of the sentence after it.

A `<noscript>` rule reveals anything still at `opacity: 0`, so the site is
readable with JavaScript off.

### OG images: two things `next/og` cannot do

**It cannot read WOFF2 or variable fonts.** The brand ships Instrument Sans as a
variable WOFF2. `npm run og:fonts` decompresses the three faces the share images
need and instances Instrument Sans to a static weight 600. The output is
committed to `assets/og-fonts/` — outside `public/`, so it is never served to a
browser — which means deploys never need Python. The instancing step needs
Python and fontTools; the decompression does not.

**It has no bidi engine.** `direction: rtl` is a no-op in satori and Arabic words
lay out left to right, so a sentence reads backwards. The Arabic share images
reverse the word order to compensate. That is safe for runs of Arabic; a string
mixing Arabic with a Latin phrase of more than one word would place that
phrase's words backwards. Worth checking when real Arabic project copy lands.

Also: per-project images are a route handler at `/og/work/[slug]`
(`src/app/og/work/[slug]/route.tsx`), not an `opengraph-image` file. The file
convention under `[locale]` produced `/en/work/…/opengraph-image-<hash>` URLs,
which only resolved through a redirect — not what a share preview should rely
on. The proxy matcher skips `/og/`.

### The localized 404 needs a catch-all

`not-found.tsx` only renders when something inside its segment calls
`notFound()`. An unmatched path matched no route at all, so Next fell back to
its own bare 404 — no nav, no footer, no WhatsApp. `[...rest]/page.tsx` exists
only to call `notFound()`.

### Dependencies added in this phase

| Package | Why | Scope |
| --- | --- | --- |
| `server-only` | Keeps the lead backends out of any client bundle | dependency |
| `wawoff2` | WOFF2 → TTF for the OG images | dev |
| `lighthouse`, `chrome-launcher` | `npm run lighthouse` | dev |

`fontTools` (Python) is needed only to regenerate `assets/og-fonts/`.

---

## Trust, portfolio and homepage update

### The home page leads with proof

New order: hero → client logos → selected work → what we build → platforms →
client work → process → contact band. `WhyAthr` and `Industries` came off the
home page (the components are kept). Both explained ATHR; the brief for this
update was to show evidence instead of explaining.

### The placeholder stats are gone

The strip under the hero showed "40+ projects shipped", "1 h average reply" and
similar — all marked PLACEHOLDER. Invented numbers under a "trusted by" heading
undo the trust the logos build, so `trust.stats` was removed from the content
and the schema instead of being left for launch.

### Client logos are masks, and every logo links to its case study

The originals come from each client's live site, in every format. `scripts/make-client-logos.mjs`
reduces each to an alpha mask that the strip paints with `--ink-muted`: one colour, both
themes, no brand hex in a component. `content/trust.json` ties each logo to a project and
the name is read from that project, so a logo can't appear without real work behind it.
Dr. Yussif and Al Nokhba have no logo asset, so they aren't in the strip.

### Platforms: six, and only ones the work runs on

WhatsApp (the CRM), Google, Salla (Albadar Oud and Abu Mayar run on it), WordPress
(dryussif.id, fateenksa.com), Hostinger and Vercel (Future Earth, Retal, ELITE GPT).
Google and Hostinger are included because the owner named them. The marks are
Simple Icons (CC0), not a new dependency: six SVG files.

### Fateen is shown as one client with four projects

The main site, plus the landing pages for its web development, real estate and ads
lines. They share `"group": "fateen"` and the home page shows them together with the
Fateen mark. One returning client is stronger proof than four unrelated tiles.
Fateen's own campaign figures on the real estate page are Fateen's results. They
are never shown as ATHR results.

### Project priority and honesty labels

Featured, in order: Future Earth, WhatsApp CRM, Al Nokhba, Dr. Yussif. Retal Residence
is no longer featured or spotlighted. It's still listed under "More client work" and on /work.
WhatsApp CRM is labelled **in-house product**. Its screens come from the kit that renders
the app from its own source, with a demo tenant, and the case study says so.
The eye clinic system is now credited to **Al Nokhba** as client work, on the owner's word.
Its cover stays a brand diagram until the clinic's screens arrive.

### Round two: the logo strip, the case-study cover and the theme button

- **Logo strip without lines.** The bordered grid read as a table. It's now a centred
  label over one row spread across the measure. Below 1024px it's the page's one allowed
  marquee, which stops under reduced motion. Each logo carries an optical `scale` in
  `content/trust.json`, so thin wordmarks and dense badges carry the same weight.
- **Case-study cover in the measure.** The cover ran at 100vw with ±40px parallax
  overscan and a 2:1 crop, so a 1600px image was upscaled and cropped on wide screens.
  It now sits in the 1280px container at its exact 16:10, with the cut, across the seam
  of the graphite band, and is served at quality 90 (`images.qualities: [75, 90]`).
  All live-site and brand covers are now exported at 2400×1500.
- **Gallery at full measure.** It moved out of the text column into its own band:
  borderless images, one wide then a pair.
- **WhatsApp CRM uses its marketing renders.** The cover is `behance-cover` (product
  name over desktop and phones); the gallery is the device showcases and the platform
  overview. Renders built around headline metrics ("68% handled by AI" and similar)
  were left out. That data is demo data and would read as a claim.
- **Theme button in the nav.** An icon button (moon on paper, sun on carbon) next to
  the call button, on every breakpoint. Both glyphs render and `dark:` picks one, so it
  never flips after hydration.
- **Brand fonts were not loading anywhere.** next/font set `--font-latin` / `--font-ar` /
  `--font-code` on `<body>`, but the stacks built from them (`--font-sans` and the rest)
  are declared on `:root`, where those variables don't exist, so every stack was
  invalid. English fell back to the system sans and Arabic to Times New Roman.
  The font-variable classes now sit on `<html>`.

### Round three: capabilities, platforms, client rows

- **Capabilities on one line.** Twelve items can't fit one row at a readable size, so
  they drift in a slow marquee that pauses on hover, as `docs/03-home-page.md` allows
  ("one row of chips in a slow marquee, or simply wrapped"). Under reduced motion the
  marquee is replaced by the wrapped, still list.
- **Platforms in colour, no grid.** Large marks in each brand's own colour: the Google
  mark is its four-colour G, and Vercel follows the ink so it flips with the theme.
  Salla, WordPress and Hostinger get a lighter tint on carbon where the brand colour
  would disappear. Each mark is named with what the platform is ("E-commerce stores",
  "Hosting & domains"), with no card backgrounds, per the no-icon-card rule. Colours
  live in `content/trust.json` as platform data, not in components.
- **Client rows carry a thumbnail** of each project's cover.

### Round four: four more clients, categories, Shopify

- **Four new client projects** from their live sites: Bayan (gold bullion factory, company
  website), Fancy Stays (Dubai holiday homes, booking website), Aatak United (Jeddah
  residential project, landing page) and Basmah Jomah (book launch, landing page).
  Covers are captured with `scripts/capture-covers.mjs`, and logos go through
  `scripts/make-client-logos.mjs`, which gained a `light` mode for a light mark on a dark tile.
  Only facts on the sites themselves are used. Stacks are left empty where they aren't known.
- **Projects carry a `category`** (company website, online store, booking website,
  landing page…). "More client work" on the home page groups by it: a label column and
  small thumbnail tiles, with no lines. Business owners look for work like theirs by type,
  not by client name.
- **The logo strip is a marquee at every width again.** Eleven logos don't fit one quiet
  row. It's the spec's one allowed loop: slow, paused on hover, and replaced by a wrapped,
  still row under reduced motion.
- **Shopify added** at the owner's request. **Vercel** is shown as its circular badge (the
  triangle in a disc), which reads as the Vercel mark; the bare triangle didn't.
- **Covers change under a new filename.** The image optimiser and browsers cache by URL,
  so the WhatsApp CRM cover kept showing the old inbox screen after the file was swapped.
  It now lives at `whatsapp-crm-cover.jpg`. Replace a cover under a new name, not in place.
- **Fateen's main-site cover is a brand shot.** `capture-covers.mjs` gained `hide` (remove)
  and `conceal` (invisible, space kept) selectors. The site's navbar, floating buttons and
  hero title, tagline and buttons are left out, so `fateen-mark.jpg` shows the logo alone.

### Round five: colour logos and counts

- **Client logos in their own colours.** `make-client-logos.mjs` now splits each logo
  into a colour layer (saturated pixels) and an ink mask (neutral pixels), sharing one box.
  The page paints the ink with `--ink` and lays the colour on top, so Fateen's dark
  lettering or Car Test's white "CAR" follows the theme while the brand colours stay.
  Badges with their own background (Abu Mayar) are kept whole.
- **The counts under the logos are the owner's figures** (20+ projects, 10+ businesses,
  7+ industries, 5+ years), kept in `site.*.json → trust.stats`.

### The WhatsApp brief

- **A form that writes the WhatsApp message.** The contact band at the foot of every
  page now has a brief. The visitor picks one or more services as chips (the same
  plain-language list as "What we build", plus "Not sure yet"), adds a name and
  optionally a business name and a line of detail, and "Send on WhatsApp" opens
  WhatsApp with the message already written, plus the page it came from. No backend
  and nothing stored. The message templates live in `site.*.json → brief`, and the
  service list is joined with `Intl.ListFormat`, so it reads "A, B and C" / «أ وب وج».
  The `/contact` page keeps its full form.
- **Status colours inside dark bands.** `band-carbon` and `band-graphite` now also
  redeclare `--danger`, `--success` and `--warning` with the dark-theme values. Otherwise
  a form error in the band used the light-theme red on carbon and failed contrast.
- **The breathing nuqta** (`BreathingNuqtas`, on the services page header): the three
  dots of ث from the logo, with the upper vermilion nuqta fading out and back, then a
  quick electric flicker, and a soft glow in step. It's the site's second loop, next to
  the logo marquee, and the owner asked for it. It animates opacity only and is still
  under reduced motion.
- **The hero mark**: the same breathing nuqtas, small, in the hero's upper trailing corner
  (top-left in Arabic, top-right in English), replacing the constellation the lattice
  used to light there. It breathes and does nothing else. A pointer-following version
  was tried and dropped at the owner's request.

### One tap from a service to a conversation

- **The hero's second button is "Order your service"** (اطلب خدمتك). It jumps to the
  WhatsApp brief in the contact band (`#order`), where the visitor picks services and
  sends a ready message. A row of ready-made service choices in the hero was tried and
  removed at the owner's request.
- **Each service tile has "Request on WhatsApp"**, prefilled with that service. The tile
  still opens its service page through a stretched link on the title; the button sits
  above it.
- Both are outlined (`WhatsAppRequest`), so the vermilion stays with the one primary
  action. Clicks are tracked as `service_request` with the service name.
- **The hero follows light and dark.** Phase 1 kept it carbon in both themes; at the
  owner's request it now uses the page theme (`bg-surface`). The nav no longer forces
  carbon tokens while over it. The lattice draws in `--ink` heating to `--vermilion`,
  read from the tokens and redrawn when `data-theme` changes, with slightly stronger
  resting dots on paper. The contact band stays carbon.
- **Light-mode hero is clean paper**: no lattice at all, and no animation loop. Randomly
  lit ث patterns were tried and removed at the owner's request. Dark mode keeps the grid
  and pointer trail.
- **Service illustrations are always live** (`IlloLoop`, home services section): each
  tile's illustration rebuilds every ~5s while on screen, staggered across the tiles. It
  reuses the hover-replay twins, so there's no library and no re-render. It pauses off
  screen and in a hidden tab, and does nothing under reduced motion. A further loop,
  at the owner's request.

---

## Direction change — TRACE, for US businesses

The owner renamed the studio **TRACE**, retargeted it at US clients and asked to
keep the identity exactly as it is. The full brief is `docs/00-direction.md`;
these are the choices made inside it.

### Decided with the owner

- **English only.** `/ar` and the language switch are gone. The `[locale]`
  segment and next-intl stay, with `locales: ['en']` and `localePrefix: 'never'`,
  so URLs are `/work`, not `/en/work`, and a second language can return without
  restructuring. Old `/en/…` links redirect.
- **Book a call first, email second.** WhatsApp and phone remain, secondary.
- **Client work anonymised, not deleted.** Every delivered client was Saudi or
  Gulf. Deleting them would have left the Work page with three in-house products
  and six concepts; anonymising keeps the proof of delivery while removing the
  names, logos, countries, live links and site screenshots.
- **"USA · Cairo"** — no US city is claimed.

### The wordmark

Built the same way as ATHR's: Instrument Sans at 600, outlined, +36 tracking plus
the font's own kerning (T–R −8, A–C −46). The nuqta cluster keeps its size, gap
and height above the cap line, and is **centred on the apex of the A** — the brand
book already reads the symbol as "the apex of the A", and the A is the middle of
the word. The symbol, favicons and app icons are unchanged.

### The trust strip without logos

With no client logos to show, the marquee under the hero now runs the written
commitments (NDA, code ownership, fixed price, two-week cadence, US hours, stop
any time). For a US buyer weighing an offshore studio these answer the real
objections better than unfamiliar logos would. The counts stay.

### Why TRACE, and no testimonial

`WhyAthr` existed but was never mounted. It is now `WhyTrace`, on the home page
after Process, with six commitments a contract can hold. Its placeholder
testimonial was removed rather than shown — an invented quote on a site built to
earn trust is the one thing that could undo it.

### Product screens, covers and share images are generated

The ATHR screens carried the old logo, SAR, Riyadh routes and Arabic. They are
now rendered from `design/reference/pages/*.html` (edited to US demo data and
the TRACE logo) by `scripts/render-ui.mjs`; concept covers by
`scripts/make-concept-covers.mjs`; client diagram covers by
`scripts/make-brand-covers.mjs`, each with the project's own constellation; share
images by `scripts/make-og.mjs`. Nothing is retouched by hand.

### The Arabic webfont is no longer loaded

Nothing on the site renders Arabic. IBM Plex Sans Arabic stays in `public/fonts/`
for brand material. The RTL rules in `globals.css` are dormant, not deleted —
they cost nothing and keep a second language possible.

### Proxy matcher fixed

The matcher was `'/((?!api|_next|_vercel|.*\..*).*)'` in a plain JS string, where
`\.` is just `.` — so the lookahead excluded every path but `/`. It never showed
while every route carried `/ar` or `/en`; with unprefixed URLs nothing but the
home page resolved. It is now `\.`.

### Removed

`qrcode` (the WhatsApp QR on the contact page), the client-logo pipeline
(`assets/clients-src/`, `public/clients/`, `make-client-logos.mjs`), the live-site
cover capture (`capture-covers.mjs`) and every client screenshot, and the Salla
platform mark.

### Named clients and showcase slides (revision)

The owner chose five clients to show by name, with their logos: Future Earth
Energy, Fateen (all four projects), Car Test, Fancy Stays and Retal Residence.
The other client projects are removed. The client-logo strip is back above the
written-commitments marquee, and case studies show the client's logo under
"Their mark".

The owner asked for visuals that look like real, working products — the WhatsApp
CRM renders as the bar — instead of plain cards. Each project now has 2–4
showcase slides: genuine captures of the live site (`scripts/capture-sites.mjs`)
set in browser and phone frames on the brand grounds
(`scripts/make-showcases.mjs`). Nothing inside a frame is mocked. Fateen, Car
Test and ELITE GPT are Arabic-only sites, so their screens are Arabic — that is
the real work. Future Earth is captured in English (`/en`). Car Test's mobile
view could not be captured (the site timed out), so it has desktop slides only.

LamaBooking's client app was never published (the repo's `client` folder is an
empty submodule pointer), so there is no real screen to show. Its slides show the
real backend instead — the Hotel model, every route with its guard, the
availability update and the admin check, and the architecture — taken verbatim
from the repository (`assets/captures/lamabooking/`).

The diagram covers (`make-brand-covers.mjs`) are gone with the anonymised work.

### Home page in English only; Car Test as a logo; no horizontal track (revision)

- **Nothing Arabic on the home page.** Future Earth is recaptured from its English
  site, fe-ksa.com/en, with its Arabic language switch hidden in the capture. The
  "One client. Four projects." section (Fateen, whose sites are Arabic-only) is
  off the home page; Fateen's projects stay on /work. Home cards show the sector,
  not the country, and capability chips say "Bilingual", not "EN / AR".
- **Car Test is a logo only.** Its project is removed; the logo stays in the
  strip without a link (`trust.json` clients may carry a `name` instead of a
  `project`).
- **The stats panel is inverse** — carbon on paper, paper on carbon — so it
  stands apart from the page in both themes.
- **Selected work no longer scrolls sideways.** The pinned horizontal track and
  the mobile carousel are replaced by a vertical stack of large case cards (cover
  beside the story on desktop), each rising in once. The component is now a
  server component.

## /bail-bonds landing page

- **The demo products look real, in their own colours.** The fictional agency's
  site (new and 2011 versions) and the maps app keep their own palettes and
  type in both themes, like real products do. The values live in scoped classes
  in `globals.css` (`.mock-ironwood`, `.mock-old`, `.mock-gmaps`), so the
  components still read variables. TRACE tokens stay in charge of everything
  around the mocks.
- **Photos only inside the client mock.** The no-stock-photo rule is about
  TRACE's own pages. The Ironwood site uses a courthouse, an agent portrait and
  a gavel (from the bail-bonds reference project), because a real agency site
  would. They never appear outside a mock.
- **The before/after handle sweeps by itself** while on screen and untouched,
  every few seconds, so visitors who never drag still see the change. The first
  touch, click or key press stops it; reduced motion never starts it. This is
  the owner's request and the one exception to "animate once" on the page.
- **No third-party logos in the maps screen.** It follows the app's layout and
  colours; the map is drawn in SVG, not a tile.

## Website assistant

- **Gemini over REST, no SDK.** The owner supplied a Gemini key. Calling the
  REST endpoint from one route handler (`src/app/api/chat/route.ts`) adds no
  dependency and nothing to the browser bundle.
- **It knows only what the site says.** The system prompt is built from
  `content/*.json`; PLACEHOLDER answers are filtered out, and the rules forbid
  prices, ranges, deadlines and anything not in the content. Concepts must be
  called concepts. Every conversation is steered to the free call first,
  email second — WhatsApp and phone only if asked.
- **Action tags instead of tool calls.** The model ends a reply with
  `[[book]]`, `[[project:slug]]` and similar; the panel draws them as cards,
  and unknown slugs are ignored. Simpler to stream than function calling, and
  the model can't invent a link — slugs resolve against the real catalogue.
- **Lazy panel.** Only the launcher ships with the page; the panel (~12KB gz)
  loads on first hover, focus or click.
- **Placement.** The launcher takes the bottom corner; the floating Book-a-call
  button moved up above it (`bottom-24`) and stays the vermilion action. On
  mobile the launcher rides above the Book + Email bar.
- **Failure ends at the call.** Busy models fall through to the next; an answer
  cut off mid-stream ends in `[[interrupted]]`; every error shows the booking
  card. Rate limit: 30 messages per IP per 10 minutes, in memory.
- **The conversation lives in sessionStorage** — a reload keeps it, a new visit
  starts clean, and nothing is stored on our side unless the visitor sends
  the lead form.

## Bail bonds: TRACE Bail product and the Ironwood website concept (2026-10-08)

- **TRACE Bail** (`trace-bail`, in-house product, *in development*) is the bail agency portal and agent app already drawn in `saas-dashboard.html` / `mobile-app.html`. It is shown with the fictional Ironwood agency and carries no results — no agency uses it yet.
- **Ironwood Bail Bonds** (`ironwood-bail-bonds`, concept) is a complete, working website at `public/demos/ironwood-bail-bonds/index.html`, linked from its project page as "Open the working demo" (new `links.demo`). The demo shows a concept notice at the top; the captures hide it because the portfolio labels the project as a concept. Its stats describe the design (one tap to call, two languages, 24/7), not invented outcomes.
- Photos in the demo are from Wikimedia Commons, public domain or CC BY — sources, authors and licences in `public/images/bail/site/CREDITS.json`. CC BY requires attribution if the demo is published; keep the credits file with it.
- The other concepts (Ridgeline, Clearwater, Harbor & Main) had started showing the bail screens, because they shared the product PNGs. They now use their own freight screens (`freight-dashboard.html`, `freight-mobile.html`, restored from c741e24) with a US name (Megan) in place of Sara. `render-ui.mjs` renders both sets.
- Pipeline: `npm run dev` → `node scripts/capture-sites.mjs ironwood` → `node scripts/make-showcases.mjs ironwood`; `node scripts/render-ui.mjs` → `node scripts/make-concept-covers.mjs` for the product and concept covers.

## Technical SEO and the Trace Studio entity (2026-10-08)

- **Name.** The written company name is **Trace Studio** (titles, `og:site_name`, footer ©, About copy, manifest, JSON-LD); `alternateName` is "Trace". The logo stays the TRACE wordmark. Several unrelated companies use "TRACE Studio", so the name is always paired with the category — *Digital Products, Websites & Software* — in the home title, the hero h1 and the structured data.
- **Home h1.** The hero eyebrow ("Trace Studio ◆ Digital products, websites & software") is the `<h1>`; the display line "Every business leaves a mark." is a `<p>` with the same classes. Nothing moved or changed size, and nothing is hidden.
- **One origin, not an env var.** `SITE_URL` is fixed to `https://trace-studio.tech` in `src/lib/site.ts`. Before, an unset `NEXT_PUBLIC_SITE_URL` silently produced `trace.studio` canonicals. Preview builds point at production, which is correct; Vercel already sends `noindex` on preview URLs.
- **Canonical per page, not in the layout.** The root layout sets defaults only (title, description, site name, icons). Each page sets its own canonical and `og:url`, so the 404 and the styleguide no longer claim to be the home page.
- **Structured data.** One `@graph` on the home page: `WebSite` + `Organization`, linked by `@id`. Project, breadcrumb and bail-bonds markup refer to the Organization by `@id`. Dropped `ProfessionalService` (a LocalBusiness type that expects an address) and the placeholder phone number. `sameAs` comes from `content/contact.json → social` — verified profiles only.
- **Indexing.** Sample projects (`placeholder: true`) are `noindex, follow` and left out of the sitemap; they stay on /work, labelled. robots.txt blocks only `/api/` — the styleguide's `noindex` has to be fetchable to work. The sitemap has no `lastmod`: a build timestamp on every URL is noise. `/en/*` → `/*` is now a 308.
- **Tests.** `tests/seo.spec.ts` uses `@playwright/test`, already a dev dependency — no new framework. It runs against a production build with JavaScript off, i.e. what a crawler sees.
- **One corner row, no teaser bubble.** Desktop floats a single row: [Book a call] [TRACE AI launcher]. The teaser bubble and the separately positioned Book button stacked three objects in the corner and still didn't read as an AI chat. The launcher now looks like a chat field — "TRACE AI · online", an example question, a send key — and runs through `chat.launcherPrompts` once per session (never under reduced motion). Phones show an "Ask AI" chip above the Book + Email bar.

## No WhatsApp (2026-10-08)

The owner removed WhatsApp as a contact channel. The number was still a placeholder, and Google had started showing the site's placeholder contact details in search results. Gone: the WhatsApp half of the call row (now `CallRow`, phone only), the footer link, the "Or send it on WhatsApp" route in the project brief, `whatsappHref`/`WhatsAppButton`, the `whatsapp`/`whatsappMessage` contact fields and their copy, and the icon glyph. The assistant is told there is no WhatsApp. WhatsApp still appears where it describes work — the WhatsApp CRM product, client sites with WhatsApp buttons, and WhatsApp as a platform we integrate.
