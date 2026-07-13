#!/usr/bin/env node
// Emits manifest.ts, loaders.ts, and the per-language barrels from the len-<L>/tier-<T>
// data grid. Output here is intentionally unformatted; `npm run gen` runs
// `biome format --write` on these files as a second step, so the committed files are
// the biome-formatted version of what this writes — not hand-edited.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DATA = join('src', 'data');
const langs = ['en', 'de'];
const numFrom = (s, re) => Number((s.match(re) || [])[1]);

// Sorted [{len, tier}] leaves for a layer ('base' | 'enriched') of a lang.
function gridLeaves(lang, layer) {
  const root = join(DATA, lang, layer);
  const leaves = [];
  for (const lenDir of readdirSync(root).filter((d) => /^len-\d+$/.test(d))) {
    const len = numFrom(lenDir, /len-(\d+)/);
    for (const f of readdirSync(join(root, lenDir)).filter((f) => /^tier-\d+\.ts$/.test(f))) {
      leaves.push({ len, tier: numFrom(f, /tier-(\d+)\.ts$/) });
    }
  }
  return leaves.sort((a, b) => a.len - b.len || a.tier - b.tier);
}
const fileOf = (lang, layer, len, tier) => join(DATA, lang, layer, `len-${len}`, `tier-${tier}.ts`);
const countWords = (file) => (readFileSync(file, 'utf8').match(/^\s*'/gm) || []).length;
// Count entry-opening brace lines — works for the compact one-entry-per-line enriched
// leaves the importer writes (biome does not reformat them; see biome.json override).
const countEntries = (file) => (readFileSync(file, 'utf8').match(/^\s*\{/gm) || []).length;

const TIERS = {}, LENGTHS = {}, BASE_COUNTS = {}, ENRICHED_COUNTS = {};
const baseLoaderSections = [], enrichedLoaderSections = [];

// Emit a nested `<lang>: { <len>: { <tier>: () => import(...) } }` block.
function loaderBlock(lang, layer, leaves) {
  const byLen = new Map();
  for (const l of leaves) { if (!byLen.has(l.len)) byLen.set(l.len, []); byLen.get(l.len).push(l.tier); }
  const lenEntries = [...byLen.keys()].sort((a, b) => a - b).map((len) => {
    const tiers = byLen.get(len).sort((a, b) => a - b)
      .map((tier) => `      ${tier}: () => import('../data/${lang}/${layer}/len-${len}/tier-${tier}.js'),`)
      .join('\n');
    return `    ${len}: {\n${tiers}\n    },`;
  }).join('\n');
  return `  ${JSON.stringify(lang)}: {\n${lenEntries}\n  },`;
}

for (const lang of langs) {
  const baseLeaves = gridLeaves(lang, 'base');
  const enrLeaves = gridLeaves(lang, 'enriched');

  TIERS[lang] = [...new Set([...baseLeaves, ...enrLeaves].map((l) => l.tier))].sort((a, b) => a - b);
  LENGTHS[lang] = [...new Set([...baseLeaves, ...enrLeaves].map((l) => l.len))].sort((a, b) => a - b);

  // Aggregate to the current manifest shape: base by tier, enriched by length.
  BASE_COUNTS[lang] = {};
  for (const { len, tier } of baseLeaves)
    BASE_COUNTS[lang][tier] = (BASE_COUNTS[lang][tier] || 0) + countWords(fileOf(lang, 'base', len, tier));
  ENRICHED_COUNTS[lang] = {};
  for (const { len, tier } of enrLeaves)
    ENRICHED_COUNTS[lang][len] = (ENRICHED_COUNTS[lang][len] || 0) + countEntries(fileOf(lang, 'enriched', len, tier));

  // Per-language barrel — same BASE/ENTRIES shape as before, assembled in [len,tier] order.
  const bImports = baseLeaves.map((l) => `import { WORDS as b_${l.len}_${l.tier} } from './base/len-${l.len}/tier-${l.tier}.js';`).join('\n');
  const eImports = enrLeaves.map((l) => `import { ENTRIES as e_${l.len}_${l.tier} } from './enriched/len-${l.len}/tier-${l.tier}.js';`).join('\n');
  const baseArr = baseLeaves.map((l) => `  { tier: ${l.tier}, words: b_${l.len}_${l.tier} }`).join(',\n');
  const entriesSpread = enrLeaves.map((l) => `...e_${l.len}_${l.tier}`).join(', ');
  writeFileSync(
    join(DATA, lang, 'index.ts'),
    `import type { EnrichedEntry, FreqTier } from '../../types.js';\n${bImports}\n${eImports}\n\n` +
      `export const BASE: readonly { tier: FreqTier; words: readonly string[] }[] = [\n${baseArr},\n];\n` +
      `export const ENTRIES: readonly EnrichedEntry[] = [${entriesSpread}];\n`,
  );

  baseLoaderSections.push(loaderBlock(lang, 'base', baseLeaves));
  enrichedLoaderSections.push(loaderBlock(lang, 'enriched', enrLeaves));
}

writeFileSync(
  join('src', 'core', 'manifest.ts'),
  `import type { Lang, FreqTier } from '../types.js';\n\n` +
    `export const TIERS: Record<Lang, readonly FreqTier[]> = ${JSON.stringify(TIERS, null, 2)} as Record<Lang, readonly FreqTier[]>;\n\n` +
    `export const LENGTHS: Record<Lang, readonly number[]> = ${JSON.stringify(LENGTHS, null, 2)};\n\n` +
    `export const BASE_COUNTS: Record<Lang, Readonly<Record<number, number>>> = ${JSON.stringify(BASE_COUNTS, null, 2)};\n\n` +
    `export const ENRICHED_COUNTS: Record<Lang, Readonly<Record<number, number>>> = ${JSON.stringify(ENRICHED_COUNTS, null, 2)};\n`,
);

writeFileSync(
  join('src', 'core', 'loaders.ts'),
  `import type { EnrichedEntry, FreqTier, Lang } from '../types.js';\n\n` +
    `type BaseModule = { WORDS: readonly string[] };\n` +
    `type EnrichedModule = { ENTRIES: readonly EnrichedEntry[] };\n\n` +
    `type BaseGrid = Record<Lang, Record<number, Record<FreqTier, () => Promise<BaseModule>>>>;\n` +
    `type EnrichedGrid = Record<Lang, Record<number, Record<number, () => Promise<EnrichedModule>>>>;\n\n` +
    `/** Two-axis len×tier import() map; every path is a literal so bundlers can code-split. */\n` +
    `export const BASE_LOADERS: BaseGrid = {\n${baseLoaderSections.join('\n')}\n} as BaseGrid;\n\n` +
    `/** Two-axis len×tier import() map; every path is a literal so bundlers can code-split. */\n` +
    `export const ENRICHED_LOADERS: EnrichedGrid = {\n${enrichedLoaderSections.join('\n')}\n};\n`,
);

console.log('Generated manifest.ts, loaders.ts, and per-language barrels (grid layout).');
