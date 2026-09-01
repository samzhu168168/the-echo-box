const fs = require('fs');
const path = require('path');

const root = path.resolve(process.argv[2] || 'dist');
const origin = 'https://www.my-echo-box.com';
const guideSlugs = [
  'should-i-text-my-ex',
  'my-ex-texted-me-during-no-contact',
  'i-broke-no-contact',
  'should-i-text-my-ex-happy-birthday',
  'i-miss-my-ex-at-night'
];
const failures = [];
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const count = (text, pattern) => (text.match(pattern) || []).length;

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function parseJsonLd(html, file) {
  const entries = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  expect(entries.length > 0, `${file}: missing JSON-LD`);
  return entries.map((entry) => {
    try { return JSON.parse(entry[1]); }
    catch (error) { failures.push(`${file}: invalid JSON-LD (${error.message})`); return {}; }
  });
}

const home = read('index.html');
expect(count(home, /<h1[\s>]/gi) === 1, 'homepage: expected one H1');
expect(home.includes('About to text your ex?'), 'homepage: new hero H1 missing');
expect(home.includes('Put it in the box for 10 minutes'), 'homepage: primary CTA missing');
expect(home.includes('Get through tonight.'), 'homepage: kit positioning missing');
expect(home.includes('Get the 30-Day Reset Kit — $9.99'), 'homepage: kit CTA/price missing');
expect(home.includes('<meta name="robots"') === false, 'homepage: unexpected robots override');
expect(!/<meta[^>]+noindex/i.test(home), 'homepage: noindex present');

const titles = new Set();
const descriptions = new Set();
for (const slug of guideSlugs) {
  const file = `guides/${slug}.html`;
  const html = read(file);
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1] || '';
  const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1] || '';
  expect(title.length > 0, `${file}: title missing`);
  expect(description.length > 0, `${file}: description missing`);
  expect(!titles.has(title), `${file}: duplicate title`);
  expect(!descriptions.has(description), `${file}: duplicate description`);
  titles.add(title); descriptions.add(description);
  expect(count(html, /<h1[\s>]/gi) === 1, `${file}: expected one H1`);
  expect(html.includes(`<link rel="canonical" href="${origin}/${file}">`), `${file}: canonical mismatch`);
  expect(!/<meta[^>]+noindex/i.test(html), `${file}: noindex present`);
  expect(html.includes('<meta name="twitter:image"'), `${file}: twitter:image missing`);
  expect(html.includes('Last reviewed: August 31, 2026'), `${file}: review date missing`);
  expect(html.includes('Put the message in The Echo Box for 10 minutes'), `${file}: free CTA missing`);
  expect(html.includes('30-Day No Contact Reset Kit — $9.99'), `${file}: kit CTA missing`);
  expect(html.includes('../editorial-policy.html') && html.includes('../sources.html') && html.includes('../safety.html'), `${file}: trust links missing`);
  expect(count(html, /href="[^"]+\.html"/g) >= 8, `${file}: insufficient internal links`);
  const schemas = parseJsonLd(html, file).flatMap((entry) => entry['@graph'] || [entry]);
  expect(schemas.some((entry) => entry['@type'] === 'Article'), `${file}: Article schema missing`);
  expect(schemas.some((entry) => entry['@type'] === 'BreadcrumbList'), `${file}: BreadcrumbList schema missing`);
  expect(!html.includes('FAQPage'), `${file}: FAQ schema not allowed`);
}

const sitemap = read('sitemap.xml');
for (const slug of guideSlugs) {
  expect(sitemap.includes(`${origin}/guides/${slug}.html`), `sitemap: missing ${slug}`);
}
const robots = read('robots.txt');
expect(robots.includes('Allow: /'), 'robots: root not allowed');
expect(!/Disallow:\s*\/guides/i.test(robots), 'robots: guides blocked');

const analytics = read('analytics.js');
for (const event of ['landing_view', 'echo_start', 'reset_start', 'reset_complete', 'kit_view', 'checkout_start']) {
  expect(analytics.includes(`'${event}'`), `analytics: missing ${event}`);
}
for (const allowed of ['page_slug', 'cta_location', 'utm_source', 'utm_medium', 'utm_campaign']) {
  expect(analytics.includes(`'${allowed}'`), `analytics: missing allowed property ${allowed}`);
}
for (const forbidden of ['message text', 'relationship text', 'unsentMessage']) {
  expect(!analytics.includes(forbidden), `analytics: sensitive field reference ${forbidden}`);
}
expect(analytics.includes('echoBoxAttribution.v1'), 'analytics: session attribution storage missing');
expect(analytics.includes('sessionStorage'), 'analytics: UTM persistence missing');
expect(analytics.includes('getAttribution'), 'analytics: checkout attribution interface missing');

const commerce = read('commerce-config.js');
expect(commerce.includes("price: '$9.99'"), 'commerce: price changed');
expect(commerce.includes("checkoutUrl: 'https://samzhu168.gumroad.com/l/echo-box-30-day-no-contact-reset-kit'"), 'commerce: Gumroad URL changed');
const app = read('app.js');
expect(app.includes("button.tagName.toLowerCase() !== 'a'"), 'commerce: standalone button checkout handler missing');
expect(app.includes('window.open(checkoutUrl'), 'commerce: Gumroad checkout open missing');

if (failures.length) {
  console.error(`RELAUNCH_QA FAIL\n${failures.join('\n')}`);
  process.exit(1);
}
console.log(`RELAUNCH_QA PASS (${guideSlugs.length} guides, ${titles.size} unique titles)`);
