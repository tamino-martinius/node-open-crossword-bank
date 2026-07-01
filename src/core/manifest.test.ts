import { TIERS, LENGTHS, BASE_COUNTS, ENRICHED_COUNTS } from './manifest.js';

test('manifest declares 5 tiers and length buckets per language', () => {
  expect(TIERS.en).toEqual([1, 2, 3, 4, 5]);
  expect(TIERS.de).toEqual([1, 2, 3, 4, 5]);
  expect(LENGTHS.en.length).toBeGreaterThanOrEqual(10);
  expect(LENGTHS.de.length).toBeGreaterThanOrEqual(10);
});

test('base counts sum to ~30k per language', () => {
  const sum = (o: Record<number, number>) =>
    Object.values(o).reduce((a, b) => a + b, 0);
  expect(sum(BASE_COUNTS.en)).toBeGreaterThanOrEqual(29000);
  expect(sum(ENRICHED_COUNTS.en)).toBeGreaterThan(3000);
});
