# The Echo Box 14-Day Relaunch Phase 1 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a Preview-only conversion and SEO/GEO Phase 1 that moves breakup/no-contact visitors into the free ten-minute reset and then the unchanged $9.99 Gumroad kit.

**Architecture:** Keep the existing static HTML/CSS/JavaScript application and privacy-first localStorage model. Refine the homepage in place, add five crawlable static guide pages with shared styling, normalize anonymous funnel events through the existing analytics adapter, and extend the existing static build/QA scripts without adding dependencies.

**Tech Stack:** Static HTML5, CSS, vanilla JavaScript, Node.js build/QA scripts, Vercel Preview.

---

### Task 1: Baseline audit and branch isolation

**Files:**
- Inspect: `index.html`, `style.css`, `app.js`, `analytics.js`, `commerce-config.js`
- Inspect: `scripts/build_dist.js`, `scripts/qa_production_layout.js`, `scripts/qa_seo_foundation.js`

**Step 1:** Confirm the current branch, dirty worktree, checkout URL, price, and static build architecture.

**Step 2:** Create `feat/echo-box-relaunch-2026-08-31` without staging unrelated untracked assets.

**Step 3:** Record the exact files authorized for this phase.

### Task 2: Homepage conversion and metadata

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Modify: `app.js`

**Step 1:** Replace the homepage title, meta description, Open Graph copy, Twitter copy, H1, subheadline, CTA, and trust line with the approved brief.

**Step 2:** Remove the old hero copy experiment so runtime JavaScript cannot overwrite the approved H1/subheadline.

**Step 3:** Reposition the kit as the next step after tonight while preserving the free reset as the first value and preserving the Gumroad URL/price.

**Step 4:** Add the low-interruption `Common moments` module after the core reset experience.

**Step 5:** Add responsive rules so 375px, 390px, 430px, and desktop have no horizontal overflow and the input/CTA remain high in the mobile reading order.

### Task 3: Anonymous funnel event normalization

**Files:**
- Modify: `analytics.js`
- Modify: `app.js`
- Modify: `index.html`

**Step 1:** Add the requested canonical event names: `landing_view`, `echo_start`, `reset_start`, `reset_complete`, `kit_view`, `checkout_start`.

**Step 2:** Restrict provider properties to `page_slug`, `cta_location`, `utm_source`, `utm_medium`, and `utm_campaign`.

**Step 3:** Confirm message and relationship text never enter analytics payloads.

**Step 4:** Preserve localStorage-only message storage and UTM forwarding to the unchanged Gumroad checkout URL.

### Task 4: Five independent guide pages

**Files:**
- Create: `guides/should-i-text-my-ex.html`
- Create: `guides/my-ex-texted-me-during-no-contact.html`
- Create: `guides/i-broke-no-contact.html`
- Create: `guides/should-i-text-my-ex-happy-birthday.html`
- Create: `guides/i-miss-my-ex-at-night.html`
- Modify: `style.css`

**Step 1:** Write a unique direct answer, next-ten-minutes steps, moment-specific scenarios, necessary-contact boundaries, and urge-related cautions for each query.

**Step 2:** Add the free reset CTA, secondary $9.99 kit CTA, 2–3 related-guide links, and About/Editorial/Sources/Safety links.

**Step 3:** Add unique title/meta/canonical/Open Graph/Twitter data plus honest `Article` and `BreadcrumbList` JSON-LD.

**Step 4:** Keep all answer content crawlable in static HTML and avoid FAQ schema, invented experts, statistics, diagnosis, and outcome promises.

### Task 5: Crawlability and static build

**Files:**
- Modify: `sitemap.xml`
- Verify: `robots.txt`
- Modify: `scripts/build_dist.js`

**Step 1:** Add the five canonical, indexable guides to the sitemap with the 2026-08-31 last-modified date.

**Step 2:** Copy the `guides` pages into `dist` during the existing dependency-free build.

**Step 3:** Confirm robots permits homepage/guides and excludes no required static asset.

### Task 6: Automated QA

**Files:**
- Modify: `scripts/qa_seo_foundation.js`
- Modify: `scripts/qa_production_layout.js`
- Create: `scripts/qa_relaunch.js`

**Step 1:** Add deterministic checks for one H1, unique titles/descriptions, canonical URLs, guide schema, internal links, event allowlist, privacy restrictions, sitemap entries, robots, Gumroad URL, and $9.99 price.

**Step 2:** Build `dist` and run SEO/relaunch checks; expected result: PASS.

**Step 3:** Serve `dist`, verify HTTP 200 for homepage and all five guides, and verify Gumroad CTA reachability without completing a purchase.

**Step 4:** Run browser QA at 375px, 390px, 430px, and 1440px; expected result: no horizontal overflow and free reset/timer/localStorage flows work.

### Task 7: Preview and handoff

**Files:**
- Create: `docs/ECHO_BOX_RELAUNCH_PHASE1_QA_2026-08-31.md`

**Step 1:** Record changed files, new URLs, before/after homepage copy, guide title/H1/intent, indexing checks, analytics events, Gumroad regression, mobile QA, build status, unresolved items, and risks.

**Step 2:** Create a Vercel Preview from the feature branch only; do not promote Production.

**Step 3:** Smoke-test the Preview and label every unverified acceptance criterion `NOT VERIFIED`.
