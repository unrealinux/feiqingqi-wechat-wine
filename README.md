# 红酒文章采集和发布系统

## 功能概述

本系统用于：
1. **自动采集** - 从多个源头采集最新红酒相关文章
2. **智能汇总** - 去重、分类、提取关键信息
3. **AI生成** - 使用LLM生成高质量微信公众号文章
4. **自动发布** - 自动发布到微信公众号

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env
# 编辑.env文件，填入API密钥等配置

# 3. 运行完整流程
npm run all
```

## 目录结构

```
├── crawler.js          # 数据采集模块
├── aggregator.js       # 内容聚合模块
├── generator.js        # AI生成模块
├── publisher.js        # 公众号发布模块
├── config.js           # 配置文件
├── utils.js            # 工具函数
├── .env                 # 环境变量（需手动创建）
└── README.md           # 说明文档
## RSS 源配置

### 默认RSS源
系统默认包含以下RSS源：
- wine-world.com
- decanter.com
- vinepair.com
- wine-searcher.com

### 自定义RSS源
通过环境变量配置：

```bash
# Windows
set RSS_SOURCES=https://site1.com/rss.xml,https://site2.com/rss.xml

# Linux/Mac
export RSS_SOURCES="https://site1.com/rss.xml,https://site2.com/rss.xml"
```

## 配置项

在 `.env` 文件中配置：

```env
# OpenAI API（用于AI生成文章）
OPENAI_API_KEY=your_api_key

# 微信公众号配置
WECHAT_APPID=your_appid
WECHAT_SECRET=your_secret
WECHAT_TOKEN=your_token

# 数据库配置（可选）
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=wine_articles

# Redis配置（可选，用于去重）
REDIS_HOST=localhost
REDIS_PORT=6379
```

## 数据源

系统默认采集以下类型的红酒相关信息：
- 红酒新闻和评测
- 产区动态
- 品酒笔记
- 行业趋势
- 专业知识科普
