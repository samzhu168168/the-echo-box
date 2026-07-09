# Preview Smoke Test

Date: 2026-07-09
Preview deployment URL: https://the-echo-qkc6498q9-samzhu168168s-projects.vercel.app
Git commit tested: 67631df0f94588e0305802d3868ca5084d27ea14
Deployment source: GitHub status created by Vercel bot

## Summary

Vercel deployment was created successfully, but the public Preview URL is protected by Vercel login/protection. HTTP requests return Vercel /login content with X-Matched-Path: /login, not the site HTML.

Result: BLOCKED for public Preview smoke testing.

## Smoke Test Matrix

| Check | Status | Evidence |
|---|---|---|
| Preview deployment exists | PASS | GitHub deployment 5376652249, state success |
| Homepage HTTP reachable | BLOCKED | URL returns Vercel login page, not site content |
| CSS loads | BLOCKED | Protected Preview prevents content verification |
| app.js loads | BLOCKED | Protected Preview prevents content verification |
| analytics.js loads | BLOCKED | Protected Preview prevents content verification |
| commerce-config.js loads | BLOCKED | Protected Preview prevents content verification |
| favicon loads | BLOCKED | Protected Preview prevents reliable site verification |
| Privacy page | BLOCKED | Protected Preview prevents content verification |
| Terms page | BLOCKED | Protected Preview prevents content verification |
| Safety page | BLOCKED | Protected Preview prevents content verification |
| Family Emergency Binder legacy page | BLOCKED | Protected Preview prevents content verification |
| robots.txt | BLOCKED | Protected Preview prevents content verification |
| sitemap.xml | BLOCKED | Protected Preview prevents content verification |
| canonical | BLOCKED | Protected Preview returns Vercel login HTML |
| Open Graph | BLOCKED | Preview returns Vercel login HTML |
| Gumroad product page | PASS | Public Gumroad page returned HTTP 200 in smoke check |

## Required Owner Action

Disable Preview protection for this deployment/project, provide a Vercel bypass URL/token, or log the browser session into the Vercel account, then rerun Preview smoke testing.