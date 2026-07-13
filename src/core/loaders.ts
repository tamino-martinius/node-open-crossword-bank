import type { EnrichedEntry, FreqTier, Lang } from '../types.js';

type BaseModule = { WORDS: readonly string[] };
type EnrichedModule = { ENTRIES: readonly EnrichedEntry[] };

type BaseGrid = Record<
  Lang,
  Record<number, Record<FreqTier, () => Promise<BaseModule>>>
>;
type EnrichedGrid = Record<
  Lang,
  Record<number, Record<number, () => Promise<EnrichedModule>>>
>;

/** Two-axis len×tier import() map; every path is a literal so bundlers can code-split. */
export const BASE_LOADERS: BaseGrid = {
  en: {
    3: {
      1: () => import('../data/en/base/len-3/tier-1.js'),
      2: () => import('../data/en/base/len-3/tier-2.js'),
      3: () => import('../data/en/base/len-3/tier-3.js'),
      4: () => import('../data/en/base/len-3/tier-4.js'),
      5: () => import('../data/en/base/len-3/tier-5.js'),
    },
    4: {
      1: () => import('../data/en/base/len-4/tier-1.js'),
      2: () => import('../data/en/base/len-4/tier-2.js'),
      3: () => import('../data/en/base/len-4/tier-3.js'),
      4: () => import('../data/en/base/len-4/tier-4.js'),
      5: () => import('../data/en/base/len-4/tier-5.js'),
    },
    5: {
      1: () => import('../data/en/base/len-5/tier-1.js'),
      2: () => import('../data/en/base/len-5/tier-2.js'),
      3: () => import('../data/en/base/len-5/tier-3.js'),
      4: () => import('../data/en/base/len-5/tier-4.js'),
      5: () => import('../data/en/base/len-5/tier-5.js'),
    },
    6: {
      1: () => import('../data/en/base/len-6/tier-1.js'),
      2: () => import('../data/en/base/len-6/tier-2.js'),
      3: () => import('../data/en/base/len-6/tier-3.js'),
      4: () => import('../data/en/base/len-6/tier-4.js'),
      5: () => import('../data/en/base/len-6/tier-5.js'),
    },
    7: {
      1: () => import('../data/en/base/len-7/tier-1.js'),
      2: () => import('../data/en/base/len-7/tier-2.js'),
      3: () => import('../data/en/base/len-7/tier-3.js'),
      4: () => import('../data/en/base/len-7/tier-4.js'),
      5: () => import('../data/en/base/len-7/tier-5.js'),
    },
    8: {
      1: () => import('../data/en/base/len-8/tier-1.js'),
      2: () => import('../data/en/base/len-8/tier-2.js'),
      3: () => import('../data/en/base/len-8/tier-3.js'),
      4: () => import('../data/en/base/len-8/tier-4.js'),
      5: () => import('../data/en/base/len-8/tier-5.js'),
    },
    9: {
      1: () => import('../data/en/base/len-9/tier-1.js'),
      2: () => import('../data/en/base/len-9/tier-2.js'),
      3: () => import('../data/en/base/len-9/tier-3.js'),
      4: () => import('../data/en/base/len-9/tier-4.js'),
      5: () => import('../data/en/base/len-9/tier-5.js'),
    },
    10: {
      1: () => import('../data/en/base/len-10/tier-1.js'),
      2: () => import('../data/en/base/len-10/tier-2.js'),
      3: () => import('../data/en/base/len-10/tier-3.js'),
      4: () => import('../data/en/base/len-10/tier-4.js'),
      5: () => import('../data/en/base/len-10/tier-5.js'),
    },
    11: {
      1: () => import('../data/en/base/len-11/tier-1.js'),
      2: () => import('../data/en/base/len-11/tier-2.js'),
      3: () => import('../data/en/base/len-11/tier-3.js'),
      4: () => import('../data/en/base/len-11/tier-4.js'),
      5: () => import('../data/en/base/len-11/tier-5.js'),
    },
    12: {
      1: () => import('../data/en/base/len-12/tier-1.js'),
      2: () => import('../data/en/base/len-12/tier-2.js'),
      3: () => import('../data/en/base/len-12/tier-3.js'),
      4: () => import('../data/en/base/len-12/tier-4.js'),
      5: () => import('../data/en/base/len-12/tier-5.js'),
    },
    13: {
      1: () => import('../data/en/base/len-13/tier-1.js'),
      2: () => import('../data/en/base/len-13/tier-2.js'),
      3: () => import('../data/en/base/len-13/tier-3.js'),
      4: () => import('../data/en/base/len-13/tier-4.js'),
      5: () => import('../data/en/base/len-13/tier-5.js'),
    },
    14: {
      1: () => import('../data/en/base/len-14/tier-1.js'),
      2: () => import('../data/en/base/len-14/tier-2.js'),
      3: () => import('../data/en/base/len-14/tier-3.js'),
      4: () => import('../data/en/base/len-14/tier-4.js'),
      5: () => import('../data/en/base/len-14/tier-5.js'),
    },
    15: {
      1: () => import('../data/en/base/len-15/tier-1.js'),
      2: () => import('../data/en/base/len-15/tier-2.js'),
      3: () => import('../data/en/base/len-15/tier-3.js'),
      4: () => import('../data/en/base/len-15/tier-4.js'),
      5: () => import('../data/en/base/len-15/tier-5.js'),
    },
  },
  de: {
    3: {
      1: () => import('../data/de/base/len-3/tier-1.js'),
      2: () => import('../data/de/base/len-3/tier-2.js'),
      3: () => import('../data/de/base/len-3/tier-3.js'),
      4: () => import('../data/de/base/len-3/tier-4.js'),
      5: () => import('../data/de/base/len-3/tier-5.js'),
    },
    4: {
      1: () => import('../data/de/base/len-4/tier-1.js'),
      2: () => import('../data/de/base/len-4/tier-2.js'),
      3: () => import('../data/de/base/len-4/tier-3.js'),
      4: () => import('../data/de/base/len-4/tier-4.js'),
      5: () => import('../data/de/base/len-4/tier-5.js'),
    },
    5: {
      1: () => import('../data/de/base/len-5/tier-1.js'),
      2: () => import('../data/de/base/len-5/tier-2.js'),
      3: () => import('../data/de/base/len-5/tier-3.js'),
      4: () => import('../data/de/base/len-5/tier-4.js'),
      5: () => import('../data/de/base/len-5/tier-5.js'),
    },
    6: {
      1: () => import('../data/de/base/len-6/tier-1.js'),
      2: () => import('../data/de/base/len-6/tier-2.js'),
      3: () => import('../data/de/base/len-6/tier-3.js'),
      4: () => import('../data/de/base/len-6/tier-4.js'),
      5: () => import('../data/de/base/len-6/tier-5.js'),
    },
    7: {
      1: () => import('../data/de/base/len-7/tier-1.js'),
      2: () => import('../data/de/base/len-7/tier-2.js'),
      3: () => import('../data/de/base/len-7/tier-3.js'),
      4: () => import('../data/de/base/len-7/tier-4.js'),
      5: () => import('../data/de/base/len-7/tier-5.js'),
    },
    8: {
      1: () => import('../data/de/base/len-8/tier-1.js'),
      2: () => import('../data/de/base/len-8/tier-2.js'),
      3: () => import('../data/de/base/len-8/tier-3.js'),
      4: () => import('../data/de/base/len-8/tier-4.js'),
      5: () => import('../data/de/base/len-8/tier-5.js'),
    },
    9: {
      1: () => import('../data/de/base/len-9/tier-1.js'),
      2: () => import('../data/de/base/len-9/tier-2.js'),
      3: () => import('../data/de/base/len-9/tier-3.js'),
      4: () => import('../data/de/base/len-9/tier-4.js'),
      5: () => import('../data/de/base/len-9/tier-5.js'),
    },
    10: {
      1: () => import('../data/de/base/len-10/tier-1.js'),
      2: () => import('../data/de/base/len-10/tier-2.js'),
      3: () => import('../data/de/base/len-10/tier-3.js'),
      4: () => import('../data/de/base/len-10/tier-4.js'),
      5: () => import('../data/de/base/len-10/tier-5.js'),
    },
    11: {
      1: () => import('../data/de/base/len-11/tier-1.js'),
      2: () => import('../data/de/base/len-11/tier-2.js'),
      3: () => import('../data/de/base/len-11/tier-3.js'),
      4: () => import('../data/de/base/len-11/tier-4.js'),
      5: () => import('../data/de/base/len-11/tier-5.js'),
    },
    12: {
      1: () => import('../data/de/base/len-12/tier-1.js'),
      2: () => import('../data/de/base/len-12/tier-2.js'),
      3: () => import('../data/de/base/len-12/tier-3.js'),
      4: () => import('../data/de/base/len-12/tier-4.js'),
      5: () => import('../data/de/base/len-12/tier-5.js'),
    },
    13: {
      1: () => import('../data/de/base/len-13/tier-1.js'),
      2: () => import('../data/de/base/len-13/tier-2.js'),
      3: () => import('../data/de/base/len-13/tier-3.js'),
      4: () => import('../data/de/base/len-13/tier-4.js'),
      5: () => import('../data/de/base/len-13/tier-5.js'),
    },
    14: {
      1: () => import('../data/de/base/len-14/tier-1.js'),
      2: () => import('../data/de/base/len-14/tier-2.js'),
      3: () => import('../data/de/base/len-14/tier-3.js'),
      4: () => import('../data/de/base/len-14/tier-4.js'),
      5: () => import('../data/de/base/len-14/tier-5.js'),
    },
    15: {
      1: () => import('../data/de/base/len-15/tier-1.js'),
      2: () => import('../data/de/base/len-15/tier-2.js'),
      3: () => import('../data/de/base/len-15/tier-3.js'),
      4: () => import('../data/de/base/len-15/tier-4.js'),
      5: () => import('../data/de/base/len-15/tier-5.js'),
    },
  },
} as BaseGrid;

