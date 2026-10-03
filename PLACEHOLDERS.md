# Placeholders

Everything below is fake, provisional or missing, and must be dealt with before
this site goes live. Regenerate with `node scripts/placeholders.mjs`.

The live version of this list is also at `/[locale]/_styleguide`.

| # | What | Where | Notes |
| --- | --- | --- | --- |
| 1 | **Booking link** | `content/contact.json → booking` | Cal.com / Calendly URL — until set, "Book a call" opens the contact page |
| 2 | **US phone number** | `content/contact.json → phone + phoneDisplay` | currently +1 (212) 555-0100 |
| 3 | **WhatsApp number** | `content/contact.json → whatsapp` | currently +201000000000 |
| 4 | **Email address** | `content/contact.json → email` | confirm hello@trace.studio is real and monitored |
| 5 | **linkedin URL** | `content/contact.json → social` | placeholder — or delete the key to hide the link |
| 6 | **x URL** | `content/contact.json → social` | placeholder — or delete the key to hide the link |
| 7 | **Project: WhatsApp CRM** | `content/portfolio.json → whatsapp-crm` | Cover and gallery are the product's marketing renders, cropped to 16:10. They are built from the app's own source with a demo tenant ("Marina Interiors"), so every name and number on them is demo data, and the case study says so. |
| 8 | **Project: LamaBooking** | `content/portfolio.json → lamabooking` | The client app is not published, so the showcase shows the real API source (assets/captures/lamabooking/). Add client screenshots here if the frontend is deployed. |
| 9 | **Project: Ridgeline Freight** | `content/portfolio.json → ridgeline-freight` | sample project — replace client, copy, results and cover, then remove "placeholder": true |
| 10 | **Project: Clearwater Dental** | `content/portfolio.json → clearwater-dental` | sample project — replace client, copy, results and cover, then remove "placeholder": true |
| 11 | **Project: Harbor & Main Realty** | `content/portfolio.json → harbor-main-realty` | sample project — replace client, copy, results and cover, then remove "placeholder": true |
| 12 | **Project: Copperline Coffee** | `content/portfolio.json → copperline-coffee` | sample project — replace client, copy, results and cover, then remove "placeholder": true |
| 13 | **Project: Fieldhouse Foods** | `content/portfolio.json → fieldhouse-foods` | sample project — replace client, copy, results and cover, then remove "placeholder": true |
| 14 | **Project: Your next project** | `content/portfolio.json → next-project` | sample project — replace client, copy, results and cover, then remove "placeholder": true |
| 15 | **Concept covers** | `public/images/portfolio/*.jpg` | six concept covers built from demo screens — replace with real work at 2400×1500 (16:10) |
| 16 | **Team** | `content/site.en.json → pages.about.team` | PLACEHOLDER team — replace names, roles and photos before launch. |
| 17 | **Service FAQ answers** | `content/site.en.json → pages.serviceDetail.faq` | PLACEHOLDER FAQ answers — replace before launch. |
| 18 | **Privacy and Terms** | `content/site.en.json → pages.legal` | DRAFT COPY — must be reviewed by a lawyer before launch. |
| 19 | **Team photos** | `public/images/team/` | each person shows their constellation until a portrait exists (4:5) |
| 20 | **US legal entity** | `Footer + Organization JSON-LD` | US buyers look for the registered company (name, state); both spots are marked TODO |
| 21 | **NEXT_PUBLIC_SITE_URL** | `Vercel env` | defaults to https://trace.studio — set the real domain or every canonical URL and OG image is wrong |

## The four that actually cost you money

1. **The booking link** — every "Book a call" button on the site points at it.
2. **The email address and US phone number** — the next two ways in.
3. **The concept projects** — replace them with real work as it lands; the work section is the proof.
4. **`NEXT_PUBLIC_SITE_URL`** — wrong here and every canonical URL and share
   image points at the wrong domain.

## Legal

`/privacy` and `/terms` are **drafts** and say so on the page, with a visible
"pending legal review" badge. Have a lawyer review them and then remove the
badge from `src/components/sections/LegalPage.tsx`.

## Bail bonds page

- `public/images/bail/*.jpg` — photos inside the fictional Ironwood mock, taken
  from the bail-bonds reference project. Confirm the licence, or replace them.
- `content/bail-bonds.json` — Ironwood Bail Bonds, its agent, review, license
  number and the two competing listings are fictional (labelled as a concept on
  the page). Example premium rates in the estimator and the assistant.
