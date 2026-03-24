process.env.HTTP_PROXY = '';
process.env.HTTPS_PROXY = '';
require('dotenv').config();
const axios = require('axios');
axios.defaults.proxy = false;
const Parser = require('rss-parser');
const sharp = require('sharp');
const FormData = require('form-data');
const config = require('./config');
const parser = new Parser({ timeout: 15000 });

const today = new Date();
const date = {
  full: today.toISOString().slice(0, 10),
  display: `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`
};

async function main() {
  console.log('📰 生成行业快讯...');
  console.log('日期:', date.display);
  console.log('');

  // 获取新闻
  console.log('获取最新资讯...');
  const sources = [
    { name: 'The Drinks Business', url: 'https://www.thedrinksbusiness.com/feed/' },
    { name: 'VinePair', url: 'https://vinepair.com/feed/' }
  ];
  
  const allNews = [];
  for (const s of sources) {
    try {
      const feed = await parser.parseURL(s.url);
      const items = (feed.items || []).slice(0, 5);
      for (const item of items) {
        if (item.title) {
          allNews.push({
            title: item.title,
            source: s.name,
            pubDate: item.pubDate ? new Date(item.pubDate) : new Date()
          });
        }
      }
      console.log(`  ✅ ${s.name}: ${items.length} 条`);
    } catch (e) {
      console.log(`  ⚠️ ${s.name}: ${e.message}`);
    }
  }
  
  allNews.sort((a, b) => b.pubDate - a.pubDate);
  console.log(`总计: ${allNews.length} 条\n`);

  // 生成封面
  console.log('生成封面...');
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#c41e3a"/>
        <stop offset="50%" style="stop-color:#8b2252"/>
        <stop offset="100%" style="stop-color:#4a1a2e"/>
      </linearGradient>
    </defs>
    <rect width="900" height="383" fill="url(#g)"/>
    <rect x="0" y="260" width="900" height="123" fill="rgba(0,0,0,0.6)"/>
    <text x="30" y="310" font-family="Microsoft YaHei" font-size="32" font-weight="bold" fill="#D4AF37">📰 ${date.display} 行业快讯</text>
    <text x="30" y="355" font-family="Microsoft YaHei" font-size="16" fill="rgba(255,255,255,0.9)">实时更新</text>
  </svg>`;
  const coverBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  console.log('  ✅ 封面已生成\n');

  // 生成文章
  const topNews = allNews.slice(0, 5);
  const headlines = topNews.slice(0, 3).map(n => n.title.slice(0, 25)).join('、');
  
  const article = {
    title: `📰 ${date.display} 行业快讯：${headlines.slice(0, 50)}...`,
    author: '资讯分析师',
    digest: `${date.display}最新葡萄酒行业资讯`,
    content: `<section style="margin-bottom:15px"><p style="color:#999;text-align:center">${date.display} | 行业快讯 | 实时更新</p></section>

<section style="background:linear-gradient(135deg,#c41e3a,#8b2252);padding:20px;border-radius:8px;margin-bottom:20px">
<p style="color:#fff;font-size:18px;font-weight:bold;margin-bottom:10px">🔥 今日热点</p>
${topNews.slice(0, 2).map(n => `<p style="color:#f5e6d3;font-size:15px;line-height:1.8;margin-bottom:10px"><strong>${n.title}</strong><br/><span style="color:#ddd;font-size:12px">来源：${n.source} | ${n.pubDate.toISOString().slice(0, 10)}</span></p>`).join('\n')}
</section>

<section style="margin-bottom:20px">
<h2 style="color:#2d1424;font-size:18px;border-left:4px solid #c41e3a;padding-left:10px;margin-bottom:15px">📊 最新资讯</h2>
<section style="background:#faf8f5;padding:15px;border-radius:6px">
${topNews.map(n => `<p style="color:#333;font-size:14px;line-height:1.7;margin-bottom:10px"><strong>• ${n.title}</strong><br/><span style="color:#999;font-size:12px">${n.source} | ${n.pubDate.toISOString().slice(0, 10)}</span></p>`).join('\n')}
</section>
</section>

<section style="background:#e8f5e9;padding:15px;border-radius:6px;margin-bottom:20px">
<p style="color:#2e7d32;font-weight:bold;margin-bottom:10px">📌 明日关注</p>
<p style="color:#333;font-size:14px;line-height:1.7">• 持续关注Liv-ex指数变化<br/>• 关注拍卖行最新成交数据</p>
</section>

<section style="text-align:center;padding:15px">
<p style="color:#999;font-size:12px">免责声明：本快讯仅供参考，不构成投资建议<br/>发布日期：${date.display}</p>
</section>`
  };

  console.log('标题:', article.title);
  console.log('');

  // 发布到微信
  console.log('发布到微信...');
  const tokenResp = await axios.get(config.publish.endpoints.token, {
    params: { grant_type: 'client_credential', appid: config.publish.appId, secret: config.publish.appSecret },
    timeout: 10000
  });
  const token = tokenResp.data.access_token;
  console.log('  ✅ Token获取成功');

  const formData = new FormData();
  formData.append('media', coverBuffer, { filename: 'cover.png', contentType: 'image/png' });
  const uploadResp = await axios.post(
    `https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${token}&type=image`,
    formData, { headers: formData.getHeaders(), timeout: 30000 }
  );
  const mediaId = uploadResp.data.media_id;
  console.log('  ✅ 封面上传成功');

  const draftResp = await axios.post(
    `https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${token}`,
    { articles: [{ ...article, thumb_media_id: mediaId, need_open_comment: 0, only_fans_can_comment: 0 }] },
    { headers: { 'Content-Type': 'application/json' }, timeout: 30000 }
  );

  console.log('');
  console.log('='.repeat(60));
  console.log('✅ 发布成功！');
  console.log('草稿ID:', draftResp.data.media_id);
  console.log('标题:', article.title);
  console.log('='.repeat(60));
}

main().catch(e => console.log('❌ 错误:', e.message));
