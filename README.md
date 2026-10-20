# 橙照 · chengzhao-dev.github.io

个人网站，用 Quarto 写，部署在 GitHub Pages。

**站点：** <https://chengzhao-dev.github.io>

这里放三类东西：正在做的项目、能照着复现的笔记，以及关于「把一件小事做完整」的练习。设计上刻意保持安静：暖纸色底、橙色作强调、衬线标题、足够多的留白。

## 本地开发

需要 [Quarto](https://quarto.org) 1.10 或更新版本。

```bash
quarto preview      # 本地预览，改文件自动刷新
quarto render       # 生成静态站点到 _site/
```

写页面不需要 Node 或 Python；主题是纯 CSS/SCSS，交互是原生 JavaScript。`quarto render` 最后会运行 `scripts/post-render.mjs`（Node），给每页补 canonical 与 `og:url`，并把 sitemap 里的 `/index.html` 规整为目录 URL。

## 目录

```text
.
├── _quarto.yml                 # 站点、导航、主题、搜索、格式
├── _publish.yml                # gh-pages 发布目标（Quarto / Actions 共用）
├── index.qmd                   # 首页
├── about/index.qmd             # 关于
├── projects/index.qmd          # 项目清单（手写，不自动生成）
├── notes/
│   ├── index.qmd               # 笔记列表（Quarto listing）
│   └── <slug>/index.qmd        # 每篇笔记
├── 404.qmd
├── robots.txt
├── scripts/post-render.mjs     # 补 canonical / og:url，规整 sitemap
├── theme/
│   ├── theme-light.scss        # Bootstrap 变量 + 浅色规则
│   ├── theme-dark.scss         # 深色规则
│   ├── css/                    # tokens、base、navbar、landing、pages、footer
│   ├── js/site.js              # 主题切换、滚动、入场、页脚归位
│   ├── includes/               # head、页脚、前后置 HTML
│   └── assets/                 # 品牌标记、favicon、自托管字体
└── .github/workflows/publish.yml
```

## 写作

新建 `notes/<slug>/index.qmd`，至少写 `title`、`date`、`description`，列表会自动收录：

```yaml
---
title: "标题"
date: "2026-10-20"
description: "一句话说明这篇笔记解决什么问题。"
author: "橙照"
categories: [Quarto, 写作]
---
```

日期一律写静态日期，不用 `today`。文章默认带目录、代码复制和上一篇/下一篇，没有评论区等干扰。

## 主题

设计变量集中在 `theme/css/tokens.css`：

- 浅色：纸色 `#F7F2E8`、墨色 `#221D17`、强调橙 `#B84E22`
- 深色：暖炭 `#15120F`、米白 `#F4EAD9`、亮橙 `#F08A5D`
- 字体：Fraunces（西文标题）、LXGW Bright（中文正文）、LXGW Bright Code（代码）

`theme/` 的权威副本同时放在 DSH 插件 `dsh-quarto-website` 的 `skills/designing-website-theme/assets/theme/`，改完两边保持同步。

## 元数据

每页都有唯一的 `<title>`、`description` 和 canonical。Quarto 只根据 `site-url` 生成 sitemap，不生成 canonical，所以 `_quarto.yml` 配置了：

```yaml
project:
  post-render:
    - node scripts/post-render.mjs
```

脚本遍历 `_site/**/*.html`，按输出路径计算绝对地址，已有标签不会重复插入；同时把 `sitemap.xml` 里的 `/index.html` 规整为目录 URL。改站点域名时只改 `_quarto.yml` 的 `site-url`，不要改脚本。

## 发布

推送到 `main` 后，GitHub Actions 会渲染并推送 `_site` 到 `gh-pages` 分支。`_publish.yml` 供本地 `quarto publish gh-pages` 使用，Actions 不依赖它。

首次发布后需要在仓库 **Settings → Pages** 把 Source 设为 **Deploy from a branch → gh-pages / (root)**。用户站点默认指向 `main`，不切换会一直显示 README，而不是网站。

## 许可

- 代码（主题、脚本、配置）：MIT，见 [LICENSE](LICENSE)
- 文字与图片：CC BY-NC-SA 4.0，转载请注明来源，不得用于商业用途

字体许可见 `theme/assets/fonts/LICENSE-*.txt`。
