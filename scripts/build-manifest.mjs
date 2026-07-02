#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DATA = join('src', 'data');
const langs = ['en', 'de'];

const numOf = (file, re) => Number((file.match(re) || [])[1]);
const tierNum = (f) => numOf(f, /tier-(\d+)\.ts$/);
const lenNum = (f) => numOf(f, /len-(\d+)\.ts$/);

function listBase(lang) {
  return readdirSync(join(DATA, lang, 'base'))
    .filter((f) => /^tier-\d+\.ts$/.test(f))
    .sort((a, b) => tierNum(a) - tierNum(b));
}
function listEnriched(lang) {
  return readdirSync(join(DATA, lang, 'enriched'))
    .filter((f) => /^len-\d+\.ts$/.test(f))
    .sort((a, b) => lenNum(a) - lenNum(b));
}
const countWords = (file) => (readFileSync(file, 'utf8').match(/^\s*'/gm) || []).length;
const countEntries = (file) => (readFileSync(file, 'utf8').match(/^\s*id: '/gm) || []).length;

const TIERS = {};
const LENGTHS = {};
const BASE_COUNTS = {};
const ENRICHED_COUNTS = {};
const baseLoaderSections = [];
const enrichedLoaderSections = [];

for (const lang of langs) {
  const baseFiles = listBase(lang);
  const enrFiles = listEnriched(lang);
  TIERS[lang] = baseFiles.map(tierNum);
  LENGTHS[lang] = enrFiles.map(lenNum);
  BASE_COUNTS[lang] = {};
  ENRICHED_COUNTS[lang] = {};
  for (const f of baseFiles) BASE_COUNTS[lang][tierNum(f)] = countWords(join(DATA, lang, 'base', f));
  for (const f of enrFiles) ENRICHED_COUNTS[lang][lenNum(f)] = countEntries(join(DATA, lang, 'enriched', f));

  // Per-language barrel
  const baseImports = baseFiles
    .map((f) => `import { WORDS as t${tierNum(f)} } from './base/tier-${tierNum(f)}.js';`)
    .join('\n');
  const enrImports = enrFiles
    .map((f) => `import { ENTRIES as l${lenNum(f)} } from './enriched/len-${lenNum(f)}.js';`)
    .join('\n');
  const baseArr = baseFiles.map((f) => `  { tier: ${tierNum(f)}, words: t${tierNum(f)} }`).join(',\n');
  const entriesSpread = enrFiles.map((f) => `...l${lenNum(f)}`).join(', ');
  const barrel =
    `import type { EnrichedEntry, FreqTier } from '../../types.js';\n${baseImports}\n${enrImports}\n\n` +
    `export const BASE: readonly { tier: FreqTier; words: readonly string[] }[] = [\n${baseArr},\n];\n` +
    `export const ENTRIES: readonly EnrichedEntry[] = [${entriesSpread}];\n`;
  writeFileSync(join(DATA, lang, 'index.ts'), barrel);

  // Static loader map entries — every import() target is a literal string so
  // bundlers (Vite/webpack/esbuild) can statically analyze and code-split each
  // tier/length, unlike a runtime-computed path.
  const baseLoaderEntries = baseFiles
    .map((f) => `    ${tierNum(f)}: () => import('../data/${lang}/base/tier-${tierNum(f)}.js'),`)
    .join('\n');
  baseLoaderSections.push(`  ${JSON.stringify(lang)}: {\n${baseLoaderEntries}\n  },`);

  const enrichedLoaderEntries = enrFiles
    .map((f) => `    ${lenNum(f)}: () => import('../data/${lang}/enriched/len-${lenNum(f)}.js'),`)
    .join('\n');
  enrichedLoaderSections.push(`  ${JSON.stringify(lang)}: {\n${enrichedLoaderEntries}\n  },`);
}

const manifest =
  `import type { Lang, FreqTier } from '../types.js';\n\n` +
  `export const TIERS: Record<Lang, readonly FreqTier[]> = ${JSON.stringify(TIERS, null, 2)} as Record<Lang, readonly FreqTier[]>;\n\n` +
  `export const LENGTHS: Record<Lang, readonly number[]> = ${JSON.stringify(LENGTHS, null, 2)};\n\n` +
  `export const BASE_COUNTS: Record<Lang, Readonly<Record<number, number>>> = ${JSON.stringify(BASE_COUNTS, null, 2)};\n\n` +
  `export const ENRICHED_COUNTS: Record<Lang, Readonly<Record<number, number>>> = ${JSON.stringify(ENRICHED_COUNTS, null, 2)};\n`;
writeFileSync(join('src', 'core', 'manifest.ts'), manifest);

const loaders =
  `import type { EnrichedEntry, FreqTier, Lang } from '../types.js';\n\n` +
  `type BaseModule = { WORDS: readonly string[] };\n` +
  `type EnrichedModule = { ENTRIES: readonly EnrichedEntry[] };\n\n` +
  `/** One literal-path import() per tier — required so bundlers can code-split; see build-manifest.mjs. */\n` +
  `export const BASE_LOADERS: Record<Lang, Record<FreqTier, () => Promise<BaseModule>>> = {\n${baseLoaderSections.join('\n')}\n} as Record<Lang, Record<FreqTier, () => Promise<BaseModule>>>;\n\n` +
  `/** One literal-path import() per length — required so bundlers can code-split; see build-manifest.mjs. */\n` +
  `export const ENRICHED_LOADERS: Record<Lang, Record<number, () => Promise<EnrichedModule>>> = {\n${enrichedLoaderSections.join('\n')}\n};\n`;
writeFileSync(join('src', 'core', 'loaders.ts'), loaders);

console.log('Generated manifest.ts, loaders.ts, and per-language barrels.');
