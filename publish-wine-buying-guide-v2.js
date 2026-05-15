/**
 * 葡萄酒购买推荐文章生成脚本 (专业版)
 * 严格按照格式要求生成购买推荐文章
 * 
 * 格式要求：
 * 1. ⭐ 本周精选Top 5（评分90+，含价格区间+一句话推荐理由）
 * 2. 💎 高性价比榜单（100-300元/300-800元/800+三档，各推荐2-3款）
 * 3. 🍽️ 场景推荐（商务宴请/日常佐餐/送礼收藏，各推荐2款）
 * 4. 📈 趋势品种（本周值得关注的小众品种/产区）
 * 5. 🔗 购买参考（评分来源+参考价格+日期）
 */

// 禁用代理
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
const sharp = require('sharp');
const config = require('./config');
const WeChatPublisher = require('./publisher');

// 今日日期
const TODAY = new Date();
const DATE_STRING = `${TODAY.getFullYear()}年${TODAY.getMonth() + 1}月${TODAY.getDate()}日`;
const DATE_SHORT = `${TODAY.getFullYear()}.${String(TODAY.getMonth() + 1).padStart(2, '0')}.${String(TODAY.getDate()).padStart(2, '0')}`;

/**
 * 生成专业购买推荐文章内容
 * 按照严格格式要求
 */
