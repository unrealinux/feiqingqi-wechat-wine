/**
 * tools/generate-article.js 测试
 *
 * 关键不变量（全离线，chat 用注入的假实现）：
 *   1. 用过/重复的素材不会再用一次（否则每天都写同一篇）
 *   2. 不合格的输出必须重试，且把原因回填给模型
 *   3. 三次都不合格 -> 抛错且不写文件（fail-closed）
 *   4. 产出的 spec 必须能过 engine 的 validateSpec 与 buildArticle
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  MAX_ATTEMPTS,
  loadState,
  saveState,
  listIncoming,
  pickMaterials,
  recentTitles,
  buildName,
  generateSpec,
  parseCliArgs,
} = require('../tools/generate-article');
const { validateSpec, buildArticle } = require('../engine/article');

/** 结构合格的稿子（>=1200 字、4 个 h2） */
function goodSpec(title = '一篇合格的稿子') {
  const para = '这是一段用来测试的正文，讲清楚产区、年份与饮用场景，'.repeat(8);
  const content = [{ type: 'title', text: title }, { type: 'lead', text: para }];
  for (let i = 0; i < 4; i++) {
    content.push({ type: 'h2', text: `第 ${i + 1} 节` });
    content.push({ type: 'p', text: para });
    content.push({ type: 'p', text: para });
  }
  content.push({ type: 'end', text: '结束语' });
  return { title, digest: '摘要', category: 'wine-knowledge', tags: ['a', 'b', 'c'], content };
}

const material = { title: '素材标题', content: [{ type: 'p', text: '素材正文' }] };

/** 假 chat：按序返回 JSON 字符串（或抛错） */
function fakeChat(sequence) {
  const calls = [];
  const fn = (opts) => {
    calls.push(opts);
    const next = sequence[Math.min(calls.length - 1, sequence.length - 1)];
    if (next instanceof Error) {return Promise.reject(next);}
    const text = typeof next === 'string' ? next : JSON.stringify(next);
    return Promise.resolve({
      text,
      provider: 'fake',
      model: opts.fallbackModel ? 'fallback-model' : 'main-model',
    });
  };
  fn.calls = calls;
  return fn;
}

let tmpDir;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gen-article-'));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('素材选择', () => {
  const writeIncoming = (dir, names) => {
    names.forEach((n) => fs.writeFileSync(path.join(dir, `${n}.json`), JSON.stringify({ name: n, title: n })));
  };

  test('listIncoming 只列 json，按名字倒序', () => {
    writeIncoming(tmpDir, ['news_20260901_a', 'news_20260921_b']);
    fs.writeFileSync(path.join(tmpDir, 'notes.txt'), 'x');
    expect(listIncoming(tmpDir).map((m) => m.name)).toEqual(['news_20260921_b', 'news_20260901_a']);
  });

  test('已用过的素材会被跳过（同一天不会重复写同一篇）', () => {
    writeIncoming(tmpDir, ['m1', 'm2', 'm3']);
    const { picked } = pickMaterials({ state: { materials: { m3: {} } }, dir: tmpDir, limit: 2 });
    expect(picked.map((f) => path.basename(f, '.json'))).toEqual(['m2', 'm1']);
  });

  test('--allow-reuse 时忽略已用记录', () => {
    writeIncoming(tmpDir, ['m1', 'm2']);
    const { picked } = pickMaterials({ state: { materials: { m2: {} } }, dir: tmpDir, limit: 5, allowReuse: true });
    expect(picked).toHaveLength(2);
  });

  test('显式 --material 时不看状态（手工指定就该照办）', () => {
    const file = path.join(tmpDir, 'm1.json');
    writeIncoming(tmpDir, ['m1']);
    const { picked } = pickMaterials({ state: { materials: { m1: {} } }, files: [file] });
    expect(picked).toEqual([path.resolve(file)]);
  });

  test('limit 生效', () => {
    writeIncoming(tmpDir, ['m1', 'm2', 'm3']);
    expect(pickMaterials({ state: {}, dir: tmpDir, limit: 2 }).picked).toHaveLength(2);
  });
});

describe('状态读写', () => {
  test('状态文件不存在时返回空壳（首次运行不能崩）', () => {
    const s = loadState(path.join(tmpDir, 'nope.json'));
    expect(s).toEqual({ materials: {}, articles: {} });
  });

  test('写坏的状态文件降级为空壳，不抛错', () => {
    const p = path.join(tmpDir, 'bad.json');
    fs.writeFileSync(p, '{not json');
    expect(loadState(p).articles).toEqual({});
  });

  test('saveState 落盘后可读回', () => {
    const p = path.join(tmpDir, 'sub', 'state.json');
    saveState({ materials: { a: {} }, articles: { b: { title: 'T' } } }, p);
    expect(loadState(p).articles.b.title).toBe('T');
  });
});

describe('选题去重', () => {
  test('recentTitles 合并状态里的标题与本目录标题并去重', () => {
    fs.writeFileSync(path.join(tmpDir, 'x.json'), JSON.stringify({ title: '已发 A' }));
    const titles = recentTitles({ state: { articles: { k: { title: '已发 A' } } }, dir: tmpDir });
    expect(titles).toEqual(['已发 A']);
  });
});

describe('buildName', () => {
  test('形如 ai_wine_YYYYMMDD_<category>_<hash4>，全 ASCII', () => {
    const name = buildName({ title: '古酿新生', category: 'wine-food', now: new Date(2026, 8, 7) });
    expect(name).toMatch(/^ai_wine_20260907_wine_food_[0-9a-f]{4}$/);
  });

  test('同一标题稳定（重跑不会产生新文件名）', () => {
    const a = buildName({ title: 'T', category: 'wine-food', now: new Date(2026, 8, 7) });
    const b = buildName({ title: 'T', category: 'wine-food', now: new Date(2026, 8, 7) });
    expect(a).toBe(b);
  });
});

