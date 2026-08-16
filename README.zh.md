# dsh-survey

问卷式提问与调查插件 for [DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness) — 通过 `do_a_survey` 工具一次性问 1 到 10+ 个问题，问卷式同屏呈现，填完统一提交。

[![license](https://badgen.net/badge/license/MIT/green)](LICENSE)
[![dsh-plugin](https://badgen.net/badge/topic/dsh-plugin/8257D0)](https://github.com/topics/dsh-plugin)
[![English](https://badgen.net/badge/lang/English/blue)](README.md)

<div align="center">

| 单选 | 多选 | 是否 toggle | 对比题 | 开放题 |
|---|---|---|---|---|
| 编号行 1 / 2 / 3 | 方形 checkbox | 两行单选点 | 左右并排 Block | 多行输入框 |

</div>

## 什么时候用得上

- **模型动手之前要你拍五个板。** 没有它就是问一个、等一个、再问下一个——五个来回才开始干活。有了它一次问完，你在一张卡里答完。
- **答案要的是结构化数据，不是一段话。** 每题回传 `{ id, selected, custom?, skipped? }`，模型不用从「嗯第一个吧，最后一题跳过」里猜你的意思。
- **有些问题你根本不在乎。** 每题都能跳过，问多了的代价是点一下，而不是来回掰扯。

模型调用 `do_a_survey` 后，Web UI 按 `mode` 呈现问卷：单题紧凑卡 / 多题内嵌画幅 / 对比题全屏浮层 / 大量简单问题的网格矩阵。所有文本支持 Markdown（代码块、引用、行内代码、加粗）与颜色（`{color:red}文字{/color}`），提交后以对半两列 recap 展示回答。

## 界面预览

以下截图取自实际渲染的工具视图。卡片文案跟随 Web UI 的语言设置，这里是中文界面。

**网格矩阵** — 大量简单问题的全屏浮层，一题一张卡：

<img src="assets/grid-mode.zh.png" alt="网格矩阵模式" width="900">

**内嵌** — 问卷嵌在对话画幅里，填完统一提交：

<img src="assets/inline-mode.zh.png" alt="内嵌模式" width="720">

**全屏对比** — 左右并排对比，正文支持 Markdown：

<img src="assets/overlay-compare.zh.png" alt="全屏对比模式" width="900">

**紧凑卡** — 单题卡片，题型完整：

<img src="assets/compact-mode.zh.png" alt="紧凑模式" width="720">

## 安装

钉在某个 release 上装。构建产物已入库，装的时候不编译、也不经过任何 registry：

```sh
dsh plugin --profile web add "github:jinhuang712/dsh-survey#v1.1.0"
# 重启 dsh web，刷新页面
```

想跟未发布的提交，就跟 `main`：

```sh
dsh plugin --profile web add "github:jinhuang712/dsh-survey#main"
```

或者从本地 checkout 以 link 方式装，改了代码刷新页面即可生效：

```sh
git clone https://github.com/jinhuang712/dsh-survey.git
dsh plugin --profile web add "link:$PWD/dsh-survey"
```

如果你的 dsh profile 目录是 pnpm workspace，pnpm 会要求往 root 加依赖时带 `-w`，透传即可：`dsh plugin --profile web add -w …`。

装好后 `do_a_survey` 工具与问卷 UI 常驻可用。配套 skill `dsh-survey` 随安装注册（`dsh.skills` 声明），说明用法并在 bundle 不可用时提供动态插件兜底配方（`references/dynamic-plugin-fallback.md`）。

## 怎么用

告诉模型你想收集什么，模型会调用 `do_a_survey(mode, questions)`。`mode` 必选：

| mode | 适用 | 呈现 |
|---|---|---|
| `"compact"` | 只有 1 个问题 | 紧凑单题卡片 |
| `"inline"` | 多题、无对比题 | 内嵌对话流固定画幅 |
| `"overlay"` | 含对比题、或需要更宽画布 | 全屏浮层（1180px） |
| `"grid"` | 大量简单问题（是否/单选为主） | 全屏网格矩阵，一个问题一张卡片 |

示例：

```json
{
  "mode": "inline",
  "questions": [
    { "id": "q1", "question": "你用的**操作系统**？", "options": [{ "label": "macOS" }, { "label": "Linux" }] },
    { "id": "q2", "question": "希望支持哪些题型？", "multi_select": true, "options": [{ "label": "单选" }, { "label": "对比" }] },
    { "id": "q3", "kind": "boolean", "question": "需要自动保存进度吗？" },
    { "id": "q4", "question": "其他建议：" }
  ]
}
```

### 题型

| 题型 | 触发 | UI | 答案回传 |
|---|---|---|---|
| 单选 | `options` + 无 `multi_select` | 编号行（1 / 2 / 3） | 选中选项的 label |
| 多选 | `options` + `multi_select: true` | 方形 checkbox | 全部选中项的 label，按选项顺序 |
| 是否 | `kind: "boolean"` | 两行单选点；grid 里是分段开关（不要传 options） | `"yes"` 或 `"no"` |
| 对比 | `kind: "compare"` + `compare: {left: {title,text}, right: {title,text}}` | 左右并排 Block（建议 overlay） | `"left"` 或 `"right"` |
| 开放 | 无 `options`、非 boolean/compare | 多行输入框 | 空 `selected`，正文在 `custom` |

答案对象为 `{ id, selected, custom?, skipped? }`。题目 id 在同一份问卷内必须唯一；30 分钟无人提交的问卷以超时失败，不会把调用挂死。

### 特性

- **Markdown 全渲染**：题目、选项 label/description、对比块、recap 均通过官方安全渲染器（micromark + 协议白名单 + shiki 高亮），支持代码块、引用、行内代码、加粗
- **颜色**：`{color:red}文字{/color}`（支持颜色名 / `#hex` / `rgb()`），在题目、选项、对比块中均可使用
- **跳过/恢复**：每题 ✕ 灰化跳过，↺ 恢复；提交为 `skipped: true`
- **全屏浮层**：`mode: "overlay"` 全屏居中（遮罩 + 1180px），突破对话流 748px 列宽
- **grid 矩阵**：`mode: "grid"` 大量简单问题全屏网格，卡片等高、toggle 贴底、逐卡跳过；对比题自动降级为左右二选一
- **可读 recap**：严格对半两列，逐行"题目 → 答案"
- **无障碍**：radio/checkbox 语义 + 键盘焦点环

## 架构

- **Host half**（`lib/index.mjs`）：Cordis entry
  - `defineTool` 注册 `do_a_survey`，带 30 分钟 `timeoutMs`
  - `webServer.register` 提供 `/api/dsh-survey/submit|cancel`
  - `execute` 按 `exec.callId` 挂起等待；提交、取消、中止、超时、卸载五条路径都会释放
- **Client half**（`lib/client.js`）：`__ModuleLoader__.load` bundle，注册 `tool.call.toolview` key=`do_a_survey`；四档模式（compact/inline/overlay/grid）+ Markdown 与颜色渲染 + `fetch` 提交
- **Skill**（`skills/dsh-survey/SKILL.md`）：用法指南 + 动态插件兜底配方（`references/dynamic-plugin-fallback.md`）

## 验证

先确认装上了：

- `__DSH_BOOT__` 含 `dsh-survey` client 行，`/plugins/dsh-survey/client.js` 返回 200
- `cordis_inspect_query`（Tool.listTools）能看到 `do_a_survey`

再发一轮覆盖四种 mode 的问卷，逐项对照卡片行为：

| 看哪 | 应该是什么样 |
|---|---|
| 单选题 | 前置是编号座 `1` `2`，不是圆点——圆点只出现在是否题 |
| `mode: "grid"` | 所有卡片同一尺寸，每张右上角都有跳过 `✕`，代码块被压成行内而不是把卡片撑高 |
| 对比题 | 两侧都有底面；选中那侧浮起，描边更亮、序号反白 |
| 带 `（推荐）` 的选项 | 渲染成徽章，label 里不再残留该标记——提交后的 recap 里同样不该出现 |
| Markdown 与 `{color:…}` | 加粗、行内代码、围栏代码块正常渲染；带颜色的词与前后文字在同一行 |
| 界面语言 | 跟随 Web UI 的语言设置，切换后卡片立即重新渲染 |

## 卸载

- 从 web profile 的 `cordis.patch.yml` 移除 `dsh-survey` insert 行
- 从 web profile 的 `dsh.profile.bundles` 移除 `dsh-survey` 依赖并 `pnpm remove`

## License

MIT
