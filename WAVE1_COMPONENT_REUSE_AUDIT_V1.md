---
title: "The Echo Box — Wave 1 Component Reuse Audit V1"
date: 2026-10-07
status: implementation-spec-only
wave: 1
approved_candidates: 2
---

# Wave 1 Component Reuse Audit V1

## 审计结论

Wave 1 不应重新实现已通过 Production QA 的 Reset、Reality Box、分享、支付或隐私机制。Page 1 的 Counter 视觉和状态可复用，但当前计算逻辑位于 `initBreakupReset()` 内部，独立页面无法直接调用。代码阶段必须先提取为**单一共享 Counter 控制器/纯计算函数**，再由首页和工具页同时调用；禁止复制逻辑。

Page 2 没有现成 checker，需要一个最小的新组件，但结果路由、Reset、Reality Box、付费 CTA、analytics 和 safety presentation 必须接入现有体系。

## Production 资产审计

| Asset | Current implementation | Page 1 | Page 2 | Classification | Implementation constraint |
|---|---|---|---|---|---|
| No-Contact Counter | `index.html` counter DOM + `app.js` state/handlers/render | 核心功能 | 不需要 | REUSE_WITH_WRAPPER | 抽取同一个共享 controller；首页和工具页必须调用同一计算函数、同一状态键、同一里程碑定义 |
| Reality Box | `index.html#reality-box`，保存到 `echoBoxBreakupData.v1.realityBox` | 结果后的可选 Reality Check | 主要承接 | REUSE_AS_IS | 新页面链接到首页锚点；不在新页复制文本输入或保存逻辑 |
| 10-Minute Reset | `index.html#reset` + timer/completion | 冲动/准备联系时承接 | 所有结果均可选承接 | REUSE_AS_IS | 使用链接进入首页；保留 attribution；不复制 timer |
| Unsent Message | 首页 `#unsent-form`，本地保存/可不保存 | 必要联系或想重启时 | 准备回复时 | REUSE_AS_IS | 链接进入首页；checker 不接受任何消息文本 |
| Reset Card | 完成 Reset 后固定安全文案 Canvas | 不直接嵌入 | 不直接嵌入 | REUSE_AS_IS | 仅在既有 Reset 完成状态出现；不得生成“counter card”或“mixed-signals result card”首版 |
| Share / Copy Link | 固定安全 copy + approved ref/UTM | 可分享工具 URL，但首版不必分享结果 | 可分享工具 URL，但不得分享结果细节 | REUSE_WITH_WRAPPER | 只分享页面入口；不把日期、选择或 result_type 写入 URL/share text |
| Paid CTA | `data-paid-kit-cta` + `commerce-config.js` + UTM | 条件展示 | 条件展示 | REUSE_AS_IS | 价格、Gumroad URL、checkout 架构不变；新 placement 枚举仅用于归因 |
| local-storage privacy architecture | `echoBoxBreakupData.v1` + analytics local log | 继续使用 `lastContactAt`/`longestNoContactMs` | 首版不保存回答；仅可选择性保存无文本的上次 result_type | REUSE_WITH_WRAPPER | 不新增服务器存储；Page 2 默认 session-only，刷新即清空回答 |
| analytics architecture | allowlist + property sanitizer + optional Plausible | 复用发送/本地日志 | 复用发送/本地日志 | REUSE_WITH_WRAPPER | 仅扩展安全枚举；禁止自由文本/日期/次数明细进入 properties |
| safety routing | 首页 safety strip、necessary-contact `safety` 分支、文本检测 | 静态 safety exception | 需要显式行为式安全 gate | REUSE_WITH_WRAPPER | Page 2 不收文本，不能复用文本检测；新增非诊断性安全选择与现有 safety 页跳转 |

## 必需的新组件

### Shared No-Contact Counter Controller

- Classification: `NEW_COMPONENT_REQUIRED`，但它是从现有逻辑提取的共享层，不是第二套 Counter。
- 单一输入：`lastContactAt`（epoch milliseconds）、`now`（epoch milliseconds）。
- 单一计算：
  - `elapsed = Math.max(0, now - lastContactAt)`
  - `days = Math.floor(elapsed / 86400000)`
  - `hours = Math.floor((elapsed % 86400000) / 3600000)`
  - `minutes = Math.floor((elapsed % 3600000) / 60000)`
  - milestones 固定 `[1, 3, 7, 14, 30]`
- 单一状态源：`echoBoxBreakupData.v1.lastContactAt` 与 `.longestNoContactMs`。
- 两个页面不得自行重算、不得改成 calendar-day 口径、不得引入时区修正后的“Day 1”。
- 必须新增 parity test：同一 `lastContactAt` 与冻结的 `now`，首页和工具页显示完全相同。

### Mixed Signals Behavior Checker

- Classification: `NEW_COMPONENT_REQUIRED`。
- 只接受最小、互斥的行为选择，不接受任何文本输入。
- 纯规则输出四个批准枚举之一：`BRIEF_REPLY`、`WAIT_FOR_CONSISTENCY`、`SET_BOUNDARY`、`DO_NOT_ENGAGE`。
- safety gate 优先于商业逻辑；安全结果不显示强 Paid CTA。
- 规则函数应是可单元测试的 deterministic mapping，不调用 AI、不发送输入。

## 不复用/不新增

- 不复制 Reset timer、Reality Box form、Canvas card renderer、checkout builder。
- 不新增后端、数据库、AI inference、聊天上传、截图 OCR 或账号系统。
- 不改变 `echoBoxBreakupData.v1` 中已有字段含义。
- 不改 Gumroad destination、价格、Hero 或 Production 路由，本阶段只写规格。

## Counter 同源 Gate

当前可以证明首页的实际定义，但尚不存在第二个 Counter。Page 1 进入代码阶段的条件是：

1. 先提取并测试单一共享逻辑；
2. 首页回归测试结果不变；
3. 工具页仅调用共享逻辑；
4. parity test 覆盖 0 分钟、23:59、24:00、7 天、14 天、未来日期、DST 跨越。

任一条件失败：`STOP PAGE 1`。
