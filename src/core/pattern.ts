export const WILDCARD = '?';

/** True if `word` matches `pattern` (same length; each non-wildcard index equal, case-insensitive). */
export function matchesPattern(word: string, pattern: string): boolean {
  if (word.length !== pattern.length) return false;
  const w = word.toUpperCase();
  const p = pattern.toUpperCase();
  for (let i = 0; i < p.length; i++) {
    if (p[i] !== WILDCARD && p[i] !== w[i]) return false;
  }
  return true;
}

/** Build a pattern of `length` wildcards with `fixed` letters placed by index. */
export function toPattern(
  length: number,
  fixed: Record<number, string> = {},
): string {
  const out = Array.from({ length }, () => WILDCARD);
  for (const [k, v] of Object.entries(fixed)) {
    const i = Number(k);
    if (!Number.isInteger(i) || i < 0 || i >= length) {
      throw new Error(
        `toPattern: index ${k} out of range for length ${length}`,
      );
    }
    if (typeof v !== 'string' || v.length !== 1) {
      throw new Error(
        `toPattern: fixed[${k}] must be a single character, got ${JSON.stringify(v)}`,
      );
    }
    out[i] = v.toUpperCase();
  }
  return out.join('');
}
