import { BASE_LOADERS } from '../core/loaders.js';
import { TIERS, LENGTHS } from '../core/manifest.js';
import * as main from '../index.js';

function instrument(lang: 'en' | 'de') {
  const touched: Array<[number, number]> = [];
  const orig = BASE_LOADERS[lang];
  const wrapped: typeof orig = {};
  for (const len of LENGTHS[lang]) {
    if (!orig[len]) continue;
    wrapped[len] = {} as (typeof orig)[number];
    for (const tier of TIERS[lang]) {
      if (!orig[len][tier]) continue;
      wrapped[len][tier] = () => {
        touched.push([len, tier]);
        return orig[len][tier]();
      };
    }
  }
  BASE_LOADERS[lang] = wrapped;
  return {
    touched,
    restore: () => {
      BASE_LOADERS[lang] = orig;
    },
  };
}

test('length query loads only that length across tiers', async () => {
  const { touched, restore } = instrument('en');
  try {
    await main.getWords('en', { length: 5, seed: 1 });
    expect(touched.every(([len]) => len === 5)).toBe(true);
    expect(touched.length).toBe(
      TIERS.en.filter((t) => BASE_LOADERS.en[5]?.[t]).length,
    );
  } finally {
    restore();
  }
});

test('length + tier query loads exactly one leaf', async () => {
  const { touched, restore } = instrument('en');
  try {
    await main.getWords('en', { length: 5, tier: 1, seed: 1 });
    expect(touched).toEqual([[5, 1]]);
  } finally {
    restore();
  }
});

test('tier query loads only that tier across lengths', async () => {
  const { touched, restore } = instrument('en');
  try {
    await main.getWords('en', { tier: 2, seed: 1 });
    expect(touched.every(([, tier]) => tier === 2)).toBe(true);
    expect(touched.length).toBe(
      LENGTHS.en.filter((len) => BASE_LOADERS.en[len]?.[2]).length,
    );
  } finally {
    restore();
  }
});
