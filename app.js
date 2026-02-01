/**
 * ECHO BOX ENGINE - ULTIMATE VERSION
 * 
 * 功能整合：
 * 1. 精准 Gumroad 链接映射 (Love->lwjqot, Bank->ntcaif, Crypto->sapjbm)
 * 2. 动态背景图片切换 (使用 assets 文件夹图片)
 * 3. html2canvas 高清截图下载 (替代打印对话框)
 * 4. 深色/浅色背景自适应文字颜色
 */

// ============================================================
// 1. 配置中心
// ============================================================
const DISCOUNT_CODE = "launch";  // Gumroad 折扣码

// 模板内容
const TEMPLATES = {
    crypto: `[ASSET MAP]\n\nHardware Wallet Location: \n[e.g. In the fake book on the shelf]\n\nSeed Phrase: \n[e.g. Bank box #102]\n\nExchange: Binance\nLogin Email: \nPassword Hint: `,
    bank: `[FINANCIAL KEY]\n\nBank: Chase\nAccount: \n\nInsurance Policy Location: \n[e.g. Blue folder]\n\nLawyer Contact: `,
    love: `[MY VOW]\n\nTo my beloved,\n\nThis is proof that I loved you.\n\nOur Anniversary: \n\nMy promise to you forever: `
};

// 背景图映射 (使用您 assets 文件夹里的图片)
const BACKGROUNDS = {
    crypto: "url('assets/bg-cyber.png')",    // 赛博朋克风
    bank: "url('assets/bg-gold.png')",       // 黑金风
    love: "url('assets/bg-vintage.png')",    // 复古纸张风
    default: "url('assets/bg-vintage.png')"
};

// Gumroad 产品链接映射 (精准对应)
const PRODUCT_LINKS = {
    crypto: "https://samzhu168.gumroad.com/l/sapjbm",    // Echo Box
    bank: "https://samzhu168.gumroad.com/l/ntcaif",      // FutureBloom
    love: "https://samzhu168.gumroad.com/l/lwjqot"       // LoveScribe
};

// 当前状态
let currentTargetUrl = PRODUCT_LINKS.crypto;  // 默认 Crypto

// ============================================================
// 2. 初始化
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    animateCounter();
    restoreData();
    
    // 默认背景和按钮状态
    updateBackground('crypto');
    updateButtonStyles('crypto');
    
    // 绑定模板按钮点击事件
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
// 3. 模板应用 + 视觉切换
// ============================================================
function applyTemplate(type) {
    if (navigator.vibrate) navigator.vibrate(50);
    
    // A. 填充文本内容
    const contentBox = document.getElementById('input-content');
    if (contentBox) {
        contentBox.value = TEMPLATES[type] || "";
    }
    
    // B. 更新背景图
    updateBackground(type);
    
    // C. 更新 Gumroad 链接 (核心映射)
    currentTargetUrl = PRODUCT_LINKS[type] || PRODUCT_LINKS.crypto;
    console.log(`✅ [${type}] Target URL → ${currentTargetUrl}`);
    
    // D. 同步预览
    syncPreview();
    
    // E. 高亮当前按钮
    updateButtonStyles(type);
}

// ============================================================
// 4. 背景图片切换 + 自适应文字颜色
// ============================================================
function updateBackground(type) {
    const paper = document.getElementById('paper-preview');
    if (!paper) return;
    
    // 设置背景图
    paper.style.backgroundImage = BACKGROUNDS[type] || BACKGROUNDS.default;
    paper.style.backgroundSize = 'cover';
    paper.style.backgroundPosition = 'center';
    
    const border = paper.querySelector('.paper-border');
    
    // 根据背景类型调整文字和边框颜色
    if (type === 'crypto' || type === 'bank') {
        // 深色背景 → 浅色文字
        paper.style.color = '#ffffff';
        if (border) {
            border.style.background = 'rgba(0, 0, 0, 0.7)';
            border.style.borderColor = (type === 'crypto') ? '#00f0ff' : '#D4AF37';
        }
        
        // 所有文字调为浅色
        const textElements = paper.querySelectorAll('h3, .official-text, .handwritten-font, .typewriter-font, .label-text');
        textElements.forEach(el => {
            el.style.color = '#eeeeee';
        });
        
    } else {
        // 浅色背景 (love) → 深色文字
        paper.style.color = '#111111';
        if (border) {
            border.style.background = 'rgba(255, 255, 255, 0.85)';
            border.style.borderColor = '#D4AF37';
        }
        
        // 文字调为深色
        const headers = paper.querySelectorAll('h3, .official-text, .handwritten-font, .typewriter-font');
        headers.forEach(el => {
            el.style.color = '#111111';
        });
        
        const labels = paper.querySelectorAll('.label-text');
        labels.forEach(el => {
            el.style.color = '#666666';
        });
    }
}

