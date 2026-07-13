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
    '1': 18000,
    '2': 18000,
    '3': 18000,
    '4': 18000,
    '5': 18000,
  },
  de: {
    '1': 18000,
    '2': 18000,
    '3': 18000,
    '4': 18000,
    '5': 18000,
  },
};

export const ENRICHED_COUNTS: Record<Lang, Readonly<Record<number, number>>> = {
  en: {
    '3': 1167,
    '4': 1555,
    '5': 2165,
    '6': 2678,
    '7': 2737,
    '8': 2416,
    '9': 1928,
    '10': 1410,
    '11': 888,
    '12': 534,
    '13': 305,
    '14': 141,
    '15': 73,
  },
  de: {
    '3': 633,
    '4': 938,
    '5': 1425,
    '6': 1816,
    '7': 1921,
    '8': 2038,
    '9': 2087,
    '10': 1985,
    '11': 1719,
    '12': 1312,
    '13': 961,
    '14': 658,
    '15': 446,
  },
};
