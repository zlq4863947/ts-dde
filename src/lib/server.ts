import { DdeData } from './types';
import { EventEmitter } from 'events';
import * as path from 'path';
const edge = require('edge-js');

const modelPath = path.join(path.dirname(__filename), '/../../dll');
console.log(modelPath + '/server.cs')
console.log(modelPath + '/NDde.dll')
const getInvoker = edge.func({
  source: modelPath + '/server.cs',
  references: [modelPath + '/NDde.dll'],
  typeName: 'NodeDde.Server',
  methodName: 'GetInvoker'
});

/**
 * DDE服务类
 */
export class Server extends EventEmitter {

  // 主题
  topic: string;
  // 数据项
  item: string;
  private _invoke: any;
  onBeforeConnect: () => true;
  onAfterConnect: (service: string, topic: string) => void;
  onDisconnect: (service: string, topic: string) => void;
  onStartAdvise: (...args: string[]) => true;
  onStopAdvise: (...args: string[]) => void;
  onExecute: (...args: string[]) => void;
  onPoke: (...args: string[]) => void;
  onRequest: (...args: string[]) => string;
  onAdvise: (...args: string[]) => string;
  /**
   * 服务端构造函数
   * @param service 服务名
   */
  constructor(service: string) {
    super();
    const opts = {
      service: service,
      callbacks: {
        OnBeforeConnect: (dde: DdeData, cb: (func: any, task: any) => void) => {
          cb(null, this.emit('before connect', dde.topic));
        },
        OnAfterConnect: (dde: DdeData) => {
          this.emit('after connect', dde.service, dde.topic);
          this.onAfterConnect(dde.service, dde.topic);
        },
        OnDisconnect: (dde: DdeData) => {
          this.emit('disconnect', dde.service, dde.topic);
          this.onDisconnect(dde.service, dde.topic);
        },
        OnStartAdvise: (dde: DdeData, cb: (func: any, task: any) => void) => {
          this.emit('start advise', dde.service, dde.topic, dde.item, dde.format);
          cb(null, this.onStartAdvise(dde.service, dde.topic, dde.item, dde.format));
        },
        OnStopAdvise: (dde: DdeData) => {
          this.emit('stop advise', dde.topic, dde.topic, dde.item);
          this.onStopAdvise(dde.topic, dde.topic, dde.item);
        },
        OnExecute: (dde: DdeData, cb: (func: any, task: any) => void) => {
          this.emit('execute', dde.service, dde.topic, dde.item);
          cb(null, this.onExecute(dde.service, dde.topic, dde.item));
        },
        OnPoke: (dde: DdeData, cb: (func: any, task: any) => void) => {
          this.emit('poke', dde.service, dde.topic, dde.item, dde.format);
          cb(null, this.onPoke(dde.service, dde.topic, dde.item, dde.format));
        },
        OnRequest: (dde: DdeData, cb: (func: any, task: any) => void) => {
          this.emit('request', dde.service, dde.topic, dde.item, dde.format);
          cb(null, this.onRequest(dde.service, dde.topic, dde.item, dde.format));
        },
        OnAdvise: (dde: DdeData, cb: (func: any, task: any) => void) => {
          this.emit('advise', dde.service, dde.topic, dde.item, dde.format);
          cb(null, this.onAdvise(dde.service, dde.topic, dde.item, dde.format));
        }
      }
    }
    this._invoke = getInvoker(opts, true);
  }

  register = () => {
    this._invoke({ method: 'Register' }, true);
  }

  unregister = () => {
    this._invoke({ method: 'Unregister' }, true);
  }

  advise = (topic: string, item: string) => {
    this._invoke({
      method: 'Advise',
      topic: topic || this.topic,
      item: item || this.item
    }, () => { });
  }

  disconnect = () => {
    this._invoke({ method: 'Disconnect' }, true);
  }

  pause = () => {
    this._invoke({ method: 'Pause' }, true);
  }

  resume = () => {
    this._invoke({ method: 'Resume' }, true);
  }

  dispose = () => {
    this._invoke({ method: 'Dispose' }, true);
  }

  service = () => {
    return this._invoke({ method: 'Service' }, true);
  };

  /**
   * 是否已注册
   */
  isRegistered = () => {
    return this._invoke({ method: 'IsRegistered' }, true);
  }
}
