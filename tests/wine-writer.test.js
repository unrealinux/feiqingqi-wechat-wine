/**
 * engine/wine-writer.js 测试
 *
 * 守门规则是这套自动写稿的安全网：宁可这篇不出，也不能出「编数据的稿」或
 * 「body 译成身体」的稿。测试全部离线。
 */

const {
  DEFAULT_THEME,
  ALLOWED_CATEGORIES,
  LENGTH,
  todayString,
  materialToText,
  formatMaterials,
  buildSystemPrompt,
  buildUserPrompt,
  extractJson,
  normalizeDigits,
  numbersIn,
  specTexts,
  checkTerms,
  groundTableRows,
  findUngroundedNumbers,
  checkStructure,
  slugify,
  finalizeSpec,
  guardSpec,
} = require('../engine/wine-writer');
const { validateSpec } = require('../engine/article');

/** 造一篇「结构合格」的稿：>=1200 字、3 个 h2 */
function longSpec(overrides = {}) {
  const para = '这是一段用来测试的正文内容，讲清楚这款酒的风格、产区与饮用场景，'.repeat(6);
  const content = [
    { type: 'title', text: '测试标题' },
    { type: 'subtitle', text: '测试副标题' },
    { type: 'lead', text: para },
  ];
  for (let i = 0; i < 4; i++) {
    content.push({ type: 'h2', text: `第 ${i + 1} 节` });
    content.push({ type: 'p', text: para });
    content.push({ type: 'p', text: para });
  }
  content.push({ type: 'end', text: '结束语' });
  return {
    title: '测试标题',
    digest: '测试摘要',
    category: 'wine-knowledge',
    tags: ['测试', '红酒', '品鉴'],
    content,
    ...overrides,
  };
}

describe('日期', () => {
  test('todayString 输出三种格式且一致', () => {
    const t = todayString(new Date(2026, 8, 7));  // 2026-09-07
    expect(t.iso).toBe('2026-09-07');
    expect(t.compact).toBe('20260907');
    expect(t.cn).toBe('2026年09月07日');
  });
});

describe('素材格式', () => {
  test('materialToText 拼接标题/来源/正文块', () => {
    const text = materialToText({
      title: 'T',
      source: 'Decanter',
      digest: 'D',
      content: [{ type: 'p', text: 'A' }, 'B'],
    });
    expect(text).toContain('标题：T');
    expect(text).toContain('来源：Decanter');
    expect(text).toContain('A');
    expect(text).toContain('B');
  });

  test('formatMaterials 带序号、来源与链接', () => {
    const s = formatMaterials([{ title: 'T', source: 'Decanter', link: 'http://x', content: [] }]);
    expect(s).toContain('【素材 1】');
    expect(s).toContain('链接：http://x');
  });

  test('提示词里有分类白名单与字数硬要求', () => {
    const p = buildUserPrompt({ materials: [{ title: 'T', content: [] }], category: 'wine-food' });
    expect(p).toContain('wine-food');
    expect(p).toContain(String(LENGTH.min));
    expect(p).toContain('素材里没有出现的数字');
    expect(buildSystemPrompt()).toContain('body=酒体');
  });

  test('提示词能带上已发标题（避免重复选题）', () => {
    const p = buildUserPrompt({ materials: [], avoidTitles: ['旧标题 A'] });
    expect(p).toContain('已发布过的标题');
    expect(p).toContain('旧标题 A');
  });
});

describe('extractJson', () => {
  test('剥掉 Markdown 围栏', () => {
    expect(extractJson('```json\n{"a":1}\n```')).toEqual({ a: 1 });
  });

  test('忽略 JSON 前后的解释文字', () => {
    expect(extractJson('好的，如下：\n{"a":{"b":2}}\n希望有帮助')).toEqual({ a: { b: 2 } });
  });

  test('没有 JSON 时抛错（fail-closed）', () => {
    expect(() => extractJson('抱歉，我不能')).toThrow(/找不到 JSON/);
  });

  test('JSON 语法错误会抛错，不会被静默吞掉', () => {
    expect(() => extractJson('{bad json}')).toThrow();
  });
});

describe('数字工具', () => {
  test('normalizeDigits 把全角数字转半角', () => {
    expect(normalizeDigits('２０２６年')).toBe('2026年');
  });

  test('numbersIn 去重并识别小数与百分比', () => {
    expect(numbersIn('12.5% 与 12.5% 和 1998')).toEqual(['12.5%', '1998']);
  });

  test('specTexts 收集文本框、清单与表格', () => {
    const texts = specTexts({
      content: [
        { type: 'p', text: 'A' },
        { type: 'tip', text: 'B', heading: 'H' },
        { type: 'list', items: ['C'] },
        { type: 'table', headers: ['N'], rows: [['2019']] },
      ],
    });
    expect(texts).toEqual(['A', 'B', 'H', 'C', '2019', 'N']);
  });
});

describe('译名雷区', () => {
  test('body 误译成「酒的身体」会被抓到', () => {
    expect(checkTerms({ content: [{ type: 'p', text: '这款酒的身体很饱满' }] })[0]).toMatch(/body/);
  });

  test('nose 误译成「用鼻子闻」会被抓到', () => {
    expect(checkTerms({ content: [{ type: 'p', text: '先用鼻子闻一下' }] }).length).toBe(1);
  });

  test('正确用法不误伤', () => {
    const ok = checkTerms({
      content: [
        { type: 'p', text: '酒体饱满，单宁细腻，香气层层展开' },
        { type: 'p', text: '挂杯形成的酒泪沿着杯壁滑落' },
      ],
    });
    expect(ok).toEqual([]);
  });

  test('命中雷区时 guardSpec 直接判为错误（不写文件）', () => {
    const g = guardSpec(longSpec({ content: [{ type: 'p', text: '这款酒的身体很饱满' }] }), { material: '' });
    expect(g.errors.join()).toMatch(/译名错误/);
  });
});

