const express = require('express');
const router = express.Router();

// 准确计算北京时间的明天日期
function getBeijingTomorrowDate() {
    const now = new Date();
    const beijingOptions = { 
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    };
    const beijingDateStr = now.toLocaleDateString('zh-CN', beijingOptions);
    const [year, month, day] = beijingDateStr.split('/').map(Number);
    const beijingToday = new Date(year, month - 1, day);
    const beijingTomorrow = new Date(beijingToday);
    beijingTomorrow.setDate(beijingToday.getDate() + 1);
    return `${beijingTomorrow.getMonth() + 1}/${beijingTomorrow.getDate()}`;
}

// 获取当前北京时间并格式化为XXXX-XX-XX XX:XX:XX
function getFormattedBeijingTime() {
    return new Date().toLocaleString('zh-CN', { 
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).replace(/\//g, '-');
}

// ==========================================
// 🌟 双击复制的全部逻辑放在独立 JS 文件里下发。
// 这样页面 <body> 中只剩纯正文文本：
//   · 微X模块“发送网络链接文本”之类的读取工具只会读到正文
//   · 不会读到 <div id="toast"> 和 <script> 的内容
// 需要复制的内容通过 <head> 里的 <meta name="copy-target"> 传递（head 不在正文读取范围内）
// ==========================================
const COPY_SCRIPT = `
(function () {
    var meta = document.querySelector('meta[name="copy-target"]');
    var copyTargetText = '';
    try {
        copyTargetText = meta ? JSON.parse(decodeURIComponent(meta.getAttribute('content') || '""')) : '';
    } catch (e) {
        copyTargetText = '';
    }

    var toastTimer = null;
    function showToast(msg) {
        var toast = document.getElementById('toast');
        if (!toast) {
            // 提示条按需创建，加载时不存在，避免污染页面正文
            toast = document.createElement('div');
            toast.id = 'toast';
            document.body.appendChild(toast);
        }
        toast.innerText = msg;
        toast.style.display = 'block';
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            toast.style.display = 'none';
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 1500);
    }

    // 兼容微信内置浏览器与非 HTTPS 环境
    function fallbackCopy(text) {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
            document.execCommand('copy');
            showToast('已复制到剪贴板');
        } catch (e) {
            showToast('复制失败，请手动长按复制');
        }
        document.body.removeChild(textarea);
    }

    function doCopy(text) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(function () {
                showToast('已复制到剪贴板');
            }).catch(function () {
                fallbackCopy(text);
            });
        } else {
            fallbackCopy(text);
        }
    }

    // 监听全局双击事件
    document.addEventListener('dblclick', function (e) {
        e.preventDefault();
        doCopy(copyTargetText);
    });
})();
`;

// 独立的复制脚本（由页面 <head> 引入，不进入 <body> 正文）
router.get('/construction-copy.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(COPY_SCRIPT);
});

// 施工进度接口（支持多厂区动态路由）
router.get('/construction-schedule/:factory', (req, res) => {
    try {
        const factory = req.params.factory.toLowerCase(); 
        const tomorrowDate = getBeijingTomorrowDate();
        const currentBeijingTime = getFormattedBeijingTime();
        
        let copyContent = '';

        // 分别拆分出需要被复制的核心内容（不含时间与落款）
        if (factory === 'a08') {
            copyContent = `A08厂
施工日期：${tomorrowDate}
①施工单位:友景
②工程名称:2F测试四线治具调试跟线
③施工人数：10人
④动火作业 ：不动
⑤预计完成进度:持续
⑥预计完成时间：持续`;
        } else if (factory === 'a01') {
            copyContent = `A01厂：施工日：${tomorrowDate}
①施工单位：友景
②施工项目：3F电测设备异常处理跟进工作  
③施工人数：6人
④动火作业 ：否
⑤预计完成进度:持续
⑥预计完成时间：持续`;
        } else {
            return res.status(404).send('未找到该厂区的报备信息配置，请检查链接后缀是否为 a08 或 a01。');
        }

        // 仅在屏幕展示、不加入复制的附带内容
        const footerContent = `当前时间：${currentBeijingTime}
【本消息由Melody自动发送】`;

        // 页面实际展示的完整文本
        const fullDisplayText = `${copyContent}\n${footerContent}`;

        // 要复制的正文，编码后放进 <head> 的 meta，正文里不留任何多余标签
        const copyTargetEncoded = encodeURIComponent(JSON.stringify(copyContent));

        // 返回页面：<body> 里只有纯文本 + 双击复制（脚本与提示条都在 body 之外/按需生成）
        const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="copy-target" content="${copyTargetEncoded}">
    <title>施工进度 - ${factory.toUpperCase()}</title>
    <style>
        * { box-sizing: border-box; }
        body {
            margin: 0;
            padding: 16px;
            font-family: monospace, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 15px;
            line-height: 1.6;
            white-space: pre-wrap;
            word-break: break-all;
            background: #fff;
            color: #000;
            min-height: 100vh;
            cursor: pointer;
        }
        #toast {
            position: fixed;
            top: 24px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.78);
            color: #fff;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 13px;
            display: none;
            z-index: 9999;
            pointer-events: none;
        }
    </style>
    <script defer src="/FactoryEntry/Construction/construction-copy.js"></script>
</head>
<body>${fullDisplayText}</body>
</html>`;

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(html);

    } catch (error) {
        console.error('微信自动请求功能错误:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/construction-schedule', (req, res) => {
    res.redirect('construction-schedule/a08');
});

module.exports = router;
