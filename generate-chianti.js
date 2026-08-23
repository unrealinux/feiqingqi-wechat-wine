/**
 * 基安蒂葡萄酒完全指南
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
  console.log('🎨 使用 baoyu-imagine + DashScope 生成写实基安蒂封面...');
  
  const coverPath = path.join(__dirname, 'output', 'chianti_cover_real.png');
  const prompt = 'Photorealistic Italian Chianti wine, Tuscan landscape with rolling hills, Sangiovese grapes on ancient vineyards, classic Chianti bottle with straw basket, medieval Tuscan villages, professional photography, 8K ultra-detailed';
  
  try {
    const scriptPath = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
    const cmd = `npx -y bun "${scriptPath}" --prompt "${prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`;
    
    console.log('   调用 baoyu-imagine...');
    const { stdout, stderr } = await execPromise(cmd, { timeout: 180000 });
    
    if (stdout.includes('cover.png') || stdout.includes('chianti_cover_real.png') || fs.existsSync(coverPath)) {
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
        
        <text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🍷 基安蒂完全指南</text>
        
        <text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">意大利托斯卡纳 · 桑娇维塞 · 经典基安蒂</text>
        
        <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#8B0000" text-anchor="end">${date.display}</text>
      </svg>`;
      
      const textBuffer = Buffer.from(svg);
      const finalBuffer = await sharp(resizedBuffer)
        .composite([{ input: textBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer();
      
      const outputPath = path.join(__dirname, 'output', 'chianti_cover_ai.png');
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
    <text x="700" y="230" font-family="serif" font-size="14" fill="#1a1a2e" text-anchor="middle" font-weight="bold">CHianti</text>
    <text x="700" y="250" font-family="serif" font-size="10" fill="#DAA520" text-anchor="middle">DOCG</text>
    
    <text x="700" y="330" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">Tuscany, Italy</text>
    
    <text x="30" y="80" font-family="Microsoft YaHei, serif" font-size="48" font-weight="bold" fill="url(#goldGrad)" filter="url(#glow)">🍷</text>
    
    <rect x="20" y="130" width="400" height="2" fill="url(#goldGrad)"/>
    
    <text x="30" y="160" font-family="Microsoft YaHei, PingFang SC" font-size="36" font-weight="bold" fill="#DAA520">基安蒂</text>
    <text x="30" y="195" font-family="Microsoft YaHei, PingFang SC" font-size="18" fill="rgba(255,255,255,0.8)">意大利托斯卡纳</text>
    <text x="30" y="220" font-family="Microsoft YaHei, PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"托斯卡纳代表" · 桑娇维塞葡萄</text>
    
    <text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">意大利最具代表性的葡萄酒之一</text>
    
    <text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#DAA520" text-anchor="end">${date.display}</text>
  </svg>`;
  
  return sharp(Buffer.from(svg))
    .png()
    .toBuffer()
    .then(buffer => {
      const outputPath = path.join(__dirname, 'output', 'chianti_cover_ai.png');
      fs.writeFileSync(outputPath, buffer);
      console.log('📁 SVG 封面已保存:', outputPath);
      return buffer;
    });
}

function generateContent() {
  return `
<style>
  .region-item { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }
  .region-item h4 { color: #228B22; margin: 0 0 8px 0; font-size: 16px; }
  h3 { color: #228B22; border-bottom: 2px solid #32CD32; padding-bottom: 8px; margin-top: 25px; }
</style>

<h2 style="text-align: center; color: #228B22;">🍷 ${date.chinese} 基安蒂完全指南：托斯卡纳的灵魂</h2>
<p style="text-align: center; color: #666;">托斯卡纳 · 桑娇维塞 · 经典基安蒂</p>

<section style="background:linear-gradient(135deg,#1a3c1a,#0f2027);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#98FB98;font-size:16px;line-height:1.9">基安蒂（Chianti）是<strong style="color:#32CD32">意大利托斯卡纳</strong>最具代表性的葡萄酒，以其红色浆果香气、优雅的酸度和独特的托斯卡纳风土而闻名。在文艺复兴的发源地，桑娇维塞葡萄酿造出这款享誉全球的经典美酒。本文将带你深入了解<strong style="color:#32CD32">基安蒂的魅力</strong>。</p>
</section>

<h3>🍇 一、认识桑娇维塞葡萄</h3>
<section style="background:#f0fff0;padding:18px;border-radius:8px">

<div class="region-item">
<h4>葡萄品种特性</h4>
<p style="color:#333;line-height:1.8;margin:0">
• <strong>历史：</strong>意大利最古老的葡萄品种之一，已有数千年历史<br/>
• <strong>特点：</strong>果皮薄，单宁适中，酸度明显<br/>
• <strong>香气：</strong>红色樱桃、草莓、紫罗兰、 herb草本<br/>
• <strong>风格：</strong>早饮果香清新，陈年后复杂优雅
</p>
</div>

<div class="region-item">
<h4>为什么选择桑娇维塞？</h4>
<p style="color:#333;line-height:1.8;margin:0">桑娇维塞是托斯卡纳的标志性葡萄，完全适应了当地的气候和土壤。它既能酿造清新易饮的日常酒，也能打造极具陈年潜力的顶级佳酿。</p>
</div>

</section>

<h3>🏛️ 二、基安蒂七大子产区</h3>
<section style="background:#FFF8DC;padding:18px;border-radius:8px">

<div class="region-item">
<h4>经典基安蒂（Chianti Classico）</h4>
<p style="color:#333;line-height:1.8;margin:0">位于佛罗伦萨和锡耶纳之间的核心产区，历史最悠久。必须使用至少80%桑娇维塞，品质最高。</p>
</div>

<div class="region-item">
<h4>古典基安蒂 Riserva</h4>
<p style="color:#333;line-height:1.8;margin:0">Classico的珍藏级，陈年时间更长（至少24个月），单宁更丰富，复杂度更高。</p>
</div>

<div class="region-item">
<h4>基安蒂 Colli Fiorentini</h4>
<p style="color:#333;line-height:1.8;margin:0">环绕佛罗伦萨的丘陵区，风格果味充沛，柔顺易饮。</p>
</div>

<div class="region-item">
<h4>基安蒂 Colli Senesi</h4>
<p style="color:#333;line-height:1.8;margin:0">锡耶纳周边的丘陵，近年品质提升明显，性价比较高。</p>
</div>

<div class="region-item">
<h4>基安蒂 Colli Aretini</h4>
<p style="color:#333;line-height:1.8;margin:0">阿雷佐省附近，风格优雅细腻。</p>
</div>

<div class="region-item">
<h4>基安TI Montespertoli</h4>
<p style="color:#333;line-height:1.8;margin:0">佛罗伦萨省西南部，新兴优质产区。</p>
</div>

<div class="region-item">
<h4>基安蒂 Sambuca</h4>
<p style="color:#333;line-height:1.8;margin:0">历史悠久的子产区，靠近经典基安蒂边缘。</p>
</div>

</section>

<h3>📜 三、基安蒂分级与法规</h3>
<section style="background:#E6E6FA;padding:18px;border-radius:8px">

<div class="region-item">
<h4>Chianti DOCG</h4>
<p style="color:#333;line-height:1.8;margin:0">基础级别，必须使用70%以上桑娇维塞，可添加其他本地品种。</p>
</div>

<div class="region-item">
<h4>Chianti Classico DOCG</h4>
<p style="color:#333;line-height:1.8;margin:0">核心产区，更严格：至少80%桑娇维塞，更高陈酿要求。</p>
</div>

<div class="region-item">
<h4>Chianti Classico Riserva DOCG</h4>
<p style="color:#333;line-height:1.8;margin:0">珍藏级：至少24个月陈酿（含橡木桶），风味更复杂。</p>
</div>

<div class="region-item">
<h4>Chianti Superiore DOCG</h4>
<p style="color:#333;line-height:1.8;margin:0">优选级别：比普通Chianti更严格的质量控制。</p>
</div>

</section>

<h3>👃 四、品鉴要点</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">

<div class="region-item">
<h4>典型特征</h4>
<p style="color:#333;line-height:1.8;margin:0">
• <strong>颜色：</strong>宝石红，边缘略带石榴色<br/>
• <strong>香气：</strong>红樱桃、草莓、紫罗兰、烟草、皮革<br/>
• <strong>单宁：</strong>中等，细腻丝滑<br/>
• <strong>酸度：</strong>明快清新，提供结构感<br/>
• <strong>余味：</strong>悠长，带有矿物感
</p>
</div>

<div class="region-item">
<h4>饮用建议</h4>
<p style="color:#333;line-height:1.8;margin:0">
• <strong>适饮温度：</strong>16-18°C<br/>
• <strong>醒酒时间：</strong>基础款30分钟，Riserva 1-2小时<br/>
• <strong>杯型：</strong>中等到大波尔多杯
</p>
</div>

</section>

<h3>🍽️ 五、配餐建议</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">

<table style="width:100%;border-collapse:collapse;margin:10px 0">
<tr style="background:#228B22;color:white">
<th style="padding:10px;text-align:left">菜品类型</th>
<th style="padding:10px;text-align:left">推荐搭配</th>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px">意式菜肴</td>
<td style="padding:10px">佛罗伦萨牛排、番茄肉酱面、披萨</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px">烤肉</td>
<td style="padding:10px">烤羊排、烤鸡、BBQ</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px">奶酪</td>
<td style="padding:10px">佩科里诺羊奶酪、帕尔马干酪</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px">素食</td>
<td style="padding:10px">烤茄子、番茄烩菜、菌菇意饭</td>
</tr>
</table>

</section>

<h3>💰 六、知名酒庄推荐</h3>
<section style="background:#e8f5e9;padding:18px;border-radius:8px">

<div class="region-item">
<h4>Antinori - 安蒂诺里</h4>
<p style="color:#333;line-height:1.8;margin:0">意大利最大葡萄酒集团，旗下Tignanello是超级托斯卡纳的开创者。</p>
</div>

<div class="region-item">
<h4>Felsina - 费尔西纳</h4>
<p style="color:#333;line-height:1.8;margin:0">经典基安蒂标杆酒庄，风格优雅细腻。</p>
</div>

<div class="region-item">
<h4>Castello di Ama - 阿玛城堡</h4>
<p style="color:#333;line-height:1.8;margin:0">以艺术酒标闻名，品质稳定优秀。</p>
</div>

<div class="region-item">
<h4>Badia a Coltibuono - 修道院</h4>
<p style="color:#333;line-height:1.8;margin:0">历史悠久的修道院酒庄，传统风格代表。</p>
</div>

<div class="region-item">
<h4>Isole e Olena - 伊索勒奥勒纳</h4>
<p style="color:#333;line-height:1.8;margin:0">现代派代表，品质卓越。</p>
</div>

</section>

<h3>📊 七、价格区间与选购</h3>
<section style="background:#E3F2FD;padding:18px;border-radius:8px;border-left:3px solid #1565C0">

<div class="region-item">
<h4>入门级（80-150元）</h4>
<p style="color:#333;line-height:1.8;margin:0">果香清新，适合日常饮用。品牌如：Antinori Chianti、Tuscany签名系列</p>
</div>

<div class="region-item">
<h4>进阶级（150-300元）</h4>
<p style="color:#333;line-height:1.8;margin:0">Classico级别，品质更佳。推荐：Felsina Chianti Classico、Badia a Coltibuono</p>
</div>

<div class="region-item">
<h4>珍藏级（300-800元）</h4>
<p style="color:#333;line-height:1.8;margin:0">Riserva级别，橡木桶陈酿。推荐：Isole e Olena Riserva、Castello di Ama Riserva</p>
</div>

<div class="region-item">
<h4>顶级（800元以上）</h4>
<p style="color:#333;line-height:1.8;margin:0">特级年份，收藏级别。关注酒评家评分和年份。</p>
</div>

</section>

<section style="background:linear-gradient(135deg,#1a3c1a,#0f2027);padding:22px;border-radius:10px;text-align:center">
<p style="color:#98FB98;font-size:16px;line-height:1.9">基安蒂不仅是托斯卡纳的象征，更是意大利葡萄酒文化的代表。从古老的修道院葡萄园到现代的精品酒庄，基安蒂始终保持着其独特的魅力。无论你是初次品鉴还是资深收藏家，<strong style="color:#32CD32">基安蒂都能带给你难忘的体验</strong>。</p>
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
    author: article.author,
    digest: article.digest,
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
  console.log('🥂 生成基安蒂完全指南文章');
  console.log('日期:', date.display);
  console.log('============================================================');
  
  try {
    const coverBuffer = await generateCoverWithAI();
    
    const article = {
      title: `🍷 ${date.chinese} 基安蒂完全指南：托斯卡纳的灵魂`,
      author: '红酒顾问',
      digest: '基安蒂是意大利托斯卡纳最具代表性的葡萄酒，以桑娇维塞葡萄酿造。本文详解七大子产区、分级法规及知名酒庄。',
      content: generateContent(),
      coverImage: 'chianti_cover_ai.png',
      category: 'wine-knowledge',
      tags: ['基安蒂', '意大利葡萄酒', '托斯卡纳', '桑娇维塞'],
      publishDate: date.full
    };
    
    const outputPath = path.join(__dirname, 'output', `chianti_${date.full.replace(/-/g, '')}.json`);
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