// ============================================================
// 5. 按钮高亮样式
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
    
    // 构建最终 URL (基础链接 + 折扣码)
    let finalUrl = currentTargetUrl;
    if (DISCOUNT_CODE) {
        finalUrl = finalUrl + "/" + DISCOUNT_CODE;
    }
    
    console.log(`🚀 Opening payment URL: ${finalUrl}`);
    
    // 保存草稿
    localStorage.setItem('echo_to', document.getElementById('input-to').value);
    localStorage.setItem('echo_content', content);
    
    // 跳转支付
    window.open(finalUrl, '_blank');
    
    // 切换到 License Key 输入页
    document.getElementById('step-create').classList.add('hidden');
    document.getElementById('step-unlock').classList.remove('hidden');
    window.scrollTo(0, 0);
}

// ============================================================
// 7. License Key 验证 + html2canvas 高清截图下载
// ============================================================
function verifyAndDownload() {
    const key = document.getElementById('license-key').value.trim();
    if (key.length < 3) {
        alert("Invalid Key");
        return;
    }
    
    // 1. 生成二维码
    const qrContainer = document.getElementById('preview-qr');
    if (qrContainer) {
        qrContainer.innerHTML = "";
        new QRCode(qrContainer, {
            text: "https://www.my-echo-box.com",
            width: 60,
            height: 60,
            colorDark: "#000000",
            colorLight: "#ffffff"
        });
    }
    
    // 2. 准备截图：暂时移除 3D 效果
    const paper = document.getElementById('paper-preview');
    const originalTransform = paper.style.transform;
    const originalTransition = paper.style.transition;
    const originalBoxShadow = paper.style.boxShadow;
    
    // 瞬间"摆正"纸张
    paper.style.transition = 'none';
    paper.style.transform = 'none';
    paper.style.boxShadow = 'none';
    
    // 给 DOM 一点渲染时间（让二维码完全加载）
    setTimeout(() => {
        // 3. 调用 html2canvas 拍照
        html2canvas(paper, {
            scale: 3,              // 3倍超高清
            useCORS: true,         // 允许跨域图片
            backgroundColor: null, // 透明背景
            logging: false         // 关闭控制台日志
        }).then(canvas => {
            // 4. 创建下载链接
            const link = document.createElement('a');
            link.download = `EchoBox_Legacy_Certificate_${Date.now()}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
            
            // 5. 恢复 3D 效果
            paper.style.transition = originalTransition;
            paper.style.transform = originalTransform;
            paper.style.boxShadow = originalBoxShadow;
            
            alert("✅ Certificate Generated Successfully!\n\nHigh-resolution PNG downloaded.");
            
        }).catch(err => {
            console.error("Screenshot error:", err);
            alert("❌ Error generating image. Please try again.");
            
            // 即使出错也要恢复 UI
            paper.style.transition = originalTransition;
            paper.style.transform = originalTransform;
            paper.style.boxShadow = originalBoxShadow;
        });
    }, 500);  // 500ms 足够让二维码渲染完成
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
    
    if (savedContent) {
        const el = document.getElementById('input-content');
        if (el) el.value = savedContent;
    }
    
    if (savedTo) {
        const el = document.getElementById('input-to');
        if (el) el.value = savedTo;
    }
    
    syncPreview();
}
