# Changelog

All notable changes to **dsh-survey** are documented here.

## [1.0.3] - 2026-08-16

### Fixed
- **调用可能永久挂起**：`do_a_survey` 此前没有任何超时兜底，用户关标签页、刷新或不理会问卷时 Promise 永不 settle，agent loop 卡死、`pending` Map 泄漏。
  - harness 的 timeout-policy 是 per-tool opt-in，只对声明了 `timeoutMs` 的工具生效，本插件没声明
  - 现在声明 `timeoutMs: 30 分钟`，并在进程内挂同长度的兜底定时器（`unref`），覆盖未加载该策略的组合
- **abort 监听器泄漏**：`exec.signal` 上的 `abort` 监听从不移除，每次调用往 run 级 signal 挂一个不会回收的闭包。现在提交、取消、中止、超时、卸载五条路径统一走一个 `finish`，定时器与监听一次性释放。
- **插件卸载后旧调用挂死**：dispose 只摘路由和工具，不处理在途问卷。现在卸载时把未决调用全部 reject。
- **webServer 缺席时仍注册工具**：会给模型一个永远收不到答案的提问。现在没有提交通道就不注册，并打 warn。
- **compact 模式静默吞题**：多题传 `mode: "compact"` 时 UI 只画第 1 题，其余题却按「未作答」提交给模型。现在自动按 inline 呈现，一题不落。
- **重复 label 串选**：选中态以 label 文本为键，两个同名选项会一起高亮、一起 toggle。草稿改为按选项索引记录，label 在提交时解析。
- **recap 丢答案**：多选只回显第一个选项，填了自定义回答则覆盖全部选项。现在全部选项以「、」并列，自定义回答并列展示而非替换。
- **小数标签被截断**：`stripLeadingIndex` 把 `"3.5 Sonnet"` 剥成 `"5 Sonnet"`。数字前缀现在要求标点后不紧跟数字。
- **取消不检查响应**：host 返回 404 时卡片照样显示「问卷已关闭」。现在只有 host 确认才置为关闭，否则回滚并报错。
- **answers 未经校验进模型上下文**：提交内容按 `{id, selected, custom?, skipped?}` 逐条校验，id 必须属于本次调用，不合格返回 `bad answers payload` 且调用继续等待。
- **问题 id 无约束**：缺失或重复的 id 会让 recap 的按 id 匹配全部命中第一条。现在空问卷、缺 id、重复 id 在 execute 阶段即失败并说明原因。

### Changed
- **界面文案跟随语言设置**：标题、题型标签、进度、按钮、占位符、recap 等用户可读文案不再硬编码中文，改为 zh / en 两套词条。
  - 优先读 Web UI 自己的语言服务（`ctx.locale`），没有该服务时按浏览器语言兜底，用户切语言即时重渲染
  - 答案契约不变：boolean 回传 `"yes"` / `"no"`，compare 回传 `"left"` / `"right"`，选项题回传 label 原文
- **boolean 题回传值改为 `"yes"` / `"no"`**（原先是中文 `"是的"` / `"不是"`）：答案契约与界面语言解耦，UI 显示「是的 / 不是」或「Yes / No」，recap 照原样回显。工具 description 与 output schema 写明了各题型的回传形状。
- **README 预览图重画**：四张 SVG 按真实 UI 的设计 token（`--dsw-*` 解析值）与 `.mq-*` 盒模型重绘，随读者的 GitHub 主题明暗切换，示例内容改为英文。
- **全屏浮层补齐 modal 出口**：`overlay` 与 `grid` 支持 Esc 关闭、点遮罩关闭、Tab 在卡片内循环，打开时焦点移入卡片。
- **动态插件兜底配方同步**：以上 host 与 client 修复全部同步；grid 模式补上此前缺失的 compare 题渲染，两版答案格式一致。

## [1.0.2] - 2026-08-15

