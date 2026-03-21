/**
 * 阿里Z-Image API 配置脚本
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

async function configureZImage(apiKey) {
  console.log('\n' + '='.repeat(60));
  console.log('🍷 配置阿里Z-Image API');
  console.log('='.repeat(60) + '\n');

  if (!apiKey || apiKey.trim() === '') {
    console.log('❌ 未提供API密钥');
    return false;
  }

  // 保存到 .env 文件
  const envPath = path.join(__dirname, '.env');
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf-8');
  }

  // 更新或添加ZIMAGE_API_KEY
  const regex = /^ZIMAGE_API_KEY=.*/m;
  if (regex.test(envContent)) {
    envContent = envContent.replace(regex, `ZIMAGE_API_KEY=${apiKey.trim()}`);
  } else {
    envContent += `\n# 阿里Z-Image API\nZIMAGE_API_KEY=${apiKey.trim()}\n`;
  }

  fs.writeFileSync(envPath, envContent);

  console.log('✅ Z-Image API配置成功！');
  console.log(`   ZIMAGE_API_KEY=已保存到 .env 文件\n`);

  // 测试API
  console.log('正在测试API...\n');
  
  try {
    const response = await fetch(
      'https://api.modelscope.cn/v1/images/generations',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'z-image-turbo',
          prompt: 'A crystal wine glass with red wine, dark background',
          negative_prompt: 'blurry, low quality',
          steps: 8,
          width: 1024,
          height: 1024
        })
      }
    );
    
    console.log('响应状态:', response.status);
    
    if (!response.ok) {
      const error = await response.text();
      console.log('❌ API测试失败:', error);
      return false;
    }
    
    const data = await response.json();
    
    if (data.data && data.data[0] && data.data[0].image) {
      console.log('✅ API测试成功！');
      console.log('图片大小:', Math.round(data.data[0].image.length / 1024), 'KB');
      return true;
    } else {
      console.log('❌ 响应格式不正确');
      console.log('响应:', JSON.stringify(data, null, 2).substring(0, 500));
      return false;
    }
    
  } catch (err) {
    console.log('❌ 错误:', err.message);
    return false;
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const apiKey = process.argv[2];
  configureZImage(apiKey).then(success => {
    if (success) {
      console.log('\n配置完成！现在可以使用阿里Z-Image生成AI写实封面了：');
      console.log('  node ai-image-generator.js "标题" "副标题" "luxury" "2026-03"\n');
    }
    process.exit(success ? 0 : 1);
  });
}

module.exports = { configureZImage };
