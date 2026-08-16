# AGENTS.md

Notes for coding agents and language models working with this repository, or
deciding whether to call the tool it provides.

## What this package is

`dsh-survey` adds one tool, **`do_a_survey`**, to [DeepSeek Harness]. It lets a
model ask a batch of questions in a single card instead of one question per
turn. The user answers them together and submits once.

Use it whenever you need more than one thing from the user, and prefer it over
asking in prose even for a single yes/no — a card is answerable in one click and
comes back as structured data rather than text you have to parse.

[DeepSeek Harness]: https://github.com/deepseek-ai/DeepSeek-Harness

## Calling it

`do_a_survey(mode, questions)`. `mode` is required.

| mode | Use when | Renders as |
|---|---|---|
| `"compact"` | exactly 1 question | single-question card |
| `"inline"` | several questions, no comparison | embedded in the conversation column |
| `"overlay"` | a compare question, or long option text | fullscreen overlay, 1180px |
| `"grid"` | many short questions | fullscreen matrix, one card each |

Passing more than one question with `"compact"` silently widens to `"inline"`,
because a compact card renders only the first question and the rest would be
submitted unanswered.

```json
{
  "mode": "inline",
  "questions": [
    {
      "id": "q1",
      "header": "Runtime",
      "question": "Which runtime does this ship on?",
      "options": [
        { "label": "Node 20 LTS (recommended)", "description": "Matches the CI base image." },
        { "label": "Bun 1.1", "description": "Faster boot, fewer native addons." }
      ]
    },
    { "id": "q2", "kind": "boolean", "question": "Ship behind a flag first?" },
    { "id": "q3", "question": "Anything the changelog should call out?" }
  ]
}
```

Every question needs a stable, unique `id`; it is echoed back verbatim. An
optional `header` shows as a short heading beside the question number, and a
trailing `(recommended)` on a label becomes a badge.

## Question types and what comes back

| Type | Trigger | Answer shape |
|---|---|---|
| Single | `options`, no `multi_select` | the chosen option's label |
| Multi | `options` + `multi_select: true` | every chosen label, in option order |
| Yes/No | `kind: "boolean"`, omit `options` | `"yes"` or `"no"` |
| Compare | `kind: "compare"` + `compare: {left, right}` | `"left"` or `"right"` |
| Open | no `options`, not boolean/compare | empty `selected`, text in `custom` |

Each answer is `{ id, selected, custom?, skipped? }`. Answer values are
language-neutral: boolean and compare return the literals above regardless of
the interface language, and option questions return the label exactly as you
authored it.

A survey nobody submits within 30 minutes fails on timeout rather than hanging
the call, so it is safe to ask and await.

## Writing good questions

- Put the decision in the question text, the tradeoff in each option's
  `description`. The card shows both on one line.
- Mark the option you would pick with a trailing `(recommended)`. It renders as
  a badge, and the marker is stripped from the visible label.
- `grid` flattens card text to inline-only — a fenced code block collapses to
  inline code — because its cards are small and all one size. Put anything that
  needs a code block in `overlay` or `inline` instead.
- Markdown works in question text, option labels and descriptions, and compare
  blocks: bold, inline code, fenced blocks, blockquotes.
- `{color:red}text{/color}` colours a run (named, `#hex`, or `rgb()`).

## Repository layout

- `src/` — client source; `pnpm build` bundles it to `lib/client.js` via esbuild
- `lib/index.mjs` — host half: registers the tool, serves submit/cancel routes
- `lib/client.js` — built artifact, committed so installing from GitHub needs no
  build step. Edit `src/`, never this file.
- `skills/dsh-survey/` — usage guide plus a dynamic-plugin fallback recipe
- `assets/` — README screenshots, captured from the running UI

Run `pnpm build` after any change under `src/`, and commit the rebuilt
`lib/client.js` and `lib/client.js.map` alongside it.
