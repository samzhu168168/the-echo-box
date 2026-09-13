import { createHash } from 'node:crypto';

const origin = process.argv[2] || 'https://www.my-echo-box.com';
const paths = ['/', '/30-day-no-contact-reset-kit.html'];
const userAgents = {
  desktop: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36',
  mobile: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/140 Mobile Safari/537.36',
  googlebot: 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 Chrome/131 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  bingbot: 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
  oaiSearchBot: 'OAI-SearchBot/1.0; +https://openai.com/searchbot'
};

const results = [];
for (const pathname of paths) {
  for (const [agent, userAgent] of Object.entries(userAgents)) {
    const response = await fetch(new URL(pathname, origin), {
      headers: { 'user-agent': userAgent },
      redirect: 'follow',
      signal: AbortSignal.timeout(15000)
    });
    const body = await response.text();
    results.push({
      pathname,
      agent,
      status: response.status,
      finalUrl: response.url,
      hash: createHash('sha256').update(body).digest('hex'),
      cacheControl: response.headers.get('cache-control'),
      vercelCache: response.headers.get('x-vercel-cache'),
      title: body.match(/<title>([^<]+)<\/title>/i)?.[1] || '',
      hasCurrentProductName: body.includes('30-Day Breakup Reset System'),
      hasLegacyKitCopy: /30-Day No Contact Reset Kit/i.test(body)
    });
  }
}

const failures = results.filter((item) => item.status !== 200 || !item.hasCurrentProductName || item.hasLegacyKitCopy);
for (const pathname of paths) {
  const hashes = new Set(results.filter((item) => item.pathname === pathname).map((item) => item.hash));
  if (hashes.size !== 1) failures.push({ pathname, reason: 'User-agent source hashes differ' });
}

console.log(JSON.stringify({
  status: failures.length ? 'FAIL' : 'SOURCE_HTML_PASS',
  conclusion: failures.length ? 'INVESTIGATE_SOURCE_VARIANCE' : 'INDEX_REFRESH_REQUIRED',
  results,
  failures
}, null, 2));
if (failures.length) process.exitCode = 1;
