// ==========================================
// 自动续期：执行上限保护配置
// ------------------------------------------------------------
// Vercel 到 maxDuration（300 秒）会把函数进程直接杀掉，主流程来不及收尾、
// 更来不及写 Redis 日志。所以这里在「上限 - 1.5 秒 = 298.5 秒」用一个独立
// 定时器强制落盘一份快照，保证「跑到一半被砍」也有记录可查。
// 注意：只影响 Vercel 上的行为；本地/自建服务器没有杀进程这回事，默认关闭。
// ==========================================

const ENV = process.env;

// 必须和 vercel.json 里 api/index.js 的 maxDuration 保持一致
const MAX_DURATION_SECONDS = 300;

// 提前量：留 1.5 秒给「拼报告 + 写 Redis」跑完
const FLUSH_BEFORE_MS = 1500;

// 保底提前量：实测单次写 Redis 要 0.8 秒左右，载荷大时更久，
// 所以 295 秒先落一份保险的，298.5 秒再覆盖成最新的（同一个 key，日志页只显示一条）
const EARLY_FLUSH_BEFORE_MS = 5000;

// 跑在 Vercel 上才需要这种保护
const IS_SERVERLESS = !!ENV.VERCEL;

// 强制落盘的触发时间（毫秒），0 = 关闭
// AUTO_RENEW_FLUSH_AT_MS 可覆盖：
//   写 0       → 关闭
//   写 3000    → 3 秒后落盘（本地测试用，配合 dryRun=1 不会发真包）
const FLUSH_AT_MS = (() => {
    const raw = ENV.AUTO_RENEW_FLUSH_AT_MS;
    if (raw !== undefined && raw !== '') {
        const n = Number(raw);
        if (Number.isFinite(n) && n >= 0) return n;
    }
    if (!IS_SERVERLESS) return 0;
    return Math.max(1000, MAX_DURATION_SECONDS * 1000 - FLUSH_BEFORE_MS);
})();

// 保底落盘时间（毫秒），0 = 关闭；AUTO_RENEW_EARLY_FLUSH_AT_MS 可覆盖
const EARLY_FLUSH_AT_MS = (() => {
    const raw = ENV.AUTO_RENEW_EARLY_FLUSH_AT_MS;
    if (raw !== undefined && raw !== '') {
        const n = Number(raw);
        if (Number.isFinite(n) && n >= 0) return n;
    }
    if (!IS_SERVERLESS) return 0;
    return Math.max(1000, MAX_DURATION_SECONDS * 1000 - EARLY_FLUSH_BEFORE_MS);
})();

module.exports = { MAX_DURATION_SECONDS, FLUSH_BEFORE_MS, EARLY_FLUSH_BEFORE_MS, IS_SERVERLESS, FLUSH_AT_MS, EARLY_FLUSH_AT_MS };