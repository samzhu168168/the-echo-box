# QA Report

## Manual QA targets

- / loads Breakup Reset homepage
- /family-emergency-binder.html loads old Family Emergency Binder page
- Unsent Message starts timer
- Do not save mode clears the message after reset starts
- Trigger buttons update guidance
- No-contact counter saves and restarts
- Reality Box saves, exports, and clears
- Necessary contact filter updates guidance
- Privacy, terms, and safety pages load

## Automated checks available

This repo has no package.json and no configured build/lint/test script. Verification must use static file checks, JS syntax check, and browser smoke testing.

## Known gaps

No mobile screenshot QA has been run yet in this session. No deployment preview has been opened yet.
## Checks run on 2026-07-09

Passed:

- node --check app.js
- git diff --check, with line-ending warnings only
- New homepage search: old Google Analytics ID not present
- New homepage search: old Family Emergency Binder Gumroad URL not present
- Family Emergency Binder route search: old product title, GA ID, and Gumroad URL still present

Not run:

- Full browser screenshot QA
- Deployed production smoke test
- Real Gumroad checkout test for Breakup Reset, because checkout is intentionally pending