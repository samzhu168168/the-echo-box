/**
 * ECHO BOX PHENOMENON ENGINE
 */

// 1. 智能路由配置
const LINKS = {
    'love': "https://samzhu168.gumroad.com/l/lwjqot/launch",
    'family': "https://samzhu168.gumroad.com/l/ntcaif/launch",
    'default': "https://samzhu168.gumroad.com/l/sapjbm/launch"
};
let currentType = 'default';

// 2. 模板库 (Treasure Map Strategy)
const TEMPLATES = {
    crypto: `[DIGITAL ASSET MAP]\n\nHardware Wallet Location: \n[e.g. In the fake book on the shelf]\n\nSeed Phrase Location: \n[e.g. Bank safety deposit box #102]\n\nExchange: Binance\nLogin Email: \nPassword Hint: `,
    bank: `[EMERGENCY FINANCE]\n\nMain Account: Chase\nAccount Holder: \n\nLife Insurance Policy is in: \n[e.g. The blue folder]\n\nContact Lawyer: \nPhone: `,
    love: `[MY ETERNAL VOW]\n\nTo my beloved,\n\nI want this to be proof that I loved you.\n\nIf you are reading this, I am watching over you.\n\nMy promise to you forever: `
};

// --- 初始化 ---
document.addEventListener('DOMContentLoaded', () => {
    // 全球计数器动画
    animateCounter();
    // GEO 标题
    detectLocation();
    // 恢复数据
    restoreData();
});

// --- 实时预览逻辑 (Viral Core) ---
function updatePreview() {
    const to = document.getElementById('input-to').value;
    const content = document.getElementById('input-content').value;
    
    // 更新右侧纸张
    document.getElementById('preview-to').innerText = to || "Recipient Name";
    document.getElementById('preview-content').innerText = content || "Start typing to see your legacy form...";
    
    // 保存到本地
    localStorage.setItem('echo_to', to);
    localStorage.setItem('echo_content', content);
}

// --- 模板应用 ---
function applyTemplate(type) {
    // 震动反馈
    if(navigator.vibrate) navigator.vibrate(50);
    
    document.getElementById('input-content').value = TEMPLATES[type];
    currentType = (type === 'crypto' || type === 'bank') ? 'default' : type; // 只有 love/family 特殊，其他走 default
    
    // 触发预览更新
    updatePreview();
}

// --- 支付逻辑 ---
function handlePaymentClick() {
    const content = document.getElementById('input-content').value;
    if(!content) { alert("Please write something to seal."); return; }

    // 跳转 Gumroad
    const finalLink = LINKS[currentType] || LINKS['default'];
    window.open(finalLink, '_blank');

    // 切换 UI
    document.getElementById('step-create').classList.add('hidden');
    document.getElementById('step-unlock').classList.remove('hidden');
    // 移动端滚动到顶部
    window.scrollTo(0,0);
}

// --- 验证与生成 (最终交付) ---
function verifyAndDownload() {
    const key = document.getElementById('license-key').value.trim();
    if(key.length < 3) { alert("Invalid Key"); return; }

    // 这里可以把预览区的 HTML 直接变成最终结果，并生成二维码
    const qrContainer = document.querySelector('.qr-placeholder');
    qrContainer.innerHTML = "";
    new QRCode(qrContainer, {
        text: "https://www.my-echo-box.com",
        width: 60, height: 60, colorDark: "#333"
    });

    // 改变印章状态
    document.querySelector('.seal-inner span').innerText = "SEALED";
    document.querySelector('.seal-stamp').style.borderColor = "#D4AF37";
    document.querySelector('.seal-stamp').style.color = "#D4AF37";

    // 打印
    setTimeout(() => window.print(), 500);
}

function toggleUnlock() {
    document.getElementById('step-create').classList.toggle('hidden');
    document.getElementById('step-unlock').classList.toggle('hidden');
}

// --- 辅助功能 ---
function animateCounter() {
    let count = 12492;
    setInterval(() => {
        if(Math.random() > 0.7) {
            count++;
            document.getElementById('global-counter').innerText = count.toLocaleString();
        }
    }, 3000);
}

function detectLocation() {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const h1 = document.getElementById('dynamic-headline');
    if(tz.includes('New_York')) h1.innerHTML = `NYC Hustle Stops. <br><span class="gold-text">Legacies Don't.</span>`;
}

function restoreData() {
    if(localStorage.getItem('echo_content')) {
        document.getElementById('input-content').value = localStorage.getItem('echo_content');
        updatePreview();
    }
}
