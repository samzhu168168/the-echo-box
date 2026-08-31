---
title: The Echo Box Relaunch Phase 1 QA Report
date: 2026-08-31
status: preview-ready
branch: feat/echo-box-relaunch-2026-08-31
---

# The Echo Box 14-Day Relaunch — Phase 1 QA

## 1. Changed files

Modified:

- `index.html`
- `style.css`
- `analytics.js`
- `app.js`
- `sitemap.xml`
- `scripts/build_dist.js`
- `scripts/qa_production_layout.js`

Created:

- `guides/should-i-text-my-ex.html`
- `guides/my-ex-texted-me-during-no-contact.html`
- `guides/i-broke-no-contact.html`
- `guides/should-i-text-my-ex-happy-birthday.html`
- `guides/i-miss-my-ex-at-night.html`
- `scripts/qa_relaunch.js`
- `scripts/qa_relaunch_flow.js`
- `docs/plans/2026-08-31-echo-box-relaunch-phase-1.md`
- `docs/ECHO_BOX_RELAUNCH_PHASE1_QA_2026-08-31.md`

No new runtime dependency was added. Existing untracked marketing, media, analytics, and QA assets were not staged or modified for this release.

## 2. New URLs

- `https://www.my-echo-box.com/guides/should-i-text-my-ex.html`
- `https://www.my-echo-box.com/guides/my-ex-texted-me-during-no-contact.html`
- `https://www.my-echo-box.com/guides/i-broke-no-contact.html`
- `https://www.my-echo-box.com/guides/should-i-text-my-ex-happy-birthday.html`
- `https://www.my-echo-box.com/guides/i-miss-my-ex-at-night.html`

Production availability: **NOT VERIFIED**. The URLs exist in the local Preview build only until human approval and a later Production promotion.

## 3. Homepage Before / After

Before:

- H1: `Alone at night with their chat open?`
- Supporting copy opened with: `Put the message here before the room gets quieter and the urge gets louder.`
- The runtime A/B experiment could replace the hero and CTA.
- Kit heading: `Ready for more structure?`

After:

- H1: `About to text your ex? Don't send it yet.`
- Subheadline: `Write it here instead. Start a private 10-minute breakup reset. No account. Nothing gets sent. Your message stays in this browser.`
- Primary CTA: `Put it in the box for 10 minutes`
- Trust line: `Private · Local browser storage · Delete anytime`
- Kit heading: `Get through tonight. Make the next 30 days easier.`
- Kit CTA: `Get the 30-Day Reset Kit — $9.99`
- Support: `One-time purchase. No subscription.`
- The old hero A/B overwrite was removed so approved copy remains stable.

## 4. Guide title / H1 / intent

| URL slug | Title | H1 | Search intent |
|---|---|---|---|
| `should-i-text-my-ex` | Should I Text My Ex? Pause Before You Send \| The Echo Box | Should I text my ex? | Decide whether the current urge or a practical need is driving contact. |
| `my-ex-texted-me-during-no-contact` | My Ex Texted During No Contact — What Now? \| The Echo Box | My ex texted me during no contact. What now? | Triage an incoming message before replying. |
| `i-broke-no-contact` | I Broke No Contact — What Should I Do Next? \| The Echo Box | I broke no contact. What should I do next? | Stop the follow-up spiral and restart from the next choice. |
| `should-i-text-my-ex-happy-birthday` | Should I Text My Ex Happy Birthday? \| The Echo Box | Should I text my ex happy birthday? | Separate a simple greeting from a reason to reopen contact. |
| `i-miss-my-ex-at-night` | I Miss My Ex at Night — What Can I Do? \| The Echo Box | I miss my ex at night. What can I do? | Get through a late-night wave without deciding from it. |

All five direct answers are 55–62 words. Each page has unique scenarios, static crawlable copy, one H1, Article + BreadcrumbList schema, 2–3 related-guide links, and About/Editorial/Sources/Safety links. No FAQPage schema was added.

## 5. Sitemap

