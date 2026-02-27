# 红酒文章采集发布系统

## 功能

- 多源数据采集 (RSS, 新闻API, 网站爬取)
- AI文章生成
- 微信公众号自动发布

## 快速开始

### 使用Docker运行

```bash
# 1. 复制环境配置
cp .env.example .env

# 2. 编辑 .env 文件，配置必要的API密钥

# 3. 构建并运行
docker-compose up -d
```

### 使用Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    env_file:
      - .env
    volumes:
      - ./output:/app/output
      - ./logs:/app/logs
    restart: unless-stopped
    environment:
      - NODE_ENV=production

  # 可选：Redis缓存
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  redis_data:
```

### 使用PM2运行

```bash
# 安装依赖
npm install

# 启动生产模式
pm2 start index.js --name wine-aggregator

# 查看日志
pm2 logs wine-aggregator

# 监控状态
pm2 monit
```

## 环境变量

| 变量 | 必填 | 说明 |
|------|------|------|
| LLM_PROVIDER | 是 | LLM提供商 |
| LLM_API_KEY | 是 | API密钥 |
| WECHAT_APPID | 是 | 公众号AppID |
| WECHAT_SECRET | 是 | 公众号Secret |
| RSS_SOURCES | 否 | RSS源(逗号分隔) |

## 目录结构

```
.
├── Dockerfile          # Docker镜像
├── docker-compose.yml # Docker编排
├── .dockerignore     # Docker忽略文件
└── ...
```

## 监控

健康检查端点:
- `/health` - 服务健康状态
- `/metrics` - 性能指标

## 许可证

MIT
