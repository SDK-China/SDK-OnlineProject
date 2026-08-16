// 访客通：路由接口（纯前后端分离：后端只出 JSON，前端自行渲染）
const express = require('express');
const CONFIGS = require('../config/VisitorApprovalQuery');
const { getBeijingDayId, getBeijingTimeStr, getFormattedDate, getHeaders, fetchPersonData } = require('../service/VisitorApprovalQuery');

const router = express.Router();

// 厂区配置接口：供前端静态页面获取 A08/Q01 的 title + 人员列表
router.get('/visitor-config', (req, res) => {
    const configs = {
        'A08': { title: CONFIGS['A08'].title, ids: CONFIGS['A08'].visitorIdNos },
        'Q01': { title: CONFIGS['Q01'].title, ids: CONFIGS['Q01'].visitorIdNos }
    };
    res.json(configs);
});

// 卡片数据 API：返回纯 JSON（人员完整数据），前端自行拼卡片 HTML
router.get('/visitor-card-data', async (req, res) => {
    try {
        const encodedId = req.query.id;
        const loc = req.query.loc || 'A08';
        const config = CONFIGS[loc] || CONFIGS['A08'];

        if (!encodedId) return res.json({ success: false, person: null });
        const id = Buffer.from(encodedId, 'base64').toString('utf-8');
        const headers = getHeaders();
        const todayDayId = getBeijingDayId(new Date().getTime());
        const person = await fetchPersonData(id, headers, todayDayId, config.regPerson, config.acToken);
        res.json({ success: person.success, person });
    } catch (e) {
        res.json({ success: false, person: null, error: e.message });
    }
});

// 微信文本版接口 (向下兼容)
router.get('/visitor-status-Wechat', async (req, res) => {
    const loc = req.query.loc || 'A08';
    const config = CONFIGS[loc] || CONFIGS['A08'];
    const headers = getHeaders();
    const todayDayId = getBeijingDayId(new Date().getTime());
    let outputLines = [`[${loc}] 🕒 ${getBeijingTimeStr()}`];

    try {
        const decodedIds = config.visitorIdNos.map(encoded => Buffer.from(encoded, 'base64').toString('utf-8'));
        const promises = decodedIds.map(id => fetchPersonData(id, headers, todayDayId, config.regPerson, config.acToken));
        const results = await Promise.all(promises);

        results.sort((a, b) => (b.globalStatus.hasActive ? 1 : 0) - (a.globalStatus.hasActive ? 1 : 0));

        results.forEach(p => {
            if (!p.success) { outputLines.push(`\n❌ ${p.idTail} 失败`); return; }
            if (p.approverGroups.length === 0) outputLines.push(`\n👤 ${p.name}\n⚪ 无记录`);
            else {
                outputLines.push(`\n👤 ${p.name}`);
                p.approverGroups.forEach(g => {
                    if (g.priorityList.length > 0) {
                        g.priorityList.forEach(i => {
                            let icon = '🔵';
                            if (i._type === 'PENDING') icon = '🟡';
                            else if (i._type === 'ACTIVE') icon = '🟢';
                            else if (i._type === 'REJECTED') icon = '🔴';
                            outputLines.push(`${icon} [${g.approver}] ${getFormattedDate(i._displayStart)}-${getFormattedDate(i._displayEnd)}`);
                        });
                    }
                });
            }
        });
        res.header('Content-Type', 'text/plain; charset=utf-8');
        res.send(outputLines.join('\n'));
    } catch (e) { res.status(500).send('Error'); }
});

// 网页入口：重定向到静态前端页面
router.get('/visitor-status', (req, res) => {
    res.redirect('/FactoryEntry/Query/visitor.html');
});

module.exports = router;
