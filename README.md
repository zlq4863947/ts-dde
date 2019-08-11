[![Build status](https://ci.appveyor.com/api/projects/status/vr93pfnk47lh9fpi?svg=true)](https://ci.appveyor.com/project/zlq4863947/ts-dde)

# ts-dde

Dynamic Data Exchange (DDE) 动态数据交换模块

此模块基于[node-dde](https://github.com/thunder9/node-dde), 将原有 edge 依赖更新至[edge-js 12.3.1](https://github.com/agracio/edge-js),并使用 typescript 重构。

## 安装

```js
npm install ts-dde --save
```

## 例子

### Client

异步监听 advise 获取 service-topic-item 三级命名结构数据。

- 单个主题：

```javascript
import { DdeClient } from 'ts-dde';

const client = new DdeClient({
  services: {
    myapp: {
      mytopic1: ['myitem1', 'myitem2'],
    },
  },
});

client.on('advise', (data) => {
  console.log('Service: ' + data.service + ', Topic: ' + data.topic + ', Item: ' + data.item + ', Text: ' + data.text);
});

client.connect();

client.startAdvise();
```

- 多个主题：

```javascript
import { DdeClient } from 'ts-dde';

const client = new DdeClient({
  services: {
    myapp: {
      mytopic1: ['myitem1', 'myitem2'],
      mytopic2: ['myitem1', 'まいあいてむ２'],
    },
  },
});

client.on('advise', (data) => {
  console.log('Service: ' + data.service + ', Topic: ' + data.topic + ', Item: ' + data.item + ', Text: ' + data.text);
});

client.connect();

client.startAdvise();
```

### Server

异步推送 advise 数据至客户端:

```javascript
import { DdeServer } from 'ts-dde';

const server = new DdeServer('myapp');

server.on('disconnect', function(service, topic) {
  console.log('OnDisconnect: ' + 'Service: ' + service + ', Topic: ' + topic);
});

server.on('advise', function(topic, item, format) {
  console.log('OnAdvise: ' + 'Topic: ' + topic + ', Item: ' + item + ', Format: ' + format);
});

let i = 0;
server.onAdvise = function() {
  return 'advise-' + i++;
};

setInterval(function() {
  server.advise('*', '*');
}, 1000);

server.register();
```

## 方法

### DdeClient

| 方法名           | 说明                                              | 使用例                                                 |
| ---------------- | ------------------------------------------------- | ------------------------------------------------------ |
| connect          | 连接服务器                                        | client.connect()                                       |
| disconnect       | 断开与服务器的连接                                | client.disconnect()                                    |
| pause            | 暂停服务                                          | client.pause()                                         |
| resume           | 恢复服务                                          | client.resume()                                        |
| execute          | 通过指定的 DDE 通道，向应用程序发送一条或一组命令 | client.execute(command, timeout)                       |
| poke             | 向应用程序发送数据                                | client.poke(item, data, timeout)                       |
| request          | 向接收应用程序查询信息,并以字符串方式返回该信息   | client.request(item, format, timeout)                  |
| startAdvise      | 循环获取数据                                      | client.startAdvise(item, format, hot, timeout)         |
| stopAdvise       | 停止接收数据                                      | client.stopAdvise(item, timeout)                       |
| beginExecute     | 开始发送命令                                      | client.beginExecute(command, oncomplete)               |
| beginPoke        | 开始发送数据                                      | client.beginPoke(item, data, format, oncomplete)       |
| beginRequest     | 开始请求数据                                      | client.beginRequest(item, format, oncomplete)          |
| beginStartAdvise | 开始监听数据                                      | client.beginStartAdvise(item, format, hot, oncomplete) |
| beginStopAdvise  | 开始停止监听                                      | client.beginStopAdvise(item, oncomplete)               |
| dispose          | 释放资源                                          | client.dispose()                                       |
| service          | 获取服务名                                        | client.service()                                       |
| topic            | 获取主题                                          | client.topic()                                         |
| isConnected      | 是否已连接                                        | client.isConnected()                                   |
| isPaused         | 是否已暂停                                        | client.isPaused()                                      |

### DdeServer

| 方法名       | 说明             | 使用例                     |
| ------------ | ---------------- | -------------------------- |
| register     | 注册服务         | server.register()          |
| unregister   | 注销服务         | server.unregister()        |
| advise       | 建立数据传输接口 | server.advise(topic, item) |
| disconnect   | 断开连接         | server.disconnect()        |
| pause        | 暂停服务         | server.pause()             |
| resume       | 恢复服务         | server.resume()            |
| dispose      | 释放资源         | server.dispose()           |
| service      | 获取服务名       | server.service()           |
| isRegistered | 是否已注册       | server.isRegistered()      |
