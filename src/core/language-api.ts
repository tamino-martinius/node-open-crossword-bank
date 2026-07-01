import type {
  WordEntry, EnrichedEntry, WordQuery, EntryQuery, FreqTier, Fill, FillQuery,
} from '../types.js';
import { selectWords, selectEntries, filterWords } from './select.js';
import { createFillFromPool } from './fill.js';

export { hydrateBase } from './hydrate.js';

export interface LanguageApi {
  getWords(query?: WordQuery): WordEntry[];
  getEntries(query?: EntryQuery): EnrichedEntry[];
  getWordById(id: string): WordEntry | undefined;
  getEntryById(id: string): EnrichedEntry | undefined;
  getTiers(): FreqTier[];
  getLengths(): number[];
  wordCount(): number;
  entryCount(): number;
  createFill(query?: FillQuery): Fill;
}

/** Build the synchronous single-language API over in-memory word + entry pools. */
export function createLanguageApi(
  words: readonly WordEntry[],
  entries: readonly EnrichedEntry[],
): LanguageApi {
  const cluableIds = new Set(entries.map((e) => e.id));
  const tiers = [...new Set(words.map((w) => w.freqTier))].sort((a, b) => a - b) as FreqTier[];
  const lengths = [...new Set(entries.map((e) => e.length))].sort((a, b) => a - b);

  return {
    getWords: (query = {}) => selectWords(words, query, cluableIds),
    getEntries: (query = {}) => selectEntries(entries, query),
    getWordById: (id) => words.find((w) => w.id === id),
    getEntryById: (id) => entries.find((e) => e.id === id),
    getTiers: () => [...tiers],
    getLengths: () => [...lengths],
    wordCount: () => words.length,
    entryCount: () => entries.length,
    createFill: (query = {}) => {
      const base = query.cluable ? words.filter((w) => cluableIds.has(w.id)) : words;
      const pool = filterWords(base, { tier: query.tier });
      return createFillFromPool(pool, query.seed);
    },
  };
}
