import { TIERS, LENGTHS, BASE_COUNTS, ENRICHED_COUNTS } from './manifest.js';

test('manifest declares 5 tiers and length buckets per language', () => {
  expect(TIERS.en).toEqual([1, 2, 3, 4, 5]);
  expect(TIERS.de).toEqual([1, 2, 3, 4, 5]);
  expect(LENGTHS.en.length).toBeGreaterThanOrEqual(10);
  expect(LENGTHS.de.length).toBeGreaterThanOrEqual(10);
});

test('base counts sum to 90k per language', () => {
  const sum = (o: Record<number, number>) =>
    Object.values(o).reduce((a, b) => a + b, 0);
  expect(sum(BASE_COUNTS.en)).toBe(90000);
  expect(sum(BASE_COUNTS.de)).toBe(90000);
  for (const t of [1, 2, 3, 4, 5]) expect(BASE_COUNTS.en[t]).toBe(18000);
  // ~20% of 90k clued (allowing for words validate() left unclued).
  expect(sum(ENRICHED_COUNTS.en)).toBeGreaterThan(15000);
  expect(sum(ENRICHED_COUNTS.de)).toBeGreaterThan(15000);
});
