const test = require('node:test');
const assert = require('node:assert');
const { scrollStart } = require('../js/screens/list-common.js');

test('no scroll when everything fits', () => {
  assert.strictEqual(scrollStart(5, 8, 10, 0), 0);
});

test('scrolls down to keep selection visible', () => {
  assert.strictEqual(scrollStart(9, 15, 8, 0), 2);
});

test('scrolls up when selection goes above window', () => {
  assert.strictEqual(scrollStart(3, 15, 8, 6), 3);
});

test('keeps window when selection already visible', () => {
  assert.strictEqual(scrollStart(7, 15, 8, 4), 4);
});

test('wrap to last item shows the final page', () => {
  assert.strictEqual(scrollStart(14, 15, 8, 0), 7);
});
