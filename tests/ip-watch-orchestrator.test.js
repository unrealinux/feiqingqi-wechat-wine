/**
 * ip-watch.js 编排层（runOnce）测试
 *
 * 此前只测了纯函数（decideNotification / isSuppressed / 状态读写），
 * 而把「自检 → 决策 → 冷却抑制 → 通知 → 落盘」串起来的 runOnce 完全未覆盖。
 * 这里通过 mock 掉真实网络自检（check-wechat-ip）来隔离测试这段编排逻辑。
 */

jest.mock('../tools/check-wechat-ip', () => ({
  runPreflight: jest.fn(),
  extractDocComment: jest.fn(() => '')
}));

const fs = require('fs');
const os = require('os');
const path = require('path');

const { runOnce, loadState, saveState, parseArgs } = require('../tools/ip-watch');
const { runPreflight } = require('../tools/check-wechat-ip');

let tmpDir;
let statePath;
let notifier;

beforeEach(() => {
  jest.clearAllMocks();
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ip-watch-'));
  statePath = path.join(tmpDir, 'state.json');
  notifier = {
    enabled: true,
    send: jest.fn().mockResolvedValue({ enabled: true, sent: 1, failed: 0, results: [] })
  };
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

const opts = (over = {}) => ({
  statePath,
  cooldownHours: 6,
  dryRun: false,
  force: false,
  quiet: true,
  json: false,
  ...over
});

const okResult = () => ({
  verdict: 'ok',
  effectiveIp: '1.2.3.4',
  errcode: null,
  checkedAt: new Date().toISOString(),
  exitCode: 0,
  expiresIn: 7200
});

const blockedResult = () => ({
  verdict: 'blocked',
  effectiveIp: '1.2.3.4',
  errcode: 40164,
  errmsg: 'invalid ip',
  checkedAt: new Date().toISOString(),
  exitCode: 1
});

describe('parseArgs', () => {
  afterEach(() => {
    delete process.env.IP_WATCH_STATE;
    delete process.env.IP_WATCH_COOLDOWN_HOURS;
  });

  test('无参数时的默认值', () => {
    const o = parseArgs([]);
    expect(o.daemon).toBe(false);
    expect(o.force).toBe(false);
    expect(o.dryRun).toBe(false);
    expect(o.quiet).toBe(false);
    expect(o.json).toBe(false);
    expect(o.help).toBe(false);
    expect(o.intervalMinutes).toBeNull();
    expect(o.cooldownHours).toBe(6);
  });

  test('布尔开关可被打开', () => {
    const o = parseArgs(['--daemon', '--force', '--dry-run', '--quiet', '--json']);
    expect(o).toMatchObject({ daemon: true, force: true, dryRun: true, quiet: true, json: true });
  });

  test('--interval 解析为数字', () => {
    expect(parseArgs(['--interval', '60']).intervalMinutes).toBe(60);
  });

  test('-h / --help 均可识别', () => {
    expect(parseArgs(['-h']).help).toBe(true);
    expect(parseArgs(['--help']).help).toBe(true);
  });

  test('statePath 与冷却时长可被环境变量覆盖', () => {
    process.env.IP_WATCH_STATE = '/tmp/custom-state.json';
    process.env.IP_WATCH_COOLDOWN_HOURS = '12';
    const o = parseArgs([]);
    expect(o.statePath).toBe('/tmp/custom-state.json');
    expect(o.cooldownHours).toBe(12);
  });
});

describe('runOnce', () => {
  test('首次运行通过时应通知，并把通知水位写入 state', async () => {
    runPreflight.mockResolvedValue(okResult());

    const out = await runOnce(opts(), notifier);

    expect(out.decision.reason).toBe('first-run');
    expect(out.suppressed).toBe(false);
    expect(notifier.send).toHaveBeenCalledTimes(1);
    expect(notifier.send.mock.calls[0][0]).toMatchObject({ level: 'ok' });

    const state = loadState(statePath);
    expect(state.ip).toBe('1.2.3.4');
    expect(state.verdict).toBe('ok');
    expect(state.lastNotifiedKey).toBe('ok:1.2.3.4');
    expect(state.lastNotifiedAt).toBeTruthy();
  });

  test('结论无变化时不应通知', async () => {
    saveState(statePath, {
      ip: '1.2.3.4',
      verdict: 'ok',
      checkedAt: new Date(Date.now() - 3600000).toISOString()
    });
    runPreflight.mockResolvedValue(okResult());

    const out = await runOnce(opts(), notifier);

    expect(out.decision.notify).toBe(false);
    expect(notifier.send).not.toHaveBeenCalled();
    // 状态仍会刷新检查时间，但不新增通知水位
    const state = loadState(statePath);
    expect(state.ip).toBe('1.2.3.4');
    expect(state.lastNotifiedAt).toBeUndefined();
  });

  test('冷却期内同一告警应被抑制，且不刷新通知水位', async () => {
    const notifiedAt = new Date().toISOString();
    saveState(statePath, {
      ip: '1.2.3.4',
      verdict: 'blocked',
      errcode: 40164,
      checkedAt: notifiedAt,
      lastNotifiedAt: notifiedAt,
      lastNotifiedKey: 'whitelist-blocked:1.2.3.4'
    });
    runPreflight.mockResolvedValue(blockedResult());

    const out = await runOnce(opts({ cooldownHours: 6 }), notifier);

    expect(out.decision.notify).toBe(true);
    expect(out.suppressed).toBe(true);
    expect(notifier.send).not.toHaveBeenCalled();
    expect(loadState(statePath).lastNotifiedAt).toBe(notifiedAt);
  });

  test('超过冷却期后应重新告警', async () => {
    const old = new Date(Date.now() - 7 * 3600000).toISOString(); // 7 小时前 > 6
    saveState(statePath, {
      ip: '1.2.3.4',
      verdict: 'blocked',
      errcode: 40164,
      checkedAt: old,
      lastNotifiedAt: old,
      lastNotifiedKey: 'whitelist-blocked:1.2.3.4'
    });
    runPreflight.mockResolvedValue(blockedResult());

    const out = await runOnce(opts({ cooldownHours: 6 }), notifier);

    expect(out.suppressed).toBe(false);
    expect(notifier.send).toHaveBeenCalledTimes(1);
  });

  test('dry-run 不发送通知，也不写入 state', async () => {
    runPreflight.mockResolvedValue(okResult());

    const out = await runOnce(opts({ dryRun: true }), notifier);

    expect(out.decision.notify).toBe(true);
    expect(notifier.send).not.toHaveBeenCalled();
    expect(fs.existsSync(statePath)).toBe(false);
  });

  test('白名单阻断应按 error 级告警并带上要添加的 IP', async () => {
    runPreflight.mockResolvedValue(blockedResult());

    await runOnce(opts(), notifier);

    const message = notifier.send.mock.calls[0][0];
    expect(message.level).toBe('error');
    expect(message.title).toContain('IP 不在白名单');
    expect(message.lines.join('\n')).toContain('1.2.3.4');
  });

  test('通知渠道未启用时仍能完成检查（不抛错）', async () => {
    runPreflight.mockResolvedValue(okResult());
    const disabled = {
      enabled: false,
      send: jest.fn().mockResolvedValue({ enabled: false, sent: 0, failed: 0, results: [] })
    };

    const out = await runOnce(opts(), disabled);
    expect(out.delivery.enabled).toBe(false);
    expect(disabled.send).toHaveBeenCalledTimes(1);
  });
});
