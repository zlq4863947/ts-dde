import { getClientInvoke } from './utils';

export interface IAsyncResult {
  [attr: string]: any;
}

export interface DdeClientOptions {
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

export class DdeClient {
  private readonly invoke: any;

  constructor(readonly options: DdeClientOptions) {
    this.invoke = getClientInvoke(this);
  }

  /**
   * 连接服务器
   */
  connect(): void {
    return this.invoke({ method: 'Connect' }, true);
  }

  /**
   * 断开与服务器的连接
   */
  disconnect(): void {
    return this.invoke({ method: 'Disconnect' }, true);
  }

  /**
   * 暂停当前的会话
   */
  pause(): void {
    return this.invoke({ method: 'Pause' }, true);
  }

  /**
   * 恢复当前的会话
   */
  resume(): void {
    return this.invoke({ method: 'Resume' }, true);
  }

  /**
   * 向服务器发送命令
   *
   * @param command 命令内容
   * @param timeout 等待响应的时间（以毫秒为单位）
   */
  execute(command: string, timeout: number): void {
    return this.invoke(
      {
        method: 'Execute',
        command: command,
        timeout: timeout,
      },
      true,
    );
  }

  /**
   * 发送数据到服务器
   *
   * @param item 项目名称
   * @param data 要发送的数据
   * @param timeout 等待响应的时间（以毫秒为单位）
   */
  poke(item: string | null, data: string, timeout: number): void {
    return this.invoke(
      {
        method: 'Poke',
        item: item || '',
        data: data,
        timeout: timeout,
      },
      true,
    );
  }

  /**
   * 请求指定项目名称的数据
   *
   * @param item 项目名称
   * @param format 要返回的数据的格式
   * @param timeout 等待响应的时间（以毫秒为单位）
   */
  request(item: string | null, format: string, timeout: number): string {
    return this.invoke(
      {
        method: 'Request',
        item: item || '',
        format: format,
        timeout: timeout,
      },
      true,
    );
  }

  /**
   * 开启指定项目名称的会话
   *
   * @param item 项目名称列表
   * @param format 返回的数据的格式
   * @param hot 是否为热连接
   * @param timeout 等待响应的时间（以毫秒为单位）
   */
  startAdvise(item?: string[], format?: string, hot?: boolean, timeout?: number): void {
    return this.invoke(
      {
        method: 'StartAdvise',
        item: item || '',
        format: format,
        hot: hot,
        timeout: timeout,
      },
      true,
    );
  }

  /**
   * 关闭指定项目名称的会话
   *
   * @param item 项目名称列表
   * @param timeout 等待响应的时间（以毫秒为单位）
   */
  stopAdvise(item?: string[], timeout?: number): void {
    return this.invoke(
      {
        method: 'StopAdvise',
        item: item,
        timeout: timeout,
      },
      true,
    );
  }

  /**
   * 向服务器发送命令的异步操作
   *
   * @param command 命令内容
   * @param oncomplete 成功后的回调
   */
  beginExecute(command: string, oncomplete: () => void): IAsyncResult {
    return this.invoke(
      {
        method: 'BeginExecute',
        command: command,
      },
      oncomplete,
    );
  }

  /**
   * 向服务器发送数据的异步操作
   *
   * @param item 项目名称
   * @param data 数据
   * @param format 数据格式
   * @param oncomplete 成功后的回调
   */
  beginPoke(item: string, data: string, format: number, oncomplete: () => void): IAsyncResult {
    return this.invoke(
      {
        method: 'BeginPoke',
        item: item,
        data: data,
        format: format,
      },
      oncomplete,
    );
  }

  /**
   * 向服务器请求数据的异步操作
   *
   * @param item 项目名称
   * @param format 数据格式
   * @param oncomplete 成功后的回调
   */
  beginRequest(item: string, format: number, oncomplete: () => void): IAsyncResult {
    return this.invoke(
      {
        method: 'BeginRequest',
        item: item,
        format: format,
      },
      oncomplete,
    );
  }

  /**
   * 开启与服务器指定项目的会话的异步操作
   *
   * @param item 项目名称
   * @param format 数据格式
   * @param hot 是否为热连接
   * @param oncomplete 成功后的回调
   */
  beginStartAdvise(item: string, format: number, hot: boolean, oncomplete: () => void): IAsyncResult {
    return this.invoke(
      {
        method: 'BeginStartAdvise',
        item: item,
        format: format,
        hot: hot,
      },
      oncomplete,
    );
  }

  /**
   * 关闭与服务器指定项目的会话的异步操作
   *
   * @param item 项目名称
   * @param oncomplete 成功后的回调
   */
  beginStopAdvise(item: string, oncomplete: () => void): IAsyncResult {
    return this.invoke(
      {
        method: 'BeginStopAdvise',
        item: item,
      },
      oncomplete,
    );
  }

  /**
   * 释放所有的的资源
   */
  dispose(): void {
    return this.invoke({ method: 'Dispose' }, true);
  }

  /**
   * 服务名称
   */
  service(): string {
    return this.invoke({ method: 'Service' }, true);
  }

  /**
   * 主题名称
   */
  topic(): string {
    return this.invoke({ method: 'Topic' }, true);
  }

  /**
   * 是否已连接
   */
  isConnected(): boolean {
    return this.invoke({ method: 'IsConnected' }, true);
  }

  /**
   * 是否已暂停
   */
  isPaused(): boolean {
    return this.invoke({ method: 'IsPaused' }, true);
  }
}
