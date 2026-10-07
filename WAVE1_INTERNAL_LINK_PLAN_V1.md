---
title: "The Echo Box — Wave 1 Internal Link Plan V1"
date: 2026-10-07
status: implementation-spec-only
changes_authorized: false
---

# Wave 1 Internal Link Plan V1

> 本表是未来代码阶段计划，不授权修改现有 Guide。

## Page 1 — Counter Links

| FROM | TO | ANCHOR INTENT | WHY THIS LINK EXISTS |
|---|---|---|---|
| Page 1 result `RESTART_COUNTER` | `/guides/i-broke-no-contact.html` | `what to do after breaking no contact` | Counter 只判断/更新日期；Guide 承接 lapse 后的止损步骤 |
| `/guides/i-broke-no-contact.html` related guides | Page 1 | `check your no-contact day count` | 给已破戒用户一个同源重启工具，实现双向链接 |
| Page 1 active-urge router | `/guides/should-i-text-my-ex.html` | `decide whether to text your ex` | 把“计时”与“是否联系”分开 |
| `/guides/should-i-text-my-ex.html` related guides | Page 1 | `see how long no contact has lasted` | 只有用户需要时间事实时进入工具，不抢主动联系主意图 |
| Page 1 `BOUNDARY_REVIEW` | `/guides/how-to-stop-checking-my-ex-social-media.html` | `stop the social-media checking loop` | 社媒查看不由 Counter 强制定义，交给精确行为页 |
| social-media Guide related guides | Page 1 | `track your current no-contact time` | 为需要时间记录的用户提供工具，锚文本不塞关键词变体 |
| Page 1 | `/#reset` | `start the free 10-minute reset` | 即时冲动承接 |
| Page 1 | `/#necessary-contact` | `check whether contact is actually necessary` | 处理 logistics exception |
| Page 1 | `/#reality-box` | `open the Reality Box` | 纠正“倒计时等对方”的使用方式 |

## Page 2 — Mixed Signals Links

| FROM | TO | ANCHOR INTENT | WHY THIS LINK EXISTS |
|---|---|---|---|
| Page 2 one-contact route | `/guides/my-ex-texted-me-during-no-contact.html` | `handle one message from your ex` | 明确拒绝用 repeated-pattern checker 解读单条消息 |
| inbound-message Guide related guides | Page 2 | `check a repeated pattern of mixed signals` | 只有消息形成跨时间模式时进入 checker |
| Page 2 BRIEF_REPLY | `/guides/should-i-text-my-ex.html` | `pause before you send a reply` | 回应动作前使用现有决策/Reset 路径 |
| `should-i-text-my-ex.html` related guides | Page 2 | `evaluate repeated mixed signals` | 与主动发消息意图区分，提供 repeated-pattern 工具 |
| Page 2 WAIT_FOR_CONSISTENCY | `/guides/why-do-i-keep-rereading-old-messages-from-my-ex.html` | `stop re-reading old messages for clues` | 避免把等待变成旧消息解码 |
| rereading Guide related guides | Page 2 | `check behavior across time` | 从文字线索转向可观察行为 |
| Page 2 WAIT_FOR_CONSISTENCY | `/guides/how-to-stop-checking-my-ex-social-media.html` | `stop checking for another signal` | 防止结果后转入 profile monitoring |
| social-media Guide related guides | Page 2 | `choose a next move from repeated behavior` | 行为循环与决策工具双向承接 |
| Page 2 all non-safety results | `/#reality-box` | `save the facts in the Reality Box` | 保存事实而非读心；复用现有本地工具 |
| Page 2 all non-safety results | `/#reset` | `start the free 10-minute reset` | 回复前暂停 |
| Page 2 SET_BOUNDARY | `/#necessary-contact` | `keep necessary contact factual` | 物流联系扩张时收窄范围 |
| Page 2 safety route | `/safety.html` | `get safety guidance` | 安全优先，不进入商业 CTA |

## Link Placement Rules

- 新页面正文/结果区每个链接必须解决下一任务，不能堆在 SEO 列表里。
- 现有 Guides 未来只允许在 Related Guides/Reading 区新增 1 个最相关 Wave 1 链接；正文是否修改需另行授权。
- 不使用 `click here`、`read more` 或同一关键词重复锚文本。
- Page 1 与 Page 2 不互链：两个 user jobs 无直接下一步关系，避免制造工具目录噪音。

## Cannibalization Link Guard

- `i-broke-no-contact` 始终保留 lapse recovery 主权；Counter anchor 强调 count，不强调“what now”。
- `my-ex-texted...` 始终保留 single-message 主权；checker anchor 必须包含 repeated pattern 概念。
- 若 GSC 后续显示两个 URL 对同一 query 轮换曝光，先调整内部 anchor/页面边界，不新增第三页。
