/**
 * 每日葡萄酒购买指南生成脚本 (精简版)
 * 严格遵循 800-1200 字要求
 */

process.env.HTTP_PROXY = '';
process.env.HTTPS_PROXY = '';
require('dotenv').config();
process.env.HTTP_PROXY = '';
process.env.HTTPS_PROXY = '';

const axios = require('axios');
axios.defaults.proxy = false;
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const WeChatPublisher = require('./publisher');

const TODAY = new Date();
const DATE_STRING = `${TODAY.getFullYear()}年${TODAY.getMonth() + 1}月${TODAY.getDate()}日`;
const DATE_SHORT = `${TODAY.getFullYear()}.${String(TODAY.getMonth() + 1).padStart(2, '0')}.${String(TODAY.getDate()).padStart(2, '0')}`;

function generateContent() {
  return `
<style>
  .box { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #8b2252; }
  .item { margin-bottom: 12px; border-bottom: 1px dashed #eee; padding-bottom: 10px; }
  .item:last-child { border-bottom: none; }
  .name { font-weight: bold; color: #333; font-size: 16px; }
  .info { color: #666; font-size: 14px; margin-top: 5px; }
  .price { color: #d4af37; font-weight: bold; }
  .tag { background: #e8f5e9; color: #2e7d32; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-right: 5px; }
  h3 { color: #8b2252; border-bottom: 2px solid #8b2252; padding-bottom: 8px; margin-top: 25px; }
</style>

<h2 style="text-align: center; color: #8b2252;">🍷 ${DATE_STRING} 葡萄酒购买指南</h2>
<p style="text-align: center; color: #666;">资深买手精选 | 性价比与场景适配</p>

<h3>⭐ 本周精选 Top 5</h3>
<div class="box">
  <div class="item"><div class="name">1. 奔富葛兰许 2019 <span class="tag">WS 98</span></div><div class="info">澳洲酒王，黑莓巧克力香气，陈年潜力极佳。</div><div class="price">¥8,000-12,000</div></div>
  <div class="item"><div class="name">2. 拉图城堡 2018 <span class="tag">RP 97</span></div><div class="info">波尔多一级庄，结构强劲，黑醋栗与石墨味。</div><div class="price">¥6,500-8,500</div></div>
  <div class="item"><div class="name">3. 蒙特斯阿尔法 M 2020 <span class="tag">JS 95</span></div><div class="info">智利膜拜级，安第斯山麓风土，性价比极高。</div><div class="price">¥680-880</div></div>
  <div class="item"><div class="name">4. 桑干莫斯卡托 2023 <span class="tag">JS 92</span></div><div class="info">国产精品起泡，荔枝蜂蜜香，清爽开胃。</div><div class="price">¥280-380</div></div>
  <div class="item"><div class="name">5. 奥纳亚马赛托 2019 <span class="tag">JS 96</span></div><div class="info">意大利超托，品丽珠为主，优雅平衡。</div><div class="price">¥1,200-1,600</div></div>
</div>

<h3>💎 高性价比榜单</h3>
<div class="box">
  <p><strong>💰 100-300 元</strong></p>
  <div class="item"><div class="name">干露红魔鬼赤霞珠</div><div class="info">智利国民酒，果香浓郁，日常佐餐首选。</div><div class="price">¥70-100</div></div>
  <div class="item"><div class="name">黄尾袋鼠西拉</div><div class="info">澳洲入门经典，口感顺滑，新手友好。</div><div class="price">¥120-180</div></div>
  
  <p><strong>💰💰 300-800 元</strong></p>
  <div class="item"><div class="name">奔富 Bin 389</div><div class="info">“小葛兰许”，赤霞珠设拉子混酿，品质稳定。</div><div class="price">¥350-480</div></div>
  <div class="item"><div class="name">作品一号序曲</div><div class="info">纳帕谷名庄副牌，优雅细腻，商务宴请佳选。</div><div class="price">¥550-700</div></div>
  
  <p><strong>💎 800 元以上</strong></p>
  <div class="item"><div class="name">活灵魂</div><div class="info">智利酒王，木质与果香完美融合，收藏级。</div><div class="price">¥1,500-2,000</div></div>
  <div class="item"><div class="name">银色标签苍鹰</div><div class="info">波尔多超二级庄，品质出众，性价比突出。</div><div class="price">¥1,200-1,500</div></div>
</div>

<h3>🍽️ 场景推荐</h3>
<div class="box">
  <p><strong>🏛️ 商务宴请：</strong>拉菲传奇波尔多（品牌硬，口感稳）、作品一号序曲（名庄背书）。</p>
  <p><strong>🍷 日常佐餐：</strong>干露红魔鬼（百搭中餐）、黄尾袋鼠（果香充沛）。</p>
  <p><strong>🎁 送礼收藏：</strong>奔富葛兰许（澳洲标杆）、拉图城堡（传世佳酿）。</p>
</div>

<h3>📈 趋势品种</h3>
<div class="box">
  <p><span class="tag">乔治亚陶罐酒</span> 自然酒复兴，独特氧化风味。</p>
  <p><span class="tag">宁夏贺兰山东麓</span> 国产崛起，多款国际金奖。</p>
  <p><span class="tag">阿根廷马尔贝克</span> 浓郁果香，配餐神器。</p>
</div>

<h3>🔗 购买参考</h3>
<div class="box">
  <p>评分来源：WS (Wine Spectator), RP (Robert Parker), JS (James Suckling), Vivino。</p>
  <p>⚠️ <strong>免责声明：</strong>价格仅供参考，以实际购买为准。推荐酒款可在正规商超或电商平台购买。保持中立，不推广特定商家。</p>
  <p style="text-align: right; color: #999; font-size: 12px;">${DATE_STRING} | 飞起器红酒助手</p>
</div>
`;
}

