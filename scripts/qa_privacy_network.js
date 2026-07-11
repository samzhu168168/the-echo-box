const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const debugPort = Number(process.env.QA_CHROME_PORT || 9241);
const baseUrl = process.argv[2] || 'https://www.my-echo-box.com';
const sentinel = 'CODX_PRIVACY_SENTINEL_20260710_DO_NOT_SEND';
const profilePath = path.resolve(__dirname, '..', '.codex_deps', `echo-box-privacy-qa-${process.pid}`);
let chromeStderr = '';

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
    const requests = [];
    let nextId = 1;

    await new Promise((resolve, reject) => {
        socket.addEventListener('open', resolve, { once: true });
        socket.addEventListener('error', reject, { once: true });
    });

    socket.addEventListener('message', (event) => {
        const message = JSON.parse(event.data);
        if (message.method === 'Network.requestWillBeSent') {
            requests.push(message.params.request);
        }
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

    return { socket, send, requests };
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
        await client.send('Network.enable');
        await client.send('Page.enable');
        await client.send('Page.navigate', { url: baseUrl });
        let isReady = false;
        for (let attempt = 0; attempt < 40; attempt += 1) {
            const ready = await client.send('Runtime.evaluate', {
                expression: 'document.readyState === "complete" && window.echoBoxBreakupResetReady === true',
                returnByValue: true
            });
            if (ready.result.value) {
                isReady = true;
                break;
            }
            await delay(250);
        }
        if (!isReady) throw new Error('Breakup reset app did not become ready.');

        const expression = `(() => {
            const sentinel = ${JSON.stringify(sentinel)};
            const setValue = (element, value) => {
                element.value = value;
                element.dispatchEvent(new Event('input', { bubbles: true }));
                element.dispatchEvent(new Event('change', { bubbles: true }));
            };
            setValue(document.getElementById('unsent-message'), sentinel);
            document.getElementById('put-in-box-button').click();
            const reality = document.getElementById('reality-form');
            for (const field of reality.querySelectorAll('textarea')) setValue(field, sentinel);
            reality.querySelector('button[type="submit"]').click();
            document.getElementById('paid-kit-button').click();
            return {
                localOnly: localStorage.getItem('echoBoxBreakupData.v1')?.includes(sentinel) || false,
                analyticsEnabled: window.echoAnalytics?.ANALYTICS_CONFIG?.enabled || false
            };
        })()`;
        const evaluation = await client.send('Runtime.evaluate', { expression, returnByValue: true });
        if (evaluation.exceptionDetails) {
            throw new Error(evaluation.exceptionDetails.text || 'Runtime evaluation failed.');
        }
        if (!evaluation.result || !evaluation.result.value) {
            throw new Error('Runtime evaluation returned no value.');
        }
        await delay(2500);

        const leaked = client.requests.filter((request) => {
            const haystack = [
                request.url || '',
                request.postData || '',
                JSON.stringify(request.headers || {})
            ].join('\n');
            return haystack.includes(sentinel);
        });

        console.log(JSON.stringify({
            status: leaked.length ? 'FAIL' : 'PASS',
            requestCount: client.requests.length,
            leakedRequests: leaked.map((request) => request.url),
            localOnly: evaluation.result.value.localOnly,
            analyticsEnabled: evaluation.result.value.analyticsEnabled
        }, null, 2));

        await client.send('Browser.close');
        client.socket.close();
        if (leaked.length) process.exitCode = 1;
    } finally {
        if (!chrome.killed) chrome.kill();
    }
}

main().catch((error) => {
    console.error(error.stack || error.message);
    process.exitCode = 1;
});
