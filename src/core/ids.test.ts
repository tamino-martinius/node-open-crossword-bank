import { slug, makeId, freqTierForRank } from './ids.js';

test('slug folds ß and diacritics to ascii', () => {
  expect(slug('STRAßE')).toBe('strasse');
  expect(slug('HÄLT')).toBe('halt');
  expect(slug('HALT')).toBe('halt');
});

test('makeId disambiguates slug collisions via hash', () => {
  const a = makeId('de', 'HALT');
  const b = makeId('de', 'HÄLT');
  expect(a.startsWith('de-halt-')).toBe(true);
  expect(b.startsWith('de-halt-')).toBe(true);
  expect(a).not.toBe(b);
});

test('freqTierForRank maps 6k bands to tiers 1..5', () => {
  expect(freqTierForRank(0)).toBe(1);
  expect(freqTierForRank(5999)).toBe(1);
  expect(freqTierForRank(6000)).toBe(2);
  expect(freqTierForRank(29999)).toBe(5);
  expect(freqTierForRank(40000)).toBe(5);
});
