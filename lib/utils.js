// --- 共享工具函数 (从 FactoryEntryReport 抽取，原样保留，绝不改动) ---
const decode = (str) => Buffer.from(str, 'base64').toString('utf-8');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const getBeijingDayId = (ts) => Math.floor((parseInt(ts) + 28800000) / 86400000);
// 注意：本函数返回 "YYYY-MM-DD" 格式 (与 visitorApprovalQuery 里的同名函数不同，勿混用)
const getFormattedDate = (ts) => {
    const date = new Date(parseInt(ts) + 28800000);
    return date.toISOString().split('T')[0];
};

module.exports = { decode, delay, getBeijingDayId, getFormattedDate };
