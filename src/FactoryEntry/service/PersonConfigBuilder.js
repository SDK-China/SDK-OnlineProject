// 「人员配置生成器」核心逻辑：上传证件 → 生成 PERSON_DB 配置代码
// 🔒 全程只调用「文件上传 / 绑定回调」接口，绝不调用提交接口
const axios = require('axios');
const FormData = require('form-data');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const CFG = require('../config/PersonConfigBuilder');

const BROWSER_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

// ==========================================
// 1. 会话：GET 表单页一次，拿到 JSESSIONID + tianshu_csrf_token
// ==========================================
let sessionCache = { cookie: "", csrf: "", at: 0 };
const SESSION_TTL = 8 * 60 * 1000;

const getSession = async (force) => {
    if (!force && sessionCache.cookie && (Date.now() - sessionCache.at) < SESSION_TTL) return sessionCache;

    const res = await axios.get(CFG.entryUrl, {
        headers: {
            "User-Agent": BROWSER_UA,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        },
        timeout: 30000,
        validateStatus: () => true
    });

    const raw = res.headers['set-cookie'] || [];
    const cookie = raw.map(c => String(c).split(';')[0]).join('; ');
    const hit = /tianshu_csrf_token=([^;]+)/.exec(cookie);

    if (!cookie || !hit) {
        throw new Error("获取宜搭会话失败（未返回 Cookie/CSRF），请稍后重试");
    }

    sessionCache = { cookie, csrf: hit[1], at: Date.now() };
    return sessionCache;
};

const apiHeaders = (cookie) => ({
    "cookie": cookie,
    "X-Requested-With": "XMLHttpRequest",
    "Accept": "application/json, text/json",
    "User-Agent": BROWSER_UA,
    "Referer": CFG.entryUrl
});

// ==========================================
// 2. 附件上传（证件照片 / 社保在职证明 / 其他附件）
//    签发直传凭证 → POST 到 OSS → 回调确认
// ==========================================
const signAttachment = async (fileName, fileSize, contentType) => {
    const session = await getSession();
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const ext = path.extname(fileName || "").toLowerCase();

    // 对象名格式与官方页面一致：APP_xxx/2026/10-29/<UUID 大写>.<扩展名>
    const objectName = CFG.appType + "/" + now.getFullYear() + "/" + pad(now.getMonth() + 1) + "-" + pad(now.getDate())
        + "/" + crypto.randomUUID().toUpperCase() + ext;

    const params = {
        _api: "nattyFetch",
        _mock: "false",
        _csrf_token: session.csrf,
        appType: CFG.appType,
        fileName: fileName,
        fileSize: fileSize,
        contentType: contentType || "application/octet-stream",
        isOpen: "n",
        newContext: "y",
        objectName: objectName,
        procInstId: "",
        businessType: "",
        accelerate: "y",
        _stamp: Date.now()
    };

    const res = await axios.get(CFG.origin + CFG.ossSignPath, {
        params: params,
        headers: apiHeaders(session.cookie),
        timeout: 30000
    });

    const body = res.data || {};
    if (body.success !== true || !body.content || !body.content.policy) {
        throw new Error("签发上传凭证失败：" + JSON.stringify(body).slice(0, 300));
    }
    return body.content;
};

const uploadToOss = async (sign, buffer, fileName, contentType) => {
    const form = new FormData();
    form.append("accessid", sign.accessid);
    form.append("key", sign.objectName);
    form.append("policy", sign.policy);
    form.append("OSSAccessKeyId", sign.accessid);
    form.append("signature", sign.signature);
    form.append("expire", sign.expire);
    form.append("appType", CFG.appType);
    form.append("Content-Disposition", "attachment; filename=" + fileName);
    form.append("file", buffer, { filename: fileName, contentType: contentType || "application/octet-stream" });

    const res = await axios.post(sign.host, form, {
        headers: form.getHeaders(),
        timeout: 120000,
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        validateStatus: () => true
    });

    if (res.status !== 200 && res.status !== 204) {
        throw new Error("上传到对象存储失败，HTTP " + res.status);
    }
    return res.headers['x-oss-request-id'] || "";
};

