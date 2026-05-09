---
title: "安卓手机一键部署 Gemini-CLI 反向代理"
published: 2025-09-21
updated: 2025-09-21
tags: ["Gemini", "AI"]
---

项目地址：[print-yuhuan/Gemini-CLI-Termux](https://github.com/print-yuhuan/Gemini-CLI-Termux?tab=readme-ov-file)

<a href="https://github.com/print-yuhuan/Gemini-CLI-Termux"><img src="https://github-link-card.s3.ap-northeast-1.amazonaws.com/print-yuhuan/Gemini-CLI-Termux.png" width="460px"></a>

# 安装教程

在 Termux 中执行以下命令：  

```
curl -O https://raw.githubusercontent.com/print-yuhuan/Gemini-CLI-Termux/main/Setup.sh && bash Setup.sh
```

脚本会自动安装所有依赖并完成配置。安装完成后，需要手动配置 Google Cloud 项目 ID。

# Google Cloud 配置

## 步骤一：获取项目 ID

1. 访问 [Google Cloud Console](https://accounts.google.com/v3/signin/accountchooser?continue=https%3A%2F%2Fconsole.cloud.google.com%2Fwelcome%3Fhl=zh_CN&service=cloudconsole&flowName=GlifWebSignIn&flowEntry=AccountChooser)

2. 创建新项目或选择已有项目

3. 记录项目 ID（如下图红圈处）  
   
   ![](https://img.bear556.top/2025/09/21/20250921103340823.png)

## 步骤二：启用 API

请务必启用以下两个 API（缺一不可）：

- [Gemini for Google Cloud](https://accounts.google.com/v3/signin/accountchooser?continue=https%3A%2F%2Fconsole.cloud.google.com%2Fapis%2Flibrary%2Fcloudaicompanion.googleapis.com%3Fhl=zh_CN&service=cloudconsole&flowName=GlifWebSignIn&flowEntry=AccountChooser)
  
  ![](https://img.bear556.top/2025/09/21/20250921103521223.png)

- [Gemini Cloud Assist](https://accounts.google.com/v3/signin/accountchooser?continue=https%3A%2F%2Fconsole.cloud.google.com%2Fapis%2Fapi%2Fgeminicloudassist.googleapis.com%3Fhl=zh_CN&service=cloudconsole&flowName=GlifWebSignIn&flowEntry=AccountChooser)
  
  ![](https://img.bear556.top/2025/09/21/20250921103627823.png)

# 项目配置

安装完成后，打开 Termux，依次输入：

1. 输入 `3`，再输入 `3`，填入你的项目 ID 并回车确认。
2. 输入 `0` 返回上级菜单，然后输入 `1` 启动脚本。
3. 稍等片刻，WebUI 会自动启动，界面如下：

<img title="" src="https://img.bear556.top/2025/09/21/24000b356e78d572abb7a1b3aae30e9b.jpg" alt="" width="171" data-align="center">

# 连接方式

本项目支持 **OpenAI 兼容接口** 和 **原生 Gemini 接口**。

你可以直接在本机连接，地址为 `127.0.0.1`，默认密钥为 `123`。

---

App 推荐使用 [rikkahub](https://github.com/rikkahub/rikkahub)。

在 AI 提供商页面，选择自定义提供商，类型选择 Google，填写连接信息即可。

<img title="" src="https://img.bear556.top/2025/09/21/a313efbb40f28ceb386989226be84e51.jpg" alt="" width="216" data-align="center">

现在就可以开始对话啦！