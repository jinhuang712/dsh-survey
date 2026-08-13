---
name: dsh-survey
description: Use this skill when the user wants to ask a batch of questions (10+) in one go, questionnaire-style — all questions on one screen, filled then submitted together — with single/multi/yes-no/compare/open question types, per-question skip, fullscreen overlay for compare questions, and a readable two-column recap after submit. The skill covers how to use the bundled ask_many_questions tool (dsh-survey plugin) and, as a fallback, how to rebuild the same tool as a dynamic Cordis plugin via cordis_define + cordis_run when the bundle is not installed. 当用户希望"一次性问 10 个以上问题"、"像问卷一样填完统一提交"、"跳过某题"、"是否题 toggle"、"左右对比题"时使用。
version: 1.0.0
license: MIT
---

# dsh-survey

问卷式批量提问能力：一次发起任意数量问题（支持 10 个以上），用户在同屏问卷中填完统一提交。由 `dsh-survey` 插件提供 `ask_many_questions` 工具，带完整问卷 UI。

## 两种使用路径

1. **Bundle 插件（推荐，常驻）**：`dsh-survey` 已作为 bundle 安装到 Web profile，`ask_many_questions` 工具与问卷 UI 常驻可用，无需本 skill 重建。
2. **动态插件兜底**：若 bundle 未安装或工具不可用，按 [references/dynamic-plugin-fallback.md](references/dynamic-plugin-fallback.md) 的完整代码用 `cordis_define` + `cordis_run` 现场重建（会话级，进程重启后消失）。

## 何时使用 ask_many_questions

- 需要一次性收集多项信息、多个确认或多项选择（10 个以上问题一次问完）
- 用户提到"问卷"、"批量提问"、"一次问多个问题"
- 需要跳过某题、是否题、左右对比题等题型

## 工具 schema 速览

`ask_many_questions(questions: [...], fullscreen?: boolean)`

每题对象：
- `id`（必填）稳定 id，原样回显在答案中
- `question`（必填）题目文本
- `header`（可选）分组小标题
- `kind`（可选）`"boolean"` = 是否题 toggle（不要传 options）；`"compare"` = 左右对比题（传 `compare: {left: {title, text}, right: {title, text}}`，问卷自动变全屏浮层）
- `options`（可选）选项数组 `{label, description?}`；`multi_select: true` 为多选，否则单选
- 无 options 且非 boolean/compare = 开放填空（只显示输入框）

顶层参数 `fullscreen: true` 可强制问卷以全屏浮层显示（默认仅对比题全屏）。

## 五类题型

| 题型 | 触发 | UI |
|---|---|---|
| 单选 | `options` + 无 `multi_select` | 圆形 radio |
| 多选 | `options` + `multi_select: true` | 方形 checkbox |
| 是否 | `kind: "boolean"` | 紧凑 is/否 toggle |
| 对比 | `kind: "compare"` + `compare` 字段 | 左右并排 Block，问卷自动全屏加宽 |
| 开放 | 无 `options`、非 boolean/compare | 多行输入框 |

## 交互特性

- **跳过/恢复**：每题右上角 ✕ 灰化跳过（显示"已跳过"），↺ 恢复；跳过的题提交为 `skipped: true`，recap 显示"已跳过"
- **全屏浮层**：含对比题时问卷自动 `position: fixed` 全屏居中（遮罩 + 1180px 卡片），突破对话流 748px 列宽限制；普通问卷可传 `fullscreen: true` 强制全屏
- **提交后 recap**：严格对半两列 grid，逐行"题目 → 答案"，对比题显示所选方 title
- **无障碍**：单选/多选/是否控件带 `role`/`aria-checked`，键盘 `:focus-visible` 焦点环

## 使用示例

发一轮含四类题型的问卷：

```json
{
  "questions": [
    { "id": "q1", "question": "你用的操作系统？", "options": [{ "label": "macOS" }, { "label": "Linux" }, { "label": "Windows" }] },
    { "id": "q2", "question": "希望支持哪些题型？", "multi_select": true, "options": [{ "label": "单选" }, { "label": "多选" }, { "label": "对比" }] },
    { "id": "q3", "kind": "boolean", "question": "是否需要自动保存进度？" },
    { "id": "q4", "question": "其他建议：" }
  ]
}
```

## 验证

- 工具可用：`cordis_inspect_query`（platform: host, provider: Tool, method: listTools）应看到 `ask_many_questions`
- 发一轮 4-6 题实测，确认分页/同屏渲染、提交后 recap 正常

## 安装与卸载（维护者/用户参考）

- 安装：`dsh plugin --profile web add "github:<owner>/dsh-survey"`（或本地目录 `cd dsh-survey && dsh plugin --profile web add .`），装完重启 web
- 卸载：从 web profile 的 `cordis.patch.yml` 移除 insert 行 + 从 bundles 层栈移除依赖
