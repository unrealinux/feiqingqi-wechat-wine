process.env.HTTP_PROXY = '';
process.env.HTTPS_PROXY = '';
process.env.http_proxy = '';
process.env.https_proxy = '';

require('dotenv').config();

const axios = require('axios');
axios.defaults.proxy = false;
const fetch = require('node-fetch');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const config = require('./config');

const today = new Date();
const date = {
  full: today.toISOString().slice(0, 10),
  display: `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`,
  weekday: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][today.getDay()],
};

// 扩展酒单 - 30款不同酒款，确保长期不重复
const WINE_DATABASE = [
  { name: 'Château Lafite Rothschild 2018', region: '波尔多·波雅克', type: '干红', grape: '赤霞珠为主', score: 'WA 97', price: '约4500-5500元', taste: '黑醋栗、雪松、石墨、烟草', pairing: '牛排、羊排、野味', aging: '2025-2050', story: '1855年一级庄，被誉为"酒王之王"' },
  { name: 'Château Margaux 2016', region: '波尔多·玛歌', type: '干红', grape: '赤霞珠为主', score: 'WA 99', price: '约3500-4500元', taste: '黑莓、紫罗兰、香料、丝绒', pairing: '烤鸭、红烧肉、奶酪', aging: '2025-2060', story: '以优雅著称的一级庄' },
  { name: 'Domaine de la Romanée-Conti 2019', region: '勃艮第·沃恩-罗曼尼', type: '干红', grape: '黑皮诺', score: 'WA 98', price: '约150000-200000元', taste: '红樱桃、玫瑰、香料、矿石', pairing: '松露、鹅肝、高级法餐', aging: '2030-2060', story: '勃艮第之王，全球最昂贵的葡萄酒之一' },
  { name: 'Giacomo Conterno Monfortino 2015', region: '皮埃蒙特·巴罗洛', type: '干红', grape: '内比奥罗', score: 'WA 97', price: '约5000-7000元', taste: '玫瑰、焦油、樱桃、烟草', pairing: '意大利面、炖肉、蘑菇', aging: '2025-2055', story: '巴罗洛之王，只在顶级年份生产' },
  { name: 'Dom Pérignon 2012', region: '香槟', type: '香槟', grape: '霞多丽、黑皮诺', score: 'WA 96', price: '约2000-2500元', taste: '柑橘、烤面包、杏仁、矿石', pairing: '生蚝、鱼子酱、海鲜', aging: '2025-2040', story: '香槟之王，以发明香槟的修道士命名' },
  { name: 'Opus One 2019', region: '美国·纳帕谷', type: '干红', grape: '赤霞珠为主', score: 'WA 97', price: '约2800-3500元', taste: '黑莓、巧克力、雪松、烟熏', pairing: '牛排、烤肉、蓝纹奶酪', aging: '2025-2045', story: '波尔多与纳帕的完美融合' },
  { name: 'Penfolds Grange 2018', region: '澳洲·南澳', type: '干红', grape: '西拉', score: 'WA 98', price: '约5000-8000元', taste: '黑莓、巧克力、摩卡、香料', pairing: '烤羊排、野味、陈年奶酪', aging: '2025-2060', story: '澳洲酒王，世界顶级西拉' },
  { name: 'Vega Sicilia Unico 2011', region: '西班牙·杜埃罗河岸', type: '干红', grape: '丹魄为主', score: 'WA 97', price: '约4000-6000元', taste: '黑莓、雪松、烟草、皮革', pairing: '烤乳猪、炖肉、伊比利亚火腿', aging: '2025-2050', story: '西班牙酒王，陈年10年以上才发售' },
  { name: 'Tenuta San Guido Sassicaia 2018', region: '意大利·托斯卡纳', type: '干红', grape: '赤霞珠、品丽珠', score: 'WA 97', price: '约2000-3000元', taste: '黑醋栗、薄荷、雪松、石墨', pairing: '牛排、野味、陈年奶酪', aging: '2025-2045', story: '超级托斯卡纳鼻祖，打破传统规则' },
  { name: 'Caymus Cabernet Sauvignon 2020', region: '美国·纳帕谷', type: '干红', grape: '赤霞珠', score: 'WA 94', price: '约800-1200元', taste: '黑莓、可可、香草、摩卡', pairing: '烤肉、汉堡、炖肉', aging: '2025-2035', story: '纳帕谷性价比之王，浓郁饱满' },
  { name: 'Cloudy Bay Sauvignon Blanc 2022', region: '新西兰·马尔堡', type: '干白', grape: '长相思', score: 'WA 92', price: '约200-300元', taste: '百香果、青柠、青草、矿物', pairing: '生蚝、沙拉、海鲜', aging: '2025-2027', story: '新西兰长相思标杆，清爽典范' },
  { name: "Château d'Yquem 2015", region: '波尔多·苏玳', type: '甜白', grape: '赛美蓉、长相思', score: 'WA 99', price: '约3000-4000元', taste: '蜂蜜、杏干、藏红花、焦糖', pairing: '鹅肝、蓝纹奶酪、甜点', aging: '2025-2060', story: '甜酒之王，贵腐传奇' },
  { name: 'Antinori Tignanello 2019', region: '意大利·托斯卡纳', type: '干红', grape: '桑娇维塞、赤霞珠', score: 'WA 96', price: '约1000-1500元', taste: '樱桃、李子、烟草、香草', pairing: '意大利面、烤肉、披萨', aging: '2025-2040', story: 'Antinori家族旗舰，超级托斯卡纳经典' },
  { name: 'Krug Grande Cuvée', region: '香槟', type: '香槟', grape: '霞多丽、黑皮诺、莫尼耶', score: 'WA 97', price: '约1500-2000元', taste: '烤面包、坚果、柑橘、蜂蜜', pairing: '鱼子酱、高级法餐、生蚝', aging: '2025-2035', story: '香槟中的劳斯莱斯，极致复杂' },
  { name: 'Château Cheval Blanc 2015', region: '波尔多·圣埃美隆', type: '干红', grape: '梅洛、品丽珠', score: 'WA 99', price: '约5000-7000元', taste: '黑莓、紫罗兰、巧克力、香料', pairing: '烤鸭、鹅肝、炖肉', aging: '2025-2055', story: '波尔多右岸之王，优雅与力量的完美结合' },
  { name: 'Louis Roederer Cristal 2014', region: '香槟', type: '香槟', grape: '霞多丽、黑皮诺', score: 'WA 97', price: '约2500-3500元', taste: '柑橘、白桃、烤面包、矿物', pairing: '龙虾、鱼子酱、高级海鲜', aging: '2025-2040', story: '沙皇御用香槟，极致奢华' },
  { name: 'Marchesi Antinori Solaia 2018', region: '意大利·托斯卡纳', type: '干红', grape: '赤霞珠、桑娇维塞', score: 'WA 97', price: '约2500-3500元', taste: '黑莓、薄荷、雪松、烟草', pairing: '牛排、野味、陈年奶酪', aging: '2025-2045', story: '太阳之酒，托斯卡纳的巅峰之作' },
  { name: 'Château Mouton Rothschild 2016', region: '波尔多·波雅克', type: '干红', grape: '赤霞珠为主', score: 'WA 98', price: '约4000-5000元', taste: '黑醋栗、石墨、雪松、紫罗兰', pairing: '烤羊排、野味、陈年奶酪', aging: '2025-2055', story: '每年更换艺术酒标的一级庄' },
  { name: 'Château Latour 2015', region: '波尔多·波雅克', type: '干红', grape: '赤霞珠为主', score: 'WA 98', price: '约5000-7000元', taste: '黑莓、雪松、烟草、石墨', pairing: '牛排、炖肉、野味', aging: '2025-2060', story: '波尔多最强劲的一级庄' },
  { name: 'Château Haut-Brion 2016', region: '波尔多·佩萨克', type: '干红', grape: '梅洛、赤霞珠', score: 'WA 98', price: '约4000-5500元', taste: '黑莓、烟草、石墨、咖啡', pairing: '烤鸭、鹅肝、炖肉', aging: '2025-2055', story: '波尔多最古老的一级庄' },
  { name: 'Biondi-Santi Brunello 2016', region: '托斯卡纳·蒙塔奇诺', type: '干红', grape: '桑娇维塞', score: 'WA 97', price: '约3000-5000元', taste: '樱桃、烟草、皮革、香料', pairing: '炖肉、野味、陈年奶酪', aging: '2025-2050', story: 'Brunello的发明者' },
  { name: 'Gaja Barbaresco 2017', region: '皮埃蒙特·巴巴莱斯科', type: '干红', grape: '内比奥罗', score: 'WA 96', price: '约2000-3000元', taste: '玫瑰、焦油、樱桃、松露', pairing: '意大利面、炖肉、蘑菇', aging: '2025-2045', story: '意大利葡萄酒教父' },
  { name: 'Château Palmer 2016', region: '波尔多·玛歌', type: '干红', grape: '梅洛、赤霞珠', score: 'WA 97', price: '约2000-3000元', taste: '黑莓、紫罗兰、香料、巧克力', pairing: '烤鸭、鹅肝、炖肉', aging: '2025-2050', story: '玛歌村的超级明星' },
  { name: 'E. Guigal Côte-Rôtie 2017', region: '罗讷河谷', type: '干红', grape: '西拉', score: 'WA 96', price: '约1500-2500元', taste: '黑莓、胡椒、烟熏、紫罗兰', pairing: '烤羊排、野味、炖肉', aging: '2025-2045', story: '罗讷河谷的标杆' },
  { name: 'Ruinart Blanc de Blancs', region: '香槟', type: '香槟', grape: '霞多丽', score: 'WA 93', price: '约600-800元', taste: '柑橘、白桃、烤面包、矿物', pairing: '生蚝、海鲜、沙拉', aging: '2025-2030', story: '香槟区最古老的酒庄' },
  { name: 'Château Pichon Longueville 2016', region: '波尔多·波雅克', type: '干红', grape: '赤霞珠为主', score: 'WA 96', price: '约1500-2500元', taste: '黑醋栗、雪松、烟草、石墨', pairing: '牛排、羊排、野味', aging: '2025-2045', story: '波尔多超级二级庄' },
  { name: 'Ruffino Chianti Classico Riserva', region: '托斯卡纳·基安蒂', type: '干红', grape: '桑娇维塞', score: 'WA 91', price: '约150-250元', taste: '樱桃、李子、香草、香料', pairing: '意大利面、披萨、烤肉', aging: '2025-2030', story: '基安蒂经典代表' },
  { name: 'Marqués de Riscal Reserva 2016', region: '西班牙·里奥哈', type: '干红', grape: '丹魄', score: 'WA 93', price: '约200-350元', taste: '樱桃、香草、烟草、皮革', pairing: 'Tapas、烤乳猪、炖肉', aging: '2025-2035', story: '里奥哈最古老的酒庄之一' },
  { name: 'Veuve Clicquot Yellow Label', region: '香槟', type: '香槟', grape: '霞多丽、黑皮诺、莫尼耶', score: 'WA 91', price: '约400-600元', taste: '苹果、梨、烤面包、柑橘', pairing: '生蚝、海鲜、奶酪', aging: '2025-2028', story: '凯歌香槟，优雅典范' },
  { name: 'Concha y Toro Don Melchor 2018', region: '智利·迈坡谷', type: '干红', grape: '赤霞珠', score: 'WA 95', price: '约500-800元', taste: '黑莓、薄荷、雪松、石墨', pairing: '牛排、烤肉、炖肉', aging: '2025-2040', story: '智利酒王，新世界经典' },
];

