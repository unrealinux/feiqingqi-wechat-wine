/**
 * 雪莉酒完全指南文章生成器
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
  console.log('🎨 使用 baoyu-imagine + DashScope 生成写实雪莉酒封面...');
  
  const coverPath = path.join(__dirname, 'output', 'sherry_wine_cover_real.png');
  const prompt = 'Photorealistic Spanish sherry wine glasses, fino and oloroso bottles, old oak barrels in cellar, Jerez de la Frontera Andalusia, dark amber liquid, traditional Spanish wine culture, professional photography, 8K ultra-detailed';
  
  try {
    const scriptPath = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
    const cmd = `npx -y bun "${scriptPath}" --prompt "${prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`;
    
    console.log('   调用 baoyu-imagine...');
    const { stdout, stderr } = await execPromise(cmd, { timeout: 180000 });
    
    if (stdout.includes('cover.png') || stdout.includes('sherry_wine_cover_real.png') || fs.existsSync(coverPath)) {
      console.log('   ✅ AI图片生成成功');
      
      const resizedBuffer = await sharp(coverPath)
        .resize(900, 383, { fit: 'cover', position: 'center' })
        .png()
        .toBuffer();
      
      const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#DAA520"/>
            <stop offset="100%" style="stop-color:#8B4513"/>
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.7"/>
          </filter>
        </defs>
        
        <rect x="0" y="230" width="900" height="153" fill="rgba(0,0,0,0.7)"/>
        
        <text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🍷 雪莉酒完全指南</text>
        
        <text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">西班牙国酒 · 赫雷斯 · 强化葡萄酒</text>
        
        <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#DAA520" text-anchor="end">${date.display}</text>
      </svg>`;
      
      const textBuffer = Buffer.from(svg);
      const finalBuffer = await sharp(resizedBuffer)
        .composite([{ input: textBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer();
      
      const outputPath = path.join(__dirname, 'output', 'sherry_wine_cover_ai.png');
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
      <stop offset="0%" style="stop-color:#2c1810"/>
      <stop offset="100%" style="stop-color:#1a1a2e"/>
    </linearGradient>
    <linearGradient id="sherryGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#DAA520"/>
      <stop offset="100%" style="stop-color:#8B4513"/>
    </linearGradient>
  </defs>
  <rect width="900" height="383" fill="url(#g)"/>
  
  <!-- 装饰线条 -->
  <g stroke="rgba(218,165,32,0.2)" stroke-width="1">
    <line x1="100" y1="50" x2="200" y2="100"/>
    <line x1="800" y1="330" x2="700" y2="280"/>
  </g>
  
  <!-- 雪莉酒杯 -->
  <g transform="translate(180, 150)">
    <!-- 菲诺杯 -->
    <g transform="translate(0, 0)">
      <path d="M15,90 L20,35 L55,35 L60,90 Z" fill="url(#sherryGrad)" opacity="0.8"/>
      <rect x="37" y="20" width="6" height="15" fill="#8B4513"/>
      <ellipse cx="37" cy="90" rx="22" ry="4" fill="#B8860B"/>
    </g>
    <!-- 阿蒙提亚多杯 -->
    <g transform="translate(80, 10)">
      <path d="M15,80 L20,30 L55,30 L60,80 Z" fill="url(#sherryGrad)" opacity="0.85"/>
      <rect x="37" y="15" width="6" height="15" fill="#8B4513"/>
      <ellipse cx="37" cy="80" rx="22" ry="4" fill="#B8860B"/>
    </g>
    <!-- 波特杯 -->
    <g transform="translate(160, 5)">
      <path d="M15,70 L20,25 L55,25 L60,70 Z" fill="url(#sherryGrad)" opacity="0.9"/>
      <rect x="37" y="10" width="6" height="15" fill="#8B4513"/>
      <ellipse cx="37" cy="70" rx="22" ry="4" fill="#B8860B"/>
    </g>
  </g>
  
  <!-- 雪莉酒瓶 -->
  <g transform="translate(520, 160)">
    <rect x="30" y="25" width="35" height="80" fill="#DAA520" rx="2"/>
    <rect x="40" y="10" width="15" height="15" fill="#B8860B"/>
    <rect x="45" y="5" width="5" height="8" fill="#2F4F4F"/>
    <rect x="33" y="55" width="28" height="25" fill="#8B4513" opacity="0.8"/>
    <text x="47" y="72" font-size="8" fill="#DAA520" text-anchor="middle">Jerez</text>
  </g>
  
  <!-- 橡木桶 -->
  <g transform="translate(650, 180)">
    <ellipse cx="25" cy="8" rx="22" ry="6" fill="#8B4513"/>
    <rect x="3" y="8" width="44" height="35" fill="#A0522D"/>
    <ellipse cx="25" cy="43" rx="22" ry="6" fill="#8B4513"/>
  </g>
  
  <!-- 标题框 -->
  <g transform="translate(480, 50)">
    <rect x="0" y="0" width="340" height="130" rx="10" fill="#DAA520" opacity="0.95"/>
    <rect x="0" y="0" width="340" height="130" rx="10" fill="none" stroke="#8B4513" stroke-width="4"/>
    <text x="170" y="45" font-family="Microsoft YaHei, sans-serif" font-size="36" font-weight="bold" fill="#2c1810" text-anchor="middle">🍷 雪莉酒</text>
    <text x="170" y="90" font-family="Microsoft YaHei, sans-serif" font-size="24" fill="#2c1810" text-anchor="middle">完全指南</text>
    <line x1="60" y1="110" x2="280" y2="110" stroke="#8B4513" stroke-width="2"/>
  </g>
  
  <!-- 底部信息 -->
  <rect x="0" y="323" width="900" height="60" fill="#1a1a1a" opacity="0.95"/>
  <g transform="translate(30, 345)">
    <text x="0" y="0" font-family="Microsoft YaHei, sans-serif" font-size="26" font-weight="bold" fill="#DAA520">🍷 ${date.display} 雪莉酒完全指南</text>
    <text x="0" y="30" font-family="Microsoft YaHei, sans-serif" font-size="15" fill="rgba(255,255,255,0.85)">西班牙国酒 · 赫雷斯 · 强化葡萄酒</text>
  </g>
</svg>`;
  const buffer = sharp(Buffer.from(svg)).png().toBuffer();
  const outputPath = path.join(__dirname, 'output', 'sherry_wine_cover_ai.png');
  fs.writeFileSync(outputPath, buffer);
  console.log('📁 SVG 封面已保存:', outputPath);
  return buffer;
}

function generateContent() {
  return `
<style>
  .region-item { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }
  .region-item h4 { color: #8B4513; margin: 0 0 8px 0; font-size: 16px; }
  h3 { color: #8B4513; border-bottom: 2px solid #DAA520; padding-bottom: 8px; margin-top: 25px; }
</style>

<h2 style="text-align: center; color: #8B4513;">🍷 ${date.chinese} 雪莉酒完全指南：西班牙国酒·赫雷斯</h2>
<p style="text-align: center; color: #666;">西班牙国酒 · 赫雷斯 · 强化葡萄酒</p>

<section style="background:linear-gradient(135deg,#2c1810,#1a1a2e);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#FFE4C4;font-size:16px;line-height:1.9">雪莉酒是<strong style="color:#DAA520">西班牙最古老的加强型葡萄酒</strong>，拥有超过3000年的酿酒历史。在赫雷斯（Jerez）的阳光下，葡萄酒在橡木桶中层层叠放，形成独特的"酒花"（Flor）表面酵母，创造出世界独一无二的风味。本文将带你深入了解<strong style="color:#DAA520">西班牙国酒的秘密</strong>。</p>
</section>

<h3>🍇 一、雪莉酒五大类型</h3>
<section style="background:#fffaf0;padding:18px;border-radius:8px">

<div class="region-item">
🥂 <h4>菲诺（Fino）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 特点：</strong>最干型，浅金色，Flor酵母覆盖<br/>
<strong>• 风味：</strong>杏仁、酵母、碘、咸味<br/>
<strong>• 酒精度：</strong>15-17%<br/>
<strong>• 饮用：</strong>冰镇后饮用，开瓶后可保存数周<br/>
<strong>• 代表：</strong>Tio Pepe、La Goya</p>
</div>

<div class="region-item">
🥂 <h4>曼萨尼亚（Manzanilla）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 特点：</strong>菲诺的变种，仅产于圣玛丽亚港<br/>
<strong>•</strong> 风味：</strong>更清淡，酵母味，咸鲜<br/>
<strong>•</strong> 酒精度：</strong>15-17%<br/>
<strong>•</strong> 饮用：</strong>最佳作为开胃酒<br/>
<strong>• 代表：</strong>San Leon、La Bota</p>
</div>

<div class="region-item">
🥂 <h4>阿蒙提亚多（Amontillado）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 特点：</strong>菲诺陈年后失去Flor，变成氧化风格<br/>
<strong>•</strong> 风味：</strong>坚果、烘烤、皮革、复杂<br/>
<strong>•</strong> 酒精度：</strong>16-18%<br/>
<strong>•</strong> 饮用：</strong>可作为开胃酒或配餐<br/>
<strong>• 代表：</strong>El Maestro Sierra、Colosía</p>
</div>

<div class="region-item">
🥂 <h4>奥罗露索（Oloroso）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 特点：</strong>全程氧化陈酿，无Flor，深度氧化<br/>
<strong>•</strong> 风味：</strong>核桃、巧克力、咖啡、皮革<br/>
<strong>•</strong> 酒精度：</strong>18-20%<br/>
<strong>•</strong> 饮用：</strong>餐后酒，搭配坚果<br/>
<strong>• 代表：</strong>Don Quixote、Almacenista</p>
</div>

<div class="region-item">
🥂 <h4>佩德罗·希姆内斯（Pedro Ximénez / PX）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 特点：</strong>极甜型，用晒干的PX葡萄酿造<br/>
<strong>•</strong> 风味：</strong>葡萄干、蜜饯、黑糖、浓郁<br/>
<strong>•</strong> 酒精度：</strong>15-17%<br/>
<strong>•</strong> 饮用：</strong>餐后酒，配甜点或冰淇淋<br/>
<strong>• 代表：</strong>Lustau PX、Alvear PX</p>
</div>

</section>

<h3>🗺 二、赫雷斯三重镇</h3>
<section style="background:#f5f5dc;padding:18px;border-radius:8px">

<div class="region-item">
🏛 <h4>赫雷斯-德拉弗龙特拉（Jerez de la Frontera）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>雪莉酒的核心产区，最大城市<br/>
<strong>•</strong> 特点：</strong>所有类型的雪莉酒都产于此<br/>
<strong>•</strong> 代表酒庄：</strong>Tio Pepe、Gonzalez Byass、Bodegas Fundador</p>
</div>

<div class="region-item">
🏛 <h4>圣玛丽亚港（Sanlúcar de Barrameda）</h4>
p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>曼萨尼亚的唯一产地<br/>
<strong>•</strong> 特点：</strong>靠近大西洋，气候更潮湿<br/>
<strong>•</strong> 代表酒庄：</strong>Bodegas Hidalgo、Barbadillo</p>
</div>

<div class="region-item">
🏛 <h4>圣费尔南多（El Puerto de Santa María）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>历史悠久的雪莉酒产区<br/>
<strong>•</strong> 特点：</strong>菲诺和曼萨尼亚的主要产地<br/>
<strong>•</strong> 代表酒庄：</strong>Juan Pedro Domecq、Lustau</p>
</div>

</section>

<h3>🔬 三、雪莉酒酿造工艺</h3>
<section style="background:#E6E6FA;padding:18px;border-radius:8px">

<div class="region-item">
🔬 <h4>Solera 系统</h4>
p style="color:#333;line-height:1.8;margin:0"><strong>• 原理：</strong>多层橡木桶叠放，逐年从最底层取酒<br/>
<strong>•</strong> 特点：</strong>保持风格一致性，老年份基酒永不枯竭<br/>
<strong>•</strong> 比喻：</strong>"像切开的蛋糕，从底部取用"</p>
</div>

<div class="region-item">
🔬 <h4>Flor 酵母层</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 原理：</strong>漂浮在酒表面的白色酵母菌<br/>
<strong>•</strong> 作用：</strong>隔绝氧气，赋予菲诺独特风味<br/>
<strong>•</strong> 条件：</strong>需要特定温度和湿度</p>
</div>

<div class="region-item">
🔬 <h4>加强（Fortification）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 原理：</strong>添加白兰地提升酒精度<br/>
<strong>•</strong> 目的：</strong>终止发酵，保留糖分或促进氧化<br/>
<strong>•</strong> 方式：</strong>发酵前或发酵中添加</p>
</div>

</section>

<h3>💰 四、雪莉酒价格全解析</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰 80-200 元（入门）</strong><br/>
<span style="color:#666">• 入门级菲诺（Taberner）</span><br/>
<span style="color:#666">• 基础曼萨尼亚</span><br/>
<span style="color:#666">• 特点：新鲜易饮，适合日常</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰💰 200-500 元（进阶）</strong><br/>
<span style="color:#666">• 优质菲诺（Tio Pepe）</span><br/>
<span style="color:#666">• 阿蒙提亚多入门</span><br/>
<strong style="color:#c62828">• 特点：开始展现复杂风味</strong></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰💰💰 500-1200 元（高级）</strong><br/>
<span style="color:#666">• 名庄珍藏级（El Maestro Sierra）</span><br/>
<span style="color:#666">• 奥罗露索老酒</span><br/>
<strong style="color:#c62828">• 特点：复杂深邃，可收藏</strong></p>

<p style="color:#333;line-height:1.8"><strong>💎💎💎 1200元以上（高端）</strong><br/>
<span style="color:#px">• PX珍藏（Lustau PX）</span><br/>
<span style="color:#px">• 老年份雪莉</span><br/>
<strong style="color:#c62828">• 特点：稀缺，收藏级</strong></p>
</section>

<h3>📅 五、经典酒庄推荐</h3>
section style="background:#faf8f5;padding:18px;border-radius:8px">
<table style="width:100%;border-collapse:collapse">
<tr style="background:#8B4513;color:white">
<td style="padding:10px;font-weight:bold">酒庄</td>
<td style="padding:10px;font-weight:bold">特色</td>
<td style="padding:10px;font-weight:bold">代表酒款</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>Gonzalez Byass</strong></td>
<td style="padding:10px;color:#666">最大的雪莉酒商之一</td>
<td style="padding:10px;color:#666">Tio Pepe Fino</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>Lustau</strong></td>
<td style="padding:10px;color:#666">高质量，Almacenista系列</td>
<td <td style="padding:10px;color="#666">Lustau PX</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>El Maestro Sierra</strong></td>
<td style="padding:10px;color:#666">传统派，精品老年份</td>
<td <td style="padding:10px;color="#666">Amontillado 12A</td>
</tr>
<tr>
<td style="padding:10px;color:#333"><strong>Bodegas Barbadillo</strong></td>
<td style="padding:10px;color:#666">曼萨尼亚专家</td>
<td <td style="padding:10px;color:#666">Manzanilla</td>
</tr>
</table>
</section>

<h3>🍽 六、雪莉酒配餐指南</h3>
section style="background:#e8f5e9;padding:18px;border-radius:8px">

<div class="region-item">
🥜 <h4>菲诺/曼萨尼亚 - 开胃酒</h4>
p style="color:#333;line-height:1.8;margin:0"><strong>• 经典搭配：</strong>橄榄、杏仁、火腿<br/>
<strong>•</strong> 海鲜：</strong>生蚝、虾、蟹<br/>
<strong>•</strong> 特点：</strong>作为开胃酒最佳</p>
</div>

<div class="region-item">
🧀 <h4>阿蒙提亚多 - 配餐</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 奶酪：</strong>曼彻格、山羊奶酪<br/>
<strong>•</strong> 肉类：</strong>烤鸡、火腿<br/>
<strong>•</strong> 特点：</strong>可替代红酒配餐</p>
</div>

<div class="region-item">
🍖 <h4>奥罗露索 - 餐后</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 搭配：</strong>烤肉、炖肉<br/>
<strong>•</strong> 坚果：</strong>核桃、杏仁<br/>
<strong>•</strong> 特点：</strong>作为餐后酒</p>
</div>

<div class="region-item">
🍰 <h4>PX - 甜点</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 甜点：</strong>巧克力、焦糖布丁<br/>
<strong>•</strong> 冰淇淋：</strong>香草、奶油<br/>
<strong>•</strong> 特点：</strong>极甜配极甜</p>
</div>

</section>

<h3>💡 七、常见误区</h3>
<section style="background:#ffebee;padding:18px;border-radius:8px">
<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区1：雪莉酒都是甜的</strong><br/>
<span style="color:#666">事实上，菲诺和曼萨尼亚是干型。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区2：雪莉酒只能做甜点</strong><br/>
<span style="color:#666">菲诺是非常好的开胃酒。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区3：雪莉酒容易坏</strong><br/>
<strong style="color:#666">菲诺开瓶后仍可保存数周（Flor保护）。</strong></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区4：雪莉酒是奶奶喝的酒</strong><br/>
<span style="color:#666">现在，越来越多的年轻消费者开始欣赏雪莉。</span></p>

<p style="color:#c62828;line-height:1.8"><strong>误区5：雪莉酒不如波特酒</strong><br/>
<span style="color:#666">两者风格不同，雪莉酒同样可以很高档。</span></p>
</section>

<h3>📝 八、雪莉酒 vs 波特酒</h3>
<section style="background:#E3F2FD;padding:18px;border-radius:8px;border-left:3px solid #1565C0">
<p style="color:#0d47a1;margin:0">
<strong>🍷 对比：</strong><br/>
<span style="color:#666">• 产地：雪莉酒来自西班牙，波特酒来自葡萄牙</span><br/>
<span style="color:#666">• 品种：雪莉用帕洛米诺，波特用国产多瑞加</span><br/>
<span style="color:#666">• 风格：雪莉从干到甜都有，波特多为甜型</span><br/>
<span style="color:#666">• 陈酿：雪莉用Solera系统，波特用木桶</span><br/><br/>
<strong>🥂 选择：</strong><br/>
<span style="color:#666">• 喜欢干型？选菲诺/曼萨尼亚</span><br/>
<span style="color:#666">• 喜欢甜型？选PX/波特</span><br/>
<span style="color:#666">• 配餐？雪莉更百搭</span>
</p>
</section>

<section style="background:linear-gradient(135deg,#2c1810,#1a1a2e);padding:22px;border-radius:10px;text-align:center">
<p style="color:#DAA520;font-size:14px;font-weight:bold;margin-bottom:8px">🍷 结语</p>
<p style="color:#FFE4C4;font-size:14px;line-height:1.8;margin:0">雪莉酒是西班牙最古老的葡萄酒之一，拥有独特的"酒花"（Flor）酿造工艺和Solera分层系统。从清爽的菲诺到浓郁的PX，从作为开胃酒到餐后甜点，雪莉酒的多样性使其成为葡萄酒世界里不可替代的存在。如果你还没有尝试过雪莉酒，不妨从一杯菲诺开始，体验这份来自安达卢西亚的千年传承。</p>
<p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display}<br/>关注我们，每天学习红酒知识</p>
</section>`;
}

async function main() {
  console.log('='.repeat(60));
  console.log('🍷 生成雪莉酒完全指南文章');
  console.log('日期:', date.display);
  console.log('='.repeat(60));
  console.log('');

  const coverBuffer = await generateCoverWithAI();
  console.log('');

  console.log('📝 生成文章内容...');
  const content = generateContent();
  const article = {
    title: `🍷 ${date.chinese} 雪莉酒完全指南：西班牙国酒·赫雷斯`,
    author: '红酒顾问',
    digest: '雪莉酒是西班牙最古老的加强型葡萄酒。本文详解五大类型、Solera系统、核心产区和配餐指南。',
    content: content
  };
  console.log('   标题:', article.title);
  console.log('   摘要:', article.digest);
  console.log('');

  const outputPath = path.join(__dirname, 'output', `sherry_wine_${date.full.replace(/-/g, '')}.json`);
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
    const coverPath = path.join(__dirname, 'output', 'sherry_wine_cover_ai.png');
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
    console.log('💡 提示: 封面已生成为 output/sherry_wine_cover_ai.png');
    console.log('💡 文章已保存为:', outputPath);
  }
}

main();