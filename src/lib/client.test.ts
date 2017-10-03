import { Client } from '../';
import * as assert from 'power-assert';
const path = require('path');
const exec = require('child_process').exec;

const mochaExec = path.join(__dirname, '..', '..', 'node_modules', '.bin', '_mocha');
const url = path.join(__dirname, '..', '..');

const testStart = async (done: any) => {
  let i = 0;
  const id = setInterval(function() { console.log('v8 thread-' + i++)}, 1000);

  await new Promise(resolve => setTimeout(resolve, 1000));
  const client = new Client({
    myapp: {
      mytopic1: ['myitem1', 'myitem2'],
      mytopic2: ['myitem1', 'まいあいてむ２']
    }
  });
  console.log('service: ', client.service());
  console.log('topic: ', client.topic());
  console.log('isConnected: ', client.isConnected());
  console.log('isPaused: ', client.isPaused());

  client.connect();
  console.log('isConnected: ', client.isConnected());

  client.on('disconnected', function (service, topic, isDisposed, isServerInitiated) {
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
  });

  client.startAdvise();

  // 等待6秒
  await new Promise(resolve => setTimeout(resolve, 3000));

  client.stopAdvise('myitem');
  client.dispose();

  done();
};

describe('DDE客户端测试', () => {

  beforeEach(function (done) {
    const cmd = `${mochaExec} dist/**/server.test.js`;
    exec(cmd, { cwd: url });
    done();
  });


  it('测试是否与服务器通信成功', function (done) {
    this.timeout(8000);
    testStart(done);
  });
});
