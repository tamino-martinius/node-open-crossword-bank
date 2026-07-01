import test from 'node:test';
import assert from 'node:assert/strict';
import * as main from 'open-crossword-bank';
import * as en from 'open-crossword-bank/en';
import * as de from 'open-crossword-bank/de';

test('ESM: main entry getWords is async and deterministic', async () => {
  assert.equal(typeof main.getWords, 'function');
  const a = await main.getWords('en', { pattern: '?A??E', count: 3, seed: 1 });
  const b = await main.getWords('en', { pattern: '?A??E', count: 3, seed: 1 });
  assert.deepEqual(a.map((w) => w.id), b.map((w) => w.id));
  for (const w of a) assert.equal(w.word.length, 5);
});

test('ESM: sync per-language entry + metadata', () => {
  assert.ok(en.wordCount() >= 29000);
  assert.deepEqual(en.getTiers(), [1, 2, 3, 4, 5]);
  const words = en.getWords({ length: 4, count: 3, seed: 1 });
  assert.equal(words.length, 3);
});

test('ESM: pattern helpers + createFill', () => {
  assert.equal(en.toPattern(5, { 1: 'A', 4: 'E' }), '?A??E');
  const fill = en.createFill({ seed: 1 });
  assert.ok(fill.candidates('?A??E').length > 0);
});

test('ESM: /de subpath works', () => {
  assert.ok(de.getEntries({ length: 6, count: 2, seed: 1 }).length <= 2);
  assert.deepEqual(de.getTiers(), [1, 2, 3, 4, 5]);
});
