// 日志控制台前端逻辑（纯前后端分离 + Bootstrap 界面）
let allLogs = [];
let selectedLogs = new Set();

function toggleLogSelect(e, key) {
    e.stopPropagation();
    if (e.target.checked) selectedLogs.add(key);
    else selectedLogs.delete(key);
    updateBulkActionBar();
    const checkboxes = document.querySelectorAll('.log-checkbox');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    document.getElementById('selectAllCb').checked = (checkboxes.length > 0 && allChecked);
}

function selectAllFiltered(e) {
    const isChecked = e.target.checked;
    const checkboxes = document.querySelectorAll('.log-checkbox');
    checkboxes.forEach(cb => {
        cb.checked = isChecked;
        if (isChecked) selectedLogs.add(cb.value);
        else selectedLogs.delete(cb.value);
    });
    updateBulkActionBar();
}

function updateBulkActionBar() {
    const count = selectedLogs.size;
    const bar = document.getElementById('bulkActionBar');
    const countTxt = document.getElementById('bulkCount');
    if (count > 0) {
        countTxt.innerText = count;
        bar.classList.add('show');
    } else {
        bar.classList.remove('show');
    }
}

async function deleteSingle(event, key) {
    event.stopPropagation();
    const pwd = prompt("⚠️ 即将永久删除此条记录，不可恢复！\n\n请输入确认密码：");
    if (!pwd) return;
    try {
        const res = await fetch('/FactoryEntry/Log/api/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pwd: pwd, keys: [key] })
        });
        const json = await res.json();
        if (json.success) {
            selectedLogs.delete(key);
            allLogs = allLogs.filter(log => log.key !== key);
            updateBulkActionBar();
            renderLogs();
        } else { alert(json.msg); }
    } catch (e) { alert('网络异常'); }
}

async function deleteSelected() {
    if (selectedLogs.size === 0) return;
    const pwd = prompt(`⚠️ 危险操作！即将会把您勾选的 ${selectedLogs.size} 条记录灰飞烟灭！\n\n请输入确认密码：`);
    if (!pwd) return;
    try {
        const res = await fetch('/FactoryEntry/Log/api/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pwd: pwd, keys: Array.from(selectedLogs) })
        });
        const json = await res.json();
        alert(json.msg);
        if (json.success) {
            const deletedKeys = Array.from(selectedLogs);
            allLogs = allLogs.filter(log => !deletedKeys.includes(log.key));
            selectedLogs.clear();
            document.getElementById('selectAllCb').checked = false;
            updateBulkActionBar();
            renderLogs();
        }
    } catch (e) { alert('网络异常'); }
}

function getTodayStr() { return new Date().toISOString().split('T')[0]; }

async function fetchLogs() {
    const container = document.getElementById('logContainer');
    container.innerHTML = `
        <div class="card border-0">
            <div class="card-body text-center py-5">
                <div class="text-primary fw-bold mb-3" id="loadingTitle">⚖️ 正在探测数据库并智能称重分包...</div>
                <div class="progress mb-2" style="height:12px">
                    <div class="progress-bar" id="loadingBar" style="width: 0%"></div>
                </div>
                <div class="text-muted small font-monospace" id="loadingSub">正在构建极速下载通道</div>
            </div>
        </div>`;
    try {
        const planRes = await fetch('/FactoryEntry/Log/api/log-plan');
        const planData = await planRes.json();
        if (!planData.success) throw new Error(planData.msg);
        const chunks = planData.chunks;
        if (chunks.length === 0) {
            allLogs = [];
            renderLogs();
            return;
        }
        const titleEl = document.getElementById('loadingTitle');
        const barEl = document.getElementById('loadingBar');
        const subEl = document.getElementById('loadingSub');
        titleEl.innerText = `📦 系统已将数据智能切分为 ${chunks.length} 个极限体积包，开始拉取...`;
        allLogs = [];
        let completedChunks = 0;
        const fetchPromises = chunks.map(async (chunk) => {
            const batchRes = await fetch('/FactoryEntry/Log/api/log-batch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keys: chunk })
            });
            const batchData = await batchRes.json();
            completedChunks++;
            const percent = Math.round((completedChunks / chunks.length) * 100);
            barEl.style.width = percent + '%';
            subEl.innerText = `⚡ 并发极速拉取: 已就位 [${completedChunks} / ${chunks.length}] - 进度 ${percent}%`;
            if (batchData.success) return batchData.data;
            else { console.error("某批次拉取失败:", batchData.msg); return []; }
        });
        const results = await Promise.all(fetchPromises);
        results.forEach(dataArray => { allLogs.push(...dataArray); });
        subEl.innerText = "✅ 数据 100% 拉取完毕，正在渲染界面...";
        setTimeout(() => { renderLogs(); }, 300);
    } catch (e) {
        container.innerHTML = `<div class="alert alert-danger">❌ 加载失败: ${e.message}</div>`;
    }
}

