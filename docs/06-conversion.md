# 06 — Conversion & trust

The site succeeds when a visitor sends a WhatsApp message or calls. Every design decision serves that.

## Contact placement map

| Placement | Desktop | Mobile |
| --- | --- | --- |
| Nav | WhatsApp button + phone icon | WhatsApp icon + menu (menu has WhatsApp & Call) |
| Hero | Primary CTA = WhatsApp | Visible without scrolling |
| After services | "Not sure? Ask on WhatsApp" link | Same |
| After work | "Want something like this?" + WhatsApp | Same |
| Contact band (every page) | WhatsApp / Call / Email cards | Stacked, WhatsApp first |
| Anywhere after the hero | Floating WhatsApp button | Bottom bar: WhatsApp · Call |
| Project and service pages | CTA in the hero + contact band, with context | Same |
| 404 | WhatsApp link | Same |

## WhatsApp

- **Links:** always `whatsappHref(locale, context)` from `starters/contact.ts`. It produces a `wa.me` link with a prefilled, polite message plus the context (page, service or project).
- **Link attributes:** open in a new tab on desktop with `rel="noopener"`.
- **Icon:** use the official glyph (`public/icons/whatsapp.svg`, from Simple Icons) at its own shape. Don't restyle it or make it a rhombus.
  - The glyph may be white on the brand colours, or WhatsApp green only on the float button's icon.
- **Next to the button:** state the response time ("Reply within one working hour").

## Phone

- **Link:** `tel:` with the E.164 number. Show the formatted number beside it — people trust seeing the number.
- **Numbers:** Saudi number first. The Egypt number is shown in the footer and on the contact page.
  - Both are placeholders in `content/contact.json` → **must be replaced before launch.**

## Trust signals (build the slots, fill with real data)

1. Real project covers and screenshots (placeholders exist; replace with real).
2. Result numbers per project.
3. Client logos marquee (structure ready; logos TODO).
4. A testimonial with name, role and company (placeholder).
5. Business facts in the footer: cities, working hours, email, commercial registration number slot (`TODO` — Saudi clients look for CR).
6. "You own the code" and "Fixed price per phase" — stated in the "Why ATHR" section.
7. Bilingual everything: Arabic visitors must never land on English-only content.

## Analytics events

Call `trackContact(channel, placement)` on every contact click. Placement values:

`nav`, `hero`, `services`, `work`, `contact-band`, `float`, `mobile-bar`, `service:<slug>`, `project:<slug>`, `contact-page`, `footer`, `404`

Also track:
- `form_submit` (success/failure)
- `lang_switch`
- `project_view`

Use Vercel Analytics, or Plausible if the owner prefers. No cookie banner is needed with Plausible or Vercel Web Analytics — confirm with the owner.
