---
title: "The Echo Box Distribution-Native V1 Changelog"
project: "The Echo Box"
date: "2026-10-06"
scope: "P0 only"
deployment_status: "NOT DEPLOYED"
---

# Implementation Changelog

## Delivered P0

### Reset completion

- Replaced the immediate post-timer offer with a dedicated “You didn't send it” accomplishment state.
- Added three proportionate next actions: another reset, Reality Box, and the existing 30-Day Reset.
- Made timer completion idempotent so one reset records one completion event.
- Restores an expired/completed local reset into the completion state after refresh.

### Privacy-safe artifact and sharing

- Added a fixed-copy 1080×1350 Canvas reset card generated entirely in the browser.
- Added explicit Generate, Download, Share, and Copy Link controls.
- Added native Web Share when supported and clipboard fallback otherwise.
- Added share URLs with `ref`, `utm_source`, `utm_medium`, and `utm_campaign`.
- Added a lower-page “Send them the reset” Person-2 action.
- No card or share function reads unsent message, Reality Box, names, notes, or relationship details.

### Analytics and attribution

- Added canonical V1 events while retaining legacy event names in the allowlist for historical compatibility.
- Added local first/last attribution persistence under `echoBoxAttribution.v2`.
- Added safe referral recognition for `reset-card` and `friend-share` only.
- Continued explicit property allowlisting; arbitrary/private payloads remain rejected.
- Updated reset, Reality Box, no-contact, paid intent, and checkout calls to canonical V1 event names.

### QA

- Added deterministic static privacy/distribution QA.
- Updated the existing browser flow test for canonical events and configurable mobile viewports.
- Added Canvas generation and completion-state overflow assertions.

## Exact files changed

Created:

- `CURRENT_ARCHITECTURE.md`
- `DISTRIBUTION_LOOP_V1.md`
- `IMPLEMENTATION_CHANGELOG.md`
- `DISTRIBUTION_NATIVE_QA.md`
- `docs/plans/2026-10-06-distribution-native-v1.md`
- `scripts/qa_distribution_native.js`

Modified:

- `index.html`
- `style.css`
- `app.js`
- `analytics.js`
- `package.json`
- `scripts/qa_relaunch_flow.js`

Generated locally by the existing build and not treated as hand-edited source:

- `dist/`

## Routes created

None. V1 uses the existing homepage and hash targets. No `/gift` or new SEO/tool route was created.

## Analytics event list

P0 canonical events:

- `landing_view`
- `unsent_message_started`
- `reset_started`
- `reset_completed`
- `reality_box_opened`
- `no_contact_started`
- `reset_card_generated`
- `reset_card_downloaded`
- `share_clicked`
- `share_link_copied`
- `referral_visit`
- `paid_cta_clicked`
- `checkout_started`

Reserved in the allowlist but not emitted by a V1 route:

- `gift_page_viewed`

Existing operational and legacy events remain allowlisted so historical data and fallback reporting are not made unreadable.

## Unchanged commercial configuration

- Price: `$9.99`
- Provider: Gumroad
- Destination: `https://samzhu168.gumroad.com/l/echo-box-30-day-no-contact-reset-kit`
- Purchase: one time; no subscription

## Remaining P1 / P2 backlog

P1:

- Private progress summary (`resetCount`, `messagesNotSent`, `currentNoContactDay`, bounded reset history)
- First/24-hour/3/7/14/30-day milestone cards
- “Today’s Reset” trigger routing
- Contextual paid CTA timing after reset #3 and milestones

P2:

- `/gift` explanation and simple provider-supported purchase path
- Gift attribution and recipient handoff
- Additional copy experiments using the existing lightweight configuration pattern

P1/P2 are not implemented or authorized by this delivery.

## Deployment status

No commit, push, Production deployment, sitemap change, IndexNow submission, or indexing request was performed.
