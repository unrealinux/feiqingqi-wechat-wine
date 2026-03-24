/**
 * 发布专业葡萄酒市场分析报告到微信
 */
process.env.HTTP_PROXY = '';
process.env.HTTPS_PROXY = '';
process.env.http_proxy = '';
process.env.https_proxy = '';

require('dotenv').config();
process.env.HTTP_PROXY = '';
process.env.HTTPS_PROXY = '';

const axios = require('axios');
axios.defaults.proxy = false;

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const config = require('./config');

class WeChatPublisherPro {
  constructor() {
    this.accessToken = null;
    this.tokenExpireTime = 0;
  }

  async getAccessToken() {
    const now = Date.now();
    if (this.accessToken && now < this.tokenExpireTime) return this.accessToken;
    const response = await axios.get(config.publish.endpoints.token, {
      params: { grant_type: 'client_credential', appid: config.publish.appId, secret: config.publish.appSecret },
      timeout: 10000
    });
    if (response.data.errcode) throw new Error(response.data.errmsg);
    this.accessToken = response.data.access_token;
    this.tokenExpireTime = now + (response.data.expires_in - 300) * 1000;
    return this.accessToken;
  }

  async uploadImage(imagePath) {
    const token = await this.getAccessToken();
    const imageBuffer = fs.readFileSync(imagePath);
    const formData = new FormData();
    formData.append('media', imageBuffer, { filename: 'cover.png', contentType: 'image/png' });
    const response = await axios.post(
      `https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${token}&type=image`,
      formData, { headers: formData.getHeaders(), timeout: 30000 }
    );
    if (response.data.errcode) throw new Error(response.data.errmsg);
    return response.data.media_id;
  }

  async createDraft(article, thumbMediaId) {
    const token = await this.getAccessToken();
    const response = await axios.post(
      `https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${token}`,
      { articles: [{ ...article, thumb_media_id: thumbMediaId, need_open_comment: 0, only_fans_can_comment: 0 }] },
      { headers: { 'Content-Type': 'application/json' }, timeout: 30000 }
    );
    if (response.data.errcode) throw new Error(response.data.errmsg);
    return response.data.media_id;
  }

