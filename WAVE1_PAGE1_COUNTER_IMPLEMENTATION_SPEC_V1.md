---
title: "The Echo Box — Wave 1 Page 1 Counter Implementation Spec V1"
date: 2026-10-07
status: implementation-spec-only
final_url: https://www.my-echo-box.com/tools/no-contact-day-counter.html
---

# Page 1 — No Contact Day Counter Implementation Spec

## Product Job Lock

**唯一 User Job：** Calculate how long no contact has lasted, understand whether anything actually requires a restart, then choose one next action.

不做 generic no-contact article、30-day reconciliation promise、recovery score、ex-back prediction 或 motivational essay。

## Search and Page Copy Spec

- SEARCH INTENT: 用户寻找即时可用的 no-contact day counter，并需要判断最近行为是否真的应重启记录。
- TITLE TAG: `No Contact Day Counter & Restart Check | The Echo Box`
- META DESCRIPTION: `Count how long no contact has lasted, check whether a recent interaction requires a restart, and choose one private next step. No account required.`
- H1: `No Contact Day Counter`
- ABOVE-THE-FOLD COPY: `Enter the time of your last direct contact. See the same private counter used by The Echo Box, then check whether anything since then actually changes the start point.`
- DIRECT ANSWER: `No contact has lasted from the exact time you save until now. The counter measures elapsed time; it does not predict healing or reconciliation. Necessary logistical contact and an emotional restart are not always the same thing, so use the restart check before changing the date.`
- FIRST-SCREEN ACTION: `Choose last contact date and time` → primary button `Calculate my time`。

## Tool Inputs

1. `Last direct contact date and time` — `datetime-local`，必填。
2. `What happened since then?` — 单选，只有用户打开 restart check 后显示：
   - `No direct contact`
   - `I initiated personal or emotional contact`
   - `They contacted me and I replied only to the practical request`
   - `We handled required logistics only`
   - `I checked, liked, reacted, or viewed online but did not directly message`
3. 不收姓名、消息、账号、原因自由文本。

## Tool Outputs

- 与首页完全一致的 `days, hours, minutes protected`。
- 与首页完全一致的 next milestone 和 longest local record。
- Restart interpretation：
  - No direct contact → `KEEP_CURRENT_START`
  - User initiated personal/emotional contact → `RESTART_COUNTER`
  - Practical reply/required logistics → `NECESSARY_CONTACT_REVIEW`
  - Social viewing/reaction → `BOUNDARY_REVIEW`；不自动改日期
- 一个 Next Move，不输出 recovery score。

## State Model

| Field | Source/storage | Rule |
|---|---|---|
| `lastContactAt` | `echoBoxBreakupData.v1` | 与首页相同 epoch-ms 字段 |
| `longestNoContactMs` | same object | `max(existing, elapsed)` |
| current elapsed | derived, not separately stored | `max(0, now-lastContactAt)` |
| restart-check answer | session-only | 默认不写 localStorage，不进 analytics |
| next-move result | session-only | 仅安全枚举可进 analytics |

页面加载时若已有 `lastContactAt`，显示同一状态；用户更新后首页 Counter 必须立即读取相同值。Back/refresh 后状态与首页一致。

## Day-count Definition Lock

必须从现有 Production 逻辑提取并共享：固定 elapsed milliseconds，不采用 calendar-day 算法。

```text
elapsed = max(0, now - lastContactAt)
days = floor(elapsed / 86,400,000)
hours = floor((elapsed % 86,400,000) / 3,600,000)
minutes = floor((elapsed % 3,600,000) / 60,000)
milestones = [1, 3, 7, 14, 30]
```

禁止在工具页复制上述逻辑成为第二份实现。共享逻辑与 parity tests 未完成则 `STOP PAGE 1`。

## Restart Rules

- 明确主动发送个人/情绪性 text、call、DM 或面对面开启关系话题：建议把 start time 更新为这次联系结束时间。
- 仅收到消息但未回复：不自动重启。
- 仅为孩子、工作、账单、财物、法律/正式事项进行窄范围联系：不自动重启；引导 Necessary Contact Filter。
- 查看、搜索、story view、like/reaction 会破坏个人边界，但是否重启计时是用户定义；工具不冒充普遍规则。
- 一次 lapse 不抹掉此前记录；`longestNoContactMs` 保留。

## Necessary-contact Exception

输出：`Required contact can be compatible with a no-contact boundary when it stays limited to the actual task. Keep it factual, use one channel, and do not add a relationship conversation.`

链接到 `when-contact-with-an-ex-is-necessary.html` 与 homepage Necessary Contact Filter。法律、财产、育儿争议不由工具裁决。

## Reality Check

只显示一个问题：`Are you using this number to protect space—or counting down until they come back?`

不存回答；可链接到 homepage Reality Box。

## Next Move Router

- `KEEP_CURRENT_START` → Keep the current date; choose no action.
- `RESTART_COUNTER` → Confirm before overwriting `lastContactAt`; preserve longest record.
- `NECESSARY_CONTACT_REVIEW` → Open Necessary Contact Filter.
- `BOUNDARY_REVIEW` → Open social-checking Guide or Free Reset if the urge is active.
- Active urge / about to contact → Start Free 10-Minute Reset.

