// 访客通：业务逻辑 (数据获取 + 工具函数)
const axios = require('axios');

// --- 2. 工具函数 ---
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const getBeijingDayId = (ts) => Math.floor((parseInt(ts) + 28800000) / 86400000);
const getNowTs = () => new Date().getTime();
const getBeijingTimeStr = () => {
    // 强制显示北京时间 HH:mm:ss
    return new Date(new Date().getTime() + 28800000).toISOString().slice(11, 19);
};

const getFormattedDate = (ts) => {
    if (!ts) return '';
    const d = new Date(parseInt(ts));
    const utc8 = new Date(d.getTime() + 28800000);
    const m = (utc8.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = utc8.getUTCDate().toString().padStart(2, '0');
    return `${m}/${day}`;
};

const getHeaders = () => ({
    "Host": "dingtalk.avaryholding.com:8443",
    "Connection": "keep-alive",
    "User-Agent": "Mozilla/5.0 (Linux; Android 13; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
    "Content-Type": "application/json",
    "Origin": "https://iw68lh.aliwork.com",
    "Referer": "https://iw68lh.aliwork.com/"
});

// --- 3. 核心业务逻辑 (内聚化分组逻辑，一人一卡) ---
const fetchPersonData = async (id, headers, todayDayId, regPerson, acToken) => {
    const startTime = Date.now();
    const targetUrl = 'https://dingtalk.avaryholding.com:8443/dingplus/visitorConnector/visitorStatus';
    const idTail = id.length > 4 ? id.slice(-4) : id;

    const result = {
        name: '未知',
        idTail: idTail,
        success: false,
        approverGroups: [], 
        globalStatus: { hasActive: false, hasPending: false, hasFuture: false, hasRejected: false },
        rawData: [], 
        cost: 0
    };

    const body = { visitorIdNo: id, regPerson: regPerson, acToken: acToken };

    try {
        const response = await axios.post(targetUrl, body, { headers, timeout: 8000 });
        const resData = response.data;
        result.cost = Date.now() - startTime;

        if (resData.code === 200 && Array.isArray(resData.data)) {
            result.success = true;
            result.rawData = resData.data; 

            if (resData.data.length > 0) {
                result.name = resData.data[0].visitorName || '未知';

                const rawByApprover = {};
                resData.data.forEach(item => {
                    const approver = item.rPersonName || '未知接待人';
                    if (!rawByApprover[approver]) rawByApprover[approver] = [];
                    rawByApprover[approver].push(item);
                });

                for (const [approver, records] of Object.entries(rawByApprover)) {
                    const groupObj = {
                        approver: approver,
                        priorityList: [],
                        historyList: [],
                        rawData: records
                    };

                    // ==========================================
                    // 🚀 核心修复：把冲突过滤提前到合并之前（精准打掉冲突的天数）
                    // ==========================================
                    
                    // 1. 找出所有真实的“已通过”原子记录
                    const approvedRecords = records.filter(r => String(r.flowStatus) !== '1' && String(r.flowStatus) !== '3');
                    
                    // 2. 精准踢掉所有和“已通过”日期产生冲突的“审核中/拒绝”记录
                    const validRecords = records.filter(item => {
                        // 真正的通过单子，绝对保留
                        if (String(item.flowStatus) !== '1' && String(item.flowStatus) !== '3') return true; 
                        
                        const pStart = parseInt(item.dateStart);
                        const pEnd = parseInt(item.dateEnd);
                        
                        // 检查这条审核中/被拒绝的单日记录，是否撞上了某条已通过的记录
                        const isOverlapping = approvedRecords.some(approved => {
                            const aStart = parseInt(approved.dateStart);
                            const aEnd = parseInt(approved.dateEnd);
                            return (aStart <= pEnd && aEnd >= pStart);
                        });
                        
                        return !isOverlapping; // 如果不冲突，则安全保留（此时 13号安全幸存！）
                    });

                    // 3. 将干净、无冲突的记录按状态分组
                    const groups = {};
                    validRecords.forEach(item => {
                        let statusType = 'APPROVED';
                        if (String(item.flowStatus) === '1') statusType = 'PENDING';
                        if (String(item.flowStatus) === '3') statusType = 'REJECTED';

                        if (!groups[statusType]) groups[statusType] = [];
                        groups[statusType].push(item);
                    });

                    // 4. 对同一状态内的安全记录进行连贯天数合并
                    let mergedList = [];
                    Object.values(groups).forEach(groupList => {
                        groupList.sort((a, b) => b.dateStart - a.dateStart);
                        let currentRange = { ...groupList[0], rangeStart: groupList[0].dateStart, rangeEnd: groupList[0].dateEnd };

                        for (let i = 1; i < groupList.length; i++) {
                            const nextItem = groupList[i];
                            const diffDays = getBeijingDayId(currentRange.rangeStart) - getBeijingDayId(nextItem.dateEnd);
                            const breakMerge = (getBeijingDayId(currentRange.rangeStart) >= todayDayId) && (getBeijingDayId(nextItem.dateEnd) < todayDayId);

                            if (diffDays <= 1 && !breakMerge) {
                                currentRange.rangeStart = nextItem.dateStart;
                            } else {
                                mergedList.push(currentRange);
                                currentRange = { ...nextItem, rangeStart: nextItem.dateStart, rangeEnd: nextItem.dateEnd };
                            }
                        }
                        mergedList.push(currentRange);
                    });

                    // 5. 生成展示字段
                    mergedList.forEach(item => {
                        const startId = getBeijingDayId(item.rangeStart);
                        const endId = getBeijingDayId(item.rangeEnd);
                        let type = 'ACTIVE';

                        if (endId < todayDayId) type = 'HISTORY';
                        else if (String(item.flowStatus) === '3') type = 'REJECTED';
                        else if (String(item.flowStatus) === '1') type = 'PENDING';
                        else if (startId > todayDayId) type = 'FUTURE';
                        else type = 'ACTIVE';

                        const baseItem = { ...item, _type: type };

                        if (type === 'FUTURE' || type === 'PENDING' || type === 'REJECTED') {
                            groupObj.priorityList.push({ ...baseItem, _displayStart: item.rangeStart, _displayEnd: item.rangeEnd });
                        } else if (type === 'ACTIVE') {
                            groupObj.priorityList.push({ ...baseItem, _displayStart: (startId < todayDayId) ? getNowTs() : item.rangeStart, _displayEnd: item.rangeEnd });
                        }

                        if (type === 'HISTORY') {
                            groupObj.historyList.push({ ...baseItem, _displayStart: item.rangeStart, _displayEnd: item.rangeEnd });
                        } else if (type === 'ACTIVE' && startId < todayDayId) {
                            const yesterdayTs = getNowTs() - 86400000;
                            groupObj.historyList.push({ ...baseItem, _displayStart: item.rangeStart, _displayEnd: yesterdayTs });
                        }
                    });

                    const typeWeight = { 'ACTIVE': 4, 'PENDING': 3, 'FUTURE': 2, 'REJECTED': 1 };
                    groupObj.priorityList.sort((a, b) => {
                        const weightDiff = typeWeight[b._type] - typeWeight[a._type];
                        if (weightDiff !== 0) return weightDiff;
                        return b.rangeStart - a.rangeStart;
                    });

                    groupObj.historyList.sort((a, b) => b.rangeStart - a.rangeStart);

                    if (groupObj.priorityList.some(i => i._type === 'ACTIVE')) result.globalStatus.hasActive = true;
                    if (groupObj.priorityList.some(i => i._type === 'PENDING')) result.globalStatus.hasPending = true;
                    if (groupObj.priorityList.some(i => i._type === 'FUTURE')) result.globalStatus.hasFuture = true;
                    if (groupObj.priorityList.some(i => i._type === 'REJECTED')) result.globalStatus.hasRejected = true;

                    result.approverGroups.push(groupObj);
                }
            }
        }
    } catch (err) {
        result.cost = Date.now() - startTime;
    }
    return result;
};

module.exports = { getBeijingDayId, getNowTs, getBeijingTimeStr, getFormattedDate, getHeaders, fetchPersonData };
