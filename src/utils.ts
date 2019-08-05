import * as path from 'path';

import { DdeData, DdeServerPoyload } from './types';

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

export function getServerInvoker(service: string): any {
  const invokerFunc = getServerInvokerFunc();
  return invokerFunc(
    {
      service,
      callbacks: {
        OnBeforeConnect: (ddeData: DdeData, cb: (func: any, task: any) => void) => {
          console.log('OnBeforeConnect:', JSON.stringify(ddeData));
          cb(null, () => true);
        },
        OnAfterConnect: (ddeData: DdeData) => {
          console.log('OnAfterConnect:', JSON.stringify(ddeData));
        },
        OnDisconnect: (ddeData: DdeData) => {
          console.log('OnDisconnect:', JSON.stringify(ddeData));
        },
        OnStartAdvise: (ddeData: DdeData, cb: (func: any, task: any) => void) => {
          console.log('OnStartAdvise:', JSON.stringify(ddeData));
          cb(null, () => true);
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
          cb(null, () => '');
        },
      },
    },
    true,
  );
}

export function getClientInvoker() {
  return edge.func({
    source: modelPath + '/client.cs',
    references: [modelPath + '/NDde.dll'],
    typeName: 'NodeDde.Client',
    methodName: 'GetInvoker',
  });
}

export async function sleep(milliseconds: number): Promise<void> {
  await new Promise<void>((resolve: Function) => {
    setTimeout(resolve, milliseconds);
  });
}
