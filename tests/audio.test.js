const test = require('node:test');
const assert = require('node:assert');
const audio = require('../js/audio.js');

function memStorage() {
  const m = new Map();
  return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)) };
}

test('settings defaults', () => {
  const s = audio.createSettings(memStorage());
  assert.strictEqual(s.muted, false);
  assert.strictEqual(s.music, 0.5);
  assert.strictEqual(s.sfx, 0.8);
});

test('settings persist and reload', () => {
  const store = memStorage();
  const s = audio.createSettings(store);
  s.set('muted', true);
  s.set('music', 0.2);
  const again = audio.createSettings(store);
  assert.strictEqual(again.muted, true);
  assert.strictEqual(again.music, 0.2);
  assert.strictEqual(again.sfx, 0.8);
});

test('settings survive throwing storage', () => {
  const bad = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); } };
  const s = audio.createSettings(bad);
  assert.strictEqual(s.music, 0.5);
  s.set('sfx', 0.1);
  assert.strictEqual(s.sfx, 0.1);
});

test('volumes are clamped to 0..1', () => {
  const s = audio.createSettings(memStorage());
  s.set('music', 3);
  s.set('sfx', -1);
  assert.strictEqual(s.music, 1);
  assert.strictEqual(s.sfx, 0);
});

test('corrupt stored JSON falls back to defaults', () => {
  const store = memStorage();
  store.setItem('p5.audio', '{oops');
  assert.strictEqual(audio.createSettings(store).sfx, 0.8);
});
