const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const gumroadUrl = 'https://samzhu168.gumroad.com/l/echo-box-30-day-no-contact-reset-kit';
const providerPages = [
  '30-day-no-contact-reset-kit.html',
  'guides/should-i-send-my-ex-something-funny.html',
  'guides/should-i-unblock-my-ex.html',
  'guides/want-to-call-my-ex.html',
  'guides/when-contact-with-an-ex-is-necessary.html'
];
const sentinel = 'P0_PRIVATE_SENTINEL_DO_NOT_SEND_20261026';
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const count = (text, token) => text.split(token).length - 1;

for (const relative of providerPages) {
  const html = fs.readFileSync(path.join(root, relative), 'utf8');
  expect(count(html, 'plausible.io/js/script.js') === 1, `${relative}: expected exactly one Plausible script`);
  expect(count(html, 'window.ANALYTICS_CONFIG=') === 1, `${relative}: expected exactly one analytics provider config`);
  expect(html.includes("provider:'plausible',id:'my-echo-box.com'"), `${relative}: provider/domain mismatch`);
}
const commerce = fs.readFileSync(path.join(root, 'commerce-config.js'), 'utf8');
expect(commerce.includes("price: '$14.90'"), 'price lock changed');
expect(commerce.includes(`checkoutUrl: '${gumroadUrl}'`), 'Gumroad URL changed');

const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.ico': 'image/x-icon' };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const target = path.join(dist, pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, ''));
  if (!target.startsWith(dist) || !fs.existsSync(target) || fs.statSync(target).isDirectory()) {
    res.writeHead(404); return res.end('Not found');
  }
  res.writeHead(200, { 'Content-Type': mime[path.extname(target)] || 'application/octet-stream' });
  fs.createReadStream(target).pipe(res);
});

(async () => {
  if (failures.length) throw new Error(failures.join('\n'));
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await context.route('https://plausible.io/**', (route) => route.abort());
    await context.addInitScript(() => {
      window.__plausibleCalls = [];
      window.plausible = (...args) => window.__plausibleCalls.push(args);
      window.open = (url) => { window.__qaCheckoutUrl = url; return {}; };
    });
    const page = await context.newPage();
    await page.goto(`${origin}/?utm_source=p0_qa&utm_medium=local&utm_campaign=measurement_recovery`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.echoBoxBreakupResetReady === true);

    await page.evaluate(() => { window.location.hash = '#reset'; window.dispatchEvent(new HashChangeEvent('hashchange')); });
    let events = await page.evaluate(() => JSON.parse(localStorage.getItem('echoBoxAnalyticsEvents.v1') || '[]'));
    expect(events.filter((event) => event.eventName === 'echo_start').length === 0, 'hash change emitted echo_start');

    await page.click('[data-track="free_reset_cta"]');
    events = await page.evaluate(() => JSON.parse(localStorage.getItem('echoBoxAnalyticsEvents.v1') || '[]'));
    expect(events.filter((event) => event.eventName === 'echo_start').length === 1, 'one entry click must emit exactly one echo_start');
    expect(events.filter((event) => event.eventName === 'reset_started').length === 0, 'echo_start must not imply reset_started');

    await page.fill('#unsent-message', sentinel);
    await page.click('#put-in-box-button');
    events = await page.evaluate(() => JSON.parse(localStorage.getItem('echoBoxAnalyticsEvents.v1') || '[]'));
    expect(events.filter((event) => event.eventName === 'echo_start').length === 1, 'timer activation duplicated echo_start');
    expect(events.filter((event) => event.eventName === 'reset_started').length === 1, 'timer activation must emit one reset_started');

    await page.evaluate(() => {
      const state = JSON.parse(localStorage.getItem('echoBoxBreakupData.v1') || '{}');
      state.resetEndsAt = Date.now() - 1000;
      localStorage.setItem('echoBoxBreakupData.v1', JSON.stringify(state));
    });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.echoBoxBreakupResetReady === true);
    events = await page.evaluate(() => JSON.parse(localStorage.getItem('echoBoxAnalyticsEvents.v1') || '[]'));
    expect(events.filter((event) => event.eventName === 'reset_completed').length === 1, 'completion event changed');
    await page.click('#paid-kit-button');
    const checkoutUrl = await page.evaluate(() => window.__qaCheckoutUrl || '');
    events = await page.evaluate(() => JSON.parse(localStorage.getItem('echoBoxAnalyticsEvents.v1') || '[]'));
    expect(events.filter((event) => event.eventName === 'paid_cta_clicked').length === 1, 'paid CTA event changed');
    expect(events.filter((event) => event.eventName === 'checkout_started').length === 1, 'checkout event changed');
    const checkout = new URL(checkoutUrl);
    expect(`${checkout.origin}${checkout.pathname}` === gumroadUrl, 'checkout destination changed');
    for (const [key, value] of Object.entries({ utm_source: 'p0_qa', utm_medium: 'local', utm_campaign: 'measurement_recovery' })) {
      expect(checkout.searchParams.get(key) === value, `checkout lost ${key}`);
    }

    const analyticsDump = JSON.stringify(events);
    const plausibleDump = JSON.stringify(await page.evaluate(() => window.__plausibleCalls));
    expect(!analyticsDump.includes(sentinel), 'private draft leaked into local analytics');
    expect(!plausibleDump.includes(sentinel), 'private draft leaked into provider calls');
    const echo = events.find((event) => event.eventName === 'echo_start');
    expect(Object.keys(echo?.properties || {}).every((key) => ['page_slug','cta_location','utm_source','utm_medium','utm_campaign'].includes(key)), 'echo_start contains unapproved properties');
    expect(echo?.properties?.cta_location === 'homepage_offer', 'echo_start CTA location mismatch');
    expect(events.filter((event) => ['echo_start','reset_started','reset_completed','paid_cta_clicked','checkout_started'].includes(event.eventName)).every((event) => event.properties.utm_source === 'p0_qa' && event.properties.utm_medium === 'local' && event.properties.utm_campaign === 'measurement_recovery'), 'UTM attribution continuity failed');

    for (const relative of providerPages) {
      const providerPage = await context.newPage();
      await providerPage.goto(`${origin}/${relative}`, { waitUntil: 'domcontentloaded' });
      const state = await providerPage.evaluate(() => ({ config: window.echoAnalytics?.ANALYTICS_CONFIG, calls: window.__plausibleCalls || [] }));
      expect(state.config?.enabled === true && state.config?.provider === 'plausible' && state.config?.id === 'my-echo-box.com', `${relative}: provider not enabled at runtime`);
      expect(state.calls.filter((call) => call[0] === 'landing_view').length === 1, `${relative}: landing_view should fire once`);
      await providerPage.close();
    }
    await context.close();
    if (failures.length) throw new Error(failures.join('\n'));
    console.log(JSON.stringify({ status: 'PASS', echoStart: 'one per intentional entry click', resetStartedDistinct: true, resetCompletedPreserved: true, paidEventsPreserved: true, providerPages: providerPages.length, utmContinuity: 'PASS', privacyCanary: 'PASS', priceLock: '$14.90', gumroadLock: gumroadUrl, productionReceipt: 'NOT VERIFIED' }, null, 2));
  } finally {
    await browser.close();
    server.close();
  }
})().catch((error) => { console.error(`MEASUREMENT_RECOVERY_QA FAIL\n${error.stack || error.message}`); process.exitCode = 1; });