### Changed
- **`do_a_survey` 提升为默认提问通道**：工具 description、SKILL.md（含 frontmatter）与动态插件兜底配方同步改写。
  - 任何需要向用户提问、确认、收集选择或意见的场景都优先用 `do_a_survey`，哪怕只有 1 个问题、哪怕是/否确认
  - 单题用 `mode: "compact"`，不再走正文提问
  - `ask_user_question` 仅作为插件不可用时的兜底

## [1.0.1] - 2026-08-15

### Changed
- **UI 全面对齐 ask_user_question（composer 卡片风格）**
  - 卡片：`--dsw-specific-input-major` 背景 + 20px 圆角 + `--dsw-shadow-lv2`
  - header：eyebrow/title 排版 + 圆形图标关闭按钮
  - 选项行：40px 高透明行，hover 与选中态用 `--dsw-alias-interactive-bg-hover`；单选显示数字座，多选显示 14px checkbox
  - `(推荐)` 与 `（推荐）` 后缀解析为「推荐」badge
  - 选项行自带「自定义回答」内联输入行，开放题用 textarea
  - 提交按钮换成 primitives `Button`，fallback 用同款主题变量的 primary 按钮
  - 是否题由 toggle 改为两个「是/否」选项行
  - `单选/多选/是否/对比/开放` 标签移到题号行右上角（跳过按钮旁），compact 单题卡同样右上角显示

### Fixed
- **题号与题目正文不在一行**：长 MarkdownText 块会把作为独立 flex span 的题号挤到单独一行。
  - 题号改为 Markdown 段落首字渲染（`N. 题目…`），长题目换行时始终与正文首行同排
  - grid 模式同步修复
  - 1.0.0 的 `.mq-qtext` flex-wrap 修复只覆盖了含 `{color:…}` 标记的题目，裸 MarkdownText div 的普通题目未命中
- **`**加粗**` 紧贴引号或标点渲染成字面星号**（如 `**"家庭信任第一次松动"**`）：micromark 的 CommonMark flanking 规则把贴着标点的分隔符判为非 flanking，星号原样显示。
  - 渲染器在恰好两个 `*` 的分隔符与相邻标点之间插入零宽空格（`padEmphasisPunct`）
  - 题目、选项、描述、header、对比块、recap 全部生效

## [1.0.0] - 2026-08-14

### Added
- **`do_a_survey` tool** — questionnaire-style batch questioning for DeepSeek Harness: ask 1 to 10+ questions at once, filled together and submitted in one go.
- **Four presentation modes** (`mode` parameter, required):
  - `compact` — single-question card (like a rich ask_user_question)
  - `inline` — multi-question survey embedded in the conversation column
  - `overlay` — fullscreen overlay (1180px) for compare questions or wide canvases
  - `grid` — fullscreen grid matrix of simple questions, one card each
- **Five question types**: single-choice (radio), multi-choice (checkbox), yes/no toggle, side-by-side compare, open input.
- **Color support** via `{color:red}text{/color}` syntax (named / hex / rgb), rendered as colored spans.
- **Full Markdown rendering** — code blocks (newline fenced), inline code, triple-backtick, bold, blockquotes.
  - bundle: the official safe renderer
  - dynamic-plugin fallback: an escaping-immune lightweight renderer
- **Skip / restore** per question (`skipped: true`), **two-column recap** after submit, keyboard focus rings, a11y roles.
- **Bundle plugin** (recommended, resident):
  - `lib/index.mjs` Host entry — defineTool + webServer `/api/dsh-survey/submit|cancel`
  - `lib/client.js` client bundle — `__ModuleLoader__.load`
- **Skill** `dsh-survey` (usage guide) + **dynamic-plugin fallback recipe** for environments without the bundle.

### Fixed
- Grid card layout: equal-height cards (`grid-auto-rows:1fr`), compact qtext (number hugs question, skip pinned right), bottom-aligned toggles, restored skip-button styling.
- Markdown escaping across JSON transport: character-class regexes (`[*]{2}`, `` [`]{3} ``) immune to backslash mangling.

## [0.1.0] - 2026-08-14
- Initial release (internal history: rename `ask_many_questions` → `do_a_survey`, grid matrix mode, markdown hardening).
