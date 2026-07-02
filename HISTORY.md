# History

## vNext

- **Package created:** initial release of `open-crossword-bank`, an open, seedable bilingual (English + German) crossword word bank.
- **Async main entry** (`open-crossword-bank`): `getWords`, `getEntries`, `getWordById`, `getEntryById`, `createFill`, plus sync metadata (`getTiers`, `getLengths`, `wordCount`, `entryCount`) — lazily loads only the tier/length leaves a query touches, so bundlers (Webpack, Vite, esbuild) code-split each data module.
- **Sync per-language entries** (`open-crossword-bank/en`, `open-crossword-bank/de`): same API surface without `await` and without a `lang` parameter; eagerly loads all data for the selected language at import time.
- **~30,000 words/language base layer** (60,000 total): five frequency tiers of 6,000 words each; every `WordEntry` carries a stable id, UPPERCASE canonical word, language, and frequency tier.
- **Clued enriched subset** (6,269 EN / 6,383 DE entries, lengths 3–15): each adds part-of-speech, syllable boundaries, and 2–3 tagged clues (`definition` / `synonym` / `fill-blank`, each graded difficulty 1–5).
- **Pattern-matching query API**: `toPattern(length, fixed)` and `matchesPattern` build and test slot patterns with `?` wildcards (e.g. `?A??E`) for grid-filling.
- **Seeded, deterministic selection**: pass a numeric `seed` to `getWords` / `getEntries` / `createFill` for reproducible order; omit it for fresh randomness. Filters include `length`/`pattern`, `tier`, `cluable`, `count` (soft cap), `excludeIds`, and — for entries — `pos`, `clueType`, and `maxClueDifficulty`.
- **Backtracking grid-fill session** (`createFill`): stateful `Fill` object with `candidates(pattern)`, `place()` / `unplace()`, `placed()`, `remaining(pattern?)`, and `reset()`, with one seed captured at construction so candidate ordering stays consistent throughout a search.
- **Dual CJS + ESM build** (`dist/` + `esm/`) with full TypeScript declarations; tree-shakeable per-language sync entries.
- **Data license CC0-1.0, code license MIT.** Frequency rankings derived from [wordfreq](https://github.com/rspeer/wordfreq) (MIT); syllable boundaries computed at build time with [hypher](https://github.com/bramstein/hypher) (BSD-3-Clause); clues authored with LLM assistance and reviewed for correctness.
- **CI** (lint + test + packaged-artifact verification across Ubuntu/macOS/Windows on Node 22/24/26) and **OIDC-based tokenless npm release** with provenance.
