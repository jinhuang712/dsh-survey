import { defineTool } from "@deepseek-ai/dsh-tools";

export const name = "dsh-survey";
export const inject = ["tools", "webServer"];

/** A survey waits on a human, so the budget is generous — but it is a budget:
 *  a closed tab or an ignored card must not pin the agent loop forever. The
 *  harness enforces this through `timeoutMs`; the in-process timer below covers
 *  compositions that do not load the timeout policy. */
const SURVEY_TIMEOUT_MS = 30 * 60 * 1000;

function readJsonBody(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      if (chunks.length === 0) return resolve({});
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch (error) {
        resolve({});
      }
    });
    req.on("error", () => resolve({}));
  });
}

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify(body));
}

/** Reject a survey the UI cannot present or the model cannot read back: answers
 *  are keyed by question id, so a missing or repeated id silently collapses
 *  two questions into one. Returns the reason, or null when the survey is sound. */
function describeInvalidSurvey(args) {
  const questions = args === null || args === undefined ? undefined : args.questions;
  if (!Array.isArray(questions) || questions.length === 0) {
    return "do_a_survey needs a non-empty questions array";
  }
  const seen = new Set();
  for (const question of questions) {
    const id = question === null || question === undefined ? undefined : question.id;
    if (typeof id !== "string" || id === "") {
      return "every question needs a non-empty string id";
    }
    if (seen.has(id)) {
      return `duplicate question id ${JSON.stringify(id)} — ids must be unique within one survey`;
    }
    seen.add(id);
  }
  return null;
}

/** The bundled client is the only expected writer, but whatever this returns
 *  lands verbatim in the model's context, so the shape is enforced here rather
 *  than trusted. Returns null when the payload cannot be trusted. */
function normalizeAnswers(input, ids) {
  if (!Array.isArray(input)) return null;
  const answers = [];
  for (const item of input) {
    if (item === null || typeof item !== "object" || Array.isArray(item)) return null;
    if (typeof item.id !== "string" || !ids.has(item.id)) return null;
    if (!Array.isArray(item.selected)) return null;
    if (item.selected.some((choice) => typeof choice !== "string")) return null;
    const answer = { id: item.id, selected: item.selected };
    if (typeof item.custom === "string" && item.custom !== "") answer.custom = item.custom;
    if (item.skipped === true) answer.skipped = true;
    answers.push(answer);
  }
  return answers;
}

