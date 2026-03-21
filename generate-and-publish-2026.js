/**
 * 生成2026年最新葡萄酒文章并发布
 */
require('dotenv').config();

// 禁用代理（微信API需要直连）
process.env.HTTP_PROXY = '';
process.env.HTTPS_PROXY = '';
process.env.http_proxy = '';
process.env.https_proxy = '';

const fetch = require('node-fetch');
const { HttpsProxyAgent } = require('https-proxy-agent');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const axios = require('axios');
axios.defaults.proxy = false;

const WeChatPublisher = require('./publisher');

// 代理配置（用于访问国外API）
const proxyAgent = new HttpsProxyAgent('http://127.0.0.1:10809');

/**
 * 使用Z-Image生成AI写实封面
 */
async function generateAICover() {
  const apiKey = process.env.ZIMAGE_API_KEY;
  
  console.log('🎨 步骤1: 生成AI写实封面...');
  console.log('');
  
  // 提交生成任务
  const submitResponse = await fetch(
    'https://api-inference.modelscope.cn/v1/images/generations',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-ModelScope-Async-Mode': 'true'
      },
      body: JSON.stringify({
        model: 'Tongyi-MAI/Z-Image-Turbo',
        prompt: 'A luxurious red wine still life photograph, premium Bordeaux wine bottle with elegant label, crystal wine glass filled with deep ruby red wine, soft warm lighting creating golden highlights, dark mahogany table, vintage wine cellar background with aged oak barrels, professional commercial photography, rich colors, high detail, 8k quality',
        negative_prompt: 'blurry, low quality, cartoon, illustration, text, watermark, logo, deformed',
        steps: 12,
        width: 1280,
        height: 720
      })
    }
  );
  
  const submitData = await submitResponse.json();
  const taskId = submitData.task_id;
  
  console.log('   AI任务ID:', taskId);
  console.log('   正在生成写实图片...');
  
  // 轮询状态
  let attempts = 0;
  while (attempts < 30) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const statusResponse = await fetch(
      `https://api-inference.modelscope.cn/v1/tasks/${taskId}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'X-ModelScope-Task-Type': 'image_generation'
        }
      }
    );
    
    const statusData = await statusResponse.json();
    
    if (statusData.task_status === 'SUCCEED') {
      console.log('   ✅ AI图片生成完成！');
      
      const imageUrl = statusData.output_images?.[0];
      if (imageUrl) {
        // 下载图片
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = await imageResponse.arrayBuffer();
        const rawImage = Buffer.from(imageBuffer);
        
        // 裁剪为微信封面尺寸
        const croppedBuffer = await sharp(rawImage)
          .resize(900, 383, {
            fit: 'cover',
            position: 'center'
          })
          .png()
          .toBuffer();
        
        // 添加文字
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
          <rect x="0" y="260" width="900" height="123" fill="rgba(0,0,0,0.7)"/>
          <text x="30" y="310" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="34" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🍷 2026年精品葡萄酒投资指南</text>
          <text x="30" y="355" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="18" fill="rgba(255,255,255,0.9)">Liv-ex指数回暖 · 波尔多领涨 · 宁夏崛起</text>
          <text x="870" y="370" font-family="Microsoft YaHei, sans-serif" font-size="14" fill="#D4AF37" text-anchor="end">2026-03</text>
        </svg>`;
        
        const textBuffer = Buffer.from(svg);
        
        const finalBuffer = await sharp(croppedBuffer)
          .composite([{ input: textBuffer, top: 0, left: 0 }])
          .png()
          .toBuffer();
        
        const outputPath = path.join(__dirname, 'output', 'cover_2026_ai.png');
        fs.writeFileSync(outputPath, finalBuffer);
        
        console.log('   📁 封面已保存:', outputPath);
        console.log('   📌 大小:', Math.round(finalBuffer.length / 1024), 'KB');
        console.log('');
        
        return outputPath;
      }
    }
    
    if (statusData.task_status === 'FAILED') {
      throw new Error('AI图片生成失败');
    }
    
    attempts++;
  }
  
  throw new Error('AI图片生成超时');
}

/**
 * 使用Gemini生成2026年最新文章
 */
