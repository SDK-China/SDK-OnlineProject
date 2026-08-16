// 路由接口区域 (入厂报备 API)
const express = require('express');
const { Redis } = require('@upstash/redis');
// 集中加载环境变量（绝对路径，见 lib/env.js）
require('../../../lib/env');

const { LOC_CONFIGS } = require('../config/FactoryEntryReport');
const { submitApplication, getAllStatuses, checkSafeToRun, calculatePlan, calculatePendingPlan } = require('../service/FactoryEntryReport');
const { decode, delay, getFormattedDate } = require('../../../lib/utils');

const router = express.Router();

// 实例化 Redis (智能兼容新老名字，再也不会 undefined 啦)
const redis = new Redis({
    url: process.env.NewYzk_KV_REST_API_URL,
    token: process.env.NewYzk_KV_REST_API_TOKEN,
});

/**
 * 统一的数据库上传辅助函数
 * @param {string} actionType - 操作类型 (如 'UI生成', '自动续期', '手动发送')
 * @param {string} location - 厂区代码 (如 'A08', 'Q01')
 * @param {string} summary - 简要说明
 * @param {object} payloadData - 具体的数据包或日志详情 (会自动转成JSON)
 */
const saveLogToRedis = async (actionType, location, summary, payloadData) => {
    try {
        const nowMs = Date.now();
        // 算出北京时间字符串，例如 "2026-05-11_14-30-00"，方便在数据库后台直接肉眼排序
        const timeStr = new Date(nowMs + 28800000).toISOString().replace(/T/, '_').replace(/:/g, '-').replace(/\..+/, '');

        // 构造极度规整的 Key： 类型:厂区:时间_随机数
        // 例如：FactoryLog:UI生成:Q01:2026-05-11_14-30-00_123
        const key = `FactoryLog:${actionType}:${location || 'GLOBAL'}:${timeStr}_${Math.floor(Math.random() * 1000)}`;

        const logRecord = {
            time: timeStr,
            action: actionType,
            location: location,
            summary: summary,
            // 这里保存了真正的发包数据或结果
            data: payloadData
        };

        // 存入数据库。{ ex: 2592000 } 代表数据保留 30 天后自动删除，保持数据库干净
        await redis.set(key, JSON.stringify(logRecord), { ex: 2592000 });
        console.log(`✅ 日志已成功上传至数据库: ${key}`);
    } catch (error) {
        console.error(`❌ 数据库上传失败:`, error.message);
    }
};

// ==========================================
// 路由接口区域
// ==========================================

router.post('/generate-payload', express.json(), (req, res) => {
    // 1. 接收前端传来的范围时间戳 (startTs, endTs)
    const { loc, ids, startTs, endTs } = req.body;
    const locConfig = LOC_CONFIGS[loc];
    if (!locConfig) return res.json({ error: "厂区配置错误" });

    try {
        const normalGroup = [];
        const specialGroupsMap = {};

        ids.forEach(idBase64 => {
            const personInfo = locConfig.personDb[idBase64];
            if (!personInfo) return;

            const nameField = personInfo.find(f => f.label === '姓名');
            const name = nameField && nameField.fieldData ? nameField.fieldData.value : idBase64;

            const customConf = locConfig.customReceptionists && locConfig.customReceptionists[idBase64];
            const trackNormal = !customConf || customConf.keepNormal;
            const trackCustom = !!customConf;

            if (trackNormal) {
                normalGroup.push({ idBase64, name, customConf: null });
            }
            if (trackCustom) {
                const recId = customConf.receptionistId || 'unknown';
                if (!specialGroupsMap[recId]) specialGroupsMap[recId] = [];
                specialGroupsMap[recId].push({ idBase64, name: name + " ⭐", customConf });
            }
        });

        const requests = [];
        let currentTs = parseInt(startTs);
        const targetEnd = parseInt(endTs);

        // 2. 按天数循环生成数据包（如果开始和结束是一天，就只循环一次）
        while (currentTs <= targetEnd) {
            const targetDateStr = getFormattedDate(currentTs);

            const pushReq = (group, isCustom) => {
                if (group.length === 0) return;
                const groupIds = group.map(g => g.idBase64);
                const names = group.map(g => g.name);
                const customConf = isCustom ? group[0].customConf : null;

                const { jsonStr, fullPostBody } = locConfig.buildPayload(groupIds, currentTs, locConfig, customConf);

                let displayPeople = names.join(", ");
                if (isCustom && customConf && customConf.receptionistName) {
                    displayPeople += ` (🚀 独立专单 -> 接待人: ${customConf.receptionistName})`;
                } else {
                    displayPeople += ` (🏢 常规大部队拼车)`;
                }

                requests.push({
                    targetDate: targetDateStr,
                    people: displayPeople,
                    rawJson: jsonStr,
                    encodedBody: fullPostBody
                });
            };

            pushReq(normalGroup, false);
            Object.values(specialGroupsMap).forEach(sg => pushReq(sg, true));

            currentTs += 86400000; // 递增一天
        }

        // [新增] 异步上传生成的包数据到数据库
        if (requests.length > 0) {
            // 我们不 await 它，让它在后台静默上传，不阻塞前端页面响应
            saveLogToRedis('UI生成', loc, `Debug界面生成了 ${requests.length} 个数据包`, requests).catch(e => console.error(e));
        }

        // 纯前后端分离：只返回请求包数据（JSON），前端自行渲染
        res.json({ requests });

    } catch (e) {
        res.json({ error: "生成失败: " + e.message });
    }
});

