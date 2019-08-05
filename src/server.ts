import { EventEmitter } from 'events';

import { getServerInvoker } from './utils';

export class DdeServer {
  private readonly invoker: any;

  constructor(service: string) {
    this.invoker = getServerInvoker(service);
  }

  /**
   * 注册服务
   */
  register() {
    return this.invoker({ method: 'Register' }, true);
  }

  /**
   * 注销服务
   */
  unregister() {
    return this.invoker({ method: 'Unregister' }, true);
  }

  /**
   * 通知所有客户端指定主题名称和项目名称对的数据已更改
   */
  advise(topic: string, item: string) {
    return this.invoker(
      {
        method: 'Advise',
        topic,
        item,
      },
      () => undefined,
    );
  }

  /**
   * 断开连接
   */
  disconnect() {
    return this.invoker({ method: 'Disconnect' }, true);
  }

  /**
   * 暂停连接
   */
  pause() {
    return this.invoker({ method: 'Pause' }, true);
  }

  /**
   * 恢复连接
   */
  resume() {
    return this.invoker({ method: 'Resume' }, true);
  }

  /**
   * 释放此实例持有的所有资源
   */
  dispose() {
    return this.invoker({ method: 'Dispose' }, true);
  }

  /**
   * 获取服务名称
   */
  service(): string {
    return this.invoker({ method: 'Service' }, true);
  }

  /**
   * 是否已注册
   */
  isRegistered(): boolean {
    return this.invoker({ method: 'IsRegistered' }, true);
  }
}
