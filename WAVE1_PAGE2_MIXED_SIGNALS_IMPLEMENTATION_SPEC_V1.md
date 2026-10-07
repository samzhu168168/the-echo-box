---
title: "The Echo Box — Wave 1 Page 2 Mixed Signals Implementation Spec V1"
date: 2026-10-07
status: implementation-spec-only
final_url: https://www.my-echo-box.com/tools/mixed-signals-from-ex-response-checker.html
---

# Page 2 — Mixed Signals From Ex Response Checker Implementation Spec

## Product Job Lock

**唯一 User Job：** Evaluate observable behavior across time without decoding one message or guessing the ex's mind, then choose one bounded next move.

禁止 attachment-style diagnosis、mind reading、reconciliation prediction、compatibility scoring、single-message interpretation。

## Search and Page Copy Spec

- SEARCH INTENT: 用户面对一段时间内反复冷热、行动不一致的联系，想知道下一步如何有边界地行动。
- TITLE TAG: `Mixed Signals From an Ex? Response Checker | The Echo Box`
- META DESCRIPTION: `Check observable patterns over time—without pasting private messages or guessing what your ex feels—and choose one bounded next move.`
- H1: `Mixed Signals From Your Ex: Response Checker`
- ABOVE-THE-FOLD COPY: `Choose only what has happened repeatedly. Do not paste messages or names. This checker looks at consistency, follow-through, purpose, and respect for boundaries—not hidden feelings.`
- DIRECT ANSWER: `Mixed signals are not enough information to predict intent. Look for repeated, observable behavior: whether contact has a clear purpose, whether words are followed by action, and whether your boundaries are respected. The result gives one limited next move, not a verdict on the relationship.`
- FIRST-SCREEN ACTION: `Start with the pattern`。

## Minimal Input Structure

所有输入为按钮/单选；无 textarea、file upload、camera、name/email/phone/handle 字段。

### Step 0 — Safety gate

`Has the contact included threats, stalking, pressure after you said stop, impersonation, or showing up where you feel unsafe?`

- `Yes / I may be unsafe` → safety result；停止普通 checker；链接 safety page/本地可信任支持；不展示 Paid CTA。
- `No` → 继续。

### Step 1 — Pattern window

- `One contact only`
- `Repeated for less than two weeks`
- `Repeated for two weeks or longer`

若为 one contact only：说明本工具不解释单条消息，路由到 `my-ex-texted-me-during-no-contact.html`；不生成关系判断。

### Step 2 — Dominant observable pattern（互斥单选）

- `CLEAR_AND_CONSISTENT` — contact has a stated purpose and actions repeatedly match it
- `WARM_THEN_ABSENT` — emotional/warm contact repeatedly ends without follow-through
- `LOW_EFFORT_ONLY` — reactions, likes, or brief check-ins without a clear request or plan
- `LOGISTICS_THEN_EMOTIONAL` — required practical contact repeatedly expands into personal/emotional contact
- `BOUNDARY_NOT_RESPECTED` — contact continues after a clear limit or stop request

### Step 3 — User’s bounded goal（互斥单选）

- `ANSWER_A_CLEAR_REQUEST`
- `SEE_IF_ACTION_BECOMES_CONSISTENT`
- `KEEP_CONTACT_PRACTICAL`
- `STOP_OR_REDUCE_CONTACT`

## Deterministic Result Rules

优先级：Safety > boundary violation > logistics boundary > consistency > brief factual reply。

Safety positive 永远在矩阵之前返回 `DO_NOT_ENGAGE + safety_mode`。非安全组合使用以下完整 5 × 4 矩阵：

