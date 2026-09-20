/**
 * engine/publish-state.js 测试
 *
 * 这个状态表是发布幂等性的唯一依据：写漏一笔 -> 定时任务重复建草稿；
 * 写坏文件 -> 定时任务可能把 100 篇历史文章全发一遍。因此这里同时守住
 * 「写入形状」与「容错读取」两条不变量。
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  DEFAULT_STATE_PATH,
  resolveStatePath,
  loadState,
  saveState,
  recordPublished
} = require('../engine/publish-state');

const ROOT = path.resolve(__dirname, '..');

let tmpDir;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'publish-state-'));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

const stateFile = () => path.join(tmpDir, 'state.json');

describe('resolveStatePath', () => {
  test('默认指向仓库内的 logs/publish-state.json', () => {
    expect(resolveStatePath({})).toBe(DEFAULT_STATE_PATH);
    expect(DEFAULT_STATE_PATH).toBe(path.join(ROOT, 'logs', 'publish-state.json'));
  });

  test('PUBLISH_STATE 可覆盖（测试/多环境用）', () => {
    expect(resolveStatePath({ PUBLISH_STATE: 'C:/tmp/other.json' })).toBe('C:/tmp/other.json');
  });

  test('空字符串不应被当成有效覆盖', () => {
    expect(resolveStatePath({ PUBLISH_STATE: '' })).toBe(DEFAULT_STATE_PATH);
  });
});

describe('loadState', () => {
  test('缺失、损坏、非对象一律视为空状态', () => {
    expect(loadState(path.join(tmpDir, 'nope.json'))).toEqual({});

    fs.writeFileSync(stateFile(), '{ broken');
    expect(loadState(stateFile())).toEqual({});

    fs.writeFileSync(stateFile(), '"just a string"');
    expect(loadState(stateFile())).toEqual({});

    fs.writeFileSync(stateFile(), 'null');
    expect(loadState(stateFile())).toEqual({});
  });

  test('已有状态下不会抛错（含数组内容）', () => {
    fs.writeFileSync(stateFile(), JSON.stringify({ a: { mediaId: 'M' } }));
    expect(loadState(stateFile())).toEqual({ a: { mediaId: 'M' } });
  });
});

describe('saveState', () => {
  test('自动建目录并往返读写', () => {
    const p = path.join(tmpDir, 'logs', 'publish-state.json');
    saveState(p, { a: { mediaId: 'M' } });
    expect(fs.existsSync(p)).toBe(true);
    expect(loadState(p)).toEqual({ a: { mediaId: 'M' } });
  });

  test('以 2 空格缩进 + 末尾换行写入（与既有文件保持一致，便于 diff）', () => {
    const p = path.join(tmpDir, 'state.json');
    saveState(p, { a: 1 });
    expect(fs.readFileSync(p, 'utf8')).toBe('{\n  "a": 1\n}\n');
  });
});

describe('recordPublished', () => {
  const AT = () => '2026-09-21T00:00:00.000Z';

  test('新建草稿：写入 mediaId + publishedAt', () => {
    const entry = recordPublished(stateFile(), 'new_article', { mediaId: 'MID', status: 'published' }, AT);
    expect(entry).toEqual({ mediaId: 'MID', publishedAt: '2026-09-21T00:00:00.000Z' });
    expect(loadState(stateFile())).toEqual({ new_article: entry });
  });

  test('不覆盖状态表里的其它文章', () => {
    saveState(stateFile(), { other: { baseline: true } });
    recordPublished(stateFile(), 'new_article', { mediaId: 'MID' }, AT);
    expect(Object.keys(loadState(stateFile())).sort()).toEqual(['new_article', 'other']);
  });

  test('更新已有草稿：保留首次 publishedAt，另记 updatedAt', () => {
    saveState(stateFile(), { art: { mediaId: 'OLD', publishedAt: '2026-01-01T00:00:00.000Z' } });
    const entry = recordPublished(stateFile(), 'art', { mediaId: 'OLD', status: 'updated' }, AT);

    expect(entry.publishedAt).toBe('2026-01-01T00:00:00.000Z');
    expect(entry.updatedAt).toBe('2026-09-21T00:00:00.000Z');
    expect(entry.mediaId).toBe('OLD');
  });

  test('更新一篇状态表里没有的文章：也要落成「有草稿」，否则定时任务会重发', () => {
    const entry = recordPublished(stateFile(), 'art', { mediaId: 'MID', status: 'updated' }, AT);
    expect(entry.mediaId).toBe('MID');
    expect(entry.publishedAt).toBe('2026-09-21T00:00:00.000Z');
    expect(entry.updatedAt).toBe('2026-09-21T00:00:00.000Z');
  });

  test('更新时不丢原有的 baseline 标记（其余字段原样保留）', () => {
    saveState(stateFile(), { art: { baseline: true, recordedAt: 'R' } });
    const entry = recordPublished(stateFile(), 'art', { mediaId: 'MID', status: 'updated' }, AT);
    expect(entry.baseline).toBe(true);
    expect(entry.recordedAt).toBe('R');
  });

  test('没有 mediaId 时也不写坏文件（落成 null，key 仍然存在）', () => {
    const entry = recordPublished(stateFile(), 'art', {}, AT);
    expect(entry).toEqual({ mediaId: null, publishedAt: '2026-09-21T00:00:00.000Z' });
    expect(loadState(stateFile())).toHaveProperty('art');
  });

  test('缺少 name 应直接抛错，而不是写出一个无名条目', () => {
    expect(() => recordPublished(stateFile(), '', { mediaId: 'M' }, AT)).toThrow('name');
    expect(fs.existsSync(stateFile())).toBe(false);
  });

  test('状态文件损坏时能自愈：覆盖为只含新条目的合法 JSON', () => {
    fs.writeFileSync(stateFile(), '{ broken');
    recordPublished(stateFile(), 'art', { mediaId: 'MID' }, AT);
    expect(loadState(stateFile())).toEqual({ art: { mediaId: 'MID', publishedAt: '2026-09-21T00:00:00.000Z' } });
  });
});
