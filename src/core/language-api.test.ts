import { hydrateBase, createLanguageApi } from './language-api.js';

test('hydrateBase assigns id/lang/tier', () => {
  const [w] = hydrateBase('en', 2, ['THE']);
  expect(w).toMatchObject({ word: 'THE', lang: 'en', freqTier: 2 });
  expect(w.id.startsWith('en-the-')).toBe(true);
});

test('createLanguageApi wires words + entries', () => {
  const words = [
    ...hydrateBase('en', 1, ['CAT', 'RUN']),
    ...hydrateBase('en', 2, ['CARD']),
  ];
  const entries = [
    { id: words[0].id, word: 'CAT', lang: 'en' as const, freqTier: 1 as const, length: 3, pos: 'noun' as const, syllables: ['CAT'], clues: [{ type: 'definition' as const, difficulty: 2 as const, text: 'A feline' }] },
  ];
  const api = createLanguageApi(words, entries);
  expect(api.wordCount()).toBe(3);
  expect(api.entryCount()).toBe(1);
  expect(api.getTiers()).toEqual([1, 2]);
  expect(api.getLengths()).toEqual([3]);
  expect(api.getWordById(words[0].id)?.word).toBe('CAT');
  expect(api.getEntryById(words[0].id)?.pos).toBe('noun');
  expect(api.getWords({ cluable: true }).map((w) => w.word)).toEqual(['CAT']);
  expect(api.getWords({ pattern: 'CA??' }).map((w) => w.word)).toEqual(['CARD']);
  const fill = api.createFill({ seed: 1 });
  expect(fill.candidates('???').map((w) => w.word).sort()).toEqual(['CAT', 'RUN']);
});
