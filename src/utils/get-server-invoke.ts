import * as path from 'path';

import { DdeData, DdeServer, DdeServerPoyload } from '../server';

const edge = require('edge-js');
const modelPath = path.join(path.dirname(__filename), '../../dll');

function getServerInvokerFunc(): (options: DdeServerPoyload, isRun: boolean) => any {
  return edge.func({
    source: modelPath + '/server.cs',
    references: [modelPath + '/NDde.dll'],
    typeName: 'NodeDde.Server',
    methodName: 'GetInvoker',
  });
}

export function getServerInvoke(ddeServ: DdeServer): (options: DdeServerPoyload, isRun: boolean) => any {
  const invokerFunc = getServerInvokerFunc();
  return invokerFunc(
    {
      service: ddeServ.serviceName,
      callbacks: {
        OnBeforeConnect: (ddeData: DdeData, cb: (func: any, task: any) => void) => {
          ddeServ.emit('before connect', ddeData.topic);
          cb(null, ddeServ.onBeforeConnect(ddeData.topic));
        },
        OnAfterConnect: (ddeData: DdeData) => {
          ddeServ.emit('after connect', ddeData.service, ddeData.topic);
          ddeServ.onAfterConnect(ddeData.service, ddeData.topic);
        },
        OnDisconnect: (ddeData: DdeData) => {
          ddeServ.emit('disconnect', ddeData.service, ddeData.topic);
          ddeServ.onDisconnect(ddeData.service, ddeData.topic);
        },
        OnStartAdvise: (ddeData: DdeData, cb: (func: any, task: any) => void) => {
          ddeServ.emit('start advise', ddeData.service, ddeData.topic, ddeData.item, ddeData.format);
          cb(null, ddeServ.onStartAdvise(ddeData.service, ddeData.topic, ddeData.item, ddeData.format));
        },
        OnStopAdvise: (ddeData: DdeData) => {
          ddeServ.emit('stop advise', ddeData.service, ddeData.topic, ddeData.item);
          ddeServ.onStopAdvise(ddeData.service, ddeData.topic, ddeData.item);
        },
        OnExecute: (ddeData: DdeData, cb: (func: any, task: any) => void) => {
          ddeServ.emit('execute', ddeData.service, ddeData.topic, ddeData.command);
          cb(null, ddeServ.onExecute(ddeData.service, ddeData.topic, ddeData.command));
        },
        OnPoke: (ddeData: DdeData, cb: (func: any, task: any) => void) => {
          ddeServ.emit('poke', ddeData.service, ddeData.topic, ddeData.item, ddeData.data, ddeData.format);
          cb(null, ddeServ.onPoke(ddeData.service, ddeData.topic, ddeData.item, ddeData.data, ddeData.format));
        },
        OnRequest: (ddeData: DdeData, cb: (func: any, task: any) => void) => {
          ddeServ.emit('request', ddeData.service, ddeData.topic, ddeData.item, ddeData.format);
          cb(null, ddeServ.onRequest(ddeData.service, ddeData.topic, ddeData.item, ddeData.format));
        },
        OnAdvise: (ddeData: DdeData, cb: (func: any, task: any) => void) => {
          ddeServ.emit('advise', ddeData.topic, ddeData.item, ddeData.format);
          cb(null, ddeServ.onAdvise(ddeData.topic, ddeData.item, ddeData.format));
        },
      },
    },
    true,
  );
}
