const test = require('node:test');
const assert = require('node:assert');
const contentCheck = require('../js/content-check.js');

test('drops unknown menu types with warning', () => {
  const { content, warnings } = contentCheck({ menu: [{ label: 'A', type: 'skills' }, { label: 'B', type: 'banana' }] });
  assert.deepStrictEqual(content.menu.map(m => m.label), ['A']);
  assert.strictEqual(warnings.length, 1);
  assert.match(warnings[0], /banana/);
});

test('clamps levels', () => {
  const { content } = contentCheck({
    skills: [{ name: 'x', level: 42 }, { name: 'y', level: -3 }],
    passions: [{ name: 'Boxe', rank: 99 }],
    stats: [{ label: 'Guts', value: 9 }],
  });
  assert.deepStrictEqual(content.skills.map(s => s.level), [10, 1]);
  assert.strictEqual(content.passions[0].rank, 10);
  assert.strictEqual(content.stats[0].value, 5);
});

test('missing sections become []', () => {
  const { content } = contentCheck({});
  for (const k of ['menu', 'skills', 'stats', 'projects', 'passions']) assert.deepStrictEqual(content[k], []);
  assert.deepStrictEqual(content.contact.links, []);
  assert.deepStrictEqual(content.about.traits, []);
  assert.strictEqual(typeof content.name, 'string');
});

test('nested arrays default to []', () => {
  const { content } = contentCheck({ projects: [{ name: 'P' }], passions: [{ name: 'Boxe' }] });
  assert.deepStrictEqual(content.projects[0].links, []);
  assert.deepStrictEqual(content.passions[0].photos, []);
});

test('null content does not throw', () => {
  const { content } = contentCheck(undefined);
  assert.deepStrictEqual(content.menu, []);
});
