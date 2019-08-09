import { DdeData } from '../server';

/**
 * 客户端DDE数据结构(三级命名)
 *
 * @interface
 */
export interface ClientDdeData extends DdeData {
  /**
   * 内容？
   */
  text: string;
  /**
   * 是否已被释放
   */
  isDisposed: boolean;
  /**
   * 服务端是否初始化
   */
  isServerInitiated: boolean;
}

export interface IAsyncResult {
  [attr: string]: any;
}

export interface DdeClientOptions {
  services: DdeClientPoyloadServices;
  format?: number;
  /**
   * 是否为热连接
   */
  hot?: boolean;
  /**
   * 连接超时时间(默认为10分钟)
   */
  timeout?: number;
}

export interface DdeClientPoyloadCallbacks {
  /**
   * 断开连接事件
   */
  OnDisconnected: (ddeData: ClientDdeData) => void;
  /**
   * 当客户端尝试订阅数据时调用此方法
   */
  OnAdvise: (ddeData: ClientDdeData, cb: (func: any, task: any) => void) => void;
}

/**
 * 三层构架数据结构
 *
 * @interface
 */
export interface DdeClientPoyloadServices {
  /**
   * 服务名
   */
  [service: string]: {
    /**
     * [主题]:['数据项1', '数据项2']
     */
    [topic: string]: string[];
  };
}

export interface DdeClientPoyload {
  services: DdeClientPoyloadServices;
  callbacks: DdeClientPoyloadCallbacks;
}
