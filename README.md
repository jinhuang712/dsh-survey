# dsh-survey

问卷式批量提问插件 for [DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness) — 一次性问 10+ 个问题，像问卷一样填完统一提交。

[![license](https://badgen.net/badge/license/MIT/green)](LICENSE)
[![dsh-plugin](https://badgen.net/badge/topic/dsh-plugin/8257D0)](https://github.com/topics/dsh-plugin)

<div align="center">

| 单选 | 多选 | 是否 toggle | 对比题 | 开放题 |
|---|---|---|---|---|
| 圆形 radio | 方形 checkbox | 紧凑 is/否 开关 | 左右并排 Block | 多行输入框 |

</div>

模型调用 `ask_many_questions` 后，Web UI 会弹出问卷卡片（或全屏浮层）：所有问题同屏展示、可逐题跳过、填完一次提交，提交后以对半两列 recap 展示你的回答。

## 安装

**bundle 插件形态（推荐，常驻）**，构建产物已入库，一行安装：

```sh
dsh plugin --profile web add "github:<owner>/dsh-survey#main"
# 重启 dsh web，刷新页面
```

本地目录安装（有源码时）：

```sh
git clone https://github.com/<owner>/dsh-survey.git
cd dsh-survey
dsh plugin --profile web add .
# 重启 dsh web，刷新页面
```

装好后 `ask_many_questions` 工具与问卷 UI 常驻可用，无需额外步骤。

> 配套 skill `dsh-survey` 也会随安装注册（`dsh.skills` 声明）：它说明工具的用法，并在 bundle 不可用时提供动态插件兜底配方（`references/dynamic-plugin-fallback.md`）。

## 怎么用

直接告诉模型你想收集什么，例如「问一下大家对这个方案的 12 个问题」。模型会构造问题数组并调用 `ask_many_questions`：

```json
{
  "questions": [
    { "id": "q1", "question": "你用的操作系统？", "options": [{ "label": "macOS" }, { "label": "Linux" }] },
    { "id": "q2", "question": "希望支持哪些题型？", "multi_select": true, "options": [{ "label": "单选" }, { "label": "对比" }] },
    { "id": "q3", "kind": "boolean", "question": "需要自动保存进度吗？" },
    { "id": "q4", "question": "其他建议：" }
  ]
}
```

### 题型

| 题型 | 触发 | UI |
|---|---|---|
| 单选 | `options` + 无 `multi_select` | 圆形 radio |
| 多选 | `options` + `multi_select: true` | 方形 checkbox |
| 是否 | `kind: "boolean"` | 紧凑 toggle（不要传 options） |
| 对比 | `kind: "compare"` + `compare: {left: {title,text}, right: {title,text}}` | 左右并排 Block，问卷自动全屏加宽 |
| 开放 | 无 `options`、非 boolean/compare | 多行输入框 |

### 特性

- **跳过/恢复**：每题右上角 ✕ 灰化跳过，↺ 恢复；提交为 `skipped: true`
- **全屏浮层**：对比题自动全屏居中（遮罩 + 1180px），突破对话流 748px 列宽；普通问卷传 `fullscreen: true` 也可强制全屏
- **可读 recap**：提交后严格对半两列，逐行"题目 → 答案"
- **无障碍**：radio/checkbox 语义 + 键盘焦点环

## 架构

- **Host half**（`lib/index.mjs`）：Cordis entry，`defineTool` 注册 `ask_many_questions`；`webServer.register` 提供 `/api/dsh-survey/submit|cancel` 路由；`execute` 挂起等待用户提交（`exec.callId` 关联，`exec.signal` 中止清理）
- **Client half**（`lib/client.js`）：`__ModuleLoader__.load` bundle，注册 `tool.call.toolview` key=`ask_many_questions`；问卷 UI + `fetch` 提交
- **Skill**（`skills/dsh-survey/SKILL.md`）：用法指南 + 动态插件兜底配方（`references/dynamic-plugin-fallback.md`）

## 验证

- `dsh plugin --profile web add` 后 `__DSH_BOOT__` 应含 `dsh-survey` client 行；`/plugins/dsh-survey/client.js` 200
- `cordis_inspect_query`（Tool.listTools）应看到 `ask_many_questions`
- 发一轮 4-6 题问卷实测（含对比题验证全屏浮层）

## 卸载

- 从 web profile 的 `cordis.patch.yml` 移除 `dsh-survey` insert 行
- 从 web profile 的 `dsh.profile.bundles` 移除 `dsh-survey` 依赖并 `pnpm remove`

## License

MIT
