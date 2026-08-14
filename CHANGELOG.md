# Changelog

All notable changes to **dsh-survey** are documented here.

## [1.0.2] - 2026-08-15

### Changed
- **`do_a_survey` 提升为默认提问通道**：工具 description、SKILL.md（含 frontmatter）与动态插件兜底配方同步改写——任何需要向用户提问、确认、收集选择或意见的场景（哪怕只有 1 个问题、哪怕是/否确认）都优先使用 `do_a_survey`（单题用 `mode: "compact"`），而不是正文提问或 `ask_user_question`；`ask_user_question` 仅作为插件不可用时的兜底。

## [1.0.1] - 2026-08-15

### Changed
- **UI 全面对齐 ask_user_question（composer 卡片风格）**：卡片改用 `--dsw-specific-input-major` 背景 + 20px 圆角 + `--dsw-shadow-lv2`，header 用 eyebrow/title 排版 + 圆形图标关闭按钮；选项行改为 40px 高透明行（hover/选中 `--dsw-alias-interactive-bg-hover`），单选显示数字座、多选显示 14px checkbox；`(推荐)`/`（推荐）` 后缀解析为「推荐」badge；选项行自带「自定义回答」内联输入行，开放题用 textarea；提交按钮换成 primitives `Button`（fallback 用同款主题变量的 primary 按钮）。是否题由 toggle 改为两个「是/否」选项行。：`单选/多选/是否/对比/开放` 标签不再跟在题目正文后面，改为显示在题号行右上角（跳过按钮旁），题目行更干净；compact 单题卡同样右上角显示。

### Fixed
- **题号与题目正文不在一行（复发）**：题号不再作为独立 flex span（长 MarkdownText 块会把题号挤到单独一行），而是作为 Markdown 段落首字渲染（`N. 题目…`），长题目换行时题号始终与正文首行同排；grid 模式同步修复。上一版 `.mq-qtext` flex-wrap 修复只覆盖了含 `{color:…}` 标记的题目，普通题目（裸 MarkdownText div）未命中。
- **`**加粗**` 紧贴引号/标点渲染成字面星号**（如 `**"家庭信任第一次松动"**`）：micromark 的 CommonMark flanking 规则会把贴着标点的分隔符判为非 flanking，星号原样显示。渲染器现在会在恰好两个 `*` 的分隔符与相邻标点之间插入零宽空格（`padEmphasisPunct`），题目、选项、描述、header、对比块、recap 全部生效。

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
- **Full Markdown rendering** — code blocks (newline fenced), inline code, triple-backtick, bold, blockquotes — via the official safe renderer in the bundle; an escaping-immune lightweight renderer in the dynamic-plugin fallback.
- **Skip / restore** per question (`skipped: true`), **two-column recap** after submit, keyboard focus rings, a11y roles.
- **Bundle plugin** (recommended, resident): `lib/index.mjs` Host entry (defineTool + webServer `/api/dsh-survey/submit|cancel`), `lib/client.js` client bundle (`__ModuleLoader__.load`).
- **Skill** `dsh-survey` (usage guide) + **dynamic-plugin fallback recipe** for environments without the bundle.

### Fixed
- Grid card layout: equal-height cards (`grid-auto-rows:1fr`), compact qtext (number hugs question, skip pinned right), bottom-aligned toggles, restored skip-button styling.
- Markdown escaping across JSON transport: character-class regexes (`[*]{2}`, `` [`]{3} ``) immune to backslash mangling.

## [0.1.0] - 2026-08-14
- Initial release (internal history: rename `ask_many_questions` → `do_a_survey`, grid matrix mode, markdown hardening).
