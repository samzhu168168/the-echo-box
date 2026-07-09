# Online Browser QA

Date: 2026-07-09
Preview URL: https://the-echo-qkc6498q9-samzhu168168s-projects.vercel.app

## Summary

Online browser QA against the Vercel Preview is BLOCKED because the Preview URL returns Vercel login/protection HTML instead of The Echo Box.

Local real-browser QA was completed with Microsoft Edge + Playwright against http://127.0.0.1:8765/.

## Local Browser QA Result

- Desktop 1440x900: PASS
- Desktop 1366x768: PASS
- iPhone 13 viewport: PASS
- iPhone SE viewport: PASS
- Android 390-412px viewport: PASS
- Core reset flow: PASS
- Local state restore: PASS
- No-contact counter: PASS
- Reality Box save/export/clear: PASS
- Necessary communication flow: PASS
- Local network private text check: PASS
- CRITICAL issues: 0
- HIGH issues: 0

## Purchase Flow QA Result

- Pricing CTA opens correct Gumroad product URL: PASS
- Post-reset CTA opens correct Gumroad product URL: PASS
- Price context remains $9.99: PASS
- UTM fields use utm_source=website and utm_medium=checkout_cta: PASS
- Private test message does not appear in checkout URL: PASS
- CRITICAL issues: 0
- HIGH issues: 0

## Online QA Blocker

Vercel Preview protection must be removed or bypassed before true online browser QA can be marked PASS.