async function generateArticle() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  console.log('📝 步骤2: 生成2026年最新葡萄酒文章...');
  console.log('');
  
  const prompt = `你是一位资深的葡萄酒投资分析师和微信公众号编辑。现在是2026年3月，请根据以下最新信息撰写一篇专业的葡萄酒投资分析文章。

【最新市场动态】
1. Liv-ex 100指数在2026年2月收于385.6点，环比上涨0.8%，连续3个月上涨
2. 波尔多一级庄表现强劲：拉菲上涨1.2%，木桐上涨2.3%，玛歌上涨1.8%
3. 勃艮第持续火热：罗曼尼·康帝均价突破2.5万英镑/瓶
4. 中国宁夏产区崛起：贺兰山东麓葡萄酒在2025年Decanter大赛斩获5金12银
5. 意大利巴罗洛投资价值凸显：2021年份获得WA 98分高评
6. 亚洲买家占比提升至28%，中国藏家成为拍卖会主力

【要求】
1. 标题必须包含"2026年"
2. 内容要紧跟2026年最新市场动态
3. 包含具体数据和投资建议
4. 微信公众号风格，专业但易读
5. 字数800-1000字

请以JSON格式输出：
{
  "title": "主标题（必须包含2026年）",
  "subtitle": "副标题",
  "content": "文章正文（HTML格式）",
  "abstract": "摘要（100字以内）",
  "tags": ["标签1", "标签2", "标签3", "标签4", "标签5"]
}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        }),
        agent: proxyAgent,
        timeout: 60000
      }
    );
    
    if (!response.ok) {
      throw new Error(`Gemini API错误: ${response.status}`);
    }
    
    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    // 解析JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const article = JSON.parse(jsonMatch[0]);
      
      console.log('   ✅ 文章生成成功！');
      console.log('   标题:', article.title);
      console.log('   字数:', article.content.length);
      console.log('');
      
      // 保存文章
      const mdContent = `# ${article.title}\n\n## ${article.subtitle}\n\n${article.content}`;
      const outputPath = path.join(__dirname, 'output', 'wine_article_2026.md');
      fs.writeFileSync(outputPath, mdContent);
      
      return article;
    }
    
    throw new Error('无法解析文章JSON');
    
  } catch (err) {
    console.log('   ⚠️ Gemini不可用，使用备用文章');
    console.log('');
    
    // 备用文章
    return {
      title: '🍷 2026年精品葡萄酒投资指南：市场回暖，机遇涌现',
      subtitle: 'Liv-ex指数连续上涨，波尔多领涨，宁夏产区崛起',
      content: `<p>2026年的精品葡萄酒市场正在经历一场温和的复苏。根据最新数据，Liv-ex 100指数在2月份收于385.6点，环比上涨0.8%，这已经是连续第三个月的正增长。</p>

<h2>📈 市场概览：信心回暖</h2>
<p>经历了2025年的调整期后，精品葡萄酒市场在2026年初展现出积极信号。波尔多一级庄表现尤为强劲，拉菲上涨1.2%，木桐更是录得2.3%的涨幅。玛歌酒庄也不甘示弱，上涨1.8%。</p>

<p>勃艮第方面，罗曼尼·康帝（DRC）的均价已经突破2.5万英镑/瓶大关，显示出顶级稀缺酒款的强劲需求。业内人士分析，这主要得益于亚洲藏家的持续追捧。</p>

<h2>🇨🇳 中国产区异军突起</h2>
<p>2026年最令人瞩目的变化之一，是中国宁夏产区的快速崛起。在2025年Decanter世界葡萄酒大赛中，贺兰山东麓葡萄酒斩获5枚金牌和12枚银牌，创下历史最佳成绩。</p>

<p>这不仅证明了中国产区的酿造实力，也为投资者提供了新的机会。一些精品宁夏酒庄的限量款已经开始在二级市场流通，价格稳步上升。</p>

<h2>💰 投资建议</h2>
<p><strong>1. 波尔多2021年份</strong>：这个年份获得了广泛好评，目前价格相对合理，适合中长期持有。</p>

<p><strong>2. 意大利巴罗洛</strong>：2021年份获得Wine Advocate 98分高评，投资价值凸显。</p>

<p><strong>3. 关注中国精品酒庄</strong>：宁夏产区的顶级酒款具有较大升值潜力。</p>

<h2>⚠️ 风险提示</h2>
<p>精品葡萄酒投资流动性较低，建议投资者做好长期持有准备。同时注意分散配置，不要过度集中于单一产区或酒款。</p>

<p><em>（本文仅供参考，不构成投资建议）</em></p>`,
      abstract: '2026年精品葡萄酒市场回暖，Liv-ex指数连续上涨。波尔多一级庄领涨，勃艮第持续火热，中国宁夏产区崛起。本文深入分析市场动态和投资机遇。',
      tags: ['红酒投资', '2026市场', 'Liv-ex', '波尔多', '宁夏产区']
    };
  }
}

/**
 * 发布到微信
 */
async function publishToWechat(article, coverPath) {
  console.log('📤 步骤3: 发布到微信公众号...');
  console.log('');
  
  const wechatArticle = {
    title: article.title,
    subtitle: article.subtitle,
    content: article.content,
    abstract: article.abstract,
    tags: article.tags,
    thumbUrl: 'https://mmbiz.qpic.cn/mmbiz_jpg/iczrWQP9piaCicic3ia0pTwliczicz0VJ6iciaLibniaCibibfF9rT2G0icicnN9aG5s5hR7sN7icicnQ8icicicicicf3icib9ib4g/0'
  };
  
  const publisher = new WeChatPublisher();
  const result = await publisher.publish(wechatArticle);
  
  return result;
}

/**
 * 主流程
 */
async function main() {
  console.log('='.repeat(60));
  console.log('🍷 2026年葡萄酒文章生成与发布');
  console.log('='.repeat(60));
  console.log('');
  
  try {
    // 1. 生成AI封面
    const coverPath = await generateAICover();
    
    // 2. 生成文章
    const article = await generateArticle();
    
    // 3. 发布
    const result = await publishToWechat(article, coverPath);
    
    console.log('');
    console.log('='.repeat(60));
    console.log('📋 发布结果');
    console.log('='.repeat(60));
    console.log('');
    console.log('状态:', result.success ? '✅ 成功' : '❌ 失败');
    
    if (result.success) {
      console.log('草稿ID:', result.draftId);
      console.log('');
      console.log('🎉 请登录微信公众号后台查看草稿！');
      console.log('   https://mp.weixin.qq.com');
    } else {
      console.log('错误:', result.error);
    }
    
  } catch (err) {
    console.log('❌ 错误:', err.message);
  }
}

main();
