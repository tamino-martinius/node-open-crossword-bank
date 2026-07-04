import type { Lang } from '../types.js';

/** Lower-case ascii slug for stable ids (folds ß→ss, strips diacritics). */
export function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** FNV-1a 32-bit hash → base36. Tie-breaks ids whose slug collides (HALT vs HÄLT). */
function hashWord(word: string): string {
  let h = 2166136261;
  for (let i = 0; i < word.length; i++) {
    h ^= word.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}

/** Stable, unique id: `${lang}-${slug(word)}-${hash}`. */
export function makeId(lang: Lang, word: string): string {
  return `${lang}-${slug(word)}-${hashWord(word)}`;
}
