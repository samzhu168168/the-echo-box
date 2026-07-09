# UTM Map - 7-Day Breakup Reset Validation

Base landing page: https://www.my-echo-box.com/

Primary campaign: `breakup_reset_validation_01`

## Naming Rules

- `utm_source`: platform name, such as `tiktok`, `youtube`, `instagram`, `x`
- `utm_medium`: `organic_video`, `organic_post`, or `profile_link`
- `utm_campaign`: `breakup_reset_validation_01`
- `utm_content`: `day##_video##` for short videos, `day##_x##` for X posts

## Video Links

| Day | Video | Source | Medium | UTM content | Link |
|---|---:|---|---|---|---|
| 1 | 1 | tiktok | organic_video | day01_video01 | https://www.my-echo-box.com/?utm_source=tiktok&utm_medium=organic_video&utm_campaign=breakup_reset_validation_01&utm_content=day01_video01 |
| 1 | 2 | tiktok | organic_video | day01_video02 | https://www.my-echo-box.com/?utm_source=tiktok&utm_medium=organic_video&utm_campaign=breakup_reset_validation_01&utm_content=day01_video02 |
| 2 | 1 | tiktok | organic_video | day02_video01 | https://www.my-echo-box.com/?utm_source=tiktok&utm_medium=organic_video&utm_campaign=breakup_reset_validation_01&utm_content=day02_video01 |
| 2 | 2 | tiktok | organic_video | day02_video02 | https://www.my-echo-box.com/?utm_source=tiktok&utm_medium=organic_video&utm_campaign=breakup_reset_validation_01&utm_content=day02_video02 |
| 3 | 1 | tiktok | organic_video | day03_video01 | https://www.my-echo-box.com/?utm_source=tiktok&utm_medium=organic_video&utm_campaign=breakup_reset_validation_01&utm_content=day03_video01 |
| 3 | 2 | tiktok | organic_video | day03_video02 | https://www.my-echo-box.com/?utm_source=tiktok&utm_medium=organic_video&utm_campaign=breakup_reset_validation_01&utm_content=day03_video02 |
| 4 | 1 | tiktok | organic_video | day04_video01 | https://www.my-echo-box.com/?utm_source=tiktok&utm_medium=organic_video&utm_campaign=breakup_reset_validation_01&utm_content=day04_video01 |
| 4 | 2 | tiktok | organic_video | day04_video02 | https://www.my-echo-box.com/?utm_source=tiktok&utm_medium=organic_video&utm_campaign=breakup_reset_validation_01&utm_content=day04_video02 |
| 5 | 1 | tiktok | organic_video | day05_video01 | https://www.my-echo-box.com/?utm_source=tiktok&utm_medium=organic_video&utm_campaign=breakup_reset_validation_01&utm_content=day05_video01 |
| 5 | 2 | tiktok | organic_video | day05_video02 | https://www.my-echo-box.com/?utm_source=tiktok&utm_medium=organic_video&utm_campaign=breakup_reset_validation_01&utm_content=day05_video02 |
| 6 | 1 | tiktok | organic_video | day06_video01 | https://www.my-echo-box.com/?utm_source=tiktok&utm_medium=organic_video&utm_campaign=breakup_reset_validation_01&utm_content=day06_video01 |
| 6 | 2 | tiktok | organic_video | day06_video02 | https://www.my-echo-box.com/?utm_source=tiktok&utm_medium=organic_video&utm_campaign=breakup_reset_validation_01&utm_content=day06_video02 |
| 7 | 1 | tiktok | organic_video | day07_video01 | https://www.my-echo-box.com/?utm_source=tiktok&utm_medium=organic_video&utm_campaign=breakup_reset_validation_01&utm_content=day07_video01 |
| 7 | 2 | tiktok | organic_video | day07_video02 | https://www.my-echo-box.com/?utm_source=tiktok&utm_medium=organic_video&utm_campaign=breakup_reset_validation_01&utm_content=day07_video02 |
## Website Events To Watch

- `landing_page_view`
- `unsent_message_started`
- `unsent_message_saved_local`
- `reset_started`
- `reset_completed`
- `pricing_viewed`
- `paid_kit_cta_clicked`
- `gumroad_checkout_opened`

## Decision Rules After 7 Days

- Keep a hook if it gets above-average landing page visits or reset starts.
- Rewrite a hook if views happen but landing clicks are weak.
- Rewrite the website CTA if reset completions happen but paid-kit clicks are weak.
- Do not judge paid demand until Gumroad checkout is live and the product URL is connected.