| Pattern \\ Goal | ANSWER_A_CLEAR_REQUEST | SEE_IF_ACTION_BECOMES_CONSISTENT | KEEP_CONTACT_PRACTICAL | STOP_OR_REDUCE_CONTACT |
|---|---|---|---|---|
| `CLEAR_AND_CONSISTENT` | `BRIEF_REPLY` | `WAIT_FOR_CONSISTENCY` | `SET_BOUNDARY` | `DO_NOT_ENGAGE` |
| `WARM_THEN_ABSENT` | `WAIT_FOR_CONSISTENCY` | `WAIT_FOR_CONSISTENCY` | `SET_BOUNDARY` | `DO_NOT_ENGAGE` |
| `LOW_EFFORT_ONLY` | `WAIT_FOR_CONSISTENCY` | `WAIT_FOR_CONSISTENCY` | `SET_BOUNDARY` | `DO_NOT_ENGAGE` |
| `LOGISTICS_THEN_EMOTIONAL` | `SET_BOUNDARY` | `SET_BOUNDARY` | `SET_BOUNDARY` | `DO_NOT_ENGAGE` |
| `BOUNDARY_NOT_RESPECTED` | `DO_NOT_ENGAGE` | `DO_NOT_ENGAGE` | `DO_NOT_ENGAGE` | `DO_NOT_ENGAGE` |

实现优先级严格锁定为：Safety positive；`BOUNDARY_NOT_RESPECTED`；Goal `STOP_OR_REDUCE_CONTACT`；logistics/Goal `KEEP_CONTACT_PRACTICAL`；warm/low effort/Goal `SEE_IF_ACTION_BECOMES_CONSISTENT`；最后才是 clear + answer request。

`ONE CONTACT ONLY` 不进入矩阵，必须路由 existing inbound-message Guide，不发送 `tool_complete` 或 `result_type`。

- TOTAL_NON_SAFETY_COMBINATIONS: 20
- COVERED_COMBINATIONS: 20
- FALL_THROUGH: 0

## Required Result Card Contract

每个批准结果只包含四部分：

### BRIEF_REPLY
- WHAT WE OBSERVED: A clear request and repeated follow-through, with no boundary warning.
- WHAT WE ARE NOT CLAIMING: This does not prove romantic intent or a future outcome.
- NEXT MOVE: Answer the literal request briefly; do not add a relationship conversation.
- FREE RESET OPTION: Draft it privately and wait ten minutes before sending.

### WAIT_FOR_CONSISTENCY
- WHAT WE OBSERVED: Contact is warm or present, but action does not repeatedly follow.
- WHAT WE ARE NOT CLAIMING: We are not deciding why they do this or what they feel.
- NEXT MOVE: Do not chase clarification; wait for a clear request or consistent action.
- FREE RESET OPTION: Use the Reality Box and Reset before replying to the next spike.

### SET_BOUNDARY
- WHAT WE OBSERVED: Practical contact is expanding beyond its purpose, or your goal is to keep it limited.
- WHAT WE ARE NOT CLAIMING: A boundary is not a diagnosis or punishment.
- NEXT MOVE: State one allowed topic/channel/time and end the exchange when it moves outside that scope.
- FREE RESET OPTION: Put the boundary sentence in the Unsent Message box first.

### DO_NOT_ENGAGE
- WHAT WE OBSERVED: A stated boundary is not being respected, or a safety pattern was selected.
- WHAT WE ARE NOT CLAIMING: The tool cannot determine motive or provide emergency/legal advice.
- NEXT MOVE: Do not answer through the tool; preserve relevant records and seek appropriate support if needed.
- FREE RESET OPTION: Only when the user is safe; safety route takes precedence.

禁止出现 “They still love you / avoidant / manipulating you / want you back / will come back”。

## State Model and Privacy

- Inputs live in memory/session only；默认刷新、back 后清空。
- 不把选择序列写入 localStorage、URL、share text、analytics 或 network request。
- 允许 analytics 记录最终 `result_type` 批准枚举；safety result 可统一为 `DO_NOT_ENGAGE` + `safety_mode=true`，不得发送具体安全选择。
- 如未来要保存，仅能在另行批准后复用 local-storage architecture；本 Wave 1 spec 不授权。