async function generateCover() {
  console.log('🎨 优化封面生成...');
  
  // 尝试多个AI服务
  const coverResult = await tryAIGenerators();
  if (coverResult) return coverResult;
  
  // 使用优化的本地封面
  return generateEnhancedLocalCover();
}

/**
 * 尝试多个AI生成器
 */
async function tryAIGenerators() {
  // 尝试 Z-Image (ModelScope)
  const zimageKey = process.env.ZIMAGE_API_KEY;
  if (zimageKey && zimageKey !== 'your_zimage_api_key_here') {
    try {
      console.log('   尝试 Z-Image...');
      const result = await generateWithZImage(zimageKey);
      if (result) return result;
    } catch (e) { console.log('   Z-Image 失败:', e.message); }
  }

  // 尝试 DashScope (阿里通义万相)
  const dashscopeKey = process.env.DASHSCOPE_API_KEY;
  if (dashscopeKey && dashscopeKey !== 'your_dashscope_key_here') {
    try {
      console.log('   尝试 DashScope...');
      const result = await generateWithDashScope(dashscopeKey);
      if (result) return result;
    } catch (e) { console.log('   DashScope 失败:', e.message); }
  }

  // 尝试 GLM (智谱)
  const glmKey = process.env.GLM_API_KEY;
  if (glmKey && glmKey !== 'your_glm_api_key_here') {
    try {
      console.log('   尝试 GLM...');
      const result = await generateWithGLM(glmKey);
      if (result) return result;
    } catch (e) { console.log('   GLM 失败:', e.message); }
  }

  return null;
}

/**
 * DashScope AI生成 (通义万相)
 */
async function generateWithDashScope(apiKey) {
  try {
    console.log('   使用 DashScope (通义万相) 生成封面...');
    
    // 使用 baoyu-imagine 脚本
    const { execSync } = require('child_process');
    const scriptPath = 'C:/Users/Administrator/.config/opencode/skills/baoyu-skills/skills/baoyu-imagine/scripts/main.ts';
    
    const cmd = `set DASHSCOPE_API_KEY=${apiKey} && npx -y bun "${scriptPath}" --prompt "Luxury wine shop display, premium red wine bottles on elegant wooden shelf, wine glasses with red wine, soft golden ambient lighting, professional commercial photography, rich burgundy and gold colors, elegant and sophisticated" --image "${path.join(__dirname, 'output', 'cover_guide_' + DATE_SHORT.replace(/\./g, '') + '_ai.png')}" --ar 16:9 --quality 2k --provider dashscope`;
    
    execSync(cmd, { stdio: 'inherit', shell: true });
    
    const outputPath = path.join(__dirname, 'output', `cover_guide_${DATE_SHORT.replace(/\./g, '')}_ai.png`);
    if (require('fs').existsSync(outputPath)) {
      console.log('   ✅ DashScope 封面生成成功');
      return outputPath;
    }
  } catch (e) {
    console.log('   DashScope 生成失败:', e.message);
  }
  return null;
}

