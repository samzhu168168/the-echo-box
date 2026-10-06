---
title: "The Echo Box Distribution-Native V1 QA"
project: "The Echo Box"
date: "2026-10-06"
environment: "LOCAL DIST"
final_status: "PASS WITH MINOR RISKS"
---

# Distribution-Native QA

## Test results

| Check | Result | Evidence |
|---|---|---|
| JavaScript syntax | PASS | `node --check` on `app.js`, `analytics.js`, QA scripts |
| Distribution static QA | PASS | Required UI/events/UTMs/Gumroad found; card builder contains no private-state tokens |
| Build | PASS | `npm run build` → `Built dist with 43 files.` |
| Internal links | PASS | 29 HTML files; 460 links checked; 0 failures |
| SEO foundation | PASS | Existing local SEO foundation script |
| Existing complete reset flow | PASS | Timer, persistence, Reality Box, no-contact, completion, paid CTA, checkout |
| Private message network leak | PASS | Sentinel appeared in 0 network requests; local-only result true |
| Analytics contains draft | PASS | False at runtime |
| Analytics property restriction | PASS | Only allowlisted properties found |
| UTM persistence | PASS | Share UTM survived funnel and Gumroad checkout URL |
| Canvas card generation | PASS | 390px browser run drew non-transparent pixels and enabled download/share controls |
| Completion state, 375px | PASS | Full browser flow; no horizontal overflow |
| Completion state, 390px | PASS | Full browser flow; no horizontal overflow |
| Completion state, 430px | PASS | Full browser flow; no horizontal overflow |
| Whole-site responsive layout | PASS | 61 viewport/page targets; 0 overflow failures |
| Local data survives refresh | PASS | Existing reset state restore remains active; completed state restores from reset timestamp |
| Delete message | PASS | Runtime browser test |
| Clear all data | PASS | Runtime browser test; also removes V2 attribution |
| Existing Gumroad destination | PASS | Exact URL unchanged and runtime checkout opens with UTM |
| Existing SEO pages/navigation | PASS | Build + link + 61-target layout QA |

## Privacy audit

- Card text is a fixed constant set; no user input is interpolated.
- Share text is fixed; share URLs contain only controlled referral and UTM values.
- Event names and properties are allowlisted.
- Message text is not accepted as an analytics property and did not appear in captured requests.
- Plausible receives only selected funnel events and safe properties.
- Attribution stores only controlled UTM/referral fields in localStorage.
- Sharing requires an explicit click; nothing posts automatically.
- No account, database, API, server counter, fake activity count, or public user content was added.

## Commands run

```text
node --check app.js
node --check analytics.js
node --check scripts/qa_distribution_native.js
npm run qa:distribution
npm run build
npm run qa:links
node scripts/qa_seo_foundation.js dist
node scripts/qa_privacy_network.js http://127.0.0.1:4173/
node scripts/qa_production_layout.js http://127.0.0.1:4173
node scripts/qa_relaunch_flow.js http://127.0.0.1:4173/?utm_source=share&utm_medium=organic&utm_campaign=reset_card&ref=reset-card
```

The reset flow was run at 375×812, 390×844, 430×932, and desktop. The whole-site layout suite covered 61 targets.

## Lint and typecheck

- `lint`: NOT AVAILABLE — no lint script or linter dependency exists.
- `typecheck`: NOT AVAILABLE — this is plain browser JavaScript and no typecheck script exists.
- Syntax checks and the project build were used instead; both passed.

## Minor risks

1. The native operating-system Web Share sheet cannot be fully asserted in headless Chrome. Code path and fallback are present; manual device QA is still recommended before Production deployment.
2. Plausible dashboard receipt of the newly named events is not authenticated in this local QA. Local event creation, property filtering, and provider call eligibility passed code/runtime checks.
3. No Production deployment was authorized, so Production behavior remains unchanged.

## Rollback

Revert only the six modified source/QA files and remove the six new documentation/QA files listed in `IMPLEMENTATION_CHANGELOG.md`, then rerun `npm run build`. Do not delete unrelated untracked workspace content.

## Final status

PASS WITH MINOR RISKS — native share-sheet UI and authenticated Plausible receipt require post-deployment/manual evidence; all local build, privacy, responsive, funnel, checkout, and card-generation checks passed.
