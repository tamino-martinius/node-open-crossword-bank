import { BASE, ENTRIES } from './data/en/index.js';
import { hydrateBase, createLanguageApi } from './core/language-api.js';

export type {
  Lang, FreqTier, Difficulty, ClueType, Pos, Clue, WordEntry, EnrichedEntry,
  WordQuery, EntryQuery, Fill, FillQuery,
} from './types.js';
export { matchesPattern, toPattern, WILDCARD } from './core/pattern.js';

const words = BASE.flatMap((b) => hydrateBase('en', b.tier, b.words));
const api = createLanguageApi(words, ENTRIES);

export const getWords = api.getWords;
export const getEntries = api.getEntries;
export const getWordById = api.getWordById;
export const getEntryById = api.getEntryById;
export const getTiers = api.getTiers;
export const getLengths = api.getLengths;
export const wordCount = api.wordCount;
export const entryCount = api.entryCount;
export const createFill = api.createFill;
