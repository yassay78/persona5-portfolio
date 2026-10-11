const test = require('node:test');
const assert = require('node:assert');
const stage = require('../js/stage.js');

test('fit 1920x1080 → scale 1', () => {
  assert.deepStrictEqual(stage.fit(1920, 1080), { scale: 1, x: 0, y: 0 });
});

test('fit 1000x1000 → scale 1000/1920, y centered', () => {
  const r = stage.fit(1000, 1000);
  assert.strictEqual(r.scale, 1000 / 1920);
  assert.ok(Math.abs(r.x) < 1e-9);
  assert.ok(Math.abs(r.y - (1000 - 1080 * r.scale) / 2) < 1e-9);
});

test('fit wide window → x centered, full height', () => {
  const r = stage.fit(3000, 1080);
  assert.strictEqual(r.scale, 1);
  assert.strictEqual(r.x, (3000 - 1920) / 2);
  assert.strictEqual(r.y, 0);
});
