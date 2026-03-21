/**
 * AI图片生成配置向导
 */
const fs = require('fs');
const path = require('path');

// 读取当前的 .env 文件
const envPath = path.join(__dirname, '.env');
const envExists = fs.existsSync(envPath);

let envContent = '';
if (envExists) {
  envContent = fs.readFileSync(envPath, 'utf-8');
}

console.log('='.repeat(60));
console.log('🍷 AI图片生成配置向导');
console.log('='.repeat(60));
console.log('');

// 检查是否已有配置
const hasGLM = envContent.includes('GLM_API_KEY=');
const hasZImage = envContent.includes('ZIMAGE_API_KEY=');
const hasGemini = envContent.includes('GEMINI_API_KEY=');

console.log('当前配置状态：');
console.log(`  ${hasGLM ? '✅' : '❌'} 智谱AI (GLM)`);
console.log(`  ${hasZImage ? '✅' : '❌'} 阿里Z-Image`);
console.log(`  ${hasGemini ? '✅' : '❌'} Google Gemini`);
console.log('');

// 提供配置指南
console.log('配置指南：');
console.log('');
console.log('1️⃣ 智谱AI (推荐 - 中文优化)');
console.log('   注册地址: https://open.bigmodel.cn');
console.log('   免费额度: 15积分 (约50张图片)');
console.log('   配置方式: 在 .env 文件中添加 GLM_API_KEY=您的密钥');
console.log('');
console.log('2️⃣ 阿里Z-Image (国内服务器)');
console.log('   注册地址: https://www.modelscope.cn');
console.log('   免费额度: 有免费额度');
console.log('   配置方式: 在 .env 文件中添加 ZIMAGE_API_KEY=您的令牌');
console.log('');
console.log('3️⃣ Google Gemini (国际 - 免费额度大)');
console.log('   注册地址: https://aistudio.google.com/app/apikey');
console.log('   免费额度: 每天500张');
console.log('   配置方式: 在 .env 文件中添加 GEMINI_API_KEY=您的密钥');
console.log('');
console.log('='.repeat(60));
console.log('');
console.log('配置完成后，运行以下命令生成写实封面：');
console.log('  node generate-realistic-cover.js');
console.log('');
console.log('或使用智能封面生成器：');
console.log('  node enhanced-cover-generator.js');
console.log('');
