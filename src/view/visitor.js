// 访客通：视图 (卡片 HTML 生成 + 网页主页面)
const CONFIGS = require('../config/visitor');
const { getBeijingTimeStr, getFormattedDate } = require('../service/visitor');

const generateCardHtml = (person) => {
    const searchKey = `${person.name} ${person.idTail}`.toUpperCase();
    const updateTimeStr = getBeijingTimeStr();
    const rawJsonStr = encodeURIComponent(JSON.stringify(person.rawData, null, 2)); // 恢复总数据 JSON

    let statusBadge = '<span class="status-badge badge-gray">无记录</span>';
    if (person.globalStatus.hasActive) statusBadge = '<span class="status-badge badge-green">生效中</span>';
    else if (person.globalStatus.hasRejected) statusBadge = '<span class="status-badge badge-red">已拒绝</span>';
    else if (person.globalStatus.hasPending) statusBadge = '<span class="status-badge badge-yellow">审核中</span>';
    else if (person.globalStatus.hasFuture) statusBadge = '<span class="status-badge badge-blue">已预约</span>';
    else if (!person.success) statusBadge = '<span class="status-badge badge-red">失败</span>';

    // 组装内部数据块 HTML
    let bodyHtml = '';
    if (person.approverGroups.length === 0) {
        bodyHtml = '<div class="empty-tip">暂无任何记录</div>';
    } else {
        bodyHtml = person.approverGroups.map(group => {
            const priorityHtml = group.priorityList.map(item => {
                const startStr = getFormattedDate(item._displayStart);
                const endStr = getFormattedDate(item._displayEnd);
                let tagClass = 'tag-gray', iconClass = 'dot-gray';
                let tagName = '记录';

                if (item._type === 'ACTIVE') { tagClass = 'tag-green'; iconClass = 'dot-green'; tagName = '今日'; }
                if (item._type === 'FUTURE') { tagClass = 'tag-blue'; iconClass = 'dot-blue'; tagName = '预约'; }
                if (item._type === 'PENDING') { tagClass = 'tag-yellow'; iconClass = 'dot-yellow'; tagName = '审核'; }
                if (item._type === 'REJECTED') { tagClass = 'tag-red'; iconClass = 'dot-red'; tagName = '拒绝'; }

                return `
                    <div class="row-item main-row">
                        <div class="row-left">
                            <div class="dot ${iconClass}"></div>
                            <div class="time-range">${startStr} - ${endStr}</div>
                            <div class="mini-tag ${tagClass}">${tagName}</div>
                        </div>
                    </div>`;
            }).join('');

            const historyHtml = group.historyList.length > 0 ? `
                <div class="history-box">
                    <div class="history-trigger" onclick="toggleHistory(this)">
                        <span>🕒 历史记录 (${group.historyList.length})</span>
                        <span class="arrow">▼</span>
                    </div>
                    <div class="history-content">
                        ${group.historyList.map(item => {
                const startStr = getFormattedDate(item._displayStart);
                const endStr = getFormattedDate(item._displayEnd);
                const isPending = String(item.flowStatus) === '1';
                const isRejected = String(item.flowStatus) === '3';

                let historyDot = 'dot-gray-light';
                let historyTag = '';
                if (isPending) { historyDot = 'dot-yellow'; historyTag = '<span style="color:#f59e0b;font-size:10px;margin-left:4px">[审]</span>'; }
                if (isRejected) { historyDot = 'dot-red'; historyTag = '<span style="color:#ef4444;font-size:10px;margin-left:4px">[拒]</span>'; }

                return `
                            <div class="row-item history-row">
                                <div class="row-left">
                                    <div class="dot ${historyDot}"></div>
                                    <div class="time-range">${startStr} - ${endStr}</div>
                                    ${historyTag}
                                </div>
                            </div>`;
            }).join('')}
                    </div>
                </div>
            ` : '';

            return `
                <div class="approver-block">
                    <div class="approver-header">
                        <span class="approver-name">接待人: ${group.approver}</span>
                    </div>
                    ${priorityHtml || '<div class="empty-tip" style="padding:4px 0;">无活跃记录</div>'}
                    ${historyHtml}
                </div>
            `;
        }).join('');
    }

    return `
        <div class="app-card fade-in" data-key="${searchKey}">
            <div class="card-header">
                <div class="header-user">
                    <div class="avatar">${person.name[0] || '?'}</div>
                    <div class="user-meta">
                        <div class="name">${person.name}</div>
                        <div class="id-no">ID: ${person.idTail}</div>
                    </div>
                </div>
                ${statusBadge}
            </div>
            
            <div class="card-body">
                ${bodyHtml}
            </div>

            <div class="card-footer">
                <div class="footer-meta">
                    <span class="icon-timer">⚡</span> ${person.cost}ms
                    <span class="sep">|</span>
                    ${updateTimeStr}
                </div>
                <div class="footer-btn" onclick="openRawModal('${person.name}', '${rawJsonStr}')">
                    JSON <span class="arrow-right">→</span>
                </div>
            </div>
        </div>
    `;
};

