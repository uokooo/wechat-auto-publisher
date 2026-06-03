# 📱 公众号排版神器

专为微信公众号文章排版设计的本地 Markdown 编辑器。**19 种精美风格**，实时预览，一键复制到公众号。

![screenshot](https://github.com/uokooo/wechat-article-editor/raw/main/screenshot.png)

## ✨ 功能特点

- **19 种风格**：默认公众号 / 晚点 / 金融时报 / Claude / 技术 / 优雅简约 / 深度阅读 / 纽约时报 / Jony Ive / Medium / Apple 极简 / 原研哉·空 / Hische·编辑部 / 安藤·清水 / 高迪·有机 / Guardian 卫报 / Nikkei 日経 / 焦橙文档 / Le Monde 世界报
- **实时编辑**：左侧写 Markdown，右侧即时预览
- **文件上传**：支持上传 `.md` 文件
- **一键复制**：点击「复制到公众号」，到微信编辑器 Ctrl+V 即可（`ClipboardItem` 富文本格式）
- **手机/电脑预览**：切换模拟手机或桌面视图
- **自动保存**：内容自动存入浏览器 LocalStorage
- **纯本地运行**：打开 HTML 即用，无需服务器

## 🚀 使用方法

1. 直接在浏览器打开 `index.html`
2. 左侧粘贴或输入 Markdown 内容
3. 点击左侧风格按钮切换主题
4. 右侧预览效果
5. 底部点「**复制到公众号**」
6. 到微信公众号编辑器按 **Ctrl+V** 粘贴

## 📦 项目结构

```
wechat-article-editor/
├── index.html       # 主程序（单文件，含全部 CSS/JS/样式）
├── LICENSE          # MIT 许可证
└── README.md        # 本文件
```

## ⚙️ 技术细节

- 纯前端 HTML + CSS + JavaScript，**零依赖**（仅运行时需加载 markdown-it 和 highlight.js）
- 复制到公众号使用 **`ClipboardItem` API** 写入 `text/html` 格式，非纯文本
- 全部样式使用 **内联 `style=""`**（微信编辑器会过滤 `<style>` 标签）
- 自动去除 `!important`（内联属性不支持）

## 🧩 风格来源

风格设计参考了 [benx.ai 公众号编辑器](https://editor.benx.ai/)（开源：https://github.com/littleben/wechat_editor），在此致谢。

## 📄 License

[MIT](LICENSE)
