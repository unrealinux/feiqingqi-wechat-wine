# 渲染引擎 (engine/)

数据驱动的文章生产引擎 —— 用来取代仓库里 **211 个 `generate-*.js` 脚本 + 72 个 `build_*.py` 编译器**的「脚本农场」。

## 为什么需要它

改造前的工作方式：

```
build_xxx.py  ──(编译)──►  generate-xxx.js  ──(执行)──►  公众号草稿
   定义内容                内容硬编码进HTML字符串
```

问题：

| 问题 | 影响 |
|---|---|
| **211 个脚本逐字重复** | `gCov()` / `main()` / 发布逻辑几乎完全相同，改一处要改 200 处 |
| **源码与产物双份维护** | `generate-*.js` 是编译产物却被提交，与 `build_*.py` 静默漂移 |
| **内容被静默丢弃** | `rich_article.py` 漏写 `ri` 分支，57 个文件、290 处内容从未出现在文章里 |
| **样式写在 `<style>` 里** | 微信会剥离 `<style>`，卡片/表格/列表实际失去样式 |
| **正文换行被吞** | 编译器用 `html.split('\n')` 拆分，正文里的 `\n` 被当成块分隔符 |

改造后的工作方式：

```
articles/xxx.json  ──►  engine/  ──►  产物 + 封面 + 草稿
  纯数据(唯一真相)      渲染引擎
```

## 目录结构

```
engine/
├── blocks.js            内容块校验 + 渲染主分发器（17 种块类型）
├── themes/
│   ├── classic.js       第一代模板风格（暗金配色），与历史产物字节一致
│   └── rich.js          第二代模板风格（主题色），修复了丢块问题
├── cover.js             封面生成（SVG -> PNG，微信素材接口所需）
├── wechat.js            微信 API 客户端（token 缓存 / 素材上传 / 建草稿）
├── article.js           数据 -> 成品文章对象组装
└── cli.js               命令行入口

articles/                文章数据（唯一真相）
tools/
├── extract_articles.py  从旧 build_*.py 一次性抽取数据（AST 静态解析）
└── verify_parity.js     与新引擎输出做逐字节回归比对
```

## 快速开始

```bash
# 渲染并写产物到 output/
node engine/cli.js articles/bbq_pairing.json

# 处理 articles/ 下全部
node engine/cli.js --all

# 只校验数据（不写文件）
node engine/cli.js articles/bbq_pairing.json --check

# 渲染 + 生成封面 + 输出 HTML 预览
node engine/cli.js articles/bbq_pairing.json --cover --html

# 发布到公众号草稿箱
node engine/cli.js articles/bbq_pairing.json --publish
```

### CLI 选项

| 选项 | 说明 |
|---|---|
| `--all` | 处理 `articles/` 下所有 `*.json` |
| `--out <dir>` | 产物输出目录（默认 `output/`） |
| `--date <YYYYMMDD>` | 覆盖发布日期 |
| `--author <name>` | 覆盖作者 |
| `--check` | 仅校验，不写文件 |
| `--cover` | 生成封面 PNG |
| `--html` | 额外输出 HTML 预览 |
| `--publish` | 上传封面并创建公众号草稿 |
| `--quiet` | 精简输出 |

## 数据格式

`articles/<name>.json`：

```json
{
  "name": "bbq_pairing",
  "title": "🍖 烧烤配酒指南：人间烟火气的美妙搭配",
  "author": "红酒顾问",
  "digest": "烧烤配什么酒最过瘾？…",
  "category": "wine-food",
  "tags": ["烧烤", "配酒", "BBQ"],
  "publishDate": "20260607",
  "theme": { "name": "classic" },
  "cover": { "color": "#006064", "titleLines": ["海边度假配酒指南"], "subtitle": "…", "bottomText": "…" },
  "content": [
    { "type": "title", "text": "🍖 烧烤配酒指南" },
    { "type": "p", "text": "正文段落…" }
  ]
}
```

### 内容块类型（17 种）

| 类型 | 字段 | 渲染效果 |
|---|---|---|
| `title` | `text` | 居中大标题 |
| `subtitle` | `text` | 居中副标题 |
| `h2` | `text` | 小节标题（带下划线） |
| `h3` | `text` | 三级标题 |
| `p` | `text` | 正文段落 |
| `lead` | `text` | 深色渐变导语块 |
| `tip` | `text`, `heading?` | 提示框（默认「💡 小贴士」） |
| `quote` | `text` | 斜体引言块 |
| `box` | `text`, `heading?` | 信息卡片 |
| `ri` | `text`, `heading?` | 信息卡片（★ 旧流水线会丢弃） |
| `card` | `text`, `heading?` | 左侧色条卡片 |
| `info` | `text`, `heading?` | 浅红信息块 |
| `item` | `text`, `info?`, `price?`, `tag?` | 商品/酒款条目卡片 |
| `table` | `headers`, `rows` | 表格 |
| `list` | `items` | 列表 |
| `sep` | — | 分隔符 |
| `end` | `text` | 结尾语 |

> 字段契约同时定义在 `engine/blocks.js` 的 `BLOCK_SPEC` 和 `tools/extract_articles.py` 的 `BLOCK_SPEC`，两侧都会校验。

### 主题

| 主题 | 说明 |
|---|---|
| `classic` | 第一代模板，暗金配色，输出与历史产物**字节一致** |
| `rich` | 第二代模板，支持 `primary` / `secondary` 主题色 |

`rich` 主题可传预设名或自定义色：

