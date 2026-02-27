"use strict";
const axios = require('axios');

const originsCache = new Map();

async function shouldCrawl(targetUrl) {
  try {
    const parsed = new URL(targetUrl);
    const origin = parsed.origin;
    let info = originsCache.get(origin);
    if (!info) {
      const robotsUrl = origin.endsWith('/') ? origin + 'robots.txt' : origin + '/robots.txt';
      const resp = await axios.get(robotsUrl, { timeout: 5000 });
      info = parseRobots((resp.data || '').toString());
      originsCache.set(origin, info);
    }
    const path = parsed.pathname || '/';
    const blocked = info.disallows.some(p => path.startsWith(p));
    return !blocked;
  } catch (e) {
    // 出错默认允许 crawling
    return true;
  }
}

function parseRobots(text) {
  const lines = text.split(/\r?\n/);
  let currentAgent = false;
  const disallows = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (line.toLowerCase().startsWith('user-agent')) {
      currentAgent = line.includes('*');
      continue;
    }
    if (currentAgent && line.toLowerCase().startsWith('disallow')) {
      const val = line.split(':')[1]?.trim();
      if (val) disallows.push(val);
    }
  }
  return { disallows };
}

module.exports = { shouldCrawl };
