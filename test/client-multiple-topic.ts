import { DdeClient } from '../src/client';
import { sleep } from '../src/utils';

async function main(): Promise<void> {
  const client = new DdeClient({
    services: {
      myapp: {
        mytopic1: ['myitem1', 'myitem2'],
        mytopic2: ['myitem1', 'まいあいてむ２']
      },
    },
  });
  let i = 0;
  const id = setInterval(() => {
    console.log('v8 thread-' + i++);
  }, 1000);

  console.log('service: ', client.service());
  console.log('topic: ', client.topic());
  console.log('isConnected: ', client.isConnected());
  console.log('isPaused: ', client.isPaused());

  client.connect();
  console.log('isConnected: ', client.isConnected());

  client.on('disconnected', (data) => {
    console.log(
      'Service: ' +
      data.service +
      ', Topic: ' +
      data.topic +
      ', IsDisposed: ' +
      data.isDisposed +
      ', IsServerInitiated: ' +
      data.isServerInitiated,
    );
  });

  client.on('advise', (data) => {
    console.log('Service: ' + data.service + ', Topic: ' + data.topic + ', Item: ' + data.item + ', Text: ' + data.text);
  });

  client.startAdvise();

  await sleep(5000);

  client.stopAdvise();
  client.dispose();
  clearInterval(id);
}

main().catch(async (e) => {
  console.error('client run error:', e.message);
  process.exit(1);
});
