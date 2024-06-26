# vite-plugin-meta-env-dts

[![NPM version](https://img.shields.io/npm/v/vite-plugin-meta-env-dts?color=a1b858&label=)](https://www.npmjs.com/package/vite-plugin-meta-env-dts)

vite-plugin-meta-env-dts for [vite](https://github.com/vitejs/vite).

## Install

```bash
npm i vite-plugin-meta-env-dts
```

```js
// vite.config.js
import metaEnvDts from 'vite-plugin-meta-env-dts'

export default defineConfig({
  plugins: [metaEnvDts({ /* options */ })],
})
```

## Options

### includes

type string | string[]

default ['.env.*']

### prefix

type string | string[]

default ['VITE_']

### dts

type string | false

default 'types/auto-meta-env.d.ts'

## License

[MIT](LICENSE) License © 2024 [XParCai](https://github.com/xparcai)
