import { defineConfig } from 'vitest/config';

// The source dynamically imports data chunks with a runtime-correct `.js`
// specifier (e.g. `./data/${lang}/base/tier-${tier}.js`), but at test time the
// files are still `.ts`. Vite resolves `.js`->`.ts` for static imports, but its
// variable-dynamic-import globber matches the literal `.js` extension and finds
// no files. Rewrite the extension to `.ts` in these `./data/` dynamic-import
// templates so the glob resolves — the Vitest equivalent of Jest's
// moduleNameMapper (`^(\.{1,2}/.*)\.js$` -> `$1`).
const resolveTsDataImports = {
  name: 'resolve-ts-data-imports',
  enforce: 'pre' as const,
  transform(code: string) {
    if (!code.includes('import(`./data/')) return null;
    return code.replace(/(import\(`\.\/data\/[^`]*)\.js`\)/g, '$1.ts`)');
  },
};

export default defineConfig({
  plugins: [resolveTsDataImports],
  test: {
    globals: true,
    include: ['src/**/*.{test,spec}.ts'],
    // Several integration tests load an entire enriched pool (~18k entries) and
    // transform every `.ts` data chunk on the fly. That's ~1.5-2s locally but
    // can exceed the 5s default on cold/slow CI runners (macOS in particular).
    // Bounding snapshot output with `count` doesn't help — the load is the cost.
    // Give data-loading tests headroom while still catching a genuine hang.
    testTimeout: 30000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.{test,spec}.ts', 'src/**/__tests__/**', 'src/data/**'],
    },
  },
});
