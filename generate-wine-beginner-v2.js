/**
 * 葡萄酒入门文章 - 全新版本
 * 聚焦于"如何选对第一瓶酒"
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
  console.log('🎨 生成封面...');
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
        prompt: 'Person choosing wine in a wine shop, looking at wine labels, warm lighting, professional lifestyle photography, inviting atmosphere, high detail',
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
          const svg = `<svg width="900" height="383"><defs><linearGradient id="tg" x1="0%" x2="100%"><stop offset="0%" style="stop-color:#D4AF37"/><stop offset="100%" style="stop-color:#F4E4BC"/></linearGradient></defs><rect x="0" y="0" width="900" height="383" fill="rgba(0,0,0,0.25)"/><rect x="0" y="240" width="900" height="143" fill="rgba(0,0,0,0.75)"/><text x="30" y="295" font-family="Microsoft YaHei" font-size="30" font-weight="bold" fill="url(#tg)">🍷 选对第一瓶酒：新手避坑指南</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="16" fill="rgba(255,255,255,0.9)">10款入门酒推荐 · 选购技巧 · 常见陷阱</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text></svg>`;
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
  const svg = `<svg width="900" height="383"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#2d1424"/><stop offset="50%" style="stop-color:#4a1a2e"/><stop offset="100%" style="stop-color:#6b2a3a"/></linearGradient></defs><rect width="900" height="383" fill="url(#g)"/><rect x="0" y="240" width="900" height="143" fill="rgba(0,0,0,0.6)"/><text x="30" y="295" font-family="Microsoft YaHei" font-size="30" font-weight="bold" fill="#D4AF37">🍷 选对第一瓶酒：新手避坑指南</text><text x="30" y="340" font-family="Microsoft YaHei" font-size="16" fill="rgba(255,255,255,0.9)">10款入门酒推荐 · 选购技巧 · 常见陷阱</text><text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function main() {
  console.log('='.repeat(60));
  console.log('🍷 生成葡萄酒入门文章（全新版）');
  console.log('日期:', date.display);
  console.log('='.repeat(60));
  console.log('');

  const coverBuffer = await generateCover();

  const article = {
    title: '🍷 选对第一瓶酒：葡萄酒新手完全避坑指南',
    author: '红酒顾问',
    digest: '第一次买葡萄酒不知道怎么选？这篇指南帮你避开常见陷阱，选到适合自己的第一瓶酒。',
    content: `<section style="margin-bottom:20px"><p style="color:#999;text-align:center">${date.full} | 葡萄酒入门系列 | 红酒顾问</p></section>

<section style="background:linear-gradient(135deg,#2d1424,#4a1a2e);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#f5e6d3;font-size:16px;line-height:1.9">
第一次走进酒窖或超市酒区，看着琳琅满目的酒瓶，是不是感到无从下手？别担心，这篇指南将帮你<strong style="color:#d4af37">避开常见陷阱</strong>，选到<strong style="color:#d4af37">适合自己的第一瓶酒</strong>。
</p>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">❓ 一、新手最常问的5个问题</h2>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:15px"><strong>❓ 问题1：红酒和葡萄酒有什么区别？</strong><br/><span style="color:#666">答：红酒是葡萄酒的一种。葡萄酒分为红葡萄酒（红酒）、白葡萄酒（白酒）、桃红葡萄酒和起泡酒。</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:15px"><strong>❓ 问题2：一定要醒酒吗？</strong><br/><span style="color:#666">答：不一定。年轻、单宁重的红酒需要醒酒（30分钟-2小时）。白酒和起泡酒通常不需要醒酒。</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:15px"><strong>❓ 问题3：年份越老越好吗？</strong><br/><span style="color:#666">答：不是。90%以上的葡萄酒适合在1-3年内饮用。只有少数顶级酒款适合陈年10年以上。</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:15px"><strong>❓ 问题4：螺旋盖=低品质？</strong><br/><span style="color:#666">答：错误观念。很多优质酒款使用螺旋盖，更利于保存，且避免了软木塞污染问题。</span></p>
<p style="color:#333;line-height:1.8"><strong>❓ 问题5：为什么有的酒有"汽油味"？</strong><br/><span style="color:#666">答：这是雷司令的典型特征，来自TDN化合物，是陈年雷司令的魅力所在。</span></p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🛒 二、选酒三步法</h2>
<section style="background:#e8f5e9;padding:18px;border-radius:8px">
<p style="color:#2e7d32;font-weight:bold;margin-bottom:12px">🎯 30秒快速选酒法</p>
<p style="color:#333;line-height:1.8;margin-bottom:12px"><strong>第1步：看场合</strong><br/><span style="color:#666">• 自己喝：选口感柔和、易饮的酒款</span><br/><span style="color:#666">• 送礼：选包装精美、品牌知名的酒款</span><br/><span style="color:#666">• 聚餐：选性价比高、大家都喜欢的酒款</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:12px"><strong>第2步：看预算</strong><br/><span style="color:#666">• 100元以下：新世界入门款（智利、澳洲）</span><br/><span style="color:#666">• 100-300元：优质新世界/旧世界入门</span><br/><span style="color:#666">• 300-800元：旧世界经典产区</span></p>
<p style="color:#333;line-height:1.8"><strong>第3步：看评分</strong><br/><span style="color:#666">• WS/JS 90分以上：品质有保障</span><br/><span style="color:#666">• 注意：评分仅供参考，口感因人而异</span></p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🍷 三、10款入门酒推荐</h2>
<section style="background:#faf8f5;padding:18px;border-radius:8px;margin-bottom:12px">
<p style="color:#c41e3a;font-weight:bold;margin-bottom:12px">🔴 红酒推荐（5款）</p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>1. Concha y Toro Casillero del Diablo 赤霞珠</strong><br/><span style="color:#666">价格：约80元 | 智利 | 果味浓郁，单宁柔和，新手首选</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>2. Yellow Tail 西拉</strong><br/><span style="color:#666">价格：约90元 | 澳洲 | 浓郁饱满，性价比之王</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>3. Louis Jadot 勃艮第村庄级</strong><br/><span style="color:#666">价格：约250元 | 法国 | 黑皮诺入门经典</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>4. Muga Rioja Reserva</strong><br/><span style="color:#666">价格：约280元 | 西班牙 | WS年度最佳性价比</span></p>
<p style="color:#333;line-height:1.8"><strong>5. Penfolds Bin 28 Kalimna Shiraz</strong><br/><span style="color:#666">价格：约350元 | 澳洲 | 澳洲经典，适合送礼</span></p>
</section>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#f5e6d3;font-weight:bold;margin-bottom:12px;background:#2d1424;padding:8px 12px;border-radius:4px;display:inline-block">🥂 白酒/起泡酒推荐（5款）</p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>6. Cloudy Bay 长相思</strong><br/><span style="color:#666">价格：约200元 | 新西兰 | 清新酸爽，海鲜绝配</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>7. Kim Crawford 长相思</strong><br/><span style="color:#666">价格：约120元 | 新西兰 | 性价比超高，百搭款</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>8. La Rioja Alta Viña Alberdi Reserva 白</strong><br/><span style="color:#666">价格：约180元 | 西班牙 | 饱满圆润，搭配白肉</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>9. Mionetto Prosecco</strong><br/><span style="color:#666">价格：约100元 | 意大利 | 清爽气泡，性价比之王</span></p>
<p style="color:#333;line-height:1.8"><strong>10. Moët & Chandon Impérial</strong><br/><span style="color:#666">价格：约350元 | 法国香槟 | 入门香槟经典</span></p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">⚠️ 四、新手常见陷阱</h2>
<section style="background:#fff5f5;padding:18px;border-radius:8px">
<p style="color:#c41e3a;font-weight:bold;margin-bottom:12px">🚫 这些坑不要踩！</p>
<p style="color:#333;line-height:1.8;margin-bottom:12px"><strong>陷阱1：只看包装和酒标设计</strong><br/><span style="color:#666">很多高端酒的包装反而很朴素，不要被花哨的酒标迷惑。</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:12px"><strong>陷阱2：认为越贵越好</strong><br/><span style="color:#666">200-500元区间有很多高性价比酒款，太贵的酒需要专业知识判断。</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:12px"><strong>陷阱3：只买法国酒</strong><br/><span style="color:#666">新世界（智利、澳洲、新西兰）有很多优质酒款，性价比更高。</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:12px"><strong>陷阱4：忽略侍酒温度</strong><br/><span style="color:#666">红酒太热会显酒精感，白酒太冰会失去风味。红酒16-18°C，白酒8-10°C最佳。</span></p>
<p style="color:#333;line-height:1.8"><strong>陷阱5：开瓶后放太久</strong><br/><span style="color:#666">开瓶后3-5天内喝完。可用真空塞延长保存，但风味会逐渐下降。</span></p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">🍽️ 五、第一次配餐建议</h2>
<section style="background:#fff3e0;padding:18px;border-radius:8px">
<p style="color:#e65100;font-weight:bold;margin-bottom:12px">🥘 最简单的配餐公式</p>
<p style="color:#333;line-height:1.8"><strong>公式1：红配红，白配白</strong><br/><span style="color:#666">• 红酒 + 红烧肉/牛排/烤肉</span><br/><span style="color:#666">• 白酒 + 清蒸鱼/海鲜/沙拉</span></p>
<p style="color:#333;line-height:1.8;margin-top:12px"><strong>公式2：当不知道配什么时</strong><br/><span style="color:#666">• 起泡酒/香槟 = 万能搭配</span><br/><span style="color:#666">• 勃艮第黑皮诺 = 几乎百搭</span><br/><span style="color:#666">• 新西兰长相思 = 清爽百搭</span></p>
</section>
</section>

<section style="margin-bottom:28px">
<h2 style="color:#2d1424;font-size:20px;border-left:4px solid #8b2252;padding-left:12px;margin-bottom:18px">📱 六、实用工具推荐</h2>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8"><strong>🍷 Vivino</strong> - 扫一扫酒标，查看评分和价格<br/><strong>🍷 CellarTracker</strong> - 记录你的酒窖和品酒笔记<br/><strong>🍷 Wine-Searcher</strong> - 比价工具，找到最优惠价格<br/><strong>🍷 Decanter</strong> - 专业评分和产区资讯</p>
</section>
</section>

<section style="background:linear-gradient(135deg,#2d1424,#4a1a2e);padding:22px;border-radius:10px;text-align:center">
<p style="color:#d4af37;font-size:14px;font-weight:bold;margin-bottom:8px">🍷 结语</p>
<p style="color:#f5e6d3;font-size:14px;line-height:1.8;margin:0">选对第一瓶酒并不难，记住：场合→预算→评分。从10款推荐中选一款，配上合适的菜肴，享受葡萄酒带来的乐趣！</p>
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
