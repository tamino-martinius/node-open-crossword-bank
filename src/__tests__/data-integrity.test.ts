import { BASE as EN_BASE, ENTRIES as EN_ENTRIES } from '../data/en/index.js';
import { BASE as DE_BASE, ENTRIES as DE_ENTRIES } from '../data/de/index.js';
import { hydrateBase } from '../core/hydrate.js';
import { makeId } from '../core/ids.js';
import { BASE_COUNTS, ENRICHED_COUNTS } from '../core/manifest.js';
import type { Lang } from '../types.js';

const LANGS: {
  lang: Lang;
  base: typeof EN_BASE;
  entries: typeof EN_ENTRIES;
  baseCounts: Record<number, number>;
  enrCounts: Record<number, number>;
}[] = [
  {
    lang: 'en',
    base: EN_BASE,
    entries: EN_ENTRIES,
    baseCounts: BASE_COUNTS.en,
    enrCounts: ENRICHED_COUNTS.en,
  },
  {
    lang: 'de',
    base: DE_BASE,
    entries: DE_ENTRIES,
    baseCounts: BASE_COUNTS.de,
    enrCounts: ENRICHED_COUNTS.de,
  },
];

describe.each(LANGS)('$lang data integrity', ({
  lang,
  base,
  entries,
  baseCounts,
  enrCounts,
}) => {
  const words = base.flatMap((b) => hydrateBase(lang, b.tier, b.words));
  const wordSet = new Set(words.map((w) => w.word));

  test('base ids unique, words UPPERCASE length 3–15', () => {
    const ids = new Set<string>();
    for (const w of words) {
      expect(w.word).toBe(w.word.toUpperCase());
      expect(w.word.length).toBeGreaterThanOrEqual(3);
      expect(w.word.length).toBeLessThanOrEqual(15);
      expect(ids.has(w.id)).toBe(false);
      ids.add(w.id);
    }
  });

  test('manifest base counts match leaf contents', () => {
    // BASE has one element per (len,tier) leaf, so multiple elements can
    // share a tier; aggregate word counts per tier before comparing against
    // the manifest's per-tier totals.
    const wordsByTier = new Map<number, number>();
    for (const b of base) {
      wordsByTier.set(b.tier, (wordsByTier.get(b.tier) ?? 0) + b.words.length);
    }
    for (const [tier, count] of wordsByTier)
      expect(count).toBe(baseCounts[tier]);
    expect([...wordsByTier.keys()].sort((a, b) => a - b)).toEqual(
      Object.keys(baseCounts)
        .map(Number)
        .sort((a, b) => a - b),
    );
  });

  test('enriched: id/length/syllables consistent, ⊆ base, valid clue count', () => {
    const byLen = new Map<number, number>();
    for (const e of entries) {
      expect(e.id).toBe(makeId(lang, e.word));
      expect(e.length).toBe(e.word.length);
      expect(e.syllables.join('')).toBe(e.word);
      expect(wordSet.has(e.word)).toBe(true); // enriched ⊆ base
      expect(e.clues.length).toBeGreaterThanOrEqual(1);
      expect(e.clues.length).toBeLessThanOrEqual(3);
      byLen.set(e.length, (byLen.get(e.length) ?? 0) + 1);
    }
    for (const [len, n] of byLen) expect(n).toBe(enrCounts[len]);
    for (const [len, n] of Object.entries(enrCounts))
      expect(byLen.get(Number(len))).toBe(n);
  });
});

test('enriched freqTier equals the base leaf tier holding that word', () => {
  const tierOf = new Map<string, number>();
  for (const { tier, words } of EN_BASE)
    for (const w of words) tierOf.set(w, tier);
  for (const e of EN_ENTRIES) expect(e.freqTier).toBe(tierOf.get(e.word));
});
