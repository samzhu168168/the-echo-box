# Production Pre-Flight

Date: 2026-07-10
Project: The Echo Box
Production URL: https://www.my-echo-box.com/
Approved source branch: pivot/private-breakup-reset
Approved production commit: 1a7b94288ab3b49302f4833b69dc0d49af618596
Release tag: the-echo-box-breakup-reset-v1.0.0

## Owner Approval

Production deployment was explicitly approved for this round without analytics.

- PRODUCTION_DEPLOY_APPROVED: true
- PRODUCTION_WITHOUT_ANALYTICS_APPROVED: true
- MERGE_TO_PRODUCTION_BRANCH_APPROVED: true
- GUMROAD_CHANGES_APPROVED: false
- ELEMENTAL_BOND_CHANGES_APPROVED: false
- DELETE_LEGACY_FILES_APPROVED: false
- NEW_FEATURE_DEVELOPMENT_APPROVED: false

## Git Audit

| Item | Result |
|---|---|
| Current branch | pivot/private-breakup-reset |
| Production branch | main |
| Remote | https://github.com/samzhu168168/the-echo-box.git |
| Default branch | main |
| Previous production SHA | 30d989c1a76b5b4557a063bd9075a5bf305914d4 |
| Release SHA | 1a7b94288ab3b49302f4833b69dc0d49af618596 |
| Merge mode | Fast-forward push from pivot/private-breakup-reset to main |
| Force push used | No |

## Excluded Local Worktree Changes

The following local changes were present before production deployment and were intentionally excluded from production source because they are unrelated to the approved reset launch.

| File | Status | Production handling |
|---|---|---|
| emergency-binder-for-aging-parents.html | modified | Excluded from release |
| free-checklist.html | modified | Excluded from release |
| medical-information-sheet-for-elderly-parent.html | modified | Excluded from release |
| assets/echobox-family-emergency-social-20260707.png | untracked | Excluded from release |
| scripts/build_echo_box_data_test_2026_07_09_11.py | untracked | Excluded from release |
| scripts/build_echo_box_pixelle_week_12.py | untracked | Excluded from release |
| scripts/build_echo_box_short_videos.py | untracked | Excluded from release |
| scripts/build_echo_box_voice_videos.py | untracked | Excluded from release |
| scripts/build_social_preview_20260707.py | untracked | Excluded from release |

## Clean Source Build

A clean archive from commit `1a7b94288ab3b49302f4833b69dc0d49af618596` was extracted and built locally before production promotion.

| Check | Result |
|---|---|
| Build command | node scripts/build_dist.js |
| Output directory | dist |
| Dist file count | 18 |
| Build status | PASS |
| Release ZIP already available | release/the-echo-box-breakup-reset-v1.zip |

## Production Decision

Status: GO FOR PRODUCTION, with analytics intentionally pending.

Reason: preview QA, Gumroad URL verification, browser flow QA, and network privacy checks had already passed. Owner approved production without analytics.