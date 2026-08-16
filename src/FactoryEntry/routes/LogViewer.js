const express = require('express');
const router = express.Router();
const { Redis } = require('@upstash/redis');

// 1. 集中加载环境变量（绝对路径，见 lib/env.js）
require('../../../lib/env');

// 2. 智能读取变量：无论你云端/本地用的是老名字还是新名字，统统兼容！
const dbUrl = process.env.NewYzk_KV_REST_API_URL;
const dbToken =  process.env.NewYzk_KV_REST_API_TOKEN;

// 3. 坚决不用假地址！直接用真家伙连！
const redis = new Redis({
    url: dbUrl,
    token: dbToken,
});

// ==========================================
// 1. 提供后端 API：极限称重，按 10MB 物理红线进行智能打包
// ==========================================
router.get('/api/log-plan', async (req, res) => {
    try {
        if (!dbUrl || !dbToken) return res.json({ success: false, msg: '致命错误: 未能读取到任何环境变量密钥！' });

        const keys = await redis.keys('FactoryLog:*');
        if (keys.length === 0) return res.json({ success: true, chunks: [] });

        // 按时间倒序
        keys.sort((a, b) => {
            const timeA = a.split(':')[3] || '';
            const timeB = b.split(':')[3] || '';
            return timeB.localeCompare(timeA);
        });

        // 探针：获取所有 Key 的字节大小
        const p = redis.pipeline();
        keys.forEach(k => p.strlen(k));
        const sizes = await p.exec(); 

        const chunks = [];
        let currentChunkKeys = [];
        let currentSize = 0;
        
        // 极限阈值：9.8 MB，贴着 Upstash 的 10MB 物理红线拉取
        const MAX_CHUNK_SIZE = 9.8 * 1024 * 1024; 

        for (let i = 0; i < keys.length; i++) {
            const size = sizes[i] || 0;
            if (currentSize + size > MAX_CHUNK_SIZE && currentChunkKeys.length > 0) {
                chunks.push(currentChunkKeys);
                currentChunkKeys = [];
                currentSize = 0;
            }
            currentChunkKeys.push(keys[i]);
            currentSize += size;
        }
        if (currentChunkKeys.length > 0) chunks.push(currentChunkKeys);

        res.json({ success: true, chunks: chunks });
    } catch (error) {
        console.error('获取计划失败:', error);
        res.status(500).json({ success: false, msg: `获取下载计划失败: ${error.message}` });
    }
});

// ==========================================
// 2. 提供后端 API：根据计划里的 Key 清单，执行极限拉取
// ==========================================
router.post('/api/log-batch', express.json(), async (req, res) => {
    try {
        const { keys } = req.body;
        if (!keys || keys.length === 0) return res.json({ success: true, data: [] });

        const rawValues = await redis.mget(...keys);
        
        const logs = keys.map((key, index) => {
            let parsedData = {};
            try {
                parsedData = typeof rawValues[index] === 'string' ? JSON.parse(rawValues[index]) : rawValues[index];
            } catch (e) {
                parsedData = { error: '解析失败', raw: rawValues[index] };
            }
            return { key: key, ...parsedData };
        });

        res.json({ success: true, data: logs });
    } catch (error) {
        console.error('分批拉取失败:', error);
        res.status(500).json({ success: false, msg: `数据极限拉取失败: ${error.message}` });
    }
});

// ==========================================
// 2. 提供后端 API：清空日志
// ==========================================
router.post('/api/clear', express.json(), async (req, res) => {
    const { pwd } = req.body;
    if (pwd !== '123123') return res.json({ success: false, msg: '密码错误，拒绝操作！' });

    try {
        const keys = await redis.keys('FactoryLog:*');
        if (keys.length > 0) {
            await redis.del(...keys);
        }
        res.json({ success: true, msg: `已彻底清空 ${keys.length} 条日志记录。` });
    } catch (error) {
        res.json({ success: false, msg: '清空失败: ' + error.message });
    }
});
// 👇 🌟 [新增部分] 提供后端 API：批量/单个 精准删除指定日志
// ==========================================
router.post('/api/delete', express.json(), async (req, res) => {
    const { pwd, keys } = req.body;
    if (pwd !== '123123') return res.json({ success: false, msg: '密码错误，拒绝操作！' });
    if (!keys || !Array.isArray(keys) || keys.length === 0) return res.json({ success: false, msg: '未提供要删除的记录！' });

    try {
        await redis.del(...keys); // Redis 直接支持传入一整个数组批量删除
        res.json({ success: true, msg: `已成功删除 ${keys.length} 条日志！` });
    } catch (error) {
        res.json({ success: false, msg: '删除失败: ' + error.message });
    }
});


// 日志控制台页面：重定向到静态前端
router.get('/', (req, res) => {
    res.redirect('/FactoryEntry/Log/log.html');
});

module.exports = router;
