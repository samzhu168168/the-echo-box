# Technical SEO and Performance Notes

Date: 2026-07-10

## Architecture

The site remains static HTML/CSS/JS. No React, Next.js, database, membership system, or AI chat was introduced.

## Crawlability

- `robots.txt` allows general crawling.
- Googlebot is explicitly allowed.
- Bingbot is explicitly allowed.
- OAI-SearchBot is explicitly allowed.
- GPTBot is explicitly disallowed pending owner approval.
- Sitemap points to the current breakup reset pages and trust pages.

## Indexing controls

- Homepage has self canonical.
- Product page has self canonical.
- New trust pages have self canonicals.
- Legacy Family Emergency Binder has noindex/follow and self canonical.

## Structured data

Implemented:

- Brand
- WebSite
- WebApplication
- Product
- BreadcrumbList

Not implemented:

- MedicalWebPage
- Therapy schema
- fake reviews
- aggregateRating without real reviews

## Performance considerations

The current site is lightweight. The main remaining risk is image payload size and social-preview image caching, not JavaScript volume.

## Recommended next test

After preview deployment, run:

- mobile visual inspection,
- sitemap fetch,
- robots fetch,
- product page HTML validation,
- schema.org validator or Google Rich Results Test.
