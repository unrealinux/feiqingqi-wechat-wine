/**
 * 生成写实波尔多封面图
 */

process.env.HTTP_PROXY = '';
process.env.HTTPS_PROXY = '';

require('dotenv').config();

const fetch = require('node-fetch');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');
axios.defaults.proxy = false;
const config = require('./config');

const today = new Date();
const date = {
  display: `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`,
};

async function generateRealisticCover() {
  console.log('🎨 生成写实波尔多封面图...');
  console.log('');
  
  const apiKey = process.env.ZIMAGE_API_KEY;
  
  // 使用更详细的提示词生成写实图片
  const prompts = [
    {
      name: '波尔多酒庄风景',
      prompt: 'Photorealistic aerial view of Bordeaux vineyard at golden hour, rows of grapevines stretching to horizon, classic French chateau with stone walls, warm sunset light, professional landscape photography, Canon EOS R5, 24-70mm lens, high resolution, ultra detailed',
      negative: 'cartoon, illustration, painting, blurry, low quality, text, watermark, modern buildings'
    },
    {
      name: '波尔多红酒特写',
      prompt: 'Professional product photography of premium Bordeaux red wine bottle with elegant label, crystal wine glass filled with deep ruby wine, dark wooden table, soft warm studio lighting, shallow depth of field, Canon macro lens, ultra sharp, commercial quality',
      negative: 'cartoon, illustration, blurry, low quality, text, watermark, cheap looking'
    },
    {
      name: '波尔多葡萄园',
      prompt: 'Photorealistic close-up of ripe red wine grapes on vine in Bordeaux vineyard, morning dew drops, green leaves, soft natural light, professional food photography, shallow depth of field, bokeh background, ultra detailed',
      negative: 'cartoon, illustration, blurry, low quality, text, watermark'
    }
  ];
  
  // 选择第一个提示词（酒庄风景）
  const selectedPrompt = prompts[0];
  console.log('使用提示词:', selectedPrompt.name);
  
  try {
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
          prompt: selectedPrompt.prompt,
          negative_prompt: selectedPrompt.negative,
          steps: 15,  // 增加步数以提高质量
          width: 1280,
          height: 720
        })
      }
    );
    
    const submitData = await submitResponse.json();
    const taskId = submitData.task_id;
    console.log('任务ID:', taskId);
    console.log('正在生成写实图片...');
    
    // 轮询等待生成完成
    for (let i = 0; i < 30; i++) {
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
        const imageUrl = statusData.output_images?.[0];
        if (imageUrl) {
          console.log('✅ AI图片生成成功！');
          console.log('');
          
          // 下载图片
          const imageResponse = await fetch(imageUrl);
          const imageBuffer = await imageResponse.arrayBuffer();
          const rawImage = Buffer.from(imageBuffer);
          
          console.log('正在处理图片...');
          
          // 裁剪为微信封面尺寸
          const croppedBuffer = await sharp(rawImage)
            .resize(900, 383, { fit: 'cover', position: 'center' })
            .png()
            .toBuffer();
          
          // 添加文字叠加层
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
            <text x="30" y="290" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="36" font-weight="bold" fill="url(#textGrad)" filter="url(#shadow)">🍷 波尔多入门指南</text>
            
            <!-- 副标题 -->
            <text x="30" y="335" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="18" fill="rgba(255,255,255,0.9)">左岸vs右岸 · 五大名庄 · 年份指南</text>
            
            <!-- 日期 -->
            <text x="870" y="375" font-family="Microsoft YaHei" font-size="14" fill="#D4AF37" text-anchor="end">${date.display}</text>
          </svg>`;
          
          const textBuffer = Buffer.from(svg);
          
          const finalBuffer = await sharp(croppedBuffer)
            .composite([{ input: textBuffer, top: 0, left: 0 }])
            .png()
            .toBuffer();
          
          // 保存到文件
          const outputPath = path.join(__dirname, 'output', 'bordeaux_cover_realistic.png');
          fs.writeFileSync(outputPath, finalBuffer);
          
          console.log('📁 封面已保存:', outputPath);
          console.log('📌 大小:', Math.round(finalBuffer.length / 1024), 'KB');
          
          return outputPath;
        }
      }
      
      if (statusData.task_status === 'FAILED') {
        throw new Error('AI图片生成失败');
      }
    }
    
    throw new Error('生成超时');
    
  } catch (err) {
    console.log('❌ 错误:', err.message);
    return null;
  }
}

// 执行生成
generateRealisticCover().then(result => {
  if (result) {
    console.log('');
    console.log('='.repeat(60));
    console.log('✅ 写实封面图生成成功！');
    console.log('='.repeat(60));
  }
});
