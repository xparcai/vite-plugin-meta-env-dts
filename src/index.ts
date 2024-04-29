import type { PluginOption } from 'vite'
import type { Options } from './types'
import { Context } from './core/context'
import { VITE_PLUGIN_NAME } from './core/constant'

function createVitePlugin(options?: Options): PluginOption {
  const ctx = new Context(options)
  return {
    name: VITE_PLUGIN_NAME,
    apply: 'serve',
    enforce: 'pre',
    configResolved(config) {
      ctx.setViteConfig(config)
    },
    configureServer() {
      ctx.scanEnv()
    },
  }
}

export default createVitePlugin
