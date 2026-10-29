// 「人员配置生成器」路由：上传证件 / 生成 PERSON_DB 代码
// 🔒 本路由不包含任何「提交申请」入口
const express = require('express');
const router = express.Router();
const svc = require('../service/PersonConfigBuilder');
const CFG = require('../config/PersonConfigBuilder');

// 上传一个附件（原始二进制，文件名/类型走 query，避免为多传一个文件引入 multer 依赖）
router.post('/attach', express.raw({ type: () => true, limit: '25mb' }), async (req, res) => {
    try {
        const fileName = String(req.query.name || "").trim();
        const contentType = String(req.query.type || "application/octet-stream");

        if (!fileName) return res.status(400).json({ ok: false, msg: "缺少文件名" });
        if (!req.body || !req.body.length) return res.status(400).json({ ok: false, msg: "没有收到文件内容" });

        const item = await svc.uploadAttachment(fileName, req.body, contentType);
        res.json({ ok: true, item: item });
    } catch (e) {
        console.error("   [附件上传] 失败：" + e.message);
        res.status(500).json({ ok: false, msg: e.message });
    }
});

// 页面初始化所需的选项与上限
router.get('/config', (req, res) => {
    res.json({
        ok: true,
        idTypes: Object.keys(CFG.idTypes),
        areaCode: CFG.areaCode,
        limits: CFG.limits,
        imageServiceUrl: CFG.imageServiceUrl,
        fields: CFG.fields
    });
});

// 接待人工号 → 姓名 / 部门 / 手机号（选填项，页面上边填边查）
// 先查公司服务器（员工信息表，和访客表单同一个接口），失败再退回本地配置
router.get('/receptionist', async (req, res) => {
    try {
        const r = await svc.lookupReceptionist(req.query.id);
        res.json(Object.assign({ ok: true }, r));
    } catch (e) {
        res.status(500).json({ ok: false, msg: e.message });
    }
});

// 把录入的信息 + 已上传的文件，组装成 PERSON_DB 配置代码
router.post('/build', async (req, res) => {
    try {
        const result = await svc.buildEntry(req.body || {});
        res.json(Object.assign({ ok: true }, result));
    } catch (e) {
        res.status(400).json({ ok: false, msg: e.message });
    }
});

module.exports = router;
