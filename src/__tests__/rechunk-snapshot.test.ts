import * as main from '../index.js';

// PRESERVED shapes — must stay byte-identical after the re-chunk.
const preserved: Array<[string, () => Promise<string[]>]> = [
  [
    'en length=5',
    async () =>
      (await main.getWords('en', { length: 5, seed: 1 })).map((w) => w.id),
  ],
  [
    'de length=7',
    async () =>
      (await main.getWords('de', { length: 7, seed: 3 })).map((w) => w.id),
  ],
  [
    'en pattern=?A??E',
    async () =>
      (await main.getWords('en', { pattern: '?A??E', seed: 1 })).map(
        (w) => w.id,
      ),
  ],
  [
    'en entries length=6',
    async () =>
      (await main.getEntries('en', { length: 6, seed: 2 })).map((e) => e.id),
  ],
  [
    'de entries tier=1',
    async () =>
      (await main.getEntries('de', { tier: 1, seed: 2 })).map((e) => e.id),
  ],
  [
    'en entries unfiltered',
    async () => (await main.getEntries('en', { seed: 9 })).map((e) => e.id),
  ],
];

for (const [name, run] of preserved) {
  test(`preserved: ${name} is stable across the re-chunk`, async () => {
    expect(await run()).toMatchSnapshot();
  });
}

// CHANGED shapes — only assert within-version determinism (same seed twice → same order).
test('changed: unfiltered getWords is deterministic within a version', async () => {
  const a = (await main.getWords('en', { seed: 4, count: 50 })).map(
    (w) => w.id,
  );
  const b = (await main.getWords('en', { seed: 4, count: 50 })).map(
    (w) => w.id,
  );
  expect(a).toEqual(b);
});

test('changed: tier-only getWords is deterministic within a version', async () => {
  const a = (await main.getWords('en', { tier: 1, seed: 5, count: 50 })).map(
    (w) => w.id,
  );
  const b = (await main.getWords('en', { tier: 1, seed: 5, count: 50 })).map(
    (w) => w.id,
  );
  expect(a).toEqual(b);
});

test('changed: createFill candidate order is deterministic within a version', async () => {
  const f1 = await main.createFill('en', { seed: 6 });
  const f2 = await main.createFill('en', { seed: 6 });
  expect(f1.candidates('?A??E').map((w) => w.word)).toEqual(
    f2.candidates('?A??E').map((w) => w.word),
  );
});
