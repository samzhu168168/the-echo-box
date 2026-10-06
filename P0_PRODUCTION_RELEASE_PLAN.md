---
title: "The Echo Box P0 Production Release Plan"
project: "Distribution-Native Product Upgrade V1"
date: "2026-10-06"
status: "READY FOR HUMAN MOBILE QA"
deployment_authorized: false
---

# P0 Production Release Plan

## Pre-deployment gate

PRE_DEPLOYMENT_STATUS = PASS

- `npm run build`: PASS — 43 files built into local `dist/`.
- `npm run qa:distribution`: PASS.
- `npm run qa:links`: PASS — 29 HTML files, 460 links, 0 failures.
- Privacy/network QA: PASS — 26 requests, 0 private-draft leaks, local-only storage confirmed.
- Responsive QA: PASS — 61 page/viewport targets, 0 overflow failures.

No Production deployment, commit, IndexNow submission, sitemap submission, or indexing request was performed.

## Exact files to deploy

The existing build process republishes its 43-file allowlist, but the P0 Production behavior delta is limited to these four deployable files:

1. `index.html`
2. `style.css`
3. `app.js`
4. `analytics.js`

Release-support repository files that should accompany the release commit but do not create additional Production routes:

- `package.json`
- `scripts/qa_distribution_native.js`
- `scripts/qa_relaunch_flow.js`
- `CURRENT_ARCHITECTURE.md`
- `DISTRIBUTION_LOOP_V1.md`
- `IMPLEMENTATION_CHANGELOG.md`
- `DISTRIBUTION_NATIVE_QA.md`
- `P0_PRODUCTION_RELEASE_PLAN.md`
- `P0_LIVE_ANALYTICS_VERIFICATION.md`
- `docs/plans/2026-10-06-distribution-native-v1.md`

Do not deploy unrelated untracked workspace files.

## Expected Production behavior changes

- When the 10-minute timer completes, the user sees “You didn't send it.”
- The completion state offers another reset, Reality Box, and the existing 30-Day Reset.
- The user may explicitly generate a fixed-copy privacy-safe Reset Card.
- The user may download the card, open the native Share sheet, or copy a referral link.
- A lower homepage action lets a person send the private reset to a friend.
- Referred visitors return to the existing homepage reset experience.
- First/last safe UTM and referral attribution persist locally.

No P1/P2 behavior, new route, price change, payment change, storage redesign, sitemap change, or SEO-page change is included.

## Expected analytics events

- `landing_view`
- `unsent_message_started`
- `reset_started`
- `reset_completed`
- `reset_card_generated`
- `reset_card_downloaded`
- `share_clicked`
- `share_link_copied`
- `referral_visit`
- `reality_box_opened`
- `no_contact_started`
- `paid_cta_clicked`
- `checkout_started`

Only allowlisted event properties may be emitted: page slug, CTA location, approved UTM values, approved referral source, and share method. Private draft content is prohibited.

## Expected referral parameters

Reset Card link:

```text
https://www.my-echo-box.com/?ref=reset-card&utm_source=share&utm_medium=organic&utm_campaign=reset_card
```

Person-2 link:

```text
https://www.my-echo-box.com/?ref=friend-share&utm_source=share&utm_medium=organic&utm_campaign=send_reset
```

No private input, identity, note, message, or relationship detail may appear in either URL.

## Gumroad confirmation

- Destination remains: `https://samzhu168.gumroad.com/l/echo-box-30-day-no-contact-reset-kit`
- Price remains: `$9.99`
- Purchase remains one time; no subscription.
- Checkout continues to append safe UTM and CTA-placement parameters.

## Privacy invariants

1. Unsent message and Reality Box data stay in the existing local browser storage architecture.
2. Share-card copy is fixed and never reads private state.
3. Sharing always requires an explicit user action.
4. Private text is absent from share URLs, Canvas output, analytics, metadata, and network requests.
5. Delete/Clear controls continue to remove local reset, analytics, and attribution data.
6. No accounts, database, public user content, fake counters, or automatic posting are introduced.

## Human mobile QA before deployment authorization

Repeat the following on iPhone/Safari and Android/Chrome:

1. Open the Production homepage.
2. Enter a harmless test draft.
3. Start the reset and reach completion.
4. Generate the Reset Card.
5. Tap Share and confirm the native system Share sheet opens.
6. Confirm the private draft is absent from the card, share text, and URL.
7. Confirm the URL contains only approved referral/UTM parameters.
8. Cancel sharing and confirm the page remains functional.
9. Test Copy Link and Download Card.
10. Open the copied link in a private/incognito browser.
11. Confirm it opens the existing private reset experience.

Because Production has not yet changed, this checklist should be performed on an authorized Preview or immediately after an explicitly authorized controlled deployment. Do not treat the current Production site as having P0 before deployment.

## Post-deployment verification checklist

- Homepage HTTP 200.
- Existing 16 Guides and product page remain HTTP 200.
- Reset start and 10-minute completion work.
- Completion state appears once per completed reset.
- Canvas card contains fixed copy only.
- Native Share opens on real iPhone and Android.
- Copy Link and PNG download work.
- Referral URL opens the correct experience in an isolated browser.
- Safe attribution persists; private text does not appear in event payloads.
- All 13 required events can be observed in Plausible as the matching actions are performed.
- `$9.99` CTA opens the unchanged Gumroad destination with UTM parameters.
- Delete/Clear local data still works.
- 375/390/430px have no horizontal scrolling.
- Browser console has no fatal error.

## Rollback procedure

1. Record the exact pre-release Production commit/deployment ID before release.
2. If a privacy leak, broken reset, broken checkout, fatal JavaScript error, or unusable mobile layout appears, stop the validation immediately.
3. Redeploy the recorded pre-release Production commit through the repository's normal Vercel rollback/redeploy workflow.
4. Verify homepage, Reset, local deletion, product page, Gumroad destination, sitemap, and Guides after rollback.
5. Do not patch Production manually and do not use destructive Git reset commands.

Rollback triggers:

- Any private draft in analytics, share content, URL, metadata, or network request.
- Reset start/completion unavailable.
- Gumroad checkout destination or price changed.
- Fatal console error blocking the flow.
- Horizontal overflow or unusable actions on 375/390/430px.

## Freeze

Until enough live evidence exists, do not change Hero, share-card copy, CTA copy, timer length, price, paid product, checkout, or milestone logic. P1/P2 remain frozen.
