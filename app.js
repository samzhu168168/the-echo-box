document.addEventListener('DOMContentLoaded', () => {
    
    // =======================================================
    // 1. 环境判官 (The Environment Judge)
    // =======================================================
    const currentDomain = window.location.hostname;
    
    const themes = {
        'the-echobox.com': {
            css: 'themes/theme-echobox.css',
            title: 'The Echo Box',
            subtitle: 'Leave an echo, not just a memory.',
            placeholder: 'In the silence between your victories, what is the one truth you fear might die with you?',
            buttonText: 'IMPRINT INTO ETERNITY'
        },
        'lovescribe.net': {
            css: 'themes/theme-lovescribe.css',
            title: 'LoveScribe',
            subtitle: 'Seal your love for the future.',
            placeholder: 'If the world ended tomorrow, what is the one memory of us that you would want to save from the fire?',
            buttonText: 'SEAL OUR VOW'
        },
        'futurebloom.io': {
            css: 'themes/theme-futurebloom.css',
            title: 'FutureBloom',
            subtitle: 'A letter to your child\'s 18th birthday.',
            placeholder: 'When they are old enough to understand, what is the courage you want them to find in your words?',
            buttonText: 'SEND TO THE FUTURE'
        },
        // 本地测试用域名
        '127.0.0.1': {
            css: 'themes/theme-echobox.css',
            title: 'The Echo Box (Test)',
            subtitle: 'Leave an echo, not just a memory.',
            placeholder: 'In the silence between your victories, what is the one truth you fear might die with you?',
            buttonText: 'IMPRINT INTO ETERNITY'
        },
        'localhost': { // 新增：支持 localhost
            css: 'themes/theme-echobox.css',
            title: 'The Echo Box (Local)',
            subtitle: 'Leave an echo, not just a memory.',
            placeholder: 'In the silence between your victories, what is the one truth you fear might die with you?',
            buttonText: 'IMPRINT INTO ETERNITY'
        }
    };
    
    // 默认主题，防止直接用 Vercel 域名访问
    const defaultTheme = themes['the-echobox.com'];
    const currentTheme = themes[currentDomain] || defaultTheme;

    // =======================================================
    // 2. 动态注入皮肤和内容 (Dynamic Injection)
    // =======================================================
    function applyTheme(theme) {
        // 1. 动态加载CSS
        const head = document.head;
        const link = document.createElement('link');
        link.id = 'theme-stylesheet';
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = theme.css;
        head.appendChild(link);

        // 2. 动态修改HTML内容
        document.title = theme.title;
        document.querySelector('header h1').innerText = theme.title;
        document.querySelector('header .subtitle').innerText = theme.subtitle;
        document.getElementById('legacy-text').placeholder = theme.placeholder;
        document.getElementById('imprint-button').innerText = theme.buttonText;
    }
    
    applyTheme(currentTheme);

    // =======================================================
    // 3. 核心应用逻辑 (Your Core App Logic)
    // =======================================================
    const imprintButton = document.getElementById('imprint-button');
    const legacyText = document.getElementById('legacy-text');
    const resultSection = document.getElementById('result-section');
    const inputSection = document.getElementById('input-section');
    const canvas = document.getElementById('certificate-canvas');
    const loadingOverlay = document.getElementById('loading-overlay');
    const downloadWatermarkedButton = document.getElementById('download-watermarked-button');
    const ctx = canvas.getContext('2d');
    
    imprintButton.addEventListener('click', () => {
        const text = legacyText.value;
        if (text.trim() === '') {
            alert('Your echo cannot be empty.');
            return;
        }
        showLoading(true);
        setTimeout(() => {
            generateCertificate(text, true);
            showLoading(false);
            inputSection.classList.add('hidden');
            resultSection.classList.remove('hidden');
        }, 3000);
    });

    downloadWatermarkedButton.addEventListener('click', () => {
        downloadCanvasAsImage('The_Echo_Box_Preview.png');
    });

    function showLoading(isLoading) {
        if (isLoading) {
            loadingOverlay.classList.remove('hidden');
        } else {
            loadingOverlay.classList.add('hidden');
        }
    }
    
    function downloadCanvasAsImage(filename) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
    
    // =======================================================
    // 4. 证书生成函数 (完整实现)
    // =======================================================
    function generateCertificate(text, withWatermark) {
        const width = canvas.width;
        const height = canvas.height;
        
        // 1. 背景
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, width, height);
        
        // 2. 边框
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 8;
        ctx.strokeRect(40, 40, width - 80, height - 80);
        
        // 内边框
        ctx.lineWidth = 2;
        ctx.strokeRect(60, 60, width - 120, height - 120);
        
        // 3. 标题
        ctx.fillStyle = '#D4AF37';
        ctx.font = 'bold 48px Cinzel, serif';
        ctx.textAlign = 'center';
        ctx.fillText('CERTIFICATE OF LEGACY', width / 2, 140);
        
        // 4. 副标题
        ctx.fillStyle = '#999';
        ctx.font = '18px Inter, sans-serif';
        ctx.fillText('OFFICIALLY SEALED IN THE VAULT', width / 2, 180);
        
        // 5. 用户文本（带自动换行）
        ctx.fillStyle = '#e0e0e0';
        ctx.font = '22px Inter, sans-serif';
        ctx.textAlign = 'left';
        wrapText(ctx, text, 120, 260, width - 240, 32);
        
        // 6. 底部签名区
        ctx.fillStyle = '#D4AF37';
        ctx.font = '14px Inter, sans-serif';
        ctx.textAlign = 'center';
        const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        ctx.fillText(`Sealed on ${date}`, width / 2, height - 80);
        
        // 7. ID (随机生成)
        const id = 'EC-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        ctx.fillStyle = '#666';
        ctx.font = '12px monospace';
        ctx.fillText(`ID: ${id}`, width / 2, height - 50);
        
        // 8. 水印（如果是预览版）
        if (withWatermark) {
            ctx.save();
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = '#D4AF37';
            ctx.font = 'bold 60px Arial';
            ctx.textAlign = 'center';
            ctx.translate(width / 2, height / 2);
            ctx.rotate(-Math.PI / 6);
            ctx.fillText('PREVIEW', 0, 0);
            ctx.restore();
        }
    }
    
    // =======================================================
    // 5. 文本自动换行函数 (完整实现)
    // =======================================================
    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let lineCount = 0;
        const maxLines = 8; // 最多 8 行
        
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = context.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
                lineCount++;
                
                if (lineCount >= maxLines) {
                    context.fillText('...', x, y);
                    return;
                }
            } else {
                line = testLine;
            }
        }
        context.fillText(line, x, y);
    }
});