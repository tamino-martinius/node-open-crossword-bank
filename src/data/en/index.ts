import type { EnrichedEntry, FreqTier } from '../../types.js';
import { WORDS as b_3_1 } from './base/len-3/tier-1.js';
import { WORDS as b_3_2 } from './base/len-3/tier-2.js';
import { WORDS as b_3_3 } from './base/len-3/tier-3.js';
import { WORDS as b_3_4 } from './base/len-3/tier-4.js';
import { WORDS as b_3_5 } from './base/len-3/tier-5.js';
import { WORDS as b_4_1 } from './base/len-4/tier-1.js';
import { WORDS as b_4_2 } from './base/len-4/tier-2.js';
import { WORDS as b_4_3 } from './base/len-4/tier-3.js';
import { WORDS as b_4_4 } from './base/len-4/tier-4.js';
import { WORDS as b_4_5 } from './base/len-4/tier-5.js';
import { WORDS as b_5_1 } from './base/len-5/tier-1.js';
import { WORDS as b_5_2 } from './base/len-5/tier-2.js';
import { WORDS as b_5_3 } from './base/len-5/tier-3.js';
import { WORDS as b_5_4 } from './base/len-5/tier-4.js';
import { WORDS as b_5_5 } from './base/len-5/tier-5.js';
import { WORDS as b_6_1 } from './base/len-6/tier-1.js';
import { WORDS as b_6_2 } from './base/len-6/tier-2.js';
import { WORDS as b_6_3 } from './base/len-6/tier-3.js';
import { WORDS as b_6_4 } from './base/len-6/tier-4.js';
import { WORDS as b_6_5 } from './base/len-6/tier-5.js';
import { WORDS as b_7_1 } from './base/len-7/tier-1.js';
import { WORDS as b_7_2 } from './base/len-7/tier-2.js';
import { WORDS as b_7_3 } from './base/len-7/tier-3.js';
import { WORDS as b_7_4 } from './base/len-7/tier-4.js';
import { WORDS as b_7_5 } from './base/len-7/tier-5.js';
import { WORDS as b_8_1 } from './base/len-8/tier-1.js';
import { WORDS as b_8_2 } from './base/len-8/tier-2.js';
import { WORDS as b_8_3 } from './base/len-8/tier-3.js';
import { WORDS as b_8_4 } from './base/len-8/tier-4.js';
import { WORDS as b_8_5 } from './base/len-8/tier-5.js';
import { WORDS as b_9_1 } from './base/len-9/tier-1.js';
import { WORDS as b_9_2 } from './base/len-9/tier-2.js';
import { WORDS as b_9_3 } from './base/len-9/tier-3.js';
import { WORDS as b_9_4 } from './base/len-9/tier-4.js';
import { WORDS as b_9_5 } from './base/len-9/tier-5.js';
import { WORDS as b_10_1 } from './base/len-10/tier-1.js';
import { WORDS as b_10_2 } from './base/len-10/tier-2.js';
import { WORDS as b_10_3 } from './base/len-10/tier-3.js';
import { WORDS as b_10_4 } from './base/len-10/tier-4.js';
import { WORDS as b_10_5 } from './base/len-10/tier-5.js';
import { WORDS as b_11_1 } from './base/len-11/tier-1.js';
import { WORDS as b_11_2 } from './base/len-11/tier-2.js';
import { WORDS as b_11_3 } from './base/len-11/tier-3.js';
import { WORDS as b_11_4 } from './base/len-11/tier-4.js';
import { WORDS as b_11_5 } from './base/len-11/tier-5.js';
import { WORDS as b_12_1 } from './base/len-12/tier-1.js';
import { WORDS as b_12_2 } from './base/len-12/tier-2.js';
import { WORDS as b_12_3 } from './base/len-12/tier-3.js';
import { WORDS as b_12_4 } from './base/len-12/tier-4.js';
import { WORDS as b_12_5 } from './base/len-12/tier-5.js';
import { WORDS as b_13_1 } from './base/len-13/tier-1.js';
import { WORDS as b_13_2 } from './base/len-13/tier-2.js';
import { WORDS as b_13_3 } from './base/len-13/tier-3.js';
import { WORDS as b_13_4 } from './base/len-13/tier-4.js';
import { WORDS as b_13_5 } from './base/len-13/tier-5.js';
import { WORDS as b_14_1 } from './base/len-14/tier-1.js';
import { WORDS as b_14_2 } from './base/len-14/tier-2.js';
import { WORDS as b_14_3 } from './base/len-14/tier-3.js';
import { WORDS as b_14_4 } from './base/len-14/tier-4.js';
import { WORDS as b_14_5 } from './base/len-14/tier-5.js';
import { WORDS as b_15_1 } from './base/len-15/tier-1.js';
import { WORDS as b_15_2 } from './base/len-15/tier-2.js';
import { WORDS as b_15_3 } from './base/len-15/tier-3.js';
import { WORDS as b_15_4 } from './base/len-15/tier-4.js';
import { WORDS as b_15_5 } from './base/len-15/tier-5.js';
import { ENTRIES as e_3_1 } from './enriched/len-3/tier-1.js';
import { ENTRIES as e_4_1 } from './enriched/len-4/tier-1.js';
import { ENTRIES as e_5_1 } from './enriched/len-5/tier-1.js';
import { ENTRIES as e_6_1 } from './enriched/len-6/tier-1.js';
import { ENTRIES as e_7_1 } from './enriched/len-7/tier-1.js';
import { ENTRIES as e_8_1 } from './enriched/len-8/tier-1.js';
import { ENTRIES as e_9_1 } from './enriched/len-9/tier-1.js';
import { ENTRIES as e_10_1 } from './enriched/len-10/tier-1.js';
import { ENTRIES as e_11_1 } from './enriched/len-11/tier-1.js';
import { ENTRIES as e_12_1 } from './enriched/len-12/tier-1.js';
import { ENTRIES as e_13_1 } from './enriched/len-13/tier-1.js';
import { ENTRIES as e_14_1 } from './enriched/len-14/tier-1.js';
import { ENTRIES as e_15_1 } from './enriched/len-15/tier-1.js';

