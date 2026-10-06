---
title: "Distribution-Native Product Upgrade V1 Implementation Plan"
project: "The Echo Box"
date: "2026-10-06"
---

# Distribution-Native Product Upgrade V1 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a privacy-safe post-reset referral loop to the existing static breakup-reset product without adding dependencies, routes, accounts, or backend storage.

**Architecture:** Extend the existing homepage reset flow with a dedicated completion state and fixed-copy share artifact. Keep all progress and attribution in local browser storage, route referrals back to the current homepage, and extend the existing analytics allowlist without ever accepting private message content.

**Tech Stack:** Static HTML, CSS, browser JavaScript, Canvas, Web Share API, Clipboard API, localStorage, Plausible wrapper, Node-based build/QA scripts.

---

### Task 1: Document the current architecture and loop

**Files:**
- Create: `CURRENT_ARCHITECTURE.md`
- Create: `DISTRIBUTION_LOOP_V1.md`

**Steps:** Audit routing, local storage, analytics, checkout, CTA order, reusable styles, and privacy risks. Record a strict P0 boundary and P1/P2 backlog.

### Task 2: Add the completion and Person-2 interface

**Files:**
- Modify: `index.html`
- Modify: `style.css`

**Steps:** Add a hidden completion state after the timer, three next actions, fixed-copy card preview, generate/download/share/copy controls, and a lower-page Person-2 CTA. Reuse the existing design system and add responsive behavior for 375/390/430 px.

### Task 3: Implement the privacy-safe loop

**Files:**
- Modify: `app.js`

**Steps:** Make reset completion idempotent, reveal the completion state, generate a local Canvas card from constants only, support PNG download, use native share when available, copy the referral URL otherwise, and connect Person-2 CTAs. Never read message or Reality Box data while building share content.

### Task 4: Extend analytics and attribution

**Files:**
- Modify: `analytics.js`
- Modify: `app.js`

**Steps:** Add the requested canonical events, retain legacy names in the allowlist for historical compatibility, persist first/last allowlisted attribution locally, classify referral visits, and forward only safe funnel properties.

### Task 5: Add deterministic QA

**Files:**
- Create: `scripts/qa_distribution_native.js`
- Modify: `package.json`

**Steps:** Assert required markup/events/privacy labels, forbid private input use in the card builder, verify referral parameters and unchanged Gumroad URL, then run existing crawler/link and browser checks where available.

### Task 6: Build and document delivery

**Files:**
- Create: `IMPLEMENTATION_CHANGELOG.md`
- Create: `DISTRIBUTION_NATIVE_QA.md`

**Steps:** Run syntax check, static QA, build, link QA, crawler/source checks, and available browser tests. Record exact results, limitations, files, routes, events, privacy proof, and P1/P2 backlog. Do not deploy or commit unless separately authorized.
