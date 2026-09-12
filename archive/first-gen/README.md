# 第一代流水线（已归档）

「抓取新闻 → 汇总去重 → LLM 生成文章 → 发布公众号」的自动化流水线。
它是仓库最早的一代实现，后被 `engine/` 渲染引擎（数据结构化 + 模板渲染）取代。

```
crawler/aggregator/generator/publisher  ──►  公众号草稿
   RSS / 网站 / 新闻 API                         （第一代）
```

## 为什么归档

1. **停滞**：核心脚本与调度器的最后改动停在 2026-03~04，此后无人维护。
2. **未验证**：其测试一度与实际实现严重脱节（已修复），但流水线本身从未验证可用。
3. **重复**：当前实际生产用的是 `engine/` 渲染引擎，走 `articles/*.json` 数据源；
   第一代的封面生成、发布逻辑与引擎重复。
4. **未被引用**：活跃代码（`engine/`、`tools/`）对其零依赖。

## 目录内容

| 文件 | 职责 |
|---|---|
| `index.js` | 第一代主入口（crawl → aggregate → generate → publish） |
| `crawler.js` / `enhanced-crawler.js` / `enhanced-sources.js` | 多源抓取 |
| `aggregator.js` | 汇总、分类、去重、质量评分 |
| `generator.js` | 调用 LLM 生成文章 |
| `publisher.js` | 微信公众号发布 |
| `scheduler.js` / `daily-scheduler.js` / `start-daily.js` | 定时调度 |
| `publish-daily-news.js` / `publish-buying-guide.js` / `publish-analysis-report.js` | 每日三类稿件脚本 |
| `deduplicator.js` / `quality-scorer.js` | 去重与质量评分 |
| `newsApis.js` / `parallel-fetcher.js` / `robots_check.js` | 抓取支撑 |
| `config.js` | 第一代完整配置（采集 / LLM / 聚合 / Redis / 数据库 / 发布） |
| `cache-manager.js` / `utils.js` / `errors.js` / `logger.js` / `helpers.js` | 基础设施 |
| `health.js` / `health-endpoint.js` | 健康指标与 `/health` 端点 |
| `validate-config.js` | 配置校验 |
| `tests/` | 上述模块的测试（12 个套件） |
| `docs/` | 第一代文档（信息源、每日调度、部署、快速开始） |
| `content/` | 早期内容草稿（Markdown） |
| `Dockerfile` / `docker-compose.yml` | 第一代容器化配置（已随流水线归档） |

## 留在仓库根目录的共享模块

归档代码仍会引用以下模块，它们**留在根目录**，因为活跃代码也在用：

- `../../proxy.js` —— `tools/check-wechat-ip.js` 也在用

第一代的配置已内聚为归档区自带的 `./config.js`（根目录 `config.js` 已精简为仅供引擎的 publish 段）。

## 如何复活

1. 补齐第一代专属依赖（已从根 `package.json` 移除）：

   ```bash
   npm i cheerio date-fns ioredis jsdom lodash openai rss-parser turndown uuid
   ```

2. 配置 `.env`（参考根目录 `.env.example` 中的相关项）。
3. 运行测试：

   ```bash
   npx jest --config archive/first-gen/jest.config.js
   ```

4. 运行主流程：

   ```bash
   node archive/first-gen/index.js
   ```

> 复活前建议先评估：这些能力是否应改由 `engine/` 承接（例如让抓取结果直接产出
> `articles/*.json`），而不是恢复一套与引擎并行的旧管线。