export function apply(ctx) {
  // pending calls: callId -> { resolve, reject, ids }
  const pending = new Map();

  const webServer = ctx.get("webServer");
  if (webServer === undefined || typeof webServer.register !== "function") {
    // Registering the tool without its submit route would hand the model a
    // question it can never receive an answer to.
    const logger = ctx.logger;
    if (logger !== undefined && typeof logger.warn === "function") {
      logger.warn(
        "dsh-survey: webServer unavailable — do_a_survey stays unregistered because no route could carry the answers back"
      );
    }
    return () => {};
  }

  const tool = defineTool({
    name: "do_a_survey",
    timeoutMs: SURVEY_TIMEOUT_MS,
    description:
      '向用户发起问卷式提问（1 到任意数量问题，支持 10 个以上），收集确认、选择、偏好或意见。这是向用户提问的默认通道：任何需要提问、确认、收集选择或意见的场景（哪怕只有 1 个问题、哪怕是/否确认）都优先使用本工具，而不是正文提问或 ask_user_question——单题用 mode "compact"，多选/对比等复杂题型同屏一次问完。支持 Markdown 渲染：题目文本、选项 label/description、对比块正文都可以包含 markdown（**加粗**、`行内代码`、```代码块```、> 引用等）。每个问题需带稳定 id，id 会原样回显在答案中，同一份问卷内 id 必须唯一。题型：kind 为 "boolean" 时是紧凑的是/否 toggle（不要传 options）；kind 为 "compare" 时是左右并排对比题（传 compare: { left: {title, text}, right: {title, text} }）；有 options 时 multi_select 为 true 是多选、否则单选；无 options 且非 boolean/compare 时是开放填空。呈现模式由 mode 显式指定：单题用 "compact"（紧凑卡片）；多题无对比用 "inline"（内嵌对话流）；含对比题或需要更宽画布用 "overlay"（全屏浮层）；大量简单问题用 "grid"（全屏网格矩阵，一个问题一张卡片）。答案回传约定：选项题的 selected 是被选中选项的 label 原文；boolean 题回传 "yes" 或 "no"；compare 题回传 "left" 或 "right"；开放题答案在 custom；跳过的题为 skipped: true。用户没有作答就超时的调用会失败，30 分钟为上限。',
    // 隐式开放参数对象：顶层直接是属性表，必填项在属性上写 required: true
    parameters: {
      mode: {
        type: "string",
        required: true,
        description:
          '呈现模式（必选）："compact" = 单题紧凑卡片（只放得下 1 题，传多题会自动按 inline 呈现）；"inline" = 多题内嵌在对话流固定画幅；"overlay" = 全屏浮层加宽（适合含对比题或需要更宽展示）；"grid" = 全屏网格矩阵（适合大量简单问题，一个问题一张卡片）。'
      },
      questions: {
        type: "array",
        required: true,
        description:
          "要提问的问题列表，可包含任意数量（支持 10 个以上）。所有文本支持 Markdown。",
        items: {
          type: "object",
          additionalProperties: true,
          properties: {
            id: {
              type: "string",
              required: true,
              description:
                "Stable id for this question; echoed in the answer. Must be unique within one survey."
            },
            question: {
              type: "string",
              required: true,
              description:
                "The specific question to ask the user. Supports Markdown (bold, inline code, code blocks, blockquotes)."
            },
            header: {
              type: "string",
              description:
                'Optional short heading for the question, such as "Confirm" or "Choose Mode".'
            },
            kind: {
              type: "string",
              description:
                'Optional question kind: "boolean" (compact yes/no toggle, answered as "yes"/"no"), "compare" (side-by-side block comparison, answered as "left"/"right"), or omit for option-based or open questions.'
            },
            compare: {
              type: "object",
              additionalProperties: true,
              description:
                'Required when kind is "compare": two blocks to compare. Both title and text support Markdown.',
              properties: {
                left: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    title: {
                      type: "string",
                      description:
                        "Short heading for the left block. Supports Markdown."
                    },
                    text: {
                      type: "string",
                      description:
                        "Body content of the left block. Supports Markdown."
                    }
                  }
                },
                right: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    title: {
                      type: "string",
                      description:
                        "Short heading for the right block. Supports Markdown."
                    },
                    text: {
                      type: "string",
                      description:
                        "Body content of the right block. Supports Markdown."
                    }
                  }
                }
              }
            },
            options: {
              type: "array",
              description:
                "Optional choices to show the user. Labels and descriptions support Markdown.",
              items: {
                type: "object",
                additionalProperties: true,
                properties: {
                  label: {
                    type: "string",
                    required: true,
                    description:
                      "Short user-facing option label. Supports Markdown. Echoed verbatim in the answer, so keep labels distinct within one question."
                  },
                  description: {
                    type: "string",
                    description:
                      "One sentence explaining the tradeoff or impact. Supports Markdown."
                  }
                }
              }
            },
            multi_select: {
              type: "boolean",
              description:
                "Whether the user may select more than one option. Defaults to false."
            }
          }
        }
      }
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          answers: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                id: { type: "string", required: true },
                selected: {
                  type: "array",
                  required: true,
                  description:
                    'Option labels for option questions, "yes"/"no" for boolean questions, "left"/"right" for compare questions, and empty for open or skipped questions.',
                  items: { type: "string" }
                },
                custom: {
                  type: "string",
                  description:
                    "Free-text answer: the body of an open question, or the user's own wording alongside the options."
                },
                skipped: {
                  type: "boolean",
                  description: "True when the user explicitly skipped this question."
                }
              }
            }
          }
        }
      },
      render: (_args, value) => [{ type: "text", text: JSON.stringify(value) }]
    },
    async execute(args, exec) {
      const invalid = describeInvalidSurvey(args);
      if (invalid !== null) throw new Error(invalid);

      const callId = exec.callId;
      const signal = exec.signal;
      const ids = new Set(args.questions.map((question) => question.id));

      return new Promise((resolve, reject) => {
        const entry = { resolve: null, reject: null, ids, timer: undefined };
        let settled = false;

        // Every exit runs through here: the timer, the abort listener and the
        // pending seat are released exactly once, whichever side finishes first.
        const finish = (settleFn, value) => {
          if (settled) return;
          settled = true;
          if (entry.timer !== undefined) clearTimeout(entry.timer);
          if (signal !== undefined && signal !== null && typeof signal.removeEventListener === "function") {
            signal.removeEventListener("abort", onAbort);
          }
          if (pending.get(callId) === entry) pending.delete(callId);
          settleFn(value);
        };

        function onAbort() {
          finish(reject, new Error("do_a_survey aborted before the user answered"));
        }

        entry.resolve = (value) => finish(resolve, value);
        entry.reject = (error) => finish(reject, error);

        if (signal !== undefined && signal !== null && typeof signal.addEventListener === "function") {
          if (signal.aborted) {
            onAbort();
            return;
          }
          signal.addEventListener("abort", onAbort);
        }

        entry.timer = setTimeout(() => {
          entry.reject(
            new Error(`do_a_survey timed out after ${SURVEY_TIMEOUT_MS}ms without an answer`)
          );
        }, SURVEY_TIMEOUT_MS);
        if (typeof entry.timer.unref === "function") entry.timer.unref();

        pending.set(callId, entry);
      });
    }
  });

  const disposers = [];

  disposers.push(
    webServer.register({
      kind: "prefix",
      path: "/api/dsh-survey",
      handler: async (req, res) => {
        const url = (req && req.url) || "/";
        const method = (req && req.method) || "GET";
        const path = url.split("?")[0] || "/";
        try {
          if (method === "POST" && path === "/api/dsh-survey/submit") {
            const payload = await readJsonBody(req);
            if (typeof payload.callId !== "string") {
              sendJson(res, 400, { ok: false, error: "bad payload" });
              return;
            }
            const entry = pending.get(payload.callId);
            if (!entry) {
              sendJson(res, 404, { ok: false, error: "no pending call" });
              return;
            }
            const answers = normalizeAnswers(payload.answers, entry.ids);
            if (answers === null) {
              sendJson(res, 400, { ok: false, error: "bad answers payload" });
              return;
            }
            entry.resolve({ answers });
            sendJson(res, 200, { ok: true });
            return;
          }
          if (method === "POST" && path === "/api/dsh-survey/cancel") {
            const payload = await readJsonBody(req);
            if (typeof payload.callId !== "string") {
              sendJson(res, 400, { ok: false, error: "bad payload" });
              return;
            }
            const entry = pending.get(payload.callId);
            if (!entry) {
              sendJson(res, 404, { ok: false, error: "no pending call" });
              return;
            }
            entry.reject(new Error("questionnaire cancelled by the user"));
            sendJson(res, 200, { ok: true });
            return;
          }
          sendJson(res, 404, { ok: false, error: "not found" });
        } catch (error) {
          sendJson(res, 500, {
            ok: false,
            error: error instanceof Error ? error.message : String(error)
          });
        }
      }
    })
  );

  if (ctx.tools && typeof ctx.tools.register === "function") {
    disposers.push(ctx.tools.register(tool));
  }

  return () => {
    for (const dispose of disposers) dispose();
    // Surveys still on screen lose their carrier the moment the routes go, so
    // fail them here rather than leaving the callers hanging on a dead plugin.
    for (const entry of [...pending.values()]) {
      entry.reject(new Error("dsh-survey unloaded before the user answered"));
    }
  };
}
