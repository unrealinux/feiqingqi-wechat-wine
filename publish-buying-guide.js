/**
 * 葡萄酒购买推荐文章发布脚本
 * 包含AI封面生成、文章发布
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
 * 使用Z-Image生成AI封面
 */
async function generateAICover() {
  const apiKey = process.env.ZIMAGE_API_KEY;
  
  console.log('🎨 生成AI写实封面...');
  
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
        prompt: 'An elegant wine selection display, multiple premium wine bottles arranged on wooden shelf, crystal wine glasses with red and white wine, soft warm lighting, luxury wine shop atmosphere, professional commercial photography, rich colors, high detail',
        negative_prompt: 'blurry, low quality, cartoon, text, watermark',
        steps: 12,
        width: 1280,
        height: 720
      })
    }
  );
  
  const submitData = await submitResponse.json();
  const taskId = submitData.task_id;
  
  console.log('   任务ID:', taskId);
  
  // 轮询状态
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
      console.log('   ✅ AI图片生成完成');
      
      const imageUrl = statusData.output_images?.[0];
      if (imageUrl) {
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = await imageResponse.arrayBuffer();
        const rawImage = Buffer.from(imageBuffer);
        
        // 裁剪为微信封面尺寸
        const croppedBuffer = await sharp(rawImage)
          .resize(900, 383, { fit: 'cover', position: 'center' })
          .png()
          .toBuffer();
        
        // 添加文字
        const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#D4AF37"/>
              <stop offset="100%" style="stop-color:#F4E4BC"/>
            </linearGradient>
            <filter id="shadow">
              <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.7"/>
            </filter>
          </defs>
          <rect x="0" y="260" width="900" height="123" fill="rgba(0,0,0,0.7)"/>
          <text x="30" y="310" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🍷 2026年葡萄酒购买指南</text>
          <text x="30" y="355" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="18" fill="rgba(255,255,255,0.9)">高性价比酒款 · 场景推荐 · 趋势品种</text>
          <text x="870" y="370" font-family="Microsoft YaHei, sans-serif" font-size="14" fill="#D4AF37" text-anchor="end">2026-03</text>
        </svg>`;
        
        const textBuffer = Buffer.from(svg);
        
        const finalBuffer = await sharp(croppedBuffer)
          .composite([{ input: textBuffer, top: 0, left: 0 }])
          .png()
          .toBuffer();
        
        const outputPath = path.join(__dirname, 'output', 'cover_buying_guide.png');
        fs.writeFileSync(outputPath, finalBuffer);
        console.log('   📁 封面已保存:', outputPath);
        
        return outputPath;
      }
    }
    
    if (statusData.task_status === 'FAILED') {
      throw new Error('AI图片生成失败');
    }
  }
  
  throw new Error('AI图片生成超时');
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
    console.log('\n📤 发布到微信公众号...');
    try {
      console.log('   获取Token...');
      await this.getAccessToken();
      
      console.log('   上传封面...');
      const thumbMediaId = await this.uploadImage(coverPath);
      
      console.log('   创建草稿...');
      const draftId = await this.createDraft(article, thumbMediaId);
      
      return { success: true, draftId };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}

/**
 * 优化排版的HTML内容
 */
const articleContent = `<section style="margin-bottom: 20px;">
<p style="color: #999; font-size: 13px; text-align: center;">截至2026年3月 | 资深葡萄酒买手精选</p>
</section>

<section style="background: linear-gradient(135deg, #1a0a10 0%, #2d1424 100%); padding: 25px; border-radius: 10px; margin-bottom: 25px;">
<p style="color: #f5e6d3; font-size: 16px; line-height: 1.9; margin: 0;">
选酒不必纠结！本期为您精选<strong style="color: #d4af37;">Wine Spectator Top 100</strong>高分酒款与<strong style="color: #d4af37;">Vivino热门推荐</strong>，覆盖100-2000+元全价位，无论商务宴请还是日常佐餐，都能找到心仪之选。
</p>
</section>

<section style="margin-bottom: 28px;">
<h2 style="color: #2d1424; font-size: 20px; border-left: 4px solid #8b2252; padding-left: 12px; margin-bottom: 18px;">⭐ 本周精选Top 5（评分90+）</h2>

<section style="background: #faf8f5; padding: 18px; border-radius: 8px;">
<p style="color: #8b2252; font-weight: bold; margin-bottom: 15px;">🏆 Wine Spectator 2025年度精选</p>

<p style="color: #333; line-height: 1.8; margin-bottom: 15px;">
<strong style="color: #2d1424;">1. Château Giscours Margaux 2022</strong><br/>
<span style="color: #d4af37;">评分：95分 | 价格：约800-1200元</span><br/>
<span style="color: #666;">WS年度第一名，经典波尔多三级庄，黑醋栗、雪松、石墨香气，结构优雅，余味悠长。</span>
</p>

<p style="color: #333; line-height: 1.8; margin-bottom: 15px;">
<strong style="color: #2d1424;">2. Aubert Chardonnay Sonoma Coast UV-SL 2023</strong><br/>
<span style="color: #d4af37;">评分：96分 | 价格：约600-900元</span><br/>
<span style="color: #666;">WS年度第二名，新世界霞多丽典范，柑橘、白桃、矿物质层次丰富。</span>
</p>

<p style="color: #333; line-height: 1.8; margin-bottom: 15px;">
<strong style="color: #2d1424;">3. Ridge Lytton Springs Dry Creek Valley 2023</strong><br/>
<span style="color: #d4af37;">评分：95分 | 价格：约400-600元</span><br/>
<span style="color: #666;">WS年度第三名，仙粉黛主导混酿，黑莓、李子、香料，层次感极佳。</span>
</p>

<p style="color: #333; line-height: 1.8; margin-bottom: 15px;">
<strong style="color: #2d1424;">4. Château Beau-Séjour Bécot St.-Emilion 2022</strong><br/>
<span style="color: #d4af37;">评分：96分 | 价格：约500-800元</span><br/>
<span style="color: #666;">WS第五名，梅洛为主，花香与红色水果交织，粉末般质地，梦幻级。</span>
</p>

<p style="color: #333; line-height: 1.8;">
<strong style="color: #2d1424;">5. Castello di Ama Chianti Classico Gran Selezione 2021</strong><br/>
<span style="color: #d4af37;">评分：96分 | 价格：约350-500元</span><br/>
<span style="color: #666;">WS第七名，桑娇维塞+梅洛，黑樱桃、紫罗兰、烟草，力量与优雅兼具。</span>
</p>
</section>
</section>

<section style="margin-bottom: 28px;">
<h2 style="color: #2d1424; font-size: 20px; border-left: 4px solid #8b2252; padding-left: 12px; margin-bottom: 18px;">💎 高性价比榜单</h2>

<section style="background: #e8f5e9; padding: 18px; border-radius: 8px; margin-bottom: 15px;">
<p style="color: #2e7d32; font-weight: bold; margin-bottom: 12px;">💚 100-300元档（入门优选）</p>

<p style="color: #333; line-height: 1.8; margin-bottom: 10px;">
<strong>• Michele Chiarlo Barbera d'Asti Le Orme 2023</strong><br/>
<span style="color: #d4af37;">WS 90分 | 约130元 | WS Top 10 Values</span><br/>
<span style="color: #666;">意大利经典巴贝拉，性价比之王，适合日常饮用。</span>
</p>

<p style="color: #333; line-height: 1.8; margin-bottom: 10px;">
<strong>• Ravenswood Zinfandel Dry Creek Valley 2023</strong><br/>
<span style="color: #d4af37;">WS 92分 | 约190元 | WS Top 100</span><br/>
<span style="color: #666;">老藤仙粉黛，浓郁果香，美国高性价比代表。</span>
</p>

<p style="color: #333; line-height: 1.8;">
<strong>• Bodegas Muga Rioja Reserva 2021</strong><br/>
<span style="color: #d4af37;">WS 92分 | 约280元 | WS 2025年度最佳性价比</span><br/>
<span style="color: #666;">西班牙里奥哈经典，陈年潜力佳，WS年度最佳性价比酒款。</span>
</p>
</section>

<section style="background: #fff3e0; padding: 18px; border-radius: 8px; margin-bottom: 15px;">
<p style="color: #e65100; font-weight: bold; margin-bottom: 12px;">🧡 300-800元档（品质进阶）</p>

<p style="color: #333; line-height: 1.8; margin-bottom: 10px;">
<strong>• Tenuta di Arceno Chianti Classico 2022</strong><br/>
<span style="color: #d4af37;">WS 93分 | 约210元 | WS Top 10 Values</span><br/>
<span style="color: #666;">托斯卡纳经典，WS年度Top 10性价比酒款，黑樱桃与烟草。</span>
</p>

<p style="color: #333; line-height: 1.8; margin-bottom: 10px;">
<strong>• La Crema Pinot Noir Willamette Valley 2022</strong><br/>
<span style="color: #d4af37;">WS 92分 | 约200元 | WS Top 10 Values</span><br/>
<span style="color: #666;">俄勒冈黑皮诺，优雅细腻，花香果味交织。</span>
</p>

<p style="color: #333; line-height: 1.8;">
<strong>• Cloudy Bay Sauvignon Blanc 2024</strong><br/>
<span style="color: #d4af37;">WS 91分 | 约250元 | 新西兰经典</span><br/>
<span style="color: #666;">马尔堡长相思标杆，青草、柑橘、矿物感清新。</span>
</p>
</section>

<section style="background: #fce4ec; padding: 18px; border-radius: 8px;">
<p style="color: #c2185b; font-weight: bold; margin-bottom: 12px;">❤️ 800元以上档（高端臻选）</p>

<p style="color: #333; line-height: 1.8; margin-bottom: 10px;">
<strong>• Opus One 2021</strong><br/>
<span style="color: #d4af37;">JS 97分 | 约2800元 | 纳帕谷膜拜酒</span><br/>
<span style="color: #666;">波尔多+纳帕的完美融合，黑醋栗、巧克力、雪松，收藏级。</span>
</p>

<p style="color: #333; line-height: 1.8; margin-bottom: 10px;">
<strong>• Penfolds Grange 2020</strong><br/>
<span style="color: #d4af37;">RP 98分 | 约3500元 | 澳洲酒王</span><br/>
<span style="color: #666;">西拉主导，浓缩深邃，陈年潜力30年+，投资收藏首选。</span>
</p>

<p style="color: #333; line-height: 1.8;">
<strong>• Sassicaia 2021</strong><br/>
<span style="color: #d4af37;">WA 97分 | 约2200元 | 超级托斯卡纳</span><br/>
<span style="color: #666;">赤霞珠+品丽珠，意大利名庄，结构宏大，经典永恒。</span>
</p>
</section>
</section>

<section style="margin-bottom: 28px;">
<h2 style="color: #2d1424; font-size: 20px; border-left: 4px solid #8b2252; padding-left: 12px; margin-bottom: 18px;">🍽️ 场景推荐</h2>

<section style="background: #f3e5f5; padding: 18px; border-radius: 8px; margin-bottom: 15px;">
<p style="color: #7b1fa2; font-weight: bold; margin-bottom: 12px;">👔 商务宴请</p>

<p style="color: #333; line-height: 1.8; margin-bottom: 10px;">
<strong>• Château Giscours Margaux 2022</strong><br/>
<span style="color: #666;">WS 95分，年度最佳，彰显品味与实力，800-1200元</span>
</p>

<p style="color: #333; line-height: 1.8;">
<strong>• Opus One 2021</strong><br/>
<span style="color: #666;">JS 97分，顶级膜拜酒，商务场合的"硬通货"，2800元+</span>
</p>
</section>

<section style="background: #e0f2f1; padding: 18px; border-radius: 8px; margin-bottom: 15px;">
<p style="color: #00695c; font-weight: bold; margin-bottom: 12px;">🍕 日常佐餐</p>

<p style="color: #333; line-height: 1.8; margin-bottom: 10px;">
<strong>• Michele Chiarlo Barbera d'Asti Le Orme 2023</strong><br/>
<span style="color: #666;">WS 90分，百元级性价比之王，配红肉、披萨完美，约130元</span>
</p>

<p style="color: #333; line-height: 1.8;">
<strong>• Cloudy Bay Sauvignon Blanc 2024</strong><br/>
<span style="color: #666;">WS 91分，清爽百搭，海鲜、沙拉绝配，约250元</span>
</p>
</section>

<section style="background: #fff8e1; padding: 18px; border-radius: 8px;">
<p style="color: #f57f17; font-weight: bold; margin-bottom: 12px;">🎁 送礼收藏</p>

<p style="color: #333; line-height: 1.8; margin-bottom: 10px;">
<strong>• Penfolds Grange 2020</strong><br/>
<span style="color: #666;">RP 98分，澳洲酒王，送礼有面子，收藏有潜力，3500元+</span>
</p>

<p style="color: #333; line-height: 1.8;">
<strong>• Sassicaia 2021</strong><br/>
<span style="color: #666;">WA 97分，超级托斯卡纳经典，送懂酒之人首选，约2200元</span>
</p>
</section>
</section>

<section style="margin-bottom: 28px;">
<h2 style="color: #2d1424; font-size: 20px; border-left: 4px solid #8b2252; padding-left: 12px; margin-bottom: 18px;">📈 趋势品种</h2>

<section style="background: linear-gradient(135deg, #fff9f0 0%, #fff5e6 100%); padding: 18px; border-radius: 8px; border-left: 3px solid #d4af37;">
<p style="color: #8b4513; line-height: 1.9; margin: 0;">
<strong>🔥 2026年值得关注的小众品种/产区</strong><br/><br/>
<strong>1. 意大利Barbera</strong><br/>
<span style="color: #666;">皮埃蒙特经典，酸度清爽，性价比极高，Michele Chiarlo表现亮眼。</span><br/><br/>
<strong>2. 西班牙Rioja白葡萄酒</strong><br/>
<span style="color: #666;">Viura品种，清新矿物感，被低估的宝藏产区，21美元起步。</span><br/><br/>
<strong>3. 新西兰黑皮诺</strong><br/>
<span style="color: #666;">Central Otago崛起，媲美勃艮第的优雅，价格更亲民。</span><br/><br/>
<strong>4. 美国Dry Creek Valley仙粉黛</strong><br/>
<span style="color: #666;">老藤Zinfandel，浓郁复杂，Ravenswood、Ridge表现稳定。</span>
</p>
</section>
</section>

<section style="margin-bottom: 28px;">
<h2 style="color: #2d1424; font-size: 20px; border-left: 4px solid #8b2252; padding-left: 12px; margin-bottom: 18px;">🔗 购买参考</h2>

<section style="background: #faf8f5; padding: 18px; border-radius: 8px;">
<table style="width: 100%; font-size: 13px; border-collapse: collapse;">
<tr style="border-bottom: 2px solid #d4af37;">
<td style="padding: 10px; font-weight: bold; color: #2d1424;">酒款</td>
<td style="padding: 10px; text-align: center; font-weight: bold; color: #2d1424;">评分</td>
<td style="padding: 10px; text-align: right; font-weight: bold; color: #2d1424;">参考价</td>
</tr>
<tr style="border-bottom: 1px solid #e8e0d8;">
<td style="padding: 8px; color: #333;">Château Giscours 2022</td>
<td style="padding: 8px; text-align: center; color: #d4af37;">WS 95</td>
<td style="padding: 8px; text-align: right;">¥800-1200</td>
</tr>
<tr style="border-bottom: 1px solid #e8e0d8;">
<td style="padding: 8px; color: #333;">Muga Rioja Reserva 2021</td>
<td style="padding: 8px; text-align: center; color: #d4af37;">WS 92</td>
<td style="padding: 8px; text-align: right;">¥280</td>
</tr>
<tr style="border-bottom: 1px solid #e8e0d8;">
<td style="padding: 8px; color: #333;">Michele Chiarlo Barbera 2023</td>
<td style="padding: 8px; text-align: center; color: #d4af37;">WS 90</td>
<td style="padding: 8px; text-align: right;">¥130</td>
</tr>
<tr style="border-bottom: 1px solid #e8e0d8;">
<td style="padding: 8px; color: #333;">Ravenswood Zinfandel 2023</td>
<td style="padding: 8px; text-align: center; color: #d4af37;">WS 92</td>
<td style="padding: 8px; text-align: right;">¥190</td>
</tr>
<tr>
<td style="padding: 8px; color: #333;">Opus One 2021</td>
<td style="padding: 8px; text-align: center; color: #d4af37;">JS 97</td>
<td style="padding: 8px; text-align: right;">¥2800+</td>
</tr>
</table>

<p style="color: #999; font-size: 12px; margin-top: 15px; margin-bottom: 0;">
数据来源：Wine Spectator Top 100 2025、Vivino、Wine-Searcher<br/>
参考价格：以实际购买为准，可能因渠道和地区有差异
</p>
</section>
</section>

<section style="background: linear-gradient(135deg, #2d1424 0%, #4a1a2e 100%); padding: 22px; border-radius: 10px; text-align: center;">
<p style="color: #d4af37; font-size: 16px; font-weight: bold; margin-bottom: 8px;">🍷 选酒小贴士</p>
<p style="color: #f5e6d3; font-size: 14px; line-height: 1.8; margin: 0;">
日常饮用：100-300元，选WS 90+高性价比款<br/>
宴请送礼：500-1500元，选名庄经典年份<br/>
投资收藏：2000元+，选顶级评分+稀缺年份
</p>
<p style="color: #999; font-size: 12px; margin-top: 15px; margin-bottom: 0;">
免责声明：本推荐仅供参考，价格以实际购买为准<br/>
数据更新：2026年3月
</p>
</section>`;

/**
 * 主流程
 */
async function main() {
  console.log('='.repeat(60));
  console.log('🍷 生成葡萄酒购买推荐文章');
  console.log('='.repeat(60));
  console.log('');

  try {
    // 1. 生成AI封面
    const coverPath = await generateAICover();
    
    // 2. 准备文章
    const article = {
      title: '🍷 2026年葡萄酒购买指南：高性价比酒款+场景推荐',
      author: '红酒顾问',
      digest: 'Wine Spectator Top 100精选，覆盖100-3000+元全价位，商务宴请/日常佐餐/送礼收藏全覆盖。',
      content: articleContent,
    };
    
    console.log('\n📝 文章标题:', article.title);
    
    // 3. 发布
    const publisher = new WeChatPublisher();
    const result = await publisher.publish(article, coverPath);
    
    console.log('\n' + '='.repeat(60));
    if (result.success) {
      console.log('✅ 发布成功！');
      console.log('草稿ID:', result.draftId);
      console.log('\n请登录 https://mp.weixin.qq.com 查看草稿');
    } else {
      console.log('❌ 失败:', result.error);
    }
    
  } catch (err) {
    console.log('❌ 错误:', err.message);
  }
}

main();
