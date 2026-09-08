---
title: The Echo Box September 2026 SEO GEO Content Map
date: 2026-09-08
status: implementation-map
---

# SEO/GEO Content Map

## New intent map

| New Guide | Primary intent | Distinct job to be done | Commercial role |
|---|---|---|---|
| `should-i-text-my-ex-on-our-anniversary.html` | Should I text my ex on our anniversary? | Separate a date-triggered memory from a current reason to contact | Soft reset-kit CTA after decision support |
| `how-to-text-your-ex-when-you-have-to.html` | How to text your ex when you have to | Complete necessary logistics with a SHORT message | Highest intent; Reset Kit includes Necessary Communication Scripts |
| `how-to-handle-belongings-after-a-breakup.html` | Ex belongings, packages, mail and keys after a breakup | Organize and complete a practical handoff | Connects logistics intent to necessary-contact scripts |
| `wedding-invitation-after-breakup.html` | Wedding invitation after breakup | Separate RSVP logistics from emotional interpretation | Soft CTA after the decision reset |

## Planned two-way cluster

- `should-i-text-my-ex.html` ↔ anniversary, necessary-contact and wedding-invitation Guides.
- `i-broke-no-contact.html` ↔ anniversary and necessary-contact Guides.
- `should-i-text-my-ex-happy-birthday.html` ↔ anniversary Guide.
- necessary-contact Guide ↔ belongings Guide.
- anniversary Guide ↔ wedding-invitation Guide.
- wedding-invitation Guide ↔ belongings and necessary-contact Guides.

Existing pages receive links only in their Related Guides sections. No existing title, H1, meta description, canonical, body guidance, CTA, structured data or publication date changes.

## Metadata map

| URL | Title | Meta description |
|---|---|---|
| `/guides/should-i-text-my-ex-on-our-anniversary.html` | Should I Text My Ex on Our Anniversary? \| The Echo Box | Should you text your ex on your anniversary? Use three practical questions to separate a meaningful reason to contact them from an anniversary-triggered urge. |
| `/guides/how-to-text-your-ex-when-you-have-to.html` | How to Text Your Ex When You Have To \| The Echo Box | Learn how to text your ex when contact is necessary. Use a short, factual framework and neutral scripts for keys, bills, packages, belongings, and shared tasks. |
| `/guides/how-to-handle-belongings-after-a-breakup.html` | How to Handle Belongings After a Breakup \| The Echo Box | Handle an ex’s packages, keys, mail, and belongings after a breakup with practical handoffs and factual messages that do not reopen the relationship. |
| `/guides/wedding-invitation-after-breakup.html` | Wedding Invitation After a Breakup: What Now? \| The Echo Box | A wedding invitation still has both names after your breakup. Decide whether contact is needed, handle the RSVP, and keep logistics separate from the relationship. |

## Shared implementation rules

- Direct Short Answer immediately below the page header.
- Natural US English; no diagnosis, legal advice, custody advice, medical advice, fake research, reunion prediction or keyword stuffing.
- One free-reset CTA and one lower-page `$9.99` CTA using the existing `data-paid-kit-cta` pattern.
- Existing `landing_view` and `checkout_start` event pattern; no new analytics system or private-text properties.
- Article and BreadcrumbList JSON-LD only; visible and structured breadcrumbs both use the real `Home > Current Guide` hierarchy.
- Production Gumroad URL remains centralized in `commerce-config.js`; no URL is duplicated into article markup.
