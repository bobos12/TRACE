# 03 — Home page spec (visual-first)

**Goal:** impress in the first second, earn trust in the first scroll, and make WhatsApp or a call the obvious next step.

**Visual rule:** every section leads with a visual. Text is short, and each section has one idea.

**Visual sources:**
- Real product screens in `public/images/ui/` (dashboard, mobile app EN/AR, websites — light and dark, @2x)
- Portfolio covers in `public/images/portfolio/`
- The brand's graphic system: nuqtas, lattice, cut, trace
- Animated UI illustrations you build in SVG/CSS

**No stock photography.**

**Copy:** `content/site.{en,ar}.json`, `content/services.json`, `content/portfolio.json`, `content/contact.json`. Never hard-code copy in components.

**References:**
- `design/reference/pages/home-en.html` and `home-ar.html` for the typographic system, grid and components.
- This spec is **more visual** than those references and supersedes them where they differ.

---

## Page order

| # | Section | Job | Primary visual |
| --- | --- | --- | --- |
| 0 | Nav (sticky) | Identity + always-on contact | Logo with nuqta stamp; WhatsApp button |
| 1 | Hero | Wow + who we are + contact | Interactive nuqta lattice + layered product stack |
| 2 | Trust strip | Credibility | Client logo marquee + animated stats |
| 3 | Services | What we build | Bento grid with live mini-UI illustrations |
| 4 | Selected work | Proof | Pinned horizontal gallery of large project covers |
| 5 | Process | Reduce risk | Scroll-drawn trace timeline |
| 6 | Why ATHR + testimonial | Trust | Rhombus icon grid + big quote with client constellation |
| 7 | Industries | "They work with companies like mine" | Slow chip marquee |
| 8 | Contact band | Convert | Three big contact cards on carbon |
| 9 | Footer | Close | Bilingual logo, contact, links |
| — | Floating WhatsApp + mobile contact bar | Convert anywhere | Cut-corner WhatsApp button; bottom bar |

---

## 0 · Navigation

- **Layout:** 64px tall, sticky, `surface` background.
- **Scroll behaviour:**
  - Transparent over the hero.
  - Becomes `surface` with a hairline bottom border after the hero, fading over 160ms.
  - Hides on scroll down and shows on scroll up (after 400px).
- **Left:** `<Logo variant="wordmark" height={22}/>` in EN, `variant="arabic" height={30}` in AR.
  - On first load the three logo nuqtas (`[data-nuqta]`) **stamp in** one after another (80ms apart, `stamp` preset in `starters/motion.ts`). Plays once per session.
- **Centre:** 4 links. The current page gets a nuqta marker.
- **Right, in order:**
  1. Language switch (EN ⇄ العربية) — keeps the same page.
  2. Phone icon button (`tel:`), with the number in a tooltip.
  3. **Primary:** WhatsApp button — WhatsApp glyph + "WhatsApp us" / "راسلنا واتساب", `nuqta` fill, the cut.
- **Mobile:**
  - Logo left, WhatsApp icon button and a menu button right.
  - The menu opens a full-screen carbon sheet. Links are large (`display-md`), with WhatsApp and Call as two big buttons at the bottom.

## 1 · Hero — "The Mark" (the most important section)

- **Size:** always a **carbon band** (dark), even in light theme. `min-height: 100svh`, capped at 960px.
- **Grid:** 12 columns.

**Left (columns 1–6), in order:**
1. Eyebrow `SOFTWARE STUDIO ◆ RIYADH · CAIRO`.
2. Headline in 2 lines at `display-xl` size (clamp 56px → 112px). "Every business / leaves a mark" ends with the vermilion nuqta.
3. Muted subtitle line: "We build the software that carries it."
4. Lead (`body-lg`, max 44ch).
5. **CTAs:**
   - Primary: **WhatsApp** — glyph + label, `size lg`, cut.
   - Secondary: "See our work" — ghost/outline on carbon, scrolls to #work.
6. Reassurance line (mono, small, muted): "Free 30-minute call · Reply within one working hour". Put a small pulsing success dot before it only if you wire real availability; otherwise use a static nuqta.

