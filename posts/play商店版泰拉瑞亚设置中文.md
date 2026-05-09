---
title: "play商店版泰拉瑞亚设置中文"
published: 2026-04-06
updated: 2026-04-06
tags: ["泰拉瑞亚", "游戏", "汉化"]
---
前两天刷出了play商店的4刀优惠券，于是火速拿下泰拉瑞亚（0.99刀）愉快的付款下载后我傻眼了

![我中文呢](https://imgbed.bear556.top/file/1775453330605_11371.jpg)
布什戈门，我中文呢？

---

网上搜了搜发现泰拉瑞亚其实是有中文的，只不过因为某些原因，中文开关在设置里被隐藏了，需要通过改配置文件开启中文

---

- 如果你是第一次安装，请先随便新建一个存档来生成配置文件
- 打开mt管理器，进入以下目录

```
/storage/emulated/0/Android/data/com.and.games505.TerrariaPaid/
```

- 找到 `config.json`
  ![Screenshot_2026-04-06-13-35-30-69_9e8df3d0c7c1f50248b6ee043a653d26.jpg](https://imgbed.bear556.top/file/1775458970262_Screenshot_2026-04-06-13-35-30-69_9e8df3d0c7c1f50248b6ee043a653d26.webp)
- 在第34行将`Language`改成7
  ![Screenshot_2026-04-06-15-04-03-37_9e8df3d0c7c1f50248b6ee043a653d26.jpg](https://imgbed.bear556.top/file/1775459096479_Screenshot_2026-04-06-15-04-03-37_9e8df3d0c7c1f50248b6ee043a653d26.webp)
  重启游戏，变成中文
  ![中文](https://imgbed.bear556.top/file/1775450234983_11368.jpg)

END