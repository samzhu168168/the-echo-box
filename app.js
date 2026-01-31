/**
 * ECHO BOX ENGINE - GUMROAD 跳转修复版
 *
 * === 修复了两个根本 Bug ===
 *
 * [Bug1] applyTemplate() 末尾用了全局 `event` 变量来获取点击的按钮。
 *        Chrome 里 event 是全局的，所以偶尔能跑通。
 *        但 Safari/Firefox 里 event 是 undefined → 函数静默崩溃 →
 *        currentTargetUrl 从未被更新 → 始终跳默认值 sapjbm。
 *        修复：移除对 event 的依赖，改用 addEventListener + data 属性。
 *
 * [Bug2] Gumroad 的购物车 cookie 绑定在 *.gumroad.com 域级别，
 *        跨窗口共享。之前访问过哪个产品页面，Gumroad 就会把它记在 cookie 里，
 *        下次打开任何 gumroad.com 页面都会自动加回购物车。
 *        window.open 新窗口无法绕过这个机制。
 *        修复：跳转前用一个 confirm 弹窗提醒用户手动清理购物车。
 *        这是在不能修改 Gumroad 后台的前提下，最可靠的前端解决方案。
 */

// ============================================================
// 1. 配置
// ============================================================
const DISCOUNT_CODE = "launch";

// 三个场景 → 三个独立产品链接（一一对应）
const PRODUCT_LINKS = {
    crypto:  "https://samzhu168.gumroad.com/l/sapjbm",   // Echo Box
    bank:    "https://samzhu168.gumroad.com/l/sapjbm",   // Echo Box
    love:    "https://samzhu168.gumroad.com/l/lwjqot",   // LoveScribe
    family:  "https://samzhu168.gumroad.com/l/ntcaif"    // FutureBloom
};

const DEFAULT_TYPE = "crypto";

// ============================================================
// 2. 状态
// ============================================================
let currentType = DEFAULT_TYPE;

// ============================================================
// 3. 模板内容（保持原样）
// ============================================================
const TEMPLATES = {
    crypto: `[ASSET MAP]\n\nHardware Wallet Location: \n[e.g. In the fake book on the shelf]\n\nSeed Phrase: \n[e.g. Bank box #102]\n\nExchange: Binance\nLogin Email: \nPassword Hint: `,
    bank:   `[FINANCIAL KEY]\n\nBank: Chase\nAccount: \n\nInsurance Policy Location: \n[e.g. Blue folder]\n\nLawyer Contact: `,
    love:   `[MY VOW]\n\nTo my beloved,\n\nThis is proof that I loved you.\n\nOur Anniversary: \n\nMy promise to you forever: `
};

// ============================================================
// 4. 初始化
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    animateCounter();
    restoreData();
    bindTemplateButtons();
});

// ============================================================
// 5. 按钮绑定（修复 Bug1）
//
// 原代码：HTML 里写 onclick="applyTemplate('crypto')"，
//         函数末尾用 `event.target` 获取按钮元素来高亮。
//         event 全局变量不跨浏览器可靠 → 崩溃。
//
// 新代码：在 DOMContentLoaded 里用 addEventListener 绑定每个按钮，
//         直接把 `this`（即点击的 button 元素）传入函数。
//         HTML 里的 onclick 会被保留但不再负责核心逻辑——
//         addEventListener 会优先执行且不会因 event 崩溃。
// ============================================================
function bindTemplateButtons() {
    document.querySelectorAll('.t-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            var type = this.getAttribute('data-type');
            if (type) {
                applyTemplate(type, this);
            }
        });
    });
}

// ============================================================
// 6. 模板应用
// ============================================================
function applyTemplate(type, clickedBtn) {
    if (navigator.vibrate) navigator.vibrate(50);

    // A. 填充文本
    var contentBox = document.getElementById('input-content');
    if (contentBox) contentBox.value = TEMPLATES[type] || "";

    // B. 更新全局 type（核心状态，决定跳哪个链接）
    currentType = type;
    console.log("[EchoBox] currentType →", currentType, " URL →", PRODUCT_LINKS[currentType]);

    // C. 同步右侧预览
    syncPreview();

    // D. 高亮按钮（不依赖 event）
    document.querySelectorAll('.t-btn').forEach(function(b) {
        b.style.borderColor = '#333';
        b.style.color = '#ccc';
    });
    if (clickedBtn) {
        clickedBtn.style.borderColor = '#D4AF37';
        clickedBtn.style.color = '#D4AF37';
    }
}

