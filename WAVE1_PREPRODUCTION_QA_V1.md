---
title: "The Echo Box — Wave 1 Preproduction QA V1"
date: 2026-10-07
status: implementation-spec-only
production_changes: 0
---

# Wave 1 Preproduction QA V1

## Current Gate

- Page 1 DISTINCT_SEARCH_JOB: YES
- Page 1 DISTINCT_UTILITY: YES
- Page 1 CANNIBALIZATION_RISK: MEDIUM
- Page 2 DISTINCT_SEARCH_JOB: YES
- Page 2 DISTINCT_UTILITY: YES
- Page 2 CANNIBALIZATION_RISK: MEDIUM
- Page 2 RULE COVERAGE: 20/20
- ANALYTICS EVENT CONTRACT: PASS
- ANALYTICS DOUBLE COUNT RISK: PASS
- URL ROUTING: PASS — HTML
- APPROVED_FOR_CODE: NO

## Mobile-first UX Contract

### Shared first screen

在 iPhone Safari 与 Android Chrome 390px 首屏，用户无需滚动即可理解：

1. What is this? — 一个私人 Counter / observable-behavior checker。
2. What do I do? — 选择日期或开始选择行为。
3. What happens next? — 得到一个计数/有限 next move；不会预测复合。

核心工具、结果卡、按钮和错误文本均不得横向滚动。

## Page 1 Interaction QA

| State | Expected behavior |
|---|---|
| first-screen action | 日期时间输入 + `Calculate my time`；隐私说明可见 |
| tap sequence | select date → calculate → optional restart check → choose next move |
| completion state | days/hours/minutes、next milestone、restart interpretation、一个 next action |
| empty error | 不静默失败；提示 `Choose your last direct contact date and time.` |
| future-date error | 不保存；提示日期不能晚于当前时间；不得显示 0 伪装有效结果 |
| reset state | Restart 必须二次确认；更新 `lastContactAt`，保留 longest record |
| back-button behavior | 浏览器返回不新增 history traps；返回后 Counter 状态与首页一致 |
| local-storage behavior | 只读写现有 `echoBoxBreakupData.v1.lastContactAt/longestNoContactMs` |
| cross-page parity | 同一冻结 now 与 lastContactAt，homepage/tool 数字逐项完全一致 |

### Required parity cases

- elapsed 0、59 秒、59:59、23:59:59、24:00:00。
- 1、3、7、14、30 天边界前后。
- future input、invalid input。
- DST change 与 timezone reload；因为口径是 elapsed milliseconds，结果必须一致。
- Page 1 save → homepage refresh；homepage restart → Page 1 refresh。

任一 parity failure：`BLOCKED — STOP PAGE 1`。

## Page 2 Interaction QA

| State | Expected behavior |
|---|---|
| first-screen action | `Start with the pattern`；明确“不粘贴消息/不猜想法” |
| tap sequence | safety gate → pattern window → dominant pattern → bounded goal → result |
| one-contact branch | 停止 checker，路由到 existing inbound-message Guide；不输出 result_type |
| completion state | 仅四个批准结果之一，并含四个必需解释区块 |
| incomplete error | 标识当前缺失的单选；不清除已选安全回答 |
| safety state | `DO_NOT_ENGAGE` safety route；无强 Paid CTA；安全/退出链接优先 |
| reset state | `Start over` 清空内存状态与 UI，不影响 homepage local data |
| back-button behavior | 浏览器 back 不泄露 query/state；站内 Previous step 可修改选择 |
| local-storage behavior | 首版不保存 answers；刷新后清空；只允许 analytics 本地记录安全枚举 |

### Rules QA

- 每个非安全组合确定性输出一个批准枚举。
- 完整 5 × 4 矩阵必须自动化枚举 20 个组合：20 covered、0 fall-through、每组唯一结果。
- safety/ignored boundary 始终覆盖商业或温暖行为。
- `LOGISTICS_THEN_EMOTIONAL` 始终优先 SET_BOUNDARY。
- one contact 永不输出“mixed signal”关系判断。
- 页面/源码中禁止五类文案：still love、avoidant、manipulating、want you back、will come back。