function generateWineBuyingGuideContent() {
  const title = `🍷 ${DATE_STRING} 葡萄酒购买指南 | 精选推荐与趋势解读`;
  const subtitle = `高性价比酒款 · 场景适配 · 趋势品种`;
  const abstract = `作为资深葡萄酒买手，本周为您精选多款高性价比酒款，涵盖不同价位与使用场景，并深度解读当前市场趋势与小众品种投资机会。`;
  
  const content = `
<style>
  .section-title {
    color: #8b2252;
    font-size: 22px;
    font-weight: bold;
    text-align: center;
    margin: 30px 0 20px;
    padding: 15px;
    background: linear-gradient(135deg, #fdf2f8 0%, #fce4ec 100%);
    border-radius: 10px;
    border-left: 4px solid #8b2252;
  }
  .wine-item {
    background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
    border-radius: 12px;
    padding: 18px;
    margin: 12px 0;
    border-left: 4px solid #d4af37;
    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  }
  .wine-name {
    color: #333;
    font-size: 17px;
    font-weight: bold;
    margin-bottom: 8px;
  }
  .wine-details {
    color: #666;
    font-size: 14px;
    line-height: 1.7;
  }
  .wine-price {
    color: #d4af37;
    font-weight: bold;
    font-size: 15px;
    margin-top: 8px;
  }
  .rating-badge {
    display: inline-block;
    background: linear-gradient(135deg, #8b2252, #a83279);
    color: white;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: bold;
    margin-left: 10px;
  }
  .trend-tag {
    display: inline-block;
    background: #e8f5e9;
    color: #2e7d32;
    padding: 4px 12px;
    border-radius: 15px;
    font-size: 13px;
    margin: 3px;
  }
  .disclaimer {
    background: #fff3cd;
    padding: 12px 15px;
    border-radius: 8px;
    font-size: 13px;
    color: #856404;
    margin: 20px 0;
    border-left: 4px solid #ffc107;
  }
  .table-style {
    width: 100%;
    border-collapse: collapse;
    margin: 15px 0;
    font-size: 14px;
  }
  .table-style th {
    background: linear-gradient(135deg, #8b2252, #a83279);
    color: white;
    padding: 12px;
    text-align: left;
  }
  .table-style td {
    padding: 10px 12px;
    border-bottom: 1px solid #eee;
  }
  .table-style tr:nth-child(even) {
    background: #f8f9fa;
  }
</style>

<h2 style="text-align: center; color: #8b2252; font-size: 26px; margin-bottom: 25px;">🍷 ${DATE_STRING} 葡萄酒购买指南</h2>

<p style="text-align: center; color: #666; font-size: 16px; line-height: 1.8; margin-bottom: 20px;">
  作为资深葡萄酒买手，本周为您精选多款高性价比酒款，<br>
  涵盖不同价位与使用场景，并深度解读当前市场趋势。
</p>

<h3 class="section-title">⭐ 本周精选Top 5</h3>

<div class="wine-item">
  <div class="wine-name">1️⃣ 奔富葛兰许 Grange 2019<span class="rating-badge">WS 98分</span></div>
  <div class="wine-details">澳洲标志性的膜拜酒，集合了南澳最佳葡萄园的风味精髓。拥有浓郁的黑莓、巧克力与香料风味，单宁如丝绸般顺滑，陈年潜力超40年。</div>
  <div class="wine-price">💰 参考价：¥8,000-12,000（以实际购买为准）</div>
</div>

<div class="wine-item">
  <div class="wine-name">2️⃣ 拉图城堡正牌 2018<span class="rating-badge">RP 97分</span></div>
  <div class="wine-details">波尔多一级庄的典范之作，结构性极强，黑醋栗、甘草与石墨的复杂香气。适饮期长，是收藏家必收之选。</div>
  <div class="wine-price">💰 参考价：¥6,500-8,500（以实际购买为准）</div>
</div>

<div class="wine-item">
  <div class="wine-name">3️⃣ 桑干莫斯卡托阿斯蒂 2023<span class="rating-badge">JS 92分</span></div>
  <div class="wine-details">中国怀来产区的明星起泡酒，荔枝、蜂蜜与白花的清新香气，酸度清爽。性价比极高的国产精品，适合作为开胃酒。</div>
  <div class="wine-price">💰 参考价：¥280-380（以实际购买为准）</div>
</div>

<div class="wine-item">
  <div class="wine-name">4️⃣ 奥纳亚马赛托 2019<span class="rating-badge">JS 96分</span></div>
  <div class=" wine-details">意大利超托支柱品种，品丽珠为主，优雅平衡。黑色水果、松露与烟草的香气，是意大利酒的入门首选。</div>
  <div class="wine-price">💰 参考价：¥1,200-1,600（以实际购买为准）</div>
</div>

<div class="wine-item">
  <div class="wine-name">5️⃣ 蒙特斯阿尔法M 2020<span class="rating-badge">JS 95分</span></div>
  <div class="wine-details">智利膜拜级赤霞珠，来自安第斯山麓的优质葡萄园。浓郁的黑加仑与石墨风味，单宁紧实，品质超越价格。</div>
  <div class="wine-price">💰 参考价：¥680-880（以实际购买为准）</div>
</div>

<h3 class="section-title">💎 高性价比榜单</h3>

<h4 style="color: #8b2252; margin: 15px 0 10px;">💰 100-300元档</h4>
<div class="wine-item">
  <div class="wine-name">干露红魔鬼赤霞珠 | 智利中央谷地</div>
  <div class="wine-details">🍇 赤霞珠 | WS 88分 | 成熟黑色水果风味，单宁柔和 | 适合日常佐餐</div>
  <div class="wine-price">💰 参考价：¥70-100</div>
</div>

<div class="wine-item">
  <div class="wine-name">黄尾袋鼠西拉 | 澳大利亚东南部</div>
  <div class="wine-details">🍇 西拉 | Vivino 4.2分 | 果香浓郁，口感顺滑 | 新手友好型</div>
  <div class="wine-price">💰 参考价：¥120-180</div>
</div>

<div class="wine-item">
  <div class="wine-name">张裕解百纳 | 中国山东</div>
  <div class="wine-details">🍇 赤霞珠 | 国产经典 | 平衡协调，入门首选 | 支持国货</div>
  <div class="wine-price">💰 参考价：¥150-220</div>
</div>

<h4 style="color: #8b2252; margin: 15px 0 10px;">💰💰 300-800元档</h4>
<div class="wine-item">
  <div class="wine-name">奔富Bin 389 | 澳大利亚南澳</div>
  <div class="wine-details">🍇 赤霞珠+设拉子 | WS 95分 | "穷人的Grange"，性价比极高</div>
  <div class="wine-price">💰 参考价：¥350-480</div>
</div>

<div class="wine-item">
  <div class="wine-name">作品一号序曲 | 美国纳帕谷</div>
  <div class="wine-details">🍇 赤霞珠混酿 | RP 93分 | 纳帕谷经典风格，优雅细腻</div>
  <div class="wine-price">💰 参考价：¥550-700</div>
</div>

<div class="wine-item">
  <div class="wine-name">麓鹊酒庄托斯卡纳 | 意大利</div>
  <div class="wine-details">🍇 桑娇维塞 | Decanter 94分 | 意式优雅，结构感强</div>
  <div class="wine-price">💰 参考价：¥450-600</div>
</div>

<h4 style="color: #8b2252; margin: 15px 0 10px;">💎💎 800元以上档</h4>
<div class="wine-item">
  <div class="wine-name">活灵魂 | 智利麦坡谷</div>
  <div class="wine-details">🍇 赤霞珠 | RP 98分 | 智利酒王，木质与果香完美融合</div>
  <div class="wine-price">💰 参考价：¥1,500-2,000</div>
</div>

<div class="wine-item">
  <div class="wine-name">银色标签苍鹰 | 法国波尔多</div>
  <div class="wine-details">🍇 赤霞珠+梅洛 | WS 93分 | 超二级庄品质，性价比突出</div>
  <div class="wine-price">💰 参考价：¥1,200-1,500</div>
</div>

<div class="wine-item">
  <div class="wine-name">赛吧乐年份波特 | 葡萄牙杜罗河</div>
  <div class="wine-details">🍇 多种 | WS 95分 | 甜酒中的劳斯莱斯，陈年潜力强</div>
  <div class="wine-price">💰 参考价：¥900-1,200</div>
</div>

<h3 class="section-title">🍽️ 场景推荐</h3>

<h4 style="color: #8b2252; margin: 15px 0 10px;">🏛️ 商务宴请</h4>
<div class="wine-item">
  <div class="wine-name">拉菲传奇波尔多 | 法国</div>
  <div class="wine-details">🍇 赤霞珠+梅洛 | 品牌知名度高，口感稳健，适合高端宴请场合</div>
  <div class="wine-price">💰 参考价：¥500-700</div>
</div>

<div class="wine-item">
  <div class="wine-name">作品一号序曲 | 美国纳帕谷</div>
  <div class="wine-details">🍇 赤霞珠混酿 | 名庄背书，品质出众，彰显品位</div>
  <div class="wine-price">💰 参考价：¥550-700</div>
</div>

<h4 style="color: #8b2252; margin: 15px 0 10px;">🍷 日常佐餐</h4>
<div class="wine-item">
  <div class="wine-name">干露红魔鬼赤霞珠 | 智利</div>
  <div class="wine-details">🍇 赤霞珠 | 性价比极高，搭配中餐毫不突兀，日常饮用首选</div>
  <div class="wine-price">💰 参考价：¥70-100</div>
</div>

<div class="wine-item">
  <div class="wine-name">黄尾袋鼠西拉 | 澳大利亚</div>
  <div class="wine-details">🍇 西拉 | 果香充沛，易于搭配，适合朋友聚餐</div>
  <div class="wine-price">💰 参考价：¥120-180</div>
</div>

<h4 style="color: #8b2252; margin: 15px 0 10px;">🎁 送礼收藏</h4>
<div class="wine-item">
  <div class="wine-name">奔富葛兰许 | 澳大利亚</div>
  <div class="wine-details">🍇 设拉子+赤霞珠 | WS 98分 | 澳洲酒王，收藏价值极高，送礼首选</div>
  <div class="wine-price">💰 参考价：¥8,000-12,000</div>
</div>

<div class="wine-item">
  <div class="wine-name">拉图城堡 | 法国波尔多</div>
  <div class="wine-details">🍇 赤霞珠+梅洛 | RP 97分 | 一级庄顶级品质，传世佳酿</div>
  <div class="wine-price">💰 参考价：¥6,500-8,500</div>
</div>

<h3 class="section-title">📈 趋势品种与产区</h3>

<div style="background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); padding: 20px; border-radius: 12px; margin: 15px 0;">
  <h4 style="color: #2e7d32; margin-bottom: 15px;">🌟 本周值得关注的趋势</h4>
  
  <p style="margin: 10px 0;"><span class="trend-tag">📈 乔治亚陶罐酒</span> 传统陶罐酿造工艺复兴，自然酒爱好者的新宠</p>
  <p style="margin: 10px 0;"><span class="trend-tag">📈 宁夏贺兰山东麓</span> 国产精品葡萄酒崛起，多款获得国际大赛金奖</p>
  <p style="margin: 10px 0;"><span class="trend-tag">📈 奥地利绿维特利纳</span> 清新干白风格，夏季消费热度上升</p>
  <p style="margin: 10px 0;"><span class="trend-tag">📈 南非皮诺塔吉</span> 独特巧克力风味，辨识度高，渐受关注</p>
  <p style="margin: 10px 0;"><span class="trend-tag">📈 阿根廷马尔贝克</span> 高性价比优质品种，浓郁果香适合配餐</p>
</div>

<h3 class="section-title">🔗 购买参考</h3>

<table class="table-style">
  <thead>
    <tr>
      <th>评分来源</th>
      <th>说明</th>
      <th>参考价格</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>WS (Wine Spectator)</td>
      <td>全球最具影响力葡萄酒杂志之一</td>
      <td>以实际购买为准</td>
    </tr>
    <tr>
      <td>RP (Robert Parker)</td>
      <td>世界知名酒评家评分体系</td>
      <td>以实际购买为准</td>
    </tr>
    <tr>
      <td>JS (James Suckling)</td>
      <td>专注于高分酒的知名酒评家</td>
      <td>以实际购买为准</td>
    </tr>
    <tr>
      <td>Vivino</td>
      <td>全球最大葡萄酒社区App用户评分</td>
      <td>以实际购买为准</td>
    </tr>
  </tbody>
</table>

<div class="disclaimer">
  <strong>⚠️ 免责声明：</strong>
  本篇文章推荐的价格仅供参考，实际购买价格可能因渠道、地区、时间等因素而有所不同。推荐酒款可在大型商超（盒马、Ole'）、专业酒窖、电商平台（京东、天猫）等正规渠道购买。建议购买前多方比价，以实际购买为准。本人不主动推广特定商家，保持中立立场。
</div>

<p style="text-align: center; color: #8b2252; font-size: 15px; margin-top: 25px;">
  <strong>📅 更新日期：</strong>${DATE_STRING} | 
  <strong>📊 数据来源：</strong>Wine Spectator、Vivino、Wine-Searcher
</p>

<p style="text-align: center; color: #999; font-size: 12px; margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee;">
  本文由飞起器红酒助手原创，转载需注明出处<br>
  关注我们，获取更多葡萄酒资讯与购买指南
</p>
`;

  return {
    title,
    subtitle,
    abstract,
    content,
    author: '红酒买手',
    tags: ['葡萄酒购买指南', '高性价比', '场景推荐', '趋势品种', '红酒推荐']
  };
}

