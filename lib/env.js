// 集中加载环境变量：用 __dirname 绝对路径，与「进程启动目录(cwd)」无关，
// 无论从项目根目录还是别的目录(或 VS Code 调试 / nodemon 等工具)启动都能正确读到 .env。
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.development.local') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
