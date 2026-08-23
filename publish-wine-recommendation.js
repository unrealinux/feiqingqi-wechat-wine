/**
 * 红酒推荐日更文章生成和发布脚本 (优化版)
 * 生成今日红酒推荐文章并上传到微信公众号草稿箱
 * 
 * 优化内容：
 * - 封面图：渐变背景、品牌logo、多种模板、二维码占位
 * - 文章排版：卡片式布局、引用框、分隔线、色彩搭配、互动元素
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
const FormData = require('form-data');
const config = require('./config');
const WeChatPublisher = require('./publisher');

// 今日日期
const TODAY = new Date();
const DATE_STRING = `${TODAY.getFullYear()}年${TODAY.getMonth() + 1}月${TODAY.getDate()}日`;
const DATE_SHORT = `${TODAY.getFullYear()}.${String(TODAY.getMonth() + 1).padStart(2, '0')}.${String(TODAY.getDate()).padStart(2, '0')}`;

// 封面模板配置
const COVER_TEMPLATES = {
  elegant: {
    name: '优雅',
    gradient: ['#1a0a1a', '#3d1c3d', '#8b2252'],
    accent: '#d4af37',
    textColor: '#f4e4bc',
    description: '深紫到酒红渐变，金色点缀'
  },
  luxury: {
    name: '奢华',
    gradient: ['#0d0d0d', '#2d1b2d', '#4a1a2e'],
    accent: '#ffd700',
    textColor: '#ffffff',
    description: '黑色到深红渐变，金色点缀'
  },
  minimal: {
    name: '简约',
    gradient: ['#2c2c2c', '#3d3d3d', '#4d4d4d'],
    accent: '#e74c3c',
    textColor: '#ffffff',
    description: '灰色系渐变，红色点缀'
  },
  vintage: {
    name: '复古',
    gradient: ['#2e1a0e', '#4a2c1a', '#6b3a1f'],
    accent: '#d4a574',
    textColor: '#f5deb3',
    description: '棕色系渐变，复古风格'
  }
};

/**
 * 生成红酒推荐文章内容 (优化版)
 * 包含卡片式布局、引用框、分隔线、色彩搭配、互动元素
 */
