/**
 * 加拿大冰酒文章生成器
 * 使用 baoyu-imagine + DashScope 生成写实封面，发布到微信公众号草稿箱
 */

process.env.HTTP_PROXY = '';
process.env.HTTPS_PROXY = '';

require('dotenv').config();

const axios = require('axios');
axios.defaults.proxy = false;
const fetch = require('node-fetch');
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

/**
 * 使用 baoyu-imagine + DashScope 生成写实加拿大封面
 */
async function generateCoverWithAI() {
  console.log('🎨 使用 baoyu-imagine + DashScope 生成写实加拿大冰酒封面...');  
  const coverPath = path.join(__dirname, 'output', 'canada_icewine_cover_real.png');
  const prompt = 'Photorealistic frozen Canadian vineyard in winter, ice crystals on grapes, Niagara Falls in background, bottle of ice wine with golden liquid, professional photography, cold blue atmosphere, 8K ultra-detailed';
  
  try {
    const scriptPath = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
    const cmd = `npx -y bun "${scriptPath}" --prompt "${prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`;
    
    console.log('   调用 baoyu-imagine...');
    const { stdout, stderr } = await execPromise(cmd, { timeout: 180000 });
    
    if (stdout.includes('cover.png') || stdout.includes('canada_icewine_cover_real.png') || fs.existsSync(coverPath)) {
      console.log('   ✅ AI图片生成成功');
      
      // 裁剪为微信封面尺寸 900x383
      const resizedBuffer = await sharp(coverPath)
        .resize(900, 383, { fit: 'cover', position: 'center' })
        .png()
        .toBuffer();
      
      // 添加文字叠加
      const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#00BFFF"/>
            <stop offset="100%" style="stop-color:#87CEEB"/>
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.7"/>
          </filter>
        </defs>
        
        <!-- 底部半透明遮罩 -->
        <rect x="0" y="230" width="900" height="153" fill="rgba(0,0,0,0.7)"/>
        
        <!-- 主标题 -->
        <text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">❄️ 加拿大冰酒入门</text>
        
        <!-- 副标题 -->
        <text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">尼亚加拉 · VQA · 冰葡萄</text>
        
        <!-- 日期 -->
        <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#00BFFF" text-anchor="end">${date.display}</text>
      </svg>`;
      
      const textBuffer = Buffer.from(svg);
      const finalBuffer = await sharp(resizedBuffer)
        .composite([{ input: textBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer();
      
      // 保存文件
      const outputPath = path.join(__dirname, 'output', 'canada_icewine_cover_ai.png');
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

/**
 * 本地备用封面
 */
function generateLocalCover() {
  console.log('   使用本地备用封面');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="383" viewBox="0 0 900 383">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#0a192f"/>
      <stop offset="100%" style="stop-color:#1a365d"/>
    </linearGradient>
    <linearGradient id="iceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#00BFFF"/>
      <stop offset="100%" style="stop-color:#87CEEB"/>
    </linearGradient>
  </defs>
  <rect width="900" height="383" fill="url(#g)"/>
  
  <!-- 冰晶图案 -->
  <g fill="rgba(135,206,235,0.15)">
    <circle cx="150" cy="100" r="40"/>
    <circle cx="750" cy="300" r="50"/>
    <circle cx="450" cy="50" r="30"/>
  </g>
  
  <!-- 冰酒瓶 -->
  <g transform="translate(350, 80)">
    <path d="M25,180 L45,60 L75,60 L95,180 Z" fill="url(#iceGrad)" opacity="0.9"/>
    <rect x="55" y="45" width="10" height="15" fill="#0a192f"/>
    <ellipse cx="60" cy="180" rx="35" ry="8" fill="#1a365d"/>
    <!-- 冰晶装饰 -->
    <line x1="60" y1="100" x2="60" y2="140" stroke="white" stroke-width="2" opacity="0.6"/>
    <line x1="40" y1="120" x2="80" y2="120" stroke="white" stroke-width="2" opacity="0.6"/>
    <line x1="45" y1="105" x2="75" y2="135" stroke="white" stroke-width="2" opacity="0.6"/>
    <line x1="45" y1="135" x2="75" y2="105" stroke="white" stroke-width="2" opacity="0.6"/>
  </g>
  
  <!-- 葡萄串（结冰效果） -->
  <g transform="translate(600, 200)" opacity="0.8">
    <circle cx="0" cy="0" r="8" fill="#4a90e2" stroke="white" stroke-width="1"/>
    <circle cx="18" cy="5" r="7" fill="#5ba0f2" stroke="white" stroke-width="1"/>
    <circle cx="35" cy="-3" r="9" fill="#4a90e2" stroke="white" stroke-width="1"/>
    <circle cx="52" cy="8" r="7" fill="#5ba0f2" stroke="white" stroke-width="1"/>
    <circle cx="68" cy="2" r="8" fill="#4a90e2" stroke="white" stroke-width="1"/>
  </g>
  
  <!-- 标题框 -->
  <g transform="translate(520, 60)">
    <rect x="0" y="0" width="320" height="130" rx="8" fill="#00BFFF" opacity="0.95"/>
    <rect x="0" y="0" width="320" height="130" rx="8" fill="none" stroke="#87CEEB" stroke-width="3"/>
    <text x="160" y="50" font-family="Microsoft YaHei, sans-serif" font-size="36" font-weight="bold" fill="white" text-anchor="middle">❄️ 加拿大</text>
    <text x="160" y="95" font-family="Microsoft YaHei, sans-serif" font-size="22" fill="white" text-anchor="middle">冰酒</text>
    <line x1="40" y1="110" x2="280" y2="110" stroke="white" stroke-width="2" opacity="0.5"/>
  </g>
  
  <!-- 底部信息 -->
  <rect x="0" y="323" width="900" height="60" fill="#0a0a0a" opacity="0.95"/>
  <g transform="translate(30, 345)">
    <text x="0" y="0" font-family="Microsoft YaHei, sans-serif" font-size="26" font-weight="bold" fill="#00BFFF">❄️ ${date.display} 加拿大冰酒入门</text>
    <text x="0" y="30" font-family="Microsoft YaHei, sans-serif" font-size="15" fill="rgba(255,255,255,0.85)">尼亚加拉 · VQA · 冰葡萄</text>
  </g>
</svg>`;
  const buffer = sharp(Buffer.from(svg)).png().toBuffer();
  const outputPath = path.join(__dirname, 'output', 'canada_icewine_cover_ai.png');
  fs.writeFileSync(outputPath, buffer);
  console.log('📁 SVG 封面已保存:', outputPath);
  return buffer;
}

/**
 * 生成加拿大冰酒文章内容
 */
function generateContent() {
  return `
<style>
  .box { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #1a365d; }
  .region-item { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }
  .region-item h4 { color: #1a365d; margin: 0 0 8px 0; font-size: 16px; }
  h3 { color: #1a365d; border-bottom: 2px solid #1a365d; padding-bottom: 8px; margin-top: 25px; }
</style>

<h2 style="text-align: center; color: #1a365d;">❄️ ${date.chinese} 加拿大冰酒入门</h2>
<p style="text-align: center; color: #666;">尼亚加拉 · VQA · 冰葡萄</p>

<section style="background:linear-gradient(135deg,#0a192f,#1a365d);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#e3f2fd;font-size:16px;line-height:1.9">加拿大冰酒是<strong style="color:#00BFFF">全球最著名的冰酒产区</strong>，以<strong style="color:#00BFFF">VQA（酒商质量联盟）</strong>严格标准著称。在-8°C的严寒中采摘的冰葡萄，酿造出世界上最甜美的液体黄金。</p>
</section>

<h3>🗺 一、加拿大冰酒产区</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:12px"><strong>🏠 两大核心产区：</strong></p>

<div class="region-item">
<h4>🏠 尼亚加拉半岛（Niagara Peninsula）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 位置：</strong>安大略省，紧邻尼亚加拉大瀑布<br/>
<strong>• 气候：</strong>五大湖调节，冬季严寒<br/>
<strong>• 地位：</strong>加拿大最大冰酒产区（占90%）<br/>
<strong>• 等级：</strong>VQA认证产区</p>
</div>

<div class="region-item">
<h4>🏠 欧肯纳根谷（Okanagan Valley）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 位置：</strong>不列颠哥伦比亚省（BC省）<br/>
<strong>• 气候：</strong>内陆干燥，昼夜温差大<br/>
<strong>• 特点：</strong>果味更浓郁，酸度漂亮<br/>
<strong>• 等级：</strong>BC VQA认证</p>
</div>

</section>

<h3>🍇 二、冰酒酿造工艺</h3>
<section style="background:#e3f2fd;padding:18px;border-radius:8px">

<div class="region-item">
<h4>❄️ 什么是冰酒？</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 定义：</strong>葡萄在-8°C以下自然冰冻后采摘压榨<br/>
<strong>• 历史：</strong>德国起源（1794年），加拿大发扬光大<br/>
<strong>• 核心：</strong>水分结冰，糖分和风味浓缩<br/>
<strong>• 产量：</strong>极低（约正常葡萄酒的1/5）</p>
</div>

<div class="region-item">
<h4>🍷 酿造流程</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>1. 葡萄种植：</strong>选择抗寒品种（Vidal、Riesling）<br/>
<strong>2. 自然冰冻：</strong>留在藤上直到-8°C以下<br/>
<strong>3. 夜间采摘：</strong>寒冬深夜人工采摘<br/>
<strong>4. 压榨：</strong>冰冻葡萄压榨，浓缩果汁<br/>
<strong>5. 发酵：</strong>低温缓慢发酵数月</p>
</div>

</section>

<h3>🍷 三、主要葡萄品种</h3>
<section style="background:#fff3e0;padding:18px;border-radius:8px">

<div class="region-item">
<h4>🟡 Vidal Blanc（威代尔）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>加拿大冰酒之王，最常用品种<br/>
<strong>• 特点：</strong>高酸度、柑橘、热带水果、蜂蜜<br/>
<strong>• 风格：</strong>酸甜平衡，陈年潜力10年+<br/>
<strong>• 价格：</strong>约200-800元/375ml</p>
</div>

<div class="region-item">
<h4>🟡 Riesling（雷司令）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>传统品种，德国进口<br/>
<strong>• 特点：</strong>矿物感、青苹果、柠檬<br/>
<strong>• 风格：</strong>酸度更高，更清爽<br/>
<strong>• 价格：</strong>约300-1200元/375ml</p>
</div>

<div class="region-item">
<h4>🔴 Cabernet Franc（品丽珠）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>红葡萄冰酒代表<br/>
<strong>• 特点：</strong>草莓、覆盆子、香料、玫瑰<br/>
<strong>• 风格：</strong>玫瑰色，香气复杂<br/>
<strong>• 价格：</strong>约400-1500元/375ml</p>
</div>

</section>

<h3>👑 四、传奇酒庄推荐</h3>
<section style="background:#fce4ec;padding:18px;border-radius:8px">

<div class="region-item">
<h4>🔴 Inniskillin（云岭酒庄）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>加拿大最著名的冰酒品牌<br/>
<strong>• 价格：</strong>约200-800元/375ml<br/>
<strong>• 特点：</strong>品质稳定，国际获奖无数<br/>
<strong>• 代表作：</strong>Vidal Icewine、Riesling Icewine</p>
</div>

<div class="region-item">
<h4>🔴 Peller Estates（贝勒酒庄）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>尼亚加拉顶级酒庄<br/>
<strong>• 价格：</strong>约300-1500元/375ml<br/>
<strong>• 特点：</strong>有机种植，单一葡萄园<br/>
<strong>• 代表作：</strong>Andrew Peller Reserve</p>
</div>

<div class="region-item">
<h4>🔴 Jackson-Triggs（杰克逊瑞格斯）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>加拿大获奖最多的酒庄<br/>
<strong>• 价格：</strong>约200-600元/375ml<br/>
<strong>• 特点：</strong>高性价比，入门首选<br/>
<strong>• 代表作：</strong>Vidal Icewine、Riesling Icewine</p>
</div>

<div class="region-item">
<h4>🔴 Mission Hill（米申山）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>• 地位：</strong>BC省顶级酒庄<br/>
<strong>• 价格：</strong>约300-1000元/375ml<br/>
<strong>• 特点：</strong>现代风格，果味纯净<br/>
<strong>• 代表作：</strong>Reserve Icewine</p>
</div>

</section>

<h3>💎 五、VQA认证体系</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">
<p style="color:#2e7d32;font-weight:bold;margin-bottom:15px">🏅 什么是VQA？</p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>• 全称：</strong>Vintners Quality Alliance（酒商质量联盟）<br/>
<strong>• 地位：</strong>加拿大葡萄酒最高质量标准<br/>
<strong>• 要求：</strong>100%加拿大葡萄，严格产区限定<br/>
<strong>• 冰酒标准：</strong>必须在-8°C以下采摘，天然冰冻</p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>• 标签识别：</strong>瓶身必须有 "VQA" 标志<br/>
<strong>• 法律保护：</strong>非VQA产品不得标注"Icewine"<br/>
<strong>• 产区标注：</strong>Niagara Peninsula VQA、Okanagan Valley VQA</p>

<p style="color:#c62828;line-height:1.8"><strong>⚠️ 注意：</strong>"Ice wine"（两个词）可能是人工冷冻葡萄酿造，不是真正的冰酒！</p>
</section>

<h3>💰 六、价格与性价比</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰 200-400 元/375ml（入门）</strong><br/>
<span style="color:#666">• Jackson-Triggs Vidal：性价比之王</span><br/>
<span style="color:#666">• Inniskillin Vidal：品质稳定</span><br/>
<span style="color:#666">• 特点：开瓶即饮，无需陈年</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰💰 400-800 元/375ml（进阶）</strong><br/>
<span style="color:#666">• Peller Estates Reserve</span><br/>
<span style="color:#666">• Inniskillin Riesling</span><br/>
<span style="color:#666">• 特点：可陈年5-10年</span></p>

<p style="color:#333;line-height:1.8"><strong>💎💎💎 800元以上/375ml（顶级）</strong><br/>
<span style="color:#666">• Inniskillin Gold Vidal（金奖）</span><br/>
<span style="color:#666">• Peller Andrew Peller Reserve</span><br/>
<strong style="color:#c62828">• 特点：稀缺，拍卖级，陈年20年+</strong></p>
</section>

<h3>🍷 七、冰酒 vs 贵腐酒</h3>
<section style="background:#e3f2fd;padding:18px;border-radius:8px">
<table style="width:100%;border-collapse:collapse">
<tr style="background:#1a365d;color:white">
<td style="padding:10px;font-weight:bold">对比项</td>
<td style="padding:10px;font-weight:bold">加拿大冰酒</td>
<td style="padding:10px;font-weight:bold">法国贵腐（Sauternes）</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>冰冻方式</strong></td>
<td style="padding:10px;color:#666">自然冰冻（-8°C）</td>
<td style="padding:10px;color:#666">贵腐菌侵染</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>主要品种</strong></td>
<td style="padding:10px;color:#666">Vidal、Riesling</td>
<td style="padding:10px;color:#666">Semillon、Sauvignon Blanc</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>风味特点</strong></td>
<td style="padding:10px;color:#666">热带水果、蜂蜜、柑橘</td>
<td style="padding:10px;color:#666">杏干、蜂蜜、坚果</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>酸度</strong></td>
<td style="padding:10px;color:#666">高（清爽型）</td>
<td style="padding:10px;color:#666">中高（圆润型）</td>
</tr>
<tr>
<td style="padding:10px;color:#333"><strong>价格</strong></td>
<td style="padding:10px;color:#666">200-1500元/375ml</td>
<td style="padding:10px;color:#666">300-5000元/500ml</td>
</tr>
</table>
</section>

<h3>💡 八、常见误区</h3>
<section style="background:#ffebee;padding:18px;border-radius:8px">
<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区1：冰酒都来自德国</strong><br/>
<span style="color:#666">加拿大现在是冰酒的最大生产国，品质和产量都超过德国。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区2：冰酒越甜越好</strong><br/>
<span style="color:#666">好的冰酒必须酸度平衡，只甜不酸是劣质产品。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区3：冰酒只能配甜点</strong><br/>
<span style="color:#666">配鹅肝、蓝纹奶酪、辛辣菜肴同样精彩。</span></p>

<p style="color:#c62828;line-height:1.8"><strong>误区4："Ice wine"就是冰酒</strong><br/>
<span style="color:#666">必须是"Icewine"（一个词）且标有VQA才是真冰酒。</span></p>
</section>

<h3>🍸 九、饮用与保存建议</h3>
<section style="background:#e8f5e9;padding:18px;border-radius:8px;border-left:3px solid #2e7d32">
<p style="color:#1b5e20;margin:0">
<strong>🥂 饮用温度：</strong><br/>
<span style="color:#666">• 最佳温度：6-8℃（充分冰镇）</span><br/>
<span style="color:#666">• 切忌：室温饮用会过于甜腻</span><br/><br/>
<strong>🍷 酒杯选择：</strong><br/>
<span style="color:#666">• 小型甜酒杯（约150ml）</span><br/>
<span style="color:#666">• 杯型：郁金香杯或ISO标准杯</span><br/><br/>
<strong>🍽️ 配餐建议：</strong><br/>
<span style="color:#666">• 经典搭配：鹅肝、蓝纹奶酪、焦糖布丁</span><br/>
<span style="color:#666">• 创意搭配：泰式辣味、印度咖喱</span><br/>
<span style="color:#666">• 餐后酒：作为甜点酒单独享用</span><br/><br/>
<strong>📦 保存：</strong><br/>
<span style="color:#666">• 开瓶后：冰箱可保存1-2周（冷藏）</span><br/>
<span style="color:#666">• 未开瓶：避光保存，可陈年5-20年</span><br/>
<span style="color:#666">• 注意：直立存放，无需水平放置</span><br/><br/>
<strong>⚠️ 风险提示：</strong><br/>
<span style="color:#666">• 市场上有大量假冒冰酒（人工冷冻）</span><br/>
<span style="color:#666">• 认准VQA标志和"Icewine"一个词</span><br/>
<span style="color:#666">• 太低价格（<150元/375ml）需警惕</span>
</p>
</section>

<section style="background:linear-gradient(135deg,#0a192f,#1a365d);padding:22px;border-radius:10px;text-align:center">
<p style="color:#00BFFF;font-size:14px;font-weight:bold;margin-bottom:8px">❄️ 结语</p>
<p style="color:#e3f2fd;font-size:14px;line-height:1.8;margin:0">加拿大冰酒是冬季的馈赠，每一滴都凝聚着严寒中的坚持。从200元的入门款到数千元的收藏级，这里总有一款适合你。记住：真正的冰酒必须标有VQA和"Icewine"——享受这份来自冰雪的甜蜜吧。</p>
<p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display}<br/>关注我们，每天学习红酒知识</p>
</section>`;
}

/**
 * 主函数：生成文章并发布到微信草稿箱
 */
async function main() {
  console.log('='.repeat(60));
  console.log('❄️ 生成加拿大冰酒入门文章');
  console.log('日期:', date.display);
  console.log('='.repeat(60));
  console.log('');

  // 1. 生成封面
  const coverBuffer = await generateCoverWithAI();
  console.log('');

  // 2. 生成文章内容
  console.log('📝 生成文章内容...');
  const content = generateContent();
  const article = {
    title: `❄️ ${date.chinese} 加拿大冰酒入门：尼亚加拉·VQA·冰葡萄`,
    author: '红酒顾问',
    digest: '加拿大冰酒是全球最著名的冰酒产区，以VQA严格标准著称。本文详解酿造工艺、主要品种、传奇酒庄和配餐建议。',
    content: content
  };
  console.log('   标题:', article.title);
  console.log('   摘要:', article.digest);
  console.log('');

  // 3. 保存到本地
  const outputPath = path.join(__dirname, 'output', `canada_icewine_${date.full.replace(/-/g, '')}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(article, null, 2));
  console.log('📁 文章已保存:', outputPath);
  console.log('');

  // 4. 发布到微信公众号草稿箱
  console.log('📤 发布到微信公众号草稿箱...');
  
  try {
    // 获取 Access Token
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

    // 上传封面图
    console.log('   步骤 2/3: 上传封面图...');
    const coverPath = path.join(__dirname, 'output', 'canada_icewine_cover_ai.png');
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

    // 创建草稿
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
    console.log('💡 提示: 封面已生成为 output/canada_icewine_cover_ai.png');
    console.log('💡 文章已保存为:', outputPath);
  }
}

main();
