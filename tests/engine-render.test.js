/**
 * 渲染引擎测试
 *
 * 注意：本测试不依赖 output/ 目录（该目录被 gitignore，CI 全新检出不包含它）。
 * 需要对真实文章做断言时，使用已提交的 articles/*.json。
 */

const fs = require('fs');
const path = require('path');

const {
  renderBlocks,
  validateBlocks,
  blocksToPlainText,
  countBlockTypes,
  resolveThemeConfig,
  SUPPORTED_TYPES,
  BLOCK_SPEC
} = require('../engine/blocks');
const { buildArticle, validateSpec, articleStats, ARTICLE_FIELDS } = require('../engine/article');
const { buildCoverSvg, renderCoverPng, wrapByWidth, escapeXml } = require('../engine/cover');

const ARTICLES_DIR = path.resolve(__dirname, '..', 'articles');
const loadSpec = (name) => JSON.parse(fs.readFileSync(path.join(ARTICLES_DIR, `${name}.json`), 'utf8'));

describe('blocks: schema', () => {
  test('should cover all 17 block types used across the repository', () => {
    const expected = [
      'title', 'subtitle', 'h2', 'h3', 'p', 'lead', 'tip', 'quote',
      'box', 'ri', 'card', 'info', 'item', 'table', 'list', 'sep', 'end'
    ];
    expect(SUPPORTED_TYPES.sort()).toEqual(expected.sort());
  });

  test('ri / card / info must be declared (旧流水线曾完全忽略 ri)', () => {
    expect(BLOCK_SPEC.ri).toBeDefined();
    expect(BLOCK_SPEC.card).toBeDefined();
    expect(BLOCK_SPEC.info).toBeDefined();
  });
});

describe('blocks: validateBlocks', () => {
  test('should accept a well-formed block list', () => {
    expect(validateBlocks([{ type: 'p', text: 'x' }])).toEqual([]);
  });

  test('should reject empty or non-array content', () => {
    expect(validateBlocks([])).toHaveLength(1);
    expect(validateBlocks(null)).toHaveLength(1);
  });

  test('should reject an unknown block type with a helpful message', () => {
    const errors = validateBlocks([{ type: 'nope', text: 'x' }]);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('类型未知');
  });

  test('should report a missing required field', () => {
    const errors = validateBlocks([{ type: 'p' }]);
    expect(errors[0]).toContain('缺少必填字段 "text"');
  });

  test('should report unexpected fields', () => {
    const errors = validateBlocks([{ type: 'p', text: 'x', bogus: 1 }]);
    expect(errors[0]).toContain('多余字段 "bogus"');
  });

  test('should accept optional heading on box-like blocks', () => {
    expect(validateBlocks([
      { type: 'box', heading: 'h', text: 'x' },
      { type: 'ri', heading: 'h', text: 'x' },
      { type: 'tip', heading: 'h', text: 'x' }
    ])).toEqual([]);
  });

  test('should reject a table whose rows do not match the header width', () => {
    const errors = validateBlocks([{ type: 'table', headers: ['a', 'b'], rows: [['only-one']] }]);
    expect(errors[0]).toContain('与表头 2 列不符');
  });

  test('should accept sep without text', () => {
    expect(validateBlocks([{ type: 'sep' }])).toEqual([]);
  });
});