/** Two-axis len×tier import() map; every path is a literal so bundlers can code-split. */
export const ENRICHED_LOADERS: EnrichedGrid = {
  en: {
    3: {
      1: () => import('../data/en/enriched/len-3/tier-1.js'),
      2: () => import('../data/en/enriched/len-3/tier-2.js'),
    },
    4: {
      1: () => import('../data/en/enriched/len-4/tier-1.js'),
    },
    5: {
      1: () => import('../data/en/enriched/len-5/tier-1.js'),
    },
    6: {
      1: () => import('../data/en/enriched/len-6/tier-1.js'),
    },
    7: {
      1: () => import('../data/en/enriched/len-7/tier-1.js'),
    },
    8: {
      1: () => import('../data/en/enriched/len-8/tier-1.js'),
    },
    9: {
      1: () => import('../data/en/enriched/len-9/tier-1.js'),
      2: () => import('../data/en/enriched/len-9/tier-2.js'),
    },
    10: {
      1: () => import('../data/en/enriched/len-10/tier-1.js'),
      2: () => import('../data/en/enriched/len-10/tier-2.js'),
    },
    11: {
      1: () => import('../data/en/enriched/len-11/tier-1.js'),
      2: () => import('../data/en/enriched/len-11/tier-2.js'),
    },
    12: {
      1: () => import('../data/en/enriched/len-12/tier-1.js'),
      2: () => import('../data/en/enriched/len-12/tier-2.js'),
    },
    13: {
      1: () => import('../data/en/enriched/len-13/tier-1.js'),
      2: () => import('../data/en/enriched/len-13/tier-2.js'),
    },
    14: {
      1: () => import('../data/en/enriched/len-14/tier-1.js'),
      2: () => import('../data/en/enriched/len-14/tier-2.js'),
    },
    15: {
      1: () => import('../data/en/enriched/len-15/tier-1.js'),
      2: () => import('../data/en/enriched/len-15/tier-2.js'),
    },
  },
  de: {
    3: {
      1: () => import('../data/de/enriched/len-3/tier-1.js'),
    },
    4: {
      1: () => import('../data/de/enriched/len-4/tier-1.js'),
    },
    5: {
      1: () => import('../data/de/enriched/len-5/tier-1.js'),
    },
    6: {
      1: () => import('../data/de/enriched/len-6/tier-1.js'),
    },
    7: {
      1: () => import('../data/de/enriched/len-7/tier-1.js'),
    },
    8: {
      1: () => import('../data/de/enriched/len-8/tier-1.js'),
    },
    9: {
      1: () => import('../data/de/enriched/len-9/tier-1.js'),
      2: () => import('../data/de/enriched/len-9/tier-2.js'),
    },
    10: {
      1: () => import('../data/de/enriched/len-10/tier-1.js'),
      2: () => import('../data/de/enriched/len-10/tier-2.js'),
    },
    11: {
      1: () => import('../data/de/enriched/len-11/tier-1.js'),
      2: () => import('../data/de/enriched/len-11/tier-2.js'),
    },
    12: {
      1: () => import('../data/de/enriched/len-12/tier-1.js'),
      2: () => import('../data/de/enriched/len-12/tier-2.js'),
    },
    13: {
      1: () => import('../data/de/enriched/len-13/tier-1.js'),
      2: () => import('../data/de/enriched/len-13/tier-2.js'),
    },
    14: {
      1: () => import('../data/de/enriched/len-14/tier-1.js'),
      2: () => import('../data/de/enriched/len-14/tier-2.js'),
    },
    15: {
      1: () => import('../data/de/enriched/len-15/tier-1.js'),
      2: () => import('../data/de/enriched/len-15/tier-2.js'),
    },
  },
};
