import { DdeServer } from '../server';
import { sleep } from '../utils';
import { DdeClient } from './dde-client';

describe('DdeClient', () => {
  let server: DdeServer;

  beforeAll(() => {
    server = new DdeServer('myapp');
    setInterval(function() {
      server.advise('*', '*');
      console.log('server.advise');
    }, 1000);

    console.log('服务器信息：', server.service());
    console.log('是否已注册：', server.isRegistered());

    // 注册服务
    server.register();
    // 是否注册成功
    console.log('是否注册成功：', server.isRegistered());
  });

  it('should start dde DdeClient', async () => {
    let i = 0;
    const id = setInterval(function() {
      console.log('v8 thread-' + i++);
    }, 1000);

    await sleep(1000);
    const client = new DdeClient({
      myapp: {
        mytopic1: ['myitem1', 'myitem2'],
      },
    });
    console.log('service: ', client.service());
    console.log('topic: ', client.topic());
    console.log('isConnected: ', client.isConnected());
    console.log('isPaused: ', client.isPaused());
    client.connect();
    console.log('isConnected: ', client.isConnected());

    /*client.on('disconnected', function (service, topic, isDisposed, isServerInitiated) {
      console.log('Service: ' + service
        + ', Topic: ' + topic
        + ', IsDisposed: ' + isDisposed
        + ', IsServerInitiated: ' + isServerInitiated);
    });

    client.on('advise', function (service, topic, item, text) {
      console.log('Service: ' + service
        + ', Topic: ' + topic
        + ', Item: ' + item
        + ', Text: ' + text);
    });*/

    client.startAdvise();

    await sleep(3000);

    client.stopAdvise();
    // 释放资源
    client.dispose();

    clearInterval(id);
  });
});