## Free Reset Bridge

自然触发条件：用户选择 personal/emotional contact、social checking，或点击 `I want to contact them now`。CTA：`Pause before you change anything — start the free 10-minute reset.`

## Paid Bridge

`PAID BRIDGE = USER-INITIATED OPTIONAL NEXT STEP`。

首版不增加额外问卷，也不存在 `This keeps happening` 状态。Counter `tool_complete` 后可显示一个低压 secondary option：`I want structure for the next 30 days`。它只是用户主动选择的导航入口，不是诊断结果、analytics inference 或自动判断。

只有用户主动点击该入口，才进入现有 30-Day System 页面/CTA。不得根据天数、restart result、social checking、具体日期或 longest streak 自动判断用户需要付费。Free Reset 始终优先于 Paid CTA；不得声称 30 天会带回复、康复或复合。

## Internal Links

- `i-broke-no-contact.html`
- `should-i-text-my-ex.html`
- `how-to-stop-checking-my-ex-social-media.html`
- homepage `/#reset`、`/#no-contact`、`/#necessary-contact`、`/#reality-box`
- 详细双向锚文本见 `WAVE1_INTERNAL_LINK_PLAN_V1.md`。

## Privacy Copy

`Your date and counter stay in this browser. The restart-check choices are used only to show this result and are not sent to analytics, a server, or an AI tool.`

## Limitation Copy

`This counter measures elapsed time. It is not a recovery score, a clinical assessment, or a prediction that an ex will return. There is no universal day when no contact is “complete.”`

## FAQ Gate

FAQ 只保留 3 个真正影响工具使用的问题：

1. `What counts as Day 1?` — 回答为从保存的准确时间累计满 24 小时，不采用日历翻页。
2. `Does necessary contact restart the counter?` — 不自动重启，取决于是否超出必要任务。
3. `Does checking social media restart no contact?` — 工具不强制定义；说明它可能延续 checking loop。

不得添加泛化“how long should no contact last”长文。

## Structured Data Recommendation

- `WebApplication`（免费 browser-based utility）+ `BreadcrumbList` 仅作为候选；structured data 不是本 Pilot 的排名假设，也不是上线阻断项。
- 仅在 FAQ 实际可见且逐字一致时使用 `FAQPage`；否则不加。
- 不使用 medical schema、rating、review、虚构 usage count。
- 不为追求 rich result 强行增加 FAQ。

## Analytics Events

- `tool_view`：页面加载一次。
- `tool_start`：用户首次操作日期输入或启动 restart check。
- `tool_complete`：显示有效 counter 与 next move。
- `reset_started`：从本页桥接后首页 Reset 实际启动；继续复用现有 Production 事件并保留来源。
- `paid_cta_clicked`：用户主动点击可选 Paid 入口；继续复用现有 Production 事件。
- `checkout_started`：现有 checkout 实际打开流程；继续复用 Production 事件。
- `share_action`：只分享工具入口，不分享日期/结果。
- 事件属性和禁止字段见 Analytics Contract。

禁止新增或发送同义事件 `reset_start`、`paid_cta_click`、`checkout_start`。

## URL and Routing Lock

- URL_STYLE: HTML
- FINAL URL: `https://www.my-echo-box.com/tools/no-contact-day-counter.html`
- File convention: `tools/no-contact-day-counter.html`
- 当前 Vercel `cleanUrls: false`，现有无扩展路径返回 404；不得为本页新增全站 rewrite。
- direct visit 与 refresh 均依赖静态 HTML 文件本身，不依赖 SPA fallback。
- canonical 与未来 sitemap `<loc>` 必须逐字使用上述 `.html` URL。

## Counter Extraction Order Lock

1. STEP A：先从 homepage 提取现有 Counter 计算逻辑为共享纯函数/controller。
2. STEP B：让 Homepage 改为调用共享逻辑。
3. STEP C：运行 Homepage regression 与全部 parity tests。
4. STEP D：只有 A–C PASS 后才创建 Page 1，并调用同一共享逻辑。

禁止 copy、duplicate、fork 或 temporary second implementation。

## SEO Cannibalization Final Gate

- DISTINCT_SEARCH_JOB: YES
- DISTINCT_UTILITY: YES
- CANNIBALIZATION_RISK: MEDIUM
- 与 `i-broke-no-contact` 的边界：该 Guide 回答 lapse 后怎么办；工具页计算时间并判断是否需要改变 start time。页面不得扩写成完整 lapse recovery article。
- CODE GATE: 共享 Counter 逻辑/parity test 未通过则 `STOP PAGE 1`。

## Implementation Cost

| Item | Rating |
|---|---|
| NEW FILES | MEDIUM |
| MODIFIED FILES | MEDIUM |
| REUSED COMPONENTS | HIGH |
| NEW JS REQUIRED | MEDIUM |
| ANALYTICS CHANGES | MEDIUM |
| SITEMAP CHANGE REQUIRED | LOW |
| SCHEMA CHANGE REQUIRED | LOW |
| QA COMPLEXITY | HIGH |

Rating 表示相对实施复杂度，不是工时。