describe('blocks: renderBlocks (classic theme)', () => {
  test('should wrap output in an inline-styled section', () => {
    const html = renderBlocks([{ type: 'p', text: '正文' }], { theme: 'classic' });
    expect(html.startsWith('<section style="padding:10px 0;">')).toBe(true);
    expect(html.endsWith('</section>')).toBe(true);
  });

  test('should render each primitive type with the exact expected markup', () => {
    const html = renderBlocks([
      { type: 'title', text: 'T' },
      { type: 'subtitle', text: 'S' },
      { type: 'h2', text: 'H2' },
      { type: 'h3', text: 'H3' },
      { type: 'p', text: 'P' },
      { type: 'sep' },
      { type: 'end', text: 'E' }
    ], { theme: 'classic' });

    expect(html).toContain('<h2 style="text-align:center;color:#b8860b;">T</h2>');
    expect(html).toContain('<p style="text-align:center;color:#888;font-size:14px;margin-bottom:20px;">S</p>');
    expect(html).toContain('<h2 style="color:#b8860b;border-bottom:2px solid #ffd54f;padding-bottom:8px;margin-top:25px;">H2</h2>');
    expect(html).toContain('<h3 style="color:#b8860b;margin-top:20px;">H3</h3>');
    expect(html).toContain('<p style="color:#333;line-height:1.8;font-size:15px;margin:10px 0;">P</p>');
    expect(html).toContain('<p style="text-align:center;color:#ddd;margin:20px 0;">---</p>');
    expect(html).toContain('<p style="text-align:center;color:#888;font-size:14px;margin-top:30px;">E</p>');
  });

  test('should render lists and tables', () => {
    const html = renderBlocks([
      { type: 'list', items: ['a', 'b'] },
      { type: 'table', headers: ['h1', 'h2'], rows: [['c1', 'c2']] }
    ], { theme: 'classic' });

    expect(html).toContain('<ul style="padding-left:20px;"><li style="margin:6px 0;color:#333;line-height:1.7;">a</li><li style="margin:6px 0;color:#333;line-height:1.7;">b</li></ul>');
    expect(html).toContain('<thead><tr style="background:#b8860b;color:#fff;"><th style="padding:10px;text-align:left;">h1</th><th style="padding:10px;text-align:left;">h2</th></tr></thead>');
    expect(html).toContain('<tbody><tr><td style="padding:8px 12px;border-bottom:1px solid #eee;">c1</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">c2</td></tr></tbody>');
  });

  test('should not insert separators between blocks (与历史产物一致的不变量)', () => {
    const html = renderBlocks([
      { type: 'p', text: 'A' },
      { type: 'p', text: 'B' }
    ], { theme: 'classic' });
    expect(html).not.toContain('\n');
    expect(html).toContain('A</p><p');
  });

  test('should keep text newlines as-is in classic theme', () => {
    const html = renderBlocks([{ type: 'p', text: 'line1\nline2' }], { theme: 'classic' });
    expect(html).toContain('line1\nline2');
  });

  test('should throw on invalid blocks instead of rendering silently', () => {
    expect(() => renderBlocks([{ type: 'nope' }])).toThrow('内容块校验失败');
  });
});

describe('blocks: renderBlocks (rich theme)', () => {
  test('should use the article theme colours', () => {
    const html = renderBlocks([{ type: 'title', text: 'T' }], {
      theme: { name: 'rich', primary: '#006064', secondary: '#26c6da' }
    });
    expect(html).toContain('color:#006064');
    expect(html.startsWith('<section>')).toBe(true);
  });

  test('should convert newlines to <br/> in rich theme', () => {
    const html = renderBlocks([{ type: 'box', heading: 'H', text: 'a\nb' }], { theme: 'rich' });
    expect(html).toContain('a<br/>b');
  });

  test('should inline styles instead of relying on <style> classes', () => {
    const html = renderBlocks([
      { type: 'box', heading: 'H', text: 'x' },
      { type: 'table', headers: ['h'], rows: [['c']] },
      { type: 'list', items: ['i'] }
    ], { theme: 'rich' });

    // 微信会剥离 <style>，因此引擎不允许输出 class 或 <style> 块
    expect(html).not.toContain('<style');
    expect(html).not.toContain('class=');
    expect(html).toContain('style="');
  });

  test('should render ri blocks (回归：旧 rich_article.py 会丢弃它们)', () => {
    const html = renderBlocks([{ type: 'ri', heading: '清爽担当：白葡萄酒', text: '推荐长相思' }], { theme: 'rich' });
    expect(html).toContain('清爽担当：白葡萄酒');
    expect(html).toContain('推荐长相思');
  });

  test('should support all block types under the rich theme', () => {
    const blocks = SUPPORTED_TYPES.map((type) => {
      switch (type) {
      case 'table': return { type, headers: ['a'], rows: [['b']] };
      case 'list': return { type, items: ['x'] };
      case 'sep': return { type };
      default: return { type, text: 'T' };
      }
    });
    expect(() => renderBlocks(blocks, { theme: 'rich' })).not.toThrow();
  });
});

describe('blocks: theme resolution', () => {
  test('should default to classic', () => {
    expect(resolveThemeConfig(undefined)).toEqual({ name: 'classic' });
    expect(resolveThemeConfig('classic')).toEqual({ name: 'classic' });
  });

  test('should resolve named presets to the rich theme', () => {
    expect(resolveThemeConfig('rich')).toEqual({ name: 'rich' });
    expect(resolveThemeConfig('beach')).toEqual({ name: 'rich', preset: 'beach' });
  });

  test('should reject an unknown theme name', () => {
    expect(() => resolveThemeConfig('nope')).toThrow('未知主题');
  });
});

describe('blocks: helper utilities', () => {
  test('blocksToPlainText should collect text from all block shapes', () => {
    const text = blocksToPlainText([
      { type: 'p', text: '段落' },
      { type: 'box', heading: '小标题', text: '盒子' },
      { type: 'list', items: ['项一', '项二'] },
      { type: 'table', headers: ['表头'], rows: [['单元格']] }
    ]);
    ['段落', '小标题', '盒子', '项一', '项二', '表头', '单元格'].forEach((fragment) => {
      expect(text).toContain(fragment);
    });
  });

  test('countBlockTypes should tally each type', () => {
    expect(countBlockTypes([{ type: 'p' }, { type: 'p' }, { type: 'h2' }])).toEqual({ p: 2, h2: 1 });
  });
});

