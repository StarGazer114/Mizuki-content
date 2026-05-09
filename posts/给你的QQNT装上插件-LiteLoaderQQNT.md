---
title: "给你的QQNT装上插件-LiteLoaderQQNT"
published: 2025-01-14
updated: 2025-01-17
category: "软件"
tags: ["QQNT"]
---

# LiteLoaderQQNT 插件加载器简介

> **LiteLoaderQQNT** 是 QQNT 的插件加载器，在 QQNT 环境中通常简称为 LiteLoader。
> 
> 它可以让你自由为 QQNT 添加各种插件，实现美化主题、功能增强等多种扩展。
> 
> 支持 QQNT 桌面端全架构，最低兼容 `25765` 版本，基本覆盖官网最新版本。

<!--more-->

---

## 安装步骤

### 1. 下载 LiteLoaderQQNT

你需要先将 LiteLoaderQQNT 下载到本地：

- 打开 [Releases 页面](https://github.com/LiteLoaderQQNT/LiteLoaderQQNT/releases)，下载 `LiteLoaderQQNT.zip` 文件，解压到任意位置。

- 或者通过 git 克隆项目仓库：
  
  ```shell
  git clone --depth 1 https://github.com/LiteLoaderQQNT/LiteLoaderQQNT.git
  ```

#### Windows 设备额外操作

如果你使用的是 Windows 设备，还需额外移除文件校验：

- 前往 [DllHijack](https://github.com/LiteLoaderQQNT/QQNTFileVerifyPatch/releases)，下载适合你设备的文件，放到 `QQ.exe` 同级目录下。

### 2. 手动安装（修改文件）

1. 找到 app 文件夹路径：
   - 如果 QQNT 根目录存在 `versions` 文件夹，则路径为：
     `QQNT\versions\版本号\resources\app`
   - 如果没有 `versions` 文件夹，则路径为：
     `QQNT\resources\app`
2. 在 app 目录中：
   - 创建 `app/app_launcher/*.js` 文件（* 为自定义文件名），内容为 `require(String.raw`*`)`，* 为 LiteLoaderQQNT 的路径
   - 修改 `app/package.json` 文件，将 `main` 字段的路径改为 `./app_launcher/*.js`，其中 * 为你刚创建的文件名

### 3. 检查安装

打开 QQ 设置，查看是否有 `LiteLoaderQQNT` 选项。

![LiteLoaderQQNT 设置界面](https://img.bear556.top/2025/01/14/678653cac3a0e.png)

---

## 插件管理与可视化安装

默认情况下，安装插件需要去官网逐个下载，操作不够便捷。你可以通过安装 `LL-plugin-list-viewer` 插件来可视化下载和管理插件。

### 安装 LL-plugin-list-viewer

1. 下载插件：
   - 前往 [LL-plugin-list-viewer Releases](https://github.com/ltxhhz/LL-plugin-list-viewer/releases) 下载 `list-viewer.zip` 文件，无需解压。
2. 加载插件：
   - 打开 `LiteLoaderQQNT` 设置页面，点击“安装插件”并选择下载的文件。
   - 重启 QQ，回到设置页面即可看到插件列表。

![插件列表界面](https://img.bear556.top/2025/01/14/678656278824a.png)
