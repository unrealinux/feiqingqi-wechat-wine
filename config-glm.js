/**
 * 智谱AI API 配置脚本
 */
const fs = require('fs');
const path = require('path');

const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

async function configureGLM() {
  console.log('\n' + '='.repeat(60));
  console.log('🍷 配置智谱AI API');
  console.log('='.repeat(60) + '\n');

  console.log('📌 智谱AI (GLM) 是目前最适合中文内容的AI图片生成服务：\n');
  console.log('  ✅ 国内服务器，访问速度快');
  console.log('  ✅ 中文优化，效果更好');
  console.log('  ✅ 免费15积分，约可生成50张图片');
  console.log('  ✅ 无需信用卡\n');

  console.log('获取API密钥步骤：\n');
  console.log('  1. 打开浏览器，访问：https://open.bigmodel.cn');
  console.log('  2. 注册账号（微信/手机号登录）');
  console.log('  3. 进入「控制台」→「API密钥」页面');
  console.log('  4. 点击「新建API密钥」');
  console.log('  5. 复制生成的密钥（以 sk- 开头）\n');

  const apiKey = await new Promise(resolve => {
    rl.question('请粘贴您的智谱AI API密钥（以 sk- 开头）: ', resolve);
  });

  if (!apiKey || !apiKey.trim()) {
    console.log('\n❌ 未输入密钥，配置取消。');
    rl.close();
    return;
  }

  // 验证密钥格式
  if (!apiKey.trim().startsWith('sk-')) {
    console.log('\n⚠️ 警告：密钥格式似乎不正确。');
    console.log('  智谱AI密钥应该以 "sk-" 开头');
    console.log('  继续配置可能会失败。\n');
  }

  // 读取或创建 .env 文件
  const envPath = path.join(__dirname, '.env');
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf-8');
  }

  // 更新或添加GLM_API_KEY
  const regex = /^GLM_API_KEY=.*/m;
  if (regex.test(envContent)) {
    envContent = envContent.replace(regex, `GLM_API_KEY=${apiKey.trim()}`);
  } else {
    envContent += `\nGLM_API_KEY=${apiKey.trim()}\n`;
  }

  // 写入文件
  fs.writeFileSync(envPath, envContent);

  console.log('\n✅ 智谱AI API配置成功！');
  console.log(`   GLM_API_KEY=已保存到 .env 文件\n`);

  console.log('您可以现在生成写实封面了：\n');
  console.log('  node ai-image-generator.js "🍷 2026葡萄酒投资" "市场分析" "luxury" "2026-02"\n');

  console.log('或者使用智能封面生成器：\n');
  console.log('  node enhanced-cover-generator.js\n');

  rl.close();
}

configureGLM().catch(console.error);
