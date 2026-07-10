# Production Release Report

Date: 2026-07-10
Project: The Echo Box

## Release Summary

The Echo Box breakup reset homepage is live in production at https://www.my-echo-box.com/.

Launch status: LIVE_WITH_ANALYTICS_PENDING

## Production Deployment

| Item | Value |
|---|---|
| Production URL | https://www.my-echo-box.com/ |
| Vercel production target | https://vercel.com/samzhu168168s-projects/the-echo-box/AgNVyxbSUrMymRCg8h2tH61PpoYs |
| Deployment ID | AgNVyxbSUrMymRCg8h2tH61PpoYs |
| Production branch | main |
| Released commit | 1a7b94288ab3b49302f4833b69dc0d49af618596 |
| Release tag | the-echo-box-breakup-reset-v1.0.0 |
| Previous production commit | 30d989c1a76b5b4557a063bd9075a5bf305914d4 |
| Previous production deployment | BjT35txzqLxiu1fr2MazhDB7F3pv |

## Gumroad Product

| Item | Value |
|---|---|
| Product | The Echo Box - 30-Day No Contact Reset Kit |
| Price | $9.99 one-time |
| URL | https://samzhu168.gumroad.com/l/echo-box-30-day-no-contact-reset-kit |
| Public page QA | PASS |

No Gumroad product changes were made in this production deployment round.

## Production QA Results

| Area | Result |
|---|---|
| HTTP smoke | PASS |
| Desktop browser QA | PASS |
| Mobile browser QA | PASS |
| Core reset flow | PASS |
| Gumroad Pricing CTA | PASS |
| Gumroad post-reset CTA | PASS |
| Network privacy audit | PASS |
| Analytics disabled check | PASS |
| Family Emergency Binder legacy route | PASS |

## Known Open Items

1. Analytics provider setup is still pending.
2. Shareable Link revocation still requires owner/Vercel account action.
3. Day 1 content performance must be tracked manually until analytics is connected.
4. Older legacy marketing files still contain Family Binder links and should not be used for this reset launch.

## Rollback

Fastest rollback: use Vercel dashboard to promote or redeploy the previous production deployment:

- BjT35txzqLxiu1fr2MazhDB7F3pv

Git rollback path from a clean `main` branch:

```bash
git revert --no-commit 30d989c1a76b5b4557a063bd9075a5bf305914d4..1a7b94288ab3b49302f4833b69dc0d49af618596
git commit -m "revert: rollback breakup reset production launch"
git push origin main
```

Do not change Gumroad during rollback unless separately approved.