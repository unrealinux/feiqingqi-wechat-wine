/**
 * 葡萄酒入门指南文章生成器
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
  console.log('🎨 生成葡萄酒入门封面...');
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
        prompt: 'Elegant wine tasting setup, multiple wine glasses with red and white wine, professional food photography, soft warm lighting, dark wooden table, wine bottles in background, inviting atmosphere, high detail',
        negative_prompt: 'cartoon, illustration, blurry, low quality, text, watermark',
        steps: 12,
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
          const svg = `<svg width="900" height="383"><defs><linearGradient id="tg" x1="0%" x2="100%"><stop offset="0%" style="stop-color:#D4AF37"/><stop offset="100%" style="stop-color:#F4E4BC"/></linearGradient></defs><rect x="0" y="0" width="900" height="383" fill="rgba(0,0,0,0.25)"/><rect x="0" y="240" width="900" height="143" fill="rgba(0,0,0,0.75)"/><text x="30" y="295" font-family="Microsoft YaHei" font-size="34" font-weight="bold" fill="url(#tg)">🍷 葡萄酒入门指南</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="16" fill="rgba(255,255,255,0.9)">从零开始 · 品鉴技巧 · 选购指南</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text></svg>`;
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
  const svg = `<svg width="900" height="383"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#2d1424"/><stop offset="50%" style="stop-color:#4a1a2e"/><stop offset="100%" style="stop-color:#6b2a3a"/></linearGradient></defs><rect width="900" height="383" fill="url(#g)"/><rect x="0" y="240" width="900" height="143" fill="rgba(0,0,0,0.6)"/><text x="30" y="295" font-family="Microsoft YaHei" font-size="34" font-weight="bold" fill="#D4AF37">🍷 葡萄酒入门指南</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="16" fill="rgba(255,255,255,0.9)">从零开始 · 品鉴技巧 · 选购指南</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function main() {
  console.log('='.repeat(60));
  console.log('🍷 生成葡萄酒入门指南文章');
  console.log('日期:', date.display);
  console.log('='.repeat(60));
  console.log('');

  const coverBuffer = await generateCover();

  const article = {
    title: '🍷 葡萄酒入门指南：从零开始成为品酒达人',
    author: '红酒顾问',
    digest: '完全零基础的葡萄酒入门指南，包含品鉴四步法、酒杯选择、选购技巧、配餐原则、存储方法等实用知识。',
    content: `<section style="margin-bottom:20px"><p style="color:#999;text-align:center">${date.full} | 葡萄酒入门系列 | 红酒顾问</p></section>

<section style="background:linear-gradient(135deg,#2d1424,#4a1a2e);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#f5e6d3;font-size:16px;line-height:1.9">你是否曾在酒架前感到迷茫？不知道如何选择一瓶适合自己的葡萄酒？本文将带你<strong style="color:#d4af37">从零开始</strong>，掌握品鉴技巧、选购方法、配餐原则，让你轻松成为品酒达人。</p>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">📚 一、葡萄酒基础知识</h2>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#8b2252;font-weight:bold;margin-bottom:12px">🍇 葡萄酒是什么？</p>
<p style="color:#333;line-height:1.8;margin-bottom:12px">葡萄酒是用葡萄发酵而成的酒精饮料。不同于其他酒类，葡萄酒的风味受<strong>葡萄品种</strong>、<strong>产区</strong>、<strong>年份</strong>、<strong>酿造工艺</strong>等多种因素影响，因此种类繁多，风味各异。</p>
<p style="color:#8b2252;font-weight:bold;margin-bottom:12px;margin-top:15px">🍷 葡萄酒的主要类型</p>
<table style="width:100%;border-collapse:collapse">
<tr style="border-bottom:2px solid #d4af37">
<td style="padding:10px;font-weight:bold;color:#2d1424">类型</td>
<td style="padding:10px;font-weight:bold;color:#2d1424">颜色</td>
<td style="padding:10px;font-weight:bold;color:#2d1424">特点</td>
<td style="padding:10px;font-weight:bold;color:#2d1424">代表</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#c41e3a">红葡萄酒</td>
<td style="padding:10px;color:#666">红/紫</td>
<td style="padding:10px;color:#666">单宁强劲，陈年潜力佳</td>
<td style="padding:10px;color:#666">赤霞珠、黑皮诺</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#f5e6d3">白葡萄酒</td>
<td style="padding:10px;color:#666">黄/金</td>
<td style="padding:10px;color:#666">清爽酸度，果味丰富</td>
<td style="padding:10px;color:#666">霞多丽、长相思</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#ffb6c1">桃红葡萄酒</td>
<td style="padding:10px;color:#666">粉红</td>
<td style="padding:10px;color:#666">清爽易饮，适合夏天</td>
<td style="padding:10px;color:#666">普罗旺斯桃红</td>
</tr>
<tr>
<td style="padding:10px;color:#d4af37">起泡酒/香槟</td>
<td style="padding:10px;color:#666">透明/金</td>
<td style="padding:10px;color:#666">气泡丰富，适合庆祝</td>
<td style="padding:10px;color:#666">香槟、普罗塞克</td>
</tr>
</table>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🍇 二、常见葡萄品种</h2>
<section style="background:#faf8f5;padding:18px;border-radius:8px;margin-bottom:12px">
<p style="color:#c41e3a;font-weight:bold;margin-bottom:12px">🔴 红葡萄品种</p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>1. 赤霞珠（Cabernet Sauvignon）</strong><br/><span style="color:#666">"红葡萄之王"，单宁强劲，黑醋栗、雪松风味。波尔多左岸代表。</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>2. 黑皮诺（Pinot Noir）</strong><br/><span style="color:#666">"酿酒师的噩梦"，细腻优雅，红樱桃、玫瑰风味。勃艮第代表。</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>3. 梅洛（Merlot）</strong><br/><span style="color:#666">柔和易饮，李子、巧克力风味。波尔多右岸代表。</span></p>
<p style="color:#333;line-height:1.8"><strong>4. 西拉（Syrah/Shiraz）</strong><br/><span style="color:#666">浓郁强劲，黑胡椒、蓝莓风味。法国北罗讷/澳洲代表。</span></p>
</section>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#f5e6d3;font-weight:bold;margin-bottom:12px;background:#2d1424;padding:8px 12px;border-radius:4px;display:inline-block">⚪ 白葡萄品种</p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>1. 霞多丽（Chardonnay）</strong><br/><span style="color:#666">"变色龙"，风格多变，苹果、黄油风味。勃艮第/加州代表。</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>2. 长相思（Sauvignon Blanc）</strong><br/><span style="color:#666">清爽酸爽，青草、柑橘风味。新西兰/卢瓦尔河代表。</span></p>
<p style="color:#333;line-height:1.8"><strong>3. 雷司令（Riesling）</strong><br/><span style="color:#666">芳香型，汽油、蜂蜜风味。德国/阿尔萨斯代表。</span></p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">👃 三、品鉴四步法</h2>
<section style="background:linear-gradient(135deg,#fff9f0,#fff5e6);padding:20px;border-radius:8px;border-left:3px solid #d4af37">
<p style="color:#8b4513;font-size:18px;font-weight:bold;margin-bottom:15px">🎯 专业品酒师都在用的方法</p>
<p style="color:#333;line-height:1.8;margin-bottom:12px"><strong>第一步：观色（See）</strong><br/>将酒杯倾斜45度，在白色背景下观察。<br/><span style="color:#666">• 颜色深浅：深色=浓郁，浅色=轻盈</span><br/><span style="color:#666">• 边缘色调：紫色=年轻，橙色=陈年</span><br/><span style="color:#666">• 透明度：清澈=健康，浑浊=可能有问题</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:12px"><strong>第二步：闻香（Smell）</strong><br/>轻轻摇晃酒杯，让酒液与空气接触。<br/><span style="color:#666">• 第一次闻：感受主要香气</span><br/><span style="color:#666">• 再次摇晃：释放更多复杂香气</span><br/><span style="color:#666">• 注意：果香、花香、香料、橡木等</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:12px"><strong>第三步：品尝（Taste）</strong><br/>小口啜饮，让酒液在口中停留5-10秒。<br/><span style="color:#666">• 甜度：干型/半干/甜</span><br/><span style="color:#666">• 酸度：低/中/高</span><br/><span style="color:#666">• 单宁：柔和/中等/强劲</span><br/><span style="color:#666">• 酒体：轻盈/中等/饱满</span></p>
<p style="color:#333;line-height:1.8"><strong>第四步：回味（Finish）</strong><br/>咽下或吐出后，感受余味的长度和复杂度。<br/><span style="color:#666">• 短余味（<5秒）：简单易饮</span><br/><span style="color:#666">• 中余味（5-10秒）：品质不错</span><br/><span style="color:#666">• 长余味（>10秒）：优质酒款</span></p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🥂 四、酒杯选择指南</h2>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#8b2252;font-weight:bold;margin-bottom:12px">不同酒款配不同杯型</p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>🍷 红酒杯</strong><br/><span style="color:#666">• 波尔多杯：高大，适合赤霞珠、梅洛</span><br/><span style="color:#666">• 勃艮第杯：宽大，适合黑皮诺</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>🥂 白酒杯</strong><br/><span style="color:#666">• 较小，保持低温</span><br/><span style="color:#666">• 适合霞多丽、长相思、雷司令</span></p>
<p style="color:#333;line-height:1.8"><strong>🍾 香槟杯</strong><br/><span style="color:#666">• 笛形杯：保留气泡</span><br/><span style="color:#666">• 浅碟杯：适合庆典</span></p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🛒 五、选购技巧</h2>
<section style="background:#e8f5e9;padding:18px;border-radius:8px">
<p style="color:#2e7d32;font-weight:bold;margin-bottom:12px">💡 新手选购原则</p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>1. 看产区</strong><br/><span style="color:#666">知名产区的酒款品质更有保障。法国波尔多、勃艮第；意大利托斯卡纳；美国纳帕谷等。</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>2. 看年份</strong><br/><span style="color:#666">好年份的酒款品质更佳。但新世界酒款（美国、澳洲等）年份差异较小。</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>3. 看评分</strong><br/><span style="color:#666">权威评分（WS、RP、JS）可作为参考。90分以上通常品质不错。</span></p>
<p style="color:#333;line-height:1.8"><strong>4. 看价格</strong><br/><span style="color:#666">200-500元区间性价比最高。太便宜品质不稳定，太贵需要专业知识判断。</span></p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🍽️ 六、配餐基本原则</h2>
<section style="background:#fff3e0;padding:18px;border-radius:8px">
<p style="color:#e65100;font-weight:bold;margin-bottom:12px">🥘 简单配餐公式</p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>红配红，白配白</strong><br/><span style="color:#666">• 红酒 + 红肉（牛排、羊排、红烧肉）</span><br/><span style="color:#666">• 白酒 + 白肉（鸡肉、鱼肉、海鲜）</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>重配重，轻配轻</strong><br/><span style="color:#666">• 浓郁酒 + 浓郁菜（火锅、烧烤）</span><br/><span style="color:#666">• 清爽酒 + 清爽菜（沙拉、清蒸鱼）</span></p>
<p style="color:#333;line-height:1.8"><strong>甜配甜，酸配酸</strong><br/><span style="color:#666">• 甜酒 + 甜点</span><br/><span style="color:#666">• 高酸酒 + 酸味菜（柠檬、醋）</span></p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🌡️ 七、侍酒温度</h2>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#8b2252;font-weight:bold;margin-bottom:12px">不同酒款的理想温度</p>
<table style="width:100%;border-collapse:collapse">
<tr style="border-bottom:2px solid #d4af37">
<td style="padding:10px;font-weight:bold;color:#2d1424">酒款类型</td>
<td style="padding:10px;font-weight:bold;color:#2d1424">理想温度</td>
<td style="padding:10px;font-weight:bold;color:#2d1424">说明</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#333">浓郁红酒</td>
<td style="padding:10px;color:#c41e3a">16-18°C</td>
<td style="padding:10px;color:#666">波尔多、巴罗洛</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#333">轻盈红酒</td>
<td style="padding:10px;color:#c41e3a">14-16°C</td>
<td style="padding:10px;color:#666">勃艮第、黑皮诺</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#333">饱满白酒</td>
<td style="padding:10px;color:#d4af37">10-12°C</td>
<td style="padding:10px;color:#666">橡木桶霞多丽</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#333">清爽白酒</td>
<td style="padding:10px;color:#d4af37">8-10°C</td>
<td style="padding:10px;color:#666">长相思、夏布利</td>
</tr>
<tr>
<td style="padding:10px;color:#333">香槟/起泡酒</td>
<td style="padding:10px;color:#d4af37">6-8°C</td>
<td style="padding:10px;color:#666">保持最佳气泡</td>
</tr>
</table>
<p style="color:#666;font-size:14px;margin-top:12px">💡 小技巧：红酒提前15分钟从酒柜取出，白酒提前5分钟从冰箱取出，让温度稍微回升。</p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🏺 八、存储方法</h2>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#8b2252;font-weight:bold;margin-bottom:12px">家庭存储要点</p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>1. 温度恒定</strong><br/><span style="color:#666">最理想温度：12-15°C。避免温度波动，每波动10°C会加速老化。</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>2. 湿度适中</strong><br/><span style="color:#666">理想湿度：60-70%。太干会让软木塞收缩，太湿会发霉。</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>3. 避光存放</strong><br/><span style="color:#666">光线会加速氧化，尤其是白葡萄酒。存放在黑暗处。</span></p>
<p style="color:#333;line-height:1.8"><strong>4. 平放或斜放</strong><br/><span style="color:#666">保持软木塞湿润，防止空气进入。起泡酒可直立存放。</span></p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🎁 九、入门推荐酒款</h2>
<section style="background:#e8f5e9;padding:18px;border-radius:8px;margin-bottom:12px">
<p style="color:#2e7d32;font-weight:bold;margin-bottom:12px">🍷 红酒入门推荐</p>
<p style="color:#333;line-height:1.8"><strong>• 智利赤霞珠</strong> - 约100元<br/><span style="color:#666">果味浓郁，单宁柔和，适合新手</span><br/><strong>• 澳洲西拉</strong> - 约150元<br/><span style="color:#666">浓郁饱满，性价比高</span><br/><strong>• 法国波尔多中级庄</strong> - 约300元<br/><span style="color:#666">经典风格，品质稳定</span></p>
</section>
<section style="background:#e8f5e9;padding:18px;border-radius:8px">
<p style="color:#2e7d32;font-weight:bold;margin-bottom:12px">🥂 白酒/起泡酒入门推荐</p>
<p style="color:#333;line-height:1.8"><strong>• 新西兰长相思</strong> - 约120元<br/><span style="color:#666">清新酸爽，百搭海鲜</span><br/><strong>• 意大利普罗塞克</strong> - 约100元<br/><span style="color:#666">清爽气泡，性价比之王</span><br/><strong>• 法国夏布利</strong> - 约250元<br/><span style="color:#666">矿物感突出，搭配生蚝</span></p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">⚠️ 十、常见误区</h2>
<section style="background:#fff5f5;padding:18px;border-radius:8px">
<p style="color:#c41e3a;font-weight:bold;margin-bottom:12px">🚫 新手常犯的错误</p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>误区1：红酒配红肉，白酒配白肉</strong><br/><span style="color:#666">✓ 正确：应该看酱汁和烹饪方式，不是肉的颜色</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>误区2：红酒要醒酒才能喝</strong><br/><span style="color:#666">✓ 正确：年轻红酒需要醒酒，陈年红酒不宜过度醒酒</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>误区3：螺旋盖=低品质</strong><br/><span style="color:#666">✓ 正确：很多优质酒款使用螺旋盖，更利于保存</span></p>
<p style="color:#333;line-height:1.8"><strong>误区4：年份越老越好</strong><br/><span style="color:#666">✓ 正确：大部分酒款适合年轻时饮用，只有少数适合陈年</span></p>
</section>
</section>

<section style="background:linear-gradient(135deg,#2d1424,#4a1a2e);padding:22px;border-radius:10px;text-align:center">
<p style="color:#d4af37;font-size:14px;font-weight:bold;margin-bottom:8px">🍷 结语</p>
<p style="color:#f5e6d3;font-size:14px;line-height:1.8;margin:0">葡萄酒的世界博大精深，但入门并不难。掌握品鉴四步法，了解基本配餐原则，选择适合自己的酒款，你就能享受葡萄酒带来的乐趣。欢迎在评论区分享你的品酒体验！</p>
<p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display}<br/>关注我们，探索更多葡萄酒知识</p>
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
