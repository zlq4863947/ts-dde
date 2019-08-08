import { DdeServer } from '../src/server';
import { sleep } from '../src/utils';

async function main(): Promise<void> {
  const server = new DdeServer('myapp');
  const id = setInterval(function () {
    server.advise('*', '*');
  }, 1000);
  console.log('服务器信息：', server.service());
  console.log('是否已注册：', server.isRegistered());

  // 绑定断开事件
  server.on('disconnect', (service, topic) => {
    console.log('OnDisconnect: ', 'Service: ' + service, ', Topic: ' + topic);
  });
  // 绑定通知事件
  server.on('advise', (topic, item, format) => {
    console.log(
      'OnAdvise(通知事件): ',
      'Topic(主题): ' + topic,
      ', Item(数据项): ' + item,
      ', Format: ' + format
    );
  });

  let i = 0;
  server.onAdvise = () => {
    return 'advise-' + i++;
  };

  // 注册服务
  server.register();
  // 是否注册成功
  console.log('是否注册成功：', server.isRegistered());

  await sleep(8000);

  // 断开连接
  server.disconnect();
  // 注销服务
  server.unregister();
  // 释放资源
  server.dispose();

  clearInterval(id);
}

main().catch(async (e) => {
  console.error('server run error:', e.message)
  process.exit(1);
});
