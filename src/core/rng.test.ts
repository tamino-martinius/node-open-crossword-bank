import { mulberry32, shuffle } from './rng.js';

test('mulberry32 is deterministic for a given seed', () => {
  const a = mulberry32(42);
  const b = mulberry32(42);
  expect([a(), a(), a()]).toEqual([b(), b(), b()]);
});

test('shuffle is seeded and does not mutate input', () => {
  const input = [1, 2, 3, 4, 5];
  const out1 = shuffle(input, mulberry32(7));
  const out2 = shuffle(input, mulberry32(7));
  expect(out1).toEqual(out2);
  expect(out1).not.toEqual(input); // extremely unlikely to match for seed 7
  expect(input).toEqual([1, 2, 3, 4, 5]);
  expect([...out1].sort()).toEqual([1, 2, 3, 4, 5]);
});
