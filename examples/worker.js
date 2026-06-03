/**
 * wechat-api-proxy — Cloudflare Worker
 * 
 * ┌─────────────────────────────────────────────────────────────┐
 * │ 🎯 目的                                                      │
 * │                                                              │
 * │ 微信公众平台 API 要求调用方 IP 必须在白名单内。               │
 * │ 但家庭宽带是动态 IP，今天能用、明天变天就废了。               │
 * │ 这个 Worker 充当固定中转点：你把请求发给 Worker，             │
 * │ Worker 转发给微信 API。你只需要把 Worker 的出口 IP 段         │
 * │ 加入微信白名单一次，以后服务器 IP 怎么变都不影响。            │
 * └─────────────────────────────────────────────────────────────┘
 * 
 * ═══════════════════════════════════════════════════════════════
 * 📋 部署方法（3分钟搞定）
 * ═══════════════════════════════════════════════════════════════
 * 
 * 1️⃣ 登录 Cloudflare Dashboard → Workers & Pages
 * 2️⃣ 点「创建 Worker」→ 选「Hello World」模板
 * 3️⃣ 把编辑器里的代码全部删掉，粘贴本文件全部内容
 * 4️⃣ 点「部署」（右上角蓝色按钮）
 * 5️⃣ 点「查看」测试：https://你的worker名.workers.dev/health
 *    应该返回 {"status":"ok","message":"wechat-api-proxy running"}
 * 
 * 🌐 可选：绑定自定义域名
 * 1️⃣ Worker 详情页 → 触发器 → 自定义域名 → 添加域名
 * 2️⃣ 填 wechat-api.你的域名.com
 * 3️⃣ DNS 会自动添加 CNAME 记录
 * 
 * 🔧 微信后台配置
 * 1️⃣ 公众号后台 → 设置与开发 → 基本配置
 * 2️⃣ IP白名单添加 Cloudflare 出口 IP 段：
 *    162.158.0.0/15
 *    172.64.0.0/13
 *    172.68.0.0/16
 * 3️⃣ API 请求地址改成你的 Worker 域名：
 *    原：https://api.weixin.qq.com/cgi-bin/token
 *    改：https://你的域名/cgi-bin/token
 * 
 * ⚠️ 注意
 * - 不支持 IPv6，只填 IPv4 地址
 * - 首次部署后 Worker 可能要等 1-2 分钟生效
 * - 自定义域名需要在 Cloudflare 开启代理（橙色云）
 * ═══════════════════════════════════════════════════════════════
 */

// 微信 API 基础地址（不用改）
const WECHAT_API_BASE = 'https://api.weixin.qq.com'

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    // 健康检查：部署后先访问 /health 确认能用
    if (url.pathname === '/' || url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', message: 'wechat-api-proxy running' }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      })
    }

    // 转发到微信 API（例如 /cgi-bin/token → https://api.weixin.qq.com/cgi-bin/token）
    const targetUrl = WECHAT_API_BASE + url.pathname + url.search
    const headers = new Headers(request.headers)

    const response = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: request.body,
    })

    // 加 CORS 头，前端跨域调用用
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
