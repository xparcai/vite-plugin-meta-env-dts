import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/*.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  onSuccess: 'npm run build:fix',
})
