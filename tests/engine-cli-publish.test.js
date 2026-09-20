/**
 * engine/cli.js 的**发布路径**测试
 *
 * 守住的是一条具体的坑：`engine/cli.js --publish` 手工建完草稿后，如果不把
 * 「这篇文章已有草稿」写进 logs/publish-state.json，每天 09:00 的定时任务
 * （tools/publish-pending.js）会认为它还是新文章，再建一个重复草稿。
 *
 * 微信 API 全部 mock，不触网、不读 .env。
 */

jest.mock('../engine/wechat', () => {
  const client = {
    getAccessToken: jest.fn(),
    uploadThumb: jest.fn(),
    addDraft: jest.fn(),
    updateDraft: jest.fn()
  };
  return { WeChatClient: jest.fn(() => client), __client: client };
});

const fs = require('fs');
const os = require('os');
const path = require('path');

const { processOne } = require('../engine/cli');
const { loadState } = require('../engine/publish-state');
const { __client: client } = require('../engine/wechat');

const ROOT = path.resolve(__dirname, '..');
const ARTICLE = path.join(ROOT, 'articles', 'bbq_pairing.json');

let tmpDir;
let statePath;
let savedStateEnv;

beforeEach(() => {
  jest.clearAllMocks();
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cli-publish-'));
  statePath = path.join(tmpDir, 'logs', 'publish-state.json');
  savedStateEnv = process.env.PUBLISH_STATE;
  process.env.PUBLISH_STATE = statePath;

  client.getAccessToken.mockResolvedValue('TOKEN');
  client.uploadThumb.mockResolvedValue({ media_id: 'THUMB_ID' });
  client.addDraft.mockResolvedValue({ media_id: 'DRAFT_ID' });
  client.updateDraft.mockResolvedValue({});
});

afterEach(() => {
  if (savedStateEnv === undefined) {delete process.env.PUBLISH_STATE;} else {process.env.PUBLISH_STATE = savedStateEnv;}
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

/** 发布路径需要一个能离线生成的封面：coverAi:false 强制走矢量封面 */
const options = (overrides = {}) => ({
  out: path.join(tmpDir, 'output'),
  quiet: true,
  coverAi: false,
  publish: true,
  ...overrides
});

describe('cli: --publish 与发布状态登记', () => {
  test('新建草稿后应自动登记状态（否则定时任务会重复建草稿）', async () => {
    const r = await processOne(ARTICLE, options());

    expect(r.status).toBe('published');
    expect(r.draftMediaId).toBe('DRAFT_ID');
    expect(r.statePath).toBe(statePath);

    const state = loadState(statePath);
    expect(state.bbq_pairing.mediaId).toBe('DRAFT_ID');
    expect(typeof state.bbq_pairing.publishedAt).toBe('string');
  });

  test('登记后 publish-pending 再看到这篇文章就是「已发布」', async () => {
    await processOne(ARTICLE, options());
    // 幂等性的实质：状态表里出现了这个 key
    expect(loadState(statePath)).toHaveProperty('bbq_pairing');
  });

  test('--no-mark-published 应完全不动状态表（逃生舱）', async () => {
    const r = await processOne(ARTICLE, options({ markPublished: false }));

    expect(r.status).toBe('published');
    expect(r.statePath).toBeUndefined();
    expect(fs.existsSync(statePath)).toBe(false);
  });

  test('--update-draft 记录为 updated，并保留首次发布时间', async () => {
    fs.mkdirSync(path.dirname(statePath), { recursive: true });
    fs.writeFileSync(statePath, JSON.stringify({
      bbq_pairing: { mediaId: 'OLD_ID', publishedAt: '2026-01-01T00:00:00.000Z' }
    }));

    const r = await processOne(ARTICLE, options({ updateDraft: 'OLD_ID' }));

    expect(r.status).toBe('updated');
    expect(client.updateDraft).toHaveBeenCalled();
    const entry = loadState(statePath).bbq_pairing;
    expect(entry.publishedAt).toBe('2026-01-01T00:00:00.000Z');
    expect(entry.mediaId).toBe('OLD_ID');
    expect(typeof entry.updatedAt).toBe('string');
  });

  test('状态写不进去时只告警，不能把已成功的发布判为失败', async () => {
    // 让状态目录不可建：把它的父级做成一个普通文件
    const blocker = path.join(tmpDir, 'blocker');
    fs.writeFileSync(blocker, 'x');
    process.env.PUBLISH_STATE = path.join(blocker, 'state.json');

    const r = await processOne(ARTICLE, options());

    expect(r.status).toBe('published');
    expect(r.draftMediaId).toBe('DRAFT_ID');
    expect(r.statePath).toBeUndefined();
  });

  test('微信侧失败时不得留下状态（否则下次不会重试）', async () => {
    client.addDraft.mockRejectedValue(new Error('errcode 45009: reach max api daily quota'));

    await expect(processOne(ARTICLE, options())).rejects.toThrow('45009');
    expect(fs.existsSync(statePath)).toBe(false);
  });

  test('前置检查失败时不上传、也不写状态', async () => {
    client.getAccessToken.mockRejectedValue(new Error('IP 不在白名单'));

    await expect(processOne(ARTICLE, options())).rejects.toThrow('发布前置检查未通过');
    expect(client.uploadThumb).not.toHaveBeenCalled();
    expect(fs.existsSync(statePath)).toBe(false);
  });
});