const FOOD_PAIRING_DB = [
  { dish: '红烧肉', wine: '波尔多右岸梅洛', reason: '肥瘦相间的红烧肉需要柔和的单宁和丰富的果味来平衡' },
  { dish: '清蒸鱼', wine: '勃艮第夏布利', reason: '清爽的酸度和矿物感能突出鱼肉的鲜美' },
  { dish: '牛排', wine: '波尔多左岸赤霞珠', reason: '强劲的单宁能切割牛肉的脂肪，结构感完美搭配' },
  { dish: '火锅', wine: '新西兰长相思', reason: '清新酸爽能解辣，不会被火锅的浓重味道掩盖' },
  { dish: '烤鸭', wine: '勃艮第黑皮诺', reason: '优雅的果味和适中的单宁能衬托烤鸭的酥脆和嫩滑' },
  { dish: '烤羊排', wine: '里奥哈Reserva', reason: '陈年带来的皮革风味与羊肉的膻味完美呼应' },
  { dish: '意大利面', wine: '基安蒂Classico', reason: '高酸度完美搭配番茄酱' },
];

async function fetchLatestNews() {
  console.log('📰 获取最新资讯...');
  const Parser = require('rss-parser');
  const parser = new Parser({ timeout: 15000 });
  const sources = [
    { name: 'The Drinks Business', url: 'https://www.thedrinksbusiness.com/feed/' },
    { name: 'VinePair', url: 'https://vinepair.com/feed/' },
  ];
  const allNews = [];
  for (const source of sources) {
    try {
      const feed = await parser.parseURL(source.url);
      const items = (feed.items || []).slice(0, 5);
      for (const item of items) {
        if (item.title) allNews.push({ title: item.title, source: source.name, pubDate: item.pubDate ? new Date(item.pubDate) : new Date() });
      }
      console.log(`   ✅ ${source.name}: ${items.length} 条`);
    } catch (err) { console.warn(`   ⚠️ ${source.name}: ${err.message.slice(0, 50)}`); }
  }
  console.log(`   总计: ${allNews.length} 条资讯\n`);
  return allNews;
}

