#!/usr/bin/env node
/**
 * scripts/new-app.js —— 脚手架：一键生成一个新"大类"的标准骨架
 *
 * 用法:
 *   node scripts/new-app.js <大类名> [--api]
 *   npm run new:app -- <大类名> [--api]
 *
 * 例子:
 *   npm run new:app -- Material          生成完整业务骨架(config/service/routes/view)
 *   npm run new:app -- Notify --api      生成纯接口骨架(config/service/routes，无 view)
 *
 * 生成后按提示在 index.js 里挂载一行即可。
 */
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const isApi = args.includes('--api');
const name = args.find(a => !a.startsWith('--'));

if (!name) {
    console.error('❌ 缺少大类名。用法: npm run new:app -- <大类名> [--api]');
    process.exit(1);
}

if (!/^[A-Za-z][A-Za-z0-9]*$/.test(name)) {
    console.error(`❌ 大类名 "${name}" 不合法，请用纯英文（建议大驼峰，如 Material）。`);
    process.exit(1);
}

const appDir = path.join(__dirname, '..', 'src', name);
if (fs.existsSync(appDir)) {
    console.error(`❌ src/${name} 已存在，请换个名字或先删除。`);
    process.exit(1);
}

const dirs = isApi ? ['config', 'service', 'routes'] : ['config', 'service', 'routes', 'view'];
dirs.forEach(d => fs.mkdirSync(path.join(appDir, d), { recursive: true }));

const write = (sub, content) => fs.writeFileSync(path.join(appDir, sub, name + '.js'), content, 'utf-8');

// config / service 始终生成（纯 API 也有）
write('config', `// ${name} 配置：放常量、接口地址、账号等\nmodule.exports = {\n    // 在这里填配置\n};\n`);
write('service', `// ${name} 业务逻辑：放查数据、计算、请求第三方等纯逻辑（不要碰 req/res）\nconst doSomething = async (params) => {\n    // 在这里写业务逻辑\n    return {};\n};\n\nmodule.exports = { doSomething };\n`);

// view 仅在有页面的业务生成
if (!isApi) {
    write('view', `// ${name} 页面：放「拼 HTML 字符串」的函数\nconst renderPage = () => {\n    return '<!DOCTYPE html><html><body><h1>${name}</h1></body></html>';\n};\n\nmodule.exports = { renderPage };\n`);
}

const routesHint = isApi ? '' :
    `// const { doSomething } = require('../service/${name}');\n// const { renderPage } = require('../view/${name}');\n// const CONFIG = require('../config/${name}');\n`;

write('routes', `// ${name} 路由：只做「接请求 → 调 service/view → 返回」\nconst express = require('express');\nconst router = express.Router();\n${routesHint}\nrouter.get('/', async (req, res) => {\n    res.json({ message: '${name} 模块已就绪' });\n});\n\nmodule.exports = router;\n`);

console.log(`✅ 已生成大类骨架 src/${name}/：`);
dirs.forEach(d => console.log(`   src/${name}/${d}/${name}.js`));
console.log('');
console.log('下一步：在 index.js 里挂载一行（按大类归位）：');
console.log(`   app.use('/${name}', require('./src/${name}/routes/${name}'));`);
console.log('');
console.log(`然后填 config（配置）、service（逻辑）、routes（接口）${isApi ? '' : '、view（页面）'} 即可。`);
