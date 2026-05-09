---
title: "部署hexo博客"
published: 2024-09-11
updated: 2024-12-16
category: "技术"
tags: ["hexo", "Github", "netlify"]
image: "https://img.bear556.top/2024/12/22/67678485ddfc5.jpeg"
---
Hexo 是一个快速、简洁且高效的博客框架。Hexo 使用 Markdown（或其他标记语言）解析文章，几秒钟内即可利用精美主题生成静态网页。

## 安装 Hexo

可以参照[官方文档](https://hexo.io/zh-cn/docs/)进行安装。<!--more-->

### 一键部署脚本

如果你觉得官方文档难以理解，这里提供一个一键安装脚本，可用于安装 npm 和 Hexo（适用于 Ubuntu 系统）。使用前请确保你的电脑未安装 nodejs，可通过 `node -v` 和 `npm -v` 检查，如果提示 `bash: npm: command not found`，即可使用此脚本。成功运行后可直接在 `~/blog` 目录下查看。

~~~sh
curl -O https://raw.githubusercontent.com/lijiashuai111/hexo-auto-install/main/hexo-auto-install.sh && sh hexo-auto-install.sh
~~~

## 配置文件

Hexo 的配置文件 `_config.yml` 包含多个关键配置项，每项都有特定功能：

1. **title**: 博客标题。
2. **subtitle**: 博客副标题。
3. **description**: 博客内容描述。
4. **author**: 作者名称。
5. **language**: 博客使用的语言。
6. **timezone**: 博客时区。
7. **url**: 博客网址。
8. **root**: 网站根目录路径。
9. **permalink**: 文章永久链接格式。
10. **permalink_defaults**: 永久链接各部分的默认值。

此外还有许多涉及主题、部署、插件等的配置项，详细说明可参考 [Hexo 配置文档](https://hexo.io/zh-cn/docs/configuration)。

## 开始写作

使用 `hexo n <文章名>` 新建文章，默认存储在 `source/_posts/文章名.md`。编辑该文件即可开始写作。你可以用 `hexo s` 在本地 4000 端口启动开发服务器，实时预览更改。

## 部署

写完文章后，使用 `hexo g` 生成静态文件，生成结果存储在 `/public` 目录。你可以将整个目录上传到服务器或静态网站托管服务。

### 部署到 GitHub Pages

你可以将博客托管到 GitHub Pages。

#### 创建 SSH 密钥

生成 SSH 密钥，用于连接 GitHub。

~~~sh
ssh-keygen -t rsa -C "你的 GitHub 邮箱"
~~~

获取公钥内容，复制并填写到 GitHub。

~~~sh
cd && cat .ssh/id_rsa.pub
~~~

前往 [https://github.com/settings/keys]，点击 `New SSH key`，填写刚复制的公钥内容。然后回到终端，输入 `ssh git@github.com`，如果显示你的用户名则代表连接成功。

---

新建一个仓库，命名为 `<用户名>.github.io`

#### 安装插件

在终端输入 `npm install hexo-deployer-git --save`，然后编辑 `_config.yml`，添加如下内容：

```yaml
deploy:
  type: git
  repo: <仓库的ssh地址>
  branch: main
```

仓库的 ssh 地址可在仓库主页绿色的 code-ssh 处复制。

#### 推送

使用以下命令部署博客：

```sh
hexo g ## 生成静态文件
hexo d ## 将静态文件推送到 GitHub
```

然后访问 `<用户名>.github.io` 即可看到你的网站。

### 部署到 Netlify

Netlify 是一个提供静态资源托管的综合平台，支持 CI 服务，可将 GitHub、GitLab 等网站上的 Jekyll、Hexo、Hugo 等代码自动编译并生成静态网站。本站即托管于 Netlify。

#### 如何使用

首先注册账号 [https://app.netlify.com/]
点击“添加站点”-“导入现有项目”（可用浏览器翻译）。
![1727856956622.png](https://img.bear556.top/uplodas/2024/10/02/66fd013a9c55d.png)
登录你的 GitHub 账户，选择你的 **hexo 自动部署仓库**（博客源码），部署命令填写 `hexo g`，发布目录填写 `public`。
![1727856986059.png](https://img.bear556.top/uplodas/2024/10/02/66fd015814f53.png)
点击部署。
部署完成后主页会显示访问地址，你也可以添加自己的域名。
![1727856997484.png](https://img.bear556.top/uplodas/2024/10/02/66fd016373698.png)

#### Netlify 和 GitHub Pages 的对比

优点：

* 免费 CDN，国内访问速度快
* 可自动申请 SSL 证书，无需手动配置
* 部署速度较快

缺点：

* 限额：免费账户每月 100G 流量、300 分钟构建时间（对于个人博客已足够，也可视为优点）

### FTP 部署

FTP 部署适用于虚拟主机、网站空间等场景，可通过 FTP 上传静态文件。
安装 `hexo-deployer-ftpsync`：

```sh
npm install hexo-deployer-ftpsync --save
```

在 Hexo 配置文件 `_config.yml` 下添加如下配置：

```yml
deploy:
  type: ftpsync
  host:   # ftp 服务器地址
  user:   # ftp 用户名
  pass:   # ftp 用户密码
  remote: # 远程路径
  port:   # ftp 端口，默认为 21
  clear: true # 部署时是否清除远程路径下所有文件
  verbose: true # 是否输出日志
```

## 同时配置多个部署

示例：

```yaml
deploy:
  - type: git
    repo: <仓库的ssh地址>
    branch: main
  - type: ftpsync
    host:   # ftp 服务器地址
    user:   # ftp 用户名
    pass:   # ftp 用户密码
    remote: # 远程路径
    port:   # ftp 端口，默认为 21
    clear: true # 部署时是否清除远程路径下所有文件
    verbose: true # 是否输出日志
```
