import {
  orderBySeed,
  filterWords,
  selectWords,
  filterEntries,
  selectEntries,
} from './select.js';
import type { WordEntry, EnrichedEntry } from '../types.js';

const W: WordEntry[] = [
  { id: 'en-cat-1', word: 'CAT', lang: 'en', freqTier: 1 },
  { id: 'en-code-2', word: 'CODE', lang: 'en', freqTier: 1 },
  { id: 'en-card-3', word: 'CARD', lang: 'en', freqTier: 2 },
  { id: 'en-dog-4', word: 'DOG', lang: 'en', freqTier: 3 },
];

const E: EnrichedEntry[] = [
  {
    id: 'en-cat-1',
    word: 'CAT',
    lang: 'en',
    freqTier: 1,
    length: 3,
    pos: 'noun',
    syllables: ['CAT'],
    clues: [{ type: 'definition', difficulty: 2, text: 'A small feline' }],
  },
  {
    id: 'en-run-5',
    word: 'RUN',
    lang: 'en',
    freqTier: 1,
    length: 3,
    pos: 'verb',
    syllables: ['RUN'],
    clues: [{ type: 'fill-blank', difficulty: 4, text: 'I have to _____.' }],
  },
];

test('filterWords: length via pattern, tier, pattern letters, excludeIds', () => {
  expect(filterWords(W, { length: 3 }).map((w) => w.word)).toEqual([
    'CAT',
    'DOG',
  ]);
  expect(filterWords(W, { pattern: 'C???' }).map((w) => w.word)).toEqual([
    'CODE',
    'CARD',
  ]);
  expect(filterWords(W, { pattern: 'CA??' }).map((w) => w.word)).toEqual([
    'CARD',
  ]);
  expect(filterWords(W, { tier: [1, 2] }).map((w) => w.word)).toEqual([
    'CAT',
    'CODE',
    'CARD',
  ]);
  expect(
    filterWords(W, { excludeIds: ['en-cat-1'] }).map((w) => w.word),
  ).toEqual(['CODE', 'CARD', 'DOG']);
});

test('filterWords: cluable restricts to words with an enriched id', () => {
  const cluable = new Set(['en-cat-1']);
  expect(filterWords(W, { cluable: true }, cluable).map((w) => w.word)).toEqual(
    ['CAT'],
  );
});

test('selectWords: seeded order is deterministic; count truncates', () => {
  const a = selectWords(W, { seed: 3 });
  const b = selectWords(W, { seed: 3 });
  expect(a).toEqual(b);
  expect(selectWords(W, { seed: 3, count: 2 }).length).toBe(2);
});

test('filterEntries: pos and clue predicates', () => {
  expect(filterEntries(E, { pos: 'verb' }).map((e) => e.word)).toEqual(['RUN']);
  expect(
    filterEntries(E, { clueType: 'definition' }).map((e) => e.word),
  ).toEqual(['CAT']);
  expect(filterEntries(E, { maxClueDifficulty: 2 }).map((e) => e.word)).toEqual(
    ['CAT'],
  );
  expect(selectEntries(E, { seed: 1, count: 1 }).length).toBe(1);
});

test('orderBySeed does not mutate and is stable per seed', () => {
  const input = [...W];
  const out = orderBySeed(W, 9);
  expect(orderBySeed(W, 9)).toEqual(out);
  expect(W).toEqual(input);
});
