# TRACE — website

The marketing site for **TRACE**, a software studio for US businesses, with its
engineering team in Cairo.

Its job is to make a US buyer trust the studio enough to talk:
**book a call first, email second.** WhatsApp and phone stay available for those
who prefer them.

English only. The identity — the nuqta, the cut, the constellation, the trace —
is the one built for ATHR; only the name changed. See `docs/00-direction.md`.

---

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run check` | Type-check, then lint |
| `npm test` | Production build, then the SEO tests in `tests/` (Playwright, JavaScript off). After one build, `npx playwright test` reruns them alone |
| `npm run shots` | Playwright screenshots (see **Verifying** below) |
| `npm run lighthouse` | Lighthouse, median of N runs |
| `npm run og:fonts` | Regenerate the OG-image fonts (only after changing `public/fonts/`) |

Node 20+.

---

## Environment

Copy `.env.example` to `.env.local`. Every variable is optional.

The canonical origin (`https://trace-studio.tech`) and the brand name used in
metadata and structured data live in `src/lib/site.ts` — not in the environment, so a preview or local build can never put a
`vercel.app` or `localhost` URL into canonicals, the sitemap or JSON-LD.

| Variable | Needed for | Notes |
| --- | --- | --- |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Saving contact-form leads to a `leads` table | |
| `RESEND_API_KEY`, `LEADS_TO_EMAIL` | Emailing contact-form leads | `LEADS_FROM_EMAIL` must be a verified sender. |
| `GEMINI_API_KEY` | The website assistant (chat in the corner) | Server-only — never `NEXT_PUBLIC_`. Needs a **paid** Gemini tier in production; the free tier allows ~20 requests a day. |
| `GEMINI_MODEL` | Optional model override | Defaults to `gemini-3.8-flash`; busy or rate-limited models fall back to `gemini-3.5-flash`, then the Lite models. |

**With no lead backend configured, the contact form still works**: the submit
button becomes "Send by email" and opens an email with everything the visitor
typed already in it. The form never silently fails.

The `leads` table, if you use Supabase:

```sql
create table leads (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text not null,
  company    text,
  email      text not null,
  phone      text,
  service    text,
  message    text not null,
  locale     text not null,
  source     text
);
```

---

## Editing content

**All copy lives in `content/`. Nothing is hard-coded in components.**

| File | What's in it |
| --- | --- |
| `content/site.en.json` | Every word of the site: metadata, nav, home sections, page copy (`pages`) and interface labels (`ui`) |
| `content/services.json` | The nine services, plus each one's `visual` key |
| `content/portfolio.json` | Projects, with results, stack and gallery |
| `content/contact.json` | **Booking link**, email, US phone, WhatsApp, hours, social links (verified profiles only — they become the footer icons and `Organization.sameAs`) |
| `content/trust.json` | The platforms shown in the "Platforms" section |

Copy is keyed by locale (`{ "en": … }`) so a second language can be added later
without reshaping the files. Every file is validated by Zod
(`src/lib/content.ts`) at build time — a missing or empty field fails
`npm run build` rather than shipping a blank section.

### The website assistant

The chat in the corner (`src/components/chat/`) answers from the same content
the pages render — `src/lib/chat/knowledge.ts` builds its instructions from
`content/*.json` on the server, so editing a service or project updates the
assistant too. Anything marked `PLACEHOLDER` is left out of what it knows.

- Its interface copy (launcher, starters, cards, lead form) is `content/site.en.json → chat`.
- Its behaviour (voice, what it may and may not say, when it offers the call)
  is the `RULES` block in `src/lib/chat/knowledge.ts`.
- Replies end in action tags — `[[book]]`, `[[lead]]`, `[[project:slug]]`,
  `[[service:slug]]`, `[[suggest:…]]` — that the panel draws as cards. Booking
  clicks go through `trackContact('booking', 'chat')`.
- Its lead form uses the contact form's pipeline (Supabase / Resend). With
  neither configured it opens an email with the conversation in it.
- Without `GEMINI_API_KEY` the panel still opens and offers the call and email.

### The booking link

`content/contact.json → booking` is the Cal.com / Calendly URL behind every
"Book a call" button. While it still contains `REPLACE`, those buttons open the
contact page instead, so nothing dead-ends.

### Project visuals are showcase slides

Every real project has a cover and a gallery of **showcase slides** — the live
site captured in browser and phone frames on TRACE grounds, in the spirit of the
WhatsApp CRM renders:

```bash
node scripts/capture-sites.mjs          # real screenshots → assets/captures/<slug>/
node scripts/make-showcases.mjs         # slides → public/images/portfolio/<slug>-cover.jpg, -shot-2.jpg …
```

Slide copy and which captures each slide uses live in `PROJECTS` in
`make-showcases.mjs`. LamaBooking's client app is not published, so its slides
show the real API source from `assets/captures/lamabooking/`.

Only clients who have agreed to be shown belong in the portfolio. Their logos are
in `content/trust.json` (built by `scripts/make-client-logos.mjs` from
`assets/clients-src/`).

### Adding a project

Add an object to `content/portfolio.json`, add the site to `capture-sites.mjs`
and `make-showcases.mjs`, and run both (or drop your own **2400×1500** cover and
gallery into `public/images/portfolio/`). The case-study page, the route, the
sitemap entry and the social share image are all generated from it.

Set `"featured": true` to put it in the home page's pinned gallery.