export const BASE: readonly { tier: FreqTier; words: readonly string[] }[] = [
  { tier: 1, words: b_3_1 },
  { tier: 2, words: b_3_2 },
  { tier: 3, words: b_3_3 },
  { tier: 4, words: b_3_4 },
  { tier: 5, words: b_3_5 },
  { tier: 1, words: b_4_1 },
  { tier: 2, words: b_4_2 },
  { tier: 3, words: b_4_3 },
  { tier: 4, words: b_4_4 },
  { tier: 5, words: b_4_5 },
  { tier: 1, words: b_5_1 },
  { tier: 2, words: b_5_2 },
  { tier: 3, words: b_5_3 },
  { tier: 4, words: b_5_4 },
  { tier: 5, words: b_5_5 },
  { tier: 1, words: b_6_1 },
  { tier: 2, words: b_6_2 },
  { tier: 3, words: b_6_3 },
  { tier: 4, words: b_6_4 },
  { tier: 5, words: b_6_5 },
  { tier: 1, words: b_7_1 },
  { tier: 2, words: b_7_2 },
  { tier: 3, words: b_7_3 },
  { tier: 4, words: b_7_4 },
  { tier: 5, words: b_7_5 },
  { tier: 1, words: b_8_1 },
  { tier: 2, words: b_8_2 },
  { tier: 3, words: b_8_3 },
  { tier: 4, words: b_8_4 },
  { tier: 5, words: b_8_5 },
  { tier: 1, words: b_9_1 },
  { tier: 2, words: b_9_2 },
  { tier: 3, words: b_9_3 },
  { tier: 4, words: b_9_4 },
  { tier: 5, words: b_9_5 },
  { tier: 1, words: b_10_1 },
  { tier: 2, words: b_10_2 },
  { tier: 3, words: b_10_3 },
  { tier: 4, words: b_10_4 },
  { tier: 5, words: b_10_5 },
  { tier: 1, words: b_11_1 },
  { tier: 2, words: b_11_2 },
  { tier: 3, words: b_11_3 },
  { tier: 4, words: b_11_4 },
  { tier: 5, words: b_11_5 },
  { tier: 1, words: b_12_1 },
  { tier: 2, words: b_12_2 },
  { tier: 3, words: b_12_3 },
  { tier: 4, words: b_12_4 },
  { tier: 5, words: b_12_5 },
  { tier: 1, words: b_13_1 },
  { tier: 2, words: b_13_2 },
  { tier: 3, words: b_13_3 },
  { tier: 4, words: b_13_4 },
  { tier: 5, words: b_13_5 },
  { tier: 1, words: b_14_1 },
  { tier: 2, words: b_14_2 },
  { tier: 3, words: b_14_3 },
  { tier: 4, words: b_14_4 },
  { tier: 5, words: b_14_5 },
  { tier: 1, words: b_15_1 },
  { tier: 2, words: b_15_2 },
  { tier: 3, words: b_15_3 },
  { tier: 4, words: b_15_4 },
  { tier: 5, words: b_15_5 },
];
export const ENTRIES: readonly EnrichedEntry[] = [
  ...e_3_1,
  ...e_4_1,
  ...e_5_1,
  ...e_6_1,
  ...e_7_1,
  ...e_8_1,
  ...e_9_1,
  ...e_10_1,
  ...e_11_1,
  ...e_12_1,
  ...e_13_1,
  ...e_14_1,
  ...e_15_1,
];
