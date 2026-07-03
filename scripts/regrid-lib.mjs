/** Group words by their length, preserving input (frequency) order within each bucket. */
export function bucketByLength(words) {
  const out = new Map();
  for (const w of words) {
    const k = w.length;
    if (!out.has(k)) out.set(k, []);
    out.get(k).push(w);
  }
  return out;
}

/** Group enriched entries by freqTier, preserving input order within each bucket. */
export function bucketByTier(entries) {
  const out = new Map();
  for (const e of entries) {
    const k = e.freqTier;
    if (!out.has(k)) out.set(k, []);
    out.get(k).push(e);
  }
  return out;
}
