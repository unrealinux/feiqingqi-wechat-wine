/**
 * 优化排版的文章发布脚本
 */
process.env.HTTP_PROXY = '';
process.env.HTTPS_PROXY = '';
process.env.http_proxy = '';
process.env.https_proxy = '';

require('dotenv').config();
process.env.HTTP_PROXY = '';
process.env.HTTPS_PROXY = '';

const axios = require('axios');
axios.defaults.proxy = false;

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const config = require('./config');

class WeChatPublisherOptimized {
  constructor() {
    this.accessToken = null;
    this.tokenExpireTime = 0;
  }

  async getAccessToken() {
    const now = Date.now();
    if (this.accessToken && now < this.tokenExpireTime) {
      return this.accessToken;
    }
    const url = config.publish.endpoints.token;
    const params = {
      grant_type: 'client_credential',
      appid: config.publish.appId,
      secret: config.publish.appSecret,
    };
    const response = await axios.get(url, { params, timeout: 10000 });
    if (response.data.errcode) {
      throw new Error(`获取access_token失败: ${response.data.errmsg}`);
    }
    this.accessToken = response.data.access_token;
    this.tokenExpireTime = now + (response.data.expires_in - 300) * 1000;
    return this.accessToken;
  }

  async uploadLocalImage(imagePath) {
    console.log('  正在上传封面图:', path.basename(imagePath));
    if (!fs.existsSync(imagePath)) {
      throw new Error('图片文件不存在: ' + imagePath);
    }
    const token = await this.getAccessToken();
    const imageBuffer = fs.readFileSync(imagePath);
    console.log('  图片大小:', Math.round(imageBuffer.length / 1024), 'KB');

    const url = `https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${token}&type=image`;
    const formData = new FormData();
    formData.append('media', imageBuffer, {
      filename: 'cover.png',
      contentType: 'image/png',
    });
    const response = await axios.post(url, formData, {
      headers: { ...formData.getHeaders() },
      timeout: 30000,
    });
    if (response.data.errcode) {
      throw new Error(`上传失败: ${response.data.errmsg}`);
    }
    console.log('  ✅ 封面上传成功');
    return response.data.media_id;
  }

  async createDraft(article, thumbMediaId) {
    const token = await this.getAccessToken();
    const url = `https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${token}`;

    const articleData = {
      title: article.title,
      author: article.author || '红酒顾问',
      digest: article.abstract || '',
      content: article.content,
      content_source_url: '',
      thumb_media_id: thumbMediaId,
      need_open_comment: 0,
      only_fans_can_comment: 0,
    };

    const response = await axios.post(url, {
      articles: [articleData]
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    });

    if (response.data.errcode) {
      throw new Error(`创建草稿失败: ${response.data.errmsg}`);
    }
    return response.data.media_id;
  }

  async publish(article, coverImagePath) {
    console.log('开始发布到微信公众号...\n');
    const startTime = Date.now();

    try {
      console.log('📌 步骤 1/3: 获取 Access Token...');
      await this.getAccessToken();
      console.log('  ✅ 获取成功\n');

      console.log('📌 步骤 2/3: 上传AI写实封面...');
      const thumbMediaId = await this.uploadLocalImage(coverImagePath);

      console.log('\n📌 步骤 3/3: 创建草稿...');
      const draftId = await this.createDraft(article, thumbMediaId);
      console.log(`  ✅ 草稿创建成功\n`);

      console.log(`🎉 发布完成，耗时 ${Date.now() - startTime}ms`);
      return { success: true, draftId, thumbMediaId };
    } catch (error) {
      console.error('❌ 发布失败:', error.message);
      return { success: false, error: error.message };
    }
  }
}

/**
 * 优化排版的HTML文章内容
 */
