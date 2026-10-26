---
title: The Echo Box Production Deploy and Rollback
date: 2026-10-26
status: commands-only-not-authorized
---

# Production Deploy and Rollback

## Release system

- Repository: `https://github.com/samzhu168168/the-echo-box.git`
- Hosting: existing Vercel Git integration
- Production branch: `main`
- Canonical Production URL: `https://www.my-echo-box.com/`
- Local Vercel CLI/project link: unavailable; do not introduce a second deployment path.

## Pre-deployment commands

Run from `F:\MyTraeProjects\The Echo Box` on the clean, reviewed release commit:

```powershell
npm run build
npm run qa:distribution
npm run qa:wave1
npm run qa:links
node scripts/qa_seo_foundation.js dist
node scripts/qa_relaunch.js dist
$env:NODE_PATH='C:\Users\dxwfl\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
npm run qa:measurement
node scripts/qa_privacy_network.js
node scripts/qa_relaunch_flow.js
```

## Preview command (only after separate commit/push authorization)

```powershell
git push -u origin preview/echo-box-wave1-micro-os
```

Vercel Git integration should create the Preview. The owner must retrieve its exact URL from the Vercel/GitHub deployment check. If Preview protection is enabled, use Vercel's authenticated/Shareable Link flow; do not disable security merely to make an automated test pass.

## Production command (not authorized now)

After the exact Preview commit passes Gate A, merge that reviewed commit to `main` through the repository's normal review workflow, then the existing Git deployment trigger is:

```powershell
git push origin main
```

Do not run this from the current dirty branch. Do not force-push. Record the release commit and Vercel deployment ID before post-deployment QA.

## Post-deployment checks

1. Confirm `https://www.my-echo-box.com/` and key assets return actual HTTP success, not a timeout or Vercel login page.
2. Run desktop and 390 px mobile Reset → completion → paid CTA journey without purchasing.
3. Confirm exact `$14.90` website/schema and exact Gumroad buyer price.
4. Confirm UTM values survive to the unchanged Gumroad destination.
5. Confirm the five Plausible events and zero private-content leakage.
6. Run crawler, links, sitemap, robots and canonical checks against Production.

## Rollback

Fastest operational rollback: in Vercel, promote/redeploy the immediately previous known-good Production deployment recorded before release. Then verify homepage, Reset, product page, Gumroad destination, sitemap and Guides.

Git rollback, only with explicit authorization and from an updated clean `main`:

```powershell
git pull --ff-only origin main
git revert <RELEASE_COMMIT>
git push origin main
```

Never use `git reset --hard` or force-push. Do not change Gumroad during website rollback unless the owner separately authorizes it. If website and Gumroad prices become inconsistent, stop traffic and label that interval invalid for conversion analysis.

Deployment authorization: `NOT GRANTED`
