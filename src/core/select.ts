import type {
  WordEntry,
  EnrichedEntry,
  WordQuery,
  EntryQuery,
  FreqTier,
} from '../types.js';
import { mulberry32, shuffle } from './rng.js';
import { matchesPattern } from './pattern.js';

/** Seeded order; `seed` omitted → fresh random each call, given → deterministic. */
export function orderBySeed<T>(items: readonly T[], seed?: number): T[] {
  const rng = seed === undefined ? Math.random : mulberry32(seed);
  return shuffle(items, rng);
}

function tierSet(tier?: FreqTier | FreqTier[]): Set<FreqTier> | undefined {
  if (tier === undefined) return undefined;
  return new Set(Array.isArray(tier) ? tier : [tier]);
}

export function filterWords(
  words: readonly WordEntry[],
  query: WordQuery,
  cluableIds?: ReadonlySet<string>,
): WordEntry[] {
  const length = query.pattern ? query.pattern.length : query.length;
  const tiers = tierSet(query.tier);
  const exclude = query.excludeIds ? new Set(query.excludeIds) : undefined;
  return words.filter((w) => {
    if (length !== undefined && w.word.length !== length) return false;
    if (query.pattern && !matchesPattern(w.word, query.pattern)) return false;
    if (tiers && !tiers.has(w.freqTier)) return false;
    if (query.cluable && !cluableIds?.has(w.id)) return false;
    if (exclude?.has(w.id)) return false;
    return true;
  });
}

export function selectWords(
  words: readonly WordEntry[],
  query: WordQuery,
  cluableIds?: ReadonlySet<string>,
): WordEntry[] {
  const ordered = orderBySeed(
    filterWords(words, query, cluableIds),
    query.seed,
  );
  return query.count === undefined ? ordered : ordered.slice(0, query.count);
}

export function filterEntries(
  entries: readonly EnrichedEntry[],
  query: EntryQuery,
): EnrichedEntry[] {
  // Reuse the word-level filters (EnrichedEntry extends WordEntry); `cluable` is a no-op here.
  const base = filterWords(entries, {
    ...query,
    cluable: false,
  }) as EnrichedEntry[];
  return base.filter((e) => {
    if (query.pos && e.pos !== query.pos) return false;
    if (query.clueType && !e.clues.some((c) => c.type === query.clueType))
      return false;
    const maxDiff = query.maxClueDifficulty;
    if (
      maxDiff !== undefined &&
      !e.clues.some((c) => c.difficulty <= maxDiff)
    ) {
      return false;
    }
    return true;
  });
}

export function selectEntries(
  entries: readonly EnrichedEntry[],
  query: EntryQuery,
): EnrichedEntry[] {
  const ordered = orderBySeed(filterEntries(entries, query), query.seed);
  return query.count === undefined ? ordered : ordered.slice(0, query.count);
}