## Privacy and Network QA

- 用 canary message/name/email/phone/handle 检查：工具根本不应提供输入位置。
- DevTools/自动化拦截 Plausible、fetch、XHR、sendBeacon、navigation、share。
- Page 1 exact timestamp、Page 2 choices 不得出现在 analytics/network/URL/share。
- result_type 只允许批准枚举；safety detail 不发送。
- Reset Card、share text、Copy Link 不含 Counter 日期或 checker answers。
- 一次动作只产生一个事件；禁止出现 `reset_start`、`paid_cta_click`、`checkout_start`。

## SEO/Technical QA Before Any Preview

- 候选 URL 本地返回 200；canonical 精确指向各自 Production URL。
- title/H1 唯一；无 `noindex`；无 Preview canonical。
- `WebApplication` 与 `BreadcrumbList` JSON-LD 可解析；FAQ schema 仅 Page 1 可选且与可见内容一致。
- internal links 无 404；Page 1/2 双向链接边界正确。
- sitemap 只在代码获批且准备发布时修改；当前不改。
- 构建清单必须显式包含两个页面及所需共享资产。

### URL routing assertions

- URL_STYLE: HTML
- Page 1: `https://www.my-echo-box.com/tools/no-contact-day-counter.html`
- Page 2: `https://www.my-echo-box.com/tools/mixed-signals-from-ex-response-checker.html`
- `tools/*.html` direct visit and refresh must return 200 in Preview before Production authorization。
- canonical 和未来 sitemap URL 与 `.html` Production URL 完全一致。
- 不添加 SPA fallback 或为两个页面新建 routing rewrite。

## Existing Production Regression QA

- Homepage Hero 文案不变。
- Free Reset、timer、completion、Reality Box、No-Contact Counter、Reset Card、Download、Native Share、Copy Link、Person-2 loop 全部通过现有 QA。
- Homepage Counter 在共享逻辑提取后显示结果与当前逻辑完全一致。
- $9.99、Gumroad destination、checkout UTM 不变。
- local-storage clear/export 仍覆盖 Counter state；不泄露 checker choices。
- `npm run build`、`npm run qa:distribution`、`npm run qa:links` 通过；需新增 Wave 1 parity/rules/privacy QA 命令或测试文件。

## Cost Summary

| Scope | Page 1 | Page 2 |
|---|---|---|
| NEW FILES | MEDIUM | MEDIUM |
| MODIFIED FILES | MEDIUM | MEDIUM |
| REUSED COMPONENTS | HIGH | MEDIUM |
| NEW JS REQUIRED | MEDIUM | HIGH |
| ANALYTICS CHANGES | MEDIUM | MEDIUM |
| SITEMAP CHANGE REQUIRED | LOW | LOW |
| SCHEMA CHANGE REQUIRED | LOW | LOW |
| QA COMPLEXITY | HIGH | HIGH |

## Future Rollback Spec

若未来获批实施，回滚单位必须是 Wave 1 的页面、共享工具初始化入口、analytics allowlist 扩展、internal links、build manifest 与 sitemap 条目。回滚共享 Counter 时必须恢复已验证的首页原逻辑，不能留下无初始化的 homepage Counter。当前无代码变更，因此本轮无需执行回滚。

## Human Authorization Gate

代码开始前，人工必须明确批准：

1. 两个候选 URL；
2. Page 1 共享 Counter 提取；
3. Page 2 deterministic rule table；
4. analytics 新枚举；
5. 对现有 Guides Related section 的最小双向链接修改；
6. sitemap/build manifest 的未来修改。

未授权前：不创建 HTML/JS/CSS、不改 sitemap、不部署、不索引。