## Reality Check

结果前固定显示：`What has happened consistently—not what could one message mean?`

## Next Move Router

- BRIEF_REPLY → homepage Unsent Message + Reset。
- WAIT_FOR_CONSISTENCY → Reality Box；不需要发消息。
- SET_BOUNDARY → necessary-contact Guide/Filter + Unsent Message。
- DO_NOT_ENGAGE → ordinary case links to blocking/boundary Guide；safety mode only links safety resources and exit controls。

## Free Reset Bridge

所有非安全结果均提供 soft option：`If you feel pulled to answer now, write it privately and give the urge ten minutes.`

## Paid Bridge

默认不在首屏或首次答题中出现。仅当用户选择 repeated pattern（而非 one contact）并完成结果后，可显示：`If this uncertainty keeps repeating, the 30-Day System gives you structured next steps and scripts.`

Safety mode、one-contact route 均不显示强 Paid CTA。价格和 Gumroad 不变。

## Internal Links

- `my-ex-texted-me-during-no-contact.html`
- `should-i-text-my-ex.html`
- `why-do-i-keep-rereading-old-messages-from-my-ex.html`
- `how-to-stop-checking-my-ex-social-media.html`
- homepage `/#reality-box`、`/#reset`、`/#necessary-contact`
- 详细双向计划见 Internal Link Plan。

## Structured Data Recommendation

- `WebApplication` + `BreadcrumbList` 仅作为候选；structured data 不是排名假设，也不是上线阻断项。
- 不使用心理/医疗 schema、不发布评分、不添加虚构 testimonials。
- 首版不需要 FAQ；输入/结果已经解决核心任务。只有 GSC 显示稳定独立 FAQ queries 后再评估。
- 不得为 rich result 强行增加 FAQ；未来只有真实可见且逐字一致时才允许 `FAQPage`。

## Analytics Events

- `tool_view`、`tool_start`、`tool_complete`。
- `result_type` 只允许四个批准输出枚举。
- 继续复用 `reset_started`、`paid_cta_clicked`、`checkout_started`；新增工具事件仅为 `tool_view`、`tool_start`、`tool_complete`、`share_action`。
- 不记录 step selections、私人关系细节、消息、姓名或 identifiers。
- 禁止新增同义事件 `reset_start`、`paid_cta_click`、`checkout_start`。

## URL and Routing Lock

- URL_STYLE: HTML
- FINAL URL: `https://www.my-echo-box.com/tools/mixed-signals-from-ex-response-checker.html`
- File convention: `tools/mixed-signals-from-ex-response-checker.html`
- 当前 Vercel `cleanUrls: false`；无扩展路径不可靠且现有测试返回 404。
- direct visit 与 refresh 依赖静态 HTML 文件，不依赖 SPA fallback 或新 rewrite。
- canonical 与未来 sitemap `<loc>` 必须逐字使用上述 `.html` URL。

## SEO Cannibalization Final Gate

- DISTINCT_SEARCH_JOB: YES
- DISTINCT_UTILITY: YES
- CANNIBALIZATION_RISK: MEDIUM
- 与 `my-ex-texted-me-during-no-contact` 的边界：现有 Guide 处理一条 inbound message；checker 明确要求跨时间的 repeated observable pattern。单次消息必须路由回现有 Guide。
- 若正文未来开始逐条解释消息含义或以 one-message query 为主：`STOP PAGE 2`。

## Implementation Cost

| Item | Rating |
|---|---|
| NEW FILES | MEDIUM |
| MODIFIED FILES | MEDIUM |
| REUSED COMPONENTS | MEDIUM |
| NEW JS REQUIRED | HIGH |
| ANALYTICS CHANGES | MEDIUM |
| SITEMAP CHANGE REQUIRED | LOW |
| SCHEMA CHANGE REQUIRED | LOW |
| QA COMPLEXITY | HIGH |

Rating 表示相对实施复杂度，不是工时。
