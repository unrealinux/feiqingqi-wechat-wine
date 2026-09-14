/**
 * .env.example 防泄漏测试
 *
 * 背景：曾经把真实 API key 不小心填进了 `.env.example` —— 而它是**被 git 跟踪**的
 * 模板文件，一旦提交就会泄漏。这里用两类检查守住：
 *   1. 不出现常见提供商的密钥特征（Agnes/OpenAI、Google、ModelScope、智谱、私钥）；
 *   2. KEY/SECRET/TOKEN/PASS 类变量的值只能是空或占位符。
 */

const fs = require('fs');
const path = require('path');

const EXAMPLE_PATH = path.resolve(__dirname, '..', '.env.example');
const text = fs.readFileSync(EXAMPLE_PATH, 'utf8');

/** 常见真实密钥的特征（占位符不会命中） */
const SECRET_PATTERNS = [
  [/sk-[A-Za-z0-9_-]{16,}/, 'sk- 开头的 API key（OpenAI / Agnes 等）'],
  [/AIza[0-9A-Za-z_-]{20,}/, 'Google API key'],
  [/\bms-[0-9a-f][0-9a-f-]{20,}/i, 'ModelScope token'],
  [/\b[0-9a-f]{16,}\.[A-Za-z0-9_-]{8,}/i, '智谱 id.secret 形式'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'PEM 私钥']
];

/** 值允许是这些占位形式 */
const PLACEHOLDER_OK = /^(your_.*|xxx+|<[^>]*>|\.\.\.)$/i;

describe('.env.example 不得包含真实凭据', () => {
  test.each(SECRET_PATTERNS)('不应出现 %s', (re) => {
    const m = text.match(re);
    // 只报「匹配到了」，不把匹配到的内容打印出来
    expect(m ? 'FOUND_SECRET' : null).toBeNull();
  });

  /** 收集「变量名含 KEY/SECRET/TOKEN/PASS 且值不是占位符」的行 */
  const collectOffenders = () => {
    const offenders = [];
    text.split(/\r?\n/).forEach((raw, i) => {
      const line = raw.replace(/^\s*#\s*/, '');
      const m = line.match(/^([A-Z0-9_]*(?:KEY|SECRET|TOKEN|PASS)[A-Z0-9_]*)\s*=\s*(.*)$/);
      if (!m) {return;}
      const [, name, value] = m;
      // 端点地址（*_URL）不是凭据
      if (name.includes('URL')) {return;}
      const v = value.trim().replace(/^["']|["']$/g, '');
      if (v && !PLACEHOLDER_OK.test(v)) {
        offenders.push(`第 ${i + 1} 行: ${name}`);
      }
    });
    return offenders;
  };

  test('KEY / SECRET / TOKEN / PASS 变量的值必须为空或占位符（含注释示例）', () => {
    expect(collectOffenders()).toEqual([]);
  });

  test('文件本身存在且非空（防止测试因文件缺失而空跑）', () => {
    expect(text.length).toBeGreaterThan(200);
  });
});
