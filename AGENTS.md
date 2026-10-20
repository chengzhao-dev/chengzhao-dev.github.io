# AGENTS.md

给在这个仓库里工作的编码代理（以及未来的我）的说明。站点是 Quarto 项目，不是 React/Next 应用；请先读 `_quarto.yml` 和 `theme/css/tokens.css`，再改页面。

## 命令

```bash
quarto preview       # 本地预览，默认 http://localhost:xxxx
quarto render        # 构建到 _site/，最后运行 scripts/add-canonical.mjs
```

渲染后至少检查：

- 8 个页面都生成：`_site/index.html`、`about/`、`projects/`、`notes/`、3 篇笔记、`404.html`
- 没有 `unresolved link` / fenced div 警告
- 每页只有一个可见 `h1`，且每页只有一条 canonical
- 1440px 与 390px 下没有横向溢出
- 主题切换、搜索、移动端菜单仍可用

## 页面约定

- 首页、项目、关于、笔记列表、404 使用 `page-layout: custom` 和 `.cz-page`（首页为 `.cz-home`）包裹；不要依赖 Quarto 默认标题块，自定义页已用 CSS 隐藏。
- 自定义页必须有一个 `<main id="quarto-document-content" class="content">`，否则跳转链接和可访问性 landmark 不完整。
- 自定义页（首页、项目、关于、笔记列表、404）只写 `pagetitle`，不要写 `title`；站点名由 Quarto 自动追加，避免出现两次「橙照」。
- 笔记必须保留 `title`（列表和正文标题都读它），浏览器标题可另写同值 `pagetitle`；不要带 `· 橙照` 后缀。
- 项目页是手写清单，不自动生成；新增项目时同步更新首页 `.cz-work-card`、项目页、以及首页的 `06` 统计。
- 笔记放在 `notes/<slug>/index.qmd`；日期写静态 `YYYY-MM-DD`，不要用动态日期。新增笔记后更新首页 `03 篇公开笔记` 统计和必要的内容链接。

## Pandoc 陷阱

- fenced div 的开始/结束行必须和正文之间留空行，否则渲染成字面量 `:::`。
- 原生 HTML 块内部的缩进行会被当成代码块；多行 HTML 一律顶格写（column 0），或改用 fenced div + Markdown。
- 卡片内的 `<p>` 默认有外边距；`.cz-work-card p` / `.cz-note-row p` 已归零，新增块级元素时检查是否把卡片撑破。

## 主题与交互

- `theme/` 是站点主题；同一份主题也存放在 `D:\Github\dsh-quarto-website\skills\designing-website-theme\assets\theme\`。修改后两边同步，不要只改一边。
- 浅色是默认主题，不跟随系统；用户选择存入 `localStorage['cz-theme']`。`theme/includes/head.html` 在首屏前恢复主题，`site.js` 负责切换。
- Quarto 自带的 `.quarto-color-scheme-toggle` 被有意隐藏；自定义按钮 `.cz-theme-toggle` 插入 `.quarto-navbar-tools`。不要同时启用两个，否则导航右侧会出现重复按钮。
- 强调色 `#B84E22` 在纸色上的对比度约 4.5:1，是正文链接可用的下限；不要再调浅。
- 动效必须保留 `prefers-reduced-motion` 分支；装饰元素加 `aria-hidden="true"`。
- 页脚由 `theme/includes/footer.html` 提供，`site.js` 的 `relocateFooter()` 把它移到 `body` 末尾以获得全宽背景；改动页脚结构时验证桌面/平板/手机三档。

## 元数据

- 每页 front matter 必须有非空 `description`；首页和 404 也不能省。
- canonical 与 `og:url` 由 `scripts/add-canonical.mjs` 在渲染后写入；不要手工编辑 `_site/`。
- 改域名只改 `_quarto.yml` 的 `site-url`，脚本会读取同一份配置。

## 发布

`.github/workflows/publish.yml` 在 push `main` 后构建并发布 `gh-pages`；`_publish.yml` 声明发布目标，本地和 Actions 共用。首次必须在 GitHub **Settings → Pages** 把 Source 切到 `gh-pages`；用户站点默认是 `main`，这是最容易漏的一步。

## 内容原则

- 不编造项目、日期、指标或经历；项目数量、笔记数量、外链必须能从真实仓库/页面核实。
- 中文为主，标题和导航保持短；英文只用于代码、工具名和必要的副标题。
- 先保证能编译、能运行、能复现，再谈排版。
