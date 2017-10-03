/**
 * DDE数据结构(三级命名)
 *
 * @interface
 */
export interface DdeData {
  /**
   * 服务
   */
  service: string,
  /**
   * 主题
   */
  topic: string,
  /**
   * 数据项
   */
  item: string,
  /**
   * 数据格式，1：CF_TEXT
   */
  format: string,
  /**
   * 数据
   */
  data: string[],

  command: string
}

/**
 * 客户端DDE数据结构(三级命名)
 *
 * @interface
 */
export interface ClientData extends DdeData {
  /**
   * 内容？
   */
  text: string,
  /**
   * 是否已被释放
   */
  isDisposed: boolean,
  /**
   * 服务端是否初始化
   */
  isServerInitiated: boolean
}

/**
 * 客户端入力参数
 *
 * @interface
 */
export interface ClientInput {
  /**
   * 服务名
   */
  [service: string]: {
    /**
     * [主题]:['数据项1', '数据项2']
     */
    [topic: string]: string[]
  }
}
