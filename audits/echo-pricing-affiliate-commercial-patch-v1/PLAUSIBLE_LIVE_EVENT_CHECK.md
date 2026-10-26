---
title: The Echo Box Plausible Live Event Check
date: 2026-10-26
status: authenticated-backend-not-verified
---

# Plausible Live Event Check

## Code and local evidence

The allowlist and implementation contain distinct events:

| Event | Intended trigger | Local contract |
|---|---|---|
| `echo_start` | One intentional click into the free Reset | PASS |
| `reset_started` | Timer actually starts | PASS |
| `reset_completed` | Reset reaches completion | PASS |
| `paid_cta_clicked` | Paid CTA is intentionally clicked | PASS |
| `checkout_started` | External Gumroad handoff starts | PASS |

`checkout_started` is paid intent only. It is not `purchase_confirmed` and must never be counted as a sale.

The local network/privacy test found no private canary in requests. This does not prove that the authenticated Plausible workspace received Production events.

## Human live acceptance

Use one private browser session on the approved Preview first, then repeat once on Production after authorized release:

1. Open the page with a unique non-sensitive campaign, for example `?utm_source=owner_qa&utm_medium=manual&utm_campaign=price_1490_release`.
2. In Plausible realtime, note the baseline counts and current UTC time.
3. Click one free Reset entry CTA: expect `echo_start +1`.
4. Start the timer once: expect `reset_started +1` and no second `echo_start` from re-render/navigation.
5. Complete the supported Reset flow once: expect `reset_completed +1`.
6. Click the paid CTA once: expect `paid_cta_clicked +1` and `checkout_started +1`.
7. Stop at Gumroad; do not purchase.
8. Inspect event properties/network payloads: no message text, relationship detail, email, private Reset text or arbitrary URL query value may be present.
9. Allow normal ingestion delay, then export or screenshot the five event rows with sensitive/account details redacted.

Expected delta for one clean journey: each of the five named events `+1`. Pageview counts may differ because of navigation/reloads and are not part of this acceptance.

Authenticated Plausible access: `NOT AVAILABLE`

First real valid event timestamp (UTC): `NOT VERIFIED`

Live event gate: `BLOCKED — HUMAN AUTHENTICATED CHECK REQUIRED`

