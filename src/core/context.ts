import { readFileSync } from 'node:fs'
import type { ResolvedConfig } from 'vite'
import fg from 'fast-glob'
import type { Options, ResolvedOptions } from '../types'
import type { Env } from './env'
import { generateEnv, parseEnv } from './env'
import { resolveOptions } from './options'

export class Context {
  options: ResolvedOptions

  config: ResolvedConfig | Record<string, any> = {}

  private _env = new Map<Env['label'], Env>()

  constructor(rawOptions: Options) {
    this.options = resolveOptions(rawOptions)
  }

  setViteConfig(rawConfig: ResolvedConfig) {
    this.config = rawConfig
  }

  scanEnv() {
    const { dir, env: envOptions } = this.options
    if (dir && envOptions.dts) {
      const envFiles = fg.sync(envOptions.includes, {
        ignore: ['**/node_modules/**'],
        onlyFiles: true,
        cwd: this.config.root,
      })
      envFiles.forEach((path) => {
        const content = readFileSync(path, 'utf-8')
        const envMap = parseEnv(content)
        envMap.forEach((env) => {
          this._env.set(env.label, { ...env })
        })
      })
      generateEnv(this._env, dir, envOptions)
    }
  }
}
