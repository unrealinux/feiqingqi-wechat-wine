/**
 * 阿玛罗尼葡萄酒完全指南
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
  console.log('🎨 使用 baoyu-imagine + DashScope 生成写实阿玛罗尼封面...');
  
  const coverPath = path.join(__dirname, 'output', 'amarone_cover_real.png');
  const prompt = 'Photorealistic Italian Amarone wine, dried Corvina grapes on bamboo mats, Valpolicella hillsides, ancient stone cellar with large oak barrels, rich dark red wine in glass, Veneto region landscape, professional photography, 8K ultra-detailed';
  
  try {
    const scriptPath = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
    const cmd = `npx -y bun "${scriptPath}" --prompt "${prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`;
    
    console.log('   调用 baoyu-imagine...');
    const { stdout, stderr } = await execPromise(cmd, { timeout: 180000 });
    
    if (stdout.includes('cover.png') || stdout.includes('amarone_cover_real.png') || fs.existsSync(coverPath)) {
      console.log('   ✅ AI图片生成成功');
      
      const resizedBuffer = await sharp(coverPath)
        .resize(900, 383, { fit: 'cover', position: 'center' })
        .png()
        .toBuffer();
      
      const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#4B0082"/>
            <stop offset="100%" style="stop-color:#8B008B"/>
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.7"/>
          </filter>
        </defs>
        
        <rect x="0" y="230" width="900" height="153" fill="rgba(0,0,0,0.7)"/>
        
        <text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🍷 阿玛罗尼完全指南</text>
        
        <text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">意大利威尼托 · 风干葡萄 · 浓郁醇厚</text>
        
        <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#8B008B" text-anchor="end">${date.display}</text>
      </svg>`;
      
      const textBuffer = Buffer.from(svg);
      const finalBuffer = await sharp(resizedBuffer)
        .composite([{ input: textBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer();
      
      const outputPath = path.join(__dirname, 'output', 'amarone_cover_ai.png');
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
        <stop offset="0%" style="stop-color:#1a0a2e"/>
        <stop offset="50%" style="stop-color:#2d1b4e"/>
        <stop offset="100%" style="stop-color:#1a1a2e"/>
      </linearGradient>
      <linearGradient id="wineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#4B0082"/>
        <stop offset="100%" style="stop-color:#8B008B"/>
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
    
    <circle cx="650" cy="100" r="180" fill="rgba(75, 0, 130, 0.3)"/>
    <circle cx="680" cy="120" r="150" fill="rgba(139, 0, 139, 0.2)"/>
    
    <ellipse cx="700" cy="280" rx="120" ry="80" fill="rgba(0,0,0,0.5)"/>
    <rect x="620" y="200" width="160" height="200" rx="5" fill="url(#wineGrad)" stroke="url(#goldGrad)" stroke-width="3"/>
    <rect x="640" y="210" width="120" height="30" rx="2" fill="url(#goldGrad)"/>
    <text x="700" y="230" font-family="serif" font-size="14" fill="#1a0a2e" text-anchor="middle" font-weight="bold">AMARONE</text>
    <text x="700" y="250" font-family="serif" font-size="10" fill="#DAA520" text-anchor="middle">DOCG</text>
    
    <text x="700" y="330" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">Veneto, Italy</text>
    
    <text x="30" y="80" font-family="Microsoft YaHei, serif" font-size="48" font-weight="bold" fill="url(#goldGrad)" filter="url(#glow)">🍷</text>
    
    <rect x="20" y="130" width="400" height="2" fill="url(#goldGrad)"/>
    
    <text x="30" y="160" font-family="Microsoft YaHei, PingFang SC" font-size="36" font-weight="bold" fill="#DDA0DD">阿玛罗尼</text>
    <text x="30" y="195" font-family="Microsoft YaHei, PingFang SC" font-size="18" fill="rgba(255,255,255,0.8)">意大利威尼托</text>
    <text x="30" y="220" font-family="Microsoft YaHei, PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"风干葡萄酒之王" · 科维纳葡萄</text>
    
    <text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">意大利最浓郁醇厚的葡萄酒之一</text>
    
    <text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#DDA0DD" text-anchor="end">${date.display}</text>
  </svg>`;
  
  return sharp(Buffer.from(svg))
    .png()
    .toBuffer()
    .then(buffer => {
      const outputPath = path.join(__dirname, 'output', 'amarone_cover_ai.png');
      fs.writeFileSync(outputPath, buffer);
      console.log('📁 SVG 封面已保存:', outputPath);
      return buffer;
    });
}

function generateContent() {
  return `
<style>
  .region-item { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }
  .region-item h4 { color: #8B008B; margin: 0 0 8px 0; font-size: 16px; }
  h3 { color: #8B008B; border-bottom: 2px solid #DDA0DD; padding-bottom: 8px; margin-top: 25px; }
</style>

<h2 style="text-align: center; color: #8B008B;">🍷 ${date.chinese} 阿玛罗尼完全指南：意大利风干之王</h2>
<p style="text-align: center; color: #666;">威尼托 · 科维纳 · "风干葡萄酒之王"</p>

<section style="background:linear-gradient(135deg,#1a0a2e,#2d1b4e);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#E8D5F0;font-size:16px;line-height:1.9">阿玛罗尼（Amarone della Valpolicella）是<strong style="color:#DDA0DD">意大利威尼托大区</strong>最负盛名的葡萄酒之一，以其独特的"风干葡萄"酿造工艺而闻名。这款葡萄酒酒体饱满、风味浓郁集中，被誉为"意大利最伟大的葡萄酒之一"。本文将带你全面了解<strong style="color:#DDA0DD">阿玛罗尼的魅力</strong>。</p>
</section>

<h3>🍇 一、风干工艺（Appassimento）</h3>
<section style="background:#f8f0ff;padding:18px;border-radius:8px">

<div class="region-item">
<h4>独特的酿造传统</h4>
<p style="color:#333;line-height:1.8;margin:0">
阿玛罗尼最独特之处在于其<strong>风干工艺</strong>（Appassimento）：葡萄采摘后，被放置在通风良好的竹席或木架上自然风干数个月（通常为3-4个月），导致葡萄脱水，糖分和风味物质高度浓缩。
</p>
</div>

</section>

<h3>🍇 二、主要葡萄品种</h3>
<section style="background:#f0f0ff;padding:18px;border-radius:8px">

<div class="region-item">
<h4>科维纳（Corvina）</h4>
<p style="color:#333;line-height:1.8;margin:0">主角品种，提供酸度、果味和优雅的花香。通常占混酿的45-95%。</p>
</div>

<div class="region-item">
<h4>科维诺内（Corvinone）</h4>
<p style="color:#333;line-height:1.8;margin:0">科维纳的变种，果实更大，单宁更丰富，增加酒体和结构。</p>
</div>

<div class="region-item">
<h4>罗蒂内拉（Rondinella）</h4>
<p style="color:#333;line-height:1.8;margin:0">传统品种，增加颜色和香气复杂度，耐风干。</p>
</div>

<div class="region-item">
<h4>莫利纳拉（Molinara）</h4>
<p style="color:#333;line-height:1.8;margin:0">传统品种，为葡萄酒带来更多酸度和清爽感。</p>
</div>

</section>

<h3>🏛️ 三、核心产区</h3>
<section style="background:#FFF8DC;padding:18px;border-radius:8px">

<div class="region-item">
<h4>经典瓦尔波利切拉（Valpolicella Classica）</h4>
<p style="color:#333;line-height:1.8;margin:0">核心区域，包括Negrar、Fumane、Marano等五个著名山谷。这里出产的阿玛罗尼品质最高。</p>
</div>

<div class="region-item">
<h4>瓦尔波利切拉东部（Valpolicella Orientale）</h4>
<p style="color:#333;line-height:1.8;margin:0">向东延伸的区域，海拔变化大，风土多样。</p>
</div>

<div class="region-item">
<h4>瓦尔波利切拉扩展区（Valpantena）</h4>
<p style="color:#333;line-height:1.8;margin:0">Classica以北的山谷，近年品质显著提升。</p>
</div>

</section>

<h3>🍷 四、酿造工艺与法规</h3>
<section style="background:#E6E6FA;padding:18px;border-radius:8px">

<div class="region-item">
<h4>工艺特点</h4>
<p style="color:#333;line-height:1.8;margin:0">
• <strong>风干：</strong>3-4个月，葡萄重量减少40-50%<br/>
• <strong>发酵：</strong>缓慢发酵，持续30-50天<br/>
• <strong>陈酿：</strong>橡木桶中至少2年，通常4-6年<br/>
• <strong>瓶中陈酿：</strong>装瓶后继续陈年
</p>
</div>

<div class="region-item">
<h4>DOCG法规</h4>
<p style="color:#333;line-height:1.8;margin:0">
• <strong>最低酒精度：</strong>14%（珍藏级14.5%）<br/>
• <strong>风干时间：</strong>至少120天<br/>
• <strong>陈酿时间：</strong>至少2年（珍藏级4年）<br/>
• <strong>瓶中陈酿：</strong>至少4个月
</p>
</div>

</section>

<h3>👃 五、品鉴要点</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">

<div class="region-item">
<h4>典型特征</h4>
<p style="color:#333;line-height:1.8;margin:0">
• <strong>颜色：</strong>深宝石红，边缘带石榴红<br/>
• <strong>香气：</strong>黑樱桃、李子干、杏仁、可可、咖啡、皮革<br/>
• <strong>口感：</strong>酒体饱满，单宁丰富但柔滑<br/>
• <strong>甜度：</strong>干型（过去曾被误认为甜酒）<br/>
• <strong>余味：</strong>持久，带有苦甜杏仁味
</p>
</div>

</section>

<h3>🍽️ 六、配餐建议</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.9;font-size:16px">阿玛罗尼的结构和浓郁风味适合搭配<strong>口味浓烈的菜肴</strong>：</p>
<p style="color:#333;line-height:1.8">• <strong>烤肉：</strong>烤羊肉、烤牛排、炭烤猪肉</p>
<p style="color:#333;line-height:1.8">• <strong>野味：</strong>鹿肉、野猪肉、兔肉</p>
<p style="color:#333;line-height:1.8">• <strong>成熟奶酪：</strong>陈年帕尔马干酪、戈贡佐拉蓝纹奶酪</p>
<p style="color:#333;line-height:1.8">• <strong>意式炖菜：</strong>经典意式炖牛肉（Brasato）</p>
</section>

<h3>💰 七、知名酒庄</h3>
<section style="background:#e8f5e9;padding:18px;border-radius:8px">

<div class="region-item">
<h4>Quintarelli - 昆塔莱利</h4>
<p style="color:#333;line-height:1.8;margin:0">阿玛罗尼的传奇酒庄，产量极低，品质极高，被誉为"阿玛罗尼之神"。</p>
</div>

<div class="region-item">
<h4>Dal Forno Romano</h4>
<p style="color:#333;line-height:1.8;margin:0">现代派代表，酿造浓郁集中、极具力量的阿玛罗尼。</p>
</div>

<div class="region-item">
<h4>Allegrini - 阿莱格里尼</h4>
<p style="color:#333;line-height:1.8;margin:0">经典阿玛罗尼品牌，品质稳定，在全球享有盛誉。</p>
</div>

<div class="region-item">
<h4>Masi - 玛西</h4>
<p style="color:#333;line-height:1.8;margin:0">最具创新精神的酒庄之一，推广阿玛罗尼的全球先驱。</p>
</div>

</section>

<section style="background:linear-gradient(135deg,#1a0a2e,#2d1b4e);padding:22px;border-radius:10px;text-align:center">
<p style="color:#E8D5F0;font-size:16px;line-height:1.9">阿玛罗尼是意大利葡萄酒中最为<strong style="color:#DDA0DD">独特和令人难忘</strong>的存在之一。其复杂的风干工艺、浓郁的风味和悠长的余韵，使得每一口都充满惊喜。</p>
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
  console.log('🥂 生成阿玛罗尼完全指南文章');
  console.log('日期:', date.display);
  console.log('============================================================');
  
  try {
    const coverBuffer = await generateCoverWithAI();
    
    const article = {
      title: `🍷 ${date.chinese} 阿玛罗尼完全指南：意大利风干之王`,
      author: '红酒顾问',
      digest: '阿玛罗尼是意大利威尼托最负盛名的葡萄酒，以独特的"风干葡萄"工艺闻名。本文详解风干工艺、葡萄品种、核心产区和知名酒庄。',
      content: generateContent(),
      coverImage: 'amarone_cover_ai.png',
      category: 'wine-knowledge',
      tags: ['阿玛罗尼', '意大利葡萄酒', '威尼托', '风干葡萄', '瓦尔波利切拉'],
      publishDate: date.full
    };
    
    const outputPath = path.join(__dirname, 'output', `amarone_${date.full.replace(/-/g, '')}.json`);
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