/** Words from a `export const WORDS = [...]` leaf, in file order. Handles "..." or '...'. */
export function parseWords(tsSource) {
  const body = tsSource.slice(tsSource.indexOf('['));
  return [...body.matchAll(/["']([^"']+)["']/g)].map((m) => m[1]);
}

/** 0-based rank → 1..5 tier for a given band width; caps at 5, floors at 1. */
export function freqTierForRank(rank0, band) {
  const t = Math.floor(rank0 / band) + 1;
  return t < 1 ? 1 : t > 5 ? 5 : t;
}

/** Copy of `entry` with freqTier recomputed from its word's rank in the new base. */
export function retierEntry(entry, rankMap, band) {
  const rank = rankMap.get(entry.word);
  if (rank === undefined) throw new Error(`enriched word not in base: ${entry.word}`);
  return { ...entry, freqTier: freqTierForRank(rank, band) };
}

/** Parse arcade's enriched-full-<lang>.json (array of EnrichedEntry). Throws if malformed. */
export function readEnrichedFull(jsonText) {
  const data = JSON.parse(jsonText);
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('readEnrichedFull: expected a non-empty array of entries');
  }
  return data;
}
