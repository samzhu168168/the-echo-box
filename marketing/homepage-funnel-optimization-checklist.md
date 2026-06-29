---
title: The Echo Box Homepage Funnel Optimization Checklist
created: 2026-06-29
status: draft
owner: Codex
---

# Homepage Funnel Optimization Checklist

Objective: improve the path from cold visitor to free checklist to $9.99 binder to $19.99 Family Pack without changing the product direction.

## Priority 1: Fix the Main Decision Path

- [ ] Make "Download the free checklist" the dominant hero CTA for cold traffic.
- [ ] Keep "Build my emergency file" as the secondary CTA.
- [ ] Move "Use sample data" below the fold or keep it only inside the builder section.
- [ ] Add one line under the hero CTA: "Free starter checklist. Upgrade only when you need the full printable binder."

Success metric:
- Free checklist click rate from homepage reaches 8%-15%.

## Priority 2: Add Free vs Full Binder Comparison

Add a comparison block before pricing:

| Feature | Free Checklist | Full Binder Kit |
|---|---|---|
| One-page starter checklist | Yes | Yes |
| Printable section pages | No | Yes |
| Parent conversation script | Short version | Full version |
| Update routine | No | Yes |
| Storage guidance | No | Yes |
| Space for detailed notes | Limited | Yes |

Success metric:
- Gumroad outbound click rate reaches 3%-8% of page visitors.

## Priority 3: Answer the PDF Objection

Add a block titled: "Why printable, not another app?"

Core copy:

Emergency information should not depend on a password, phone battery, or internet connection. A printable binder can sit with insurance cards, keys, medication lists, and important papers. It is easier for a spouse, adult child, neighbor, or caregiver to open in a hard moment.

Success metric:
- Lower bounce rate on cold traffic pages.
- More clicks from SEO/Pinterest visitors to free checklist.

## Priority 4: Make Family Pack Real

- [ ] Create or connect a real $19.99 Family Pack Gumroad product.
- [ ] Add a purchase button to the Family Pack card.
- [ ] Label it "Best for families helping parents."
- [ ] Add a post-purchase upsell or Gumroad variant if available.

Success metric:
- Family Pack reaches 10%-25% of paid orders.
- Average order value rises above $12.

## Priority 5: Add Product Preview Proof

- [ ] Add 3-5 preview images of the paid PDF pages.
- [ ] Show the sections: medications, insurance, documents, bills, pets/home, conversation script.
- [ ] Keep private details fake and clearly sample-only.

Success metric:
- Gumroad click-to-purchase conversion improves after preview images are added.

## Priority 6: Tracking

Track these events:

- `homepage_free_checklist_click`
- `homepage_builder_click`
- `free_checklist_print_click`
- `paid_binder_outbound_click`
- `family_pack_outbound_click`
- `aging_parents_guide_cta_click`

Decision rules:

- If visitors do not click the free checklist, rewrite hero and CTA.
- If visitors click Gumroad but do not buy, fix Gumroad cover, previews, description, refund promise, and delivery explanation before changing price.
- If the free checklist gets usage but paid clicks stay low, strengthen Free vs Full Binder contrast.
