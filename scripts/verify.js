/**
 * scripts/verify.js
 * 改造前后「字节级」等价性回归验证 (守护核心: 发包体绝对不能有异常)
 *
 * 原理: 从 git 基线提交 (BASELINE_COMMIT，重构前的原始代码) 里取出原版源码，
 *       与当前模块化重构后的代码做 deepStrictEqual 逐字段比对。
 *
 * 覆盖:
 *   1) 人员名单 PERSON_DB / 组包模板 / LiDing 克隆解析 / 请求头 —— 核心数据完整性
 *   2) buildPayload 发包体 (PengDing 常规 / PengDing 专属 / LiDing 完美克隆) —— 字节级
 *   3) calculatePlan / calculatePendingPlan —— 计划计算
 *
 * 用法: node scripts/verify.js   (需在 git 仓库内运行)
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.join(__dirname, '..');
const BASELINE_COMMIT = '9131fe7'; // 重构前的原始提交

function baselineSource(file) {
    return execSync(`git show ${BASELINE_COMMIT}:${file}`, { cwd: root, encoding: 'utf-8' });
}

// 暴露原版内部变量 (仅测试用)
const EXPOSE = 'module.exports = { router, LOC_CONFIGS, PERSON_DB, A08_TEMPLATE, FORM_BASE, FORM_TAIL, Q01_PERSON_DB, Q01_ORIGINAL_ORDER, Q01_TEMPLATE_JSON, Q01_URL_PARAMS, decode, delay, getBeijingDayId, getFormattedDate, GLOBAL_HEADERS, checkSingleStatus, getAllStatuses, checkSafeToRun, submitApplication, calculatePlan, calculatePendingPlan };';

let origSrc = baselineSource('FactoryEntryReport.js');
if (!origSrc.includes('module.exports = router;')) {
    console.error('❌ 未在原版源码中找到出口，无法暴露内部变量');
    process.exit(2);
}
origSrc = origSrc.replace('module.exports = router;', EXPOSE);
const exposedPath = path.join(root, '_verify_orig.exposed.js');
fs.writeFileSync(exposedPath, origSrc);

const orig = require(exposedPath);
const configFactory = require('../src/FactoryEntry/config/FactoryEntryReport');
const newPersons = configFactory.PERSON_DB;
const newTemplates = configFactory;
const newLOC = configFactory.LOC_CONFIGS;
const newServices = require('../src/FactoryEntry/service/FactoryEntryReport');

let pass = 0, fail = 0;
function check(name, a, b) {
    try {
        assert.deepStrictEqual(a, b);
        pass++;
        console.log('  ✅ ' + name);
    } catch (e) {
        fail++;
        console.log('  ❌ ' + name + '\n' + String(e.message).slice(0, 2000));
    }
}

console.log('=== 1. 核心数据完整性 ===');
check('PERSON_DB (人员名单)', newPersons, orig.PERSON_DB);
check('FORM_BASE', newTemplates.FORM_BASE, orig.FORM_BASE);
check('FORM_TAIL', newTemplates.FORM_TAIL, orig.FORM_TAIL);
check('PENGDING_TEMPLATE', newTemplates.PENGDING_TEMPLATE, orig.A08_TEMPLATE);
check('LIDING_PERSON_DB', newTemplates.LIDING_PERSON_DB, orig.Q01_PERSON_DB);
check('LIDING_ORIGINAL_ORDER', newTemplates.LIDING_ORIGINAL_ORDER, orig.Q01_ORIGINAL_ORDER);
check('LIDING_TEMPLATE_JSON', newTemplates.LIDING_TEMPLATE_JSON, orig.Q01_TEMPLATE_JSON);
check('GLOBAL_HEADERS', newServices.GLOBAL_HEADERS, orig.GLOBAL_HEADERS);

console.log('=== 2. buildPayload 发包体字节级比对 ===');
const ts = 1760000000000; // 固定时间戳，保证确定性
const PENGDING_ID_KANG = 'MTMwMzIzMTk4NjAyMjgwODFY'; // 康
const PENGDING_ID_ZHANG = 'MTMwMzIyMTk4ODA2MjQyMDE4'; // 张
const LIDING_IDS = ['MDU4NDMzNDg=', 'MTIwNDUxOTI=', 'NDMxMjIyMTk5NzEyMDUzMzEz'];

check('PengDing buildPayload(常规大部队)',
    newLOC.PengDing.buildPayload([PENGDING_ID_KANG, PENGDING_ID_ZHANG], ts, newLOC.PengDing, null),
    orig.LOC_CONFIGS.A08.buildPayload([PENGDING_ID_KANG, PENGDING_ID_ZHANG], ts, orig.LOC_CONFIGS.A08, null)
);

check('PengDing buildPayload(专属接待人)',
    newLOC.PengDing.buildPayload([PENGDING_ID_KANG], ts, newLOC.PengDing, newLOC.PengDing.customReceptionists[PENGDING_ID_KANG]),
    orig.LOC_CONFIGS.A08.buildPayload([PENGDING_ID_KANG], ts, orig.LOC_CONFIGS.A08, orig.LOC_CONFIGS.A08.customReceptionists[PENGDING_ID_KANG])
);

check('LiDing buildPayload(完美克隆)',
    newLOC.LiDing.buildPayload(LIDING_IDS, ts, newLOC.LiDing, null),
    orig.LOC_CONFIGS.Q01.buildPayload(LIDING_IDS, ts, orig.LOC_CONFIGS.Q01, null)
);

console.log('=== 3. calculatePlan / calculatePendingPlan 计划计算 ===');
function makeStatusMap(idsBase64) {
    const map = {};
    const now = Date.now();
    const todayObj = new Date(now + 28800000);
    todayObj.setUTCHours(0, 0, 0, 0);
    const todayStart = todayObj.getTime() - 28800000;
    idsBase64.forEach((b64, i) => {
        const raw = Buffer.from(b64, 'base64').toString('utf-8');
        const end = todayStart + (i * 86400000);
        map[raw] = [
            { flowStatus: '2', dateEnd: String(end), dateStart: String(end - 86400000), rangeEnd: String(end), rangeStart: String(end - 86400000), rPerson: '62090782', rPersonName: '曹斗', visitorName: '测试人' },
            { flowStatus: '1', dateEnd: String(end + 86400000), dateStart: String(end), rangeEnd: String(end + 86400000), rangeStart: String(end), rPerson: '62090782', rPersonName: '曹斗', visitorName: '测试人' }
        ];
    });
    return map;
}
const pengDingIds = [PENGDING_ID_KANG, PENGDING_ID_ZHANG, 'MjMwMjMwMjAwMzAxMDEyMTM1'];
const mock = makeStatusMap(pengDingIds);

check('calculatePlan', newServices.calculatePlan(mock, newLOC.PengDing), orig.calculatePlan(mock, orig.LOC_CONFIGS.A08));
check('calculatePendingPlan', newServices.calculatePendingPlan(mock, newLOC.PengDing), orig.calculatePendingPlan(mock, orig.LOC_CONFIGS.A08));

try { fs.unlinkSync(exposedPath); } catch (e) {}

console.log('\n结果: ' + pass + ' 通过, ' + fail + ' 失败');
process.exit(fail === 0 ? 0 : 1);
