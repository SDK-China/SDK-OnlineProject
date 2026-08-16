// 配置工具业务逻辑（Redis 读写，不碰 req/res）
const { Redis } = require('@upstash/redis');
require('../../../lib/env'); // 集中加载环境变量（绝对路径）

const { redisKey } = require('../config/CrushTool');

const redis = new Redis({
    url: process.env.NewYzk_KV_REST_API_URL,
    token: process.env.NewYzk_KV_REST_API_TOKEN,
});

// 写入：将两个值打包成一个 JSON 对象，存入一个叫 app_config_data 的键中
const saveConfig = async ({ b, tecache }) => {
    await redis.set(redisKey, { b, tecache });
};

// 读取：解包并设置保底默认值（数据库为空或字段不存在时给默认值 1）
const getConfig = async () => {
    let config = await redis.get(redisKey);
    let b = config && config.b !== undefined ? config.b : 1;
    let tecache = config && config.tecache !== undefined ? config.tecache : 1;
    return { b, tecache };
};

module.exports = { saveConfig, getConfig };