// 使用日期作为种子，确保每天选择不同酒款
function getTodayWine() {
  const dateStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
    hash = hash & hash;
  }
  return WINE_DATABASE[Math.abs(hash) % WINE_DATABASE.length];
}

function getTodayPairing() {
  return FOOD_PAIRING_DB[today.getDay() % FOOD_PAIRING_DB.length];
}

async function generateCover() {
  console.log('🎨 生成写实封面...');
  const apiKey = process.env.ZIMAGE_API_KEY;
  try {
    const submitResponse = await fetch('https://api-inference.modelscope.cn/v1/images/generations', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'X-ModelScope-Async-Mode': 'true' },
      body: JSON.stringify({ model: 'Tongyi-MAI/Z-Image-Turbo', prompt: 'Professional wine still life photography, crystal wine glass with red wine, premium wine bottle, dark wooden table, soft warm studio lighting, shallow depth of field, commercial quality, high detail', negative_prompt: 'cartoon, illustration, blurry, low quality, text, watermark', steps: 12, width: 1280, height: 720 })
    });
    const submitData = await submitResponse.json();
    const taskId = submitData.task_id;
    for (let i = 0; i < 30; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const statusResponse = await fetch(`https://api-inference.modelscope.cn/v1/tasks/${taskId}`, { headers: { 'Authorization': `Bearer ${apiKey}`, 'X-ModelScope-Task-Type': 'image_generation' } });
      const statusData = await statusResponse.json();
      if (statusData.task_status === 'SUCCEED') {
        const imageUrl = statusData.output_images?.[0];
        if (imageUrl) {
          console.log('   ✅ AI图片生成成功');
          const imageResponse = await fetch(imageUrl);
          const imageBuffer = await imageResponse.arrayBuffer();
          return sharp(Buffer.from(imageBuffer)).resize(900, 383, { fit: 'cover', position: 'center' }).png().toBuffer();
        }
      }
      if (statusData.task_status === 'FAILED') break;
    }
  } catch (err) { console.warn('   ⚠️ AI封面生成失败'); }
  console.log('   使用备用封面');
  const svg = `<svg width="900" height="383"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#1a0a10"/><stop offset="50%" style="stop-color:#2d1424"/><stop offset="100%" style="stop-color:#4a1a2e"/></linearGradient><linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#D4AF37"/><stop offset="100%" style="stop-color:#F4E4BC"/></linearGradient></defs><rect width="900" height="383" fill="url(#grad)"/><rect x="0" y="230" width="900" height="153" fill="rgba(0,0,0,0.6)"/><text x="30" y="290" font-family="Microsoft YaHei" font-size="32" font-weight="bold" fill="url(#textGrad)">🍷 ${date.display} 每日红酒精选</text><text x="30" y="335" font-family="Microsoft YaHei" font-size="16" fill="rgba(255,255,255,0.9)">今日之星 · 配餐灵感 · 市场快讯</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.weekday}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

class WeChatPublisher {
  constructor() { this.accessToken = null; this.tokenExpireTime = 0; }
  async getAccessToken() {
    const now = Date.now();
    if (this.accessToken && now < this.tokenExpireTime) return this.accessToken;
    const response = await axios.get(config.publish.endpoints.token, { params: { grant_type: 'client_credential', appid: config.publish.appId, secret: config.publish.appSecret }, timeout: 10000 });
    if (response.data.errcode) throw new Error(response.data.errmsg);
    this.accessToken = response.data.access_token;
    this.tokenExpireTime = now + (response.data.expires_in - 300) * 1000;
    return this.accessToken;
  }
  async uploadImage(imageBuffer) {
    const token = await this.getAccessToken();
    const formData = new FormData();
    formData.append('media', imageBuffer, { filename: 'cover.png', contentType: 'image/png' });
    const response = await axios.post(`https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${token}&type=image`, formData, { headers: formData.getHeaders(), timeout: 30000 });
    if (response.data.errcode) throw new Error(response.data.errmsg);
    return response.data.media_id;
  }
  async createDraft(article, thumbMediaId) {
    const token = await this.getAccessToken();
    const response = await axios.post(`https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${token}`, { articles: [{ ...article, thumb_media_id: thumbMediaId, need_open_comment: 0, only_fans_can_comment: 0 }] }, { headers: { 'Content-Type': 'application/json' }, timeout: 30000 });
    if (response.data.errcode) throw new Error(response.data.errmsg);
    return response.data.media_id;
  }
  async publish(article, coverBuffer) {
    console.log('📤 发布到微信...');
    await this.getAccessToken();
    const thumbMediaId = await this.uploadImage(coverBuffer);
    const draftId = await this.createDraft(article, thumbMediaId);
    return { success: true, draftId };
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log(`🍷 每日红酒精选 - 第${Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))}期`);
  console.log(`日期: ${date.display} ${date.weekday}`);
  console.log('='.repeat(60));
  console.log('');

  const todayWine = getTodayWine();
  const todayPairing = getTodayPairing();
  const news = await fetchLatestNews();
  const coverBuffer = await generateCover();

  const newsList = news.slice(0, 5).map(n => `<p style="color:#333;font-size:14px;line-height:1.7;margin-bottom:10px"><strong>• ${n.title}</strong><br/><span style="color:#999;font-size:12px">${n.source} | ${n.pubDate.toISOString().slice(0, 10)}</span></p>`).join('\n');

  const article = {
    title: `🍷 ${date.display} ${date.weekday} 每日红酒精选：${todayWine.name}`,
    author: '红酒顾问',
    digest: `${date.display}第${Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))}期：今日推荐${todayWine.name}，${todayWine.score}分，${todayWine.price}。`,
    content: `<section style="margin-bottom:20px"><p style="color:#999;text-align:center">${date.display} ${date.weekday} | 每日红酒精选 | 第${Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))}期</p></section>

