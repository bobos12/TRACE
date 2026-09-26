# Placeholders

Everything below is fake, provisional or missing, and must be dealt with before
this site goes live. Regenerate with `node scripts/placeholders.mjs`.

The live version of this list is also at `/[locale]/_styleguide`.

| # | What | Where | Notes |
| --- | --- | --- | --- |
| 1 | **WhatsApp number** | `content/contact.json → whatsapp` | currently +966500000000 |
| 2 | **Saudi phone number** | `content/contact.json → phone + phoneDisplay` | currently +966 50 000 0000 |
| 3 | **Egypt phone number** | `content/contact.json → phoneSecondary + phoneSecondaryDisplay` | currently +20 10 0000 0000 |
| 4 | **Email address** | `content/contact.json → email` | confirm hello@athr.studio is real and monitored |
| 5 | **linkedin URL** | `content/contact.json → social` | placeholder — or delete the key to hide the link |
| 6 | **x URL** | `content/contact.json → social` | placeholder — or delete the key to hide the link |
| 7 | **instagram URL** | `content/contact.json → social` | placeholder — or delete the key to hide the link |
| 8 | **Project: WhatsApp CRM** | `content/portfolio.json → whatsapp-crm` | Cover and gallery are the product's marketing renders (wahtsapp-crm/out/: behance-cover, showcase-*, slide-platform-map, feature-customer-profile, hero-light), cropped to 16:10. They are built from the app's own source with a demo tenant ("Marina Interiors"), so every name and number on them is demo data, and the case study says so. Renders with headline metric call-outs were left out on purpose. |
| 9 | **Project: Al Nokhba Eye Clinic** | `content/portfolio.json → eye-clinic-system` | Visuals from Al Nokhba are pending. Drop 2400×1500 JPGs in public/images/portfolio/ as eye-clinic-system-2.jpg, -3.jpg … and list them in "gallery"; replace "cover" the same way. Confirm the Arabic client name. |
| 10 | **Project: Nakheel Logistics** | `content/portfolio.json → nakheel-logistics` | sample project — replace client, copy, results and cover, then remove "placeholder": true |
| 11 | **Project: Sadeem Clinics** | `content/portfolio.json → sadeem-clinics` | sample project — replace client, copy, results and cover, then remove "placeholder": true |
| 12 | **Project: Masar Realty** | `content/portfolio.json → masar-realty` | sample project — replace client, copy, results and cover, then remove "placeholder": true |
| 13 | **Project: Qahwa House** | `content/portfolio.json → qahwa-house-website` | sample project — replace client, copy, results and cover, then remove "placeholder": true |
| 14 | **Project: Wared Foods** | `content/portfolio.json → wared-foods` | sample project — replace client, copy, results and cover, then remove "placeholder": true |
| 15 | **Project: Your next project** | `content/portfolio.json → athr-case-platform` | sample project — replace client, copy, results and cover, then remove "placeholder": true |
| 16 | **Project covers** | `public/images/portfolio/*.jpg` | six placeholder covers — replace with real work at 2400×1500 (16:10) |
| 17 | **Testimonial** | `content/site.en.json → testimonial` | PLACEHOLDER — replace with a real client quote. |
| 18 | **Team** | `content/site.en.json → pages.about.team` | PLACEHOLDER team — replace names, roles and photos before launch. |
| 19 | **Service FAQ answers** | `content/site.en.json → pages.serviceDetail.faq` | PLACEHOLDER FAQ answers — replace before launch. |
| 20 | **Privacy and Terms** | `content/site.en.json → pages.legal` | DRAFT COPY — must be reviewed by a lawyer before launch. |
| 21 | **Testimonial** | `content/site.ar.json → testimonial` | نص مؤقت — استبدله باقتباس حقيقي من عميل. |
| 22 | **Team** | `content/site.ar.json → pages.about.team` | فريق مؤقت — استبدل الأسماء والأدوار والصور قبل الإطلاق. |
| 23 | **Service FAQ answers** | `content/site.ar.json → pages.serviceDetail.faq` | إجابات الأسئلة مؤقتة — استبدلها قبل الإطلاق. |
| 24 | **Privacy and Terms** | `content/site.ar.json → pages.legal` | نص مسودّة — يجب أن يراجعه محامٍ قبل الإطلاق. |
| 25 | **Team photos** | `public/images/team/` | each person shows their constellation until a portrait exists (4:5) |
| 26 | **Commercial registration number** | `Footer + Organization JSON-LD` | Saudi clients look for a CR number; both spots are marked TODO |
| 27 | **NEXT_PUBLIC_SITE_URL** | `Vercel env` | defaults to https://athr.studio — set the real domain or every canonical URL and OG image is wrong |

## The four that actually cost you money

1. **The WhatsApp number** — every WhatsApp button on the site points at it.
2. **The phone numbers** — same.
3. **The project covers and results** — the work section is the proof.
4. **`NEXT_PUBLIC_SITE_URL`** — wrong here and every canonical URL, hreflang
   pair and share image points at the wrong domain.

## Legal

`/privacy` and `/terms` are **drafts** and say so on the page, with a visible
"pending legal review" badge. Have a lawyer review them and then remove the
badge from `src/components/sections/LegalPage.tsx`.
