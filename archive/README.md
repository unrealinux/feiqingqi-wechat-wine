# archive/ —— 归档区

这里的代码**不属于当前产品**，保留的目的是：

- 留下历史实现，供将来需要时参考或复活；
- 让活跃目录（`engine/`、`tools/`、`articles/`）只包含真正在维护的东西；
- 避免归档代码继续占用 CI、lint、依赖与重构注意力。

归档不等于删除：完整历史仍在 git 中，这里也保留了可运行的代码与测试。

## 内容

| 目录 | 说明 |
|---|---|
| `first-gen/` | 第一代「新闻聚合」流水线（crawler → aggregator → generator → publisher）及其调度器、文档、容器配置 |

## 与活跃代码的关系

`first-gen/` 已不再被任何活跃代码引用。少数通用模块**留在仓库根目录**，因为它们仍被活跃代码使用：

| 根目录模块 | 使用方 |
|---|---|
| `config.js` | `engine/wechat.js` |
| `proxy.js` | `tools/check-wechat-ip.js` |
| `webhook.js` | `tools/notifier.js` |

归档代码通过 `require('../../config')` / `require('../../proxy')` 引用它们。

## 运行归档测试

归档测试不参与 `npm test`（`jest.config.js` 已通过 `testPathIgnorePatterns` 排除）。单独运行：

```bash
npx jest --config archive/first-gen/jest.config.js
```

> 注意：为精简活跃依赖，`package.json` 已移除第一代专属依赖。
> 运行归档代码/测试前需先补齐（见 `first-gen/README.md`）。
