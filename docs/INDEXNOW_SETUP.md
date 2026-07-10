# IndexNow Setup

Date: 2026-07-10

## Recommendation

Prepare IndexNow, but do not submit URLs until the owner confirms production deployment and Bing Webmaster setup.

## Current status

IndexNow submission was not executed in this batch.

## Required production steps

1. Create a public key file at the site root, for example:
   - `https://www.my-echo-box.com/<indexnow-key>.txt`
2. Confirm the key file returns HTTP 200 in production.
3. Submit only important changed URLs:
   - `https://www.my-echo-box.com/`
   - `https://www.my-echo-box.com/30-day-no-contact-reset-kit.html`
   - `https://www.my-echo-box.com/about.html`
   - `https://www.my-echo-box.com/editorial-policy.html`
   - `https://www.my-echo-box.com/sources.html`
4. Log the response code and timestamp.

## Guardrails

- Do not submit preview URLs.
- Do not submit UTM URLs.
- Do not submit Gumroad URLs.
- Do not submit noindex legacy pages.
