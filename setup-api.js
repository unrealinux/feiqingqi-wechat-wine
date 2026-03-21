/**
 * 简化版AI图片生成配置脚本
 * 支持智谱AI (推荐) / 阿里Z-Image / Google Gemini
 */
require('dotenv').config();
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function setupAPI() {
  console.log('\n' + '='.repeat(60));
  console.log('🍷 设置AI图片生成API');
  console.log('='.repeat(60) + '\n');

  console.log('请选择您要配置的API（输入数字）：\n');
  console.log('1. 智谱AI (GLM) - 推荐，中文优化，国内服务器');
  console.log('2. 阿里Z-Image - 阿里通义实验室，国内服务器');
  console.log('3. Google Gemini - 免费额度大，国际服务器');
  console.log('4. 跳过配置，继续使用矢量风格\n');

  const choice = await new Promise(resolve => {
    rl.question('请选择 (1/2/3/4): ', resolve);
  });

  let apiKey = '';
  let apiName = '';

  switch (choice) {
    case '1':
      apiName = 'GLM_API_KEY';
      console.log('\n📌 智谱AI 配置：');
      console.log('   1. 访问 https://open.bigmodel.cn');
      console.log('   2. 注册并登录');
      console.log('   3. 进入控制台 → API密钥');
      console.log('   4. 复制密钥并粘贴到下面：');
      apiKey = await new Promise(resolve => {
        rl.question('\n请输入 GLM API 密钥: ', resolve);
      });
      break;

    case '2':
      apiName = 'ZIMAGE_API_KEY';
      console.log('\n📌 阿里Z-Image 配置：');
      console.log('   1. 访问 https://www.modelscope.cn');
      console.log('   2. 注册并登录');
      console.log('   3. 进入个人中心 → 访问令牌');
      console.log('   4. 复制令牌并粘贴到下面：');
      apiKey = await new Promise(resolve => {
        rl.question('\n请输入 Z-Image API 令牌: ', resolve);
      });
      break;

    case '3':
      apiName = 'GEMINI_API_KEY';
      console.log('\n📌 Google Gemini 配置：');
      console.log('   1. 访问 https://aistudio.google.com/app/apikey');
      console.log('   2. 创建API密钥');
      console.log('   3. 复制密钥并粘贴到下面：');
      apiKey = await new Promise(resolve => {
        rl.question('\n请输入 Gemini API 密钥: ', resolve);
      });
      break;

    default:
      console.log('\n❌ 跳过API配置，继续使用矢量风格封面');
      rl.close();
      return;
  }

  if (apiKey.trim()) {
    // 读取当前 .env 文件
    const envPath = path.join(__dirname, '.env');
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf-8');
    }

    // 更新或添加API密钥
    const regex = new RegExp(`^${apiName}=.*`, 'm');
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `${apiName}=${apiKey.trim()}`);
    } else {
      envContent += `\n${apiName}=${apiKey.trim()}\n`;
    }

    // 写入文件
    fs.writeFileSync(envPath, envContent);

    console.log('\n✅ API密钥配置成功！');
    console.log(`   ${apiName}=已设置`);
    console.log('\n现在您可以生成写实风格封面了！');
    console.log('命令: node generate-realistic-cover.js\n');
  }

  rl.close();
}

setupAPI().catch(console.error);
