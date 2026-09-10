#!/usr/bin/env node
'use strict';

/**
 * 渲染等价性回归工具
 * ==================
 * 用「数据文件 -> 引擎渲染」的结果，与项目历史产物 (output/<name>_*.json) 逐字节比对，
 * 以此证明新引擎可以无损替代旧的 generate-*.js。
 *
 * 判定分四类
 * ----------
 *   ✅ 字节一致    引擎输出与历史产物完全相同
 *   📝 空白修正    仅换行/空白不同（旧编译器用 split('\n') 吞掉了正文换行）
 *   🔧 内容恢复    旧产物是引擎输出的「有损子集」—— 旧渲染器丢掉了整块内容
 *                  （典型：rich_article.py 漏写 ri 分支，290 处 ri 块从未出现在文章里）
 *   ❌ 回归        引擎输出缺少了历史产物里的可见文本，需要排查
 *
 * 用法
 * ----
 *   node tools/verify_parity.js                    # 校验 articles/ 下全部
 *   node tools/verify_parity.js bbq_pairing        # 只校验指定专题
 *   node tools/verify_parity.js --dir .full-articles
 *   node tools/verify_parity.js --verbose          # 打印差异上下文
 *
 * 退出码：0 = 无回归；1 = 存在回归
 */

const fs = require('fs');
const path = require('path');

const { buildArticle } = require('../engine/article');

const ROOT = path.resolve(__dirname, '..');
const ARTICLES_DIR = path.join(ROOT, 'articles');
const OUTPUT_DIR = path.join(ROOT, 'output');

/**
 * 剥离 HTML 的不可见部分（style/script 块、注释、标签）与所有空白，只保留可见文本。
 * 注意必须先移除 <style>...</style>：旧模板把 CSS 写在 style 块里，
 * 若不先剔除，CSS 文本会被误当成正文内容参与比较。
 */
