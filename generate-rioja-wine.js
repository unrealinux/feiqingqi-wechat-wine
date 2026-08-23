/**
 * 里奥哈葡萄酒指南文章生成器
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
  console.log('🎨 使用 baoyu-imagine + DashScope 生成写实里奥哈封面...');
  
  const coverPath = path.join(__dirname, 'output', 'rioja_wine_cover_real.png');
  const prompt = 'Photorealistic Spanish Rioja wine region landscape, terraced vineyards, historic winery buildings, wine barrels in cellars, Spanish wine bottles, sunset over mountains, La Rioja Spain, professional photography, 8K ultra-detailed';
  
  try {
    const scriptPath = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
    const cmd = `npx -y bun "${scriptPath}" --prompt "${prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`;
    
    console.log('   调用 baoyu-imagine...');
    const { stdout, stderr } = await execPromise(cmd, { timeout: 180000 });
    
    if (stdout.includes('cover.png') || stdout.includes('rioja_wine_cover_real.png') || fs.existsSync(coverPath)) {
      console.log('   ✅ AI图片生成成功');
      
      const resizedBuffer = await sharp(coverPath)
        .resize(900, 383, { fit: 'cover', position: 'center' })
        .png()
        .toBuffer();
      
      const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#FFD700"/>
            <stop offset="100%" style="stop-color:#DC143C"/>
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.7"/>
          </filter>
        </defs>
        
        <rect x="0" y="230" width="900" height="153" fill="rgba(0,0,0,0.7)"/>
        
        <text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🍷 里奥哈葡萄酒指南</text>
        
        <text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">丹魄葡萄 · 西班牙分级 · 橡木桶陈酿</text>
        
        <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#FFD700" text-anchor="end">${date.display}</text>
      </svg>`;
      
      const textBuffer = Buffer.from(svg);
      const finalBuffer = await sharp(resizedBuffer)
        .composite([{ input: textBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer();
      
      const outputPath = path.join(__dirname, 'output', 'rioja_wine_cover_ai.png');
      fs.writeFileSync(outputPath, finalBuffer);
      console.log('   📁 封面已保存:', outputPath);
      
      return finalBuffer;
    }
    
    throw new Error('生成失败: ' + stderr);
    
  } catch (err) {
    console.warn('   ⚠️ AI 生成失败:', err.message);
    return generateLocalCover();
  }
}

function generateLocalCover() {
  console.log('   使用本地备用封面');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="383" viewBox="0 0 900 383">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#3d1f1f"/>
    </linearGradient>
    <linearGradient id="riojaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#FFD700"/>
      <stop offset="100%" style="stop-color:#DC143C"/>
    </linearGradient>
  </defs>
  <rect width="900" height="383" fill="url(#g)"/>
  
  <!-- 西班牙旗帜色装饰 -->
  <g opacity="0.15">
    <rect x="0" y="0" width="300" height="383" fill="#DC143C"/>
    <rect x="300" y="0" width="300" height="383" fill="#FFD700"/>
    <rect x="600" y="0" width="300" height="383" fill="#DC143C"/>
  </g>
  
  <!-- 葡萄园梯田 -->
  <g transform="translate(100, 200)">
    <polygon points="0,50 50,45 100,50 150,40 200,45 250,50 250,100 0,100" fill="#228B22" opacity="0.8"/>
    <polygon points="50,100 100,95 150,100 200,90 250,95 300,100 300,140 50,140" fill="#2E8B57" opacity="0.8"/>
  </g>
  
  <!-- 里奥哈酒瓶 -->
  <g transform="translate(500, 140)">
    <rect x="35" y="30" width="30" height="80" fill="#722F37" rx="2"/>
    <rect x="42" y="15" width="16" height="15" fill="#8B0000"/>
    <rect x="47" y="8" width="6" height="10" fill="#2F4F4F"/>
    <rect x="38" y="110" width="24" height="20" fill="#8B0000"/>
    <!-- 标签 -->
    <rect x="40" y="50" width="20" height="30" fill="#FFD700" opacity="0.9"/>
    <text x="50" y="70" font-size="8" fill="#8B0000" text-anchor="middle">Rioja</text>
  </g>
  
  <!-- 橡木桶 -->
  <g transform="translate(600, 200)">
    <ellipse cx="30" cy="10" rx="25" ry="8" fill="#8B4513"/>
    <rect x="5" y="10" width="50" height="40" fill="#A0522D"/>
    <ellipse cx="30" cy="50" rx="25" ry="8" fill="#8B4513"/>
    <line x1="5" y1="20" x2="55" y2="20" stroke="#654321" stroke-width="2"/>
    <line x1="5" y1="30" x2="55" y2="30" stroke="#654321" stroke-width="2"/>
    <line x1="5" y1="40" x2="55" y2="40" stroke="#654321" stroke-width="2"/>
  </g>
  
  <!-- 标题框 -->
  <g transform="translate(480, 50)">
    <rect x="0" y="0" width="340" height="130" rx="10" fill="#FFD700" opacity="0.95"/>
    <rect x="0" y="0" width="340" height="130" rx="10" fill="none" stroke="#DC143C" stroke-width="4"/>
    <text x="170" y="45" font-family="Microsoft YaHei, sans-serif" font-size="36" font-weight="bold" fill="#1a1a2e" text-anchor="middle">🍷 里奥哈</text>
    <text x="170" y="90" font-family="Microsoft YaHei, sans-serif" font-size="24" fill="#1a1a2e" text-anchor="middle">西班牙葡萄酒指南</text>
    <line x1="60" y1="110" x2="280" y2="110" stroke="#DC143C" stroke-width="2"/>
  </g>
  
  <!-- 底部信息 -->
  <rect x="0" y="323" width="900" height="60" fill="#1a1a1a" opacity="0.95"/>
  <g transform="translate(30, 345)">
    <text x="0" y="0" font-family="Microsoft YaHei, sans-serif" font-size="26" font-weight="bold" fill="#FFD700">🍷 ${date.display} 里奥哈葡萄酒指南</text>
    <text x="0" y="30" font-family="Microsoft YaHei, sans-serif" font-size="15" fill="rgba(255,255,255,0.85)">丹魄葡萄 · 西班牙分级 · 橡木桶陈酿</text>
  </g>
</svg>`;
  const buffer = sharp(Buffer.from(svg)).png().toBuffer();
  const outputPath = path.join(__dirname, 'output', 'rioja_wine_cover_ai.png');
  fs.writeFileSync(outputPath, buffer);
  console.log('📁 SVG 封面已保存:', outputPath);
  return buffer;
}

function generateContent() {
  return `
<style>
  .region-item { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }
  .region-item h4 { color: #B22222; margin: 0 0 8px 0; font-size: 16px; }
  h3 { color: #B22222; border-bottom: 2px solid #DC143C; padding-bottom: 8px; margin-top: 25px; }
</style>

<h2 style="text-align: center; color: #B22222;">🍷 ${date.chinese} 里奥哈葡萄酒指南：丹魄·分级·传奇酒庄</h2>
<p style="text-align: center; color: #666;">丹魄葡萄 · 西班牙分级 · 橡木桶陈酿</p>

<section style="background:linear-gradient(135deg,#3d1f1f,#1a1a2e);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#FFE4C4;font-size:16px;line-height:1.9">里奥哈是<strong style="color:#FFD700">西班牙最著名的葡萄酒产区</strong>，拥有超过千年的酿酒历史。以丹魄（Tempranillo）为主打的里奥哈葡萄酒，以其独特的橡木桶陈酿风格和卓越的品质享誉全球。本文将带你深入了解<strong style="color:#FFD700">西班牙葡萄酒的核心产区</strong>。</p>
</section>

<h3>🏔 一、里奥哈三大子产区</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">

<div class="region-item">
<h4>👑 里奥哈阿拉维萨（Rioja Alta）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>里奥哈最负盛名的子产区<br/>
<strong>• 位置：</strong>埃布罗河北岸，海拔较高<br/>
<strong>• 气候：</strong>凉爽，大西洋影响显著<br/>
<strong>• 土壤：</strong>石灰质粘土，富含铁<br/>
<strong>• 特点：</strong>酒体优雅，单宁细腻，酸度活跃<br/>
<strong>• 代表酒庄：</strong>Marqués de Riscal、La Rioja Alta、Cune</p>
</div>

<div class="region-item">
🏆 <h4>里奥哈东方（Rioja Oriental）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>传统与现代融合的产区<br/>
<strong>• 位置：</strong>埃布罗河南岸<br/>
<strong>• 气候：</strong>温暖，大陆性气候<br/>
<strong>• 土壤：</strong>冲积土，肥沃<br/>
<strong>• 特点：</strong>果味浓郁，酒体饱满<br/>
<strong>• 代表酒庄：</strong>Bodegas Beronia、Ondarre</p>
</div>

<div class="region-item">
🏆 <h4>里奥哈阿拉维萨-埃布罗（Rioja Alavesa）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>高品质丹魄的核心产地<br/>
<strong>• 位置：</strong>巴斯克地区<br/>
<strong>• 气候：</strong>极端大陆性，昼夜温差大<br/>
<strong>• 土壤：</strong>白垩质粘土<br/>
<strong>• 特点：</strong>结构紧凑，陈年潜力强<br/>
<strong>• 代表酒庄：</strong>Viña Galana、Bodegas López</p>
</div>

</section>

<h3>🍇 二、里奥哈核心葡萄品种</h3>
<section style="background:#FFF8DC;padding:18px;border-radius:8px">

<div class="region-item">
<h4>🔴 丹魄（Tempranillo）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>里奥哈的绝对主角，占种植70%+<br/>
<strong>• 特点：</strong>李子、无花果、烟草、皮革、丹宁细腻<br/>
<strong>• 口感：</strong>酒体中等至饱满，酸度适中<br/>
<strong>• 陈年：</strong>可陈年15-30年<br/>
<strong>• 代表：</strong>里奥哈丹魄单品</p>
</div>

<div class="region-item">
🔴 <h4>歌海娜（Garnacha）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>里奥哈第二大红品种<br/>
<strong>• 特点：</strong>红色水果、甜香料、酒精度高<br/>
<strong>• 口感：</strong>酒体圆润，单宁柔和<br/>
<strong>• 代表：</strong>里奥哈桃红、歌海娜单品</p>
</div>

<div class="region-item">
🔴 <h4>格拉西亚诺（Graciano）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>里奥哈特有品种，珍贵<br/>
<strong>• 特点：</strong>深色、高酸、强大陈年能力<br/>
<strong>• 口感：</strong>结构感强，常用于调配<br/>
<strong>• 代表：</strong>部分珍藏级混酿</p>
</div>

<div class="region-item">
⚪ <h4>维奥娜（Viura）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>里奥哈主要白葡萄品种<br/>
<strong>• 特点：</strong>青苹果、柑橘、矿物质<br/>
<strong>• 口感：</strong>清爽酸度，中等酒体<br/>
<strong>• 代表：</strong>里奥哈白葡萄酒</p>
</div>

</section>

<h3>🏆 三、里奥哈分级制度</h3>
<section style="background:#f5f5f5;padding:18px;border-radius:8px">

<div class="region-item">
<h4>🍷 新酒（Joven）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 陈酿要求：</strong>不经橡木桶或短时间桶陈<br/>
<strong>• 特点：</strong>果味新鲜，直接易饮<br/>
<strong>• 价格：</strong>80-150元<br/>
<strong>• 代表：</strong>入门级里奥哈</p>
</div>

<div class="region-item">
🛡 <h4>陈酿（Crianza）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 陈酿要求：</strong>橡木桶至少12个月+瓶中12个月<br/>
<strong>• 特点：</strong>果味与橡木风味平衡<br/>
<strong>• 价格：</strong>150-300元<br/>
<strong>• 代表：</strong>日常优质选择</p>
</div>

<div class="region-item">
⭐ <h4>珍藏（Reserva）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 陈酿要求：</strong>橡木桶至少18个月+瓶中18个月<br/>
<strong>• 特点：</strong>复杂风味，优雅平衡<br/>
<strong>• 价格：</strong>300-600元<br/>
<strong>• 代表：</strong>品质出众</p>
</div>

<div class="region-item">
💎 <h4>特级珍藏（Gran Reserva）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 陈酿要求：</strong>橡木桶至少24个月+瓶中36个月<br/>
<strong>• 特点：</strong>极致复杂，陈年潜力极强<br/>
<strong>• 价格：</strong>600-2000元+<br/>
<strong>• 代表：</strong>传奇年份，如1964、1973</p>
</div>

</section>

<h3>🪵 四、橡木桶与陈酿风格</h3>
<section style="background:#e8f5e9;padding:18px;border-radius:8px">

<div class="region-item">
🪵 <h4>美国橡木桶</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 特点：</strong>香草、椰子、奶油味明显<br/>
<strong>• 传统：</strong>里奥哈传统风格<br/>
<strong>• 代表：</strong>经典里奥哈风味</p>
</div>

<div class="region-item">
🪵 <h4>法国橡木桶</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 特点：</strong>香料、烘烤、矿物味<br/>
<strong>• 现代：</strong>越来越多酒庄使用<br/>
<strong>• 代表：</strong>高端里奥哈</p>
</div>

<div class="region-item">
🪵 <h4>混合桶</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 特点：</strong>平衡美式与法式风味<br/>
<strong>• 创新：</strong>现代酿酒师偏好<br/>
<strong>• 代表：</strong>当代里奥哈</p>
</div>

</section>

<h3>💰 五、里奥哈价格全解析</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰 80-150 元（入门）</strong><br/>
<span style="color:#666">• 里奥哈新酒（Joven）</span><br/>
<span style="color:#666">• 入门级丹魄</span><br/>
<span style="color:#666">• 特点：果香简单，新鲜易饮</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰💰 150-300 元（进阶）</strong><br/>
<span style="color:#666">• 里奥哈陈酿（Crianza）</span><br/>
<span style="color:#666">• 基础珍藏级</span><br/>
<strong style="color:#c62828">• 特点：橡木桶风味开始显现</strong></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰💰💰 300-800 元（高级）</strong><br/>
<span style="color:#666">• 珍藏级（Reserva）</span><br/>
<span style="color:#666">• 名庄入门</span><br/>
<strong style="color:#c62828">• 特点：可陈年5-15年</strong></p>

<p style="color:#333;line-height:1.8"><strong>💎💎💎 800元以上（高端）</strong><br/>
<span style="color:#666">• 特级珍藏（Gran Reserva）</span><br/>
<span style="color:#666">• 传奇酒庄（Vega Sicilia、Pingus）</span><br/>
<strong style="color:#c62828">• 特点：对标世界顶级红酒</strong></p>
</section>

<h3>🏰 六、里奥哈传奇酒庄</h3>
<section style="background:#fff3e0;padding:18px;border-radius:8px">

<div class="region-item">
🏰 <h4>Vega Sicilia</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>西班牙酒王，里奥哈膜拜<br/>
<strong>• 代表酒：</strong>Unico（珍藏20年+）<br/>
<strong>• 特点：</strong>复杂深邃，陈年50年+<br/>
<strong>• 价格：</strong>3000元+</p>
</div>

<div class="region-item">
🏰 <h4>Pingus</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>西班牙最贵酒之一<br/>
<strong>• 代表酒：</strong>Pingus年份<br/>
<strong>• 特点：</strong>100%丹魄，极致浓郁<br/>
<strong>• 价格：</strong>5000元+</p>
</div>

<div class="region-item">
🏰 <h4>La Rioja Alta</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>里奥哈传统派代表<br/>
<strong>• 代表酒：</strong>904、890<br/>
<strong>• 特点：</strong>美国桶传统风格<br/>
<strong>• 价格：</strong>500-2000元</p>
</div>

<div class="region-item">
🏰 <h4>Marqués de Riscal</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>里奥哈最古老酒庄之一<br/>
<strong>• 代表酒：</strong>Barón de Chirel<br/>
<strong>• 特点：</strong>创新与传统结合<br/>
<strong>• 价格：</strong>400-1500元</p>
</div>

</section>

<h3>🍽 七、里奥哈配餐指南</h3>
<section style="background:#e8f5e9;padding:18px;border-radius:8px">

<div class="region-item">
🥘 <h4>西班牙美食</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 西班牙火腿：</strong>丹魄（经典组合）<br/>
<strong>• 烤羊排：</strong>珍藏级<br/>
<strong>• 西班牙海鲜饭：</strong>陈酿</p>
</div>

<div class="region-item">
🍖 <h4>肉类</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 牛排：</strong>特级珍藏<br/>
<strong>• 烤肉：</strong>任何成熟度<br/>
<strong>• 炖肉：</strong>陈酿</p>
</div>

<div class="region-item">
🧀 <h4>奶酪</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 曼彻格奶酪：</strong>丹魄<br/>
<strong>• 羊奶酪：</strong>里奥哈<br/>
<strong>• 硬质奶酪：</strong>珍藏级</p>
</div>

</section>

<h3>💡 八、常见误区</h3>
<section style="background:#ffebee;padding:18px;border-radius:8px">
<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区1：里奥哈都是重桶风格</strong><br/>
<span style="color:#666">现代里奥哈有更多果味风格。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区2：丹魄不如赤霞珠</strong><br/>
<span style="color:#666">丹魄是西班牙特有品种，风格独特。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区3：陈酿时间越长越好</strong><br/>
<strong style="color:#666">新派风格更注重果味新鲜。</strong></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区4：里奥哈只有红酒</strong><br/>
<span style="color:#666">也有优质白葡萄酒和桃红。</span></p>

<p style="color:#c62828;line-height:1.8"><strong>误区5：特级珍藏一定最贵</strong><br/>
<span style="color:#666">有些精品酒庄的珍藏级也很贵。</span></p>
</section>

<h3>📝 九、里奥哈选购建议</h3>
<section style="background:#E3F2FD;padding:18px;border-radius:8px;border-left:3px solid #1565C0">
<p style="color:#0d47a1;margin:0">
<strong>✅ 选购技巧：</strong><br/>
<span style="color:#666">• 看分级：Crianza、Reserva、Gran Reserva</span><br/>
<span style="color:#666">• 看年份：优质年份如2018、2017、2015</span><br/>
<span style="color:#666">• 看桶型：美国桶 vs 法国桶</span><br/>
<span style="color:#666">• 看酒庄：知名酒庄品质更有保障</span><br/><br/>
<strong>📦 保存：</strong><br/>
<span style="color:#666">• 避光保存，12-15℃</span><br/>
<span style="color:#666">• 珍藏级可陈年10-20年</span><br/>
<span style="color:#666">• 开瓶后醒酒30分钟</span>
</p>
</section>

<section style="background:linear-gradient(135deg,#3d1f1f,#1a1a2e);padding:22px;border-radius:10px;text-align:center">
<p style="color:#FFD700;font-size:14px;font-weight:bold;margin-bottom:8px">🍷 结语</p>
<p style="color:#FFE4C4;font-size:14px;line-height:1.8;margin:0">里奥哈是西班牙葡萄酒的代名词，拥有悠久的历史和独特的分级制度。从平价易饮的Joven到昂贵稀有的Gran Reserva，从传统美国桶风格到现代法国桶创新——里奥哈葡萄酒的多样性使其成为葡萄酒世界里不可错过的精彩篇章。</p>
<p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display}<br/>关注我们，每天学习红酒知识</p>
</section>`;
}

async function main() {
  console.log('='.repeat(60));
  console.log('🍷 生成里奥哈葡萄酒指南文章');
  console.log('日期:', date.display);
  console.log('='.repeat(60));
  console.log('');

  const coverBuffer = await generateCoverWithAI();
  console.log('');

  console.log('📝 生成文章内容...');
  const content = generateContent();
  const article = {
    title: `🍷 ${date.chinese} 里奥哈葡萄酒指南：丹魄·分级·传奇酒庄`,
    author: '红酒顾问',
    digest: '里奥哈是西班牙最著名的葡萄酒产区。本文详解三大子产区、丹魄品种、四级分级制度和传奇酒庄。',
    content: content
  };
  console.log('   标题:', article.title);
  console.log('   摘要:', article.digest);
  console.log('');

  const outputPath = path.join(__dirname, 'output', `rioja_wine_${date.full.replace(/-/g, '')}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(article, null, 2));
  console.log('📁 文章已保存:', outputPath);
  console.log('');

  console.log('📤 发布到微信公众号草稿箱...');
  
  try {
    console.log('   步骤 1/3: 获取 Access Token...');
    const tokenResp = await axios.get(config.publish.endpoints.token, {
      params: {
        grant_type: 'client_credential',
        appid: config.publish.appId,
        secret: config.publish.appSecret
      },
      timeout: 10000
    });

    if (tokenResp.data.errcode) {
      throw new Error(`获取 access_token 失败: ${tokenResp.data.errmsg} (错误码: ${tokenResp.data.errcode})`);
    }

    const token = tokenResp.data.access_token;
    console.log('   ✅ Token 获取成功');

    console.log('   步骤 2/3: 上传封面图...');
    const coverPath = path.join(__dirname, 'output', 'rioja_wine_cover_ai.png');
    const coverFileBuffer = fs.readFileSync(coverPath);
    const formData = new FormData();
    formData.append('media', coverFileBuffer, { filename: 'cover.png', contentType: 'image/png' });
    
    const uploadResp = await axios.post(
      `https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${token}&type=image`,
      formData,
      { headers: formData.getHeaders(), timeout: 30000 }
    );

    if (uploadResp.data.errcode) {
      throw new Error(`上传封面失败: ${uploadResp.data.errmsg}`);
    }

    const mediaId = uploadResp.data.media_id;
    console.log('   ✅ 封面上传成功, media_id:', mediaId);

    console.log('   步骤 3/3: 创建草稿...');
    const draftResp = await axios.post(
      `https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${token}`,
      {
        articles: [{
          title: article.title,
          author: article.author,
          digest: article.digest,
          content: article.content,
          thumb_media_id: mediaId,
          need_open_comment: 1,
          only_fans_can_comment: 0
        }]
      },
      { headers: { 'Content-Type': 'application/json' }, timeout: 30000 }
    );

    if (draftResp.data.errcode) {
      throw new Error(`创建草稿失败: ${draftResp.data.errmsg}`);
    }

    console.log('');
    console.log('='.repeat(60));
    console.log('✅ 发布成功！');
    console.log('草稿ID:', draftResp.data.media_id);
    console.log('='.repeat(60));

  } catch (err) {
    console.error('');
    console.error('❌ 发布失败:', err.message);
    if (err.response) {
      console.error('   错误详情:', err.response.data);
    }
    console.log('');
    console.log('💡 提示: 封面已生成为 output/rioja_wine_cover_ai.png');
    console.log('💡 文章已保存为:', outputPath);
  }
}

main();