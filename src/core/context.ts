import { readFileSync } from 'node:fs'
import type { ResolvedConfig } from 'vite'
import fg from 'fast-glob'
import type { Options, ResolvedOptions } from '../types'
import type { Env } from './env'
import { parseMetaEnv, writeMetaEnvDts } from './env'
import { resolveOptions } from './options'

export class Context {
  options: ResolvedOptions

  config: ResolvedConfig | Record<string, any> = {}

  private _env: Map<string, Env> = new Map<Env['label'], Env>()

  constructor(rawOptions?: Options) {
    this.options = resolveOptions(rawOptions)
  }

  setViteConfig(rawConfig: ResolvedConfig) {
    this.config = rawConfig
  }

  scanEnv() {
    const { dts, includes } = this.options
    if (dts !== false) {
      const envFiles = fg.sync(
        includes,
        {
          ignore: ['**/node_modules/**'],
          onlyFiles: true,
          cwd: this.config.root,
        },
      )
      envFiles.forEach((path) => {
        const content = readFileSync(path, 'utf-8')
        const envMap = parseMetaEnv(content)
        envMap.forEach((env) => {
          this._env.set(env.label, { ...env })
        })
      })
      writeMetaEnvDts(this._env, this.options)
    }
  }
}
