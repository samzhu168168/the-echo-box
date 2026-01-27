document.addEventListener('DOMContentLoaded', () => {
    
    // 1. 核心场景配置 (路径已更新为 .png 适配你的 GitHub)
    const SCENES = {
        futurebloom: {
            title: 'FutureBloom',
            subtitle: "A letter to your child's 18th birthday.",
            gumroadLink: 'https://samzhu168.gumroad.com/l/lwjqot',
            certificateTitle: 'LETTER TO THE FUTURE',
            templateImage: 'assets/bg-cyber.png', 
            fontColor: '#00FFFF',
            templates: { advice: "To my child: Always remember...", memory: "My favorite memory is...", wish: "My deepest wish..." }
        },
        lovescribe: {
            title: 'LoveScribe',
            subtitle: "Seal your love for the future.",
            gumroadLink: 'https://samzhu168.gumroad.com/l/sapjbm',
            certificateTitle: 'ETERNAL VOWS',
            templateImage: 'assets/bg-vintage.png',
            fontColor: '#2B1B17',
            templates: { advice: "My love: If tomorrow never comes...", memory: "The moment I knew...", wish: "I promise you..." }
        },
        echobox: {
            title: 'The Echo Box',
            subtitle: "Leave an echo, not just a memory.",
            gumroadLink: 'https://samzhu168.gumroad.com/l/ntcaif',
            certificateTitle: 'CERTIFICATE OF LEGACY',
            templateImage: 'assets/bg-gold.png',
            fontColor: '#D4AF37',
            templates: { advice: "My final wisdom is...", memory: "The truth I've learned...", wish: "Before I am gone..." }
        }
    };

    const selectedSceneId = localStorage.getItem('selectedScene') || 'echobox';
    const theme = SCENES[selectedSceneId];
    document.body.className = 'theme-' + selectedSceneId;

    // UI 注入
    const pageTitle = document.getElementById('page-title');
    if(pageTitle) pageTitle.innerText = theme.title;
    const legacyText = document.getElementById('legacy-text');
    const paymentLink = document.getElementById('payment-link');
    if(paymentLink) paymentLink.href = theme.gumroadLink;

    const charCountEl = document.getElementById('char-count');
    if(legacyText) {
        legacyText.addEventListener('input', () => charCountEl.textContent = legacyText.value.length);
    }

    document.querySelectorAll('.template-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            legacyText.value = theme.templates[btn.dataset.template];
            charCountEl.textContent = legacyText.value.length;
        });
    });

    const canvas = document.getElementById('certificate-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;

    // 生成预览
    const imprintBtn = document.getElementById('imprint-button');
    if(imprintBtn) {
        imprintBtn.addEventListener('click', async () => {
            if(!legacyText.value.trim()) return alert("Write something first.");
            document.getElementById('loading-overlay').classList.remove('hidden');
            try {
                await drawCertificate(legacyText.value, true);
                document.getElementById('input-section').classList.add('hidden');
                document.getElementById('result-section').classList.remove('hidden');
                window.scrollTo(0,0);
            } catch(e) { 
                alert("Error loading background. Make sure assets/ images are correct."); 
                console.error(e);
            }
            document.getElementById('loading-overlay').classList.add('hidden');
        });
    }

    async function drawCertificate(text, isPreview) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                ctx.clearRect(0,0,3000,2000);
                ctx.drawImage(img, 0, 0, 3000, 2000);
                
                ctx.textAlign = 'center';
                ctx.fillStyle = theme.fontColor;
                ctx.font = 'bold 110px serif';
                ctx.fillText(theme.certificateTitle, 1500, 480);
                
                ctx.fillStyle = (selectedSceneId === 'lovescribe') ? '#2B1B17' : '#ffffff';
                ctx.font = '65px sans-serif';
                wrapText(ctx, text, 1500, 850, 2200, 100);

                const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                ctx.fillStyle = theme.fontColor; ctx.font = '40px sans-serif';
                ctx.fillText(`Sealed on ${date}`, 1500, 1720);

                if (isPreview) {
                    ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = '#FF0000'; ctx.font = 'bold 300px sans-serif';
                    ctx.translate(1500, 1000); ctx.rotate(-Math.PI / 6); ctx.fillText('SAMPLE', 0, 0); ctx.restore();
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

    // 验证与下载
    const verifyBtn = document.getElementById('verify-license-button');
    if(verifyBtn) {
        verifyBtn.addEventListener('click', async () => {
            if(document.getElementById('license-key-input').value.length > 5) {
                await drawCertificate(legacyText.value, false);
                document.getElementById('license-section').classList.add('hidden');
                document.getElementById('unlock-section').classList.remove('hidden');
                alert("✨ SUCCESS! UNLOCKED ✨");
            } else { alert("Invalid Key."); }
        });
    }

    document.getElementById('download-watermarked-button').addEventListener('click', () => {
        const link = document.createElement('a'); link.download = 'Preview.png'; link.href = canvas.toDataURL(); link.click();
    });

    document.getElementById('download-full-button').addEventListener('click', () => {
        const link = document.createElement('a'); link.download = 'Eternal_Echo.png'; link.href = canvas.toDataURL('image/png', 1.0); link.click();
    });
});