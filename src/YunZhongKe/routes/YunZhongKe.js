// 云中客转链路由：只做「接请求 → 调 service → 返回」
const express = require('express');
const router = express.Router();
const { convertLink } = require('../service/YunZhongKe');

router.post('/', async (req, res) => {
    // 接口入参保持完全不变，不影响前端
    const { temp_url, apitoken } = req.body;

    if (!temp_url || !apitoken) {
        return res.status(400).json({ message: 'temp_url and apitoken are required' });
    }

    const result = await convertLink({ temp_url, apitoken });
    if (result.success) {
        res.json({ tk_short_url: result.tk_short_url });
    } else if (result.details !== undefined) {
        res.status(500).json({ message: result.message, details: result.details });
    } else {
        res.status(500).json({ message: result.message });
    }
});

module.exports = router;
