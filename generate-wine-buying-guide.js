/**
 * 葡萄酒购买推荐文章生成器 - 修复版
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
  console.log('🎨 生成购买推荐封面...');
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
        prompt: 'Wine shopping guide concept, multiple wine bottles arranged by price, price tags, wine glasses, professional product photography, warm lighting, high detail, 8k quality',
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
          const svg = `<svg width="900" height="383"><defs><linearGradient id="tg" x1="0%" x2="100%"><stop offset="0%" style="stop-color:#D4AF37"/><stop offset="100%" style="stop-color:#F4E4BC"/></linearGradient></defs><rect x="0" y="0" width="900" height="383" fill="rgba(0,0,0,0.25)"/><rect x="0" y="240" width="900" height="143" fill="rgba(0,0,0,0.75)"/><text x="30" y="295" font-family="Microsoft YaHei" font-size="30" font-weight="bold" fill="url(#tg)">🍷 本周葡萄酒购买推荐</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="16" fill="rgba(255,255,255,0.9)">高性价比 · 场景适配 · 趋势解读</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text></svg>`;
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
  const svg = `<svg width="900" height="383"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#2d1424"/><stop offset="50%" style="stop-color:#4a1a2e"/><stop offset="100%" style="stop-color:#6b2a3a"/></linearGradient></defs><rect width="900" height="383" fill="url(#g)"/><rect x="0" y="240" width="900" height="143" fill="rgba(0,0,0,0.6)"/><text x="30" y="295" font-family="Microsoft YaHei" font-size="30" font-weight="bold" fill="#D4AF37">🍷 本周葡萄酒购买推荐</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="16" fill="rgba(255,255,255,0.9)">高性价比 · 场景适配 · 趋势解读</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function main() {
  console.log('='.repeat(60));
  console.log('🍷 生成葡萄酒购买推荐文章');
  console.log('日期:', date.display);
  console.log('='.repeat(60));
  console.log('');

  const coverBuffer = await generateCover();

  const article = {
    title: '🍷 本周葡萄酒购买推荐：高性价比酒款精选',
    author: '红酒买手',
    digest: '本周精选Top 5、高性价比榜单、场景推荐、趋势品种，帮你选对每一瓶酒。',
    content: `<section style="margin-bottom:20px"><p style="color:#999;text-align:center">${date.full} | 购买推荐系列 | 红酒买手</p></section>

<section style="background:linear-gradient(135deg,#2d1424,#4a1a2e);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#f5e6d3;font-size:16px;line-height:1.9">
本期为你精选<strong style="color:#d4af37">高性价比酒款</strong>，覆盖百元日常到千元收藏，附带评分、价格区间和场景推荐。所有价格仅供参考，以实际购买为准。
</p>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">⭐ 一、本周精选Top 5</h2>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>1. Cloudy Bay Sauvignon Blanc 2022</strong><br/><span style="color:#d4af37">评分：WA 92 | 参考价：200-300元</span><br/><span style="color:#666">推荐理由：新西兰长相思标杆，百香果与青草香气完美平衡，海鲜绝配。</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>2. Concha y Toro Casillero del Diablo 2021</strong><br/><span style="color:#d4af37">评分：WS 90 | 参考价：80-120元</span><br/><span style="color:#666">推荐理由：智利性价比之王，果味浓郁，日常饮用无压力。</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>3. Marques de Riscal Reserva 2017</strong><br/><span style="color:#d4af37">评分：WS 92 | 参考价：250-350元</span><br/><span style="color:#666">推荐理由：里奥哈经典，WS年度最佳性价比，陈年3年以上。</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>4. Antinori Tignanello 2019</strong><br/><span style="color:#d4af37">评分：WA 96 | 参考价：1000-1500元</span><br/><span style="color:#666">推荐理由：超级托斯卡纳经典，Antinori家族旗舰，送礼收藏两相宜。</span></p>
<p style="color:#333;line-height:1.8"><strong>5. Louis Roederer Cristal 2014</strong><br/><span style="color:#d4af37">评分：WA 97 | 参考价：2500-3500元</span><br/><span style="color:#666">推荐理由：沙皇御用香槟，极致奢华，重要场合首选。</span></p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">💎 二、高性价比榜单</h2>
<section style="background:#e8f5e9;padding:18px;border-radius:8px;margin-bottom:12px">
<p style="color:#2e7d32;font-weight:bold;margin-bottom:12px">💚 100-300元档（日常饮用）</p>
<p style="color:#333;line-height:1.8"><strong>• Kim Crawford Sauvignon Blanc 2022</strong> - 约120元 | WA 91<br/><strong>• Ruffino Chianti Classico 2020</strong> - 约150元 | WS 90<br/><strong>• Yellow Tail Shiraz 2021</strong> - 约90元 | Vivino 4.2</p>
</section>
<section style="background:#fff3e0;padding:18px;border-radius:8px;margin-bottom:12px">
<p style="color:#e65100;font-weight:bold;margin-bottom:12px">🧡 300-800元档（进阶之选）</p>
<p style="color:#333;line-height:1.8"><strong>• Caymus Cabernet Sauvignon 2020</strong> - 约800元 | WA 94<br/><strong>• E. Guigal Cote-Rotie 2017</strong> - 约1500元 | WA 96</p>
</section>
<section style="background:#fce4ec;padding:18px;border-radius:8px">
<p style="color:#c2185b;font-weight:bold;margin-bottom:12px">❤️ 800元以上档（收藏送礼）</p>
<p style="color:#333;line-height:1.8"><strong>• Opus One 2019</strong> - 约2800-3500元 | WA 97<br/><strong>• Penfolds Grange 2018</strong> - 约5000-8000元 | WA 98<br/><strong>• Dom Perignon 2012</strong> - 约2000-2500元 | WA 96</p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🍽️ 三、场景推荐</h2>
<section style="background:#faf8f5;padding:18px;border-radius:8px;margin-bottom:12px">
<p style="color:#8b2252;font-weight:bold;margin-bottom:12px">💼 商务宴请</p>
<p style="color:#333;line-height:1.8"><strong>• Chateau Margaux 2016</strong> - 约3500-4500元<br/><span style="color:#666">一级庄名酒，面子与里子兼备</span><br/><strong>• Krug Grande Cuvee</strong> - 约1500-2000元<br/><span style="color:#666">香槟中的劳斯莱斯，开场必备</span></p>
</section>
<section style="background:#faf8f5;padding:18px;border-radius:8px;margin-bottom:12px">
<p style="color:#8b2252;font-weight:bold;margin-bottom:12px">🏠 日常佐餐</p>
<p style="color:#333;line-height:1.8"><strong>• Cloudy Bay Sauvignon Blanc</strong> - 约200-300元<br/><span style="color:#666">清爽百搭，海鲜沙拉绝配</span><br/><strong>• Casillero del Diablo</strong> - 约80-120元<br/><span style="color:#666">性价比之王，天天喝不心疼</span></p>
</section>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#8b2252;font-weight:bold;margin-bottom:12px">🎁 送礼收藏</p>
<p style="color:#333;line-height:1.8"><strong>• Dom Perignon 2012</strong> - 约2000-2500元<br/><span style="color:#666">香槟之王，送礼有面子</span><br/><strong>• Antinori Tignanello 2019</strong> - 约1000-1500元<br/><span style="color:#666">超级托斯卡纳，懂酒之选</span></p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">📈 四、趋势品种解读</h2>
<section style="background:linear-gradient(135deg,#fff9f0,#fff5e6);padding:20px;border-radius:8px;border-left:3px solid #d4af37">
<p style="color:#8b4513;font-weight:bold;margin-bottom:12px">🔥 本周值得关注的趋势</p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>1. 新西兰长相思持续走热</strong><br/><span style="color:#666">Cloudy Bay、Kim Crawford等品牌销量持续增长，清爽风格受年轻消费者青睐。</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>2. 里奥哈Reserva性价比凸显</strong><br/><span style="color:#666">Marques de Riscal、CVNE等老牌酒庄Reserva级别，300-500元区间极具竞争力。</span></p>
<p style="color:#333;line-height:1.8"><strong>3. 香槟需求回升</strong><br/><span style="color:#666">随着宴会场景恢复，Dom Perignon、Krug等高端香槟需求明显回升。</span></p>
</section>
</section>

<section style="background:#f5f5f5;padding:12px;border-radius:6px;margin-bottom:20px">
<p style="color:#666;font-size:12px;margin:0">
<strong>🔗 购买参考</strong><br/>
评分来源：Wine Advocate (WA)、Wine Spectator (WS)、Vivino<br/>
价格为市场参考价，以实际购买为准<br/>
发布日期：${date.display}
</p>
</section>

<section style="background:linear-gradient(135deg,#2d1424,#4a1a2e);padding:22px;border-radius:10px;text-align:center">
<p style="color:#d4af37;font-size:14px;font-weight:bold;margin-bottom:8px">🍷 结语</p>
<p style="color:#f5e6d3;font-size:14px;line-height:1.8;margin:0">选酒不必盲目追求高价，适合自己口味和场景的才是最好的。掌握这些推荐，轻松选对每一瓶酒。</p>
<p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display}<br/>关注我们，获取每周购买推荐</p>
</section>`
  };

  console.log('📝 标题:', article.title);
  console.log('📤 发布到微信...');

  const tokenResp = await axios.get(config.publish.endpoints.token, {
    params: { grant_type: 'client_credential', appid: config.publish.appId, secret: config.publish.appSecret },
    timeout: 10000
  });
  const token = tokenResp.data.access_token;
  console.log('   Token获取成功');

  const formData = new FormData();
  formData.append('media', coverBuffer, { filename: 'cover.png', contentType: 'image/png' });
  console.log('   上传封面...');
  const uploadResp = await axios.post(`https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${token}&type=image`, formData, { headers: formData.getHeaders(), timeout: 30000 });
  console.log('   上传响应:', JSON.stringify(uploadResp.data));
  const mediaId = uploadResp.data.media_id;

  console.log('   创建草稿...');
  const draftResp = await axios.post(`https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${token}`, { articles: [{ ...article, thumb_media_id: mediaId, need_open_comment: 0, only_fans_can_comment: 0 }] }, { headers: { 'Content-Type': 'application/json' }, timeout: 30000 });
  
  console.log('   草稿响应:', JSON.stringify(draftResp.data));

  if (draftResp.data.errcode) {
    console.log('❌ 创建草稿失败:', draftResp.data.errmsg);
    return;
  }

  console.log('');
  console.log('='.repeat(60));
  console.log('✅ 发布成功！');
  console.log('草稿ID:', draftResp.data.media_id);
  console.log('='.repeat(60));
}

main();
