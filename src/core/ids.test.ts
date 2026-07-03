import { slug, makeId } from './ids.js';

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
