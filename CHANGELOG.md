# Changelog

All notable changes to **dsh-survey** are documented here.

## [1.1.0] - 2026-08-16

### Added
- **英文界面**：卡片文案不再硬编码中文，改为 zh / en 两套词条，插件从此可以给非中文用户用。
  - 优先读 Web UI 自己的语言服务（`ctx.locale`），没有该服务时按浏览器语言兜底，用户切语言即时重渲染
  - 答案契约不变：boolean 回传 `"yes"` / `"no"`，compare 回传 `"left"` / `"right"`，选项题回传 label 原文
- **`AGENTS.md`**：面向模型的入口页——工具名、何时该用、参数形状、mode 怎么选、答案回传什么样。

### Fixed
- **调用可能永久挂起**：`do_a_survey` 此前没有任何超时兜底，用户关标签页、刷新或不理会问卷时 Promise 永不 settle，agent loop 卡死、`pending` Map 泄漏。
  - harness 的 timeout-policy 是 per-tool opt-in，只对声明了 `timeoutMs` 的工具生效，本插件没声明
  - 现在声明 `timeoutMs: 30 分钟`，并在进程内挂同长度的兜底定时器（`unref`），覆盖未加载该策略的组合
- **abort 监听器泄漏**：`exec.signal` 上的 `abort` 监听从不移除，每次调用往 run 级 signal 挂一个不会回收的闭包。现在提交、取消、中止、超时、卸载五条路径统一走一个 `finish`，定时器与监听一次性释放。
- **插件卸载后旧调用挂死**：dispose 只摘路由和工具，不处理在途问卷。现在卸载时把未决调用全部 reject。
- **webServer 缺席时仍注册工具**：会给模型一个永远收不到答案的提问。现在没有提交通道就不注册，并打 warn。
- **compact 模式静默吞题**：多题传 `mode: "compact"` 时 UI 只画第 1 题，其余题却按「未作答」提交给模型。现在自动按 inline 呈现，一题不落。
- **重复 label 串选**：选中态以 label 文本为键，两个同名选项会一起高亮、一起 toggle。草稿改为按选项索引记录，label 在提交时解析。
- **recap 丢答案**：多选只回显第一个选项，填了自定义回答则覆盖全部选项。现在全部选项以「、」并列，自定义回答并列展示而非替换。
- **小数标签被截断**：`stripLeadingIndex` 把 `"3.5 Sonnet"` 剥成 `"5 Sonnet"`。数字前缀现在要求标点后不紧跟数字。
- **取消不检查响应**：host 返回 404 时卡片照样显示「问卷已关闭」。现在只有 host 确认才置为关闭，否则回滚并报错。
- **answers 未经校验进模型上下文**：提交内容按 `{id, selected, custom?, skipped?}` 逐条校验，id 必须属于本次调用，不合格返回 `bad answers payload` 且调用继续等待。
- **问题 id 无约束**：缺失或重复的 id 会让 recap 的按 id 匹配全部命中第一条。现在空问卷、缺 id、重复 id 在 execute 阶段即失败并说明原因。

### Changed
- **boolean 题回传值改为 `"yes"` / `"no"`**（原先是中文 `"是的"` / `"不是"`）：答案契约与界面语言解耦，UI 显示「是的 / 不是」或「Yes / No」，recap 照原样回显。工具 description 与 output schema 写明了各题型的回传形状。
- **grid 卡片按 harness 组件风格重做**：此前卡片背景取 `--dsw-alias-bg-layer-1`，在深色下比卡片本体更暗，看着像卡片上挖的洞。
  - 改用其余 dsh 组件承载嵌套面的写法：`--dsw-alias-interactive-bg-hover` 打底 + `--dsw-alias-border-l2-darkmode-thin` 描边
  - 排版换成 `--dsw-font-*` 复合字体 token；选项行 32→36px、圆角 8→10px、标记 16→18px；是否开关补上轨道底色，字号 11→12px
  - 跳过按钮挪到卡片右上角绝对定位（对齐附件栏 `_remove_` 的位置），不再占据题干那一行的横向空间；保持常驻可见，并补上键盘焦点环
  - 去掉控件的 `margin-top:auto`，是否开关不再悬在题干下方 90px 处；所有卡片仍保持同一尺寸
  - 题号从 markdown 串里拆出来单独成元素，顺带修掉渲染成 `1\.` 的转义残留
