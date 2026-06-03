# 更新日志

## v1.0.1 (2026-06-03)

🐛 修复 + 文档完善

### 修复
- **WeChat API `grant_type` 错误**：之前写成 `client_credentials`（多一个 s），正确应为 `client_credential`，导致 `token` 接口返回 40002
- **IP 白名单补全**：添加 CF Worker 出口段 `104.16.0.0/13`（覆盖 `104.23.x.x` 段），微信 API 代理完整可用
- 实际跑通完整流程：识图 → 写文 → 上传微信 CDN → 推草稿箱，验证端到端可用

### 文档
- **AI 工作流独立文档**：新增 [`AI助手工作流.md`](./AI助手工作流.md)，别人拿了也能让 AI 助手配合发公众号
- **CF Worker 部署注释**：`examples/worker.js` 顶部加完整部署步骤 + 目的说明
- **README 重构**：前置准备移到安装之前，配置步骤简化到 4 步

## v1.0.0 (2026-06-03)

🎉 首发版本：公众号排版器

### 功能
- 19 种排版风格：默认 / 晚点 / FT / Claude / 技术 / NYT / Jony Ive / Apple 极简 / 原研哉·空 / 高迪·有机 / Guardian / Nikkei / 焦橙 / Le Monde / Stripe / 橙 / 绛/绯/抹茶
- Markdown 实时预览（手机/电脑双视图）
- 一键复制到公众号（内联样式，不丢格式）
- 上传 .md 文件 / 加载示例文章
- 代码语法高亮（highlight.js）
- 表格、引用、列表、图片完整支持
- 纯前端，单 HTML 文件，零依赖

### 文档
- 完整的微信 API 前置配置说明（AppID/AppSecret/IP 白名单）
- Cloudflare Worker 代理部署指南（解决家庭宽带动态 IP 问题）
- 三种使用场景：AI 全自动 / 手动排版 / 存档暂存
- 工作流程图
