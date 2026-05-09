---
title: "自建kms服务器激活Windows和office"
published: 2024-10-01
updated: 2024-12-16
category: "技术"
tags: ["服务器", "kms"]
image: "https://t.mwm.moe/fj"
---
项目地址：https://github.com/dylanbai8/kmspro
需要开放1688端口。
激活方式：powershell输入`slmgr /skms <kms服务器地址> && slmgr /ato`
你也可以使用我搭建的kms服务器`slmgr /skms kms.bear556.top && slmgr /ato`

<!--more-->

```javascript
# 一键安装KMS服务 （Debian/Ubuntu/Mint 等）
$ wget -N --no-check-certificate git.io/k.sh && chmod +x k.sh && bash k.sh debian

# 一键安装KMS服务 （CentOS/Redhat/Fedora 等）（如果系统开启了防火墙 须自行开放 1688 端口）
$ wget -N --no-check-certificate git.io/k.sh && chmod +x k.sh && bash k.sh centos

# 启动KMS服务
$ bash k.sh start

# 服务器IP地址既是KMS服务器地址
# 也可以将域名解析至IP使用（支持IPv6 即AAAA记录）

# 关闭KMS服务
$ bash k.sh stop

# 添加开机自启动KMS服务
$ bash k.sh auto

# 重启KMS服务
$ bash k.sh restart

# 查看KMS服务运行状态
$ bash k.sh status

# 卸载KMS服务
$ bash k.sh uninstall
```
