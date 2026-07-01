import type { WordEntry, EnrichedEntry, WordQuery } from '../types.js';

test('types compile and construct', () => {
  const w: WordEntry = {
    id: 'en-the-abc',
    word: 'THE',
    lang: 'en',
    freqTier: 1,
  };
  const e: EnrichedEntry = {
    ...w,
    word: 'ABOUT',
    length: 5,
    pos: 'adverb',
    syllables: ['ABOUT'],
    clues: [],
  };
  const q: WordQuery = { pattern: '?A??E', seed: 1, count: 3 };
  expect(w.freqTier).toBe(1);
  expect(e.syllables.join('')).toBe('ABOUT');
  expect(q.pattern?.length).toBe(5);
});
