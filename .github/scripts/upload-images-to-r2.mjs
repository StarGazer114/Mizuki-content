/**
 * upload-images-to-r2.mjs
 *
 * 功能：
 *   1. 读取由 Pages CMS Actions 触发时传入的文章路径（FILE_PATH）
 *   2. 解析文章 frontmatter 与正文，找出所有需要上传的图片
 *   3. 支持的图片来源：
 *      - 仓库内相对/绝对路径  (e.g. /images/foo.jpg  ./cover.jpg)
 *      - 本地绝对路径（Windows MarkText 产生）→ 无法处理，打印警告
 *      - 已是外部 HTTP 链接   → 跳过（保持原样）
 *   4. 将可处理的图片以 S3 API 上传至 Cloudflare R2
 *      路径规则：<R2_PATH_PREFIX>/<YYYY>/<MM>/<DD>/<filename>
 *   5. 将文章中所有旧路径替换为 R2 公开 URL，写回文件
 *
 * 所需环境变量（仓库 Variables / Secrets）：
 *   R2_ENDPOINT          - S3 兼容端点，如 https://<ACCOUNT_ID>.r2.cloudflarestorage.com
 *   R2_BUCKET            - 存储桶名称
 *   R2_ACCESS_KEY_ID     - R2 API 令牌 Access Key ID       (仓库 Variable)
 *   R2_SECRET_ACCESS_KEY - R2 API 令牌 Secret Access Key   (仓库 Secret)
 *   R2_PUBLIC_URL        - 图片公开访问域名，如 https://img.bear556.top
 *   R2_PATH_PREFIX       - 上传路径前缀（可为空），如留空则路径为 YYYY/MM/DD/filename
 *   FILE_PATH            - 由 workflow 注入，当前文章相对于仓库根目录的路径
 */

import fs from 'fs'
import path from 'path'
import { createReadStream, statSync } from 'fs'
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import matter from 'gray-matter'

// ─── 工具函数 ────────────────────────────────────────────────────────────────

/** 读取必需的环境变量，缺失时立即报错退出 */
function requireEnv(name) {
  const val = process.env[name]
  if (!val) {
    console.error(`❌ 缺少必需的环境变量：${name}`)
    process.exit(1)
  }
  return val
}

/** 根据文件扩展名返回 MIME type */
function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase()
  const map = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.avif': 'image/avif',
  }
  return map[ext] ?? 'application/octet-stream'
}

