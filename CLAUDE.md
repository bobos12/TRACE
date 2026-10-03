# CLAUDE.md — TRACE website

You are building the marketing website for **TRACE**, a software studio serving **US businesses**, with its engineering team in Cairo ("USA · Cairo").

**Job of the site:** convince US companies to trust TRACE, then get them to contact us — **book a call first, email second**. WhatsApp and phone are secondary.

The brand was built as ATHR (أثر) for the Gulf; the identity is unchanged, only the name, market, language and contact funnel changed. **`docs/00-direction.md` overrides docs 01–07 and the brand guidelines wherever they disagree.**

This folder already contains the brand, the specs, the content and every asset. Build from them. Don't invent a new visual direction.

## Read before writing code (in this order)

0. `docs/00-direction.md` — **the current direction: TRACE, English only, US buyers, book-a-call first.**
1. `docs/01-brief.md` — the goal and the founder's original brief (Arabic, written for ATHR).
2. `docs/02-brand-essentials.md` — the identity rules you must follow.
3. `docs/03-home-page.md` — the home page, section by section (visual-first). **The most important document.**
4. `docs/04-pages.md` — services, work (portfolio), project, about and contact pages.
5. `docs/05-motion.md` — animation and interaction rules.
6. `docs/06-conversion.md` — CTA placement and trust signals (read "WhatsApp" as "Book a call" — see 00).
7. `docs/07-tech.md` — stack, structure, SEO, performance, accessibility and verification.

**Look at the visuals too:** `design/reference/renders/*.png` (the approved look, light and dark) and `design/reference/pages/*.html` (open them in a browser).

Full brand guidelines: `docs/brand-guidelines/` (markdown + PDF).

## Assets (already in place — use them, don't recreate them)

| Path | What |
| --- | --- |
| `public/brand/*.svg` | TRACE wordmark and symbol files. In code use `src/components/brand/Logo.tsx` (exact outlines, animatable nuqtas) |
| `public/fonts/*.woff2` | Instrument Sans (variable) and IBM Plex Mono 400/500 (loaded); IBM Plex Sans Arabic (kept for brand material, not loaded) |
| `public/icons/*.svg` | 29 icons: 1.5px stroke, square caps, 24px grid. Includes `whatsapp.svg`, `phone.svg`, `mail.svg` |
| `public/images/ui/*` | Product screens @2x (dashboard, mobile, website, case study; light + dark), rendered from `design/reference/pages/` by `scripts/render-ui.mjs`. Phones are transparent PNGs |
| `public/images/portfolio/*.jpg` | Project covers and galleries, 2400×1500 — showcase slides built from real captures (`capture-sites.mjs` → `make-showcases.mjs`), composites for concepts |
| `public/og/*.png` | Social share images (home, case study, default) — `scripts/make-og.mjs` |
| `public/favicon.*`, `apple-touch-icon.png`, `icon-*.png`, `site.webmanifest` | Favicons and PWA icons |
| `design/tokens/` | `tokens.css` (CSS variables, both themes, type classes), `tailwind-v4.css`, `tokens.json`, `figma-tokens.json` |
| `design/components-reference/` | Spec for 23 UI components: styles (`bundle.css`), props (`index.d.ts`), rules (`guidelines/`) |
| `design/reference/` | Approved page designs (HTML + PNG renders) and the live component gallery |
| `content/*.json` | All copy (English), services, portfolio, contact details (booking link first) |
| `starters/` | The original starter files. `src/` is now the source of truth |

## Non-negotiables

- **Tokens only.** No raw hex, px spacing or font names in components. Everything comes from the CSS variables / Tailwind theme.
- **Visual-first home page.**
  - Every section leads with a visual (product screens, device mockups, brand graphics, live illustrations).
  - Copy stays short.
  - No stock photos, no gradients, no glassmorphism, no emoji, no generic icon-card rows, no 3D blobs.
- **Signature elements, used exactly as specified in `docs/02-brand-essentials.md`:**
  - the nuqta — vermilion rhombus
  - the cut — a 45° chamfer
  - the constellation
  - the trace
- **Book a call and email are always reachable:**
  - Nav, hero, after services and work, the contact band on every page.
  - Floating Book-a-call button on desktop; Book a call + Email bar on mobile.
  - Booking links use `bookingHref()`, email `mailHref()`; every click calls `trackContact()`.
  - WhatsApp and phone stay available (contact band, contact page, footer) but are never the primary action.
- **English only, for a US audience.**
  - No locale in URLs (`localePrefix: 'never'`); keep logical properties so a second language stays possible.
  - US conventions: USD, US dates and phone formats, ET hours.
- **Trust without invention.** Show only clients the owner approved (with their real logos). Every screen in a showcase is a genuine capture. Never invent clients, testimonials or metrics; concept pieces stay labelled.
- **Motion is premium and restrained.**
  - Animate once.
  - Scroll-linked, never scroll-jacking.
  - Transform/opacity only.
  - `prefers-reduced-motion` fully honoured.
- **Content lives in `content/`.** Never hard-code copy.
  - Placeholder data is marked `placeholder`/`_note`. Keep those markers and list them in the final report.
- **Accessibility:** WCAG 2.2 AA. **Performance:** Lighthouse ≥ 95 in both locales.

## Working style

- Build in the phases in `PROMPT.md`.
- After each phase:
  - Run the site.
  - Screenshot the affected pages with Playwright at 390px and 1440px.
  - Look at the screenshots and compare them with `design/reference/renders/`.
  - Fix issues, then summarise what changed.
- When a spec is ambiguous, choose the option that looks more premium and converts better. Note the decision in `DECISIONS.md`.
- Don't add dependencies beyond those in `docs/07-tech.md` without noting why in `DECISIONS.md`.
- Keep `README.md` current: setup, env vars, how to edit content, how to replace placeholder images, deploy.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
