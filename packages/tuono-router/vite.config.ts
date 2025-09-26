/// <reference types="vitest" />
/// <reference types="vite/client" />
import { defineViteConfig } from 'vite-config'
import solid from 'vite-plugin-solid'
import { defineConfig, mergeConfig } from 'vitest/config'

export default mergeConfig(
  defineConfig({
    plugins: [solid(
      // { solid: { hydratable: true }, ssr: true }
    )],
    test: {
      name: 'tuono-router',
      environment: 'happy-dom',
      globals: true,
    },
  }),
  defineViteConfig({
    entry: './src/index.ts',
  }),
)