function getOptimizedArticle() {
  return {
    title: '🍷 2026年精品葡萄酒投资指南：市场回暖，机遇涌现',
    author: '红酒顾问',
    abstract: 'Liv-ex指数连续上涨，波尔多一级庄领涨，勃艮第持续火热，中国宁夏产区崛起。一文读懂2026年葡萄酒投资新机遇。',
    content: `<section style="margin-bottom: 25px;">
<p style="color: #666; font-size: 14px; text-align: center; margin-bottom: 20px;">文 | 红酒顾问 · 2026年3月</p>

<section style="background: linear-gradient(135deg, #2d1424 0%, #4a1a2e 100%); padding: 20px 25px; border-radius: 8px; margin-bottom: 25px;">
<p style="color: #f5e6d3; font-size: 16px; line-height: 1.8; margin: 0;">
2026年的精品葡萄酒市场正在经历一场温和的复苏。<strong style="color: #d4af37;">Liv-ex 100指数在2月份收于385.6点，环比上涨0.8%</strong>，连续第三个月正增长。市场信心正在回暖，投资机遇悄然涌现。
</p>
</section>
</section>

<section style="margin-bottom: 30px;">
<h2 style="color: #2d1424; font-size: 20px; border-left: 4px solid #8b2252; padding-left: 12px; margin-bottom: 15px;">📈 市场概览：信心回暖</h2>

<section style="background: #faf8f5; padding: 15px 20px; border-radius: 6px; margin-bottom: 15px;">
<table style="width: 100%; border-collapse: collapse;">
<tr style="border-bottom: 1px solid #e8e0d8;">
<td style="padding: 10px 0; color: #666;">拉菲 (Lafite)</td>
<td style="padding: 10px 0; text-align: right; color: #c41e3a; font-weight: bold;">↑ 1.2%</td>
</tr>
<tr style="border-bottom: 1px solid #e8e0d8;">
<td style="padding: 10px 0; color: #666;">木桐 (Mouton)</td>
<td style="padding: 10px 0; text-align: right; color: #c41e3a; font-weight: bold;">↑ 2.3%</td>
</tr>
<tr style="border-bottom: 1px solid #e8e0d8;">
<td style="padding: 10px 0; color: #666;">玛歌 (Margaux)</td>
<td style="padding: 10px 0; text-align: right; color: #c41e3a; font-weight: bold;">↑ 1.8%</td>
</tr>
<tr>
<td style="padding: 10px 0; color: #666;">DRC 均价</td>
<td style="padding: 10px 0; text-align: right; color: #d4af37; font-weight: bold;">£25,000+/瓶</td>
</tr>
</table>
</section>

<p style="color: #333; line-height: 1.8; margin-bottom: 12px;">
经历了2025年的调整期后，精品葡萄酒市场在2026年初展现出积极信号。<strong>波尔多一级庄表现尤为强劲</strong>，成为市场复苏的领头羊。
</p>

<p style="color: #333; line-height: 1.8;">
勃艮第方面，罗曼尼·康帝（DRC）的均价已经突破<strong style="color: #d4af37;">2.5万英镑/瓶</strong>大关，显示出顶级稀缺酒款的强劲需求。业内人士分析，这主要得益于亚洲藏家的持续追捧。
</p>
</section>

<section style="margin-bottom: 30px;">
<h2 style="color: #2d1424; font-size: 20px; border-left: 4px solid #8b2252; padding-left: 12px; margin-bottom: 15px;">🇨🇳 中国产区异军突起</h2>

<section style="background: linear-gradient(135deg, #fff9f0 0%, #fff5e6 100%); padding: 15px 20px; border-radius: 6px; border-left: 3px solid #d4af37; margin-bottom: 15px;">
<p style="color: #8b4513; font-size: 15px; margin: 0;">
<strong>🏆 2025年Decanter世界葡萄酒大赛</strong><br/>
贺兰山东麓葡萄酒斩获 <strong style="color: #c41e3a;">5枚金牌</strong> + <strong style="color: #d4af37;">12枚银牌</strong>
</p>
</section>

<p style="color: #333; line-height: 1.8; margin-bottom: 12px;">
2026年最令人瞩目的变化之一，是<strong>中国宁夏产区的快速崛起</strong>。这不仅证明了中国产区的酿造实力，也为投资者提供了新的机会。
</p>

<p style="color: #333; line-height: 1.8;">
一些精品宁夏酒庄的限量款已经开始在二级市场流通，价格稳步上升。<strong style="color: #c41e3a;">对于看好国产精品葡萄酒的投资者来说，现在是布局的好时机。</strong>
</p>
</section>

<section style="margin-bottom: 30px;">
<h2 style="color: #2d1424; font-size: 20px; border-left: 4px solid #8b2252; padding-left: 12px; margin-bottom: 15px;">💰 投资建议</h2>

<section style="background: #f8f6f3; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
<p style="color: #2d1424; font-size: 16px; margin-bottom: 15px;"><strong>🎯 2026年推荐标的</strong></p>

<p style="color: #333; line-height: 2; margin-bottom: 10px;">
<strong style="color: #8b2252;">1️⃣ 波尔多2021年份</strong><br/>
<span style="color: #666;">获得广泛好评，价格相对合理，适合中长期持有。推荐关注：拉菲、玛歌、奥比昂。</span>
</p>

<p style="color: #333; line-height: 2; margin-bottom: 10px;">
<strong style="color: #8b2252;">2️⃣ 意大利巴罗洛</strong><br/>
<span style="color: #666;">2021年份获得Wine Advocate 98分高评，投资价值凸显。推荐酒庄：Giacomo Conterno, Giuseppe Rinaldi。</span>
</p>

<p style="color: #333; line-height: 2;">
<strong style="color: #8b2252;">3️⃣ 中国宁夏精品酒庄</strong><br/>
<span style="color: #666;">银色高地、贺兰晴雪等顶级酒款具有较大升值潜力，建议关注限量版产品。</span>
</p>
</section>
</section>

<section style="margin-bottom: 30px;">
<h2 style="color: #2d1424; font-size: 20px; border-left: 4px solid #8b2252; padding-left: 12px; margin-bottom: 15px;">⚠️ 风险提示</h2>

<section style="background: #fff5f5; padding: 15px 20px; border-radius: 6px; border-left: 3px solid #c41e3a;">
<p style="color: #666; line-height: 1.8; margin: 0;">
• 精品葡萄酒投资<strong>流动性较低</strong>，建议做好长期持有准备<br/>
• 注意<strong>分散配置</strong>，不要过度集中于单一产区或酒款<br/>
• <strong>存储条件</strong>至关重要，不当存储会严重影响酒款价值<br/>
• 本文仅供参考，<strong>不构成投资建议</strong>
</p>
</section>
</section>

<section style="background: linear-gradient(135deg, #2d1424 0%, #4a1a2e 100%); padding: 20px 25px; border-radius: 8px; text-align: center;">
<p style="color: #f5e6d3; font-size: 14px; margin-bottom: 10px;">关注我们，获取更多葡萄酒投资资讯</p>
<p style="color: #d4af37; font-size: 12px; margin: 0;">🍷 红酒顾问 · 专业 · 可靠 · 值得信赖</p>
</section>`,
  };
}

