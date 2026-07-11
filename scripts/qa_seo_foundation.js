const fs = require('fs');
const path = require('path');

const root = process.argv[2] || 'dist';
const requiredFiles = [
    'index.html',
    '30-day-no-contact-reset-kit.html',
    'about.html',
    'editorial-policy.html',
    'sources.html',
    'contact.html',
    'privacy.html',
    'terms.html',
    'safety.html',
    'family-emergency-binder.html',
    'robots.txt',
    'sitemap.xml',
    'style.css',
    'app.js',
    'analytics.js',
    'commerce-config.js',
    'assets/echo-box-breakup-reset-social-20260710-v2.png',
    'assets/echo-box-30-day-no-contact-reset-kit-cover.png'
];

const forbiddenStrings = [
    'localhost',
    '127.0.0.1',
    'vercel.app',
    'AI Career',
    'fake rating',
    'aggregateRating'
];

const failures = [];
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));

for (const file of requiredFiles) {
    if (!exists(file)) failures.push(`missing ${file}`);
}

if (failures.length === 0) {
    const htmlFiles = fs.readdirSync(root).filter((file) => file.endsWith('.html'));
    const textFiles = [
        ...htmlFiles,
        'robots.txt',
        'sitemap.xml',
        'style.css',
        'app.js',
        'analytics.js',
        'commerce-config.js'
    ];
    const allText = textFiles.map(read).join('\n');

    for (const value of forbiddenStrings) {
        if (allText.includes(value)) failures.push(`forbidden ${value}`);
    }

    const home = read('index.html');
    const product = read('30-day-no-contact-reset-kit.html');
    const family = read('family-emergency-binder.html');
    const sitemap = read('sitemap.xml');
    const robots = read('robots.txt');
    const commerce = read('commerce-config.js');
    const analytics = read('analytics.js');

    if (!home.includes('30-day-no-contact-reset-kit.html')) failures.push('home missing product link');
    if (!product.includes('$9.99')) failures.push('product missing price');
    if (/(monthly|annual|recurring|subscribe now|subscription fee)/i.test(product)) {
        failures.push('product suggests recurring subscription');
    }
    if (!family.includes('noindex')) failures.push('family missing noindex');
    if (sitemap.includes('family-emergency-binder.html')) failures.push('family in sitemap');
    if (sitemap.includes('medical-information-sheet-for-elderly-parent.html')) failures.push('medical page in sitemap');
    if (sitemap.includes('emergency-binder-for-aging-parents.html')) failures.push('aging parents page in sitemap');
    if (!robots.includes('OAI-SearchBot')) failures.push('robots missing OAI-SearchBot');
    if (/GPTBot[^\n]*Allow/i.test(robots)) failures.push('GPTBot allowed');
    if (!commerce.includes('https://samzhu168.gumroad.com/l/echo-box-30-day-no-contact-reset-kit')) failures.push('gumroad url mismatch');
    if (!analytics.includes('enabled: false')) failures.push('analytics not disabled');

    const parseJsonLd = (html) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
        .map((match) => JSON.parse(match[1]));

    const flattenJsonLd = (entries) => entries.flatMap((entry) => Array.isArray(entry['@graph']) ? entry['@graph'] : [entry]);
    const homeJson = flattenJsonLd(parseJsonLd(home));
    const productJson = flattenJsonLd(parseJsonLd(product));
    if (homeJson.length === 0) failures.push('home jsonld missing');
    if (!productJson.some((entry) => entry['@type'] === 'Product'
        && entry.offers
        && entry.offers.price === '9.99'
        && entry.offers.priceCurrency === 'USD')) {
        failures.push('product jsonld price missing');
    }
}

if (failures.length) {
    console.error(`SEO_FOUNDATION_QA FAIL\n${failures.join('\n')}`);
    process.exit(1);
}

console.log('SEO_FOUNDATION_QA PASS');