// --- [新增] 安全手动发送接口 (后端硬核校验密码，前端无法绕过) ---
router.post('/manual-send', express.json(), async (req, res) => {
    const { loc, targetDate, people, encodedBody, pwd } = req.body;

    // 哼！密码写死在后端，就算愚蠢的人类把前端翻个底朝天也拿不到！
    if (pwd !== '123123') {
        return res.json({ success: false, msg: "密码错误！！！" });
    }

    const locConfig = LOC_CONFIGS[loc];
    if (!locConfig) return res.json({ success: false, msg: "厂区配置不存在！" });

    try {
        const reqTask = { targetDate, people, encodedBody };
        const result = await submitApplication(reqTask, locConfig);

        // [新增] 记录手动发送的结果和具体的请求包数据
        saveLogToRedis('手动发送', loc, `发送结果: ${result.success ? '成功' : '失败'}`, {
            requestPayload: reqTask, // 发出去的数据包
            responseResult: result   // 服务器返回的成功/失败信息
        }).catch(e => console.error(e));

        res.json(result);
    } catch (e) {
        res.json({ success: false, msg: "后端执行异常: " + e.message });
    }
});

// ==========================================
// [新增] 异步获取底层数据的专属 API (专供秒开面板调用)
// ==========================================
router.get('/debug-content', async (req, res) => {
    const loc = req.query.loc;
    const locConfig = LOC_CONFIGS[loc];
    if (!locConfig || !locConfig.enabled) return res.json({ error: "未开启的厂区配置" });

    try {
        const { statusMap: realStatusMap, stats } = await getAllStatuses(locConfig.query);
        const safetyCheck = checkSafeToRun(stats);
        const realPlan = calculatePlan(realStatusMap, locConfig);
        const pendingPlan = calculatePendingPlan(realStatusMap, locConfig);
        const simulatedStatusMap = {};
        locConfig.query.visitorIdNos.forEach(idBase64 => {
            simulatedStatusMap[decode(idBase64)] = [];
        });
        const simulatedPlan = calculatePlan(simulatedStatusMap, locConfig);

        // 人员列表（供前端渲染自定义报文生成器的 checkbox）
        const personList = Object.keys(locConfig.personDb).map(base64Id => {
            const info = locConfig.personDb[base64Id];
            const nameField = info.find(f => f.label === '姓名');
            let name = nameField && nameField.fieldData ? nameField.fieldData.value : base64Id;
            const isActive = locConfig.query.visitorIdNos.includes(base64Id);
            const hasCustom = locConfig.customReceptionists && locConfig.customReceptionists[base64Id];
            return { base64Id, name, isActive, hasCustom };
        });

        // 纯前后端分离：返回结构化 JSON，前端自行渲染
        res.json({
            loc,
            title: locConfig.title,
            stats,
            safetyCheck,
            realPlan: { targetDate: realPlan.targetDate, summary: realPlan.summary, requests: realPlan.requests },
            pendingPlan: { totalPendingCount: pendingPlan.totalPendingCount, requests: pendingPlan.requests },
            simulatedPlan: { requests: simulatedPlan.requests },
            personList
        });

    } catch (e) {
        res.json({ error: e.message });
    }
});

// 厂区列表配置（供前端静态页面渲染 tab）
router.get('/config', (req, res) => {
    const locs = Object.keys(LOC_CONFIGS).filter(k => LOC_CONFIGS[k].enabled).map(loc => ({
        loc, title: LOC_CONFIGS[loc].title
    }));
    res.json(locs);
});

// 网页入口：重定向到静态前端页面
router.get('/debug', (req, res) => {
    res.redirect('/FactoryEntry/Report/debug.html');
});