describe('generateSpec', () => {
  test('一次合格：产出能过引擎校验，且渲染不炸', async () => {
    const chatFn = fakeChat([goodSpec()]);
    const r = await generateSpec({ materials: [material], deps: { chat: chatFn } });
    expect(validateSpec(r.spec)).toEqual([]);
    expect(() => buildArticle(r.spec)).not.toThrow();
    expect(chatFn.calls).toHaveLength(1);
    expect(r.spec.name).toMatch(/^ai_wine_\d{8}_/);
    expect(r.spec.publishDate).toMatch(/^\d{8}$/);
  });

  test('第一次太短 -> 自动重试，并把原因回填给模型', async () => {
    const short = { title: 'T', digest: 'd', category: 'wine-knowledge', tags: ['a', 'b', 'c'], content: [{ type: 'title', text: 'T' }, { type: 'h2', text: 'A' }, { type: 'p', text: '短' }] };
    const chatFn = fakeChat([short, goodSpec('第二次合格')]);
    const r = await generateSpec({ materials: [material], deps: { chat: chatFn } });
    expect(chatFn.calls).toHaveLength(2);
    expect(r.spec.title).toBe('第二次合格');
    const retryPrompt = chatFn.calls[1].messages[chatFn.calls[1].messages.length - 1].content;
    expect(retryPrompt).toMatch(/上一次输出不合格/);
    expect(retryPrompt).toMatch(/>=/);
  });

  test('最后一次尝试会切到升档模型', async () => {
    const short = { title: 'T', digest: 'd', category: 'wine-knowledge', tags: ['a', 'b', 'c'], content: [{ type: 'p', text: '短' }] };
    const chatFn = fakeChat([short, short, goodSpec('升档救回')]);
    const r = await generateSpec({ materials: [material], deps: { chat: chatFn } });
    expect(chatFn.calls[2].fallbackModel).toBe(true);
    expect(r.model).toBe('fallback-model');
    expect(r.spec.title).toBe('升档救回');
  });

  test('译名错误也要重试', async () => {
    const bad = { ...goodSpec('误译'), content: [{ type: 'p', text: '这款酒的身体很饱满' }] };
    const chatFn = fakeChat([bad, goodSpec('改对了')]);
    const r = await generateSpec({ materials: [material], deps: { chat: chatFn } });
    expect(r.spec.title).toBe('改对了');
  });

  test('三次都不合格 -> 抛错并带上原始输出（供人工排查提示词）', async () => {
    const bad = { title: 'T', digest: 'd', category: 'wine-knowledge', tags: ['a'], content: [{ type: 'p', text: '短' }] };
    const chatFn = fakeChat([bad, bad, bad]);
    const err = await generateSpec({ materials: [material], deps: { chat: chatFn } }).catch((e) => e);
    expect(err.message).toMatch(new RegExp(`连续 ${MAX_ATTEMPTS} 次生成均不合格`));
    expect(err.rawText).toContain('"content"');
    expect(chatFn.calls).toHaveLength(MAX_ATTEMPTS);
  });

  test('模型调用直接失败（无 key / 全挂）-> 抛错，不做任何降级伪造', async () => {
    const chatFn = fakeChat([new Error('LLM 不可用')]);
    await expect(generateSpec({ materials: [material], deps: { chat: chatFn } })).rejects.toThrow(/LLM 不可用/);
  });

  test('模型输出根本不是 JSON -> 重试', async () => {
    const chatFn = fakeChat(['抱歉我不能写', goodSpec('补上了')]);
    const r = await generateSpec({ materials: [material], deps: { chat: chatFn } });
    expect(r.spec.title).toBe('补上了');
  });

  test('无出处表格行会被剔除，且不影响出稿', async () => {
    const spec = goodSpec('带表格');
    spec.content.push({ type: 'table', headers: ['年份', '评分'], rows: [['1998', '95'], ['1888', '99']] });
    const chatFn = fakeChat([spec]);
    const r = await generateSpec({ materials: [{ title: '素材', content: [{ type: 'p', text: '1998 年的酒拿到 95 分' }] }], deps: { chat: chatFn } });
    const table = r.spec.content.find((b) => b.type === 'table');
    expect(table.rows).toEqual([['1998', '95']]);
    expect(r.warnings.join()).toMatch(/剔除无出处的表格行/);
  });
});

describe('命令行参数', () => {
  test('默认值：不建草稿、不写 review、limit=3', () => {
    const cli = parseCliArgs([]);
    expect(cli).toMatchObject({ publish: false, review: false, dryRun: false, limit: 3, allowReuse: false });
  });

  test('各开关可解析，--material 可多次', () => {
    const cli = parseCliArgs(['--material', 'a.json', '--material', 'b.json', '--publish', '--category', 'wine-food', '--limit', '5']);
    expect(cli.files).toEqual(['a.json', 'b.json']);
    expect(cli.publish).toBe(true);
    expect(cli.category).toBe('wine-food');
    expect(cli.limit).toBe(5);
  });

  test('非法 limit 回退到 3（不产生 NaN 查询）', () => {
    expect(parseCliArgs(['--limit', '0']).limit).toBe(3);
    expect(parseCliArgs(['--limit', 'abc']).limit).toBe(3);
  });
});