  async publish(article, coverPath) {
    console.log('📤 发布到微信公众号...\n');
    try {
      console.log('📌 获取Token...');
      await this.getAccessToken();
      console.log('  ✅ 成功\n');

      console.log('📌 上传封面...');
      const thumbMediaId = await this.uploadImage(coverPath);
      console.log('  ✅ 成功\n');

      console.log('📌 创建草稿...');
      const draftId = await this.createDraft(article, thumbMediaId);
      console.log('  ✅ 成功\n');

      return { success: true, draftId };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}

// 专业排版的HTML内容
const articleContent = `<section style="margin-bottom: 20px;">
<p style="color: #999; font-size: 13px; text-align: center;">报告日期：2026-03-24 | 红酒顾问</p>
</section>

<section style="background: linear-gradient(135deg, #1a0a10 0%, #2d1424 100%); padding: 25px; border-radius: 10px; margin-bottom: 25px;">
<p style="color: #f5e6d3; font-size: 16px; line-height: 1.9; margin: 0;">
2026年初，精品葡萄酒市场展现出明确的<strong style="color: #d4af37;">复苏信号</strong>。Liv-ex 100指数连续5个月上涨，<strong style="color: #d4af37;">+0.6%</strong>；交易量提升20%；欧洲买家采购价值同比增长<strong style="color: #d4af37;">48.2%</strong>。然而，市场仍处"反弹初期"，机遇与风险并存。
</p>
</section>

<section style="margin-bottom: 28px;">
<h2 style="color: #2d1424; font-size: 20px; border-left: 4px solid #8b2252; padding-left: 12px; margin-bottom: 18px;">📈 Liv-ex指数表现</h2>

<section style="background: #faf8f5; padding: 18px; border-radius: 8px;">
<table style="width: 100%; border-collapse: collapse; font-size: 14px;">
<tr style="border-bottom: 2px solid #d4af37;">
<td style="padding: 10px; font-weight: bold; color: #2d1424;">指数</td>
<td style="padding: 10px; text-align: right; font-weight: bold; color: #2d1424;">年初至今</td>
<td style="padding: 10px; text-align: center; font-weight: bold; color: #2d1424;">信号</td>
</tr>
<tr style="border-bottom: 1px solid #e8e0d8;">
<td style="padding: 10px; color: #333;">Liv-ex 100（基准）</td>
<td style="padding: 10px; text-align: right; color: #c41e3a; font-weight: bold;">+0.6%</td>
<td style="padding: 10px; text-align: center;">🟢</td>
</tr>
<tr style="border-bottom: 1px solid #e8e0d8;">
<td style="padding: 10px; color: #333;">Champagne 50</td>
<td style="padding: 10px; text-align: right; color: #c41e3a; font-weight: bold;">+1.4%</td>
<td style="padding: 10px; text-align: center;">🟢 最佳</td>
</tr>
<tr style="border-bottom: 1px solid #e8e0d8;">
<td style="padding: 10px; color: #333;">Italy 100</td>
<td style="padding: 10px; text-align: right; color: #c41e3a; font-weight: bold;">+0.7%</td>
<td style="padding: 10px; text-align: center;">🟢</td>
</tr>
<tr style="border-bottom: 1px solid #e8e0d8;">
<td style="padding: 10px; color: #333;">Bordeaux 500</td>
<td style="padding: 10px; text-align: right; color: #c41e3a; font-weight: bold;">+0.5%</td>
<td style="padding: 10px; text-align: center;">🟢</td>
</tr>
<tr style="border-bottom: 1px solid #e8e0d8;">
<td style="padding: 10px; color: #333;">Burgundy 150</td>
<td style="padding: 10px; text-align: right; color: #999; font-weight: bold;">+0.2%</td>
<td style="padding: 10px; text-align: center;">🟡</td>
</tr>
<tr>
<td style="padding: 10px; color: #333;">Rhône 100</td>
<td style="padding: 10px; text-align: right; color: #666; font-weight: bold;">-0.2%</td>
<td style="padding: 10px; text-align: center;">🔴 唯一跌</td>
</tr>
</table>
</section>
</section>

<section style="margin-bottom: 28px;">
<h2 style="color: #2d1424; font-size: 20px; border-left: 4px solid #8b2252; padding-left: 12px; margin-bottom: 18px;">💰 价格快报：高流动性酒款</h2>

<section style="background: #faf8f5; padding: 18px; border-radius: 8px; margin-bottom: 15px;">
<p style="color: #8b2252; font-weight: bold; margin-bottom: 12px;">🍷 波尔多一级庄</p>
<table style="width: 100%; font-size: 13px;">
<tr style="border-bottom: 1px solid #e8e0d8;">
<td style="padding: 8px 0; color: #333;">Lafite 2022</td>
<td style="padding: 8px 0; text-align: right; color: #d4af37;">£4,680/箱</td>
<td style="padding: 8px 0; text-align: right; color: #c41e3a;">+1.2%</td>
</tr>
<tr style="border-bottom: 1px solid #e8e0d8;">
<td style="padding: 8px 0; color: #333;">Haut Brion 1989</td>
<td style="padding: 8px 0; text-align: right; color: #d4af37;">£19,200/箱</td>
<td style="padding: 8px 0; text-align: right; color: #999;">稳定</td>
</tr>
<tr>
<td style="padding: 8px 0; color: #333;">Pavillon Rouge Margaux 2013</td>
<td style="padding: 8px 0; text-align: right; color: #d4af37;">-</td>
<td style="padding: 8px 0; text-align: right; color: #c41e3a; font-weight: bold;">+25% 🔥</td>
</tr>
</table>
</section>

<section style="background: #faf8f5; padding: 18px; border-radius: 8px; margin-bottom: 15px;">
<p style="color: #8b2252; font-weight: bold; margin-bottom: 12px;">🏰 勃艮第特级园</p>
<table style="width: 100%; font-size: 13px;">
<tr style="border-bottom: 1px solid #e8e0d8;">
<td style="padding: 8px 0; color: #333;">DRC Romanée-Conti 2022</td>
<td style="padding: 8px 0; text-align: right; color: #d4af37;">£150,000/箱</td>
<td style="padding: 8px 0; text-align: right; color: #999;">稳定</td>
</tr>
<tr>
<td style="padding: 8px 0; color: #333;">DRC La Tâche 2022</td>
<td style="padding: 8px 0; text-align: right; color: #d4af37;">£44,000/箱</td>
<td style="padding: 8px 0; text-align: right; color: #999;">稳定</td>
</tr>
</table>
</section>

<section style="background: #faf8f5; padding: 18px; border-radius: 8px;">
<p style="color: #8b2252; font-weight: bold; margin-bottom: 12px;">🇮🇹 意大利 & 🍾 香槟</p>
<table style="width: 100%; font-size: 13px;">
<tr style="border-bottom: 1px solid #e8e0d8;">
<td style="padding: 8px 0; color: #333;">Conterno Monfortino 2005</td>
<td style="padding: 8px 0; text-align: right; color: #d4af37;">-</td>
<td style="padding: 8px 0; text-align: right; color: #c41e3a; font-weight: bold;">+21% 🔥</td>
</tr>
<tr style="border-bottom: 1px solid #e8e0d8;">
<td style="padding: 8px 0; color: #333;">Masseto 2022</td>
<td style="padding: 8px 0; text-align: right; color: #d4af37;">-</td>
<td style="padding: 8px 0; text-align: right; color: #c41e3a;">+7.8%</td>
</tr>
<tr>
<td style="padding: 8px 0; color: #333;">Dom Pérignon P2 2008</td>
<td style="padding: 8px 0; text-align: right; color: #d4af37;">£3,518/箱</td>
<td style="padding: 8px 0; text-align: right; color: #c41e3a;">+1.4%</td>
</tr>
</table>
</section>
</section>

<section style="margin-bottom: 28px;">
<h2 style="color: #2d1424; font-size: 20px; border-left: 4px solid #8b2252; padding-left: 12px; margin-bottom: 18px;">🏛️ 拍卖市场动态</h2>

<section style="background: linear-gradient(135deg, #fff9f0 0%, #fff5e6 100%); padding: 18px; border-radius: 8px; border-left: 3px solid #d4af37; margin-bottom: 15px;">
<p style="color: #8b4513; line-height: 1.8; margin: 0;">
<strong>📊 2026年Q1拍卖市场亮点</strong><br/><br/>
• 苏富比/佳士得成交率：<strong>92%+</strong><br/>
• 亚洲买家占比：<strong>28%+</strong>（持续提升）<br/>
• 欧洲买家采购价值：<strong>同比增长48.2%</strong><br/>
• DRC Romanée-Conti 2009：<strong>£175,492/箱</strong>
</p>
</section>

<section style="background: #faf8f5; padding: 18px; border-radius: 8px;">
<p style="color: #8b2252; font-weight: bold; margin-bottom: 12px;">🏆 标志性拍品</p>
<table style="width: 100%; font-size: 13px;">
<tr style="border-bottom: 1px solid #e8e0d8;">
<td style="padding: 8px 0; color: #333;">Screaming Eagle 2023</td>
<td style="padding: 8px 0; text-align: right; color: #d4af37;">£20,532/箱</td>
</tr>
<tr style="border-bottom: 1px solid #e8e0d8;">
<td style="padding: 8px 0; color: #333;">DRC Romanée-Conti 2009</td>
<td style="padding: 8px 0; text-align: right; color: #d4af37;">£175,492/箱</td>
</tr>
<tr>
<td style="padding: 8px 0; color: #333;">Chave Ermitage Cathelin 1995</td>
<td style="padding: 8px 0; text-align: right; color: #d4af37;">£69,534/箱</td>
</tr>
</table>
</section>
</section>

<section style="margin-bottom: 28px;">
<h2 style="color: #2d1424; font-size: 20px; border-left: 4px solid #8b2252; padding-left: 12px; margin-bottom: 18px;">📊 投资建议</h2>

<section style="background: #f0fff0; padding: 18px; border-radius: 8px; border-left: 3px solid #28a745; margin-bottom: 12px;">
<p style="color: #155724; margin: 0;">
<strong>🟢 买入建议</strong><br/><br/>
<strong>1. 波尔多超级二级庄</strong><br/>
<span style="color: #666;">Pichon Lalande 2016 (100分), L'Évangile 2021-2022 (+24.7%)</span><br/>
<span style="color: #999; font-size: 12px;">理由：品质比肩一级庄，价格差距大，月涨幅领先</span><br/><br/>
<strong>2. 意大利Barolo</strong><br/>
<span style="color: #666;">Conterno Monfortino, Giacosa, Mascarello 2019-2021</span><br/>
<span style="color: #999; font-size: 12px;">理由：2021年份WA 98分，Monfortino 2005涨幅+21%</span><br/><br/>
<strong>3. 年份香槟</strong><br/>
<span style="color: #666;">Salon, Dom Pérignon, Krug</span><br/>
<span style="color: #999; font-size: 12px;">理由：Champagne 50指数领涨+1.4%，需求旺盛</span>
</p>
</section>

<section style="background: #fff9e6; padding: 18px; border-radius: 8px; border-left: 3px solid #ffc107; margin-bottom: 12px;">
<p style="color: #856404; margin: 0;">
<strong>🟡 观望建议</strong><br/><br/>
<strong>勃艮第顶级酒</strong>：价格高位，等待回调<br/>
<strong>年轻波尔多</strong>：供应过剩，价格仍在消化
</p>
</section>

<section style="background: #fff5f5; padding: 18px; border-radius: 8px; border-left: 3px solid #dc3545;">
<p style="color: #721c24; margin: 0;">
<strong>🔴 回避建议</strong><br/><br/>
<strong>罗讷河谷</strong>：唯一下跌指数-0.2%<br/>
<strong>非核心年份普通酒</strong>：流动性差，升值空间有限
</p>
</section>
</section>

<section style="margin-bottom: 28px;">
<h2 style="color: #2d1424; font-size: 20px; border-left: 4px solid #8b2252; padding-left: 12px; margin-bottom: 18px;">⚠️ 三大核心风险</h2>

<section style="background: #fff5f5; padding: 18px; border-radius: 8px;">
<p style="color: #721c24; line-height: 2; margin: 0;">
<strong>1️⃣ 地缘政治风险</strong><br/>
<span style="color: #666; font-size: 13px;">中东局势紧张可能推高通胀，影响消费信心</span><br/><br/>
<strong>2️⃣ 美国关税风险</strong><br/>
<span style="color: #666; font-size: 13px;">贸易商正游说将葡萄酒排除在关税外，政策未定</span><br/><br/>
<strong>3️⃣ 期酒定价风险</strong><br/>
<span style="color: #666; font-size: 13px;">2024年份波尔多即将发布，定价过高可能抑制二级市场</span>
</p>
</section>
</section>

<section style="background: linear-gradient(135deg, #2d1424 0%, #4a1a2e 100%); padding: 22px; border-radius: 10px; text-align: center;">
<p style="color: #d4af37; font-size: 16px; font-weight: bold; margin-bottom: 8px;">📋 总结：触底复苏初期</p>
<p style="color: #f5e6d3; font-size: 14px; line-height: 1.8; margin: 0;">
逢低建立波尔多核心仓位<br/>
关注意大利Barolo价值机会<br/>
勃艮第等待回调<br/>
避免非核心酒款
</p>
<p style="color: #999; font-size: 12px; margin-top: 15px; margin-bottom: 0;">
数据来源：Liv-ex, WineNews, Vinum Fine Wines<br/>
免责声明：本报告仅供参考，不构成投资建议
</p>
</section>`;

async function main() {
  console.log('='.repeat(60));
  console.log('🍷 发布专业葡萄酒市场分析报告');
  console.log('='.repeat(60));
  console.log('');

  const coverPath = path.join(__dirname, 'output', 'cover_2026_ai.png');
  if (!fs.existsSync(coverPath)) {
    console.log('❌ 封面不存在');
    return;
  }
  console.log('✅ 使用AI写实封面');

  const article = {
    title: '🍷 2026.03.24 精品葡萄酒市场分析：Liv-ex回暖，波尔多领涨',
    author: '红酒顾问',
    digest: 'Liv-ex指数连续5个月上涨，波尔多超级二级庄涨幅领先，意大利Barolo价值凸显。一文读懂2026年投资机遇与风险。',
    content: articleContent,
  };

  const publisher = new WeChatPublisherPro();
  const result = await publisher.publish(article, coverPath);

  console.log('');
  console.log('='.repeat(60));
  if (result.success) {
    console.log('✅ 发布成功！');
    console.log('草稿ID:', result.draftId);
    console.log('');
    console.log('请登录 https://mp.weixin.qq.com 查看草稿');
  } else {
    console.log('❌ 失败:', result.error);
  }
}

main();
