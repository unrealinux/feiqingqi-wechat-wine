# articles/_incoming/ —— 抓取草稿暂存区

本目录存放 `tools/fetch-news.js` 从 RSS 抓取后生成的**草稿**（`news_*.json`）。

## 为什么单独一个目录

`engine/cli.js --all` **只扫描 `articles/` 顶层**（`readdirSync` 非递归），
不会进入子目录。因此草稿放在这里不会被批量渲染/发布，避免把未经编辑的新闻
原文误发到公众号。

## 使用流程

```bash
# 1. 抓取（默认最多 5 条，写入本目录）
npm run news:fetch

# 也可指定源/数量，或先 dry-run 看看
node tools/fetch-news.js --source Decanter --limit 3
node tools/fetch-news.js --dry-run

# 2. 人工编辑草稿：补充观点、核对事实、调整标题与结构
#    （草稿里的 source 字段仅用于溯源，不会进入最终产物）

# 3. 校验并渲染
node engine/cli.js articles/_incoming/news_xxx.json --check
node engine/cli.js articles/_incoming/news_xxx.json --cover --html

# 4. 确认无误后移动到 articles/ 顶层（此时才会被 --all 纳入）
mv articles/_incoming/news_xxx.json articles/
```

## 注意

- 本目录的 `*.json` 草稿已被 `.gitignore` 忽略（属于工作产物，不入库）。
- 抓取只做「素材入库」，**不负责发布**；版权、事实与文风需人工把关。
- 去重基于标题与原文链接，跨运行生效（会扫描 `articles/` 与 `articles/_incoming/`）。