const notifyOssCallback = async (sign, fileName, fileSize, ossRequestId) => {
    const session = await getSession();
    const body = new URLSearchParams({
        _csrf_token: session.csrf,
        appType: CFG.appType,
        fileName: fileName,
        fileSize: String(fileSize),
        objectName: sign.objectName,
        formUuid: CFG.formUuid,
        procInstId: "",
        ossRequestId: ossRequestId,
        businessType: "inst"
    }).toString();

    const res = await axios.post(CFG.origin + CFG.ossCallbackPath, body, {
        params: { _api: "nattyFetch", _mock: "false", _stamp: Date.now() },
        headers: Object.assign({}, apiHeaders(session.cookie), { "Content-Type": "application/x-www-form-urlencoded" }),
        timeout: 30000
    });

    return !!(res.data && res.data.success === true);
};

// 上传一个附件，返回可直接放进 PERSON_DB 的 value 元素
const uploadAttachment = async (fileName, buffer, contentType) => {
    const sign = await signAttachment(fileName, buffer.length, contentType);
    const ossRequestId = await uploadToOss(sign, buffer, fileName, contentType);

    let bound = false;
    try {
        bound = await notifyOssCallback(sign, fileName, buffer.length, ossRequestId);
    } catch (e) {
        // 回调失败不影响文件本身已落库，仅记录
        console.warn("   [附件回调] " + fileName + " 失败：" + e.message);
    }

    return {
        name: fileName,
        size: buffer.length,
        previewUrl: sign.previewUrl,
        downloadUrl: sign.downloadUrl,
        url: sign.url,
        fileUuid: sign.objectName,
        bound: bound,
        fieldType: "attachment"
    };
};

// 免冠照片由浏览器直传钉钉图片服务，这里只做格式化
const buildImageItem = (raw) => {
    const url = raw.url || raw.downloadURL || raw.imgURL || "";
    return {
        name: String(raw.name || ""),
        previewUrl: raw.imgURL || url,
        downloadUrl: raw.downloadURL || url,
        size: Number(raw.size || 0),
        url: url,
        fieldType: "image"
    };
};

// ==========================================
// 3. 生成 PERSON_DB 配置代码
// ==========================================
const b64 = (s) => Buffer.from(String(s), "utf8").toString("base64");

