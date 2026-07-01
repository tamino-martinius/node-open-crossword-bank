import * as en from './en.js';

test('en sync API returns seeded words matching a pattern', () => {
  const words = en.getWords({ pattern: '?A??E', count: 5, seed: 1 });
  expect(words.length).toBeLessThanOrEqual(5);
  for (const w of words) {
    expect(w.word.length).toBe(5);
    expect(w.word[1]).toBe('A');
    expect(w.word[4]).toBe('E');
    expect(w.lang).toBe('en');
  }
  expect(en.getWords({ pattern: '?A??E', count: 5, seed: 1 })).toEqual(words); // deterministic
});

test('en metadata + enriched query', () => {
  expect(en.wordCount()).toBeGreaterThanOrEqual(29000);
  expect(en.getTiers()).toEqual([1, 2, 3, 4, 5]);
  expect(en.getLengths()).toContain(5);
  const clued = en.getEntries({
    length: 5,
    clueType: 'definition',
    count: 3,
    seed: 2,
  });
  for (const e of clued)
    expect(e.clues.some((c) => c.type === 'definition')).toBe(true);
});

test('en createFill drives backtracking over the pool', () => {
  const fill = en.createFill({ seed: 1 });
  const cands = fill.candidates('?A??E');
  expect(cands.length).toBeGreaterThan(0);
  const first = cands[0].word;
  fill.place(first);
  expect(fill.candidates('?A??E').some((w) => w.word === first)).toBe(false);
});

test('en re-exports pattern helpers', () => {
  expect(en.toPattern(5, { 1: 'A', 4: 'E' })).toBe('?A??E');
  expect(en.matchesPattern('BADGE', '?A??E')).toBe(true);
});
