/**
 * ECHO BOX ENGINE - MINIMALIST CSS VERSION
 * 
 * 核心升级：
 * 1. 移除外部背景图依赖（改用 CSS 类）
 * 2. 超高清截图下载（2400×3360px 打印级别）
 * 3. 精准 Gumroad 链接映射
 * 4. 三种主题无缝切换（theme-crypto/theme-bank/theme-love）
 */

// ============================================================
// 1. 配置中心
// ============================================================
const DISCOUNT_CODE = "launch";

// 模板内容
const TEMPLATES = {
    crypto: `[ASSET MAP]\n\nHardware Wallet Location: \n[e.g. In the fake book on the shelf]\n\nSeed Phrase: \n[e.g. Bank box #102]\n\nExchange: Binance\nLogin Email: \nPassword Hint: `,
    bank: `[FINANCIAL KEY]\n\nBank: Chase\nAccount: \n\nInsurance Policy Location: \n[e.g. Blue folder]\n\nLawyer Contact: `,
    love: `[MY VOW]\n\nTo my beloved,\n\nThis is proof that I loved you.\n\nOur Anniversary: \n\nMy promise to you forever: `
};

// Gumroad 产品链接映射
const PRODUCT_LINKS = {
    crypto: "https://samzhu168.gumroad.com/l/sapjbm",    // Echo Box
    bank: "https://samzhu168.gumroad.com/l/ntcaif",      // FutureBloom
    love: "https://samzhu168.gumroad.com/l/lwjqot"       // LoveScribe
};

// 当前状态
let currentTargetUrl = PRODUCT_LINKS.crypto;
let currentTheme = 'crypto';  // 默认主题

// ============================================================
// 2. 初始化
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    animateCounter();
    restoreData();
    
    // 默认主题
    applyTheme('crypto');
    
    // 绑定模板按钮
    const btns = document.querySelectorAll('.t-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            if (type) {
                applyTemplate(type);
            }
        });
    });
});

// ============================================================
// 3. 模板应用 + 主题切换
// ============================================================
function applyTemplate(type) {
    if (navigator.vibrate) navigator.vibrate(50);
    
    // A. 填充文本内容
    const contentBox = document.getElementById('input-content');
    if (contentBox) {
        contentBox.value = TEMPLATES[type] || "";
    }
    
    // B. 切换主题（CSS 类）
    applyTheme(type);
    
    // C. 更新 Gumroad 链接
    currentTargetUrl = PRODUCT_LINKS[type] || PRODUCT_LINKS.crypto;
    currentTheme = type;
    console.log(`✅ [${type}] Theme: theme-${type} | URL: ${currentTargetUrl}`);
    
    // D. 同步预览
    syncPreview();
    
    // E. 高亮按钮
    updateButtonStyles(type);
}

// ============================================================
// 4. 主题切换（纯 CSS 类）
// ============================================================
function applyTheme(type) {
    const paper = document.getElementById('paper-preview');
    if (!paper) return;
    
    // 移除所有主题类
    paper.classList.remove('theme-crypto', 'theme-bank', 'theme-love');
    
    // 添加新主题类
    paper.classList.add(`theme-${type}`);
}

// ============================================================
// 5. 按钮高亮
// ============================================================
function updateButtonStyles(activeType) {
    const btns = document.querySelectorAll('.t-btn');
    btns.forEach(btn => {
        const btnType = btn.getAttribute('data-type');
        if (btnType === activeType) {
            btn.style.borderColor = '#D4AF37';
            btn.style.color = '#D4AF37';
            btn.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
        } else {
            btn.style.borderColor = '#333';
            btn.style.color = '#ccc';
            btn.style.backgroundColor = '#1a1a1a';
        }
    });
}

// ============================================================
// 6. 支付跳转
// ============================================================
function handlePaymentClick() {
    const content = document.getElementById('input-content').value;
    if (!content) {
        alert("Please write something first.");
        return;
    }
    
    // 构建最终 URL
    let finalUrl = currentTargetUrl;
    if (DISCOUNT_CODE) {
        finalUrl = finalUrl + "/" + DISCOUNT_CODE;
    }
    
    console.log(`🚀 Opening payment URL: ${finalUrl}`);
    
    // 保存草稿
    localStorage.setItem('echo_to', document.getElementById('input-to').value);
    localStorage.setItem('echo_content', content);
    localStorage.setItem('echo_theme', currentTheme);  // 保存主题
    
    // 跳转支付
    window.open(finalUrl, '_blank');
    
    // 切换到 License Key 输入页
    document.getElementById('step-create').classList.add('hidden');
    document.getElementById('step-unlock').classList.remove('hidden');
    window.scrollTo(0, 0);
}