function generateWineRecommendationContent() {
  const title = `🍷 ${DATE_STRING} 红酒推荐 | 今日精选5款佳酿`;
  const subtitle = `从入门到进阶，总有一款适合你`;
  const abstract = `今天为大家精心挑选了5款不同风格的红酒，涵盖不同价位和口味偏好，无论你是红酒新手还是资深爱好者，都能找到心仪之选。`;
  
  // 微信公众号富文本样式
  const styles = `
<style>
  .wine-card {
    background: linear-gradient(135deg, #fdfcfb 0%, #f5f0eb 100%);
    border-radius: 12px;
    padding: 20px;
    margin: 15px 0;
    border-left: 4px solid #8b2252;
    box-shadow: 0 2px 8px rgba(139, 34, 82, 0.1);
  }
  .wine-title {
    color: #8b2252;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 12px;
    border-bottom: 2px dashed #d4af37;
    padding-bottom: 8px;
  }
  .wine-info {
    color: #666;
    font-size: 14px;
    line-height: 1.8;
  }
  .wine-rating {
    color: #d4af37;
    font-size: 16px;
    margin-top: 10px;
  }
  .quote-box {
    background: linear-gradient(135deg, #fff9e6 0%, #fff3cd 100%);
    border-left: 4px solid #d4af37;
    padding: 15px 20px;
    margin: 20px 0;
    border-radius: 0 8px 8px 0;
    font-style: italic;
    color: #856404;
  }
  .tip-box {
    background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%);
    border-left: 4px solid #28a745;
    padding: 15px 20px;
    margin: 20px 0;
    border-radius: 0 8px 8px 0;
    color: #155724;
  }
  .divider {
    height: 2px;
    background: linear-gradient(90deg, transparent, #d4af37, transparent);
    margin: 25px 0;
  }
  .interaction-box {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 12px;
    padding: 20px;
    margin: 20px 0;
    text-align: center;
    border: 2px dashed #8b2252;
  }
  .hashtag {
    color: #8b2252;
    font-weight: bold;
    background: #fdf2f8;
    padding: 2px 8px;
    border-radius: 4px;
    margin: 0 3px;
  }
</style>`;

  const content = `
${styles}

<h2 style="color: #8b2252; text-align: center; font-size: 24px; margin-bottom: 20px;">🌅 春日红酒精选</h2>

<div class="quote-box">
  "一杯红酒，一段时光，品味生活的美好。"<br>
  <small>— 飞起器红酒助手</small>
</div>

<p style="text-align: center; color: #666; font-size: 16px; line-height: 1.8;">
  春风渐暖，万物复苏，正是品饮红酒的好时节。<br>
  今天，我们为大家精心挑选了<strong style="color: #8b2252;">5款不同风格</strong>的红酒，<br>
  从百元入门到千元珍藏，总有一款适合你。
</p>

<div class="divider"></div>

<h2 style="color: #8b2252; text-align: center; font-size: 22px;">🍷 今日推荐酒款</h2>

<div class="wine-card">
  <div class="wine-title">1️⃣ 澳洲奔富Bin 389 | 经典之作</div>
  <div class="wine-info">
    <p><strong>🌍 产区：</strong>南澳大利亚</p>
    <p><strong>🍇 葡萄品种：</strong>赤霞珠、设拉子混酿</p>
    <p><strong>💰 价格区间：</strong>¥350-450</p>
    <p><strong>📝 推荐理由：</strong>被称为"穷人的Grange"，Bin 389以其卓越的品质和相对亲民的价格，成为全球最受欢迎的澳洲红酒之一。2020年份表现优异，带有黑莓、巧克力和橡木的香气，单宁柔和，余味悠长。</p>
    <p><strong>🍽️ 配餐建议：</strong>烤羊排、牛排、硬质奶酪</p>
  </div>
  <div class="wine-rating">⭐⭐⭐⭐⭐</div>
</div>

<div class="wine-card">
  <div class="wine-title">2️⃣ 智利干露红魔鬼赤霞珠 | 入门首选</div>
  <div class="wine-info">
    <p><strong>🌍 产区：</strong>中央谷地</p>
    <p><strong>🍇 葡萄品种：</strong>赤霞珠</p>
    <p><strong>💰 价格区间：</strong>¥60-100</p>
    <p><strong>📝 推荐理由：</strong>作为智利最大的出口品牌，红魔鬼以其稳定的品质和超高的性价比著称。这款赤霞珠带有成熟的黑色水果香气，如黑加仑和李子，单宁圆润，非常易饮。</p>
    <p><strong>🍽️ 配餐建议：</strong>披萨、意大利面、烤肉</p>
  </div>
  <div class="wine-rating">⭐⭐⭐⭐</div>
</div>

<div class="wine-card">
  <div class="wine-title">3️⃣ 法国波尔多中级庄 | 中端之选</div>
  <div class="wine-info">
    <p><strong>🌍 产区：</strong>波尔多上梅多克</p>
    <p><strong>🍇 葡萄品种：</strong>赤霞珠、梅洛混酿</p>
    <p><strong>💰 价格区间：</strong>¥200-350</p>
    <p><strong>📝 推荐理由：</strong>波尔多中级庄是性价比极高的选择，既有波尔多的经典风格，又不会让钱包"大出血"。推荐2018或2019年份，这两个年份气候条件极佳，酿出的酒款品质优秀。带有红黑水果、烟草和雪松的复杂香气。</p>
    <p><strong>🍽️ 配餐建议：</strong>烤鸭、红烧肉、野味</p>
  </div>
  <div class="wine-rating">⭐⭐⭐⭐½</div>
</div>

<div class="wine-card">
  <div class="wine-title">4️⃣ 意大利巴罗洛 | 老饕之选</div>
  <div class="wine-info">
    <p><strong>🌍 产区：</strong>皮埃蒙特</p>
    <p><strong>🍇 葡萄品种：</strong>内比奥罗</p>
    <p><strong>💰 价格区间：</strong>¥400-800</p>
    <p><strong>📝 推荐理由：</strong>巴罗洛被誉为"酒中之王"，以其复杂的香气和强大的陈年潜力著称。需要较长的醒酒时间（建议2小时以上），醒开后会有玫瑰、焦油、樱桃和香料的迷人香气。适合有一定品酒经验的朋友。</p>
    <p><strong>🍽️ 配餐建议：</strong>松露菜肴、炖肉、陈年奶酪</p>
  </div>
  <div class="wine-rating">⭐⭐⭐⭐⭐</div>
</div>

<div class="wine-card">
  <div class="wine-title">5️⃣ 中国宁夏贺兰山东麓 | 国货之光</div>
  <div class="wine-info">
    <p><strong>🌍 产区：</strong>宁夏贺兰山东麓</p>
    <p><strong>🍇 葡萄品种：</strong>赤霞珠</p>
    <p><strong>💰 价格区间：</strong>¥150-300</p>
    <p><strong>📝 推荐理由：</strong>近年来，宁夏产区的红酒品质突飞猛进，在国际大赛中屡获金奖。这款赤霞珠有着深邃的宝石红色泽，带有黑色水果、青椒和矿物质的香气，酒体饱满，单宁细腻。支持国货的绝佳选择！</p>
    <p><strong>🍽️ 配餐建议：</strong>火锅、烤串、川菜</p>
  </div>
  <div class="wine-rating">⭐⭐⭐⭐</div>
</div>

<div class="divider"></div>

<div class="tip-box">
  <h3 style="color: #28a745; margin-bottom: 12px;">💡 选酒小贴士</h3>
  <p>1. <strong>看年份：</strong>红酒并非越老越好，大多数红酒适合在3-5年内饮用。</p>
  <p>2. <strong>看产区：</strong>知名产区的酒款通常更有保障，如波尔多、勃艮第、纳帕谷等。</p>
  <p>3. <strong>看评分：</strong>可以参考专业评分，但也要相信自己的味蕾。</p>
  <p>4. <strong>看配餐：</strong>不同的酒款适合搭配不同的食物，选对配餐能让体验更上一层楼。</p>
</div>

<div class="divider"></div>

<h2 style="color: #8b2252; text-align: center; font-size: 22px;">🛒 购买渠道推荐</h2>

<table style="width: 100%; border-collapse: collapse; margin: 20px 0; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
  <thead>
    <tr style="background: linear-gradient(135deg, #8b2252, #a83279); color: white;">
      <th style="padding: 12px; text-align: left;">渠道类型</th>
      <th style="padding: 12px; text-align: left;">推荐平台</th>
      <th style="padding: 12px; text-align: left;">特点</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background: #fdf2f8;">
      <td style="padding: 12px; border-bottom: 1px solid #f0e0e8;">🏪 线下</td>
      <td style="padding: 12px; border-bottom: 1px solid #f0e0e8;">盒马、Ole'、专业酒窖</td>
      <td style="padding: 12px; border-bottom: 1px solid #f0e0e8;">可现场品鉴</td>
    </tr>
    <tr style="background: #fff;">
      <td style="padding: 12px; border-bottom: 1px solid #f0e0e8;">🛒 线上</td>
      <td style="padding: 12px; border-bottom: 1px solid #f0e0e8;">京东自营、天猫国际、也买酒</td>
      <td style="padding: 12px; border-bottom: 1px solid #f0e0e8;">价格透明、配送方便</td>
    </tr>
  </tbody>
</table>

<p style="background: #fff3cd; padding: 12px; border-radius: 8px; border-left: 4px solid #ffc107;">
  ⚠️ <strong>温馨提示：</strong>购买时请认准正规渠道，避免买到假酒。建议选择有品质保障的平台。
</p>

<div class="divider"></div>

<h2 style="color: #8b2252; text-align: center; font-size: 22px;">📅 明日预告</h2>

<div class="interaction-box">
  <p style="font-size: 16px; color: #333; margin-bottom: 15px;">
    🎯 明天，我们将为大家带来<strong style="color: #8b2252;">"红酒品鉴入门指南"</strong>，<br>
    教你如何像专业人士一样品鉴红酒。
  </p>
  <p style="color: #666;">敬请期待！🔔</p>
</div>

<div class="interaction-box">
  <h3 style="color: #8b2252; margin-bottom: 15px;">💬 互动话题</h3>
  <p style="font-size: 16px; color: #333; margin-bottom: 15px;">
    你最喜欢的红酒是哪一款？为什么？
  </p>
  <p style="color: #666; font-size: 14px;">
    欢迎在评论区分享你的品酒心得！点赞最高的朋友将获得精美红酒杯一套🍷
  </p>
</div>

<div style="text-align: center; margin: 25px 0;">
  <span class="hashtag">#红酒推荐</span>
  <span class="hashtag">#葡萄酒</span>
  <span class="hashtag">#品酒</span>
  <span class="hashtag">#今日精选</span>
  <span class="hashtag">#红酒入门</span>
</div>

<div style="text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
  <p>本文由飞起器红酒助手原创，转载请注明出处。</p>
  <p>📱 关注我们，获取更多红酒资讯和推荐</p>
</div>
`;

  return {
    title,
    subtitle,
    abstract,
    content,
    author: '红酒顾问',
    tags: ['红酒推荐', '葡萄酒', '品酒', '今日精选', '红酒入门']
  };
}

