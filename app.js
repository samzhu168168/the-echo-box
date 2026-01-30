// ===================================
// The Echo Box - Core Logic (Simplified Fix)
// Version: 17.5 (3 Separate Products - Clean Cart)
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    
    // 💡 核心配置
    const DISCOUNT_CODE = 'LPD62M1';

    // 1. 场景配置 - 每个场景对应一个独立的 Gumroad 产品
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
    
    // ⚡ 关键优化：使用当前场景的链接
    const paymentLink = document.getElementById('payment-link');
    if (paymentLink) {
        paymentLink.href = theme.gumroadLink;
        paymentLink.target = '_blank';
        paymentLink.rel = 'noopener noreferrer';
    }

    const charCountEl = document.getElementById('char-count');

    // ============================================================
    // 🛡️ 核心功能：LocalStorage 自动存档
    // ============================================================
    const DRAFT_KEY = 'echo_draft_' + selectedSceneId;

    // A. 页面加载时：恢复草稿
    if (legacyText) {
        const savedDraft = localStorage.getItem(DRAFT_KEY);
        if (savedDraft) {
            legacyText.value = savedDraft;
            if (charCountEl) charCountEl.textContent = `${savedDraft.length}/500`;
            console.log("✅ System: Draft restored from local vault.");
        }

        // B. 输入时：实时保存
        legacyText.addEventListener('input', () => {
            const currentText = legacyText.value;
            localStorage.setItem(DRAFT_KEY, currentText);
            if (charCountEl) charCountEl.textContent = `${currentText.length}/500`;
        });
    }

    // 4. 模板按钮委托
    document.addEventListener('click', (e) => {
        if(e.target.matches('[data-template]')) {
             if (legacyText) {
                const newText = theme.templates[e.target.dataset.template];
                legacyText.value = newText;
                localStorage.setItem(DRAFT_KEY, newText);
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
                alert("⚠️ The vault cannot be sealed empty. Please write something.");
                return;
            }
            
            imprintBtn.innerText = "⚙️ ENCRYPTING DATA...";
            imprintBtn.disabled = true;
            
            try {
                await drawCertificate(text, true);
                document.getElementById('input-section').style.display = 'none';
                document.getElementById('result-section').style.display = 'block';
                document.getElementById('result-section').classList.remove('hidden'); 
                window.scrollTo(0, 0);
                console.log("✅ Certificate preview generated successfully");
            } catch (err) {
                console.error("❌ Certificate generation error:", err);
                alert("System warning: Certificate preview generated with fallback styling.");
            } finally {
                imprintBtn.innerText = "GENERATE PREVIEW";
                imprintBtn.disabled = false;
            }
        });
    }

    // ============================================================
    // 🛠️ 绘制核心函数
    // ============================================================
    async function drawCertificate(text, isPreview) {
        if (!canvas || !ctx) {
            throw new Error("Canvas not available");
        }

        return new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = () => {
                try {
                    ctx.clearRect(0, 0, 3000, 2000);
                    ctx.drawImage(img, 0, 0, 3000, 2000);
                    drawTextContent(text, isPreview);
                    resolve();
                } catch (err) {
                    console.error("Drawing error:", err);
                    reject(err);
                }
            };
            
            img.onerror = () => {
                console.warn("⚠️ Background image missing. Using fallback style.");
                
                try {
                    ctx.fillStyle = '#0a0a0a';
                    ctx.fillRect(0, 0, 3000, 2000);
                    
                    ctx.strokeStyle = theme.fontColor;
                    ctx.lineWidth = 20;
                    ctx.strokeRect(50, 50, 2900, 1900);
                    ctx.lineWidth = 5;
                    ctx.strokeRect(80, 80, 2840, 1840);

                    drawTextContent(text, isPreview);
                    resolve();
                } catch (err) {
                    console.error("Fallback drawing error:", err);
                    reject(err);
                }
            };
            
            img.src = theme.templateImage;
        });
    }

    function drawTextContent(text, isPreview) {
        ctx.textAlign = 'center';
        ctx.fillStyle = theme.fontColor;
        ctx.font = 'bold 110px Cinzel, serif';
        ctx.fillText(theme.certificateTitle, 1500, 480);
        
        ctx.fillStyle = theme.textColor;
        ctx.font = '65px Inter, sans-serif';
        wrapText(ctx, text, 1500, 850, 2100, 100);

        const date = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', month: 'long', day: 'numeric' 
        });
        ctx.fillStyle = theme.fontColor;
        ctx.font = '40px Inter, sans-serif';
        ctx.fillText(`Sealed on ${date}`, 1500, 1720);

        if (isPreview) {
            ctx.save();
            ctx.globalAlpha = 0.2;
            ctx.fillStyle = '#ff0000';
            ctx.font = 'bold 300px sans-serif';
            ctx.translate(1500, 1000);
            ctx.rotate(-Math.PI / 6);
            ctx.fillText('PREVIEW MODE', 0, 0);
            ctx.restore();
        }
    }

    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let testLine = '';
        let lineArray = [];

        for (let n = 0; n < words.length; n++) {
            testLine = line + words[n] + ' ';
            const metrics = context.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                lineArray.push(line);
                line = words[n] + ' ';
            } else {
                line = testLine;
            }
        }
        lineArray.push(line);

        for (let k = 0; k < lineArray.length; k++) {
            context.fillText(lineArray[k], x, y + (k * lineHeight));
        }
    }

    // ============================================================
    // 🔑 License Key 验证
    // ============================================================
    const verifyBtn = document.getElementById('verify-license-button');
    const licenseInput = document.getElementById('license-key-input');
    const unlockSection = document.getElementById('unlock-section');

    if (verifyBtn && licenseInput) {
        verifyBtn.addEventListener('click', () => {
            const key = licenseInput.value.trim().toUpperCase();
            
            if (key.startsWith('ECHO-') && key.length >= 10) {
                if (unlockSection) {
                    unlockSection.style.display = 'block';
                    unlockSection.classList.remove('hidden');
                }
                licenseInput.disabled = true;
                verifyBtn.disabled = true;
                verifyBtn.innerText = '✅ VERIFIED';
                console.log("✅ License key verified");
            } else {
                alert('⚠️ INVALID KEY: Please check your license code.');
            }
        });
    }

    // ============================================================
    // ⬇️ 下载功能
    // ============================================================
    const downloadBtn = document.getElementById('download-full-button');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', async () => {
            const text = legacyText.value.trim();
            if (!text) {
                alert("⚠️ Cannot download empty certificate.");
                return;
            }

            downloadBtn.innerText = "⚙️ GENERATING MASTER FILE...";
            downloadBtn.disabled = true;

            try {
                await drawCertificate(text, false);
                
                canvas.toBlob((blob) => {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `EchoBox-${selectedSceneId}-${Date.now()}.png`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    
                    downloadBtn.innerText = "✅ DOWNLOAD COMPLETE";
                    console.log("✅ Certificate downloaded successfully");
                    
                    setTimeout(() => {
                        downloadBtn.innerText = "⬇️ DOWNLOAD MASTER FILE";
                        downloadBtn.disabled = false;
                    }, 3000);
                }, 'image/png');

            } catch (err) {
                console.error("❌ Download error:", err);
                alert("Download failed. Please try again.");
                downloadBtn.innerText = "⬇️ DOWNLOAD MASTER FILE";
                downloadBtn.disabled = false;
            }
        });
    }

});
