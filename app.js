/**
 * ECHO BOX ENGINE - TIMESTAMP FIX
 * 
 * 1. 链接映射：
 *    - Love   -> sapjbm (LoveScribe)
 *    - Bank   -> ntcaif (FutureBloom)
 *    - Crypto -> lwjqot (Echo Box)
 * 
 * 2. 修复逻辑：
 *    - 增加了时间戳 (?t=...) 强制浏览器不使用缓存
 *    - 请注意：Gumroad 购物车是服务器记忆，必须手动清空！
 */

// --- 1. 配置中心 (测试码 810S73X) ---
const DISCOUNT_CODE = "810S73X"; 

// --- 2. 核心数据 ---
const TEMPLATES = {
    crypto: `[ASSET MAP]\n\nHardware Wallet Location: \n[e.g. In the fake book on the shelf]\n\nSeed Phrase: \n[e.g. Bank box #102]\n\nExchange: Binance\nLogin Email: \nPassword Hint: `,
    bank: `[FINANCIAL KEY]\n\nBank: Chase\nAccount: \n\nInsurance Policy Location: \n[e.g. Blue folder]\n\nLawyer Contact: `,
    love: `[MY VOW]\n\nTo my beloved,\n\nThis is proof that I loved you.\n\nOur Anniversary: \n\nMy promise to you forever: `
};

// 默认链接
let currentTargetUrl = "https://samzhu168.gumroad.com/l/lwjqot";


// --- 3. 初始化 ---
document.addEventListener('DOMContentLoaded', () => {
    animateCounter();
    restoreData();

    const btns = document.querySelectorAll('.t-btn');
    btns.forEach(btn => {
        btn.onclick = function() {
            const type = this.getAttribute('data-type');
            applyTemplate(type);
        };
    });
});


// --- 4. 模板与链接路由 ---
function applyTemplate(type) {
    if(navigator.vibrate) navigator.vibrate(50);
    
    const contentBox = document.getElementById('input-content');
    if (contentBox) contentBox.value = TEMPLATES[type] || "";
    
    // 严格三路路由
    if (type === 'love') {
        currentTargetUrl = "https://samzhu168.gumroad.com/l/sapjbm";
    } 
    else if (type === 'bank') {
        currentTargetUrl = "https://samzhu168.gumroad.com/l/ntcaif";
    }
    else {
        currentTargetUrl = "https://samzhu168.gumroad.com/l/lwjqot";
    }
    
    syncPreview();
    updateButtonStyles(type);
}

function updateButtonStyles(activeType) {
    const btns = document.querySelectorAll('.t-btn');
    btns.forEach(btn => {
        const btnType = btn.getAttribute('data-type');
        if (btnType === activeType) {
            btn.style.borderColor = '#D4AF37';
            btn.style.color = '#D4AF37';
            btn.style.backgroundColor = 'rgba(212, 175, 55, 0.05)';
        } else {
            btn.style.borderColor = '#333';
            btn.style.color = '#ccc';
            btn.style.backgroundColor = '#1a1a1a';
        }
    });
}


// --- 5. 支付跳转 (加了时间戳) ---
function handlePaymentClick() {
    const content = document.getElementById('input-content').value;
    if(!content) { alert("Please write something first."); return; }

    let finalUrl = currentTargetUrl;
    
    // 1. 拼接折扣码
    if (DISCOUNT_CODE && DISCOUNT_CODE !== "") {
        if (finalUrl.endsWith('/')) {
            finalUrl = finalUrl + DISCOUNT_CODE;
        } else {
            finalUrl = finalUrl + "/" + DISCOUNT_CODE;
        }
    }

    // 2. [新增] 拼接时间戳，防止浏览器缓存旧链接
    // 问号处理：如果已有 ? 则用 &，否则用 ?
    const separator = finalUrl.includes('?') ? '&' : '?';
    finalUrl = finalUrl + separator + "t=" + Date.now();

    console.log("🚀 Launching Fresh Link:", finalUrl);

    localStorage.setItem('echo_to', document.getElementById('input-to').value);
    localStorage.setItem('echo_content', content);
    
    window.open(finalUrl, '_blank');

    document.getElementById('step-create').classList.add('hidden');
    document.getElementById('step-unlock').classList.remove('hidden');
    window.scrollTo(0,0);
}


// --- 6. 辅助功能 ---
function syncPreview() {
    const to = document.getElementById('input-to').value;
    const content = document.getElementById('input-content').value;
    const pTo = document.getElementById('preview-to');
    const pContent = document.getElementById('preview-content');
    if(pTo) pTo.innerText = to || "Recipient Name";
    if(pContent) pContent.innerText = content || "Start typing...";
}

function verifyAndDownload() {
    const key = document.getElementById('license-key').value.trim();
    if(key.length < 3) { alert("Invalid Key"); return; }
    const qrContainer = document.getElementById('preview-qr');
    if(qrContainer) {
        qrContainer.innerHTML = "";
        new QRCode(qrContainer, { text: "https://www.my-echo-box.com", width: 50, height: 50 });
    }
    // 延迟一点以确保二维码生成后再打印
    setTimeout(() => window.print(), 800);
}

function toggleUnlock() {
    document.getElementById('step-create').classList.toggle('hidden');
    document.getElementById('step-unlock').classList.toggle('hidden');
}

function animateCounter() {
    let count = 12842;
    const el = document.getElementById('global-counter');
    if(el) setInterval(() => { if(Math.random() > 0.7) el.innerText = (++count).toLocaleString(); }, 3000);
}

function restoreData() {
    if(localStorage.getItem('echo_content')) {
        const el = document.getElementById('input-content');
        if(el) { el.value = localStorage.getItem('echo_content'); syncPreview(); }
    }
}
