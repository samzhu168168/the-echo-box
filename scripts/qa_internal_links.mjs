import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const root = resolve(process.argv[2] || 'dist');
const htmlFiles = [];
function walk(folder) {
  for (const entry of readdirSync(folder, { withFileTypes: true })) {
    const full = join(folder, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.html')) htmlFiles.push(full);
  }
}
walk(root);

const failures = [];
let checked = 0;
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  for (const match of html.matchAll(/href=["']([^"']+)["']/gi)) {
    const href = match[1];
    if (/^(?:https?:|mailto:|tel:|data:|#)/i.test(href)) continue;
    const clean = href.split('#')[0].split('?')[0];
    if (!clean) continue;
    const target = clean.startsWith('/')
      ? resolve(root, clean.replace(/^\/+/, '') || 'index.html')
      : resolve(dirname(file), clean);
    checked += 1;
    if (!target.startsWith(root) || !existsSync(target)) failures.push(`${relative(root, file)} -> ${href}`);
  }
}

console.log(JSON.stringify({ status: failures.length ? 'FAIL' : 'PASS', htmlFiles: htmlFiles.length, linksChecked: checked, failures }, null, 2));
if (failures.length) process.exitCode = 1;
