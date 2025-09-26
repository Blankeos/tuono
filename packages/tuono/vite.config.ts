/// <reference types="vitest" />
/// <reference types="vite/client" />
import { defineViteConfig } from 'vite-config'
import solid from 'vite-plugin-solid'
import { defineConfig, mergeConfig } from 'vitest/config'

export default mergeConfig(
  defineConfig({
    /**
     * add explicit build target to avoid transpilation on class properties
     * @see https://github.com/tuono-labs/tuono/pull/607#discussion_r1983979427
     */
    build: { target: 'es2022' },
    plugins: [solid(
      // { ssr: true, solid: { hydratable: true } }
    )],

    test: {
      typecheck: {
        enabled: true,
      },
    },
  }),
  defineViteConfig({
    entry: [
      './src/index.ts',
      './src/build/index.ts',
      './src/build-client/index.ts',
      './src/config/index.ts',
      './src/ssr/index.ts',
      './src/hydration/index.tsx',
    ],
  }),
)
