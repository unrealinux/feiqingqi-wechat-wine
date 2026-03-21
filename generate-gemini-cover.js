/**
 * Gemini API 使用node-fetch和代理
 */
require('dotenv').config();
const fetch = require('node-fetch');
const { HttpsProxyAgent } = require('https-proxy-agent');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generateWithGemini(apiKey, proxyUrl) {
  console.log('使用 node-fetch + 代理测试 Gemini API...');
  console.log('代理:', proxyUrl);
  console.log('');
  
  const proxyAgent = new HttpsProxyAgent(proxyUrl);
  
  const prompt = 'A crystal wine glass with deep red burgundy wine, soft studio lighting, elegant reflection on table, dark wooden background, professional product photography, shallow depth of field, high detail';
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            responseModalities: 'image'
          }
        }),
        agent: proxyAgent,
        timeout: 30000
      }
    );
    
    console.log('响应状态:', response.status);
    
    if (!response.ok) {
      const error = await response.text();
      console.log('❌ API错误:', error);
      return null;
    }
    
    const data = await response.json();
    console.log('✅ Gemini API 连接成功！');
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      const imagePart = data.candidates[0].content.parts.find(part => part.inlineData);
      if (imagePart) {
        console.log('✅ 成功获取图片数据！');
        console.log('图片类型:', imagePart.inlineData.mimeType);
        console.log('图片大小:', Math.round(imagePart.inlineData.data.length / 1024), 'KB');
        
        return Buffer.from(imagePart.inlineData.data, 'base64');
      }
    }
    
    console.log('⚠️ 未获取到图片数据');
    return null;
    
  } catch (err) {
    console.log('❌ 错误:', err.message);
    return null;
  }
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  const proxyUrl = 'http://127.0.0.1:10809';
  
  console.log('='.repeat(60));
  console.log('🍷 Gemini AI 图片生成测试');
  console.log('='.repeat(60));
  console.log('');
  
  // 生成AI图片
  const imageBuffer = await generateWithGemini(apiKey, proxyUrl);
  
  if (imageBuffer) {
    // 裁剪为微信封面尺寸
    console.log('正在裁剪为微信封面尺寸...');
    const croppedBuffer = await sharp(imageBuffer)
      .resize(900, 383, {
        fit: 'cover',
        position: 'center'
      })
      .png()
      .toBuffer();
    
    // 添加文字
    console.log('正在添加文字...');
    const svg = `<svg width="900" height="383" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#D4AF37"/>
          <stop offset="100%" style="stop-color:#F4E4BC"/>
        </linearGradient>
      </defs>
      <rect x="0" y="250" width="900" height="133" fill="rgba(0,0,0,0.6)"/>
      <text x="30" y="310" font-family="Microsoft YaHei, PingFang SC" font-size="36" font-weight="bold" fill="url(#textGrad)">🍷 2026葡萄酒投资分析</text>
      <text x="30" y="350" font-family="Microsoft YaHei, PingFang SC" font-size="20" fill="rgba(255,255,255,0.8)">市场趋势与收藏价值</text>
      <text x="870" y="365" font-family="Microsoft YaHei" font-size="14" fill="#D4AF37" text-anchor="end">2026-03</text>
    </svg>`;
    
    const textBuffer = Buffer.from(svg);
    
    const finalBuffer = await sharp(croppedBuffer)
      .composite([{
        input: textBuffer,
        top: 0,
        left: 0
      }])
      .png()
      .toBuffer();
    
    // 保存
    const outputPath = path.join(__dirname, 'output', 'gemini_wine_cover.png');
    fs.writeFileSync(outputPath, finalBuffer);
    
    console.log('');
    console.log('='.repeat(60));
    console.log('✅ 成功生成AI写实风格封面！');
    console.log('📁 文件:', outputPath);
    console.log('📌 使用: Google Gemini AI');
    console.log('='.repeat(60));
    
  } else {
    console.log('');
    console.log('='.repeat(60));
    console.log('❌ 生成失败');
    console.log('='.repeat(60));
  }
}

main();
