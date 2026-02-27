# 红酒文章采集发布系统 - 快速开始

## 环境要求
- Node.js 18+
- npm 或 yarn

## 安装步骤

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
```bash
cp .env.example .env
```

编辑 `.env` 文件：
```env
# OpenAI API Key（必需，用于AI生成文章）
OPENAI_API_KEY=sk-xxxxxxxx

# 微信公众号配置（用于自动发布）
WECHAT_APPID=wx123456789
WECHAT_SECRET=xxxxxxxxx
WECHAT_TOKEN=xxxxxxxxx

# 数据库（可选）
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=wine_articles

# Redis（可选）
REDIS_HOST=localhost
REDIS_PORT=6379
```

## 使用方法

### 方式一：手动执行（单次）
```bash
npm start
```
这将执行完整的采集-汇总-生成-发布流程。

### 方式二：分别执行各步骤
```bash
npm run crawl      # 仅采集
npm run generate   # 仅生成文章
npm run publish    # 仅发布
npm run all        # 完整流程
```

### 方式三：定时自动执行
```bash
node index.js --schedule
```
系统将在每天早上8点自动执行。

## 配置说明

### RSS源配置
在 `config.js` 中可以添加更多RSS源：
```javascript
rssSources: [
  'https://your-rss-feed-1.com/rss',
  'https://your-rss-feed-2.com/rss',
],
```

### 关键词配置
添加更多搜索关键词：
```javascript
keywords: [
  '红酒',
  '葡萄酒',
  'wine',
  '品酒笔记',
  // 添加更多...
],
```

## 输出文件

生成的公众号文章会保存到：
- `output/wine_article_<时间戳>.json` - JSON格式
- `output/wine_article_<时间戳>.html` - HTML格式（可直接预览）

## 常见问题

### 1. OpenAI API调用失败
- 检查API Key是否正确
- 确认API余额充足
- 网络是否能访问OpenAI

### 2. 微信公众号发布失败
- 检查AppID和Secret是否正确
- 确认公众号已开通发布权限
- 查看access_token是否过期

### 3. 采集不到内容
- 检查RSS源是否可用
- 确认网站是否有限制
- 增加请求超时时间

## 自定义修改

### 修改文章风格
在 `config.js` 中修改生成配置：
```javascript
generate: {
  style: '你的文章风格要求',
  targetLength: 3000,  // 目标字数
  temperature: 0.5,    // 生成随机性
}
```

### 添加新的数据源
在 `crawler.js` 中添加新的采集方法：
```javascript
async crawlFromNewSource() {
  // 你的采集逻辑
}
```

## 目录结构

```
wine-article-system/
├── index.js           # 主入口
├── crawler.js         # 数据采集
├── aggregator.js     # 内容汇总
├── generator.js       # AI生成
├── publisher.js       # 公众号发布
├── config.js          # 配置文件
├── utils.js           # 工具函数
├── .env               # 环境变量
├── package.json
└── output/            # 生成的文章
```

## 技术栈
- **Axios** - HTTP请求
- **Cheerio** - HTML解析
- **RSS-Parser** - RSS订阅
- **OpenAI GPT-4** - AI内容生成
- **Turndown** - HTML转Markdown
- **Node-Cron** - 定时任务
