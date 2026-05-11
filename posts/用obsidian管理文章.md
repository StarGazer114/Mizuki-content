---
title: 用obsidian管理文章
published: 2026-05-10
description: 省流：内容分离+obsidian+gitsync，适用于cloudflare pages部署，其他平台没测试过
image: ./cover.jpg
tags: [Mizuki, Obsidian]
draft: false
pinned: false
lang: zh-CN
---
本人是高中生，不能经常用电脑，而移动端在编辑文章这块一直是一件非常蛋疼的事

hexo时期我一直在用[qexo](https://github.com/qexo/qexo)这个项目，移动端体验很好，但毕竟还是个网页，受限于网络，不能离线编辑，保存时会自动提交触发部署（即使保存的是草稿...）

在把博客迁移到Mizuki后我发现他有个叫 `内容分离` 的功能，简单来说启用这个功能后博客的代码和文章可以分别存在两个仓库，内容仓库有单独的版本管理，并且可以 `多人协作`，但是官方文档看的我有点晕，下面是我科研了一晚上的搭建教程

# 设置内容仓库
## 初始化
首先在github上创建一个空仓库用来存文章，然后在本地初始化仓库
```bash
# 创建并进入新目录
mkdir Mizuki-Content
cd Mizuki-Content

# 初始化 Git 仓库
git init

# 创建目录结构
mkdir -p posts spec data images/albums images/diary images/posts

# 创建 README
cat > README.md << 'EOF'
# Mizuki 博客内容

这是 Mizuki 博客的内容仓库,包含所有文章、数据和图片。

## 目录结构

- `posts/` - 博客文章
- `spec/` - 特殊页面 (关于、友链等)
- `data/` - 数据文件 (番剧、项目、技能、时间线)
- `images/` - 图片资源

## 使用方法

此仓库作为 Mizuki 代码仓库的内容源,通过 Git Submodule 或独立模式关联。

详细说明请查看: https://github.com/matsuzaka-yuki/Mizuki
EOF
```

初始化后的目录结构：
```
.
├── README.md
├── data  //数据目录，存放友链，日记等
├── images  //图片目录
│   ├── albums
│   ├── diary
│   └── posts
├── posts  //文章目录
└── spec  //特殊页面
```

## 迁移
然后迁移文章到内容仓库
```bash
# 设置路径变量
MIZUKI_PATH="/path/to/your/Mizuki"
CONTENT_PATH="/path/to/Mizuki-Content"

# 复制文章
cp -r "$MIZUKI_PATH/src/content/posts/"* "$CONTENT_PATH/posts/"

# 复制特殊页面
cp -r "$MIZUKI_PATH/src/content/spec/"* "$CONTENT_PATH/spec/"

# 复制数据文件
cp "$MIZUKI_PATH/src/data/anime.ts" "$CONTENT_PATH/data/" 2>/dev/null || echo "anime.ts not found"
cp "$MIZUKI_PATH/src/data/projects.ts" "$CONTENT_PATH/data/" 2>/dev/null || echo "projects.ts not found"
cp "$MIZUKI_PATH/src/data/skills.ts" "$CONTENT_PATH/data/" 2>/dev/null || echo "skills.ts not found"
cp "$MIZUKI_PATH/src/data/timeline.ts" "$CONTENT_PATH/data/" 2>/dev/null || echo "timeline.ts not found"

# 复制图片
cp -r "$MIZUKI_PATH/public/images/albums/"* "$CONTENT_PATH/images/albums/" 2>/dev/null || echo "albums not found"
cp -r "$MIZUKI_PATH/public/images/diary/"* "$CONTENT_PATH/images/diary/" 2>/dev/null || echo "diary not found"

echo "✅ 内容复制完成!"
```

提交更改
```bash
cd "$CONTENT_PATH"

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: Migrate content from Mizuki monorepo"

# 添加远程仓库 (替换为你的仓库地址)
git remote add origin https://github.com/your-username/Mizuki-Content.git

# 推送
git branch -M master
git push -u origin master

echo "✅ 内容仓库已推送!"
```

## 启用内容分离
然后回到你原来的仓库，修改 .`env`文件内容，启用内容分离
```env
# 启用内容分离
ENABLE_CONTENT_SYNC=true

# 内容仓库配置
CONTENT_REPO_URL=内容仓库地址
USE_SUBMODULE=true
```

然后运行 `pnpm run sync-content`就可以内容仓库获取文章了

# 自动部署
内容分离后会出现一个问题，就是内容仓库的提交不会触发代码仓库的构建，需要手动更新一下才能触发，这显然不够优雅，但官方文档这方面写的好像并不详细，也可能是我没有仔细阅读

总之我没有用官方的Repository Dispatch方案，我选择的是直接在内容仓库提交后由actions触发pages的webhook接口来实现自动部署的（能跑就行）

在cloudflare控制台获取部署挂钩，然后填到girhub的仓库密钥，名字叫 `CF_DEPLOY_HOOK`
> ​1.进入你用来存放自动化部署脚本的公开GitHub 仓库主页。
​ 2.点击顶部的 Settings（设置）选项卡。
​3.在左侧边栏中，向下滚动找到 Security 区域下的 Secrets and variables，展开后点击 Actions。
4.​点击页面右侧绿色的 New repository secret（新建仓库密钥）按钮。
​5.在 Name 字段中，为你的变量起一个大写的名字，CF_DEPLOY_HOOK。
​在 Secret 字段中，粘贴你完整的 Cloudflare Pages 部署钩子 URL。
​6.点击 Add secret 保存。



然后在` .github/workflows`目录新建文件
```yml
name: Cloudflare Pages Deploy

on:
  push:
    branches:
      - master
    paths:
      - 'data/**'
      - 'images/**'
      - 'posts/**'
      - 'spec/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Cloudflare Pages Deploy Hook
        run: |
          curl -X POST ${{ secrets.CF_DEPLOY_HOOK }}

```

只有 `data`，`posts`，`images`，`spec`目录的提交才会触发部署，现在可以把仓库连接到obsidian来写作了