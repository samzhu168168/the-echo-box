---
title: "The Echo Box — Wave 1 Analytics Contract V1"
date: 2026-10-07
status: implementation-spec-only
privacy: no-private-input
---

# Wave 1 Analytics Contract V1

## Contract Goal

只测量 Search → Utility → Reset → Paid intent，不采集关系内容。当前 `analytics.js` 使用事件/property allowlist；代码阶段只能扩展 allowlist，不得绕过 sanitizer。

## Required Safe Enums

### `tool_id`

- `no_contact_day_counter`
- `mixed_signals_checker`

### `result_type`

Page 1：

- `KEEP_CURRENT_START`
- `RESTART_COUNTER`
- `NECESSARY_CONTACT_REVIEW`
- `BOUNDARY_REVIEW`

Page 2：

- `BRIEF_REPLY`
- `WAIT_FOR_CONSISTENCY`
- `SET_BOUNDARY`
- `DO_NOT_ENGAGE`

不得允许动态字符串、用户输入或消息片段成为 result_type。

### Other allowed enums

- `entry_source`: `organic_search`, `internal_link`, `direct`, `referral`, `unknown`
- `cta_location`: `counter_result`, `mixed_signals_result`, `tool_reset_bridge`
- `share_method`: 复用现有批准值
- `safety_mode`: boolean only

## Event Contract

| Event | Trigger | Allowed properties | Forbidden properties |
|---|---|---|---|
| `tool_view` | 工具页首次加载，每 page view 一次 | `page_slug`, `tool_id`, UTM allowlist | input values, date/time, referrer full URL with query, message |
| `tool_start` | 首次有效交互；Page 1 编辑日期，Page 2 回答 Step 0 | `page_slug`, `tool_id` | selected answer, last-contact timestamp, names |
| `tool_complete` | 有效结果首次显示 | `page_slug`, `tool_id`, `result_type`, `safety_mode` | raw choices, calculated duration, private context |
| `reset_started` | 用户从工具桥接并在首页实际启动 Reset | existing safe props + `entry_source`/approved source token | draft text, trigger text, relation details |
| `paid_cta_clicked` | 用户主动点击允许出现的 Paid CTA | `page_slug`, `tool_id`, `cta_location`, UTM | price variants, user answers, result narrative |
| `checkout_started` | 现有 checkout 流程实际启动 | existing safe checkout properties | user answers, result narrative, private content |
| `share_action` | 用户分享/复制工具入口 | `page_slug`, `tool_id`, `share_method` | result_type in URL, date, answers, local state |

事件命名锁定：新增仅允许 `tool_view`、`tool_start`、`tool_complete`、`share_action`；漏斗后半段继续复用现有 `reset_started`、`paid_cta_clicked`、`checkout_started`。

禁止新增或发送 `reset_start`、`paid_cta_click`、`checkout_start`。一次真实动作只发送一个事件。报告层的 `RESET START`、`PAID CTA`、`CHECKOUT` 只能分别映射现有三个 Production events。

## Existing Architecture Changes Required

- `ALLOWED_EVENTS`：需加入 `tool_view`、`tool_start`、`tool_complete`、`share_action`，或明确复用已有 `seo_tool_started/completed`。推荐采用用户批准的新通用命名并迁移报告映射，但不得删除旧事件。
- `ALLOWED_PROPERTIES`：需加入 `tool_id`、`result_type`、`entry_source`、`safety_mode`。
- Plausible funnel allowlist：只有确认后台需要且可访问时加入；否则事件仍安全保存在现有本地 event log，状态标记 NOT VERIFIED。
- `PRODUCT_VERSION`：代码实施时按发布版本更新；本规格不改。

## Funnel Definitions

### Page 1

`QUERY → /tools/no-contact-day-counter.html → tool_start → tool_complete → result_type → homepage reset_started → paid_cta_clicked → checkout_started`

- Landing 与 tool start 自然：查询本身要求计算。
- Complete 与 next move 自然：用户需要判断是否改变 start time。
- Reset 只在出现即时联系/查看冲动时出现。
- Paid 只在 repeated trigger / need for structure 暴露后出现。

### Page 2

`QUERY → /tools/mixed-signals-from-ex-response-checker.html → tool_start → tool_complete → approved result_type → homepage reset_started → paid_cta_clicked → checkout_started`

- Landing 与 start 自然：用户要评估重复行为。
- Complete 与 next move 自然：四个结果均为有限行动，不是关系结论。
- Safety route 在 `DO_NOT_ENGAGE + safety_mode` 后退出商业 funnel。
- Paid 只在 repeated pattern 且用户完成结果后出现。

## Absolute Forbidden Data

- message content、private draft、chat screenshot、OCR output
- name、email、phone、handle、account URL
- last-contact timestamp、具体日期、精确 duration
- selected behavior sequence、relationship history、free-text reason
- Reality Box content、safety phrase/detail
- localStorage payload、canvas content

## Double-count Gate

- ANALYTICS_EVENT_CONTRACT: PASS
- ANALYTICS_DOUBLE_COUNT_RISK: PASS
- Pass condition: code/QA confirms none of `reset_start`, `paid_cta_click`, `checkout_start` are emitted by Wave 1 and each real action emits exactly one approved event.
- Any duplicate emission or forbidden synonym: `FAIL — STOP WAVE 1`。

## Privacy QA Assertions

1. 拦截 Plausible、fetch、XHR、beacon、navigation 与 share payload。
2. 输入独特 canary 值；全网路请求和 analytics log 中必须不存在。
3. URL query/hash/history 不得出现输入或 result narrative。
4. Page 2 refresh 后 answers 清空；Page 1 只保留现有 Counter fields。
5. Safety mode 只发送 boolean，禁止发送安全事件类别。
