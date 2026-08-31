const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const debugPort = Number(process.env.QA_CHROME_PORT || 9248);
const baseUrl = process.argv[2] || 'http://127.0.0.1:4173/';
const profilePath = path.resolve(__dirname, '..', '.codex_deps', `echo-box-flow-qa-${process.pid}`);
let chromeStderr = '';
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForDebugger() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try { if ((await fetch(`http://127.0.0.1:${debugPort}/json/version`)).ok) return; } catch {}
    await delay(250);
  }
  throw new Error(`Chrome DevTools endpoint did not become ready. ${chromeStderr.slice(-1000)}`);
}

async function createClient() {
  const target = await (await fetch(`http://127.0.0.1:${debugPort}/json/new?about:blank`, { method: 'PUT' })).json();
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  const pending = new Map();
  let nextId = 1;
  await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) return;
    const handler = pending.get(message.id); pending.delete(message.id);
    if (message.error) handler.reject(new Error(message.error.message)); else handler.resolve(message.result);
  });
  const send = (method, params = {}) => {
    const id = nextId++; socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
  };
  return { socket, send };
}

async function main() {
  fs.mkdirSync(profilePath, { recursive: true });
  const chrome = spawn(chromePath, ['--headless=new','--disable-gpu','--disable-extensions','--no-sandbox','--no-first-run',`--remote-debugging-port=${debugPort}`,`--user-data-dir=${profilePath}`,'about:blank'], { stdio: ['ignore','ignore','pipe'] });
  chrome.stderr.on('data', (chunk) => { chromeStderr += chunk.toString(); });
  try {
    await waitForDebugger();
    const client = await createClient();
    await client.send('Page.navigate', { url: baseUrl });
    for (let attempt = 0; attempt < 40; attempt += 1) {
      const ready = await client.send('Runtime.evaluate', { expression: 'document.readyState === "complete" && window.echoBoxBreakupResetReady === true', returnByValue: true });
      if (ready.result.value) break;
      await delay(250);
    }
    const start = await client.send('Runtime.evaluate', { expression: `(() => {
      const input = document.getElementById('unsent-message');
      input.value = 'QA private draft';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      document.getElementById('put-in-box-button').click();
      const events = JSON.parse(localStorage.getItem('echoBoxAnalyticsEvents.v1') || '[]').map((event) => event.eventName);
      return {
        resetVisible: !document.getElementById('reset-flow').classList.contains('hidden'),
        timer: document.getElementById('timer-minutes').textContent + ':' + document.getElementById('timer-seconds').textContent,
        draftStored: (localStorage.getItem('echoBoxBreakupData.v1') || '').includes('QA private draft'),
        echoStart: events.includes('echo_start'),
        resetStart: events.includes('reset_start'),
        analyticsContainsDraft: (localStorage.getItem('echoBoxAnalyticsEvents.v1') || '').includes('QA private draft')
      };
    })()`, returnByValue: true });
    await client.send('Runtime.evaluate', { expression: 'window.__qaRealDateNow = Date.now; Date.now = () => window.__qaRealDateNow() + 600001;' });
    await delay(700);
    const finish = await client.send('Runtime.evaluate', { expression: `(() => {
      const events = JSON.parse(localStorage.getItem('echoBoxAnalyticsEvents.v1') || '[]').map((event) => event.eventName);
      return {
        timer: document.getElementById('timer-minutes').textContent + ':' + document.getElementById('timer-seconds').textContent,
        resetComplete: events.includes('reset_complete'),
        postResetOfferVisible: !document.getElementById('post-reset-offer').classList.contains('hidden')
      };
    })()`, returnByValue: true });
    const result = { ...start.result.value, ...finish.result.value };
    const pass = result.resetVisible && result.draftStored && result.echoStart && result.resetStart && !result.analyticsContainsDraft && result.resetComplete && result.postResetOfferVisible && result.timer === '00:00';
    console.log(JSON.stringify({ status: pass ? 'PASS' : 'FAIL', ...result }, null, 2));
    await client.send('Browser.close'); client.socket.close();
    if (!pass) process.exitCode = 1;
  } finally { if (!chrome.killed) chrome.kill(); }
}

main().catch((error) => { console.error(error.stack || error.message); process.exitCode = 1; });
