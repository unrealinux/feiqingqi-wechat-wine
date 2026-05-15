/**
 * 勃艮第产区巡礼文章生成器 - 增强版
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

const today = new Date();
const date = {
  full: today.toISOString().slice(0, 10),
  display: `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`,
};

async function generateCover() {
  console.log('🎨 生成勃艮第写实封面...');
  const apiKey = process.env.ZIMAGE_API_KEY;

  try {
    const submitResponse = await fetch('https://api-inference.modelscope.cn/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-ModelScope-Async-Mode': 'true'
      },
      body: JSON.stringify({
        model: 'Tongyi-MAI/Z-Image-Turbo',
        prompt: 'Beautiful Burgundy vineyard landscape, golden autumn light, rolling hills with Pinot Noir grapevines, ancient French stone village, professional landscape photography, warm golden hour lighting, high detail',
        negative_prompt: 'cartoon, illustration, blurry, low quality, text, watermark',
        steps: 15,
        width: 1280,
        height: 720
      })
    });

    const submitData = await submitResponse.json();
    const taskId = submitData.task_id;
    console.log('   任务ID:', taskId);

    for (let i = 0; i < 30; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const statusResponse = await fetch(`https://api-inference.modelscope.cn/v1/tasks/${taskId}`, {
        headers: { 'Authorization': `Bearer ${apiKey}`, 'X-ModelScope-Task-Type': 'image_generation' }
      });
      const statusData = await statusResponse.json();

      if (statusData.task_status === 'SUCCEED') {
        const imageUrl = statusData.output_images?.[0];
        if (imageUrl) {
          console.log('   ✅ AI图片生成成功');
          const imageResponse = await fetch(imageUrl);
          const imageBuffer = await imageResponse.arrayBuffer();
          const rawImage = Buffer.from(imageBuffer);
          const croppedBuffer = await sharp(rawImage).resize(900, 383, { fit: 'cover', position: 'center' }).png().toBuffer();
          const svg = `<svg width="900" height="383"><defs><linearGradient id="tg" x1="0%" x2="100%"><stop offset="0%" style="stop-color:#D4AF37"/><stop offset="100%" style="stop-color:#F4E4BC"/></linearGradient></defs><rect x="0" y="0" width="900" height="383" fill="rgba(0,0,0,0.25)"/><rect x="0" y="240" width="900" height="143" fill="rgba(0,0,0,0.75)"/><text x="30" y="295" font-family="Microsoft YaHei" font-size="34" font-weight="bold" fill="url(#tg)">🍷 勃艮第产区深度巡礼</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="16" fill="rgba(255,255,255,0.9)">风土之魂 · 特级园 · 从入门到收藏</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text></svg>`;
          const textBuffer = Buffer.from(svg);
          return sharp(croppedBuffer).composite([{ input: textBuffer, top: 0, left: 0 }]).png().toBuffer();
        }
      }
      if (statusData.task_status === 'FAILED') break;
    }
  } catch (err) {
    console.warn('   ⚠️ AI封面生成失败');
  }

  console.log('   使用备用封面');
  const svg = `<svg width="900" height="383"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#2d1a0a"/><stop offset="50%" style="stop-color:#4a2d14"/><stop offset="100%" style="stop-color:#6b3a1a"/></linearGradient></defs><rect width="900" height="383" fill="url(#g)"/><rect x="0" y="240" width="900" height="143" fill="rgba(0,0,0,0.6)"/><text x="30" y="295" font-family="Microsoft YaHei" font-size="34" font-weight="bold" fill="#D4AF37">🍷 勃艮第产区深度巡礼</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="16" fill="rgba(255,255,255,0.9)">风土之魂 · 特级园 · 从入门到收藏</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function main() {
  console.log('='.repeat(60));
  console.log('🍷 生成勃艮第产区深度巡礼文章');
  console.log('日期:', date.display);
  console.log('='.repeat(60));
  console.log('');

  const coverBuffer = await generateCover();

  const article = {
    title: '🍷 勃艮第产区深度巡礼：从入门到收藏的完整指南',
    author: '红酒顾问',
    digest: '勃艮第是世界最昂贵葡萄酒的故乡，本文深度解析风土概念、33个特级园、顶级酒庄、入门推荐、投资指南。',
    content: `<section style="margin-bottom:20px"><p style="color:#999;text-align:center">${date.full} | 产区巡礼系列 | 红酒顾问</p></section>

<section style="background:linear-gradient(135deg,#2d1a0a,#4a2d14);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#f5e6d3;font-size:16px;line-height:1.9">勃艮第是世界最昂贵葡萄酒的故乡，<strong style="color:#d4af37">罗曼尼·康帝</strong>单瓶价格可达<strong style="color:#d4af37">数十万元</strong>。这里有全球最复杂的分级体系和最神秘的"风土"概念。本文将带你深入了解这个葡萄酒世界的殿堂。</p>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🌍 一、勃艮第在哪里</h2>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:12px">
勃艮第（Burgundy/Bourgogne）位于法国东部，从北部的第戎（Dijon）延伸到南部的里昂（Lyon），全长约200公里。这里是大陆性气候，冬季寒冷（可达-10°C），夏季温暖（约30°C），昼夜温差大，非常适合葡萄积累风味物质。
</p>
<p style="color:#333;line-height:1.8;margin-bottom:12px">
<strong>📍 地理位置：</strong>法国东部，巴黎东南约300公里<br/>
<strong>🌡️ 气候类型：</strong>大陆性气候<br/>
<strong>🍇 主要葡萄：</strong>黑皮诺（红酒）、霞多丽（白酒）<br/>
<strong>📏 产区面积：</strong>约28,000公顷<br/>
<strong>🍷 年产量：</strong>约1.8亿瓶
</p>
<p style="color:#666;font-size:14px;line-height:1.8">
💡 <strong>有趣事实：</strong>勃艮第的面积只有波尔多的1/4，但顶级酒的价格却是波尔多的数倍。这是因为勃艮第极度重视"风土"，同一村庄内不同地块的酒价可以相差10倍以上。
</p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🍇 二、葡萄品种详解</h2>
<section style="background:#faf8f5;padding:18px;border-radius:8px;margin-bottom:12px">
<p style="color:#8b2252;font-weight:bold;margin-bottom:12px">🔴 红葡萄品种</p>
<p style="color:#333;line-height:1.8;margin-bottom:12px">
<strong>1. 黑皮诺（Pinot Noir）- 占红酒99%</strong><br/>
<span style="color:#666">被誉为"酿酒师的噩梦"，因为它极其敏感，对土壤、气候、酿造工艺要求极高。但正因为如此，它能最完美地表达风土。典型风味：红樱桃、覆盆子、玫瑰、蘑菇、松露。</span>
</p>
</section>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#8b2252;font-weight:bold;margin-bottom:12px">⚪ 白葡萄品种</p>
<p style="color:#333;line-height:1.8;margin-bottom:12px">
<strong>1. 霞多丽（Chardonnay）- 占白酒99%</strong><br/>
<span style="color:#666">变色龙般的品种，风格从清爽（夏布利）到饱满（普利尼-蒙哈榭）。典型风味：柑橘、苹果、黄油、烤面包、矿物感。</span>
</p>
<p style="color:#333;line-height:1.8">
<strong>2. 阿里高特（Aligoté）- 约1%</strong><br/>
<span style="color:#666">酸度极高的白葡萄，常用于酿造基尔酒（Kir）。</span>
</p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🍇 三、风土：勃艮第的灵魂</h2>
<section style="background:linear-gradient(135deg,#fff9f0,#fff5e6);padding:20px;border-radius:8px;border-left:3px solid #d4af37">
<p style="color:#8b4513;font-size:18px;font-weight:bold;margin-bottom:15px">🏔️ 什么是风土（Terroir）？</p>
<p style="color:#333;line-height:1.8;margin-bottom:12px">
风土是勃艮第最核心的概念，指<strong>土壤、气候、地形、朝向、海拔、人文传统</strong>等因素的综合体。勃艮第人坚信，同一品种在不同地块会表现出完全不同的风味。
</p>
<p style="color:#333;line-height:1.8;margin-bottom:12px">
这就是为什么勃艮第的酒标上不写葡萄品种，而是写<strong>葡萄园名称</strong>。他们认为，风土比品种更重要。
</p>
<p style="color:#666;font-size:14px;line-height:1.8;background:#fff;padding:12px;border-radius:6px">
💡 <strong>经典案例：</strong>罗曼尼·康帝和拉塔希（La Tâche）都是黑皮诺，都来自沃恩-罗曼尼村，相距仅几百米，但因为土壤和朝向不同，风味完全不同——罗曼尼·康帝更优雅细腻，拉塔希更浓郁强劲。
</p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">📊 四、勃艮第分级体系详解</h2>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#8b2252;font-weight:bold;margin-bottom:12px">从低到高，四个等级：</p>
<table style="width:100%;border-collapse:collapse;margin-bottom:15px">
<tr style="border-bottom:2px solid #d4af37">
<td style="padding:10px;font-weight:bold;color:#2d1424">等级</td>
<td style="padding:10px;font-weight:bold;color:#2d1424">占比</td>
<td style="padding:10px;font-weight:bold;color:#2d1424">说明</td>
<td style="padding:10px;font-weight:bold;color:#2d1424">价格区间</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#333">地区级（Bourgogne）</td>
<td style="padding:10px;color:#666">50%</td>
<td style="padding:10px;color:#666">入门级，适合日常饮用</td>
<td style="padding:10px;color:#666">150-400元</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#333">村庄级（Village）</td>
<td style="padding:10px;color:#666">35%</td>
<td style="padding:10px;color:#666">来自特定村庄，品质更佳</td>
<td style="padding:10px;color:#666">300-800元</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#333">一级园（Premier Cru）</td>
<td style="padding:10px;color:#d4af37">10%</td>
<td style="padding:10px;color:#666">优质地块，标有"1er Cru"</td>
<td style="padding:10px;color:#666">500-3000元</td>
</tr>
<tr>
<td style="padding:10px;color:#c41e3a;font-weight:bold">特级园（Grand Cru）</td>
<td style="padding:10px;color:#c41e3a;font-weight:bold">2%</td>
<td style="padding:10px;color:#666;font-weight:bold">33个顶级地块</td>
<td style="padding:10px;color:#c41e3a;font-weight:bold">3000-200000元</td>
</tr>
</table>
<p style="color:#666;font-size:14px;line-height:1.8">
💡 <strong>33个特级园分布：</strong>夜丘24个（主要是红酒），伯恩丘8个（主要是白酒），夏布利1个（白酒）。
</p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🗺️ 五、主要子产区详解</h2>
<section style="background:#e8f5e9;padding:18px;border-radius:8px;margin-bottom:12px">
<p style="color:#2e7d32;font-weight:bold;margin-bottom:12px">🔴 夜丘（Côte de Nuits）- 黑皮诺圣地</p>
<p style="color:#333;line-height:1.8;margin-bottom:12px">
<strong>特点：</strong>以红酒为主，拥有最多特级园<br/>
<strong>代表村庄：</strong><br/>
• 沃恩-罗曼尼（Vosne-Romanée）- DRC所在地<br/>
• 香波-慕西尼（Chambolle-Musigny）- 优雅细腻<br/>
• 热夫雷-香贝丹（Gevrey-Chambertin）- 强劲有力<br/>
<strong>代表酒款：</strong>罗曼尼·康帝、拉塔希、香贝丹
</p>
</section>
<section style="background:#e8f5e9;padding:18px;border-radius:8px;margin-bottom:12px">
<p style="color:#2e7d32;font-weight:bold;margin-bottom:12px">🔴 伯恩丘（Côte de Beaune）- 白酒圣地</p>
<p style="color:#333;line-height:1.8;margin-bottom:12px">
<strong>特点：</strong>红酒白酒兼有，拥有世界最贵的白葡萄酒<br/>
<strong>代表村庄：</strong><br/>
• 普利尼-蒙哈榭（Puligny-Montrachet）- 白酒圣地<br/>
• 默尔索（Meursault）- 饱满丰腴<br/>
• 博纳（Beaune）- 红酒为主<br/>
<strong>代表酒款：</strong>蒙哈榭、骑士-蒙哈榭、巴塔-蒙哈榭
</p>
</section>
<section style="background:#e8f5e9;padding:18px;border-radius:8px">
<p style="color:#2e7d32;font-weight:bold;margin-bottom:12px">🟡 夏布利（Chablis）- 清爽白酒</p>
<p style="color:#333;line-height:1.8">
<strong>特点：</strong>100%霞多丽，以矿物感和清爽酸度著称<br/>
<strong>土壤：</strong>启莫里阶石灰岩（Kimmeridgian）<br/>
<strong>分级：</strong>小夏布利、夏布利、一级园、特级园<br/>
<strong>代表酒款：</strong>夏布利特级园（Grand Cru de Chablis）
</p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">👑 六、顶级酒庄详解</h2>
<section style="background:#fff9f0;padding:18px;border-radius:8px;margin-bottom:12px;border-left:3px solid #d4af37">
<p style="color:#8b4513;font-weight:bold;margin-bottom:12px">🍷 罗曼尼·康帝酒庄（DRC）</p>
<p style="color:#333;line-height:1.8;margin-bottom:12px">
<strong>地位：</strong>勃艮第之王，全球最昂贵的酒庄<br/>
<strong>历史：</strong>1232年建立，1942年被勒桦家族收购<br/>
<strong>代表酒款：</strong><br/>
• 罗曼尼·康帝（Romanée-Conti）- 单瓶10-200万元<br/>
• 拉塔希（La Tâche）- 单瓶5-50万元<br/>
• 李其堡（Richebourg）- 单瓶3-30万元<br/>
<strong>年产量：</strong>约450箱（全部酒款）<br/>
<strong>特点：</strong>生物动力法种植，手工采摘，天然酵母发酵
</p>
</section>
<section style="background:#fff9f0;padding:18px;border-radius:8px;margin-bottom:12px;border-left:3px solid #d4af37">
<p style="color:#8b4513;font-weight:bold;margin-bottom:12px">🍷 勒桦酒庄（Domaine Leroy）</p>
<p style="color:#333;line-height:1.8;margin-bottom:12px">
<strong>庄主：</strong>拉鲁·比兹-勒桦（Lalou Bize-Leroy）<br/>
<strong>地位：</strong>勃艮第传奇女性酿酒师，DRC前合伙人<br/>
<strong>代表酒款：</strong><br/>
• Musigny - 单瓶8-80万元<br/>
• Richebourg - 单瓶5-50万元<br/>
<strong>特点：</strong>100%生物动力法，产量极低，品质卓越
</p>
</section>
<section style="background:#fff9f0;padding:18px;border-radius:8px;border-left:3px solid #d4af37">
<p style="color:#8b4513;font-weight:bold;margin-bottom:12px">🍷 亨利·贾耶（Henri Jayer）</p>
<p style="color:#333;line-height:1.8">
<strong>地位：</strong>勃艮第教父级人物<br/>
<strong>代表酒款：</strong>Cros Parantoux - 单瓶20-100万元<br/>
<strong>状态：</strong>已停产（2006年去世）<br/>
<strong>特点：</strong>发明"冷浸渍"技术，影响了一代酿酒师<br/>
<strong>现状：</strong>酒款成为收藏级珍品，拍卖价格屡创新高
</p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🍷 七、入门推荐酒款</h2>
<section style="background:#e8f5e9;padding:18px;border-radius:8px;margin-bottom:12px">
<p style="color:#2e7d32;font-weight:bold;margin-bottom:12px">💚 200元以下 - 日常饮用</p>
<p style="color:#333;line-height:1.8">
<strong>• Louis Jadot Bourgogne Rouge</strong> - 约150元<br/>
<span style="color:#666">入门首选，品质稳定，性价比高</span><br/><br/>
<strong>• Joseph Drouhin Bourgogne Blanc</strong> - 约180元<br/>
<span style="color:#666">清爽易饮，适合搭配海鲜</span>
</p>
</section>
<section style="background:#fff3e0;padding:18px;border-radius:8px;margin-bottom:12px">
<p style="color:#e65100;font-weight:bold;margin-bottom:12px">🧡 500-1500元 - 进阶之选</p>
<p style="color:#333;line-height:1.8">
<strong>• Domaine Faiveley Gevrey-Chambertin</strong> - 约800元<br/>
<span style="color:#666">强劲有力，陈年潜力佳</span><br/><br/>
<strong>• Louis Latour Puligny-Montrachet</strong> - 约1000元<br/>
<span style="color:#666">优雅细腻，矿物感突出</span><br/><br/>
<strong>• Domaine Leflaive Bourgogne Blanc</strong> - 约1200元<br/>
<span style="color:#666">生物动力法，品质卓越</span>
</p>
</section>
<section style="background:#fce4ec;padding:18px;border-radius:8px">
<p style="color:#c2185b;font-weight:bold;margin-bottom:12px">❤️ 3000元以上 - 收藏级</p>
<p style="color:#333;line-height:1.8">
<strong>• Domaine de la Romanée-Conti Echézeaux</strong> - 约8000元<br/>
<span style="color:#666">DRC入门酒款，品质超群</span><br/><br/>
<strong>• Domaine Comte Georges de Vogüé Musigny</strong> - 约6000元<br/>
<span style="color:#666">香波-慕西尼之王</span><br/><br/>
<strong>• Coche-Dury Meursault</strong> - 约5000元<br/>
<span style="color:#666">默尔索最佳代表</span>
</p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🍽️ 八、配餐建议</h2>
<section style="background:#fff3e0;padding:18px;border-radius:8px">
<p style="color:#e65100;font-weight:bold;margin-bottom:12px">🥘 经典搭配</p>
<p style="color:#333;line-height:2">
<strong>🔴 勃艮第红酒 + 中餐</strong><br/>
<span style="color:#666">• 红烧肉：黑皮诺的细腻单宁与肥瘦相间的肉质完美搭配</span><br/>
<span style="color:#666">• 烤鸭：优雅的果味衬托烤鸭的酥脆</span><br/>
<span style="color:#666">• 蘑菇菜肴：黑皮诺的蘑菇风味与菌类完美呼应</span><br/><br/>
<strong>⚪ 夏布利白酒 + 海鲜</strong><br/>
<span style="color:#666">• 生蚝：清爽酸度突出鲜美</span><br/>
<span style="color:#666">• 清蒸鱼：矿物感衬托鱼肉</span><br/><br/>
<strong>⚪ 蒙哈榭 + 高级料理</strong><br/>
<span style="color:#666">• 龙虾：饱满酒体搭配精致海鲜</span><br/>
<span style="color:#666">• 白松露：经典搭配，奢华享受</span>
</p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">💰 九、投资建议</h2>
<section style="background:#f0fff0;padding:18px;border-radius:8px;border-left:3px solid #28a745">
<p style="color:#155724;line-height:1.8">
<strong>🟢 适合投资</strong><br/><br/>
<strong>• DRC系列：</strong>罗曼尼·康帝、拉塔希、李其堡<br/>
<span style="color:#666">顶级稀缺，升值潜力大，但门槛极高（10万+）</span><br/><br/>
<strong>• Leroy系列：</strong>Musigny、Richebourg<br/>
<span style="color:#666">品质卓越，市场需求旺盛（5万+）</span><br/><br/>
<strong>• 知名一级园：</strong>Vosne-Romanée 1er Cru、Gevrey-Chambertin 1er Cru<br/>
<span style="color:#666">价格相对亲民（1000-5000元），品质有保障</span><br/><br/>
<strong>• 夏布利特级园：</strong>Les Clos、Vaudésir<br/>
<span style="color:#666">白酒投资首选（2000-10000元）</span><br/><br/>
<strong>⚠️ 风险提示：</strong><br/>
<span style="color:#666">• 流动性较低，需要长期持有<br/>
• 价格波动大，受市场情绪影响<br/>
• 存储条件要求高，温度湿度需恒定<br/>
• 假酒风险，建议通过正规渠道购买</span>
</p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">📅 十、经典年份推荐</h2>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#8b2252;font-weight:bold;margin-bottom:12px">近20年最佳年份：</p>
<table style="width:100%;border-collapse:collapse">
<tr style="border-bottom:2px solid #d4af37">
<td style="padding:10px;font-weight:bold;color:#2d1424">年份</td>
<td style="padding:10px;font-weight:bold;color:#2d1424">评分</td>
<td style="padding:10px;font-weight:bold;color:#2d1424">说明</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#333">2019</td>
<td style="padding:10px;color:#c41e3a">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">伟大年份，红酒白酒都出色</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#333">2015</td>
<td style="padding:10px;color:#c41e3a">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">阳光充沛，果味浓郁</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#333">2010</td>
<td style="padding:10px;color:#c41e3a">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">完美年份，收藏首选</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#333">2005</td>
<td style="padding:10px;color:#c41e3a">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">经典年份，适饮期</td>
</tr>
<tr>
<td style="padding:10px;color:#333">2002</td>
<td style="padding:10px;color:#d4af37">⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">被低估的年份，性价比高</td>
</tr>
</table>
</section>
</section>

<section style="background:linear-gradient(135deg,#2d1a0a,#4a2d14);padding:22px;border-radius:10px;text-align:center">
<p style="color:#d4af37;font-size:14px;font-weight:bold;margin-bottom:8px">🍷 结语</p>
<p style="color:#f5e6d3;font-size:14px;line-height:1.8;margin:0">勃艮第是葡萄酒世界的殿堂，每一瓶酒都承载着风土的灵魂。从入门级的150元地区级，到收藏级的数十万元特级园，都有无尽的探索空间。</p>
<p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display}<br/>关注我们，探索更多葡萄酒产区</p>
</section>`
  };

  console.log('📝 标题:', article.title);
  console.log('📤 发布到微信...');

  const tokenResp = await axios.get(config.publish.endpoints.token, {
    params: { grant_type: 'client_credential', appid: config.publish.appId, secret: config.publish.appSecret },
    timeout: 10000
  });
  const token = tokenResp.data.access_token;

  const formData = new FormData();
  formData.append('media', coverBuffer, { filename: 'cover.png', contentType: 'image/png' });
  const uploadResp = await axios.post(`https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${token}&type=image`, formData, { headers: formData.getHeaders(), timeout: 30000 });
  const mediaId = uploadResp.data.media_id;

  const draftResp = await axios.post(`https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${token}`, { articles: [{ ...article, thumb_media_id: mediaId, need_open_comment: 0, only_fans_can_comment: 0 }] }, { headers: { 'Content-Type': 'application/json' }, timeout: 30000 });

  console.log('');
  console.log('='.repeat(60));
  console.log('✅ 发布成功！');
  console.log('草稿ID:', draftResp.data.media_id);
  console.log('='.repeat(60));
}

main();