describe('数字溯源', () => {
  test('表格行里的数字在素材中找不到 -> 整行删掉', () => {
    const spec = {
      content: [
        {
          type: 'table',
          headers: ['年份', '评分'],
          rows: [['1998', '95'], ['2019', '93']],
        },
      ],
    };
    const dropped = groundTableRows(spec, '素材只提到 1998 年的 95 分');
    expect(dropped).toHaveLength(1);
    expect(spec.content[0].rows).toEqual([['1998', '95']]);
  });

  test('素材里有的数字不会被删', () => {
    const spec = { content: [{ type: 'table', headers: ['x'], rows: [['2019']] }] };
    expect(groundTableRows(spec, '2019 年的酒')).toEqual([]);
    expect(spec.content[0].rows).toHaveLength(1);
  });

  test('正文里的无出处数字只告警（可能是常识性年份）', () => {
    const found = findUngroundedNumbers({ content: [{ type: 'p', text: '这款 1998 年的酒有 1995 分' }] }, '无关素材');
    expect(found).toEqual(['1998', '1995']);
  });

  test('两位数的数字不告警（避免量词噪音淹没真问题）', () => {
    expect(findUngroundedNumbers({ content: [{ type: 'p', text: '这款 1998 年的酒有 95 分' }] }, '无关素材'))
      .toEqual(['1998']);
  });

  test('一位数/两位数的量词不告警（避免噪音淹没真问题）', () => {
    expect(findUngroundedNumbers({ content: [{ type: 'p', text: '醒 30 分钟，配 2 道菜' }] }, '')).toEqual([]);
  });
});

describe('结构硬门槛', () => {
  test('合格稿没有 error', () => {
    expect(checkStructure(longSpec()).errors).toEqual([]);
  });

  test('正文过短 -> error（这是机器写稿最常见的失败）', () => {
    const short = longSpec({ content: [{ type: 'title', text: 'T' }, { type: 'h2', text: 'A' }, { type: 'p', text: '短' }] });
    const r = checkStructure(short);
    expect(r.errors.join()).toMatch(new RegExp(`>=${LENGTH.min}`));
  });

  test('h2 少于 3 个 -> error', () => {
    const spec = longSpec();
    spec.content = spec.content.filter((b) => b.type !== 'h2').concat([{ type: 'h2', text: '唯一一节' }]);
    expect(checkStructure(spec).errors.join()).toMatch(/>=\d+ 个/);
  });

  test('缺少 title 块 -> error', () => {
    const spec = longSpec();
    spec.content = spec.content.filter((b) => b.type !== 'title');
    expect(checkStructure(spec).errors.join()).toMatch(/缺少 title 块/);
  });

  test('分类不在白名单 -> error，并列出可用值', () => {
    const r = checkStructure(longSpec({ category: 'wine-xxx' }));
    expect(r.errors.join()).toContain(ALLOWED_CATEGORIES[0]);
  });

  test('标题/摘要过长只告警', () => {
    const r = checkStructure(longSpec({ title: '标'.repeat(40), digest: '摘'.repeat(130) }));
    expect(r.errors).toEqual([]);
    expect(r.warnings.join()).toMatch(/标题偏长/);
  });

  test('标题/摘要里的「本文」自称只告警（提示词禁过，但摘要最容易漏）', () => {
    const r = checkStructure(longSpec({ digest: '本文详解这个产区' }));
    expect(r.errors).toEqual([]);
    expect(r.warnings.join()).toMatch(/自称「本文」/);
  });
});

describe('finalizeSpec', () => {
  test('补齐 name/theme/cover/source/publishDate 并裁掉多余标签', () => {
    const out = finalizeSpec(
      { title: 'T', tags: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'], content: [] },
      { name: 'n1', date: '2026-09-07' }
    );
    expect(out.name).toBe('n1');
    expect(out.theme).toEqual({ name: DEFAULT_THEME });
    expect(out.cover).toBeNull();
    expect(out.source).toBe('generate-article');
    expect(out.publishDate).toBe('20260907');
    expect(out.tags).toHaveLength(8);
    expect(out.author).toBe('红酒顾问');
  });
});

describe('slugify', () => {
  test('中文标题回退到 fallback（文件名保持 ASCII）', () => {
    expect(slugify('古酿新生', 'wine')).toBe('wine');
  });

  test('英文/数字转为下划线小写', () => {
    expect(slugify('Wine Food Pairing!')).toBe('wine_food_pairing');
  });
});

describe('guardSpec 端到端', () => {
  test('合格稿：无 error，且 finalize + validateSpec 全通过', () => {
    const material = materialToText({ title: 'T', content: [{ type: 'p', text: '素材文本' }] });
    const g = guardSpec(longSpec(), { material });
    expect(g.errors).toEqual([]);
    const spec = finalizeSpec(g.spec, { name: 'x', date: '2026-09-07' });
    expect(validateSpec(spec)).toEqual([]);
  });

  test('不就地修改传入对象（调用方可能还要用原稿）', () => {
    const input = { content: [{ type: 'table', headers: ['x'], rows: [['9999']] }] };
    guardSpec(input, { material: '' });
    expect(input.content[0].rows).toHaveLength(1);
  });
});
