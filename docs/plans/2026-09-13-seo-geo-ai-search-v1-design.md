---
title: "The Echo Box SEO + GEO + AI Search Optimization V1 Design"
date: 2026-09-13
status: implementation-approved-by-brief
---

# SEO + GEO + AI Search Optimization V1

## Baseline decision

Production source HTML is current. Desktop Chrome, mobile Chrome, Googlebot Smartphone, and Bingbot received byte-identical HTML for both the homepage and product page. OAI-SearchBot received HTTP 200 with matching content headers through a separate curl check. The observed old copy is therefore treated as external cache/index lag, not crawler cloaking or a stale Vercel build.

## Implementation boundary

- Measure the homepage first fold and make only evidence-backed spacing/type adjustments.
- Add exactly four answer-first Guides for unblocking, sending something funny, calling, and necessary contact.
- Connect those pages through a small number of contextual and Related Guides links.
- Reuse Article/Breadcrumb schema and the current free/paid CTA architecture.
- Update sitemap, build manifest, crawler/SEO QA expectations, and IndexNow scope.
- Preserve price, Gumroad URL, analytics event names, localStorage, reset tools, visual identity, and crawler policy.

## Explicit exclusions

No `llms.txt`, fake `sameAs`, FAQ schema, VideoObject without a real embedded video, mass long-tail pages, UA-specific content, framework migration, or cache workaround. The reusable video pattern will be CSS/HTML-ready documentation only unless an exact matching production asset is verified.

## Verification gate

Compare human/crawler source HTML; validate direct answers, schema, canonicals, internal links, sitemap and robots; measure first-fold CTA visibility at 375/390/430 and 1280/1366/1440; run the full reset/localStorage/export/delete/Gumroad/UTM/privacy regression; deploy only with zero P0 failures; then repeat Production checks and submit only changed URLs to IndexNow.
