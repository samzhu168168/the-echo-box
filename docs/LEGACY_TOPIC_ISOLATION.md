# Legacy Topic Isolation

Date: 2026-07-10

## Problem

The site previously focused on Family Emergency Binder. The current product direction is Private Breakup Reset and No Contact Reset Kit. Mixing both as primary topics weakens SEO, GEO, and conversion clarity.

## Decision

Keep `family-emergency-binder.html` accessible, but isolate it from the new primary site architecture.

## Actions taken

- Added `<meta name="robots" content="noindex,follow">` to `family-emergency-binder.html`.
- Removed Family Binder URLs from `sitemap.xml`.
- Removed Family Binder from the homepage footer.
- Kept a self-canonical on the legacy page.

## Not done

- No redirect was added.
- No production claim was made.
- No Gumroad Family Binder product was modified.

## Rationale

Noindex keeps the legacy page available for direct users while preventing it from competing with the new breakup reset entity.
