---
name: quarto-website-project
description: Work on the 橙照 Quarto personal website in this repository — edit pages, posts, theme, or deployment; use when changing this site, its design, or its content.
---

# 本仓库的 Quarto 网站

这是 `chengzhao-dev.github.io` 的站点源码，不是普通的 Markdown 仓库。

先读根目录 `AGENTS.md`，那里有页面结构、Pandoc 陷阱、主题同步和发布注意事项。

## 快速流程

1. 改 `_quarto.yml`、页面 `.qmd`、笔记或 `theme/`。
2. 运行 `quarto render`。
3. 检查 8 个页面、无断链、每页一个 `h1`、1440 与 390 宽度无横向溢出。
4. 若改主题，同步 `D:\Github\dsh-quarto-website\skills\designing-website-theme\assets\theme\` 下的同名文件。
5. 不提交 `_site/`、`.quarto/`、`.tmp/`、`.shots/`。

## 已有设计系统

- 暖纸底 + 橙强调 + Fraunces / LXGW Bright，变量在 `theme/css/tokens.css`。
- 自定义布局用 `.cz-home` / `.cz-page`；不要恢复 Quarto 默认标题块。
- 浅色默认，`cz-theme` 持久化；Quarto 自带主题按钮有意隐藏。
- 列表页用 Quarto listing，项目页是手写清单。

## 相关技能

若环境安装了 `dsh-quarto-website` 插件，优先加载其中的：

- `building-quarto-website` — 页面、导航、listing、搜索
- `designing-website-theme` — 主题、字体、响应式、可访问性
- `publishing-quarto-website` — GitHub Pages 与 Actions

不要为了“看起来更丰富”添加虚构的项目、日期或指标。
