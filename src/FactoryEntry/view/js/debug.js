// 入厂报备 Debug 面板前端逻辑（纯前后端分离：fetch JSON，自行渲染）
const API_BASE = '/FactoryEntry/Report';

let locs = [];
const loadedLocs = {};

// 渲染请求包列表（由后端 renderRequests 迁移而来）
function renderRequests(requests, loc) {
    if (requests.length === 0) return '<div style="padding:15px; text-align:center; color:#999; border:1px dashed #ddd; border-radius:8px; font-size:0.8rem;">无需发送数据包</div>';
    return requests.map((req) => `
    <div class="request-item">
        <details>
            <summary class="req-header">
                <div class="req-header-top"><strong>📅 ${req.targetDate}</strong></div>
                <div class="req-header-people">👥 ${req.people}</div>
            </summary>
            <div class="code-section">
                <div class="code-toolbar">
                    <div class="code-tabs">
                        <button class="tab-btn active" onclick="switchTab(this, 0)">Raw JSON</button>
                        <button class="tab-btn" onclick="switchTab(this, 1)">Encoded Body</button>
                    </div>
                    <button class="send-btn batch-send-btn" data-loc="${loc}" data-date="${req.targetDate}" data-people="${req.people}" data-encoded="${encodeURIComponent(req.encodedBody).replace(/'/g, "%27")}" onclick="sendPayload(event, '${loc}', '${req.targetDate}', '${req.people}', '${encodeURIComponent(req.encodedBody).replace(/'/g, "%27")}')">🚀 确认发送该包</button>
                </div>
                <div class="code-content active">
                    <button class="copy-btn" onclick="copyText(this, '${encodeURIComponent(req.rawJson).replace(/'/g, "%27")}')">Copy</button>
                    <pre style="color:#a5d6ff;">${req.rawJson}</pre>
                </div>
                <div class="code-content">
                    <button class="copy-btn" onclick="copyText(this, '${encodeURIComponent(req.encodedBody).replace(/'/g, "%27")}')">Copy</button>
                    <pre style="color:#ffae57; white-space:pre-wrap; word-break:break-all;">${req.encodedBody}</pre>
                </div>
            </div>
        </details>
    </div>`).join('');
}

