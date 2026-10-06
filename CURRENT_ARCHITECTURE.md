---
title: "The Echo Box Current Architecture"
project: "Distribution-Native Product Upgrade V1"
date: "2026-10-06"
phase: "0 — Repository Audit"
---

# Current Architecture

## Framework and build

The Echo Box is a dependency-free static HTML/CSS/JavaScript site. `scripts/build_dist.js` copies an explicit allowlist into `dist/`; Vercel serves that directory. There is no component framework, server runtime, database, account system, or API for the breakup-reset flow.

## Routing

- `/` (`index.html`) is the interactive reset, no-contact counter, Reality Box, necessary-contact filter, pricing, privacy control, and Guide entry page.
- `/30-day-no-contact-reset-kit.html` is the paid-product landing page.
- `/guides/*.html` contains 16 indexable Guides.
- Supporting trust/legal pages are static HTML.
- Hash routes on `/` currently expose `#reset`, `#no-contact`, `#reality-box`, `#necessary-contact`, `#pricing`, and `#privacy-controls`.

V1 should not add `/reset`, `/no-contact`, `/reality-box`, `/30-day-reset`, or `/gift` routes. Creating five route aliases would expand SEO and deployment scope without improving the first product-borne loop. Existing hash destinations provide the needed entry points.

## Storage and privacy

`app.js` stores breakup state under `echoBoxBreakupData.v1`. It may contain the unsent message, Reality Box fields, reset timestamps, no-contact timestamp, and return milestones. All remain in local browser storage. Users can export or clear local data. The “Do not save” option prevents the message from being retained after reset start.

Analytics are stored separately under `echoBoxAnalyticsEvents.v1`; the analytics layer uses an explicit event/property allowlist. Message text is never passed into event properties. The current all-data export includes local state and locally retained analytics, but does not send either to a server.

## Analytics and attribution

`analytics.js` records allowlisted events locally and optionally forwards a small funnel subset to Plausible. UTM attribution is currently session-scoped. P0 can safely extend this to first/last attribution in localStorage, add referral-source classification, and add the distribution-loop events without allowing arbitrary payloads.

## Payments

`commerce-config.js` contains the existing Gumroad destination, current `$9.99` price, product name, and enabled state. `app.js` appends UTM values and placement to checkout links. The current destination and price must remain unchanged.

## Current CTA flow

1. User writes a private message.
2. User starts the 10-minute reset.
3. Timer completes.
4. Existing UI reveals a paid-product panel.
5. Paid CTA opens Gumroad with attribution parameters.

The gap is between steps 3 and 4: there is no dedicated accomplishment state, no share-safe artifact, and no Person-2 referral action.

## Reusable components

- `.button`, `.tool-band`, `.reset-eyebrow`, `.privacy-note`, `.form-actions`
- Reset timer and local state persistence
- Global analytics wrapper and property sanitizer
- UTM-aware checkout builder
- Existing data export/delete controls
- Existing editorial color and typography tokens

## Technical risks

1. Any share artifact must be constructed from fixed copy only; never read message, Reality Box, ex name, or notes.
2. Timer completion may fire more than once across rapid state changes unless completion is idempotent.
3. Native Share support varies; copy-link and download fallbacks are required.
4. Canvas downloads must not depend on cross-origin images, avoiding a tainted canvas.
5. Attribution must remain allowlisted and must not store arbitrary query parameters or private text.
6. Existing analytics names differ from the requested canonical names; V1 should document the new names and keep legacy names accepted for historical compatibility.
7. The repository has many unrelated untracked assets. Implementation must touch only explicitly scoped files and preserve them.