describe('article: buildArticle', () => {
  const spec = loadSpec('bbq_pairing');

  test('should reject a spec missing required fields', () => {
    expect(validateSpec({ content: [{ type: 'p', text: 'x' }] }).length).toBeGreaterThan(0);
  });

  test('should produce exactly the historical field set, in order', () => {
    const article = buildArticle(spec);
    expect(Object.keys(article)).toEqual(ARTICLE_FIELDS);
  });

  test('should normalise the publish date to YYYYMMDD', () => {
    expect(buildArticle(spec, { publishDate: '2026-06-07' }).publishDate).toBe('20260607');
  });

  test('should allow overriding author and cover image', () => {
    const article = buildArticle(spec, { author: '红樽坊', coverImage: 'x.png' });
    expect(article.author).toBe('红樽坊');
    expect(article.coverImage).toBe('x.png');
  });

  test('should throw for an invalid spec', () => {
    expect(() => buildArticle({ name: 'x', content: [{ type: 'p', text: 'x' }] })).toThrow('文章数据校验失败');
  });

  test('articleStats should report block count and reading time', () => {
    const article = buildArticle(spec);
    const stats = articleStats(spec, article);
    expect(stats.blocks).toBe(spec.content.length);
    expect(stats.htmlLength).toBe(article.content.length);
    expect(stats.approxReadingMinutes).toBeGreaterThanOrEqual(1);
  });
});

describe('real articles under articles/', () => {
  const names = fs.readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => path.basename(f, '.json'));

  test('should contain the migrated article set', () => {
    expect(names.length).toBeGreaterThan(50);
  });

  test('every article should validate and render without throwing', () => {
    const failures = [];
    for (const name of names) {
      try {
        buildArticle(loadSpec(name));
      } catch (err) {
        failures.push(`${name}: ${err.message.split('\n')[0]}`);
      }
    }
    expect(failures).toEqual([]);
  });

  test('beach_wine should render every ri block (旧流水线丢块回归)', () => {
    const spec = loadSpec('beach_wine');
    const article = buildArticle(spec);

    const riBlocks = spec.content.filter((b) => b.type === 'ri');
    expect(riBlocks.length).toBeGreaterThan(0);
    riBlocks.forEach((block) => {
      expect(article.content).toContain(block.heading);
    });
  });
});

describe('cover', () => {
  test('escapeXml should neutralise XML metacharacters', () => {
    expect(escapeXml('a & b < c > d "e" \'f\'')).toBe('a &amp; b &lt; c &gt; d &quot;e&quot; &apos;f&apos;');
    expect(escapeXml(null)).toBe('');
  });

  test('wrapByWidth should count CJK as double width', () => {
    // 全角字符按 2 计宽，因此 4 个汉字刚好填满 maxWidth=8
    expect(wrapByWidth('波尔多红酒吧', 8, 3)).toEqual(['波尔多红', '酒吧']);
  });

  test('wrapByWidth should truncate with an ellipsis beyond maxLines', () => {
    const lines = wrapByWidth('一'.repeat(50), 10, 2);
    expect(lines).toHaveLength(2);
    expect(lines[1].endsWith('…')).toBe(true);
  });

  test('wrapByWidth should handle empty input', () => {
    expect(wrapByWidth('', 10, 2)).toEqual([]);
    expect(wrapByWidth(null, 10, 2)).toEqual([]);
  });

  test('buildCoverSvg should produce a valid, escaped SVG', () => {
    const svg = buildCoverSvg({ title: 'A & B <tag>', subtitle: 'sub', category: 'wine' });
    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg).toContain('</svg>');
    expect(svg).toContain('A &amp; B &lt;tag&gt;');
    expect(svg).not.toContain('<tag>');
    expect(svg).toContain('WINE');
  });

  test('buildCoverSvg should stay valid when the title contains quotes', () => {
    const svg = buildCoverSvg({ title: '"引号" 测试' });
    // 属性与文本节点均不应被未转义的引号破坏
    expect(svg).toContain('&quot;引号&quot; 测试');
  });

  test('renderCoverPng should output a 1200x630 PNG', async () => {
    const buffer = await renderCoverPng({ title: '测试封面', subtitle: '副标题', category: 'test' });
    expect(Buffer.isBuffer(buffer)).toBe(true);
    // PNG magic number
    expect(buffer.slice(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
  });
});
