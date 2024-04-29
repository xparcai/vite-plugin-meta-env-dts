export interface Options {
  /**
   * Scan env file regexp
   *
   * @default ['.env.*']
   */
  includes?: string | string[]

  /**
   * Prefix for env variables
   *
   * @default 'VITE_'
   */
  prefix?: string | string[]

  /**
   * dts file path
   */
  dts?: string | false

  /**
   * 自定义类型
   */
  custom?: Record<string, string>
}

export interface ResolvedOptions {
  includes: string[]
  prefix: string[]
  dts: string | false
  custom: Record<string, string>
}
