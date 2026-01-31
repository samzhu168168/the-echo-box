/**
 * ECHO BOX ENGINE - 3 SCENES, 3 LINKS
 * 策略：严格的一一对应 (Strict Mapping)
 */

// --- 1. 配置中心 ---
const DISCOUNT_CODE = "launch"; 

// --- 2. 核心数据 ---
const TEMPLATES = {
    crypto: `[ASSET MAP]\n\nHardware Wallet Location: \n[e.g. In the fake book on the shelf]\n\nSeed Phrase: \n[e.g. Bank box #102]\n\nExchange: Binance\nLogin Email: \nPassword Hint: `,
    bank: `[FINANCIAL KEY]\n\nBank: Chase\nAccount: \n\nInsurance Policy Location: \n[e.g. Blue folder]\n\nLawyer Contact: `,
    love: `[MY VOW]\n\nTo my beloved,\n\nThis is proof that I loved you.\n\nOur Anniversary: \n\nMy promise to you forever: `
};

// 默认链接 (初始化)
let currentTargetUrl = "https://samzhu168.gumroad.com/l/lwjqot";


// --- 3. 初始化 ---
document.addEventListener('DOMContentLoaded', () => {
    animateCounter();
    restoreData();

    // 绑定按钮点击事件
    // 使用 onclick 覆盖模式，杜绝重复绑定
    const btns = document.querySelectorAll('.t-btn');
    btns.forEach(btn => {
        btn.onclick = function() {
            const type = this.getAttribute('data-type');
            applyTemplate(type);
        };
    });
});


// --- 4. 模板与链接路由 (核心：三路分流) ---
function applyTemplate(type) {
    if(navigator.vibrate) navigator.vibrate(50);
    
    // A. 填充内容
    const contentBox = document.getElementById('input-content');
    if (contentBox) contentBox.value = TEMPLATES[type] || "";
    
    // B. **链接路由 (3 Links for 3 Scenes)**
    // 严格区分，互不干扰
    
    if (type === 'love') {
        // 1. Love -> LoveScribe
        currentTargetUrl = "https://samzhu168.gumroad.com/l/sapjbm";
        console.log("🔗 Route: Love -> sapjbm");
    } 
    else if (type === 'bank') {
        // 2. Bank -> FutureBloom (家庭/保险)
        currentTargetUrl = "https://samzhu168.gumroad.com/l/ntcaif";
        console.log("🔗 Route: Bank -> ntcaif");
    }
    else {
        // 3. Crypto -> Legacy Vault (加密资产)
        // (type === 'crypto' 或其他默认情况)
        currentTargetUrl = "https://samzhu168.gumroad.com/l/lwjqot";
        console.log("🔗 Route: Crypto -> lwjqot");
    }
    
    // C. 更新 UI
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


// --- 5. 支付跳转 (纯净版) ---
function handlePaymentClick() {
    const content = document.getElementById('input-content').value;
    if(!content) { alert("Please write something first."); return; }

    // URL 构建
    let finalUrl = currentTargetUrl;
    
    // 只有当有折扣码时才拼接
    if (DISCOUNT_CODE && DISCOUNT_CODE !== "") {
        if (finalUrl.endsWith('/')) {
            finalUrl = finalUrl + DISCOUNT_CODE;
        } else {
            finalUrl = finalUrl + "/" + DISCOUNT_CODE;
        }
    }

    console.log("🚀 Launching:", finalUrl);

    // 保存并跳转
    localStorage.setItem('echo_to', document.getElementById('input-to').value);
    localStorage.setItem('echo_content', content);
    
    window.open(finalUrl, '_blank');

    // 切换界面
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