/**
 * Z-Image AI生成
 */
async function generateWithZImage(apiKey) {
  try {
    const res = await axios.post('https://api-inference.modelscope.cn/v1/images/generations', {
      model: 'Tongyi-MAI/Z-Image-Turbo',
      prompt: 'Luxury wine shop display, premium red wine bottles on elegant wooden shelf, soft golden ambient lighting, wine glasses, professional commercial photography, rich burgundy colors, photorealistic, 8k detailed',
      negative_prompt: 'blurry, low quality, cartoon, text, watermark, distorted',
      steps: 20,
      width: 1280,
      height: 720
    }, { headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'X-ModelScope-Async-Mode': 'true' } });
    
    const taskId = res.data.task_id;
    console.log('   任务ID:', taskId);
    
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 2000));
      const st = await axios.get(`https://api-inference.modelscope.cn/v1/tasks/${taskId}`, { headers: { 'Authorization': `Bearer ${apiKey}` } });
      if (st.data.task_status === 'SUCCEED') {
        console.log('   ✅ Z-Image 成功');
        const img = await axios.get(st.data.output_images[0], { responseType: 'arraybuffer' });
        const buf = await sharp(Buffer.from(img.data)).resize(900, 383, { fit: 'cover', position: 'center' }).png().toBuffer();
        
        // 优化的文字叠加层
        const svg = createOptimizedTextOverlay();
        const final = await sharp(buf).composite([{ input: Buffer.from(svg), top: 0, left: 0 }]).png().toBuffer();
        
        const p = path.join(__dirname, 'output', `cover_guide_${DATE_SHORT.replace(/\./g, '')}.png`);
        fs.writeFileSync(p, final);
        return p;
      }
    }
  } catch (e) { console.log('   Z-Image 错误:', e.message); }
  return null;
}

/**
 * GLM AI生成 (图像理解)
 */
async function generateWithGLM(apiKey) {
  // GLM 主要用于图像理解，生成能力有限，这里作为备选
  return null;
}

/**
 * 创建优化的文字叠加层
 */
function createOptimizedTextOverlay() {
  return `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bottomGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
        <stop offset="40%" stop-color="#000000" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.85"/>
      </linearGradient>
      <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#D4AF37"/>
        <stop offset="50%" stop-color="#F4E4BC"/>
        <stop offset="100%" stop-color="#D4AF37"/>
      </linearGradient>
      <filter id="shadow">
        <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.6"/>
      </filter>
    </defs>
    
    <!-- 底部渐变遮罩 -->
    <rect width="900" height="383" fill="url(#bottomGrad)"/>
    
    <!-- 左上角品牌 -->
    <rect x="20" y="15" width="110" height="35" rx="8" fill="rgba(0,0,0,0.6)"/>
    <text x="75" y="38" font-family="Microsoft YaHei, sans-serif" font-size="16" font-weight="bold" fill="#D4AF37" text-anchor="middle">🍷 飞起器</text>
    
    <!-- 右上角日期 -->
    <rect x="770" y="15" width="110" height="35" rx="17" fill="rgba(0,0,0,0.6)"/>
    <text x="825" y="38" font-family="Microsoft YaHei, sans-serif" font-size="14" fill="#fff" text-anchor="middle">📅 ${DATE_SHORT}</text>
    
    <!-- 主标题 -->
    <text x="40" y="280" font-family="Microsoft YaHei, sans-serif" font-size="42" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🍷 购买指南</text>
    
    <!-- 副标题 -->
    <text x="40" y="325" font-family="Microsoft YaHei, sans-serif" font-size="22" fill="#fff" filter="url(#shadow)">精选推荐 · 高性价比 · 趋势解读</text>
    
    <!-- 底部标签 -->
    <text x="40" y="360" font-family="Microsoft YaHei, sans-serif" font-size="13" fill="rgba(255,255,255,0.7)">资深买手精选 | 葡萄酒购买指南</text>
    
    <!-- 右下角二维码占位 -->
    <rect x="800" y="280" width="75" height="75" rx="8" fill="rgba(255,255,255,0.95)"/>
    <text x="837" y="315" font-family="Microsoft YaHei" font-size="9" fill="#333" text-anchor="middle">扫码关注</text>
    <text x="837" y="330" font-family="Microsoft YaHei" font-size="7" fill="#666" text-anchor="middle">获取更多</text>
  </svg>`;
}

