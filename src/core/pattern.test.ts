import { matchesPattern, toPattern, WILDCARD } from './pattern.js';

test('matchesPattern respects fixed letters and wildcards', () => {
  expect(matchesPattern('ABOUT', '?????')).toBe(true);
  expect(matchesPattern('ABOUT', 'A???T')).toBe(true);
  expect(matchesPattern('ABOUT', 'A???E')).toBe(false);
  expect(matchesPattern('ABOUT', 'A??T')).toBe(false); // length mismatch
});

test('matchesPattern is case-insensitive against uppercase words', () => {
  expect(matchesPattern('ABOUT', 'a???t')).toBe(true);
});

test('toPattern builds a wildcard string with fixed positions', () => {
  expect(toPattern(5)).toBe('?????');
  expect(toPattern(5, { 0: 'A', 4: 'T' })).toBe('A???T');
  expect(WILDCARD).toBe('?');
});

test('toPattern rejects out-of-range indices and multi-char letters', () => {
  expect(() => toPattern(3, { 5: 'A' })).toThrow();
  expect(() => toPattern(3, { 0: 'AB' })).toThrow();
});
