import { WORDS } from '../data/en/base/tier-1.js';
import { ENTRIES } from '../data/en/enriched/len-5.js';

test('base leaf is uppercase strings', () => {
  expect(WORDS.length).toBeGreaterThan(5000);
  expect(WORDS[0]).toBe(WORDS[0].toUpperCase());
});

test('enriched leaf entries carry clues + syllables', () => {
  const e = ENTRIES[0];
  expect(e.word.length).toBe(5);
  expect(e.syllables.join('')).toBe(e.word);
  expect(e.clues.length).toBeGreaterThanOrEqual(1);
});
