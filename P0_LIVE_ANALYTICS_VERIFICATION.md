---
title: "The Echo Box P0 Live Analytics Verification"
project: "Distribution-Native Product Upgrade V1"
date: "2026-10-06"
status: "WAITING FOR PRODUCTION DEPLOYMENT"
authenticated_dashboard_evidence: false
---

# P0 Live Analytics Verification

## Evidence status

Production has not been deployed. Plausible dashboard receipt is therefore **NOT VERIFIED** for the P0 event names below. Local runtime QA proves safe local event creation, allowlisted properties, UTM persistence, and zero private-draft network leakage; it does not prove the live Plausible account received events.

## Live event checklist

Complete only after explicit deployment authorization and Production release.

| Event | Test action | Expected safe properties | Live Plausible status |
|---|---|---|---|
| `landing_view` | Open homepage | page/UTM/referral only | NOT VERIFIED |
| `unsent_message_started` | Type first harmless character | page/UTM/referral only | NOT VERIFIED |
| `reset_started` | Start 10-minute reset | page/UTM/referral only | NOT VERIFIED |
| `reset_completed` | Reach timer completion | page/UTM/referral only | NOT VERIFIED |
| `reset_card_generated` | Generate card | page/UTM/referral only | NOT VERIFIED |
| `reset_card_downloaded` | Download PNG | page/UTM/referral only | NOT VERIFIED |
| `share_clicked` | Complete native share action | `share_method`, approved referral source | NOT VERIFIED |
| `share_link_copied` | Copy share link | `share_method=copy`, approved referral source | NOT VERIFIED |
| `referral_visit` | Open tagged link in isolated browser | `reset-card` or `friend-share` only | NOT VERIFIED |
| `reality_box_opened` | Open/save Reality Box | page/UTM/referral only | NOT VERIFIED |
| `no_contact_started` | Start/restart counter | page/UTM/referral only | NOT VERIFIED |
| `paid_cta_clicked` | Tap 30-Day Reset CTA | safe CTA location | NOT VERIFIED |
| `checkout_started` | Open Gumroad | safe CTA location | NOT VERIFIED |

## Privacy inspection

For each live event inspect the Plausible event/property view or captured browser request where available. It must not contain:

- harmless test draft or any private draft
- ex name
- Reality Box text
- phone number, username, email, or notes
- full arbitrary query string
- localStorage state

If any private value is observed, stop testing and set release status to `ROLLBACK REQUIRED — PRIVATE DATA LEAK`.

## Validation window metrics

Do not optimize from isolated test events. After a real observation window, calculate:

- Landing → Reset Start Rate = unique sessions with `reset_started` / landing sessions
- Reset Start → Completion Rate = sessions with `reset_completed` / sessions with `reset_started`
- Completion → Share Action Rate = sessions with `share_clicked` or `share_link_copied` / sessions with `reset_completed`
- Share → Referral Visit Rate = referred sessions / sessions with a share action
- Referral → Referred Reset Rate = referred sessions with `reset_started` / referred sessions
- Completion → Paid CTA Rate = sessions with `paid_cta_clicked` / sessions with `reset_completed`
- Paid CTA → Checkout Rate = sessions with `checkout_started` / sessions with `paid_cta_clicked`

Primary metric:

`PRODUCT-BORNE REFERRAL RATE = referred sessions / completed-reset sessions`

Never replace an unavailable metric with zero. Use `UNKNOWN` until authenticated evidence exists.

## Decision freeze

No P1 implementation or changes to Hero, card copy, CTA copy, timer, pricing, product, checkout, or milestones are authorized by this document. The next development decision waits for real Production usage data and a human decision.
