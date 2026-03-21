/**
 * 葡萄酒行业快讯发布脚本
 */
process.env.HTTP_PROXY = '';
process.env.HTTPS_PROXY = '';
process.env.http_proxy = '';
process.env.https_proxy = '';

require('dotenv').config();
process.env.HTTP_PROXY = '';
process.env.HTTPS_PROXY = '';

const fetch = require('node-fetch');
const { HttpsProxyAgent } = require('https-proxy-agent');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const axios = require('axios');
axios.defaults.proxy = false;
const FormData = require('form-data');
const config = require('./config');

const proxyAgent = new HttpsProxyAgent('http://127.0.0.1:10809');

/**
 * 生成AI封面
 */
async function generateAICover() {
  const apiKey = process.env.ZIMAGE_API_KEY;
  
  console.log('🎨 生成AI封面...');
  
  const submitResponse = await fetch(
    'https://api-inference.modelscope.cn/v1/images/generations',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-ModelScope-Async-Mode': 'true'
      },
      body: JSON.stringify({
        model: 'Tongyi-MAI/Z-Image-Turbo',
        prompt: 'Breaking news headline concept, wine market data charts and graphs, newspaper front page style, professional business photography, dark background with red wine color accents, market ticker tape, financial data visualization',
        negative_prompt: 'blurry, low quality, cartoon, text, watermark',
        steps: 10,
        width: 1280,
        height: 720
      })
    }
  );
  
  const submitData = await submitResponse.json();
  const taskId = submitData.task_id;
  
  for (let i = 0; i < 30; i++) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const statusResponse = await fetch(
      `https://api-inference.modelscope.cn/v1/tasks/${taskId}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'X-ModelScope-Task-Type': 'image_generation'
        }
      }
    );
    
    const statusData = await statusResponse.json();
    
    if (statusData.task_status === 'SUCCEED') {
      const imageUrl = statusData.output_images?.[0];
      if (imageUrl) {
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = await imageResponse.arrayBuffer();
        const rawImage = Buffer.from(imageBuffer);
        
        const croppedBuffer = await sharp(rawImage)
          .resize(900, 383, { fit: 'cover', position: 'center' })
          .png()
          .toBuffer();
        
        const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#D4AF37"/>
              <stop offset="100%" style="stop-color:#F4E4BC"/>
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="900" height="383" fill="rgba(0,0,0,0.3)"/>
          <rect x="0" y="280" width="900" height="103" fill="rgba(0,0,0,0.75)"/>
          <text x="30" y="325" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="32" font-weight="bold" fill="url(#textGrad)">📰 2026年3月21日 行业快讯</text>
          <text x="30" y="365" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">Liv-ex回暖 · 波尔多领涨 · AI赋能市场</text>
          <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">每日速递</text>
        </svg>`;
        
        const textBuffer = Buffer.from(svg);
        
        const finalBuffer = await sharp(croppedBuffer)
          .composite([{ input: textBuffer, top: 0, left: 0 }])
          .png()
          .toBuffer();
        
        const outputPath = path.join(__dirname, 'output', 'cover_daily_news.png');
        fs.writeFileSync(outputPath, finalBuffer);
        console.log('   ✅ 封面已生成');
        
        return outputPath;
      }
    }
    
    if (statusData.task_status === 'FAILED') throw new Error('生成失败');
  }
  
  throw new Error('超时');
}

/**
 * 微信发布类
 */
