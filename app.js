// ===================================
// The Echo Box - 核心逻辑
// Version: 13.0 (最终完美版 - 稳健折扣模式)
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    
    // 💡 核心配置
    // 优惠码: LPD62M1
    // 逻辑: 使用标准折扣链接，避免自动重复加购
    
    const DISCOUNT_CODE = 'LPD62M1';

    // 1. 场景配置
    const SCENES = {
        futurebloom: {
            title: 'FutureBloom',
            subtitle: "A letter to your child's 18th birthday.",
            placeholder: "If you couldn't be there, what courage would you leave them?",
            // 链接格式: 基础链接 / 优惠码
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
            subtitle: "Seal your love for the future.",
            placeholder: "What's the one memory of us you'd save from the fire?",
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
            subtitle: "Leave an echo, not just a memory.",
            placeholder: "What truth do you fear might die with you?",
            // 严格确认为 ntcaif
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

    // 4. 字符计数
    const charCountEl = document.getElementById('char-count');
    if (legacyText && charCountEl) {
        legacyText.addEventListener('input', () => {
            charCountEl.textContent = legacyText.value.length;
        });
    }

    // 5. 模板按钮
    document.querySelectorAll('.template-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (legacyText) {
                legacyText.value = theme.templates[btn.dataset.template];
                charCountEl.textContent = legacyText.value.length;
                legacyText.focus();
            }
        });
    });

    // 6. Canvas 初始化
    const canvas = document.getElementById('certificate-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;

    // 7. 生成预览按钮
    const imprintBtn = document.getElementById('imprint-button');
    if (imprintBtn) {
        imprintBtn.addEventListener('click', async () => {
            const text = legacyText.value.trim();
            if (!text) {
                alert("Please write something first.");
                return;
            }
            
            document.getElementById('loading-overlay').classList.remove('hidden');
            
            try {
                await drawCertificate(text, true); // true = 带水印预览
                document.getElementById('input-section').classList.add('hidden');
                document.getElementById('result-section').classList.remove('hidden');
                window.scrollTo(0, 0);
            } catch (err) {
                alert("Error loading background image. Please check your assets/ folder.");
                console.error(err);
            } finally {
                document.getElementById('loading-overlay').classList.add('hidden');
            }
        });
    }

    // 8. 绘制证书函数
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
                
                // 绘制正文
                ctx.fillStyle = theme.textColor;
                ctx.font = '65px Inter, sans-serif';
                wrapText(ctx, text, 1500, 850, 2100, 100);

                // 绘制日期
                const date = new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
                ctx.fillStyle = theme.fontColor;
                ctx.font = '40px Inter, sans-serif';
                ctx.fillText(`Sealed on ${date}`, 1500, 1720);

                // 如果是预览，添加水印
                if (isPreview) {
                    ctx.save();
                    ctx.globalAlpha = 0.2;
                    ctx.fillStyle = '#ff0000';
                    ctx.font = 'bold 300px sans-serif';
                    ctx.translate(1500, 1000);
                    ctx.rotate(-Math.PI / 6);
                    ctx.fillText('SAMPLE', 0, 0);
                    ctx.restore();
                }
                
                resolve();
            };
            
            img.onerror = reject;
            img.src = theme.templateImage;
        });
    }

    // 9. 文字换行函数
    function wrapText(context, text, x, y, maxWidth, lineHeight) {
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

    // 10. License 验证按钮
    const verifyBtn = document.getElementById('verify-license-button');
    if (verifyBtn) {
        verifyBtn.addEventListener('click', async () => {
            const key = document.getElementById('license-key-input').value.trim();
            
            if (key.length < 8) {
                alert("Invalid Key. Please check your email.");
                return;
            }

            verifyBtn.innerText = "VERIFYING...";
            verifyBtn.disabled = true;

            // 模拟验证延迟
            setTimeout(async () => {
                try {
                    await drawCertificate(legacyText.value, false); // false = 无水印
                    document.getElementById('license-section').classList.add('hidden');
                    document.getElementById('unlock-section').classList.remove('hidden');
                    
                    // 播放成功音效（可选）
                    try {
                        const chime = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
                        chime.play();
                    } catch (e) {
                        console.log('Audio playback failed:', e);
                    }
                    
                    alert("✨ SUCCESS! UNLOCKED ✨");
                } catch (err) {
                    alert("Error generating certificate. Please try again.");
                    console.error(err);
                } finally {
                    verifyBtn.innerText = "UNLOCK";
                    verifyBtn.disabled = false;
                }
            }, 1500);
        });
    }

    // 11. 下载带水印预览
    const downloadWatermarkedBtn = document.getElementById('download-watermarked-button');
    if (downloadWatermarkedBtn) {
        downloadWatermarkedBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const link = document.createElement('a');
            link.download = 'Preview_Sample.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    }

    // 12. 下载完整版（无水印）
    const downloadFullBtn = document.getElementById('download-full-button');
    if (downloadFullBtn) {
        downloadFullBtn.addEventListener('click', () => {
            const link = document.createElement('a');
            link.download = 'Legacy_Certificate_Full.png';
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
        });
    }
});
