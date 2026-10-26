---
title: The Echo Box Website 14.90 Release Gate
date: 2026-10-26
status: blocked
---

# Gate A — Website $14.90 Release

| Requirement | Status |
|---|---|
| Website price and Offer schema are `$14.90` | PASS (local) |
| Existing Gumroad permalink unchanged | PASS (local) |
| Gumroad fixed `$14.90`; PWYW disabled | PASS — HUMAN CONFIRMED 2026-10-26 |
| Build and critical local QA | PASS |
| Free Reset regression | PASS (local) |
| UTM continuity | PASS (local) |
| Privacy network canary | PASS (local) |
| Current Preview/Staging | BLOCKED — NOT CREATED/VERIFIED |
| Plausible authenticated receipt | BLOCKED — NOT VERIFIED |
| Public crawler/HTTP evidence | INCONCLUSIVE — external timeout, not an HTTP failure |
| Rollback path | PASS — documented |
| Production authorization | NOT GRANTED |

## Verdict

`WEBSITE: BLOCKED`

Blocking conditions are evidence gates, not requests for more development:

1. The existing Vercel Preview for the exact reviewed commit passes staging/manual QA.
2. Authenticated Plausible shows the expected five-event journey without private content, or remains explicitly accepted as an outstanding human check.
3. Owner explicitly grants Production deployment authorization in a later instruction.

Affiliate eligibility is intentionally excluded from Gate A and cannot block the website release once these four items pass.

