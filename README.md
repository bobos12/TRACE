# ATHR — website

The marketing site for **ATHR (أثر)**, a software studio working with businesses in
Saudi Arabia, Egypt and the Gulf.

Its job is to turn a visitor into a conversation: **WhatsApp first, phone second.**

Arabic (`/ar`, the default) and English (`/en`) are both first-class — mirrored
layout, their own type metrics, never a translation layer.

---

## Run it

```bash
npm install
npm run dev          # http://localhost:3000 → redirects to /ar
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run check` | Type-check, then lint |
| `npm run shots` | Playwright screenshots (see **Verifying** below) |
| `npm run lighthouse` | Lighthouse, median of N runs |
| `npm run og:fonts` | Regenerate the OG-image fonts (only after changing `public/fonts/`) |

Node 20+.

---

## Environment

Copy `.env.example` to `.env.local`. Every variable is optional except the site URL.

| Variable | Needed for | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, hreflang, sitemap, OG images | No trailing slash. Set it in Vercel for production *and* preview. |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Saving contact-form leads to a `leads` table | |
| `RESEND_API_KEY`, `LEADS_TO_EMAIL` | Emailing contact-form leads | `LEADS_FROM_EMAIL` must be a verified sender. |

**With no lead backend configured, the contact form still works**: the submit
button becomes "Send on WhatsApp" and opens WhatsApp with everything the visitor
typed already in the message. The form never silently fails.

The `leads` table, if you use Supabase:

```sql
create table leads (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text not null,
  company    text,
  phone      text not null,
  email      text,
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
| `content/site.en.json`, `content/site.ar.json` | Every word of the site, per locale: metadata, nav, home sections, page copy (`pages`) and interface labels (`ui`) |
| `content/services.json` | The nine services, both locales, plus each one's `visual` key |
| `content/portfolio.json` | Projects, both locales, with results, stack and gallery |
| `content/contact.json` | Phone numbers, WhatsApp number, email, hours, cities, social links |

Both locale files must have **the same shape**. Every file is validated by Zod
(`src/lib/content.ts`) at build time — a missing or empty field fails
`npm run build` rather than shipping a blank section.

### Adding a project

Add an object to `content/portfolio.json` with `en` and `ar` copy, then drop a
**2400×1500** (16:10) cover into `public/images/portfolio/`. The case-study page, the
route, the sitemap entry and the social share image are all generated from it.

Set `"featured": true` to put it in the home page's pinned gallery.

Remove `"placeholder": true` once the project is real — that flag drives the
"Sample project" badge (development builds only) and the placeholder report.

### Replacing the placeholder images

| What | Where | Notes |
| --- | --- | --- |
| Project covers | `public/images/portfolio/*.jpg` | **16:10, 2400×1500** (1600×1000 at the very least). Cards and the case-study cover are sized around that ratio, so nothing is cropped, and 2400px keeps the 1280px case-study cover sharp on retina screens. |
| Client logos | `assets/clients-src/` → `public/clients/` | Save the client's logo (any format) in `assets/clients-src/`, add the client to `content/trust.json` with the case study it links to, list it in `scripts/make-client-logos.mjs` and run it. It writes a colour layer and an ink layer (so black or white lettering follows the theme) and fills in the size. |
| Platform marks | `public/platforms/*.svg` | Simple Icons (CC0), listed in `content/trust.json`. Only add a platform the work actually runs on. |
| Al Nokhba visuals | `public/images/portfolio/eye-clinic-system*.jpg` | 2400×1500 JPGs. Replace `eye-clinic-system.jpg` (the cover), add `eye-clinic-system-2.jpg`, `-3.jpg` … and list them under `gallery` in `content/portfolio.json`. Then delete that project's `_note`. |
| Live-site covers | `public/images/portfolio/` | `node scripts/capture-covers.mjs <slug>` re-shoots one project's live site. |
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
  components/brand/        Logo, Nuqta, Constellation, Trace, Cut, AthrMark
  components/ui/           Button, Badge, Card, Field, Select, Tabs, Icon, …
  components/sections/     Hero, TrustStrip, ServicesBento, WorkGallery, Process, …
  components/illustrations/ the nine service illustrations
  components/contact/      every WhatsApp / call / email surface
  lib/                     content (Zod), contact, seo, scroll, leads, fonts
  styles/                  tokens.css, tailwind-v4.css, globals.css
content/                   all copy
design/                    the brand source: tokens, component spec, approved renders
```

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

`/[locale]/_styleguide` renders every token, type style and component in both
themes, and ends with a live list of everything still marked placeholder. It is
`noindex` and not linked from the site.

---

## Verifying

```bash
npm run check                                   # types + lint
npm run build

# against the production build on :3100
npx next start -p 3100

npm run shots -- --base=http://localhost:3100 --pages=home,work,about --themes=light,dark
npm run check:console -- "/,/work,/about"       # fails if any page logs an error
npm run check:weight  -- http://localhost:3100 "en,ar"
npm run check:overflow                          # 360→1920, both locales
npm run check:fold                              # hero CTA above the fold at 390×844
npm run lighthouse    -- en,ar 3 mobile
```

Screenshot routes are written **without a leading slash** (`work`, not `/work`) —
Git Bash on Windows rewrites a leading slash into a Windows path.

---

## Deploying

Vercel, zero config.

1. Import the repository.
2. Set `NEXT_PUBLIC_SITE_URL` for Production and Preview.
3. Add the lead-backend variables if you want the form to store or email leads.
4. Deploy.

Analytics is Vercel Web Analytics, and only mounts when `VERCEL` is set — off
Vercel its script is a guaranteed 404, so it is skipped. No cookie banner is
needed for it. Every contact click reports through one `track()` function in
`src/lib/contact.ts`; swapping to Plausible means changing that function only.

After the first deploy, check:

- `/{locale}/sitemap.xml` and `/robots.txt`
- a case study's share image: `/{locale}/work/{slug}` → its `og:image`
- that the WhatsApp button opens a chat with the **real** number

---

## Before launch

`DECISIONS.md` records the choices made where the specs left room, and why —
including the measured performance trade-offs.

**`PLACEHOLDERS.md` lists every value that must be replaced before this site
goes live.** Start there.