```json
"theme": { "name": "rich", "primary": "#006064", "secondary": "#26c6da" }
```

内置预设（`engine/themes/rich.js` 的 `PRESETS`）：`default` `rhone` `beach` `bordeaux` `burgundy`。

## 新增一篇专题

1. 新建 `articles/my-topic.json`，按上面的格式填写
2. 校验：`node engine/cli.js articles/my-topic.json --check`
3. 本地预览：`node engine/cli.js articles/my-topic.json --cover --html`
4. 发布：`node engine/cli.js articles/my-topic.json --publish`

不再需要新建 `build_*.py` 或 `generate-*.js`。

## 从旧结构迁移

```bash
# 1. 一次性把所有 build_*.py 的内容抽成数据
python tools/extract_articles.py --all

# 2. 校验数据完整性（会报告未知块类型、缺字段等问题）
node engine/cli.js --all --check

# 3. 回归比对：与历史产物逐字节比较，确认没有渲染退化
node tools/verify_parity.js --verbose
```

`tools/extract_articles.py` 使用 **AST 静态解析**，不会执行脚本，因此**不会触发发布**。

### 旧脚本已移出工作区

72 个 `build_*.py` 与 211 个 `generate-*.js` 已在迁移完成后删除，
但它们完整保留在 git 历史中（commit `7babd19` 是归档点）。
若需要重新提取，先把它们取出来：

```bash
mkdir -p /tmp/legacy
for f in $(git ls-tree --name-only 7babd19 | grep -E '^build_.*\.py$'); do
  git show 7babd19:$f > /tmp/legacy/$f
done
python tools/extract_articles.py /tmp/legacy/build_*.py --out /tmp/extracted
```

### 同名冲突的处理

不同来源定义相同 `name` 时，**按 `publishDate` 最新者胜**（确定性规则），
落选版本写入 `articles/_superseded/` 存档，不参与发布。详见该目录的 README。

## 已修复的历史缺陷

| # | 缺陷 | 证据 | 修复 |
|---|---|---|---|
| 1 | `ri` 块被静默丢弃 | `rich_article.py` 定义了 `.ri` 的 CSS 却漏写分支；57 个文件、290 处受影响（占这些文章内容块的 15%） | `engine/themes/rich.js` 补齐 `ri` / `card` / `info` |
| 2 | 微信剥离 `<style>` 导致卡片/表格/列表掉样式 | 旧模板用 `.ri` / `.card` 等 class | 引擎全部输出内联 `style` |
| 3 | 正文换行被吞 | 编译器 `html.split('\n')` 把正文 `\n` 当块分隔符 | 数据层保留 `\n`，渲染时按主题处理 |
| 4 | 每个脚本各自调一次 token | token 有每日调用上限（2000 次/天），官方要求缓存复用 | `engine/wechat.js` 进程内缓存 + 提前 5 分钟刷新 + 失效自动重试 |
| 5 | 封面文本未做 XML 转义 | 旧模板直接拼接标题，含 `&` `<` `>` 会生成非法 SVG | `engine/cover.js` 转义 + 按显示宽度折行 |
| 6 | 不校验字段长度 | 微信限制标题 64 字、摘要 120 字 | `engine/wechat.js` 的 `validateArticle` 前置校验 |

### 实测效果

对仓库全部 72 个 `build_*.py`（101 篇文章，99 个唯一名称）做了全量提取与回归验证：

| 类别 | 数量 | 说明 |
|---|---|---|
| ✅ 字节一致 | 31 | 引擎输出与历史产物完全相同 |
| 📝 空白修正 | 9 | 仅正文换行不同（旧编译器吞换行） |
| 🔧 内容恢复 | 59 | **旧产物是引擎输出的有损子集，找回了丢失的正文** |
| ❌ 回归 | **0** | 无任何内容丢失 |

内容恢复的规模（部分样本）：

| 文章 | 旧产物可见字数 | 引擎可见字数 | 找回 |
|---|---|---|---|
| `wine_zodiac` | 735 | 1909 | +1174 |
| `wine_tasting_101` | 705 | 1628 | +923 |
| `wine_travel_guide` | 608 | 1529 | +921 |
| `wine_opener_guide` | 453 | 1255 | +802 |
| `wine_snob` | 573 | 1135 | +562 |
| `beach_wine` | 862 | 1254 | +392 |

累计找回约 **2 万字**此前从未进入公众号文章的正文。

### 数据卫生问题（顺带发现）

两个专题在多个 `build_*.py` 中重复定义，提取时会互相覆盖：

- `wine_storage_guide` → `build_new_topics.py` 与 `build_wine_storage.py`
- `wine_tasting_101` → `build_new_topics.py` 与 `build_wine_tasting.py`

迁移时需要决定保留哪一份。

## 回归保护

`tools/verify_parity.js` 用历史产物做基线，逐字节比对引擎输出：

```bash
node tools/verify_parity.js --verbose
```

- `classic` 主题的文章应当**字节一致**
- `rich` 主题的文章会有差异，因为引擎恢复了被丢弃的块 —— 这类已知修正记录在
  `tools/verify_parity.js` 的 `KNOWN_CORRECTIONS` 中，不计为回归

## 相关命令

```bash
npm run engine:check     # 校验全部数据文件
npm run engine:render    # 渲染全部文章
npm run engine:verify    # 回归比对
npm run engine:extract   # 从旧 build_*.py 提取数据
npm test                 # 204 个用例（engine 相关 63 个）
```
