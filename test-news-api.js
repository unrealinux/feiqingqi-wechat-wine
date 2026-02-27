/**
 * 测试新闻API配置
 * 
 * 使用方法：
 * 1. 先在 .env 文件中配置你的 API Key
 * 2. 运行: node test-news-api.js
 */

require('dotenv').config();
const { NewsApiSource } = require('./newsApis');

async function test() {
  console.log('='.repeat(50));
  console.log('新闻API配置测试');
  console.log('='.repeat(50));
  
  // 检查配置
  console.log('\n📋 检查配置...');
  console.log(`  聚合数据 API Key: ${process.env.JUHE_API_KEY ? '✅ 已配置' : '❌ 未配置'}`);
  console.log(`  天行数据 API Key: ${process.env.TIANAPI_KEY ? '✅ 已配置' : '❌ 未配置'}`);
  
  if (!process.env.JUHE_API_KEY && !process.env.TIANAPI_KEY) {
    console.log('\n❌ 未配置任何API Key！');
    console.log('\n请按以下步骤获取免费API Key：');
    console.log('\n📌 聚合数据 (50次/天免费):');
    console.log('   1. 访问: https://www.juhe.cn/register');
    console.log('   2. 注册账号并登录');
    console.log('   3. 申请 "新闻头条" API: https://www.juhe.cn/docs/api/id/235');
    console.log('   4. 在 "个人中心" → "我的API" 获取Key');
    console.log('   5. 将Key填入 .env 文件的 JUHE_API_KEY');
    
    console.log('\n📌 天行数据 (100次/天免费):');
    console.log('   1. 访问: https://www.tianapi.com/register');
    console.log('   2. 注册账号并登录');
    console.log('   3. 在控制台获取API Key');
    console.log('   4. 将Key填入 .env 文件的 TIANAPI_KEY');
    
    process.exit(1);
  }
  
  // 测试API
  console.log('\n🔍 测试API调用...');
  const newsApi = new NewsApiSource();
  
  try {
    const articles = await newsApi.fetchAll(['红酒', '葡萄酒']);
    
    console.log('\n📊 测试结果:');
    console.log(`  获取文章数: ${articles.length}`);
    
    if (articles.length > 0) {
      console.log('\n📰 前3篇文章:');
      articles.slice(0, 3).forEach((article, i) => {
        console.log(`\n  ${i + 1}. ${article.title}`);
        console.log(`     来源: ${article.source}`);
        console.log(`     类型: ${article.type}`);
      });
      
      console.log('\n✅ 新闻API配置成功！');
    } else {
      console.log('\n⚠️ 未获取到文章，请检查API Key是否正确');
    }
  } catch (error) {
    console.log('\n❌ 测试失败:', error.message);
  }
}

test();
