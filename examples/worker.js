/**
 * wechat-api-proxy — Cloudflare Worker
 *
 * 功能：转发微信 API 请求，解决家庭宽带动态 IP 无法加入白名单的问题。
 * 使用方式：将 Worker 出口 IP 段加入微信后台 IP 白名单即可。
 *
 * 部署：CF Dashboard → Workers & Pages → 创建 Worker → 粘贴此代码
 */

// 微信 API 基础地址
const WECHAT_API_BASE = 'https://api.weixin.qq.com'

export default {
  async fetch(request, env) {
    // 健康检查
    const url = new URL(request.url)
    if (url.pathname === '/' || url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', message: 'wechat-api-proxy running' }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    // 构建目标 URL（去掉自定义域名前缀，追加到微信 API）
    const targetUrl = WECHAT_API_BASE + url.pathname + url.search
    const headers = new Headers(request.headers)

    // 转发请求
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: request.body,
    })

    // 添加 CORS 头（允许前端跨域调用）
    const respHeaders = new Headers(response.headers)
    respHeaders.set('Access-Control-Allow-Origin', '*')
    respHeaders.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    respHeaders.set('Access-Control-Allow-Headers', 'Content-Type')

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: respHeaders,
    })
  },
}
