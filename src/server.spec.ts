import { DdeServer } from './server';
import { sleep } from './utils';

describe('DdeServer', () => {
  it('should start dde server', async () => {
    const server = new DdeServer('myServ');

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
