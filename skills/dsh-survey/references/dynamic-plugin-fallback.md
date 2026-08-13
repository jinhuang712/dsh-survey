---
name: ask-many-questions
description: 批量问卷式提问工具（ask_many_questions）的完整插件代码与重建配方。当用户希望"一次性问 10 个以上问题"、"像问卷一样填完统一提交"、"跳过某题"、"是否题 toggle"、"左右对比题"，或任何会话需要重建这个动态 Cordis 插件时使用。加载本 skill 后，用 cordis_define + cordis_run 按下列代码和步骤重建插件，即可获得带完整问卷 UI（单选/多选/是否/对比/开放五类题型、可跳过、全屏浮层、可读 recap）的批量提问工具。
version: 1.0.0
---

# ask-many-questions 插件重建配方

这个 skill 保存了 `ask_many_questions` 动态 Cordis 插件的**完整最终代码**（v14，pkg-14）。任何会话加载本 skill 后，按步骤重建即可恢复全部功能。

## 什么时候使用

- 用户需要**一次性批量提问 10 个以上问题**，且要求问卷式体验（所有问题同屏、填完统一提交）
- 用户提到"问卷"、"批量提问"、"一次问多个问题"、"是否题"、"对比题"、"跳过题目"
- 当前会话没有 `ask_many_questions` 工具（动态插件进程重启后消失），需要重建

## 重建步骤

1. 调用 `cordis_define`：
   - `plugin.kind: "new"`，`idPrefix: "manyq"`
   - `name`: "ask-many-questions"
   - `code.host` 与 `code.client` 使用下方完整代码（一字不差）
2. 调用 `cordis_run`：`mode: "run"`，使用返回的 `pluginId` 和 `packageId`
3. 若返回 `awaiting-approval`（因为含 Client 端代码），等待用户在 UI 上批准
4. 验证：`cordis_inspect_query`（platform: host, provider: Tool, method: listTools）应看到 `ask_many_questions`
5. 用 `ask_many_questions` 发一轮小问卷实测

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

## 完整代码

### code.host

