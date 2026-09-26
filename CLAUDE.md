# CLAUDE.md — ATHR website

You are building the marketing website for **ATHR (أثر)**, a software studio serving businesses in Saudi Arabia, Egypt and the Gulf.

**Job of the site:** convince companies to trust ATHR, then get them to contact us — **WhatsApp first, phone second**.

This folder already contains the brand, the specs, the content and every asset. Build from them. Don't invent a new visual direction.

## Read before writing code (in this order)

1. `docs/01-brief.md` — the goal and the founder's original brief (Arabic).
2. `docs/02-brand-essentials.md` — the identity rules you must follow.
3. `docs/03-home-page.md` — the home page, section by section (visual-first). **The most important document.**
4. `docs/04-pages.md` — services, work (portfolio), project, about and contact pages.
5. `docs/05-motion.md` — animation and interaction rules.
6. `docs/06-conversion.md` — where the WhatsApp and call CTAs go, and the trust signals.
7. `docs/07-tech.md` — stack, structure, SEO, performance, accessibility and verification.

**Look at the visuals too:** `design/reference/renders/*.png` (the approved look, light and dark) and `design/reference/pages/*.html` (open them in a browser).

Full brand guidelines: `docs/brand-guidelines/` (markdown + PDF).

## Assets (already in place — use them, don't recreate them)

| Path | What |
| --- | --- |
| `public/brand/*.svg` | 17 logo files. In code, prefer `starters/Logo.tsx` (exact outlines, animatable nuqtas) |
| `public/fonts/*.woff2` | Instrument Sans (variable), IBM Plex Sans Arabic 400–700, IBM Plex Mono 400/500 |
| `public/icons/*.svg` | 29 icons: 1.5px stroke, square caps, 24px grid. Includes `whatsapp.svg`, `phone.svg`, `mail.svg` |
| `public/images/ui/*` | Real product screens @2x (dashboard, mobile EN/AR, websites EN/AR, case study; light + dark). Phones are transparent PNGs |
| `public/images/portfolio/*.jpg` | Project covers, 1600×1000 — **placeholders** |
| `public/og/*.png` | Social share images (home EN/AR, case study, default) |
| `public/favicon.*`, `apple-touch-icon.png`, `icon-*.png`, `site.webmanifest` | Favicons and PWA icons |
| `design/tokens/` | `tokens.css` (CSS variables, both themes, type classes), `tailwind-v4.css`, `tokens.json`, `figma-tokens.json` |
| `design/components-reference/` | Spec for 23 UI components: styles (`bundle.css`), props (`index.d.ts`), rules (`guidelines/`) |
| `design/reference/` | Approved page designs (HTML + PNG renders) and the live component gallery |
| `content/*.json` | All copy (EN + AR), services, portfolio, contact details |
| `starters/` | `Logo.tsx`, `constellation.ts`, `contact.ts` (WhatsApp/phone links + tracking), `motion.ts` (presets). Copy into `src/` |

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
- **WhatsApp and call are always reachable:**
  - Nav, hero, after services and work, the contact band on every page.
  - Floating WhatsApp button on desktop; bottom contact bar on mobile.
  - Every link uses `whatsappHref(locale, context)` and calls `trackContact()`.
- **Arabic and English are both first-class.**
  - `/ar` (default) and `/en`.
  - RTL via logical properties.
  - Arabic uses the `ar-*` type styles and is never letter-spaced.
  - Directional motion and icons mirror in RTL.
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
  - Screenshot the affected pages with Playwright at 390px and 1440px, in `/ar` and `/en`.
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
