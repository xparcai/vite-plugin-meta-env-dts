import { toArray } from '@vtrbo/utils'
import type { Options, ResolvedOptions } from '../types'
import { ENV_DTS, ENV_INCLUDES, ENV_PREFIX } from './constant'

export function resolveOptions(options?: Options): ResolvedOptions {
  return {
    includes: options?.includes ? toArray(options.includes) : ENV_INCLUDES,
    prefix: options?.prefix ? toArray(options.prefix) : ENV_PREFIX,
    dts: options?.dts ?? ENV_DTS,
  }
}
