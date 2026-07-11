const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const debugPort = Number(process.env.QA_CHROME_PORT || 9237);
const baseUrl = process.argv[2] || 'http://127.0.0.1:4173';
const profilePath = path.resolve(__dirname, '..', '.codex_deps', `echo-box-layout-qa-${process.pid}`);
let chromeStderr = '';

const targets = [
    { name: 'home-iphone-13', path: '/', width: 390, height: 844, mobile: true },
    { name: 'home-iphone-se', path: '/', width: 375, height: 667, mobile: true },
    { name: 'product-iphone-13', path: '/30-day-no-contact-reset-kit.html', width: 390, height: 844, mobile: true },
    { name: 'product-iphone-se', path: '/30-day-no-contact-reset-kit.html', width: 375, height: 667, mobile: true },
    { name: 'about-android', path: '/about.html', width: 390, height: 844, mobile: true },
    { name: 'contact-android', path: '/contact.html', width: 390, height: 844, mobile: true },
    { name: 'home-desktop', path: '/', width: 1440, height: 900, mobile: false },
    { name: 'product-desktop', path: '/30-day-no-contact-reset-kit.html', width: 1440, height: 900, mobile: false }
];

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForDebugger() {
    for (let attempt = 0; attempt < 40; attempt += 1) {
        try {
            const response = await fetch(`http://127.0.0.1:${debugPort}/json/version`);
            if (response.ok) return;
        } catch {}
        await delay(250);
    }
    throw new Error(`Chrome DevTools endpoint did not become ready. ${chromeStderr.slice(-1200)}`);
}

async function createClient() {
    const response = await fetch(`http://127.0.0.1:${debugPort}/json/new?about:blank`, { method: 'PUT' });
    const target = await response.json();
    const socket = new WebSocket(target.webSocketDebuggerUrl);
    const pending = new Map();
    let nextId = 1;

    await new Promise((resolve, reject) => {
        socket.addEventListener('open', resolve, { once: true });
        socket.addEventListener('error', reject, { once: true });
    });

    socket.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
        if (!message.id || !pending.has(message.id)) return;
        const { resolve, reject } = pending.get(message.id);
        pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message));
        else resolve(message.result);
    });

    function send(method, params = {}) {
        const id = nextId;
        nextId += 1;
        socket.send(JSON.stringify({ id, method, params }));
        return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
    }

    return { socket, send };
}

async function measure(client, target) {
    await client.send('Emulation.setDeviceMetricsOverride', {
        width: target.width,
        height: target.height,
        deviceScaleFactor: 1,
        mobile: target.mobile
    });
    await client.send('Page.navigate', { url: new URL(target.path, baseUrl).href });
    await delay(1200);

    const expression = `(() => {
        const viewportWidth = document.documentElement.clientWidth;
        const overflowing = Array.from(document.querySelectorAll('body *'))
            .map((element) => {
                const rect = element.getBoundingClientRect();
                return {
                    tag: element.tagName.toLowerCase(),
                    className: typeof element.className === 'string' ? element.className : '',
                    text: (element.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 80),
                    left: Math.round(rect.left),
                    right: Math.round(rect.right),
                    width: Math.round(rect.width)
                };
            })
            .filter((item) => item.width > 0 && (item.left < -1 || item.right > viewportWidth + 1))
            .slice(0, 20);
        return {
            innerWidth: window.innerWidth,
            clientWidth: viewportWidth,
            scrollWidth: document.documentElement.scrollWidth,
            bodyScrollWidth: document.body.scrollWidth,
            overflowing
        };
    })()`;

    const result = await client.send('Runtime.evaluate', { expression, returnByValue: true });
    return { ...target, ...result.result.value };
}

async function main() {
    fs.mkdirSync(profilePath, { recursive: true });
    const chrome = spawn(chromePath, [
        '--headless=new',
        '--disable-gpu',
        '--disable-extensions',
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--no-first-run',
        '--force-device-scale-factor=1',
        `--remote-debugging-port=${debugPort}`,
        `--user-data-dir=${profilePath}`,
        'about:blank'
    ], { stdio: ['ignore', 'ignore', 'pipe'] });

    chrome.stderr.on('data', (chunk) => {
        chromeStderr += chunk.toString();
    });

    try {
        await waitForDebugger();
        const client = await createClient();
        const results = [];
        for (const target of targets) results.push(await measure(client, target));
        console.log(JSON.stringify(results, null, 2));
        await client.send('Browser.close');
        client.socket.close();
    } finally {
        if (!chrome.killed) chrome.kill();
    }
}

main().catch((error) => {
    console.error(error.stack || error.message);
    process.exitCode = 1;
});
