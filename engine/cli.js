#!/usr/bin/env node
'use strict';

/**
 * 渲染引擎 CLI
 * ============
 * 一条命令完成：校验数据 -> 渲染 HTML -> 生成封面 -> 写产物 -> (可选) 发布草稿。
 *
 * 用法
 * ----
 *   node engine/cli.js articles/bbq_pairing.json            # 渲染并写产物
 *   node engine/cli.js --all                                # 处理 articles/ 下全部
 *   node engine/cli.js articles/bbq_pairing.json --check    # 只校验，不写文件
 *   node engine/cli.js articles/bbq_pairing.json --cover    # 额外生成封面 PNG
 *   node engine/cli.js articles/bbq_pairing.json --publish  # 发布为公众号草稿
 *   node engine/cli.js --all --cover --publish-cover        # 批量：封面入草稿
 *
 * 选项
 * ----
 *   --all              处理 articles/ 目录下所有 *.json
 *   --out <dir>        产物输出目录（默认 output/）
 *   --date <YYYYMMDD>  覆盖发布日期
 *   --author <name>    覆盖作者
 *   --check            仅校验
 *   --cover            生成封面 PNG 到输出目录
 *   --html             额外输出 HTML 预览
 *   --publish          发布到微信公众号草稿箱
 *   --quiet            精简输出
 */

// dotenv 为可选依赖：纯渲染/校验流程不需要它时不应阻塞启动
try {
  require('dotenv').config();
} catch (err) {
  // 未安装 dotenv 时静默跳过，发布前会由 wechat.js 给出明确提示
}

const fs = require('fs');
const path = require('path');

const { buildArticle, articleStats } = require('./article');
const { renderCoverPng } = require('./cover');

const ROOT = path.resolve(__dirname, '..');
const ARTICLES_DIR = path.join(ROOT, 'articles');

function parseArgs(argv) {
  const opts = {
    files: [],
    all: false,
    out: path.join(ROOT, 'output'),
    date: '',
    author: '',
    check: false,
    cover: false,
    html: false,
    publish: false,
    quiet: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    switch (arg) {
    case '--all': opts.all = true; break;
    case '--out': opts.out = path.resolve(ROOT, argv[++i]); break;
    case '--date': opts.date = argv[++i]; break;
    case '--author': opts.author = argv[++i]; break;
    case '--check': opts.check = true; break;
    case '--cover': opts.cover = true; break;
    case '--html': opts.html = true; break;
    case '--publish': opts.publish = true; break;
    case '--quiet': opts.quiet = true; break;
    case '-h':
    case '--help': opts.help = true; break;
    default:
      if (arg.startsWith('--')) {throw new Error(`未知选项: ${arg}`);}
      opts.files.push(arg);
    }
  }
  return opts;
}

