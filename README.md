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
tests/                 254 个测试
tools/
  check-wechat-ip.js   发布前自检（出口 IP / 白名单 / 凭据）
  ip-watch.js          出口 IP 变化监控 + 告警
  notifier.js          统一通知（Webhook / 邮件）
  win/                 Windows 任务计划程序注册脚本（纯 ASCII + CRLF）
output/                生成产物（gitignore）
logs/                  日志与监控状态（gitignore）
```

## 命令速查

| 命令 | 说明 |
|---|---|
| `npm run wechat:check` | **发布前自检**：出口 IP / IP 白名单 / 凭据 |
| `npm run wechat:watch` | **常驻监控**出口 IP 变化，变了就通知你 |
| `npm run wechat:watch:once` | 检查一次（必要时通知） |
| `tools\win\setup-task.cmd` | 注册 Windows 计划任务（开机自启，见下文） |
| `npm run engine:check` | 校验 `articles/` 下全部数据 |
| `npm run engine:render` | 渲染全部文章并生成封面与预览 |
| `npm run engine:verify` | 与历史产物做回归比对 |
| `npm run engine:extract` | 从 `build_*.py` 提取数据（迁移工具） |
| `npm test` | 运行全部测试 |
| `npm run lint` | ESLint |

`node engine/cli.js --help` 查看全部选项。

## 发布前必读：IP 白名单

微信要求调用方 IP 在公众号后台的「IP 白名单」内，否则接口返回 `40164`。
这个错误会在发布流程**走到一半**时才暴露（封面已上传、草稿没建成），排查成本很高。

```bash
npm run wechat:check
```

脚本会做三件事：

1. 探测当前**出口 IP**（走与发布相同的代理路径）
2. 校验 `.env` 凭据是否齐备
3. 实际调用一次 token 接口，判断白名单是否放行

失败时会**直接给出要添加的 IP**与操作路径。其中 IP 以**微信接口自己报出的**为准
（微信的 40164 消息里会写明它看到的 IP），比任何外部回声服务都可靠 ——
本机可能同时具备 IPv4/IPv6，回声服务可能返回 IPv6，而白名单需要的是 IPv4。

> `node engine/cli.js --publish` 已内置该检查：会在**上传任何内容之前**失败，
> 不会留下「封面已传、草稿没建成」的中间态。

退出码：`0` 可发布 ｜ `1` 被阻断 ｜ `2` 凭据未配置（便于接入 CI 或发布脚本）。

### 动态 IP 监控

家用宽带多为动态 IP，换网或运营商重分配后白名单随即失效，**下一次发布才会失败**。
用常驻监控把这件事提前：

```bash
npm run wechat:watch          # 常驻，默认每天 8:00 检查（IP_WATCH_CRON 可改）
node tools/ip-watch.js --interval 60   # 或改成每 60 分钟
```

通知策略（避免刷屏）：

| 情形 | 行为 |
|---|---|
| 被白名单阻断 | 🔴 立即告警，附要添加的 IP 与操作路径 |
| 从阻断恢复 | ✅ 告知已恢复 |
| IP 变了但仍可用 | ⚠️ 提醒（换网后下次可能失效） |
| 一切正常且无变化 | 静默 |

同一个结论在 `IP_WATCH_COOLDOWN_HOURS`（默认 6 小时）内只告警一次；
IP 变化与恢复属于状态跃迁，**不受冷却期限制**。

**配置通知渠道**（都留空则只做本地检查）：

```env
# Webhook：钉钉 / 企业微信 / 飞书 / Slack / Discord
NOTIFY_WEBHOOK_TYPE=dingtalk
NOTIFY_WEBHOOK_URL=
NOTIFY_WEBHOOK_SECRET=

# 邮件
SMTP_HOST=
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=
SMTP_PASS=
MAIL_FROM=
MAIL_TO=
```

### 挂到 Windows 任务计划程序

不需要常驻终端，也不需要管理员权限（以当前用户身份、登录时运行）：

```cmd
:: 安装（默认每天 08:00）
tools\win\setup-task.cmd

:: 每 4 小时
tools\win\setup-task.cmd install HOURLY 08:00 4

:: 查看任务状态 + 日志尾部
tools\win\setup-task.cmd status

:: 立即跑一次验证
tools\win\setup-task.cmd run

:: 删除任务
tools\win\setup-task.cmd uninstall
```

实现要点（均在 `tools/win/`）：

| 文件 | 职责 |
|---|---|
| `setup-task.cmd` | 注册 / 注销 / 查看 / 立即运行，可重复执行（幂等） |
| `run-ip-watch.cmd` | 定位 node（绝对路径）、`cd` 到项目根（否则读不到 `.env`）、写日志与 1MB 轮转 |
| `run-hidden.vbs` | 消除控制台窗口闪现；并等待结束，使任务结果真实反映退出码 |

> **任务计划程序的「上次结果」会显示 `1`**，这是刻意的 —— 它不是任务执行失败，
> 而是自检发现需要你处理的问题：`0` 可发布 ｜ `1` IP 被阻断 ｜ `2` 凭据缺失 ｜ `127` 找不到 node。

> **这些脚本刻意保持纯 ASCII（英文提示）**：实测表明，含多字节字符的 `.cmd`
> 会因代码页不同而被 cmd 按字节偏移错误解析，把 `rem` 注释行当命令执行，
> 造成随机的、难以排查的失败。中文说明统一放在本文档。

> 日志在 `logs/ip-watch.log`（合法 UTF-8，含时间戳、退出码与状态判定），
> 超过 1MB 自动归档为 `.log.1`。

## 测试与质量

```bash
npm test        # 254 个用例，12 个套件
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
NOTIFY_WEBHOOK_URL=
SMTP_PASS=
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

1. **发布当前被 IP 白名单阻断** —— 本机出口 IP（`120.208.99.249`）不在白名单内，
   `--publish` 会失败。用 `npm run wechat:check` 查看并修复。
2. **第一代流水线停滞**：`crawler/aggregator/generator/publisher` 与调度器久未更新，
   且其测试曾与实际实现严重脱节（已修复测试，但流水线本身仍未验证可用）。
3. **`deduplicator.js` / `quality-scorer.js` 尚未接线**：功能已实现且有测试覆盖，
   但 `aggregator.js` 未调用它们，README 中承诺的「去重」实际未生效。
4. **180 个 lint warning**：主要是 `no-unused-vars` 与 `require-await`。
   后者不可批量修复 —— 去掉 `async` 会改变抛错语义（同步抛出 vs 返回 rejected Promise）。
