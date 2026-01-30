// ===================================
// The Echo Box - Core Logic (Final Stable)
// Version: 17.0 (Local Fix + Auto-Save + Fallback Mode)
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    
    // 💡 核心配置
    const DISCOUNT_CODE = 'LPD62M1';

    // 1. 场景配置 (保留v16.0 灵魂文案)
    const SCENES = {
        futurebloom: {
            title: 'FutureBloom: The Promise',
            subtitle: "If the world goes dark, be their light.",
            placeholder: "They say the future is uncertain. If you aren't there to guide them through the noise, who will? \n\nWrite the words that will serve as their lantern when the lights go out...",
            gumroadLink: `https://samzhu168.gumroad.com/l/lwjqot/${DISCOUNT_CODE}`,
            certificateTitle: 'LETTER TO THE FUTURE',
            templateImage: 'assets/bg-cyber.png',
            fontColor: '#00FFFF',
            textColor: '#ffffff',
            templates: { 
                advice: "To my child: When the world feels loud, remember that your voice matters. Never let anyone dim your light. You are capable of more than you know.", 
                memory: "My favorite memory of us today is watching you laugh without worry. That pure joy is what I want you to carry forever.", 
                wish: "My deepest wish for you is to live fearlessly. Take risks, make mistakes, and always choose love over fear." 
            }
        },
        lovescribe: {
            title: 'LoveScribe',
            subtitle: "Seal your love against time.",
            placeholder: "What is the one memory of us you would save from the fire? \n\nSeal your vows here, so they remain even if we are apart.",
            gumroadLink: `https://samzhu168.gumroad.com/l/sapjbm/${DISCOUNT_CODE}`,
            certificateTitle: 'ETERNAL VOWS',
            templateImage: 'assets/bg-vintage.png',
            fontColor: '#2B1B17',
            textColor: '#2B1B17',
            templates: { 
                advice: "My love: If tomorrow never comes, know that every moment with you was a gift. You made my life complete.", 
                memory: "The moment I knew I loved you was when I realized I'd rather argue with you than laugh with anyone else.", 
                wish: "I promise you: I will love you in every lifetime, in every universe, until the stars burn out." 
            }
        },
        echobox: {
            title: 'The Echo Box',
            subtitle: "The Gold Standard of Legacy.",
            placeholder: "What truth do you fear might die with you? \n\nMint your wisdom now. Create an immutable record of your existence.",
            gumroadLink: `https://samzhu168.gumroad.com/l/ntcaif/${DISCOUNT_CODE}`,
            certificateTitle: 'CERTIFICATE OF LEGACY',
            templateImage: 'assets/bg-gold.png',
            fontColor: '#D4AF37',
            textColor: '#ffffff',
            templates: { 
                advice: "My final piece of wisdom is this: Success is not measured by what you gain, but by what you give.", 
                memory: "The truth I've learned that changed everything is that time doesn't heal wounds—love does.", 
                wish: "Before I am gone, the world must know that every person you meet is fighting a battle you know nothing about. Be kind." 
            }
        }
    };

    // 2. 初始化场景
    const selectedSceneId = localStorage.getItem('selectedScene') || 'echobox';
    const theme = SCENES[selectedSceneId];
    
    // 容错处理
    if (!theme) {
        localStorage.setItem('selectedScene', 'echobox');
        window.location.reload();
        return;
    }

    document.body.className = 'theme-' + selectedSceneId;

    // 3. UI 注入
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) pageTitle.innerText = theme.title;
    
    const pageSubtitle = document.getElementById('page-subtitle');
    if (pageSubtitle) pageSubtitle.innerText = theme.subtitle;
    
    const legacyText = document.getElementById('legacy-text');
    if (legacyText) {
        legacyText.placeholder = theme.placeholder;
    }
    
    const paymentLink = document.getElementById('payment-link');
    if (paymentLink) paymentLink.href = theme.gumroadLink;

    const charCountEl = document.getElementById('char-count');

    // ============================================================
    // 🛡️ 核心功能：LocalStorage 自动存档 (无数据库解决方案)
    // ============================================================
    const DRAFT_KEY = 'echo_draft_' + selectedSceneId;

    // A. 页面加载时：恢复草稿
    if (legacyText) {
        const savedDraft = localStorage.getItem(DRAFT_KEY);
        if (savedDraft) {
            legacyText.value = savedDraft;
            if (charCountEl) charCountEl.textContent = `${savedDraft.length}/500`;
            console.log("System: Draft restored from local vault.");
        }

        // B. 输入时：实时保存
        legacyText.addEventListener('input', () => {
            const currentText = legacyText.value;
            localStorage.setItem(DRAFT_KEY, currentText); // 存入浏览器
            if (charCountEl) charCountEl.textContent = `${currentText.length}/500`;
        });
    }

    // 4. 模板按钮委托
    document.addEventListener('click', (e) => {
        if(e.target.matches('[data-template]')) {
             if (legacyText) {
                const newText = theme.templates[e.target.dataset.template];
                legacyText.value = newText;
                localStorage.setItem(DRAFT_KEY, newText); // 保存模板内容
                if(charCountEl) charCountEl.textContent = `${newText.length}/500`;
                legacyText.focus();
            }
        }
    });

    // 5. Canvas 初始化
    const canvas = document.getElementById('certificate-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;

    // 6. 生成预览按钮
    const imprintBtn = document.getElementById('imprint-button');
    if (imprintBtn) {
        imprintBtn.addEventListener('click', async () => {
            const text = legacyText.value.trim();
            if (!text) {
                alert("The vault cannot be sealed empty. Please write something.");
                return;
            }
            
            imprintBtn.innerText = "ENCRYPTING DATA...";
            
            try {
                await drawCertificate(text, true); // true = 预览模式
                document.getElementById('input-section').style.display = 'none';
                document.getElementById('result-section').style.display = 'block';
                document.getElementById('result-section').classList.remove('hidden'); 
                window.scrollTo(0, 0);
            } catch (err) {
                console.error(err);
                // 即使报错也不要阻断流程，drawCertificate 内部已经做了兜底
            } finally {
                imprintBtn.innerText = "GENERATE PREVIEW";
            }
        });
    }

    // ============================================================
    // 🛠️ 绘制核心 (修复了本地报错 & 增加了无图兜底)
    // ============================================================
    async function drawCertificate(text, isPreview) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            // ❌ 移除了 crossOrigin，解决 file:// 协议下的报错问题
            // img.crossOrigin = "anonymous"; 
            
            img.onload = () => {
                // 1. 清空画布
                ctx.clearRect(0, 0, 3000, 2000);
                // 2. 绘制背景
                ctx.drawImage(img, 0, 0, 3000, 2000);
                // 3. 绘制文字内容
                drawTextContent(text, isPreview);
                resolve();
            };
            
            img.onerror = () => {
                console.warn("System Warning: Background assets missing. Using fallback secure vault style.");
                
                // ⚠️ 兜底方案：如果没有图片，绘制纯黑金风格背景
                ctx.fillStyle = '#0a0a0a'; // 深黑背景
                ctx.fillRect(0, 0, 3000, 2000);
                
                // 绘制边框
                ctx.strokeStyle = theme.fontColor;
                ctx.lineWidth = 20;
                ctx.strokeRect(50, 50, 2900, 1900);
                ctx.lineWidth = 5;
                ctx.strokeRect(80, 80, 2840, 1840);

                // 绘制文字内容
                drawTextContent(text, isPreview);
                resolve(); // 强制标记为成功，不弹错误窗
            };
            
            // 尝试加载图片
            img.src = theme.templateImage;
        });
    }

    // 辅助函数：统一绘制文字
    function drawTextContent(text, isPreview) {
        // 绘制标题
        ctx.textAlign = 'center';
        ctx.fillStyle = theme.fontColor;
        ctx.font = 'bold 110px Cinzel, serif';
        ctx.fillText(theme.certificateTitle, 1500, 480);
        
        // 绘制正文 (自动换行)
        ctx.fillStyle = theme.textColor;
        ctx.font = '65px Inter, sans-serif';
        wrapText(ctx, text, 1500, 850, 2100, 100);

        // 绘制日期
        const date = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', month: 'long', day: 'numeric' 
        });
        ctx.fillStyle = theme.fontColor;
        ctx.font = '40px Inter, sans-serif';
        ctx.fillText(`Sealed on ${date}`, 1500, 1720);

        // 预览水印
        if (isPreview) {
            ctx.save();
            ctx.globalAlpha = 0.2;
            ctx.fillStyle = '#ff0000'; // 警示红水印
            ctx.font = 'bold 300px sans-serif';
            ctx.translate(1500, 1000);
            ctx.rotate(-Math.PI / 6);
            ctx.fillText('PREVIEW MODE', 0, 0);
            ctx.restore();
        }
    }

    // 8. 文字自动换行处理
    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        c