function formatPayload(log) {
    const data = log.data;
    if (!data) return '<div class="text-muted small fst-italic">该日志不包含详细数据体</div>';

    const renderPeopleWithBadge = (peopleStr) => {
        if (!peopleStr) return '未知';
        let badge = '';
        let name = peopleStr;
        if (peopleStr.indexOf('(🚀 独立专单') > -1) {
            const match = peopleStr.match(/\(🚀 独立专单 -> 接待人: (.*?)\)/);
            if (match) {
                badge = '<span class="people-badge people-badge-custom">🎯 专属接待: ' + match[1] + '</span>';
                name = peopleStr.replace(/\(🚀 独立专单 -> 接待人: .*?\)/, '').trim();
            }
        } else if (peopleStr.indexOf('(🏢 常规大部队拼车)') > -1) {
            badge = '<span class="people-badge people-badge-normal">🏢 大部队拼车</span>';
            name = peopleStr.replace(/\(🏢 常规大部队拼车\)/, '').trim();
        }
        return '<span class="text-light">' + name + '</span> ' + badge;
    };

    try {
        if (log.action === 'UI生成') {
            if (!Array.isArray(data)) throw new Error('Data is not an array');
            let html = '<div class="d-flex flex-column gap-3">';
            data.forEach((req, i) => {
                html += `
                <div class="code-block">
                    <div class="d-flex align-items-center gap-3 mb-2 pb-2 border-bottom border-secondary">
                        <span class="badge bg-primary">📦 数据包 ${i + 1}</span>
                        <span class="text-light small">📅 ${req.targetDate || '未知'}</span>
                    </div>
                    <div class="small mb-2 d-flex align-items-center flex-wrap">
                        <span class="me-1 text-secondary">👥</span> ${renderPeopleWithBadge(req.people)}
                    </div>
                    <div class="row g-3">
                        <div class="col-12 col-lg-6">
                            <div class="code-block">
                                <div class="code-block-head">
                                    <span class="small text-warning font-monospace">Encoded Body (最终发包)</span>
                                    <button onclick="copyRaw(event, '${encodeURIComponent(req.encodedBody || '')}')" class="btn btn-sm btn-outline-light">复制</button>
                                </div>
                                <div class="code-block-body">${req.encodedBody || '无数据'}</div>
                            </div>
                        </div>
                        <div class="col-12 col-lg-6">
                            <div class="code-block">
                                <div class="code-block-head">
                                    <span class="small text-success font-monospace">Raw JSON (明文结构)</span>
                                    <button onclick="copyRaw(event, '${encodeURIComponent(req.rawJson || '')}')" class="btn btn-sm btn-outline-light">复制</button>
                                </div>
                                <div class="code-block-body" style="white-space:pre">${req.rawJson || '无数据'}</div>
                            </div>
                        </div>
                    </div>
                </div>`;
            });
            return html + '</div>';
        }

        if (log.action === '手动发送') {
            const req = data.requestPayload || {};
            const res = data.responseResult || {};
            const isSuccess = res.success;
            return `
            <div class="d-flex flex-column gap-3">
                <div class="row g-3">
                    <div class="col-12 col-md-6">
                        <div class="code-block p-3">
                            <div class="text-secondary small mb-2 text-uppercase">📤 提交请求</div>
                            <div class="text-light small mb-2">📅 ${req.targetDate || '未知'}</div>
                            <div class="small d-flex align-items-center flex-wrap">
                                <span class="me-1 text-secondary">👥</span> ${renderPeopleWithBadge(req.people)}
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-6">
                        <div class="p-3 rounded border ${isSuccess ? 'bg-success bg-opacity-10 border-success' : 'bg-danger bg-opacity-10 border-danger'}">
                            <div class="${isSuccess ? 'text-success' : 'text-danger'} small mb-2 text-uppercase">📥 接口响应</div>
                            <div class="text-light small mb-1">${isSuccess ? '✅ 请求成功' : '❌ 请求失败'}</div>
                            <div class="${isSuccess ? 'text-success' : 'text-danger'} small font-monospace">${isSuccess ? '实例ID: ' + res.id : '原因: ' + (res.msg || '未知')}</div>
                        </div>
                    </div>
                </div>
                <div class="code-block">
                    <div class="code-block-head">
                        <span class="small text-warning font-monospace">Encoded Body (当时发的包)</span>
                        <button onclick="copyRaw(event, '${encodeURIComponent(req.encodedBody || '')}')" class="btn btn-sm btn-outline-light">复制</button>
                    </div>
                    <div class="code-block-body">${req.encodedBody || '无数据'}</div>
                </div>
            </div>`;
        }

        if (log.action === '自动续期') {
            const report = data.textReport || '无文本报告';
            const details = data.actionDetails || [];
            let detailsHtml = '';
            if (details.length > 0) {
                let listStr = '';
                for (let j = 0; j < details.length; j++) {
                    let d = details[j];
                    let rawJson = d.payload && d.payload.rawJson ? d.payload.rawJson : '无明文数据';
                    let encoded = d.payload && d.payload.encodedBody ? d.payload.encodedBody : '无真正发包数据';
                    let icon = d.success ? '✅' : '❌';
                    let color = d.success ? 'text-success' : 'text-danger';
                    listStr += '<details class="code-block mb-2">' +
                        '<summary class="d-flex justify-content-between align-items-center px-3 py-2 small text-light" style="cursor:pointer">' +
                            '<div class="d-flex align-items-center gap-2">' +
                                '<span class="' + color + ' fw-bold">' + icon + '</span>' +
                                '<span class="badge bg-dark">' + d.loc + '</span>' +
                                '<span>' + d.date + '</span>' +
                                '<span class="text-secondary">|</span>' +
                                '<span>' + renderPeopleWithBadge(d.people) + '</span>' +
                            '</div>' +
                            '<span class="text-secondary">查看双重底包 ▼</span>' +
                        '</summary>' +
                        '<div class="row g-3 p-3 border-top border-secondary">' +
                            '<div class="col-12 col-lg-6">' +
                                '<div class="code-block">' +
                                    '<div class="code-block-head"><span class="small text-warning font-monospace">Encoded Body (真正发出去的数据)</span><button onclick="copyRaw(event, \'' + encodeURIComponent(encoded) + '\')" class="btn btn-sm btn-outline-light">复制</button></div>' +
                                    '<div class="code-block-body">' + encoded + '</div>' +
                                '</div>' +
                            '</div>' +
                            '<div class="col-12 col-lg-6">' +
                                '<div class="code-block">' +
                                    '<div class="code-block-head"><span class="small text-success font-monospace">Raw JSON (原始明文结构)</span><button onclick="copyRaw(event, \'' + encodeURIComponent(rawJson) + '\')" class="btn btn-sm btn-outline-light">复制</button></div>' +
                                    '<div class="code-block-body" style="white-space:pre">' + rawJson + '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</details>';
                }
                detailsHtml = '<div class="mt-3 border-top border-secondary pt-3">' +
                    '<div class="text-secondary small mb-2 fw-bold">📦 底层发包数据切片 (' + details.length + '个):</div>' +
                    '<div class="d-flex flex-column gap-2">' + listStr + '</div></div>';
            }
            return `
            <div class="log-terminal">
                <div class="text-secondary small mb-2 font-monospace d-flex justify-content-between align-items-center">
                    <span>[Cron Job Console Output]</span>
                    <button onclick="copyRaw(event, '${encodeURIComponent(report)}')" class="btn btn-sm btn-outline-light">复制文本</button>
                </div>
                <div class="log-terminal-report">${report}</div>
                ${detailsHtml}
            </div>`;
        }

        return `<pre class="code-block-body"><code class="language-json">${JSON.stringify(data, null, 2)}</code></pre>`;
    } catch (e) {
        return `<pre class="code-block-body"><code class="language-json">${JSON.stringify(data, null, 2)}</code></pre>`;
    }
}