```js
return {
  name: 'ask-many-questions',
  inject: ['tools'],
  apply(ctx) {
    // pending calls: callId -> { resolve, reject }
    const pending = new Map()

    const disposeSubmit = harness.handle('manyq/submit', async (args) => {
      const payload = args || {}
      if (typeof payload.callId !== 'string' || !Array.isArray(payload.answers)) {
        return { ok: false, error: 'bad payload' }
      }
      const entry = pending.get(payload.callId)
      if (!entry) return { ok: false, error: 'no pending call' }
      pending.delete(payload.callId)
      entry.resolve({ answers: payload.answers })
      return { ok: true }
    })

    const disposeCancel = harness.handle('manyq/cancel', async (args) => {
      const payload = args || {}
      if (typeof payload.callId !== 'string') return { ok: false }
      const entry = pending.get(payload.callId)
      if (!entry) return { ok: false }
      pending.delete(payload.callId)
      entry.reject(new Error('questionnaire cancelled by the user'))
      return { ok: true }
    })

    const tool = harness.defineTool({
      name: 'ask_many_questions',
      description: '批量向用户提问：一次可发送任意数量的问题（支持 10 个以上），以问卷形式一次性展示全部问题，用户填完统一提交。适用于需要一次性收集多项信息、多个确认或多项选择时。每个问题需带稳定 id，id 会原样回显在答案中。题型：kind 为 "boolean" 时是紧凑的是/否 toggle（不要传 options）；kind 为 "compare" 时是左右并排对比题（传 compare: { left: {title, text}, right: {title, text} }，让用户选更符合的那一个，问卷会自动加宽为全屏浮层）；有 options 时 multi_select 为 true 是多选、否则单选；无 options 且非 boolean/compare 时是开放填空。顶层 fullscreen: true 可强制问卷以全屏浮层显示（即使没有对比题）。',
      parameters: {
        type: 'object',
        properties: {
          questions: {
            type: 'array',
            description: '要提问的问题列表，可包含任意数量（支持 10 个以上）。',
            items: {
              type: 'object',
              additionalProperties: true,
              properties: {
                id: { type: 'string', description: 'Stable id for this question; echoed in the answer.' },
                question: { type: 'string', description: 'The specific question to ask the user.' },
                header: { type: 'string', description: 'Optional short heading for the question, such as "Confirm" or "Choose Mode".' },
                kind: { type: 'string', description: 'Optional question kind: "boolean" (compact yes/no toggle), "compare" (side-by-side block comparison), or omit for option-based or open questions.' },
                compare: {
                  type: 'object',
                  description: 'Required when kind is "compare": two blocks to compare.',
                  properties: {
                    left: {
                      type: 'object',
                      additionalProperties: true,
                      properties: {
                        title: { type: 'string', description: 'Short heading for the left block.' },
                        text: { type: 'string', description: 'Body content of the left block.' }
                      }
                    },
                    right: {
                      type: 'object',
                      additionalProperties: true,
                      properties: {
                        title: { type: 'string', description: 'Short heading for the right block.' },
                        text: { type: 'string', description: 'Body content of the right block.' }
                      }
                    }
                  }
                },
                options: {
                  type: 'array',
                  description: 'Optional choices to show the user. If you recommend one, put it first and append "(Recommended)" to that label.',
                  items: {
                    type: 'object',
                    additionalProperties: true,
                    properties: {
                      label: { type: 'string', description: 'Short user-facing option label.' },
                      description: { type: 'string', description: 'One sentence explaining the tradeoff or impact.' }
                    },
                    required: ['label']
                  }
                },
                multi_select: { type: 'boolean', description: 'Whether the user may select more than one option. Defaults to false.' }
              },
              required: ['id', 'question']
            }
          },
          fullscreen: { type: 'boolean', description: 'Optional: force the questionnaire to render as a fullscreen overlay (true) or inline in the conversation (false). Defaults to fullscreen when any question is a compare kind.' }
        },
        required: ['questions']
      },
      output: {
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            answers: {
              type: 'array',
              items: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  id: { type: 'string', required: true },
                  selected: { type: 'array', required: true, items: { type: 'string' } },
                  custom: { type: 'string' },
                  skipped: { type: 'boolean' }
                }
              }
            }
          }
        },
        render: (_args, value) => [{ type: 'text', text: JSON.stringify(value) }]
      },
      async execute(args, exec) {
        const callId = exec.callId
        return new Promise((resolve, reject) => {
          const entry = { resolve, reject }
          pending.set(callId, entry)
          const onAbort = () => {
            if (pending.get(callId) === entry) pending.delete(callId)
            reject(new Error('ask_many_questions aborted before the user answered'))
          }
          if (exec.signal && typeof exec.signal.addEventListener === 'function') {
            if (exec.signal.aborted) {
              onAbort()
              return
            }
            exec.signal.addEventListener('abort', onAbort)
          }
        })
      }
    })

    const disposeTool = ctx.tools.register(tool)
    return () => {
      disposeTool()
      disposeSubmit()
      disposeCancel()
    }
  }
}
```

### code.client

