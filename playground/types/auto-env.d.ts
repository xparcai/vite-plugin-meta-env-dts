// Auto Generate By vite-plugin-meta-env-dts
// https://github.com/xparcai/vite-plugin-meta-env-dts
interface ImportMetaEnv {
  /**
   * 项目信息
   */
  readonly VITE_PROJECT_NAME: string
  readonly VITE_NAME: string
  /**
   * 版本
   * 我是两行的注释
   */
  readonly VITE_VERSION: number
  /**
   * 测试一下很多个空格
   */
  readonly VITE_GE: string
  readonly VITE_OBJECT: string
  readonly VITE_ARRAY: number
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
