# Preview Access Security Review

Date: 2026-07-10

## Scope

This review covers the Preview access fix attempt for:

- Project: `the-echo-box`
- Branch: `pivot/private-breakup-reset`
- Preview URL: https://the-echo-mkb04h6lb-samzhu168168s-projects.vercel.app

## Security Decision

Do not disable project-wide Deployment Protection.

Reason: the owner authorized Shareable Link and Automation Bypass creation, but explicitly did not authorize disabling protection across the project or production.

## Secret Handling

Current status:

- No Vercel token variable name was found in the local environment.
- No Automation Bypass Secret variable name was found in the local environment.
- No secret value was printed.
- No secret value was written to docs.
- No secret value was committed.
- No shareable link query parameter was committed.

If the owner creates an Automation Bypass Secret, it must be handled as temporary test-only access:

- Store it only in a local environment variable.
- Do not paste it into chat.
- Do not place it in `.env` unless `.env` is ignored and the file is local-only.
- Do not include it in screenshots.
- Revoke it in Vercel after QA if it is no longer needed.

## Allowed Next Step

Owner can provide either:

- A Vercel Shareable Link for human browser QA.
- A local Automation Bypass Secret set as `VERCEL_AUTOMATION_BYPASS_SECRET` for automated HTTP/browser/network QA.

## Blockers

- WAITING_FOR_OWNER_SHAREABLE_LINK: yes
- WAITING_FOR_OWNER_AUTOMATION_BYPASS: yes
- WAITING_FOR_OWNER_PRODUCTION_APPROVAL: yes
