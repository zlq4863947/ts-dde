export interface DdeBaseData {
  /**
   * 服务
   */
  service: string;
  /**
   * 主题
   */
  topic: string;
  /**
   * 数据项
   */
  item: string;
}

/**
 * DDE数据结构(三级命名)
 *
 * @interface
 */
export interface DdeData extends DdeBaseData {
  /**
   * 数据格式，1：CF_TEXT
   */
  format: string;
  /**
   * 数据
   */
  data: string[];

  command: string;
}

export interface IDdeServer {
  /**
   * 客户端尝试建立会话事件
   */
  onBeforeConnect: (topic: string) => boolean;
  /**
   * 客户端成功建立会话事件
   * @param service 服务名称
   * @param topic 频道名称
   */
  onAfterConnect: (service: string, topic: string) => void;
  /**
   * 断开连接事件
   * @param service 服务名称
   * @param topic 频道名称
   */
  onDisconnect: (service: string, topic: string) => void;
  /**
   * 订阅数据事件
   * @param service 服务名称
   * @param topic 频道名称
   * @param item 项目名称
   * @param format 数据格式
   */
  onStartAdvise: (service: string, topic: string, item: string, format: string) => boolean;
  /**
   * 退订数据事件
   * @param service 服务名称
   * @param topic 频道名称
   * @param item 项目名称
   */
  onStopAdvise: (service: string, topic: string, item: string) => void;
  /**
   * 当客户端发送命令时调用此方法
   * @param service 服务名称
   * @param topic 频道名称
   * @param command 命令名称
   */
  onExecute: (service: string, topic: string, command: string) => string;
  /**
   * 当客户端发送数据时调用此方法
   * @param service 服务名称
   * @param topic 频道名称
   * @param item 项目名称
   * @param data 数据
   * @param format 数据格式
   */
  onPoke: (service: string, topic: string, item: string, data: string, format: string) => string;
  /**
   * 当客户端尝试请求数据时调用此方法
   * @param service 服务名称
   * @param topic 频道名称
   * @param item 项目名称
   * @param format 数据格式
   */
  onRequest: (service: string, topic: string, handle: string, item: string, format: string) => string;
  /**
   * 当客户端尝试订阅数据时调用此方法
   * @param topic 频道名称
   * @param item 项目名称
   * @param format 数据格式
   */
  onAdvise: (topic: string, item: string, format: string) => string;
}

export interface DdeServerPoyloadCallbacks {
  /**
   * 客户端尝试建立会话事件
   */
  OnBeforeConnect: (ddeData: DdeData, cb: (func: any, task: any) => void) => void;
  /**
   * 客户端成功建立会话事件
   */
  OnAfterConnect: (ddeData: DdeData) => void;
  /**
   * 断开连接事件
   */
  OnDisconnect: (ddeData: DdeData) => void;
  /**
   * 订阅数据事件
   */
  OnStartAdvise: (ddeData: DdeData, cb: (func: any, task: any) => void) => void;
  /**
   * 退订数据事件
   */
  OnStopAdvise: (ddeData: DdeData) => void;
  /**
   * 当客户端发送命令时调用此方法
   */
  OnExecute: (ddeData: DdeData, cb: (func: any, task: any) => void) => void;
  /**
   * 当客户端发送数据时调用此方法
   */
  OnPoke: (ddeData: DdeData, cb: (func: any, task: any) => void) => void;
  /**
   * 当客户端尝试请求数据时调用此方法
   */
  OnRequest: (ddeData: DdeData, cb: (func: any, task: any) => void) => void;
  /**
   * 当客户端尝试订阅数据时调用此方法
   */
  OnAdvise: (ddeData: DdeData, cb: (func: any, task: any) => void) => void;
}

export interface DdeServerPoyload {
  service: string;
  callbacks: DdeServerPoyloadCallbacks;
}
