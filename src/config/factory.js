// 入厂报备：全部配置与数据 (人员名单 PERSON_DB / 组包模板 / Q01 解析 / 厂区配置 LOC_CONFIGS)
const fs = require('fs');
const path = require('path');
const { decode, getFormattedDate } = require('../../lib/utils');

const PERSON_DB = {
    // 康
    "MTMwMzIzMTk4NjAyMjgwODFY": [
        { "componentName": "SelectField", "fieldId": "selectField_lxv44orx", "label": "有效身份证件", "fieldData": { "value": "身份证", "text": "身份证" }, "options": [{ "defaultChecked": false, "syncLabelValue": true, "__sid": "item_lxjzgsg1", "text": "身份证", "__sid__": "serial_lxjzgsg0", "value": "身份证", "sid": "serial_lxjzgsg0" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44ory", "label": "证件号码", "fieldData": { "value": decode("MTMwMzIzMTk4NjAyMjgwODFY") } },
        { "componentName": "TextField", "fieldId": "textField_lxv44orw", "label": "姓名", "fieldData": { "value": decode("5bq35Lyf5by6") } },
        { "componentName": "SelectField", "fieldId": "selectField_mbyjhot6", "label": "区号", "fieldData": { "value": "86", "text": "+86" }, "options": [{ "defaultChecked": true, "syncLabelValue": false, "__sid": "item_megqe4lm", "text": "+86", "__sid__": "serial_megqe4ll", "value": "86", "sid": "serial_mbyjf8gm" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44orz", "label": "联系方式", "fieldData": { "value": decode("MTMzMzMzNDgyMjg=") } },
        { "componentName": "ImageField", "fieldId": "imageField_ly9i5k5q", "label": "免冠照片", "fieldData": { "value": [{ "name": "mmexport1759201651500.jpg", "previewUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20250930/c2eb2f026b5f61b8d64af5a762a6baea.jpg", "downloadUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20250930/c2eb2f026b5f61b8d64af5a762a6baea.jpg", "size": 231994, "url": "https://dingtalk.avaryholding.com:8443/dingplus/image/20250930/c2eb2f026b5f61b8d64af5a762a6baea.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osj", "label": "身份证照片", "fieldData": { "value": [{ "name": "mmexport1759201635514.jpg", "previewUrl": "/o/2FD66I71XJ8ZEMWKFG3O3BVDOJVN2TDZ9F6GMT5?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_MkZENjZJNzFYSjhaRU1XS0ZHM08zQlZET0pWTjJURFo5RjZHTVM1.jpg&instId=&type=open&process=image/resize,m_fill,w_200,h_200,limit_0/quality,q_80", "downloadUrl": "/o/2FD66I71XJ8ZEMWKFG3O3BVDOJVN2TDZ9F6GMT5?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_MkZENjZJNzFYSjhaRU1XS0ZHM08zQlZET0pWTjJURFo5RjZHTVM1.jpg&instId=&type=download", "size": 1428463, "url": "/o/2FD66I71XJ8ZEMWKFG3O3BVDOJVN2TDZ9F6GMT5?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_MkZENjZJNzFYSjhaRU1XS0ZHM08zQlZET0pWTjJURFo5RjZHTVM1.jpg&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_MkZENjZJNzFYSjhaRU1XS0ZHM08zQlZET0pWTjJURFo5RjZHTVM1.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osk", "label": "社保/在职证明", "fieldData": { "value": [{ "name": "mmexport1759201655801.jpg", "previewUrl": "/o/K7666JC1AK8ZSBVX8IJOP71PHGNL34I2AF6GMF5?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_Szc2NjZKQzFBSzhaU0JWWDhJSk9QNzFQSEdOTDM0STJBRjZHTUU1.jpg&instId=&type=open&process=image/resize,m_fill,w_200,h_200,limit_0/quality,q_80", "downloadUrl": "/o/K7666JC1AK8ZSBVX8IJOP71PHGNL34I2AF6GMF5?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_Szc2NjZKQzFBSzhaU0JWWDhJSk9QNzFQSEdOTDM0STJBRjZHTUU1.jpg&instId=&type=download", "size": 304370, "url": "/o/K7666JC1AK8ZSBVX8IJOP71PHGNL34I2AF6GMF5?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_Szc2NjZKQzFBSzhaU0JWWDhJSk9QNzFQSEdOTDM0STJBRjZHTUU1.jpg&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_Szc2NjZKQzFBSzhaU0JWWDhJSk9QNzFQSEdOTDM0STJBRjZHTUU1.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osn", "label": "其他附件", "fieldData": { "value": [] } }
    ],
    // 张
    "MTMwMzIyMTk4ODA2MjQyMDE4": [
        { "componentName": "SelectField", "fieldId": "selectField_lxv44orx", "label": "有效身份证件", "fieldData": { "value": "身份证", "text": "身份证" }, "options": [{ "defaultChecked": false, "syncLabelValue": true, "__sid": "item_lxjzgsg1", "text": "身份证", "__sid__": "serial_lxjzgsg0", "value": "身份证", "sid": "serial_lxjzgsg0" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44ory", "label": "证件号码", "fieldData": { "value": decode("MTMwMzIyMTk4ODA2MjQyMDE4") } },
        { "componentName": "TextField", "fieldId": "textField_lxv44orw", "label": "姓名", "fieldData": { "value": decode("5byg5by6") } },
        { "componentName": "SelectField", "fieldId": "selectField_mbyjhot6", "label": "区号", "fieldData": { "value": "86", "text": "+86" }, "options": [{ "defaultChecked": true, "syncLabelValue": false, "__sid": "item_megqe4lm", "text": "+86", "__sid__": "serial_megqe4ll", "value": "86", "sid": "serial_mbyjf8gm" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44orz", "label": "联系方式", "fieldData": { "value": decode("MTc3MzM1MzIwNTc=") } },
        { "componentName": "ImageField", "fieldId": "imageField_ly9i5k5q", "label": "免冠照片", "fieldData": { "value": [{ "name": "mmexport1759201649607.jpg", "previewUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20250930/2e36796d55df6570b30814673dd79c7d.jpg", "downloadUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20250930/2e36796d55df6570b30814673dd79c7d.jpg", "size": 64695, "url": "https://dingtalk.avaryholding.com:8443/dingplus/image/20250930/2e36796d55df6570b30814673dd79c7d.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osj", "label": "身份证照片", "fieldData": { "value": [{ "name": "mmexport1759201639327.jpg", "previewUrl": "/o/GNC66E91ZR7ZFLTH8OFEP46CB9JG3EUHDF6GMOB?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_R05DNjZFOTFaUjdaRkxUSDhPRkVQNDZDQjlKRzNFVUhERjZHTU5C.jpg&instId=&type=open&process=image/resize,m_fill,w_200,h_200,limit_0/quality,q_80", "downloadUrl": "/o/GNC66E91ZR7ZFLTH8OFEP46CB9JG3EUHDF6GMOB?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_R05DNjZFOTFaUjdaRkxUSDhPRkVQNDZDQjlKRzNFVUhERjZHTU5C.jpg&instId=&type=download", "size": 531330, "url": "/o/GNC66E91ZR7ZFLTH8OFEP46CB9JG3EUHDF6GMOB?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_R05DNjZFOTFaUjdaRkxUSDhPRkVQNDZDQjlKRzNFVUhERjZHTU5C.jpg&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_R05DNjZFOTFaUjdaRkxUSDhPRkVQNDZDQjlKRzNFVUhERjZHTU5C.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osk", "label": "社保/在职证明", "fieldData": { "value": [{ "name": "mmexport1759201655801.jpg", "previewUrl": "/o/LLF66FD1VJ8ZU56HEFRI4BPWPUBG22DMDF6GMO4?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_TExGNjZGRDFWSjhaVTU2SEVGUkk0QlBXUFVCRzIyRE1ERjZHTU40.jpg&instId=&type=open&process=image/resize,m_fill,w_200,h_200,limit_0/quality,q_80", "downloadUrl": "/o/LLF66FD1VJ8ZU56HEFRI4BPWPUBG22DMDF6GMO4?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_TExGNjZGRDFWSjhaVTU2SEVGUkk0QlBXUFVCRzIyRE1ERjZHTU40.jpg&instId=&type=download", "size": 304370, "url": "/o/LLF66FD1VJ8ZU56HEFRI4BPWPUBG22DMDF6GMO4?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_TExGNjZGRDFWSjhaVTU2SEVGUkk0QlBXUFVCRzIyRE1ERjZHTU40.jpg&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_TExGNjZGRDFWSjhaVTU2SEVGUkk0QlBXUFVCRzIyRE1ERjZHTU40.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osn", "label": "其他附件", "fieldData": { "value": [] } }
    ],
    // 姜 (已同步 2026-03-04 最新抓包数据)
    "MTMwNDI1MTk4OTA4MjkwMzE0": [
        { "componentName": "SelectField", "fieldId": "selectField_lxv44orx", "label": "有效身份证件", "fieldData": { "value": "身份证", "text": "身份证" }, "options": [{ "defaultChecked": false, "syncLabelValue": true, "__sid": "item_lxjzgsg1", "text": "身份证", "__sid__": "serial_lxjzgsg0", "value": "身份证", "sid": "serial_lxjzgsg0" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44ory", "label": "证件号码", "fieldData": { "value": decode("MTMwNDI1MTk4OTA4MjkwMzE0") } },
        { "componentName": "TextField", "fieldId": "textField_lxv44orw", "label": "姓名", "fieldData": { "value": decode("5aec5bu66b6Z") } },
        { "componentName": "SelectField", "fieldId": "selectField_mbyjhot6", "label": "区号", "fieldData": { "value": "86", "text": "+86" }, "options": [{ "defaultChecked": true, "syncLabelValue": false, "__sid": "item_megqe4lm", "text": "+86", "__sid__": "serial_megqe4ll", "value": "86", "sid": "serial_mbyjf8gm" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44orz", "label": "联系方式", "fieldData": { "value": decode("MTMzMTUzOTY2MDc=") } }, // 已更新为 13315396607 的 Base64
        { "componentName": "ImageField", "fieldId": "imageField_ly9i5k5q", "label": "免冠照片", "fieldData": { "value": [{ "name": "mmexport1772611546795.jpg", "previewUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260304/4a240b9a1d92ad988ee252d3eb83f583.jpg", "downloadUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260304/4a240b9a1d92ad988ee252d3eb83f583.jpg", "size": 173548, "url": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260304/4a240b9a1d92ad988ee252d3eb83f583.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osj", "label": "身份证照片", "fieldData": { "value": [{ "name": "mmexport1772611479286.jpg", "previewUrl": "/o/W6D66371ZXN37V9ZHQY155MBLB4T2STL4RBMM88?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_VzZENjYzNzFaWE4zN1Y5WkhRWTE1NU1CTEI0VDJTVEw0UkJNTTc4.jpg&instId=&type=open&process=image/resize,m_fill,w_200,h_200,limit_0/quality,q_80", "downloadUrl": "/o/W6D66371ZXN37V9ZHQY155MBLB4T2STL4RBMM88?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_VzZENjYzNzFaWE4zN1Y5WkhRWTE1NU1CTEI0VDJTVEw0UkJNTTc4.jpg&instId=&type=download", "size": 437235, "url": "/o/W6D66371ZXN37V9ZHQY155MBLB4T2STL4RBMM88?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_VzZENjYzNzFaWE4zN1Y5WkhRWTE1NU1CTEI0VDJTVEw0UkJNTTc4.jpg&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_VzZENjYzNzFaWE4zN1Y5WkhRWTE1NU1CTEI0VDJTVEw0UkJNTTc4.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osk", "label": "社保/在职证明", "fieldData": { "value": [{ "name": "2_在职证明.pdf", "previewUrl": "/dingtalk/mobile/APP_GRVPTEOQ6D4B7FLZFYNJ/inst/preview?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_UlpFNjY4NzFFOU8zSElNSU5ETEJDNFdXVkwzUTJZR1NBUkJNTTI1.pdf&fileSize=75650&downloadUrl=APP_GRVPTEOQ6D4B7FLZFYNJ_UlpFNjY4NzFFOU8zSElNSU5ETEJDNFdXVkwzUTJZR1NBUkJNTTI1.pdf", "downloadUrl": "/o/RZE66871E9O3HIMINDLBC4WWVL3Q2YGSARBMM35?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_UlpFNjY4NzFFOU8zSElNSU5ETEJDNFdXVkwzUTJZR1NBUkJNTTI1.pdf&instId=&type=download", "size": 75650, "url": "/o/RZE66871E9O3HIMINDLBC4WWVL3Q2YGSARBMM35?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_UlpFNjY4NzFFOU8zSElNSU5ETEJDNFdXVkwzUTJZR1NBUkJNTTI1.pdf&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_UlpFNjY4NzFFOU8zSElNSU5ETEJDNFdXVkwzUTJZR1NBUkJNTTI1.pdf" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osn", "label": "其他附件", "fieldData": { "value": [] } }
    ],
    // 孙
    "MjMwMjMwMjAwMzAxMDEyMTM1": [
        { "componentName": "SelectField", "fieldId": "selectField_lxv44orx", "label": "有效身份证件", "fieldData": { "value": "身份证", "text": "身份证" }, "options": [{ "defaultChecked": false, "syncLabelValue": true, "__sid": "item_lxjzgsg1", "text": "身份证", "__sid__": "serial_lxjzgsg0", "value": "身份证", "sid": "serial_lxjzgsg0" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44ory", "label": "证件号码", "fieldData": { "value": decode("MjMwMjMwMjAwMzAxMDEyMTM1") } },
        { "componentName": "TextField", "fieldId": "textField_lxv44orw", "label": "姓名", "fieldData": { "value": decode("5a2Z5b635Yev") } },
        { "componentName": "SelectField", "fieldId": "selectField_mbyjhot6", "label": "区号", "fieldData": { "value": "86", "text": "+86" }, "options": [{ "defaultChecked": true, "syncLabelValue": false, "__sid": "item_megqe4lm", "text": "+86", "__sid__": "serial_megqe4ll", "value": "86", "sid": "serial_mbyjf8gm" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44orz", "label": "联系方式", "fieldData": { "value": decode("MTc2MTQ2MjUxMTI=") } },
        { "componentName": "ImageField", "fieldId": "imageField_ly9i5k5q", "label": "免冠照片", "fieldData": { "value": [{ "name": "IMG20250729211344.jpg", "previewUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20250801/aa450e5d5330972eabce5ecbf019b577.jpg", "downloadUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20250801/aa450e5d5330972eabce5ecbf019b577.jpg", "size": 211900, "url": "https://dingtalk.avaryholding.com:8443/dingplus/image/20250801/aa450e5d5330972eabce5ecbf019b577.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osj", "label": "身份证照片", "fieldData": { "value": [{ "name": "mmexport1754011976476.jpg", "previewUrl": "/o/MLF662B1O8JX9WDEEK8VLAGNM11H3JP5G5SDM1F?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_TUxGNjYyQjFPOEpYOVdERUVLOFZMQUdOTTExSDNKUDVHNVNETTBG.jpg&instId=&type=open&process=image/resize,m_fill,w_200,h_200,limit_0/quality,q_80", "downloadUrl": "/o/MLF662B1O8JX9WDEEK8VLAGNM11H3JP5G5SDM1F?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_TUxGNjYyQjFPOEpYOVdERUVLOFZMQUdOTTExSDNKUDVHNVNETTBG.jpg&instId=&type=download", "size": 396211, "url": "/o/MLF662B1O8JX9WDEEK8VLAGNM11H3JP5G5SDM1F?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_TUxGNjYyQjFPOEpYOVdERUVLOFZMQUdOTTExSDNKUDVHNVNETTBG.jpg&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_TUxGNjYyQjFPOEpYOVdERUVLOFZMQUdOTTExSDNKUDVHNVNETTBG.jpg" }, { "name": "mmexport1754011977805.jpg", "previewUrl": "/o/EWE66Z916BJXCIPX9N5DOACQ111K3IS8G5SDM48?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_RVdFNjZaOTE2QkpYQ0lQWDlONURPQUNRMTExSzNIUzhHNVNETTM4.jpg&instId=&type=open&process=image/resize,m_fill,w_200,h_200,limit_0/quality,q_80", "downloadUrl": "/o/EWE66Z916BJXCIPX9N5DOACQ111K3IS8G5SDM48?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_RVdFNjZaOTE2QkpYQ0lQWDlONURPQUNRMTExSzNIUzhHNVNETTM4.jpg&instId=&type=download", "size": 502357, "url": "/o/EWE66Z916BJXCIPX9N5DOACQ111K3IS8G5SDM48?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_RVdFNjZaOTE2QkpYQ0lQWDlONURPQUNRMTExSzNIUzhHNVNETTM4.jpg&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_RVdFNjZaOTE2QkpYQ0lQWDlONURPQUNRMTExSzNIUzhHNVNETTM4.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osk", "label": "社保/在职证明", "fieldData": { "value": [{ "name": "在职证明+-+孙德凯.pdf", "previewUrl": "/dingtalk/mobile/APP_GRVPTEOQ6D4B7FLZFYNJ/inst/preview?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_QjlDNjYwQzFNQkxYRDBOUzczVk1EN0pCTTJDUDM2Q0xINVNETUI0.pdf&fileSize=40638&downloadUrl=APP_GRVPTEOQ6D4B7FLZFYNJ_QjlDNjYwQzFNQkxYRDBOUzczVk1EN0pCTTJDUDM2Q0xINVNETUI0.pdf", "downloadUrl": "/o/B9C660C1MBLXD0NS73VMD7JBM2CP37CLH5SDMC4?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_QjlDNjYwQzFNQkxYRDBOUzczVk1EN0pCTTJDUDM2Q0xINVNETUI0.pdf&instId=&type=download", "size": 40638, "url": "/o/B9C660C1MBLXD0NS73VMD7JBM2CP37CLH5SDMC4?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_QjlDNjYwQzFNQkxYRDBOUzczVk1EN0pCTTJDUDM2Q0xINVNETUI0.pdf&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_QjlDNjYwQzFNQkxYRDBOUzczVk1EN0pCTTJDUDM2Q0xINVNETUI0.pdf" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osn", "label": "其他附件", "fieldData": { "value": [] } }
    ],
    // 王
    "MTMxMTIxMTk4OTAxMDU1MDEx": [
        { "componentName": "SelectField", "fieldId": "selectField_lxv44orx", "label": "有效身份证件", "fieldData": { "value": "身份证", "text": "身份证" }, "options": [{ "defaultChecked": false, "syncLabelValue": true, "__sid": "item_lxjzgsg1", "text": "身份证", "__sid__": "serial_lxjzgsg0", "value": "身份证", "sid": "serial_lxjzgsg0" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44ory", "label": "证件号码", "fieldData": { "value": decode("MTMxMTIxMTk4OTAxMDU1MDEx") } },
        { "componentName": "TextField", "fieldId": "textField_lxv44orw", "label": "姓名", "fieldData": { "value": decode("546L6I+B") } },
        { "componentName": "SelectField", "fieldId": "selectField_mbyjhot6", "label": "区号", "fieldData": { "value": "86", "text": "+86" }, "options": [{ "defaultChecked": true, "syncLabelValue": false, "__sid": "item_megqe4lm", "text": "+86", "__sid__": "serial_megqe4ll", "value": "86", "sid": "serial_mbyjf8gm" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44orz", "label": "联系方式", "fieldData": { "value": decode("MTUzNjk2OTc2NTY=") } },
        { "componentName": "ImageField", "fieldId": "imageField_ly9i5k5q", "label": "免冠照片", "fieldData": { "value": [{ "name": "mmexport1764079804080.jpg", "previewUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20251125/75283de0e118cb24adf4d5a0ed6bac6f.jpg", "downloadUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20251125/75283de0e118cb24adf4d5a0ed6bac6f.jpg", "size": 61062, "url": "https://dingtalk.avaryholding.com:8443/dingplus/image/20251125/75283de0e118cb24adf4d5a0ed6bac6f.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osj", "label": "身份证照片", "fieldData": { "value": [{ "name": "mmexport1764079249396.jpg", "previewUrl": "/o/4UF66771OHS0AITWGDG6M7PX8ZY237GNKNEIM0D?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_NFVGNjY3NzFPSFMwQUlUV0dERzZNN1BYOFpZMjM3R05LTkVJTVpD.jpg&instId=&type=open&process=image/resize,m_fill,w_200,h_200,limit_0/quality,q_80", "downloadUrl": "/o/4UF66771OHS0AITWGDG6M7PX8ZY237GNKNEIM0D?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_NFVGNjY3NzFPSFMwQUlUV0dERzZNN1BYOFpZMjM3R05LTkVJTVpD.jpg&instId=&type=download", "size": 173437, "url": "/o/4UF66771OHS0AITWGDG6M7PX8ZY237GNKNEIM0D?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_NFVGNjY3NzFPSFMwQUlUV0dERzZNN1BYOFpZMjM3R05LTkVJTVpD.jpg&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_NFVGNjY3NzFPSFMwQUlUV0dERzZNN1BYOFpZMjM3R05LTkVJTVpD.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osk", "label": "社保/在职证明", "fieldData": { "value": [{ "name": "在职证明.pdf", "previewUrl": "/dingtalk/mobile/APP_GRVPTEOQ6D4B7FLZFYNJ/inst/preview?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_TlNHNjZKQjFMSFcwMjAwQ0hRRFNNQ0oxTDlWODIyWlBLTkVJTUk0.pdf&fileSize=74505&downloadUrl=APP_GRVPTEOQ6D4B7FLZFYNJ_TlNHNjZKQjFMSFcwMjAwQ0hRRFNNQ0oxTDlWODIyWlBLTkVJTUk0.pdf", "downloadUrl": "/o/NSG66JB1LHW0200CHQDSMCJ1L9V822ZPKNEIMJ4?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_TlNHNjZKQjFMSFcwMjAwQ0hRRFNNQ0oxTDlWODIyWlBLTkVJTUk0.pdf&instId=&type=download", "size": 74505, "url": "/o/NSG66JB1LHW0200CHQDSMCJ1L9V822ZPKNEIMJ4?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_TlNHNjZKQjFMSFcwMjAwQ0hRRFNNQ0oxTDlWODIyWlBLTkVJTUk0.pdf&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_TlNHNjZKQjFMSFcwMjAwQ0hRRFNNQ0oxTDlWODIyWlBLTkVJTUk0.pdf" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osn", "label": "其他附件", "fieldData": { "value": [] } }
    ],
    // 田
    "NDEwNDIzMTk4OTA3MjIxNTMw": [
        { "componentName": "SelectField", "fieldId": "selectField_lxv44orx", "label": "有效身份证件", "fieldData": { "value": "身份证", "text": "身份证" }, "options": [{ "defaultChecked": false, "syncLabelValue": true, "__sid": "item_lxjzgsg1", "text": "身份证", "__sid__": "serial_lxjzgsg0", "value": "身份证", "sid": "serial_lxjzgsg0" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44ory", "label": "证件号码", "fieldData": { "value": decode("NDEwNDIzMTk4OTA3MjIxNTMw") } },
        { "componentName": "TextField", "fieldId": "textField_lxv44orw", "label": "姓名", "fieldData": { "value": decode("55Sw5LmQ5LmQ") } },
        { "componentName": "SelectField", "fieldId": "selectField_mbyjhot6", "label": "区号", "fieldData": { "value": "86", "text": "+86" }, "options": [{ "defaultChecked": true, "syncLabelValue": false, "__sid": "item_megqe4lm", "text": "+86", "__sid__": "serial_megqe4ll", "value": "86", "sid": "serial_mbyjf8gm" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44orz", "label": "联系方式", "fieldData": { "value": decode("MTM3MzM3NzE2NjE=") } },
        { "componentName": "ImageField", "fieldId": "imageField_ly9i5k5q", "label": "免冠照片", "fieldData": { "value": [{ "name": "mmexport1764077687246.jpg", "previewUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20251125/ce5e71ca5152f9308d11fa79274a2db4.jpg", "downloadUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20251125/ce5e71ca5152f9308d11fa79274a2db4.jpg", "size": 56562, "url": "https://dingtalk.avaryholding.com:8443/dingplus/image/20251125/ce5e71ca5152f9308d11fa79274a2db4.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osj", "label": "身份证照片", "fieldData": { "value": [{ "name": "mmexport1764077685696.jpg", "previewUrl": "/o/JHC66Q81ACX0C1U5KH7TLBOPQLB83SQ8YMEIM52?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_SkhDNjZRODFBQ1gwQzFVNUtIN1RMQk9QUUxCODNTUThZTUVJTTQy.jpg&instId=&type=open&process=image/resize,m_fill,w_200,h_200,limit_0/quality,q_80", "downloadUrl": "/o/JHC66Q81ACX0C1U5KH7TLBOPQLB83SQ8YMEIM52?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_SkhDNjZRODFBQ1gwQzFVNUtIN1RMQk9QUUxCODNTUThZTUVJTTQy.jpg&instId=&type=download", "size": 327697, "url": "/o/JHC66Q81ACX0C1U5KH7TLBOPQLB83SQ8YMEIM52?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_SkhDNjZRODFBQ1gwQzFVNUtIN1RMQk9QUUxCODNTUThZTUVJTTQy.jpg&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_SkhDNjZRODFBQ1gwQzFVNUtIN1RMQk9QUUxCODNTUThZTUVJTTQy.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osk", "label": "社保/在职证明", "fieldData": { "value": [{ "name": "mmexport1764077683551.jpg", "previewUrl": "/o/R7C66W71JES0TS6GOMX304AK0SI23F2NZMEIMWL?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_UjdDNjZXNzFKRVMwVFM2R09NWDMwNEFLMFNJMjNGMk5aTUVJTVZM.jpg&instId=&type=open&process=image/resize,m_fill,w_200,h_200,limit_0/quality,q_80", "downloadUrl": "/o/R7C66W71JES0TS6GOMX304AK0SI23F2NZMEIMWL?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_UjdDNjZXNzFKRVMwVFM2R09NWDMwNEFLMFNJMjNGMk5aTUVJTVZM.jpg&instId=&type=download", "size": 95823, "url": "/o/R7C66W71JES0TS6GOMX304AK0SI23F2NZMEIMWL?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_UjdDNjZXNzFKRVMwVFM2R09NWDMwNEFLMFNJMjNGMk5aTUVJTVZM.jpg&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_UjdDNjZXNzFKRVMwVFM2R09NWDMwNEFLMFNJMjNGMk5aTUVJTVZM.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osn", "label": "其他附件", "fieldData": { "value": [] } }
    ],
    // 兰 (新增)
    "NDMyOTAxMTk4MjExMDUyMDE2": [
        { "componentName": "SelectField", "fieldId": "selectField_lxv44orx", "label": "有效身份证件", "fieldData": { "value": "身份证", "text": "身份证" }, "options": [{ "defaultChecked": false, "syncLabelValue": true, "__sid": "item_lxjzgsg1", "text": "身份证", "__sid__": "serial_lxjzgsg0", "value": "身份证", "sid": "serial_lxjzgsg0" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44ory", "label": "证件号码", "fieldData": { "value": decode("NDMyOTAxMTk4MjExMDUyMDE2") } },
        { "componentName": "TextField", "fieldId": "textField_lxv44orw", "label": "姓名", "fieldData": { "value": decode("5YWw5paM") } },
        { "componentName": "SelectField", "fieldId": "selectField_mbyjhot6", "label": "区号", "fieldData": { "value": "86", "text": "+86" }, "options": [{ "defaultChecked": true, "syncLabelValue": false, "__sid": "item_megqe4lm", "text": "+86", "__sid__": "serial_megqe4ll", "value": "86", "sid": "serial_mbyjf8gm" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44orz", "label": "联系方式", "fieldData": { "value": decode("MTM0MTI5NTM1MzA=") } },
        { "componentName": "ImageField", "fieldId": "imageField_ly9i5k5q", "label": "免冠照片", "fieldData": { "value": [{ "name": "1000010214.jpg", "previewUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20251212/fd7e8c2de382ff60fa06a0b133726925.jpg", "downloadUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20251212/fd7e8c2de382ff60fa06a0b133726925.jpg", "size": 36681, "url": "https://dingtalk.avaryholding.com:8443/dingplus/image/20251212/fd7e8c2de382ff60fa06a0b133726925.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osj", "label": "身份证照片", "fieldData": { "value": [{ "name": "mmexport1765527972471.jpg", "previewUrl": "/o/KPE66S71GVE1CFXGNA63M4ESVXGL3DBR4M2JMH?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_S1BFNjZTNzFHVkUxQ0ZYR05BNjNNNEVTVlhHTDNEQlI0TTJKTUc$.jpg&instId=&type=open&process=image/resize,m_fill,w_200,h_200,limit_0/quality,q_80", "downloadUrl": "/o/KPE66S71GVE1CFXGNA63M4ESVXGL3DBR4M2JMH?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_S1BFNjZTNzFHVkUxQ0ZYR05BNjNNNEVTVlhHTDNEQlI0TTJKTUc$.jpg&instId=&type=download", "size": 214657, "url": "/o/KPE66S71GVE1CFXGNA63M4ESVXGL3DBR4M2JMH?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_S1BFNjZTNzFHVkUxQ0ZYR05BNjNNNEVTVlhHTDNEQlI0TTJKTUc$.jpg&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_S1BFNjZTNzFHVkUxQ0ZYR05BNjNNNEVTVlhHTDNEQlI0TTJKTUc$.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osk", "label": "社保/在职证明", "fieldData": { "value": [{ "name": "1_在职证明.pdf", "previewUrl": "/dingtalk/mobile/APP_GRVPTEOQ6D4B7FLZFYNJ/inst/preview?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_TUo5NjZBOTEwV0UxVlpBWUdKOTg0Q09GVTlBMjNVQlo0TTJKTUI%24.pdf&fileSize=71755&downloadUrl=APP_GRVPTEOQ6D4B7FLZFYNJ_TUo5NjZBOTEwV0UxVlpBWUdKOTg0Q09GVTlBMjNVQlo0TTJKTUI$.pdf", "downloadUrl": "/o/MJ966A910WE1VZAYGJ984COFU9A23UBZ4M2JMC?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_TUo5NjZBOTEwV0UxVlpBWUdKOTg0Q09GVTlBMjNVQlo0TTJKTUI$.pdf&instId=&type=download", "size": 71755, "url": "/o/MJ966A910WE1VZAYGJ984COFU9A23UBZ4M2JMC?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_TUo5NjZBOTEwV0UxVlpBWUdKOTg0Q09GVTlBMjNVQlo0TTJKTUI$.pdf&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_TUo5NjZBOTEwV0UxVlpBWUdKOTg0Q09GVTlBMjNVQlo0TTJKTUI$.pdf" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osn", "label": "其他附件", "fieldData": { "value": [] } }
    ],
    // 卞 (新增)
    "NDEwOTIzMTk4ODA3MTkxMDFY": [
        { "componentName": "SelectField", "fieldId": "selectField_lxv44orx", "label": "有效身份证件", "fieldData": { "value": "身份证", "text": "身份证" }, "options": [{ "defaultChecked": false, "syncLabelValue": true, "__sid": "item_lxjzgsg1", "text": "身份证", "__sid__": "serial_lxjzgsg0", "value": "身份证", "sid": "serial_lxjzgsg0" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44ory", "label": "证件号码", "fieldData": { "value": decode("NDEwOTIzMTk4ODA3MTkxMDFY") } },
        { "componentName": "TextField", "fieldId": "textField_lxv44orw", "label": "姓名", "fieldData": { "value": decode("5Y2e5b2m5p2w") } },
        { "componentName": "SelectField", "fieldId": "selectField_mbyjhot6", "label": "区号", "fieldData": { "value": "86", "text": "+86" }, "options": [{ "defaultChecked": true, "syncLabelValue": false, "__sid": "item_megqe4lm", "text": "+86", "__sid__": "serial_megqe4ll", "value": "86", "sid": "serial_mbyjf8gm" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44orz", "label": "联系方式", "fieldData": { "value": decode("MTM5NjI2NTAzNDI=") } },
        { "componentName": "ImageField", "fieldId": "imageField_ly9i5k5q", "label": "免冠照片", "fieldData": { "value": [{ "name": "1000010220.jpg", "previewUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20251212/11827a46930d5926a3f3dea1195e1868.jpg", "downloadUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20251212/11827a46930d5926a3f3dea1195e1868.jpg", "size": 99280, "url": "https://dingtalk.avaryholding.com:8443/dingplus/image/20251212/11827a46930d5926a3f3dea1195e1868.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osj", "label": "身份证照片", "fieldData": { "value": [{ "name": "mmexport1765528702605.jpg", "previewUrl": "/o/17B66991SSD19XWDH8OL36ERD8202TD7AM2JML8?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_MTdCNjY5OTFTU0QxOVhXREg4T0wzNkVSRDgyMDJURDdBTTJKTUs4.jpg&instId=&type=open&process=image/resize,m_fill,w_200,h_200,limit_0/quality,q_80", "downloadUrl": "/o/17B66991SSD19XWDH8OL36ERD8202TD7AM2JML8?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_MTdCNjY5OTFTU0QxOVhXREg4T0wzNkVSRDgyMDJURDdBTTJKTUs4.jpg&instId=&type=download", "size": 82147, "url": "/o/17B66991SSD19XWDH8OL36ERD8202TD7AM2JML8?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_MTdCNjY5OTFTU0QxOVhXREg4T0wzNkVSRDgyMDJURDdBTTJKTUs4.jpg&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_MTdCNjY5OTFTU0QxOVhXREg4T0wzNkVSRDgyMDJURDdBTTJKTUs4.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osk", "label": "社保/在职证明", "fieldData": { "value": [{ "name": "mmexport1765528683879.jpg", "previewUrl": "/o/KPE66S71PVE1Y4UKO5DXL9ENNDCI25XDAM2JMD?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_S1BFNjZTNzFQVkUxWTRVS081RFhMOUVOTkRDSTI1WERBTTJKTUM$.jpg&instId=&type=open&process=image/resize,m_fill,w_200,h_200,limit_0/quality,q_80", "downloadUrl": "/o/KPE66S71PVE1Y4UKO5DXL9ENNDCI25XDAM2JMD?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_S1BFNjZTNzFQVkUxWTRVS081RFhMOUVOTkRDSTI1WERBTTJKTUM$.jpg&instId=&type=download", "size": 95850, "url": "/o/KPE66S71PVE1Y4UKO5DXL9ENNDCI25XDAM2JMD?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_S1BFNjZTNzFQVkUxWTRVS081RFhMOUVOTkRDSTI1WERBTTJKTUM$.jpg&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_S1BFNjZTNzFQVkUxWTRVS081RFhMOUVOTkRDSTI1WERBTTJKTUM$.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osn", "label": "其他附件", "fieldData": { "value": [] } }
    ],
    // 贾
    "MDMwNzE3Njg=": [
        { "componentName": "SelectField", "fieldId": "selectField_lxv44orx", "label": "有效身份证件", "fieldData": { "value": "台胞证", "text": "台胞证" }, "options": [{ "defaultChecked": false, "syncLabelValue": true, "__sid": "item_lxjzgsg3", "text": "台胞证", "__sid__": "serial_lxjzgsg2", "value": "台胞证", "sid": "serial_lxjzgsg2" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44ory", "label": "证件号码", "fieldData": { "value": decode("MDMwNzE3Njg=") } },
        { "componentName": "TextField", "fieldId": "textField_lxv44orw", "label": "姓名", "fieldData": { "value": decode("6LS+5paH6YCJ") } },
        { "componentName": "SelectField", "fieldId": "selectField_mbyjhot6", "label": "区号", "fieldData": { "value": "86", "text": "+86" }, "options": [{ "defaultChecked": true, "syncLabelValue": false, "__sid": "item_megqe4lm", "text": "+86", "__sid__": "serial_megqe4ll", "value": "86", "sid": "serial_mbyjf8gm" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44orz", "label": "联系方式", "fieldData": { "value": decode("MTU2MjM0NTc2MjU=") } },
        { "componentName": "ImageField", "fieldId": "imageField_ly9i5k5q", "label": "免冠照片", "fieldData": { "value": [{ "name": "mmexport1760007547917.jpg", "previewUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20251010/652a6f0c65a2fb40cdccc4e4afbec59d.jpg", "downloadUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20251010/652a6f0c65a2fb40cdccc4e4afbec59d.jpg", "size": 144553, "url": "https://dingtalk.avaryholding.com:8443/dingplus/image/20251010/652a6f0c65a2fb40cdccc4e4afbec59d.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osj", "label": "身份证照片", "fieldData": { "value": [{ "name": "mmexport1760007546568.jpg", "previewUrl": "/o/GI966BB1CS7ZB13YBTNJ95OVBJLY22F535KGM8L?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_R0k5NjZCQjFDUzdaQjEzWUJUTko5NU9WQkpMWTIxRjUzNUtHTTdM.jpg&instId=&type=open&process=image/resize,m_fill,w_200,h_200,limit_0/quality,q_80", "downloadUrl": "/o/GI966BB1CS7ZB13YBTNJ95OVBJLY22F535KGM8L?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_R0k5NjZCQjFDUzdaQjEzWUJUTko5NU9WQkpMWTIxRjUzNUtHTTdM.jpg&instId=&type=download", "size": 302294, "url": "/o/GI966BB1CS7ZB13YBTNJ95OVBJLY22F535KGM8L?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_R0k5NjZCQjFDUzdaQjEzWUJUTko5NU9WQkpMWTIxRjUzNUtHTTdM.jpg&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_R0k5NjZCQjFDUzdaQjEzWUJUTko5NU9WQkpMWTIxRjUzNUtHTTdM.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osk", "label": "社保/在职证明", "fieldData": { "value": [{ "name": "在职证明+-+贾文选.pdf", "previewUrl": "/dingtalk/mobile/APP_GRVPTEOQ6D4B7FLZFYNJ/inst/preview?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_NENCNjY3NzFCOThaNEZMVkFaRkxaNkxNWEQ5MjJLTDczNUtHTThI.pdf&fileSize=35594&downloadUrl=APP_GRVPTEOQ6D4B7FLZFYNJ_NENCNjY3NzFCOThaNEZMVkFaRkxaNkxNWEQ5MjJLTDczNUtHTThI.pdf", "downloadUrl": "/o/4CB66771B98Z4FLVAZFLZ6LMXD922KL735KGM9H?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_NENCNjY3NzFCOThaNEZMVkFaRkxaNkxNWEQ5MjJLTDczNUtHTThI.pdf&instId=&type=download", "size": 35594, "url": "/o/4CB66771B98Z4FLVAZFLZ6LMXD922KL735KGM9H?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_NENCNjY3NzFCOThaNEZMVkFaRkxaNkxNWEQ5MjJLTDczNUtHTThI.pdf&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_NENCNjY3NzFCOThaNEZMVkFaRkxaNkxNWEQ5MjJLTDczNUtHTThI.pdf" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osn", "label": "其他附件", "fieldData": { "value": [] } }
    ],
    // 林呈颖
    "MTAyNDE5NDY=": [
        { "componentName": "SelectField", "fieldId": "selectField_lxv44orx", "label": "有效身份证件", "fieldData": { "value": "台胞证", "text": "台胞证" }, "options": [{ "defaultChecked": false, "syncLabelValue": true, "__sid": "item_lxjzgsg3", "text": "台胞证", "__sid__": "serial_lxjzgsg2", "value": "台胞证", "sid": "serial_lxjzgsg2" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44ory", "label": "证件号码", "fieldData": { "value": decode("MTAyNDE5NDY=") } },
        { "componentName": "TextField", "fieldId": "textField_lxv44orw", "label": "姓名", "fieldData": { "value": decode("5p6X5ZGI6aKW") } },
        { "componentName": "SelectField", "fieldId": "selectField_mbyjhot6", "label": "区号", "fieldData": { "value": "86", "text": "+86" }, "options": [{ "defaultChecked": true, "syncLabelValue": false, "__sid": "item_megqe4lm", "text": "+86", "__sid__": "serial_megqe4ll", "value": "86", "sid": "serial_mbyjf8gm" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44orz", "label": "联系方式", "fieldData": { "value": decode("MTc2MjU0MjU0MzY=") } },
        { "componentName": "ImageField", "fieldId": "imageField_ly9i5k5q", "label": "免冠照片", "fieldData": { "value": [{ "name": "1000059181.jpg", "previewUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260228/c9a52920e292641fc7140d3def86b4a8.jpg", "downloadUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260228/c9a52920e292641fc7140d3def86b4a8.jpg", "size": 70234, "url": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260228/c9a52920e292641fc7140d3def86b4a8.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osj", "label": "身份证照片", "fieldData": { "value": [{ "name": "mmexport1772246998289.jpg", "previewUrl": "/o/VXE662B1L6532TLHHLCIT4NOWPFE2QRE8Q5MMLF1?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_VlhFNjYyQjFMNjUzMlRMSEhMQ0lUNE5PV1BGRTJRUkU4UTVNTUtGMQ$$.jpg&instId=&type=open&process=image/resize,m_fill,w_200,h_200,limit_0/quality,q_80", "downloadUrl": "/o/VXE662B1L6532TLHHLCIT4NOWPFE2QRE8Q5MMLF1?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_VlhFNjYyQjFMNjUzMlRMSEhMQ0lUNE5PV1BGRTJRUkU4UTVNTUtGMQ$$.jpg&instId=&type=download", "size": 117050, "url": "/o/VXE662B1L6532TLHHLCIT4NOWPFE2QRE8Q5MMLF1?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_VlhFNjYyQjFMNjUzMlRMSEhMQ0lUNE5PV1BGRTJRUkU4UTVNTUtGMQ$$.jpg&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_VlhFNjYyQjFMNjUzMlRMSEhMQ0lUNE5PV1BGRTJRUkU4UTVNTUtGMQ$$.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osk", "label": "社保/在职证明", "fieldData": { "value": [{ "name": "mmexport1772246999991.png", "previewUrl": "/o/E2E66S91XN73AFP8JF0QM6Z3CKHO3THJ8Q5MMY11?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_RTJFNjZTOTFYTjczQUZQOEpGMFFNNlozQ0tITzNUSEo4UTVNTVgxMQ$$.png&instId=&type=open&process=image/resize,m_fill,w_200,h_200,limit_0/quality,q_80", "downloadUrl": "/o/E2E66S91XN73AFP8JF0QM6Z3CKHO3THJ8Q5MMY11?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_RTJFNjZTOTFYTjczQUZQOEpGMFFNNlozQ0tITzNUSEo4UTVNTVgxMQ$$.png&instId=&type=download", "size": 123882, "url": "/o/E2E66S91XN73AFP8JF0QM6Z3CKHO3THJ8Q5MMY11?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_RTJFNjZTOTFYTjczQUZQOEpGMFFNNlozQ0tITzNUSEo4UTVNTVgxMQ$$.png&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_RTJFNjZTOTFYTjczQUZQOEpGMFFNNlozQ0tITzNUSEo4UTVNTVgxMQ$$.png" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osn", "label": "其他附件", "fieldData": { "value": [] } }
    ],
    // 陈宏仁
    "MDczOTM0Njc=": [
        { "componentName": "SelectField", "fieldId": "selectField_lxv44orx", "label": "有效身份证件", "fieldData": { "value": "台胞证", "text": "台胞证" }, "options": [{ "defaultChecked": false, "syncLabelValue": true, "__sid": "item_lxjzgsg3", "text": "台胞证", "__sid__": "serial_lxjzgsg2", "value": "台胞证", "sid": "serial_lxjzgsg2" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44ory", "label": "证件号码", "fieldData": { "value": decode("MDczOTM0Njc=") } },
        { "componentName": "TextField", "fieldId": "textField_lxv44orw", "label": "姓名", "fieldData": { "value": decode("6ZmI5a6P5LuB") } },
        { "componentName": "SelectField", "fieldId": "selectField_mbyjhot6", "label": "区号", "fieldData": { "value": "86", "text": "+86" }, "options": [{ "defaultChecked": true, "syncLabelValue": false, "__sid": "item_megqe4lm", "text": "+86", "__sid__": "serial_megqe4ll", "value": "86", "sid": "serial_mbyjf8gm" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44orz", "label": "联系方式", "fieldData": { "value": decode("MDczOTM0Njc=") } },
        { "componentName": "ImageField", "fieldId": "imageField_ly9i5k5q", "label": "免冠照片", "fieldData": { "value": [{ "name": "1000059194.jpg", "previewUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260228/a0d9fc25135b0d479b278702c8c39cba.jpg", "downloadUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260228/a0d9fc25135b0d479b278702c8c39cba.jpg", "size": 72773, "url": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260228/a0d9fc25135b0d479b278702c8c39cba.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osj", "label": "身份证照片", "fieldData": { "value": [{ "name": "mmexport1772248145582.jpg", "previewUrl": "/o/A9D66CC1ZZL3GWKMGUKY84Q1VCSW3STYSQ5MMJ?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_QTlENjZDQzFaWkwzR1dLTUdVS1k4NFExVkNTVzNTVFlTUTVNTUk$.jpg&instId=&type=open&process=image/resize,m_fill,w_200,h_200,limit_0/quality,q_80", "downloadUrl": "/o/A9D66CC1ZZL3GWKMGUKY84Q1VCSW3STYSQ5MMJ?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_QTlENjZDQzFaWkwzR1dLTUdVS1k4NFExVkNTVzNTVFlTUTVNTUk$.jpg&instId=&type=download", "size": 130388, "url": "/o/A9D66CC1ZZL3GWKMGUKY84Q1VCSW3STYSQ5MMJ?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_QTlENjZDQzFaWkwzR1dLTUdVS1k4NFExVkNTVzNTVFlTUTVNTUk$.jpg&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_QTlENjZDQzFaWkwzR1dLTUdVS1k4NFExVkNTVzNTVFlTUTVNTUk$.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osk", "label": "社保/在职证明", "fieldData": { "value": [{ "name": "mmexport1772246999991.png", "previewUrl": "/o/BO966PC16653TY08NOOJL6931NEN38DBTQ5MM9F1?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_Qk85NjZQQzE2NjUzVFkwOE5PT0pMNjkzMU5FTjM3REJUUTVNTThGMQ$$.png&instId=&type=open&process=image/resize,m_fill,w_200,h_200,limit_0/quality,q_80", "downloadUrl": "/o/BO966PC16653TY08NOOJL6931NEN38DBTQ5MM9F1?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_Qk85NjZQQzE2NjUzVFkwOE5PT0pMNjkzMU5FTjM3REJUUTVNTThGMQ$$.png&instId=&type=download", "size": 123882, "url": "/o/BO966PC16653TY08NOOJL6931NEN38DBTQ5MM9F1?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_Qk85NjZQQzE2NjUzVFkwOE5PT0pMNjkzMU5FTjM3REJUUTVNTThGMQ$$.png&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_Qk85NjZQQzE2NjUzVFkwOE5PT0pMNjkzMU5FTjM3REJUUTVNTThGMQ$$.png" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osn", "label": "其他附件", "fieldData": { "value": [] } }
    ],
    // 窦桂阳
    "NDIyMzI2MTk5NTA0Mjg2NDEx": [
        { "componentName": "SelectField", "fieldId": "selectField_lxv44orx", "label": "有效身份证件", "fieldData": { "value": "身份证", "text": "身份证" }, "options": [{ "defaultChecked": false, "syncLabelValue": true, "__sid": "item_lxjzgsg1", "text": "身份证", "__sid__": "serial_lxjzgsg0", "value": "身份证", "sid": "serial_lxjzgsg0" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44ory", "label": "证件号码", "fieldData": { "value": decode("NDIyMzI2MTk5NTA0Mjg2NDEx") } },
        { "componentName": "TextField", "fieldId": "textField_lxv44orw", "label": "姓名", "fieldData": { "value": decode("56qm5qGC6Ziz") } },
        { "componentName": "SelectField", "fieldId": "selectField_mbyjhot6", "label": "区号", "fieldData": { "value": "86", "text": "+86" }, "options": [{ "defaultChecked": true, "syncLabelValue": false, "__sid": "item_megqe4lm", "text": "+86", "__sid__": "serial_megqe4ll", "value": "86", "sid": "serial_mbyjf8gm" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44orz", "label": "联系方式", "fieldData": { "value": decode("MTc3MDcxNTM3MTA=") } },
        { "componentName": "ImageField", "fieldId": "imageField_ly9i5k5q", "label": "免冠照片", "fieldData": { "value": [{ "name": "IMG_20260322_234120.png", "previewUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260322/ffe9d2fcefe5a1804c8121b0190d7862.png", "downloadUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260322/ffe9d2fcefe5a1804c8121b0190d7862.png", "size": 132385, "url": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260322/ffe9d2fcefe5a1804c8121b0190d7862.png" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osj", "label": "身份证照片", "fieldData": { "value": [{ "name": "mmexport1774193578988.jpg", "previewUrl": "/o/E2E66S91LI24L1K2H2XD54ZLK87L2F7DOX1NM8C?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_RTJFNjZTOTFMSTI0TDFLMkgyWEQ1NFpMSzg3TDJFN0RPWDFOTTdD.jpg&instId=&type=open&process=image/resize,m_fill,w_200,h_200,limit_0/quality,q_80", "downloadUrl": "/o/E2E66S91LI24L1K2H2XD54ZLK87L2F7DOX1NM8C?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_RTJFNjZTOTFMSTI0TDFLMkgyWEQ1NFpMSzg3TDJFN0RPWDFOTTdD.jpg&instId=&type=download", "size": 467704, "url": "/o/E2E66S91LI24L1K2H2XD54ZLK87L2F7DOX1NM8C?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_RTJFNjZTOTFMSTI0TDFLMkgyWEQ1NFpMSzg3TDJFN0RPWDFOTTdD.jpg&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_RTJFNjZTOTFMSTI0TDFLMkgyWEQ1NFpMSzg3TDJFN0RPWDFOTTdD.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osk", "label": "社保/在职证明", "fieldData": { "value": [{ "name": "在职证明 - 蔻.pdf", "previewUrl": "/dingtalk/mobile/APP_GRVPTEOQ6D4B7FLZFYNJ/inst/preview?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_TTBCNjZPQzFWUDE0TjNEQk9MNlMxNzdaT1FUMTJTMU9PWDFOTUtO.pdf&fileSize=41267&downloadUrl=APP_GRVPTEOQ6D4B7FLZFYNJ_TTBCNjZPQzFWUDE0TjNEQk9MNlMxNzdaT1FUMTJTMU9PWDFOTUtO.pdf", "downloadUrl": "/o/M0B66OC1VP14N3DBOL6S177ZOQT12S1OOX1NMLN?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_TTBCNjZPQzFWUDE0TjNEQk9MNlMxNzdaT1FUMTJTMU9PWDFOTUtO.pdf&instId=&type=download", "size": 41267, "url": "/o/M0B66OC1VP14N3DBOL6S177ZOQT12S1OOX1NMLN?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_TTBCNjZPQzFWUDE0TjNEQk9MNlMxNzdaT1FUMTJTMU9PWDFOTUtO.pdf&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_TTBCNjZPQzFWUDE0TjNEQk9MNlMxNzdaT1FUMTJTMU9PWDFOTUtO.pdf" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osn", "label": "其他附件", "fieldData": { "value": [] } }
    ],
    // 顾科举 (新增)
    "NDEyNzIzMTk4NTA5MjIwODNY": [
        { "componentName": "SelectField", "fieldId": "selectField_lxv44orx", "label": "有效身份证件", "fieldData": { "value": "身份证", "text": "身份证" }, "options": [{ "defaultChecked": false, "syncLabelValue": true, "__sid": "item_lxjzgsg1", "text": "身份证", "__sid__": "serial_lxjzgsg0", "value": "身份证", "sid": "serial_lxjzgsg0" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44ory", "label": "证件号码", "fieldData": { "value": decode("NDEyNzIzMTk4NTA5MjIwODNY") } },
        { "componentName": "TextField", "fieldId": "textField_lxv44orw", "label": "姓名", "fieldData": { "value": decode("6aG+56eR5Li+") } },
        { "componentName": "SelectField", "fieldId": "selectField_mbyjhot6", "label": "区号", "fieldData": { "value": "86", "text": "+86" }, "options": [{ "defaultChecked": true, "syncLabelValue": false, "__sid": "item_megqe4lm", "text": "+86", "__sid__": "serial_megqe4ll", "value": "86", "sid": "serial_mbyjf8gm" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44orz", "label": "联系方式", "fieldData": { "value": decode("MTg4NjgzOTM1MjM=") } },
        { "componentName": "ImageField", "fieldId": "imageField_ly9i5k5q", "label": "免冠照片", "fieldData": { "value": [{ "name": "1000547720.jpg", "previewUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260512/a5c2484457704efb9a3ca317899fe5db.jpg", "downloadUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260512/a5c2484457704efb9a3ca317899fe5db.jpg", "size": 342350, "url": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260512/a5c2484457704efb9a3ca317899fe5db.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osj", "label": "身份证照片", "fieldData": { "value": [{ "name": "mmexport1778582023533.jpg", "previewUrl": "/o/QMF66WA1M8N5EOODH9M6VCU3RL6J3A7IUH2PMA3?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_UU1GNjZXQTFNOE41RU9PREg5TTZWQ1UzUkw2SjNBN0lVSDJQTTkz.jpg&instId=&type=open&process=image/resize,m_fill,w_200,h_200,limit_0/quality,q_80", "downloadUrl": "/o/QMF66WA1M8N5EOODH9M6VCU3RL6J3A7IUH2PMA3?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_UU1GNjZXQTFNOE41RU9PREg5TTZWQ1UzUkw2SjNBN0lVSDJQTTkz.jpg&instId=&type=download", "size": 162217, "url": "/o/QMF66WA1M8N5EOODH9M6VCU3RL6J3A7IUH2PMA3?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_UU1GNjZXQTFNOE41RU9PREg5TTZWQ1UzUkw2SjNBN0lVSDJQTTkz.jpg&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_UU1GNjZXQTFNOE41RU9PREg5TTZWQ1UzUkw2SjNBN0lVSDJQTTkz.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osk", "label": "社保/在职证明", "fieldData": { "value": [{ "name": "在职证明 - 顾科举.pdf", "previewUrl": "/dingtalk/mobile/APP_GRVPTEOQ6D4B7FLZFYNJ/inst/preview?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_NDFINjZIOTE2OE41SlFDQlBTUjRVN0czS1pZTzNXNFBWSDJQTVky.pdf&fileSize=41602&downloadUrl=APP_GRVPTEOQ6D4B7FLZFYNJ_NDFINjZIOTE2OE41SlFDQlBTUjRVN0czS1pZTzNXNFBWSDJQTVky.pdf", "downloadUrl": "/o/41H66H9168N5JQCBPSR4U7G3KZYO3W4PVH2PMZ2?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_NDFINjZIOTE2OE41SlFDQlBTUjRVN0czS1pZTzNXNFBWSDJQTVky.pdf&instId=&type=download", "size": 41602, "url": "/o/41H66H9168N5JQCBPSR4U7G3KZYO3W4PVH2PMZ2?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_NDFINjZIOTE2OE41SlFDQlBTUjRVN0czS1pZTzNXNFBWSDJQTVky.pdf&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_NDFINjZIOTE2OE41SlFDQlBTUjRVN0czS1pZTzNXNFBWSDJQTVky.pdf" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osn", "label": "其他附件", "fieldData": { "value": [] } }
    ],
    // 周杰 (新增)
    "NTExNTI1MTk5MzA1MTAxNjE5": [
        { "componentName": "SelectField", "fieldId": "selectField_lxv44orx", "label": "有效身份证件", "fieldData": { "value": "身份证", "text": "身份证" }, "options": [{ "defaultChecked": false, "syncLabelValue": true, "__sid": "item_lxjzgsg1", "text": "身份证", "__sid__": "serial_lxjzgsg0", "value": "身份证", "sid": "serial_lxjzgsg0" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44ory", "label": "证件号码", "fieldData": { "value": decode("NTExNTI1MTk5MzA1MTAxNjE5") } },
        { "componentName": "TextField", "fieldId": "textField_lxv44orw", "label": "姓名", "fieldData": { "value": decode("5ZGo5p2w") } },
        { "componentName": "SelectField", "fieldId": "selectField_mbyjhot6", "label": "区号", "fieldData": { "value": "86", "text": "+86" }, "options": [{ "defaultChecked": true, "syncLabelValue": false, "__sid": "item_megqe4lm", "text": "+86", "__sid__": "serial_megqe4ll", "value": "86", "sid": "serial_mbyjf8gm" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44orz", "label": "联系方式", "fieldData": { "value": decode("MTU3MDU3MzM4NjY=") } },
        { "componentName": "ImageField", "fieldId": "imageField_ly9i5k5q", "label": "免冠照片", "fieldData": { "value": [{ "name": "1000547983.jpg", "previewUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260518/a28913a42bc4d5756f32379fa696dfec.jpg", "downloadUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260518/a28913a42bc4d5756f32379fa696dfec.jpg", "size": 139355, "url": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260518/a28913a42bc4d5756f32379fa696dfec.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osj", "label": "身份证照片", "fieldData": { "value": [{ "name": "mmexport1779071564782.jpg", "previewUrl": "/o/CG666H91D7N56C6HLWS1J7L6NNM92HTOALAPMDE?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_Q0c2NjZIOTFEN041NkM2SExXUzFKN0w2Tk5NOTJIVE9BTEFQTUNF.jpg&instId=&type=open&process=image/resize,m_fill,w_200,h_200,limit_0/quality,q_80", "downloadUrl": "/o/CG666H91D7N56C6HLWS1J7L6NNM92HTOALAPMDE?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_Q0c2NjZIOTFEN041NkM2SExXUzFKN0w2Tk5NOTJIVE9BTEFQTUNF.jpg&instId=&type=download", "size": 714827, "url": "/o/CG666H91D7N56C6HLWS1J7L6NNM92HTOALAPMDE?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_Q0c2NjZIOTFEN041NkM2SExXUzFKN0w2Tk5NOTJIVE9BTEFQTUNF.jpg&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_Q0c2NjZIOTFEN041NkM2SExXUzFKN0w2Tk5NOTJIVE9BTEFQTUNF.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osk", "label": "社保/在职证明", "fieldData": { "value": [{ "name": "mmexport1779071557289.jpg", "previewUrl": "/o/FHC663D1U6N5ZNWZL8NDHCX0230D20MWALAPMAE?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_RkhDNjYzRDFVNk41Wk5XWkw4TkRIQ1gwMjMwRDIwTVdBTEFQTTlF.jpg&instId=&type=open&process=image/resize,m_fill,w_200,h_200,limit_0/quality,q_80", "downloadUrl": "/o/FHC663D1U6N5ZNWZL8NDHCX0230D20MWALAPMAE?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_RkhDNjYzRDFVNk41Wk5XWkw4TkRIQ1gwMjMwRDIwTVdBTEFQTTlF.jpg&instId=&type=download", "size": 51091, "url": "/o/FHC663D1U6N5ZNWZL8NDHCX0230D20MWALAPMAE?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_RkhDNjYzRDFVNk41Wk5XWkw4TkRIQ1gwMjMwRDIwTVdBTEFQTTlF.jpg&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_RkhDNjYzRDFVNk41Wk5XWkw4TkRIQ1gwMjMwRDIwTVdBTEFQTTlF.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osn", "label": "其他附件", "fieldData": { "value": [] } }
    ],
    // =========================================================
    // 🌟 2026-05-29 新增：理德公司 4 人大部队数据包
    // =========================================================
    // 伊藤太一 (护照)
    "VE0xNjczNTg5": [
        { "componentName": "SelectField", "fieldId": "selectField_lxv44orx", "label": "有效身份证件", "fieldData": { "value": "护照", "text": "护照" }, "options": [{ "defaultChecked": false, "syncLabelValue": true, "__sid": "item_lxjzgsg2", "text": "护照", "__sid__": "serial_lxjzgsg1", "value": "护照", "sid": "serial_lxjzgsg1" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44ory", "label": "证件号码", "fieldData": { "value": decode("VE0xNjczNTg5") } },
        { "componentName": "TextField", "fieldId": "textField_lxv44orw", "label": "姓名", "fieldData": { "value": decode("5LyK6Jek5aSq5LiA") } },
        { "componentName": "SelectField", "fieldId": "selectField_mbyjhot6", "label": "区号", "fieldData": { "value": "86", "text": "+86" }, "options": [{ "defaultChecked": true, "syncLabelValue": false, "__sid": "item_megqe4lm", "text": "+86", "__sid__": "serial_megqe4ll", "value": "86", "sid": "serial_mbyjf8gm" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44orz", "label": "联系方式", "fieldData": { "value": decode("MTM2NDI1MzU3Njg=") } },
        { "componentName": "ImageField", "fieldId": "imageField_ly9i5k5q", "label": "免冠照片", "fieldData": { "value": [{ "name": "1000548641.jpg", "previewUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260529/758996d887928638673884045bc791a7.jpg", "downloadUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260529/758996d887928638673884045bc791a7.jpg", "size": 236262, "url": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260529/758996d887928638673884045bc791a7.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osj", "label": "身份证照片", "fieldData": { "value": [{ "name": "mmexport1780016063971.jpg", "previewUrl": "/o/QEF660D19R46S1E0JM4E44PVU2NJ3ZUX28QPMA2?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_UUVGNjYwRDE5UjQ2UzFFMEpNNEU0NFBWVTJOSjNaVVgyOFFQTTky.jpg&instId=&type=open&process=image/resize,m_fill,w_200,h_200,limit_0/quality,q_80", "downloadUrl": "/o/QEF660D19R46S1E0JM4E44PVU2NJ3ZUX28QPMA2?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_UUVGNjYwRDE5UjQ2UzFFMEpNNEU0NFBWVTJOSjNaVVgyOFFQTTky.jpg&instId=&type=download", "size": 79654, "url": "/o/QEF660D19R46S1E0JM4E44PVU2NJ3ZUX28QPMA2?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_UUVGNjYwRDE5UjQ2UzFFMEpNNEU0NFBWVTJOSjNaVVgyOFFQTTky.jpg&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_UUVGNjYwRDE5UjQ2UzFFMEpNNEU0NFBWVTJOSjNaVVgyOFFQTTky.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osk", "label": "社保/在职证明", "fieldData": { "value": [{ "name": "在职证明 - 理德.pdf", "previewUrl": "/dingtalk/mobile/APP_GRVPTEOQ6D4B7FLZFYNJ/inst/preview?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_QTlENjZDQzE3UTQ2WjZOQ0tVWllLNFI3MFlRVzJFU0EzOFFQTVAx.pdf&fileSize=44121&downloadUrl=APP_GRVPTEOQ6D4B7FLZFYNJ_QTlENjZDQzE3UTQ2WjZOQ0tVWllLNFI3MFlRVzJFU0EzOFFQTVAx.pdf", "downloadUrl": "/o/A9D66CC17Q46Z6NCKUZYK4R70YQW2ESA38QPMQ1?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_QTlENjZDQzE3UTQ2WjZOQ0tVWllLNFI3MFlRVzJFU0EzOFFQTVAx.pdf&instId=&type=download", "size": 44121, "url": "/o/A9D66CC17Q46Z6NCKUZYK4R70YQW2ESA38QPMQ1?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_QTlENjZDQzE3UTQ2WjZOQ0tVWllLNFI3MFlRVzJFU0EzOFFQTVAx.pdf&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_QTlENjZDQzE3UTQ2WjZOQ0tVWllLNFI3MFlRVzJFU0EzOFFQTVAx.pdf" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osn", "label": "其他附件", "fieldData": { "value": [] } }
    ],
    // 松岡 伸治 (护照)
    "VFMwNjkzODk0": [
        { "componentName": "SelectField", "fieldId": "selectField_lxv44orx", "label": "有效身份证件", "fieldData": { "value": "护照", "text": "护照" }, "options": [{ "defaultChecked": false, "syncLabelValue": true, "__sid": "item_lxjzgsg2", "text": "护照", "__sid__": "serial_lxjzgsg1", "value": "护照", "sid": "serial_lxjzgsg1" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44ory", "label": "证件号码", "fieldData": { "value": decode("VFMwNjkzODk0") } },
        { "componentName": "TextField", "fieldId": "textField_lxv44orw", "label": "姓名", "fieldData": { "value": decode("5p2+5bKhIOS8uOayuw==") } },
        { "componentName": "SelectField", "fieldId": "selectField_mbyjhot6", "label": "区号", "fieldData": { "value": "86", "text": "+86" }, "options": [{ "defaultChecked": true, "syncLabelValue": false, "__sid": "item_megqe4lm", "text": "+86", "__sid__": "serial_megqe4ll", "value": "86", "sid": "serial_mbyjf8gm" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44orz", "label": "联系方式", "fieldData": { "value": decode("MTMzMjM2NTA4NTQ=") } },
        { "componentName": "ImageField", "fieldId": "imageField_ly9i5k5q", "label": "免冠照片", "fieldData": { "value": [{ "name": "1000548644.jpg", "previewUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260529/1b861c78f1ba4c403b4006077423abf2.jpg", "downloadUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260529/1b861c78f1ba4c403b4006077423abf2.jpg", "size": 340345, "url": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260529/1b861c78f1ba4c403b4006077423abf2.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osj", "label": "身份证照片", "fieldData": { "value": [{ "name": "mmexport1780016480588.jpg", "previewUrl": "/o/8UF66GD1PQ469WJ1LN0SHAPZ18RG3HYC48QPMB1?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_OFVGNjZHRDFQUTQ2OVdKMUxOMFNIQVBaMThSRzNHWUM0OFFQTUEx.jpg&instId=&type=open&process=image/resize,m_fill,w_200,h_200,limit_0/quality,q_80", "downloadUrl": "/o/8UF66GD1PQ469WJ1LN0SHAPZ18RG3HYC48QPMB1?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_OFVGNjZHRDFQUTQ2OVdKMUxOMFNIQVBaMThSRzNHWUM0OFFQTUEx.jpg&instId=&type=download", "size": 196901, "url": "/o/8UF66GD1PQ469WJ1LN0SHAPZ18RG3HYC48QPMB1?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_OFVGNjZHRDFQUTQ2OVdKMUxOMFNIQVBaMThSRzNHWUM0OFFQTUEx.jpg&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_OFVGNjZHRDFQUTQ2OVdKMUxOMFNIQVBaMThSRzNHWUM0OFFQTUEx.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osk", "label": "社保/在职证明", "fieldData": { "value": [{ "name": "在职证明 - 理德.pdf", "previewUrl": "/dingtalk/mobile/APP_GRVPTEOQ6D4B7FLZFYNJ/inst/preview?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_SE42NjZWODE0UzQ2RTJTS01ZQVFMNUJTU0xFSjJZT0g0OFFQTVo%24.pdf&fileSize=44121&downloadUrl=APP_GRVPTEOQ6D4B7FLZFYNJ_SE42NjZWODE0UzQ2RTJTS01ZQVFMNUJTU0xFSjJZT0g0OFFQTVo$.pdf", "downloadUrl": "/o/HN666V814S46E2SKMYAQL5BSSLEJ2YOH48QPM01?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_SE42NjZWODE0UzQ2RTJTS01ZQVFMNUJTU0xFSjJZT0g0OFFQTVo$.pdf&instId=&type=download", "size": 44121, "url": "/o/HN666V814S46E2SKMYAQL5BSSLEJ2YOH48QPM01?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_SE42NjZWODE0UzQ2RTJTS01ZQVFMNUJTU0xFSjJZT0g0OFFQTVo$.pdf&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_SE42NjZWODE0UzQ2RTJTS01ZQVFMNUJTU0xFSjJZT0g0OFFQTVo$.pdf" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osn", "label": "其他附件", "fieldData": { "value": [] } }
    ],
    // 朱华芳 (身份证)
    "MzMwNzI3MTk4MjEwMjkxNjQ1": [
        { "componentName": "SelectField", "fieldId": "selectField_lxv44orx", "label": "有效身份证件", "fieldData": { "value": "身份证", "text": "身份证" }, "options": [{ "defaultChecked": false, "syncLabelValue": true, "__sid": "item_lxjzgsg1", "text": "身份证", "__sid__": "serial_lxjzgsg0", "value": "身份证", "sid": "serial_lxjzgsg0" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44ory", "label": "证件号码", "fieldData": { "value": decode("MzMwNzI3MTk4MjEwMjkxNjQ1") } },
        { "componentName": "TextField", "fieldId": "textField_lxv44orw", "label": "姓名", "fieldData": { "value": decode("5pyx5Y2O6Iqz") } },
        { "componentName": "SelectField", "fieldId": "selectField_mbyjhot6", "label": "区号", "fieldData": { "value": "86", "text": "+86" }, "options": [{ "defaultChecked": true, "syncLabelValue": false, "__sid": "item_megqe4lm", "text": "+86", "__sid__": "serial_megqe4ll", "value": "86", "sid": "serial_mbyjf8gm" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44orz", "label": "联系方式", "fieldData": { "value": decode("MTU4NDUyMzkyMzM=") } },
        { "componentName": "ImageField", "fieldId": "imageField_ly9i5k5q", "label": "免冠照片", "fieldData": { "value": [{ "name": "1000548646.jpg", "previewUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260529/112b724d4a737578111c0b9b6f1fb3d3.jpg", "downloadUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260529/112b724d4a737578111c0b9b6f1fb3d3.jpg", "size": 225579, "url": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260529/112b724d4a737578111c0b9b6f1fb3d3.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osj", "label": "身份证照片", "fieldData": { "value": [{ "name": "mmexport1780016533798.jpg", "previewUrl": "/o/8RG66CA14X26AR44G3ORW4N9RLXG2VMG58QPM0B?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_OFJHNjZDQTE0WDI2QVI0NEczT1JXNE45UkxYRzJWTUc1OFFQTVpB.jpg&instId=&type=open&process=image/resize,m_fill,w_200,h_200,limit_0/quality,q_80", "downloadUrl": "/o/8RG66CA14X26AR44G3ORW4N9RLXG2VMG58QPM0B?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_OFJHNjZDQTE0WDI2QVI0NEczT1JXNE45UkxYRzJWTUc1OFFQTVpB.jpg&instId=&type=download", "size": 146980, "url": "/o/8RG66CA14X26AR44G3ORW4N9RLXG2VMG58QPM0B?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_OFJHNjZDQTE0WDI2QVI0NEczT1JXNE45UkxYRzJWTUc1OFFQTVpB.jpg&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_OFJHNjZDQTE0WDI2QVI0NEczT1JXNE45UkxYRzJWTUc1OFFQTVpB.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osk", "label": "社保/在职证明", "fieldData": { "value": [{ "name": "在职证明 - 理德.pdf", "previewUrl": "/dingtalk/mobile/APP_GRVPTEOQ6D4B7FLZFYNJ/inst/preview?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_MkU2NjZYOTFXUDQ2Mzc4NUtMS1NBQVlPVk1VWTJEWVM1OFFQTTA0.pdf&fileSize=44121&downloadUrl=APP_GRVPTEOQ6D4B7FLZFYNJ_MkU2NjZYOTFXUDQ2Mzc4NUtMS1NBQVlPVk1VWTJEWVM1OFFQTTA0.pdf", "downloadUrl": "/o/2E666X91WP463785KLKSAAYOVMUY2EYS58QPM14?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_MkU2NjZYOTFXUDQ2Mzc4NUtMS1NBQVlPVk1VWTJEWVM1OFFQTTA0.pdf&instId=&type=download", "size": 44121, "url": "/o/2E666X91WP463785KLKSAAYOVMUY2EYS58QPM14?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_MkU2NjZYOTFXUDQ2Mzc4NUtMS1NBQVlPVk1VWTJEWVM1OFFQTTA0.pdf&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_MkU2NjZYOTFXUDQ2Mzc4NUtMS1NBQVlPVk1VWTJEWVM1OFFQTTA0.pdf" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osn", "label": "其他附件", "fieldData": { "value": [] } }
    ],
    // 贺建菲 (身份证)
    "MjEwMTEyMTk4MzA3MDQwMjMx": [
        { "componentName": "SelectField", "fieldId": "selectField_lxv44orx", "label": "有效身份证件", "fieldData": { "value": "身份证", "text": "身份证" }, "options": [{ "defaultChecked": false, "syncLabelValue": true, "__sid": "item_lxjzgsg1", "text": "身份证", "__sid__": "serial_lxjzgsg0", "value": "身份证", "sid": "serial_lxjzgsg0" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44ory", "label": "证件号码", "fieldData": { "value": decode("MjEwMTEyMTk4MzA3MDQwMjMx") } },
        { "componentName": "TextField", "fieldId": "textField_lxv44orw", "label": "姓名", "fieldData": { "value": decode("6LS65bu66I+y") } },
        { "componentName": "SelectField", "fieldId": "selectField_mbyjhot6", "label": "区号", "fieldData": { "value": "86", "text": "+86" }, "options": [{ "defaultChecked": true, "syncLabelValue": false, "__sid": "item_megqe4lm", "text": "+86", "__sid__": "serial_megqe4ll", "value": "86", "sid": "serial_mbyjf8gm" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44orz", "label": "联系方式", "fieldData": { "value": decode("MTU4MDE3NzY1NzQ=") } },
        { "componentName": "ImageField", "fieldId": "imageField_ly9i5k5q", "label": "免冠照片", "fieldData": { "value": [{ "name": "1000548650.jpg", "previewUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260529/e07a9ef6239ec8539511e3122f59bc48.jpg", "downloadUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260529/e07a9ef6239ec8539511e3122f59bc48.jpg", "size": 149785, "url": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260529/e07a9ef6239ec8539511e3122f59bc48.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osj", "label": "身份证照片", "fieldData": { "value": [{ "name": "mmexport1780016667133.jpg", "previewUrl": "/o/31H66KA1VR46812GM4RKSAPUYL4C2W4L68QPMS?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_MzFINjZLQTFWUjQ2ODEyR000UktTQVBVWUw0QzJXNEw2OFFQTVI$.jpg&instId=&type=open&process=image/resize,m_fill,w_200,h_200,limit_0/quality,q_80", "downloadUrl": "/o/31H66KA1VR46812GM4RKSAPUYL4C2W4L68QPMS?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_MzFINjZLQTFWUjQ2ODEyR000UktTQVBVWUw0QzJXNEw2OFFQTVI$.jpg&instId=&type=download", "size": 945355, "url": "/o/31H66KA1VR46812GM4RKSAPUYL4C2W4L68QPMS?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_MzFINjZLQTFWUjQ2ODEyR000UktTQVBVWUw0QzJXNEw2OFFQTVI$.jpg&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_MzFINjZLQTFWUjQ2ODEyR000UktTQVBVWUw0QzJXNEw2OFFQTVI$.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osk", "label": "社保/在职证明", "fieldData": { "value": [{ "name": "在职证明 - 理德.pdf", "previewUrl": "/dingtalk/mobile/APP_GRVPTEOQ6D4B7FLZFYNJ/inst/preview?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_MjdHNjYwQTFZUTM2RlpYNkhQSzFXQk84OUpDUDNHSVU2OFFQTVY3.pdf&fileSize=44121&downloadUrl=APP_GRVPTEOQ6D4B7FLZFYNJ_MjdHNjYwQTFZUTM2RlpYNkhQSzFXQk84OUpDUDNHSVU2OFFQTVY3.pdf", "downloadUrl": "/o/27G660A1YQ36FZX6HPK1WBO89JCP3GIU68QPMW7?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_MjdHNjYwQTFZUTM2RlpYNkhQSzFXQk84OUpDUDNHSVU2OFFQTVY3.pdf&instId=&type=download", "size": 44121, "url": "/o/27G660A1YQ36FZX6HPK1WBO89JCP3GIU68QPMW7?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_MjdHNjYwQTFZUTM2RlpYNkhQSzFXQk84OUpDUDNHSVU2OFFQTVY3.pdf&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_MjdHNjYwQTFZUTM2RlpYNkhQSzFXQk84OUpDUDNHSVU2OFFQTVY3.pdf" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osn", "label": "其他附件", "fieldData": { "value": [] } }
    ],
    // =========================================================
    // 🌟 2026-06-01 新增：樊莹烽 (A08 厂区张凯专单)
    // =========================================================
    "MzMwNjAyMTk5ODEwMjkyNTEy": [
        { "componentName": "SelectField", "fieldId": "selectField_lxv44orx", "label": "有效身份证件", "fieldData": { "value": "身份证", "text": "身份证" }, "options": [{ "defaultChecked": false, "syncLabelValue": true, "__sid": "item_lxjzgsg1", "text": "身份证", "__sid__": "serial_lxjzgsg0", "value": "身份证", "sid": "serial_lxjzgsg0" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44ory", "label": "证件号码", "fieldData": { "value": decode("MzMwNjAyMTk5ODEwMjkyNTEy") } },
        { "componentName": "TextField", "fieldId": "textField_lxv44orw", "label": "姓名", "fieldData": { "value": "樊莹烽" } }, // 🛡️ 纯正汉字防乱码
        { "componentName": "SelectField", "fieldId": "selectField_mbyjhot6", "label": "区号", "fieldData": { "value": "86", "text": "+86" }, "options": [{ "defaultChecked": true, "syncLabelValue": false, "__sid": "item_megqe4lm", "text": "+86", "__sid__": "serial_megqe4ll", "value": "86", "sid": "serial_mbyjf8gm" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44orz", "label": "联系方式", "fieldData": { "value": decode("MTg4ODg2ODc2ODY=") } },
        { "componentName": "ImageField", "fieldId": "imageField_ly9i5k5q", "label": "免冠照片", "fieldData": { "value": [{ "name": "1000548927.jpg", "previewUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260601/22489ca28259801c0160e036e61c7739.jpg", "downloadUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260601/22489ca28259801c0160e036e61c7739.jpg", "size": 165909, "url": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260601/22489ca28259801c0160e036e61c7739.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osj", "label": "身份证照片", "fieldData": { "value": [{ "name": "mmexport1780275874829.jpg", "previewUrl": "/o/3VF66W714X26WTA3GN0S164ORVAB37OQMIUPMJG?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_M1ZGNjZXNzE0WDI2V1RBM0dOMFMxNjRPUlZBQjM3T1FNSVVQTUlH.jpg&instId=&type=open&process=image/resize,m_fill,w_200,h_200,limit_0/quality,q_80", "downloadUrl": "/o/3VF66W714X26WTA3GN0S164ORVAB37OQMIUPMJG?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_M1ZGNjZXNzE0WDI2V1RBM0dOMFMxNjRPUlZBQjM3T1FNSVVQTUlH.jpg&instId=&type=download", "size": 165080, "url": "/o/3VF66W714X26WTA3GN0S164ORVAB37OQMIUPMJG?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_M1ZGNjZXNzE0WDI2V1RBM0dOMFMxNjRPUlZBQjM3T1FNSVVQTUlH.jpg&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_M1ZGNjZXNzE0WDI2V1RBM0dOMFMxNjRPUlZBQjM3T1FNSVVQTUlH.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osk", "label": "社保/在职证明", "fieldData": { "value": [{ "name": "3_在职证明.pdf", "previewUrl": "/dingtalk/mobile/APP_GRVPTEOQ6D4B7FLZFYNJ/inst/preview?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_WTlINjY0NzFaTzQ2S0owWkYxV1IzRDA4M1RGVTNTV09OSVVQTTE2.pdf&fileSize=164619&downloadUrl=APP_GRVPTEOQ6D4B7FLZFYNJ_WTlINjY0NzFaTzQ2S0owWkYxV1IzRDA4M1RGVTNTV09OSVVQTTE2.pdf", "downloadUrl": "/o/Y9H66471ZO46KJ0ZF1WR3D083TFU3SWONIUPM26?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_WTlINjY0NzFaTzQ2S0owWkYxV1IzRDA4M1RGVTNTV09OSVVQTTE2.pdf&instId=&type=download", "size": 164619, "url": "/o/Y9H66471ZO46KJ0ZF1WR3D083TFU3SWONIUPM26?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_WTlINjY0NzFaTzQ2S0owWkYxV1IzRDA4M1RGVTNTV09OSVVQTTE2.pdf&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_WTlINjY0NzFaTzQ2S0owWkYxV1IzRDA4M1RGVTNTV09OSVVQTTE2.pdf" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osn", "label": "其他附件", "fieldData": { "value": [] } }
    ],
    // =========================================================
    // 🌟 2026-07-13 新增：王報平 (A8 访客单申请)
    // =========================================================
    "NDIxMjIyMTk5MDAzMTQwMTEz": [
        { "componentName": "SelectField", "fieldId": "selectField_lxv44orx", "label": "有效身份证件", "fieldData": { "value": "身份证", "text": "身份证" }, "options": [{ "defaultChecked": false, "syncLabelValue": true, "__sid": "item_lxjzgsg1", "text": "身份证", "__sid__": "serial_lxjzgsg0", "value": "身份证", "sid": "serial_lxjzgsg0" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44ory", "label": "证件号码", "fieldData": { "value": decode("NDIxMjIyMTk5MDAzMTQwMTEz") } },
        { "componentName": "TextField", "fieldId": "textField_lxv44orw", "label": "姓名", "fieldData": { "value": "王報平" } }, // 🛡️ 纯正汉字防乱码
        { "componentName": "SelectField", "fieldId": "selectField_mbyjhot6", "label": "区号", "fieldData": { "value": "86", "text": "+86" }, "options": [{ "defaultChecked": true, "syncLabelValue": false, "__sid": "item_megqe4lm", "text": "+86", "__sid__": "serial_megqe4ll", "value": "86", "sid": "serial_mbyjf8gm" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44orz", "label": "联系方式", "fieldData": { "value": decode("MTU5OTAzNDE2Mjc=") } },
        { "componentName": "ImageField", "fieldId": "imageField_ly9i5k5q", "label": "免冠照片", "fieldData": { "value": [{ "name": "1000889190.jpg", "previewUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260713/4348d3cb85d2daf4697f94033bd987da.jpg", "downloadUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260713/4348d3cb85d2daf4697f94033bd987da.jpg", "size": 118898, "url": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260713/4348d3cb85d2daf4697f94033bd987da.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osj", "label": "身份证照片", "fieldData": { "value": [{ "name": "mmexport1783921213473.jpg", "previewUrl": "/o/ZXH66LC1A9F7BHAAIA2L8CZ6CZNE3YQBSSIRMI1?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_WlhINjZMQzFBOUY3QkhBQUlBMkw4Q1o2Q1pORTNZUUJTU0lSTUgx.jpg&instId=&type=open&process=image/resize,m_fill,w_200,h_200,limit_0/quality,q_80", "downloadUrl": "/o/ZXH66LC1A9F7BHAAIA2L8CZ6CZNE3YQBSSIRMI1?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_WlhINjZMQzFBOUY3QkhBQUlBMkw4Q1o2Q1pORTNZUUJTU0lSTUgx.jpg&instId=&type=download", "size": 204901, "url": "/o/ZXH66LC1A9F7BHAAIA2L8CZ6CZNE3YQBSSIRMI1?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_WlhINjZMQzFBOUY3QkhBQUlBMkw4Q1o2Q1pORTNZUUJTU0lSTUgx.jpg&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_WlhINjZMQzFBOUY3QkhBQUlBMkw4Q1o2Q1pORTNZUUJTU0lSTUgx.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osk", "label": "社保/在职证明", "fieldData": { "value": [{ "name": "mmexport1783921026647.jpg", "previewUrl": "/o/M9H669B1YCF760TZMFWYFDCRGEKP2PGMSSIRMH?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_TTlINjY5QjFZQ0Y3NjBUWk1GV1lGRENSR0VLUDJQR01TU0lSTUc$.jpg&instId=&type=open&process=image/resize,m_fill,w_200,h_200,limit_0/quality,q_80", "downloadUrl": "/o/M9H669B1YCF760TZMFWYFDCRGEKP2PGMSSIRMH?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_TTlINjY5QjFZQ0Y3NjBUWk1GV1lGRENSR0VLUDJQR01TU0lSTUc$.jpg&instId=&type=download", "size": 136392, "url": "/o/M9H669B1YCF760TZMFWYFDCRGEKP2PGMSSIRMH?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_TTlINjY5QjFZQ0Y3NjBUWk1GV1lGRENSR0VLUDJQR01TU0lSTUc$.jpg&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_TTlINjY5QjFZQ0Y3NjBUWk1GV1lGRENSR0VLUDJQR01TU0lSTUc$.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osn", "label": "其他附件", "fieldData": { "value": [] } }
    ],
    // =========================================================
    // 🌟 2026-07-31 新增：韩于克 (QA08 厂区曹斗专单)
    // =========================================================
    "NDExMzI0MjAwMzEyMjUyNDFY": [
        { "componentName": "SelectField", "fieldId": "selectField_lxv44orx", "label": "有效身份证件", "fieldData": { "value": "身份证", "text": "身份证" }, "options": [{ "defaultChecked": false, "syncLabelValue": true, "__sid": "item_lxjzgsg1", "text": "身份证", "__sid__": "serial_lxjzgsg0", "value": "身份证", "sid": "serial_lxjzgsg0" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44ory", "label": "证件号码", "fieldData": { "value": decode("NDExMzI0MjAwMzEyMjUyNDFY") } },
        { "componentName": "TextField", "fieldId": "textField_lxv44orw", "label": "姓名", "fieldData": { "value": "韩于克" } }, // 🛡️ 纯正汉字防乱码
        { "componentName": "SelectField", "fieldId": "selectField_mbyjhot6", "label": "区号", "fieldData": { "value": "86", "text": "+86" }, "options": [{ "defaultChecked": true, "syncLabelValue": false, "__sid": "item_megqe4lm", "text": "+86", "__sid__": "serial_megqe4ll", "value": "86", "sid": "serial_mbyjf8gm" }] },
        { "componentName": "TextField", "fieldId": "textField_lxv44orz", "label": "联系方式", "fieldData": { "value": decode("MTk4MzY3NTc3Njg=") } },
        { "componentName": "ImageField", "fieldId": "imageField_ly9i5k5q", "label": "免冠照片", "fieldData": { "value": [{ "name": "1000890278.jpg", "previewUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260730/c1edd71fa41e077bab35564d0a47e19f.jpg", "downloadUrl": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260730/c1edd71fa41e077bab35564d0a47e19f.jpg", "size": 99750, "url": "https://dingtalk.avaryholding.com:8443/dingplus/image/20260730/c1edd71fa41e077bab35564d0a47e19f.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osj", "label": "身份证照片", "fieldData": { "value": [{ "name": "mmexport1785403383059.jpg", "previewUrl": "/o/BO966PC1BWW7ZKYQMGLLICAR8UKD2PJ25B7SML1?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_Qk85NjZQQzFCV1c3WktZUU1HTExJQ0FSOFVLRDJQSjI1QjdTTUsx.jpg&instId=&type=open&process=image/resize,m_fill,w_200,h_200,limit_0/quality,q_80", "downloadUrl": "/o/BO966PC1BWW7ZKYQMGLLICAR8UKD2PJ25B7SML1?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_Qk85NjZQQzFCV1c3WktZUU1HTExJQ0FSOFVLRDJQSjI1QjdTTUsx.jpg&instId=&type=download", "size": 71194, "url": "/o/BO966PC1BWW7ZKYQMGLLICAR8UKD2PJ25B7SML1?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_Qk85NjZQQzFCV1c3WktZUU1HTExJQ0FSOFVLRDJQSjI1QjdTTUsx.jpg&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_Qk85NjZQQzFCV1c3WktZUU1HTExJQ0FSOFVLRDJQSjI1QjdTTUsx.jpg" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osk", "label": "社保/在职证明", "fieldData": { "value": [{ "name": "在职证明 - 韩.pdf", "previewUrl": "/dingtalk/mobile/APP_GRVPTEOQ6D4B7FLZFYNJ/inst/preview?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_S0tDNjZTODFYVlc3QUFYTElDMk0wNDcxTlBaUTJNRERBQjdTTUsy.pdf&fileSize=40997&downloadUrl=APP_GRVPTEOQ6D4B7FLZFYNJ_S0tDNjZTODFYVlc3QUFYTElDMk0wNDcxTlBaUTJNRERBQjdTTUsy.pdf", "downloadUrl": "/o/KKC66S81XVW7AAXLIC2M0471NPZQ2MDDAB7SML2?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_S0tDNjZTODFYVlc3QUFYTElDMk0wNDcxTlBaUTJNRERBQjdTTUsy.pdf&instId=&type=download", "size": 40997, "url": "/o/KKC66S81XVW7AAXLIC2M0471NPZQ2MDDAB7SML2?appType=APP_GRVPTEOQ6D4B7FLZFYNJ&fileName=APP_GRVPTEOQ6D4B7FLZFYNJ_S0tDNjZTODFYVlc3QUFYTElDMk0wNDcxTlBaUTJNRERBQjdTTUsy.pdf&instId=&type=download", "fileUuid": "APP_GRVPTEOQ6D4B7FLZFYNJ_S0tDNjZTODFYVlc3QUFYTElDMk0wNDcxTlBaUTJNRERBQjdTTUsy.pdf" }] } },
        { "componentName": "AttachmentField", "fieldId": "attachmentField_lxv44osn", label: "其他附件", "fieldData": { "value": [] } }
    ],
    
};


const FORM_BASE = [
    { "componentName": "SerialNumberField", "fieldId": "serialNumberField_lxn9o9dx", "label": "单号信息", "fieldData": {} },
    { "componentName": "TextField", "fieldId": "textField_lxn9o9e0", "label": "申请类型", "fieldData": { "value": "一般访客" } },
    { "componentName": "TextField", "fieldId": "textField_ly2ugh3m", "label": "申请人ID", "fieldData": { "value": "17614625112" } },
    { "componentName": "TextField", "fieldId": "textField_lydnpzas", "label": "地区代码", "fieldData": { "value": "QHD" } },
    { "componentName": "TextField", "fieldId": "textField_ly3uw4as", "label": "法人代码", "fieldData": { "value": "1070" } },
    { "componentName": "TextField", "fieldId": "textField_ly3uw4ar", "label": "园区代码", "fieldData": { "value": "QA" } },
    { "componentName": "TextField", "fieldId": "textField_m2lk8mr2", "label": "供应商code", "fieldData": { "value": "" } },
    { "componentName": "RadioField", "fieldId": "radioField_m4g9sf7c", "label": "是否外籍", "fieldData": { "value": "否", "text": "否" }, "options": [{ "defaultChecked": true, "syncLabelValue": true, "__sid": "item_m4g9skpu", "text": "否", "__sid__": "serial_m4g9skpu", "value": "否", "sid": "serial_m4g9skpu" }] },
    { "componentName": "SelectField", "fieldId": "selectField_ly3o95xh", "label": "到访园区", "fieldData": { "value": "秦皇岛园区", "text": "秦皇岛园区" }, "options": [{ "value": "秦皇岛园区", "text": "秦皇岛园区" }] },
    { "componentName": "SelectField", "fieldId": "selectField_ly3o95xf", "label": "到访公司", "fieldData": { "value": "宏启胜精密电子(秦皇岛)有限公司", "text": "宏启胜精密电子(秦皇岛)有限公司" }, "options": [{ "value": "宏启胜精密电子(秦皇岛)有限公司", "text": "宏启胜精密电子(秦皇岛)有限公司" }] },
    { "componentName": "SelectField", "fieldId": "selectField_lxn9o9eb", "label": "身份类型", "fieldData": { "value": "生产服务（厂商）", "text": "生产服务（厂商）" }, "options": [{ "value": "生产服务（厂商）", "text": "生产服务（厂商）" }] },
    { "componentName": "SelectField", "fieldId": "selectField_lxn9o9ed", "label": "服务性质/到访事由", "fieldData": { "value": "设备维护", "text": "设备维护" }, "options": [{ "value": "设备维护", "text": "设备维护" }] },
    { "componentName": "SelectField", "fieldId": "selectField_lxn9o9ei", "label": "到访区域", "fieldData": { "value": "进入制造现场", "text": "进入车间/管制区域" }, "options": [{ "defaultChecked": false, "syncLabelValue": false, "__sid": "item_m56iixss", "text": "进入车间/管制区域", "__sid__": "serial_m56iixsp", "value": "进入制造现场", "sid": "serial_khe7yak4" }] },
    { "componentName": "TextareaField", "fieldId": "textareaField_lxn9o9eg", "label": "服务/事由描述", "fieldData": { "value": "设备维护与保养" } },
    // {"componentName":"SelectField","fieldId":"selectField_lxn9o9em","label":"所属公司","fieldData":{"value":"VCN01135(昆山友景电路板测试有限公司)"},"options":[]},
    { "componentName": "TextField", "fieldId": "textField_lxn9o9gc", "label": "所属公司/单位名称", "fieldData": { "value": "VCN01135(昆山友景电路板测试有限公司)" } },
    { "componentName": "RadioField", "fieldId": "radioField_lzs3fswt", "label": "是否为竞商？", "fieldData": { "value": "否", "text": "否" }, "options": [{ "defaultChecked": false, "syncLabelValue": true, "__sid": "item_lzs3ftx2", "text": "否", "__sid__": "serial_lzs3ftx2", "value": "否", "sid": "serial_lzs3ftx2" }] }
];

const FORM_TAIL = [
    // {"componentName":"TextField","fieldId":"textField_lxn9o9f9","label":"接待人工号","fieldData":{"value":"61990794"}},
    // {"componentName":"TextField","fieldId":"textField_lxn9o9f7","label":"接待人员","fieldData":{"value":"王晗"}},
    // {"componentName":"TextField","fieldId":"textField_lxn9o9fc","label":"接待部门","fieldData":{"value":"QA08設備五課"}},
    // {"componentName":"TextField","fieldId":"textField_lxn9o9fe","label":"接待人联系方式","fieldData":{"value":"17531114022"}},
    { "componentName": "TextField", "fieldId": "textField_lxn9o9f9", "label": "接待人工号", "fieldData": { "value": "62090782" } },
    { "componentName": "TextField", "fieldId": "textField_lxn9o9f7", "label": "接待人员", "fieldData": { "value": "曹斗" } },
    { "componentName": "TextField", "fieldId": "textField_lxn9o9fc", "label": "接待部门", "fieldData": { "value": "QA08設備五課" } },
    { "componentName": "TextField", "fieldId": "textField_lxn9o9fe", "label": "接待人联系方式", "fieldData": { "value": "17303358689" } },
    { "componentName": "TextField", "fieldId": "textField_m4c5a419", "label": "涉外签核", "fieldData": { "value": "61990414" } },
    { "componentName": "TextField", "fieldId": "textField_m4c5a41a", "label": "门岗保安", "fieldData": { "value": "15232353238" } }
];

const A08_TEMPLATE = [];
FORM_BASE.forEach(item => A08_TEMPLATE.push({ type: 'STATIC', item }));
A08_TEMPLATE.push({ type: 'INJECT_TABLE' });
FORM_TAIL.slice(0, 4).forEach(item => A08_TEMPLATE.push({ type: 'STATIC', item }));
A08_TEMPLATE.push({
    type: 'INJECT_DATE_TS',
    template: {
        "componentName": "DateField",
        "fieldId": "dateField_lxn9o9fh",
        "label": "到访日期",
        "fieldData": { "value": 0 },
        "format": "yyyy-MM-dd"
    }
});
// 👇 🌟 新增：紧跟在时间戳后面，注入官方要求的新文本日期字段
A08_TEMPLATE.push({
    type: 'INJECT_DATE_STR',
    template: {
        "componentName": "TextField",
        "fieldId": "textField_mjdmoase",
        "label": "到访日期文本",
        "fieldData": { "value": "" }
    }
});
FORM_TAIL.slice(4).forEach(item => A08_TEMPLATE.push({ type: 'STATIC', item }));

// ==========================================
// Q01 自动化深度克隆解析区 (严格一致性保证)
// ==========================================
let Q01_PERSON_DB = {};
let Q01_ORIGINAL_ORDER = {}; // 核心：记录 bin 文件中的原生人物顺序
let Q01_TEMPLATE_JSON = null; // 核心：整个 JSON 树直接深拷贝
let Q01_URL_PARAMS = null;    // 核心：保存所有的外层发包参数

try {
    const binPath = path.join(__dirname, '..', '..', 'QA01_request_body.bin');
    if (fs.existsSync(binPath)) {
        const rawContent = fs.readFileSync(binPath, 'utf-8');
        Q01_URL_PARAMS = new URLSearchParams(rawContent);

        const valueStr = Q01_URL_PARAMS.get('value');
        if (valueStr) {
            Q01_TEMPLATE_JSON = JSON.parse(valueStr);

            Q01_TEMPLATE_JSON.forEach(item => {
                if (item.componentName === 'TableField' && item.label && item.label.includes('人员')) {
                    const peopleArrays = item.fieldData.value;
                    peopleArrays.forEach((personArr, index) => {
                        const idField = personArr.find(f => String(f.label).includes('证件号码'));
                        if (idField && idField.fieldData && idField.fieldData.value) {
                            const rawIdStr = String(idField.fieldData.value);
                            const base64Id = Buffer.from(rawIdStr).toString('base64');
                            Q01_PERSON_DB[base64Id] = personArr;
                            Q01_ORIGINAL_ORDER[base64Id] = index; // 【关键】锁死他们在抓包里的原生顺序！
                        }
                    });
                }
            });
            console.log(`✅ QA01_request_body.bin 解析成功，提取 ${Object.keys(Q01_PERSON_DB).length} 个人员原生配置`);
        }
    } else {
        console.warn("⚠️ 找不到 QA01_request_body.bin 文件，Q01 厂区组包功能将不可用！");
    }
} catch (e) {
    console.error("❌ 解析 QA01_request_body.bin 失败:", e.message);
}

const LOC_CONFIGS = {
    'A08': {
        // A08 的门禁阈值
        renewThreshold: 2,
        renewDays: 7,
        title: "A08 厂区",
        enabled: true,

        // 👇 A08 账号身份凭证 (原封不动)
        csrf_token: "e7daa879-7b83-40f7-8335-1a262747f2c9",
        cookie: "tianshu_corp_user=ding2b4c83bec54a29c6f2c783f7214b6d69_FREEUSER; tianshu_csrf_token=e7daa879-7b83-40f7-8335-1a262747f2c9; c_csrf=e7daa879-7b83-40f7-8335-1a262747f2c9; cookie_visitor_id=zfGITZnn; cna=QhOGIdjbQ3ABASQOBEFsQ0YG; xlly_s=1; tianshu_app_type=APP_GRVPTEOQ6D4B7FLZFYNJ; JSESSIONID=BF2C6304A367F22183E99C3E5B5181C4; tfstk=gOZxf6D0ah_YmbR2H5blSie9vWyOMa2qeSyBjfcD57F8iJ8615qgycFzMIcmSS4-67N-GjmfQ1Fun54imlewXAw__tlG3a243co1t6qOx-yqEsPFbo36NgwrKxT1rqiRmR_At6jhqZ9SXsC3nq6jmbMZNxMXlE6-VAH6fcgjG36-CAAX5jN_FThrQAOXfhG5VAkB5ci_186-QbGsfqN_FTHZNf91kGhG5b-Tu6E2PQTVe3t72x3x1HG9XDqyxFGLhbtMyWMxkt2jwht_4PdnXxc1VBhaV5nIku6MWXnrwAHYDOYE_yDTCvnBhny8G7ZKRufyjfsyqkqd5-AnU0LfeTLw7qMrh42tpxCQDiM-tTfH7FuY8YhheTLw7qMreXXrUF8Zky5..; isg=BJCQbJGPzSIDPJDoHxPbfgneatziWXSjkwUE44pgG-BuxflvPmhTMY7zmMuAWSx7",
        // 🔪 新增：明确 A08 厂区大部队的常规接待人 (用于精准过滤普通组记录)
        normalReceptionistId: "62090782", // 曹斗的工号
        query: {
            visitorIdNos: [
                "MTMwMzIzMTk4NjAyMjgwODFY",  //康
                "MTMwMzIyMTk4ODA2MjQyMDE4", //张
                "MjMwMjMwMjAwMzAxMDEyMTM1", //孙
                "MTMxMTIxMTk4OTAxMDU1MDEx",  //王
                // "NDEwNDIzMTk4OTA3MjIxNTMw", //田
                // "NDMyOTAxMTk4MjExMDUyMDE2", //兰（凌嘉）
                // "NDEwOTIzMTk4ODA3MTkxMDFY", //卞（凌嘉）
                // "MDMwNzE3Njg", //贾
                "MTMwNDI1MTk4OTA4MjkwMzE0", //姜
                // "MTAyNDE5NDY=", //林
                // "MDczOTM0Njc=", //陈
                // "NDIyMzI2MTk5NTA0Mjg2NDEx", // 窦
                // "NDEyNzIzMTk4NTA5MjIwODNY",  // 顾
                // "NTExNTI1MTk5MzA1MTAxNjE5",  // 👇 新增：周杰
                // 👇 🌟 2026-05-29 新增：理德 4 人大部队
                // "VE0xNjczNTg5",              // 伊藤太一
                // "VFMwNjkzODk0",              // 松岡 伸治
                // "MzMwNzI3MTk4MjEwMjkxNjQ1",  // 朱华芳
                // "MjEwMTEyMTk4MzA3MDQwMjMx",   // 贺建菲
                // "MzMwNjAyMTk5ODEwMjkyNTEy",   // 👇 🌟 2026-06-01 新增：樊莹烽
                "NDIxMjIyMTk5MDAzMTQwMTEz",  // 👇 🌟 2026-07-13 新增：王報平
                "NDExMzI0MjAwMzEyMjUyNDFY"
            ],
            regPerson: "17614625112",
            acToken: "E5EF067A42A792436902EB275DCCA379812FF4A4A8A756BE0A1659704557309F",
            queryUrl: "https://dingtalk.avaryholding.com:8443/dingplus/visitorConnector/visitorStatus"
        },
        personDb: PERSON_DB,

        // 【新增功能】：支持在这里配置专属的接待人信息
        customReceptionists: {
            // 康伟强
            "MTMwMzIzMTk4NjAyMjgwODFY": {
                // receptionistId: "A2449801",
                // receptionistName: "龚旭明",
                // receptionDepartment: "QA01設備五課",
                // receptionistPhone: "17703340319",

                // receptionistId: "A2319601",
                // receptionistName: "赵海富",
                // receptionDepartment: "QA01設備五課",
                // receptionistPhone: "17643042011",

                // receptionistId: "A2451885",
                // receptionistName: "张凯",
                // receptionDepartment: "QA01工程技術五課",
                // receptionistPhone: "15032303506",

                receptionistId: "61908845",
                receptionistName: "李泊绪",
                receptionDepartment: "QA01測試組",
                receptionistPhone: "15133557787",
                visitReason: "设备维护与保养",
                keepNormal: true,             // 🌟 核心：设为 true，系统就会为他发一份指定的包，再跟大部队发一份原始包！
                renewThreshold: 2,            // 独立：剩0天时触发专属包
                renewDays: 7                  // 独立：一次续2天
            },
            // 张强
            "MTMwMzIyMTk4ODA2MjQyMDE4": {
                // receptionistId: "A2449801",
                // receptionistName: "龚旭明",
                // receptionDepartment: "QA01設備五課",
                // receptionistPhone: "17703340319",

                // receptionistId: "A2319601",
                // receptionistName: "赵海富",
                // receptionDepartment: "QA01設備五課",
                // receptionistPhone: "17643042011",

                // receptionistId: "A2451885",
                // receptionistName: "张凯",
                // receptionDepartment: "QA01工程技術五課",
                // receptionistPhone: "15032303506",

                receptionistId: "61908845",
                receptionistName: "李泊绪",
                receptionDepartment: "QA01測試組",
                receptionistPhone: "15133557787",
                visitReason: "设备维护与保养",
                keepNormal: true,           // 🌟 核心：设为 true，同样双开！
                renewThreshold: 2,            // 独立：剩0天时触发专属包
                renewDays: 7               // 独立：一次续2天
            },
            //  姜建龙
            "MTMwNDI1MTk4OTA4MjkwMzE0": {
                // receptionistId: "A2449801",
                // receptionistName: "龚旭明",
                // receptionDepartment: "QA01設備五課",
                // receptionistPhone: "17703340319",

                // receptionistId: "A2319601",
                // receptionistName: "赵海富",
                // receptionDepartment: "QA01設備五課",
                // receptionistPhone: "17643042011",

                // receptionistId: "A2451885",
                // receptionistName: "张凯",
                // receptionDepartment: "QA01工程技術五課",
                // receptionistPhone: "15032303506",

                receptionistId: "61908845",
                receptionistName: "李泊绪",
                receptionDepartment: "QA01測試組",
                receptionistPhone: "15133557787",
                visitReason: "设备维护与保养",
                keepNormal: true,           // 🌟 核心：设为 true，同样双开！
                renewThreshold: 2,            // 独立：剩0天时触发专属包
                renewDays: 7                  // 独立：一次续2天
            },
            // 王菁
            "MTMxMTIxMTk4OTAxMDU1MDEx": {
            //     receptionistId: "A2449801",
            //     receptionistName: "龚旭明",
            //     receptionDepartment: "QA01設備五課",
            //     receptionistPhone: "17703340319",
            //     visitReason: "设备维护与保养",
            //     keepNormal: true,           // 🌟 核心：设为 true，同样双开！
            //     renewThreshold:0,            // 独立：剩0天时触发专属包
            //     renewDays: 2                  // 独立：一次续2天

            receptionistId: "61908845",
                receptionistName: "李泊绪",
                receptionDepartment: "QA01測試組",
                receptionistPhone: "15133557787",
                visitReason: "设备维护与保养",
                keepNormal: true,           // 🌟 核心：设为 true，同样双开！
                renewThreshold: 2,            // 独立：剩0天时触发专属包
                renewDays: 7,
            },
            //  孙德凯
            "MjMwMjMwMjAwMzAxMDEyMTM1": {
                // receptionistId: "A2449801",
                // receptionistName: "龚旭明",
                // receptionDepartment: "QA01設備五課",
                // receptionistPhone: "17703340319",

                // receptionistId: "A2319601",
                // receptionistName: "赵海富",
                // receptionDepartment: "QA01設備五課",
                // receptionistPhone: "17643042011",

                // receptionistId: "A2451885",
                // receptionistName: "张凯",
                // receptionDepartment: "QA01工程技術五課",
                // receptionistPhone: "15032303506",

                receptionistId: "61908845",
                receptionistName: "李泊绪",
                receptionDepartment: "QA01測試組",
                receptionistPhone: "15133557787",
                visitReason: "设备维护与保养",
                keepNormal: true,           // 🌟 核心：设为 true，同样双开！
                renewThreshold: 2,            // 独立：剩0天时触发专属包
                renewDays: 7                  // 独立：一次续2天
            },
            //  窦桂阳
            // "NDIyMzI2MTk5NTA0Mjg2NDEx": {
            // receptionistId: "A2449801",
            // receptionistName: "龚旭明",
            // receptionDepartment: "QA01設備五課",
            // receptionistPhone: "17703340319",

            // receptionistId: "A2319601",
            // receptionistName: "赵海富",
            // receptionDepartment: "QA01設備五課",
            // receptionistPhone: "17643042011",

            // receptionistId: "A2451885",
            // receptionistName: "张凯",
            // receptionDepartment: "QA01工程技術五課",
            // receptionistPhone: "15032303506",

            //     receptionistId: "61908845",
            //     receptionistName: "李泊绪",
            //     receptionDepartment: "QA01測試組",
            //     receptionistPhone: "15133557787",
            //     visitReason: "设备维护与保养",
            //     keepNormal: true,           // 🌟 核心：设为 true，同样双开！
            //     renewThreshold: 2,            // 独立：剩0天时触发专属包
            //     renewDays: 7                  // 独立：一次续2天
            // },
            // 顾
            // "NDEyNzIzMTk4NTA5MjIwODNY": {
            // receptionistId: "A2449801",
            // receptionistName: "龚旭明",
            // receptionDepartment: "QA01設備五課",
            // receptionistPhone: "17703340319",

            // receptionistId: "A2319601",
            // receptionistName: "赵海富",
            // receptionDepartment: "QA01設備五課",
            // receptionistPhone: "17643042011",

            // receptionistId: "A2451885",
            // receptionistName: "张凯",
            // receptionDepartment: "QA01工程技術五課",
            // receptionistPhone: "15032303506",

            // receptionistId: "61908845",
            // receptionistName: "李泊绪",
            // receptionDepartment: "QA01測試組",
            // receptionistPhone: "15133557787",
            // visitReason: "设备维护与保养",
            // keepNormal: false,             // 🌟 核心：设为 true，系统就会为他发一份指定的包，再跟大部队发一份原始包！
            // renewThreshold: 2,            // 独立：剩0天时触发专属包
            // renewDays: 7                  // 独立：一次续2天
            // },
            // 周杰
            // "NTExNTI1MTk5MzA1MTAxNjE5": {
            // receptionistId: "A2449801",
            // receptionistName: "龚旭明",
            // receptionDepartment: "QA01設備五課",
            // receptionistPhone: "17703340319",

            // receptionistId: "A2319601",
            // receptionistName: "赵海富",
            // receptionDepartment: "QA01設備五課",
            // receptionistPhone: "17643042011",

            // receptionistId: "A2451885",
            // receptionistName: "张凯",
            // receptionDepartment: "QA01工程技術五課",
            // receptionistPhone: "15032303506",

            //     receptionistId: "61908845",
            //     receptionistName: "李泊绪",
            //     receptionDepartment: "QA01測試組",
            //     receptionistPhone: "15133557787",
            //     visitReason: "设备维护与保养",
            //     keepNormal: false,             // 🌟 核心：设为 true，系统就会为他发一份指定的包，再跟大部队发一份原始包！
            //     renewThreshold: 2,            // 独立：剩0天时触发专属包
            //     renewDays: 7                  // 独立：一次续2天
            // },
            // =========================================================
            // 🌟 2026-05-29 新增：理德 4 人组专属独立轨迹配置 (不跟常规大部队拼车)
            // =========================================================
            // // 伊藤太一
            // "VE0xNjczNTg5": {
            //     receptionistId: "A2451885",
            //     receptionistName: "张凯",
            //     receptionDepartment: "QA01工程技術五課",
            //     receptionistPhone: "15032303506",
            //     visitReason: "设备维护与保养",
            //     keepNormal: false,             // ❌ 彻底关闭大部队双开通道，只认李工的专单！
            //     renewThreshold: 2,             // 独立门禁剩余 2 天或以下触发续期
            //     renewDays: 7                   // 触发时单次续 7 天
            // },
            // // 松岡 伸治
            // "VFMwNjkzODk0": {
            //     receptionistId: "A2451885",
            //     receptionistName: "张凯",
            //     receptionDepartment: "QA01工程技術五課",
            //     receptionistPhone: "15032303506",
            //     visitReason: "设备维护与保养",
            //     keepNormal: false,             // ❌ 彻底关闭大部队双开通道
            //     renewThreshold: 2,
            //     renewDays: 7
            // },
            // // 朱华芳
            // "MzMwNzI3MTk4MjEwMjkxNjQ1": {
            //     receptionistId: "A2451885",
            //     receptionistName: "张凯",
            //     receptionDepartment: "QA01工程技術五課",
            //     receptionistPhone: "15032303506",
            //     visitReason: "设备维护与保养",
            //     keepNormal: false,             // ❌ 彻底关闭大部队双开通道
            //     renewThreshold: 2,
            //     renewDays: 7
            // },
            // // 贺建菲
            // "MjEwMTEyMTk4MzA3MDQwMjMx": {
            //     receptionistId: "A2451885",
            //     receptionistName: "张凯",
            //     receptionDepartment: "QA01工程技術五課",
            //     receptionistPhone: "15032303506",
            //     visitReason: "设备维护与保养",
            //     keepNormal: false,             // ❌ 彻底关闭大部队双开通道
            //     renewThreshold: 2,
            //     renewDays: 7
            // },
            // // 樊莹烽
            // "MzMwNjAyMTk5ODEwMjkyNTEy": {
            //     receptionistId: "A2451885",
            //     receptionistName: "张凯",
            //     receptionDepartment: "QA01工程技術五課",
            //     receptionistPhone: "15032303506",
            //     visitReason: "设备维护与保养",
            //     keepNormal: false,             // ❌ 彻底关闭大部队双开通道，只认李工专单！
            //     renewThreshold: 2,             
            //     renewDays: 7                   
            // }
             //  王保平
            "NDIxMjIyMTk5MDAzMTQwMTEz": {
                receptionistId: "61908845",
                receptionistName: "李泊绪",
                receptionDepartment: "QA01測試組",
                receptionistPhone: "15133557787",
                visitReason: "设备维护与保养",
                keepNormal: false,           // 🌟 核心：设为 true，同样双开！
                renewThreshold: 2,            // 独立：剩0天时触发专属包
                renewDays: 7                  // 独立：一次续2天
            },
        },

        // A08 的独立老组包逻辑 (已加入指定接待人合并支持)
        buildPayload: (idsBase64, targetTs, locConfig, customConfig = null) => {
            const tableRows = idsBase64.map(id => locConfig.personDb[id]).filter(Boolean);
            const finalForm = [];

            // 👇 获取 YYYY-MM-DD 格式的字符串，供新字段使用
            const dateStr = new Date(targetTs + 28800000).toISOString().split('T')[0];

            A08_TEMPLATE.forEach(block => {
                if (block.type === 'STATIC') {
                    // 修复：必须进行深拷贝，否则会污染内存里的全局模板
                    finalForm.push(JSON.parse(JSON.stringify(block.item)));
                } else if (block.type === 'INJECT_TABLE') {
                    finalForm.push({
                        "componentName": "TableField", "fieldId": "tableField_lxv44os5",
                        "label": "人员信息", "fieldData": { "value": tableRows }, "listNum": 50
                    });
                } else if (block.type === 'INJECT_DATE_TS') {
                    finalForm.push({ ...block.template, fieldData: { value: targetTs } });
                } else if (block.type === 'INJECT_DATE_STR') {
                    // 👇 🌟 将格式化好的字符串注入新字段
                    finalForm.push({ ...block.template, fieldData: { value: dateStr } });
                }
            });

            // 👇 【新增】如果传入了指定接待人配置，拦截并覆写 A08 的外层表单参数
            if (customConfig) {
                finalForm.forEach(item => {
                    if (item.label && String(item.label).includes('接待人工号') && customConfig.receptionistId) item.fieldData.value = customConfig.receptionistId;
                    else if (item.label && String(item.label).includes('接待人员') && customConfig.receptionistName) item.fieldData.value = customConfig.receptionistName;
                    else if (item.label && String(item.label).includes('接待部门') && customConfig.receptionDepartment) item.fieldData.value = customConfig.receptionDepartment;
                    else if (item.label && String(item.label).includes('接待人联系方式') && customConfig.receptionistPhone) item.fieldData.value = customConfig.receptionistPhone;
                    else if (item.label && String(item.label).includes('服务/事由描述') && customConfig.visitReason) item.fieldData.value = customConfig.visitReason;
                });
            }

            const jsonStr = JSON.stringify(finalForm, null, 2);
            // 👇 强制绑定该账号独有的 Token
            const _token = locConfig.csrf_token || 'e7daa879-7b83-40f7-8335-1a262747f2c9';
            const fullPostBody = `_csrf_token=${_token}&formUuid=FORM-2768FF7B2C0D4A0AB692FD28DBA09FD57IHQ&appType=APP_GRVPTEOQ6D4B7FLZFYNJ&value=${encodeURIComponent(JSON.stringify(finalForm))}&_schemaVersion=682`;
            return { jsonStr, fullPostBody };
        }
    },
    'Q01': {
        title: "Q01 厂区",
        // Q01 的门禁阈值
        renewThreshold: 2,
        renewDays: 7,
        enabled: true,

        // 👇【修复点】独立账号配置，解决 API 报错
        csrf_token: "5581e41f-8c38-48d4-bea4-20d1f96af4db",
        cookie: "tianshu_corp_user=ding2b4c83bec54a29c6f2c783f7214b6d69_FREEUSER; tianshu_csrf_token=5581e41f-8c38-48d4-bea4-20d1f96af4db; c_csrf=5581e41f-8c38-48d4-bea4-20d1f96af4db; cookie_visitor_id=o5TLBWJ6; cna=KDksIgUMMBsCARuACb+fM//A; xlly_s=1; tianshu_app_type=APP_GRVPTEOQ6D4B7FLZFYNJ; JSESSIONID=5BF894CE5AFD8107A9C6124F8753BEB5; tfstk=gTlIf86UsykasoYp2M8NcrQKR6PevFR2Vaa-o4CFyWFpNgUbJ7orypYWNqngzWuJx0G7XcqKUDRHw8ijx0wk-ur8V0u-LFR2g203Z7nW0IRVHeDw8DaRwzLR6yzk7ypCdudzZ7K2bO58KINoAceYPk395zzz2un8eVCT-lU827n8XRUYuMF8w0L_6zzlJwUdwPBT8lE8w7n-WFauXyF8w0395zv_rtaGPouBPqRW4aBBtvE1w_h_5nNKRi1Lo34UdogUuOXi1i2QD2E1aHjKKrrQkjKNKrwIJjNE_HpZRlHKwWlpb_ijfxFswR7JVyHKlj2mwhsr4srb5yX5EkC75o865TXlaj5nMewO5_eLSPzw5F6rtJUg5o865TXupP4i3FT1UXf..; isg=BOzsBAulqRjsL70mvTB0y-TYtsgepZBPSDBScUYpsid4UGNbQrR-3bOndF_PIcin",

        // 🔪 新增：明确Q01 厂区大部队的常规接待人 (用于精准过滤普通组记录)
        // normalReceptionistId: "61990794", // 王晗的工号

        // Q01 全局通用接待人配置 (未指定专属接待人的人员将默认使用这个)
        // receptionistId: "82100751",    // 工号
        // receptionistName: "张宏敏",       // 姓名
        // receptionDepartment:"P2電測檢驗組",  //接待部门
        // receptionistPhone:"18733454885",  //接待人联系方式
        // visitReason: "治具调试",     // 事由描述

        // 【新增功能】：支持在这里配置专属的接待人信息
        customReceptionists: {
            // 示例：给某个身份证指定一个专用的接待人：
            // "MTMwMzIzMTk5MjEyMTY2NDM0": {
            //     receptionistId: "12345678",
            //     receptionistName: "专属张宏敏",
            //     receptionDepartment: "P2特殊测试组",
            //     receptionistPhone: "13888888888",
            //     visitReason: "特殊机台维护",
            //     keepNormal: true
            // }
        },

        query: {
            visitorIdNos: [
                // "MTMwMzIzMTk5MjEyMTY2NDM0",  //张江路
                // "MTMwMzIzMTk5ODA2MTQxMDU4", //刘宏飞
                // "MTMwMzIzMTk5MDAzMDc2NDE2", //张江宽
                // "MTMwMzIzMTk4OTA5MDQ2NDEx", //付海超
                "MDU4NDMzNDg=", //张道玄
                "MTIwNDUxOTI=", //张乃文
                // "SzEzOTMxMihBKQ==", //陈毅鸿
                "NDMxMjIyMTk5NzEyMDUzMzEz", //向林  
                // "NTIyNzMxMjAwMDAxMTAzNjEx", //王煊廷
                // "MTMwMzIxMjAwMjA0MTY2MjE4", //邵相辉 
                "NDUwMjIxMTk4OTA0MDUyNDNY", //曾静 
                // "NDIxMTgxMTk5MDAxMTc2MzFY", //余新旺 
                // "NDQwOTgyMTk5NzEwMDgyNTk3", //周勇驰 
                // "NDExNTI0MjAwNTEyMTA3NjU2", //杨瑞 
                // "MDg5NjQ3MzI=", //赖彦翔 
                // "MDYyNDg5MDE=", //马可为
                "WjkwOTQwMSg3KQ==", //冼延浩 (新)
                "NDQxNDgxMTk4ODAzMTYwODky", //张远彬 (新)
                "MDcyMjg1Nzc=", //朱会民 (新)
                // "NTMyNDY5ODc0" //Denis Gerassimenko
                // "NDIyMzI2MTk5NTA0Mjg2NDEx", //竇桂陽
                "MTMwMzIzMjAwMzEyMDc1NjE1",  //周家豪
                // "MTE2ODkyOTE="   // 👇 🌟新增：张建成
                "MTMwNjM0MTk5OTEyMjAwMDEw",  // 张鑫达
                "MTMwMzIxMTk5NjExMDk5MDM3",  // 董建岐
                "NDQwMTgxMTk5ODA4MTczMDE2",   // 梁梓杰
                "MTMwMzIzMjAwNDA5MTc1NjEy"   // 杜卫华
            ],
            regPerson: "15032325162",
            acToken: "53F44A99C6D8AADE22942CD9E1D803E8812FF4A4A8A756BE0A1659704557309F",
            queryUrl: "https://dingtalk.avaryholding.com:8443/dingplus/visitorConnector/visitorStatus"
        },
        personDb: Q01_PERSON_DB,

        // Q01 专有完美克隆组包逻辑 (加入了独立接待人支持)
        buildPayload: (idsBase64, targetTs, locConfig, customConfig = null) => {
            if (!Q01_TEMPLATE_JSON || !Q01_URL_PARAMS) throw new Error("QA01 模板未成功加载，无法生成合法报文！");

            const dateStr = getFormattedDate(targetTs);

            // 1. 严格排序
            const sortedIds = [...idsBase64].sort((a, b) => {
                const indexA = Q01_ORIGINAL_ORDER[a] ?? 999;
                const indexB = Q01_ORIGINAL_ORDER[b] ?? 999;
                return indexA - indexB;
            });
            const finalTable = sortedIds.map(id => locConfig.personDb[id]).filter(Boolean);

            // 2. 深度克隆抓包来的原生 JSON 树
            const finalForm = JSON.parse(JSON.stringify(Q01_TEMPLATE_JSON));

            // 获取要注入的接待人信息：优先使用传入的指定配置(customConfig)，若无则降级使用全厂区通用配置
            const recId = customConfig ? customConfig.receptionistId : locConfig.receptionistId;
            const recName = customConfig ? customConfig.receptionistName : locConfig.receptionistName;
            const recDept = customConfig ? customConfig.receptionDepartment : locConfig.receptionDepartment;
            const recPhone = customConfig ? customConfig.receptionistPhone : locConfig.receptionistPhone;
            const vReason = customConfig ? customConfig.visitReason : locConfig.visitReason;

            // 3. 精准注入更新的数据
            finalForm.forEach(item => {
                if (item.componentName === 'TableField' && item.label && item.label.includes('人员')) {
                    item.fieldData.value = finalTable;
                } else if (item.componentName === 'DateField' && String(item.label).includes('日期')) {
                    item.fieldData.value = targetTs;
                } else if (item.componentName === 'TextField' && String(item.label).includes('日期')) {
                    item.fieldData.value = dateStr;
                }
                // 拦截并替换 QA01 的接待人信息
                else if (item.label && String(item.label).includes('接待人工号') && recId) {
                    item.fieldData.value = recId;
                } else if (item.label && String(item.label).includes('接待人员') && recName) {
                    item.fieldData.value = recName;
                } else if (item.label && String(item.label).includes('服务/事由描述') && vReason) {
                    item.fieldData.value = vReason;
                } else if (item.label && String(item.label).includes('接待部门') && recDept) {
                    item.fieldData.value = recDept;
                } else if (item.label && String(item.label).includes('接待人联系方式') && recPhone) {
                    item.fieldData.value = recPhone;
                }
            });

            // 4. 重建 URL Encoded 发包主体
            const parts = [];
            for (const [key, val] of Q01_URL_PARAMS.entries()) {
                if (key === 'value') {
                    parts.push(`${key}=${encodeURIComponent(JSON.stringify(finalForm)).replace(/%20/g, '+')}`);
                } else if (key === '_csrf_token' && locConfig.csrf_token) {
                    // 👇 强制覆盖为本账号对应的 Token
                    parts.push(`${key}=${encodeURIComponent(locConfig.csrf_token)}`);
                } else {
                    parts.push(`${key}=${encodeURIComponent(val)}`);
                }
            }

            return {
                jsonStr: JSON.stringify(finalForm, null, 2),
                fullPostBody: parts.join('&')
            };
        }
    }
};

module.exports = { LOC_CONFIGS, PERSON_DB, FORM_BASE, FORM_TAIL, A08_TEMPLATE, Q01_PERSON_DB, Q01_ORIGINAL_ORDER, Q01_TEMPLATE_JSON, Q01_URL_PARAMS };
