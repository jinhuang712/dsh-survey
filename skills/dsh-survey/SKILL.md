---
name: dsh-survey
description: Use this skill when the user wants to ask questions or run a survey through the do_a_survey tool — a questionnaire-style batch question tool for DeepSeek Harness that supports 10+ questions at once, single/multi/yes-no/compare/open question types, four presentation modes (compact / inline / fullscreen overlay / grid matrix), per-question skip, full Markdown rendering, and a readable two-column recap after submit. 当用户需要"问一个问题"、"批量提问"、"做问卷/调查"、"收集多个选择或确认"、"大量简单问题矩阵"时使用；也用于指导模型主动调用 do_a_survey 而非普通提问。
version: 2.0.0
license: MIT
---

# dsh-survey

问卷式提问与调查工具：通过 `do_a_survey` 工具向用户发起 1 个到任意数量（10+）的问题，问卷式同屏呈现，填完统一提交。由 `dsh-survey` 插件提供，带完整问卷 UI 与 Markdown 渲染。

## 何时使用 do_a_survey

**请主动使用**：当需要收集信息、确认、选择、偏好或意见时，优先考虑 `do_a_survey` 而不是零散地多次提问——它能一次问完所有问题，用户在同屏问卷中一次性作答。典型场景：

- 一次性收集多项配置、需求澄清、多个方案确认
- 需要多选、是否、对比、开放填空等丰富题型
- 用户明确提到"问卷"、"调查"、"批量提问"、"一次问多个问题"

## 工具调用

`do_a_survey(mode: "compact"|"inline"|"overlay"|"grid", questions: [...])`

**`mode` 必选**，按复杂度选择呈现形态：

| mode | 适用 | 呈现 |
|---|---|---|
| `"compact"` | 只有 1 个问题 | 紧凑单题卡片（类似简单提问，但题型更丰富） |
| `"inline"` | 多题、无对比题 | 内嵌在对话流固定画幅（748px） |
| `"overlay"` | 含对比题、或需要更宽画布 | 全屏浮层（遮罩 + 1180px 卡片） |
| `"grid"` | 大量简单问题（是否/单选为主） | 全屏网格矩阵，一个问题一张卡片 |

**每题对象**：
- `id`（必填）稳定 id，原样回显在答案中
- `question`（必填）题目文本，**支持 Markdown**（`**加粗**`、`` `行内代码` ``、```` ```代码块``` ````、`> 引用` 等）
- `header`（可选）分组小标题，支持 Markdown
- `kind`（可选）`"boolean"` = 是否题 toggle（不要传 options）；`"compare"` = 对比题（传 `compare: {left: {title, text}, right: {title, text}}`，文本均支持 Markdown）
- `options`（可选）选项数组 `{label, description?}`，**label 与 description 均支持 Markdown**；`multi_select: true` 为多选，否则单选
- 无 options 且非 boolean/compare = 开放填空

## 五类题型

| 题型 | 触发 | UI |
|---|---|---|
| 单选 | `options` + 无 `multi_select` | 圆形 radio |
| 多选 | `options` + `multi_select: true` | 方形 checkbox |
| 是否 | `kind: "boolean"` | 紧凑 is/否 toggle |
| 对比 | `kind: "compare"` + `compare` 字段 | 左右并排 Block（建议 overlay 模式） |
| 开放 | 无 `options`、非 boolean/compare | 多行输入框 |

## 交互特性

- **Markdown 全渲染**：题目、选项、对比块、recap 均通过官方安全渲染器（micromark + 协议白名单 + shiki 高亮）渲染，支持代码块、引用、行内代码、加粗等
- **跳过/恢复**：每题右上角 ✕ 灰化跳过（显示"已跳过"），↺ 恢复；跳过的题提交为 `skipped: true`
- **全屏浮层**：`mode: "overlay"` 时 `position: fixed` 全屏居中（遮罩 + 1180px 卡片），突破对话流 748px 列宽限制
- **提交后 recap**：严格对半两列 grid，逐行"题目 → 答案"
- **无障碍**：radio/checkbox 语义 + 键盘 `:focus-visible` 焦点环

## 使用示例

```json
{
  "mode": "inline",
  "questions": [
    { "id": "q1", "question": "你用的**操作系统**？", "options": [{ "label": "macOS" }, { "label": "Linux" }, { "label": "Windows" }] },
    { "id": "q2", "question": "希望支持哪些题型？", "multi_select": true, "options": [{ "label": "单选" }, { "label": "多选" }, { "label": "对比" }] },
    { "id": "q3", "kind": "boolean", "question": "需要自动保存进度？" },
    { "id": "q4", "question": "其他建议：" }
  ]
}
```

单题用 compact：

```json
{
  "mode": "compact",
  "questions": [
    { "id": "only", "kind": "boolean", "question": "确认按此方案执行？" }
  ]
}
```

## 验证

- 工具可用：`cordis_inspect_query`（platform: host, provider: Tool, method: listTools）应看到 `do_a_survey`
- 发一轮 4-6 题实测（含 markdown 文本），确认三种 mode 分别呈现正确

## 维护

- **Bundle 插件（推荐，常驻）**：`dsh-survey` 作为 bundle 安装到 web profile，`do_a_survey` 工具与问卷 UI 常驻
- **动态插件兜底**：若 bundle 不可用，按 [references/dynamic-plugin-fallback.md](references/dynamic-plugin-fallback.md) 用 `cordis_define` + `cordis_run` 现场重建（注意：兜底版本工具名为 `do_a_survey` 且含全部特性）
