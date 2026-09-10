/**
 * 出口 IP 监控测试
 *
 * 这些用例固化了「什么时候该打扰用户」的策略，属于行为契约，改动需谨慎。
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  decideNotification,
  isSuppressed,
  loadState,
  saveState,
  formatTime
} = require('../tools/ip-watch');

/** 构造一个 runPreflight 形态的结果 */
function makeResult(overrides = {}) {
  return {
    verdict: 'ok',
    effectiveIp: '1.2.3.4',
    ip: '1.2.3.4',
    reportedIp: null,
    errcode: null,
    errmsg: null,
    networkError: null,
    expiresIn: 7200,
    checkedAt: '2026-09-11T02:00:00.000Z',
    ...overrides
  };
}

describe('decideNotification', () => {
  test('首次运行且通过时应通知', () => {
    const d = decideNotification(makeResult(), {});
    expect(d.notify).toBe(true);
    expect(d.reason).toBe('first-run');
    expect(d.level).toBe('ok');
  });

  test('无变化时应保持静默（避免刷屏）', () => {
    const d = decideNotification(makeResult(), {
      checkedAt: '2026-09-10T02:00:00.000Z',
      ip: '1.2.3.4',
      verdict: 'ok'
    });
    expect(d.notify).toBe(false);
    expect(d.reason).toBe('unchanged');
  });

  test('--force 时即使无变化也通知', () => {
    const d = decideNotification(
      makeResult(),
      { checkedAt: '2026-09-10T02:00:00.000Z', ip: '1.2.3.4', verdict: 'ok' },
      { force: true }
    );
    expect(d.notify).toBe(true);
    expect(d.reason).toBe('forced');
  });

  test('40164 白名单阻断应告警并给出要添加的 IP 与操作路径', () => {
    const d = decideNotification(
      makeResult({ verdict: 'blocked', errcode: 40164, errmsg: 'invalid ip 1.2.3.4' }),
      { checkedAt: '2026-09-10T02:00:00.000Z', ip: '1.2.3.4', verdict: 'ok' }
    );
    expect(d.notify).toBe(true);
    expect(d.level).toBe('error');
    expect(d.title).toContain('白名单');
    expect(d.lines.join('\n')).toContain('1.2.3.4');
    expect(d.lines.join('\n')).toContain('IP白名单');
  });

  test('IP 变化导致的阻断应同时报告新旧 IP', () => {
    const d = decideNotification(
      makeResult({ verdict: 'blocked', errcode: 40164, effectiveIp: '5.6.7.8', reportedIp: '5.6.7.8' }),
      { checkedAt: '2026-09-10T02:00:00.000Z', ip: '1.2.3.4', verdict: 'ok' }
    );
    const body = d.lines.join('\n');
    expect(body).toContain('IP 变化：1.2.3.4 → 5.6.7.8');
    expect(d.key).toBe('whitelist-blocked:5.6.7.8');
  });

  test('从阻断中恢复应通知', () => {
    const d = decideNotification(makeResult(), {
      checkedAt: '2026-09-10T02:00:00.000Z',
      ip: '1.2.3.4',
      verdict: 'blocked'
    });
    expect(d.notify).toBe(true);
    expect(d.reason).toBe('recovered');
    expect(d.level).toBe('ok');
  });

  test('IP 变化但当前可用应提醒（换网后可能失效）', () => {
    const d = decideNotification(
      makeResult({ effectiveIp: '9.9.9.9' }),
      { checkedAt: '2026-09-10T02:00:00.000Z', ip: '1.2.3.4', verdict: 'ok' }
    );
    expect(d.notify).toBe(true);
    expect(d.reason).toBe('ip-changed');
    expect(d.level).toBe('warn');
    expect(d.lines.join('\n')).toContain('9.9.9.9');
  });

  test('凭据未配置应告警', () => {
    const d = decideNotification(makeResult({ verdict: 'credentials' }), {});
    expect(d.notify).toBe(true);
    expect(d.reason).toBe('credentials');
    expect(d.lines.join('\n')).toContain('WECHAT_APPID');
  });

  test('网络不可达应单独分类（而非笼统的“未通过”）', () => {
    const d = decideNotification(
      makeResult({ verdict: 'blocked', networkError: 'ETIMEDOUT' }),
      {}
    );
    expect(d.notify).toBe(true);
    expect(d.reason).toBe('network');
    expect(d.lines.join('\n')).toContain('ETIMEDOUT');
  });

  test('其它错误码应归为通用阻断', () => {
    const d = decideNotification(
      makeResult({ verdict: 'blocked', errcode: 45009, errmsg: 'api freq out of limit' }),
      {}
    );
    expect(d.notify).toBe(true);
    expect(d.reason).toBe('blocked');
    expect(d.lines.join('\n')).toContain('45009');
  });

  test('所有通知都应带检查时间', () => {
    const d = decideNotification(makeResult({ verdict: 'credentials' }), {});
    expect(d.lines[d.lines.length - 1]).toMatch(/^检查时间：/);
  });
});