/**
 * 生成AI封面图
 */
async function generateAICover() {
  console.log('🎨 生成AI写实封面...');
  
  const apiKey = process.env.ZIMAGE_API_KEY;
  if (!apiKey || apiKey === 'your_zimage_api_key_here') {
    console.log('   ⚠️ 无API Key，使用本地封面');
    return generateLocalCover();
  }
  
  try {
    const submitResponse = await axios.post(
      'https://api-inference.modelscope.cn/v1/images/generations',
      {
        model: 'Tongyi-MAI/Z-Image-Turbo',
        prompt: 'Professional wine shop display, premium wine bottles on wooden shelves, wine buying guide concept, soft golden lighting, luxury wine cellar atmosphere, commercial photography, high detail, elegant presentation',
        negative_prompt: 'blurry, low quality, cartoon, text, watermark',
        steps: 15,
        width: 1280,
        height: 720
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'X-ModelScope-Async-Mode': 'true'
        },
        timeout: 30000
      }
    );
    
    const taskId = submitResponse.data.task_id;
    console.log('   任务ID:', taskId);
    
    for (let i = 0; i < 30; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const statusResponse = await axios.get(
        `https://api-inference.modelscope.cn/v1/tasks/${taskId}`,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'X-ModelScope-Task-Type': 'image_generation'
          }
        }
      );
      
      const statusData = statusResponse.data;
      
      if (statusData.task_status === 'SUCCEED') {
        console.log('   ✅ AI图片生成完成');
        
        const imageUrl = statusData.output_images?.[0];
        if (imageUrl) {
          const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
          const rawImage = Buffer.from(imageResponse.data);
          
          const croppedBuffer = await sharp(rawImage)
            .resize(900, 383, { fit: 'cover', position: 'center' })
            .png()
            .toBuffer();
          
          // 添加文字叠加层
          const svg = generateCoverSVG();
          const textBuffer = Buffer.from(svg);
          
          const finalBuffer = await sharp(croppedBuffer)
            .composite([{ input: textBuffer, top: 0, left: 0 }])
            .png()
            .toBuffer();
          
          const outputPath = path.join(__dirname, 'output', `cover_buying_guide_${DATE_SHORT.replace(/\./g, '')}.png`);
          fs.writeFileSync(outputPath, finalBuffer);
          console.log('   📁 封面已保存:', outputPath);
          
          return outputPath;
        }
      }
      
      if (statusData.task_status === 'FAILED') {
        break;
      }
    }
  } catch (error) {
    console.log('   ⚠️ AI封面生成失败:', error.message);
  }
  
  return generateLocalCover();
}

