# Analytics Post-Launch TODO

Date: 2026-07-10
Status: Pending owner setup

## Current State

Production is live without analytics by explicit owner approval.

This is privacy-safe for launch, but attribution will be limited until a provider is connected.

## Recommended Setup

Primary recommendation: Plausible or another privacy-first analytics provider.

Reason: The Echo Box handles emotionally sensitive text. Analytics should count events without collecting message content, form text, email addresses, order IDs, or buyer data.

## Events To Enable Later

- landing_page_view
- unsent_message_started
- unsent_message_saved_local
- reset_started
- reset_completed
- pricing_viewed
- paid_kit_cta_viewed
- paid_kit_cta_clicked
- gumroad_checkout_opened
- gumroad_checkout_fallback_used
- gumroad_checkout_failed

## Privacy Rules

Do not capture:

- unsent message text
- Reality Box text
- email addresses
- Gumroad buyer information
- order IDs
- full URLs containing sensitive query strings
- session replay recordings
- form snapshots

## Setup Steps For Next Round

1. Owner creates or approves an analytics provider account.
2. Add provider domain or ID to the site configuration.
3. Run production browser QA again with network inspection.
4. Confirm only event names and safe metadata are sent.
5. Update the privacy page if the provider requires disclosure.
6. Start the 7-day validation tracker only after analytics is confirmed.

## Launch Decision

Analytics is not blocking the current launch because production without analytics was explicitly approved.