# 04 — Other pages

All pages exist in `/ar/...` and `/en/...`. Every page ends with the **Contact band** (from the home page), and the floating WhatsApp button / mobile contact bar are global.

## Sitemap

| Route | Page | Notes |
| --- | --- | --- |
| `/[locale]` | Home | `docs/03-home-page.md` |
| `/[locale]/services` | Services index | All 9 services |
| `/[locale]/services/[slug]` | Service detail | Generated from `content/services.json` |
| `/[locale]/work` | Portfolio index | All projects, filterable |
| `/[locale]/work/[slug]` | Project detail | Generated from `content/portfolio.json` |
| `/[locale]/about` | About ATHR | Story, the name أثر, values, how we work |
| `/[locale]/contact` | Contact | WhatsApp / Call first, then the form |
| `/[locale]/privacy`, `/[locale]/terms` | Legal | Simple text pages (draft copy, marked for legal review) |
| `not-found` | 404 | Constellation with one missing nuqta, "This page left no trace." + links home and WhatsApp |

## Services index

**Hero (paper):**
- Title "Software solutions, built around your business." (ends in a nuqta).
- To the side, a large animated **constellation** assembling from nuqtas.

**Service list:** full-width rows, one per service.
- Each row: number (mono), title (`display-md`), the one-line description, deliverable chips, and the service's mini-illustration (reuse from the home bento).
- On hover (desktop), a row expands slightly and the illustration plays.
- Each row links to its detail page.

**Mid-page CTA:** "Not sure which one? Describe the problem on WhatsApp."

## Service detail

1. **Hero:** eyebrow `SERVICE ◆ 03`, title, line, primary WhatsApp CTA (context: the service name), and the illustration large.
2. **What you get:** deliverables as a ruled list with nuqta bullets.
3. **How it works for this service:** reuse the process timeline.
4. **Related work:** projects from `portfolio.json` whose `services` include this slug (cards). If there are none, hide the section.
5. **FAQ** (optional, 4–6 questions, accordion). Keep the question slots in content, marked placeholder.
6. **Contact band.**

## Portfolio index — `/work`

**Hero:** "Each project carries its own mark." To the side, a grid of every project's constellation; hovering one highlights its card below.

**Filters:** chips for **service** and **sector**.
- Instant client-side filtering.
- Animated layout (Motion `layout`).
- Filters are reflected in the URL query.

**Grid:** 2 columns on desktop (1 on mobile), large cards.
- Cover (16:10, cut corner on hover), client + sector + country eyebrow, title, and the first two results.
- Hover:
  - The cover scales from 1.00 to 1.03.
  - A dark overlay slides up with "View project →".
  - The card's constellation lights up.

**End:** "Your project could be next" + WhatsApp CTA.

## Project detail — `/work/[slug]` (case study)

The structure follows `design/reference/pages/case-study.html` (renders in `design/reference/renders/case-study-*.png`).

1. **Hero (graphite band):**
   - Eyebrow `CASE STUDY ◆ SECTOR · COUNTRY` and the client constellation.
   - Title in `display-xl`, with the Arabic or English line in the other language under it.
   - A row of result numbers counting up.
2. **Cover:** a full-bleed cover image with a subtle parallax (translateY ±40px on scroll).
3. **Facts sidebar + body:**
   - Sidebar (sticky on desktop): client, services, stack, year, "their mark" (constellation).
   - Body: Challenge → What we did → Results.
4. **Gallery:** device-framed screenshots from `gallery`, in an asymmetric 2-column layout. Clicking opens a lightbox (keyboard accessible).
5. **Quote:** if present, a big pull quote with a nuqta.
6. **Next project:** a large link card with the next project's cover.
7. **Contact band**, with WhatsApp context "Saw the {client} project".

**Placeholders:** projects with `placeholder: true` show a small `Sample project` badge in development builds only (`process.env.NODE_ENV !== 'production'`). This reminds the owner to replace them.

## About

- **Hero:** "أثر means the mark that remains."
  - Tell the story of the name.
  - Show a large animated logo where the three nuqtas stamp onto ت to make ث.
  - The animation is built from `Logo.tsx` paths plus a dotless-ت outline. If you can't build it faithfully, animate the nuqta cluster alone.
- **Principles:** 4–6 short statements from `docs/brand-guidelines/01-strategy.md` (design principles and proof points).
- **Team:** 1–4 founder/lead cards, with photo slots marked `TODO: real photo`. Until photos exist, use the person's constellation (seeded from their name).
- **Contact band.**

## Contact

- **Layout:** two columns.
- **Left:**
  - Title and lead.
  - A **big WhatsApp card** (primary, with a QR code on desktop that opens the same `wa.me` link — generate the QR at build time).
  - A **Call card** with the number.
  - Email, working hours, response time and cities.
- **Right:** a short form with these fields:
  - Name
  - Company
  - Phone/WhatsApp
  - "What do you need?" (a select of the 9 services + "Not sure")
  - Message
- **Form behaviour:**
  - Server Action with Zod validation, a honeypot field and basic rate limiting.
  - It saves to Supabase (`leads` table) **and/or** sends an email via Resend, depending on which env vars are set.
  - **If neither backend is configured:** the submit button becomes "Send on WhatsApp" and opens WhatsApp with the form content prefilled. The form must never silently fail.
- **Success state:** a stamp animation on a nuqta, plus "Thanks. We'll reach out within one working hour."