class WeChatPublisher {
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
    console.log('\n📤 发布到微信...');
    try {
      await this.getAccessToken();
      const thumbMediaId = await this.uploadImage(coverPath);
      const draftId = await this.createDraft(article, thumbMediaId);
      return { success: true, draftId };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}

/**
 * 快讯HTML内容
 */
const articleContent = `<section style="margin-bottom: 15px;">
<p style="color: #999; font-size: 12px; text-align: center;">2026年3月21日 | 行业快讯 | 来源：Liv-ex, WineNews, Vinum Fine Wines</p>
</section>

<section style="background: linear-gradient(135deg, #c41e3a 0%, #8b2252 100%); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
<p style="color: #fff; font-size: 18px; font-weight: bold; margin-bottom: 10px;">🔥 今日热点</p>
<p style="color: #f5e6d3; font-size: 15px; line-height: 1.8; margin: 0;">
<strong>Liv-ex宣布AI战略转型</strong>：平台将重建系统，利用AI为会员提供个性化市场情报，实时显示最佳买卖机会。CEO James Miles表示"过去25年让数据可见，未来5年让数据有用"。
</p>
<p style="color: #ddd; font-size: 12px; margin-top: 8px; margin-bottom: 0;">来源：The Drinks Business | 2026-03-03</p>
</section>

<section style="margin-bottom: 20px;">
<h2 style="color: #2d1424; font-size: 18px; border-left: 4px solid #c41e3a; padding-left: 10px; margin-bottom: 15px;">📊 市场快报</h2>

<section style="background: #faf8f5; padding: 15px; border-radius: 6px; margin-bottom: 12px;">
<p style="color: #8b2252; font-weight: bold; margin-bottom: 10px;">💰 价格动态</p>

<p style="color: #333; font-size: 14px; line-height: 1.7; margin-bottom: 8px;">
<strong>• Château Pavie 2018/2017</strong>：连续两周占据交易榜首，波尔多右岸持续活跃<br/>
<span style="color: #999; font-size: 12px;">来源：Liv-ex Talking Trade | 2026-03-06</span>
</p>

<p style="color: #333; font-size: 14px; line-height: 1.7; margin-bottom: 8px;">
<strong>• Bordeaux 2016年份</strong>：7款顶级评分酒近6个月价格回升，<strong style="color: #c41e3a;">Cheval Blanc、Haut-Brion触底反弹</strong><br/>
<span style="color: #999; font-size: 12px;">来源：Liv-ex研究报告 | 2026-03-03</span>
</p>

<p style="color: #333; font-size: 14px; line-height: 1.7; margin-bottom: 8px;">
<strong>• 波尔多市场份额</strong>：从41%升至<strong style="color: #c41e3a;">46.7%</strong>，美国买家份额升至27%<br/>
<span style="color: #999; font-size: 12px;">来源：Liv-ex Talking Trade | 2026-03-06</span>
</p>

<p style="color: #333; font-size: 14px; line-height: 1.7;">
<strong>• Liv-ex 100</strong>：年初至今<strong style="color: #c41e3a;">+0.6%</strong>，连续5个月上涨<br/>
<span style="color: #999; font-size: 12px;">来源：Liv-ex | 2026-03</span>
</p>
</section>

<section style="background: #faf8f5; padding: 15px; border-radius: 6px; margin-bottom: 12px;">
<p style="color: #8b2252; font-weight: bold; margin-bottom: 10px;">🏛️ 政策/产区</p>

<p style="color: #333; font-size: 14px; line-height: 1.7; margin-bottom: 8px;">
<strong>• EU葡萄酒出口</strong>：2025年出口额77亿欧元，同比<strong style="color: #c41e3a;">下降3.7%</strong>，需求疲软<br/>
<span style="color: #999; font-size: 12px;">来源：WineNews | 2026-03-11</span>
</p>

<p style="color: #333; font-size: 14px; line-height: 1.7;">
<strong>• ProWein 2026</strong>：德国杜塞尔多夫展会进行中，意大利设40亿欧元出口主题馆<br/>
<span style="color: #999; font-size: 12px;">来源：WineNews | 2026-03-13</span>
</p>
</section>

<section style="background: #faf8f5; padding: 15px; border-radius: 6px;">
<p style="color: #8b2252; font-weight: bold; margin-bottom: 10px;">🍷 企业/事件</p>

<p style="color: #333; font-size: 14px; line-height: 1.7; margin-bottom: 8px;">
<strong>• E&J Gallo</strong>：关闭Ranch Winery并裁员，葡萄酒需求下降<br/>
<span style="color: #999; font-size: 12px;">来源：行业报告 | 2026-03</span>
</p>

<p style="color: #333; font-size: 14px; line-height: 1.7; margin-bottom: 8px;">
<strong>• Verallia</strong>：宣布裁员360人，欧洲玻璃需求下降<br/>
<span style="color: #999; font-size: 12px;">来源：行业报告 | 2026-03</span>
</p>

<p style="color: #333; font-size: 14px; line-height: 1.7;">
<strong>• Ethica Wines</strong>：收购Interprocom Cantine Divine，布局中国市场<br/>
<span style="color: #999; font-size: 12px;">来源：WineNews | 2026-03-10</span>
</p>
</section>
</section>

<section style="background: #e8f5e9; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
<p style="color: #2e7d32; font-weight: bold; margin-bottom: 10px;">📌 明日关注</p>

<p style="color: #333; font-size: 14px; line-height: 1.7; margin-bottom: 8px;">
<strong>• Liv-ex周度交易数据</strong>：关注波尔多份额变化、美国买家动向
</p>

<p style="color: #333; font-size: 14px; line-height: 1.7;">
<strong>• 2016波尔多十年回顾</strong>：持续关注触底酒款价格变动
</p>
</section>

<section style="background: #f5f5f5; padding: 12px; border-radius: 6px; margin-bottom: 20px;">
<p style="color: #666; font-size: 12px; margin: 0;">
<strong>🔗 信息来源</strong><br/>
• Liv-ex Talking Trade | 2026-03-06<br/>
• Liv-ex 2016 Bordeaux研究 | 2026-03-03<br/>
• The Drinks Business | 2026-03-03<br/>
• WineNews | 2026-03-04, 03-11<br/>
• Vinum Fine Wines | 2026-03-17
</p>
</section>

<section style="background: linear-gradient(135deg, #2d1424 0%, #4a1a2e 100%); padding: 18px; border-radius: 8px; text-align: center;">
<p style="color: #d4af37; font-size: 14px; font-weight: bold; margin-bottom: 8px;">📊 关键数据面板</p>
<table style="width: 100%; font-size: 13px; border-collapse: collapse;">
<tr style="border-bottom: 1px solid rgba(255,255,255,0.2);">
<td style="padding: 8px; color: #ccc;">Liv-ex 100</td>
<td style="padding: 8px; text-align: right; color: #d4af37;">+0.6% (YTD)</td>
</tr>
<tr style="border-bottom: 1px solid rgba(255,255,255,0.2);">
<td style="padding: 8px; color: #ccc;">Champagne 50</td>
<td style="padding: 8px; text-align: right; color: #d4af37;">+1.4% (YTD)</td>
</tr>
<tr style="border-bottom: 1px solid rgba(255,255,255,0.2);">
<td style="padding: 8px; color: #ccc;">波尔多份额</td>
<td style="padding: 8px; text-align: right; color: #d4af37;">46.7% (本周)</td>
</tr>
<tr style="border-bottom: 1px solid rgba(255,255,255,0.2);">
<td style="padding: 8px; color: #ccc;">美国买家份额</td>
<td style="padding: 8px; text-align: right; color: #d4af37;">27% (本周)</td>
</tr>
<tr>
<td style="padding: 8px; color: #ccc;">意酒Barolo</td>
<td style="padding: 8px; text-align: right; color: #d4af37;">Monfortino +21%</td>
</tr>
</table>
</section>

<section style="text-align: center; padding: 15px;">
<p style="color: #999; font-size: 12px; margin: 0;">
免责声明：本快讯仅供参考，不构成投资建议<br/>
数据来源：Liv-ex, WineNews, The Drinks Business, Vinum Fine Wines<br/>
发布时间：2026年3月21日
</p>
</section>`;

/**
 * 主流程
 */
async function main() {
  console.log('='.repeat(60));
  console.log('📰 生成葡萄酒行业快讯');
  console.log('='.repeat(60));
  console.log('');

  try {
    const coverPath = await generateAICover();
    
    const article = {
      title: '📰 2026.3.21 行业快讯：Liv-ex AI战略、波尔多领涨、2016年份触底',
      author: '资讯分析师',
      digest: 'Liv-ex宣布AI转型，波尔多份额升至46.7%，2016年份酒触底反弹，E&J Gallo裁员，ProWein展会进行中。',
      content: articleContent,
    };
    
    console.log('📝 标题:', article.title);
    
    const publisher = new WeChatPublisher();
    const result = await publisher.publish(article, coverPath);
    
    console.log('\n' + '='.repeat(60));
    if (result.success) {
      console.log('✅ 发布成功！');
      console.log('草稿ID:', result.draftId);
    } else {
      console.log('❌ 失败:', result.error);
    }
    
  } catch (err) {
    console.log('❌ 错误:', err.message);
  }
}

main();
