'use strict';

/**
 * 发布状态表（默认 logs/publish-state.json）
 * ==========================================
 * 「这篇文章是否已经在公众号有过草稿」的唯一真相，用来保证发布链路**幂等**：
 *
 *   tools/publish-pending.js   读它决定哪些文章还要发（定时任务每天跑）
 *   engine/cli.js --publish    发布成功后写它（避免人工发布后又被定时任务重发一遍）
 *
 * 为什么单独抽一个模块：
 *   这个文件的格式此前只在 tools/publish-pending.js 里实现了一次，而引擎侧也需要写
 *   同一个文件 —— 两份实现迟早漂移（字段名、缩进、容错策略）。这里收敛为一份，
 *   两边都从这里引用。
 *
 * 状态条目的形状（按 key = 文章 slug）：
 *   { baseline: true }                        首次运行记为基线，不发草稿
 *   { mediaId, publishedAt }                  已建草稿
 *   { mediaId, publishedAt, updatedAt }       在已有草稿上更新过（--update-draft）
 *
 * 判定规则始终是「key 是否存在」，因此新增字段（updatedAt 等）是向后兼容的增量。
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DEFAULT_STATE_PATH = path.join(ROOT, 'logs', 'publish-state.json');

/** 状态文件路径：允许用 PUBLISH_STATE 覆盖（测试/多环境用），语义与原先保持一致 */
function resolveStatePath(env = process.env) {
  const fromEnv = env && env.PUBLISH_STATE;
  return fromEnv || DEFAULT_STATE_PATH;
}

/** 读取发布状态（损坏/缺失都视为空，绝不让状态文件把发布流程卡死） */
function loadState(statePath = DEFAULT_STATE_PATH) {
  try {
    const parsed = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

/** 写入发布状态（自动建目录） */
function saveState(statePath, state) {
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  fs.writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
  return true;
}

/**
 * 登记「这篇文章已有草稿」。
 *
 * @param {string} statePath 状态文件路径
 * @param {string} name      文章 slug（与文件名同源）
 * @param {object} entry
 * @param {string} [entry.mediaId] 草稿 media_id
 * @param {'published'|'updated'} [entry.status] published=新建草稿；updated=更新已有草稿
 * @param {() => string} [now] 便于测试注入时间
 * @returns {object} 写入的状态条目
 */
function recordPublished(statePath, name, entry = {}, now = () => new Date().toISOString()) {
  if (!name) {throw new Error('记录发布状态需要文章 name');}

  const state = loadState(statePath);
  const prev = (state[name] && typeof state[name] === 'object') ? state[name] : null;
  const at = now();

  if (entry.status === 'updated') {
    // 更新已有草稿：保留首次发布时间（它是审计信息），另外记一笔更新时间
    state[name] = {
      ...(prev || {}),
      mediaId: entry.mediaId || (prev && prev.mediaId) || null,
      publishedAt: (prev && prev.publishedAt) || at,
      updatedAt: at
    };
  } else {
    state[name] = { mediaId: entry.mediaId || null, publishedAt: at };
  }

  saveState(statePath, state);
  return state[name];
}

module.exports = {
  DEFAULT_STATE_PATH,
  resolveStatePath,
  loadState,
  saveState,
  recordPublished
};
