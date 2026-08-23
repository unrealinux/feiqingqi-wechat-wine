/**
 * 巴巴拉斯科葡萄酒完全指南
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
  console.log('🎨 使用 baoyu-imagine + DashScope 生成写实巴巴拉斯科封面...');
  
  const coverPath = path.join(__dirname, 'output', 'barbaresco_cover_real.png');
  const prompt = 'Photorealistic Italian Barbaresco wine, Nebbiolo grapes in Piedmont vineyards, rolling hills of Langhe at golden hour, elegant wine bottles, traditional stone cellars, Italian wine culture, professional photography, 8K ultra-detailed';
  
  try {
    const scriptPath = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
    const cmd = `npx -y bun "${scriptPath}" --prompt "${prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`;
    
    console.log('   调用 baoyu-imagine...');
    const { stdout, stderr } = await execPromise(cmd, { timeout: 180000 });
    
    if (stdout.includes('cover.png') || stdout.includes('barbaresco_cover_real.png') || fs.existsSync(coverPath)) {
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
        
        <text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🍷 巴巴拉斯科完全指南</text>
        
        <text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">意大利皮埃蒙特 · 巴罗洛的姐妹 · 内比奥罗</text>
        
        <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#8B0000" text-anchor="end">${date.display}</text>
      </svg>`;
      
      const textBuffer = Buffer.from(svg);
      const finalBuffer = await sharp(resizedBuffer)
        .composite([{ input: textBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer();
      
      const outputPath = path.join(__dirname, 'output', 'barbaresco_cover_ai.png');
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
    <text x="700" y="230" font-family="serif" font-size="14" fill="#1a1a2e" text-anchor="middle" font-weight="bold">BARBARESCO</text>
    <text x="700" y="250" font-family="serif" font-size="10" fill="#DAA520" text-anchor="middle">DOCG</text>
    
    <text x="700" y="330" font-family="serif" font-size="12" fill="rgba(255,255,255,0.6)" text-anchor="middle">Piedmont, Italy</text>
    
    <text x="30" y="80" font-family="Microsoft YaHei, serif" font-size="48" font-weight="bold" fill="url(#goldGrad)" filter="url(#glow)">🍷</text>
    
    <rect x="20" y="130" width="400" height="2" fill="url(#goldGrad)"/>
    
    <text x="30" y="160" font-family="Microsoft YaHei, PingFang SC" font-size="36" font-weight="bold" fill="#DAA520">巴巴拉斯科</text>
    <text x="30" y="195" font-family="Microsoft YaHei, PingFang SC" font-size="18" fill="rgba(255,255,255,0.8)">意大利皮埃蒙特</text>
    <text x="30" y="220" font-family="Microsoft YaHei, PingFang SC" font-size="16" fill="rgba(255,255,255,0.6)">"酒王之后" · 内比奥罗葡萄</text>
    
    <text x="30" y="340" font-family="Microsoft YaHei" font-size="14" fill="rgba(255,255,255,0.5)">与巴罗洛并称"皮埃蒙特双雄"</text>
    
    <text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#DAA520" text-anchor="end">${date.display}</text>
  </svg>`;
  
  return sharp(Buffer.from(svg))
    .png()
    .toBuffer()
    .then(buffer => {
      const outputPath = path.join(__dirname, 'output', 'barbaresco_cover_ai.png');
      fs.writeFileSync(outputPath, buffer);
      console.log('📁 SVG 封面已保存:', outputPath);
      return buffer;
    });
}

function generateContent() {
  return `
<style>
  .region-item { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }
  .region-item h4 { color: #800000; margin: 0 0 8px 0; font-size: 16px; }
  h3 { color: #800000; border-bottom: 2px solid #A52A2A; padding-bottom: 8px; margin-top: 25px; }
</style>

<h2 style="text-align: center; color: #800000;">🍷 ${date.chinese} 巴巴拉斯科完全指南：意大利酒王之后</h2>
<p style="text-align: center; color: #666;">皮埃蒙特 · 内比奥罗 · "酒王之后"</p>

<section style="background:linear-gradient(135deg,#2d1f1f,#1a1a2e);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#FFE4E1;font-size:16px;line-height:1.9">巴巴拉斯科（Barbaresco）是<strong style="color:#DC143C">意大利皮埃蒙特</strong>最负盛名的葡萄酒之一，与巴罗洛并称为"皮埃蒙特双雄"。虽然常被称作"巴罗洛的姐妹"，但其独特的风土和优雅风格使其独树一帜。本文将带你全面了解<strong style="color:#DC143C">巴巴拉斯科的魅力</strong>。</p>
</section>

<h3>🍇 一、认识内比奥罗葡萄</h3>
<section style="background:#fff0f0;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8">巴巴拉斯科同样采用<strong>100%内比奥罗（Nebbiolo）</strong>葡萄酿造。这种被誉为"黑皮诺表亲"的葡萄品种，在皮埃蒙特独特的风土条件下展现出无与伦比的魅力。</p>

<div class="region-item">
<h4>葡萄品种特性</h4>
<p style="color:#333;line-height:1.8;margin:0">
• <strong>果皮：</strong>薄而富含单宁，酿造出深邃的宝石红色<br/>
• <strong>香气：</strong>年轻时带有玫瑰花香、樱桃和覆盆子<br/>
• <strong>陈年：</strong>可发展出皮革、烟草和松露的复杂风味<br/>
• <strong>挑剔：</strong>对气候和土壤要求极高，仅适合特定产区
</p>
</div>
</section>

<h3>🏛️ 二、核心村庄与葡萄园</h3>
<section style="background:#FFF8DC;padding:18px;border-radius:8px">

<div class="region-item">
<h4>巴巴拉斯科（Barbaresco）</h4>
<p style="color:#333;line-height:1.8;margin:0">核心村庄，位于塔纳罗河（Tanaro）右岸，葡萄园分布在海拔250-400米的向阳山坡上。这里出产的葡萄酒以优雅和细腻著称。</p>
</div>

<div class="region-item">
<h4>内维（Neive）</h4>
<p style="color:#333;line-height:1.8;margin:0">第二重要村庄，以出产结构紧实、单宁充沛的葡萄酒闻名。多个特级葡萄园（Asili、Gallina等）位于此。</p>
</div>

<div class="region-item">
<h4>特雷伊索（Treiso）</h4>
<p style="color:#333;line-height:1.8;margin:0">海拔最高的村庄之一，葡萄酒以果香浓郁和优雅轻盈著称，常被比作"女版巴罗洛"。</p>
</div>

<div class="region-item">
<h4>圣斯特凡诺（San Stefano）</h4>
<p style="color:#333;line-height:1.8;margin:0">著名的单一葡萄园，酿造出巴巴拉斯科最强劲的葡萄酒之一，陈年潜力极佳。</p>
</div>

</section>

<h3>🍷 三、酿造工艺与法规</h3>
<section style="background:#E6E6FA;padding:18px;border-radius:8px">

<div class="region-item">
<h4>传统工艺</h4>
<p style="color:#333;line-height:1.8;margin:0">
• <strong>浸皮发酵：</strong>约20-30天，提取颜色和单宁<br/>
• <strong>橡木桶陈酿：</strong>通常使用225升小橡木桶<br/>
• <strong>陈年时间：</strong>根据不同等级有所差异
</p>
</div>

<div class="region-item">
<h4>法规要求（DOCG）</h4>
<p style="color:#333;line-height:1.8;margin:0">
• <strong>巴巴拉斯科：</strong>至少陈酿26个月，其中橡木桶9个月<br/>
• <strong>珍藏（Riserva）：</strong>至少陈酿50个月<br/>
• <strong>单一葡萄园：</strong>标注单一葡萄园需陈酿37个月
</p>
</div>

</section>

<h3>👃 四、品鉴要点</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">

<div class="region-item">
<h4>典型特征</h4>
<p style="color:#333;line-height:1.8;margin:0">
• <strong>颜色：</strong>石榴红，略带橙色调<br/>
• <strong>香气：</strong>玫瑰花香、樱桃、覆盆子、焦油、松露<br/>
• <strong>单宁：</strong>细腻而有力，不同于巴罗洛的强劲<br/>
• <strong>酸度：</strong>中高，为酒体提供支撑<br/>
• <strong>余味：</strong>悠长，带有矿物感
</p>
</div>

<div class="region-item">
<h4>与巴罗洛的区别</h4>
<p style="color:#333;line-height:1.8;margin:0">
<strong>巴巴拉斯科：</strong>更优雅、更柔和、果香更突出<br/>
<strong>巴罗洛：</strong>更强劲、更紧实、单宁更充沛
</p>
</div>

</section>

<h3>🍽️ 五、配餐建议</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.9;font-size:16px">巴巴拉斯科的优雅特性使其成为<strong>精致的意大利北部菜肴</strong>的完美搭配：</p>
<p style="color:#333;line-height:1.8">• <strong>烤小牛肉：</strong>嫩煎小牛肉配迷迭香</p>
<p style="color:#333;line-height:1.8">• <strong>松露烩饭：</strong>皮埃蒙特阿尔巴黑松露烩饭</p>
<p style="color:#333;line-height:1.8">• <strong>意式烩肉：</strong>传统意式烩牛肉</p>
<p style="color:#333;line-height:1.8">• <strong>成熟奶酪：</strong>如塔雷吉欧（Taleggio）或芳提娜（Fontina）</p>
</section>

<h3>💰 六、知名酒庄推荐</h3>
<section style="background:#e8f5e9;padding:18px;border-radius:8px">

<div class="region-item">
<h4>Gaja - 嘉雅</h4>
<p style="color:#333;line-height:1.8;margin:0">巴巴拉斯科最负盛名的酒庄，将传统与现代完美结合，开创了巴巴拉斯科的现代篇章。</p>
</div>

<div class="region-item">
<h4>Bruno Giacosa - 布鲁诺·贾科萨</h4>
<p style="color:#333;line-height:1.8;margin:0">传统派代表，专注于单一葡萄园，坚持传统酿造方法，出产极高品质的葡萄酒。</p>
</div>

<div class="region-item">
<h4>Produttori del Barbaresco</h4>
<p style="color:#333;line-height:1.8;margin:0">合作社性质，集合了多个农户的葡萄，品质稳定，性价比高。</p>
</div>

<div class="region-item">
<h4>La Spinetta - 拉斯皮内塔</h4>
<p style="color:#333;line-height:1.8;margin:0">现代派先驱，酿造出标志性的"S Giorgio"等顶级酒款。</p>
</div>

</section>

<section style="background:linear-gradient(135deg,#2d1f1f,#1a1a2e);padding:22px;border-radius:10px;text-align:center">
<p style="color:#FFE4E1;font-size:16px;line-height:1.9">巴巴拉斯科与巴罗洛并称皮埃蒙特最伟大的葡萄酒，虽然风格略有不同，但同样令人着迷。作为<strong style="color:#DC143C">"酒王之后"</strong>，它以更优雅的姿态展现了内比奥罗的极致魅力。</p>
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
  console.log('🥂 生成巴巴拉斯科完全指南文章');
  console.log('日期:', date.display);
  console.log('============================================================');
  
  try {
    const coverBuffer = await generateCoverWithAI();
    const article = {
      title: `🍷 ${date.chinese} 巴巴拉斯科完全指南：意大利酒王之后`,
      author: '红酒顾问',
      digest: '巴巴拉斯科是意大利皮埃蒙特最负盛名的葡萄酒，与巴罗洛并称"皮埃蒙特双雄"。本文详解内比奥罗葡萄、核心村庄、酿造工艺及知名酒庄。',
      content: generateContent(),
      coverImage: 'barbaresco_cover_ai.png',
      category: 'wine-knowledge',
      tags: ['巴巴拉斯科', '意大利葡萄酒', '皮埃蒙特', '内比奥罗', '酒王之后'],
      publishDate: date.full
    };
    
    const outputPath = path.join(__dirname, 'output', `barbaresco_${date.full.replace(/-/g, '')}.json`);
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