---
title: "The Echo Box — Wave 1 Pre-Code Patch V1"
date: 2026-10-07
status: final-spec-patch-only
approved_for_code: false
---

# Wave 1 Pre-Code Patch V1

## Scope

本 Patch 只修复 Wave 1 两页规格中的代码歧义、数据重复风险与 URL 路由错误。没有创建 HTML/Production JS/CSS，没有修改 sitemap、Guide、Gumroad、价格或 Homepage Hero。

## P0 Authorization Table

| P0 | Locked decision | Evidence / acceptance condition | Status |
|---|---|---|---|
| P0-01 Analytics names | 新增只允许 `tool_view/tool_start/tool_complete/share_action`；复用 `reset_started/paid_cta_clicked/checkout_started` | 一次动作一个事件；禁止三个同义事件 | PASS |
| P0-02 Page 2 rules | 5 patterns × 4 goals = 20 unique combinations | 20 covered；0 fall-through；safety 优先；one contact 不进矩阵 | PASS |
| P0-03 Page 1 Paid bridge | `USER-INITIATED OPTIONAL NEXT STEP` | 仅用户点击 `I want structure for the next 30 days` 后进入现有 Paid 路径 | PASS |
| P0-04 URL routing | HTML static URLs | `cleanUrls:false`；现有 `.html`=200，无扩展=404，尾斜杠重定向后无静态目标 | PASS |
| P0-05 Counter order | A extract → B homepage uses shared → C regression/parity → D create Page 1 | 禁止第二套临时实现；全部 parity case 通过才允许 D | PASS AS SPEC GATE |
| P0-06 Structured data | 可选、非排名假设、非 blocker | 无虚构 rating/review/usage/medical authority；FAQPage 只匹配可见 FAQ | PASS |

## Analytics Lock

新增事件仅允许：`tool_view`、`tool_start`、`tool_complete`、`share_action`。

继续复用 Production：`reset_started`、`paid_cta_clicked`、`checkout_started`。

禁止：`reset_start`、`paid_cta_click`、`checkout_start`。

ANALYTICS_DOUBLE_COUNT_RISK: PASS。若未来代码出现任一 forbidden synonym 或一次动作发两个同义事件，状态立即变为 FAIL 并停止 Wave 1。

## Page 2 Complete Decision Matrix

Safety positive 在矩阵前统一输出 `DO_NOT_ENGAGE + safety_mode`。`ONE CONTACT ONLY` 路由 `/guides/my-ex-texted-me-during-no-contact.html`，不发送 `tool_complete/result_type`。

| Pattern \\ Goal | ANSWER_A_CLEAR_REQUEST | SEE_IF_ACTION_BECOMES_CONSISTENT | KEEP_CONTACT_PRACTICAL | STOP_OR_REDUCE_CONTACT |
|---|---|---|---|---|
| CLEAR_AND_CONSISTENT | BRIEF_REPLY | WAIT_FOR_CONSISTENCY | SET_BOUNDARY | DO_NOT_ENGAGE |
| WARM_THEN_ABSENT | WAIT_FOR_CONSISTENCY | WAIT_FOR_CONSISTENCY | SET_BOUNDARY | DO_NOT_ENGAGE |
| LOW_EFFORT_ONLY | WAIT_FOR_CONSISTENCY | WAIT_FOR_CONSISTENCY | SET_BOUNDARY | DO_NOT_ENGAGE |
| LOGISTICS_THEN_EMOTIONAL | SET_BOUNDARY | SET_BOUNDARY | SET_BOUNDARY | DO_NOT_ENGAGE |
| BOUNDARY_NOT_RESPECTED | DO_NOT_ENGAGE | DO_NOT_ENGAGE | DO_NOT_ENGAGE | DO_NOT_ENGAGE |

TOTAL_NON_SAFETY_COMBINATIONS: 20

COVERED_COMBINATIONS: 20

FALL_THROUGH: 0

## Final URL Lock

- URL_STYLE: HTML
- FINAL_PAGE_1_URL: `https://www.my-echo-box.com/tools/no-contact-day-counter.html`
- FINAL_PAGE_2_URL: `https://www.my-echo-box.com/tools/mixed-signals-from-ex-response-checker.html`
- ROUTING_RISK: LOW

只允许 `tools/<slug>.html` 静态文件。direct visit、refresh、canonical 和未来 sitemap 必须使用完全相同的 `.html` URL。不得依赖 SPA fallback，不为两个页面新增 rewrite。

## Counter Single-source Lock

1. STEP A — 提取 homepage Counter 为共享纯函数/controller。
2. STEP B — Homepage 改为调用共享逻辑。
3. STEP C — Homepage regression + parity tests。
4. STEP D — A–C 全部 PASS 后才创建 Page 1。

Parity 最少覆盖：0、59 seconds、59:59、23:59:59、24:00:00、1/3/7/14/30 days、future date、invalid date、DST boundary、timezone reload。

COUNTER_SINGLE_SOURCE_OF_TRUTH: PASS AS SPEC GATE。代码阶段 A–C 未通过即 `STOP PAGE 1`。

## Structured Data Restraint

`WebApplication` 与 `BreadcrumbList` 仅为候选，不是排名假设或上线阻断项。不得虚构 rating、review、usage count、medical authority。不得为 rich result 强行增加 FAQ；只有可见 FAQ 与 schema 逐字一致时才允许 `FAQPage`。

## Final Pre-Code Authorization

| Gate | Result |
|---|---|
| PAGE_1_DISTINCT_SEARCH_JOB | YES |
| PAGE_1_DISTINCT_UTILITY | YES |
| PAGE_1_COUNTER_SINGLE_SOURCE | PASS AS SPEC GATE |
| PAGE_2_DISTINCT_SEARCH_JOB | YES |
| PAGE_2_DISTINCT_UTILITY | YES |
| PAGE_2_RULE_COVERAGE | 20/20 |
| ANALYTICS_EVENT_CONTRACT | PASS |
| ANALYTICS_DOUBLE_COUNT_RISK | PASS |
| URL_ROUTING | PASS |
| PRIVACY_CONTRACT | PASS |
| SAFETY_CONTRACT | PASS |
| READY_FOR_CODE | YES |
| APPROVED_FOR_CODE | NO |

`READY_FOR_CODE=YES` 只表示规格中的 P0 歧义已消除，不构成代码授权。