```js
return {
  name: 'ask-many-questions',
  apply(ctx) {
    const disposeCss = styles.insert('.mq-frame{padding:10px 24px 16px;display:flex;justify-content:center}.mq-frame.mq-wide{position:fixed;inset:0;z-index:60;background:color-mix(in srgb, var(--dsw-alias-bg-base) 55%, transparent);backdrop-filter:blur(2px);padding:5vh 24px;align-items:center;overflow-y:auto}.mq-card{width:100%;max-width:var(--dsh-chat-content-width, 748px);background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:16px;color:var(--dsw-alias-label-primary);box-shadow:var(--dsw-shadow-lv2, none);display:flex;flex-direction:column;overflow:hidden}.mq-frame.mq-wide .mq-card{max-width:1180px;border-radius:18px}.mq-header{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding:20px 22px 8px}.mq-heading{min-width:0}.mq-eyebrow{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:16px;margin-bottom:6px;letter-spacing:.04em;text-transform:uppercase}.mq-title{margin:0;font-size:18px;font-weight:700;line-height:26px;letter-spacing:-.01em}.mq-body{display:flex;flex-direction:column;gap:16px;padding:16px 22px 10px;max-height:56vh;overflow-y:auto}.mq-question{border:1px solid var(--dsw-alias-border-l1);border-radius:12px;padding:14px 18px;background:var(--dsw-alias-bg-base);transition:border-color .18s ease, box-shadow .18s ease, opacity .18s ease}.mq-question:hover{border-color:var(--dsw-alias-border-l2)}.mq-question.mq-skipped{opacity:.5}.mq-qtop{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:6px}.mq-qtop-left{min-width:0;flex:1}.mq-qtop-right{flex:none;display:flex;align-items:center;gap:8px}.mq-qheader{display:flex;align-items:center;gap:8px;color:var(--dsw-alias-label-secondary);font-size:13px;font-weight:700;line-height:18px;letter-spacing:.02em}.mq-qheader::after{content:"";flex:1;height:1px;background:var(--dsw-alias-border-l1)}.mq-skip{flex:none;background:none;border:1px solid var(--dsw-alias-border-l1);border-radius:8px;color:var(--dsw-alias-label-secondary);cursor:pointer;width:26px;height:26px;display:grid;place-items:center;font-size:13px;line-height:1;padding:0;transition:background .15s ease, color .15s ease, border-color .15s ease}.mq-skip:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-border-l2)}.mq-skip:focus-visible{outline:2px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 60%, transparent);outline-offset:2px}.mq-skipped-tag{display:inline-block;padding:1px 8px;border-radius:999px;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary);font-size:11px;font-weight:600;line-height:16px;letter-spacing:.02em}.mq-qtext{font-size:15px;line-height:22px;font-weight:600;margin-bottom:12px;letter-spacing:-.005em}.mq-qnum{color:var(--dsw-alias-label-tertiary, var(--dsw-alias-label-secondary));font-weight:700;margin-right:4px}.mq-type{display:inline-block;margin-left:8px;padding:1px 8px;border-radius:999px;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary);font-size:11px;font-weight:600;line-height:16px;vertical-align:2px;letter-spacing:.02em}.mq-options{display:flex;flex-direction:column;gap:8px;margin-bottom:12px}.mq-opt{display:flex;align-items:flex-start;gap:10px;text-align:left;width:100%;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:12px;color:var(--dsw-alias-label-primary);cursor:pointer;padding:11px 13px;font-size:13px;line-height:18px;transition:border-color .18s ease, background .18s ease, box-shadow .18s ease;font-family:inherit}.mq-opt:hover{background:var(--dsw-alias-bg-layer-1);border-color:var(--dsw-alias-border-l2)}.mq-opt:active:not(:disabled){transform:scale(.995)}.mq-opt[data-on]{border-color:var(--dsw-alias-brand-primary);background:color-mix(in srgb, var(--dsw-alias-brand-primary) 14%, var(--dsw-alias-bg-layer-2));box-shadow:0 0 0 1px color-mix(in srgb, var(--dsw-alias-brand-primary) 40%, transparent) inset}.mq-opt:focus-visible{outline:2px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 70%, transparent);outline-offset:2px}.mq-opt-label{display:block;font-weight:600}.mq-opt-desc{display:block;color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:400;line-height:16px;margin-top:3px}.mq-mark{flex:none;width:19px;height:19px;border:1px solid var(--dsw-alias-border-l2);border-radius:6px;display:grid;place-items:center;font-size:12px;line-height:1;margin-top:1px;transition:background .15s ease, border-color .15s ease, transform .15s cubic-bezier(.34,1.56,.64,1);color:var(--dsw-alias-bg-base)}.mq-mark.mq-radio{border-radius:50%}.mq-opt[data-on] .mq-mark{background:var(--dsw-alias-brand-primary);border-color:var(--dsw-alias-brand-primary);transform:scale(1.08)}.mq-bool{display:flex;align-items:center;gap:10px;margin-bottom:12px;flex-wrap:wrap}.mq-bool-label{color:var(--dsw-alias-label-secondary);font-size:13px;line-height:18px}.mq-bool-switch{display:inline-flex;align-items:center;gap:0;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;background:var(--dsw-alias-bg-layer-2);padding:3px;cursor:pointer;transition:border-color .18s ease, box-shadow .18s ease}.mq-bool-switch:hover{border-color:var(--dsw-alias-border-l2)}.mq-bool-switch:focus-visible{outline:2px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 60%, transparent);outline-offset:2px}.mq-bool-side{border:none;background:none;color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:600;line-height:1;padding:6px 14px;border-radius:999px;cursor:pointer;transition:background .18s ease, color .18s ease;font-family:inherit;min-width:44px}.mq-bool-side[data-on]{background:var(--dsw-alias-brand-primary);color:var(--dsw-alias-bg-base)}.mq-compare{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:12px}.mq-compare-block{display:flex;flex-direction:column;gap:8px;text-align:left;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:14px;color:var(--dsw-alias-label-primary);cursor:pointer;padding:20px 22px;font-size:13px;line-height:20px;transition:border-color .18s ease, background .18s ease, box-shadow .18s ease;font-family:inherit;min-width:0}.mq-compare-block:hover{background:var(--dsw-alias-bg-layer-1);border-color:var(--dsw-alias-border-l2)}.mq-compare-block[data-on]{border-color:var(--dsw-alias-brand-primary);background:color-mix(in srgb, var(--dsw-alias-brand-primary) 14%, var(--dsw-alias-bg-layer-2));box-shadow:0 0 0 1px color-mix(in srgb, var(--dsw-alias-brand-primary) 40%, transparent) inset}.mq-compare-block:focus-visible{outline:2px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 70%, transparent);outline-offset:2px}.mq-compare-title{font-weight:700;font-size:14px;line-height:20px;display:flex;align-items:center;gap:8px}.mq-compare-title .mq-mark{width:18px;height:18px;font-size:11px}.mq-compare-text{color:var(--dsw-alias-label-secondary);font-size:13.5px;line-height:22px;white-space:pre-wrap;word-break:break-word}.mq-custom{width:100%;box-sizing:border-box;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:10px;color:var(--dsw-alias-label-primary);padding:10px 13px;font-size:13px;line-height:19px;outline:none;transition:border-color .18s ease;font-family:inherit}.mq-custom::placeholder{color:var(--dsw-alias-label-tertiary, var(--dsw-alias-label-secondary));opacity:.75}.mq-custom:hover{border-color:var(--dsw-alias-border-l2)}.mq-custom:focus{border-color:var(--dsw-alias-brand-primary)}.mq-custom.mq-open{min-height:76px;resize:vertical;line-height:21px;padding:11px 13px}.mq-footer{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:14px 22px 20px}.mq-progress{color:var(--dsw-alias-label-secondary);font-size:13px;font-weight:500;line-height:18px}.mq-progress b{color:var(--dsw-alias-label-primary);font-weight:700}.mq-submit{background:var(--dsw-alias-brand-primary);border:none;border-radius:10px;color:var(--dsw-alias-bg-base);cursor:pointer;font-size:13px;font-weight:700;line-height:18px;padding:11px 24px;min-width:136px;transition:opacity .15s ease, transform .08s ease, box-shadow .15s ease;font-family:inherit}.mq-submit:hover:not(:disabled){opacity:.9;box-shadow:0 2px 10px color-mix(in srgb, var(--dsw-alias-brand-primary) 30%, transparent)}.mq-submit:active:not(:disabled){transform:scale(.97)}.mq-submit:focus-visible{outline:2px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 70%, transparent);outline-offset:2px}.mq-submit:disabled{opacity:.5;cursor:default}.mq-close{background:none;border:none;color:var(--dsw-alias-label-secondary);cursor:pointer;font-size:15px;line-height:1;padding:6px 8px;border-radius:8px;transition:background .15s ease, color .15s ease}.mq-close:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2)}.mq-close:focus-visible{outline:2px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 70%, transparent);outline-offset:2px}.mq-error{color:var(--dsw-alias-state-error-primary);font-size:12px;line-height:16px;font-weight:500}.mq-settled{display:flex;flex-direction:column;gap:10px;padding:16px 22px;font-size:13px;line-height:20px}.mq-settled-title{color:var(--dsw-alias-state-success-primary);font-weight:700}.mq-recap{display:flex;flex-direction:column;gap:6px;max-height:200px;overflow-y:auto;padding-right:4px}.mq-recap-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:baseline;padding:4px 0;border-bottom:1px solid var(--dsw-alias-border-l1)}.mq-recap-row:last-child{border-bottom:none}.mq-recap-q{color:var(--dsw-alias-label-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:400}.mq-recap-a{color:var(--dsw-alias-label-primary);font-weight:600;min-width:0;word-break:break-word}.mq-recap-empty{color:var(--dsw-alias-label-tertiary, var(--dsw-alias-label-secondary));font-weight:400}')

    const slots = ctx.get('slots')
    if (slots === undefined) return disposeCss

    const disposeSlot = slots.inject('tool.call.toolview', () => slots.register(
      { name: 'tool.call.toolview', key: 'ask_many_questions' },
      (props) => {
        const block = props.block
        if (block.kind === 'tool-result') {
          let questions = []
          let answers = []
          try {
            if (block.call && typeof block.call.argsRaw === 'string') {
              const parsed = JSON.parse(block.call.argsRaw)
              if (Array.isArray(parsed.questions)) questions = parsed.questions
            }
          } catch (error) {
            questions = []
          }
          try {
            if (block.content && Array.isArray(block.content)) {
              const text = block.content
                .map((c) => (c && typeof c.text === 'string' ? c.text : ''))
                .join('')
              if (text) {
                const parsed = JSON.parse(text)
                if (Array.isArray(parsed.answers)) answers = parsed.answers
              }
            }
          } catch (error) {
            answers = []
          }
          const renderAnswer = (q, a) => {
            if (!a) return '未回答'
            if (a.skipped) return '已跳过'
            const custom = a.custom && String(a.custom).trim() !== '' ? String(a.custom).trim() : ''
            if (custom) return custom
            const picked = a.selected && a.selected.length > 0 ? a.selected[0] : ''
            if (!picked) return '未回答'
            if (q.kind === 'compare' && q.compare) {
              const side = q.compare[picked]
              return side && side.title ? String(side.title) : picked
            }
            return picked
          }
          return React.createElement('div', { className: 'mq-frame' },
            React.createElement('div', { className: 'mq-card' },
              React.createElement('div', { className: 'mq-settled' },
                React.createElement('span', { className: 'mq-settled-title' }, '✅ 问卷已回答'),
                questions.length > 0
                  ? React.createElement('div', { className: 'mq-recap' },
                      questions.map((q, index) => {
                        const a = answers.find((item) => item.id === q.id)
                        return React.createElement('div', { className: 'mq-recap-row', key: q.id || String(index) },
                          React.createElement('span', { className: 'mq-recap-q' }, String(index + 1) + '. ' + String(q.question)),
                          React.createElement('span', { className: a && (a.custom || (a.selected || []).length > 0) ? 'mq-recap-a' : 'mq-recap-empty' }, renderAnswer(q, a))
                        )
                      })
                    )
                  : React.createElement('div', { className: 'mq-recap-empty' }, '共 ' + answers.length + ' 题已回答，结果已返回给模型')
              )
            )
          )
        }

        let questions = []
        let fullscreen = false
        try {
          const parsed = JSON.parse(block.argsRaw || '{}')
          if (Array.isArray(parsed.questions)) questions = parsed.questions
          if (parsed.fullscreen === true) fullscreen = true
        } catch (error) {
          questions = []
        }

        const hasCompare = questions.some((q) => q.kind === 'compare')
        const isWide = hasCompare || fullscreen

        const initialDrafts = () => questions.map(() => ({ selected: [], custom: '', skipped: false }))
        const [drafts, setDrafts] = React.useState(initialDrafts)
        const [submitting, setSubmitting] = React.useState(false)
        const [submitted, setSubmitted] = React.useState(false)
        const [error, setError] = React.useState(null)
        const [closed, setClosed] = React.useState(false)

        React.useEffect(() => {
          setDrafts(initialDrafts)
          setSubmitting(false)
          setSubmitted(false)
          setError(null)
        }, [block.callId])

        const answeredCount = drafts.filter((d) => !d.skipped && (d.selected.length > 0 || d.custom.trim() !== '')).length

        const choose = (index, label) => {
          if (submitting || submitted) return
          setDrafts((current) => current.map((d, i) => {
            if (i !== index) return d
            const q = questions[index]
            if (q.multi_select === true) {
              const selected = d.selected.includes(label)
                ? d.selected.filter((item) => item !== label)
                : [...d.selected, label]
              return { ...d, selected, skipped: false }
            }
            return { ...d, selected: [label], skipped: false }
          }))
        }

        const setBool = (index, value) => {
          if (submitting || submitted) return
          setDrafts((current) => current.map((d, i) =>
            i === index ? { ...d, selected: [value], skipped: false } : d
          ))
        }

        const setCompare = (index, side) => {
          if (submitting || submitted) return
          setDrafts((current) => current.map((d, i) =>
            i === index ? { ...d, selected: [side], skipped: false } : d
          ))
        }

        const setCustom = (index, value) => {
          if (submitting || submitted) return
          setDrafts((current) => current.map((d, i) =>
            i === index ? { ...d, custom: value, skipped: false } : d
          ))
        }

        const toggleSkip = (index) => {
          if (submitting || submitted) return
          setDrafts((current) => current.map((d, i) =>
            i === index ? { ...d, skipped: !d.skipped, selected: [], custom: '' } : d
          ))
        }

        const submit = async () => {
          if (submitting || submitted) return
          setSubmitting(true)
          setError(null)
          try {
            const answers = questions.map((q, i) => {
              const d = drafts[i] || { selected: [], custom: '' }
              if (d.skipped) return { id: q.id, selected: [], skipped: true }
              const custom = (d.custom || '').trim()
              return {
                id: q.id,
                selected: custom === '' || q.multi_select === true ? d.selected : [],
                ...(custom === '' ? {} : { custom })
              }
            })
            const res = await host.call('manyq/submit', { callId: block.callId, answers })
            if (res && res.ok === true) {
              setSubmitted(true)
            } else {
              setError((res && res.error) || '提交失败')
              setSubmitting(false)
            }
          } catch (cause) {
            setError(cause instanceof Error ? cause.message : String(cause))
            setSubmitting(false)
          }
        }

        const cancel = async () => {
          if (closed) return
          setClosed(true)
          try {
            await host.call('manyq/cancel', { callId: block.callId })
          } catch (cause) {
            setClosed(false)
          }
        }

        if (closed) {
          return React.createElement('div', { className: 'mq-frame' },
            React.createElement('div', { className: 'mq-card' },
              React.createElement('div', { className: 'mq-settled' },
                React.createElement('span', { className: 'mq-settled-title' }, '问卷已关闭')
              )
            )
          )
        }

        return React.createElement('div', { className: 'mq-frame' + (isWide ? ' mq-wide' : '') },
          React.createElement('section', { className: 'mq-card' },
            React.createElement('header', { className: 'mq-header' },
              React.createElement('div', { className: 'mq-heading' },
                React.createElement('div', { className: 'mq-eyebrow' }, '问卷 · 共 ' + questions.length + ' 题'),
                React.createElement('h2', { className: 'mq-title' }, '请回答以下问题，填完统一提交')
              ),
              React.createElement('button', {
                type: 'button',
                className: 'mq-close',
                title: '关闭问卷',
                'aria-label': '关闭问卷',
                disabled: submitting || submitted,
                onClick: cancel
              }, '✕')
            ),
            React.createElement('div', { className: 'mq-body' },
              questions.map((q, index) => {
                const d = drafts[index] || { selected: [], custom: '', skipped: false }
                const options = Array.isArray(q.options) ? q.options : []
                const isBool = q.kind === 'boolean'
                const isCompare = q.kind === 'compare'
                const isOpen = !isBool && !isCompare && options.length === 0
                const typeLabel = isBool ? '是否' : isCompare ? '对比' : q.multi_select === true ? '多选' : isOpen ? '开放' : '单选'
                const bodyDisabled = submitting || submitted || d.skipped
                return React.createElement('div', { className: 'mq-question' + (d.skipped ? ' mq-skipped' : ''), key: q.id || String(index) },
                  React.createElement('div', { className: 'mq-qtop' },
                    React.createElement('div', { className: 'mq-qtop-left' },
                      q.header !== undefined && React.createElement('div', { className: 'mq-qheader' }, String(q.header))
                    ),
                    React.createElement('div', { className: 'mq-qtop-right' },
                      d.skipped && React.createElement('span', { className: 'mq-skipped-tag' }, '已跳过'),
                      React.createElement('button', {
                        type: 'button',
                        className: 'mq-skip',
                        title: d.skipped ? '恢复此题' : '跳过此题',
                        'aria-label': d.skipped ? '恢复此题' : '跳过此题',
                        disabled: submitting || submitted,
                        onClick: () => toggleSkip(index)
                      }, d.skipped ? '↺' : '✕')
                    )
                  ),
                  React.createElement('div', { className: 'mq-qtext' },
                    React.createElement('span', { className: 'mq-qnum' }, String(index + 1) + '.'),
                    String(q.question),
                    React.createElement('span', { className: 'mq-type' }, typeLabel)
                  ),
                  isBool
                    ? React.createElement('div', { className: 'mq-bool' },
                        React.createElement('span', { className: 'mq-bool-label' }, '你的选择'),
                        React.createElement('span', {
                          className: 'mq-bool-switch',
                          role: 'radiogroup',
                          'aria-label': String(q.question)
                        },
                          React.createElement('button', {
                            type: 'button',
                            role: 'radio',
                            'aria-checked': d.selected[0] === '是' || undefined,
                            className: 'mq-bool-side',
                            'data-on': d.selected[0] === '是' || undefined,
                            disabled: bodyDisabled,
                            onClick: () => setBool(index, '是')
                          }, '是'),
                          React.createElement('button', {
                            type: 'button',
                            role: 'radio',
                            'aria-checked': d.selected[0] === '否' || undefined,
                            className: 'mq-bool-side',
                            'data-on': d.selected[0] === '否' || undefined,
                            disabled: bodyDisabled,
                            onClick: () => setBool(index, '否')
                          }, '否')
                        )
                      )
                    : isCompare
                      ? React.createElement('div', { className: 'mq-compare' },
                          ['left', 'right'].map((side) => {
                            const item = (q.compare && q.compare[side]) || {}
                            const on = d.selected[0] === side
                            return React.createElement('button', {
                              type: 'button',
                              key: side,
                              className: 'mq-compare-block',
                              'data-on': on || undefined,
                              disabled: bodyDisabled,
                              onClick: () => setCompare(index, side)
                            },
                              React.createElement('span', { className: 'mq-compare-title' },
                                React.createElement('span', { className: 'mq-mark' + (on ? '' : ' mq-radio') }, on ? '●' : ''),
                                item.title ? String(item.title) : (side === 'left' ? '方案 A' : '方案 B')
                              ),
                              item.text !== undefined && React.createElement('span', { className: 'mq-compare-text' }, String(item.text))
                            )
                          })
                        )
                      : React.createElement(React.Fragment, null,
                          !isOpen && React.createElement('div', { className: 'mq-options' },
                            options.map((opt, oi) => {
                              const on = d.selected.includes(opt.label)
                              return React.createElement('button', {
                                type: 'button',
                                key: String(oi),
                                className: 'mq-opt',
                                'data-on': on || undefined,
                                disabled: bodyDisabled,
                                onClick: () => choose(index, opt.label)
                              },
                                React.createElement('span', {
                                  className: 'mq-mark' + (q.multi_select === true ? '' : ' mq-radio')
                                }, on ? (q.multi_select === true ? '✓' : '●') : ''),
                                React.createElement('span', null,
                                  React.createElement('span', { className: 'mq-opt-label' }, opt.label),
                                  opt.description !== undefined && React.createElement('span', { className: 'mq-opt-desc' }, String(opt.description))
                                )
                              )
                            })
                          ),
                          React.createElement(isOpen ? 'textarea' : 'input', {
                            className: isOpen ? 'mq-custom mq-open' : 'mq-custom',
                            placeholder: isOpen ? '请输入回答' : '补充说明（可选）',
                            rows: isOpen ? 3 : undefined,
                            value: d.custom,
                            disabled: bodyDisabled,
                            onChange: (event) => setCustom(index, event.target.value)
                          })
                        )
                )
              })
            ),
            React.createElement('footer', { className: 'mq-footer' },
              React.createElement('div', { className: 'mq-progress' },
                error
                  ? React.createElement('span', { className: 'mq-error' }, String(error))
                  : React.createElement('span', null, '已答 ', React.createElement('b', null, String(answeredCount)), ' / ' + questions.length + ' 题')
              ),
              React.createElement('button', {
                type: 'button',
                className: 'mq-submit',
                disabled: submitting || submitted || questions.length === 0,
                onClick: submit
              }, submitted ? '已提交 ✓' : submitting ? '提交中…' : '提交全部回答')
            )
          )
        )
      }
    ))

    return () => {
      disposeSlot()
      disposeCss()
    }
  }
}
```

## 注意事项

- 必须用 `cordis_define` + `cordis_run` 重建（动态插件机制），**不要**尝试写进 preset 的 `agent.cordis.yml`——自定义 Client 代码不在 Web 构建产物里，静态 preset 无法加载它
- 每次 `cordis_define` 追加的是不可变 Package；迭代时用 `plugin.kind: "existing"` + 原 pluginId 追加新 Package，再用 `cordis_run`（mode: update）切换
- 含 Client 端代码，`cordis_run` 可能返回 `awaiting-approval`，需用户批准
- Host 端 `execute` 用 `exec.callId` 挂起等待，Client 端通过 `host.call('manyq/submit' | 'manyq/cancel')` 完成或取消；`exec.signal` 中止时自动清理 pending
- 若重建后功能与预期不符，优先检查 `cordis_inspect_self(pluginId, packageId)` 的诊断信息
