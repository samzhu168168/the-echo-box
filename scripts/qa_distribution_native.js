const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const analytics = fs.readFileSync('analytics.js', 'utf8');
const commerce = fs.readFileSync('commerce-config.js', 'utf8');

const failures = [];
const requireText = (source, value, label) => {
  if (!source.includes(value)) failures.push(`missing ${label}: ${value}`);
};

[
  'post-reset-offer', 'generate-reset-card', 'download-reset-card',
  'share-reset-card', 'copy-reset-link', 'data-share-reset="friend"',
  "You didn't send it.", 'This card never includes your message'
].forEach((value) => requireText(html, value, 'completion UI'));

[
  'unsent_message_started', 'reset_started', 'reset_completed',
  'reality_box_opened', 'no_contact_started', 'reset_card_generated',
  'reset_card_downloaded', 'share_clicked', 'share_link_copied',
  'referral_visit', 'paid_cta_clicked', 'checkout_started'
].forEach((value) => requireText(analytics, `'${value}'`, 'analytics allowlist'));

requireText(app, "url.searchParams.set('ref', kind)", 'referral parameter');
requireText(app, "url.searchParams.set('utm_source', 'share')", 'share source');
requireText(app, "url.searchParams.set('utm_medium', 'organic')", 'share medium');
requireText(app, 'function drawResetCard()', 'card renderer');
requireText(commerce, 'https://samzhu168.gumroad.com/l/echo-box-30-day-no-contact-reset-kit', 'Gumroad URL');

const cardBuilder = app.match(/function drawResetCard\(\)[\s\S]*?\n    }/)?.[0] || '';
['unsentMessage', 'messageInput', 'realityBox', 'getCurrentMessage', 'exName'].forEach((privateToken) => {
  if (cardBuilder.includes(privateToken)) failures.push(`private token in card builder: ${privateToken}`);
});

if (/reset-card[^\n]*(unsentMessage|messageInput|realityBox)/.test(app)) {
  failures.push('share flow references private state');
}

if (failures.length) {
  console.error(`DISTRIBUTION_NATIVE_QA FAIL\n${failures.join('\n')}`);
  process.exit(1);
}

console.log('DISTRIBUTION_NATIVE_QA PASS');
