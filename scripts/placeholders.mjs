/**
 * Regenerate PLACEHOLDERS.md from the content files.
 *
 *   node scripts/placeholders.mjs
 *
 * Driven by the `_note` and `placeholder` markers in content/, so the list
 * cannot drift from what is actually still fake.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const read = (p) => JSON.parse(readFileSync(p, 'utf8'));
const contact = read('content/contact.json');
const portfolio = read('content/portfolio.json');
const en = read('content/site.en.json');
const ar = read('content/site.ar.json');

const rows = [];
const add = (what, where, why) => rows.push({ what, where, why });

// Contact details — the ones that actually break conversion if left fake.
// A run of six or more zeros is never a real number.
const looksFake = (n) => /0{6,}/.test(n.replace(/\D/g, ''));

if (looksFake(contact.whatsapp)) {
  add('WhatsApp number', 'content/contact.json → whatsapp', `currently ${contact.whatsapp}`);
}
if (looksFake(contact.phone)) {
  add('Saudi phone number', 'content/contact.json → phone + phoneDisplay', `currently ${contact.phoneDisplay}`);
}
if (looksFake(contact.phoneSecondary)) {
  add('Egypt phone number', 'content/contact.json → phoneSecondary + phoneSecondaryDisplay', `currently ${contact.phoneSecondaryDisplay}`);
}
if (contact.email.endsWith('athr.studio')) {
  add('Email address', 'content/contact.json → email', `confirm ${contact.email} is real and monitored`);
}
for (const [name, url] of Object.entries(contact.social)) {
  if (url.includes('REPLACE')) add(`${name} URL`, 'content/contact.json → social', 'placeholder — or delete the key to hide the link');
}

// Projects.
for (const p of portfolio.projects) {
  if (p._note && !p.placeholder) add(`Project: ${p.en.client}`, `content/portfolio.json → ${p.slug}`, p._note);
  if (!p.placeholder) continue;
  add(
    `Project: ${p.en.client}`,
    `content/portfolio.json → ${p.slug}`,
    'sample project — replace client, copy, results and cover, then remove "placeholder": true',
  );
}
add('Project covers', 'public/images/portfolio/*.jpg', 'six placeholder covers — replace with real work at 2400×1500 (16:10)');

// Copy marked with a note.
for (const [loc, site] of [['en', en], ['ar', ar]]) {
  if (site.testimonial._note) add('Testimonial', `content/site.${loc}.json → testimonial`, site.testimonial._note);
  if (site.pages.about._note) add('Team', `content/site.${loc}.json → pages.about.team`, site.pages.about._note);
  if (site.pages.serviceDetail._note) add('Service FAQ answers', `content/site.${loc}.json → pages.serviceDetail.faq`, site.pages.serviceDetail._note);
  if (site.pages.legal._note) add('Privacy and Terms', `content/site.${loc}.json → pages.legal`, site.pages.legal._note);
}

// Things with no marker in the data.
add('Team photos', 'public/images/team/', 'each person shows their constellation until a portrait exists (4:5)');
add('Commercial registration number', 'Footer + Organization JSON-LD', 'Saudi clients look for a CR number; both spots are marked TODO');
add('NEXT_PUBLIC_SITE_URL', 'Vercel env', 'defaults to https://athr.studio — set the real domain or every canonical URL and OG image is wrong');

const body = `# Placeholders

Everything below is fake, provisional or missing, and must be dealt with before
this site goes live. Regenerate with \`node scripts/placeholders.mjs\`.

The live version of this list is also at \`/[locale]/_styleguide\`.

| # | What | Where | Notes |
| --- | --- | --- | --- |
${rows.map((r, i) => `| ${i + 1} | **${r.what}** | \`${r.where}\` | ${r.why} |`).join('\n')}

## The four that actually cost you money

1. **The WhatsApp number** — every WhatsApp button on the site points at it.
2. **The phone numbers** — same.
3. **The project covers and results** — the work section is the proof.
4. **\`NEXT_PUBLIC_SITE_URL\`** — wrong here and every canonical URL, hreflang
   pair and share image points at the wrong domain.

## Legal

\`/privacy\` and \`/terms\` are **drafts** and say so on the page, with a visible
"pending legal review" badge. Have a lawyer review them and then remove the
badge from \`src/components/sections/LegalPage.tsx\`.
`;

writeFileSync('PLACEHOLDERS.md', body);
console.log(`PLACEHOLDERS.md — ${rows.length} items`);
