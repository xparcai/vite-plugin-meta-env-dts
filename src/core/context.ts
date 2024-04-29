import { readFileSync } from 'node:fs'
import type { ResolvedConfig } from 'vite'
import fg from 'fast-glob'
import createDebugger from 'debug'
import type { Options, ResolvedOptions } from '../types'
import type { Env } from './env'
import { parseMetaEnv, writeMetaEnvDts } from './env'
import { resolveOptions } from './options'
import { VITE_PLUGIN_NAME } from './constant'

const debug = createDebugger(`${VITE_PLUGIN_NAME}:context`)

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
    const { dts, includes, custom } = this.options
    if (dts !== false) {
      const envFiles = fg.sync(
        includes,
        {
          ignore: ['**/node_modules/**'],
          onlyFiles: true,
          cwd: this.config.root,
        },
      )

      debug('envFiles => ', envFiles)

      envFiles.forEach((path) => {
        const content = readFileSync(path, 'utf-8')
        const envMap = parseMetaEnv(content, custom)
        envMap.forEach((env) => {
          this._env.set(env.label, { ...env })
        })
      })

      debug('envMap => ', this._env)

      writeMetaEnvDts(this._env, this.options)
    }
  }
}
