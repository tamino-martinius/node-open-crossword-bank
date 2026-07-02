import { TIERS, LENGTHS } from './manifest.js';
import { BASE_LOADERS, ENRICHED_LOADERS } from './loaders.js';

test('BASE_LOADERS has a working loader for every manifest tier', async () => {
  for (const lang of ['en', 'de'] as const) {
    for (const tier of TIERS[lang]) {
      const mod = await BASE_LOADERS[lang][tier]();
      expect(mod.WORDS.length).toBeGreaterThan(0);
    }
  }
});

test('ENRICHED_LOADERS has a working loader for every manifest length', async () => {
  for (const lang of ['en', 'de'] as const) {
    for (const len of LENGTHS[lang]) {
      const mod = await ENRICHED_LOADERS[lang][len]();
      expect(mod.ENTRIES.length).toBeGreaterThan(0);
    }
  }
});
