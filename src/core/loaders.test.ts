import { TIERS, LENGTHS } from './manifest.js';
import { BASE_LOADERS, ENRICHED_LOADERS } from './loaders.js';

test('BASE_LOADERS resolves every present len×tier leaf', async () => {
  for (const lang of ['en', 'de'] as const) {
    for (const len of LENGTHS[lang]) {
      const byTier = BASE_LOADERS[lang][len];
      if (!byTier) continue;
      for (const tier of TIERS[lang]) {
        if (!byTier[tier]) continue;
        const mod = await byTier[tier]();
        expect(mod.WORDS.every((w) => w.length === len)).toBe(true);
      }
    }
  }
});

test('ENRICHED_LOADERS resolves present len×tier leaves with matching length', async () => {
  for (const lang of ['en', 'de'] as const) {
    for (const len of LENGTHS[lang]) {
      const byTier = ENRICHED_LOADERS[lang][len];
      if (!byTier) continue;
      for (const tier of TIERS[lang]) {
        if (!byTier[tier]) continue;
        const mod = await byTier[tier]();
        expect(
          mod.ENTRIES.every((e) => e.length === len && e.freqTier === tier),
        ).toBe(true);
      }
    }
  }
});
