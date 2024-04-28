export interface EnvOptions {
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

export interface ResolvedEnvOptions {
  includes: string[]
  prefix: string[]
  dts: string
}

export interface CssOptions {
  includes?: string | string[]
  dts?: string | false
}

export interface Options {
  /**
   * Generate dts dir
   * set false to disable all
   *
   * @default 'types'
   */
  dir?: string | false

  /**
   * Scan env file
   * set true to scan ['.env.*'] and prefix = 'VITE_'
   * set false to disable
   * set regexp to scan env file and prefix = 'VITE_'
   * set object to detailed configuration
   *
   * @default true
   */
  env?: boolean | string | string[] | EnvOptions

  css?: boolean | string | string[] | CssOptions
}

export interface ResolvedOptions {
  dir: string
  env: ResolvedEnvOptions
}
