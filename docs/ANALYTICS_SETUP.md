# Analytics Setup

## Current implementation

The site uses a local anonymous analytics adapter in analytics.js.

It exposes:

`window.echoAnalytics.trackEvent(eventName, properties)`

Current mode:

- Local browser storage only
- No third-party analytics ID
- No network send
- Development console shows event names and sanitized properties only

## Event allowlist

- landing_page_view
- unsent_message_started
- unsent_message_saved_local
- reset_started
- trigger_selected
- reset_completed
- no_contact_counter_created
- reality_box_created
- reality_box_reopened
- pricing_viewed
- paid_kit_cta_viewed
- paid_kit_cta_clicked
- gumroad_checkout_opened
- gumroad_checkout_failed
- return_visit_detected
- local_data_exported
- local_data_cleared

## Forbidden data

Never record user message body, Reality Box text, ex-partner names, full emails, full order IDs, crisis content, or exported file contents.

## How to verify

Open the page locally, type a harmless test message, start a reset, select a trigger, scroll to pricing, and confirm console events show only event names and safe enum properties. Search Network for the private test text. It should not appear.

## Needed from owner

If aggregate reporting is required, provide a GA4 or privacy-safe analytics destination. Do not add it until event forwarding is restricted to this allowlist.