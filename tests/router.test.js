const test = require('node:test');
const assert = require('node:assert');
const { create } = require('../js/router.js');

function fakeScreen(log, id) {
  return {
    mount() { log.push(`mount:${id}`); return {}; },
    enter() { log.push(`enter:${id}`); },
    exit() { log.push(`exit:${id}`); },
    onAction(a) { log.push(`action:${id}:${typeof a === 'string' ? a : a.type}`); },
    unmount() { log.push(`unmount:${id}`); },
  };
}

function setup(transition) {
  const log = [];
  const screens = { title: fakeScreen(log, 'title'), menu: fakeScreen(log, 'menu'), skills: fakeScreen(log, 'skills') };
  let release;
  const runTransition = transition || (() => new Promise(r => { release = r; }));
  const router = create({ screens, runTransition, root: {} });
  return { router, log, release: () => release && release() };
}

test('go changes state after transition', async () => {
  const { router, release } = setup();
  const p = router.go('menu');
  assert.strictEqual(router.busy, true);
  release();
  await p;
  assert.strictEqual(router.state, 'menu');
  assert.strictEqual(router.busy, false);
});

test('ignores actions while busy', async () => {
  const { router, log, release } = setup();
  const p = router.go('menu');
  router.handle('down');
  const second = router.go('skills');
  assert.strictEqual(second, null);
  release();
  await p;
  assert.ok(!log.some(l => l.startsWith('action:')));
  assert.strictEqual(router.state, 'menu');
});

test('busy clears even if transition rejects', async () => {
  const { router } = setup(() => Promise.reject(new Error('boom')));
  await router.go('menu');
  assert.strictEqual(router.busy, false);
  assert.strictEqual(router.state, 'menu');
});

test('unknown screen warns and keeps state', async () => {
  const { router } = setup(() => Promise.resolve());
  await router.go('menu');
  const warns = [];
  const orig = console.warn;
  console.warn = (...a) => warns.push(a.join(' '));
  try { assert.strictEqual(router.go('nope'), null); } finally { console.warn = orig; }
  assert.strictEqual(router.state, 'menu');
  assert.strictEqual(warns.length, 1);
});

test('back from screen returns to menu', async () => {
  const { router } = setup(() => Promise.resolve());
  await router.go('menu');
  await router.go('skills');
  await router.back();
  assert.strictEqual(router.state, 'menu');
});

test('actions reach the current screen when idle', async () => {
  const { router, log } = setup(() => Promise.resolve());
  await router.go('menu');
  router.handle('down');
  assert.ok(log.includes('action:menu:down'));
});

test('old screen exits and unmounts, new one mounts and enters', async () => {
  const { router, log } = setup(() => Promise.resolve());
  await router.go('menu');
  await router.go('skills');
  assert.deepStrictEqual(log.slice(-4), ['exit:menu', 'mount:skills', 'unmount:menu', 'enter:skills']);
});
