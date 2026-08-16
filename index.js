require('./lib/env');                                    //数据库 (集中加载 .env，见 lib/env.js)
const express = require('express'); // 关键修正：必须引入 express
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// --- 各功能模块已迁移至 src/ 下，按大类挂载 ---
const app = express();
const port = process.env.PORT || 3000;

// --- 全局中间件 ---

app.use(cors());
app.use(bodyParser.json());

// --- 前端静态文件托管 (view 目录下的 html/css/js) ---
app.use('/lib', express.static(path.join(__dirname, 'lib')));
app.use('/FactoryEntry/Report', express.static(path.join(__dirname, 'src/FactoryEntry/view/report')));
app.use('/FactoryEntry/Query', express.static(path.join(__dirname, 'src/FactoryEntry/view/query')));
app.use('/FactoryEntry/Log', express.static(path.join(__dirname, 'src/FactoryEntry/view/log')));
app.use('/FactoryEntry/assets', express.static(path.join(__dirname, 'src/FactoryEntry/view')));

// --- 路由注册 (按大类挂载) ---

// 🟢 访客入厂大类
app.use('/FactoryEntry/Report', require('./src/FactoryEntry/routes/FactoryEntryReport'));   // 入厂报备申请
app.use('/FactoryEntry/Query', require('./src/FactoryEntry/routes/VisitorApprovalQuery'));   // 访客查询
app.use('/FactoryEntry/Construction', require('./src/FactoryEntry/routes/WeChatAutoReq'));   // 施工报备文字
app.use('/FactoryEntry/Log', require('./src/FactoryEntry/routes/LogViewer'));                // 访客入厂日志

// 转链大类
app.use('/YunZhongKe', require('./src/YunZhongKe/routes/YunZhongKe'));   // 云中客转链

// 配置工具大类
app.use('/CrushTool', require('./src/CrushTool/routes/CrushTool'));      // 配置开关

// --- 根路由测试 (可选) ---
app.get('/', (req, res) => {
    // 主人，这里我们改用发送一段简单的 HTML 代码，并把图片放进去
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>首页</title>
        </head>
        <body>
            <p>🚀🚀🚀YunZhongKe Server is running.🚀🚀🚀</p>
            <img src="/sy.jpg" alt="sy" style="max-width: 100%;" />
        </body>
        </html>
    `);
});

// [新增] 处理首页图片的静态路由
app.get('/sy.jpg', (req, res) => {
    // 准确读取您项目根目录下的 sy.jpg 文件
    res.sendFile(path.join(__dirname, 'src/sy.jpg'));
});

// --- 静态文件处理 ---
app.get('/favicon.ico', (req, res) => {
    // 如果您确实上传了 favicon.ico 到根目录
    res.sendFile(path.join(__dirname, 'favicon.ico'));

    // 如果您没有文件，只是想消除 404 报错，可以用这行代替：
    // res.status(204).end(); 
});

// [新增] 平台验证文件 (b472ebb099a88a2c31edc854441f6dce.txt)
app.get('/b472ebb099a88a2c31edc854441f6dce.txt', (req, res) => {
    // 方案 A：直接返回字符串（推荐，无需物理文件，复制即用）
    // 通常验证文件的内容就是文件名中的哈希值
    // res.send('b472ebb099a88a2c31edc854441f6dce');

    // 方案 B：如果您确实上传了该 txt 文件到根目录，想读取文件内容，请使用下面这行：
    res.sendFile(path.join(__dirname, 'b472ebb099a88a2c31edc854441f6dce.txt'));
});

// --- 静态文件处理 ---
app.get('/robots.txt', (req, res) => {
    res.sendFile(path.join(__dirname, 'robots.txt'));
});

// --- 启动服务器 ---
// 适配 Vercel Serverless 环境
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server is running locally at http://localhost:${port}`);
    });
}

module.exports = app;