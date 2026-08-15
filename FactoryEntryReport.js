/**
 * FactoryEntryReport.js
 * 自动续期入厂申请脚本 (多厂区支持 + 完美克隆解析 + 严格顺位保持 + SPA极速界面 + 独立账号身份校验)
 * =========================================================================
 * 🛠️ 已按职责拆分到 src/ 下：
 *   - src/config/factory.js   人员名单 / 组包模板 / Q01 解析 / 厂区配置
 *   - src/service/factory.js  状态查询 / 熔断 / 计划计算 / 发包
 *   - src/routes/factory.js   路由接口
 *   - src/view/factory.js     Debug 前端页面 + 请求包 HTML 渲染
 *   - lib/utils.js            共享工具函数
 * 本文件仅作为入口，对外接口地址不变。
 * =========================================================================
 */
module.exports = require('./src/routes/factory');
