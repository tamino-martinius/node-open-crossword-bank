import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bucketByLength, bucketByTier } from '../regrid-lib.mjs';

test('bucketByLength groups by length, preserving order', () => {
  const m = bucketByLength(['CAT', 'DOGS', 'ANT', 'BEE']);
  assert.deepEqual(m.get(3), ['CAT', 'ANT', 'BEE']);
  assert.deepEqual(m.get(4), ['DOGS']);
});

test('bucketByTier groups by freqTier, preserving order', () => {
  const m = bucketByTier([
    { word: 'A', freqTier: 1 },
    { word: 'B', freqTier: 2 },
    { word: 'C', freqTier: 1 },
  ]);
  assert.deepEqual(m.get(1).map((e) => e.word), ['A', 'C']);
  assert.deepEqual(m.get(2).map((e) => e.word), ['B']);
});
