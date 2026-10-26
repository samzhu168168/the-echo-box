---
title: The Echo Box Staging QA
date: 2026-10-26
status: local-pass-preview-required
---

# Staging QA

## Candidate identity

- Branch: `preview/echo-box-wave1-micro-os`
- Base HEAD: `578dc41aef0d8892d2eaecacad8b2cc9f5f9cb9a`
- Working tree: dirty with the approved P0/price candidate plus unrelated pre-existing files.
- Hosting: existing Vercel Git integration; Production branch is `main`.
- Local Vercel CLI: not installed/available.
- Independent current Preview: `NOT CREATED` in this gate.

## Re-run results

| Check | Result | Evidence |
|---|---|---|
| `npm run build` | PASS | `dist` rebuilt with 47 files |
| `npm run qa:distribution` | PASS | Distribution-native QA |
| `npm run qa:wave1` | PASS | 20/20 rules |
| `npm run qa:links` | PASS | 31 HTML files, 497 links, 0 failures |
| `node scripts/qa_seo_foundation.js dist` | PASS | Canonical/schema/SEO assertions |
| `node scripts/qa_relaunch.js dist` | PASS | 16 Guides, 16 unique titles |
| `npm run qa:measurement` | PASS | Event separation, provider coverage, UTM, privacy, price and URL locks |
| `node scripts/qa_privacy_network.js` | PASS | 35 requests; no privacy-canary leakage; private data local-only |
| Local desktop flow | PASS | Existing flow test exited successfully; no purchase submitted |
| Mobile 390×844 | PASS (prior same candidate evidence) | No horizontal completion overflow |
| Current public Preview | NOT VERIFIED | No new Preview deployment authorized |
| Current Production crawler | INCONCLUSIVE | External attempt timed out/no structured result; not reported as HTTP PASS |

The first non-escalated build/browser run was blocked by the read-only execution environment (`EPERM` / local network denied). Re-running with project write/local-browser permission passed; this is recorded as an environment issue, not hidden as a product pass.

## Preview gate

After price confirmation and explicit authorization to commit/push, use the existing Git integration:

```powershell
git push -u origin preview/echo-box-wave1-micro-os
```

Because the branch currently tracks that remote and the current approved changes are uncommitted, pushing now would **not** publish this candidate. A clean, reviewed release commit is required first. Do not use `npx vercel` here: the CLI is unavailable and the repository already has a deployment system.

Preview must then be checked for Free Reset start/completion, desktop and 390 px mobile layout, UTM handoff, privacy network behavior, analytics request shape, exact Gumroad URL, Offer schema, canonical, sitemap/robots and crawler HTTP status. Historical Preview protection means a Vercel Shareable Link or authenticated reviewer may be required.

Staging gate: `BLOCKED — CURRENT PREVIEW NOT VERIFIED`