function renderLogs() {
    const container = document.getElementById('logContainer');
    const timeFilter = document.getElementById('timeFilter').value;
    const actionFilter = document.getElementById('actionFilter').value;
    const searchTxt = document.getElementById('searchInput').value.toLowerCase();
    const todayStr = getTodayStr();

    const filtered = allLogs.filter(log => {
        const logDate = log.time.split('_')[0];
        if (timeFilter === 'today' && logDate !== todayStr) return false;
        if (timeFilter === 'history' && logDate === todayStr) return false;
        if (actionFilter !== 'all' && log.action !== actionFilter) return false;
        if (searchTxt && !(log.location + log.summary + log.action).toLowerCase().includes(searchTxt)) return false;
        return true;
    });

    document.getElementById('logCount').innerText = filtered.length;

    if (filtered.length === 0) {
        container.innerHTML = '<div class="text-center text-muted py-5 bg-white rounded border border-dashed">没有找到对应的日志记录哦</div>';
        return;
    }

    container.innerHTML = filtered.map((log, i) => {
        let badgeClass = "log-badge bg-secondary text-white";
        if (log.action === "自动续期") badgeClass = "log-badge log-badge-auto";
        if (log.action === "UI生成") badgeClass = "log-badge log-badge-ui";
        if (log.action === "手动发送") badgeClass = "log-badge log-badge-manual";

        return `
        <div class="card shadow-sm border overflow-hidden position-relative">
            <div class="card-body py-3 d-flex align-items-start gap-3 log-card" onclick="toggleDetails(${i})">
                <div class="flex-shrink-0 pt-1" onclick="event.stopPropagation()">
                    <input type="checkbox" class="form-check-input log-checkbox" value="${log.key}" ${selectedLogs.has(log.key) ? 'checked' : ''} onclick="toggleLogSelect(event, '${log.key}')">
                </div>
                <div class="flex-grow-1 min-width-0">
                    <div class="d-flex align-items-center gap-2 flex-wrap mb-1">
                        <span class="${badgeClass}">${log.action}</span>
                        <span class="fw-bold text-dark small">🏢 ${log.location}</span>
                        <span class="font-monospace small text-muted bg-light px-2 py-0 rounded border">🕒 ${log.time.replace('_', ' ')}</span>
                    </div>
                    <div class="text-secondary small text-truncate">${log.summary}</div>
                </div>
                <button onclick="deleteSingle(event, '${log.key}')" class="btn btn-sm btn-light text-danger position-absolute top-0 end-0 m-2" title="删除此记录">🗑️</button>
            </div>
            <div id="details-${i}" class="log-details bg-dark border-top">
                <div class="d-flex gap-3 px-3 pt-2 border-bottom border-secondary bg-dark">
                    <button class="btn btn-link btn-sm text-secondary tab-btn active" onclick="switchView(event, ${i}, 'pretty')">✨ 智能排版视图</button>
                    <button class="btn btn-link btn-sm text-secondary tab-btn" onclick="switchView(event, ${i}, 'raw')">⚙️ 原始 JSON 树</button>
                </div>
                <div class="p-3">
                    <div id="view-pretty-${i}">${formatPayload(log)}</div>
                    <div id="view-raw-${i}" class="d-none position-relative">
                        <button onclick="copyRaw(event, '${encodeURIComponent(JSON.stringify(log.data, null, 2))}')" class="btn btn-sm btn-outline-light position-absolute top-0 end-0 m-2">复制整树</button>
                        <pre class="code-block-body"><code class="language-json">${JSON.stringify(log.data, null, 2)}</code></pre>
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');
}

function toggleDetails(index) {
    const detailsBox = document.getElementById('details-' + index);
    detailsBox.classList.toggle('open');
    if (detailsBox.classList.contains('open') && !detailsBox.dataset.highlighted) {
        detailsBox.querySelectorAll('.language-json').forEach(el => {
            setTimeout(() => hljs.highlightElement(el), 10);
        });
        detailsBox.dataset.highlighted = "true";
    }
}

function switchView(event, index, type) {
    const detailsContainer = document.getElementById('details-' + index);
    detailsContainer.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active', 'text-primary'));
    event.target.classList.add('active', 'text-primary');
    detailsContainer.querySelector('#view-pretty-' + index).classList.toggle('d-none', type !== 'pretty');
    const rawView = detailsContainer.querySelector('#view-raw-' + index);
    rawView.classList.toggle('d-none', type !== 'raw');
    if (type === 'raw' && !rawView.dataset.highlighted) {
        rawView.querySelectorAll('.language-json').forEach(el => hljs.highlightElement(el));
        rawView.dataset.highlighted = "true";
    }
}

function copyRaw(event, encodedStr) {
    event.stopPropagation();
    const code = decodeURIComponent(encodedStr);
    navigator.clipboard.writeText(code).then(() => {
        const btn = event.target;
        const oldTxt = btn.innerText;
        btn.innerText = '✅ 已复制';
        btn.classList.add('btn-success');
        setTimeout(() => {
            btn.innerText = oldTxt;
            btn.classList.remove('btn-success');
        }, 2000);
    });
}

async function clearLogs() {
    const pwd = prompt("⚠️ 危险操作！\n即将删除数据库中所有的日志记录，此操作不可逆！\n\n请输入确认密码：");
    if (!pwd) return;
    try {
        const res = await fetch('/FactoryEntry/Log/api/clear', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pwd }) });
        const json = await res.json();
        alert(json.msg);
        if (json.success) fetchLogs();
    } catch (e) { alert('网络异常'); }
}

fetchLogs();