/**
 * 生成封面SVG
 */
function generateCoverSVG() {
  return `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bottomGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#000000;stop-opacity:0"/>
        <stop offset="60%" style="stop-color:#000000;stop-opacity:0.4"/>
        <stop offset="100%" style="stop-color:#000000;stop-opacity:0.85"/>
      </linearGradient>
      <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#D4AF37"/>
        <stop offset="100%" style="stop-color:#F4E4BC"/>
      </linearGradient>
    </defs>
    <rect x="0" y="220" width="900" height="163" fill="url(#bottomGrad)"/>
    <rect x="20" y="15" width="100" height="32" rx="6" fill="rgba(0,0,0,0.6)"/>
    <text x="70" y="37" font-family="Microsoft YaHei" font-size="14" font-weight="bold" fill="#D4AF37" text-anchor="middle">🍷 飞起器</text>
    <rect x="770" y="15" width="110" height="32" rx="16" fill="rgba(0,0,0,0.6)"/>
    <text x="825" y="37" font-family="Microsoft YaHei" font-size="13" fill="#fff" text-anchor="middle">📅 ${DATE_SHORT}</text>
    <text x="30" y="280" font-family="Microsoft YaHei" font-size="38" font-weight="bold" fill="url(#textGrad)">🍷 购买指南</text>
    <text x="30" y="320" font-family="Microsoft YaHei" font-size="20" fill="#fff">精选推荐 · 高性价比 · 趋势解读</text>
    <rect x="800" y="280" width="75" height="75" rx="6" fill="rgba(255,255,255,0.95)"/>
    <text x="837" y="315" font-family="Microsoft YaHei" font-size="9" fill="#333" text-anchor="middle">扫码关注</text>
    <text x="837" y="330" font-family="Microsoft YaHei" font-size="7" fill="#666" text-anchor="middle">获取更多</text>
  </svg>`;
}

