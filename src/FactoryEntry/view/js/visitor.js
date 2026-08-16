// 访客通前端逻辑（纯前后端分离：fetch JSON，自行渲染）
const API_BASE = '/FactoryEntry/Query';

let locConfigs = null;
let currentLoc = 'A08';
let idList = [];
let currentFetchVersion = 0;

const INTERVAL = 120;
let countDown = INTERVAL;
let timer = null;

// 北京时间 MM/DD（与后端 getFormattedDate 保持一致）
function getFormattedDate(ts) {
    if (!ts) return '';
    const d = new Date(parseInt(ts));
    const utc8 = new Date(d.getTime() + 28800000);
    const m = (utc8.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = utc8.getUTCDate().toString().padStart(2, '0');
    return `${m}/${day}`;
}

// 北京时间 HH:mm:ss
function getBeijingTimeStr() {
    return new Date(new Date().getTime() + 28800000).toISOString().slice(11, 19);
}

// 前端版卡片渲染（由后端 generateCardHtml 迁移而来）
function generateCardHtml(person) {
    const searchKey = `${person.name} ${person.idTail}`.toUpperCase();
    const updateTimeStr = getBeijingTimeStr();
    const rawJsonStr = encodeURIComponent(JSON.stringify(person.rawData, null, 2));

    let statusBadge = '<span class="status-badge badge-gray">无记录</span>';
    if (person.globalStatus.hasActive) statusBadge = '<span class="status-badge badge-green">生效中</span>';
    else if (person.globalStatus.hasRejected) statusBadge = '<span class="status-badge badge-red">已拒绝</span>';
    else if (person.globalStatus.hasPending) statusBadge = '<span class="status-badge badge-yellow">审核中</span>';
    else if (person.globalStatus.hasFuture) statusBadge = '<span class="status-badge badge-blue">已预约</span>';
    else if (!person.success) statusBadge = '<span class="status-badge badge-red">失败</span>';

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

                return `<div class="row-item main-row"><div class="row-left"><div class="dot ${iconClass}"></div><div class="time-range">${startStr} - ${endStr}</div><div class="mini-tag ${tagClass}">${tagName}</div></div></div>`;
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
                            return `<div class="row-item history-row"><div class="row-left"><div class="dot ${historyDot}"></div><div class="time-range">${startStr} - ${endStr}</div>${historyTag}</div></div>`;
                        }).join('')}
                    </div>
                </div>` : '';

            return `<div class="approver-block"><div class="approver-header"><span class="approver-name">接待人: ${group.approver}</span></div>${priorityHtml || '<div class="empty-tip" style="padding:4px 0;">无活跃记录</div>'}${historyHtml}</div>`;
        }).join('');
    }

    return `<div class="app-card fade-in" data-key="${searchKey}">
        <div class="vcard-header">
            <div class="header-user">
                <div class="avatar">${person.name[0] || '?'}</div>
                <div class="user-meta"><div class="name">${person.name}</div><div class="id-no">ID: ${person.idTail}</div></div>
            </div>
            ${statusBadge}
        </div>
        <div class="vcard-body">${bodyHtml}</div>
        <div class="vcard-footer">
            <div class="footer-meta"><span class="icon-timer">⚡</span> ${person.cost}ms<span class="sep">|</span>${updateTimeStr}</div>
            <div class="footer-btn" onclick="openRawModal('${person.name}', '${rawJsonStr}')">JSON <span class="arrow-right">→</span></div>
        </div>
    </div>`;
}

window.onload = async function () {
    locConfigs = await fetch(API_BASE + '/visitor-config').then(r => r.json());
    idList = locConfigs[currentLoc].ids;
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
    container.innerHTML = idList.map(function (id, idx) {
        return '<div class="app-card" id="wrapper-' + idx + '" style="padding:16px;">' +
            '<div style="display:flex;gap:12px;align-items:center;">' +
            '<div class="skeleton skeleton-circle"></div>' +
            '<div style="flex:1">' +
            '<div class="skeleton skeleton-text"></div>' +
            '<div class="skeleton skeleton-text" style="width:40%"></div>' +
            '</div></div></div>';
    }).join('');
}

function switchTab(loc) {
    if (currentLoc === loc) return;
    currentLoc = loc;
    idList = locConfigs[loc].ids;
    currentFetchVersion++;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + loc).classList.add('active');
    document.getElementById('searchInput').value = '';
    updateTitleAndMeta();
    renderSkeletons();
    manualRefresh();
}

function startLoop() {
    if (timer) clearInterval(timer);
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
    if (isAuto) showToast("⚡ 自动同步数据中...");
    else showToast("🚀 正在刷新数据...");

    let finished = 0;
    let hasErr = false;
    const thisVersion = currentFetchVersion;
    const delayMs = 300;
    let sent = 0;

    const checkFinished = () => {
        if (thisVersion !== currentFetchVersion) return;
        finished++;
        if (finished === idList.length) {
            sortAndFilter();
            if (isAuto) showToast("✅ 自动更新完毕");
            else showToast(hasErr ? "⚠️ 部分数据获取最终失败" : "✅ 刷新成功");
        }
    };

    const doFetchWithRetry = (index, retriesLeft) => {
        const id = idList[index];
        fetch(API_BASE + '/visitor-card-data?loc=' + currentLoc + '&id=' + encodeURIComponent(id))
            .then(r => r.json())
            .then(d => {
                if (thisVersion !== currentFetchVersion) return;
                if (d.success === false && retriesLeft > 0) {
                    showToast("⚠️ 检测到数据查询异常，正在自动重新查询...");
                    setTimeout(() => doFetchWithRetry(index, retriesLeft - 1), 1500);
                    return;
                }
                const wrapper = document.getElementById('wrapper-' + index);
                if (wrapper && d.person) {
                    const openHistoryBlocks = Array.from(wrapper.querySelectorAll('.approver-header')).map((header, i) => {
                        const content = header.parentElement.querySelector('.history-content');
                        return (content && content.classList.contains('show')) ? i : -1;
                    }).filter(i => i !== -1);

                    wrapper.outerHTML = generateCardHtml(d.person).replace('app-card', 'app-card fade-in').replace('data-key=', 'id="wrapper-' + index + '" data-key=');
                    const newWrapper = document.getElementById('wrapper-' + index);
                    if (newWrapper) {
                        newWrapper.setAttribute('data-has-active', d.person.globalStatus.hasActive ? '1' : '0');
                        newWrapper.setAttribute('data-has-pending', d.person.globalStatus.hasPending ? '1' : '0');
                        newWrapper.setAttribute('data-has-future', d.person.globalStatus.hasFuture ? '1' : '0');
                        const blocks = newWrapper.querySelectorAll('.approver-block');
                        openHistoryBlocks.forEach(idx => {
                            if (blocks[idx]) {
                                const t = blocks[idx].querySelector('.history-trigger');
                                const c = blocks[idx].querySelector('.history-content');
                                if (t && c) { t.classList.add('active'); c.classList.add('show'); }
                            }
                        });
                    }
                }
                if (d.success === false) hasErr = true;
                checkFinished();
            })
            .catch(() => {
                if (thisVersion !== currentFetchVersion) return;
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
        doFetchWithRetry(index, 2);
    };

    const loopTimer = setInterval(() => {
        sendOne();
        if (sent >= idList.length) clearInterval(loopTimer);
    }, delayMs);
}

function sortAndFilter() {
    const container = document.getElementById('cardList');
    const cards = Array.from(container.children);
    const getWeight = (card) => {
        if (card.getAttribute('data-has-active') === '1') return 3;
        if (card.getAttribute('data-has-pending') === '1') return 2;
        if (card.getAttribute('data-has-future') === '1') return 1;
        return 0;
    };
    cards.sort((a, b) => getWeight(b) - getWeight(a));
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
    div.className = 'vtoast';
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
