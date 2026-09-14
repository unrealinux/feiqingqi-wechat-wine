/**
 * engine/cli.js 测试
 *
 * 这里的 cli.js 此前完全没有测试覆盖（0%），而它是渲染引擎的入口
 * （参数解析、产物落盘、可选封面与预览）—— 属于最该被守住的部分。
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

const { parseArgs, processOne, buildPreviewHtml, buildCoverBuffer } = require('../engine/cli');

const ROOT = path.resolve(__dirname, '..');
const ARTICLE = path.join(ROOT, 'articles', 'bbq_pairing.json');

let tmpDir;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'engine-cli-'));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

/** processOne 需要的选项对象（默认静默 + 关闭 AI 封面，避免单测触网） */
function options(overrides = {}) {
  return { out: tmpDir, quiet: true, coverAi: false, ...overrides };
}

describe('cli: parseArgs', () => {
  test('应给出合理的默认值', () => {
    const o = parseArgs([]);
    expect(o.files).toEqual([]);
    expect(o.all).toBe(false);
    expect(o.check).toBe(false);
    expect(o.cover).toBe(false);
    expect(o.publish).toBe(false);
    expect(o.out).toBe(path.join(ROOT, 'output'));
  });

  test('应解析文件位置参数', () => {
    expect(parseArgs(['articles/a.json', 'articles/b.json']).files)
      .toEqual(['articles/a.json', 'articles/b.json']);
  });

  test('应解析全部布尔开关', () => {
    const o = parseArgs(['--all', '--check', '--cover', '--html', '--publish', '--quiet']);
    expect(o).toMatchObject({ all: true, check: true, cover: true, html: true, publish: true, quiet: true });
  });

  test('应解析带值的选项', () => {
    const o = parseArgs(['--out', 'dist', '--date', '20260101', '--author', '张三']);
    expect(o.out).toBe(path.resolve(ROOT, 'dist'));
    expect(o.date).toBe('20260101');
    expect(o.author).toBe('张三');
  });

  test('未知选项应抛错而不是静默忽略', () => {
    expect(() => parseArgs(['--nope'])).toThrow('未知选项');
  });

  test('--cover-ai / --no-cover-ai / --cover-ai-provider', () => {
    expect(parseArgs(['--cover-ai']).coverAi).toBe(true);
    expect(parseArgs(['--no-cover-ai']).coverAi).toBe(false);
    expect(parseArgs([]).coverAi).toBeUndefined(); // 默认自动
    expect(parseArgs(['--cover-ai-provider', 'gemini']).coverAiProvider).toBe('gemini');
  });

  test('--update-draft 需要 media_id', () => {
    expect(parseArgs(['--update-draft', 'MID']).updateDraft).toBe('MID');
    expect(parseArgs([]).updateDraft).toBe('');
  });
});

