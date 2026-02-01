/**
 * ECHO BOX ENGINE - STABLE SCREENSHOT VERSION
 * 
 * 核心优化：
 * 1. 多CDN备用加载 html2canvas
 * 2. 智能检测库是否加载成功
 * 3. 优化截图分辨率（1600×2240px，快速+高质量）
 * 4. 完善的错误处理和降级方案
 */

// ============================================================
// 1. 配置中心
// ============================================================
const DISCOUNT_CODE = "launch";

const TEMPLATES = {
    crypto: `[ASSET MAP]\n\nHardware Wallet Location: \n[e.g. In the fake book on the shelf]\n\nSeed Phrase: \n[e.g. Bank box #102]\n\nExchange: Binance\nLogin Email: \nPassword Hint: `,
    bank: `[FINANCIAL KEY]\n\nBank: Chase\nAccount: \n\nInsurance Policy Location: \n[e.g. Blue folder]\n\nLawyer Contact: `,
    love: `[MY VOW]\n\nTo my beloved,\n\nThis is proof that I loved you.\n\nOur Anniversary: \n\nMy promise to you forever: `
};

const PRODUCT_LINKS = {
    crypto: "https://samzhu168.gumroad.com/l/sapjbm",
    bank: "https://samzhu168.gumroad.com/l/ntcaif",
    love: "https://samzhu168.gumroad.com/l/lwjqot"
};

let currentTargetUrl = PRODUCT_LINKS.crypto;
let currentTheme = 'crypto';

// ============================================================
// 2. 初始化
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    animateCounter();
    restoreData();
    applyTheme('crypto');
    
    const btns = document.querySelectorAll('.t-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            if (type) {
                applyTemplate(type);
            }
        });
    });
    
    // 等待 html2canvas 加载完成的提示
    checkLibraryStatus();
});

// 检查 html2canvas 库状态
function checkLibraryStatus() {
    setTimeout(() => {
        if (typeof html2canvas === 'undefined') {
            console.warn('⚠️ html2canvas not loaded yet. Screenshot may not work.');
        } else {
            console.log('✅ html2canvas is ready!');
        }
    }, 3000);
}

// ============================================================
// 3. 模板应用
// ============================================================
function applyTemplate(type) {
    if (navigator.vibrate) navigator.vibrate(50);
    
    const contentBox = document.getElementById('input-content');
    if (contentBox) {
        contentBox.value = TEMPLATES[type] || "";
    }
    
    applyTheme(type);
    currentTargetUrl = PRODUCT_LINKS[type] || PRODUCT_LINKS.crypto;
    currentTheme = type;
    
    console.log(`✅ [${type}] Theme: theme-${type} | URL: ${currentTargetUrl}`);
    
    syncPreview();
    updateButtonStyles(type);
}

// ============================================================
// 4. 主题切换（纯CSS类）
// ============================================================
function applyTheme(type) {
    const paper = document.getElementById('paper-preview');
    if (!paper) return;
    
    paper.classList.remove('theme-crypto', 'theme-bank', 'theme-love');
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
    
    let finalUrl = currentTargetUrl;
    if (DISCOUNT_CODE) {
        finalUrl = finalUrl + "/" + DISCOUNT_CODE;
    }
    
    console.log(`🚀 Opening payment URL: ${finalUrl}`);
    
    localStorage.setItem('echo_to', document.getElementById('input-to').value);
    localStorage.setItem('echo_content', content);
    localStorage.setItem('echo_theme', currentTheme);
    
    window.open(finalUrl, '_blank');
    
    document.getElementById('step-create').classList.add('hidden');
    document.getElementById('step-unlock').classList.remove('hidden');
    window.scrollTo(0, 0);
}

