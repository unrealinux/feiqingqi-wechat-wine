/**
 * 使用AI写实封面发布文章到微信
 */
require('dotenv').config();
const WeChatPublisher = require('./publisher');
const fs = require('fs');
const path = require('path');

async function publishWithAICover() {
  console.log('='.repeat(60));
  console.log('🍷 使用AI写实封面发布文章');
  console.log('='.repeat(60));
  console.log('');
  
  // 1. 检查封面文件
  const coverPath = path.join(__dirname, 'output', 'zimage_wine_cover.png');
  if (!fs.existsSync(coverPath)) {
    console.log('❌ 封面文件不存在:', coverPath);
    console.log('请先运行: node generate-zimage-cover.js');
    return;
  }
  
  console.log('✅ 使用AI写实封面:', coverPath);
  console.log('   文件大小:', Math.round(fs.statSync(coverPath).size / 1024), 'KB');
  console.log('');
  
  // 2. 读取文章内容
  const articlePath = path.join(__dirname, 'output', 'wine_article_20260319.md');
  if (!fs.existsSync(articlePath)) {
    console.log('❌ 文章文件不存在:', articlePath);
    return;
  }
  
  const articleContent = fs.readFileSync(articlePath, 'utf-8');
  console.log('✅ 读取文章成功');
  console.log('');
  
  // 3. 转换为HTML格式
  const htmlContent = articleContent
    .replace(/^# (.+)$/gm, '') // 移除主标题
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^\*\*(.+)\*\*$/gm, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
  
  // 4. 准备文章对象
  const article = {
    title: '🍷 2024年红酒趋势大揭秘：新产区与消费革新',
    subtitle: '深入解析红酒行业的新动向与市场转变',
    content: htmlContent,
    abstract: '红酒市场总是在不断变化，每年都有新的趋势和机遇。本文深入解析红酒行业的新动向与市场转变，包括新产区崛起、消费者偏好变化和品鉴技巧。',
    tags: ['红酒', '市场趋势', '消费者偏好', '品酒技巧', '产区动态'],
    thumbUrl: 'https://mmbiz.qpic.cn/mmbiz_jpg/iczrWQP9piaCicic3ia0pTwliczicz0VJ6iciaLibniaCibibfF9rT2G0icicnN9aG5s5hR7sN7icicnQ8icicicicicf3icib9ib4g/0'
  };
  
  console.log('文章信息:');
  console.log('  标题:', article.title);
  console.log('  字数:', article.content.length);
  console.log('  标签:', article.tags.join(', '));
  console.log('');
  
  // 5. 发布到微信
  console.log('正在发布到微信公众号...');
  console.log('');
  
  const publisher = new WeChatPublisher();
  
  try {
    const result = await publisher.publish(article);
    
    console.log('');
    console.log('='.repeat(60));
    console.log('📋 发布结果');
    console.log('='.repeat(60));
    console.log('');
    console.log('状态:', result.success ? '✅ 成功' : '❌ 失败');
    
    if (result.draftId) {
      console.log('草稿ID:', result.draftId);
    }
    
    if (result.url) {
      console.log('文章URL:', result.url);
    }
    
    if (result.media_id) {
      console.log('封面媒体ID:', result.media_id);
    }
    
    if (result.error) {
      console.log('错误信息:', result.error);
    }
    
    console.log('');
    
    if (result.success) {
      console.log('🎉 文章已成功发布到微信公众号草稿箱！');
      console.log('');
      console.log('下一步:');
      console.log('1. 登录微信公众号后台');
      console.log('2. 进入「草稿箱」');
      console.log('3. 预览并发布文章');
    }
    
    return result;
    
  } catch (err) {
    console.log('❌ 发布失败:', err.message);
    return null;
  }
}

publishWithAICover();
