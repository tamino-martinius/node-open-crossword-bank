import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseWords, freqTierForRank, retierEntry, readEnrichedFull } from '../import-lib.mjs';

test('parseWords extracts words in file order', () => {
  const src = 'export const WORDS: readonly string[] = [\n  "THE",\n  "AND",\n  "FÜR",\n];\n';
  assert.deepEqual(parseWords(src), ['THE', 'AND', 'FÜR']);
});

test('freqTierForRank bands by size, caps at 5', () => {
  assert.equal(freqTierForRank(0, 18000), 1);
  assert.equal(freqTierForRank(17999, 18000), 1);
  assert.equal(freqTierForRank(18000, 18000), 2);
  assert.equal(freqTierForRank(89999, 18000), 5);
  assert.equal(freqTierForRank(200000, 18000), 5); // clamp
});

test('retierEntry recomputes freqTier from rank; preserves everything else', () => {
  const rankMap = new Map([['ABOUT', 25000]]);
  const e = { id: 'en-about-x', word: 'ABOUT', lang: 'en', freqTier: 1, length: 5, pos: 'adverb', syllables: ['ABOUT'], clues: [{ type: 'synonym', difficulty: 2, text: 'Approximately' }] };
  const out = retierEntry(e, rankMap, 18000);
  assert.equal(out.freqTier, 2);            // floor(25000/18000)+1
  assert.equal(out.word, 'ABOUT');
  assert.deepEqual(out.clues, e.clues);
  assert.notEqual(out, e);                  // copy, not mutation
  assert.equal(e.freqTier, 1);              // original untouched
});

test('retierEntry throws on a word missing from the base', () => {
  assert.throws(() => retierEntry({ word: 'ZZZ' }, new Map(), 18000), /not in base/);
});

test('readEnrichedFull parses a non-empty entry array', () => {
  const json = JSON.stringify([{ id: 'en-x-1', word: 'X', lang: 'en', freqTier: 1, length: 1, pos: 'other', syllables: ['X'], clues: [] }]);
  const out = readEnrichedFull(json);
  assert.equal(out.length, 1);
  assert.equal(out[0].word, 'X');
  assert.deepEqual(out[0].syllables, ['X']);
});

test('readEnrichedFull rejects a non-array or empty payload', () => {
  assert.throws(() => readEnrichedFull('{}'), /expected a non-empty array/);
  assert.throws(() => readEnrichedFull('[]'), /expected a non-empty array/);
});
