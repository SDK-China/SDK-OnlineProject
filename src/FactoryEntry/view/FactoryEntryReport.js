// 视图渲染 (Debug 前端页面 + 请求包 HTML 渲染)
const { LOC_CONFIGS } = require('../config/FactoryEntryReport');

// --- SPA 极速单页面 Debug 界面 (前端秒开骨架屏版) ---
function renderDebugPage() {
    const locs = Object.keys(LOC_CONFIGS).filter(k => LOC_CONFIGS[k].enabled);
    if (locs.length === 0) return null;

    const tabsHtml = locs.map((loc, i) =>
        `<button class="tab loc-tab ${i === 0 ? 'active' : ''}" onclick="switchLoc('${loc}', this)">🏢 ${LOC_CONFIGS[loc].title}</button>`
    ).join('');

    // 👇 返回给浏览器的是极速空壳骨架，不带阻塞查询
    const contentsHtml = locs.map((loc, i) => `
        <div id="content-${loc}" class="loc-content ${i === 0 ? 'active' : ''}">
            <div style="padding: 60px 20px; text-align: center; color: #64748b; font-weight: bold; background: #fff; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.05); margin-top: 10px;">
                <div style="font-size: 2rem; margin-bottom: 15px; animation: pulse 1.5s infinite;">⏳</div>
                <div style="font-size: 1.1rem;">正在前往 ${loc} 厂区拉取底层数据...</div>
                <div style="font-size: 0.85rem; opacity: 0.7; margin-top: 8px;">根据名单人数，可能需要几秒钟时间，请稍候</div>
            </div>
        </div>
    `).join('');

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
        <title>申请插件调试面板</title>
        <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #f3f4f6; padding: 10px; color: #1f2937; margin:0; }
                .container { max-width: 1000px; margin: 0 auto; }
                .card { background: #fff; padding: 15px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 20px; }
                
                h1 { margin: 10px 0 20px 0; color: #111827; font-size: 1.2rem; border-left: 4px solid #3b82f6; padding-left: 10px; display: flex; align-items: center; justify-content: space-between; }
                h2 { margin-top: 0; color: #4b5563; font-size: 1rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
                
                .tabs { display: flex; gap: 8px; margin-bottom: 20px; position: sticky; top: 0; z-index: 100; background: #f3f4f6; padding: 10px 0; }
                .tab { flex: 1; text-align: center; padding: 12px 0; background: #e5e7eb; border-radius: 8px; color: #374151; font-weight: bold; cursor: pointer; transition: 0.2s; border: none;}
                .tab.active { background: #3b82f6; color: white; box-shadow: 0 2px 4px rgba(59,130,246,0.3); }
                .loc-content { display: none; }
                .loc-content.active { display: block; animation: fadeIn 0.3s ease; }
                
                @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pulse { 0% { transform: scale(0.9); opacity: 0.7; } 50% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(0.9); opacity: 0.7; } }
                
                .table-wrapper { overflow-x: auto; margin-bottom: 15px; border-radius: 8px; border: 1px solid #e5e7eb; }
                table { width: 100%; border-collapse: collapse; min-width: 500px; }
                th, td { text-align: left; padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 0.9rem; }
                th { background: #f9fafb; font-weight: 600; color: #6b7280; }
                tr:last-child td { border-bottom: none; }
                
                .status-badge { padding: 2px 8px; border-radius: 99px; font-size: 0.75rem; font-weight: 600; white-space: nowrap; }
                .expired { background: #fee2e2; color: #991b1b; }
                .warning { background: #fef3c7; color: #92400e; }
                .success { background: #d1fae5; color: #065f46; }
                
                .request-item { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 10px; overflow: hidden; }
                .req-header { padding: 12px; background: #f9fafb; display: flex; flex-direction: column; cursor: pointer; user-select: none; transition: background 0.2s; }
                .req-header:hover { background: #f3f4f6; }
                .req-header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
                .req-header-people { font-size: 0.85rem; color: #6b7280; }
                
                .code-section { border-top: 1px solid #e5e7eb; }
                
                .code-toolbar { display: flex; justify-content: space-between; align-items: center; background: #f3f4f6; border-bottom: 1px solid #e5e7eb; padding-right: 12px; }
                .code-tabs { display: flex; }
                .tab-btn { padding: 10px 15px; font-size: 0.8rem; cursor: pointer; color: #6b7280; border-right: 1px solid #e5e7eb; background: transparent; border-top: none; border-bottom: none; border-left: none; outline: none; }
                .tab-btn.active { background: #fff; color: #3b82f6; font-weight: 600; border-bottom: 2px solid #3b82f6; margin-bottom: -1px; }
                
                .send-btn { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; border: none; padding: 6px 14px; border-radius: 6px; font-size: 0.85rem; font-weight: bold; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2); }
                .send-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3); }
                .send-btn:active { transform: translateY(0); box-shadow: none; }
                .send-btn:disabled { background: #9ca3af; cursor: not-allowed; box-shadow: none; transform: none; }
                
                .code-content { padding: 0; position: relative; display: none; }
                .code-content.active { display: block; }
                
                pre { margin: 0; padding: 15px; overflow-x: auto; font-family: Consolas, monospace; font-size: 0.75rem; line-height: 1.4; color: #d4d4d4; background: #1e1e1e; max-height: 300px; }
                .copy-btn { position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.2); color: #fff; border: 1px solid rgba(255,255,255,0.3); padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 0.7rem; }
                
                details > summary { list-style: none; }
                details > summary::marker { display: none; }
                .error-banner { background: #fee2e2; border: 1px solid #fca5a5; color: #b91c1c; padding: 15px; border-radius: 8px; margin-bottom: 15px; font-weight: bold; font-size: 0.9rem; }
                .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 15px; font-size: 0.8rem; color: #666; background: #f9fafb; padding: 10px; border-radius: 8px; }
                .stat-item { text-align: center; }
                .stat-val { font-weight: bold; font-size: 1rem; color: #111827; }
                .blocked-overlay { background: #f3f4f6; border: 2px dashed #d1d5db; border-radius: 8px; padding: 30px; text-align: center; color: #4b5563; }
                
                @media (min-width: 600px) {
                    .req-header { flex-direction: row; justify-content: space-between; align-items: center; }
                    .req-header-top { margin-bottom: 0; min-width: 150px; }
                }
        </style>
        <script>
            
            // 👇 新增缓存器，点过的厂区就不会重复加载了
            const loadedLocs = {};

            // 🌟 核心：异步请求新 API，填充骨架
            async function loadLocData(loc) {
                if (loadedLocs[loc]) return; // 已加载则跳过
                
                const container = document.getElementById('content-' + loc);
                try {
                    const res = await fetch('debug-content?loc=' + loc);
                    const data = await res.json();
                    
                    if (data.error) {
                        container.innerHTML = '<div class="error-banner" style="margin-top:10px;">❌ 加载失败: ' + data.error + '</div>';
                    } else {
                        // 瞬间替换为真实的 HTML
                        container.innerHTML = data.html;
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
                
                // 触发加载数据
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
            // 🌟 [新增] 控制审核中单据面板展开收起的动效交互
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

            // 🌟 [新增] 人员选择：全选 / 反选
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
                if (!endInput) {
                    endInput = startInput; 
                    isSingleDay = true;
                }
                
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
                    const res = await fetch('generate-payload', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ loc, ids, startTs, endTs })
                    });
                    const data = await res.json();
                    
                    if (data.error) {
                        alert(data.error);
                    } else {
                        const resultDiv = document.getElementById('customResult-' + loc);
                        resultDiv.innerHTML = data.html;
                        
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
    // 🎯 核心防串升级：优先定位当前按钮所在的独立卡片容器，防止审核中数据与自定义单据互相污染
    const container = mainBtn.closest('.card') || document.getElementById('customResult-' + loc);
    
    // 智能抓取当前模块下的所有子包按钮（支持常规发包与确认发送按钮）
    const btns = Array.from(container.querySelectorAll('.batch-send-btn, .send-btn'));
    if(btns.length === 0) return alert('当前面板下没有找到可发送的数据包');
    
    const pwd = prompt("⚠️ 批量发送确认\\n即将为您自动发送这 " + btns.length + " 个数据包。\\n为了防止触发风控，每个请求之间会强制间隔 1.8 秒。\\n\\n请输入操作密码：");
    if(!pwd) return;
    
    mainBtn.innerText = "🚀 队列自动发送中...";
    mainBtn.disabled = true;
    mainBtn.style.opacity = "0.7";
    
    for(let i=0; i<btns.length; i++) {
        const b = btns[i];
        // 如果是已经成功发送的包，直接跳过，防止重复提交
        if (b.innerText.includes("✅")) continue;
        
        b.innerText = "发送中...";
        b.style.background = "linear-gradient(135deg, #f59e0b, #d97706)";
        
        try {
            const res = await fetch('manual-send', {
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
            if(data.success) {
                b.innerText = "✅ 成功";
                b.style.background = "linear-gradient(135deg, #10b981, #059669)";
            } else {
                b.innerText = "❌ 失败: " + data.msg;
                b.style.background = "linear-gradient(135deg, #ef4444, #dc2626)";
            }
        } catch(e) {
            b.innerText = "❌ 网络异常";
            b.style.background = "linear-gradient(135deg, #ef4444, #dc2626)";
        }
        
        await new Promise(r => setTimeout(r, 5000)); 
    }
    
    mainBtn.innerText = "✅ 批量发送完成";
    mainBtn.style.background = "linear-gradient(135deg, #10b981, #059669)";
    mainBtn.style.opacity = "1";
}

            async function sendPayload(event, loc, targetDate, people, encodedBodyURI) {
                event.preventDefault(); 
                event.stopPropagation();
                
                const pwd = prompt("⚠️ 危险操作确认\\n即将为 [" + loc + "] 的 [" + people + "] 提交 [" + targetDate + "] 的入厂申请。\\n\\n请输入操作密码：");
                if (!pwd) return; 

                const btn = event.target;
                const originalText = btn.innerText;
                btn.innerText = "正在发送中...";
                btn.style.background = "linear-gradient(135deg, #f59e0b, #d97706)";
                btn.disabled = true;

                try {
                    const res = await fetch('manual-send', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            loc: loc,
                            targetDate: targetDate,
                            people: people,
                            encodedBody: decodeURIComponent(encodedBodyURI),
                            pwd: pwd
                        })
                    });
                    const data = await res.json();
                    
                    if (data.success) {
                        alert("✅ 发送成功！\\n实例ID: " + data.id);
                        btn.innerText = "已发送成功";
                        btn.style.background = "linear-gradient(135deg, #10b981, #059669)";
                    } else {
                        alert("❌ 发送失败！\\n原因: " + data.msg);
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

            // 🎯 页面加载完成后，自动触发第一个厂区的数据拉取！
            window.onload = () => {
                const firstLoc = '${locs[0]}';
                if(firstLoc) loadLocData(firstLoc);
            };
            
        </script>
    </head>
    <body>
        <div class="container">
            <div class="tabs">
                ${tabsHtml}
            </div>
            ${contentsHtml}
        </div>
    </body>
    </html>
    `;
    return html;
}

function renderRequests(requests, loc) {
    if (requests.length === 0) return '<div style="padding:15px; text-align:center; color:#999; border:1px dashed #ddd; border-radius:8px; font-size:0.8rem;">无需发送数据包</div>';
    return requests.map((req, i) => `
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
                    <button class="send-btn batch-send-btn" 
                            data-loc="${loc}" 
                            data-date="${req.targetDate}" 
                            data-people="${req.people}" 
                            data-encoded="${encodeURIComponent(req.encodedBody).replace(/'/g, "%27")}"
                            onclick="sendPayload(event, '${loc}', '${req.targetDate}', '${req.people}', '${encodeURIComponent(req.encodedBody).replace(/'/g, "%27")}')">
                        🚀 确认发送该包
                    </button>
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

module.exports = { renderDebugPage, renderRequests };
