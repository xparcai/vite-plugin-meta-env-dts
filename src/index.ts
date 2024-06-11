import type { PluginOption } from 'vite'
import type { Options } from './types'
import { Context } from './core/context'
import { VITE_PLUGIN_NAME } from './core/constant'

function createVitePlugin(options?: Options): PluginOption {
  const ctx = new Context(options)
  return {
    name: VITE_PLUGIN_NAME,
    enforce: 'pre',
    configResolved(config) {
      ctx.setViteConfig(config)
    },
    // 这里使用buildStart钩子是为了兼容uniapp
    buildStart() {
      ctx.scanEnv()
    },
  }
}

export default createVitePlugin
