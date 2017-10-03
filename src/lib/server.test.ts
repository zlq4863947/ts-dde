import { Server } from '../';
const timelineplayer = require('timelineplayer');
import * as assert from 'power-assert';

const testStart = async (done: any) => {

  const server = new Server('myapp');

  const id = setInterval(function() {
    server.advise('*', '*');
  }, 1000);

  console.log('服务器信息：', server.service());
  console.log('是否已注册：', server.isRegistered());
  assert(!server.isRegistered());
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
  assert(server.isRegistered());

  // 等待4秒
  await new Promise(resolve => setTimeout(resolve, 4000));

  // 断开连接
  server.disconnect();
  // 注销服务
  server.unregister();
  // 释放资源
  server.dispose();

  clearInterval(id);

  done();
};

describe('DDE服务端测试', () => {
  it('测试是否启动成功', function (done) {
    this.timeout(20000);
    testStart(done);
  });
});

