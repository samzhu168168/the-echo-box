# Measurement Plan V2

Date: 2026-07-10

## Goal

Measure whether breakup-reset traffic turns into product interest and Gumroad checkout intent without collecting private user text.

## Core funnel

1. Page visit: `landing_page_view`
2. Unsent message start: `unsent_message_started`
3. Reset start: `reset_started`
4. Reset completion: `reset_completed`
5. Pricing exposure: `pricing_viewed`
6. Paid CTA view: `paid_kit_cta_viewed`
7. Paid CTA click: `paid_kit_cta_clicked`
8. Checkout opened: `gumroad_checkout_opened`

## Retention signals

- `return_visit_day_1`
- `return_visit_day_3`
- `return_visit_day_7`
- `no_contact_counter_created`
- `reality_box_reopened`

## Conversion questions

- Which traffic source starts the reset?
- Which hook drives paid-kit CTA clicks?
- Which placement performs better: pricing section or post-reset offer?
- Does the no-contact counter improve return visits?

## Forbidden data

Never record:

- unsent message text,
- Reality Box text,
- ex names,
- email plaintext,
- phone numbers,
- Gumroad order IDs,
- payment details,
- exported file contents,
- crisis text,
- session replay.

## Weekly review

Every 7 days, review:

- visits by source,
- reset starts,
- reset completions,
- paid CTA clicks,
- Gumroad product page views and sales from Gumroad dashboard,
- top content links by UTM.
