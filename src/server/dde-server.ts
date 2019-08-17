import { EventEmitter } from 'events';

import { getServerInvoke } from '../utils';

export class DdeServer extends EventEmitter {
  private readonly invoke: any;

  constructor(readonly serviceName: string) {
    super();
    this.invoke = getServerInvoke(this);
  }

  onBeforeConnect = (topic: string) => true;
  onAfterConnect = (service: string, topic: string) => undefined;
  onDisconnect = (service: string, topic: string) => undefined;
  onStartAdvise = (service: string, topic: string, item: string, format: string) => true;
  onStopAdvise = (service: string, topic: string, item: string) => undefined;
  onExecute = (service: string, topic: string, command: string) => '';
  onPoke = (service: string, topic: string, item: string, data: string[], format: string) => '';
  onRequest = (service: string, topic: string, item: string, format: string) => '';
  onAdvise = (service: string, topic: string, item: string) => '';

  /**
   * 注册服务
   */
  register(): void {
    return this.invoke({ method: 'Register' }, true);
  }

  /**
   * 注销服务
   */
  unregister(): void {
    return this.invoke({ method: 'Unregister' }, true);
  }

  /**
   * 通知所有客户端指定主题名称和项目名称对的数据已更改
   */
  advise(topic: string, item: string): void {
    return this.invoke(
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
  disconnect(): void {
    return this.invoke({ method: 'Disconnect' }, true);
  }

  /**
   * 暂停连接
   */
  pause(): void {
    return this.invoke({ method: 'Pause' }, true);
  }

  /**
   * 恢复连接
   */
  resume(): void {
    return this.invoke({ method: 'Resume' }, true);
  }

  /**
   * 释放此实例持有的所有资源
   */
  dispose(): void {
    return this.invoke({ method: 'Dispose' }, true);
  }

  /**
   * 获取服务名称
   */
  service(): string {
    return this.invoke({ method: 'Service' }, true);
  }

  /**
   * 是否已注册
   */
  isRegistered(): boolean {
    return this.invoke({ method: 'IsRegistered' }, true);
  }
}
