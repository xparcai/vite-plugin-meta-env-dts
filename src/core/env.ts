import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import createDebugger from 'debug'
import { isKeyOfObj } from '@vtrbo/utils'
import type { ResolvedOptions } from '../types'
import { getLikeType } from './utils'
import { VITE_PLUGIN_NAME } from './constant'

const debug = createDebugger(`${VITE_PLUGIN_NAME}:env`)

export interface Env {
  remark: string
  label: string
  value: string
  likely: 'string' | 'boolean' | 'number' | string
  required: boolean
}

export function parseMetaEnv(data: string, custom: ResolvedOptions['custom']): Env[] {
  data = data.replace(/\r\n?/gm, '\n')
  const regexp = /(?:^|^)\s*((?:\s*#.+\n)*)?(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?[^#\r\n]*(#.*)?(?:$|$)/gm

  const meteEnv: Env[] = []
  let match: RegExpExecArray | null
  // eslint-disable-next-line no-cond-assign
  while ((match = regexp.exec(data)) !== null) {
    const remark = match[1] || match[4] || ''
    const label = match[2].trim()
    let value = (match[3] || '').trim()
    const quoteRegExp = /^(['"`])([\s\S]*)\1$/gm
    const isString = quoteRegExp.test(value)

    if (isString)
      value = value.replace(quoteRegExp, '$2').replace(/\\n/g, '\n').replace(/\\r/g, '\r')

    let likely = isString ? 'string' : getLikeType(value)

    if (isKeyOfObj(custom, label))
      likely = custom[label]

    const required = !['', null, undefined].includes(value)

    meteEnv.push({
      remark,
      label,
      value,
      likely,
      required,
    })
  }

  return meteEnv
}

export function writeMetaEnvDts(meteEnvMap: Map<string, Env>, options: ResolvedOptions) {
  if (options.dts !== false) {
    const canWriteMetaEnvMap: Env[] = []
    meteEnvMap.forEach((env, label) => {
      if (options.prefix.some(prefix => label.startsWith(prefix)))
        canWriteMetaEnvMap.push(env)
    })

    const envFile = resolve(options.dts)

    debug('envFile => ', envFile)

    if (!existsSync(dirname(envFile)))
      mkdirSync(dirname(envFile), { recursive: true })

    writeFileSync(
      envFile,
      setInterface(canWriteMetaEnvMap),
    )
  }
}

/**
 * write interface
 */
function setInterface(envMap: Env[]) {
  return `// Auto Generate By vite-plugin-meta-env-dts
// https://github.com/xparcai/vite-plugin-meta-env-dts
interface ImportMetaEnv {
  ${envMap.map(setDeclareLine).join('\n  ')}
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
`
}

/**
 * write declare
 */
function setDeclareLine(env: Env): string {
  return `${setRemarkLine(env)}
  readonly ${env.label}${
    env.required ? ':' : '?:'
  } ${env.likely}`.replace(/^\s+|\s+$/g, '')
}

/**
 * write remark
 */
function setRemarkLine(env: Env): string {
  if (!env.remark)
    return ''
  return `/**
   * ${env.remark
    .replace(/^\s+|\s+$/g, '')
    .replace(/\n/g, '\n   * ')
    .replace(/\#\s+/g, '') || ''}
   */`
}
