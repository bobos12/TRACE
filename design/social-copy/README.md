# TRACE — social media kit

Everything needed to open professional TRACE pages on LinkedIn, Instagram,
X, Facebook and YouTube. Built from the same fonts, colours and logo as the
website.

**Start with `00-start-here/setup-checklist.md`.**

## What's in the folder

| Folder | What | Use it for |
| --- | --- | --- |
| `00-start-here/` | Setup checklist, bios, captions, brand basics | Copy and paste while you set up each page |
| `01-profile/` | Profile pictures: the TRACE symbol on carbon (main), paper and vermilion. 1080 px and 400 px | Profile photo on every platform. Use **carbon** everywhere for one recognisable mark |
| `02-covers/` | One cover per platform, at the exact upload size | Banner / header image |
| `03-posts/` | Launch posts: an intro post, four carousels, a bail-bonds post, an announcement template, LinkedIn link banners and a square intro | Your first two weeks of posts |
| `04-stories/` | Three stories and highlight covers (Work, Services, Process, About, Contact, Bail bonds) | Instagram / Facebook stories and story highlights |
| `05-logos/` | The wordmark, the symbol and the **stacked logo** (symbol above the name) as SVG and transparent PNG, plus the stacked logo on carbon and paper squares | Anything else: email signature, documents, partner listings, merch |

## Upload sizes used

| Platform | Profile | Cover |
| --- | --- | --- |
| LinkedIn company page | `avatar-carbon-400.png` | `linkedin-company-cover-1128x191.png` |
| LinkedIn (your own profile) | your photo | `linkedin-personal-banner-1584x396.png` |
| Instagram | `avatar-carbon-1080.png` | — (use highlight covers) |
| X | `avatar-carbon-400.png` | `x-header-1500x500.png` |
| Facebook page | `avatar-carbon-1080.png` | `facebook-cover-1640x856.png` |
| YouTube | `avatar-carbon-1080.png` | `youtube-banner-2560x1440.png` |

Posts are 1080 × 1350 (portrait), the size that takes the most room in the
Instagram and LinkedIn feeds. Carousels are numbered slides — upload them in
order (on LinkedIn, as a document/PDF or as multiple images).

## Changing anything

The images are generated from the website project:

```
SOCIAL_OUT="$HOME/OneDrive/Desktop/TRACE Social Kit" node scripts/make-social.mjs
```

Post text comes from `content/` (services, process, commitments, featured
work), so editing the site's content and re-running updates the posts too.
The announcement template's text lives in `scripts/make-social.mjs`.

## Before you post

- The domain `trace.studio`, the email `hello@trace.studio` and the handles
  are **placeholders** until the real ones are confirmed — they appear on the
  posts. Set `NEXT_PUBLIC_SITE_URL` and `content/contact.json`, then re-run.
- The bail-bonds post links to `/bail-bonds`, which uses a fictional demo
  agency (labelled as a concept on the page).
