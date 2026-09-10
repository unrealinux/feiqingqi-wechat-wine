/**
 * 微信 access_token 获取连通性测试
 *
 * 凭据一律从 .env 读取，禁止硬编码。
 *   WECHAT_APPID / WECHAT_SECRET
 */
require('dotenv').config();
const https = require('https');

const appId = process.env.WECHAT_APPID;
const appSecret = process.env.WECHAT_SECRET;

if (!appId || !appSecret) {
  console.error('❌ 缺少 WECHAT_APPID / WECHAT_SECRET，请先在 .env 中配置');
  process.exit(1);
}

const path =
  '/cgi-bin/token?grant_type=client_credential' +
  `&appid=${encodeURIComponent(appId)}` +
  `&secret=${encodeURIComponent(appSecret)}`;

const req = https.request(
  {
    hostname: 'api.weixin.qq.com',
    port: 443,
    path,
    method: 'GET',
    timeout: 5000,
  },
  (res) => {
    let d = '';
    res.on('data', (c) => (d += c));
    res.on('end', () => {
      // 避免把 secret 回显到日志；仅打印结果
      console.log(d);
    });
  }
);

req.on('error', (e) => console.log('Error:', e.message));
req.on('timeout', () => {
  console.log('Timeout');
  req.destroy();
});
req.end();
