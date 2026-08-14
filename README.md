# dsh-survey

Questionnaire-style questioning & survey plugin for [DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness) — the `do_a_survey` tool asks 1 to 10+ questions in one go, rendered as a survey and submitted together.

[![license](https://badgen.net/badge/license/MIT/green)](LICENSE)
[![dsh-plugin](https://badgen.net/badge/topic/dsh-plugin/8257D0)](https://github.com/topics/dsh-plugin)
[![中文](https://badgen.net/badge/lang/中文/blue)](README.zh.md)

<div align="center">

| Single | Multi | Yes/No | Compare | Open |
|---|---|---|---|---|
| Radio | Checkbox | Compact toggle | Side-by-side blocks | Multi-line input |

</div>

When the model calls `do_a_survey`, the Web UI renders the survey by `mode`: compact single-question card / inline embedded column / fullscreen overlay for compare / grid matrix for many simple questions. All text supports Markdown (code blocks, blockquotes, inline code, bold) and color (`{color:red}text{/color}`); a readable two-column recap is shown after submit.

## Preview

**Grid matrix** — fullscreen overlay for many simple questions, one card each:

<img src="assets/grid-mode.svg" alt="Grid matrix mode" width="720">

**Inline** — survey embedded in the conversation column, filled and submitted together:

<img src="assets/inline-mode.svg" alt="Inline mode" width="720">

**Overlay compare** — fullscreen side-by-side comparison with Markdown & color:

<img src="assets/overlay-compare.svg" alt="Overlay compare mode" width="720">

**Compact** — single-question card with rich question types:

<img src="assets/compact-mode.svg" alt="Compact mode" width="720">

## Install

**Bundle plugin (recommended, resident)** — build artifacts are committed, one-line install:

```sh
dsh plugin --profile web add "github:jinhuang712/dsh-survey#main"
# restart dsh web, then refresh the page
```

Local directory install (when you have the source):

```sh
git clone https://github.com/jinhuang712/dsh-survey.git
cd dsh-survey
dsh plugin --profile web add .
# restart dsh web, then refresh the page
```

After install, the `do_a_survey` tool and its survey UI are available permanently. The companion skill `dsh-survey` registers with the install (`dsh.skills` declaration): it documents usage and ships a dynamic-plugin fallback recipe (`references/dynamic-plugin-fallback.md`) for environments without the bundle.

## Usage

Tell the model what you want to collect; it calls `do_a_survey(mode, questions)`. `mode` is required:

| mode | When | Presentation |
|---|---|---|
| `"compact"` | Exactly 1 question | Compact single-question card |
| `"inline"` | Multiple questions, no compare | Embedded in the conversation column |
| `"overlay"` | Compare questions or wide canvas | Fullscreen overlay (1180px) |
| `"grid"` | Many simple questions (yes/no, single) | Fullscreen grid matrix, one card each |

Example:

```json
{
  "mode": "inline",
  "questions": [
    { "id": "q1", "question": "Your **OS**?", "options": [{ "label": "macOS" }, { "label": "Linux" }] },
    { "id": "q2", "question": "Which question types?", "multi_select": true, "options": [{ "label": "Single" }, { "label": "Compare" }] },
    { "id": "q3", "kind": "boolean", "question": "Auto-save progress?" },
    { "id": "q4", "question": "Other feedback:" }
  ]
}
```

### Question types

| Type | Trigger | UI |
|---|---|---|
| Single | `options` + no `multi_select` | Radio |
| Multi | `options` + `multi_select: true` | Checkbox |
| Yes/No | `kind: "boolean"` | Compact toggle (omit `options`) |
| Compare | `kind: "compare"` + `compare: {left: {title,text}, right: {title,text}}` | Side-by-side blocks (overlay recommended) |
| Open | no `options`, not boolean/compare | Multi-line input |

### Features

- **Full Markdown** — question text, option labels/descriptions, compare blocks, recap all render through the official safe renderer (micromark + protocol allowlist + shiki highlighting): code blocks, blockquotes, inline code, bold
- **Color** — `{color:red}text{/color}` (named / `#hex` / `rgb()`), usable in questions, options, compare blocks
- **Skip / restore** — per-question ✕ grays out, ↺ restores; submitted as `skipped: true`
- **Fullscreen overlay** — `mode: "overlay"` centers fullscreen (mask + 1180px), breaking past the 748px conversation column
- **Grid matrix** — `mode: "grid"` fullscreen grid of many simple questions: equal-height cards, bottom-aligned toggles, per-card skip; compare questions degrade to left/right choice
- **Readable recap** — strict two-column grid, one "question → answer" row each
- **Accessibility** — radio/checkbox semantics + keyboard focus rings

## Architecture

- **Host half** (`lib/index.mjs`): Cordis entry — `defineTool` registers `do_a_survey`; `webServer.register` serves `/api/dsh-survey/submit|cancel`; `execute` suspends on the answer (`exec.callId` correlation, `exec.signal` abort cleanup)
- **Client half** (`lib/client.js`): `__ModuleLoader__.load` bundle registering `tool.call.toolview` key=`do_a_survey`; four modes (compact/inline/overlay/grid) + Markdown & color rendering + `fetch` submit
- **Skill** (`skills/dsh-survey/SKILL.md`): usage guide + dynamic-plugin fallback recipe (`references/dynamic-plugin-fallback.md`)

## Verify

- After install, `__DSH_BOOT__` should include the `dsh-survey` client row; `/plugins/dsh-survey/client.js` returns 200
- `cordis_inspect_query` (Tool.listTools) should show `do_a_survey`
- Run a 4-6 question survey (with markdown + color text) and check all four modes

## Uninstall

- Remove the `dsh-survey` insert row from the web profile's `cordis.patch.yml`
- Remove the `dsh-survey` dependency from the web profile's `dsh.profile.bundles` and run `pnpm remove`

## License

MIT
