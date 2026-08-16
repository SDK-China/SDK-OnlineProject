// 配置工具路由：只做「接请求 → 调 service → 返回」
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { saveConfig, getConfig } = require('../service/CrushTool');
const { fixedKey } = require('../config/CrushTool');

router.use(bodyParser.json());

// 🚀 处理 POST 请求：合并存储为一条键值对
router.post('/', async (req, res) => {
    const { newB, newTecache, token } = req.body;

    // 前端传参格式不变
    if (newB !== undefined && newTecache !== undefined && token) {
        try {
            await saveConfig({ b: newB, tecache: newTecache });
            res.json({ message: 'b and tecache values have been updated successfully in Redis.' });
        } catch (error) {
            console.error('Redis 写入失败:', error);
            res.status(500).json({ message: 'Failed to save data to Redis.' });
        }
    } else {
        res.status(400).json({ message: 'Both newB, newTecache and token are required in the request body.' });
    }
});

// 🚀 处理 GET 请求：读取一条键值并解包，返回原格式
router.get('/', async (req, res) => {
    const token = req.query.token;
    if (!token) {
        return res.status(400).json({ message: 'Token is required in the query string.' });
    }

    try {
        const { b, tecache } = await getConfig();
        res.json({ b, tecache, k: fixedKey });
    } catch (error) {
        console.error('Redis 读取失败:', error);
        res.json({ b: 1, tecache: 1, k: fixedKey });
    }
});

module.exports = router;
