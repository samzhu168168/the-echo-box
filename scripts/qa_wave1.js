const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const tools = require('../wave1-tools.js');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const page1 = read('tools/no-contact-day-counter.html');
const page2 = read('tools/mixed-signals-from-ex-response-checker.html');
const ui = read('wave1-tools-ui.js');
const analytics = read('analytics.js');
const app = read('app.js');
const index = read('index.html');

check(page1.includes('<title>No Contact Day Counter &amp; Restart Check | The Echo Box</title>'), 'Page 1 title');
check(page1.includes('<h1>No Contact Day Counter</h1>'), 'Page 1 H1');
check(page1.includes('https://www.my-echo-box.com/tools/no-contact-day-counter.html'), 'Page 1 canonical');
check(page2.includes('<title>Mixed Signals From an Ex? Response Checker | The Echo Box</title>'), 'Page 2 title');
check(page2.includes('<h1>Mixed Signals From Your Ex: Response Checker</h1>'), 'Page 2 H1');
check(page2.includes('https://www.my-echo-box.com/tools/mixed-signals-from-ex-response-checker.html'), 'Page 2 canonical');
check(!/<textarea|type=["'](?:text|email|tel|file)["']/i.test(page2), 'Page 2 has no private/free-text input');
check(index.includes('wave1-tools.js') && app.includes('EchoBoxWave1.calculateNoContactDuration'), 'Homepage uses shared counter source');

let covered = 0;
for (const pattern of tools.PATTERNS) {
  for (const goal of tools.GOALS) {
    const result = tools.evaluateMixedSignals(pattern, goal, false);
    check(tools.RESULTS.includes(result), `Missing rule: ${pattern} x ${goal}`);
    if (result) covered += 1;
  }
}
check(covered === 20, `Rule coverage ${covered}/20`);
check(tools.evaluateMixedSignals('CLEAR_AND_CONSISTENT', 'ANSWER_A_CLEAR_REQUEST', true) === 'DO_NOT_ENGAGE', 'Safety override');
check(tools.evaluateMixedSignals('UNKNOWN', 'ANSWER_A_CLEAR_REQUEST', false) === null, 'Unknown pattern must fail');
check(ui.includes("windowValue === 'ONE_CONTACT_ONLY'") && ui.includes('return;'), 'One-contact route');

for (const synonym of ['reset_start', 'paid_cta_click', 'checkout_start']) {
  const exact = new RegExp(`['\"]${synonym}['\"]`, 'g');
  check(!exact.test(analytics), `Forbidden analytics synonym in analytics.js: ${synonym}`);
  check(!exact.test(app), `Forbidden analytics synonym in app.js: ${synonym}`);
  check(!exact.test(ui), `Forbidden analytics synonym in wave1-tools-ui.js: ${synonym}`);
}

for (const event of ['tool_view', 'tool_start', 'tool_complete', 'share_action', 'reset_started', 'paid_cta_clicked', 'checkout_started']) {
  check(analytics.includes(`'${event}'`), `Missing analytics event ${event}`);
}
for (const property of ['tool_id', 'result_type', 'entry_source', 'cta_location', 'share_method', 'safety_mode', 'page_slug']) {
  check(analytics.includes(`'${property}'`), `Missing analytics property ${property}`);
}

const bannedClaims = [
  /they still love you/i, /they miss you/i, /they want you back/i, /they will come back/i,
  /they are avoidant/i, /they are narcissistic/i, /they are manipulating you/i
];
for (const claim of bannedClaims) check(!claim.test(page2 + ui), `Banned claim: ${claim}`);

for (const file of ['tools/no-contact-day-counter.html', 'tools/mixed-signals-from-ex-response-checker.html']) {
  const html = read(file);
  check(!/noindex/i.test(html), `${file} contains noindex`);
  check(html.includes('WebApplication') && html.includes('BreadcrumbList'), `${file} schema`);
}

if (failures.length) {
  console.error(`WAVE1_QA FAIL\n${failures.join('\n')}`);
  process.exit(1);
}
console.log(JSON.stringify({ status: 'PASS', ruleCoverage: `${covered}/20`, fallThrough: 0, privacyInputs: 'PASS', analyticsSynonyms: 'PASS' }));
