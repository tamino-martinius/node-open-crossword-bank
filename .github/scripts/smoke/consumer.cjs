'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const main = require('open-crossword-bank');
const en = require('open-crossword-bank/en');
const de = require('open-crossword-bank/de');

test('CJS: main entry getWords resolves', async () => {
  const r = await main.getWords('de', { length: 5, count: 2, seed: 1 });
  assert.equal(r.length, 2);
});

test('CJS: sync per-language entry works', () => {
  const r = en.getWords({ length: 4, count: 2, seed: 1 });
  assert.equal(r.length, 2);
  assert.ok(en.getLengths().includes(5));
});

test('CJS: /de subpath works', () => {
  const r = de.getWords({ length: 6, count: 2, seed: 1 });
  assert.equal(r.length, 2);
});

test('CJS: pattern helpers exported', () => {
  assert.equal(en.matchesPattern('BADGE', '?A??E'), true);
  assert.equal(en.toPattern(3), '???');
});
