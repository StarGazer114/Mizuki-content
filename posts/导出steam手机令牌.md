---
title: 导出steam手机令牌
published: 2026-05-12
description: 本文介绍了如何利用 ArchiSteamFarm (ASF) 在无需手机 Root 权限的情况下，完成 Steam 令牌的配置、导出及迁移至第三方身份验证器的详细步骤。
tags: [steam, ASF]
draft: false
pinned: false
lang: zh-CN
---
导出操作需要用到asf，安装和配置教程可以看我之前的文章[asf挂卡食用指南](https://blog.bear556.top/posts/asf%E6%8C%82%E5%8D%A1%E9%A3%9F%E7%94%A8%E6%95%99%E7%A8%8B/)

# asf配置2fa
打开你的steam[账户明细](https://store.steampowered.com/account/authorizeddevices)，解绑手机令牌
然后打开asf，在命令行输入 `2fainit 机器人名字`等待一会后你可能会收到steam发的短信验证码，不用理会进行下一步

# 启用steam手机令牌
打开你的steam app，按照正常的流程创建手机令牌，然后打开 `steam令牌验证码` 页面，复制验证码

# asf创建令牌
进入asf命令行，输入 `2fafinalized 机器人名字 手机令牌验证码`来在asf创建令牌

# 完成并导出
不出意外的话，你可以在asf-ui上看到和你手机令牌上一样的验证代码，下面就可以把它导出到其他验证器里了
## 导出
打开你的asf目录，在 `/config` 目录下可以找到名为 `机器人名字.maFile.NEW`的文件，这就是你的steam令牌文件，==一定要存放在安全的地方，不要泄露给任何人！== 
打开这个文件，找到最后一行 `otpauth://`开头的内容，复制下来，用二维码生成器生成二维码后用第三方身份验证器扫码即可导入