/**
 * 生成封面图 (优化版)
 * 支持多种模板：elegant、luxury、minimal、vintage
 */
async function generateCoverImage(template = 'elegant') {
  console.log('🎨 生成封面图...');
  console.log(`   模板: ${COVER_TEMPLATES[template]?.name || '优雅'}`);
  
  try {
    // 尝试使用AI生成封面
    const apiKey = process.env.ZIMAGE_API_KEY;
    if (apiKey && apiKey !== 'your_zimage_api_key_here') {
      console.log('   使用AI生成封面...');
      
      // 根据模板调整提示词 - 写实风格
      const prompts = {
        elegant: 'Photorealistic wine cellar scene, elegant red wine bottles on wooden barrel, crystal wine glasses with ruby red wine, soft golden ambient lighting, luxury winery atmosphere, professional food photography, shallow depth of field, rich burgundy and gold tones, 8k ultra detailed',
        luxury: 'Luxurious wine collection photography, premium aged wine bottles with wax seals, dramatic chiaroscuro lighting, dark moody atmosphere, high-end sommelier presentation, commercial product photography, black background with golden highlights, photorealistic',
        minimal: 'Clean modern wine photography, single premium red wine bottle with glass, bright natural softbox lighting, minimalist white marble surface, contemporary restaurant setting, professional commercial photo, crisp details, elegant simplicity',
        vintage: 'Vintage wine cellar photography, aged dusty wine bottles in stone cellar, warm candlelight ambiance, rustic wooden rack, traditional European winery, nostalgic atmosphere, film grain texture, warm amber tones, photorealistic'
      };
      
      const submitResponse = await axios.post(
        'https://api-inference.modelscope.cn/v1/images/generations',
        {
          model: 'Tongyi-MAI/Z-Image-Turbo',
          prompt: prompts[template] || prompts.elegant,
          negative_prompt: 'blurry, low quality, cartoon, text, watermark, distorted',
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
      
      // 轮询状态
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
            
            // 裁剪为微信封面尺寸
            const croppedBuffer = await sharp(rawImage)
              .resize(900, 383, { fit: 'cover', position: 'center' })
              .png()
              .toBuffer();
            
            // 获取模板配置
            const templateConfig = COVER_TEMPLATES[template] || COVER_TEMPLATES.elegant;
            
            // 生成优化后的SVG叠加层
            const svg = generateCoverSVG(templateConfig);
            
            const textBuffer = Buffer.from(svg);
            
            const finalBuffer = await sharp(croppedBuffer)
              .composite([{ input: textBuffer, top: 0, left: 0 }])
              .png()
              .toBuffer();
            
            const outputPath = path.join(__dirname, 'output', `cover_wine_recommendation_${DATE_SHORT.replace(/\./g, '')}.png`);
            fs.writeFileSync(outputPath, finalBuffer);
            console.log('   📁 封面已保存:', outputPath);
            
            return outputPath;
          }
        }
        
        if (statusData.task_status === 'FAILED') {
          console.log('   ⚠️ AI图片生成失败，使用本地封面');
          break;
        }
      }
    }
  } catch (error) {
    console.log('   ⚠️ AI封面生成失败:', error.message);
  }
  
  // 使用本地生成的封面
  console.log('   使用本地生成的封面...');
  return generateLocalCoverImage(template);
}

