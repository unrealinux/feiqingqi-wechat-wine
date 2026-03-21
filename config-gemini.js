/**
 * Google Gemini API 自动配置脚本
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');

async function configureGemini(apiKey) {
  console.log('\n' + '='.repeat(60));
  console.log('🍷 配置Google Gemini API');
  console.log('='.repeat(60) + '\n');

  if (!apiKey || apiKey.trim() === '') {
    console.log('❌ 未提供API密钥');
    return false;
  }

  // 验证API密钥格式
  if (!apiKey.trim().startsWith('AIza')) {
    console.log('⚠️ 警告：API密钥格式可能不正确');
    console.log('   Google Gemini密钥通常以 "AIza" 开头');
    console.log('   继续配置...\n');
  }

  // 读取或创建 .env 文件
  const envPath = path.join(__dirname, '.env');
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf-8');
  }

  // 更新或添加GEMINI_API_KEY
  const regex = /^GEMINI_API_KEY=.*/m;
  if (regex.test(envContent)) {
    envContent = envContent.replace(regex, `GEMINI_API_KEY=${apiKey.trim()}`);
  } else {
    envContent += `\n# Google Gemini API\nGEMINI_API_KEY=${apiKey.trim()}\n`;
  }

  // 写入文件
  fs.writeFileSync(envPath, envContent);

  console.log('✅ Gemini API配置成功！');
  console.log(`   GEMINI_API_KEY=已保存到 .env 文件\n`);

  // 测试API
  console.log('正在测试API...\n');
  
  try {
    const { generateWineCover } = require('./ai-image-generator');
    const result = await generateWineCover({
      title: '🍷 AI封面测试',
      subtitle: 'Gemini配置成功',
      element: 'wineglass',
      date: new Date().toISOString().slice(0, 7)
    });
    
    console.log('✅ API测试成功！');
    console.log(`📁 测试封面: ${result.path}`);
    console.log(`📌 使用提供商: ${result.provider}\n`);
    
    return true;
  } catch (err) {
    console.log('⚠️ API测试失败:', err.message);
    console.log('请检查API密钥是否正确\n');
    return false;
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const apiKey = process.argv[2];
  configureGemini(apiKey).then(success => {
    if (success) {
      console.log('配置完成！现在可以生成AI写实封面了：');
      console.log('  node ai-image-generator.js "标题" "副标题" "luxury" "2026-03"\n');
    }
    process.exit(success ? 0 : 1);
  });
}

module.exports = { configureGemini };
