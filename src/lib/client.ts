import { ClientData, DdeType } from './types';
import { EventEmitter } from 'events';
import * as path from 'path';
const edge = require('edge-js');

const modelPath = path.join(path.dirname(__filename), '/../../dll');
const getInvoker = edge.func({
  source: modelPath + '/client.cs',
  references: [modelPath + '/NDde.dll'],
  typeName: 'NodeDde.Client',
  methodName: 'GetInvoker'
});

/**
 * DDE客户类
 */
export class Client extends EventEmitter {

  private _invoke: any;
  item: string;
  command = '';
  data = '';
  format = 1;
  hot = true;
  timeout = 10000;
  /**
   * 客户端构造函数
   * @param input 入力参数
   */
  constructor(input: DdeType) {
    super();
    const opts = {
      services: input,
      callbacks: {
        OnDisconnected: (dde: ClientData) => {
          this.emit('disconnected', dde.service, dde.topic, dde.isDisposed, dde.isServerInitiated);
        },
        OnAdvise: (dde: ClientData) => {
          this.emit('advise', dde.service, dde.topic, dde.item, dde.text);
        }
      }
    }
    this._invoke = getInvoker(opts, true);
  }

  connect = () => {
    this._invoke({ method: 'Connect' }, true);
  };

  disconnect = () => {
    this._invoke({ method: 'Disconnect' }, true);
  };

  pause = () => {
    this._invoke({ method: 'Pause' }, true);
  };

  resume = () => {
    this._invoke({ method: 'Resume' }, true);
  };

  execute = (command: string, timeout: number) => {
    this._invoke({
      method: 'Execute',
      command: command || this.command,
      timeout: timeout || this.timeout
    }, true);
  };

  poke = (item: string | null, data: string, timeout: number) => {
    this._invoke({
      method: 'Poke',
      item: this.item || '',
      data: data || this.data,
      timeout: timeout || this.timeout
    }, true);
  };

  request = (item: string | null, format: string, timeout: number) => {
    return this._invoke({
      method: 'Request',
      item: this.item || '',
      format: format || this.format,
      timeout: timeout || this.timeout
    }, true);
  };

  startAdvise = (item?: string[], format?: string, hot?: boolean, timeout?: number) => {
    this._invoke({
      method: 'StartAdvise',
      item: this.item || '',
      format: format || this.format,
      hot: hot || this.hot,
      timeout: timeout || this.timeout
    }, true);
  };

  stopAdvise = (item?: string[], timeout?: number) => {
    this._invoke({
      method: 'StopAdvise',
      item: this.item || '',
      timeout: timeout || this.timeout
    }, true);
  };

  beginExecute = (command: string, oncomplete: () => void) => {
    this._invoke({
      method: 'BeginExecute',
      command: command || this.command,
    }, oncomplete);
  };

  beginPoke = (item: string, data: string, format: number, oncomplete: () => void) => {
    this._invoke({
      method: 'BeginPoke',
      item: item || this.item,
      data: data || this.data,
      format: format || this.format,
    }, oncomplete);
  };

  beginRequest = (item: string, format: number, oncomplete: () => void) => {
    this._invoke({
      method: 'BeginRequest',
      item: item || this.item,
      format: format || this.format,
    }, oncomplete);
  };

  beginStartAdvise = (item: string, format: number, hot: boolean, oncomplete: () => void) => {
    this._invoke({
      method: 'BeginStartAdvise',
      item: item || this.item,
      format: format || this.format,
      hot: hot || this.hot,
    }, oncomplete);
  };

  beginStopAdvise = (item: string, oncomplete: () => void) => {
    this._invoke({
      method: 'BeginStopAdvise',
      item: item || this.item,
    }, oncomplete);
  };

  dispose = () => {
    this._invoke({ method: 'Dispose' }, true);
  };

  service = () => {
    return this._invoke({ method: 'Service' }, true);
  };

  topic = () => {
    return this._invoke({ method: 'Topic' }, true);
  };

  isConnected = () => {
    return this._invoke({ method: 'IsConnected' }, true);
  };

  isPaused = () => {
    return this._invoke({ method: 'IsPaused' }, true);
  };
}
