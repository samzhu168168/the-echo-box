# Preview Precheck - The Echo Box

Date: 2026-07-09
Branch: pivot/private-breakup-reset
HEAD: 2ae1a2ecf86795e0dc31f8ea0db4472caadab371
Production deploy approved: false
Preview deploy approved: true
Gumroad product changes approved: false
Elemental Bond changes approved: false

## Git Remote

- origin: https://github.com/samzhu168168/the-echo-box.git

## Current Dirty Files Classification

### REQUIRED_FOR_PREVIEW

Files required by the current Preview are already committed in HEAD 2ae1a2e, including:

- index.html
- style.css
- app.js
- analytics.js
- commerce-config.js
- privacy.html
- terms.html
- safety.html
- family-emergency-binder.html
- robots.txt
- sitemap.xml
- favicon.ico
- products/echo-box-30-day-no-contact-reset-kit.zip
- release/the-echo-box-breakup-reset-v1.zip

### LEGACY_KEEP

Keep as legacy pages or old funnel artifacts. Do not delete in this round:

- family-emergency-binder.html
- emergency-binder-for-aging-parents.html
- free-checklist.html
- medical-information-sheet-for-elderly-parent.html

### SHOULD_IGNORE

Do not include in this round unless owner separately asks for cleanup:

- backups/
- output/
- old local scripts not needed for Preview
- generated screenshots or temporary browser artifacts

### NEEDS_OWNER_REVIEW

Current uncommitted files that are intentionally excluded from Preview commit unless owner asks:

``text
 M emergency-binder-for-aging-parents.html  M free-checklist.html  M medical-information-sheet-for-elderly-parent.html ?? assets/echobox-family-emergency-social-20260707.png ?? scripts/build_echo_box_data_test_2026_07_09_11.py ?? scripts/build_echo_box_pixelle_week_12.py ?? scripts/build_echo_box_short_videos.py ?? scripts/build_echo_box_voice_videos.py ?? scripts/build_social_preview_20260707.py
``

## Sensitive Information Check Scope

Before push/deploy, scan the deployable static files and release package for:

- API keys or tokens
- local absolute paths
- test private message text
- Gumroad buyer/order data
- user message or Reality Box content

## Deployment Rules

Allowed:

- Push pivot/private-breakup-reset branch
- Create Vercel Preview through existing Git integration or Vercel CLI
- Add minimal vercel.json only if static-site recognition is blocked

Forbidden:

- Production deploy
- DNS changes
- main branch overwrite
- Gumroad product changes
- Elemental Bond changes
- fake Preview URL or fake QA result

## Rollback

- Website code rollback from current latest commit: git revert 2ae1a2e
- Preview-only rollback: stop using the Preview URL or revert the Preview branch
- Gumroad rollback requires separate owner approval and is not included here
