/**
 * tools/publish-pending.js 测试
 *
 * 定时发布的关键是**幂等**：不能重复建草稿，也不能第一次执行就把全部历史文章
 * 发成草稿。测试围绕这两条不变量，外加失败不记状态（以便下次重试）。
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  loadState,
  saveState,
  listArticleFiles,
  planPublishing,
  publishPending,
  parseCliArgs
} = require('../tools/publish-pending');

let tmpDir;
let articlesDir;

const writeArticle = (name) => {
  const file = path.join(articlesDir, `${name}.json`);
  fs.writeFileSync(file, JSON.stringify({ name, title: name, theme: {}, tags: [], content: [] }));
  return file;
};

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'publish-pending-'));
  articlesDir = path.join(tmpDir, 'articles');
  fs.mkdirSync(articlesDir, { recursive: true });
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('loadState / saveState', () => {
  test('缺失或损坏都视为空状态', () => {
    const p = path.join(tmpDir, 'nope.json');
    expect(loadState(p)).toEqual({});
    fs.writeFileSync(p, '{ broken');
    expect(loadState(p)).toEqual({});
  });

  test('往返读写并自动建目录', () => {
    const p = path.join(tmpDir, 'nested', 'state.json');
    saveState(p, { a: { mediaId: 'M' } });
    expect(loadState(p)).toEqual({ a: { mediaId: 'M' } });
  });
});

describe('listArticleFiles', () => {
  test('只取顶层 *.json 且排序', () => {
    writeArticle('b');
    writeArticle('a');
    fs.writeFileSync(path.join(articlesDir, 'note.md'), 'x');
    fs.mkdirSync(path.join(articlesDir, '_incoming'));
    fs.writeFileSync(path.join(articlesDir, '_incoming', 'draft.json'), '{}');

    const files = listArticleFiles(articlesDir).map((f) => path.basename(f));
    expect(files).toEqual(['a.json', 'b.json']); // 非递归、不含 md 与子目录
  });

  test('目录不存在时返回空数组', () => {
    expect(listArticleFiles(path.join(tmpDir, 'missing'))).toEqual([]);
  });
});

describe('planPublishing', () => {
  test('首次运行只建基线，不发布（避免一次发 100 篇）', () => {
    const a = writeArticle('a');
    const b = writeArticle('b');
    const { baseline, pending } = planPublishing({ articlesDir, state: {} });
    expect(pending).toEqual([]);
    expect(baseline.sort()).toEqual([a, b].sort());
  });

  test('--include-existing 时首次运行就发布全部', () => {
    writeArticle('a');
    const { baseline, pending } = planPublishing({ articlesDir, state: {}, includeExisting: true });
    expect(baseline).toEqual([]);
    expect(pending).toHaveLength(1);
  });

  test('已有状态时只发布未记录的', () => {
    const a = writeArticle('a');
    writeArticle('b');
    const { pending } = planPublishing({ articlesDir, state: { a: { mediaId: 'M' } } });
    expect(pending.map((f) => path.basename(f))).toEqual(['b.json']);
    expect(pending).not.toContain(a);
  });

  test('--force 忽略状态，全部重发', () => {
    writeArticle('a');
    const { pending } = planPublishing({ articlesDir, state: { a: {} }, force: true });
    expect(pending).toHaveLength(1);
  });

  test('显式 --file 时按指定文件，且不受首次运行基线影响', () => {
    const a = writeArticle('a');
    writeArticle('b');
    const { baseline, pending } = planPublishing({ articlesDir, state: {}, files: [a] });
    expect(baseline).toEqual([]);
    expect(pending).toEqual([a]);
  });

  test('显式 --file 已发布过则跳过（除非 force）', () => {
    const a = writeArticle('a');
    const state = { a: { mediaId: 'M' } };
    expect(planPublishing({ articlesDir, state, files: [a] }).pending).toEqual([]);
    expect(planPublishing({ articlesDir, state, files: [a], force: true }).pending).toEqual([a]);
  });
});

describe('publishPending', () => {
  const opts = { publish: true, quiet: true };

  test('成功时记录状态并落盘', async () => {
    const statePath = path.join(tmpDir, 'state.json');
    const state = {};
    const run = jest.fn().mockResolvedValue({ status: 'published', draftMediaId: 'MEDIA_1' });

    const results = await publishPending({
      pending: [path.join(articlesDir, 'a.json')],
      state,
      statePath,
      opts,
      processOne: run,
      now: () => '2026-09-14T00:00:00.000Z'
    });

    expect(results).toEqual([{ name: 'a', status: 'published', mediaId: 'MEDIA_1' }]);
    expect(state.a).toEqual({ mediaId: 'MEDIA_1', publishedAt: '2026-09-14T00:00:00.000Z' });
    expect(loadState(statePath).a.mediaId).toBe('MEDIA_1');
  });

  test('失败时不写状态（下次会自动重试）', async () => {
    const statePath = path.join(tmpDir, 'state.json');
    const state = {};
    const run = jest.fn().mockRejectedValue(new Error('IP 白名单阻断\n第二行'));

    const results = await publishPending({
      pending: [path.join(articlesDir, 'a.json')],
      state,
      statePath,
      opts,
      processOne: run
    });

    expect(results[0]).toMatchObject({ name: 'a', status: 'failed' });
    expect(state).toEqual({});
    expect(fs.existsSync(statePath)).toBe(false);
  });

  test('幂等：同一批文章第二次不会被再次发布', async () => {
    const statePath = path.join(tmpDir, 'state.json');
    const state = {};
    const files = [path.join(articlesDir, 'a.json')];
    const run = jest.fn().mockResolvedValue({ status: 'published', draftMediaId: 'M' });

    await publishPending({ pending: files, state, statePath, opts, processOne: run });
    expect(run).toHaveBeenCalledTimes(1);

    // 第二次：状态里已有 a，规划阶段就不会再选它
    const { pending } = planPublishing({ articlesDir, state });
    await publishPending({ pending, state, statePath, opts, processOne: run });
    expect(run).toHaveBeenCalledTimes(1);
  });

  test('非预期状态会被标记出来', async () => {
    const statePath = path.join(tmpDir, 'state.json');
    const state = {};
    const run = jest.fn().mockResolvedValue({ status: 'checked' });

    const results = await publishPending({
      pending: [path.join(articlesDir, 'a.json')],
      state,
      statePath,
      opts,
      processOne: run
    });

    expect(results[0].status).toBe('unexpected');
    expect(state).toEqual({});
  });
});

describe('parseCliArgs', () => {
  test('解析开关与可重复的 --file', () => {
    const o = parseCliArgs(['--dry-run', '--force', '--include-existing', '--quiet',
      '--file', 'articles/a.json', '--file', 'articles/b.json']);
    expect(o).toMatchObject({ dryRun: true, force: true, includeExisting: true, quiet: true });
    expect(o.files).toEqual(['articles/a.json', 'articles/b.json']);
  });

  test('默认值', () => {
    const o = parseCliArgs([]);
    expect(o).toMatchObject({ dryRun: false, force: false, includeExisting: false, help: false });
    expect(o.files).toEqual([]);
  });
});
