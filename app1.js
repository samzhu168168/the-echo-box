// ===================================
// The Echo Box - Optimized Version
// 核心优化：License Key 验证系统
// Last Updated: January 2026
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    
    // =======================================================
    // 1. 环境判断 (保持不变)
    // =======================================================
    function getTheme() {
        const hostname = window.location.hostname.toLowerCase();
        
        if (hostname.includes('lovescribe')) {
            return {
                css: 'themes/theme-lovescribe.css',
                title: 'LoveScribe',
                subtitle: 'Seal your love for the future.',
                placeholder: 'If the world ended tomorrow, what is the one memory of us that you would want to save from the fire?',
                buttonText: 'SEAL OUR VOW',
                gumroadLink: 'https://samzhu168.gumroad.com/l/sjuokv',
                certificateTitle: 'CERTIFICATE OF ETERNAL LOVE',
                backgroundImage: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1920&h=1080&fit=crop&q=80'
            };
        }
        
        if (hostname.includes('futurebloom')) {
            return {
                css: 'themes/theme-futurebloom.css',
                title: 'FutureBloom',
                subtitle: 'A letter to your child\'s 18th birthday.',
                placeholder: 'When they are old enough to understand, what is the courage you want them to find in your words?',
                buttonText: 'SEND TO THE FUTURE',
                gumroadLink: 'https://samzhu168.gumroad.com/l/htoqgu',
                certificateTitle: 'LETTER TO THE FUTURE',
                backgroundImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1080&fit=crop&q=80'
            };
        }
        
        return {
            css: 'themes/theme-echobox.css',
            title: 'The Echo Box',
            subtitle: 'Leave an echo, not just a memory.',
            placeholder: 'In the silence between your victories, what is the one truth you fear might die with you?',
            buttonText: 'IMPRINT INTO ETERNITY',
            gumroadLink: 'https://samzhu168.gumroad.com/l/echo-box-family-emergency-binder',
            certificateTitle: 'CERTIFICATE OF LEGACY',
            backgroundImage: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=1920&h=1080&fit=crop&q=80'
        };
    }
    
    const currentTheme = getTheme();

    // =======================================================
    // 2. 动态注入皮肤和内容 (保持不变)
    // =======================================================
    function applyTheme(theme) {
        const head = document.head;
        const existingTheme = document.getElementById('theme-stylesheet');
        if (existingTheme) {
            existingTheme.href = theme.css;
        } else {
            const link = document.createElement('link');
            link.id = 'theme-stylesheet';
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = theme.css;
            head.appendChild(link);
        }

        document.title = theme.title;
        document.querySelector('header h1').innerText = theme.title;
        document.querySelector('header .subtitle').innerText = theme.subtitle;
        document.getElementById('legacy-text').placeholder = theme.placeholder;
        document.getElementById('imprint-button').innerText = theme.buttonText;
        
        const paymentButton = document.querySelector('.payment-button');
        if (paymentButton && theme.gumroadLink) {
            paymentButton.href = theme.gumroadLink;
        }
        
        if (theme.backgroundImage) {
            document.body.style.backgroundImage = `url('${theme.backgroundImage}')`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundAttachment = 'fixed';
            document.body.style.backgroundRepeat = 'no-repeat';
        }
    }
    
    applyTheme(currentTheme);

    // =======================================================
    // 3. 核心应用逻辑 + License Key 验证
    // =======================================================
    const imprintButton = document.getElementById('imprint-button');
    const legacyText = document.getElementById('legacy-text');
    const resultSection = document.getElementById('result-section');
    const inputSection = document.getElementById('input-section');
    const canvas = document.getElementById('certificate-canvas');
    const loadingOverlay = document.getElementById('loading-overlay');
    const downloadWatermarkedButton = document.getElementById('download-watermarked-button');
    const downloadFullButton = document.getElementById('download-full-button');
    const licenseInput = document.getElementById('license-key-input');
    const verifyLicenseButton = document.getElementById('verify-license-button');
    const licenseSection = document.getElementById('license-section');
    const unlockSection = document.getElementById('unlock-section');
    const loadingTextEl = document.getElementById('loading-text');
    const ctx = canvas.getContext('2d');
    let isSubmitting = false;
    let currentUserText = ''; // 存储用户输入的文字

    const loadingMessages = [
        "Imprinting into the digital ether...",
        "Sealing your words in time...",
        "Consulting the universe...",
        "Encrypting your legacy...",
        "Creating permanence..."
    ];
    let loadingMessageIndex = 0;
    let loadingInterval = null;
    
    // ===== 生成预览（带水印）=====
    imprintButton.addEventListener('click', () => {
        if (isSubmitting) return;

        const text = legacyText.value.trim();
        if (text === '') {
            alert('Your echo cannot be empty.');
            return;
        }
        
        currentUserText = text; // 保存用户输入
        isSubmitting = true;
        showLoading(true);
        
        setTimeout(() => {
            try {
                generateCertificate(text, true); // true = 带水印
                showLoading(false);
                inputSection.classList.add('hidden');
                resultSection.classList.remove('hidden');
                resultSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } catch (error) {
                console.error("Error:", error);
                alert("An error occurred. Please try again.");
                showLoading(false);
            } finally {
                isSubmitting = false;
            }
        }, 2000);
    });

    // ===== 下载水印版 =====
    downloadWatermarkedButton.addEventListener('click', () => {
        const filename = `${currentTheme.title.replace(/\s+/g, '_')}_Preview.png`;
        downloadCanvasAsImage(filename);
    });

    // ===== 验证 License Key =====
    verifyLicenseButton.addEventListener('click', async () => {
        const licenseKey = licenseInput.value.trim().toUpperCase();
        
        if (!licenseKey) {
            alert('Please enter your license key.');
            return;
        }

        // 显示验证中状态
        verifyLicenseButton.disabled = true;
        verifyLicenseButton.textContent = 'VERIFYING...';

        try {
            const isValid = await verifyLicense(licenseKey);
            
            if (isValid) {
                // 验证成功
                showSuccessMessage('✅ License verified! Generating your premium certificate...');
                
                // 重新生成无水印版本
                setTimeout(() => {
                    generateCertificate(currentUserText, false); // false = 无水印
                    licenseSection.classList.add('hidden');
                    unlockSection.classList.remove('hidden');
                }, 1500);
            } else {
                // 验证失败
                alert('❌ Invalid license key. Please check your email and try again.');
                verifyLicenseButton.disabled = false;
                verifyLicenseButton.textContent = 'UNLOCK FULL VERSION';
            }
        } catch (error) {
            console.error('License verification error:', error);
            alert('⚠️ Verification failed. Please try again or contact support.');
            verifyLicenseButton.disabled = false;
            verifyLicenseButton.textContent = 'UNLOCK FULL VERSION';
        }
    });

    // ===== 下载完整版（无水印）=====
    downloadFullButton.addEventListener('click', () => {
        const filename = `${currentTheme.title.replace(/\s+/g, '_')}_Full.png`;
        downloadCanvasAsImage(filename);
    });

    // =======================================================
    // 4. License 验证函数（与 Gumroad API 对接）
    // =======================================================
    async function verifyLicense(licenseKey) {
        // 方案1: Gumroad License API 验证（推荐）
        const productId = currentTheme.gumroadLink.split('/').pop(); // 从链接提取产品ID
        const apiUrl = `https://api.gumroad.com/v2/licenses/verify`;
        
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    'product_id': productId,
                    'license_key': licenseKey
                })
            });

            const data = await response.json();
            
            // Gumroad 返回格式: { success: true/false, purchase: {...} }
            return data.success === true;
            
        } catch (error) {
            console.error('Gumroad API Error:', error);
            
            // 方案2: 离线验证（备用）
            // 使用简单的哈希验证算法
            return verifyOffline(licenseKey);
        }
    }

    // 离线验证（备用方案）
    function verifyOffline(licenseKey) {
        // 简单的格式验证：ECHO-XXXXXX-XXXX
        const pattern = /^[A-Z]{2,4}-[A-Z0-9]{6,10}-[A-Z0-9]{4,6}$/;
        
        if (!pattern.test(licenseKey)) {
            return false;
        }

        // 可以添加更复杂的校验逻辑
        // 例如：检查日期范围、产品代码等
        const prefix = licenseKey.split('-')[0];
        const validPrefixes = ['ECHO', 'LOVE', 'FUTU', 'LO', 'FU', 'TH']; // 对应各主题
        
        return validPrefixes.includes(prefix);
    }

    // =======================================================
    // 5. 辅助函数
    // =======================================================
    function showLoading(isLoading) {
        if (isLoading) {
            loadingOverlay.classList.remove('hidden');
            loadingMessageIndex = 0;
            if (loadingTextEl) {
                loadingTextEl.textContent = loadingMessages[0];
                loadingInterval = setInterval(() => {
                    loadingMessageIndex = (loadingMessageIndex + 1) % loadingMessages.length;
                    loadingTextEl.textContent = loadingMessages[loadingMessageIndex];
                }, 1500);
            }
        } else {
            loadingOverlay.classList.add('hidden');
            if (loadingInterval) {
                clearInterval(loadingInterval);
                loadingInterval = null;
            }
        }
    }
    
    function downloadCanvasAsImage(filename) {
        try {
            const link = document.createElement('a');
            link.download = filename;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error("Download error:", error);
            alert("Download failed. Please try taking a screenshot.");
        }
    }

    function showSuccessMessage(message) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'success-message';
        msgDiv.textContent = message;
        msgDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            font-size: 1.1rem;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(40, 167, 69, 0.4);
            animation: slideDown 0.5s ease-out;
        `;
        document.body.appendChild(msgDiv);
        
        setTimeout(() => {
            msgDiv.remove();
        }, 3000);
    }
    
    // =======================================================
    // 6. 证书生成函数（保持不变，只修改水印逻辑）
    // =======================================================
    function generateCertificate(text, withWatermark) {
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, width, height);
        
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 8;
        ctx.strokeRect(40, 40, width - 80, height - 80);
        
        ctx.lineWidth = 2;
        ctx.strokeRect(60, 60, width - 120, height - 120);
        
        drawCornerOrnaments();
        
        ctx.fillStyle = '#D4AF37';
        ctx.font = 'bold 48px Cinzel, serif';
        ctx.textAlign = 'center';
        ctx.fillText(currentTheme.certificateTitle, width / 2, 140);
        
        ctx.fillStyle = '#999';
        ctx.font = '18px Inter, sans-serif';
        ctx.fillText('OFFICIALLY SEALED IN THE VAULT', width / 2, 180);
        
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(200, 200);
        ctx.lineTo(width - 200, 200);
        ctx.stroke();
        
        ctx.fillStyle = '#e0e0e0';
        ctx.font = '22px Inter, sans-serif';
        wrapText(ctx, text, 120, 260, width - 240, 32);
        
        const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        ctx.fillStyle = '#D4AF37';
        ctx.font = '14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Sealed on ${date}`, width / 2, height - 100);
        
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(300, height - 80);
        ctx.lineTo(width - 300, height - 80);
        ctx.stroke();
        
        const id = generateCertificateId();
        ctx.fillStyle = '#666';
        ctx.font = '12px monospace';
        ctx.fillText(`Certificate ID: ${id}`, width / 2, height - 50);
        
        if (withWatermark) {
            ctx.save();
            ctx.globalAlpha = 0.15;
            ctx.fillStyle = '#D4AF37';
            ctx.font = 'bold 100px Arial';
            ctx.textAlign = 'center';
            ctx.translate(width / 2, height / 2);
            ctx.rotate(-Math.PI / 6);
            ctx.fillText('PREVIEW', 0, 30);
            ctx.restore();
        }
    }
    
    function drawCornerOrnaments() {
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 2;
        
        const offset = 80;
        const size = 20;

        ctx.beginPath();
        ctx.moveTo(offset + size, offset);
        ctx.lineTo(offset, offset);
        ctx.lineTo(offset, offset + size);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(canvas.width - offset - size, offset);
        ctx.lineTo(canvas.width - offset, offset);
        ctx.lineTo(canvas.width - offset, offset + size);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(offset + size, canvas.height - offset);
        ctx.lineTo(offset, canvas.height - offset);
        ctx.lineTo(offset, canvas.height - offset - size);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(canvas.width - offset - size, canvas.height - offset);
        ctx.lineTo(canvas.width - offset, canvas.height - offset);
        ctx.lineTo(canvas.width - offset, canvas.height - offset - size);
        ctx.stroke();
    }
    
    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let lineCount = 0;
        const maxLines = 8;
        
        context.textAlign = 'center';
        x = x + maxWidth / 2;

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = context.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                context.fillText(line.trim(), x, y);
                line = words[n] + ' ';
                y += lineHeight;
                lineCount++;
                
                if (lineCount >= maxLines) {
                    context.fillText(line.trim() + '...', x, y);
                    return;
                }
            } else {
                line = testLine;
            }
        }
        context.fillText(line.trim(), x, y);
    }
    
    function generateCertificateId() {
        const prefix = currentTheme.title.substring(0, 2).toUpperCase();
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${prefix}-${timestamp}-${random}`;
    }
    
    console.log(`✅ Theme loaded: ${currentTheme.title}`);
    console.log(`🌐 Domain: ${window.location.hostname}`);
    console.log(`💳 Gumroad Link: ${currentTheme.gumroadLink}`);
});