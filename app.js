document.addEventListener('DOMContentLoaded', () => {
    // 场景配置
    const SCENES = {
        futurebloom: {
            cssClass: 'theme-futurebloom',
            title: 'FutureBloom',
            subtitle: "A letter to your child's 18th birthday.",
            placeholder: "What courage do you want them to find in your words?",
            gumroadLink: 'https://samzhu168.gumroad.com/l/lwjqot',
            certificateTitle: 'LETTER TO THE FUTURE',
            templateImage: 'assets/bg-cyber.jpg',
            fontColor: '#00FFFF',
            templates: { advice: "To my child...", memory: "My favorite memory...", wish: "My deepest wish..." }
        },
        lovescribe: {
            cssClass: 'theme-lovescribe',
            title: 'LoveScribe',
            subtitle: "Seal your love for the future.",
            placeholder: "What memory of us would you save?",
            gumroadLink: 'https://samzhu168.gumroad.com/l/sapjbm',
            certificateTitle: 'ETERNAL VOWS',
            templateImage: 'assets/bg-vintage.jpg',
            fontColor: '#2B1B17',
            templates: { advice: "My love...", memory: "The moment...", wish: "I promise..." }
        },
        echobox: {
            cssClass: 'theme-echobox',
            title: 'The Echo Box',
            subtitle: "Leave an echo, not just a memory.",
            placeholder: "What truth do you fear might die with you?",
            gumroadLink: 'https://samzhu168.gumroad.com/l/ntcaif',
            certificateTitle: 'CERTIFICATE OF LEGACY',
            templateImage: 'assets/bg-gold.jpg',
            fontColor: '#D4AF37',
            templates: { advice: "My final wisdom...", memory: "The truth...", wish: "Before I go..." }
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
    if (!canvas) {
        alert("ERROR: Canvas element not found! Check your HTML IDs.");
        return;
    }
    const ctx = canvas.getContext('2d');

    // 模板点击
    document.querySelectorAll('.template-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            legacyText.value = theme.templates[btn.dataset.template];
            charCountEl.textContent = legacyText.value.length;
        });
    });

    // 点击生成
    document.getElementById('imprint-button').addEventListener('click', async () => {
        const text = legacyText.value.trim();
        if (!text) return alert("Please enter some text.");
        
        const overlay = document.getElementById('loading-overlay');
        overlay.classList.remove('hidden');
        
        try {
            console.log("Starting generation...");
            await drawCertificate(text, true); // 预览版
            document.getElementById('input-section').classList.add('hidden');
            document.getElementById('result-section').classList.remove('hidden');
            window.scrollTo(0, 0);
        } catch (err) {
            console.error(err);
            alert("Oops! Background image failed to load. Make sure " + theme.templateImage + " exists in assets folder.");
        } finally {
            overlay.classList.add('hidden');
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
                ctx.font = 'bold 100px serif'; // 使用基础字体确保不崩溃
                ctx.fillText(theme.certificateTitle, 1500, 450);

                ctx.fillStyle = (selectedSceneId === 'lovescribe') ? '#2B1B17' : '#ffffff';
                ctx.font = '55px sans-serif'; // 使用基础字体
                wrapText(ctx, text, 1500, 800, 2200, 90);

                const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                ctx.fillStyle = theme.fontColor;
                ctx.font = '40px sans-serif';
                ctx.fillText(`Sealed on ${date}`, 1500, 1650);

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
            img.onerror = () => reject(new Error("Image Load Failed"));
            img.src = theme.templateImage;
        });
    }

    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        const words = text.split(''); // 修改这里：中文需要按字符拆分，而不是空格
        let line = '';
        for (let n = 0; n < words.length; n++) {
            let testLine = line + words[n];
            if (context.measureText(testLine).width > maxWidth) {
                context.fillText(line, x, y);
                line = words[n];
                y += lineHeight;
            } else { line = testLine; }
        }
        context.fillText(line, x, y);
    }

    // 下载预览
    document.getElementById('download-watermarked-button').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'Preview.png';
        link.href = canvas.toDataURL();
        link.click();
    });

    // 验证逻辑
    document.getElementById('verify-license-button').addEventListener('click', async () => {
        const key = document.getElementById('license-key-input').value.trim();
        if (key.length > 5) {
            await drawCertificate(legacyText.value, false);
            document.getElementById('license-section').classList.add('hidden');
            document.getElementById('unlock-section').classList.remove('hidden');
        } else {
            alert("Invalid Key.");
        }
    });

    // 下载高清版
    document.getElementById('download-full-button').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'Premium_Certificate.png';
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
    });
});