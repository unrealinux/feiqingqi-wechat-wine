/**
 * 葡萄酒入门文章 - 酒标解读篇
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
 * 使用 baoyu-imagine + DashScope 生成写实酒标封面
 */
async function generateCoverWithAI() {
  console.log('🎨 使用 baoyu-imagine + DashScope 生成写实酒标封面...');
  
  const coverPath = path.join(__dirname, 'output', 'label_cover_real.png');
  const prompt = 'Photorealistic close-up of wine bottle labels, professional product photography, various French wine bottles with detailed labels showing Chateau names, Appellation descriptions, vintage years, macro lens, studio lighting, dark background with bokeh, 8K ultra-detailed';
  
  try {
    const scriptPath = 'C:\\Users\\Administrator\\.config\\opencode\\skills\\baoyu-skills\\skills\\baoyu-imagine\\scripts\\main.ts';
    const cmd = `npx -y bun "${scriptPath}" --prompt "${prompt}" --image "${coverPath}" --provider dashscope --model qwen-image-2.0-pro --size 1920x1080`;
    
    console.log('   调用 baoyu-imagine...');
    const { stdout, stderr } = await execPromise(cmd, { timeout: 180000 });
    
    if (stdout.includes('cover.png') || stdout.includes('label_cover_real.png') || fs.existsSync(coverPath)) {
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
        <text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🍷 读懂酒标</text>
        
        <!-- 副标题 -->
        <text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">产区·年份·等级·品种·解读技巧</text>
        
        <!-- 日期 -->
        <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text>
      </svg>`;
      
      const textBuffer = Buffer.from(svg);
      const finalBuffer = await sharp(resizedBuffer)
        .composite([{ input: textBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer();
      
      // 保存文件
      const outputPath = path.join(__dirname, 'output', 'label_cover_ai.png');
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
  const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#2d1424"/>
        <stop offset="50%" style="stop-color:#4a1a2e"/>
        <stop offset="100%" style="stop-color:#6b2a3a"/>
      </linearGradient>
    </defs>
    <rect width="900" height="383" fill="url(#g)"/>
    <rect x="0" y="240" width="900" height="143" fill="rgba(0,0,0,0.6)"/>
    <text x="30" y="295" font-family="Microsoft YaHei" font-size="30" font-weight="bold" fill="#D4AF37">🍷 读懂酒标：5分钟成为选酒高手</text>
    <text x="30" y="340" font-family="Microsoft YaHei" font-size="16" fill="rgba(255,255,255,0.9)">产区·年份·等级·品种·解读技巧</text>
    <text x="870" y="370" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text>
  </svg>`;
  
  return sharp(Buffer.from(svg)).png().toBuffer();
}

/**
 * 生成酒标解读文章内容
 */
function generateContent() {
  return `
<style>
  .box { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #2d1424; }
  .label-part { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin: 10px 0; }
  .label-part h4 { color: #2d1424; margin: 0 0 8px 0; font-size: 16px; }
  h3 { color: #2d1424; border-bottom: 2px solid #2d1424; padding-bottom: 8px; margin-top: 25px; }
</style>

<h2 style="text-align: center; color: #2d1424;">🍷 ${date.chinese} 读懂酒标：5分钟成为选酒高手</h2>
<p style="text-align: center; color: #666;">产区·年份·等级·品种·解读技巧</p>

<section style="background:linear-gradient(135deg,#2d1424,#4a1a2e);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#f5e6d3;font-size:16px;line-height:1.9">酒标是葡萄酒的<strong style="color:#d4af37">身份证</strong>，它告诉你这款酒来自哪里、什么年份、什么等级。学会解读酒标，你就能<strong style="color:#d4af37">5分钟内判断一款酒的品质和价值</strong>。</p>
</section>

<h3>📖 一、酒标的基本结构</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:12px">酒标分为<strong>正标</strong>（Front Label）和<strong>背标</strong>（Back Label）。正标显示核心信息，背标显示详细说明。</p>
<p style="color:#8b2252;font-weight:bold;margin-bottom:12px">正标必须包含的信息：</p>
<p style="color:#333;line-height:2"><strong>1. 酒庄/品牌名称</strong> - 谁生产的<br/>
<strong>2. 产区/AOC</strong> - 来自哪里<br/>
<strong>3. 年份</strong> - 葡萄采收年份<br/>
<strong>4. 酒精度</strong> - ABV百分比<br/>
<strong>5. 容量</strong> - 750ml等</p>
<p style="color:#8b2252;font-weight:bold;margin-top:15px;margin-bottom:12px">背标可能包含：</p>
<p style="color:#333;line-height:2">• 品种信息（旧世界酒标通常不写）<br/>
• 品鉴笔记<br/>
• 食物搭配建议<br/>
• 进口商信息</p>
</section>

<h3>🌍 二、读懂产区信息</h3>
<section style="background:#e8f5e9;padding:18px;border-radius:8px">
<p style="color:#2e7d32;font-weight:bold;margin-bottom:15px">🇫🇷 法国酒标</p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>• Appellation d'Origine Protégée (AOP)</strong><br/>
<span style="color:#666">= 原产地保护，最高级别</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>• Bordeaux / Bourgogne / Champagne</strong><br/>
<span style="color:#666">= 产区名称，越具体越好</span></p>
<p style="color:#333;line-height:1.8"><strong>• Premier Cru / Grand Cru</strong><br/>
<span style="color:#666">= 一级园/特级园，顶级地块</span></p>
</section>

<section style="background:#e8f5e9;padding:18px;border-radius:8px;margin-top:12px">
<p style="color:#2e7d32;font-weight:bold;margin-bottom:15px">🇮🇹 意大利酒标</p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>• Denominazione di Origine Controllata (DOC)</strong><br/>
<span style="color:#666">= 法定产区，类似法国AOC</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>• Denominazione di Origine Controllata e Garantita (DOCG)</strong><br/>
<span style="color:#666">= 最高级别，有保障</span></p>
<p style="color:#333;line-height:1.8"><strong>• Chianti Classico / Brunello di Montalcino</strong><br/>
<span style="color:#666">= 具体产区名称</span></p>
</section>

<h3>📅 三、年份的含义</h3>
<section style="background:#fff3e0;padding:18px;border-radius:8px">
<p style="color:#e65100;font-weight:bold;margin-bottom:12px">📆 年份 = 葡萄采收年份</p>
<p style="color:#333;line-height:1.8;margin-bottom:12px">年份指的是葡萄采收的年份，不是装瓶或发售年份。例如"2019年份"意味着葡萄在2019年采收。</p>
<p style="color:#333;line-height:1.8;margin-bottom:12px"><strong>年份重要吗？</strong><br/>
<span style="color:#666">• 旧世界（法国、意大利）：非常重要，年份差异大</span><br/>
<span style="color:#666">• 新世界（美国、澳洲）：相对不那么重要</span></p>
<p style="color:#666;font-size:14px;line-height:1.8">💡 无年份酒标写着"NV"（Non-Vintage），是多个年份的混合，品质稳定。</p>
</section>

<h3>🏷 四、等级信息解读</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:12px"><strong>法国分级（从低到高）：</strong><br/>
<span style="color:#666">• VdF（Vin de France）- 日常餐酒</span><br/>
<span style="color:#666">• IGP（Indication Géographique Protégée）- 地区餐酒</span><br/>
<span style="color:#666">• AOC（Appellation d'Origine Contrôlée）- 法定产区</span><br/>
<span style="color:#666">• Cru Classé - 列级庄（如1855分级）</span></p>
<p style="color:#333;line-height:1.8"><strong>意大利分级：</strong><br/>
<span style="color:#666">• DOCG（最高）- 保证法定产区</span><br/>
<span style="color:#666">• DOC - 法定产区</span><br/>
<span style="color:#666">• IGT - 地区餐酒（如超级托斯卡纳）</span></p>
</section>

<h3>🍇 五、品种信息解读</h3>
<section style="background:#e3f2fd;padding:18px;border-radius:8px">
<p style="color:#1565c0;font-weight:bold;margin-bottom:15px">新世界 vs 旧世界</p>
<p style="color:#333;line-height:1.8;margin-bottom:12px"><strong>新世界酒标（美国、澳洲、智利）</strong><br/>
<span style="color:#666">• 会写明葡萄品种（Cabernet Sauvignon、Chardonnay等）</span><br/>
<span style="color:#666">• 单一品种酒标注"100%赤霞珠"</span><br/>
<span style="color:#666">• 混酿标注各品种比例</span></p>
<p style="color:#333;line-height:1.8"><strong>旧世界酒标（法国、意大利）</strong><br/>
<span style="color:#666">• 通常不写品种，因为产区已经暗示了</span><br/>
<span style="color:#666">• Bordeaux = 赤霞珠+梅洛为主</span><br/>
<span style="color:#666">• Chianti = 桑娇维塞为主</span></p>
</section>

<h3>🔍 六、酒标术语速查</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<table style="width:100%;border-collapse:collapse">
<tr style="background:#2d1424;color:white">
<td style="padding:10px;font-weight:bold">术语</td>
<td style="padding:10px;font-weight:bold">含义</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>Reserve / Riserva</strong></td>
<td style="padding:10px;color:#666">珍藏级，通常经过更长时间陈年</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>Old Vines / Vieilles Vignes</strong></td>
<td style="padding:10px;color:#666">老藤，通常品质更高</td>
</tr>
<tr style="border-bottom:1px solid #ddd">
<td style="padding:10px;color:#333"><strong>Grand Vin</strong></td>
<td style="padding:10px;color:#666">正牌酒，酒庄的旗舰产品</td>
</tr>
<tr style="border-bottom:1px solid #ddd;background:#f9f9f9">
<td style="padding:10px;color:#333"><strong>Second Vin / Second Label</strong></td>
<td style="padding:10px;color:#666">副牌酒，正牌之外的第二款酒</td>
</tr>
<tr>
<td style="padding:10px;color:#333"><strong>Mis en Bouteille au Château</strong></td>
<td style="padding:10px;color:#666">酒庄装瓶，品质更有保障</td>
</tr>
</table>
</section>

<h3>💡 七、选购实战技巧</h3>
<section style="background:#fffde7;padding:18px;border-radius:8px">
<p style="color:#f57f17;font-weight:bold;margin-bottom:15px">🛒 三秒识酒法</p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>1. 看产区</strong><br/>
<span style="color:#666">波尔多左岸看"Pauillac"、"Saint-Julien"；勃艮第看"Grand Cru"、"Premier Cru"。</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>2. 看年份</strong><br/>
<span style="color:#666">波尔多优选2010、2015、2016；勃艮第优选2012、2015、2017。</span></p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>3. 看酒精度</strong><br/>
<span style="color:#666">12.5%-13.5%为正常；过高（>14.5%）可能来自炎热产区或过度成熟。</span></p>
<p style="color:#333;line-height:1.8"><strong>4. 看装瓶信息</strong><br/>
<span style="color:#666">认准"Mis en Bouteille au Château/Domaine"，避免散装酒。</span></p>
</section>

<section style="background:linear-gradient(135deg,#2d1424,#4a1a2e);padding:22px;border-radius:10px;text-align:center">
<p style="color:#FFD740;font-size:14px;font-weight:bold;margin-bottom:8px">🍷 结语</p>
<p style="color:#f5e6d3;font-size:14px;line-height:1.8;margin:0">酒标是通往品质的钥匙。从产区到等级，从年份到酒庄，每一个细节都值得关注。下次选购时，你已是半个专家。</p>
<p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display}<br/>关注我们，每天学习红酒知识</p>
</section>`;
}

/**
 * 主函数：生成文章并发布到微信草稿箱
 */
async function main() {
  console.log('='.repeat(60));
  console.log('🍷 生成葡萄酒入门文章（酒标解读篇）');
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
    title: `🍷 ${date.chinese} 读懂酒标：5分钟成为选酒高手`,
    author: '红酒顾问',
    digest: '酒标是葡萄酒的身份证，掌握解读技巧，你就能从酒标上读出产区、年份、等级、品种等关键信息。',
    content: content
  };
  console.log('   标题:', article.title);
  console.log('   摘要:', article.digest);
  console.log('');

  // 3. 保存到本地
  const outputPath = path.join(__dirname, 'output', `label_${date.full.replace(/-/g, '')}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(article, null, 2));
  console.log('📁 文章已保存:', outputPath);
  console.log('');

  // 4. 发布到微信公众号草稿箱
  console.log('📤 尝试发布到微信公众号草稿箱...');
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
    const coverPath = path.join(__dirname, 'output', 'label_cover_ai.png');
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
    console.log('💡 提示: 封面已生成为 output/label_cover_ai.png');
    console.log('💡 文章已保存为:', outputPath);
  }
}

main();
