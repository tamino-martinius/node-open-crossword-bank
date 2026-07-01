import type { FreqTier, Lang, WordEntry } from '../types.js';
import { makeId } from './ids.js';

/** Turn raw base word strings into WordEntry objects for a given lang + tier. */
export function hydrateBase(
  lang: Lang,
  tier: FreqTier,
  words: readonly string[],
): WordEntry[] {
  return words.map((word) => ({
    id: makeId(lang, word),
    word,
    lang,
    freqTier: tier,
  }));
}