**Right (columns 7–12) — the product stack.** Three real screens layered in 3D space:
- A browser frame with `dashboard-dark.png` (back, largest).
- A browser frame with `website-home-en-light.png` (middle, offset down and left).
- A phone with `mobile-home-en-light.png` (front, overlapping the bottom-right).
- In Arabic, use `website-home-ar-*` and `mobile-approve-ar-*`.
- Build browser frames and the phone bezel in CSS; the images are content only.

How the stack moves:
- **Perspective:** `perspective: 1600px`. Layers at `rotateY(-14deg) rotateX(6deg)`, translated in Z by −120 / 0 / +80px. Soft shadows from the tokens.
- **Entrance:** layers slide in from 40px below and fade, back to front, 120ms apart, after the headline.
- **Pointer parallax (desktop):** layers move ±4 / ±8 / ±12px against the pointer. Spring stiffness 120, damping 20.
- **Scroll:** as the hero scrolls away, layers fan apart slightly on Z (+60px) and fade. Use `useScroll` + `useTransform`.

**Background — the nuqta lattice.** A canvas (or SVG) grid of tiny rhombi across the whole hero:
- 32px pitch, `paper` at 10% opacity.
- **Pointer trail:** dots within ~140px of the pointer scale to 1.6× and turn vermilion. They decay back over ~700ms, so moving the mouse leaves a fading **trace** — the brand idea made interactive.
- **ATHR constellation:** one cluster in the lattice (upper right, behind the stack) is permanently lit as ATHR's own mark.
- **Touch devices:** no pointer. Run a slow diagonal wave of brightness every ~6s instead.
- **Performance:**
  - Pause when offscreen (IntersectionObserver) or when the tab is hidden.
  - Cap at 60fps. Use devicePixelRatio ≤ 2.
  - Target under 2ms per frame.
- **Reduced motion:** render static, with no trail.

**Hero bottom:** a trace hairline across the band that draws in on load, ending in a nuqta at 61.8%. Below it, a small "Scroll" cue in mono.

**Mobile hero:**
- Order: text first, then the product stack as a static 2-layer composition (phone in front of the dashboard), then the CTAs.
- The WhatsApp CTA must be visible without scrolling on a 390×844 screen.

## 2 · Trust strip

- **Background:** paper (light theme) directly under the carbon hero — a crisp change of ground.
- **Logo marquee:** client wordmarks in `ink-muted`, 48px tall, slow infinite marquee (40s loop, pause on hover). This is the **one** allowed loop; stop it under reduced motion.
  - Until real logos exist, render client names as set text in a neutral style.
  - Add a `// TODO: real client logos` comment.
- **Stats:** a 4-column row of big mono numbers from `trust.stats`. Numbers count up when they enter view (800ms, once).
  - Stats are marked placeholder in the content. Keep the structure so they can be replaced or removed.

## 3 · Services — bento grid

- **Header:** eyebrow + title + lead + link "All services →".
- **Grid (desktop):** 4 columns.
  - The 4 `featured` services are large tiles (2 columns × 2 rows, or 2×1).
  - The other 5 are smaller tiles.
  - Tablet: 2 columns. Mobile: 1 column, or a swipeable row of cards.

**Each tile contains:**
- A **live mini-illustration** built in SVG/CSS from the service's `visual` key, drawn in ink/line/sand with one vermilion accent.
- The service title (`heading-3`).
- One line of description.
- An arrow link.

**Animation:**
- Tiles reveal with a 60ms stagger.
- Each illustration animates **once** when it enters view (≤1.2s), and replays subtly on hover (desktop).

**Illustrations by `visual` key:**

| `visual` | Illustration |
| --- | --- |
| browser | A browser frame whose page wireframe draws itself line by line; a nuqta lands on the CTA |
| phone | A phone whose list rows slide in; a toast stamps in |
| system | Three kanban columns; one card moves across |
| blocks | Modular blocks assembling into a shape |
| chart | Bars grow; the last bar is ink with a vermilion nuqta on top |
| calendar | A week grid; appointment slots fill |
| layers | Three stacked planes separate |
| nodes | API nodes connected by traces that draw between them |
| flow | Automation steps light up in sequence along a trace |

**Tile hover:** border goes `line` → `ink`, the tile lifts 2px, and the arrow nudges 4px (mirrored in RTL).

