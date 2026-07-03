import type {
  Lang,
  FreqTier,
  WordEntry,
  EnrichedEntry,
  WordQuery,
  EntryQuery,
  Fill,
  FillQuery,
} from './types.js';
import {
  TIERS,
  LENGTHS,
  BASE_COUNTS,
  ENRICHED_COUNTS,
} from './core/manifest.js';
import { hydrateBase } from './core/hydrate.js';
import { BASE_LOADERS, ENRICHED_LOADERS } from './core/loaders.js';
import { selectWords, selectEntries, filterWords } from './core/select.js';
import { createFillFromPool } from './core/fill.js';

export type {
  Lang,
  FreqTier,
  Difficulty,
  ClueType,
  Pos,
  Clue,
  WordEntry,
  EnrichedEntry,
  WordQuery,
  EntryQuery,
  Fill,
  FillQuery,
} from './types.js';
export { matchesPattern, toPattern, WILDCARD } from './core/pattern.js';

async function loadBaseLeaf(
  lang: Lang,
  len: number,
  tier: FreqTier,
): Promise<WordEntry[]> {
  const mod = await BASE_LOADERS[lang][len][tier]();
  return hydrateBase(lang, tier, mod.WORDS);
}
async function loadEnrichedLeaf(
  lang: Lang,
  len: number,
  tier: number,
): Promise<readonly EnrichedEntry[]> {
  const mod = await ENRICHED_LOADERS[lang][len][tier]();
  return mod.ENTRIES;
}

function tiersFor(
  lang: Lang,
  query: { tier?: FreqTier | FreqTier[] },
): FreqTier[] {
  if (query.tier === undefined) return [...TIERS[lang]];
  const want = new Set(Array.isArray(query.tier) ? query.tier : [query.tier]);
  return TIERS[lang].filter((t) => want.has(t));
}
function lengthsFor(lang: Lang, query: WordQuery): number[] {
  const len = query.pattern ? query.pattern.length : query.length;
  if (len === undefined) return [...LENGTHS[lang]];
  return LENGTHS[lang].includes(len) ? [len] : [];
}

async function loadWords(lang: Lang, query: WordQuery): Promise<WordEntry[]> {
  const lengths = lengthsFor(lang, query);
  const tiers = tiersFor(lang, query);
  const chunks: Promise<WordEntry[]>[] = [];
  for (const len of lengths) {
    const byTier = BASE_LOADERS[lang][len];
    if (!byTier) continue;
    for (const tier of tiers) {
      if (byTier[tier]) chunks.push(loadBaseLeaf(lang, len, tier));
    }
  }
  return (await Promise.all(chunks)).flat();
}
async function loadEnriched(
  lang: Lang,
  query: WordQuery,
): Promise<EnrichedEntry[]> {
  const lengths = lengthsFor(lang, query);
  const tiers = tiersFor(lang, query);
  const chunks: Promise<readonly EnrichedEntry[]>[] = [];
  for (const len of lengths) {
    const byTier = ENRICHED_LOADERS[lang][len];
    if (!byTier) continue;
    for (const tier of tiers) {
      if (byTier[tier]) chunks.push(loadEnrichedLeaf(lang, len, tier));
    }
  }
  return (await Promise.all(chunks)).flat();
}
async function cluableIdsFor(
  lang: Lang,
  query: WordQuery,
): Promise<Set<string>> {
  const enriched = await loadEnriched(lang, query);
  return new Set(enriched.map((e) => e.id));
}

export async function getWords(
  lang: Lang,
  query: WordQuery = {},
): Promise<WordEntry[]> {
  const words = await loadWords(lang, query);
  const cluableIds = query.cluable
    ? await cluableIdsFor(lang, query)
    : undefined;
  return selectWords(words, query, cluableIds);
}

export async function getEntries(
  lang: Lang,
  query: EntryQuery = {},
): Promise<EnrichedEntry[]> {
  return selectEntries(await loadEnriched(lang, query), query);
}

export async function getWordById(
  lang: Lang,
  id: string,
): Promise<WordEntry | undefined> {
  const words = await loadWords(lang, {});
  return words.find((w) => w.id === id);
}

export async function getEntryById(
  lang: Lang,
  id: string,
): Promise<EnrichedEntry | undefined> {
  const entries = await loadEnriched(lang, {});
  return entries.find((e) => e.id === id);
}

export async function createFill(
  lang: Lang,
  query: FillQuery = {},
): Promise<Fill> {
  const base = await loadWords(lang, query);
  let pool = base;
  if (query.cluable) {
    const ids = await cluableIdsFor(lang, query);
    pool = base.filter((w) => ids.has(w.id));
  }
  return createFillFromPool(
    filterWords(pool, { tier: query.tier }),
    query.seed,
  );
}

export function getTiers(lang: Lang): FreqTier[] {
  return [...TIERS[lang]];
}
export function getLengths(lang: Lang): number[] {
  return [...LENGTHS[lang]];
}
export function wordCount(lang: Lang): number {
  return Object.values(BASE_COUNTS[lang]).reduce((a, b) => a + b, 0);
}
export function entryCount(lang: Lang): number {
  return Object.values(ENRICHED_COUNTS[lang]).reduce((a, b) => a + b, 0);
}
