const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function generateWithZImage() {
  const apiKey = process.env.ZIMAGE_API_KEY;
  
  console.log('测试阿里Z-Image API...');
  console.log('');
  
  // 第一步：提交生成任务
  console.log('第一步：提交生成任务...');
  
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
          prompt: 'A crystal wine glass with deep red burgundy wine, soft studio lighting, elegant reflection on table, dark wooden background, professional product photography',
          negative_prompt: 'blurry, low quality, cartoon, text, watermark',
          steps: 8,
          width: 1024,
          height: 1024
        })
      }
    );
    
    console.log('提交响应状态:', submitResponse.status);
    
    if (!submitResponse.ok) {
      const error = await submitResponse.text();
      console.log('❌ 提交失败:', error);
      return null;
    }
    
    const submitData = await submitResponse.json();
    console.log('提交响应:', JSON.stringify(submitData, null, 2));
    
    const taskId = submitData.task_id || submitData.output?.task_id;
    
    if (!taskId) {
      console.log('❌ 未获取到任务ID');
      return null;
    }
    
    console.log('任务ID:', taskId);
    
    // 第二步：轮询任务状态
    console.log('');
    console.log('第二步：等待图片生成...');
    
    let attempts = 0;
    const maxAttempts = 30;
    let lastStatus = '';
    
    while (attempts < maxAttempts) {
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
      const taskStatus = statusData.task_status || statusData.output?.task_status;
      
      if (taskStatus !== lastStatus) {
        console.log(`  状态: ${taskStatus}`);
        lastStatus = taskStatus;
      }
      
      if (taskStatus === 'SUCCEED' || taskStatus === 'SUCCESS') {
        console.log('✅ 图片生成完成！');
        console.log('');
        console.log('完整响应:', JSON.stringify(statusData, null, 2));
        
        // 尝试多种方式获取图片
        let imageUrl = null;
        let base64Image = null;
        
        // 方式1: 从 output.image_url 获取
        if (statusData.output?.image_url) {
          imageUrl = statusData.output.image_url;
        }
        
        // 方式2: 从 results[0].url 获取
        if (!imageUrl && statusData.output?.results?.[0]?.url) {
          imageUrl = statusData.output.results[0].url;
        }
        
        // 方式3: 从 image 获取 (可能是URL或base64)
        if (!imageUrl && statusData.output?.image) {
          if (statusData.output.image.startsWith('http')) {
            imageUrl = statusData.output.image;
          } else {
            base64Image = statusData.output.image;
          }
        }
        
        // 方式4: 从 results[0].image 获取
        if (!imageUrl && !base64Image && statusData.output?.results?.[0]?.image) {
          base64Image = statusData.output.results[0].image;
        }
        
        if (imageUrl) {
          console.log('图片URL:', imageUrl);
          
          // 下载图片
          const imageResponse = await fetch(imageUrl);
          const imageBuffer = await imageResponse.arrayBuffer();
          
          const outputPath = path.join(__dirname, 'output', 'zimage_test.png');
          fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
          
          console.log('📁 图片已保存:', outputPath);
          console.log('图片大小:', Math.round(imageBuffer.length / 1024), 'KB');
          
          return Buffer.from(imageBuffer);
        }
        
        if (base64Image) {
          const imageBuffer = Buffer.from(base64Image, 'base64');
          
          const outputPath = path.join(__dirname, 'output', 'zimage_test.png');
          fs.writeFileSync(outputPath, imageBuffer);
          
          console.log('📁 图片已保存:', outputPath);
          console.log('图片大小:', Math.round(imageBuffer.length / 1024), 'KB');
          
          return imageBuffer;
        }
        
        console.log('❌ 未找到图片数据');
        return null;
      }
      
      if (taskStatus === 'FAILED' || taskStatus === 'failed') {
        console.log('❌ 任务失败');
        console.log('响应:', JSON.stringify(statusData, null, 2));
        return null;
      }
      
      attempts++;
    }
    
    console.log('❌ 超时：任务未完成');
    return null;
    
  } catch (err) {
    console.log('❌ 错误:', err.message);
    return null;
  }
}

generateWithZImage().then(result => {
  console.log('');
  console.log('='.repeat(60));
  if (result) {
    console.log('✅ 测试成功！');
  } else {
    console.log('❌ 测试失败');
  }
  console.log('='.repeat(60));
});
