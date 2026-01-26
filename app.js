// ===================================
// The Echo Box - Ultimate Master Version
// 核心修复：文件名后缀匹配 + 中文换行优化
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. 场景配置 (修正图片路径为 GitHub 上的真实名称)
    const SCENES = {
        futurebloom: {
            cssClass: 'theme-futurebloom',
            title: 'FutureBloom',
            subtitle: "A letter to your child's 18th birthday.",
            placeholder: "If you couldn't be there, what courage would you leave them?",
            gumroadLink: 'https://samzhu168.gumroad.com/l/lwjqot',
            certificateTitle: 'LETTER TO THE FUTURE',
            templateImage: 'assets/bg-cyber.jpg.png', // 匹配 GitHub 文件名
            fontColor: '#00FFFF',
            templates: { 
                advice: "To my child: Always remember that your strength is...", 
                memory: "My favorite memory of us today is...", 
                wish: "My deepest wish for you is..." 
            }
        },
        lovescribe: {
            cssClass: 'theme-lovescribe',
            title: 'LoveScribe',
            subtitle: "Seal your love for the future.",
            placeholder: "What's the one memory of us you'd save from the fire?",
            gumroadLink: 'https://samzhu168.gumroad.com/l/sapjbm',
            certificateTitle: 'ETERNAL VOWS',
            templateImage: 'assets/bg-vintage.jpg.png', // 匹配 GitHub 文件名
            fontColor: '#2B1B17',
            templates: { 
                advice: "My love: If tomorrow never comes, know that...", 
                memory: "The moment I knew I loved you was...", 
                wish: "I promise you, forever and always..." 
            }
        },
        echobox: {
            cssClass: 'theme-echobox',
            title: 'The Echo Box',
            subtitle: "Leave an echo, not just a memory.",
            placeholder: "What truth do you fear might die with you?",
            gumroadLink: 'https://samzhu168.gumroad.com/l/ntcaif',
            certificateTitle: 'CERTIFICATE OF LEGACY',
            templateImage: 'assets/bg-gold.jpg.png', // 匹配 GitHub 文件名
            fontColor: '#D4AF37',
            templates: { 
                advice: "My final piece of wisdom is...", 
                memory: "The truth I've learned that changed everything is...", 
                wish: "Before I am gone, the world must know..." 
            }
        }
    };

    // 2. 获取当前场景并注入 UI
    const selectedSceneId = localStorage.getItem('selectedScene') || 'echobox';
    const theme = SCENES[selectedSceneId];
    document.body.className = theme.cssClass;

    document.getElementById('page-title').innerText = theme.title;
    document.getElementById('page-subtitle').innerText = theme.subtitle;
    const legacyText = document.getElementById('legacy-text');
    legacyText.placeholder = theme.placeholder;
    document.getElementById('payment-link').href = theme.gumroadLink;

    const charCountEl = document.getElementById('char-count');
    legacyText.addEventListener('input', () => {
        charCountEl.textContent = legacyText.value.length;
    });

    // 3. 模板快速填充
    document.querySelectorAll('.template-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            legacyText.value = theme.templates[btn.dataset.template];
            charCountEl.textContent = legacyText.value.length;
        });
    });

    const canvas = document.getElementById('certificate-canvas');
    const ctx = canvas.getContext('2d');

    // 4. 核心生成按钮逻辑
    document.getElementById('imprint-button').addEventListener('click', async () => {
        const text = legacyText.value.trim();
        if (!text) return alert("Please enter your message first.");
        
        document.getElementById('loading-overlay').classList.remove('hidden');
        
        try {
            console.log("Loading image: " + theme.templateImage);
            await drawCertificate(text, true); // 生成带水印预览
            document.getElementById('input-section').classList.add('hidden');
            document.getElementById('result-section').classList.remove('hidden');
            window.scrollTo(0, 0);
        } catch (err) {
            console.error(err);
            alert("Image Load Failed! Please check if " + theme.templateImage + " exists in assets folder.");
        } finally {
            document.getElementById('loading-overlay').classList.add('hidden');
        }
    });

    // 5. 核心绘图算法 (支持 3000px 高清 + 中英文自动换行)
    async function drawCertificate(text, isPreview) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                // 绘制背景
                ctx.clearRect(0, 0, 3000, 2000);
                ctx.drawImage(img, 0, 0, 3000, 2000);
                
                // 绘制标题
                ctx.textAlign = 'center';
                ctx.fillStyle = theme.fontColor;
                ctx.font = 'bold 110px Cinzel, serif';
                ctx.fillText(theme.certificateTitle, 1500, 480);

                // 绘制正文 (根据场景切换文字颜色)
                ctx.fillStyle = (selectedSceneId === 'lovescribe') ? '#2B1B17' : '#ffffff';
                ctx.font = '60px Inter, sans-serif';
                wrapText(ctx, text, 1500, 850, 2200, 95);

                // 绘制日期
                const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                ctx.fillStyle = theme.fontColor;
                ctx.font = '40px Inter';
                ctx.fillText(`Sealed on ${date}`, 1500, 1680);

                // 水印逻辑
                if (isPreview) {
                    ctx.save();
                    ctx.globalAlpha = 0.18;
                    ctx.fillStyle = '#FF0000';
                    ctx.font = 'bold 300px Arial';
                    ctx.translate(1500, 1000);
                    ctx.rotate(-Math.PI / 7);
                    ctx.fillText('SAMPLE', 0, 0);
                    ctx.restore();
                }
                resolve();
            };
            img.onerror = () => reject(new Error("Image Load Error"));
            img.src = theme.templateImage;
        });
    }

    // 智能换行逻辑 (同时支持英文单词和中文单字)
    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        // 如果包含中文字符，按字符拆分；否则按空格拆分
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

    // 6. 下载与验证交互
    document.getElementById('download-watermarked-button').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'Preview.png';
        link.href = canvas.toDataURL();
        link.click();
    });

    document.getElementById('verify-license-button').addEventListener('click', async () => {
        const key = document.getElementById('license-key-input').value.trim();
        if (key.length >= 8) {
            document.getElementById('verify-license-button').innerText = "VERIFYING...";
            setTimeout(async () => {
                await drawCertificate(legacyText.value, false);
                document.getElementById('license-section').classList.add('hidden');
                document.getElementById('unlock-section').classList.remove('hidden');
            }, 1000);
        } else {
            alert("Invalid License Key.");
        }
    });

    document.getElementById('download-full-button').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'Eternal_Echo_Premium.png';
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
    });
});