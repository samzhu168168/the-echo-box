const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..', 'dist');
const canary = 'ECHOBOX_CANARY_PRIVATE_92741';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.ico': 'image/x-icon' };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const target = path.join(root, pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, ''));
  if (!target.startsWith(root) || !fs.existsSync(target) || fs.statSync(target).isDirectory()) { res.writeHead(404); return res.end('Not found'); }
  res.writeHead(200, { 'Content-Type': mime[path.extname(target)] || 'application/octet-stream' });
  fs.createReadStream(target).pipe(res);
});

(async () => {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
  const results = [];
  try {
    for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      const network = [];
      page.on('request', (request) => network.push(`${request.url()} ${request.postData() || ''}`));
      await page.goto(`http://127.0.0.1:${port}/tools/no-contact-day-counter.html`, { waitUntil: 'networkidle' });
      const overflow1 = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      await page.fill('#tool-last-contact', '2026-10-01T12:00');
      await page.click('button[type="submit"]');
      await page.check('input[value="online_checking"]');
      const analytics1 = await page.evaluate(() => localStorage.getItem('echoBoxAnalyticsEvents.v1') || '');
      const url1 = page.url();
      results.push({ viewport: viewport.width, page: 1, overflow: overflow1, analytics: analytics1, url: url1 });
      await context.close();
    }

    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    const network = [];
    page.on('request', (request) => network.push(`${request.url()} ${request.postData() || ''}`));
    await page.goto(`http://127.0.0.1:${port}/tools/mixed-signals-from-ex-response-checker.html`, { waitUntil: 'networkidle' });
    await page.check('input[name="safety"][value="no"]');
    await page.check('input[name="pattern_window"][value="REPEATED_GE_2_WEEKS"]');
    await page.check('input[name="pattern"][value="WARM_THEN_ABSENT"]');
    await page.check('input[name="goal"][value="SEE_IF_ACTION_BECOMES_CONSISTENT"]');
    await page.click('button[type="submit"]');
    await page.evaluate((privateCanary) => {
      window.echoAnalytics.trackEvent('tool_complete', {
        tool_id: 'mixed_signals_checker',
        result_type: 'WAIT_FOR_CONSISTENCY',
        message: privateCanary,
        name: privateCanary,
        email: privateCanary,
        phone: privateCanary
      });
    }, canary);
    const result = await page.locator('#checker-result').getAttribute('data-result');
    const overflow2 = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    const storage = await page.evaluate(() => JSON.stringify({
      local: Object.fromEntries(Object.keys(localStorage).map((key) => [key, localStorage.getItem(key)])),
      session: Object.fromEntries(Object.keys(sessionStorage).map((key) => [key, sessionStorage.getItem(key)]))
    }));
    const dom = await page.locator('body').innerText();
    const url2 = page.url();
    const combined = [storage, dom, url2, ...network].join('\n');
    if (combined.includes(canary)) throw new Error('privacy canary leaked');
    if (storage.includes('WARM_THEN_ABSENT') || storage.includes('SEE_IF_ACTION_BECOMES_CONSISTENT')) throw new Error('checker answers persisted');
    if (result !== 'WAIT_FOR_CONSISTENCY') throw new Error(`unexpected result ${result}`);
    if (overflow2 || results.some((item) => item.overflow)) throw new Error('horizontal overflow');
    if (results.some((item) => /2026-10-01T12:00|online_checking/.test(item.analytics + item.url))) throw new Error('counter private value leaked');

    await page.reload({ waitUntil: 'networkidle' });
    const checkedAfterReload = await page.locator('input:checked').count();
    if (checkedAfterReload !== 0) throw new Error('checker answers survived refresh');

    const regressionContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const home = await regressionContext.newPage();
    await home.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
    if (!(await home.locator('#hero-headline').innerText()).includes('About to text your ex?')) throw new Error('homepage hero regression');
    await home.fill('#last-contact', '2026-10-01T12:00');
    await home.click('#save-counter-button');
    if (!(await home.locator('#counter-result').innerText()).includes('days')) throw new Error('homepage counter regression');
    await home.fill('#unsent-message', 'TEST MESSAGE ONLY');
    await home.click('#put-in-box-button');
    const resetEvents = await home.evaluate(() => JSON.parse(localStorage.getItem('echoBoxAnalyticsEvents.v1') || '[]').map((event) => event.eventName));
    if (!resetEvents.includes('reset_started')) throw new Error('free reset regression');
    await home.evaluate(() => {
      const state = JSON.parse(localStorage.getItem('echoBoxBreakupData.v1') || '{}');
      state.resetEndsAt = Date.now() - 1000;
      localStorage.setItem('echoBoxBreakupData.v1', JSON.stringify(state));
    });
    await home.reload({ waitUntil: 'networkidle' });
    if (!(await home.locator('#post-reset-offer').innerText()).includes("You didn't send it.")) throw new Error('reset completion regression');
    await home.click('#generate-reset-card');
    if (await home.locator('#download-reset-card').isDisabled()) throw new Error('reset card regression');
    await home.selectOption('#necessary-reason', 'work');
    if (!(await home.locator('#necessary-guidance').innerText()).includes('task')) throw new Error('necessary contact regression');
    if ((await home.locator('#paid-kit-price').innerText()).trim() !== '$9.99') throw new Error('price regression');
    const homeOverflow = await home.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    if (homeOverflow) throw new Error('homepage mobile overflow');
    const analyticsDump = await home.evaluate(() => localStorage.getItem('echoBoxAnalyticsEvents.v1') || '');
    if (analyticsDump.includes('TEST MESSAGE ONLY')) throw new Error('private draft leaked into analytics');
    await regressionContext.close();

    console.log(JSON.stringify({ status: 'PASS', mobileOverflow: false, desktopOverflow: false, privacyCanary: 'PASS', checkerRefresh: 'PASS', result, homepageRegression: 'PASS' }));
    await context.close();
  } finally {
    await browser.close();
    server.close();
  }
})().catch((error) => { console.error(error); process.exit(1); });