describe('isSuppressed', () => {
  const now = new Date('2026-09-11T12:00:00.000Z').getTime();

  test('同一结论在冷却期内应被抑制', () => {
    const decision = { notify: true, key: 'whitelist-blocked:1.2.3.4', reason: 'whitelist-blocked' };
    const prev = { lastNotifiedKey: 'whitelist-blocked:1.2.3.4', lastNotifiedAt: '2026-09-11T10:00:00.000Z' };
    expect(isSuppressed(decision, prev, now, 6)).toBe(true);
  });

  test('超过冷却期后应重新提醒', () => {
    const decision = { notify: true, key: 'whitelist-blocked:1.2.3.4', reason: 'whitelist-blocked' };
    const prev = { lastNotifiedKey: 'whitelist-blocked:1.2.3.4', lastNotifiedAt: '2026-09-11T04:00:00.000Z' };
    expect(isSuppressed(decision, prev, now, 6)).toBe(false);
  });

  test('结论变化（key 不同）不应被抑制', () => {
    const decision = { notify: true, key: 'whitelist-blocked:5.6.7.8', reason: 'whitelist-blocked' };
    const prev = { lastNotifiedKey: 'whitelist-blocked:1.2.3.4', lastNotifiedAt: '2026-09-11T11:59:00.000Z' };
    expect(isSuppressed(decision, prev, now, 6)).toBe(false);
  });

  test('IP 变化与恢复属于状态跃迁，永不被冷却期抑制', () => {
    const prev = {
      lastNotifiedKey: 'ip-changed:9.9.9.9',
      lastNotifiedAt: '2026-09-11T11:59:00.000Z'
    };
    expect(isSuppressed({ notify: true, key: 'ip-changed:9.9.9.9', reason: 'ip-changed' }, prev, now, 6)).toBe(false);
    expect(isSuppressed({ notify: true, key: 'recovered:9.9.9.9', reason: 'recovered' }, prev, now, 6)).toBe(false);
  });

  test('从未通知过时不应被抑制', () => {
    expect(isSuppressed({ notify: true, key: 'x', reason: 'blocked' }, {}, now, 6)).toBe(false);
  });
});

describe('状态读写', () => {
  let dir;
  let statePath;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ip-watch-'));
    statePath = path.join(dir, 'nested', 'state.json');
  });

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  test('文件不存在时应返回空对象（视为首次运行）', () => {
    expect(loadState(statePath)).toEqual({});
  });

  test('损坏的 JSON 不应抛异常', () => {
    fs.mkdirSync(path.dirname(statePath), { recursive: true });
    fs.writeFileSync(statePath, '{ 这不是 json', 'utf8');
    expect(loadState(statePath)).toEqual({});
  });

  test('写入应自动创建父目录并可与已有内容合并', () => {
    saveState(statePath, { ip: '1.2.3.4' });
    saveState(statePath, { verdict: 'ok' });

    const state = loadState(statePath);
    expect(state.ip).toBe('1.2.3.4');
    expect(state.verdict).toBe('ok');
  });
});

describe('formatTime', () => {
  test('应输出 YYYY-MM-DD HH:mm', () => {
    const formatted = formatTime('2026-09-11T02:31:00.000Z');
    expect(formatted).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
  });

  test('缺省时应回退到当前时间', () => {
    expect(formatTime()).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
  });
});
