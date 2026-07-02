import type { EnrichedEntry, FreqTier, Lang } from '../types.js';

type BaseModule = { WORDS: readonly string[] };
type EnrichedModule = { ENTRIES: readonly EnrichedEntry[] };

/** One literal-path import() per tier — required so bundlers can code-split; see build-manifest.mjs. */
export const BASE_LOADERS: Record<
  Lang,
  Record<FreqTier, () => Promise<BaseModule>>
> = {
  en: {
    1: () => import('../data/en/base/tier-1.js'),
    2: () => import('../data/en/base/tier-2.js'),
    3: () => import('../data/en/base/tier-3.js'),
    4: () => import('../data/en/base/tier-4.js'),
    5: () => import('../data/en/base/tier-5.js'),
  },
  de: {
    1: () => import('../data/de/base/tier-1.js'),
    2: () => import('../data/de/base/tier-2.js'),
    3: () => import('../data/de/base/tier-3.js'),
    4: () => import('../data/de/base/tier-4.js'),
    5: () => import('../data/de/base/tier-5.js'),
  },
} as Record<Lang, Record<FreqTier, () => Promise<BaseModule>>>;

/** One literal-path import() per length — required so bundlers can code-split; see build-manifest.mjs. */
export const ENRICHED_LOADERS: Record<
  Lang,
  Record<number, () => Promise<EnrichedModule>>
> = {
  en: {
    3: () => import('../data/en/enriched/len-3.js'),
    4: () => import('../data/en/enriched/len-4.js'),
    5: () => import('../data/en/enriched/len-5.js'),
    6: () => import('../data/en/enriched/len-6.js'),
    7: () => import('../data/en/enriched/len-7.js'),
    8: () => import('../data/en/enriched/len-8.js'),
    9: () => import('../data/en/enriched/len-9.js'),
    10: () => import('../data/en/enriched/len-10.js'),
    11: () => import('../data/en/enriched/len-11.js'),
    12: () => import('../data/en/enriched/len-12.js'),
    13: () => import('../data/en/enriched/len-13.js'),
    14: () => import('../data/en/enriched/len-14.js'),
    15: () => import('../data/en/enriched/len-15.js'),
  },
  de: {
    3: () => import('../data/de/enriched/len-3.js'),
    4: () => import('../data/de/enriched/len-4.js'),
    5: () => import('../data/de/enriched/len-5.js'),
    6: () => import('../data/de/enriched/len-6.js'),
    7: () => import('../data/de/enriched/len-7.js'),
    8: () => import('../data/de/enriched/len-8.js'),
    9: () => import('../data/de/enriched/len-9.js'),
    10: () => import('../data/de/enriched/len-10.js'),
    11: () => import('../data/de/enriched/len-11.js'),
    12: () => import('../data/de/enriched/len-12.js'),
    13: () => import('../data/de/enriched/len-13.js'),
    14: () => import('../data/de/enriched/len-14.js'),
    15: () => import('../data/de/enriched/len-15.js'),
  },
};
