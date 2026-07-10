# The Echo Box Growth, SEO, and GEO Audit

Date: 2026-07-10

## Executive conclusion

The site has a clear new product direction: a private breakup reset and 30-day no-contact kit. The largest growth blocker is not code quality. It is signal consistency: the live site, sitemap, legacy pages, social previews, analytics events, and owner verification steps must all point to the same topic before content expansion starts.

## Current state

- Primary product: The Echo Box Breakup Reset and 30-Day No Contact Reset Kit.
- Payment: Gumroad product is connected through `commerce-config.js`.
- Site type: static HTML/CSS/JS.
- Production domain: `https://www.my-echo-box.com/`.
- Legacy topic: Family Emergency Binder still exists and must be isolated from the new breakup reset positioning.

## P0 issues found

1. `sitemap.xml` still included Family Emergency Binder pages as crawl priorities.
2. The homepage footer linked to Family Emergency Binder as a primary footer item.
3. Trust pages were incomplete for search quality and AI answer engines.
4. Product page for the paid kit did not exist as a crawlable landing page.
5. Analytics event taxonomy was missing required return-visit, contact-filter, SEO-tool, and email-funnel placeholders.

## Actions taken

- Added noindex/follow to the legacy Family Emergency Binder page.
- Removed legacy Family Binder pages from the sitemap.
- Added crawlable pages for About, Editorial Policy, Sources, Contact, and the 30-Day No Contact Reset Kit.
- Added product, brand, website, web application, and breadcrumb schema where appropriate.
- Expanded analytics event allowlist without recording private user text.

## GEO readiness

The new trust pages improve answer-engine clarity by explicitly stating:

- what the product is,
- what it is not,
- privacy boundaries,
- safety boundaries,
- source and editorial standards,
- pricing and product facts.

This does not guarantee AI citations. It only improves entity consistency and crawlable explanation quality.

## Next batch

After Search Console and Bing verification, create the six high-intent SEO tool pages as separate pages, not in this batch.
