/**
 * tools/fetch-news.js 测试
 *
 * 这是「抓取 -> 引擎草稿」的桥：生成的草稿必须能过 engine/article.js 的
 * validateSpec，否则整条链路在渲染时才失败。测试覆盖：
 *   - HTML -> 内容块 / 实体解码 / 文本清理等纯转换；
 *   - 分类白名单与标签推断；
 *   - 去重（跨运行 + 运行内）；
 *   - fetchSource（mock axios，用真实 rss-parser 解析 XML 夹具）；
 *   - 与引擎的契约：buildDraft 产出必须能被 buildArticle 接受。
 */

jest.mock('axios');
const axios = require('axios');

const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  decodeEntities,
  stripHtml,
  truncate,
  formatDate,
  slugFor,
  htmlToBlocks,
  inferCategory,
  inferTags,
  buildDraft,
  fetchSource,
  collectSeen,
  buildDrafts,
  writeDrafts,
  parseArgs
} = require('../tools/fetch-news');
const { buildArticle, validateSpec, CATEGORIES } = require('../engine/article');

const FIXED_NOW = new Date(2026, 5, 7, 10, 0, 0).getTime(); // 2026-06-07 本地时间

const SOURCE = { name: 'Decanter', url: 'https://example.com/feed', language: 'en', type: 'news' };