/** 生成今天的 YYYY/MM/DD 目录段 */
function todayPath() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}/${m}/${d}`
}

/** 判断是否是 Windows 本地绝对路径（MarkText 等编辑器产生） */
function isWindowsAbsPath(p) {
  return /^[A-Za-z]:[/\\]/.test(p) || p.startsWith('\\\\')
}

/** 判断是否是外部 HTTP 链接 */
function isHttpUrl(p) {
  return /^https?:\/\//i.test(p)
}

/**
 * 将图片路径解析为仓库内的绝对文件路径
 * @param {string} imgPath   - 文章中写的路径
 * @param {string} articleAbs - 文章文件的绝对路径
 * @param {string} repoRoot   - 仓库根目录绝对路径
 * @returns {string|null}     - 本地绝对路径，无法解析时返回 null
 */
function resolveLocalPath(imgPath, articleAbs, repoRoot) {
  if (imgPath.startsWith('/')) {
    // /images/foo.jpg → 仓库根目录下的绝对路径
    return path.join(repoRoot, imgPath)
  }
  // ./foo.jpg 或 foo.jpg → 相对于文章所在目录
  return path.resolve(path.dirname(articleAbs), imgPath)
}

// ─── S3 上传 ─────────────────────────────────────────────────────────────────

/**
 * 检查 R2 中是否已存在该对象（避免重复上传）
 */
async function existsInR2(s3, bucket, key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }))
    return true
  } catch {
    return false
  }
}

/**
 * 上传单张图片至 R2
 * @returns {string} 上传后的公开 URL
 */
async function uploadToR2(s3, bucket, localPath, r2Key, publicUrl) {
  const mimeType = getMimeType(localPath)
  const fileStream = createReadStream(localPath)
  const fileSize = statSync(localPath).size

  await s3.send(new PutObjectCommand({
    Bucket: bucket,
    Key: r2Key,
    Body: fileStream,
    ContentType: mimeType,
    ContentLength: fileSize,
  }))

  const base = publicUrl.replace(/\/$/, '')
  return `${base}/${r2Key}`
}

// ─── 图片扫描 ────────────────────────────────────────────────────────────────

/**
 * 从 Markdown 字符串中提取所有 ![alt](url) 中的图片路径
 * 同时匹配 HTML <img src="..."> 标签
 * @returns {{ original: string, path: string }[]}
 */
function extractMarkdownImages(content) {
  const results = []
  // Markdown 图片语法：![任意](路径 "可选title")
  const mdReg = /!\[([^\]]*)\]\(([^)\s"]+)(?:\s+"[^"]*")?\)/g
  let m
  while ((m = mdReg.exec(content)) !== null) {
    results.push({ original: m[0], path: m[2] })
  }
  // HTML img 标签
  const htmlReg = /<img\s[^>]*src=["']([^"']+)["'][^>]*>/gi
  while ((m = htmlReg.exec(content)) !== null) {
    results.push({ original: m[0], path: m[1] })
  }
  return results
}

// ─── 主流程 ──────────────────────────────────────────────────────────────────

async function main() {
  // 1. 读取环境变量
  const filePath       = requireEnv('FILE_PATH')
  const endpoint       = requireEnv('R2_ENDPOINT')
  const bucket         = requireEnv('R2_BUCKET')
  const accessKeyId    = requireEnv('R2_ACCESS_KEY_ID')
  const secretKey      = requireEnv('R2_SECRET_ACCESS_KEY')
  const publicUrl      = requireEnv('R2_PUBLIC_URL')
  const pathPrefix     = (process.env.R2_PATH_PREFIX ?? '').replace(/^\/|\/$/g, '')

  // 2. 定位文件
  // 脚本在 .github/scripts/ 下运行，需上溯两级到仓库根
  const repoRoot   = path.resolve(process.cwd(), '../../')
  const articleAbs = path.join(repoRoot, filePath)

  if (!fs.existsSync(articleAbs)) {
    console.error(`❌ 找不到文章文件：${articleAbs}`)
    process.exit(1)
  }

  console.log(`\n📄 处理文章：${filePath}`)

  // 3. 解析文章
  const raw      = fs.readFileSync(articleAbs, 'utf8')
  const parsed   = matter(raw)
  let   content  = parsed.content       // 正文（frontmatter 已剥离）
  const fmData   = parsed.data          // frontmatter 对象
  let   fmDirty  = false                // frontmatter 是否被修改

  // 4. 初始化 S3 客户端
  const s3 = new S3Client({
    region: 'auto',
    endpoint,
    credentials: { accessKeyId, secretAccessKey: secretKey },
  })

  // 5. 构建今天的日期路径
  const datePath = todayPath()

  // 统计
  let uploaded = 0
  let skipped  = 0
  let warned   = 0

  // ── 5a. 处理正文中的图片 ──────────────────────────────────────────────────
  const bodyImages = extractMarkdownImages(content)
  console.log(`\n🔍 正文中发现 ${bodyImages.length} 处图片引用`)

  for (const img of bodyImages) {
    const imgPath = img.path

    // 外部链接：跳过
    if (isHttpUrl(imgPath)) {
      console.log(`  ⏭️  跳过外链：${imgPath}`)
      skipped++
      continue
    }

    // Windows 本地路径：警告
    if (isWindowsAbsPath(imgPath)) {
      console.warn(`  ⚠️  本地绝对路径无法处理（请手动上传）：${imgPath}`)
      warned++
      continue
    }

    // 解析为仓库内绝对路径
    const localPath = resolveLocalPath(imgPath, articleAbs, repoRoot)
    if (!fs.existsSync(localPath)) {
      console.warn(`  ⚠️  文件不存在，跳过：${localPath}`)
      warned++
      continue
    }

    // 构造 R2 对象 key
    const filename = path.basename(localPath)
    const r2Key    = pathPrefix
      ? `${pathPrefix}/${datePath}/${filename}`
      : `${datePath}/${filename}`

    // 检查是否已上传（幂等）
    if (await existsInR2(s3, bucket, r2Key)) {
      const newUrl = `${publicUrl.replace(/\/$/, '')}/${r2Key}`
      console.log(`  ♻️  R2 已存在，直接替换链接：${r2Key}`)
      content = content.replaceAll(imgPath, newUrl)
      skipped++
      continue
    }

    // 上传
    try {
      const newUrl = await uploadToR2(s3, bucket, localPath, r2Key, publicUrl)
      console.log(`  ✅ 上传成功：${filename} → ${newUrl}`)
      content = content.replaceAll(imgPath, newUrl)
      uploaded++
    } catch (err) {
      console.error(`  ❌ 上传失败：${filename}`, err.message)
      warned++
    }
  }

  // ── 5b. 处理 frontmatter image 字段 ──────────────────────────────────────
  if (fmData.image && typeof fmData.image === 'string') {
    const imgPath = fmData.image
    console.log(`\n🖼️  封面图片：${imgPath}`)

    if (isHttpUrl(imgPath)) {
      console.log(`  ⏭️  跳过外链封面图`)
    } else if (isWindowsAbsPath(imgPath)) {
      console.warn(`  ⚠️  封面图为本地绝对路径，无法处理：${imgPath}`)
      warned++
    } else {
      const localPath = resolveLocalPath(imgPath, articleAbs, repoRoot)
      if (!fs.existsSync(localPath)) {
        console.warn(`  ⚠️  封面图文件不存在，跳过：${localPath}`)
        warned++
      } else {
        const filename = path.basename(localPath)
        const r2Key    = pathPrefix
          ? `${pathPrefix}/${datePath}/${filename}`
          : `${datePath}/${filename}`

        if (await existsInR2(s3, bucket, r2Key)) {
          const newUrl = `${publicUrl.replace(/\/$/, '')}/${r2Key}`
          console.log(`  ♻️  R2 已存在，直接替换封面链接：${r2Key}`)
          fmData.image = newUrl
          fmDirty = true
        } else {
          try {
            const newUrl = await uploadToR2(s3, bucket, localPath, r2Key, publicUrl)
            console.log(`  ✅ 封面上传成功：${filename} → ${newUrl}`)
            fmData.image = newUrl
            fmDirty = true
            uploaded++
          } catch (err) {
            console.error(`  ❌ 封面上传失败：${filename}`, err.message)
            warned++
          }
        }
      }
    }
  }

  // 6. 写回文件
  const bodyChanged = content !== parsed.content
  if (bodyChanged || fmDirty) {
    const newRaw = matter.stringify(content, fmData)
    fs.writeFileSync(articleAbs, newRaw, 'utf8')
    console.log(`\n💾 文章已更新写回：${filePath}`)
  } else {
    console.log(`\nℹ️  文章无需修改`)
  }

  // 7. 汇总
  console.log(`\n─────────────────────────────────`)
  console.log(`📊 汇总：上传 ${uploaded} 张 | 跳过 ${skipped} 张 | 警告 ${warned} 处`)
  if (warned > 0) {
    console.log(`⚠️  有警告项，请检查上方日志`)
  }
  console.log(`─────────────────────────────────\n`)
}

main().catch(err => {
  console.error('❌ 脚本执行异常：', err)
  process.exit(1)
})
