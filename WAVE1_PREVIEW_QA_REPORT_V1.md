---
title: The Echo Box Wave 1 Preview QA Report V1
date: 2026-10-08
status: ready-for-human-preview
scope: preview-only
---

# The Echo Box — Wave 1 Preview QA Report V1

PREVIEW_DEPLOYED:
YES

PREVIEW_ACCESS:
PASS

PREVIEW_URL:
https://the-echo-box-git-preview-echo-box-3fa01f-samzhu168168s-projects.vercel.app?_vercel_share=EU3jrNkY7G2XmsRfiZuYAkC33CjhT1sv

PREVIEW_HOME_HTTP:
PASS

PAGE_1_PREVIEW_HTTP:
PASS

PAGE_2_PREVIEW_HTTP:
PASS

PAGE_1_LIVE_QA:
PASS

PAGE_2_LIVE_QA:
PASS

COUNTER_LIVE_PARITY:
PASS

PAGE_2_RULE_COVERAGE:
20/20

PAGE_2_FALL_THROUGH:
0

PRIVACY_LIVE_CANARY:
PASS

ANALYTICS_EVENT_CONTRACT:
PASS

ANALYTICS_REMOTE_INGESTION:
NOT_VERIFIABLE

ANALYTICS_DOUBLE_COUNT:
PASS

MOBILE_RENDER_QA:
PASS

CANONICAL_QA:
PASS

INTERNAL_LINK_QA:
PASS

EXISTING_PRODUCT_LIVE_REGRESSION:
PASS

PRODUCTION_CHANGES:
0

PRODUCTION_DEPLOYMENTS:
0

PRODUCTION_ALIAS_CHANGES:
0

INDEX_REQUESTS:
0

INDEXNOW_REQUESTS:
0

WAVE_2_CREATED:
NO

READY_FOR_HUMAN_PREVIEW:
YES

WAITING_FOR_HUMAN_PREVIEW_ACCEPTANCE:
YES

WAITING_FOR_HUMAN_PRODUCTION_AUTHORIZATION:
NO

## HTTP and routing evidence

All three Shareable Preview routes resolved to the application rather than the Vercel login wall. The Share token established a Preview session cookie and was removed from the final resolved application URLs.

- Homepage: `https://the-echo-box-git-preview-echo-box-3fa01f-samzhu168168s-projects.vercel.app/` — real application HTTP 200.
- Page 1: `https://the-echo-box-git-preview-echo-box-3fa01f-samzhu168168s-projects.vercel.app/tools/no-contact-day-counter.html` — real static application HTTP 200.
- Page 2: `https://the-echo-box-git-preview-echo-box-3fa01f-samzhu168168s-projects.vercel.app/tools/mixed-signals-from-ex-response-checker.html` — real static application HTTP 200.
- No Production redirect, redirect loop, authentication wall, or SPA fallback was observed.

## Mobile patch verification

The Page 1-only mobile spacing patch is live in Vercel deployment `8gHNv4SQD4Uw2Sny8oydKVNVoq2a` from commit `eadfd26cda1858d3bb0b234a2ec78f3741b5aa67`.

At the formal 390 × 844 gate, the complete `Calculate my time` button bounding box was:

`{ x: 27, y: 648.8125, width: 336, height: 50.796875, bottom: 699.609375 }`

The H1, elapsed-time limitation, in-browser privacy statement, datetime input, and complete primary CTA were visible without scrolling. No horizontal overflow was observed. Local responsive checks also passed at 360 × 800, 375 × 812, 390 × 844, and 430 × 932.

## Passed live evidence

- Page 1 elapsed-time cases passed for under one minute, around 24 hours, and 1/3/7/14/30 days.
- Empty input was blocked by native required-field validation; a future timestamp was rejected and did not overwrite stored state.
- Tool/Homepage Counter text matched for the same stored timestamp.
- Shared fields remained `echoBoxBreakupData.v1.lastContactAt` and `echoBoxBreakupData.v1.longestNoContactMs`.
- All five Restart Check choices returned only approved result types; restart required confirmation and preserved the longest record.
- Page 2 exposed no private-text/file/account inputs.
- Safety mode returned `DO_NOT_ENGAGE`, prioritized safety guidance, and hid the Paid CTA.
- One-contact mode routed to the existing single-message guide without a normal result or `tool_complete`.
- All 20 Page 2 pattern/goal combinations matched the locked matrix with zero fall-through.
- Start Over and refresh cleared Page 2 answers; browser history, storage, analytics, network, share, and Copy Link contained no raw answer sequence.
- `ECHOBOX_PREVIEW_CANARY_73192` did not appear in URL, analytics payload, network requests, local storage, share payload, copied link, card, console, or result narrative.
- Approved event names and bounded properties passed; forbidden synonyms and double counting were not observed.
- Remote Plausible ingestion could not be verified without authenticated analytics access.
- Page 1 and Page 2 canonicals pointed to the intended Production URLs with no Preview host or `_vercel_share` leakage.
- Structured data used `WebApplication` and `BreadcrumbList`; no fake reviews, ratings, usage counts, or medical-authority claims were observed.
- Eleven live internal links returned valid application HTTP 200 responses with no Share-token leakage.
- Homepage Hero, Free Reset, completion, Counter, Reset Card generation/download/share, Copy Link, Person-2 isolation, Reality Box clear, Necessary Contact filter, local export/clear, `$9.99` price, and existing Gumroad configuration passed Preview regression checks.
- No horizontal overflow was observed on Page 1, Page 2, Homepage, or desktop. The Page 1 primary action is fully visible at the formal mobile gate.

## Production safety

The deployment remained a Vercel Preview from commit `eadfd26cda1858d3bb0b234a2ec78f3741b5aa67` on branch `preview/echo-box-wave1-micro-os`. No Production deployment, alias/domain change, sitemap submission, IndexNow request, Search Console action, or Wave 2 creation occurred.
