# Analytics Owner Setup

Date: 2026-07-10
Recommended provider: Plausible Analytics

## Why Plausible

- Cost: small paid plan; one $9.99 sale can cover the first month.
- Privacy: no session replay, no form capture, no DOM text recording.
- Custom events: supports lightweight event tracking.
- UTM: supports campaign attribution.
- Static site fit: simple script tag, no app backend required.
- US traffic: suitable for a lightweight consumer funnel.

## Current Code Status

`analytics.js` now exposes:

```js
ANALYTICS_CONFIG = {
  enabled: false,
  provider: "",
  id: "",
  debug: false
}
```

Default behavior remains no-op network tracking. Local event storage still works for QA.

## What Owner Needs To Create

1. Create a Plausible site for `my-echo-box.com`.
2. Send back only the public site domain/id value.
3. Confirm whether to use Plausible's standard script or tagged-events script.

## Required Safety Settings

- Do not enable session replay.
- Do not enable form capture.
- Do not collect message text.
- Do not collect Reality Box text.
- Do not collect email, order id, buyer name, or Gumroad buyer data.

## Events To Track

- `landing_page_view`
- `unsent_message_started`
- `unsent_message_saved_local`
- `reset_started`
- `trigger_selected`
- `reset_completed`
- `no_contact_counter_created`
- `reality_box_created`
- `reality_box_reopened`
- `paid_kit_cta_viewed`
- `paid_kit_cta_clicked`
- `gumroad_checkout_opened`
- `gumroad_checkout_failed`
- `return_visit_detected`
- `local_data_exported`
- `local_data_cleared`

## Status

WAITING_FOR_OWNER_ANALYTICS: yes