function usage() {
  // 不用 split('*/')：文件开头的 '/**' 自身不含 '*/'，会把 'use strict' 一并带入
  const src = fs.readFileSync(__filename, 'utf8');
  const match = src.match(/\/\*\*([\s\S]*?)\*\//);
  const doc = match ? match[1].replace(/^\s*\* ?/gm, '').trim() : '(无帮助文本)';
  console.log(doc);
}

function log(opts, ...args) {
  if (!opts.quiet) {console.log(...args);}
}

/** 解析待处理的数据文件列表。 */
function resolveInputs(opts) {
  if (opts.all) {
    if (!fs.existsSync(ARTICLES_DIR)) {throw new Error(`数据目录不存在: ${ARTICLES_DIR}`);}
    return fs
      .readdirSync(ARTICLES_DIR)
      .filter((f) => f.endsWith('.json'))
      .sort()
      .map((f) => path.join(ARTICLES_DIR, f));
  }
  return opts.files.map((f) => path.resolve(ROOT, f));
}

/** 生成 HTML 预览（本地排查用，不投递）。 */
function buildPreviewHtml(article) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${article.title}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
         max-width: 700px; margin: 0 auto; padding: 24px 18px 60px; background: #fafafa; color: #333; }
  .meta { color: #999; font-size: 13px; margin-bottom: 24px; }
  .meta code { background: #eee; padding: 2px 6px; border-radius: 4px; }
  .preview-note { background: #fff8e1; border-left: 4px solid #ffd54f; padding: 10px 14px;
                  border-radius: 0 6px 6px 0; font-size: 13px; color: #795548; margin-bottom: 24px; }
</style>
</head>
<body>
  <div class="preview-note">本地预览 · 模拟微信正文宽度 · 该文件不参与发布</div>
  <h1 style="font-size:22px;line-height:1.4;">${article.title}</h1>
  <div class="meta">
    作者：${article.author} ｜ 分类：<code>${article.category}</code> ｜ 日期：${article.publishDate}<br>
    标签：${article.tags.join(' / ')}
  </div>
  ${article.content}
</body>
</html>
`;
}

/** 处理单篇文章。 */
async function processOne(file, opts) {
  const spec = JSON.parse(fs.readFileSync(file, 'utf8'));
  const name = spec.name || path.basename(file, '.json');

  const article = buildArticle(spec, { author: opts.author, date: opts.date });
  const stats = articleStats(spec, article);

  log(opts, `\n📄 ${name}`);
  log(opts, `   标题   ${article.title}`);
  log(opts, `   内容块 ${stats.blocks} 个 ｜ HTML ${stats.htmlLength} 字符 ｜ 正文约 ${stats.plainChars} 字（约 ${stats.approxReadingMinutes} 分钟）`);

  if (opts.check) {
    log(opts, '   ✅ 校验通过（--check 模式，未写文件）');
    return { name, status: 'checked', stats };
  }

  fs.mkdirSync(opts.out, { recursive: true });
  const datePart = article.publishDate || new Date().toISOString().slice(0, 10).replace(/-/g, '');

  const jsonPath = path.join(opts.out, `${name}_${datePart}.json`);
  fs.writeFileSync(jsonPath, `${JSON.stringify(article, null, 2)}\n`, 'utf8');
  log(opts, `   💾 ${path.relative(ROOT, jsonPath)}`);

  const result = { name, status: 'rendered', jsonPath, stats };

  if (opts.html) {
    const htmlPath = path.join(opts.out, `${name}_${datePart}.preview.html`);
    fs.writeFileSync(htmlPath, buildPreviewHtml(article), 'utf8');
    log(opts, `   💾 ${path.relative(ROOT, htmlPath)}`);
    result.htmlPath = htmlPath;
  }

  let coverBuffer = null;
  if (opts.cover || opts.publish) {
    // 封面色优先取文章自带的 cover.color，其次取主题主色
    const themePrimary = typeof spec.theme === 'object' && spec.theme ? spec.theme.primary : null;
    const themeSecondary = typeof spec.theme === 'object' && spec.theme ? spec.theme.secondary : null;
    const coverColor = (spec.cover && spec.cover.color) || themePrimary;

    coverBuffer = await renderCoverPng(
      {
        title: article.title,
        subtitle: article.digest,
        category: article.category,
      },
      {
        ...(coverColor ? { colorTo: coverColor } : {}),
        ...(themeSecondary ? { accent: themeSecondary } : {}),
      }
    );
    if (opts.cover) {
      const coverPath = path.join(opts.out, article.coverImage);
      fs.writeFileSync(coverPath, coverBuffer);
      log(opts, `   🖼  ${path.relative(ROOT, coverPath)} (${(coverBuffer.length / 1024).toFixed(0)} KB)`);
      result.coverPath = coverPath;
    }
  }

  if (opts.publish) {
    const { WeChatClient } = require('./wechat');
    const client = new WeChatClient();

    // 发布前置检查：先确认凭据与 IP 白名单可用，再动任何上传。
    // getAccessToken 会缓存结果，后面的 uploadThumb 直接复用，不产生额外请求。
    try {
      await client.getAccessToken();
      log(opts, '   🔑 微信凭据与 IP 白名单校验通过');
    } catch (err) {
      throw new Error(
        `发布前置检查未通过，已中止（未上传任何内容）:\n  ${err.message.split('\n').join('\n  ')}`
      );
    }

    const material = await client.uploadThumb(coverBuffer, article.coverImage.replace(/\.png$/i, '.png'));
    log(opts, `   ⬆️  封面素材 media_id=${material.media_id}`);

    const draft = await client.addDraft({
      title: article.title,
      author: article.author,
      digest: article.digest,
      content: article.content,
      thumbMediaId: material.media_id,
    });
    log(opts, `   ✅ 草稿已创建 media_id=${draft.media_id}`);
    result.status = 'published';
    result.draftMediaId = draft.media_id;
  }

  return result;
}

async function main() {
  let opts;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(`❌ ${err.message}`);
    usage();
    process.exit(2);
  }

  if (opts.help || (!opts.all && opts.files.length === 0)) {
    usage();
    process.exit(opts.help ? 0 : 2);
  }

  const files = resolveInputs(opts);
  if (files.length === 0) {
    console.error('❌ 没有找到要处理的数据文件');
    process.exit(2);
  }

  log(opts, `🚀 渲染引擎启动 · ${files.length} 篇文章${opts.publish ? ' · 发布模式' : ''}`);

  const results = [];
  let failed = 0;

  for (const file of files) {
    try {
      results.push(await processOne(file, opts));
    } catch (err) {
      failed += 1;
      const name = path.basename(file, '.json');
      console.error(`\n❌ ${name} 处理失败:\n${err.message}`);
      results.push({ name, status: 'failed', error: err.message });
    }
  }

  const ok = results.length - failed;
  log(opts, `\n${'─'.repeat(46)}`);
  log(opts, `完成：成功 ${ok} ｜ 失败 ${failed}`);
  if (failed) {process.exit(1);}
}

if (require.main === module) {
  main().catch((err) => {
    console.error('❌ 未捕获异常:', err);
    process.exit(1);
  });
}

module.exports = { parseArgs, processOne, buildPreviewHtml };
