// 自动续期控制台前端逻辑（SSE 实时流 + 干跑模式）
const API_BASE = '/FactoryEntry/Report';
let es = null;

async function init() {
    const locs = await fetch(API_BASE + '/config').then(r => r.json());
    document.getElementById('locFilter').innerHTML = '<option value="">全部厂区</option>' +
        locs.map(l => `<option value="${l.loc}">${l.title}</option>`).join('');
}

function startAuto(dryRun) {
    if (!dryRun) {
        // 前端防误点：真实续期需输密码 123123（仅前端校验，后端接口本身无密码）
        const pwd = prompt('⚠️ 真实续期会真实上传数据！请输入操作密码：');
        if (pwd !== '123123') { alert('密码错误，已取消'); return; }
    }
    if (es) es.close();

    document.getElementById('log').innerHTML = '';
    document.getElementById('results').innerHTML = '';
    document.getElementById('status').innerHTML = dryRun ? '🧪 干跑模拟中...' : '🚀 真实发包中...';

    const loc = document.getElementById('locFilter').value;
    const params = [];
    if (dryRun) params.push('dryRun=1');
    if (loc) params.push('loc=' + encodeURIComponent(loc));
    const url = API_BASE + '/auto-renew' + (params.length ? '?' + params.join('&') : '');

    es = new EventSource(url);

    es.addEventListener('log', e => {
        const d = JSON.parse(e.data);
        const div = document.createElement('div');
        div.className = 'log-line';
        div.textContent = d.message;
        const logBox = document.getElementById('log');
        logBox.appendChild(div);
        logBox.scrollTop = logBox.scrollHeight;
    });

    es.addEventListener('result', e => {
        const r = JSON.parse(e.data);
        const div = document.createElement('div');
        div.className = 'result-item ' + (r.success ? 'ok' : 'fail');
        const icon = r.success ? '✅' : '❌';
        const idPart = r.success ? `（ID: ${r.id}）` : '';
        div.textContent = `${icon} [${r.loc}] ${r.date} · ${r.names} · 耗时 ${r.costSeconds}s ${idPart}`;
        document.getElementById('results').appendChild(div);
    });

    es.addEventListener('done', e => {
        document.getElementById('status').innerHTML = '✅ 流程结束';
        es.close();
        es = null;
    });

    es.addEventListener('error', () => {
        document.getElementById('status').innerHTML = '❌ 连接出错或中断';
    });
}

window.onload = init;
