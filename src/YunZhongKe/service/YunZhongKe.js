// 云中客转链业务逻辑（组包 + 请求上游，不碰 req/res）
const axios = require('axios');
const FormData = require('form-data');
const { mm_values } = require('../config/YunZhongKe');

const convertLink = async ({ temp_url, apitoken }) => {
    const random_mm_value = mm_values[Math.floor(Math.random() * mm_values.length)];

    const formData = new FormData();
    // 🌟 新增字段：抓包发现新增了 siteinfoId
    formData.append('siteinfoId', '');
    formData.append('type', '2');
    // 🌟 修复旧Bug：现在真正使用了前端传来的 apitoken，而不是写死的旧值
    formData.append('apitoken', apitoken);
    formData.append('tpwd', temp_url);
    formData.append('no_coupon', '0');
    formData.append('coupon_force', 'Y');
    formData.append('tkl_tag_l', 'suiji');
    formData.append('tkl_tag_r', 'suiji');
    formData.append('use_custom_link', '0');
    formData.append('pid', random_mm_value);
    formData.append('rid', '');

    // 🌟 更新了请求头，完美适配新版抓包环境
    const headers = {
        ...formData.getHeaders(),
        "Host": "cms.iyunzk.com",
        "sec-ch-ua-platform": "\"Android\"",
        "user-agent": "Mozilla/5.0 (Linux; Android 16; PJZ110 Build/BP2A.250605.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.7444.102 Mobile Safari/537.36",
        "sec-ch-ua": "\"Chromium\";v=\"142\", \"Android WebView\";v=\"142\", \"Not_A Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?1",
        "accept": "*/*",
        "origin": "https://ku.iyunzk.com",
        "x-requested-with": "mark.via", // 🌟 风控核心：标识已变更为 mark.via
        "sec-fetch-site": "same-site",
        "sec-fetch-mode": "cors",
        "sec-fetch-dest": "empty",
        "referer": "https://ku.iyunzk.com/",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
        "priority": "u=1, i"
    };

    try {
        const response = await axios.post('https://cms.iyunzk.com/ku_api/tool/tklAnalysis', formData, { headers, timeout: 10000 });

        if (response.status === 200 && response.data && response.data.data) {
            return { success: true, tk_short_url: response.data.data.tk_short_url };
        }
        // 返回具体的错误细节方便调试
        return { success: false, message: 'Error: Invalid response from server', details: response.data };
    } catch (error) {
        console.error('请求错误:', error.message);
        return { success: false, message: 'Internal Server Error' };
    }
};

module.exports = { convertLink };
