/**
 * ECHO BOX ENGINE - ROUTER FIX
 */

// --- 1. 链接配置 ---
// 确保折扣码与 Gumroad 后台一致 (小写)
const DISCOUNT_CODE = "launch"; 

// 链接映射表 (精准对应)
const LINKS = {
    // 情侣 -> lwjqot
    'love': "https://samzhu168.gumroad.com/l/lwjqot",
    
    // 家庭 -> ntcaif (注意: 如果 HTML 里没这个按钮，那就不生效)
    'family': "https://samzhu168.gumroad.com/l/ntcaif",
    
    // 资产/银行/通用 -> sapjbm
    'crypto': "https://samzhu168.gumroad.com/l/sapjbm",
    'bank': "https://samzhu168.gumroad.com/l/sapjbm",
    'default': "https://samzhu168.gumroad.com/l/sapjbm"
};

// 默认类型
let currentType = 'default';

// 模板内容
const TEMPLATES = {
    crypto: `[ASSET MAP]\n\nHardware Wallet Location: \n[e.g. In the fake book on the shelf]\n\nSeed Phrase: \n[e.g. Bank box #102]\n\nExchange: Binance\nLogin Email: \nPassword Hint: `,
    bank: `[FINANCIAL KEY]\n\nBank: Chase\nAccount: \n\nInsurance Policy Location: \n[e.g. Blue folder]\n\nLawyer Contact: `,
    love: `[MY VOW]\n\nTo my beloved,\n\nThis is proof that I loved you.\n\nOur Anniversary: \n\nMy promise to you forever: `
};

// --- 2. 初始化 ---
document.addEventListener('DOMContentLoaded', () => {
    animateCounter();
    restoreData();
});

// --- 3. 模板选择 (核心修复点) ---
function applyTemplate(type) {
    if(navigator.vibrate) navigator.vibrate(50);
    
    // 1. 填充内容
    const contentBox = document.getElementById('input-content');
    if (contentBox) {
        contentBox.value = TEMPLATES[type] || "";
    }
    
    // 2. **关键修复：更新全局变量 currentType**
    // 无论选什么，都强制更新，确保支付时取到最新的 key
    currentType = type;
    
    console.log("Template switched to:", currentType); // 调试日志
    
    // 3. 更新 UI
    syncPreview();
    
    // 4. 更新按钮样式
    const btns = document.querySelectorAll('.t-btn');
    btns.forEach(btn => btn.style.borderColor = '#333');
    // 高亮当前点击的按钮 (通过 event 获取)
    if(event && event.target) {
        event.target.style.borderColor = '#D4AF37';
    }
}

// --- 4. 支付跳转 (核心修复点) ---
function handlePaymentClick() {
    const content = document.getElementById('input-content').value;
    if(!content) { alert("Please write something first."); return; }

    // 1. 从映射表中获取链接
    // 优先取 currentType，取不到就取 default
    let baseUrl = LINKS[currentType];
    
    // 防御性检查：如果该类型没有定义链接，回退到默认
    if (!baseUrl) {
        console.warn("Link not found for type:", currentType, "Using default.");
        baseUrl = LINKS['default'];
    }

    // 2. 拼接折扣码
    let finalUrl = baseUrl;
    if (DISCOUNT_CODE && DISCOUNT_CODE.length > 0) {
        // 自动处理斜杠，防止 double slash
        if (baseUrl.endsWith('/')) {
            finalUrl = baseUrl + DISCOUNT_CODE;
        } else {
            finalUrl = baseUrl + "/" + DISCOUNT_CODE;
        }
    }

    console.log("Navigating to:", finalUrl); // 调试日志

    // 3. 保存并跳转
    localStorage.setItem('echo_to', document.getElementById('input-to').value);
    localStorage.setItem('echo_content', content);
    
    window.open(finalUrl, '_blank');

    // 4. 切换界面
    document.getElementById('step-create').classList.add('hidden');
    document.getElementById('step-unlock').classList.remove('hidden');
    
    // 移动端滚到顶部
    window.scrollTo(0,0);
}

// --- 5. 实时预览 ---
function syncPreview() {
    const to = document.getElementById('input-to').value;
    const content = document.getElementById('input-content').value;
    
    const pTo = document.getElementById('preview-to');
    const pContent = document.getElementById('preview-content');
    
    if(pTo) pTo.innerText = to || "Recipient Name";
    if(pContent) pContent.innerText = content || "Start typing...";
}

// --- 6. 验证与下载 ---
function verifyAndDownload() {
    const key = document.getElementById('license-key').value.trim();
    if(key.length < 3) { alert("Invalid Key"); return; }

    const qrContainer = document.getElementById('preview-qr');
    if(qrContainer) {
        qrContainer.innerHTML = "";
        new QRCode(qrContainer, {
            text: "https://www.my-echo-box.com",
            width: 50, height: 50
        });
    }

    // 打印
    setTimeout(() => window.print(), 500);
}

function toggleUnlock() {
    const createStep = document.getElementById('step-create');
    const unlockStep = document.getElementById('step-unlock');
    
    createStep.classList.toggle('hidden');
    unlockStep.classList.toggle('hidden');
}

// --- 辅助 ---
function animateCounter() {
    let count = 12842;
    const el = document.getElementById('global-counter');
    if(el) {
        setInterval(() => {
            if(Math.random() > 0.7) el.innerText = (++count).toLocaleString();
        }, 3000);
    }
}

function restoreData() {
    if(localStorage.getItem('echo_content')) {
        const el = document.getElementById('input-content');
        if(el) {
            el.value = localStorage.getItem('echo_content');
            syncPreview();
        }
    }
}
