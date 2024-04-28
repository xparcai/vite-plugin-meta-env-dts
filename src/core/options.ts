import { isArray, isBoolean, isString, isUndefined } from '@vtrbo/utils/fn'
import type { Options, ResolvedEnvOptions, ResolvedOptions } from '../types'
import { ENV_DTS, ENV_INCLUDES, ENV_PREFIX } from './constant'

export function resolveOptions(options: Options): ResolvedOptions {
  const {
    dir: rawDir,
    env: rawEnv,
  } = options

  const dir = isUndefined(rawDir) ? 'types' : (rawDir || '')

  let env: ResolvedEnvOptions
  if (isUndefined(rawEnv)) {
    env = {
      includes: ENV_INCLUDES,
      prefix: ENV_PREFIX,
      dts: ENV_DTS,
    }
  }
  else if (isBoolean(rawEnv)) {
    if (rawEnv) {
      env = {
        includes: ENV_INCLUDES,
        prefix: ENV_PREFIX,
        dts: ENV_DTS,
      }
    }
    else {
      env = {
        includes: [],
        prefix: [],
        dts: '',
      }
    }
  }
  else if (isArray(rawEnv)) {
    env = {
      includes: rawEnv,
      prefix: ENV_PREFIX,
      dts: ENV_DTS,
    }
  }
  else if (isString(rawEnv)) {
    if (rawEnv) {
      env = {
        includes: [rawEnv],
        prefix: ENV_PREFIX,
        dts: ENV_DTS,
      }
    }
    else {
      env = {
        includes: [],
        prefix: [],
        dts: '',
      }
    }
  }
  else {
    const {
      includes: rawIncludes,
      prefix: rawPrefix,
      dts: rawDts,
    } = rawEnv

    let includes: string[]
    if (isUndefined(rawIncludes))
      includes = ENV_INCLUDES
    else if (isString(rawIncludes))
      includes = [rawIncludes]
    else if (isArray(rawIncludes))
      includes = rawIncludes
    else
      includes = []

    let prefix: string[]
    if (isUndefined(rawPrefix))
      prefix = ENV_PREFIX
    else if (isString(rawPrefix))
      prefix = [rawPrefix]
    else if (isArray(rawPrefix))
      prefix = rawPrefix
    else
      prefix = []

    const dts = isUndefined(rawDts) ? ENV_DTS : (rawDts || '')

    env = {
      includes,
      prefix,
      dts,
    }
  }

  return {
    dir,
    env,
  }
}
