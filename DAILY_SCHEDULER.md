# 每日自动发布配置指南

## 📋 概述

系统支持每天自动生成并发布3篇葡萄酒文章到微信公众号草稿箱：

| 序号 | 文章类型 | 内容 |
|------|---------|------|
| 1 | 投资分析 | Liv-ex指数、名庄价格、拍卖市场分析 |
| 2 | 购买推荐 | 高性价比酒款、场景推荐、趋势品种 |
| 3 | 行业快讯 | 最新动态、价格异动、企业事件 |

---

## 🚀 运行方式

### 方式1：手动运行

```bash
# 运行所有3篇文章
node daily-scheduler.js

# 或单独运行某一篇
node publish-analysis-report.js
node publish-buying-guide.js
node publish-daily-news.js
```

### 方式2：定时任务（推荐）

#### Windows 任务计划程序

1. 打开「任务计划程序」
2. 创建基本任务
3. 设置触发器：每天
4. 设置操作：启动程序
   - 程序：`node`
   - 参数：`daily-scheduler.js`
   - 起始目录：`E:\Project\feiqingqiWechatMP`

#### Linux/Mac Cron

```bash
# 编辑 crontab
crontab -e

# 添加定时任务（每天早上9点运行）
0 9 * * * cd /path/to/project && node daily-scheduler.js >> logs/cron.log 2>&1
```

#### 使用 node-cron（Node.js内置）

```javascript
// start-daily.js
const cron = require('node-cron');
const { main } = require('./daily-scheduler');

// 每天早上9点运行
cron.schedule('0 9 * * *', async () => {
  console.log('开始每日发布任务...');
  await main();
});

console.log('定时任务已启动，每天早上9点执行');
```

---

## ⚙️ 配置说明

### 环境变量

确保 `.env` 文件包含以下配置：

```env
# 微信公众号配置
WECHAT_APPID=wx1e5b38ae39297ce6
WECHAT_SECRET=6a039c03485d1b158ada96498543fe6a
WECHAT_TEST_MODE=true
WECHAT_AUTO_PUBLISH=true

# AI图片生成配置
ZIMAGE_API_KEY=ms-07ccb819-aac6-408d-982c-ed3e141db420

# 禁用代理（微信API需要直连）
HTTP_PROXY=
HTTPS_PROXY=
```

### 修改文章类型

编辑 `daily-scheduler.js` 中的 `CONFIG.articles` 数组：

```javascript
const CONFIG = {
  articles: [
    {
      name: '投资分析',
      script: 'publish-analysis-report.js',
      description: 'Liv-ex指数、名庄价格、拍卖市场',
    },
    // 添加更多文章类型...
  ],
};
```

---

## 📊 查看结果

### 草稿箱

登录微信公众号后台查看草稿：
- 地址：https://mp.weixin.qq.com
- 路径：内容与互动 → 草稿箱

### 日志文件

```
logs/daily-publish.log      # 运行日志
output/daily_report_*.json  # 每日报告
```

---

## 🔧 故障排查

### 问题1：微信API返回IP白名单错误

**解决方案**：在微信公众号后台添加当前IP到白名单

### 问题2：AI图片生成失败

**解决方案**：检查 ZIMAGE_API_KEY 是否正确配置

### 问题3：代理干扰

**解决方案**：确保脚本运行时禁用了代理

---

## 📅 定时任务示例

### 每天早上9点运行

```bash
# Linux/Mac
0 9 * * * cd /path/to/project && node daily-scheduler.js

# Windows 任务计划程序
触发器：每天 09:00
操作：node daily-scheduler.js
```

### 每天3次（早上、中午、晚上）

```bash
# Linux/Mac
0 9,13,19 * * * cd /path/to/project && node daily-scheduler.js
```

---

## 📝 更新记录

- 2026-03-21：创建每日自动发布系统
- 支持3种文章类型：投资分析、购买推荐、行业快讯
- 自动生成AI写实封面
- 自动发布到微信草稿箱
