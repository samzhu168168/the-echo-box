# Email Funnel Decision

Date: 2026-07-10

## Decision

Do not add an email funnel in this batch.

## Reason

The site handles sensitive breakup and no-contact behavior. Collecting email introduces privacy, compliance, and trust risk. The immediate conversion path is simpler:

free reset -> paid kit CTA -> Gumroad checkout.

## Future option

If email is added later, use:

- explicit consent,
- no message-body capture,
- no hidden opt-in,
- no crisis or sensitive text in email fields,
- clear unsubscribe,
- privacy policy update.

## Event placeholders

The analytics event allowlist includes:

- `email_opt_in_viewed`
- `email_opt_in_completed`

These are placeholders only. No live email capture was added.
