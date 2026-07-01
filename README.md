# open-crossword-bank

[![CI](https://github.com/tamino-martinius/node-open-crossword-bank/actions/workflows/ci.yml/badge.svg)](https://github.com/tamino-martinius/node-open-crossword-bank/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/open-crossword-bank)](https://www.npmjs.com/package/open-crossword-bank)

Open, seedable bilingual (English + German) crossword word bank with a pattern-matching query API and backtracking grid-fill session.

- **~30,000 words/language** base layer (five frequency tiers) plus **~6,269 EN / ~6,383 DE** clued enriched entries (syllables, part-of-speech, tagged clues)
- **Seeded, deterministic** selection — same seed always returns the same words in the same order
- **Pattern matching** for grid slots — `'?A??E'` returns every word that fits that slot
- **Backtracking `createFill`** — stateful session with `candidates` / `place` / `unplace` for recursive grid-solvers
- **Dual CJS + ESM** build; tree-shakeable per-language sync entries
- **Code license:** MIT — **Data license:** CC0-1.0

## Licensing and provenance

| Asset | License |
|-------|---------|
| Source code (`src/`, `dist/`, `esm/`) | MIT |
| Word and clue data (`src/data/`) | CC0-1.0 |

Word frequency rankings are derived from [wordfreq](https://github.com/rspeer/wordfreq) (MIT). Syllable boundaries were computed at build time using [hypher](https://github.com/bramstein/hypher) (BSD-3-Clause); the patterns themselves are not shipped in the package. Clue texts were authored with LLM assistance and reviewed for correctness — no third-party share-alike or copyrighted content was used, so the CC0 dedication is clean.

## Install

```bash
npm install open-crossword-bank
```

Requires Node.js >= 22.

## Quick start

### Async main entry

The default entry (`open-crossword-bank`) lazy-loads only the tier or length leaves a query touches, which lets bundlers (Webpack, Vite, esbuild) code-split each data module automatically.

```ts
import { getWords, getEntries, createFill, toPattern, wordCount, entryCount, getTiers, getLengths } from 'open-crossword-bank';

// Five-letter English words matching ?A??E, seeded for reproducibility
const words = await getWords('en', { pattern: toPattern(5, { 1: 'A', 4: 'E' }), count: 10, seed: 42 });
console.log(words.map((w) => w.word)); // e.g. ['BASTE', 'CARVE', ...]

// German enriched entries with definition clues, length 6, seeded
const clued = await getEntries('de', { length: 6, clueType: 'definition', count: 5, seed: 7 });
console.log(clued[0].clues[0].text);

// Synchronous metadata (no await needed)
console.log(wordCount('en'));    // 30000
console.log(entryCount('de'));   // 6383
```

### Sync per-language entry

The `/en` and `/de` sub-entries bundle all data for that language at import time and expose the same API without `await` and without a `lang` parameter. Prefer these for server-side usage or when you always need one language.

```ts
import { getWords as enWords } from 'open-crossword-bank/en';

// No await — all words are already in memory
const three = enWords({ length: 3, seed: 1 });
console.log(three.map((w) => w.word));
```

```ts
import { getWords } from 'open-crossword-bank/de';

const words = getWords({ tier: [1, 2], count: 20, seed: 99 });
```

## Grid-filling with `createFill`

`createFill` builds a stateful fill session pre-loaded with every word in the bank (optionally filtered by tier or cluability). Use it as the word pool inside a backtracking grid-solver.

```ts
import { createFill, toPattern } from 'open-crossword-bank';

const fill = await createFill('en', { seed: 42 });

function solve(slots: string[]): string[] | null {
  if (slots.length === 0) return fill.placed();

  const [slot, ...rest] = slots;
  for (const word of fill.candidates(slot)) {
    fill.place(word.word);
    const result = solve(rest);
    if (result) return result;
    fill.unplace(word.word);
  }
  return null;
}

// Attempt to fill a 3×3 grid
const slots = [
  toPattern(5, {}),          // any 5-letter word for an across slot
  toPattern(5, { 0: 'C' }), // a 5-letter word starting with C (intersects above)
];
const solution = solve(slots);
console.log(solution ?? 'no solution found');

// Inspect fill state
console.log(fill.placed());           // words committed so far
console.log(fill.remaining());        // total unplaced words
console.log(fill.remaining('?A??E')); // unplaced candidates for this pattern
fill.reset();                         // clear all placed words, keep the seeded order
```

Sync per-language entries expose the same `createFill` synchronously:

```ts
import { createFill } from 'open-crossword-bank/en';

const fill = createFill({ tier: [1, 2], seed: 7 });
const hits = fill.candidates('?A??E');
```

## Seed / determinism contract

- When `seed` is provided to `getWords`, `getEntries`, or `createFill`, the selection order is fully deterministic — the same seed always returns the same results.
- When `seed` is omitted, a fresh random order is used each call. For `createFill`, one random seed is captured at construction time so candidate orderings stay internally consistent throughout a backtracking search, while different sessions still vary.
- `count` is a soft cap: you may receive fewer results if the filtered pool is smaller than `count`.

## API reference

### Main entry (`open-crossword-bank`) — async

| Function | Signature | Returns |
|----------|-----------|---------|
| `getWords` | `(lang: Lang, query?: WordQuery) => Promise<WordEntry[]>` | Filtered + seeded word selection |
| `getEntries` | `(lang: Lang, query?: EntryQuery) => Promise<EnrichedEntry[]>` | Filtered + seeded enriched entries |
| `getWordById` | `(lang: Lang, id: string) => Promise<WordEntry \| undefined>` | Single word by stable ID |
| `getEntryById` | `(lang: Lang, id: string) => Promise<EnrichedEntry \| undefined>` | Single enriched entry by stable ID |
| `createFill` | `(lang: Lang, query?: FillQuery) => Promise<Fill>` | Backtracking fill session |
| `getTiers` | `(lang: Lang) => FreqTier[]` | Available frequency tiers (sync) |
| `getLengths` | `(lang: Lang) => number[]` | Enriched entry lengths available (sync) |
| `wordCount` | `(lang: Lang) => number` | Total words in base layer (sync) |
| `entryCount` | `(lang: Lang) => number` | Total enriched entries (sync) |

### Per-language entries (`open-crossword-bank/en`, `open-crossword-bank/de`) — sync

Same function names, all synchronous; no `lang` parameter.

| Function | Signature | Returns |
|----------|-----------|---------|
| `getWords` | `(query?: WordQuery) => WordEntry[]` | Filtered + seeded word selection |
| `getEntries` | `(query?: EntryQuery) => EnrichedEntry[]` | Filtered + seeded enriched entries |
| `getWordById` | `(id: string) => WordEntry \| undefined` | Single word by stable ID |
| `getEntryById` | `(id: string) => EnrichedEntry \| undefined` | Single enriched entry by stable ID |
| `createFill` | `(query?: FillQuery) => Fill` | Backtracking fill session |
| `getTiers` | `() => FreqTier[]` | Available frequency tiers |
| `getLengths` | `() => number[]` | Enriched entry lengths available |
| `wordCount` | `() => number` | Total words in base layer |
| `entryCount` | `() => number` | Total enriched entries |

### `matchesPattern` / `toPattern` / `WILDCARD`

```ts
import { matchesPattern, toPattern, WILDCARD } from 'open-crossword-bank';

// WILDCARD is '?'
const pattern = toPattern(5, { 0: 'S', 4: 'M' }); // 'S???M'
matchesPattern('STORM', pattern); // true
matchesPattern('STARK', pattern); // false
```

| Export | Signature | Description |
|--------|-----------|-------------|
| `WILDCARD` | `'?'` | The wildcard character used in patterns |
| `toPattern` | `(length: number, fixed?: Record<number, string>) => string` | Build a pattern from a length + fixed letter map |
| `matchesPattern` | `(word: string, pattern: string) => boolean` | Test a word against a pattern (case-insensitive) |

### Query types

#### `WordQuery`

```ts
interface WordQuery {
  /** Exact word length. Omit if `pattern` is given (pattern.length wins). */
  length?: number;
  /** UPPERCASE pattern with '?' wildcards, e.g. '?A??E'. Its length is the slot length. */
  pattern?: string;
  /** Restrict to these frequency tiers (1 = most common … 5 = rarest). */
  tier?: FreqTier | FreqTier[];
  /** Restrict to words that have an enriched (clued) entry. */
  cluable?: boolean;
  /** Truncate results after ordering. Soft cap — may be fewer if the pool is smaller. */
  count?: number;
  /** Omitted → fresh random order each call; given → deterministic. */
  seed?: number;
  excludeIds?: Iterable<string>;
}
```

#### `EntryQuery` (extends `WordQuery`)

```ts
interface EntryQuery extends WordQuery {
  pos?: Pos;
  /** Keep entries having at least one clue of this type. */
  clueType?: ClueType;
  /** Keep entries having at least one clue at or below this difficulty. */
  maxClueDifficulty?: Difficulty;
}
```

#### `FillQuery`

```ts
interface FillQuery {
  tier?: FreqTier | FreqTier[];
  cluable?: boolean;
  seed?: number;
}
```

### `Fill`

```ts
interface Fill {
  /** Words matching `pattern` and not yet placed, in seeded order. Empty array means no candidates. */
  candidates(pattern: string): WordEntry[];
  /** Mark a word as placed (descend in backtracking). */
  place(word: string): void;
  /** Release a placed word (backtrack). */
  unplace(word: string): void;
  /** All currently placed words. */
  placed(): readonly string[];
  /** Count of available (unplaced) candidates; matching `pattern` if given. */
  remaining(pattern?: string): number;
  /** Clear all placed words, keeping the seeded candidate order. */
  reset(): void;
}
```

## Data shape

### `WordEntry` — base layer (every word)

```ts
interface WordEntry {
  /** Stable unique id: `${lang}-${slug(word)}-${hash}`. */
  id: string;
  /** Uppercase canonical form, e.g. 'STORM'. */
  word: string;
  lang: Lang;
  /** 1 = most common … 5 = rarest of the 30k. */
  freqTier: FreqTier;
}
```

### `EnrichedEntry` — clued subset

```ts
interface EnrichedEntry extends WordEntry {
  /** word.length — handy for grid-fill bucketing. */
  length: number;
  pos: Pos;
  /** Syllables in uppercase; syllables.join('') === word. */
  syllables: string[];
  /** 2–3 clues, mixed types, each tagged with type and difficulty. */
  clues: Clue[];
}

interface Clue {
  type: ClueType;       // 'definition' | 'synonym' | 'fill-blank'
  difficulty: Difficulty; // 1 (easiest) … 5 (hardest)
  text: string;
}
```

#### Example

```json
{
  "id": "en-storm-sxzzsm",
  "word": "STORM",
  "lang": "en",
  "freqTier": 1,
  "length": 5,
  "pos": "noun",
  "syllables": ["STORM"],
  "clues": [
    { "type": "definition", "difficulty": 1, "text": "Violent weather with strong winds and heavy rain" },
    { "type": "synonym",    "difficulty": 3, "text": "Tempest" },
    { "type": "fill-blank", "difficulty": 2, "text": "Sailors secured the ship before the _____ hit." }
  ]
}
```

### Type overview

```ts
type Lang        = 'en' | 'de';
type FreqTier    = 1 | 2 | 3 | 4 | 5;  // 1 = most common
type Difficulty  = 1 | 2 | 3 | 4 | 5;  // 1 = easiest
type ClueType    = 'definition' | 'synonym' | 'fill-blank';
type Pos         = 'noun' | 'verb' | 'adjective' | 'adverb' | 'other';
```

## Bundler code-splitting note

The main entry (`open-crossword-bank`) uses dynamic `import('./data/${lang}/base/tier-${tier}.js')` and `import('./data/${lang}/enriched/len-${len}.js')` expressions with static path prefixes. Bundlers that analyse static import patterns (Webpack, Vite, esbuild) will code-split each tier and length leaf into its own chunk automatically. A query scoped to one tier or a narrow length range loads only those chunks.

The per-language entries (`/en`, `/de`) eagerly import everything for that language; prefer them for server-side usage where startup cost is acceptable and you want the simpler sync API.

## Contributing

Word and clue data is generated with AI assistance and validated programmatically. To regenerate:

1. Edit or add generation scripts (see `scripts/`).
2. Rebuild the data files and manifest: `npm run gen`
3. Run the full test suite (includes data-integrity checks): `npm test`

The data-integrity suite enforces: unique IDs, required fields, valid frequency tiers, and clue structure.
