# 红酒公众号内容系统

葡萄酒主题微信公众号的内容生产与发布。内容以**结构化数据**存储，由**渲染引擎**统一生成 HTML 与封面，再通过微信官方 API 发布为草稿。

```
articles/*.json  ──►  engine/  ──►  公众号草稿
  纯数据(唯一真相)      渲染引擎
```

## 快速开始

```bash
npm install
cp .env.example .env    # 填入 WECHAT_APPID / WECHAT_SECRET 等

# 渲染一篇文章（写到 output/）
node engine/cli.js articles/bbq_pairing.json

# 校验全部数据
npm run engine:check

# 渲染 + 生成封面 + HTML 预览
node engine/cli.js articles/bbq_pairing.json --cover --html

# 发布到公众号草稿箱
node engine/cli.js articles/bbq_pairing.json --publish

# 批量发布
node engine/cli.js --all --cover --publish
```

没有 `build_*.py`，也没有 `generate-*.js` —— 新增一篇专题只需新建一个 `articles/<name>.json`。详见 [engine/README.md](engine/README.md)。

## 目录结构

```
articles/              99 篇文章数据（唯一真相）
  _superseded/         同名冲突中被取代的版本（不参与发布）
engine/                渲染引擎
  blocks.js            17 种内容块的校验与渲染分发
  themes/              classic（第一代风格）/ rich（主题色风格）
  cover.js             封面生成（SVG -> PNG）
  wechat.js            微信 API 客户端
  article.js           数据 -> 成品文章
  cli.js               命令行入口
tools/
  extract_articles.py  从旧 build_*.py 提取数据为 JSON（AST 静态解析）
  verify_parity.js     与历史产物逐字节回归比对
tests/                 204 个测试
output/                生成产物（gitignore）
```

## 命令速查

| 命令 | 说明 |
|---|---|
| `npm run engine:check` | 校验 `articles/` 下全部数据 |
| `npm run engine:render` | 渲染全部文章并生成封面与预览 |
| `npm run engine:verify` | 与历史产物做回归比对 |
| `npm run engine:extract` | 从 `build_*.py` 提取数据（迁移工具） |
| `npm test` | 运行全部测试 |
| `npm run lint` | ESLint |

`node engine/cli.js --help` 查看全部选项。

## 测试与质量

```bash
npm test        # 204 个用例，9 个套件
npm run lint    # 0 error
```

回归比对工具会用历史产物校验引擎输出：

```
字节一致 31 ｜ 换行修正 9 ｜ 内容恢复 59 ｜ 回归 0
```

「内容恢复」指旧流水线丢弃了内容而新引擎找回了它（详见下文）。

## 安全须知

**凭据一律放在 `.env`**（已被 gitignore），不要写进代码或文档。

```env
WECHAT_APPID=
WECHAT_SECRET=
LLM_API_KEY=
GEMINI_API_KEY=
ZIMAGE_API_KEY=
```

`.gitignore` 已覆盖 `.env*`、`*.pem`、`*.pub`、`id_rsa*`、`id_ed25519*` 等。
提交前请自查：

```bash
git diff --cached | grep -iE 'secret|api[_-]?key|BEGIN .* PRIVATE KEY'
```

> 历史提示：仓库曾泄漏过微信 AppSecret、Z-Image API Key 与一个 SSH 私钥。
> 三者均已通过 `git filter-repo` 从全部历史中清除，但**已暴露的凭据必须吊销/重置**，
> 历史清理无法收回已公开的密钥。

## 项目里的两条线

| | 当前主线 | 第一代流水线 |
|---|---|---|
| 入口 | `engine/cli.js` | `index.js` |
| 内容来源 | `articles/*.json`（人工维护的结构化数据） | RSS / 网站抓取 |
| 用途 | **专题文章生产**（当前实际使用） | 新闻聚合（**目前处于停滞状态**） |
| 组成 | `engine/` | `crawler.js` + `aggregator.js` + `generator.js` + `publisher.js` |
| 调度 | 手动 / 外部定时 | `scheduler.js`、`daily-scheduler*.js` |

第一代流水线服务的是「抓取新闻并生成文章」这一引擎未覆盖的功能，因此保留。
其调度器与 `publish-*.js` 系列脚本停留在 2026-03~04，活跃度存疑，**建议人工评估后整合**。

## 历史沿革

仓库曾采用「脚本农场」模式：72 个 `build_*.py` 定义内容，编译成 211 个 `generate-*.js`，
每个脚本自带封面与发布逻辑。该模式的问题：

| 问题 | 影响 |
|---|---|
| 211 个脚本逐字重复 | 改一处要改 200 处 |
| 编译产物被提交 | 与 `build_*.py` 静默漂移 |
| `rich_article.py` 漏写 `ri` 分支 | **57 个文件、290 处内容被静默丢弃** |
| 样式写在 `<style>` 里 | 微信剥离 `<style>`，卡片/表格实际无样式 |
| 编译器用 `html.split('\n')` | 正文换行被吞 |

已全量迁移为 `articles/*.json` + `engine/`，累计找回约 **2 万字**此前从未进入文章的内容。
迁移细节与回归数据见 [engine/README.md](engine/README.md)。

## 其他文档

- [engine/README.md](engine/README.md) —— 渲染引擎、数据格式、迁移指南
- [INFORMATION_SOURCES.md](INFORMATION_SOURCES.md) —— 第一代流水线的信息源配置
- [DEPLOYMENT.md](DEPLOYMENT.md) —— 部署说明
- [DAILY_SCHEDULER.md](DAILY_SCHEDULER.md) —— 每日自动发布（第一代，当前停滞）

## 已知问题

1. **第一代流水线停滞**：`crawler/aggregator/generator/publisher` 与调度器久未更新，
   且其测试曾与实际实现严重脱节（已修复测试，但流水线本身仍未验证可用）。
2. **`deduplicator.js` / `quality-scorer.js` 尚未接线**：功能已实现且有测试覆盖，
   但 `aggregator.js` 未调用它们，README 中承诺的「去重」实际未生效。
3. **175 个 lint warning**：主要是 `no-unused-vars` 与 `require-await`。
   后者不可批量修复 —— 去掉 `async` 会改变抛错语义（同步抛出 vs 返回 rejected Promise）。