- **grid 卡片文案改为纯行内 markdown**：卡片小且全网格同尺寸，一道题里的代码块或硬换行会把整个矩阵一起撑高。
  - 新增 `toInlineMarkdown()`：``` 围栏折成行内 code、引用去掉前缀、换行折成空格
  - 题干、选项 label、compare 标题三处入口统一走它；加粗与行内 code 仍然渲染，文字仍在卡内自然换行
- **客户端拆分为 src/ 模块，加 esbuild 构建**：原先 969 行连同 15KB 单行 CSS 字符串全挤在 `lib/client.js`。
  - 按 runtime / css / i18n / markdown / controls / model / answers / modes 分文件，样式回归真正的 `.css`
  - `pnpm build` 产出 `lib/client.js` + `client.js.map`；host 本来就服务这张 map，断点可直接落回 `src/`
  - React 与 UI primitives 仍走 loader 的 `require`，不进包，插件与宿主共用同一个 React 实例
  - 拆分前后五个场景的渲染 HTML 逐字节一致，样式表规范化空白后完全相同
- **compare 块给足体量**：未选中的一侧此前是 `background:transparent`，只有选中那侧有面，两栏一边是卡片一边是裸文字，看不出这是两个待权衡的方案。
  - 两侧统一给面：`--dsw-alias-interactive-bg-hover` 打底 + `--dsw-alias-border-l2-darkmode-thin` 描边，跟 grid 卡片同一套嵌套面写法
  - `min-height` 40 → 148px，内边距 8/12 → 14/16，两栏间距 8 → 12px，正文 `flex:1` 撑满，两侧等高
  - 选中态改为「浮起」：底色换成卡片色 + `--dsw-alias-label-primary` 描边，序号座同时反白，跟单选/多选的填充语义一致
  - 标题与正文换 `--dsw-font-s-strong-14` / `--dsw-font-xs-13`，去掉 13.5px 这种非 token 字号
- **recap 回显与卡片口径一致**：选项题的答案存的是作者原文 label，recap 直接回显会带上 `(recommended)` 标记和作者写的序号前缀，跟卡片上剥掉标记、另起徽章的显示对不上。`describeChoice` 现在按卡片同一套规则剥一遍再显示；回传给模型的 payload 仍是原文 label，不受影响。
- **`{color:…}` 与块级 Markdown 混用会被撕开**：安全渲染器只接受整篇文档，连一个裸词都返回 `<div><p>词</p></div>`。`Md` 按颜色标记切开字符串后，每个分片各自成块——写在引用块里时，剩下的 `"> "` 单独渲染成一个空引用条，正文掉到外面。
  - 无颜色标记的文本整篇交给渲染器，围栏、引用、列表的块结构原样保留
  - 有颜色标记时分片包进 `.mq-md-inline` 拍回一行；分界处的空白改为在渲染器外输出，否则 Markdown 会把它 trim 掉，导致颜色两侧的词粘连
- **报错文案比常态信息还小**：`.mq-error` 是 11px，紧挨着的 `.mq-progress` 是 14px——「你的操作没生效」反而比「已答 3 / 4 题」更不显眼。现在与进度文案同字号同字重。
- **grid 跳过按钮点击区补到 24×24**：此前 20×20，低于最小可点区域，也跟其余模式的 `.mq-skip` / `.mq-close` 不一致。
- **README 修正题型表**：单选此前写成 Radio，实际渲染是编号座（1 / 2 / 3）——`QuestionBody` 传的是 `index` 而非 `radio`，radio 点只出现在 boolean 题。
- **README 预览图换成真实截图**：此前四张 SVG 是手绘近似，把单选画成了圆点（实际是编号座），主按钮画成蓝色（实际是近白胶囊）。
  - 改为 Playwright 对真实工具视图截图：真组件 + 真样式表 + 浏览器排版，2 倍图
  - 中英两套：`README.md` 用英文界面，`README.zh.md` 补上此前完全没有的预览章节，用中文界面
  - 截图按卡片真实的 `max-height: min(78vh, 760px)` 取样例长度，不呈现产品里不可能出现的卡片尺寸
- **全屏浮层补齐 modal 出口**：`overlay` 与 `grid` 支持 Esc 关闭、点遮罩关闭、Tab 在卡片内循环，打开时焦点移入卡片。
- **动态插件兜底配方同步**：以上 host 与 client 修复全部同步；grid 模式补上此前缺失的 compare 题渲染，两版答案格式一致。

## [1.0.2] - 2026-08-15

### Changed
- **`do_a_survey` 提升为默认提问通道**：工具 description、SKILL.md（含 frontmatter）与动态插件兜底配方同步改写。
  - 任何需要向用户提问、确认、收集选择或意见的场景都优先用 `do_a_survey`，哪怕只有 1 个问题、哪怕是/否确认
  - 单题用 `mode: "compact"`，不再走正文提问
  - `ask_user_question` 仅作为插件不可用时的兜底

## [1.0.1] - 2026-08-15

### Changed
- **UI 全面对齐 ask_user_question（composer 卡片风格）**
  - 卡片：`--dsw-specific-input-major` 背景 + 20px 圆角 + `--dsw-shadow-lv2`
  - header：eyebrow/title 排版 + 圆形图标关闭按钮
  - 选项行：40px 高透明行，hover 与选中态用 `--dsw-alias-interactive-bg-hover`；单选显示数字座，多选显示 14px checkbox
  - `(推荐)` 与 `（推荐）` 后缀解析为「推荐」badge
  - 选项行自带「自定义回答」内联输入行，开放题用 textarea
  - 提交按钮换成 primitives `Button`，fallback 用同款主题变量的 primary 按钮
  - 是否题由 toggle 改为两个「是/否」选项行
  - `单选/多选/是否/对比/开放` 标签移到题号行右上角（跳过按钮旁），compact 单题卡同样右上角显示

### Fixed
- **题号与题目正文不在一行**：长 MarkdownText 块会把作为独立 flex span 的题号挤到单独一行。
  - 题号改为 Markdown 段落首字渲染（`N. 题目…`），长题目换行时始终与正文首行同排
  - grid 模式同步修复
  - 1.0.0 的 `.mq-qtext` flex-wrap 修复只覆盖了含 `{color:…}` 标记的题目，裸 MarkdownText div 的普通题目未命中
- **`**加粗**` 紧贴引号或标点渲染成字面星号**（如 `**"家庭信任第一次松动"**`）：micromark 的 CommonMark flanking 规则把贴着标点的分隔符判为非 flanking，星号原样显示。
  - 渲染器在恰好两个 `*` 的分隔符与相邻标点之间插入零宽空格（`padEmphasisPunct`）
  - 题目、选项、描述、header、对比块、recap 全部生效

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
- **Full Markdown rendering** — code blocks (newline fenced), inline code, triple-backtick, bold, blockquotes.
  - bundle: the official safe renderer
  - dynamic-plugin fallback: an escaping-immune lightweight renderer
- **Skip / restore** per question (`skipped: true`), **two-column recap** after submit, keyboard focus rings, a11y roles.
- **Bundle plugin** (recommended, resident):
  - `lib/index.mjs` Host entry — defineTool + webServer `/api/dsh-survey/submit|cancel`
  - `lib/client.js` client bundle — `__ModuleLoader__.load`
- **Skill** `dsh-survey` (usage guide) + **dynamic-plugin fallback recipe** for environments without the bundle.

### Fixed
- Grid card layout: equal-height cards (`grid-auto-rows:1fr`), compact qtext (number hugs question, skip pinned right), bottom-aligned toggles, restored skip-button styling.
- Markdown escaping across JSON transport: character-class regexes (`[*]{2}`, `` [`]{3} ``) immune to backslash mangling.

## [0.1.0] - 2026-08-14
- Initial release (internal history: rename `ask_many_questions` → `do_a_survey`, grid matrix mode, markdown hardening).
