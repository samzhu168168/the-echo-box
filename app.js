/**
 * ECHO BOX CORE - V5.0 (Fixed Router & Discount)
 */

// --- 1. 链接配置中心 (务必核对) ---

// 折扣码 (必须与 Gumroad 后台创建的折扣码名称完全一致，区分大小写)
// 如果不需要折扣，请设为空字符串 ""
const DISCOUNT_CODE = "launch"; 

// 产品链接映射表 (精准匹配)
const PRODUCT_LINKS = {
    // 场景 1: LoveScribe (情侣) -> 对应 lwjqot
    'love': "https://samzhu168.gumroad.com/l/lwjqot",
    
    // 场景 2: FutureBloom (家庭) -> 对应 ntcaif
    'family': "https://samzhu168.gumroad.com/l/ntcaif",
    
    // 场景 3: Legacy (通用/加密/银行) -> 对应 sapjbm
    'crypto': "https://samzhu168.gumroad.com/l/sapjbm",
    'bank': "https://samzhu168.gumroad.com/l/sapjbm",
    'default': "https://samzhu168.gumroad.com/l/sapjbm"
};

// 当前选中的模板类型
let currentTemplateType = 'default';

// 模板内容库
const TEMPLATES = {
    crypto: `[DIGITAL ASSETS SECURITY]\n\nMy Hardware Wallet Location: \n[e.g. In the fake book on the shelf]\n\nSeed Phrase Location: \n[e.g. Bank safety deposit box #102]\n\nExchange: Binance\nLogin Email: \nPassword Hint (No real passwords): `,
    bank: `[FINANCIAL EMERGENCY]\n\nMain Bank Name: \nAccount Holder: \n\nLife Insurance Policy is in: \n[e.g. The blue folder]\n\nContact Lawyer: \nPhone: `,
    love: `[MY ETERNAL VOW]\n\nTo my beloved,\n\nI want this to be proof that I loved you.\n\nOur Anniversary: \n\nIf you are reading this, I am watching over you.\n\nMy promise to you forever: `,
    family: `[TIME CAPSULE]\n\nTo my child,\n\nIf you are reading this, I am gone. Please know that I love you.\n\nMy advice for your future: \n\nI am most proud of you for: `
};


// --- 2. 初始化 ---
document.addEventListener('DOMContentLoaded', function() {
    // 稀缺性倒数
    const randomSlots = Math.floor(Math.random() * 8) + 4;
    document.getElementById('slots-left').innerText = `🔥 Only ${randomSlots} Lifetime Licenses left at $19.99`;

    // 自动恢复数据
    if(localStorage.getItem('echo_content')) {
        document.getElementById('content').value = localStorage.getItem('echo_content');
    }
    
    // GEO 标题
    detectUserLocation();
});

function detectUserLocation() {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const headline = document.getElementById('dynamic-headline');
    if (timeZone.includes('New_York')) {
        headline.innerHTML = `NYC Hustle Never Stops. <br><span class="gold-text">But One Day You Will.</span>`;
    } else if (timeZone.includes('Los_Angeles')) {
        headline.innerHTML = `Silicon Valley Forgets Fast. <br><span class="gold-text">Make Your Legacy Last.</span>`;
    }
}


// --- 3. 模板选择 (核心修复：不再重置为 default) ---
function selectTemplate(type) {
    const textarea = document.getElementById('content');
    
    // 震动反馈
    if(navigator.vibrate) navigator.vibrate(50);
    
    // 填充内容
    textarea.value = TEMPLATES[type];
    
    // 视觉反馈
    textarea.style.borderColor = '#FFD700';
    setTimeout(() => textarea.style.borderColor = '#333', 500);
    
    // 更新按钮高亮状态
    document.querySelectorAll('.template-btn').forEach(btn => btn.classList.remove('active'));
    // 简单的 DOM 查找来高亮当前点击的按钮
    event.target.classList.add('active');

    // **修复点：直接保存类型，不进行转换**
    currentTemplateType = type;
    console.log("Template selected:", currentTemplateType); // 调试用
}


// --- 4. 支付跳转 (核心修复：链接拼接) ---
function handlePaymentClick() {
    const to = document.getElementById('to').value.trim();
    const content = document.getElementById('content').value.trim();
    
    if(!to || !content) {
        alert("Please select a template or write your message first.");
        return;
    }
    
    // 保存数据
    localStorage.setItem('echo_to', to);
    localStorage.setItem('echo_content', content);

    // **构建链接 (Robust Link Building)**
    // 1. 获取基础链接
    let targetLink = PRODUCT_LINKS[currentTemplateType];
    
    // 如果万一没找到（比如类型不对），回退到默认
    if (!targetLink) targetLink = PRODUCT_LINKS['default'];

    // 2. 拼接折扣码
    // 逻辑：如果定义了折扣码，就加在后面。Gumroad 格式是 /l/productID/discountCode
    if (DISCOUNT_CODE && DISCOUNT_CODE.length > 0) {
        // 确保没有双重斜杠
        if (targetLink.endsWith('/')) {
            targetLink = targetLink + DISCOUNT_CODE;
        } else {
            targetLink = targetLink + "/" + DISCOUNT_CODE;
        }
    }

    console.log("Jumping to:", targetLink); // 调试用

    // 跳转
    window.open(targetLink, '_blank');

    // 切换界面
    showUnlockStep();
}

function showUnlockStep() {
    document.getElementById('step-create').classList.add('hidden');
    document.getElementById('step-unlock').classList.remove('hidden');
    document.getElementById('step-result').classList.add('hidden');
}

function showCreateStep() {
    document.getElementById('step-create').classList.remove('hidden');
    document.getElementById('step-unlock').classList.add('hidden');
    document.getElementById('step-result').classList.add('hidden');
}


// --- 5. 验证与下载 ---
function verifyAndDownload() {
    const key = document.getElementById('license-key').value.trim();
    if (key.length < 5) {
        alert("Please enter a valid License Key.");
        return;
    }
    generateCertificate(key);
}

function generateCertificate(key) {
    const to = localStorage.getItem('echo_to') || "Family";
    const content = localStorage.getItem('echo_content') || "Legacy...";

    document.getElementById('display-to').innerText = to;
    document.getElementById('display-content').innerText = content;
    document.getElementById('display-key').innerText = key.toUpperCase();

    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = ""; 
    new QRCode(qrContainer, {
        text: "https://www.my-echo-box.com",
        width: 70, height: 70, colorDark : "#d4af37", colorLight : "#ffffff"
    });

    document.getElementById('step-unlock').classList.add('hidden');
    document.getElementById('step-result').classList.remove('hidden');
}
