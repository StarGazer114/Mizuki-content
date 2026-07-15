---
title: 用PagesCMS管理文章
published: 2026-07-15
updated: 2026-07-15
draft: false
image: https://img.bear556.top/pagescms_upload/2026/07/15/14816.png
pinned: false
comment: true
encrypted: false
---
之前写过用obsidian管理文章，当时感觉这就是静态博客管理的最优解了，直到我发现了[Twilight](https://github.com/Spr-Aachen/Twilight)这个主题，也是基于Astro的，但人家支持后台管理  。

？我怎么不知道Astro还支持后台管理🤨，下载一个看看  
哇！如此美观的界面！
哇！如此丝滑的操作！
哇！如此优雅的编辑方式！
哇！咳咳……

---

其实是[PagesCMS](https://github.com/pagescms/pagescms)，一个基于GitHub的cms管理系统，特点就是人家==没有后台，没有数据库==，一切的一切都在GitHub上，每次修改都是一个commit，非常适合Hexo，Astro，Hugo这种静态博客  。

使用起来也非常简单，只需要一个配置文件==.pages.yml==即可，配置完只需要去[官网](https://app.pagescms.org)关联你的GitHub仓库就好了。

# 配置pages.yml

## 我的配置

如果你和我一样用Mizuki主题，并且同样启用了内容分离，~~那么恭喜你被我恭喜到了~~，你可以直接复制我这份配置文件放到你的文章仓库根目录，因为我没有启用主题的其他功能，因此份文件==仅支持==标签和分类管理，文章管理，友链和关于页面的编辑如果你需要其他功能，也可以自己写一份配置文件😉

```yml


# ── 媒体配置 ──────────────────────────────────
# 定义图片上传目标，供 image 字段和 rich-text 编辑器使用
media:
  - name: images
    label: 图片资源
    input: images          # 上传到仓库中的 public/images/
    output: /images               # 内容中写入的公开 URL 前缀
    extensions:
      - png
      - jpg
      - jpeg
      - gif
      - webp
      - svg
    rename: safe                  # slugify 文件名，避免中文/空格问题

# ── 内容集合配置 ──────────────────────────────
content:
  - name: posts
    label: 博客文章
    type: collection
    path: posts        # Astro Content Collection 路径
    filename:
      template: "{primary}.md"    # 以 slugified 标题作为文件名
      field: create               # 新建时可编辑文件名
    view:
      primary: title
      fields: [title, published, draft, tags]
      sort: [published, priority]
      default:
        sort: published
        order: desc



    # ── 字段定义 ──────────────────────────────
    fields:
      # ---------- 核心字段 ----------
      - name: title
        label: 标题
        type: string
        required: true
        options:
          maxlength: 120

      - name: published
        label: 发布日期
        type: date
        required: true
        options:
          format: yyyy-MM-dd

      - name: updated
        label: 更新日期
        type: date
        options:
          format: yyyy-MM-dd

      - name: draft
        label: 草稿
        type: boolean
        default: false

      - name: description
        label: 文章摘要
        type: text
        description: 用于 SEO 和列表展示，留空则自动截取正文前段
        options:
          maxlength: 300

      - name: image
        label: 封面图片
        type: image
        options: 
         media: images

      # ---------- 分类与标签 ----------
      - name: tags
        label: 标签
        type: reference
        description: 文章标签，可多选
        options:
          collection: tags
          multiple: true
          value: "{slug}"
          label: "{title}"

      - name: category
        label: 分类
        type: reference
        description: 文章所属分类，留空则不显示
        options:
          collection: categories
          value: "{slug}"
          label: "{title}"
        
      # ---------- 展示控制 ----------
      - name: pinned
        label: 置顶
        type: boolean
        default: false

      - name: priority
        label: 优先级
        type: number
        description: 数值越大排序越靠前（0–100）
        options:
          min: 0
          max: 100

      - name: comment
        label: 开启评论
        type: boolean
        default: true

      # ---------- 加密 ----------
      - name: encrypted
        label: 加密文章
        type: boolean
        default: false

      - name: password
        label: 访问密码
        type: string
        description: 设置后读者需输入密码才能查看文章

      - name: passwordHint
        label: 密码提示
        type: string
        description: 显示在密码输入框旁的提示文字

      # ---------- URL 控制 ----------
      - name: alias
        label: 别名
        type: string
        description: 文章的短别名，用于生成简洁 URL

      - name: permalink
        label: 自定义固定链接
        type: string
        description: 优先级高于 alias，覆盖默认 URL 规则

      # ---------- 正文 ----------
      - name: body
        label: 正文
        type: rich-text
        options:
          format: markdown           # 以 Markdown 格式存储
          media: images              # 关联上方 media 配置，支持插入图片

  

  - name: tags
    label: 标签管理
    type: collection
    path: data/tags
    filename:
      template: "{primary}.md"
      field: create
    view:
      primary: title
      fields: [title, slug]
    fields:
      - name: title
        label: 标签名
        type: string
        required: true
      - name: slug
        label: 标识符
        type: string
        required: true
        description: 写入 frontmatter 的值

  - name: categories
    label: 分类管理
    type: collection
    path: data/categories
    filename:
      template: "{primary}.md"
      field: create
    view:
      primary: title
      fields: [title, slug]
    fields:
      - name: title
        label: 分类名
        type: string
        required: true
      - name: slug
        label: 标识符
        type: string
        required: true
        description: 写入 frontmatter 的值

  - name: friends
    label: 友链
    type: file
    path: data/friends.ts
    format: code
  - name: about
    label: 关于
    type: file
    path: spec/about.md
    format: code


```

## 手搓配置

最小化配置：

```yml
media: media
content:
  - name: pages
    label: Pages
    type: collection
    path: docs
    fields:
      - name: title
        type: string
      - name: body
        type: rich-text
```

各配置说明如下：


| 配置项 | 说明 |
| ------------------------------------------------- | ------------------------ |
| media: media | 定义了媒体文件夹，也就是你上传的图片 |
| content | 定义了这是一个可编辑的内容 |
| name / label | 集合的标识名和显示标签 |
| type: collection | 表示这是一个内容集合（比如你的posts文件夹） |
| path: docs | 你存文章的文件夹路径 |
| fields | 定义front-matter |
| 你可以根据自己主题得需求来更改`fields`的内容，以下是pagescms支持的全部类型和说明： |  |



| 类型 | 说明 |
| ---------------------------------------- | ---------------------------------------------- |
| string | 纯文本 |
| text | 多行纯文本 |
| rich-text | 富文本编辑器，用于文章正文 |
| code | 带语法高亮的代码编辑器 |
| number | 整数或者小数输入 |
| boolean | 开关切换（true/false） |
| date | 日期选择 |
| select | 从预定义选项中选择 |
| reference | 引用另一个集合中的条目 |
| image | 选择或上传图片 |
| file | 选择或上传非图片文件 |
| object | 将多个子字段嵌套在一个键下，适用于 SEO、地址、作者信息等结构化数据 |
| block | 页面构建器模式，允许编辑者从多种不同结构的对象中选择，适用于 Landing Page 分区 |
| uuid | 自动生成 UUID v4，适用于稳定唯一 ID |
| 只需要按照自己的需求拼装 `.pages.yml`.后放到仓库根目录下就好了😎 |  |


## 自动生成配置

~~你好claude~~，~~~~请按照我的博客的content~~.~~~~config~~.~~ts文件的内容配置pagescms的配置文件~~

交给万能的ai

# 关联仓库

写完配置文件后重命名为`.pages.yml`，打开[PagesCMS官网](https://app.pagescms.org)关联你的仓库就行了。

~~尽情享受吧~~

## 注意事项

### 一定要记得保存

因为pagecms没有数据库，==一切都基于GitHub==，所以编辑后一定要记得点报错提交更改，~~你也不想辛苦码了半天的字全都消失吧~~

### 自动部署

如果你的仓库有自动部署，那不断提交草稿可能会导致你的免费额度不断消失，建议关掉自动部署，改为actions触发，可以把触发按钮放到pagescms页面上，~~我懒就不写了~~

---

END