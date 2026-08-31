const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

const files = [
  'e9e5243d49d4ff9366b41ad67087fd6a.txt',
  'index.html',
  'style.css',
  'app.js',
  'analytics.js',
  'commerce-config.js',
  'about.html',
  'editorial-policy.html',
  'sources.html',
  'contact.html',
  '30-day-no-contact-reset-kit.html',
  'guides/should-i-text-my-ex.html',
  'guides/my-ex-texted-me-during-no-contact.html',
  'guides/i-broke-no-contact.html',
  'guides/should-i-text-my-ex-happy-birthday.html',
  'guides/i-miss-my-ex-at-night.html',
  'privacy.html',
  'terms.html',
  'safety.html',
  'family-emergency-binder.html',
  'medical-information-sheet-for-elderly-parent.html',
  'free-checklist.html',
  'emergency-binder-for-aging-parents.html',
  'robots.txt',
  'sitemap.xml',
  'favicon.ico',
  'assets/echobox_icon.png.png',
  'assets/echobox_social.jpg.jpg',
  'assets/echobox-family-emergency-social-20260707.png',
  'assets/echo-box-30-day-no-contact-reset-kit-cover.png',
  'assets/echo-box-breakup-reset-social-20260710.png',
  'assets/echo-box-breakup-reset-social-20260710-v2.png'
];

const forbiddenTopLevel = new Set(['docs', 'marketing', 'products', 'backups', '.git', '.codex_deps', 'output', 'release']);

function removeDir(target) {
  if (fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true });
}

function copyFile(relativePath) {
  const parts = relativePath.split(/[\\/]/);
  if (forbiddenTopLevel.has(parts[0])) throw new Error(`Forbidden deploy path: ${relativePath}`);
  const src = path.join(root, relativePath);
  const dest = path.join(dist, relativePath);
  if (!fs.existsSync(src)) throw new Error(`Missing deploy file: ${relativePath}`);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

removeDir(dist);
fs.mkdirSync(dist, { recursive: true });
files.forEach(copyFile);

const indexNowKey = 'e9e5243d49d4ff9366b41ad67087fd6a';
const indexNowKeyPath = path.join(dist, `${indexNowKey}.txt`);
fs.writeFileSync(indexNowKeyPath, indexNowKey, 'utf8');

for (const forbidden of forbiddenTopLevel) {
  if (fs.existsSync(path.join(dist, forbidden))) {
    throw new Error(`Forbidden folder included in dist: ${forbidden}`);
  }
}

console.log(`Built dist with ${files.length} files.`);