// --- 主逻辑路由 (SSE 流式 + dryRun 干跑，一次遍历所有启用厂区) ---
router.get('/auto-renew', async (req, res) => {
    const dryRun = req.query.dryRun === '1';
    const globalStartTime = Date.now();
    const logs = [];
    const allResults = [];

    // SSE 流式响应头
    res.writeHead(200, {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no'
    });

    // 推送 SSE 事件
    const push = (event, data) => {
        res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };

    const getTs = () => `[${((Date.now() - globalStartTime) / 1000).toFixed(2)}s]`;
    const log = (msg) => {
        const finalMsg = `${getTs()} ${msg}`;
        console.log(finalMsg);
        logs.push(finalMsg);
        push('log', { message: finalMsg });
    };

    try {
        log("=== 🚀 开始自动续期流程 ===");
        if (dryRun) log("⚠️ 【干跑模式】只模拟流程，绝不真实发包！");

        const locFilter = req.query.loc;
        const locsToRun = locFilter ? [locFilter] : Object.keys(LOC_CONFIGS);

        for (const loc of locsToRun) {
            const locConfig = LOC_CONFIGS[loc];
            if (!locConfig || !locConfig.enabled) continue;

            log(`\n====== [${locConfig.title}] 开始执行 ======`);
            log(`🔍 开始查询 [${loc}] 人员历史记录...`);
            const queryStartTime = Date.now();
            const { statusMap, stats } = await getAllStatuses(locConfig.query);
            const queryEndTime = Date.now();
            log(`🏁 查询完毕 [${loc}]，共耗时: ${((queryEndTime - queryStartTime) / 1000).toFixed(2)} 秒`);

            const safetyCheck = checkSafeToRun(stats);
            if (!safetyCheck.safe) {
                log(`⛔ [严重] ${loc} 安全熔断触发，终止该厂区执行！原因: ${safetyCheck.reason}`);
                continue;
            }

            const plan = calculatePlan(statusMap, locConfig);
            if (plan.requests.length === 0) {
                log(`✨ ${loc} 所有人员状态正常(已对齐)，无需续期。`);
                continue;
            }

            log(`📝 ${loc} 计划生成完成: 目标推演至 ${plan.targetDate}, 共 ${plan.requests.length} 个请求包`);

            const submitPromises = [];
            for (const reqTask of plan.requests) {
                log(`🚀 开始发包 [${reqTask.people}] -> 日期: ${reqTask.targetDate}`);
                const reqStartTime = Date.now();

                if (dryRun) {
                    // 干跑：绝不调用 submitApplication，用模拟成功结果代替
                    submitPromises.push((async () => {
                        await delay(200);
                        const r = { success: true, date: reqTask.targetDate, names: reqTask.people, id: '模拟实例(干跑)' };
                        r.loc = loc;
                        r.payload = { rawJson: reqTask.rawJson, encodedBody: reqTask.encodedBody };
                        r.costSeconds = ((Date.now() - reqStartTime) / 1000).toFixed(2);
                        allResults.push(r);
                        push('result', r);
                        log(`✅ 发包成功(模拟) [${loc}] ${reqTask.targetDate} (耗时: ${r.costSeconds}秒)`);
                    })());
                } else {
                    submitPromises.push(submitApplication(reqTask, locConfig).then(r => {
                        const reqEndTime = Date.now();
                        const reqCost = ((reqEndTime - reqStartTime) / 1000).toFixed(2);
                        if (r) {
                            r.loc = loc;
                            r.payload = { rawJson: reqTask.rawJson, encodedBody: reqTask.encodedBody };
                            r.costSeconds = reqCost;
                            allResults.push(r);
                            push('result', r);
                            if (!r.success) log(`❌ 发包失败 [${loc}] ${reqTask.targetDate} (此包耗时: ${reqCost}秒) -> 原因: ${r.msg}`);
                            else log(`✅ 发包成功 [${loc}] ${reqTask.targetDate} (此包耗时: ${reqCost}秒) -> 实例ID: ${r.id}`);
                        }
                    }));
                }
                await delay(5000);
            }
            await Promise.all(submitPromises);
        }

        const globalEndTime = Date.now();
        const costSeconds = ((globalEndTime - globalStartTime) / 1000).toFixed(2);
        log(`\n=== 🏁 流程结束 (总耗时: ${costSeconds} 秒) ===`);

        let report = "📊 自动续期执行报告\n========================\n";
        allResults.forEach((r) => {
            const icon = r.success ? "✅" : "❌";
            report += `${icon} [${r.loc}] 日期: ${r.date}\n`;
            report += `    人员: ${r.names}\n`;
            report += `    结果: ${r.success ? "成功 (" + r.id + ")" : "失败 (" + r.msg + ")"}\n`;
            report += `    耗时: ${r.costSeconds} 秒\n`;
            report += "------------------------\n";
        });
        if (allResults.length === 0) report += "✅ 所有厂区状态均正常，未发生实际提交操作。\n";
        report += `⏱️ 总计用时: ${costSeconds} 秒\n========================\n`;
        report += "\n🔍 系统时间轴日志:\n" + logs.join('\n');

        await saveLogToRedis('自动续期', locFilter || 'ALL', '后台自动巡检与续期完成', {
            textReport: report,
            actionDetails: allResults
        }).catch(e => console.error("Redis上传遭遇拦截:", e));

        push('done', { results: allResults, report });
        res.end();

    } catch (err) {
        console.error(err);
        push('error', { message: err.message });
        res.end();
    }
});

module.exports = router;
