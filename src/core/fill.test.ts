import { createFillFromPool } from './fill.js';
import type { WordEntry } from '../types.js';

const w = (word: string, freqTier: 1 | 2 | 3 | 4 | 5 = 1): WordEntry => ({
  id: `en-${word.toLowerCase()}`,
  word,
  lang: 'en',
  freqTier,
});
const POOL: WordEntry[] = [
  w('CAT'),
  w('CAR'),
  w('COD'),
  w('DOG'),
  w('CODE'),
  w('CARD'),
];

test('candidates match pattern by length and letters, seeded-stable', () => {
  const f = createFillFromPool(POOL, 5);
  const c = f
    .candidates('C??')
    .map((x) => x.word)
    .sort();
  expect(c).toEqual(['CAR', 'CAT', 'COD']);
  expect(f.candidates('C??').map((x) => x.word)).toEqual(
    f.candidates('C??').map((x) => x.word),
  ); // stable
  expect(
    f
      .candidates('CA?')
      .map((x) => x.word)
      .sort(),
  ).toEqual(['CAR', 'CAT']);
});

test('place/unplace drive backtracking; misses return []', () => {
  const f = createFillFromPool(POOL, 5);
  const first = f.candidates('C??')[0].word;
  f.place(first);
  expect(f.candidates('C??').some((x) => x.word === first)).toBe(false);
  expect(f.placed()).toContain(first);
  f.unplace(first);
  expect(f.candidates('C??').some((x) => x.word === first)).toBe(true);
  expect(f.candidates('Z??')).toEqual([]); // miss
});

test('remaining and reset', () => {
  const f = createFillFromPool(POOL, 5);
  expect(f.remaining()).toBe(6);
  expect(f.remaining('C??')).toBe(3);
  f.place('CAT');
  expect(f.remaining()).toBe(5);
  expect(f.remaining('C??')).toBe(2);
  f.reset();
  expect(f.remaining()).toBe(6);
  expect(f.placed()).toEqual([]);
});
