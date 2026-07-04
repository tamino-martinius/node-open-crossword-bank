export type Lang = 'en' | 'de';
/** 1 = most common … 5 = rarest of the 90k. */
export type FreqTier = 1 | 2 | 3 | 4 | 5;
/** 1 = easiest clue … 5 = hardest. */
export type Difficulty = 1 | 2 | 3 | 4 | 5;
export type ClueType = 'definition' | 'synonym' | 'fill-blank';
export type Pos = 'noun' | 'verb' | 'adjective' | 'adverb' | 'other';

export interface Clue {
  type: ClueType;
  difficulty: Difficulty;
  text: string;
}

/** Base entry — every word in the 90k carries at least this. */
export interface WordEntry {
  /** Stable unique id: `${lang}-${slug(word)}-${hash}`. */
  id: string;
  /** UPPERCASE canonical, e.g. 'BANANE'. */
  word: string;
  lang: Lang;
  freqTier: FreqTier;
}

/** Enriched entry — the clued subset. */
export interface EnrichedEntry extends WordEntry {
  /** word.length — handy for grid-fill bucketing. */
  length: number;
  pos: Pos;
  /** ['BA','NA','NE'] — syllables.join('') === word. */
  syllables: string[];
  /** 2–3 clues, mixed types, each tagged. */
  clues: Clue[];
}

export interface WordQuery {
  /** Exact word length. Omit if `pattern` is given (pattern.length wins). */
  length?: number;
  /** UPPERCASE pattern with `?` wildcards, e.g. '?A??E'. Its length is the slot length. */
  pattern?: string;
  /** Restrict to these frequency tiers. */
  tier?: FreqTier | FreqTier[];
  /** Restrict to words that have an enriched (clued) entry. */
  cluable?: boolean;
  /** Truncate after ordering. */
  count?: number;
  /** Omitted → fresh random order each call; given → deterministic. */
  seed?: number;
  excludeIds?: Iterable<string>;
}

export interface EntryQuery extends WordQuery {
  pos?: Pos;
  /** Keep entries having ≥1 clue of this type. */
  clueType?: ClueType;
  /** Keep entries having ≥1 clue at or below this difficulty. */
  maxClueDifficulty?: Difficulty;
}

/** A stateful, length-indexed grid-fill session with backtracking. */
export interface Fill {
  /** Words matching `pattern` and not yet placed, in seeded order. `[]` = a miss. */
  candidates(pattern: string): WordEntry[];
  /** Mark a word placed (descend). */
  place(word: string): void;
  /** Release a placed word (backtrack). */
  unplace(word: string): void;
  placed(): readonly string[];
  /** Count of available (unplaced) candidates; matching `pattern` if given. */
  remaining(pattern?: string): number;
  reset(): void;
}

export interface FillQuery {
  tier?: FreqTier | FreqTier[];
  cluable?: boolean;
  seed?: number;
}
