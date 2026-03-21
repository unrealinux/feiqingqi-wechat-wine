/**
 * AI图片生成API配置向导
 * 支持智谱AI、阿里Z-Image、Google Gemini
 */
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function prompt(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('🍷 AI图片生成API配置向导');
  console.log('='.repeat(60) + '\n');

  console.log('请选择您要配置的API:\n');
  console.log('1. 智谱AI (GLM) - 推荐 ⭐');
  console.log('   - 国内服务器，速度快');
  console.log('   - 中文优化，效果好');
  console.log('   - 免费15积分 (~50张图片)');
  console.log('   - 注册: https://open.bigmodel.cn\n');

  console.log('2. 阿里Z-Image (ModelScope)');
  console.log('   - 国内服务器');
  console.log('   - 有免费额度');
  console.log('   - 注册: https://www.modelscope.cn\n');

  console.log('3. Google Gemini');
  console.log('   - 国际服务器');
  console.log('   - 每天免费500张');
  console.log('   - 注册: https://aistudio.google.com/app/apikey\n');

  console.log('4. 跳过配置（继续使用矢量风格）\n');

  const choice = await prompt('请选择 (1/2/3/4): ');

  let apiKey = '';
  let apiName = '';
  let apiDesc = '';

  switch (choice.trim()) {
    case '1':
      apiName = 'GLM_API_KEY';
      apiDesc = '智谱AI';
      console.log('\n📌 智谱AI配置步骤：');
      console.log('1. 打开浏览器访问: https://open.bigmodel.cn');
      console.log('2. 点击右上角「登录/注册」（微信扫码或手机号）');
      console.log('3. 登录后进入「控制台」');
      console.log('4. 左侧菜单点击「API密钥」');
      console.log('5. 点击「新建API密钥」按钮');
      console.log('6. 复制生成的密钥（格式: sk-xxxxxxxx）\n');
      apiKey = await prompt('请粘贴您的智谱AI API密钥: ');
      break;

    case '2':
      apiName = 'ZIMAGE_API_KEY';
      apiDesc = '阿里Z-Image';
      console.log('\n📌 阿里Z-Image配置步骤：');
      console.log('1. 打开浏览器访问: https://www.modelscope.cn');
      console.log('2. 注册/登录账号');
      console.log('3. 进入「个人中心」');
      console.log('4. 点击「访问令牌」');
      console.log('5. 创建并复制令牌\n');
      apiKey = await prompt('请粘贴您的ModelScope API令牌: ');
      break;

    case '3':
      apiName = 'GEMINI_API_KEY';
      apiDesc = 'Google Gemini';
      console.log('\n📌 Google Gemini配置步骤：');
      console.log('1. 打开浏览器访问: https://aistudio.google.com/app/apikey');
      console.log('2. 登录Google账号');
      console.log('3. 点击「Create API key」');
      console.log('4. 复制生成的密钥\n');
      apiKey = await prompt('请粘贴您的Gemini API密钥: ');
      break;

    default:
      console.log('\n跳过API配置，继续使用矢量风格封面。');
      rl.close();
      return;
  }

  if (!apiKey || apiKey.trim() === '') {
    console.log('\n❌ 未输入API密钥，配置取消。');
    rl.close();
    return;
  }

  // 保存到 .env 文件
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

  fs.writeFileSync(envPath, envContent);

  console.log(`\n✅ ${apiDesc} API配置成功！`);
  console.log(`   ${apiName}=已保存到 .env 文件\n`);

  // 测试配置
  console.log('正在测试API配置...\n');
  
  try {
    const { generateWineCover } = require('./ai-image-generator');
    const result = await generateWineCover({
      title: '🍷 AI封面测试',
      subtitle: '配置成功',
      element: 'wineglass',
      date: new Date().toISOString().slice(0, 7)
    });
    
    console.log('✅ API测试成功！');
    console.log(`📁 测试封面: ${result.path}`);
    console.log(`📌 使用提供商: ${result.provider}\n`);
    
    console.log('现在您可以生成写实风格封面了：');
    console.log('  node ai-image-generator.js "标题" "副标题" "元素" "日期"\n');
    console.log('示例:');
    console.log('  node ai-image-generator.js "🍷 2026葡萄酒投资" "市场分析" "luxury" "2026-03"\n');
    
  } catch (err) {
    console.log('⚠️ API测试失败:', err.message);
    console.log('请检查API密钥是否正确，或稍后再试。\n');
  }

  rl.close();
}

main().catch(console.error);