// 网页主入口 (SPA 丝滑切换改版)
function renderVisitorStatusPage() {
    // 提取两个厂区的关键配置传入前端
    const frontendConfigs = {
        'A08': { title: CONFIGS['A08'].title, ids: CONFIGS['A08'].visitorIdNos },
        'Q01': { title: CONFIGS['Q01'].title, ids: CONFIGS['Q01'].visitorIdNos }
    };
    const frontendConfigsScript = JSON.stringify(frontendConfigs);

    const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>访客通 Pro</title>
    <style>
        :root {
            --primary: #2563eb;
            --bg-body: #f1f5f9;
            --bg-card: #ffffff;
            --text-main: #0f172a;
            --text-sub: #64748b;
            --shadow-card: 0 4px 6px -1px rgba(0,0,0,0.05), 0 10px 15px -3px rgba(0,0,0,0.05);
            --radius: 16px;
        }

        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; user-select: none; }
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif; background: var(--bg-body); color: var(--text-main); padding-bottom: 80px; }

        /* --- 顶部导航 --- */
        .navbar {
            position: sticky; top: 0; z-index: 100;
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(0,0,0,0.05);
            padding: 12px 16px;
        }
        .nav-content { display: flex; justify-content: space-between; align-items: center; height: 44px; }
        .nav-title { font-size: 18px; font-weight: 700; color: #1e293b; display: flex; align-items: center; gap: 8px; }
        .live-dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; box-shadow: 0 0 8px #22c55e; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 0.5; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1.1); } 100% { opacity: 0.5; transform: scale(0.9); } }
        
        .progress-bar-container { position: absolute; bottom: 0; left: 0; width: 100%; height: 2px; background: transparent; }
        .progress-bar { height: 100%; background: var(--primary); width: 100%; transition: width 1s linear; }

        .btn-refresh { 
            width: 36px; height: 36px; border-radius: 50%; background: #eff6ff; color: var(--primary); 
            display: flex; align-items: center; justify-content: center; font-size: 18px; cursor: pointer; transition: all 0.2s;
        }
        .btn-refresh:active { transform: scale(0.9); background: #dbeafe; }
        .spin { animation: rotate 0.8s infinite linear; }
        @keyframes rotate { to { transform: rotate(360deg); } }

        /* 搜索框 */
        .search-wrap { margin-top: 10px; }
        .search-input {
            width: 100%; height: 36px; border-radius: 10px; border: none; background: #e2e8f0; 
            padding: 0 12px; font-size: 14px; outline: none; transition: background 0.2s;
        }
        .search-input:focus { background: #cbd5e1; }

        /* 厂区丝滑切换 Tab (无跳转刷新) */
        .tabs { display: flex; gap: 8px; margin-top: 12px; }
        .tab { 
            flex: 1; text-align: center; padding: 8px 0; background: #e2e8f0; 
            border-radius: 8px; color: #64748b; font-weight: 600; 
            cursor: pointer; font-size: 13px; transition: all 0.2s;
            border: 1px solid transparent;
        }
        .tab.active { 
            background: #fff; color: var(--primary); 
            box-shadow: 0 2px 4px rgba(0,0,0,0.05); 
            border-color: #cbd5e1;
        }

        /* --- 容器 --- */
        .container { padding: 16px; max-width: 600px; margin: 0 auto; }

        /* --- 卡片设计 --- */
        .app-card {
            background: var(--bg-card); border-radius: var(--radius); 
            box-shadow: var(--shadow-card); margin-bottom: 16px; 
            overflow: hidden; transition: transform 0.2s; border: 1px solid rgba(255,255,255,0.5);
        }
        .fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .card-header { padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; }
        .header-user { display: flex; align-items: center; gap: 12px; }
        .avatar { 
            width: 42px; height: 42px; border-radius: 50%; background: #eff6ff; color: var(--primary); 
            font-weight: 700; display: flex; align-items: center; justify-content: center; font-size: 18px;
            border: 2px solid #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .user-meta .name { font-weight: 600; font-size: 16px; color: #334155; }
        .user-meta .id-no { font-size: 12px; color: #94a3b8; margin-top: 2px; }

        .status-badge { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
        .badge-green { background: #dcfce7; color: #166534; }
        .badge-yellow { background: #fef9c3; color: #854d0e; }
        .badge-blue { background: #dbeafe; color: #1e40af; }
        .badge-gray { background: #f1f5f9; color: #64748b; }
        .badge-red { background: #fee2e2; color: #991b1b; }

        /* --- 新增：接待人分块设计 --- */
        .card-body { padding: 12px 16px; }
        .approver-block {
            background: #f8fafc;
            border-radius: 10px;
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid #e2e8f0;
        }
        .approver-block:last-child { margin-bottom: 0; }
        .approver-header {
            display: flex; justify-content: space-between; align-items: center;
            margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px dashed #cbd5e1;
        }
        .approver-name { font-size: 13px; font-weight: 600; color: #334155; }

        .row-item { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; }
        .row-left { display: flex; align-items: center; gap: 8px; }
        
        .dot { width: 8px; height: 8px; border-radius: 50%; }
        .dot-green { background: #22c55e; box-shadow: 0 0 0 2px #dcfce7; }
        .dot-blue { background: #3b82f6; box-shadow: 0 0 0 2px #dbeafe; }
        .dot-yellow { background: #eab308; box-shadow: 0 0 0 2px #fef9c3; }
        .dot-red { background: #ef4444; box-shadow: 0 0 0 2px #fee2e2; } 
        .dot-gray { background: #cbd5e1; }
        .dot-gray-light { background: #e2e8f0; }
        
        .time-range { font-size: 14px; font-weight: 500; color: #334155; font-family: monospace; letter-spacing: -0.5px; }
        
        .mini-tag { font-size: 10px; padding: 1px 5px; border-radius: 4px; transform: scale(0.9); }
        .tag-green { background: #22c55e; color: white; }
        .tag-blue { background: #3b82f6; color: white; }
        .tag-yellow { background: #eab308; color: white; }
        .tag-red { background: #ef4444; color: white; }
        .tag-gray { background: #f1f5f9; color: #64748b; }
        
        .empty-tip { text-align: center; color: #94a3b8; font-size: 12px; padding: 8px 0; }

        .history-box { margin-top: 8px; border-top: 1px dashed #e2e8f0; padding-top: 6px; }
        .history-trigger { font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; cursor: pointer; padding: 4px 0; }
        .history-content { display: none; margin-top: 4px; }
        .history-content.show { display: block; }
        .history-row { opacity: 0.6; padding: 2px 0; }
        .arrow { transition: transform 0.2s; }
        .history-trigger.active .arrow { transform: rotate(180deg); }

        .card-footer { 
            background: #f8fafc; border-top: 1px solid #f1f5f9; padding: 8px 16px; 
            display: flex; justify-content: space-between; align-items: center;
        }
        .footer-meta { font-size: 11px; color: #94a3b8; font-family: monospace; display: flex; align-items: center; }
        .sep { margin: 0 6px; color: #e2e8f0; }
        
        /* 恢复原版按钮样式 */
        .footer-btn { 
            font-size: 11px; font-weight: 600; color: var(--primary); 
            background: rgba(37, 99, 235, 0.08); padding: 4px 10px; border-radius: 6px; 
            cursor: pointer; display: flex; align-items: center; gap: 4px;
        }
        .footer-btn:active { background: rgba(37, 99, 235, 0.15); }

        /* 骨架屏 */
        .skeleton { animation: pulse-bg 1.5s infinite; background: #e2e8f0; border-radius: 4px; }
        .skeleton-text { height: 16px; width: 60%; margin-bottom: 6px; }
        .skeleton-circle { height: 40px; width: 40px; border-radius: 50%; }
        @keyframes pulse-bg { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }

        /* Toast */
        .toast-wrap { 
            position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); 
            z-index: 999; display: flex; flex-direction: column; gap: 8px; pointer-events: none; 
        }
        .toast { 
            background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(4px); color: white; 
            padding: 10px 24px; border-radius: 30px; font-size: 13px; font-weight: 500;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2); 
            opacity: 0; transform: translateY(20px); transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .toast.show { opacity: 1; transform: translateY(0); }

        /* Modal */
        .modal-mask { position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(2px); z-index: 200; display: none; opacity: 0; transition: opacity 0.2s;}
        .modal-mask.show { opacity: 1; }
        .modal-panel { 
            position: fixed; bottom: 0; left: 0; width: 100%; height: 70vh; background: #fff; 
            border-radius: 20px 20px 0 0; transform: translateY(100%); transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 201; display: flex; flex-direction: column; box-shadow: 0 -10px 40px rgba(0,0,0,0.1);
        }
        .modal-panel.show { transform: translateY(0); }
        .modal-header { padding: 16px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; font-weight: 600; }
        .modal-body { flex: 1; overflow: auto; padding: 16px; background: #1e293b; color: #86efac; font-family: monospace; font-size: 11px; white-space: pre-wrap; word-break: break-all; }
        .btn-close { padding: 6px 12px; background: #f1f5f9; border-radius: 6px; font-size: 12px; border:none; color: #334155; }
        .btn-copy { padding: 6px 12px; background: #eff6ff; border-radius: 6px; font-size: 12px; border:none; color: var(--primary); margin-right: 8px;}

    </style>
</head>
<body>

<div class="navbar">
    <div class="nav-content">
        <div class="nav-title">
            <div class="live-dot"></div> <span id="mainTitle"></span>
        </div>
        <div class="btn-refresh" id="refreshBtn" onclick="manualRefresh()">🔄</div>
    </div>
    <div class="search-wrap">
        <input type="text" class="search-input" id="searchInput" placeholder="🔍 搜索姓名或身份证后4位..." onkeyup="filterList()">
    </div>
    
    <div class="tabs">
        <div id="tab-A08" class="tab active" onclick="switchTab('A08')">🏢 A08 厂区</div>
        <div id="tab-Q01" class="tab" onclick="switchTab('Q01')">🏢 Q01 厂区</div>
    </div>

    <div class="progress-bar-container">
        <div class="progress-bar" id="progressBar"></div>
    </div>
</div>

<div class="container" id="cardList">
    </div>

<div class="toast-wrap" id="toastWrap"></div>

<div class="modal-mask" id="modalMask" onclick="closeRawModal()"></div>
<div class="modal-panel" id="modalPanel">
    <div class="modal-header">
        <span id="modalTitle">源数据</span>
        <div>
            <button class="btn-copy" onclick="copyData()">复制数据</button>
            <button class="btn-close" onclick="closeRawModal()">关闭</button>
        </div>
    </div>
    <div class="modal-body" id="modalBody"></div>
</div>

<script>
    const locConfigs = ${frontendConfigsScript};
    let currentLoc = 'A08';
    let idList = locConfigs[currentLoc].ids;
    
    // 核心并发锁：记录当前的请求批次，每次点击 Tab 切换就会 +1
    let currentFetchVersion = 0; 
    
    const INTERVAL = 120;
    let countDown = INTERVAL;
    let timer = null;

    window.onload = function() {
        updateTitleAndMeta();
        renderSkeletons();
        startLoop();
        loadData(true); 
    };

    function updateTitleAndMeta() {
        document.getElementById('mainTitle').innerText = locConfigs[currentLoc].title;
        document.title = locConfigs[currentLoc].title;
    }

    function renderSkeletons() {
        const container = document.getElementById('cardList');
        container.innerHTML = idList.map(function(id, idx) {
            return '<div class="app-card" id="wrapper-' + idx + '" style="padding:16px;">' +
                   '<div style="display:flex;gap:12px;align-items:center;">' +
                   '<div class="skeleton skeleton-circle"></div>' +
                   '<div style="flex:1">' +
                   '<div class="skeleton skeleton-text"></div>' +
                   '<div class="skeleton skeleton-text" style="width:40%"></div>' +
                   '</div></div></div>';
        }).join('');
    }

    // --- 丝滑切换核心逻辑 ---
    function switchTab(loc) {
        if (currentLoc === loc) return; // 点相同的无视
        
        currentLoc = loc;
        idList = locConfigs[loc].ids;
        currentFetchVersion++; // 锁住新批次，旧批次的网络响应即使回来了也会被直接丢弃！

        // 更新 UI Tab 状态
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.getElementById('tab-' + loc).classList.add('active');
        
        // 恢复搜索框并更新标题
        document.getElementById('searchInput').value = '';
        updateTitleAndMeta();

        // 瞬间清空老列表并加载骨架动画
        renderSkeletons();
        
        // 立即拉取新数据
        manualRefresh();
    }

    function startLoop() {
        if(timer) clearInterval(timer);
        timer = setInterval(() => {
            countDown--;
            updateProgress();
            if (countDown <= 0) {
                loadData(true); 
                countDown = INTERVAL;
            }
        }, 1000);
        updateProgress();
    }

    function updateProgress() {
        const pct = (countDown / INTERVAL) * 100;
        document.getElementById('progressBar').style.width = pct + '%';
    }

    function manualRefresh() {
        const btn = document.getElementById('refreshBtn');
        btn.classList.add('spin');
        setTimeout(() => btn.classList.remove('spin'), 800);
        
        countDown = INTERVAL;
        updateProgress();
        loadData(false); 
    }

    function loadData(isAuto) {
        if(isAuto) {
            showToast("⚡ 自动同步数据中...");
        } else {
            showToast("🚀 正在刷新数据...");
        }

        let finished = 0;
        let hasErr = false;
        
        // 保存当前这波请求的版号，用于在网络回调时验证
        const thisVersion = currentFetchVersion; 

        // ======================
        // 核心修改区：严格 100ms 发一个，不等返回，加入【智能失败重试机制】
        // ======================
        const delayMs = 300; // 发包间隔（毫秒）
        let sent = 0;

        // 提取出的公共结束检查函数，避免在重试时逻辑错乱
        const checkFinished = () => {
            if (thisVersion !== currentFetchVersion) return;
            finished++;
            if(finished === idList.length) {
                sortAndFilter();
                if(isAuto) {
                    showToast("✅ 自动更新完毕");
                } else {
                    if(!hasErr) showToast("✅ 刷新成功");
                    else showToast("⚠️ 部分数据获取最终失败");
                }
            }
        };

        // 递归请求方法，retriesLeft 代表还剩几次重试机会
        const doFetchWithRetry = (index, retriesLeft) => {
            const id = idList[index];
            
            fetch('visitor-card-data?loc=' + currentLoc + '&id=' + encodeURIComponent(id))
                .then(r => r.json())
                .then(d => {
                    if (thisVersion !== currentFetchVersion) return; 

                    // 👇 判断：如果查询失败 且 还有重试次数
                    if (d.success === false && retriesLeft > 0) {
                        showToast("⚠️ 检测到数据查询异常，正在自动重新查询...");
                        // 延迟 1.5 秒后重新发起该人员的请求
                        setTimeout(() => doFetchWithRetry(index, retriesLeft - 1), 1500);
                        return; // 必须 return，阻断后续 DOM 渲染，等待下一次请求返回！
                    }

                    const wrapper = document.getElementById('wrapper-' + index);
                    if(wrapper && d.html) {
                        const openHistoryBlocks = Array.from(wrapper.querySelectorAll('.approver-header')).map((header, i) => {
                            const content = header.parentElement.querySelector('.history-content');
                            return (content && content.classList.contains('show')) ? i : -1;
                        }).filter(i => i !== -1);

                        wrapper.outerHTML = d.html.replace('app-card', 'app-card fade-in').replace('data-key=', 'id="wrapper-'+index+'" data-key=');
                        const newWrapper = document.getElementById('wrapper-' + index);
                        
                        if(newWrapper) {
                            newWrapper.setAttribute('data-has-active', d.hasActive ? '1' : '0');
                            newWrapper.setAttribute('data-has-pending', d.hasPending ? '1' : '0');
                            newWrapper.setAttribute('data-has-future', d.hasFuture ? '1' : '0');
                            const blocks = newWrapper.querySelectorAll('.approver-block');
                            openHistoryBlocks.forEach(idx => {
                                if (blocks[idx]) {
                                    const t = blocks[idx].querySelector('.history-trigger');
                                    const c = blocks[idx].querySelector('.history-content');
                                    if(t && c) { t.classList.add('active'); c.classList.add('show'); }
                                }
                            });
                        }
                    }
                    
                    // 如果重试次数耗尽后依然失败，或者一次就成功了，走到这里才算这条数据彻底完成
                    if (d.success === false) hasErr = true;
                    checkFinished();
                })
                .catch(() => { 
                    if (thisVersion !== currentFetchVersion) return; 
                    
                    // 如果是网络层面的报错，同样走重试逻辑
                    if (retriesLeft > 0) {
                        showToast("📡 网络波动，正在尝试重新连接...");
                        setTimeout(() => doFetchWithRetry(index, retriesLeft - 1), 1500);
                        return; 
                    }
                    
                    hasErr = true; 
                    checkFinished();
                });
        };

        const sendOne = () => {
            const index = sent;
            sent++;
            // 第二个参数是重试次数：这里设置为 2，意味着最多尝试 3 次 (1次正常 + 2次重试)
            doFetchWithRetry(index, 2);
        };

        // 启动定时器：严格每隔 delayMs 发一个
        const timer = setInterval(() => {
            sendOne();
            if (sent >= idList.length) {
                clearInterval(timer);
            }
        }, delayMs);
    }

    function sortAndFilter() {
        const container = document.getElementById('cardList');
        const cards = Array.from(container.children);
        
        // 计算权重的辅助函数
        const getWeight = (card) => {
            if (card.getAttribute('data-has-active') === '1') return 3;
            if (card.getAttribute('data-has-pending') === '1') return 2;
            if (card.getAttribute('data-has-future') === '1') return 1;
            return 0; // 无记录、失败或已拒绝
        };

        cards.sort((a, b) => {
            return getWeight(b) - getWeight(a); // 权重高的在上面
        });
        
        cards.forEach(c => container.appendChild(c));
        filterList();
    }

    function filterList() {
        const key = document.getElementById('searchInput').value.toUpperCase();
        document.querySelectorAll('.app-card').forEach(card => {
            const dataKey = card.getAttribute('data-key') || '';
            card.style.display = dataKey.indexOf(key) > -1 ? '' : 'none';
        });
    }

    function showToast(msg) {
        const wrap = document.getElementById('toastWrap');
        const div = document.createElement('div');
        div.className = 'toast';
        div.innerText = msg;
        wrap.appendChild(div);
        
        requestAnimationFrame(() => {
            div.classList.add('show');
            setTimeout(() => {
                div.classList.remove('show');
                setTimeout(() => div.remove(), 300);
            }, 2500);
        });
    }

    function toggleHistory(el) {
        el.classList.toggle('active');
        const content = el.nextElementSibling;
        content.classList.toggle('show');
    }

    // Modal Logic
    const mask = document.getElementById('modalMask');
    const panel = document.getElementById('modalPanel');
    const body = document.getElementById('modalBody');
    const title = document.getElementById('modalTitle');

    function openRawModal(name, jsonEnc) {
        mask.style.display = 'block';
        setTimeout(() => mask.classList.add('show'), 10);
        panel.classList.add('show');
        title.innerText = name + " - 源数据";
        body.innerText = decodeURIComponent(jsonEnc);
        document.body.style.overflow = 'hidden';
    }

    function closeRawModal() {
        mask.classList.remove('show');
        panel.classList.remove('show');
        setTimeout(() => {
            mask.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }

    function copyData() {
        navigator.clipboard.writeText(body.innerText).then(() => {
            showToast("📋 已复制到剪贴板");
        });
    }
</script>
</body>
</html>
    `;
    return html;
}

module.exports = { generateCardHtml, renderVisitorStatusPage };
