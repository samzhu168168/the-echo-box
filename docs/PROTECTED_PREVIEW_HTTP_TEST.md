# Protected Preview HTTP Test

Date: 2026-07-10
Preview URL tested: https://the-echo-box-git-pivot-private-br-b3584d-samzhu168168s-projects.vercel.app
Access method: Vercel Shareable Link, security parameter redacted
Code commit under test: aa1e3ca

## Current Status

PASS: protected Preview is reachable through the owner-provided Shareable Link and returns The Echo Box app HTML, not Vercel login HTML.

## Direct Shareable-Link Request Result

| Check | Result |
|---|---|
| HTTP status | 200 |
| `X-Matched-Path` | empty / not `/login` |
| Content type | `text/html; charset=utf-8` |
| App HTML found | yes |
| Vercel login/protection page found | no |
| Hero/app copy found | yes |
| Paid kit copy found | yes |

## Cookie-Session Request Result

After the initial shareable-link request, same-session access to the normal Preview host returned app HTML.

| Path | Result |
|---|---|
| `/` | PASS |
| `/style.css` | PASS |
| `/app.js` | PASS |
| `/analytics.js` | PASS |
| `/commerce-config.js` | PASS |
| `/favicon.ico` | PASS |
| `/privacy.html` | PASS |
| `/terms.html` | PASS |
| `/safety.html` | PASS |
| `/family-emergency-binder.html` | PASS |
| `/robots.txt` | PASS |
| `/sitemap.xml` | PASS |
| `/assets/echo-box-30-day-no-contact-reset-kit-cover.png` | PASS |

## Gumroad Config Checks

| Check | Result |
|---|---|
| `enabled=true` | PASS |
| `provider=gumroad` | PASS |
| product name is No Contact Reset Kit | PASS |
| price is `$9.99` | PASS |
| checkout URL points to official No Contact product | PASS |
| no old Family Binder Gumroad product URL in config | PASS |
| product version exists | PASS |

## Gumroad Product Page Check

Official product page returned HTTP 200. Product title and `$9.99` price text were found. No purchase was attempted.

## Status

WAITING_FOR_OWNER_SHAREABLE_LINK: no
WAITING_FOR_OWNER_AUTOMATION_BYPASS: no
