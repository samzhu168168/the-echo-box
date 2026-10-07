const assert = require('node:assert/strict');
const tools = require('../wave1-tools.js');

function legacyCalculation(lastContactAt, now) {
  const elapsed = Math.max(0, now - lastContactAt);
  const days = Math.floor(elapsed / 86400000);
  const hours = Math.floor((elapsed % 86400000) / 3600000);
  const minutes = Math.floor((elapsed % 3600000) / 60000);
  const milestones = [1, 3, 7, 14, 30];
  const nextMilestone = milestones.find((day) => day > days) || 30;
  return { elapsed, days, hours, minutes, nextMilestone };
}

const frozenNow = Date.parse('2026-10-07T12:00:00.000Z');
const elapsedCases = [
  0,
  59000,
  (59 * 60 + 59) * 1000,
  (23 * 60 * 60 + 59 * 60 + 59) * 1000,
  24 * 60 * 60 * 1000,
  1 * 86400000,
  3 * 86400000,
  7 * 86400000,
  14 * 86400000,
  30 * 86400000
];

for (const elapsed of elapsedCases) {
  const lastContactAt = frozenNow - elapsed;
  const expected = legacyCalculation(lastContactAt, frozenNow);
  const actual = tools.calculateNoContactDuration(lastContactAt, frozenNow);
  assert.equal(actual.valid, true);
  assert.deepEqual(
    { elapsed: actual.elapsed, days: actual.days, hours: actual.hours, minutes: actual.minutes, nextMilestone: actual.nextMilestone },
    expected
  );
}

const future = tools.calculateNoContactDuration(frozenNow + 3600000, frozenNow);
assert.deepEqual(
  { elapsed: future.elapsed, days: future.days, hours: future.hours, minutes: future.minutes, nextMilestone: future.nextMilestone },
  legacyCalculation(frozenNow + 3600000, frozenNow)
);

assert.equal(tools.calculateNoContactDuration('invalid', frozenNow).valid, false);

const dstStart = Date.parse('2026-03-08T06:30:00.000Z');
const dstNow = Date.parse('2026-03-09T06:30:00.000Z');
assert.equal(tools.calculateNoContactDuration(dstStart, dstNow).days, 1);

const timezoneReloadStart = Date.parse('2026-10-05T12:00:00.000Z');
const first = tools.calculateNoContactDuration(timezoneReloadStart, frozenNow);
const reload = tools.calculateNoContactDuration(timezoneReloadStart, frozenNow);
assert.deepEqual(reload, first);

console.log(JSON.stringify({ status: 'PASS', cases: elapsedCases.length + 4, milestones: tools.COUNTER_MILESTONES }));
