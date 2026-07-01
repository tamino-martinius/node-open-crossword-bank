import type { EnrichedEntry, FreqTier } from '../../types.js';
import { WORDS as t1 } from './base/tier-1.js';
import { WORDS as t2 } from './base/tier-2.js';
import { WORDS as t3 } from './base/tier-3.js';
import { WORDS as t4 } from './base/tier-4.js';
import { WORDS as t5 } from './base/tier-5.js';
import { ENTRIES as l3 } from './enriched/len-3.js';
import { ENTRIES as l4 } from './enriched/len-4.js';
import { ENTRIES as l5 } from './enriched/len-5.js';
import { ENTRIES as l6 } from './enriched/len-6.js';
import { ENTRIES as l7 } from './enriched/len-7.js';
import { ENTRIES as l8 } from './enriched/len-8.js';
import { ENTRIES as l9 } from './enriched/len-9.js';
import { ENTRIES as l10 } from './enriched/len-10.js';
import { ENTRIES as l11 } from './enriched/len-11.js';
import { ENTRIES as l12 } from './enriched/len-12.js';
import { ENTRIES as l13 } from './enriched/len-13.js';
import { ENTRIES as l14 } from './enriched/len-14.js';
import { ENTRIES as l15 } from './enriched/len-15.js';

export const BASE: readonly { tier: FreqTier; words: readonly string[] }[] = [
  { tier: 1, words: t1 },
  { tier: 2, words: t2 },
  { tier: 3, words: t3 },
  { tier: 4, words: t4 },
  { tier: 5, words: t5 },
];
export const ENTRIES: readonly EnrichedEntry[] = [
  ...l3,
  ...l4,
  ...l5,
  ...l6,
  ...l7,
  ...l8,
  ...l9,
  ...l10,
  ...l11,
  ...l12,
  ...l13,
  ...l14,
  ...l15,
];
