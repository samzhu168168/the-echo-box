# Online Preview Browser QA

Date: 2026-07-10
Preview URL under review: https://the-echo-box-git-pivot-private-br-b3584d-samzhu168168s-projects.vercel.app
Access method: Vercel Shareable Link, security parameter redacted
Code commit under final test: aa1e3ca
Browser: Chrome headless through DevTools Protocol

## Current Status

PASS.

Tested 5 viewports and 140 browser checks. Failed checks: 0.

## Viewports

| Viewport | Size | Result |
|---|---:|---|
| Desktop | 1440x900 | PASS |
| Desktop | 1366x768 | PASS |
| iPhone 13 | 390x844 | PASS |
| iPhone SE | 375x667 | PASS |
| Android common | 390x844 | PASS |

## Core Flow Results

| Check | Result |
|---|---|
| Shareable Link opens app, not Vercel login | PASS |
| hero headline, textarea, and primary CTA exist | PASS |
| test message can be saved locally | PASS |
| 10-minute reset starts | PASS |
| trigger selection updates guidance | PASS |
| page refresh restores active reset state | PASS |
| reset completion reveals post-reset offer | PASS |
| No Contact counter can be created | PASS |
| Reality Box can be created and edited | PASS |
| Reality Box can be cleared | PASS |
| local data export controls trigger locally | PASS |
| clear all local data works | PASS |
| necessary-contact guidance works | PASS |
| safety page reachable | PASS |
| privacy page reachable | PASS |

## Issue Found And Fixed During QA

Initial online browser QA found a HIGH issue: `Clear local data` removed analytics storage and then immediately recreated a local analytics session/event by tracking after deletion.

Fix committed in `aa1e3ca`: the clear event is now recorded before local storage is removed, so the final state is actually clear.

Retest result: PASS in all 5 viewports.

## Gumroad CTA Results

| Entry | Result |
|---|---|
| Pricing CTA opens official No Contact Gumroad product URL | PASS |
| Post-reset CTA opens official No Contact Gumroad product URL | PASS |
| `utm_content=pricing` present for Pricing entry | PASS |
| `utm_content=post_reset` present for post-reset entry | PASS |
| CTA URLs do not include private user text | PASS |
| CTA URLs do not include Shareable Link security parameter | PASS |

No real purchase was attempted.

## Status

ONLINE_PREVIEW_BROWSER_QA: PASS
