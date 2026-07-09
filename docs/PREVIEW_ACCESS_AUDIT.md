# Preview Access Audit

Date: 2026-07-10
Preview URL tested: https://the-echo-mkb04h6lb-samzhu168168s-projects.vercel.app

## Result

The Preview deployment exists, but normal access is blocked by Vercel Authentication.

Direct HTTP request result:

| Check | Result |
|---|---|
| HTTP status | 200 |
| `X-Matched-Path` | `/login` |
| App HTML found | no |
| Vercel login/protection page found | yes |

This means the URL is not currently usable as an owner/customer review link.

## Deployment Protection Type

Observed type: Vercel Authentication / Standard Protection for Preview deployments.

Evidence:

- The response is a Vercel login page.
- The response header maps the request to `/login`.
- The actual The Echo Box app HTML is not returned.

## What Was Attempted

- Checked local environment variable names for Vercel token or bypass secret: none found.
- Checked Vercel CLI login state: no usable credentials found.
- Did not attempt to disable project-wide Deployment Protection.
- Did not touch production.
- Did not touch Gumroad.

## Shareable Link Status

WAITING_FOR_OWNER_SHAREABLE_LINK: yes

Codex cannot create a Shareable Link from this machine because no Vercel authentication or token is available.

Owner steps:

1. Open Vercel Dashboard.
2. Open project `the-echo-box` under `samzhu168168s-projects`.
3. Open the latest Preview deployment for branch `pivot/private-breakup-reset`.
4. In Deployment Protection or Access settings, create a Shareable Link for the deployment.
5. Keep that link private and send only the shareable review link if you want Codex to perform browser QA.

## Automation Bypass Status

WAITING_FOR_OWNER_AUTOMATION_BYPASS: yes

Codex cannot create an Automation Bypass Secret from this machine because no Vercel authentication or token is available.

Owner steps:

1. Open Vercel Dashboard.
2. Open project `the-echo-box`.
3. Go to Deployment Protection settings.
4. Create a Protection Bypass for Automation secret named `the-echo-box-preview-qa`.
5. Store it only as a local environment variable named `VERCEL_AUTOMATION_BYPASS_SECRET`.
6. Do not paste the secret into chat, docs, screenshots, Git commits, or issue text.

## Security Notes

- No bypass secret was available during this audit.
- No bypass secret was written to repository files.
- No shareable access parameter was written to repository files.
- Production protection was not changed.
