/**
 * 巴罗洛葡萄酒完全指南
 * 使用 baoyu-imagine + DashScope 生成写实封面，发布到微信公众号草稿箱
 */

process.env.HTTP_PROXY = '';
process.env.HTTPS_PROXY = '';

require('dotenv').config();

const axios = require('axios');
axios.defaults.proxy = false;
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const config = require('./config');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const today = new Date();
const date = {
  full: today.toISOString().slice(0, 10),
  display: `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`,
  chinese: `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`
};

async function generateCoverWithAI() {
  console.log('🎨 使用 baoyu-imagine + DashScope 生成写实巴罗洛封面...');
  
  const coverPath = path.join(__dirname, 'output', 'barolo_cover_real.png');
  const prompt = 'Photorealistic Italian Barolo wine, Nebbiolo grapes on hillside vineyards in Piedmont, historic stone cellars with aging barrels, Langhe landscape at sunrise, elegant wine bottles with gold label, traditional Italian wine culture, professional photography, 8K ultra-detailed';
  
  try {
    const scriptPath = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
    const cmd = `npx -y bun "${scriptPath}" --prompt "${prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`;
    
    console.log('   调用 baoyu-imagine...');
    const { stdout, stderr } = await execPromise(cmd, { timeout: 180000 });
    
    if (stdout.includes('cover.png') || stdout.includes('barolo_cover_real.png') || fs.existsSync(coverPath)) {
      console.log('   ✅ AI图片生成成功');
      
      const resizedBuffer = await sharp(coverPath)
        .resize(900, 383, { fit: 'cover', position: 'center' })
        .png()
        .toBuffer();
      
      const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#8B0000"/>
            <stop offset="100%" style="stop-color:#CD5C5C"/>
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.7"/>
          </filter>
        </defs>
        
        <rect x="0" y="230" width="900" height="153" fill="rgba(0,0,0,0.7)"/>
        
        <text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🍷 巴罗洛完全指南</text>
        
        <text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">意大利皮埃蒙特 · 酒王之王 · 内比奥罗</text>
        
        <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#8B0000" text-anchor="end">${date.display}</text>
      </svg>`;
      
      const textBuffer = Buffer.from(svg);
      const finalBuffer = await sharp(resizedBuffer)
        .composite([{ input: textBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer();
      
      const outputPath = path.join(__dirname, 'output', 'barolo_cover_ai.png');
      fs.writeFileSync(outputPath, finalBuffer);
      console.log('   📁 封面已保存:', outputPath);
      
      return finalBuffer;
    }
  } catch (error) {
    console.log('   ⚠️ AI 生成失败:', error.message);
  }
  
  console.log('   使用本地备用封面');
  return generateLocalCover();
}

function generateLocalCover() {
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#1a1a2e"/>
        <stop offset="50%" style="stop-color:#16213e"/>
        <stop offset="100%" style="stop-color:#0f3460"/>
      </linearGradient>
      <linearGradient id="wineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#722F37"/>
        <stop offset="100%" style="stop-color:#8B0000"/>
      </linearGradient>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#DAA520"/>
        <stop offset="100%" style="stop-color:#B8860B"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <rect width="900" height="383" fill="url(#bgGrad)"/>
    
    <circle cx="650" cy="100" r="180" fill="rgba(114, 47, 55, 0.3)"/>
    <circle cx="680" cy="120" r="150" fill="rgba(139, 0, 0, 0.2)"/>
    
    <ellipse cx="700" cy="280" rx="120" ry="80" fill="rgba(0,0,0,0.5)"/>
    <rect x="620" y="200" width="160" height="200" rx="5" fill="url(#wineGrad)" stroke="url(#goldGrad)" stroke-width="3"/>
    <rect x="640" y="210" width="120" height="30" rx="2" fill="url(#goldGrad)"/>
    <text x="700" y="230" font-family="serif" font-size="14" fill="#1a1a2e" text-anchor="middle" font-weight="bold">BAROLO</text>
    <text x="700" y="250" font-family="serif" font-size="10" fill="#DAA520" text-anchor="middle">DOCG</text>
    
    <text x="700" y="330" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">Piedmont, Italy</text>
    
    <text x="30" y="80" font-family="Microsoft YaHei, serif" font-size="48" font-weight="bold" fill="url(#goldGrad)" filter="url(#glow)">🍷</text>
    
    <rect x="20" y="130" width="400" height="2" fill="url(#goldGrad)"/>
    
    <text x="30" y="160" font-family="Microsoft YaHei, PingFang SC" font-size="36" font-weight="bold" fill="#DAA520">巴罗洛</text>
    <text x="30" y="195" font-family="Microsoft YaHei, PingFang SC" font-size="18" fill="rgba(255,255,255,0.8)">意大利皮埃蒙特</text>
    <text x="30" y="220" font-family="Microsoft YaHei, PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"酒王之王" · 内比奥罗葡萄</text>
    
    <text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">被誉为"意大利的勃艮第"</text>
    
    <text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#DAA520" text-anchor="end">${date.display}</text>
  </svg>`;
  
  return sharp(Buffer.from(svg))
    .png()
    .toBuffer()
    .then(buffer => {
      const outputPath = path.join(__dirname, 'output', 'barolo_cover_ai.png');
      fs.writeFileSync(outputPath, buffer);
      console.log('📁 SVG 封面已保存:', outputPath);
      return buffer;
    });
}

function generateContent() {
  return `
<style>
  .region-item { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }
  .region-item h4 { color: #8B0000; margin: 0 0 8px 0; font-size: 16px; }
  h3 { color: #8B0000; border-bottom: 2px solid #DC143C; padding-bottom: 8px; margin-top: 25px; }
</style>

<h2 style="text-align: center; color: #8B0000;">🍷 ${date.chinese} 巴罗洛完全指南：意大利酒王之王</h2>
<p style="text-align: center; color: #666;">皮埃蒙特 · 内比奥罗 · "酒王之王"</p>

<section style="background:linear-gradient(135deg,#2d1f1f,#1a1a2e);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#FFE4E1;font-size:16px;line-height:1.9">巴罗洛（Barolo）是<strong style="color:#DC143C">意大利皮埃蒙特（Piedmont）</strong>最具代表性的葡萄酒，被誉为"酒王之王"（King of Wines, Wine of Kings）。这款葡萄酒以其浓郁的香气、复杂的层次和<strong style="color:#DC143C">极强的陈年潜力</strong>而闻名于世，被称为"意大利的勃艮第"。</p>
</section>

<h3>🍇 一、认识内比奥罗葡萄</h3>
<section style="background:#fff0f0;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8">巴罗洛采用<strong>100%内比奥罗（Nebbiolo）</strong>葡萄酿造。这种被誉为"黑皮诺表亲"的葡萄品种，对生长环境极为挑剔：</p>

<div class="region-item">
<h4>葡萄品种特性</h4>
<p style="color:#333;line-height:1.8;margin:0">
• <strong>气候：</strong>需要凉爽的夜晚和温暖的白天<br/>
• <strong>土壤：</strong>石灰质黏土最佳<br/>
• <strong>果皮：</strong>较薄但富含单宁<br/>
• <strong>特性：</strong>酿造出的葡萄酒色泽深邃，香气复杂
</p>
</div>
</section>

<h3>🏛️ 二、五大核心村庄</h3>
<section style="background:#FFF8DC;padding:18px;border-radius:8px">

<div class="region-item">
<h4>巴罗洛（Barolo）</h4>
<p style="color:#333;line-height:1.8;margin:0">巴罗洛村是核心产区，海拔较高，葡萄酒结构紧实，单宁强劲，具有极佳的陈年潜力。</p>
</div>

<div class="region-item">
<h4>拉梦加（La Morra）</h4>
<p style="color:#333;line-height:1.8;margin:0">最大的巴罗洛村庄，风格相对柔和，果香浓郁，适合早饮。</p>
</div>

<div class="region-item">
<h4>蒙弗尔塔（Monforte d'Alba）</h4>
<p style="color:#333;line-height:1.8;margin:0">位于较高海拔，葡萄酒颜色深，单宁强，复杂度高。</p>
</div>

<div class="region-item">
<h4>塞拉伦加（Serralunga d'Alba）</h4>
<p style="color:#333;line-height:1.8;margin:0">以强劲结构和极佳陈年潜力著称，被认为是最具"巴罗洛风格"的村庄。</p>
</div>

<div class="region-item">
<h4>诺瓦洛（Novello）</h4>
<p style="color:#333;line-height:1.8;margin:0">海拔最高的村庄之一，葡萄酒优雅细腻，香气精致。</p>
</div>

</section>

<h3>🍷 三、酿造工艺与法规</h3>
<section style="background:#E6E6FA;padding:18px;border-radius:8px">

<div class="region-item">
<h4>传统工艺</h4>
<p style="color:#333;line-height:1.8;margin:0">
• <strong>浸皮发酵：</strong>长达30-40天，充分提取单宁和色素<br/>
• <strong>橡木桶陈酿：</strong>使用斯拉沃尼亚大橡木桶<br/>
• <strong>瓶中陈酿：</strong>装瓶后继续陈年
</p>
</div>

<div class="region-item">
<h4>法规要求（DOCG）</h4>
<p style="color:#333;line-height:1.8;margin:0">
• 基酒至少陈酿 <strong>38个月</strong><br/>
• 其中至少 <strong>18个月</strong> 在橡木桶中<br/>
• 珍藏级（Riserva）至少陈酿 <strong>62个月</strong>
</p>
</div>

</section>

<h3>👃 四、品鉴要点</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">

<div class="region-item">
<h4>典型香气</h4>
<p style="color:#333;line-height:1.8;margin:0">
<strong>年轻阶段：</strong>玫瑰花香、樱桃、覆盆子、草莓、焦油、松露<br/>
<strong>陈年后：</strong>皮革、烟草、巧克力、咖啡、甘草、菌菇
</p>
</div>

<div class="region-item">
<h4>品鉴维度</h4>
<p style="color:#333;line-height:1.8;margin:0">
• <strong>酒体：</strong>饱满<br/>
• <strong>单宁：</strong>充沛但细腻<br/>
• <strong>酸度：</strong>明显<br/>
• <strong>余味：</strong>悠长
</p>
</div>

</section>

<h3>🍽️ 五、配餐建议</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.9;font-size:16px">巴罗洛的高单宁和复杂风味非常适合搭配<strong>浓郁的肉类菜肴</strong>：</p>
<p style="color:#333;line-height:1.8">• <strong>烤牛排：</strong>高单宁能化解油脂</p>
<p style="color:#333;line-height:1.8">• <strong>炖牛肉：</strong>传统意式炖菜是绝配</p>
<p style="color:#333;line-height:1.8">• <strong>松露烩饭：</strong>皮埃蒙特特色</p>
<p style="color:#333;line-height:1.8">• <strong>成熟奶酪：</strong>如帕尔马干酪</p>
<p style="color:#666;line-height:1.8;margin-top:15px">💡 建议使用大杯型醒酒器充分醒酒2-4小时，让香气充分绽放。</p>
</section>

<h3>💰 六、投资与收藏</h3>
<section style="background:#e8f5e9;padding:18px;border-radius:8px">

<div class="region-item">
<h4>投资价值</h4>
<p style="color:#333;line-height:1.8;margin:0">优质巴罗洛具有极佳的陈年潜力，可陈年20-50年以上，是葡萄酒投资市场的热门选择。</p>
</div>

<div class="region-item">
<h4>顶级酒庄推荐</h4>
<p style="color:#333;line-height:1.8;margin:0">
• <strong>Giacomo Conterno：</strong>传统派王者<br/>
• <strong>Bruno Giacosa：</strong>优雅派代表<br/>
• <strong>Vietti：</strong>创新与传统结合<br/>
• <strong>Sandrone：</strong>现代派先锋
</p>
</div>

</section>

<section style="background:linear-gradient(135deg,#2d1f1f,#1a1a2e);padding:22px;border-radius:10px;text-align:center">
<p style="color:#FFE4E1;font-size:16px;line-height:1.9">巴罗洛作为<strong style="color:#DC143C">"酒王之王"</strong>，代表着意大利葡萄酒的最高水准。无论是年轻时品鉴其果香，还是珍藏多年等待其巅峰，巴罗洛都能带给你难忘的体验。</p>
</section>

<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">— 感谢阅读 —</p>
`;
}

async function publishToWeChat(article, coverBuffer) {
  console.log('📤 发布到微信公众号草稿箱...');
  
  const wechatConfig = config.publish;
  const appId = wechatConfig.appId;
  const appSecret = wechatConfig.appSecret;
  
  console.log('   步骤 1/3: 获取 Access Token...');
  const tokenRes = await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`);
  const accessToken = tokenRes.data.access_token;
  console.log('   ✅ Token 获取成功');
  
  console.log('   步骤 2/3: 上传封面图...');
  const form = new FormData();
  form.append('media', coverBuffer, { filename: 'cover.png', contentType: 'image/png' });
  const mediaRes = await axios.post(`https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${accessToken}&type=image`, form, {
    headers: form.getHeaders()
  });
  const mediaId = mediaRes.data.media_id;
  console.log('   ✅ 封面上传成功, media_id:', mediaId);
  
  console.log('   步骤 3/3: 创建草稿...');
  const articles = [{
    title: article.title,
    thumb_media_id: mediaId,
    author: '葡萄酒百科',
    digest: article.abstract,
    content: article.content,
    content_source_url: '',
    show_cover_pic: 1,
    need_open_comment: 0,
    only_fans_can_comment: 0
  }];
  
  const draftRes = await axios.post(`https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${accessToken}`, {
    articles: articles
  });
  
  if (draftRes.data.media_id) {
    console.log('   ✅ 草稿创建成功, media_id:', draftRes.data.media_id);
    return draftRes.data.media_id;
  } else {
    throw new Error('草稿创建失败: ' + JSON.stringify(draftRes.data));
  }
}

async function main() {
  console.log('============================================================');
  console.log('🥂 生成巴罗洛完全指南文章');
  console.log('日期:', date.display);
  console.log('============================================================');
  
  try {
    const coverBuffer = await generateCoverWithAI();
    const article = {
      title: `🍷 ${date.chinese} 巴罗洛完全指南：意大利酒王之王`,
      author: '红酒顾问',
      digest: '巴罗洛是意大利皮埃蒙特最具代表性的葡萄酒，被誉为"酒王之王"。本文详解内比奥罗葡萄、五大核心村庄、酿造工艺及品鉴要点。',
      content: generateContent(),
      coverImage: 'barolo_cover_ai.png',
      category: 'wine-knowledge',
      tags: ['巴罗洛', '意大利葡萄酒', '皮埃蒙特', '内比奥罗', '酒王'],
      publishDate: date.full
    };
    
    const outputPath = path.join(__dirname, 'output', `barolo_${date.full.replace(/-/g, '')}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(article, null, 2));
    console.log('📁 文章已保存:', outputPath);
    const mediaId = await publishToWeChat(article, coverBuffer);
    
    console.log('============================================================');
    console.log('✅ 发布成功！');
    console.log('草稿ID:', mediaId);
    console.log('============================================================');
  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  }
}

main();