const ITEM = {
  title: 'Bordeaux 2026 拍卖价格创下新高',
  link: 'https://example.com/a',
  content: '<p>Liv-ex 指数显示，波尔多一级庄的拍卖价格在 2026 年上涨了 12%。</p><p>市场情绪乐观。</p>',
  contentSnippet: 'Liv-ex 指数显示，波尔多一级庄的拍卖价格在 2026 年上涨了 12%。',
  isoDate: '2026-06-07T00:00:00.000Z'
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('文本转换', () => {
  test('decodeEntities 解码命名/十进制/十六进制实体', () => {
    expect(decodeEntities('a&amp;b')).toBe('a&b');
    expect(decodeEntities('&#39;')).toBe('\'');
    expect(decodeEntities('&#20013;')).toBe('中');
    expect(decodeEntities('&#x4E2D;')).toBe('中');
    expect(decodeEntities('x&nbsp;y')).toBe('x y');
  });

  test('stripHtml 去标签、解实体并折叠空白', () => {
    expect(stripHtml('<p>Hello&nbsp;<b>world</b></p>')).toBe('Hello world');
    expect(stripHtml('<div>\n  a\t\tb\n</div>')).toBe('a b');
  });

  test('truncate 仅在超长时截断并补省略号', () => {
    expect(truncate('short', 10)).toBe('short');
    const long = truncate('x'.repeat(50), 10);
    expect(long).toHaveLength(10);
    expect(long.endsWith('…')).toBe(true);
  });

  test('formatDate 输出本地 YYYYMMDD', () => {
    expect(formatDate(FIXED_NOW)).toBe('20260607');
  });
});

describe('htmlToBlocks', () => {
  test('段落标签拆成多个块', () => {
    const blocks = htmlToBlocks('<p>段一</p><p>段二</p>');
    expect(blocks).toEqual([{ type: 'p', text: '段一' }, { type: 'p', text: '段二' }]);
  });

  test('br 与 div 也产生换行', () => {
    expect(htmlToBlocks('<div>alpha<br>beta</div>').map((b) => b.text)).toEqual(['alpha', 'beta']);
  });

  test('遵守 maxParagraphs 上限', () => {
    const html = Array.from({ length: 20 }, (_, i) => `<p>段落${i + 1}</p>`).join('');
    expect(htmlToBlocks(html, { maxParagraphs: 3 })).toHaveLength(3);
  });

  test('过滤过短/空白行', () => {
    expect(htmlToBlocks('<p>ok</p><p> </p><p>.</p>')).toEqual([{ type: 'p', text: 'ok' }]);
  });
});

describe('分类推断（必须在白名单内）', () => {
  test.each([
    ['Liv-ex 拍卖价格指数上涨', 'market-trends'],
    ['烧烤与葡萄酒的配餐建议', 'wine-food'],
    ['适量饮酒对心脏健康的影响', 'wine-health'],
    ['新手入门：如何选购与储存葡萄酒', 'practical-guide'],
    ['波尔多酒庄的历史与风土故事', 'wine-culture'],
    ['破解葡萄酒的常见误区', 'wine-myth'],
    ['夏日旅行中的葡萄酒场景', 'lifestyle'],
    ['单宁与酸度是什么', 'wine-knowledge'],
    ['Southern Glazer\u2019s to Pay $12.5 Million to Resolve Bribery Investigation', 'market-trends']
  ])('「%s」-> %s', (text, expected) => {
    expect(inferCategory(text)).toBe(expected);
  });

  test('推断结果始终是引擎允许的分类', () => {
    for (const text of ['随便写点什么', 'market news', '健康']) {
      expect(CATEGORIES).toContain(inferCategory(text));
    }
  });
});

describe('inferTags', () => {
  test('最多 5 个且包含来源名', () => {
    const tags = inferTags('市场 拍卖 价格 投资 收藏', SOURCE, 'market-trends');
    expect(tags.length).toBeLessThanOrEqual(5);
    expect(tags).toContain('Decanter');
  });

  test('无明显关键词时至少给出兜底标签', () => {
    const tags = inferTags('zzz', { name: 'S', type: 'news' }, 'wine-knowledge');
    expect(tags.length).toBeGreaterThanOrEqual(2);
  });
});

describe('buildDraft 与引擎契约', () => {
  test('产出通过 validateSpec', () => {
    const draft = buildDraft(ITEM, SOURCE, { now: FIXED_NOW });
    expect(validateSpec(draft)).toEqual([]);
  });

  test('能被 buildArticle 组装（不会在渲染时才失败）', () => {
    const draft = buildDraft(ITEM, SOURCE, { now: FIXED_NOW });
    const article = buildArticle(draft);
    expect(article.content).toContain('<section');
    expect(article.title).toBe(ITEM.title);
  });

  test('name 形如 news_YYYYMMDD_<source>_<hash>', () => {
    const draft = buildDraft(ITEM, SOURCE, { now: FIXED_NOW });
    expect(draft.name).toMatch(/^news_20260607_decanter_[0-9a-f]{8}$/);
  });

  test('digest 不超过微信 120 字限制', () => {
    const long = { ...ITEM, contentSnippet: '很长的摘要'.repeat(50) };
    expect(buildDraft(long, SOURCE, { now: FIXED_NOW }).digest.length).toBeLessThanOrEqual(120);
  });

  test('正文为空时回退为单个段落块（content 不能为空）', () => {
    const draft = buildDraft({ title: '只有标题', link: 'u' }, SOURCE, { now: FIXED_NOW });
    expect(draft.content.length).toBeGreaterThan(0);
    expect(validateSpec(draft)).toEqual([]);
  });

  test('source 溯源字段不进入最终产物', () => {
    const draft = buildDraft(ITEM, SOURCE, { now: FIXED_NOW });
    const article = buildArticle(draft);
    expect(draft.source.url).toBe(ITEM.link);
    expect(article).not.toHaveProperty('source');
  });

  test('category 始终是白名单值', () => {
    const draft = buildDraft(ITEM, SOURCE, { now: FIXED_NOW });
    expect(CATEGORIES).toContain(draft.category);
  });
});

describe('slugFor', () => {
  test('稳定且仅含安全字符', () => {
    const a = slugFor(SOURCE, '标题 with spaces & 符号', FIXED_NOW);
    const b = slugFor(SOURCE, '标题 with spaces & 符号', FIXED_NOW);
    expect(a).toBe(b);
    expect(a).toMatch(/^[a-z0-9_]+$/);
  });

  test('不同标题得到不同 slug', () => {
    expect(slugFor(SOURCE, 'A', FIXED_NOW)).not.toBe(slugFor(SOURCE, 'B', FIXED_NOW));
  });
});

describe('fetchSource（mock axios + 真实 rss-parser）', () => {
  const RSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>Test Feed</title>
  <item>
    <title>Hello Wine</title>
    <link>https://example.com/a</link>
    <description><![CDATA[<p>Body text here.</p>]]></description>
    <pubDate>Tue, 07 Jun 2026 00:00:00 GMT</pubDate>
  </item>
</channel></rss>`;

  test('解析出条目，并以文本方式请求（便于走代理）', async () => {
    axios.get.mockResolvedValue({ data: RSS });

    const out = await fetchSource(SOURCE);

    expect(out.items).toHaveLength(1);
    expect(out.items[0].title).toBe('Hello Wine');
    expect(out.feedTitle).toBe('Test Feed');
    expect(axios.get).toHaveBeenCalledWith(
      SOURCE.url,
      expect.objectContaining({ responseType: 'text' })
    );
  });
});

describe('buildDrafts 去重与限量', () => {
  const makeFetched = (items) => [{ source: SOURCE, items }];

  test('运行内按标题与链接去重', () => {
    const { drafts, skipped } = buildDrafts(
      makeFetched([
        { title: 'A', link: 'u1', content: '<p>a</p>' },
        { title: 'A', link: 'u2', content: '<p>b</p>' }, // 同标题
        { title: 'B', link: 'u1', content: '<p>c</p>' }  // 同链接
      ]),
      { limit: 10, now: FIXED_NOW, seen: { urls: new Set(), titles: new Set() } }
    );

    expect(drafts).toHaveLength(1);
    expect(skipped.map((s) => s.reason).sort()).toEqual(['dup-title', 'dup-url']);
  });

  test('已存在的标题会被跳过（跨运行去重）', () => {
    const seen = { urls: new Set(), titles: new Set(['A']) };
    const { drafts, skipped } = buildDrafts(
      makeFetched([{ title: 'A', link: 'u1', content: '<p>a</p>' }]),
      { limit: 10, now: FIXED_NOW, seen }
    );
    expect(drafts).toHaveLength(0);
    expect(skipped[0].reason).toBe('dup-title');
  });

  test('遵守 limit 上限', () => {
    const items = Array.from({ length: 8 }, (_, i) => ({ title: `T${i}`, link: `u${i}`, content: '<p>x</p>' }));
    const { drafts } = buildDrafts(makeFetched(items), {
      limit: 3, now: FIXED_NOW, seen: { urls: new Set(), titles: new Set() }
    });
    expect(drafts).toHaveLength(3);
  });

  test('无标题条目被跳过', () => {
    const { drafts, skipped } = buildDrafts(
      makeFetched([{ title: '   ', link: 'u1' }]),
      { limit: 5, now: FIXED_NOW, seen: { urls: new Set(), titles: new Set() } }
    );
    expect(drafts).toHaveLength(0);
    expect(skipped[0].reason).toBe('no-title');
  });
});

describe('collectSeen / writeDrafts（文件系统）', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fetch-news-'));
  });
  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('写出草稿文件并可解析', () => {
    const draft = buildDraft(ITEM, SOURCE, { now: FIXED_NOW });
    const paths = writeDrafts([draft], tmpDir);

    expect(paths).toHaveLength(1);
    const written = JSON.parse(fs.readFileSync(paths[0], 'utf8'));
    expect(written.title).toBe(ITEM.title);
    expect(buildArticle(written).content).toContain('<section');
  });

  test('collectSeen 汇总顶层与 _incoming 的标题/链接', () => {
    fs.mkdirSync(path.join(tmpDir, '_incoming'), { recursive: true });
    fs.writeFileSync(path.join(tmpDir, 'a.json'), JSON.stringify({ title: 'Top', source: { url: 'u-top' } }));
    fs.writeFileSync(path.join(tmpDir, '_incoming', 'b.json'), JSON.stringify({ title: 'Draft', source: { url: 'u-draft' } }));

    const { urls, titles } = collectSeen(tmpDir);
    expect(titles.has('Top')).toBe(true);
    expect(titles.has('Draft')).toBe(true);
    expect(urls.has('u-top')).toBe(true);
    expect(urls.has('u-draft')).toBe(true);
  });

  test('损坏的 JSON 被忽略而不抛错', () => {
    fs.writeFileSync(path.join(tmpDir, 'broken.json'), '{ not json');
    expect(() => collectSeen(tmpDir)).not.toThrow();
  });
});

describe('parseArgs', () => {
  test('默认值', () => {
    const o = parseArgs([]);
    expect(o.limit).toBe(5);
    expect(o.dryRun).toBe(false);
    expect(o.json).toBe(false);
    expect(o.source).toBe('');
  });

  test('解析 source / limit / dry-run / json', () => {
    const o = parseArgs(['--source', 'Decanter', '--limit', '3', '--dry-run', '--json']);
    expect(o.source).toBe('Decanter');
    expect(o.limit).toBe(3);
    expect(o.dryRun).toBe(true);
    expect(o.json).toBe(true);
  });

  test('未知选项抛错', () => {
    expect(() => parseArgs(['--nope'])).toThrow('未知选项');
  });
});
