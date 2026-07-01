import type { WordEntry, Fill } from '../types.js';
import { mulberry32, shuffle } from './rng.js';
import { matchesPattern } from './pattern.js';

/**
 * Build a length-indexed fill session. When `seed` is omitted, one random seed is
 * captured at construction so candidate orderings stay internally consistent across
 * a backtracking search while different sessions still vary.
 */
export function createFillFromPool(words: readonly WordEntry[], seed?: number): Fill {
  const resolvedSeed = seed === undefined ? Math.floor(Math.random() * 0x100000000) : seed;
  const ordered = shuffle(words, mulberry32(resolvedSeed));
  const byLength = new Map<number, WordEntry[]>();
  for (const w of ordered) {
    const bucket = byLength.get(w.word.length);
    if (bucket) bucket.push(w);
    else byLength.set(w.word.length, [w]);
  }
  const placed = new Set<string>();

  return {
    candidates(pattern) {
      const bucket = byLength.get(pattern.length) ?? [];
      return bucket.filter((w) => !placed.has(w.word) && matchesPattern(w.word, pattern));
    },
    place(word) {
      placed.add(word);
    },
    unplace(word) {
      placed.delete(word);
    },
    placed: () => [...placed],
    remaining(pattern) {
      if (pattern === undefined) return words.length - placed.size;
      return this.candidates(pattern).length;
    },
    reset() {
      placed.clear();
    },
  };
}
