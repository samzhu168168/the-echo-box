// ===================================
// The Echo Box - Core Logic (Final)
// Version: 16.0 (Zero-Knowledge & Auto-Save)
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    
    // 💡 核心配置
    const DISCOUNT_CODE = 'LPD62M1';

    // 1. 场景配置 (灵魂文案已注入)
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
    // 🛡️ 核心升级：LocalStorage 自动存档 (无数据库解决方案)
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

    // 4. 模板按钮委托 (点击模板也会自动保存)
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
                alert("System Error: Assets missing. Please check connection.");
                console.error(err);
            } finally {
                imprintBtn.innerText = "GENERATE PREVIEW";
            }
        });
    }

    // 7. 绘制证书核心函数
    async function drawCertificate(text, isPreview) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            
            img.onload = () => {
                // 清空画布
                ctx.clearRect(0, 0, 3000, 2000);
                
                // 绘制背景
                ctx.drawImage(img, 0, 0, 3000, 2000);
                
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
                
                resolve();
            };
            
            img.onerror = reject;
            img.src = theme.templateImage;
        });
    }

    // 8. 文字自动换行处理
    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        // 简单判断中英文，优化断行体验
        const isChinese = /[\u4e00-\u9fa5]/.test(text);
        const words = isChinese ? text.split('') : text.split(' ');
        let line = '';
        
        for (let n = 0; n < words.length; n++) {
            let testLine = line + words[n] + (isChinese ? '' : ' ');
            if (context.measureText(testLine).width > maxWidth && n > 0) {
                context.fillText(line.trim(), x, y);
                line = words[n] + (isChinese ? '' : ' ');
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        context.fillText(line.trim(), x, y);
    }

    // 9. License 验证 (MVP 软验证)
    const verifyBtn = document.getElementById('verify-license-button');
    if (verifyBtn) {
        verifyBtn.addEventListener('click', async () => {
            const key = document.getElementById('license-key-input').value.trim();
            
            // 简单的长度检查，不发请求，保护无后端逻辑
            if (key.length < 5) {
                alert("Invalid Access Key.");
                return;
            }

            verifyBtn.innerText = "VERIFYING...";
            verifyBtn.disabled = true;

            // 模拟区块链验证延迟 (Product Theatre)
            setTimeout(async () => {
                try {
                    await drawCertificate(legacyText.value, false); // false = 无水印
                    document.getElementById('unlock-section').style.display = 'block';
                    document.getElementById('unlock-section').classList.remove('hidden');
                    
                    alert("✨ ACCESS GRANTED: Legacy Asset Unlocked.");
                } catch (err) {
                    console.error(err);
                    alert("Error generating asset. Please retry.");
                } finally {
                    verifyBtn.innerText = "UNLOCK";
                    verifyBtn.disabled = false;
                }
            }, 1200);
        });
    }

    // 10. 最终下载
    const downloadFullBtn = document.getElementById('download-full-button');
    if (downloadFullBtn) {
        downloadFullBtn.addEventListener('click', () => {
            const link = document.createElement('a');
            // 生成带时间戳的文件名，增加存档感
            const timestamp = new Date().toISOString().slice(0,10);
            link.download = `EchoBox_Legacy_${timestamp}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
        });
    }
});
