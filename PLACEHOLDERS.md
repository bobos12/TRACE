# Placeholders

Everything below is fake, provisional or missing, and must be dealt with before
this site goes live. Regenerate with `node scripts/placeholders.mjs`.

The live version of this list is also at `/[locale]/_styleguide`.

| # | What | Where | Notes |
| --- | --- | --- | --- |
| 1 | **Booking link** | `content/contact.json → booking` | Cal.com / Calendly URL — until set, "Book a call" opens the contact page |
| 2 | **US phone number** | `content/contact.json → phone + phoneDisplay` | currently +1 (212) 555-0100 |
| 3 | **Project: Ironwood Bail Bonds** | `content/portfolio.json → ironwood-bail-bonds` | sample project — replace client, copy, results and cover, then remove "placeholder": true |
| 4 | **Project: TRACE Bail** | `content/portfolio.json → trace-bail` | In development. The screens are product designs shown with Ironwood Bail Bonds, a fictional agency; no agency uses it yet. |
| 5 | **Project: WhatsApp CRM** | `content/portfolio.json → whatsapp-crm` | Cover and gallery are the product's marketing renders, cropped to 16:10. They are built from the app's own source with a demo tenant ("Marina Interiors"), so every name and number on them is demo data, and the case study says so. |
| 6 | **Project: LamaBooking** | `content/portfolio.json → lamabooking` | The client app is not published, so the showcase shows the real API source (assets/captures/lamabooking/). Add client screenshots here if the frontend is deployed. |
| 7 | **Project: Clearwater Dental** | `content/portfolio.json → clearwater-dental` | sample project — replace client, copy, results and cover, then remove "placeholder": true |
| 8 | **Project: Harbor & Main Realty** | `content/portfolio.json → harbor-main-realty` | sample project — replace client, copy, results and cover, then remove "placeholder": true |
| 9 | **Project: Ridgeline Freight** | `content/portfolio.json → ridgeline-freight` | sample project — replace client, copy, results and cover, then remove "placeholder": true |
| 10 | **Concept covers** | `public/images/portfolio/*.jpg` | six concept covers built from demo screens — replace with real work at 2400×1500 (16:10) |
| 11 | **Team** | `content/site.en.json → pages.about.team` | PLACEHOLDER team — replace names, roles and photos before launch. |
| 12 | **Service FAQ answers** | `content/site.en.json → pages.serviceDetail.faq` | PLACEHOLDER FAQ answers — replace before launch. |
| 13 | **Privacy and Terms** | `content/site.en.json → pages.legal` | DRAFT COPY — must be reviewed by a lawyer before launch. |
| 14 | **Team photos** | `public/images/team/` | each person shows their constellation until a portrait exists (4:5) |
| 15 | **US legal entity** | `Footer + Organization JSON-LD` | US buyers look for the registered company (name, state); both spots are marked TODO |

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
