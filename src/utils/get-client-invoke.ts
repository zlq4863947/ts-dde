import * as path from 'path';

import { ClientDdeData, DdeClient, DdeClientPoyload } from '../client';

const edge = require('edge-js');
const modelPath = path.join(path.dirname(__filename), '../dll');

function getClientInvokerFunc() {
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
        OnDisconnected: (ddeData: ClientDdeData) => {
          ddeClient.emit('disconnected', ddeData.service, ddeData.topic, ddeData.isDisposed, ddeData.isServerInitiated);
        },
        OnAdvise: (ddeData: ClientDdeData, cb: (func: any, task: any) => void) => {
          ddeClient.emit('advise', ddeData.service, ddeData.topic, ddeData.item, ddeData.text);
        },
      },
    },
    true,
  );
}