/**
 * 主流程
 */
async function main() {
  console.log('='.repeat(60));
  console.log('🍷 发布优化排版的2026年葡萄酒文章');
  console.log('='.repeat(60));
  console.log('');

  // 1. 检查封面
  const coverPath = path.join(__dirname, 'output', 'cover_2026_ai.png');
  if (!fs.existsSync(coverPath)) {
    console.log('❌ 封面不存在');
    return;
  }
  console.log('✅ 封面:', path.basename(coverPath));
  console.log('   大小:', Math.round(fs.statSync(coverPath).size / 1024), 'KB');
  console.log('');

  // 2. 获取优化后的文章
  const article = getOptimizedArticle();
  console.log('📝 文章标题:', article.title);
  console.log('   内容长度:', article.content.length, '字符');
  console.log('');

  // 3. 保存HTML预览
  const htmlPreview = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${article.title}</title>
<style>
body { font-family: -apple-system, "Microsoft YaHei", sans-serif; max-width: 677px; margin: 0 auto; padding: 20px; }
</style>
</head>
<body>
${article.content}
</body>
</html>`;
  fs.writeFileSync(path.join(__dirname, 'output', 'article_preview.html'), htmlPreview);
  console.log('✅ HTML预览已保存: output/article_preview.html');
  console.log('');

  // 4. 发布
  console.log('📤 正在发布...');
  console.log('');

  const publisher = new WeChatPublisherOptimized();
  const result = await publisher.publish(article, coverPath);

  console.log('');
  console.log('='.repeat(60));
  console.log('📋 发布结果');
  console.log('='.repeat(60));
  console.log('');
  console.log('状态:', result.success ? '✅ 成功' : '❌ 失败');

  if (result.success) {
    console.log('草稿ID:', result.draftId);
    console.log('封面ID:', result.thumbMediaId);
    console.log('');
    console.log('🎉 请登录微信公众号后台查看！');
    console.log('   https://mp.weixin.qq.com');
    console.log('   进入「草稿箱」→ 预览 → 发布');
  } else {
    console.log('错误:', result.error);
  }
}

main();
