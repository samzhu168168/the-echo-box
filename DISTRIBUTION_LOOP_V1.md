---
title: "The Echo Box Distribution Loop V1"
project: "Distribution-Native Product Upgrade V1"
date: "2026-10-06"
phase: "1 — Product Loop Map"
---

# Distribution Loop V1

## V1 boundary

V1 implements only P0: reset completion, privacy-safe card, explicit share/copy/download actions, Person-2 CTA, referral attribution, and analytics. It does not add accounts, backend counters, user-generated public content, progress dashboards, milestone cards, daily prompts, gift routes, new SEO pages, or payment infrastructure.

## Core loop

| Stage | User behavior | Product response | Event |
|---|---|---|---|
| Entry | Arrives during an urge | Immediate private message box | `landing_view` |
| Core action | Starts typing | No content leaves browser | `unsent_message_started` |
| Pause | Starts 10-minute reset | Local timer and trigger guidance | `reset_started` |
| Completion | Timer reaches zero | “You didn’t send it” state | `reset_completed` |
| Artifact | Chooses to generate card | Fixed-copy card; no private text | `reset_card_generated` |
| Distribution | Downloads, shares, or copies link | Explicit user action only | `reset_card_downloaded`, `share_clicked`, `share_link_copied` |
| Person 2 | Opens tagged reset URL | Immediate reset entry | `referral_visit` |
| Value extension | Opens Reality Box | Action-oriented reality check | `reality_box_opened` |
| Paid intent | Chooses 30-Day Reset | Contextual paid CTA | `paid_cta_clicked`, `checkout_started` |

## Share artifact

The artifact uses fixed text only:

> I almost texted them.
>
> I didn’t.
>
> 10-minute reset completed.
>
> The Echo Box

The card contains no form values, names, message text, notes, dates, relationship details, usernames, or phone numbers. It is rendered locally with Canvas using system fonts and no remote image dependencies.

## Person-2 entry

Both the completion state and a quiet homepage section offer “Send them the reset.” The share destination is the Production homepage with:

`?ref=reset-card&utm_source=share&utm_medium=organic&utm_campaign=reset_card`

No message content appears in the URL. A referred visitor enters the same private reset tool and may later share it with another person.

## Paid conversion

The free experience remains first. The completion state offers three next actions in order:

1. Keep going — start another reset.
2. Check reality — open Reality Box.
3. Make this easier tomorrow — continue to the existing `$9.99` 30-Day Reset.

The offer remains a one-time Gumroad purchase. No aggressive overlay, scarcity, recovery guarantee, or get-your-ex-back claim is introduced.

## Privacy invariants

- Sharing is never automatic.
- Card and URL are derived from constants, not user input.
- Analytics accept only allowlisted event names and properties.
- Private message text remains local and is not included in Plausible calls.
- Data deletion continues to remove local reset and analytics data.

## Success metrics

- Product-borne referral rate: referred visits / completed resets.
- Reset completion rate: completed resets / started resets.
- Share action rate: share, copy, or download actions / completed resets.
- Referred reset rate: referred visitors who start a reset / referred visits.
- Free-to-paid intent: paid CTA clicks / completed resets.
- Checkout intent: checkout starts / paid CTA clicks.

## Backlog

- P1: private progress, milestone artifacts, and Today’s Reset routing.
- P2: gift pathway and additional experiments.
- Neither phase is authorized by completion of P0.
