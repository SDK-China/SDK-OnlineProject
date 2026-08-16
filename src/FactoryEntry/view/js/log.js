            let allLogs = [];
            let selectedLogs = new Set(); // 🌟 [新增] 全局管理选中的键集合

            // 🌟 [新增] 处理单行勾选
            function toggleLogSelect(e, key) {
                e.stopPropagation(); 
                if (e.target.checked) selectedLogs.add(key);
                else selectedLogs.delete(key);
                updateBulkActionBar();
                
                // 判断是否已经手动全选了
                const checkboxes = document.querySelectorAll('.log-checkbox');
                const allChecked = Array.from(checkboxes).every(cb => cb.checked);
                document.getElementById('selectAllCb').checked = (checkboxes.length > 0 && allChecked);
            }

            // 🌟 [新增] 处理全选/全不选
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

            // 🌟 [新增] 动态呼出/隐藏底部悬浮操作栏
            function updateBulkActionBar() {
                const count = selectedLogs.size;
                const bar = document.getElementById('bulkActionBar');
                const countTxt = document.getElementById('bulkCount');
                if (count > 0) {
                    countTxt.innerText = count;
                    bar.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
                    bar.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
                } else {
                    bar.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
                    bar.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
                }
            }

            // 🌟 [新增] 单个日志删除 API 调用
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
                        updateBulkActionBar();
                        fetchLogs(); // 重新加载数据
                    } else { alert(json.msg); }
                } catch (e) { alert('网络异常'); }
            }

            // 🌟 [新增] 批量选中日志删除 API 调用
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
                        selectedLogs.clear();
                        document.getElementById('selectAllCb').checked = false; // 取消全选高亮
                        updateBulkActionBar();
                        fetchLogs(); 
                    }
                } catch (e) { alert('网络异常'); }
            }

            function getTodayStr() { return new Date().toISOString().split('T')[0]; }

            async function fetchLogs() {
                const container = document.getElementById('logContainer');
                
                // 👇 注意：这里已经为您加上了反斜杠转义 `，编辑器不会再报错了
                container.innerHTML = `
                <div class="bg-white p-6 rounded-xl border border-blue-100 shadow-sm text-center">
                    <div class="text-blue-500 font-bold mb-3 text-lg" id="loadingTitle">⚖️ 正在探测数据库并智能称重分包...</div>
                    <div class="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
                        <div class="bg-blue-500 h-3 rounded-full transition-all duration-300" id="loadingBar" style="width: 0%"></div>
                    </div>
                    <div class="text-gray-400 text-sm font-mono" id="loadingSub">正在构建极速下载通道</div>
                </div>`;
                
                try {
                    // 1. 获取称重后的打包计划
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

                    // 👇 变量插值也加上了转义 ${}
                    titleEl.innerText = `📦 系统已将数据智能切分为 ${chunks.length} 个极限体积包，开始拉取...`;
                    
                    allLogs = [];
                    
                    // 2. 🚀 多车道并发拉取数据（火力全开）
                    let completedChunks = 0;
                    
                    // 把所有请求一次性全部扔出去
                    const fetchPromises = chunks.map(async (chunk) => {
                        const batchRes = await fetch('/FactoryEntry/Log/api/log-batch', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ keys: chunk })
                        });
                        const batchData = await batchRes.json();
                        
                        // 只要有任何一辆"车"拉着数据回来了，就更新一次进度条
                        completedChunks++;
                        const percent = Math.round((completedChunks / chunks.length) * 100);
                        barEl.style.width = `${percent}%`;
                        subEl.innerText = `⚡ 并发极速拉取: 已就位 [${completedChunks} / ${chunks.length}] - 进度 ${percent}%`;

                        if (batchData.success) {
                            return batchData.data;
                        } else {
                            console.error("某批次拉取失败:", batchData.msg);
                            return [];
                        }
                    });

                    // 瞬间等待所有"车"全部归队
                    const results = await Promise.all(fetchPromises);
                    
                    // 将所有数据合并装车
                    results.forEach(dataArray => {
                        allLogs.push(...dataArray);
                    });

                    // 3. 组装完毕
                    subEl.innerText = "✅ 数据 100% 拉取完毕，正在渲染界面...";
                    setTimeout(() => { renderLogs(); }, 300);

                } catch (e) {
                    container.innerHTML = `<div class="text-center text-red-500 py-10 bg-white rounded-xl border border-red-100">❌ 加载失败: ${e.message}</div>`;
                }
            }

            function formatPayload(log) {
                const data = log.data;
                if (!data) return '<div class="text-gray-500 text-sm italic">该日志不包含详细数据体</div>';

                // 🌟 辅助函数：把名字后面跟着的冗长提示，转化为精致的高颜值 UI 徽章
                const renderPeopleWithBadge = (peopleStr) => {
                    if (!peopleStr) return '未知';
                    let badge = '';
                    let name = peopleStr;
                    
                    if (peopleStr.indexOf('(🚀 独立专单') > -1) {
                        const match = peopleStr.match(/\(🚀 独立专单 -> 接待人: (.*?)\)/);
                        if (match) {
                            badge = '<span class="bg-purple-100 text-purple-700 border border-purple-200 text-[10px] px-2 py-0.5 rounded shadow-sm ml-2 font-bold tracking-wide">🎯 专属接待: ' + match[1] + '</span>';
                            name = peopleStr.replace(/\(🚀 独立专单 -> 接待人: .*?\)/, '').trim();
                        }
                    } else if (peopleStr.indexOf('(🏢 常规大部队拼车)') > -1) {
                        badge = '<span class="bg-indigo-50 text-indigo-600 border border-indigo-200 text-[10px] px-2 py-0.5 rounded shadow-sm ml-2 font-bold tracking-wide">🏢 大部队拼车</span>';
                        name = peopleStr.replace(/\(🏢 常规大部队拼车\)/, '').trim();
                    }
                    
                    return '<span class="font-medium text-gray-200">' + name + '</span> ' + badge;
                };

                try {
                    if (log.action === 'UI生成') {
                        if (!Array.isArray(data)) throw new Error('Data is not an array');
                        let html = '<div class="space-y-4">';
                        data.forEach((req, i) => {
                            // 👇 注意这里的反引号和 $ 均已转义，修复了报错
                            html += `
                            <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
                                <div class="flex items-center gap-3 mb-2 pb-2 border-b border-gray-700">
                                    <span class="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded font-bold">📦 数据包 ${i + 1}</span>
                                    <span class="text-gray-200 text-sm font-medium">📅 ${req.targetDate || '未知'}</span>
                                </div>
                                <div class="text-sm mb-3 flex items-center flex-wrap">
                                    <span class="mr-1 text-gray-400">👥</span> ${renderPeopleWithBadge(req.people)}
                                </div>
                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div class="bg-gray-900 rounded border border-gray-700">
                                        <div class="flex justify-between items-center bg-gray-800 px-3 py-1.5 rounded-t">
                                            <span class="text-xs text-orange-300 font-mono">Encoded Body (最终发包)</span>
                                            <button onclick="copyRaw(event, '${encodeURIComponent(req.encodedBody || '')}')" class="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-1 rounded transition">复制</button>
                                        </div>
                                        <div class="p-3 text-xs text-gray-300 break-all h-32 overflow-y-auto">${req.encodedBody || '无数据'}</div>
                                    </div>
                                    <div class="bg-gray-900 rounded border border-gray-700">
                                        <div class="flex justify-between items-center bg-gray-800 px-3 py-1.5 rounded-t">
                                            <span class="text-xs text-green-300 font-mono">Raw JSON (明文结构)</span>
                                            <button onclick="copyRaw(event, '${encodeURIComponent(req.rawJson || '')}')" class="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-1 rounded transition">复制</button>
                                        </div>
                                        <div class="p-3 text-xs text-gray-300 whitespace-pre overflow-x-auto h-32 overflow-y-auto">${req.rawJson || '无数据'}</div>
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
                        // 👇 已转义
                        return `
                        <div class="space-y-4">
                            <div class="flex flex-col md:flex-row gap-4">
                                <div class="flex-1 bg-gray-800 rounded-lg p-4 border border-gray-700">
                                    <div class="text-gray-400 text-xs mb-2 uppercase tracking-wider">📤 提交请求</div>
                                    <div class="text-gray-200 text-sm mb-2">📅 ${req.targetDate || '未知'}</div>
                                    <div class="text-sm flex items-center flex-wrap">
                                        <span class="mr-1 text-gray-400">👥</span> ${renderPeopleWithBadge(req.people)}
                                    </div>
                                </div>
                                <div class="flex-1 ${isSuccess ? 'bg-green-900/20 border-green-800/50' : 'bg-red-900/20 border-red-800/50'} rounded-lg p-4 border">
                                    <div class="${isSuccess ? 'text-green-400' : 'text-red-400'} text-xs mb-2 uppercase tracking-wider">📥 接口响应</div>
                                    <div class="text-gray-200 text-sm mb-1">${isSuccess ? '✅ 请求成功' : '❌ 请求失败'}</div>
                                    <div class="${isSuccess ? 'text-green-300/80' : 'text-red-300/80'} text-xs font-mono">${isSuccess ? '实例ID: ' + res.id : '原因: ' + (res.msg || '未知')}</div>
                                </div>
                            </div>
                            <div class="bg-gray-900 rounded border border-gray-700">
                                <div class="flex justify-between items-center bg-gray-800 px-3 py-1.5 rounded-t">
                                    <span class="text-xs text-orange-300 font-mono">Encoded Body (当时发的包)</span>
                                    <button onclick="copyRaw(event, '${encodeURIComponent(req.encodedBody || '')}')" class="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-1 rounded transition">复制</button>
                                </div>
                                <div class="p-3 text-xs text-gray-300 break-all h-28 overflow-y-auto">${req.encodedBody || '无数据'}</div>
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
                                // 🌟 核心：把两种数据都取出来
                                let rawJson = d.payload && d.payload.rawJson ? d.payload.rawJson : '无明文数据';
                                let encoded = d.payload && d.payload.encodedBody ? d.payload.encodedBody : '无真正发包数据';
                                
                                let icon = d.success ? '✅' : '❌';
                                let color = d.success ? 'text-green-400' : 'text-red-400';
                                
                                listStr += '<details class="bg-gray-800 rounded border border-gray-700 overflow-hidden outline-none mb-3">' +
                                    '<summary class="px-3 py-2 cursor-pointer hover:bg-gray-700 text-xs text-gray-300 flex justify-between items-center outline-none select-none">' +
                                        '<div class="flex items-center gap-2">' +
                                            '<span class="' + color + ' font-bold">' + icon + '</span>' +
                                            '<span class="bg-gray-900 px-2 py-0.5 rounded text-gray-400">' + d.loc + '</span>' +
                                            '<span>' + d.date + '</span>' +
                                            '<span class="text-gray-400">|</span>' +
                                            '<span>' + renderPeopleWithBadge(d.people) + '</span>' +
                                        '</div>' +
                                        '<span class="text-gray-500 hover:text-white transition">查看双重底包 ▼</span>' +
                                    '</summary>' +
                                    '<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 p-3 border-t border-gray-700 bg-gray-900">' +
                                        // 🌟 左侧：展示真正发出去的 URL-Encoded 报文
                                        '<div class="bg-gray-950 rounded border border-gray-700">' +
                                            '<div class="flex justify-between items-center bg-gray-800 px-3 py-1.5 rounded-t">' +
                                                '<span class="text-xs text-orange-300 font-mono">Encoded Body (真正发出去的数据)</span>' +
                                                '<button onclick="copyRaw(event, \'' + encodeURIComponent(encoded) + '\')" class="text-[10px] bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-1 rounded transition">复制</button>' +
                                            '</div>' +
                                            '<div class="p-3 text-[11px] text-gray-300 break-all h-32 overflow-y-auto font-mono">' + encoded + '</div>' +
                                        '</div>' +
                                        // 🌟 右侧：展示用来查看结构的原始 JSON
                                        '<div class="bg-gray-950 rounded border border-gray-700">' +
                                            '<div class="flex justify-between items-center bg-gray-800 px-3 py-1.5 rounded-t">' +
                                                '<span class="text-xs text-green-300 font-mono">Raw JSON (原始明文结构)</span>' +
                                                '<button onclick="copyRaw(event, \'' + encodeURIComponent(rawJson) + '\')" class="text-[10px] bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-1 rounded transition">复制</button>' +
                                            '</div>' +
                                            '<div class="p-3 text-[11px] text-gray-300 whitespace-pre overflow-x-auto h-32 overflow-y-auto font-mono">' + rawJson + '</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</details>';
                            }
                            detailsHtml = '<div class="mt-4 border-t border-gray-700 pt-3">' +
                                '<div class="text-gray-400 text-xs mb-2 font-bold">📦 底层发包数据切片 (' + details.length + '个):</div>' +
                                '<div class="space-y-2">' + listStr + '</div></div>';
                        }

                        // 👇 已转义
                        return `
                        <div class="bg-gray-950 p-4 rounded-lg border border-gray-800 shadow-inner">
                            <div class="text-gray-500 text-xs mb-2 font-mono flex justify-between items-center">
                                <span>[Cron Job Console Output]</span>
                                <button onclick="copyRaw(event, '${encodeURIComponent(report)}')" class="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded transition">复制文本</button>
                            </div>
                            <div class="text-sm text-emerald-400 whitespace-pre font-mono overflow-x-auto leading-relaxed">${report}</div>
                            ${detailsHtml}
                        </div>`;
                    }

                    return `<pre><code class="language-json text-sm rounded-lg border border-gray-700">${JSON.stringify(data, null, 2)}</code></pre>`;

                } catch (e) {
                    return `<pre><code class="language-json text-sm rounded-lg border border-gray-700">${JSON.stringify(data, null, 2)}</code></pre>`;
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
                    container.innerHTML = '<div class="text-center text-gray-400 py-10 bg-white rounded-xl border border-dashed border-gray-300">没有找到对应的日志记录哦</div>';
                    return;
                }

                container.innerHTML = filtered.map((log, i) => {
                    let badgeColor = "bg-gray-100 text-gray-700";
                    if(log.action === "自动续期") badgeColor = "bg-purple-100 text-purple-700 border border-purple-200";
                    if(log.action === "UI生成") badgeColor = "bg-blue-100 text-blue-700 border border-blue-200";
                    if(log.action === "手动发送") badgeColor = "bg-emerald-100 text-emerald-700 border border-emerald-200";

                    return `
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative group">
                        <div class="p-3 md:p-4 flex items-start justify-between log-card cursor-pointer bg-white hover:bg-blue-50/30 transition-colors" onclick="toggleDetails(${i})">
                            
                            <div class="flex items-start gap-3 w-full pr-8">
                                
                                <div class="flex-shrink-0 flex items-center mt-[3px] md:mt-1" onclick="event.stopPropagation()">
                                    <input type="checkbox" class="log-checkbox w-4 h-4 text-blue-600 rounded border-gray-300 shadow-sm focus:ring-blue-500 cursor-pointer" value="${log.key}" ${selectedLogs.has(log.key) ? 'checked' : ''} onclick="toggleLogSelect(event, '${log.key}')">
                                </div>
                                
                                <div class="flex flex-col flex-1 gap-1.5 min-w-0">
                                    
                                    <div class="flex items-center gap-2 flex-wrap">
                                        <div class="px-2 py-0.5 rounded text-[11px] md:text-xs font-bold ${badgeColor}">${log.action}</div>
                                        <div class="font-bold text-gray-800 text-sm tracking-wide">🏢 ${log.location}</div>
                                        <div class="font-mono text-[11px] md:text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">🕒 ${log.time.replace('_', ' ')}</div>
                                    </div>
                                    
                                    <div class="text-gray-600 text-sm md:text-[14.5px] font-medium leading-relaxed line-clamp-2 md:line-clamp-1 break-words">
                                        ${log.summary}
                                    </div>
                                    
                                </div>
                            </div>
                            
                            <button onclick="deleteSingle(event, '${log.key}')" class="absolute right-3 top-3 md:right-4 md:top-4 text-gray-400 md:text-gray-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition md:opacity-0 group-hover:opacity-100" title="删除此记录">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                        
                        <div id="details-${i}" class="log-details bg-gray-900 border-t border-gray-200">
                            <div class="flex border-b border-gray-700 bg-gray-800/50 px-4 pt-2 gap-4">
                                <button class="tab-btn active pb-2 text-sm text-gray-400 hover:text-gray-200" onclick="switchView(event, ${i}, 'pretty')">✨ 智能排版视图</button>
                                <button class="tab-btn pb-2 text-sm text-gray-400 hover:text-gray-200" onclick="switchView(event, ${i}, 'raw')">⚙️ 原始 JSON 树</button>
                            </div>
                            <div class="p-4">
                                <div id="view-pretty-${i}" class="block">${formatPayload(log)}</div>
                                <div id="view-raw-${i}" class="hidden relative">
                                    <button onclick="copyRaw(event, '${encodeURIComponent(JSON.stringify(log.data, null, 2))}')" class="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded text-xs">复制整树</button>
                                    <pre><code class="language-json text-sm rounded-lg border border-gray-700">${JSON.stringify(log.data, null, 2)}</code></pre>
                                </div>
                            </div>
                        </div>
                    </div>`;
                }).join('');
            }

            // 🌟 升级版：点开面板时，再懒加载执行该面板内的高亮任务 (瞬间提升全局流畅度)
            function toggleDetails(index) {
                const detailsBox = document.getElementById('details-' + index);
                detailsBox.classList.toggle('open');
                
                // 只有当面板被展开，且还没被高亮过时，才执行高亮
                if (detailsBox.classList.contains('open') && !detailsBox.dataset.highlighted) {
                    detailsBox.querySelectorAll('.language-json').forEach(el => {
                        // 稍微延迟 10 毫秒让面板展开动画先执行，防止动画卡顿
                        setTimeout(() => hljs.highlightElement(el), 10);
                    });
                    detailsBox.dataset.highlighted = "true"; // 标记为已高亮，下次点开就不重复算了
                }
            }

            function switchView(event, index, type) {
                const detailsContainer = document.getElementById('details-' + index);
                detailsContainer.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active', 'text-blue-500'));
                event.target.classList.add('active', 'text-blue-500');
                
                detailsContainer.querySelector('#view-pretty-' + index).classList.toggle('hidden', type !== 'pretty');
                detailsContainer.querySelector('#view-pretty-' + index).classList.toggle('block', type === 'pretty');
                
                const rawView = detailsContainer.querySelector('#view-raw-' + index);
                rawView.classList.toggle('hidden', type !== 'raw');
                rawView.classList.toggle('block', type === 'raw');

                // 如果切换到了“原始 JSON 树”视图，且还没高亮过，立即高亮
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
                    btn.classList.add('bg-green-600', 'text-white');
                    setTimeout(() => {
                        btn.innerText = oldTxt;
                        btn.classList.remove('bg-green-600', 'text-white');
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