**Under the grid:** a centred text link with the WhatsApp glyph: "Not sure what you need? Ask us on WhatsApp →" (prefilled message with context "services").

## 4 · Selected work — pinned horizontal gallery

**Desktop (≥1024px):**
- Section height ≈ `100vh × number of projects`.
- A sticky viewport scrolls a horizontal track of the `featured` projects from `portfolio.json`, driven by vertical scroll via `useScroll`. This is **not** scroll-jacking: native scroll, just mapped to translateX.

**Each project card (≈70vw × 72vh):**
- Cover image (`next/image`, 16:10) with the cut on the top trailing corner.
- Client constellation, client name + sector + country (mono eyebrow).
- Project title (`display-md`).
- Two result numbers in mono.
- "Read the case study →".

**Motion inside the gallery:**
- The cover image scales from 1.06 to 1.0 as the card centres.
- A **progress trace** runs along the bottom, with one nuqta per project. The current project's nuqta is vermilion.

**Mobile/tablet:** vertical stack of cards, or a CSS scroll-snap carousel. No pinning.

**End of section:** "View all work" (secondary) plus a WhatsApp prompt: "Want something like this? Tell us about your project."

## 5 · Process — scroll-drawn trace

- **Layout:** four steps from `process.steps`, in a vertical timeline.
- **The trace:** an SVG path runs down the left edge (right edge in RTL). Its `pathLength` is tied to scroll progress through the section.
- **Steps:** as the line reaches each step, that step's nuqta **stamps** in and its text fades up.
- **Step visuals (desktop only):** each step has a small visual on the opposite side — a UI crop, or a simple illustration (a calendar for "Understand", a two-week sprint bar for "Build", a chart for "Launch", a key/handover for "Hand over").

## 6 · Why ATHR + testimonial

- **Why grid:** six points, 3×2 on desktop.
  - Each point: a rhombus-contained icon (build with the icon style of `public/icons/`), a title and one line.
  - Reveal with stagger.
- **Testimonial:**
  - A full-width quote in `display-md`, preceded by a vermilion nuqta.
  - The author line in mono.
  - The client's constellation large on the trailing side.
  - Marked placeholder in content.

## 7 · Industries

- One row of chips (outlined, radius-sm) in a slow marquee, or simply wrapped — your call. Reduced motion: wrapped and static.

## 8 · Contact band — the conversion moment

- **Layout:** carbon band, 128px vertical padding.
  - Left: huge headline "Tell us how your business works." ending in a nuqta, plus the supporting text.
  - Right: **three contact cards**, stacked on mobile.
- **The three cards:**
  1. **WhatsApp** — largest: vermilion (`nuqta`) fill, the cut, WhatsApp glyph, "Chat on WhatsApp", the response-time line. Opens `whatsappHref(locale, 'contact band')`.
  2. **Call** — outlined: phone icon, "Call us", and the formatted number in mono (`tel:`).
  3. **Email** — outlined, smaller.
- **Below the cards:** working hours + "Reply within one working hour", and a link to `/contact` for the form.
- **Motion:** a slow trace draws around the WhatsApp card when it enters view, once.

## 9 · Footer

- **Top row:** the bilingual logo, the tagline, and the WhatsApp + call buttons.
- **Link columns:** Services (all 9), Work, Company (About, Contact), Legal.
- **Bottom row:** cities, email, social icons, © line, language switch.

## Persistent conversion UI

- **Floating WhatsApp button:**
  - Where: bottom-end, 56×56, carbon background, the cut, WhatsApp glyph in white.
  - When: appears after the hero leaves the viewport, and hides while the contact band is in view.
  - Hover/focus: a tooltip "WhatsApp us — we reply within an hour".
  - On first appearance, one stamp animation; after that, no pulsing loop.
- **Mobile bottom bar (<768px):**
  - Appears after 40% of the hero has scrolled past, and replaces the float button on mobile.
  - A fixed 64px bar with two halves:
    - **WhatsApp** — primary `nuqta` fill.
    - **Call** — secondary.
  - Respects the safe-area inset.
  - Hides while the contact band or footer is in view.
- **Tracking:** every contact link calls `trackContact(channel, placement)` from `starters/contact.ts`.
- **Prefilled messages:** every WhatsApp link uses a prefilled message with context — the page, project or service the user was looking at.
