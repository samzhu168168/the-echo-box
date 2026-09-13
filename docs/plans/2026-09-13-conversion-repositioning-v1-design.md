---
title: "The Echo Box Conversion Repositioning V1 Design"
date: 2026-09-13
status: implementation-approved-by-brief
---

# Conversion Repositioning V1

## Decision

Keep the current static HTML/CSS/JavaScript architecture and free-reset interaction. Reposition only the customer-facing offer layer so a visitor sees one product with two depths: the free reset for the current spike and the $9.99 30-Day Breakup Reset System for recurring triggers over the next month.

## Change boundary

- Update homepage positioning, add static scenario and free-versus-paid sections, and retain the working reset tools.
- Reposition the existing product page at its current URL; retain Product/Breadcrumb schema, Gumroad checkout architecture, and the downloadable delivery disclosure lower on the page.
- Replace paid CTA blocks across the 12 current Guides without rewriting informational copy or changing Guide metadata.
- Update product naming in customer-facing navigation, contact, privacy, and terms text.
- Update existing QA assertions to protect the new positioning, price, Gumroad URL, SEO metadata, local-only private text, UTM behavior, and mobile layouts.

## Data flow

Paid buttons keep `data-paid-kit-cta` and their current `data-placement`. `app.js` continues to build the Gumroad URL from `commerce-config.js`, add existing UTM fields, and emit the existing anonymous `checkout_start` event. No draft or Reality Box field is added to event properties. Local reset state, export, delete, clear, timer, counter, and Reality Box logic remain unchanged.

## Acceptance

Build and static QA must pass before browser QA. Browser QA covers 375/390/430 mobile, 1280/1440 desktop, the free-reset flow, localStorage, clear/delete controls, anonymous event capture, privacy network inspection, and Gumroad/UTM behavior. Production deployment is allowed only with zero blocking regressions.