// ============================================================
// 7. 高质量截图下载（优化版）
// ============================================================
function verifyAndDownload() {
    const key = document.getElementById('license-key').value.trim();
    if (key.length < 3) {
        alert("❌ Invalid License Key\n\nPlease enter your key from Gumroad.");
        return;
    }
    
    // 智能检测 html2canvas 是否可用
    if (typeof html2canvas === 'undefined') {
        console.error('html2canvas not loaded');
        alert("⚠️ Screenshot library not available.\n\nPlease refresh the page and try again.\n\nIf the problem persists, contact support.");
        return;
    }
    
    console.log('🎨 Starting screenshot generation...');
    
    // 生成二维码
    const qrContainer = document.getElementById('preview-qr');
    if (qrContainer) {
        qrContainer.innerHTML = "";
        try {
            new QRCode(qrContainer, {
                text: "https://www.my-echo-box.com",
                width: 120,
                height: 120,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        } catch (e) {
            console.error('QR Code generation failed:', e);
        }
    }
    
    // 准备截图
    const paper = document.getElementById('paper-preview');
    const originalWidth = paper.style.width;
    const originalHeight = paper.style.height;
    const originalTransform = paper.style.transform;
    const originalTransition = paper.style.transition;
    const originalBoxShadow = paper.style.boxShadow;
    
    // 显示加载动画
    const loadingMsg = document.createElement('div');
    loadingMsg.id = 'loading-overlay';
    loadingMsg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.95);
        color: #fff;
        padding: 40px 60px;
        border-radius: 20px;
        font-size: 18px;
        z-index: 99999;
        text-align: center;
        border: 3px solid #D4AF37;
        box-shadow: 0 0 60px rgba(212,175,55,0.6);
    `;
    loadingMsg.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin" style="font-size:3rem;color:#D4AF37;margin-bottom:20px;"></i>
        <br>
        <strong style="font-size:1.2rem;">Generating Certificate...</strong>
        <br>
        <small style="opacity:0.7;margin-top:15px;display:block;">Please wait 3-6 seconds</small>
        <br>
        <small style="opacity:0.5;margin-top:5px;display:block;font-size:0.8rem;">Do not close this window</small>
    `;
    document.body.appendChild(loadingMsg);
    
    // 恢复样式的函数
    function restorePaperStyle() {
        paper.style.width = originalWidth;
        paper.style.height = originalHeight;
        paper.style.transition = originalTransition;
        paper.style.transform = originalTransform;
        paper.style.boxShadow = originalBoxShadow;
    }
    
    // 10秒超时保护
    const timeoutId = setTimeout(() => {
        console.error('Screenshot timeout');
        if (document.getElementById('loading-overlay')) {
            document.body.removeChild(loadingMsg);
        }
        restorePaperStyle();
        alert("⏱️ Generation Timeout\n\nPlease try again or contact support if this persists.");
    }, 10000);
    
    // 摆正并放大元素（1600×2240px，高质量且快速）
    paper.style.transition = 'none';
    paper.style.transform = 'none';
    paper.style.boxShadow = 'none';
    paper.style.width = '1600px';
    paper.style.height = '2240px';
    
    // 等待DOM渲染
    setTimeout(() => {
        console.log('📸 Capturing screenshot...');
        
        html2canvas(paper, {
            scale: 1,
            useCORS: true,
            allowTaint: false,
            backgroundColor: null,
            logging: false,
            width: 1600,
            height: 2240,
            windowWidth: 1600,
            windowHeight: 2240,
            onclone: function(clonedDoc) {
                const clonedPaper = clonedDoc.getElementById('paper-preview');
                if (clonedPaper) {
                    clonedPaper.style.transform = 'none';
                    clonedPaper.style.boxShadow = 'none';
                }
            }
        }).then(canvas => {
            clearTimeout(timeoutId);
            console.log('✅ Screenshot captured successfully');
            
            // 转换为高质量PNG并下载
            try {
                const link = document.createElement('a');
                const themeName = currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1);
                const timestamp = new Date().getTime();
                link.download = `EchoBox_${themeName}_Certificate_${timestamp}.png`;
                link.href = canvas.toDataURL("image/png", 0.95);
                link.click();
                
                console.log('💾 Download initiated');
                
                // 恢复样式
                restorePaperStyle();
                if (document.getElementById('loading-overlay')) {
                    document.body.removeChild(loadingMsg);
                }
                
                // 成功提示
                setTimeout(() => {
                    alert(`✅ Certificate Generated Successfully!\n\n📐 Resolution: 1600×2240 pixels\n📄 File Size: ~${Math.round(canvas.toDataURL("image/png", 0.95).length / 1024)}KB\n🎨 Theme: ${themeName}\n\n💡 Perfect for printing on A4 paper!`);
                }, 300);
                
            } catch (e) {
                clearTimeout(timeoutId);
                console.error('Download error:', e);
                restorePaperStyle();
                if (document.getElementById('loading-overlay')) {
                    document.body.removeChild(loadingMsg);
                }
                alert("❌ Download failed. Please try again.");
            }
            
        }).catch(err => {
            clearTimeout(timeoutId);
            console.error('html2canvas error:', err);
            
            restorePaperStyle();
            if (document.getElementById('loading-overlay')) {
                document.body.removeChild(loadingMsg);
            }
            
            alert("❌ Screenshot Generation Failed\n\nError: " + err.message + "\n\nPlease try again or contact support.");
        });
    }, 600);
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
    
    if (savedTheme && TEMPLATES[savedTheme]) {
        applyTheme(savedTheme);
        currentTheme = savedTheme;
        currentTargetUrl = PRODUCT_LINKS[savedTheme];
        updateButtonStyles(savedTheme);
    }
    
    syncPreview();
}
