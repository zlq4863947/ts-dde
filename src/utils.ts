import * as path from 'path';

import { DdeClient } from './client';
import { DdeServer } from './server';
import { DdeData, DdeServerPoyload } from './types';
import { DdeClientPoyload } from './types/client';

const edge = require('edge-js');

const modelPath = path.join(path.dirname(__filename), '../dll');

function getServerInvokerFunc(): (options: DdeServerPoyload, isRun: boolean) => any {
  return edge.func({
    source: modelPath + '/server.cs',
    references: [modelPath + '/NDde.dll'],
    typeName: 'NodeDde.Server',
    methodName: 'GetInvoker',
  });
}

export function getServerInvoke(ddeServ: DdeServer): any {
  const invokerFunc = getServerInvokerFunc();
  return invokerFunc(
    {
      service: ddeServ.serviceName,
      callbacks: {
        OnBeforeConnect: (ddeData: DdeData, cb: (func: any, task: any) => void) => {
          console.log('OnBeforeConnect:', JSON.stringify(ddeData));
          ddeServ.emit('some_event', ddeData);
          cb(null, (ddeServ as any).onBeforeConnect(ddeData.topic));
        },
        OnAfterConnect: (ddeData: DdeData) => {
          console.log('OnAfterConnect:', JSON.stringify(ddeData));
        },
        OnDisconnect: (ddeData: DdeData) => {
          console.log('OnDisconnect:', JSON.stringify(ddeData));
        },
        OnStartAdvise: (ddeData: DdeData, cb: (func: any, task: any) => void) => {
          console.log('OnStartAdvise:', JSON.stringify(ddeData));
          cb(null, (ddeServ as any).onStartAdvise(ddeData.service, ddeData.topic, ddeData.item, ddeData.format));
          //  cb(null, () => true);
        },
        OnStopAdvise: (ddeData: DdeData) => {
          console.log('OnStopAdvise:', JSON.stringify(ddeData));
        },
        OnExecute: (ddeData: DdeData, cb: (func: any, task: any) => void) => {
          console.log('OnExecute:', JSON.stringify(ddeData));
        },
        OnPoke: (ddeData: DdeData, cb: (func: any, task: any) => void) => {
          console.log('OnPoke:', JSON.stringify(ddeData));
        },
        OnRequest: (ddeData: DdeData, cb: (func: any, task: any) => void) => {
          console.log('OnRequest:', JSON.stringify(ddeData));
          cb(null, () => '');
        },
        OnAdvise: (ddeData: DdeData, cb: (func: any, task: any) => void) => {
          console.log('OnAdvise:', JSON.stringify(ddeData));
          // cb(null, () => '');
          cb(null, (ddeServ as any).onAdvise(ddeData.topic, ddeData.item, ddeData.format));
        },
      },
    },
    true,
  );
}

export function getClientInvokerFunc() {
  return edge.func({
    source: modelPath + '/client.cs',
    references: [modelPath + '/NDde.dll'],
    typeName: 'NodeDde.Client',
    methodName: 'GetInvoker',
  });
}

export function getClientInvoke(ddeClient: DdeClient): (options: DdeClientPoyload, isRun: boolean) => any {
  const invokerFunc = getClientInvokerFunc();
  return invokerFunc(
    {
      services: ddeClient.options,
      callbacks: {
        OnDisconnected: (ddeData: ClientData) => {
          console.log('OnDisconnected:', JSON.stringify(ddeData));
        },
        OnAdvise: (ddeData: DdeData, cb: (func: any, task: any) => void) => {
          console.log('OnAdvise:', JSON.stringify(ddeData));
          cb(null, () => '');
        },
      },
    },
    true,
  );
}

export async function sleep(milliseconds: number): Promise<void> {
  await new Promise<void>((resolve: Function) => {
    setTimeout(resolve, milliseconds);
  });
}
