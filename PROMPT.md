# PROMPT.md — paste these into Claude Code

Open this folder in Claude Code, then paste **Prompt 1**. When it reports Phase 1 done and you've reviewed it, paste the next prompt. (You can also paste Prompt 1 alone and tell it to continue through all phases — but reviewing between phases gives a better result.)

---

## Prompt 1 — Kickoff (paste this first)

```
You're building the website for ATHR (أثر), my software studio. Everything you need is in this folder: brand, specs, content, and all assets.

First, read CLAUDE.md, then every file in docs/ in order (01 → 07). Look at the images in design/reference/renders/ and open design/reference/pages/home-en.html and home-ar.html to see the approved visual language. Skim design/components-reference/ and content/.

The goal of the site: a visitor lands, is impressed by a premium, visual, interactive experience with a clear ATHR identity, understands what we build, sees our work, trusts us — and contacts us on WhatsApp or by phone in one tap. The home page must feel visual and alive, not text-heavy.

Before writing code, reply with:
1. A short summary of what you understood (goal, audience, the brand idea, the conversion strategy).
2. Your implementation plan for all phases below, including the component list and any questions that would change the build. If nothing blocks you, don't wait for answers — state your assumptions and start Phase 1.

Phases:
- Phase 1 — Foundation: Next.js (App Router, TS strict) + Tailwind v4 + tokens + fonts (next/font/local) + next-intl (/ar default, /en) with RTL + theme (light/dark, no flash) + layout (nav, footer, floating WhatsApp, mobile contact bar) + brand components (Logo, Nuqta, Constellation, Trace, Cut) + UI components (Button incl. WhatsApp/Call variants, Badge, Card, Field, Select, Tabs) + content loading with Zod + favicons/manifest/metadata. Build a /[locale]/_styleguide page showing tokens, type and components in both themes.
- Phase 2 — Home page: every section in docs/03-home-page.md, with the visuals and motion described (hero lattice + product stack, trust strip, services bento with the 9 live illustrations, pinned work gallery, process trace, why + testimonial, industries, contact band).
- Phase 3 — Other pages: services index + detail, work index (filters) + project detail (case study), about, contact (form + WhatsApp fallback), privacy/terms, 404.
- Phase 4 — Polish & ship: SEO (metadata, hreflang, sitemap, robots, JSON-LD, per-project OG images), analytics events, performance and accessibility passes (Lighthouse ≥ 95 both locales), reduced-motion pass, RTL pass, README + .env.example + DECISIONS.md, and a final list of every placeholder I must replace.

After each phase: run the site, take Playwright screenshots at 390px and 1440px in /ar and /en (light + dark for key pages), look at them, fix what's off, then give me a short report with the screenshots' paths. Then continue to the next phase unless I've asked you to stop.
```

---

## Prompt 2 — If you want it to go straight through

```
Continue through all remaining phases without stopping for my review. Keep taking and checking screenshots after each phase, and give me one final report at the end with: what was built, how to run and deploy it, env vars, and the list of placeholders I must replace.
```

---

## Prompt 3 — Visual quality push (use after Phase 2 if the home page feels plain)

```
Review the home page against docs/03-home-page.md and docs/05-motion.md with fresh eyes, as a senior art director at a top digital studio. Screenshot every section at 1440 and 390, both locales. For each section list what feels generic, flat, text-heavy or template-like, and what would make it feel premium and unmistakably ATHR (the nuqta, the cut, the constellation, the trace, real product visuals, restrained motion). Then implement the improvements. Don't add gradients, glassmorphism, stock photos or new colours. Keep performance and accessibility bars.
```

---

## Prompt 4 — Replace placeholders with real content (when you have it)

```
I've added real content: [describe — e.g. new screenshots in public/images/portfolio/, updated content/portfolio.json, real phone numbers in content/contact.json, client logos in public/clients/]. Wire it in, regenerate the per-project OG images, remove the placeholder markers for anything now real, and re-run the screenshot and Lighthouse checks.
```

---

## Prompt 5 — Add a new project to the portfolio (repeatable)

```
Add a new project to the portfolio: [client, sector, country, services, what we built, challenge, solution, 2–3 result numbers, a quote if any] in English and Arabic. Screenshots are in [path]. Build the cover image in the same style as public/images/portfolio/ (device-framed screens on a brand-colour ground with the client's constellation), add it to content/portfolio.json, and check the project page in both languages.
```
