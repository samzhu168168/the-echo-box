# Local Purchase Flow QA

Date: 2026-07-09
Base URL: http://127.0.0.1:8765
Expected Gumroad URL: https://samzhu168.gumroad.com/l/echo-box-30-day-no-contact-reset-kit

## Summary
Passes: 7
Issues: 0

## Captured Checkout URLs
- https://samzhu168.gumroad.com/l/echo-box-30-day-no-contact-reset-kit?utm_source=website&utm_medium=checkout_cta&utm_campaign=no_contact_reset_kit&utm_content=pricing
- https://samzhu168.gumroad.com/l/echo-box-30-day-no-contact-reset-kit?utm_source=website&utm_medium=checkout_cta&utm_campaign=no_contact_reset_kit&utm_content=pricing
- https://samzhu168.gumroad.com/l/echo-box-30-day-no-contact-reset-kit?utm_source=website&utm_medium=checkout_cta&utm_campaign=no_contact_reset_kit&utm_content=post_reset
- https://samzhu168.gumroad.com/l/echo-box-30-day-no-contact-reset-kit?utm_source=website&utm_medium=checkout_cta&utm_campaign=no_contact_reset_kit&utm_content=post_reset

## Passes
- Pricing CTA: opens correct Gumroad product URL
- Pricing CTA: checkout URL does not contain private probe
- Pricing CTA: checkout URL includes website checkout UTM
- Post-reset CTA: opens correct Gumroad product URL
- Post-reset CTA: checkout URL does not contain private probe
- Post-reset CTA: checkout URL includes website checkout UTM
- Private probe did not appear in local network requests.

## Issues
No CRITICAL, HIGH, MEDIUM, or LOW issues found.
