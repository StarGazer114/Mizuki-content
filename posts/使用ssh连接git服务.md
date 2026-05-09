---
title: "使用ssh连接git服务"
published: 2024-09-15
updated: 2024-12-16
category: "技术"
tags: ["Github"]
image: "https://t.mwm.moe/fj"
---
## 生成密钥

`ssh-keygen -t rsa -C "你的邮箱"`，然后一路回车，前往`~/.ssh`目录下查看密钥
打开`id_rsa.pub`文件，复制下来，前往[https://github.com/settings/keys]点击New ssh key，填写你刚刚复制的公钥内容，完成

<!--more-->

## 测试

连接ssh进行测试

~~~sh
ssh git@github.com
~~~

返回结果

~~~sh
PTY allocation request failed on channel 0
Hi lijiashuai111! You've successfully authenticated, but GitHub does not provide shell access.
Connection to github.com closed.
~~~

完成，你现在可以使用ssh来进行克隆，拉取等操作了
