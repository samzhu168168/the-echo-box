# Crawler Production QA

Date: 2026-07-11
Production URL: https://www.my-echo-box.com/
Production commit: f529f8a

## Result

PASS.

## Robots

Checked: `https://www.my-echo-box.com/robots.txt`

Confirmed:

- `OAI-SearchBot` is present.
- `GPTBot` is not allowed.
- Sitemap is declared.

## Sitemap

Checked: `https://www.my-echo-box.com/sitemap.xml`

Confirmed sitemap excludes:

- `family-emergency-binder.html`
- `medical-information-sheet-for-elderly-parent.html`
- `emergency-binder-for-aging-parents.html`

## Legacy Isolation

`family-emergency-binder.html` remains available but is marked `noindex`, and it is not included in the sitemap.

