# Mizuki 博客内容

这是 Mizuki 博客的内容仓库,包含所有文章、数据和图片。

## 目录结构

- `posts/` - 博客文章
- `spec/` - 特殊页面 (关于、友链等)
- `data/` - 数据文件 (番剧、项目、技能、时间线)
- `images/` - 图片资源
- `template`-新文章模板
- `draft`-草稿

## 使用方法

本仓库使用Github Actions自动部署，`posts`，`spec`，`data`，`images`目录发生更新时会自动触发cloudflare pages部署钩子实现自动部署
