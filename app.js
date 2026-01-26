document.addEventListener('DOMContentLoaded', () => {
    
    // 1. 场景库 - 这里的 templateImage 需要指向你生成的 16:9 背景图
    const SCENES = {
        futurebloom: {
            cssClass: 'theme-futurebloom',
            title: 'FutureBloom',
            subtitle: "A letter to your child's 18th birthday.",
            placeholder: "What courage do you want them to find in your words?",
            gumroadLink: '你的Gumroad链接',
            certificateTitle: 'LETTER TO THE FUTURE',
            templateImage: 'assets/bg-future.jpg', // 你AI生成的图
            fontColor: '#A7C7E7',
            templates: { advice: "To my child: Always remember...", memory: "My favorite memory of us is...", wish: "My deepest wish for you..." }
        },
        lovescribe: {
            cssClass: 'theme-lovescribe',
            title: 'LoveScribe',
            subtitle: "Seal your love for the future.",
            placeholder: "What is the one memory of us you'd save from the fire?",
            gumroadLink: '你的Gumroad链接',
            certificateTitle: 'ETERNAL VOWS',
            templateImage: 'assets/bg-love.jpg', 
            fontColor: '#D9A7A0',
            templates: { advice: "My love: If tomorrow never comes...", memory: "The moment I knew I loved you...", wish: "I promise you..." }
        },
        echobox: {
            cssClass: 'theme-echobox',
            title: 'The Echo Box',
            subtitle: "Leave an echo, not just a memory.",
            placeholder: "What truth do you fear might die with you?",
            gumroadLink: '你的Gumroad链接',
            certificateTitle: 'CERTIFICATE OF LEGACY',
            templateImage: 'assets/bg-gold.jpg',
            fontColor: '#D4AF37',
            templates: { advice: "My final wisdom is this...", memory: "The truth I've learned...", wish: "Before I go, the world must know..." }
        }
    };

    const selectedSceneId = localStorage.getItem('selectedScene') || 'echobox';
    const theme = SCENES[selectedSceneId];
    document.body.className = theme.cssClass;

    // 应用 UI 内容
    document.getElementById('page-title').innerText = theme.title;
    document.getElementById('page-subtitle').innerText = theme.subtitle;
    document.getElementById('legacy-text').placeholder = theme.placeholder;
    document.getElementById('payment-link').href = theme.gumroadLink;

    const canvas = document.getElementById('certificate-canvas');
    const ctx = canvas.getContext('2d');
    const legacyText = document.getElementById('legacy-text');

    // 模板快速填充
    document.querySelectorAll('.template-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            legacyText.value = theme.templates[btn.dataset.template];
            legacyText.focus();
        });
    });

    // 生成逻辑
    document.getElementById('imprint-button').addEventListener('click', async () => {
        const text = legacyText.value.trim();
        if (!text) return alert("Write something first.");
        
        document.getElementById('loading-overlay').classList.remove('hidden');
        
        try {
            await drawCertificate(text, true); // 预览带水印
            document.getElementById('input-section').classList.add('hidden');
            document.getElementById('result-section').classList.remove('hidden');
            window.scrollTo(0, 0);
        } finally {
            document.getElementById('loading-overlay').classList.add('hidden');
        }
    });

    async function drawCertificate(text, isPreview) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = theme.templateImage;
        await new Promise(r => img.onload = r);

        ctx.drawImage(img, 0, 0, 3000, 2000);

        // 设置字体样式
        ctx.textAlign = 'center';
        ctx.fillStyle = theme.fontColor;
        ctx.font = 'bold 100px Cinzel, serif';
        ctx.fillText(theme.certificateTitle, 1500, 450);

        ctx.fillStyle = '#ffffff';
        ctx.font = '55px Inter, sans-serif';
        wrapText(ctx, text, 1500, 800, 2200, 80);

        const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        ctx.fillStyle = theme.fontColor;
        ctx.font = '40px Inter';
        ctx.fillText(`Sealed on ${date}`, 1500, 1650);

        if (isPreview) {
            ctx.save();
            ctx.globalAlpha = 0.15;
            ctx.fillStyle = '#ff0000';
            ctx.font = 'bold 300px Arial';
            ctx.translate(1500, 1000);
            ctx.rotate(-Math.PI / 6);
            ctx.fillText('PREVIEW ONLY', 0, 0);
            ctx.restore();
        }
    }

    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        for (let n = 0; n < words.length; n++) {
            let testLine = line + words[n] + ' ';
            if (context.measureText(testLine).width > maxWidth) {
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            } else { line = testLine; }
        }
        context.fillText(line, x, y);
    }

    // 下载
    document.getElementById('download-watermarked-button').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'Preview.png';
        link.href = canvas.toDataURL();
        link.click();
    });

    // 验证 License - 核心变现逻辑
    document.getElementById('verify-license-button').addEventListener('click', async () => {
        const key = document.getElementById('license-key-input').value.trim();
        if (!key) return;

        // 这里用简单的正则模拟，真正的大脑会告诉你：前期只要格式对就放行，或者手动验证
        // ECHO-XXXX-XXXX 格式
        if (key.length > 5) {
            alert("Success! Unlocking high-res...");
            await drawCertificate(legacyText.value, false);
            document.getElementById('license-section').classList.add('hidden');
            document.getElementById('unlock-section').classList.remove('hidden');
        } else {
            alert("Invalid Key.");
        }
    });

    document.getElementById('download-full-button').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'Premium_Certificate.png';
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
    });
});