/**
 * 波尔多产区巡礼文章生成器
 * 使用 DashScope 生成写实封面，发布到微信公众号草稿箱
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
  chinese: `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`
};

/**
 * 使用 DashScope 生成写实波尔多封面
 */
async function generateCoverWithDashScope() {
  console.log('🎨 使用 DashScope 生成写实波尔多封面...');
  
  const apiKey = process.env.DASHSCOPE_API_KEY;
  if (!apiKey) {
    console.log('   ⚠️ 未配置 DASHSCOPE_API_KEY，使用本地封面');
    return generateLocalCover();
  }

  try {
    // DashScope 文生图 API
    const response = await fetch(
      'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'X-DashScope-Async': 'enable'
        },
        body: JSON.stringify({
          model: 'wanx-v1',
          input: {
            prompt: 'Photorealistic view of Bordeaux vineyard at sunset, rows of Merlot and Cabernet Franc grapes, historic French chateau with stone architecture, golden hour lighting, professional landscape photography, Canon EOS R5, 35mm lens, ultra detailed, 8K quality',
            negative_prompt: 'cartoon, illustration, painting, blurry, low quality, text, watermark, modern buildings, people'
          },
          parameters: {
            style: 'realistic',
            size: '1280*720',
            n: 1
          }
        })
      }
    );

    const data = await response.json();
    
    if (data.output && data.output.task_id) {
      const taskId = data.output.task_id;
      console.log('   任务ID:', taskId);
      
      // 轮询任务状态
      for (let i = 0; i < 30; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const statusResp = await fetch(
          `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`,
          {
            headers: { 'Authorization': `Bearer ${apiKey}` }
          }
        );
        
        const statusData = await statusResp.json();
        
        if (statusData.output && statusData.output.task_status === 'SUCCEEDED') {
          const imageUrl = statusData.output.results?.[0]?.url;
          if (imageUrl) {
            console.log('   ✅ AI图片生成成功');
            
            // 下载图片
            const imgResp = await fetch(imageUrl);
            const imgBuffer = await imgResp.arrayBuffer();
            const rawImage = Buffer.from(imgBuffer);
            
            // 裁剪为微信封面尺寸 900x383
            const croppedBuffer = await sharp(rawImage)
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
              <text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🍷 波尔多产区巡礼</text>
              
              <!-- 副标题 -->
              <text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="16" fill="rgba(255,255,255,0.9)">左岸vs右岸 · 五大名庄 · 1855分级</text>
              
              <!-- 日期 -->
              <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text>
            </svg>`;
            
            const textBuffer = Buffer.from(svg);
            const finalBuffer = await sharp(croppedBuffer)
              .composite([{ input: textBuffer, top: 0, left: 0 }])
              .png()
              .toBuffer();
            
            // 保存文件
            const outputPath = path.join(__dirname, 'output', 'bordeaux_cover_ai.png');
            fs.writeFileSync(outputPath, finalBuffer);
            console.log('   📁 封面已保存:', outputPath);
            
            return finalBuffer;
          }
        }
        
        if (statusData.output && statusData.output.task_status === 'FAILED') {
          throw new Error('DashScope 图片生成失败');
        }
      }
    }
    
    throw new Error('生成超时或失败');
    
  } catch (err) {
    console.warn('   ⚠️ DashScope 生成失败:', err.message);
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
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#1a237e"/>
        <stop offset="50%" style="stop-color:#283593"/>
        <stop offset="100%" style="stop-color:#3949ab"/>
      </linearGradient>
    </defs>
    <rect width="900" height="383" fill="url(#g)"/>
    <rect x="0" y="230" width="900" height="153" fill="rgba(0,0,0,0.6)"/>
    <text x="30" y="290" font-family="Microsoft YaHei" font-size="34" font-weight="bold" fill="#D4AF37">🍷 波尔多产区巡礼</text>
    <text x="30" y="335" font-family="Microsoft YaHei" font-size="16" fill="rgba(255,255,255,0.9)">左岸vs右岸 · 五大名庄 · 1855分级</text>
    <text x="870" y="375" font-family="Microsoft YaHei" font-size="12" fill="#D4AF37" text-anchor="end">${date.display}</text>
  </svg>`;
  
  return sharp(Buffer.from(svg)).png().toBuffer();
}

/**
 * 生成波尔多产区文章内容
 */
function generateContent() {
  return `
<style>
  .box { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #1a237e; }
  .item { margin-bottom: 12px; border-bottom: 1px dashed #eee; padding-bottom: 10px; }
  .item:last-child { border-bottom: none; }
  .name { font-weight: bold; color: #333; font-size: 16px; }
  .info { color: #666; font-size: 14px; margin-top: 5px; }
  .price { color: #d4af37; font-weight: bold; }
  .tag { background: #e3f2fd; color: #1565c0; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-right: 5px; }
  h3 { color: #1a237e; border-bottom: 2px solid #1a237e; padding-bottom: 8px; margin-top: 25px; }
</style>

<h2 style="text-align: center; color: #1a237e;">🍷 ${date.chinese} 波尔多产区巡礼</h2>
<p style="text-align: center; color: #666;">左岸vs右岸 · 五大名庄 · 1855分级</p>

<section style="background:linear-gradient(135deg,#1a237e,#283593);padding:25px;border-radius:10px;margin-bottom:25px">
<p style="color:#e3f2fd;font-size:16px;line-height:1.9">波尔多（Bordeaux）是全球最著名的葡萄酒产区，位于法国西南部。这里的<strong style="color:#ffd740">1855分级</strong>奠定了五大名庄的传奇地位。左岸以赤霞珠为主，右岸以梅洛为主，风格迥异却又相得益彰。</p>
</section>

<h3>🌍 一、波尔多在哪里</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:12px">波尔多位于法国西南部，加龙河（Garonne）和多尔多涅河（Dordogne）在此交汇。产区总面积约12万公顷，分为左岸、右岸和两海之间三大区域。</p>
<p style="color:#333;line-height:1.8"><strong>📍 地理位置：</strong>法国西南部，大西洋沿岸<br/>
<strong>🌡️ 气候类型：</strong>温带海洋性气候<br/>
<strong>🍇 主要葡萄：</strong>赤霞珠、梅洛、品丽珠<br/>
<strong>📏 产区面积：</strong>约120,000公顷<br/>
<strong>🍷 年产量：</strong>约7亿瓶</p>
</section>

<h3>🍇 二、左岸 vs 右岸</h3>
<section style="background:#e3f2fd;padding:18px;border-radius:8px;margin-bottom:12px;border-left:3px solid #1565c0">
<p style="color:#1565c0;font-size:18px;font-weight:bold;margin-bottom:15px">🌚 左岸（Left Bank）</p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>核心产区：</strong>梅多克（Médoc）、格拉夫（Graves）、佩萨克-雷奥良（Pessac-Léognan）</p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>主要葡萄：</strong>赤霞珠（Cabernet Sauvignon）为主，占比70%+</p>
<p style="color:#333;line-height:1.8"><strong>酒体特点：</strong>单宁强劲，酸度较高，陈年潜力极强（20-50年）</p>
</section>

<section style="background:#fce4ec;padding:18px;border-radius:8px;border-left:3px solid #c2185b">
<p style="color:#c2185b;font-size:18px;font-weight:bold;margin-bottom:15px">🌝 右岸（Right Bank）</p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>核心产区：</strong>圣埃美隆（Saint-Émilion）、波美侯（Pomerol）、弗龙萨克（Fronsac）</p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>主要葡萄：</strong>梅洛（Merlot）为主，占比70%+</p>
<p style="color:#333;line-height:1.8"><strong>酒体特点：</strong>酒体饱满，单宁丝滑，果香浓郁，适饮期较早</p>
</section>

<h3>👑 三、1855分级与五大名庄</h3>
<section style="background:#fff9f0;padding:18px;border-radius:8px;margin-bottom:12px;border-left:3px solid #d4af37">
<p style="color:#8b4513;font-weight:bold;margin-bottom:12px">🏰 一级庄（First Growth / Premier Cru）</p>
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>1. 拉菲古堡（Château Lafite Rothschild）</strong><br/>
<span style="color:#666">• 地位：波尔多之王，贵族的象征</span><br/>
<span style="color:#666">• 价格：约6,000-12,000元/瓶</span><br/>
<span style="color:#666">• 特点：优雅细腻，花香与矿物质的完美结合</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>2. 拉图城堡（Château Latour）</strong><br/>
<span style="color:#666">• 地位：力量与结构的代名词</span><br/>
<span style="color:#666">• 价格：约5,000-9,000元/瓶</span><br/>
<span style="color:#666">• 特点：单宁强劲，陈年潜力50年+</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>3. 玛歌酒庄（Château Margaux）</strong><br/>
<span style="color:#666">• 地位：最优雅的一级庄</span><br/>
<span style="color:#666">• 价格：约5,000-10,000元/瓶</span><br/>
<span style="color:#666">• 特点：花香馥郁，丝滑单宁，女性化的力量</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>4. 侯伯王酒庄（Château Haut-Brion）</strong><br/>
<span style="color:#666">• 地位：格拉夫之王，最古老的列级庄</span><br/>
<span style="color:#666">• 价格：约4,000-8,000元/瓶</span><br/>
<span style="color:#666">• 特点：矿物质感强，独特的烟熏味</span></p>

<p style="color:#333;line-height:1.8"><strong>5. 木桐酒庄（Château Mouton Rothschild）</strong><br/>
<span style="color:#666">• 地位：唯一晋升的一级庄（1973年）</span><br/>
<span style="color:#666">• 价格：约4,500-9,000元/瓶</span><br/>
<span style="color:#666">• 特点：艺术酒标，每年邀请艺术家设计</span></p>
</section>

<h3>💎 四、高性价比酒庄推荐</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰 100-300 元</strong><br/>
<span style="color:#666">• 龙船庄园（Château Beychevelle）：三级庄，性价比极高</span><br/>
<span style="color:#666">• 力关庄园（Château Lagrange）：圣朱利安的代表</span></p>

<p style="color:#333;line-height:1.8;margin-bottom:10px"><strong>💰💰 300-800 元</strong><br/>
<span style="color:#666">• 碧尚男爵（Château Pichon Baron）：二级庄，被誉为"超二级"</span><br/>
<span style="color:#666">• 靓茨伯（Château Lynch-Bages）：五级庄中的明星</span></p>

<p style="color:#333;line-height:1.8"><strong>💎 800 元以上</strong><br/>
<span style="color:#666">• 雄狮酒庄（Château Léoville Las Cases）：超二级庄，接近一级庄水准</span><br/>
<span style="color:#666">• 白马酒庄（Château Cheval Blanc）：右岸一级A等，波尔多最贵的酒之一</span></p>
</section>

<h3>🍽️ 五、配餐建议</h3>
<section style="background:#fff3e0;padding:18px;border-radius:8px">
<p style="color:#e65100;font-weight:bold;margin-bottom:12px">🥩 经典搭配</p>
<p style="color:#333;line-height:1.8"><strong>• 左岸赤霞珠 + 牛排/羊排</strong><br/>
<span style="color:#666">强劲单宁切割肉类脂肪，完美平衡</span><br/><br/>
<strong>• 右岸梅洛 + 烤鸭/红烧肉</strong><br/>
<span style="color:#666">丝滑单宁搭配肥美口感，相得益彰</span><br/><br/>
<strong>• 波尔多白葡萄酒 + 生蚝/海鲜</strong><br/>
<span style="color:#666">格拉夫干白酸度清爽，去腥提鲜</span></p>
</section>

<h3>📅 六、经典年份推荐</h3>
<section style="background:#faf8f5;padding:18px;border-radius:8px">
<table style="width:100%;border-collapse:collapse">
<tr style="border-bottom:2px solid #d4af37">
<td style="padding:10px;font-weight:bold;color:#1a237e">年份</td>
<td style="padding:10px;font-weight:bold;color:#1a237e">评分</td>
<td style="padding:10px;font-weight:bold;color:#1a237e">特点</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#333">2016</td>
<td style="padding:10px;color:#c41e3a">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">左岸卓越，右岸优秀，陈年潜力极佳</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#333">2015</td>
<td style="padding:10px;color:#c41e3a">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">阳光年份，果味浓郁，适饮期较早</td>
</tr>
<tr style="border-bottom:1px solid #e8e0d8">
<td style="padding:10px;color:#333">2010</td>
<td style="padding:10px;color:#d4af37">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">传奇年份，结构宏大，收藏级</td>
</tr>
<tr>
<td style="padding:10px;color:#333">2009</td>
<td style="padding:10px;color:#d4af37">⭐⭐⭐⭐⭐</td>
<td style="padding:10px;color:#666">华丽丰腴，果味爆炸，适合中国人口味</td>
</tr>
</table>
</section>

<h3>💰 七、投资建议</h3>
<section style="background:#f0fff0;padding:18px;border-radius:8px;border-left:3px solid #28a745">
<p style="color:#155724;margin:0">
<strong>🟢 适合投资</strong><br/><br/>
<strong>• 一级庄：</strong>拉菲、拉图、玛歌、侯伯王、木桐<br/>
<span style="color:#666">品牌价值极高，价格稳定上涨，流动性好</span><br/><br/>
<strong>• 超二级庄：</strong>雄狮、碧尚男爵、靓茨伯<br/>
<span style="color:#666">品质接近一级庄，价格相对亲民</span><br/><br/>
<strong>• 右岸顶级庄：</strong>白马、欧颂、柏图斯<br/>
<span style="color:#666">产量稀少，价格昂贵，升值潜力大</span><br/><br/>
<strong>⚠️ 风险提示：</strong><br/>
<span style="color:#666">• 波尔多假酒泛滥，务必通过正规渠道购买<br/>
• 投资级酒需完美存储条件（恒温12-15℃，湿度70%）<br/>
• 关注国际评分（RP、WS、JS），评分影响价格</span>
</p>
</section>

<section style="background:linear-gradient(135deg,#1a237e,#283593);padding:22px;border-radius:10px;text-align:center">
<p style="color:#ffd740;font-size:14px;font-weight:bold;margin-bottom:8px">🍷 结语</p>
<p style="color:#e3f2fd;font-size:14px;line-height:1.8;margin:0">波尔多是葡萄酒世界的灯塔。从几百元的日常餐酒，到数十万元一瓶的传奇佳酿，这里有无尽的探索空间。理解左岸与右岸的区别，是通往葡萄酒大师之路的第一步。</p>
<p style="color:#999;font-size:12px;margin-top:15px;margin-bottom:0">发布日期：${date.display}<br/>关注我们，探索更多葡萄酒产区</p>
</section>`;
}

/**
 * 主函数：生成文章并发布到微信草稿箱
 */
async function main() {
  console.log('='.repeat(60));
  console.log('🍷 生成波尔多产区巡礼文章');
  console.log('日期:', date.display);
  console.log('='.repeat(60));
  console.log('');

  // 1. 生成封面
  const coverBuffer = await generateCoverWithDashScope();
  console.log('');

  // 2. 生成文章内容
  console.log('📝 生成文章内容...');
  const content = generateContent();
  const article = {
    title: `🍷 ${date.chinese} 波尔多产区巡礼：左岸vs右岸，五大名庄传奇`,
    author: '红酒顾问',
    digest: '波尔多是全球最著名的葡萄酒产区，1855分级奠定了五大名庄的传奇地位。本文详解左岸右岸区别、五大名庄特点和投资价值。',
    content: content
  };
  console.log('   标题:', article.title);
  console.log('   摘要:', article.digest);
  console.log('');

  // 3. 保存到本地
  const outputPath = path.join(__dirname, 'output', `bordeaux_${date.full.replace(/-/g, '')}.json`);
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
    const formData = new FormData();
    formData.append('media', coverBuffer, { filename: 'cover.png', contentType: 'image/png' });
    
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
          need_open_comment: 0,
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
  }
}

main();
