# Privacy Review

## Current implementation

The new Breakup Reset homepage stores private user content in browser localStorage only:

- echoBoxBreakupData.v1
- echoBoxBreakupEvents.v1
- echoBoxBreakupSession.v1
- echoBoxBreakupExperiment.v1

The new homepage does not include Google Analytics, TikTok Pixel, Meta Pixel, external AI calls, or server submission.

## Content excluded from analytics

The local event tracker does not store:

- Unsent message body
- Reality Box content
- Names
- Phone numbers
- Emails
- Account credentials

Allowed local event details are limited to trigger, reason, save mode, and safety flag.

## Known limitation

localStorage is convenient but not high-security storage. The UI and privacy page tell users not to enter passwords, financial credentials, government ID numbers, or other highly sensitive secrets.

## Next privacy step

Before third-party analytics is added, create an event schema that excludes private text and test it with real browser events.