// ============================================================
// 7. 超高清截图下载（2400×3360px 打印级别）
// ============================================================
function verifyAndDownload() {
    const key = document.getElementById('license-key').value.trim();
    if (key.length < 3) {
        alert("Invalid Key");
        return;
    }
    
    // 1. 生成更大的二维码
    const qrContainer = document.getElementById('preview-qr');
    if (qrContainer) {
        qrContainer.innerHTML = "";
        new QRCode(qrContainer, {
            text: "https://www.my-echo-box.com",
            width: 150,
            height: 150,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }
    
    // 2. 准备截图：移除 3D 效果 + 放大元素
    const paper = document.getElementById('paper-preview');
    const originalWidth = paper.style.width;
    const originalHeight = paper.style.height;
    const originalTransform = paper.style.transform;
    const originalTransition = paper.style.transition;
    const originalBoxShadow = paper.style.boxShadow;
    
    // 显示加载提示
    const loadingMsg = document.createElement('div');
    loadingMsg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.95);color:#fff;padding:30px 50px;border-radius:15px;font-size:18px;z-index:99999;text-align:center;border:2px solid #D4AF37;box-shadow:0 0 40px rgba(212,175,55,0.5);';
    loadingMsg.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="font-size:2rem;color:#D4AF37;"></i><br><br><strong>Generating Ultra HD Certificate...</strong><br><small style="opacity:0.7;margin-top:10px;display:block;">This may take 5-10 seconds</small>';
    document.body.appendChild(loadingMsg);
    
    // 瞬间"摆正"并放大
    paper.style.transition = 'none';
    paper.style.transform = 'none';
    paper.style.boxShadow = 'none';
    paper.style.width = '2400px';
    paper.style.height = '3360px';
    
    // 给 DOM 渲染时间
    setTimeout(() => {
        html2canvas(paper, {
            scale: 1,
            useCORS: true,
            backgroundColor: null,
            logging: false,
            width: 2400,
            height: 3360,
            windowWidth: 2400,
            windowHeight: 3360
        }).then(canvas => {
            // 创建下载链接
            const link = document.createElement('a');
            const themeName = currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1);
            link.download = `EchoBox_${themeName}_Certificate_${Date.now()}.png`;
            link.href = canvas.toDataURL("image/png", 1.0);
            link.click();
            
            // 恢复原始尺寸
            paper.style.width = originalWidth;
            paper.style.height = originalHeight;
            paper.style.transition = originalTransition;
            paper.style.transform = originalTransform;
            paper.style.boxShadow = originalBoxShadow;
            
            document.body.removeChild(loadingMsg);
            
            alert("✅ Ultra HD Certificate Generated!\n\n📐 Resolution: 2400×3360 pixels\n📄 Perfect for A4 printing at 300 DPI\n🎨 Theme: " + themeName);
            
        }).catch(err => {
            console.error("Screenshot error:", err);
            
            paper.style.width = originalWidth;
            paper.style.height = originalHeight;
            paper.style.transition = originalTransition;
            paper.style.transform = originalTransform;
            paper.style.boxShadow = originalBoxShadow;
            document.body.removeChild(loadingMsg);
            
            alert("❌ Error generating image. Please try again.");
        });
    }, 800);
}

// ============================================================
// 8. 辅助功能
// ============================================================
function syncPreview() {
    const to = document.getElementById('input-to').value;
    const content = document.getElementById('input-content').value;
    const pTo = document.getElementById('preview-to');
    const pContent = document.getElementById('preview-content');
    
    if (pTo) pTo.innerText = to || "Recipient Name";
    if (pContent) pContent.innerText = content || "Start typing...";
}

function toggleUnlock() {
    document.getElementById('step-create').classList.toggle('hidden');
    document.getElementById('step-unlock').classList.toggle('hidden');
}

function animateCounter() {
    let count = 12842;
    const el = document.getElementById('global-counter');
    if (el) {
        setInterval(() => {
            if (Math.random() > 0.7) {
                el.innerText = (++count).toLocaleString();
            }
        }, 3000);
    }
}

function restoreData() {
    const savedContent = localStorage.getItem('echo_content');
    const savedTo = localStorage.getItem('echo_to');
    const savedTheme = localStorage.getItem('echo_theme');
    
    if (savedContent) {
        const el = document.getElementById('input-content');
        if (el) el.value = savedContent;
    }
    
    if (savedTo) {
        const el = document.getElementById('input-to');
        if (el) el.value = savedTo;
    }
    
    // 恢复主题
    if (savedTheme && TEMPLATES[savedTheme]) {
        applyTheme(savedTheme);
        currentTheme = savedTheme;
        currentTargetUrl = PRODUCT_LINKS[savedTheme];
        updateButtonStyles(savedTheme);
    }
    
    syncPreview();
}
