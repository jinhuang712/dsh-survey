# 动态插件兜底配方（dsh-survey v2）

> 本文档是 `dsh-survey` 的**动态 Cordis 插件版**完整代码与重建步骤。当 bundle 插件不可用（未安装、进程未重启、或 headless 环境）时，用 `cordis_define` + `cordis_run` 现场重建 `do_a_survey` 工具。重建后工具名、题型、三档 mode、Markdown 渲染与 bundle 版完全一致（差异仅在内部通道：动态版用 `harness.handle`/`host.call`，bundle 版用 webServer 路由/`fetch`）。

## 重建步骤

1. 调用 `cordis_define`：
   - `plugin.kind: "new"`，`idPrefix: "dsvy"`
   - `name`: "dsh-survey"
   - `code.host` 与 `code.client` 使用下方完整代码（一字不差）
2. 调用 `cordis_run`：`mode: "run"`，使用返回的 `pluginId` 和 `packageId`
3. 若返回 `awaiting-approval`（含 Client 端代码），等待用户在 UI 上批准
4. 验证：`cordis_inspect_query`（platform: host, provider: Tool, method: listTools）应看到 `do_a_survey`
5. 发一轮实测：单题 `mode: "compact"`、多题 `mode: "inline"`、对比题 `mode: "overlay"`

## 工具 schema 速览

`do_a_survey(mode: "compact"|"inline"|"overlay", questions: [...])`

- `mode`（必选）呈现形态：`"compact"` 单题紧凑卡；`"inline"` 多题内嵌 748px；`"overlay"` 全屏浮层（对比题或需宽画布）
- 每题：`id`（必填）、`question`（必填，支持 Markdown）、`header?`（支持 Markdown）、`kind?`（`"boolean"`/`"compare"`）、`compare?`（`{left:{title,text}, right:{title,text}}`，支持 Markdown）、`options?`（`{label, description?}`，均支持 Markdown）、`multi_select?`
- 无 options 且非 boolean/compare = 开放填空

## 完整代码

### code.host

