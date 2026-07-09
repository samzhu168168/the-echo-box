# Network Privacy Audit

Date: 2026-07-09
Private probe used: This is a test message and should never leave the browser.

## Result

Local browser network audit: PASS
Online Preview network audit: BLOCKED by Vercel Preview protection

## Local Evidence

- The private probe did not appear in request URLs.
- The private probe did not appear in request bodies.
- Gumroad checkout URLs include only UTM values and placement.
- Checkout URLs do not include the unsent message or Reality Box content.
- Analytics uses an allowlist of event names and properties.
- nalytics.js stores local events by default and does not send data unless ANALYTICS_CONFIG.enabled=true and a provider is configured.

## Sensitive Data Not Sent

- User message body
- Reality Box content
- Email
- Gumroad order or buyer information
- Crisis or safety text
- Local absolute paths

## Remaining Blocker

Rerun this audit on the real Preview after Vercel Preview protection is removed or bypass access is provided.