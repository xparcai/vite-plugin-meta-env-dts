import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import VitePlugin from '../src'

export default defineConfig({
  plugins: [
    Inspect(),
    VitePlugin({
      dts: 'types/auto-env.dts',
    }),
  ],
})
