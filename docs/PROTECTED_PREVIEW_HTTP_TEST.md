# Protected Preview HTTP Test

Date: 2026-07-10
Preview URL tested: https://the-echo-mkb04h6lb-samzhu168168s-projects.vercel.app

## Current Status

BLOCKED: protected access credentials are not available in this Codex session.

## Direct Request Result

| Check | Result |
|---|---|
| HTTP status | 200 |
| `X-Matched-Path` | `/login` |
| Content type | `text/html; charset=utf-8` |
| App HTML found | no |
| Vercel login/protection page found | yes |

The Preview server is reachable, but it returns Vercel Authentication HTML instead of The Echo Box.

## Bypass Request Result

Not run.

Reason: no Automation Bypass Secret is available locally, and this audit must not invent or expose one.

## Required Pass Criteria After Owner Provides Bypass

- HTTP 200 returns The Echo Box app HTML, not `/login`.
- Homepage contains current breakup reset messaging.
- Pricing section contains `Get the 30-Day Reset Kit - $9.99`.
- Gumroad URL points to `echo-box-30-day-no-contact-reset-kit`.
- No local file path appears in HTML.
- No secret or protection bypass value appears in HTML.

## Status

WAITING_FOR_OWNER_AUTOMATION_BYPASS: yes
