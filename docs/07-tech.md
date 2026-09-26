# 07 — Technical spec

## Stack

Use the latest **stable** versions at build time; check the docs of each before using an API you are unsure about.

- **Framework:** Next.js with the App Router and TypeScript (strict). Use React Server Components by default; add `"use client"` only for interactive/animated leaves.
- **Styling:** Tailwind CSS v4.
  - Import `design/tokens/tokens.css` (copy it into `src/styles/`), then `design/tokens/tailwind-v4.css`.
  - Tokens are the only source of colours, spacing, radii, type and easing. **No raw hex values in components.**
- **Motion:** the `motion` package (`motion/react`) with presets from `starters/motion.ts`.
  - Canvas for the hero lattice.
  - No three.js / WebGL — not needed, and too heavy.
- **i18n:** `next-intl` with locale routing `/ar` and `/en`.
  - `defaultLocale: 'ar'`, locale detection on.
  - `<html lang dir>` set per locale.
  - Messages come from `content/site.{ar,en}.json`.
- **Fonts:** `next/font/local` with the files in `public/fonts/`.
  - Expose the variables `--font-latin`, `--font-ar` and `--font-code`.
  - Map them into the token stacks:
    - `--font-sans: var(--font-latin), var(--font-ar), system-ui, sans-serif`
    - `--font-arabic: var(--font-ar), var(--font-latin), system-ui, sans-serif`
    - `--font-mono: var(--font-code), ui-monospace, monospace`
  - Preload only the variable Latin face on `/en` and Plex Arabic 600 on `/ar`.
- **Images:** `next/image` everywhere (AVIF/WebP), with explicit sizes and `priority` only on the hero stack. Portfolio covers are in `public/images/portfolio/`; UI screens are in `public/images/ui/`.
- **Content:** typed JSON in `content/`. Load it with `import`, and type it with Zod schemas that fail the build on bad data. Keep the content layer swappable for a CMS later (Sanity or Payload), but don't add a CMS now.
- **Forms:** a Server Action plus Zod validation, a honeypot field, and simple per-IP rate limiting. Backends are optional and configured by env:
  - `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` → insert into `leads`
  - `RESEND_API_KEY` + `LEADS_TO_EMAIL` → send an email
  - With neither set, fall back to WhatsApp (see `docs/04-pages.md`).
  - Document all env vars in `.env.example`.
- **Theme:** light (Paper) by default, dark (Carbon) available.
  - Store the choice as `data-theme` on `<html>`.
  - A no-flash inline script reads localStorage, else `prefers-color-scheme`.
  - The theme toggle lives in the footer and the mobile menu.
  - The hero and contact band are carbon in both themes.
- **Analytics:** Vercel Analytics, with events per `docs/06-conversion.md`.
- **Deploy:** Vercel. Add `README.md` instructions for local dev, env vars and deploy.

## Project structure (suggested)

```
src/
  app/[locale]/(site)/page.tsx            home
  app/[locale]/(site)/services/...        index + [slug]
  app/[locale]/(site)/work/...            index + [slug]
  app/[locale]/(site)/about|contact|privacy|terms/page.tsx
  app/[locale]/layout.tsx                 html lang/dir, fonts, theme script, nav, footer, float CTA
  app/sitemap.ts, robots.ts, opengraph-image.tsx (per page where useful)
  components/brand/                       Logo (from starters), Nuqta, Constellation, Trace, Cut
  components/ui/                          Button, Badge, Card, Tabs, Field... (spec: design/components-reference)
  components/sections/                    Hero, TrustStrip, ServicesBento, WorkGallery, Process, Why, ContactBand, Footer
  components/illustrations/               the 9 service mini-illustrations
  components/contact/                     WhatsAppButton, CallButton, FloatingWhatsApp, MobileContactBar
  lib/                                    contact.ts, constellation.ts, motion.ts (from starters/), content loaders + zod
  styles/                                 tokens.css, tailwind-v4.css, globals.css
content/                                  site.*.json, services.json, portfolio.json, contact.json
public/                                   fonts, brand, icons, images, og, favicons (already in place)
```

## Components reference

`design/components-reference/` holds the component spec for ATHR's 23 UI components:
- `bundle.css`, the exact styles, with the `at-` prefix
- `index.d.ts`, the props
- `guidelines/*.md`, the usage rules

The live gallery is `design/reference/components-gallery.html` (open it in a browser).

Re-implement the components in React + Tailwind, keeping the same look and behaviour. Don't ship `bundle.js`.

## SEO

- **Metadata:** per locale from `content/site.*.json`, plus `generateMetadata` on dynamic routes.
- **hreflang:** `alternates.languages` between `/ar` and `/en`, plus `x-default`.
- **Sitemap and robots:** `sitemap.ts` covering all locales and routes, and `robots.ts`.
- **JSON-LD:**
  - `Organization` + `ProfessionalService`, with areaServed SA, EG and AE, contactPoint and sameAs.
  - `BreadcrumbList` on inner pages.
  - `CreativeWork` on projects.
- **OG images:** in `public/og/`. Generate per-project OG images with `opengraph-image.tsx`, using the case-study template layout (`design/reference/renders/` shows the style).
- **Favicons and manifest:** already in `public/` — see `design/head-snippet.html`. Map them to Next metadata `icons` and `manifest`.

## Quality bars

- **Performance** (mobile, 4G): LCP < 2.0s, CLS < 0.05, INP < 200ms. Home page JS < 180KB gzipped for first load. Lighthouse ≥ 95 in all four categories, in both locales.
- **Accessibility:** WCAG 2.2 AA.
  - Colour pairs are already AA in both themes — keep text on the grounds each token's usage note allows.
  - Visible focus everywhere.
  - Full keyboard access, including the gallery and lightbox.
  - Correct headings and landmarks.
  - `aria-label` on icon-only buttons.
  - Reduced motion honoured.
- **RTL:**
  - Logical CSS properties only. In Tailwind: `ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`, `text-start`.
  - Mirror directional icons.
  - Don't mirror the logo, numbers or media.
  - Arabic copy never falls back to English.
- **Responsive:** 360, 390, 768, 1024, 1280, 1440, 1920. Nothing overflows horizontally at 360px.

## Verification (do this, don't just assume)

- Run the dev server and use Playwright to screenshot every page at 390 and 1440 wide, in `/ar` and `/en`, light and dark.
- Look at the screenshots and fix what's off before calling a phase done.
- Run `next build`, lint and type-check with zero errors.
- Run Lighthouse (CLI or Playwright) on the home page for both locales.
