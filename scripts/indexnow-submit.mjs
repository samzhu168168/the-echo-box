const PRODUCTION_ORIGIN = 'https://www.my-echo-box.com';
const PRODUCTION_HOST = 'www.my-echo-box.com';
const SITEMAP_URL = `${PRODUCTION_ORIGIN}/sitemap.xml`;
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const INDEXNOW_KEY = 'e9e5243d49d4ff9366b41ad67087fd6a';
const KEY_LOCATION = `${PRODUCTION_ORIGIN}/${INDEXNOW_KEY}.txt`;

const blockedPathPattern = /(?:^|\/)(?:api|callback|analytics|checkout)(?:\/|$)/i;
const noindexPattern = /<meta\b[^>]*\b(?:name=["']robots["'][^>]*content=["'][^"']*\bnoindex\b|content=["'][^"']*\bnoindex\b[^>]*name=["']robots["'])/i;

function fail(message) {
  throw new Error(message);
}

function decodeXml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'");
}

function parseArguments(argv) {
  if (argv.length === 0) return { mode: 'sitemap' };
  if (argv.length === 2 && argv[0] === '--url' && argv[1]) {
    return { mode: 'single', url: argv[1] };
  }
  fail('Usage: npm run indexnow -- [--url https://www.my-echo-box.com/path]');
}

function validateProductionUrl(value) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    fail(`Invalid URL: ${value}`);
  }

  if (parsed.protocol !== 'https:') fail(`Only HTTPS Production URLs are allowed: ${value}`);
  if (parsed.hostname !== PRODUCTION_HOST || parsed.port || parsed.username || parsed.password) {
    fail(`URL is not on the Production host: ${value}`);
  }
  if (blockedPathPattern.test(parsed.pathname)) fail(`Non-indexable application path rejected: ${value}`);
  if (parsed.hash) fail(`Fragment URLs are not submitted: ${value}`);

  return parsed.href;
}

async function fetchText(url, label) {
  const response = await fetch(url, {
    headers: { 'user-agent': 'The-Echo-Box-IndexNow/1.0' },
    redirect: 'manual'
  });
  if (response.status !== 200) fail(`${label} returned HTTP ${response.status}: ${url}`);
  return { response, body: await response.text() };
}

async function sitemapUrls() {
  const { response, body } = await fetchText(SITEMAP_URL, 'Production sitemap');
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('xml') && !body.trimStart().startsWith('<?xml')) {
    fail(`Production sitemap is not XML: ${contentType || 'missing content-type'}`);
  }

  const urls = [...body.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)]
    .map((match) => validateProductionUrl(decodeXml(match[1].trim())));
  if (urls.length === 0) fail('Production sitemap contains no <loc> URLs.');
  if (new Set(urls).size !== urls.length) fail('Production sitemap contains duplicate URLs.');
  return urls;
}

async function assertIndexable(url) {
  const { response, body } = await fetchText(url, 'Candidate URL');
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('text/html')) {
    fail(`Candidate URL is not HTML: ${url} (${contentType || 'missing content-type'})`);
  }
  const xRobotsTag = response.headers.get('x-robots-tag') || '';
  if (/\bnoindex\b/i.test(xRobotsTag) || noindexPattern.test(body)) {
    fail(`Candidate URL is noindex: ${url}`);
  }
}

async function collectUrls(options) {
  const urls = options.mode === 'single'
    ? [validateProductionUrl(options.url)]
    : await sitemapUrls();

  for (const url of urls) await assertIndexable(url);
  return urls;
}

async function submit(urlList) {
  const payload = {
    host: PRODUCTION_HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList
  };
  const timestamp = new Date().toISOString();
  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'user-agent': 'The-Echo-Box-IndexNow/1.0'
    },
    body: JSON.stringify(payload)
  });
  const responseBody = await response.text();

  console.log(JSON.stringify({
    status: response.status,
    responseBody,
    timestamp,
    urlCount: urlList.length
  }, null, 2));

  if (response.status !== 200 && response.status !== 202) {
    fail(`IndexNow submission failed with HTTP ${response.status}.`);
  }
  console.log(response.status === 200 ? 'INDEXNOW_SUBMITTED' : 'INDEXNOW_ACCEPTED');
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const urlList = await collectUrls(options);
  await submit(urlList);
}

main().catch((error) => {
  console.error(`INDEXNOW_FAILED: ${error.message}`);
  process.exitCode = 1;
});