function visibleText(html) {
  return String(html || '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<br\s*\/?>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, '');
}

/** 判断 needle 是否为 hay 的子序列（旧产物的可见文本是否都还在）。 */
function isSubsequence(needle, hay) {
  let i = 0;
  for (let j = 0; j < hay.length && i < needle.length; j += 1) {
    if (hay[j] === needle[i]) {i += 1;}
  }
  return i === needle.length;
}

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * 查找历史产物基线。
 * 必须严格匹配 <name>_<8位日期>.json —— 否则 china_wine 会误匹配到
 * china_wine_map_*、wine_myths 会误匹配到 wine_myths_real_* 等不同文章。
 */
function findBaseline(name) {
  if (!fs.existsSync(OUTPUT_DIR)) {return null;}
  const re = new RegExp(`^${escapeRegExp(name)}_\\d{8}\\.json$`);
  const files = fs
    .readdirSync(OUTPUT_DIR)
    .filter((f) => re.test(f))
    .sort();
  return files.length ? path.join(OUTPUT_DIR, files[files.length - 1]) : null;
}

function firstDifference(a, b) {
  const max = Math.max(a.length, b.length);
  for (let i = 0; i < max; i += 1) {
    if (a[i] !== b[i]) {return i;}
  }
  return -1;
}

function main() {
  const args = process.argv.slice(2);
  const verbose = args.includes('--verbose');

  let articlesDir = ARTICLES_DIR;
  const dirIdx = args.indexOf('--dir');
  if (dirIdx !== -1) {
    if (!args[dirIdx + 1]) {
      console.error('❌ --dir 需要一个目录参数');
      process.exit(2);
    }
    articlesDir = path.resolve(ROOT, args[dirIdx + 1]);
  }

  const only = args.filter((a, i) => !a.startsWith('--') && i !== dirIdx + 1);

  if (!fs.existsSync(articlesDir)) {
    console.error(`❌ 数据目录不存在: ${articlesDir}`);
    process.exit(2);
  }

  let names = fs
    .readdirSync(articlesDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => path.basename(f, '.json'))
    .sort();
  if (only.length) {names = names.filter((n) => only.includes(n));}

  if (!names.length) {
    console.error('❌ 没有可校验的数据文件');
    process.exit(2);
  }

  const counts = { identical: 0, whitespace: 0, recovered: 0, regression: 0, noBaseline: 0 };
  const lines = [];

  for (const name of names) {
    const spec = JSON.parse(fs.readFileSync(path.join(articlesDir, `${name}.json`), 'utf8'));

    let article;
    try {
      article = buildArticle(spec);
    } catch (err) {
      counts.regression += 1;
      lines.push(`❌ ${name.padEnd(24)} 渲染失败: ${err.message.split('\n')[0]}`);
      continue;
    }

    const baseline = findBaseline(name);
    if (!baseline) {
      counts.noBaseline += 1;
      lines.push(`➖ ${name.padEnd(24)} 无历史产物可比对`);
      continue;
    }

    const old = JSON.parse(fs.readFileSync(baseline, 'utf8'));

    if (article.content === old.content) {
      counts.identical += 1;
      lines.push(`✅ ${name.padEnd(24)} 字节一致    (${article.content.length} 字符)`);
      continue;
    }

    const pos = firstDifference(article.content, old.content);
    const newText = visibleText(article.content);
    const oldText = visibleText(old.content);

    // 1) 仅空白/换行差异：旧编译器把正文里的 \n 当成块分隔符吞掉了
    if (newText === oldText) {
      counts.whitespace += 1;
      lines.push(
        `📝 ${name.padEnd(24)} 空白修正    引擎 ${article.content.length} vs 产物 ${old.content.length} 字符`
      );
      lines.push('   └─ 旧编译器吞掉正文换行，新引擎保留（可见文本完全一致）');
      continue;
    }

    // 2) 旧产物的可见文本仍是引擎输出的子序列 => 旧产物只是有损子集
    if (oldText.length > 0 && isSubsequence(oldText, newText)) {
      counts.recovered += 1;
      lines.push(
        `🔧 ${name.padEnd(24)} 内容恢复    引擎 ${newText.length} vs 产物 ${oldText.length} 可见字符`
      );
      lines.push(
        `   └─ 找回约 ${newText.length - oldText.length} 字内容（旧渲染器丢块）｜` +
          `主题 ${(spec.theme && spec.theme.name) || 'classic'}`
      );
      if (verbose) {
        lines.push(`   引擎: ${JSON.stringify(article.content.slice(Math.max(0, pos - 40), pos + 60))}`);
        lines.push(`   产物: ${JSON.stringify(old.content.slice(Math.max(0, pos - 40), pos + 60))}`);
      }
      continue;
    }

    // 3) 其余情况视为回归
    counts.regression += 1;
    lines.push(
      `❌ ${name.padEnd(24)} 回归        引擎 ${newText.length} vs 产物 ${oldText.length} 可见字符，首差位置 ${pos}`
    );
    if (verbose) {
      lines.push(`   引擎: ${JSON.stringify(article.content.slice(Math.max(0, pos - 40), pos + 60))}`);
      lines.push(`   产物: ${JSON.stringify(old.content.slice(Math.max(0, pos - 40), pos + 60))}`);
    }
  }

  console.log('渲染等价性回归比对');
  console.log('='.repeat(68));
  if (lines.length > 40) {
    // 全量校验时只打印非「字节一致」的关注项
    console.log(lines.filter((l) => !l.startsWith('✅')).join('\n'));
    console.log(`（另有 ${counts.identical} 篇字节一致，已省略）`);
  } else {
    console.log(lines.join('\n'));
  }
  console.log('='.repeat(68));
  console.log(
    `字节一致 ${counts.identical} ｜ 空白修正 ${counts.whitespace} ｜ 内容恢复 ${counts.recovered} ｜ ` +
      `无基线 ${counts.noBaseline} ｜ 回归 ${counts.regression}`
  );

  process.exit(counts.regression ? 1 : 0);
}

if (require.main === module) {main();}
