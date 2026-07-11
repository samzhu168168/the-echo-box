# SEO Foundation Production Browser QA

Date: 2026-07-11
Production URL: https://www.my-echo-box.com/
Production commit: f529f8a

## Result

PASS with local Chrome headless.

AutoGLM browser automation was attempted earlier in this production batch but could not be used because the account reported no credits left. The final browser QA used local Chrome headless through the DevTools protocol.

## Viewports

- Homepage, iPhone 13: `390 x 844`, no horizontal overflow.
- Homepage, iPhone SE: `375 x 667`, no horizontal overflow.
- Product page, iPhone 13: `390 x 844`, no horizontal overflow.
- Product page, iPhone SE: `375 x 667`, no horizontal overflow.
- About page, Android width: `390 x 844`, no horizontal overflow.
- Contact page, Android width: `390 x 844`, no horizontal overflow.
- Homepage desktop: `1440 x 900`, no horizontal overflow.
- Product page desktop: `1440 x 900`, no horizontal overflow.

## Tooling

- Script: `scripts/qa_production_layout.js`
- Production command: `node scripts\\qa_production_layout.js https://www.my-echo-box.com`

