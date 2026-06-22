# 🤖 公众号文章发布 — AI 助手工作流

> 这是一份给 AI 助手的指令文档。如果你的 AI 助手支持自定义技能/工作流，把这份说明喂给它，它就知道怎么帮你发公众号文章了。

---

## 🎯 触发口令

用户说以下任意一句即可激活：

- `发公众号`
- `写公众号`
- `发照片到公众号`
- `发文章到公众号`

纯文字（不发图）的口令：**`无图`**

---

## 🔄 完整工作流

```
用户发口令 ──→ AI回应"收到，等待接收图片"
      │
      ├── 有图 ──→ 用户发照片 → AI逐张压缩 → 用户说"发完了"
      │
      └── 无图 ──→ 直接进入写作
                      │
                      ▼
              AI写文章（识图配文 + 署名作者 + 标记原创）
                      │
                      ▼
              用户选操作（回复 1、2 或 3）
              ┌─────────┼─────────┐
              ▼         ▼         ▼
            ①发表     ②美化     ③存档
```

---

## 📋 三选项详解

### ① 发表 — 推送到公众号草稿箱

1. 将 Markdown 转换为公众号兼容格式
2. 通过微信 API 创建草稿（需提前配好 API 凭证和 IP 白名单）
   - ⚠️ 草稿 `POST /cgi-bin/draft/add` 的 JSON body 字段名是 **`articles`**（数组），不是 `news_item`
   - 示例：
     ```json
     {"articles":[{"title":"...","author":"uoko","content":"<section>...</section>",
       "thumb_media_id":"...","need_open_comment":0,"only_fans_can_comment":0,"is_original":1}]}
     ```
3. 通知用户：文章已推到草稿箱，请在手机 app 上手动发布

> ⚠️ **前提条件**：需要配置好微信公众平台 API（详见下方【前置准备】）

### ② 美化 — 打开排版器手动发布

1. 将文章的 Markdown 写入排版器
2. 发链接给用户：请打开排版器 → 选风格 → 复制 → Ctrl+V 到公众号
3. AI 停手，等待用户下次指令

> 排版器是单 HTML 文件，支持 19 种风格、实时预览、一键复制到公众号。

### ③ 存档 — 暂存待发

1. 将文章中的图片上传到微信 CDN（获取永久链接）
2. 生成纯 HTML 归档文件
3. 存档后可后续调入排版器或直接发表

---

## ⚠️ 前置准备（用于 ①发表）

在启用自动发表功能前，需要在微信公众平台完成以下配置：

### 1. 获取 API 凭证

- 登录 [微信公众平台](https://mp.weixin.qq.com) → 设置与开发 → 基本配置
- 记下 **AppID**（开发者 ID）
- 点击「重置」生成 **AppSecret**（开发者密码）—— 保存好，关闭后不再显示

### 2. 配置 IP 白名单

在同一个页面，点击 IP 白名单的「配置」：

- **固定服务器 IP** → 直接添加服务器公网 IP
- **家庭宽带动态 IP** → 用 Cloudflare Worker 代理，添加 CF 出口 IP 段：
  - `162.158.0.0/15`
  - `172.64.0.0/13`
- 不支持 IPv6，只填 IPv4

### 3. 创建 API 代理（可选）

如果服务器 IP 不固定，部署一个 Cloudflare Worker 做中转：

1. CF Dashboard → Workers & Pages → 创建 Worker
2. 粘贴以下代码（[完整版见 examples/worker.js](./examples/worker.js)）：

```javascript
const WECHAT_API_BASE = 'https://api.weixin.qq.com'
export default {
  async fetch(request) {
    const url = new URL(request.url)
    if (url.pathname === '/health') return new Response('ok')
    const target = WECHAT_API_BASE + url.pathname + url.search
    return fetch(target, { method: request.method, headers: request.headers, body: request.body })
  }
}
```

3. 绑定自定义域名，把 Worker 出口 IP 加入微信白名单

### 4. 写入配置

将 `APP_ID` 和 `APP_SECRET` 写入系统环境变量或配置文件，AI 助手的 API 调用代码从中读取。

---

## 🧠 AI 助手需要知道的规则

### 图片处理

- 每张照片存为 `MMDD-N.jpg`（如 `0602-1.jpg`）
- 压缩：长边 1600px，质量自适应，单张 < 1MB
- 所有图片最终上传到微信 CDN（`mmbiz.qpic.cn`），不使用外部图床

### 文章规范

| 项目 | 要求 |
|:----|:------|
| 署名作者 | `uoko` |
| 原创标记 | 始终开启 |
| 二维码 | 使用微信 CDN 永久链接 |
| 封面图 | 单独上传到素材库获取 media_id |

### 排版器复制规则（重要）

- ❌ 微信编辑器会过滤 `<style>` 标签
- ✅ 必须用 **内联 `style=""` 属性** 代替 CSS 类
- ❌ 内联属性中 `!important` **无效**
- ✅ 使用 `ClipboardItem` API 写入 `text/html` 格式粘贴
- ✅ 同时提供 `text/plain` 作为降级

### API 调用

- Token 有效期 7200 秒，每次操作前刷新
- 使用 POST `stable_token` 而不是 GET `token`
- 图片分两种上传：正文图用 `uploadimg`，封面图用 `add_material`

---

## ❗ 已知坑

| 坑 | 原因 | 解决 |
|:---|:-----|:-----|
| style 标签被清 | 微信编辑器过滤 | 转内联 style |
| !important 无效 | 内联属性不支持 | 去掉 !important |
| hljs 未定义 | ES 模块不设全局变量 | 改用 UMD 版本 |
| 复制显示源代码 | 只写了 text/plain | 加 text/html MIME |
| SVG onclick 不触发 | 浏览器 SVG 事件问题 | 用 div 浮层覆盖 |
| AppSecret 过期 | 访问开发者平台会重置 | 用户重新复制 |
| 订阅号不能自动发布 | API 限制 | 推草稿箱手动发 |

---

## 🚀 快速开始（给人类用户）

1. 找个支持工作流的 AI 助手
2. 把本文件内容喂给它（或配置为自定义技能）
3. 配置好微信 API 凭证和 IP 白名单（如果用①发表）
4. 对着它说 **"发公众号"**

搞定。

## 文章底部固定排版

每次写文章时，底部必须包含以下内容（缺一不可）：

```
[二维码图片]
长按识别关注 · U.Art摄影
摄影 | uoko
*原创声明：本文内容为原创，未经授权禁止转载。U.Art摄影 出品。*
```

署名是「摄影 | uoko」，不是单纯「uoko」或「署名：uoko」。
二维码用微信 CDN 链接（不要用 base64 嵌入）。
这部分在写作阶段就写进文章末尾，不要等发表前才补。
