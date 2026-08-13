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
    name: "ask_many_questions",
    description:
      '批量向用户提问：一次可发送任意数量的问题（支持 10 个以上），以问卷形式一次性展示全部问题，用户填完统一提交。适用于需要一次性收集多项信息、多个确认或多项选择时。每个问题需带稳定 id，id 会原样回显在答案中。题型：kind 为 "boolean" 时是紧凑的是/否 toggle（不要传 options）；kind 为 "compare" 时是左右并排对比题（传 compare: { left: {title, text}, right: {title, text} }，让用户选更符合的那一个，问卷会自动加宽为全屏浮层）；有 options 时 multi_select 为 true 是多选、否则单选；无 options 且非 boolean/compare 时是开放填空。顶层 fullscreen: true 可强制问卷以全屏浮层显示（即使没有对比题）。',
    parameters: {
      type: "object",
      properties: {
        questions: {
          type: "array",
          description: "要提问的问题列表，可包含任意数量（支持 10 个以上）。",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "Stable id for this question; echoed in the answer."
              },
              question: {
                type: "string",
                description: "The specific question to ask the user."
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
                description:
                  'Required when kind is "compare": two blocks to compare.',
                properties: {
                  left: {
                    type: "object",
                    additionalProperties: true,
                    properties: {
                      title: {
                        type: "string",
                        description: "Short heading for the left block."
                      },
                      text: {
                        type: "string",
                        description: "Body content of the left block."
                      }
                    }
                  },
                  right: {
                    type: "object",
                    additionalProperties: true,
                    properties: {
                      title: {
                        type: "string",
                        description: "Short heading for the right block."
                      },
                      text: {
                        type: "string",
                        description: "Body content of the right block."
                      }
                    }
                  }
                }
              },
              options: {
                type: "array",
                description:
                  'Optional choices to show the user. If you recommend one, put it first and append "(Recommended)" to that label.',
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    label: {
                      type: "string",
                      description: "Short user-facing option label."
                    },
                    description: {
                      type: "string",
                      description:
                        "One sentence explaining the tradeoff or impact."
                    }
                  },
                  required: ["label"]
                }
              },
              multi_select: {
                type: "boolean",
                description:
                  "Whether the user may select more than one option. Defaults to false."
              }
            },
            required: ["id", "question"]
          }
        },
        fullscreen: {
          type: "boolean",
          description:
            "Optional: force the questionnaire to render as a fullscreen overlay (true) or inline in the conversation (false). Defaults to fullscreen when any question is a compare kind."
        }
      },
      required: ["questions"]
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
          reject(
            new Error("ask_many_questions aborted before the user answered")
          );
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
