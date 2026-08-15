// 路由接口区域 (入厂报备 API)
const express = require('express');
const { Redis } = require('@upstash/redis');
// 集中加载环境变量（绝对路径，见 lib/env.js）
require('../../lib/env');

const { LOC_CONFIGS } = require('../config/factory');
const { submitApplication, getAllStatuses, checkSafeToRun, calculatePlan, calculatePendingPlan } = require('../service/factory');
const { decode, delay, getFormattedDate } = require('../../lib/utils');
const { renderDebugPage, renderRequests } = require('../view/factory');

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

        // 3. 构建包含“一键发送”按钮的 UI 头部并渲染
        let finalHtml = '';
        if (requests.length > 0) {
            finalHtml += `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; background: linear-gradient(to right, #eff6ff, #e0e7ff); padding:12px 18px; border-radius:10px; border:1px solid #bfdbfe; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                <div style="color:#1e40af; font-size: 0.95rem;">
                    <strong style="font-size: 1.1rem;">✨ 报文就绪</strong><br>
                    共生成 <b>${requests.length}</b> 个数据包，点击右侧即可自动化批量提交
                </div>
                <button onclick="sendAllBatch(this, '${loc}')" style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; border: none; padding: 10px 20px; border-radius: 8px; font-size: 0.95rem; font-weight: bold; cursor: pointer; box-shadow: 0 4px 6px rgba(37,99,235,0.25); transition: all 0.2s ease;">
                    🚀 一键发送全部
                </button>
            </div>
            `;
        }
        finalHtml += renderRequests(requests, loc);

        // [新增] 异步上传生成的包数据到数据库
        if (requests.length > 0) {
            // 我们不 await 它，让它在后台静默上传，不阻塞前端页面响应
            saveLogToRedis('UI生成', loc, `Debug界面生成了 ${requests.length} 个数据包`, requests).catch(e => console.error(e));
        }

        res.json({ html: finalHtml });

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

        const safetyBadge = safetyCheck.safe
            ? `<span style="background:#ecfdf5; color:#059669; padding:4px 8px; border-radius:4px; border:1px solid #a7f3d0; font-size:0.8rem;">✅ 安全 (Ready)</span>`
            : `<span style="background:#fef2f2; color:#dc2626; padding:4px 8px; border-radius:4px; border:1px solid #fecaca; font-size:0.8rem;">❌ 熔断 (BLOCKED)</span>`;

        let realQueueHTML = '';
        if (safetyCheck.safe) {
            realQueueHTML = `
                <h3 style="font-size:0.9rem; margin-bottom:10px; color:#374151;">🚀 待发送队列 (${realPlan.requests.length})</h3>
                ${renderRequests(realPlan.requests, loc)}
            `;
        } else {
            realQueueHTML = `
                <div class="blocked-overlay">
                    <div style="font-size:1.5rem; margin-bottom:10px;">⛔</div>
                    <div style="font-weight:bold; font-size:1.1rem; margin-bottom:5px;">队列已被安全拦截</div>
                    <div style="font-size:0.85rem; opacity:0.8;">${safetyCheck.reason}<br>本次执行<b>绝对不会</b>发送任何请求。</div>
                </div>
            `;
        }

        // 返回核心的 HTML 碎片给前端
        const html = `
            <h1><span>🔧 [${locConfig.title}] 自动续期调试</span> ${safetyBadge}</h1>

            ${!safetyCheck.safe ? `<div class="error-banner">⛔ 熔断警告: ${safetyCheck.reason}</div>` : ''}

            <div class="card">
                <h2><span>📊 实时状态 (推演至: ${realPlan.targetDate})</span></h2>
                <div class="stat-grid">
                    <div class="stat-item"><div class="stat-val">${stats.total}</div>总查询人数</div>
                    <div class="stat-item"><div class="stat-val" style="color:#059669">${stats.success}</div>接口成功</div>
                    <div class="stat-item"><div class="stat-val" style="color:#dc2626">${stats.error}</div>接口报错</div>
                    <div class="stat-item"><div class="stat-val">${stats.noData}</div>查询无记录</div>
                </div>

                <div class="table-wrapper">
                    <table>
                        <thead>
                            <tr><th>姓名/轨迹</th><th>有效期止</th><th>状态</th></tr>
                        </thead>
                        <tbody>
                            ${realPlan.summary.map(item => `
                            <tr>
                                <td><strong>${item.name}</strong><br><span style="font-size:0.7rem;color:#999">${item.idMask}</span></td>
                                <td>${item.lastDate}</td>
                                <td>
                                    <span class="status-badge ${item.class}">${item.status}</span>
                                    ${item.customHtml ? item.customHtml : ''}
                                </td>
                            </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                ${realQueueHTML}
            </div>

            <div class="card" style="border-top: 4px solid #10b981;">
                <h2>🛠️ 自定义报文生成器</h2>
                <div style="margin-bottom: 10px; font-size: 0.85rem; color: #4b5563;">
                    自由选择人员和日期，生成特定组合的提交报文用于测试或手动发送。
                </div>
                <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:15px;">
                    <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                        <strong>📅 起止日期:</strong> 
                        <input type="date" id="customStartDate-${loc}" style="padding:6px; border-radius:4px; border:1px solid #ccc; flex:1; min-width:120px;">
                        <span style="color:#64748b; font-weight:bold;">至</span>
                        <input type="date" id="customEndDate-${loc}" style="padding:6px; border-radius:4px; border:1px solid #ccc; flex:1; min-width:120px;">
                    </div>
                    <div>
                        <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                            <strong>👥 选择人员:</strong>
                            <button type="button" onclick="selectAllPersons('${loc}')" style="padding:2px 10px; background:#f3f4f6; border:1px solid #d1d5db; border-radius:5px; cursor:pointer; font-size:0.8rem; color:#374151;">全选</button>
                            <button type="button" onclick="invertPersons('${loc}')" style="padding:2px 10px; background:#f3f4f6; border:1px solid #d1d5db; border-radius:5px; cursor:pointer; font-size:0.8rem; color:#374151;">反选</button>
                        </div>
                        <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:8px; background:#f9fafb; padding:10px; border-radius:6px; border:1px solid #e5e7eb;">
                            ${Object.keys(locConfig.personDb).map(base64Id => {
            const info = locConfig.personDb[base64Id];
            const nameField = info.find(f => f.label === '姓名');
            let name = nameField && nameField.fieldData ? nameField.fieldData.value : base64Id;
            const isActive = locConfig.query.visitorIdNos.includes(base64Id);

            const hasCustom = locConfig.customReceptionists && locConfig.customReceptionists[base64Id];
            if (hasCustom) name += " ⭐";

            return `<label style="font-size:0.85rem; display:flex; align-items:center; gap:4px; ${isActive ? '' : 'opacity:0.5;'}"><input type="checkbox" class="person-cb-${loc}" value="${base64Id}" ${isActive ? 'checked' : ''}>${name} ${isActive ? '' : '(停用)'}</label>`;
        }).join('')}
                        </div>
                    </div>
                    <button onclick="generateCustom('${loc}')" style="padding:8px 15px; background:#10b981; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold; align-self:flex-start;">⚡ 立即生成报文</button>
                </div>
                <div id="customResult-${loc}" style="display:none;"></div>
            </div>

            <div class="card" style="border-top: 4px solid #f59e0b; background: linear-gradient(to bottom, #ffffff, #fffbeb); margin-bottom: 20px;">
                <h2>
                    <span>⏳ [智能拼车] 「审核中」单据一键扫描与重推</span>
                    <span style="background:#fef3c7; color:#d97706; padding:2px 8px; border-radius:99px; font-size:0.75rem; border:1px solid #fde047; font-weight:normal;">
                        ⚡ 零耗时 / 内存无损解析
                    </span>
                </h2>
                <div style="margin-bottom: 12px; font-size: 0.85rem; color: #4b5563; line-height: 1.5;">
                    针对部分单据卡在 <code>flowStatus === '1' (审核中)</code> 状态未同步通过的问题，系统已在底层数据拉取时<b>零额外服务器开销</b>地过滤了所有待办人员，并严格按照<b>「到访时间 + 接待人规则」</b>压缩并整合为最少数量的数据包。
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center; background: #fef3c7; padding:12px 16px; border-radius:8px; border:1px solid #fde047; margin-bottom:15px; flex-wrap:wrap; gap:10px;">
                    <div style="color:#92400e; font-size: 0.9rem;">
                        🎯 内存扫描发现 <b>${pendingPlan.totalPendingCount}</b> 人次处于审核中，智能整合为 <b>${pendingPlan.requests.length}</b> 个最优数据包
                    </div>
                    <button onclick="togglePendingBox('${loc}')" id="btn-toggle-pending-${loc}" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 0.85rem; font-weight: bold; cursor: pointer; box-shadow: 0 2px 4px rgba(217,119,6,0.25); transition: all 0.2s;">
                        ⚡ 一键生成并展开整合包 (${pendingPlan.requests.length})
                    </button>
                </div>

                <div id="pending-box-${loc}" style="display: none; animation: fadeIn 0.3s ease;">
                    ${pendingPlan.requests.length > 0 ? `
                        <div style="display:flex; justify-content:flex-end; margin-bottom:10px;">
                            <button onclick="sendAllBatch(this, '${loc}')" class="batch-send-btn-pending" style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 0.85rem; font-weight: bold; cursor: pointer; box-shadow: 0 2px 4px rgba(239,68,68,0.25);">
                                🚀 一键重推全部审核中数据包 (${pendingPlan.requests.length})
                            </button>
                        </div>
                        ${renderRequests(pendingPlan.requests, loc)}
                    ` : `
                        <div style="padding:25px; text-align:center; background:#fff; border:1px dashed #fcd34d; border-radius:8px; color:#b45309; font-size:0.9rem;">
                            🎉 <b>太棒了！</b>当前该厂区所有有效名单中，没有任何滞留在「审核中」状态的单据！
                        </div>
                    `}
                </div>
            </div>

            <div class="card" style="border-top: 4px solid #9333ea;">
                <h2>🔮 全员无记录模拟 (Force Sync)</h2>
                <p style="font-size:0.8rem; color:#666; margin-bottom:10px;">假设数据库清空，系统将从“今天”开始生成完整对齐计划。（此区域仅为逻辑验证，不受熔断影响）</p>
                ${renderRequests(simulatedPlan.requests, loc)}
            </div>
        `;
        res.json({ html });
    } catch (e) {
        res.json({ error: e.message });
    }
});

// --- SPA 极速单页面 Debug 界面 (前端秒开骨架屏版) ---
router.get('/debug', (req, res) => {
    const html = renderDebugPage();
    if (!html) return res.status(404).send("没有开启的厂区配置");
    res.send(html);
});

// --- 主逻辑路由 (一次遍历运行所有启用的厂区) ---
router.get('/auto-renew', async (req, res) => {
    // 👇 🌟 修改1：将全局零点移到最上面，作为赛车秒表的起点
    const globalStartTime = Date.now();

    const logs = [];

    // 👇 🌟 修改2：新增“时间轴助手”，让每句日志前面自动加上 [0.00s] 标记
    const getTs = () => `[${((Date.now() - globalStartTime) / 1000).toFixed(2)}s]`;
    const log = (msg) => {
        const finalMsg = `${getTs()} ${msg}`;
        console.log(finalMsg);
        logs.push(finalMsg);
    };

    const allResults = [];

    try {
        log("=== 🚀 开始自动续期流程 ===");

        const locFilter = req.query.loc;
        const locsToRun = locFilter ? [locFilter] : Object.keys(LOC_CONFIGS);

        for (const loc of locsToRun) {
            const locConfig = LOC_CONFIGS[loc];
            if (!locConfig || !locConfig.enabled) continue;

            log(`\n====== [${locConfig.title}] 开始执行 ======`);

            // 👇 🌟 修改3：精确监控【查询阶段】的耗时
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

                // 👇 🌟 修改4：精确监控【每个单独发包】的耗时
                const reqStartTime = Date.now(); // 记录这一个包的起跑时间

                submitPromises.push(submitApplication(reqTask, locConfig).then(r => {
                    // 记录这一个包的终点时间并计算差值
                    const reqEndTime = Date.now();
                    const reqCost = ((reqEndTime - reqStartTime) / 1000).toFixed(2);

                    if (r) {
                        r.loc = loc;
                        r.payload = {
                            rawJson: reqTask.rawJson,
                            encodedBody: reqTask.encodedBody
                        };

                        // 把这个包的耗时存入结果，这样 Redis 里的 JSON 也能看到耗时
                        r.costSeconds = reqCost;

                        allResults.push(r);

                        if (!r.success) {
                            log(`❌ 发包失败 [${loc}] ${reqTask.targetDate} (此包耗时: ${reqCost}秒) -> 原因: ${r.msg}`);
                        } else {
                            log(`✅ 发包成功 [${loc}] ${reqTask.targetDate} (此包耗时: ${reqCost}秒) -> 实例ID: ${r.id}`);
                        }
                    }
                }));
                await delay(5000);
            }

            await Promise.all(submitPromises);
        }

        const globalEndTime = Date.now();
        const costSeconds = ((globalEndTime - globalStartTime) / 1000).toFixed(2);

        log(`\n=== 🏁 流程结束 (总耗时: ${costSeconds} 秒) ===`);

        let report = "📊 自动续期执行报告\n========================\n";
        allResults.forEach((r, idx) => {
            const icon = r.success ? "✅" : "❌";
            report += `${icon} [${r.loc}] 日期: ${r.date}\n`;
            report += `    人员: ${r.names}\n`;
            report += `    结果: ${r.success ? "成功 (" + r.id + ")" : "失败 (" + r.msg + ")"}\n`;
            // 👇 🌟 修改5：在最终反馈报告中，追加显示每个包的耗时
            report += `    耗时: ${r.costSeconds} 秒\n`;
            report += "------------------------\n";
        });

        if (allResults.length === 0) {
            report += "✅ 所有厂区状态均正常，未发生实际提交操作。\n";
        }

        report += `⏱️ 总计用时: ${costSeconds} 秒\n========================\n`;

        report += "\n🔍 系统时间轴日志:\n" + logs.join('\n');

        await saveLogToRedis('自动续期', locFilter || 'ALL', '后台自动巡检与续期完成', {
            textReport: report,
            actionDetails: allResults
        }).catch(e => console.error("Redis上传遭遇拦截:", e));

        res.type('text/plain').send(report);

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error: " + err.message);
    }
});

module.exports = router;
