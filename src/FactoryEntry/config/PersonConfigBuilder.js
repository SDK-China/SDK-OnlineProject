// 「人员配置生成器」常量配置 —— 逆向自宜搭「一般访客申请单」(FREELOGIN=true，无需钉钉登录)
// 用途：本地录入人员资料 + 上传证件照片 → 自动生成 PERSON_DB（见 config/FactoryEntryReport.js）配置代码
// 🔒 安全红线：本模块只做「文件上传」与「配置代码生成」，绝不调用「提交申请」接口
const ORIGIN = "https://iw68lh.aliwork.com";

const BuilderConfig = {
    origin: ORIGIN,
    appType: "APP_GRVPTEOQ6D4B7FLZFYNJ",
    formUuid: "FORM-2768FF7B2C0D4A0AB692FD28DBA09FD57IHQ",

    // 表单入口：GET 一次即可拿到 JSESSIONID + tianshu_csrf_token（无需账号密码）
    entryUrl: ORIGIN + "/o/fk_ybfk?account=17614625112" +
        "&company=%E5%AE%8F%E5%90%AF%E8%83%9C%E7%B2%BE%E5%AF%86%E7%94%B5%E5%AD%90(%E7%A7%A6%E7%9A%87%E5%B2%9B)%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8" +
        "&part=%E7%A7%A6%E7%9A%87%E5%B2%9B%E5%9B%AD%E5%8C%BA&applyType=%E4%B8%80%E8%88%AC%E8%AE%BF%E5%AE%A2",

    // 附件（证件照片 / 社保在职证明 / 其他附件）三步走：签发直传凭证 → POST 到 OSS → 回调确认
    ossSignPath: "/o/HW9663A19D6M1QDL6D7GNAO1L2ZC28HXQHOXLG",
    ossCallbackPath: "/o/HW9663A19D6M1QDL6D7GNAO1L2ZC2MHXQHOXLH",

    // ⛔⛔ 下面这行是「真正提交一张新申请」的接口，本工具的任何代码都不会访问它：
    // submitPath: "/o/HW9663A19D6M1QDL6D7GNAO1L2ZC2NBXQHOXL3",

    // 免冠照片：钉钉图片服务（已验证 CORS 允许浏览器直传，不占本服务器带宽）
    imageServiceUrl: "https://dingtalk.avaryholding.com:8443/dingplus/image/uploadFile",

    // 大小上限：附件经本服务器中转，Vercel 请求体上限 4.5MB；本地直跑不受限
    limits: {
        imageMB: 50,
        attachmentMB: 20,
        vercelMB: 4.5
    },

    // 表单字段 fieldId —— 原样取自现有 PERSON_DB，改动任何一位都会导致提交失败
    fields: {
        idType: "selectField_lxv44orx",
        idNo: "textField_lxv44ory",
        name: "textField_lxv44orw",
        areaCode: "selectField_mbyjhot6",
        phone: "textField_lxv44orz",
        photo: "imageField_ly9i5k5q",
        idCardPhoto: "attachmentField_lxv44osj",
        socialProof: "attachmentField_lxv44osk",
        otherFiles: "attachmentField_lxv44osn"
    },

    // 有效身份证件：三种选项的 option 结构互不相同，必须原样保留（{{v}} 为证件类型名）
    idTypes: {
        "身份证": '{ "defaultChecked": false, "syncLabelValue": true, "__sid": "item_lxjzgsg1", "text": "{{v}}", "__sid__": "serial_lxjzgsg0", "value": "{{v}}", "sid": "serial_lxjzgsg0", "status": "active" }',
        "护照": '{ "defaultChecked": false, "syncLabelValue": true, "__sid": "item_lxjzgsg2", "text": "{{v}}", "__sid__": "serial_lxjzgsg1", "value": "{{v}}", "sid": "serial_lxjzgsg1" }',
        "台胞证": '{ "defaultChecked": false, "syncLabelValue": true, "__sid": "item_lxjzgsg3", "text": "{{v}}", "__sid__": "serial_lxjzgsg2", "value": "{{v}}", "sid": "serial_lxjzgsg2" }'
    },

    // 区号：现有全部记录都是 86/+86（含外籍人员），原样固定，不臆造 sid
    areaCode: { value: "86", text: "+86", sid: "serial_mbyjf8gm" },

    // 接待人信息库：就在 config/FactoryEntryReport.js 的 LOC_CONFIGS[*].receptionists 里
    // 只做「只读文本解析」，不 require 那份大配置（它有启动日志与 .bin 读取副作用）
    receptionistSource: "FactoryEntryReport.js",

    // 接待人工号 → 姓名 / 部门 / 手机号：直接问公司服务器
    // 就是访客表单里「接待人工号」失焦那一刻浏览器发的同一个请求，等于替浏览器发一次
    // （实测无鉴权、无需 Cookie，响应头 access-control-allow-origin: *）
    receptionistLookup: {
        url: "https://dingtalk.avaryholding.com:8443/dingplus/searchFormData",
        appType: "APP_GRVPTEOQ6D4B7FLZFYNJ",
        formUuid: "FORM-B965E22437E1415BBBBA33011BF20FB54VP8",   // 员工信息表
        systemToken: "DC666GC1PN6LT8C7C64FD9N62P2E3F9V1SFWLKQ61",
        employeeFieldId: "employeeField_m3o6fym4",                 // 员工字段（用工号查的就是它）
        // 返回的 formData 里的字段名
        fields: {
            id: "textField_m3pkk1ey",
            name: "textField_m3pkk1ez",
            dept: "textField_m3pgo9p1",
            phone: "textField_m3pollg0",
            site: "textField_m3pollg2"
        },
        cacheMs: 10 * 60 * 1000
    },

    // 工号 → 接待人配置块的生成参数
    // 目标写法（与 LOC_CONFIGS.PengDing.receptionists 里现有条目一模一样，可整块粘贴）：
    //             "F7049952": {
    //                 receptionistName: "付英丽",
    //                 receptionDepartment: "夾治具設計組",
    //                 receptionistPhone: "13333283801",
    //                 visitReason: "治具维修",
    //                 renewThreshold: 2,
    //                 renewDays: 7
    //             },
    // ⚠️ 部门字段在现有配置里叫 receptionDepartment（不是 receptionistDepartment），必须保持一致
    receptionistCodeIndent: "            ",   // 12 空格：receptionists 里每个工号那一层的缩进
    receptionistDefaults: {                    // 服务器不返回事由/续签参数，本地也没有时用这套默认值
        visitReason: "设备维护与保养",
        renewThreshold: 2,
        renewDays: 7
    }
};

module.exports = BuilderConfig;
