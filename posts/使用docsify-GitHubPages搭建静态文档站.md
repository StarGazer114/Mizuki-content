---
title: "使用 docsify + GitHub Pages 搭建静态文档站"
published: 2024-08-25
updated: 2024-12-16
description: "安装 docsify 后，可以看到目录下出现了相关文件，现在可编辑 `README.md` 修改主页内容。"
category: "技术"
tags: ["服务器", "docsify", "Github"]
image: "https://t.mwm.moe/fj"
---

我建的站点示例：[赛博扫盲手册](https://pcbook.top)

---

## 一、安装 docsify

```sh
npm i docsify-cli -g      # 全局安装 docsify

docsify init ./docs       # 初始化并创建 ./docs 文件夹
```

安装成功后，`./docs` 目录下会出现如下文件：

- `index.html`：入口文件
- `README.md`：作为主页内容渲染
- `.nojekyll`：用于阻止 GitHub Pages 忽略下划线开头的文件

此时你可以编辑 `README.md` 修改主页内容，也可以使用如下命令在本地 3000 端口启动实时预览：

```sh
docsify serve ./docs
```

---

## 二、多页文档

直接在 `docs` 目录下新建 `.md` 文件，通过 `域名/文件名` 访问。

---

## 三、定制侧边栏

多页文档创建后，默认只能手动输入地址访问。要实现侧边栏导航，需要如下操作：

1. 在 `index.html` 中找到 `window.$docsify = {`，添加 `loadSidebar: true` 配置：

    ```html
    <script>
      window.$docsify = {
        loadSidebar: true
      }
    </script>
    ```

2. 创建 `sidebar.md` 文件，用 Markdown 链接格式填写页面地址：

    ```markdown
    * 基础篇
    * [前言](/)
    * [硬件](1)
    * [操作系统](2)
    * [浏览器](3)
    ```

> 注：如上示例，`1.md`、`2.md`、`3.md` 分别对应“硬件”“操作系统”“浏览器”页面。

---

## 四、更多配置与插件

更多配置项和插件说明请参考 [官方文档](https://docsify.js.org/#/zh-cn/configuration)。
所有配置均在 `index.html` 的 `window.$docsify = {}` 中设置。
