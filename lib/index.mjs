import { defineTool } from "@deepseek-ai/dsh-tools";

export const name = "dsh-survey";
export const inject = ["tools", "webServer"];

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

export function apply(ctx) {
  // pending calls: callId -> { resolve, reject }
  const pending = new Map();

  const tool = defineTool({
    name: "do_a_survey",
    description:
      '向用户发起问卷式提问（1 到任意数量问题，支持 10 个以上），收集确认、选择、偏好或意见。这是向用户提问的默认通道：任何需要提问、确认、收集选择或意见的场景（哪怕只有 1 个问题、哪怕是/否确认）都优先使用本工具，而不是正文提问或 ask_user_question——单题用 mode "compact"，多选/对比等复杂题型同屏一次问完。支持 Markdown 渲染：题目文本、选项 label/description、对比块正文都可以包含 markdown（**加粗**、`行内代码`、```代码块```、> 引用等）。每个问题需带稳定 id，id 会原样回显在答案中。题型：kind 为 "boolean" 时是紧凑的是/否 toggle（不要传 options）；kind 为 "compare" 时是左右并排对比题（传 compare: { left: {title, text}, right: {title, text} }）；有 options 时 multi_select 为 true 是多选、否则单选；无 options 且非 boolean/compare 时是开放填空。呈现模式由 mode 显式指定：单题用 "compact"（紧凑卡片）；多题无对比用 "inline"（内嵌对话流）；含对比题或需要更宽画布用 "overlay"（全屏浮层）；大量简单问题用 "grid"（全屏网格矩阵，一个问题一张卡片）。',
    // 隐式开放参数对象：顶层直接是属性表，必填项在属性上写 required: true
    parameters: {
      mode: {
        type: "string",
        required: true,
        description:
          '呈现模式（必选）："compact" = 单题紧凑卡片；"inline" = 多题内嵌在对话流固定画幅；"overlay" = 全屏浮层加宽（适合含对比题或需要更宽展示）；"grid" = 全屏网格矩阵（适合大量简单问题，一个问题一张卡片）。'
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
              description: "Stable id for this question; echoed in the answer."
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
                'Optional question kind: "boolean" (compact yes/no toggle), "compare" (side-by-side block comparison), or omit for option-based or open questions.'
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
                      "Short user-facing option label. Supports Markdown."
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
                  items: { type: "string" }
                },
                custom: { type: "string" },
                skipped: { type: "boolean" }
              }
            }
          }
        }
      },
      render: (_args, value) => [{ type: "text", text: JSON.stringify(value) }]
    },
    async execute(args, exec) {
      const callId = exec.callId;
      return new Promise((resolve, reject) => {
        const entry = { resolve, reject };
        pending.set(callId, entry);
        const onAbort = () => {
          if (pending.get(callId) === entry) pending.delete(callId);
          reject(new Error("do_a_survey aborted before the user answered"));
        };
        if (exec.signal && typeof exec.signal.addEventListener === "function") {
          if (exec.signal.aborted) {
            onAbort();
            return;
          }
          exec.signal.addEventListener("abort", onAbort);
        }
      });
    }
  });

  const disposers = [];
  if (ctx.tools && typeof ctx.tools.register === "function") {
    disposers.push(ctx.tools.register(tool));
  }

  const webServer = ctx.get("webServer");
  if (webServer !== undefined && typeof webServer.register === "function") {
    const disposeRoutes = webServer.register({
      kind: "prefix",
      path: "/api/dsh-survey",
      handler: async (req, res) => {
        const url = (req && req.url) || "/";
        const method = (req && req.method) || "GET";
        const path = url.split("?")[0] || "/";
        try {
          if (method === "POST" && path === "/api/dsh-survey/submit") {
            const payload = await readJsonBody(req);
            if (
              typeof payload.callId !== "string" ||
              !Array.isArray(payload.answers)
            ) {
              sendJson(res, 400, { ok: false, error: "bad payload" });
              return;
            }
            const entry = pending.get(payload.callId);
            if (!entry) {
              sendJson(res, 404, { ok: false, error: "no pending call" });
              return;
            }
            pending.delete(payload.callId);
            entry.resolve({ answers: payload.answers });
            sendJson(res, 200, { ok: true });
            return;
          }
          if (method === "POST" && path === "/api/dsh-survey/cancel") {
            const payload = await readJsonBody(req);
            if (typeof payload.callId !== "string") {
              sendJson(res, 400, { ok: false });
              return;
            }
            const entry = pending.get(payload.callId);
            if (!entry) {
              sendJson(res, 404, { ok: false });
              return;
            }
            pending.delete(payload.callId);
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
    });
    disposers.push(disposeRoutes);
  }

  return () => {
    for (const dispose of disposers) dispose();
  };
}