/**
 * 生成封面SVG叠加层 (写实风格)
 * 只在底部添加简洁的文字条，不遮挡AI生成的写实图片主体
 */
function generateCoverSVG(templateConfig) {
  const { accent, textColor } = templateConfig;
  
  return `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- 底部渐变遮罩 -->
      <linearGradient id="bottomGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#000000;stop-opacity:0"/>
        <stop offset="60%" style="stop-color:#000000;stop-opacity:0.3"/>
        <stop offset="100%" style="stop-color:#000000;stop-opacity:0.85"/>
      </linearGradient>
      
      <!-- 文字渐变 -->
      <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:${accent}"/>
        <stop offset="100%" style="stop-color:${textColor}"/>
      </linearGradient>
      
      <!-- 阴影效果 -->
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="1" dy="1" stdDeviation="2" flood-opacity="0.5"/>
      </filter>
    </defs>
    
    <!-- 底部渐变遮罩（让文字更清晰） -->
    <rect x="0" y="220" width="900" height="163" fill="url(#bottomGrad)"/>
    
    <!-- 左上角品牌标识 -->
    <rect x="20" y="15" width="100" height="32" rx="6" fill="rgba(0,0,0,0.6)"/>
    <text x="70" y="37" font-family="Microsoft YaHei, PingFang SC, sans-serif" 
          font-size="14" font-weight="bold" fill="${accent}" text-anchor="middle">
      🍷 飞起器
    </text>
    
    <!-- 右上角日期标签 -->
    <rect x="770" y="15" width="110" height="32" rx="16" fill="rgba(0,0,0,0.6)"/>
    <text x="825" y="37" font-family="Microsoft YaHei, PingFang SC, sans-serif" 
          font-size="13" fill="${textColor}" text-anchor="middle">
      📅 ${DATE_SHORT}
    </text>
    
    <!-- 底部主标题 -->
    <text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" 
          font-size="38" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">
      🍷 红酒推荐
    </text>
    
    <!-- 底部副标题 -->
    <text x="30" y="330" font-family="Microsoft YaHei, PingFang SC, sans-serif" 
          font-size="20" fill="${textColor}" filter="url(#shadow)">
      今日精选5款佳酿 | 从入门到进阶
    </text>
    
    <!-- 底部标签 -->
    <text x="30" y="365" font-family="Microsoft YaHei, PingFang SC, sans-serif" 
          font-size="12" fill="rgba(255,255,255,0.7)">
      每日推荐 · 高性价比 · 专业精选
    </text>
    
    <!-- 右下角二维码占位 -->
    <rect x="800" y="290" width="75" height="75" rx="6" fill="rgba(255,255,255,0.95)"/>
    <text x="837" y="325" font-family="Microsoft YaHei" font-size="9" fill="#333" text-anchor="middle">
      扫码关注
    </text>
    <text x="837" y="340" font-family="Microsoft YaHei" font-size="7" fill="#666" text-anchor="middle">
      获取更多推荐
    </text>
  </svg>`;
}