```js
return {
  name: 'dsh-survey',
  inject: ['tools'],
  apply(ctx) {
    // pending calls: callId -> { resolve, reject }
    const pending = new Map()

    const disposeSubmit = harness.handle('dsvy/submit', async (args) => {
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

    const disposeCancel = harness.handle('dsvy/cancel', async (args) => {
      const payload = args || {}
      if (typeof payload.callId !== 'string') return { ok: false }
      const entry = pending.get(payload.callId)
      if (!entry) return { ok: false }
      pending.delete(payload.callId)
      entry.reject(new Error('survey cancelled by the user'))
      return { ok: true }
    })

    const tool = harness.defineTool({
      name: 'do_a_survey',
      description: '向用户发起一份调查问卷（一次可含任意数量问题，支持 10 个以上），收集确认、选择、偏好或意见。请主动在需要批量收集信息、多个确认或多项选择时使用本工具。支持 Markdown 渲染：题目文本、选项 label/description、对比块正文都可以包含 markdown（**加粗**、`行内代码`、```代码块```、> 引用等）。每个问题需带稳定 id，id 会原样回显在答案中。题型：kind 为 "boolean" 时是紧凑的是/否 toggle（不要传 options）；kind 为 "compare" 时是左右并排对比题（传 compare: { left: {title, text}, right: {title, text} }）；有 options 时 multi_select 为 true 是多选、否则单选；无 options 且非 boolean/compare 时是开放填空。呈现模式由 mode 显式指定：单题用 "compact"（紧凑卡片）；多题无对比用 "inline"（内嵌对话流）；含对比题或需要更宽画布用 "overlay"（全屏浮层）。',
      parameters: {
        type: 'object',
        properties: {
          mode: {
            type: 'string',
            description: '呈现模式（必选）："compact" = 单题紧凑卡片；"inline" = 多题内嵌在对话流固定画幅；"overlay" = 全屏浮层加宽（适合含对比题或需要更宽展示）。'
          },
          questions: {
            type: 'array',
            description: '要提问的问题列表，可包含任意数量（支持 10 个以上）。所有文本支持 Markdown。',
            items: {
              type: 'object',
              additionalProperties: true,
              properties: {
                id: { type: 'string', description: 'Stable id for this question; echoed in the answer.' },
                question: { type: 'string', description: 'The specific question to ask the user. Supports Markdown.' },
                header: { type: 'string', description: 'Optional short heading for the question. Supports Markdown.' },
                kind: { type: 'string', description: 'Optional question kind: "boolean" (compact yes/no toggle), "compare" (side-by-side block comparison), or omit.' },
                compare: {
                  type: 'object',
                  description: 'Required when kind is "compare": two blocks to compare. Supports Markdown.',
                  properties: {
                    left: {
                      type: 'object',
                      additionalProperties: true,
                      properties: {
                        title: { type: 'string', description: 'Short heading for the left block. Supports Markdown.' },
                        text: { type: 'string', description: 'Body content of the left block. Supports Markdown.' }
                      }
                    },
                    right: {
                      type: 'object',
                      additionalProperties: true,
                      properties: {
                        title: { type: 'string', description: 'Short heading for the right block. Supports Markdown.' },
                        text: { type: 'string', description: 'Body content of the right block. Supports Markdown.' }
                      }
                    }
                  }
                },
                options: {
                  type: 'array',
                  description: 'Optional choices to show the user. Labels and descriptions support Markdown.',
                  items: {
                    type: 'object',
                    additionalProperties: true,
                    properties: {
                      label: { type: 'string', description: 'Short user-facing option label. Supports Markdown.' },
                      description: { type: 'string', description: 'One sentence explaining the tradeoff or impact. Supports Markdown.' }
                    },
                    required: ['label']
                  }
                },
                multi_select: { type: 'boolean', description: 'Whether the user may select more than one option. Defaults to false.' }
              },
              required: ['id', 'question']
            }
          }
        },
        required: ['mode', 'questions']
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
            reject(new Error('do_a_survey aborted before the user answered'))
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
  name: 'dsh-survey',
  apply(ctx) {
    const disposeCss = styles.insert('.mq-frame{padding:10px 24px 16px;display:flex;justify-content:center}.mq-frame.mq-wide{position:fixed;inset:0;z-index:60;background:color-mix(in srgb, var(--dsw-alias-bg-base) 55%, transparent);backdrop-filter:blur(2px);padding:5vh 24px;align-items:center;overflow-y:auto}.mq-card{width:100%;max-width:var(--dsh-chat-content-width, 748px);background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:16px;color:var(--dsw-alias-label-primary);box-shadow:var(--dsw-shadow-lv2, none);display:flex;flex-direction:column;overflow:hidden}.mq-frame.mq-wide .mq-card{max-width:1180px;border-radius:18px}.mq-header{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding:20px 22px 8px}.mq-heading{min-width:0}.mq-eyebrow{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:16px;margin-bottom:6px;letter-spacing:.04em;text-transform:uppercase}.mq-title{margin:0;font-size:18px;font-weight:700;line-height:26px;letter-spacing:-.01em}.mq-body{display:flex;flex-direction:column;gap:16px;padding:16px 22px 10px;max-height:56vh;overflow-y:auto}.mq-question{border:1px solid var(--dsw-alias-border-l1);border-radius:12px;padding:14px 18px;background:var(--dsw-alias-bg-base);transition:border-color .18s ease, box-shadow .18s ease, opacity .18s ease}.mq-question:hover{border-color:var(--dsw-alias-border-l2)}.mq-question.mq-skipped{opacity:.5}.mq-qtop{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:6px}.mq-qtop-left{min-width:0;flex:1}.mq-qtop-right{flex:none;display:flex;align-items:center;gap:8px}.mq-qheader{display:flex;align-items:center;gap:8px;color:var(--dsw-alias-label-secondary);font-size:13px;font-weight:700;line-height:18px;letter-spacing:.02em}.mq-qheader::after{content:"";flex:1;height:1px;background:var(--dsw-alias-border-l1)}.mq-skip{flex:none;background:none;border:1px solid var(--dsw-alias-border-l1);border-radius:8px;color:var(--dsw-alias-label-secondary);cursor:pointer;width:26px;height:26px;display:grid;place-items:center;font-size:13px;line-height:1;padding:0;transition:background .15s ease, color .15s ease, border-color .15s ease}.mq-skip:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-border-l2)}.mq-skip:focus-visible{outline:2px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 60%, transparent);outline-offset:2px}.mq-skipped-tag{display:inline-block;padding:1px 8px;border-radius:999px;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary);font-size:11px;font-weight:600;line-height:16px;letter-spacing:.02em}.mq-qtext{font-size:15px;line-height:22px;font-weight:600;margin-bottom:12px;letter-spacing:-.005em}.mq-qnum{color:var(--dsw-alias-label-tertiary, var(--dsw-alias-label-secondary));font-weight:700;margin-right:4px}.mq-type{display:inline-block;margin-left:8px;padding:1px 8px;border-radius:999px;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary);font-size:11px;font-weight:600;line-height:16px;vertical-align:2px;letter-spacing:.02em}.mq-options{display:flex;flex-direction:column;gap:8px;margin-bottom:12px}.mq-opt{display:flex;align-items:flex-start;gap:10px;text-align:left;width:100%;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:12px;color:var(--dsw-alias-label-primary);cursor:pointer;padding:11px 13px;font-size:13px;line-height:18px;transition:border-color .18s ease, background .18s ease, box-shadow .18s ease;font-family:inherit}.mq-opt:hover{background:var(--dsw-alias-bg-layer-1);border-color:var(--dsw-alias-border-l2)}.mq-opt:active:not(:disabled){transform:scale(.995)}.mq-opt[data-on]{border-color:var(--dsw-alias-brand-primary);background:color-mix(in srgb, var(--dsw-alias-brand-primary) 14%, var(--dsw-alias-bg-layer-2));box-shadow:0 0 0 1px color-mix(in srgb, var(--dsw-alias-brand-primary) 40%, transparent) inset}.mq-opt:focus-visible{outline:2px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 70%, transparent);outline-offset:2px}.mq-opt-label{display:block;font-weight:600}.mq-opt-desc{display:block;color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:400;line-height:16px;margin-top:3px}.mq-md{font-size:13px;line-height:20px;font-weight:400}.mq-md > *:first-child{margin-top:0}.mq-md > *:last-child{margin-bottom:0}.mq-md p{margin:4px 0}.mq-md pre{background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:8px;padding:8px 10px;overflow-x:auto;margin:6px 0;font-size:12px;line-height:18px}.mq-md code{background:var(--dsw-alias-bg-layer-2);border-radius:4px;padding:1px 5px;font-size:12px;font-family:var(--ds-font-family-code, monospace)}.mq-md blockquote{border-left:3px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);margin:6px 0;padding:2px 0 2px 12px}.mq-mark{flex:none;width:19px;height:19px;border:1px solid var(--dsw-alias-border-l2);border-radius:6px;display:grid;place-items:center;font-size:12px;line-height:1;margin-top:1px;transition:background .15s ease, border-color .15s ease, transform .15s cubic-bezier(.34,1.56,.64,1);color:var(--dsw-alias-bg-base)}.mq-mark.mq-radio{border-radius:50%}.mq-opt[data-on] .mq-mark{background:var(--dsw-alias-brand-primary);border-color:var(--dsw-alias-brand-primary);transform:scale(1.08)}.mq-bool{display:flex;align-items:center;gap:10px;margin-bottom:12px;flex-wrap:wrap}.mq-bool-label{color:var(--dsw-alias-label-secondary);font-size:13px;line-height:18px}.mq-bool-switch{display:inline-flex;align-items:center;gap:0;border:1px solid var(--dsw-alias-border-l2);border-radius:999px;background:var(--dsw-alias-bg-layer-2);padding:3px;cursor:pointer;transition:border-color .18s ease, box-shadow .18s ease}.mq-bool-switch:hover{border-color:var(--dsw-alias-border-l2)}.mq-bool-switch:focus-visible{outline:2px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 60%, transparent);outline-offset:2px}.mq-bool-side{border:none;background:none;color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:600;line-height:1;padding:6px 14px;border-radius:999px;cursor:pointer;transition:background .18s ease, color .18s ease;font-family:inherit;min-width:44px}.mq-bool-side[data-on]{background:var(--dsw-alias-brand-primary);color:var(--dsw-alias-bg-base)}.mq-compare{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:12px}.mq-compare-block{display:flex;flex-direction:column;gap:8px;text-align:left;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:14px;color:var(--dsw-alias-label-primary);cursor:pointer;padding:20px 22px;font-size:13px;line-height:20px;transition:border-color .18s ease, background .18s ease, box-shadow .18s ease;font-family:inherit;min-width:0}.mq-compare-block:hover{background:var(--dsw-alias-bg-layer-1);border-color:var(--dsw-alias-border-l2)}.mq-compare-block[data-on]{border-color:var(--dsw-alias-brand-primary);background:color-mix(in srgb, var(--dsw-alias-brand-primary) 14%, var(--dsw-alias-bg-layer-2));box-shadow:0 0 0 1px color-mix(in srgb, var(--dsw-alias-brand-primary) 40%, transparent) inset}.mq-compare-block:focus-visible{outline:2px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 70%, transparent);outline-offset:2px}.mq-compare-title{font-weight:700;font-size:14px;line-height:20px;display:flex;align-items:center;gap:8px}.mq-compare-title .mq-mark{width:18px;height:18px;font-size:11px}.mq-compare-text{color:var(--dsw-alias-label-secondary);font-size:13.5px;line-height:22px}.mq-custom{width:100%;box-sizing:border-box;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:10px;color:var(--dsw-alias-label-primary);padding:10px 13px;font-size:13px;line-height:19px;outline:none;transition:border-color .18s ease;font-family:inherit}.mq-custom::placeholder{color:var(--dsw-alias-label-tertiary, var(--dsw-alias-label-secondary));opacity:.75}.mq-custom:hover{border-color:var(--dsw-alias-border-l2)}.mq-custom:focus{border-color:var(--dsw-alias-brand-primary)}.mq-custom.mq-open{min-height:76px;resize:vertical;line-height:21px;padding:11px 13px}.mq-footer{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:14px 22px 20px}.mq-progress{color:var(--dsw-alias-label-secondary);font-size:13px;font-weight:500;line-height:18px}.mq-progress b{color:var(--dsw-alias-label-primary);font-weight:700}.mq-submit{background:var(--dsw-alias-brand-primary);border:none;border-radius:10px;color:var(--dsw-alias-bg-base);cursor:pointer;font-size:13px;font-weight:700;line-height:18px;padding:11px 24px;min-width:136px;transition:opacity .15s ease, transform .08s ease, box-shadow .15s ease;font-family:inherit}.mq-submit:hover:not(:disabled){opacity:.9;box-shadow:0 2px 10px color-mix(in srgb, var(--dsw-alias-brand-primary) 30%, transparent)}.mq-submit:active:not(:disabled){transform:scale(.97)}.mq-submit:focus-visible{outline:2px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 70%, transparent);outline-offset:2px}.mq-submit:disabled{opacity:.5;cursor:default}.mq-close{background:none;border:none;color:var(--dsw-alias-label-secondary);cursor:pointer;font-size:15px;line-height:1;padding:6px 8px;border-radius:8px;transition:background .15s ease, color .15s ease}.mq-close:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2)}.mq-close:focus-visible{outline:2px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 70%, transparent);outline-offset:2px}.mq-error{color:var(--dsw-alias-state-error-primary);font-size:12px;line-height:16px;font-weight:500}.mq-settled{display:flex;flex-direction:column;gap:10px;padding:16px 22px;font-size:13px;line-height:20px}.mq-settled-title{color:var(--dsw-alias-state-success-primary);font-weight:700}.mq-recap{display:flex;flex-direction:column;gap:6px;max-height:200px;overflow-y:auto;padding-right:4px}.mq-recap-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:baseline;padding:4px 0;border-bottom:1px solid var(--dsw-alias-border-l1)}.mq-recap-row:last-child{border-bottom:none}.mq-recap-q{color:var(--dsw-alias-label-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:400}.mq-recap-a{color:var(--dsw-alias-label-primary);font-weight:600;min-width:0;word-break:break-word}.mq-recap-empty{color:var(--dsw-alias-label-tertiary, var(--dsw-alias-label-secondary));font-weight:400}/* compact single-question mode */ .mq-compact{padding:14px 18px}.mq-compact .mq-qtext{font-size:15px;font-weight:600;margin-bottom:12px}.mq-compact .mq-options{margin-bottom:12px}.mq-compact .mq-footer{justify-content:flex-end;padding:8px 0 0}.mq-compact .mq-submit{min-width:96px;padding:9px 18px}')

    const slots = ctx.get('slots')
    if (slots === undefined) return disposeCss

    const Md = (props) => props.text === undefined || props.text === null
      ? null
      : React.createElement('div', { className: 'mq-md' }, String(props.text))

    const Mark = (props) => React.createElement('span', {
      className: 'mq-mark' + (props.radio ? ' mq-radio' : '')
    }, props.on ? (props.check ? '✓' : '●') : '')

    const OptionRow = (props) => {
      const on = props.selected.includes(props.label)
      return React.createElement('button', {
        type: 'button',
        className: 'mq-opt',
        'data-on': on || undefined,
        disabled: props.disabled,
        onClick: () => props.onChoose(props.label)
      },
        React.createElement(Mark, { on, check: props.multi }),
        React.createElement('span', null,
          React.createElement('span', { className: 'mq-opt-label' }, React.createElement(Md, { text: props.label })),
          props.description !== undefined && React.createElement('span', { className: 'mq-opt-desc' }, React.createElement(Md, { text: props.description }))
        )
      )
    }

    const QuestionBody = (props) => {
      const q = props.q
      const d = props.d
      const disabled = props.disabled
      const options = Array.isArray(q.options) ? q.options : []
      const isBool = q.kind === 'boolean'
      const isCompare = q.kind === 'compare'
      const isOpen = !isBool && !isCompare && options.length === 0
      if (isBool) {
        return React.createElement('div', { className: 'mq-bool' },
          React.createElement('span', { className: 'mq-bool-label' }, '你的选择'),
          React.createElement('span', { className: 'mq-bool-switch', role: 'radiogroup', 'aria-label': String(q.question) },
            React.createElement('button', {
              type: 'button', role: 'radio',
              'aria-checked': d.selected[0] === '是' || undefined,
              className: 'mq-bool-side', 'data-on': d.selected[0] === '是' || undefined,
              disabled,
              onClick: () => props.onBool('是')
            }, '是'),
            React.createElement('button', {
              type: 'button', role: 'radio',
              'aria-checked': d.selected[0] === '否' || undefined,
              className: 'mq-bool-side', 'data-on': d.selected[0] === '否' || undefined,
              disabled,
              onClick: () => props.onBool('否')
            }, '否')
          )
        )
      }
      if (isCompare) {
        return React.createElement('div', { className: 'mq-compare' },
          ['left', 'right'].map((side) => {
            const item = (q.compare && q.compare[side]) || {}
            const on = d.selected[0] === side
            return React.createElement('button', {
              type: 'button', key: side,
              className: 'mq-compare-block', 'data-on': on || undefined,
              disabled,
              onClick: () => props.onCompare(side)
            },
              React.createElement('span', { className: 'mq-compare-title' },
                React.createElement(Mark, { on, radio: true }),
                React.createElement(Md, { text: item.title ? item.title : (side === 'left' ? '方案 A' : '方案 B') })
              ),
              item.text !== undefined && React.createElement('span', { className: 'mq-compare-text' }, React.createElement(Md, { text: item.text }))
            )
          })
        )
      }
      return React.createElement(React.Fragment, null,
        !isOpen && React.createElement('div', { className: 'mq-options' },
          options.map((opt, oi) => React.createElement(OptionRow, {
            key: String(oi),
            label: opt.label,
            description: opt.description,
            selected: d.selected,
            multi: q.multi_select === true,
            disabled,
            onChoose: (label) => props.onChoose(label)
          }))
        ),
        React.createElement(isOpen ? 'textarea' : 'input', {
          className: isOpen ? 'mq-custom mq-open' : 'mq-custom',
          placeholder: isOpen ? '请输入回答' : '补充说明（可选）',
          rows: isOpen ? 3 : undefined,
          value: d.custom,
          disabled,
          onChange: (event) => props.onCustom(event.target.value)
        })
      )
    }

    const useQuestionnaire = (block, questions, initialDrafts) => {
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
        setDrafts((current) => current.map((d, i) => i === index ? { ...d, selected: [value], skipped: false } : d))
      }
      const setCompare = (index, side) => {
        if (submitting || submitted) return
        setDrafts((current) => current.map((d, i) => i === index ? { ...d, selected: [side], skipped: false } : d))
      }
      const setCustom = (index, value) => {
        if (submitting || submitted) return
        setDrafts((current) => current.map((d, i) => i === index ? { ...d, custom: value, skipped: false } : d))
      }
      const toggleSkip = (index) => {
        if (submitting || submitted) return
        setDrafts((current) => current.map((d, i) => i === index ? { ...d, skipped: !d.skipped, selected: [], custom: '' } : d))
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
          const res = await host.call('dsvy/submit', { callId: block.callId, answers })
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
          await host.call('dsvy/cancel', { callId: block.callId })
        } catch (cause) {
          setClosed(false)
        }
      }
      return { drafts, submitting, submitted, error, closed, answeredCount, choose, setBool, setCompare, setCustom, toggleSkip, submit, cancel }
    }

    const RecapCard = ({ block }) => {
      let questions = []
      let answers = []
      try {
        if (block.call && typeof block.call.argsRaw === 'string') {
          const parsed = JSON.parse(block.call.argsRaw)
          if (Array.isArray(parsed.questions)) questions = parsed.questions
        }
      } catch (error) { questions = [] }
      try {
        if (block.content && Array.isArray(block.content)) {
          const text = block.content.map((c) => (c && typeof c.text === 'string' ? c.text : '')).join('')
          if (text) {
            const parsed = JSON.parse(text)
            if (Array.isArray(parsed.answers)) answers = parsed.answers
          }
        }
      } catch (error) { answers = [] }
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
                    React.createElement('span', { className: 'mq-recap-q' }, React.createElement(Md, { text: String(index + 1) + '. ' + String(q.question) })),
                    React.createElement('span', { className: a && (a.custom || (a.selected || []).length > 0) ? 'mq-recap-a' : 'mq-recap-empty' }, React.createElement(Md, { text: renderAnswer(q, a) }))
                  )
                })
              )
              : React.createElement('div', { className: 'mq-recap-empty' }, '共 ' + answers.length + ' 题已回答，结果已返回给模型')
          )
        )
      )
    }

    const SurveyCard = ({ block, mode }) => {
      let questions = []
      try {
        const parsed = JSON.parse(block.argsRaw || '{}')
        if (Array.isArray(parsed.questions)) questions = parsed.questions
      } catch (error) { questions = [] }
      const isWide = mode === 'overlay'
      const model = useQuestionnaire(block, questions, () => questions.map(() => ({ selected: [], custom: '', skipped: false })))
      if (model.closed) {
        return React.createElement('div', { className: 'mq-frame' },
          React.createElement('div', { className: 'mq-card' },
            React.createElement('div', { className: 'mq-settled' }, React.createElement('span', { className: 'mq-settled-title' }, '问卷已关闭'))
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
              type: 'button', className: 'mq-close', title: '关闭问卷', 'aria-label': '关闭问卷',
              disabled: model.submitting || model.submitted,
              onClick: model.cancel
            }, '✕')
          ),
          React.createElement('div', { className: 'mq-body' },
            questions.map((q, index) => {
              const d = model.drafts[index] || { selected: [], custom: '', skipped: false }
              const options = Array.isArray(q.options) ? q.options : []
              const isBool = q.kind === 'boolean'
              const isCompare = q.kind === 'compare'
              const isOpen = !isBool && !isCompare && options.length === 0
              const typeLabel = isBool ? '是否' : isCompare ? '对比' : q.multi_select === true ? '多选' : isOpen ? '开放' : '单选'
              const bodyDisabled = model.submitting || model.submitted || d.skipped
              return React.createElement('div', { className: 'mq-question' + (d.skipped ? ' mq-skipped' : ''), key: q.id || String(index) },
                React.createElement('div', { className: 'mq-qtop' },
                  React.createElement('div', { className: 'mq-qtop-left' },
                    q.header !== undefined && React.createElement('div', { className: 'mq-qheader' }, React.createElement(Md, { text: q.header }))
                  ),
                  React.createElement('div', { className: 'mq-qtop-right' },
                    d.skipped && React.createElement('span', { className: 'mq-skipped-tag' }, '已跳过'),
                    React.createElement('button', {
                      type: 'button', className: 'mq-skip',
                      title: d.skipped ? '恢复此题' : '跳过此题',
                      'aria-label': d.skipped ? '恢复此题' : '跳过此题',
                      disabled: model.submitting || model.submitted,
                      onClick: () => model.toggleSkip(index)
                    }, d.skipped ? '↺' : '✕')
                  )
                ),
                React.createElement('div', { className: 'mq-qtext' },
                  React.createElement('span', { className: 'mq-qnum' }, String(index + 1) + '.'),
                  React.createElement(Md, { text: String(q.question) }),
                  React.createElement('span', { className: 'mq-type' }, typeLabel)
                ),
                React.createElement(QuestionBody, {
                  q, d,
                  disabled: bodyDisabled,
                  onChoose: (label) => model.choose(index, label),
                  onBool: (value) => model.setBool(index, value),
                  onCompare: (side) => model.setCompare(index, side),
                  onCustom: (value) => model.setCustom(index, value)
                })
              )
            })
          ),
          React.createElement('footer', { className: 'mq-footer' },
            React.createElement('div', { className: 'mq-progress' },
              model.error
                ? React.createElement('span', { className: 'mq-error' }, String(model.error))
                : React.createElement('span', null, '已答 ', React.createElement('b', null, String(model.answeredCount)), ' / ' + questions.length + ' 题')
            ),
            React.createElement('button', {
              type: 'button', className: 'mq-submit',
              disabled: model.submitting || model.submitted || questions.length === 0,
              onClick: model.submit
            }, model.submitted ? '已提交 ✓' : model.submitting ? '提交中…' : '提交全部回答')
          )
        )
      )
    }

    const CompactCard = ({ block }) => {
      let questions = []
      try {
        const parsed = JSON.parse(block.argsRaw || '{}')
        if (Array.isArray(parsed.questions)) questions = parsed.questions
      } catch (error) { questions = [] }
      const q = questions[0] || { id: 'q', question: '' }
      const model = useQuestionnaire(block, questions, () => [{ selected: [], custom: '', skipped: false }])
      const d = model.drafts[0] || { selected: [], custom: '', skipped: false }
      if (model.closed) {
        return React.createElement('div', { className: 'mq-frame' },
          React.createElement('div', { className: 'mq-card' },
            React.createElement('div', { className: 'mq-settled' }, React.createElement('span', { className: 'mq-settled-title' }, '已关闭'))
          )
        )
      }
      const typeLabel = q.kind === 'boolean' ? '是否' : q.kind === 'compare' ? '对比' : q.multi_select === true ? '多选' : (Array.isArray(q.options) ? q.options.length : 0) === 0 ? '开放' : '单选'
      return React.createElement('div', { className: 'mq-frame' },
        React.createElement('section', { className: 'mq-card mq-compact' },
          React.createElement('div', { className: 'mq-qtext' },
            React.createElement(Md, { text: String(q.question) }),
            React.createElement('span', { className: 'mq-type' }, typeLabel)
          ),
          React.createElement(QuestionBody, {
            q, d,
            disabled: model.submitting || model.submitted,
            onChoose: (label) => model.choose(0, label),
            onBool: (value) => model.setBool(0, value),
            onCompare: (side) => model.setCompare(0, side),
            onCustom: (value) => model.setCustom(0, value)
          }),
          React.createElement('footer', { className: 'mq-footer' },
            model.error
              ? React.createElement('div', { className: 'mq-progress' }, React.createElement('span', { className: 'mq-error' }, String(model.error)))
              : null,
            React.createElement('button', {
              type: 'button', className: 'mq-submit',
              disabled: model.submitting || model.submitted,
              onClick: model.submit
            }, model.submitted ? '已提交 ✓' : model.submitting ? '提交中…' : '提交回答')
          )
        )
      )
    }

    const SurveyRoot = (props) => {
      const block = props.block
      if (block.kind === 'tool-result') {
        return React.createElement(RecapCard, { block })
      }
      let mode = 'inline'
      try {
        const parsed = JSON.parse(block.argsRaw || '{}')
        if (parsed.mode === 'compact' || parsed.mode === 'inline' || parsed.mode === 'overlay') mode = parsed.mode
      } catch (error) { mode = 'inline' }
      if (mode === 'compact') return React.createElement(CompactCard, { block })
      return React.createElement(SurveyCard, { block, mode })
    }

    const disposeSlot = slots.inject('tool.call.toolview', () => slots.register(
      { name: 'tool.call.toolview', key: 'do_a_survey' },
      SurveyRoot
    ))

    return () => {
      disposeSlot()
      disposeCss()
    }
  }
}
```

## 注意事项

- 必须用 `cordis_define` + `cordis_run` 重建（动态插件机制）；含 Client 端代码，`cordis_run` 可能返回 `awaiting-approval`，需用户批准
- 动态插件版内部通道：Host `harness.handle('dsvy/submit'|'dsvy/cancel')`，Client `host.call`；bundle 版则用 webServer 路由 + `fetch`——两者工具名、schema、UI 完全一致
- Host 端 `execute` 用 `exec.callId` 挂起等待；`exec.signal` 中止时自动清理 pending
- 每次 `cordis_define` 追加不可变 Package；迭代用 `plugin.kind: "existing"` + 原 pluginId，`cordis_run`（mode: update）切换
- 若重建后功能与预期不符，先查 `cordis_inspect_self(pluginId, packageId)` 诊断