**PASS.** `sitemap.xml` contains all five canonical guide URLs with `lastmod` set to `2026-08-31`. No checkout callback, private result, analytics endpoint, development URL, or Preview URL was added.

## 6. Robots

**PASS.** Homepage and `/guides/` are allowed. `OAI-SearchBot` remains allowed. The existing explicit GPTBot training restriction remains unchanged and does not block the requested AI search crawler.

## 7. Canonical

**PASS (local static inspection).** Homepage canonical is `https://www.my-echo-box.com/`. Each guide has one self-referencing HTTPS canonical. UTM query parameters are not included in canonical URLs.

## 8. Analytics events

Canonical anonymous funnel events:

- `landing_view`
- `echo_start`
- `reset_start`
- `reset_complete`
- `kit_view`
- `checkout_start`

Provider properties are restricted to:

- `page_slug`
- `cta_location`
- `utm_source`
- `utm_medium`
- `utm_campaign`

Privacy network QA: **PASS**. A unique sentinel message was stored in localStorage and was absent from 21 observed network requests. It was also absent from the local analytics event log.

Plausible dashboard receipt of custom events: **NOT VERIFIED** because the old account is unavailable. Event calls remain compatible with the existing adapter and do not block the independent site flow.

## 9. Gumroad regression

- Checkout URL unchanged: `https://samzhu168.gumroad.com/l/echo-box-30-day-no-contact-reset-kit`
- Price unchanged: `$9.99`
- Subscription model unchanged: one-time purchase
- URL reachability on 2026-08-31: **PASS**, HTTP 200
- Purchase completion: **NOT TESTED**; no transaction was made.

## 10. Mobile QA

Automated overflow QA:

- 375 × 667: **PASS**, document width 375, no overflowing elements
- 390 × 844: **PASS**, document width 390, no overflowing elements
- 430 × 932: **PASS**, document width 430, no overflowing elements
- Guide at 390 × 844: **PASS**, no overflowing elements
- Desktop 1440 × 900: **PASS**, no overflowing elements

Visual screenshot review: **NOT VERIFIED**. The local command-line screenshot attempt did not produce files because Chrome process reuse interfered; automated DOM geometry and interaction QA completed successfully.

## 11. Build / typecheck

- `node scripts/build_dist.js`: **PASS**, 31 deploy files
- `node scripts/qa_relaunch.js dist`: **PASS**, 5 guides / 5 unique titles
- `node scripts/qa_seo_foundation.js dist`: **PASS**
- Internal static link check: **PASS**, no missing local targets
- `node --check` for application/build/QA JavaScript: **PASS**
- TypeScript typecheck: **NOT APPLICABLE**; the project has no TypeScript or package-level typecheck command.

## 12. Preview URL

[Vercel Preview](https://the-echo-box-git-feat-echo-box-re-00d0b2-samzhu168168s-projects.vercel.app)

- Git/Vercel deployment status: **PASS**
- Vercel Preview Comments check: **PASS**, no unresolved feedback
- Anonymous HTTP content smoke test: **NOT VERIFIED** because Vercel Authentication redirects unauthenticated requests to the Vercel login page
- Direct Vercel CLI path: unavailable because the local npm security lock returned `ECOMPROMISED: Lock compromised`; no security lock was bypassed
- Production deployment/promotion: **NOT PERFORMED**

## 13. Unfinished items

- Open the authenticated Vercel Preview and run the human visual check at 375/390/430/desktop.
- Confirm real custom-event arrival only if a usable analytics account is configured later.

## 14. Risks

- Without access to the Plausible dashboard, code-level event correctness does not prove dashboard ingestion.
- Guide pages are new and have no ranking, crawl, or conversion history yet.
- Vercel Authentication prevents an anonymous external smoke test; authenticated visual review remains a manual gate before any Production promotion.
- Historical untracked files make broad `git add .` unsafe; release staging must remain file-specific.

## 15. Single Next Action

Open the Vercel Preview created from `feat/echo-box-relaunch-2026-08-31` and approve or reject the mobile hero before any Production promotion.
