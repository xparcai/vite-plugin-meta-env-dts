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
}

export interface ResolvedOptions {
  includes: string[]
  prefix: string[]
  dts: string | false
}