Remove `"placeholder": true` once the project is real — that flag drives the
concept labelling and the placeholder report.

### Images and how they are made

| What | Where | How |
| --- | --- | --- |
| Product screens (hero, concept galleries) | `public/images/ui/` | Rendered from `design/reference/pages/*.html` by `node scripts/render-ui.mjs`. Edit the demo data in the HTML, never the PNGs. |
| Concept covers | `public/images/portfolio/` | `node scripts/make-concept-covers.mjs` (after `render-ui`). |
| Project covers and galleries | `public/images/portfolio/` | `node scripts/capture-sites.mjs` then `node scripts/make-showcases.mjs`. |
| Client logos | `assets/clients-src/` → `public/clients/` | Add the logo and the client to `content/trust.json`, list it in `scripts/make-client-logos.mjs` and run it. |
| Share images | `public/og/` | `node scripts/make-og.mjs`. Per-project ones are generated at build time. |
| Logo files | `public/brand/` | `trace-wordmark*.svg`, `trace-symbol*.svg`. In code use `src/components/brand/Logo.tsx`. |
| Platform marks | `public/platforms/*.svg` | Simple Icons (CC0), listed in `content/trust.json`. Only add a platform the work actually runs on. |
| Team photos | `public/images/team/` | Portrait, 4:5. Swap the constellation in `src/app/[locale]/(site)/about/page.tsx` for a `next/image` — the `TODO` marks the spot. |

### The service illustrations

Each service in `services.json` has a `visual` key (`browser`, `phone`,
`system`, `blocks`, `chart`, `calendar`, `layers`, `nodes`, `flow`). They map to
the hand-built SVGs in `src/components/illustrations/ServiceIllustrations.tsx`.
Adding a tenth service means adding a tenth `visual` and a tenth illustration.

---

## How it's put together

```
src/
  app/[locale]/(site)/     the pages; everything is statically generated except /work
  components/brand/        Logo, BrandMark, Nuqta, Constellation, Trace, Cut
  components/ui/           Button, Badge, Card, Field, Select, Tabs, Icon, …
  components/sections/     Hero, TrustStrip, ServicesBento, WorkGallery, Process, WhyTrace, …
  components/illustrations/ the nine service illustrations
  components/contact/      every booking / email / WhatsApp / call surface
  lib/                     content (Zod), contact, seo, scroll, leads, fonts
  styles/                  tokens.css, tailwind-v4.css, globals.css
content/                   all copy
design/                    the brand source: tokens, component spec, approved renders
```

URLs carry no locale: the `[locale]` segment is internal, and `src/proxy.ts`
(next-intl, `localePrefix: 'never'`) rewrites `/work` to `/en/work`. Old `/en/…`
links redirect to the clean URL.

**Design tokens are the only source of colour, spacing, radius, type and
easing.** `src/styles/tokens.css` is a copy of `design/tokens/tokens.css`; if you
re-copy it, keep the `layer(tokens)` on its import in `globals.css` or the
responsive type scale stops working (see `DECISIONS.md`).

### Where the animation lives

Almost all of it is CSS, driven by one shared IntersectionObserver
(`components/motion/RevealMount`) that flips `data-reveal-in`. Scroll-linked
effects — the product stack, the pinned gallery, the process trace — use
`src/lib/scroll.ts`, which writes a single custom property and lets CSS
transform. The animation library is only loaded on `/work` and the case study,
where the filter layout animation and the lightbox need it.

`prefers-reduced-motion` is honoured everywhere: durations and delays collapse,
the marquees stop, the scroll-linked transforms show their end state and the
work gallery becomes a plain vertical list.

### The styleguide

`/_styleguide` renders every token, type style and component in both themes,
and ends with a live list of everything still marked placeholder. It is
`noindex` and not linked from the site.

---

## Verifying

```bash
npm run check                                   # types + lint
npm test                                        # build + SEO tests

# against the production build on :3100
npx next start -p 3100

npm run shots -- --base=http://localhost:3100 --pages=home,work,about --themes=light,dark
npm run check:console -- "/,/work,/about"       # fails if any page logs an error
npm run check:weight  -- http://localhost:3100
npm run check:overflow                          # 360→1920
npm run check:fold                              # hero CTA above the fold at 390×844
npm run lighthouse    -- . 3 mobile
```

Screenshot routes are written **without a leading slash** (`work`, not `/work`) —
Git Bash on Windows rewrites a leading slash into a Windows path.

If product screens look stale after re-rendering them, delete
`.next/cache/images` — the image optimiser caches by URL.

---

## Deploying

Vercel, zero config.

1. Import the repository.
2. Add the lead-backend variables if you want the form to store or email leads.
3. Deploy.

Analytics is Vercel Web Analytics, and only mounts when `VERCEL` is set — off
Vercel its script is a guaranteed 404, so it is skipped. Every contact click
reports through one `track()` function in `src/lib/contact.ts` (channels:
`booking`, `email`, `whatsapp`, `phone`, `form`); swapping to Plausible means
changing that function only.

After the first deploy, check:

- `/sitemap.xml` and `/robots.txt`
- a case study's share image: `/work/{slug}` → its `og:image`
- that "Book a call" opens the **real** booking page

---

## Before launch

`DECISIONS.md` records the choices made where the specs left room, and why —
including the measured performance trade-offs.

**`PLACEHOLDERS.md` lists every value that must be replaced before this site
goes live.** Start there.
