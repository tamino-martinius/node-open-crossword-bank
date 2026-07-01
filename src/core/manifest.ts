import type { Lang, FreqTier } from '../types.js';

export const TIERS: Record<Lang, readonly FreqTier[]> = {
  en: [1, 2, 3, 4, 5],
  de: [1, 2, 3, 4, 5],
} as Record<Lang, readonly FreqTier[]>;

export const LENGTHS: Record<Lang, readonly number[]> = {
  en: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  de: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
};

export const BASE_COUNTS: Record<Lang, Readonly<Record<number, number>>> = {
  en: {
    '1': 6000,
    '2': 6000,
    '3': 6000,
    '4': 6000,
    '5': 6000,
  },
  de: {
    '1': 6000,
    '2': 6000,
    '3': 6000,
    '4': 6000,
    '5': 6000,
  },
};

export const ENRICHED_COUNTS: Record<Lang, Readonly<Record<number, number>>> = {
  en: {
    '3': 327,
    '4': 705,
    '5': 855,
    '6': 928,
    '7': 953,
    '8': 824,
    '9': 662,
    '10': 461,
    '11': 272,
    '12': 154,
    '13': 82,
    '14': 34,
    '15': 12,
  },
  de: {
    '3': 247,
    '4': 517,
    '5': 719,
    '6': 886,
    '7': 744,
    '8': 741,
    '9': 702,
    '10': 604,
    '11': 483,
    '12': 322,
    '13': 204,
    '14': 133,
    '15': 81,
  },
};
