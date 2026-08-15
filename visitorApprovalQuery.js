/**
 * visitorApprovalQuery.js
 * 访客通 Pro 查询功能 (已按职责拆分到 src/ 下)
 *   - src/config/visitor.js   各厂区配置
 *   - src/service/visitor.js  数据获取 + 工具函数
 *   - src/routes/visitor.js   路由接口
 *   - src/view/visitor.js     卡片 HTML + 网页主页面
 * 本文件仅作为入口，对外接口地址不变。
 */
module.exports = require('./src/routes/visitor');
