# SEO Foundation Production HTTP QA

Date: 2026-07-11
Production URL: https://www.my-echo-box.com/
Production commit: f529f8a

## Result

PASS.

## Checked URLs

- `/`
- `/30-day-no-contact-reset-kit.html`
- `/about.html`
- `/editorial-policy.html`
- `/sources.html`
- `/contact.html`
- `/privacy.html`
- `/terms.html`
- `/safety.html`
- `/family-emergency-binder.html`
- `/robots.txt`
- `/sitemap.xml`
- `/style.css`
- `/app.js`
- `/analytics.js`
- `/commerce-config.js`
- `/assets/echo-box-breakup-reset-social-20260710-v2.png`
- `/assets/echo-box-30-day-no-contact-reset-kit-cover.png`

## Assertions

- All checked URLs returned HTTP 200.
- Homepage links to `30-day-no-contact-reset-kit.html`.
- Homepage private forms include default submit guards.
- `app.js` includes `echoBoxBreakupResetReady`.
- Product page shows `$9.99`.
- Product page does not suggest recurring subscription billing.
- Product JSON-LD includes Product offer price `9.99` and currency `USD`.
- `family-emergency-binder.html` remains `noindex`.
- Sitemap excludes legacy family/emergency/medical pages.
- `robots.txt` includes `OAI-SearchBot`.
- `robots.txt` does not allow `GPTBot`.
- `commerce-config.js` points to the approved Gumroad URL.
- `analytics.js` remains disabled.
- Mobile overflow CSS fix is live.
- No local/preview strings were found on homepage or product page.