describe('cli: buildCoverBuffer', () => {
  const keys = [
    'GLM_API_KEY', 'ZIMAGE_API_KEY', 'GEMINI_API_KEY',
    'AGNES_API_KEY', 'AGNES_API_URL', 'CUSTOM_IMAGE_API_KEY', 'CUSTOM_IMAGE_API_URL',
    'COVER_AI_PROVIDER'
  ];
  let saved;

  beforeEach(() => {
    saved = {};
    for (const k of keys) { saved[k] = process.env[k]; delete process.env[k]; }
  });
  afterEach(() => {
    for (const k of keys) { if (saved[k] === undefined) { delete process.env[k]; } else { process.env[k] = saved[k]; } }
  });

  const article = { title: '测试封面标题', digest: '摘要', category: 'wine-knowledge', tags: ['t'] };

  test('未配置任何图像 Key 时回退矢量封面（仍输出 PNG）', async () => {
    const buf = await buildCoverBuffer({ theme: { name: 'rich' } }, article, { quiet: true });
    expect(buf.slice(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
  });

  test('--no-cover-ai 即使配置了 Key 也不调用大模型（离线可用）', async () => {
    process.env.GLM_API_KEY = 'fake-key';
    const buf = await buildCoverBuffer({ theme: { name: 'rich' } }, article, { quiet: true, coverAi: false });
    expect(buf.slice(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
  });
});

describe('cli: buildPreviewHtml', () => {
  const article = {
    title: '测试标题',
    author: '红酒顾问',
    category: 'wine-food',
    publishDate: '20260607',
    tags: ['烧烤', '配酒'],
    content: '<section><p>正文</p></section>'
  };

  test('应生成完整 HTML 文档并带上关键元信息', () => {
    const html = buildPreviewHtml(article);
    expect(html.startsWith('<!DOCTYPE html>')).toBe(true);
    expect(html).toContain('<title>测试标题</title>');
    expect(html).toContain('红酒顾问');
    expect(html).toContain('wine-food');
    expect(html).toContain('20260607');
    expect(html).toContain('烧烤');
    expect(html).toContain('<section><p>正文</p></section>');
  });

  test('应标注为本地预览、不参与发布', () => {
    expect(buildPreviewHtml(article)).toContain('不参与发布');
  });
});

describe('cli: processOne', () => {
  test('--check 模式只校验，不写任何文件', async () => {
    const r = await processOne(ARTICLE, options({ check: true }));

    expect(r.status).toBe('checked');
    expect(r.name).toBe('bbq_pairing');
    expect(r.stats.blocks).toBeGreaterThan(0);
    expect(fs.readdirSync(tmpDir)).toEqual([]);
  });

  test('默认渲染并写出与历史产物同构的 JSON', async () => {
    const r = await processOne(ARTICLE, options());

    expect(r.status).toBe('rendered');
    const out = JSON.parse(fs.readFileSync(r.jsonPath, 'utf8'));

    // 字段与顺序须与 output/*.json 一致
    expect(Object.keys(out)).toEqual([
      'title', 'author', 'digest', 'content', 'coverImage', 'category', 'tags', 'publishDate'
    ]);
    expect(out.publishDate).toBe('20260607');
    expect(out.content).toContain('<section');
  });

  test('产物文件命名应为 <name>_<date>.json', async () => {
    const r = await processOne(ARTICLE, options());
    expect(path.basename(r.jsonPath)).toBe('bbq_pairing_20260607.json');
  });

  test('--html 应额外输出 HTML 预览', async () => {
    const r = await processOne(ARTICLE, options({ html: true }));

    expect(r.htmlPath).toBeDefined();
    expect(fs.existsSync(r.htmlPath)).toBe(true);
    expect(fs.readFileSync(r.htmlPath, 'utf8')).toContain('<!DOCTYPE html>');
  });

  test('--cover 应生成 1200x630 PNG 封面', async () => {
    const r = await processOne(ARTICLE, options({ cover: true }));

    expect(r.coverPath).toBeDefined();
    expect(fs.existsSync(r.coverPath)).toBe(true);
    // PNG 魔数
    const buf = fs.readFileSync(r.coverPath);
    expect(buf.slice(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
  });

  test('--date 应覆盖产物日期与文件名', async () => {
    const r = await processOne(ARTICLE, options({ date: '2026-01-02' }));
    expect(path.basename(r.jsonPath)).toBe('bbq_pairing_20260102.json');
    expect(JSON.parse(fs.readFileSync(r.jsonPath, 'utf8')).publishDate).toBe('20260102');
  });

  test('--author 应覆盖作者', async () => {
    const r = await processOne(ARTICLE, options({ author: '测试作者' }));
    expect(JSON.parse(fs.readFileSync(r.jsonPath, 'utf8')).author).toBe('测试作者');
  });

  test('数据非法时应抛出可读错误，而不是写出半成品', async () => {
    const bad = path.join(tmpDir, 'bad.json');
    fs.writeFileSync(bad, JSON.stringify({ name: 'bad', content: [{ type: 'p', text: 'x' }] }));

    await expect(processOne(bad, options())).rejects.toThrow('文章数据校验失败');
  });

  test('嵌套的不存在目录应被自动创建', async () => {
    const nested = path.join(tmpDir, 'a', 'b', 'c');
    const r = await processOne(ARTICLE, options({ out: nested }));
    expect(fs.existsSync(r.jsonPath)).toBe(true);
  });
});
