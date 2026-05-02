/**
 * 红酒配餐完全指南文章生成器
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
 * 使用 baoyu-imagine + DashScope 生成写实配餐封面
 */
async function generateCoverWithAI() {
  console.log('🎨 使用 baoyu-imagine + DashScope 生成写实配餐封面...');
  
  const coverPath = path.join(__dirname, 'output', 'pairing_cover_real.png');
  const prompt = 'Photorealistic food photography, elegant wine glass with red wine paired with grilled steak, dark restaurant table, warm candlelight, bokeh background with wine bottles, professional culinary photography, 8K, ultra-detailed, gourmet magazine style';
  
  try {
    const scriptPath = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
    const cmd = `npx -y bun "${scriptPath}" --prompt "${prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`;
    
    console.log('   调用 baoyu-imagine...');
    const { stdout, stderr } = await execPromise(cmd, { timeout: 180000 });
    
    if (stdout.includes('cover.png') || stdout.includes('pairing_cover_real.png') || fs.existsSync(coverPath)) {
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
            <stop offset="0%" style="stop-color:#D4AF37"/>
            <stop offset="100%" style="stop-color:#F4E4BC"/>
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.7"/>
          </filter>
        </defs>
        
        <!-- 底部半透明遮罩 -->
        <rect x="0" y="230" width="900" height="153" fill="rgba(0,0,0,0.7)"/>
        
        <!-- 主标题 -->
        <text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🍷 红酒配餐指南</text>
        
        <!-- 副标题 -->
        <text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">从牛排到海鲜 · 完美搭配法则</text>
        
        <!-- 日期 -->
        <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text>
      </svg>`;
      
      const textBuffer = Buffer.from(svg);
      const finalBuffer = await sharp(resizedBuffer)
        .composite([{ input: textBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer();
      
      // 保存文件
      const outputPath = path.join(__dirname, 'output', 'pairing_cover_ai.png');
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
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#4a0e2e"/>
      <stop offset="100%" style="stop-color:#722F37"/>
    </linearGradient>
    <linearGradient id="wineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8B0000"/>
      <stop offset="100%" style="stop-color:#A52A2A"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="4" dy="4" stdDeviation="6" flood-opacity="0.5"/>
    </filter>
  </defs>
  <rect width="900" height="383" fill="url(#bgGrad)"/>
  <g transform="translate(350, 60)">
    <path d="M30,300 Q50,50 80,50 Q110,50 130,300 Z" fill="url(#wineGrad)" filter="url(#shadow)" opacity="0.9"/>
    <ellipse cx="80" cy="300" rx="50" ry="10" fill="#8B0000" opacity="0.8"/>
    <rect x="75" y="25" width="10" height="25" fill="#8B0000" opacity="0.9"/>
    <path d="M55,40 Q80,20 105,40" fill="none" stroke="#A52A2A" stroke-width="3"/>
  </g>
  <g transform="translate(500, 150)">
    <rect x="0" y="0" width="200" height="100" rx="6" fill="#ffd700" opacity="0.95"/>
    <rect x="0" y="0" width="200" height="100" rx="6" fill="none" stroke="#d4af37" stroke-width="2"/>
    <text x="100" y="35" font-family="Microsoft YaHei, sans-serif" font-size="32" font-weight="bold" fill="#4a0e2e" text-anchor="middle">配餐</text>
    <text x="100" y="70" font-family="Microsoft YaHei, sans-serif" font-size="18" fill="#4a0e2e" text-anchor="middle">完全指南</text>
    <line x1="30" y1="40" x2="170" y2="40" stroke="#d4af37" stroke-width="2"/>
  </g>
  <rect x="0" y="323" width="900" height="60" fill="#2a0a1a" opacity="0.95"/>
  <g transform="translate(30, 345)">
    <text x="0" y="0" font-family="Microsoft YaHei, sans-serif" font-size="26" font-weight="bold" fill="#d4af37">🍷 ${date.display} 红酒配餐指南</text>
    <text x="0" y="30" font-family="Microsoft YaHei, sans-serif" font-size="15" fill="rgba(255,255,255,0.85)">从牛排到海鲜 · 完美搭配法则</text>
  </g>
  <g fill="rgba(255,255,255,0.08)">
    <circle cx="100" cy="50" r="30"/>
    <circle cx="800" cy="330" r="20"/>
    <circle cx="150" cy="320" r="15"/>
  </g>
</svg>`;
  const buffer = sharp(Buffer.from(svg)).png().toBuffer();
  const outputPath = path.join(__dirname, 'output', 'pairing_cover_ai.png');
  fs.writeFileSync(outputPath, buffer);
  console.log('📁 SVG 封面已保存:', outputPath);
  return buffer;
}

/**
 * 生成红酒配餐文章内容
 */
function generateContent() {
  return `
<style>
  .box { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #722F37; }
  .pairing-item { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }
  .pairing-item h4 { color: #722F37; margin: 0 0 8px 0; font-size: 16px; }
  h3 { color: #722F37; border-bottom: 2px solid #722F37; padding-bottom: 8px; margin-top: 25px; }
</style>

<h2 style="text-align: center; color: #722F37;">🍷 ${date.chinese} 红酒配餐完全指南</h2>
<p style="text-align: center; color: #666;">从牛排到海鲜 · 完美搭配法则</p>

<section style="background:linear-gradient(135deg,#4a0e2e,#722F37);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#fce4ec;font-size:16px;line-height:1.9">"红酒配餐"不仅是味觉的享受，更是<strong style="color:#ffd740">科学与艺术的结合</strong>。选对配餐，能让红酒的果香、单宁、酸度与食物完美融合，互相提升。</p>
</section>

<h3>🥩 一、经典红肉搭配</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">

<div class="pairing-item">
<h4>🥩 牛排（Steak）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>🍷 推荐酒款：</strong>赤霞珠（Cabernet Sauvignon）、波尔多左岸、美国纳帕谷<br/>
<strong>💡 为什么搭：</strong>高单宁切割肉类脂肪，酸度去腻，酒体饱满匹配牛排的厚重<br/>
<strong>💎 推荐年份：</strong>波尔多2010/2015/2016，纳帕谷2013/2016</p>
</div>

<div class="pairing-item">
<h4>🍖 羊排（Lamb Chops）</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>🍷 推荐酒款：</strong>波尔多右岸（梅洛为主）、西拉（Syrah/Shiraz）、罗纳河谷<br/>
<strong>💡 为什么搭：</strong>羊肉的膻味需要强劲酒体，西拉的黑胡椒味与羊肉绝配<br/>
<strong>💎 推荐年份：</strong>罗纳河谷2015/2016/2017</p>
</div>

<div class="pairing-item">
<h4>🍗 烤鸭/红烧肉</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>🍷 推荐酒款：</strong>黑皮诺（Pinot Noir）、勃艮第、新西兰中奥塔哥<br/>
<strong>💡 为什么搭：</strong>丝滑单宁搭配肥美口感，红果香气与鸭肉相得益彰<br/>
<strong>💎 推荐年份：</strong>勃艮第2012/2015/2017</p>
</div>

</section>

<h3>🐟 二、禽类与猪肉搭配</h3>
<section style="background:#fff3e0;padding:18px;border-radius:8px">

<div class="pairing-item">
<h4>🐔 烤鸡/炖鸡</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>🍷 推荐酒款：</strong>佳美（Gamay）、勃艮第大区级、意大利基安蒂（Chianti）<br/>
<strong>💡 为什么搭：</strong>轻盈酒体不压过鸡肉清淡，高酸度提升鲜味<br/>
<strong>💎 推荐年份：</strong>博若莱新酒（当年）、基安蒂2015/2016</p>
</div>

<div class="pairing-item">
<h4>🐷 猪肉料理</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>🍷 推荐酒款：</strong>歌海娜（Grenache）、罗纳河谷、西班牙里奥哈（Rioja）<br/>
<strong>💡 为什么搭：</strong>果味丰富的红酒搭配甜味酱汁，单宁柔和不会喧宾夺主<br/>
<strong>💎 推荐年份：</strong>里奥哈2010/2015，罗纳河谷2016/2017</p>
</div>

</section>

<h3>🐟 三、海鲜与白肉搭配</h3>
<section style="background:#e3f2fd;padding:18px;border-radius:8px">

<div class="pairing-item">
<h4>🦞 生蚝/海鲜</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>🍸 推荐酒款：</strong>霞多丽（Chardonnay）、香槟（Champagne）、长相思（Sauvignon Blanc）<br/>
<strong>💡 为什么搭：</strong>高酸度去腥提鲜，矿物感与生蚝是绝配，气泡酒清洁味蕾<br/>
<strong>💎 推荐年份：</strong>勃艮第霞多丽2017/2018/2019</p>
</div>

<div class="pairing-item">
<h4>🐟 三文鱼/金枪鱼</h4>
<p style="color:#333;line-height:1.8;margin:0"><strong>🍷 推荐酒款：</strong>黑皮诺（Pinot Noir）、桃红葡萄酒（Rosé）<br/>
<strong>💡 为什么搭：</strong>轻盈酒体匹配鱼肉细腻，红果香不压过鱼鲜<br/>
<strong>💎 推荐年份：</strong>俄勒冈/新西兰黑皮诺2016/2017/2018</p>
</div>

</section>

<h3>🧀 四、奶酪搭配指南</h3>
<section style="background:#f1f8e9;padding:18px;border-radius:8px">

<table style="width:100%;border-collapse:collapse">
<tr style="background:#722F37;color:white">
<td style="padding:10px;font-weight:bold">奶酪类型</td>
<td style="padding:10px;font-weight:bold">推荐红酒</td>
<td style="padding:10px;font-weight:bold">原因</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>布里（Brie）</strong></td>
<td style="padding:10px;color:#666">勃艮第白葡萄酒</td>
<td style="padding:10px;color:#666">奶油质感互补，酸度平衡</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>切达（Cheddar）</strong></td>
<td style="padding:10px;color:#666">赤霞珠、波尔多</td>
<td style="padding:10px;color:#666">强劲单宁切割奶酪脂肪</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>蓝纹奶酪（Blue Cheese）</strong></td>
<td style="padding:10px;color:#666">波特酒（Port）、西拉</td>
<td style="padding:10px;color:#666">甜度/果味平衡蓝纹的强烈风味</td>
</tr>
<tr style="background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>山羊奶酪（Goat Cheese）</strong></td>
<td style="padding:10px;color:#666">长相思、勃艮第白</td>
<td style="padding:10px;color:#666">酸度匹配，草本香气呼应</td>
</tr>
</table>
</section>

<h3>🍰 五、中式菜肴搭配</h3>
<section style="background:#fffde7;padding:18px;border-radius:8px">
<p style="color:#f57f17;font-weight:bold;margin-bottom:15px">🥢 中餐配酒技巧</p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>🥘 红烧类（红烧肉、红烧鱼）</strong><br/>
<span style="color:#666">• 推荐：黑皮诺、梅洛（单宁柔和，不压菜味）</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>🍲 川湘菜（麻辣火锅、水煮鱼）</strong><br/>
<span style="color:#666">• 推荐：半甜型雷司令（Riesling）、桃红（辣味配甜度，气泡解辣）</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>🥗 粤菜（清蒸鱼、白切鸡）</strong><br/>
<span style="color:#666">• 推荐：霞多丽、长相思（轻盈酸度，不抢食材鲜味）</span></p>

<p style="color:#333;line-height:1.8"><strong>🥟 烤鸭/烤肉</strong><br/>
<span style="color:#666">• 推荐：赤霞珠、波尔多左岸（强劲单宁切割油脂）</span></p>
</section>

<h3>💡 六、黄金搭配法则</h3>
<section style="background:#f0fff0;padding:18px;border-radius:8px">
<p style="color:#155724;font-weight:bold;margin-bottom:15px">🛠️ 万能公式</p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>1. 重口味配重酒体</strong><br/>
<span style="color:#666">高单宁红酒配高脂肪、高蛋白肉类（牛排、羊排）</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>2. 轻口味配轻酒体</strong><br/>
<span style="color:#666">轻盈红酒或白葡萄酒配海鲜、禽类、清淡料理</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>3. 当地酒配当地菜</strong><br/>
<span style="color:#666">意大利酒配意餐，法国酒配法餐，这是经过百年验证的组合</span></p>

<p style="color:#333;line-height:1.8"><strong>4. 酸度是万能钥匙</strong><br/>
<span style="color:#666">高酸度的酒能提升食物鲜味，去腻解腥，是配餐的核心</span></p>
</section>

<h3>❌ 七、常见搭配误区</h3>
<section style="background:#ffebee;padding:18px;border-radius:8px">
<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区1：好酒一定要配大餐</strong><br/>
<span style="color:#666">事实上，一款简单的博若莱新酒配烤鸡更合适，不要让酒压过菜。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区2：白葡萄酒只能配海鲜</strong><br/>
<span style="color:#666">饱满的霞多丽、过桶的维欧尼可以完美搭配奶油酱汁的鸡肉。</span></p>

<p style="color:#c62828;line-height:1.8;margin-bottom:10px">❌ <strong>误区3：单宁越高越好</strong><br/>
<span style="color:#666">过高的单宁遇到辣味会变得更涩，配中餐时选单宁柔和的酒。</span></p>

<p style="color:#c62828;line-height:1.8"><strong>❌ 误区4：甜酒只能配甜点</strong><br/>
<span style="color:#666">苏玳贵腐、托卡伊可以搭配肥鹅肝，咸甜对比是顶级享受。</span></p>
</section>

<section style="background:linear-gradient(135deg,#4a0e2e,#722F37);padding:22px;border-radius:10px;text-align:center">
<p style="color:#ffd740;font-size:14px;font-weight:bold;margin-bottom:8px">🍷 结语</p>
<p style="color:#fce4ec;font-size:14px;line-height:1.8;margin:0">配餐没有绝对的对错，只有个人喜好。记住"当地酒配当地菜"的黄金法则，大胆尝试，你会发现更多惊喜。</p>
<p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display}<br/>关注我们，每天学习红酒知识</p>
</section>`;
}

/**
 * 主函数：生成文章并发布到微信草稿箱
 */
async function main() {
  console.log('='.repeat(60));
  console.log('🍷 生成红酒配餐完全指南');
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
    title: `🍷 ${date.chinese} 红酒配餐完全指南：从牛排到海鲜`,
    author: '红酒顾问',
    digest: '红酒配餐不仅是味觉享受，更是科学与艺术的结合。本文详解红肉、禽类、海鲜、奶酪的搭配法则，以及中式菜肴配酒技巧。',
    content: content
  };
  console.log('   标题:', article.title);
  console.log('   摘要:', article.digest);
  console.log('');

  // 3. 保存到本地
  const outputPath = path.join(__dirname, 'output', `pairing_${date.full.replace(/-/g, '')}.json`);
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
    const coverPath = path.join(__dirname, 'output', 'pairing_cover_ai.png');
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
    console.log('💡 提示: 封面已生成为 output/pairing_cover_ai.png');
    console.log('💡 文章已保存为:', outputPath);
  }
}

main();
