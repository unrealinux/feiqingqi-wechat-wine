require('dotenv').config();

/**
 * 活跃主线（engine/ 渲染引擎 + tools/ 工具链）所需的配置。
 *
 * 引擎只读取 `publish.{appId,appSecret,endpoints}`（见 engine/wechat.js）。
 * 第一代流水线的完整配置（采集 / LLM 生成 / 聚合 / Redis / 数据库 / 缓存等）
 * 已随流水线归档到 archive/first-gen/config.js，此处不再包含。
 *
 * 注意：endpoints 的键名必须与 engine/wechat.js 顶部的 API 常量一致，
 * 否则 `{ ...API, ...config.publish.endpoints }` 的覆盖不会生效
 * （旧配置用了 draft/material 等键名，导致 WECHAT_DRAFT_URL 等覆盖长期失效）。
 */
module.exports = {
  publish: {
    appId: process.env.WECHAT_APPID,
    appSecret: process.env.WECHAT_SECRET,
    endpoints: {
      token: process.env.WECHAT_TOKEN_URL || 'https://api.weixin.qq.com/cgi-bin/token',
      addMaterial: 'https://api.weixin.qq.com/cgi-bin/material/add_material',
      uploadImg: process.env.WECHAT_UPLOAD_URL || 'https://api.weixin.qq.com/cgi-bin/media/uploadimg',
      addDraft: process.env.WECHAT_DRAFT_URL || 'https://api.weixin.qq.com/cgi-bin/draft/add',
      updateDraft: process.env.WECHAT_UPDATE_DRAFT_URL || 'https://api.weixin.qq.com/cgi-bin/draft/update',
      getDraftCount: 'https://api.weixin.qq.com/cgi-bin/draft/count',
    },
  },
};