// 渲染 debug-content 的 JSON 数据成完整面板（由后端 HTML 模板迁移而来）
function renderDebugContent(data) {
    const loc = data.loc;
    const title = data.title;
    const stats = data.stats;
    const safetyCheck = data.safetyCheck;
    const realPlan = data.realPlan;
    const pendingPlan = data.pendingPlan;
    const simulatedPlan = data.simulatedPlan;
    const personList = data.personList;

    const safetyBadge = safetyCheck.safe
        ? '<span style="background:#ecfdf5; color:#059669; padding:4px 8px; border-radius:4px; border:1px solid #a7f3d0; font-size:0.8rem;">✅ 安全 (Ready)</span>'
        : '<span style="background:#fef2f2; color:#dc2626; padding:4px 8px; border-radius:4px; border:1px solid #fecaca; font-size:0.8rem;">❌ 熔断 (BLOCKED)</span>';

    let realQueueHTML = '';
    if (safetyCheck.safe) {
        realQueueHTML = `<h3 style="font-size:0.9rem; margin-bottom:10px; color:#374151;">🚀 待发送队列 (${realPlan.requests.length})</h3>${renderRequests(realPlan.requests, loc)}`;
    } else {
        realQueueHTML = `<div class="blocked-overlay"><div style="font-size:1.5rem; margin-bottom:10px;">⛔</div><div style="font-weight:bold; font-size:1.1rem; margin-bottom:5px;">队列已被安全拦截</div><div style="font-size:0.85rem; opacity:0.8;">${safetyCheck.reason}<br>本次执行<b>绝对不会</b>发送任何请求。</div></div>`;
    }

    const personCheckboxes = personList.map(p => {
        const name = p.name + (p.hasCustom ? ' ⭐' : '');
        return `<label style="font-size:0.85rem; display:flex; align-items:center; gap:4px; ${p.isActive ? '' : 'opacity:0.5;'}"><input type="checkbox" class="person-cb-${loc}" value="${p.base64Id}" ${p.isActive ? 'checked' : ''}>${name} ${p.isActive ? '' : '(停用)'}</label>`;
    }).join('');

    return `
        <h1><span>🔧 [${title}] 自动续期调试</span> ${safetyBadge}</h1>

        ${!safetyCheck.safe ? `<div class="error-banner">⛔ 熔断警告: ${safetyCheck.reason}</div>` : ''}

        <div class="panel">
            <h2><span>📊 实时状态 (推演至: ${realPlan.targetDate})</span></h2>
            <div class="stat-grid">
                <div class="stat-item"><div class="stat-val">${stats.total}</div>总查询人数</div>
                <div class="stat-item"><div class="stat-val" style="color:#059669">${stats.success}</div>接口成功</div>
                <div class="stat-item"><div class="stat-val" style="color:#dc2626">${stats.error}</div>接口报错</div>
                <div class="stat-item"><div class="stat-val">${stats.noData}</div>查询无记录</div>
            </div>
            <div class="table-wrapper">
                <table>
                    <thead><tr><th>姓名/轨迹</th><th>有效期止</th><th>状态</th></tr></thead>
                    <tbody>
                        ${realPlan.summary.map(item => `<tr>
                            <td><strong>${item.name}</strong><br><span style="font-size:0.7rem;color:#999">${item.idMask}</span></td>
                            <td>${item.lastDate}</td>
                            <td><span class="status-badge ${item.class}">${item.status}</span>${item.customHtml ? item.customHtml : ''}</td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>
            ${realQueueHTML}
        </div>

        <div class="panel" style="border-top: 4px solid #10b981;">
            <h2>🛠️ 自定义报文生成器</h2>
            <div style="margin-bottom: 10px; font-size: 0.85rem; color: #4b5563;">自由选择人员和日期，生成特定组合的提交报文用于测试或手动发送。</div>
            <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:15px;">
                <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                    <strong>📅 起止日期:</strong>
                    <input type="date" id="customStartDate-${loc}" style="padding:6px; border-radius:4px; border:1px solid #ccc; flex:1; min-width:120px;">
                    <span style="color:#64748b; font-weight:bold;">至</span>
                    <input type="date" id="customEndDate-${loc}" style="padding:6px; border-radius:4px; border:1px solid #ccc; flex:1; min-width:120px;">
                </div>
                <div>
                    <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                        <strong>👥 选择人员:</strong>
                        <button type="button" onclick="selectAllPersons('${loc}')" style="padding:2px 10px; background:#f3f4f6; border:1px solid #d1d5db; border-radius:5px; cursor:pointer; font-size:0.8rem; color:#374151;">全选</button>
                        <button type="button" onclick="invertPersons('${loc}')" style="padding:2px 10px; background:#f3f4f6; border:1px solid #d1d5db; border-radius:5px; cursor:pointer; font-size:0.8rem; color:#374151;">反选</button>
                    </div>
                    <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:8px; background:#f9fafb; padding:10px; border-radius:6px; border:1px solid #e5e7eb;">${personCheckboxes}</div>
                </div>
                <button onclick="generateCustom('${loc}')" style="padding:8px 15px; background:#10b981; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold; align-self:flex-start;">⚡ 立即生成报文</button>
            </div>
            <div id="customResult-${loc}" style="display:none;"></div>
        </div>

        <div class="panel" style="border-top: 4px solid #f59e0b; background: linear-gradient(to bottom, #ffffff, #fffbeb); margin-bottom: 20px;">
            <h2><span>⏳ [智能拼车] 「审核中」单据一键扫描与重推</span><span style="background:#fef3c7; color:#d97706; padding:2px 8px; border-radius:99px; font-size:0.75rem; border:1px solid #fde047; font-weight:normal;">⚡ 零耗时 / 内存无损解析</span></h2>
            <div style="margin-bottom: 12px; font-size: 0.85rem; color: #4b5563; line-height: 1.5;">针对部分单据卡在 <code>flowStatus === '1' (审核中)</code> 状态未同步通过的问题，系统已在底层数据拉取时<b>零额外服务器开销</b>地过滤了所有待办人员，并严格按照<b>「到访时间 + 接待人规则」</b>压缩并整合为最少数量的数据包。</div>
            <div style="display:flex; justify-content:space-between; align-items:center; background: #fef3c7; padding:12px 16px; border-radius:8px; border:1px solid #fde047; margin-bottom:15px; flex-wrap:wrap; gap:10px;">
                <div style="color:#92400e; font-size: 0.9rem;">🎯 内存扫描发现 <b>${pendingPlan.totalPendingCount}</b> 人次处于审核中，智能整合为 <b>${pendingPlan.requests.length}</b> 个最优数据包</div>
                <button onclick="togglePendingBox('${loc}')" id="btn-toggle-pending-${loc}" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 0.85rem; font-weight: bold; cursor: pointer; box-shadow: 0 2px 4px rgba(217,119,6,0.25); transition: all 0.2s;">⚡ 一键生成并展开整合包 (${pendingPlan.requests.length})</button>
            </div>
            <div id="pending-box-${loc}" style="display: none; animation: fadeIn 0.3s ease;">
                ${pendingPlan.requests.length > 0 ? `<div style="display:flex; justify-content:flex-end; margin-bottom:10px;"><button onclick="sendAllBatch(this, '${loc}')" class="batch-send-btn-pending" style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 0.85rem; font-weight: bold; cursor: pointer; box-shadow: 0 2px 4px rgba(239,68,68,0.25);">🚀 一键重推全部审核中数据包 (${pendingPlan.requests.length})</button></div>${renderRequests(pendingPlan.requests, loc)}` : `<div style="padding:25px; text-align:center; background:#fff; border:1px dashed #fcd34d; border-radius:8px; color:#b45309; font-size:0.9rem;">🎉 <b>太棒了！</b>当前该厂区所有有效名单中，没有任何滞留在「审核中」状态的单据！</div>`}
            </div>
        </div>

        <div class="panel" style="border-top: 4px solid #9333ea;">
            <h2>🔮 全员无记录模拟 (Force Sync)</h2>
            <p style="font-size:0.8rem; color:#666; margin-bottom:10px;">假设数据库清空，系统将从“今天”开始生成完整对齐计划。（此区域仅为逻辑验证，不受熔断影响）</p>
            ${renderRequests(simulatedPlan.requests, loc)}
        </div>
    `;
}

// 异步加载某厂区的数据，填充骨架
async function loadLocData(loc) {
    if (loadedLocs[loc]) return;
    const container = document.getElementById('content-' + loc);
    try {
        const res = await fetch(API_BASE + '/debug-content?loc=' + loc);
        const data = await res.json();
        if (data.error) {
            container.innerHTML = '<div class="error-banner" style="margin-top:10px;">❌ 加载失败: ' + data.error + '</div>';
        } else {
            container.innerHTML = renderDebugContent(data);
            loadedLocs[loc] = true;
        }
    } catch (err) {
        container.innerHTML = '<div class="error-banner" style="margin-top:10px;">❌ 网络请求异常: ' + err.message + '</div>';
    }
}

function switchLoc(loc, btn) {
    document.querySelectorAll('.loc-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.loc-tab').forEach(el => el.classList.remove('active'));
    document.getElementById('content-' + loc).classList.add('active');
    btn.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadLocData(loc);
}

function copyText(btn, text) {
    navigator.clipboard.writeText(decodeURIComponent(text)).then(() => {
        const original = btn.innerText; btn.innerText = 'Copied!'; setTimeout(() => btn.innerText = original, 2000);
    });
}

function switchTab(btn, index) {
    const parent = btn.closest('.code-section');
    parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    parent.querySelectorAll('.code-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    parent.querySelectorAll('.code-content')[index].classList.add('active');
}

function togglePendingBox(loc) {
    const box = document.getElementById('pending-box-' + loc);
    const btn = document.getElementById('btn-toggle-pending-' + loc);
    if (box.style.display === 'none') {
        box.style.display = 'block';
        btn.innerHTML = '🔼 收起「审核中」整合包';
        btn.style.background = 'linear-gradient(135deg, #64748b, #475569)';
    } else {
        box.style.display = 'none';
        btn.innerHTML = '⚡ 一键生成并展开整合包';
        btn.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
    }
}

function selectAllPersons(loc) {
    document.querySelectorAll('.person-cb-' + loc).forEach(cb => cb.checked = true);
}

function invertPersons(loc) {
    document.querySelectorAll('.person-cb-' + loc).forEach(cb => cb.checked = !cb.checked);
}

async function generateCustom(loc) {
    const startInput = document.getElementById('customStartDate-' + loc).value;
    let endInput = document.getElementById('customEndDate-' + loc).value;
    if (!startInput) return alert('至少需要选择一个开始日期哦！');
    let isSingleDay = false;
    if (!endInput) { endInput = startInput; isSingleDay = true; }
    const startTs = new Date(startInput + 'T00:00:00+08:00').getTime();
    const endTs = new Date(endInput + 'T00:00:00+08:00').getTime();
    if (startTs > endTs) return alert('结束日期不能早于开始日期哦！');
    const cbs = document.querySelectorAll('.person-cb-' + loc + ':checked');
    const ids = Array.from(cbs).map(cb => cb.value);
    if (ids.length === 0) return alert('请至少选择一个人');
    const btn = document.querySelector('#content-' + loc + ' button[onclick^="generateCustom"]');
    const oldText = btn.innerText;
    btn.innerText = "数据生成中...";
    try {
        const res = await fetch(API_BASE + '/generate-payload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ loc, ids, startTs, endTs })
        });
        const data = await res.json();
        if (data.error) {
            alert(data.error);
        } else {
            const resultDiv = document.getElementById('customResult-' + loc);
            let html = '';
            if (data.requests.length > 0) {
                html += '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; background: linear-gradient(to right, #eff6ff, #e0e7ff); padding:12px 18px; border-radius:10px; border:1px solid #bfdbfe; box-shadow: 0 2px 4px rgba(0,0,0,0.02);"><div style="color:#1e40af; font-size: 0.95rem;"><strong style="font-size: 1.1rem;">✨ 报文就绪</strong><br>共生成 <b>' + data.requests.length + '</b> 个数据包，点击右侧即可自动化批量提交</div><button onclick="sendAllBatch(this, \'' + loc + '\')" style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; border: none; padding: 10px 20px; border-radius: 8px; font-size: 0.95rem; font-weight: bold; cursor: pointer; box-shadow: 0 4px 6px rgba(37,99,235,0.25); transition: all 0.2s ease;">🚀 一键发送全部</button></div>';
            }
            html += renderRequests(data.requests, loc);
            resultDiv.innerHTML = html;
            if (isSingleDay) {
                resultDiv.insertAdjacentHTML('afterbegin', '<div style="background:#fef9c3; color:#b45309; padding:8px; border-radius:6px; margin-bottom:10px; font-size:0.85rem; text-align:center; border:1px solid #fde047;">ℹ️ 未选择结束日期，已默认生成单日（1天）的报文</div>');
            }
            resultDiv.querySelectorAll('details').forEach(d => d.open = true);
            resultDiv.style.display = 'block';
        }
    } catch (err) {
        alert("网络错误：" + err.message);
    } finally {
        btn.innerText = oldText;
    }
}

async function sendAllBatch(mainBtn, loc) {
    const container = mainBtn.closest('.card') || document.getElementById('customResult-' + loc);
    const btns = Array.from(container.querySelectorAll('.batch-send-btn, .send-btn'));
    if (btns.length === 0) return alert('当前面板下没有找到可发送的数据包');
    const pwd = prompt("⚠️ 批量发送确认\n即将为您自动发送这 " + btns.length + " 个数据包。\n为了防止触发风控，每个请求之间会强制间隔 1.8 秒。\n\n请输入操作密码：");
    if (!pwd) return;
    mainBtn.innerText = "🚀 队列自动发送中...";
    mainBtn.disabled = true;
    mainBtn.style.opacity = "0.7";
    for (let i = 0; i < btns.length; i++) {
        const b = btns[i];
        if (b.innerText.includes("✅")) continue;
        b.innerText = "发送中...";
        b.style.background = "linear-gradient(135deg, #f59e0b, #d97706)";
        try {
            const res = await fetch(API_BASE + '/manual-send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    loc: b.getAttribute('data-loc'),
                    targetDate: b.getAttribute('data-date'),
                    people: b.getAttribute('data-people'),
                    encodedBody: decodeURIComponent(b.getAttribute('data-encoded')),
                    pwd: pwd
                })
            });
            const data = await res.json();
            if (data.success) { b.innerText = "✅ 成功"; b.style.background = "linear-gradient(135deg, #10b981, #059669)"; }
            else { b.innerText = "❌ 失败: " + data.msg; b.style.background = "linear-gradient(135deg, #ef4444, #dc2626)"; }
        } catch (e) { b.innerText = "❌ 网络异常"; b.style.background = "linear-gradient(135deg, #ef4444, #dc2626)"; }
        await new Promise(r => setTimeout(r, 5000));
    }
    mainBtn.innerText = "✅ 批量发送完成";
    mainBtn.style.background = "linear-gradient(135deg, #10b981, #059669)";
    mainBtn.style.opacity = "1";
}

async function sendPayload(event, loc, targetDate, people, encodedBodyURI) {
    event.preventDefault();
    event.stopPropagation();
    const pwd = prompt("⚠️ 危险操作确认\n即将为 [" + loc + "] 的 [" + people + "] 提交 [" + targetDate + "] 的入厂申请。\n\n请输入操作密码：");
    if (!pwd) return;
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = "正在发送中...";
    btn.style.background = "linear-gradient(135deg, #f59e0b, #d97706)";
    btn.disabled = true;
    try {
        const res = await fetch(API_BASE + '/manual-send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ loc, targetDate, people, encodedBody: decodeURIComponent(encodedBodyURI), pwd })
        });
        const data = await res.json();
        if (data.success) {
            alert("✅ 发送成功！\n实例ID: " + data.id);
            btn.innerText = "已发送成功";
            btn.style.background = "linear-gradient(135deg, #10b981, #059669)";
        } else {
            alert("❌ 发送失败！\n原因: " + data.msg);
            btn.innerText = originalText;
            btn.style.background = "linear-gradient(135deg, #ef4444, #dc2626)";
            btn.disabled = false;
        }
    } catch (e) {
        alert("❌ 网络异常: " + e.message);
        btn.innerText = originalText;
        btn.style.background = "linear-gradient(135deg, #ef4444, #dc2626)";
        btn.disabled = false;
    }
}

// 初始化：拉取厂区列表，渲染 tab 和骨架
window.onload = async () => {
    locs = await fetch(API_BASE + '/config').then(r => r.json());
    if (locs.length === 0) { document.getElementById('contents').innerHTML = '没有开启的厂区配置'; return; }

    document.getElementById('tabs').innerHTML = locs.map((l, i) =>
        `<button class="tab loc-tab ${i === 0 ? 'active' : ''}" onclick="switchLoc('${l.loc}', this)">🏢 ${l.title}</button>`
    ).join('');

    document.getElementById('contents').innerHTML = locs.map((l, i) =>
        `<div id="content-${l.loc}" class="loc-content ${i === 0 ? 'active' : ''}"><div style="padding: 60px 20px; text-align: center; color: #64748b; font-weight: bold; background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.05); margin-top: 10px;"><div style="font-size: 2rem; margin-bottom: 15px; animation: pulse 1.5s infinite;">⏳</div><div style="font-size: 1.1rem;">正在前往 ${l.loc} 厂区拉取底层数据...</div><div style="font-size: 0.85rem; opacity: 0.7; margin-top: 8px;">根据名单人数，可能需要几秒钟时间，请稍候</div></div></div>`
    ).join('');

    loadLocData(locs[0].loc);
};
