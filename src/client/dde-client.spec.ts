import { DdeClient } from './dde-client';

describe('DdeClient', () => {
  it('should start dde DdeClient', () => {
    const client = new DdeClient({
      services: {
        myapp: {
          mytopic1: ['myitem1', 'myitem2'],
        },
      },
    });
    console.log('service: ', client.service());
    console.log('topic: ', client.topic());
    console.log('isConnected: ', client.isConnected());
    console.log('isPaused: ', client.isPaused());
  });
});
