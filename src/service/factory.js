// 后端业务逻辑 (状态查询 / 熔断 / 计划计算 / 发包)
const axios = require('axios');
const { decode, delay, getBeijingDayId, getFormattedDate } = require('../../lib/utils');

// --- 基础请求头 (移除了强绑定的 Cookie，改为动态传入) ---
const GLOBAL_HEADERS = {
    "Host": "iw68lh.aliwork.com",
    "content-type": "application/x-www-form-urlencoded",
    "sec-ch-ua-platform": "\"Android\"",
    "sec-ch-ua": "\"Chromium\";v=\"142\", \"Android WebView\";v=\"142\", \"Not_A Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?1",
    "x-requested-with": "XMLHttpRequest",
    "user-agent": "Mozilla/5.0 (Linux; Android 16; PJZ110 Build/BP2A.250605.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.7444.102 Mobile Safari/537.36",
    "accept": "application/json, text/json",
    "bx-v": "2.5.11",
    "origin": "https://iw68lh.aliwork.com",
    "sec-fetch-site": "same-origin",
    "sec-fetch-mode": "cors",
    "sec-fetch-dest": "empty",
    "referer": "https://iw68lh.aliwork.com/o/fk_ybfk?account=17614625112&company=%E5%AE%8F%E5%90%AF%E8%83%9C%E7%B2%BE%E5%AF%86%E7%94%B5%E5%AD%90(%E7%A7%A6%E7%9A%87%E5%B2%9B)%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8&part=%E7%A7%A6%E7%9A%87%E5%B2%9B%E5%9B%AD%E5%8C%BA&applyType=%E4%B8%80%E8%88%AC%E8%AE%BF%E5%AE%A2",
    "accept-encoding": "gzip, deflate, br, zstd",
    "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7"
};

// --- 后端 API 逻辑 ---

const checkSingleStatus = async (id, queryConfig) => {
    const idMask = id.substring(0, 4) + "****" + id.substring(id.length - 4);
    let result = { id, success: false, hasData: false, records: [] };

    try {
        const res = await axios.post(queryConfig.queryUrl, {
            visitorIdNo: id,
            regPerson: queryConfig.regPerson,
            acToken: queryConfig.acToken
        });

        if (res.data && res.data.code === 200) {
            result.success = true;
            if (res.data.data && Array.isArray(res.data.data)) {
                result.records = res.data.data;
                if (result.records.length > 0) result.hasData = true;
            }
        } else {
            const errCode = res.data ? res.data.code : 'UNKNOWN';
            console.error(`   [${idMask}] API错误: Code ${errCode}`);
        }
    } catch (e) {
        console.error(`   [${idMask}] 网络/请求出错: ${e.message}`);
    }
    return result;
};

const getAllStatuses = async (queryConfig) => {
    const statusMap = {};
    const decodedIds = queryConfig.visitorIdNos.map(id => decode(id));

    const promises = [];
    for (const id of decodedIds) {
        promises.push(checkSingleStatus(id, queryConfig));
        await delay(80);
    }

    const results = await Promise.all(promises);
    const stats = { total: decodedIds.length, success: 0, error: 0, hasData: 0, noData: 0 };

    results.forEach(r => {
        statusMap[r.id] = r.records || [];
        if (r.success) {
            stats.success++;
            if (r.hasData) stats.hasData++;
            else stats.noData++;
        } else {
            stats.error++;
        }
    });
    return { statusMap, stats };
};

// 🌟 严谨铁壁熔断机制
// 🌟 魔鬼级“一触即死”铁壁熔断机制 (宁可错杀，绝不放过)
const checkSafeToRun = (stats) => {
    // 1. 只要有 1 个人查询失败（网络崩溃、Token失效等），全员连坐锁死！(原有机制保留)
    if (stats.error > 0) {
        return { safe: false, reason: `【连坐熔断】请求报错或Cookie失效 (共失败 ${stats.error} 人)` };
    }

    // 2. 无配置人员，直接跳过
    if (stats.total === 0) {
        return { safe: false, reason: "配置名单为空，无需运行" };
    }

    // 3. 🔪 新增的魔鬼限制：只要有 1 个人查不到记录（没有时间），立刻全部锁死！
    if (stats.noData > 0) {
        return { safe: false, reason: `【连坐熔断】发现 ${stats.noData} 人没有任何历史入厂记录/时间！已触发一票否决，全厂区停止自动续期！` };
    }

    // 如果能活到这里，说明所有人既没有报错，又都有历史记录，安全放行！
    return { safe: true, reason: "状态完美正常" };
};

