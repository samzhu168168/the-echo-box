// ===================================
// The Echo Box - Ultimate Master Version
// Version: 9.0 (2026 Profit Edition)
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    
    const SCENES = {
        futurebloom: {
            cssClass: 'theme-futurebloom',
            title: 'FutureBloom',
            subtitle: "A letter to your child's 18th birthday.",
            placeholder: "If you couldn't be there, what courage would you leave them?",
            gumroadLink: 'https://samzhu168.gumroad.com/l/lwjqot',
            certificateTitle: 'LETTER TO THE FUTURE',
            templateImage: 'assets/bg-cyber.jpg.png',
            fontColor: '#00FFFF',
            templates: { advice: "To my child: When the world feels loud...", memory: "My favorite memory of us today is...", wish: "My deepest wish for you is..." }
        },
        lovescribe: {
            cssClass: 'theme-lovescribe',
            title: 'LoveScribe',
            subtitle: "Seal your love for the future.",
            placeholder: "What's the one memory of us you'd save from the fire?",
            gumroadLink: 'https://samzhu168.gumroad.com/l/sapjbm',
            certificateTitle: 'ETERNAL VOWS',
            templateImage: 'assets/bg-vintage.jpg.png',
            fontColor: '#2B1B17',
            templates: { advice: "My love: If tomorrow never comes...", memory: "The moment I knew I loved you...", wish: "I promise you..." }
        },
        echobox: {
            cssClass: 'theme-echobox',
            title: 'The Echo Box',
            subtitle: "Leave an echo, not just a memory.",
            placeholder: "What truth do you fear might die with you?",
            gumroadLink: 'https://samzhu168.gumroad.com/l/ntcaif',
            certificateTitle: 'CERTIFICATE OF LEGACY',
            templateImage: 'assets/bg-gold.jpg.png', // 建议替换为带 Mockup 的图
            fontColor: '#D4AF37',
            templates: { advice: "My final piece of wisdom is...", memory: "The truth I've learned that changed everything is...", wish: "Before I am gone, the world must know..." }
        }
    };

    const selectedSceneId = localStorage.getItem('selectedScene') || 'echobox';
    const theme = SCENES[selectedSceneId];
    document.body.className = theme.cssClass;

    // UI 初始化
    document.getElementById('page-title').innerText = theme.title;
    document.getElementById('page-subtitle').innerText = theme.subtitle;
    const legacyText = document.getElementById('legacy-text');
    legacyText.placeholder = theme.placeholder;
    document.getElementById('payment-link').href = theme.gumroadLink;

    const charCountEl = document.getElementById('char-count');
    legacyText.addEventListener('input', () => {
        charCountEl.textContent = legacyText.value.length;
    });

    const canvas = document.getElementById('certificate-canvas');
    const ctx = canvas.getContext('2d');

    // 模板点击
    document.querySelectorAll('.template-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            legacyText.value = theme.templates[btn.dataset.template];
            charCountEl.textContent = legacyText.value.length;
            legacyText.focus();
        });
    });

    // 生成逻辑
    document.getElementById('imprint-button').addEventListener('click', async () => {
        const text = legacyText.value.trim();
        if (!text) return alert("Please write your message first.");
        
        document.getElementById('loading-overlay').classList.remove('hidden');
        try {
            await drawCertificate(text, true); 
            document.getElementById('input-section').classList.add('hidden');
            document.getElementById('result-section').classList.remove('hidden');
            window.scrollTo(0, 0);
        } catch (err) {
            alert("Error: Background failed to load. Check assets.");
        } finally {
            document.getElementById('loading-overlay').classList.add('hidden');
        }
    });

    async function drawCertificate(text, isPreview) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                ctx.clearRect(0, 0, 3000, 2000);
                ctx.drawImage(img, 0, 0, 3000, 2000);
                
                ctx.textAlign = 'center';
                ctx.fillStyle = theme.fontColor;
                ctx.font = 'bold 110px Cinzel, serif';
                ctx.fillText(theme.certificateTitle, 1500, 480);

                // 文字颜色适配
                ctx.fillStyle = (selectedSceneId === 'lovescribe') ? '#2B1B17' : '#ffffff';
                ctx.font = '65px Inter, sans-serif';
                wrapText(ctx, text, 1500, 850, 2100, 100); // 调大了垂直间距增加呼吸感

                const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                ctx.fillStyle = theme.fontColor;
                ctx.font = '40px Inter';
                ctx.fillText(`Sealed on ${date}`, 1500, 1720);

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
            } else { line = testLine; }
        }
        context.fillText(line.trim(), x, y);
    }

    // 验证逻辑 (撒花特效)
    document.getElementById('verify-license-button').addEventListener('click', async () => {
        const key = document.getElementById('license-key-input').value.trim();
        if (key.length < 8) return alert("Invalid Key.");

        document.getElementById('verify-license-button').innerText = "VERIFYING...";
        setTimeout(async () => {
            await drawCertificate(legacyText.value, false);
            document.getElementById('license-section').classList.add('hidden');
            document.getElementById('unlock-section').classList.remove('hidden');
            
            // 简单特效提示
            const chime = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
            chime.play().catch(() => {}); // 播放成功钟声
        }, 1500);
    });

    document.getElementById('download-watermarked-button').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'Preview.png';
        link.href = canvas.toDataURL();
        link.click();
    });

    document.getElementById('download-full-button').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'Premium_Legacy_Certificate.png';
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
    });
});