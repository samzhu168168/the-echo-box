# Online Network Privacy Audit

Date: 2026-07-10
Preview URL under review: https://the-echo-mkb04h6lb-samzhu168168s-projects.vercel.app

## Current Status

BLOCKED: online network privacy QA cannot be completed until the protected Preview app is reachable.

## What Is Already Known

- Local network privacy audit passed in `docs/NETWORK_PRIVACY_AUDIT.md`.
- Local browser QA passed in `docs/BROWSER_QA_REPORT.md`.
- The current online Preview returns Vercel login HTML, not the app.
- Analytics is disabled by default until the owner provides a production analytics ID.

## Online Privacy Checks Still Required

Once protected access is available, verify:

- No unsent message text leaves the browser.
- No Reality Box text leaves the browser.
- No email, order id, buyer name, or Gumroad buyer data is collected.
- No local storage payload is sent to analytics.
- Purchase CTA click events contain only safe event names and CTA metadata.
- Gumroad checkout opens without leaking private user-written content in query params.
- No Automation Bypass Secret appears in requests except the single approved protection-bypass request.
- No secret appears in HTML, console logs, screenshots, or committed files.

## Status

WAITING_FOR_OWNER_AUTOMATION_BYPASS: yes
