# Measurement Plan

## Batch A measurement

The homepage uses local-only events for initial product QA:

- page_view
- reset_started
- reset_completed
- trigger_selected
- counter_saved
- counter_restarted
- reality_saved
- message_exported
- message_deleted
- necessary_filter_used

## No server analytics yet

Events are stored in browser localStorage only and are not sent to a server. This protects privacy during the pivot but does not produce aggregate marketing data.

## Required next step

Choose one privacy-safe analytics path:

1. Keep local-only until organic traffic exists.
2. Add privacy-safe serverless event endpoint with no message text.
3. Add a consented third-party analytics tool with strict event allowlist.

## Success metrics after deployment

- Homepage load without console errors
- Reset started rate from homepage visitors
- Trigger selected rate after reset start
- Reality Box saved rate
- Paid waitlist or Gumroad click rate after offer is connected