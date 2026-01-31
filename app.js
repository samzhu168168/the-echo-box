/**
 * ECHO BOX ENGINE - FINAL LINK FIX
 */

// --- 1. 配置中心 ---
const DISCOUNT_CODE = "launch"; 

// --- 2. 核心数据 ---
// 模板内容
const TEMPLATES = {
    crypto: `[ASSET MAP]\n\nHardware Wallet Location: \n[e.g. In the fake book on the shelf]\n\nSeed Phrase: \n[e.g. Bank box #102]\n\nExchange: Binance\nLogin Email: \nPassword Hint: `,
    bank: `[FINANCIAL KEY]\n\nBank: Chase\nAccount: \n\nInsurance Policy Location: \n[e.g. Blue folder]\n\nLawyer Contact: `,
    love: `[MY VOW]\n\nTo my beloved,\n\nThis is proof that I loved you.\n\nOur Anniversary: \n\nMy promise to you forever: `
};

// 当前选中的链接 (默认为通用链接 sapjbm)
// 我们直接存具体的 URL，而不是存类型，这样更直观，不容易错
let currentTargetUrl = "https://samzhu168.gumroad.com/l/sapjbm";


// --- 3. 初始化 ---
document.addEventListener('DOMContentLoaded', () => {
    animateCounter();
    restoreData();
});


// --- 4. 模板选择 (核心修复：直接绑定 URL) ---
function applyTemplate(type) {
    if(navigator.vibrate) navigator.vibrate(50);
    
    // A. 填充内容
    const contentBox = document.getElementById('input-content');
    if (contentBox) contentBox.value = TEMPLATES[type] || "";
    
    // B. **关键修复：根据类型，直接死锁目标 URL**
    if (type === 'love') {
        // 情侣 -> LoveScribe
        currentTargetUrl = "https://samzhu168.gumroad.com/l/lwjqot";
    } 
    else if (type === 'family') {
        // 家庭 -> FutureBloom (如果HTML有这按钮的话)
        currentTargetUrl = "https://samzhu168.gumroad.com/l/ntcaif";
    } 
    else {
        // Crypto, Bank, Default -> Legacy Vault (sapjbm)
        currentTargetUrl = "https://samzhu168.gumroad.com/l/sapjbm";
    }
    
    console.log("✅ Target URL updated to:", currentTargetUrl); // 调试
    
    // C. 更新 UI
    syncPreview();
    
    // D. 按钮高亮 - 移除了会崩溃的 event.target，改用 try-catch 兜底
    try {
        const btns = document.querySelectorAll('.t-btn');
        btns.forEach(btn => {
            btn.style.borderColor = '#333';
            btn.style.color = '#ccc';
        });
        // 如果 onclick 方式调用，event 可能存在
        if (typeof event !== 'undefined' && event && event.target) {
            event.target.style.borderColor = '#D4AF37';
            event.target.style.color = '#D4AF37';
        }
    } catch (e) {
        // 静默失败，不影响核心功能
        console.log("Button highlight failed (non-critical):", e);
    }
}


// --- 5. 支付跳转 (核心修复：简单拼接) ---
function handlePaymentClick() {
    const content = document.getElementById('input-content').value;
    if(!content) { alert("Please write something first."); return; }

    // 拼接折扣码
    let finalUrl = currentTargetUrl;
    
    // 只有当有折扣码时才拼接
    if (DISCOUNT_CODE && DISCOUNT_CODE !== "") {
        // 确保不重复斜杠
        if (finalUrl.endsWith('/')) {
            finalUrl = finalUrl + DISCOUNT_CODE;
        } else {
            finalUrl = finalUrl + "/" + DISCOUNT_CODE;
        }
    }

    console.log("🚀 Opening:", finalUrl);
    console.log("   (Should be ONE of: sapjbm/lwjqot/ntcaif + /launch)");

    // 保存并跳转
    localStorage.setItem('echo_to', document.getElementById('input-to').value);
    localStorage.setItem('echo_content', content);
    
    window.open(finalUrl, '_blank');

    // 切换界面
    document.getElementById('step-create').classList.add('hidden');
    document.getElementById('step-unlock').classList.remove('hidden');
    window.scrollTo(0,0);
}


// --- 6. 其他辅助功能 (保持不变) ---
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
    setTimeout(() => window.print(), 500);
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
