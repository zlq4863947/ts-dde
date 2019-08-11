import * as path from 'path';

import { DdeClient, DdeClientData, DdeClientPoyload } from '../client';

const edge = require('edge-js');
const modelPath = path.join(path.dirname(__filename), '../../dll');

function getClientInvokerFunc(): (options: DdeClientPoyload, isRun: boolean) => any {
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
      services: ddeClient.options.services,
      callbacks: {
        OnDisconnected: (ddeData: DdeClientData) => {
          ddeClient.emit('disconnected', ddeData);
        },
        OnAdvise: (ddeData: DdeClientData) => {
          ddeClient.emit('advise', ddeData);
        },
      },
    },
    true,
  );
}
