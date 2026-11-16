# Prospect tracking: what trace-studio.tech sends the campaign tool

Every step a prospect takes on **trace-studio.tech/demo** (the campaign video page) and inside the demos (**/demos/ellison-reyes**, **/demos/steel-city**) is recorded in the browser by `public/demos/_shared/trace-track.js`. It is batched to `/api/demo-events` on the same site, which adds location and device and **forwards each batch to the campaign tool**.

## 1. The email link

Point the campaign's video/demo button at:

```
https://trace-studio.tech/demo?rid={{recipient_id}}
```

`rid` is the campaign tool's own id for that recipient. `r`, `cid`, `recipient` and `contact_id` are accepted too. Any `utm_*` parameters are kept. The id is stored in the visitor's browser, so every later page, demo and form on the site, even days later, is tied to that recipient.

## 2. Where batches go (Vercel environment variables)

| Variable | Meaning |
| --- | --- |
| `TRACKING_WEBHOOK_URL` | The campaign tool's ingest endpoint. trace-studio.tech POSTs each batch here as JSON. |
| `TRACKING_WEBHOOK_SECRET` | Optional. Sent as `Authorization: Bearer <secret>`, so the tool can reject anything else. |

The webhook should answer within 5 seconds with any 2xx status. Failures are logged and dropped, and visitors never notice.

## 3. Payload (one POST per batch, up to 60 events)

```json
{
  "source": "trace-studio.tech",
  "received_at": "2026-11-17T15:04:05.123Z",
  "visitor": {
    "vid": "lq3k9x2a7f1c",
    "sid": "lq3kb0d93kfa",
    "rid": "TEST-RID-42",
    "name": "Pat Owner",
    "email": "pat.owner@gmail.com",
    "phone": "7015552368"
  },
  "geo": { "city": "Phoenix", "region": "AZ", "country": "US" },
  "user_agent": "Mozilla/5.0 (iPhone; …)",
  "ctx": {
    "landing": "https://trace-studio.tech/demo?rid=TEST-RID-42",
    "referrer": "",
    "utm": { "utm_source": "campaign" },
    "screen": "390x844",
    "lang": "en-US"
  },
  "events": [
    { "type": "page_view", "at": "2026-11-17T15:04:01.000Z", "site": "Demo video page", "page": "/demo", "data": { "title": "…", "url": "…" } }
  ]
}
```

- `vid`: a visitor id that persists in the browser. `sid`: the session id, which resets after 30 minutes of inactivity. `rid`: the recipient from the email link, or `null`.
- `name`, `email` and `phone` appear once the visitor has submitted them: in the demo bail application (their own details), or in a "call me back" form.
- `site` names where it happened: `Demo video page`, `Ellison & Reyes` or `Steel City Bail`. `page` is the path, for example `/demos/ellison-reyes/start`.

## 4. Event types

| type | when | data |
| --- | --- | --- |
| `session_start` | first event of a session | `landing`, `referrer`, `recipient` |
| `page_view` | each page, including in-demo navigation | `title`, `url` |
| `page_leave` | leaving a page | `active_seconds`, `total_seconds`, `max_scroll` (%) |
| `tab_hidden` / `tab_visible` | switching tabs or apps | — |
| `click` | any link or button | `kind` (`call`, `text`, `email`, `booking`, `demo`, `external`, `link`, `button`, `contact_open`), `label`, `href` |
| `video_play` | play or resume | `video`, `play` (count), `at_second`, `watched_seconds` |
| `video_pause` | pause | `at_second`, `watched_seconds` |
| `video_progress` | 10 / 25 / 50 / 75 / 90 % reached | `percent`, `watched_seconds` |
| `video_complete` | the video ended | `watched_seconds` |
| `form_start` | first focus in a form | `form` |
| `field_done` | a field was completed (**the label only, never the value**) | `form`, `field`, `filled`, `sensitive` |
| `form_step` | bail application step shown | `form: "bail_application"`, `step` 1–4, `name` |
| `form_error` | application refused fake details | `step`, `field` (`Mobile` or `Email`) |
| `form_submit` | any form submitted | `form` |
| `demo_form` | a demo form reached the team inbox | `kind` (`application`, `tip`, `checkin`, `reminders`, `lookup`, `payment`, `chat`, `text`, `callback`) |
| `application_completed` | the demo bail application was signed and sent | `reference` |
| `identify` | the visitor gave their name, email or phone | `name`, `email`, `phone` |
| `callback_request` | "call me back" sent | `agency` |
| `contact_panel` | the Trace Studio contact panel opened in a demo | `action` |

Card, bank, PIN and password values are never read or sent.

## 5. Suggested mapping onto Engaged Prospects

- **Demo clicks**: the campaign tool's own click tracking (unchanged).
- **Demo visits**: `session_start`, or the first `page_view` under `/demos/`, for that `rid`.
- **Completed**: `application_completed`. Treat `callback_request` as the hottest signal of all.
- **Watched video**: `video_progress` with `percent >= 75`, or `video_complete`.
- Timeline: list `events` in order. `identify` gives a name, email and phone to attach to the prospect.

## 6. Also emailed to the team at once (no webhook needed)

`/api/demo-lead` emails `LEADS_TO_EMAIL` for every demo form, including **CALL BACK REQUEST**, with the `rid`. When a prospect signs the demo application with their own email, they also receive their own copy, "Your test lead from the Ellison & Reyes demo", and replies go to the team.
