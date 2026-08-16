// 访客通：路由接口
const express = require('express');
const CONFIGS = require('../config/VisitorApprovalQuery');
const { getBeijingDayId, getBeijingTimeStr, getFormattedDate, getHeaders, fetchPersonData } = require('../service/VisitorApprovalQuery');
const { generateCardHtml, renderVisitorStatusPage } = require('../view/VisitorApprovalQuery');

const router = express.Router();

// --- 5. 路由接口 ---

// 卡片数据 API
router.get('/visitor-card-data', async (req, res) => {
    try {
        const encodedId = req.query.id;
        const loc = req.query.loc || 'A08';
        const config = CONFIGS[loc] || CONFIGS['A08'];

        if (!encodedId) return res.json({ html: '', hasActive: false });
        const id = Buffer.from(encodedId, 'base64').toString('utf-8');
        const headers = getHeaders();
        const todayDayId = getBeijingDayId(new Date().getTime());
        const person = await fetchPersonData(id, headers, todayDayId, config.regPerson, config.acToken);
        const html = generateCardHtml(person);
        res.json({
            html,
            hasActive: person.globalStatus.hasActive,
            hasPending: person.globalStatus.hasPending,
            hasFuture: person.globalStatus.hasFuture,
            success: person.success // 👈 新增：把成功与否的标记传给前端
        });
    } catch (e) {
        // 👈 新增：哪怕代码崩溃了，也要告诉前端 success 是 false
        res.json({ html: '<div class="app-card error">数据获取异常</div>', hasActive: false, success: false }); 
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

// 网页主入口 (SPA 丝滑切换改版)
router.get('/visitor-status', (req, res) => {
    res.send(renderVisitorStatusPage());
});

module.exports = router;