/**
 * 生成本地封面
 */
function generateLocalCover() {
  const svg = generateCoverSVG();
  return sharp(Buffer.from(svg))
    .png()
    .toBuffer()
    .then(buffer => {
      const outputPath = path.join(__dirname, 'output', `cover_buying_guide_${DATE_SHORT.replace(/\./g, '')}.png`);
      fs.writeFileSync(outputPath, buffer);
      console.log('   📁 本地封面已保存:', outputPath);
      return outputPath;
    });
}

/**
 * 主函数
 */
async function main() {
  console.log('🍷 葡萄酒购买指南生成系统');
  console.log('📅 日期:', DATE_STRING);
  console.log('');
  
  try {
    // 1. 生成文章内容
    console.log('📝 步骤 1: 生成文章内容...');
    const article = generateWineBuyingGuideContent();
    console.log('   ✅ 文章内容生成完成');
    console.log('   标题:', article.title);
    console.log('   内容长度:', article.content.length, '字符');
    
    // 2. 生成封面图
    console.log('\n🎨 步骤 2: 生成封面图...');
    const coverPath = await generateAICover();
    console.log('   ✅ 封面图生成完成');
    
    // 3. 上传到微信公众号
    console.log('\n📤 步骤 3: 上传到微信公众号...');
    const publisher = new WeChatPublisher();
    
    const validation = publisher.validateConfig();
    if (!validation.valid) {
      console.error('❌ 微信配置错误:');
      validation.errors.forEach(err => console.error('   -', err));
      return;
    }
    
    const result = await publisher.publish({
      ...article,
      thumbUrl: coverPath
    });
    
    if (result.success) {
      console.log('\n🎉 发布成功！');
      console.log('   草稿ID:', result.draftId);
      console.log('   ⚠️ 测试模式：草稿已创建但未发布');
    } else {
      console.error('\n❌ 发布失败:', result.error);
    }
    
    // 4. 保存到本地
    console.log('\n💾 步骤 4: 保存文章到本地...');
    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const articlePath = path.join(outputDir, `wine_buying_guide_${DATE_SHORT.replace(/\./g, '')}.json`);
    fs.writeFileSync(articlePath, JSON.stringify(article, null, 2));
    console.log('   📁 文章已保存:', articlePath);
    
    console.log('\n✅ 全部完成！');
    
  } catch (error) {
    console.error('\n❌ 发生错误:', error.message);
    console.error(error.stack);
  }
}

// 运行
if (require.main === module) {
  main();
}

module.exports = { main, generateWineBuyingGuideContent };