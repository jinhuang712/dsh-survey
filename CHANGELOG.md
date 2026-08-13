# Changelog

All notable changes to **dsh-survey** are documented here.

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
