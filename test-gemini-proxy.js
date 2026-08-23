/**
 * Gemini API 代理测试脚本
 */
require('dotenv').config();
const { HttpsProxyAgent } = require('https-proxy-agent');
const fs = require('fs');
const path = require('path');

async function testGeminiWithProxy() {
  const apiKey = process.env.GEMINI_API_KEY;
  const proxyUrl = 'http://127.0.0.1:10809';
  
  console.log('测试Gemini API (使用代理)...');
  console.log('代理地址:', proxyUrl);
  console.log('API Key:', apiKey ? apiKey.substring(0, 10) + '...' : '未配置');
  console.log('');
  
  try {
    // 创建代理代理
    const proxyAgent = new HttpsProxyAgent(proxyUrl);
    
    console.log('正在连接Gemini API...');
    
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
              text: 'A crystal wine glass with deep red wine, elegant lighting, professional product photography, dark background'
            }]
          }],
          generationConfig: {
            responseModalities: 'image'
          }
        }),
        agent: proxyAgent
      }
    );
    
    console.log('响应状态:', response.status);
    
    if (!response.ok) {
      const error = await response.text();
      console.log('❌ API错误:', error);
      return false;
    }
    
    const data = await response.json();
    console.log('✅ Gemini API 连接成功！');
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      const imagePart = data.candidates[0].content.parts.find(part => part.inlineData);
      if (imagePart) {
        console.log('✅ 成功获取图片数据！');
        console.log('图片类型:', imagePart.inlineData.mimeType);
        console.log('图片大小:', Math.round(imagePart.inlineData.data.length / 1024), 'KB');
        
        // 保存测试图片
        const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');
        const outputPath = path.join(__dirname, 'output', 'gemini_test.png');
        fs.writeFileSync(outputPath, imageBuffer);
        console.log('📁 测试图片已保存:', outputPath);
        
        return true;
      }
    }
    
    console.log('⚠️ 未获取到图片数据');
    return false;
    
  } catch (err) {
    console.log('❌ 错误:', err.message);
    if (err.cause) {
      console.log('错误原因:', err.cause.message);
    }
    return false;
  }
}

testGeminiWithProxy().then(success => {
  console.log('\n' + '='.repeat(60));
  if (success) {
    console.log('✅ 测试成功！Gemini API 可以正常使用');
  } else {
    console.log('❌ 测试失败，请检查代理配置或API密钥');
  }
  console.log('='.repeat(60));
});