/**
 * 生成本地封面图 (优化版)
 * 使用纯SVG绘制，包含渐变背景、品牌元素、装饰图案
 */
function generateLocalCoverImage(template = 'elegant') {
  const templateConfig = COVER_TEMPLATES[template] || COVER_TEMPLATES.elegant;
  const { gradient, accent, textColor } = templateConfig;
  
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- 主背景渐变 -->
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${gradient[0]}"/>
        <stop offset="50%" style="stop-color:${gradient[1]}"/>
        <stop offset="100%" style="stop-color:${gradient[2]}"/>
      </linearGradient>
      
      <!-- 装饰渐变 -->
      <radialGradient id="decorGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" style="stop-color:${accent};stop-opacity:0.3"/>
        <stop offset="100%" style="stop-color:${accent};stop-opacity:0"/>
      </radialGradient>
      
      <!-- 文字渐变 -->
      <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:${accent}"/>
        <stop offset="100%" style="stop-color:${textColor}"/>
      </linearGradient>
      
      <!-- 发光效果 -->
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <!-- 背景 -->
    <rect x="0" y="0" width="900" height="383" fill="url(#bgGrad)"/>
    
    <!-- 装饰光晕 -->
    <circle cx="450" cy="190" r="250" fill="url(#decorGrad)"/>
    
    <!-- 装饰线条 -->
    <g stroke="${accent}" stroke-width="1" fill="none" opacity="0.4">
      <!-- 左侧装饰 -->
      <path d="M 30 100 Q 60 80 90 100 Q 120 120 150 100 Q 180 80 210 100"/>
      <circle cx="50" cy="95" r="4"/>
      <circle cx="90" cy="105" r="3"/>
      <circle cx="130" cy="95" r="4"/>
      <circle cx="170" cy="105" r="3"/>
      
      <!-- 右侧装饰 -->
      <path d="M 690 100 Q 720 80 750 100 Q 780 120 810 100 Q 840 80 870 100"/>
      <circle cx="710" cy="95" r="4"/>
      <circle cx="750" cy="105" r="3"/>
      <circle cx="790" cy="95" r="4"/>
      <circle cx="830" cy="105" r="3"/>
    </g>
    
    <!-- 酒杯图案 -->
    <g transform="translate(400, 80)" fill="${accent}" opacity="0.15">
      <ellipse cx="50" cy="30" rx="40" ry="25"/>
      <rect x="45" y="55" width="10" height="60"/>
      <ellipse cx="50" cy="120" rx="30" ry="8"/>
    </g>
    
    <!-- 品牌logo -->
    <rect x="30" y="30" width="140" height="45" rx="10" fill="rgba(0,0,0,0.5)"/>
    <text x="100" y="60" font-family="Microsoft YaHei, PingFang SC, sans-serif" 
          font-size="20" font-weight="bold" fill="${accent}" text-anchor="middle" filter="url(#glow)">
      🍷 飞起器红酒
    </text>
    
    <!-- 日期标签 -->
    <rect x="30" y="85" width="160" height="35" rx="17" fill="rgba(0,0,0,0.5)"/>
    <text x="110" y="108" font-family="Microsoft YaHei, PingFang SC, sans-serif" 
          font-size="16" fill="${textColor}" text-anchor="middle">
      📅 ${DATE_STRING}
    </text>
    
    <!-- 主内容区域 -->
    <rect x="50" y="150" width="800" height="180" rx="15" fill="rgba(0,0,0,0.55)"/>
    
    <!-- 主标题 -->
    <text x="450" y="210" font-family="Microsoft YaHei, PingFang SC, sans-serif" 
          font-size="42" font-weight="bold" fill="url(#textGrad)" text-anchor="middle" filter="url(#glow)">
      🍷 红酒推荐
    </text>
    
    <!-- 副标题 -->
    <text x="450" y="260" font-family="Microsoft YaHei, PingFang SC, sans-serif" 
          font-size="26" fill="${textColor}" text-anchor="middle">
      今日精选5款佳酿
    </text>
    
    <!-- 描述 -->
    <text x="450" y="300" font-family="Microsoft YaHei, PingFang SC, sans-serif" 
          font-size="16" fill="rgba(255,255,255,0.7)" text-anchor="middle">
      从入门到进阶，总有一款适合你
    </text>
    
    <!-- 二维码占位 -->
    <rect x="780" y="170" width="100" height="100" rx="10" fill="rgba(255,255,255,0.95)"/>
    <text x="830" y="215" font-family="Microsoft YaHei" font-size="12" fill="#333" text-anchor="middle">
      扫码关注
    </text>
    <text x="830" y="235" font-family="Microsoft YaHei" font-size="10" fill="#666" text-anchor="middle">
      获取更多推荐
    </text>
    <!-- 二维码模拟图案 -->
    <g transform="translate(795, 245)" fill="#333">
      <rect x="0" y="0" width="15" height="15"/>
      <rect x="20" y="0" width="5" height="5"/>
      <rect x="30" y="0" width="5" height="5"/>
      <rect x="40" y="0" width="5" height="5"/>
      <rect x="55" y="0" width="15" height="15"/>
      <rect x="0" y="20" width="5" height="5"/>
      <rect x="10" y="20" width="5" height="5"/>
      <rect x="20" y="20" width="15" height="15"/>
      <rect x="40" y="20" width="5" height="5"/>
      <rect x="55" y="20" width="5" height="5"/>
      <rect x="65" y="20" width="5" height="5"/>
      <rect x="0" y="40" width="5" height="5"/>
      <rect x="10" y="40" width="5" height="5"/>
      <rect x="25" y="40" width="5" height="5"/>
      <rect x="40" y="40" width="15" height="15"/>
      <rect x="60" y="40" width="5" height="5"/>
    </g>
    
    <!-- 底部角标 -->
    <rect x="750" y="330" width="120" height="30" rx="15" fill="${accent}"/>
    <text x="810" y="350" font-family="Microsoft YaHei" font-size="14" fill="#000" text-anchor="middle" font-weight="bold">
      每日推荐
    </text>
    
    <!-- 底部装饰线 -->
    <line x1="50" y1="365" x2="850" y2="365" stroke="${accent}" stroke-width="2" opacity="0.6"/>
  </svg>`;
  
  const svgBuffer = Buffer.from(svg);
  
  // 使用sharp将SVG转换为PNG
  return sharp(svgBuffer)
    .png()
    .toBuffer()
    .then(buffer => {
      const outputPath = path.join(__dirname, 'output', `cover_wine_recommendation_${DATE_SHORT.replace(/\./g, '')}.png`);
      fs.writeFileSync(outputPath, buffer);
      console.log('   📁 本地封面已保存:', outputPath);
      return outputPath;
    });
}

/**
 * 主函数
 */
async function main() {
  console.log('🍷 红酒推荐日更文章生成和发布系统');
  console.log('📅 日期:', DATE_STRING);
  console.log('');
  
  try {
    // 1. 生成文章内容
    console.log('📝 步骤 1: 生成文章内容...');
    const article = generateWineRecommendationContent();
    console.log('   ✅ 文章内容生成完成');
    console.log('   标题:', article.title);
    console.log('   内容长度:', article.content.length, '字符');
    
    // 2. 生成封面图
    console.log('\n🎨 步骤 2: 生成封面图...');
    const coverPath = await generateCoverImage();
    console.log('   ✅ 封面图生成完成');
    
    // 3. 上传到微信公众号草稿箱
    console.log('\n📤 步骤 3: 上传到微信公众号草稿箱...');
    const publisher = new WeChatPublisher();
    
    // 验证配置
    const validation = publisher.validateConfig();
    if (!validation.valid) {
      console.error('❌ 微信配置错误:');
      validation.errors.forEach(err => console.error('   -', err));
      console.log('\n💡 请检查 .env 文件中的 WECHAT_APPID 和 WECHAT_SECRET 配置');
      return;
    }
    
    // 发布文章
    const result = await publisher.publish({
      ...article,
      thumbUrl: coverPath
    });
    
    if (result.success) {
      console.log('\n🎉 发布成功！');
      console.log('   草稿ID:', result.draftId);
      if (result.testMode) {
        console.log('   ⚠️ 测试模式：草稿已创建但未发布');
        console.log('   💡 请登录微信公众号后台查看草稿');
      } else {
        console.log('   ✅ 文章已发布');
        if (result.url) {
          console.log('   🔗 文章链接:', result.url);
        }
      }
    } else {
      console.error('\n❌ 发布失败:', result.error);
      if (result.errors) {
        result.errors.forEach(err => console.error('   -', err));
      }
    }
    
    // 4. 保存文章到本地
    console.log('\n💾 步骤 4: 保存文章到本地...');
    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const articlePath = path.join(outputDir, `wine_recommendation_${DATE_SHORT.replace(/\./g, '')}.json`);
    fs.writeFileSync(articlePath, JSON.stringify(article, null, 2));
    console.log('   📁 文章已保存:', articlePath);
    
    console.log('\n✅ 全部完成！');
    
  } catch (error) {
    console.error('\n❌ 发生错误:', error.message);
    console.error(error.stack);
  }
}

// 运行主函数
if (require.main === module) {
  main();
}

module.exports = { main, generateWineRecommendationContent, generateCoverImage };
