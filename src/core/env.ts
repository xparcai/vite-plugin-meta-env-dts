import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import type { ResolvedEnvOptions } from '../types'
import { getLikeType } from './utils'

export interface Env {
  remark: string
  label: string
  value: string
  likely: 'string' | 'boolean' | 'number'
  required: boolean
}

export function parseEnv(data: string): Env[] {
  data = data.replace(/\r\n?/gm, '\n')
  const regexp = /(?:^|^)\s*((?:\s*#.+\n)*)?(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?[^#\r\n]*(#.*)?(?:$|$)/gm

  const env: Env[] = []
  let match: RegExpExecArray | null
  // eslint-disable-next-line no-cond-assign
  while ((match = regexp.exec(data)) !== null) {
    // 注释
    const remark = match[1] || match[4] || ''

    // 变量名
    const label = match[2].trim()

    // 变量值
    let value = (match[3] || '').trim()

    // 引号开头
    const quoteRegExp = /^(['"`])([\s\S]*)\1$/gm
    const isString = quoteRegExp.test(value)

    if (isString)
      value = value.replace(quoteRegExp, '$2').replace(/\\n/g, '\n').replace(/\\r/g, '\r')

    const required = !['', null, undefined].includes(value)

    env.push({
      remark,
      label,
      value,
      likely: isString ? 'string' : getLikeType(value),
      required,
    })
  }

  return env
}

export function generateEnv(envMap: Map<Env['label'], Env>, root: string, envOptions: ResolvedEnvOptions) {
  const generateEnvMap: Env[] = []
  envMap.forEach((env, label) => {
    if (envOptions.prefix.some(prefix => label.startsWith(prefix)))
      generateEnvMap.push(env)
  })
  const envFile = resolve(root, envOptions.dts)

  if (!existsSync(dirname(envFile)))
    mkdirSync(dirname(envFile), { recursive: true })

  writeFileSync(
    envFile,
    generateInterface(generateEnvMap),
  )
}

function generateInterface(envMap: Env[]) {
  return `// Auto Generate By vite-plugin-meta-env-dts
// https://github.com/xparcai/vite-plugin-meta-env-dts
interface ImportMetaEnv {
  ${envMap.map(generateDeclareLine).join('\n  ')}
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
`
}

function generateDeclareLine(env: Env): string {
  return `${generateRemarkLine(env)}
  readonly ${env.label}${
    env.required ? ':' : '?:'
  } ${env.likely}`.replace(/^\s+|\s+$/g, '')
}

function generateRemarkLine(env: Env): string {
  if (!env.remark)
    return ''
  return `/**
   * ${env.remark
    .replace(/^\s+|\s+$/g, '')
    .replace(/\n/g, '\n   * ')
    .replace(/\#\s+/g, '') || ''}
   */`
}
