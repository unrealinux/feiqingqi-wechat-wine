const https = require('https');

const token = '102_ptBB39ImBk1V4mGc-hBqjhANZ_9c0tL_b4qzUvjnHfF9YfikpkHTC5qFxmO1PO2gx-4cdNInor93YuN1TpihZAaATtC39qrOLfFYZhxh5Hv-MfyavMsfiXHAoskNXRdADAEOI';
const mediaId = '5IHYBWqHET0KxLcvIIE49wNhxWYchcc7US4Bf_ZS1UgTPUflW87s43IjIKQIBazb';

const article = {
  title: '📰 2026.04.05 周日 葡萄酒行业快讯',
  author: '行业资讯分析师',
  digest: '2026.04.05最新葡萄酒行业动态：价格异动、政策发布、企业动态、市场趋势。',
  content: '<section style="margin-bottom:20px"><p style="color:#999;text-align:center">2026.04.05 周日 | 行业快讯 | 资讯分析师</p></section><section style="background:linear-gradient(135deg,#c41e3a,#8b2252);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#fff;font-size:16px;line-height:1.9"><strong>📅 2026.04.05 行业快讯</strong><br/>本期聚焦葡萄酒市场最新动态，涵盖价格异动、政策发布、企业动态及消费趋势。</p></section><section style="margin-bottom:28px"><h2 style="color:#2d1424;font-size:20px;border-left:4px solid #c41e3a;padding-left:12px;margin-bottom:18px">🔥 今日热点</h2><section style="background:#faf8f5;padding:18px;border-radius:8px"><p style="color:#333;line-height:1.8;margin-bottom:12px"><strong>1. 香槟市场持续升温</strong><br/><span style="color:#666">Champagne 50指数年初至今上涨1.4%，领跑所有葡萄酒板块。Dom Pérignon、Krug等高端品牌需求强劲，亚洲市场表现尤为突出。对投资者：关注香槟板块配置机会。</span></p><p style="color:#333;line-height:1.8;margin-bottom:12px"><strong>2. 意大利葡萄酒表现强劲</strong><br/><span style="color:#666">Italy 100指数上涨0.7%，Barolo Monfortino 2005两月内涨幅达21%。超级托斯卡纳持续受到追捧。对进口商：关注意大利产区采购机会。</span></p><p style="color:#333;line-height:1.8"><strong>3. 波尔多市场企稳回升</strong><br/><span style="color:#666">Bordeaux 500指数上涨0.5%，一级庄价格保持稳定。2016年份继续受到市场青睐。对收藏者：波尔多2016年份仍是配置首选。</span></p></section></section><section style="margin-bottom:28px"><h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">📊 市场快报</h2><section style="background:#e8f5e9;padding:18px;border-radius:8px;margin-bottom:12px"><p style="color:#2e7d32;font-weight:bold;margin-bottom:12px">💰 价格动态</p><p style="color:#333;line-height:1.8">• Liv-ex 100指数：385.6点，年初至今+0.6%<br/>• Champagne 50：+1.4%（领涨）<br/>• Italy 100：+0.7%<br/>• Bordeaux 500：+0.5%</p></section><section style="background:#e8f5e9;padding:18px;border-radius:8px;margin-bottom:12px"><p style="color:#2e7d32;font-weight:bold;margin-bottom:12px">🏛️ 政策/产区</p><p style="color:#333;line-height:1.8">• 欧盟葡萄酒出口政策调整，亚洲市场关税有望降低<br/>• 加州葡萄酒产区发布春季天气预警，需关注霜冻风险</p></section><section style="background:#e8f5e9;padding:18px;border-radius:8px"><p style="color:#2e7d32;font-weight:bold;margin-bottom:12px">🍷 企业/事件</p><p style="color:#333;line-height:1.8">• 多家国际酒庄集团宣布2026年扩张计划<br/>• 亚洲葡萄酒消费市场持续复苏，进口量同比增长</p></section></section><section style="margin-bottom:28px"><h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">📌 明日关注</h2><section style="background:#fff9f0;padding:18px;border-radius:8px;border-left:3px solid #d4af37"><p style="color:#333;line-height:1.8">• Liv-ex月度市场报告发布（关注指数波动）<br/>• 波尔多2024年份期酒价格预测更新</p></section></section><section style="margin-bottom:28px"><h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">📊 关键数据面板</h2><section style="background:#faf8f5;padding:18px;border-radius:8px"><table style="width:100%;border-collapse:collapse"><tr style="border-bottom:2px solid #d4af37"><td style="padding:10px;font-weight:bold;color:#2d1424">指标</td><td style="padding:10px;font-weight:bold;color:#2d1424">今日值</td><td style="padding:10px;font-weight:bold;color:#2d1424">较前日</td></tr><tr style="border-bottom:1px solid #e8e0d8"><td style="padding:10px;color:#333">Liv-ex 100</td><td style="padding:10px;color:#c41e3a">385.6</td><td style="padding:10px;color:#28a745">+0.6% (YTD)</td></tr><tr style="border-bottom:1px solid #e8e0d8"><td style="padding:10px;color:#333">Champagne 50</td><td style="padding:10px;color:#c41e3a">+1.4%</td><td style="padding:10px;color:#28a745">领涨</td></tr><tr><td style="padding:10px;color:#333">Italy 100</td><td style="padding:10px;color:#c41e3a">+0.7%</td><td style="padding:10px;color:#28a745">稳健</td></tr></table></section></section><section style="background:#f5f5f5;padding:12px;border-radius:6px;margin-bottom:20px"><p style="color:#666;font-size:12px;margin:0"><strong>🔗 信息来源</strong><br/>• Liv-ex | 实时数据<br/>• The Drinks Business | 2026.04.05<br/>• Wine Industry Advisor | 2026.04.05</p></section><section style="background:linear-gradient(135deg,#2d1424,#4a1a2e);padding:22px;border-radius:10px;text-align:center"><p style="color:#d4af37;font-size:14px;font-weight:bold;margin-bottom:8px">📰 行业快讯</p><p style="color:#f5e6d3;font-size:14px;line-height:1.8;margin:0">每日更新，掌握葡萄酒市场最新动态<br/>为投资者、进口商、消费者提供决策参考</p><p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：2026.04.05 周日<br/>关注我们，获取每日行业快讯</p></section>'
};

const data = JSON.stringify({
  articles: [{
    ...article,
    thumb_media_id: mediaId,
    need_open_comment: 0,
    only_fans_can_comment: 0
  }]
});

const options = {
  hostname: 'api.weixin.qq.com',
  port: 443,
  path: '/cgi-bin/draft/add?access_token=' + token,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
  });
});
req.on('error', e => console.log('Error:', e.message));
req.setTimeout(30000, () => { req.destroy(); console.log('Timeout'); });
req.write(data);
req.end();
