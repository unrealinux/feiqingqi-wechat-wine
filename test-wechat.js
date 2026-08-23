const http = require('http');
const req = http.request({
  hostname: 'api.weixin.qq.com',
  port: 80,
  path: '/cgi-bin/token?grant_type=client_credential&appid=REDACTED_WECHAT_APPID&secret=REDACTED_WECHAT_SECRET',
  method: 'GET',
  timeout: 5000
}, (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => console.log(d));
});
req.on('error', e => console.log('Error:', e.message));
req.on('timeout', () => console.log('Timeout'));
req.end();