<section style="background:linear-gradient(135deg,#1a0a10,#2d1424);padding:25px;border-radius:10px;margin-bottom:25px"><p style="color:#f5e6d3;font-size:16px;line-height:1.9">${date.display}，${date.weekday}。欢迎阅读本期<strong style="color:#d4af37">「每日红酒精选」</strong>。今天为您推荐一款值得品味的佳酿，附带品鉴笔记和配餐建议。</p></section>

<section style="margin-bottom:28px"><h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">⭐ 今日之星</h2><section style="background:linear-gradient(135deg,#fff9f0,#fff5e6);padding:20px;border-radius:8px;border-left:3px solid #d4af37"><p style="color:#8b4513;font-size:18px;font-weight:bold;margin-bottom:15px">🍷 ${todayWine.name}</p><table style="width:100%;font-size:14px;margin-bottom:15px"><tr style="border-bottom:1px solid #e8e0d8"><td style="padding:8px 0;color:#666;width:80px">产区</td><td style="padding:8px 0;color:#333;font-weight:bold">${todayWine.region}</td></tr><tr style="border-bottom:1px solid #e8e0d8"><td style="padding:8px 0;color:#666">类型</td><td style="padding:8px 0;color:#333">${todayWine.type}</td></tr><tr style="border-bottom:1px solid #e8e0d8"><td style="padding:8px 0;color:#666">葡萄</td><td style="padding:8px 0;color:#333">${todayWine.grape}</td></tr><tr style="border-bottom:1px solid #e8e0d8"><td style="padding:8px 0;color:#666">评分</td><td style="padding:8px 0;color:#c41e3a;font-weight:bold">${todayWine.score}</td></tr><tr style="border-bottom:1px solid #e8e0d8"><td style="padding:8px 0;color:#666">价格</td><td style="padding:8px 0;color:#d4af37;font-weight:bold">${todayWine.price}</td></tr><tr><td style="padding:8px 0;color:#666">适饮期</td><td style="padding:8px 0;color:#333">${todayWine.aging}</td></tr></table><p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>风味描述：</strong>${todayWine.taste}</p><p style="color:#333;line-height:1.8"><strong>酒庄故事：</strong>${todayWine.story}</p></section></section>

<section style="margin-bottom:28px"><h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🍽️ 今日配餐灵感</h2><section style="background:#e8f5e9;padding:18px;border-radius:8px"><p style="color:#2e7d32;font-weight:bold;margin-bottom:12px">🥘 ${todayPairing.dish} + ${todayPairing.wine}</p><p style="color:#333;line-height:1.8">${todayPairing.reason}</p></section></section>

<section style="margin-bottom:28px"><h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">📰 市场快讯</h2><section style="background:#faf8f5;padding:15px;border-radius:6px">${newsList || '<p style="color:#666">暂无最新资讯</p>'}</section></section>

<section style="margin-bottom:28px"><h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">💡 品鉴笔记</h2><section style="background:#f0fff0;padding:18px;border-radius:8px;border-left:3px solid #28a745"><p style="color:#155724;margin:0"><strong>品鉴四步法</strong><br/><br/><strong>1. 观色：</strong>将酒杯倾斜45度，观察酒液的色泽和透明度<br/><br/><strong>2. 闻香：</strong>轻轻摇晃酒杯，让酒液与空气接触，释放香气<br/><br/><strong>3. 品尝：</strong>小口啜饮，让酒液在口中停留5-10秒<br/><br/><strong>4. 回味：</strong>感受余味的长度和复杂度</p></section></section>

<section style="background:linear-gradient(135deg,#2d1424,#4a1a2e);padding:22px;border-radius:10px;text-align:center"><p style="color:#d4af37;font-size:14px;font-weight:bold;margin-bottom:8px">🍷 每日红酒精选</p><p style="color:#f5e6d3;font-size:14px;line-height:1.8;margin:0">每天一款精选酒款<br/>专业品鉴笔记+配餐灵感<br/>让红酒融入你的日常</p><p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display} ${date.weekday}<br/>关注我们，获取每日红酒精选</p></section>`
  };

  console.log('📝 标题:', article.title);
  console.log('');

  const publisher = new WeChatPublisher();
  const result = await publisher.publish(article, coverBuffer);

  console.log('');
  console.log('='.repeat(60));
  if (result.success) {
    console.log('✅ 发布成功！');
    console.log('草稿ID:', result.draftId);
    console.log('');
    console.log('📊 本期内容：');
    console.log('   今日之星:', todayWine.name);
    console.log('   配餐灵感:', todayPairing.dish, '+', todayPairing.wine);
    console.log('   市场快讯:', news.length, '条');
  } else {
    console.log('❌ 失败:', result.error);
  }
  console.log('='.repeat(60));
}

main().catch(err => { console.error('\n❌ 任务失败:', err); process.exit(1); });
