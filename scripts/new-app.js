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
 * 约定：每个大类必有 config/service/routes，有页面才多 view（view 下只放 html，css/js 进子目录）。
 * 生成后按提示在 index.js 挂载 + 加 express.static。
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
if (!isApi) {
    fs.mkdirSync(path.join(appDir, 'view', 'css'), { recursive: true });
    fs.mkdirSync(path.join(appDir, 'view', 'js'), { recursive: true });
}

const write = (sub, filename, content) => fs.writeFileSync(path.join(appDir, sub, filename), content, 'utf-8');

// config / service 始终生成（纯 API 也有）
write('config', name + '.js', `// ${name} 配置：放常量、接口地址、账号等\nmodule.exports = {\n    // 在这里填配置\n};\n`);
write('service', name + '.js', `// ${name} 业务逻辑：放查数据、计算、请求第三方等纯逻辑（不要碰 req/res）\nconst doSomething = async (params) => {\n    // 在这里写业务逻辑\n    return {};\n};\n\nmodule.exports = { doSomething };\n`);

// view 仅在有页面的业务生成（html/css/js 静态前端）
if (!isApi) {
    write('view', name + '.html', `<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>${name}</title>\n    <link rel="stylesheet" href="/${name}/ui/css/${name}.css">\n</head>\n<body>\n    <h1>${name}</h1>\n    <script src="/${name}/ui/js/${name}.js"></script>\n</body>\n</html>\n`);
    write(path.join('view', 'css'), name + '.css', `/* ${name} 样式 */\nbody { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 20px; }\n`);
    write(path.join('view', 'js'), name + '.js', `// ${name} 前端逻辑（fetch JSON 自行渲染）\nconst API_BASE = '/${name}';\n\nwindow.onload = async () => {\n    // 在这里 fetch 后端接口并渲染\n};\n`);
}

const routesHint = isApi ? '' :
    `// const { doSomething } = require('../service/${name}');\n// const CONFIG = require('../config/${name}');\n`;

write('routes', name + '.js', `// ${name} 路由：只做「接请求 → 调 service → 返回」\nconst express = require('express');\nconst router = express.Router();\n${routesHint}\nrouter.get('/', async (req, res) => {\n    res.json({ message: '${name} 模块已就绪' });\n});\n\nmodule.exports = router;\n`);

console.log(`✅ 已生成大类骨架 src/${name}/：`);
console.log(`   src/${name}/config/${name}.js`);
console.log(`   src/${name}/service/${name}.js`);
console.log(`   src/${name}/routes/${name}.js`);
if (!isApi) {
    console.log(`   src/${name}/view/${name}.html`);
    console.log(`   src/${name}/view/css/${name}.css`);
    console.log(`   src/${name}/view/js/${name}.js`);
}
console.log('');
console.log('下一步：在 index.js 里加两行（按大类归位）：');
console.log(`   app.use('/${name}', require('./src/${name}/routes/${name}'));`);
if (!isApi) {
    console.log(`   app.use('/${name}/ui', express.static(path.join(__dirname, 'src/${name}/view')));`);
}
console.log('');
console.log(`然后填 config（配置）、service（逻辑）、routes（接口）${isApi ? '' : '、view（页面）'} 即可。`);