// 👇 传入了 locConfig 以提取它对应的专属 Cookie
const submitApplication = async (reqTask, locConfig) => {
    const { targetDate, people, encodedBody } = reqTask;

    // 👇 组装带有该厂区专属身份校验的请求头
    const reqHeaders = { ...GLOBAL_HEADERS };
    if (locConfig.cookie) {
        reqHeaders.cookie = locConfig.cookie;
    }

    try {
        const url = "https://iw68lh.aliwork.com/o/HW9663A19D6M1QDL6D7GNAO1L2ZC2NBXQHOXL3?_api=nattyFetch&_mock=false&_stamp=" + Date.now();
        const res = await axios.post(url, encodedBody, { headers: reqHeaders });

        if (res.data && res.data.success === true) {
            const formInstId = res.data.content ? res.data.content.formInstId : "未知ID";
            return { success: true, date: targetDate, names: people, id: formInstId };
        } else {
            // 👇 BUG终结者：极度详细的错误日志
            const errorMsg = JSON.stringify(res.data);
            return { success: false, date: targetDate, names: people, msg: `API拒绝请求: ${errorMsg}` };
        }
    } catch (e) {
        return { success: false, date: targetDate, names: people, msg: `网络或代码崩溃: ${e.message}` };
    }
};

const calculatePlan = (idStatusMap, locConfig) => {
    const nowMs = Date.now();
    const todayObj = new Date(nowMs + 28800000);
    todayObj.setUTCHours(0, 0, 0, 0);
    const todayStartTs = todayObj.getTime() - 28800000;
    const todayId = getBeijingDayId(nowMs);

    const virtualUsers = [];
    let globalMaxEndTs = 0;
    let minEndTs = Infinity;
    const summary = [];

    // 1. 第一遍循环：解析所有人的历史记录，填充 virtualUsers (这里就是之前被不小心删掉的部分)
    for (const [id, records] of Object.entries(idStatusMap)) {
        const idBase64 = Buffer.from(id).toString('base64');
        const personInfo = locConfig.personDb[idBase64];

        if (!personInfo) {
            console.warn(`[Warn] 找不到人员详细数据 (ID Base64: ${idBase64})，跳过。`);
            continue;
        }

        const nameField = personInfo.find(f => f.label === '姓名');
        const name = nameField && nameField.fieldData ? nameField.fieldData.value : "未知";

        const customConf = locConfig.customReceptionists && locConfig.customReceptionists[idBase64];
        const trackNormal = !customConf || customConf.keepNormal; // 是否需要发普通单
        const trackCustom = !!customConf;                         // 是否需要发专属单

        const getMaxEnd = (filterFn) => {
            let max = 0;
            records.forEach(r => {
                // 🌟 新增判断：如果 flowStatus 是 '3' (代表已拒绝)，则直接跳过，绝对不纳入有效时间计算！
                if (String(r.flowStatus) !== '3' && filterFn(r)) {
                    const end = parseInt(r.dateEnd || r.rangeEnd);
                    if (end > max) max = end;
                }
            });
            return max;
        };

        // 处理普通轨迹：严格只认大部队统帅的记录！
        if (trackNormal) {
            const maxEndTs = getMaxEnd(r => {
                if (locConfig.normalReceptionistId) {
                    return r.rPerson === locConfig.normalReceptionistId;
                }
                return !customConf || r.rPerson !== customConf.receptionistId;
            });
            virtualUsers.push({ idBase64, type: 'normal', maxEndTs, customConf: null, name });
        }

        // 处理专属轨迹 (只查挂在专属工号下的记录)
        if (trackCustom) {
            const maxEndTs = getMaxEnd(r => r.rPerson === customConf.receptionistId);
            virtualUsers.push({ idBase64, type: 'custom', maxEndTs, customConf, name: name + " ⭐" });
        }
    }

    // 👇 【大部队追赶机制核心算法】 👇
    const normalUsers = virtualUsers.filter(vu => vu.type === 'normal');
    let normalMaxCurrent = Math.max(...normalUsers.map(vu => vu.maxEndTs));
    if (!isFinite(normalMaxCurrent) || normalMaxCurrent < todayStartTs - 86400000) {
        normalMaxCurrent = todayStartTs - 86400000;
    }

    const normalThreshold = locConfig.renewThreshold !== undefined ? locConfig.renewThreshold : 2;
    const normalAddDays = locConfig.renewDays !== undefined ? locConfig.renewDays : 7;
    const normalLeaderDiff = getBeijingDayId(normalMaxCurrent) - todayId;

    let normalGroupTarget = normalMaxCurrent;
    if (normalMaxCurrent === 0 || normalLeaderDiff < 0 || normalLeaderDiff <= normalThreshold) {
        normalGroupTarget = Math.max(normalMaxCurrent, todayStartTs) + (normalAddDays * 86400000);
    }
    // 👆 新增结束 👆

    // 2. 第二遍循环：构建界面信息，并确定每个人的个人目标边界 targetEndTs
    virtualUsers.forEach(vu => {
        let currentEndTs = vu.maxEndTs;
        if (currentEndTs < todayStartTs) currentEndTs = todayStartTs - 86400000;

        if (currentEndTs > globalMaxEndTs) globalMaxEndTs = currentEndTs;
        if (currentEndTs < minEndTs) minEndTs = currentEndTs;

        const lastDayId = getBeijingDayId(currentEndTs);
        const diff = lastDayId - todayId;

        const threshold = vu.customConf && vu.customConf.renewThreshold !== undefined ? vu.customConf.renewThreshold : (locConfig.renewThreshold !== undefined ? locConfig.renewThreshold : 2);
        const addDays = vu.customConf && vu.customConf.renewDays !== undefined ? vu.customConf.renewDays : (locConfig.renewDays !== undefined ? locConfig.renewDays : 7);

        let statusText = `正常 (剩 ${diff} 天)`;
        let statusClass = "success";
        let needRenew = false;

        if (vu.maxEndTs === 0) {
            statusText = "无记录 (需补齐)";
            statusClass = "expired";
            needRenew = true;
        }
        else if (diff < 0) {
            statusText = `已过期 ${Math.abs(diff)} 天`;
            statusClass = "expired";
            needRenew = true;
        }
        else if (diff <= threshold) {
            statusText = `即将过期 (剩 ${diff} 天)`;
            statusClass = "warning";
            needRenew = true;
        }

        // 👇 新增：将冗长的文字剥离，改为精美的 HTML 独立徽章标签
        let customHtml = '';
        if (vu.type === 'custom') {
            customHtml = `<div style="margin-top: 6px; font-size: 0.75rem; line-height: 1.4;">
                <span style="background: #f3e8ff; color: #6b21a8; padding: 2px 6px; border-radius: 4px; border: 1px solid #e9d5ff; display: inline-block;">
                    🎯 专属接待: <b>${vu.customConf.receptionistName}</b>
                </span><br>
                <span style="color: #64748b; margin-top:2px; display:inline-block;">
                    ⚙️ 规则: ≤${threshold}天续${addDays}天 ${vu.customConf.keepNormal ? '<span style="color:#059669; font-weight:bold;">[➕双开原始包]</span>' : ''}
                </span>
            </div>`;
        }

        const rawId = decode(vu.idBase64);
        const idMask = rawId.substring(0, 4) + "****" + rawId.substring(rawId.length - 4);

        summary.push({
            name: vu.name,
            idMask: idMask,
            lastDate: vu.maxEndTs === 0 ? "无记录" : getFormattedDate(vu.maxEndTs),
            status: statusText,
            class: statusClass,
            customHtml: customHtml // 👈 绑定我们新写的精美标签
        });

        vu.currentEndTs = currentEndTs;
        const baseLineTs = Math.max(currentEndTs, todayStartTs);

        // 🎯 【强制追赶对齐机制】
        if (vu.type === 'normal') {
            vu.targetEndTs = Math.max(currentEndTs, normalGroupTarget);
        } else {
            vu.targetEndTs = needRenew ? baseLineTs + (addDays * 86400000) : currentEndTs;
        }
    });

    let globalTargetTs = Math.max(...virtualUsers.map(vu => vu.targetEndTs));
    if (globalTargetTs < todayStartTs || !isFinite(globalTargetTs)) globalTargetTs = todayStartTs;

    const requests = [];
    let cursorTs = Math.max(minEndTs + 86400000, todayStartTs);
    if (!isFinite(cursorTs)) cursorTs = todayStartTs;
    let dayCount = 1;

    // 3. 核心拆包：把当天需要续期的人，按指定的接待人进行全自动拼车合并
    while (cursorTs <= globalTargetTs) {
        const todaysVirtuals = virtualUsers.filter(vu => vu.currentEndTs < cursorTs && cursorTs <= vu.targetEndTs);

        if (todaysVirtuals.length > 0) {
            const normalGroup = [];
            const specialGroupsMap = {};

            todaysVirtuals.forEach(vu => {
                if (vu.type === 'normal') {
                    normalGroup.push(vu);
                } else {
                    const recId = vu.customConf.receptionistId || 'unknown';
                    if (!specialGroupsMap[recId]) specialGroupsMap[recId] = [];
                    specialGroupsMap[recId].push(vu);
                }
            });

            const pushRequest = (vuGroup, isCustom) => {
                if (vuGroup.length === 0) return;

                const idsBase64 = vuGroup.map(v => v.idBase64);
                const names = vuGroup.map(v => v.name);
                const customConf = isCustom ? vuGroup[0].customConf : null;

                const { jsonStr, fullPostBody } = locConfig.buildPayload(idsBase64, cursorTs, locConfig, customConf);

                let displayPeople = names.join(", ");
                if (isCustom && customConf && customConf.receptionistName) {
                    displayPeople += ` (🚀 独立专单 -> 接待人: ${customConf.receptionistName})`;
                }

                requests.push({
                    ts: cursorTs,
                    dayIndex: dayCount++,
                    targetDate: getFormattedDate(cursorTs),
                    people: displayPeople,
                    rawJson: jsonStr,
                    encodedBody: fullPostBody
                });
            };

            pushRequest(normalGroup, false);

            Object.values(specialGroupsMap).forEach(sgGroup => {
                pushRequest(sgGroup, true);
            });
        }
        cursorTs += 86400000;
    }


    return { summary, requests, targetDate: getFormattedDate(globalTargetTs) };
};
// ==========================================
// 🌟 [新增] 「审核中」单据零消耗提速与最少包智能整合算法
// ==========================================
const calculatePendingPlan = (idStatusMap, locConfig) => {
    const pendingItems = [];

    // 计算今天的零点时间戳 (北京时间)
    const nowMs = Date.now();
    const todayObj = new Date(nowMs + 28800000);
    todayObj.setUTCHours(0, 0, 0, 0);
    const todayStartTs = todayObj.getTime() - 28800000;

    // 1. 内存极速遍历：提取所有处于审核中 (flowStatus === '1') 的有效单据
    for (const [id, records] of Object.entries(idStatusMap)) {
        const idBase64 = Buffer.from(id).toString('base64');
        const personInfo = locConfig.personDb[idBase64];
        if (!personInfo) continue;

        const nameField = personInfo.find(f => f.label === '姓名');
        const name = nameField && nameField.fieldData ? nameField.fieldData.value : "未知";
        const customConf = locConfig.customReceptionists && locConfig.customReceptionists[idBase64];

        // 👇 🌟 屏障逻辑第一步：提前收集该人员所有“已通过”的单据
        const passedSet = new Set();
        records.forEach(r => {
            // 只要不是 1(审核中) 也不是 3(已拒绝)，我们就认为他在这天已经拥有入厂权限了
            if (String(r.flowStatus) !== '1' && String(r.flowStatus) !== '3') {
                const tTs = parseInt(r.dateEnd || r.rangeEnd || r.dateStart || r.rangeStart || 0);
                // 把“时间戳_接待人工号”作为指纹存入集合
                if (tTs) passedSet.add(`${tTs}_${r.rPerson}`);
            }
        });

        // 👇 🌟 屏障逻辑第二步：扫描审核中数据时进行指纹比对
        records.forEach(r => {
            if (String(r.flowStatus) === '1') {
                const targetTs = parseInt(r.dateEnd || r.rangeEnd || r.dateStart || r.rangeStart || 0);
                
                // 剔除无效时间，以及早于今天的历史废单
                if (!targetTs || targetTs < todayStartTs) return;

                // 🛡️ 核心防呆判断：如果同一天、同一接待人下，他已经有了通过的单据，直接当做废包无视！
                if (passedSet.has(`${targetTs}_${r.rPerson}`)) return;

                const targetDateStr = getFormattedDate(targetTs);
                const isCustom = customConf && (r.rPerson === customConf.receptionistId || !customConf.keepNormal);
                const recId = isCustom ? customConf.receptionistId : (locConfig.normalReceptionistId || 'NORMAL');

                pendingItems.push({
                    idBase64,
                    name: isCustom ? `${name} ⭐` : name,
                    targetTs,
                    targetDateStr,
                    isCustom: !!isCustom,
                    customConf: isCustom ? customConf : null,
                    recId,
                    recName: isCustom ? customConf.receptionistName : "常规大部队"
                });
            }
        });
    }

    // 2. 最少包哈希合并：按 [目标日期 + 接待人] 严格聚合
    const groupsMap = {};
    pendingItems.forEach(item => {
        const groupKey = `${item.targetDateStr}___${item.recId}`;
        if (!groupsMap[groupKey]) {
            groupsMap[groupKey] = {
                targetDate: item.targetDateStr,
                targetTs: item.targetTs,
                isCustom: item.isCustom,
                customConf: item.customConf,
                recName: item.recName,
                people: []
            };
        }
        if (!groupsMap[groupKey].people.some(p => p.idBase64 === item.idBase64)) {
            groupsMap[groupKey].people.push({ idBase64: item.idBase64, name: item.name });
        }
    });

    // 3. 构建终极精简数据包
    const requests = [];
    let dayIndex = 1;
    const sortedKeys = Object.keys(groupsMap).sort((a, b) => groupsMap[a].targetTs - groupsMap[b].targetTs);

    sortedKeys.forEach(key => {
        const group = groupsMap[key];
        if (group.people.length === 0) return;

        const idsBase64 = group.people.map(p => p.idBase64);
        const names = group.people.map(p => p.name);
        const { jsonStr, fullPostBody } = locConfig.buildPayload(idsBase64, group.targetTs, locConfig, group.customConf);

        let displayPeople = names.join(", ");
        if (group.isCustom && group.customConf && group.customConf.receptionistName) {
            displayPeople += ` (🚀 审核中专单 -> 接待人: ${group.customConf.receptionistName})`;
        } else {
            displayPeople += ` (🏢 审核中大部队拼车)`;
        }

        requests.push({
            ts: group.targetTs,
            dayIndex: dayIndex++,
            targetDate: group.targetDate,
            people: displayPeople,
            rawJson: jsonStr,
            encodedBody: fullPostBody
        });
    });

    return { totalPendingCount: pendingItems.length, requests };
};

module.exports = { GLOBAL_HEADERS, checkSingleStatus, getAllStatuses, checkSafeToRun, submitApplication, calculatePlan, calculatePendingPlan };
