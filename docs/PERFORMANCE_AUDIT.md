# Performance Audit

Date: 2026-07-09
Scope: deployable dist package

## Summary

The deployable package is a small static site. The main performance fix in this round was replacing the oversized 1.2MB favicon with an approximately 11KB favicon.

## Dist File Sizes

Total dist bytes: 1507646

| File | Bytes |
|---|---:|
| analytics.js | 4469 |
| app.js | 28449 |
| assets/echobox_icon.png.png | 1214616 |
| assets/echobox_social.jpg.jpg | 92553 |
| assets/echo-box-30-day-no-contact-reset-kit-cover.png | 55696 |
| commerce-config.js | 323 |
| emergency-binder-for-aging-parents.html | 16635 |
| family-emergency-binder.html | 16460 |
| favicon.ico | 11567 |
| free-checklist.html | 8761 |
| index.html | 14629 |
| medical-information-sheet-for-elderly-parent.html | 15400 |
| privacy.html | 2874 |
| robots.txt | 74 |
| safety.html | 1645 |
| sitemap.xml | 1563 |
| style.css | 19417 |
| terms.html | 2515 |

## Findings

| Area | Result | Notes |
|---|---|---|
| HTML size | PASS | Homepage is small enough for static delivery |
| CSS size | PASS | Single CSS file, no blocking external font request |
| JS size | PASS | No framework bundle; app and analytics are plain JS |
| Images | PASS | Only required social/icon assets are in dist |
| Favicon | PASS | Reduced from oversized copied PNG to real ICO |
| External fonts | PASS | No external font dependency on the new homepage |
| Gumroad scripts | PASS | No Gumroad script loaded on first paint; checkout opens only on click |
| Internal directories | PASS | dist does not include docs, marketing, products, backups, .git, output, or release |

## Recommendation

Do not add video, large screenshots, session replay, or heavy third-party scripts before the first 7-day traffic test is measured.