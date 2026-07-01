import * as main from './index.js';

test('async getWords matches sync /en for same seed', async () => {
  const en = await import('./en.js');
  const a = await main.getWords('en', { pattern: '?A??E', count: 5, seed: 1 });
  const b = en.getWords({ pattern: '?A??E', count: 5, seed: 1 });
  expect(a.map((w) => w.id)).toEqual(b.map((w) => w.id));
});

test('async getEntries loads only the queried length', async () => {
  const clued = await main.getEntries('en', { length: 5, count: 3, seed: 2 });
  for (const e of clued) expect(e.length).toBe(5);
});

test('sync metadata reads the manifest', () => {
  expect(main.getTiers('de')).toEqual([1, 2, 3, 4, 5]);
  expect(main.wordCount('en')).toBeGreaterThanOrEqual(29000);
  expect(main.getLengths('en')).toContain(5);
});

test('async createFill returns a working session', async () => {
  const fill = await main.createFill('en', { seed: 1 });
  expect(fill.candidates('?A??E').length).toBeGreaterThan(0);
});

test('getWordById / getEntryById resolve by id', async () => {
  const [w] = await main.getWords('en', { length: 5, count: 1, seed: 1 });
  expect((await main.getWordById('en', w.id))?.word).toBe(w.word);
});
