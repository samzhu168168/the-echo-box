const ORIGIN = 'https://www.my-echo-box.com';
const GUIDE_PATHS = [
  '/guides/should-i-text-my-ex.html',
  '/guides/my-ex-texted-me-during-no-contact.html',
  '/guides/i-broke-no-contact.html',
  '/guides/should-i-text-my-ex-happy-birthday.html',
  '/guides/i-miss-my-ex-at-night.html',
  '/guides/should-i-block-my-ex-during-no-contact.html',
  '/guides/how-to-stop-checking-my-ex-social-media.html',
  '/guides/why-do-i-keep-rereading-old-messages-from-my-ex.html'
];
const CORE_PATHS = ['/', ...GUIDE_PATHS];
const UTM_SOURCES = ['tiktok', 'youtube', 'pinterest', 'x'];
const GUMROAD_URL = 'https://samzhu168.gumroad.com/l/echo-box-30-day-no-contact-reset-kit';
const INDEXNOW_KEY = 'e9e5243d49d4ff9366b41ad67087fd6a';
const issues = [];

function check(condition, message) {
  if (!condition) issues.push(message);
}

async function get(url, label) {
  let lastError;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const response = await fetch(url, { redirect: 'manual' });
      const body = await response.text();
      check(response.status === 200, `${label}: HTTP ${response.status}`);
      return { response, body };
    } catch (error) {
      lastError = error;
    }
  }
  issues.push(`${label}: ${lastError.message}`);
  return { response: null, body: '' };
}

function metaContent(html, attribute, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const first = new RegExp(`<meta[^>]+${attribute}=["']${escaped}["'][^>]+content=["']([^"']+)["']`, 'i').exec(html);
  const reversed = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+${attribute}=["']${escaped}["']`, 'i').exec(html);
  return first?.[1] || reversed?.[1] || '';
}

function linkHref(html, rel) {
  const first = new RegExp(`<link[^>]+rel=["']${rel}["'][^>]+href=["']([^"']+)["']`, 'i').exec(html);
  const reversed = new RegExp(`<link[^>]+href=["']([^"']+)["'][^>]+rel=["']${rel}["']`, 'i').exec(html);
  return first?.[1] || reversed?.[1] || '';
}

function inspectPage(path, html) {
  const expectedUrl = new URL(path, ORIGIN).href;
  const title = /<title>([^<]+)<\/title>/i.exec(html)?.[1] || '';
  check(Boolean(title), `${path}: missing title`);
  check(Boolean(metaContent(html, 'name', 'description')), `${path}: missing meta description`);
  check(linkHref(html, 'canonical') === expectedUrl, `${path}: canonical mismatch`);
  check(!/<meta[^>]+content=["'][^"']*noindex/i.test(html), `${path}: noindex found`);
  for (const property of ['og:title', 'og:description', 'og:url', 'og:type', 'og:image']) {
    check(Boolean(metaContent(html, 'property', property)), `${path}: missing ${property}`);
  }
  check(metaContent(html, 'property', 'og:url') === expectedUrl, `${path}: og:url mismatch`);
  for (const name of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) {
    check(Boolean(metaContent(html, 'name', name)), `${path}: missing ${name}`);
  }
  check(!/vercel\.app|localhost/i.test(html), `${path}: Preview or localhost reference found`);
  if (path === '/') {
    check(html.includes('id="unsent-form"'), 'homepage: reset form missing');
    check(html.includes('data-paid-kit-cta'), 'homepage: paid kit CTA missing');
  } else {
    check(/href=["']\.\.\/#reset["']/.test(html), `${path}: free reset CTA missing`);
    check(html.includes('data-paid-kit-cta'), `${path}: paid kit CTA missing`);
  }
}

async function main() {
  const pages = new Map();
  for (const path of CORE_PATHS) {
    const { body } = await get(new URL(path, ORIGIN), path);
    pages.set(path, body);
    inspectPage(path, body);
  }

  const socialImages = new Set();
  for (const html of pages.values()) {
    socialImages.add(metaContent(html, 'property', 'og:image'));
    socialImages.add(metaContent(html, 'name', 'twitter:image'));
  }
  socialImages.delete('');
  for (const imageUrl of socialImages) await get(imageUrl, `social image ${imageUrl}`);

  const internalLinks = new Set();
  for (const [path, html] of pages) {
    for (const match of html.matchAll(/href=["']([^"']+)["']/gi)) {
      if (/^(?:mailto:|tel:|javascript:|#)/i.test(match[1])) continue;
      const url = new URL(match[1], new URL(path, ORIGIN));
      if (url.origin === ORIGIN) {
        url.hash = '';
        internalLinks.add(url.href);
      }
    }
  }
  for (const url of internalLinks) await get(url, `internal link ${url}`);

  const { body: sitemap } = await get(`${ORIGIN}/sitemap.xml`, 'sitemap.xml');
  const sitemapUrls = [...sitemap.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map((match) => match[1]);
  check(sitemapUrls.length === 17, `sitemap.xml: expected 17 URLs, found ${sitemapUrls.length}`);
  check(sitemapUrls.every((url) => url.startsWith(`${ORIGIN}/`)), 'sitemap.xml: non-Production URL found');

  const { body: robots } = await get(`${ORIGIN}/robots.txt`, 'robots.txt');
  check(robots.includes(`Sitemap: ${ORIGIN}/sitemap.xml`), 'robots.txt: sitemap declaration missing');
  check(!/Disallow:\s*\/guides/i.test(robots), 'robots.txt: guides blocked');

  const { body: indexNowKeyBody } = await get(`${ORIGIN}/${INDEXNOW_KEY}.txt`, 'IndexNow key');
  check(indexNowKeyBody === INDEXNOW_KEY, 'IndexNow key: body mismatch');

  const { body: commerce } = await get(`${ORIGIN}/commerce-config.js`, 'commerce-config.js');
  check(commerce.includes(GUMROAD_URL), 'commerce-config.js: Gumroad URL mismatch');
  check(commerce.includes("price: '$9.99'"), 'commerce-config.js: price mismatch');

  for (const source of UTM_SOURCES) {
    const url = `${ORIGIN}/?utm_source=${source}&utm_medium=organic&utm_campaign=relaunch14d`;
    await get(url, `${source} UTM landing`);
  }

  console.log(JSON.stringify({
    status: issues.length ? 'FAIL' : 'PASS',
    checkedAt: new Date().toISOString(),
    corePageCount: CORE_PATHS.length,
    internalLinkCount: internalLinks.size,
    sitemapUrlCount: sitemapUrls.length,
    issues
  }, null, 2));
  if (issues.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(JSON.stringify({ status: 'FAIL', issues: [error.message] }, null, 2));
  process.exitCode = 1;
});
