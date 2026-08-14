# Changelog

All notable changes to **dsh-survey** are documented here.

## [1.0.1] - 2026-08-15

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