// 现有 PERSON_DB 里已有的键（只读文本做正则，不 require 那份大配置，避免引入副作用）
let existingKeysCache = null;
const getExistingKeys = () => {
    if (existingKeysCache) return existingKeysCache;
    existingKeysCache = new Set();
    try {
        const p = path.join(__dirname, "..", "config", "FactoryEntryReport.js");
        const txt = fs.readFileSync(p, "utf8");
        const re = /^ {4}"([A-Za-z0-9+/=]+)":\s*\[/gm;
        let m;
        while ((m = re.exec(txt)) !== null) existingKeysCache.add(m[1]);
    } catch (e) {
        console.warn("   [配置检查] 读取 PERSON_DB 失败：" + e.message);
    }
    return existingKeysCache;
};
const q = (s) => JSON.stringify(String(s === undefined || s === null ? "" : s));
const IND = "        ";

const imageItemLine = (it) => '{ "name": ' + q(it.name)
    + ', "previewUrl": ' + q(it.previewUrl)
    + ', "downloadUrl": ' + q(it.downloadUrl)
    + ', "size": ' + (Number(it.size) || 0)
    + ', "url": ' + q(it.url) + ' }';

const attachItemLine = (it) => '{ "name": ' + q(it.name)
    + ', "previewUrl": ' + q(it.previewUrl)
    + ', "downloadUrl": ' + q(it.downloadUrl)
    + ', "size": ' + (Number(it.size) || 0)
    + ', "url": ' + q(it.url)
    + ', "fileUuid": ' + q(it.fileUuid) + ' }';

const asList = (v) => Array.isArray(v) ? v.filter(Boolean) : (v ? [v] : []);

const buildEntry = async (payload) => {
    const name = String(payload.name || "").trim();
    const idNo = String(payload.idNo || "").trim();
    const phone = String(payload.phone || "").trim();
    const idType = String(payload.idType || "身份证").trim();

    if (!name) throw new Error("缺少姓名");
    if (!idNo) throw new Error("缺少证件号码");
    if (!phone) throw new Error("缺少联系方式");
    if (!CFG.idTypes[idType]) throw new Error("不支持的证件类型：" + idType);

    const photos = asList(payload.photo).map(buildImageItem);
    const idCards = asList(payload.idCardPhoto);
    const socials = asList(payload.socialProof);
    const others = asList(payload.otherFiles);

    const lines = [];

    // 有效身份证件
    lines.push(IND + '{ "componentName": "SelectField", "fieldId": ' + q(CFG.fields.idType)
        + ', "label": "有效身份证件", "fieldData": { "value": ' + q(idType) + ', "text": ' + q(idType) + ' }'
        + ', "options": [' + CFG.idTypes[idType].split("{{v}}").join(idType) + '] },');

    // 证件号码
    lines.push(IND + '{ "componentName": "TextField", "fieldId": ' + q(CFG.fields.idNo)
        + ', "label": "证件号码", "fieldData": { "value": decode(' + q(b64(idNo)) + ') } },');

    // 姓名（纯汉字直写，避免乱码）
    lines.push(IND + '{ "componentName": "TextField", "fieldId": ' + q(CFG.fields.name)
        + ', "label": "姓名", "fieldData": { "value": ' + q(name) + ' } }, // 🛡️ 纯正汉字防乱码');

    // 区号（现有记录统一 86 / +86）
    lines.push(IND + '{ "componentName": "SelectField", "fieldId": ' + q(CFG.fields.areaCode)
        + ', "label": "区号", "fieldData": { "value": ' + q(CFG.areaCode.value) + ', "text": ' + q(CFG.areaCode.text) + ' }'
        + ', "options": [{ "defaultChecked": true, "syncLabelValue": false, "__sid": "item_megqe4lm", "text": ' + q(CFG.areaCode.text)
        + ', "__sid__": "serial_megqe4ll", "value": ' + q(CFG.areaCode.value) + ', "sid": ' + q(CFG.areaCode.sid) + ' }] },');

    // 联系方式
    lines.push(IND + '{ "componentName": "TextField", "fieldId": ' + q(CFG.fields.phone)
        + ', "label": "联系方式", "fieldData": { "value": decode(' + q(b64(phone)) + ') } },');

    // 免冠照片
    lines.push(IND + '{ "componentName": "ImageField", "fieldId": ' + q(CFG.fields.photo)
        + ', "label": "免冠照片", "fieldData": { "value": [' + photos.map(imageItemLine).join(", ") + '] } },');

    // 证件照片
    lines.push(IND + '{ "componentName": "AttachmentField", "fieldId": ' + q(CFG.fields.idCardPhoto)
        + ', "label": "证件照片", "fieldData": { "value": [' + idCards.map(attachItemLine).join(", ") + '] } },');

    // 社保 / 在职证明
    lines.push(IND + '{ "componentName": "AttachmentField", "fieldId": ' + q(CFG.fields.socialProof)
        + ', "label": "社保/在职证明", "fieldData": { "value": [' + socials.map(attachItemLine).join(", ") + '] } },');

    // 其他附件
    lines.push(IND + '{ "componentName": "AttachmentField", "fieldId": ' + q(CFG.fields.otherFiles)
        + ', "label": "其他附件", "fieldData": { "value": [' + others.map(attachItemLine).join(", ") + '] } }');

    const key = b64(idNo);
    const today = new Date(Date.now() + 28800000).toISOString().slice(0, 10);

    // 接待人工号（选填）：填了就带出 姓名 / 部门 / 手机号 的配置片段
    const recIdRaw = String(payload.receptionistId || "").trim();
    const rec = await lookupReceptionist(recIdRaw);

    const code = '    // ' + name + ' (' + today + ' 生成)\n'
        + '    ' + q(key) + ': [\n'
        + lines.join("\n") + '\n'
        + '    ],';

    // 顶格输出，不缩进（缩进进配置文件里看着更别扭，粘贴后自己对齐就行）
    const visitorLine = q(key) + ', // ' + name;

    return {
        key: key,
        name: name,
        idType: idType,
        phone: phone,
        code: code,
        visitorLine: visitorLine,
        receptionist: rec.found ? rec.info : null,
        receptionistCode: rec.code,
        warnings: [
            getExistingKeys().has(key) ? "该证件号已存在于 PERSON_DB，直接粘贴会覆盖原有条目（确认是本人再做）" : "",
            recIdRaw && !rec.found ? "没查到接待人工号 " + recIdRaw + "（公司员工信息里没有），未带出接待人配置" : "",
            rec.found && rec.inLocal ? "接待人工号 " + rec.id + " 已在 receptionists 里，粘贴会覆盖原有配置（确认是同一人再做）" : "",
            photos.length === 0 ? "免冠照片为空，提交时大概率会被表单校验拦下" : "",
            idCards.length === 0 ? "证件照片为空，提交时大概率会被表单校验拦下" : "",
            socials.length === 0 ? "社保/在职证明为空（若对方要求可后补）" : ""
        ].filter(Boolean)
    };
};

// ==========================================
// 4. 接待人工号 → 姓名 / 部门 / 手机号
//    信息源：config/FactoryEntryReport.js 的 LOC_CONFIGS[*].receptionists
//    只读文本 + 大括号配对解析（不 require 那份大配置，它有启动日志与 .bin 读取副作用）
// ==========================================
const REPORT_CONFIG = path.join(__dirname, "..", "config", CFG.receptionistSource);

// 从 openIndex 处的 "{" 开始，配对大括号取出整段对象文本
const sliceBraces = (txt, openIndex) => {
    if (txt[openIndex] !== "{") return "";
    let depth = 0;
    for (let i = openIndex; i < txt.length; i++) {
        const c = txt[i];
        if (c === "{") depth++;
        else if (c === "}" && --depth === 0) return txt.slice(openIndex, i + 1);
    }
    return "";
};

// 按文件 mtime 缓存：改了信息库不用重启服务也能立刻查到
let recCache = { mtime: -1, map: Object.create(null) };

const getReceptionistMap = () => {
    let mtime = 0;
    try { mtime = fs.statSync(REPORT_CONFIG).mtimeMs; } catch (e) { /* 文件缺失时当作空表 */ }
    if (mtime && mtime === recCache.mtime) return recCache.map;

    const map = Object.create(null);
    let txt = "";
    try {
        txt = fs.readFileSync(REPORT_CONFIG, "utf8");
    } catch (e) {
        console.warn("   [接待人] 读取信息库失败：" + e.message);
        recCache = { mtime: mtime, map: map };
        return map;
    }

    // 厂区头：  "    'PengDing': {   // 鹏鼎"
    const locs = [];
    const locRe = /^ {4}'(\w+)':\s*\{[ \t]*\/\/[ \t]*(.*)$/gm;
    let lm;
    while ((lm = locRe.exec(txt)) !== null) {
        locs.push({ key: lm[1], title: (lm[2] || "").trim(), at: lm.index });
    }

    // 接待人信息库：正好 8 空格缩进的 receptionists: { ... }
    const blockRe = /^ {8}receptionists:\s*\{/gm;
    let bm;
    while ((bm = blockRe.exec(txt)) !== null) {
        const body = sliceBraces(txt, txt.indexOf("{", bm.index));
        if (!body) continue;

        const loc = locs.filter(l => l.at < bm.index).pop() || null;

        // 每条：  "A2449801": { receptionistName: "...", ... }
        const itemRe = /"([A-Za-z0-9_\-]+)"\s*:\s*\{([^{}]*)\}/g;
        let im;
        while ((im = itemRe.exec(body)) !== null) {
            const id = im[1];
            const src = im[2];
            const str = (k) => {
                const r = new RegExp(k + '\\s*:\\s*"([^"]*)"').exec(src);
                return r ? r[1] : "";
            };
            const num = (k) => {
                const r = new RegExp(k + "\\s*:\\s*(\\d+)").exec(src);
                return r ? Number(r[1]) : null;
            };
            map[id] = {
                receptionistId: id,
                receptionistName: str("receptionistName"),
                receptionDepartment: str("receptionDepartment") || str("receptionistDepartment"),
                receptionistPhone: str("receptionistPhone"),
                visitReason: str("visitReason"),
                renewThreshold: num("renewThreshold"),
                renewDays: num("renewDays"),
                loc: loc ? loc.key : "",
                locTitle: loc ? loc.title : ""
            };
        }
    }

    recCache = { mtime: mtime, map: map };
    return map;
};

// 组装成一整块可直接粘进 LOC_CONFIGS[*].receptionists 的配置
//   与现有条目同名同缩进：12 空格到工号、16 空格到属性
const REC_IND = CFG.receptionistCodeIndent;
const REC_PROP = REC_IND + "    ";

const receptionistCode = (r) => {
    const id = String(r.receptionistId || "").trim();
    const name = String(r.receptionistName || "").trim();
    const D = CFG.receptionistDefaults;

    const reason = String(r.visitReason || D.visitReason);
    const thr = (r.renewThreshold === undefined || r.renewThreshold === null) ? D.renewThreshold : r.renewThreshold;
    const days = (r.renewDays === undefined || r.renewDays === null) ? D.renewDays : r.renewDays;

    return REC_IND + "// " + (name || id) + "\n"
        + REC_IND + q(id) + ": {\n"
        + REC_PROP + "receptionistName: " + q(name) + ",\n"
        + REC_PROP + "receptionDepartment: " + q(r.receptionDepartment || "") + ",\n"
        + REC_PROP + "receptionistPhone: " + q(r.receptionistPhone || "") + ",\n"
        + REC_PROP + "visitReason: " + q(reason) + ",\n"
        + REC_PROP + "renewThreshold: " + thr + ",\n"
        + REC_PROP + "renewDays: " + days + "\n"
        + REC_IND + "},";
};

// 本地配置里的接待人（含事由 / 续签参数，服务器不返回这些）
const lookupReceptionistLocal = (raw) => {
    const id = String(raw === undefined || raw === null ? "" : raw).trim();
    if (!id) return { found: false, id: "", info: null, code: "" };

    const map = getReceptionistMap();
    let hit = map[id] || map[id.toUpperCase()] || null;
    if (!hit) {
        const k = Object.keys(map).find(x => x.toLowerCase() === id.toLowerCase());
        if (k) hit = map[k];
    }
    if (!hit) return { found: false, id: id, info: null, code: "" };
    return { found: true, id: hit.receptionistId, info: hit, code: receptionistCode(hit) };
};

// ==========================================
// 5. 接待人工号 → 姓名 / 部门 / 手机号（问服务器）
//    就是访客表单里「接待人工号」失焦时浏览器发的那一次请求：
//    POST /dingplus/searchFormData  → 员工信息表里按员工字段查这个工号
// ==========================================
const recRemoteCache = new Map();   // 工号 → { at, info }

const lookupReceptionistRemote = async (raw) => {
    const id = String(raw === undefined || raw === null ? "" : raw).trim();
    if (!id) return null;

    const LK = CFG.receptionistLookup;
    const key = id.toUpperCase();

    const cached = recRemoteCache.get(key);
    if (cached && (Date.now() - cached.at) < LK.cacheMs) return cached.info;

    const body = {
        formUUid: LK.formUuid,
        appType: LK.appType,
        systemToken: LK.systemToken,
        json: JSON.stringify({ [LK.employeeFieldId]: [id] })
    };

    const res = await axios.post(LK.url, body, {
        headers: { "Content-Type": "application/json" },
        timeout: 20000,
        validateStatus: () => true
    });

    const rows = res.data && res.data.body && res.data.body.data;
    const fd = Array.isArray(rows) && rows[0] ? rows[0].formData : null;
    if (!fd) return null;   // 没这个人，不做负缓存（刚入职的也能立刻查到）

    const pick = (k) => {
        const v = fd[k];
        return v === undefined || v === null ? "" : String(v).trim();
    };

    const info = {
        receptionistId: pick(LK.fields.id) || id,
        receptionistName: pick(LK.fields.name),
        receptionDepartment: pick(LK.fields.dept),
        receptionistPhone: pick(LK.fields.phone),
        site: pick(LK.fields.site),
        visitReason: "",
        loc: "",
        locTitle: "",
        source: "server"
    };

    recRemoteCache.set(key, { at: Date.now(), info: info });
    return info;
};

// 对外：先问服务器（能查到公司里任何人），查不到/断网再退回本地配置
const lookupReceptionist = async (raw) => {
    const id = String(raw === undefined || raw === null ? "" : raw).trim();
    if (!id) return { found: false, id: "", info: null, code: "", source: "" };

    const local = lookupReceptionistLocal(id);
    let info = null;
    let source = "";

    try {
        info = await lookupReceptionistRemote(id);
        if (info) source = "server";
    } catch (e) {
        console.warn("   [接待人] 服务器查询失败：" + e.message + "（改用本地配置）");
    }

    if (!info) {
        if (!local.found) return { found: false, id: id, info: null, code: "", source: "none", inLocal: false };
        info = Object.assign({}, local.info, { source: "local" });
        source = "local";
    } else if (local.found) {
        // 服务器只给姓名/部门/手机号，事由与续签参数从本地配置补
        info.visitReason = local.info.visitReason || "";
        info.renewThreshold = local.info.renewThreshold;
        info.renewDays = local.info.renewDays;
        info.locTitle = local.info.locTitle || "";
        info.loc = local.info.loc || "";
    }

    if (!info.receptionistId) info.receptionistId = id;
    return {
        found: true,
        id: info.receptionistId,
        info: info,
        code: receptionistCode(info),
        source: source,
        inLocal: local.found
    };
};

module.exports = {
    getSession,
    signAttachment,
    uploadAttachment,
    buildImageItem,
    buildEntry,
    getReceptionistMap,
    lookupReceptionistLocal,
    lookupReceptionistRemote,
    lookupReceptionist
};
