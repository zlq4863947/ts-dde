import { DdeClient } from '../src/client';
import { sleep } from '../src/utils';

async function main(): Promise<void> {
  let i = 0;
  const id = setInterval(function() {
    console.log('v8 thread-' + i++);
  }, 1000);

  await sleep(2000);
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

  client.on('disconnected', function(service, topic, isDisposed, isServerInitiated) {
    console.log('Service: ' + service + ', Topic: ' + topic + ', IsDisposed: ' + isDisposed + ', IsServerInitiated: ' + isServerInitiated);
  });

  client.on('advise', function(service, topic, item, text) {
    console.log('Service: ' + service + ', Topic: ' + topic + ', Item: ' + item + ', Text: ' + text);
  });

  client.startAdvise();

  await sleep(5000);

  client.stopAdvise();
  client.dispose();
}

main().catch(async (e) => {
  console.error('client run error:', e.message);
  process.exit(1);
});
