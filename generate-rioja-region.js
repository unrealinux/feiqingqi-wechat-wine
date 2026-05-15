/**
 * 里奥哈（Rioja）产区巡礼文章生成器
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
  console.log('🎨 生成里奥哈写实封面...');
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
        prompt: 'Beautiful Rioja vineyard landscape in Spain, rolling hills, Tempranillo grapevines, ancient Spanish stone winery building, golden hour sunlight, professional landscape photography, warm Mediterranean light, high detail',
        negative_prompt: 'cartoon, illustration, blurry, low quality, text, watermark, modern buildings',
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
          const svg = `<svg width="900" height="383"><defs><linearGradient id="tg" x1="0%" x2="100%"><stop offset="0%" style="stop-color:#D4AF37"/><stop offset="100%" style="stop-color:#F4E4BC"/></linearGradient></defs><rect x="0" y="0" width="900" height="383" fill="rgba(0,0,0,0.25)"/><rect x="0" y="240" width="900" height="143" fill="rgba(0,0,0,0.75)"/><text x="30" y="295" font-family="Microsoft YaHei" font-size="34" font-weight="bold" fill="url(#tg)">🍷 里奥哈产区巡礼</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="16" fill="rgba(255,255,255,0.9)">西班牙瑰宝 · 丹魄之乡 · 陈年艺术</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text></svg>`;
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
  const svg = `<svg width="900" height="383"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#2d1424"/><stop offset="50%" style="stop-color:#4a1a2e"/><stop offset="100%" style="stop-color:#6b2a3a"/></linearGradient></defs><rect width="900" height="383" fill="url(#g)"/><rect x="0" y="240" width="900" height="143" fill="rgba(0,0,0,0.6)"/><text x="30" y="295" font-family="Microsoft YaHei" font-size="34" font-weight="bold" fill="#D4AF37">🍷 里奥哈产区巡礼</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="16" fill="rgba(255,255,255,0.9)">西班牙瑰宝 · 丹魄之乡 · 陈年艺术</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function main() {
  console.log('='.repeat(60));
  console.log('🍷 生成里奥哈产区巡礼文章');
  console.log('日期:', date.display);
  console.log('='.repeat(60));
  console.log('');

  const coverBuffer = await generateCover();

  const article = {
    title: '🍷 里奥哈产区巡礼：西班牙葡萄酒的皇冠明珠',
    author: '红酒顾问',
    digest: '里奥哈是西班牙最著名的葡萄酒产区，以丹魄（Tempranillo）葡萄和独特的陈年分级体系闻名。',
    content: `<section style="margin-bottom:20px"><p style="color:#999;text-align:center">${date.full} | 产区巡礼系列 | 红酒顾问</p></section>

<section style="background:linear-gradient(135deg,#2d1424,#4a1a2e);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#f5e6d3;font-size:16px;line-height:1.9">里奥哈（Rioja）是西班牙最著名的葡萄酒产区，以<strong style="color:#d4af37">丹魄（Tempranillo）</strong>葡萄和独特的<strong style="color:#d4af37">陈年分级体系</strong>闻名。这里的酒风格多样，从果味浓郁的新酒到陈年数十年的老酒，应有尽有，且性价比极高。</p>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🌍 一、里奥哈在哪里</h2>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:12px">里奥哈位于西班牙北部，埃布罗河（Ebro River）流域。这里是大陆性气候与地中海气候的交汇处，昼夜温差大，非常适合葡萄积累风味物质。</p>
<p style="color:#333;line-height:1.8"><strong>📍 地理位置：</strong>西班牙北部，巴斯克地区南部<br/><strong>🌡️ 气候类型：</strong>大陆性气候+地中海气候<br/><strong>🍇 主要葡萄：</strong>丹魄（Tempranillo）<br/><strong>📏 产区面积：</strong>约65,000公顷<br/><strong>🍷 年产量：</strong>约2.5亿瓶</p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🍇 二、里奥哈的灵魂：丹魄</h2>
<section style="background:linear-gradient(135deg,#fff9f0,#fff5e6);padding:20px;border-radius:8px;border-left:3px solid #d4af37">
<p style="color:#8b4513;font-size:18px;font-weight:bold;margin-bottom:15px">🍇 丹魄（Tempranillo）</p>
<p style="color:#333;line-height:1.8;margin-bottom:12px">丹魄是西班牙的国宝级品种，名字来自"Temprano"（早），因为它比大多数红葡萄早熟。它是里奥哈红酒的绝对主角，通常占混酿的70%以上。</p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>典型风味：</strong>红樱桃、李子、烟草、皮革、香草<br/><strong>特点：</strong>中等酸度、中等单宁、陈年潜力极佳<br/><strong>陈年表现：</strong>随着陈年，会发展出复杂的泥土、蘑菇和雪松风味</p>
<p style="color:#666;font-size:14px;line-height:1.8">💡 除了丹魄，里奥哈还允许使用歌海娜（Garnacha）、格拉西亚诺（Graciano）和马祖埃罗（Mazuelo）进行混酿，以增加复杂度和酸度。</p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🗺️ 三、三大子产区</h2>
<section style="background:#faf8f5;padding:18px;border-radius:8px;margin-bottom:12px">
<p style="color:#8b2252;font-weight:bold;margin-bottom:12px">🏔️ 里奥哈阿拉维萨（Rioja Alavesa）</p>
<p style="color:#333;line-height:1.8">位于北部山区，海拔较高，气候凉爽。这里的丹魄酸度更高，酒体更优雅，适合长期陈年。许多顶级酒庄位于此。</p>
</section>
<section style="background:#faf8f5;padding:18px;border-radius:8px;margin-bottom:12px">
<p style="color:#8b2252;font-weight:bold;margin-bottom:12px">🏰 里奥哈阿尔塔（Rioja Alta）</p>
<p style="color:#333;line-height:1.8">位于西部，海拔较高，气候受大西洋影响。这里的酒结构感强，酸度好，是传统风格里奥哈的代表。</p>
</section>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#8b2252;font-weight:bold;margin-bottom:12px">☀️ 里奥哈东方（Rioja Oriental，原Rioja Baja）</p>
<p style="color:#333;line-height:1.8">位于东部，气候温暖干燥，受地中海影响。这里的歌海娜表现优异，酒体更饱满，果味更浓郁，酒精度更高。</p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">⏳ 四、独特的陈年分级体系</h2>
<section style="background:#e8f5e9;padding:18px;border-radius:8px">
<p style="color:#2e7d32;font-weight:bold;margin-bottom:12px">📅 这是里奥哈最核心的特色！</p>
<table style="width:100%;border-collapse:collapse">
<tr style="border-bottom:2px solid #d4af37">
<td style="padding:10px;font-weight:bold;color:#2d1424">等级</td>
<td style="padding:10px;font-weight:bold;color:#2d1424">橡木桶陈年</td>
<td style="padding:10px;font-weight:bold;color:#2d1424">瓶中陈年</td>
<td style="padding:10px;font-weight:bold;color:#2d1424">总陈年时间</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#333">Joven（新酒）</td>
<td style="padding:10px;color:#666">无或很少</td>
<td style="padding:10px;color:#666">无</td>
<td style="padding:10px;color:#666">当年或次年发售</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#333">Crianza（陈酿）</td>
<td style="padding:10px;color:#666">至少1年</td>
<td style="padding:10px;color:#666">无要求</td>
<td style="padding:10px;color:#666">至少2年</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#c41e3a;font-weight:bold">Reserva（珍藏）</td>
<td style="padding:10px;color:#666;font-weight:bold">至少1年</td>
<td style="padding:10px;color:#666;font-weight:bold">至少2年</td>
<td style="padding:10px;color:#666;font-weight:bold">至少3年</td>
</tr>
<tr>
<td style="padding:10px;color:#d4af37;font-weight:bold">Gran Reserva（特级珍藏）</td>
<td style="padding:10px;color:#666;font-weight:bold">至少2年</td>
<td style="padding:10px;color:#666;font-weight:bold">至少3年</td>
<td style="padding:10px;color:#666;font-weight:bold">至少5年</td>
</tr>
</table>
<p style="color:#666;font-size:14px;margin-top:12px">💡 只有最好的年份才会生产Gran Reserva。这些酒通常具有极强的陈年潜力。</p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">👑 五、顶级酒庄推荐</h2>
<section style="background:#fff9f0;padding:18px;border-radius:8px;margin-bottom:12px;border-left:3px solid #d4af37">
<p style="color:#8b4513;font-weight:bold;margin-bottom:12px">🍷 传统派名庄</p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>1. López de Heredia（洛佩兹雷迪亚）</strong><br/><span style="color:#666">• 地位：里奥哈最传统的酒庄之一</span><br/><span style="color:#666">• 特点：超长陈年，Viña Tondonia系列是经典</span><br/><span style="color:#666">• 价格：约300-1000元</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>2. La Rioja Alta（里奥哈高塔）</strong><br/><span style="color:#666">• 地位：品质极其稳定</span><br/><span style="color:#666">• 特点：904 Gran Reserva是性价比之王</span><br/><span style="color:#666">• 价格：约400-800元</span></p>
</section>
<section style="background:#fff9f0;padding:18px;border-radius:8px;border-left:3px solid #d4af37">
<p style="color:#8b4513;font-weight:bold;margin-bottom:12px">🍷 现代派名庄</p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>3. Marqués de Riscal（瑞格尔侯爵）</strong><br/><span style="color:#666">• 地位：里奥哈最古老的酒庄之一（1858年）</span><br/><span style="color:#666">• 特点：标志性钛金属建筑，酒款品质卓越</span><br/><span style="color:#666">• 价格：约200-600元</span></p>
<p style="color:#333;line-height:1.8"><strong>4. Artadi（阿塔迪）</strong><br/><span style="color:#666">• 地位：里奥哈膜拜酒庄</span><br/><span style="color:#666">• 特点：单一园，极致风土表达</span><br/><span style="color:#666">• 价格：约800-3000元</span></p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">💰 六、投资建议</h2>
<section style="background:#f0fff0;padding:18px;border-radius:8px;border-left:3px solid #28a745">
<p style="color:#155724;line-height:1.8">
<strong>🟢 适合投资</strong><br/><br/>
<strong>• Gran Reserva系列：</strong>La Rioja Alta 904, López de Heredia Viña Tondonia<br/>
<span style="color:#666">陈年潜力极强，价格相对稳定</span><br/><br/>
<strong>• 单一园酒款：</strong>Artadi, Remelluri<br/>
<span style="color:#666">风土表达精准，收藏价值高</span><br/><br/>
<strong>⚠️ 风险提示：</strong><br/>
<span style="color:#666">• 里奥哈酒整体价格较低，升值空间不如波尔多/勃艮第<br/>
• 适合"喝得起的收藏"，而非纯投资<br/>
• 注意储存条件，避免高温</span>
</p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🍽️ 七、配餐建议</h2>
<section style="background:#fff3e0;padding:18px;border-radius:8px">
<p style="color:#e65100;font-weight:bold;margin-bottom:12px">🥘 经典搭配</p>
<p style="color:#333;line-height:1.8"><strong>• 里奥哈Crianza + 西班牙Tapas</strong><br/><span style="color:#666">火腿、土豆饼、橄榄，完美搭配</span><br/><br/><strong>• 里奥哈Reserva + 烤羊排/炖肉</strong><br/><span style="color:#666">陈年带来的皮革风味与红肉绝配</span><br/><br/><strong>• 里奥哈Gran Reserva + 中式红烧肉</strong><br/><span style="color:#666">复杂风味与浓郁酱汁相得益彰</span><br/><br/><strong>• 里奥哈白酒 + 海鲜饭</strong><br/><span style="color:#666">清爽酸度解腻提鲜</span></p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">📅 八、经典年份推荐</h2>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<table style="width:100%;border-collapse:collapse">
<tr style="border-bottom:2px solid #d4af37">
<td style="padding:10px;font-weight:bold;color:#2d1424">年份</td>
<td style="padding:10px;font-weight:bold;color:#2d1424">评分</td>
<td style="padding:10px;font-weight:bold;color:#2d1424">特点</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#333">2016</td>
<td style="padding:10px;color:#c41e3a">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">完美平衡，Elegant年份</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#333">2010</td>
<td style="padding:10px;color:#c41e3a">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">经典年份，陈年潜力佳</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#333">2005</td>
<td style="padding:10px;color:#c41e3a">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">浓郁饱满，适饮期</td>
</tr>
<tr>
<td style="padding:10px;color:#333">2001</td>
<td style="padding:10px;color:#d4af37">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">传奇年份，收藏级</td>
</tr>
</table>
</section>
</section>

<section style="background:linear-gradient(135deg,#2d1424,#4a1a2e);padding:22px;border-radius:10px;text-align:center">
<p style="color:#d4af37;font-size:14px;font-weight:bold;margin-bottom:8px">🍷 结语</p>
<p style="color:#f5e6d3;font-size:14px;line-height:1.8;margin:0">里奥哈是西班牙葡萄酒的骄傲。从几十元的日常餐酒，到上千元的Gran Reserva，都能找到极致性价比。探索里奥哈，就是探索西班牙的热情与浪漫。</p>
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
