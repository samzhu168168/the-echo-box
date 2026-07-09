# Online Preview Browser QA

Date: 2026-07-10
Preview URL under review: https://the-echo-mkb04h6lb-samzhu168168s-projects.vercel.app

## Current Status

BLOCKED: the Preview URL opens Vercel Authentication instead of the The Echo Box app.

## Completed Evidence

- Local browser QA passed in `docs/BROWSER_QA_REPORT.md`.
- Local purchase flow QA passed in `docs/LOCAL_PURCHASE_FLOW_QA.md`.
- Online direct HTTP request confirms the current Preview is protected.

## Mobile Online QA

Status: not run.

Reason: the protected Preview app cannot be reached without a Shareable Link or Automation Bypass Secret.

Required checks once access is available:

- iPhone-sized viewport loads the app, not Vercel login.
- Hero, reset flow, pricing CTA, and post-reset CTA are visible and usable.
- No copy or controls overlap.
- Gumroad CTA opens the correct product URL in a new tab or modal.

## Desktop Online QA

Status: not run.

Reason: the protected Preview app cannot be reached without a Shareable Link or Automation Bypass Secret.

Required checks once access is available:

- Desktop viewport loads the app, not Vercel login.
- Core reset flow works from entry to completion.
- Pricing CTA shows `Get the 30-Day Reset Kit - $9.99`.
- Post-reset offer CTA opens the correct Gumroad product.

## Status

WAITING_FOR_OWNER_SHAREABLE_LINK: yes
WAITING_FOR_OWNER_AUTOMATION_BYPASS: yes
