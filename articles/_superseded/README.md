# 落选/被取代的文章

本目录保存**同名冲突中被取代**的文章，仅供追溯，**不参与渲染与发布**。

`engine/cli.js --all` 只读取 `articles/*.json`（不递归子目录），因此本目录的内容不会被发布。

## 冲突处理规则

`tools/extract_articles.py` 遇到不同来源定义相同 `name` 时，**按 `publishDate` 最新者胜**。
落选版本会归档到本目录，文件名格式为 `<name>__<来源文件>.json`。

## 当前的落选记录

| 落选文件 | 标题 | 日期 | 被谁取代 |
|---|---|---|---|
| `wine_storage_guide__build_new_topics.json` | 🍾 开瓶后葡萄酒能放多久？史上最全保存指南 | 20260607 | `wine_storage_guide` (20260610, 储存指南) —— 且主题与 `wine_after_opening` (20260614) 重复 |
| `wine_tasting_101__build_new_topics.json` | 🍷 葡萄酒品鉴入门：看、闻、尝 | 20260607 | `wine_tasting_101` (20260610, rich 版, 1954 字) |

两组都属于「同一主题被重新生成、复用了 name」。落选版本内容较少或主题已被更完整的文章覆盖。