// ============================================================
// 7. 构建最终 URL
// ============================================================
function buildFinalUrl() {
    var base = PRODUCT_LINKS[currentType] || PRODUCT_LINKS[DEFAULT_TYPE];
    if (DISCOUNT_CODE) {
        base = base + "/" + DISCOUNT_CODE;
    }
    return base;
}

// ============================================================
// 8. 支付跳转（修复 Bug2）
//
// Gumroad cookie 污染无法通过前端完全清除。
// 但我们可以做到：
//   1. 跳转前弹窗，明确告诉用户"只付一个产品"。
//   2. 跳转链接直接带 /launch 折扣码，让用户落到正确产品页。
//   3. 用户到达 Gumroad 后，如果看到多个产品，自己 Remove 掉多余的。
//
// 这是 Gumroad 平台的固有限制，无法从第三方前端侧根本性解决。
// 长期修复方案：合并为一个 Gumroad 产品（见 README）。
// ============================================================
function handlePaymentClick() {
    var content = document.getElementById('input-content').value;
    if (!content) {
        alert("Please write something first.");
        return;
    }

    // 保存草稿
    localStorage.setItem('echo_to', document.getElementById('input-to').value);
    localStorage.setItem('echo_content', content);

    // 构建 URL
    var finalUrl = buildFinalUrl();
    console.log("[EchoBox] Opening →", finalUrl);

    // 弹窗提醒（解决 Gumroad 购物车污染的用户侧方案）
    var msg =
        "💳 You will now be directed to Gumroad.\n\n" +
        "⚠️ IMPORTANT: You should see exactly ONE product " +
        "priced at $19.99 after discount.\n\n" +
        "If you see other products in the cart, " +
        "please click 'Remove' on them before paying.\n\n" +
        "Continue to payment?";

    if (!confirm(msg)) return;

    // 打开新窗口跳转
    window.open(finalUrl, '_blank');

    // 切换到 License Key 输入页
    document.getElementById('step-create').classList.add('hidden');
    document.getElementById('step-unlock').classList.remove('hidden');
    window.scrollTo(0, 0);
}

// ============================================================
// 9. 其余功能（保持原样）
// ============================================================
function syncPreview() {
    var to      = document.getElementById('input-to').value;
    var content = document.getElementById('input-content').value;
    var pTo     = document.getElementById('preview-to');
    var pContent= document.getElementById('preview-content');
    if (pTo)      pTo.innerText      = to || "Recipient Name";
    if (pContent) pContent.innerText = content || "Start typing...";
}

function verifyAndDownload() {
    var key = document.getElementById('license-key').value.trim();
    if (key.length < 3) { alert("Invalid Key"); return; }
    var qr = document.getElementById('preview-qr');
    if (qr) {
        qr.innerHTML = "";
        new QRCode(qr, { text: "https://www.my-echo-box.com", width: 50, height: 50 });
    }
    setTimeout(function() { window.print(); }, 500);
}

function toggleUnlock() {
    document.getElementById('step-create').classList.toggle('hidden');
    document.getElementById('step-unlock').classList.toggle('hidden');
}

function animateCounter() {
    var count = 12842;
    var el = document.getElementById('global-counter');
    if (el) {
        setInterval(function() {
            if (Math.random() > 0.7) el.innerText = (++count).toLocaleString();
        }, 3000);
    }
}

function restoreData() {
    var savedContent = localStorage.getItem('echo_content');
    var savedTo      = localStorage.getItem('echo_to');
    if (savedContent) {
        var el = document.getElementById('input-content');
        if (el) el.value = savedContent;
    }
    if (savedTo) {
        var el2 = document.getElementById('input-to');
        if (el2) el2.value = savedTo;
    }
    syncPreview();
}