/**
 * 优化的本地封面（带红酒元素装饰）
 */
async function generateEnhancedLocalCover() {
  console.log('   使用优化的本地封面...');
  
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- 主渐变 -->
      <linearGradient id="mainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1a0a1a"/>
        <stop offset="30%" stop-color="#2d1520"/>
        <stop offset="60%" stop-color="#4a1a2e"/>
        <stop offset="100%" stop-color="#8b2252"/>
      </linearGradient>
      
      <!-- 光晕效果 -->
      <radialGradient id="glowGrad" cx="70%" cy="30%" r="60%">
        <stop offset="0%" stop-color="#d4af37" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="#d4af37" stop-opacity="0"/>
      </radialGradient>
      
      <!-- 文字渐变 -->
      <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#D4AF37"/>
        <stop offset="50%" stop-color="#F4E4BC"/>
        <stop offset="100%" stop-color="#D4AF37"/>
      </linearGradient>
      
      <!-- 阴影滤镜 -->
      <filter id="glowFilter">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      
      <filter id="dropShadow">
        <feDropShadow dx="2" dy="2" stdDeviation="2" flood-opacity="0.5"/>
      </filter>
    </defs>
    
    <!-- 背景 -->
    <rect width="900" height="383" fill="url(#mainGrad)"/>
    
    <!-- 装饰光晕 -->
    <circle cx="650" cy="120" r="200" fill="url(#glowGrad)"/>
    
    <!-- 装饰：酒杯剪影 -->
    <g transform="translate(720, 60)" fill="#d4af37" opacity="0.12">
      <ellipse cx="30" cy="20" rx="25" ry="15"/>
      <rect x="27" y="35" width="6" height="50"/>
      <ellipse cx="30" cy="90" rx="20" ry="5"/>
    </g>
    
    <!-- 装饰：葡萄串 -->
    <g transform="translate(80, 50)" fill="#d4af37" opacity="0.1">
      <circle cx="0" cy="0" r="6"/>
      <circle cx="12" cy="5" r="6"/>
      <circle cx="-10" cy="8" r="5"/>
      <circle cx="8" cy="18" r="6"/>
      <circle cx="-5" cy="25" r="5"/>
      <circle cx="15" cy="28" r="4"/>
    </g>
    
    <!-- 装饰线条 -->
    <path d="M 30 120 Q 80 100 130 120 Q 180 140 230 120" stroke="#d4af37" stroke-width="1" fill="none" opacity="0.15"/>
    <path d="M 670 120 Q 720 100 770 120 Q 820 140 870 120" stroke="#d4af37" stroke-width="1" fill="none" opacity="0.15"/>
    
    <!-- 左上角品牌 -->
    <rect x="20" y="15" width="120" height="40" rx="10" fill="rgba(0,0,0,0.5)"/>
    <text x="80" y="42" font-family="Microsoft YaHei, sans-serif" font-size="18" font-weight="bold" fill="#D4AF37" text-anchor="middle" filter="url(#glowFilter)">🍷 飞起器</text>
    
    <!-- 右上角日期 -->
    <rect x="760" y="15" width="120" height="40" rx="20" fill="rgba(0,0,0,0.5)"/>
    <text x="820" y="42" font-family="Microsoft YaHei, sans-serif" font-size="15" fill="#fff" text-anchor="middle">📅 ${DATE_SHORT}</text>
    
    <!-- 主标题区域 -->
    <rect x="30" y="180" width="550" height="150" rx="15" fill="rgba(0,0,0,0.4)"/>
    
    <!-- 主标题 -->
    <text x="60" y="230" font-family="Microsoft YaHei, sans-serif" font-size="44" font-weight="bold" fill="url(#textGrad)" filter="url(#dropShadow)">🍷 购买指南</text>
    
    <!-- 副标题 -->
    <text x="60" y="275" font-family="Microsoft YaHei, sans-serif" font-size="24" fill="#fff" filter="url(#dropShadow)">精选推荐 · 高性价比 · 趋势解读</text>
    
    <!-- 描述 -->
    <text x="60" y="310" font-family="Microsoft YaHei, sans-serif" font-size="14" fill="rgba(255,255,255,0.7)">资深买手为您精选本周热门酒款</text>
    
    <!-- 二维码占位 -->
    <rect x="780" y="200" width="90" height="90" rx="10" fill="rgba(255,255,255,0.95)"/>
    <!-- 二维码模拟图案 -->
    <g transform="translate(795, 215)" fill="#333">
      <rect x="0" y="0" width="12" height="12"/>
      <rect x="18" y="0" width="4" height="4"/>
      <rect x="26" y="0" width="4" height="4"/>
      <rect x="36" y="0" width="4" height="4"/>
      <rect x="50" y="0" width="12" height="12"/>
      <rect x="0" y="18" width="4" height="4"/>
      <rect x="8" y="18" width="4" height="4"/>
      <rect x="18" y="18" width="12" height="12"/>
      <rect x="36" y="18" width="4" height="4"/>
      <rect x="50" y="18" width="4" height="4"/>
      <rect x="58" y="18" width="4" height="4"/>
      <rect x="0" y="36" width="4" height="4"/>
      <rect x="8" y="36" width="4" height="4"/>
      <rect x="22" y="36" width="4" height="4"/>
      <rect x="36" y="36" width="12" height="12"/>
      <rect x="54" y="36" width="4" height="4"/>
    </g>
    <text x="825" y="280" font-family="Microsoft YaHei" font-size="9" fill="#333" text-anchor="middle">扫码关注</text>
    
    <!-- 底部装饰线 -->
    <line x1="30" y1="360" x2="870" y2="360" stroke="#D4AF37" stroke-width="2" opacity="0.4"/>
  </svg>`;
  
  const p = path.join(__dirname, 'output', `cover_guide_${DATE_SHORT.replace(/\./g, '')}.png`);
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  fs.writeFileSync(p, buf);
  console.log('   📁 封面已保存:', p);
  return p;
}

async function main() {
  console.log('🍷 生成每日购买指南...');
  const content = generateContent();
  const article = {
    title: `🍷 ${DATE_STRING} 葡萄酒购买指南`,
    subtitle: '本周精选与高性价比推荐',
    abstract: '资深买手为您精选本周热门酒款，涵盖高性价比榜单与场景推荐。',
    content,
    author: '红酒买手',
    tags: ['购买指南', '高性价比', '红酒推荐']
  };
  
  console.log('📝 内容生成完毕，长度:', content.length);
  
  // 使用已生成的AI封面
  const aiCoverPath = path.join(__dirname, 'output', 'cover_ai_wine_guide.png');
  const coverPath = require('fs').existsSync(aiCoverPath) ? aiCoverPath : await generateCover();
  
  console.log('🎨 封面生成完毕:', coverPath);
  
  const publisher = new WeChatPublisher();
  const res = await publisher.publish({ ...article, thumbUrl: coverPath });
  if (res.success) console.log('✅ 发布成功，草稿 ID:', res.draftId);
  else console.error('❌ 发布失败:', res.error);
  
  fs.writeFileSync(path.join(__dirname, 'output', `guide_${DATE_SHORT.replace(/\./g, '')}.json`), JSON.stringify(article, null, 2));
}

if (require.main === module) main();
module.exports = { main };