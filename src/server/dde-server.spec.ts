import { sleep } from '../utils';
import { DdeServer } from './index';

describe('DdeServer', () => {
  it('should start dde server', async () => {
    const server = new DdeServer('myServ');

    console.log(server.eventNames());

    (server as any).onBeforeConnect = (a: any, b: any, c: any) => {
      console.log('onBeforeConnect-z:', a, b, c);
    };
    server.on('some_event', (a, b, c) => {
      console.log('beforeConnect-z:', a, b, c);
    });
    server.on('disconnect', (a, b, c) => {
      console.log('disconnect:', a, b, c);
    });
    server.on('beforeConnect', (a, b, c) => {
      console.log('bc:', a, b, c);
    });
    const id = setInterval(function() {
      server.advise('*', '*');
    }, 1000);

    console.log('服务器信息：', server.service());
    console.log('是否已注册：', server.isRegistered());

    // 注册服务
    server.register();
    // 是否注册成功
    console.log('是否注册成功：', server.isRegistered());

    await sleep(6000);

    // 断开连接
    server.disconnect();
    // 注销服务
    server.unregister();
    // 释放资源
    server.dispose();

    clearInterval(id);
  });
});
