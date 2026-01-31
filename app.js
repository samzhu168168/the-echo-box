/**
 * ECHO BOX ENGINE V6.0
 * Fixed Routing & Discount Logic
 */

// --- 1. 配置中心 ---

// 折扣码 (必须与 Gumroad 后台一致)
const DISCOUNT_CODE = "launch"; 

// 产品链接 (不带折扣码的基础链接)
const LINKS = {
    // 情侣 -> lwjqot
    'love': "https://samzhu168.gumroad.com/l/lwjqot",
    
    // 家庭 -> ntcaif
    'family': "https://samzhu168.gumroad.com/l/ntcaif",
    
    // 通用/资产 -> sapjbm
    'crypto': "https://samzhu168.gumroad.com/l/sapjbm",
    'bank': "https://samzhu168.gumroad.com/l/sapjbm",
    'default': "https://samzhu168.gumroad.com/l/sapjbm"
};

let currentType = 'default';

// 模板内容
const TEMPLATES = {
    crypto: `[ASSET MAP]\n\nLedger Location: \n[e.g. Fake book on shelf]\n\nSeed Phrase: \n[e.g. Bank box #102]\n\nExchange: Binance\nLogin: \nHint: `,
    bank: `[FINANCIAL KEY]\n\nBank: Chase\nAccount: \n\nInsurance Policy Location: \n[e.g. Blue folder]\n\nLawyer Contact: `,
    love: `[MY VOW]\n\nTo my beloved,\n\nThis is proof that I loved you.\n\nOur Anniversary: \n\nMy promise to you forever: `
};

// --- 2. 初始化 ---
document.addEventListener('DOMContentLoaded', () => {
    animateCounter();
    restoreData();
});

// --- 3. 实时预览 (Visual Viral) ---
function syncPreview() {
    const to = document.getElementById('input-to').value;
    const content = document.getElementById('input-content').value;
    
    // 更新右侧纸张
    document.getElementById('preview-to').innerText = to || "Recipient Name";
    document.getElementById('preview-content').innerText = content || "Start typing...";
    
    // 保存
    localStorage.setItem('echo_to', to);
    localStorage.setItem('echo_content', content);
}

// --- 4. 模板应用 ---
function applyTemplate(type) {
    if(navigator.vibrate) navigator.vibrate(50);
    
    document.getElementById('input-content').value = TEMPLATES[type];
    
    // **核心修复：正确设置类型**
    currentType = type;
    console.log("Type set to:", currentType); // 调试
    
    syncPreview();
}

// --- 5. 支付跳转 (核心修复) ---
function handlePaymentClick() {
    const content = document.getElementById('input-content').value;
    if(!content) { alert("Please write something first."); return; }

    // 1. 找基础链接
    let baseUrl = LINKS[currentType];
    // 防御性编程：如果类型没匹配上，用默认
    if (!baseUrl) baseUrl = LINKS['default'];

    // 2. 拼接折扣
    let finalUrl = baseUrl;
    if (DISCOUNT_CODE) {
        finalUrl = baseUrl + "/" + DISCOUNT_CODE;
    }

    console.log("Navigating to:", finalUrl);

    // 3. 跳转
    window.open(finalUrl, '_blank');

    // 4. 切换 UI
    document.getElementById('step-create').classList.add('hidden');
    document.getElementById('step-unlock').classList.remove('hidden');
}

// --- 6. 验证与下载 ---
function verifyAndDownload() {
    const key = document.getElementById('license-key').value.trim();
    if(key.length < 3) { alert("Invalid Key"); return; }

    // 生成二维码
    const qrContainer = document.getElementById('preview-qr');
    qrContainer.innerHTML = "";
    new QRCode(qrContainer, {
        text: "https://www.my-echo-box.com",
        width: 50, height: 50
    });

    // 打印
    setTimeout(() => window.print(), 500);
}

function toggleUnlock() {
    const createStep = document.getElementById('step-create');
    const unlockStep = document.getElementById('step-unlock');
    
    if (createStep.classList.contains('hidden')) {
        createStep.classList.remove('hidden');
        unlockStep.classList.add('hidden');
    } else {
        createStep.classList.add('hidden');
        unlockStep.classList.remove('hidden');
    }
}

// --- 辅助 ---
function animateCounter() {
    let count = 12842;
    setInterval(() => {
        if(Math.random() > 0.7) document.getElementById('global-counter').innerText = (++count).toLocaleString();
    }, 3000);
}

function restoreData() {
    if(localStorage.getItem('echo_content')) {
        document.getElementById('input-content').value = localStorage.getItem('echo_content');
        if(localStorage.getItem('echo_to')) document.getElementById('input-to').value = localStorage.getItem('echo_to');
        syncPreview();
    }
}
