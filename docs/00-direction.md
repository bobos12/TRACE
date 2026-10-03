# 00 — Direction: TRACE, for US businesses

**Read this first. Where it disagrees with docs 01–07 or the brand guidelines, this wins.**

Docs 01–07 and `docs/brand-guidelines/` were written for ATHR (أثر), a studio
selling to Saudi Arabia, Egypt and the Gulf. The studio now sells to the United
States. What changed, and what did not:

## Unchanged

- The identity: the nuqta, the cut, the constellation, the trace, the colours,
  the type (Instrument Sans + IBM Plex Mono), the motion rules, the light and
  dark themes, the visual-first home page. Every rule about how things *look*
  in docs 02, 03 and 05 still applies.
- Tokens only, accessibility (WCAG 2.2 AA), performance (Lighthouse ≥ 95).

## Changed

| Was (ATHR) | Is (TRACE) |
| --- | --- |
| Name ATHR / أثر | **TRACE** (Latin only) |
| Arabic `/ar` default + English `/en` | **English only**, no locale in the URL |
| Saudi Arabia, Egypt, the Gulf | **US businesses**; team in Cairo — "USA · Cairo" |
| WhatsApp first, phone second | **Book a call first, email second**; WhatsApp and phone secondary |
| Floating WhatsApp button / mobile WhatsApp + Call bar | Floating **Book a call** / mobile **Book a call + Email** bar |
| Thirteen Gulf client projects | **Named clients** the owner chose — Future Earth Energy, Fateen (4 projects), Fancy Stays, Retal Residence — with their logos; Car Test as a logo only; the rest removed |
| Screenshot covers | **Showcase slides**: real captures of each live site in browser and phone frames, 3–4 per project |
| KSA commercial registration as a trust signal | US legal entity (TODO), NDA, IP ownership, fixed price, US-hours overlap |

## The logo

The TRACE wordmark is Instrument Sans SemiBold converted to outlines with the
same tracking (+36) and kerning the ATHR wordmark used. The three-nuqta cluster
keeps its size, gaps and height above the cap line (1.5 × the half-diagonal),
and sits **centred on the apex of the A** — the brand book already reads the
symbol as "the apex of the A", and the A is the middle letter. Source:
`src/components/brand/Logo.tsx`; files in `public/brand/trace-*.svg`. The
symbol (three nuqtas) and every app icon and favicon are unchanged.

There are no Arabic or bilingual lockups any more.

## Conversion, for a US buyer

- Every primary CTA is **Book a free call**, through `bookingHref()` and
  `trackContact('booking', placement)`. Until `content/contact.json → booking`
  is a real Cal.com / Calendly URL, it falls back to `/contact`.
- Email is the second action everywhere (nav icon, hero brief, contact band,
  service pages, mobile bar).
- WhatsApp and phone appear in the contact band, contact page and footer — never
  as the vermilion action.
- The project brief writes an **email**; WhatsApp is the alternative link under it.
- The contact form requires an email, not a phone number.

## Trust, without inventing anything

US buyers are sceptical of offshore studios. The site earns trust by being
specific about terms, not by inventing clients:

- What every client gets, in writing: NDA, 100% code ownership, fixed price per
  phase, working software every two weeks, US-hours calls, stop after any phase.
- The Cairo team is stated plainly (about page, FAQ) — hiding it backfires.
- Only clients the owner approved are shown, with their real logos and live links. Their sites are shown as they are. **The home page shows nothing in Arabic**: Future Earth is captured from its English site (fe-ksa.com/en), and Arabic-only work (Fateen, ELITE GPT) lives on /work and its case studies only.
- No testimonials, logos or metrics that are not real. Concept pieces stay
  labelled as concepts.
