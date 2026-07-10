# Analytics Decision

Date: 2026-07-10

## Recommendation

Use a privacy-first analytics setup. Do not add Google Analytics session replay, form capture, or any analytics tool that can collect private message text by default.

## Current implementation

The site preserves the local `trackEvent(eventName, properties)` interface in `analytics.js`. Events are stored in browser local storage and can optionally be sent to a provider later.

## Recommended provider

Preferred: Plausible or a similarly privacy-first page/event analytics provider.

Reason:

- lightweight,
- no session replay,
- less risk of capturing sensitive breakup text,
- enough for channel and CTA measurement.

## Not approved in this batch

- Google Analytics with enhanced measurement enabled.
- Hotjar, Microsoft Clarity, FullStory, session replay, heatmaps, or form capture.
- Sending message text, Reality Box text, names, emails, Gumroad order IDs, or exported file contents.

## Required events

- `landing_page_view`
- `unsent_message_started`
- `unsent_message_saved_local`
- `reset_started`
- `trigger_selected`
- `reset_completed`
- `no_contact_counter_created`
- `reality_box_created`
- `reality_box_reopened`
- `necessary_contact_filter_used`
- `pricing_viewed`
- `paid_kit_cta_viewed`
- `paid_kit_cta_clicked`
- `gumroad_checkout_opened`
- `gumroad_checkout_failed`
- `return_visit_day_1`
- `return_visit_day_3`
- `return_visit_day_7`
- `local_data_exported`
- `local_data_cleared`
- `seo_tool_started`
- `seo_tool_completed`
- `email_opt_in_viewed`
- `email_opt_in_completed`

## WAITING_FOR_OWNER_ANALYTICS

Yes. The owner must create or provide the analytics provider site ID before live external analytics can be enabled.
