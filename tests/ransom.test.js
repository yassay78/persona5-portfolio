const test = require('node:test');
const assert = require('node:assert');
const ransom = require('../js/ransom.js');

const FONTS = ['A', 'B', 'C', 'D'];

test('rng is deterministic per seed', () => {
  const a = ransom.rng('SKILLS'), b = ransom.rng('SKILLS');
  const seqA = [a(), a(), a(), a(), a()], seqB = [b(), b(), b(), b(), b()];
  assert.deepStrictEqual(seqA, seqB);
  seqA.forEach(v => assert.ok(v >= 0 && v < 1));
});

test('rng differs between seeds', () => {
  assert.notStrictEqual(ransom.rng('A')(), ransom.rng('B')());
});

test('layout length equals text length', () => {
  assert.strictEqual(ransom.layout('ABOUT ME', { fonts: FONTS }).length, 8);
});

test('layout stable for same seed', () => {
  assert.deepStrictEqual(ransom.layout('PROJECTS', { fonts: FONTS }), ransom.layout('PROJECTS', { fonts: FONTS }));
});

test('rot within ±12deg', () => {
  ransom.layout('THE QUICK BROWN FOX JUMPS', { fonts: FONTS })
    .filter(l => l.ch !== ' ')
    .forEach(l => assert.ok(Math.abs(l.rot) <= 12, `rot ${l.rot}`));
});

test('spaces unstyled', () => {
  assert.deepStrictEqual(ransom.layout('A B', { fonts: FONTS })[1], { ch: ' ' });
});

test('first letter scale >= 1.25', () => {
  assert.ok(ransom.layout('SYSTEM', { fonts: FONTS })[0].scale >= 1.25);
});

test('fonts come from the given list', () => {
  ransom.layout('CONTACT', { fonts: FONTS }).forEach(l => assert.ok(FONTS.includes(l.font)));
});

test('accented letters never use the P5UX font (no glyphs for them)', () => {
  const fonts = ['P5UX', 'Anton'];
  for (let i = 0; i < 40; i++) {
    ransom.layout('ÉÈÀÇÔ', { fonts, seed: 'acc' + i }).forEach(l => assert.notStrictEqual(l.font, 'P5UX'));
  }
});

test('fitScale', () => {
  assert.strictEqual(ransom.fitScale(2000, 1000), 0.5);
  assert.strictEqual(ransom.fitScale(500, 1000), 1);
});
